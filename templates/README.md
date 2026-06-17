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
├── 02_design/           详细设计（含 UI 设计与数据库设计）
├── 03_code/             代码实现与工程管理
└── 04_release/          版本发布与迭代
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
02_build/workspace/01_architecture/ … 04_release/
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
02_build/02_design/database        -> Architect Agent / Developer Agent / DBA Agent
02_build/03_code               -> Developer Agent
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

## 按阶段操作指南

下面这套说明面向 `Cursor`、`Trae`、`Windsurf` 等带 AI Agent 的开发工具。默认前提是：**本项目里的阶段 skill、rule、prompt 都已经在项目中，Agent 可以直接读取。**

实际使用时，重点不是告诉 Agent “skill 在哪里”，而是直接在对话框里说清楚三件事：

1. 用哪个阶段的 skill。
2. 参考哪些讨论文件、会议纪要、基线文档或设计文档。
3. 要它生成什么阶段产物。

### 通用句式

你可以直接在 Agent 对话框里输入下面这种句式：

```text
请使用【某阶段 skill】，参考【某些文件或目录】，生成【某个功能 / 某个模块 / 某份阶段文档】。
```

也可以再补一句，把输出要求说清楚：

```text
请按本项目该阶段的 skill、rule 和 prompt 执行，输出到对应 workspace，并区分已确认、假设、待确认。
```

### 需求分析阶段

适合输入的材料通常是访谈纪要、讨论记录、现状流程、原始业务说明，一般放在 `01_req/workspace/01_inputs/`。

你可以这样对 Agent 说：

```text
请使用 requirements-analysis skill，参考 @01_req/workspace/01_inputs/用户访谈记录.md，生成“用户管理”功能的需求分析初稿。
```

```text
请使用 requirements-analysis skill，参考 @01_req/workspace/01_inputs/产品讨论纪要.md 和 @01_req/workspace/01_inputs/现状流程说明.md，整理“审批流程”功能的需求分析、角色权限和验收条件。
```

```text
请使用 requirements-analysis skill，参考 @01_req/workspace/01_inputs，下沉出可以进入需求基线的正式需求项，并写入 `01_req/workspace/03_baseline/`。
```

### 架构设计阶段

适合参考的材料通常是需求基线、业务边界、外部系统约束，一般会引用 `01_req/workspace/03_baseline/` 下的结果。

你可以这样说：

```text
请使用 architecture-design skill，参考 @01_req/workspace/03_baseline/需求基线-v1.0.md，生成“用户管理”功能的架构设计初稿。
```

```text
请使用 architecture-design skill，参考 @01_req/workspace/03_baseline 和 @外部系统对接说明.md，输出“审批流程”模块的系统边界、模块划分和集成方案。
```

```text
请使用 architecture-design skill，基于 @01_req/workspace/03_baseline/订单模块需求.md，补齐该模块的非功能设计、风险和技术决策。
```

### 详细设计阶段

这个阶段更适合把某个功能、某个模块说得具体一些，例如接口、流程、状态、异常、界面 UI 和数据库设计。

你可以这样说：

```text
请使用 detailed-design skill，参考 @01_req/workspace/03_baseline/需求基线-v1.0.md 和 @02_build/workspace/01_architecture/architecture-design-v1.0.md，生成“用户管理”功能的详细设计。
```

```text
请使用 detailed-design skill，参考 @02_build/workspace/01_architecture/architecture-design-v1.0.md，输出“审批流程”模块的接口设计、状态流转和异常处理方案。
```

```text
请使用 detailed-design skill，参考 @01_req/workspace/03_baseline/订单需求.md，生成“订单提交”功能的模块设计、接口契约、界面 UI 说明和数据库设计，并把数据库产物输出到 @02_build/workspace/02_design/database。
```

### 详细设计中的数据库设计

数据库设计不再单独使用 `database-design skill`，统一通过 `detailed-design skill` 执行。数据库相关产物输出到 `02_build/workspace/02_design/database/`，并且必须包含 ER 实体关系图、字段字典、索引、脚本、初始化数据、回滚说明和数据质量规则。

你可以这样说：

```text
请使用 detailed-design skill，参考 @01_req/workspace/03_baseline/需求基线-v1.0.md 和 @02_build/workspace/02_design/modules/用户管理详细设计.md，生成“用户管理”功能的数据库设计，并输出到 @02_build/workspace/02_design/database。
```

