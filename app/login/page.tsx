"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FadeIn } from "@/components/animations/FadeIn";
import { User, Lock, LogIn, Eye, EyeOff, Mail, Globe, Calendar, UserPlus, KeyRound, ArrowLeft, CheckCircle, Users, Youtube, ImagePlus } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { countries } from "@/lib/data/countries";
import { teams, genders } from "@/lib/data/teams";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/context/TranslationContext";

type AuthMode = "login" | "register" | "forgot-password";

export default function LoginPage() {
    const [mode, setMode] = useState<AuthMode>("login");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Login form state
    const [loginForm, setLoginForm] = useState({
        username: "",
        password: "",
    });

    // Register form state
    const [registerForm, setRegisterForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        country: "",
        dateOfBirth: "",
        gender: "",
        team: "",
        // Optional social links
        youtubeLink: "",
        discordId: "",
        twitter: "",
        bluesky: "",
    });

    // Profile picture state
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [profilePreview, setProfilePreview] = useState<string | null>(null);

    // Max file size: 2MB
    const MAX_PROFILE_IMAGE_SIZE = 2 * 1024 * 1024;
    const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
                setError('Format non supporté. Utilisez JPG, PNG, GIF ou WebP.');
                return;
            }
            // Validate file size
            if (file.size > MAX_PROFILE_IMAGE_SIZE) {
                setError('L\'image est trop lourde. Maximum 2MB.');
                return;
            }
            setError('');
            setProfileImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Forgot password form state
    const [forgotEmail, setForgotEmail] = useState("");

    const { login, register, requestPasswordReset, isAuthenticated } = useAuth();
    const router = useRouter();

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated) {
            router.push("/");
        }
    }, [isAuthenticated, router]);

    // Clear messages when mode changes
    useEffect(() => {
        setError("");
        setSuccessMessage("");
    }, [mode]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        const success = await login(loginForm.username, loginForm.password);

        if (success) {
            router.push("/");
        } else {
            setError("Nom d'utilisateur ou mot de passe invalide.");
            setIsSubmitting(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        // Password confirmation check
        if (registerForm.password !== registerForm.confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            setIsSubmitting(false);
            return;
        }

        const result = await register({
            username: registerForm.username,
            email: registerForm.email,
            password: registerForm.password,
            country: registerForm.country,
            dateOfBirth: registerForm.dateOfBirth,
            gender: registerForm.gender,
            team: registerForm.team,
            youtubeLink: registerForm.youtubeLink,
            discordId: registerForm.discordId,
            twitter: registerForm.twitter,
            bluesky: registerForm.bluesky,
        });

        if (result.success) {
            router.push("/");
        } else {
            setError(result.error || "Une erreur est survenue lors de l'inscription.");
            setIsSubmitting(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        const success = await requestPasswordReset(forgotEmail);

        if (success) {
            setSuccessMessage("Si cette adresse e-mail est associée à un compte, vous recevrez un lien de réinitialisation.");
            setForgotEmail("");
        } else {
            setError("Veuillez entrer une adresse e-mail valide.");
        }
        setIsSubmitting(false);
    };

    const { t } = useTranslation();

    return (
        <div className="py-12 pt-28 md:pt-32 min-h-screen flex items-center justify-center">
            {/* Background decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            </div>

            <div className="container-custom max-w-lg relative z-10">
                <FadeIn>
                    {/* Tab Navigation - Outside card, casual style */}
                    <div className="flex justify-center gap-4 mb-6">
                        <button
                            onClick={() => setMode("login")}
                            className={cn(
                                "px-6 py-2.5 text-base font-medium transition-all duration-300 transform skew-x-[-6deg]",
                                mode === "login"
                                    ? "bg-foreground text-background"
                                    : "bg-card border border-border text-foreground hover:bg-foreground/10"
                            )}
                        >
                            <span className="block skew-x-[6deg]">{t('login.tab_login')}</span>
                        </button>
                        <button
                            onClick={() => setMode("register")}
                            className={cn(
                                "px-6 py-2.5 text-base font-medium transition-all duration-300 transform skew-x-[-6deg]",
                                mode === "register"
                                    ? "bg-foreground text-background"
                                    : "bg-card border border-border text-foreground hover:bg-foreground/10"
                            )}
                        >
                            <span className="block skew-x-[6deg]">{t('login.tab_register')}</span>
                        </button>
                    </div>

                    <div className="glass rounded-2xl p-6 md:p-8 border border-border hover:border-primary/30 transition-colors">

                        {/* Login Form */}
                        {mode === "login" && (
                            <FadeIn key="login">


                                <form onSubmit={handleLogin} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1.5">
                                            {t('login.username')}
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                value={loginForm.username}
                                                onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                                                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground placeholder:text-muted-foreground text-sm"
                                                placeholder={t('login.username_placeholder')}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1.5">
                                            {t('login.password')}
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                <Lock className="w-4 h-4" />
                                            </div>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                required
                                                value={loginForm.password}
                                                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                                                className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground placeholder:text-muted-foreground text-sm"
                                                placeholder={t('login.password_placeholder')}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-primary to-primary-light text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform-gpu hover:scale-[1.005] active:scale-[0.995]"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Connexion...
                                            </>
                                        ) : (
                                            <>
                                                <LogIn className="w-5 h-5" />
                                                {t('login.submit')}
                                            </>
                                        )}
                                    </button>

                                    {/* Forgot Password Link */}
                                    <button
                                        type="button"
                                        onClick={() => setMode("forgot-password")}
                                        className="w-full text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1.5 py-2"
                                    >
                                        <KeyRound className="w-3.5 h-3.5" />
                                        {t('login.forgot_password')}
                                    </button>
                                </form>
                            </FadeIn>
                        )}

                        {/* Register Form */}
                        {mode === "register" && (
                            <FadeIn key="register">


                                <form onSubmit={handleRegister} className="space-y-3.5">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1.5">
                                            {t('login.username')} *
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                minLength={3}
                                                value={registerForm.username}
                                                onChange={(e) => setRegisterForm(prev => ({ ...prev, username: e.target.value }))}
                                                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground placeholder:text-muted-foreground text-sm"
                                                placeholder={t('login.register.username_placeholder')}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1.5">
                                            {t('login.email')} *
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                <Mail className="w-4 h-4" />
                                            </div>
                                            <input
                                                type="email"
                                                required
                                                value={registerForm.email}
                                                onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                                                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground placeholder:text-muted-foreground text-sm"
                                                placeholder="votre@email.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-1.5">
                                                {t('login.password')} *
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                    <Lock className="w-4 h-4" />
                                                </div>
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    required
                                                    minLength={6}
                                                    value={registerForm.password}
                                                    onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                                                    className="w-full pl-10 pr-9 py-2.5 rounded-lg bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground placeholder:text-muted-foreground text-sm"
                                                    placeholder={t('login.register.password_placeholder')}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                                >
                                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-1.5">
                                                {t('login.register.confirm_password')} *
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                    <Lock className="w-4 h-4" />
                                                </div>
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    required
                                                    minLength={6}
                                                    value={registerForm.confirmPassword}
                                                    onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                                    className="w-full pl-10 pr-9 py-2.5 rounded-lg bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground placeholder:text-muted-foreground text-sm"
                                                    placeholder={t('login.register.confirm_placeholder')}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                                >
                                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1.5">
                                            {t('login.register.country')} *
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                <Globe className="w-4 h-4" />
                                            </div>
                                            <select
                                                required
                                                value={registerForm.country}
                                                onChange={(e) => setRegisterForm(prev => ({ ...prev, country: e.target.value }))}
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

                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1.5">
                                            {t('login.register.birthdate')} *
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                <Calendar className="w-4 h-4" />
                                            </div>
                                            <input
                                                type="date"
                                                required
                                                value={registerForm.dateOfBirth}
                                                onChange={(e) => setRegisterForm(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                                                max={new Date().toISOString().split("T")[0]}
                                                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Profile Picture Upload */}
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1.5">
                                            Photo de profil
                                        </label>
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-16 h-16 rounded-full bg-card border-2 border-dashed border-border overflow-hidden flex-shrink-0 group">
                                                {profilePreview ? (
                                                    <img
                                                        src={profilePreview}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                        <User className="w-6 h-6" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border hover:border-primary hover:bg-card/80 transition-all text-sm text-foreground">
                                                    <ImagePlus className="w-4 h-4" />
                                                    Choisir une image
                                                    <input
                                                        type="file"
                                                        accept="image/jpeg,image/png,image/gif,image/webp"
                                                        onChange={handleProfileImageChange}
                                                        className="hidden"
                                                    />
                                                </label>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    JPG, PNG ou GIF (max. 2MB)
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Gender and Team Row */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-1.5">
                                                {t('login.register.gender')} *
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                    <User className="w-4 h-4" />
                                                </div>
                                                <select
                                                    required
                                                    value={registerForm.gender}
                                                    onChange={(e) => setRegisterForm(prev => ({ ...prev, gender: e.target.value }))}
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground text-sm appearance-none cursor-pointer"
                                                >
                                                    <option value="">{t('common.select')}</option>
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

                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-1.5">
                                                Team *
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                    <Users className="w-4 h-4" />
                                                </div>
                                                <select
                                                    required
                                                    value={registerForm.team}
                                                    onChange={(e) => setRegisterForm(prev => ({ ...prev, team: e.target.value }))}
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground text-sm appearance-none cursor-pointer"
                                                >
                                                    <option value="">{t('common.select')}</option>
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
                                    </div>

                                    {/* Social Links Section */}
                                    <div className="mt-4 pt-4 border-t border-primary">
                                        <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                                            {/* Share icon */}
                                            <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="18" cy="5" r="3" />
                                                <circle cx="6" cy="12" r="3" />
                                                <circle cx="18" cy="19" r="3" />
                                                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                                                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                                            </svg>
                                            {t('login.register.social_links_title')} <span className="text-muted-foreground font-normal">({t('common.optional')})</span>
                                        </h3>

                                        <div className="grid grid-cols-2 gap-3">
                                            {/* YouTube */}
                                            <div className="relative group">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500 transition-transform group-focus-within:scale-110">
                                                    <Youtube className="w-4 h-4" />
                                                </div>
                                                <input
                                                    type="url"
                                                    value={registerForm.youtubeLink}
                                                    onChange={(e) => setRegisterForm(prev => ({ ...prev, youtubeLink: e.target.value }))}
                                                    className="w-full pl-10 pr-3 py-2 rounded-lg bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground placeholder:text-muted-foreground text-sm"
                                                    placeholder="YouTube"
                                                />
                                            </div>

                                            {/* Discord */}
                                            <div className="relative group">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 transition-transform group-focus-within:scale-110">
                                                    {/* Discord SVG Logo */}
                                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                                                    </svg>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={registerForm.discordId}
                                                    onChange={(e) => setRegisterForm(prev => ({ ...prev, discordId: e.target.value }))}
                                                    className="w-full pl-10 pr-3 py-2 rounded-lg bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground placeholder:text-muted-foreground text-sm"
                                                    placeholder="Pseudo Discord"
                                                />
                                            </div>

                                            {/* Twitter */}
                                            <div className="relative group">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground transition-transform group-focus-within:scale-110">
                                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                                    </svg>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={registerForm.twitter}
                                                    onChange={(e) => setRegisterForm(prev => ({ ...prev, twitter: e.target.value }))}
                                                    className="w-full pl-10 pr-3 py-2 rounded-lg bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground placeholder:text-muted-foreground text-sm"
                                                    placeholder="Twitter / X"
                                                />
                                            </div>

                                            {/* Bluesky */}
                                            <div className="relative group">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500 transition-transform group-focus-within:scale-110">
                                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364C23.622 9.418 24 4.458 24 3.768c0-.688-.139-1.86-.902-2.203-.659-.299-1.664-.621-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z" />
                                                    </svg>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={registerForm.bluesky}
                                                    onChange={(e) => setRegisterForm(prev => ({ ...prev, bluesky: e.target.value }))}
                                                    className="w-full pl-10 pr-3 py-2 rounded-lg bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground placeholder:text-muted-foreground text-sm"
                                                    placeholder="Bluesky"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center animate-in fade-in-0 slide-in-from-top-2 duration-300">
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-primary to-primary-light text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform-gpu hover:scale-[1.005] active:scale-[0.995]"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Création...
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus className="w-5 h-5" />
                                                {t('login.register.submit')}
                                            </>
                                        )}
                                    </button>
                                </form>
                            </FadeIn>
                        )}

                        {/* Forgot Password Form */}
                        {mode === "forgot-password" && (
                            <FadeIn key="forgot-password">
                                <div className="text-center mb-6">
                                    <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-primary/20 flex items-center justify-center">
                                        <KeyRound className="w-7 h-7 text-primary" />
                                    </div>
                                    <h1 className="text-2xl font-bold text-foreground">Mot de passe oublié</h1>
                                    <p className="text-muted-foreground text-sm mt-1">
                                        Recevez un lien de réinitialisation
                                    </p>
                                </div>

                                {successMessage ? (
                                    <div className="text-center py-4">
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                                            <CheckCircle className="w-8 h-8 text-green-400" />
                                        </div>
                                        <p className="text-foreground mb-4">{successMessage}</p>
                                        <button
                                            onClick={() => {
                                                setSuccessMessage("");
                                                setMode("login");
                                            }}
                                            className="inline-flex items-center gap-2 text-primary hover:text-primary-light transition-colors"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            Retour à la connexion
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleForgotPassword} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-1.5">
                                                Adresse e-mail
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                    <Mail className="w-4 h-4" />
                                                </div>
                                                <input
                                                    type="email"
                                                    required
                                                    value={forgotEmail}
                                                    onChange={(e) => setForgotEmail(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground placeholder:text-muted-foreground text-sm"
                                                    placeholder="Entrez votre adresse e-mail"
                                                />
                                            </div>
                                        </div>

                                        {error && (
                                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
                                                {error}
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-primary to-primary-light text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform-gpu hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Envoi...
                                                </>
                                            ) : (
                                                <>
                                                    <Mail className="w-5 h-5" />
                                                    Envoyer le lien
                                                </>
                                            )}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setMode("login")}
                                            className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            Retour à la connexion
                                        </button>
                                    </form>
                                )}
                            </FadeIn>
                        )}
                    </div>
                </FadeIn>
            </div>
        </div>
    );
}
