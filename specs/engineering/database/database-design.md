---
id: database-design
title: Database Design
status: active
authority: engineering
requirements: [DATA-001, DATA-002, DATA-003, DATA-004, DATA-005, DATA-006]
decisions: [ADR-0003, ADR-0004, ADR-0006]
code: [prisma/schema.prisma, src/lib/prisma.ts, src/pages/api/]
tests: []
last_verified: 2026-08-15
---

# Database design

## Authority

`prisma/schema.prisma` is authoritative for exact fields, types, defaults, enums, relations, constraints, and indexes. This document explains boundaries and meaning without reproducing the schema.

## Aggregate boundaries

| Aggregate | Root and children | Ownership and write boundary |
| --- | --- | --- |
| Application identity | `User`; optional `UserProfile`, `UserActivityDay`, `AdminAccess` | `User.id` maps the external Firebase UID. Profile and activity are user-owned; access is administrator-managed. |
| Exercise catalog | `Exercise` | Platform-wide reference data. Workouts and plans reference it; deletion is not exposed, while archive uses `isActive`. |
| Workout | `Workout` → `WorkoutExercise` → `WorkoutSet` | Owned by one user. Child ordering and set replacement are managed within that owner boundary. |
| Workout plan | `WorkoutPlan` → `WorkoutPlanExercise` | Nullable owner distinguishes platform built-ins from user-owned plans. Starting a plan creates a separate workout snapshot. |
| Feedback | `Feedback` → `FeedbackMessage` | Owned conversation. Messages have an author role and optional author relation; administrator replies cross the owner boundary under privileged access. |
| Administration audit | `AdminAuditLog` | Independent append record tied to an administrator; selected privileged writes create it transactionally. |

## Relationship and identity rules

Most domain identifiers are database UUID strings. `User.id` is deliberately supplied from verified Firebase identity instead. User profile and administrator access are one-to-one via unique/primary user IDs. Exercise name plus equipment is unique. A workout's optional source plan uses `SetNull` so workout history survives plan deletion. Exercise references are not cascading, so referenced exercises cannot be silently removed. Audit-log administrator deletion is restricted, preserving attribution.

## Domain invariants beyond schema syntax

Handlers enforce ownership, built-in visibility, last-administrator safety, tracking-type-compatible set values, plan exercise prescriptions, feedback state transitions, and workout completion preconditions. Order and set numbers are indexed but not unique; correctness depends on validators and write logic. Units are stored canonically as kilograms, centimetres, metres, and seconds where named, while profile preference controls display.

## Derived data

Dashboard and analytics values are calculated from transactional rows on request. `UserActivityDay` is a daily activity projection updated best-effort during authenticated API use. No stored analytics snapshot or event stream exists.
