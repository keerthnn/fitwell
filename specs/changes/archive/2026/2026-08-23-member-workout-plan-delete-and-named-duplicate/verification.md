---
id: change-2026-08-23-member-workout-plan-delete-and-named-duplicate
title: Member workout-plan deletion and named duplication
status: archived
authority: temporary
mode: full-sdd
phase: verification
opened: 2026-08-23
verified: 2026-08-23
archived: 2026-08-23
---

# Verification: Member workout-plan deletion and named duplication

## Scope verified

This verification covers the approved [Clarify](clarify.md), [Proposal](proposal.md), [Design](design.md), and [Tasks](tasks.md) against the current uncommitted workspace implementation. It covers local source, Vitest/jsdom, Next.js production build, asset verification, and an isolated transaction-rolled-back PostgreSQL scenario against the repository-confirmed local `fitness` database. It does not claim hosted Firebase, Vercel, PostgreSQL, deployment, or live-browser state.

## Acceptance criteria and requirement coverage

| Requirement or criterion | Evidence | Result | Notes |
| --- | --- | --- | --- |
| `AC-01`, `PLAN-013`, `A11Y-004` | `DeleteWorkoutPlanButton.test.tsx` named irreversible-warning test | Pass | No request occurs on dialog open. |
| `AC-02` | Delete dialog cancel/no-request test | Pass | Dialog closes and mutation mock remains untouched. |
| `AC-03`, `PLAN-013` | Delete handler success/predicate test; delete dialog navigation test; rolled-back PostgreSQL scenario | Pass | Conditional owner/private delete removed the plan and prescriptions, then UI routes to the library after success. |
| `AC-04`, `PLAN-002`, `SEC-002`, `SEC-004` | Delete handler zero-count 404 test; built-in detail omission test; rolled-back cross-user/built-in conditional-delete checks | Pass | Cross-user, built-in, absent/repeated targets affect zero rows and disclose no target details. |
| `AC-05`, `PLAN-012`, `DATA-002` | Prisma lifecycle test and rolled-back local PostgreSQL scenario | Pass | Plan prescription cascaded, source link became null, and workout exercise/set rows remained. |
| `AC-06`, `PLAN-010` | Duplicate dialog prefill/no-request test | Pass | Opens with `Strength Copy`; creation waits for submission. |
| `AC-07`, `PLAN-005`, `PLAN-010`, `DATA-006` | Validator trim/boundary tests; duplicate handler caller-owned nested-create test; duplicate dialog submit/navigation test | Pass | Exact trimmed submitted name is used in one nested atomic create. |
| `AC-08` | Validator blank/120/121 tests; duplicate handler no-create tests; dialog invalid-name tests | Pass | Client and server independently reject blank/overlength values without creation. |
| `AC-09`, `A11Y-002` | Duplicate/delete dialog failure-alert and no-navigation tests | Pass | Source view persists and actions recover after failure. |
| `AC-10`, `A11Y-002` | Duplicate/delete pending-lock tests and pending-navigation regression test | Pass | Submit and Cancel are disabled only while the API is pending; duplicate success closes and resets the dialog before navigation finishes. |
| `AC-11`, `PLAN-009`, `PLAN-011` | Focused diff review, detail Start workout test, full suite/build | Pass with manual gap | Archive/restore, edit, start endpoint, and administrator lifecycle production paths were not modified; live smoke was not run. |

## Red-phase evidence

- Validator command: `pnpm exec vitest run 'test cases/lib/api/validators/workout-plan.test.ts'` — five expected failures because `validateDuplicateWorkoutPlan` was absent.
- Duplicate handler command: `pnpm exec vitest run 'test cases/pages/api/workout-plans/duplicate.test.ts'` — invalid names returned 404 instead of 400 and a valid request stored `Strength Copy` instead of the submitted `My copy`; existing inaccessible-source 404 passed.
- Delete handler command: `pnpm exec vitest run 'test cases/pages/api/workout-plans/delete.test.ts'` — expected module-resolution failure because the route was absent.
- Lifecycle command: `pnpm exec vitest run 'test cases/prisma/workout-plan-lifecycle.test.ts'` — Green characterization evidence; no false Red was manufactured because the approved referential actions already existed.
- Duplicate/delete dialog commands — expected module-resolution failures because both components were absent.
- Detail command — private-plan assertion failed because no Delete plan action existed. A Vitest cleanup issue affecting the second render was corrected in test setup before production implementation.

