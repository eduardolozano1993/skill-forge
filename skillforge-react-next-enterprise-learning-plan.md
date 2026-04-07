# SkillForge: React + Next.js Enterprise Learning Roadmap

SkillForge is the project you will build to learn React and Next.js the way large product teams actually use them: not through isolated mini-exercises, but through one coherent application with real product constraints. The app is an internal learning platform for companies. Employees take courses, managers track team progress, and admins create and publish learning content. That product shape forces you to practice the patterns recruiters expect to see in modern frontend and full-stack web work.

This roadmap is intentionally opinionated. It assumes a greenfield Next.js App Router project, TypeScript from day one, and a product mindset instead of a tutorial mindset. You will build the project in phases. Each phase teaches specific concepts, adds visible product value, and ends with verification scenarios you can demo or test. Do not rush to advanced topics before you can explain why a simpler approach stopped working.

Use your React topics as the foundation: hooks in depth, rendering behavior, state management, component design, performance, effects, forms, data fetching, routing, server rendering, architecture, and error handling. Use your Next.js topics as the second half of the path: rendering model, App Router architecture, server vs client components, data fetching, caching and revalidation, server actions, routing, route handlers, middleware, performance, SEO, authentication, and observability. The difference is that this roadmap sequences them into one project that gets progressively closer to production-grade work.

If you follow this plan well, you will finish with a portfolio project that does three jobs at once. It teaches the core mental models of React. It teaches the full-stack and rendering model of Next.js. It gives you a credible story to tell in interviews about tradeoffs, architecture, testing, performance, and product thinking.

## Project Vision

### Why This Project Impresses Recruiters

Most junior portfolio projects prove that you can render data. Very few prove that you can think like a product engineer. SkillForge is strong because it combines several surfaces inside one codebase:

- A public marketing experience with SEO and polished presentation.
- An authenticated application with role-based navigation and workflows.
- A learner dashboard with stateful UI, forms, quizzes, and progress tracking.
- A manager dashboard with aggregated views and read-heavy server-rendered pages.
- An admin console with content management, mutations, validation, auditing, and protected actions.

Recruiters and hiring managers like projects that create obvious discussion material. SkillForge gives you that material:

- You can explain when a component should stay client-side and when it should become a server component.
- You can explain why server actions are a good fit for UI-owned mutations and when a route handler is the better boundary.
- You can show role-based access control enforced at both the UI and server layers.
- You can talk about caching, revalidation, optimistic updates, loading states, error recovery, and test strategy.
- You can demonstrate maturity by showing logs, audit trails, accessibility, and deployment discipline.

In short, this is not a toy CRUD app. It is a believable internal SaaS product. Big companies build and maintain systems like this constantly.

## Final Product Scope

SkillForge is an internal B2B learning platform used by a company to assign courses, track progress, and manage internal knowledge. The product has three primary personas.

**Learner**

- Sees a personal dashboard with assigned learning paths, in-progress courses, recommended courses, bookmarks, notifications, and progress snapshots.
- Opens course detail pages and lesson pages, completes quizzes, reviews quiz attempts, and tracks completion over time.
- Updates profile settings and learning preferences.

**Manager**

- Sees a team dashboard with team completion metrics, overdue assignments, reminder queues, and at-risk learners.
- Assigns learning paths to direct reports and manages reminder workflows for incomplete work.
- Reviews team progress without receiving admin publishing permissions.

**Admin**

- Creates, edits, previews, drafts, publishes, unpublishes, and archives courses.
- Manages modules, lessons, quizzes, tags, and difficulty levels.
- Manages roles and permission changes for internal users.
- Reviews platform analytics, audit logs, and content health.

By the end of the roadmap, the final portfolio demo should include these product areas:

- Public landing page and marketing content.
- Auth flow and protected application shell.
- Learner dashboard.
- Manager dashboard.
- Admin content management console.
- Search and filtered tables.
- Notifications, assignment reminders, and role-aware workflows.
- Metadata and SEO for the public marketing surface.
- Loading, empty, success, and error states for major screens.
- Analytics summary views.
- Audit log and observability-friendly behaviors.

The best demo narrative is simple: "I built an enterprise learning platform with a public surface, a protected app, role-aware workflows, server-rendered read paths, server-owned mutations, and production concerns like validation, caching, testing, accessibility, and deployment."

## Recommended Stack and Why

Use this stack unless you have a strong reason to change it.

| Layer | Recommended choice | Why this choice fits the roadmap |
| --- | --- | --- |
| Framework | Next.js App Router | Teaches modern React plus routing, rendering, server boundaries, and data strategies in one system. |
| UI runtime | React 19 | Gives you the current React mental model, modern hooks, transitions, and server/client boundaries. |
| Language | TypeScript | Big teams expect typed contracts, safer refactors, and maintainable component and API design. |
| Styling | Tailwind CSS + `shadcn/ui` | Fast path to a polished enterprise UI without wasting months building a custom component system. |
| Database | PostgreSQL | Common, reliable, and a good fit for relational product data like users, courses, enrollments, and quizzes. |
| ORM | Prisma | Pragmatic schema management and readable data access for full-stack learning. |
| Auth | Auth.js | Good way to learn sessions, protected routes, provider strategies, and role-aware application flows. |
| Validation | Zod | Shared runtime validation for forms, server actions, and route handlers. |
| Forms | React Hook Form | Widely used, efficient, and teaches practical form state management. |
| Testing | Vitest, Testing Library, Playwright | Covers unit, component, integration, and end-to-end risk in a modern frontend stack. |
| Monitoring | Sentry-style observability | Forces you to think about logs, traces, and useful failure visibility. |
| Deployment | Vercel | Natural fit for Next.js and easy way to learn environment management and release workflows. |

A few important stack opinions:

- Do not add a global state library at the beginning. Learn local state, lifted state, reducers, and context boundaries first.
- Do not add React Query or another client cache by default. In an App Router app, server data fetching and revalidation already solve many problems. Add a client cache only if you can explain the specific pain it solves.
- Use server actions for form-driven mutations owned by the web app.
- Use route handlers for integration points, search, analytics aggregation APIs, or webhook ingestion.
- Treat the Pages Router as historical knowledge only. Know what it is, but build this project with the App Router.

