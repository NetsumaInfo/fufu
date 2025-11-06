# Task 11: Finalize Observability, QA, and Launch Readiness

## Context
Ensures the experience meets the polish and monitoring expectations from the PRD success metrics and `specs/ARCHI.md` (Monitoring & Observability, Implementation Priority Phase 3/4). This task validates responsiveness, accessibility, analytics, and automated tests prior to launch.

## Scope
Perform end-to-end quality checks, wire final Sentry/Vercel analytics hooks, add regression and responsiveness tests, and document launch readiness steps. Address edge-case UX polish (error boundaries, loading states, SEO tags).

## Implementation Details

### Files to Create/Modify
- `app/(public)/page.tsx` – Ensure `generateMetadata` covers OG/Twitter cards with gallery/roster previews.
- `app/global-error.tsx`, `app/not-found.tsx` – Add branded error boundaries following Solo Leveling aesthetic.
- `src/lib/analytics.ts` – Wrap Vercel Analytics and track key events (gallery link clicks, submission success).
- `src/components/analytics/AnalyticsProvider.tsx` – Provide client component for event dispatch (if needed).
- `sentry.client.config.ts`, `sentry.server.config.ts` – Finalize sample rates, tracing origins, release info.
- `tests/e2e/hero.spec.ts`, `tests/e2e/gallery.spec.ts`, `tests/e2e/recruitment.spec.ts` – Playwright scripts covering hero flow, gallery load with KV stub, successful recruitment submission.
- `tests/mocks/kv.ts`, `tests/mocks/notifications.ts` – Extend to support E2E stubbing via environment flags.
- `package.json` – Ensure `npm run test:e2e` spins up server and runs Playwright with proper config.
- `docs/LAUNCH_CHECKLIST.md` – Summarize env vars, cron setup, analytics verification, and rollback plan.
- `README.md` – Update with instructions for running lint/test/e2e and configuring env secrets.

### Key Functionality
- Sentry instrumentation verified in both client and server contexts with sample traces.
- Error boundary pages provide clear messaging and CTA back to hero.
- Analytics tracks at least: hero CTA clicks, gallery video opens, recruitment submissions.
- Playwright tests cover hero load, gallery data fixture display, and recruitment success path (with mocked notifications).
- Accessibility audit (Lighthouse/axe) ensures key sections meet WCAG AA basics.

### Technologies Used
- Sentry Next.js SDK (tracing, session replay optional).
- Vercel Web Analytics / `@vercel/analytics`.
- Playwright for end-to-end testing.
- Axe DevTools or `@axe-core/playwright` for accessibility checks.

### Architectural Patterns
Keep analytics event emission minimal and conditional on browser environment. Use feature flags or environment checks to disable analytics in test runs. Error boundaries should remain server components when possible, with client wrappers for animations only.

## Success Criteria
- [ ] Sentry captures manual test events (e.g., `Sentry.captureMessage("recruitment-submit-test")`) in both server and client logs.
- [ ] Playwright suite (`npm run test:e2e`) passes on CI/local with mocked external services.
- [ ] Lighthouse performance ≥ 85 and accessibility ≥ 90 for core sections.
- [ ] Analytics events recorded locally (check console/network) without double counting.
- [ ] Launch checklist completed with cron job, env vars, and monitoring instructions documented.

## Testing & Validation

### Manual Testing Steps
1. Run `npm run lint`, `npm run test`, and `npm run test:e2e`.
2. Execute Lighthouse audit (Chrome DevTools) on hero and gallery segments.
3. Trigger manual Sentry event and view in dashboard (or console fallback if DSN unset).
4. Inspect analytics network calls when clicking CTAs and submitting recruitment form.
5. Test on multiple browsers (Chrome, Firefox, Safari) and devices (mobile emulator).

### Edge Cases to Verify
- Offline mode: gallery empty state, recruitment form disabled with informative message.
- Cron route misconfiguration surfaces alerts (Sentry, logs) without crashing app.
- 404 page retains navigation to hero section and matches branding.
- Ensure environment toggles (e.g., `NEXT_PUBLIC_VERCEL_ENV`) respected for analytics.

## Dependencies

**Must be completed before this task**:
- All Tasks 01-10.

**Blocks these tasks**:
- None (final task).

## Related Documentation
- **PRD Section**: Success Criteria and Goals (smooth navigation, recruitment submissions).
- **ARCHI Section**: “Monitoring & Observability” and “Implementation Priority” Phase 3/4.

## Notes
- Coordinate with ops to schedule Vercel cron and confirm timezone.
- Capture before/after screenshots for launch documentation and visual QA.

---

**Estimated Time**: 3 hours  
**Phase**: Polish & Optimization
