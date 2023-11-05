import { useRssSourceStore } from '@/state/rssResource'
import type { DataJsonType } from '@/type'
import { writeFileAsync, readFileAsync } from './fileIO'
const rawData: DataJsonType = {
  name: 'rssSourcePaths',
  value: [
    {
      id: 1,
      name: '少数派',
      path: 'https://sspai.com/feed',
      icon: 'i-carbon-contour-finding'
    },
    {
      id: 2,
      name: '36氪',
      path: 'https://36kr.com/feed',
      icon: 'i-carbon-linux'
    },
    {
      id: 3,
      name: '设计日报',
      path: 'https://www.designernews.co/?format=rss',
      icon: 'i-carbon-bat'
    },
    {
      id: 4,
      name: 'antfu',
      path: 'https://antfu.me/feed.xml',
      icon: 'i-carbon-navaid-tacan'
    },
    {
      id: 5,
      name: '机核',
      path: 'https://www.gcores.com/rss',
      icon: 'i-carbon-money'
    },
    {
      id: 6,
      name: 'Shadeed Blog',
      path: 'https://ishadeed.com/feed.xml',
      icon: 'i-carbon-earth'
    }
  ]
}

export const useInitDataJson = async () => {
  const { setData } = useRssSourceStore()
  const rssSource = await readFileAsync('rssSourcePath.json')
  if (!rssSource) {
    writeFileAsync({
      path: 'rssSourcePath.json',
      contents: JSON.stringify(rawData)
    }).then(value => {
      setData(value)
    })
  } else {
    setData(rssSource)
  }
}
