---
name: implement
description: "Implement work from a spec or tickets, verify and review it, then synchronize an active Panel Issue."
disable-model-invocation: true
---

Implement the work described by the user in the spec or tickets.

## Resolve an active Panel Issue

Before editing, prefer the installed model-invoked `manage-panel` Skill when it is available. Call the Skill tool with `manage-panel` when the current harness exposes it. Otherwise locate `manage-panel` in the authoritative available-Skills catalog, read its complete `SKILL.md`, and follow it.

When the task supplies or `manage-panel` confirms an active Panel Issue, let that workflow read the latest issue, comments, attachments, branch, worktree, version, and binding before implementation. Resolve any `Local artifact:` path from the Issue against the repository root and accept it only when it stays under `.scratch/`. Mirror the exact returned Panel identifier and current status to that local ticket. Claim a `todo` Issue through `manage-panel` before editing, using its complete binding and concurrency rules, then set the local `Panel status: in_progress` field from the successful response. Preserve an existing binding owned by this conversation, and never take over another conversation's Issue. Do not create an Issue merely because `implement` was invoked.

A Jira planning conversation is planning-only. Stop before editing and implement the published Panel Issue in its execution conversation instead. When no active Panel Issue exists, continue without Panel mutations. If the task explicitly supplies a Panel Issue but `manage-panel` is unavailable, stop rather than mutating Panel through an improvised path.

Before editing, read the target files, direct callers, exports, shared utilities, and repository instructions needed to understand the real path. Reuse existing patterns. Check official documentation for unfamiliar APIs, and do not add a dependency unless it is necessary and fits the repository.

Keep the settled spec or tickets authoritative. Do not reopen their product decisions. State any assumption that blocks correctness, split the work into the smallest verifiable phases, and keep changes within the requested scope.

## Right-size the run

State the highest matching tier so the user can correct it:

| Tier | Typical shape | Required phases |
| --- | --- | --- |
| Trivial | One obvious local edit, no contract change | Implement, verify, review |
| Small | One function or file, clear after reading | Light plan, implement, verify, review |
| Standard | Several files or one real design choice | Research if needed, plan, implement, verify, review |
| Large | Cross-cutting work, new dependency, public contract, or several open choices | Research, explicit plan, thin vertical slices, implement, verify, review |

Security-sensitive or public-contract changes are at least Standard. Present an explicit plan for Standard and Large work before implementation when the source spec or tickets do not already settle the sequence.

Choose the first implementation move by operation:

- **New behavior:** add one failing test for the first vertical slice, then implement it.
- **Changed behavior:** update the existing behavioral test or add one that expresses the new contract, then change the implementation.
- **Broken behavior:** reproduce the defect with a failing regression test before fixing it. If the root cause is unclear, use `diagnosing-bugs` first.
- **Behavior-preserving refactor:** establish relevant tests are green; add characterization coverage only where behavior is otherwise unprotected, then restructure in small green steps.
- **MVP from a spec:** order the spec into thin end-to-end slices and stand up the first runnable path before broadening it.

Use the installed model-invoked `tdd` Skill when its risk gate applies, at pre-agreed seams. Call the Skill tool with `tdd` when the current harness exposes it. Otherwise locate `tdd` in the authoritative available-Skills catalog, read its complete `SKILL.md`, and apply it directly. Implement the smallest behavior that passes before taking the next slice.

Run focused tests while working. Run the repository's relevant typecheck, lint, build, and broader test gates once the change is stable, proportionate to the affected surface. Report any validation gap explicitly.

Once the candidate is stable, use the installed model-invoked `review` Skill for closeout. Call the Skill tool with `review` when the current harness exposes it. Otherwise locate `review` in the authoritative available-Skills catalog, read its complete `SKILL.md`, and follow it.

Hand `review` the exact comparison base or dirty-worktree candidate, the originating spec or tickets as the acceptance contract, the validation evidence, and the current authorization for fixes. Address accepted blocking findings within scope, then let `review` rerun every required pass invalidated by the repair.

Only when `review` is unavailable through both routes, fall back to the installed `code-review` Skill through the same tool-or-catalog mechanism and report that complementary reviewer orchestration was skipped. Do not improvise a second review workflow.

Before committing, present the stable diff summary and proposed logical commit groups. When the active request authorizes commits, use the installed model-invoked `commit` Skill. Call the Skill tool with `commit` when the current harness exposes it. Otherwise locate `commit` in the authoritative available-Skills catalog, read its complete `SKILL.md`, and apply it directly. Keep independent changes separately reviewable. Do not push or alter remote state unless separately requested.

After validation passes, review closeout has no accepted blocking findings, and any authorized commit is complete, synchronize the active Panel Issue through `manage-panel`. Read its latest version again, add a comment summarizing the key changes, verification, review result, commit references when present, and remaining risks, then move it to `in_review` with the saved complete binding and latest version. After that remote move succeeds, update the matched local ticket to `Panel status: in_review`. Never move it directly to `done`; only explicit user acceptance can complete the Issue.

Panel owns concurrent state, so perform each Panel transition before mirroring it locally. If a remote mutation fails, leave the local status unchanged. If the local mirror update fails after a successful Panel transition, preserve the implementation and remote state, report the exact stale local artifact, and do not claim dual-write completion. Never retry through another tracker.

Apply the same remote-first mirror rule to every later status transition handled in this execution context, including `blocked`, `canceled`, or `done` after explicit user acceptance. Never infer acceptance from self-verification or a clean review.
