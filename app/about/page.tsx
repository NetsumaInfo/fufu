import { getAllVideos } from "@/lib/providers/VideoProvider";
import { AboutPageClient } from "@/components/about/AboutPageClient";

// Force dynamic rendering to access runtime env vars
export const dynamic = 'force-dynamic';

export default async function AboutPage() {
    const videos = await getAllVideos();

    return <AboutPageClient videos={videos} />;
}
