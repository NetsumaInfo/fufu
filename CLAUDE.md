# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fulguria Team showcase website - a modern Next.js 15 application built for an AMV (Anime Music Video) collective. This is a multilingual (6 languages), authenticated team showcase platform with user profiles, video galleries, and recruitment features.

**Tech Stack**:
- **Framework**: Next.js 15 (App Router, React 19, TypeScript)
- **Database**: PostgreSQL via Supabase with Prisma 7.x + `@prisma/adapter-pg`
- **Authentication**: JWT with HTTP-only cookies (HS256, 7-day expiry)
- **Storage**: Supabase Storage (avatars, signed URLs)
- **Email**: Resend (password resets)
- **Styling**: TailwindCSS v3, Framer Motion
- **i18n**: next-intl (6 languages: fr, en, es, ja, ru, zh)

## Commands

### Development
```bash
npm install          # Install dependencies (automatically runs prisma generate)
npm run dev         # Start dev server at http://localhost:3000
npm run lint        # Run ESLint
```

### Database
```bash
npx prisma generate    # Generate Prisma client (ALWAYS after schema changes)
npx prisma migrate dev # Create and apply migrations
npx prisma studio      # Open Prisma GUI to view/edit data
```

**CRITICAL**: **ALWAYS run `npx prisma generate` after modifying `prisma/schema.prisma`** - TypeScript types will be out of sync otherwise.

### Build & Deploy
```bash
npm run build     # Production build (includes prisma generate)
npm start         # Production server
```

## Architecture

### Database & ORM Strategy

**Critical**: This project uses **Prisma 7.x with PostgreSQL adapter** (`@prisma/adapter-pg`). The Prisma client is instantiated in `lib/prisma.ts` with the PrismaPg adapter wrapping a `pg.Pool` connection. This architecture provides:
- Efficient connection pooling with Supabase's PgBouncer
- Better performance in serverless and traditional deployments
- Compatibility with various hosting platforms

When working with Prisma:
- **ALWAYS import from `@/lib/prisma.ts`**, NEVER create new PrismaClient instances
- **ALWAYS run `npx prisma generate` after any schema changes**
- **CRITICAL**: The Role enum in Prisma schema uses lowercase string literals (`'user'`, `'moderator'`, `'admin'`), NOT enum values
- Database URLs use connection pooling (`?pgbouncer=true`)
- Import path uses TypeScript alias: `import { prisma } from '@/lib/prisma'`

### Authentication System

JWT-based authentication with HTTP-only cookies. Key files:
- `lib/auth/jwt.ts` - Token generation/verification (HS256, 7-day expiry)
- `lib/auth/requireAdmin.ts` - Admin route protection middleware
- `lib/context/AuthContext.tsx` - Client-side React context with user state

Authentication flow:
1. Login/register → API sets HTTP-only cookie with JWT
2. Client fetches `/api/auth/profile` on mount to hydrate AuthContext
3. All authenticated requests use `credentials: "include"` to send cookies
4. API routes verify JWT from cookies to get user identity

Password reset flow uses database tokens (`PasswordResetToken` model) with email delivery via Resend.

### API Routes Structure

All API routes follow Next.js 15 App Router conventions (`app/api/*/route.ts`):

```
/api/auth/login          POST   - Login (returns cookie)
/api/auth/register       POST   - Register new user
/api/auth/logout         POST   - Clear auth cookie
/api/auth/profile        GET    - Get current user
                        PATCH  - Update profile
                        PUT    - Change password
                        DELETE - Delete account
/api/auth/forgot-password POST  - Request password reset
/api/auth/reset-password  POST  - Complete password reset
/api/admin/*                   - Admin-only routes (use requireAdmin middleware)
/api/contact             POST   - Contact form submission
```

### Storage & File Uploads

User avatars are stored in Supabase Storage:
- Client uploads base64 images via API routes
- API decodes base64, uploads to Supabase bucket via `lib/supabase/server.ts`
- Database stores file path, not full URL
- Signed URLs generated on-demand for display (15min expiry)

Always use the service role key (`SUPABASE_SERVICE_ROLE_KEY`) server-side for storage operations to bypass RLS policies.

### Internationalization (i18n)

Uses `next-intl` with 6 languages: fr, en, es, ja, ru, zh
- Translation files: `messages/*.json`
- Locale detection from browser preferences
- All UI strings must be in translation files
- Use `useTranslations()` hook in client components

### Component Organization

```
components/
  layout/          - Navbar, Footer, TransitionLayout (Framer Motion page transitions)
  home/            - Homepage sections
  team/            - Team member cards and profiles
  videos/          - Video gallery components
  auth/            - Login/register forms
  ui/              - Reusable UI primitives
  animations/      - Framer Motion animation configs
```

Layout structure: `AuthProvider` → `TranslationProvider` → `Navbar` → `TransitionLayout` → page content → `Footer`

### Styling

TailwindCSS v3 with custom configuration:
- Mobile-first responsive design (breakpoints: md=768px, lg=1024px)
- **ALWAYS use `tailwind-merge` (via `cn()` utility)** for conditional class merging
- Custom font: Inter (loaded via next/font/google)
- Global styles in `app/globals.css`

### Code Style & Conventions

