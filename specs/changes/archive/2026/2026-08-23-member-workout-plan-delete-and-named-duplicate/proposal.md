---
id: change-2026-08-23-member-workout-plan-delete-and-named-duplicate
title: Member workout-plan deletion and named duplication
status: archived
authority: temporary
mode: full-sdd
phase: proposal
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
---

# Proposal: Member workout-plan deletion and named duplication

## Clarification source

The approved [Clarify](clarify.md) establishes that permanent deletion supplements the existing archive/restore lifecycle, is available only for the caller's private non-built-in plans, warns before deletion, and returns to the plan library on success. Duplication presents an editable name prefilled with `<source name> Copy` before creating the private copy.

## Proposed outcome

Members can permanently delete a workout plan they own, including a plan created through duplication, only after confirming an irreversible warning. Members retain archive/restore as the recoverable lifecycle choice. When duplicating any visible plan, members can accept or edit a suggested copy name before creation. Historical workouts retain their materialized exercise and set data after source-plan deletion.

## Scope

- Add permanent deletion for member-owned, private, non-built-in workout plans.
- Expose deletion only on an owned private plan's detail experience.
- Require an explicit, labeled warning that identifies the plan and states that deletion cannot be undone.
- Show visible deletion pending and failure states; return to the workout-plan library only after confirmed server success.
- Preserve the existing archive/restore capability without changing its semantics.
- Present a duplicate-name prompt for every visible source plan, prefilled with `<source name> Copy` and editable before submission.
- Apply the existing required and 120-character name rules to duplicate-name input on both client and server.
- Preserve existing visibility, ownership, historical-workout independence, and aggregate-consistency guarantees.
- Add automated API and component evidence for success, validation, ownership, built-in protection, failure, and confirmation behavior.
- Synchronize workout-plan product, feature, API, authorization, and data-lifecycle documentation.

## Non-goals

- Deleting, renaming, or changing the archive/restore lifecycle of built-in plans.
- Adding bulk deletion, trash, delayed purge, undo, retention periods, or backup/restore operations.
- Exposing archived-plan recovery through new member UI.
- Renaming an existing plan as part of duplication after the copy has already been created.
- Rewriting or deleting workouts previously started from a deleted plan.
- Changing workout-plan uniqueness rules; different plans may continue to share a name.
- Changing administrator audit policy for member-owned plan actions.

## Requirement delta

| Requirement | Action | Proposed outcome | Reason |
| --- | --- | --- | --- |
| `PLAN-009` | Unchanged | Members retain archive and restore for private non-built-in plans. | Permanent deletion supplements rather than replaces recoverable lifecycle. |
| `PLAN-010` | Amend | Before duplication, a member may accept or edit a suggested copy name; the created private plan uses the submitted valid name. | The current automatic suffix does not give the requested naming choice. |
| `PLAN-013` | Add | A member may permanently delete their private non-built-in plan only after an explicit irreversible-action confirmation. | Permanent deletion is a new observable lifecycle capability. |
| `PLAN-012` | Unchanged | Historical workout exercise/set data remains independent after source-plan deletion. | Existing integrity contract governs the new deletion path. |
| `PLAN-002`, `SEC-002`, `SEC-004` | Unchanged | Only the verified owner may delete a private plan; inaccessible plans remain undisclosed. | Existing ownership and server-authority requirements govern the new mutation. |
| `PLAN-005` | Unchanged | Submitted duplicate names remain required and limited to 120 characters. | Duplication reuses the existing plan-name contract. |
| `A11Y-002`, `A11Y-004` | Unchanged | Duplication/deletion expose pending and failure states; deletion requires labeled confirmation. | Existing request-state and destructive-action requirements apply. |
| `DATA-002`, `DATA-006` | Unchanged | Historical workouts remain intact and aggregate mutations do not leave partial data. | Existing integrity requirements cover plan deletion and cloning. |

## Acceptance criteria

