---
id: change-2026-09-18-muscle-guided-workout-start
title: Muscle-guided workout start
status: archived
authority: temporary
mode: full-sdd
phase: proposal
opened: 2026-09-18
archived: 2026-09-19
affected_prds:
  - specs/prds/domains/workout-engine.md
  - specs/prds/domains/exercise-catalog.md
  - specs/prds/domains/workout-plans.md
  - specs/prds/system-qualities.md
affected_sdds:
  - specs/engineering/features/workout-engine.md
  - specs/engineering/features/exercise-catalog.md
  - specs/engineering/features/workout-plans.md
  - specs/engineering/architecture/frontend-architecture.md
affected_decisions: [ADR-0001, ADR-0004, ADR-0005]
---

# Proposal: Muscle-guided workout start

> **Layer:** *what* — intent, scope, and **PRD delta**. Canonical PRDs remain unchanged until Archive.
>
> **Policy:** `proposal.md` records *what*. A later `design.md` records *how*, and `tasks.md` records atomic Apply steps without adding requirements.
>
> **Prerequisite:** Signed [Clarify](clarify.md), approved 2026-09-19.

---


## Intent and scope

### Clarification source

[Clarify](clarify.md) was approved by Keerthan K on 2026-09-19, including multiple-muscle selection. The owner confirmed that members choose exercises from matching results and that delivery covers live-workout start, workout-plan creation, and past-workout entry.

The current exercise picker begins with name search and loads only the first 12 results. Catalog categories already represent broad muscle groups, but primary-muscle text includes finer regions. Quick entry uses a different editor after draft creation. These findings require consistent discovery across the three flows, complete matching beyond the first result page, and preservation of each flow's existing data behavior.

Actual hosted catalog coverage remains unknown. The proposal uses existing broad catalog classifications, excludes inferred secondary-muscle targeting, and requires mapping evidence before release. Asset geometry and technical integration are Design responsibilities.

### Proposed outcome

Members can choose the muscles they want to train on a complete front/back human-body diagram, see matching active exercises, and explicitly add the exercises they want. They can select multiple groups, switch between body views, and refine results without losing their work.

The same discovery behavior is available while starting a live workout, creating a private workout plan, and adding exercises to a past-workout draft. Existing session details, plan prescriptions, set entry, ownership, and lifecycle remain governed by their current contracts.

### High-level approach

Provide a consistent muscle-selection and exercise-discovery experience across the three approved entry points. Keep muscle filters separate from the exercises and data the member has chosen. Treat the front/back diagram and labeled controls as two ways to manipulate the same selection.

Use existing broad exercise classifications as the discovery boundary. Retrieve matching active catalog records across bounded pages rather than filtering only an already-loaded partial list. Continue using each workflow's existing explicit add, save, start, and complete actions.

The Design phase will specify component ownership, anatomical geometry and provenance, exact category mapping, query compatibility, pagination ordering, request cancellation/staleness handling, accessible interaction, consumer integration, and recovery. This Proposal does not select routes, schemas, libraries, or a rendering algorithm.

### Alternatives

1. **Selectable body plus equivalent labeled controls and optional search — recommended.** Meets the visual discovery request, supports multiple groups, and remains usable for known-exercise search and assistive technology. Costs include anatomical interaction work, catalog mapping, and cross-flow verification.
2. **Muscle list/dropdown with a decorative body — reject.** Reuses catalog categories with less interaction work, but members cannot directly select muscles on the diagram, so it fails the central requested outcome.
3. **Automatic workout generation from selected muscles — outside approved scope.** Reduces individual exercise decisions but requires programming, suitability, equipment, and prescription rules; the owner explicitly chose manual exercise choice from matching results.
4. **Roll out only on live-workout start — reject as final delivery.** Reduces initial integration work but leaves plan creation and past entry unchanged, contrary to the owner's all-three-flow decision. It may be an internal implementation increment, not a completed release of this proposal.

## Non-goals

