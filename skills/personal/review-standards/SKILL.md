---
name: review-standards
description: "Perform or prepare code review using Shay's standards: security first, correctness, tests, maintainability, performance, and merge-blocking severity. Use when reviewing code, PRs, diffs, or recently modified files."
---

# Review Standards

Use this skill for code review, PR review, reviewing a working tree, or checking recently modified code before commit.

## Review Triggers

Review is expected after writing or modifying code, before committing shared-branch work, for security-sensitive changes, for architecture changes, and before merging PRs.

## Checklist

- Code is readable and well named.
- Functions are focused and files are cohesive.
- Deep nesting is avoided.
- Errors are handled explicitly.
- Inputs and external data are validated.
- No hardcoded secrets, credentials, or private tokens.
- No debug `console.log` or equivalent production debug output.
- Tests cover new or changed behavior.
- Verification evidence matches the risk of the change.

## Security Triggers

Escalate scrutiny when changes touch:

- Authentication or authorization.
- User input handling.
- Database queries.
- File system operations.
- External API calls.
- Cryptography.
- Payment, financial, or sensitive user data.

## Severity

- `CRITICAL`: security vulnerability, data loss, production breakage, or correctness bug with severe impact. Block.
- `HIGH`: significant bug, build/test breakage, or likely user-facing regression. Should fix before merge.
- `MEDIUM`: maintainability, edge-case, or design concern. Consider fixing.
- `LOW`: style, nit, or optional suggestion.

## Findings Format

For review output, lead with findings ordered by severity. Include precise file and line references when available. Keep summaries secondary. If no issues are found, say so and state remaining test gaps or residual risk.

## Common Issues

- SQL injection through string-concatenated queries.
- XSS through unescaped user content.
- Path traversal through unsanitized file paths.
- Missing CSRF or authorization checks.
- N+1 or unbounded queries.
- Missing pagination.
- Hidden mutation where immutable patterns are expected.
- Missing regression tests for changed behavior.
