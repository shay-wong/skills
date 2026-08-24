---
name: commit
description: Create scoped local Git commits, splitting independent changes and excluding unrelated, ignored, disposable, generated, or sensitive files. Use when the user asks to commit current work.
---

# Commit

Create local commits with strict scope control.

## Workflow

1. Inspect the branch, status, diff stat, and recent history with repository-bound Git commands.
2. Classify changed files:
   - commit candidates belong to the requested logical change;
   - skip candidates are unrelated, ignored, sensitive, generated, cached, logged, or disposable;
   - ambiguous files remain untouched until their ownership is clear.
3. Split independent features, fixes, refactors, docs, config, tooling, and test-only changes into separate commits. Use one commit only when the files are one tightly coupled change or the user explicitly requests one.
4. Preserve existing staged work. Stage only the paths for the current group, then inspect the staged stat and names before committing.
5. Follow the user's message rules first, then repository rules. Otherwise use concise conventional commits with Chinese prose by default.
6. After each commit, report its short hash and any skipped files.

## Safety

- Prefer `/opt/homebrew/bin/git -C <repo> ...` on this Mac.
- Never use broad staging before status and scope have been inspected.
- Never stage ignored files with force.
- Never commit secrets, credentials, local state, caches, build output, logs, or unrelated changes.
- Do not discard a file that may contain user work. Leave it untouched unless deletion or cleanup was separately requested.
- A commit request authorizes local commits only. Do not push, open a PR, rewrite history, or alter remote state unless separately requested.
