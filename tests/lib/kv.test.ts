import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import type { KvJsonClient } from '@/lib/kv';
import { createInMemoryKv } from '../mocks/kv';

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

describe('kvClient', () => {
  const store = createInMemoryKv();
  let client: KvJsonClient;

  beforeAll(async () => {
    ensureEnv();
    const { kvClient } = await import('@/lib/kv');
    client = kvClient({
      adapter: {
        get: store.get,
        set: store.set,
        delete: store.delete,
      },
    });
  });

  beforeEach(() => {
    store.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('serializes and retrieves JSON payloads', async () => {
    await client.setJson('test-key', { foo: 'bar' });

    const value = await client.getJson<{ foo: string }>('test-key');

    expect(value).toEqual({ foo: 'bar' });
  });

  it('expires keys after the provided TTL', async () => {
    vi.useFakeTimers();
    await client.setJson('ttl-key', { expires: true }, { ttl: 5 });

    vi.advanceTimersByTime(4000);
    expect(await client.getJson('ttl-key')).toEqual({ expires: true });

    vi.advanceTimersByTime(2000);
    expect(await client.getJson('ttl-key')).toBeNull();
  });
});
