import type { Metadata } from 'next';
import { Inter, Orbitron } from 'next/font/google';
import { ReactNode } from 'react';

import { SentryProvider } from '@/components/sentry/SentryProvider';
import '@/styles/globals.css';
import { siteMetadata } from '@/lib/seo';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-accent',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = siteMetadata;

type PublicLayoutProps = {
  children: ReactNode;
};

export default function PublicLayout({ children }: PublicLayoutProps) {
  const fontVariables = `${inter.variable} ${orbitron.variable}`;

  return (
    <html lang="en" className={fontVariables}>
      <body className="bg-solo-void font-sans text-solo-100 antialiased">
        <div className="relative flex min-h-screen flex-col bg-solo-haze">
          <SentryProvider>
            <div className="flex-1">{children}</div>
          </SentryProvider>
        </div>
      </body>
    </html>
  );
}