- [ ] `AC-01`: Given an owned private non-built-in plan, when the member chooses delete, the UI shows a labeled confirmation naming the plan and warning that deletion is permanent before any delete request is sent.
- [ ] `AC-02`: Given an open deletion confirmation, when the member cancels, no data is changed and the plan remains visible.
- [ ] `AC-03`: Given an owned private non-built-in plan and confirmed deletion, when the server succeeds, the plan and its prescriptions are removed and the member is returned to the workout-plan library.
- [ ] `AC-04`: Given a deletion request for a built-in plan, another member's private plan, or an absent plan, the server makes no deletion and returns the same non-disclosing not-found outcome.
- [ ] `AC-05`: Given a workout previously started from a deleted plan, deletion leaves the workout's materialized exercises and sets intact; only its optional source-plan association is cleared according to the existing relation contract.
- [ ] `AC-06`: Given a visible built-in or private plan, when the member chooses duplicate, the UI opens a naming prompt prefilled with `<source name> Copy` and does not create data before submission.
- [ ] `AC-07`: Given the naming prompt, when the member submits a nonblank name of at most 120 characters, the server creates one private non-built-in copy owned by the caller with that exact trimmed name and the source prescription data.
- [ ] `AC-08`: Given blank, whitespace-only, or longer-than-120-character duplicate names, the UI prevents submission and the server independently rejects a bypass attempt without creating a plan.
- [ ] `AC-09`: Given duplicate or delete request failure, the UI preserves the current plan view, reports a user-facing error, restores available actions, and does not navigate as if successful.
- [ ] `AC-10`: While duplicate or delete is pending, the affected dialog communicates progress and prevents repeat submission.
- [ ] `AC-11`: Existing plan start, edit, archive/restore, and administrator built-in lifecycle behavior remains unchanged.

## High-level approach

Extend the existing member workout-plan domain rather than creating a new module. Add an owner-scoped permanent-delete operation for private plans and reuse the database's existing cascade and nullable source relation. Convert immediate duplication into a two-step interaction: collect and validate the destination name, then clone the visible source as one caller-owned aggregate. Keep identity and resource authority entirely server-side, and keep archive/restore as the separate recoverable option.

## Alternatives

| Alternative | Benefits | Risks/costs | Recommendation |
| --- | --- | --- | --- |
| Continue using archive as “delete” | No irreversible data operation or new endpoint. | Does not satisfy the approved permanent-delete outcome and makes warning language misleading. | Reject |
| Replace archive/restore with permanent delete | Simplifies visible lifecycle choices. | Removes an approved recoverable behavior and broadens scope unnecessarily. | Reject |
| Add permanent delete alongside archive/restore | Satisfies the request while preserving recoverability for members who want it. | Requires clear destructive copy, owner checks, and lifecycle documentation. | Select |
| Duplicate immediately, then redirect to edit | Reuses the existing edit form. | Creates data before name confirmation, can leave unwanted copies, and weakens failure semantics. | Reject |
| Ask for the copy name before duplication | Avoids unwanted records and makes the resulting name deliberate. | Adds dialog validation and pending/error state. | Select |

## Risk and compatibility assessment

- **Security/authorization:** High consequence if incorrect. The server must derive the caller identity and restrict deletion to matching owner plus non-built-in status; duplication continues to use the established visibility boundary.
- **Privacy/disclosure:** Inaccessible, built-in, and absent deletion targets should share a 404-style response so resource existence is not disclosed.
- **Data integrity:** Existing plan-prescription cascade and workout source `SetNull` relation support the desired deletion outcome. Design must include tests demonstrating historical workout independence.
- **Migration:** No schema or data migration is expected because current relations already support physical deletion and nullable historical source links.
- **API compatibility:** Duplication changes from source ID only to source ID plus name. The in-repository browser caller will be updated atomically; no documented public client compatibility window exists. A new delete operation increases the endpoint catalog count.
- **Accessibility:** The naming and confirmation dialogs need labels, error association, keyboard dismissal where safe, deliberate destructive confirmation, and visible pending states.
- **Operations/external services:** No external configuration or provider state is involved.
- **Recovery:** Individual hard-deleted plans have no application-level recovery. The UI must say so before confirmation; cancellation is the prevention mechanism.

## Delivery and rollout constraints

- Proposal, Design, and Tasks require separate approval from Keerthan K, the project owner, before implementation.
- Red-phase tests must prove the current lack of deletion, name input/validation, and authorization evidence before implementation.
- API, client wrapper/types, UI, and canonical documentation must ship together to avoid an incompatible partial flow.
- No database migration or deployment sequencing is expected, but Verification must confirm the generated client/schema behavior and production build.
- Release is blocked by failing owner/built-in/cross-user deletion evidence, historical-workout integrity evidence, or accessible confirmation/name validation gaps.

## Proposal decision

- Status: Approved
- Approved by: Keerthan K (project owner)
- Date: 2026-08-23
- Conditions: None proposed
