import { env } from './env';
import { kv, type KvJsonClient } from './kv';

type RateLimitConfig = {
  maxRequests?: number;
  windowSeconds?: number;
  prefix?: string;
};

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
};

type RateLimitState = {
  count: number;
  resetAt: number;
};

const DEFAULT_PREFIX = 'rate-limit';
const DEFAULT_MAX_REQUESTS = env.RATE_LIMIT_MAX_REQUESTS;
const DEFAULT_WINDOW_SECONDS = env.RATE_LIMIT_WINDOW_SECONDS;

const calculateTtl = (resetAt: number) => {
  const now = Date.now();
  const diff = Math.ceil((resetAt - now) / 1000);
  return diff > 0 ? diff : 1;
};

export const rateLimitByIp = async (
  ip: string,
  config: RateLimitConfig = {},
  client: KvJsonClient = kv
): Promise<RateLimitResult> => {
  const maxRequests = config.maxRequests ?? DEFAULT_MAX_REQUESTS;
  const windowSeconds = config.windowSeconds ?? DEFAULT_WINDOW_SECONDS;
  const prefix = config.prefix ?? DEFAULT_PREFIX;

  const key = `${prefix}:${ip}`;
  const record = await client.getJson<RateLimitState>(key);
  const now = Date.now();

  if (!record || record.resetAt <= now) {
    const resetAt = now + windowSeconds * 1000;
    await client.setJson(
      key,
      {
        count: 1,
        resetAt,
      },
      { ttl: windowSeconds }
    );

    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - 1,
      reset: resetAt,
    };
  }

  if (record.count >= maxRequests) {
    return {
      success: false,
      limit: maxRequests,
      remaining: 0,
      reset: record.resetAt,
    };
  }

  const updated = {
    count: record.count + 1,
    resetAt: record.resetAt,
  };

  await client.setJson(key, updated, {
    ttl: calculateTtl(record.resetAt),
  });

  return {
    success: true,
    limit: maxRequests,
    remaining: maxRequests - updated.count,
    reset: record.resetAt,
  };
};
