# Architecture specifications

## Purpose

Architecture documents define constraints shared by multiple FitWell domains. They answer where responsibilities live, which dependencies are allowed, where trust changes, and which invariants every feature must preserve.

## Documents

- [System overview](system-overview.md) governs context, topology, and major flows.
- [Application boundaries](application-boundaries.md) governs source-layer and domain dependency direction.
- [Frontend architecture](frontend-architecture.md) governs routing, state, UI composition, and client data access.
- [Backend architecture](backend-architecture.md) governs server runtime, persistence, and shared backend concerns.
- [API architecture](api-architecture.md) governs request processing and server boundaries.
- [Authentication flow](authentication-flow.md) governs identity and session design.
- [Authorization model](authorization-model.md) governs ownership, roles, and access enforcement.

## Authority and use

Active architecture SDDs have **engineering** authority; the authorization model is **binding engineering** because violating it can expose user data. Feature SDDs may specialize architecture but may not contradict it without an approved architecture change and, where durable, an ADR.

Read only the architecture documents relevant to a change. Update them when a cross-domain boundary or invariant changes, not for a local implementation detail.
