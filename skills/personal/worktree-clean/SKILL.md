---
name: worktree-clean
description: "Safely audit and remove unused Codex or agent worktrees for the current Git repository. Require App Handoff to Local only when the cleanup target includes the calling task's current checkout; use for leaving, cleaning, pruning, or reclaiming disk, not for merging unfinished work."
---

# Worktree Clean

Load `$git-workflow-standards` before any Git or deletion action. Resolve cleanup targets first, then require Handoff only when necessary; this skill cannot move the calling task by itself.

## Required outcome

- If a cleanup target is the calling task's active worktree, finish its pre-Handoff audit and stop with `HANDOFF_REQUIRED`; do not delete it while active.
- If every target differs from the active checkout, keep the task where it is and clean only targets proven unused.
- After the same task resumes in **Local**, remove its former worktree only when it is proven unused.
- Other same-repository worktrees are removed only when independently proven unused.
- Final results are reported in Chinese.

The current App tool can hand off another task but cannot move the calling task. When the active checkout itself is a cleanup target, and until an official current-task Handoff action is exposed, never emulate self-Handoff with `cd`, `git checkout`, `mv`, a new shell, UI automation, or deletion of the current working directory. Those actions either do not change the checkout bound to the task or interrupt execution without a reliable continuation contract.

## Scope and modes

- With no target, handle the current task's former worktree first, then audit clearly agent-managed worktrees from the same repository.
- A target may be an exact registered worktree path, branch, or unique substring from `git worktree list --porcelain`.
- Never scan unrelated repositories.
- Skip Handoff when every resolved target differs from the active checkout.
- `force` or `强制` applies only when the same request names an exact target or explicitly says `all`. It authorizes destructive cleanup within that resolved scope, not a cross-repository scan.

## Phase 1: Resolve targets and Handoff need

1. Resolve and record:
   - the repository root and current checkout root;
   - the absolute Git common directory;
   - the Local checkout path;
   - `git worktree list --porcelain` for this repository;
   - the current worktree path and branch or detached commit.
2. Resolve the requested candidates before deciding whether Handoff is needed. With no target, treat the calling task's current managed worktree as the primary candidate; when already in Local, audit clearly agent-managed same-repository worktrees.
3. If every candidate differs from the active checkout, continue directly to Phase 2. The task may remain in Local or another worktree while acting as the cleanup controller.
4. If a candidate is the active worktree, inventory its tracked, untracked, and ignored files before Handoff. Do not print secret contents. Handoff moves Git state, but ignored files move only when covered by `.worktreeinclude`; record any ignored business files that must be preserved before deletion.
5. Report `HANDOFF_REQUIRED`, show the active worktree and Local paths, and tell the user to select **Hand off -> Local** in this task's header. End the turn without deleting anything.
6. After the same task resumes in Local, re-resolve the environment and continue with Phase 2 without repeating already answered questions.

Do not call `codex_app__handoff_thread` on the calling task, create a controller task, or stash, reset, discard, commit, or remove files merely to work around the self-Handoff boundary unless the user separately requests that exact action.

## Phase 2: Prove the old worktree is unused

Re-resolve the repository before cleanup. If a candidate was the task's active worktree, continue only after the task is running in the recorded Local checkout. Otherwise the task may remain in its current checkout, provided no candidate equals the active cwd. If no prior path was recorded, do not guess which worktree belonged to the task; audit clearly agent-managed same-repository candidates independently.

For every candidate, require evidence in all relevant categories:

- **Registration:** the exact path is still returned by this repository's `git worktree list --porcelain`. Never remove the Local checkout or the active cwd.
- **Task ownership:** the just-completed Handoff is sufficient evidence that this task no longer executes in its former worktree. For other candidates, inspect available Codex task metadata. Skip worktrees tied to running or pinned tasks. If reliable task-to-path mapping is unavailable, report that gap and do not infer that a candidate is unused from silence alone.
- **Worktree kind:** skip permanent or user-maintained worktrees unless the user named the exact target. Prefer Codex-managed or clearly temporary agent worktrees.
- **Git content:** inspect tracked and untracked status. Product, business, documentation, config, schema, generated source, tests, or unknown changes block default cleanup.
- **Ignored content:** ignored does not mean disposable. Preserve needed ignored files in Local and verify the destination, using checksums when copying business artifacts. Known dependency, build, and agent caches may be discarded only after confirming no business files are mixed into them.
- **Processes and locks:** skip a candidate used by a live process or task. A stale lock may be unlocked. Follow `$git-workflow-standards` for controller-owned locks and ambiguous ownership.
- **Commits and branches:** verify that removing the worktree will not make wanted commits unreachable. Delete an attached temporary branch only when it is merged or otherwise proven disposable; keep an unmerged branch by default.

Do not archive the current task merely to trigger automatic cleanup. Do not rely on the App's recoverable snapshot guarantee for a worktree removed manually with Git.

## Cleanup

An explicit cleanup request authorizes automatic removal of candidates that pass every default-mode check. Ask only for candidates whose data, ownership, or destructive scope remains ambiguous.

For each safe candidate:

1. Unlock only a proven stale or permitted controller-owned lock.
2. Run `/opt/homebrew/bin/git -C <local-checkout> worktree remove <candidate>`.
3. Use `worktree remove --force` only for proven disposable-only residue or explicit force mode.
4. Delete only a proven disposable temporary branch, preferring `branch -d`; do not escalate to `branch -D` in default mode.
5. Run `/opt/homebrew/bin/git -C <local-checkout> worktree prune --verbose` once after the batch.
6. Re-read `worktree list --porcelain`, Local status, and retained branches to verify the result.

In force mode, first show the exact resolved candidates. Terminate only processes whose cwd is inside those candidates, then unlock, force-remove, clean proven matching temporary branches, and prune. Report that normal content and ownership protections were bypassed.

## Report

In Chinese, report:

- `HANDOFF_REQUIRED` only when a target is the active worktree; otherwise report the controller checkout path;
- removed worktrees and branches;
- preserved or migrated ignored files;
- skipped candidates with the exact blocking evidence;
- final worktree list and validation gaps.
