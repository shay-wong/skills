---
name: review
description: Orchestrate a general review across installed, non-overlapping specialists and synthesize one bounded verdict. Use when the user has not selected a narrower review workflow.
---

# Review

Act as the personal review entrypoint. Select one primary review workflow, add installed complementary review Skills only for distinct material questions, and synthesize one verdict against one frozen candidate.

## Discover available reviewers

Use the current harness's authoritative available-Skills catalog. A model-visible Skill is available, so do not rescan it. Only when the catalog is absent or known to omit local or plugin Skills, run `scripts/discover-review-skills.sh` from this Skill directory as fallback. Count a plugin-cache Skill only when its plugin is enabled.

Do not rely on install-time discovery. The supported `npx skills` installer has no repository post-install hook, and local plugins can change after installation.

Read every selected Skill's complete `SKILL.md` before using it. Report a missing optional Skill once and skip it. Never install, enable, disable, copy, or update another Skill or plugin as part of a review.

## Route the review

An explicitly requested single review Skill is primary. When the user requests several focuses, the workflow that owns the broadest correctness or merge-readiness verdict is primary and narrower focuses are complementary. Otherwise apply the first matching row:

| Main intent | Primary |
| --- | --- |
| Address unresolved GitHub comments, requested changes, or review threads | Call the Skill tool with the installed GitHub feedback workflow |
| Whole-repository bloat, deletion, or over-engineering audit | Call the Skill tool with `ponytail:ponytail-audit` when available |
| Diff-focused simplification, deletion, YAGNI, or over-engineering review | Call the Skill tool with `ponytail:ponytail-review` when available |
| Security or trust-boundary review | Call the Skill tool with `security-review` when available |
| General game-codebase review | Call the Skill tool with `review-game` when available |
| Architecture or adversarial review | Call a matching installed architecture review Skill when available; otherwise use `code-review` as primary and run a direct architecture advisory pass |
| A named language, framework, or platform review | Call the Skill tool with the matching installed model-invoked Skill |
| General branch, pull request, working-tree, standards, spec, or merge-readiness review | Call the Skill tool with the unnamespaced Matt `code-review` when available; otherwise perform a direct correctness and requirements review |

Add a complementary review only when its scope is distinct from the primary:

- Honor every explicitly requested review focus.
- There is no numeric cap. Select every materially justified, non-overlapping scope and omit the rest.
- Add `security-review` for authentication, authorization, secrets, untrusted input, uploads, database queries, file-system operations, APIs, payments, privacy, cryptography, or another trust boundary.
- Add `review-game` for material engine, game-loop, state, event, asset-lifecycle, gameplay-performance, scoring, session, or anti-cheat concerns.
- Use changed paths, the nearest manifest, and framework imports to add every matching installed domain review whose expertise is absent from the primary. Mixed-language candidates may select several profiles.
- Use a GitHub feedback workflow only when the user explicitly asks to inspect or fix that feedback. Use `ponytail:ponytail-audit` only for an explicitly repository-wide audit.
- If `ponytail:ponytail-review` is available and is not primary, always add it as an advisory pass and run it last against the final candidate.
- Do not automatically combine Matt `code-review` with another general-purpose review workflow merely because both are installed.

Announce the primary and complementary selections with one evidence-backed reason each. Assign each selected scope a priority:

1. Functional correctness, requested behavior, repository invariants, and merge readiness.
2. Security, privacy, data integrity, concurrency, transactions, payments, migrations, and compatibility.
3. Language, framework, platform, game-engine, and performance correctness.
4. Non-blocking architecture and maintainability.
5. Simplification, deletion, YAGNI, and over-engineering advice.

Selected tiers 1 to 3 are required. Tier 4 is required only when the requested verdict includes it. Tier 5 is advisory unless simplification is the primary intent.

## Freeze and execute

For a multi-scope, merge-readiness, repair-enabled, conflicting, or large-candidate review, read [references/review-policy.md](references/review-policy.md) in full before launching reviewers. A simple read-only single-scope review can execute directly from this entrypoint.

1. Freeze the exact comparison base and candidate SHA, or one immutable dirty-worktree patch that includes relevant untracked files. Record the spec, repository rules, whether fixes are authorized, and the validation needed for approval.
2. Run every required review against that same candidate. Keep independent scopes separate, deduplicate overlaps, and independently verify each proposed blocker against code, tests, an explicit requirement, or a reachable failure path.
3. If fixes are authorized, batch only accepted blockers, validate the changed behavior, freeze the new candidate, and rerun required reviews whose evidence was invalidated.
4. Run the advisory Ponytail pass last. It cannot weaken correctness or security findings and cannot alone produce `REQUEST_CHANGES` unless simplification is primary.

## Report

Start with:

```text
Review status: COMPLETE | BUDGET_REACHED | REVIEW_INCOMPLETE | CONFLICT | CIRCUIT_OPEN
Candidate verdict: APPROVE | REQUEST_CHANGES | NO_VERDICT
Stop reason: <one concise sentence>
```

For a policy-governed review, use the status definitions and precedence in the reference. Status and verdict are independent: operational incompleteness does not imply `REQUEST_CHANGES`, and `APPROVE` requires `COMPLETE`, an unchanged candidate, every required review complete, validation passing, and no accepted blocker.

Present the final synthesis in Chinese unless the user requests another language. Put accepted findings first, ordered by severity and grouped by scope. Put advisory Ponytail findings last under `复杂度精简建议`. Preserve workflow status tokens, but explain them in Chinese.