### State Guidance

- Start with local UI state managed through React hooks and reducers before reaching for wider shared state.
- Treat server state as a Next.js concern first by fetching on the server and mutating through server actions or route handlers.
- Add a client caching library only when you can point to a concrete stale-data, retry, or background-refresh problem that App Router patterns do not solve cleanly.

## Learning Rules

- Build incrementally. Every phase should add visible product value, not just theory.
- Prefer App Router patterns over legacy Pages Router patterns. The Pages Router is only a comparison point.
- Introduce abstractions only after the pain is visible in the code or UI.
- Close every phase with three things: a short feature demo, the phase verification scenarios as your test checklist, and the recruiter-facing talking points as "what a recruiter should notice."

## Assumptions and Defaults

- This roadmap assumes a new greenfield Next.js project, not a retrofit of an existing Vite application.
- Your original React and Next.js topic list is the backbone, but enterprise concerns like auth, validation, testing, observability, CI/CD, and deployment are intentionally layered in.
- The roadmap optimizes for modern large-company App Router patterns, with the Pages Router covered only as brief historical context.
- The curriculum is intentionally deep and long-form. It is designed for mastery, tradeoff awareness, and recruiter-ready explanations rather than the shortest possible demo.
- Each phase should feel mentor-designed, practical, opinionated, and explicit about anti-patterns or tradeoffs.

## Core Interfaces and App Boundaries

Your architecture should feel boring in the best way: consistent, understandable, and easy to extend.

### Core route groups

Use these route groups from the start:

- `(marketing)` for public pages such as the landing page, pricing-style messaging, and feature sections.
- `(auth)` for sign-in, sign-up, invite acceptance, and onboarding steps.
- `(app)` for learner and manager application surfaces.
- `(admin)` for content management and governance workflows.

### Suggested folder shape

```text
src/
  app/
    (marketing)/
    (auth)/
    (app)/
      dashboard/
      courses/
      assignments/
      team/
    (admin)/
      courses/
      analytics/
      audit-log/
    api/
      search/
      analytics/
      webhooks/
    error.tsx
    not-found.tsx
    layout.tsx
  components/
    ui/
    shared/
  features/
    dashboard/
    courses/
    quizzes/
    admin-courses/
    analytics/
  lib/
    auth/
    db/
    validation/
    permissions/
    logging/
```

### Rendering policy

Adopt these rules early:

- Default to server components for read-heavy views.
- Add client components only when the UI needs interactivity, browser APIs, local state, or client-only libraries.
- Stream secondary content when it improves perceived performance.
- Use Suspense boundaries intentionally, not everywhere.

### Mutation policy

- Use server actions for mutations triggered by forms and buttons inside your app.
- Use route handlers for public HTTP endpoints, search, analytics aggregation APIs, or webhook ingestion.
- Validate inputs on the server even if the client already validated them.
- Revalidate the right data after a mutation instead of forcing a full refresh.

### Key mutations and server actions

- `enrollInCourse` enrolls a learner in a course or accepts a manager assignment.
- `markLessonComplete` records learner progress and revalidates dashboard summaries.
- `submitQuiz` validates answers, stores a `QuizAttempt`, and updates progress.
- `assignLearningPath` lets managers assign work and trigger reminder notifications.
- `saveCourseDraft`, `publishCourse`, and `unpublishCourse` support admin create/edit/publish workflows.

### Key route handlers and APIs

- `/api/search` handles course, lesson, and admin-table search queries.
- `/api/analytics/summary` returns aggregated metrics for manager and admin dashboards.
- `/api/webhooks/learning-events` or a similar ingestion endpoint demonstrates webhook or event-driven updates from external systems.

### Authorization policy

- Enforce learner, manager, and admin permissions at both UI boundaries and server boundaries.
- Hide unauthorized UI to reduce confusion.
- Still enforce authorization on the server, inside actions, loaders, and route handlers.
- Use middleware for broad route protection, not as your only security layer.

### Data access policy

- Keep raw ORM usage out of leaf UI components.
- Create reusable query and mutation helpers once duplication becomes obvious.
- Model data around product concepts, not page shapes.

### Historical note

The Pages Router matters only as background knowledge. You should understand why the App Router exists, but this project should not split time between both architectures.

### Core Entities

Lock the product around these entities so the project stays coherent across all phases.

| Entity | Purpose | Typical fields |
| --- | --- | --- |
| `User` | A person using the platform | `id`, `name`, `email`, `roleId`, `organizationId`, `avatarUrl`, `status` |
| `Role` | Defines permission scope | `id`, `name`, `permissions` |
| `Organization` | Tenant-like company container | `id`, `name`, `slug`, `planType` |
| `Course` | Top-level learning unit | `id`, `title`, `slug`, `description`, `status`, `authorId`, `publishedAt` |
| `Module` | Logical grouping inside a course | `id`, `courseId`, `title`, `order` |
| `Lesson` | Individual learning content | `id`, `moduleId`, `title`, `content`, `lessonType`, `order` |
| `Quiz` | Assessment attached to a lesson or module | `id`, `lessonId`, `passingScore`, `timeLimitMinutes` |
| `Question` | Quiz prompt and answer set | `id`, `quizId`, `type`, `prompt`, `choices`, `correctAnswer` |
| `QuizAttempt` | Submission record for a learner | `id`, `quizId`, `userId`, `score`, `startedAt`, `submittedAt` |
| `Enrollment` | Course assignment or enrollment record | `id`, `courseId`, `userId`, `assignedById`, `status`, `dueDate` |
| `ProgressRecord` | Fine-grained completion tracking | `id`, `userId`, `lessonId`, `completedAt`, `percentComplete` |
| `Notification` | In-app communication | `id`, `userId`, `type`, `title`, `readAt`, `payload` |
| `AuditLog` | Governance and change history | `id`, `actorId`, `entityType`, `entityId`, `action`, `metadata`, `createdAt` |

Keep a few product relationships in mind:

- A `Course` has many `Module` records.
- A `Module` has many `Lesson` records.
- A `Lesson` can optionally have a `Quiz`.
- A `User` can have many `Enrollment`, `ProgressRecord`, `QuizAttempt`, and `Notification` records.
- Important admin mutations should create `AuditLog` entries.

