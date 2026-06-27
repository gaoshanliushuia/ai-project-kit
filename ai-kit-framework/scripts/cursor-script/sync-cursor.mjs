#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_CONFIG_PATH = join(__dirname, "sync-cursor.config.json");

function hasWorkgroupDirs(dir) {
  return existsSync(join(dir, "01_req")) || existsSync(join(dir, "02_build"));
}

/** 推断项目根：playbook 与 .cursor 产物均相对此目录 */
function resolveDefaultRoot(scriptDir) {
  if (process.env.AI_PROJECT_ROOT) {
    return resolve(process.env.AI_PROJECT_ROOT);
  }

  let dir = resolve(scriptDir);
  for (let depth = 0; depth < 6; depth++) {
    if (hasWorkgroupDirs(dir)) {
      return dir;
    }
    const parent = resolve(dir, "..");
    if (parent === dir) {
      break;
    }
    dir = parent;
  }

  return resolve(scriptDir, "..");
}

const DEFAULT_ROOT = resolveDefaultRoot(__dirname);

const ONLY_VALUES = new Set(["rules", "skills"]);

function parseArgs(argv) {
  const result = {
    only: null,
    ids: [],
    dryRun: false,
    force: false,
    checkClean: false,
    configPath: DEFAULT_CONFIG_PATH,
    root: DEFAULT_ROOT,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--config") {
      const value = argv[++i];
      if (!value) {
        throw new Error("--config 需要配置文件路径");
      }
      result.configPath = resolve(value);
      continue;
    }
    if (arg === "--root") {
      const value = argv[++i];
      if (!value) {
        throw new Error("--root 需要项目根目录路径");
      }
      result.root = resolve(value);
      continue;
    }
    if (arg === "--only") {
      const value = argv[++i];
      if (!value || !ONLY_VALUES.has(value)) {
        throw new Error(`--only 必须为 rules 或 skills，收到: ${value ?? "(空)"}`);
      }
      result.only = value;
      continue;
    }
    if (arg === "--dry-run") {
      result.dryRun = true;
      continue;
    }
    if (arg === "--force") {
      result.force = true;
      continue;
    }
    if (arg === "--check-clean") {
      result.checkClean = true;
      continue;
    }
    if (arg.startsWith("-")) {
      throw new Error(`未知参数: ${arg}`);
    }
    result.ids.push(arg);
  }

  if (!result.only) {
    throw new Error("必须指定 --only rules 或 --only skills");
  }

  return result;
}

function loadConfig(configPath) {
  if (!existsSync(configPath)) {
    throw new Error(`找不到配置文件: ${configPath}`);
  }
  return JSON.parse(readFileSync(configPath, "utf8"));
}

function hashContent(content) {
  return createHash("sha256").update(content, "utf8").digest("hex");
}

function stripFrontmatter(content) {
  if (!content.startsWith("---\n")) {
    return content;
  }
  const end = content.indexOf("\n---\n", 4);
  if (end === -1) {
    return content;
  }
  return content.slice(end + 5);
}

function stripRuleBoilerplate(body) {
  const lines = body.replace(/^\uFEFF/, "").split("\n");
  const idx = lines.findIndex((line) => line.includes("本目录保存"));
  if (idx === -1) {
    return lines.join("\n").trimStart();
  }
  let removeFrom = idx;
  if (removeFrom > 0 && lines[removeFrom - 1] === "") {
    removeFrom -= 1;
  }
  let removeTo = idx + 1;
  while (removeTo < lines.length && lines[removeTo] === "") {
    removeTo += 1;
  }
  lines.splice(removeFrom, removeTo - removeFrom);
  return lines.join("\n").trimStart();
}

function buildRuleContent(entry, body) {
  const globs = entry.globs.join(", ");
  return [
    "---",
    `description: ${entry.description}`,
    `alwaysApply: ${String(entry.alwaysApply)}`,
    `globs: ${globs}`,
    "---",
    "",
    body.trimEnd(),
    "",
  ].join("\n");
}

function buildSkillUsageSection(entry) {
  return [
    "## 使用要求",
    "",
    `- 本阶段治理约束见 \`.cursor/rules/${entry.governanceRule}.mdc\`；正式文档源见 \`${entry.ruleSource}\`。`,
    "- 所有结论必须能追踪到输入材料、编号、负责人或评审记录。",
    "- AI 生成内容只作为初稿或检查建议，关键结论必须由阶段负责人确认。",
    `- 发现可复用经验时，应回写 \`${entry.playbookBase}/\` 下 \`rules/\`、\`skills/\` 或 \`agents/\`，并在后续版本发布中说明。`,
    "",
  ].join("\n");
}

function buildSkillBody(entry, rawSource) {
  let body = stripFrontmatter(rawSource).trimStart();
  const usageIdx = body.indexOf("## 使用要求");
  if (usageIdx >= 0) {
    body = body.slice(0, usageIdx).trimEnd();
  } else {
    body = body.trimEnd();
  }
  return `${body}\n\n${buildSkillUsageSection(entry)}`;
}

function formatSkillFrontmatter(entry) {
  const desc = entry.description.trim();
  const useFolded = desc.length > 100;
  if (useFolded) {
    return [
      "---",
      `name: ${entry.name}`,
      "description: >-",
      `  ${desc}`,
      "---",
      "",
    ].join("\n");
  }
  return ["---", `name: ${entry.name}`, `description: ${desc}`, "---", ""].join("\n");
}

