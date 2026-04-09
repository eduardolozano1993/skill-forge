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
- `components/dashboard/`
  Dashboard-specific building blocks. Keep list wrappers, item shells, and section primitives here instead of rebuilding section markup in the route.
- `components/profile/`
  Profile-specific UI, schema, and local feature helpers. Keep the page entry component thin and move feature-only form pieces here.

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
- Co-locate feature-only helpers with the feature:
  small files like `profile-settings.schema.ts`, `profile-settings.types.ts`, or selector helpers should stay in the feature folder when they are not reused broadly.
- Move types to a separate file only when they are shared across multiple files in the same feature or they materially improve readability in the entry component.

### Pages and layouts

- Use Next.js conventions directly:
  `page.tsx`, `layout.tsx`
- Keep route files thin when possible. Move repeated structure into `components/layouts/` and repeated data into `lib/`.
- Keep feature entry components thin when possible. Extract repeated presentational sections, form fields, and derived-data helpers before the file turns into a mixed concerns component.

### Tokens and styling

- Global tokens live in `app/globals.css`.
- Tailwind theme mappings live in `tailwind.config.ts`.
- Prefer semantic token names over hard-coded values:
  `bg-surface`, `text-text-soft`, `border-border`, `text-brand`
- Avoid one-off arbitrary values unless there is a strong reason.

## UI Patterns

These patterns are now established in the dashboard and are worth preserving as the app grows.

### Separate route code from feature UI

- Keep route files thin.
- Let `app/(app)/dashboard/page.tsx` orchestrate data loading.
- Keep display logic in `components/dashboard/`.
- Keep mock datasets close to the route when they are temporary and likely to be deleted once the real backend is connected.

### Prefer composable section APIs over boolean-heavy components

- Use section primitives that accept content as children or slots instead of adding flags for every layout variation.
- `components/dashboard/dashboard-section.tsx` is the reference pattern:
  `DashboardSection`, `DashboardSectionHeader`, `DashboardSectionBody`, `DashboardSectionEmptyState`, `DashboardSectionErrorState`.
- This keeps headers, actions, bodies, empty states, and error states swappable without creating one oversized component API.

### Model loading, empty, error, and data as first-class UI states

- Every repeatable dashboard block should have an intentional state model:
  loading, success, empty, and error when the feature needs partial failure handling.
- Use route-level loading for server data:
  `app/(app)/dashboard/loading.tsx`.
- Use section-level fallback UIs when one widget can fail without taking down the whole screen.
- Do not rely on one global error path if the page is composed of independent widgets.

### Use stable keys from data, not array positions

- Real list items must use durable IDs from the data model.
- `components/dashboard/course-list.tsx` and `components/dashboard/activity-list.tsx` use `course.id` and `item.id`.
- Index keys are acceptable only for placeholder skeletons that have no long-term identity.

### Reuse layout shells for repeated card structure

- Shared item spacing and card framing belong in wrappers, not duplicated across each component.
- `components/dashboard/dashboard-item-shell.tsx` centralizes repeated card shell, header, and body layout.
- `components/dashboard/dashboard-list-layout.tsx` centralizes repeated list container layouts like the course grid and activity stack.

### Match skeletons to final structure

- Skeleton UIs should resemble the real component shape, not generic gray rectangles.
- `CourseCardSkeleton` and `NotificationItemSkeleton` mirror the final card layout so loading states preserve rhythm and reduce layout shift.

### Keep mock data isolated and disposable

- Dashboard mock content should live in `app/(app)/dashboard/mock-data.ts`, not inline in the route.
- This makes it easy to delete the file when the real database replaces it.
- Temporary UI-only mocks should not leak into shared libraries unless they are genuinely reused outside the feature.

### Split data sources when sections can fail independently

- If one dashboard section can fail without invalidating the whole page, fetch it independently.
- `app/(app)/dashboard/page.tsx` uses separate async loaders and `Promise.allSettled(...)` so one widget can degrade without breaking unrelated sections.

## Practical Rules

- Put shared UI building blocks in `components/ui/`.
- Put page shells and structural wrappers in `components/layouts/`.
- Put feature-specific composition primitives near the feature, for example in `components/dashboard/`.
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
  dashboard/
    activity-list.tsx
    course-card.tsx
    course-list.tsx
    dashboard-bookmark-dialog.tsx
    dashboard-course-section.tsx
    dashboard-item-shell.tsx
    dashboard-list-layout.tsx
    dashboard-preview.tsx
    dashboard-preview-selectors.ts
    dashboard-section.tsx
    notification-item.tsx
  layouts/
    authenticated-shell.tsx
  profile/
    profile-edit-card.tsx
    profile-field.tsx
    profile-settings-page.tsx
    profile-settings.schema.ts
    profile-settings.types.ts
    profile-summary-card.tsx
    theme-preferences-section.tsx
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
