"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { MobileNav } from "./MobileNav";
import { useAuth } from "@/lib/context/AuthContext";
import { LogOut, User, ChevronDown, Settings } from "lucide-react";
import LanguageSelector from "@/components/ui/LanguageSelector";
import { useTranslation } from "@/lib/context/TranslationContext";

const navLinks = [
    { href: "/", labelKey: "navbar.home" },
    { href: "/about", labelKey: "navbar.about" },
    { href: "/contact", labelKey: "navbar.contact" },
    { href: "/login", labelKey: "navbar.login" },
];

export function Navbar() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const { user, logout, isAuthenticated } = useAuth();
    const { t, locale, messages } = useTranslation();

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

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Calculate indicator position based on active link
    useEffect(() => {
        // Small delay to ensure DOM has updated with new text
        const timeoutId = setTimeout(() => {
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
        }, 50);

        return () => clearTimeout(timeoutId);
    }, [pathname, locale, messages]);

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
                                    priority
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-light">
                                    FULGURIA
                                </span>
                                <span className="text-[10px] md:text-xs text-muted-foreground tracking-[0.2em] uppercase font-medium group-hover:text-primary/80 transition-colors">
                                    {t('navbar.team')}
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-4">
                            <div
                                ref={navContainerRef}
                                className="flex items-center gap-1 relative"
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

                                {navLinks
                                    .filter(link => !(isAuthenticated && link.href === "/login"))
                                    .map((link, index) => (
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
                                                {t(link.labelKey)}
                                            </Link>
                                        </motion.div>
                                    ))}
                            </div>
                        </div>

                        {/* Right Section: Language & Toggle */}
                        <div className="flex items-center gap-2">
                            <LanguageSelector />

                            {/* Desktop User Profile Section */}
                            {isAuthenticated && user ? (
                                <div className="hidden md:block relative ml-2" ref={profileRef}>
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors cursor-pointer"
                                    >
                                        {user.avatarUrl ? (
                                            <div className="w-6 h-6 rounded-full overflow-hidden">
                                                <Image
                                                    src={user.avatarUrl}
                                                    alt={user.username}
                                                    width={24}
                                                    height={24}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <User className="w-4 h-4 text-primary" />
                                        )}
                                        <span className="text-sm font-medium text-foreground">{user.username}</span>
                                        <ChevronDown className={cn(
                                            "w-4 h-4 text-muted-foreground transition-transform duration-200",
                                            isProfileOpen && "rotate-180"
                                        )} />
                                    </button>

                                    {/* Profile Dropdown */}
                                    <AnimatePresence>
                                        {isProfileOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                transition={{ duration: 0.2, ease: "easeOut" }}
                                                className="absolute right-0 top-full mt-3 w-72 rounded-2xl overflow-hidden shadow-2xl z-[70] bg-[#0d1117]/95 backdrop-blur-xl border border-white/10"
                                            >
                                                {/* Profile Header with gradient */}
                                                <div className="relative">
                                                    {/* Gradient background */}
                                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent" />

                                                    <Link
                                                        href="/profile"
                                                        onClick={() => setIsProfileOpen(false)}
                                                        className="relative p-5 flex items-center gap-4 hover:bg-white/5 transition-colors group"
                                                    >
                                                        {/* Avatar with ring */}
                                                        <div className="relative">
                                                            <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-primary/50 ring-offset-2 ring-offset-[#0d1117] group-hover:ring-primary transition-all">
                                                                {user.avatarUrl ? (
                                                                    <Image
                                                                        src={user.avatarUrl}
                                                                        alt={user.username}
                                                                        width={56}
                                                                        height={56}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                                                                        <User className="w-7 h-7 text-primary" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-bold text-white text-lg truncate">{user.username}</h3>
                                                            <p className="text-sm text-primary/80 font-medium">{user.team || "Membre Fulguria"}</p>
                                                        </div>
                                                    </Link>
                                                </div>

                                                {/* Menu Items - Removed duplicate Mon Profil */}

                                                {/* Logout Button */}
                                                <div className="p-2 border-t border-white/5">
                                                    <button
                                                        onClick={() => {
                                                            setIsProfileOpen(false);
                                                            logout();
                                                        }}
                                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all group"
                                                    >
                                                        <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                                                            <LogOut className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <span className="text-sm font-semibold block">Se déconnecter</span>
                                                            <span className="text-xs text-red-400/60">Fermer la session</span>
                                                        </div>
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : null}

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
                </div>
            </nav>

            {/* Mobile Navigation */}
            <MobileNav
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                links={navLinks.map(link => ({ ...link, label: t(link.labelKey) }))}
                currentPath={pathname}
                user={user}
                onLogout={logout}
                isAuthenticated={isAuthenticated}
            />
        </>
    );
}

