# The canonical install block

One install story, one wording. `README.md`, `.changeset/*`, and every page under `docs/` must say **this** and nothing else. Change it here first, then propagate.

## Codex, Claude Code, and other agents: skills.sh

This personal collection is distributed through [skills.sh](https://skills.sh/shay-wong/skills). `--full-depth` is required because the repository contains nested Matt, personal, and vendored ECC catalogs. Use the whole-set form on `README.md`:

<canonical-block name="skills-sh-whole-set">

```bash
npx skills@latest add shay-wong/skills -g --full-depth
```

Pick the skills and coding agents you want. When migrating from manually maintained copies, remove or archive the old same-name installs first; `skills.sh` does not clean unmanaged `~/.codex/skills` directories.

</canonical-block>

…and the single-skill form wherever one skill is named on its own. Note that **`docs/` pages are not a consumer of this block**: ai-hero renders the install widget above the body, so a page that writes the commands out duplicates it. See [writing-docs.md](./writing-docs.md).

<canonical-block name="skills-sh-one-skill">

```bash
npx skills@latest add shay-wong/skills -g --full-depth --skill=<name>
```

```bash
npx skills@latest update -g <name>
```

</canonical-block>

`skills@latest` is the pinned spelling in all three. The pages under `docs/` used to carry their own copy of these commands; those blocks are now deleted rather than corrected, because the site renders the install commands itself.

## Avoid duplicate installations

Do not install `mattpocock-skills`, `ecc@ecc`, or separate manual ECC copies alongside this collection. The inherited `.claude-plugin` manifest still ships only the promoted Matt subset and is not the complete personal distribution.
