# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Phase 1: Foundation

## Current Goal

- Implement the next feature spec.

## Completed

- Feature 03: Authentication
  - Installed `@clerk/ui` for theme support.
  - Wrapped root layout (`app/layout.tsx`) with `ClerkProvider` using `dark` theme from `@clerk/ui/themes`. Appearance variables override with project CSS custom properties (no hardcoded colors).
  - Created `proxy.ts` at project root (Next.js 16 middleware convention). Uses `clerkMiddleware` + `createRouteMatcher` to protect all routes except `/sign-in` and `/sign-up` (resolved from `NEXT_PUBLIC_CLERK_SIGN_IN_URL` / `NEXT_PUBLIC_CLERK_SIGN_UP_URL` env vars).
  - Created `app/sign-in/[[...sign-in]]/page.tsx` — two-panel layout on large screens (left: logo + tagline + feature list, right: Clerk `<SignIn />`). Form only on small screens.
  - Created `app/sign-up/[[...sign-up]]/page.tsx` — same two-panel layout with Clerk `<SignUp />`.
  - Updated `app/page.tsx` — authenticated users redirect to `/editor`, unauthenticated redirect to `/sign-in`.
  - Created `app/editor/page.tsx` — minimal editor shell using existing `EditorNavbar` and `ProjectSidebar` components.
  - Added `UserButton` from `@clerk/nextjs` to the right section of `EditorNavbar`.
  - Added `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in` and `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up` to `.env.local`.

- Feature 02: Editor Chrome
  - Created `components/editor/editor-navbar.tsx` — fixed top bar, sidebar toggle with `PanelLeftOpen`/`PanelLeftClose`, `isSidebarOpen` + `onSidebarToggle` props.
  - Created `components/editor/project-sidebar.tsx` — fixed overlay sidebar, slides in from left, `isOpen` + `onClose` props, shadcn `Tabs` (My Projects / Shared), empty placeholder states, New Project button.
  - Dialog pattern confirmed ready — shadcn `Dialog` already installed; `globals.css` maps all shadcn semantic variables to project tokens.
  - TypeScript passes with no errors.

- Feature 01: Design System
  - Installed and configured shadcn/ui (v4.6.0) with Tailwind v4 via `components.json`.
  - Added components: Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea to `components/ui/`.
  - Installed `lucide-react`.
  - Created `lib/utils.ts` with `cn()` helper (clsx + tailwind-merge).
  - Configured `globals.css` with dark-only theme: project CSS variables + shadcn semantic variables + `@theme inline` Tailwind token mapping.
  - TypeScript passes with no errors.

## In Progress

- None.

## Next Up

- Feature 04 (TBD from feature-specs).

## Open Questions

- None currently.

## Architecture Decisions

- Dark-only theme: all CSS custom properties defined in `globals.css` via `@theme inline`. No light mode.
- shadcn/ui CSS variables (`--background`, `--foreground`, etc.) are mapped to match the project dark theme palette so generated components render correctly without modification.
- No `tailwind.config.js` — Tailwind v4 uses CSS-based configuration exclusively.
- Auth proxy uses Next.js 16 `proxy.ts` convention (renamed from `middleware.ts`). Named export `proxy` instead of `middleware`.
- Clerk appearance variables reference project CSS custom properties so they update automatically with theme changes.

## Session Notes

- `components/ui/*` files must not be modified — use app-level components for project-specific overrides.
- Tailwind v4 is in use. Theme tokens defined in `globals.css` under `@theme inline`.
- Path alias `@/*` maps to the project root.
- `proxy.ts` is the Next.js 16 equivalent of `middleware.ts`. Functionality is identical.
