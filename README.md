# ai-project-kit

Version: v0.1.0

`ai-project-kit` 是一个用于初始化 AI 辅助软件研发全过程资产的项目框架。它不是单纯的 Prompt 集合，也不只是代码脚手架，而是把需求收集、方案设计、代码实施、测试、变更管理、上线交付和 AI 治理留痕统一组织起来的工程化模板。

## 项目定位

这个项目面向的是“AI 已经参与软件研发，但项目资产仍然需要可管理、可交接、可追溯”的场景。它希望解决的不是某一个文档怎么写，而是把软件项目从需求到交付过程中持续产生的材料，放进一套清晰、稳定、适合人和 AI 共同工作的目录结构里。

初始化之后，项目资产会按六个工作组组织：

| 目录 | 资产域 | 解决的问题 |
|------|--------|------------|
| `01_req` | 需求组 | 把业务输入、原型和需求基线固化下来 |
| `02_build` | 实施组 | 承接需求基线，管理架构、设计、数据库、代码和发布 |
| `03_qa` | 测试与质量保证组 | 独立管理测试、缺陷与发布建议 |
| `04_change` | 变更管理组 | 统一管理需求、设计、配置、发布和交付相关正式变更 |
| `05_delivery` | 交付组 | 管理验收、交付包、用户手册、培训材料和运维移交 |
| `06_gov` | AI 治理组 | 沉淀 AI 使用、审查、验收和 Metrics |

每个工作组通常包含两类空间：

- `playbook/`：本组如何工作的标准说明，包括规则、技能和提示词。
- `workspace/`：本组实际执行过程中产生的项目资产。

## 快速开始

如果你已经 clone 了本仓库，推荐直接用 npm script 把模板初始化到目标项目：

```bash
npm run init ../my-project
```

只初始化某一个工作组：

```bash
npm run init ../my-project req
npm run init ../my-project build
npm run init ../my-project qa
npm run init ../my-project change
npm run init ../my-project delivery
npm run init ../my-project gov
```

默认不会覆盖已有文件，重复初始化时已有文件会被跳过。

本地开发验证：

```bash
npm run init .tmp/bootstrap-test all
```

更新 `docs/demo/` 案例（结构与模板对齐）：

```bash
npm run regenerate:demo
```

## 初始化后的结构

初始化完整项目后，目标目录会得到六个顶层工作组，以及 AI 工具同步脚本（与工作组平级）：

```text
项目根目录/
├── README.md
├── 01_req/                需求组
├── 02_build/              实施组
├── 03_qa/                 测试与质量保证组
├── 04_change/             变更管理组
├── 05_delivery/           交付组
├── 06_gov/                AI 治理组
├── cursor-script/         Cursor rule/skill 同步（默认初始化）
└── qoder-script/          Qoder rule/skill 同步预留目录（默认初始化）
```

初始化后可在项目根执行：

```bash
npm --prefix cursor-script run sync:rule
npm --prefix cursor-script run sync:skill
```

将 playbook 中的规则与技能同步到 `.cursor/`。详见 `cursor-script/README.md`。

如果按阶段分仓库管理，也可以把六个工作组分别放在独立仓库或独立目录中：

```text
xxx项目/
├── xxx项目_01_req/
├── xxx项目_02_build/
├── xxx项目_03_qa/
├── xxx项目_04_change/
├── xxx项目_05_delivery/
└── xxx项目_06_gov/
```

本仓库自身的结构如下：

```text
ai-project-kit/
├── README.md              项目总纲与开源协作入口
├── playbook/              本仓库（框架）级 rule/skill 源
├── package.json
├── ai-project-kit.js      初始化脚本
├── templates/             工作组模板源头
│   ├── README.md
│   ├── 01_req/ … 06_gov/
├── docs/
│   ├── README.md          实施指导手册
│   └── demo/              中学教务管理系统完整案例
└── scripts/
    ├── cursor-script/     Cursor rule/skill 同步（初始化时复制到目标项目）
    ├── regenerate-demo.js demo 重建脚本
    └── qoder-script/
```