- Automatic exercise selection, workout generation, suggested sets/reps, progression rules, medical guidance, or personalized recommendations.
- Individual anatomical subregions, side-specific targeting, 3D bodies, body scanning, or body-shape customization.
- Persistent muscle preferences, muscle-target analytics, new tracking metrics, or changes to saved workout/plan identity.
- Reclassifying the full catalog, inferring secondary-muscle relationships, or introducing a database migration or backfill as part of this scope.
- Redesigning the standalone exercise-catalog page, administration, plan library, or existing workout lifecycle. Its current pagination limitation is not part of this change.
- Requiring a muscle selection before starting an empty live workout or before using direct exercise/plan start.
- A new external service or a new authorization model.

## Iteration plan

### v1 (this change)

- Make a directly selectable human-body diagram the primary exercise-discovery entry point in all three approved flows. A muscle dropdown or a decorative image alone is insufficient.
- Cover twelve groups: Chest, Back, Shoulders, Biceps, Triceps, Quadriceps, Hamstrings, Glutes, Calves, Abs, Traps, and Forearms. Front/back views together expose every group; groups visible in both views represent one selection. Left and right sides represent the same group.
- Allow any combination of these groups. Results match any selected group, not necessarily every selected group. Show each matching catalog exercise once in discovery results.
- Match the existing broad catalog group, including exercises whose primary-muscle description names a subregion. Selecting Back includes catalog Back exercises described as Lower lats or Middle back. Do not infer matches from exercise names, compound status, or secondary-muscle involvement.
- Show selected group names and an explicit way to deselect each group or clear the selection. Changing body view preserves muscle selection.
- On initial entry, prompt the member to select muscles and provide a visible Browse all exercises alternative. No exercise is automatically added. Clearing all groups returns to that prompt; explicit Browse all clears group filtering and exposes the active catalog.
- Retain optional name search. In muscle-selection mode it narrows matching results; in Browse all it searches all active exercises. Loading additional results preserves the active discovery criteria.
- Keep Full Body catalog entries and unrecognized catalog groups available through Browse all/search. The complete body illustration does not introduce a selectable Full Body muscle, a select-all shortcut, or automatic whole-body programming.
- Provide access to all matching results, including matches beyond the first page. Preserve explicitly added exercises, their order, and associated inputs when discovery criteria change.
- Provide synchronized labeled controls for members who cannot use the diagram, keyboard operation, visible focus, touch usability, and non-color selection feedback.
- Cover request loading, no matches, request failure/retry, rapid selection changes, unavailable exercises at submission, and usable discovery if body artwork cannot be displayed.
- Verify compatibility for shared plan-edit and workout-edit consumers, existing live-session editing, and starting directly from an exercise or saved plan.

### v2 (after user feedback — separate feature request)

- Secondary-muscle inference, finer anatomical subregions, and side-specific targeting.
- Persistent muscle preferences, target analytics, and new tracking metrics.
- Automated workout construction, progression, prescriptions, or personalization.
- Catalog-wide reclassification or schema/backfill work, if later evidence establishes a separate need.

## Upstream audit

| Check | Result | Notes |
| --- | --- | --- |
| Specs read | complete | Workout Engine, Exercise Catalog, Workout Plans, System Qualities, related SDDs, and Verification Matrix |
| ADR alignment | pass | ADR-0001, ADR-0004, and ADR-0005 remain governing |
| Compliance | pass | Existing authentication, ownership, data-integrity, and accessibility requirements remain applicable |
| Blocking questions | none | Clarify decisions are resolved; hosted catalog coverage is release evidence, not a scope blocker |

### Risk and compatibility assessment

- **Security/privacy:** No new identity, role, or data-sharing boundary. Catalog visibility and member ownership remain server-enforced. No additional personal information or persistent body-selection history is collected.
- **Data integrity:** Discovery itself is read-only. Explicit exercise additions and saves use existing domain operations. Filter changes must not reconstruct or erase prescription/set data. Existing exercise IDs and historical records remain intact.
- **Classification:** Free-text and unknown categories may not map to the twelve groups. Browse all keeps them reachable; Design must make mapping deterministic and document exclusions. If adequate mapping requires reclassification/backfill, return to Proposal instead of silently expanding scope.
- **API compatibility:** Any discovery contract change must preserve existing callers and listing limits. Pagination must not omit matches under a fixed catalog. Detailed behavior during concurrent catalog edits belongs in Design.
- **Accessibility/UI:** Small and overlapping anatomical areas, front/back duplication, and color-only feedback are key risks. Named equivalent controls, responsive geometry, and keyboard/screen-reader verification are release requirements.
- **Assets/dependencies:** Existing body images do not prove interactive suitability. Design must establish usable, appropriately licensed/provenanced assets or original geometry. No external service or runtime dependency is approved here.
- **Migration/external configuration:** None is currently required or proposed. Hosted data coverage has not been verified. No Firebase, hosting, credential, or database configuration change is assumed.
- **Deployment/recovery:** Application and any additive discovery support must remain compatible with existing callers. Recovery must restore previous discovery behavior without deleting workouts, plans, prescriptions, or sets. Exact release/recovery steps belong in Design.

