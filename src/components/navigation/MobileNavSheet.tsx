'use client';

import { useEffect, useMemo, useRef } from 'react';

import { IconButton } from '@/components/ui/IconButton';
import { ScrollSection } from '@/hooks/useScrollSections';

export const MOBILE_NAV_SHEET_ID = 'mobile-primary-nav';

type MobileNavSheetProps = {
  sections: ScrollSection[];
  activeId: string | null;
  open: boolean;
  onClose: () => void;
  onNavigate: (..._args: [string]) => void;
};

const focusSelectors = [
  'a[href]',
  'button:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function MobileNavSheet({
  sections,
  activeId,
  open,
  onClose,
  onNavigate,
}: MobileNavSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousActive = document.activeElement as HTMLElement | null;
    const container = sheetRef.current;
    const focusable = container
      ? (Array.from(container.querySelectorAll<HTMLElement>(focusSelectors)) as HTMLElement[])
      : [];

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || focusable.length === 0) {
        return;
      }

      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      const current = document.activeElement as HTMLElement | null;

      if (event.shiftKey && current === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    focusable[0]?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      previousActive?.focus?.();
    };
  }, [onClose, open]);

  const items = useMemo(
    () =>
      sections.map((section) => {
        const isActive = activeId === section.id;

        return (
          <button
            key={section.id}
            type="button"
            onClick={() => onNavigate(section.id)}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-solo-panel px-4 py-3 text-sm uppercase tracking-[0.4em] text-solo-200 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solo-glow data-[active=true]:text-white"
            data-active={isActive}
            aria-current={isActive ? 'true' : undefined}
          >
            <span>{section.label}</span>
            <span className="size-2 rounded-full bg-solo-glow/40 data-[active=true]:bg-solo-glow" />
          </button>
        );
      }),
    [activeId, onNavigate, sections]
  );

  if (!open) {
    return null;
  }

  return (
    <div
      id={MOBILE_NAV_SHEET_ID}
      role="dialog"
      aria-modal="true"
      aria-label="Primary navigation"
      className="fixed inset-0 z-[60] bg-solo-void/70 backdrop-blur-md md:hidden"
    >
      <div aria-hidden="true" onClick={onClose} className="absolute inset-0 cursor-pointer" />
      <div
        ref={sheetRef}
        className="bg-solo-panel/95 relative mx-auto mt-28 flex w-[min(90%,20rem)] flex-col gap-5 rounded-3xl border border-white/10 p-6 shadow-portal"
      >
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.45em] text-solo-300">Navigate</p>
          <IconButton onClick={onClose} aria-label="Close navigation">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="size-5"
            >
              <path d="m7 7 10 10M7 17 17 7" />
            </svg>
          </IconButton>
        </div>
        <nav className="grid gap-3" aria-label="Mobile primary navigation">
          {items}
        </nav>
      </div>
    </div>
  );
}
