import { AnchorHTMLAttributes, type JSX } from 'react';

import type { TeamSocialPlatform } from '@/types/team';

type SocialLinkProps = {
  platform: TeamSocialPlatform;
  href: string;
  label?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;

const baseClasses =
  'inline-flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-solo-200 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solo-glow focus-visible:ring-offset-2 focus-visible:ring-offset-solo-void';

const platformLabels: Record<TeamSocialPlatform, string> = {
  twitter: 'Twitter profile',
  youtube: 'YouTube channel',
  discord: 'Discord invite',
  twitch: 'Twitch channel',
  website: 'Website',
};

const iconPaths: Record<TeamSocialPlatform, JSX.Element> = {
  twitter: (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="size-4">
      <path d="M20.75 7.36c.01.17.01.34.01.51 0 5.16-3.93 11.1-11.11 11.1-2.21 0-4.27-.64-6-1.75.31.04.62.06.94.06a7.86 7.86 0 0 0 4.87-1.68 3.89 3.89 0 0 1-3.62-2.69c.24.04.48.06.73.06.35 0 .7-.05 1.02-.14a3.88 3.88 0 0 1-3.12-3.8v-.05c.52.29 1.12.46 1.76.48a3.87 3.87 0 0 1-1.73-3.23c0-.71.19-1.37.53-1.94a11.06 11.06 0 0 0 8.03 4.07 3.87 3.87 0 0 1 6.6-3.52 7.73 7.73 0 0 0 2.46-.94 3.91 3.91 0 0 1-1.7 2.14 7.73 7.73 0 0 0 2.22-.6 8.3 8.3 0 0 1-1.95 2.03Z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
      <path d="M21.6 7.2a2.54 2.54 0 0 0-1.78-1.8C18.02 5 12 5 12 5s-6.02 0-7.82.4a2.54 2.54 0 0 0-1.78 1.8A26.35 26.35 0 0 0 2 12a26.35 26.35 0 0 0 .4 4.8 2.54 2.54 0 0 0 1.78 1.8C5.98 19 12 19 12 19s6.02 0 7.82-.4a2.54 2.54 0 0 0 1.78-1.8c.26-1.6.4-3.21.4-4.8s-.14-3.2-.4-4.8ZM10.25 14.63V9.37L14.92 12l-4.67 2.63Z" />
    </svg>
  ),
  discord: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
      <path d="M20.3 4.49A15.05 15.05 0 0 0 16.25 3a10.49 10.49 0 0 0-.51 1.05 14.63 14.63 0 0 0-3.48 0A10.62 10.62 0 0 0 11.75 3a15.1 15.1 0 0 0-4.06 1.49 16.11 16.11 0 0 0-2.69 11.52A15.62 15.62 0 0 0 9.5 18.5a11.03 11.03 0 0 0 .77-1.27 9.26 9.26 0 0 1-1.21-.57c.1-.07.2-.14.3-.22 2.35 1.1 4.9 1.1 7.23 0 .1.08.2.15.3.22-.4.22-.8.4-1.21.57.2.44.5.89.77 1.27a15.61 15.61 0 0 0 4.5-1.49 16.12 16.12 0 0 0-1.65-13.01ZM9.01 13.98c-.71 0-1.29-.67-1.29-1.5s.57-1.5 1.29-1.5 1.29.67 1.29 1.5-.57 1.5-1.29 1.5Zm5.98 0c-.71 0-1.29-.67-1.29-1.5s.58-1.5 1.29-1.5c.72 0 1.29.67 1.29 1.5s-.57 1.5-1.29 1.5Z" />
    </svg>
  ),
  twitch: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
      <path d="M4.5 3 3 6.75v12h4.5V21l2.25-2.25H12L18 12V3H4.5Zm12 8.25-2.25 2.25H11.25L9 15.75V13.5H6.75v-9h9v6.75ZM12 7.125h1.5v4.5H12v-4.5Zm-3 0H10.5v4.5H9v-4.5Z" />
    </svg>
  ),
  website: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
      <path d="M12 3a9 9 0 1 0 .001 18.001A9 9 0 0 0 12 3Zm6.33 8h-2.48a13.94 13.94 0 0 0-1.04-4.24A7.03 7.03 0 0 1 18.33 11ZM12 5a7 7 0 0 1 1.96 6H10.04A7 7 0 0 1 12 5ZM8.19 13a11.71 11.71 0 0 0 .3 2.52c.2.82.48 1.58.83 2.23A7.01 7.01 0 0 1 5.67 13h2.52Zm1.85 0h3.92a10.53 10.53 0 0 1-.41 2.84A12.18 12.18 0 0 1 12 19a12.18 12.18 0 0 1-1.54-3.16A10.53 10.53 0 0 1 10.04 13Zm4.97 4.75c.34-.65.62-1.41.83-2.23.15-.83.25-1.68.3-2.52h2.52a7.01 7.01 0 0 1-4.65 4.75ZM7.19 6.76A13.94 13.94 0 0 0 6.15 11H3.67a7.03 7.03 0 0 1 3.52-4.24Zm-.74 4.24a11.79 11.79 0 0 1 1.03-4.24A12.18 12.18 0 0 1 12 5c.59.98 1.11 2.19 1.51 3.52.28.95.45 1.94.51 2.95H6.45Z" />
    </svg>
  ),
};

export function SocialLink({ platform, href, label, className, ...rest }: SocialLinkProps) {
  const ariaLabel = label ?? platformLabels[platform];
  const composed = [baseClasses, className].filter(Boolean).join(' ');

  return (
    <a
      href={href}
      aria-label={ariaLabel}
      target="_blank"
      rel="noreferrer"
      className={composed}
      {...rest}
    >
      {iconPaths[platform]}
    </a>
  );
}
