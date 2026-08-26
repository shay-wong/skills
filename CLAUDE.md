Skills are organized into bucket folders under `skills/`:

- `engineering/`: daily code work
- `productivity/`: daily non-code workflow tools
- `misc/`: kept around but rarely used, not promoted
- `in-progress/`: beta: public on purpose, feedback wanted, not shipped in the plugin
- `deprecated/`: no longer used

Third-party Skills are absorbed directly into the matching `engineering/`, `productivity/`, or `misc/` bucket. Source ownership lives in [`SOURCES.md`](./SOURCES.md), not in a directory namespace. Preserve imported files exactly except for path repairs and adaptations recorded there.

Every direct child Skill in `engineering/`, `productivity/`, `misc/`, and `in-progress/` must appear in its bucket README. The top-level README, `ask-me`, aihero docs, and inherited Matt plugin remain curated Matt-based surfaces; importing a third-party Skill into a bucket does not automatically promote it to those surfaces. `SOURCES.md` records which entries are Matt canonical, absorbed third-party, or local.

Install commands are copied verbatim from [.agents/install-block.md](./.agents/install-block.md). `.claude-plugin/marketplace.json` makes the repo its own single-plugin marketplace (a fallback the install block explains, not the documented route). Run `claude plugin validate . --strict` after touching either manifest. Why a Claude plugin but not (yet) a Codex one lives in [.agents/adr/0002-ship-as-a-claude-code-plugin.md](./.agents/adr/0002-ship-as-a-claude-code-plugin.md).

Each skill entry in the top-level `README.md` must link the skill name to its `SKILL.md`.

Each bucket folder lists every direct child Skill with a linked name and one-line description. `engineering/` and `productivity/` keep the existing User-invoked and Model-invoked sections for the Matt-based curated surface, followed by an **Imported library** section for absorbed third-party Skills. Non-promoted bucket READMEs use a flat list.

Matt-based curated Skills in `engineering/` and `productivity/` have a human-facing docs page at `docs/<bucket>/<skill-name>.md`. When you add, rename, or change one, create or re-sync its docs page following [.agents/writing-docs.md](./.agents/writing-docs.md). Absorbed third-party Skills and Skills in `misc/`, `in-progress/`, and `deprecated/` get no aihero docs page unless explicitly promoted later.

Every `SKILL.md` is either user-invoked (`disable-model-invocation: true` plus `policy.allow_implicit_invocation: false` in `agents/openai.yaml`, reachable only by the human) or model-invoked (model- or user-reachable). See [.agents/invocation.md](./.agents/invocation.md).

[`ask-me`](./skills/engineering/ask-me/SKILL.md) is the router that maps every user-reachable skill and how they relate. The same trigger that re-syncs a docs page applies to it: whenever you add, rename, remove, or change how a user-reachable skill fits the flows, re-read `ask-me`'s `SKILL.md` and update it so the map stays accurate: a new skill it never mentions, or a stale one it still routes to, is a router that lies.

To (re)link every repository-owned skill into the local harness skill directories (`~/.claude/skills`, `~/.agents/skills`), run `scripts/link-skills.sh`. Vendored catalogs are excluded until their compatibility issues and duplicate installed names have been resolved. Each linked entry is a symlink into this repo, so a `git pull` keeps installed skills current; re-run the script after adding, removing, or renaming a linked skill.

[`SOURCES.md`](./SOURCES.md) is the source and local-change ledger for this personal Skill collection. Whenever a sourced Skill is added, modified, renamed, removed, or synchronized with its source, update its ledger entry in the same logical change. Record the source repository and path, immutable source commit or version, license, local path, concrete behavior differences, verification, and synchronization policy. Do not list projects that were only browsed or evaluated as adopted sources.

No em-dashes in repository-owned prose (`SKILL.md` files, docs, `README.md`, `CHANGELOG.md`, ADRs, changesets, code comments). Preserve vendored snapshots exactly. Where repository-owned prose reaches for an em-dash, rewrite it instead with a comma, colon, period, parentheses, or a conjunction, whichever the sentence actually wants; never do a blind character substitution.
