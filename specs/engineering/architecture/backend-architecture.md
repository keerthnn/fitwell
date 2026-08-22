---
id: architecture-backend
title: Backend Architecture
status: active
authority: engineering
requirements: [SEC-001, SEC-002, SEC-003, SEC-004, DATA-006]
decisions: []
code: [src/pages/api/, src/lib/, src/generated/prisma/, prisma/schema.prisma]
tests: []
last_verified: 2026-08-15
---

# Backend architecture

## Runtime model

The backend is not a separate service. Each file in `src/pages/api/` is a Next.js Pages Router API handler running in the same application deployment as the UI.

## Request composition

Handlers are orchestration units that enforce one HTTP method, authenticate or authorize, validate query/body data, query or mutate through the shared Prisma client, and return JSON or a small text error response. There is no service/controller/repository class hierarchy; business rules reside in handlers, validators, and focused helpers.

## Persistence

`src/lib/prisma.ts` creates `PrismaPg` from `DATABASE_URL` and instantiates the generated client. Development reuses it through a global variable to avoid hot-reload client proliferation. Transactions are used for aggregate replacements and multi-record mutations such as feedback/message creation, set replacement, nested workout/plan writes, account deletion, and audited administrator changes.

## Shared server concerns

- `src/lib/auth/utils.ts`: token verification, disabled/deleted account rejection, activity recording.
- `src/lib/auth/requireAdmin.ts`: database-backed administrator membership.
- `src/lib/api/validators/`: runtime parsing with field errors.
- `src/lib/workoutPlans/access.ts`: built-in/private plan visibility.
- `src/lib/analytics/`: activity-day recording and timezone date keys.
- `src/lib/admin/audit.ts`: standard audit-log data.
- `src/lib/images/assetRegistry.ts`: approved local asset resolution.

## Error boundary

Handlers return explicit 400/401/403/404/405/409 outcomes where implemented. Unexpected exceptions are generally left for Next.js to handle; there is no global API error middleware. Response error shapes vary.

## Background work

There is no queue or background worker. Authenticated request activity is recorded inline, throttled in memory, and wrapped so failure does not block the request.
