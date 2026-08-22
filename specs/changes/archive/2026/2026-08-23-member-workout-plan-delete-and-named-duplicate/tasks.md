---
id: change-2026-08-23-member-workout-plan-delete-and-named-duplicate
title: Member workout-plan deletion and named duplication
status: archived
authority: temporary
mode: full-sdd
phase: tasks
opened: 2026-08-23
archived: 2026-08-23
---

# Tasks: Member workout-plan deletion and named duplication

## Approved design

Implement only the behavior approved in [design.md](design.md), satisfying the [proposal acceptance criteria](proposal.md#acceptance-criteria). Any discovery that changes permanent-deletion semantics, authorization, historical-workout behavior, duplicate naming, schema, or recovery returns to Design or Proposal for approval.

## Task rules

- Use `[ ]`, `[~]`, and `[x]` for pending, in progress, and completed.
- Keep at most one task marked `[~]`.
- Record each Red command and the expected failure before editing production code.
- Do not mark a task complete when its focused test or required evidence is missing.
- Preserve unrelated sidebar/theme work already present in the worktree.

## 1. Red-phase tests

- [x] **T1 — Duplicate-name validator Red:** Add `test cases/lib/api/validators/workout-plan.test.ts` for `PLAN-005`/`PLAN-010`: valid input trims the name; blank/whitespace names fail; exactly 120 characters pass; 121 fail; malformed IDs fail. Run `pnpm exec vitest run 'test cases/lib/api/validators/workout-plan.test.ts'` and record failure because `validateDuplicateWorkoutPlan` does not exist.
- [x] **T2 — Duplicate handler Red:** Add `test cases/pages/api/workout-plans/duplicate.test.ts` with module-boundary mocks. Verify invalid names create nothing, inaccessible source returns 404, and valid input calls visible lookup with the authenticated UID then creates a caller-owned non-built-in plan using the exact validated name and copied prescriptions. Run the focused test and record failure because the current handler ignores submitted names.
- [x] **T3 — Delete handler Red:** Add `test cases/pages/api/workout-plans/delete.test.ts`. Verify method/input handling, authenticated UID in `{ id, userId, isBuiltIn: false }`, zero-count non-disclosing 404, and 200 success. Run the focused test and record failure because the delete handler does not exist.
- [x] **T4 — Data-lifecycle Red:** Add `test cases/prisma/workout-plan-lifecycle.test.ts` naming `PLAN-012`/`DATA-002`. Assert the executable schema has plan-prescription `Cascade`, workout-source `SetNull`, and no ownership path from `WorkoutPlan` to workout exercises/sets. Run the focused test and record the prior verification gap; if the schema already makes the test Green, record it as characterization evidence rather than fabricating a Red failure.
- [x] **T5 — Duplicate dialog Red:** Add jsdom interaction tests at `test cases/components/workout-plans/DuplicateWorkoutPlanButton.test.tsx` for prefilled no-request open, editable/trimmed submit, blank/overlength errors, pending repeat protection, failure alert, and success navigation. Run the focused test and record failure because the component does not exist.
- [x] **T6 — Delete dialog Red:** Add jsdom interaction tests at `test cases/components/workout-plans/DeleteWorkoutPlanButton.test.tsx` for named irreversible warning, cancel/no request, pending repeat protection, failure recovery, and successful library navigation. Run the focused test and record failure because the component does not exist.
- [x] **T7 — Detail integration Red:** Add `test cases/components/workout-plans/WorkoutPlanDetail.test.tsx` verifying a private plan renders Delete plan, a built-in plan omits it, and Start workout remains present. Run the focused test and record the private-plan failure.

## 2. API and data implementation

- [x] **T8 — Duplicate validator:** Implement `validateDuplicateWorkoutPlan` in `src/lib/api/validators/workout-plan.ts` using shared record/ID/text validation and returning a trimmed `{ id, name }`. Verify T1 Green and run ESLint on the validator/test.
- [x] **T9 — Named duplicate handler:** Update `src/pages/api/workout-plans/duplicate.ts` to use the new validator, preserve `findVisibleWorkoutPlan`, store the validated name, force caller ownership/private status, and retain one atomic nested create. Verify T2 Green, T1 remains Green, and typecheck the changed contract.
- [x] **T10 — Owner-scoped delete handler:** Add `src/pages/api/workout-plans/delete.ts` using the DELETE method guard, authenticated UID, ID validation, and one conditional `deleteMany` with `{ id, userId, isBuiltIn: false }`; return 404 for zero and 200 success for one. Verify T3 Green and run focused ESLint.
- [x] **T11 — Lifecycle evidence:** Confirm no Prisma schema change is necessary, run T4, and record why the existing referential actions preserve workout data. Do not create a migration. If representative local database execution is available without destructive risk to user data, use isolated fixture rows; otherwise defer the exact manual scenario to Verification and state the environment limitation.

## 3. Client and UI implementation

- [x] **T12 — Typed wrappers:** Change `duplicateWorkoutPlan` in `src/utils/spec.ts` to accept/send `id` and `name`; add `deleteWorkoutPlan` using the shared Axios DELETE query convention and typed `{ success: true }` response. Run typecheck and focused wrapper consumer tests.
- [x] **T13 — Duplicate action component:** Add `src/components/workout-plans/DuplicateWorkoutPlanButton.tsx` with editable `<source name> Copy` prefill, semantic-form submit, matching trim/120-character client validation, accessible helper/error text, pending lock, generic request failure, and success navigation to the new plan. Verify T5 Green.
- [x] **T14 — Delete action component:** Add `src/components/workout-plans/DeleteWorkoutPlanButton.tsx` with a plan-named irreversible warning, explicit Cancel/Delete plan controls, pending close/repeat protection, failure alert, and success navigation to `/workout-plans`. Verify T6 Green.
- [x] **T15 — Detail composition:** Update `WorkoutPlanDetail` to compose the new duplicate action and conditionally render delete only for `!plan.isBuiltIn`. Update `src/pages/workout-plans/[id]/index.tsx` to remove obsolete immediate-duplicate state/handler while preserving start-workout behavior and errors. Verify T7, T5, and T6 Green.
- [x] **T16 — Focused implementation review:** Review the diff against `AC-01`–`AC-11`, confirm no client-supplied UID, no delete control for built-ins, no request on dialog open/cancel, no navigation before success, and no changes to archive/restore/admin behavior. Run focused ESLint and `pnpm run typecheck`.

## 4. Canonical documentation synchronization

- [x] **T17 — Product requirements:** Amend `PLAN-010` and add `PLAN-013` in `specs/prds/domains/workout-plans.md`; verify numbering, wording, and unchanged `PLAN-009`/`PLAN-012` relationships.
- [x] **T18 — Workout Plans SDD:** Update requirements/frontmatter, user flows, components, API/database behavior, failure/security behavior, code map, test map, and prior verification gaps in `specs/engineering/features/workout-plans.md`.
- [x] **T19 — API catalog:** Revise duplicate input, add the member delete endpoint, correct requirement mappings to canonical IDs, and update the endpoint count in `specs/engineering/api/endpoint-catalog.md`.
- [x] **T20 — Authorization and lifecycle:** Update `specs/engineering/architecture/authorization-model.md` with conditional mutation/test evidence where useful, and update `specs/engineering/database/data-lifecycle.md` with archive/restore plus permanent owner deletion, prescription cascade, and source-link nulling.
- [x] **T21 — Canonical review:** Review frontend/API architecture, API conventions/errors, database design, product inventory/roadmap, quality docs, integrations, decisions, and runbooks. Update only documents whose durable contracts changed; record explicit No change reasons for the rest in Verification. Confirm no new ADR or migration document is warranted.

## 5. Verification

- [x] **T22 — Focused automated checks:** Run all new workout-plan validator, handler, component, and schema tests together. Record command/output and map each test to `AC-01`–`AC-11` and binding requirement IDs.
- [x] **T23 — Repository checks:** Run `pnpm run lint`, `pnpm run typecheck`, `pnpm run test`, `pnpm run build`, and `pnpm run verify:assets`. Explain any warning or skipped check; unrelated user changes must not be overwritten to obtain a pass.
- [x] **T24 — Manual UI scenario disposition:** Live mobile/desktop, light/dark, and keyboard browser scenarios were unavailable; automated interaction evidence and the gap were recorded in `verification.md`, then explicitly accepted by Keerthan K, the project owner, with Verification approval.
- [x] **T25 — Manual role/data scenarios:** Using isolated authorized local data where available, verify owner deletion, built-in omission/direct rejection, cross-user direct rejection, repeated-delete 404, retained historical workout exercises/sets with null source link, and unchanged archive/restore/start/edit behavior. Do not infer hosted state or use real user data destructively.
- [x] **T26 — Verification artifact:** Create `verification.md` from the template with Red evidence, automated/manual results, security/data findings, design comparison, known gaps, documentation-sync decisions, and Archive readiness. Any unapproved material deviation returns to the relevant earlier phase.

## 6. Archive

- [x] **T27 — Owner verification and archive approval:** Verification, the disclosed gaps, and Archive were approved by Keerthan K, the project owner, on 2026-08-23.
- [x] **T28 — Archive package:** Confirmed no lasting requirement or design rule remains only in this package, set package status to archived, and moved the unchanged directory name to `specs/changes/archive/2026/` without destructive Git operations.

## Discoveries and replanning

- T1 Red failed with five `validateDuplicateWorkoutPlan is not a function` results, proving the missing validator. The planned malformed-ID case was aligned to the existing POST-body ID contract by testing a missing ID; query identifiers retain the stricter character check.
- T2 Red failed invalid-name and submitted-name assertions while the existing source-visibility assertion passed, isolating the missing named-duplication behavior.
- T3 Red failed module resolution because the approved delete route did not exist.
- T4 was Green characterization evidence, as anticipated: the existing schema already declared plan-prescription `Cascade` and workout-source `SetNull`.
- T5 and T6 Red failed module resolution because neither dialog component existed. T7 failed because private plans had no Delete plan action; a test cleanup issue affecting the second render was corrected before production implementation.
- No schema migration, external configuration, archive/restore change, administrator lifecycle change, or ADR was required.
- All automated checks and the isolated rolled-back local PostgreSQL lifecycle/authorization scenario passed. Live responsive/keyboard browser inspection remains pending and is disclosed in `verification.md` for owner disposition.

## Tasks decision

- Status: Approved
- Approved by: Keerthan K (project owner)
- Date: 2026-08-23
- Conditions: None proposed
