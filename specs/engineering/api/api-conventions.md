---
id: api-conventions
title: API Conventions Standard
status: draft
authority: binding-engineering
requirements: []
decisions: []
code: []
tests: []
last_verified: null
---

# API conventions

## Purpose

This document defines mandatory behavior shared by future API endpoints. It must be activated only after bootstrap confirms or intentionally migrates existing routes.

## Request order

Handlers must enforce concerns in this order unless an approved design explains an exception:

1. Reject unsupported methods.
2. Verify identity for protected routes.
3. Verify administrator role or resource ownership.
4. Parse and validate untrusted input.
5. Enforce domain invariants.
6. Execute persistence with an explicit transaction boundary.
7. Serialize a typed response.
8. Translate and log failures safely.

## Contract rules

- Route names use one stable domain vocabulary.
- GET is read-only; mutations use an appropriate non-GET method.
- Request and response shapes have shared TypeScript types when consumed by browser code.
- Runtime validation occurs even when TypeScript types exist.
- Dates use an explicitly documented wire representation and time basis.
- Units are named in types or accompanied by a documented unit system.
- Identifiers are opaque strings unless a PRD exposes meaning.
- Filtering, ordering, pagination, and limits are deterministic.
- Mutations document side effects, repeat behavior, and idempotency.
- Database/client/provider errors do not escape as public contracts.

## Authentication and ownership

Public, authenticated, and administrator endpoints are declared explicitly. User-owned queries derive the owner from verified server identity. Ownership must apply to reads and mutations, including nested records. Client-side route protection never satisfies this rule.

## Client responsibilities

Browser pages and components call typed shared wrappers rather than scattering raw HTTP calls. Wrappers do not reinterpret authorization or hide contract-breaking errors.

## Review

Every endpoint review checks method, input, auth, role/ownership, output, errors, side effects, idempotency, requirements, implementation path, and tests.
