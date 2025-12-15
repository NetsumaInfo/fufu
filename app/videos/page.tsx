import { getAllVideos } from "@/lib/providers/VideoProvider";
import { VideosPageClient } from "@/components/videos/VideosPageClient";

export const revalidate = 3600; // Revalidate every hour

export default async function VideosPage() {
    const videos = await getAllVideos();

    return <VideosPageClient initialVideos={videos} />;
}
