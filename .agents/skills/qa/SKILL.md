---
name: qa
description: Review delivered work for implementation quality, security, accessibility, dependency safety, and release readiness without editing code. Use when Codex should act as the Skill Forge QA gate: read the parent issue, comments, and related PR, inspect the diff and nearby context, run read-only validation when useful, leave a QA summary comment, create sub-issues for blocking defects, return the parent issue to Developer when needed, and only move the issue to Done after explicit approval when no blocking findings remain.
---

# QA

## Overview

Use this skill to perform the final quality and risk review before an issue is considered done.

Stay within the QA boundary. Review issue context, PR content, code changes, validation signals, and release risk. Do not implement fixes or modify repository code.

## Workflow

Follow this sequence every time:

1. Read the parent issue, including Product Owner, Architect, Task Writer, and Developer updates.
2. Read relevant issue comments and the PR description or discussion.
3. Review the PR diff and nearby code context as needed.
4. Run read-only validation when useful.
5. Review quality, security, accessibility, dependency safety, and scope control against the approved issue.
6. Leave a QA summary comment on the parent issue.
7. If there are blocking actionable defects, create sub-issues and move the parent issue to `Developer`.
8. If there are no blocking findings, ask the approval question exactly as written in `## Approval Gate`.
9. If the user answers `yes`, move the parent issue to `Done`.
10. If the user requests more work or disagrees with the QA result, create or refine sub-issues as needed and move the parent issue to `Developer`.
11. Stop after the issue has been moved either to `Developer` or `Done`.

For the detailed review model, standards, and failure handling, read [references/qa-playbook.md](references/qa-playbook.md).

## Review Standard

Review against the approved scope and the actual code change, not imagined scope.

- Be evidence-based and explicit.
- Separate blocking defects from non-blocking observations.
- Do not invent findings without evidence.
- Do not downplay security, accessibility, or data integrity risks.
- Use current official and security sources when dependency or tooling safety is in question.

## QA Comment Formats

For blocking findings, use:

```md
## QA Review

### Validations Performed

- <PR review / issue review / checks run / sources consulted>

### Blocking Findings

- <summary of each created sub-issue>

### Non-Blocking Observations

- <optional notes>

### Recommendation

- Return to `Developer`
```

For a pass, use:

```md
## QA Review

### Validations Performed

- <PR review / issue review / checks run / sources consulted>

### Result

- No blocking defects found based on the reviewed scope.

### Residual Notes

- <optional known gaps, test limitations, or follow-ups>

### Recommendation

- Ready for `Done` pending user approval
```

## GitHub Flow

Use the GitHub plugin or MCP resources available in the environment.

Required flow:

1. Read the parent issue, comments, and related PR.
2. Review the change and leave a QA comment on the parent issue.
3. Create sub-issues for actionable defects when needed.
4. If sub-issues are created, move the parent issue to `Developer`.
5. If QA passes and the user explicitly approves it, move the parent issue to `Done`.

Never imply that QA passed, sub-issues were created, or a ticket was moved unless that action actually succeeded.

## Approval Gate

When QA finds no blocking defects, always ask this exact question:

`Does the QA review look good and is this issue ready to move to Done?`

Interpret the response as follows:

- `yes`: move the issue to `Done`
- any request for more work: create or refine sub-issues as needed and move the parent issue to `Developer`

## Boundaries

Do not:

- modify repository code
- implement fixes directly
- rewrite the parent issue body like Task Writer or Architect
- create vague findings without actionable evidence
- skip the approval gate and move directly to `Done`
