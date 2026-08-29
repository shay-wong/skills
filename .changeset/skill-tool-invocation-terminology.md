---
"shay-skills": patch
---

Standardize cross-skill invocation on an explicit "call the Skill tool" instruction instead of bare `/skill`-style prose, with a Codex available-Skills catalog fallback, across `code-review`, `diagnosing-bugs`, `grill-with-docs`, `grill-me`, `improve-codebase-architecture`, `tdd`, `to-spec`, `to-tickets`, `triage`, and `wayfinder`.

- A skill that names another skill in prose ("run the `/grilling` skill") does not reliably cause it to load. Naming an available invocation tool directly raises the hit rate in runtimes that expose one. In Codex, callers locate the named Skill in the available-Skills catalog and read its complete `SKILL.md` instead of duplicating the workflow.
- A step needing more than one skill now says so as multiple calls ("Call the Skill tool twice, for `grilling` and `domain-modeling`"), not one call carrying two names.
- Documents the tool-or-catalog convention in `.agents/invocation.md` for future skills to follow.
