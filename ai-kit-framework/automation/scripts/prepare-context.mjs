#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

function usage() {
  return `prepare-context

Usage:
  node prepare-context.mjs --pipeline <yaml> --stage <id> --feature <id> [--out <file>]

Example:
  node ai-kit-framework/automation/scripts/prepare-context.mjs \\
    --pipeline ai-kit-framework/automation/pipelines/requirement-to-code.yaml \\
    --stage req-baseline \\
    --feature USER-MGMT
`;
}

function parseArgs(argv) {
  const result = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      result.help = true;
      continue;
    }
    if (!arg.startsWith("--")) {
      throw new Error(`Unknown argument: ${arg}`);
    }
    const key = arg.slice(2);
    const value = argv[++i];
    if (!value) {
      throw new Error(`Missing value for ${arg}`);
    }
    result[key] = value;
  }
  return result;
}

function parseList(lines, startIndex) {
  const values = [];
  for (let i = startIndex; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line.startsWith("      - ")) {
      break;
    }
    values.push(line.slice("      - ".length).trim());
  }
  return values;
}

function parsePipeline(content) {
  const lines = content.split(/\r?\n/);
  const pipeline = { stages: [] };
  let current = null;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.startsWith("pipeline: ")) {
      pipeline.pipeline = line.slice("pipeline: ".length).trim();
      continue;
    }
    if (line.startsWith("description: ")) {
      pipeline.description = line.slice("description: ".length).trim();
      continue;
    }
    if (line.startsWith("  - id: ")) {
      current = { id: line.slice("  - id: ".length).trim(), inputs: [], outputs: [] };
      pipeline.stages.push(current);
      continue;
    }
    if (!current) {
      continue;
    }
    const trimmed = line.trim();
    for (const key of ["name", "skill", "rule", "agent", "gate"]) {
      if (trimmed.startsWith(`${key}: `)) {
        current[key] = trimmed.slice(`${key}: `.length).trim();
      }
    }
    if (trimmed === "inputs:") {
      current.inputs = parseList(lines, i + 1);
    }
    if (trimmed === "outputs:") {
      current.outputs = parseList(lines, i + 1);
    }
  }

  return pipeline;
}

function parseProjectMap(content) {
  const map = { groups: {} };
  let inGroups = false;
  let currentGroup = null;

  for (const line of content.split(/\r?\n/)) {
    if (line.trim() === "groups:") {
      inGroups = true;
      currentGroup = null;
      continue;
    }
    if (!inGroups) {
      continue;
    }

    const groupMatch = line.match(/^  ([A-Za-z0-9_-]+):\s*$/);
    if (groupMatch) {
      currentGroup = groupMatch[1];
      map.groups[currentGroup] = {};
      continue;
    }

    const valueMatch = line.match(/^    (template|path):\s*(.+?)\s*$/);
    if (currentGroup && valueMatch) {
      map.groups[currentGroup][valueMatch[1]] = valueMatch[2];
    }
  }

  return map;
}

function findProjectRoot(start) {
  let current = resolve(start);
  for (let depth = 0; depth < 8; depth += 1) {
    if (existsSync(join(current, "ai-kit-framework", "project-map.yaml"))) {
      return current;
    }
    const parent = resolve(current, "..");
    if (parent === current) {
      break;
    }
    current = parent;
  }
  return resolve(".");
}

function loadProjectMap(projectRoot) {
  const mapPath = join(projectRoot, "ai-kit-framework", "project-map.yaml");
  if (!existsSync(mapPath)) {
    return null;
  }
  return parseProjectMap(readFileSync(mapPath, "utf8"));
}

function projectMappings(projectMap) {
  if (!projectMap) {
    return [];
  }
  return Object.values(projectMap.groups ?? {}).filter(
    (entry) => entry.template && entry.path && entry.template !== entry.path
  );
}

function mapProjectReferences(value, projectMap) {
  if (typeof value !== "string") {
    return value;
  }

  let next = value;
  for (const entry of projectMappings(projectMap)) {
    const pattern = new RegExp(
      `(^|[^A-Za-z0-9_])${entry.template.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?=/|\\\\|\\*\\*|\\b)`,
      "g"
    );
    next = next.replace(pattern, `$1${entry.path}`);
  }
  return next;
}

