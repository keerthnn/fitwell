---
id: change-<YYYY-MM-DD>-<slug>
title: <Change title>
status: approved
authority: temporary
mode: full-sdd
phase: design
opened: <YYYY-MM-DD>
requirements: []
decisions: []
code: []
tests: []
---

# Design: <Change title>

> **Phase purpose:** Define how the approved Proposal will be implemented and verified. Link `proposal.md`; do not broaden approved scope silently.

## Approved proposal

Link the approved Proposal and list its acceptance criteria and requirement deltas by ID.

## Upstream context reviewed

List PRDs, system qualities, architecture, feature SDDs, ADRs, API/data standards, runbooks, code, tests, incidents, and authorized external state reviewed. Record gaps rather than guessing.

## Design summary

Explain the chosen approach, major boundaries, and why it satisfies the Proposal.

## Architecture and dependency changes

Define components, responsibilities, dependency direction, trust boundaries, cross-domain calls, and external-system interactions. Include a diagram when several boundaries interact.

## Detailed flows and state transitions

Describe success, invalid, unauthorized, interrupted, duplicate, partial-failure, retry, terminal, and recovery paths. Use a state or sequence diagram for non-trivial behavior.

## Frontend design

Define routes/pages/components, state ownership, typed data access, forms, responsive layout, accessibility, and loading/empty/error/success/partial states.

## API contracts

For every operation specify method/path, input/type/validator, authentication, role/ownership, success output, status codes, errors, side effects, transaction, and repeat/idempotency semantics.

## Data design and migration

Define model/field/relation changes, invariants, uniqueness, referential actions, indexes/query rationale, backfill, compatibility window, destructive risk, integrity checks, and recovery.

## Authentication, authorization, and privacy

Define principal source, resource classes, permission checks, disclosure policy, sensitive data, logs, and adversarial cases.

## Failure handling and observability

Define expected failures, safe client behavior, consistency, retry, logging, metrics, correlation, alerts, and information excluded from telemetry.

## Test design and Red phase

Map each requirement and acceptance criterion to a planned test or manual/operational scenario. Name the expected pre-implementation failure.

| Requirement/criterion | Test layer | Planned evidence | Expected Red failure |
| --- | --- | --- | --- |
| <ID> | Unit/API/UI/Manual/Operational | <test or scenario> | <why it fails before implementation> |

## Deployment, rollout, and recovery

Define environment configuration, sequencing, migration timing, backwards compatibility, post-deploy checks, stop conditions, and roll-forward/recovery procedure.

## Alternatives and ADRs

Record technical alternatives and identify decisions that require proposed ADRs before Implementation.

## Risks and mitigations

Maintain a concrete risk table.

| Risk | Likelihood/impact | Prevention | Detection | Recovery |
| --- | --- | --- | --- | --- |
| <risk> | <rating> | <control> | <evidence> | <procedure> |

## Documentation impact

List canonical PRDs, SDDs, ADRs, API/data docs, integrations, operations, quality docs, and product inventory that Verification must synchronize.

## Design decision

- Status: Pending approval
- Approved by: Keerthan K (project owner)
- Date: Not yet approved
- Conditions: <conditions or none>
