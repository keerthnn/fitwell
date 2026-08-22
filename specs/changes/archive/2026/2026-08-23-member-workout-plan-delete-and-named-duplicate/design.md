---
id: change-2026-08-23-member-workout-plan-delete-and-named-duplicate
title: Member workout-plan deletion and named duplication
status: archived
authority: temporary
mode: full-sdd
phase: design
opened: 2026-08-23
archived: 2026-08-23
requirements:
  - PLAN-002
  - PLAN-005
  - PLAN-009
  - PLAN-010
  - PLAN-012
  - PLAN-013
  - SEC-002
  - SEC-004
  - DATA-002
  - DATA-006
  - A11Y-002
  - A11Y-004
decisions: []
code:
  - src/pages/workout-plans/[id]/index.tsx
  - src/components/workout-plans/
  - src/pages/api/workout-plans/
  - src/lib/api/validators/workout-plan.ts
  - src/lib/workoutPlans/access.ts
  - src/utils/spec.ts
  - src/utils/types.ts
  - prisma/schema.prisma
tests:
  - test cases/components/workout-plans/
  - test cases/pages/api/workout-plans/
  - test cases/lib/api/validators/
  - test cases/prisma/
---

# Design: Member workout-plan deletion and named duplication

## Approved proposal

Keerthan K, the project owner, approved the [Proposal](proposal.md) and its `AC-01` through `AC-11`. The approved requirement delta adds `PLAN-013`, amends `PLAN-010`, and applies the unchanged ownership, validation, accessibility, aggregate-consistency, and historical-independence requirements listed in frontmatter.

## Upstream context reviewed

- [Workout plans PRD](../../../prds/domains/workout-plans.md), including `PLAN-001` through `PLAN-012`.
- [System qualities](../../../prds/system-qualities.md), especially `SEC-002`, `SEC-004`, `DATA-002`, `DATA-006`, `A11Y-002`, and `A11Y-004`.
- [Workout Plans SDD](../../../engineering/features/workout-plans.md), [Authorization Model](../../../engineering/architecture/authorization-model.md), [API Endpoint Catalog](../../../engineering/api/endpoint-catalog.md), and [Data Lifecycle](../../../engineering/database/data-lifecycle.md).
- [API conventions](../../../engineering/api/api-conventions.md), [Errors and validation](../../../engineering/api/errors-and-validation.md), [Frontend Architecture](../../../engineering/architecture/frontend-architecture.md), and [Verification Matrix](../../../engineering/quality/verification-matrix.md).
- Existing member plan detail UI, typed client wrappers, duplication/archive handlers, plan validator and visibility helper, workout/feedback deletion handlers, reusable confirmation patterns, Prisma relations, and current tests.
- No relevant external service, migration, operational runbook, accepted ADR constraint, or authorized hosted-state inspection is required.

## Design summary

Add a dedicated owner-scoped member delete endpoint and two focused action components on the workout-plan detail view. `DeleteWorkoutPlanButton` owns the irreversible confirmation, request state, error state, delete request, and successful navigation. `DuplicateWorkoutPlanButton` owns the editable naming dialog, client validation, duplicate request, error state, and navigation to the created copy. The API independently validates all inputs and applies existing authenticated visibility/ownership boundaries. Physical deletion relies on the existing database cascade for plan prescriptions and `SetNull` source relation for historical workouts; no schema change is required.

## Architecture and dependency changes

- `WorkoutPlanDetailPage` continues to own plan loading and start-workout behavior.
- `WorkoutPlanDetail` composes the two new action components next to Start workout. It renders deletion only when `plan.isBuiltIn` is false. Because member detail lookup returns a private plan only through the caller-owned branch, this is correct presentation logic but is not an authorization boundary.
- `DuplicateWorkoutPlanButton` depends on the shared `duplicateWorkoutPlan` Axios wrapper and Next.js router. It accepts `planId`, `planName`, and an optional disabled state.
- `DeleteWorkoutPlanButton` depends on the new shared `deleteWorkoutPlan` Axios wrapper and Next.js router. It accepts `planId` and `planName`.
- The shared wrapper sends browser requests only; neither component accepts or transmits a user ID.
- The duplicate handler continues to depend on `findVisibleWorkoutPlan`; the delete handler uses one owner-scoped database mutation.
- No new module, global state, context, external system, or database model is introduced.

