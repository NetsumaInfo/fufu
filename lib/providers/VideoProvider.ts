import { Video } from "../types";
import { videos as mockVideos } from "../data/videos";
import { fetchVideosFromAPI, fetchAllVideosFromAPI } from "../services/youtubeApi";

export interface VideoProviderOptions {
    maxResults?: number;
    useCache?: boolean;
}

class VideoProvider {
    /**
     * Fetch latest videos
     * Prefers YouTube API -> Mock
     */
    async getLatestVideos(options: VideoProviderOptions = {}): Promise<Video[]> {
        const { maxResults = 6 } = options;

        // 1. Try YouTube API (Best quality)
        if (process.env.YOUTUBE_API_KEY) {
            try {
                const apiVideos = await fetchVideosFromAPI(maxResults);
                if (apiVideos.length > 0) return apiVideos;
            } catch (err) {
                console.warn("API fetch failed, falling back to mock");
            }
        }

        // 2. Fallback to Mock Data
        return mockVideos.slice(0, maxResults);
    }

    /**
     * Fetch all videos from YouTube channel (with pagination)
     */
    async getAllVideos(): Promise<Video[]> {
        // 1. Try YouTube API with pagination
        if (process.env.YOUTUBE_API_KEY) {
            try {
                // Fetch up to 200 videos (4 pages of 50)
                const apiVideos = await fetchAllVideosFromAPI(4);
                if (apiVideos.length > 0) return apiVideos;
            } catch (err) {
                console.warn("API fetch failed, falling back to mock");
            }
        }

        // 2. Fallback to Mock Data
        return mockVideos;
    }
}

export const videoProvider = new VideoProvider();

export async function getLatestVideos(count: number = 6): Promise<Video[]> {
    return videoProvider.getLatestVideos({ maxResults: count });
}

export async function getAllVideos(): Promise<Video[]> {
    return videoProvider.getAllVideos();
}
