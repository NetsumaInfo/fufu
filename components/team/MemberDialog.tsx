"use client";

import Image from "next/image";
import { Youtube, Twitter, Instagram, Globe, Hash, ExternalLink } from "lucide-react";
import { Dialog } from "@/components/ui/Dialog";
import { Badge, getRoleBadgeVariant } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
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
    discord: Hash,
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
            <div className="grid md:grid-cols-3 gap-8">
                {/* Left column - Avatar and basic info */}
                <div className="md:col-span-1">
                    <div className="sticky top-0">
                        {/* Large avatar */}
                        <div className="relative w-48 h-48 mx-auto mb-6">
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
                        <h3 className="text-2xl font-bold text-center text-primary-light mb-3">
                            {member.pseudo}
                        </h3>

                        {/* Roles */}
                        <div className="flex flex-wrap gap-2 justify-center mb-6">
                            <Badge variant={getRoleBadgeVariant(member.primaryRole)}>
                                {member.primaryRole}
                            </Badge>
                            {member.secondaryRoles?.map((role) => (
                                <Badge key={role} variant={getRoleBadgeVariant(role)}>
                                    {role}
                                </Badge>
                            ))}
                        </div>

                        {/* Joined date */}
                        {member.joinedDate && (
                            <p className="text-sm text-muted-foreground text-center">
                                Membre depuis {new Date(member.joinedDate).toLocaleDateString("fr-FR", {
                                    month: "long",
                                    year: "numeric"
                                })}
                            </p>
                        )}
                    </div>
                </div>

                {/* Right column - Details */}
                <div className="md:col-span-2 space-y-6">
                    {/* Bio */}
                    <div>
                        <h4 className="text-lg font-semibold text-foreground mb-3">À propos</h4>
                        <p className="text-muted-foreground leading-relaxed">
                            {member.bioLong || member.bioShort}
                        </p>
                    </div>

                    {/* Social links */}
                    <div>
                        <h4 className="text-lg font-semibold text-foreground mb-3">Réseaux sociaux</h4>
                        <div className="grid sm:grid-cols-2 gap-3">
                            {Object.entries(member.socials).map(([platform, url]) => {
                                if (!url) return null;
                                const Icon = socialIcons[platform as keyof typeof socialIcons] || Globe;
                                const label = socialLabels[platform] || platform;

                                return (
                                    <a
                                        key={platform}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all group"
                                    >
                                        <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                                        <span className="flex-1 font-medium">{label}</span>
                                        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Highlights / Featured projects */}
                    {member.highlights && member.highlights.length > 0 && (
                        <div>
                            <h4 className="text-lg font-semibold text-foreground mb-3">Projets mis en avant</h4>
                            <div className="space-y-3">
                                {member.highlights.map((highlight, index) => (
                                    <a
                                        key={index}
                                        href={highlight.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all group"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1">
                                                <h5 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                                    {highlight.label}
                                                </h5>
                                                {highlight.description && (
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {highlight.description}
                                                    </p>
                                                )}
                                            </div>
                                            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action button */}
                    <div className="pt-4 border-t border-border">
                        <Button onClick={onClose} variant="secondary" className="w-full">
                            Fermer le profil
                        </Button>
                    </div>
                </div>
            </div>
        </Dialog>
    );
}
