# Task 08: Build Recruitment Section UI and Form Shell

## Context
Implements the recruitment flow entry point described in `specs/PRD.md` (“Team Roster & Recruitment Flow”) by creating the CTA section, form UI, and client-side interactions that will later connect to the server action (Task 09).

## Scope
Design and develop the recruitment section with CTA copy, optional authentication teaser, and a form shell capturing required fields. Include client-side validation hints, honeypot field wiring, and optimistic states pending server integration.

## Implementation Details

### Files to Create/Modify
- `src/components/recruitment/RecruitSection.tsx` – Server component rendering CTA copy, link to form, and optional login prompt placeholder.
- `src/components/recruitment/RecruitForm.tsx` – Client component using `useFormState`/`useTransition` tied to server action stub (`submitRecruitmentAction`).
- `src/components/recruitment/FormField.tsx`, `src/components/ui/Input.tsx`, `src/components/ui/TextArea.tsx`, `src/components/ui/FormMessage.tsx` – Form primitives aligned with Tailwind styles.
- `src/components/recruitment/SubmissionStatus.tsx` – Component showing success/error messages based on form state.
- `src/lib/validators/recruitment.ts` – Define form schema with Zod; reuse server-side for Task 09.
- `src/lib/forms.ts` – Helper for honeypot field naming and default state serialization.
- `app/(public)/page.tsx` – Add `<RecruitSection />` with anchor ID `recruit`.
- `src/styles/globals.css` – Add focus ring styles and form layout utilities.
- `tests/components/recruitment/RecruitForm.test.tsx` – Validate required fields, error messaging, and honeypot presence using Testing Library.

### Key Functionality
- Section copy explains recruitment value, steps, and expected response time.
- Form collects: name, pseudo, age, location, Discord handle, YouTube channel, best AMV link, recent AMV link, personal intro, optional availability notes.
- Honeypot field (hidden input) present and flagged for bot detection (value must remain empty).
- Client-side validation shows inline errors using Zod schema (without duplicating server logic).
- Submit button disables during pending state; success placeholder message shown after action resolves (mock for now).

### Technologies Used
- React server/client components with `useFormState`.
- Zod for shared validation schema.
- TailwindCSS for form layout and styling.
- Motion.dev optional micro-animations (button press, success check).

### Architectural Patterns
Keep server action import as placeholder for Task 09 but ensure component is wired to call it. Use `startTransition` to handle optimistic UI updates. Provide `aria-*` attributes for accessible form fields.

## Success Criteria
- [ ] Recruitment section renders CTA card, key bullet points, and accessible form within modal or inline layout.
- [ ] Client-side validation prevents submission when required fields empty or invalid URLs detected.
- [ ] Honeypot field included and hidden from assistive tech (`aria-hidden`, `tabIndex={-1}`).
- [ ] Form integrates with placeholder server action, showing pending and success states.
- [ ] Unit test covers validation messaging and honeypot presence.

## Testing & Validation

### Manual Testing Steps
1. Run `npm run dev`, scroll to recruitment section, and open form.
2. Attempt to submit empty form; verify inline errors.
3. Fill valid data and ensure success state (mock) displays.
4. Inspect DOM to confirm honeypot field hidden but present.
5. Test keyboard navigation and focus management.

### Edge Cases to Verify
- URL fields reject non-HTTP/S links.
- Age field enforces numeric input and min/max constraints.
- Form retains user data on validation errors (controlled inputs).
- Mobile layout keeps CTA and form accessible without scroll traps.

## Dependencies

**Must be completed before this task**:
- Task 02: Establish Global Layout and Solo Leveling Theming.
- Task 03: Setup Shared Infrastructure Modules and Observability Scaffolding.

**Blocks these tasks**:
- Task 09: Implement recruitment server action.
- Task 10: Integrate notifications.

## Related Documentation
- **PRD Section**: “Team Roster & Recruitment Flow.”
- **ARCHI Section**: “Backend Architecture → API Layer (Server Actions)” and “UI Components.”

## Notes
- Provide TODO for optional Discord/Google authentication (out of MVP scope).
- Keep form accessible for screen readers (use `<label>` explicitly linked via `htmlFor`).

---

**Estimated Time**: 2-3 hours  
**Phase**: Core Features
