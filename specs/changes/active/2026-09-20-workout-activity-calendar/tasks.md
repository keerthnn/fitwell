---
id: change-2026-09-20-workout-activity-calendar
title: Workout activity calendar
status: approved
authority: temporary
mode: full-sdd
phase: tasks
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
---

# Tasks: Workout activity calendar

> **Layer:** *do* — atomic Apply checklist only. These tasks translate the reviewed
> [Proposal](proposal.md) and [Design](design.md); they add no requirements.
>
> **Depends on:** [Clarify](clarify.md) signed 2026-09-20, Proposal reviewed 2026-09-20, and Design
> reviewed 2026-09-20. Red-phase tests and assertion audit precede production implementation.

---

## Red phase (tests must fail first)

- [ ] **T01 — Preserve the current Profile baseline.** Run the existing
  `test cases/pages/profile/index.test.tsx` before edits and record its result. Confirm the working
  tree has no pre-existing failures in the affected Profile path. Trace: DES-010, DES-016.

- [x] **T02 — Add pure calendar/date Red tests.** Create
  `test cases/lib/workouts/activityCalendar.test.ts` with table-driven assertions for exactly 53
  Monday-first weeks/371 cells, ordinary/year/leap/DST boundaries, UTC and positive/negative IANA
  offsets, invalid-timezone fallback, padded-bound filtering, unique sorted date keys, future
  exclusion, and date-only labels that do not shift with the test environment timezone. Use
  PROFILE-010, PROFILE-011, DATA-005, DES-003–006, and DES-015 in test names. Trace: Design test
  mapping rows 1–2.

- [x] **T03 — Add authenticated API Red tests.** Create
  `test cases/pages/api/user/workout-activity.test.ts` using the repository's handler request/response
  doubles and auth/Prisma boundaries. Cover GET-only behavior; denied identity with no workout query;
  verified UID/status/bounded-date predicate; missing and invalid timezone fallback; empty success;
  sorted deduplication; generic server failure; minimal response disclosure; and negative cases for
  client-supplied authority, foreign/draft/in-progress/out-of-range/future/app-activity data and any
  calendar-domain mutation. Use PROFILE-011, PROFILE-012, SEC-001/002/004, and DES-001–008 in test
  names. Trace: Design test mapping rows 3–7.

- [x] **T04 — Add calendar component Red tests.** Create
  `test cases/components/profile/WorkoutActivityCalendar.test.tsx` under jsdom. Cover the 53x7
  Monday-first structure, month context, visible binary legend, green/non-color mark, accessible
  labels for completed/neutral/future dates, no action semantics or 371 tab stops, server-authoritative
  today/date keys, and contained mobile overflow/recent-week alignment where jsdom can observe it.
  Use PROFILE-010, PROFILE-012, A11Y-001/003, and DES-012–015 in test names. Trace: Design test
  mapping rows 8–9.

- [x] **T05 — Extend Profile composition Red tests.** Update
  `test cases/pages/profile/index.test.tsx` to mock the typed activity wrapper and cover independent
  profile/activity loading, success, empty, failure, activity-only retry, and retry success. Assert
  the calendar appears only in the Profile tab between the profile area and Session, stays absent
  from Delete account, and never hides profile/incomplete-profile/edit/sign-out/Delete account
  behavior. Use PROFILE-010–012, A11Y-002, and DES-009–011/016/017 in test names. Trace: Design test
  mapping rows 10–13.

- [x] **T06 — Prove meaningful Red.** Run the four focused files with
  `pnpm exec vitest run` before behavior implementation. Record the command, expected failures, actual
  assertions, and why each failure represents the missing calendar contract. Resolve syntax errors,
  broken imports, invalid fixtures, false positives, or environmental failures without implementing
  behavior. Confirm the original Profile characterization cases remain green. Trace: OPSX Red and
  Testing Guide §3.1.

