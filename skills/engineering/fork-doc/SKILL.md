---
name: fork-doc
description: "Audit fork differences, enforce <upstream>-fork.N releases, and sync agent rules, FORK.md, user docs, and changelog. Use before upstream merges, fork releases, or capability changes."
---

# Fork Doc

Create an evidence-backed, capability-oriented documentation set for a fork. Work in the current repository unless the user names another one.

## Guardrails

- Read applicable `AGENTS.md` files, public user documentation, changelogs, and repository rules before auditing.
- Preserve dirty, staged, and untracked user work. This skill must not initiate or broaden Git operations. When invoked standalone, do not merge, rebase, reset, discard, stage, commit, or push. When invoked inside a parent workflow that already authorizes specific merge, rebase, release, or commit operations, inherit only that exact authorization and never include unrelated work or push unless separately authorized.
- Keep the audit read-only until the maintainer confirms shared understanding. After confirmation, modify only the repository-owned `AGENTS.md` fork-workflow rule and the documentation set required by this skill: `FORK.md`, user documentation and indexes in every actively maintained language, and `CHANGELOG.md`. Do not modify feature code unless the user separately expands scope.
- Do not modify manifest, package, or other authoritative version files unless the user's task separately includes the version bump or release. Report the required normalized version when the current value conflicts with this skill's version policy.
- Do not install or change Git hooks, and never launch Codex or another AI workflow from a hook. Hook or CI enforcement is separate scope and must remain fast and deterministic.
- Discover facts from Git, files, tests, and configured remotes. Ask the user only for policy, product intent, and unresolved human decisions.
- Never record secrets, credentials, private endpoint values, or full API keys.
- Obey repository restrictions on lint, build, generation, tests, and external network access.
- Treat standalone documentation edits as uncommitted by default and require a separate explicit commit request. Do not require a duplicate commit request when an active parent workflow already authorizes the relevant commit-producing operation; integrate the synchronized documentation according to **Parent Git Workflow Integration** below.

## Phase 1: Establish The Evidence Base

1. Resolve the repository root, current branch, worktree state, remotes, and remote default branches. Prefer a remote named `upstream`; otherwise identify the authoritative source remote from URLs and history.
2. Inspect existing `FORK.md`, fork notes, merge guides, changelogs, ADRs, and repository rules before inventing a format. Build an existing-decision register from their agent-workflow, release-version, document-routing, maintained-language, capability-lifecycle, changelog, invariant, and merge-policy decisions. Mark each decision as still supported by current repository evidence, contradicted by current code or upstream history, conflicting across documents, or insufficiently supported. Treat existing documents as reusable evidence, not automatically current truth.
3. Identify the latest upstream merge on the current branch's first-parent history. Inspect its parents and determine which parent is the upstream commit.
4. Use that upstream parent as the comparison baseline. The moving `upstream/<default>` tip is a pending merge candidate, not the baseline.
5. Audit `baseline..HEAD` by file, commit, and behavior, then inspect relevant staged, unstaged, and untracked working-tree changes separately. Read current code plus originating commits; do not infer intent from commit subjects alone, and do not omit a new capability merely because it is not committed yet.
6. Inspect merge commits with `git show --remerge-diff` only when a manual resolution may carry current fork behavior. Treat material invariant-preserving changes embedded in a merge commit as a history-structure issue: the functional change should have been isolated in a dedicated post-merge commit, not represented by a documentation-only follow-up.
7. Inspect locally available pending upstream commits for possible absorption or special merge guidance. Do not classify unmerged upstream-only changes as fork features.
8. If the baseline or authoritative upstream parent cannot be determined unambiguously after inspection, include that as a confirmation question in the first batch.
9. For every active capability, determine whether it is user-visible, locate its user documentation and changelog coverage, and identify stale, missing, or duplicated documentation. Resolve the repository's actively maintained language set from repository rules, `FORK.md`, parallel documentation trees, language switches, and explicit maintainer decisions. A localized entry point that only links to another language is link-only coverage, not a maintained full translation.
10. Inspect the repository-owned `AGENTS.md` that governs the repository root. Treat its fork rule as complete only when it covers the workflow trigger, reuse of still-valid decisions, and the `<upstream-version>-fork.<N>` release policy. Reuse a complete active rule without duplication; treat a missing or partial rule as required maintenance.
11. Resolve the authoritative version source at the exact merged upstream baseline, the current fork version sources, and matching released tags or release records. Distinguish a released fork revision from an already-prepared but unreleased next revision.

