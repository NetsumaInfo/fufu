// Core type definitions for the Fulguria Team Showcase

export type Role = "Leader" | "AMV Maker" | "Design FX" | string;

export interface Socials {
    youtube?: string;
    x?: string;
    twitter?: string;
    instagram?: string;
    discord?: string;
    tiktok?: string;
    bilibili?: string;
    website?: string;
}

export interface Highlight {
    label: string;
    url: string;
    description?: string;
}

export interface Member {
    id: string;
    slug: string;
    pseudo: string;
    primaryRole: Role;
    secondaryRoles?: Role[];
    avatarUrl: string;
    bioShort: string;
    bioLong?: string;
    socials: Socials;
    highlights?: Highlight[];
    joinedDate?: string;
}

export interface Video {
    id: string;
    title: string;
    url: string;
    thumbnailUrl: string;
    publishedAt: string;
    description?: string;
    views?: number;
    duration?: string;
}

export interface FAQ {
    question: string;
    answer: string;
}

export interface RecruitmentData {
    rolesNeeded: string[];
    requirements: string[];
    whatWeOffer: string[];
    faq: FAQ[];
}

export interface ApplicationFormData {
    pseudo: string;
    desiredRoles: string[];
    portfolioLinks: string;
    motivation: string;
    availability: string;
    contact: string;
}

// Utility type for sorting members by role
export interface RoleGroup {
    role: Role;
    description?: string;
    members: Member[];
}
