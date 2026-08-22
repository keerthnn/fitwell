---
id: change-<YYYY-MM-DD>-<slug>
title: <Change title>
status: approved
authority: temporary
mode: full-sdd
phase: tasks
opened: <YYYY-MM-DD>
---

# Tasks: <Change title>

> **Phase purpose:** Convert the approved Design into ordered, independently verifiable execution. Link `design.md` and keep this document current during Implementation.

## Task rules

- Use `[ ]`, `[~]`, and `[x]` for pending, in progress, and completed.
- Each task names an output and verification.
- Order by dependency and keep at most one active implementation task per execution stream.
- Return to an earlier phase when evidence invalidates scope or design.
- Do not mark a task complete when its required test or evidence is missing.

## 1. Red-phase tests

- [ ] Add tests for <requirement/criterion>; verify by running <focused command>.
- [ ] Demonstrate the expected Red failure and record why it proves the test exercises missing behavior.
- [ ] Add adversarial, boundary, and failure tests required by the Design.

## 2. Implementation

- [ ] Implement <bounded design unit>; verify with <focused tests/typecheck>.
- [ ] Implement <next dependency>; verify with <evidence>.
- [ ] Update shared client types/wrappers and endpoint contracts where applicable.
- [ ] Perform focused review against the approved Design.

## 3. Data, configuration, and deployment

- [ ] Create and review migration/backfill/integrity work, or record `Not applicable` with reason.
- [ ] Update configuration/example/integration records, or record `Not applicable`.
- [ ] Prepare rollout and recovery evidence required by the runbooks.

## 4. Canonical documentation synchronization

- [ ] Update affected PRD requirements and statuses.
- [ ] Update feature and architecture SDDs, including code/test maps.
- [ ] Add, accept, or supersede ADRs.
- [ ] Update endpoint catalog and API standards.
- [ ] Update database, integration, and operations documents.
- [ ] Review product feature catalog and roadmap.

## 5. Verification

- [ ] Complete automated checks from the verification matrix.
- [ ] Complete manual, role, failure, migration, and environment scenarios.
- [ ] Complete `verification.md` and resolve deviations/gaps.

## 6. Archive

- [ ] Confirm no lasting rule remains only in this package.
- [ ] Obtain Verification approval from Keerthan K, the project owner.
- [ ] Set status to `archived` and move the directory to `specs/changes/archive/YYYY/`.

## Discoveries and replanning

Record new evidence, the affected phase, and the approved resolution. This log explains why tasks changed without replacing Git history.