```text
请使用 detailed-design skill，参考 @02_build/workspace/02_design/modules/审批流程详细设计.md，输出“审批流程”模块的数据表、字段字典、ER 实体关系图、索引约束、初始化数据、迁移脚本和回滚方案。数据库脚本不要创建物理外键。
```

```text
请使用 detailed-design skill，参考 @订单提交功能详细设计.md，整理该功能需要的实体关系、状态字段和迁移脚本计划，并用 ER 图箭头表达各表逻辑外键和关联关系。
```

### 编码实现阶段

这个阶段建议把“要实现哪个功能”说得非常具体，最好精确到模块。

你可以这样说：

```text
请使用 code-implementation skill，参考 @01_req/workspace/03_baseline/需求基线-v1.0.md、@02_build/workspace/01_architecture/architecture-design-v1.0.md、@02_build/workspace/02_design/modules/用户管理详细设计.md 和 @02_build/workspace/02_design/database/用户管理数据库设计.md，生成“用户管理”模块的开发任务拆分。
```

```text
请使用 code-implementation skill，参考 @02_build/workspace/02_design/modules/审批流程详细设计.md 和 @02_build/workspace/02_design/database/审批流程数据库设计.md，实现“审批流程”模块代码。
```

```text
请使用 code-implementation skill，参考 @某个模块详细设计.md，先只实现“订单提交”这一个功能，不要扩展到其他模块，并给出运行命令和测试命令。
```

### 测试阶段

这个阶段通常是参考需求、设计、代码变更或发布说明来生成测试方案、测试用例和测试记录。

你可以这样说：

```text
请使用 quality-assurance skill，参考 @01_req/workspace/03_baseline/需求基线-v1.0.md 和 @02_build/workspace/02_design/用户管理详细设计.md，生成“用户管理”功能的测试用例。
```

```text
请使用 quality-assurance skill，参考 @代码变更说明.md 和 @发布说明.md，输出“审批流程”模块的测试范围、回归重点和发布建议。
```

```text
请使用 quality-assurance skill，参考 @03_qa/workspace/01_testing/现有测试记录.md，补充“订单提交”功能的缺陷清单和复测建议。
```

### 变更阶段

当需求、设计、代码或发布发生正式变化时，可以直接让 Agent 生成变更分析。

你可以这样说：

```text
请使用 change-management skill，参考 @客户新增需求讨论记录.md 和 @01_req/workspace/03_baseline/需求基线-v1.0.md，生成“用户管理”功能的变更分析。
```

```text
请使用 change-management skill，参考 @缺陷单.md、@详细设计.md 和 @测试报告.md，输出“审批流程”模块的 CR 变更登记、影响分析和关闭条件。
```

### 发布阶段

发布阶段更适合引用构建产物、测试结论、变更记录和部署说明。

你可以这样说：

```text
请使用 release-management skill，参考 @测试报告.md、@变更记录.md 和 @部署说明.md，生成本次版本的发布计划和回滚说明。
```

```text
请使用 release-management skill，参考 @02_build/workspace/04_release/，整理“用户管理”和“审批流程”两个模块的上线检查清单和发布验证记录。
```

### 交付验收阶段

这个阶段通常是围绕交付包、用户手册、培训材料和运维资料来组织输出。

你可以这样说：

```text
请使用 delivery-acceptance skill，参考 @最终版本说明.md、@测试报告.md 和 @运维交接资料.md，生成本次项目交付清单和验收材料。
```

```text
请使用 delivery-acceptance skill，参考 @05_delivery/workspace/01_delivery/，整理用户手册、培训材料、验收记录和遗留问题清单。
```

### AI 治理阶段

凡是你使用 AI 参与了需求、设计、代码、测试、发布、交付，都可以补一条治理记录。

你可以这样说：

```text
请使用 ai-governance skill，参考 @本次对话使用的提示词.md 和 @输出结果.md，生成本次“用户管理”功能的 AI 治理记录。
```

```text
请使用 ai-governance skill，参考 @06_gov/workspace/01_governance/ 和 @人工确认记录.md，补齐本次版本的 Prompt 审查、安全检查和输出验收记录。
```

### 一条简单经验

如果 Agent 回答得太泛，没有真正按阶段执行，可以直接补一句：

```text
请不要泛化总结，请严格使用本项目当前阶段对应的 skill，参考我给出的文件，直接生成该阶段产物。
```

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

