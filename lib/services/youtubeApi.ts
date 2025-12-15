import { Video } from "@/lib/types";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

export async function fetchVideosFromAPI(maxResults: number = 6): Promise<Video[]> {
    if (!YOUTUBE_API_KEY || !YOUTUBE_CHANNEL_ID) {
        console.warn("YouTube API credentials missing");
        return [];
    }

    // Convert Channel ID to Uploads Playlist ID (UC -> UU)
    const uploadsPlaylistId = YOUTUBE_CHANNEL_ID.replace(/^UC/, "UU");

    try {
        const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`;

        const response = await fetch(url, {
            next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!response.ok) {
            console.error(`YouTube API Error: ${response.statusText}`);
            return [];
        }

        const data = await response.json();

        // Safe check for items array
        if (!data.items || !Array.isArray(data.items)) {
            console.warn("YouTube API: No items in response");
            return [];
        }

        return data.items.map((item: any) => {
            const snippet = item?.snippet || {};
            const contentDetails = item?.contentDetails || {};
            const thumbnails = snippet.thumbnails || {};
            const videoId = contentDetails.videoId || snippet.resourceId?.videoId || "unknown";

            // Robust thumbnail with fallback
            const thumbnailUrl =
                thumbnails.maxres?.url ||
                thumbnails.standard?.url ||
                thumbnails.high?.url ||
                thumbnails.medium?.url ||
                thumbnails.default?.url ||
                "/assets/roster/Logo_Fulguria_White.png";

            return {
                id: videoId,
                title: snippet.title || "Sans titre",
                url: `https://www.youtube.com/watch?v=${videoId}`,
                thumbnailUrl: thumbnailUrl,
                publishedAt: snippet.publishedAt || new Date().toISOString(),
                description: snippet.description || "",
            };
        });

    } catch (error) {
        console.error("Error fetching YouTube API:", error);
        return [];
    }
}
