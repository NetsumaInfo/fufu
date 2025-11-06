# Task 07: Build AMV Gallery Section

## Context
Transforms the cached YouTube data into the AMV gallery experience mandated by the PRD (“AMV Project Gallery”) using the RSC data fetching patterns from `specs/ARCHI.md` (Frontend Architecture → Data Fetching Strategy).

## Scope
Create the gallery server components, card UI, loading states, and revalidation hooks that render the curated AMV list. Ensure graceful fallbacks when KV data is unavailable and provide clear CTAs to watch videos on YouTube.

## Implementation Details

### Files to Create/Modify
- `app/(public)/page.tsx` – Fetch AMV list via `getAmvList()` helper and pass to gallery component.
- `src/components/gallery/GallerySection.tsx` – Server component rendering section heading, description, and grid layout.
- `src/components/gallery/AmvCard.tsx` – Client component for hover interactions (play icon, overlay, open in new tab).
- `src/components/ui/Tag.tsx`, `src/components/ui/Badge.tsx` – Optional utilities for displaying categories or new labels.
- `src/components/gallery/EmptyGalleryState.tsx` – Fallback UI guiding user to YouTube if no data loaded.
- `src/components/gallery/GallerySkeleton.tsx` – Skeleton loader for Suspense fallback.
- `src/lib/youtube.ts` – Expose `getAmvList` method reading from KV with revalidation options (`next: { revalidate: 3600 }`).
- `src/styles/globals.css` – Add CSS for card glows, aspect ratio boxes, and overlays.
- `tests/components/gallery/GallerySection.test.tsx` – Ensure gallery renders correct number of cards and links.
- `tests/components/gallery/GalleryFallback.test.tsx` – Validate empty/skeleton states.

### Key Functionality
- Gallery grid responsive across breakpoints (2 columns mobile, 3-4 desktop) with consistent aspect ratio thumbnails.
- Cards display title, publish date, tags (optional), and CTA button linking to YouTube in new tab.
- On hover/tap, cards show animated overlay (play button, gradient) using Motion.dev.
- Suspense fallback shows skeleton while server fetch resolves; empty state appears if KV returns no data.
- Section integrates with navigation anchors and shares scroll tracking context.

### Technologies Used
- Next.js Server Components with Suspense.
- TailwindCSS for grid/layout styling.
- Motion.dev for hover/tap animations.
- Day.js or date-fns for formatting publish dates (optional).

### Architectural Patterns
Keep data fetching server-side (RSC). Wrap client animations inside separate components to avoid unnecessary client bundle for static content. Use `cache` helper or `unstable_cache` if needed for revalidation semantics.

## Success Criteria
- [ ] Gallery renders normalized AMV list with accurate titles, dates, and outbound links.
- [ ] Skeleton fallback appears during intentional delay (test via dev tools).
- [ ] Empty state gracefully informs user when data unavailable and shows CTA to YouTube channel.
- [ ] Card hover/tap animations work with pointer and touch interactions.
- [ ] Unit tests cover rendering with data, empty state, and link attributes (`target="_blank"`, `rel="noopener noreferrer"`).

## Testing & Validation

### Manual Testing Steps
1. Run `npm run dev`, confirm gallery renders with data from KV (seed with mock data if necessary).
2. Simulate slow network or add `await new Promise` delay to inspect skeleton fallback.
3. Temporarily clear KV to verify empty state copy.
4. Test on mobile emulator to ensure grid and interactions remain smooth.

### Edge Cases to Verify
- Long video titles wrap without clipping.
- Missing thumbnails (fallback image or gradient).
- Accessibility: Buttons and links have descriptive `aria-label`s; keyboard focus order preserved.

## Dependencies

**Must be completed before this task**:
- Task 04: Build Hero Experience and Sticky Navigation Interactions.
- Task 05: Build Team Roster Section.
- Task 06: Implement YouTube Data Pipeline and Hourly Cron.

**Blocks these tasks**:
- Task 11: Finalize observability and QA (gallery tests, responsiveness checks).

## Related Documentation
- **PRD Section**: “AMV Project Gallery.”
- **ARCHI Section**: “Frontend Architecture → Data Fetching Strategy” and `Folder Structure` guidance for gallery components.

## Notes
- Consider adding analytics event (to be wired later) when users click to watch videos.
- Document how to update pinned AMVs (e.g., manual override array) for future iterations.

---

**Estimated Time**: 2-3 hours  
**Phase**: Core Features
