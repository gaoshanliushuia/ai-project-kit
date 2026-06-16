#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const REPO_ROOT = path.resolve(__dirname, "..");
const DEMO_ROOT = path.join(REPO_ROOT, "docs", "demo");
const BACKUP_ROOT = path.join(REPO_ROOT, ".tmp", "demo-workspace-backup");

const COPY_MAPPINGS = [
  {
    from: "01_req/workspace/01_requirements/01_inputs",
    to: "01_req/workspace/01_inputs",
  },
  {
    from: "01_req/workspace/01_requirements/02_analysis",
    to: "01_req/workspace/01_inputs",
  },
  {
    from: "01_req/workspace/01_requirements/03_prototypes",
    to: "01_req/workspace/02_prototypes",
  },
  {
    from: "01_req/workspace/01_requirements/04_requirements",
    to: "01_req/workspace/03_baseline",
  },
  {
    from: "01_req/workspace/01_requirements/05_traceability",
    to: "01_req/workspace/03_baseline",
  },
  {
    from: "01_req/workspace/01_requirements/06_reviews",
    to: "01_req/workspace/03_baseline",
  },
  {
    from: "01_req/workspace/01_requirements/07_baseline",
    to: "01_req/workspace/03_baseline",
  },
  {
    from: "02_build/workspace",
    to: "02_build/workspace",
  },
  {
    from: "03_qa/workspace/01_testing",
    to: "03_qa/workspace/01_testing",
  },
  {
    from: "03_qa/workspace/02_changes",
    to: "04_change/workspace",
  },
  {
    from: "04_delivery/workspace",
    to: "05_delivery/workspace",
  },
  {
    from: "05_gov/workspace",
    to: "06_gov/workspace",
  },
];

function rimraf(target) {
  if (!fs.existsSync(target)) {
    return;
  }
  fs.rmSync(target, { recursive: true, force: true });
}

function copyTree(source, target) {
  if (!fs.existsSync(source)) {
    return;
  }
  fs.mkdirSync(target, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const src = path.join(source, entry.name);
    const dst = path.join(target, entry.name);
    if (entry.isDirectory()) {
      copyTree(src, dst);
    } else if (entry.isFile()) {
      fs.mkdirSync(path.dirname(dst), { recursive: true });
      fs.copyFileSync(src, dst);
    }
  }
}

function backupWorkspace() {
  rimraf(BACKUP_ROOT);
  fs.mkdirSync(BACKUP_ROOT, { recursive: true });
  for (const mapping of COPY_MAPPINGS) {
    const source = path.join(DEMO_ROOT, mapping.from);
    const backup = path.join(BACKUP_ROOT, mapping.from);
    copyTree(source, backup);
  }
  console.log(`Backed up demo workspace to ${BACKUP_ROOT}`);
}

function removeDemo() {
  rimraf(DEMO_ROOT);
  fs.mkdirSync(path.dirname(DEMO_ROOT), { recursive: true });
  console.log(`Removed ${DEMO_ROOT}`);
}

function initDemo() {
  execSync("node ai-project-kit.js docs/demo all", {
    cwd: REPO_ROOT,
    stdio: "inherit",
  });
}

function restoreWorkspace() {
  const clearTargets = [
    "01_req/workspace",
    "02_build/workspace",
    "03_qa/workspace/01_testing",
    "04_change/workspace",
    "05_delivery/workspace",
    "06_gov/workspace",
  ];
  for (const relative of clearTargets) {
    rimraf(path.join(DEMO_ROOT, relative));
  }

  for (const mapping of COPY_MAPPINGS) {
    const source = path.join(BACKUP_ROOT, mapping.from);
    const target = path.join(DEMO_ROOT, mapping.to);
    copyTree(source, target);
  }
  console.log("Restored demo case workspace content");
}

