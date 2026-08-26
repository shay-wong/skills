---
name: commit
description: Create scoped local Git commits, splitting independent changes and excluding unrelated, ignored, disposable, generated, or sensitive files. Use when the user asks to commit current work.
---

# Commit

Create local commits with strict scope control.

## Workflow

1. Inspect the branch, status, diff stat, and recent history with repository-bound Git commands.
2. Determine the commit scope from the user's request. If no scope is specified, include all relevant non-ignored, non-disposable changes that belong to the active task.
3. Classify changed files:
   - commit candidates belong to the requested logical change;
   - skip candidates are unrelated, ignored, sensitive, generated, cached, logged, or disposable;
   - ambiguous files remain untouched until their ownership is clear.
   If ownership or grouping cannot be safely inferred, ask instead of including questionable files.
4. Split independent features, fixes, refactors, docs, config, tooling, and test-only changes into separate commits. Use one commit only when the files are one tightly coupled change or the user explicitly requests one.
5. Preserve existing staged work. Stage only the paths for the current group, then inspect the staged stat and names before committing. If staged files do not match the group, commit only the intended paths when safe; otherwise ask for a grouping decision.
6. Follow the user's message rules first, then repository rules. Otherwise use concise conventional commits with Chinese prose by default.
7. After each commit, report its short hash and any skipped files.

## Safety

- Use the Git executable resolved from `PATH`, and bind repository operations with `git -C <repo> ...`.
- Never use broad staging before status and scope have been inspected.
- Never stage ignored files or use `git add -f`. When ignored status matters, use Git's own resolution:
  - `git -C <repo> status --ignored --short`
  - `git -C <repo> ls-files --others --ignored --exclude-standard`
  - `git -C <repo> check-ignore -v <path>`
- Never commit secrets, credentials, local state, caches, build output, logs, or unrelated changes.
- Do not discard a file that may contain user work. Leave it untouched unless deletion or cleanup was separately requested.
- A commit request authorizes local commits only. Do not push, open a PR, rewrite history, or alter remote state unless separately requested.
