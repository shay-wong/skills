## What it does

`review` is one entrypoint over the review Skills available on the current machine. It freezes one candidate, selects one primary workflow, adds only complementary scopes, and synthesizes one evidence-backed verdict.

Availability is resolved again on every invocation. The current agent's Skill catalog is used directly when it is authoritative; filesystem scanning is only a fallback for harnesses that omit local or plugin Skills. If Ponytail is enabled and `ponytail-review` is available, general reviews add it as the final advisory pass. The review never installs or changes plugins.

## When to reach for it

Type `/review`, or the agent reaches for it automatically when you ask for a general review that may need installed specialists.

| Your situation | Reach for |
| --- | --- |
| You want one general entrypoint that can combine installed review specialties | `review` |
| You only want repository standards and spec compliance | [code-review](https://aihero.dev/skills-code-review) |
| Simplification is the main question | `review`, with Ponytail selected as primary when available |
| You already know the exact specialist you want | Invoke that specialist directly |

## One primary, distinct complements

The primary workflow owns the verdict. Complementary Skills are added only when they answer a different question, such as a security boundary or framework-specific correctness concern. Another general code reviewer is not added merely because it is installed.

Ponytail is the deliberate exception for general reviews: when available, it runs last and reports what can be deleted or simplified. Its advisory findings cannot weaken a correctness or security finding, and they do not block approval unless simplification was the explicit main request.

## Common questions

**Does installation wire Ponytail into `review`?**

No. The supported `npx skills` installer has no repository post-install hook. `review` first reuses the current agent's available-Skills catalog, then scans the local set only when that catalog cannot establish availability. This still notices plugins installed or removed later without paying for duplicate discovery in the normal case.

**What happens when Ponytail is missing or disabled?**

The review reports it as unavailable and continues. It does not install, enable, or copy Ponytail.

**Does this replace `code-review`?**

No. [code-review](https://aihero.dev/skills-code-review) remains the normal primary for Standards and Spec. `review` owns selection, optional complementary passes, deduplication, and the combined verdict.

## It's working if

- Every pass reviews the same frozen candidate.
- The report names one primary and explains every complementary selection.
- An available Ponytail review appears last on a general review.
- Missing optional Skills are skipped without turning the review into a failure.
- Only independently verified blocking findings can produce `REQUEST_CHANGES`.

## Where it fits

`review` is a reach-for-it-anytime orchestration entrypoint around [code-review](https://aihero.dev/skills-code-review) and locally installed specialists. [ask-matt](https://aihero.dev/skills-ask-matt) routes to it when the review needs more than the two canonical Standards and Spec axes.
