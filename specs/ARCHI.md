# Technical Architecture: Fulguria Team Solo Leveling Showcase

## Architecture Overview

**Architecture Philosophy**
Lean App Router build for the Fulguria collective, prioritizing visual impact, minimal backend, and fast iteration. Serverless-first, edge-ready delivery with scheduled background jobs for content sync. Cost-conscious tooling that keeps maintenance low while leaving headroom for future features (auth, contests).

**Tech Stack Summary**
- Framework: Next.js 15 (App Router, RSC default, Motion.dev for animations)
- Deployment: Vercel serverless + Edge (pages) + Node (form action) + Cron Jobs
- Database: Vercel KV (content cache + submission log)
- Authentication: None in MVP (future Discord/Google optional)
- Notifications: Discord webhook + Resend email
- Monitoring: Sentry (errors/perf) + Vercel Web Analytics

## Frontend Architecture

### Core Stack
- **Framework**: Next.js 15 App Router  
  - **Why**: Latest RSC improvements, built-in image optimization, edge support.  
  - **Trade-off**: Requires strict separation of server/client components; can complicate complex animations (mitigated by explicit client wrappers).

- **UI Components**: Custom TailwindCSS + Motion.dev primitives  
  - **Why**: Full control over Solo Leveling aesthetic; no unused component baggage.  
  - **Trade-off**: Higher design/dev effort vs starter kits; must enforce internal consistency manually.

### State Management
- **Global State**: React hooks only  
  - **Why**: Static content plus one form; no shared mutable state needed.  
  - **Use cases**: Local form state, menu toggles, animation triggers.

- **Server State**: Native RSC data fetching + `react` cache  
  - **Why**: Server Components keep bundle small; cache integrates with revalidation.  
  - **Pattern**: `async` RSCs fetching from YouTube cache API; client components hydrate with server-provided data.

- **URL State**: Not needed  
  - **Why**: No filters/search; single-page flow.

### Data Fetching Strategy
RSC-first for hero, roster, AMV gallery; `fetch` with `next.revalidate = 3600` using cached KV data. Client components only where motion/interactivity required (hero animations, sticky nav, recruitment form). Form submission via Server Action (Node runtime) keeps logic server-side without exposing API routes.

## Backend Architecture

### API Layer
- **Primary Pattern**: Server Actions + Route Handlers  
  - **Why**: Actions keep mutation logic colocated with components; route handler for YouTube cron endpoint.  
  - **Security**: Server-side Zod validation, honeypot field, IP hashing + rate limit middleware.

- **Validation**: Zod v4  
  - **Why**: End-to-end TypeScript inference; shared schemas between client hints and server action.  
  - **Trade-off**: Slight bundle overhead if imported client-side (limit to server).

- **API Security**  
  - Rate limiting: Lightweight token bucket via Upstash Ratelimit or custom KV counter.  
  - CORS: Not required (form posts same origin); lock down cron route with bearer token.

### Authentication & Authorization
- **Auth Provider**: None (MVP)  
  - **Why**: Form-only requirement; simplifies flow.  
  - **Trade-off**: No personalized dashboards; revisit when contests/auth needed.

- **Auth Method**: N/A

- **Authorization Model**: N/A

### Database & Data Layer
- **Database**: Vercel KV  
  - **Why**: Fits small key-value workloads (YouTube cache, submission logs); zero ops and edge-friendly.  
  - **Trade-off**: Not relational; migration needed if structured data grows.

- **ORM/Query Builder**: None  
  - **Why**: KV interactions via REST API/SDK; no SQL needed.  
  - **Trade-off**: Lose relational constraints; acceptable for cache + logs.

- **Real-time**: Not required  
  - **Why**: Content updates via hourly cron; no live collaboration.

### AI Integration (not applicable)

## Infrastructure & Deployment

### Hosting & Deployment
- **Platform**: Vercel  
  - **Why**: Native Next.js support, cron jobs, KV, analytics under one roof.  
  - **Trade-off**: Vendor lock-in; acceptable for MVP speed.

- **Region Strategy**: Edge runtime for public routes (global latency), Node runtime on Server Action hosted in primary region (likely `iad1`); ensure consistent data residency for KV.

### Background Jobs
- **Tool**: Vercel Cron Jobs  
  - **Why**: Managed scheduling, integrates with route handler.  
  - **Use cases**: Hourly YouTube sync pulling latest videos -> store normalized list in KV. TTL 1,030 min (~17h) for safety; revalidate on demand via fallback read.

### Monitoring & Observability
- **Application Monitoring**: Sentry SDK (browser + server) with performance tracing.  
- **Error Tracking**: Sentry alerts (Discord integration) for frontend/server exceptions.  
- **Analytics**: Vercel Web Analytics for lightweight traffic metrics; upgrade to PostHog later if needed.

