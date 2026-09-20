---
id: change-2026-09-20-workout-activity-calendar
title: Workout activity calendar
status: approved
authority: temporary
mode: full-sdd
phase: proposal
opened: 2026-09-20
affected_prds:
  - specs/prds/domains/user-profiles.md
  - specs/prds/system-qualities.md
affected_sdds:
  - specs/engineering/features/user-profiles.md
  - specs/engineering/features/workout-engine.md
  - specs/engineering/architecture/authorization-model.md
  - specs/engineering/architecture/frontend-architecture.md
affected_decisions: []
---

# Proposal: Workout activity calendar

> **Layer:** *what* — intent, scope, and **PRD delta**. Do not edit canonical PRDs until
> Verification/Archive synchronization.
>
> **Policy:** `proposal.md` records *what*. A later reviewed `design.md` records *how*, and a later
> reviewed `tasks.md` records atomic Apply steps. No implementation is authorized by this draft.
>
> **Prerequisite:** [Clarify](clarify.md) was approved by Keerthan K on 2026-09-20.

---

## Intent and scope

Give a signed-in member a GitHub-style, at-a-glance view of their workout consistency on Profile.
The first version shows a rolling 53-week, Monday-first calendar ending with the current week. A day
has one green workout state when the member has at least one completed workout recorded for that day;
otherwise it remains neutral. The feature is private to the current member, uses the member's profile
timezone with UTC fallback, remains understandable without color, and supports loading, empty,
retryable-error, desktop, and mobile states.

Profile placement is deliberate. The calendar is personal history, not a change to Dashboard,
workout creation, workout completion, account deletion, or application-activity tracking.

## Non-goals

- Rendering the calendar on Dashboard or on both Profile and Dashboard.
- Public or shareable profiles, social feeds, leaderboards, member comparison, or administrator
  access to a member calendar.
- Treating sign-ins, page/API activity, draft workouts, or in-progress workouts as workout days.
- Multiple intensity levels, counts/duration encoded by color, custom ranges, range navigation, year
  selection, day-detail drill-down, annotations, goals, or streak rewards.
- Changing workout lifecycle, completion rules, workout-date editing, Dashboard streak behavior, or
  historical workout data.
- Introducing a new persistent aggregate, migration, backfill, background job, or external analytics
  service.
- Copying Workout Cool/GitHub branding, assets, or proprietary implementation.

## Iteration plan

### v1 (this change)

1. Present one workout activity calendar in the signed-in member's Profile experience, separate from
   destructive account actions.
2. Cover a rolling 53-week period ending with the current week, with Monday as the first day of each
   week and future days neutral and unavailable.
3. Mark a date green when at least one workout owned by the member is completed and its recorded
   workout date falls on that date in the member's profile timezone; use UTC when no profile timezone
   is available.
4. Keep the result binary: multiple completed workouts on the same date still produce one green day;
   non-qualifying dates remain neutral.
5. Communicate each date and workout/no-workout state without relying on color alone and retain usable
   loading, empty, retryable-error, desktop, mobile, keyboard, touch, and assistive-technology states.
6. Preserve private member ownership and return no other member's workout activity.

### v2 (after user feedback — separate feature request)

- Optional reuse on Dashboard.
- Multiple intensity levels based on an explicitly approved measure.
- Range navigation, year selection, day-detail drill-down, annotations, goals, streak rewards, and
  public/shareable activity.

## Upstream audit

| Check | Result | Notes |
| --- | --- | --- |
| Specs read | complete | [Clarify](clarify.md), [User Profiles PRD](../../../prds/domains/user-profiles.md), [Workout Engine PRD](../../../prds/domains/workout-engine.md), [System Qualities](../../../prds/system-qualities.md), corresponding feature SDDs, Dashboard/Analytics context, Authorization Model, Data Lifecycle, and Verification Matrix |
| ADR alignment | pass | The outcome requires no new durable technology choice. ADR-0001, ADR-0004, and ADR-0005 remain applicable to later Design. |
| Compliance | pass | Existing SEC-001, SEC-002, SEC-004, DATA-005, A11Y-002, and A11Y-003 govern authentication, ownership, date interpretation, visible request states, and non-color status. |
| Blocking questions | none | Placement, qualifying status, range/week layout, binary state, recorded-date semantics, timezone, and v1/v2 boundary were approved in Clarify. |

