import axios from 'axios'
import helmet from 'helmet'
import express, { Request, Response } from 'express'
import { parse as pttParse, DefaultParserResult } from 'parse-torrent-title'
import { XMLParser } from 'fast-xml-parser'

import { appEnv } from './config/env'
import { loggerConfig, logger } from '@utils/logger'

const app = express()

app.use(helmet())

const axiosInstance = axios.create({
  baseURL: appEnv.FLARE_SOLVER_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

app.use(loggerConfig)

type XmlData = {
  status: string
  message: string
  solution: {
    url: string
    status: number
    cookies: Array<{
      domain: string
      expiry: number
      httpOnly: boolean
      name: string
      path: string
      sameSite: string
      secure: boolean
      value: string
    }>
    userAgent: string
    headers: object
    response: string
  }
  startTimestamp: number
  endTimestamp: number
  version: string
}

type TorrentItem = {
  title: string
  link: string
  category: string
  description: string
  guid: string
  pubDate: string
  enclosure: string
  parsedTileInfos?: DefaultParserResult
}

type RssFeed = {
  channel: {
    'atom:link': string
    title: string
    link: string
    image: {
      url: string
      title: string
      link: string
      description: string
    }
    description: string
    language: string
    generator: string
    copyright: string
    item: TorrentItem[]
  }
}

app.get('/', async (req: Request, res: Response) => {
  const { data }: { data: XmlData } = await axiosInstance.post('/v1', {
    cmd: 'request.get',
    url: `https://www3.yggtorrent.wtf/rss?action=generate&type=cat&id=2145&passkey=${appEnv.YGG_PASSKEY}}`,
    maxTimeout: 60000,
  })

  const regex = /(<channel>[\s\S]*<\/channel>)/g
  const match = data.solution.response.match(regex)

  const parser = new XMLParser()
  const feed: RssFeed = parser.parse(match?.[0] || 'null')

  const items: TorrentItem[] = feed.channel.item

  items.forEach(item => (item.parsedTileInfos = pttParse(item.title)))

  res.send({ items })
})

app.listen(appEnv.PORT, () => {
  switch (appEnv.ENV) {
    case 'development':
    case 'test':
      logger.info(`🚀 Server listening on http://localhost:${appEnv.PORT}`)
      break
    case 'production':
    case 'staging':
      logger.info(`🚀 Server listening on port ${appEnv.PORT}`)
      break
  }
})