## Automated checks

| Command | Environment | Result | Material warnings |
| --- | --- | --- | --- |
| Focused seven-file workout-plan suite | Local Vitest/node/jsdom | Pass: 30 tests | None |
| `pnpm run lint` | Local | Pass | None |
| `pnpm run typecheck` | Local | Pass | None |
| `pnpm run test` | Local | Pass: 10 files, 37 tests | None |
| `pnpm run verify:assets` | Local | Pass: 160 approved assets, 246 exercise resolutions | None |
| `pnpm run build` | Local Next.js webpack production build | Pass | 41 static pages generated; new delete API route included |
| `git diff --check` | Local worktree | Pass | None |
| `pnpm run db:assert-local` | Local | Pass | Confirmed only `localhost:5432/fitness`; Firebase not modified |
| Isolated PostgreSQL lifecycle SQL in explicit transaction followed by `ROLLBACK` | Confirmed local database | Pass | Ten fixture inserts, one owner delete, assertions, rollback; no persistent rows |

## Manual scenarios

| Actor/state | Precondition | Action | Observed result | Result |
| --- | --- | --- | --- | --- |
| Local owner fixture | Private plan with prescription and materialized workout exercise/set | Execute approved owner/private delete predicate inside transaction | One plan deleted; prescription absent; workout retained with null source; exercise/set retained; transaction rolled back | Pass |
| Different local owner | Plan belongs to second fixture user | Execute first user's delete predicate | Zero rows affected; plan remains until rollback | Pass |
| Built-in local fixture | Built-in plan has null owner | Execute member owner/private delete predicate | Zero rows affected | Pass |
| Repeated delete | Owner fixture plan already deleted in transaction | Repeat identical predicate | Zero rows affected | Pass |
| Signed-out handler double | Auth helper returns no UID | Invoke duplicate/delete handlers | No visibility query, create, or delete mutation occurs | Pass |
| Mobile/desktop, light/dark browser | Live authenticated member page | Inspect dialog layout, focus trap, Enter/Escape, pending dismissal, and visual request states | No controllable authenticated browser was available in the workspace; sandbox also blocks ordinary port binding | Not run; acceptance from Keerthan K, the project owner, required |

## Security and authorization

The delete mutation includes `{ id, userId, isBuiltIn: false }` in one database statement. Handler tests prove verified UID propagation and zero-count 404 behavior; the rolled-back database scenario proves the predicate cannot delete a second user's or built-in fixture plan. Duplicate continues through `findVisibleWorkoutPlan`, and its handler test proves the authenticated UID reaches that lookup. No client wrapper accepts or sends a user ID. Signed-out doubles perform no data access. No secrets or internal persistence failures are presented by the UI.

The remaining limitation is that a live Firebase-authenticated cross-user HTTP session was not available. The server predicate, handler boundaries, and local database behavior are covered independently.

## Data and migration

No schema or migration change was needed. Static schema tests verify `WorkoutPlanExercise` uses `onDelete: Cascade`, `Workout.sourceWorkoutPlan` uses `onDelete: SetNull`, and exercises/sets belong to `Workout`. The representative local PostgreSQL transaction demonstrated those referential actions and rolled back every fixture change. No hosted database state was inspected or inferred.

## Deployment and external state

No environment variable, Firebase configuration, hosted database setting, seed, backfill, or deployment change is required. Production build passed locally. No deployment was requested or performed, so hosted smoke, logs, and post-deploy state are not applicable to this workspace implementation verification.

## Design comparison and deviations

