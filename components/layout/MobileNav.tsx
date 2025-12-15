"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavProps {
    isOpen: boolean;
    onClose: () => void;
    links: { href: string; label: string }[];
    currentPath: string;
}

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

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-background/95 backdrop-blur-lg"
                        onClick={onClose}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="absolute top-0 right-0 bottom-0 w-full max-w-sm glass-strong shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-border">
                            <span className="text-xl font-bold text-gradient">Menu</span>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg hover:bg-muted transition-colors"
                                aria-label="Fermer le menu"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Navigation Links */}
                        <nav className="p-6">
                            <ul className="space-y-2">
                                {links.map((link, index) => (
                                    <motion.li
                                        key={link.href}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={onClose}
                                            className={cn(
                                                "block px-4 py-3 rounded-lg font-medium transition-colors",
                                                currentPath === link.href
                                                    ? "bg-primary/20 text-primary"
                                                    : "hover:bg-muted text-foreground"
                                            )}
                                        >
                                            {link.label}
                                        </Link>
                                    </motion.li>
                                ))}
                            </ul>
                        </nav>

                        {/* Footer */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border">
                            <p className="text-sm text-muted-foreground text-center">
                                Fulguria Team © {new Date().getFullYear()}
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
