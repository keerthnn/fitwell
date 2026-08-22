---
id: ADR-<NNNN>
title: <Decision title>
status: proposed
authority: decision
date: <YYYY-MM-DD>
requirements: []
supersedes: []
superseded_by: null
---

# ADR-<NNNN>: <Decision title>

> **Writing instruction:** Use a concise decision phrase such as “Use server-verified ownership for user resources.” Proposed ADRs are not binding until accepted.

## Context

Describe the forces that make a durable decision necessary: requirements, constraints, current problems, scale, security/data risk, external limits, and prior decisions. Separate facts from assumptions.

Example: “Multiple domains need a common principal identifier, and inconsistent mapping would create ownership risk.”

## Decision drivers

List the criteria used to compare alternatives, ordered by importance.

- Security and data isolation.
- Operational simplicity.
- Reversibility.
- Compatibility and maintenance cost.

## Decision

State exactly what is chosen, where it applies, and any explicit exceptions. Use present tense after acceptance.

## Alternatives considered

For each credible alternative record benefits, costs, risks, and why it was not selected. Include “do nothing” when it is credible.

| Alternative | Benefits | Costs/risks | Disposition |
| --- | --- | --- | --- |
| <option> | <benefits> | <costs> | Rejected because <reason> |

## Consequences

### Positive

List expected benefits.

### Negative

List accepted complexity, lock-in, migration, or operational cost.

### Follow-up

List required SDD, code, migration, runbook, or future-review work.

## Security and data impact

State trust-boundary, privacy, retention, migration, and recovery impact. Write `No material impact` with rationale when appropriate.

## Related documents

Link driving PRDs, affected SDDs, operations, and earlier decisions. Populate reciprocal `supersedes` and `superseded_by` fields when applicable.

## Decision outcome

- Status: Proposed | Accepted | Superseded | Rejected
- Decided by: Keerthan K (project owner)
- Date: YYYY-MM-DD
- Review trigger: <condition that should reopen the decision>
