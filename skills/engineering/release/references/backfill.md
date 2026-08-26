# GitHub Release Backfill

Use this mode when existing Git tags lack corresponding GitHub Releases.

## Inspect

1. Confirm that the remote is GitHub and `gh` authentication is available.
2. List tags in version order and determine which tags are release candidates.
3. Check each candidate with `gh release view <tag>`.
4. Detect tag type with `git cat-file -t <tag>`. `tag` means annotated; `commit` means lightweight.
5. Resolve the changelog section for each missing release. Normalize configured tag prefixes, such as `v1.2.3` to `1.2.3`, only for changelog lookup.

## Plan

Show every missing release, its tag type, release-note source, and intended title. Skip tags that have no reliable notes unless the user approves newly drafted notes.

Backfill mode does not bump versions, edit changelogs, create release commits, or rewrite tags. Never convert a published lightweight tag to an annotated tag without explicit authorization because that replaces a public Git ref.

## Publish

After confirmation, create each missing release from a UTF-8 notes file:

```bash
gh release create <tag> --title "<tag>" --notes-file <release-notes-file> --verify-tag
```

Verify each created release before continuing. Stop at the first failure and report the remaining tags as not attempted.