## Additional Services

### Email
- **Provider**: Resend  
  - **Why**: Simple transactional email API; free tier fits low volume.  
  - **Use cases**: Recruitment submission notifications to team inbox; optional auto-reply to applicant.

### File Storage
- **Provider**: Not needed  
  - **Why**: Media via YouTube; static assets served from `public/`.

### Payments
- **Provider**: Not needed

### Notifications
- Discord webhook posting structured embed per submission.  
- Sentry alert rules can also ping Discord for errors.

## Architecture Decision Records (ADRs)

### ADR-001: Content Caching in Vercel KV
- **Context**: Need automated AMV gallery updates without heavy DB.  
- **Decision**: Store normalized YouTube API response in KV with hourly cron refresh.  
- **Alternatives Considered**: Static JSON (manual updates), Supabase/Postgres.  
- **Rationale**: KV minimal ops, suits small dataset, supports TTL + quota fallback.  
- **Consequences**: If data needs relational queries later, must migrate.

### ADR-002: Server Actions for Recruitment Form
- **Context**: Capture submissions, send notifications, log data securely.  
- **Decision**: Use Next.js Server Action running on Node runtime.  
- **Alternatives Considered**: API Route, third-party form service.  
- **Rationale**: Co-location, built-in CSRF protection, easy rate limiting.  
- **Consequences**: Ensure Node runtime enabled; Actions still evolving so require testing.

## Folder Structure

```
/
 app/
   (public)/
     layout.tsx
     page.tsx
     amvs/           # RSC fetching cached list
     team/           # RSC for roster section
   actions/
     submitRecruitment.ts  # Server Action
   api/
     youtube-refresh/route.ts  # Cron endpoint
 src/
   components/
     hero/
     gallery/
     team/
     ui/               # design primitives
   lib/
     youtube.ts        # API client + normalization
     kv.ts             # KV helper (with TTL logic)
     notifications.ts  # Discord/Resend helpers
     rateLimit.ts
     validators.ts     # Zod schemas
   hooks/
     useScrollSections.ts
   styles/
     globals.css
   types/
     amv.ts
     recruitment.ts
 public/
   assets/
 prisma/               # Reserved for future relational DB
```

## Implementation Priority

### Phase 1: Foundation (Week 1)
1. Scaffold Next.js 15 project with Tailwind, Motion.dev, Sentry, Resend.
2. Configure Vercel KV, environment variables, base layout, global styles.
3. Build hero/navigation skeleton (RSC + client wrappers where needed).

### Phase 2: Core Features (Week 2-3)
1. Implement YouTube sync pipeline (cron route, KV caching, gallery section).
2. Create team roster section reading static TS config.
3. Build recruitment form (client component) + server action (Zod validation, rate limit, notifications, KV log).

### Phase 3: Enhancement (Week 4+)
1. Fine-tune animations, responsive polish, accessibility checks.
2. Add analytics dashboards (Sentry reports, Vercel analytics review).
3. Prep groundwork for future auth (Better Auth scaffold, feature flags).

## Cost Estimation

### Monthly Infrastructure Costs (at scale)
- Database: $0 (Vercel KV within free tier)
- Hosting: $0–$20 (Vercel Hobby/Pro depending on plan)
- Auth: $0 (not used)
- Email: $0 (Resend free tier)
- Storage: $0 (not required)
- **Total**: ~$0–$20/month until traffic scales

### Free Tier Limits
- Vercel Cron: 40 executions/day (hourly job covered)
- Resend: 100 emails/day free
- Sentry: 5k events/month

## Security Considerations

1. **Authentication**: None in MVP; document Better Auth plan for future.
2. **API Security**: Zod validation, honeypot field, IP hash, rate limiting (KV or Upstash).
3. **Database**: Store minimal PII in KV; set retention policy for submission logs.
4. **Environment Variables**: Managed via Vercel (`RESEND_API_KEY`, `DISCORD_WEBHOOK_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `YOUTUBE_API_KEY`, `ADMIN_REFRESH_TOKEN`).
5. **CORS**: Same-origin form posts; secure cron route with bearer token.
6. **Runtimes**: Public routes on Edge runtime; server action forced to Node (`export const runtime = "node";`).

## Next Steps

1. Configure Vercel project, secrets, and KV store.
2. Implement cron job and validate YouTube API quotas with fallback cache.
3. Build recruitment form, notifications, and KV logging.
4. Verify Sentry instrumentation and Vercel analytics.
5. Plan backlog for future enhancements (auth, inline video, contest hub).
