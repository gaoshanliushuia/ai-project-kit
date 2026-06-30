#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const GROUPS = ["01_req", "02_build", "03_qa", "04_change", "05_delivery", "06_gov"];
const FRAMEWORK_DIR = "ai-kit-framework";
const STAGES = [
  {
    id: "req-baseline",
    name: "需求基线",
    group: "req",
    playbook: "01_req/playbook/01_requirements",
    workspace: "01_req/workspace/03_baseline/",
  },
  {
    id: "architecture",
    name: "架构设计",
    group: "build",
    playbook: "02_build/playbook/01_architecture",
    workspace: "02_build/workspace/01_architecture/",
  },
  {
    id: "design",
    name: "详细设计",
    group: "build",
    playbook: "02_build/playbook/02_design",
    workspace: "02_build/workspace/02_design/",
  },
  {
    id: "coding",
    name: "代码实现",
    group: "build",
    playbook: "02_build/playbook/03_code",
    workspace: "02_build/workspace/03_code/",
  },
  {
    id: "release",
    name: "版本发布",
    group: "build",
    playbook: "02_build/playbook/04_release",
    workspace: "02_build/workspace/04_release/",
  },
  {
    id: "testing",
    name: "测试与质量保证",
    group: "qa",
    playbook: "03_qa/playbook/01_testing",
    workspace: "03_qa/workspace/01_testing/",
  },
  {
    id: "change",
    name: "变更管理",
    group: "change",
    playbook: "04_change/playbook/01_change",
    workspace: "04_change/workspace/01_change/",
  },
  {
    id: "delivery",
    name: "交付与验收",
    group: "delivery",
    playbook: "05_delivery/playbook/01_delivery",
    workspace: "05_delivery/workspace/01_delivery/",
  },
  {
    id: "governance",
    name: "AI 治理留痕",
    group: "gov",
    playbook: "06_gov/playbook/01_governance",
    workspace: "06_gov/workspace/01_governance/",
  },
];
const TEXT_EXTENSIONS = new Set([
  ".js",
  ".json",
  ".md",
  ".mjs",
  ".txt",
  ".yaml",
  ".yml",
]);
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
  npm run init <target> [req|build|qa|change|delivery|gov|all] [project-prefix]
  npm run init <target> [req|build|qa|change|delivery|gov|all] [--project-prefix <code>]

Examples:
  npm run init ../my-project
  npm run init ../my-project req
  npm run init ../my-project all
  npm run init ../my-project delivery
  npm run init ../qtgs-project all qtgs
  npm run init ../qtgs-project all --project-prefix qtgs

Options:
  --project-prefix     Prefix target workgroup directories, e.g. qtgs -> qtgs01req.
                       For npm compatibility, the prefix may also be the third positional argument.
  -h, --help           Show this help.
