## Skills

A skill is a set of local instructions to follow that is stored in a `SKILL.md` file.

### Available skills

- `product-owner`: Turn rough product ideas into researched, product-justified GitHub issues that are ready for technical review. Use when Codex should act as a Product Owner for Skill Forge: restate an idea as a requirement, assess business value and user impact, research current market patterns, draft the issue in the required format, create it, add it to the Kanban project, keep it in Product Owner until explicit approval, and only then move it to Architect. (file: `.agents\skills\product-owner\SKILL.md`)
- `architect`: Review approved product issues and turn them into technically actionable GitHub issues without implementing code. Use when Codex should act as a software architect for Skill Forge: read an existing issue, restate the technical goal, evaluate whether the current stack is sufficient, decide whether new tooling is justified, append an Architect Review section, keep the card in Architect until explicit approval, and only then move it to Task Writer. (file: `.agents\skills\architect\SKILL.md`)
- `task-writer`: Turn approved GitHub issues into clear, execution-ready engineering tickets without implementing code. Use when Codex should act as a delivery-focused Task Writer for Skill Forge: read the existing issue and relevant comments, synthesize the final approved requirement, append a Task Writer section with a user story and testable acceptance criteria, keep the card in Task Writer until explicit approval, and only then move it to Developer. (file: `.agents\skills\task-writer\SKILL.md`)
- `developer`: Implement approved GitHub issues in code, verify the changes, prepare a reviewable branch and pull request, and hand the work off to QA. Use when Codex should act as the Skill Forge implementation agent: read the approved issue and architect guidance, inspect the codebase, create a branch from develop, make the smallest safe change, run relevant verification, update the issue with a Developer Update, open a PR to develop, wait for explicit approval, and only then move the issue to QA. (file: `.agents\skills\developer\SKILL.md`)
- `qa`: Review delivered work for implementation quality, security, accessibility, dependency safety, and release readiness without editing code. Use when Codex should act as the Skill Forge QA gate: read the parent issue, comments, and related PR, inspect the diff and nearby context, run read-only validation when useful, leave a QA summary comment, create sub-issues for blocking defects, return the parent issue to Developer when needed, and only move the issue to Done after explicit approval when no blocking findings remain. (file: `.agents\skills\qa\SKILL.md`)
- `code-quality-audit`: Review code against DRY, KISS, YAGNI, SOLID, and Clean Code principles. Generate a structured report of findings. Use when you need a high-level code quality audit that goes beyond simple linting or formatting. Focus on maintainability, readability, and adherence to software engineering best practices. (file: `.agents\skills\code-quality-audit\SKILL.md`)

### How to use skills

- If the user names `product-owner` or `$product-owner`, open its `SKILL.md` and follow it.
- If the user names `architect` or `$architect`, open its `SKILL.md` and follow it.
- If the user names `task-writer` or `$task-writer`, open its `SKILL.md` and follow it.
- If the user names `developer` or `$developer`, open its `SKILL.md` and follow it.
- If the user names `qa` or `$qa`, open its `SKILL.md` and follow it.
- If the user names `code-quality-audit` or `$code-quality-audit`, open its `SKILL.md` and follow it.
- Keep the work inside the Product Owner boundary. Do not implement code when using this skill.
- Keep the work inside the Architect boundary. Do not implement code when using this skill.
- Keep the work inside the Task Writer boundary. Do not implement code when using this skill.
- Keep the work inside the Developer boundary. Implement the approved issue, verify it honestly, and wait for approval before moving it to QA.
- Keep the work inside the QA boundary. Review code and delivery risk, but do not implement fixes while using this skill.
- Keep the work inside the Code Quality Audit boundary. Review code and report maintainability findings, but do not implement fixes while using this skill.
