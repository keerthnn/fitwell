---
id: architecture-frontend
title: Frontend Architecture
status: active
authority: engineering
requirements: [A11Y-001, A11Y-002, A11Y-003, A11Y-004]
decisions: []
code: [src/pages/_app.tsx, src/pages/_document.tsx, src/pages/, src/components/, src/theme.ts, src/utils/spec.ts, src/utils/types.ts]
tests: [test cases/components/common/PageHeader.test.tsx]
last_verified: 2026-08-23
---

# Frontend architecture

## Routing and shells

FitWell uses the Next.js Pages Router. `_app.tsx` selects shells from the route pathname: landing and authentication pages use `PublicShell`; onboarding is standalone; administrator pages provide their guarded `AdminLayout`; other routes render inside `AppShell`. `_document.tsx` declares English document language.

## Provider composition

1. `ThemeModeProvider` supplies MUI theme and CSS reset.
2. `AuthContextProvider` observes Firebase token state, maintains the cookie, synchronizes the local user, and redirects authenticated public visitors.
3. `RestTimerProvider` scopes timer persistence to the resolved Firebase UID.

## Navigation

The member shell uses a collapsible desktop sidebar, mobile bottom navigation, and mobile more drawer. The administrator layout uses a collapsible permanent desktop drawer and mobile app-bar drawer. Public pages use a simple header.

Nested member and administrator pages use the shared `PageHeader` icon-only back link to expose an accessible, deterministic route to their parent list or detail page. Top-level tabs rely on shell navigation and do not add a redundant back link.

## State ownership

- Authentication and theme are React contexts.
- Rest-timer state is context plus local storage.
- Pages generally own server loading/error/data and mutation state.
- Form components own input state and call typed wrapper functions.
- There is no Redux, TanStack Query, or server-state cache layer.

## Data access

Browser calls use Axios wrappers in `src/utils/spec.ts` with same-origin `/api/...` URLs. Shared request/response interfaces live in `src/utils/types.ts`. Authentication is sent implicitly by the same-origin cookie.

## Design system

MUI 7 and Emotion provide components/styling. `src/theme.ts` defines light/dark palettes, semantic colors, responsive shell dimensions, content width, radii, image ratios, typography, focus styles, and component overrides. Tabler icons are re-exported from the common icon module.

## User-visible states

Shared loading, error, empty, confirmation, filter, status, header, image-fallback, and stat-card components are reused across pages. Mutations show pending labels or disabled actions. Exposed destructive actions use confirmation dialogs.

## Responsive behavior

MUI breakpoints switch navigation and layout. Member content reserves mobile-navigation and rest-timer space. Administrator content offsets the mobile app bar and expands around a collapsible desktop drawer.

## Verification gap

The configured test directory is empty. Responsive, keyboard, focus, screen-reader, and authenticated browser flows require manual review.
