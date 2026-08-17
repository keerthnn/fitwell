---
id: ADR-0005
title: Centralize browser API calls in shared Axios wrappers
status: accepted
authority: decision
date: 2026-08-15
requirements: [SEC-003, DATA-002]
supersedes: []
superseded_by: null
---

# ADR-0005: Centralize browser API calls in shared Axios wrappers

## Context and decision

Pages and components call the same-origin API through `src/utils/spec.ts`, with shapes in `src/utils/types.ts` and Axios as transport. New browser calls follow this wrapper boundary rather than embedding raw calls throughout UI components.

## Drivers and alternatives

Endpoint paths and types need a discoverable consumer boundary. The historic choice is unavailable; direct `fetch`, generated clients, and component-local calls are not the current convention.

## Consequences

Calls are reusable and centralized. Wrappers use TypeScript assertions rather than response runtime validation and therefore must stay synchronized with handlers.

## Security and data impact

Same-origin cookies accompany requests. Wrappers are not authorization controls; server handlers authenticate and scope access.

## Related documents and outcome

[API architecture](../architecture/api-architecture.md), [API conventions](../api/api-conventions.md). Accepted current decision; review if transport or contract generation changes.
