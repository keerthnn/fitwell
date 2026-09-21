---
id: change-2026-09-21-weekly-workout-days-and-streak
title: Weekly workout days and goal streak
status: approved
authority: temporary
mode: full-sdd
phase: design
opened: 2026-09-21
requirements: [PROFILE-002, PROFILE-003, PROFILE-005, DASH-002, DASH-003, DATA-005, DATA-006]
decisions: [ADR-0004, ADR-0005]
code:
  - prisma/schema.prisma
  - prisma/migrations/
  - src/lib/workouts/weeklyGoal.ts
  - src/lib/api/validators/profile.ts
  - src/pages/api/user/create-profile.ts
  - src/pages/api/user/update-profile.ts
  - src/pages/api/dashboard/summary.ts
  - src/components/profile/ProfileForm.tsx
  - src/pages/profile/index.tsx
  - src/components/dashboard/DashboardContent.tsx
  - src/utils/types.ts
  - /Users/keerthank/Documents/ChatGPT/IOS app/FitWell/
tests:
  - test cases/lib/workouts/weeklyGoal.test.ts
  - test cases/lib/api/validators/profile.test.ts
  - test cases/pages/api/user/profile-target-history.test.ts
  - test cases/pages/api/dashboard/summary.test.ts
  - test cases/prisma/workout-day-target-history.test.ts
  - /Users/keerthank/Documents/ChatGPT/IOS app/Tests/FitWellCoreTests/FitWellCoreTests.swift
---

# Design: Weekly workout days and goal streak

> **Layer:** *how* — SDD/technical-specification delta for the current stack.
>
> **Depends on:** signed [Clarify](clarify.md) and approved [Proposal](proposal.md).

---

## SDD delta

### DES-001 — Persistent target history

Prisma must add `WorkoutDayTargetHistory` as a child of `UserProfile`, containing a generated string
identifier, `userProfileId`, `daysPerWeek`, and `effectiveAt`. The relation must cascade when the
profile is deleted and must index `(userProfileId, effectiveAt)`. Database constraints must reject
`daysPerWeek` and `UserProfile.weeklyWorkoutTarget` values outside 1–7. The existing profile column
and JSON key remain compatibility names but their documented meaning becomes workout days.

### DES-002 — Migration and baseline

The additive migration must normalize every existing `weeklyWorkoutTarget` into 1–7 before adding
the database constraint, then insert one target-history baseline per existing profile using the
normalized current value and profile `createdAt` as `effectiveAt`. The backfill identifier must be
deterministic and require no database extension. The migration must not delete or rewrite workouts,
plans, exercises, or profiles beyond target normalization.

### DES-003 — Atomic profile writes

Profile create must write the profile and its first history event as one nested Prisma operation.
Profile update must compare the validated target with the stored current value inside a transaction;
when changed, it must update the profile and append one history event with the transaction's current
timestamp atomically. A save with an unchanged target must not append an event. Profile deletion and
account deletion rely on the profile relation's cascade.

### DES-004 — Validation and presentation

The shared web validator must accept only integer targets from 1 through 7. `ProfileForm` must show
the exact prompt “How many days do you want to work out each week?” and constrain ordinary UI input
to 1–7. Profile and admin summaries must say “day/days per week,” not “workout(s) per week.” iOS must
show the same prompt/limits and equivalent summary copy.

### DES-005 — Pure weekly-goal aggregation

`src/lib/workouts/weeklyGoal.ts` must be a pure, clock-injected helper. It must:

- validate the profile timezone with UTC fallback;
- convert each completed workout's recorded `workoutDate` to a profile-local `YYYY-MM-DD` key;
- deduplicate those keys before counting;
- use Monday-through-Sunday buckets;
- derive each week's target from the latest target event whose effective local date is no later than
  that week's Sunday, using event timestamp order to resolve multiple changes in one week;
- use the normalized current/default target when no applicable event exists;
- return current-week distinct workout days, current target days, and consecutive successful weeks;
- include the current week when it has met its target, otherwise start streak evaluation at the
  preceding completed week; and
- stop at the first completed week below its applicable target.

Target changes therefore apply to the current in-progress week, and later changes do not rewrite
completed prior weeks. Grouping target events and workout dates in the current profile timezone is
intentional; timezone preference history is not introduced by this change.

### DES-006 — Dashboard query and private response contract

`GET /api/dashboard/summary` must continue authenticating and owner-scoping every query. Its profile
query must include ordered target history, and only owned `COMPLETED` workout dates may feed the
weekly helper. Existing lifetime workout totals, duration, recent workouts, active workout, plans,
and frequent exercises retain their current meanings.

The private Dashboard contract must replace the ambiguous fields:

- `workoutsThisWeek` → `workoutDaysThisWeek`;
- `weeklyTarget` → `weeklyWorkoutDayTarget`; and
- `currentStreak` → `weeklyGoalStreak`.

