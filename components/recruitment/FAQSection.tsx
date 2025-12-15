"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { FAQ } from "@/lib/types";

interface FAQSectionProps {
    faqs: FAQ[];
}

export function FAQSection({ faqs }: FAQSectionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="space-y-4">
            {faqs.map((faq, index) => (
                <div
                    key={index}
                    className="glass rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-colors"
                >
                    <button
                        onClick={() => toggleFAQ(index)}
                        className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        aria-expanded={openIndex === index}
                    >
                        <span className="font-semibold text-foreground">{faq.question}</span>
                        <ChevronDown
                            className={cn(
                                "w-5 h-5 text-muted-foreground transition-transform flex-shrink-0",
                                openIndex === index && "rotate-180"
                            )}
                        />
                    </button>

                    <AnimatePresence initial={false}>
                        {openIndex === index && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <div className="px-6 py-4 border-t border-border bg-muted/20">
                                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    );
}
