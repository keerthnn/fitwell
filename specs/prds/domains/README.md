# Domain PRDs

## Purpose

Domain PRDs partition FitWell's observable behavior into stable product areas. Each file defines the questions, requirement categories, and review responsibilities that must govern that domain. Concrete current behavior is added only during the dedicated bootstrap process.

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

## Activation

A domain PRD remains `draft` until its behavior is researched, requirement IDs are assigned, edge cases are reviewed, system qualities are linked, an implementing SDD exists, and traceability gaps are explicit.
