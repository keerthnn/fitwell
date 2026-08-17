# Domain PRDs

## Purpose

Domain PRDs partition FitWell's observable behavior into stable product areas. The ten active PRDs were populated from current source during the 2026-08-15 bootstrap and link to their implementing feature SDDs.

## Domain map

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

## Boundary rules

- Authentication owns identity entry and recovery; authorization mechanics are cross-cutting engineering concerns.
- Profiles own user-maintained identity and preferences; onboarding owns first-run completion and routing outcomes.
- The workout engine owns performed workout state; workout plans own reusable intended structure.
- Dashboard owns summary presentation; analytics owns metric definitions and aggregation semantics.
- Administration owns administrator-visible capabilities and effects, while the underlying domain still owns its invariants.

When behavior spans domains, one PRD owns the outcome and links supporting requirements. Do not copy the same rule into multiple PRDs.

## Current status and future activation

All listed domain PRDs are active. A new domain PRD remains `draft` until behavior is researched, requirement IDs are assigned, edge cases are reviewed, system qualities and an implementing SDD are linked, and traceability gaps are explicit.
