# Implementation Tasks Overview

## Project Summary
- **From PRD**: Deliver a Solo Leveling-inspired one-page showcase that immerses visitors in the Fulguria story, highlights AMV projects, and streamlines recruitment submissions without full authentication.
- **Tech Stack**: Next.js 15 App Router, TailwindCSS, Motion.dev, Vercel KV, Zod, Discord webhooks, Resend email, Sentry monitoring, Vercel Cron Jobs.

## Current State
- ✅ Specs: `specs/PRD.md` and `specs/ARCHI.md` define scope and architecture.
- 🚧 Assets: Exploratory media stored under `client/`; not wired into any app yet.
- ❌ Application: No Next.js project, tooling, or runtime code is present.

## Task Execution Guidelines
- Review a task completely (including dependencies) before coding.
- Follow App Router server-first patterns and keep client components scoped to interactive sections.
- Validate against success criteria and update relevant tests before closing a task.
- Maintain strict TypeScript, ESLint, Tailwind ordering, and Sentry instrumentation expectations.

## MVP Tasks (specs/01-mvp/)

### Phase 1: Foundation
- [ ] `specs/01-mvp/01-bootstrap-next-app.md` - Scaffold Next.js 15 project with TypeScript, Tailwind, Motion.dev, lint/test tooling.
- [ ] `specs/01-mvp/02-establish-global-layout.md` - Implement root layout, navigation shell, and Solo Leveling design tokens.
- [ ] `specs/01-mvp/03-setup-shared-infra.md` - Add env validation, KV utilities, rate limiting scaffolds, and baseline Sentry wiring.

### Phase 2: Core Features
- [ ] `specs/01-mvp/04-build-hero-experience.md` - Create animated hero, sticky nav interactions, and section anchors.
- [ ] `specs/01-mvp/05-build-team-roster-section.md` - Implement roster data config and responsive member card grid.
- [ ] `specs/01-mvp/06-implement-youtube-pipeline.md` - Normalize YouTube data, cache in KV, and expose cron-secured refresh route.
- [ ] `specs/01-mvp/07-build-amv-gallery.md` - Render AMV gallery RSCs with graceful loading and revalidation hooks.
- [ ] `specs/01-mvp/08-build-recruitment-ui.md` - Deliver recruitment CTA section, client form shell, and honeypot field wiring.
- [ ] `specs/01-mvp/09-implement-recruitment-action.md` - Complete server action with Zod validation, rate limits, KV logging, and error handling.

### Phase 3: Integration & Enhancement
- [ ] `specs/01-mvp/10-integrate-notifications.md` - Connect Discord and Resend notifications, add mocks, and regression tests.

### Phase 4: Polish & Optimization
- [ ] `specs/01-mvp/11-finalize-observability-and-qa.md` - Harden responsiveness, accessibility, Sentry analytics, and end-to-end test coverage.

## Task Dependency Map
```
01 ─┐
02 ─┼─> 04
03 ─┘
04 ─┐
05 ─┴─> 07
06 ───> 07
07 ─┐
08 ─┼─> 09 ──> 10 ─┐
09 ───────────────┘
All Phase 1-3 ──> 11
```

## Implementation Timeline
- **Phase 1 (Foundation)**: 6-8 hours — Critical path runs through Tasks 01 → 02 → 03; limited parallelism until scaffold stable.
- **Phase 2 (Core Features)**: 12-16 hours — Tasks 04-09 form the main flow; 05 and 06 can proceed in parallel after 03.
- **Phase 3 (Integration)**: 3-4 hours — Task 10 depends on 09 completion.
- **Phase 4 (Polish)**: 3-4 hours — Task 11 wraps QA, instrumentation, and release readiness.
- **Total Estimated Time**: 24-32 hours.

## PRD Feature Coverage
- ✅ Immersive Solo Leveling landing experience: Tasks 02, 04, 11.
- ✅ AMV project gallery: Tasks 06, 07.
- ✅ Team roster & recruitment flow: Tasks 05, 08, 09, 10.

## Architecture Decision Coverage
- ✅ Next.js 15 App Router baseline: Task 01.
- ✅ Tailwind + Motion design system: Tasks 02, 04.
- ✅ Vercel KV caching & cron refresh: Tasks 03, 06.
- ✅ Server Action recruitment pipeline with validation & rate limiting: Tasks 03, 08, 09.
- ✅ Discord/Resend notifications and Sentry monitoring: Tasks 03, 10, 11.
