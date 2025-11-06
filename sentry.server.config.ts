import * as Sentry from '@sentry/nextjs';

import { env } from './src/lib/env';

Sentry.init({
  dsn: env.SENTRY_DSN || env.NEXT_PUBLIC_SENTRY_DSN || undefined,
  tracesSampleRate: env.SENTRY_TRACES_SAMPLE_RATE,
  profilesSampleRate: env.SENTRY_PROFILES_SAMPLE_RATE,
  environment: env.VERCEL_ENV ?? env.NODE_ENV,
  enabled: Boolean(env.SENTRY_DSN || env.NEXT_PUBLIC_SENTRY_DSN),
  debug: env.NODE_ENV === 'development',
});
