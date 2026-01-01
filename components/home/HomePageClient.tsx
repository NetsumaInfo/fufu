"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Youtube, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MemberCard } from "@/components/team/MemberCard";
import { MemberDialog } from "@/components/team/MemberDialog";
import { VideoCard } from "@/components/videos/VideoCard";
import { HeroVideo } from "@/components/home/HeroVideo";
import { Member, Video } from "@/lib/types";
import { getAllMembers } from "@/lib/data/members";

import { useTranslation } from "@/lib/context/TranslationContext";

const YOUTUBE_CHANNEL = "https://www.youtube.com/@FulguriaTeam";

interface HomePageClientProps {
    initialVideos: Video[];
}

// Motion variants for carousel items - matching Motion.dev tutorial
const carouselVariants = {
    open: {
        transition: {
            staggerChildren: 0.07,
            delayChildren: 0.2
        }
    },
    closed: {
        transition: {
            staggerChildren: 0.05,
            staggerDirection: -1
        }
    }
};

const itemVariants = {
    open: {
        y: 0,
        opacity: 1,
        transition: {
            y: { stiffness: 1000, velocity: -100 }
        }
    },
    closed: {
        y: 50,
        opacity: 0,
        transition: {
            y: { stiffness: 1000 }
        }
    }
};

// Generic Carousel Component for horizontal scrolling
interface CarouselProps<T> {
    items: T[];
    renderItem: (item: T) => React.ReactNode;
    itemWidth: string; // e.g., "w-[320px] md:w-[380px]"
    emptyMessage?: React.ReactNode;
}

