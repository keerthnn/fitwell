---
id: api-conventions
title: API Conventions
status: active
authority: binding-engineering
requirements: [SEC-001, SEC-002, SEC-003, SEC-004, DATA-002, DATA-003]
decisions: []
code: [src/pages/api/, src/lib/api/api-utils.ts, src/lib/auth/utils.ts, src/lib/auth/requireAdmin.ts, src/utils/spec.ts, src/utils/types.ts]
tests: []
last_verified: 2026-08-15
---

# API conventions

## Implemented contract

FitWell exposes same-origin Next.js Pages Router handlers under `/api`. Each file represents one operation and accepts one method through `checkIfGetOrSetError`, `checkIfPostOrSetError`, `checkIfPatchOrSetError`, or `checkIfDeleteOrSetError`. Unsupported methods return 405 with `{ "message": "Only <METHOD> requests allowed" }`.

Browser calls are centralized in `src/utils/spec.ts`; shared request and response shapes live in `src/utils/types.ts`. Axios sends the `token` cookie automatically to same-origin handlers. There is no version prefix, OpenAPI document, REST resource controller, or separately deployed API service.

## Access classes

- **Authenticated:** `getUserIdOrSetError` verifies the Firebase ID token cookie and rejects missing, disabled, or deleted local users. All member-owned queries include that user identifier.
- **Administrator:** `requireAdmin` performs the authenticated check and then requires an `AdminAccess` row. Client guards are navigation aids only.
- No general application endpoint is anonymous. The authentication synchronization endpoints require a valid token even though they create the local user record.

## Validation, queries, and persistence

Handlers validate request bodies and query parameters with functions under `src/lib/api/validators/` or focused inline checks. List routes use bounded limits; cursor support is endpoint-specific. Prisma access uses the shared client from `src/lib/prisma.ts`. Multi-write aggregate replacement, creation, deletion, and audited administrator actions use transactions where the handlers explicitly define them.

## Responses

Reads generally return 200; creations return 201; updates and deletes return 200. Responses are direct JSON objects rather than a universal envelope. Dates serialize as ISO JSON strings. Identifiers are strings. The endpoint catalog records operation-specific payloads and side effects; executable TypeScript and validators remain exact shape authority.

## Current constraints

The route vocabulary includes action names such as `get-by-id`, `start-workout`, and `complete-workout`. Several lists return `nextCursor: null`; others implement cursors. This document describes that current contract and does not normalize it.
