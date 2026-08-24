---
name: agent-rules
description: Apply Shay's migrated Claude natural-language rules for coding, development workflow, review, testing, TypeScript/JavaScript, git, deletion safety, and worktree cleanup. Use when the user asks about migrated rules, coding standards, review standards, TDD/testing expectations, TypeScript rules, or git/worktree safety.
---

# Agent Rules

This is the discoverable entry point for Shay's migrated Claude natural-language rules. Use it as the umbrella skill, then load the focused sibling skill that matches the task:

- Coding and refactoring: [`personal-coding-standards`](../personal-coding-standards/SKILL.md)
- Feature workflow and implementation planning: [`personal-development-workflow`](../personal-development-workflow/SKILL.md)
- Code review: [`review-standards`](../review-standards/SKILL.md)
- Testing and TDD: [`testing-standards`](../testing-standards/SKILL.md)
- TypeScript/JavaScript: [`typescript-standards`](../typescript-standards/SKILL.md)
- Git, deletion safety, PRs, and worktrees: [`git-workflow-standards`](../git-workflow-standards/SKILL.md)

## Always-On Summary

- Keep `AGENTS.md` short; do not copy long rule files into it.
- Respond to Shay in Chinese by default unless he asks otherwise.
- Prefer existing repo patterns, official docs for unfamiliar APIs, and proven libraries before hand-rolled code.
- Ground conclusions in current files, structured retrieval/search, tool output, official docs, or explicit assumptions.
- Keep implementations small, readable, immutable where practical, explicitly validated, and explicitly error-handled.
- Treat external model or agent code as prototype only; the active Codex session owns final edits, simplification, and verification.
- For risky behavior changes and bug fixes, lock behavior with focused tests before broad refactors.
- Review security-sensitive code first: auth, input handling, database queries, filesystem paths, external APIs, crypto, payments, and sensitive user data.
- For JS/TS, avoid `any`, type public APIs, validate unknown input, and remove production `console.log`.
- For git and deletion work, prefer `/opt/homebrew/bin/git -C <repo> ...`, stage only logical groups, verify before committing, inspect concrete paths before deletion, and ask Shay before resolving incompatible same-feature merge conflicts.

## How to Use

When a task matches a domain above, read the corresponding focused skill before acting. If multiple domains apply, read the smallest set needed. Do not load all focused skills unless the task genuinely spans all of them.
