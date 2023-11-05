import { writeTextFile, readTextFile } from '@tauri-apps/api/fs'
import type { FsTextFileOption, FsOptions } from '@tauri-apps/api/fs'
import { appDataDir, join } from '@tauri-apps/api/path'
import { sendNotification } from '@tauri-apps/api/notification'
import type { RssValue, DataJsonType } from '@/type'

export const writeFileAsync = async (
  file: FsTextFileOption,
  option?: FsOptions
): Promise<RssValue[]> => {
  console.log('writeFileAsync')
  const basePath = await appDataDir()
  const filePath = await join(basePath, file.path)
  return writeTextFile(filePath, file.contents, option)
    .then(() => {
      console.log('write file success')
      return JSON.parse(file.contents).value
    })
    .catch(err => {
      console.log('write file failed')
      console.log(err)
    })
}

export const readFileAsync = async (fileName: string) => {
  console.log('readFileAsync')
  const basePath = await appDataDir()
  const filePath = await join(basePath, fileName)
  return readTextFile(filePath)
    .then(res => {
      console.log('read file success')
      return JSON.parse(res)
    })
    .catch(err => {
      console.log('read file failed')
      sendNotification({
        title: '读取文件失败',
        body: err
      })
    })
}

export const appendFileAsync = async ({
  value,
  fileName
}: {
  value: RssValue
  fileName: string
}) => {
  return readFileAsync(fileName).then((res: DataJsonType) => {
    res.value.push(value)
    return writeFileAsync({
      path: fileName,
      contents: JSON.stringify(res)
    })
  })
}
