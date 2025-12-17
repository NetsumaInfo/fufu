import { getAllVideos } from "@/lib/providers/VideoProvider";
import { HomePageClient } from "@/components/home/HomePageClient";

export const revalidate = 3600; // Revalidate page every hour

export default async function HomePage() {
    // Load all available videos for infinite scroll
    const videos = await getAllVideos();

    return <HomePageClient initialVideos={videos} />;
}
