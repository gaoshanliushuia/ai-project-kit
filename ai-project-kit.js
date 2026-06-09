#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const GROUPS = ["01_req", "02_build", "03_qa", "04_delivery", "05_gov"];
const GROUP_ALIASES = {
  req: ["01_req"],
  build: ["02_build"],
  qa: ["03_qa"],
  delivery: ["04_delivery"],
  gov: ["05_gov"],
  all: GROUPS,
};

const WORKSPACE_SUBDIRS_BY_STAGE = {
  "01_requirements": [
    "01_stakeholders",
    "02_research-notes",
    "03_scope",
    "04_processes",
    "05_requirements",
    "06_prototypes",
    "07_baseline",
    "08_traceability",
    "09_reviews",
  ],
  "01_architecture": [
    "01_drivers",
    "02_context",
    "03_options",
    "04_decisions",
    "05_diagrams",
    "06_integration",
    "07_risk-register",
    "08_reviews",
    "09_baseline",
  ],
  "02_design": [
    "01_modules",
    "02_interfaces",
    "03_flows",
    "04_states",
    "05_rules",
    "06_exceptions",
    "07_test-points",
    "08_reviews",
    "09_baseline",
  ],
  "03_database": [
    "01_models",
    "02_dictionary",
    "03_scripts",
    "04_migration",
    "05_data-quality",
    "06_capacity",
    "07_security",
    "08_reviews",
    "09_baseline",
  ],
  "04_codebase": [
    "01_tasks",
    "02_implementation",
    "03_builds",
    "04_configs",
    "05_code-reviews",
    "06_defects",
    "07_tech-debt",
    "08_handoff",
  ],
  "05_release": [
    "01_plans",
    "02_artifacts",
    "03_environments",
    "04_deployment",
    "05_rollback",
    "06_verification",
    "07_known-issues",
    "08_retrospective",
  ],
  "01_delivery": [
    "01_go-live",
    "02_acceptance",
    "03_training",
    "04_manuals",
    "05_operations",
    "06_open-items",
    "07_support",
    "08_retrospective",
  ],
  "01_testing": [
    "01_strategy",
    "02_cases",
    "03_test-data",
    "04_execution",
    "05_defects",
    "06_regression",
    "07_reports",
    "08_traceability",
  ],
  "02_changes": [
    "01_requests",
    "02_impact-analysis",
    "03_approvals",
    "04_implementation",
    "05_verification",
    "06_configuration",
    "07_closure",
    "08_register",
  ],
};

const GROUP_WORKSPACE_STAGES = {
  "01_req": ["01_requirements"],
  "02_build": [
    "01_architecture",
    "02_design",
    "03_database",
    "04_codebase",
    "05_release",
  ],
  "03_qa": ["01_testing", "02_changes"],
  "04_delivery": ["01_delivery"],
  "05_gov": [],
};

const GROUP_EXTRA_WORKSPACE_DIRS = {
  "01_req": ["handoff"],
  "02_build": ["imports/req"],
  "03_qa": ["feedback/to-build"],
  "04_delivery": [],
  "05_gov": [
    "01_usage-log",
    "02_prompt-reviews",
    "03_security-checks",
    "04_code-reviews",
    "05_output-acceptance",
    "06_metrics",
    "07_retrospective",
  ],
};

function usage() {
  return `ai-project-kit

Usage:
  npm run init <target> [req|build|qa|delivery|gov|all]

Examples:
  npm run init ../my-project
  npm run init ../my-project req
  npm run init ../my-project all
  npm run init ../my-project delivery

Options:
  -n, --project-name   Optional project name inserted into generated README.md.
  -f, --force          Overwrite existing files. Existing files are skipped by default.
  -h, --help           Show this help.

Note:
  If your npm version does not pass arguments without "--", use:
  npm run init -- ../my-project req
`;
}

function parseArgs(argv) {
  const args = {
    target: undefined,
    group: "all",
    projectName: undefined,
    force: false,
    help: false,
  };

  const tokens = [...argv];
  const positionals = [];
  while (tokens.length > 0) {
    const token = tokens.shift();
    if (token === "--help" || token === "-h") {
      args.help = true;
    } else if (token === "--force" || token === "-f") {
      args.force = true;
    } else if (token === "--project-name" || token === "-n") {
      args.projectName = readValue(token, tokens);
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
    throw new Error(`Invalid group "${args.group}". Use req, build, qa, delivery, gov, or all.`);
  }

  return args;
}

function readValue(option, tokens) {
  const value = tokens.shift();
  if (!value || value.startsWith("-")) {
    throw new Error(`Missing value for ${option}`);
  }
  return value;
}

function copyFileIfNeeded(source, target, force) {
  if (fs.existsSync(target) && !force) {
    return;
  }
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

function copyTree(sourceRoot, targetRoot, force) {
  if (!fs.existsSync(sourceRoot)) {
    throw new Error(`Missing template directory: ${sourceRoot}`);
  }

  for (const entry of fs.readdirSync(sourceRoot, { withFileTypes: true })) {
    const source = path.join(sourceRoot, entry.name);
    const target = path.join(targetRoot, entry.name);
    if (entry.isDirectory()) {
      copyTree(source, target, force);
    } else if (entry.isFile()) {
      copyFileIfNeeded(source, target, force);
    }
  }
}

function writeKeepFile(directory) {
  fs.mkdirSync(directory, { recursive: true });
  const keepFile = path.join(directory, ".gitkeep");
  if (!fs.existsSync(keepFile)) {
    fs.writeFileSync(keepFile, "", "utf8");
  }
}

function buildProjectReadme(templateRoot, projectName) {
  const readmePath = path.join(templateRoot, "README.md");
  let content = fs.readFileSync(readmePath, "utf8");
  if (!projectName) {
    return content;
  }

  const marker = "这是通过 ai-project-kit 初始化后的项目入口说明。";
  return content.replace(marker, `${marker}\n\n当前项目：${projectName}`);
}

function materializeWorkspace(groupRoot, groupName) {
  const workspaceRoot = path.join(groupRoot, "workspace");

  for (const stage of GROUP_WORKSPACE_STAGES[groupName]) {
    for (const subdir of WORKSPACE_SUBDIRS_BY_STAGE[stage]) {
      writeKeepFile(path.join(workspaceRoot, stage, subdir));
    }
  }

  for (const extra of GROUP_EXTRA_WORKSPACE_DIRS[groupName]) {
    writeKeepFile(path.join(workspaceRoot, extra));
  }
}

function initProject(options) {
  const repoRoot = __dirname;
  const templateRoot = path.join(repoRoot, "templates");
  const targetRoot = path.resolve(options.target);
  const groups = GROUP_ALIASES[options.group];

  fs.mkdirSync(targetRoot, { recursive: true });

  const readmeTarget = path.join(targetRoot, "README.md");
  if (!fs.existsSync(readmeTarget) || options.force) {
    fs.writeFileSync(readmeTarget, buildProjectReadme(templateRoot, options.projectName), "utf8");
  }

  for (const group of groups) {
    copyTree(path.join(templateRoot, group), path.join(targetRoot, group), options.force);
    materializeWorkspace(path.join(targetRoot, group), group);
  }

  console.log(`Initialized groups ${groups.join(", ")} at: ${targetRoot}`);
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