- [x] **T07 — Human assertion audit.** Stop for Keerthan K to inspect fixtures and assertions using
  the delete/invert heuristic. Confirm ownership tests assert both the verified predicate and absence
  of forbidden disclosure/mutation; confirm UI tests assert behavior rather than MUI internals. Do
  not begin T08 until the Red evidence and assertions are approved. Trace: Review Guide §2.2.

## Implementation

- [x] **T08 — Implement pure calendar logic.** Add
  `src/lib/workouts/activityCalendar.ts` with effective-timezone resolution, date-only calendar
  arithmetic, 53-week range construction, padded UTC query bounds, member-local workout-date key
  conversion, exact range/today filtering, sorting, and deduplication. Do not read Prisma or browser
  state in this helper. Make T02 Green. Trace: PROFILE-010/011; DES-003–006, DES-015.

- [x] **T09 — Add the shared response contract.** Add
  `WorkoutActivityCalendarResponse` to `src/utils/types.ts` with only `timezone`, `startDate`,
  `endDate`, `todayDate`, and `completedDates`. Keep date fields as `YYYY-MM-DD` strings and expose no
  workout-level data or counts. Run typecheck after the contract exists. Trace: DES-002.

- [x] **T10 — Implement the authenticated activity endpoint.** Add
  `src/pages/api/user/workout-activity.ts`: enforce GET, authenticate through
  `getUserIdOrSetError`, load only the caller's profile timezone, compute the range, query only
  `workoutDate` for the verified owner's completed workouts in the padded interval, aggregate through
  the pure helper, and return the minimal response. Fall back to UTC for missing/invalid timezone and
  return generic 500 on unexpected failure. Do not accept request authority, access
  `UserActivityDay`, or perform calendar-domain writes. Make T03 Green. Trace: PROFILE-011/012,
  SEC-001/002/004, DES-001–008/017.

- [x] **T11 — Add the shared browser wrapper.** Add typed `getWorkoutActivity()` to
  `src/utils/spec.ts`, using the same-origin `/api/user/workout-activity` route and the shared response
  type. Do not add raw Axios/fetch calls to Profile components. Trace: ADR-0005, DES-009.

- [x] **T12 — Implement the calendar component.** Add
  `src/components/profile/WorkoutActivityCalendar.tsx`. Build the 53-column/seven-row grid only from
  server-provided range/today/completed date keys; add month context, binary legend, theme success
  color plus non-color mark, per-date accessible state, read-only semantics, stable date-only labels,
  and contained responsive overflow aligned to recent weeks. Do not add cell actions, intensity,
  drill-down, or client qualification logic. Make T04 Green. Trace: PROFILE-010–012, A11Y-001/003,
  DES-011–015.

- [x] **T13 — Compose independent Profile activity state.** Update `src/pages/profile/index.tsx` to
  load profile and activity separately, render the calendar after profile/incomplete-profile content
  and before Session, and use activity-specific loading, empty/success, generic error, and Try again
  behavior. Preserve the Profile/Delete account tab boundary and all existing edit, sign-out,
  onboarding, and deletion flows. Make T05 and existing Profile tests Green. Trace: PROFILE-010–012,
  A11Y-002, DES-010/011/016/017.

- [x] **T14 — Review implementation scope before broader checks.** Inspect the diff for accidental
  Dashboard, Analytics, workout lifecycle/date mutation, Prisma schema/migration, app-activity,
  admin/public page, dependency, environment, or external-service changes. Remove untraced changes;
  return to Design if implementation evidence invalidates an approved rule. Trace: Proposal
  non-goals; DES-016.

## Canonical documentation synchronization

- [x] **T15 — Synchronize product contracts.** During Verification, add PROFILE-010–012 to
  `specs/prds/domains/user-profiles.md`, update its verification/traceability context appropriately,
  and add the verified Profile workout-activity capability to
  `specs/product/feature-catalog.md`. Do not add the feature to Dashboard or describe it as shipped
  before implementation evidence passes. Trace: Proposal PRD delta; DES-018.

