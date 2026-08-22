---
id: sdd-workout-plans
title: Workout Plans
status: active
authority: engineering
requirements: [PLAN-001, PLAN-002, PLAN-003, PLAN-004, PLAN-005, PLAN-006, PLAN-007, PLAN-008, PLAN-009, PLAN-010, PLAN-011, PLAN-012, PLAN-013, SEC-002, SEC-004, DATA-002, DATA-006, A11Y-002, A11Y-004]
decisions: [ADR-0004, ADR-0005]
code: [src/pages/workout-plans/, src/components/workout-plans/, src/pages/api/workout-plans/, src/lib/workoutPlans/access.ts, src/lib/api/validators/workout-plan.ts, scripts/seed-workout-plans.mjs, scripts/data/workout-plans.mjs]
tests: [test cases/components/workout-plans/, test cases/pages/api/workout-plans/, test cases/lib/api/validators/workout-plan.test.ts, test cases/prisma/workout-plan-lifecycle.test.ts]
last_verified: 2026-08-23
---

# Workout plans SDD

## Scope and goals

Workout plans are reusable ordered prescriptions. The domain separates active built-in plans maintained by administrators from private plans owned by a member, and creates independent workout data when a plan is started.

## Visibility model

`findVisibleWorkoutPlan` returns either an active owned non-built-in plan or an active, non-archived built-in plan with no owner. List applies equivalent visibility and excludes archived member plans by default.

## User flows

- `/workout-plans` lists visible plans with search.
- `/workout-plans/create` builds a private plan.
- `/workout-plans/[id]` displays plan details, prescriptions, start, named duplication, and owner actions. Duplication collects an editable destination name before creating data. Private-plan deletion requires a named irreversible-action confirmation.
- `/workout-plans/[id]/edit` updates an owned private plan.
- Archive uses the member endpoint; the endpoint also supports restore. Permanent deletion is a separate owner-only action and returns the member to the plan library after success.

## Components

`WorkoutPlanForm` manages basics and ordered prescriptions. `WorkoutPlanExercisePrescription` edits sets/rep range/rest. `WorkoutPlanList/Card` renders the library. `WorkoutPlanDetail` and `WorkoutPlanVisual` present details and cover resolution. `DuplicateWorkoutPlanButton` owns the copy-name dialog and request state; `DeleteWorkoutPlanButton` owns the irreversible confirmation and delete request state.

## API and database usage

Create validates 1–100 prescriptions and confirms all referenced exercises are active. Update first verifies owned/private, then transactionally deletes all prescriptions and recreates them with updated plan data. Archive toggles `isArchived` on owned private plans. Duplicate validates a caller-submitted required name of at most 120 characters, loads any visible source, and copies it into a private non-built-in aggregate owned by the caller.

Permanent delete uses a single conditional mutation constrained by plan ID, authenticated owner ID, and `isBuiltIn: false`. A zero-row result returns the same not-found response for absent, built-in, and cross-user targets. The database cascades plan prescriptions and nulls optional workout source-plan links; materialized workout exercises and sets remain independent.

Start-workout loads a visible plan and creates an `IN_PROGRESS` `PLAN` workout with `startedAt`, source-plan ID, ordered workout exercises, and the prescribed number of incomplete sets.

`WorkoutPlan` owns `WorkoutPlanExercise` by cascade. Started workouts retain a nullable source relation with `SetNull` on plan deletion.

## Failure handling and security

Member reads return 404 for inaccessible plans. Member writes require the verified `userId` and private-plan class; deletion binds both conditions to the mutation itself. Invalid prescriptions, names, and IDs return 400/404. Built-in lifecycle changes use separate admin endpoints. Duplicate and delete dialogs expose pending/failure states, and delete requires labeled confirmation before the request.

## Edge cases and gaps

- List uses a maximum of 100 and no cursor; UI exposes search but not category/difficulty filters.
- Archived private plans are omitted from normal list; recovery UI is not evident.
- Update replaces prescriptions entirely.
- Multiple plan prescriptions can reference the same exercise; no uniqueness constraint prevents it.
- Starting a plan does not enforce a single active workout.
- Focused duplicate/delete validation, ownership predicates, UI confirmation, and schema lifecycle contracts have automated coverage. Visibility, create/update prescription, start, seed execution, and representative database referential-action behavior still lack integration evidence.

## Code map

| Responsibility | Code |
| --- | --- |
| Pages/components | `src/pages/workout-plans/`, `src/components/workout-plans/` |
| Member APIs | `src/pages/api/workout-plans/` |
| Visibility helper | `src/lib/workoutPlans/access.ts` |
| Validation | `src/lib/api/validators/workout-plan.ts` |
| Built-in seed | `scripts/seed-workout-plans.mjs`, `scripts/data/workout-plans.mjs` |
| Persistence | `WorkoutPlan`, `WorkoutPlanExercise` and `Workout.sourceWorkoutPlan` |
| Tests | `test cases/components/workout-plans/`, `test cases/pages/api/workout-plans/`, `test cases/lib/api/validators/workout-plan.test.ts`, `test cases/prisma/workout-plan-lifecycle.test.ts` |

## Related documents

[Workout Plans PRD](../../prds/domains/workout-plans.md), [Workout Engine SDD](workout-engine.md), [Exercise Catalog SDD](exercise-catalog.md), and [Authorization Model](../architecture/authorization-model.md).
