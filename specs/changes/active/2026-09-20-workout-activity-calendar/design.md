---
id: change-2026-09-20-workout-activity-calendar
title: Workout activity calendar
status: approved
authority: temporary
mode: full-sdd
phase: design
opened: 2026-09-20
requirements:
  - PROFILE-010
  - PROFILE-011
  - PROFILE-012
  - SEC-001
  - SEC-002
  - SEC-004
  - DATA-005
  - A11Y-001
  - A11Y-002
  - A11Y-003
decisions:
  - ADR-0001
  - ADR-0004
  - ADR-0005
code:
  - src/pages/profile/index.tsx
  - src/components/profile/WorkoutActivityCalendar.tsx
  - src/pages/api/user/workout-activity.ts
  - src/lib/workouts/activityCalendar.ts
  - src/utils/spec.ts
  - src/utils/types.ts
tests:
  - test cases/lib/workouts/activityCalendar.test.ts
  - test cases/pages/api/user/workout-activity.test.ts
  - test cases/components/profile/WorkoutActivityCalendar.test.tsx
  - test cases/pages/profile/index.test.tsx
---

# Design: Workout activity calendar

> **Layer:** *how* — SDD / technical-specification delta for the current stack. Do not edit
> canonical technical specifications until Verification/Archive synchronization.
>
> **Depends on:** [Clarify](clarify.md), approved 2026-09-20, and
> [Proposal](proposal.md), reviewed 2026-09-20. This document defines policy and boundaries rather
> than implementation pseudo-code.

---

## SDD delta

### Server contract and authority

**DES-001 — Dedicated authenticated read.** `GET /api/user/workout-activity` must be the Profile
calendar's server boundary. It must accept only GET, call `getUserIdOrSetError`, derive the owner from
the verified identity, and accept no client-supplied user ID, timezone, range, or status authority.

**DES-002 — Minimal response.** A successful response must match `WorkoutActivityCalendarResponse`
in `src/utils/types.ts`:

- `timezone`: the effective IANA timezone used for grouping;
- `startDate`: the first displayed date as `YYYY-MM-DD`;
- `endDate`: the last displayed date as `YYYY-MM-DD`;
- `todayDate`: the effective current date as `YYYY-MM-DD`; and
- `completedDates`: sorted, unique `YYYY-MM-DD` keys for qualifying dates in the range through today.

The response must not expose workout IDs, names, notes, exercise/set data, timestamps, counts,
`UserActivityDay` data, or another member's data. An authenticated zero-workout result is a 200
response with an empty `completedDates` array, not an error.

**DES-003 — Calendar range.** `src/lib/workouts/activityCalendar.ts` must own pure date-key and range
logic. Given a clock instant and effective timezone, it must calculate the member-local `todayDate`,
the Monday starting the current week, `startDate` as the Monday 52 weeks earlier, and `endDate` as the
Sunday ending the current week. The inclusive range therefore contains exactly 53 Monday-first weeks
and 371 visual day cells. Dates after `todayDate` remain part of the current-week layout but are
unavailable and never appear in `completedDates`.

**DES-004 — Timezone behavior.** The handler must load only the current member's profile timezone.
When the profile or timezone is unavailable, or the stored timezone cannot be used by
`Intl.DateTimeFormat`, the effective timezone must be `UTC`. Date-only keys must use calendar
arithmetic that cannot be shifted by the browser's local timezone or by parsing `YYYY-MM-DD` as a
local instant.

**DES-005 — Bounded owner query.** The handler must read `Workout.workoutDate` only for rows matching
the authenticated `userId`, `status: COMPLETED`, and a UTC interval padded around the 53-week local
date range. The padding may over-fetch boundary instants but the final date-key filter must admit only
keys from `startDate` through `todayDate`. The existing `(userId, workoutDate, status)` index remains
the persistence path; no schema, migration, aggregate, or backfill is introduced.

**DES-006 — Qualifying-date aggregation.** Each selected `workoutDate` must be converted to a date key
in the effective timezone. The response must deduplicate equal keys, sort them ascending, exclude
out-of-range and future keys, and apply no count or duration intensity. Drafts, in-progress workouts,
application activity, and foreign-owned workouts must not qualify.

**DES-007 — Aggregation separation.** The calendar handler and aggregation helper must not directly
read, create, or update `UserActivityDay`, and must not mutate `Workout`, `UserProfile`, or another
domain row. The existing `getUserIdOrSetError` helper may continue its independent best-effort
authenticated-application-activity write; that pre-existing authentication side effect is not a
calendar source and must never be read or interpreted as workout completion.