Web and iOS must update atomically with this contract. Weekly progress must say “Workout day/days”
and the streak must say “week/weeks.” The response must not expose target-history records.

### DES-007 — iOS parity and demo persistence

The Swift dashboard model/view must decode and present the renamed contract. A pure Swift weekly-goal
calculator must match DES-005 for fixed inputs. Demo persistence must retain effective target events,
append an event only when the demo profile target changes, and tolerate existing saved demo JSON that
lacks the new collection. Deleting the demo profile/account must clear old target history and create
or use a valid default baseline. The iOS project file must include any new Core source through the
repository's synchronization script.

### DES-008 — Failures and compatibility

Invalid profile targets must remain a 400 field-level validation outcome. Unexpected target-history
or aggregation failures must use the Dashboard's existing generic retryable error path and must not
return a fabricated zero streak. No client-supplied user/profile identifier, timezone, target event,
or effective timestamp may become authority. Existing profile JSON continues to use
`weeklyWorkoutTarget`; existing iOS demo files remain decodable.

## Boundaries

| Area | Paths / identifiers |
| --- | --- |
| Web UI/types | `src/components/profile/ProfileForm.tsx`, `src/pages/profile/index.tsx`, `src/components/dashboard/DashboardContent.tsx`, `src/utils/types.ts` |
| Web API/domain | `src/lib/api/validators/profile.ts`, `src/lib/workouts/weeklyGoal.ts`, `src/pages/api/user/create-profile.ts`, `update-profile.ts`, `src/pages/api/dashboard/summary.ts` |
| Data | `UserProfile.weeklyWorkoutTarget`; new `WorkoutDayTargetHistory`; additive Prisma migration and generated client |
| iOS | `FitWell/Core/Models.swift`, new/present Core goal helper, `DemoBackend.swift`, `ProfileView.swift`, `DashboardView.swift`, `AdminView.swift`, core tests, Xcode project sync |
| Ownership | Target history is private to and cascades with one `UserProfile`; Dashboard reads only verified-user rows |
| Tenants / tiers | All signed-in members; no admin override, billing tier, flag, or external tenant change |

## ADR alignment

ADR-0004 and ADR-0005 remain in force: PostgreSQL/Prisma is the system of record and browser/API
contracts stay in the Pages Router monolith. The additive child model and pure domain helper do not
introduce a new durable technology choice, so no ADR is required.

## Operations

| Concern | Link or N/A |
| --- | --- |
| Vendors | N/A — no new external service, secret, SDK, or retention boundary |
| Migration | Apply through the existing Prisma deployment workflow; inspect normalization/backfill counts in the authorized target environment before/after deploy |
| Deployment / flags | Web/backend migration must deploy before an iOS build that expects the renamed Dashboard contract; no feature flag is introduced |
| Rollback | Application rollback requires retaining the additive table; do not drop history. Old code can ignore it, while target values remain normalized to the newly approved range. |

## Test mapping

| Rule ID / summary | Test | Layer |
| --- | --- | --- |
| PROFILE-003 / DES-004 accepts 1–7 and rejects 0, 8, fractions | `test cases/lib/api/validators/profile.test.ts` | unit |
| DES-001 constraints, index, cascade | `test cases/prisma/workout-day-target-history.test.ts` schema/migration assertions | unit |
| DES-002 normalizes/backfills without destructive SQL | migration assertions plus authorized migration verification | unit/manual |
| DES-003 create/update atomicity and no duplicate unchanged event | `test cases/pages/api/user/profile-target-history.test.ts` | integration-style handler |
| DASH-002 / DES-005 same-day duplicates count once and timezone boundary groups correctly | `test cases/lib/workouts/weeklyGoal.test.ts` | unit |
| DASH-003 / DES-005 five distinct days complete target five | `test cases/lib/workouts/weeklyGoal.test.ts` | unit |
| DASH-003 pending current week preserves prior streak; completed miss stops it | `test cases/lib/workouts/weeklyGoal.test.ts` | unit |
| DASH-003 historical five remains five after current target becomes three | `test cases/lib/workouts/weeklyGoal.test.ts` | unit |
| DES-006 owner-scoped completed-only query and renamed non-history response | `test cases/pages/api/dashboard/summary.test.ts` | integration-style handler |
| DES-004 web prompt/copy and 1–7 control | focused `ProfileForm`/profile/dashboard component tests | component |
| DES-007 Swift algorithm, renamed decode, old demo decode, target change history | `Tests/FitWellCoreTests/FitWellCoreTests.swift` | unit/integration |
| DES-008 unauthenticated/invalid/failure outcomes and no client authority | profile/dashboard handler tests | integration-style handler |
| Web/iOS compile against renamed contract | `pnpm run typecheck`, `pnpm run build`, `swift test`, `xcodebuild` | build |

---

*Upstream review: Keerthan K — 2026-09-21*

*Scope: design*

*Teach-back: confirmed*
