#!/usr/bin/env bash
set -euo pipefail

# NOTE: This is a dev-only script, intended for use by maintainers of this repo.
# It is not a supported installer. Modifications to it, or requests for
# modifications, will not be approved.
#
# Links all skills in the repository into the local skill directories used by
# each agent harness:
#   - ~/.claude/skills: Claude Code
#   - ~/.agents/skills: Codex and other Agent Skills-compatible harnesses
# Each entry is a symlink into this repo, so a `git pull` is all that's needed
# to keep installed skills up to date.

REPO="$(cd "$(dirname "$0")/.." && pwd)"
DESTS=("$HOME/.claude/skills" "$HOME/.agents/skills")

# Link the curated Matt-based plugin set. The complete absorbed catalog is
# distributed through skills.sh rather than this maintainer helper.
names=()
srcs=()
while IFS= read -r skill_path; do
  src="$REPO/${skill_path#./}"
  names+=("$(basename "$src")")
  srcs+=("$src")
done < <(node -e 'for (const skill of require(process.argv[1]).skills) console.log(skill)' "$REPO/.claude-plugin/plugin.json")

for DEST in "${DESTS[@]}"; do
  # If $DEST is a symlink that resolves into this repo, we'd end up writing the
  # per-skill symlinks back into the repo's own skills/ tree. Detect and bail
  # out instead of polluting the working copy.
  if [ -L "$DEST" ]; then
    resolved="$(readlink -f "$DEST")"
    case "$resolved" in
      "$REPO"|"$REPO"/*)
        echo "error: $DEST is a symlink into this repo ($resolved)." >&2
        echo "Remove it (rm \"$DEST\") and re-run; the script will recreate it as a real dir." >&2
        exit 1
        ;;
    esac
  fi

  mkdir -p "$DEST"

  for i in "${!names[@]}"; do
    name="${names[$i]}"
    src="${srcs[$i]}"
    target="$DEST/$name"

    if [ -e "$target" ] && [ ! -L "$target" ]; then
      rm -rf "$target"
    fi

    ln -sfn "$src" "$target"
    echo "linked $name -> $src ($DEST)"
  done
done
