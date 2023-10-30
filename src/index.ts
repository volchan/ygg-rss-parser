// import axios from 'axios'
import helmet from 'helmet'
import express from 'express'
import path from 'path'
// import { parse as pttParse, DefaultParserResult } from 'parse-torrent-title'
// import { XMLParser } from 'fast-xml-parser'

import { appEnv } from '@config/env'
import { loggerConfig, logger } from '@utils/logger'
import AppRouter from '@routes/index'

const app = express()

app.use(helmet())
app.use(loggerConfig)
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))
app.use(AppRouter)

app.listen(appEnv.PORT, () => {
  switch (appEnv.APP_ENV) {
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
