---
id: change-2026-09-21-weekly-workout-days-and-streak
title: Weekly workout days and goal streak
status: approved
authority: temporary
mode: full-sdd
phase: clarify
opened: 2026-09-21
affected_prds:
  - specs/prds/domains/user-profiles.md
  - specs/prds/domains/dashboard.md
  - specs/prds/system-qualities.md
affected_sdds:
  - specs/engineering/features/user-profiles.md
  - specs/engineering/features/dashboard.md
  - specs/engineering/features/onboarding.md
code:
  - prisma/schema.prisma
  - prisma/migrations/
  - src/components/profile/ProfileForm.tsx
  - src/pages/profile/index.tsx
  - src/lib/api/validators/profile.ts
  - src/pages/api/user/
  - src/lib/workouts/
  - src/pages/api/dashboard/summary.ts
  - src/components/dashboard/DashboardContent.tsx
  - src/utils/types.ts
  - test cases/
  - /Users/keerthank/Documents/ChatGPT/IOS app/FitWell/
  - /Users/keerthank/Documents/ChatGPT/IOS app/Tests/
---

# Clarify: Weekly workout days and goal streak

> **Phase:** Clarify — decision record before delta files. Do not draft `proposal.md`, `design.md`,
> `tasks.md`, or `verification.md` until the project owner completes **Human decisions** and signs
> **Lock it**.
>
> **Canonical guide:** [Engineering workflow](../../../handbook/engineering-workflow.md#1-clarify).

---

## Feature request (input)

Keerthan K requested on 2026-09-21 that onboarding ask how many **days** the member wants to work
out each week rather than how many workouts they want per week. The request asked how a streak should
work for a member whose target is five and required the Fitwell web/backend repository at
`/Users/keerthank/Personal Project/fitwell` and the iOS app to stay synchronized.

Keerthan K approved these follow-up decisions:

- count distinct workout days rather than workout records;
- any five different qualifying days complete a five-day weekly target;
- multiple workouts on one date count as one workout day;
- count a streak in consecutive successful weeks;
- an unfinished current week does not break the preceding streak;
- display the streak in weeks; and
- if the member changes their target, completed past weeks retain the target that applied then.

## Restatement

Fitwell will store a one-through-seven weekly workout-day target, ask “How many days do you want to
work out each week?”, and use day-based language in profile and dashboard surfaces. Weekly progress
will count distinct dates with completed workouts. The Dashboard streak will count consecutive
Monday-through-Sunday weeks that met the target effective during each week, using the member's
profile timezone with UTC fallback. The current week becomes successful immediately on reaching its
target and remains pending rather than failed while unfinished. Target changes apply to the current
in-progress week but do not rewrite completed past-week targets. Web/backend and iOS, including iOS
demo mode, will use the same rules.

**Human approval:** approved and revised by Keerthan K on 2026-09-21.

## Upstream audit

| Check | Result | Notes |
| --- | --- | --- |
| Specs read | complete | User Profiles, Dashboard, and System Qualities PRDs; User Profiles, Dashboard, and Onboarding SDDs; data-model and verification guidance |
| ADR alignment | pass | The change remains in the Pages Router/Prisma monolith and existing Swift client. No new service or durable technology choice is introduced. |
| Compliance | pass | Owner-scoped completed workouts remain the only activity input. Profile-timezone grouping resolves the documented server/UTC inconsistency and preserves DATA-005. Target-history writes must be transactional under DATA-006. |
| Blast radius (`code` in frontmatter) | cross-domain behavior and migration | Profile copy/validation, target history, dashboard aggregation/API/presentation, tests, specifications, and iOS live/demo behavior change together. |
| Blocking questions | none | Target unit/range, qualifying activity, streak unit, current-week behavior, historical target behavior, week boundary, migration, and client scope are resolved. |

### Evidence and constraints

- Current profile validation permits 1–14 and UI copy says “workouts per week.” A weekly day target
  must be limited to 1–7.
- Current Dashboard progress counts workout records, and current streak counts consecutive UTC dates
  independently of the target.
- Profile workout activity already defines a qualifying day as an owned `COMPLETED` workout grouped
  by recorded `workoutDate` in profile timezone, with UTC fallback.
- The current schema retains only the latest target. Preserving the target applicable to completed
  weeks requires additive target-history storage and a backfill.
- Historical target changes made before this migration cannot be reconstructed. The migration must
  establish the existing normalized target as the best-known baseline from profile creation.
- Hosted database contents are unknown. Migration verification must use authorized target-environment
  access rather than assuming local state matches deployment state.

## Open questions

| Question | Status | Resolution / owner | Date |
| --- | --- | --- | --- |
| What does the weekly target measure? | resolved | Distinct dates containing at least one completed workout, not workout records — Keerthan K. | 2026-09-21 |
| What range may the member select? | resolved | One through seven workout days per week — approved day-based concept. | 2026-09-21 |
| How does a target of five affect streak? | resolved | Any five qualifying dates complete that week; consecutive successful weeks form the streak — Keerthan K. | 2026-09-21 |
| Does an unfinished current week break the streak? | resolved | No; it joins after success and can break the chain only after ending below target — Keerthan K. | 2026-09-21 |
| What happens after a target change? | resolved | The current in-progress week adopts the new target; completed past weeks retain their historical target — Keerthan K. | 2026-09-21 |
| What are the date boundaries? | resolved | Monday through Sunday in profile timezone, with UTC fallback, matching the existing activity-calendar convention. | 2026-09-21 |
| Is a database migration required? | resolved | Yes; add owner-scoped target history, normalize legacy current values to 1–7, and backfill the best-known baseline. | 2026-09-21 |
| Which clients must change? | resolved | Fitwell web/backend and iOS, including iOS demo behavior — Keerthan K. | 2026-09-21 |

## Options

| Option | Product impact | Engineering cost | Risk | Recommendation |
| --- | --- | --- | --- | --- |
| Keep consecutive workout-day streak | Planned rest days break streaks and the weekly target remains unrelated | Low | Preserves the reported mismatch | Not chosen |
| Weekly streak using only the latest target | Simple weekly behavior, but changing a target rewrites prior achievement | Medium | Historical streak can inflate or disappear unexpectedly | Not chosen |
| Weekly streak with effective target history | Weekly goal and streak align while completed weeks retain their meaning | Higher: additive model, migration, transactional writes, shared aggregation | Requires an honest one-time baseline for unknowable pre-migration changes | **Chosen by owner** |
| Named-day schedule adherence | Distinguishes specific planned training/rest days | High: schedule UI/data and more states | Exceeds the request | Defer to v2 |

**Chosen approach:** approved — effective target history plus a weekly-goal streak based on distinct
completed-workout dates, with an unfinished current week pending rather than failed.

## v1 scope

1. Ask “How many days do you want to work out each week?” and use day-based wording everywhere the
   preference is presented.
2. Validate the current preference as an integer from 1 through 7 in web/backend and iOS UI.
3. Persist effective target changes and cascade their deletion with the owning profile.
4. Backfill existing profiles with a normalized best-known baseline without losing profiles/workouts.
5. Count distinct member-local completed-workout dates toward current weekly progress.
6. Calculate consecutive successful Monday-through-Sunday weeks against the target applicable to
   each week, with the approved current-week rule.
7. Present the streak as weeks and update the private Dashboard response contract consistently in web
   and iOS.
8. Add migration, validator, aggregation, API, copy/contract, and iOS demo/core tests.
9. Synchronize affected canonical PRDs, SDDs, data docs, and the iOS schema copy.

## Non-goals and v2

### Non-goals (not in this change)

- Choosing named workout weekdays, rescheduling, grace days, streak freezes, rewards, badges,
  notifications, or social streaks.
- Counting drafts, in-progress workouts, app activity, sets, duration, or multiple same-day workouts
  as extra workout days.
- Changing workout-plan `daysPerWeek`.
- Renaming the existing profile JSON/property key in v1; it remains a compatibility name whose value
  now means workout days.
- Completing or presenting the separate Analytics streak contract.

### v2 (separate feature request later)

- Named training/rest-day schedules and adherence.
- Grace periods, freezes, recovery rules, reminders, and rewards.
- A compatibility-planned rename of the profile storage/API field.
- Analytics reuse after its incomplete response/UI is separately resolved.

## PRD change decision

- [x] **PRD delta required** — PROFILE-002/003 and DASH-002/003 change observable meanings and
  limits; DATA-005/006 govern the shared time interpretation and target-history mutation.
- [ ] **No PRD change** — not applicable.

**Human confirmation:** PRD delta approved as part of the requested product change — Keerthan K,
2026-09-21.

## Accepted tradeoffs

| Original ask | What v1 ships instead | Why acceptable | Agreed by | Date |
| --- | --- | --- | --- | --- |
| Preserve the target that applied to completed past weeks | Pre-migration target changes cannot be reconstructed; the current normalized target is backfilled as the baseline from profile creation | No historical target records exist to recover; forward history is exact after migration | Keerthan K | 2026-09-21 |
| Use day-based language | Retain internal profile key `weeklyWorkoutTarget` for compatibility | Avoids an additional breaking profile-contract rename while all user-visible language and meaning change | Keerthan K | 2026-09-21 |

---

## Human decisions (required before Propose)

- [x] **Restatement** — outcome matches the revised request.
- [x] **Upstream audit** — compliance passes and no ADR conflict exists.
- [x] **Open questions** — no unresolved blocking questions remain.
- [x] **Approach** — weekly target history and goal streak are accepted.
- [x] **v1 scope** — web/backend, database, and iOS are included.
- [x] **Non-goals / v2** — schedule selection and reward mechanics remain separate.
- [x] **PRD change** — changed binding outcomes require canonical PRD updates.
- [x] **Tradeoffs** — the best-known legacy baseline limitation is accepted.

**Lock it — sign-off**

```text
Clarify approved: Keerthan K — 2026-09-21
Propose may begin.
```