These entities are enough to support your entire roadmap without drifting into random features.

## Build Phases

### Phase 1: Foundations, Tooling, and the First Shell

**Objective**

Build the base project and learn the React and TypeScript fundamentals that everything else depends on. You are not trying to be clever here. You are building the rails that make later phases easier.

**Concepts to Learn**

- JSX and how React turns component trees into UI.
- Props, composition, and one-way data flow.
- Basic state with `useState`.
- Event handling and controlled inputs.
- TypeScript props typing, unions, and strictness habits.
- Next.js bootstrap, root layout, and App Router project shape.

**Features to Build**

- Public landing page shell.
- Base authenticated app shell with header, sidebar, and content area.
- Shared UI primitives such as `Button`, `Card`, `Input`, `Table`, `Badge`, and `PageHeader`.

**Step-by-Step Tasks**

1. Create a new Next.js App Router project with TypeScript, ESLint, and a clean `src` structure.
2. Add Tailwind CSS, configure a font system, and define spacing, color, and radius tokens so your UI feels consistent.
3. Install and configure `shadcn/ui` for pragmatic component primitives instead of reinventing every input and dialog.
4. Add the route groups `(marketing)`, `(auth)`, `(app)`, and `(admin)` even if most routes are placeholders at first.
5. Build a root layout and an authenticated shell layout with a header, sidebar slot, and content container.
6. Create a static landing page plus a static learner dashboard mock that uses realistic sample data.
7. Document your folder conventions and naming decisions in the project README so future-you can stay consistent.

**Challenges**

- Rebuild the learner dashboard shell so it works well on both desktop and tablet without changing the mental model of the layout.
- Create reusable card, table, and button primitives that can support metrics, course previews, and empty states without turning into prop monsters.
- Type every component prop explicitly and remove all accidental `any` usage before moving on.

**Big-Corp Patterns to Notice**

- Teams invest early in layout consistency because product surfaces multiply fast.
- Design tokens beat ad hoc spacing and colors when many screens are coming.
- Small, stable primitives make later feature work faster and safer.

**Anti-Patterns to Avoid**

- Dumping everything into a single `components/` folder with no product boundaries.
- Building fancy abstractions before you have repeated use cases.
- Ignoring TypeScript errors because "it still works."

**Verification Scenarios**

- The landing page, auth placeholder page, learner dashboard placeholder, and admin placeholder each render under the correct route group.
- The app shell remains usable when the sidebar content grows or the viewport shrinks.
- Shared UI primitives can be reused in at least three different contexts without copy-paste.

**Definition of Done**

- You can explain what JSX, props, state, and events are doing in your shell components.
- The project has a clean folder structure and consistent UI tokens.
- The app has a believable visual baseline instead of looking like an unstyled tutorial.

**Recruiter Talking Points**

- "I started by setting up route groups, reusable primitives, and a predictable shell because enterprise apps grow through consistency, not one-off pages."
- "I used TypeScript from day one so later refactors would be safer."

### Phase 2: Rendering Behavior and Component Design

**Objective**

Learn how React renders, re-renders, and reconciles component trees, then use that knowledge to design better components instead of blindly splitting files.

**Concepts to Learn**

- Render vs commit phases.
- Why keys matter in lists.
- Controlled vs uncontrolled UI patterns.
- Composition, slots, and component APIs.
- Conditional rendering, empty states, and skeleton patterns.
- Component boundaries based on behavior, not file size.

**Features to Build**

- Learner dashboard widgets.
- Course cards, lesson cards, and module previews.
- Sidebar navigation states, notification list, and activity feed.
- Empty, loading, and success variants for reusable dashboard blocks.

**Step-by-Step Tasks**

1. Replace static page blobs with data-driven components such as `CourseCard`, `StatTile`, `ProgressRing`, and `NotificationItem`.
2. Build repeatable list UIs for assigned courses, recommended courses, and recent activity with stable keys and clear loading states.
3. Create composable dashboard sections that accept title, action, body, and empty-state content as slots or children.
4. Add skeleton states for cards and lists so users see structure before data fully arrives.
5. Refactor duplicate layout markup into shared wrappers only after the duplication becomes obvious.
6. Stress-test your components with long titles, missing images, zero-data cases, and dense content.
7. Review each component and decide whether it owns behavior, only presentation, or both.

**Challenges**

- Design one `DashboardSection` API that supports a metrics row, a table preview, and an empty state without adding a dozen boolean props.
- Introduce a list reordering scenario and verify that item state stays attached to the correct row because your keys are stable.
- Rebuild one widget twice: first with poor composition, then with a cleaner API, and compare the tradeoffs.

**Big-Corp Patterns to Notice**

- Good component APIs reduce future churn more than clever styling tricks.
- Loading, empty, and error states are part of the product, not polish you add later.
- Teams care about render behavior because poorly shaped components get expensive at scale.

**Anti-Patterns to Avoid**

- A "god component" that accepts every possible variant through booleans.
- Index keys in stateful lists.
- Refactoring every repeated line into an abstraction before you understand the shared behavior.

**Verification Scenarios**

- Course cards render correctly with full data, partial data, and missing optional fields.
- Dashboard sections can render loading, empty, and populated states without layout jumps.
- Reordered lists keep the correct local state attached to the correct item.

**Definition of Done**

- You can explain why a component re-rendered and whether that re-render is a problem.
- The dashboard UI is modular, readable, and resistant to common content edge cases.
- Your component APIs feel intentional rather than accidental.

**Recruiter Talking Points**

- "I used render behavior to guide component design instead of splitting components arbitrarily."
- "I treated loading and empty states as first-class product states because real enterprise apps spend a lot of time there."

### Phase 3: State Management and State Boundaries

**Objective**

Learn how to model state without turning the app into a global store too early. The goal is judgment: know what should stay local, what should be lifted, and what should become shared context.

**Concepts to Learn**

- Local state with `useState`.
- Reducers with `useReducer`.
- Derived state vs duplicated state.
- Context as a dependency injection tool, not a dumping ground.
- `useRef` for non-visual mutable values.
- Custom hooks and when they actually help.

**Features to Build**

- Dashboard filters.
- Bookmarks.
- Course progress toggles in mock mode.
- Persisted UI preferences such as collapsed sidebar or preferred dashboard view.

