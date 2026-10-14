#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { appendFileSync, existsSync, readFileSync, realpathSync, statSync, writeFileSync } from "node:fs";
import { join, resolve as resolvePath } from "node:path";
import { fileURLToPath } from "node:url";

import { selectItems } from "./select-items.mjs";

const PROJECT_TOOLS = [
  { id: "codegraph", label: "CodeGraph project index" },
  { id: "deslop", label: "Deslop duplicate analysis" },
];

export const USAGE = `Usage: setup [options] [path]

Options:
  --with-tools      Initialize every supported project tool
  --without-tools   Skip every project tool
  --tool <name>     Initialize one tool; repeat to select more
  --yes             Select every project tool without prompting
  --dry-run         Print the resolved actions without changing the project
  -h, --help        Show this help

Without an explicit selection, the command shows an interactive checklist.`;

export function parseArgs(argv) {
  const options = {
    dryRun: false,
    help: false,
    target: ".",
    toolMode: "ask",
    tools: [],
  };
  let targetSeen = false;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--with-tools" || arg === "--yes" || arg === "--without-tools") {
      const nextMode = arg === "--without-tools" ? "exclude" : "include";
      if (options.toolMode !== "ask" && options.toolMode !== nextMode) {
        throw new Error("Choose one project tool selection mode.");
      }
      options.toolMode = nextMode;
    } else if (arg === "--tool" || arg.startsWith("--tool=")) {
      if (options.toolMode !== "ask" && options.toolMode !== "select") {
        throw new Error("Choose one project tool selection mode.");
      }
      const tool = arg === "--tool" ? argv[++index] : arg.slice("--tool=".length);
      if (!tool || tool.startsWith("-")) throw new Error("--tool requires a tool name.");
      options.toolMode = "select";
      if (!options.tools.includes(tool)) options.tools.push(tool);
    } else if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--help" || arg === "-h") {
      options.help = true;
    } else if (arg.startsWith("-")) {
      throw new Error(`Unknown project setup option: ${arg}`);
    } else if (targetSeen) {
      throw new Error("Project setup accepts at most one path.");
    } else {
      options.target = arg;
      targetSeen = true;
    }
  }

  return options;
}

function formatCommand(command, args) {
  const quote = (value) => (/^[A-Za-z0-9_@./:=*-]+$/.test(value) ? value : `'${value.replaceAll("'", "'\\''")}'`);
  return [command, ...args].map(quote).join(" ");
}

function commandHasVersion(command) {
  const result = spawnSync(command, ["--version"], { encoding: "utf8" });
  if (result.error?.code === "ENOENT") return false;
  if (result.error) throw result.error;
  return result.status === 0;
}

function runCommand(command, args) {
  console.log(`Command: ${formatCommand(command, args)}`);
  const result = spawnSync(command, args, { stdio: "inherit" });
  if (result.error?.code === "ENOENT") throw new Error(`Required command is unavailable: ${command}.`);
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${formatCommand(command, args)} failed with status ${result.status}.`);
}

function projectToolCommands(tool, target) {
  if (tool.id === "codegraph") return [["codegraph", ["init", target, "--yes"]]];
  return [["deslop", [target, "--notext", "--nohtml", "--no-color"]]];
}

function ensureDeslopProjectFiles(target) {
  const config = join(target, ".deslop.toml");
  if (!existsSync(config)) {
    writeFileSync(config, "# Deslop is enabled for this repository. Add exclusions or thresholds when needed.\n");
    console.log(`Created: ${config}`);
  }

  const gitignore = join(target, ".gitignore");
  const contents = existsSync(gitignore) ? readFileSync(gitignore, "utf8") : "";
  const checkIgnore = spawnSync(
    "git",
    ["-C", target, "check-ignore", "--no-index", "--quiet", ".deslop/deslop-report.json"],
    { encoding: "utf8" },
  );
  if (checkIgnore.error && checkIgnore.error.code !== "ENOENT") throw checkIgnore.error;
  const ignoresDeslop = checkIgnore.status === 0 || contents
    .split(/\r?\n/)
    .map((line) => line.trim())
    .some((line) => [".deslop", ".deslop/", "/.deslop", "/.deslop/"].includes(line));
  if (!ignoresDeslop) {
    const separator = contents.length > 0 && !contents.endsWith("\n") ? "\n" : "";
    appendFileSync(gitignore, `${separator}.deslop/\n`);
    console.log(`Updated: ${gitignore}`);
  }
}

function initializeProjectTool(tool, target) {
  if (!commandHasVersion(tool.id)) throw new Error(`Required command is unavailable: ${tool.id}.`);
  if (tool.id === "codegraph") {
    runCommand(...projectToolCommands(tool, target)[0]);
    return;
  }

  ensureDeslopProjectFiles(target);
  const [command, args] = projectToolCommands(tool, target)[0];
  console.log(`Command: ${formatCommand(command, args)}`);
  const result = spawnSync(command, args, { stdio: "inherit" });
  if (result.error) throw result.error;
  if (![0, 3].includes(result.status)) {
    throw new Error(`${formatCommand(command, args)} failed with status ${result.status}.`);
  }
  if (result.status === 3) console.log("Deslop initialized; the configured duplication threshold is currently exceeded.");
}

export async function main(argv) {
  const options = parseArgs(argv);
  if (options.help) {
    console.log(USAGE);
    return 0;
  }

  const knownTools = new Set(PROJECT_TOOLS.map((tool) => tool.id));
  for (const tool of options.tools) {
    if (!knownTools.has(tool)) throw new Error(`Unknown project tool: ${tool}`);
  }

  const target = resolvePath(options.target);
  if (!existsSync(target) || !statSync(target).isDirectory()) {
    throw new Error(`Project path is not a directory: ${target}`);
  }

  let selectedTools = [];
  if (options.toolMode === "include") selectedTools = PROJECT_TOOLS;
  if (options.toolMode === "select") {
    const selectedIds = new Set(options.tools);
    selectedTools = PROJECT_TOOLS.filter((tool) => selectedIds.has(tool.id));
  }
  if (options.toolMode === "ask") {
    selectedTools = await selectItems(
      PROJECT_TOOLS,
      "project tools",
      "Pass --with-tools, --without-tools, or one or more --tool options in non-interactive use.",
    );
  }

  const selectedIds = new Set(selectedTools.map((tool) => tool.id));
  const skippedTools = PROJECT_TOOLS.filter((tool) => !selectedIds.has(tool.id));
  console.log(`Project: ${target}`);
  console.log(`Project tools selected: ${selectedTools.length === 0 ? "none" : selectedTools.map((tool) => tool.id).join(", ")}`);
  console.log(`Project tools skipped: ${skippedTools.length === 0 ? "none" : skippedTools.map((tool) => tool.id).join(", ")}`);

  if (options.dryRun) {
    for (const tool of selectedTools) {
      if (tool.id === "deslop") {
        console.log(`Create when missing: ${join(target, ".deslop.toml")}`);
        console.log(`Add when missing: .deslop/ to ${join(target, ".gitignore")}`);
      }
      for (const [command, args] of projectToolCommands(tool, target)) {
        console.log(`Project tool command: ${formatCommand(command, args)}`);
      }
    }
    return 0;
  }

  for (const tool of selectedTools) initializeProjectTool(tool, target);
  return 0;
}

const isEntrypoint = process.argv[1]
  && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url);

if (isEntrypoint) {
  main(process.argv.slice(2)).then(
    (status) => { process.exitCode = status; },
    (error) => {
      console.error(`error: ${error.message}`);
      process.exitCode = 1;
    },
  );
}