**DES-008 — Error contract.** Wrong methods use the shared 405 behavior; missing/invalid sessions and
disabled/deleted local accounts use the existing authentication responses. Unexpected profile,
workout, timezone, or serialization failures must return a generic 500 response without a successful
empty calendar or internal details. Calendar aggregation has no domain mutation, retry side effect,
or partial data response; the pre-existing best-effort authentication-activity side effect remains
independently governed.

### Browser contract and Profile composition

**DES-009 — Shared client boundary.** `src/utils/spec.ts` must expose a typed
`getWorkoutActivity()` Axios wrapper that returns `WorkoutActivityCalendarResponse`. The Profile page
must not issue component-local Axios/fetch calls or construct a client-supplied identity/range.

**DES-010 — Independent Profile state.** `/profile` must load profile data and workout activity as
independent read states. Activity loading/failure must not hide loaded profile details, edit/sign-out
actions, the incomplete-profile action, or the Delete account tab. Profile loading/failure must not
turn successful activity data into an error. The activity failure state must offer an activity-only
retry and must not render failure as an empty calendar.

**DES-011 — Placement.** `WorkoutActivityCalendar` must render in the Profile tab after the member
profile/incomplete-profile area and before the Session area. It must never render in the Delete
account tab, Dashboard, public pages, or administrator pages. The component is read-only and has no
workout creation, completion, editing, deletion, or drill-down action.

**DES-012 — Visual calendar.** The component must render 53 week columns and seven Monday-first day
rows from the server-provided date keys. It must show month context, a visible binary legend, neutral
non-workout/future cells, and the FitWell success/green treatment for qualifying dates. Qualifying
cells must also have a non-color visual indicator such as an inset mark; multiple workouts must not
change the cell treatment. Client rendering must not recompute which workout dates qualify.

**DES-013 — Accessible semantics.** The calendar must have a programmatic name and heading. Every
in-range day must expose an accessible date plus one of `workout completed`, `no completed workout`,
or `future date unavailable`. The legend and per-cell indicator must make state understandable
without color. Because v1 cells have no action, they must not masquerade as buttons or add 371 tab
stops; screen-reader virtual navigation must expose the date/state, while normal keyboard navigation
continues to the retry/profile/session controls. Loading and retryable failure changes must be
announced using existing accessible status/alert patterns.

**DES-014 — Responsive behavior.** At narrow widths the calendar surface may scroll horizontally,
must default to the most recent weeks, and must contain overflow so the Profile page and application
shell do not scroll horizontally. Day targets, labels, legend, activity heading, profile controls,
and Delete account tab must remain usable at supported mobile width, 200% zoom, light mode, and dark
mode. Desktop may show the full grid when space permits.

**DES-015 — Stable date rendering.** The client must treat response dates as date-only keys. It must
format labels without converting those keys through a local `Date` parse that can move the displayed
day. `todayDate` determines current/future presentation; the browser clock or timezone must not
reclassify server-provided cells after the response arrives.

### Failure, compatibility, and documentation

**DES-016 — Compatibility.** Existing Profile view/edit, onboarding, sign-out, and account-deletion
behavior must remain unchanged. Dashboard summary, analytics, workout lifecycle, workout-date update,
and `UserActivityDay` behavior are outside this code path and must not be modified to implement the
calendar.

**DES-017 — Observability and disclosure.** User-facing errors must remain generic and must not
include workout data, Firebase details, database details, or stack traces. No new application log,
metric, analytics event, vendor, secret, or environment variable is required. Verification records
test/manual evidence rather than personal workout contents.

**DES-018 — Canonical synchronization.** After implementation and review, Verification must update
the User Profiles PRD/SDD, Frontend Architecture, API Endpoint Catalog, Authorization Model code/test
maps where applicable, and Product Feature Catalog. It must record explicit no-change results for
Workout Engine behavior, Dashboard, Analytics, Data Lifecycle, schema/migrations, ADRs, integrations,
and operations where their current contracts remain unchanged.

## Data flow

1. The Profile page requests profile data and workout activity through separate shared wrappers.
2. The activity handler authenticates the request and obtains the verified UID.
3. The handler resolves the caller's profile timezone, falling back to UTC when unavailable/invalid.
4. The calendar helper derives the fixed 53-week date-key range from the server clock and timezone.
5. Prisma selects only `workoutDate` for owner-scoped completed workouts in a padded UTC interval.
6. The helper converts selected instants to member-local keys, filters, deduplicates, and sorts them.
7. The handler returns the minimal response and performs no calendar-domain write; the authentication
   helper's existing best-effort application-activity side effect remains independent.
