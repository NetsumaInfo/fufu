"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TransitionLayout } from "@/components/layout/TransitionLayout";
import { AuthProvider } from "@/lib/context/AuthContext";
import { TranslationProvider } from "@/lib/context/TranslationContext";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr" className={inter.variable}>
            <body className="antialiased">
                <AuthProvider>
                    <TranslationProvider>
                        <Navbar />
                        <TransitionLayout>
                            <main className="min-h-screen">
                                {children}
                            </main>
                        </TransitionLayout>
                        <Footer />
                    </TranslationProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
