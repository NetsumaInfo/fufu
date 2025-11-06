# Task 06: Implement YouTube Data Pipeline and Hourly Cron

## Context
Fulfills the PRD requirement for the AMV gallery by sourcing and caching YouTube data, following `specs/ARCHI.md` directives for Vercel KV caching (ADR-001) and cron-based refresh.

## Scope
Create the YouTube API client, normalization layer, KV caching helpers, and secured cron route that refreshes AMV metadata hourly. Provide graceful fallbacks when the API quota is exhausted.

## Implementation Details

### Files to Create/Modify
- `src/lib/youtube.ts` – Functions to fetch playlist/channel videos via YouTube Data API v3, normalize fields (id, title, thumbnail, publishedAt, description, duration).
- `src/lib/cacheKeys.ts` – Centralize KV keys (`amv:list`, `amv:lastSync`).
- `src/lib/kv.ts` – Extend with helper `setAmvList` / `getAmvList` that use typed interfaces.
- `src/types/amv.ts` – Ensure it matches normalized structure (`AmvVideo`, `AmvListResponse`).
- `app/api/youtube-refresh/route.ts` – Route handler running on Vercel cron; validates bearer token (`ADMIN_REFRESH_TOKEN`), fetches YouTube data, normalizes, stores in KV, and returns status JSON.
- `src/lib/cron.ts` – Helper to respond with standard payloads and Sentry instrumentation.
- `tests/lib/youtube.test.ts` – Unit tests for normalization (mock YouTube API responses) and caching logic.
- `tests/mocks/youtube.ts` – Provide fixture API responses and expected normalized output.
- `env` docs – Document expected `YOUTUBE_API_KEY`, `YOUTUBE_CHANNEL_ID`/`PLAYLIST_ID`.
- `next.config.mjs` – Set `runtime = "edge"` for cron route if compatible, or `"nodejs"` if using Node features.
- `vercel.json` or project docs – Add cron schedule (`"0 * * * *"` hourly) referencing the route.

### Key Functionality
- Fetch latest AMV videos limited to required count (e.g., 12) sorted by publish date.
- Normalize data into lightweight objects stored in KV with TTL (17h per ADR-001).
- Cron route secured via bearer token; responds with summary (videos saved, errors, timestamp).
- Provide fallback read logic that uses cached list when API fails.
- Sentry captures errors and attaches context for debugging (request ID, quota status).

### Technologies Used
- YouTube Data API v3 via `node-fetch` or `googleapis`.
- Vercel KV for caching.
- Zod for response validation/coercion.
- Sentry for error reporting.

### Architectural Patterns
Keep external API calls within `src/lib/youtube.ts` and separate normalization from network retrieval for testability. Use `env` helper to access credentials. Cron route should reside in `app/api/youtube-refresh/route.ts` and export `runtime = "edge"` or `"node"` per dependencies (use Node runtime if relying on `googleapis`).

## Success Criteria
- [ ] `GET`/`POST` request to `/api/youtube-refresh` with valid bearer token refreshes KV dataset and returns 200 with summary.
- [ ] Invalid/missing bearer token responds with 401 without hitting YouTube API.
- [ ] KV stores normalized list (verify via unit test) with TTL and timestamp metadata.
- [ ] Sentry captures exceptions when API quota exceeded or response invalid.
- [ ] Unit tests cover normalization, failure fallback, and cache interactions.

## Testing & Validation

### Manual Testing Steps
1. Set `YOUTUBE_API_KEY` and bearer token in `.env.local`.
2. Run `npm run dev`, then call `curl -X POST http://localhost:3000/api/youtube-refresh -H "Authorization: Bearer <token>"`.
3. Inspect console/logs for Sentry debug output and confirm success message.
4. Temporarily break API key to ensure fallback/k errors handled gracefully.

### Edge Cases to Verify
- YouTube API quota errors return 429; ensure handler stores last successful payload and surfaces message.
- Empty response (no videos) still writes empty array and does not throw.
- Network failure or JSON parsing errors captured and return 500 without crashing server.

## Dependencies

**Must be completed before this task**:
- Task 01: Bootstrap Next.js 15 Project and Tooling.
- Task 03: Setup Shared Infrastructure Modules and Observability Scaffolding.

**Blocks these tasks**:
- Task 07: Build AMV gallery (needs data source).
- Task 11: Finalize observability and QA (cron monitoring).

## Related Documentation
- **PRD Section**: “AMV Project Gallery” – requires accurate YouTube data.
- **ARCHI Section**: “Data Fetching Strategy” and “Background Jobs” (cron + KV).

## Notes
- Cache raw YouTube API response in KV (optional) to inspect data discrepancies.
- Update README with instructions for setting cron job in Vercel dashboard.

---

**Estimated Time**: 2-3 hours  
**Phase**: Core Features
