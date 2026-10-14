---
name: ask-me
description: Ask which promoted skill or flow fits your situation. A hand-maintained router over this personal collection.
disable-model-invocation: true
---

# Ask Me

You don't remember every promoted skill or how they connect, so ask.

Before stating what a Skill does, recommending it, or suggesting it can be skipped, locate that Skill in the authoritative available-Skills catalog and read its complete `SKILL.md`. Use the summaries below only to find candidates, never as the final authority on their behavior.

A **flow** is a path through the skills. Most paths run along one **main flow**, and two **on-ramps** merge onto it. Everything else is standalone, or a vocabulary layer that runs underneath.

## The main flow: idea → ship

The route most work travels. You have an idea and want it built.

1. Start with an interview. Use **`/grill-with-docs`** when the outcome should persist in `GLOSSARY.md` or ADRs. Use **`/grill-me`** when you only need to settle the idea in conversation, even if a working directory exists. Both use the same grilling discipline; only `grill-with-docs` adds the documentation layer.
2. **Branch: can you settle every question in conversation?** If a question needs a runnable answer (state, business logic, a UI you have to see), detour through a prototype, bridged by **`/handoff`** in both directions (a prototype lives in its own directory, which is exactly what `/handoff` is for; see Phase boundaries):
   - **`/handoff`** out, then open a fresh session against that file,
   - **`/prototype`** to answer the question with throwaway code,
   - **`/handoff`** back what you learned, and reference it from the original idea thread.
3. **Branch: is this a multi-session build?**
   - **Yes** → **`/to-spec`** (turn the thread into a spec), then **`/to-tickets`** to split it into tracer-bullet tickets, each declaring its **blocking edges**. Active Panel and Jira planning conversations write the complete local artifacts under `.scratch` first, then publish the same content through `manage-panel` with the local relative paths recorded remotely; otherwise the configured tracker is used. Work the result in one of two ways:
     - **`/implement`** handles one executable leaf Issue or ticket at a time. Panel selects, binds, and dispatches an unblocked leaf Issue; on a local or other tracker, select one ticket whose blockers are done and **`/clear` context between tickets**.
     - **`/implement-spec`** orchestrates an entire non-Panel task graph on one integration branch, running independent frontier tickets in parallel worktrees. Use it only when the configured tracker, harness, and authorization support the required branches, worktrees, merges, and optional PR operations. With active Panel or Jira planning context, let Panel dispatch leaf Issues to **`/implement`** instead.
   - **No** → **`/implement`** right here, in the same context window.

   Either way, **`/implement`** builds the executable Issue dispatched by Panel by driving **`/tdd`** internally (one red-green slice at a time), then closes out through **`/review`** before committing. It never chooses a child or reproduces Panel's eligibility rules. In a repository with `.deslop.toml`, it also uses **`/code-dedup`** before authoring non-trivial new code; review adds the same evidence only when the diff has a material duplicate risk. That closeout keeps **`/code-review`** as the primary Standards + Spec review, carries the originating Spec or Ticket as its contract, and adds only distinct installed specialists. With an active Panel Issue, `manage-panel` binds and claims it before any Git or code mutation, mirrors the returned `in_progress` state to its `.scratch` ticket, then posts the verified result and moves both copies to `in_review`; only explicit user acceptance moves them to `done`. Reach for **`/tdd`** on its own when you just want to build a concrete behaviour test-first without a full spec. Reach for **`/review`** directly when you want the same bounded orchestration outside an implementation run or when you want to audit an agent conversation's Skill and tool handling.

   When a run is ready to commit, **`/commit`** groups independent changes and excludes unrelated or sensitive files instead of staging the whole tree. For an active Panel Issue, it uses a verified linked Jira key when one exists and never substitutes Panel's internal Issue identity. When the work ships through GitHub, **`/pr`** writes the reviewer-facing body from the verified requirement, before and after evidence, reversibility, and blast radius. GitLab uses **`/gitlab-mr`** instead.

4. **`/retro`** closes the loop after a session worth learning from. It suggests environment improvements grounded in the actual session: deterministic checks for mechanical failures, reviewer standards for judgement calls, and smaller steering files. It proposes changes rather than applying them without confirmation.

### Context hygiene