**Step-by-Step Tasks**

1. Add local state for course filters, bookmark toggles, and small UI interactions inside the learner dashboard.
2. Lift filter state to the page level when multiple widgets need to respond to the same selection.
3. Build a reducer for a quiz draft or lesson progression flow so you practice event-based state transitions.
4. Introduce a narrow UI preferences context for concerns like sidebar collapse, density mode, or dismissed onboarding hints.
5. Persist selected client-only preferences in `localStorage` behind a client boundary.
6. Compute derived values such as completion percentages, active counts, and filtered totals instead of storing duplicate values.
7. Review every state variable and ask whether it is UI state, server state, derived state, or just temporary implementation noise.

**Challenges**

- Implement the same state flow once with multiple `useState` calls and once with `useReducer`, then decide which version is easier to reason about.
- Add bookmark persistence and handle the case where local persistence fails or is unavailable.
- Remove one unnecessary context after you realize it made the code harder to follow.

**Big-Corp Patterns to Notice**

- Mature teams are careful about state ownership because bad state placement spreads bugs everywhere.
- Reducers are useful when transitions matter more than the raw values.
- Derived state keeps systems honest and reduces synchronization bugs.

**Anti-Patterns to Avoid**

- Putting everything in context because prop drilling feels annoying.
- Storing computed values that should be derived.
- Using effects to keep two pieces of related state in sync when one can be computed from the other.

**Verification Scenarios**

- A dashboard filter updates every relevant widget without inconsistent counts or stale cards.
- Bookmarks persist across refreshes in the client.
- The quiz or progress reducer responds predictably to valid and invalid transitions.

**Definition of Done**

- You can justify where each important piece of state lives.
- The app has no obvious prop-drilling pain and no premature global store.
- The state model feels simpler after refactoring, not more abstract.

**Recruiter Talking Points**

- "I delayed global state on purpose and used local state, reducers, and small contexts because most complexity comes from bad ownership, not missing libraries."
- "I used derived state to avoid synchronization bugs."

### Phase 4: Effects, Forms, Validation, and Client Data Fetching

**Objective**

Learn side effects the hard way, but in a controlled scope. This phase teaches how forms, async work, and browser-driven behavior actually interact with React.

**Concepts to Learn**

- `useEffect` lifecycle and cleanup.
- Race conditions and stale async updates.
- Controlled and uncontrolled form patterns.
- React Hook Form basics.
- Zod schema validation.
- Loading, error, empty, and success states for client-driven flows.

**Features to Build**

- Profile settings form.
- Quiz attempt form.
- Course catalog page with client-side search against mock data or a lightweight endpoint.
- Inline validation and submission feedback.

**Step-by-Step Tasks**

1. Build a profile settings form using React Hook Form and Zod with fields such as display name, learning goal, and notification preferences.
2. Build a quiz attempt form with validation, field-level feedback, and a clear submit flow.
3. Add a course catalog search view that fetches data on the client so you can practice loading, empty, and failure states.
4. Implement a debounced search input and cancel or ignore stale responses so older requests do not overwrite newer results.
5. Add optimistic-feeling UI feedback for local interactions such as form submission pending states and disabled buttons.
6. Extract one repeated effect into a custom hook only after you have at least two concrete users for it.
7. Review every effect and remove the ones that are really just derived state or misplaced event logic.

**Challenges**

- Prevent double submission on slow quiz form posts.
- Preserve a draft when a user navigates away from the profile or quiz screen and comes back.
- Simulate a slow or failed search response and ensure the UI never shows stale results.

**Big-Corp Patterns to Notice**

- Forms are where product correctness, accessibility, and validation discipline show up fastest.
- Effects should be rare and purposeful, not the default place to put logic.
- Async UI quality depends on the states between request start and request finish, not just the success path.

**Anti-Patterns to Avoid**

- Fetching in every leaf component instead of at the right page or feature boundary.
- Using `useEffect` to mirror props into state without a strong reason.
- Mixing validation rules across ad hoc conditionals instead of centralizing them in schemas.

**Verification Scenarios**

- Invalid profile or quiz submissions show clear validation errors before a request is attempted.
- Slow client-side searches do not overwrite newer query results with stale data.
- Submission pending states prevent duplicate actions and communicate progress.

**Definition of Done**

- You can explain what each effect does and why it cannot be replaced by plain render logic.
- Your forms handle validation, success, and failure in a believable way.
- Your client-driven data flow no longer feels magical or fragile.

**Recruiter Talking Points**

- "I used React Hook Form and Zod to separate UI state from validation rules."
- "I treated race conditions and pending states seriously because real products fail in the gaps between clicks."

### Phase 5: Next.js App Router Architecture and Routing

**Objective**

Shift from "React app with pages" to "Next.js application with route-owned UI, layouts, and special files." This is where your architecture stops being generic React and starts being specifically modern Next.js.

**Concepts to Learn**

- Route groups and nested layouts.
- Dynamic segments and route params.
- `loading.tsx`, `error.tsx`, and `not-found.tsx`.
- Colocation of page concerns.
- URL state and query params.
- The App Router mental model compared with the older Pages Router.

**Features to Build**

- Public landing routes.
- Auth routes.
- Learner application routes.
- Manager team routes.
- Admin course management routes.

**Step-by-Step Tasks**

1. Build the real route tree using `(marketing)`, `(auth)`, `(app)`, and `(admin)` so responsibilities become obvious.
2. Create nested layouts so the learner shell, manager shell, and admin shell can share structure without sharing everything.
3. Add dynamic routes such as `/courses/[courseId]` and `/admin/courses/[courseId]/edit`.
4. Use query params for filterable screens where the state should be shareable by URL.
5. Add segment-level `loading.tsx` and `not-found.tsx` files where they clarify ownership and fallback behavior.
6. Implement navigation with breadcrumbs, sidebar sections, and active route awareness.
7. Write down why each major route belongs to its group and what layout it inherits.

**Challenges**

- Add a modal-like quick-preview route for a course card and decide whether the extra routing complexity is worth it.
- Represent at least one filter or table state in the URL instead of local component state.
- Reorganize one route after you realize the wrong layout owns it, then explain what the original structure made harder.

**Big-Corp Patterns to Notice**

