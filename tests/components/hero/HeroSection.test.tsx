import React from 'react';
import { render, screen } from '@testing-library/react';

import { HeroSection } from '@/components/hero/HeroSection';

describe('HeroSection', () => {
  it('renders hero headline and CTA buttons', () => {
    render(<HeroSection />);

    expect(
      screen.getByRole('heading', { name: /Arise, Shadow Monarch/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Watch AMVs/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Join the Team/i })).toBeInTheDocument();
  });
});
