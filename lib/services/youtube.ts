import { Video } from "../types";

/**
 * YouTube Service
 * Handles fetching video data from YouTube RSS feed without an API key.
 * 
 * RSS Feed URL: https://www.youtube.com/feeds/videos.xml?channel_id=CHANNEL_ID
 */

// REGEX for parsing XML (simpler and lighter than importing an XML parser)
const REGEX = {
    entry: /<entry>([\s\S]*?)<\/entry>/g,
    videoId: /<yt:videoId>(.*?)<\/yt:videoId>/,
    channelId: /<yt:channelId>(.*?)<\/yt:channelId>/,
    title: /<title>(.*?)<\/title>/,
    published: /<published>(.*?)<\/published>/,
    thumbnail: /<media:thumbnail url="(.*?)"/,
    description: /<media:description>([\s\S]*?)<\/media:description>/,
    views: /<media:statistics views="(\d+)"/,
};

export async function fetchVideosFromRSS(channelId: string): Promise<Video[]> {
    try {
        const response = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, {
            next: { revalidate: 3600 }, // Rewrite cache every hour
        });

        if (!response.ok) {
            console.error(`Failed to fetch YouTube RSS: ${response.statusText}`);
            return [];
        }

        const xml = await response.text();
        const videos: Video[] = [];

        let match;
        while ((match = REGEX.entry.exec(xml)) !== null) {
            const entry = match[1];

            const videoIdMatch = entry.match(REGEX.videoId);
            const titleMatch = entry.match(REGEX.title);
            const publishedMatch = entry.match(REGEX.published);
            const thumbnailMatch = entry.match(REGEX.thumbnail);
            // RSS feed often provides default thumbnail, we can construct high-res one
            // Description in RSS is often truncated or missing, but we grab it if there

            if (videoIdMatch && titleMatch) {
                const videoId = videoIdMatch[1];
                videos.push({
                    id: videoId,
                    title: titleMatch[1],
                    url: `https://www.youtube.com/watch?v=${videoId}`,
                    thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`, // Try maxres first
                    publishedAt: publishedMatch ? publishedMatch[1] : new Date().toISOString(),
                    description: "", // RSS descriptions are often messy HTML
                    views: 0, // RSS doesn't give view counts usually
                });
            }
        }

        return videos;
    } catch (error) {
        console.error("Error fetching YouTube videos:", error);
        return [];
    }
}