`;
}

function parseArgs(argv) {
  const args = {
    target: undefined,
    group: "all",
    projectPrefix: "",
    help: false,
  };

  const tokens = [...argv];
  const positionals = [];
  while (tokens.length > 0) {
    const token = tokens.shift();
    if (token === "--help" || token === "-h") {
      args.help = true;
    } else if (token === "--project-prefix") {
      const value = tokens.shift();
      if (!value) {
        throw new Error("--project-prefix requires a value");
      }
      args.projectPrefix = value;
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

  if (positionals[2]) {
    if (args.projectPrefix) {
      throw new Error("Project prefix was provided both positionally and with --project-prefix.");
    }
    args.projectPrefix = positionals[2];
  }

  if (positionals.length > 3) {
    throw new Error(`Too many arguments: ${positionals.slice(3).join(" ")}`);
  }

  if (!args.target) {
    throw new Error("Missing target directory. Example: npm run init ../my-project");
  }

  if (!GROUP_ALIASES[args.group]) {
    throw new Error(`Invalid group "${args.group}". Use req, build, qa, change, delivery, gov, or all.`);
  }

  if (args.projectPrefix && !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(args.projectPrefix)) {
    throw new Error("--project-prefix may only contain letters, numbers, underscores, and hyphens.");
  }

  return args;
}

function groupTargetName(group, projectPrefix) {
  if (!projectPrefix) {
    return group;
  }
  return `${projectPrefix}${group.replace(/_/g, "")}`;
}

function buildProjectMap(projectPrefix) {
  const groups = {};
  for (const group of GROUPS) {
    const key = group.replace(/^\d+_/, "");
    groups[key] = {
      template: group,
      path: groupTargetName(group, projectPrefix),
    };
  }

  const baseMap = { groups };
  const stages = {};
  for (const stage of STAGES) {
    const playbook = rewriteProjectReferences(stage.playbook, baseMap);
    stages[stage.id] = {
      name: stage.name,
      group: stage.group,
      playbook,
      skill: `${playbook}/skills/SKILL.md`,
      rule: `${playbook}/rules/RULE.md`,
      agent: `${playbook}/agents/agent.md`,
      workspace: rewriteProjectReferences(stage.workspace, baseMap),
    };
  }

  return {
    project: {
      code: projectPrefix || "default",
    },
    groups,
    stages,
  };
}

function formatProjectMap(projectMap) {
  const lines = [
    "# Generated by ai-project-kit init. Template paths stay stable; project paths may vary.",
    "project:",
    `  code: ${projectMap.project.code}`,
    "",
    "groups:",
  ];

  for (const [key, value] of Object.entries(projectMap.groups)) {
    lines.push(`  ${key}:`, `    template: ${value.template}`, `    path: ${value.path}`);
  }

  lines.push("", "stages:");
  for (const [key, value] of Object.entries(projectMap.stages ?? {})) {
    lines.push(
      `  ${key}:`,
      `    name: ${value.name}`,
      `    group: ${value.group}`,
      `    playbook: ${value.playbook}`,
      `    skill: ${value.skill}`,
      `    rule: ${value.rule}`,
      `    agent: ${value.agent}`,
      `    workspace: ${value.workspace}`
    );
  }

  return `${lines.join("\n")}\n`;
}

function writeProjectMap(frameworkRoot, projectPrefix) {
  const target = path.join(frameworkRoot, "project-map.yaml");
  if (fs.existsSync(target)) {
    return false;
  }
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, formatProjectMap(buildProjectMap(projectPrefix)), "utf8");
  return true;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function shouldRewriteTextFile(filePath) {
  return TEXT_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}

function projectMappings(projectMap) {
  return Object.values(projectMap.groups ?? {}).filter(
    (entry) => entry.template && entry.path && entry.template !== entry.path
  );
}

function rewriteProjectReferences(content, projectMap) {
  let next = content;
  for (const entry of projectMappings(projectMap)) {
    const pattern = new RegExp(
      `(^|[^A-Za-z0-9_])${escapeRegExp(entry.template)}(?=/|\\\\|\\*\\*|\\b)`,
      "g"
    );
    next = next.replace(pattern, `$1${entry.path}`);
  }
  return next;
}

function copyFileIfNeeded(source, target, projectMap) {
  if (fs.existsSync(target)) {
    return;
  }
  fs.mkdirSync(path.dirname(target), { recursive: true });
  if (projectMap && shouldRewriteTextFile(source)) {
    const content = fs.readFileSync(source, "utf8");
    fs.writeFileSync(target, rewriteProjectReferences(content, projectMap), "utf8");
    return;
  }
  fs.copyFileSync(source, target);
}

function copyTree(sourceRoot, targetRoot, projectMap) {
  if (!fs.existsSync(sourceRoot)) {
    throw new Error(`Missing template directory: ${sourceRoot}`);
  }

  fs.mkdirSync(targetRoot, { recursive: true });

  for (const entry of fs.readdirSync(sourceRoot, { withFileTypes: true })) {
    const source = path.join(sourceRoot, entry.name);
    const target = path.join(targetRoot, entry.name);
    if (entry.isDirectory()) {
      copyTree(source, target, projectMap);
    } else if (entry.isFile()) {
      copyFileIfNeeded(source, target, projectMap);
    }
  }
}

function copyFrameworkTools(sourceRoot, targetRoot, projectMap) {
  if (!fs.existsSync(sourceRoot)) {
    return [];
  }

  const copied = [];
  for (const entry of fs.readdirSync(sourceRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }
    copyTree(path.join(sourceRoot, entry.name), path.join(targetRoot, entry.name), projectMap);
    copied.push(entry.name);
  }
  return copied;
}

function copyFrameworkDirectoryIfExists(frameworkSource, frameworkTarget, name, projectMap) {
  const source = path.join(frameworkSource, name);
  if (!fs.existsSync(source)) {
    return false;
  }
  copyTree(source, path.join(frameworkTarget, name), projectMap);
  return true;
}

function initFramework(frameworkSource, frameworkTarget, projectMap) {
  if (!fs.existsSync(frameworkSource)) {
    throw new Error(`Missing framework directory: ${frameworkSource}`);
  }

  fs.mkdirSync(frameworkTarget, { recursive: true });

  const readmeSource = path.join(frameworkSource, "README.md");
  if (!fs.existsSync(readmeSource)) {
    throw new Error(`Missing framework README: ${readmeSource}`);
  }
  copyFileIfNeeded(readmeSource, path.join(frameworkTarget, "README.md"), projectMap);

  const copied = copyFrameworkTools(path.join(frameworkSource, "scripts"), frameworkTarget, projectMap);
  if (copyFrameworkDirectoryIfExists(frameworkSource, frameworkTarget, "automation", projectMap)) {
    copied.push("automation");
  }
  return copied;
}

function initProject(options) {
  const repoRoot = __dirname;
  const templateRoot = path.join(repoRoot, "templates");
  const frameworkSource = path.join(repoRoot, FRAMEWORK_DIR);
  const targetRoot = path.resolve(options.target);
  const frameworkRoot = path.join(targetRoot, FRAMEWORK_DIR);
  const groups = GROUP_ALIASES[options.group];

  fs.mkdirSync(targetRoot, { recursive: true });

  const projectMap = buildProjectMap(options.projectPrefix);
  const toolScripts = initFramework(frameworkSource, frameworkRoot, projectMap);
  writeProjectMap(frameworkRoot, options.projectPrefix);

  for (const group of groups) {
    copyTree(
      path.join(templateRoot, group),
      path.join(targetRoot, groupTargetName(group, options.projectPrefix)),
      projectMap
    );
  }

  const reqPath = groupTargetName("01_req", options.projectPrefix);
  const summary = [
    `Initialized ${FRAMEWORK_DIR} at: ${frameworkRoot}`,
    `Project guide: ${path.join(frameworkRoot, "README.md")}`,
    `Project path map: ${path.join(frameworkRoot, "project-map.yaml")}`,
    `Initialized groups ${groups.map((group) => groupTargetName(group, options.projectPrefix)).join(", ")} at: ${targetRoot}`,
  ];
  if (toolScripts.length > 0) {
    summary.push(`Initialized ${FRAMEWORK_DIR} tools: ${toolScripts.join(", ")}`);
  }
  summary.push(
    "",
    "Next steps:",
    `  1. Open ${FRAMEWORK_DIR}/README.md for the full onboarding guide`,
    `  2. Place raw materials in ${reqPath}/workspace/01_inputs/`,
    "  3. Use each group's playbook + workspace/ for stage deliverables",
    "",
    "  If using Cursor (optional):",
    `    npm --prefix ${path.join(FRAMEWORK_DIR, "cursor-script")} run sync:rule`,
    `    npm --prefix ${path.join(FRAMEWORK_DIR, "cursor-script")} run sync:skill`,
    "",
    "  Other IDEs: map playbook/**/rules and skills to your Agent config (see ai-kit-framework README)."
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
