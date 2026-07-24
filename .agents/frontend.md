# Frontend conventions

## Application shell

`src/pages/_app.tsx` preserves provider order and selects the public, authenticated, onboarding, or admin shell. Authenticated pages use the desktop sidebar and mobile bottom navigation.

The project uses the Next.js Pages Router. A file under `src/pages/` is a route; dynamic segments use bracket directories or files such as `workouts/[id]`.

## Components and styling

- Build screens as page components in `src/pages/` and extract reusable controls into `src/components/`.
- Use MUI components and the shared theme (`src/theme.ts`) first. Existing pages commonly use the `sx` prop for local layout and styling.
- Use the `fitness/*` TypeScript alias for imports from `src/`, such as `fitness/components/common/PageHeader` or `fitness/utils/spec`.
- Keep page-specific state and data loading in the page unless it is reused; then extract a component or helper with a focused responsibility.

## Calling APIs

Browser code calls routes through functions in `src/utils/spec.ts`, which use Axios with same-origin `/api/...` URLs. Add a typed wrapper there whenever a route is used from the UI, and add reusable request/response types to `src/utils/types.ts`.

The Firebase auth observer stores the signed-in user's ID token in a cookie, so same-origin Axios calls include authentication without manually setting an authorization header. Handle loading, empty, and request-failure states in user-facing pages.

## Page additions

1. Add the page at the route-derived path in `src/pages/`.
2. Use an existing API wrapper, or add a matching typed wrapper in `src/utils/spec.ts`.
3. Reuse shared components where appropriate.
4. Verify the route while authenticated and while signed out if it accesses user data.
