#!/usr/bin/env bash
set -euo pipefail

test_root=$(mktemp -d)
cleanup() { rm -rf "$test_root"; }
trap cleanup EXIT

mkdir -p "$test_root/source/linked" "$test_root/project/direct" "$test_root/global"
printf '%s\n' '---' 'name: linked' 'description: Linked test Skill.' '---' > "$test_root/source/linked/SKILL.md"
printf '%s\n' 'not a skill' > "$test_root/source/linked/README.md"
printf '%s\n' '---' 'name: direct' 'description: Direct test Skill.' '---' > "$test_root/project/direct/SKILL.md"
ln -s "$test_root/source/linked" "$test_root/global/linked"

scan=$(SKILL_STOCKTAKE_GLOBAL_DIR="$test_root/global" \
  SKILL_STOCKTAKE_PROJECT_DIR="$test_root/project" \
  bash "$(dirname "$0")/scan.sh")

jq -e '.skills | length == 2' <<< "$scan" >/dev/null
jq -e '[.skills[].name] | sort == ["direct", "linked"]' <<< "$scan" >/dev/null

results="$test_root/results.json"
printf '%s\n' '{"evaluated_at":"2000-01-01T00:00:00Z","skills":{}}' > "$results"
diff=$(SKILL_STOCKTAKE_GLOBAL_DIR="$test_root/global" \
  SKILL_STOCKTAKE_PROJECT_DIR="$test_root/project" \
  bash "$(dirname "$0")/quick-diff.sh" "$results")

jq -e 'length == 2' <<< "$diff" >/dev/null
