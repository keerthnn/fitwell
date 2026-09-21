---
id: sdd-dashboard
title: Dashboard
status: active
authority: engineering
requirements: [DASH-001, DASH-002, DASH-003, DASH-004, DASH-005, DASH-006, DASH-007, DASH-008, DASH-009, SEC-002]
decisions: [ADR-0004, ADR-0005]
code: [src/pages/dashboard.tsx, src/components/dashboard/, src/pages/api/dashboard/summary.ts, src/lib/workouts/weeklyGoal.ts, src/utils/types.ts]
tests: [test cases/lib/workouts/weeklyGoal.test.ts, test cases/pages/api/dashboard/summary.test.ts]
last_verified: 2026-09-21
---

# Dashboard SDD

## Scope and goals

The dashboard composes a member greeting, weekly workout-day progress, weekly goal streak, lifetime totals, recent completed workouts, latest active workout, recent private plans, and frequent completed-workout exercises.

## User flow and components

`/dashboard` is authenticated and loads one summary. `DashboardContent` composes header/actions; `ActiveWorkoutBanner` appears when an in-progress workout exists; `DashboardStatCard` displays totals; `DashboardPanels` renders recent workouts, saved plans, and frequent exercises. The page shows loading and retryable error states.

## API aggregation

`GET /api/dashboard/summary` runs parallel queries for local user, profile with workout-day target history, all completed workouts, latest-updated in-progress workout, four private plans, and four grouped exercise IDs. It loads exercise metadata for the grouped IDs.

`calculateWeeklyGoal` groups owner-scoped completed workouts into distinct member-local date keys and Monday-first weeks, using the profile timezone with UTC fallback. Each completed week uses the most recent target effective by that week's Sunday. The current week uses the current profile target; it joins the streak immediately when successful and otherwise remains pending without breaking a carried streak. The private response fields are `workoutDaysThisWeek`, `weeklyWorkoutDayTarget`, and `weeklyGoalStreak`. Greeting falls back from profile first name to user display name to “there,” and the target defaults to 3 when no profile exists. Recent workouts are the first five from descending workout date.

## Database usage

Reads `User`, `UserProfile` with `WorkoutDayTargetHistory`, `Workout` with counts/representative exercise/source plan, `WorkoutPlan`, and grouped `WorkoutExercise`. The response performs no writes beyond best-effort activity recording in authentication.

## Security and failure handling

All queries use verified `userId`. A query failure rejects the whole summary and the page displays a retryable error; there is no partial dashboard response or cache.

## Edge cases and gaps

- Completed workouts are loaded without a database limit to calculate lifetime totals and streak.
- If multiple active workouts exist, only the latest updated is shown.
- Frequent exercise order is preserved from grouped counts by mapping loaded metadata.
- Weekly goal fixtures cover duplicate workout dates, target five, current-week pending/success, missed weeks, timezone boundaries, and historical target changes; authenticated responsive UI verification remains manual.

## Code map

`src/pages/dashboard.tsx`; `src/components/dashboard/`; `src/pages/api/dashboard/summary.ts`; `src/lib/workouts/weeklyGoal.ts`; `DashboardSummary` in `src/utils/types.ts`.

## Related documents

[Dashboard PRD](../../prds/domains/dashboard.md), [Analytics SDD](analytics.md), and source domain SDDs.
