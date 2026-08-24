---
name: implement
description: "Implement a piece of work based on a spec or set of tickets."
disable-model-invocation: true
---

Implement the work described by the user in the spec or tickets.

Before editing, read the target files, direct callers, exports, shared utilities, and repository instructions needed to understand the real path. Reuse existing patterns. Check official documentation for unfamiliar APIs, and do not add a dependency unless it is necessary and fits the repository.

Keep the settled spec or tickets authoritative. Do not reopen their product decisions. State any assumption that blocks correctness, split the work into the smallest verifiable phases, and keep changes within the requested scope.

## Right-size the run

State the highest matching tier so the user can correct it:

| Tier | Typical shape | Required phases |
| --- | --- | --- |
| Trivial | One obvious local edit, no contract change | Implement, verify, review |
| Small | One function or file, clear after reading | Light plan, implement, verify, review |
| Standard | Several files or one real design choice | Research if needed, plan, implement, verify, review |
| Large | Cross-cutting work, new dependency, public contract, or several open choices | Research, explicit plan, thin vertical slices, implement, verify, review |

Security-sensitive or public-contract changes are at least Standard. Present an explicit plan for Standard and Large work before implementation when the source spec or tickets do not already settle the sequence.

Choose the first implementation move by operation:

- **New behavior:** add one failing test for the first vertical slice, then implement it.
- **Changed behavior:** update the existing behavioral test or add one that expresses the new contract, then change the implementation.
- **Broken behavior:** reproduce the defect with a failing regression test before fixing it. If the root cause is unclear, use `diagnosing-bugs` first.
- **Behavior-preserving refactor:** establish relevant tests are green; add characterization coverage only where behavior is otherwise unprotected, then restructure in small green steps.
- **MVP from a spec:** order the spec into thin end-to-end slices and stand up the first runnable path before broadening it.

Use /tdd when its risk gate applies, at pre-agreed seams. Implement the smallest behavior that passes before taking the next slice.

Run focused tests while working. Run the repository's relevant typecheck, lint, build, and broader test gates once the change is stable, proportionate to the affected surface. Report any validation gap explicitly.

Once done, use /code-review. Security-sensitive changes receive the security complementary pass described there. Address accepted blocking findings within scope.

Before committing, present the stable diff summary and proposed logical commit groups. Commit through /commit only when the active request authorizes commits, so independent changes stay separately reviewable. Do not push or alter remote state unless separately requested.
