'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

export type ScrollSection = {
  id: string;
  label: string;
};

export type UseScrollSectionsOptions = {
  offset?: number;
};

type SectionEntry = {
  id: string;
  ratio: number;
  top: number;
  isIntersecting: boolean;
};

export function useScrollSections(
  sections: ScrollSection[],
  options: UseScrollSectionsOptions = {}
) {
  const [activeId, setActiveId] = useState<string | null>(sections[0]?.id ?? null);
  const [progress, setProgress] = useState(0);

  const ids = useMemo(() => sections.map((section) => section.id), [sections]);
  const offset = options.offset ?? 160;

  useEffect(() => {
    if (!sections.length) {
      setActiveId(null);
      return;
    }

    setActiveId((previous) => {
      if (previous && sections.some((section) => section.id === previous)) {
        return previous;
      }

      return sections[0]?.id ?? null;
    });
  }, [sections]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!elements.length) {
      return;
    }

    const normalizeEntries = (entries: IntersectionObserverEntry[]): SectionEntry[] =>
      entries.map((entry) => ({
        id: entry.target.id,
        ratio: entry.intersectionRatio,
        top: entry.boundingClientRect.top,
        isIntersecting: entry.isIntersecting,
      }));

    const observer = new IntersectionObserver(
      (entries) => {
        const data = normalizeEntries(entries);
        const intersecting = data
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.ratio - a.ratio);

        if (intersecting[0]) {
          setActiveId(intersecting[0].id);
          return;
        }

        const viewportHeight = window.innerHeight;
        const nearestAbove = data
          .filter((entry) => entry.top < viewportHeight * 0.6)
          .sort((a, b) => b.top - a.top);

        if (nearestAbove[0]) {
          setActiveId(nearestAbove[0].id);
        }
      },
      {
        rootMargin: `-${offset}px 0px -40% 0px`,
        threshold: [0.2, 0.4, 0.6, 0.8],
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [ids, offset]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = docHeight <= 0 ? 0 : scrollTop / docHeight;
      setProgress(Math.min(1, Math.max(0, Number.isFinite(ratio) ? ratio : 0)));
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });

    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  const scrollToSection = useCallback((id: string) => {
    if (typeof window === 'undefined') {
      return;
    }

    const element = document.getElementById(id);

    if (!element) {
      return;
    }

    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    element.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });

    if (history.replaceState) {
      history.replaceState(null, '', `#${id}`);
    }
  }, []);

  return {
    activeId,
    scrollToSection,
    progress,
  };
}
