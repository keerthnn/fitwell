---
id: change-2026-09-21-weekly-workout-days-and-streak
title: Weekly workout days and goal streak
status: approved
authority: temporary
mode: full-sdd
phase: proposal
opened: 2026-09-21
affected_prds:
  - specs/prds/domains/user-profiles.md
  - specs/prds/domains/dashboard.md
  - specs/prds/system-qualities.md
affected_sdds:
  - specs/engineering/features/user-profiles.md
  - specs/engineering/features/dashboard.md
  - specs/engineering/features/onboarding.md
affected_decisions: []
---

# Proposal: Weekly workout days and goal streak

> **Layer:** *what* — intent, scope, and **PRD delta**. Do not edit canonical PRDs until
> Verification/Archive synchronization.
>
> **Prerequisite:** [Clarify](clarify.md) was approved and revised by Keerthan K on 2026-09-21.

---

## Intent and scope

Make the member's weekly preference and streak describe a sustainable weekly routine rather than a
raw workout count or an uninterrupted daily chain. Fitwell will ask how many days the member wants
to work out each week, accept one through seven, count distinct completed-workout dates toward the
weekly goal, and show a streak of consecutive weeks in which the goal effective for each week was
achieved.

For a target of five, any five different workout days in a Monday-through-Sunday week complete the
goal. Two workouts on one day still count as one day. An incomplete current week remains pending
until it ends, so it does not erase a preceding streak; it joins immediately on reaching its target.
If the member changes their target, the current week adopts it and completed past weeks retain their
recorded target. Fitwell web/backend and iOS must expose the same meaning.

## Non-goals

- Selecting named workout weekdays or storing a detailed schedule.
- Grace days, streak freezes, rescheduling, rewards, badges, reminders, or social streaks.
- Counting drafts, in-progress workouts, duration, sets, app activity, or multiple same-day workouts
  as additional qualifying days.
- Changing workout-plan `daysPerWeek`.
- Renaming the persisted/profile JSON key `weeklyWorkoutTarget` during v1.
- Expanding the incomplete Analytics streak UI/contract.

## Iteration plan

### v1 (this change)

1. Use a one-through-seven workout-day preference and day-based language in onboarding, profile,
   and administrative profile presentation.
2. Persist effective target changes and retain the target applicable to completed past weeks.
3. Count distinct completed-workout dates in profile timezone, with UTC fallback, for weekly progress
   and goal qualification.
4. Replace the Dashboard consecutive-day streak with consecutive successful goal weeks and label it
   in weeks.
5. Treat an unfinished current week as pending until it succeeds or ends.
6. Migrate existing profiles to a normalized, best-known target-history baseline.
7. Update Fitwell web/backend and iOS together, including iOS demo behavior and focused tests.

### v2 (after user feedback — separate feature request)

- Named-day schedules and adherence.
- Grace periods, freezes, recovery rules, notifications, and rewards.
- A compatibility-planned profile storage/API rename.
- Analytics reuse after its incomplete contract is separately resolved.

## Upstream audit

| Check | Result | Notes |
| --- | --- | --- |
| Specs read | complete | [Clarify](clarify.md), User Profiles, Dashboard, System Qualities, related SDDs, data-model and verification guidance |
| ADR alignment | pass | Existing Pages Router, Prisma, shared type/validator, and Swift client boundaries remain intact. |
| Compliance | pass | Existing owner scoping is unchanged. DATA-005 governs timezone grouping and DATA-006 governs atomic profile/history writes. |
| Blocking questions | none | Target unit/range, qualifying activity, streak/current-week behavior, target changes, week boundary, migration, and client scope are resolved. |

## PRD delta

### PROFILE-002 — Profile fields (replacement)

A profile requires first name, last name, unit system, fitness goal, experience level, weekly workout
day target, and timezone. Gender, date of birth, height, current weight, typical workout duration,
and preferred workout time are optional. Fitwell must retain the target changes needed to determine
the target applicable to each week.

### PROFILE-003 — Profile validation (replacement)

Names must not exceed 80 characters. Weekly workout day target must be an integer from one through
seven. Height, when supplied, must be from 50 through 300 centimeters; weight from 1 through 600
kilograms; and typical duration from 1 through 1,440 minutes.

### DASH-002 — Weekly progress (replacement)

The Dashboard must show the number of distinct days in the current Monday-through-Sunday week that
contain at least one completed workout and compare it with the member's current weekly workout-day
target or the default target when no profile exists. Dates must be grouped in the member's valid
profile timezone, with UTC fallback. Multiple completed workouts on one date count as one day.

### DASH-003 — Weekly goal streak (replacement)

The Dashboard must show consecutive Monday-through-Sunday weeks in which the member met the target
applicable during each week. A completed week below target ends the streak. The current week joins
as soon as its target is met; while unfinished and below target, it neither increments nor ends the
preceding streak. Saving a new target applies it to the current week without rewriting completed
past-week targets. The streak must be presented in weeks.

## Acceptance examples

- Target five plus qualifying workouts on Monday, Tuesday, Thursday, Friday, and Sunday produces
  five of five days even if Sunday contains two completed workouts.
- If that week follows two successful weeks, the streak is three weeks.
- On Wednesday with two of five days after three successful past weeks, the streak remains three.
- Reaching five days on Friday immediately adds the current week.
- A completed past week with only four of five days breaks the chain.
- Changing the current target from five to three applies to the current week; completed earlier weeks
  continue to be evaluated against five.
- Workout dates use profile timezone, falling back to UTC for a missing/invalid timezone.
- The migration normalizes a legacy current value outside 1–7 and establishes it as the best-known
  baseline; no profile or workout is deleted.

## Upstream links

| Kind | Link |
| --- | --- |
| Compliance | [System Qualities](../../../prds/system-qualities.md) — SEC-001, SEC-002, DATA-005, DATA-006 |
| Commercial | N/A — no commercial or external-service dependency |
| Product context (orientation) | [Product brief](../../../product/product-brief.md) and [Feature catalog](../../../product/feature-catalog.md) |
| Existing PRDs | [User Profiles](../../../prds/domains/user-profiles.md), [Dashboard](../../../prds/domains/dashboard.md), and [Workout Engine](../../../prds/domains/workout-engine.md) |

## Resolved questions

| Question | Resolution | Owner | Date |
| --- | --- | --- | --- |
| What does the target measure? | Distinct completed-workout days, limited to one through seven. | Keerthan K | 2026-09-21 |
| How does target five work? | Any five qualifying dates complete the week; multiple same-day workouts count once. | Keerthan K | 2026-09-21 |
| What does the streak measure? | Consecutive weeks that meet their applicable target, shown in weeks. | Keerthan K | 2026-09-21 |
| How is the current week treated? | Pending rather than failed; it joins when successful. | Keerthan K | 2026-09-21 |
| What happens after a target change? | The current week uses the new target; completed past weeks retain theirs. | Keerthan K | 2026-09-21 |
| Which boundary applies? | Monday-first in profile timezone, with UTC fallback. | Existing product convention | 2026-09-21 |
| Is a migration required? | Yes; additive target history plus normalization/backfill. | Keerthan K | 2026-09-21 |
| Which implementations change? | Fitwell web/backend and iOS, including demo mode. | Keerthan K | 2026-09-21 |

---

*Upstream review: Keerthan K — 2026-09-21*

*Scope: proposal*

*Teach-back: confirmed*
