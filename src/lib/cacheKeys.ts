export const cacheKeys = {
  amvList: 'amv:list',
  amvLastSync: 'amv:lastSync',
} as const;

export type CacheKey = (typeof cacheKeys)[keyof typeof cacheKeys];
