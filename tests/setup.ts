import '@testing-library/jest-dom/vitest';
import React from 'react';

(globalThis as typeof globalThis & { React?: typeof React }).React = React;

process.env.TZ = 'UTC';
process.env.NODE_ENV = process.env.NODE_ENV ?? 'test';
process.env.KV_REST_API_URL =
  process.env.KV_REST_API_URL ?? 'https://kv.example.vercel-storage.com';
process.env.KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN ?? 'test-token';
process.env.YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY ?? 'test-youtube-key';
process.env.NEXT_PUBLIC_SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN ?? '';
process.env.SENTRY_DSN = process.env.SENTRY_DSN ?? '';
process.env.RESEND_API_KEY = process.env.RESEND_API_KEY ?? '';
process.env.DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL ?? '';
process.env.ADMIN_REFRESH_TOKEN = process.env.ADMIN_REFRESH_TOKEN ?? '';
process.env.NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

afterEach(() => {
  vi.clearAllMocks();
});
