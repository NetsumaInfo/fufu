# Task 03: Setup Shared Infrastructure Modules and Observability Scaffolding

## Context
Implements the backend utilities and monitoring hooks needed across features, aligning with `specs/ARCHI.md` (Backend Architecture, Security Considerations) and preparing for recruitment and cron workflows referenced in the PRD.

## Scope
Create reusable libraries for environment validation, Vercel KV access, rate limiting, schema validation, and notification stubs. Wire up Sentry instrumentation for server, edge, and client surfaces, plus baseline testing configuration.

## Implementation Details

### Files to Create/Modify
- `src/lib/env.ts` – Zod-based parser validating required env vars (`KV_REST_API_URL`, `KV_REST_API_TOKEN`, `YOUTUBE_API_KEY`, `RESEND_API_KEY`, `DISCORD_WEBHOOK_URL`, `ADMIN_REFRESH_TOKEN`, `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`, etc.).
- `src/lib/kv.ts` – Vercel KV helper exporting `kvClient()` and higher-level helpers (`getJson`, `setJson`, TTL management, retry logic).
- `src/lib/rateLimit.ts` – Token bucket implementation using Upstash Ratelimit or KV counters, exposing `rateLimitByIp`.
- `src/lib/validators/index.ts` – Export common Zod primitives; stub recruitment schema for Task 09.
- `src/lib/notifications.ts` – Placeholder functions `sendDiscordNotification` and `sendResendMail` that currently log/no-op; completed in Task 10.
- `src/lib/sentry.ts` – Helper to wrap server actions/handlers with Sentry tracing.
- `src/types/amv.ts`, `src/types/recruitment.ts` – Type definitions derived from planned Zod schemas.
- `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts` – Configure DSN, sample rate, traces, and replay per Sentry docs.
- `next.config.mjs` – Import Sentry plugin (`withSentryConfig`) and enable instrumentation file paths.
- `app/layout.tsx` or `app/(public)/layout.tsx` – Register `<SentryNextApp />` as needed (depending on Sentry setup).
- `vitest.config.ts`, `tests/setup.ts` – Configure Vitest (jsdom + React Testing Library), alias `@/`.
- `tests/mocks/kv.ts`, `tests/mocks/notifications.ts` – Basic mocks returning predictable data for future tests.

### Key Functionality
- Environment variables validated at runtime with clear error messaging in development.
- KV helper consolidates repeated auth headers and JSON handling for both RSC fetches and API routes.
- Rate limiting utility ready for Server Action use with configurable burst/window.
- Sentry instrumentation captures server actions, API routes, and client interactions.
- Vitest configured for unit/integration tests with global utilities imported automatically.

### Technologies Used
- Zod for env/schema validation.
- Vercel KV REST client (`@vercel/kv`).
- Sentry Next.js SDK (`@sentry/nextjs`).
- Upstash Ratelimit or custom KV-based limiter.
- Vitest + Testing Library.

### Architectural Patterns
Centralize integration logic under `src/lib/` to keep components lean. Prefer dependency injection (pass clients to functions) to ease testing. Wrap server actions with Sentry instrumentation helper rather than sprinkling manual `captureException` calls.

## Success Criteria
- [ ] Importing `env` from `src/lib/env` throws descriptive errors when required vars missing in development.
- [ ] `kv.getJson`/`kv.setJson` helpers work with TTL and handle JSON parsing/stringify safely.
- [ ] `rateLimitByIp` prevents more than configured requests in unit tests using mocks.
- [ ] Sentry config builds without warnings and `npm run dev` logs indicate instrumentation loaded.
- [ ] Vitest runs with new setup files and mocks accessible via `tests/mocks`.

## Testing & Validation

### Manual Testing Steps
1. Run `npm run lint` to ensure new modules typed correctly.
2. Execute `npm run test` to verify env, KV, and rate limit unit tests.
3. Temporarily log env parsing errors to confirm readable output.
4. Trigger a dummy Sentry capture (e.g., `Sentry.captureMessage`) and confirm CLI log.

### Edge Cases to Verify
- Missing optional env vars fall back to sane defaults without crashing.
- KV helper handles network errors (wrap in try/catch with Sentry capture).
- Rate limiter resets after window expires in tests.
- Sentry instrumentation does not run on edge runtime if not configured (guard with runtime checks).

## Dependencies

**Must be completed before this task**:
- Task 01: Bootstrap Next.js 15 Project and Tooling.
- Task 02: Establish Global Layout and Solo Leveling Theming.

**Blocks these tasks**:
- Task 06: Implement YouTube data pipeline.
- Task 08: Build recruitment UI (form relies on validators/env).
- Task 09: Implement recruitment server action.
- Task 10: Integrate notifications.

## Related Documentation
- **PRD Section**: “Team Roster & Recruitment Flow” (requires secure data handling).
- **ARCHI Section**: “Backend Architecture” (env, KV, rate limiting) and “Monitoring & Observability” (Sentry).

## Notes
- Document required env vars in `README` or `.env.example` (add file if not present).
- Consider stubbing Resend/Discord functions with `if (!env.RESEND_API_KEY)` guard to avoid runtime failures during early dev.

---

**Estimated Time**: 2-3 hours  
**Phase**: Foundation
