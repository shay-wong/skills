---
"shay-skills": patch
---

Add the promoted, user-invoked `implement-spec` Skill. For configured non-Panel trackers, it reads a spec's tickets as a task graph, runs ready work across background worktrees, merges each result into one integration branch, and closes through the personal `review` workflow. Active Panel or Jira planning context remains owned by Panel, which dispatches leaf Issues to `implement` so remote and `.scratch` status stay synchronized. It opens or readies a PR only when the tracker or active request requires one.