### Delivery and rollout constraints

1. Obtain Proposal approval before preparing detailed Design. Design and Tasks retain their separate gates before implementation.
2. Design must resolve interactive body representation, all twelve group mappings, three-flow integration, shared-consumer compatibility, result completeness, failure handling, and accessible controls before implementation is authorized.
3. Keep implementation increments internally verifiable, but do not mark the feature complete until all three approved flows satisfy the acceptance criteria.
4. Use representative active/inactive and category/subregion fixtures for automated verification. Inspect target-environment catalog coverage through an authorized source before claiming deployment readiness; record unavailable evidence explicitly.
5. Verify with the relevant checks from the [Verification Matrix](../../../engineering/quality/verification-matrix.md): focused component/handler/validator tests where affected, lint, typecheck, build, asset checks, and manual responsive/accessibility/authenticated flow checks. Direct binding-requirement tests include their stable IDs.
6. During Verification, synchronize the four affected PRDs and their SDDs, API documentation if its contract changes, asset documentation if introduced, and product feature inventory. Preserve canonical verification dates until supported by evidence.
7. Verification and Archive require their normal approvals. Until then the package remains active, and no completed implementation or release is claimed.

## PRD delta

The following additions were approved for this change on 2026-09-19. IDs were checked against current domain requirements; canonical PRDs remain unchanged during Design. No existing requirement is retired or materially rewritten.

### Exercise Catalog PRD additions

Source and eventual home: [Exercise Catalog PRD](../../../prds/domains/exercise-catalog.md).

- **EXERCISE-010 — Selectable body discovery.** In muscle-guided discovery, the system must present a complete human-body diagram with front and back views that together allow selection and deselection of Chest, Back, Shoulders, Biceps, Triceps, Quadriceps, Hamstrings, Glutes, Calves, Abs, Traps, and Forearms. Selection must persist when the member changes body view, and selected groups must be identifiable by name.
- **EXERCISE-011 — Multiple-group matching.** When one or more muscle groups are selected, the system must show active exercises classified in any selected broad catalog group, including its primary-muscle subregions, with each exercise appearing once in the results. It must not infer additional matches solely from secondary-muscle involvement.
- **EXERCISE-012 — Complete and refinable results.** Members must be able to reach every matching active exercise across result pages. Optional name search must narrow the current group results, and changing discovery criteria must not mix results from different criteria.
- **EXERCISE-013 — Explicit unfiltered browsing.** Before muscle selection, the system must prompt for a selection and offer Browse all exercises. Clearing muscle selections must restore that prompt. Choosing Browse all must clear muscle filtering and make all active catalog groups, including Full Body and unmapped groups, reachable through browsing and name search.
- **EXERCISE-014 — Discovery preserves user work.** Changing muscles, body view, name search, or result page must not add or remove chosen exercises, change their order, or discard entered workout sets or plan prescriptions. Adding or removing an exercise must require the corresponding explicit member action.
- **EXERCISE-015 — Recoverable discovery states.** Discovery must distinguish loading, no matches, and request failure, offer retry after request failure, and prevent obsolete results from being presented as matches for the current criteria. These states must preserve chosen exercises and entered data. If the body illustration is unavailable, labeled muscle controls must remain usable.

### Workout Engine PRD additions

Source and eventual home: [Workout Engine PRD](../../../prds/domains/workout-engine.md).

- **WORKOUT-018 — Muscle-guided live setup.** Before starting a custom live workout, a member must be able to use muscle-guided discovery and explicitly choose active exercises. Discovery alone must not create a workout or start its timer. Starting without exercises must remain available subject to existing session-detail validation.
- **WORKOUT-019 — Muscle-guided past-workout entry.** When adding exercises to a past-workout draft, a member must be able to use muscle-guided discovery while retaining the draft's metadata, exercises, order, and entered sets. Discovery must not start a live workout, complete the draft, or alter its recorded date or duration.

