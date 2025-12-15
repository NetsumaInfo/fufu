import { getLatestVideos } from "@/lib/providers/VideoProvider";
import { HomePageClient } from "@/components/home/HomePageClient";

export const revalidate = 3600; // Revalidate page every hour

export default async function HomePage() {
    const videos = await getLatestVideos(6);

    return <HomePageClient initialVideos={videos} />;
}
