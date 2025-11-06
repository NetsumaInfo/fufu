import { describe, expect, it, vi } from 'vitest';

import { fetchAmvVideos, refreshAmvList } from '@/lib/youtube';
import {
  cachedAmvList,
  channelSearchFixture,
  normalizedVideos,
  playlistItemsFixture,
  videosFixture,
} from '../mocks/youtube';

type MockResponse = {
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
  text: () => Promise<string>;
};

const createResponse = (body: unknown, status = 200): MockResponse => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
  text: async () => JSON.stringify(body),
});

const createFetchMock = (overrides: Partial<Record<'playlistItems' | 'search' | 'videos', unknown>>) =>
  vi.fn(async (url: string) => {
    if (url.includes('playlistItems')) {
      return createResponse(overrides.playlistItems ?? playlistItemsFixture);
    }

    if (url.includes('search')) {
      return createResponse(overrides.search ?? channelSearchFixture);
    }

    if (url.includes('videos')) {
      return createResponse(overrides.videos ?? videosFixture);
    }

    return createResponse({}, 404);
  });

describe('fetchAmvVideos', () => {
  it('normalizes playlist responses into AMV video structures', async () => {
    const fetcher = createFetchMock({});

    const videos = await fetchAmvVideos({
      fetcher,
      apiKey: 'test-key',
      playlistId: 'playlist-123',
      channelId: '',
    });

    expect(videos).toEqual(normalizedVideos);
    expect(fetcher).toHaveBeenCalledWith(expect.stringContaining('playlistItems'));
    expect(fetcher).toHaveBeenCalledWith(expect.stringContaining('videos'));
  });

  it('falls back to channel search when playlist ID is not provided', async () => {
    const fetcher = createFetchMock({});

    const videos = await fetchAmvVideos({
      fetcher,
      apiKey: 'test-key',
      playlistId: '',
      channelId: 'channel-xyz',
    });

    expect(videos).toEqual(normalizedVideos);
    expect(fetcher).toHaveBeenCalledWith(expect.stringContaining('search'));
  });
});

describe('refreshAmvList', () => {
  it('stores refreshed videos in cache when API succeeds', async () => {
    const fetcher = createFetchMock({});
    const setAmvList = vi.fn(async () => {});
    const now = () => new Date('2024-11-05T00:00:00Z');

    const result = await refreshAmvList({
      fetcher,
      apiKey: 'test-key',
      playlistId: 'playlist-123',
      channelId: '',
      cache: {
        getAmvList: async () => null,
        setAmvList,
      },
      now,
    });

    expect(result.ok).toBe(true);
    expect(result.source).toBe('api');
    expect(result.syncedAt).toBe('2024-11-05T00:00:00.000Z');
    expect(result.videos).toEqual(normalizedVideos);
    expect(setAmvList).toHaveBeenCalledWith({
      videos: normalizedVideos,
      syncedAt: '2024-11-05T00:00:00.000Z',
    });
  });

  it('returns cached dataset when refresh fails', async () => {
    const fetcher = vi.fn(async () => {
      throw new Error('Quota exhausted');
    });

    const setAmvList = vi.fn();

    const result = await refreshAmvList({
      fetcher,
      apiKey: 'test-key',
      playlistId: 'playlist-123',
      channelId: '',
      cache: {
        getAmvList: async () => cachedAmvList,
        setAmvList,
      },
      now: () => new Date('2024-11-05T00:00:00Z'),
    });

    expect(result.ok).toBe(true);
    expect(result.source).toBe('cache');
    expect(result.videos).toEqual(cachedAmvList.videos);
    expect(result.syncedAt).toBe(cachedAmvList.syncedAt);
    expect(result.error).toMatch(/Quota exhausted/);
    expect(setAmvList).not.toHaveBeenCalled();
  });

  it('propagates failure when no cached dataset exists', async () => {
    const fetcher = vi.fn(async () => {
      throw new Error('Quota exhausted');
    });

    const result = await refreshAmvList({
      fetcher,
      apiKey: 'test-key',
      playlistId: 'playlist-123',
      channelId: '',
      cache: {
        getAmvList: async () => null,
        setAmvList: async () => {},
      },
      now: () => new Date('2024-11-05T00:00:00Z'),
    });

    expect(result.ok).toBe(false);
    expect(result.source).toBe('api');
    expect(result.videos).toEqual([]);
    expect(result.syncedAt).toBeNull();
    expect(result.error).toMatch(/Quota exhausted/);
  });
});
