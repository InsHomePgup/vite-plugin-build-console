import { formatBytes } from 'bytes-formatter'
import getFolderSize from 'get-folder-size'
/** 计算指定文件夹大小并格式化成MB为单位 */
export async function calcFolderSize({ dirPath }: { dirPath: string }): Promise<string> {
  return new Promise((resolve) => {
    getFolderSize.loose(dirPath).then((result) => {
      resolve(formatBytes(result))
    })
  })
}

export function packFolder({ dirPath, packPre, version, projectName, outDirPath, packFullName }: { dirPath: string, packPre?: string, version?: string, projectName?: string, outDirPath?: string, packFullName?: string }): void {
  console.log('packFolder', dirPath, packPre, version, projectName, outDirPath, packFullName)
  // const sourcePath = resolve(root, dirPath)
  // const packName = packFullName ? `${packFullName}.zip` : `${packPre}-${projectName}-${version}.zip`
  // console.log("packFolder",sourcePath,packName)
  // zip.addLocalFolder(sourcePath)
  // zip.writeZip(resolve(root,outDirPath,packName), (error) => {
  //     console.error("pack fail",error)
  // });
}
