import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it } from 'vitest';

let RecruitForm: typeof import('@/components/recruitment/RecruitForm')['RecruitForm'];

beforeAll(async () => {
  ({ RecruitForm } = await import('@/components/recruitment/RecruitForm'));
});

describe('RecruitForm', () => {
  it('surfaces validation errors when submitting empty form', async () => {
    render(<RecruitForm />);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /submit application/i }));

    expect(await screen.findByText(/Name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Alias is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Age is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Discord handle is required/i)).toBeInTheDocument();
  });

  it('includes a hidden honeypot input that is unfocusable', () => {
    const { container } = render(<RecruitForm />);
    const honeypotWrapper = container.querySelector('.form-honeypot') as HTMLElement | null;

    expect(honeypotWrapper).not.toBeNull();
    expect(honeypotWrapper).toHaveAttribute('aria-hidden', 'true');

    const honeypotInput = honeypotWrapper?.querySelector('input') as HTMLInputElement | null;

    expect(honeypotInput).not.toBeNull();
    expect(honeypotInput?.name).toMatch(/recruitment/);
    expect(honeypotInput?.tabIndex).toBe(-1);
  });

  it('submits successfully with valid data and resets the form', async () => {
    render(<RecruitForm />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/Jane Doe/i), 'Jane Doe');
    await user.type(screen.getByPlaceholderText(/AuroraBlade/i), 'AuroraBlade');
    await user.type(screen.getByPlaceholderText('18'), '21');
    await user.type(screen.getByPlaceholderText(/Paris, France/i), 'Paris, France');
    await user.type(screen.getByPlaceholderText(/fulguria#0001/i), 'fulguria#0001');
    await user.type(
      screen.getByPlaceholderText(/https:\/\/www\.youtube\.com\/@fulguria/i),
      'https://www.youtube.com/@fulguriateam'
    );
    await user.type(
      screen.getByPlaceholderText(/your-best-amv/i),
      'https://www.youtube.com/watch?v=best123'
    );
    await user.type(
      screen.getByPlaceholderText(/your-latest-amv/i),
      'https://youtu.be/latest456'
    );
    await user.type(
      screen.getByPlaceholderText(/Share your editing style/i),
      'I craft kinetic Solo Leveling AMVs with hard-hitting transitions and unique pacing.'
    );
    await user.type(
      screen.getByPlaceholderText(/Weeknights after 20:00 CET/i),
      'Weeknights after 20:00 CET'
    );

    await user.click(screen.getByRole('button', { name: /submit application/i }));

    expect(
      await screen.findByText(/Submission received\. Expect a reply within 48 hours\./i)
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Jane Doe/i)).toHaveValue('');
    });
  });
});
