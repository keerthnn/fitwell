# Fitwell Agent Guide

Fitwell is a Next.js **Pages Router** application for workout tracking. It uses React and MUI on the client, Firebase for authentication, and PostgreSQL through Prisma on the server.

## Quick rules

- Use the `fitness/*` import alias for modules under `src/` (for example, `fitness/lib/prisma`).
- Keep feature pages in `src/pages/`, API handlers in `src/pages/api/`, and reusable UI in `src/components/`.
- Use the shared Axios wrappers in `src/utils/spec.ts` for browser-to-API calls; keep their request and response types in `src/utils/types.ts`.
- Authenticate every user-scoped API request with `getUserIdOrSetError`. Use `requireAdmin` for admin-only endpoints.
- Use the shared Prisma client from `fitness/lib/prisma`; do not instantiate another client in route handlers.
- Do not put Firebase or database credentials in source code or documentation.

## Common commands

```bash
npm run dev
npm run lint
npm run build
```

## Detailed guides

- [Project structure](.agents/project-structure.md)
- [Frontend conventions](.agents/frontend.md)
- [API conventions](.agents/api.md)
- [Authentication and authorization](.agents/auth.md)
- [Data model](.agents/data-model.md)
- [Verification](.agents/verification.md)
