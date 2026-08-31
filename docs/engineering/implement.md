## What it does

`implement` builds work that has already been decided. You point it at a [ticket](https://www.aihero.dev/ai-coding-dictionary/ticket), a [spec](https://www.aihero.dev/ai-coding-dictionary/spec), or the plan you just agreed in the conversation. It right-sizes the run, builds thin vertical slices, drives [tdd](https://aihero.dev/skills-tdd) where the risk gate applies, verifies the stable change, closes through [review](https://aihero.dev/skills-review), and commits only when the active request authorizes it. When the run owns an active Panel Issue, it also uses the installed `manage-panel` workflow to claim the work and move the verified result to `in_review`.

It never reopens the plan. There is no interview, no clarifying round, no proposal of a different approach. Whatever was settled upstream is the input, and the skill's whole job is to turn that into a commit. That is what separates it from typing "build this" at a fresh [agent](https://www.aihero.dev/ai-coding-dictionary/agent), which will happily redesign the work while it builds it.

## When to reach for it

You invoke this by typing `/implement` yourself: the agent won't reach for it on its own. It ships with `disable-model-invocation: true`, so no other skill can call it either. Wherever [ask-me](https://aihero.dev/skills-ask-me) or [to-tickets](https://aihero.dev/skills-to-tickets) says "then `/implement` per ticket", that is an instruction to you, not something the agent will do unprompted.

Where the work currently lives decides whether this is the right skill:

| The work is… | Reach for |
| --- | --- |
| A ticket on the tracker | `/implement #42`, one ticket per [session](https://www.aihero.dev/ai-coding-dictionary/session), [clearing](https://www.aihero.dev/ai-coding-dictionary/clearing) context between tickets |
| A spec, not yet split up, and the build spans sessions | [to-tickets](https://aihero.dev/skills-to-tickets) first, then `/implement` per ticket |
| A spec, and the build is small | `/implement` directly against the spec |
| Only in the conversation you just had, and it's still small | `/implement` right there, in the same window |
| Not written down anywhere yet | [grill-with-docs](https://aihero.dev/skills-grill-with-docs), or [grill-me](https://aihero.dev/skills-grill-me) if there's no codebase |
| One concrete behaviour you want test-first, with no spec | [tdd](https://aihero.dev/skills-tdd) directly |
| Already built, and you want a general check | [review](https://aihero.dev/skills-review) directly |
| Already built, and you only want Standards + Spec | [code-review](https://aihero.dev/skills-code-review) directly |

The same-session case is worth naming because the skill's own first line doesn't cover it. `SKILL.md` says "the spec or tickets", which nudges the [model](https://www.aihero.dev/ai-coding-dictionary/model) to go hunting for a file that doesn't exist. If the plan lives only in the thread, say so when you invoke it.

## Prerequisites

`implement` works on the branch you are on and does not create one. If the request includes commits, check that the current branch is the intended destination before starting.

If the tickets came from [to-tickets](https://aihero.dev/skills-to-tickets), pass their full reference into the run. `review` carries the originating spec or ticket into its `code-review` primary as the acceptance contract at closeout.

An active Panel Issue also supplies execution state. `implement` reads and claims it through `manage-panel` before editing, then writes the returned `in_progress` state to the `.scratch` ticket named by the Issue's `Local artifact` field. After review, it moves the Panel Issue to `in_review` and mirrors that returned state locally. Any later `blocked`, `canceled`, or explicitly accepted `done` transition follows the same remote-first mirror rule. Jira planning conversations cannot execute code; implementation starts from the published Panel Issue instead. Without an active Panel Issue, `implement` remains tracker-neutral.

## What one run does

A run is six beats, in order:

1. Read and claim an active Panel Issue when one exists, then read the ticket or spec and work out the seams.
2. Drive [tdd](https://aihero.dev/skills-tdd) at the pre-agreed seams, one red-green slice at a time.
3. Typecheck often, run single test files as it goes.
4. Run the full test suite once, at the end.
5. Run [review](https://aihero.dev/skills-review), with [code-review](https://aihero.dev/skills-code-review) as the primary and distinct installed specialists as complements, then present the stable diff and logical groups and use [commit](https://aihero.dev/skills-commit) when commits are authorized.
6. When validation passes and review has no accepted blocking findings, post the implementation summary to the active Panel Issue, move it to `in_review`, then mirror the returned status in its `.scratch` ticket. Only explicit user acceptance moves it to `done`.

One run covers one ticket. The tickets [to-tickets](https://aihero.dev/skills-to-tickets) produces are tracer-bullet vertical slices sized to fit a single fresh [context window](https://www.aihero.dev/ai-coding-dictionary/context-window), so the intended rhythm is: clear context, implement one ticket, commit, clear again. Each ticket is self-contained, which is what makes the previous ticket's context disposable.

## Pre-agreed seams

The idea the skill runs on is the **seam**: the public boundary you observe behaviour at, without reaching inside. Tests live at seams. Working at a seam agreed before any code is written is what keeps the tests durable, because the implementation underneath can be rewritten without the tests moving.

The word "pre-agreed" is doing real work, and it is also the skill's weakest joint. Nothing inside `implement` agrees the seams. `tdd` is the skill that asks, and it refuses to write a test at an unconfirmed seam. So in practice the agreement happens either upstream in the spec, or in the first exchange of the run. If it happens nowhere, the precondition never fires and the run quietly becomes "just write the code". Naming the seams in the spec is what stops that.

## Common questions

**It finished, but my ticket is still open and the acceptance criteria are still unchecked.**

For an active Panel Issue, `implement` leaves it open deliberately but moves both Panel and the matching `.scratch` mirror to `in_review` after posting the changes, verification, review result, and remaining risks. It never marks its own work `done`; that transition requires your explicit acceptance. A GitHub, GitLab, Linear, or local-markdown ticket is unchanged because those trackers remain governed by the repository's configured workflow.

**Can I point it at all my tickets at once, or run several in parallel?**

No. One invocation, one ticket. Batch dispatch across a ticket queue and [subagent](https://www.aihero.dev/ai-coding-dictionary/subagent) fan-out are both requested repeatedly, and neither exists. Running several `/implement` sessions side by side in one checkout is worse than unsupported: one field report describes a `git commit --amend` in one session landing on another session's commit, a stash vanishing from `refs/stash`, and commits landing on the wrong branch, all in a single afternoon across three issues. The sessions share one working directory, one index, and one HEAD. Git worktrees are the community workaround, and note that `refs/stash` is shared across worktrees too, so worktrees alone do not fix the stash case. If you want parallelism today, you are assembling it yourself.

**Can it open a pull request instead of committing?**

Not built in. `implement` never treats a build request as permission to push or open a PR. Those remote actions remain separate requests.

**The closing review says it cannot see my changes.**

`review` can freeze the working-tree patch against `HEAD`, including relevant untracked files, so every selected reviewer inspects the same stable candidate before a commit exists.

Separately, some people deliberately do not want the review inside the run at all, because an agent reviewing the code it just wrote is biased toward its own solution. Running [review](https://aihero.dev/skills-review), or the narrower [code-review](https://aihero.dev/skills-code-review), in a fresh session against a fixed point is a legitimate alternative.

**One ticket burned 150k tokens. Am I using it wrong?**

Probably the ticket is too big rather than the skill being misused. A run does codebase exploration, a red-green loop per seam, a full suite, and a review, so a non-trivial ticket exceeding 100k [tokens](https://www.aihero.dev/ai-coding-dictionary/token) is normal rather than a sign something broke. The lever is upstream: right-size the tickets in [to-tickets](https://aihero.dev/skills-to-tickets) so each fits one fresh window. If a single ticket keeps blowing out, split it rather than raising the [effort](https://www.aihero.dev/ai-coding-dictionary/effort) level.

**`/implement #2` in a fresh session worked on something completely unrelated.**

`#2` is resolved against whatever numbered list the agent can see, which in a fresh session may be a todo file, a checklist, or another work list rather than the configured tracker. The resolution is confident rather than fail-closed, so the mistake is not obvious until it has started. Pass the full reference, the issue URL or `owner/repo#2`, and ask it to confirm the title back before it begins.

## It's working if

- The session opens by reading the ticket or spec and restating what it will build, rather than asking you what to build.
- The trace loads `tdd` through the Skill tool or the available-Skills catalog, rather than merely adding tests without its risk gate and seam rules.
- Typechecks and single test files run repeatedly during the run, and the full suite runs once near the end.
- The closing trace loads `review`, keeps `code-review` primary, and carries the originating spec or ticket as the contract.
- When commits were requested, the run presents the stable logical groups and reaches scoped commits through `commit`.
- For an active Panel Issue, the trace reads and claims it before editing, mirrors `in_progress` locally, then posts the verified result and moves both copies to `in_review` without marking either `done`.
- The diff is one ticket's worth of change: a vertical slice through every layer, not several tickets swept together.

## Where it fits

`implement` is the build step of the main chain, second from the end:

```txt
grill-with-docs → to-spec → to-tickets → implement → review
```

Its neighbours are [to-tickets](https://aihero.dev/skills-to-tickets), which produces the tickets it consumes and declares the blocking edges that decide their order; [tdd](https://aihero.dev/skills-tdd), which it drives internally at each seam; and [review](https://aihero.dev/skills-review), which keeps [code-review](https://aihero.dev/skills-code-review) primary and adds distinct specialists before committing. For an active Panel Issue, `manage-panel` owns the surrounding claim, comment, and `in_review` state transitions. `implement` sits downstream of the planning skills and trusts them. It does not re-validate the shape of what it was handed, so a badly-structured map or a horizontally-layered ticket gets built as written.

That trust is why [wayfinder](https://aihero.dev/skills-wayfinder) merges onto the chain at [to-spec](https://aihero.dev/skills-to-spec) rather than looping its map straight into `implement`. Go straight to `implement` from a map only when the effort turned out genuinely small.

[ask-me](https://aihero.dev/skills-ask-me) is the router over the whole set when you are not sure which flow you are in.
