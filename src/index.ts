import type { Options as BoxenOptions } from 'boxen'
import type { Dayjs } from 'dayjs'
import type { ResolvedConfig } from 'vite'
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
// 直接导入package.json
import packageJson from '../package.json'

const root = process.cwd()
const zip = new AdmZip()
dayjs.extend(duration)
const boxenOptions: BoxenOptions = {
  padding: 0.5,
  borderColor: 'cyan',
  borderStyle: 'round',
}

// 获取插件版本号
const pluginVersion = packageJson.version || '未知版本'

export async function calcFolderSize({ dirPath }: { dirPath: string }): Promise<string> {
  /** 计算指定文件夹大小并格式化成MB等单位 */
  return new Promise((resolve) => {
    getFolderSize.loose(dirPath).then((result) => {
      resolve(formatBytes(result))
    })
  })
}

export function packFolder({ dirPath, packPre, version, projectName, outDirPath = 'dist', packFullName }: { dirPath: string, packPre?: string, version?: string, projectName?: string, outDirPath?: string, packFullName?: string }): void {
  // pack 文件夹
  const sourcePath: string = resolve(root, dirPath)
  let packName: string = ''
  if (packFullName) {
    packName = packFullName
  }
  else {
    if (packPre) {
      packName = `${packPre}-${projectName}-${version}.zip`
    }
    else {
      packName = `${projectName}-${version}.zip`
    }
  }
  // const packName = packFullName ? `${packFullName}.zip` : `${packPre}-${projectName}-${version}.zip`
  zip.addLocalFolder(sourcePath)
  zip.writeZip(resolve(root, outDirPath, packName), (error) => {
    if (error) {
      console.error('pack fail', error)
    }
  })
}

export interface BuildConsoleOptions {
  envString?: string[] // 用户指定需要输出的环境变量名列表
  showPluginVersion?: boolean // 是否显示插件版本号，默认false
}

export function consoleBuildInfo(options: BuildConsoleOptions = {}): any {
//   打包完成后输出构建信息
  let config: ResolvedConfig
  let startTime: Dayjs
  let endTime: Dayjs
  let outDir: string
  // 是否显示插件版本号，默认为false
  const showPluginVersion = options.showPluginVersion === true

  return {
    name: 'vite-plugin-build-console',
    configResolved(resolvedConfig: any) {
      config = resolvedConfig
      outDir = config.build.outDir || 'dist'
    },
    buildStart() {
      if (config.command === 'build') {
        startTime = dayjs(new Date())
      }
    },
    closeBundle() {
      if (config.command === 'build') {
        endTime = dayjs(new Date())
        calcFolderSize({ dirPath: outDir }).then((size) => {
          // 只获取Vite配置中的环境变量，这些变量来自.env文件
          const envVars = config.env || {}

          // 如果用户指定了需要输出的环境变量，则只输出这些变量
          // 否则输出所有.env中的环境变量
          const envVarsToShow = options.envString
            ? Object.fromEntries(
                Object.entries(envVars)
                  .filter(([key]) => options.envString!.includes(key)),
              )
            : envVars

          const outInfo = `
        🚀 构建信息摘要
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        ✅ 构建状态: 成功完成
        ⏱️ 构建用时: ${dayjs.duration(endTime.diff(startTime)).format('mm分ss秒')}
        📦 包体积: ${size}
        📂 输出目录: ${outDir}
        ${showPluginVersion ? `🔌 插件版本: ${pluginVersion}\n` : ''}
        🌐 环境变量:
${Object.entries(envVarsToShow).map(([key, value]) =>
  `        • ${key}: ${value}`,
).join('\n')}
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `
          console.info(
            boxen(
              gradient(['cyan', 'magenta']).multiline(outInfo),
              boxenOptions,
            ),
          )

          // 读取项目的 package.json 文件获取 name 和 version
          try {
            const packageJsonPath = resolve(root, 'package.json')
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
            const projectName = packageJson.name
            const projectVersion = packageJson.version

            packFolder({
              dirPath: outDir,
              projectName,
              version: projectVersion,
            })
          }
          catch (error) {
            console.error('读取 package.json 失败，使用默认文件名', error)
            packFolder({
              dirPath: outDir,
              packFullName: 'dist',
            })
          }
        })
      }
    },
  }
}

// 替换之前的空接口定义
export interface Options extends BuildConsoleOptions {
  // 其他选项可以在这里添加
}
