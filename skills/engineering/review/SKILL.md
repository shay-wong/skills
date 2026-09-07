---
name: review
description: Review a code candidate or agent workflow trace through the appropriate installed, non-overlapping specialists and synthesize one bounded verdict. Use for general review or implement closeout when the user has not selected a narrower workflow.
---

# Review

Act as the personal review entrypoint. Select one primary review workflow, add installed complementary review Skills only for distinct material questions, and synthesize one verdict against one frozen code candidate or workflow trace.

## Discover available reviewers

Use the current harness's authoritative available-Skills catalog. A model-visible Skill is available, so do not rescan it. Only when the catalog is absent or known to omit local or plugin Skills, run `scripts/discover-review-skills.sh` from this Skill directory as fallback. Count a plugin-cache Skill only when its plugin is enabled.

Do not rely on install-time discovery. The supported `npx skills` installer has no repository post-install hook, and local plugins can change after installation.

Read every selected Skill's complete `SKILL.md` before using it. Execute it through the Skill tool when the current harness exposes that tool. Otherwise apply the catalog-loaded workflow directly. The absence of a Skill tool does not make a catalog-listed Skill unavailable. Report a missing optional Skill once and skip it. Never install, enable, disable, copy, or update another Skill or plugin as part of a review.

## Route the review

An explicitly requested single review Skill is primary. When the user requests several focuses, the workflow that owns the broadest correctness or merge-readiness verdict is primary and narrower focuses are complementary.

When `implement` invokes this Skill for closeout, use the unnamespaced Matt `code-review` as primary when available. Treat the originating spec or tickets as the acceptance contract, and add installed complementary reviewers only for distinct material risks in the candidate. If `code-review` is unavailable, perform the direct correctness and requirements fallback and report the missing primary once.

Otherwise apply the first matching row:

| Main intent | Primary |
| --- | --- |
| Agent conversation, Skill routing, tool use, or workflow handling | Perform a direct workflow-trace review |
| Address unresolved GitHub comments, requested changes, or review threads | Use the installed GitHub feedback workflow |
| Whole-repository bloat, deletion, or over-engineering audit | Use `ponytail:ponytail-audit` when available |
| Diff-focused simplification, deletion, YAGNI, or over-engineering review | Use `ponytail:ponytail-review` when available |
| Duplicate-code, DRY, clone, copy-paste, or deduplication review | Use `code-dedup` when available |
| Security or trust-boundary review | Use `security-review` when available |
| General game-codebase review | Use `review-game` when available |
| Architecture or adversarial review | Call a matching installed architecture review Skill when available; otherwise use `code-review` as primary and run a direct architecture advisory pass |
| A named language, framework, or platform review | Use the matching installed model-invoked Skill |
| General branch, pull request, working-tree, standards, spec, or merge-readiness review | Use the unnamespaced Matt `code-review` when available; otherwise perform a direct correctness and requirements review |

Add a complementary review only when its scope is distinct from the primary:

- Honor every explicitly requested review focus.
- There is no numeric cap. Select every materially justified, non-overlapping scope and omit the rest.
- Add `security-review` for authentication, authorization, secrets, untrusted input, uploads, database queries, file-system operations, APIs, payments, privacy, cryptography, or another trust boundary.
- Add `review-game` for material engine, game-loop, state, event, asset-lifecycle, gameplay-performance, scoring, session, or anti-cheat concerns.
- Add `code-dedup` when the repository contains `.deslop.toml` and the candidate adds or materially changes repeated helpers, fixtures, parsers, route handlers, implementations, or another plausible clone surface. It supplies duplicate evidence only. Ponytail remains a separate YAGNI and simplification pass.
- Use changed paths, the nearest manifest, and framework imports to add every matching installed domain review whose expertise is absent from the primary. Mixed-language candidates may select several profiles.
- Use a GitHub feedback workflow only when the user explicitly asks to inspect or fix that feedback. Use `ponytail:ponytail-audit` only for an explicitly repository-wide audit.
- For a workflow trace, do not add code-only reviewers merely because the reviewed task mentioned or changed code. Add them only when the request also includes the code candidate.
- If the candidate includes code and `ponytail:ponytail-review` is available and is not primary, always add it as an advisory pass and run it last against the final code candidate.
- Do not automatically combine Matt `code-review` with another general-purpose review workflow merely because both are installed.

Announce the primary and complementary selections with one evidence-backed reason each. Assign each selected scope a priority:

