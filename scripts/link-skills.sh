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

names=()
srcs=()
while IFS= read -r skill_file; do
  src="${skill_file%/SKILL.md}"
  names+=("$(basename "$src")")
  srcs+=("$src")
done < <(
  find \
    "$REPO/skills/engineering" \
    "$REPO/skills/productivity" \
    "$REPO/skills/misc" \
    "$REPO/skills/in-progress" \
    -mindepth 2 -maxdepth 2 -name SKILL.md -print | sort
)

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

  # Remove only broken links previously created by this repository.
  for target in "$DEST"/*; do
    [ -L "$target" ] || continue
    linked_path="$(readlink "$target")"
    case "$linked_path" in
      "$REPO"/*)
        if [ ! -e "$target" ]; then
          rm "$target"
          echo "removed stale link $target"
        fi
        ;;
    esac
  done

  for i in "${!names[@]}"; do
    name="${names[$i]}"
    src="${srcs[$i]}"
    target="$DEST/$name"

    if [ -L "$target" ]; then
      linked_path="$(readlink "$target")"
      case "$linked_path" in
        "$REPO"/*) ;;
        *)
          echo "skipped $target (managed by another source)"
          continue
          ;;
      esac
    elif [ -e "$target" ]; then
      echo "skipped $target (not a symlink)"
      continue
    fi

    ln -sfn "$src" "$target"
    echo "linked $name -> $src ($DEST)"
  done
done
