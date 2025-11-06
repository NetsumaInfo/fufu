import * as Sentry from '@sentry/nextjs';

const tracesSampleRate =
  Number.parseFloat(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ?? '') || 0.15;
const replaysSessionSampleRate =
  Number.parseFloat(process.env.NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE ?? '') || 0;
const replaysOnErrorSampleRate =
  Number.parseFloat(process.env.NEXT_PUBLIC_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE ?? '') || 0.1;

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || undefined,
  tracesSampleRate,
  replaysSessionSampleRate,
  replaysOnErrorSampleRate,
  enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
  debug: process.env.NODE_ENV === 'development',
});