维护本仓库时，同步框架级 Cursor 规则：

```bash
npm run sync:kit-rule
npm run sync:kit-skill
```

## 设计思想

软件项目的真实交付物不只有代码。一个项目从开始到结束，通常会持续产生需求访谈、业务流程、原型、架构决策、详细设计、数据库设计、代码任务、测试用例、缺陷、变更、发布计划、上线材料、验收记录和复盘结论。AI 参与后，还会额外产生 Prompt、AI 输出、人工审查、采纳记录、安全检查和质量度量。

如果这些资产只散落在聊天记录、个人文档或代码仓库的临时目录里，项目很容易出现三个问题：需求和实现脱节、测试和变更无法追溯、AI 生成内容缺少审核与治理。因此 `ai-project-kit` 把软件研发过程拆成六个大的资产域，让不同阶段的输入、输出、评审和交接都有明确位置。

这种划分不是为了增加流程负担，而是为了让 AI 能在明确边界内工作：需求组负责“做什么”，实施组负责“怎么构建和发布”，测试组负责“是否正确”，变更组负责“变化如何登记与闭环”，交付组负责“向用户交付什么、如何验收和移交”，治理组负责“AI 在哪里参与、产出是否可信、风险是否可追踪”。

## 经验来源与预期收益

按工作组和资产域拆分后，预期可以带来几类收益：

- 让需求基线、实现过程、测试、变更、用户交付和 AI 治理互不混写。
- 让不同角色按职责维护自己的资产，同时通过基线引用、变更记录和交付清单做结构化交接。
- 让 AI 工具在处理当前阶段时减少上下文噪音，降低误读其他阶段材料的风险。
- 让权限和审计更清楚，例如需求访谈、生产部署材料、AI 安全检查可以分别控制访问范围。
- 让项目结束后仍能追溯“需求为何如此、实现如何决策、缺陷如何关闭、AI 输出如何被验收”。

## 使用建议

初始化完整项目时，使用：

```bash
npm run init <target> all
```

如果项目按阶段分仓库管理，则可以分别运行：

```bash
npm run init <target> req
npm run init <target> build
npm run init <target> qa
npm run init <target> change
npm run init <target> delivery
npm run init <target> gov
```

初始化后不要急着让 AI 直接生成最终文档。更推荐先让 AI 阅读并完善当前岗位的 `playbook`，明确本阶段应该输入什么、输出什么、如何评审、如何编号、如何交接。

## 工作方式

推荐按下面的节奏使用：

1. 进入自己负责的工作组目录（`01_req` … `06_gov`）。
2. 阅读本组 `README.md`、`playbook/README.md` 和当前阶段的 `playbook/<stage>/README.md`。
3. 使用 AI 完善本岗位 `playbook` 中的 `rules/`、`skills/`、`prompts/`。
4. 参考 `playbook` 把产物生成到 `workspace/`。
5. 由岗位负责人评审确认；重要 AI 活动在 `06_gov/workspace/` 留痕。

跨岗位引用示例：

- 需求基线：`01_req/workspace/03_baseline/`
- 变更登记：`04_change/workspace/`
- 发布材料：`02_build/workspace/05_release/`
- 测试结论：`03_qa/workspace/01_testing/`

## 维护模型

- `templates/` 是唯一模板源头。
- `playbook/` 是本仓库（框架维护）的 rule/skill 源，通过 `npm run sync:kit-rule` 同步到 `.cursor/`。
- 修改框架标准时，先改 `templates/`，再 `npm run init .tmp/bootstrap-test all` 验证，必要时 `npm run regenerate:demo`。
- 业务项目内各阶段 playbook 修改后，在目标项目根执行 `cursor-script` 的 sync 命令。

## 当前版本状态

- 版本：v0.1.0
- 工作组：`01_req` / `02_build` / `03_qa` / `04_change` / `05_delivery` / `06_gov`
- 初始化命令：`npm run init <target> [req|build|qa|change|delivery|gov|all]`
