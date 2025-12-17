import { Video } from "@/lib/types";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

interface YouTubeAPIResponse {
    items: any[];
    nextPageToken?: string;
}

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

        const data: YouTubeAPIResponse = await response.json();

        // Safe check for items array
        if (!data.items || !Array.isArray(data.items)) {
            console.warn("YouTube API: No items in response");
            return [];
        }

        return mapYouTubeItems(data.items);
    } catch (error) {
        console.error("Error fetching YouTube API:", error);
        return [];
    }
}

/**
 * Fetch all available videos from YouTube channel (with pagination)
 * @param maxPages Maximum number of API pages to fetch (default: 4 = 200 videos max)
 */
export async function fetchAllVideosFromAPI(maxPages: number = 4): Promise<Video[]> {
    if (!YOUTUBE_API_KEY || !YOUTUBE_CHANNEL_ID) {
        console.warn("YouTube API credentials missing");
        return [];
    }

    const uploadsPlaylistId = YOUTUBE_CHANNEL_ID.replace(/^UC/, "UU");
    const allVideos: Video[] = [];
    let pageToken: string | undefined = undefined;
    let pageCount = 0;

    try {
        while (pageCount < maxPages) {
            const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=50${pageToken ? `&pageToken=${pageToken}` : ''}&key=${YOUTUBE_API_KEY}`;

            const response = await fetch(url, {
                next: { revalidate: 3600 }, // Cache for 1 hour
            });

            if (!response.ok) {
                console.error(`YouTube API Error: ${response.statusText}`);
                break;
            }

            const data: YouTubeAPIResponse = await response.json();

            if (!data.items || !Array.isArray(data.items)) {
                console.warn("YouTube API: No items in response");
                break;
            }

            allVideos.push(...mapYouTubeItems(data.items));
            pageCount++;

            // Check if there's a next page
            if (!data.nextPageToken) {
                console.log(`Loaded all videos after ${pageCount} pages`);
                break;
            }

            pageToken = data.nextPageToken;
        }

        console.log(`Fetched ${allVideos.length} videos from YouTube API`);
        return allVideos;
    } catch (error) {
        console.error("Error fetching all YouTube videos:", error);
        return allVideos; // Return what we have so far
    }
}

/**
 * Map YouTube API items to Video objects
 */
function mapYouTubeItems(items: any[]): Video[] {
    return items.map((item: any) => {
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
            "/images/team/Logo/Logo_Fulguria_White.png";

        return {
            id: videoId,
            title: snippet.title || "Sans titre",
            url: `https://www.youtube.com/watch?v=${videoId}`,
            thumbnailUrl: thumbnailUrl,
            publishedAt: snippet.publishedAt || new Date().toISOString(),
            description: snippet.description || "",
        };
    });
}
