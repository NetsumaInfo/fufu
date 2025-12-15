"use client";

import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { CheckCircle2 } from "lucide-react";
import { ApplicationFormData } from "@/lib/types";

export function RecruitmentForm() {
    const [formData, setFormData] = useState<ApplicationFormData>({
        pseudo: "",
        desiredRoles: [],
        portfolioLinks: "",
        motivation: "",
        availability: "",
        contact: "",
    });

    const [errors, setErrors] = useState<Partial<Record<keyof ApplicationFormData, string>>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const roleOptions = [
        { value: "", label: "Sélectionner un rôle" },
        { value: "amv-maker", label: "AMV Maker" },
        { value: "design-fx", label: "Design FX / Motion Designer" },
        { value: "color-grading", label: "Color Grading Specialist" },
        { value: "autre", label: "Autre" },
    ];

    const availabilityOptions = [
        { value: "", label: "Sélectionner votre disponibilité" },
        { value: "high", label: "Très disponible (plusieurs fois par semaine)" },
        { value: "medium", label: "Disponible régulièrement (1-2 fois par semaine)" },
        { value: "low", label: "Disponibilité limitée (quelques fois par mois)" },
    ];

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof ApplicationFormData, string>> = {};

        if (!formData.pseudo.trim()) {
            newErrors.pseudo = "Le pseudo est requis";
        }

        if (formData.desiredRoles.length === 0) {
            newErrors.desiredRoles = "Veuillez sélectionner au moins un rôle";
        }

        if (!formData.portfolioLinks.trim()) {
            newErrors.portfolioLinks = "Veuillez fournir au moins un lien vers votre portfolio";
        }

        if (!formData.motivation.trim() || formData.motivation.length < 50) {
            newErrors.motivation = "Veuillez expliquer votre motivation (minimum 50 caractères)";
        }

        if (!formData.availability) {
            newErrors.availability = "Veuillez indiquer votre disponibilité";
        }

        if (!formData.contact.trim()) {
            newErrors.contact = "Les informations de contact sont requises";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setIsSubmitting(true);

        // Simulate API call (front-end only)
        await new Promise(resolve => setTimeout(resolve, 1500));

        console.log("Application submitted:", formData);
        setIsSubmitted(true);
        setIsSubmitting(false);
    };

    const handleReset = () => {
        setFormData({
            pseudo: "",
            desiredRoles: [],
            portfolioLinks: "",
            motivation: "",
            availability: "",
            contact: "",
        });
        setErrors({});
        setIsSubmitted(false);
    };

    if (isSubmitted) {
        return (
            <div className="glass-strong rounded-2xl p-8 md:p-12 text-center">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                    Candidature envoyée !
                </h3>
                <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                    Merci pour ton intérêt pour Fulguria Team ! Nous examinerons ta candidature
                    et te contacterons dans les 1-2 semaines si ton profil nous intéresse.
                </p>
                <Button onClick={handleReset} variant="secondary">
                    Soumettre une autre candidature
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="glass-strong rounded-2xl p-6 md:p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                {/* Pseudo */}
                <Input
                    label="Pseudo / Nom d'artiste"
                    type="text"
                    placeholder="Ton pseudo"
                    value={formData.pseudo}
                    onChange={(e) => setFormData({ ...formData, pseudo: e.target.value })}
                    error={errors.pseudo}
                    required
                />

                {/* Contact */}
                <Input
                    label="Contact (Discord ou Email)"
                    type="text"
                    placeholder="username#0000 ou email@example.com"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    error={errors.contact}
                    required
                />
            </div>

            {/* Desired Role */}
            <Select
                label="Rôle souhaité"
                options={roleOptions}
                value={formData.desiredRoles[0] || ""}
                onChange={(e) => setFormData({ ...formData, desiredRoles: [e.target.value] })}
                error={errors.desiredRoles}
                required
            />

            {/* Portfolio Links */}
            <Textarea
                label="Liens Portfolio / YouTube"
                placeholder="Colle ici les liens vers ton portfolio, ta chaîne YouTube ou tes meilleurs projets..."
                value={formData.portfolioLinks}
                onChange={(e) => setFormData({ ...formData, portfolioLinks: e.target.value })}
                error={errors.portfolioLinks}
                required
                rows={3}
            />

            {/* Motivation */}
            <Textarea
                label="Pourquoi veux-tu rejoindre Fulguria Team ?"
                placeholder="Parle-nous de ta passion, de tes objectifs, de ce que tu pourrais apporter à l'équipe..."
                value={formData.motivation}
                onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                error={errors.motivation}
                required
                rows={6}
            />

            {/* Availability */}
            <Select
                label="Disponibilité"
                options={availabilityOptions}
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                error={errors.availability}
                required
            />

            {/* Submit */}
            <div className="pt-4">
                <Button type="submit" variant="primary" className="w-full" isLoading={isSubmitting}>
                    Envoyer ma candidature
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-4">
                    En soumettant ce formulaire, tu acceptes que nous examinions ta candidature.
                    Tes données ne seront pas partagées avec des tiers.
                </p>
            </div>
        </form>
    );
}
