#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const GROUPS = ["01_req", "02_build", "03_qa", "04_change", "05_delivery", "06_gov"];
const FRAMEWORK_DIR = "ai-kit-framework";
const GROUP_ALIASES = {
  req: ["01_req"],
  build: ["02_build"],
  qa: ["03_qa"],
  change: ["04_change"],
  delivery: ["05_delivery"],
  gov: ["06_gov"],
  all: GROUPS,
};

function usage() {
  return `ai-project-kit

Usage:
  npm run init <target> [req|build|qa|change|delivery|gov|all]

Examples:
  npm run init ../my-project
  npm run init ../my-project req
  npm run init ../my-project all
  npm run init ../my-project delivery

Options:
  -h, --help           Show this help.
`;
}

function parseArgs(argv) {
  const args = {
    target: undefined,
    group: "all",
    help: false,
  };

  const tokens = [...argv];
  const positionals = [];
  while (tokens.length > 0) {
    const token = tokens.shift();
    if (token === "--help" || token === "-h") {
      args.help = true;
    } else if (token.startsWith("-")) {
      throw new Error(`Unknown option: ${token}`);
    } else {
      positionals.push(token);
    }
  }

  if (args.help) {
    return args;
  }

  if (positionals[0]) {
    args.target = positionals[0];
  }

  if (positionals[1]) {
    args.group = positionals[1];
  }

  if (positionals.length > 2) {
    throw new Error(`Too many arguments: ${positionals.slice(2).join(" ")}`);
  }

  if (!args.target) {
    throw new Error("Missing target directory. Example: npm run init ../my-project");
  }

  if (!GROUP_ALIASES[args.group]) {
    throw new Error(`Invalid group "${args.group}". Use req, build, qa, change, delivery, gov, or all.`);
  }

  return args;
}

function copyFileIfNeeded(source, target) {
  if (fs.existsSync(target)) {
    return;
  }
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

function copyTree(sourceRoot, targetRoot) {
  if (!fs.existsSync(sourceRoot)) {
    throw new Error(`Missing template directory: ${sourceRoot}`);
  }

  fs.mkdirSync(targetRoot, { recursive: true });

  for (const entry of fs.readdirSync(sourceRoot, { withFileTypes: true })) {
    const source = path.join(sourceRoot, entry.name);
    const target = path.join(targetRoot, entry.name);
    if (entry.isDirectory()) {
      copyTree(source, target);
    } else if (entry.isFile()) {
      copyFileIfNeeded(source, target);
    }
  }
}

function buildProjectReadme(templateRoot) {
  const readmePath = path.join(templateRoot, "README.md");
  return fs.readFileSync(readmePath, "utf8");
}

function copyToolScripts(sourceRoot, targetRoot) {
  if (!fs.existsSync(sourceRoot)) {
    return [];
  }

  const copied = [];
  for (const entry of fs.readdirSync(sourceRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }
    copyTree(path.join(sourceRoot, entry.name), path.join(targetRoot, entry.name));
    copied.push(entry.name);
  }
  return copied;
}

function initProject(options) {
  const repoRoot = __dirname;
  const templateRoot = path.join(repoRoot, "templates");
  const scriptsRoot = path.join(repoRoot, "scripts");
  const targetRoot = path.resolve(options.target);
  const frameworkRoot = path.join(targetRoot, FRAMEWORK_DIR);
  const groups = GROUP_ALIASES[options.group];

  fs.mkdirSync(targetRoot, { recursive: true });

  fs.mkdirSync(frameworkRoot, { recursive: true });

  const readmeTarget = path.join(frameworkRoot, "README.md");
  if (!fs.existsSync(readmeTarget)) {
    fs.writeFileSync(readmeTarget, buildProjectReadme(templateRoot), "utf8");
  }

  for (const group of groups) {
    copyTree(path.join(templateRoot, group), path.join(targetRoot, group));
  }

  const toolScripts = copyToolScripts(scriptsRoot, frameworkRoot);

  const summary = [
    `Initialized ${FRAMEWORK_DIR} at: ${frameworkRoot}`,
    `Project guide: ${path.join(frameworkRoot, "README.md")}`,
    `Initialized groups ${groups.join(", ")} at: ${targetRoot}`,
  ];
  if (toolScripts.length > 0) {
    summary.push(`Initialized ${FRAMEWORK_DIR} tool scripts: ${toolScripts.join(", ")}`);
  }
  summary.push(
    "",
    "Next steps:",
    `  npm --prefix ${path.join(FRAMEWORK_DIR, "cursor-script")} run sync:rule`,
    `  npm --prefix ${path.join(FRAMEWORK_DIR, "cursor-script")} run sync:skill`,
    "",
    `Open ${FRAMEWORK_DIR}/README.md for the full onboarding guide.`
  );
  console.log(summary.join("\n"));
}

function main() {
  try {
    const options = parseArgs(process.argv.slice(2));
    if (options.help) {
      process.stdout.write(usage());
      return;
    }
    initProject(options);
  } catch (error) {
    console.error(error.message);
    console.error("");
    process.stderr.write(usage());
    process.exitCode = 1;
  }
}

main();
