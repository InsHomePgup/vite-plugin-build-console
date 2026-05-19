import type { Options as BoxenOptions } from 'boxen'
import type { Plugin, ResolvedConfig } from 'vite'
import * as fs from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import AdmZip from 'adm-zip'
import boxen from 'boxen'
import { formatBytes } from 'bytes-formatter'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration.js'
import getFolderSize from 'get-folder-size'
import gradient from 'gradient-string'
import packageJson from '../package.json'

const root = process.cwd()
dayjs.extend(duration)

const boxenOptions: BoxenOptions = {
  padding: 0.5,
  borderColor: 'cyan',
  borderStyle: 'round',
}

const pluginVersion = packageJson.version

// Vite always injects these keys into config.env regardless of .env files
const VITE_BUILT_IN_ENV_KEYS = new Set(['MODE', 'BASE_URL', 'DEV', 'PROD', 'SSR'])

export async function calcFolderSize({ dirPath }: { dirPath: string }): Promise<string> {
  const result = await getFolderSize.loose(dirPath)
  return formatBytes(result)
}

export function packFolder({
  dirPath,
  packPre,
  version,
  projectName,
  outDirPath = '.',
  packFullName,
}: {
  dirPath: string
  packPre?: string
  version?: string
  projectName?: string
  outDirPath?: string
  packFullName?: string
}): void {
  const sourcePath = resolve(root, dirPath)
  let packName: string
  if (packFullName) {
    packName = packFullName
  }
  else if (packPre) {
    packName = `${packPre}-${projectName}-${version}.zip`
  }
  else {
    packName = `${projectName}-${version}.zip`
  }
  try {
    const zip = new AdmZip()
    zip.addLocalFolder(sourcePath)
    zip.writeZip(resolve(root, outDirPath, packName))
  }
  catch (error) {
    console.error('pack fail', error)
  }
}

export interface BuildConsoleOptions {
  envString?: string[]
  showPluginVersion?: boolean
  zipDir?: string // directory to write the ZIP file, defaults to project root
}

export function consoleBuildInfo(options: BuildConsoleOptions = {}): Plugin {
  let config: ResolvedConfig
  let startTime: number
  let outDir: string
  const showPluginVersion = options.showPluginVersion === true

  return {
    name: 'vite-plugin-build-console',
    configResolved(resolvedConfig: ResolvedConfig) {
      config = resolvedConfig
      outDir = config.build.outDir || 'dist'
    },
    buildStart() {
      if (config.command === 'build') {
        startTime = Date.now()
      }
    },
    async closeBundle() {
      if (config.command !== 'build') {
        return
      }
      const elapsed = dayjs.duration(Date.now() - startTime).format('mm分ss秒')
      const size = await calcFolderSize({ dirPath: outDir })

      const envVars = config.env || {}
      const envVarsToShow = options.envString
        ? Object.fromEntries(
            Object.entries(envVars).filter(([key]) => options.envString!.includes(key)),
          )
        : Object.fromEntries(
            Object.entries(envVars).filter(([key]) => !VITE_BUILT_IN_ENV_KEYS.has(key)),
          )

      const outInfo = `
        🚀 构建信息摘要
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        ✅ 构建状态: 成功完成
        ⏱️ 构建用时: ${elapsed}
        📦 包体积: ${size}
        📂 输出目录: ${outDir}
        ${showPluginVersion ? `🔌 插件版本: ${pluginVersion}\n` : ''}
        🌐 环境变量:
${Object.entries(envVarsToShow).map(([key, value]) => `        • ${key}: ${value}`).join('\n')}
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `
      console.info(
        boxen(gradient(['cyan', 'magenta']).multiline(outInfo), boxenOptions),
      )

      try {
        const pkgPath = resolve(root, 'package.json')
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
        packFolder({
          dirPath: outDir,
          projectName: pkg.name,
          version: pkg.version,
          outDirPath: options.zipDir ?? '.',
        })
      }
      catch (error) {
        console.error('读取 package.json 失败，使用默认文件名', error)
        packFolder({
          dirPath: outDir,
          packFullName: 'dist.zip',
          outDirPath: options.zipDir ?? '.',
        })
      }
    },
  }
}
