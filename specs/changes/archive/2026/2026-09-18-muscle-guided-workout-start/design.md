---
id: change-2026-09-18-muscle-guided-workout-start
title: Muscle-guided workout start
status: archived
authority: temporary
mode: full-sdd
phase: design
opened: 2026-09-18
archived: 2026-09-19
requirements:
  - EXERCISE-010
  - EXERCISE-011
  - EXERCISE-012
  - EXERCISE-013
  - EXERCISE-014
  - EXERCISE-015
  - WORKOUT-018
  - WORKOUT-019
  - PLAN-014
  - A11Y-005
decisions: [ADR-0001, ADR-0004, ADR-0005]
code:
  - src/components/workouts/WorkoutExercisePicker.tsx
  - src/components/workouts/WorkoutExerciseEditor.tsx
  - src/components/exercise-discovery/
  - src/pages/api/exercises/get-exercises.ts
  - src/lib/api/validators/exercise.ts
  - src/utils/exerciseDiscovery.ts
  - src/utils/spec.ts
  - src/utils/types.ts
tests:
  - test cases/components/exercise-discovery/
  - test cases/components/workouts/WorkoutExercisePicker.test.tsx
  - test cases/components/workouts/WorkoutExerciseEditor.test.tsx
  - test cases/components/workouts/WorkoutCreateForm.test.tsx
  - test cases/components/workout-plans/WorkoutPlanForm.test.tsx
  - test cases/lib/api/validators/exercise.test.ts
  - test cases/pages/api/exercises/get-exercises.test.ts
---

# Design: Muscle-guided workout start

> **Layer:** *how* — SDD / technical-specification delta for the current stack. Canonical technical
> specifications remain unchanged until Verification and Archive.
>
> **Depends on:** Signed [Clarify](clarify.md) and approved [Proposal](proposal.md), both reviewed by
> Keerthan K on 2026-09-19. This draft does not authorize Tasks or implementation.

---


## SDD delta

### Discovery vocabulary and classification

- **DES-001 — Canonical selectable groups.** The implementation must define one shared ordered
  `MuscleGroup` value set containing `Chest`, `Back`, `Shoulders`, `Biceps`, `Triceps`,
  `Quadriceps`, `Hamstrings`, `Glutes`, `Calves`, `Abs`, `Traps`, and `Forearms`. UI labels,
  diagram-region metadata, query validation, and tests must consume this definition or an exact
  server-safe counterpart. `Full Body` is a catalog category, not a selectable muscle group.
- **DES-002 — Category-based matching.** A selected muscle group maps one-to-one to the existing
  `Exercise.category` value with the same spelling. A result matches when its category is in the
  selected union. `primaryMuscle`, `secondaryMuscles`, exercise name, and `isCompound` must not add
  or remove matches. This includes category `Back` records whose `primaryMuscle` is `Lower lats`,
  `Middle back`, or another subregion.
- **DES-003 — Unmapped data.** Browse-all mode omits category filtering and therefore retains active
  `Full Body` and unknown-category records. Unknown categories must not be coerced into one of the
  twelve groups. Discovery must not require a schema change, reclassification, or backfill.

### Interactive body and accessible controls

- **DES-004 — Repository-owned vector body.** `MuscleBodyDiagram` must render original, repository-
  owned inline SVG geometry from local TypeScript data; it must not load a remote asset or add a
  runtime dependency. The front view exposes Chest, Shoulders, Biceps, Forearms, Abs, Quadriceps,
  Calves, and Traps. The back view exposes Back, Shoulders, Triceps, Forearms, Glutes, Hamstrings,
  Calves, and Traps. Bilateral and repeated front/back regions share one `MuscleGroup` state.
- **DES-005 — Direct and equivalent selection.** Every visible diagram region is an actual toggle
  with an accessible name and `aria-pressed` state. It must respond to pointer activation and the
  keyboard activation conventions for a button. A persistent labeled-control collection exposes all
  twelve groups with the same toggle operation and state. Activating either surface updates both;
  duplicate anatomical regions must never create duplicate selected values.
