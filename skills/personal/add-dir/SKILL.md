---
name: add-dir
description: Add a directory to the current Codex working context and persist it into the current project's .codex/config.toml workspace_roots, similar to Claude Code /add-dir behavior. Use when the user invokes add-dir, /add-dir, $add-dir, /prompts:add-dir, or asks to add another directory/workspace root to the current session.
metadata:
  short-description: Add a workspace directory
---

# Add Dir

Add an extra directory to the current conversation's working context and persist it in the current project's Codex config.

## Workflow

1. Resolve the requested directory to an absolute path. Expand `~`; resolve relative paths from the current working directory.
2. Verify the resolved path exists and is a directory.
3. Run the bundled script:

```bash
python3 /Users/Shay/.codex/skills/add-dir/scripts/add_dir_to_project_config.py "<resolved-directory>"
```

4. Treat the resolved directory as an additional working context for the rest of this conversation.
5. For later work involving that directory, use absolute paths and scoped commands like `rg`, `rg --files`, `find <dir> -maxdepth ...`, and `git -C <dir> ...`.
6. Do not assume the added directory belongs to the same Git repository as the original workspace. Check with `git -C <dir> rev-parse --show-toplevel` when Git context matters.

## Behavior

- The script writes to the current Git project root's `.codex/config.toml`.
- If the current directory is not inside a Git project, it writes to the current directory's `.codex/config.toml`.
- If the project config does not already select a custom permission profile, the script creates and selects `codex-add-dir`, extending `:workspace`, then adds the directory under `[permissions.codex-add-dir.workspace_roots]`.
- If the project config already selects a custom permission profile, the script adds the directory under that profile's `workspace_roots`.

## Limitation

This skill can update project config and current-conversation behavior, but Codex may need a new session or restart before the sandbox treats the persisted directory as a real workspace root. If filesystem or sandbox permissions block immediate access, tell the user to restart with:

```bash
codex -C "$PWD" --add-dir "<resolved-directory>"
```

## Response

After verification and config update, reply with:

- the resolved absolute path
- the updated project config path
- whether the directory was added or already present
- a note that new sandbox roots may require a new session or restart
