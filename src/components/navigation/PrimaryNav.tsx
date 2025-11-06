'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { IconButton } from '@/components/ui/IconButton';
import { ScrollSection, useScrollSections } from '@/hooks/useScrollSections';

import { MobileNavSheet, MOBILE_NAV_SHEET_ID } from './MobileNavSheet';

export const NAV_SECTIONS: ScrollSection[] = [
  { id: 'hero', label: 'Awakening' },
  { id: 'gallery', label: 'AMV Gallery' },
  { id: 'team', label: 'Team Roster' },
  { id: 'recruit', label: 'Recruit' },
];

export type PrimaryNavProps = {
  sections?: ScrollSection[];
};

export function PrimaryNav({ sections = NAV_SECTIONS }: PrimaryNavProps) {
  const { activeId, scrollToSection, progress } = useScrollSections(sections);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    const closeOnResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(false);
      }
    };

    window.addEventListener('resize', closeOnResize);
    return () => window.removeEventListener('resize', closeOnResize);
  }, [open]);

  const handleNavigate = useCallback(
    (id: string) => {
      scrollToSection(id);
      setOpen(false);
    },
    [scrollToSection]
  );

  const desktopLinks = useMemo(
    () =>
      sections.map((section) => (
        <Link
          key={section.id}
          href={`#${section.id}`}
          prefetch={false}
          scroll={false}
          className="group relative overflow-hidden rounded-full px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.5em] text-solo-200 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solo-glow focus-visible:ring-offset-2 focus-visible:ring-offset-solo-void data-[active=true]:text-white"
          data-active={activeId === section.id}
          aria-current={activeId === section.id ? 'true' : undefined}
          onClick={(event) => {
            event.preventDefault();
            handleNavigate(section.id);
          }}
        >
          <span className="absolute inset-0 -z-10 opacity-0 transition group-hover:opacity-100 data-[active=true]:opacity-100">
            <span className="absolute inset-0 bg-solo-panel opacity-70" />
            <span className="absolute inset-0 bg-solo-mesh opacity-30" />
          </span>
          <span className="relative drop-shadow-glow">{section.label}</span>
        </Link>
      )),
    [activeId, handleNavigate, sections]
  );

  const progressWidth = `${Math.round(progress * 100)}%`;

  return (
    <header className="w-full">
      <div className="nav-surface relative">
        <div className="mx-auto flex h-[var(--nav-height)] max-w-6xl items-center justify-between px-6 md:px-10">
          <Link
            href="#hero"
            prefetch={false}
            scroll={false}
            className="flex items-center gap-2 rounded-full px-4 py-1 text-xs uppercase tracking-[0.6em] text-solo-200 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solo-glow focus-visible:ring-offset-2 focus-visible:ring-offset-solo-void"
            onClick={(event) => {
              event.preventDefault();
              handleNavigate('hero');
            }}
          >
            <span className="text-gradient drop-shadow-glow">Fulguria</span>
            <span className="hidden text-solo-300 sm:inline">Squad</span>
          </Link>

          <nav className="hidden items-center gap-3 md:flex" aria-label="Primary">
            {desktopLinks}
          </nav>

          <div className="flex items-center gap-3 md:hidden">
            <IconButton
              aria-label="Open navigation"
              aria-expanded={open}
              aria-controls={MOBILE_NAV_SHEET_ID}
              onClick={() => setOpen(true)}
              size="lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path
                  fillRule="evenodd"
                  d="M4 7.25A.75.75 0 0 1 4.75 6.5h14.5a.75.75 0 0 1 0 1.5H4.75A.75.75 0 0 1 4 7.25Zm0 4.75a.75.75 0 0 1 .75-.75h14.5a.75.75 0 1 1 0 1.5H4.75A.75.75 0 0 1 4 12Zm0 4.75a.75.75 0 0 1 .75-.75h14.5a.75.75 0 1 1 0 1.5H4.75a.75.75 0 0 1-.75-.75Z"
                  clipRule="evenodd"
                />
              </svg>
            </IconButton>
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-x-6 bottom-2 h-[3px] overflow-hidden rounded-full bg-white/10 md:inset-x-10"
          aria-hidden="true"
        >
          <span
            className="block h-full rounded-full bg-solo-glow/80 transition-[width] duration-300 ease-out"
            style={{ width: progressWidth }}
          />
        </div>
      </div>

      <MobileNavSheet
        sections={sections}
        activeId={activeId ?? sections[0]?.id ?? null}
        open={open}
        onClose={() => setOpen(false)}
        onNavigate={handleNavigate}
      />
    </header>
  );
}
