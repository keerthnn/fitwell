---
id: sdd-exercise-catalog
title: Exercise Catalog
status: active
authority: engineering
requirements: [EXERCISE-001, EXERCISE-002, EXERCISE-003, EXERCISE-004, EXERCISE-005, EXERCISE-006, EXERCISE-007, EXERCISE-008, EXERCISE-009, EXERCISE-010, EXERCISE-011, EXERCISE-012, EXERCISE-013, EXERCISE-014, EXERCISE-015, A11Y-005]
decisions: [ADR-0004, ADR-0005, ADR-0006]
code: [src/pages/exercises.tsx, src/components/exercises/, src/components/exercise-discovery/, src/utils/exerciseCatalog.ts, src/utils/exerciseDiscovery.ts, src/lib/images/assetRegistry.ts, src/pages/api/exercises/, src/pages/api/admin/exercises/, scripts/seed-exercises.mjs, scripts/verify-assets.mjs]
tests: [test cases/components/exercise-discovery/, test cases/lib/api/validators/exercise.test.ts, test cases/pages/api/exercises/get-exercises.test.ts]
last_verified: 2026-09-20
---

# Exercise catalog SDD

## Scope and goals

The catalog provides global exercise definitions to member discovery, workouts, plans, and administrator maintenance. Catalog records are not member-owned.

## User flow

`/exercises` requests active exercises with debounced search and equipment/category/movement filters. `ExerciseList` and `ExerciseCard` render image-led results. Starting from a card creates a live workout, adds the selected exercise, and routes to its live page.

Live-workout setup, member private-plan creation, and incomplete quick-entry editing additionally use `ExerciseDiscovery`. It begins with a selection prompt and Browse all action. A local front/back SVG and equivalent labeled controls update one multiple-muscle selection. Search narrows the current selection, and continuation loading makes every fixed-catalog match reachable. Member plan editing, administrator plan forms, live-session editing, and the standalone catalog retain their prior search-led entry points.

## Component responsibilities

- `ExerciseList` renders result collections and states.
- `ExerciseCard` presents classification/image metadata and start action.
- `ExerciseDiscovery` owns only body view, selected group filters, search, bounded pages, current-request states, and retry. Its caller owns chosen exercises and workflow values.
- Matching discovery rows show compact name-matched exercise thumbnails using the same `FitWellImage` and `resolveExerciseImageCandidates` pipeline as the Exercises page. A neutral fallback is reserved for a genuine image-load failure; image failures do not block selection or Add actions.
- Below muscle controls, image-based equipment buttons offer Barbell, Dumbbell, Kettlebell, Machine, Bodyweight, Cable, and an All equipment reset. Equipment buttons form a multiple selection whose union intersects the muscle/search criteria. One selected option retains the singular API parameter; two or more use the plural union parameter. Changing equipment resets result pages and invalidates old responses without changing chosen exercises. It applies to Browse all too; choosing equipment alone leaves the initial muscle-selection prompt unchanged. Buttons use existing equipment assets, accessible names, tooltips, focus outlines, and selected checkmarks.
- `MuscleBodyDiagram` renders repository-owned anatomical SVG regions in a charcoal panel, with blue selection highlights and all-twelve labeled controls. Front/back figures appear side by side when the component has at least 480px available; narrower containers use the front/back switch. Repeated front/back and bilateral regions share one selection state; selected state uses text, checked labels, and outline in addition to color. Hover highlighting is limited to hover-capable fine pointers so a touch deselection cannot leave a false blue highlight. Labeled controls retain 44px minimum heights and the diagram has visible keyboard focus.
- `FitWellImage` and asset helpers choose the approved exercise-specific WebP, followed only by an approved neutral fallback.
- Admin `ExerciseAdminForm` supplies create/edit classification and image-path inputs.

## API usage

Member GET list validates search/category/equipment/movement, limit, cursor, and optional comma-separated unions for the twelve selectable categories and six equipment types. Singular and plural forms of the same filter cannot be combined. Category union matching uses exact broad `category` values, not primary/secondary-muscle inference; equipment union matching accepts any selected canonical equipment value. Normal members remain restricted to active records. Results order by name then ID and retain the bounded cursor response. GET by ID restricts inactive visibility unless the caller is an admin requesting inclusion. Admin POST/PATCH/archive/restore manage lifecycle.

## Database usage

`Exercise` is unique by name/equipment and indexed by category/primary muscle/active state. Workouts and plan prescriptions reference it without cascade deletion; lifecycle uses `isActive` rather than hard delete.

## Failure handling and security

Member results exclude inactive exercises. Start rejects unavailable exercise IDs. Invalid filters return 400; inaccessible IDs return 404. Admin mutations require server admin access and audit lifecycle changes.

Discovery distinguishes initial/page loading, empty, initial/page failure, and retry. Criteria changes cancel prior work where possible and use a criteria-generation guard so obsolete success or failure responses cannot replace current results. A page failure retains already loaded current results. Browse all omits category filtering so Full Body and unknown categories remain reachable.

Raw trimmed search changes clear obsolete results immediately, before the debounce request runs. Diagram-only error boundaries leave all labeled controls usable if SVG rendering fails. Quick-entry additions are serialized; a successful add followed by a failed reload blocks further additions until refresh succeeds, avoiding an accidental duplicate retry. Refresh preserves unsaved workout name and notes.

## Edge cases and gaps

- The standalone member catalog does not consume subsequent cursor pages; muscle-guided discovery does.
- Repeated exercise in a workout is not prohibited by a database uniqueness constraint.
- Catalog seeding and asset verification exist but fresh-database execution is not recorded in this bootstrap.
- Discovery validator, active visibility/filtering, paging, and component states have focused tests. Seeding and asset-resolution paths still lack automated tests.

## Code map

| Responsibility | Code |
| --- | --- |
| Member page/components | `src/pages/exercises.tsx`, `src/components/exercises/` |
| Muscle-guided discovery | `src/components/exercise-discovery/`, `src/utils/exerciseDiscovery.ts` |
| Member APIs | `src/pages/api/exercises/` |
| Admin UI/API | `src/components/admin/exercises/`, `src/pages/system-admin/exercises/`, `src/pages/api/admin/exercises/` |
| Validation | `src/lib/api/validators/exercise.ts` |
| Tests | `test cases/components/exercise-discovery/`, `test cases/lib/api/validators/exercise.test.ts`, `test cases/pages/api/exercises/get-exercises.test.ts` |
| Assets/catalog data | `src/lib/images/assetRegistry.ts`, `src/utils/exerciseCatalog.ts`, `src/utils/exercises/`, `public/images/` |
| Seed/verify | `scripts/seed-exercises.mjs`, `scripts/verify-assets.mjs` |

## Related documents

[Exercise Catalog PRD](../../prds/domains/exercise-catalog.md), [Workout Engine SDD](workout-engine.md), [Workout Plans SDD](workout-plans.md), and [Administration SDD](administration.md).
