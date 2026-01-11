"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FadeIn } from "@/components/animations/FadeIn";
import { Lock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        if (!token) {
            setMessage({ type: "error", text: "Token de réinitialisation manquant" });
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (password !== confirmPassword) {
            setMessage({ type: "error", text: "Les mots de passe ne correspondent pas" });
            return;
        }

        if (password.length < 6) {
            setMessage({ type: "error", text: "Le mot de passe doit contenir au moins 6 caractères" });
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: "success", text: "Mot de passe réinitialisé avec succès !" });
                setTimeout(() => router.push("/login"), 2000);
            } else {
                setMessage({ type: "error", text: data.error || "Une erreur est survenue" });
            }
        } catch {
            setMessage({ type: "error", text: "Erreur de connexion au serveur" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="glass rounded-2xl p-6 md:p-8 border border-border">
            <div className="text-center mb-6">
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-primary/20 flex items-center justify-center">
                    <Lock className="w-7 h-7 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">Nouveau mot de passe</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Choisissez un nouveau mot de passe sécurisé
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                        Nouveau mot de passe
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            <Lock className="w-4 h-4" />
                        </div>
                        <input
                            type="password"
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground placeholder:text-muted-foreground text-sm"
                            placeholder="Minimum 6 caractères"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                        Confirmer le mot de passe
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            <Lock className="w-4 h-4" />
                        </div>
                        <input
                            type="password"
                            required
                            minLength={6}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground placeholder:text-muted-foreground text-sm"
                            placeholder="Confirmer le mot de passe"
                        />
                    </div>
                </div>

                {message && (
                    <div
                        className={`p-3 rounded-lg flex items-center gap-3 ${message.type === "success"
                            ? "bg-green-500/10 border border-green-500/30 text-green-400"
                            : "bg-red-500/10 border border-red-500/30 text-red-400"
                            }`}
                    >
                        {message.type === "success" ? (
                            <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        ) : (
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        )}
                        <span className="text-sm">{message.text}</span>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting || !token}
                    className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-primary to-primary-light text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform-gpu hover:scale-[1.02] active:scale-[0.98]"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Réinitialisation...
                        </>
                    ) : (
                        <>
                            <Lock className="w-5 h-5" />
                            Réinitialiser le mot de passe
                        </>
                    )}
                </button>

                <button
                    type="button"
                    onClick={() => router.push("/login")}
                    className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    Retour à la connexion
                </button>
            </form>
        </div>
    );
}

function LoadingFallback() {
    return (
        <div className="glass rounded-2xl p-6 md:p-8 border border-border min-h-[300px] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="py-12 pt-28 md:pt-32 min-h-screen flex items-center justify-center">
            {/* Background decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            </div>

            <div className="container-custom max-w-md relative z-10">
                <FadeIn>
                    <Suspense fallback={<LoadingFallback />}>
                        <ResetPasswordForm />
                    </Suspense>
                </FadeIn>
            </div>
        </div>
    );
}
