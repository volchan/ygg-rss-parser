import fs from 'fs'
import dotenv from 'dotenv'
import dotenvParseVariable from 'dotenv-parse-variables'

import { appConfigSchema } from './types'

import { logger } from '@utils/logger'

const parseEnv = () => {
  const env = process.env.APP_ENV || 'development'

  if (env === 'development') {
    logger.info(`🔃 Loading environment variables from .env file`)
    return dotenv.parse(fs.readFileSync('.env'))
  } else {
    logger.info(`🔃 Loading environment variables from process.env`)
    const typeKeys = Object.keys(appConfigSchema.shape)

    return Array.from(typeKeys).reduce((acc: dotenv.DotenvParseOutput, key) => {
      const value = process.env[key]
      if (value) {
        acc[key] = value
      }
      return acc
    }, {})
  }
}

const loadEnv = () => {
  dotenv.config()

  const parsedEnv = appConfigSchema.safeParse(dotenvParseVariable(parseEnv()))

  if (!parsedEnv.success) {
    logger.error('❌ Invalid environment variables')
    logger.error(parsedEnv.error)
    process.exit(1)
  }

  logger.info('✅ Environment variables loaded')
  return parsedEnv.data
}

export const appEnv = loadEnv()
