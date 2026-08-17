---
id: sdd-onboarding
title: Onboarding
status: active
authority: engineering
requirements: [ONBOARD-001, ONBOARD-002, ONBOARD-003, ONBOARD-004, ONBOARD-005, ONBOARD-006, ONBOARD-007]
decisions: [ADR-0002, ADR-0003, ADR-0004, ADR-0005]
code: [src/pages/onboarding.tsx, src/components/profile/ProfileForm.tsx, src/components/context.tsx, src/pages/api/user/create-profile.ts, src/pages/api/user/update-profile.ts, src/pages/api/user/get-user-profile.ts, src/pages/api/user/get-profile-status.ts]
tests: []
last_verified: 2026-08-15
---

# Onboarding SDD

## Scope and goals

Onboarding is a single authenticated profile form that creates or completes the member profile and routes to the dashboard. It is not a multi-step persisted wizard and has no skip action.

## User flow

1. Authentication context routes a signed-in public visitor to onboarding when profile status reports incomplete.
2. `/onboarding` is wrapped in `AuthenticatedPage` and loads the current profile.
3. The page renders `ProfileForm` with the onboarding flag.
4. Submit creates a profile when absent or updates it when present.
5. Successful submit routes to `/dashboard`.

## Component responsibilities

The page owns loading the existing profile and choosing create versus update. `ProfileForm` owns fields, client conversion, validation display, and forces `onboardingCompleted` for onboarding submission.

## API and database usage

GET current profile distinguishes undefined loading, null absence, and existing data. POST create validates and conflicts if a profile already exists. POST update validates and returns not found when absent. `UserProfile.onboardingCompleted` is the redirect decision source.

## Failure handling and security

The page does not render the form until the profile request resolves. Authentication guard prevents signed-out use. Form submission surfaces API errors through the form. All server operations use verified UID.

## Edge cases and gaps

- A completed member can manually open onboarding; the page loads and can update the profile rather than performing an immediate page-level redirect.
- Profile-load rejection is not explicitly caught on the onboarding page, so the form can remain absent without a dedicated error state.
- The flow has no saved partial draft beyond an existing profile.
- Authenticated browser and duplicate-submit behavior lack automated verification.

## Code map

`src/pages/onboarding.tsx`; `src/components/profile/ProfileForm.tsx`; `src/components/context.tsx`; profile APIs under `src/pages/api/user/`.

## Related documents

[Onboarding PRD](../../prds/domains/onboarding.md), [User Profiles SDD](user-profiles.md), and [Authentication Flow](../architecture/authentication-flow.md).