Exclude:

- Pure upstream merge commits with no intentional manual resolution.
- Formatting-only changes, generated-output noise, local environment files, and ignored artifacts.
- Changes whose net effect was reverted.
- Behavior already absorbed equivalently by the merged upstream baseline.
- Unmerged upstream-only behavior.

Group the remaining differences by capability, not by commit. One capability may span backend, frontend, schema, generated files, tests, and multiple commits.

## Phase 2: Batch The Maintainer Decisions

Build a decision tree. Seed it with every still-supported decision from Phase 1 as settled. Do not ask again when existing documentation and the current implementation agree. Put only new capabilities, behavior or upstream changes, conflicting documents, missing policies, invalidated prior decisions, and genuinely unresolved choices on the current **frontier**. When current evidence conflicts with a prior decision, show the prior decision, the conflicting evidence, and a recommended resolution in the question. A question is on the frontier when every decision it depends on is already settled.

Treat a missing or incomplete repository-level fork-workflow rule as required maintenance, not a recurring policy question. Include its first creation or completion in the shared-understanding summary. Ask only when existing repository rules conflict with adding or updating it.

Treat fork release versioning as a fixed policy, not a maintainer decision:

- Format every fork release as `<upstream-version>-fork.<N>`; never release a fork build under the plain upstream version.
- When the merged upstream baseline's version changes, start that base at `fork.1`.
- For another fork release on the same upstream version, increment `N` from the highest released matching revision. Retain an already-prepared unreleased next revision when it is still unused.
- Treat an existing incompatible repository policy as stale. Ask only when the authoritative upstream version cannot be determined or the repository's release toolchain cannot represent the required format.

For each round:

1. Ask every independent frontier question together in one numbered list.
2. Give a recommended answer for every question, grounded in repository evidence and the maintenance impact.
3. Keep each numbered item to one decision. Do not combine dependent decisions in the same round.
4. Tell the user they may reply `全部同意` or list only exceptions such as `3 改为长期保留`.
5. Apply accepted recommendations without asking them again. Recompute the frontier from only the unresolved or newly unblocked decisions.
6. Investigate factual gaps yourself while the user considers policy decisions.

Typical decision tracks include:

- Document path, language, and audience.
- Per-language user-documentation indexes and per-capability page structure.
- Which capabilities are user-visible and therefore require user documentation and changelog coverage.
- Translation policy: actively maintained languages, per-language indexes and feature pages, and link-only localized entry points.
- Which differences are intentional and still active.
- Capability boundaries when several commits implement one contract.
- Long-lived fork policy versus changes expected to be absorbed upstream.
- Behavior invariants that conflict resolution must preserve.
- Upstream absorption and deletion conditions.
- Verification depth and repository-specific command constraints.
- Special handling for known pending upstream commits.
- Commit-set composition for feature code, tests, user documentation, `FORK.md`, and `CHANGELOG.md`, including whether an important manual resolution requires its own functional commit after the merge.

Do not ask a track when repository evidence or an earlier answer already settles it. Do not serialize independent capability classifications into one-question rounds.

When the frontier is empty, present a compact shared-understanding summary covering the baseline, inclusion rules, lifecycle decisions, maintenance policy, user-documentation routing, changelog policy, and document shape. Distinguish reused prior decisions from decisions added or changed in the current audit. Wait for explicit confirmation before writing.

## Phase 3: Synchronize The Fork Documentation Set

### Parent Git Workflow Integration

