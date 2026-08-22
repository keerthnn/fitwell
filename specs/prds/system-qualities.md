---
id: prd-system-qualities
title: FitWell System Qualities
status: active
authority: binding-product
requirement_prefixes:
  - SEC
  - DATA
  - A11Y
engineering:
  - specs/engineering/architecture/frontend-architecture.md
  - specs/engineering/architecture/api-architecture.md
  - specs/engineering/architecture/authentication-flow.md
  - specs/engineering/architecture/authorization-model.md
last_verified: 2026-08-15
---

# FitWell system qualities

## Security and privacy

### SEC-001 — Authenticated member access

Member pages and member data operations must require a valid signed-in identity.

### SEC-002 — Private member data

A member must not read, update, or delete another member's profile, workouts, private workout plans, or feedback.

### SEC-003 — Administrator access

Administrator capabilities must be unavailable to signed-out visitors and signed-in members who do not have administrator access.

### SEC-004 — Server authority

Changing browser navigation, hidden controls, request identifiers, or request bodies must not grant access to another member's data or administrator capabilities.

### SEC-005 — Disabled application accounts

A disabled or locally deleted application account must be denied access even when the external authentication identity can still sign in.

### SEC-006 — Sensitive information

User-facing responses and product documentation must not expose authentication tokens, cookies, database credentials, service-account credentials, or internal failure details.

## Data integrity and lifecycle

### DATA-001 — Ownership durability

Member-created profiles, workouts, private plans, and feedback must remain associated with the member who created them until their documented deletion behavior occurs.

### DATA-002 — Workout history integrity

Changes to an exercise or workout plan must not remove the exercise/set data already copied into a performed workout.

### DATA-003 — Explicit destructive actions

Application-account deletion and administrator destructive actions must require an explicit action and must not occur as an incidental side effect of viewing or editing another record.

### DATA-004 — Local account tombstone

Deleting local application data must leave enough local account state to prevent the same external identity from silently recreating an active local account.

### DATA-005 — Consistent time and units

Date ranges, workout dates, activity days, body measurements, weights, duration, and distance must use the units and time interpretation stated by the relevant domain.

### DATA-006 — Transactional aggregates

User-visible aggregate changes that create or replace a parent and its dependent records must not leave a partially updated aggregate after a failed request.

## Accessibility and responsiveness

### A11Y-001 — Responsive navigation

Public, member, and administrator navigation must remain usable on supported desktop and mobile layouts.

### A11Y-002 — Visible request states

Pages that load or mutate data must provide a visible loading or in-progress state and a user-facing failure state.

### A11Y-003 — Accessible status

Important workout, timer, account, feedback, and administrator states must not be communicated by color alone.

### A11Y-004 — Confirmed destructive actions

Destructive actions exposed in the UI must provide a labeled confirmation step.

## Reliability boundaries

Authentication activity analytics is best-effort and must not block an otherwise valid authenticated request. Local browser preferences and the rest timer may survive navigation/reload but are not server-authoritative fitness records.

## Traceability

These requirements are implemented across the linked architecture SDDs and the domain SDDs for Authentication, Profiles, Workouts, Plans, Feedback, and Administration.
