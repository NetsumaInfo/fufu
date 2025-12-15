"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Youtube } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MemberCard } from "@/components/team/MemberCard";
import { MemberDialog } from "@/components/team/MemberDialog";
import { VideoCard } from "@/components/videos/VideoCard";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { SlideIn } from "@/components/animations/SlideIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";
import { Member, Video } from "@/lib/types";
import { getFeaturedMembers } from "@/lib/data/members";

const YOUTUBE_CHANNEL = "https://www.youtube.com/@FulguriaTeam";

interface HomePageClientProps {
    initialVideos: Video[];
}

export function HomePageClient({ initialVideos }: HomePageClientProps) {
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const featuredMembers = getFeaturedMembers();

    // Use initialVideos passed from server, or empty if fail
    const videos = initialVideos;

    return (
        <div>
            {/* Team Preview Section */}
            <section className="py-20 pt-28">
                <div className="container-custom">
                    {/* Team Header with Link */}
                    <div className="text-center mb-12">
                        <Link
                            href="/team"
                            className="inline-block group"
                        >
                            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                                Membre de notre team
                            </h2>
                            <div className="h-1 w-24 bg-primary mx-auto rounded-full group-hover:w-32 transition-all" />
                        </Link>
                    </div>

                    <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {featuredMembers.map((member) => (
                            <StaggerItem key={member.id}>
                                <MemberCard
                                    member={member}
                                    onClick={() => setSelectedMember(member)}
                                />
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                </div>
            </section>

            {/* Latest Videos Section */}
            <section className="py-16">
                <div className="container-custom">
                    <SlideIn direction="up">
                        <SectionHeader
                            subtitle="Nos créations"
                            title="Dernières vidéos"
                            description="Découvrez nos derniers AMV et créations visuelles."
                            action={
                                <Button asChild variant="secondary">
                                    <Link href={YOUTUBE_CHANNEL} target="_blank">
                                        <Youtube className="w-4 h-4" />
                                        Voir la chaîne YouTube
                                    </Link>
                                </Button>
                            }
                        />
                    </SlideIn>

                    {/* Videos Grid */}
                    {videos.length > 0 ? (
                        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {videos.map((video) => (
                                <StaggerItem key={video.id}>
                                    <VideoCard video={video} />
                                </StaggerItem>
                            ))}
                        </StaggerContainer>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground mb-4">Aucune vidéo disponible pour le moment.</p>
                            <Button asChild variant="primary">
                                <Link href={YOUTUBE_CHANNEL} target="_blank">
                                    <Youtube className="w-4 h-4" />
                                    Visiter notre chaîne YouTube
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* Member Dialog */}
            <MemberDialog
                member={selectedMember}
                isOpen={!!selectedMember}
                onClose={() => setSelectedMember(null)}
            />
        </div>
    );
}
