---
name: implement-spec
description: "Implement a non-Panel task graph from /to-spec and /to-tickets on one integration branch."
disable-model-invocation: true
---

You have been provided a spec. This spec should have tickets associated with it, describing how to implement the spec.

Before any Git mutation, use the installed model-invoked `manage-panel` Skill to inspect the current context when it is available. Call the Skill tool with `manage-panel` when the current harness exposes it. Otherwise locate `manage-panel` in the authoritative available-Skills catalog, read its complete `SKILL.md`, and follow it.

If it confirms an active Panel or Jira planning context, stop this workflow before creating a branch or worktree. Panel owns selecting, binding, and dispatching one unblocked leaf Issue at a time; use `implement` for the dispatched Issue so its remote status and `.scratch` mirror stay synchronized. Do not reproduce Panel's parent, blocker, frontier, claim, or dispatch logic here.

Otherwise, use the issue tracker configured for the repository. If it is missing, tell the user to run `/configure-skills`.

The goal is the entire spec implemented on a single **integration branch**, with every ticket resolved the way the issue tracker closes work.

The tickets are not a list of steps. They are a **task graph** with blocking relationships between them. This means there is always a **frontier** of tickets which are ready to be grabbed.

Communication to and from subagents should be sparse. Communicate primarily through **context pointers**: to the spec, tickets, research notes, and previous commits. Don't duplicate information already available via pointers.

**Implementer subagents** should be run in the background where possible for maximum concurrency.

When this workflow calls another model-invoked Skill, use the Skill tool when the current harness exposes it. Otherwise locate the exact Skill in the authoritative available-Skills catalog, read its complete `SKILL.md`, and apply it directly. Report it as unavailable only when neither route can find it.

## Steps

1. Read the spec and tickets to understand the task graph.

2. (optional) Use an **exploration subagent** to conduct any exploration required by the tickets - relevant codebase files or external documentation. Ensure the exploration subagent can save files - it should save its markdown notes in a directory outside the repo, accessible by all future subagents. This lets **implementer subagents** focus on implementation rather than exploration.

3. Create the integration branch. If the issue tracker closes work through PRs, or the user asks for one, open a draft PR after the first merge in step 5 (a branch with no commits ahead of main can't open one), marked as closing the spec and tickets.

4. Use **implementer subagents** to implement each ticket, each in its own worktree on its own branch. Each implementer subagent:
   - confirms its worktree is based on the integration branch before starting, and resets onto it if not;
   - uses the installed model-invoked `tdd` Skill to build the ticket;
   - merges the integration branch tip into its own branch before reporting done

5. Once an **implementer subagent** completes, merge its work to the integration branch with a **merger subagent**.

6. If this changes the **frontier** of available tickets, kick off more **implementer subagents** to work on the new tickets. This allows for maximum concurrency.

7. Once all tickets are complete, use the installed model-invoked `review` Skill for closeout on the integration branch. Give it the frozen candidate, the originating spec and tickets as the acceptance contract, validation evidence, and the current authorization for fixes. Keep `code-review` as the primary Standards and Spec pass inside that orchestration. Fix accepted blocking findings in a single **implementer subagent**, then rerun every required review invalidated by the repair.

8. If a draft PR exists, mark it ready for review. Otherwise, resolve each ticket the way the issue tracker closes work, and report the integration branch.

9. Clean up all **implementer subagent** worktrees.
