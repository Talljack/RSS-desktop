import type { RssValue } from '@/type'
import { writeFileAsync } from '@/utils/fileIO'
import { create } from 'zustand'
import { getMessage } from '@/utils/request'

export type RssSourceType = {
  id: number
  path: string
  title: string
  data: RssValue[]
  initState: () => void
  setData: (data: RssValue[]) => void
  setPath: (path: string) => void
  setTitle: (title: string) => void
  setId: (id: number) => void
  appendData: (data: RssValue) => void
  deleteDataPath: (id: number) => void
}

const useRssSourceStore = create<RssSourceType>(set => ({
  id: 0,
  path: '',
  title: 'RSS Reader',
  data: [],
  initState: () => {
    set(() => ({
      id: 0,
      path: '',
      title: 'RSS Reader',
      data: []
    }))
  },
  setData(data) {
    set(() => ({
      data
    }))
  },
  setPath(path) {
    set(() => ({
      path
    }))
  },
  setTitle(title) {
    set(() => ({
      title
    }))
  },
  setId(id) {
    set(() => ({
      id
    }))
  },
  appendData({ name, path, icon }) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    set(state => {
      getMessage(path).then(data => {
        writeFileAsync({
          path: 'rssSourcePath.json',
          contents: JSON.stringify({
            name: 'rssSourcePaths',
            value: [...state.data, { name, path, icon, data }]
          })
        }).then(() => {
          console.log('append success')
        })
        return {
          data: [...state.data, { name, path, icon, data }]
        }
      })
    })
  },
  deleteDataPath: async id => {
    set(state => {
      const newData = state.data.filter(item => item.id !== id)
      writeFileAsync({
        path: 'rssSourcePath.json',
        contents: JSON.stringify({
          name: 'rssSourcePaths',
          value: newData
        })
      }).then(() => {
        console.log('delete success')
      })
      return {
        data: newData
      }
    })
  }
}))

export { useRssSourceStore }
