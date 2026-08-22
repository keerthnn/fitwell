---
id: prd-<domain>
title: <Domain title>
status: draft
authority: binding-product
requirement_prefix: <PREFIX>
engineering: []
last_verified: null
---

# <Domain> PRD

> **Writing instruction:** Replace bracketed values, remove instructional text after use, and keep the document stack-independent. Activation requires approval from Keerthan K, the project owner.

## Purpose

Explain the user or administrator problem and why the domain exists. Do not describe screens, endpoints, tables, or libraries.

Example: “This PRD defines the outcomes users rely on when recording a performed workout.”

## Actors

List product-visible actors and their goals. Distinguish authenticated users, administrators, and unauthenticated visitors only when behavior differs.

## Scope

List observable outcomes governed by this PRD. Keep each item within the domain boundary.

## Non-goals

List adjacent outcomes intentionally governed elsewhere or excluded. Link the owning PRD where one exists.

## Definitions

Define product terms that readers must interpret consistently. Avoid implementation-only vocabulary.

## Requirements

Write one stable, testable contract per heading.

### <PREFIX>-001: <Short outcome>

**Requirement:** When <event or state>, the system must <observable outcome>.

**Rationale:** Explain user value or incident prevented. Do not justify an implementation.

**Acceptance examples:**

- Given <precondition>, when <action>, then <observable result>.
- Given <boundary or failure>, when <action>, then <safe result>.

Example:

> WORKOUT-001: When a user completes a workout, the system must preserve every successfully saved set associated with that workout.

## Edge cases and failure outcomes

Cover empty, duplicate, invalid, interrupted, unauthorized, stale, and terminal-state behavior that applies to the domain. Promote any binding outcome to a requirement ID rather than leaving it implicit here.

## Cross-domain requirements

Link system qualities and other domain PRDs. Explain the dependency without copying their rule text.

## Traceability

List implementing SDDs in frontmatter and summarize any requirement that intentionally lacks implementation or verification.

| Requirement | Implementing SDD | Verification status |
| --- | --- | --- |
| <PREFIX>-001 | [SDD](../../engineering/features/<domain>.md) | Not yet verified |

## Open questions

Record questions whose answers may change a requirement. Resolve or explicitly defer every material question before changing status to `active`.

## Change history

Record material requirement additions, amendments, retirements, and the workflow that approved them. Git remains the detailed edit history.
