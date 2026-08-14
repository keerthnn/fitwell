---
id: api-errors-and-validation
title: API Errors and Validation Standard
status: draft
authority: binding-engineering
requirements: []
decisions: []
code: []
tests: []
last_verified: null
---

# API errors and validation

## Purpose

This document governs predictable client-safe errors and runtime input validation across every endpoint.

## Error categories

- **400 Bad Request:** malformed, missing, out-of-range, or semantically invalid input.
- **401 Unauthorized:** no valid authenticated principal.
- **403 Forbidden:** identity is known but lacks a required role where revealing that distinction is safe.
- **404 Not Found:** target does not exist or must be concealed from an unauthorized caller.
- **409 Conflict:** valid request conflicts with current resource state and the client can act on that distinction.
- **405 Method Not Allowed:** unsupported method.
- **500 Internal Server Error:** unexpected server failure with no sensitive detail.

An active revision must define the shared JSON envelope and field-error structure after bootstrap. Endpoints may specialize error codes only when clients need deterministic handling.

## Validation rules

- Validate at the server boundary; client validation is usability only.
- Reject unknown or unsafe fields where practical.
- Normalize only well-defined representations; do not silently reinterpret ambiguous values.
- Validate identifiers, strings, dates, enums, arrays, units, ordering, and cross-field constraints.
- Domain invariant failures are distinct from syntax failures when the client needs a different response.
- Validation functions are pure where possible and tested with boundary tables.

## Disclosure and logging

Errors must not expose credentials, tokens, cookies, database details, stack traces, internal IDs beyond contract, or another user's record existence. Server logs retain correlation and operational detail without sensitive payloads.

## Verification

Each endpoint tests malformed input, missing authentication, insufficient privilege/ownership, absent target, relevant conflict, and unexpected failure translation.