- **DES-006 — Perceivable state and fallback.** Selected regions must use a theme-aware fill plus a
  non-color cue such as a persistent outline, and selected names must appear as text. Focus must be
  visible in light and dark themes. The SVG is progressive enhancement: its absence, load/render
  failure, or CSS-background loss must leave the complete labeled-control workflow usable. No
  instruction may depend on hover or left/right anatomy.
- **DES-007 — Responsive layout.** The diagram, front/back switch, labeled controls, search, result
  actions, and selected-work summary must reflow to one column at narrow widths without page-level
  horizontal scrolling. Controls must retain touch targets and remain operable at 360 CSS pixels and
  200% browser zoom. Desktop may use a two-column discovery/selection layout.

### Discovery state and component boundaries

- **DES-008 — Reusable discovery owner.** `ExerciseDiscovery` under
  `src/components/exercise-discovery/` owns only body view, selected muscle filters, browse-all mode,
  name search, result pages, request state, and retry. Its caller owns chosen exercises and all
  workflow data. The component receives chosen exercise IDs and an explicit add callback; it must
  not mutate workout, plan, prescription, set, or routing state directly.
- **DES-009 — Explicit modes.** Discovery begins in `prompt` mode with no request, an instruction to
  select one or more muscles, and a visible **Browse all exercises** action. Selecting a muscle enters
  `muscles` mode. Browse all enters `all` mode and clears muscle filters. Clearing the last muscle
  returns to `prompt`; selecting any muscle while browsing all returns to `muscles`. Front/back view
  changes never alter mode, filters, search, results, or chosen exercises.
- **DES-010 — Explicit chosen-work mutations.** Result rows expose Add/Added state from caller-owned
  IDs. Only Add invokes the caller callback. Filter, search, view, pagination, retry, and clear
  operations must not call add/remove callbacks. Removal remains an explicit action in the caller's
  selected-exercise UI. Chosen order is append order unless the existing workflow's explicit reorder
  control changes it.
- **DES-011 — Preserve workflow values.** `WorkoutExercisePicker` continues to hold selected
  exercises in its parent form. `WorkoutPlanForm` continues to key prescriptions by exercise ID.
  Quick-entry sets remain server-owned through `WorkoutExerciseEditor` and `SetEditor`. Discovery
  state changes and successful parent reloads must not remount or reconstruct these stores, so
  off-filter exercises, prescription values, set values, metadata, date, duration, and order survive.

### Exercise list contract

- **DES-012 — Additive query shape.** The existing authenticated
  `GET /api/exercises/get-exercises` route gains optional `categories`, a comma-separated list of one
  to twelve unique canonical selectable groups. The shared wrapper accepts a typed
  `ExerciseListQuery` rather than an unbounded parameter record. Existing `search`, singular
  `category`, `equipment`, `movement`, `limit`, `cursor`, and privileged `includeInactive` behavior
  remain compatible. Supplying both `category` and `categories`, an empty list, duplicates, unknown
  values, more than twelve values, or an array-shaped `categories` query must return the normal 400
  validation response.
- **DES-013 — Server filtering and visibility.** For `categories`, the Prisma predicate is
  `category: { in: categories }`; this naturally returns each exercise row once for union matching.
  Member requests retain `isActive: true` regardless of manipulated discovery inputs. The route
  continues to authenticate with `getUserIdOrSetError`; discovery introduces no owner, role, tenant,
  or inactive-data bypass.
- **DES-014 — Stable bounded pagination.** The route retains the 1–100 limit and ID cursor response
  shape, but orders by `name ASC, id ASC` so equal names have deterministic order. Every discovery
  request sends the active `categories`/search criteria with a bounded page size of 24. Load more
  appends only the returned current-criteria page, deduplicated by exercise ID, until `nextCursor` is
  null. The v1 completeness guarantee applies to a fixed catalog; administrator edits between page
  requests are not a snapshot guarantee.
