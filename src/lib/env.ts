import { z } from 'zod';

type OptionalStringOptions = {
  defaultValue?: string;
  url?: boolean;
};

const optionalString = (options: OptionalStringOptions = {}) => {
  const { defaultValue = '', url = false } = options;

  const base = url
    ? z.union([z.string().url(), z.literal('')]).optional()
    : z.union([z.string(), z.literal('')]).optional();

  return base.transform((value) => {
    if (typeof value !== 'string') {
      return defaultValue;
    }

    const normalized = value.trim();
    return normalized.length > 0 ? normalized : defaultValue;
  });
};

const coerceSampleRate = (fallback: number) =>
  z
    .string()
    .optional()
    .transform((value) => {
      const parsed = Number(value);
      if (Number.isNaN(parsed) || parsed < 0 || parsed > 1) {
        return fallback;
      }
      return parsed;
    });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  VERCEL_ENV: z.enum(['development', 'preview', 'production']).optional(),
  KV_REST_API_URL: z.string().url({ message: 'KV_REST_API_URL must be a valid URL.' }),
  KV_REST_API_TOKEN: z
    .string()
    .min(1, 'KV_REST_API_TOKEN is required to authenticate with Vercel KV.'),
  YOUTUBE_API_KEY: z.string().min(1, 'YOUTUBE_API_KEY is required for YouTube sync.'),
  RESEND_API_KEY: optionalString(),
  DISCORD_WEBHOOK_URL: optionalString({ url: true }),
  ADMIN_REFRESH_TOKEN: optionalString(),
  SENTRY_DSN: optionalString({ url: true }),
  NEXT_PUBLIC_SENTRY_DSN: optionalString({ url: true }),
  NEXT_PUBLIC_APP_URL: optionalString({ url: true }),
  RATE_LIMIT_MAX_REQUESTS: z
    .string()
    .optional()
    .transform((value) => {
      const parsed = Number.parseInt(value ?? '', 10);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : 5;
    }),
  RATE_LIMIT_WINDOW_SECONDS: z
    .string()
    .optional()
    .transform((value) => {
      const parsed = Number.parseInt(value ?? '', 10);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : 60;
    }),
  SENTRY_TRACES_SAMPLE_RATE: coerceSampleRate(0.15),
  SENTRY_PROFILES_SAMPLE_RATE: coerceSampleRate(0.05),
  SENTRY_REPLAYS_SESSION_SAMPLE_RATE: coerceSampleRate(0.0),
  SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE: coerceSampleRate(0.1),
});

const rawEnv = {
  NODE_ENV: process.env.NODE_ENV,
  VERCEL_ENV: process.env.VERCEL_ENV,
  KV_REST_API_URL: process.env.KV_REST_API_URL,
  KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN,
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL,
  ADMIN_REFRESH_TOKEN: process.env.ADMIN_REFRESH_TOKEN,
  SENTRY_DSN: process.env.SENTRY_DSN,
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  RATE_LIMIT_MAX_REQUESTS: process.env.RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_WINDOW_SECONDS: process.env.RATE_LIMIT_WINDOW_SECONDS,
  SENTRY_TRACES_SAMPLE_RATE: process.env.SENTRY_TRACES_SAMPLE_RATE,
  SENTRY_PROFILES_SAMPLE_RATE: process.env.SENTRY_PROFILES_SAMPLE_RATE,
  SENTRY_REPLAYS_SESSION_SAMPLE_RATE: process.env.SENTRY_REPLAYS_SESSION_SAMPLE_RATE,
  SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE: process.env.SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE,
};

const parsed = envSchema.safeParse(rawEnv);

if (!parsed.success) {
  const formatted = parsed.error.issues
    .map((issue) => `• ${issue.path.join('.')}: ${issue.message}`)
    .join('\n');

  throw new Error(
    `Invalid environment configuration:\n${formatted}\n\n` +
      'Refer to specs/01-mvp/03-setup-shared-infra.md or .env.example for required values.'
  );
}

const optionalKeys: Array<keyof typeof parsed.data> = [
  'RESEND_API_KEY',
  'DISCORD_WEBHOOK_URL',
  'ADMIN_REFRESH_TOKEN',
  'SENTRY_DSN',
  'NEXT_PUBLIC_SENTRY_DSN',
  'NEXT_PUBLIC_APP_URL',
];

if (parsed.data.NODE_ENV === 'development') {
  optionalKeys
    .filter((key) => !parsed.data[key])
    .forEach((key) => {
      console.info(`[env] Optional environment variable ${String(key)} is not set.`);
    });
}

export const env = Object.freeze(parsed.data);
export type Env = typeof env;

export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';
export const isDevelopment = env.NODE_ENV === 'development';
