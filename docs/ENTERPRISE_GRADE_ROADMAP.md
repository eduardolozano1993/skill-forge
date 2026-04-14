# Enterprise-Grade Roadmap For Skill Forge

This document is intentionally based on the current repository, not on a generic SaaS checklist.

From the codebase, Skill Forge is currently:

- A `Next.js` App Router app with server actions
- Using `Auth.js` credentials auth with JWT sessions
- Using `Prisma`
- Backed by `PostgreSQL`
- Split into `ADMIN`, `MANAGER`, and `EMPLOYEE` experiences
- Doing most reads synchronously at request time
- Logging sign-in lockouts to a local file
- Keeping sign-in rate limiting in memory

That is a strong learning-stage architecture. It is not enterprise-ready yet, but it is in a good place to learn systems design by adding the next layer of capabilities one at a time.

## What Will Break First As The App Grows

These are the pressure points I see from the current code:

1. The sign-in rate limiter in `lib/auth/sign-in-rate-limit.ts` only works inside one process, so it stops being reliable the moment you scale horizontally.
2. The sign-in log in `lib/auth/sign-in-log.ts` writes to local disk, which is fragile in containers and useless across multiple instances.
3. Admin and manager dashboard aggregates in `lib/admin/data.ts` and `lib/manager/data.ts` will get slower as data grows because everything is recomputed on demand.
4. Course search is still simple in-app filtering, which is fine now, but not enough once you want typo tolerance, filters, ranking, and fast global search.
5. There is no background-job system yet, so every future "send email", "recompute analytics", "build report", or "sync search index" feature will either block requests or become messy.
6. There is no audit trail or revision history for high-trust admin operations like course edits, status changes, and organization-wide actions.
7. Auth is local-credentials only. That is fine for development, but enterprise buyers will eventually ask for SSO, stronger identity controls, and centralized user lifecycle management.

## The Best Enterprise-Grade Additions For This App

| Priority | Addition | Why it fits this app | Free / easy tool |
| --- | --- | --- | --- |
| 1 | Add Redis | Solves shared rate limits, caching, short-lived state, and distributed coordination | `redis` Docker image |
| 2 | Add a job queue | Lets you move slow work out of requests | `BullMQ` + Redis |
| 3 | Add audit logs and event outbox | Makes admin actions explainable, reviewable, and replayable | PostgreSQL tables, no paid tool |
| 4 | Add object storage | Prepares for attachments, images, PDFs, videos, exports, backups | `MinIO` |
| 5 | Add metrics, logs, and traces | Gives you operability instead of guessing | `OpenTelemetry`, `Prometheus`, `Grafana`, `Loki` |
| 6 | Add real search | Makes course discovery fast and realistic | `Meilisearch` |
| 7 | Add enterprise auth / SSO | Teaches real identity architecture | `Keycloak` |

If you only do three things first, do these:

1. Redis
2. BullMQ
3. Audit logs and outbox events

That trio will teach you more practical systems design than ten theoretical diagrams.

## 1. Harden PostgreSQL For Production-Like Workloads

### Why this matters here

The repo is already on PostgreSQL, which is the right baseline for learning production-shaped application design. The next step is to treat it like an operational datastore rather than just a development dependency.

PostgreSQL gives you:

- Better concurrent reads and writes
- Real indexing strategies
- Better backup and restore workflows
- Easier integration with analytics and tooling
- A production-like environment that Prisma handles very well

### What to change in this app

- Keep `.env` `DATABASE_URL` pointed at Postgres
- Keep Prisma migrations generated for the `postgresql` provider
- Add indexes for the hot paths you already have
- Add backup, restore, and seed workflows that assume Postgres from the start

### Concrete indexes I would add first

For your current queries, start with indexes like:

- `User(email)` unique already exists
- `User(organizationId, userType, status)`
- `Organization(status)`
- `Course(status, name)`
- `OrganizationCourse(organizationId, courseId)` already covered by composite PK
- `Bookmark(userId, createdAt)`
- `CompletedCourse(userId, completedAt)`

### What you learn

- OLTP database design
- Query planning and indexing
- Migration discipline
- Backup and restore basics

### Easy local setup

Official docs:

- PostgreSQL Docker image: https://hub.docker.com/_/postgres/

Minimal local container:

