"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FadeIn } from "@/components/animations/FadeIn";
import {
    User, Mail, Globe, Calendar, Save, Youtube,
    Users, CheckCircle, AlertCircle, Camera, Loader2
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { countries } from "@/lib/data/countries";
import { teams, genders } from "@/lib/data/teams";
import { cn } from "@/lib/utils";
import { processAvatarImage, MAX_FILE_SIZE } from "@/lib/utils/imageProcessing";
import { useTranslation } from "@/lib/context/TranslationContext";

export default function ProfilePage() {
    const { user, updateProfile, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const { t } = useTranslation();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const [formState, setFormState] = useState({
        username: "",
        email: "",
        age: 0,
        gender: "Non spécifié",
        country: "",
        youtubeLink: "",
        discordId: "",
        twitter: "",
        bluesky: "",
        team: "Aucune Team",
        avatar: ""
    });

    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Redirect if not logged in
    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, router]);

    // Load user data into form
    useEffect(() => {
        if (user) {
            setFormState({
                username: user.username || "",
                email: user.email || "",
                age: user.age || 0,
                gender: user.gender || "Non spécifié",
                country: user.country || "",
                youtubeLink: user.youtubeLink || "",
                discordId: user.discordId || "",
                twitter: user.twitter || "",
                bluesky: user.bluesky || "",
                team: user.team || "Aucune Team",
                avatar: user.avatarUrl || "" // Use signed URL for display
            });
        }
    }, [user]);

    // Handle avatar file selection
    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingAvatar(true);
        setMessage(null);

        const result = await processAvatarImage(file);

        if (result.success && result.data) {
            setFormState(prev => ({ ...prev, avatar: result.data! }));
            // Note: success message is hardcoded in original but we can translate if we add a key.
            // For now using safe default or direct string if key missing, but let's try to use generic success.
            setMessage({ type: 'success', text: t('profile.save_success') + ' (Preview)' });
        } else {
            setMessage({ type: 'error', text: result.error || t('contact.error') });
        }

        setIsUploadingAvatar(false);
        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setIsSubmitting(true);

        const result = await updateProfile(formState);

        if (result.success) {
            setMessage({ type: 'success', text: t('profile.save_success') });
        } else {
            setMessage({ type: 'error', text: result.error || t('contact.error') });
        }

        setIsSubmitting(false);

        // Clear success message after 3 seconds
        if (result.success) {
            setTimeout(() => setMessage(null), 3000);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="py-12 pt-28 md:pt-32 min-h-screen">
            {/* Background decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            </div>

            <div className="container-custom max-w-4xl relative z-10">
                <FadeIn>
                    {/* Header with Avatar */}
                    <div className="text-center mb-8">
                        {/* Avatar Upload */}
                        <div className="relative w-24 h-24 mx-auto mb-4 group">
                            <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-primary/30 to-primary/10 border-2 border-primary/30">
                                {formState.avatar ? (
                                    <Image
                                        src={formState.avatar}
                                        alt="Avatar"
                                        width={96}
                                        height={96}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <User className="w-12 h-12 text-primary" />
                                    </div>
                                )}
                            </div>

                            {/* Upload overlay */}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploadingAvatar}
                                className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                            >
                                {isUploadingAvatar ? (
                                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                                ) : (
                                    <Camera className="w-6 h-6 text-white" />
                                )}
                            </button>

                            {/* Hidden file input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                        </div>

                        <p className="text-xs text-muted-foreground mb-4">
                            {t('profile.avatar_hint')}
                        </p>

                        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                            {t('profile.title')}
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            {t('profile.subtitle')}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Personal Info Section */}
                        <div className="glass rounded-2xl p-6 md:p-8 border border-border">
                            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                                <User className="w-5 h-5 text-primary" />
                                {t('profile.personal_info')}
                            </h2>

                            <div className="grid md:grid-cols-2 gap-5">
                                {/* Username */}
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1.5">
                                        {t('profile.username')}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            minLength={3}
                                            value={formState.username}
                                            onChange={(e) => setFormState(prev => ({ ...prev, username: e.target.value }))}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground text-sm"
                                            placeholder={t('profile.username')}
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1.5">
                                        {t('profile.email')}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                            <Mail className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="email"
                                            value={formState.email}
                                            onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground text-sm"
                                            placeholder="votre@email.com"
                                        />
                                    </div>
                                </div>

                                {/* Age */}
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1.5">
                                        {t('profile.age')}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                            <Calendar className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="number"
                                            value={formState.age}
                                            onChange={(e) => setFormState(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                                            max="120"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Gender */}
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1.5">
                                        {t('profile.gender')}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <select
                                            value={formState.gender}
                                            onChange={(e) => setFormState(prev => ({ ...prev, gender: e.target.value }))}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground text-sm appearance-none cursor-pointer"
                                        >
                                            {genders.map((gender) => (
                                                <option key={gender} value={gender}>
                                                    {gender}
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

                                {/* Country */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-foreground mb-1.5">
                                        {t('profile.nationality')}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                            <Globe className="w-4 h-4" />
                                        </div>
                                        <select
                                            value={formState.country}
                                            onChange={(e) => setFormState(prev => ({ ...prev, country: e.target.value }))}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground text-sm appearance-none cursor-pointer"
                                        >
                                            <option value="">{t('profile.select_country')}</option>
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
                            </div>
                        </div>

                        {/* Social Links Section */}
                        <div className="glass rounded-2xl p-6 md:p-8 border border-border">
                            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                                {/* Share icon SVG */}
                                <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="18" cy="5" r="3" />
                                    <circle cx="6" cy="12" r="3" />
                                    <circle cx="18" cy="19" r="3" />
                                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                                </svg>
                                {t('profile.social_links')}
                            </h2>

                            <div className="grid md:grid-cols-2 gap-5">
                                {/* YouTube */}
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1.5">
                                        {t('profile.youtube')}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500">
                                            <Youtube className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="url"
                                            value={formState.youtubeLink}
                                            onChange={(e) => setFormState(prev => ({ ...prev, youtubeLink: e.target.value }))}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground text-sm"
                                            placeholder="https://youtube.com/@votrechaine"
                                        />
                                    </div>
                                </div>

                                {/* Discord */}
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1.5">
                                        {t('profile.discord')}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500">
                                            {/* Discord SVG Logo */}
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            value={formState.discordId}
                                            onChange={(e) => setFormState(prev => ({ ...prev, discordId: e.target.value }))}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground text-sm"
                                            placeholder={t('profile.discord')}
                                        />
                                    </div>
                                </div>

                                {/* Twitter */}
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1.5">
                                        {t('profile.twitter')}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground">
                                            {/* X (Twitter) SVG */}
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            value={formState.twitter}
                                            onChange={(e) => setFormState(prev => ({ ...prev, twitter: e.target.value }))}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground text-sm"
                                            placeholder="@votrecompte"
                                        />
                                    </div>
                                </div>

                                {/* Bluesky */}
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1.5">
                                        {t('profile.bluesky')}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500">
                                            {/* Bluesky SVG */}
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364C23.622 9.418 24 4.458 24 3.768c0-.688-.139-1.86-.902-2.203-.659-.299-1.664-.621-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            value={formState.bluesky}
                                            onChange={(e) => setFormState(prev => ({ ...prev, bluesky: e.target.value }))}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground text-sm"
                                            placeholder="@votre.bsky.social"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Team Section */}
                        <div className="glass rounded-2xl p-6 md:p-8 border border-border">
                            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                                <Users className="w-5 h-5 text-primary" />
                                {t('profile.team')}
                            </h2>

                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    <Users className="w-4 h-4" />
                                </div>
                                <select
                                    value={formState.team}
                                    onChange={(e) => setFormState(prev => ({ ...prev, team: e.target.value }))}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground text-sm appearance-none cursor-pointer"
                                >
                                    {teams.map((team) => (
                                        <option key={team} value={team}>
                                            {team}
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

                        {/* Message */}
                        {message && (
                            <div className={cn(
                                "p-4 rounded-lg flex items-center gap-3",
                                message.type === 'success'
                                    ? "bg-green-500/10 border border-green-500/30 text-green-400"
                                    : "bg-red-500/10 border border-red-500/30 text-red-400"
                            )}>
                                {message.type === 'success' ? (
                                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                )}
                                <span>{message.text}</span>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3.5 px-6 rounded-lg bg-gradient-to-r from-primary to-primary-light text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform-gpu hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    {t('profile.saving')}
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    {t('profile.save_button')}
                                </>
                            )}
                        </button>
                    </form>
                </FadeIn>
            </div>
        </div>
    );
}
