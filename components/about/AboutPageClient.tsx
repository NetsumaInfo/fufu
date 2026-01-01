"use client";

import { useState } from "react";
import Link from "next/link";
import { Youtube } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MemberCard } from "@/components/team/MemberCard";
import { MemberDialog } from "@/components/team/MemberDialog";
import { VideoCard } from "@/components/videos/VideoCard";
import { FadeIn } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";
import { Member, Video } from "@/lib/types";
import { getAllMembers } from "@/lib/data/members";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/context/TranslationContext";

interface AboutPageClientProps {
    videos: Video[];
}

type TabType = "membres" | "nous";

export function AboutPageClient({ videos }: AboutPageClientProps) {
    const [activeTab, setActiveTab] = useState<TabType>("membres");
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const members = getAllMembers();
    const { t } = useTranslation();

    return (
        <div className="py-12 pt-28 md:py-16 md:pt-32">
            <div className="container-custom">
                {/* Tab Navigation */}
                <FadeIn>
                    <div className="flex justify-center gap-4 mb-12">
                        <button
                            onClick={() => setActiveTab("nous")}
                            className={cn(
                                "px-8 py-3 text-lg font-bold uppercase tracking-wider transition-all duration-300 transform skew-x-[-6deg]",
                                activeTab === "nous"
                                    ? "bg-foreground text-background"
                                    : "bg-card border border-border text-foreground hover:bg-foreground/10"
                            )}
                        >
                            <span className="block skew-x-[6deg]">{t('about.tab_videos')}</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("membres")}
                            className={cn(
                                "px-8 py-3 text-lg font-bold uppercase tracking-wider transition-all duration-300 transform skew-x-[-6deg]",
                                activeTab === "membres"
                                    ? "bg-foreground text-background"
                                    : "bg-card border border-border text-foreground hover:bg-foreground/10"
                            )}
                        >
                            <span className="block skew-x-[6deg]">{t('about.tab_members')}</span>
                        </button>
                    </div>
                </FadeIn>

                {/* Tab Content */}
                {activeTab === "membres" ? (
                    <FadeIn key="membres">
                        {/* Members Grid - No role titles, just cards */}
                        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                            {members.map((member) => (
                                <StaggerItem key={member.id}>
                                    <MemberCard
                                        member={member}
                                        onClick={() => setSelectedMember(member)}
                                    />
                                </StaggerItem>
                            ))}
                        </StaggerContainer>
                    </FadeIn>
                ) : (
                    <FadeIn key="nous">
                        {/* Videos Section */}
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
                                        {t('common.empty_videos')}
                                    </p>
                                    <Button asChild variant="primary">
                                        <Link href="https://youtube.com/@fulguria" target="_blank">
                                            {t('common.visit_youtube')}
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </FadeIn>
                )}
            </div>

            {/* Member Dialog */}
            <MemberDialog
                member={selectedMember}
                isOpen={!!selectedMember}
                onClose={() => setSelectedMember(null)}
            />
        </div>
    );
}