```bash
docker run --name skillforge-postgres ^
  -e POSTGRES_USER=skillforge ^
  -e POSTGRES_PASSWORD=skillforge ^
  -e POSTGRES_DB=skillforge ^
  -p 5432:5432 ^
  -d postgres:17
```

## 2. Add Redis

Redis is the single best next tool for this codebase because it solves multiple real problems you already have.

### Why Redis fits this app specifically

Right now you already have:

- In-memory sign-in rate limiting
- Local-only log files
- Recomputed dashboards
- No shared coordination between instances
- No job queue yet

Redis can help with all of that.

### Easy local setup

Official docs:

- Redis Docker docs: https://redis.io/docs/latest/operate/oss_and_stack/install/install-stack/docker/

Minimal local container:

```bash
docker run -d --name skillforge-redis -p 6379:6379 redis:8
```

### Concrete Redis use cases for Skill Forge

#### A. Distributed sign-in rate limiting

This is the most obvious first use because your README already calls out the current limitation.

Current state:

- `lib/auth/sign-in-rate-limit.ts` stores attempts in a process-local `Map`
- If you run 3 app instances, each instance gets its own counter
- A user can bypass limits by hitting different instances

Redis design:

- Key: `rl:signin:<email>:<ip>`
- Value: integer counter
- TTL: 15 minutes

Flow:

1. On failed sign-in, `INCR` the key
2. If the value becomes `1`, also set `EXPIRE 900`
3. If the value reaches threshold, create a block key like `rl:signin:block:<email>:<ip>` with TTL `300`
4. On successful sign-in, delete both keys

What you learn:

- Shared state across instances
- TTL-based ephemeral data
- Atomic counter patterns

#### B. Cache expensive dashboard reads

Your admin and manager dashboards are good candidates for short-lived caches.

Current hot spots:

- `lib/admin/data.ts`
- `lib/manager/data.ts`
- potentially course action-state lookups in `lib/courses/queries.ts`

Redis design:

- Key: `cache:admin:platform-summary`
- Key: `cache:manager:<orgId>:dashboard`
- Key: `cache:course:<courseId>:detail:<userId>`
- Value: serialized JSON
- TTL: 30 to 120 seconds

Good rule:

- Cache only reads
- Keep TTL short
- Explicitly invalidate on writes that change the underlying data

Concrete invalidation points in your code:

- `updateAdminUserStatusAction`
- `updateAdminOrganizationStatusAction`
- `updateAdminCourseStatusAction`
- `assignCourseToOrganizationAction`
- `assignBookmarkedCourseToOrganizationAction`
- `removeAssignedCourseFromOrganizationAction`
- `toggleCourseBookmarkAction`
- `toggleCourseCompletionAction`

What you learn:

- Read-through cache patterns
- Cache invalidation
- The difference between correctness-critical data and performance data

#### C. Session revocation and user lockout state

This one is more advanced and very realistic.

Current state:

- Sessions use JWT strategy in `auth.ts`
- If a user is deactivated after sign-in, token invalidation is not centrally controlled

Redis design options:

Option 1:

- Store `auth:user-session-version:<userId>`
- Put the version into the JWT
- Reject tokens whose version is stale

Option 2:

- Store revoked token IDs with TTL until their natural expiry

This teaches:

- Stateless auth with centralized revocation
- Tradeoffs between pure JWT and hybrid session control

#### D. Distributed locks for high-trust admin workflows

This app already has an admin course edit flow. That creates a perfect learning exercise.

Potential issue:

- Two admins edit the same course content at the same time
- Last write wins
- No protection, no warning, no lock, no revision trail

Redis design:

- Key: `lock:course-edit:<courseId>`
- Value: `adminUserId`
- TTL: 60 to 300 seconds
- Acquire with `SET key value NX EX 120`

Use it to:

- Show "another admin is editing this course"
- Prevent overlapping writes for sensitive operations

Better long-term design:

- Use both a short Redis lock and a database revision/version field

What you learn:

- Coordination
- Soft locks vs hard consistency
- Optimistic vs pessimistic control

#### E. Queue backend for background jobs

If you adopt `BullMQ`, Redis becomes your queue infrastructure.

Use cases in this app:

- Send "course assigned" notifications
- Recompute organization metrics after assignment changes
- Reindex courses into search after course updates
- Generate CSV or PDF admin exports
- Run periodic cleanup and archival jobs

What you learn:

- Asynchronous systems
- Retry policies
- Dead-letter behavior
- Idempotent job handling

