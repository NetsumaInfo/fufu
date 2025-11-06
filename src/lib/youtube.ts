import { z } from 'zod';

import type { AmvListResponse, AmvVideo } from '@/types/amv';

import { env } from './env';
import type { AmvCacheClient } from './kv';
import { getAmvList, setAmvList } from './kv';
import { captureException } from './sentry';

type Fetcher = typeof fetch;

type SourceConfig =
  | {
      type: 'playlist';
      id: string;
    }
  | {
      type: 'channel';
      id: string;
    };

const API_BASE_URL = 'https://www.googleapis.com/youtube/v3';
const DEFAULT_MAX_RESULTS = 12;
const THUMBNAIL_PRIORITY = ['maxres', 'standard', 'high', 'medium', 'default'] as const;

const playlistItemsSchema = z.object({
  items: z
    .array(
      z.object({
        contentDetails: z.object({
          videoId: z.string(),
        }),
      })
    )
    .default([]),
});

const searchItemsSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.object({
          videoId: z.string(),
        }),
      })
    )
    .default([]),
});

const videoDetailsSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      snippet: z.object({
        title: z.string(),
        description: z.string().optional(),
        publishedAt: z.string().optional(),
        thumbnails: z
          .object({})
          .catchall(
            z
              .object({
                url: z.string().url(),
              })
              .passthrough()
          )
          .optional(),
      }),
      contentDetails: z.object({
        duration: z.string(),
      }),
    })
  ),
});

const ensureFetcher = (fetcher?: Fetcher): Fetcher => {
  if (fetcher) {
    return fetcher;
  }

  if (typeof fetch === 'function') {
    return fetch.bind(globalThis);
  }

  throw new Error('Global fetch is not available in this runtime.');
};

const resolveSourceConfig = (playlistId: string, channelId: string): SourceConfig => {
  if (playlistId) {
    return { type: 'playlist', id: playlistId };
  }

  if (channelId) {
    return { type: 'channel', id: channelId };
  }

  throw new Error('You must configure YOUTUBE_PLAYLIST_ID or YOUTUBE_CHANNEL_ID.');
};

const requestJson = async <TSchema extends z.ZodTypeAny>(
  fetcher: Fetcher,
  url: string,
  schema: TSchema,
  metadata: { stage: string }
): Promise<z.infer<TSchema>> => {
  const response = await fetcher(url);

  if (!response.ok) {
    const payload = await response.text().catch(() => '');
    const error = new Error(
      `YouTube API request failed (${metadata.stage}) with status ${response.status}. ${payload}`.trim()
    );
    throw error;
  }

  const json = await response.json();
  return schema.parse(json);
};

const fetchVideoIds = async (
  source: SourceConfig,
  limit: number,
  fetcher: Fetcher,
  apiKey: string
) => {
  const params = new URLSearchParams({
    key: apiKey,
    maxResults: String(Math.min(limit, 50)),
  });

  if (source.type === 'playlist') {
    params.set('part', 'contentDetails');
    params.set('playlistId', source.id);

    const { items } = await requestJson(
      fetcher,
      `${API_BASE_URL}/playlistItems?${params.toString()}`,
      playlistItemsSchema,
      { stage: 'playlistItems' }
    );

    return items
      .map((item) => item.contentDetails.videoId)
      .filter((id): id is string => Boolean(id));
  }

  params.set('part', 'snippet');
  params.set('channelId', source.id);
  params.set('order', 'date');
  params.set('type', 'video');

  const { items } = await requestJson(
    fetcher,
    `${API_BASE_URL}/search?${params.toString()}`,
    searchItemsSchema,
    { stage: 'search' }
  );

  return items
    .map((item) => item.id.videoId)
    .filter((id): id is string => Boolean(id));
};

const fetchVideoDetails = async (ids: string[], fetcher: Fetcher, apiKey: string) => {
  if (ids.length === 0) {
    return [];
  }

  const params = new URLSearchParams({
    part: 'snippet,contentDetails',
    id: ids.join(','),
    key: apiKey,
  });

  const { items } = await requestJson(
    fetcher,
    `${API_BASE_URL}/videos?${params.toString()}`,
    videoDetailsSchema,
    { stage: 'videos' }
  );

  return items;
};

