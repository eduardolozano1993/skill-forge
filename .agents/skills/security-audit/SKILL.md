---
name: security-audit
description: Review code, diffs, features, or repository areas for application security risks across frontend, backend, authentication, session handling, secrets, dependencies, and deployment-facing safeguards. Use when Codex needs a read-only full-stack security audit with OWASP Top 10 and ASVS-aligned checks, concrete evidence, and a structured findings table with severity.
---

# Security Audit

## Overview

Use this skill to perform a read-only security review of code or a targeted area of the repository.

Stay within the audit boundary. Inspect code, configuration, and nearby context. Report confirmed security findings clearly. Do not implement fixes or edit repository files while using this skill unless the user explicitly asks for a separate follow-up change.

## Audit Scope

Evaluate the requested code against the applicable security areas below.

Always evaluate these core areas:

1. `OWASP Top 10`: broken access control, cryptographic failures, injection, insecure design, security misconfiguration, vulnerable and outdated components, identification and authentication failures, software and data integrity failures, security logging and monitoring failures, and SSRF where applicable
2. `OWASP ASVS-Aligned Controls`: authentication, session management, access control, validation, output handling, cryptography, error handling, logging, configuration, and secure development expectations relevant to the reviewed scope
3. `Access Control and Least Privilege`: role enforcement, ownership checks, tenant isolation, IDOR/BOLA risk, unsafe direct object lookups, privilege escalation paths, and over-broad service permissions
4. `Input Validation and Output Encoding`: server-side validation, client-side trust assumptions, SQL/NoSQL/command/template injection defenses, path traversal protections, output encoding, and HTML sanitization
5. `Authentication and Session Management`: login flow integrity, password handling, token issuance and verification, session invalidation, JWT misuse, refresh-token rotation, cookie flags, and CSRF protections where browser sessions are involved
6. `Secrets and Key Handling`: embedded secrets, unsafe environment-variable usage, credential leakage, weak secret rotation assumptions, and misuse of signing or encryption keys
7. `Secure Transport and Browser Protections`: HTTPS assumptions, mixed-content risk, HSTS, CSP, frame-ancestor or clickjacking protections, cache-control for sensitive responses, and safe redirect behavior
8. `Logging, Monitoring, and Error Exposure`: sensitive data leakage in logs, verbose error responses, missing security-relevant audit trails visible in code, and unsafe debug or admin surfaces
9. `Dependency and Supply-Chain Hygiene`: risky or outdated dependency signals visible in manifests or lockfiles, unsafe package usage patterns, unverified script execution, and integrity concerns visible in the reviewed scope

Evaluate these conditional areas only when the reviewed code makes them relevant:

10. `Frontend`: XSS, unsafe HTML rendering, dangerous DOM APIs, insecure browser storage for tokens or PII, client-side auth assumptions, CSRF exposure in browser flows, insecure redirects, unsafe upload/download UX, and exposed secrets in bundles
11. `Backend`: authn/authz gaps, SQL/NoSQL/command/template injection, SSRF, unsafe deserialization, path traversal, file handling risks, rate limiting gaps, insecure defaults, unsafe admin/debug endpoints, and trust-boundary violations
12. `Shared or Platform`: secret management, environment hygiene, data-at-rest and data-in-transit handling visible in code, defense in depth, least privilege, and cross-layer trust assumptions
13. `Operational Signals`: CORS policy, Helmet or equivalent middleware, CSP/HSTS/X-Frame-Options or equivalents, cookie configuration, proxy or TLS assumptions, and deployment or runtime configuration clues that materially affect security posture

Do not score a conditional area unless it clearly applies to the reviewed scope. Exclude non-applicable areas from the pass checklist and from the failure report.

Prioritize confirmed issues that are exploitable, cross trust boundaries, expose sensitive data, or undermine authentication or authorization.

Use the following examples as explicit review prompts when relevant:

- Verify HTTPS enforcement and look for mixed-content or insecure transport assumptions.
- Check for security headers such as CSP, HSTS, and clickjacking protections.
- Check for rate limiting or abuse controls around login, signup, password reset, and public APIs.
- Check for SQL injection defenses such as parameterized queries and validated query inputs.
- Check for XSS prevention through output encoding, safe rendering patterns, and sanitization when HTML is allowed.
- Check for CSRF protections on browser-authenticated state-changing actions.
- Check JWT handling, token storage, revocation strategy, and refresh-token rotation where sessions rely on tokens.
- Check secret management through environment variables, config boundaries, and the absence of hardcoded credentials.

## Workflow

Follow this sequence every time:

1. Read the user-provided files, folders, diff, or repository area under review.
2. Expand context only enough to trace data flow, trust boundaries, authentication, authorization, session behavior, and external input handling.
3. Determine which conditional areas apply to the reviewed code.
4. Evaluate the code against every core area and every conditional area that applies.
5. Separate confirmed findings from weak suspicions or missing context.
6. Prioritize exploitable or high-impact issues first.
7. Produce the audit output using the exact structure in `## Output Format`.

## Evidence Standard

- Cite concrete file paths and line numbers whenever the evidence is localizable.
- Explain why the pattern is a security problem, not just that it is "not ideal."
- Distinguish confirmed findings from missing evidence or limited-scope uncertainty.
- Avoid speculative claims when the code or configuration does not support them.
- If a security area passes, say so plainly.
- Only list security areas that were actually applied during that audit.
- If the code appears acceptable but the review scope is partial, call out the remaining uncertainty explicitly.

## Output Format

Choose the output path based on whether any applied security area failed.

### Pass Case

If all applied security areas pass:

- Return an inline checklist only.
- List each applied area once using this format:
  - `[x] OWASP Top 10: Passed`
  - `[x] Authentication and Session Management: Passed`
- Finish with the exact verdict: `All applied security checks passed. No confirmed violations found.`
- If scope was partial, add one sentence describing what was and was not reviewed.
- Do not create an `.md` file in the pass case.

### Fail Case

If any applied security area fails:

- Create an `.md` file inside `./agents/outputs`.
- Use a timestamped filename such as `security-audit-2026-04-17-1530.md`.
- Write the report using this exact structure:

#### Step 1: Audit Log

List each applied security area once using this format:

- `[x] OWASP Top 10: Passed`
- `[ ] Authentication and Session Management: Failed - refresh tokens are stored without rotation checks in lib/auth/session.ts:48`

Represent the checklist directly in the report. Do not refer to any external or simulated TODO tool.

#### Step 2: Findings Table

If any security area fails, provide a Markdown table with these columns:

| Category | Severity | Location | Issue Description | Why It Matters | Recommended Remediation |
| :------- | :------- | :------- | :---------------- | :------------- | :---------------------- |
| `Authentication and Session Management` | `High` | `lib/auth/session.ts:48` | Refresh tokens are accepted repeatedly without rotation or replay detection. | Token theft can grant long-lived account access even after normal session renewal. | Enforce single-use refresh tokens, store server-side rotation state, and revoke prior tokens on successful refresh. |

Only include rows for actual findings.

#### Step 3: Overall Verdict

Finish with one short paragraph:

- Summarize the highest-risk problems first.
- Mention material scope limits if the audit did not cover the full flow.

After writing the file, return the generated path and a one-sentence summary of the highest-risk issue.

## Boundaries

Do not:

- modify code while acting in audit mode
- claim a vulnerability without evidence
- pad the report with low-value nits when no meaningful issue exists
- treat style preference alone as a security finding
- force a conditional area onto code where it does not apply
- broaden the audit into performance, feature design, or maintainability-only concerns unless they materially affect security
- recommend large architectural changes without explaining the security benefit
