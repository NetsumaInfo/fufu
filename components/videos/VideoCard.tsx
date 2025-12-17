"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, PlayCircle } from "lucide-react";
import { Video } from "@/lib/types";
import { formatPublishedDate, formatViews } from "@/lib/data/videos";
import { cn } from "@/lib/utils";

interface VideoCardProps {
    video: Video;
    className?: string;
}

export function VideoCard({ video, className }: VideoCardProps) {
    return (
        <Link
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "group card p-0 overflow-hidden hover:scale-[1.01] transition-all duration-300",
                className
            )}
        >
            {/* Thumbnail */}
            <div className="relative aspect-video overflow-hidden bg-muted">
                <Image
                    src={video.thumbnailUrl}
                    alt={video.title}
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />

                {/* Play overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <PlayCircle className="w-16 h-16 text-white drop-shadow-lg" />
                    </div>
                </div>

                {/* Duration badge */}
                {video.duration && (
                    <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 rounded text-xs font-semibold text-white">
                        {video.duration}
                    </div>
                )}

            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                    {video.title}
                </h3>

                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    {video.views && (
                        <span>{formatViews(video.views)}</span>
                    )}
                    <span>•</span>
                    <span>{formatPublishedDate(video.publishedAt)}</span>
                </div>

                {video.description && (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                        {video.description}
                    </p>
                )}
            </div>
        </Link>
    );
}
