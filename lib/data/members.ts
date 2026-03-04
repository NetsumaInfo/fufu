import { Member, Role } from "../types";

// Fulguria Team Data
export const members: Member[] = [
    // Leader
    {
        id: "kirr",
        slug: "kirr",
        pseudo: "KiRr",
        primaryRole: "Leader",
        secondaryRoles: ["AMV Maker", "Graphiste"],
        avatarUrl: "/images/team/PP/KIRR.png",
        bioShort: "Leader de la Fulguria Team, AMV Maker et Graphiste polyvalent.",
        bioLong: "Leader fondateur de la Fulguria Team. Je combine mes compétences en editing et en graphisme pour guider la vision artistique du collectif. Passionné par la création visuelle sous toutes ses formes.",
        socials: {
            youtube: "https://www.youtube.com/@KiRr51",
            x: "https://x.com/kirr51",
            discord: "kirr",
        },
        joinedDate: "2019-01-01",
    },

    // AMV Makers
    {
        id: "netsuma",
        slug: "netsuma",
        pseudo: "Netsuma",
        primaryRole: "AMV Maker",
        avatarUrl: "/images/team/PP/NETSUMA.png",
        bioShort: "Tranquille.",
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
        avatarUrl: "/images/team/PP/RUBY.png",
        bioShort: "Urama & Zeeeph Fucking Gayyy !!!",
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
        avatarUrl: "/images/team/PP/CONAN.png",
        bioShort: "Merveilleux jeune homme d'une beauté irréprochable.",
        socials: {
            youtube: "https://www.youtube.com/@AkaiMV",
            x: "https://x.com/AkaiMv49068",
        },
    },
    {
        id: "zeph",
        slug: "zeph",
        pseudo: "Zeph",
        primaryRole: "AMV Maker",
        avatarUrl: "/images/team/PP/ZEPH.png",
        bioShort: "Je préfère encore être un cochon décadent qu'un fasciste",
        socials: {
            youtube: "https://www.youtube.com/@zefouuu83",
            x: "https://x.com/zeph__83",
        },
    },
    {
        id: "kotori",
        slug: "kotori",
        pseudo: "Kotori",
        primaryRole: "AMV Maker",
        avatarUrl: "/images/team/PP/koto.png",
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
        avatarUrl: "/images/team/PP/DANNY.png",
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
        avatarUrl: "/images/team/PP/JASU.png",
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
        avatarUrl: "/images/team/PP/LEO.png",
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
        avatarUrl: "/images/team/PP/LUNIKYUU.png",
        bioShort: "Je m'identifie comme un calque de forme.",
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
        avatarUrl: "/images/team/PP/ATSUYO.png",
        bioShort: "Trop d'étranger.",
        socials: {
            youtube: "https://www.youtube.com/@atsuyoAMV",
        },
    },
    {
        id: "ycgm",
        slug: "ycgm",
        pseudo: "YCGM",
        primaryRole: "AMV Maker",
        avatarUrl: "/images/team/PP/YCGM.png",
        bioShort: ".",
        socials: {
            youtube: "https://www.youtube.com/@YCGM-cn7fu",
            bilibili: "https://space.bilibili.com/21787827",
        },
    },
    {
        id: "uram",
        slug: "uram",
        pseudo: "Uram's",
        primaryRole: "AMV Maker",
        secondaryRoles: ["Graphiste"],
        avatarUrl: "/images/team/PP/URAMA.png",
        bioShort: "Célibataire, mais pas de choix.",
        socials: {
            youtube: "https://www.youtube.com/@Urama3066",
            x: "https://x.com/Urama_Sama",
        },
    },
    {
        id: "tenteki",
        slug: "tenteki",
        pseudo: "Tenteki",
        primaryRole: "AMV Maker",
        avatarUrl: "/images/team/PP/TENTEKI.png",
        bioShort: "AMV Maker passionné par l'editing créatif.",
        socials: {
            youtube: "https://www.youtube.com/@TentekiAMV",
            x: "https://x.com/lunaticyume",
            instagram: "https://www.instagram.com/tenteki_edit/",
        },
    },
    {
        id: "louvi",
        slug: "louvi",
        pseudo: "Louvi",
        primaryRole: "AMV Maker",
        avatarUrl: "/images/team/PP/LOUVI.png",
        bioShort: "La goat, voilà, parce que d'après le calendrier Chinois avec Netchoupi, nous sommes des chèvres, donc des goat.",
        socials: {
            youtube: "https://www.youtube.com/@Louvi_Amv",
            x: "https://x.com/Louviisback",
        },
    },
    {
        id: "cmoididi",
        slug: "cmoididi",
        pseudo: "Cmoididi",
        primaryRole: "AMV Maker",
        avatarUrl: "/images/team/PP/CMOIDIDI.png",
        bioShort: "C'est moi Didi, j'aime les feuilles vertes et parfois je suis un gobelin, attention.",
        socials: {
            youtube: "https://www.youtube.com/@MrCmoididi",
            x: "https://x.com/cmoididi",
            website: "https://www.diegofroment.com/",
            linkedin: "https://www.linkedin.com/in/diego-froment-6858a69b/",
        },
    },

    // Design FX / Graphistes
    {
        id: "kure",
        slug: "kure",
        pseudo: "Kure",
        primaryRole: "Graphiste",
        avatarUrl: "/images/team/PP/KURE.png",
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
        primaryRole: "Graphiste",
        avatarUrl: "/images/team/PP/MIRAE.png",
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
    const roleOrder: Role[] = ["Leader", "AMV Maker", "Graphiste"];

    return roleOrder.map(role => ({
        role,
        members: getMembersByRole(role),
        description: getRoleDescription(role),
    }));
}

function getRoleDescription(role: Role): string {
    // Return the translation key instead of the hardcoded string
    const descriptionKeys: Record<string, string> = {
        "Leader": "members.roles.Leader.description",
        "AMV Maker": "members.roles.AMV Maker.description",
        "Graphiste": "members.roles.Graphiste.description",
    };
    return descriptionKeys[role] || "";
}

// Get featured members for homepage (2 from each role, or mixed)
export function getFeaturedMembers(): Member[] {
    // Return a curated list or random sample
    // For now, let's take: KiRr (Leader), Tenteki (AMV), Netsuma (AMV), Kure (Design), Mirae (Design)
    const featuredIds = ["kirr", "tenteki", "netsuma", "kure", "mirae"];
    return members.filter(m => featuredIds.includes(m.id));
}

// Get all members for carousel display
export function getAllMembers(): Member[] {
    return members;
}
