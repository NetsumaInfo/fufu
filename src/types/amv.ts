export type AmvVideo = {
  id: string;
  title: string;
  synopsis: string;
  youtubeId: string;
  publishedAt: string;
  thumbnailUrl: string;
  durationSeconds?: number;
  createdBy?: string;
};

export type AmvCollection = {
  updatedAt: string;
  videos: AmvVideo[];
};