- Layout ownership matters because large apps are mostly shared surfaces with focused inner screens.
- URLs are part of application state, especially for search, filters, and deep links.
- Route boundaries are product boundaries, not just file paths.

**Anti-Patterns to Avoid**

- A giant global layout that knows about every part of the product.
- Marking pages as client components by default just because interactivity might happen somewhere inside them.
- Hiding route logic in utility layers until the folder structure stops telling the truth.

**Verification Scenarios**

- Each persona reaches the correct shell and navigation for their product area.
- Dynamic course routes and admin edit routes resolve correctly and show meaningful missing-data fallbacks.
- URL-based filters remain shareable and survive refreshes.

**Definition of Done**

- The route tree communicates product structure clearly.
- Layout nesting reduces duplication instead of making ownership confusing.
- You can explain the App Router well enough to teach it to someone else.

**Recruiter Talking Points**

- "I used route groups and nested layouts to reflect product boundaries instead of treating routing as a flat list of pages."
- "I moved shareable filter state into the URL because enterprise users need deep links and consistent navigation."

### Phase 6: Server vs Client Components, Server Rendering, and Read Data Fetching

**Objective**

Learn the most important Next.js mindset shift: the server is part of your rendering model. Default to server-rendered read paths and introduce client code only where it earns its keep.

**Concepts to Learn**

- Server components vs client components.
- Async server rendering.
- Suspense and streaming.
- Parallel vs sequential data fetching.
- Serialization boundaries.
- What "less client JavaScript" actually buys you.

**Features to Build**

- Server-rendered course detail page.
- Learner assignments page.
- Manager progress summary page.
- Streaming analytics panel or secondary dashboard widget.

**Step-by-Step Tasks**

1. Convert read-heavy pages such as course detail, assignments, and manager summary to server components.
2. Fetch data on the server close to the route boundary instead of pulling everything into client-side effects.
3. Split interactive features such as bookmark toggles, tab switching, or chart filters into focused client islands.
4. Add Suspense boundaries around slower secondary content so the most important page content appears first.
5. Parallelize independent server fetches where the page would otherwise waterfall.
6. Compare the server-rendered version of one page to a client-fetched version and document the tradeoffs.
7. Remove redundant client fetching that no longer adds value after the page becomes server-first.

**Challenges**

- Build one dashboard page where the summary stats render immediately but the analytics widget streams in later.
- Decide whether a course detail accordion should stay client-side or whether only the interactive inner part needs client code.
- Trace a page with multiple fetches and eliminate one accidental sequential dependency.

**Big-Corp Patterns to Notice**

- Large teams want less client JavaScript when they can get it.
- Server components are strongest on read-heavy pages with low interactivity and clear data ownership.
- Streaming lets you improve perceived speed without faking it.

**Anti-Patterns to Avoid**

- Wrapping the whole app in client-only providers until server rendering loses its benefits.
- Passing giant serialized objects to the client just because a small button needs interactivity.
- Keeping both client fetching and server fetching for the same data path without a reason.

**Verification Scenarios**

- Course detail and manager summary pages render successfully with server-fetched data.
- Interactive client islands still work without forcing the whole page client-side.
- Secondary content can load later without blocking the primary reading path.

**Definition of Done**

- You can explain why each major page is server-rendered, client-rendered, or mixed.
- Your read-heavy screens use server rendering by default.
- Suspense boundaries improve the user experience instead of adding random spinners.

**Recruiter Talking Points**

- "I treated the server as part of the UI model, not just a data source."
- "I kept client components small and interactive so the app ships less JavaScript and has clearer ownership."

### Phase 7: Database Modeling, Validation, Server Actions, and Admin Editing

**Objective**

Move from mock and read-only features into real full-stack work. This phase is where the project starts to feel like a real product system instead of a polished prototype.

**Concepts to Learn**

- Prisma schema design and relations.
- Seed data and realistic dev fixtures.
- Server actions for mutations.
- Zod on both client and server.
- Optimistic UI basics and rollback thinking.
- Revalidation after writes.

**Features to Build**

- Course enrollments.
- Lesson completion.
- Quiz submission.
- Admin course create and edit flow.
- Draft and publish/unpublish workflow.

**Step-by-Step Tasks**

1. Design a Prisma schema for the core entities and seed a realistic organization with sample users, courses, modules, lessons, quizzes, and enrollments.
2. Create shared validation schemas for course creation, lesson editing, quiz submission, and enrollment actions.
3. Implement server actions for enrolling in a course, marking a lesson complete, submitting a quiz, saving a draft course, and publishing or unpublishing a course.
4. Use optimistic UI for lightweight learner actions such as bookmark or completion toggles where instant feedback matters.
5. Revalidate the correct routes or tags after writes so the UI reflects changes without brute-force refresh behavior.
6. Add draft and published states to the admin course flow so content governance becomes part of the product story.
7. Create audit log entries for significant admin mutations such as publish, unpublish, and lesson edits.

**Challenges**

- Add rollback behavior when an optimistic lesson-complete action fails.
- Split the admin course editor into sections that can be saved safely without submitting one giant fragile form.
- Protect the publish flow so invalid course data cannot bypass server validation.

**Big-Corp Patterns to Notice**

- Real products depend on write-path correctness more than flashy UI.
- Shared validation prevents drift between client expectations and server truth.
- Auditability matters when more than one person can change important data.

**Anti-Patterns to Avoid**

- Trusting client-submitted data because it already passed local validation.
- Stuffing business rules into page components instead of mutation boundaries.
- Using route handlers for every internal mutation even when a server action is the more direct fit.

**Verification Scenarios**

- A learner can enroll, complete a lesson, and see progress update after the mutation succeeds.
- Invalid admin course data is rejected on the server even if the client attempted submission.
- Publishing or unpublishing a course changes its visibility and records the action in the audit log.

**Definition of Done**

- The app has a working database schema and realistic seed data.
- The core learner and admin write paths are live and validated.
- Server actions feel reliable rather than magical.

**Recruiter Talking Points**

- "I used server actions for UI-owned mutations and kept validation on both client and server."
- "I added audit logging and draft/publish workflow because enterprise apps need governance, not just CRUD."

### Phase 8: Authentication, Authorization, and Protected Product Flows

