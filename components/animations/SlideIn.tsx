"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { prefersReducedMotion } from "@/lib/utils";

interface SlideInProps {
    children: ReactNode;
    direction?: "up" | "down" | "left" | "right";
    delay?: number;
    duration?: number;
    className?: string;
}

export function SlideIn({
    children,
    direction = "up",
    delay = 0,
    duration = 0.5,
    className,
}: SlideInProps) {
    const reducedMotion = prefersReducedMotion();

    if (reducedMotion) {
        return <div className={className}>{children}</div>;
    }

    const directions = {
        up: { y: 40 },
        down: { y: -40 },
        left: { x: 40 },
        right: { x: -40 },
    };

    return (
        <motion.div
            initial={{ opacity: 0, ...directions[direction] }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration, delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
