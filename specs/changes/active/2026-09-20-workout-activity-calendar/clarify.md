---
id: change-2026-09-20-workout-activity-calendar
title: Workout activity calendar
status: proposed
authority: temporary
mode: full-sdd
phase: clarify
opened: 2026-09-20
affected_prds:
  - specs/prds/domains/user-profiles.md
  - specs/prds/domains/workout-engine.md
  - specs/prds/system-qualities.md
affected_sdds:
  - specs/engineering/features/user-profiles.md
  - specs/engineering/features/workout-engine.md
  - specs/engineering/architecture/authorization-model.md
  - specs/engineering/architecture/frontend-architecture.md
code:
  - src/pages/profile/index.tsx
  - src/components/profile/
  - src/pages/api/user/
  - src/utils/spec.ts
  - src/utils/types.ts
  - test cases/pages/profile/
  - test cases/components/profile/
  - test cases/pages/api/user/
---

# Clarify: Workout activity calendar

> **Phase:** Clarify — decision record before delta files. Do not draft `proposal.md`, `design.md`,
> `tasks.md`, or `verification.md` until the project owner completes **Human decisions** and signs
> **Lock it**.
>
> **Canonical guide:** [Engineering workflow](../../../handbook/engineering-workflow.md#1-clarify).

---

## Feature request (input)

Keerthan K requested a Full SDD plan on 2026-09-20:

> Show user activity in Profile or Dashboard in GitHub style. If the user did a workout on a day,
> show a green mark; otherwise leave the day as it is.

The request included a reference image of the GitHub-style contribution calendar on Workout Cool's
profile page.

## Restatement

FitWell will give a signed-in member an at-a-glance, calendar-style history of the days on which they
completed workouts. Qualifying days will have a visible green state and non-qualifying days will
remain neutral. The calendar will expose only the current member's workout history, use an explicit
and consistent day boundary, remain understandable without color, and handle loading, empty, error,
desktop, and mobile states. At the owner's direction, v1 places the calendar on the Profile page as
part of the member's personal history, alongside but visually separate from identity, preferences,
session actions, and destructive account actions.

**Human approval:** approved by Keerthan K on 2026-09-20

## Upstream audit

| Check | Result | Notes |
| --- | --- | --- |
| Specs read | complete | Dashboard, Workout Engine, User Profiles, Analytics, System Qualities, corresponding feature SDDs, Authorization Model, Data Lifecycle, and Verification Matrix |
| ADR alignment | pass | The recommended path stays in the Pages Router monolith, uses PostgreSQL/Prisma, and extends the existing shared browser API types/wrapper conventions under ADR-0001, ADR-0004, and ADR-0005. No new ADR is expected. |
| Compliance | pass | Owner-scoped reads must preserve SEC-001, SEC-002, and SEC-004. Accessible state must preserve A11Y-002 and A11Y-003. Date grouping must satisfy DATA-005. No external service or sensitive data is introduced. |
| Blast radius (`code` in frontmatter) | cross-domain read/presentation | Profile page/components plus an owner-scoped workout-activity read contract, shared browser types/wrapper, and focused API/page/component tests. The recommended v1 requires no schema migration and no workout mutation. |
| Blocking questions | none | Placement, qualifying workout semantics, displayed range/week layout, and date boundary are approved below. |

### Evidence and constraints

- [Dashboard PRD](../../../prds/domains/dashboard.md) already owns weekly progress, streak, lifetime
  completed-workout totals, recent workouts, and page states. The owner nevertheless selected
  Profile for this feature, so the calendar must not silently alter Dashboard behavior.
- [Dashboard SDD](../../../engineering/features/dashboard.md) and
  [`summary.ts`](../../../../src/pages/api/dashboard/summary.ts) already aggregate all owner-scoped
  `COMPLETED` workouts. Current weekly grouping uses the server's local Monday boundary while streak
  grouping uses UTC date keys; the SDD explicitly identifies this inconsistency as a gap.
- [User Profiles PRD](../../../prds/domains/user-profiles.md) and
  [User Profiles SDD](../../../engineering/features/user-profiles.md) currently keep `/profile`
  focused on profile data, preferences, sign-out, and account deletion. The owner's placement choice
  intentionally broadens the Profile contract to include a read-only personal workout-history
  visualization. Design must keep this content separate from the destructive account section.
- [Workout Engine PRD](../../../prds/domains/workout-engine.md) defines owned history and the
  `COMPLETED` lifecycle state. Draft and in-progress records do not prove that the member did a
  completed workout.
- `UserActivityDay` and [`activity.ts`](../../../../src/lib/analytics/activity.ts) record best-effort
  authenticated application requests. They do **not** record completed workouts and must not drive
  the workout calendar. This distinction prevents ordinary app visits from becoming green workout
  days.
- `UserProfile.timezone` and `dateKeyInTimezone` provide an existing route to member-local date
  grouping, with UTC as the no-profile fallback. Current workout date semantics need to be made
  explicit in Design after the owner locks the product meaning below.
- No relevant live Firebase, Vercel, or hosted PostgreSQL state was inspected or needed for Clarify.
  Existing representative data and production volume remain unknown; performance must be verified
  against a bounded query/response rather than inferred.

## Open questions

| Question | Status | Resolution / owner | Date |
| --- | --- | --- | --- |
| Where does v1 render the calendar? | resolved | Profile page only — Keerthan K. | 2026-09-20 |
| What counts as “did a workout”? | resolved | At least one owned workout whose status is `COMPLETED`; drafts and in-progress workouts do not qualify, and multiple completions on one day still produce one binary green day — Keerthan K. | 2026-09-20 |
| What period and week layout does v1 show? | resolved | A rolling 53-week calendar ending with the current week, Monday-first to align with FitWell's existing weekly-progress convention; future days remain neutral and unavailable — Keerthan K. | 2026-09-20 |
| Which date defines the green day? | resolved | The member's recorded `workoutDate`, grouped using the profile timezone with UTC fallback, so past-workout entry appears on the day trained rather than the day later entered/completed — Keerthan K. | 2026-09-20 |

## Options

| Option | Product impact | Engineering cost | Risk | Recommendation |
| --- | --- | --- | --- | --- |
| Dashboard-only, binary calendar from completed workouts | Puts habit history beside weekly progress, streak, totals, and recent workouts; one green state answers the request directly | Medium: extend the existing summary contract and add a responsive accessible component | Existing dashboard query currently loads all completed workouts; Design must bound or reshape the query without changing existing totals | Not chosen |
| Profile-only calendar | Mirrors the supplied reference and makes activity part of the member-facing profile | Medium: add an owner-scoped workout-activity read to a page currently loading only profile data | Broadens Profile beyond identity/preferences, so layout and failure isolation must remain explicit | **Chosen by owner for v1** |
| Calendar on both Dashboard and Profile | Maximum discoverability | High: shared component plus two data-flow/page contracts and duplicated responsive placement | Wider blast radius, duplicate loading, and inconsistent states without additional product value | Defer unless the owner explicitly requires both |
| Intensity levels based on workout count or duration | More closely resembles GitHub contribution intensity | Medium to high: aggregation, legend, thresholds, and more product decisions | Goes beyond the binary green/neutral request and may imply unsupported training-quality meaning | Defer to v2 |

**Chosen approach:** approved — Profile-only placement with one binary green state for member-local
recorded dates containing one or more completed workouts, across a rolling 53-week Monday-first view.

## v1 scope

Subject to Lock approval, the smallest shippable v1 is:

1. Add one GitHub-style workout activity calendar to the signed-in Profile page, outside the Delete
   account tab/section and without changing Dashboard behavior.
2. Show a binary green state for each member-local recorded date containing at least one owned
   `COMPLETED` workout; leave all other in-range days neutral.
3. Show a rolling 53-week range ending with the current week, using a Monday-first layout consistent
   with existing Dashboard weekly progress.
4. Make each day understandable without color through an accessible label or equivalent text that
   includes the date and whether a workout was completed. Include a visible legend and keyboard/
   assistive-technology semantics appropriate to the final interaction design.
5. Provide responsive desktop and mobile layouts plus loading, empty, retryable-error, current-day,
   future-day, year-boundary, leap-day, and timezone-boundary behavior.
6. Preserve owner scoping on the server and return only the minimum day-level data required by the
   current member. Do not expose another member's workouts or raw `UserActivityDay` records.
7. Add table-driven timezone/date aggregation tests, owner-scoped API tests, and component tests for
   green/neutral, empty/error, accessibility, and responsive behavior.

## Non-goals and v2

### Non-goals (not in this change)

- Public or shareable profiles, social activity, leaderboards, comparison with other members, or
  administrator access to a member calendar.
- Recording page visits, sign-ins, drafts, or in-progress workouts as workout days.
- Changing workout completion, workout-date editing, streak rules beyond the consistency needed for
  the approved calendar, or workout storage/lifecycle.
- A database migration, materialized aggregate, background job, external analytics service, or use of
  `UserActivityDay` for workout completion.
- Exact visual copying of Workout Cool or GitHub branding, assets, or proprietary implementation.
- Calendar filters, custom date ranges, click-through day details, annotations, goals, or streak
  rewards.

### v2 (separate feature request later)

- Optional reuse on Dashboard after validating Profile usage.
- Multiple green intensity levels based on number of workouts, duration, or another explicitly defined
  measure.
- Range navigation, year selection, day-detail drill-down, and shareable/public activity.

## PRD change decision

- [x] **PRD delta required** — User Profiles needs a new stable observable outcome; System Qualities
  may need a calendar-specific non-color/time-boundary outcome, while Workout Engine remains the
  source domain for qualifying completed history.
- [ ] **No PRD change** — not recommended because no current requirement promises a calendar view.

**Human confirmation:** PRD delta approved — Keerthan K, 2026-09-20

## Accepted tradeoffs

N/A so far. The original request explicitly allowed Profile or Dashboard, and the owner selected
Profile. Binary intensity, date range, and date semantics are accepted as the v1 boundary; richer
intensity and navigation remain v2.

| Original ask | What v1 ships instead | Why acceptable | Agreed by | Date |
| --- | --- | --- | --- | --- |
| N/A | Profile-only placement is within the original ask | No product promise has been reduced by the placement decision | Keerthan K | 2026-09-20 |

---

## Human decisions (required before Propose)

Complete every applicable item. **Propose must not start** until all are checked and signed.

- [x] **Restatement** — outcome matches what the requester asked for, or the adjustment is documented.
- [x] **Upstream audit** — compliance passes or HALT is escalated; ADR conflicts are resolved or a superseding ADR is planned.
- [x] **Open questions** — no unresolved blocking questions; deferrals have an owner and date.
- [x] **Approach** — an option is chosen, or the single recommended path is accepted.
- [x] **v1 scope** — the shippable slice is approved.
- [x] **Non-goals / v2** — deferred work is explicit; nothing is smuggled into v1.
- [x] **PRD change** — PRD delta versus **No PRD change** is confirmed.
- [x] **Tradeoffs** — engineering + product sign-off exists when the product promise changed.

**Lock it — sign-off**

```text
Clarify approved: Keerthan K — 2026-09-20
Propose may begin.
```
