'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/context/TranslationContext';

type Language = {
    code: string;
    flag: string;
    name: string;
    shortName: string;
};

const languages: Language[] = [
    { code: 'fr', flag: 'fr', name: 'Français', shortName: 'FR' },
    { code: 'en', flag: 'us', name: 'English', shortName: 'EN' },
    { code: 'ja', flag: 'jp', name: '日本語', shortName: 'JP' },
    { code: 'zh', flag: 'cn', name: '中文', shortName: 'CN' },
    { code: 'ru', flag: 'ru', name: 'Русский', shortName: 'RU' },
    { code: 'es', flag: 'es', name: 'Español', shortName: 'ES' },
];

export default function LanguageSelector() {
    const [isOpen, setIsOpen] = useState(false);
    const { locale: currentLocale, setLocale: setCurrentLocale } = useTranslation();
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleLanguageChange = (languageCode: string) => {
        setCurrentLocale(languageCode);
        setIsOpen(false);
    };

    const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0];

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Language button with globe icon */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all duration-200",
                    "hover:bg-white/10 active:scale-95",
                    isOpen && "bg-white/10"
                )}
                aria-label="Select language"
                title={currentLanguage.name}
            >
                {/* Globe icon */}
                <Globe className="w-4 h-4 text-muted-foreground" />

                {/* Chevron */}
                <ChevronDown
                    className={cn(
                        "w-3.5 h-3.5 text-muted-foreground transition-transform duration-200",
                        isOpen && "rotate-180"
                    )}
                />
            </button>

            {/* Dropdown with flags */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl overflow-hidden z-[100] shadow-2xl">
                    {/* Glassmorphism background */}
                    <div className="bg-[#0d1117]/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
                        {/* Language options */}
                        <div className="p-1.5 max-h-[280px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                            {languages.map((language) => (
                                <button
                                    key={language.code}
                                    onClick={() => handleLanguageChange(language.code)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-2.5 py-2 rounded-lg transition-all duration-150 group",
                                        currentLocale === language.code
                                            ? "bg-primary/15"
                                            : "hover:bg-white/5"
                                    )}
                                >
                                    {/* Flag with nice styling */}
                                    <div className={cn(
                                        "w-7 h-5 relative overflow-hidden rounded shadow-md transition-transform duration-150",
                                        "ring-1 ring-inset ring-white/10",
                                        "group-hover:scale-110 group-hover:shadow-lg",
                                        currentLocale === language.code && "ring-primary/50"
                                    )}>
                                        <img
                                            src={`https://flagcdn.com/w80/${language.flag}.png`}
                                            srcSet={`https://flagcdn.com/w80/${language.flag}.png 1x, https://flagcdn.com/w160/${language.flag}.png 2x`}
                                            alt={language.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Language name */}
                                    <span className={cn(
                                        "flex-1 text-left text-sm transition-colors duration-150",
                                        currentLocale === language.code
                                            ? "text-primary font-medium"
                                            : "text-foreground/80 group-hover:text-foreground"
                                    )}>
                                        {language.name}
                                    </span>

                                    {/* Check icon for selected */}
                                    {currentLocale === language.code && (
                                        <Check className="w-4 h-4 text-primary" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