8. Profile renders the fixed date-key grid and server-qualified dates. Retry repeats only the activity
   read; existing profile and account state remain available.

## Error outcomes

| Condition | Required behavior |
| --- | --- |
| Non-GET request | Shared 405 response; no profile/workout query |
| Missing, invalid, disabled, or deleted member identity | Existing auth/account response; no workout data |
| No profile or timezone | Use UTC; return a valid calendar response |
| Invalid stored timezone | Use UTC; do not expose the stored value as an internal error |
| No qualifying completed workouts | 200 with the full range metadata and `completedDates: []` |
| Database or unexpected server failure | Generic 500; no successful empty response and no internal details |
| Browser request failure | Activity-only alert with Retry; retain other Profile/account controls |
| Retry succeeds | Replace the activity error with the returned calendar without reloading/mutating profile data |

## Boundaries

| Area | Paths / identifiers |
| --- | --- |
| Profile UI | `src/pages/profile/index.tsx`; new `src/components/profile/WorkoutActivityCalendar.tsx` |
| API / pure logic | New `GET /api/user/workout-activity`; new `src/lib/workouts/activityCalendar.ts` |
| Shared client contract | `WorkoutActivityCalendarResponse` in `src/utils/types.ts`; `getWorkoutActivity` in `src/utils/spec.ts` |
| Data | Read-only `UserProfile.timezone` and `Workout.workoutDate/status/userId`; existing index; explicitly not `UserActivityDay` |
| Authentication / authorization | `getUserIdOrSetError`; verified UID in every workout predicate; no client user ID |
| Tenants / tiers | Current authenticated member only; no public, cross-member, administrator, subscription, or entitlement variant |
| Unchanged domains | Dashboard, Analytics, workout lifecycle/mutations, account deletion, app-activity collection, Prisma schema/migrations |

## ADR alignment

- [ADR-0001](../../../engineering/decisions/0001-nextjs-pages-router-monolith.md) remains governing: the
  Profile page, component, handler, types, and helper stay in the Pages Router monolith.
- [ADR-0004](../../../engineering/decisions/0004-postgresql-prisma.md) remains governing: the handler
  imports the shared Prisma client and reads existing PostgreSQL records; there is no second client or
  new persistence model.
- [ADR-0005](../../../engineering/decisions/0005-shared-axios-browser-client.md) remains governing:
  the browser calls the route through `src/utils/spec.ts` and uses `src/utils/types.ts`.
- No accepted decision is superseded and no new durable architecture choice requires an ADR.

## Operations

| Concern | Link or N/A |
| --- | --- |
| Vendors | N/A — no external service, remote asset, SDK, credential, or third-party data flow |
| Data / migration | N/A — bounded calendar read of existing profile/workout fields; no calendar-domain schema, migration, seed, backfill, or write. Existing authentication-activity recording is unchanged. |
| Deployment / flags | Same application release under the [deployment runbook](../../../engineering/operations/deployment-runbook.md); no flag, variable, or console change |
| Recovery | Revert/roll forward the application revision; no stored representation or user record needs reversal. External deployment rollback remains unverified per the [recovery runbook](../../../engineering/operations/recovery-runbook.md). |

### Rollout and stop conditions

- Ship handler, helper, wrapper/type, Profile UI, tests, and synchronized canonical documentation in
  the same application revision.
- No feature flag or dual-read period is justified because the feature's calendar aggregation is
  additive and read-only.
- Run focused Red/Green evidence, lint, typecheck, relevant/full tests, production build, and manual
  authenticated Profile checks at desktop/mobile widths, 200% zoom, light/dark modes, keyboard, and
  screen-reader semantics.
- Stop release if a foreign, draft, in-progress, app-activity, out-of-range, or future date can become
  green; if date keys move with the browser timezone; if an activity failure appears as successful
  emptiness; if Profile/account controls become unavailable; or if page-level horizontal overflow is
  introduced.

## Risks and mitigations