```text
WorkoutPlanDetail
  ├─ Start workout ───────────────> existing start API
  ├─ Duplicate dialog(name) ──────> POST duplicate ──> visible-source lookup
  │                                                     └─ nested plan create
  └─ Delete confirmation ─────────> DELETE delete ───> owner/private predicate
                                                        ├─ plan exercises cascade
                                                        └─ workout source link null
```

## Detailed flows and state transitions

### Duplicate flow

1. The member selects **Duplicate plan** on any visible plan.
2. The component opens a dialog and initializes the input to `<source name> Copy`; no API call occurs on open.
3. The member cancels, or edits and submits the name.
4. Client validation trims the value, rejects an empty result, and rejects more than 120 characters. Invalid input keeps the dialog open, identifies the field error, and sends no request.
5. Valid submission clears prior request error, marks duplication pending, disables cancel/submit, prevents backdrop/Escape close, and sends `{ id, name }`.
6. The server authenticates the caller, validates both fields, loads the source through the existing visible-plan predicate, and returns 404 when inaccessible or absent.
7. One nested Prisma create writes the caller-owned private plan and its copied prescriptions atomically. The stored name is the server-trimmed submitted value.
8. On 201, the component navigates to `/workout-plans/<copy id>`. On failure, it remains on the source view, clears pending, and shows an alert in the dialog. A user-initiated retry may create a copy only if the prior request did not return success; no idempotency token or unique-name rule is added.

### Delete flow

1. An owned private plan shows **Delete plan**; a built-in plan does not.
2. Selecting it opens a dialog titled **Delete workout plan?** whose text names the plan and states that its plan details and prescriptions will be permanently removed and cannot be restored. No request occurs on open.
3. Cancel or ordinary dialog dismissal closes the dialog without a request.
4. Confirming clears prior error, marks deletion pending, disables cancel/confirm, prevents backdrop/Escape close, and sends the plan ID.
5. The server authenticates, validates the ID, and executes one `deleteMany` constrained by `{ id, userId, isBuiltIn: false }`.
6. A count of zero produces the same 404 response for absent, built-in, or cross-user targets. A count of one returns 200 `{ success: true }`.
7. PostgreSQL applies the existing plan-exercise cascade and changes any `Workout.sourceWorkoutPlanId` reference to null. Workout exercises and sets are independent rows and remain unchanged.
8. On success, the component navigates to `/workout-plans`. On failure, it stays on the plan, clears pending, and shows a retryable alert inside the dialog.

### Concurrency and repeat actions

- Pending dialog controls prevent ordinary duplicate submissions from the same rendered interaction.
- Delete is a single conditional mutation. A repeated request after success returns 404 and cannot affect another row.
- Duplicate remains intentionally non-idempotent: separate successful submissions produce separate private plans, consistent with the existing behavior and absence of name uniqueness.
- Start, edit, archive/restore, and administrator lifecycle paths are unchanged.

## Frontend design

