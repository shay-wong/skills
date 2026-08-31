import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readlinkSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import {
  applyChecklistKey,
  parseArgs,
  resolveExternalDependencies,
  validateDependencyManifest,
} from "./install-skills.mjs";

const script = fileURLToPath(new URL("./install-skills.mjs", import.meta.url));
const linkScript = fileURLToPath(new URL("./link-skills.sh", import.meta.url));
const repo = fileURLToPath(new URL("..", import.meta.url));

test("publishes routed grill entrypoints with a catalog fallback", () => {
  const pluginManifest = JSON.parse(readFileSync(new URL("../.claude-plugin/plugin.json", import.meta.url), "utf8"));
  const grillMe = readFileSync(new URL("../skills/productivity/grill-me/SKILL.md", import.meta.url), "utf8");
  const grillWithDocs = readFileSync(new URL("../skills/engineering/grill-with-docs/SKILL.md", import.meta.url), "utf8");

  assert.ok(pluginManifest.skills.includes("./skills/productivity/grill-me"));
  assert.ok(pluginManifest.skills.includes("./skills/productivity/grilling"));
  assert.ok(pluginManifest.skills.includes("./skills/engineering/domain-modeling"));
  assert.match(grillMe, /`grilling`/);
  assert.match(grillWithDocs, /`grilling` and `domain-modeling`/);
  assert.match(grillMe, /available-Skills catalog/);
  assert.match(grillWithDocs, /available-Skills catalog/);
  assert.doesNotMatch(grillMe, /frontier/i);
  assert.doesNotMatch(grillWithDocs, /Offer an ADR/);
});

test("routes planning and implementation closeout through installed orchestrators", () => {
  const pluginManifest = JSON.parse(readFileSync(new URL("../.claude-plugin/plugin.json", import.meta.url), "utf8"));
  const externalDependencies = JSON.parse(readFileSync(new URL("../.agents/external-dependencies.json", import.meta.url), "utf8"));
  const toSpec = readFileSync(new URL("../skills/engineering/to-spec/SKILL.md", import.meta.url), "utf8");
  const toTickets = readFileSync(new URL("../skills/engineering/to-tickets/SKILL.md", import.meta.url), "utf8");
  const implement = readFileSync(new URL("../skills/engineering/implement/SKILL.md", import.meta.url), "utf8");
  const review = readFileSync(new URL("../skills/engineering/review/SKILL.md", import.meta.url), "utf8");

  for (const skill of ["to-spec", "to-tickets", "implement", "review"]) {
    assert.ok(pluginManifest.skills.includes(`./skills/engineering/${skill}`));
  }

  assert.match(toSpec, /model-invoked `manage-panel`/);
  assert.match(toTickets, /model-invoked `manage-panel`/);
  assert.match(implement, /model-invoked `manage-panel`/);
  assert.match(toSpec, /available-Skills catalog/);
  assert.match(toTickets, /available-Skills catalog/);
  assert.match(toSpec, /\.scratch\/<feature-slug>\/spec\.md/);
  assert.match(toTickets, /\.scratch\/<feature-slug>\/issues\/<NN>-<slug>\.md/);
  assert.match(toSpec, /write the local artifact first/);
  assert.match(toTickets, /write every local ticket first/);
  assert.match(toSpec, /Local artifact:/);
  assert.match(toTickets, /Local artifact:/);
  assert.match(toTickets, /Panel issue:\*\* pending-publication/);
  assert.match(toTickets, /Panel status:\*\* pending-publication/);
  assert.match(implement, /model-invoked `review`/);
  assert.match(implement, /originating spec or tickets as the acceptance contract/);
  assert.match(implement, /Panel status: in_progress/);
  assert.match(implement, /move it to `in_review`/);
  assert.match(implement, /Panel status: in_review/);
  assert.match(implement, /Never move it directly to `done`/);
  assert.match(implement, /including `blocked`, `canceled`, or `done` after explicit user acceptance/);
  assert.match(review, /When `implement` invokes this Skill for closeout/);
  assert.match(review, /Matt `code-review` as primary/);
  assert.equal(externalDependencies.dependencies["to-spec"], undefined);
  assert.equal(externalDependencies.dependencies["to-tickets"], undefined);
  assert.equal(externalDependencies.dependencies.implement, undefined);
});

