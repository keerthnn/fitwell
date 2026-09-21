---
id: sdd-user-profiles
title: User Profiles
status: active
authority: engineering
requirements: [PROFILE-001, PROFILE-002, PROFILE-003, PROFILE-004, PROFILE-005, PROFILE-006, PROFILE-007, PROFILE-008, PROFILE-009, PROFILE-010, PROFILE-011, PROFILE-012, DATA-003, DATA-004, DATA-005, SEC-001, SEC-002, SEC-004, A11Y-001, A11Y-002, A11Y-003]
decisions: [ADR-0003, ADR-0004, ADR-0005]
code: [src/pages/profile/, src/components/profile/, src/components/ThemeModeProvider.tsx, src/lib/workouts/activityCalendar.ts, src/utils/units.ts, src/utils/spec.ts, src/utils/types.ts, src/pages/api/user/]
tests: [test cases/pages/profile/index.test.tsx, test cases/components/profile/ProfileForm.test.tsx, test cases/components/profile/WorkoutActivityCalendar.test.tsx, test cases/lib/api/validators/profile.test.ts, test cases/lib/workouts/activityCalendar.test.ts, test cases/pages/api/user/profile-target-history.test.ts, test cases/pages/api/user/workout-activity.test.ts, test cases/components/layout/navigation.test.ts]
last_verified: 2026-09-21
---

# User profiles SDD

## Scope and goals

Profiles store one member's fitness preferences and optional body measurements. The domain also exposes profile view/edit, a read-only completed-workout activity calendar, browser theme preference, profile-only deletion API, and local application-account deletion. Authentication credentials remain in Firebase.

## User flows

- `/profile` provides two tabs. Profile loads the current profile and workout activity independently; it shows name, goal, experience, weekly target, units, optional height/weight, profile editing, a rolling 53-week activity calendar, and sign-out. Profile absence links to onboarding without suppressing activity. Delete account contains the warning and confirmed local-account deletion action.
- `/profile/edit` loads the profile into `ProfileForm` and saves through update.
- Member navigation exposes Profile without a separate Settings destination. The mobile More drawer reaches the same Profile page rather than duplicating account actions.
- Profile-only deletion has a client wrapper/API but no evident primary UI action.

## Component responsibilities

`ProfileForm` owns grouped inputs, local display conversion, validation feedback, and submit state. It asks “How many days do you want to work out each week?” and limits the weekly workout-day target to 1–7. `WorkoutActivityCalendar` renders 53 Monday-first week columns from server-provided date-only keys, uses theme success color plus a non-color check mark, labels every day state, and contains narrow-screen overflow while aligning initially to recent weeks. It is read-only and does not qualify workouts or read the browser clock. `ThemeModeProvider` stores `light`, `dark`, or `system` in `fitwell.theme` and reacts to system color-scheme changes. `src/utils/units.ts` converts height and weight for display/input.

## API usage

- GET profile status and current profile.
- GET workout activity returns effective timezone, fixed range/today keys, and unique sorted completed-date keys only.
- POST create/update with shared profile validation and atomic workout-day target history maintenance.
- DELETE profile only.
- DELETE account with `confirm=DELETE`.

## Database usage

`UserProfile` is one-to-one with `User` through unique `userId` and cascades on user removal. `WorkoutDayTargetHistory` stores dated target changes, belongs to the profile, and cascades on profile deletion. Profile creation writes the profile and baseline history together; profile updates append a history row only when the target changes, in the same transaction. Body values are persisted as centimeters/kilograms; unit system records display preference. The activity endpoint reads only the caller's `UserProfile.timezone` and `Workout.workoutDate` for owner-scoped `COMPLETED` rows in a padded interval, then filters to the exact 53-week range through the member-local current date. It does not read `UserActivityDay` or write calendar data. Account deletion transaction removes workouts, private plans, feedback, profile, and admin access, then anonymizes/disables/tombstones `User`.

## Failure handling and security

All operations derive `userId` from the verified token. Activity accepts GET only, accepts no client identity/range/timezone authority, falls back to UTC for a missing or invalid stored timezone, returns an empty successful calendar when no workout qualifies, and returns a generic retryable failure otherwise. Profile and activity request states remain independent so either failure does not hide the other successful content or account actions. Create returns conflict for an existing profile; update returns not found when absent; invalid fields return details. Account deletion rejects missing confirmation and rejects deletion of the last active admin.

## Edge cases

- Profile-only delete uses `delete` on unique `userId` and will surface an unhandled Prisma error if no profile exists.
- Onboarding can update an existing profile, but its submit value sets onboarding completion.
- Application deletion preserves Firebase identity and leaves an email placeholder based on UID.
- Activity date grouping is tested across ordinary, year/leap, offset, and DST boundaries; repeated completed workouts remain a single binary date and future/draft/in-progress/foreign activity does not qualify.
- Manual authenticated responsive, zoom, theme, keyboard, and screen-reader verification remains pending for the activity calendar.
- Unit-conversion and deletion coverage remain limited; weekly target boundaries and atomic target-history writes have automated coverage.

## Code map

| Responsibility | Code |
| --- | --- |
| View/edit/account actions | `src/pages/profile/` |
| Form | `src/components/profile/ProfileForm.tsx` |
| Workout activity view | `src/components/profile/WorkoutActivityCalendar.tsx` |
| Workout activity API and range logic | `src/pages/api/user/workout-activity.ts`, `src/lib/workouts/activityCalendar.ts` |
| Theme | `src/components/ThemeModeProvider.tsx`, `ThemeModeSelector.tsx` |
| Units | `src/utils/units.ts` |
| Validators | `src/lib/api/validators/profile.ts` |
| APIs | `src/pages/api/user/` |
| Weekly target history | `prisma/schema.prisma`, `src/pages/api/user/create-profile.ts`, `src/pages/api/user/update-profile.ts` |

## Related documents

[User Profiles PRD](../../prds/domains/user-profiles.md), [Onboarding SDD](onboarding.md), [Authentication SDD](authentication.md), and [Data Lifecycle](../database/data-lifecycle.md).
