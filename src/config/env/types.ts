import { z } from 'zod'

export const appConfigSchema = z.object({
  APP_ENV: z.enum(['development', 'production', 'staging', 'test']).default('development'),
  FLARE_SOLVER_BASE_URL: z.string().url(),
  PORT: z.number().default(3000),
  YGG_PASSKEY: z.string(),
})

type AppConfig = z.infer<typeof appConfigSchema>

export type RequiredConfig = Optional<AppConfig, KeysWithFallbackValue>

type KeysWithFallbackValue = 'APP_ENV' | 'PORT'

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>
