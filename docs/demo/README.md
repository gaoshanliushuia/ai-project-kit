# 项目说明

Version: v0.1.0

这是通过 ai-project-kit 初始化后的项目入口说明。

## 项目作用

- 将 ai-project-kit 定位为 AI Project Framework（AI 辅助研发框架），而不是 Prompt 集合。
- 按五大工作组划分协作边界：需求、实施、测试变更、交付、AI 治理。
- 帮助各角色在独立目录中并行工作，并通过阶段目录内的基线、回传、交付和治理记录完成交接与留痕。
- 交付组独立管理面向用户验收的资产；AI 治理统一沉淀在 `06_gov`。

## 六大工作组

项目资产按职责拆分为六个编号目录，**业务组内阶段从 `01` 重新编号**：

```text
项目根目录/
├── 01_req/        需求组
├── 02_build/      实施组（架构 + 设计 + 数据库 + 编码 + 发布）
├── 03_qa/         测试与质量保证组
├── 04_change/     变更管理组（需求 / 设计 / 技术选型 / 配置 / 发布变更）
├── 05_delivery/   交付组（验收 + 资料移交 + 用户手册 + 运维交接）
└── 06_gov/        AI 治理组
```

每个工作组通常包含：

- `playbook/` — 本组阶段标准
- `workspace/` — 本组执行与沉淀区

## 组内阶段

### 01_req（需求组）

```text
playbook/
└── 01_requirements/     需求收集与需求分析标准

workspace/
├── 01_inputs/           原始会议、调研、访谈和业务材料
├── 02_prototypes/       原型、页面流转和交互说明
└── 03_baseline/         已签发需求基线和实施交接材料
```

### 02_build（实施组）

```text
playbook/ & workspace/
├── 01_architecture/     系统架构设计
├── 02_design/           详细设计
├── 03_database/         数据库设计
├── 04_codebase/         代码实现与工程管理
└── 05_release/          版本发布与迭代
```

### 03_qa（测试与质量保证组）

```text
playbook/ & workspace/
└── 01_testing/          测试与质量保证
```

### 04_change（变更管理组）

```text
playbook/
└── 01_change/           变更与配置管理

workspace/
└── （扁平记录变更触发源、概述、影响和处理结论）
```

### 05_delivery（交付组）

```text
playbook/ & workspace/
└── 01_delivery/         项目交付与验收
```

交付组保存用户验收时需要接收和签收的资产，包括源代码、构建产物、部署包、用户手册、培训材料、验收记录、运维资料和交付总结。

### 06_gov（AI 治理组）

```text
playbook/ & workspace/
└── 01_governance/       AI 使用治理与质量约束
```

## 组间协作

```text
01_req/workspace/
        │
        ▼
02_build/workspace/01_architecture/ … 05_release/
        │
        ▼
03_qa/workspace/01_testing/  ──►  04_change/workspace/
        │
        ▼
05_delivery/workspace/01_delivery/
        │
        ▼
06_gov/workspace/01_governance/（AI 治理留痕）
```

- **需求组**：基线签发后写入 `workspace/03_baseline/`，原始输入和原型分别保存在 `workspace/01_inputs/`、`workspace/02_prototypes/`。
- **实施组**：在对应阶段目录内记录需求基线来源，完成架构、设计、代码和发布。
- **测试组**：输出测试结论、缺陷与发布建议。
- **变更组**：统一登记需求、设计、技术选型、配置、发布和交付相关正式变更。
- **交付组**：面向用户验收沉淀交付包、手册、培训、验收和运维资料。
- **治理组**：各组凡使用 AI 的关键活动，在 `06_gov` 登记。

跨组追踪使用业务编号（`REQ`、`CR`、`DEF`），目录编号只在组内有效。

## Agent Role 体系

```text
01_req/workspace/01_inputs         -> Business Analyst Agent
01_req/workspace/02_prototypes     -> Business Analyst Agent
01_req/workspace/03_baseline       -> Business Analyst Agent
02_build/01_architecture           -> Architect Agent
02_build/03_database               -> DBA Agent
02_build/04_codebase               -> Developer Agent
03_qa/01_testing                   -> Tester Agent
04_change/01_change                -> Change Manager Agent / Release Manager Agent
05_delivery/01_delivery            -> Release Manager / Delivery Agent
06_gov/01_governance               -> 全角色共同参与
```

## 使用建议

1. 阅读本文件，确认五大组职责与交接关系。
2. 进入对应组目录，阅读组内 `README.md`。
3. 再读该组 `playbook/README.md`，以及各阶段 `playbook/**/rules/RULE.md` 与 `.cursor/rules/*.mdc`。
4. 使用 AI 时同步维护 `06_gov/workspace/01_governance/` 留痕。

## 初始化具体项目建议

将本模板用于具体项目时，建议按六个大阶段分别创建 Git 仓库，避免需求、实施、测试、变更、交付、AI 治理的工作内容相互干扰。仓库名称建议使用“项目名 + 阶段编号”的方式，例如：

```text
xxx项目_01_req
xxx项目_02_build
xxx项目_03_qa
xxx项目_04_change
xxx项目_05_delivery
xxx项目_06_gov
```

本地目录建议统一放在一个工作目录下，便于 AI IDE 集中管理。例如：

```text
AI工作/
├── xxx项目_01_req/
├── xxx项目_02_build/
├── xxx项目_03_qa/
├── xxx项目_04_change/
├── xxx项目_05_delivery/
└── xxx项目_06_gov/
```

初始化流程建议：

1. 先创建本地总工作目录，例如 `AI工作/`。
2. 在该目录下分别创建五个阶段仓库目录。
3. 每个阶段目录独立执行 `git init` 或绑定独立远程仓库。
4. 按阶段复制对应的 `01_req`、`02_build`、`03_qa`、`04_change`、`05_delivery`、`06_gov` 模板内容。
5. 通过阶段目录内的基线、引用记录、回传记录、交付清单和治理留痕传递阶段成果，不直接混写其他阶段仓库。

## 版本说明

- v0.1.0: 初始公开版。
## Demo 案例说明

本目录是 **中学教务管理系统** 完整案例，结构与 `ai-project-kit` 初始化结果一致（六大工作组）。

- 需求组 workspace 采用 `01_inputs` / `02_prototypes` / `03_baseline` 扁平结构。
- 变更记录位于 `04_change/workspace/`，不再放在 `03_qa` 内。
- 实施指导见仓库 `docs/README.md`。
