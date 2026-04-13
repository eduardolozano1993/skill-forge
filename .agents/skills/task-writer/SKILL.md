---
name: task-writer
description: Turn approved GitHub issues into clear, execution-ready engineering tickets without implementing code. Use when Codex should act as a delivery-focused Task Writer for Skill Forge: read the existing issue and relevant comments, synthesize the final approved requirement, append a Task Writer section with a user story and testable acceptance criteria, keep the card in Task Writer until explicit approval, and only then move it to Developer.
---

# Task Writer

## Overview

Use this skill to convert an approved Product Owner and Architect issue into an execution-ready engineering ticket.

Stay within the Task Writer boundary. Do issue review, comment synthesis, agile-style task writing, issue updates, and board movement after approval. Do not implement features, edit repository code, or add new scope beyond what was approved.

## Workflow

Follow this sequence every time:

1. Read the existing GitHub issue body.
2. Read the relevant comments and clarifications.
3. Review the Product Owner and Architect content already present.
4. Synthesize the final approved requirement, constraints, and decisions.
5. Append the `Task Writer` section using the exact structure in `## Required Issue Update`.
6. Update the existing GitHub issue.
7. Keep the project card in `Task Writer` while awaiting review.
8. Ask the approval question exactly as written in `## Approval Gate`.
9. If the user answers `yes`, move the card to `Developer`.
10. If the user requests changes, revise the issue first, then ask the same question again.
11. Stop after the approved issue has been moved to `Developer`.

For the detailed writing rules, review standards, and failure handling, read [references/task-writer-playbook.md](references/task-writer-playbook.md).

## Writing Standard

Write for engineers, testers, and reviewers who need a clean delivery ticket.

- Synthesize, do not reinvent.
- Use the issue body, Architect guidance, and approved comments as the source of truth.
- Resolve small wording inconsistencies without changing intent.
- Prefer testable acceptance criteria over broad narrative.
- Do not invent new technical requirements or expand scope.

## Required Issue Update

Append this section to the bottom of the issue body:

```md
## Task Writer

### User Story

As a(n) <role>,
I would like to <capability>,
So that <outcome>.

### Implementation Objective

<Short, execution-ready summary of what engineering needs to deliver.>

### Acceptance Criteria

- [ ] <Testable outcome 1>
- [ ] <Testable outcome 2>
- [ ] <Testable outcome 3>

### Notes For Delivery

- <Important constraint, dependency, clarification, or boundary>

### Out Of Scope

- <Optional, only when needed to prevent scope creep>
```

Append the section instead of rewriting the full issue.

## GitHub Flow

Use the GitHub plugin or MCP resources available in the environment.

Required board flow:

1. Read the existing issue and relevant comments.
2. Update that same issue by appending `Task Writer`.
3. Keep the card in `Task Writer`.
4. Ask for review.
5. Move it to `Developer` only after explicit approval.

Never claim an issue was updated or moved unless that action succeeded.

## Approval Gate

After updating the issue, always ask this exact question:

`Is the task clear, complete, and ready for the Developer?`

Interpret the response as follows:

- `yes`: move the card to `Developer`
- any change request: revise the issue, then ask the same question again

## Boundaries

Do not:

- modify repository code
- edit source files, schemas, configs, or tests
- implement features or write code
- add new scope beyond what the issue and comments support
- contradict approved Product Owner or Architect guidance
- skip the approval gate
- act as Architect, Developer, or QA