- Production implementation matches the approved route, predicate, validator, nested-write, wrapper, component, navigation, and documentation design.
- The POST duplicate-ID boundary test uses the established required text/length contract rather than adding a new character-regex rule; this is a non-material test correction that preserves existing API compatibility. DELETE query IDs use the approved `isIdentifier` rule.
- The lifecycle test began Green as explicitly allowed by Tasks because the schema contract pre-existed.
- No migration, new type, ADR, audit event, archive/restore change, administrator lifecycle change, or external dependency was added.

## Post-implementation lightweight regression

A user report identified that successful duplication could leave the naming dialog open on **Duplicating…** while `router.push()` remained pending. A focused Red test held navigation unresolved and reproduced the stuck state. `DuplicateWorkoutPlanButton` now separates API success from route completion: it closes the dialog and clears pending state immediately after creation, then awaits navigation. If navigation rejects, the dialog reopens with accurate guidance that the created plan can be found in the library.

Focused component tests, typecheck, ESLint, the full 37-test suite, production build, and `git diff --check` pass after the fix. This is `No specification change`: it restores the approved `AC-09`/`AC-10` success and request-state behavior without changing the product or API contract.

## Known gaps

| Gap | Severity | Disposition | Owner | Follow-up |
| --- | --- | --- | --- | --- |
| Live responsive/light-dark/keyboard inspection of both dialogs was not run. | Medium verification gap; automated jsdom covers labels, form submission, cancellation, pending locks, errors, and navigation but not rendered layout/focus behavior in a browser. | Requires acceptance from Keerthan K, the project owner, before Archive, or a manual authenticated browser pass. | Keerthan K (project owner) | Exercise T24 scenarios on `/workout-plans/<owned id>`. |
| No live Firebase-authenticated cross-user HTTP request was executed. | Low residual verification gap after handler predicate tests and rolled-back database adversarial checks. | Accept or verify with two authorized local test identities; does not change implementation. | Keerthan K (project owner) | Optional authenticated integration test environment. |

No known implementation, authorization-predicate, data-integrity, build, test, or documentation failure remains.

## Canonical documentation synchronization

| Document | Required change | Completed | Evidence |
| --- | --- | --- | --- |
| PRDs/system qualities | Amended `PLAN-010`; added `PLAN-013`; system-quality requirements unchanged | Yes | `specs/prds/domains/workout-plans.md` |
| SDDs/architecture | Updated Workout Plans SDD and Authorization Model test/enforcement mapping; frontend/API architecture rules unchanged | Yes | `specs/engineering/features/workout-plans.md`, `specs/engineering/architecture/authorization-model.md` |
| ADRs | No change: established owner-scoped Pages Router/Prisma conventions used | Yes | Design alternatives review |
| API/database | Added delete endpoint, revised duplicate input/count, updated lifecycle; schema/database-design invariants already described history survival | Yes | Endpoint Catalog and Data Lifecycle |
| Integrations/operations/quality | No integration/runbook change; verification matrix updated from stale no-test bootstrap state | Yes | `specs/engineering/quality/verification-matrix.md` |
| Product inventory/roadmap | Added named duplication and permanent private-plan deletion to catalog, roadmap, and brief | Yes | `specs/product/feature-catalog.md`, `roadmap.md`, `product-brief.md` |

## Archive readiness

- [x] Every acceptance criterion has passing automated/static/database evidence or an explicitly disclosed manual gap.
- [x] Required repository checks and safe local data scenarios are complete.
- [x] No material design deviation exists.
- [x] Canonical documents are synchronized.
- [x] No lasting rule remains only in this change package.
- [x] Keerthan K, the project owner, accepts the known manual gaps or supplies the missing live-browser evidence.
- [x] Archive destination is authorized as `specs/changes/archive/2026/2026-08-23-member-workout-plan-delete-and-named-duplicate/`.

## Verification decision

- Status: Approved
- Verified by: Keerthan K (project owner)
- Date: 2026-08-23
- Archive authorized: Yes
