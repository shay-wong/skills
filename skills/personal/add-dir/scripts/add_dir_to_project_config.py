#!/usr/bin/env python3
"""Add a directory to the current project's Codex workspace roots."""

from __future__ import annotations

import argparse
import os
import re
import subprocess
import sys
from pathlib import Path


DEFAULT_PROFILE = "codex-add-dir"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Persist an extra workspace root in <project>/.codex/config.toml."
    )
    parser.add_argument("directory", help="Directory to add as a workspace root")
    parser.add_argument(
        "--cwd",
        default=os.getcwd(),
        help="Directory used to discover the current project root",
    )
    parser.add_argument(
        "--profile",
        default=DEFAULT_PROFILE,
        help="Profile name to create when the current default is built-in or unset",
    )
    return parser.parse_args()


def quote_toml_key(value: str) -> str:
    return '"' + value.replace("\\", "\\\\").replace('"', '\\"') + '"'


def discover_project_root(cwd: Path) -> Path:
    try:
        result = subprocess.run(
            ["git", "-C", str(cwd), "rev-parse", "--show-toplevel"],
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.DEVNULL,
            text=True,
        )
    except (OSError, subprocess.CalledProcessError):
        return cwd.resolve()

    root = result.stdout.strip()
    return Path(root).resolve() if root else cwd.resolve()


def read_default_permissions(content: str) -> str | None:
    in_table = False
    for line in content.splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue
        if stripped.startswith("["):
            in_table = True
        if in_table:
            continue
        match = re.match(r'^default_permissions\s*=\s*"([^"]+)"\s*(?:#.*)?$', stripped)
        if match:
            return match.group(1)
    return None


def set_top_level_default_permissions(content: str, profile: str) -> str:
    lines = content.splitlines()
    replacement = f'default_permissions = "{profile}"'
    for index, line in enumerate(lines):
        stripped = line.strip()
        if stripped.startswith("["):
            break
        if re.match(r"^default_permissions\s*=", stripped):
            lines[index] = replacement
            return "\n".join(lines).rstrip() + "\n"

    insert_at = 0
    while insert_at < len(lines) and (
        not lines[insert_at].strip() or lines[insert_at].lstrip().startswith("#")
    ):
        insert_at += 1
    lines.insert(insert_at, replacement)
    return "\n".join(lines).rstrip() + "\n"


def table_header(profile: str, suffix: str | None = None) -> str:
    if suffix:
        return f"[permissions.{profile}.{suffix}]"
    return f"[permissions.{profile}]"


def table_exists(content: str, header: str) -> bool:
    return re.search(rf"(?m)^\s*{re.escape(header)}\s*$", content) is not None


def ensure_profile(content: str, profile: str) -> str:
    header = table_header(profile)
    if table_exists(content, header):
        return content

    block = f'\n{header}\nextends = ":workspace"\n'
    return content.rstrip() + block + "\n"


def ensure_workspace_root(content: str, profile: str, directory: Path) -> tuple[str, bool]:
    header = table_header(profile, "workspace_roots")
    key = quote_toml_key(str(directory))
    entry = f"{key} = true"

    if re.search(rf"(?m)^\s*{re.escape(key)}\s*=", content):
        content = re.sub(rf"(?m)^\s*{re.escape(key)}\s*=.*$", entry, content)
        return content.rstrip() + "\n", False

    lines = content.splitlines()
    for index, line in enumerate(lines):
        if line.strip() != header:
            continue
        insert_at = index + 1
        while insert_at < len(lines) and not lines[insert_at].lstrip().startswith("["):
            insert_at += 1
        lines.insert(insert_at, entry)
        return "\n".join(lines).rstrip() + "\n", True

    block = f"\n{header}\n{entry}\n"
    return content.rstrip() + block + "\n", True


def update_config(config_path: Path, directory: Path, fallback_profile: str) -> tuple[str, bool]:
    content = config_path.read_text(encoding="utf-8") if config_path.exists() else ""
    default_permissions = read_default_permissions(content)

    if default_permissions and not default_permissions.startswith(":"):
        profile = default_permissions
    else:
        profile = fallback_profile
        content = set_top_level_default_permissions(content, profile)
        content = ensure_profile(content, profile)

    content, added = ensure_workspace_root(content, profile, directory)
    config_path.parent.mkdir(parents=True, exist_ok=True)
    config_path.write_text(content, encoding="utf-8")
    return profile, added


def main() -> int:
    args = parse_args()
    cwd = Path(args.cwd).expanduser().resolve()
    directory = Path(args.directory).expanduser()
    if not directory.is_absolute():
        directory = (cwd / directory).resolve()
    else:
        directory = directory.resolve()

    if not directory.exists() or not directory.is_dir():
        print(f"Not a directory: {directory}", file=sys.stderr)
        return 2

    project_root = discover_project_root(cwd)
    config_path = project_root / ".codex" / "config.toml"
    profile, added = update_config(config_path, directory, args.profile)

    action = "added" if added else "updated"
    print(f"{action}: {directory}")
    print(f"project_root: {project_root}")
    print(f"config_path: {config_path}")
    print(f"profile: {profile}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
