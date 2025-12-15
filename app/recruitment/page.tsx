import { SectionHeader } from "@/components/ui/SectionHeader";
import { RecruitmentForm } from "@/components/recruitment/RecruitmentForm";
import { FAQSection } from "@/components/recruitment/FAQSection";
import { FadeIn } from "@/components/animations/FadeIn";
import { SlideIn } from "@/components/animations/SlideIn";
import { CheckCircle2 } from "lucide-react";
import { recruitmentData } from "@/lib/data/recruitment";

export default function RecruitmentPage() {
    return (
        <div className="py-12">
            <div className="container-custom max-w-5xl">
                <FadeIn>
                    <SectionHeader
                        title="Rejoins Fulguria Team"
                        description="Tu es passionné par l'éditing, le motion design ou les effets visuels ? Nous sommes à la recherche de créateurs talentueux et motivés pour rejoindre notre collectif."
                        centered
                    />
                </FadeIn>

                {/* Pitch Section */}
                <SlideIn direction="up" className="mt-12">
                    <div className="glass rounded-2xl p-8 md:p-10 mb-12">
                        <h2 className="text-2xl font-bold text-foreground mb-6">
                            Pourquoi nous rejoindre ?
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-primary" />
                                    Ce que nous offrons
                                </h3>
                                <ul className="space-y-2 text-muted-foreground">
                                    {recruitmentData.whatWeOffer.map((item, index) => (
                                        <li key={index} className="flex gap-2">
                                            <span className="text-primary">•</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-primary" />
                                    Ce que nous recherchons
                                </h3>
                                <ul className="space-y-2 text-muted-foreground">
                                    {recruitmentData.requirements.map((item, index) => (
                                        <li key={index} className="flex gap-2">
                                            <span className="text-primary">•</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </SlideIn>

                {/* Roles Needed */}
                <SlideIn direction="up" className="mb-12">
                    <div className="glass rounded-2xl p-8 md:p-10">
                        <h2 className="text-2xl font-bold text-foreground mb-4">
                            Postes ouverts
                        </h2>
                        <p className="text-muted-foreground mb-6">
                            Nous recherchons actuellement des talents dans les domaines suivants :
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {recruitmentData.rolesNeeded.map((role, index) => (
                                <div
                                    key={index}
                                    className="px-4 py-2 bg-primary/20 text-primary rounded-lg border border-primary/30 font-medium"
                                >
                                    {role}
                                </div>
                            ))}
                        </div>
                    </div>
                </SlideIn>

                {/* Application Form */}
                <SlideIn direction="up" className="mb-12">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                            Candidature
                        </h2>
                        <RecruitmentForm />
                    </div>
                </SlideIn>

                {/* FAQ */}
                <SlideIn direction="up">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                            Questions fréquentes
                        </h2>
                        <FAQSection faqs={recruitmentData.faq} />
                    </div>
                </SlideIn>
            </div>
        </div>
    );
}
