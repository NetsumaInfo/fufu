"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

interface TransitionLayoutProps {
    children: ReactNode;
}

export function TransitionLayout({ children }: TransitionLayoutProps) {
    const pathname = usePathname();
    const [displayChildren, setDisplayChildren] = useState(children);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        // Scroll to top immediately on page change
        window.scrollTo(0, 0);

        setIsAnimating(true);
        const timer = setTimeout(() => {
            setDisplayChildren(children);
            setIsAnimating(false);
        }, 150);

        return () => clearTimeout(timer);
    }, [pathname, children]);

    return (
        <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.25,
                ease: [0.4, 0, 0.2, 1],
            }}
        >
            {displayChildren}
        </motion.div>
    );
}