- Add `src/components/workout-plans/DuplicateWorkoutPlanButton.tsx` and `DeleteWorkoutPlanButton.tsx`, following the established component-owned mutation pattern used by `DeleteWorkoutButton`.
- In the detail action stack, retain Start workout, replace the immediate duplicate callback with `DuplicateWorkoutPlanButton`, and add `DeleteWorkoutPlanButton` only for `!plan.isBuiltIn`.
- Remove page-level duplication state and handler after the component takes ownership; retain the page-level start error and pending state.
- The duplicate dialog uses a labeled required `TextField`, visible validation helper text, a semantic form so Enter submits, Cancel, and a primary **Duplicate plan** submit action.
- The delete dialog names the plan in its body, uses error color for the destructive action, and labels the confirmation **Delete plan** rather than a generic Confirm.
- Both dialogs are full-width with a small maximum width for mobile fit, autofocus the primary input or safe cancel/heading flow as appropriate, and use MUI dialog focus trapping.
- Both dialogs show an `Alert` for request failure. Pending labels are **Duplicating…** and **Deleting…**; pending controls are disabled and closing is blocked.
- Dialog state resets on a new open: suggested name is recomputed from the current plan name, validation/request errors clear, and no stale failure appears.
- Client validation improves feedback only; the server validator remains authoritative.
- The existing shared Axios wrapper pattern in `src/utils/spec.ts` remains the only browser-to-API access path.

## API contracts

### Duplicate plan

- **Method/path:** `POST /api/workout-plans/duplicate`
- **Input:** JSON `{ id: string, name: string }`.
- **Validator:** add `validateDuplicateWorkoutPlan` in `src/lib/api/validators/workout-plan.ts`; use `record`, `idValue`, and `text(..., { required: true, max: 120 })`. The returned name is trimmed.
- **Authentication:** `getUserIdOrSetError`; no user ID is accepted from the request.
- **Authorization:** `findVisibleWorkoutPlan(id, userId)`; source may be the caller's active private plan or an active, non-archived built-in plan.
- **Success:** 201 with the created `WorkoutPlan` including ordered exercise relations, unchanged from the current output shape.
- **Errors:** 400 with validation errors for malformed ID/name; 401/403 from shared authentication; 404 `Workout Plan not found` for absent/inaccessible source; unexpected persistence errors use existing API handling.
- **Side effects/transaction:** one nested Prisma create copies source plan fields and prescriptions, forces `userId` to the caller and `isBuiltIn: false`, and stores the validated submitted name. Prisma's nested write is atomic.
- **Repeat semantics:** not idempotent; each successful request creates one new aggregate.

### Delete plan

- **Method/path:** `DELETE /api/workout-plans/delete?id=<plan id>`.
- **Input:** query `id`, validated by `isIdentifier`.
- **Authentication:** `getUserIdOrSetError`; no user ID is accepted from the request.
- **Authorization:** the database mutation predicate includes the ID, verified `userId`, and `isBuiltIn: false`.
- **Success:** 200 `{ success: true }`.
- **Errors:** 400 `{ error: "Invalid workout plan ID" }`; 401/403 from shared authentication; 404 `{ error: "Workout Plan not found" }` when the conditional deletion affects zero rows.
- **Side effects/transaction:** one `deleteMany` statement permanently removes exactly one eligible plan. Database referential actions cascade prescriptions and null workout source references atomically with the deletion.
- **Repeat semantics:** repeat after success returns 404 without additional changes.

### Typed client access

- Change `duplicateWorkoutPlan(id)` to `duplicateWorkoutPlan(id, name)` and send both fields.
- Add `deleteWorkoutPlan(id)` using the shared Axios instance and `DELETE` query-parameter convention; return `{ success: true }`.
- No new response domain type is needed. The existing `WorkoutPlan` type remains the duplicate response authority.

## Data design and migration

- No Prisma schema, migration, field, relation, index, or backfill changes are required.
- `WorkoutPlanExercise.workoutPlan` already uses `onDelete: Cascade`; plan prescriptions are deleted with the plan.
- `Workout.sourceWorkoutPlan` already uses `onDelete: SetNull`; historical workout aggregates remain and lose only the optional source association.
- `WorkoutExercise` and `WorkoutSet` belong to `Workout`, not `WorkoutPlan`; deletion does not traverse to them.
- Plan names remain non-unique. The submitted name is trimmed, required, and limited to 120 characters, matching creation/update validation.
- The deletion query's owner/private predicate is the integrity check; a zero count is the safe no-op/not-found result.
- Recovery for an individual hard-deleted plan is not provided. Prevention is the explicit UI confirmation; archive remains the recoverable alternative.

