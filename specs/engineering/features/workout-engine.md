---
id: sdd-workout-engine
title: Workout Engine
status: active
authority: engineering
requirements: [WORKOUT-001, WORKOUT-002, WORKOUT-003, WORKOUT-004, WORKOUT-005, WORKOUT-006, WORKOUT-007, WORKOUT-008, WORKOUT-009, WORKOUT-010, WORKOUT-011, WORKOUT-012, WORKOUT-013, WORKOUT-014, WORKOUT-015, WORKOUT-016, WORKOUT-017, WORKOUT-018, WORKOUT-019, SEC-002, DATA-002, DATA-006, A11Y-005]
decisions: [ADR-0004, ADR-0005]
code: [src/pages/workouts/, src/components/workouts/, src/components/RestTimerProvider.tsx, src/utils/restTimer.ts, src/pages/api/workouts/, src/pages/api/workout-exercises/, src/lib/api/validators/workout.ts]
tests: [test cases/components/workouts/, test cases/pages/api/workouts/create-workout.test.ts, test cases/pages/api/workout-exercises/add-exercise.test.ts]
last_verified: 2026-08-23
---

# Workout engine SDD

## Scope and goals

The workout engine owns member workout history, creation, live session state, quick entry, ordered exercises, tracking-aware sets, rest timing, metadata editing, duplication, completion, and deletion.

## Aggregate and lifecycle

`Workout` is the aggregate root; `WorkoutExercise` and `WorkoutSet` cascade with it.

~~~text
LIVE create -> IN_PROGRESS -> DRAFT (pause) -> IN_PROGRESS (resume) -> COMPLETED
QUICK_ENTRY/duplicate -> DRAFT -> IN_PROGRESS -> COMPLETED
PLAN start -> IN_PROGRESS -> same lifecycle
~~~

Completion is allowed from any owned workout with at least one completed set; the handler does not explicitly reject an already completed workout. Metadata and nested exercise/set APIs also do not globally prevent edits after completion.

## User flows

- `/workouts` lists/searches/filters history.
- `/workouts/create` begins exercise choice with front/back muscle-guided discovery, but an empty explicit start remains available.
- `/workouts/quick-entry` creates a draft past workout; its incomplete edit page uses muscle-guided discovery for explicit additions.
- `/workouts/live/[id]` records sets, notes, exercise changes, pause/resume, timer, and completion.
- `/workouts/[id]` reviews detail and actions.
- `/workouts/[id]/edit` updates metadata and exercise/set content.

## Component responsibilities

`WorkoutCreateForm` and `WorkoutExercisePicker` build initial workouts. The live branch composes muscle-guided discovery while the form retains ownership of selected exercise order and session details. The centered creation surface starts with an empty required workout name and uses a compact calendar picker that defaults to today. `WorkoutExerciseEditor` composes discovery only when the quick-entry edit page explicitly enables it; live and other edit consumers retain autocomplete. It and `SetEditor` edit tracking-type-specific values and save sets. `WorkoutList/Card` present history. `WorkoutSummaryVisual` selects representative imagery. `DeleteWorkoutButton` owns confirmed deletion.

`RestTimerProvider` supplies a member/workout-scoped browser timer. It serializes a versioned timer to local storage, reconciles deadlines, handles restricted storage, announces completion, and exposes workout lifecycle controls.

## API usage and persistence

Workout creation validates active exercise IDs and nested-creates ordered workout exercises. List/detail return owner-scoped records. Metadata update patches optional fields. Pause/resume perform status-conditioned changes. Completion checks completed sets and derives duration. Duplication nested-copies exercises/sets into an incomplete quick-entry draft.

Discovery interactions are read-only. Live creation persists only on explicit form submit; quick-entry Add uses the existing owner-scoped add endpoint and shows failure without clearing discovery, metadata, exercises, or sets. Discovery never starts, resumes, or completes a workout.

Workout-exercise endpoints verify the owning workout. Reorder runs update-many operations in a transaction. Save-sets validates the exercise tracking type, deletes prior sets, and creates the submitted collection in one transaction.

## Security

Every member API derives UID from the verified token. Top-level workouts use `id + userId` predicates; nested records use `workout.userId`. Unauthorized IDs normally return 404.

## Failure handling

Pages expose loading/error/empty and mutation messages. APIs reject unavailable exercises, invalid limits/values, missing resources, invalid pause/resume state, no completed set, and invalid tracking metrics. Replace-all set saving avoids partial set collections but means a failed request retains the old collection.

## Edge cases and current gaps

- Multiple in-progress workouts are permitted.
- Generic create accepts `PLAN` but gives it `IN_PROGRESS` without `startedAt`; normal plan creation uses the dedicated plan endpoint.
- Workout-list next-cursor selection is a known risk.
- Reorder silently ignores IDs not belonging to the workout while updating submitted owned IDs.
- Duplicate set numbers are not database-unique.
- Completed workouts remain editable.
- Rest timer is browser-local and not synchronized across devices.
- Focused creation and add-exercise tests cover active-reference validation and owner scoping. Broader lifecycle, timer, and persistence paths still need additional automated evidence.

## Code map

| Responsibility | Code |
| --- | --- |
| Pages | `src/pages/workouts/` |
| Components | `src/components/workouts/` |
| Rest timer | `src/components/RestTimerProvider.tsx`, `src/utils/restTimer.ts`, `src/components/workouts/exerciseRest.ts` |
| Workout APIs | `src/pages/api/workouts/` |
| Exercise/set APIs | `src/pages/api/workout-exercises/` |
| Validation | `src/lib/api/validators/workout.ts` |
| Types/wrappers | `src/utils/types.ts`, `src/utils/spec.ts` |
| Persistence | `Workout`, `WorkoutExercise`, `WorkoutSet` in `prisma/schema.prisma` |

## Related documents

[Workout Engine PRD](../../prds/domains/workout-engine.md), [Exercise Catalog SDD](exercise-catalog.md), [Workout Plans SDD](workout-plans.md), and [Authorization Model](../architecture/authorization-model.md).