- Standalone `$fork-doc`: leave every documentation edit uncommitted.
- Non-fast-forward merge paused before its merge commit: keep the merge commit limited to the upstream integration and routine mechanical conflict resolution. Include synchronized baseline and merge-policy documentation that belongs to the integration, record only the exact merged upstream commit as the baseline, and never record the fork-side merge commit or insert a placeholder for its future SHA.
- Important manual merge resolution: when preserving a fork invariant requires a material hand-written change, do not bury that change in the general merge commit and do not create a documentation-only history record for it. Finish the mechanical integration, then place the complete invariant-preserving change in an immediate dedicated functional commit or capability-scoped commit set containing every applicable code, configuration, schema, generated output, test, `FORK.md`, user-documentation, and changelog change. Use the current-change locator rule when documentation in that commit cannot know its own future SHA. Routine mechanical resolutions may remain in the merge commit and need no separate anchor.
- Existing embedded resolution history: if an earlier merge already contains a material invariant-preserving change, report the history-structure gap. Split it only when the parent workflow explicitly authorizes rewriting that exact history and it is safe to do so; otherwise preserve history and document the active invariant without pretending that a documentation-only commit separated the functional change.
- Rebase, cherry-pick, or another authorized history rewrite: place capability-specific documentation in the rewritten commit that owns the behavior when practical. Put cross-cutting baseline or merge-policy documentation in one immediate follow-up commit only when the parent workflow authorizes commits; do not rewrite unrelated commits merely to absorb documentation.
- Feature or release workflow with an authorized commit: include its code, tests, user documentation, `FORK.md`, and `CHANGELOG.md` in the same logical commit or commit set.
- Fast-forward merge, or a merge already finalized before synchronization: do not amend or rewrite existing history without explicit rewrite authorization. Create an immediate follow-up documentation commit only when the parent workflow's authorization covers it; otherwise leave the edits uncommitted and report the exact gap.

The parent workflow defines whether a commit may be created. This skill defines which fork documents must accompany the change; it never creates broader Git authority by being invoked.

Route documentation by capability before writing:

- A maintainer-only, build-only, merge-only, or internal compatibility difference belongs in `FORK.md` only unless repository conventions require another internal document.
- A public API or user-observable behavior added, changed, or removed in the current unreleased work must update its user documentation in every actively maintained language, the relevant per-language indexes and root entry points, the corresponding `FORK.md` entry, and `CHANGELOG.md` together.
- A documentation-only reorganization does not need a changelog entry unless repository conventions treat documentation changes as release notes.
- An audit of already released, unchanged behavior must not fabricate a new historical changelog entry. Confirm existing release coverage and add only missing current documentation or maintenance references.

Resolve the maintained-language matrix before writing. Prefer explicit repository rules or an existing `FORK.md`; otherwise use parallel documentation structure and maintainer decisions. Do not silently choose one canonical language when the repository declares multiple fully maintained languages, and do not count a cross-language link as a translated feature page.

### Maintain Repository AGENTS.md

Use the repository-root `AGENTS.md` unless repository rules designate another repository-owned file that governs the whole tree. If none exists, create the root file after shared-understanding confirmation and include the complete workflow and version policy in that first write.

- Preserve existing instructions and generated or tool-owned regions. Add the rule outside generated markers unless the repository defines a supported overlay location.
- Keep exactly one semantically equivalent rule. Reuse it unchanged only when it covers every requirement below; complete an existing partial rule instead of adding a second one.
- Require agents, before completing a task that adds, changes, or removes intentional fork behavior or merges upstream, to invoke `$fork-doc`; when the skill is unavailable, require them to follow the maintenance contract in `FORK.md` manually.
- Require reuse of still-valid decisions recorded in `FORK.md` and reconsideration only when current evidence adds, contradicts, invalidates, or leaves a decision unresolved.
- Require every fork release to use `<upstream-version>-fork.<N>`, reset to `fork.1` when the upstream version changes, and increment `N` for subsequent releases on the same upstream version.
- Do not add Git-hook installation or AI invocation instructions.

### Maintain FORK.md

Use root `FORK.md` unless an existing repository rule requires another location. Match the repository's documentation language; when no convention exists, match the user's language.

