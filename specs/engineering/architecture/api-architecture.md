---
id: architecture-api
title: API Architecture Standard
status: draft
authority: engineering
requirements: []
decisions: []
code: []
tests: []
last_verified: null
---

# API architecture

## Purpose

This document governs the server-side lifecycle of requests handled by the FitWell monolith. It complements the detailed [API conventions](../api/api-conventions.md).

## Required request lifecycle

An active revision must define the order and responsibility for:

1. Method enforcement.
2. Authentication.
3. Role and ownership authorization.
4. Runtime validation and normalization.
5. Domain invariant checks.
6. Persistence and transaction boundaries.
7. Response serialization.
8. Error translation, logging, and observability.

## Rules

- Treat all request data as untrusted.
- Derive user authority from verified server identity, never a request field.
- Keep database and administrator SDK access server-only.
- Scope reads and writes at the query boundary where possible.
- Use shared infrastructure rather than reproducing method/auth/error behavior in each route.
- Define idempotency and partial-failure behavior for mutations that can be repeated.
- Do not expose internal errors, secrets, or sensitive record existence.

## Review

New request pipelines, middleware, public API surfaces, background execution, or error-contract changes require architecture review and coordinated API documentation.