## PRD delta

The following requirements are proposed for the canonical
[User Profiles PRD](../../../prds/domains/user-profiles.md). Existing System Qualities continue to
govern security, data, accessibility, and responsiveness; no duplicate System Quality requirement is
proposed.

### PROFILE-010 — Workout activity calendar

The signed-in member's Profile must show a rolling 53-week workout activity calendar ending with the
current week and using Monday as the first day of each week. The calendar must keep future dates
neutral and unavailable and must remain usable on supported desktop and mobile layouts.

### PROFILE-011 — Qualifying workout day

For each in-range date, the calendar must show one green workout state when the member owns at least
one completed workout whose recorded workout date falls on that date in the member's profile
timezone. If no profile timezone is available, the calendar must use UTC. Draft and in-progress
workouts must not qualify, multiple completed workouts on one date must not create additional
intensity, and another member's workouts must not affect the calendar.

### PROFILE-012 — Activity calendar states

The workout activity calendar must communicate each date and its workout/no-workout state without
relying on color alone. It must provide meaningful loading and empty states and a retryable failure
state without turning unavailable activity data into a successful no-workout result.

## Acceptance examples

These examples clarify the requirements without adding scope:

- A member with one completed workout and one draft recorded on the same member-local date sees one
  green day for that date.
- A member with two completed workouts recorded on the same member-local date still sees one green
  day; v1 has no darker intensity.
- A quick-entry workout completed today but recorded for an earlier in-range date marks the recorded
  workout date, not today's completion timestamp.
- A draft or in-progress workout recorded on an otherwise empty date leaves that date neutral.
- A completed workout owned by another member never changes the signed-in member's calendar.
- When no profile/timezone exists, date grouping uses UTC and the Profile's existing incomplete-
  profile outcome remains intact.
- When activity loading fails, Profile shows a retryable activity error rather than presenting every
  day as a valid neutral result; existing profile/session/account actions remain governed by their
  current requirements.

## Upstream links

| Kind | Link |
| --- | --- |
| Compliance | [System Qualities](../../../prds/system-qualities.md) — SEC-001, SEC-002, SEC-004, DATA-005, A11Y-002, A11Y-003 |
| Commercial | N/A — no billing, subscription, advertising, or third-party commercial dependency |
| Product context (orientation) | [Product brief](../../../product/product-brief.md) and [Feature catalog](../../../product/feature-catalog.md) |
| Existing PRDs | [User Profiles](../../../prds/domains/user-profiles.md), [Workout Engine](../../../prds/domains/workout-engine.md), and [Dashboard](../../../prds/domains/dashboard.md) for the unchanged dashboard boundary |

## Resolved questions

| Question | Resolution | Owner | Date |
| --- | --- | --- | --- |
| Where does v1 render the calendar? | Profile only, separate from destructive account actions; Dashboard does not change. | Keerthan K | 2026-09-20 |
| What counts as “did a workout”? | At least one owned completed workout. Draft and in-progress workouts do not qualify; multiple completions on one date remain one binary green day. | Keerthan K | 2026-09-20 |
| What period and week layout does v1 show? | Rolling 53 weeks ending with the current week, Monday-first; future days are neutral and unavailable. | Keerthan K | 2026-09-20 |
| Which date defines the green day? | The recorded workout date grouped in the profile timezone, with UTC fallback. | Keerthan K | 2026-09-20 |
| Does v1 use application activity records? | No. App activity and workout completion are separate concepts. | Keerthan K | 2026-09-20 |
| Does v1 add intensity, navigation, drill-down, or sharing? | No. Those are non-goals or separate v2 requests. | Keerthan K | 2026-09-20 |

---

*Upstream review: Keerthan K — 2026-09-20*

*Scope: proposal*

*Teach-back: confirmed*
