---
name: git-workflow-standards
description: "Apply Shay's git and worktree safety rules: use /opt/homebrew/bin/git -C, safe deletion checks, logical commits, PR diff discipline, and careful agent worktree cleanup. Use for git operations, commits, PRs, branch handling, worktrees, or filesystem cleanup."
---

# Git Workflow Standards

Use this skill for git operations, PRs, branch handling, worktrees, or deletion/cleanup tasks.

## Git Executable

- Prefer `/opt/homebrew/bin/git -C <repo> ...` for shell git commands on this Mac.
- Do not rely on the current shell directory for cross-repo or worktree operations.
- Do not default to `/usr/bin/git` unless Homebrew Git is unavailable and the fallback is stated.

## Commit and PR Basics

- For commits, use the active repo's `AGENTS.md` commit protocol first. If none exists, use concise conventional commit messages.
- Stage only the files that belong to the current logical change.
- Before PR summaries, inspect full branch history, not just the latest commit.
- Use `/opt/homebrew/bin/git -C <repo> diff <base>...HEAD` to summarize branch changes.
- Include a concrete test plan or known validation gaps.
- Push with `-u` for new branches when pushing is requested.

## Merge Conflict Resolution

- During merge, rebase, or cherry-pick, distinguish additive or compatible changes from functionally incompatible behavior.
- If both sides change the same feature and the behavior cannot coexist, stop, identify the conflicting behavior, and ask Shay which side to keep before resolving.
- Default to preserving Shay's existing or currently requested changes only when doing so does not silently decide an incompatible behavior conflict.
- Do not finish an incompatible same-feature conflict with best-effort synthesis unless Shay explicitly authorizes autonomous resolution.

## Deletion Safety

Before any deletion command, including `rm`, `git rm`, `find -delete`, cleanup scripts, or tool-assisted deletion:

- Confirm `pwd` or `/opt/homebrew/bin/git -C <repo> rev-parse --show-toplevel` is the intended repo/root.
- Prefer absolute paths or `git -C <repo>` bound commands.
- If using relative paths, list or verify the resolved targets first.
- For directories, globs, bulk matches, and worktree cleanup, inspect the concrete path set before deleting.
- If current path, repo root, worktree, or target scope is uncertain, stop and ask.

## Agent Worktree Cleanup

- Only clean worktrees returned by the current repo's `git worktree list`; do not cross-repo scan.
- Prefer a fast path for clean or disposable-only agent worktrees.
- Treat `.omc/`, `.claude/`, `.codex/`, `.gemini/`, `.aider/`, `.hook-paused`, `.aider.chat.history.md`, `.aider.input.history`, and `.aider.tags.cache.v4` as disposable agent state only after confirming no product/business files changed.
- If a lock PID is stale, unlock then remove and prune.
- If a clean worktree is locked by the current controller process, unlock/remove without killing that controller.
- If business files changed, a live PID is unclear, a branch is non-temporary, or ownership is ambiguous, inspect process/tmux/session metadata or ask before force operations.
- Only explicit `force` or `强制` with a clear target scope authorizes destructive cleanup that skips normal safety checks.
