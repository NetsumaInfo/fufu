"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Home, Users, Mail, User, LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import type { User as UserType } from "@/lib/context/AuthContext";
import LanguageSelector from "@/components/ui/LanguageSelector";

interface MobileNavProps {
    isOpen: boolean;
    onClose: () => void;
    links: { href: string; label: string }[];
    currentPath: string;
    user?: UserType | null;
    onLogout?: () => void;
    isAuthenticated?: boolean;
}

// Circle animation for background
const backgroundVariants = {
    open: {
        clipPath: "circle(150% at calc(100% - 40px) 40px)",
        transition: {
            type: "spring",
            stiffness: 20,
            restDelta: 2,
        },
    },
    closed: {
        clipPath: "circle(0% at calc(100% - 40px) 40px)",
        transition: {
            delay: 0.2,
            type: "spring",
            stiffness: 400,
            damping: 40,
        },
    },
};

// Item animation
const itemVariants = {
    open: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.3, ease: "easeOut" },
    },
    closed: {
        y: 30,
        opacity: 0,
        transition: { duration: 0.2 },
    },
};

export function MobileNav({ isOpen, onClose, links, currentPath, user, onLogout, isAuthenticated }: MobileNavProps) {
    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // Handle ESC key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    if (typeof window === "undefined") return null;

    const icons: Record<string, typeof Home> = {
        "/": Home,
        "/about": Users,
        "/contact": Mail,
        "/login": User,
    };

    const filteredLinks = links.filter(link => !(isAuthenticated && link.href === "/login"));

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Background with circle animation */}
                    <motion.div
                        className="fixed inset-0 z-50 bg-[#0a0a14] md:hidden"
                        variants={backgroundVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                    >
                        {/* Spacer for navbar height */}
                        <div className="h-16 md:h-20" />

                        {/* Navigation Links */}
                        <nav className="p-6 flex-1 overflow-y-auto">
                            <ul className="space-y-3">
                                {filteredLinks.map((link, index) => {
                                    const Icon = icons[link.href] || Home;

                                    return (
                                        <motion.li
                                            key={link.href}
                                            variants={itemVariants}
                                            initial="closed"
                                            animate="open"
                                            exit="closed"
                                            transition={{ delay: 0.3 + index * 0.07 }}
                                            whileHover={{ scale: 1.03, x: 5 }}
                                            whileTap={{ scale: 0.97 }}
                                        >
                                            <Link
                                                href={link.href}
                                                onClick={onClose}
                                                className={cn(
                                                    "flex items-center gap-4 px-5 py-4 rounded-xl font-medium transition-colors",
                                                    currentPath === link.href
                                                        ? "bg-primary/20 text-primary"
                                                        : "hover:bg-primary/10 text-white hover:text-primary"
                                                )}
                                            >
                                                <Icon className={cn(
                                                    "w-5 h-5",
                                                    currentPath === link.href ? "text-primary" : "text-gray-400"
                                                )} />
                                                <span className="text-lg">{link.label}</span>
                                            </Link>
                                        </motion.li>
                                    );
                                })}

                                {/* User Profile Section */}
                                {isAuthenticated && user && (
                                    <motion.li
                                        variants={itemVariants}
                                        initial="closed"
                                        animate="open"
                                        exit="closed"
                                        transition={{ delay: 0.3 + filteredLinks.length * 0.07 }}
                                        className="pt-4 mt-4 border-t border-primary/20"
                                    >
                                        {/* Profile Card */}
                                        <div className="rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 overflow-hidden">
                                            {/* Header - Link to profile */}
                                            <Link
                                                href="/profile"
                                                onClick={onClose}
                                                className="p-4 flex items-center gap-3 hover:bg-primary/10 transition-colors"
                                            >
                                                <div className="w-12 h-12 rounded-full bg-primary/30 flex items-center justify-center">
                                                    <User className="w-6 h-6 text-primary" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-white">{user.username}</h3>
                                                    <p className="text-sm text-gray-400">{user.team || "Membre Fulguria"}</p>
                                                </div>
                                            </Link>

                                            {/* Mon Profil Link */}
                                            <Link
                                                href="/profile"
                                                onClick={onClose}
                                                className="flex items-center gap-3 px-4 py-3 border-t border-primary/20 hover:bg-primary/10 transition-colors"
                                            >
                                                <Settings className="w-4 h-4 text-primary" />
                                                <span className="font-medium text-white">Mon Profil</span>
                                            </Link>

                                            {/* Logout */}
                                            <button
                                                onClick={() => {
                                                    onLogout?.();
                                                    onClose();
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-3 border-t border-primary/20 text-red-400 hover:bg-red-500/10 transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                <span className="font-medium">Se déconnecter</span>
                                            </button>
                                        </div>
                                    </motion.li>
                                )}
                            </ul>
                        </nav>

                        {/* Footer area with Language and Copyright */}
                        <motion.div
                            className="border-t border-primary/20 p-6 flex flex-col items-center gap-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-2">
                                    <div className="relative w-8 h-8">
                                        <Image
                                            src="/images/team/Logo/Logo_Fulguria_White.png"
                                            alt="Fulguria"
                                            fill
                                            className="object-contain opacity-50"
                                        />
                                    </div>
                                    <span className="text-xs font-bold tracking-tighter text-white/30">FULGURIA</span>
                                </div>
                                <LanguageSelector />
                            </div>

                            <p className="text-[10px] text-gray-500 text-center uppercase tracking-widest">
                                © 2024-{new Date().getFullYear()} Fulguria Team • All rights reserved
                            </p>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
