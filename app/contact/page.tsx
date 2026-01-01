"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/animations/FadeIn";
import {
    Send, RotateCcw, User, Mail, MessageSquare, Globe,
    Calendar, Link, FileText, UserPlus, CheckCircle2
} from "lucide-react";
import { countries } from "@/lib/data/countries";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/context/TranslationContext";

type ContactMode = "apply" | "contact";

export default function ContactPage() {
    const [mode, setMode] = useState<ContactMode>("apply");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Apply form state
    const [applyForm, setApplyForm] = useState({
        username: "",
        email: "",
        discordId: "",
        age: "",
        nationality: "",
        bestAmv: "",
        recentAmv: "",
        message: "",
    });

    // Contact form state
    const [contactForm, setContactForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const { t } = useTranslation();

    const tabs = [
        { id: "apply" as ContactMode, labelKey: "contact.tab_apply", icon: UserPlus },
        { id: "contact" as ContactMode, labelKey: "contact.tab_contact", icon: Mail },
    ];

    const handleApplySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setIsSubmitted(true);
        setTimeout(() => {
            setIsSubmitted(false);
            resetApplyForm();
        }, 3000);
    };

    const handleContactSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setIsSubmitted(true);
        setTimeout(() => {
            setIsSubmitted(false);
            resetContactForm();
        }, 3000);
    };

    const resetApplyForm = () => {
        setApplyForm({
            username: "",
            email: "",
            discordId: "",
            age: "",
            nationality: "",
            bestAmv: "",
            recentAmv: "",
            message: "",
        });
    };

    const resetContactForm = () => {
        setContactForm({
            name: "",
            email: "",
            subject: "",
            message: "",
        });
    };

    return (
        <div className="py-12 pt-28 md:pt-32 min-h-screen">
            {/* Background decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            </div>

            <div className="container-custom max-w-3xl relative z-10">
                <FadeIn>
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                            {t('contact.title')}
                        </h1>
                        <p className="text-muted-foreground">
                            {t('contact.subtitle')}
                        </p>
                    </div>

                    {/* Main Card */}
                    <div className="glass rounded-2xl p-6 md:p-8 border border-border">
                        {/* Tab Navigation */}
                        <div className="relative flex mb-8 p-1 bg-card/50 rounded-xl border border-border">
                            {/* Sliding background indicator */}
                            <motion.div
                                className="absolute top-1 bottom-1 bg-primary rounded-lg shadow-lg"
                                initial={false}
                                animate={{
                                    left: mode === "apply" ? "4px" : "calc(50% - 2px)",
                                    width: "calc(50% - 4px)"
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 30
                                }}
                            />
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => {
                                            setMode(tab.id);
                                            setIsSubmitted(false);
                                        }}
                                        className={cn(
                                            "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-sm transition-colors duration-200 relative z-10",
                                            mode === tab.id
                                                ? "text-white"
                                                : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {t(tab.labelKey)}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Success Message */}
                        {isSubmitted ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4 animate-pulse">
                                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                                </div>
                                <h4 className="text-lg font-semibold text-foreground mb-2">
                                    {mode === "apply" ? "Candidature envoyée !" : "Message envoyé !"}
                                </h4>
                                <p className="text-muted-foreground">
                                    {mode === "apply"
                                        ? "Merci pour ta candidature, on te répond très vite 🚀"
                                        : "Merci, on te répond sous 48h 🚀"
                                    }
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Apply Form */}
                                {mode === "apply" && (
                                    <form onSubmit={handleApplySubmit} className="space-y-4">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {/* Username */}
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1.5">
                                                    {t('contact.form_apply.username')} *
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                        <User className="w-4 h-4" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={applyForm.username}
                                                        onChange={(e) => setApplyForm(prev => ({ ...prev, username: e.target.value }))}
                                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground text-sm"
                                                        placeholder={t('login.username_placeholder')}
                                                    />
                                                </div>
                                            </div>

                                            {/* Email */}
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1.5">
                                                    {t('contact.form_apply.email')} *
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                        <Mail className="w-4 h-4" />
                                                    </div>
                                                    <input
                                                        type="email"
                                                        required
                                                        value={applyForm.email}
                                                        onChange={(e) => setApplyForm(prev => ({ ...prev, email: e.target.value }))}
                                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground text-sm"
                                                        placeholder="ton@email.com"
                                                    />
                                                </div>
                                            </div>

                                            {/* Discord ID */}
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1.5">
                                                    {t('contact.form_apply.discord')} *
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500">
                                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                                                        </svg>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={applyForm.discordId}
                                                        onChange={(e) => setApplyForm(prev => ({ ...prev, discordId: e.target.value }))}
                                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground text-sm"
                                                        placeholder="123456789012345678"
                                                    />
                                                </div>
                                            </div>

                                            {/* Age */}
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1.5">
                                                    {t('contact.form_apply.age')} *
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                        <Calendar className="w-4 h-4" />
                                                    </div>
                                                    <input
                                                        type="number"
                                                        required
                                                        min="13"
                                                        max="99"
                                                        value={applyForm.age}
                                                        onChange={(e) => setApplyForm(prev => ({ ...prev, age: e.target.value }))}
                                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground text-sm"
                                                        placeholder="Ton âge"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Nationality */}
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-1.5">
                                                {t('contact.form_apply.nationality')} *
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                    <Globe className="w-4 h-4" />
                                                </div>
                                                <select
                                                    required
                                                    value={applyForm.nationality}
                                                    onChange={(e) => setApplyForm(prev => ({ ...prev, nationality: e.target.value }))}
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground text-sm appearance-none cursor-pointer"
                                                >
                                                    <option value="">{t('contact.form_apply.select_country')}</option>
                                                    {countries.map((country) => (
                                                        <option key={country} value={country}>
                                                            {country}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>

                                        {/* AMV Links */}
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1.5">
                                                    Meilleur AMV *
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                        <Link className="w-4 h-4" />
                                                    </div>
                                                    <input
                                                        type="url"
                                                        required
                                                        value={applyForm.bestAmv}
                                                        onChange={(e) => setApplyForm(prev => ({ ...prev, bestAmv: e.target.value }))}
                                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground text-sm"
                                                        placeholder={t('contact.form_apply.best_amv_placeholder')}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1.5">
                                                    AMV Récent *
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                        <Link className="w-4 h-4" />
                                                    </div>
                                                    <input
                                                        type="url"
                                                        required
                                                        value={applyForm.recentAmv}
                                                        onChange={(e) => setApplyForm(prev => ({ ...prev, recentAmv: e.target.value }))}
                                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground text-sm"
                                                        placeholder={t('contact.form_apply.recent_amv_placeholder')}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Message */}
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-1.5">
                                                Message
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-3 text-muted-foreground">
                                                    <FileText className="w-4 h-4" />
                                                </div>
                                                <textarea
                                                    rows={4}
                                                    value={applyForm.message}
                                                    onChange={(e) => setApplyForm(prev => ({ ...prev, message: e.target.value }))}
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground text-sm resize-y min-h-[100px]"
                                                    placeholder={t('contact.form_apply.message_placeholder')}
                                                />
                                            </div>
                                        </div>

                                        {/* Buttons */}
                                        <div className="flex gap-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={resetApplyForm}
                                                className="flex-1 py-3 px-6 rounded-lg border border-border text-muted-foreground font-medium flex items-center justify-center gap-2 hover:bg-card hover:text-foreground transition-all"
                                            >
                                                <RotateCcw className="w-4 h-4" />
                                                {t('common.reset')}
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="flex-1 py-3 px-6 rounded-lg bg-gradient-to-r from-primary to-primary-light text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                        Envoi...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="w-4 h-4" />
                                                        {t('common.submit')}
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {/* Contact Form */}
                                {mode === "contact" && (
                                    <form onSubmit={handleContactSubmit} className="space-y-4">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {/* Name */}
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1.5">
                                                    {t('contact.form_contact.name')} *
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                        <User className="w-4 h-4" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={contactForm.name}
                                                        onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground text-sm"
                                                        placeholder="Ton nom"
                                                    />
                                                </div>
                                            </div>

                                            {/* Email */}
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1.5">
                                                    {t('contact.form_contact.email')} *
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                        <Mail className="w-4 h-4" />
                                                    </div>
                                                    <input
                                                        type="email"
                                                        required
                                                        value={contactForm.email}
                                                        onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground text-sm"
                                                        placeholder="ton@email.com"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Subject */}
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-1.5">
                                                {t('contact.form_contact.subject')} *
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                    <MessageSquare className="w-4 h-4" />
                                                </div>
                                                <input
                                                    type="text"
                                                    required
                                                    value={contactForm.subject}
                                                    onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground text-sm"
                                                    placeholder={t('contact.form_contact.message_placeholder')}
                                                />
                                            </div>
                                        </div>

                                        {/* Message */}
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-1.5">
                                                {t('contact.form_contact.message')} *
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-3 text-muted-foreground">
                                                    <FileText className="w-4 h-4" />
                                                </div>
                                                <textarea
                                                    required
                                                    rows={5}
                                                    value={contactForm.message}
                                                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground text-sm resize-y min-h-[120px]"
                                                    placeholder={t('contact.form_contact.details_placeholder')}
                                                />
                                            </div>
                                        </div>

                                        {/* Buttons */}
                                        <div className="flex gap-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={resetContactForm}
                                                className="flex-1 py-3 px-6 rounded-lg border border-border text-muted-foreground font-medium flex items-center justify-center gap-2 hover:bg-card hover:text-foreground transition-all"
                                            >
                                                <RotateCcw className="w-4 h-4" />
                                                {t('common.reset')}
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="flex-1 py-3 px-6 rounded-lg bg-gradient-to-r from-primary to-primary-light text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                        Envoi...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="w-4 h-4" />
                                                        Envoyer
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </>
                        )}
                    </div>
                </FadeIn>
            </div>
        </div>
    );
}
