"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Messages = Record<string, any>;

interface TranslationContextType {
    locale: string;
    setLocale: (locale: string) => void;
    t: (key: string) => string;
    messages: Messages | null;
    isLoading: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState('fr');
    const [messages, setMessages] = useState<Messages | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Load initial locale from storage
        const storedLocale = localStorage.getItem('locale') || 'fr';
        setLocaleState(storedLocale);
    }, []);

    useEffect(() => {
        async function loadMessages() {
            setIsLoading(true);
            try {
                // Dynamically import the message file based on locale
                const messageModule = await import(`@/messages/${locale}.json`);
                setMessages(messageModule.default);
            } catch (error) {
                console.error(`Failed to load messages for locale: ${locale}`, error);
                // Fallback to French if loading fails
                if (locale !== 'fr') {
                    const fallbackModule = await import(`@/messages/fr.json`);
                    setMessages(fallbackModule.default);
                }
            } finally {
                setIsLoading(false);
            }
        }

        loadMessages();
    }, [locale]);

    const setLocale = (newLocale: string) => {
        setLocaleState(newLocale);
        localStorage.setItem('locale', newLocale);
    };

    // Helper to get nested value from object using dot notation "section.key"
    const t = (key: string): string => {
        if (!messages) return key;

        const keys = key.split('.');
        let value: any = messages;

        for (const k of keys) {
            value = value?.[k];
            if (value === undefined) return key;
        }

        return typeof value === 'string' ? value : key;
    };

    return (
        <TranslationContext.Provider value={{ locale, setLocale, t, messages, isLoading }}>
            {children}
        </TranslationContext.Provider>
    );
}

export function useTranslation() {
    const context = useContext(TranslationContext);
    if (context === undefined) {
        throw new Error('useTranslation must be used within a TranslationProvider');
    }
    return context;
}
