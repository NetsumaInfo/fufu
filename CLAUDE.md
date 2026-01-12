# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fulguria Team showcase website - a modern Next.js 15 application built for an AMV (Anime Music Video) collective. This is a multilingual (6 languages), authenticated team showcase platform with user profiles, video galleries, and recruitment features.

## Commands

### Development
```bash
npm install          # Install dependencies (automatically runs prisma generate)
npm run dev         # Start dev server at http://localhost:3000
npm run lint        # Run ESLint
```

### Database
```bash
npx prisma generate    # Generate Prisma client (required after schema changes)
npx prisma migrate dev # Create and apply migrations
npx prisma studio      # Open Prisma GUI to view/edit data
```

### Build & Deploy
```bash
npm run build                # Standard Next.js build (includes prisma generate)
npm start                    # Production server
npm run pages:build          # Cloudflare Pages build (uses @cloudflare/next-on-pages)
npm run pages:dev           # Local Cloudflare Pages development
```

## Architecture

### Database & ORM Strategy

**Critical**: This project uses **Prisma 7.x with PostgreSQL adapter** (`@prisma/adapter-pg`). The Prisma client is instantiated in `lib/prisma.ts` with the PrismaPg adapter wrapping a `pg.Pool` connection. This architecture is required for:
- Cloudflare Pages compatibility (serverless edge runtime)
- Connection pooling with Supabase's PgBouncer

When working with Prisma:
- Always import from `lib/prisma.ts`, never create new PrismaClient instances
- Run `npx prisma generate` after any schema changes
- The Role enum in Prisma schema uses lowercase values (`user`, `moderator`, `admin`)
- Database URLs use connection pooling (`?pgbouncer=true`)

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
- Uses `tailwind-merge` for conditional class merging
- Custom font: Inter (loaded via next/font/google)
- Global styles in `app/globals.css`

### Cloudflare Pages Deployment

This project is configured for Cloudflare Pages with `@cloudflare/next-on-pages`:
- Build output goes to `.vercel/output/static`
- Requires `compatibility_flags = ["nodejs_compat"]` in wrangler.toml
- **Important**: Prisma enums must be used as string literals (not imported enum types) for edge runtime compatibility
- Environment variables must be configured in Cloudflare dashboard

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
2. Import `prisma` from `lib/prisma.ts`
3. For authenticated routes: verify JWT from cookies, extract userId
4. For admin routes: use `requireAdmin()` middleware
5. Return `NextResponse.json()` with consistent `{ success, data?, error? }` shape

### Adding a new database model
1. Update `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name descriptive_name`
3. Run `npx prisma generate` (updates TypeScript types)
4. Commit both schema and migration files

### Working with Supabase Storage
1. Use `lib/supabase/server.ts` for server-side operations (has service role key)
2. Use `lib/supabase/client.ts` for client-side operations (limited by RLS)
3. Always generate signed URLs for serving protected files
4. Bucket naming convention: `avatars`, `videos`, etc.

### Adding translations
1. Add key to all 6 files in `messages/` (fr.json, en.json, es.json, ja.json, ru.json, zh.json)
2. Use nested objects for organization: `{ "auth": { "login": { "title": "..." } } }`
3. Access via `t('auth.login.title')` in components
