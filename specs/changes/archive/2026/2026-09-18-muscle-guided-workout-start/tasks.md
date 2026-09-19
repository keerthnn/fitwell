---
id: change-2026-09-18-muscle-guided-workout-start
title: Muscle-guided workout start
status: archived
authority: temporary
mode: full-sdd
phase: tasks
opened: 2026-09-18
archived: 2026-09-19
---

# Tasks: Muscle-guided workout start

> **Layer:** *do* — atomic Apply checklist only. These tasks implement the approved
> [Design](design.md) and [Proposal acceptance criteria](proposal.md#acceptance-criteria); they do not
> add requirements.
>
> **Gate:** Design was approved by Keerthan K on 2026-09-19. This task list must be approved before
> Red-phase execution or application-code changes begin.

---


### Task rules

- Use `[ ]`, `[~]`, and `[x]` for pending, in progress, and complete. Keep at most one `[~]` task.
- Before each production-code group, run its Red task and record the command, failing assertion, and
  expected missing behavior under **Execution notes**. Existing behavior may be recorded as Green
  characterization evidence; do not manufacture a failure.
- Keep every test under `test cases/`, mirroring `src/`, and include stable requirement/design IDs in
  direct binding tests.
- Preserve unrelated worktree changes. Do not change schema, seed data, hosted data, external
  configuration, or canonical specifications outside the explicit tasks below.
- Return to Design or Proposal if implementation requires a different category mapping, external
  artwork/dependency, schema/backfill, new endpoint, changed edit-flow scope, or altered acceptance
  criterion.

## Red phase (tests must fail first)

### Red phase — contract and API

- [x] **T01 — Query-validator Red (DES-001, DES-012, AC-05):** Add
  `test cases/lib/api/validators/exercise.test.ts`. Cover a valid canonical comma list and negative
  cases for singular-plus-plural filters, empty values, duplicates, array input, unknown groups, and
  more than twelve groups; retain valid legacy query cases. Run
  `pnpm exec vitest run 'test cases/lib/api/validators/exercise.test.ts'` and record failure because
  `categories` is not implemented.
- [x] **T02 — Exercise-list API Red (EXERCISE-011, EXERCISE-012, EXERCISE-013, DES-002,
  DES-003, DES-013, DES-014, AC-02, AC-03, AC-04, AC-05, AC-13):**
  Add `test cases/pages/api/exercises/get-exercises.test.ts` with authentication and Prisma boundary
  mocks/fixtures. Prove category-union filtering, Back subregions, row deduplication, no secondary-
  muscle inference, inactive exclusion, browse-all Full Body/unknown categories, deterministic
  `name,id` ordering, bounded cursor pages, malformed-input 400, and signed-out/account denial. Run
  the focused file and record the absent plural filter and ordering failures.
- [x] **T03 — Submission-race characterization (WORKOUT-018, PLAN-014, DES-021, AC-07, AC-08,
  AC-13):** Add
  focused handler tests at `test cases/pages/api/workouts/create-workout.test.ts`,
  `test cases/pages/api/workout-plans/create.test.ts`, and
  `test cases/pages/api/workout-exercises/add-exercise.test.ts` for inactive-after-selection rejection,
  authenticated ownership, limit/uniqueness boundaries, and no partial aggregate. Run them together.
  Record existing Green behavior as characterization evidence and only record genuine failures; do
  not change unrelated domain behavior to force Red.

### Red phase — shared discovery UI

- [x] **T04 — Body diagram Red (EXERCISE-010, A11Y-005, DES-001, DES-004, DES-005, DES-006,
  DES-007, AC-01, AC-02, AC-11, AC-12):** Add
  `test cases/components/exercise-discovery/MuscleBodyDiagram.test.tsx`. Assert the front/back union is
  exactly twelve groups, bilateral/repeated regions share state, pointer and keyboard activation set
  accessible pressed state, labeled controls remain equivalent, and selected state has a textual
  non-color representation. Run the focused test and record module-not-found Red.
- [x] **T05 — Discovery state Red (EXERCISE-012, EXERCISE-013, EXERCISE-015, DES-008, DES-009,
  DES-014, DES-015, DES-016, AC-04, AC-05, AC-10):** Add
  `test cases/components/exercise-discovery/ExerciseDiscovery.test.tsx`. Cover prompt/no request,
  Browse all, muscle-mode transitions, clear, trimmed/debounced search, bounded load more, ID
  deduplication, current-criteria empty/loading/failure, page failure/retry, and obsolete success/error
  responses. Run the focused test and record module-not-found Red.
- [x] **T06 — Explicit-add and preservation Red (EXERCISE-014, DES-008, DES-010, DES-011,
  AC-06):** Extend the
  discovery test with caller-owned selected IDs. Prove filters, view, search, pagination, retry, and
  request failures never call add/remove; Add fires once; Added disables duplicates; an off-filter
  chosen exercise remains chosen. Run with T05 and record the missing behavior.

### Red phase — flow integration and compatibility

- [x] **T07 — Live setup Red (WORKOUT-018, DES-017, DES-021, AC-01, AC-06, AC-07):** Extend
  `test cases/components/workouts/WorkoutCreateForm.test.tsx` to prove live setup renders discovery,
  discovery actions do not call `createWorkout`, explicit submit sends ordered IDs, empty start stays
  available, and failed submit retains details/selections. Run the focused test and record the current
  search-led-picker failures.
- [x] **T08 — Picker compatibility Red (EXERCISE-014, DES-010, DES-011, DES-020, AC-06,
  AC-14):** Add
  `test cases/components/workouts/WorkoutExercisePicker.test.tsx` covering muscle-guided and legacy
  variants, explicit removal, append order, initial/off-filter selections, and unchanged legacy search
  behavior. Run the focused test and record the missing variant/discovery failures.
- [x] **T09 — Plan creation Red (PLAN-014, DES-018, DES-021, AC-01, AC-06, AC-08, AC-14):** Add
  `test cases/components/workout-plans/WorkoutPlanForm.test.tsx`. Prove member creation uses discovery,
  prescriptions survive discovery changes, explicit submit alone creates the plan, and member edit plus
  administrator create/edit retain the legacy picker and initial prescription values. Run the focused
  test and record the creation-flow failure.
- [x] **T10 — Quick-entry editor Red (WORKOUT-019, DES-019, DES-021, AC-01, AC-06, AC-09,
  AC-13, AC-14):** Add
  `test cases/components/workouts/WorkoutExerciseEditor.test.tsx`. Prove discovery is enabled only by
  the editable quick-entry page context; Add uses the existing endpoint/order; reload does not reset
  discovery or sets; add failure is visible and retains criteria/workout data; live, plan-started,
  completed, and non-quick edit paths retain current behavior. Run the focused test and record the
  missing integration failures.

## Implementation

### Contract and API implementation

- [x] **T11 — Canonical group module (DES-001, DES-002, DES-003):** Add
  `src/utils/exerciseDiscovery.ts` with the ordered twelve-group value set, `MuscleGroup` type,
  exact category mapping, and parsing helpers needed by both client and validator. Do not include
  `Full Body`, subregions, aliases, or secondary-muscle inference. Run T01 and focused ESLint/typecheck.
- [x] **T12 — Typed list query and cancellation (ADR-0005, DES-012, DES-015):** Add
  `ExerciseListQuery` to
  `src/utils/types.ts`; change `getExercises` in `src/utils/spec.ts` from an unbounded record to the
  typed query and accept an optional request signal/config without changing current callers. Run
  typecheck and legacy consumer tests.
- [x] **T13 — Plural-filter validation (DES-012):** Update `validateExerciseQuery` to parse the
  comma-separated canonical list and reject every invalid/mixed shape in T01 while preserving existing
  query semantics and error envelope. Make T01 Green and run focused ESLint.
- [x] **T14 — Union filtering and stable paging (DES-013, DES-014):** Update the existing exercise-list
  handler to apply `category: { in: categories }`, retain member `isActive` enforcement and admin
  behavior, and order by `name ASC, id ASC` with the existing ID cursor/limit response. Make T02 Green;
  rerun T01–T03 and typecheck.

### Shared discovery implementation

- [x] **T15 — Local body geometry (DES-004):** Add typed, original front/back SVG path metadata under
  `src/components/exercise-discovery/`. Include only the approved front/back group exposure and reuse
  one group value for bilateral/repeated shapes. Add no remote asset, public raster, package, or medical
  claim. Keep the geometry isolated from selection/request state.
- [x] **T16 — Accessible body controls (DES-005, DES-006, DES-007):** Implement
  `MuscleBodyDiagram.tsx` with
  pointer and keyboard button semantics, accessible names/pressed state, visible focus, theme-aware
  fill plus outline/text selection cues, front/back control, all-twelve labeled fallback controls, and
  responsive/touch-safe layout. Make T04 Green.
- [x] **T17 — Criteria/request state (DES-008, DES-009, DES-014, DES-015, DES-016):** Implement the
  discovery state hook or
  reducer with explicit `prompt`, `muscles`, and `all` modes; sorted criteria keys; 250 ms trimmed-search
  debounce; initial/page request separation; abort plus generation guard; cursor reset; load-more lock;
  ID deduplication; and same-criteria retry. Make the state portions of T05/T06 Green.
- [x] **T18 — Discovery presentation (DES-006, DES-007, DES-008, DES-009, DES-010, DES-016):**
  Implement `ExerciseDiscovery.tsx` and
  focused child components for prompt, search, result rows, Add/Added, selected-name summary, loading,
  empty, initial/page failure, Retry, and live-region status. Keep chosen IDs and add behavior caller-
  owned. Make all T05/T06 cases Green and run focused accessibility assertions, ESLint, and typecheck.

### Flow implementation

- [x] **T19 — Picker composition (DES-008, DES-010, DES-011, DES-020):** Refactor
  `WorkoutExercisePicker` to compose
  `ExerciseDiscovery` for an explicit muscle-guided variant while retaining the search-led legacy
  variant for excluded consumers. Preserve selected exercise rendering, explicit removal, append order,
  images, initial selections, and the caller `onChange` contract. Make T08 Green.
- [x] **T20 — Live setup wiring (DES-017, DES-021):** Configure the `LIVE` branch of
  `WorkoutCreateForm` to use the muscle-guided picker without changing QUICK_ENTRY create behavior,
  submit timing, empty start, date/name state, ordered IDs, or existing server authority. Surface submit
  failure without clearing local work. Make T07 Green and rerun workout-create API tests.
- [x] **T21 — Private-plan creation wiring (DES-018, DES-020, DES-021):** Configure member plan
  creation to use
  muscle-guided discovery. Select the legacy picker whenever `initial` exists or `admin` is true. Keep
  prescription state keyed by exercise ID, explicit submit, ordered prescriptions, and existing 1–100
  validation. Make T09 Green and rerun existing workout-plan tests.
- [x] **T22 — Quick-entry page wiring (DES-019, DES-020, DES-021):** Add an explicit
  discovery-enable prop from
  `/workouts/[id]/edit` only for an incomplete `QUICK_ENTRY` workout. Compose discovery in
  `WorkoutExerciseEditor` for that context; use existing `addExerciseToWorkout`, prevent selected-ID
  duplicates, preserve criteria across reload, and show add failure without mutating exercises/sets.
  Leave live-session and other editor contexts on the existing autocomplete. Make T10 Green.
- [ ] **T23 — Focused compatibility review (DES-020):** Run the complete focused suite and inspect the
  diff to confirm unchanged behavior for standalone catalog queries, direct exercise start, saved-plan
  start, member plan editing, administrator plan forms, live/non-quick workout editing, completed
  workout rendering, historical exercises/sets, and callers omitting `categories`. Correct only traced
  regressions; return to Design for scope changes.

### Canonical documentation synchronization

- [x] **T24 — Product requirements:** During Verification, add the approved requirements without
  semantic drift to `specs/prds/domains/exercise-catalog.md` (`EXERCISE-010`–`015`),
  `workout-engine.md` (`WORKOUT-018`–`019`), `workout-plans.md` (`PLAN-014`), and
  `system-qualities.md` (`A11Y-005`). Update requirement links/frontmatter as needed; do not change
  existing promises.
- [x] **T25 — Feature and architecture SDDs:** Synchronize the implemented component/state/API/error
  rules into the Exercise Catalog, Workout Engine, Workout Plans, and Frontend Architecture SDDs.
  Record the exact legacy/discovery consumer boundary, active-category union, paging, accessibility,
  stale-response, and no-persistence-change behavior.
- [x] **T26 — API/data/product inventory:** Update the endpoint catalog and API documentation for the
  optional `categories` query and deterministic ordering. Review database/index, data-lifecycle,
  product feature catalog, quality, operations, integration, and decision documents; update only
  durable changed facts and record `No change` reasons for schema/migration/index, vendors,
  configuration, deployment architecture, tiers, and ADRs in Verification.

## Verify

### Verification

- [~] **T27 — Focused automated checks:** Run T01–T10 files together, then all directly affected
  existing workout, plan, catalog, validator, and component tests. Record commands and results mapped
  to `AC-01`–`AC-14`, Proposal requirement IDs, and `DES-001`–`DES-021`; confirm every prohibition has
  a negative test or named manual check.
- [x] **T28 — Repository checks:** Run `pnpm run lint`, `pnpm run typecheck`, `pnpm run test`,
  `pnpm run build`, and `pnpm run verify:assets`. Record outputs and explain any warning, skip, or
  unrelated failure without overwriting user work.
- [ ] **T29 — Responsive/accessibility matrix:** In an authenticated browser, verify front/back and
  all twelve groups with keyboard, pointer, touch/no-hover behavior, visible focus, accessible names/
  pressed state and live request status, SVG-unavailable fallback, 360px and desktop widths, 200% zoom,
  and light/dark themes. Record actor, precondition, action, observed result, and screenshots where
  practical.
- [ ] **T30 — Three-flow and compatibility scenarios:** Manually verify live selection/empty start,
  private-plan creation/prescriptions, quick-entry draft/set/completion, initial and page failure retry,
  out-of-order criteria changes, inactive-after-selection failure, direct exercise start, saved-plan
  start, member/admin plan edit, live/non-quick workout edit, and preservation of historical data.
- [ ] **T31 — Authorized catalog coverage:** Inspect the target environment only through an authorized
  source and record active counts for every exact selectable category plus Full Body/unknown categories.
  If access is unavailable, record hosted coverage as unknown and block any deployment-readiness claim;
  do not infer it from repository seed data.
- [x] **T32 — Verification artifact:** Create `verification.md` from the template with Red evidence,
  automated/manual results, AC/design mapping, security/data findings, catalog-coverage evidence,
  design deviations, known gaps, canonical sync, recovery, and readiness. Material deviations return
  to the appropriate approved phase.

### Review and archive

- [x] **T33 — Verification approval:** Obtain Keerthan K's approval of Verification and disposition of
  every gap. Do not claim release readiness or Archive while a required catalog, security,
  accessibility, or data-integrity result is unresolved.
- [x] **T34 — Archive:** Confirm no lasting requirement, design rule, API contract, or operating fact
  exists only in this package; set package status/date to archived and move the unchanged directory to
  `specs/changes/archive/2026/` only after explicit Archive approval.

### Execution notes

- **2026-09-19 — T01 Red:**
  `pnpm exec vitest run 'test cases/lib/api/validators/exercise.test.ts'` ran 10 tests with 9 expected
  failures. The validator omitted valid plural categories and accepted every invalid/mixed plural
  shape; the legacy singular-category characterization passed.
- **2026-09-19 — T02 Red:**
  `pnpm exec vitest run 'test cases/pages/api/exercises/get-exercises.test.ts'` ran 7 tests with 4
  expected failures. Plural filtering and mixed-filter rejection were absent, and ordering used only
  `name`; method/authentication and normal-member inactive visibility guards passed.
- **2026-09-19 — T03 characterization/Red:** The three focused handler files ran 7 tests. Workout
  creation and owner-scoped exercise addition passed 5 characterization cases. Plan creation failed 2
  cases because it neither checks referenced active exercises nor rejects an exercise that became
  inactive before save; this is a genuine DES-021 Red gap.
- **2026-09-19 — T04–T06 Red:** The two discovery component files failed import resolution before
  collection because `MuscleBodyDiagram` and `ExerciseDiscovery` do not exist. This establishes the
  missing accessible body, request-state, and explicit-add surfaces before production work.
- **2026-09-19 — T07–T10 Red:** Four flow files ran 6 tests: the 2 existing workout-form
  characterizations stayed Green and all 4 new discovery-boundary assertions failed because live
  setup, the guided picker variant, member plan creation, and quick-entry edit still render only the
  legacy search experience.
- **2026-09-19 — T11–T23 implementation:** Added the canonical group module, typed/cancellable list
  query, validated category union and deterministic paging, original inline SVG body, accessible
  equivalent controls, stale-response-safe discovery, and the three approved integrations. Also added
  the missing active-exercise check to private-plan creation. Focused ESLint and typecheck passed; 11
  focused files passed 42 tests. Excluded consumers retain the legacy picker/query path.
- **2026-09-19 — T24–T26 specification sync:** Added the approved PRD requirements and synchronized
  the Exercise Catalog, Workout Engine, Workout Plans, Frontend Architecture, endpoint catalog, and
  product feature catalog. Reviewed data/index, lifecycle, integration, operations, configuration,
  and ADR documents: no schema, migration, index, retention, vendor, secret, deployment architecture,
  tier, or durable decision changed.
- **2026-09-19 — Verification continuation:** Two new regression tests failed for stale results
  during debounce and duplicate concurrent additions, then passed after fixes. Added preservation
  of unsaved workout name/notes, refresh-only retry after a successful add, SVG error isolation,
  native-style Space activation, and rejection of empty singular-plus-plural category queries.
  Full checks pass: lint, typecheck, 22 test files/83 tests, build, and asset verification (160/246).
  Signed-out `/workouts/create` redirects to sign-in; authenticated browser checks are blocked by
  the missing test session. Hosted category coverage remains unknown. See [Verification](verification.md).
- **Coverage correction:** T01–T10 checked entries record executed Red/characterization work,
  not proof that every requested assertion was implemented. T23 and T27 remain open for complete
  compatibility, preservation, adversarial, and database-backed coverage as enumerated in Verification.
- **2026-09-19 — Verification approved:** Keerthan K approved Verification with the documented
  authenticated-browser, test-database, and hosted-catalog checks accepted as deferred follow-ups.
  The approval does not claim deployment readiness and does not authorize Archive. The latest suite
  has 86 passing tests after exercise-result imagery and image-based equipment filtering were added.
- **2026-09-19 — Archive approved:** Keerthan K explicitly authorized Archive. Canonical exercise
  requirements now name equipment refinement and preservation, all durable implementation rules are
  synchronized, and the complete package moves unchanged to the 2026 archive.
- Add subsequent dated Red evidence, discoveries, approved replanning, and verification commands here
  during Apply. Do not use this section to introduce requirements.

### Tasks decision

- Status: Approved
- Approved by: Keerthan K (project owner)
- Date: 2026-09-19
- Conditions: None proposed
