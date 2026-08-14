# Feature SDDs

## Purpose

Feature SDDs define how each FitWell domain fulfills its PRD within shared architecture, API, data, security, and operational constraints. They are the canonical engineering home for domain invariants, flows, failure behavior, and code/test maps.

## Domain SDDs

- [Authentication](authentication.md)
- [User profiles](user-profiles.md)
- [Onboarding](onboarding.md)
- [Exercise catalog](exercise-catalog.md)
- [Workout engine](workout-engine.md)
- [Workout plans](workout-plans.md)
- [Dashboard](dashboard.md)
- [Analytics](analytics.md)
- [Feedback](feedback.md)
- [Administration](administration.md)

## Responsibilities

Each SDD author must trace active PRD IDs, respect architecture and accepted ADRs, define boundaries and failure states, link exact code/tests, and disclose gaps. Shared rules are linked rather than copied.

These documents define domain-specific authoring standards until the codebase bootstrap is performed. They remain `draft` and make no current implementation claims.

## Change control

Update a feature SDD when its invariant, flow, contract, ownership, data lifecycle, or cross-domain dependency changes. Local refactors that preserve the design require only path-map updates when paths materially move.
