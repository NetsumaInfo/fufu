"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Home, Users, Video, UserPlus, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavProps {
    isOpen: boolean;
    onClose: () => void;
    links: { href: string; label: string }[];
    currentPath: string;
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

export function MobileNav({ isOpen, onClose, links, currentPath }: MobileNavProps) {
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
        "/team": Users,
        "/videos": Video,
        "/recruitment": UserPlus,
        "/contact": Mail,
    };

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
                                {links.map((link, index) => {
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
                            </ul>
                        </nav>

                        {/* Footer */}
                        <motion.div
                            className="border-t border-primary/20 p-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <p className="text-sm text-gray-400 text-center">
                                © 2024-{new Date().getFullYear()} Fulguria Team
                            </p>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
