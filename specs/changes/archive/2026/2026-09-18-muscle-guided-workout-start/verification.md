---
id: change-2026-09-18-muscle-guided-workout-start
title: Muscle-guided workout start
status: archived
authority: temporary
mode: full-sdd
phase: verification
opened: 2026-09-18
verified: 2026-09-19
archived: 2026-09-19
---

# Verification: Muscle-guided workout start

## Scope verified

Governing artifacts: [Clarify](clarify.md), [Proposal](proposal.md), [Design](design.md),
and [Tasks](tasks.md). Evidence covers the local uncommitted worktree based on `2d98959`,
on 2026-09-19. No deployment, migration, hosted database query, or production write was performed.
Keerthan K approved this Verification on 2026-09-19 with the disclosed environment-dependent
checks accepted as deferred follow-ups. This approval does not claim deployment readiness. Keerthan K
separately authorized Archive on 2026-09-19.

## Acceptance criteria and requirement coverage

Test paths below are relative to root `test cases/`. Passing tests prove their assertions;
mocked Prisma calls are not database integration evidence.

- **AC-01 / EXERCISE-010 / WORKOUT-018–019 / PLAN-014 / DES-001,004,009,017–019:**
  Diagram, discovery, create form, plan form, picker, and editor tests pass for labeled group
  coverage, prompt, and consumer boundaries. Authenticated entry checks pending.
- **AC-02 / EXERCISE-011 / DES-005,013:** Diagram tests prove shared pressed state and view
  preservation. Discovery tests exercise Chest/Triceps criteria changes; API tests inspect the
  category-union predicate. Complete result-membership/toggle combinations pending.
- **AC-03 / DES-002–003,013:** `pages/api/exercises/get-exercises.test.ts` verifies category-only
  predicates without primary/secondary inference. Twelve-group database fixtures and hosted
  category coverage are not yet verified.
- **AC-04 / EXERCISE-013 / DES-009–011:** Discovery tests verify prompt, Browse all, clear, and
  return to muscle mode. API assertions verify omitted category filtering. Actual Full Body and
  unknown-category database reachability pending.
- **AC-05 / EXERCISE-012 / DES-012,014–015:** Validator tests cover malformed/mixed queries,
  including empty singular plus plural. API tests inspect ordering and cursor arguments. Discovery
  tests cover debounce, stale success, and page retry. Database-backed multi-page completeness pending.
- **AC-06 / EXERCISE-014 / DES-008,010–011:** Explicit Add/Added, caller-owned selection,
  quick-entry duplicate-click prevention, and unsaved metadata preservation on refresh pass.
  Metadata regression: `pages/workouts/[id]/edit.test.tsx`. Full prescription/set/order preservation
  across filters, pagination, and recovery remains pending.
- **AC-07 / WORKOUT-018 / DES-017,021:** Workout form and create-handler tests pass for explicit
  start and tested input/active-exercise guards. Actual lifecycle and database rollback pending.
- **AC-08 / PLAN-014 / DES-018,021:** Plan form, validator, and create-handler tests pass for
  tested default prescriptions and inactive-exercise rejection. Complete custom prescription
  boundaries and database transaction coverage pending.
- **AC-09 / WORKOUT-019 / DES-019,021:** Editor tests pass for opt-in, add failure, serialized
  additions, and successful-add/failed-refresh distinction. Metadata refresh regression passes.
  Authenticated draft, recorded sets, and completion lifecycle pending.
- **AC-10 / EXERCISE-015 / DES-015–016:** Discovery tests pass for initial error/retry, empty
  response, stale success suppression, immediate debounce clearing, and page failure preserving
  loaded results. Complete interruption/stale-error matrix pending.
- **AC-11 / A11Y-005 / DES-005–006,016:** Tests verify names, pressed state, Enter activation,
  Space-release activation, text state, and labeled controls surviving forced SVG render failure.
  Manual keyboard traversal, focus appearance, screen-reader announcements, and full fallback
  workflow remain pending.
- **AC-12 / A11Y-005 / DES-007:** Styling implemented; authenticated 360px, desktop, 200% zoom,
  light/dark, and touch/no-hover matrix not yet executed.
- **AC-13 / DES-013,017–019,021:** Mocked handlers cover authentication short-circuit, member
  inactive visibility, owner-scoped add, and unavailable exercise rejection. Browser redirects
  signed-out creation to sign-in. Real disabled/deleted accounts, cross-user, and race checks pending.
- **AC-14 / DES-012,018,020:** Legacy query and member plan edit boundary tests pass. Direct
  exercise start, saved-plan start, admin forms, live edit, and historical-data manual smoke pending.

