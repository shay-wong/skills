## What it does

`worktree-clean` audits registered worktrees for one repository and removes only candidates proven unused. It checks task ownership, Git content, ignored files, processes, locks, commits and branches before deletion.

It never deletes the calling task's active checkout. When that exact path is targeted, it stops with `HANDOFF_REQUIRED` so the task can move to Local first.

## When to reach for it

Type `/worktree-clean`, or let the agent reach for it when you ask to reclaim worktree disk space or remove stale agent worktrees.

Use [resolving-merge-conflicts](https://aihero.dev/skills-resolving-merge-conflicts) when unfinished work must be integrated. This Skill cleans only worktrees whose useful work and ownership are already settled.

## Proof before removal

The candidate must be registered, different from the active checkout, unused by a live task or process, free of unknown business changes, and safe for its branch and commits to disappear or detach.

## Common questions

**Does ignored mean disposable?**

No. Ignored business files are preserved and verified before cleanup. Only proven dependency, build or agent caches are discarded automatically.

**Can force mode remove everything?**

Only inside the exact same-repository target scope named in the request. It does not authorize a cross-repository scan.

## It's working if

- Every removed path appears in the repository's registered worktree list first.
- Every skipped candidate has a concrete blocking reason.
- The final worktree list, retained branches and Local status are re-read after cleanup.

## Where it fits

`worktree-clean` is standalone repository maintenance after work is merged, abandoned or handed off. [ask-matt](https://aihero.dev/skills-ask-matt) routes active implementation and conflict work before cleanup.
