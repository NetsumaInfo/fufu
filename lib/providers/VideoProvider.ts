import { Video } from "../types";
import { videos as mockVideos } from "../data/videos";

export interface VideoProviderOptions {
    maxResults?: number;
    useCache?: boolean;
}

class VideoProvider {
    /**
     * Fetch latest videos
     * Reverted to Mock only
     */
    async getLatestVideos(options: VideoProviderOptions = {}): Promise<Video[]> {
        const { maxResults = 6 } = options;
        console.log("[VideoProvider] getLatestVideos called (Mock)");
        return mockVideos.slice(0, maxResults);
    }

    /**
     * Fetch all videos
     * Reverted to Mock only
     */
    async getAllVideos(): Promise<Video[]> {
        console.log("[VideoProvider] getAllVideos called (Mock)");
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