function mapStagePaths(stage, projectMap) {
  return {
    ...stage,
    skill: mapProjectReferences(stage.skill, projectMap),
    rule: mapProjectReferences(stage.rule, projectMap),
    agent: mapProjectReferences(stage.agent, projectMap),
    inputs: stage.inputs.map((item) => mapProjectReferences(item, projectMap)),
    outputs: stage.outputs.map((item) => mapProjectReferences(item, projectMap)),
  };
}

function readIfExists(path) {
  if (!existsSync(path)) {
    return `<!-- Missing file: ${path} -->`;
  }
  return readFileSync(path, "utf8").trimEnd();
}

function formatList(paths) {
  if (!paths || paths.length === 0) {
    return "- (none)";
  }
  return paths.map((item) => `- \`${item}\``).join("\n");
}

function buildContext({ pipeline, stage, feature, projectRoot, governanceRunsPath }) {
  const now = new Date().toISOString();
  if (!stage.agent) {
    throw new Error(`Stage ${stage.id} missing agent path`);
  }
  return `# Context Pack

| 项 | 内容 |
|----|------|
| Pipeline | ${pipeline.pipeline ?? ""} |
| Feature ID | ${feature} |
| Stage ID | ${stage.id} |
| Stage Name | ${stage.name ?? ""} |
| Generated At | ${now} |

## Stage Playbook

- Skill: \`${stage.skill}\`
- Rule: \`${stage.rule}\`
- Agent: \`${stage.agent}\`

## Inputs

${formatList(stage.inputs)}

## Expected Outputs

${formatList(stage.outputs)}

## Gate

- ${stage.gate ?? "none"}

## Execution Instruction

请按本阶段 \`skills/SKILL.md\`、\`rules/RULE.md\` 与 \`agents/agent.md\` 执行。若输入材料不足，先输出缺口、假设、待确认事项和影响范围，不得编造业务事实或实现细节。

执行结果必须写入 Expected Outputs 声明的位置。自动化执行过程需记录到 \`${governanceRunsPath}\`。

---

## Skill

\`\`\`markdown
${readIfExists(join(projectRoot, stage.skill))}
\`\`\`

## Rule

\`\`\`markdown
${readIfExists(join(projectRoot, stage.rule))}
\`\`\`

## Agent

\`\`\`markdown
${readIfExists(join(projectRoot, stage.agent))}
\`\`\`
`;
}

function main() {
  let args;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    console.error("");
    console.error(usage());
    process.exit(1);
  }

  if (args.help) {
    process.stdout.write(usage());
    return;
  }

  if (!args.pipeline || !args.stage || !args.feature) {
    console.error("Missing required arguments.");
    console.error("");
    console.error(usage());
    process.exit(1);
  }

  const pipelinePath = resolve(args.pipeline);
  const projectRoot = findProjectRoot(dirname(pipelinePath));
  const projectMap = loadProjectMap(projectRoot);
  const governanceRunsPath = mapProjectReferences(
    "06_gov/workspace/01_governance/automation-runs/",
    projectMap
  );
  const pipeline = parsePipeline(readFileSync(pipelinePath, "utf8"));
  const stage = pipeline.stages.find((item) => item.id === args.stage);
  if (!stage) {
    const ids = pipeline.stages.map((item) => item.id).join(", ");
    throw new Error(`Unknown stage: ${args.stage}. Available: ${ids}`);
  }
  const resolvedStage = mapStagePaths(stage, projectMap);

  const out = resolve(
    args.out ?? `.tmp/automation/context/${args.feature}/${args.stage}/context-pack.md`
  );
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(
    out,
    buildContext({
      pipeline,
      stage: resolvedStage,
      feature: args.feature,
      projectRoot,
      governanceRunsPath,
    }),
    "utf8"
  );
  console.log(`Context pack written: ${out}`);
}

main();
