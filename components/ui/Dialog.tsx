"use client";

import { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    title?: string;
    className?: string;
    size?: "sm" | "md" | "lg" | "xl";
}

export function Dialog({
    isOpen,
    onClose,
    children,
    title,
    className,
    size = "md",
}: DialogProps) {
    const dialogRef = useRef<HTMLDivElement>(null);

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

    // Lock body scroll when dialog is open
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

    // Focus trap
    useEffect(() => {
        if (isOpen && dialogRef.current) {
            const focusableElements = dialogRef.current.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0] as HTMLElement;
            const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

            const handleTab = (e: KeyboardEvent) => {
                if (e.key === "Tab") {
                    if (e.shiftKey && document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement?.focus();
                    } else if (!e.shiftKey && document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement?.focus();
                    }
                }
            };

            document.addEventListener("keydown", handleTab);
            firstElement?.focus();

            return () => document.removeEventListener("keydown", handleTab);
        }
    }, [isOpen]);

    if (typeof window === "undefined") return null;

    const sizes = {
        sm: "max-w-md",
        md: "max-w-2xl",
        lg: "max-w-4xl",
        xl: "max-w-6xl",
    };

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-background/80 backdrop-blur-md"
                        onClick={onClose}
                        aria-hidden="true"
                    />

                    {/* Dialog */}
                    <motion.div
                        ref={dialogRef}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                            "relative w-full glass-strong rounded-xl sm:rounded-2xl shadow-2xl",
                            "max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col",
                            sizes[size],
                            className
                        )}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={title ? "dialog-title" : undefined}
                    >
                        {/* Header */}
                        {title && (
                            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-border">
                                <h2
                                    id="dialog-title"
                                    className="text-xl sm:text-2xl font-bold text-foreground"
                                >
                                    {title}
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                                    aria-label="Fermer le dialogue"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        )}

                        {/* Close button (when no title) */}
                        {!title && (
                            <button
                                onClick={onClose}
                                className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 rounded-lg hover:bg-muted transition-colors z-10 bg-card/80 backdrop-blur-sm"
                                aria-label="Fermer le dialogue"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
