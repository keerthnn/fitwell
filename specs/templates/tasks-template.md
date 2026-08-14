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

## Rules

- Follow the approved design; revise earlier artifacts when reality invalidates it.
- Keep task states current.
- Complete tests before or with the implementation they verify.
- Do not defer canonical documentation synchronization past Verification.

## Red-phase tests

- [ ] Add requirement-driven tests.
- [ ] Run them and confirm they fail for the intended reason.

## Implementation

- [ ] <!-- Add ordered, independently verifiable implementation tasks. -->

## Data and deployment

- [ ] <!-- Add migration, backfill, configuration, rollout, or recovery tasks; state Not applicable when appropriate. -->

## Documentation synchronization

- [ ] Update affected PRDs.
- [ ] Update affected SDDs and architecture documents.
- [ ] Add or supersede required decisions.
- [ ] Update API, database, integration, and operations documents as applicable.
- [ ] Update product feature catalog if shipped behavior changed.

## Verification and archive

- [ ] Complete `verification.md`.
- [ ] Confirm no lasting rule remains only in this package.
- [ ] Move the verified package to `specs/changes/archive/YYYY/`.
