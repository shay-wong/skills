## What it does

`research` answers focused facts, comparisons, and broad questions by reading the sources that own the answer, then leaves one cited result. It starts with material you already supplied and local evidence, chooses the lightest useful mode, and follows material claims back to **[primary sources](https://www.aihero.dev/ai-coding-dictionary/primary-source)** such as official docs, source code, specs, filings, papers, and first-party APIs.

It distinguishes sourced fact, material you provided, inference, recommendation, and unresolved gaps. Material claims are cross-checked when possible, and single-source claims are labelled instead of presented as consensus. The default output is a file where the repo keeps research notes, unless you request chat-only output or there is no repository workspace.

## When to reach for it

Type `/research`, or the [agent](https://www.aihero.dev/ai-coding-dictionary/agent) reaches for it automatically when a task turns into reading legwork.

Reach for it when the next step is *finding something out* from outside the working directory (how a third-party API behaves, what a spec actually says, whether a version claim holds), and you'd rather not stall your own thread doing the reading. What you need decides which skill:

| What you need | Reach for |
| --- | --- |
| An external fact a decision is waiting on | `research` |
| A decision made *with* you, by interview | [grilling](https://aihero.dev/skills-grilling) |
| A durable architecture decision, written into `CONTEXT.md` and ADRs | [grill-with-docs](https://aihero.dev/skills-grill-with-docs) |
| To find out whether an approach works in your codebase | [prototype](https://aihero.dev/skills-prototype) |
| A plan too big to hold in one session | [wayfinder](https://aihero.dev/skills-wayfinder) |

The line between `research` and `grill-with-docs` is the **shelf life of what comes back**. Research produces short-lived assets: what this library's auth mechanism does as of this week. An ADR records a decision you keep. If what you are producing is a decision rather than a fact, you are [grilling](https://www.aihero.dev/ai-coding-dictionary/grilling), not researching.

## Research modes

The question determines the shape of the work:

| Mode | Shape |
| --- | --- |
| Focused | One research lane follows the shortest primary-source path to one current fact. |
| Comparison | Every option is checked against the same decision criteria before the recommendation is written. |
| Deep | The topic is split into a few non-overlapping subquestions, researched concurrently when delegation is available and authorized, then reconciled by the main session. |
| Monitoring candidate | The current lookup is completed normally, then the repeated freshness need is reported without creating automation. |

Each delegated researcher owns its assigned question directly and does not redispatch the same work. The main session owns source conflicts, cross-checking, and the final synthesis. Research is legwork you delegate, not judgment you outsource.

Where the file lands is decided by the repo, not by the skill. It matches the existing note convention and produces one final artifact per run, even when several independent lanes contributed evidence.

## Common questions

**It spawned a second research agent. Is that meant to happen?**

Sometimes. A focused fact should have one lane. A broad synthesis may use several lanes only when each owns a different named subquestion and the environment permits delegation. A second task repeating the same question is still a nesting bug and should be stopped.

**Where should the file live, and should I commit it?**

The skill puts the file where the repo already keeps notes and does not have an opinion beyond that. The community one is fairly settled: ADRs are kept, research files are not. The sharpest version of it, from a Discord thread on exactly this question: "ADRs yes. Everything else archive or delete after done. It otherwise becomes cruft of work and can poison future repo reads if you've drifted away from the spec/research." A research file records what was true on the day it was written, so a stale one is worse than none. On balance these artifacts don't really belong in git, and there is no canonical home for them: people use Obsidian, a separate knowledge repo, or the issue tracker instead.

**What counts as a "high-trust" primary source, and who decides?**

The [model](https://www.aihero.dev/ai-coding-dictionary/model) still selects sources, but citations are no longer the only check. Decisive claims should be read in full and cross-checked against another credible source when possible. If only one primary source exists, the result labels that limitation. Following a citation should land on the document, source, filing, paper, or dataset that owns the claim rather than a summary of it.

**Does a later session reuse what an earlier run found?**

No. Nothing auto-loads a past research file; it is a document sitting in the repo until a human or a skill points at it. This was raised early as the strongest challenge to the design: "the value's the markdown becoming context the agent re-reads later, not the fetch itself. A write-once dead file is just a fancy search." The shipped skill does not solve it. In practice the file earns its keep by being fed into the next step deliberately: attach it to a spec, quote it into a grilling session, point a [ticket](https://www.aihero.dev/ai-coding-dictionary/ticket) at it.

**Why not just ask the agent to go read the docs?**

You can, and a two-line prompt saying exactly that was the practice this skill replaced. Two things the skill buys over the prompt: it runs in the background so your session keeps its [context](https://www.aihero.dev/ai-coding-dictionary/context) clean, and the primary-source constraint and the cited-file output come out the same way every time rather than however you happened to phrase it. Against a [harness](https://www.aihero.dev/ai-coding-dictionary/harness)'s own deep-research mode, the difference is the artifact and the source discipline, not the search. If a two-line prompt gets you what you need on a small question, use the two-line prompt.

**When does it stop reading?**

It stops when the scoped question is answerable. A narrow fact takes the lightest primary-source path; a comparison or broad synthesis is split into answerable subquestions only when needed.

**`/wayfinder` created research tickets. Do I resolve those myself?**

No, it now fires them for you. In the unreleased changes since v1.1, a charting session spawns a `/research` subagent per research ticket and burns them down in parallel, capturing findings on a throwaway `research/<name>` branch with a [context pointer](https://www.aihero.dev/ai-coding-dictionary/context-pointer) from the ticket. Research tickets are the one exception to wayfinder's one-ticket-per-session rule, because they are [AFK](https://www.aihero.dev/ai-coding-dictionary/afk): nothing waits on you. Two known snags with those branches: the subagent has been seen opening a draft PR from a branch that is never meant to merge ([issue #576](https://github.com/mattpocock/skills/issues/576)), and deleting the branch later breaks the context pointers the tickets hold.

## It's working if

- A focused question uses one short evidence path; a broad question is split into named, non-overlapping subquestions only when that improves coverage.
- One final Markdown artifact appears in the repo's note location, unless you asked for chat-only output, and the agent tells you its path.
- Material claims carry citations to primary sources, source conflicts are explained, and single-source claims are labelled.
- Freshness-sensitive facts include concrete dates, while facts, inference, recommendation, and gaps stay visibly separate.
- You can make the decision you were stuck on from the file alone, without going back to the sources yourself.

## Where it fits

A reach-for-it-anytime standalone that feeds the thinking skills rather than sitting in the build chain. Its file is something to take *into* the flow: [grilling](https://aihero.dev/skills-grilling) and [grill-with-docs](https://aihero.dev/skills-grill-with-docs) ask sharper questions when the facts are already on the table, and [to-spec](https://aihero.dev/skills-to-spec) can synthesise against it. [wayfinder](https://aihero.dev/skills-wayfinder) is the one skill that invokes it directly, resolving each research ticket on its map with a `/research` subagent. For the whole map, see [ask-matt](https://aihero.dev/skills-ask-matt).
