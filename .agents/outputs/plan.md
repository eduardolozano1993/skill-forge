# Role-Based Dashboard Refactor Plan

## Summary

Refactor the current learner-only dashboard into three role-specific surfaces:

- Employee keeps the current course dashboard behavior.
- Manager gets an organization dashboard with org metrics, assigned courses, and employee bookmark visibility.
- Admin gets a platform dashboard with summary cards, searchable tables, and sign-in log visibility.

Default implementation choice:

- Keep `/dashboard` as the employee route.
- Add `/manager` for manager dashboard.
- Keep `/admin` as the admin dashboard.
- Redirect authenticated users to the correct route by `userType`.

Planned output file when implementation mode is enabled:

- `.agents/outputs/role-dashboard-refactor-plan.md`

## Important Interface and Auth Changes

- Tighten auth helpers:
  - `requireAdmin()` becomes admin-only.
  - Add `requireManager()` or `requireManagerOrAdmin()` for manager-access surfaces where needed.
  - Add a shared post-login role redirect helper so users do not land on the wrong dashboard.
- Add new server-side query helpers for:
  - Employee dashboard data.
  - Manager org summary data.
  - Admin platform summary data.
  - Admin searchable table datasets.
  - Admin sign-in log tail reader.
- Reuse shared dashboard/table primitives where possible instead of creating one-off page markup.

## Implementation Stories

### Story 1: Route and authorization foundation

**Goal**  
As a user, I want to be redirected to the dashboard that matches my role so I only see the product surface intended for me.

**Description**  
Split dashboard entry points by role, update auth guards, and make route/layout ownership explicit before changing dashboard content.

**Acceptance Criteria**

- Employees land on `/dashboard`.
- Managers land on `/manager`.
- Admins land on `/admin`.
- Employees cannot access manager or admin dashboards.
- Managers cannot access admin-only tables or admin summary data unless explicitly allowed elsewhere.
- Admin auth is enforced both in route access and in server-side data actions.
- Existing learner app layout is no longer reused blindly for manager/admin surfaces if the copy or navigation is role-specific.

### Story 2: Preserve the employee dashboard as the employee experience

**Goal**  
As an employee, I want my current dashboard experience to remain available after the refactor so I can still discover, bookmark, and complete courses.

**Description**  
Keep the current dashboard behavior as the employee surface with minimal visual or behavioral regression.

**Acceptance Criteria**

- The current assigned, bookmarked, and completed course sections still render for employees.
- Existing course search/filter behavior still works for employees.
- Employees can still bookmark courses.
- Employees can still mark courses as completed.
- No manager/admin-only metrics or tables appear on the employee dashboard.
- Existing course detail navigation from employee cards still works.

### Story 3: Build manager dashboard data aggregation

**Goal**  
As a manager, I want dashboard data scoped to my organization so I can monitor team learning progress.

**Description**  
Create server-side queries that load organization details and aggregate metrics from the current schema.

**Acceptance Criteria**

- Manager dashboard resolves the signed-in manager’s organization from `organizationId`.
- The dashboard loads org details needed for the header/summary.
- Summary metrics include:
  - total employees in the org
  - total courses assigned to the org
  - total completed courses by org employees
- Assigned courses list is derived from `organization_courses`.
- Bookmarked-by-employee dataset includes employee identity and bookmarked course identity, scoped to the manager’s organization.
- All manager queries exclude users outside the manager’s organization.
- Empty states are defined for org with no employees, no assigned courses, and no bookmarks.

### Story 4: Build the manager dashboard UI

**Goal**  
As a manager, I want a dashboard focused on my organization so I can review org details and course activity in one place.

**Description**  
Create a manager page using shared card/section/table patterns, but with manager-specific content and navigation.

**Acceptance Criteria**

- The page has an org details section.
- The first visible summary row includes cards for:
  - total employees
  - total assigned courses
  - total completed courses
- The page includes an assigned courses list/table.
- The page includes a bookmarked-courses-by-employee table.
- The page handles loading, empty, and error states without breaking the full page.
- Manager labels, headings, and navigation no longer say “Learner dashboard”.

### Story 5: Build admin dashboard data and platform summaries

**Goal**  
As an admin, I want platform-wide summary metrics so I can understand the overall state of the system.

**Description**  
Create admin-only data loaders for top-level counts and datasets needed by the dashboard tables.

**Acceptance Criteria**

- Summary cards include:
  - total users
  - total courses
  - total orgs
  - total completed courses
- Counts are platform-wide, not scoped to a single organization.
- Users table data includes key user fields plus role and organization reference where available.
- Orgs table data includes org identity plus owner/manager reference and member/course counts if available.
- Courses table data includes course identity and assignment/completion counts if available.
- Search input is supported independently for users, orgs, and courses.
- Search behavior is server-backed or server-filtered and returns stable empty states.

### Story 6: Build the admin dashboard UI with searchable tables and logs

**Goal**  
As an admin, I want an operations-style dashboard so I can inspect users, orgs, courses, and sign-in activity from one screen.

**Description**  
Replace the admin placeholder with a dashboard page containing summary cards, searchable tables, and a log panel.

**Acceptance Criteria**

- The admin placeholder page is replaced by a real dashboard.
- The top row contains the four platform summary cards.
- The page contains distinct sections for:
  - users table with search bar
  - orgs table with search bar
  - courses table with search bar
- Each table supports empty-state messaging for no results.
- A logs section displays the last 500 lines from `logs/sign_in/lockouts.log`.
- If the log file is missing, the page shows a non-fatal empty state instead of crashing.
- Log access is admin-only.

### Story 7: Validation, test coverage, and seed-data alignment

**Goal**  
As a developer, I want testable and seeded role-specific dashboards so the refactor can be verified quickly.

**Description**  
Add focused validation around role routing, query scoping, and new dashboard states, and ensure seed data exercises all three personas.

**Acceptance Criteria**

- Seeded users for admin, manager, and employee still work after the route/auth changes.
- Manager seed data produces at least one org with employees and assigned courses.
- Admin summary counts match the seeded database content.
- Tests cover role redirects for employee, manager, and admin.
- Tests cover manager org scoping so cross-org leakage is prevented.
- Tests cover admin-only protection for dashboard data and log access.
- Tests cover missing/empty log file behavior.

## Test Plan

- Role-routing test: each seeded role is redirected to the correct dashboard.
- Authorization test: employee denied from `/manager` and `/admin`; manager denied from admin-only dashboard actions.
- Employee regression test: bookmark and complete flows still update dashboard collections.
- Manager data test: org metrics, assigned courses, and bookmarks only include the manager’s organization.
- Admin data test: top-level counts match Prisma data.
- Admin search test: users/orgs/courses searches filter results independently.
- Log reader test: returns at most 500 lines and degrades safely when file does not exist.

## Assumptions and Defaults

- Use separate dashboard routes instead of one polymorphic `/dashboard`.
- `/dashboard` remains the employee route for backward compatibility with the current app.
- The admin log source is `logs/sign_in/lockouts.log`, since that is the current concrete file in the repo.
- Manager dashboard is organization-scoped strictly by `session.user.organizationId`.
- “Total completed courses” means count of rows in `completed_courses`, not distinct completed course titles.
- Search can be simple text search for v1; pagination and sorting are not required unless added later.
- Because this thread is still in Plan Mode, this plan is not being written into `.agents/outputs` yet; the content above is the Markdown to save there during implementation mode.
