export type AmvVideo = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  durationSeconds: number;
};

export type AmvListResponse = {
  videos: AmvVideo[];
  syncedAt: string;
};