const parseIsoDuration = (input: string): number => {
  const pattern =
    /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/;
  const match = pattern.exec(input);

  if (!match) {
    return 0;
  }

  const [, days, hours, minutes, seconds] = match.map((value) =>
    value ? Number.parseInt(value, 10) : 0
  );

  return (
    (days ?? 0) * 86400 +
    (hours ?? 0) * 3600 +
    (minutes ?? 0) * 60 +
    (seconds ?? 0)
  );
};

const resolveThumbnail = (
  thumbnails: Record<string, { url: string; [key: string]: unknown }> | undefined,
  videoId: string
) => {
  if (thumbnails) {
    for (const size of THUMBNAIL_PRIORITY) {
      const candidate = thumbnails[size];
      if (candidate?.url) {
        return candidate.url;
      }
    }

    const fallback = Object.values(thumbnails).find((item) => item?.url);
    if (fallback?.url) {
      return fallback.url;
    }
  }

  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
};

const normalizeVideos = (videos: z.infer<typeof videoDetailsSchema>['items'], order: string[]) => {
  const map = new Map<string, AmvVideo>();

  videos.forEach((video) => {
    const durationSeconds = parseIsoDuration(video.contentDetails.duration);
    const description = (video.snippet.description ?? '').trim();
    const publishedAt = video.snippet.publishedAt ?? new Date().toISOString();

    map.set(video.id, {
      id: video.id,
      title: video.snippet.title,
      description,
      thumbnail: resolveThumbnail(video.snippet.thumbnails, video.id),
      publishedAt,
      durationSeconds,
    });
  });

  return order
    .map((id) => map.get(id))
    .filter((video): video is AmvVideo => Boolean(video));
};

export type FetchAmvVideosOptions = {
  limit?: number;
  fetcher?: Fetcher;
  apiKey?: string;
  playlistId?: string;
  channelId?: string;
};

export const fetchAmvVideos = async (options: FetchAmvVideosOptions = {}): Promise<AmvVideo[]> => {
  const fetcher = ensureFetcher(options.fetcher);
  const limit = options.limit ?? DEFAULT_MAX_RESULTS;
  const apiKey = options.apiKey ?? env.YOUTUBE_API_KEY;
  const playlistId = (options.playlistId ?? env.YOUTUBE_PLAYLIST_ID ?? '').trim();
  const channelId = (options.channelId ?? env.YOUTUBE_CHANNEL_ID ?? '').trim();

  const source = resolveSourceConfig(playlistId, channelId);
  const ids = await fetchVideoIds(source, limit, fetcher, apiKey);
  if (ids.length === 0) {
    return [];
  }

  const details = await fetchVideoDetails(ids, fetcher, apiKey);
  return normalizeVideos(details, ids);
};

export type RefreshAmvListOptions = FetchAmvVideosOptions & {
  cache?: Pick<AmvCacheClient, 'getAmvList' | 'setAmvList'>;
  now?: () => Date;
};

export type RefreshAmvListResult = {
  ok: boolean;
  source: 'api' | 'cache';
  videos: AmvVideo[];
  syncedAt: string | null;
  message: string;
  error?: string;
  meta?: Record<string, unknown>;
};

const defaultCache: Pick<AmvCacheClient, 'getAmvList' | 'setAmvList'> = {
  getAmvList,
  setAmvList,
};

export const refreshAmvList = async (
  options: RefreshAmvListOptions = {}
): Promise<RefreshAmvListResult> => {
  const cache = options.cache ?? defaultCache;
  const now = options.now ?? (() => new Date());

  try {
    const videos = await fetchAmvVideos(options);
    const syncedAt = now().toISOString();
    const payload: AmvListResponse = {
      videos,
      syncedAt,
    };

    await cache.setAmvList(payload);

    return {
      ok: true,
      source: 'api',
      videos,
      syncedAt,
      message: `Synced ${videos.length} videos from YouTube.`,
      meta: { count: videos.length },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown YouTube sync error';
    captureException(error, {
      context: 'youtube.refreshAmvList',
      extra: {
        message,
      },
    });

    const fallback = await cache.getAmvList();
    if (fallback) {
      return {
        ok: true,
        source: 'cache',
        videos: fallback.videos,
        syncedAt: fallback.syncedAt,
        message: 'Falling back to cached AMV dataset after sync failure.',
        error: message,
        meta: { count: fallback.videos.length },
      };
    }

    return {
      ok: false,
      source: 'api',
      videos: [],
      syncedAt: null,
      message: 'Failed to refresh AMV dataset.',
      error: message,
    };
  }
};

export const getCachedAmvList = getAmvList;