- **DES-015 — Criteria identity and stale responses.** The client derives a criteria key from mode,
  sorted selected groups, and trimmed search. A criteria-key change clears displayed result pages and
  cursor, debounces name search by 250 ms, cancels the prior request where supported, and increments a
  request generation. A response may update visible results, cursor, loading, or error state only if
  both its criteria key and generation still equal the current request. Load-more cannot run while an
  initial or page request is pending.
- **DES-016 — Visible recovery states.** Initial loading, current-criteria no matches, initial failure,
  page loading, and page failure must be distinct. Retry repeats the failed request with the same
  criteria. Initial failure must not show old results as current matches. Page failure keeps already
  loaded current results and cursor so retry can resume. Status changes use an appropriate live region,
  and no request-state transition changes chosen exercises or workflow values.

### Flow integration and compatibility

- **DES-017 — Live setup.** `WorkoutCreateForm` uses muscle-guided discovery only for `LIVE` setup.
  Selection remains local until the existing explicit submit sends ordered exercise IDs to
  `createWorkout`. Diagram or result interaction must not call a workout mutation, start a timer, or
  change the date/name. Empty live start remains available, and server validation remains authoritative
  for the 50 unique active-exercise limit.
- **DES-018 — Private-plan creation.** Member creation in `WorkoutPlanForm` uses muscle-guided
  discovery and the existing prescription editor. Existing member-plan edit and all administrator plan
  create/edit paths retain the current search-led picker in this change; their initial selections and
  prescriptions must remain intact. Only explicit form submission creates or updates a plan, and the
  existing 1–100 prescription validation remains authoritative.
- **DES-019 — Past-workout drafts.** `WorkoutExerciseEditor` enables muscle-guided discovery only when
  the loaded workout has `entryMode === "QUICK_ENTRY"`, is not completed, and is being edited on
  `/workouts/[id]/edit`. Add invokes the existing owner-scoped add-exercise endpoint and reloads the
  workout without remounting discovery. An add failure must be shown beside discovery and must retain
  the selected filters, loaded results, workout metadata, existing exercises, and sets. Discovery must
  not update, resume, or complete the workout.
- **DES-020 — Existing consumer compatibility.** The live-session editor, non-quick-entry workout
  editor, completed-workout view, member plan editor, administrator plan forms, standalone catalog,
  direct exercise start, and saved-plan start keep their current entry and mutation behavior. Calls
  omitting `categories` receive the existing single-category or unfiltered semantics. Selected or
  persisted exercises outside current discovery filters remain rendered by their owning workflow.
- **DES-021 — Submission races.** If an exercise becomes inactive after discovery, existing workout
  and plan write validation must reject the explicit mutation without partial aggregate creation or
  replacement. The UI must surface the failed save/start/add and retain local selections and entered
  values for correction or retry; it must not silently remove the unavailable exercise.

### Data and interaction flow

1. The member selects a diagram region or its labeled equivalent; both update the same ordered set of
   canonical muscle groups.
2. `ExerciseDiscovery` converts sorted selected groups and trimmed name search into a criteria key and
   calls the shared Axios wrapper with `categories`, `search`, and `limit=24`.
3. The authenticated handler validates the query, applies active visibility plus category-union/name
   predicates, and returns a deterministic bounded page and cursor.
4. Only the current criteria generation renders the response. Load more repeats the same criteria and
   cursor; retry repeats the failed initial/page request.
5. Add passes the exercise to the owning workflow. Live/plan creation update caller-local selection;
   quick entry uses the existing owner-scoped mutation then reloads. No discovery-only action writes.
6. The workflow's existing explicit start, save, add, set-save, or complete operations remain the only
   persistence and lifecycle transitions.

### Technical choices and consequences

