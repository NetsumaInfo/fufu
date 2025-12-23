import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TransitionLayout } from "@/components/layout/TransitionLayout";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Fulguria Team - Collectif AMV & Création Visuelle",
    description: "Collectif de créateurs passionnés spécialisés dans la création d'AMV et de contenus visuels de qualité. Découvrez notre équipe et nos dernières créations.",
    keywords: ["AMV", "Anime Music Video", "Editing", "Motion Design", "Fulguria", "Team"],
    authors: [{ name: "Fulguria Team" }],
    openGraph: {
        title: "Fulguria Team - Collectif AMV & Création Visuelle",
        description: "Collectif de créateurs passionnés spécialisés dans la création d'AMV et de contenus visuels de qualité.",
        type: "website",
        locale: "fr_FR",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr" className={inter.variable}>
            <body className="antialiased">
                <Navbar />
                <TransitionLayout>
                    <main className="min-h-screen">
                        {children}
                    </main>
                </TransitionLayout>
                <Footer />
            </body>
        </html>
    );
}
