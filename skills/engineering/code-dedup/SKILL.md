---
name: code-dedup
description: Prevent and investigate duplicate code with Deslop evidence. Use before adding non-trivial code in a Deslop-configured repository, or for duplicate-code, DRY, clone, copy-paste, and deduplication analysis.
---

# Code Dedup

Use Deslop to find reusable code before another copy is written and to investigate existing duplicate clusters. Return evidence and a recommended action. Do not edit the code yourself.

## Choose the query

- **Before authoring new code:** prefer the Deslop MCP `find-similar` tool. Send the proposed snippet and language, or an existing `path`, `start_byte`, and `end_byte` range when the draft is already in a file.
- **Reviewing a changed file or block:** use `duplicates` with `path`, plus `start_byte` and `end_byte` for a block.
- **Cleaning existing duplication across a repository:** start with `duplicates`, then use `cluster-by-id` only for the cluster being considered.
- **Checking why one exact pair was admitted:** use `compare-pair` with both concrete occurrences. Cluster mass ranks impact; it is not pair confidence.
- **Preparing a safe extraction:** use the read-only `merge-plan` for the selected cluster, then hand the evidence to `implement` rather than editing from this Skill.

Call `schema-doc` at most once per session when the response shape is unclear. Do not load it for every query.

## Interpret the evidence

- If `find-similar` returns no clusters but its `existing` list names an occurrence, the code already exists once. Prefer calling or extracting that implementation instead of creating a second copy.
- An `identical` or `nearly_identical` `kind` is a strong reuse signal. Prefer the canonical occurrence or extract one shared implementation.
- A `loosely_similar` or `same_behavior` `kind` requires reading both occurrences before deciding whether the behavior is genuinely distinct.
- A `structural_only` `kind` is shape evidence, not proof of duplication, and does not contribute to duplication figures. Treat sibling boilerplate as distinct when reuse would make the interface worse.
- Never hide a cluster, relax project thresholds, or introduce cosmetic differences merely to silence a finding.

Deslop evidence does not decide architecture by itself. Preserve a deliberate duplicate when the caller can name the boundary that makes coupling more expensive than repetition.

## Fall back to the CLI

When the MCP tools are absent, time out, or cannot reach the current repository, use the installed CLI from the repository root:

```bash
deslop . --notext --nohtml --no-color
```

Parse only `.deslop/deslop-report.json`. Exit code `3` means a configured duplication ceiling was exceeded and the report is still valid; treat other non-zero exits as failures.

The CLI cannot query an unwritten snippet. For a pre-authoring check, scan the current report for clusters covering the target file and neighboring implementations, then state that the caller must rerun the scan immediately after writing the candidate. For an existing diff, compare the affected occurrences before and after the change and confirm that the relevant cluster is gone, smaller, or deliberately retained.

If neither the Deslop MCP tools nor the `deslop` CLI is available, report the missing capability and stop the duplicate analysis. This Skill does not install Deslop, edit MCP configuration, or guess from memory. The repository's dependency-aware installer owns optional installation and Codex MCP registration.

## Return

Report:

1. Query mode and inspected scope.
2. MCP or CLI path used.
3. Relevant cluster IDs, clone kinds, canonical occurrences, and affected locations.
4. One recommendation per cluster: reuse, extract, keep separate with a stated boundary, or investigate further.
5. Any limitation, including a required post-write CLI rerun.

Actual edits remain owned by `implement`, followed by the repository's normal tests and `review` closeout.
