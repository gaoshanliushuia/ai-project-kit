# Automation

本目录描述外部自动化 Agent 如何按 ai-project-kit 的阶段标准执行工作。它面向 HermesAgent、CI Agent、自研 Agent、LangGraph / Dify / Flowise / n8n 等编排工具。

自动化工具只负责 **编排、读取上下文、调用 Agent、写回产物**；阶段标准仍来自各组 `playbook/`，阶段产物仍必须沉淀到对应 `workspace/`。

## 目录结构

```text
automation/
├── README.md
├── pipelines/
│   └── requirement-to-code.yaml
├── scripts/
│   └── prepare-context.mjs
└── templates/
    ├── context-pack.md
    ├── run-log.md
    └── stage-gate.md
```

## 执行原则

1. 自动化流水线按阶段读取 `skills/SKILL.md`、`rules/RULE.md`、`agents/agent.md`。
2. 每个阶段只读取该阶段所需输入，避免一次性塞入整个项目。
3. 阶段输出必须写入对应 `workspace/`。
4. 自动化执行记录写入 `06_gov/workspace/01_governance/automation-runs/`。
5. 需求基线、架构评审、详细设计评审、编码验证和交付验收建议保留人工 gate。

流水线文件中的 `01_req`、`02_build` 等路径是模板逻辑路径。若目标项目通过 `--project-prefix` 初始化为 `qtgs01req`、`qtgs02build` 等目录，`prepare-context.mjs` 会读取 `ai-kit-framework/project-map.yaml` 并在生成上下文时解析为项目物理路径。

## 快速开始

生成某个功能某个阶段的上下文包：

```bash
node ai-kit-framework/automation/scripts/prepare-context.mjs \
  --pipeline ai-kit-framework/automation/pipelines/requirement-to-code.yaml \
  --stage req-baseline \
  --feature USER-MGMT \
  --out .tmp/automation/context/USER-MGMT/req-baseline/context-pack.md
```

生成的 `context-pack.md` 可交给 HermesAgent 等外部工具执行。Agent 执行完成后，应将结果写入流水线中声明的 `outputs`，并把执行日志写入 `06_gov/workspace/01_governance/automation-runs/`。

## 与 Cursor 的关系

Cursor 用户通常通过 `cursor-script/` 同步 rule 与 skill；外部自动化工具则直接读取 `automation/pipelines/` 与各阶段 `playbook/**/agents/agent.md`。两种方式共享同一套 playbook 正文。