#### F. Lightweight pub/sub or cache invalidation events

This is not the first Redis feature I would build, but it is a useful systems design exercise.

Example:

- When course status changes, publish `course.updated`
- Other app parts invalidate cached views or refresh search documents

This teaches:

- Event-driven thinking without jumping to Kafka too early

### The Redis lesson to focus on

Do not add Redis just to say "the app uses Redis".

Use it for:

1. Shared rate limiting
2. Caching
3. Session/control-plane state
4. Jobs
5. Lightweight coordination

That is already a realistic enterprise-grade Redis footprint.

## 3. Add Background Jobs With BullMQ

### Why this matters here

Right now almost everything happens inline in the request cycle. That is fine until you add anything slow or operationally important.

`BullMQ` is a strong fit because:

- It is free
- It is Node-native
- It runs on Redis
- It is much simpler than introducing RabbitMQ or Kafka at this stage

Official docs:

- BullMQ docs: https://docs.bullmq.io/

### Concrete jobs to build in Skill Forge

#### A. Course indexing job

When an admin updates a course in `updateCourseContentAction`, enqueue:

- queue: `search-index`
- job name: `course.updated`
- payload: `{ courseId }`

Worker action:

- Read the course from Postgres
- Update the Meilisearch document

Why this is good:

- Teaches eventual consistency
- Decouples writes from secondary systems

#### B. Analytics recompute job

When managers assign or unassign courses:

- queue: `analytics`
- job name: `organization.metrics.recompute`
- payload: `{ organizationId }`

Worker action:

- Recompute cached summary data
- Optionally persist summary snapshots in a reporting table

#### C. Notification job

When courses are assigned:

- queue: `notifications`
- job name: `course.assigned`
- payload: `{ organizationId, courseId }`

Worker action:

- Gather recipients
- Send email or in-app notification

### What you learn

- At-least-once processing
- Idempotency
- Retry and backoff
- Separating command path from async side effects

## 4. Add Audit Logs, Revision History, And An Outbox Table

This is one of the most realistic enterprise upgrades you can make, and it is very aligned with your current admin-heavy workflows.

### Why this matters here

Your app already has actions that change important state:

- deactivate users
- deactivate organizations
- deactivate courses
- assign and unassign courses
- edit course content

For enterprise use, "who changed what and when?" matters almost as much as the change itself.

### What to add

#### A. `AuditLog` table

Example shape:

```text
AuditLog
- id
- actorUserId
- action
- entityType
- entityId
- beforeJson
- afterJson
- ipAddress
- createdAt
```

Log actions such as:

- `user.status.changed`
- `organization.status.changed`
- `course.status.changed`
- `course.content.updated`
- `organization.course.assigned`
- `organization.course.removed`

#### B. `CourseRevision` table

Example shape:

```text
CourseRevision
- id
- courseId
- version
- content
- summary
- editedByUserId
- createdAt
```

Use it to:

- diff changes
- roll back mistakes
- show revision history in admin UI

#### C. `OutboxEvent` table

This is a very good systems-design concept to learn.

Example shape:

```text
OutboxEvent
- id
- eventType
- aggregateType
- aggregateId
- payloadJson
- createdAt
- processedAt
- status
```

Pattern:

1. In the same DB transaction as the business write, insert an outbox record
2. A background worker reads unprocessed outbox rows
3. The worker publishes to Redis jobs, search indexing, notifications, etc.
4. Mark the outbox row as processed

This prevents "DB update succeeded but side effect failed" inconsistencies.

### What you learn

- Compliance-oriented thinking
- Event-driven architecture
- Reliable side effects
- Change history and rollback

## 5. Add Object Storage With MinIO

### Why this matters here

Right now course content appears to live mainly as text or JSON in the database. That is fine for simple content, but enterprise learning platforms eventually need:

- PDFs
- thumbnails
- downloadable resources
- certificates
- exports
- maybe recorded video metadata

You do not want large binary files inside the relational database.

`MinIO` is a good local, Docker-friendly, S3-compatible object store.

Official docs:

- MinIO container docs: https://min.io/docs/minio/container/index.html

Simple local container:

```bash
docker run ^
  -p 9000:9000 ^
  -p 9001:9001 ^
  --name skillforge-minio ^
  -v D:\minio\data:/data ^
  -e "MINIO_ROOT_USER=minioadmin" ^
  -e "MINIO_ROOT_PASSWORD=minioadmin123" ^
  quay.io/minio/minio server /data --console-address ":9001"
```

