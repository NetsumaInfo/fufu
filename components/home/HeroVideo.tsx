"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ChevronDown, Volume2, VolumeX, Play } from "lucide-react";

export function HeroVideo() {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [volume, setVolume] = useState(0); // Start at 0 (muted)
    const [isLoaded, setIsLoaded] = useState(false);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);

    // Scroll-based animations
    const { scrollY } = useScroll();

    // Transform values based on scroll position
    const opacity = useTransform(scrollY, [0, 600], [1, 0]);
    const scale = useTransform(scrollY, [0, 600], [1, 1.15]);
    const y = useTransform(scrollY, [0, 600], [0, 150]);

    // Smooth spring animations for buttery feel
    const smoothOpacity = useSpring(opacity, { stiffness: 100, damping: 30 });
    const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 });
    const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

    // Play video when loaded
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleCanPlay = () => {
            setIsLoaded(true);
            video.play().catch(() => {
                // Autoplay was prevented - still show the video
                setIsLoaded(true);
            });
        };

        // Multiple event listeners for robustness
        video.addEventListener("canplaythrough", handleCanPlay);
        video.addEventListener("loadeddata", handleCanPlay);

        // Fallback timeout in case events don't fire
        const fallbackTimeout = setTimeout(() => {
            if (!isLoaded && video.readyState >= 2) {
                setIsLoaded(true);
                video.play().catch(() => { });
            }
        }, 2000);

        // If video is already ready (cached)
        if (video.readyState >= 3) {
            handleCanPlay();
        }

        return () => {
            video.removeEventListener("canplaythrough", handleCanPlay);
            video.removeEventListener("loadeddata", handleCanPlay);
            clearTimeout(fallbackTimeout);
        };
    }, [isLoaded]);

    // Sync video volume with state
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        video.volume = volume / 100;
        video.muted = volume === 0;
    }, [volume]);

    const handleVolumeChange = (newVolume: number) => {
        setVolume(newVolume);
    };

    const scrollToContent = () => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: "smooth",
        });
    };

    return (
        <div ref={containerRef} className="relative h-screen w-full overflow-hidden">
            {/* Video Container with Parallax */}
            <motion.div
                className="fixed inset-0 w-full h-full"
                style={{
                    opacity: smoothOpacity,
                    scale: smoothScale,
                    y: smoothY,
                }}
            >
                {/* Video Element */}
                <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover"
                    src="/video/Aether.webm"
                    muted={volume === 0}
                    autoPlay
                    loop
                    playsInline
                    preload="auto"
                />

                {/* Gradient Overlays for blend with site */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90" />
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-background/30" />

                {/* Vignette effect */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: "radial-gradient(ellipse at center, transparent 40%, rgba(10, 22, 40, 0.5) 100%)",
                    }}
                />

                {/* Blue glow effects matching site aesthetic */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: `
                            radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 30%),
                            radial-gradient(circle at 80% 20%, rgba(37, 99, 235, 0.1) 0%, transparent 30%)
                        `,
                    }}
                />
            </motion.div>

            {/* Loading Overlay */}
            <motion.div
                className="fixed inset-0 bg-background z-50 flex items-center justify-center"
                initial={{ opacity: 1 }}
                animate={{ opacity: isLoaded ? 0 : 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ pointerEvents: isLoaded ? "none" : "auto" }}
            >
                <motion.div
                    className="flex flex-col items-center gap-4"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    <Play className="w-12 h-12 text-primary" />
                    <span className="text-muted-foreground text-sm">Chargement...</span>
                </motion.div>
            </motion.div>



            {/* Scroll Indicator */}
            <motion.button
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 cursor-pointer group"
                onClick={scrollToContent}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : -20 }}
                transition={{ duration: 0.6, delay: 1.2 }}
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

            {/* Volume Control */}
            <motion.div
                className="absolute bottom-8 right-6 z-20 flex items-center gap-3"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.8 }}
                transition={{ duration: 0.4, delay: 1.4 }}
                style={{ opacity: smoothOpacity }}
                onMouseEnter={() => setShowVolumeSlider(true)}
                onMouseLeave={() => setShowVolumeSlider(false)}
            >
                {/* Volume Slider */}
                <motion.div
                    className="glass px-4 py-2 rounded-full border border-white/10"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{
                        width: showVolumeSlider ? "auto" : 0,
                        opacity: showVolumeSlider ? 1 : 0,
                    }}
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
                                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                                style={{
                                    background: `linear-gradient(to right, rgb(59 130 246) 0%, rgb(59 130 246) ${volume}%, rgba(255,255,255,0.2) ${volume}%, rgba(255,255,255,0.2) 100%)`
                                }}
                            />
                            <span className="text-xs text-muted-foreground w-8 text-right">{volume}%</span>
                        </div>
                    )}
                </motion.div>

                {/* Volume Icon Button */}
                <button
                    onClick={() => handleVolumeChange(volume > 0 ? 0 : 50)}
                    className="p-3 rounded-full glass border border-white/10 hover:border-primary/30 hover:bg-primary/10 transition-all group"
                    aria-label={volume === 0 ? "Activer le son" : "Couper le son"}
                >
                    {volume === 0 ? (
                        <VolumeX className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    ) : (
                        <Volume2 className="w-5 h-5 text-primary" />
                    )}
                </button>
            </motion.div>
        </div>
    );
}
