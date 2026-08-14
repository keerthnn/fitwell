# Authoring guide

Authority: **Engineering guidance**

## Purpose

This guide standardizes how FitWell specifications are named, written, linked, and maintained. Consistent authoring makes documents reviewable by humans and traversable by agents without requiring a separate knowledge-graph platform.

## Writing style

- Lead with the rule, outcome, or decision; explain rationale afterward.
- Prefer short declarative sentences and concrete nouns.
- Define project terms once and use them consistently.
- Separate observed facts, requirements, decisions, assumptions, and examples.
- Use tables for repeated mappings and diagrams only for flows, states, boundaries, or relationships that prose cannot express clearly.
- Avoid marketing language, vague goals, pseudo-code disguised as design, and prose that repeats source code.
- State uncertainty explicitly. Never turn an unverified inference into an active specification.

Examples:

- Weak: “The workout page should be secure and work well.”
- Strong PRD: “SEC-004: A user must not view or modify a private workout owned by another user.”
- Strong SDD: “Every user-scoped workout query must include the authenticated principal in its ownership predicate.”

## File and folder naming

- Use lowercase kebab-case: `workout-engine.md`.
- Use semantic nouns rather than work status: `authorization-model.md`, not `new-auth-notes.md`.
- ADR filenames use `NNNN-semantic-decision.md`; the ID inside is `ADR-NNNN`.
- Active change directories use `YYYY-MM-DD-semantic-change-name`.
- Do not encode an author's name, ticket system, or temporary branch name in canonical filenames.
- Do not rename a canonical file casually; links and frontmatter depend on stable paths.

## Requirement IDs

Requirement IDs are stable semantic anchors.

| Domain | Prefix |
| --- | --- |
| Authentication | `AUTH` |
| User profiles | `PROFILE` |
| Onboarding | `ONBOARD` |
| Exercise catalog | `EXERCISE` |
| Workout engine | `WORKOUT` |
| Workout plans | `PLAN` |
| Dashboard | `DASH` |
| Analytics | `ANALYTICS` |
| Feedback | `FEEDBACK` |
| Administration | `ADMIN` |
| Security/privacy | `SEC` |
| Data integrity/lifecycle | `DATA` |
| Accessibility/responsiveness | `A11Y` |

Format IDs as `PREFIX-NNN`. Allocate monotonically within a document. Never reuse an ID, even after retirement. Editorial clarification keeps the ID; a material change in promised behavior creates a new ID and retires or supersedes the old one.

## Requirement wording

Use:

- **must** for binding behavior;
- **must not** for a prohibition;
- **should** for a recommendation that permits a documented exception;
- **may** for optional behavior.

Requirements must describe observable outcomes or incident-preventing guarantees that remain meaningful after a stack rewrite. PRDs must not name routes, components, libraries, database columns, algorithms, environment variables, or implementation flags.

Recommended forms:

- **Ubiquitous:** “The system must …”
- **Event-driven:** “When …, the system must …”
- **State-driven:** “While …, the system must …”
- **Unwanted behavior:** “If …, the system must …”
- **Optional feature:** “Where … is enabled, the system must …”

Example:

> WORKOUT-021: When a user completes a workout, the system must preserve every set that was successfully saved before completion.

The matching SDD may then describe transactions, route behavior, and persistence mechanics.

## Frontmatter

Frontmatter makes authority and dependencies machine-readable. Use repository-relative paths.

Canonical PRD example:

```yaml
---
id: prd-workout-engine
title: Workout Engine
status: active
authority: binding-product
requirement_prefix: WORKOUT
engineering:
  - specs/engineering/features/workout-engine.md
last_verified: 2026-08-15
---
```

Feature SDD example:

```yaml
---
id: sdd-workout-engine
title: Workout Engine
status: active
authority: engineering
requirements:
  - WORKOUT-021
  - SEC-004
decisions:
  - ADR-0003
code:
  - src/pages/api/workouts/
tests:
  - test cases/pages/api/workouts/
last_verified: 2026-08-15
---
```

Use `[]` and `null` for relationships or dates that are genuinely not established. Never invent a file, requirement, decision, or verification date to make metadata look complete.

## Status conventions

Canonical documents use `draft`, `active`, `superseded`, or `retired`. ADRs use `proposed`, `accepted`, `superseded`, or `rejected`. Full SDD packages use `proposed`, `approved`, `implementing`, `verified`, and `archived`.

Changing status is a governance action:

- Activate only after review and evidence.
- Supersede by naming the replacement.
- Retire by recording the removal reason.
- Do not use `active` as a synonym for “work started.”

## Cross-references

- Use relative Markdown links for human navigation.
- Use repository-relative paths in frontmatter.
- Link a requirement by stable ID and source document.
- Link exact types, validators, schema, migrations, tests, and runbooks instead of copying them.
- Explain the relationship at the link; avoid unexplained “see also” lists.
- Keep links directional: PRDs point to implementing SDDs; SDDs point upstream to requirements and downstream to code/tests.

## Layer placement test

Ask these questions in order:

1. Is this product direction, inventory, or priority? Put it in `product/`.
2. Is this an observable promise or silent security/data incident guard that survives a stack rewrite? Put it in a PRD.
3. Is this how the current stack fulfills a requirement? Put it in an SDD or engineering standard.
4. Is this a durable technical choice among alternatives? Put it in an ADR.
5. Is this a safe operational sequence or invisible environment fact? Put it in integrations or operations.
6. Is this exact machine behavior? Keep it executable and link it.

## Examples versus rules

Examples make rules concrete but do not create hidden requirements. Label non-normative examples. If an example reveals new required behavior, add or amend a requirement instead of expecting readers to infer it.

## Review and verification dates

`last_verified` means the document was compared with its authoritative upstream and downstream evidence on that date. Reading or formatting a document is not verification.

## Authoring anti-patterns

- Copying TypeScript interfaces or Prisma models into Markdown.
- Writing PRDs in vendor or route language.
- Treating a roadmap item as approved scope.
- Creating an ADR after the fact solely to justify an arbitrary choice.
- Leaving unresolved questions in an active document.
- Storing current behavior only in an archived change.
- Updating dates without checking evidence.
- Loading every specification for a small task and losing the relevant constraints.
