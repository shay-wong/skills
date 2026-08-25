---
name: review
description: "Orchestrate one primary review plus installed, non-overlapping complementary reviews, then synthesize one evidence-backed verdict."
---

# Review

Act as the personal review entrypoint. Select one primary review workflow, add only installed complementary review Skills with distinct scopes, and synthesize one verdict against one frozen candidate.

## Discover available reviewers

Use the current harness's authoritative available-Skills catalog. A model-visible Skill is available; do not rescan it. Only when the catalog is absent or known to omit local or plugin Skills, run `scripts/discover-review-skills.sh` from this Skill directory as fallback. Count a plugin-cache Skill only when its plugin is enabled.

Do not rely on install-time discovery. The supported `npx skills` installer has no repository post-install hook, and local plugins can change after installation.

Missing optional Skills are reported once and skipped. Never install, enable, disable, copy, or update another Skill or plugin as part of a review.

## Route the review

Choose the primary workflow from the user's main intent:

| Main intent | Primary |
| --- | --- |
| General branch, pull request, working-tree, standards, or spec review | Call the Skill tool with `code-review` when available; otherwise perform a direct correctness and requirements review |
| Security or trust-boundary review | Call the Skill tool with `security-review` when available |
| Simplification, deletion, YAGNI, or over-engineering review | Call the Skill tool with `ponytail:ponytail-review` when available |
| A named language, framework, platform, or game review | Call the matching installed model-invoked Skill |

Add a complementary review only when its scope is distinct from the primary:

- Add `security-review` for authentication, authorization, secrets, untrusted input, uploads, APIs, payments, privacy, cryptography, or another trust boundary.
- Add the matching installed domain review when correctness depends on language, framework, platform, or game expertise absent from the primary.
- Do not add another general-purpose code review merely because it is installed.
- If `ponytail:ponytail-review` is available and is not primary, always add it as an advisory pass and run it last against the final candidate.

Announce the primary and complementary selections with one reason each before running them.

## Freeze and execute

1. Freeze the exact comparison base and candidate SHA, or one immutable dirty-worktree patch including relevant untracked files. Record the spec, repository rules, whether fixes are authorized, and the validation needed for approval.
2. Run required reviews against that same candidate. Keep independent review scopes separate, deduplicate overlapping findings, and independently verify every proposed blocker against code, tests, an explicit requirement, or a reachable failure path.
3. If fixes are authorized, batch only accepted blocking findings, validate the changed behavior, freeze the new candidate, and rerun required reviews whose evidence was invalidated.
4. Run the advisory Ponytail pass last. Its findings cannot weaken correctness or security findings and cannot alone produce `REQUEST_CHANGES` unless simplification was the explicit primary intent.

## Report

Start with:

```text
Review status: COMPLETE | REVIEW_INCOMPLETE | CONFLICT
Candidate verdict: APPROVE | REQUEST_CHANGES | NO_VERDICT
Stop reason: <one concise sentence>
```

Present accepted findings first, ordered by severity and grouped by review scope. Put advisory Ponytail findings last. Report skipped or unavailable optional reviews without treating them as failures. `APPROVE` requires an unchanged candidate, every required review complete, validation passing, and no accepted blocker.
