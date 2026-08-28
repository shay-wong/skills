#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, realpathSync } from "node:fs";
import { join } from "node:path";
import { clearScreenDown, cursorTo, emitKeypressEvents, moveCursor } from "node:readline";
import { fileURLToPath } from "node:url";

const REPO_ROOT = fileURLToPath(new URL("../", import.meta.url));
const DEPENDENCY_FILE = join(REPO_ROOT, ".agents", "external-dependencies.json");
const SKILL_SOURCE = "shay-wong/skills";

export const USAGE = `Usage: install-shay-skills [options] <skill...>

Options:
  --with-deps      Install all declared external dependencies
  --without-deps   Install only the selected repository Skills
  --yes             Skip the skills.sh confirmation prompt
  --dry-run         Print the resolved command without installing
  -h, --help        Show this help

Without a dependency option, the installer shows an interactive external dependency checklist.`;

export function parseArgs(argv) {
  const options = {
    dependencyMode: "ask",
    dryRun: false,
    help: false,
    skills: [],
    yes: false,
  };

  for (const arg of argv) {
    if (arg === "--with-deps" || arg === "--without-deps") {
      const nextMode = arg === "--with-deps" ? "include" : "exclude";
      if (options.dependencyMode !== "ask" && options.dependencyMode !== nextMode) {
        throw new Error("Choose either --with-deps or --without-deps, not both.");
      }
      options.dependencyMode = nextMode;
    } else if (arg === "--yes") {
      options.yes = true;
    } else if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--help" || arg === "-h") {
      options.help = true;
    } else if (arg.startsWith("-")) {
      throw new Error(`Unknown option: ${arg}`);
    } else {
      options.skills.push(arg);
    }
  }

  return options;
}

export function resolveExternalDependencies(selectedSkills, dependencyGraph) {
  const resolved = [];
  const seen = new Set();
  for (const skill of selectedSkills) {
    for (const dependency of dependencyGraph[skill] ?? []) {
      if (seen.has(dependency.id)) continue;
      seen.add(dependency.id);
      resolved.push(dependency);
    }
  }
  return resolved;
}

export function validateDependencyManifest(manifest, knownSkills) {
  if (
    manifest?.version !== 1
    || typeof manifest.dependencies !== "object"
    || manifest.dependencies === null
    || Array.isArray(manifest.dependencies)
  ) {
    throw new Error("Invalid dependency manifest: expected version 1 with a dependencies object.");
  }

  for (const [skill, dependencies] of Object.entries(manifest.dependencies)) {
    if (!knownSkills.has(skill)) throw new Error(`Dependency manifest names unknown Skill: ${skill}`);
    if (!Array.isArray(dependencies)) throw new Error(`Dependencies for ${skill} must be an array.`);
    for (const dependency of dependencies) {
      if (typeof dependency?.id !== "string" || typeof dependency.label !== "string") {
        throw new Error(`Invalid external dependency for ${skill}.`);
      }
      if (dependency.type === "codex-plugin") {
        if (
          typeof dependency.marketplace?.name !== "string"
          || (dependency.marketplace.source !== undefined && typeof dependency.marketplace.source !== "string")
          || (dependency.marketplace.ref !== undefined && typeof dependency.marketplace.ref !== "string")
          || (dependency.marketplace.ref && !dependency.marketplace.source)
        ) {
          throw new Error(`Invalid Codex plugin dependency for ${skill}.`);
        }
        if (!dependency.id.endsWith(`@${dependency.marketplace.name}`)) {
          throw new Error(`Plugin ${dependency.id} does not match marketplace ${dependency.marketplace.name}.`);
        }
        if (dependency.marketplace.source) {
          let source;
          try {
            source = new URL(dependency.marketplace.source);
          } catch {
            throw new Error(`Marketplace source for ${dependency.id} must be an HTTPS URL.`);
          }
          if (source.protocol !== "https:") {
            throw new Error(`Marketplace source for ${dependency.id} must be an HTTPS URL.`);
          }
        }
      } else if (dependency.type === "agent-skill") {
        if (
          typeof dependency.source !== "string"
          || typeof dependency.skill !== "string"
          || (dependency.ref !== undefined && typeof dependency.ref !== "string")
          || dependency.id !== `${dependency.skill}@${dependency.source}`
        ) {
          throw new Error(`Invalid Agent Skill dependency for ${skill}.`);
        }
      } else if (dependency.type === "npm-global") {
        if (
          typeof dependency.package !== "string"
          || typeof dependency.packageName !== "string"
          || dependency.id !== `${dependency.packageName}@npm`
        ) {
          throw new Error(`Invalid global npm dependency for ${skill}.`);
        }
      } else {
        throw new Error(`Unsupported external dependency type for ${dependency.id}.`);
      }
    }
  }
  return manifest.dependencies;
}