Keep steps 1–3 in **one unbroken context window** (don't compact or clear until after `/to-tickets`) so the grilling, spec, and tickets all build on the same thinking. Each `/implement` then starts fresh, working from the ticket. Run `/retro` before clearing the session it should examine, or point it at that session's log later.

The limit on this is the **[smart zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone)**: the window (~150k tokens on state-of-the-art models) within which the model still reasons sharply. If a session approaches it before `/to-tickets`, don't push on degraded; `/compact` at the nearest phase boundary and carry on (see Phase boundaries).

## On-ramps

A starting situation that generates work, then merges onto the main flow.

- **Bugs and requests piling up** → **`/triage`**. It moves issues through triage roles and produces agent-ready issues, which **`/implement`** later picks up.

  Triage is only for issues **you didn't create**: bug reports, incoming feature requests, anything that arrives raw. Tickets that `/to-tickets` produced are already agent-ready, so **don't triage them**.

- **Something's broken** → **`/diagnosing-bugs`**. For the hard ones: the bug that resists a first glance, the intermittent flake, the regression that crept in between two known-good states. It refuses to theorise until it has a **tight feedback loop** (one command that already goes red on *this* bug), then fixes with a regression test. Its post-mortem hands off to **`/improve-codebase-architecture`** when the real finding is that there's no good seam to lock the bug down.

- **A huge, foggy effort: a greenfield project or a huge feature build, too big for one session** → **`/wayfinder`**, the most cognitively demanding flow here. When the way from here to the destination isn't visible yet, it charts a **shared map** of **decision tickets** on the issue tracker and resolves them one at a time, producing **decisions, not deliverables**, until the fog is pushed back and the way is clear. Where **`/grill-with-docs`** sharpens an idea you can hold in one session, wayfinder is for the idea you can't, and it's slower and denser, so save it for exactly that, never a well-scoped feature.

  When the map clears, **it hands off, it doesn't build**: merge onto the main flow at **`/to-spec`**, which collapses the map's linked decisions into a buildable plan, then `/to-tickets` and `/implement` as usual. Looping the map straight into `/implement` skips that collapse and throws the linked detail away, so go straight to `/implement` only when the effort turned out genuinely small.

## Codebase health

Not feature work, just upkeep.

- **`/improve-codebase-architecture`** runs whenever you have a spare moment to keep the codebase good for agents to operate in. It surfaces **deepening opportunities**; picking one _generates an idea_ you can take into the main flow at `/grill-with-docs`. It's the survey that finds the candidates; **`/codebase-design`** (below) is the bench you design the chosen one on.
- **`/code-dedup`** is the narrower evidence tool for duplicate code. Use it before adding a non-trivial code unit, against a suspicious file or range, or to inspect the worst existing Deslop clusters. It reports reuse candidates but leaves every edit to `/implement`.

## Vocabulary underneath

Two model-invoked references that run *beneath* the other skills, each the single source of truth for its vocabulary. Reach for them directly when the **words**, not the process, are the problem; or let the skills above pull them in.

- **`/domain-modeling`**: sharpen the project's *domain* language: challenge a fuzzy term, resolve an overloaded word ("account" doing three jobs), record a hard-to-reverse decision as an ADR. It's the active discipline `/grill-with-docs` drives to keep `GLOSSARY.md` a clean glossary.
- **`/codebase-design`** is the deep-module vocabulary (module, interface, depth, seam, adapter, leverage, locality) for designing a module's *shape*: a lot of behaviour behind a small interface at a clean seam. `/tdd` and `/improve-codebase-architecture` both speak it.

## Phase boundaries

A **phase** is a chunk of work inside a session: the grilling, the implementation, the QA. At the **boundary** between two of them you have five options, and picking between them is the fuzziest decision in this whole map:

- **Continue**: stay put. Costs nothing, loses nothing.
- **`/clear`**: empty the window, when nothing here matters to what's next.
- **`/handoff`** writes a portable markdown file. Narrow: only for a **new harness**, a **new directory**, a **colleague**, or forking a side task **mid-phase**. What it buys is portability.
- **Subagent**: send a tightly-scoped task to its own window and get a report back.
- **`/compact`** compresses this context and seeds a fresh session with it. The **default**, at the bottom of the tree rather than the first reach.

Read [PHASE-BOUNDARIES.md](PHASE-BOUNDARIES.md) for the ordered tree: the five questions, the reasoning behind each branch, and why the primary-source cost makes **Continue** the one to rule out first. Make the decision **at** a boundary; mid-phase, continue or split the rest into subagents.

## Standalone

Off the main flow entirely.

- **`/grill-me`**: the same relentless interview as `/grill-with-docs`, but **stateless**: it saves nothing locally and builds no `GLOSSARY.md`. Reach for it when the decisions only need to live in the conversation. Use `/grill-with-docs` when the interview should also maintain project vocabulary or durable decisions in `GLOSSARY.md` and ADRs.
- **`/grilling`** is the model-reachable interview primitive: rounds, the frontier, facts are the agent's job and decisions are yours. `/grill-me` invokes it directly, while `/grill-with-docs` combines it with `/domain-modeling`; `/triage`, `/wayfinder` and `/improve-codebase-architecture` also reuse it.
- **`/resolving-merge-conflicts`** works an in-progress merge or rebase conflict hunk by hunk, resolving by **intent** traced to each side's primary source rather than by picking lines, then finishes the operation. It never runs `--abort`. Standalone and off every flow: reach for it when you are already mid-conflict.
- **`/review`** is the personal review orchestrator and the closeout used by `/implement`. It reviews either a frozen code candidate or an agent workflow trace, discovers installed review Skills at invocation time, keeps `/code-review` primary for implementation closeout, and attributes workflow findings to the responsible Panel, Skill, instruction, or harness owner. Use `/code-review` directly when you only need its Standards and Spec axes.
- **`/code-dedup`** queries Deslop for duplicate evidence before authoring or during review. It is distinct from Ponytail: Deslop finds similar implementations, while Ponytail questions whether the implementation needs to exist or can be simpler.
- **`/commit`** creates local commits with strict path and scope control. Use it when the implementation is already stable and only the commit boundary remains.
- **`/gitlab-mr`** creates, inspects, incrementally updates, and verifies GitLab merge requests using the current repository's defaults. Its push-triggered description sync Hook is installed only when explicitly requested.
- **`/pr`** writes a reviewer-focused GitHub Pull Request body. It does not create, update, ready, or merge the PR without separate authorization.
- **`/retro`** reviews a coding session for durable improvements to navigation, checks, standards, steering, tooling, and information access.
- **`/fork-doc`** audits intentional fork behavior against the latest merged upstream baseline, batches unresolved maintainer decisions, enforces `<upstream-version>-fork.<N>` releases, and synchronizes the repository rule, `FORK.md`, maintained user docs, and changelog. Standalone use leaves edits uncommitted; a parent Git workflow contributes only its exact existing authorization.
- **`/worktree-clean`** audits and removes unused same-repository agent worktrees. It refuses to delete the calling task's active checkout and uses Handoff only when that exact checkout is a cleanup target.
- **`/prototype`** is a small, throwaway program that answers one design question: does this state model feel right, or what should this UI look like. Throwaway is a constraint on how the code is written, not a promise to destroy it: the answer folds into the real code, and the prototype itself is kept as a **primary source** on a `prototype/<name>` branch out of main, pointed at from the implementation issue. It's the detour in step 2 of the main flow, but reach for it any time a design question is hard to settle on paper.
- **`/research`**: investigate a focused fact, comparison, or broad synthesis against **primary sources**. It uses one focused lane or several non-overlapping subquestions when authorized, cross-checks material claims, then leaves one cited result to take *into* `/grill-with-docs`; research feeds the thinking rather than replacing it.
- **`/to-questionnaire`** comes in when the thing blocking you isn't in your head or the codebase but in **someone else's**, and it writes them a questionnaire to fill in. It's the inverse of `/grill-me`: instead of interviewing you about the subject, it interviews you about the **send** (who it's going to, what you need back) and aims the questions at the gap. What comes back is material for `/grill-with-docs` or `/to-spec`.
- **`/wizard`** is for the steps only a **human** can take: provisioning infrastructure, setting up credentials or CI secrets, clicking through an unfamiliar third-party dashboard, running a one-off migration or cutover. It generates an interactive bash script that opens each URL, captures each value, and writes it into `.env` and GitHub secrets, so the procedure stops being something you re-explain to an agent every time. Model-invoked, so the agent reaches for it the moment it hits a wall only you can pass. If the agent could just do it itself, it should; this is for where a human is genuinely in the loop.
- **`/wait-what`** is the corrective for a message that didn't land. Use it mid-conversation, inside any other skill, and the agent re-pitches what it just said with the context you were missing, in plain English, using the `GLOSSARY.md` vocabulary. It works after the fact; `/grill-with-docs` is the upfront cure, because a shared language agreed early is what stops the jargon arriving at all.
- **`/teach`**: learn a concept over multiple sessions, using the current directory as a stateful workspace.
- **`/writing-for-agents`** is the reference for writing documents agents consume: skills, AGENTS.md, pointed-at docs.

## Precondition

**`/configure-skills`**: run once to select optional project tools such as CodeGraph and Deslop, and before tracker-dependent engineering flows when no active Panel or Jira planning context supplies the remote publication target. Active Panel flows still keep local `.scratch` mirrors. It also configures the issue tracker, triage labels, and doc layout the other skills assume. Custom issue trackers work.
