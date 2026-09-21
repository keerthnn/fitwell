---
id: change-2026-09-21-weekly-workout-days-and-streak
title: Weekly workout days and goal streak
status: implementing
authority: temporary
mode: full-sdd
phase: verification
opened: 2026-09-21
verified: null
---

# Verification: Weekly workout days and goal streak

## Scope verified

Governing artifacts: [Clarify](clarify.md), [Proposal](proposal.md), [Design](design.md), and
[Tasks](tasks.md). Evidence covers the local uncommitted Fitwell web/backend worktree based on
`190ca5d` and the iOS worktree based on `1c52bfe`, both verified on 2026-09-21. No database
migration, deployment, hosted data inspection, or production write was performed.

## Acceptance criteria and requirement coverage

| Requirement or criterion | Evidence | Result | Notes |
| --- | --- | --- | --- |
| PROFILE-002, PROFILE-003, DES-004 | Validator and ProfileForm tests; web/iOS compile | Pass | Prompt uses workout-day language and ordinary inputs are limited to integers 1–7. |
| DES-001, DES-002 | Prisma schema/migration assertion tests; Prisma generate/validate | Pass | Range checks, indexed child history, cascade, deterministic normalization, and baseline SQL are present. Applying the migration remains environment-dependent. |
| PROFILE-005, DATA-006, DES-003 | Profile handler tests | Pass | Create uses nested history creation; changed update appends inside a transaction; unchanged update does not append. |
| DASH-002, DATA-005, DES-005 | Weekly-goal fixtures | Pass | Distinct dates, same-day deduplication, target five, timezone boundary, and UTC fallback behavior pass. |
| DASH-003, DES-005 | Weekly-goal fixtures in TypeScript and Swift | Pass | Pending current week preserves the preceding streak, successful current week joins immediately, misses stop the chain, and historical targets remain effective. |
| DES-006, DES-008 | Dashboard handler test, typecheck, production build | Pass | Completed workouts remain owner-scoped; renamed private fields are returned and target-history rows are not exposed. |
| DES-007 | Swift Package tests, core runner, simulator build | Pass | Live decode, pure calculation, demo history, legacy demo JSON, schema copy, and Xcode target membership pass. |
| Existing Dashboard totals/panels | Full web and iOS suites | Pass | Completed total, duration, recent/active workout, plans, and frequent exercise paths compile and retain their contracts. |

## Red-phase evidence

Before implementation, the focused Vitest run failed on the missing history model/migration,
1–14 validator limit, missing weekly helper, missing transactional history writes, old Dashboard
contract, and workout-count copy. The iOS core runner failed on missing Swift weekly-goal/history
types and old Dashboard fields. These failures established that the tests exercised the intended
new boundaries rather than already-passing behavior.

## Automated checks

| Command | Environment | Result | Material warnings |
| --- | --- | --- | --- |
| Focused Vitest files for validator/helper/migration/profile/Dashboard/copy | Local web | Pass | Included again in the full suite. |
| `pnpm run lint` | Local web | Pass | None. |
| `pnpm run test` | Local web | Pass | 37 files, 150 tests. |
| `pnpm run typecheck` | Local web | Pass | None. |
| `pnpm exec prisma generate` | Local web | Pass | Generated client is repository-ignored. |
| `pnpm exec prisma validate` | Local web | Pass | Schema valid. |
| `pnpm run verify:assets` | Local web | Pass | 572 approved assets and 246 exercises verified. |
| `pnpm run specs:check` | Local web | Pass | 26 required and 116 process files. |
| `pnpm run build` | Local web | Pass | Initial sandbox write was denied because the repo is outside the active writable root; approved rerun passed. |
| `./scripts/test-core.sh` | Local iOS | Pass | 25 core tests plus feature/source parse. |
| Xcode-toolchain `swift test --scratch-path /tmp/fitwell-spm-build` | Local iOS | Pass | 25 XCTest cases. Sandbox-restricted attempt was rerun with approval. |
| `xcodebuild ... -sdk iphonesimulator ... build` | Local iOS | Pass | Generic iOS Simulator, Debug, signing disabled; existing AppIntents no-dependency warning only. |
| `git diff --check` | Both worktrees | Pass | None. |

## Manual scenarios

