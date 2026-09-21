---
id: change-2026-09-21-weekly-workout-days-and-streak
title: Weekly workout days and goal streak
status: in-progress
authority: temporary
mode: full-sdd
phase: tasks
opened: 2026-09-21
---

# Tasks: Weekly workout days and goal streak

> **Layer:** *do* — atomic Apply checklist only.
>
> **Depends on:** signed [Clarify](clarify.md), approved [Proposal](proposal.md), and approved
> [Design](design.md). Red-phase tests run before implementation.

---

## Red phase (tests must fail first)

- [x] Add PROFILE-003 validator coverage for integer targets 1–7 and rejection of 0, 8, and
  fractions; run and record expected failure. (DES-004)
- [x] Add pure weekly-goal fixtures for distinct dates, target five, current-week pending/success,
  missed past weeks, timezone boundaries, and historical target changes; run and record missing
  implementation failure. (DASH-002, DASH-003, DES-005)
- [x] Add schema/migration lifecycle assertions for range constraints, baseline backfill, index, and
  cascade; run and record expected failure. (DES-001, DES-002)
- [x] Add profile create/update handler tests for atomic target history and unchanged-target saves;
  run and record expected failure. (DES-003, DES-008)
- [x] Add Dashboard handler/contract coverage for owner-scoped completed workouts, renamed fields,
  and no history exposure; run and record expected failure. (DES-006, DES-008)
- [x] Add Swift core/demo tests for weekly-goal parity, renamed contract, target history, and old demo
  persistence; run and record expected failure. (DES-007)

Red evidence, 2026-09-21: the focused Vitest run failed on the missing history model/migration,
validator maximum, weekly helper, atomic writes, renamed response, and day copy. `scripts/test-core.sh`
failed on the missing Swift calculator/history types and renamed Dashboard fields. These are the
expected pre-implementation failures. Direct `swift test` is additionally unavailable under the
host CommandLineTools/SDK mismatch, so the repository's isolated compiler runner is the primary
Swift test command.

## Implementation

- [x] Add `WorkoutDayTargetHistory`, 1–7 constraints, deterministic normalization/backfill migration,
  and regenerate Prisma client. (DES-001, DES-002)
- [x] Make profile creation/update write target history atomically and preserve profile deletion
  cascades. (DES-003)
- [x] Limit shared validation and web/iOS controls to 1–7 and replace workout-count wording with
  the approved day question/copy. (PROFILE-002, PROFILE-003, DES-004)
- [x] Implement the pure timezone-aware weekly goal helper with historical targets and pending
  current-week behavior. (DASH-002, DASH-003, DES-005)
- [x] Integrate the helper and renamed private response fields into Dashboard API/web UI without
  altering unrelated totals/panels. (DES-006, DES-008)
- [x] Implement the equivalent Swift helper, live contract decode, and backward-compatible demo
  history persistence; synchronize the Xcode project. (DES-007)
- [x] Update the iOS schema copy and any durable implementation notes required for parity. (DES-001,
  DES-007)

## Verify

- [x] Focused web tests pass for validator, helper, migration, profile handlers, Dashboard handler,
  and copy/contract.
- [x] Full web `pnpm run lint`, `pnpm run test`, `pnpm run typecheck`, `pnpm run build`,
  `pnpm run verify:assets`, and `pnpm run specs:check` pass.
- [x] Prisma schema generation/validation and migration SQL review pass; target-environment apply is
  recorded as environment-dependent if no authorized database is available.
- [x] iOS `swift test`, repository core tests, and proportional `xcodebuild` pass.
- [x] Canonical PRDs/SDDs/data/API docs and iOS schema copy are synchronized; no lasting rule remains
  only in this package.
- [x] Create `verification.md` with requirement evidence, deviations, remaining environment checks,
  and archive recommendation.

---

After implementation verification, obtain Archive approval, synchronize final status, and move this
package to `specs/changes/archive/2026/2026-09-21-weekly-workout-days-and-streak/`.
