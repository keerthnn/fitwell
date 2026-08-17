---
id: prd-administration
title: Administration
status: active
authority: binding-product
requirement_prefix: ADMIN
engineering:
  - specs/engineering/features/administration.md
last_verified: 2026-08-15
---

# Administration PRD

## Purpose

Administration exposes explicitly privileged management of local users, shared catalogue data, built-in plans, workouts, feedback, administrator membership, analytics, and audit history.

## Requirements

### ADMIN-001 — Administrator gate

Every administrator page and operation must reject a signed-in member who lacks administrator access.

### ADMIN-002 — Overview

An administrator may view counts for users, workouts, active exercises, and built-in plans.

### ADMIN-003 — User management

An administrator may list users, inspect a user, disable an active local account, restore a disabled non-deleted account, or delete local application data.

### ADMIN-004 — Last administrator protection

An action must not remove or delete the last active administrator.

### ADMIN-005 — Exercise management

An administrator may create, update, archive, and restore exercises. Create/update enforces the catalogue validation and name/equipment uniqueness.

### ADMIN-006 — Built-in plan management

An administrator may create, update, archive, and restore built-in workout plans backed by active exercises.

### ADMIN-007 — Workout inspection

An administrator may list and inspect workouts across users and may delete a workout.

### ADMIN-008 — Administrator membership

An administrator may list administrator access, grant access to an active local user, and remove access while preserving at least one active administrator.

### ADMIN-009 — Feedback administration

An administrator may list all feedback, search/filter it, view conversations, reply to non-closed conversations, and close conversations.

### ADMIN-010 — Administrator analytics

An administrator may view completed-workout count, active-user count, and total duration over a supported date range.

### ADMIN-011 — Audit events

Sensitive administrator mutations create an audit event containing the administrator, action, entity type, optional entity identifier, optional metadata, and time. Administrators may list recent audit events.

### ADMIN-012 — Informational settings

The administrator settings page explains that authentication, database, seeds, and admin bootstrap are environment-managed; it does not persist editable application settings.

## Current scale boundary

Several administrator lists use fixed or minimal server limits, and client wrappers do not expose complete filtering or continuation controls.

## Traceability

Implementation design is defined by the [Administration SDD](../../engineering/features/administration.md) and [Authorization Model](../../engineering/architecture/authorization-model.md).
