"use client";

import { ReactNode, useMemo } from "react";
import { motion } from "framer-motion";
import { prefersReducedMotion } from "@/lib/utils";

// Memoized variants to prevent recreation
const ITEM_VARIANTS = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
} as const;

interface StaggerContainerProps {
    children: ReactNode;
    staggerDelay?: number;
    className?: string;
}

export function StaggerContainer({
    children,
    staggerDelay = 0.1,
    className,
}: StaggerContainerProps) {
    const reducedMotion = useMemo(() => prefersReducedMotion(), []);

    const containerVariants = useMemo(() => ({
        hidden: {},
        visible: {
            transition: {
                staggerChildren: staggerDelay,
            },
        },
    }), [staggerDelay]);

    if (reducedMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
    const reducedMotion = useMemo(() => prefersReducedMotion(), []);

    if (reducedMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            variants={ITEM_VARIANTS}
            className={className}
            style={{ willChange: "transform, opacity" }}
        >
            {children}
        </motion.div>
    );
}
