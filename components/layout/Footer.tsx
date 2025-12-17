import Link from "next/link";
import Image from "next/image";
import { Youtube, Twitter, Instagram } from "lucide-react";
import { DiscordIcon } from "@/components/ui/DiscordIcon";

const YOUTUBE_CHANNEL = "https://www.youtube.com/@FulguriaTeam";

const socialLinks = [
    { icon: Youtube, href: YOUTUBE_CHANNEL, label: "YouTube" },
    { icon: DiscordIcon, href: "https://discord.gg/fulguria", label: "Discord" },
    { icon: Twitter, href: "https://x.com/FulguriaTeam", label: "X" },
    { icon: Instagram, href: "https://instagram.com/fulguria", label: "Instagram" },
];

export function Footer() {
    return (
        <footer className="bg-[#0d1117] border-t border-white/5 py-4">
            <div className="container-custom">
                <div className="flex items-center justify-center gap-6 flex-wrap">
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
                    <div className="text-gray-500 text-sm">
                        © 2024-{new Date().getFullYear()} Fulguria Team, All Rights Reserved
                    </div>

                    {/* Legal Links */}
                    <div className="flex gap-3 text-sm">
                        <Link href="/contact" className="text-red-400 hover:text-red-300 transition-colors">
                            Contact
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