The document must address maintainers and AI coding agents and contain:

1. **Purpose and maintenance contract**
   - Record only active, intentional fork differences.
   - Update the relevant entry in the same logical commit or commit set whenever fork behavior is added, changed, or removed, following **Parent Git Workflow Integration**. For public capabilities, synchronize feature code, tests, user documentation and indexes in every actively maintained language, `FORK.md`, and `CHANGELOG.md`.
   - Remove an entry once merged upstream behavior and regression coverage are equivalent.
   - Treat invariants, not conflict-file ownership or similarly named fields, as the merge-review standard.
   - Define the repository's documentation responsibilities and maintained-language matrix so maintainers know which documents serve users and which document governs upstream merges.
2. **Exact upstream baseline**
   - Current fork branch.
   - Upstream default branch.
   - Exact merged upstream commit as a full SHA. For a non-fast-forward merge, use its upstream parent, not the fork-side merge commit.
   - Comparison range from that upstream SHA to the current fork branch.
   - A warning that the moving upstream tip is not the document baseline.
3. **Fork release version policy**
   - Authoritative upstream and fork version-source paths.
   - Upstream version at the exact merged baseline and the current fork version.
   - Required `<upstream-version>-fork.<N>` format.
   - Reset `N` to `1` when the upstream version changes; increment it for later fork releases on the same upstream version.
   - Record any current mismatch and its required normalized next version without silently changing version files outside the authorized task scope.
4. **Capability entries**
   - Lifecycle.
   - Original intent.
   - Required invariants.
   - Current code and test paths.
   - User-documentation paths for every actively maintained language when the capability is user-visible, or an explicit maintainer-only classification when no user documentation is appropriate.
   - Originating commits. Use the dedicated post-merge functional commit as the origin for an important invariant-preserving resolution; do not use the general merge commit as its normal capability anchor. For a new uncommitted capability or documentation included in that dedicated commit, record it as part of the current change and use a stable post-commit locator such as `git log -S'<distinctive symbol>' -- <path>` instead of embedding the capability's own future SHA recursively. Report legacy embedded resolutions as history-structure gaps unless an explicitly authorized rewrite actually separates them.
   - Merge-review guidance.
   - Absorption or removal condition.
   - Focused verification commands or checks.
5. **Upstream merge checklist**
   - Re-establish the exact baseline after every merge.
   - Review long-lived invariants and upstream-absorption candidates separately.
   - Determine the next fork release version after the merge: use `<upstream-version>-fork.1` when the upstream version changed, otherwise increment the existing base's released fork revision. Do not bump a version merely because the audit ran.
   - Regenerate generated outputs from their source definitions when repository rules require it.
   - Update code, tests, and `FORK.md` in the same logical commit or commit set under **Parent Git Workflow Integration**; synchronize every actively maintained user-documentation language, its indexes and root entry points, and `CHANGELOG.md` for public changes.
6. **Explicit exclusions**
   - Record notable reverted, local-only, generated-only, or upstream-only items when their exclusion prevents future confusion.

Prefer two lifecycle labels unless the maintainer chose otherwise:

- `长期保留`: a fork product, operations, release, compatibility, or policy contract.
- `等待上游吸收`: a general fix or time-sensitive dataset that can be removed after equivalent upstream behavior and tests land.

Keep entries concise enough to scan during a conflict, but specific enough that another maintainer or coding agent can reconstruct the intended behavior without relying on chat history.

### Maintain User Documentation

Discover and follow the repository's existing public documentation structure. Do not force a fixed directory when the repository already has a clear convention.

