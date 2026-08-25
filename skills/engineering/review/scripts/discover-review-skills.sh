#!/usr/bin/env bash
set -euo pipefail

config="${REVIEW_CODEX_CONFIG:-$HOME/.codex/config.toml}"
plugin_cache="${REVIEW_PLUGIN_CACHE:-$HOME/.codex/plugins/cache}"
skill_roots="${REVIEW_SKILL_ROOTS:-$HOME/.agents/skills:$HOME/.codex/skills:$HOME/.claude/skills}"

skill_name() {
  awk '
    NR == 1 && $0 == "---" { frontmatter = 1; next }
    frontmatter && $0 == "---" { exit }
    frontmatter && /^name:[[:space:]]*/ {
      sub(/^name:[[:space:]]*/, "")
      gsub(/^["'\'' ]+|["'\'' ]+$/, "")
      print
      exit
    }
  ' "$1"
}

scan_skill_files() {
  invocation_prefix="$1"
  shift

  find -L "$@" -type f -name SKILL.md -print0 2>/dev/null |
    while IFS= read -r -d '' skill_file; do
      name="$(skill_name "$skill_file")"
      case "$name" in
        review|review-*|*-review|*-review-*|audit|audit-*|*-audit|*-audit-*|gh-address-comments|golang-patterns|cpp-coding-standards|rust-patterns|kotlin-patterns|kotlin-ktor-patterns|kotlin-exposed-patterns|python-patterns|fastapi-patterns|dart-flutter-patterns)
          printf '%s%s\n' "$invocation_prefix" "$name"
          ;;
      esac
    done
}

enabled_plugins() {
  [ -f "$config" ] || return 0

  awk '
    function emit() {
      if (plugin != "" && enabled == "true") print plugin
    }
    /^\[plugins\."/ {
      emit()
      plugin = $0
      sub(/^\[plugins\."/, "", plugin)
      sub(/"\][[:space:]]*$/, "", plugin)
      enabled = ""
      next
    }
    /^\[/ {
      emit()
      plugin = ""
      enabled = ""
      next
    }
    plugin != "" && /^[[:space:]]*enabled[[:space:]]*=/ {
      value = $0
      sub(/^[^=]*=[[:space:]]*/, "", value)
      sub(/[[:space:]#].*$/, "", value)
      enabled = value
    }
    END { emit() }
  ' "$config"
}

{
  old_ifs="$IFS"
  IFS=:
  for root in $skill_roots; do
    [ -d "$root" ] && scan_skill_files "" "$root"
  done
  IFS="$old_ifs"

  enabled_plugins | while IFS= read -r plugin_id; do
    case "$plugin_id" in
      *@*)
        plugin="${plugin_id%%@*}"
        marketplace="${plugin_id#*@}"
        root="$plugin_cache/$marketplace/$plugin"
        [ -d "$root" ] && scan_skill_files "$plugin:" "$root"
        ;;
    esac
  done
} | LC_ALL=C sort -u
