---
id: architecture-application-boundaries
title: Application Boundaries Standard
status: draft
authority: engineering
requirements: []
decisions: []
code: []
tests: []
last_verified: null
---

# Application boundaries

## Purpose

This document governs dependency direction inside the FitWell monolith. It prevents browser code from acquiring server authority, keeps domain logic discoverable, and avoids parallel patterns for the same responsibility.

## Required boundary definitions

An active revision must define responsibilities for:

- Route-level pages and application shells.
- Reusable UI components.
- Browser state and typed API clients.
- API handlers and request orchestration.
- Runtime validation.
- Authentication and authorization helpers.
- Domain and cross-cutting libraries.
- Prisma and external-service access.
- Generated code, assets, scripts, and tests.

## Rules

- Browser-safe code must not import server credentials, Firebase Admin, Prisma, or database drivers.
- API handlers establish method, identity, authorization, validation, and ownership before persistence.
- Shared abstractions must have one clear responsibility and real reuse.
- Domain coupling must be explicit in SDDs; avoid circular dependencies.
- Exact directory rules belong here only when they are stable architecture, not temporary layout.

## Review

New top-level source areas, dependency inversions, or competing request/data-access patterns require architecture review and may require an ADR.