export function applyChecklistKey(dependencies, selectedDependencies, cursor, key) {
  const selected = new Set(selectedDependencies);
  if (key === "up") cursor = (cursor - 1 + dependencies.length) % dependencies.length;
  if (key === "down") cursor = (cursor + 1) % dependencies.length;
  if (key === "space") {
    const dependency = dependencies[cursor];
    if (selected.has(dependency)) selected.delete(dependency);
    else selected.add(dependency);
  }
  if (key === "a") return { cursor, done: false, selected: new Set(dependencies) };
  if (key === "n") return { cursor, done: false, selected: new Set() };
  return { cursor, done: key === "return", selected };
}

function discoverSkillNames() {
  const skillsDir = join(REPO_ROOT, "skills");
  const names = new Set();

  for (const bucket of readdirSync(skillsDir, { withFileTypes: true })) {
    if (!bucket.isDirectory()) continue;
    const bucketDir = join(skillsDir, bucket.name);
    for (const entry of readdirSync(bucketDir, { withFileTypes: true })) {
      if (entry.isDirectory() && existsSync(join(bucketDir, entry.name, "SKILL.md"))) {
        names.add(entry.name);
      }
    }
  }
  return names;
}

function formatCommand(command, args) {
  const quote = (value) => (/^[A-Za-z0-9_@./:=*-]+$/.test(value) ? value : `'${value.replaceAll("'", "'\\''")}'`);
  return [command, ...args].map(quote).join(" ");
}

async function selectDependencies(dependencies) {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error("Dependencies require a choice. Pass --with-deps or --without-deps in non-interactive use.");
  }

  const input = process.stdin;
  const output = process.stdout;
  const wasRaw = input.isRaw;
  const dependencyIds = dependencies.map((dependency) => dependency.id);
  let selected = new Set(dependencyIds);
  let cursor = 0;
  let renderedLines = 0;

  function render() {
    if (renderedLines > 0) {
      moveCursor(output, 0, -renderedLines);
      cursorTo(output, 0);
      clearScreenDown(output);
    }
    const lines = [
      "Select external dependencies:",
      ...dependencies.map((dependency, index) => (
        `${index === cursor ? ">" : " "} [${selected.has(dependency.id) ? "x" : " "}] ${dependency.label} (${dependency.id})`
      )),
      "Up/Down: move  Space: toggle  a: all  n: none  Enter: install",
    ];
    output.write(`${lines.join("\n")}\n`);
    renderedLines = lines.length;
  }

  emitKeypressEvents(input);
  input.setRawMode(true);
  input.resume();
  output.write("\x1b[?25l");
  render();

  return new Promise((resolve, reject) => {
    function finish(error) {
      input.off("keypress", onKeypress);
      input.setRawMode(wasRaw);
      input.pause();
      output.write("\x1b[?25h");
      if (error) reject(error);
      else resolve(dependencies.filter((dependency) => selected.has(dependency.id)));
    }

    function onKeypress(character, key = {}) {
      if (key.ctrl && key.name === "c") {
        finish(new Error("Dependency selection cancelled."));
        return;
      }
      const pressed = key.name === "space" || character === " " ? "space" : key.name ?? character;
      const result = applyChecklistKey(dependencyIds, selected, cursor, pressed);
      selected = result.selected;
      cursor = result.cursor;
      if (result.done) finish();
      else render();
    }

    input.on("keypress", onKeypress);
  });
}

function normalizeGitSource(source) {
  return source.replace(/\.git$/, "").replace(/\/$/, "").toLowerCase();
}

function readCommandJson(command, args) {
  const result = spawnSync(command, args, { encoding: "utf8" });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${formatCommand(command, args)} failed: ${result.stderr.trim()}`);
  }
  try {
    return JSON.parse(result.stdout);
  } catch {
    throw new Error(`${formatCommand(command, args)} returned invalid JSON.`);
  }
}

function runCommand(command, args) {
  console.log(`Command: ${formatCommand(command, args)}`);
  const result = spawnSync(command, args, { stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${formatCommand(command, args)} failed with status ${result.status}.`);
}

