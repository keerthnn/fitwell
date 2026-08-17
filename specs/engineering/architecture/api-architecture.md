---
id: architecture-api
title: API Architecture
status: active
authority: engineering
requirements: [SEC-001, SEC-002, SEC-003, SEC-004, DATA-006]
decisions: []
code: [src/pages/api/, src/lib/api/api-utils.ts, src/lib/api/validators/, src/lib/auth/, src/utils/spec.ts, src/utils/types.ts]
tests: []
last_verified: 2026-08-15
---

# API architecture

## Surface

FitWell exposes same-origin Pages Router endpoints below `/api`. The UI calls them with Axios wrappers; there is no GraphQL, generated API client, or separate public API version.

## Method enforcement

Each handler accepts one method through shared GET, POST, PATCH, DELETE, or PUT guards. Unsupported methods return 405 with a message naming the accepted method.

## Authentication modes

- Local-user synchronization requires a valid ID-token cookie but creates or updates the local user.
- Member endpoints call `getUserIdOrSetError` and use the verified Firebase UID.
- Administrator endpoints call `requireAdmin`, which first authenticates and then requires an `AdminAccess` row.

There are no anonymous product-data endpoints.

## Validation

Validators parse `RequestInputValue` into concrete domain inputs and collect field-level `ValidationError` records. APIs return 400 for invalid filters, bodies, identifiers, dates, ranges, or domain inputs.

## Authorization

Member handlers use the verified UID in Prisma predicates or load an owning aggregate before nested mutations. Workout-plan visibility is the union of owned private plans and active/non-archived built-in plans. Administrator routes rely on server membership, not client guard state.

## Persistence and pagination

Handlers select/include explicit Prisma shapes or return mutated records. Dates serialize through JSON. Cursor endpoints fetch `limit + 1`, slice to the requested limit, and return `nextCursor`. Several calculate that cursor from `rows[limit - 1]`, identified by the current-state audit as a pagination risk.

## Client contract

`src/utils/spec.ts` owns browser wrappers and uses type assertions or typed Axios responses from `src/utils/types.ts`. No automated contract generation or runtime response validation exists.

## Error outcomes

- 400 invalid input/query/identifier.
- 401 missing, invalid, or expired authentication.
- 403 disabled application access or missing administrator permission.
- 404 inaccessible or missing resource.
- 409 state conflict.
- 405 wrong method.

Exact routes are maintained in the [Endpoint Catalog](../api/endpoint-catalog.md).
