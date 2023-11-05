// Rss Value
export type RssValue = {
  id: number
  path: string
  name: string
  icon?: string
  number?: number
}

export type DataJsonType = {
  name: string
  value: RssValue[]
}

export type itemType = {
  title?: string
  description?: string
  link?: string
  guid?: string //same as link
  pubDate?: string
  author?: string
}

export type mainIdeaType = {
  title?: string
  description?: string
  link?: string
  pubDate?: string
  lastBuildDate?: string
}
