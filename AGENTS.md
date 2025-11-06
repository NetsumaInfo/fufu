# Repository Guidelines

## Project Structure & Module Organization
- `specs/ARCHI.md` and `specs/PRD.md` define scope and guardrails; review them before planning work.
- The Next.js 15 App Router project sits at the root. Use `app/(public)/` for landing routes, `app/actions/` for server actions, and `app/api/` for the YouTube cron.
- Keep shared logic in `src/lib/` (`kv.ts`, `youtube.ts`, `notifications.ts`, `validators.ts`), UI primitives in `src/components/ui/`, and hero/gallery/roster sections in their own folders.
- Production media lives in `public/`; exploratory assets stay in `client/`.

## Build, Test, and Development Commands
- `npm install` - install Next.js 15, Tailwind, Motion.dev, and supporting SDKs.
- `npm run dev` - start the App Router dev server at `http://localhost:3000`.
- `npm run lint` - run ESLint and Tailwind ordering; code must be clean before commits.
- `npm run test` - run Vitest + Testing Library suites.
- `npm run test:e2e` - Playwright checks for hero flow, KV-backed gallery, and recruitment submission.

## Coding Style & Naming Conventions
- Enforce TypeScript `strict` mode; no type or ESLint warnings at review time.
- Write server components by default; add `"use client"` only when motion, state, or event handlers are required.
- Use PascalCase for components, camelCase for helpers, prefix hooks with `use`, and format with Prettier (2-space indent) plus Tailwind ordering rules.

## Testing Guidelines
- Mock Vercel KV, Resend, and Discord under `tests/mocks/` to check data normalization and notifications.
- Contract-test recruitment actions for Zod validation, honeypot handling, rate limits, and notification fan-out.
- E2E specs cover hero load, hourly AMV cache refresh, and a successful submission path.

## Commit & Pull Request Guidelines
- Follow Conventional Commits (`feat:`, `fix:`, etc.) within 72 characters and cite spec sections when they inform the change.
- Provide a short summary, test output, and visual proof for UI work.
- Note any new env vars (`KV_REST_API_TOKEN`, `RESEND_API_KEY`, `DISCORD_WEBHOOK_URL`, `ADMIN_REFRESH_TOKEN`) so Vercel stays in sync.

## Security & Deployment Notes
- Keep secrets in `.env.local` and Vercel; never commit credentials.
- Protect the cron route with bearer auth, store minimal PII in Vercel KV, and keep the hourly schedule from `specs/ARCHI.md`.
- Add Sentry instrumentation to new client and server surfaces to match the monitoring plan.

## Reference Documentation
- Tailwind CSS with Vite: https://tailwindcss.com/docs/installation/using-vite
- Motion.dev for React: https://motion.dev/docs/react
- React core APIs: https://react.dev/reference/react
- Next.js 15 release notes: https://nextjs.org/blog/next-15
