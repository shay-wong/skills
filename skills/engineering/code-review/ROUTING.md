# Review Routing And Evidence

The Matt `code-review` two-axis review remains the primary verdict owner. Add complementary passes only for distinct, evidenced concerns.

## Candidate contract

Before launching reviewers, freeze:

- the exact comparison base and candidate SHA, or one immutable dirty-worktree patch that includes relevant untracked files;
- the originating spec and repository rules;
- whether fixes are authorized;
- explicit requirements, no-change decisions, rejected or resolved findings, and out-of-scope items from the current task;
- the required validation plan and stop condition.

A material candidate change invalidates earlier verdicts. Reviewers may not reopen an explicit context decision without new evidence that invalidates its recorded premise.

## Complementary passes

| Signal | Add | Status |
| --- | --- | --- |
| Authentication, authorization, secrets, untrusted input, uploads, APIs, payments, privacy, cryptography, or another trust boundary | `security-review` when installed | Required |
| A language, framework, or platform concern that the base axes cannot evaluate deeply | The matching installed domain review Skill | Required only when correctness depends on it |
| The user explicitly asks to simplify, delete, remove dependencies, or audit over-engineering | `ponytail-review` when installed | Advisory unless simplification is the main request |
| The user explicitly asks to address GitHub review comments | The installed GitHub feedback workflow | Required for that request |

Do not automatically run another general-purpose code-review workflow. Explicitly requested overlapping gates stay separate and must all complete before approval.

## Severity and evidence

- `CRITICAL`: exploitable security issue, data loss, production breakage, or severe reachable correctness failure.
- `HIGH`: significant reachable bug, required contract failure, build breakage, or likely user-facing regression.
- `MEDIUM`: real edge case, maintainability, performance, or design concern that is not currently blocking.
- `LOW`: optional improvement or style issue not enforced elsewhere.

Before accepting a blocking finding, independently establish at least one of:

- a targeted test or runtime reproduction;
- a direct contradiction of an explicit requirement or repository invariant;
- a complete reachable code-path explanation with the concrete trigger and impact.

A reviewer label alone is not proof. Reject duplicates, preferences presented as requirements, findings already resolved, and claims about unchanged code without material evidence.

## Final status

Report these fields before findings:

```text
Review status: COMPLETE | REVIEW_INCOMPLETE | CONFLICT
Candidate verdict: APPROVE | REQUEST_CHANGES | NO_VERDICT
Stop reason: <one concise sentence>
```

- `APPROVE` requires an unchanged candidate, every required pass complete, validation passing, and no accepted blocker.
- `REQUEST_CHANGES` requires at least one accepted blocking finding.
- Operational failure or a missing required pass produces `REVIEW_INCOMPLETE` plus `NO_VERDICT` unless completed evidence independently proves a blocker.
- Use `CONFLICT` only when evidence-backed required remedies remain irreconcilable after arbitration.

Keep Standards and Spec findings in their separate Matt axes. Put complementary findings after them, deduplicate overlaps without weakening the stricter evidence, and put advisory simplification last.
