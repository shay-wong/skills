#!/usr/bin/env bash
set -euo pipefail

fixture="$(mktemp -d)"
trap 'rm -rf "$fixture"' EXIT

mkdir -p \
  "$fixture/skills/code-review" \
  "$fixture/skills/flutter-add-widget-preview" \
  "$fixture/skills/tdd" \
  "$fixture/cache/ponytail/ponytail/9.9.9/skills/ponytail-review" \
  "$fixture/cache/disabled/disabled/1.0.0/skills/disabled-review"

printf '%s\n' '---' 'name: code-review' '---' > "$fixture/skills/code-review/SKILL.md"
printf '%s\n' '---' 'name: flutter-add-widget-preview' '---' > "$fixture/skills/flutter-add-widget-preview/SKILL.md"
printf '%s\n' '---' 'name: tdd' '---' > "$fixture/skills/tdd/SKILL.md"
printf '%s\n' '---' 'name: ponytail-review' '---' > "$fixture/cache/ponytail/ponytail/9.9.9/skills/ponytail-review/SKILL.md"
printf '%s\n' '---' 'name: disabled-review' '---' > "$fixture/cache/disabled/disabled/1.0.0/skills/disabled-review/SKILL.md"
printf '%s\n' \
  '[plugins."ponytail@ponytail"]' \
  'enabled = true' \
  '' \
  '[plugins."disabled@disabled"]' \
  'enabled = false' > "$fixture/config.toml"

actual="$(
  REVIEW_CODEX_CONFIG="$fixture/config.toml" \
  REVIEW_PLUGIN_CACHE="$fixture/cache" \
  REVIEW_SKILL_ROOTS="$fixture/skills" \
  "$(dirname "$0")/discover-review-skills.sh"
)"
expected="$(printf '%s\n' 'code-review' 'ponytail:ponytail-review')"

[ "$actual" = "$expected" ] || {
  printf 'expected:\n%s\nactual:\n%s\n' "$expected" "$actual" >&2
  exit 1
}

printf 'discovery self-check passed\n'
