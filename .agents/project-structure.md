# Project structure

## Source layout

| Location | Purpose | Add code here when… |
| --- | --- | --- |
| `src/pages/` | Pages Router screens and route-based UI | Adding a user-visible route. Nested folders define URL segments. |
| `src/pages/api/` | Next.js API handlers | Adding a server endpoint. Group handlers by domain such as `workouts/`, `user/`, or `admin/`. |
| `src/components/` | Shared React and MUI components | UI is reused by more than one page or is a meaningful standalone widget. |
| `src/utils/spec.ts` | Client-side Axios API wrappers | A browser page needs to call an API route. |
| `src/utils/types.ts` | Shared browser-facing TypeScript types | A request, response, or UI model needs a reusable type. |
| `src/lib/` | Server/client integrations and cross-cutting helpers | Adding Prisma, Firebase, API-method, or authorization infrastructure. |
| `src/styles/` | Global and page-specific CSS | Styling does not belong in the MUI `sx` prop or theme. |
| `prisma/schema.prisma` | Database schema | Changing persistent models, relations, enums, or indexes. |
| `prisma/migrations/` | Prisma migration history | Recording a generated database migration. |

## Placement rules

- Keep route-specific page code beside its page: for example, workout detail belongs at `src/pages/workouts/[id]/index.tsx`.
- Create a new API file under the closest domain folder. Its URL mirrors the file path: `src/pages/api/workouts/create-workout.ts` serves `/api/workouts/create-workout`.
- Keep request orchestration in pages/components and database access in API handlers. Browser code must not import Prisma or Firebase Admin.
- Prefer existing feature names and patterns over creating a parallel folder naming scheme.
