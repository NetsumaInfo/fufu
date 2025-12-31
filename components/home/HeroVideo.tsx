"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { ChevronDown, Volume2, VolumeX } from "lucide-react";
import { getVideoUrl } from "@/lib/config/storage";

// Liste des vidéos disponibles
const VIDEOS = [
    { src: getVideoUrl("Aether.webm"), title: "Aether" },
    { src: getVideoUrl("KiRr_-_Shizuku_II.webm"), title: "KiRr - Shizuku II" },
    { src: getVideoUrl("Lunikyuu_-_Stardust_Universe.webm"), title: "Lunikyuu - Stardust Universe" },
    { src: getVideoUrl("Zeph83_-_Anxius.webm"), title: "Zeph83 - Anxius" },
    { src: getVideoUrl("Zeph_Lunikyuu_-_Billouuu_3.webm"), title: "Zeph & Lunikyuu - Billouuu 3" },
];

export function HeroVideo() {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const prevIndexRef = useRef(0);
    const lastNonZeroVolumeRef = useRef(20); // For unmute button

    const [volume, setVolume] = useState(0); // UI slider value (always starts at 0)
    const [isVideoReady, setIsVideoReady] = useState(false);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    // Scroll-based animations
    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 600], [1, 0]);
    const scale = useTransform(scrollY, [0, 600], [1, 1.15]);
    const y = useTransform(scrollY, [0, 600], [0, 150]);

    const smoothOpacity = useSpring(opacity, { stiffness: 100, damping: 30 });
    const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 });
    const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

    // Apply volume directly to video
    const applyVolumeToVideo = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;
        video.volume = volume / 100;
        video.muted = volume === 0;
    }, [volume]);

    // Sync volume whenever it changes
    useEffect(() => {
        applyVolumeToVideo();
        if (volume > 0) {
            lastNonZeroVolumeRef.current = volume;
        }
    }, [volume, applyVolumeToVideo]);

    // Handle volume slider changes
    const handleVolumeChange = useCallback((newVolume: number) => {
        setVolume(newVolume);
    }, []);

    // Toggle mute/unmute
    const toggleMute = useCallback(() => {
        if (volume > 0) {
            lastNonZeroVolumeRef.current = volume;
            setVolume(0);
        } else {
            setVolume(lastNonZeroVolumeRef.current);
        }
    }, [volume]);

    // Navigation functions
    const goToNextVideo = useCallback(() => {
        if (isTransitioning) return;
        prevIndexRef.current = currentVideoIndex;
        setIsTransitioning(true);
        setIsVideoReady(false);
        setCurrentVideoIndex((prev) => (prev + 1) % VIDEOS.length);
    }, [isTransitioning, currentVideoIndex]);

    const goToPrevVideo = useCallback(() => {
        if (isTransitioning) return;
        prevIndexRef.current = currentVideoIndex;
        setIsTransitioning(true);
        setIsVideoReady(false);
        setCurrentVideoIndex((prev) => (prev - 1 + VIDEOS.length) % VIDEOS.length);
    }, [isTransitioning, currentVideoIndex]);

    const goToVideo = useCallback((index: number) => {
        if (isTransitioning || index === currentVideoIndex) return;
        prevIndexRef.current = currentVideoIndex;
        setIsTransitioning(true);
        setIsVideoReady(false);
        setCurrentVideoIndex(index);
    }, [isTransitioning, currentVideoIndex]);

    // Video loaded - apply volume when ready
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleReady = () => {
            setIsVideoReady(true);
            setIsTransitioning(false);
            // Apply the current volume to the new video
            video.volume = volume / 100;
            video.muted = volume === 0;
            video.play().catch(() => { });
        };

        video.addEventListener("canplaythrough", handleReady);
        video.addEventListener("loadeddata", handleReady);
        video.addEventListener("error", () => {
            setIsVideoReady(true);
            setIsTransitioning(false);
        });

        if (video.readyState >= 3) handleReady();

        return () => {
            video.removeEventListener("canplaythrough", handleReady);
            video.removeEventListener("loadeddata", handleReady);
        };
    }, [currentVideoIndex, volume]);

    const scrollToContent = () => {
        window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    };

    // Swipe handlers for mobile
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            goToNextVideo();
        } else if (isRightSwipe) {
            goToPrevVideo();
        }
    };

    return (
        <div
            ref={containerRef}
            className="relative h-screen w-full overflow-hidden z-0"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            {/* Video Container with Parallax */}
            <motion.div
                className="fixed inset-0 w-full h-full z-0"
                style={{ opacity: smoothOpacity, scale: smoothScale, y: smoothY }}
            >
                {/* Video Element */}
                <AnimatePresence mode="wait">
                    <motion.video
                        key={currentVideoIndex}
                        ref={videoRef}
                        className="absolute inset-0 w-full h-full object-cover"
                        src={VIDEOS[currentVideoIndex].src}
                        muted={volume === 0}
                        autoPlay
                        loop
                        playsInline
                        preload="metadata"
                        onLoadedMetadata={(e) => {
                            // Set volume immediately when video metadata loads
                            const video = e.currentTarget;
                            video.volume = volume / 100;
                            video.muted = volume === 0;
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: 0.6,
                            ease: "easeInOut"
                        }}
                    />
                </AnimatePresence>

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent via-50% to-background" />
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-background/30" />

                {/* Vignette */}
                <div
                    className="absolute inset-0"
                    style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(10, 22, 40, 0.5) 100%)" }}
                />

                {/* Blue glow effects */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: `
                            radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 30%),
                            radial-gradient(circle at 80% 20%, rgba(37, 99, 235, 0.1) 0%, transparent 30%)
                        `,
                    }}
                />

                {/* Loading indicator - Non-blocking, shows while video loads */}
                {!isVideoReady && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                        <motion.div
                            className="flex flex-col items-center gap-4"
                            animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Image
                                src="/images/team/Logo/Logo_Fulguria_White.png"
                                alt="Fulguria Team"
                                width={80}
                                height={80}
                                className="drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                            />
                        </motion.div>
                    </div>
                )}
            </motion.div>

            {/* Video Navigation - Desktop: titles on left, Mobile/Tablet: dots centered */}
            {/* Desktop Navigation - Hidden on mobile and tablet */}
            <motion.div
                className="hidden md:flex absolute bottom-12 left-10 z-20 flex-col items-start gap-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                style={{ opacity: smoothOpacity }}
            >
                {VIDEOS.map((video, index) => (
                    <button
                        key={index}
                        onMouseEnter={() => goToVideo(index)}
                        className={`text-left text-sm md:text-base uppercase tracking-wider font-bold transition-all duration-300 cursor-pointer ${index === currentVideoIndex
                            ? "text-white"
                            : "text-white/40 hover:text-white/70"
                            }`}
                        disabled={isTransitioning}
                    >
                        {video.title}
                    </button>
                ))}
            </motion.div>

            {/* Mobile Navigation - Title and dots only, swipe to navigate */}
            <motion.div
                className="flex md:hidden absolute bottom-28 left-0 right-0 z-20 flex-col items-center gap-3 px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                style={{ opacity: smoothOpacity }}
            >
                {/* Current video title with animation */}
                <AnimatePresence mode="wait">
                    <motion.span
                        key={currentVideoIndex}
                        className="text-sm uppercase tracking-widest font-medium text-white px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-center"
                        initial={{ opacity: 0, x: currentVideoIndex > prevIndexRef.current ? 30 : -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: currentVideoIndex > prevIndexRef.current ? -30 : 30 }}
                        transition={{ duration: 0.3 }}
                    >
                        {VIDEOS[currentVideoIndex].title}
                    </motion.span>
                </AnimatePresence>

                {/* Dot indicators */}
                <div className="flex items-center gap-2">
                    {VIDEOS.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToVideo(index)}
                            className={`rounded-full transition-all duration-300 ${index === currentVideoIndex
                                ? "w-8 h-2 bg-primary"
                                : "w-2 h-2 bg-white/40 active:bg-white/70"
                                }`}
                            disabled={isTransitioning}
                            aria-label={`Vidéo ${index + 1}`}
                        />
                    ))}
                </div>
            </motion.div>

            {/* Scroll Indicator - hidden on mobile/tablet, visible on desktop */}
            <motion.button
                className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex-col items-center gap-2 cursor-pointer group"
                onClick={scrollToContent}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                style={{ opacity: smoothOpacity }}
                aria-label="Défiler vers le bas"
            >
                <span className="text-xs text-muted-foreground uppercase tracking-widest group-hover:text-primary transition-colors">
                    Découvrir
                </span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="p-2 rounded-full border border-white/20 group-hover:border-primary/50 group-hover:bg-primary/10 transition-all"
                >
                    <ChevronDown className="w-5 h-5 text-foreground/70 group-hover:text-primary transition-colors" />
                </motion.div>
            </motion.button>

            {/* Volume Control - Below title on mobile */}
            <motion.div
                className="absolute bottom-16 md:bottom-6 right-4 md:right-6 z-20 flex items-center gap-3"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.7 }}
                style={{ opacity: smoothOpacity }}
                onMouseEnter={() => setShowVolumeSlider(true)}
                onMouseLeave={() => setShowVolumeSlider(false)}
            >
                {/* Volume Slider - hidden on mobile/tablet */}
                <motion.div
                    className="hidden md:block glass px-4 py-2 rounded-full border border-white/10"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: showVolumeSlider ? "auto" : 0, opacity: showVolumeSlider ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ overflow: "hidden" }}
                >
                    {showVolumeSlider && (
                        <div className="flex items-center gap-2 min-w-[120px]">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={volume}
                                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                                style={{
                                    background: `linear-gradient(to right, rgb(59 130 246) 0%, rgb(59 130 246) ${volume}%, rgba(255,255,255,0.2) ${volume}%, rgba(255,255,255,0.2) 100%)`
                                }}
                            />
                            <span className="text-xs text-muted-foreground w-8 text-right">{volume}%</span>
                        </div>
                    )}
                </motion.div>

                <button
                    onClick={toggleMute}
                    className="p-2.5 sm:p-3 rounded-full glass border border-white/10 hover:border-primary/30 hover:bg-primary/10 transition-all group"
                    aria-label={volume === 0 ? "Activer le son" : "Couper le son"}
                >
                    {volume === 0 ? (
                        <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    ) : (
                        <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    )}
                </button>
            </motion.div>
        </div>
    );
}
