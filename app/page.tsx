import { getAllVideos } from "@/lib/providers/VideoProvider";
import { HomePageClient } from "@/components/home/HomePageClient";

// Force dynamic rendering to access runtime env vars
export const dynamic = 'force-dynamic';

export default async function HomePage() {
    // Load all available videos for infinite scroll
    const videos = await getAllVideos();

    return <HomePageClient initialVideos={videos} />;
}
