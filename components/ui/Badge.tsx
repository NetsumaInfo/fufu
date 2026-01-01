import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "leader" | "amv" | "design" | "outline";
}

export function Badge({
    className,
    variant = "default",
    children,
    ...props
}: BadgeProps) {
    const variants = {
        default: "bg-primary/15 text-primary-light border-primary/25",
        leader: "bg-amber-500/15 text-amber-400 border-amber-500/25",
        amv: "bg-blue-500/15 text-blue-400 border-blue-500/25",
        design: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
        outline: "bg-transparent text-muted-foreground border-border",
    };

    return (
        <div
            className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border transition-colors",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

// Helper function to get badge variant by role
export function getRoleBadgeVariant(role: string): BadgeProps["variant"] {
    const roleLower = role.toLowerCase();
    if (roleLower.includes("leader")) return "leader";
    if (roleLower.includes("amv")) return "amv";
    if (roleLower.includes("design") || roleLower.includes("fx") || roleLower.includes("graphiste")) return "design";
    return "default";
}
