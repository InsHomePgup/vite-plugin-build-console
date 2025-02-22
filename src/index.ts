import type { Options as BoxenOptions } from 'boxen'
import type { Dayjs } from 'dayjs'
import type { Plugin, ResolvedConfig } from 'vite'
import { resolve } from 'node:path'
import process from 'node:process'
import AdmZip from 'adm-zip'
import boxen from 'boxen'
import { formatBytes } from 'bytes-formatter'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import getFolderSize from 'get-folder-size'
import gradient from 'gradient-string'

const root = process.cwd()
const zip = new AdmZip()
dayjs.extend(duration)
const boxenOptions: BoxenOptions = {
  padding: 0.5,
  borderColor: 'cyan',
  borderStyle: 'round',
}
export async function calcFolderSize({ dirPath }: { dirPath: string }): Promise<string> {
  /** 计算指定文件夹大小并格式化成MB等单位 */
  return new Promise((resolve) => {
    getFolderSize.loose(dirPath).then((result) => {
      resolve(formatBytes(result))
    })
  })
}
//
// const size = await calcFolderSize({
//   dirPath: './dist',
// })
// console.log(size)

export function packFolder({ dirPath, packPre, version, projectName, outDirPath = 'dist', packFullName }: { dirPath: string, packPre?: string, version?: string, projectName?: string, outDirPath?: string, packFullName?: string }): void {
  // pack 文件夹
  console.log('packFolder', dirPath, packPre, version, projectName, outDirPath, packFullName)
  const sourcePath = resolve(root, dirPath)
  const packName = packFullName ? `${packFullName}.zip` : `${packPre}-${projectName}-${version}.zip`
  console.log('packFolder', sourcePath, packName)
  zip.addLocalFolder(sourcePath)
  zip.writeZip(resolve(root, outDirPath, packName), (error) => {
    if (error) {
      console.error('pack fail', error)
    }
  })
}

export function consoleBuildInfo(): Plugin {
//   打包完成后输出构建信息
  let config: ResolvedConfig
  let startTime: Dayjs
  let endTime: Dayjs
  let outDir: string
  return {
    name: 'vite:BuildInfo',
    configResolved(resolvedConfig) {
      config = resolvedConfig
      outDir = config.build.outDir
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
          console.info(
            boxen(
              gradient(['cyan', 'magenta']).multiline(
                `
🎉 打包完成（用时${dayjs.duration(endTime.diff(startTime)).format('mm分ss秒')}，包体积：${size}）
outDir:${outDir}
`,
              ),
              boxenOptions,
            ),
          )
        })

        packFolder({
          dirPath: outDir,
          packFullName: 'dist',
        })
      }
    },
  }
}

// packFolder({
//   dirPath: './dist',
//   packFullName:'dist'
// })

export interface Options {

}
