---
name: personal-development-workflow
description: "Apply Shay's feature-development workflow: research/reuse before new implementation, plan when needed, TDD for risky changes, targeted review, and verified completion. Use for feature work, bug fixes, refactors, and implementation planning."
---

# Personal Development Workflow

Use this skill for nontrivial feature work, bug fixes, refactors, or implementation planning.

## Workflow

1. Research and reuse before net-new implementation:
   - Search the current repo for existing patterns.
   - Prefer structured codebase retrieval or targeted search over broad unbounded scans.
   - Before coding, read enough target files, direct callers, exports, and shared utilities to understand local behavior.
   - Check official docs for unfamiliar SDKs, frameworks, or APIs.
   - For package or SDK choices, compare existing usage, maintenance, license, security, and fit before adding dependencies.
   - Prefer proven local or open-source approaches over hand-rolled utilities when they meet the requirement.
2. Plan only as much as the task needs:
   - Identify success criteria, affected files, dependencies, and risks.
   - State key assumptions and ambiguity instead of silently filling gaps.
   - Split work into the smallest verifiable phases.
3. Use TDD where risk justifies it:
   - Write or identify a failing regression test first for bug fixes and risky behavior changes.
   - Implement the smallest change that passes.
   - Refactor after tests pass.
4. Review before claiming completion:
   - Check security-sensitive changes first.
   - Check code quality, error handling, validation, and performance concerns.
   - Address critical and high issues inside scope.
5. Verify:
   - Run targeted tests for changed behavior.
   - Run typecheck/lint/build when the changed files require it and the project provides commands.
   - Report validation gaps explicitly.

For long multi-step tasks, checkpoint important phase boundaries with completed work, verified evidence, and remaining items. If the current state cannot be clearly restated, pause to reorient before continuing.

## Delegation

- Use native subagents only for independent bounded subtasks where parallelism improves speed, quality, or confidence.
- Avoid delegating trivial work or using delegation instead of reading the code.
- For reviewer/verifier prompts, prefer command-native working directory flags such as `git -C <repo>` or `npm --prefix <path>` over inline `cd ... && ...` commands.
