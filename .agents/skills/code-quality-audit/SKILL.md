---
name: code-quality-audit
description: Review code against DRY, KISS, YAGNI, SOLID, Clean Code, Coupling & Cohesion, and Law of Demeter, plus ACID and Tell, Don't Ask when relevant. Use when Codex needs a high-signal code quality audit that goes beyond linting or formatting and should focus on maintainability, readability, design quality, and transactional integrity risks in applicable code paths.
---

# Code Quality Audit

## Overview

Use this skill to perform a read-only engineering quality review of code or a targeted area of the repository.

Stay within the audit boundary. Inspect code, evaluate maintainability, and report findings clearly. Do not implement fixes or edit repository files while using this skill unless the user explicitly asks for a separate follow-up change.

## Audit Scope

Evaluate the requested code against the applicable standards below.

Always evaluate these core standards:

1. `DRY`: duplicated logic, repeated branching, repeated data-shaping, or copy-pasted structures that should be centralized
2. `KISS`: unnecessary complexity, clever but hard-to-maintain logic, avoidable indirection, or abstractions that do not pay for themselves
3. `YAGNI`: dead code, speculative extension points, unused helpers, stale comments, or premature generalization
4. `SOLID`:
   - `S`: functions, modules, or classes doing too many unrelated jobs
   - `O`: changes that require repeated modification instead of extension through clear seams
   - `L`: subtype or contract violations that make callers unsafe
   - `I`: oversized interfaces, props, or APIs that force consumers to depend on unused surface area
   - `D`: high-level behavior coupled directly to low-level details that should be inverted
5. `Clean Code`: naming, readability, intent clarity, function size, local comprehensibility, and clarity of intent
6. `Coupling & Cohesion`: mixed responsibilities, hidden dependency coordination, excessive cross-layer knowledge, or modules that are hard to change safely because behavior is scattered
7. `Law of Demeter`: deep object navigation, reach-through calls, or callers that know too much about nested internals

Evaluate these conditional standards only when the reviewed code makes them relevant:

8. `ACID`: apply only to transactions, multi-step writes, repository or service persistence flows, or consistency-sensitive state changes. Look for partial-write risk, broken rollback assumptions, inconsistent state transitions, or business operations that are not truly atomic.
9. `Tell, Don't Ask`: apply when callers read raw state and implement business behavior externally instead of delegating behavior to the owning type or module. Skip this check for DTO-heavy, selector-heavy, or intentionally functional code where the pattern is expected.

Do not score a conditional standard unless it clearly applies to the reviewed code. Exclude non-applicable standards from the pass checklist and from the failure report.

Prioritize `SOLID`, `DRY`, `Coupling & Cohesion`, and `ACID` when data integrity is at risk because they usually carry the highest long-term maintenance cost.

## Workflow

Follow this sequence every time:

1. Read the user-provided files, folders, diff, or repository area under review.
2. Expand context just enough to understand nearby callers, helpers, types, and data flow.
3. Determine whether `ACID` and `Tell, Don't Ask` apply to the reviewed code before scoring them.
4. Evaluate the code against every core standard and every conditional standard that applies.
5. Separate confirmed findings from weak suspicions. Do not invent issues to fill the template.
6. Prioritize the most important maintainability risks first.
7. Produce the audit output using the exact structure in `## Output Format`.

## Evidence Standard

- Cite concrete file paths and line numbers whenever the evidence is localizable.
- Explain why the pattern is a problem, not just that it "could be improved."
- Prefer actionable refactoring guidance over vague advice.
- If a standard passes, say so plainly.
- Only list standards that were actually applied during that audit.
- If the code is acceptable but there is residual uncertainty because review scope was limited, call that out explicitly.

## Output Format

Choose the output path based on whether any applied standard failed.

### Pass Case

If all applied standards pass:

- Return an inline checklist only.
- List each applied standard once using this format:
  - `[x] DRY: Passed`
  - `[x] Coupling & Cohesion: Passed`
- Finish with the exact verdict: `All applied standards passed. No violations found.`
- If scope was partial, add one sentence describing what was and was not reviewed.
- Do not create an `.md` file in the pass case.

### Fail Case

If any applied standard fails:

- Create an `.md` file inside `./agents/outputs`.
- Use a timestamped filename such as `code-quality-audit-2026-04-17-1530.md`.
- Write the report using this exact structure:

#### Step 1: Audit Log

List each applied standard once using this format:

- `[x] DRY: Passed`
- `[ ] DRY: Failed - duplicate pricing logic in lib/pricing.ts:18 and lib/tax.ts:22`

Represent the checklist directly in the report. Do not refer to any external or simulated TODO tool.

#### Step 2: Findings Table

If any standard fails, provide a Markdown table with these columns:

| Standard | Location            | Issue Description                                              | Why It Matters                                      | Recommended Refactoring                                                                    |
| :------- | :------------------ | :------------------------------------------------------------- | :-------------------------------------------------- | :----------------------------------------------------------------------------------------- |
| `DRY`    | `lib/pricing.ts:18` | Two functions duplicate the same discount normalization logic. | Bug fixes must be repeated and are likely to drift. | Extract a shared helper such as `normalizeDiscountInput()` and reuse it from both callers. |

Only include rows for actual findings.

#### Step 3: Overall Verdict

Finish with one short paragraph:

- Summarize the highest-risk problems first.
- If scope was partial, add one sentence describing what was and was not reviewed.

After writing the file, return the generated path and a one-sentence summary of the highest-risk issue.

## Boundaries

Do not:

- modify code while acting in audit mode
- claim a violation without evidence
- pad the report with low-value nits when no meaningful issue exists
- treat style preference alone as a design violation
- force `ACID` or `Tell, Don't Ask` onto code where they do not apply
- broaden the audit into security, operations, or distributed-systems frameworks unless the user explicitly asks for that scope
- recommend large refactors without explaining the concrete maintenance benefit