| Decision | Selected approach | Rejected alternative / consequence |
| --- | --- | --- |
| Selectable body | Local inline SVG geometry with semantic interactive regions and separate equivalent labeled controls | A raster image map scales and focuses poorly; canvas lacks useful native semantics; a third-party anatomy package adds provenance, bundle, and runtime risk. Original SVG geometry requires deliberate visual QA and is illustrative rather than medical guidance. |
| Catalog matching | Exact union of existing broad `Exercise.category` values | Primary-muscle normalization or secondary-muscle inference would expand classification policy and require reclassification evidence. Exact categories are deterministic but hosted coverage must be inspected. |
| API surface | Optional plural filter on the existing authenticated list route | A second discovery endpoint would duplicate visibility, search, and paging rules. The additive route keeps callers compatible but makes validator and wrapper regression tests mandatory. |
| Paging | Existing ID cursor response with deterministic name/ID ordering and client ID deduplication | Fetching the whole catalog would violate bounded-list behavior; offset paging is more sensitive to inserts. Cursor paging does not promise a transactionally frozen snapshot across concurrent administrator edits. |
| Stale requests | Abort where supported plus criteria key and generation guard | Abort alone is insufficient because completion can race cancellation. The generation check adds client state but makes obsolete success and failure responses harmless. |
| Past entry | Reuse the existing quick-entry draft editor and add endpoint | Selecting before the draft exists would change create-workout semantics and risk coupling unsaved sets to a new aggregate. Post-create discovery adds one navigation step but preserves the approved lifecycle. |
| Rollout | Same-release UI and backward-compatible API with no flag | A flag would add configuration and dual-path verification without a migration or external dependency to stage. Recovery is code rollback because no stored representation changes. |

### Error contract

| Condition | Required behavior |
| --- | --- |
| Invalid/mixed `category` and `categories` input | Existing validation error envelope, HTTP 400; no query |
| Signed out, disabled, or deleted account | Existing authentication/account guard response; no catalog data |
| Initial catalog request fails | Replace loading with failure and Retry; do not present prior-criteria results |
| Load-more request fails | Keep current loaded page(s), show page-level failure and Retry, retain cursor |
| Response arrives for obsolete criteria | Ignore it completely, including errors and loading completion |
| No active matches | Current-criteria empty state; preserve chosen exercises and allow criteria change |
| Add/start/save rejects inactive exercise | Show mutation failure, preserve local work, and rely on existing transactional/owner validation |
| SVG unavailable | Keep all labeled muscle toggles, search/results, and status messages usable |

## Boundaries

| Area | Paths / identifiers |
| --- | --- |
| Shared UI | New `src/components/exercise-discovery/ExerciseDiscovery.tsx`, `MuscleBodyDiagram.tsx`, labeled controls, result list, and local state hook; existing `WorkoutExercisePicker.tsx` composes it |
| Flow wiring | `src/components/workouts/WorkoutCreateForm.tsx`, `WorkoutExerciseEditor.tsx`, `src/components/workout-plans/WorkoutPlanForm.tsx`, and `/workouts/[id]/edit` context |
| API / validation | Existing `GET /api/exercises/get-exercises`; `validateExerciseQuery`; `getExercises` and query/response types |
| Shared classification | New `src/utils/exerciseDiscovery.ts`; exact twelve-group order and category mapping |
| Data | Read-only filtering of `Exercise.category` and `Exercise.isActive`; no schema, migration, seed, workout, plan, prescription, or set representation change |
| Authentication / authorization | Existing member guard for catalog reads and existing owner-scoped workout/plan mutations; no new role or authority |
| Tenants / tiers | One global active exercise catalog for all authenticated members; no tier, tenant, commercial, or entitlement variation |
| Excluded consumers | Standalone catalog redesign, live-session discovery, existing workout/plan edit redesign, admin catalog/plan UX, analytics, and catalog reclassification |

## ADR alignment

- [ADR-0001](../../../engineering/decisions/0001-nextjs-pages-router-monolith.md) remains governing:
  components, Pages Router API handling, and shared types ship in the existing monolith.
- [ADR-0004](../../../engineering/decisions/0004-postgresql-prisma.md) remains governing: the existing
  handler uses the shared Prisma client. No new persistence or migration is introduced.
- [ADR-0005](../../../engineering/decisions/0005-shared-axios-browser-client.md) remains governing: all
  browser requests continue through `src/utils/spec.ts`, with request/response shapes in
  `src/utils/types.ts`.
- No accepted decision is superseded, and no new durable architecture decision requires an ADR.

## Operations