test("keeps composed workflows executable without a Skill tool", () => {
  const paths = [
    "../skills/engineering/implement/SKILL.md",
    "../skills/engineering/review/SKILL.md",
    "../skills/engineering/wayfinder/SKILL.md",
    "../skills/engineering/triage/SKILL.md",
    "../skills/engineering/improve-codebase-architecture/SKILL.md",
    "../skills/engineering/tdd/SKILL.md",
    "../skills/in-progress/implement-spec/SKILL.md",
    "../skills/in-progress/loop-me/SKILL.md",
    "../skills/in-progress/retro/SKILL.md",
    "../skills/in-progress/setup-ts-deep-modules/SKILL.md",
  ];

  for (const path of paths) {
    const skill = readFileSync(new URL(path, import.meta.url), "utf8");
    assert.match(skill, /authoritative available-Skills catalog/);
  }

  const implement = readFileSync(new URL("../skills/engineering/implement/SKILL.md", import.meta.url), "utf8");
  const review = readFileSync(new URL("../skills/engineering/review/SKILL.md", import.meta.url), "utf8");
  const implementSpec = readFileSync(new URL("../skills/in-progress/implement-spec/SKILL.md", import.meta.url), "utf8");
  const continuousLoop = readFileSync(new URL("../skills/engineering/continuous-agent-loop/SKILL.md", import.meta.url), "utf8");

  assert.match(implement, /Skill tool with `tdd`/);
  assert.match(implement, /Skill tool with `commit`/);
  assert.match(review, /absence of a Skill tool does not make a catalog-listed Skill unavailable/i);
  assert.match(implementSpec, /originating spec and tickets as the acceptance contract/);
  assert.match(implementSpec, /validation evidence/);
  assert.match(continuousLoop, /ralphinho-rfc-pipeline/);
  assert.match(continuousLoop, /plankton-code-quality/);
  assert.match(continuousLoop, /verification-loop/);
  assert.match(continuousLoop, /agent-architecture-audit/);
  assert.doesNotMatch(continuousLoop, /continuous-pr|rfc-dag|\/quality-gate|\/harness-audit/);
});

test("uses the personal release identity and generic configuration entrypoint", () => {
  const packageManifest = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
  const pluginManifest = JSON.parse(readFileSync(new URL("../.claude-plugin/plugin.json", import.meta.url), "utf8"));
  const marketplace = JSON.parse(readFileSync(new URL("../.claude-plugin/marketplace.json", import.meta.url), "utf8"));

  assert.equal(packageManifest.name, "shay-skills");
  assert.equal(packageManifest.repository.url, "https://github.com/shay-wong/skills");
  assert.equal(pluginManifest.name, "shay-skills");
  assert.equal(pluginManifest.repository, "https://github.com/shay-wong/skills");
  assert.equal(marketplace.name, "shay");
  assert.equal(marketplace.plugins[0].name, "shay-skills");
  assert.ok(pluginManifest.skills.includes("./skills/engineering/configure-skills"));
  assert.ok(!pluginManifest.skills.includes("./skills/engineering/setup-matt-pocock-skills"));
});

const ponytail = {
  id: "ponytail@ponytail",
  label: "Ponytail",
  type: "codex-plugin",
  marketplace: {
    name: "ponytail",
    source: "https://github.com/DietrichGebert/ponytail.git",
    ref: "0a4dd63ad4541f4f655c4108a295916f3c1d8fda",
  },
};

test("resolves shared external dependencies once", () => {
  const graph = {
    review: [ponytail],
    audit: [ponytail],
  };
  assert.deepEqual(resolveExternalDependencies(["review", "audit"], graph), [ponytail]);
});

test("rejects conflicting options", () => {
  assert.throws(
    () => parseArgs(["--with-deps", "--without-deps", "release"]),
    /Choose either/,
  );
});

test("validates dependency names against the catalog", () => {
  assert.throws(
    () => validateDependencyManifest(
      { version: 1, dependencies: "release" },
      new Set(["release"]),
    ),
    /expected version 1 with a dependencies object/,
  );
  assert.throws(
    () => validateDependencyManifest(
      { version: 1, dependencies: { missing: [ponytail] } },
      new Set(["review"]),
    ),
    /unknown Skill: missing/,
  );
  assert.throws(
    () => validateDependencyManifest(
      { version: 1, dependencies: { review: [{ ...ponytail, id: "wrong@marketplace" }] } },
      new Set(["review"]),
    ),
    /does not match marketplace/,
  );
});

test("selects individual checklist dependencies with keyboard controls", () => {
  const dependencies = ["changelog", "security-review", "code-review"];
  let result = applyChecklistKey(dependencies, new Set(dependencies), 0, "down");
  assert.equal(result.cursor, 1);
  assert.equal(result.done, false);

  result = applyChecklistKey(dependencies, result.selected, result.cursor, "space");
  assert.deepEqual([...result.selected], ["changelog", "code-review"]);
  result = applyChecklistKey(dependencies, result.selected, result.cursor, "n");
  assert.deepEqual([...result.selected], []);
  result = applyChecklistKey(dependencies, result.selected, result.cursor, "a");
  assert.deepEqual([...result.selected], dependencies);
  assert.equal(applyChecklistKey(dependencies, result.selected, result.cursor, "return").done, true);
});

