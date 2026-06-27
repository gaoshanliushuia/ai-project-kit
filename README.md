# ai-project-kit

`ai-project-kit` 是一个面向 **AI 辅助软件研发全过程** 的 **通用项目目录与阶段标准框架**。它提供可初始化的目录结构、各阶段 playbook（rules、skills、agents），帮助团队把「用 AI 做项目」从零散的 Agent 调用和对话实验，变成 **可协作、可留痕、可演进** 的工程方法。

框架本身 **不绑定某一 IDE 或 AI 工具**；本仓库以 **Cursor** 为例，提供 playbook → `.cursor/` 的同步脚本，其他工具可按同样思路接入 playbook 正文。

本仓库维护的是 **框架本身**（模板源、初始化脚本、同步工具），不承载具体业务项目的阶段产物。初始化后的目标项目说明见 [`ai-kit-framework/README.md`](ai-kit-framework/README.md)。

---

## 解决什么问题

用 AI 辅助做项目，上手往往很快：开一个对话，几轮就能出原型或代码。但项目周期一长、参与的人一多，常见问题就会暴露出来——**不是 AI 不够强，而是缺少把对话变成工程资产的容器**。

| 常见困境 | 典型表现 | 框架如何应对 |
|----------|----------|--------------|
| **多轮对话，上下文难续** | 新开窗口要重讲背景；前几轮结论 Agent 记不住，同类问题反复解释 | 按阶段选用 skill；关键结论写入 `workspace/` 固定路径，下次对话直接引用文档而非重述全文 |
| **内容零散，找不到依据** | 讨论散在聊天、个人笔记、临时文件里，评审时说不清「定稿在哪」 | 六大工作组 + 组内目录约定（如 inputs → baseline → 设计/代码），材料有固定位置与命名 |
| **阶段成果难积累** | 产出只留在对话里，无法版本化、难对比迭代、交接时靠截图或复制 | `playbook/` 定义每阶段产出标准，`workspace/` 沉淀可 Git 管理的阶段资产 |
| **多人协作口径不一** | 每人调用 Agent 的方式不同，设计、开发、测试对「已确认需求」理解不一致 | 统一 playbook 与短 skill 名；需求基线、变更记录、交付清单作为组间正式交接物 |
| **AI 输出难当正式结论** | 生成即采纳，谁签发、谁负责说不清 | 需求须 **基线签发**；变更独立登记；治理组对 AI 使用与人工复核留痕 |
| **越界改动，影响难追溯** | 在错误阶段改代码或改需求，事后不知道动了什么、为什么动 | 阶段 rule 约束读写边界；`04_change` 登记正式变更，与基线、交付可追溯 |

概括来说：**对话负责推进，目录与 playbook 负责沉淀**——把「这次聊出了什么」变成「这个项目里有什么、谁确认过、下游该读哪一份」。

---

## 核心特点

| 特点 | 说明 |
|------|------|
| **阶段化** | 需求、实施、测试、变更、交付、AI 治理六大工作组，职责清晰、交接有据 |
| **标准与产物分离** | `playbook/` 写「怎么做」，`workspace/` 写「做出了什么」 |
| **AI 可执行** | 短 skill 名 + rule 约束，对话时说明阶段与参考材料即可驱动 Agent |
| **标准可同步** | playbook 是正文源；各 IDE 的运行时配置（如 Cursor 的 `.cursor/`）由同步或手工接入，改标准后更新即可 |
| **轻量初始化** | 一条命令生成目录与工具，不绑定特定云厂商或 IDE |
| **可扩展** | 模板单一源头，可按组 init，也可按阶段拆仓库 |

---

## 设计思想

### 框架，而不是零散 Agent 配置

很多团队用 AI 做项目的起点，是一堆 Agent 配置或对话技巧。这种方式上手快，但难以复用、交接和审计。

`ai-project-kit` 的定位是 **AI Project Framework**：

- **目录结构** — 明确什么材料放哪里
- **playbook** — 定义每个阶段该怎么做、产出什么
- **skill / rule** — 让 Agent 知道当前阶段该执行什么、遵守什么
- **workspace** — 沉淀可评审、可追踪的项目资产

Agent 执行说明仍然有用，但它是阶段标准的一部分，而不是项目的全部基础设施。

### 阶段边界先于工具技巧

软件研发首先是 **跨角色、跨阶段** 的协作问题，其次才是 AI 工具问题。

框架按六大工作组划分职责，每组有独立的 `playbook/` 与 `workspace/`，组内阶段从 `01` 重新编号，组间通过 **基线、变更记录、交付清单、治理留痕** 交接。

这样 AI 介入时有清晰的上下文：**Agent 知道自己在哪个阶段、该读什么、该写什么、不该越界到哪里。**

### 标准可版本化，运行时可接入

| 层级 | 位置 | 作用 |
|------|------|------|
| 标准源 | `playbook/` 下的 rules、skills、agents | 可评审、可 Git 管理、可迭代；**与具体 IDE 无关** |
| 运行时 | 各工具约定目录（如 Cursor 的 `.cursor/rules`、`.cursor/skills`） | 供 Agent IDE 读取；由同步脚本或团队自行映射 |

