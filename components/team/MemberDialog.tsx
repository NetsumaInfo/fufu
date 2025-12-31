"use client";

import Image from "next/image";
import { Youtube, Twitter, Instagram, Globe } from "lucide-react";
import { DiscordIcon } from "@/components/ui/DiscordIcon";
import { Dialog } from "@/components/ui/Dialog";
import { Badge, getRoleBadgeVariant } from "@/components/ui/Badge";
import { Member } from "@/lib/types";

interface MemberDialogProps {
    member: Member | null;
    isOpen: boolean;
    onClose: () => void;
}

const socialIcons = {
    youtube: Youtube,
    x: Twitter,
    twitter: Twitter,
    instagram: Instagram,
    website: Globe,
    discord: DiscordIcon,
};

const socialLabels: Record<string, string> = {
    youtube: "YouTube",
    x: "X (Twitter)",
    twitter: "Twitter",
    instagram: "Instagram",
    website: "Site Web",
    discord: "Discord",
    tiktok: "TikTok",
};

export function MemberDialog({ member, isOpen, onClose }: MemberDialogProps) {
    if (!member) return null;

    return (
        <Dialog isOpen={isOpen} onClose={onClose} size="lg">
            {/* Mobile: Stack layout / Desktop: Grid layout */}
            <div className="flex flex-col md:grid md:grid-cols-3 gap-6 md:gap-8">

                {/* Header section - Avatar + Name + Roles */}
                <div className="md:col-span-1">
                    <div className="flex flex-col items-center">
                        {/* Avatar - smaller on mobile */}
                        <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 mb-4">
                            <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl" />
                            <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-primary">
                                <Image
                                    src={member.avatarUrl}
                                    alt={member.pseudo}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        {/* Name */}
                        <h3 className="text-xl sm:text-2xl font-bold text-center text-primary-light mb-3">
                            {member.pseudo}
                        </h3>

                        {/* Roles */}
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center mb-4">
                            <Badge variant={getRoleBadgeVariant(member.primaryRole)} className="text-xs sm:text-sm">
                                {member.primaryRole}
                            </Badge>
                            {member.secondaryRoles?.map((role) => (
                                <Badge key={role} variant={getRoleBadgeVariant(role)} className="text-xs sm:text-sm">
                                    {role}
                                </Badge>
                            ))}
                        </div>

                        {/* Joined date */}
                        {member.joinedDate && (
                            <p className="text-xs sm:text-sm text-muted-foreground text-center">
                                Membre depuis {new Date(member.joinedDate).toLocaleDateString("fr-FR", {
                                    month: "long",
                                    year: "numeric"
                                })}
                            </p>
                        )}
                    </div>
                </div>

                {/* Content section - scrollable on mobile */}
                <div className="md:col-span-2 space-y-5 sm:space-y-6">
                    {/* Bio */}
                    <div>
                        <h4 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">Description</h4>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                            {member.bioLong || member.bioShort}
                        </p>
                    </div>

                    {/* Social links */}
                    <div>
                        <h4 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">Réseaux sociaux</h4>
                        <div className="grid grid-cols-1 gap-2 sm:gap-3">
                            {Object.entries(member.socials).map(([platform, url]) => {
                                if (!url) return null;
                                const Icon = socialIcons[platform as keyof typeof socialIcons] || Globe;
                                const label = socialLabels[platform] || platform;

                                // Special handling for Discord
                                if (platform === 'discord' && !url.startsWith('http')) {
                                    return (
                                        <div
                                            key={platform}
                                            className="flex items-center gap-3 p-2.5 sm:p-3 rounded-lg border border-border bg-secondary/50"
                                        >
                                            <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                                            <span className="flex-1 text-sm sm:text-base font-medium">{label}</span>
                                            <span className="text-xs sm:text-sm text-muted-foreground">@{url}</span>
                                        </div>
                                    );
                                }

                                return (
                                    <a
                                        key={platform}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-2.5 sm:p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all active:scale-[0.98]"
                                    >
                                        <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                                        <span className="flex-1 text-sm sm:text-base font-medium">{label}</span>
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Highlights / Featured projects */}
                    {member.highlights && member.highlights.length > 0 && (
                        <div>
                            <h4 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">Projets mis en avant</h4>
                            <div className="space-y-2 sm:space-y-3">
                                {member.highlights.map((highlight, index) => (
                                    <a
                                        key={index}
                                        href={highlight.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block p-3 sm:p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all active:scale-[0.98]"
                                    >
                                        <h5 className="text-sm sm:text-base font-semibold text-foreground">
                                            {highlight.label}
                                        </h5>
                                        {highlight.description && (
                                            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                                                {highlight.description}
                                            </p>
                                        )}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Dialog>
    );
}