1. Functional correctness, requested behavior, repository invariants, and merge readiness.
2. Security, privacy, data integrity, concurrency, transactions, payments, migrations, and compatibility.
3. Language, framework, platform, game-engine, and performance correctness.
4. Non-blocking architecture and maintainability.
5. Simplification, deletion, YAGNI, and over-engineering advice.

Selected tiers 1 to 3 are required. Tier 4 is required only when the requested verdict includes it. Tier 5 is advisory unless simplification is the primary intent.

## Review agent workflow traces

When the user asks whether a task, conversation, Skill choice, tool sequence, or agent workflow was handled correctly, review the execution trace directly. Freeze the exact task or conversation turn range, including material tool calls and outputs. Read the complete instructions for every Skill whose selection or behavior matters, plus the repository and global instructions active for that trace.

Check whether the chosen Skills matched the request, were actually loaded before their rules were relied on, preserved authorization boundaries, ordered external and repository mutations correctly, grounded claims in available evidence, and stopped or recovered at the right boundary.

Assign every accepted finding to its actual owner and recommend the root fix there:

- Panel or another product runtime owns issue eligibility, blocker evaluation, parent or leaf selection, binding, claim, and dispatch.
- A workflow Skill owns routing, composition, evidence handoff, fail-closed checks at its trust boundary, and its report contract.
- Repository or global instructions own local conventions such as branch names, verification gates, and mutation policy.
- The harness owns capability discovery, unavailable tools, and invocation mechanics.

Do not duplicate product scheduling rules inside adjacent Skills. A Skill may require a successful Panel result before mutation, but it must not become a second issue scheduler. A review-only request is read-only unless the user separately authorizes fixes.

## Freeze and execute

For a multi-scope, merge-readiness, repair-enabled, conflicting, or large-candidate review, read [references/review-policy.md](references/review-policy.md) in full before launching reviewers. A simple read-only single-scope review can execute directly from this entrypoint.

1. Freeze the exact comparison base and candidate SHA, one immutable dirty-worktree patch that includes relevant untracked files, or the exact workflow turn range with material tool outputs. Record the governing request, spec, instructions, whether fixes are authorized, and the validation needed for approval.
2. Run every required review against that same candidate. Keep independent scopes separate, deduplicate overlaps, and independently verify each proposed blocker against code, tests, the frozen trace, loaded Skill instructions, an explicit requirement, or a reachable failure path.
3. If fixes are authorized, batch only accepted blockers, validate the changed behavior, freeze the new candidate, and rerun required reviews whose evidence was invalidated.
4. For a code candidate, run the advisory Ponytail pass last. It cannot weaken correctness or security findings and cannot alone produce `REQUEST_CHANGES` unless simplification is primary.

## Report

Start with the candidate conclusion as a prominent Chinese heading. Map the internal verdict exactly:

- `APPROVE` -> `# 评审结论：通过`
- `REQUEST_CHANGES` -> `# 评审结论：阻断`
- `NO_VERDICT` -> `# 评审结论：暂无法判断`

Then report the execution status and stop reason in human-readable Chinese, retaining the stable token in parentheses for diagnostics:

```text
评审状态：<中文说明>（COMPLETE | BUDGET_REACHED | REVIEW_INCOMPLETE | CONFLICT | CIRCUIT_OPEN）
停止原因：<一句自然语言说明>
```

For a policy-governed review, use the status definitions and precedence in the reference. Status and verdict are independent: operational incompleteness does not imply `REQUEST_CHANGES`, and `APPROVE` requires `COMPLETE`, an unchanged candidate, every required review complete, validation passing, and no accepted blocker.

Present the final synthesis in Chinese unless the user requests another language. Put accepted findings first, ordered by severity and grouped by scope. For workflow-trace findings, name the responsible owner and repair target. Put advisory Ponytail findings last under `复杂度精简建议`.

Treat specialist output as evidence, not final copy. Rewrite terse tags, metrics, and English shorthand into natural language while preserving file paths, line references, concrete evidence, and estimated impact. In particular:

- Translate `Lean already. Ship.` to `无需精简。`
- Translate a positive `net: -<N> lines possible.` estimate to `预计这些建议合计可减少约 <N> 行代码。`
- Treat `net: -0 lines possible.` as no simplification finding and omit the zero-line metric.

The Ponytail section is advisory unless simplification is primary. Never use its `Ship` wording as the overall candidate conclusion, and never imply that a clean complexity pass proves correctness, security, or merge readiness.