| Actor/state | Precondition | Action | Observed result | Result |
| --- | --- | --- | --- | --- |
| Member, profile target control | No authenticated browser session was available | Inspect component behavior through test and compile coverage | Prompt, 1–7 choices, pluralized day copy, and save contract are covered; visual/touch behavior was not manually exercised | Deferred |
| Member, Dashboard target five | Fixed clock/workout/history fixtures | Calculate five distinct dates including a duplicate same-day workout | Five workout days qualify and the week joins the streak | Pass |
| Member, incomplete current week | Three successful completed weeks and two of five days this week | Calculate current streak | Current week remains pending and the three-week streak is retained | Pass |
| Legacy iOS demo user | Saved JSON without target history | Decode and load demo state | File remains decodable and receives a valid baseline | Pass |

Authenticated responsive, VoiceOver/screen-reader, and live API UI smoke tests remain pre-deployment
checks. No authentication was bypassed and no credentials were read for this verification.

## Security and authorization

The Dashboard still derives `userId` from the verified token and filters completed workouts, plans,
active workouts, and grouped exercises by that owner. Profile handlers accept no client user/profile
identifier or effective timestamp. History is created server-side and is not returned in the Dashboard
response. Mocked handler tests verify query shapes and authentication short-circuiting; a live
cross-user database scenario was not run because no authorized target database/session was identified.

## Data and migration

The additive migration normalizes legacy targets to 1–7, adds checks to both current and history
targets, creates an indexed cascade-owned history table, and backfills one deterministic baseline at
profile `createdAt`. Schema/migration assertions, Prisma generation, and validation pass. The SQL
was reviewed for non-destructive scope: it changes only out-of-range target values and creates/backfills
history; it does not delete profiles, workouts, plans, or exercises.

The migration was not applied to a database. Required deployment evidence is: run the repository's
local/target guard, inspect target counts and out-of-range values, apply through the existing Prisma
migration workflow, then verify one history row per pre-existing profile, zero values outside 1–7,
and the expected cascade/index constraints. Recovery keeps the additive table; application rollback
must not drop accumulated history.

## Deployment and external state

Not deployed. Backend migration and web/backend contract must be released before distributing the
renamed-contract iOS build. No feature flag, secret, external provider, vendor, or retention boundary
changed. Post-deploy profile-save and Dashboard smoke evidence remains environment-dependent.

## Design comparison and deviations

Implementation matches the approved Proposal and Design. The project synchronization script rewrote
the Xcode project format during implementation, so its output was replaced with the equivalent four
minimal source-reference/build-phase insertions; the simulator build proves target membership. This
is a reviewability correction, not a product or architecture deviation. No dependency or additional
scope was introduced.

## Known gaps

- Medium, environment-dependent: migration apply, representative row counts, and integrity queries.
  Owner: deployment operator for the authorized database.
- Low, environment-dependent: authenticated web/iOS profile and Dashboard smoke, responsive layout,
  and assistive-technology checks. Owner: release verification.
- No critical code, security, schema-definition, or automated-test gap is known.

## Canonical documentation synchronization

| Document | Required change | Completed | Evidence |
| --- | --- | --- | --- |
| PRDs/system qualities | Profile target and Dashboard weekly progress/streak semantics; existing DATA/SEC rules reviewed | Yes | User Profiles and Dashboard PRDs updated; System Qualities needed no rule change. |
| SDDs/architecture | Profile, onboarding, and Dashboard implementation contracts | Yes | Feature SDDs updated with history, helper, response, and tests. |
| ADRs | No durable technology decision changed | Yes | ADR-0004/0005 remain applicable; no new ADR required. |
| API/database | Renamed Dashboard fields, target history model/lifecycle | Yes | Endpoint catalog, data lifecycle, Prisma schema, migration, and iOS schema copy updated. |
| Integrations/operations/quality | Deployment order and migration evidence | Yes | Design and this verification record backend-first deployment and target checks. |
| Product inventory/roadmap | Current-state limits and Dashboard definitions | Yes | V1 specification plan and page design specification updated. |

## Archive readiness

- [x] Every acceptance criterion has passing automated evidence or an explicitly disclosed environment check.
- [x] Required local automated checks are complete.
- [x] No material deviation requires additional design approval.
- [x] Canonical documents are synchronized.
- [x] No lasting product or implementation rule remains only in the change package.
- [ ] Archive destination `specs/changes/archive/2026/2026-09-21-weekly-workout-days-and-streak/` requires explicit user authorization.

## Verification decision

- Status: Ready for project-owner verification and Archive decision.
- Verified by: Keerthan K (project owner)
- Date: Not yet verified
- Archive authorized: No