**Objective**

Teach yourself the difference between being signed in and being allowed to do something. Many weak portfolio apps stop at authentication. Strong ones model authorization.

**Concepts to Learn**

- Auth.js sessions and providers.
- Protected routes and session-aware layouts.
- Role-based access control.
- Middleware for coarse route protection.
- Server-side permission checks.
- Unauthorized and expired-session UX.

**Features to Build**

- Sign-in flow.
- Session-aware app shell.
- Role-based navigation.
- Manager-only team pages, assignment management, and reminder actions.
- Admin-only content management, publish actions, and role-management surface.

**Step-by-Step Tasks**

1. Configure Auth.js with a practical provider strategy for learning, such as credentials plus one social or GitHub provider, and seed users for each role.
2. Build session-aware sign-in and sign-out flows with clear post-login redirection.
3. Render navigation conditionally by role so learners, managers, and admins see the product areas relevant to them.
4. Add middleware for broad route gating on protected surfaces.
5. Enforce permissions again inside server actions, route handlers, and server-rendered loaders so security does not depend on hidden buttons.
6. Create an unauthorized state and a session-expired state with useful recovery messaging.
7. Add a first-login onboarding flow or role-aware welcome experience to make the auth surface feel like a product, not a form.
8. Build a manager assignment-and-reminder flow plus a small admin role-management screen so RBAC is exercised on both read and write surfaces.

**Challenges**

- Prove that a learner cannot reach an admin action by manually hitting the route or forging a request.
- Let managers assign learning paths but prevent them from publishing or editing course content.
- Design a multi-step onboarding flow that captures learning interests without bloating the auth surface.

**Big-Corp Patterns to Notice**

- Authentication answers "who are you" while authorization answers "what may you do."
- Defense in depth is normal: middleware, UI guards, and server checks all matter.
- Good authorization design shapes the product experience, not just the security model.

**Anti-Patterns to Avoid**

- Hiding buttons and calling that security.
- Putting all permission logic in middleware and nowhere else.
- Exposing sensitive data in a server-rendered payload before redirecting unauthorized users.

**Verification Scenarios**

- Learners cannot access admin routes or admin mutations.
- Managers can view team progress, assign learning paths, and send reminders but cannot publish courses.
- Admins can access role-management actions that are hidden and rejected for non-admin roles.
- Session expiration leads to a recoverable sign-in path instead of a confusing broken screen.

**Definition of Done**

- The application has real protected flows, not just a login page.
- Permissions are enforced at the UI and server layers.
- You can explain exactly where authorization is checked for each sensitive operation.

**Recruiter Talking Points**

- "I separated authentication from authorization and enforced permissions server-side."
- "I used middleware for coarse gating and action-level checks for real security."

### Phase 9: Caching, Revalidation, Search, Tables, and Performance

**Objective**

Learn how Next.js performance work is mostly about rendering strategy, caching policy, and payload discipline before it becomes about micro-optimizing React hooks.

**Concepts to Learn**

- Static vs dynamic rendering.
- Data cache and revalidation strategies.
- Tag-based invalidation.
- URL-driven search and filter state.
- Table patterns for enterprise admin surfaces.
- React performance judgment, including when memoization is worth it.

**Features to Build**

- Searchable course catalog.
- Admin course table with sorting, filtering, and pagination.
- Analytics summary widgets.
- Better loading and perceived performance on heavy screens.

**Step-by-Step Tasks**

1. Classify major routes as static, dynamic, or revalidated and write down why each page belongs in its category.
2. Add tag-based or route-based revalidation after course publish, edit, and enrollment mutations.
3. Build an admin course table with pagination, sorting, and filters that can scale beyond a handful of rows.
4. Put table filters and search queries in the URL where shareable state improves usability.
5. Add server-side search or route-handler-backed search where it makes more sense than pure client filtering.
6. Measure bundle weight, render behavior, and obvious slow interactions before optimizing anything.
7. Optimize one heavy screen by reducing client bundle scope, code-splitting non-critical UI, or narrowing data payloads.

**Challenges**

- Fix a deliberately slow analytics or admin page and record exactly which change helped.
- Decide whether catalog search should be purely server-driven, hybrid, or client-side, and justify the choice.
- Preserve useful table state in the URL without making the implementation unreadable.

**Big-Corp Patterns to Notice**

- Teams care about cache invalidation because stale data destroys trust.
- Tables, search, and pagination are core enterprise UI patterns.
- Performance work starts with measurement and architecture, not random `useMemo` usage.

**Anti-Patterns to Avoid**

- Marking everything dynamic because it seems simpler.
- Refetching the same server-owned data on the client after the page already rendered it.
- Memoizing every component without evidence that the extra complexity helps.

**Verification Scenarios**

- Course publish and edit actions invalidate stale views correctly.
- Search and filters survive refresh and produce shareable URLs.
- The slow screen you targeted shows measurable improvement and a clear reason for that improvement.

**Definition of Done**

- You can explain the rendering and caching strategy for your major routes.
- The app includes at least one serious table surface and one serious search flow.
- Your performance changes are backed by measurements or observable improvements, not intuition alone.

**Recruiter Talking Points**

- "I treated performance as a product architecture problem first and a hook optimization problem second."
- "I used revalidation and URL-driven state because enterprise users need fresh data and shareable views."

### Phase 10: Error Handling, Observability, and Operational Reliability

**Objective**

Teach yourself to build products that fail predictably and recover gracefully. Big teams care less about whether an error happens and more about whether they can understand and contain it.

**Concepts to Learn**

- Segment-level and global error boundaries.
- `error.tsx` and `not-found.tsx`.
- Recoverable vs unrecoverable errors.
- Structured logging.
- Tracing mindset and useful debug context.
- User-friendly error communication.

**Features to Build**

- Global fallback UI.
- Segment-specific error handling for learner, manager, and admin surfaces.
- Retry flow for lesson pages, quiz reads, analytics widgets, and other selected read paths.
- Logging hooks for sensitive mutations and failures.

**Step-by-Step Tasks**

