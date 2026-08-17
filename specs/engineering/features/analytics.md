---
id: sdd-analytics
title: Analytics
status: active
authority: engineering
requirements: [ANALYTICS-001, ANALYTICS-002, ANALYTICS-003, ANALYTICS-004, ANALYTICS-005, ANALYTICS-006, ANALYTICS-007, ANALYTICS-008, ANALYTICS-009, DATA-005, SEC-002]
decisions: [ADR-0004, ADR-0005]
code: [src/pages/analytics.tsx, src/pages/api/analytics/summary.ts, src/pages/api/admin/analytics/summary.ts, src/lib/analytics/]
tests: []
last_verified: 2026-08-15
---

# Analytics SDD

## Scope and goals

Personal analytics aggregates completed workouts for the current member. Administrator analytics separately returns system-wide completed workout, active-user, and duration totals.

## Personal analytics flow

`/analytics` requests the default summary and presents four headline totals, muscle distribution, and workout-plan usage. The typed response also contains workout frequency, personal bests, and current streak, but the page does not render those collections/field.

## Date range

The API parses optional `start` and `end` with JavaScript `Date`. Defaults are current time and 30 days earlier. It rejects invalid dates, `start >= end`, and ranges longer than 366 days. The member page has no range controls.

## Aggregation

The API loads owner-scoped completed workouts in range with source plan, exercises, exercise metadata, and sets.

- Duration sums `durationMinutes` or zero.
- Volume sums `reps * weightKg` across completed sets, treating absent values as zero.
- Exercises performed counts workout-exercise entries.
- Muscle distribution counts entries by primary muscle.
- Frequency counts workouts by `toLocaleDateString("en-US", { weekday: "short" })`.
- Personal bests keep maximum set weight per exercise.
- Plan usage counts source-plan names.
- Current streak is hard-coded to zero in this response.

## Admin analytics

Admin summary uses validated named/custom/all-time ranges and returns completed-workout count, activity-day-based active users, and total duration. Grouping types exist in shared types; the current page/wrapper uses the default summary and does not present a series.

## Security and failure handling

Personal queries use verified UID; admin analytics requires administrator access. Invalid ranges return 400. UI shows loading/error/empty values.

## Edge cases and gaps

- Personal date grouping uses server locale/timezone, not profile timezone.
- Weight/volume remains kilograms in the UI.
- Only completed sets contribute volume and personal-best weight; exercise occurrence counts still include each workout-exercise entry in a completed workout.
- Missing duration contributes zero.
- No formula, timezone, range, unit, or representative-data tests exist.

## Code map

`src/pages/analytics.tsx`; `src/pages/api/analytics/summary.ts`; `src/pages/system-admin/analytics.tsx`; `src/pages/api/admin/analytics/summary.ts`; `src/lib/analytics/time.ts` and `activity.ts`.

## Related documents

[Analytics PRD](../../prds/domains/analytics.md), [Dashboard SDD](dashboard.md), [Workout Engine SDD](workout-engine.md), and [User Profiles SDD](user-profiles.md).