test("dry-run includes or skips declared external dependencies", () => {
  const withDependencies = spawnSync(
    process.execPath,
    [script, "--dry-run", "--with-deps", "review"],
    { encoding: "utf8" },
  );
  assert.equal(withDependencies.status, 0, withDependencies.stderr);
  assert.match(withDependencies.stdout, /External dependencies selected: ponytail@ponytail, github@openai-curated, review-game@PlayableIntelligence\/game-creator/);
  assert.match(withDependencies.stdout, /--skill review/);
  assert.match(withDependencies.stdout, /codex plugin marketplace add https:\/\/github\.com\/DietrichGebert\/ponytail\.git --ref 0a4dd63ad4541f4f655c4108a295916f3c1d8fda/);
  assert.match(withDependencies.stdout, /codex plugin add ponytail@ponytail/);
  assert.match(withDependencies.stdout, /codex plugin add github@openai-curated/);
  assert.match(withDependencies.stdout, /npx --yes skills@latest add 'PlayableIntelligence\/game-creator#4e64b83b5fe400b34ad3a484d9b4a6090b26d512' -g --skill review-game -y/);

  const withoutDependencies = spawnSync(
    process.execPath,
    [script, "--dry-run", "--without-deps", "review"],
    { encoding: "utf8" },
  );
  assert.equal(withoutDependencies.status, 0, withoutDependencies.stderr);
  assert.match(withoutDependencies.stdout, /External dependencies selected: none/);
  assert.match(withoutDependencies.stdout, /External dependencies skipped: ponytail@ponytail/);
  assert.doesNotMatch(withoutDependencies.stdout, /codex plugin add/);
});

test("installs the external frontend design Skill", () => {
  const result = spawnSync(
    process.execPath,
    [script, "--dry-run", "--with-deps", "frontend-design-direction"],
    { encoding: "utf8" },
  );
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /frontend-design@anthropics\/skills/);
  assert.match(result.stdout, /npx --yes skills@latest add 'anthropics\/skills#3b3fad96af16a10759d930941b4520ba0c40edae' -g --skill frontend-design -y/);
});

test("non-interactive dependency choice is explicit", () => {
  const result = spawnSync(process.execPath, [script, "--dry-run", "review"], {
    encoding: "utf8",
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Pass --with-deps or --without-deps/);
});

test("installs selected external dependencies after the repository Skill", () => {
  const directory = mkdtempSync(join(tmpdir(), "install-shay-skills-"));
  const log = join(directory, "commands.log");
  const stub = (name, body) => {
    const path = join(directory, name);
    writeFileSync(path, `#!/usr/bin/env node\n${body}\n`, { mode: 0o755 });
  };

  stub("npx", `
    const fs = require("node:fs");
    fs.appendFileSync(process.env.INSTALL_LOG, "npx " + process.argv.slice(2).join(" ") + "\\n");
  `);
  stub("codex", `
    const fs = require("node:fs");
    const args = process.argv.slice(2);
    fs.appendFileSync(process.env.INSTALL_LOG, "codex " + args.join(" ") + "\\n");
    if (args.join(" ") === "plugin marketplace list --json") console.log(JSON.stringify({ marketplaces: [{ name: "openai-curated" }] }));
    if (args.join(" ") === "plugin list --json") console.log(JSON.stringify({ installed: [] }));
  `);

  try {
    const result = spawnSync(
      process.execPath,
      [script, "--with-deps", "--yes", "review"],
      {
        encoding: "utf8",
        env: {
          ...process.env,
          INSTALL_LOG: log,
          PATH: `${directory}:${process.env.PATH}`,
        },
      },
    );
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(readFileSync(log, "utf8").trim().split("\n"), [
      "npx --yes skills@latest add shay-wong/skills -g --skill review -y",
      "codex plugin marketplace list --json",
      "codex plugin marketplace add https://github.com/DietrichGebert/ponytail.git --ref 0a4dd63ad4541f4f655c4108a295916f3c1d8fda",
      "codex plugin list --json",
      "codex plugin add ponytail@ponytail",
      "codex plugin marketplace list --json",
      "codex plugin list --json",
      "codex plugin add github@openai-curated",
      "npx --yes skills@latest add PlayableIntelligence/game-creator#4e64b83b5fe400b34ad3a484d9b4a6090b26d512 -g --skill review-game -y",
    ]);
  } finally {
    rmSync(directory, { force: true, recursive: true });
  }
});

test("links the complete repository catalog without replacing foreign skills", () => {
  const home = mkdtempSync(join(tmpdir(), "link-shay-skills-"));
  const agents = join(home, ".agents", "skills");
  const claude = join(home, ".claude", "skills");
  const foreignCommit = join(agents, "commit");
  const stale = join(agents, "removed-shay-skill");

  mkdirSync(foreignCommit, { recursive: true });
  writeFileSync(join(foreignCommit, "owner"), "foreign\n");
  symlinkSync(join(repo, "skills", "engineering", "removed-shay-skill"), stale);

  try {
    const result = spawnSync("bash", [linkScript], {
      encoding: "utf8",
      env: { ...process.env, HOME: home },
    });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(readFileSync(join(foreignCommit, "owner"), "utf8"), "foreign\n");
    assert.equal(lstatSync(stale, { throwIfNoEntry: false }), undefined);

    for (const destination of [agents, claude]) {
      const continuousLearning = join(destination, "continuous-learning");
      const writingShape = join(destination, "writing-shape");
      assert.equal(lstatSync(continuousLearning).isSymbolicLink(), true);
      assert.equal(lstatSync(writingShape).isSymbolicLink(), true);
      assert.equal(
        readlinkSync(continuousLearning),
        join(repo, "skills", "engineering", "continuous-learning"),
      );
    }
  } finally {
    rmSync(home, { force: true, recursive: true });
  }
});
