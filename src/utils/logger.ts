import pino from 'pino-http'

export const loggerConfig = pino({
  level: process.env.PINO_LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      colorizeObjects: true,
      translateTime: true,
    },
  },
  redact: {
    paths: ['email'],
  },
})

export const logger = loggerConfig.logger
