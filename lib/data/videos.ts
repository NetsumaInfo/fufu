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

// Utility function to format published date using Intl.RelativeTimeFormat
export function formatPublishedDate(dateString: string, locale: string = 'fr'): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffSeconds = (date.getTime() - now.getTime()) / 1000;
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

    if (Math.abs(diffSeconds) < 60) return rtf.format(Math.round(diffSeconds), 'second');
    if (Math.abs(diffSeconds) < 3600) return rtf.format(Math.round(diffSeconds / 60), 'minute');
    if (Math.abs(diffSeconds) < 86400) return rtf.format(Math.round(diffSeconds / 3600), 'hour');
    if (Math.abs(diffSeconds) < 604800) return rtf.format(Math.round(diffSeconds / 86400), 'day');
    if (Math.abs(diffSeconds) < 2592000) return rtf.format(Math.round(diffSeconds / 604800), 'week');
    if (Math.abs(diffSeconds) < 31536000) return rtf.format(Math.round(diffSeconds / 2592000), 'month');

    return rtf.format(Math.round(diffSeconds / 31536000), 'year');
}

// Utility function to format view count using Intl.NumberFormat
export function formatViews(views: number, locale: string = 'fr'): string {
    return new Intl.NumberFormat(locale, { notation: "compact", compactDisplay: "short" }).format(views);
}