function externalDependencyCommands(dependency) {
  if (dependency.type === "agent-skill") {
    const source = dependency.ref ? `${dependency.source}#${dependency.ref}` : dependency.source;
    return [["npx", ["--yes", "skills@latest", "add", source, "-g", "--skill", dependency.skill, "-y"]]];
  }
  if (dependency.type === "npm-global") {
    return [["npm", ["install", "--global", dependency.package]]];
  }

  const marketplaceArgs = ["plugin", "marketplace", "add", dependency.marketplace.source];
  if (dependency.marketplace.ref) marketplaceArgs.push("--ref", dependency.marketplace.ref);
  const commands = [["codex", ["plugin", "add", dependency.id]]];
  if (dependency.marketplace.source) commands.unshift(["codex", marketplaceArgs]);
  return commands;
}

function installExternalDependency(dependency) {
  if (dependency.type === "agent-skill") {
    runCommand(...externalDependencyCommands(dependency)[0]);
    return;
  }
  if (dependency.type === "npm-global") {
    const npmState = readCommandJson("npm", ["list", "--global", "--depth=0", "--json"]);
    if (npmState.dependencies?.[dependency.packageName]) {
      console.log(`External dependency already installed: ${dependency.label} (${dependency.id})`);
    } else {
      runCommand(...externalDependencyCommands(dependency)[0]);
    }
    return;
  }

  const marketplaceState = readCommandJson("codex", ["plugin", "marketplace", "list", "--json"]);
  const marketplace = marketplaceState.marketplaces?.find((item) => item.name === dependency.marketplace.name);
  if (marketplace) {
    const actualSource = marketplace.marketplaceSource?.source;
    if (
      dependency.marketplace.source
      && (!actualSource || normalizeGitSource(actualSource) !== normalizeGitSource(dependency.marketplace.source))
    ) {
      throw new Error(`Marketplace ${dependency.marketplace.name} is already configured from a different source.`);
    }
  } else {
    if (!dependency.marketplace.source) {
      throw new Error(`Required marketplace is unavailable: ${dependency.marketplace.name}.`);
    }
    runCommand(...externalDependencyCommands(dependency)[0]);
  }

  const pluginState = readCommandJson("codex", ["plugin", "list", "--json"]);
  const plugin = pluginState.installed?.find((item) => item.pluginId === dependency.id);
  if (plugin?.enabled) {
    console.log(`External dependency already installed: ${dependency.label} (${dependency.id})`);
    return;
  }
  runCommand(...externalDependencyCommands(dependency).at(-1));
}

export async function main(argv) {
  const options = parseArgs(argv);
  if (options.help) {
    console.log(USAGE);
    return 0;
  }
  if (options.skills.length === 0) throw new Error(`Select at least one Skill.\n\n${USAGE}`);

  const knownSkills = discoverSkillNames();
  for (const skill of options.skills) {
    if (!knownSkills.has(skill)) throw new Error(`Unknown Skill: ${skill}`);
  }

  const manifest = JSON.parse(readFileSync(DEPENDENCY_FILE, "utf8"));
  const dependencyGraph = validateDependencyManifest(manifest, knownSkills);
  const dependencies = resolveExternalDependencies(options.skills, dependencyGraph);

  let selectedDependencies = [];
  if (options.dependencyMode === "include") selectedDependencies = dependencies;
  if (dependencies.length > 0 && options.dependencyMode === "ask") {
    selectedDependencies = await selectDependencies(dependencies);
  }

  const selectedDependencyIds = new Set(selectedDependencies.map((dependency) => dependency.id));
  const skippedDependencies = dependencies.filter((dependency) => !selectedDependencyIds.has(dependency.id));
  const npxArgs = ["--yes", "skills@latest", "add", SKILL_SOURCE, "-g", "--skill", ...options.skills];
  if (options.yes) npxArgs.push("-y");

  console.log(`Selected Skills: ${options.skills.join(", ")}`);
  console.log(`External dependencies: ${dependencies.length === 0 ? "none" : dependencies.map((dependency) => dependency.id).join(", ")}`);
  if (dependencies.length > 0) {
    console.log(`External dependencies selected: ${selectedDependencies.length === 0 ? "none" : selectedDependencies.map((dependency) => dependency.id).join(", ")}`);
    console.log(`External dependencies skipped: ${skippedDependencies.length === 0 ? "none" : skippedDependencies.map((dependency) => dependency.id).join(", ")}`);
  }
  console.log(`Command: ${formatCommand("npx", npxArgs)}`);

  if (options.dryRun) {
    for (const dependency of selectedDependencies) {
      for (const [command, args] of externalDependencyCommands(dependency)) {
        console.log(`External dependency command (when missing): ${formatCommand(command, args)}`);
      }
    }
    return 0;
  }

  const result = spawnSync("npx", npxArgs, { stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) return result.status ?? 1;
  for (const dependency of selectedDependencies) installExternalDependency(dependency);
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
