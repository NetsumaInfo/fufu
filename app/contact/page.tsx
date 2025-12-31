"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FadeIn } from "@/components/animations/FadeIn";
import { SlideIn } from "@/components/animations/SlideIn";
import { Mail, MessageSquare, Send, CheckCircle2, Sparkles, Users, Zap } from "lucide-react";
import { DiscordIcon } from "@/components/ui/DiscordIcon";

// Social links with their brand colors
const socialLinks = [
    {
        icon: DiscordIcon,
        title: "Discord",
        description: "Notre hub principal",
        link: "https://discord.gg/fulguria",
        linkText: "Rejoindre le serveur",
        color: "from-[#5865F2] to-[#7289da]",
        hoverBg: "group-hover:bg-[#5865F2]/20",
    },
    {
        icon: () => (
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
                <path fill="#0a0f1a" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
        ),
        title: "YouTube",
        description: "Nos vidéos",
        link: "https://youtube.com/@FulguriaTeam",
        linkText: "S'abonner",
        color: "from-[#FF0000] to-[#cc0000]",
        hoverBg: "group-hover:bg-[#FF0000]/20",
    },
    {
        icon: () => (
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        ),
        title: "X (Twitter)",
        description: "Actualités",
        link: "https://x.com/fulguria",
        linkText: "Suivre",
        color: "from-[#1DA1F2] to-[#0d8bd9]",
        hoverBg: "group-hover:bg-[#1DA1F2]/20",
    },
];

// Features/reasons to contact
const features = [
    {
        icon: Sparkles,
        title: "Collaborations",
        description: "Projets AMV, MEPs ou crossovers"
    },
    {
        icon: Users,
        title: "Partenariats",
        description: "Événements et promotions"
    },
    {
        icon: Zap,
        title: "Demandes",
        description: "Questions et suggestions"
    },
];

export default function ContactPage() {
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setIsSubmitted(true);

        // Reset after 3 seconds
        setTimeout(() => {
            setIsSubmitted(false);
            setFormState({ name: "", email: "", subject: "", message: "" });
        }, 3000);
    };

    return (
        <div className="py-12 pt-28 md:pt-32 min-h-screen">
            {/* Background decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            </div>

            <div className="container-custom max-w-6xl relative z-10">
                {/* Header */}
                <FadeIn>
                    <SectionHeader
                        title="Contactez-nous"
                        description="Une question, une idée de collaboration ou simplement envie de discuter ? On adore échanger avec notre communauté !"
                        centered
                    />
                </FadeIn>

                {/* Features row */}
                <div className="mt-10 grid grid-cols-3 gap-4 md:gap-6 max-w-2xl mx-auto">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <FadeIn key={index} delay={index * 0.1}>
                                <div className="text-center">
                                    <div className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <Icon className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                                    </div>
                                    <h3 className="font-semibold text-foreground text-sm md:text-base">{feature.title}</h3>
                                    <p className="text-xs md:text-sm text-muted-foreground mt-1 hidden md:block">{feature.description}</p>
                                </div>
                            </FadeIn>
                        );
                    })}
                </div>

                {/* Main content grid */}
                <div className="mt-12 grid lg:grid-cols-5 gap-8">

                    {/* Contact Form - Takes 3 columns */}
                    <SlideIn direction="left" className="lg:col-span-3">
                        <div className="glass rounded-2xl p-6 md:p-8 border border-border hover:border-primary/30 transition-colors">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2.5 bg-primary/20 rounded-lg">
                                    <Mail className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-foreground">Envoie-nous un message</h3>
                                    <p className="text-sm text-muted-foreground">On te répond sous 48h</p>
                                </div>
                            </div>

                            {isSubmitted ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4 animate-pulse">
                                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                                    </div>
                                    <h4 className="text-lg font-semibold text-foreground mb-2">Message envoyé !</h4>
                                    <p className="text-muted-foreground">Merci, on te répond très vite 🚀</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">Nom / Pseudo</label>
                                            <input
                                                type="text"
                                                required
                                                value={formState.name}
                                                onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
                                                className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground placeholder:text-muted-foreground"
                                                placeholder="Ton nom"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                                            <input
                                                type="email"
                                                required
                                                value={formState.email}
                                                onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
                                                className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground placeholder:text-muted-foreground"
                                                placeholder="ton@email.com"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Sujet</label>
                                        <input
                                            type="text"
                                            required
                                            value={formState.subject}
                                            onChange={(e) => setFormState(prev => ({ ...prev, subject: e.target.value }))}
                                            className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground placeholder:text-muted-foreground"
                                            placeholder="De quoi veux-tu parler ?"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={formState.message}
                                            onChange={(e) => setFormState(prev => ({ ...prev, message: e.target.value }))}
                                            className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground placeholder:text-muted-foreground resize-none"
                                            placeholder="Dis-nous tout..."
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-3.5 px-6 rounded-lg bg-gradient-to-r from-primary to-primary-light text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform-gpu hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Envoi en cours...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" />
                                                Envoyer le message
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </SlideIn>

                    {/* Right side - Social links - Takes 2 columns */}
                    <SlideIn direction="right" className="lg:col-span-2 space-y-4">
                        {/* Discord highlight card */}
                        <a
                            href="https://discord.gg/fulguria"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block relative overflow-hidden rounded-2xl p-6 border border-[#5865F2]/30 bg-gradient-to-br from-[#5865F2]/10 to-transparent hover:border-[#5865F2]/60 transition-all"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#5865F2]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative flex items-center gap-4">
                                <div className="p-3 bg-[#5865F2]/20 rounded-xl group-hover:bg-[#5865F2]/30 transition-colors">
                                    <DiscordIcon className="w-7 h-7 text-[#5865F2]" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-foreground text-lg group-hover:text-[#5865F2] transition-colors">
                                        Discord
                                    </h3>
                                    <p className="text-sm text-muted-foreground">Notre hub principal • Réponse instantanée</p>
                                </div>
                                <div className="text-[#5865F2] opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                                    →
                                </div>
                            </div>
                        </a>

                        {/* Other socials */}
                        <div className="grid grid-cols-2 gap-4">
                            {socialLinks.slice(1).map((social, index) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={index}
                                        href={social.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`group p-4 rounded-xl border border-border hover:border-primary/30 bg-card/50 backdrop-blur-sm transition-all ${social.hoverBg}`}
                                    >
                                        <div className="flex flex-col items-center text-center gap-2">
                                            <div className="p-2.5 bg-primary/10 rounded-lg group-hover:scale-110 transition-transform">
                                                <Icon />
                                            </div>
                                            <h4 className="font-semibold text-foreground text-sm">{social.title}</h4>
                                            <span className="text-xs text-primary">{social.linkText} →</span>
                                        </div>
                                    </a>
                                );
                            })}
                        </div>

                        {/* Response time info */}
                        <div className="p-5 rounded-xl bg-card/30 border border-border/50">
                            <div className="flex items-center gap-3 mb-2">
                                <MessageSquare className="w-5 h-5 text-primary" />
                                <h4 className="font-semibold text-foreground">Délai de réponse</h4>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                <span className="text-primary font-medium">Discord</span> : quelques heures<br />
                                <span className="text-primary font-medium">Email</span> : sous 48h
                            </p>
                        </div>
                    </SlideIn>
                </div>
            </div>
        </div>
    );
}
