import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
    variant?: "card" | "text" | "avatar" | "video";
    className?: string;
    count?: number;
}

export function LoadingSkeleton({
    variant = "card",
    className,
    count = 1,
}: LoadingSkeletonProps) {
    const skeletons = Array.from({ length: count }, (_, i) => i);

    const variants = {
        card: (
            <div className={cn("card h-64", className)}>
                <div className="skeleton h-40 w-full mb-4 rounded-lg" />
                <div className="skeleton h-6 w-3/4 mb-2 rounded" />
                <div className="skeleton h-4 w-1/2 rounded" />
            </div>
        ),
        text: (
            <div className={cn("space-y-2", className)}>
                <div className="skeleton h-4 w-full rounded" />
                <div className="skeleton h-4 w-5/6 rounded" />
                <div className="skeleton h-4 w-4/6 rounded" />
            </div>
        ),
        avatar: (
            <div className={cn("flex items-center gap-4", className)}>
                <div className="skeleton h-16 w-16 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                    <div className="skeleton h-4 w-32 rounded" />
                    <div className="skeleton h-3 w-24 rounded" />
                </div>
            </div>
        ),
        video: (
            <div className={cn("card p-0 overflow-hidden", className)}>
                <div className="skeleton h-48 w-full rounded-t-lg" />
                <div className="p-4 space-y-2">
                    <div className="skeleton h-5 w-full rounded" />
                    <div className="skeleton h-4 w-2/3 rounded" />
                </div>
            </div>
        ),
    };

    return (
        <>
            {skeletons.map((i) => (
                <div key={i}>{variants[variant]}</div>
            ))}
        </>
    );
}
