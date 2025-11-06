import type { AmvListResponse, AmvVideo } from '@/types/amv';

export const playlistItemsFixture = {
  items: [
    {
      contentDetails: {
        videoId: 'video-1',
      },
    },
    {
      contentDetails: {
        videoId: 'video-2',
      },
    },
  ],
};

export const channelSearchFixture = {
  items: [
    {
      id: { videoId: 'video-1' },
    },
    {
      id: { videoId: 'video-2' },
    },
  ],
};

export const videosFixture = {
  items: [
    {
      id: 'video-1',
      snippet: {
        title: 'First AMV',
        description: ' A detailed description of the first AMV. ',
        publishedAt: '2024-10-01T12:00:00Z',
        thumbnails: {
          maxres: { url: 'https://img.youtube.com/vi/video-1/maxres.jpg' },
        },
      },
      contentDetails: {
        duration: 'PT4M13S',
      },
    },
    {
      id: 'video-2',
      snippet: {
        title: 'Second AMV',
        description: '',
        publishedAt: '2024-09-21T08:30:00Z',
        thumbnails: {
          high: { url: 'https://img.youtube.com/vi/video-2/hqdefault.jpg' },
        },
      },
      contentDetails: {
        duration: 'PT1H2M15S',
      },
    },
  ],
};

export const normalizedVideos: AmvVideo[] = [
  {
    id: 'video-1',
    title: 'First AMV',
    description: 'A detailed description of the first AMV.',
    thumbnail: 'https://img.youtube.com/vi/video-1/maxres.jpg',
    publishedAt: '2024-10-01T12:00:00Z',
    durationSeconds: 253,
  },
  {
    id: 'video-2',
    title: 'Second AMV',
    description: '',
    thumbnail: 'https://img.youtube.com/vi/video-2/hqdefault.jpg',
    publishedAt: '2024-09-21T08:30:00Z',
    durationSeconds: 3735,
  },
];

export const cachedAmvList: AmvListResponse = {
  videos: normalizedVideos,
  syncedAt: '2024-10-05T00:00:00Z',
};
