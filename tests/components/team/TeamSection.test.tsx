import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { mockTeamGroups, mockTeamRoster } from '../../mocks/team';

vi.mock('@/data/team', () => ({
  teamGroups: mockTeamGroups,
  teamRoster: mockTeamRoster,
}));

let TeamSection: typeof import('@/components/team/TeamSection')['TeamSection'];

beforeAll(async () => {
  ({ TeamSection } = await import('@/components/team/TeamSection'));
});

describe('TeamSection', () => {
  it('renders roster heading and the expected number of members', () => {
    render(<TeamSection />);

    expect(screen.getByRole('heading', { name: /Hunters of Fulguria/i })).toBeInTheDocument();

    const memberHeadings = screen.getAllByRole('heading', { level: 3 });
    expect(memberHeadings).toHaveLength(mockTeamRoster.length);
    expect(screen.getByText(/@auroralane/i)).toBeInTheDocument();
  });

  it('exposes social links with accessible labels', () => {
    render(<TeamSection />);

    expect(screen.getByRole('link', { name: /Join Shade on Discord/i })).toHaveAttribute(
      'href',
      'https://discord.gg/example'
    );
  });

  it('omits social links when a member has no platforms configured', () => {
    render(<TeamSection />);

    const card = screen.getByText(/@kitsumyles/i).closest('article');
    expect(card).toBeInTheDocument();
    expect(within(card as HTMLElement).queryAllByRole('link')).toHaveLength(0);
  });
});
