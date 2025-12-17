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
                    "fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b",
                    isScrolled
                        ? "glass-strong shadow-xl py-4 border-primary/20"
                        : "bg-background/80 backdrop-blur-sm py-5 border-transparent"
                )}
            >
                <div className="container-custom">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link
                            href="/"
                            className="flex items-center gap-3 group"
                        >
                            <div className="relative w-12 h-12 transition-transform group-hover:scale-110">
                                <Image
                                    src="/images/team/Logo/Logo_Fulguria_White.png"
                                    alt="Fulguria Team Logo"
                                    width={48}
                                    height={48}
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-primary-light to-primary bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
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

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="md:hidden p-2 rounded-lg hover:bg-primary/10 transition-colors"
                            aria-label="Ouvrir le menu"
                        >
                            <Menu className="w-6 h-6" />
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