| Risk | Likelihood / impact | Prevention | Detection | Recovery |
| --- | --- | --- | --- | --- |
| Cross-user activity disclosure | Low / Critical | Verified UID is the only owner authority and is included in the workout predicate | Handler negative test with foreign rows/predicate assertion; signed-out manual check | Block release and revert/roll forward |
| Wrong day near timezone/DST/year/leap boundaries | Medium / High | Central pure date-key helper, server-authoritative timezone/range, padded query plus exact key filter | Table-driven unit/API tests across offsets, DST, year boundary, and leap day | Correct helper and rerun focused evidence; no data repair |
| Invalid stored timezone causes Profile failure | Low / Medium | Validate use of stored timezone and fall back to UTC | Invalid-zone handler test | Roll forward helper fix; no data repair |
| Large historical read | Medium / Medium | Query only selected field in bounded padded interval using existing composite index | Query-argument test, representative query inspection, runtime monitoring if available | Optimize query/index in a separately reviewed change if evidence requires it |
| Color-only or keyboard-hostile grid | Medium / High | Per-cell text semantics, non-color mark, legend, no fake interactive cells/tab-stop explosion | Component assertions plus keyboard/screen-reader/manual matrix | Block release and correct component |
| Activity failure hides profile/account actions | Medium / High | Independent page states and activity-only retry | Profile integration tests for failure/retry and Delete account access | Block release and correct composition |

## Test mapping

Binding test names include the requirement/design IDs. Red tests must fail because the endpoint,
helper, response type/wrapper, or component behavior is missing—not because fixtures or imports are
broken.

| Rule ID / summary | Test (file or describe block) | Layer |
| --- | --- | --- |
| PROFILE-010, DES-003 | `test cases/lib/workouts/activityCalendar.test.ts`: exactly 53 Monday-first weeks/371 cells for ordinary, year-boundary, and leap-year clocks; current-week future dates remain outside completed keys | unit |
| PROFILE-011, DATA-005, DES-004, DES-006, DES-015 | Same helper test: UTC, Asia/Kolkata, positive/negative offset, DST transition, invalid-zone fallback, recorded-date grouping, sorting/deduplication, and date-only client labels do not shift | unit + component |
| SEC-001, DES-001, DES-008 | `test cases/pages/api/user/workout-activity.test.ts`: GET guard, signed-out response, disabled/deleted propagation, and no query after denied identity | API handler |
| PROFILE-011, SEC-002, SEC-004, DES-001, DES-005, DES-006 | Same handler test: verified UID/status/bounded-date Prisma predicate; completed owned dates only; foreign/draft/in-progress/out-of-range/future scenarios cannot enter response | API handler |
| PROFILE-011, DES-002, DES-006 | Same handler test: multiple qualifying workouts deduplicate to sorted keys and expose no count/intensity or workout fields | API handler |
| PROFILE-011, DES-007 | Same handler test: calendar code never queries/interprets `UserActivityDay` or calls a calendar-domain mutation; authentication is mocked at its boundary because its existing best-effort activity side effect is independently governed | API handler negative |
| PROFILE-012, DES-008 | Same handler test: zero rows return 200 empty; Prisma/unexpected failure returns generic 500 and never a successful empty response/internal detail | API handler |
| PROFILE-010, PROFILE-012, A11Y-003, DES-012, DES-013 | `test cases/components/profile/WorkoutActivityCalendar.test.tsx`: 53x7 structure, month/legend context, binary green/non-color mark, accessible date/state for workout/neutral/future, and no interactive cells/tab-stop explosion | component |
| PROFILE-010, A11Y-001, DES-014 | Same component test plus manual matrix: contained overflow and recent-week alignment at mobile width; desktop, 200% zoom, touch, light/dark, page-width containment | component + manual |
| PROFILE-012, A11Y-002, DES-010 | `test cases/pages/profile/index.test.tsx`: independent activity loading, empty, failure, retry success; profile/incomplete-profile/sign-out/Delete account remain available throughout | page component |
| DES-009 | Profile page test asserts the shared wrapper is called and retry calls only that wrapper; static review confirms no raw component request | page component + review |
| DES-011, DES-016 | Profile page test verifies calendar only in Profile tab before Session and absent from Delete account; existing profile/edit/sign-out/delete tests remain green; scope review confirms no Dashboard/workout-lifecycle change | page component + regression review |
| DES-017 | Handler/page tests assert generic failure copy and absence of internal/workout details; documentation/snapshot inspection contains no personal workout data | API + component + review |
| DES-018 | Verification traceability review checks canonical sync/no-change list and the Feature Catalog update before Archive | documentation review |

---

*Upstream review: Keerthan K — 2026-09-20*

*Scope: design*

*Teach-back: confirmed*
