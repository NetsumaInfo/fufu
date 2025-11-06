import type { Metadata } from 'next';

const title = 'Fulguria Team | Solo Leveling AMV Showcase';
const description =
  'Enter the Solo Leveling-inspired world of the Fulguria collective, explore our AMV gallery, and discover how to join the next awakening.';

export const siteMetadata: Metadata = {
  title: {
    default: title,
    template: '%s | Fulguria Team',
  },
  description,
  keywords: ['Fulguria', 'Solo Leveling', 'AMV', 'Anime Music Video', 'Animation', 'Recruitment'],
  authors: [{ name: 'Fulguria Team' }],
  creator: 'Fulguria Team',
  openGraph: {
    title,
    description,
    type: 'website',
    siteName: 'Fulguria Team',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
};

export const seo = {
  title,
  description,
};
