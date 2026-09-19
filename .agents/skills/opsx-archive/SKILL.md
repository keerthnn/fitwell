---
name: opsx-archive
description: >-
  OPSX Archive — fold deltas into canonical specs and move change set to dated
  archive folder. Use after Verify sign-off; human commits in full SDD.
---

# OPSX — Archive

**Policy:** [changes/README Archive mapping](../../../specs/changes/README.md#archive-mapping), [DEVELOPER_GUIDE §4](../../../specs/DEVELOPER_GUIDE.md#4-full-sdd-path-critical-areas).

## Prerequisites

- Verify complete with human cursory sign-off ([opsx-verify](../opsx-verify/SKILL.md)).
- Verify sign-off recorded.

## Steps (agent)

1. Confirm Verify sign-off exists — **Blocks Archive** without it.
2. Fold deltas into canonical specs per [changes/README Archive mapping](../../../specs/changes/README.md#archive-mapping):
   - `proposal.md` → `## PRD delta` into `/specs/prds/...` (skip if **No PRD change**).
   - `design.md` → `## SDD delta` into `/specs/engineering/features/...`.
   - Fold clarify rationale into PRD/SDD notes as needed.
3. Confirm `verification.md` records evidence and Archive authorization. Mark package status archived.
4. Move the entire unchanged package directory (`clarify.md`, `proposal.md`, `design.md`, `tasks.md`,
   `verification.md`) to `/specs/changes/archive/YYYY/<original-directory-name>/`.
5. Update [`/specs/product/`](../../../specs/product/) feature inventory if user-visible behavior changed.
6. Prepare diff; **human commits** in full SDD.

## Human gate

Human commit and merge. Agent does not commit in full SDD unless instructed.

## Done when

Canonical specs updated, the five-file package is archived under the year folder, and no stale package remains in `changes/active/`.

## Do not

- Archive before Verify sign-off.
- Leave stale package directories under `/specs/changes/active/`.
- Edit canonical PRDs/SDDs during Apply — only at Archive after Verify.
