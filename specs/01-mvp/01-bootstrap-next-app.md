# Task 01: Bootstrap Next.js 15 Project and Tooling

## Context
Kickstarts development for the Fulguria Solo Leveling showcase by creating the Next.js 15 App Router foundation described in `specs/ARCHI.md` (Architecture Overview) so that subsequent feature work has a consistent, typed, and linted environment aligned with the PRD vision.

## Scope
Set up a fresh Next.js 15 project with strict TypeScript, TailwindCSS, Motion.dev, linting, testing, and formatting tooling. Establish the base folder structure (`app/`, `src/`, `public/`, `tests/`) and initial App Router entry points.

## Implementation Details

### Files to Create/Modify
- `package.json` – Define scripts (`dev`, `build`, `start`, `lint`, `test`, `test:e2e`, `format`), dependencies (Next.js 15, React 19 RC, TailwindCSS, Motion.dev, Sentry, Resend, Zod, Vitest, Testing Library, Playwright), and enable `type` as `module`.
- `tsconfig.json`, `tsconfig.test.json` – Enable `strict`, `noUncheckedIndexedAccess`, `paths` for `@/` alias, and Vitest-friendly config.
- `next.config.mjs` – Configure App Router defaults, experimental flags for React 19, enable `images.remotePatterns`, register Sentry plugin stub.
- `postcss.config.mjs`, `tailwind.config.ts` – Wire Tailwind with content globs under `app` and `src`, extend theme tokens placeholder for later Solo Leveling palette.
- `.eslintrc.mjs`, `.eslintignore` – Adopt Next.js ESLint preset, Tailwind plugin, and custom rules (no default exports for components, no unused vars).
- `.prettierrc`, `.prettierignore` – Match project formatting expectations.
- `next-env.d.ts` – Generated via Next CLI for TypeScript support.
- `app/(public)/layout.tsx`, `app/(public)/page.tsx` – Minimal placeholder components returning empty shells to verify routing.
- `src/` directories: `components/`, `lib/`, `hooks/`, `styles/`, `types/`, `data/`.
- `tests/` directory with empty `.gitkeep`.
- `.vscode/settings.json` (optional) – Enforce format on save and Tailwind class sorting if team uses VS Code.

### Key Functionality
- Project bootstrapped with Next.js 15 App Router and server components by default.
- Strict TypeScript pipeline plus lint/test scripts wired into `package.json`.
- TailwindCSS and Motion.dev dependencies installed and verified via imports.
- Base directory scaffolding mirrors structure outlined in `specs/ARCHI.md`.
- Initial Sentry/Resend/Vercel KV packages included to avoid later churn.

### Technologies Used
- Next.js 15 App Router – Core framework per architecture.
- TailwindCSS & Motion.dev – Styling and animation primitives from PRD/ARCHI.
- ESLint, Prettier, Husky (optional) – Code quality enforcement.
- Vitest & Playwright – Testing stack specified under build commands.

### Architectural Patterns
Adopt module-based folder layout with `app/(public)/` for public routes, `app/actions/` for Server Actions, and server-first components. Configure `@` path alias pointing to `src` to keep imports consistent.

## Success Criteria
- [ ] `npm install` succeeds and produces lockfile without peer dependency warnings.
- [ ] `npm run dev` launches a blank placeholder page at `http://localhost:3000`.
- [ ] `npm run lint` passes with the new configuration.
- [ ] `npm run test` (Vitest) executes an empty suite without errors.
- [ ] Folder structure and key config files match architecture expectations.

## Testing & Validation

### Manual Testing Steps
1. Run `npm install`.
2. Execute `npm run dev` and visit `http://localhost:3000` to confirm the placeholder renders.
3. Run `npm run lint` and `npm run test` to validate tooling setup.
4. Optionally run `npm run test:e2e -- --help` to ensure Playwright binary setup.

### Edge Cases to Verify
- Node version compatibility (`node --version` ≥ 18.18 or 20.x as required by Next 15).
- ESLint or Tailwind plugin resolution issues on Windows paths.
- Ensuring `type: module` config works with Vitest and ESLint (adjust `eslint` parser options if necessary).

## Dependencies

**Must be completed before this task**:
- None.

**Blocks these tasks**:
- Task 02: Establish global layout and design tokens.
- Task 03: Setup shared infrastructure modules.

## Related Documentation
- **PRD Section**: “Immersive Solo Leveling Landing Experience” requires Next.js/Tailwind base.
- **ARCHI Section**: “Tech Stack Summary” and “Folder Structure” define the required scaffold.

## Notes
- Prefer `pnpm` or `npm` per team standard; ensure lockfile committed.
- If using `create-next-app`, remove demo content and reconfigure to match App Router expectations.

---

**Estimated Time**: 2-3 hours  
**Phase**: Foundation
