import { Video } from "../types";

// Real Fulguria Team videos from YouTube channel @FulguriaTeam
// Channel: https://www.youtube.com/@FulguriaTeam
export const videos: Video[] = [
    {
        id: "fulguria-mep-2024",
        title: "Fulguria Team - MEP 2024",
        url: "https://www.youtube.com/@FulguriaTeam/videos",
        thumbnailUrl: "https://i.ytimg.com/vi/placeholder/hqdefault.jpg",
        publishedAt: "2024-12-01T10:00:00Z",
        description: "MEP collaboratif de la Fulguria Team 2024.",
    },
    {
        id: "kirr-amv-1",
        title: "KiRr - AMV Edit",
        url: "https://www.youtube.com/@KiRr51",
        thumbnailUrl: "https://i.ytimg.com/vi/placeholder/hqdefault.jpg",
        publishedAt: "2024-11-28T15:30:00Z",
        description: "AMV par KiRr, leader de la Fulguria Team.",
    },
    {
        id: "tenteki-amv-1",
        title: "Tenteki - AMV Edit",
        url: "https://www.youtube.com/@TentekiAMV",
        thumbnailUrl: "https://i.ytimg.com/vi/placeholder/hqdefault.jpg",
        publishedAt: "2024-11-25T12:00:00Z",
        description: "AMV par Tenteki.",
    },
    {
        id: "netsuma-amv-1",
        title: "Netsuma - AMV Edit",
        url: "https://www.youtube.com/@netsuma_amv",
        thumbnailUrl: "https://i.ytimg.com/vi/placeholder/hqdefault.jpg",
        publishedAt: "2024-11-20T18:45:00Z",
        description: "AMV par Netsuma.",
    },
    {
        id: "conan-amv-1",
        title: "Conan - AMV Edit",
        url: "https://www.youtube.com/@AkaiMV",
        thumbnailUrl: "https://i.ytimg.com/vi/placeholder/hqdefault.jpg",
        publishedAt: "2024-11-15T14:20:00Z",
        description: "AMV par Conan (AkaiMV).",
    },
    {
        id: "danny-amv-1",
        title: "Danny - AMV Edit",
        url: "https://www.youtube.com/@DannyMxz",
        thumbnailUrl: "https://i.ytimg.com/vi/placeholder/hqdefault.jpg",
        publishedAt: "2024-11-10T11:15:00Z",
        description: "AMV par Danny.",
    },
    {
        id: "jasu-amv-1",
        title: "Jasu - AMV Edit",
        url: "https://www.youtube.com/@JasuAMV",
        thumbnailUrl: "https://i.ytimg.com/vi/placeholder/hqdefault.jpg",
        publishedAt: "2024-11-05T16:00:00Z",
        description: "AMV par Jasu.",
    },
    {
        id: "lunikyuu-amv-1",
        title: "Lunikyuu - AMV Edit",
        url: "https://www.youtube.com/@lunikyuuu",
        thumbnailUrl: "https://i.ytimg.com/vi/placeholder/hqdefault.jpg",
        publishedAt: "2024-10-30T13:30:00Z",
        description: "AMV par Lunikyuu.",
    },
    {
        id: "zeph-amv-1",
        title: "Zeph - AMV Edit",
        url: "https://www.youtube.com/@zeph_83",
        thumbnailUrl: "https://i.ytimg.com/vi/placeholder/hqdefault.jpg",
        publishedAt: "2024-10-25T10:45:00Z",
        description: "AMV par Zeph.",
    },
];

// Utility function to get latest videos (for homepage)
export function getLatestVideos(count: number = 6): Video[] {
    return videos.slice(0, count);
}

// Utility function to format published date
export function formatPublishedDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Hier";
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaine${Math.floor(diffDays / 7) > 1 ? 's' : ''}`;
    if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`;
    return `Il y a ${Math.floor(diffDays / 365)} an${Math.floor(diffDays / 365) > 1 ? 's' : ''}`;
}

// Utility function to format view count
export function formatViews(views: number): string {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M vues`;
    if (views >= 1000) return `${(views / 1000).toFixed(0)}K vues`;
    return `${views} vues`;
}
