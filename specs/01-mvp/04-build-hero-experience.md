# Task 04: Build Hero Experience and Sticky Navigation Interactions

## Context
Delivers the visually immersive landing experience promised in `specs/PRD.md` (Immersive Solo Leveling Landing Experience) using the motion-first approach outlined in `specs/ARCHI.md` (Frontend Architecture → Core Stack & State Management).

## Scope
Create the hero section with animated copy, particle layers, call-to-action buttons, and scroll-linked navigation behaviors. Implement responsive layouts and motion sequences, leveraging Motion.dev within client wrappers.

## Implementation Details

### Files to Create/Modify
- `app/(public)/page.tsx` – Import and render `HeroSection` and `StickyNav` placeholders with server component wrappers.
- `src/components/hero/HeroSection.tsx` – Server component composing hero content; delegates interactive layers to client subcomponents.
- `src/components/hero/HeroMotionLayer.tsx` (client) – Motion.dev animations for particle fields, parallax, entrance transitions.
- `src/components/navigation/PrimaryNav.tsx` – Complete nav interactions (active link states, scroll progress indicator).
- `src/components/navigation/MobileNavSheet.tsx` – Client component for mobile navigation overlay.
- `src/hooks/useScrollSections.ts` – Hook observing intersection of sections to highlight active nav items (use `IntersectionObserver`).
- `src/components/ui/Button.tsx`, `src/components/ui/IconButton.tsx` – Shared UI primitives styled via Tailwind classes defined in Task 02.
- `src/styles/globals.css` – Add classes/animations for particle backgrounds if needed.
- `tests/components/hero/HeroSection.test.tsx` – Snapshot or accessibility check ensuring markup structure present.

### Key Functionality
- Hero displays headline, subtext, CTA buttons (`Watch AMVs`, `Join the Team`) with Solo Leveling typography.
- Motion layer provides subtle particle animation and parallax responsive to cursor/scroll (guarded for reduced motion preference).
- Sticky navigation highlights active section based on scroll position and allows smooth scrolling on click.
- Mobile navigation transitions between open/closed states with accessible focus trapping.
- Section supports anchor linking for other tasks (gallery/team/recruit).

### Technologies Used
- Motion.dev for animation primitives (spring, timeline) inside client components.
- TailwindCSS for layout, gradients, typography utilities.
- React hooks (`useEffect`, `useMemo`) for scroll tracking and prefers-reduced-motion detection.

### Architectural Patterns
Keep hero wrapper as server component; inject animated client subcomponents where necessary (`"use client"`). Use `useScrollSections` to manage active nav state and share via context/provider (if required) to navigation components.

## Success Criteria
- [ ] Hero renders with responsive layout (desktop: two-column, mobile: stacked) and passes Lighthouse accessibility checks.
- [ ] Motion animations respect `prefers-reduced-motion` and degrade gracefully.
- [ ] Sticky nav updates active link as user scrolls through sections.
- [ ] CTA buttons scroll to gallery/recruitment sections when clicked.
- [ ] Unit test verifies hero renders expected heading and CTA labels.

## Testing & Validation

### Manual Testing Steps
1. Run `npm run dev`, open page, and interact with hero on desktop and mobile widths.
2. Toggle Chrome devtools “prefers reduced motion” to validate animation fallback.
3. Scroll the page to ensure nav highlights update without jitter.
4. Use keyboard navigation to activate nav links and CTA buttons, confirming focus states.

### Edge Cases to Verify
- Safari scroll behavior (smooth scroll fallback).
- IntersectionObserver polyfill not required for supported browsers (consider dynamic import if needed).
- Mobile nav drawer closes when selecting a section or pressing `Esc`.

## Dependencies

**Must be completed before this task**:
- Task 01: Bootstrap Next.js 15 Project and Tooling.
- Task 02: Establish Global Layout and Solo Leveling Theming.
- Task 03: Setup Shared Infrastructure Modules and Observability Scaffolding (for hooks/util patterns).

**Blocks these tasks**:
- Task 07: Build AMV gallery (shares scroll/nav context).
- Task 08: Build recruitment UI.
- Task 11: Finalize observability and QA.

## Related Documentation
- **PRD Section**: “Immersive Solo Leveling Landing Experience.”
- **ARCHI Section**: “Frontend Architecture → State Management” and “Core Stack.”

## Notes
- Consider layering hero background assets from `public/assets` once available.
- Provide TODOs for integrating future contest teaser (post-MVP) without blocking current layout.

---

**Estimated Time**: 2-3 hours  
**Phase**: Core Features
