import Link from "next/link";
import { Youtube, Twitter, Instagram } from "lucide-react";
import { DiscordIcon } from "@/components/ui/DiscordIcon";

const YOUTUBE_CHANNEL = "https://www.youtube.com/@FulguriaTeam";

const socialLinks = [
    { icon: Youtube, href: YOUTUBE_CHANNEL, label: "YouTube" },
    { icon: Twitter, href: "https://x.com/fulguria", label: "X (Twitter)" },
    { icon: Instagram, href: "https://instagram.com/fulguria", label: "Instagram" },
    { icon: DiscordIcon, href: "https://discord.gg/fulguria", label: "Discord" },
];

const footerLinks = [
    { href: "/", label: "Accueil" },
    { href: "/team", label: "Team" },
    { href: "/videos", label: "Vidéos" },
    { href: "/recruitment", label: "Recrutement" },
    { href: "/contact", label: "Contact" },
];

export function Footer() {
    return (
        <footer className="relative border-t border-border mt-20">
            <div className="container-custom py-12">
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                    {/* Brand */}
                    <div>
                        <h3 className="text-2xl font-bold text-primary-light mb-3">
                            Fulguria Team
                        </h3>
                        <p className="text-muted-foreground text-sm">
                            Collectif français de créateurs passionnés spécialisés dans la création
                            d'AMV de qualité.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-foreground mb-4">Navigation</h4>
                        <ul className="space-y-2">
                            {footerLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social Links */}
                    <div>
                        <h4 className="font-semibold text-foreground mb-4">Nous suivre</h4>
                        <div className="flex gap-3">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 rounded-lg bg-secondary hover:bg-primary/20 hover:text-primary transition-all"
                                        aria-label={social.label}
                                    >
                                        <Icon className="w-5 h-5" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Fulguria Team. Tous droits réservés.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        French AMV Team ✨
                    </p>
                </div>
            </div>
        </footer>
    );
}
