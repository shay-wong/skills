---
name: commit
description: Create local git commits from the current repository, defaulting to separate commits for each independent feature, fix, refactor, docs, config, or tooling change while skipping ignored, disposable, secret, or unrelated files. Use when the user invokes commit, /commit, $commit, asks to make a commit, or wants staged/local changes committed safely.
---

# Commit

Create local git commits for the current repository with strict scope control.

## Workflow

1. Inspect the repository state before committing:
   - `/opt/homebrew/bin/git -C "$PWD" status --short --branch`
   - `/opt/homebrew/bin/git -C "$PWD" diff --stat HEAD`
   - `/opt/homebrew/bin/git -C "$PWD" branch --show-current`
   - `/opt/homebrew/bin/git -C "$PWD" log --oneline -5`
2. Determine the commit scope from the user's invocation text. If no scope is provided, include all relevant non-ignored, non-disposable changes that belong to the active task.
3. Classify changes before staging:
   - Commit candidates: non-ignored files that belong to the requested logical change.
   - Skip candidates: Git-ignored local files, secrets, credentials, generated noise, caches, build outputs, logs, and unrelated work.
   - Discard candidates: clearly disposable AI temp files, build side effects, dependency noise, cache churn, generated logs, or accidental cleanup/build churn.
4. Default to splitting commits by function / independent logical change. A "function" can be a user-facing feature, bug fix, refactor, docs update, config change, tooling change, or test-only change with its own reviewable purpose.
5. Create one commit only when all commit candidates are tightly coupled parts of the same logical change, or when the user explicitly asks for one combined commit.
6. If the changes clearly span independent features, fixes, refactors, docs, config, or tooling updates, create separate commits for each group. Do not combine unrelated or merely adjacent work for convenience.
7. If unrelated or non-current-session changes are present, do not silently include them. Ask only when the grouping cannot be safely inferred.
8. Before each commit, stage only the files for that logical group and verify:
   - `/opt/homebrew/bin/git -C "$PWD" diff --cached --stat`
   - `/opt/homebrew/bin/git -C "$PWD" diff --cached --name-only`
9. Create the commit using the commit-message rules that apply to the current repository:
   - Follow the user's explicit instructions first.
   - Follow applicable `AGENTS.md` commit-message rules next.
   - If neither the user nor the repository specifies a language, write commit-message prose in Chinese by default.
   - If no local rule exists, use a concise conventional commit message.
10. After committing, report one concise result including each short hash and any skipped ignored/disposable files.

## Rules

- Prefer `/opt/homebrew/bin/git -C "$PWD" ...` for git commands on this Mac.
- Do not use broad staging unless the user explicitly asked for all relevant changes in one commit and the status has been inspected.
- Treat functional splitting as the default behavior: when in doubt, keep independently reviewable changes in separate commits rather than merging them into a larger mixed commit.
- Default commit messages to Chinese prose unless the user or repository rules explicitly require another language.
- Never stage Git-ignored files, never commit Git-ignored files, and never use `git add -f`.
- Detect ignored files with Git's own ignore resolution when relevant:
  - `/opt/homebrew/bin/git -C "$PWD" status --ignored --short`
  - `/opt/homebrew/bin/git -C "$PWD" ls-files --others --ignored --exclude-standard`
  - `/opt/homebrew/bin/git -C "$PWD" check-ignore -v <path>`
- Preserve user-staged work. If staged files do not match the intended commit group, commit only the intended paths or ask for a grouping decision.
- Do not commit secrets, credentials, generated noise, ignored local state, disposable filesystem churn, or unrelated work.
- If a discard candidate might contain user-authored work, leave it uncommitted and ask before deleting or reverting it.
- Use path-specific cleanup only for proven disposable paths; never widen cleanup beyond the identified files.
