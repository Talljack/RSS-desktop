import { invoke } from '@tauri-apps/api'

export const getMessage = async (url: string) => {
  const message = await invoke('rss_content', { url })
  console.log('message', message)
  return message
}
