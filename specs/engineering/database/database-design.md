---
id: database-design
title: Database Design Standard
status: draft
authority: engineering
requirements: []
decisions: []
code:
  - prisma/schema.prisma
tests: []
last_verified: null
---

# Database design

## Purpose

This document governs how future authors explain FitWell's persistent model without copying the Prisma schema.

## Required content

An active revision must define:

- Aggregate roots and transaction boundaries.
- User-owned, platform-owned, shared, and administrative data.
- Relationship meaning and ownership inheritance.
- Domain invariants not completely enforced by schema syntax.
- Identifier strategy and external-identity mapping.
- Uniqueness, nullability, defaults, and timestamp meaning.
- Referential actions and why delete/restrict/set-null behavior is safe.
- JSON, arrays, enums, and units with compatibility implications.
- Links to feature SDDs and relevant ADRs.

## Rules

- Prisma schema is exact structural authority.
- Prefer database constraints for invariants the database can enforce reliably.
- Application checks must not be represented as database guarantees.
- Every user-owned aggregate must have a documented authorization path.
- Timestamps state timezone and semantic meaning.
- Derived/duplicated data states its source, refresh rule, and consistency tolerance.

## Review

Activation requires a model diagram, invariant review, query-pattern review, deletion simulation, and traceability to PRDs/SDDs. Structural redesign requires Full SDD.
