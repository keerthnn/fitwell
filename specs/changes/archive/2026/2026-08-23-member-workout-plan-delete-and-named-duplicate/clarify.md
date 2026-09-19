---
id: change-2026-08-23-member-workout-plan-delete-and-named-duplicate
title: Member workout-plan deletion and named duplication
status: archived
authority: temporary
mode: full-sdd
phase: clarify
opened: 2026-08-23
archived: 2026-08-23
affected_prds:
  - specs/prds/domains/workout-plans.md
  - specs/prds/system-qualities.md
affected_sdds:
  - specs/engineering/features/workout-plans.md
  - specs/engineering/architecture/authorization-model.md
  - specs/engineering/api/endpoint-catalog.md
  - specs/engineering/database/data-lifecycle.md
affected_decisions: []
code:
  - src/pages/workout-plans/[id]/index.tsx
  - src/components/workout-plans/
  - src/pages/api/workout-plans/
  - src/lib/api/validators/workout-plan.ts
  - src/utils/spec.ts
  - src/utils/types.ts
  - prisma/schema.prisma
---

# Clarify: Member workout-plan deletion and named duplication


> **Phase:** Clarify — decision record before delta files.
>
> **Canonical guide:** [Engineering workflow](../../../../handbook/engineering-workflow.md#1-clarify).
>
> **Format migration:** Historical approval is transcribed from this package. Newly explicit fields below summarize the original record; they do not constitute a new human review.

---

## Feature request (input)

Keerthan K, the project owner, requested that members be able to delete workout plans they created or obtained by duplication, receive a warning before deletion, and choose the new plan name when duplicating a workout plan.

## Restatement

Members can deliberately remove only their own private workout plans through a clearly warned action, historical workouts remain intact, and members can review or edit a valid destination name before duplicating any plan they are permitted to view.

**Human approval:** Original Clarify approved by Keerthan K on 2026-08-23.

### Original problem statement

Members can currently archive their own private plans but cannot explicitly delete them. Duplication immediately creates a private copy named by appending `Copy`, so the member cannot review or customize the name before data is created. Adding deletion changes the documented lifecycle of a user-owned aggregate and requires confirmed destructive UI, owner-scoped server enforcement, and preservation of already materialized workout history.

## Upstream audit

| Check | Result | Notes |
| --- | --- | --- |
| Specs read | Recorded in the original package | Workout Plans PRD/SDD, System Qualities, authorization, API, and data lifecycle; see evidence below and linked documents |
| ADR alignment | No new ADR required | Established Pages Router, Axios, MUI, Prisma, and ownership conventions |
| Compliance | Existing constraints retained | Ownership, server authority, history preservation, and destructive confirmation |
| Blocking questions | Resolved in original approval | Permanent deletion, editable name default, library navigation, and retained archive/restore |
| Blast radius (`code` in frontmatter) | Existing plan domain | Detail UI, plan APIs, typed client, and existing Prisma relations |

### Evidence

| Evidence | Source | Confidence |
| --- | --- | --- |
| A member may currently archive or restore a private non-built-in plan. | [`PLAN-009`](../../../../prds/domains/workout-plans.md) | Verified |
| Duplication currently promises a new private plan whose name indicates that it is a copy. | [`PLAN-010`](../../../../prds/domains/workout-plans.md) | Verified |
| Destructive actions exposed in the UI require a labeled confirmation step. | [`A11Y-004`](../../../../prds/system-qualities.md) | Verified |
| A member must not mutate another member's private plan, and browser-supplied authority is insufficient. | [`PLAN-002`, `SEC-002`, and `SEC-004`](../../../../prds/domains/workout-plans.md) and [system qualities](../../../../prds/system-qualities.md) | Verified |
| Plan name is required and limited to 120 characters. | [`PLAN-005`](../../../../prds/domains/workout-plans.md) | Verified |
| The current member lifecycle endpoint only toggles `isArchived` on an owned, non-built-in plan. | [`archive.ts`](../../../../../src/pages/api/workout-plans/archive.ts) | Verified |
| The current duplicate endpoint accepts only a source ID and unconditionally uses `<source name> Copy`. | [`duplicate.ts`](../../../../../src/pages/api/workout-plans/duplicate.ts) | Verified |
| The current detail page duplicates immediately without requesting a name and exposes no delete action. | [`index.tsx`](../../../../../src/pages/workout-plans/[id]/index.tsx) and [`WorkoutPlanDetail.tsx`](../../../../../src/components/workout-plans/WorkoutPlanDetail.tsx) | Verified |
| Deleting a plan aggregate cascades to its prescriptions, while existing workout source references become null and copied workout exercise/set data remains independent. | [`schema.prisma`](../../../../../prisma/schema.prisma) and [Workout Plans SDD](../../../../engineering/features/workout-plans.md) | Verified |
| There are no current automated workout-plan ownership, deletion, or duplication tests. | [Workout Plans SDD verification gap](../../../../engineering/features/workout-plans.md) and repository test inventory | Verified |

### Actors and affected outcomes

- **Plan owner:** may delete a private, non-built-in plan only after an explicit warning and may choose a valid name before duplicating any visible plan.
- **Other member:** must not learn about or delete another member's private plan.
- **Built-in plan consumer:** may duplicate a visible built-in plan with a chosen copy name but must not delete the built-in source.
- **Historical workout owner:** retains workout exercise and set history after the source private plan is deleted; the optional source-plan link may become null.
- **Administrator:** built-in plan lifecycle remains governed by the separate administrator archive/restore flow unless later approved otherwise.

### Constraints

- Authentication must continue through `getUserIdOrSetError`; server mutations must derive ownership from the verified principal.
- Member deletion must be restricted to a matching `userId` and `isBuiltIn: false`; inaccessible and non-owned IDs must not be disclosed.
- The confirmation must identify the destructive action and prevent incidental deletion, satisfying `A11Y-004`.
- A chosen duplicate name must satisfy the existing required and 120-character limits on both client and server.
- Duplication must remain available for any currently visible source plan and create a private, non-built-in aggregate owned by the caller.
- Plan deletion must not rewrite or delete exercises and sets already materialized into workouts, satisfying `PLAN-012` and `DATA-002`.
- Existing built-in administrator lifecycle behavior is out of scope.
- No schema migration or external-service change is currently indicated; Design must confirm this after the lifecycle decision.

### Initial blast radius

- Product contracts: `PLAN-009`, `PLAN-010`, `PLAN-012`, `A11Y-002`, `A11Y-004`, `SEC-002`, `SEC-004`, and `DATA-002`.
- Engineering contracts: workout-plan SDD, authorization model, endpoint catalog, and data lifecycle.
- Frontend: workout-plan detail page/component, confirmation and naming dialog behavior, typed Axios wrappers/types.
- API: a member delete operation, duplication input validation, owner/visibility predicates, response/error contracts, and transactional aggregate creation.
- Data: `WorkoutPlan`, cascade-owned prescriptions, and nullable `Workout.sourceWorkoutPlan` relation.
- Tests: API authorization/validation/side-effect coverage plus component interaction and visible request-state coverage.
- Runbooks/external state: none identified.

### Risks and Full SDD rationale

This change is Full SDD because it introduces a destructive user-data operation and changes a user-owned aggregate lifecycle. An incorrect ownership predicate could delete another member's data; an ambiguous delete/archive contract could remove recoverability unexpectedly; and an incomplete duplicate-name validator could drift from the existing creation contract. The confirmation, server authority, historical-workout independence, and failure behavior require explicit approval and evidence.

## Open questions

| Question | Status | Resolution / owner | Date |
| --- | --- | --- | --- |
| Permanent deletion or archive? | resolved | Permanent deletion supplements archive/restore — Keerthan K | 2026-08-23 |
| Editable suggested duplicate name? | resolved | Prefill with `<source name> Copy`, allow edits — Keerthan K | 2026-08-23 |
| Where to go after deletion? | resolved | Return to the workout-plan library — Keerthan K | 2026-08-23 |
| Retain archive/restore? | resolved | Yes — Keerthan K | 2026-08-23 |

### Original question rationale

| Question | Why it matters | Resolution source | Status |
| --- | --- | --- | --- |
| Does “delete” mean permanent physical deletion, replacing neither archive nor restore, or should the requested action continue to archive recoverably? | Determines data lifecycle, recoverability, API semantics, warning copy, and canonical requirement changes. | Keerthan K (project owner) | Resolved: permanent deletion is added |
| Should the duplicate-name prompt be prefilled with `<source name> Copy` while remaining editable? | Preserves the current helpful default while allowing choice and determines the dialog acceptance criteria. | Keerthan K (project owner) | Resolved: yes |
| Should successful deletion return the member to the workout-plan library? | Determines the terminal UI state after the current detail route no longer has a resource. | Keerthan K (project owner) or existing navigation convention | Resolved: yes |
| Should archive/restore remain available in addition to permanent deletion? | Determines whether deletion supplements or replaces the existing recoverable lifecycle. | Keerthan K (project owner) | Resolved: yes |

## Options

| Option | Product impact | Engineering cost | Risk | Recommendation |
| --- | --- | --- | --- | --- |
| Permanent deletion alongside archive/restore | Delivers removal and retains recoverable archive | Owner-scoped deletion and confirmation | Irreversible removal | Chosen in original approval |
| Archive as the only removal action | Does not deliver permanent removal | Existing implementation | Outcome mismatch | Rejected |
| Editable name before duplication | Member chooses name before creation | Dialog and input validation | Invalid input and request failure | Chosen in original approval |

**Chosen approach:** Permanent owner-only deletion alongside archive/restore, with an editable suggested name before duplication, as recorded in the original approval.

## v1 scope

Members can deliberately remove only their own private workout plans through a clearly warned action, historical workouts remain intact, and members can review or edit a valid destination name before duplicating any plan they are permitted to view.

### Definition of done

- Keerthan K, the project owner, approves the exact deletion/recoverability and duplicate-name outcomes through separate Clarify, Proposal, Design, and Tasks gates.
- Canonical workout-plan, API, authorization, and data-lifecycle contracts reflect the approved behavior.
- The UI provides accessible naming and destructive-confirmation states with visible pending and failure feedback.
- Server handlers validate inputs and enforce ownership/visibility without trusting client identity.
- Automated tests prove owner success, built-in/cross-user rejection, invalid-name rejection, cascade behavior, historical-workout independence, and relevant UI interactions.
- Proportional typecheck, lint, test, build, and manual responsive/keyboard/error checks are recorded in Verification.
- No lasting rule remains only in this change package before Archive.

## Non-goals and v2

### Non-goals (not in this change)

- Deleting, renaming, or changing the archive/restore lifecycle of built-in plans.
- Adding bulk deletion, trash, delayed purge, undo, retention periods, or backup/restore operations.
- Exposing archived-plan recovery through new member UI.
- Renaming an existing plan as part of duplication after the copy has already been created.
- Rewriting or deleting workouts previously started from a deleted plan.
- Changing workout-plan uniqueness rules; different plans may continue to share a name.
- Changing administrator audit policy for member-owned plan actions.

### v2 (separate feature request later)

N/A — no committed v2 scope was recorded.

## PRD change decision

- [x] **PRD delta required** — amend PLAN-010 and add PLAN-013, as recorded in the approved Proposal.
- [ ] **No PRD change** — not selected.

**Human confirmation:** The Proposal approval by Keerthan K on 2026-08-23 records acceptance of this delta. A separate pre-Proposal PRD-decision signature was not recorded in the original format.

## Accepted tradeoffs

N/A — the original approval delivers permanent deletion and naming choice; archive/restore remains available.

## Human decisions (required before Propose)

This checklist maps the original approvals to the current format. It is historical evidence, not a claim that this checklist was signed before the original Proposal.

- [x] **Restatement** — original Clarify outcome approved.
- [x] **Upstream audit** — original evidence and constraints retained.
- [x] **Open questions** — all four original questions resolved.
- [x] **Approach** — permanent deletion and editable copy-name prompt accepted.
- [x] **v1 scope** — scope recorded in the approved Clarify and Proposal.
- [x] **Non-goals / v2** — approved Proposal non-goals retained; no committed v2.
- [x] **PRD change** — confirmed through original Proposal approval.
- [x] **Tradeoffs** — no adjusted product promise recorded.

**Lock it — sign-off (transcribed original approval)**

```text
Clarify approved: Keerthan K — 2026-08-23
Propose may begin.
```

### Original approval record

- Status: Approved
- Approved by: Keerthan K (project owner)
- Date: 2026-08-23
- Notes: Permanent deletion supplements archive/restore; deletion redirects to the plan library; duplication uses an editable `<source name> Copy` default.
