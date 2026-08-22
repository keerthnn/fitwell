---
id: sdd-user-profiles
title: User Profiles
status: active
authority: engineering
requirements: [PROFILE-001, PROFILE-002, PROFILE-003, PROFILE-004, PROFILE-005, PROFILE-006, PROFILE-007, PROFILE-008, PROFILE-009, DATA-003, DATA-004]
decisions: [ADR-0003, ADR-0004, ADR-0005]
code: [src/pages/profile/, src/pages/settings.tsx, src/components/profile/ProfileForm.tsx, src/components/ThemeModeProvider.tsx, src/utils/units.ts, src/pages/api/user/]
tests: []
last_verified: 2026-08-23
---

# User profiles SDD

## Scope and goals

Profiles store one member's fitness preferences and optional body measurements. The domain also exposes profile view/edit, browser theme preference, profile-only deletion API, and local application-account deletion. Authentication credentials remain in Firebase.

## User flows

- `/profile` loads the current profile and shows name, goal, experience, weekly target, units, and optional height/weight; absence links to onboarding.
- `/profile/edit` loads the profile into `ProfileForm` and saves through update.
- `/settings` presents a red labeled sign-out action and confirmed local-account deletion in separate session and destructive-action panels. Account actions are kept in Settings rather than duplicated in the mobile More drawer.
- Profile-only deletion has a client wrapper/API but no evident primary UI action.

## Component responsibilities

`ProfileForm` owns grouped inputs, local display conversion, validation feedback, and submit state. `ThemeModeProvider` stores `light`, `dark`, or `system` in `fitwell.theme` and reacts to system color-scheme changes. `src/utils/units.ts` converts height and weight for display/input.

## API usage

- GET profile status and current profile.
- POST create/update with shared profile validation.
- DELETE profile only.
- DELETE account with `confirm=DELETE`.

## Database usage

`UserProfile` is one-to-one with `User` through unique `userId` and cascades on user removal. Body values are persisted as centimeters/kilograms; unit system records display preference. Account deletion transaction removes workouts, private plans, feedback, profile, and admin access, then anonymizes/disables/tombstones `User`.

## Failure handling and security

All operations derive `userId` from the verified token. Create returns conflict for an existing profile; update returns not found when absent; invalid fields return details. Account deletion rejects missing confirmation and rejects deletion of the last active admin.

## Edge cases

- Profile-only delete uses `delete` on unique `userId` and will surface an unhandled Prisma error if no profile exists.
- Onboarding can update an existing profile, but its submit value sets onboarding completion.
- Application deletion preserves Firebase identity and leaves an email placeholder based on UID.
- No automated unit-conversion, validator, ownership, or deletion tests exist.

## Code map

| Responsibility | Code |
| --- | --- |
| View/edit/settings | `src/pages/profile/`, `src/pages/settings.tsx` |
| Form | `src/components/profile/ProfileForm.tsx` |
| Theme | `src/components/ThemeModeProvider.tsx`, `ThemeModeSelector.tsx` |
| Units | `src/utils/units.ts` |
| Validators | `src/lib/api/validators/profile.ts` |
| APIs | `src/pages/api/user/` |

## Related documents

[User Profiles PRD](../../prds/domains/user-profiles.md), [Onboarding SDD](onboarding.md), [Authentication SDD](authentication.md), and [Data Lifecycle](../database/data-lifecycle.md).
