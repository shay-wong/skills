---
name: worktree-clean
description: Safely audit and remove unused Codex or agent worktrees for the current Git repository. Use for leaving, cleaning, pruning, or reclaiming worktree disk space, not for merging unfinished work.
---

# Worktree Clean

Resolve cleanup targets first, then require Handoff only when a target is this task's active checkout. This skill cannot move the calling task by itself.

## Required outcome

- If a cleanup target is the active worktree, finish the pre-Handoff audit and stop with `HANDOFF_REQUIRED`. Do not delete it while active.
- If every target differs from the active checkout, keep the task where it is and clean only targets proven unused.
- After the same task resumes in Local, remove its former worktree only when it is proven unused.
- Other same-repository worktrees are removed only when independently proven unused.
- Report final results in Chinese.

## Git and deletion safety

- Use the Git executable resolved from `PATH`, and bind every Git operation to the resolved repository with `git -C <repo> ...`.
- Resolve every exact worktree path before deletion. Never widen an ambiguous path, substring, glob, or `all` request across repositories.
- Inspect tracked, untracked, and ignored content. Ignored does not mean disposable.
- Skip live, pinned, user-maintained, ownership-ambiguous, or unmerged worktrees by default.
- A stale lock may be unlocked only after its process and task ownership are checked.
- `force` or `强制` applies only to the exact target or explicit same-repository `all` scope named in the same request.

## Resolve targets and Handoff need

1. Resolve the repository root, active checkout, Git common directory, Local checkout, and `git worktree list --porcelain`.
2. Resolve the requested path, branch, or unique registered-worktree substring before deciding whether Handoff is needed.
3. If every target differs from the active checkout, continue directly to the audit.
4. If a target is active, inventory its tracked, untracked, and ignored files without printing secrets. Record ignored business files that `.worktreeinclude` will not carry.
5. Report `HANDOFF_REQUIRED`, show the active and Local paths, and tell the user to select **Hand off -> Local** in this task's header. End without deleting anything.
6. After resume in Local, re-resolve the environment before cleanup.

Do not emulate self-Handoff with `cd`, checkout, move, a new shell, UI automation, or deletion of the current directory. Do not stash, reset, discard, commit, or remove files merely to bypass Handoff unless separately requested.

## Prove each candidate is unused

Require applicable evidence for:

- **Registration:** the exact path is still registered; never remove Local or the active checkout.
- **Task ownership:** skip worktrees tied to running or pinned tasks. If task-to-path mapping is unavailable, report the gap rather than infer inactivity.
- **Worktree kind:** skip permanent or user-maintained worktrees unless explicitly named.
- **Content:** product, business, docs, config, schema, generated source, tests, or unknown changes block default cleanup.
- **Ignored content:** preserve needed files and verify their destination; discard only proven dependency, build, or agent caches.
- **Processes and locks:** skip live or ambiguous users of the path.
- **Commits and branches:** preserve wanted commits; delete a temporary branch only when merged or otherwise proven disposable.

## Cleanup

For each candidate that passes every check:

1. Unlock only a proven stale or permitted controller-owned lock.
2. Run `git -C <local-checkout> worktree remove <candidate>`.
3. Use `--force` only for proven disposable residue or explicit force mode.
4. Delete only a proven disposable temporary branch, preferring `branch -d`.
5. Run `worktree prune --verbose` once after the batch.
6. Re-read the worktree list, Local status, and retained branches.

In force mode, first show the exact resolved candidates. Terminate only processes whose cwd is inside them, then unlock, force-remove, clean proven temporary branches, and prune. Report which normal protections were bypassed.

## Report

Report removed worktrees and branches, preserved files, exact skip reasons, the final worktree list, and remaining validation gaps.
