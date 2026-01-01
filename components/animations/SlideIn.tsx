"use client";

import { ReactNode, useMemo } from "react";
import { motion } from "framer-motion";
import { prefersReducedMotion } from "@/lib/utils";

const DIRECTIONS = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 40 },
    right: { x: -40 },
} as const;

interface SlideInProps {
    children: ReactNode;
    direction?: keyof typeof DIRECTIONS;
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
    const reducedMotion = useMemo(() => prefersReducedMotion(), []);
    const initialState = useMemo(() => ({ opacity: 0, ...DIRECTIONS[direction] }), [direction]);

    if (reducedMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            initial={initialState}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration, delay }}
            className={className}
            style={{ willChange: "transform, opacity" }}
        >
            {children}
        </motion.div>
    );
}
