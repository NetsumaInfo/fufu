# Product Requirements Document: Fulguria Team – Solo Leveling Showcase

## Product Vision

**Problem Statement**  
Fans and curious viewers currently discover the Fulguria team’s AMVs through scattered channels such as YouTube and Discord, with no cohesive destination to understand who the team is, what they create, or how to join. This fragmentation dilutes the Solo Leveling-inspired identity and makes it harder to nurture new community members.

**Solution**  
Deliver a visually immersive one-page showcase that mirrors the Solo Leveling design language, highlights Fulguria’s story, celebrates standout AMV projects, and provides a streamlined recruitment path. A lightweight authentication option (Discord/Google) will capture core profile data to support future contests and application workflows.

**Success Criteria**
- Collect at least 5 pieces of positive qualitative feedback on Discord within 1 month of launch.
- Receive at least 3 completed recruitment submissions via the site within the first 3 months.
- Internal reviewers report no major usability issues and confirm the Solo Leveling aesthetic feels authentic.

## Target Users

### Primary Persona: Dedicated Fan
- **Role**: Existing community member following Fulguria’s YouTube or Discord drops.
- **Pain Points**: No central hub to explore Fulguria’s identity; scattered project links; inconsistent branding.
- **Motivations**: Enjoy the Solo Leveling aesthetic, stay updated on projects, feel closer to the creators.
- **Goals**: Quickly view the latest AMVs and understand the Fulguria vibe without friction.

### Secondary Persona: Prospective Recruit
- **Role**: AMV creator or creative enthusiast evaluating teams to join.
- **Pain Points**: Hard to gauge team quality/culture from social snippets; no easy way to apply with relevant info.
- **Motivations**: Find a team whose style resonates; showcase their best AMV; connect via familiar platforms.
- **Goals**: Validate Fulguria’s professionalism and chemistry, then submit an application with the required details effortlessly.

### Tertiary Persona: Curious Newcomer
- **Role**: First-time visitor reaching the site via social links or word of mouth.
- **Pain Points**: Low familiarity with AMV terminology; may bounce quickly if the site feels cluttered or off-brand.
- **Motivations**: Discover impressive AMV work and see if the team aligns with their interests.
- **Goals**: Understand who Fulguria is, watch highlighted projects, and follow on preferred platforms.

## Core Features (MVP)

### Must-Have Features

#### 1. Immersive Solo Leveling Landing Experience
**Description**: Hero section with animated visuals, Solo Leveling-inspired typography, and smooth anchor navigation introducing Fulguria’s purpose, values, and vibe. One-page structure with a sticky/overlay menu echoing the series’ portal UI.  
**User Value**: Instantly communicates the team’s identity and hooks visitors with a striking presentation.  
**Success Metric**: Internal qualitative review confirms the experience feels on-brand and readable (no critical usability issues).

#### 2. AMV Project Gallery
**Description**: Grid or carousel of AMV thumbnails styled with blue particle effects; each card opens the YouTube video in a new tab (inline playback remains a future enhancement). Ordered chronologically with clear titles and concise descriptions.  
**User Value**: Lets fans binge content and helps newcomers grasp Fulguria’s creative range without hunting through YouTube.  
**Success Metric**: All priority AMVs represented with working links; no broken media reported post-launch.

#### 3. Team Roster & Recruitment Flow
**Description**: Member cards with profile image, role (AMV maker, graphiste, etc.), short bio, and social links (YouTube, Twitter, etc.), plus a “Join Fulguria” call-to-action leading to an application form. Form captures name, pseudo, age, location, Discord ID, YouTube channel, best AMV link, recent AMV link, and personal intro. Optional Discord/Google login gathers IDs for future contest workflows while keeping public access.  
**User Value**: Showcases the people behind Fulguria, builds trust, and gives prospects a structured way to apply.  
**Success Metric**: At least 3 completed applications within 3 months; zero critical issues in the submission pipeline.

### Should-Have Features (Post-MVP)
- Contest hub teaser primed for future announcements and submissions.
- Embedded video playback with cinematic overlays instead of redirecting to YouTube.
- Multi-language toggle for French/English content.

## User Flows

### Primary User Journey (Fan)
1. Lands on the hero section via YouTube/Discord link.  
2. Scrolls through Fulguria’s story and Solo Leveling visuals.  
3. Browses the AMV gallery and opens selected projects.  
4. Follows social links or shares feedback on Discord.

### Secondary User Journey (Prospective Recruit)
1. Arrives on the landing page, scans the team overview.  
2. Reviews member cards to understand roles and culture.  
3. Clicks “Join Fulguria,” optionally authenticates via Discord/Google.  
4. Completes the application form and submits AMV samples.

## Constraints & Context

- **Tech Stack**: Next.js, React, TailwindCSS, Motion for dynamic interactions.
- **Resources**: Development handled in-house; a designer will join later for background imagery if needed.
- **Performance**: No specific V1 constraints beyond maintaining smooth scroll and animation fidelity.

## Out of Scope (v1)

Explicitly not included in the MVP:
- Interactive contest hosting or submission mechanics.
- E-commerce (merch, paid downloads).
- Private member-only content beyond basic login capture.
- Advanced analytics dashboards or a CMS.

## Open Questions

- Final decision on embedding YouTube videos versus linking out (impacts performance and DA).
- Exact animation/motion scope for the hero and navigation (requires coordination with the motion designer).
- Data handling specifics for Discord/Google login (storage and privacy compliance).

## Success Metrics

**Primary**
- Positive feedback count: ≥5 Discord/social comments praising the experience within 1 month.
- Recruitment submissions: ≥3 completed forms in the first 3 months.

**Secondary**
- AMV link click-through: Track gallery-to-YouTube clicks as a baseline for future targets.
- Time on page: Internal goal of ≥2 minutes average in analytics (qualitative engagement benchmark).

## Timeline & Milestones

- **MVP completion**: Within the current development cycle.  
- **First user testing**: Internal review with team members and trusted fans immediately pre-launch.  
- **Launch**: Public release aligned with the next major Fulguria AMV drop post-MVP.
