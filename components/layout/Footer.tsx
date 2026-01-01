import Link from "next/link";
import Image from "next/image";
import { Youtube, Twitter } from "lucide-react";
import { DiscordIcon } from "@/components/ui/DiscordIcon";
import { BilibiliIcon } from "@/components/ui/BilibiliIcon";
import { useTranslation } from "@/lib/context/TranslationContext";

const YOUTUBE_CHANNEL = "https://www.youtube.com/@FulguriaTeam";

const socialLinks = [
    { icon: Youtube, href: YOUTUBE_CHANNEL, label: "YouTube" },
    { icon: DiscordIcon, href: "https://discord.gg/fulguria", label: "Discord" },
    { icon: Twitter, href: "https://x.com/FulguriaTeam", label: "X" },
    { icon: BilibiliIcon, href: "https://space.bilibili.com/3546715653146653/?spm_id_from=333.999.0.0", label: "Bilibili" },
];

export function Footer() {
    const { t } = useTranslation();
    return (
        <footer className="relative z-50 bg-[#0d1117] border-t border-white/5 py-6 md:py-4">
            <div className="container-custom">
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
                    {/* Logo */}
                    <Image
                        src="/images/team/Logo/Logo_Fulguria_White.png"
                        alt="Fulguria Team"
                        width={40}
                        height={40}
                        className="opacity-90"
                    />

                    {/* Social Icons */}
                    <div className="flex items-center gap-3">
                        {socialLinks.map((social) => {
                            const Icon = social.icon;
                            return (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-white transition-colors"
                                    aria-label={social.label}
                                >
                                    <Icon className="w-5 h-5" />
                                </a>
                            );
                        })}
                    </div>

                    {/* Copyright */}
                    <div className="text-gray-500 text-sm text-center md:text-left">
                        © 2024-{new Date().getFullYear()} {t('navbar.team')}, {t('footer.rights')}
                    </div>

                    {/* Legal Links */}
                    <div className="flex gap-3 text-sm">
                        <Link href="/contact" className="text-red-400 hover:text-red-300 transition-colors">
                            {t('navbar.contact')}
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