| Concern | Link or N/A |
| --- | --- |
| Vendors | N/A — no external service, remote artwork, package, credential, or vendor data flow is added |
| Data / migration | N/A — query-only use of existing exercise classification; no Prisma schema change, migration, seed, or backfill |
| Deployment / flags | Same application deployment under the [deployment runbook](../../../engineering/operations/deployment-runbook.md); no environment variable or feature flag |
| Asset verification | Inline vector geometry is type-checked and component-tested; existing `verify:assets` still runs but no new public raster asset is registered |
| Release evidence | Before deployment readiness is claimed, inspect the authorized target catalog for active coverage of all twelve exact categories and record counts; unknown hosted state remains explicit |
| Recovery | Roll back the application revision. The additive query is optional and no stored data needs reversal; older callers remain valid throughout |

## Test mapping

Binding tests use the named requirement/design IDs in their test names. Exact test file splitting may be
refined in Tasks without changing the behaviors below.

| Rule ID / summary | Test (file or describe block) | Layer |
| --- | --- | --- |
| EXERCISE-010, DES-001, DES-004 | `MuscleBodyDiagram.test.tsx`: front/back union exposes exactly twelve canonical groups and repeated regions share state | component |
| EXERCISE-010, A11Y-005, DES-005–DES-007 | `MuscleBodyDiagram.test.tsx`: pointer and keyboard toggles, pressed/name synchronization, visible non-color state, labeled fallback; manual 360px/desktop/200%/light/dark matrix | component + manual |
| EXERCISE-011, DES-002, DES-003, DES-013 | `get-exercises.test.ts`: Chest+Triceps union, Back subregions, no duplicates, no secondary-muscle inference, inactive exclusion, browse-all Full Body/unknown category | API integration |
| DES-012 | `exercise.test.ts`: accepts canonical comma list; rejects mixed singular/plural, empty, duplicate, array, unknown, and over-limit inputs; legacy query remains valid | unit |
| EXERCISE-012, DES-014 | `get-exercises.test.ts`: stable name/id cursor pages reach every fixed-catalog match once and preserve bounded limits | API integration |
| EXERCISE-012, EXERCISE-015, DES-015 | `ExerciseDiscovery.test.tsx`: criteria change resets pages; out-of-order success/failure cannot replace current criteria; search is trimmed/debounced | component |
| EXERCISE-013, DES-009 | `ExerciseDiscovery.test.tsx`: prompt makes no request, Browse all omits categories, clear returns to prompt, selecting from all resumes muscle mode | component |
| EXERCISE-014, DES-008, DES-010, DES-011 | Picker/plan/editor tests: filters/view/search/page/retry never mutate chosen IDs, order, prescriptions, metadata, or sets; only explicit Add/Remove does | component |
| EXERCISE-015, DES-016 | `ExerciseDiscovery.test.tsx`: distinct initial/page loading, empty, initial failure, page failure, retry, live status, and preservation of loaded current pages | component |
| WORKOUT-018, DES-017 | `WorkoutCreateForm.test.tsx`: discovery actions make no mutation; explicit valid submit sends ordered IDs; empty start remains; error retains form selection | component |
| WORKOUT-018, WORKOUT-002/003, DES-017, DES-021 | Existing/new workout create API tests: 50 unique active maximum, inactive rejection, and transactional no-partial-create behavior | API integration |
| PLAN-014, DES-018 | `WorkoutPlanForm.test.tsx`: member create discovers/adds/configures then saves; discovery preserves prescriptions; edit/admin paths retain compatibility | component |
| PLAN-004–PLAN-007, DES-018, DES-021 | Existing/new plan validator/API tests: 1–100 prescriptions, values, active IDs, owner scope, and transaction rollback | unit + API integration |
| WORKOUT-019, DES-019 | `WorkoutExerciseEditor.test.tsx`: only editable quick-entry page enables discovery; Add uses existing endpoint; failure/reload retain criteria, exercises, sets, metadata | component |
| WORKOUT-004–WORKOUT-008/011, DES-019 | Manual quick-entry flow: draft metadata/date/duration survive discovery, set recording, and explicit completion; discovery never resumes/completes | E2E/manual |
| EXERCISE-001, SEC-001–SEC-005, DES-013 | `get-exercises.test.ts` adversarial cases plus existing owner API tests: signed-out/account denial, inactive query manipulation, cross-user workout/plan denial | API integration |
| EXERCISE-006, WORKOUT-005, PLAN-008/011, DATA-002, DES-020 | Compatibility suite/manual smoke: direct exercise start, saved-plan start, live/non-quick edit, plan edit/admin form, standalone catalog legacy query, historical values | component + API + manual |
| DES-021, DATA-006 | Start/save/add race tests force inactive-after-selection and assert visible failure, unchanged local values, and no partial aggregate | component + API integration |

