---
name: skill-stocktake
description: Audit installed or repository Skill catalogs for overlap, stale guidance, broken discovery, and low-value entries. Use when deciding what to keep, improve, merge, update, or retire.
metadata:
  origin: ECC
---

# Skill Stocktake

Audit a Skill catalog with either a quick changed-files pass or a complete stocktake. Report evidence before proposing removal or consolidation.

## Scope

Run scripts from this Skill directory. The scanner checks:

| Path | Use |
| --- | --- |
| `~/.agents/skills/` | Primary global catalog |
| `~/.claude/skills/` | Global fallback when the Agent Skills directory is absent |
| `{cwd}/skills/` | Repository-owned catalog when present |
| `{cwd}/.agents/skills/` or `{cwd}/.claude/skills/` | Project-level fallback |

Only files named `SKILL.md` count. Symbolic links are followed, and paths resolving to the same file are deduplicated. Pass an explicit directory to `scripts/scan.sh` when auto-detection selects the wrong project catalog.

Keep runtime state outside the installed Skill directory because that directory may be a symbolic link into a Git repository:

```bash
RESULTS_FILE="${XDG_STATE_HOME:-$HOME/.local/state}/skill-stocktake/results.json"
```

## Modes

| Mode | Select when |
| --- | --- |
| Quick scan | `RESULTS_FILE` exists and the user did not request a complete audit |
| Full stocktake | No prior results exist or the user requests `full` |

## Quick Scan

1. Run `bash scripts/quick-diff.sh "$RESULTS_FILE"`.
2. If the result is `[]`, report that no Skill files changed and stop.
3. Re-evaluate only changed or new Skills using the full-stocktake criteria.
4. Carry forward unchanged results.
5. Show only changed verdicts.
6. Save results:

```bash
mkdir -p "$(dirname "$RESULTS_FILE")"
bash scripts/save-results.sh "$RESULTS_FILE" <<< "$EVAL_RESULTS"
```

## Full Stocktake

### Inventory

Run:

```bash
bash scripts/scan.sh
```

State which global and project catalogs were found. Do not infer that a Skill is missing from an empty scan until symbolic-link handling and the resolved paths have been checked.

### Evaluate

Evaluate batches of about 20 Skills. Use independent subagents when the current harness exposes them and the caller permits delegation; otherwise process the batches sequentially. Each evaluator must read the complete selected `SKILL.md` files and return:

```json
{
  "verdict": "Keep|Improve|Update|Retire|Merge into <skill>",
  "reason": "Self-contained evidence and the concrete next action"
}
```

Check:

- overlap with other Skills;
- overlap with repository instructions or maintained memory;
- freshness of commands, APIs, and technical references;
- observed use when reliable usage evidence exists;
- actionability, scope fit, uniqueness, and maintenance cost;
- description precision and entrypoint context cost;
- dependencies, invocation policy, and runtime compatibility.

Use primary documentation for freshness checks. Do not treat an unavailable usage log as zero usage.

### Verdict Rules

| Verdict | Required reason |
| --- | --- |
| Keep | State the unique, current value |
| Improve | Name the exact section or behavior to change |
| Update | Name the stale reference and verified replacement |
| Retire | Name the defect, replacement, dependents, and removal impact |
| Merge into `<skill>` | Name the target and the exact content to preserve |

Origin does not change the rubric. A third-party Skill may be strong, and a local Skill may be redundant.

### Consolidate

Present the inventory and verdicts before editing. Removing, archiving, or merging Skills requires explicit user confirmation. For each proposed removal or merge, include dependents, runtime integrations, documentation, source-ledger impact, and expected behavior after the change.

## Results Schema

Set `evaluated_at` to the actual UTC completion time.

```json
{
  "evaluated_at": "2026-02-21T10:00:00Z",
  "mode": "full",
  "batch_progress": {
    "total": 80,
    "evaluated": 80,
    "status": "completed"
  },
  "skills": {
    "skill-name": {
      "path": "/resolved/path/skill-name/SKILL.md",
      "verdict": "Keep",
      "reason": "Unique current value",
      "mtime": "2026-01-15T08:30:00Z"
    }
  }
}
```
