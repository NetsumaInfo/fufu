"use client";

import Link from "next/link";
import { Youtube } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { VideoCard } from "@/components/videos/VideoCard";
import { FadeIn } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";
import { Video } from "@/lib/types";

interface VideosPageClientProps {
    initialVideos: Video[];
}

export function VideosPageClient({ initialVideos }: VideosPageClientProps) {
    const videos = initialVideos;

    return (
        <div className="py-12 pt-28 md:py-16 md:pt-32">
            <div className="container-custom">
                <FadeIn>
                    <SectionHeader
                        title="Nos vidéos"
                        description="Découvrez toutes nos créations : AMV, montages, et contenus visuels. Chaque vidéo est le résultat d'un travail passionné et créatif."
                        centered
                        action={
                            <Button asChild size="lg">
                                <Link href="https://youtube.com/@fulguria" target="_blank">
                                    <Youtube className="w-5 h-5" />
                                    Voir la chaîne YouTube
                                </Link>
                            </Button>
                        }
                    />
                </FadeIn>

                <div className="mt-8 md:mt-12">
                    {videos.length > 0 ? (
                        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {videos.map((video) => (
                                <StaggerItem key={video.id}>
                                    <VideoCard video={video} />
                                </StaggerItem>
                            ))}
                        </StaggerContainer>
                    ) : (
                        <div className="text-center py-20">
                            <div className="glass rounded-2xl p-12 max-w-md mx-auto">
                                <Youtube className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                <p className="text-lg text-muted-foreground mb-6">
                                    Aucune vidéo disponible pour le moment.
                                </p>
                                <Button asChild variant="primary">
                                    <Link href="https://youtube.com/@fulguria" target="_blank">
                                        Visiter notre chaîne YouTube
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
