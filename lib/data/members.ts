import { Member, Role } from "../types";

// Fulguria Team Data
export const members: Member[] = [
    // Leader
    {
        id: "kirr",
        slug: "kirr",
        pseudo: "KiRr",
        primaryRole: "Leader",
        secondaryRoles: ["AMV Maker", "Design FX"],
        avatarUrl: "/assets/roster/KIRR.png",
        bioShort: "Leader de la Fulguria Team, AMV Maker et Graphiste polyvalent.",
        bioLong: "Leader fondateur de la Fulguria Team. Je combine mes compétences en editing et en graphisme pour guider la vision artistique du collectif. Passionné par la création visuelle sous toutes ses formes.",
        socials: {
            youtube: "https://www.youtube.com/@KiRr51",
            x: "https://x.com/kirr51",
            discord: "kirr",
        },
        joinedDate: "2019-01-01", // Placeholder date
    },

    // AMV Makers
    {
        id: "tenteki",
        slug: "tenteki",
        pseudo: "Tenteki",
        primaryRole: "AMV Maker",
        avatarUrl: "/assets/roster/TENTEKI.png",
        bioShort: "AMV Maker passionné par l'editing créatif.",
        socials: {
            youtube: "https://www.youtube.com/@TentekiAMV",
            x: "https://x.com/lunaticyume",
            instagram: "https://www.instagram.com/tenteki_edit/",
        },
    },
    {
        id: "netsuma",
        slug: "netsuma",
        pseudo: "Netsuma",
        primaryRole: "AMV Maker",
        avatarUrl: "/assets/roster/NETSUMA.png",
        bioShort: "AMV Maker au style dynamique.",
        socials: {
            youtube: "https://www.youtube.com/@netsuma_amv",
            x: "https://x.com/NetsumaAMV",
        },
    },
    {
        id: "ruby",
        slug: "ruby",
        pseudo: "Ruby",
        primaryRole: "AMV Maker",
        avatarUrl: "/assets/roster/RUBY.png",
        bioShort: "Créateur de contenus AMV.",
        socials: {
            youtube: "https://www.youtube.com/@Rubynix",
            x: "https://x.com/Rosycoco555",
        },
    },
    {
        id: "conan",
        slug: "conan",
        pseudo: "Conan",
        primaryRole: "AMV Maker",
        avatarUrl: "/assets/roster/CONAN.png",
        bioShort: "Passionné par l'animation et le montage.",
        socials: {
            youtube: "https://www.youtube.com/@AkaiMV",
            x: "https://x.com/AkaiMv49068",
        },
    },
    {
        id: "isashii",
        slug: "isashii",
        pseudo: "ISASHII",
        primaryRole: "AMV Maker",
        avatarUrl: "/assets/roster/ISASHI.png",
        bioShort: "Éditeur AMV talentueux.",
        socials: {
            youtube: "https://www.youtube.com/@ISASHII_AMV",
            x: "https://x.com/ISASHII__",
        },
    },
    {
        id: "zeph",
        slug: "zeph",
        pseudo: "Zeph",
        primaryRole: "AMV Maker",
        avatarUrl: "/assets/roster/ZEPH.png",
        bioShort: "Créateur de vidéos musicales anime.",
        socials: {
            youtube: "https://www.youtube.com/@zeph_83",
            x: "https://x.com/zeph__83",
        },
    },
    {
        id: "kotori",
        slug: "kotori",
        pseudo: "Kotori",
        primaryRole: "AMV Maker",
        avatarUrl: "/assets/roster/koto.png",
        bioShort: "AMV Maker avec une touche unique.",
        socials: {
            youtube: "https://www.youtube.com/channel/UCGANQEqkX6embIReAWbFmzw",
            x: "https://x.com/KotoriSoul_",
        },
    },
    {
        id: "danny",
        slug: "danny",
        pseudo: "Danny",
        primaryRole: "AMV Maker",
        avatarUrl: "/assets/roster/DANNY.png",
        bioShort: "Éditeur AMV actif sur YouTube et TikTok.",
        socials: {
            youtube: "https://www.youtube.com/@DannyMxz",
            x: "https://x.com/_dannymxz",
            tiktok: "https://www.tiktok.com/@dannymxz",
        },
    },
    {
        id: "jasu",
        slug: "jasu",
        pseudo: "Jasu",
        primaryRole: "AMV Maker",
        avatarUrl: "/assets/roster/JASU.png",
        bioShort: "Créateur polyvalent sur plusieurs plateformes.",
        socials: {
            youtube: "https://www.youtube.com/@JasuAMV",
            x: "https://x.com/JasuAMV",
            instagram: "https://www.instagram.com/jasuamv/",
            tiktok: "https://www.tiktok.com/@jasuamv106",
        },
    },
    {
        id: "leo",
        slug: "leo",
        pseudo: "Leo",
        primaryRole: "AMV Maker",
        avatarUrl: "/assets/roster/LEO.png",
        bioShort: "AMV Maker.",
        socials: {
            youtube: "https://www.youtube.com/@Leothetower_AMV",
        },
    },
    {
        id: "lunikyuu",
        slug: "lunikyuu",
        pseudo: "Lunikyuu",
        primaryRole: "AMV Maker",
        avatarUrl: "/assets/roster/LUNIKYUU.png",
        bioShort: "Créateur de contenu AMV.",
        socials: {
            youtube: "https://www.youtube.com/@lunikyuuu",
            x: "https://x.com/lunikyuu_arg",
        },
    },
    {
        id: "atsuyo",
        slug: "atsuyo",
        pseudo: "Atsuyo",
        primaryRole: "AMV Maker",
        avatarUrl: "/assets/roster/ATSUYO.png",
        bioShort: "Pasisonné d'AMV.",
        socials: {
            youtube: "https://www.youtube.com/@atsuyoAMV",
        },
    },
    {
        id: "uram",
        slug: "uram",
        pseudo: "Uram's",
        primaryRole: "AMV Maker",
        secondaryRoles: ["Design FX"],
        avatarUrl: "/assets/roster/URAMA.png",
        bioShort: "AMV Maker et Graphiste.",
        socials: {
            youtube: "https://www.youtube.com/@Urama3066",
            x: "https://x.com/Urama_Sama",
        },
    },
    {
        id: "sakyu",
        slug: "sakyu",
        pseudo: "SAKYU",
        primaryRole: "AMV Maker",
        avatarUrl: "/assets/roster/SAKYU.png",
        bioShort: "Membre AMV Maker de la team.",
        socials: {},
    },
    {
        id: "syuuki",
        slug: "syuuki",
        pseudo: "SYUUKI",
        primaryRole: "AMV Maker",
        avatarUrl: "/assets/roster/SYUUKI.png",
        bioShort: "Membre AMV Maker de la team.",
        socials: {},
    },

    // Design FX / Graphistes
    {
        id: "kure",
        slug: "kure",
        pseudo: "Kure",
        primaryRole: "Design FX",
        avatarUrl: "/assets/roster/KURE.png",
        bioShort: "Graphiste talentueux pour la team.",
        socials: {
            youtube: "https://www.youtube.com/@kurx.e",
            x: "https://x.com/kurx_e",
        },
    },
    {
        id: "mirae",
        slug: "mirae",
        pseudo: "Mirae",
        primaryRole: "Design FX",
        avatarUrl: "/assets/roster/MIRAE.png",
        bioShort: "Graphiste créatif.",
        socials: {
            x: "https://x.com/nlxy152049",
        },
    },
];

