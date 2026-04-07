# Skill Forge

Next.js App Router project for a learning platform with a static marketing site, a learner dashboard mock, shared UI primitives, and route-group-based structure.

## Run

```bash
npm.cmd run dev
```

## Folder Conventions

### `app/`

App Router entrypoint. Keep route files close to the URLs they serve.

- `app/layout.tsx`
  Root layout only. Global fonts, metadata, and global CSS belong here.
- `app/globals.css`
  Global design tokens and low-level base styles.
- `app/(marketing)/`
  Public marketing pages. These routes should stay mostly content-focused.
- `app/(auth)/`
  Authentication pages such as sign-in, sign-up, reset-password.
- `app/(app)/`
  Authenticated product area for learners. Use this for user-facing in-app screens.
- `app/(admin)/`
  Admin and operational surfaces. Keep this separate from the learner product area.

### `components/`

Reusable React components.

- `components/ui/`
  Small reusable UI primitives. These are the building blocks.
  Examples: `button.tsx`, `card.tsx`.
- `components/layouts/`
  Structural wrappers that compose pages.
  Example: `authenticated-shell.tsx`.

### `lib/`

Shared non-visual code.

- `lib/utils.ts`
  Generic helpers used across the app.
- `lib/mock-data.ts`
  Static sample data for mocks and prototypes.

## Naming Decisions

### Route groups

Use route groups to separate concerns without affecting the URL.

- `(marketing)` for public pages
- `(auth)` for identity flows
- `(app)` for authenticated learner screens
- `(admin)` for admin-only workflows

If a page belongs to a URL area and a product context, choose the route group based on the product context first.

### Components

- Use `PascalCase` for React component names.
- Use `kebab-case` for filenames.
- Keep primitive names generic and reusable:
  `button.tsx`, `card.tsx`, `authenticated-shell.tsx`
- Avoid feature-specific names in `components/ui/`.
  If a component is tied to one screen or domain, keep it near that feature instead of forcing it into `ui/`.

### Pages and layouts

- Use Next.js conventions directly:
  `page.tsx`, `layout.tsx`
- Keep route files thin when possible. Move repeated structure into `components/layouts/` and repeated data into `lib/`.

### Tokens and styling

- Global tokens live in `app/globals.css`.
- Tailwind theme mappings live in `tailwind.config.ts`.
- Prefer semantic token names over hard-coded values:
  `bg-surface`, `text-text-soft`, `border-border`, `text-brand`
- Avoid one-off arbitrary values unless there is a strong reason.

## Practical Rules

- Put shared UI building blocks in `components/ui/`.
- Put page shells and structural wrappers in `components/layouts/`.
- Put sample data, helpers, and pure utilities in `lib/`.
- Keep marketing copy and dashboard mock content static unless there is a real need for fetching.
- Reuse the authenticated shell for learner-facing app pages instead of rebuilding headers and sidebars per route.
- When adding a new area, prefer extending an existing route group before creating a new top-level concept.

## Current Structure

```text
app/
  (admin)/
    admin/page.tsx
    layout.tsx
  (app)/
    dashboard/page.tsx
    layout.tsx
  (auth)/
    sign-in/page.tsx
    layout.tsx
  (marketing)/
    page.tsx
  globals.css
  layout.tsx
components/
  layouts/
    authenticated-shell.tsx
  ui/
    button.tsx
    card.tsx
lib/
  mock-data.ts
  utils.ts
```

## Consistency Checklist

Before adding a file, ask:

- Is this route public, auth, app, or admin?
- Is this a primitive, a layout wrapper, or feature-specific UI?
- Should this live as mock/sample data in `lib/` instead of inline in a page?
- Can this use existing tokens and primitives instead of introducing a one-off style?
