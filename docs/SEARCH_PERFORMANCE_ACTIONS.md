# Users Search Performance Actions

## Current Implementation

- The admin users table at `/admin/users` uses server-side pagination with a default page size of 10.
- Search is executed in the database through Prisma with case-insensitive `contains` matching on `users.name` and `users.email`.
- The current schema keeps:
  - A unique index on `users.email`.
  - An index on `users.organization_id` for relationship-heavy admin listing paths.
- Plain `contains` search is flexible, but it can become slower as the `users` table grows because broad substring matches often do not benefit much from standard B-tree indexes.

## Measure Before Changing Anything

1. Record table size and growth rate.
   - Track total rows in `users`.
   - Note how quickly new users are being added each week or month.
2. Capture actual slow queries.
   - Use Postgres slow query logs, APM traces, or application timing around the users search request.
   - Separate cold-cache and warm-cache timings if possible.
3. Run `EXPLAIN ANALYZE` for representative searches.
   - Test a broad term like `a`.
   - Test a medium-selectivity term like part of a common first name.
   - Test a highly selective email fragment.
4. Confirm whether the slowdown is in search, sorting, counting, or rendering.
   - Search latency and count latency may diverge once the table grows.

## Immediate App-Level Mitigations

1. Lower the page size.
   - This reduces the row payload and can help perceived responsiveness.
   - It will not fix a slow `count()` or a fundamentally expensive search predicate.
2. Require a minimum search length.
   - Reject or ignore extremely broad inputs such as one-character queries.
   - This is often the fastest low-risk mitigation if product requirements allow it.
3. Increase client-side debounce on the search input.
   - Fewer requests means fewer repeated DB hits while a user is still typing.
4. Narrow the product scope of the search.
   - If acceptable, search only email or only name in high-traffic admin flows.

## Database Improvements

1. Add trigram search support when substring search must remain.
   - Enable the Postgres `pg_trgm` extension.
   - Add trigram indexes for `users.name` and `users.email`.
   - This is the most likely next step if `contains` search becomes a persistent bottleneck.
2. Consider expression indexes only if the query shape changes.
   - For example, if the search moves to normalized lowercase equality or prefix matching.
3. Revisit ordering indexes if the sort changes.
   - Add a sort-focused index only when query plans show sorting is a real bottleneck.
   - If the UI starts sorting by created date, name, or email at scale, add indexes for that actual access pattern.

## Query Strategy Alternatives

1. Switch from `contains` to prefix matching.
   - Prefix search is usually easier to optimize than full substring search.
   - This changes behavior and should be validated with users first.
2. Split search modes.
   - Example: keep partial email search, but make name search prefix-only.
   - This can preserve most usability while reducing the worst-case workload.
3. Move to full-text search only if ranking becomes a real requirement.
   - Full-text search helps with relevance-style queries.
   - It is not automatically the best replacement for exact email fragment lookup.

## Operational Actions

1. Keep planner statistics fresh.
   - Run `ANALYZE` regularly or confirm autovacuum is healthy.
2. Maintain storage health.
   - Use `VACUUM` and, when justified, `REINDEX` for persistent bloat or degraded index efficiency.
3. Validate improvements after each change.
   - Compare `EXPLAIN ANALYZE` output before and after.
   - Compare p95 and p99 request latency, not only average latency.

## Migration vs App-Only Changes

- App-only changes:
  - Lower page size.
  - Increase debounce.
  - Enforce a minimum search length.
  - Change search semantics from substring to prefix or exact match.
- Migration-required changes:
  - Adding or changing indexes.
  - Enabling `pg_trgm`.
  - Adding expression indexes or specialized search structures.