## Red-phase evidence

[Tasks execution notes](tasks.md#execution-notes) preserve original Red results. Import failure
establishes missing components, not complete behavior coverage. On 2026-09-19, the two focused
discovery/editor files ran 10 tests with 2 expected failures: old results remained during debounce,
and repeated Add issued two writes. Both passed after correction. Metadata and SVG fallback tests
were added as post-fix regressions; no pre-fix run is claimed for them.

## Automated checks

Local checks on 2026-09-19:

- `pnpm run lint`: passed.
- `pnpm run typecheck`: passed.
- `pnpm run test`: 22 files, 86 tests passed.
- `pnpm run build`: passed.
- `pnpm run verify:assets`: passed; 160 approved assets, image resolution for 246 exercises.
- `git diff --check`: passed.

All new discovery and changed component files are below 300 lines. Shared `src/utils/types.ts`
is 337 lines (326 at base), extended with the required query contract; unrelated type splitting
was not attempted. Targeted new-discovery searches found no RPE, Zod imports, or removed
training-program terminology; this is not a repository-wide terminology certification.

## Manual scenarios

- Actor: signed-out browser. Precondition: local development server on `127.0.0.1:3000`.
  Action: visit `/workouts/create`. Observation: sign-in with workout-creation return URL.
  Result: passed UI authentication boundary only.
- Authenticated member/admin scenarios: blocked by missing signed-in test session. Credentials
  were not read and authentication was not bypassed. Responsive/accessibility, role, three-flow,
  and failure-injection scenarios remain pending.

## Security and authorization

Existing guards/shared Prisma remain. New filtering trusts no client owner ID. Plan creation now
rejects inactive referenced exercises before creation, closing the DES-021 characterization gap.
Mocked tests do not prove production configuration, concurrent archive races, or database rollback.
No credentials were added to source or this record.

## Data and migration

No schema, migration, index, backfill, seed, retention, or lifecycle change. No hosted rows changed.
Existing transaction/ownership behavior is retained; database integrity/race evidence pending.

## Deployment and external state

Not deployed. Hosted counts for twelve groups and Full Body/unknown categories are **unknown**.
No target database environment was established for inspection. Asset verification and `.env`
presence are not hosted-state evidence. Recovery is a scoped code revert/redeploy preserving
unrelated work; no new-schema data rollback is needed.

## Design comparison and deviations

Corrections stay within the approved design: immediate stale-result invalidation, serialized Add,
refresh retry without repeating a successful write, metadata preservation, diagram error isolation,
exercise-result imagery, and an image-based equipment filter that intersects existing discovery criteria.
No additional product scope/dependency was introduced. Verification coverage is incomplete, not
an accepted reduction in criteria. Earlier task checkmarks overstated some test coverage; the
outstanding assertions and manual scenarios above prevent claiming full verification.

## Known gaps

- Accepted/deferred: authenticated flow, data-preservation, role, and accessibility/responsive
  matrix. Owner: implementation agent when a test session is available. Follow-up: T29–T30.
- Accepted/deferred: database-backed category/pagination and transaction/race verification.
  Owner: implementation agent when an identified test database is available. Follow-up: T27.
- Accepted/deferred: hosted category coverage remains unknown. Owner: Keerthan K to identify the
  target and authorized read source; implementation agent to record T31 counts. No production writes implied.
- Archive authorized separately on 2026-09-19; deferred checks remain historical follow-ups and do
  not become passing evidence through Archive.

## Canonical documentation synchronization

Updated exercise/workout/plan PRDs, system qualities, corresponding feature SDDs, frontend
architecture, endpoint catalog, and product inventory. These describe implemented contracts, not
completed hosted/manual verification. Existing `last_verified` dates were not advanced. No ADR,
schema/index, retention, vendor, secret, deployment architecture, configuration, or tier changes
because the approved design changes none of those boundaries.

## Archive readiness

- [x] Every criterion has passing evidence or a gap explicitly accepted by Keerthan K.
- [x] Automated checks are complete; unavailable environment-dependent scenarios are accepted/deferred.
- [x] Material gaps are explicitly approved for deferred follow-up without a deployment-readiness claim.
- [x] Changed canonical requirements and implementation contracts synchronized.
- [x] No lasting product or implementation rule remains only in this package; deferred evidence stays historical here.
- [x] Archive destination `specs/changes/archive/2026/2026-09-18-muscle-guided-workout-start/` authorized.

## Verification decision

- Status: Approved with disclosed follow-ups deferred.
- Verified by: Keerthan K (project owner).
- Date: 2026-09-19.
- Archive authorized: Yes, by Keerthan K on 2026-09-19.