- [x] **T16 — Synchronize engineering contracts.** Update
  `specs/engineering/features/user-profiles.md` with placement, API/data flow, failure/accessibility
  behavior, boundaries, code/tests, and remaining gaps; update
  `specs/engineering/architecture/frontend-architecture.md` for date-only calendar rendering and
  independent Profile state; add `GET /api/user/workout-activity` to
  `specs/engineering/api/endpoint-catalog.md` and correct its endpoint count; update Authorization
  Model code/test mapping if the new route adds a durable reference. Trace: DES-001–018.

- [ ] **T17 — Record explicit no-change decisions.** In Verification, confirm and record no
  canonical change to Workout Engine behavior/PRD/SDD, Dashboard, Analytics, Data Lifecycle,
  database design/schema/migrations, ADRs, integrations, deployment/configuration/recovery procedures,
  or external state. If evidence shows one of those contracts changed, return to the owning upstream
  phase instead of silently editing scope. Trace: DES-016, DES-018.

## Verify

- [x] **T18 — Run focused Green evidence.** Run the four mapped test files together, then individually
  if a failure needs isolation. Record counts and results in `tasks.md`; inspect assertions and prove
  tests would fail if owner scoping, completed-only filtering, timezone conversion, failure
  distinction, or non-color status were removed/inverted. Trace: all Design test-mapping rows.

- [x] **T19 — Run repository checks.** Run and record:
  `pnpm run lint`, `pnpm run typecheck`, `pnpm run test`, `pnpm run build`,
  `pnpm run verify:assets`, and `pnpm run specs:check`. Explain every warning or omission; do not
  claim pass for commands not run. Trace: Verification Matrix and Testing Guide §9.

- [ ] **T20 — Perform manual Profile verification.** In an authorized local environment, record
  actor/precondition/action/observation for signed-out rejection and signed-in Profile success,
  zero-activity, activity failure/retry, multiple workouts on one date, draft/in-progress exclusion,
  past quick-entry recorded date, current/future cells, timezone boundary, and preservation of edit,
  sign-out, incomplete-profile, and Delete account actions. Do not include personal workout contents
  in evidence. Trace: PROFILE-010–012, SEC-001/002/004, DES-010–017.

- [ ] **T21 — Perform manual accessibility/responsive verification.** Check keyboard and screen-reader
  semantics, no color-only meaning, no calendar-cell tab-stop explosion, mobile touch/horizontal
  containment/recent-week alignment, desktop layout, 200% zoom, and light/dark modes. Record any
  environment limitation as a verification gap with owner/disposition. Trace: A11Y-001–003,
  DES-012–014.

- [ ] **T22 — Complete High-tier code review.** Independently review authentication/ownership,
  response disclosure, padded query bounds, timezone/DST math, read-only separation, error/retry
  behavior, Profile/account regression risk, responsive/accessibility behavior, and test quality.
  Fix findings and rerun affected evidence. Record reviewer, date, checks, findings, and whether
  Verification may begin. Trace: Review Guide Part 3 critical-area bump.

- [ ] **T23 — Run OPSX Verification.** After implementation and code-review fixes, create
  `verification.md` from the repository template. Map every Proposal/Design rule and task to concrete
  automated/manual evidence, disclose deviations and unknown external state, confirm canonical sync,
  and obtain Keerthan K's Verification approval plus Archive authorization. Trace: DES-018 and
  Engineering Workflow §6.

- [ ] **T24 — Archive after authorization.** Only after Verification approval, confirm no current rule
  remains solely in the change package, mark the package archived, and move the unchanged directory
  to `specs/changes/archive/2026/2026-09-20-workout-activity-calendar/` using OPSX Archive. Trace:
  Engineering Workflow §7.

---

## Execution log

Record Red/Green commands, observed failures/passes, assertion-audit approval, implementation notes,
warnings, manual environments, review findings, and deviations here while executing the approved
tasks. Do not pre-check tasks or pre-fill evidence.