function patchDemoReadme() {
  const readmePath = path.join(DEMO_ROOT, "README.md");
  if (!fs.existsSync(readmePath)) {
    return;
  }
  let content = fs.readFileSync(readmePath, "utf8");
  const demoNote = [
    "",
    "## Demo 案例说明",
    "",
    "本目录是 **中学教务管理系统** 完整案例，结构与 `ai-project-kit` 初始化结果一致（六大工作组）。",
    "",
    "- 需求组 workspace 采用 `01_inputs` / `02_prototypes` / `03_baseline` 扁平结构。",
    "- 变更记录位于 `04_change/workspace/`，不再放在 `03_qa` 内。",
    "- 实施指导见仓库 `docs/README.md`。",
    "",
  ].join("\n");
  if (!content.includes("## Demo 案例说明")) {
    content = content.trimEnd() + demoNote;
    fs.writeFileSync(readmePath, content, "utf8");
  }
}

function patchPathReferences() {
  const replacements = [
    ["01_req/workspace/01_requirements/07_baseline/", "01_req/workspace/03_baseline/"],
    ["01_req/workspace/01_requirements/05_traceability/", "01_req/workspace/03_baseline/"],
    ["01_req/workspace/01_requirements/04_requirements/", "01_req/workspace/03_baseline/"],
    ["01_req/workspace/01_requirements/03_prototypes/", "01_req/workspace/02_prototypes/"],
    ["01_req/workspace/07_baseline/", "01_req/workspace/03_baseline/"],
    ["01_req/workspace/05_traceability/", "01_req/workspace/03_baseline/"],
    ["01_req/workspace/04_requirements/", "01_req/workspace/03_baseline/"],
    ["01_req/workspace/03_prototypes/", "01_req/workspace/02_prototypes/"],
    ["03_qa/workspace/02_changes/", "04_change/workspace/"],
    ["04_delivery/", "05_delivery/"],
    ["05_gov/", "06_gov/"],
    [
      "docs/demo/01_req/workspace/01_requirements/03_prototypes/prototype-app",
      "docs/demo/01_req/workspace/02_prototypes/prototype-app",
    ],
    ["| 需求规格说明书 | `04_requirements/requirements-spec-v1.0.md` |", "| 需求规格说明书 | `requirements-spec-v1.0.md` |"],
    ["| 页面原型说明 | `03_prototypes/prototype-notes-v1.0.md` |", "| 页面原型说明 | `../02_prototypes/prototype-notes-v1.0.md` |"],
    ["| 需求追踪矩阵 | `05_traceability/requirements-traceability-v1.0.md` |", "| 需求追踪矩阵 | `requirements-traceability-v1.0.md` |"],
    ["| 需求评审记录 | `06_reviews/requirements-review-v1.0.md` |", "| 需求评审记录 | `requirements-review-v1.0.md` |"],
    ["01_req/workspace/03_prototypes/prototype-app", "01_req/workspace/02_prototypes/prototype-app"],
  ];

  function walk(dir) {
    if (!fs.existsSync(dir)) {
      return;
    }
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (!/\.(md|json|mjs|js|html|ps1|sh)$/i.test(entry.name)) {
        continue;
      }
      let text = fs.readFileSync(full, "utf8");
      let changed = false;
      for (const [from, to] of replacements) {
        if (text.includes(from)) {
          text = text.split(from).join(to);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(full, text, "utf8");
      }
    }
  }

  walk(DEMO_ROOT);
  console.log("Patched path references in demo files");
}

function main() {
  const patchOnly = process.argv.includes("--patch-only");

  if (patchOnly) {
    patchPathReferences();
    return;
  }

  if (!fs.existsSync(DEMO_ROOT)) {
    console.log("No existing demo; initializing fresh");
    initDemo();
    patchDemoReadme();
    return;
  }

  backupWorkspace();
  removeDemo();
  initDemo();
  restoreWorkspace();
  patchDemoReadme();
  patchPathReferences();
  rimraf(BACKUP_ROOT);
  console.log("Demo regeneration complete.");
}

main();
