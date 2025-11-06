# Task 10: Integrate Discord and Email Notifications for Recruitment Submissions

## Context
Satisfies the PRD requirement for timely team follow-up on applications and enforces `specs/ARCHI.md` directives (Notifications, Additional Services) by wiring Discord webhooks and Resend emails into the recruitment pipeline.

## Scope
Enhance the recruitment server action to send structured Discord embeds and transactional emails via Resend. Provide mocks/tests and ensure failures degrade gracefully without blocking submissions.

## Implementation Details

### Files to Create/Modify
- `src/lib/notifications.ts` – Implement `sendDiscordNotification` (HTTP POST to webhook with embed payload) and `sendResendEmail` (Resend SDK). Support retries/backoff and structured error handling.
- `src/lib/templates/recruitmentEmail.tsx` – JSX email template summarizing applicant info; export plain-text fallback.
- `app/actions/submitRecruitment.ts` – Invoke notification helpers after KV persistence; handle errors with Sentry capture and soft-fail responses.
- `src/types/notifications.ts` – Shared types for payloads (Discord embed fields, email props).
- `tests/lib/notifications.test.ts` – Unit tests using mocks to verify payload shapes and retry logic.
- `tests/actions/submitRecruitment.notifications.test.ts` – Ensure action calls notification helpers and handles failure cases.
- `tests/mocks/resend.ts`, `tests/mocks/discord.ts` – Provide mock implementations for Resend and fetch.
- `.env.example` or docs – Document `DISCORD_WEBHOOK_URL`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_TEAM_EMAIL`.
- Optional: `src/lib/logging.ts` – Utility to log structured notification outcomes for debugging.

### Key Functionality
- Discord webhook receives embed with applicant name, role, AMV links, and quick actions (open YouTube).
- Resend email sends formatted message to team address; optionally CC applicant with automated acknowledgement.
- Notification failures captured via Sentry but do not block successful submissions (user still sees success).
- Includes rate limiting/backoff to avoid Discord or Resend throttling.
- Notifications include IP hash or submission ID for traceability (no raw PII).

### Technologies Used
- Fetch API for Discord webhook.
- Resend Node SDK (`resend` package).
- Sentry for error logging.
- Vitest for tests with mocked modules.

### Architectural Patterns
Keep notification responsibilities isolated in `src/lib/notifications` to simplify testing and reuse. Use dependency injection (pass fetch/resend client) in tests. Ensure server action awaits notifications but catches errors to avoid unhandled rejections.

## Success Criteria
- [ ] Discord webhook receives embed with required fields (manually verified in test channel).
- [ ] Resend email sends to configured team inbox with formatted template and plain-text fallback.
- [ ] Server action handles notification failures gracefully (user success, Sentry event logged).
- [ ] Unit tests cover success, partial failure (Discord fails, email succeeds), and total failure scenarios.
- [ ] Notification helpers avoid leaking secrets in logs/errors.

## Testing & Validation

### Manual Testing Steps
1. Configure `.env.local` with Discord test webhook and Resend sandbox API key.
2. Submit recruitment form locally; confirm Discord message and email received.
3. Temporarily break webhook URL to ensure server action still returns success but logs error.
4. Inspect Sentry (or console fallback) for notification failure traces.

### Edge Cases to Verify
- Discord rate limit (HTTP 429) handled with retry-after delay or log.
- Resend API errors (400/500) surfaces meaningful log, not user-facing failure.
- Email template handles missing optional fields gracefully.
- Ensure no duplicate notifications when action retried (idempotency by submission ID).

## Dependencies

**Must be completed before this task**:
- Task 09: Implement Recruitment Server Action with Validation, Rate Limiting, and KV Logging.

**Blocks these tasks**:
- Task 11: Finalize observability and QA.

## Related Documentation
- **PRD Section**: “Team Roster & Recruitment Flow” – ensure team notified promptly.
- **ARCHI Section**: “Notifications” and “Monitoring & Observability.”

## Notes
- Consider adding message batching or throttling if submission volume increases (future ADR).
- Update documentation with steps for rotating webhook/email credentials.

---

**Estimated Time**: 2 hours  
**Phase**: Integration & Enhancement
