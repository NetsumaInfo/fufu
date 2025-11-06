# Task 09: Implement Recruitment Server Action with Validation, Rate Limiting, and KV Logging

## Context
Completes the recruitment submission workflow required by the PRD (“Team Roster & Recruitment Flow”) by building the secure server action outlined in `specs/ARCHI.md` (ADR-002, Backend Architecture → API Layer & Security Considerations).

## Scope
Implement the `submitRecruitmentAction` server action, including payload validation, honeypot enforcement, rate limiting, KV persistence, and Sentry-instrumented error handling. Ensure client form from Task 08 integrates seamlessly.

## Implementation Details

### Files to Create/Modify
- `app/actions/submitRecruitment.ts` – Server action exporting `submitRecruitmentAction` with `"use server"`. Perform validation, rate limits, logging, and notifications stub calls.
- `src/lib/validators/recruitment.ts` – Finalize Zod schema (based on Task 08) for server-side validation, include transforms (trim strings, normalize URLs).
- `src/lib/rateLimit.ts` – Add `submitRecruitmentLimiter` configuration (e.g., 3 submissions per IP per day) and helper to hash IP.
- `src/lib/kv.ts` – Add `appendRecruitmentSubmission` storing minimal PII with timestamp/IP hash.
- `src/lib/security.ts` – New helper for hashing IP (e.g., using SHA-256 with secret salt).
- `src/types/recruitment.ts` – Extend with server response types.
- `src/lib/sentry.ts` – Expose wrapper `withActionTracing` to instrument server action.
- `tests/actions/submitRecruitment.test.ts` – Vitest suite mocking KV, rate limiter, and notifications to verify success/error paths.
- `tests/mocks/request.ts` – Provide helper to simulate action `Request` with headers (IP).
- `env` docs – Note the need for `RECRUITMENT_SALT` (for IP hashing) if applicable.
- Update `src/components/recruitment/RecruitForm.tsx` – Wire actual action and handle returned state (success/error messages).

### Key Functionality
- Validates incoming form data using shared Zod schema; returns structured state with field errors.
- Rejects submissions when honeypot field filled or rate limit exceeded, returning user-friendly message.
- Hashes IP address and stores sanitized payload in KV (`amv:submissions:<timestamp>`).
- Captures exceptions via Sentry with context (form data summary, IP hash).
- Returns success response consumed by client to show confirmation message.

### Technologies Used
- Next.js Server Actions (Node runtime) with `export const runtime = "node"`.
- Zod for validation, `@vercel/kv` for persistence.
- Crypto API (`crypto.subtle` or `node:crypto`) for hashing.
- Sentry instrumentation wrappers.

### Architectural Patterns
Keep action pure and testable: separate validation, persistence, and notifications into helper functions for mocking. Use `Result`-style return shape (`{ status: "success" | "error"; message; fieldErrors? }`) consumed by React form state.

## Success Criteria
- [ ] Valid submissions persist sanitized data to KV and return success payload consumed by client form.
- [ ] Invalid data surfaces field-level errors without triggering network exceptions.
- [ ] Honeypot and rate limit blocks return generic success message (to avoid tipping bots) while logging via Sentry.
- [ ] KV entries store only required data (no plain IP, hashed only) with ISO timestamp.
- [ ] Unit tests cover success, validation error, honeypot trigger, rate limit exceed, and KV failure.

## Testing & Validation

### Manual Testing Steps
1. Run `npm run dev`, submit valid form; confirm success UI and hashed entry saved (inspect KV via mock or console).
2. Submit again rapidly with same IP to trigger rate limit; confirm friendly message and no duplicate entry.
3. Fill honeypot input (via dev tools) and submit; ensure server returns success-like response but logs event.
4. Simulate KV failure (temporarily throw inside helper) to confirm Sentry capture and user-facing error.

### Edge Cases to Verify
- URL normalization (ensures missing protocol automatically prefixed or rejected).
- Age parsing handles numbers as strings gracefully.
- Discord handle format (`username#1234`) validated and trimmed.
- Server action rejects requests missing `Referer`/`Origin` (optional security enhancement).

## Dependencies

**Must be completed before this task**:
- Task 03: Setup Shared Infrastructure Modules and Observability Scaffolding.
- Task 08: Build Recruitment Section UI and Form Shell.

**Blocks these tasks**:
- Task 10: Integrate notifications.
- Task 11: Finalize observability and QA.

## Related Documentation
- **PRD Section**: “Team Roster & Recruitment Flow” success metric for completed applications.
- **ARCHI Section**: “API Layer”, “Security Considerations”, and ADR-002 (Server Actions for Recruitment Form).

## Notes
- Store a short retention window guideline (e.g., keep submissions 90 days; TODO for automation).
- Coordinate with security lead on hashing salt storage (`RECRUITMENT_SALT` env var).

---

**Estimated Time**: 2-3 hours  
**Phase**: Core Features
