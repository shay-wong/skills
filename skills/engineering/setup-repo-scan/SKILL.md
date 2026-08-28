---
name: setup-repo-scan
description: Install the external repo-scan Skill from its reviewed pinned commit without occupying the repo-scan runtime name. Use when repo-scan is not installed or must be restored.
disable-model-invocation: true
metadata:
  origin: community
---

# Set Up repo-scan

This Skill installs the external `repo-scan` entry. It does not scan a repository itself.

## Install

1. Show the user the pinned source and command:

   - source: `haibindev/repo-scan`
   - commit: `2742664ebcad1450c208eda0ae45d3c17fad5dd8`
   - command: `npx --yes github:shay-wong/skills --with-deps --yes setup-repo-scan`

2. Wait for explicit confirmation because this changes the global Skill catalog.
3. Run the command exactly as shown.
4. Verify that the external Skill resolves as `repo-scan` and this bootstrap remains available as `setup-repo-scan`.

Do not run the repository audit in the same invocation. Reload the agent harness first, then invoke `repo-scan` separately.
