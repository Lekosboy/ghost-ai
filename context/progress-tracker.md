# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Phase 1: Foundation

## Current Goal

- Implement the next feature spec.

## Completed

- Feature 09: Share Dialog
  - Created `lib/clerk-users.ts` — `getClerkUsersByEmail()` and `getClerkUserById()` look up Clerk users via `clerkClient()` and return `{ email, name, imageUrl }`. Display name falls back: `firstName lastName` → `username` → `null`.
  - Created `app/api/projects/[projectId]/collaborators/route.ts` — `GET` returns `{ isOwner, owner, collaborators[] }` for any project member (owner or collaborator), owner enriched via `getClerkUserById(ownerId)`; `POST` invites by email (owner-only; validates email format; returns `409` on duplicate via Prisma `P2002`); `DELETE` removes by `?email=` query param (owner-only). All people are enriched with Clerk `name`/`imageUrl` and fall back to the email when no Clerk user is found.
  - Created `components/editor/dialogs/share-dialog.tsx` — card-per-row layout matching the design mock. Title: "Share project". Owner view: workspace-link card with `Copy link` button (flips to `Copied!` for 1.5s), invite input card with mail icon + Invite button, and "People with access" list (owner row with `OWNER` badge first, then collaborators with `COLLABORATOR` badge and trash icon). Collaborator view: list-only with badges (no workspace-link card, no invite card, no remove buttons). Avatars use `next/image` with `unoptimized` for Clerk URLs; fallback is a purple gradient circle with a user icon.
  - Updated `components/editor/workspace-client.tsx` — added `isShareOpen` state; wired `onShareClick` to open the share dialog; rendered `ShareDialog` with the current project's `id`.
  - `npm run build` passes with zero TypeScript errors.

- Feature 04: Project Dialogs
  - Created `hooks/use-project-dialogs.ts` — single hook managing dialog state, form state, and loading state for all three dialogs. Includes mock project data and in-memory CRUD.
  - Created `components/editor/dialogs/create-project-dialog.tsx` — project name input with live slug preview (updates on every keystroke).
  - Created `components/editor/dialogs/rename-project-dialog.tsx` — prefilled input, current name shown in description, auto-focus, Enter submits.
  - Created `components/editor/dialogs/delete-project-dialog.tsx` — destructive confirmation only, no input, confirm button uses `variant="destructive"`.
  - Updated `components/editor/project-sidebar.tsx` — project items with rename/delete icon actions (owned projects only, visible on hover); shared tab items have no actions; mobile backdrop scrim with `onClose` on click.
  - Updated `app/editor/page.tsx` — editor home screen (heading, description, New Project button); all three dialogs rendered at page level; all wire-ups connected.
  - TypeScript: zero errors.

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

- Feature 06: Project APIs
  - Created `app/api/projects/route.ts` — `GET` lists the authenticated user's projects (ordered by `createdAt` desc); `POST` creates a project (name defaults to `"Untitled Project"` if absent or blank).
  - Created `app/api/projects/[projectId]/route.ts` — `PATCH` renames a project (owner-only); `DELETE` deletes a project (owner-only). Both return `401` for unauthenticated requests and `403` for non-owner mutations.
  - Fixed `lib/prisma.ts`: added explicit `PrismaClient` return type annotation with `as unknown as PrismaClient` cast on the Accelerate branch so TypeScript can resolve method overloads when the client is used in route handlers.
  - `npm run build` passes with zero TypeScript errors.

- Feature 05: Prisma Data Models
  - Created `prisma/models/project.prisma` with `Project` and `ProjectCollaborator` models, `ProjectStatus` enum (DRAFT/ARCHIVED), and all required indexes.
  - Created `lib/prisma.ts` as a cached singleton: branches on `DATABASE_URL` — `prisma+postgres://` uses Accelerate via `withAccelerate()`, otherwise uses `@prisma/adapter-pg` directly. Cached on `globalThis` in development for hot-reload safety.
  - Installed `@prisma/extension-accelerate` for the Accelerate branch.
  - Ran migration `20260524004121_init` — schema applied to the database.
  - Ran `prisma generate` — client generated to `app/generated/prisma`.
  - `npm run build` passes with zero TypeScript errors.

- Feature 08: Editor Workspace Shell
  - Created `lib/project-access.ts` — `getCurrentIdentity()` returns `{ userId, email }` from Clerk; `getProjectWithAccess()` checks owner or collaborator membership and returns the project or null.
  - Created `components/editor/access-denied.tsx` — centered layout with lock icon, message, and link back to `/editor`.
  - Updated `components/editor/editor-navbar.tsx` — added optional `projectName`, `onShareClick`, `isAISidebarOpen`, `onAISidebarToggle` props; workspace-specific controls render only when provided; existing home usage unchanged.
  - Updated `components/editor/project-sidebar.tsx` — added optional `activeProjectId` prop; matching project items highlighted with `bg-brand-dim` background and `text-brand` icon/text.
  - Created `components/editor/workspace-client.tsx` — client wrapper managing left sidebar state and AI sidebar state; renders navbar with project name + share + AI toggle, existing `ProjectSidebar` with active highlight, canvas placeholder, and fixed right AI sidebar placeholder.
  - Created `app/editor/[roomId]/page.tsx` — async server component; unauthenticated users redirect to `/sign-in`; non-existent or unauthorized projects render `AccessDenied`; authorized users get the full workspace layout via `WorkspaceClient`.
  - `npm run build` passes with zero TypeScript errors.

- Feature 07: Wire Editor Home
  - Created `lib/project-data.ts` — server-side data helper; fetches owned projects by `ownerId` and shared projects via `ProjectCollaborator` email lookup; returns `{ ownedProjects, sharedProjects }`.
  - Created `hooks/use-project-actions.ts` — replaces the mock `use-project-dialogs.ts`; manages dialog state and calls real API endpoints. Create: generates `roomId = slug-suffix`, POSTs to `/api/projects` with the id, then navigates to `/editor/[roomId]`. Rename: PATCHes and calls `router.refresh()`. Delete: DELETEs and either redirects to `/editor` (if currently on that workspace) or refreshes.
  - Updated `app/api/projects/route.ts` — POST now accepts an optional client-supplied `id` (validated against `/^[a-z0-9-]{1,100}$/`) so the project ID stays aligned with the Liveblocks room ID.
  - Updated `components/editor/dialogs/create-project-dialog.tsx` — `slug` prop renamed to `roomId`; dialog preview now shows "Room ID:" label with the full `slug-suffix` value.
  - Updated `components/editor/project-sidebar.tsx` — props changed from a single `projects` array to separate `ownedProjects` and `sharedProjects`; `ProjectItem` type imported from `use-project-actions`.
  - Created `components/editor/editor-home-client.tsx` — extracted client wrapper containing sidebar toggle state, `useProjectActions` hook, and all dialog renders; accepts `ownedProjects`/`sharedProjects` as props.
  - Updated `app/editor/page.tsx` — converted from `"use client"` to an async server component; fetches both project lists server-side via `getProjectsForUser()` and passes them to `EditorHomeClient`.
  - `npm run build` passes with zero TypeScript errors.

## In Progress

- None.

## Next Up

- Feature 10 (TBD from feature-specs).

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
