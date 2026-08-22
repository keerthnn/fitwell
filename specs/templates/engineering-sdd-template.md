---
id: sdd-<domain-or-feature>
title: <Feature title>
status: draft
authority: engineering
requirements: []
decisions: []
code: []
tests: []
last_verified: null
---

# <Feature> SDD

> **Writing instruction:** Describe verified current design or an approved proposed design explicitly. Link exact executable artifacts instead of copying their contents.

## Context

Explain the problem, domain boundary, existing constraints, and why an engineering design is required. Link the approving Proposal for new Full SDD work.

## Goals and non-goals

Translate approved scope into engineering goals. State adjacent systems or refactors that are intentionally excluded.

## Requirements and decisions

Map every relevant PRD/system-quality ID and ADR. Explain the design consequence, not the requirement text.

| ID | Source | Design consequence |
| --- | --- | --- |
| <DOMAIN>-001 | [PRD](../../prds/domains/<domain>.md) | <consequence> |

## Architecture and boundaries

Define components, trust boundaries, data ownership, dependency direction, and cross-domain calls. Use a diagram when several boundaries interact.

## Domain concepts and invariants

Define aggregates, identities, states, valid transitions, units, time semantics, uniqueness, and load-bearing rules.

Example invariant: “A child record is accessible only through an aggregate owned by the authenticated principal.”

## User and system flows

Describe success, empty, failure, interruption, retry, and recovery paths. Use a state diagram for non-trivial lifecycles and name invalid transitions.

## Frontend design

Define page/component responsibilities, state ownership, data loading, forms, responsive behavior, accessibility, and loading/empty/error/success states. State `Not applicable` for server-only designs.

## API design

For every affected operation define method/path, input and validator links, authentication, role/ownership, output, errors, side effects, transaction boundary, and repeat/idempotency behavior.

## Database design

Define model/relationship changes, invariants, referential actions, indexes and query rationale, migration/backfill, compatibility, and recovery. Link `prisma/schema.prisma` and migration files for exact structure.

## Authentication and authorization

Identify principal source, resource owner, role checks, trust boundaries, disclosure policy, and adversarial cases. Never rely on client-side visibility.

## Failure handling and consistency

Define partial failure, retry, duplicate requests, stale state, timeouts, transaction rollback, and the consistency visible to users.

## Observability

Define safe logs, metrics, alerts, correlation, and operational evidence. State what must never be logged.

## Testing and verification

Map requirements and invariants to unit, API, component, manual, migration, and operational evidence.

| Requirement/invariant | Test layer | Test or scenario |
| --- | --- | --- |
| <DOMAIN>-001 | API | `<DOMAIN>-001 <behavior>` |

## Deployment and migration

Define configuration, rollout order, compatibility window, post-deploy checks, stop conditions, and roll-forward/recovery path. Link runbooks.

## Alternatives considered

Compare credible alternatives and consequences. Create an ADR when the choice is durable, cross-cutting, or costly to reverse.

## Known limitations and follow-up triggers

Record accepted limitations, why they are acceptable, and the evidence or scale that requires reconsideration.

## Code and test map

Explain stable path responsibilities and keep frontmatter mappings current. Do not list generated files or every helper.

## Open questions and approval

Resolve material questions before activation. Record the approving change package or project-owner review and update `last_verified` only after comparing the document with evidence.
