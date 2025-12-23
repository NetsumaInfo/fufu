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
            className="group relative bg-card border border-border rounded-xl overflow-hidden hover:border-primary transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-primary/20 hover:scale-105"
        >
            {/* Card content */}
            <div className="p-6">
                {/* Avatar */}
                <div className="relative w-24 h-24 mx-auto mb-4">
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
                <h3 className="text-xl font-bold text-center text-foreground mb-2 group-hover:text-primary transition-colors">
                    {member.pseudo}
                </h3>

                {/* Roles */}
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                    <Badge variant={getRoleBadgeVariant(member.primaryRole)}>
                        {member.primaryRole}
                    </Badge>
                    {member.secondaryRoles?.slice(0, 2).map((role) => (
                        <Badge key={role} variant={getRoleBadgeVariant(role)}>
                            {role}
                        </Badge>
                    ))}
                </div>

                {/* Bio */}
                <p className="text-sm text-muted-foreground text-center line-clamp-3 mb-4">
                    {member.bioShort}
                </p>

                {/* Social Icons */}
                {availableSocials.length > 0 && (
                    <div className="flex items-center justify-center gap-3 mt-2">
                        {availableSocials.map(([platform, url]) => {
                            const Icon = socialIcons[platform as keyof typeof socialIcons];
                            if (!Icon) return null;

                            // For Discord, show the username instead of linking
                            if (platform === 'discord' && url && !url.startsWith('http')) {
                                return (
                                    <div
                                        key={platform}
                                        className="relative group/social-icon"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors">
                                            <Icon className="w-full h-full" />
                                        </div>
                                        {/* Tooltip */}
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover border border-border rounded text-xs whitespace-nowrap opacity-0 group-hover/social-icon:opacity-100 pointer-events-none transition-opacity z-10">
                                            @{url}
                                        </div>
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
                                    <div className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors">
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
