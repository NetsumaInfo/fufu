import { SectionHeader } from "@/components/ui/SectionHeader";
import { FadeIn } from "@/components/animations/FadeIn";
import { SlideIn } from "@/components/animations/SlideIn";
import { Mail, MessageSquare, Youtube, Twitter, Instagram, Hash } from "lucide-react";

const contactMethods = [
    {
        icon: Hash,
        title: "Discord",
        description: "Rejoins notre serveur Discord pour discuter avec l'équipe",
        link: "https://discord.gg/fulguria",
        linkText: "discord.gg/fulguria",
    },
    {
        icon: Mail,
        title: "Email",
        description: "Envoie-nous un email pour toute question ou collaboration",
        link: "mailto:contact@fulguria.team",
        linkText: "contact@fulguria.team",
    },
    {
        icon: Youtube,
        title: "YouTube",
        description: "Suis-nous sur YouTube pour nos dernières créations",
        link: "https://youtube.com/@fulguria",
        linkText: "@fulguria",
    },
    {
        icon: Twitter,
        title: "X (Twitter)",
        description: "Retrouve nos actualités et annonces",
        link: "https://x.com/fulguria",
        linkText: "@fulguria",
    },
    {
        icon: Instagram,
        title: "Instagram",
        description: "Découvre nos coulisses et aperçus",
        link: "https://instagram.com/fulguria",
        linkText: "@fulguria",
    },
];

export default function ContactPage() {
    return (
        <div className="py-12">
            <div className="container-custom max-w-4xl">
                <FadeIn>
                    <SectionHeader
                        title="Contactez-nous"
                        description="Une question, une proposition de collaboration ou simplement envie de discuter ? N'hésite pas à nous contacter !"
                        centered
                    />
                </FadeIn>

                <div className="mt-12 grid md:grid-cols-2 gap-6">
                    {contactMethods.map((method, index) => {
                        const Icon = method.icon;
                        return (
                            <SlideIn key={index} direction="up" delay={index * 0.1}>
                                <a
                                    href={method.link}
                                    target={method.link.startsWith("mailto:") ? undefined : "_blank"}
                                    rel={method.link.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                                    className="card group hover:border-primary/50"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors">
                                            <Icon className="w-6 h-6 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                                                {method.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                {method.description}
                                            </p>
                                            <p className="text-sm text-primary font-medium">
                                                {method.linkText} →
                                            </p>
                                        </div>
                                    </div>
                                </a>
                            </SlideIn>
                        );
                    })}
                </div>

                {/* Additional Info */}
                <SlideIn direction="up" className="mt-12">
                    <div className="glass rounded-2xl p-8 md:p-10 text-center">
                        <MessageSquare className="w-12 h-12 text-primary mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-foreground mb-3">
                            Temps de réponse
                        </h3>
                        <p className="text-muted-foreground">
                            Nous nous efforçons de répondre à tous les messages dans les 48 heures.
                            Pour les demandes urgentes, privilégie Discord où nous sommes généralement
                            plus réactifs.
                        </p>
                    </div>
                </SlideIn>
            </div>
        </div>
    );
}
