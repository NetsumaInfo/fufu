"use client";

import Image from "next/image";
import { Youtube, Twitter, Instagram, Globe, Linkedin } from "lucide-react";
import { DiscordIcon } from "@/components/ui/DiscordIcon";
import { TikTokIcon } from "@/components/ui/TikTokIcon";
import { BilibiliIcon } from "@/components/ui/BilibiliIcon";
import { Dialog } from "@/components/ui/Dialog";
import { Badge, getRoleBadgeVariant } from "@/components/ui/Badge";
import { Member } from "@/lib/types";
import { useTranslation } from "@/lib/context/TranslationContext";

interface MemberDialogProps {
    member: Member | null;
    isOpen: boolean;
    onClose: () => void;
}

const socialIcons = {
    youtube: Youtube,
    x: Twitter,
    twitter: Twitter,
    linkedin: Linkedin,
    instagram: Instagram,
    website: Globe,
    discord: DiscordIcon,
    tiktok: TikTokIcon,
    bilibili: BilibiliIcon,
};



// Extract username/handle from social URLs
function extractHandle(platform: string, url: string): string {
    if (!url) return "";

    // Discord is already just the username
    if (platform === 'discord' && !url.startsWith('http')) {
        return url;
    }

    try {
        // For Bilibili, extract the numeric ID
        if (platform === 'bilibili') {
            const match = url.match(/bilibili\.com\/(\d+)/);
            return match ? match[1] : url;
        }

        // For other platforms, extract username from URL
        const urlObj = new URL(url);
        let pathname = urlObj.pathname;
        const hostname = urlObj.hostname.replace(/^www\./, "");

        // Remove leading/trailing slashes
        pathname = pathname.replace(/^\/|\/$/g, '');

        if (platform === 'website' || !pathname) {
            return hostname;
        }

        // Extract username part
        if (pathname.includes('@')) {
            return pathname.split('/').find(part => part.startsWith('@')) || pathname;
        }

        // For paths like "channel/UCxxx" or plain usernames
        const parts = pathname.split('/');
        return parts[parts.length - 1] || pathname;
    } catch {
        return url;
    }
}

export function MemberDialog({ member, isOpen, onClose }: MemberDialogProps) {
    const { t, locale } = useTranslation();
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
                                {t(`members.role_badge.${member.primaryRole}`)}
                            </Badge>
                            {member.secondaryRoles?.map((role) => (
                                <Badge key={role} variant={getRoleBadgeVariant(role)} className="text-xs sm:text-sm">
                                    {t(`members.role_badge.${role}`)}
                                </Badge>
                            ))}
                        </div>

                        {/* Joined date */}
                        {member.joinedDate && (
                            <p className="text-xs sm:text-sm text-muted-foreground text-center">
                                {t('members.dialog.member_since')} {new Date(member.joinedDate).toLocaleDateString(locale, {
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
                        <h4 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">{t('members.dialog.description')}</h4>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                            {member.bioLong ? t(`members.${member.id}.bio_long`) : t(`members.${member.id}.bio_short`)}
                        </p>
                    </div>

                    {/* Social links */}
                    <div>
                        <h4 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">{t('members.dialog.socials')}</h4>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(member.socials).map(([platform, url]) => {
                                if (!url) return null;
                                const Icon = socialIcons[platform as keyof typeof socialIcons] || Globe;
                                const handle = extractHandle(platform, url);

                                // Check if handle is purely numeric (like Bilibili ID)
                                const isNumeric = /^\d+$/.test(handle);

                                // Special handling for Discord (non-clickable with @username)
                                if (platform === 'discord' && !url.startsWith('http')) {
                                    return (
                                        <div
                                            key={platform}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-secondary/50 text-sm"
                                        >
                                            <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                                            <span className="text-muted-foreground">@{handle}</span>
                                        </div>
                                    );
                                }

                                // If numeric ID (like Bilibili) or LinkedIn, show only icon
                                if (isNumeric || platform === 'linkedin') {
                                    return (
                                        <a
                                            key={platform}
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-border hover:border-primary hover:bg-primary/5 transition-all"
                                        >
                                            <Icon className="w-5 h-5 text-primary" />
                                        </a>
                                    );
                                }

                                // Regular social links with @username
                                const displayHandle =
                                    platform === 'website'
                                        ? handle
                                        : handle.startsWith('@')
                                            ? handle
                                            : `@${handle}`;
                                return (
                                    <a
                                        key={platform}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border hover:border-primary hover:bg-primary/5 transition-all text-sm"
                                    >
                                        <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                                        <span className="text-muted-foreground">{displayHandle}</span>
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Highlights / Featured projects */}
                    {member.highlights && member.highlights.length > 0 && (
                        <div>
                            <h4 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">{t('members.dialog.projects')}</h4>
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
