#!/bin/sh

set -u

[ "${CODEX_MR_HOOK_ACTIVE:-0}" = "1" ] && exit 0

resolve_command() {
    case "$1" in
        */*) [ -x "$1" ] && printf '%s\n' "$1" ;;
        *) command -v "$1" 2>/dev/null ;;
    esac
}

git_name=${GIT_BIN:-git}
codex_name=${CODEX_BIN:-codex}
glab_name=${GLAB_BIN:-glab}

git_bin=$(resolve_command "$git_name") || exit 0
repo_dir=$("$git_bin" rev-parse --show-toplevel 2>/dev/null) || exit 0
git_dir=$("$git_bin" rev-parse --absolute-git-dir 2>/dev/null) || exit 0
log_file="$git_dir/codex-mr-hook.log"
run_log="$git_dir/codex-mr-hook-last-run.log"
last_message="$git_dir/codex-mr-hook-last-message.txt"

if [ "${1:-}" != "--run" ]; then
    hook_file=$(cd "$(dirname "$0")" && pwd)/$(basename "$0")
    while read -r local_ref local_oid remote_ref _remote_oid; do
        case "$local_ref:$remote_ref" in
            refs/heads/*:refs/heads/*) ;;
            *) continue ;;
        esac

        branch=${remote_ref#refs/heads/}
        nohup "$hook_file" --run "$branch" "$local_oid" >>"$log_file" 2>&1 </dev/null &
    done
    exit 0
fi

branch=${2:-}
pushed_oid=${3:-}
[ -n "$branch" ] && [ -n "$pushed_oid" ] || exit 0

codex_bin=$(resolve_command "$codex_name") || {
    printf '[codex-mr] codex not found: %s\n' "$codex_name"
    exit 0
}
glab_bin=$(resolve_command "$glab_name") || {
    printf '[codex-mr] glab not found: %s\n' "$glab_name"
    exit 0
}

mr_iid=$(cd "$repo_dir" && "$glab_bin" mr list --source-branch "$branch" --per-page 1 --output json --jq '.[0].iid // empty' 2>/dev/null) || exit 0
[ -n "$mr_iid" ] || exit 0

printf '[%s] waiting for MR !%s branch %s at %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$mr_iid" "$branch" "$pushed_oid"
attempt=0
state_sha=
while [ "$attempt" -lt 60 ]; do
    state_sha=$(cd "$repo_dir" && "$glab_bin" mr view "$mr_iid" --output json --jq '.state + ":" + .sha' 2>/dev/null) || state_sha=
    case "$state_sha" in
        "opened:$pushed_oid") break ;;
        merged:*|closed:*)
            printf '[%s] skipped MR !%s because its state is no longer opened\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$mr_iid"
            exit 0
            ;;
    esac
    sleep 2
    attempt=$((attempt + 1))
done

[ "$state_sha" = "opened:$pushed_oid" ] || {
    printf '[%s] skipped MR !%s because GitLab did not receive %s within 120 seconds\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$mr_iid" "$pushed_oid"
    exit 0
}

lock_dir="$git_dir/codex-mr-hook.lock"
attempt=0
while ! mkdir "$lock_dir" 2>/dev/null; do
    [ "$attempt" -lt 600 ] || exit 0
    sleep 1
    attempt=$((attempt + 1))
done
trap 'rmdir "$lock_dir" 2>/dev/null || true' EXIT HUP INT TERM

state_sha=$(cd "$repo_dir" && "$glab_bin" mr view "$mr_iid" --output json --jq '.state + ":" + .sha' 2>/dev/null) || exit 0
[ "$state_sha" = "opened:$pushed_oid" ] || exit 0

# Keep the skill invocation literal for Codex.
# shellcheck disable=SC2016
skill_name='$gitlab-mr'
prompt="${skill_name} GitLab 已成功接收分支 ${branch} 的提交 ${pushed_oid}，对应 opened MR !${mr_iid}。以 MR 目标分支和该提交之间的实际 diff 为准，只更新 MR 描述中因本次 push 而需要变化的内容。写入前再次确认 MR 仍为 opened 且 SHA 等于 ${pushed_oid}，否则不做修改。严格遵守仓库专用模板，保留 Draft/Ready、目标分支、assignee、reviewer、label、milestone 和 squash 等元数据。不要修改、提交或推送代码。写入后回读验证；如果描述无需变化，不执行更新。"

printf '[%s] updating MR !%s for %s at %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$mr_iid" "$branch" "$pushed_oid"
CODEX_MR_HOOK_ACTIVE=1 "$codex_bin" exec \
    --ephemeral \
    --color never \
    -o "$last_message" \
    -C "$repo_dir" \
    -s danger-full-access \
    -c 'approval_policy="never"' \
    "$prompt" >"$run_log" 2>&1
codex_exit=$?
printf '[%s] codex exited with %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$codex_exit"
exit "$codex_exit"