### Workout Plans PRD addition

Source and eventual home: [Workout Plans PRD](../../../prds/domains/workout-plans.md).

- **PLAN-014 — Muscle-guided plan creation.** While creating a private workout plan, a member must be able to use muscle-guided discovery to choose active exercises and then configure the existing exercise prescriptions. Discovery must not discard entered plan details or prescriptions, and selecting a muscle must not create a plan or start a workout.

### System Qualities addition

Source and eventual home: [System Qualities](../../../prds/system-qualities.md).

- **A11Y-005 — Accessible muscle selection.** Every muscle offered by the body diagram must also be selectable and deselectable through labeled controls with equivalent results. Muscle selection, view switching, and clearing must be operable by keyboard, have visible focus and understandable accessible names/states, and remain usable by touch on supported mobile layouts. Selection must not rely on color alone, and discovery-state changes must be available to assistive technology.

### Unchanged dependencies

- EXERCISE-001 through EXERCISE-009 continue to govern visibility, existing search/filter capabilities, information, identity, direct start, bounded listing, and image fallback. New discovery does not remove category/equipment/movement filtering from existing consumers.
- WORKOUT-002 through WORKOUT-008 and WORKOUT-011 continue to govern creation, active unique initial exercises, live/past modes, exercise and set management, validation, and completion. Live creation retains its 50-exercise maximum; that maximum is not imposed on unrelated workflows.
- PLAN-002 and PLAN-004 through PLAN-008 continue to govern private ownership, 1–100 ordered prescriptions, prescription values, and updates. PLAN-011 and PLAN-012 continue to govern direct plan start and independent workout history. Result deduplication does not introduce a new persistence uniqueness rule for existing plan prescriptions.
- SEC-001 through SEC-006, DATA-001, DATA-002, DATA-005, and DATA-006 remain applicable. Muscle selection never changes authorization or grants access to inactive catalog data.
- A11Y-001 through A11Y-004 remain applicable; A11Y-005 makes the new interaction's keyboard, touch, and nonvisual equivalence explicit.

### Acceptance criteria

All criteria below are planned evidence, not completed verification.

