import { getAllVideos } from "@/lib/providers/VideoProvider";
import { VideosPageClient } from "@/components/videos/VideosPageClient";

// Force dynamic rendering to access runtime env vars
export const dynamic = 'force-dynamic';

export default async function VideosPage() {
    const videos = await getAllVideos();

    return <VideosPageClient initialVideos={videos} />;
}
