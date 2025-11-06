import type { Env } from './env';
import { env } from './env';
import { captureException } from './sentry';

type FetchFn = typeof fetch;

type KvAdapter = {
  get: (_key: string) => Promise<string | null>;
  set: (_key: string, _value: string, _options?: { ttl?: number }) => Promise<void>;
  delete?: (_key: string) => Promise<void>;
};

export type KvClientOptions = {
  baseUrl?: string;
  token?: string;
  fetcher?: FetchFn;
  retries?: number;
  adapter?: KvAdapter;
};

export type KvJsonClient = {
  getJson<T>(_key: string): Promise<T | null>;
  setJson<T>(_key: string, _value: T, _options?: { ttl?: number }): Promise<void>;
  delete(_key: string): Promise<void>;
};

type RequestOptions = Omit<RequestInit, 'body'> & { body?: unknown };

const DEFAULT_RETRIES = 2;

const encodeKey = (key: string) => encodeURIComponent(key);

const createHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
});

const isAdapterMode = (
  options: KvClientOptions
): options is KvClientOptions & { adapter: KvAdapter } => Boolean(options.adapter);

const executeRequest = async <T>(
  fetcher: FetchFn,
  baseUrl: string,
  token: string,
  path: string,
  requestOptions: RequestOptions,
  retries: number
): Promise<T> => {
  const attempt = async (remaining: number): Promise<T> => {
    const response = await fetcher(`${baseUrl}/${path}`, {
      ...requestOptions,
      headers: {
        ...createHeaders(token),
        ...(requestOptions.headers ?? {}),
      },
      body: requestOptions.body ? JSON.stringify(requestOptions.body) : undefined,
    });

    if (!response.ok) {
      if (remaining > 0 && response.status >= 500) {
        return attempt(remaining - 1);
      }

      const errorPayload = await response.text();
      const error = new Error(
        `KV request failed for ${path} with status ${response.status}: ${errorPayload}`
      );

      captureException(error, {
        context: 'kv',
        extra: { path, status: response.status },
      });

      throw error;
    }

    if (response.status === 204) {
      return null as T;
    }

    return (await response.json()) as T;
  };

  try {
    return await attempt(retries);
  } catch (error) {
    captureException(error, {
      context: 'kv',
      extra: { path, retries },
    });
    throw error;
  }
};

const createAdapterClient = (adapter: KvAdapter): KvJsonClient => ({
  async getJson<T>(key: string) {
    const raw = await adapter.get(key);
    if (raw === null) {
      return null;
    }

    try {
      return JSON.parse(raw) as T;
    } catch (error) {
      captureException(error, {
        context: 'kv',
        extra: { key, mode: 'adapter', message: 'Failed to parse cached JSON.' },
      });
      throw error;
    }
  },
  async setJson<T>(key: string, value: T, options?: { ttl?: number }) {
    const payload = JSON.stringify(value);
    await adapter.set(key, payload, options);
  },
  async delete(key: string) {
    await adapter.delete?.(key);
  },
});

export const kvClient = (options: KvClientOptions = {}): KvJsonClient => {
  if (isAdapterMode(options)) {
    return createAdapterClient(options.adapter);
  }

  const defaultFetcher: FetchFn =
    typeof fetch !== 'undefined'
      ? fetch.bind(globalThis)
      : (..._args: Parameters<FetchFn>) => {
          throw new Error('Global fetch is not available in this runtime.');
        };

  const {
    baseUrl = env.KV_REST_API_URL,
    token = env.KV_REST_API_TOKEN,
    fetcher = defaultFetcher,
    retries = DEFAULT_RETRIES,
  } = options;

  const request = <T>(path: string, requestOptions: RequestOptions) =>
    executeRequest<T>(fetcher, baseUrl, token, path, requestOptions, retries);

  return {
    async getJson<T>(key: string) {
      const response = await request<{ result: string | null }>(`get/${encodeKey(key)}`, {
        method: 'GET',
      });

      if (!response?.result) {
        return null;
      }

      try {
        return JSON.parse(response.result) as T;
      } catch (error) {
        captureException(error, {
          context: 'kv',
          extra: { key, message: 'Failed to parse JSON response from KV.' },
        });
        throw error;
      }
    },
    async setJson<T>(key: string, value: T, options?: { ttl?: number }) {
      const ttl = options?.ttl ?? undefined;
      const body = {
        value: JSON.stringify(value),
        ...(typeof ttl === 'number' ? { ex: ttl } : {}),
      };

      await request(`set/${encodeKey(key)}`, {
        method: 'POST',
        body,
      });
    },
    async delete(key: string) {
      await request(`del/${encodeKey(key)}`, {
        method: 'DELETE',
      });
    },
  };
};

export const kv = kvClient();

export type KvEnvironment = Pick<
  Env,
  'KV_REST_API_TOKEN' | 'KV_REST_API_URL' | 'RATE_LIMIT_MAX_REQUESTS' | 'RATE_LIMIT_WINDOW_SECONDS'
>;