1. Add a global `error.tsx` and route-level error boundaries where isolated failure handling improves the user experience.
2. Create helpful `not-found.tsx` states for missing courses, missing admin records, and invalid deep links.
3. Build retry flows for recoverable read failures such as analytics widgets or course detail loading.
4. Add structured logging around server actions, failed validations, route handler failures, and auth issues.
5. Capture useful context such as actor, entity, route, and mutation type without leaking sensitive data.
6. Simulate failures in data loading, permissions, and mutations to confirm that failures stay contained.
7. Define which classes of failure would only log, which should alert, and which should block release.

**Challenges**

- Make one secondary panel fail without breaking the rest of the dashboard.
- Design an error message system that tells the user what to do next instead of only saying something went wrong.
- Add idempotent retry behavior for one mutation or fetch path and verify it does not create duplicate work.

**Big-Corp Patterns to Notice**

- Reliable software communicates failure clearly to both users and engineers.
- Observability is about actionable context, not just printing stack traces.
- Isolated failure handling protects the rest of the product experience.

**Anti-Patterns to Avoid**

- Swallowing errors and leaving the UI silently stale.
- Showing the same vague message for every failure class.
- Leaking raw internal errors or stack traces to end users.

**Verification Scenarios**

- A missing course route shows a not-found state instead of crashing the shell.
- Lesson and quiz failures surface actionable recovery states instead of trapping the user on a broken screen.
- A failing analytics widget can recover or at least fail in isolation.
- Logs contain enough context to tell who did what and where a failure occurred.

**Definition of Done**

- Major product areas have meaningful error and not-found behavior.
- Logging is present on important failures and writes.
- You can describe how you would debug a broken write path or missing-data incident.

**Recruiter Talking Points**

- "I designed failure states and logging as product features, not as afterthoughts."
- "I used route-level error handling to contain faults and improve recovery."

### Phase 11: Testing, CI, and Release Confidence

**Objective**

Turn the project from a demo into a maintainable system. The goal is not maximum test count. The goal is confidence in the flows that matter most.

**Concepts to Learn**

- Unit vs component vs integration vs end-to-end testing.
- Test selection by risk.
- Mocking boundaries without over-mocking product logic.
- CI quality gates.
- Testing failure paths, not only happy paths.
- Release confidence as an engineering output.

**Features to Build**

- Automated tests for validation, components, protected flows, and core journeys.
- CI pipeline for lint, test, and build.
- Stable test data and environment handling.

**Step-by-Step Tasks**

1. Write unit tests for validation schemas, helper functions, and permission logic where wrong behavior would be costly.
2. Add component tests for forms, table interactions, loading states, and unauthorized states.
3. Add integration tests for server actions and data mutation flows with a test-friendly database strategy.
4. Build one end-to-end happy path: sign in as learner, enroll, complete a lesson, submit a quiz, and see progress update.
5. Build one end-to-end failure path: unauthorized access or invalid form submission that must fail correctly.
6. Set up CI to run lint, tests, and build checks automatically.
7. Add a release checklist so shipping becomes a repeatable process instead of memory work.

**Challenges**

- Test an optimistic UI flow and prove the rollback behavior works when the mutation fails.
- Mock auth in a way that stays realistic enough to test role-aware behavior.
- Decide which parts of the admin flow deserve unit tests, integration tests, and E2E tests instead of blindly testing everything at every level.

**Big-Corp Patterns to Notice**

- Good teams test by risk, not by ego.
- CI is part of the product delivery system.
- Failure-path coverage matters because real bugs rarely live only on the happy path.

**Anti-Patterns to Avoid**

- Overusing snapshots while missing actual user behavior.
- Testing implementation details instead of outcomes.
- Treating CI failures as optional warnings.

**Verification Scenarios**

- The learner happy path passes in E2E from sign-in to visible progress update.
- At least one unauthorized path fails exactly as intended.
- CI catches a broken validation rule, lint issue, or build regression before merge.

**Definition of Done**

- The project has a realistic, risk-based test strategy.
- Critical learner, manager, and admin flows are covered at the right levels.
- CI gives you meaningful release confidence.

**Recruiter Talking Points**

- "I focused testing on risky flows like auth, validation, server actions, and optimistic UI instead of chasing meaningless coverage."
- "I wired CI so the project behaves like something a team could actually ship."

### Phase 12: Advanced Polish, SEO, Accessibility, Deployment, and Portfolio Packaging

**Objective**

Finish strong. This phase makes the difference between "I built something functional" and "I can present a polished product and explain the engineering choices behind it."

**Concepts to Learn**

- Metadata and SEO in Next.js.
- Accessibility testing and keyboard-first interaction.
- Feature flags and safe release thinking.
- CI/CD handoff, preview deployments, and release governance.
- Deployment and environment management.
- Portfolio storytelling and project packaging.
- Post-release bug triage discipline.

**Features to Build**

- Polished landing page metadata.
- Accessible forms and navigation.
- Admin audit log filters.
- Optional feature flag for beta functionality.
- Preview deployment and release checklist.
- Production deployment and portfolio documentation.

**Step-by-Step Tasks**

1. Add page metadata, Open Graph tags, sitemap, and robots rules for the public marketing surface.
2. Run an accessibility pass on forms, dialogs, navigation, focus order, and keyboard interactions, then fix the problems you find.
3. Add a simple feature flag for a beta analytics module or experimental learning recommendation widget.
4. Improve the audit log with filters and actor-based search so governance feels real.
5. Finalize deployment on Vercel with preview environments, environment variables, migration flow, and seed strategy clearly documented.
6. Connect your CI checks to a simple deployment promotion story so testing and shipping feel like one workflow instead of separate chores.
7. Write a strong README or recruiter-facing case study that explains the product, architecture, tradeoffs, and demo paths.
8. Prepare a short demo script and screenshots so recruiters can understand the project in minutes.

**Challenges**

- Improve Lighthouse or Core Web Vitals on the landing page and explain what changed.
- Ship a feature flag safely and decide how you would roll it back if it caused problems.
- Ship a polished capstone release, write a recruiter-facing case study, and run a post-release bug triage exercise that classifies blockers, follow-ups, and acceptable debt.

**Big-Corp Patterns to Notice**

- Accessibility is not optional polish. It is product quality.
- Deployment is part of engineering work, not the last five minutes of a project.
- Strong portfolio projects tell a clear story about why decisions were made.

**Anti-Patterns to Avoid**