- Record the actively maintained language set in the repository documentation contract when one exists. Treat other localized entry points as link-only unless the repository explicitly commits to full translations.
- Keep the root README for each actively maintained language as a discoverable package or repository entry point with a concise feature list, minimal usage, and links to guides in the same language.
- Maintain one detailed location per public capability in each actively maintained language: an existing topical guide or a dedicated feature page under that language's public documentation tree. Avoid duplicate full guides within the same language.
- Maintain a public fork-capability index in each actively maintained language when the fork has or is expected to have multiple public differences.
- Document what users need to adopt the capability: purpose, availability, API or configuration, defaults, examples, errors or edge cases, and migration steps when behavior is breaking.
- Add reciprocal language switches where the repository convention supports them. Keep API names, code examples, defaults, errors, edge cases, and migration behavior semantically aligned across maintained translations; prose need not be sentence-for-sentence identical.
- Avoid copying the full guide into every README. A locale outside the maintained-language set may link to a maintained guide instead of carrying a stale translation.
- Remove or redirect obsolete user documentation when upstream absorbs a capability or the fork removes it.

### Maintain CHANGELOG.md

Follow the repository's existing changelog format and current unreleased or active release section.

- Add or update one concise user-impact entry for every current user-visible fork capability that is added, changed, removed, deprecated, or made breaking.
- Describe observable behavior and migration impact, not internal implementation or merge mechanics.
- Keep related changes in one capability-oriented entry when that matches the changelog style.
- Do not rewrite released history, invent dates or versions, or add entries for internal-only maintenance and documentation layout changes unless repository policy explicitly requires them.
- Confirm the changelog entry, all actively maintained user guides, and the `FORK.md` capability entry describe the same behavior and lifecycle.

## Phase 4: Validate Before Reporting

Validate the completed documentation set proportionally to its claims:

1. Inspect the full diff for the repository-owned `AGENTS.md`, `FORK.md`, user documentation and indexes in every actively maintained language, and `CHANGELOG.md`, including untracked new files.
2. Confirm every referenced code, test, and documentation path currently exists; validate relative links and anchors where practical.
3. Confirm every explicit commit anchor resolves. Intentional local anchors should belong to current history; explicitly identified pending upstream anchors may be outside it. A new uncommitted capability may use a clearly labeled current-change marker and a verifiable post-commit history locator instead of an unavailable SHA.
4. Inspect each non-empty `git show --remerge-diff` relevant to an active capability. Confirm routine mechanical resolutions are not misclassified as fork capabilities, and confirm every material invariant-preserving change created by the current workflow lives in a dedicated functional commit or capability-scoped commit set after the merge, with its applicable tests and documentation. For legacy changes still embedded in merge commits, confirm the report identifies the history-structure gap rather than claiming a documentation-only follow-up separated it.
5. Confirm each capability entry contains every required field, uses an approved lifecycle label, and records either its user-documentation paths for every actively maintained language or why it is maintainer-only.
6. Check verification package paths, test files, and `-run` patterns. A command must not silently target zero matching tests.
7. For every current user-visible change, confirm each actively maintained language has a discoverable root entry point, a complete guide, and an index entry when the repository maintains indexes. Compare API names, examples, defaults, errors, edge cases, and migration behavior across translations, and confirm the current changelog section records the change. Confirm link-only locales are not reported as full translations and internal-only changes did not leak into user-facing release notes.
8. Check modified Markdown fences and local links. Run `git diff --check`; for untracked documents, use an equivalent no-index whitespace check.
9. Do not run lint, build, generation, or broad test suites unless repository rules and the user's request authorize them. Run focused documentation or link checks when available.
10. Re-read worktree status and distinguish documentation edits from pre-existing changes.
11. Confirm the repository-level `AGENTS.md` contains exactly one complete fork-workflow rule covering its trigger, decision reuse, and `<upstream-version>-fork.<N>` policy; preserves unrelated and generated instructions; and does not direct Git hooks to launch an AI workflow.
12. Confirm the documented upstream base and current fork version follow `<upstream-version>-fork.<N>`. For a current release candidate, confirm its `N` is unused and consistent across authoritative version sources and release tags; report mismatches without changing version files outside the authorized scope.

Report the repository-level `AGENTS.md` and `FORK.md` paths, upstream base and current or required normalized fork version, actively maintained languages and their user-documentation paths, changelog section, baseline, capability counts, validation evidence, unresolved risks, and whether the files remain uncommitted or were integrated through an authorized parent Git workflow. When committed, report the exact commit or rewritten commit set.
