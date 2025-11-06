import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import type { KvJsonClient } from '@/lib/kv';
import type { RateLimitResult } from '@/lib/rateLimit';
import { createInMemoryKv } from '../mocks/kv';

const TEST_IP = '127.0.0.1';

const ensureEnv = () => {
  process.env.KV_REST_API_URL =
    process.env.KV_REST_API_URL ?? 'https://kv.example.vercel-storage.com';
  process.env.KV_REST_API_TOKEN = 'test-token';
  process.env.YOUTUBE_API_KEY = 'youtube-token';
  process.env.DISCORD_WEBHOOK_URL =
    process.env.DISCORD_WEBHOOK_URL ?? 'https://discord.com/api/webhooks/test';
  process.env.SENTRY_DSN = 'https://sentry.example.com/123';
  process.env.NEXT_PUBLIC_SENTRY_DSN = '';
};

describe('rateLimitByIp', () => {
  const store = createInMemoryKv();
  let client: KvJsonClient;
  let rateLimitByIp: typeof import('@/lib/rateLimit').rateLimitByIp;

  beforeAll(async () => {
    ensureEnv();
    const [{ kvClient }, rateModule] = await Promise.all([
      import('@/lib/kv'),
      import('@/lib/rateLimit'),
    ]);

    client = kvClient({
      adapter: {
        get: store.get,
        set: store.set,
        delete: store.delete,
      },
    });

    rateLimitByIp = rateModule.rateLimitByIp;
  });

  beforeEach(() => {
    store.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const execute = async (
    limitConfig: Parameters<typeof rateLimitByIp>[1]
  ): Promise<RateLimitResult> => rateLimitByIp(TEST_IP, limitConfig, client);

  it('allows requests within the configured limit', async () => {
    const first = await execute({ maxRequests: 2, windowSeconds: 60 });
    expect(first.success).toBe(true);
    expect(first.remaining).toBe(1);

    const second = await execute({ maxRequests: 2, windowSeconds: 60 });
    expect(second.success).toBe(true);
    expect(second.remaining).toBe(0);
  });

  it('blocks requests once the limit is reached', async () => {
    await execute({ maxRequests: 1, windowSeconds: 60 });
    const denied = await execute({ maxRequests: 1, windowSeconds: 60 });

    expect(denied.success).toBe(false);
    expect(denied.remaining).toBe(0);
  });

  it('resets after the window expires', async () => {
    await execute({ maxRequests: 1, windowSeconds: 60 });
    const denied = await execute({ maxRequests: 1, windowSeconds: 60 });
    expect(denied.success).toBe(false);

    vi.advanceTimersByTime(60_000);

    const allowed = await execute({ maxRequests: 1, windowSeconds: 60 });
    expect(allowed.success).toBe(true);
  });
});
