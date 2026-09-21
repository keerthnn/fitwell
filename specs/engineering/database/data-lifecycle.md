---
id: database-data-lifecycle
title: Data Lifecycle
status: active
authority: binding-engineering
requirements: [DATA-001, DATA-003, DATA-004, DATA-005]
decisions: [ADR-0003, ADR-0004, ADR-0006]
code: [prisma/schema.prisma, src/pages/api/user/create-profile.ts, src/pages/api/user/update-profile.ts, src/pages/api/user/delete-account.ts, src/pages/api/admin/users/delete.ts, src/pages/api/workout-plans/delete.ts, src/lib/analytics/activity.ts]
tests: [test cases/prisma/workout-day-target-history.test.ts, test cases/prisma/workout-plan-lifecycle.test.ts, test cases/pages/api/user/profile-target-history.test.ts, test cases/pages/api/workout-plans/delete.test.ts]
last_verified: 2026-09-21
---

# Data lifecycle

| Data | Creation and state | Deletion/retention behavior visible in code |
| --- | --- | --- |
| `User` | Upserted after verified Firebase sign-in; can be active, disabled, or tombstoned with `deletedAt` | Account deletion preserves the row, anonymizes email, clears display/photo, and marks disabled/deleted. Repository code does not delete the Firebase identity. |
| `UserProfile` | Created during onboarding; updated in profile/settings | Cascades with a physical user deletion; local account deletion explicitly removes it. A standalone delete-profile endpoint also exists. |
| `WorkoutDayTargetHistory` | A baseline is created with the profile; later rows append only when the 1–7 day target changes | Retained while the profile exists so completed weeks keep their historical target; cascades when the profile is deleted by any profile/account lifecycle. |
| `Exercise` | Seeded or administrator-created; active/inactive | Archive and restore toggle `isActive`. There is no application hard-delete route. |
| Workout aggregate | Member creation, duplication, plan start, and editing; DRAFT/IN_PROGRESS/COMPLETED | Owner or administrator delete removes the workout and cascades exercises/sets. Account deletion removes owned workouts. |
| Plan aggregate | User-created or platform built-in; active/archive flags | Member-owned private plans can be archived/restored or permanently deleted by their owner after UI confirmation; account deletion also removes them. Permanent deletion cascades plan prescriptions and sets workout source links to null without removing materialized workout exercise/set data. Built-ins use administrator archive/restore. |
| `UserActivityDay` | Best-effort upsert on authenticated API activity | Cascades only on physical user deletion; local account tombstoning does not explicitly remove activity rows. |
| Administrator data | Grants are created/removed by admins; logs append for selected actions | Access cascades on physical user deletion; grantor becomes null. Audit administrator relation restricts physical deletion. Logs have no repository retention job. |
| Feedback aggregate | Member creates; messages append; OPEN/RESPONDED/CLOSED | Owner may delete only before an admin reply; account deletion removes owned conversations. Author link becomes null if an author is physically deleted. |

No retention duration, purge job, hosted backup policy, or tested restore procedure is present in the repository. Those facts remain unknown rather than inferred.
