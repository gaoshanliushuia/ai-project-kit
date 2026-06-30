# 项目说明

Version: v0.1.0

本文档是本项目的框架使用说明，帮助团队理解 **通用目录结构**、六大工作组分工，以及如何在 AI 开发工具中按阶段推进工作。

**与开发工具的关系：** 框架核心是 `playbook/`（阶段标准）与 `workspace/`（阶段产物），与具体 IDE 无关。本仓库附带 **Cursor 示例**：`ai-kit-framework/cursor-script/` 将 playbook 同步到 `.cursor/rules` 与 `.cursor/skills`。若你使用 Trae、Windsurf 或其他 Agent IDE，只需用同样方式把 playbook 正文接入该工具的配置目录即可，**不必使用 `.cursor/` 或 cursor-script**。

## 项目作用

- 将 ai-project-kit 定位为 AI Project Framework（AI 辅助研发框架），而不是 Agent 集合。
- 按六大工作组划分协作边界：需求、实施、测试、变更、交付、AI 治理。
- 帮助各角色在独立目录中并行工作，并通过阶段目录内的基线、回传、交付和治理记录完成交接与留痕。
- 交付组独立管理面向用户验收的资产；AI 治理统一沉淀在 `06_gov`。

### 为什么需要目录，而不仅是多轮对话

| 痛点 | 框架做法 |
|------|----------|
| 换会话就要重讲背景 | 结论写入 `workspace/`，对话时引用路径与 skill |
| 材料散、定稿找不到 | 组内固定目录（inputs / baseline / 各阶段 workspace） |
| 阶段产出留不下来 | playbook 规定产出，`workspace/` 可 Git 版本化 |
| 多人各用各的 Agent | 共用 playbook；基线、变更、交付清单作交接 |
| AI 结果难当正式依据 | 基线签发 + 变更登记 + 治理留痕 |

## ai-kit-framework（公共区）

```text
project-root/
├── ai-kit-framework/     框架说明与工具（含 Cursor 同步示例、自动化编排示例）
├── 01_req/        需求组
├── 02_build/      实施组（架构 + 设计 + 代码实现 + 发布）
├── 03_qa/         测试与质量保证组
├── 04_change/     变更管理组（需求 / 设计 / 技术选型 / 配置 / 发布变更）
├── 05_delivery/   交付组（验收 + 资料移交 + 用户手册 + 运维交接）
└── 06_gov/        AI 治理组
```

如果项目初始化时使用了项目前缀，具体项目目录可能是 `qtgs01req`、`qtgs02build` 等物理名称。初始化脚本会生成 `ai-kit-framework/project-map.yaml` 作为总索引，记录工作组目录和各阶段 playbook、skill、rule、agent、workspace 的实际路径，并把当前项目内 README、pipeline、playbook、sync 配置等文本引用改写为实际项目路径。

## 六大工作组

项目资产按职责拆分为六个编号目录，**业务组内阶段从 `01` 重新编号**：

```text
项目根目录/
├── ai-kit-framework/     框架说明（本文件）与工具（含 Cursor 同步示例）
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

## 三种执行方式

本框架不绑定某一种 AI 开发工具。目标项目初始化后，可以按团队成熟度选择以下任一方式执行。

| 方式 | 适用场景 | 如何执行 |
|------|----------|----------|
| IDE Agent 模式 | Cursor、Trae、Windsurf 等带 Agent 的 IDE | 将各阶段 `rules`、`skills` 接入 IDE；Cursor 可执行 `ai-kit-framework/cursor-script/` 下的 sync 命令 |
| 外部自动化 Agent 模式 | HermesAgent、CI Agent、自研 Agent、LangGraph / Dify / n8n 等流程编排 | 读取 `ai-kit-framework/automation/pipelines/`，按阶段调用 `playbook/**/agents/agent.md`、`rules/RULE.md`、`skills/SKILL.md` |
| 手工 / 通用工具模式 | 初期试点、无固定 Agent 工具或人工主导流程 | 直接阅读各阶段 `playbook/`，按目录约定将产物写入 `workspace/` |

三种方式共享同一套 playbook。区别只在于 **谁来编排执行**：IDE Agent、外部自动化工具，或人。

### 外部自动化 Agent

若使用 HermesAgent 这类工具，建议按以下顺序执行：

1. 读取 `ai-kit-framework/automation/pipelines/requirement-to-code.yaml`。
2. 按阶段生成 context pack，例如：

```bash
node ai-kit-framework/automation/scripts/prepare-context.mjs \
  --pipeline ai-kit-framework/automation/pipelines/requirement-to-code.yaml \
  --stage req-baseline \
  --feature USER-MGMT
