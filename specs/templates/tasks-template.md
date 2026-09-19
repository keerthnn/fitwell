---
id: change-<YYYY-MM-DD>-<slug>
title: <Change title>
status: proposed
authority: temporary
mode: full-sdd
phase: tasks
opened: <YYYY-MM-DD>
---

# Tasks: <Change title>

> **Layer:** *do* — atomic Apply checklist only. **Do not add new requirements here**; trace each
> step to `proposal.md` or `design.md`. Copy this template into `specs/changes/active/`.
>
> **Depends on:** Signed `clarify.md` and upstream-reviewed `design.md`. Red-phase test tasks run before implementation tasks.

---

## Red phase (tests must fail first)

- [ ] *<!-- Example: Add integration test for R-1 in design.md §Test mapping → run → confirm FAIL. -->*

## Implementation

- [ ] *<!-- Example: Step 1 — design.md §SDD delta rule R-2; touch `path/to/file.ts`. -->*

## Verify

*<!-- At Apply time, confirm mapped tests run before handing off for human review. -->*

- [ ] *<!-- All mapped tests are green; no untraced binding rules remain in design.md §Test mapping. -->*

---

*<!-- After human code review, run post-review Verification, then Archive: fold deltas into canonical specs and move this set to `specs/changes/archive/YYYY/YYYY-MM-DD-<feature-slug>/`. -->*
