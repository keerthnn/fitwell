---
id: change-<YYYY-MM-DD>-<slug>
title: <Change title>
status: proposed
authority: temporary
mode: full-sdd
phase: clarify
opened: <YYYY-MM-DD>
affected_prds: []
affected_sdds: []
affected_decisions: []
---

# Clarify: <Change title>

> **Phase purpose:** Establish the real problem and constraints before proposing a solution. Replace every bracketed field and remove instructions after authoring.

## Request

State who requested the change, what was asked, and the source of the request. Preserve the original intent without accepting an assumed solution.

## Problem statement

Describe the observed problem or opportunity in one paragraph.

Example: “Users can enter state X, but the product contract does not define recovery after interruption, creating inconsistent outcomes.”

## Evidence

List facts with sources: observed behavior, requirement text, incident, user report, test, metric, external configuration, or code path. Label unverified reports and assumptions.

| Evidence | Source | Confidence |
| --- | --- | --- |
| <fact> | <link or observation> | Verified / Unverified |

## Actors and affected outcomes

Identify users, administrators, operators, external systems, and data classes affected. Explain the outcome for each.

## Constraints

Cover product requirements, security/privacy, data lifecycle, compatibility, architecture, external services, operations, time, and explicit non-goals already imposed.

## Initial blast radius

List candidate PRDs, SDDs, ADRs, code areas, tests, schema/migrations, runbooks, and external state that must be inspected. This is an investigation map, not yet a final design.

## Risks and Full SDD rationale

Explain the failure impact and which Full SDD trigger applies. Consider unauthorized access, data loss, migration failure, cross-domain drift, irreversible decisions, and operational uncertainty.

## Unknowns and questions

For each question state why the answer matters, how it will be resolved, and whether it blocks Proposal.

| Question | Why it matters | Resolution source | Status |
| --- | --- | --- | --- |
| <question> | <impact> | <person, code, test, or provider> | Open |

## Desired outcome

Describe success at the outcome level without selecting detailed mechanics.

## Definition of done

List the evidence required for the entire change to complete, including contract, implementation, tests, operational readiness, documentation sync, and user-visible verification.

## Clarify decision

- Status: Pending approval
- Approved by: Keerthan K (project owner)
- Date: Not yet approved
- Notes: <conditions or explicitly bounded unknowns>
