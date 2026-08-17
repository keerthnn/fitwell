---
id: sdd-exercise-catalog
title: Exercise Catalog
status: active
authority: engineering
requirements: [EXERCISE-001, EXERCISE-002, EXERCISE-003, EXERCISE-004, EXERCISE-005, EXERCISE-006, EXERCISE-007, EXERCISE-008, EXERCISE-009]
decisions: [ADR-0004, ADR-0005, ADR-0006]
code: [src/pages/exercises.tsx, src/components/exercises/, src/utils/exerciseCatalog.ts, src/lib/images/assetRegistry.ts, src/pages/api/exercises/, src/pages/api/admin/exercises/, scripts/seed-exercises.mjs, scripts/verify-assets.mjs]
tests: []
last_verified: 2026-08-15
---

# Exercise catalog SDD

## Scope and goals

The catalog provides global exercise definitions to member discovery, workouts, plans, and administrator maintenance. Catalog records are not member-owned.

## User flow

`/exercises` requests active exercises with debounced search and equipment/category/movement filters. `ExerciseList` and `ExerciseCard` render image-led results. Starting from a card creates a live workout, adds the selected exercise, and routes to its live page.

## Component responsibilities

- `ExerciseList` renders result collections and states.
- `ExerciseCard` presents classification/image metadata and start action.
- `FitWellImage` and asset helpers choose approved specific/equipment/muscle/fallback candidates.
- Admin `ExerciseAdminForm` supplies create/edit classification and image-path inputs.

## API usage

Member GET list validates search/category/equipment/movement, limit, and cursor and restricts to active records. GET by ID restricts inactive visibility unless the caller is an admin requesting inclusion. Admin POST/PATCH/archive/restore manage lifecycle.

## Database usage

`Exercise` is unique by name/equipment and indexed by category/primary muscle/active state. Workouts and plan prescriptions reference it without cascade deletion; lifecycle uses `isActive` rather than hard delete.

## Failure handling and security

Member results exclude inactive exercises. Start rejects unavailable exercise IDs. Invalid filters return 400; inaccessible IDs return 404. Admin mutations require server admin access and audit lifecycle changes.

## Edge cases and gaps

- Member UI does not consume subsequent cursor pages.
- Repeated exercise in a workout is not prohibited by a database uniqueness constraint.
- Catalog seeding and asset verification exist but fresh-database execution is not recorded in this bootstrap.
- No validator, visibility, seeding, or asset-resolution tests exist.

## Code map

| Responsibility | Code |
| --- | --- |
| Member page/components | `src/pages/exercises.tsx`, `src/components/exercises/` |
| Member APIs | `src/pages/api/exercises/` |
| Admin UI/API | `src/components/admin/exercises/`, `src/pages/system-admin/exercises/`, `src/pages/api/admin/exercises/` |
| Validation | `src/lib/api/validators/exercise.ts` |
| Assets/catalog data | `src/lib/images/assetRegistry.ts`, `src/utils/exerciseCatalog.ts`, `src/utils/exercises/`, `public/images/` |
| Seed/verify | `scripts/seed-exercises.mjs`, `scripts/verify-assets.mjs` |

## Related documents

[Exercise Catalog PRD](../../prds/domains/exercise-catalog.md), [Workout Engine SDD](workout-engine.md), [Workout Plans SDD](workout-plans.md), and [Administration SDD](administration.md).
