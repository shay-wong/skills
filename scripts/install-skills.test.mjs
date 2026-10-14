import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  existsSync,
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
  parseArgs,
  resolveExternalDependencies,
  validateDependencyManifest,
} from "./install.mjs";
import { parseArgs as parseProjectSetupArgs } from "./setup.mjs";
import { applyChecklistKey } from "./select-items.mjs";

const script = fileURLToPath(new URL("./install.mjs", import.meta.url));
const setupScript = fileURLToPath(new URL("./setup.mjs", import.meta.url));
const linkScript = fileURLToPath(new URL("./link-skills.sh", import.meta.url));
const gitlabHookInstaller = fileURLToPath(new URL("../skills/engineering/gitlab-mr/scripts/install-pre-push-hook.sh", import.meta.url));
const gitlabHookRunner = fileURLToPath(new URL("../skills/engineering/gitlab-mr/scripts/pre-push-hook.sh", import.meta.url));
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
  const commit = readFileSync(new URL("../skills/engineering/commit/SKILL.md", import.meta.url), "utf8");
  const review = readFileSync(new URL("../skills/engineering/review/SKILL.md", import.meta.url), "utf8");
  const reviewPolicy = readFileSync(new URL("../skills/engineering/review/references/review-policy.md", import.meta.url), "utf8");

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
  assert.match(toTickets, /GitHub issue:\*\* pending-publication/);
  assert.match(toTickets, /GitLab issue:\*\* pending-publication/);
  assert.match(toTickets, /Never use a Panel identifier as the code-host Issue value or as a branch hint/);
  assert.match(toTickets, /Panel owns selecting, binding, and dispatching one unblocked leaf Issue/);
  assert.match(toTickets, /Stop after publication/);
  assert.match(implement, /model-invoked `review`/);
  assert.match(implement, /originating spec or tickets as the acceptance contract/);
  assert.match(implement, /Do not independently select a child or reproduce Panel's parent, blocker, or dispatch logic/);
  assert.match(implement, /Complete every required Panel binding and claim before any Git mutation/);
  assert.match(implement, /Panel `id` and `identifier` remain tracker-only/);
  assert.match(implement, /Never substitute the Panel identifier/);
  assert.match(implement, /Panel status: in_progress/);
  assert.match(implement, /move it to `in_review`/);
  assert.match(implement, /Panel status: in_review/);
  assert.match(implement, /Never move it directly to `done`/);
  assert.match(implement, /including `blocked`, `canceled`, or `done` after explicit user acceptance/);
  assert.match(implement, /linked Jira `externalKey`/);
  assert.match(implement, /pass the verified Jira key to `commit`/i);
  assert.match(commit, /read-only linked Jira lookup through the installed model-invoked `manage-panel` Skill/);
  assert.match(commit, /explicit user-supplied message or task reference[\s\S]*verified Jira `externalKey`[\s\S]*repository commit-message rules/i);
  assert.match(commit, /Never use a Panel `id` or `identifier` as a task reference/);
  assert.match(commit, /omit the task reference[\s\S]*do not fall back to the Panel identifier/i);
  assert.match(commit, /A subject is enough[\s\S]*durable compatibility, migration, deprecation, or rollback boundary/i);
  assert.match(commit, /do not inventory[\s\S]*test commands or results[\s\S]*user confirmation[\s\S]*session history/i);
  assert.match(commit, /verification evidence in the final report or review description/i);
  assert.match(review, /When `implement` invokes this Skill for closeout/);
  assert.match(review, /Matt `code-review` as primary/);
  assert.match(review, /Agent conversation, Skill routing, tool use, or workflow handling/);
  assert.match(review, /exact task or conversation turn range/);
  assert.match(review, /Panel or another product runtime owns issue eligibility/);
  assert.match(review, /Do not duplicate product scheduling rules inside adjacent Skills/);
  assert.match(review, /# 评审结论：通过/);
  assert.match(review, /# 评审结论：阻断/);
  assert.match(review, /# 评审结论：暂无法判断/);
  assert.match(review, /评审状态：<中文说明>/);
  assert.match(review, /Translate `Lean already\. Ship\.` to `无需精简。`/);
  assert.match(review, /Treat `net: -0 lines possible\.` as no simplification finding/);
  assert.match(reviewPolicy, /task or conversation identity, exact turn range, material tool outputs/);
  assert.match(reviewPolicy, /exact turn or tool event that contradicts the loaded Skill/);
  assert.equal(externalDependencies.dependencies["to-spec"], undefined);
  assert.equal(externalDependencies.dependencies["to-tickets"], undefined);
  assert.equal(externalDependencies.dependencies.implement, undefined);
});

test("to-tickets chooses shared-logic extraction timing from evidence", () => {
  const toTickets = readFileSync(new URL("../skills/engineering/to-tickets/SKILL.md", import.meta.url), "utf8");

  assert.match(toTickets, /Extract first/);
  assert.match(toTickets, /Slice first, extract later/);
  assert.match(toTickets, /independently verifiable refactoring exception/);
  assert.match(toTickets, /children of the same parent requirement/);
  assert.match(toTickets, /Default to slice first when the shared contract is not yet proven/);
  assert.doesNotMatch(toTickets, /Any prefactoring should be done first/);
});

test("routes duplicate prevention and review through code-dedup", () => {
  const pluginManifest = JSON.parse(readFileSync(new URL("../.claude-plugin/plugin.json", import.meta.url), "utf8"));
  const externalDependencies = JSON.parse(readFileSync(new URL("../.agents/external-dependencies.json", import.meta.url), "utf8"));
  const implement = readFileSync(new URL("../skills/engineering/implement/SKILL.md", import.meta.url), "utf8");
  const review = readFileSync(new URL("../skills/engineering/review/SKILL.md", import.meta.url), "utf8");
  const codeDedup = readFileSync(new URL("../skills/engineering/code-dedup/SKILL.md", import.meta.url), "utf8");

  assert.ok(pluginManifest.skills.includes("./skills/engineering/code-dedup"));
  assert.match(implement, /\.deslop\.toml/);
  assert.match(implement, /model-invoked `code-dedup`/);
  assert.match(review, /\.deslop\.toml/);
  assert.match(review, /`code-dedup`/);
  assert.match(codeDedup, /`find-similar`/);
  assert.match(codeDedup, /`report-for-file`/);
  assert.match(codeDedup, /`report-for-range`/);
  assert.match(codeDedup, /`top-offenders`/);
  assert.match(codeDedup, /`cluster-by-id`/);
  assert.match(codeDedup, /deslop \. --notext --nohtml --no-color/);
  assert.match(codeDedup, /does not install/i);
  assert.equal(
    resolveExternalDependencies(["review", "code-dedup"], externalDependencies.dependencies)
      .filter((dependency) => dependency.id === "deslop@system")
      .length,
    1,
  );
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
  assert.deepEqual(packageManifest.bin, {
    install: "scripts/install.mjs",
    setup: "scripts/setup.mjs",
  });
  assert.equal(pluginManifest.name, "shay-skills");
  assert.equal(pluginManifest.repository, "https://github.com/shay-wong/skills");
  assert.equal(marketplace.name, "shay");
  assert.equal(marketplace.plugins[0].name, "shay-skills");
  assert.ok(pluginManifest.skills.includes("./skills/engineering/configure-skills"));
  assert.ok(!pluginManifest.skills.includes("./skills/engineering/setup-matt-pocock-skills"));
});

test("adds GitLab milestones only with verified work-item release evidence", () => {
  const gitlabMr = readFileSync(new URL("../skills/engineering/gitlab-mr/SKILL.md", import.meta.url), "utf8");

  assert.match(gitlabMr, /Jira `fixVersions`、GitLab 或 GitHub Issue milestone/);
  assert.match(gitlabMr, /Fork 配置中的 milestone control 只提供候选值，不构成版本归属证据/);
  assert.match(gitlabMr, /目标分支、分支名、Tag、最新 active milestone/);
  assert.match(gitlabMr, /先向用户确认/);
  assert.match(gitlabMr, /仍无法确认版本归属时省略 `--milestone`/);
});

test("keeps GitHub PR and GitLab MR workflows distinct while sharing description quality", () => {
  const pluginManifest = JSON.parse(readFileSync(new URL("../.claude-plugin/plugin.json", import.meta.url), "utf8"));
  const githubPr = readFileSync(new URL("../skills/in-progress/pr/SKILL.md", import.meta.url), "utf8");
  const gitlabMr = readFileSync(new URL("../skills/engineering/gitlab-mr/SKILL.md", import.meta.url), "utf8");
  const retro = readFileSync(new URL("../skills/in-progress/retro/SKILL.md", import.meta.url), "utf8");

  assert.match(githubPr, /GitHub Pull Request body/);
  assert.match(githubPr, /For GitLab Merge Requests, use `gitlab-mr`/);
  assert.match(githubPr, /GitHub PR template under `\.github\/`/);
  assert.match(gitlabMr, /For GitHub Pull Request bodies, use `pr`/);
  assert.match(gitlabMr, /GitLab 专属行为/);
  for (const skill of [githubPr, gitlabMr]) {
    assert.match(skill, /Before\s*\/\s*After/i);
    assert.match(skill, /one-way door/);
    assert.match(skill, /two-way door/);
    assert.match(skill, /CONTEXT\.md/);
  }
  assert.ok(!pluginManifest.skills.includes("./skills/in-progress/pr"));
  assert.match(retro, /deterministic check/);
  assert.match(retro, /no pre-commit or CI guardrail/);
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

const deslop = {
  id: "deslop@system",
  label: "Deslop duplicate analysis",
  type: "system-tool",
  executables: ["deslop", "deslop-mcp"],
  codexMcp: {
    name: "deslop",
    command: "deslop-mcp",
    args: [],
  },
  install: {
    darwin: { manager: "brew", package: "nimblesite/tap/deslop" },
    linux: { manager: "brew", package: "nimblesite/tap/deslop" },
    win32: {
      manager: "scoop",
      package: "deslop",
      bucket: {
        name: "nimblesite",
        source: "https://github.com/Nimblesite/scoop-bucket",
      },
    },
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

test("parses explicit project tool selections", () => {
  assert.deepEqual(
    parseProjectSetupArgs(["--tool", "deslop", "--tool=codegraph", "./app"]),
    {
      dryRun: false,
      help: false,
      target: "./app",
      toolMode: "select",
      tools: ["deslop", "codegraph"],
    },
  );
  assert.equal(parseProjectSetupArgs(["--yes"]).toolMode, "include");
  assert.equal(parseProjectSetupArgs(["--without-tools"]).toolMode, "exclude");
  assert.throws(
    () => parseProjectSetupArgs(["--with-tools", "--tool", "deslop"]),
    /Choose one project tool selection mode/,
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
  assert.deepEqual(
    validateDependencyManifest(
      { version: 1, dependencies: { "code-dedup": [deslop] } },
      new Set(["code-dedup"]),
    ),
    { "code-dedup": [deslop] },
  );
  assert.throws(
    () => validateDependencyManifest(
      {
        version: 1,
        dependencies: {
          "code-dedup": [{ ...deslop, executables: [] }],
        },
      },
      new Set(["code-dedup"]),
    ),
    /Invalid system tool dependency/,
  );
  assert.throws(
    () => validateDependencyManifest(
      {
        version: 1,
        dependencies: {
          "code-dedup": [{ ...deslop, codexMcp: { ...deslop.codexMcp, args: "--stdio" } }],
        },
      },
      new Set(["code-dedup"]),
    ),
    /Invalid Codex MCP configuration/,
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
  assert.match(withDependencies.stdout, /External dependencies selected: ponytail@ponytail, github@openai-curated, review-game@PlayableIntelligence\/game-creator, deslop@system/);
  assert.match(withDependencies.stdout, /--skill review/);
  assert.match(withDependencies.stdout, /codex plugin marketplace add https:\/\/github\.com\/DietrichGebert\/ponytail\.git --ref 0a4dd63ad4541f4f655c4108a295916f3c1d8fda/);
  assert.match(withDependencies.stdout, /codex plugin add ponytail@ponytail/);
  assert.match(withDependencies.stdout, /codex plugin add github@openai-curated/);
  assert.match(withDependencies.stdout, /npx --yes skills@latest add 'PlayableIntelligence\/game-creator#4e64b83b5fe400b34ad3a484d9b4a6090b26d512' -g --skill review-game -y/);
  if (process.platform === "win32") {
    assert.match(withDependencies.stdout, /scoop bucket add nimblesite https:\/\/github\.com\/Nimblesite\/scoop-bucket/);
    assert.match(withDependencies.stdout, /scoop install deslop/);
  } else {
    assert.match(withDependencies.stdout, /brew install nimblesite\/tap\/deslop/);
  }
  assert.match(withDependencies.stdout, /codex mcp get deslop --json/);
  assert.match(withDependencies.stdout, /codex mcp add deslop -- deslop-mcp/);

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

test("skill installation does not expose project setup", () => {
  const result = spawnSync(process.execPath, [script, "--dry-run", "--without-deps", "init"], {
    encoding: "utf8",
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Unknown Skill: init/);
});

test("project setup dry-run exposes selectable CodeGraph and Deslop actions", () => {
  const directory = mkdtempSync(join(tmpdir(), "shay-skills-setup-dry-run-"));
  try {
    const allTools = spawnSync(
      process.execPath,
      [setupScript, "--dry-run", "--with-tools", directory],
      { encoding: "utf8" },
    );
    assert.equal(allTools.status, 0, allTools.stderr);
    assert.match(allTools.stdout, /Project tools selected: codegraph, deslop/);
    assert.match(allTools.stdout, new RegExp(`codegraph init ${directory}`));
    assert.match(allTools.stdout, new RegExp(`deslop ${directory} --notext --nohtml --no-color`));
    assert.match(allTools.stdout, new RegExp(`Create when missing: ${directory}/\\.deslop\\.toml`));

    const deslopOnly = spawnSync(
      process.execPath,
      [setupScript, "--dry-run", "--tool", "deslop", directory],
      { encoding: "utf8" },
    );
    assert.equal(deslopOnly.status, 0, deslopOnly.stderr);
    assert.match(deslopOnly.stdout, /Project tools selected: deslop/);
    assert.match(deslopOnly.stdout, /Project tools skipped: codegraph/);
    assert.doesNotMatch(deslopOnly.stdout, /codegraph init/);

    const withoutTools = spawnSync(
      process.execPath,
      [setupScript, "--dry-run", "--without-tools", directory],
      { encoding: "utf8" },
    );
    assert.equal(withoutTools.status, 0, withoutTools.stderr);
    assert.match(withoutTools.stdout, /Project tools selected: none/);
    assert.doesNotMatch(withoutTools.stdout, /Project tool command/);
  } finally {
    rmSync(directory, { force: true, recursive: true });
  }
});

test("non-interactive project tool choice is explicit", () => {
  const result = spawnSync(process.execPath, [setupScript, "--dry-run"], {
    encoding: "utf8",
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Pass --with-tools, --without-tools, or one or more --tool options/);
});

test("project setup rejects unknown or unavailable selected tools", () => {
  const directory = mkdtempSync(join(tmpdir(), "shay-skills-setup-missing-"));
  const bin = join(directory, "bin");
  mkdirSync(bin);
  symlinkSync(process.execPath, join(bin, "node"));
  try {
    const unknown = spawnSync(
      process.execPath,
      [setupScript, "--tool", "unknown", directory],
      { encoding: "utf8" },
    );
    assert.equal(unknown.status, 1);
    assert.match(unknown.stderr, /Unknown project tool: unknown/);

    const unavailable = spawnSync(
      process.execPath,
      [setupScript, "--tool", "codegraph", directory],
      { encoding: "utf8", env: { ...process.env, PATH: `${bin}:/usr/bin:/bin` } },
    );
    assert.equal(unavailable.status, 1);
    assert.match(unavailable.stderr, /Required command is unavailable: codegraph/);

    const skipped = spawnSync(
      process.execPath,
      [setupScript, "--without-tools", directory],
      { encoding: "utf8", env: { ...process.env, PATH: `${bin}:/usr/bin:/bin` } },
    );
    assert.equal(skipped.status, 0, skipped.stderr);
  } finally {
    rmSync(directory, { force: true, recursive: true });
  }
});

test("initializes selected project tools without overwriting project configuration", () => {
  const directory = mkdtempSync(join(tmpdir(), "shay-skills-setup-"));
  const bin = join(directory, "bin");
  const project = join(directory, "project");
  const log = join(directory, "commands.log");
  mkdirSync(bin);
  mkdirSync(project);
  writeFileSync(join(project, ".gitignore"), "node_modules\n");
  writeFileSync(join(project, "app.js"), "function app() { return 1; }\n");
  const stub = (name, body) => {
    const path = join(bin, name);
    writeFileSync(path, `#!/usr/bin/env node\n${body}\n`, { mode: 0o755 });
  };

  stub("codegraph", `
    const fs = require("node:fs");
    const path = require("node:path");
    const args = process.argv.slice(2);
    if (args[0] === "--version") process.exit(0);
    fs.appendFileSync(process.env.INSTALL_LOG, "codegraph " + args.join(" ") + "\\n");
    fs.mkdirSync(path.join(args[1], ".codegraph"), { recursive: true });
  `);
  stub("deslop", `
    const fs = require("node:fs");
    const path = require("node:path");
    const args = process.argv.slice(2);
    if (args[0] === "--version") process.exit(0);
    fs.appendFileSync(process.env.INSTALL_LOG, "deslop " + args.join(" ") + "\\n");
    fs.mkdirSync(path.join(args[0], ".deslop"), { recursive: true });
    fs.writeFileSync(path.join(args[0], ".deslop", "deslop-report.json"), "{}\\n");
    process.exit(Number(process.env.DESLOP_EXIT || 0));
  `);

  try {
    const env = { ...process.env, INSTALL_LOG: log, PATH: `${bin}:${process.env.PATH}` };
    const first = spawnSync(
      process.execPath,
      [setupScript, "--with-tools", project],
      { encoding: "utf8", env },
    );
    assert.equal(first.status, 0, first.stderr);
    assert.equal(readFileSync(join(project, ".deslop.toml"), "utf8"), "# Deslop is enabled for this repository. Add exclusions or thresholds when needed.\n");
    assert.equal(readFileSync(join(project, ".gitignore"), "utf8"), "node_modules\n.deslop/\n");
    assert.equal(existsSync(join(project, ".codegraph")), true);
    assert.equal(existsSync(join(project, ".deslop", "deslop-report.json")), true);

    writeFileSync(join(project, ".deslop.toml"), "[threshold]\nmax_duplication_percent = 5\n");
    const second = spawnSync(
      process.execPath,
      [setupScript, "--with-tools", project],
      { encoding: "utf8", env: { ...env, DESLOP_EXIT: "3" } },
    );
    assert.equal(second.status, 0, second.stderr);
    assert.match(second.stdout, /duplication threshold is currently exceeded/);
    assert.equal(readFileSync(join(project, ".deslop.toml"), "utf8"), "[threshold]\nmax_duplication_percent = 5\n");
    assert.equal(readFileSync(join(project, ".gitignore"), "utf8"), "node_modules\n.deslop/\n");
    assert.deepEqual(readFileSync(log, "utf8").trim().split("\n"), [
      `codegraph init ${project}`,
      `deslop ${project} --notext --nohtml --no-color`,
      `codegraph init ${project}`,
      `deslop ${project} --notext --nohtml --no-color`,
    ]);
  } finally {
    rmSync(directory, { force: true, recursive: true });
  }
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
    if (args.join(" ") === "mcp get deslop --json") console.log(JSON.stringify({
      name: "deslop",
      enabled: true,
      transport: { type: "stdio", command: "deslop-mcp", args: [] },
    }));
  `);
  stub("deslop", "process.exit(0);");
  stub("deslop-mcp", "process.exit(0);");

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
      "codex mcp get deslop --json",
    ]);
  } finally {
    rmSync(directory, { force: true, recursive: true });
  }
});

test("installs and verifies the Deslop system tool after the repository Skill", () => {
  const directory = mkdtempSync(join(tmpdir(), "install-shay-skills-deslop-"));
  const log = join(directory, "commands.log");
  const marker = join(directory, "installed");
  const manager = process.platform === "win32" ? "scoop" : "brew";
  const stub = (name, body) => {
    const path = join(directory, name);
    writeFileSync(path, `#!/usr/bin/env node\n${body}\n`, { mode: 0o755 });
  };

  stub("npx", `
    require("node:fs").appendFileSync(process.env.INSTALL_LOG, "npx " + process.argv.slice(2).join(" ") + "\\n");
  `);
  for (const executable of ["deslop", "deslop-mcp"]) {
    stub(executable, `
      const fs = require("node:fs");
      fs.appendFileSync(process.env.INSTALL_LOG, "${executable} " + process.argv.slice(2).join(" ") + "\\n");
      process.exit(fs.existsSync(process.env.DESLOP_MARKER) ? 0 : 1);
    `);
  }
  stub(manager, `
    const fs = require("node:fs");
    const args = process.argv.slice(2);
    fs.appendFileSync(process.env.INSTALL_LOG, "${manager} " + args.join(" ") + "\\n");
    if (args[0] === "install") fs.writeFileSync(process.env.DESLOP_MARKER, "installed\\n");
    if (args.join(" ") === "bucket list") console.log("Name\\n----\\n");
  `);
  stub("codex", `
    const fs = require("node:fs");
    const args = process.argv.slice(2);
    fs.appendFileSync(process.env.INSTALL_LOG, "codex " + args.join(" ") + "\\n");
    if (args.join(" ") === "mcp get deslop --json") {
      if (!fs.existsSync(process.env.MCP_MARKER)) {
        console.error("Error: No MCP server named 'deslop' found.");
        process.exit(1);
      }
      console.log(JSON.stringify({
        name: "deslop",
        enabled: true,
        transport: { type: "stdio", command: "deslop-mcp", args: [] },
      }));
    }
    if (args.join(" ") === "mcp add deslop -- deslop-mcp") {
      fs.writeFileSync(process.env.MCP_MARKER, "registered\\n");
    }
  `);

  try {
    const result = spawnSync(
      process.execPath,
      [script, "--with-deps", "--yes", "code-dedup"],
      {
        encoding: "utf8",
        env: {
          ...process.env,
          DESLOP_MARKER: marker,
          INSTALL_LOG: log,
          MCP_MARKER: join(directory, "mcp-registered"),
          PATH: `${directory}:${process.env.PATH}`,
        },
      },
    );
    assert.equal(result.status, 0, result.stderr);
    const commands = readFileSync(log, "utf8").trim().split("\n");
    assert.equal(commands[0], "npx --yes skills@latest add shay-wong/skills -g --skill code-dedup -y");
    assert.equal(commands.filter((command) => command === "deslop --version").length, 2);
    assert.equal(commands.filter((command) => command === "deslop-mcp --version").length, 2);
    assert.ok(commands.some((command) => command === `${manager} install ${process.platform === "win32" ? "deslop" : "nimblesite/tap/deslop"}`));
    assert.deepEqual(commands.filter((command) => command.startsWith("codex mcp ")), [
      "codex mcp get deslop --json",
      "codex mcp add deslop -- deslop-mcp",
      "codex mcp get deslop --json",
    ]);
    assert.match(result.stdout, /External dependency verified: Deslop duplicate analysis \(deslop@system\)/);
    assert.match(result.stdout, /Codex MCP registered: deslop/);
  } finally {
    rmSync(directory, { force: true, recursive: true });
  }
});

test("registers Deslop MCP when executables are already available", () => {
  const directory = mkdtempSync(join(tmpdir(), "install-shay-skills-deslop-present-"));
  const log = join(directory, "commands.log");
  const manager = process.platform === "win32" ? "scoop" : "brew";
  const stub = (name, body) => {
    const path = join(directory, name);
    writeFileSync(path, `#!/usr/bin/env node\n${body}\n`, { mode: 0o755 });
  };

  stub("npx", "process.exit(0);");
  stub("deslop", "process.exit(0);");
  stub("deslop-mcp", "process.exit(0);");
  stub(manager, `require("node:fs").appendFileSync(process.env.INSTALL_LOG, "${manager}\\n");`);
  stub("codex", `
    const fs = require("node:fs");
    const args = process.argv.slice(2);
    fs.appendFileSync(process.env.INSTALL_LOG, "codex " + args.join(" ") + "\\n");
    if (args.join(" ") === "mcp get deslop --json") {
      if (!fs.existsSync(process.env.MCP_MARKER)) {
        console.error("Error: No MCP server named 'deslop' found.");
        process.exit(1);
      }
      console.log(JSON.stringify({
        name: "deslop",
        enabled: true,
        transport: { type: "stdio", command: "deslop-mcp", args: [] },
      }));
    }
    if (args.join(" ") === "mcp add deslop -- deslop-mcp") {
      fs.writeFileSync(process.env.MCP_MARKER, "registered\\n");
    }
  `);

  try {
    const result = spawnSync(
      process.execPath,
      [script, "--with-deps", "--yes", "code-dedup"],
      {
        encoding: "utf8",
        env: {
          ...process.env,
          INSTALL_LOG: log,
          MCP_MARKER: join(directory, "mcp-registered"),
          PATH: `${directory}:${process.env.PATH}`,
        },
      },
    );
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /External dependency already installed: Deslop duplicate analysis \(deslop@system\)/);
    assert.deepEqual(readFileSync(log, "utf8").trim().split("\n"), [
      "codex mcp get deslop --json",
      "codex mcp add deslop -- deslop-mcp",
      "codex mcp get deslop --json",
    ]);
  } finally {
    rmSync(directory, { force: true, recursive: true });
  }
});

test("keeps a matching Deslop MCP registration", () => {
  const directory = mkdtempSync(join(tmpdir(), "install-shay-skills-deslop-mcp-present-"));
  const log = join(directory, "commands.log");
  const stub = (name, body) => {
    const path = join(directory, name);
    writeFileSync(path, `#!/usr/bin/env node\n${body}\n`, { mode: 0o755 });
  };

  stub("npx", "process.exit(0);");
  stub("deslop", "process.exit(0);");
  stub("deslop-mcp", "process.exit(0);");
  stub("codex", `
    const fs = require("node:fs");
    const args = process.argv.slice(2);
    fs.appendFileSync(process.env.INSTALL_LOG, "codex " + args.join(" ") + "\\n");
    console.log(JSON.stringify({
      name: "deslop",
      enabled: true,
      transport: { type: "stdio", command: "deslop-mcp", args: [] },
    }));
  `);

  try {
    const result = spawnSync(
      process.execPath,
      [script, "--with-deps", "--yes", "code-dedup"],
      {
        encoding: "utf8",
        env: { ...process.env, INSTALL_LOG: log, PATH: `${directory}:${process.env.PATH}` },
      },
    );
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Codex MCP already configured: deslop/);
    assert.deepEqual(readFileSync(log, "utf8").trim().split("\n"), ["codex mcp get deslop --json"]);
  } finally {
    rmSync(directory, { force: true, recursive: true });
  }
});

test("refuses to replace a conflicting Deslop MCP registration", () => {
  const directory = mkdtempSync(join(tmpdir(), "install-shay-skills-deslop-mcp-conflict-"));
  const log = join(directory, "commands.log");
  const stub = (name, body) => {
    const path = join(directory, name);
    writeFileSync(path, `#!/usr/bin/env node\n${body}\n`, { mode: 0o755 });
  };

  stub("npx", "process.exit(0);");
  stub("deslop", "process.exit(0);");
  stub("deslop-mcp", "process.exit(0);");
  stub("codex", `
    require("node:fs").appendFileSync(process.env.INSTALL_LOG, "codex " + process.argv.slice(2).join(" ") + "\\n");
    console.log(JSON.stringify({
      name: "deslop",
      enabled: true,
      transport: { type: "stdio", command: "custom-deslop-mcp", args: ["--custom"] },
    }));
  `);

  try {
    const result = spawnSync(
      process.execPath,
      [script, "--with-deps", "--yes", "code-dedup"],
      {
        encoding: "utf8",
        env: { ...process.env, INSTALL_LOG: log, PATH: `${directory}:${process.env.PATH}` },
      },
    );
    assert.equal(result.status, 1);
    assert.match(result.stderr, /MCP server deslop is already configured differently/);
    assert.deepEqual(readFileSync(log, "utf8").trim().split("\n"), ["codex mcp get deslop --json"]);
  } finally {
    rmSync(directory, { force: true, recursive: true });
  }
});

test("fails clearly when Codex is unavailable for MCP registration", () => {
  const directory = mkdtempSync(join(tmpdir(), "install-shay-skills-deslop-codex-"));
  const stub = (name, body) => {
    const path = join(directory, name);
    writeFileSync(path, `#!/usr/bin/env node\n${body}\n`, { mode: 0o755 });
  };

  symlinkSync(process.execPath, join(directory, "node"));
  stub("npx", "process.exit(0);");
  stub("deslop", "process.exit(0);");
  stub("deslop-mcp", "process.exit(0);");

  try {
    const result = spawnSync(
      process.execPath,
      [script, "--with-deps", "--yes", "code-dedup"],
      { encoding: "utf8", env: { ...process.env, PATH: `${directory}:/usr/bin:/bin` } },
    );
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Required command is unavailable: codex/);
  } finally {
    rmSync(directory, { force: true, recursive: true });
  }
});

test("fails clearly when the Deslop package manager is unavailable", () => {
  const directory = mkdtempSync(join(tmpdir(), "install-shay-skills-deslop-manager-"));
  const stub = (name, body) => {
    const path = join(directory, name);
    writeFileSync(path, `#!/usr/bin/env node\n${body}\n`, { mode: 0o755 });
  };

  symlinkSync(process.execPath, join(directory, "node"));
  stub("npx", "process.exit(0);");
  stub("deslop", "process.exit(1);");
  stub("deslop-mcp", "process.exit(1);");

  try {
    const result = spawnSync(
      process.execPath,
      [script, "--with-deps", "--yes", "code-dedup"],
      {
        encoding: "utf8",
        env: { ...process.env, PATH: `${directory}:/usr/bin:/bin` },
      },
    );
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Required command is unavailable: (brew|scoop)/);
  } finally {
    rmSync(directory, { force: true, recursive: true });
  }
});

test("migrates only the broken legacy GitLab MR pre-push Hook", () => {
  const home = mkdtempSync(join(tmpdir(), "gitlab-mr-hook-migration-"));
  const project = join(home, "project");
  const hook = join(project, ".git", "hooks", "pre-push");
  const legacyRunner = join(home, ".codex", "skills", "gitlab-mr", "scripts", "pre-push-hook.sh");
  const foreignRunner = join(home, "missing", "pre-push-hook.sh");

  try {
    const init = spawnSync("git", ["init", project], { encoding: "utf8" });
    assert.equal(init.status, 0, init.stderr);
    symlinkSync(legacyRunner, hook);

    const migrated = spawnSync("sh", [gitlabHookInstaller, project], {
      encoding: "utf8",
      env: { ...process.env, HOME: home },
    });
    assert.equal(migrated.status, 0, migrated.stderr);
    assert.equal(readlinkSync(hook), gitlabHookRunner);
    assert.match(migrated.stdout, /Migrated legacy GitLab MR pre-push Hook/);

    rmSync(hook);
    symlinkSync(foreignRunner, hook);
    const refused = spawnSync("sh", [gitlabHookInstaller, project], {
      encoding: "utf8",
      env: { ...process.env, HOME: home },
    });
    assert.equal(refused.status, 1);
    assert.equal(readlinkSync(hook), foreignRunner);
    assert.match(refused.stderr, /Refusing to overwrite existing pre-push Hook/);
  } finally {
    rmSync(home, { force: true, recursive: true });
  }
});

test("links active and specialized skills without misc or replacing foreign skills", () => {
  const home = mkdtempSync(join(tmpdir(), "link-shay-skills-"));
  const agents = join(home, ".agents", "skills");
  const claude = join(home, ".claude", "skills");
  const foreignCommit = join(agents, "commit");
  const stale = join(agents, "removed-shay-skill");
  const excludedMisc = join(agents, "setup-pre-commit");

  mkdirSync(foreignCommit, { recursive: true });
  writeFileSync(join(foreignCommit, "owner"), "foreign\n");
  symlinkSync(join(repo, "skills", "engineering", "removed-shay-skill"), stale);
  symlinkSync(join(repo, "skills", "misc", "setup-pre-commit"), excludedMisc);

  try {
    const result = spawnSync("bash", [linkScript], {
      encoding: "utf8",
      env: { ...process.env, HOME: home },
    });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(readFileSync(join(foreignCommit, "owner"), "utf8"), "foreign\n");
    assert.equal(lstatSync(stale, { throwIfNoEntry: false }), undefined);
    assert.equal(lstatSync(excludedMisc, { throwIfNoEntry: false }), undefined);

    for (const destination of [agents, claude]) {
      const continuousLearning = join(destination, "continuous-learning");
      const agentPayment = join(destination, "agent-payment-x402");
      const implementSpec = join(destination, "implement-spec");
      const writingShape = join(destination, "writing-shape");
      assert.equal(lstatSync(continuousLearning).isSymbolicLink(), true);
      assert.equal(lstatSync(agentPayment).isSymbolicLink(), true);
      assert.equal(lstatSync(implementSpec).isSymbolicLink(), true);
      assert.equal(lstatSync(writingShape).isSymbolicLink(), true);
      assert.equal(
        readlinkSync(continuousLearning),
        join(repo, "skills", "engineering", "continuous-learning"),
      );
      assert.equal(
        readlinkSync(agentPayment),
        join(repo, "skills", "specialized", "agent-payment-x402"),
      );
      assert.equal(
        readlinkSync(implementSpec),
        join(repo, "skills", "in-progress", "implement-spec"),
      );
      assert.equal(lstatSync(join(destination, "setup-pre-commit"), { throwIfNoEntry: false }), undefined);
    }
  } finally {
    rmSync(home, { force: true, recursive: true });
  }
});
