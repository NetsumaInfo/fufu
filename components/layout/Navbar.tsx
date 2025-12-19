"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { MobileNav } from "./MobileNav";

const navLinks = [
    { href: "/", label: "Accueil" },
    { href: "/team", label: "Team" },
    { href: "/videos", label: "Vidéos" },
    { href: "/recruitment", label: "Recrutement" },
    { href: "/contact", label: "Contact" },
];

export function Navbar() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <nav
                className={cn(
                    "fixed top-0 left-0 right-0 z-[60] transition-all duration-300 border-b",
                    isScrolled
                        ? "glass-strong shadow-xl py-3 md:py-4 border-primary/20"
                        : "bg-background/80 backdrop-blur-sm py-4 md:py-5 border-transparent"
                )}
            >
                <div className="container-custom">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link
                            href="/"
                            className="flex items-center gap-3 group"
                        >
                            <div className="relative w-8 h-8 sm:w-10 sm:h-10 transition-transform group-hover:scale-110">
                                <Image
                                    src="/images/team/Logo/Logo_Fulguria_White.png"
                                    alt="Fulguria Team Logo"
                                    width={40}
                                    height={40}
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-primary-light to-primary bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
                                Fulguria Team
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "px-4 py-2 rounded-lg font-medium transition-all",
                                        pathname === link.href
                                            ? "text-primary bg-primary/10"
                                            : "text-foreground hover:text-primary hover:bg-primary/5"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Mobile Menu Button - Animated bars morphing to X */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-primary/10 transition-colors mr-1 relative z-[60] flex flex-col items-center justify-center w-10 h-10 gap-0"
                            aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                        >
                            {/* 3 bars that morph into X */}
                            <span
                                className={cn(
                                    "block w-6 h-[2.5px] rounded-full transition-all duration-300 ease-in-out mb-[3px]",
                                    isMobileMenuOpen
                                        ? "bg-primary rotate-45 translate-y-[5.25px] mb-0"
                                        : "bg-foreground"
                                )}
                            />
                            <span
                                className={cn(
                                    "block w-6 h-[2.5px] rounded-full transition-all duration-300 ease-in-out my-[3px]",
                                    isMobileMenuOpen
                                        ? "opacity-0 scale-0"
                                        : "bg-foreground opacity-100"
                                )}
                            />
                            <span
                                className={cn(
                                    "block w-6 h-[2.5px] rounded-full transition-all duration-300 ease-in-out mt-[3px]",
                                    isMobileMenuOpen
                                        ? "bg-primary -rotate-45 -translate-y-[5.25px] mt-0"
                                        : "bg-foreground"
                                )}
                            />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation */}
            <MobileNav
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                links={navLinks}
                currentPath={pathname}
            />
        </>
    );
}
