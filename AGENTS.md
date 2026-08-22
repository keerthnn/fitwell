# FitWell Agent Guide

FitWell is a Next.js **Pages Router** application for workout tracking. It uses React and MUI on the client, Firebase for authentication, and PostgreSQL through Prisma on the server.

The canonical documentation system begins at [`specs/README.md`](specs/README.md). Durable product requirements, engineering constraints, decisions, and operational procedures live under `specs/` and change with the code they govern.

## Required workflow

Before implementation:

1. Classify the task as lightweight or Full SDD using [`specs/handbook/engineering-workflow.md`](specs/handbook/engineering-workflow.md).
2. Read only the relevant PRDs, system qualities, feature SDDs, architecture documents, decisions, and runbooks.
3. Treat authentication, authorization, account lifecycle, admin access, destructive or complex migrations, new modules, cross-domain behavior, architecture changes, external services, deployment redesign, and user-data exposure/corruption risk as Full SDD.

The Full SDD sequence is mandatory and must not be merged or silently skipped:

```text
Clarify -> Proposal -> Design -> Tasks -> Implementation -> Verification -> Archive
```

Clarify and Proposal are separate artifacts. Implementation follows the approved task list and does not add another change-package document.

Use `specs/changes/active/YYYY-MM-DD-semantic-change-name/` and the corresponding templates in `specs/templates/`. Before Archive, synchronize all affected canonical documents and confirm no lasting rule remains only in the change package.

Lightweight work does not create a change package. It still ends with proportional verification and either canonical documentation updates or an explicit `No specification change` result.

## Quick rules

- Use the `fitness/*` import alias for modules under `src/` (for example, `fitness/lib/prisma`).
- Keep all test cases under the root `test cases/` folder, mirroring the relevant `src/` hierarchy.
- Keep feature pages in `src/pages/`, API handlers in `src/pages/api/`, and reusable UI in `src/components/`.
- Use the shared Axios wrappers in `src/utils/spec.ts` for browser-to-API calls; keep their request and response types in `src/utils/types.ts`.
- Authenticate every user-scoped API request with `getUserIdOrSetError`. Use `requireAdmin` for admin-only endpoints.
- Use the shared Prisma client from `fitness/lib/prisma`; do not instantiate another client in route handlers.
- Do not put Firebase or database credentials in source code or documentation.
- Never trust a client-supplied user ID as authority for user-owned data.
- Do not infer Firebase Console, Vercel, or hosted-database state. Inspect it through an authorized source or report it as unknown.
- Preserve unrelated user changes and do not perform destructive Git or database operations without explicit authorization.
- Add or update tests in proportion to risk and include stable requirement IDs in test names when verifying binding requirements.
- Stop and ask Keerthan K, the project owner, when binding documents materially conflict.
- Do not create decision records or Full SDD packages for routine implementation that follows established conventions.

## Common commands

```bash
pnpm run dev
pnpm run lint
pnpm run test
pnpm run typecheck
pnpm run build
pnpm run verify:assets
```

## Detailed guides

- [Specifications index](specs/README.md)
- [Documentation policy](specs/handbook/documentation-policy.md)
- [Engineering workflow](specs/handbook/engineering-workflow.md)
- [Traceability](specs/handbook/traceability-guide.md)
- [Review checklist](specs/handbook/review-checklist.md)
- [Project structure](.agents/project-structure.md)
- [Frontend conventions](.agents/frontend.md)
- [API conventions](.agents/api.md)
- [Authentication and authorization](.agents/auth.md)
- [Data model](.agents/data-model.md)
- [Verification](.agents/verification.md)
