import React from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { IconButton } from '@/components/ui/IconButton';

import { HeroMotionLayer } from './HeroMotionLayer';

const INSIGHTS = [
  {
    label: 'Portal Status',
    value: '87% Charged',
    detail: 'Particle field syncing to hero timeline',
  },
  {
    label: 'Squad Online',
    value: '12 Hunters',
    detail: 'Core roster locked for animation sprints',
  },
  {
    label: 'Next Drop',
    value: 'AMV Cache - 01h',
    detail: 'KV refresh triggers hourly per specs/ARCHI',
  },
] as const;

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden py-28 scroll-snap-section sm:py-36 lg:py-40"
    >
      <HeroMotionLayer />
      <Container className="relative grid gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-center">
        <div className="flex flex-col gap-6 lg:gap-8">
          <p className="text-xs uppercase tracking-[0.55em] text-solo-300">
            Episode 04 - Hero Experience Build
          </p>
          <h1 className="text-balance font-accent text-4xl uppercase tracking-[0.24em] text-white drop-shadow-glow sm:text-5xl lg:text-6xl">
            Arise, Shadow Monarch
          </h1>
          <p className="max-w-xl text-balance text-base text-solo-200 lg:text-lg">
            The Fulguria collective is choreographing Solo Leveling&apos;s awakening with
            motion-first storytelling. Scroll to witness AMV portals, roster reveals, and
            recruitment sequences wired through the shared infrastructure prepared in prior tasks.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Button as="a" href="#gallery" size="lg">
              Watch AMVs
            </Button>
            <Button as="a" href="#recruit" size="lg" variant="secondary">
              Join the Team
            </Button>
            <IconButton
              as="a"
              href="#team"
              aria-label="Jump to team roster"
              variant="ghost"
              size="lg"
              className="border border-white/20 hover:border-solo-glow/60"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="size-5"
              >
                <path d="M12 5v14m7-7H5" />
              </svg>
            </IconButton>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
            {INSIGHTS.map((insight) => (
              <div
                key={insight.label}
                className="bg-solo-panel/60 rounded-3xl border border-white/5 p-5 backdrop-blur"
              >
                <p className="text-[0.65rem] uppercase tracking-[0.5em] text-solo-400">
                  {insight.label}
                </p>
                <p className="mt-3 text-sm font-semibold uppercase tracking-[0.35em] text-white">
                  {insight.value}
                </p>
                <p className="mt-2 text-xs text-solo-300">{insight.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-solo-panel/80 relative hidden min-h-[360px] items-center justify-center overflow-hidden rounded-[2.75rem] border border-white/10 p-10 shadow-portal lg:flex">
          <div className="mesh-overlay absolute inset-0 opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/0" />
          <div className="relative flex flex-col items-center gap-6 text-center">
            <span className="rounded-full border border-white/20 px-4 py-1 text-[0.65rem] uppercase tracking-[0.5em] text-solo-200">
              Motion Layer Preview
            </span>
            <p className="max-w-md text-sm text-solo-200">
              Particle choreography is rendered client-side via Motion.dev. Parallax, cursor drift,
              and ambient pulses are gated behind reduced-motion preferences to keep the experience
              comfortable while staying cinematic.
            </p>
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.45em] text-solo-300">
              <span className="relative flex size-3 items-center justify-center">
                <span className="absolute inset-0 rounded-full bg-solo-glow/40 blur-sm" />
                <span className="relative size-1.5 rounded-full bg-solo-glow" />
              </span>
              Particles Online
            </div>
            <Link
              href="https://motion.dev/docs/react"
              target="_blank"
              rel="noreferrer"
              className="text-xs uppercase tracking-[0.45em] text-solo-200 underline-offset-4 transition hover:text-white"
            >
              Motion.dev Documentation
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
