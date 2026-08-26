---
name: changelog
description: Turn a Git commit, tag, date, or PR range into accurate user-facing changelog entries or release notes. Use for changelogs, product updates, app store notes, and release-note drafting; do not change versions, create commits or tags, push, or publish releases.
---

# Changelog

Create changelog text that explains observable changes to its intended audience without overstating what the source evidence proves.

## Scope

This Skill may inspect Git history, diffs, merged pull requests, issue links, and existing changelog conventions. It may write or update changelog files when requested.

It does not bump versions, commit, tag, push, publish artifacts, or create a GitHub Release. Use `$release` for that workflow.

## Choose The Output

Match the requested deliverable instead of forcing every result into `CHANGELOG.md`:

- versioned changelog section;
- GitHub Release notes;
- weekly or monthly product update;
- app store update notes;
- customer announcement or internal release summary.

Use the repository's existing headings, ordering, language, punctuation, and link style when they exist. For a new changelog, default to Keep a Changelog style with only non-empty sections.

## Establish The Range

1. Prefer an explicit commit, tag, date, or PR range from the user.
2. Otherwise use the latest reachable release tag as the start and `HEAD` as the end.
3. If no release tag exists, identify a sensible initial baseline and state it. Never construct an invalid `..HEAD` range from an empty tag.
4. Record the exact resolved start and end revisions in the working notes so the result is reproducible.

Inspect both commit messages and the changed behavior. Open the relevant diff, PR, issue, or documentation when a title is vague, internal, or potentially misleading.

## Build The Changelog

1. Collect commits and changed paths in the range.
2. Group related commits into one user-visible change. Do not expose implementation churn as separate entries.
3. Classify entries using the repository's existing sections. Otherwise consider:
   - breaking changes;
   - security;
   - features;
   - improvements and performance;
   - fixes;
   - deprecations or removals;
   - documentation, when it changes how users operate the product.
4. Exclude tests, formatting, refactors, dependency bumps, and maintenance only when they have no user-visible, operator-visible, compatibility, security, or performance effect.
5. Translate technical implementation into concrete outcomes. Preserve identifiers only when users need them for migration, configuration, debugging, or API compatibility.
6. Put breaking changes and required actions first. State migrations, removed behavior, compatibility limits, or rollout requirements explicitly.
7. Link PRs, issues, commits, migration guides, or contributors when the repository convention supports them.

Do not invent benefits, performance numbers, affected users, or causality. If evidence is insufficient, use restrained wording or flag the entry for maintainer review.

## Multiple Languages

Detect language from existing files such as `CHANGELOG.md`, `CHANGELOG.zh.md`, `CHANGELOG_CN.md`, or configured paths. Write each language naturally from the source evidence rather than mechanically translating a completed English entry.

Keep versions, dates, issue references, contributor handles, and compatibility claims consistent across languages. Preserve each file's existing section names and formatting.

## Contributor Attribution

When GitHub metadata is available, compare merged PR authors with the repository owner or maintainer set. Attribute external contributions using the repository's established format, or `(by @username)` when no format exists. Do not infer authorship from commit display names when PR metadata is available.

## Write And Verify

When updating a file:

1. Preserve the existing preamble and historical entries.
2. Insert the new section in the established order.
3. Use an ISO date unless the project uses another documented format.
4. Check that every material user-visible change in the range is represented once.
5. Check that every entry is supported by the inspected evidence.
6. Return the resolved range, changed file or generated output, omitted internal-only changes, and any uncertain entries.

When `$release` requests release notes, return a self-contained section suitable for an annotated tag and GitHub Release. Do not include the entire historical changelog.
