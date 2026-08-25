---
name: decision-notes
description: Capture and maintain repository-local decision records as existing ADRs or classified Agent Notes. Use when a non-trivial choice, rationale, alternative, consequence, or supersession should remain discoverable after the session.
metadata:
  origins: affaan-m/ECC architecture-decision-records, czm15053/write-notes-like-deepseek
---

# Decision Notes

Keep the reason for an important decision beside the work it governs. A durable record explains the problem, the chosen direction, the alternatives that lost, the consequences, and the evidence that the decision works.

This Skill has one canonical entry point and two compatible storage modes. Follow the repository's existing convention. Never create both an ADR and an Agent Note for the same decision.

## When a Record Is Worth Keeping

Record a decision when a future maintainer will reasonably ask why it exists:

- runtime behavior, UI behavior, or a cross-file contract changes;
- architecture, data model, API, persistence, security, infrastructure, or dependency boundaries change;
- a process, quality gate, test strategy, or release policy changes;
- multiple credible alternatives were considered and one was selected;
- a previous decision is rejected, deprecated, archived, or superseded.

Skip formatting-only edits, unambiguous renames, typo fixes, import ordering, and choices whose rationale is already obvious from the code.

Decision signals include "use X instead of Y", "we decided", "the trade-off is worth it", "record this", "ADR this", and questions such as "why did we choose X?".

## Select One Home

Read `AGENTS.md`, `CLAUDE.md`, contribution guides, and existing decision directories before writing. Search for an existing record that owns the same decision.

| Condition | Action |
| --- | --- |
| A matching ADR or Agent Note already exists | Update that record instead of creating another |
| The repository uses numbered `docs/adr/` records and this is a durable architecture decision | Use ADR mode |
| The repository documents another decision convention such as `docs/decisions/` | Follow that convention and apply the shared content contract |
| The repository uses `.agents/notes/` or the decision concerns a feature, bug fix, simplification, process, or test strategy | Use Agent Note mode |
| No convention exists | Use the smallest Agent Note tree needed for the current record |
| Both systems exist | Route by the rows above and keep one decision in one file |

An explicit request to record the decision or a repository rule authorizes the local record. An implicit signal alone does not expand an unrelated task: report the candidate decision without creating a file unless the repository already requires decision notes.

During planning or review, enforce a missing-record gate only when repository policy requires one.

## Shared Content Contract

Every record must contain:

1. The problem or context, understandable without knowing the chosen solution.
2. The current proposal or implemented decision.
3. The real alternatives considered and why each lost.
4. Positive and negative consequences, including risks and reintroduction conditions.
5. Verification evidence or acceptance criteria appropriate to its lifecycle.
6. A status that matches the file's actual state.

Use present tense for implemented or accepted decisions. Preserve searchable mechanism names, invariants, ownership, failure behavior, and timing. Remove chat, draft, review, and reasoning-process narration that a reader cannot verify from the repository.

## ADR Mode

Use ADR mode for hard-to-reverse architecture decisions in a repository that already treats `docs/adr/` as its decision log.

### Path and Numbering

Store ADRs at `docs/adr/NNNN-topic.md`. Scan existing filenames, increment the highest number, and preserve gaps. Maintain `docs/adr/README.md` when the repository uses an index; add or update the ADR row in the same change.

### ADR Format

```markdown
# ADR-NNNN: <title>

**Date**: YYYY-MM-DD
**Status**: proposed | accepted | deprecated | superseded by ADR-NNNN
**Deciders**: <known decision owners; omit rather than invent>

## Context

<problem, constraints, and forces>

## Decision

<the proposed or accepted choice>

## Alternatives considered

### <alternative>

- **Pros**: <benefits>
- **Cons**: <costs>
- **Why not**: <reason it lost>

## Consequences

### Positive

<benefits>

### Negative

<trade-offs and risks>

## Verification

<evidence, acceptance criteria, or operational checks>
```

ADR lifecycle is `proposed -> accepted -> deprecated | superseded`. A superseded ADR remains readable and links to its replacement. Backfilled ADRs retain the original decision date when known and identify that they were reconstructed.

When asked why a decision was made, search the ADR index and files, then report the Context, Decision, Alternatives considered, and Consequences with a link to the source record.

## Agent Note Mode

Use Agent Note mode for important decisions that do not belong in an existing numbered ADR series.

Store each file at `.agents/notes/{lifecycle}/{class}/yyyy-mm-dd-topic.md`.

- Lifecycle: `proposed`, `implemented`, `rejected`, or `archived`.
- Class: `feature`, `bug-fix`, `simplification`, `architecture`, `process`, or `testing`.
- The filename date is the first proposal date.
- Create only the lifecycle and class directories needed now.
- Do not create a centralized `INDEX.md`; use the directory tree and repository search.

Use the matching file in `templates/`. Read these references only when the branch needs them:

- `references/note-format.md`: headers, required sections, and lifecycle-specific language.
- `references/classification.md`: class boundaries.
- `references/when-to-write.md`: create, update, and transition rules.
- `references/archiving.md`: supersession, archival, and safe consolidation.
- `references/prose-checklist.md`: repository-verifiable prose.
- `references/simplification-checklist.md`: durable simplification decisions.

Write or update an implemented Agent Note no later than the code change's commit or PR. A proposed Note becomes implemented by rewriting proposal language as current facts. A rejected Note keeps the proposal and records why it lost. An archived Note remains frozen.

## Consolidation Rules

- Update an existing record when facts, paths, defaults, or verification change but the decision remains the same.
- Create a new record when a different decision replaces the old one.
- Keep both records and cross-link them when the replacement is partial.
- Delete an old record only when the new record preserves every unique rationale, alternative, consequence, verification requirement, and inbound link.
- Never rewrite an old record to claim it made the opposite decision.

## Verification

For Agent Notes, run:

```sh
npx tsx <skill-directory>/scripts/verify-agent-note-tree.ts
npx tsx <skill-directory>/scripts/verify-agent-note-format.ts
```

For ADRs, verify the filename number, index row, status, alternatives, consequences, replacement links, and repository-local references. Use the repository's existing ADR validation when one exists.
