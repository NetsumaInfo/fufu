"use client";

import { useState } from "react";
import { Mail, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export function ForgotPasswordModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({
                    type: "success",
                    text: "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.",
                });
                setEmail("");
                setTimeout(() => setIsOpen(false), 3000);
            } else {
                setMessage({ type: "error", text: data.error || "Une erreur est survenue" });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Erreur de connexion au serveur" });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="text-sm text-primary hover:text-primary-light transition-colors"
            >
                Mot de passe oublié ?
            </button>
        );
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="glass rounded-2xl p-6 md:p-8 border border-border max-w-md w-full relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close button */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-4 right-4 p-1 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-primary/20 flex items-center justify-center">
                            <Mail className="w-7 h-7 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground">Mot de passe oublié</h2>
                        <p className="text-muted-foreground text-sm mt-1">
                            Entrez votre email et recevez un lien de réinitialisation
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">
                                Adresse email
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground placeholder:text-muted-foreground text-sm"
                                    placeholder="votre@email.com"
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

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="flex-1 py-2.5 px-6 rounded-lg border border-border text-foreground font-medium hover:bg-muted/50 transition-all"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 py-2.5 px-6 rounded-lg bg-gradient-to-r from-primary to-primary-light text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Envoi...
                                    </>
                                ) : (
                                    "Envoyer"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
