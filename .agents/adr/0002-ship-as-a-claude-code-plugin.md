# Ship one compatible plugin manifest for Claude Code and Codex

This personal collection is installable through [skills.sh](https://skills.sh/shay-wong/skills) with `npx skills add shay-wong/skills`. That remains the complete, cross-harness installation route. A plugin provides a curated, read-only subset for users who want managed updates.

## Distribution boundary

Skills live in bucket folders under `skills/`. The plugin promotes selected `engineering/` and `productivity/` entries. It excludes `specialized/`, `misc/`, `in-progress/`, and `deprecated/`.

The explicit array in [`.claude-plugin/plugin.json`](../../.claude-plugin/plugin.json) is the promoted allowlist. [`.claude-plugin/marketplace.json`](../../.claude-plugin/marketplace.json) exposes that plugin from this repository under the personal marketplace identity `shay`.

## Compatibility evidence

OpenAI's plugin-management documentation lists `.claude-plugin/marketplace.json` and `.claude-plugin/plugin.json` as supported Codex import formats, alongside native Codex marketplaces. See [Supported formats](https://learn.chatgpt.com/docs/enterprise/plugin-management#supported-formats).

The exact personal manifests in this repository were also verified with Codex CLI 0.161.0 in an isolated `CODEX_HOME`:

```bash
codex plugin marketplace add <repo> --json
codex plugin add shay-skills@shay --json
codex plugin list --json
```

Codex installed `shay-skills@shay` at version `1.2.3` and accepted the explicit `skills` array. Claude Code validation continues to use:

```bash
claude plugin validate . --strict
```

## Decision

- Reuse `.claude-plugin/plugin.json` as the single promoted Skill allowlist for both Claude Code and Codex.
- Keep `.claude-plugin/marketplace.json` as the repository fallback marketplace with the personal `shay` identity.
- Do not add a duplicate `.codex-plugin/plugin.json` while the compatible manifest works.
- Keep skills.sh as the complete installer because the plugin intentionally excludes the imported and beta libraries.

## Invariants

- Every promoted Skill appears in `.claude-plugin/plugin.json`.
- No Skill from `specialized/`, `misc/`, `in-progress/`, or `deprecated/` appears in the plugin.
- The plugin name, marketplace identity, repository URL, and package name remain `shay-skills`, `shay`, `shay-wong/skills`, and `shay-skills`.
- `.claude-plugin/plugin.json` and `package.json` use the same version.
- Revalidate both harnesses when either manifest changes or when a future Codex release stops accepting the compatible format.

## Upstream marketplace boundary

The upstream `mattpocock-skills` plugin is a separate Claude Code marketplace entry that points to `mattpocock/skills`. It does not install this personal distribution and must not replace this repository's identity or curated allowlist.