// Utility function to get members by role
export function getMembersByRole(role: Role): Member[] {
    return members.filter(member => member.primaryRole === role);
}

// Utility function to get a member by slug
export function getMemberBySlug(slug: string): Member | undefined {
    return members.find(member => member.slug === slug);
}

// Get role groups in order
export function getRoleGroups() {
    const roleOrder: Role[] = ["Leader", "AMV Maker", "Design FX"];

    return roleOrder.map(role => ({
        role,
        members: getMembersByRole(role),
        description: getRoleDescription(role),
    }));
}

function getRoleDescription(role: Role): string {
    const descriptions: Record<string, string> = {
        "Leader": "Direction créative et coordination de l'équipe",
        "AMV Maker": "Créateurs de contenus AMV et montage vidéo",
        "Design FX": "Effets visuels, motion design et création graphique",
    };
    return descriptions[role] || "";
}

// Get featured members for homepage (2 from each role, or mixed)
export function getFeaturedMembers(): Member[] {
    // Return a curated list or random sample
    // For now, let's take: KiRr (Leader), Tenteki (AMV), Netsuma (AMV), Kure (Design), Mirae (Design)
    const featuredIds = ["kirr", "tenteki", "netsuma", "kure", "mirae"];
    return members.filter(m => featuredIds.includes(m.id));
}