## Authentication, authorization, and privacy

- Both handlers authenticate before resource access.
- Duplicate visibility continues through the shared OR predicate and never accepts client ownership claims.
- Delete authority is enforced in the mutation itself with the verified UID and `isBuiltIn: false`, avoiding a read/delete time-of-check gap.
- Built-in, cross-user, and absent delete targets return the same 404 outcome. No target metadata is returned or logged.
- Hiding the built-in delete control is presentation only; direct built-in delete requests remain rejected server-side.
- Request and error content contains plan IDs/names already visible to the member and no credentials, tokens, cookies, or other member identity data.

## Failure handling and observability

- Expected validation and ownership failures use 400/404 without mutation.
- Client request failures stay within the relevant dialog, preserve the source page, and restore retry/cancel controls.
- Navigation happens only after confirmed 2xx success. A navigation failure after server success can leave the browser on a now-missing source route; a refresh then reaches existing not-found/error behavior, while the plan remains correctly deleted or duplicated.
- No new application logging, analytics, metric, alert, or audit event is introduced. Member plan mutations currently have no audit contract.
- Unexpected server failures continue through the current Next.js/API runtime handling; user-facing UI uses generic retry copy and does not expose internal details.

## Test design and Red phase

| Requirement/criterion | Test layer | Planned evidence | Expected Red failure |
| --- | --- | --- | --- |
| `PLAN-005`, `PLAN-010`, `AC-07`, `AC-08` | Validator unit | `test cases/lib/api/validators/workout-plan.test.ts` verifies trimming, blank, and 120/121-character boundaries. | Duplicate validator does not exist and current handler ignores a supplied name. |
| `PLAN-010`, `SEC-002`, `SEC-004`, `AC-07`, `AC-08` | API handler | `test cases/pages/api/workout-plans/duplicate.test.ts` verifies validated name, caller ownership, visible-source 404, copied prescriptions, and no create on invalid input. | Current handler accepts only ID and always appends `Copy`. |
| `PLAN-013`, `SEC-002`, `SEC-004`, `AC-03`, `AC-04` | API handler | `test cases/pages/api/workout-plans/delete.test.ts` verifies method/input, authenticated owner/private predicate, zero-count 404, and success response. | Delete handler does not exist. |
| `PLAN-012`, `DATA-002`, `AC-05` | Schema contract plus representative scenario | `test cases/prisma/workout-plan-lifecycle.test.ts` verifies plan-prescription Cascade, workout-source SetNull, and workout-owned exercise/set relations; manual local scenario deletes a source plan and inspects the retained workout. | No focused lifecycle test or recorded scenario exists. |
| `A11Y-002`, `PLAN-010`, `AC-06`, `AC-08`, `AC-09`, `AC-10` | Component interaction | `test cases/components/workout-plans/DuplicateWorkoutPlanButton.test.tsx` verifies prefill/no early request, editable trimmed name, invalid input, pending lock, failure alert, and success navigation. | Naming component/dialog does not exist; duplicate is immediate. |
| `A11Y-004`, `PLAN-013`, `AC-01`, `AC-02`, `AC-09`, `AC-10` | Component interaction | `test cases/components/workout-plans/DeleteWorkoutPlanButton.test.tsx` verifies named irreversible warning, cancel/no request, pending lock, failure, and success navigation. | Delete component/dialog does not exist. |
| `PLAN-013`, `AC-04`, `AC-11` | Component/static integration | `WorkoutPlanDetail` test verifies built-in plans omit delete while private plans render it and existing start/edit behavior remains. | Detail renders no delete action for either plan class. |
| Responsive/keyboard states | Manual UI | Light/dark, desktop/mobile width, keyboard open/submit/cancel, focus trap, Escape before pending, and request-error scenarios. | Current UI has neither dialog. |

