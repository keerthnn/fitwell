---
id: database-data-lifecycle
title: Data Lifecycle
status: active
authority: binding-engineering
requirements: [DATA-001, DATA-003, DATA-004, DATA-005]
decisions: [ADR-0003, ADR-0004, ADR-0006]
code: [prisma/schema.prisma, src/pages/api/user/delete-account.ts, src/pages/api/admin/users/delete.ts, src/lib/analytics/activity.ts]
tests: []
last_verified: 2026-08-15
---

# Data lifecycle

| Data | Creation and state | Deletion/retention behavior visible in code |
| --- | --- | --- |
| `User` | Upserted after verified Firebase sign-in; can be active, disabled, or tombstoned with `deletedAt` | Account deletion preserves the row, anonymizes email, clears display/photo, and marks disabled/deleted. Repository code does not delete the Firebase identity. |
| `UserProfile` | Created during onboarding; updated in profile/settings | Cascades with a physical user deletion; local account deletion explicitly removes it. A standalone delete-profile endpoint also exists. |
| `Exercise` | Seeded or administrator-created; active/inactive | Archive and restore toggle `isActive`. There is no application hard-delete route. |
| Workout aggregate | Member creation, duplication, plan start, and editing; DRAFT/IN_PROGRESS/COMPLETED | Owner or administrator delete removes the workout and cascades exercises/sets. Account deletion removes owned workouts. |
| Plan aggregate | User-created or platform built-in; active/archive flags | Member-owned plans can be archived and are removed during account deletion. Built-ins use administrator archive/restore. Source links from workouts become null if a plan is removed. |
| `UserActivityDay` | Best-effort upsert on authenticated API activity | Cascades only on physical user deletion; local account tombstoning does not explicitly remove activity rows. |
| Administrator data | Grants are created/removed by admins; logs append for selected actions | Access cascades on physical user deletion; grantor becomes null. Audit administrator relation restricts physical deletion. Logs have no repository retention job. |
| Feedback aggregate | Member creates; messages append; OPEN/RESPONDED/CLOSED | Owner may delete only before an admin reply; account deletion removes owned conversations. Author link becomes null if an author is physically deleted. |

No retention duration, purge job, hosted backup policy, or tested restore procedure is present in the repository. Those facts remain unknown rather than inferred.