### Concrete ways to use MinIO here

1. Store course attachments and keep only metadata plus object keys in Postgres.
2. Store generated exports such as admin CSV reports.
3. Store versioned course assets so old revisions stay reproducible.
4. Store backup artifacts if you want to practice disaster recovery locally.

### What you learn

- Separating metadata from blobs
- Pre-signed upload/download URLs
- S3-compatible storage design

## 6. Add Observability: Metrics, Logs, And Traces

This is one of the clearest enterprise gaps in the current app.

### Why this matters here

At the moment you can read the app code, but once the system is running under load, you need to answer questions like:

- Why is `/admin` slow?
- Which query got expensive?
- Are sign-in failures spiking?
- Are job retries growing?
- Which manager actions fail most often?

### Recommended free stack

- `OpenTelemetry` in the Node app
- `Prometheus` for metrics
- `Grafana` for dashboards
- `Loki` for logs

Official docs:

- OpenTelemetry Node getting started: https://opentelemetry.io/docs/languages/js/getting-started/nodejs/
- Prometheus install docs: https://prometheus.io/docs/prometheus/latest/installation/
- Grafana Docker docs: https://grafana.com/docs/grafana/latest/setup-grafana/installation/docker/
- Loki Docker docs: https://grafana.com/docs/loki/latest/setup/install/docker/

### What to instrument first

#### Metrics

- sign-in success/failure counts
- sign-in lockout counts
- request duration per route
- Prisma query duration buckets
- cache hit/miss counts
- BullMQ queue depth
- job retry counts

#### Logs

- use structured JSON logs
- include `requestId`, `userId`, `organizationId`, and `route`
- stop relying on local text files for operational logs

#### Traces

- trace sign-in flow
- trace admin dashboard load
- trace course edit submit path
- trace queue producer to queue worker path

### Specific app improvements

Replace the local sign-in log file with one of these:

1. structured application logs shipped to Loki
2. an `AuditLog` or security-events table in Postgres
3. both

### What you learn

- The difference between logs, metrics, and traces
- SLO-oriented thinking
- Operational debugging

## 7. Add Search With Meilisearch

### Why this matters here

Your current course search is good enough for small datasets, but it is still basically app-level filtering.

That will eventually fall short if you want:

- typo tolerance
- ranked search
- prefix search
- filtering by organization or status
- fast search without pulling large result sets into the app layer

`Meilisearch` is a good learning choice because it is lighter than Elasticsearch and easy to run locally.

Official docs:

- Meilisearch Docker docs: https://www.meilisearch.com/docs/resources/self_hosting/getting_started/docker

Simple local container:

```bash
docker run -it --rm ^
  -p 7700:7700 ^
  -e MEILI_MASTER_KEY=skillforge_master_key ^
  -v D:\meili_data:/meili_data ^
  getmeili/meilisearch:latest
```

### Concrete design for this app

Index a course document like:

```json
{
  "id": 42,
  "title": "React Fundamentals",
  "summary": "Build interactive interfaces with components and hooks.",
  "status": "ACTIVE",
  "organizationIds": [1, 2, 3]
}
```

When a course changes:

1. Write to Postgres
2. Insert outbox event
3. Worker consumes event
4. Worker updates Meilisearch

This is a textbook case of eventual consistency.

### What you learn

- Search indexing pipelines
- Derived read models
- Eventual consistency

## 8. Add Enterprise Auth With Keycloak

### Why this matters here

Real enterprise customers usually do not want another username/password database if they can avoid it. They want:

- SSO
- centralized user lifecycle
- MFA
- federation with internal identity providers

`Keycloak` is a strong free tool to learn those concepts locally.

Official docs:

- Keycloak Docker getting started: https://www.keycloak.org/getting-started/getting-started-docker

Simple local container:

```bash
docker run -p 127.0.0.1:8080:8080 ^
  -e KC_BOOTSTRAP_ADMIN_USERNAME=admin ^
  -e KC_BOOTSTRAP_ADMIN_PASSWORD=admin ^
  quay.io/keycloak/keycloak:26.6.0 start-dev
```

### How it would fit Skill Forge

Use Auth.js to add an OIDC provider backed by Keycloak.

Map Keycloak claims to your local app roles:

- `ADMIN`
- `MANAGER`
- `EMPLOYEE`

