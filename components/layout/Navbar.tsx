"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MobileNav } from "./MobileNav";

const navLinks = [
    { href: "/", label: "Accueil" },
    { href: "/team", label: "Team" },
    { href: "/videos", label: "Vidéos" },
    { href: "/recruitment", label: "Recrutement" },
    { href: "/contact", label: "Contact" },
];

export function Navbar() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Refs for measuring link positions
    const navContainerRef = useRef<HTMLDivElement>(null);
    const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Calculate indicator position based on active link
    useEffect(() => {
        const activeIndex = navLinks.findIndex(link => link.href === pathname);
        if (activeIndex === -1) return;

        const activeLink = linkRefs.current[activeIndex];
        const container = navContainerRef.current;

        if (activeLink && container) {
            const containerRect = container.getBoundingClientRect();
            const linkRect = activeLink.getBoundingClientRect();

            setIndicatorStyle({
                left: linkRect.left - containerRect.left + 8, // +8 for padding
                width: linkRect.width - 16, // -16 for left/right padding
            });
        }
    }, [pathname]);

    return (
        <>
            <nav
                className={cn(
                    "fixed top-0 left-0 right-0 z-[60] border-b transition-all duration-500 ease-out",
                    isScrolled
                        ? "glass-strong shadow-lg py-3 md:py-4 border-primary/20 backdrop-blur-xl"
                        : "bg-transparent py-4 md:py-5 border-transparent backdrop-blur-none"
                )}
            >
                <div className="container-custom">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link
                            href="/"
                            className="flex items-center gap-3 group"
                        >
                            <div className="relative w-8 h-8 sm:w-10 sm:h-10 transition-transform group-hover:scale-110">
                                <Image
                                    src="/images/team/Logo/Logo_Fulguria_White.png"
                                    alt="Fulguria Team Logo"
                                    width={40}
                                    height={40}
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-primary-light to-primary bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
                                Fulguria Team
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div
                            ref={navContainerRef}
                            className="hidden md:flex items-center gap-1 relative"
                        >
                            {/* Animated indicator - only moves horizontally */}
                            <motion.div
                                className="absolute bottom-0 h-0.5 bg-primary rounded-full"
                                animate={{
                                    left: indicatorStyle.left,
                                    width: indicatorStyle.width,
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 380,
                                    damping: 32,
                                    mass: 0.8
                                }}
                            />

                            {navLinks.map((link, index) => (
                                <motion.div
                                    key={link.href}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.3 }}
                                >
                                    <Link
                                        ref={(el) => { linkRefs.current[index] = el; }}
                                        href={link.href}
                                        className={cn(
                                            "relative px-4 py-2 rounded-lg font-medium transition-all duration-300",
                                            pathname === link.href
                                                ? "text-primary"
                                                : "text-foreground hover:text-primary"
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {/* Mobile Menu Button - Animated bars morphing to X */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-primary/10 transition-colors mr-1 relative z-[60] flex flex-col items-center justify-center w-10 h-10 gap-0"
                            aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                        >
                            {/* 3 bars that morph into X */}
                            <span
                                className={cn(
                                    "block w-6 h-[2.5px] rounded-full transition-all duration-300 ease-in-out mb-[3px]",
                                    isMobileMenuOpen
                                        ? "bg-primary rotate-45 translate-y-[5.25px] mb-0"
                                        : "bg-foreground"
                                )}
                            />
                            <span
                                className={cn(
                                    "block w-6 h-[2.5px] rounded-full transition-all duration-300 ease-in-out my-[3px]",
                                    isMobileMenuOpen
                                        ? "opacity-0 scale-0"
                                        : "bg-foreground opacity-100"
                                )}
                            />
                            <span
                                className={cn(
                                    "block w-6 h-[2.5px] rounded-full transition-all duration-300 ease-in-out mt-[3px]",
                                    isMobileMenuOpen
                                        ? "bg-primary -rotate-45 -translate-y-[5.25px] mt-0"
                                        : "bg-foreground"
                                )}
                            />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation */}
            <MobileNav
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                links={navLinks}
                currentPath={pathname}
            />
        </>
    );
}

