# Task 05: Build Team Roster Section

## Context
Supports the PRD requirement for showcasing team members (“Team Roster & Recruitment Flow”) by implementing the roster data and presentation layer described in `specs/ARCHI.md` (Folder Structure → `src/components/team/`).

## Scope
Create a data-driven roster section with member cards, roles, bios, and social links. Ensure responsive layouts, accessible hover/focus states, and dark-themed styling compatible with the Solo Leveling aesthetic.

## Implementation Details

### Files to Create/Modify
- `src/data/team.ts` – Export typed roster array with name, handle, role, bio, avatar path, and social links.
- `src/types/team.ts` – Define `TeamMember` interface/Zod schema to validate roster data.
- `src/components/team/TeamSection.tsx` – Server component that consumes roster data, splits members by role categories if needed.
- `src/components/team/MemberCard.tsx` – Client or server component (client if animations) rendering avatar, overlays, and social icons.
- `src/components/ui/Chip.tsx`, `src/components/ui/SocialLink.tsx` – Reusable primitives for roles and social icons.
- `src/styles/globals.css` or Tailwind config – Add utility classes for card glows and layered hover effects.
- `tests/components/team/TeamSection.test.tsx` – Verify roster renders correct number of members and key data points.
- `tests/mocks/team.ts` – Provide fixture data for tests if necessary.
- Update `app/(public)/page.tsx` – Insert `<TeamSection />` with anchor ID `team`.

### Key Functionality
- Displays roster grid responsive from 1 column on mobile to 3-4 on desktop.
- Each member card shows avatar, role chip, short bio, and social links (YouTube, Twitter/X, Discord).
- Hover/click interactions reveal additional info without breaking layout (e.g., overlay gradient).
- Section heading and copy align with brand messaging from hero.
- Data-driven approach allows adjusting roster by editing `src/data/team.ts` only.

### Technologies Used
- Next.js Server Components for roster rendering.
- TailwindCSS for responsive grid and styling.
- Motion.dev (optional) for subtle hover animations (client subcomponent).
- Heroicons/lucide-react for social icons if desired.

### Architectural Patterns
Keep roster data in `src/data/` to avoid overloading components. Use server component for initial render, injecting client card component only if animation required. Ensure avatars served from `public/` or remote CDN configured in `next.config.mjs`.

## Success Criteria
- [ ] Roster section renders with at least placeholder members and accurate social links.
- [ ] Cards remain legible across breakpoints (tailwind responsive classes validated).
- [ ] Section accessible via keyboard (tab order, focus outlines).
- [ ] Unit test validates card count and key text (name, role).
- [ ] Lighthouse accessibility score ≥ 90 for the roster portion (manual check).

## Testing & Validation

### Manual Testing Steps
1. Run `npm run dev`, scroll to roster, and inspect layout at 320px, 768px, 1024px widths.
2. Hover/tap cards to confirm animations and overlays behave without causing jank.
3. Use keyboard navigation to reach social links; ensure they have descriptive `aria-label`s.
4. Check that roster data updates re-render without needing code changes (modify fixture temporarily).

### Edge Cases to Verify
- Missing social links (optional fields) do not render empty icons.
- Long bios wrap gracefully without stretching cards.
- Avatar fallback (initials block) when image fails to load.

## Dependencies

**Must be completed before this task**:
- Task 02: Establish Global Layout and Solo Leveling Theming.

**Blocks these tasks**:
- Task 07: Build AMV gallery (ensures page section ordering/cohesion).
- Task 11: Finalize observability and QA (accessibility checks rely on roster readiness).

## Related Documentation
- **PRD Section**: “Team Roster & Recruitment Flow” – need clear member showcases.
- **ARCHI Section**: “Folder Structure” and “UI Components” for team section placement and style consistency.

## Notes
- Coordinate avatar assets with the design team; use placeholders (`public/assets/roster/`) until final art delivered.
- Consider optional tag filters for future iterations but keep MVP static.

---

**Estimated Time**: 2 hours  
**Phase**: Core Features
