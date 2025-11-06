# Task 02: Establish Global Layout and Solo Leveling Theming

## Context
Creates the atmospheric foundation for the landing page specified in `specs/PRD.md` (“Immersive Solo Leveling Landing Experience”) by implementing the root layout, navigation shell, and design tokens defined in `specs/ARCHI.md` (Frontend Architecture & Folder Structure).

## Scope
Build the base `RootLayout`, global styles, and navigation scaffolding that future sections (hero, gallery, roster, recruitment) will plug into. Configure fonts, color palette, gradients, and scrolling behavior aligned with the Solo Leveling aesthetic.

## Implementation Details

### Files to Create/Modify
- `app/(public)/layout.tsx` – Server component with `<html>` and `<body>` using imported fonts, metadata defaults, Sentry instrumentation hooks, and top-level nav wrapper.
- `app/(public)/page.tsx` – Compose placeholder section components (`<HeroShell />`, `<GalleryShell />`, etc.) to verify anchor structure; sections will be replaced in later tasks.
- `src/styles/globals.css` – Tailwind base layer plus custom utilities for gradients, glassmorphism, scroll snap, and typography resets.
- `tailwind.config.ts` – Extend theme with Solo Leveling palette, typography scale, animation keyframes for particles, and custom shadows.
- `src/components/ui/Container.tsx`, `src/components/ui/SectionHeading.tsx` – Reusable primitives for layout consistency.
- `src/components/navigation/PrimaryNav.tsx` (client component) – Sticky nav bar with anchor links, active state placeholder, and mobile menu toggle skeleton.
- `public/fonts/*` or `next/font` usage – Register primary and accent fonts (e.g., `Inter`, `Orbitron`) via `@next/font`.
- `src/lib/seo.ts` – Optional helper with metadata constants (`title`, `description`, `openGraph` defaults).

### Key Functionality
- Global layout renders sticky navigation with anchor links for hero, gallery, roster, recruitment sections.
- Tailwind theme encapsulates color tokens, gradient backgrounds, and motion-friendly utilities for later components.
- Base page structure defines semantic landmarks (`<main>`, `<section id="hero">`, etc.) to support scroll tracking hooks.
- Metadata exports (title, description, Open Graph) align with PRD branding.
- Mobile navigation drawer placeholder ready for Task 04 enhancements.

### Technologies Used
- Next.js App Router server/layout components.
- TailwindCSS theme extensions and global CSS.
- Motion.dev ready client wrappers (no animations yet).
- `next/font` for self-hosted font loading with fallbacks.

### Architectural Patterns
Maintain server components wherever possible; isolate interactive nav into a client component. Use `app/(public)/layout.tsx` for shared providers (Sentry, analytics) and avoid prop drilling by leveraging context only when necessary.

## Success Criteria
- [ ] Root layout renders fonts, background gradients, and sticky navigation with anchor links.
- [ ] Tailwind config exposes reusable `bg-solo-*`, `shadow-portal`, and `text-glow` classes for future tasks.
- [ ] Page sections include semantic IDs matching navigation links (`#hero`, `#gallery`, `#team`, `#recruit`).
- [ ] Layout works across desktop and mobile viewports without layout shift warnings.
- [ ] Metadata exports validated via `npm run lint` (Next’s metadata type checks pass).

## Testing & Validation

### Manual Testing Steps
1. Run `npm run dev` and confirm base layout renders with fonts and gradient background.
2. Resize browser to mobile widths; ensure sticky nav and drawer placeholder render without overlap.
3. Use Lighthouse or Chrome DevTools to check layout stability (CLS close to 0).
4. Verify `npm run lint` and `npm run test` remain green after changes.

### Edge Cases to Verify
- Fallback fonts load correctly when custom font fails (inspect network throttling).
- Navigation links scroll to correct section offsets (account for sticky header height).
- Ensure global styles do not leak into shadcn or Motion components unexpectedly.

## Dependencies

**Must be completed before this task**:
- Task 01: Bootstrap Next.js 15 Project and Tooling.

**Blocks these tasks**:
- Task 04: Build hero experience.
- Task 05: Build team roster section.
- Task 07: Build AMV gallery.
- Task 08: Build recruitment UI.

## Related Documentation
- **PRD Section**: “Immersive Solo Leveling Landing Experience” requirements for hero navigation and typography.
- **ARCHI Section**: “Frontend Architecture → Core Stack” and “Folder Structure” for layout organization.

## Notes
- Keep gradients performant (pure CSS) to avoid runtime canvas cost.
- Document CSS variables in `globals.css` to guide future tuning by the design team.

---

**Estimated Time**: 2 hours  
**Phase**: Foundation
