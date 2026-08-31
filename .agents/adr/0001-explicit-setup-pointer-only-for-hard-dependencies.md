# Explicit `/configure-skills` fallback only for unresolved tracker dependencies

Engineering skills may receive their remote publication target from an active Panel or Jira planning context, or from per-repo config (issue tracker, triage label vocabulary, domain doc layout) seeded by `/configure-skills`. Some skills cannot meaningfully function until one of those sources resolves the target. Others only use repository setup to sharpen output and degrade gracefully without it.

We split these into three cases:

- **Context-aware dual-write** (`to-tickets`, `to-spec`): first reuse the installed model-invoked `manage-panel` Skill to resolve an active Panel or Jira planning context. When active, write complete `.scratch` artifacts first, then publish the same content remotely with the local relative paths recorded. Only when no such context is active do they require the tracker mapping from `/configure-skills`.
- **Context-aware execution lifecycle** (`implement`): when the task owns an active Panel Issue, reuse `manage-panel` to read and claim it before editing, then comment and move it to `in_review` after validation, review closeout, and any authorized commit. After each successful remote transition, mirror the returned `in_progress` or `in_review` state to the `.scratch` ticket named by `Local artifact`. Panel remains authoritative for concurrent transitions. Without an active Panel Issue, keep the implementation workflow tracker-neutral.
- **Configured hard dependency** (`triage`): include an explicit one-liner telling the human to run `/configure-skills` when the mapping is absent. Without that mapping, output is wrong, not just fuzzy.
- **Soft dependency** (`diagnose`, `tdd`, `improve-codebase-architecture`): reference "the project's domain glossary" and "ADRs in the area you're touching" in vague prose only. If the docs aren't there, the skill still works; output is just less sharp.

`manage-panel` remains owned and updated by Codex Panel. This repository routes to it when it is installed, but does not copy it or add it to the external dependency installer.

The split keeps soft-dependency skills token-light and avoids cargo-culting the setup pointer into places where it is not load-bearing.