**Import Paths**:
- **ALWAYS use `@/` prefix** for imports from project root: `import { Component } from '@/components/ui/Component'`
- TypeScript path alias configured: `"@/*": ["./*"]` in `tsconfig.json`

**Error Handling & Logging**:
- **ALWAYS use safe logging utilities** from `@/lib/utils/errorLogger.ts` to prevent "[Server] null" errors
- Use `safeError()`, `safeWarn()`, `safeLog()` instead of direct console methods when logging unknown values
- Example: `safeError('Failed to fetch user', error)` instead of `console.error('Failed', error)`

**Custom Icons**:
- Custom social media icons follow pattern in `@/components/ui/BilibiliIcon.tsx` and `@/components/ui/TikTokIcon.tsx`
- Use `LucideProps` interface for prop typing
- Set `fill="currentColor"` and `stroke="none"` for filled icons

**API Response Format**:
- **ALWAYS return consistent shape**: `{ success: boolean, data?: T, error?: string }`
- Use `NextResponse.json()` for all API responses

### Deployment

This is a standard Next.js 15 application using Node.js runtime. It can be deployed on any platform that supports Next.js:

**Recommended platforms:**
- **Vercel** (zero configuration, recommended)
- **Railway** / **Render** (Node.js hosting)
- **Self-hosted** (VPS with Node.js)

**Deployment requirements:**
- Node.js 18+ runtime
- PostgreSQL database (Supabase recommended)
- All environment variables configured
- `npm run build` compiles successfully

**Important notes:**
- Database connection uses `@prisma/adapter-pg` for efficient connection pooling
- **CRITICAL**: Prisma enums must be used as string literals (e.g., `role: 'admin'` not `Role.ADMIN`)
- External services (Supabase, Resend) use lazy instantiation for better performance
- All API routes use edge runtime configuration for Cloudflare Pages compatibility (see recent commits)

**Vercel deployment:**
```bash
vercel deploy
```

**Traditional deployment:**
```bash
npm run build
npm start
```

## Environment Variables

Required variables (see `.env.example` for full list with detailed comments):
- `DATABASE_URL` - Supabase PostgreSQL with PgBouncer pooling
- `DIRECT_URL` - Direct PostgreSQL connection for migrations
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public Supabase config
- `SUPABASE_SERVICE_ROLE_KEY` - Server-only key for storage operations
- `JWT_SECRET` - Minimum 32 characters for HS256 signing
- `RESEND_API_KEY` / `RESEND_FROM_EMAIL` - Email service for password resets
- `YOUTUBE_API_KEY` / `YOUTUBE_CHANNEL_ID` - Optional for video fetching
- `DISCORD_WEBHOOK_URL` - Optional for notifications

## Key Technical Decisions

1. **Client-side routing with React Context**: User state managed in AuthContext, persisted via JWT cookies, not localStorage (for security)
2. **No middleware.ts**: Authentication checks done per-route in API handlers, not global middleware
3. **Base64 image uploads**: Images sent as data URLs to API, then decoded and uploaded to Supabase server-side
4. **Signed URLs for avatars**: Generated on-demand (15min expiry) to avoid exposing permanent storage URLs
5. **Role-based access**: Three roles (user/moderator/admin) stored as Prisma enum, enforced in API routes
6. **Email via Resend**: Used exclusively for password reset flows (welcome emails on registration)
7. **No test suite**: Project currently has no testing infrastructure

## Common Workflows

### Adding a new API route
1. Create `app/api/[route]/route.ts` with named exports (GET, POST, etc.)
2. **ALWAYS import `prisma` from `@/lib/prisma`** (use @/ alias)
3. For authenticated routes: verify JWT from cookies, extract userId
4. For admin routes: **MUST use `requireAdmin()` middleware** from `@/lib/auth/requireAdmin`
5. **ALWAYS return consistent shape**: `NextResponse.json({ success: boolean, data?, error? })`
6. Use safe logging: `import { safeError } from '@/lib/utils/errorLogger'`

### Adding a new database model
1. Update `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name descriptive_name`
3. **CRITICAL**: **ALWAYS run `npx prisma generate`** (updates TypeScript types)
4. Commit both schema and migration files
5. **BEFORE using new model**: Verify TypeScript types are generated (no import errors)

### Working with Supabase Storage
1. **ALWAYS use `@/lib/supabase/server.ts` for server-side operations** (has service role key)
2. Use `@/lib/supabase/client.ts` for client-side operations (limited by RLS)
3. **ALWAYS generate signed URLs** for serving protected files (15min expiry)
4. Bucket naming convention: `avatars`, `videos`, etc.
5. **NEVER expose permanent storage URLs** to clients

### Adding translations
1. **ALWAYS add key to ALL 6 files** in `messages/` (fr.json, en.json, es.json, ja.json, ru.json, zh.json)
2. Use nested objects for organization: `{ "auth": { "login": { "title": "..." } } }`
3. Access via `t('auth.login.title')` in components with `useTranslations()` hook
4. **NEVER hardcode UI strings** - all user-facing text must be in translation files

### Adding a new UI component
1. **ALWAYS use existing patterns** from `@/components/ui/` folder
2. For icons: Follow `BilibiliIcon.tsx` or `TikTokIcon.tsx` pattern with `LucideProps`
3. Use `cn()` utility from `tailwind-merge` for conditional classes
4. Import components with `@/` alias: `import { Button } from '@/components/ui/button'`
