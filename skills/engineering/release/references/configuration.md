# Release Configuration

Read `.releaserc.yml` from the repository root when present. Repository release documentation and executable release tooling remain authoritative when they conflict with these generic fields.

## Supported Fields

```yaml
version:
  file: package.json
  path: version

changelog:
  files:
    - path: CHANGELOG.md
      lang: en
    - path: CHANGELOG.zh.md
      lang: zh
  sections:
    feat: Features
    fix: Fixes
    security: Security
    docs: Documentation
    chore: null

commit:
  message: "chore: release v{version}"

tag:
  prefix: v
  sign: false

include:
  - README.md

release:
  hooks:
    prepare_artifact: "./scripts/prepare-release.sh {target} {version} {artifact_dir} {dry_run}"
    publish_artifact: "./scripts/publish-release.sh {target} {version} {artifact_dir} {release_notes_file} {dry_run}"
```

Use structured parsers for YAML, JSON, and TOML. Do not edit these formats with broad text replacement.

## Hook Contract

Hooks keep registry, package-manager, and project layout details outside the generic Skill.

| Hook | Responsibility |
| --- | --- |
| `prepare_artifact` | Make one target self-contained and ready for release, optionally staging it in a temporary directory. |
| `publish_artifact` | Publish one prepared target using the approved version and release notes. |

Supported placeholders:

| Placeholder | Value |
| --- | --- |
| `{project_root}` | Absolute repository root. |
| `{target}` | Absolute target path. |
| `{artifact_dir}` | Absolute temporary staging directory when used. |
| `{version}` | Approved release version. |
| `{dry_run}` | `true` or `false`. |
| `{release_notes_file}` | Absolute UTF-8 release-notes file. |

Run `prepare_artifact` once per target before validation that depends on the final package shape. Run `publish_artifact` only after the release commit and tag are verified and artifact publication is authorized.

Pass multiline notes through `{release_notes_file}`. Never interpolate them directly into a shell command.
