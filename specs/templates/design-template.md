---
id: change-<YYYY-MM-DD>-<slug>
title: <Change title>
status: proposed
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

> **Layer:** *how* — **SDD / technical-specification delta** for the current stack. Copy this template into
> `specs/changes/active/`. Do not edit canonical technical specifications until Archive.
>
> **Depends on:** Signed `clarify.md`; reviewed `proposal.md`. SDD means policy and boundaries on the
> current stack, not pseudo-code. See the [Authoring guide](../handbook/authoring-guide.md#layer-placement-test).

---

## SDD delta

*<!-- Write critical stack-specific rules in the requirement forms defined by the Authoring guide. Include wiring, data contracts, and error states. -->*

## Boundaries

*<!-- Name files, modules, API routes, database tables, tenants, tiers, and blast radius. -->*

| Area | Paths / identifiers |
| --- | --- |
| Code | |
| Data | |
| Tenants / tiers | |

## ADR alignment

*<!-- Cite existing ADRs, or write: **Supersede:** draft ADR-NNNN in this change. -->*

## Operations

*<!-- Cover vendors, zero-data-retention requirements, deployment, flags, and secrets. Link canonical integration/operations docs or write N/A with a reason. -->*

| Concern | Link or N/A |
| --- | --- |
| Vendors | |
| Deployment / flags | |

## Test mapping

*<!-- Map every binding rule in proposal.md and design.md to a test. Every MUST NOT needs a negative test. -->*

| Rule ID / summary | Test (file or describe block) | Layer (integration / unit / E2E) |
| --- | --- | --- |
| | | |

---

*<!-- Add after upstream review: -->*

*Upstream review: <name> — <date>*

*Scope: design*

*Teach-back: confirmed*
