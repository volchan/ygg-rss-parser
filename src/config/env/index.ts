import dotenv from 'dotenv'
import dotenvParseVariable from 'dotenv-parse-variables'
import fs from 'fs'

import { type RequiredConfig, appConfigSchema } from './types'

export function defineConfig(config: RequiredConfig) {
  return appConfigSchema.safeParse(config)
}

import { logger } from '@utils/logger'

function loadEnv() {
  dotenv.config()
  const env = process.env.APP_ENV || 'development'
  const envPath = `.env.${env}`
  logger.info(`🔃 Loading environment variables from ${envPath} file`)
  const envConfig = dotenv.parse(fs.readFileSync(envPath))

  logger.info(`🔃 Parsing environment variables from ${envPath} file`)
  const parsedEnv = appConfigSchema.safeParse(dotenvParseVariable(envConfig))

  if (!parsedEnv.success) {
    logger.error('❌ Invalid environment variables')
    logger.error(parsedEnv.error)
    process.exit(1)
  }

  logger.info('✅ Environment variables loaded')
  return parsedEnv.data
}

export const appEnv = loadEnv()
