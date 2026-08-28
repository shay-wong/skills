# The canonical install block

One install story, one wording. `README.md`, `.changeset/*`, and every page under `docs/` must say **this** and nothing else. Change it here first, then propagate.

## Codex, Claude Code, and other agents: skills.sh

This personal collection is distributed through [skills.sh](https://skills.sh/shay-wong/skills). Use the whole-set form on `README.md`:

<canonical-block name="skills-sh-whole-set">

```bash
npx skills@latest add shay-wong/skills -g
```

Pick the skills and coding agents you want. When migrating from manually maintained copies, remove or archive the old same-name installs first; `skills.sh` does not clean unmanaged `~/.codex/skills` directories.

</canonical-block>

…and the single-skill form wherever one skill is named on its own. Note that **`docs/` pages are not a consumer of this block**: ai-hero renders the install widget above the body, so a page that writes the commands out duplicates it. See [writing-docs.md](./writing-docs.md).

<canonical-block name="skills-sh-one-skill">

```bash
npx skills@latest add shay-wong/skills -g --skill=<name>
```

```bash
npx skills@latest update -g <name>
```

</canonical-block>

The standard picker installs exactly what you select. To resolve declared external dependencies, use the dependency-aware installer:

<canonical-block name="dependency-aware-install">

```bash
npx --yes github:shay-wong/skills --with-deps --yes review
```

Replace `review` with one or more Skill names. The external dependency checklist includes Ponytail, GitHub PR feedback, game review, and Anthropic frontend design when their owning Skills are selected. Git-backed dependencies are pinned in `.agents/external-dependencies.json`; the preconfigured `openai-curated` marketplace is resolved by Codex. Skills already in this repository are not shown as dependencies. To choose dependencies individually, omit `--with-deps`; use Up/Down and Space in the checkbox list, then press Enter. To install only the selected repository Skills, use `--without-deps`. `--with-deps` installs every listed dependency, so use the checklist when you want individual control. Installing Codex plugins requires the `codex` CLI.

</canonical-block>

`skills@latest` is the pinned spelling in every command. The pages under `docs/` used to carry their own copy of these commands; those blocks are now deleted rather than corrected, because the site renders the install commands itself.

## Avoid duplicate installations

Do not install `mattpocock-skills`, `ecc@ecc`, or separate manual ECC copies alongside this collection. The `.claude-plugin` manifest ships only the promoted subset and is not the complete personal distribution.
