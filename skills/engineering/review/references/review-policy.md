# Review Policy

Read this policy for multi-scope, merge-readiness, repair-enabled, conflicting, or large-candidate reviews. The active repository and global `AGENTS.md` files own agent lifecycle, waiting, liveness, and circuit-breaker mechanics. Do not duplicate or override those mechanics here.

## Domain Profiles

Select profiles from changed paths, the nearest applicable manifest, and framework imports. Call the Skill tool with the exact installed Skill name exposed by the current harness.

| Evidence | Installed profile to prefer |
| --- | --- |
| Go files or `go.mod` | `golang-patterns` |
| C++ sources or a C++ target | `cpp-coding-standards` |
| Rust files or `Cargo.toml` | `rust-patterns` |
| Kotlin files or a Kotlin Gradle module | `kotlin-patterns`; add `kotlin-ktor-patterns` or `kotlin-exposed-patterns` only when the framework is present |
| Python files or a Python package manifest | `python-patterns` |
| FastAPI imports or dependency declarations | `fastapi-patterns` plus the Python profile |
| Flutter SDK in `pubspec.yaml` or Flutter project files | `flutter-dart-code-review`; use `dart-flutter-patterns` only for a distinct architecture question |

Select every material profile in a mixed-language candidate. A pattern profile supplies domain-specific review guidance, but does not become a second general verdict owner. Do not install a missing profile or fall back to a broad ECC prompt. Report a required missing profile as unavailable.

## Review Contract

Before the first required reviewer, freeze a contract containing:

- the exact candidate, comparison base, frozen diff, and separate code and non-code fingerprints;
- the requested verdict, whether fixes are authorized, the originating specification, repository rules, supported existing behavior, and validation plan;
- operational assumptions that could change the verdict, including deployment topology, migration phase, supported versions, platforms, providers, and trust boundaries;
- each selected scope's priority and `required` or `advisory` status;
- the budget and stop conditions below;
- a `Context decisions and exclusions` register reconstructed from the active task history, explicit user corrections, issue or specification, and repository documentation.

Give each context decision a stable ID and classify it as:

- `REQUIREMENT`: confirmed behavior or design;
- `NO_CHANGE`: an explicit decision not to modify something;
- `REJECTED`: a previously evaluated non-issue;
- `RESOLVED`: a finding already fixed and verified;
- `OUT_OF_SCOPE`: an explicit exclusion.

Record the source, affected behavior or paths, evidence or reason, and the condition that would invalidate each entry. Do not reopen one without the named invalidation condition and new evidence. Treat unsupported alternative designs as `DESIGN_PREFERENCE` and repeated excluded observations as `CONTEXT_REPLAY`.

## Finding Ledger And Evidence

Maintain one finding ledger across all selected scopes and repair rounds. Record a stable ID, candidate fingerprint, source, scope, severity, concrete evidence, violated invariant, related context decisions, proposed remedy, overlaps or conflicts, and disposition: `accepted`, `rejected`, `conflict`, `fixed`, `verified`, or `backlog`.

Before accepting a blocking finding, independently establish at least one of:

- a targeted test or runtime reproduction;
- a direct contradiction of an explicit requirement, repository invariant, or active context decision;
- a complete reachable code-path explanation with the concrete trigger and impact.

A reviewer severity or verdict alone is not proof. Merge duplicate findings under one ID and keep the strictest supported severity. Reject findings about unchanged code, resolved issues, preferences presented as requirements, and unsupported scope expansion.

Collect all reachable required results before editing so accepted blockers can be repaired as one batch. When remedies conflict, adjudicate once in this order: review priority, explicit user intent, repository and security or data-integrity invariants, reproducible evidence, then scope-specific guidance. Never let an advisory simplification undo or delay a required fix.

If evidence-backed required remedies remain irreconcilable, make no conflicting edit. Record the conflict and stop that repair path.

## Status And Verdict

Choose one execution status:

- `COMPLETE`: every required scope and gate has sufficient terminal evidence and orchestration ended normally;
- `BUDGET_REACHED`: the time, review-wave, or repair-round budget stopped the invocation;
- `REVIEW_INCOMPLETE`: a required scope or gate is unavailable, errored, cancelled, missing, interrupted, or liveness-unverified;
- `CONFLICT`: required evidence is available, but remedies remain irreconcilable and need a user decision;
- `CIRCUIT_OPEN`: the active orchestration circuit breaker ended a required path after repeated invalid operations.

When several conditions apply, status precedence is `CIRCUIT_OPEN`, `BUDGET_REACHED`, `REVIEW_INCOMPLETE`, `CONFLICT`, then `COMPLETE`. List secondary conditions separately.

Derive the candidate verdict independently:

- `APPROVE`: only with `COMPLETE`, an unchanged candidate, every required gate passing, and no accepted blocker;
- `REQUEST_CHANGES`: sufficient evidence establishes an accepted blocking finding or unresolved blocking conflict;
- `NO_VERDICT`: available evidence neither approves the candidate nor proves a blocker.

Operational failure, budget exhaustion, or circuit opening never becomes `REQUEST_CHANGES` without an accepted candidate finding.

## Bounded Execution

Unless the user supplies another explicit budget, allow at most three broad review waves, two material repair rounds, and 90 minutes of review orchestration. A broad wave means all required selected scopes review one frozen candidate. Run a deferred advisory Ponytail pass once after the final functional repair batch.

Persist the start time, wave and repair counts, candidate fingerprints, selected-scope mapping, context decisions, and finding ledger across compaction, interruption, error recovery, and user continuation. Resuming never resets the budget or authorizes duplicate reviewers.

For a candidate larger than 50 changed paths or a 200 KiB diff, partition the discovery wave by feature, ownership, commit, or trust boundary. Give each scope its relevant shard plus a cross-cutting manifest, then synthesize one verdict.

Run required scopes before advisory simplification. If fixes are authorized, batch accepted blockers, run targeted checks during repair, and run the shared full gate at most once per repair round. A material candidate change invalidates prior verdicts. Reuse an existing reviewer lane when the active orchestration surface supports follow-up work, and give it the exact delta, ledger, and new evidence.

At the third review wave, report newly discovered blockers instead of starting a fourth wave. At any budget limit, preserve completed evidence and report the latest candidate, completed gates, accepted findings, unresolved blockers, unavailable scopes, and smallest next repair batch.

## Synthesis

Let the primary workflow own the base correctness or merge-readiness verdict. Required complementary evidence may make the combined verdict stricter, never weaker. Keep explicitly requested overlapping verdict-owning workflows separate, and require all of them before overall approval.

After independent verification, a required complementary `CRITICAL`, `HIGH`, `REQUEST CHANGES`, or `BLOCK` result is merge-blocking. A required `WATCH` or `COMMENT` result withholds approval and produces `NO_VERDICT` unless stronger evidence establishes `REQUEST_CHANGES`. An unavailable required scope produces `REVIEW_INCOMPLETE`; an unavailable advisory scope does not change the required status.

Put only accepted findings in the final problem list. Deduplicate overlaps without weakening evidence. Show rejected, resolved, duplicate, contextual, or explicit no-change items only when they materially explain the verdict or the user requests audit detail.

Present advisory Ponytail findings last under `复杂度精简建议` and preserve the selected Ponytail workflow's output contract. They do not block approval or authorize automatic edits unless simplification is the explicit primary intent.