Red-phase handler tests will mock authentication and Prisma at module boundaries, invoke the Next.js handlers with request/response doubles, and assert both response and mutation arguments. Component files will opt into jsdom and mock only the typed wrapper/router boundaries. Requirement IDs appear in binding test names.

## Deployment, rollout, and recovery

- No environment variable, external console, database migration, seed, or backfill is required.
- Ship validator/handlers, wrappers, UI, tests, and canonical docs together.
- Run focused Red/Green tests, full lint, typecheck, test, production build, and asset verification as selected by the verification matrix.
- Post-change smoke checks cover duplication with default/custom names, cancel, invalid name, owner delete cancel/confirm, built-in omission, and request failures at mobile and desktop widths.
- Stop release if cross-user/built-in deletion can affect a row, historical workout rows are changed beyond source-link nulling, invalid duplicate names create data, or confirmation can be bypassed through the exposed UI.
- Code rollback restores the prior API/UI. It cannot recover a plan already permanently deleted; the approved confirmation is therefore release-critical.

## Alternatives and ADRs

- A soft-delete-only outcome and replacement of archive/restore were rejected in Proposal.
- Reusing the existing edit form after immediate duplication was rejected because it creates unwanted records before name approval.
- A separate delete endpoint follows established workout/feedback route conventions and keeps archive semantics unchanged.
- A conditional `deleteMany` is preferred over read-then-delete because it binds authorization to the mutation and avoids a time-of-check gap.
- Focused action components are preferred over expanding page state because they match the existing `DeleteWorkoutButton` pattern and are independently testable.
- No ADR is required: the design follows established Pages Router, Axios, MUI, Prisma, and owner-scoped API conventions without introducing a durable architectural choice.

## Risks and mitigations

| Risk | Likelihood/impact | Prevention | Detection | Recovery |
| --- | --- | --- | --- | --- |
| Cross-user or built-in plan deletion | Low / Critical | Verified UID and owner/private predicate in the delete statement | Handler adversarial tests and manual direct-request check | Block release; revert handler |
| Accidental irreversible deletion | Medium / High | Named warning, explicit destructive button, cancel, pending lock, archive remains available | Component tests and keyboard/manual review | No per-plan recovery; prevention is mandatory |
| Historical workout loss | Low / Critical | Existing SetNull source relation and workout-owned copied data | Schema test and representative database scenario | Block release; restore database backup if external recovery exists, which repository state does not prove |
| Invalid or unwanted duplicate name | Medium / Medium | Editable prefill plus matching client/server trim/length validation | Boundary tests and component interaction tests | Keep dialog open for correction; no row created |
| Duplicate row after uncertain network response | Low / Low | Disable repeat submit during request; document non-idempotence | Manual retry review and resulting library inspection | Member may delete unwanted owned copy |
| UI/API partial deployment | Low / Medium | Atomic code release and production build | Build and post-change smoke | Roll forward or revert code |

## Documentation impact

- Amend `PLAN-010` and add `PLAN-013` in `specs/prds/domains/workout-plans.md`.
- Update the Workout Plans SDD flows, API/data behavior, failure handling, code/test maps, and verification gap.
- Add the member delete endpoint and revised duplicate input to the API Endpoint Catalog and update its endpoint count.
- Update Data Lifecycle to state that member-owned plans may be archived/restored or permanently owner-deleted, with prescription cascade and workout source-link nulling.
- Review Authorization Model; update its code/test mapping and explicit mutation rule if needed, without changing the existing ownership contract.
- Review Frontend Architecture, API conventions, database design, product inventory, roadmap, quality docs, and operations; record No change with reason where the approved behavior does not alter their canonical rules.
- No ADR, integration document, runbook, or migration document change is expected.

## Design decision

- Status: Approved
- Approved by: Keerthan K (project owner)
- Date: 2026-08-23
- Conditions: None proposed
