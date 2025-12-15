"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { prefersReducedMotion } from "@/lib/utils";

interface FadeInProps {
    children: ReactNode;
    delay?: number;
    duration?: number;
    className?: string;
}

export function FadeIn({
    children,
    delay = 0,
    duration = 0.5,
    className,
}: FadeInProps) {
    const reducedMotion = prefersReducedMotion();

    if (reducedMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration, delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