```

3. 将生成的 `.tmp/automation/context/<feature>/<stage>/context-pack.md` 交给外部 Agent。
4. Agent 输出必须写入流水线声明的 `workspace/` 目录。
5. 执行日志、人工确认点和风险记录写入 `06_gov/workspace/01_governance/automation-runs/`。

自动化工具可以连续推进阶段，但需求基线、架构设计、详细设计、编码验证和交付验收建议保留人工 gate。

## 组内阶段

### 01_req（需求组）

```text
playbook/
└── 01_requirements/     需求收集与需求基线标准

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
02_build/03_code                   -> Developer Agent
03_qa/01_testing                   -> Tester Agent
04_change/01_change                -> Change Manager Agent / Release Manager Agent
05_delivery/01_delivery            -> Release Manager / Delivery Agent
06_gov/01_governance               -> 全角色共同参与
```

## 使用建议

1. 阅读本文件，确认六大组职责与交接关系。
2. 进入对应组目录，阅读组内 `README.md`。
3. 再读该组 `playbook/README.md`，以及各阶段 `playbook/**/rules/RULE.md`、`playbook/**/skills/SKILL.md` 与 `playbook/**/agents/agent.md`。若使用 Cursor，执行 sync 后规则与技能安装到 `.cursor/`；agent 仍保留在 playbook 中，可供外部 Agent 直接调用。
4. **使用 Cursor 时**：在 `ai-kit-framework/cursor-script/` 执行 sync，安装 rule 与 skill；其他工具请按该 IDE 方式接入 playbook。
5. 使用 AI 时同步维护 `06_gov/workspace/01_governance/` 留痕。

## 按阶段操作指南

下面这套说明面向 **带 AI Agent 的开发工具**（如 Cursor、Trae、Windsurf）。无论哪种工具，**阶段标准均来自各组 `playbook/`**；Cursor 用户可通过 sync 生成 `.cursor/`，其他用户按各自工具接入即可。

默认前提要先讲清楚：**使用者已经把本项目模板中的阶段 skill、阶段 rule、阶段 agent 安装或接入到了当前开发工具中。** 也就是说，用户在实际对话时，通常**不需要再额外解释 rule 和 agent 在哪里**，也不需要逐条告诉 Agent 本阶段应该遵守哪些规范；只要明确说出：

1. 这次要调用哪个阶段的 skill。
2. 要参考哪些业务材料、基线文档、设计文档或代码资料。
3. 要完成什么业务目标，生成什么阶段产物。

可以把它理解成一种默认工作方式：

- `skill` 负责决定当前阶段该怎么做。
- `rule` 负责约束当前阶段该输出什么、怎么写、放到哪里。
- `agent` 负责补充这个阶段的执行口径、结构和注意事项；也可以被外部 Agent 直接引用。

所以在开发工具里，你真正要说清楚的，通常就是：**调用哪个具体 skill + 这个业务需求的详细说明**。如果业务说明足够具体，Agent 一般就能按该阶段的既有规则，把结果写到对应 `workspace`。

### 通用句式

你可以直接在 Agent 对话框里使用下面这种句式：

```text
请使用【某阶段 skill】，参考【文件 / 目录 / 纪要 / 设计 / 代码】，完成【某个业务目标】，并输出【该阶段产物】。
```

如果你想让 Agent 输出得更稳一些，可以再补一句：

```text
请按本项目当前阶段已安装的 skill、rule、agent 执行，输出到对应 workspace，并区分已确认、假设、待确认。
```

下面统一用“人员管理”举例。这里的“人员管理”可以包括员工入职、员工转岗、员工离职、组织架构维护、岗位维护、人员状态变更、人员查询与导出等内容。

### 需求基线阶段

这个阶段适合把原始业务材料先整理成正式需求。常见输入包括：访谈纪要、业务会议记录、现状流程说明、Excel 台账、原系统截图、口头需求整理等，通常放在 `01_req/workspace/01_inputs/`。

在“人员管理”场景下，常见目标不是马上写设计，而是先把问题说清楚，例如：

- 员工入职需要录入哪些字段，哪些是必填。
- 转岗时是否需要保留历史部门、历史岗位。
- 离职后账号是否立即停用，是否允许查询历史人员档案。
- HR、部门负责人、普通员工三类角色分别能看到和操作什么。

你可以这样对 Agent 说：

```text
请使用 req-baseline skill，参考 @01_req/workspace/01_inputs/人员管理访谈纪要.md 和 @01_req/workspace/01_inputs/现状流程说明.md，生成“人员管理”需求基线初稿，覆盖员工入职、转岗、离职、组织维护和岗位维护。
```

```text
请使用 req-baseline skill，参考 @01_req/workspace/01_inputs/人员台账字段说明.xlsx、@01_req/workspace/01_inputs/HR讨论纪要.md 和 @01_req/workspace/01_inputs/原系统截图说明.md，整理“人员管理”功能的角色权限、业务规则、边界条件和验收标准。
```

```text
请使用 req-baseline skill，参考 @01_req/workspace/01_inputs/，把“人员管理”相关讨论下沉成正式需求项，写入 `01_req/workspace/03_baseline/`，并区分已确认需求、假设项和待确认项。
```

### 架构设计阶段

这个阶段适合在需求已经相对稳定后，明确系统边界、模块划分、对外集成和非功能方案。常见输入通常来自 `01_req/workspace/03_baseline/`，也可能包含外部系统说明，例如统一认证、组织主数据平台、消息通知平台等。

在“人员管理”场景下，架构阶段通常要回答这些问题：

- 人员管理是独立模块，还是归在主数据中心里。
- 组织、岗位、员工档案、任职关系、变更记录如何拆分。
- 是否要同步 LDAP、AD、统一身份平台或第三方 HR 系统。
- 大批量导入、导出、权限控制、审计留痕怎么实现。

你可以这样说：

```text
请使用 architect skill，参考 @01_req/workspace/03_baseline/人员管理需求基线-v1.0.md，生成“人员管理”模块的架构设计初稿，重点说明模块边界、子模块划分和外部依赖。
```

```text
请使用 architect skill，参考 @01_req/workspace/03_baseline/人员管理需求基线-v1.0.md 和 @外部系统对接说明/统一身份平台.md，输出“人员管理”模块与组织主数据、统一认证、消息通知系统的集成方案。
```

```text
请使用 architect skill，基于 @01_req/workspace/03_baseline/人员管理需求基线-v1.0.md，补齐该模块的性能、安全、审计、可追溯性和风险控制设计。
```

### 详细设计阶段

这个阶段适合把某个模块进一步落细到接口、页面、流程、状态、校验、异常和数据库层面。对于“人员管理”，最好不要只说“做人员管理详细设计”，而是尽量指出具体范围，例如“员工入职”“员工转岗审批”“组织树维护”“岗位停用规则”等。

在这个阶段，你通常希望 Agent 产出这些内容：

- 模块设计和页面说明。
- 接口契约、请求参数、返回结构、错误码。
- 状态流转、校验规则、异常处理和权限判断。
- 数据库设计和数据质量规则。

你可以这样说：

```text
请使用 design skill，参考 @01_req/workspace/03_baseline/人员管理需求基线-v1.0.md 和 @02_build/workspace/01_architecture/人员管理架构设计-v1.0.md，生成“人员管理”详细设计，覆盖员工入职、转岗、离职、组织维护和岗位维护。
```

```text
请使用 design skill，参考 @02_build/workspace/01_architecture/人员管理架构设计-v1.0.md，输出“员工转岗”子功能的接口设计、状态流转、字段校验、异常处理和权限控制方案。
```

```text
请使用 design skill，参考 @01_req/workspace/03_baseline/人员管理需求基线-v1.0.md，生成“人员档案查询与导出”功能的模块设计、接口契约、查询条件、列表字段、导出规则和界面说明。
```

### 详细设计中的数据库设计

数据库设计统一通过 `design skill` 执行，数据库相关产物输出到 `02_build/workspace/02_design/database/`。数据库产物应包含 ER 实体关系图、字段字典、索引设计、建表与变更脚本、初始化数据、回滚说明和数据质量规则。

对于“人员管理”，数据库设计常见会涉及：员工主表、组织表、岗位表、员工任职关系表、人员变更记录表、离职记录表、导入批次表等；同时要明确编码规则、唯一约束、状态字段、逻辑删除策略、历史数据保留策略。

你可以这样说：

```text
请使用 design skill，参考 @01_req/workspace/03_baseline/人员管理需求基线-v1.0.md 和 @02_build/workspace/02_design/modules/人员管理详细设计.md，生成“人员管理”数据库设计，并输出到 @02_build/workspace/02_design/database。
```

```text
请使用 design skill，参考 @02_build/workspace/02_design/modules/人员管理详细设计.md，输出员工表、组织表、岗位表、任职关系表和人员变更记录表的字段字典、ER 实体关系图、索引约束、初始化数据、迁移脚本和回滚方案。数据库脚本不要创建物理外键。
```

```text
请使用 design skill，参考 @02_build/workspace/02_design/modules/员工转岗详细设计.md，整理“员工转岗”涉及的实体关系、状态字段、历史保留策略和数据质量校验规则，并用 ER 图箭头表达逻辑外键关系。
```

### 编码实现阶段

这个阶段建议把实现范围说得非常具体，尽量收敛到一个模块、一个子功能或一批明确任务，而不是一句“把人员管理做完”。如果前面的需求、架构、详细设计和数据库设计都已经准备好，这个阶段就可以直接进入开发任务拆分、代码实现、运行验证和测试补充。

在“人员管理”场景下，你可以按下面这种粒度提需求：

- 只拆分开发任务，不立即写代码。
- 只实现“员工入职”接口和页面。
- 只实现“组织树查询 + 岗位维护”。
- 只修复“转岗后历史任职丢失”的问题。

你可以这样说：

```text
请使用 coding skill，参考 @01_req/workspace/03_baseline/人员管理需求基线-v1.0.md、@02_build/workspace/01_architecture/人员管理架构设计-v1.0.md、@02_build/workspace/02_design/modules/人员管理详细设计.md 和 @02_build/workspace/02_design/database/人员管理数据库设计.md，生成“人员管理”模块的开发任务拆分。
```

```text
请使用 coding skill，参考 @02_build/workspace/02_design/modules/员工入职详细设计.md 和 @02_build/workspace/02_design/database/人员管理数据库设计.md，实现“员工入职”功能代码，并给出运行命令和测试命令。
```

```text
请使用 coding skill，参考 @02_build/workspace/02_design/modules/员工转岗详细设计.md，只实现“员工转岗”这一个子功能，不要扩展到离职、组织维护等其他模块，并同步记录测试证据和待确认问题。
```

### 测试阶段

这个阶段通常基于需求、设计、代码变更、缺陷单和发布说明来生成测试方案、测试用例、执行记录、缺陷分析和发布建议。

“人员管理”场景下，测试通常要覆盖这些重点：

- 正常流程：入职、转岗、离职、组织调整、岗位维护。
- 异常流程：重复工号、无效部门、停用岗位仍被引用、离职人员重复操作。
- 权限场景：HR 可维护，部门负责人可查看部分数据，普通用户只能查本人或受限范围。
- 数据场景：导入导出、历史记录、状态一致性、审计日志。

你可以这样说：

```text
请使用 test skill，参考 @01_req/workspace/03_baseline/人员管理需求基线-v1.0.md 和 @02_build/workspace/02_design/modules/人员管理详细设计.md，生成“人员管理”功能的测试方案和测试用例，覆盖员工入职、转岗、离职、组织维护和岗位维护。
```

```text
请使用 test skill，参考 @代码变更说明/员工转岗改造.md 和 @发布说明.md，输出“员工转岗”子功能的测试范围、回归重点、缺陷风险和发布建议。
```

```text
请使用 test skill，参考 @03_qa/workspace/01_testing/人员管理现有测试记录.md，补充“人员档案查询与导出”功能的缺陷清单、复测建议和回归建议。
```

### 变更阶段

当需求、设计、代码、测试结论或上线方案发生正式变化时，可以使用这个阶段生成 CR 变更登记、影响分析、审批依据和关闭条件。

在“人员管理”场景下，常见变更包括：

- 客户新增“离职人员保留 24 个月可查询”的要求。
- 原来只支持单岗位，后来改成支持一人多岗。
- 统一身份平台接口调整，导致人员同步方案变化。

你可以这样说：

```text
请使用 change skill，参考 @客户新增需求讨论记录/人员管理二期需求.md 和 @01_req/workspace/03_baseline/人员管理需求基线-v1.0.md，生成“人员管理”功能的变更分析。
```

```text
请使用 change skill，参考 @缺陷单/员工转岗历史任职缺失.md、@02_build/workspace/02_design/modules/员工转岗详细设计.md 和 @03_qa/workspace/01_testing/员工转岗测试报告.md，输出该问题的 CR 变更登记、影响分析、修复范围和关闭条件。
```

### 发布阶段

发布阶段适合引用构建产物、测试结论、变更记录、部署说明、回滚方案和上线验证清单，组织成一次可执行的发布包。

如果还是以“人员管理”为例，这个阶段通常要明确：

- 这次上线的是哪些子功能。
- 是否涉及数据库脚本、初始化数据、配置变更。
- 上线前后分别由谁检查。
- 如果导入任务失败、同步失败或权限异常，怎么回滚。

你可以这样说：

```text
请使用 release skill，参考 @测试报告/人员管理测试报告.md、@变更记录/人员管理CR记录.md 和 @部署说明/人员管理部署说明.md，生成“人员管理”模块本次版本的发布计划、上线检查清单和回滚说明。
```

```text
请使用 release skill，参考 @02_build/workspace/04_release/ 和 @03_qa/workspace/01_testing/人员管理发布前验证记录.md，整理“员工入职、员工转岗、组织维护”三个子功能的上线步骤、验证项和发布后观察点。
```

### 交付验收阶段

这个阶段通常围绕交付包、操作手册、培训材料、验收记录、运维交接资料和遗留问题清单来组织输出。

“人员管理”场景下，常见交付物包括：

- 人员管理用户手册。
- HR 培训材料。
- 运维部署与巡检说明。
- 验收清单、验收结论和遗留问题台账。

你可以这样说：

```text
请使用 deliver skill，参考 @最终版本说明/人员管理版本说明.md、@测试报告/人员管理测试报告.md 和 @运维交接资料/人员管理运维说明.md，生成“人员管理”模块的项目交付清单和验收材料。
```

```text
请使用 deliver skill，参考 @05_delivery/workspace/01_delivery/，整理“人员管理”项目的用户手册、培训材料、验收记录和遗留问题清单，并补齐缺失项。
```

### AI 治理阶段

只要 AI 参与了需求、设计、代码、测试、发布、交付中的任一活动，就可以在这个阶段补充治理记录，沉淀 Agent 使用、人工复核、安全检查和输出验收证据。

以“人员管理”为例，AI 治理阶段关注的不是业务功能本身，而是：

- 本次用了哪些提示词和输入材料。
- AI 产出是否经过人工确认。
- 是否存在敏感信息、误生成、幻觉或越权内容。
- 最终哪些内容被接受，哪些内容被退回修改。

你可以这样说：

```text
请使用 govern skill，参考 @本次对话使用的提示词.md 和 @输出结果/人员管理详细设计草稿.md，生成本次“人员管理”功能的 AI 治理记录。
```

```text
请使用 govern skill，参考 @06_gov/workspace/01_governance/ 和 @人工确认记录/人员管理人工复核记录.md，补齐本次版本的 Agent 审查、安全检查、人工确认和输出验收记录。
```

### 一条简单经验

如果 Agent 回答得太泛，没有真正按阶段执行，可以直接补一句：

```text
请不要泛化总结。请严格使用本项目当前阶段已安装的 skill，参考我给出的文件，直接生成该阶段产物，并写入对应 workspace。
```

## 项目初始化与使用

### 初始化方式

在 `ai-project-kit` 框架仓库中执行初始化命令：

```bash
npm run init -- ../qtgs-project_demo all qtgs
```

其中：

- `../qtgs-project_demo` 是目标项目目录。
- `all` 表示初始化全部工作组；也可以使用 `req`、`build`、`qa`、`change`、`delivery`、`gov` 只初始化某一组。
- `qtgs` 是项目码，会生成 `qtgs01req`、`qtgs02build` 等带项目前缀的目录。

初始化结果示例：

```text
qtgs-project_demo/
├── ai-kit-framework/
├── qtgs01req/
├── qtgs02build/
├── qtgs03qa/
├── qtgs04change/
├── qtgs05delivery/
└── qtgs06gov/
```

若不需要项目前缀，可以执行：

```bash
npm run init -- ../demo-project all
```

此时目录保持模板默认名称，不带项目码前缀。

### 路径映射

初始化后会生成：

```text
ai-kit-framework/project-map.yaml
```

这份文件记录两类索引：

- `groups`：模板工作组与当前项目物理目录的映射。
- `stages`：各阶段的 playbook、skill、rule、agent、workspace 实际路径。

Cursor sync、外部自动化 context 生成、目标项目 README 和 playbook 引用都以当前项目物理目录为准。

### 使用 Cursor

进入初始化后的目标项目根目录，执行：

```bash
npm --prefix ai-kit-framework/cursor-script run sync:rule
npm --prefix ai-kit-framework/cursor-script run sync:skill
```

同步后，Cursor 会从当前项目的 playbook 安装 `.cursor/rules` 与 `.cursor/skills`。如果项目使用了前缀目录，sync 脚本会读取 `ai-kit-framework/project-map.yaml` 并自动使用当前项目路径。

### 使用外部自动化 Agent

外部自动化工具可以读取流水线并生成上下文包：

```bash
node ai-kit-framework/automation/scripts/prepare-context.mjs \
  --pipeline ai-kit-framework/automation/pipelines/requirement-to-code.yaml \
  --stage req-baseline \
  --feature USER-MGMT
```

`prepare-context.mjs` 会读取 `ai-kit-framework/project-map.yaml`，把 pipeline 中的阶段路径解析到当前项目目录。Agent 输出必须写入 context pack 中声明的 `Expected Outputs`。

### Git 仓库建议

可以按团队治理方式选择：

- 单仓模式：整个目标项目一个 Git 仓库，六个工作组目录在同一仓库中协作。
- 多仓模式：各工作组目录独立成仓，例如 `qtgs01req`、`qtgs02build` 分别绑定不同远程仓库。

无论采用哪种模式，阶段产物都写入各自 `workspace/`，阶段标准仍以各自 `playbook/` 为准。

## 版本说明

- v0.1.0: 初始公开版。

