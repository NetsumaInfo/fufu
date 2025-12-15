"use client";

import Image from "next/image";
import { Youtube, Twitter, Instagram, Globe, Hash } from "lucide-react";
import { Member } from "@/lib/types";
import { Badge, getRoleBadgeVariant } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface MemberCardProps {
    member: Member;
    onClick?: () => void;
    className?: string;
}

const socialIcons = {
    youtube: Youtube,
    x: Twitter,
    twitter: Twitter,
    instagram: Instagram,
    website: Globe,
    discord: Hash,
};

export function MemberCard({ member, onClick, className }: MemberCardProps) {
    const handleClick = () => {
        if (onClick) onClick();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
        }
    };

    return (
        <div
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
            className={cn(
                "card group cursor-pointer",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                className
            )}
        >
            {/* Avatar */}
            <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full blur-md opacity-0 group-hover:opacity-70 transition-opacity duration-300" />
                <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-border group-hover:border-primary transition-colors">
                    <Image
                        src={member.avatarUrl}
                        alt={member.pseudo}
                        fill
                        className="object-cover"
                    />
                </div>
            </div>

            {/* Name */}
            <h3 className="text-xl font-bold text-center text-foreground mb-2 group-hover:text-gradient transition-all">
                {member.pseudo}
            </h3>

            {/* Roles */}
            <div className="flex flex-wrap gap-2 justify-center mb-4">
                <Badge variant={getRoleBadgeVariant(member.primaryRole)}>
                    {member.primaryRole}
                </Badge>
                {member.secondaryRoles?.map((role) => (
                    <Badge key={role} variant={getRoleBadgeVariant(role)} className="opacity-80">
                        {role}
                    </Badge>
                ))}
            </div>

            {/* Bio */}
            <p className="text-sm text-muted-foreground text-center line-clamp-3 mb-4">
                {member.bioShort}
            </p>

            {/* Social Links */}
            <div className="flex gap-2 justify-center pt-4 border-t border-border">
                {Object.entries(member.socials).map(([platform, url]) => {
                    if (!url) return null;
                    const Icon = socialIcons[platform as keyof typeof socialIcons];
                    if (!Icon) return null;

                    return (
                        <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
                            aria-label={`${member.pseudo} sur ${platform}`}
                        >
                            <Icon className="w-4 h-4" />
                        </a>
                    );
                })}
            </div>

            {/* View Details Hint */}
            <div className="mt-4 text-center">
                <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                    Cliquer pour voir le profil →
                </span>
            </div>
        </div>
    );
}
