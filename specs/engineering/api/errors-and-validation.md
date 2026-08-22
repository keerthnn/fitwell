---
id: api-errors-and-validation
title: API Errors and Validation
status: active
authority: binding-engineering
requirements: [SEC-003, SEC-004, DATA-002]
decisions: []
code: [src/lib/api/api-utils.ts, src/lib/api/validators/, src/pages/api/]
tests: []
last_verified: 2026-08-15
---

# API errors and validation

## Error behavior present in the repository

| Status | Current meaning |
| --- | --- |
| 400 | Invalid identifier, query, date range, confirmation, body, or domain precondition such as completing with no completed set. |
| 401 | Token cookie absent, invalid, or unverifiable. |
| 403 | Valid user is disabled/deleted, or a valid member lacks administrator access. |
| 404 | Resource absent or concealed by owner/built-in predicates. |
| 409 | Existing profile, closed feedback update, disallowed feedback deletion, non-resumable workout, or last-administrator invariant. |
| 405 | Handler method mismatch. |
| 500 | Unexpected failure, with a generic response in handlers that catch errors. |

There is no single error envelope. Existing handlers return one of `{ error: string }`, `{ errors: Record<string,string[]> }`, `{ message: string }`, or a plain `"Internal Server Error"` string in authentication synchronization. Clients must follow their specific wrapper contract.

## Validation boundaries

Runtime validation occurs before writes. Validators constrain identifiers, enumerations, numeric ranges, array sizes, strings, pagination, and dates. Member ownership and administrator authority are persistence predicates, not client validation. Prisma unique constraints and transactional predicates provide additional conflict protection. Client form checks improve usability but never replace server checks.

## Information boundaries

Owner-scoped handlers normally return 404 when the caller cannot access a record. Administrator absence is distinguished as 403. Responses do not include credentials, Firebase token contents, connection strings, or raw Prisma errors. Logged failures must preserve that boundary.