function Carousel<T extends { id: string }>({
    items,
    renderItem,
    itemWidth,
    emptyMessage
}: CarouselProps<T>) {
    const { t } = useTranslation();
    const containerRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const checkScrollPosition = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;

        const { scrollLeft, scrollWidth, clientWidth } = container;
        setShowLeftArrow(scrollLeft > 50);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 50);
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        checkScrollPosition();

        // Scroll event listener
        container.addEventListener("scroll", checkScrollPosition);
        window.addEventListener("resize", checkScrollPosition);

        return () => {
            container.removeEventListener("scroll", checkScrollPosition);
            window.removeEventListener("resize", checkScrollPosition);
        };
    }, [checkScrollPosition]);

    const handleScroll = (direction: "left" | "right") => {
        const container = containerRef.current;
        if (!container) return;

        const scrollAmount = direction === "left" ? -400 : 400;
        container.scrollBy({
            left: scrollAmount,
            behavior: "smooth",
        });
    };

    if (items.length === 0 && emptyMessage) {
        return <>{emptyMessage}</>;
    }

    return (
        <div className="relative group/carousel">
            {/* Left arrow - XL+ screens: outside, always visible */}
            {showLeftArrow && (
                <button
                    type="button"
                    onClick={() => handleScroll("left")}
                    className="hidden xl:flex absolute -left-16 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center bg-black/40 hover:bg-black/70 border border-white/20 rounded-full shadow-xl transition-all opacity-60 hover:opacity-100 z-30"
                    aria-label={t('common.previous')}
                >
                    <ChevronLeft className="w-6 h-6 text-white" />
                </button>
            )}

            {/* Left arrow - MD to XL screens: inside, hover to show */}
            {showLeftArrow && (
                <div className="hidden md:block xl:hidden absolute left-0 top-0 bottom-0 w-16 z-30 group/left">
                    <button
                        type="button"
                        onClick={() => handleScroll("left")}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-black/40 hover:bg-black/70 border border-white/20 rounded-full shadow-xl transition-all opacity-0 group-hover/left:opacity-100"
                        aria-label={t('common.previous')}
                    >
                        <ChevronLeft className="w-6 h-6 text-white" />
                    </button>
                </div>
            )}

            {/* Right arrow - XL+ screens: outside, always visible */}
            {showRightArrow && (
                <button
                    type="button"
                    onClick={() => handleScroll("right")}
                    className="hidden xl:flex absolute -right-16 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center bg-black/40 hover:bg-black/70 border border-white/20 rounded-full shadow-xl transition-all opacity-60 hover:opacity-100 z-30"
                    aria-label={t('common.next')}
                >
                    <ChevronRight className="w-6 h-6 text-white" />
                </button>
            )}

            {/* Right arrow - MD to XL screens: inside, hover to show */}
            {showRightArrow && (
                <div className="hidden md:block xl:hidden absolute right-0 top-0 bottom-0 w-16 z-30 group/right">
                    <button
                        type="button"
                        onClick={() => handleScroll("right")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-black/40 hover:bg-black/70 border border-white/20 rounded-full shadow-xl transition-all opacity-0 group-hover/right:opacity-100"
                        aria-label={t('common.next')}
                    >
                        <ChevronRight className="w-6 h-6 text-white" />
                    </button>
                </div>
            )}

            <motion.div
                ref={containerRef}
                className="flex gap-4 md:gap-6 overflow-x-auto pb-4 px-2 sm:px-4 snap-x snap-mandatory scroll-smooth"
                style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    WebkitOverflowScrolling: "touch",
                }}
                variants={carouselVariants}
                initial="closed"
                animate="open"
            >
                <style jsx>{`
                    div::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>
                {items.map((item, index) => (
                    <motion.div
                        key={item.id}
                        className={`flex-shrink-0 ${itemWidth} snap-start`}
                        variants={itemVariants}
                        custom={index}
                    >
                        <div className="p-2">
                            {renderItem(item)}
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}

export function HomePageClient({ initialVideos }: HomePageClientProps) {
    const { t } = useTranslation();
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const allMembers = getAllMembers();

    return (
        <div>
            {/* Hero Video */}
            <HeroVideo />

            {/* Main Content - appears after hero with proper z-index and background */}
            <div className="relative z-10 bg-background">
                {/* Section Team */}
                <section className="py-12 md:py-16 lg:py-20 pt-16 md:pt-20">
                    <div className="container-custom">
                        <div className="text-center mb-8 md:mb-12">
                            <Link href="/team" className="inline-block group">
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                                    {t('home.team_section')}
                                </h2>
                            </Link>
                        </div>

                        {/* Member Carousel */}
                        <Carousel
                            items={allMembers}
                            itemWidth="w-[280px] sm:w-[300px] md:w-[320px]"
                            renderItem={(member) => (
                                <MemberCard
                                    member={member}
                                    onClick={() => setSelectedMember(member)}
                                />
                            )}
                        />
                    </div>
                </section>

                {/* Section Vidéos */}
                <section className="py-12 md:py-16">
                    <div className="container-custom">
                        {/* Video Header with Link - same style as Team */}
                        <div className="text-center mb-8 md:mb-12">
                            <Link href="/videos" className="inline-block group">
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                                    {t('home.videos_section')}
                                </h2>
                            </Link>
                        </div>

                        {/* Video Carousel */}
                        <Carousel
                            items={initialVideos}
                            itemWidth="w-[300px] sm:w-[340px] md:w-[380px]"
                            renderItem={(video) => <VideoCard video={video} />}
                            emptyMessage={
                                <div className="text-center py-12">
                                    <p className="text-muted-foreground mb-4">
                                        {t('common.empty_videos')}
                                    </p>
                                    <Button asChild variant="primary">
                                        <Link href={YOUTUBE_CHANNEL} target="_blank">
                                            <Youtube className="w-4 h-4" />
                                            {t('common.visit_youtube')}
                                        </Link>
                                    </Button>
                                </div>
                            }
                        />
                    </div>
                </section>

                {/* Dialog membre */}
                <MemberDialog
                    member={selectedMember}
                    isOpen={!!selectedMember}
                    onClose={() => setSelectedMember(null)}
                />
            </div>
        </div>
    );
}