- [ ] **AC-01 — Entry and coverage (EXERCISE-010, WORKOUT-018, WORKOUT-019, PLAN-014):** In each of live setup, private-plan creation, and past-draft exercise entry, the member sees muscle-guided discovery before having to enter an exercise name. Front/back views together expose all twelve named groups. Initial state offers a selection prompt and Browse all.
- [ ] **AC-02 — Selection consistency (EXERCISE-010, EXERCISE-011):** Selecting Chest and Triceps marks both by name and shows the union of their active exercises without repeated results. Switching views retains both. Deselecting Chest leaves Triceps selected and removes chest-only matches from discovery results.
- [ ] **AC-03 — Broad groups (EXERCISE-011):** Back exercises with primary-muscle labels such as Lower lats and Middle back appear for Back. An exercise outside the selected catalog groups does not appear solely because a selected muscle is secondary. Fixtures cover every supported group and different primary-muscle labels.
- [ ] **AC-04 — Whole catalog fallback (EXERCISE-013):** Clearing all muscles restores the selection prompt without clearing already added exercises. Browse all removes group filtering; active Full Body and unmapped-category exercises are reachable there. Selecting a muscle from Browse all resumes filtering by that muscle.
- [ ] **AC-05 — Search and pagination (EXERCISE-012):** In a fixed catalog with more matches than one page, all matching exercises can be reached without omissions or repeated results. Name search narrows selected groups. Changing muscles or search restarts result discovery for the new criteria; results from the old criteria are not appended.
- [ ] **AC-06 — Preserve work (EXERCISE-014):** After adding exercises and entering applicable plan prescriptions or past-workout sets, changing groups, view, search, or page retains exercise order and all entered values. An already added exercise remains chosen even if it no longer matches the filter. Live setup cannot add the same exercise twice.
- [ ] **AC-07 — Live start (WORKOUT-018, WORKOUT-002, WORKOUT-003):** Muscle selection and browsing create no session and start no timer. Explicit start with valid details creates one session through the existing flow containing the selected exercises in order. Empty start remains possible. The existing 50-unique-active-exercise creation limit remains enforced.
- [ ] **AC-08 — Plan creation (PLAN-014, PLAN-004 through PLAN-007):** A member selects exercises through the body, configures prescriptions, and explicitly saves a private plan with those exercises and values. Discovery does not create a plan or start a workout. Existing 1–100 prescription and per-prescription validation limits remain enforced.
- [ ] **AC-09 — Past entry (WORKOUT-019, WORKOUT-004 through WORKOUT-008, WORKOUT-011):** After explicitly creating a past-workout draft, the member uses the body selector to add exercises, records the required tracking values, and completes through the existing lifecycle. Discovery preserves the date, duration, metadata, and recorded sets and does not implicitly resume or complete the workout.
- [ ] **AC-10 — Request states (EXERCISE-015, A11Y-002):** Loading, zero matches, and failed requests have distinct visible states. A failed request can be retried without losing work. With rapid selection changes and responses arriving out of order, only current-criteria results are usable as matches. An additional-page failure preserves loaded current results and chosen exercises.
- [ ] **AC-11 — Accessible interaction (A11Y-005, A11Y-003):** A keyboard-only member can select/deselect every group, change views, clear selection, browse results, and add an exercise. Focus is visible. Labeled controls and the diagram stay synchronized; selection and request status are understandable with a screen reader and without color. If the illustration fails, the labeled controls still provide the complete discovery flow.
- [ ] **AC-12 — Responsive appearance (A11Y-005):** At 360 CSS pixels wide and at desktop width, in light and dark themes, all twelve groups remain reachable, labels and actions are not clipped, and the workflow requires no page-level horizontal scrolling. At 200% browser zoom, the selection and result controls remain operable. Mobile selection does not depend on hover.
- [ ] **AC-13 — Security and unavailable exercises (EXERCISE-001, SEC-001 through SEC-005):** Signed-out, disabled, and deleted accounts remain denied by the existing member guards. Normal members cannot retrieve inactive exercises by manipulating discovery inputs, or modify another member's workout or plan. If an exercise becomes inactive after selection, the existing write validation rejects it visibly without a partially created aggregate or silently discarded selections.
- [ ] **AC-14 — Compatibility (EXERCISE-006, WORKOUT-005, PLAN-008, PLAN-011, DATA-002):** Starting from an exercise or saved plan, editing an existing private plan, and editing an existing/live workout continue to work. Exercises outside current filters retain their prescriptions and recorded sets. Existing catalog clients retain their prior behavior when no new discovery filtering is requested.

## Upstream links

| Kind | Link |
| --- | --- |
| Compliance | [System Qualities](../../../prds/system-qualities.md) |
| Commercial | N/A — no commercial contract or tier change |
| Product context (orientation) | [Product brief](../../../product/product-brief.md) and [feature catalog](../../../product/feature-catalog.md) |
| Existing PRDs | [Exercise Catalog](../../../prds/domains/exercise-catalog.md), [Workout Engine](../../../prds/domains/workout-engine.md), and [Workout Plans](../../../prds/domains/workout-plans.md) |

## Resolved questions

| Question | Resolution | Owner | Date |
| --- | --- | --- | --- |
| Discovery or automatic construction? | Members choose exercises from matching results; automatic construction is excluded. | Keerthan K | 2026-09-19 |
| Single or multiple groups? | Multiple groups use union matching without duplicate results. | Keerthan K | 2026-09-19 |
| Which v1 flows? | Live-workout start, workout-plan creation, and past-workout entry. | Keerthan K | 2026-09-19 |
| Meaning of “full body”? | Complete front/back selectable illustration; not the catalog's `Full Body` category or a select-all action. | Keerthan K | 2026-09-19 |

---

*Upstream review: Keerthan K — 2026-09-19*

*Scope: proposal*

*Teach-back: confirmed — task reply “Approved” to the Proposal summary covering selectable front/back muscles, multiple-muscle filtering, exercise choice across all three flows, preservation of entered data, and 14 acceptance criteria.*

Approval authorizes the separate [Design](design.md). It does not authorize implementation or release.