Good hybrid design:

- Keep app-specific authorization and organization relationships in your own database
- Let Keycloak own authentication, MFA, and identity federation

### What you learn

- OIDC and SSO
- IdP vs application responsibilities
- Role and claim mapping

## A Very Realistic "Enterprise Lite" Starter Stack

If I were turning this project into a serious learning lab, I would build this local stack first:

- `Postgres` for primary relational data
- `Redis` for rate limits, cache, locks, and queue backend
- `BullMQ` for background jobs
- `MinIO` for file/object storage
- `Meilisearch` for search
- `OpenTelemetry` + `Prometheus` + `Grafana` + `Loki` for observability

That gives you a very credible small-enterprise architecture without drifting into unnecessary complexity.

## The Order I Would Implement This In

### Phase 1: Make the current app production-shaped

1. Move sign-in rate limiting to Redis
2. Replace local sign-in log file with structured logs and security events in Postgres
3. Add request IDs and structured logging

### Phase 2: Add async and consistency patterns

1. Add BullMQ
2. Add outbox table
3. Add audit log table
4. Add course revision history

### Phase 3: Improve read performance and scale

1. Cache admin and manager dashboards in Redis
2. Add Meilisearch
3. Add metrics and tracing

### Phase 4: Add enterprise-facing platform capabilities

1. Add MinIO for assets and exports
2. Add Keycloak for SSO
3. Add session revocation and stronger auth controls

## Features I Would Add Inside The App Itself

These are not just infrastructure upgrades. They are good enterprise-grade product features for this exact LMS-style app.

### A. Course versioning and rollback

Admins should be able to:

- see all course revisions
- compare revisions
- restore a previous revision

### B. Audit timeline per entity

For each user, organization, and course:

- show a timeline of changes
- show who performed each action
- link to the related revision or event

### C. Scheduled publishing

Add `publishAt` and `archiveAt` to courses.

Implementation shape:

- admin schedules the change
- BullMQ delayed job executes it
- audit log captures the action
- cache/search invalidation follows

### D. Data export jobs

Examples:

- export organization progress
- export completed-course history
- export lockout/security event report

Store results in MinIO and notify admins when ready.

### E. Security event center

Track:

- repeated failed sign-ins
- account deactivations
- privilege changes
- unexpected access denials

This becomes much more useful than a single local lockout log file.

## What Not To Add Yet

If your goal is learning good systems design, avoid fake-enterprise complexity.

I would explicitly not add these yet:

1. Kubernetes
2. Kafka
3. Microservices
4. Elasticsearch
5. Service mesh

Why:

- They are not the next bottleneck for this app
- They add operational overhead before you have enough traffic or complexity to justify them
- You will learn more by mastering Postgres, Redis, jobs, observability, and identity first

## My Recommended First Redis Learning Project In This Repo

If you only want one hands-on Redis project first, do this:

### Build a shared auth and dashboard performance layer

Implement these three Redis features together:

1. Replace the in-memory sign-in rate limiter with Redis counters and TTLs.
2. Cache `getAdminPlatformSummary()` and `getManagerDashboardData()` for 60 seconds.
3. Add a Redis-backed session-version check so deactivated users can be forced out quickly.

Why this is the best first exercise:

- it is directly relevant to your current code
- it teaches both control-plane and data-plane Redis usage
- it makes the app meaningfully more production-like
- it does not require a huge rewrite

## Sources

These are the official references I used to keep the tool recommendations current and Docker-friendly:

- PostgreSQL Docker image: https://hub.docker.com/_/postgres/
- Redis Docker docs: https://redis.io/docs/latest/operate/oss_and_stack/install/install-stack/docker/
- MinIO container docs: https://min.io/docs/minio/container/index.html
- Prometheus install docs: https://prometheus.io/docs/prometheus/latest/installation/
- Grafana Docker docs: https://grafana.com/docs/grafana/latest/setup-grafana/installation/docker/
- Loki Docker docs: https://grafana.com/docs/loki/latest/setup/install/docker/
- Meilisearch Docker docs: https://www.meilisearch.com/docs/resources/self_hosting/getting_started/docker
- Keycloak Docker docs: https://www.keycloak.org/getting-started/getting-started-docker
- OpenTelemetry Node docs: https://opentelemetry.io/docs/languages/js/getting-started/nodejs/
- BullMQ docs: https://docs.bullmq.io/

