"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    description?: string;
    action?: ReactNode;
    centered?: boolean;
    className?: string;
}

export function SectionHeader({
    title,
    subtitle,
    description,
    action,
    centered = false,
    className,
}: SectionHeaderProps) {
    return (
        <div
            className={cn(
                "mb-12",
                centered && "text-center",
                className
            )}
        >
            <div className={cn(
                "flex items-end justify-between gap-4",
                centered && "flex-col items-center"
            )}>
                <div>
                    {subtitle && (
                        <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
                            {subtitle}
                        </p>
                    )}
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                        {title}
                    </h2>
                    {description && (
                        <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
                            {description}
                        </p>
                    )}
                </div>
                {action && !centered && (
                    <div className="flex-shrink-0">
                        {action}
                    </div>
                )}
            </div>
            {action && centered && (
                <div className="mt-6">
                    {action}
                </div>
            )}
        </div>
    );
}
