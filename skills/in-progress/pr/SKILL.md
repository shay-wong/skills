---
name: pr
description: "Write a reviewer-focused GitHub Pull Request body from the issue or spec, the change shape, before/after evidence, reversibility, and blast radius. Use for GitHub PR descriptions; use gitlab-mr for GitLab Merge Requests."
metadata:
  credits:
    skill: show-me
    author: Dex Horthy
    organisation: Humanlayer
    url: "https://github.com/humanlayer/skills/blob/main/plugins/show-me/skills/show-me/SKILL.md"
---

# GitHub PR

Write a GitHub Pull Request body that lets a reviewer understand the reason, verify the result, and judge merge risk without reconstructing the change from the diff.

## Platform boundary

- This Skill writes GitHub PR bodies. For GitLab Merge Requests, use `gitlab-mr`.
- Read the repository's GitHub PR template under `.github/` when one exists. Preserve its required sections and map the content below into that structure instead of replacing it.
- Writing a body does not authorize creating, updating, marking ready, merging, or otherwise mutating a GitHub PR. Perform those actions only when the active request authorizes them.

## Body shape

Use only the sections that add information:

```markdown
## Summary

<why the change exists and what behavior now differs>

<optional diagram, diff sketch, call tree, or file tree>

## Evidence

- **Before:** <observable failure or previous behavior>
  **After:** <observable result for the same input>

## Merge risk

**Reversibility:** <one-way or two-way>

**Blast radius:** <scope and affected consumers>
```

## Shared description rules

### Summary

Draw the reason from the primary source: the linked GitHub Issue, an approved spec, the active task, or another verified requirement. Use the repository's domain language from `CONTEXT.md` when available. The diff explains how the code changed; do not invent why from the diff alone.

Use the smallest visual that materially shortens review. Suitable forms include pseudocode, a call tree, a shallow file tree, a component tree, Mermaid control flow, or a focused `diff` sketch. Skip the visual when prose is clearer.

### Evidence

Prefer a before/after pair for the same input or action. Visual changes use screenshots when available; behavioral changes use the narrowest execution result that proves the transition. Name the behavior the evidence establishes. Do not turn the section into a list of every command run, and do not imply an unexecuted check passed.

### Merge risk

Call the change a **one-way door** when reverting it is expensive or cannot restore external state, such as a destructive migration or incompatible public contract. Call it a **two-way door** when it can be reverted or rolled forward cheaply. State the affected users, services, data, interfaces, or layouts as the blast radius. Omit speculative risks that are unsupported by the change.

Keep the body concise. GitHub-specific closing syntax such as `Fixes #123` is valid only when the linked Issue and intended close behavior are verified.
