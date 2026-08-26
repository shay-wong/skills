---
name: release
description: Prepare and publish a versioned software or Skill release, including version selection, validation, release commit, annotated tag, optional artifact hooks, and GitHub Release. Delegates changelog generation to $changelog unless approved notes already exist. Use only for explicit release or version-publishing requests, not an ordinary commit or push.
---

# Release

Prepare a release from a reproducible Git baseline, keep local and remote mutations explicit, and stop at the boundary the user authorized.

## Authorization Boundary

A release request permits release analysis and preparation. It does not silently authorize every downstream mutation.

Before execution, make the following choices explicit:

- target version;
- files and commits included;
- local release commit;
- local annotated tag;
- branch and tag push;
- artifact publication;
- GitHub Release creation or update.

Bundle related choices into one confirmation when the runtime supports it. Never reinterpret `push`, `commit`, or `update changelog` as a release request.

## Modes

- Normal release: prepare a new version from the latest applicable release baseline.
- Dry run: resolve the same inputs and show the exact plan without changing files, Git refs, artifacts, or remotes.
- Backfill: create missing GitHub Releases for existing tags without changing versions or changelogs. Read [references/backfill.md](references/backfill.md).

For `.releaserc.yml`, project hooks, signing, or custom version paths, read [references/configuration.md](references/configuration.md).

## Required Companion

`$changelog` owns changelog and release-note generation. Do not duplicate its rules here.

Use changelog text supplied and approved by the user when it already covers the resolved release range. Otherwise `$changelog` should have been provided with this Skill. If it is unavailable, stop before changing files or Git state and tell the user to install both Skills:

```bash
npx skills@latest add shay-wong/skills -g --skill changelog release
```

## 1. Preflight

1. Confirm the repository root, current branch, upstream, remote provider, worktree status, and current `HEAD`.
2. Inspect repository release documentation, CI workflows, package scripts, changelogs, recent tags, and recent releases.
3. Identify existing staged and unstaged work. Include only changes that belong to the requested release; leave unrelated work untouched.
4. Check required local tools and authentication without changing remote state.
5. Refuse to release from an unresolved merge or rebase, or with unresolved conflicts.

## 2. Detect The Project

Use `.releaserc.yml` when present. Otherwise detect the version source in this order, while respecting repository-specific release documentation:

1. `package.json`;
2. `pyproject.toml`;
3. `Cargo.toml`;
4. `.claude-plugin/plugin.json` or `marketplace.json`;
5. `VERSION` or `version.txt`.

Find all release-coupled manifests that must remain synchronized. Detect changelog files from repository conventions and common `CHANGELOG*`, `HISTORY*`, and `CHANGES*` names.

## 3. Resolve The Release Range

Select the latest reachable tag that applies to the target package or product. Monorepositories may need a package-specific tag or path-filtered range.

Inspect commits, diffs, merged PRs, and changed paths from that baseline through the candidate `HEAD`. Separate already committed changes from intended uncommitted release work. Record the resolved baseline and candidate revision.

## 4. Recommend A Version

Follow the repository's versioning policy first. Otherwise use semantic versioning:

- major for incompatible public behavior or an explicitly declared breaking change;
- minor for backward-compatible user-visible capability;
- patch for backward-compatible fixes and maintenance releases.

Do not infer a breaking change from a commit prefix alone. Verify the affected public contract. If the project is pre-1.0 or uses another scheme, explain the applicable rule.

## 5. Prepare Changelog And Notes

If approved changelog and release-note text was supplied, verify that its version and range match the release plan. Otherwise invoke `$changelog` with the resolved range, target version, existing changelog paths, desired languages, repository style, and contributor metadata.

Keep one self-contained release-notes section for the annotated tag and GitHub Release. Use the Skill registry supplied by the current harness instead of repeatedly scanning the filesystem for `$changelog`.

## 6. Build The Release Plan

Before mutation, show:

- baseline and candidate revision;
- current and proposed version;
- intended version and changelog files;
- intended validation commands;
- exact commit and tag plan;
- whether branch push, tag push, artifact publication, and GitHub Release are enabled;
- any unrelated dirty files that will remain untouched.

In dry-run mode, stop after this plan and report that no changes were made.

## 7. Prepare And Validate

After confirmation:

1. Update every release-coupled version source with a structured parser or the repository's release command.
2. Insert the approved changelog section without rewriting history.
3. Run configured preparation hooks.
4. Run the repository's current release gates, preferring the closest CI-equivalent lint, typecheck, test, build, package, and manifest validation commands.
5. Review the final diff and verify that version values, changelog headings, generated artifacts, and release notes agree.

Do not continue to commit, tag, or publish after a required gate fails.

## 8. Commit And Tag

Create the minimum release commit set established by the plan. Preserve repository commit conventions and exclude unrelated work. A common final release commit is `chore: release v{version}`, but repository rules take precedence.

Create an annotated tag using the prepared release-notes file. Use a signed tag only when repository configuration requires it and signing is available. Verify that the tag points to the intended release commit.

## 9. Publish

Perform only the approved outputs, in dependency order:

1. push the release commit to the approved branch;
2. push the annotated tag;
3. run configured artifact publication hooks;
4. create or update the GitHub Release from the same release-notes file.

Verify the remote branch, remote tag, artifact result, and GitHub Release after each requested operation. Stop on the first failed dependency instead of publishing later outputs against an uncertain release.

## Report

Return the released version, baseline and final commit, changed files, validation evidence, tag type, remote status, artifact status, GitHub Release URL when created, skipped outputs, and any remaining local changes.
