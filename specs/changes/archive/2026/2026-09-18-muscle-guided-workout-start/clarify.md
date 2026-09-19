---
id: change-2026-09-18-muscle-guided-workout-start
title: Muscle-guided workout start
status: archived
authority: temporary
mode: full-sdd
phase: clarify
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
code:
  - src/pages/workouts/create.tsx
  - src/components/workouts/
  - src/components/workout-plans/
  - src/pages/api/exercises/
  - src/lib/api/validators/exercise.ts
  - src/utils/spec.ts
  - src/utils/types.ts
---

# Clarify: Muscle-guided workout start

> **Phase:** Clarify — decision record before delta files. This record was updated iteratively and signed
> before Proposal began. Design and Tasks remain gated on their required upstream reviews.
>
> **Canonical guide:** [Engineering workflow](../../../handbook/engineering-workflow.md#1-clarify).

---

## Feature request (input)

Keerthan K requested a Full SDD plan on 2026-09-18: when a member starts a workout, show a complete human-body diagram with selectable muscles, including biceps, chest, and back, and show exercises for the selected muscles instead of requiring the member to begin with manual exercise search.

This request initiates planning. No later phase has been approved, and application implementation has not started.

In follow-up answers, the owner confirmed that members choose exercises from matching results and that the first version covers all three flows: live-workout start, workout-plan creation, and past-workout entry. On 2026-09-19, the owner approved Clarify in response to the explicit request to proceed with multiple-muscle selection.

## Restatement

Starting a custom workout currently assumes that a member can find exercises by name in a search-led catalog. A member who knows the body area they want to train should be able to identify it visually and discover relevant exercises without already knowing exercise names. The body must be directly selectable; a decorative body image beside the existing search does not satisfy the request.

**Human approval:** Approved on 2026-09-19 by Keerthan K.

## Upstream audit

| Check | Result | Notes |
| --- | --- | --- |
| Specs read | complete | Workout Engine, Exercise Catalog, Workout Plans, System Qualities, related feature/architecture SDDs, and Verification Matrix |
| ADR alignment | pass | ADR-0001, ADR-0004, and ADR-0005 remain governing; no superseding ADR is currently required |
| Compliance | pass | Existing authentication, ownership, privacy, accessibility, and data-integrity requirements remain in force |
| Blast radius (`code` in frontmatter) | cross-domain | Workout setup, plan creation, past-workout entry, exercise discovery API/types, shared consumers, assets, and tests |
| Blocking questions | none | Product choices were resolved; hosted catalog coverage remains release evidence, not a Clarify blocker |

### Evidence

The following facts were verified by repository inspection on 2026-09-18; they are not claims about deployed behavior or hosted catalog contents.

- [The start page](../../../../src/pages/workouts/create.tsx) renders `WorkoutCreateForm` in live mode. [The form](../../../../src/components/workouts/WorkoutCreateForm.tsx) places session details before optional exercise selection and permits starting an empty workout.
- [The picker](../../../../src/components/workouts/WorkoutExercisePicker.tsx) requests 12 exercises with an optional name search, renders an add/remove selection list, and does not consume the returned continuation cursor. Filtering only those loaded results would miss catalog matches.
- [The exercise-list API](../../../../src/pages/api/exercises/get-exercises.ts) and [query validator](../../../../src/lib/api/validators/exercise.ts) support a single category, equipment, movement, search, limit, and cursor. There is no explicit muscle or multi-category filter today. Member listing authenticates and excludes inactive exercises.
- [The catalog](../../../../src/utils/workoutCatalog.ts) lists Chest, Back, Shoulders, Biceps, Triceps, Quadriceps, Hamstrings, Glutes, Calves, Abs, Traps, Forearms, and Full Body. These are catalog groupings, not a complete anatomical taxonomy.
- [The seed script](../../../../scripts/seed-exercises.mjs) sets primary muscle from `region` when present, otherwise category. [Back data](../../../../src/utils/exercises/back.json), for example, uses values such as Total back, Middle back, and Lower lats. A broad body-region selection cannot safely rely on primary-muscle text equaling the displayed region label.
- [The schema](../../../../prisma/schema.prisma) stores category and primary muscle as strings and secondary muscles as a string array. The [admin exercise form](../../../../src/components/admin/exercises/ExerciseAdminForm.tsx) permits free-text primary-muscle entry. Actual hosted values and coverage have not been inspected.
- [The workout-plan form](../../../../src/components/workout-plans/WorkoutPlanForm.tsx) reuses the picker. Quick entry uses the shared creation form without that picker, then adds exercises through [the exercise editor](../../../../src/components/workouts/WorkoutExerciseEditor.tsx), which is also used for session editing. Extending every flow would require additional scope.
- [Workout creation](../../../../src/pages/api/workouts/create-workout.ts) validates active exercise IDs and creates ordered workout exercises for the authenticated member. Live-session start time is recorded at creation, not while choosing exercises.
- [Existing creation tests](../../../../test%20cases/components/workouts/WorkoutCreateForm.test.tsx) check required name and date controls. They do not verify body selection, muscle matching, or interactive exercise selection.
- [Existing body imagery](../../../../public/images/muscle-groups/) supplies front/back muscle illustrations. [Asset resolution](../../../../src/lib/images/assetRegistry.ts) provides image fallbacks, not selectable anatomical regions. Existing imagery does not establish that suitable interactive geometry exists.

### Actors and affected outcomes

- Members starting custom live workouts: discover exercises by selecting body regions, review their selections, and start their session.
- Members using touch, keyboards, or assistive technology: identify and select the same muscle groups with understandable labels and selection state.
- Members creating workout plans or logging past workouts: use the same muscle-guided discovery while preserving plan prescriptions and past-workout set entry.
- Members editing existing plans or workouts, or using an existing live session: retain working exercise selection; shared consumers need explicit compatibility treatment.
- Catalog administrators: their existing exercise classifications determine discovery results; catalog editing is a possible dependency, not an approved expansion of scope.
- Maintainers: preserve workout identity, order, lifecycle, and API authorization while adding discovery behavior.

### Constraints

- Preserve [WORKOUT-002, WORKOUT-003, and WORKOUT-005](../../../prds/domains/workout-engine.md): valid session details, up to 50 unique active exercises at creation, normal live start, and owned exercise management. Any intentional change to these promises must be explicit in Proposal.
- Preserve [EXERCISE-001, EXERCISE-006, and EXERCISE-007](../../../prds/domains/exercise-catalog.md): active catalog visibility, starting from an exercise, and bounded paginated listing.
- Preserve [PLAN-004 through PLAN-008 and PLAN-011](../../../prds/domains/workout-plans.md): plan-specific prescription limits and editing, private ownership, and starting with prescribed sets. Preserve WORKOUT-004 quick-entry draft behavior. The workout creation limit must not be applied indiscriminately to plans or existing-session editing.
- Preserve [SEC-001, SEC-002, SEC-004, DATA-002, and DATA-006](../../../prds/system-qualities.md): authentication, ownership, server authority, historical workout integrity, and transactional aggregate creation. Selecting a body region is discovery, not authority to access or mutate a workout.
- Apply [A11Y-001 through A11Y-003](../../../prds/system-qualities.md) to mobile/desktop layouts, request states, and selection feedback. Keyboard and assistive-technology interaction needs explicit acceptance criteria in Proposal; color alone is insufficient.
- Follow the established Pages Router, MUI/theme, shared Axios/type, and shared Prisma boundaries under ADR-0001, ADR-0004, and ADR-0005. Planning does not authorize a new external service, anatomy library, schema migration, or data backfill.
- Tests remain under root `test cases/`. New binding requirements receive stable IDs during Proposal and trace to implementation verification.
- The current request concerns exercise discovery. Automatic programming, prescribed sets/reps, medical advice, personalized recommendations, and workout-plan generation are not assumed requirements.

### Initial blast radius

- Primary contracts: [Workout Engine PRD](../../../prds/domains/workout-engine.md), [Exercise Catalog PRD](../../../prds/domains/exercise-catalog.md), [Workout Plans PRD](../../../prds/domains/workout-plans.md), and [System Qualities](../../../prds/system-qualities.md).
- Primary designs: [Workout Engine SDD](../../../engineering/features/workout-engine.md), [Exercise Catalog SDD](../../../engineering/features/exercise-catalog.md), and [Frontend Architecture](../../../engineering/architecture/frontend-architecture.md).
- Plan design and compatibility review: [Workout Plans SDD](../../../engineering/features/workout-plans.md), covering creation, shared edit controls, and preservation of sets/rep ranges/rest prescriptions.
- Code investigation: workout start page/form/picker, plan form, exercise editor, catalog API/validator, `src/utils/spec.ts`, `src/utils/types.ts`, catalog classifications, asset handling, and workout creation validation.
- Test investigation: existing creation tests; candidate future coverage under `test cases/components/workouts/`, `test cases/components/workout-plans/`, `test cases/lib/api/validators/`, and `test cases/pages/api/exercises/`. These are planned coverage areas, not claims that all test files exist.
- Data investigation: determine whether existing category/region metadata adequately supports the approved groups before considering normalization or a migration. Do not rewrite exercise IDs or historical workout records.
- Verification and release: [Verification Matrix](../../../engineering/quality/verification-matrix.md), asset provenance/availability, mobile and keyboard interaction, and recovery to the previous discovery experience. No deployment configuration change is currently identified.

### Risks and Full SDD rationale

Full SDD was explicitly requested and is appropriate because exercise discovery spans the workout engine and exercise catalog, with a shared consumer in workout plans. The new interaction also needs explicit accessibility and classification semantics.

- Incorrect group mapping could show irrelevant exercises or hide valid ones, especially where broad labels and primary-muscle text differ.
- Filtering a partial client list could make a populated muscle group appear empty. Pagination and filter changes need explicit treatment.
- Front-only anatomy would make posterior groups difficult or impossible to select. Small or overlapping regions could fail on touch devices or keyboards.
- Discovery must work in both the initial-selection picker and the editor used after creating a quick-entry draft. Shared plan-edit and live-session consumers could change unintentionally. A new filter must not reset prescriptions or recorded sets.
- Rapid group changes and failed requests could show stale results or discard selected exercises unless the eventual design addresses them.
- Treating body selection as immediate workout creation could create unwanted sessions or start the timer prematurely.
- New anatomical assets require an approved source and usable geometry. Existing raster assets alone do not prove this requirement is met.

## Open questions

| Question | Status | Resolution / owner | Date |
| --- | --- | --- | --- |
| Exercise discovery or automatic construction? | resolved | Member chooses exercises from matching results; automatic construction is out of scope — Keerthan K | 2026-09-19 |
| One muscle or several? | resolved | Multiple groups; results use union matching without duplicates — Keerthan K | 2026-09-19 |
| Which flows change in v1? | resolved | Live-workout start, workout-plan creation, and past-workout entry — Keerthan K | 2026-09-19 |

### Owner choices

1. **Exercise discovery or automatic workout construction?** Resolved by the owner's task reply: show matching exercises for the user to choose. Automatic workout construction is outside scope.
2. **One muscle or several?** Resolved by the owner's Clarify approval on 2026-09-19: allow multiple groups, such as chest and triceps, and show exercises matching any selected group without duplicates.
3. **Which flows change initially?** Resolved by the owner's task reply: all three flows, covering custom live-workout start, workout-plan creation, and logging past workouts. Proposal must cover all three. Existing plan editing, live-session editing, and starting directly from an exercise or plan require compatibility coverage; their exact reuse behavior is a Design responsibility.

### Approved clarification bounds

These bounds were accepted with Clarify approval. They constrain Proposal but are not active canonical requirements or a technical design.

- Interpret “full body” in the request as the complete selectable human-body illustration. It does not automatically mean the existing `Full Body` catalog category or selecting every muscle. Any separate whole-body workout option must be defined explicitly in Proposal.
- Support front and back views so both anterior and posterior regions can be selected. Start with the twelve specific muscle groups represented by the catalog; anatomical subregions and left/right workout targeting are outside the first version unless requested.
- Use broad catalog group membership as the initial discovery meaning. Secondary-muscle inference is outside the initial boundary because coverage is not established; exact mapping remains a Design responsibility.
- Make the diagram the primary discovery interaction; retain optional search/browse as a fallback for known exercises and unmapped catalog items. Preserve the existing ability to start empty unless Proposal explicitly changes it.
- Retain explicitly added exercises when the member changes muscles or body view; changing a discovery filter should not silently remove session choices.
- Provide a labeled nonvisual selection equivalent. Visual style, asset source, and implementation approach remain open for Design; do not assume a new dependency or a generated image is necessary.
- Treat muscle choices as transient setup state initially. Persisting targets for analytics, plans, or future sessions would expand scope.
- Hosted catalog quality remains unknown. Resolve relevant mapping coverage before implementation/release through representative fixtures and, when available, authorized environment inspection; do not infer production data from seed files.

## Options

| Option | Product impact | Engineering cost | Risk | Recommendation |
| --- | --- | --- | --- | --- |
| Selectable body, labeled equivalent controls, and optional search | Satisfies visual discovery across all three requested flows | Medium–high | Cross-flow and accessibility complexity | Chosen |
| Decorative body plus dropdown | Lower implementation cost | Low | Does not satisfy direct body selection | Reject |
| Automatic workout construction | Reduces manual choice | High | Introduces programming and suitability rules outside the request | Defer beyond v1 |

**Chosen approach:** Selectable body with equivalent labeled controls and optional search, approved by Keerthan K on 2026-09-19.

## v1 scope

A member can start a live workout, create a workout plan, or log a past workout by recognizing and selecting muscles on a complete human-body diagram and choosing appropriate active exercises from the results, without needing to search by exercise name first. Each flow preserves its own session, prescription, or set-entry behavior. The experience remains usable on mobile, with a keyboard, and without relying on color alone.

### Definition of done

1. Clarify, Proposal, Design, and Tasks complete their separate required gates. Proposal resolves the owner choices, defines measurable acceptance criteria, and identifies requirement additions or amendments; Design specifies matching, interaction, request behavior, compatibility, and rollout/recovery.
2. The approved body-selection flow is implemented across workout start, plan creation, and past-workout entry with front/back coverage, clear labels and selection state, and equivalent accessible controls.
3. Matching is verified across supported groups, combined selections if approved, category/region differences, catalog pages, unmapped items, and inactive exercises. Loading, empty, failed, and stale-request cases are covered.
4. New live-workout selection remains unique and ordered, respects creation limits, survives filter changes as approved, and starts only through the explicit start action. Plan prescriptions and quick-entry records keep their domain-specific limits and lifecycle; changing discovery filters does not discard prescriptions or saved sets. Existing ownership and active-exercise validation are preserved.
5. Focused requirement-driven tests and proportional lint/type/build/asset checks pass. Manual evidence covers mobile/desktop, light/dark appearance, touch, keyboard/focus, accessible labels, and all three authenticated flows.
6. Shared consumers and alternate starts receive compatibility verification. Any missing environment-dependent evidence is reported explicitly rather than marked passed.
7. Verification synchronizes affected canonical PRDs, SDDs, API/data documentation where changed, and the product feature inventory. Archive follows owner approval with no lasting rule left only in this package.

## Non-goals and v2

### Non-goals (not in this change)

- Automatic programming, prescribed sets/reps, medical advice, personalized recommendations, or generated workout plans.
- Individual anatomical subregions, left/right targeting, 3D bodies, body scanning, or body-shape customization.
- Persistent muscle preferences, target analytics, new tracking metrics, or a new authorization model.
- A catalog-wide reclassification, database migration, or backfill unless Design evidence forces a return to Proposal.

### v2 (separate feature request later)

- Secondary-muscle inference and finer anatomical targeting.
- Persistent targeting and analytics.
- Automated workout construction or personalization.

## PRD change decision

- [x] **PRD delta required** — new binding discovery outcomes are proposed for Exercise Catalog, Workout Engine, Workout Plans, and System Qualities.
- [ ] **No PRD change** — not selected.

**Human confirmation:** Keerthan K, 2026-09-19, through the signed Clarify decision authorizing Proposal.

## Accepted tradeoffs

| Original ask | What v1 ships instead | Why acceptable | Agreed by | Date |
| --- | --- | --- | --- | --- |
| “Full body” with selectable muscles including biceps, chest, and back | Complete front/back illustration covering twelve broad catalog groups; no subregions, side targeting, or automatic whole-body option | Preserves the requested visual discovery outcome while matching the existing catalog boundary | Keerthan K | 2026-09-19 |

---

## Human decisions (required before Propose)

- [x] **Restatement** — approved outcome matches the request.
- [x] **Upstream audit** — compliance passes and ADR alignment is recorded.
- [x] **Open questions** — no unresolved blocking questions remain.
- [x] **Approach** — selectable body, equivalent labeled controls, and optional search accepted.
- [x] **v1 scope** — all three requested flows and multiple-group selection approved.
- [x] **Non-goals / v2** — deferred work is explicit.
- [x] **PRD change** — PRD delta required.
- [x] **Tradeoffs** — broad-group v1 boundary accepted.

**Lock it — sign-off**

```text
Clarify approved: Keerthan K — 2026-09-19
Propose may begin.
```