**playbook 是唯一正文来源**；`.cursor/` 等目录只是「当前工具如何加载这些标准」的运行时镜像，并非框架核心。以 Cursor 为例：修改 playbook 后执行 sync，Agent 行为才会更新——**标准讨论与 IDE 配置维护解耦**，团队只需维护一套 playbook；Trae、Windsurf 等工具可沿用同一 playbook，按各自规则目录或接入方式加载。

### 三种执行方式

| 方式 | 适用场景 | 接入方式 |
|------|----------|----------|
| IDE Agent 模式 | Cursor、Trae、Windsurf 等带 Agent 的 IDE | 将 `playbook/**/rules` 与 `playbook/**/skills` 接入 IDE；Cursor 可使用 `cursor-script` 同步到 `.cursor/` |
| 外部自动化 Agent 模式 | HermesAgent、CI Agent、自研 Agent、LangGraph / Dify / n8n 等编排工具 | 读取 `ai-kit-framework/automation/pipelines/`，按阶段调用 `agents/agent.md`、`rules/RULE.md`、`skills/SKILL.md`，结果写入 `workspace/` |
| 手工 / 通用工具模式 | 不接入特定 Agent 工具，或先以文档流程试点 | 人直接阅读各阶段 `playbook/`，按目录约定沉淀产物 |

无论哪种方式，正式阶段产物都写入 `workspace/`；自动化过程与关键 AI 使用记录写入 `06_gov/workspace/01_governance/`。

### AI 是参与者，不是签发者

框架默认：**AI 可以生成初稿和建议，关键结论须由人评审、确认和签发。**

- 需求组强调 **需求基线**（`req-baseline`），产出可交给下游设计的固化文档
- 变更组独立登记正式变更，影响可追溯
- 治理组（`06_gov`）对 AI 使用、人工复核、安全检查和输出验收留痕

AI 提升效率；人保留责任边界。

### 结构约定，降低协作成本

- **模板单一源头** — `templates/` 是工作组模板的唯一来源
- **公共区独立** — `ai-kit-framework/` 存放使用说明与工具，与六大工作组平级
- **业务编号一致** — `REQ`、`DES`、`CODE`、`QA`、`CR`、`DEL`、`GOV` 跨组引用，目录编号仅在组内有效
- **可验证** — 改模板 → init 冒烟 → 校验 sync 配置，再发布给业务项目使用

---

## 设计理念

1. **同一结构，同一套阶段语言** — 不同项目、不同角色，用相同目录与 skill 名沟通，降低交接成本。
2. **Workspace 写产物，Playbook 写标准** — 不把标准混进案例产物，也不把临时讨论当正式基线。
3. **短 skill，清晰 rule** — 如 `design`、`coding`、`req-baseline`；对话时说明「用哪个 skill、参考哪些材料」即可。
4. **初始化不锁定工具** — 只复制模板与可选辅助脚本；`cursor-script` 是 Cursor 适配示例，不是使用框架的前提。
5. **按组或按仓，灵活治理** — 支持单仓六组，也支持各阶段独立 Git 仓库，由团队选择粒度。

---

## 适用场景

**更适合：**

- 希望把 AI 辅助研发 **流程化、文档化** 的团队
- 多人多角色并行，需要明确 **阶段交接点** 的项目
- 在 Cursor、Trae、Windsurf 等 Agent IDE 中，将 playbook 中的 skill + rule 接入工具后驱动阶段产出
- 希望把阶段经验 **沉淀为 playbook**，在多项目间复用的组织

**不太适合：**

- 只需要几个即用 Agent 调用、不关心目录与阶段治理的个人实验

---

## 仓库结构

```text
ai-project-kit/
├── README.md                 本文件（框架说明）
├── ai-project-kit.js         初始化脚本
├── templates/                六大工作组模板（01_req … 06_gov）
└── ai-kit-framework/         init 时复制到目标项目的公共区
    ├── README.md             目标项目使用说明
    ├── automation/           外部自动化 Agent 编排示例与模板
    └── scripts/
        ├── cursor-script/    Cursor 适配：playbook → .cursor/ 同步（示例）
        └── qoder-script/     其他工具适配占位
```

---

## 快速使用

```bash
npm run init <target> all          # 完整初始化
npm run init <target> req          # 仅初始化某一工作组
npm run init .tmp/bootstrap-test all   # 本地冒烟
```

**若使用 Cursor**（本仓库内置同步示例），初始化后可安装规则与技能：

```bash
npm --prefix ai-kit-framework/cursor-script run sync:rule
npm --prefix ai-kit-framework/cursor-script run sync:skill
```

使用其他 IDE 时，请按该工具的 Agent 配置方式，将各组 `playbook/**/rules` 与 `playbook/**/skills` 接入即可；目录结构与阶段标准不变。

**若使用外部自动化 Agent**（如 HermesAgent），请参考：

```bash
ai-kit-framework/automation/README.md
ai-kit-framework/automation/pipelines/requirement-to-code.yaml
```

---

## 框架维护

修改 `templates/` 或 `ai-kit-framework/` 后建议：

1. `npm run init .tmp/bootstrap-test all` — 验证初始化结果
2. `npm run validate:sync-config` — 校验 sync 配置与模板路径（若改动了 playbook 映射）

---

## 版本说明

- **v0.1.0** — 六大工作组、playbook 标准、Cursor 同步示例、短 skill 命名、`ai-kit-framework` 公共区。