function buildSkillContent(entry, rawSource) {
  return formatSkillFrontmatter(entry) + buildSkillBody(entry, rawSource);
}

function filterEntries(entries, ids, label) {
  if (ids.length === 0) {
    return entries;
  }
  const known = new Set(entries.map((entry) => entry.id));
  const unknown = ids.filter((id) => !known.has(id));
  if (unknown.length > 0) {
    const available = entries.map((entry) => entry.id).join(", ");
    throw new Error(
      `未知的 ${label} id: ${unknown.join(", ")}\n可用 id: ${available}`
    );
  }
  return entries.filter((entry) => ids.includes(entry.id));
}

function readSource(root, relativePath) {
  const absolutePath = join(root, relativePath);
  if (!existsSync(absolutePath)) {
    throw new Error(`源文件不存在: ${relativePath}`);
  }
  return readFileSync(absolutePath, "utf8");
}

function writeTarget(root, relativePath, content, { dryRun, force, checkClean }) {
  const absolutePath = join(root, relativePath);
  const nextHash = hashContent(content);
  let status = "created";
  let prevHash = null;

  if (existsSync(absolutePath)) {
    prevHash = hashContent(readFileSync(absolutePath, "utf8"));
    status = prevHash === nextHash ? "unchanged" : "updated";
  }

  if (status === "unchanged" && !force) {
    return status;
  }

  if (checkClean && status !== "unchanged") {
    return "drift";
  }

  if (dryRun) {
    return status === "unchanged" && force ? "updated" : status;
  }

  mkdirSync(dirname(absolutePath), { recursive: true });
  writeFileSync(absolutePath, content, "utf8");
  return status === "unchanged" && force ? "updated" : status;
}

function syncRules(config, options) {
  const entries = filterEntries(config.rules ?? [], options.ids, "rule");
  const summary = { created: 0, updated: 0, unchanged: 0, drift: 0, errors: [] };

  for (const entry of entries) {
    try {
      const raw = readSource(options.root, entry.source);
      const body = stripRuleBoilerplate(stripFrontmatter(raw));
      const content = buildRuleContent(entry, body);
      const status = writeTarget(options.root, entry.target, content, options);
      summary[status === "drift" ? "drift" : status] += 1;
      logResult("rule", entry.id, entry.target, status, options.dryRun);
    } catch (error) {
      summary.errors.push({ id: entry.id, message: error.message });
      console.error(`[ERROR] rule ${entry.id}: ${error.message}`);
    }
  }

  return summary;
}

function syncSkills(config, options) {
  const entries = filterEntries(config.skills ?? [], options.ids, "skill");
  const summary = { created: 0, updated: 0, unchanged: 0, drift: 0, errors: [] };

  for (const entry of entries) {
    try {
      validateSkillEntry(entry);
      const raw = readSource(options.root, entry.source);
      const content = buildSkillContent(entry, raw);
      const status = writeTarget(options.root, entry.target, content, options);
      summary[status === "drift" ? "drift" : status] += 1;
      logResult("skill", entry.id, entry.target, status, options.dryRun);
    } catch (error) {
      summary.errors.push({ id: entry.id, message: error.message });
      console.error(`[ERROR] skill ${entry.id}: ${error.message}`);
    }
  }

  return summary;
}

function validateSkillEntry(entry) {
  for (const key of [
    "name",
    "description",
    "governanceRule",
    "ruleSource",
    "playbookBase",
  ]) {
    if (!entry[key]) {
      throw new Error(`skill 配置缺少字段: ${key}`);
    }
  }
}

function logResult(kind, id, target, status, dryRun) {
  const prefix = dryRun ? "[DRY-RUN]" : "[SYNC]";
  console.log(`${prefix} ${kind} ${id} -> ${target} (${status})`);
}

function printSummary(kind, summary, options) {
  console.log("");
  console.log(
    `${kind} 完成: created=${summary.created}, updated=${summary.updated}, unchanged=${summary.unchanged}`
  );
  if (options.checkClean) {
    console.log(`drift=${summary.drift}`);
  }
  if (summary.errors.length > 0) {
    console.log(`errors=${summary.errors.length}`);
  }
}

function validateConfigSources(config, root) {
  const missing = [];

  for (const entry of config.rules ?? []) {
    if (!existsSync(join(root, entry.source))) {
      missing.push(`rule ${entry.id}: ${entry.source}`);
    }
  }

  for (const entry of config.skills ?? []) {
    if (!existsSync(join(root, entry.source))) {
      missing.push(`skill ${entry.id}: ${entry.source}`);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `配置中的源文件不存在（项目根: ${root}）:\n${missing.map((item) => `- ${item}`).join("\n")}`
    );
  }
}

function main() {
  let options;
  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    console.error("");
    console.error("用法:");
    console.error("  node sync-cursor.mjs --only rules [id...] [--dry-run] [--force]");
    console.error("  node sync-cursor.mjs --only skills [id...] [--dry-run] [--force]");
    process.exit(1);
  }

  const config = loadConfig(options.configPath);

  try {
    validateConfigSources(config, options.root);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }

  let summary;
  try {
    summary =
      options.only === "rules"
        ? syncRules(config, options)
        : syncSkills(config, options);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }

  printSummary(options.only, summary, options);

  if (options.checkClean && summary.drift > 0) {
    console.error("检测到 .cursor 产物与 playbook/config 不一致，请先执行 sync。");
    process.exit(2);
  }
  if (summary.errors.length > 0) {
    process.exit(1);
  }
}

main();
