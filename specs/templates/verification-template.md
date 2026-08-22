---
id: change-<YYYY-MM-DD>-<slug>
title: <Change title>
status: implementing
authority: temporary
mode: full-sdd
phase: verification
opened: <YYYY-MM-DD>
verified: null
---

# Verification: <Change title>

> **Phase purpose:** Prove the approved Proposal and Design were realized, disclose deviations, synchronize canonical documents, and establish Archive readiness.

## Scope verified

Link `clarify.md`, `proposal.md`, `design.md`, and `tasks.md`. State the implementation revision and environments covered.

## Acceptance criteria and requirement coverage

Provide concrete evidence for every criterion and changed requirement.

| Requirement or criterion | Evidence | Result | Notes |
| --- | --- | --- | --- |
| <ID or criterion> | <test, command, or scenario> | Pass / Fail / Blocked | <details> |

## Red-phase evidence

Record the focused test command, expected pre-implementation failure, and why the failure demonstrated meaningful coverage.

## Automated checks

| Command | Environment | Result | Material warnings |
| --- | --- | --- | --- |
| `pnpm run <check>` | Local/CI | Pass / Fail | <warnings or none> |

Do not omit a required matrix check silently. Explain every check not run and whether it blocks completion.

## Manual scenarios

Use actor, precondition, action, and observed outcome.

| Actor/state | Precondition | Action | Observed result | Result |
| --- | --- | --- | --- | --- |
| <actor> | <state> | <action> | <observation> | Pass / Fail |

Include signed-out, cross-user, normal-user/admin, responsive, keyboard, error, interrupted, and duplicate-action scenarios as applicable.

## Security and authorization

Record adversarial ownership, role, disclosure, sensitive-data, and logging evidence. Write `Not applicable` only with a reason tied to the Design.

## Data and migration

Record migration status, representative-data execution, integrity queries, affected rows, compatibility, backfill, and recovery evidence. State `Not applicable` with rationale when there is no data impact.

## Deployment and external state

Record target, configuration review, authorized provider inspection, deployment identity, logs, and post-deploy smoke evidence. Do not include secret values.

## Design comparison and deviations

For every deviation state why it occurred, affected requirements, risk, approval, and canonical-document impact. Unapproved material divergence blocks Archive.

## Known gaps

List each gap, severity, disposition, owner, and follow-up. A critical requirement or security gap blocks completion.

## Canonical documentation synchronization

| Document | Required change | Completed | Evidence |
| --- | --- | --- | --- |
| PRDs/system qualities | <change or No change with reason> | Yes / No | <link> |
| SDDs/architecture | <change or reason> | Yes / No | <link> |
| ADRs | <change or reason> | Yes / No | <link> |
| API/database | <change or reason> | Yes / No | <link> |
| Integrations/operations/quality | <change or reason> | Yes / No | <link> |
| Product inventory/roadmap | <change or reason> | Yes / No | <link> |

## Archive readiness

- [ ] Every acceptance criterion has passing or explicitly accepted evidence.
- [ ] Required checks and scenarios are complete.
- [ ] Material deviations are approved and documented.
- [ ] Canonical documents are synchronized.
- [ ] No lasting rule remains only in the change package.
- [ ] Archive destination is `specs/changes/archive/<YYYY>/<original-directory-name>/`.

## Verification decision

- Status: Pending approval
- Verified by: Project owner
- Date: Not yet verified
- Archive authorized: No