### Acceptance-criterion coverage

| Proposal criterion | Implemented by | Planned evidence |
| --- | --- | --- |
| AC-01 — Entry and coverage | DES-001, DES-004, DES-009, DES-017–DES-019 | Diagram/prompt component tests plus live-create, member-plan-create, and quick-entry manual entry checks |
| AC-02 — Selection consistency | DES-001, DES-005, DES-009, DES-013 | Component Chest+Triceps toggle/view test and API union/deduplication test |
| AC-03 — Broad groups | DES-002, DES-003, DES-013 | API fixtures for all twelve categories, Back subregions, and negative secondary-muscle-only match |
| AC-04 — Whole-catalog fallback | DES-003, DES-009–DES-011 | Component prompt/Browse all/clear transition test with chosen-work preservation and API Full Body/unknown-category fixtures |
| AC-05 — Search and pagination | DES-012, DES-014, DES-015 | Validator tests, multi-page fixed-catalog API test, and component criteria-reset/out-of-order-response test |
| AC-06 — Preserve work | DES-008, DES-010, DES-011 | Picker/plan/editor tests retaining order, prescriptions, sets, and off-filter selections; duplicate Add disabled |
| AC-07 — Live start | DES-017, DES-021 | Form test proving no pre-submit mutation, ordered/empty submit cases, and create API limit/inactive/transaction tests |
| AC-08 — Plan creation | DES-018, DES-021 | Member plan form add/prescription/save test and plan validator/API transaction tests |
| AC-09 — Past entry | DES-019, DES-021 | Quick-entry editor add/failure test and authenticated manual draft-to-completion lifecycle check |
| AC-10 — Request states | DES-015, DES-016 | Component initial/page loading, empty, error/retry, stale response, and page-preservation tests |
| AC-11 — Accessible interaction | DES-005, DES-006, DES-016 | Keyboard/accessibility-query component tests, screen-reader status review, and SVG-absent labeled-control check |
| AC-12 — Responsive appearance | DES-006, DES-007 | Manual 360px/desktop/200% matrix in light/dark themes with touch/no-hover operation |
| AC-13 — Security and unavailable exercises | DES-013, DES-017–DES-019, DES-021 | Signed-out/account-state/inactive API adversarial tests, existing owner-boundary tests, and inactive-after-selection race tests |
| AC-14 — Compatibility | DES-012, DES-018, DES-020 | Legacy query tests plus direct exercise, saved plan, live/non-quick workout edit, plan edit/admin, and history smoke checks |

### Design review gate

Before Tasks may begin, review must confirm:

- the exact twelve-category mapping against representative repository fixtures and authorized hosted
  catalog counts;
- the inline SVG geometry exposes every promised front/back target without implying side-specific
  selection;
- the optional query remains compatible with every current `getExercises` caller;
- every `must not` above has its negative test retained in the task plan; and
- Keerthan K can teach back the three integration boundaries, Browse-all behavior, stale-response rule,
  and recovery plan.

---

*Upstream review: Keerthan K — 2026-09-19*

*Scope: design*

*Teach-back: confirmed — task reply “approved” to the Design summary covering the selectable
front/back SVG and equivalent controls, twelve-category mapping, compatible multi-category API and
pagination, stale-request recovery, three-flow integration boundaries, compatibility, recovery, and
acceptance-criterion test mapping.*

Approval authorizes the separate Tasks phase. It does not authorize implementation or
release.
