#!/bin/sh

set -eu

resolve_command() {
    case "$1" in
        */*) [ -x "$1" ] && printf '%s\n' "$1" ;;
        *) command -v "$1" 2>/dev/null ;;
    esac
}

git_name=${GIT_BIN:-git}
git_bin=$(resolve_command "$git_name") || {
    printf 'git not found: %s\n' "$git_name" >&2
    exit 1
}
repo_arg=${1:-.}

repo_dir=$("$git_bin" -C "$repo_arg" rev-parse --show-toplevel)
hooks_dir=$("$git_bin" -C "$repo_dir" rev-parse --path-format=absolute --git-path hooks)
script_dir=$(cd "$(dirname "$0")" && pwd)
runner="$script_dir/pre-push-hook.sh"
hook_file="$hooks_dir/pre-push"

[ -x "$runner" ] || {
    printf 'Hook runner is not executable: %s\n' "$runner" >&2
    exit 1
}

mkdir -p "$hooks_dir"

if [ -L "$hook_file" ] && [ "$(readlink "$hook_file")" = "$runner" ]; then
    printf 'GitLab MR pre-push Hook is already installed: %s\n' "$hook_file"
    exit 0
fi

if [ -e "$hook_file" ] || [ -L "$hook_file" ]; then
    printf 'Refusing to overwrite existing pre-push Hook: %s\n' "$hook_file" >&2
    exit 1
fi

ln -s "$runner" "$hook_file"
printf 'Installed GitLab MR pre-push Hook: %s -> %s\n' "$hook_file" "$runner"
