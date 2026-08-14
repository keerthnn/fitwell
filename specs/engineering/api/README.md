# API documentation

## Purpose

API documentation governs the browser-to-server contract of the FitWell monolith. It complements feature SDDs by standardizing request behavior and cataloging each endpoint without duplicating source types or validators.

## Documents

- [API conventions](api-conventions.md) owns shared method, authentication, authorization, validation, serialization, and mutation rules.
- [Endpoint catalog](endpoint-catalog.md) owns the route inventory and route-to-requirement/code/test mapping.
- [Errors and validation](errors-and-validation.md) owns error semantics and information-disclosure boundaries.

## Authority

Active API documents have **binding engineering** authority. Exact request and response types and runtime validation remain executable; the documents own externally observable semantics and cross-route consistency.

## Responsibilities

Every new or changed endpoint updates the catalog and shared conventions only when needed. Browser consumers must use the shared API wrapper/types. Reviewers compare documented status, auth, ownership, side effects, and errors with validators, handler behavior, and tests.