- **2026-09-20 — T01 baseline note:** The baseline was not separately captured before the Red edits.
  In the focused Red run, four untouched existing Profile cases remained green; the existing
  profile-failure case reached its new activity assertion and failed because activity integration is
  absent. T01 remains open so this omission is explicit rather than reconstructed as evidence.
- **2026-09-20 — T02–T06 Red:**
  `pnpm exec vitest run 'test cases/lib/workouts/activityCalendar.test.ts' 'test cases/pages/api/user/workout-activity.test.ts' 'test cases/components/profile/WorkoutActivityCalendar.test.tsx' 'test cases/pages/profile/index.test.tsx'`
  executed four files and 29 tests. Result: 24 failed and 5 passed before the final assertion
  tightening; helper cases failed with the explicit not-implemented behavior, API cases returned the
  explicit 501 fallback instead of the required 405/200/500 contracts, calendar cases rendered only
  the missing-component sentinel, and Profile cases could not find activity loading/content/error
  UI. There were no transform, syntax, fixture, or environment failures. One API no-mutation case
  passed vacuously against the fallback; its assertions were tightened to require auth/profile/workout
  reads as well as absence of forbidden access/mutation and must be rerun before the assertion audit.
- **2026-09-20 — T06 Red rerun after assertion tightening:** The same focused command executed all 29
  tests. Result: 25 failed and 4 passed. The formerly vacuous DES-007 negative case now fails because
  the missing handler does not perform the required authenticated owner-scoped reads; its forbidden
  app-activity and mutation assertions remain in place. All failures continue to represent absent
  helper, endpoint, component, or Profile behavior rather than a broken test harness.
- **2026-09-20 — T07 assertion audit:** Keerthan K approved the Red assertions and authorized Apply.
  The previously disclosed T01 baseline-capture omission remains recorded; approval did not invent
  missing baseline evidence.
- **2026-09-20 — T08–T14 Apply:** Implemented the pure 53-week/date-key helper, minimal response
  type, authenticated owner-scoped read endpoint, shared Axios wrapper, read-only accessible calendar,
  and independent Profile state/retry. Scope inspection found no Dashboard, Analytics, workout
  lifecycle/date mutation, Prisma schema/migration, app-activity, admin/public page, dependency,
  environment, or external-service change.
- **2026-09-20 — T18 focused Green:**
  `pnpm exec vitest run --reporter=dot 'test cases/lib/workouts/activityCalendar.test.ts' 'test cases/pages/api/user/workout-activity.test.ts' 'test cases/components/profile/WorkoutActivityCalendar.test.tsx' 'test cases/pages/profile/index.test.tsx'`
  passed all four files and all 29 tests. The suite directly retains assertions for verified owner
  and `COMPLETED` predicates, timezone/range conversion, distinct activity failure versus empty,
  activity-only retry, and the visible non-color completion mark.
- **2026-09-20 — T15–T16 canonical sync:** Added PROFILE-010–012 to the User Profiles PRD; updated
  the Product Feature Catalog, User Profiles SDD, Frontend Architecture, API Endpoint Catalog, and
  Authorization Model with the implemented boundaries and test references.
- **2026-09-20 — T19 repository checks:** `pnpm run lint`, `pnpm run typecheck`,
  `pnpm run test`, `pnpm run build`, `pnpm run verify:assets`, and `pnpm run specs:check` all passed.
  Full Vitest result: 28 files and 129 tests passed. The production build compiled and generated all
  pages, including `/profile` and `/api/user/workout-activity`. Asset verification approved 572
  assets and 246 exercise image resolutions. Spec validation passed 26 required and 112 process
  files. No warning remains; two lint-only test identifier issues and the initial effect-state pattern
  were corrected before this final run.

*Upstream review: Keerthan K — 2026-09-20*

*Scope: tasks*

*Teach-back: confirmed*
