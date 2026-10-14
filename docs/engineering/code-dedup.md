## What it does

`code-dedup` asks Deslop whether an implementation already exists before another copy is written, and investigates duplicate clusters in existing code. It chooses the narrowest query for the job: `find-similar` while authoring, filtered `duplicates` queries for focused review or repository cleanup, and pair or merge-plan evidence only after a candidate is selected.

It reports evidence and a recommended reuse boundary but never edits code. [implement](https://aihero.dev/skills-implement) owns the change, tests, and closeout.

## When to reach for it

Type `/code-dedup`, or the agent reaches for it automatically when a task explicitly concerns duplicate code, DRY, clones, copy-paste, or deduplication. [implement](https://aihero.dev/skills-implement) also uses it before non-trivial new code when the repository root contains `.deslop.toml`; [review](https://aihero.dev/skills-review) adds it only for an explicit duplicate review or a material clone risk.

| Your situation | Reach for |
| --- | --- |
| You are about to add a helper, parser, fixture, route handler, or similar code unit | `code-dedup`, preferably through Deslop `find-similar` |
| A changed file or block looks copied | `code-dedup` with a file or byte range |
| You want the worst existing duplicate clusters | `code-dedup` with the repository cleanup route |
| You want Standards and Spec compliance | [code-review](https://aihero.dev/skills-code-review) |
| You want deletion, YAGNI, or simpler code | [review](https://aihero.dev/skills-review) with Ponytail |
| You want to redesign a weak module boundary | [improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture) |

## Prerequisites

Use either Deslop MCP tools or the `deslop` CLI. The dependency-aware repository installer can install `deslop` and `deslop-mcp` through Homebrew on macOS and Linux or Scoop on Windows. When Deslop is selected, it also registers the global `deslop` STDIO server through the official Codex CLI. It keeps a matching registration and refuses to replace a conflicting one. It does not configure Claude Code, Cursor, or another MCP client.

The `.deslop.toml` marker is required only for automatic use inside `implement` and ordinary review closeout. Direct duplicate analysis can use Deslop's defaults without it.

## How it reads a result

An identical or nearly identical match strongly favors reuse. Looser behavioral matches require reading both implementations. A structural-only match is not enough by itself because sibling boilerplate can share a shape without sharing a useful abstraction.

When `find-similar` returns no cluster but its `existing` list names one occurrence, the implementation still already exists and should be reused or extracted. For an existing repository cleanup, the skill filters `duplicates`, opens only the cluster being considered, and uses `compare-pair` or the read-only `merge-plan` when that narrower evidence is needed. Cluster mass ranks impact, while `kind` describes the match.

## Common questions

**What happens when MCP is unavailable?**

The skill runs the CLI from the repository root and reads `.deslop/deslop-report.json`. The CLI cannot inspect an unwritten snippet, so the fallback checks the current neighboring clusters, then requires an immediate post-write scan. If neither path exists, the skill reports the missing capability instead of guessing.

**Does a Deslop finding mean the code must be merged?**

No. Duplication can be deliberate when two ownership or change boundaries should stay independent. The result must name that boundary. Cosmetic differences, hidden clusters, or relaxed thresholds are not evidence of independence.

**Why is this separate from Ponytail?**

They use different evidence. Deslop asks whether similar code exists. Ponytail asks whether code needs to exist and whether the solution is overbuilt. [review](https://aihero.dev/skills-review) keeps those scopes separate so one cannot replace the other.

## It's working if

- A pre-authoring query happens before the new code unit is written.
- The report names the query mode, cluster IDs, clone kinds, canonical occurrences, and affected locations.
- Each cluster ends with one bounded recommendation: reuse, extract, keep separate with a stated boundary, or investigate further.
- CLI fallback reads the JSON report and states when a post-write rerun is still required.
- No installation, MCP configuration, threshold change, or code edit occurs inside the Skill itself.

## Where it fits

`code-dedup` is an evidence layer inside the main build chain. [implement](https://aihero.dev/skills-implement) calls it before authoring in opted-in repositories, then [review](https://aihero.dev/skills-review) can query the final candidate when clone risk remains. [code-review](https://aihero.dev/skills-code-review) still owns Standards and Spec, while Ponytail remains the simplification specialist.

[ask-me](https://aihero.dev/skills-ask-me) routes across the whole set when you are unsure which question you are asking.