- Treating metadata and accessibility as things you do only after the project is "done."
- Shipping without an environment setup story or migration plan.
- Presenting a portfolio project without a concise explanation of the problem, design, and tradeoffs.

**Verification Scenarios**

- Public marketing pages render correct metadata and are ready to share.
- Important forms and navigation paths work with keyboard access and visible focus handling.
- The deployed app can be explained, demonstrated, and evaluated quickly by someone seeing it for the first time.

**Definition of Done**

- The project is deployed, accessible, and presentable.
- The README and demo story make the technical work easy to understand.
- You feel prepared to discuss tradeoffs, not just show screens.

**Recruiter Talking Points**

- "I finished the project with accessibility, metadata, deployment, and documentation because shipping quality is broader than features."
- "I can demo the product and explain the tradeoffs behind the architecture in plain language."

## Advanced Challenge Track

Use these stretch challenges after the matching phase or once the core version works.

| Challenge | Why it matters | Best phase to attempt |
| --- | --- | --- |
| Multi-step onboarding flow | Teaches client state, validation, auth UX, and progressive setup without overwhelming a new user. | 8 |
| Draft vs published course workflow | Introduces governance, status transitions, and admin product discipline. | 7 |
| Manager assignment workflow | Shows role-aware mutations and cross-persona product behavior. | 8 |
| Optimistic updates with rollback | Forces you to think about pending state, failures, and user trust. | 7 or 9 |
| Searchable and paginated admin tables | Recreates one of the most common enterprise UI patterns. | 9 |
| Role-based dashboards from one shared codebase | Teaches reuse without flattening product differences. | 2 or 5 |
| Middleware-based access control | Helps you learn broad route gating while understanding its limitations. | 8 |
| Analytics aggregation page | Pushes server rendering, data shaping, and performance thinking. | 6 or 9 |
| Audit log with filters | Adds governance, traceability, and more realistic admin depth. | 7 or 12 |
| Accessibility pass on forms and keyboard navigation | Shows engineering maturity and attention to product quality. | 12 |
| Performance budget and Core Web Vitals review | Makes performance a measurable engineering topic instead of vague advice. | 9 or 12 |
| Deployment checklist and post-release bug triage | Simulates real shipping work and operational thinking. | 11 or 12 |

## Test Plan for the Roadmap

Use these explicit verification scenarios to decide whether the curriculum still covers the right product and engineering depth.

- A learner can sign in, enroll in a course, complete lessons, submit a quiz, and see progress update on the dashboard.
- A manager can view team progress, assign learning paths, and send reminders, but cannot access admin publish or role-management actions.
- An admin can create, edit, publish, unpublish, and audit courses without breaking role boundaries.
- Invalid quiz submissions and invalid form submissions show clear validation errors before or after the server boundary, depending on where the rule lives.
- Protected routes and protected mutations reject unauthorized access even when the user hits them directly.
- Loading, empty, error, and success states exist for major learner, manager, and admin screens.
- Key public and authenticated pages have acceptable performance characteristics and the public surface includes metadata and SEO essentials.
- The roadmap includes at least one full E2E happy path and one failure path that should be automated before calling the project portfolio-ready.

## Capstone Release Checklist

Use this checklist before calling the project portfolio-ready.

- The landing page clearly explains what SkillForge does and looks intentional on desktop and mobile.
- The learner, manager, and admin personas each have a meaningful, distinct demo path.
- Auth and RBAC are enforced on the server, not only in the UI.
- Core write paths are validated, tested, and logged.
- Loading, empty, success, and error states exist for major screens.
- Search, filtering, and at least one serious admin table are implemented.
- Caching and revalidation behavior are intentional and documented.
- The app includes at least one optimistic update with rollback behavior.
- The app includes at least one audit log or traceability feature.
- Accessibility issues for major forms and navigation have been addressed.
- CI runs lint, tests, and build checks.
- The deployed version has working environment setup and a repeatable seed story.
- README or case study explains architecture, tradeoffs, lessons, and screenshots.
- You have a 3-5 minute demo script and a 30-second summary prepared for interviews.

## Interview Prep From This Project

SkillForge becomes much more valuable if you can explain it clearly. Practice answering these questions out loud.

### Product and architecture questions

- Why did you choose an internal learning platform instead of a simpler app?
- How did you divide the product between learner, manager, and admin personas?
- Why did you choose the App Router over the Pages Router?
- How did route groups and nested layouts help the project stay organized?

### React questions

- What causes a component to re-render in your app?
- Where did you use local state, reducers, and context, and why?
- What effect-related bugs did you hit and how did you fix them?
- How did you prevent over-abstraction in your component design?

### Next.js questions

- Which pages are server components and which are client components?
- When did you use server actions versus route handlers?
- How does caching and revalidation work in your app?
- What part of the app benefits most from Suspense or streaming?

### Product engineering questions

- How do you enforce authorization for admin and manager flows?
- What validation runs on the client and what validation runs on the server?
- How do you handle optimistic UI when a mutation fails?
- How would you debug a failed publish action in production?

### Quality and operations questions

- What is your testing strategy and why does it focus on those areas?
- What are the main performance risks in the app?
- What logs or metrics would you want in production?
- If the product scaled to many organizations, what would you change first?

When you answer, keep using the same structure:

1. State the problem.
2. Explain the decision you made.
3. Explain the tradeoff you accepted.
4. Mention how you validated that decision.

That structure sounds senior because it shows judgment, not memorized definitions.

## Next Steps After Completion

Once the core version of SkillForge is done, you can keep extending it based on the kind of job you want.

- If you want stronger frontend platform credibility, add design system documentation, richer tables, and more accessibility rigor.
- If you want stronger full-stack credibility, add organization-level tenancy, invitation flows, background jobs, and reporting exports.
- If you want stronger product analytics credibility, add event tracking, funnel analysis, and cohort-style retention views.
- If you want stronger systems thinking, model webhooks, asynchronous processing, or a lightweight event-driven workflow for course publishing.
- If you want stronger interview readiness, write short architecture notes after each phase describing what changed, why it changed, and what you would improve next.

The most important rule is simple: do not just finish the features. Finish the explanations. A portfolio project becomes impressive when you can show the artifact and explain the engineering reasoning behind it with clarity.
