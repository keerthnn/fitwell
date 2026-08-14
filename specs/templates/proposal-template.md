---
id: change-<YYYY-MM-DD>-<slug>
title: <Change title>
status: proposed
authority: temporary
mode: full-sdd
phase: proposal
opened: <YYYY-MM-DD>
affected_prds: []
affected_sdds: []
affected_decisions: []
---

# Proposal: <Change title>

> **Phase purpose:** Define the approved outcome and scope separately from detailed engineering design. Link the completed `clarify.md`.

## Clarification source

Link `clarify.md` and summarize the resolved problem, decisive evidence, and bounded unknowns.

## Proposed outcome

State what becomes true for users, administrators, operators, and data after this change.

## Scope

List included behavior, domains, environments, data, and operational work.

## Non-goals

List tempting adjacent work intentionally excluded and where it belongs.

## Requirement delta

Record each proposed requirement addition, amendment, retirement, or unchanged cross-domain dependency.

| Requirement | Action | Proposed outcome | Reason |
| --- | --- | --- | --- |
| <ID or new prefix> | Add / Amend / Retire / Unchanged | <outcome> | <reason> |

Do not edit active canonical PRDs as if approved until this proposal is accepted; retain proposed wording here or in an explicitly marked draft.

## Acceptance criteria

Write independently verifiable criteria. Use stable IDs where available.

- [ ] Given <precondition>, when <action>, then <observable outcome>.
- [ ] If <failure or unauthorized condition>, the system produces <safe outcome>.

## High-level approach

Describe the intended direction and boundary changes without route, schema, or algorithm detail better left to Design.

## Alternatives

Compare credible outcome-level or architectural directions.

| Alternative | Benefits | Risks/costs | Recommendation |
| --- | --- | --- | --- |
| <option> | <benefits> | <risks> | Select / Reject |

## Risk and compatibility assessment

Cover security, privacy, authorization, data, migration, API compatibility, UI accessibility, external configuration, deployment, and recovery. State `Not applicable` with rationale where appropriate.

## Delivery and rollout constraints

State sequencing, compatibility windows, feature availability, migration dependencies, and evidence required before release.

## Proposal decision

- Status: Pending approval
- Approved by: Project owner
- Date: Not yet approved
- Conditions: <approval conditions or none>
