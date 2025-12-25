"use client";

import Image from "next/image";
import { Youtube, Twitter, Instagram } from "lucide-react";
import { Badge, getRoleBadgeVariant } from "@/components/ui/Badge";
import { Member } from "@/lib/types";
import { DiscordIcon } from "@/components/ui/DiscordIcon";

interface MemberCardProps {
    member: Member;
    onClick: () => void;
}

const socialIcons = {
    youtube: Youtube,
    x: Twitter,
    twitter: Twitter,
    instagram: Instagram,
    discord: DiscordIcon,
};

export function MemberCard({ member, onClick }: MemberCardProps) {
    // Get available social links
    const availableSocials = Object.entries(member.socials)
        .filter(([_, url]) => url)
        .slice(0, 4); // Show max 4 icons

    return (
        <div
            onClick={onClick}
            className="group relative h-[320px] sm:h-[320px] md:h-[340px] bg-card border border-border rounded-xl overflow-hidden hover:border-primary transition-all duration-300 cursor-pointer active:scale-[0.98] md:hover:shadow-lg md:hover:shadow-primary/20 md:hover:scale-105"
        >
            {/* Card content */}
            <div className="p-5 sm:p-5 md:p-6 h-full flex flex-col">
                {/* Avatar */}
                <div className="relative w-20 h-20 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-3 sm:mb-4">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-md group-hover:blur-lg transition-all" />
                    <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-primary">
                        <Image
                            src={member.avatarUrl}
                            alt={member.pseudo}
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>

                {/* Name */}
                <h3 className="text-lg sm:text-lg md:text-xl font-bold text-center text-foreground mb-2 group-hover:text-primary transition-colors">
                    {member.pseudo}
                </h3>

                {/* Roles - show all on mobile in 1-column, limit on smaller views */}
                <div className="flex flex-wrap gap-2 justify-center mb-3 sm:mb-4">
                    <Badge variant={getRoleBadgeVariant(member.primaryRole)} className="text-xs">
                        {member.primaryRole}
                    </Badge>
                    {member.secondaryRoles?.slice(0, 2).map((role) => (
                        <Badge key={role} variant={getRoleBadgeVariant(role)} className="text-xs">
                            {role}
                        </Badge>
                    ))}
                </div>

                {/* Bio - show 3 lines on all screens */}
                <p className="text-sm text-muted-foreground text-center line-clamp-3 flex-1">
                    {member.bioShort}
                </p>

                {/* Social Icons */}
                {availableSocials.length > 0 && (
                    <div className="flex items-center justify-center gap-3 sm:gap-4 mt-auto pt-4">
                        {availableSocials.map(([platform, url]) => {
                            const Icon = socialIcons[platform as keyof typeof socialIcons];
                            if (!Icon) return null;

                            // For Discord, show the username on hover without moving other icons
                            if (platform === 'discord' && url && !url.startsWith('http')) {
                                return (
                                    <div
                                        key={platform}
                                        className="relative group/discord"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="w-5 h-5 sm:w-5 sm:h-5 text-muted-foreground hover:text-primary transition-colors">
                                            <Icon className="w-full h-full" />
                                        </div>
                                        {/* Tooltip - hidden on mobile (touch devices) */}
                                        <span className="hidden sm:block absolute left-full ml-1 top-1/2 -translate-y-1/2 text-xs font-medium text-primary bg-card/95 backdrop-blur-sm px-2 py-1 rounded-md whitespace-nowrap opacity-0 scale-95 group-hover/discord:opacity-100 group-hover/discord:scale-100 transition-all duration-200 pointer-events-none z-10">
                                            @{url}
                                        </span>
                                    </div>
                                );
                            }

                            return (
                                <a
                                    key={platform}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="relative group/social-icon"
                                    aria-label={platform}
                                >
                                    <div className="w-5 h-5 sm:w-5 sm:h-5 text-muted-foreground hover:text-primary transition-colors">
                                        <Icon className="w-full h-full" />
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>
    );
}
