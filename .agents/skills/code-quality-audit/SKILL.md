---
name: code-quality-audit
description: Review code against DRY, KISS, YAGNI, SOLID, and Clean Code principles. Generate a structured report of findings. Use when you need a high-level code quality audit that goes beyond simple linting or formatting. Focus on maintainability, readability, and adherence to software engineering best practices.
---

# Code Quality Audit

## Overview

Use this skill to perform a read-only engineering quality review of code or a targeted area of the repository.

Stay within the audit boundary. Inspect code, evaluate maintainability, and report findings clearly. Do not implement fixes or edit repository files while using this skill unless the user explicitly asks for a separate follow-up change.

## Audit Scope

Evaluate the requested code against these standards:

1. `DRY`: duplicated logic, repeated branching, repeated data-shaping, or copy-pasted structures that should be centralized
2. `KISS`: unnecessary complexity, clever but hard-to-maintain logic, avoidable indirection, or abstractions that do not pay for themselves
3. `YAGNI`: dead code, speculative extension points, unused helpers, stale comments, or premature generalization
4. `SOLID`:
   - `S`: functions, modules, or classes doing too many unrelated jobs
   - `O`: changes that require repeated modification instead of extension through clear seams
   - `L`: subtype or contract violations that make callers unsafe
   - `I`: oversized interfaces, props, or APIs that force consumers to depend on unused surface area
   - `D`: high-level behavior coupled directly to low-level details that should be inverted
5. `Clean Code`: naming, readability, intent clarity, function size, cohesion, and local comprehensibility

Prioritize `SOLID` and `DRY` when ranking findings because they usually have the highest long-term maintenance cost.

## Workflow

Follow this sequence every time:

1. Read the user-provided files, folders, diff, or repository area under review.
2. Expand context just enough to understand nearby callers, helpers, types, and data flow.
3. Evaluate the code against `DRY`, `KISS`, `YAGNI`, `SOLID`, and `Clean Code`.
4. Separate confirmed findings from weak suspicions. Do not invent issues to fill the template.
5. Prioritize the most important maintainability risks first.
6. Produce the audit output using the exact structure in `## Output Format`.

## Evidence Standard

- Cite concrete file paths and line numbers whenever the evidence is localizable.
- Explain why the pattern is a problem, not just that it "could be improved."
- Prefer actionable refactoring guidance over vague advice.
- If a standard passes, say so plainly.
- If the code is acceptable but there is residual uncertainty because review scope was limited, call that out explicitly.

## Output Format

Always structure the response in this order.

### Step 1: Audit Log

List each standard once using this format:

- `[x] DRY: Passed`
- `[ ] DRY: Failed - duplicate pricing logic in lib/pricing.ts:18 and lib/tax.ts:22`

Represent the checklist directly in the response. Do not refer to any external or simulated TODO tool.

### Step 2: Findings Table

If any standard fails, provide a Markdown table with these columns:

| Standard | Location | Issue Description | Why It Matters | Recommended Refactoring |
| :-- | :-- | :-- | :-- | :-- |
| `DRY` | `lib/pricing.ts:18` | Two functions duplicate the same discount normalization logic. | Bug fixes must be repeated and are likely to drift. | Extract a shared helper such as `normalizeDiscountInput()` and reuse it from both callers. |

Only include rows for actual findings.

### Step 3: Overall Verdict

Finish with one short paragraph:

- If there are findings, summarize the highest-risk problems first.
- If everything passed, state exactly: `All standards passed. No violations found.`
- If scope was partial, add one sentence describing what was and was not reviewed.

## Boundaries

Do not:

- modify code while acting in audit mode
- claim a violation without evidence
- pad the report with low-value nits when no meaningful issue exists
- treat style preference alone as a design violation
- recommend large refactors without explaining the concrete maintenance benefit
