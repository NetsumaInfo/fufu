import { beforeEach, describe, expect, it, vi } from 'vitest';

const REQUIRED_ENV = {
  KV_REST_API_URL: 'https://kv.example.vercel-storage.com',
  KV_REST_API_TOKEN: 'test-token',
  YOUTUBE_API_KEY: 'youtube-token',
};

const resetEnv = () => {
  Object.assign(process.env, REQUIRED_ENV, {
    NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
  });
  delete process.env.RESEND_API_KEY;
  delete process.env.DISCORD_WEBHOOK_URL;
  delete process.env.ADMIN_REFRESH_TOKEN;
  delete process.env.SENTRY_DSN;
  delete process.env.NEXT_PUBLIC_SENTRY_DSN;
};

describe('env', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
    Object.keys(process.env).forEach((key) => delete process.env[key]);
    Object.assign(process.env, originalEnv);
    resetEnv();
  });

  it('throws when required environment variables are missing', async () => {
    delete process.env.KV_REST_API_URL;

    await expect(import('@/lib/env')).rejects.toThrow('KV_REST_API_URL');
  });

  it('parses optional values as empty strings when not provided', async () => {
    const { env } = await import('@/lib/env');

    expect(env.RESEND_API_KEY).toBe('');
    expect(env.DISCORD_WEBHOOK_URL).toBe('');
    expect(env.SENTRY_DSN).toBe('');
    expect(env.NEXT_PUBLIC_SENTRY_DSN).toBe('');
  });
});
