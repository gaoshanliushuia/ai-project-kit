# 项目说明

Version: v0.1.0

这是通过 ai-project-kit 初始化后的项目入口说明。

## 项目作用

- 将 ai-project-kit 定位为 AI Project Framework（AI 辅助研发框架），而不是 Prompt 集合。
- 按五大工作组划分协作边界：需求、实施、测试变更、交付、AI 治理。
- 帮助各角色在独立目录中并行工作，并通过阶段目录内的基线、回传、交付和治理记录完成交接与留痕。
- 交付组独立管理面向用户验收的资产；AI 治理统一沉淀在 `05_gov`。

## 五大工作组

项目资产按职责拆分为五个编号目录，**业务组内阶段从 `01` 重新编号**：

```text
项目根目录/
├── 01_req/        需求组
├── 02_build/      实施组（架构 + 设计 + 数据库 + 编码 + 发布）
├── 03_qa/         测试变更组
├── 04_delivery/   交付组（验收 + 资料移交 + 用户手册 + 运维交接）
└── 05_gov/        AI 治理组
```

每个工作组通常包含：

- `playbook/` — 本组阶段标准
- `workspace/` — 本组执行与沉淀区

## 组内阶段

### 01_req（需求组）

```text
playbook/ & workspace/
└── 01_requirements/     需求收集与需求分析
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

### 03_qa（测试变更组）

```text
playbook/ & workspace/
├── 01_testing/          测试与质量保证
└── 02_changes/          变更与配置管理
```

### 04_delivery（交付组）

```text
playbook/ & workspace/
└── 01_delivery/         项目交付与验收
```

交付组保存用户验收时需要接收和签收的资产，包括源代码、构建产物、部署包、用户手册、培训材料、验收记录、运维资料和交付总结。

### 05_gov（AI 治理组）

```text
playbook/ & workspace/
└── 01_governance/       AI 使用治理与质量约束
```

## 组间协作

```text
01_req/workspace/01_requirements/
        │
        ▼
02_build/workspace/01_architecture/ … 05_release/
        │
        ▼
03_qa/workspace/02_changes/  ──►  02_build
        │
        ▼
04_delivery/workspace/01_delivery/
        │
        ▼
05_gov/workspace/01_governance/（AI 治理留痕）
```

- **需求组**：基线签发后写入 `workspace/01_requirements/` 内建议的基线或交接子目录。
- **实施组**：在对应阶段目录内记录需求基线来源，完成架构、设计、代码和发布。
- **测试变更组**：结构化回传缺陷、测试结论和变更影响。
- **交付组**：面向用户验收沉淀交付包、手册、培训、验收和运维资料。
- **治理组**：各组凡使用 AI 的关键活动，在 `05_gov` 登记。

跨组追踪使用业务编号（`REQ`、`CR`、`DEF`），目录编号只在组内有效。

## Agent Role 体系

```text
01_req/01_requirements             -> Business Analyst Agent
02_build/01_architecture           -> Architect Agent
02_build/03_database               -> DBA Agent
02_build/04_codebase               -> Developer Agent
03_qa/01_testing                   -> Tester Agent
04_delivery/01_delivery            -> Release Manager / Delivery Agent
05_gov/01_governance               -> 全角色共同参与
```

## 使用建议

1. 阅读本文件，确认五大组职责与交接关系。
2. 进入对应组目录，阅读组内 `README.md`。
3. 再读该组 `playbook/README.md` 与 `workspace/README.md`。
4. 使用 AI 时同步维护 `05_gov/workspace/01_governance/` 留痕。

## 初始化具体项目建议

将本模板用于具体项目时，建议按五个大阶段分别创建 Git 仓库，避免需求、实施、测试变更、交付、AI 治理的工作内容相互干扰。仓库名称建议使用“项目名 + 阶段编号”的方式，例如：

```text
xxx项目_01_req
xxx项目_02_build
xxx项目_03_qa
xxx项目_04_delivery
xxx项目_05_gov
```

本地目录建议统一放在一个工作目录下，便于 AI IDE 集中管理。例如：

```text
AI工作/
├── xxx项目_01_req/
├── xxx项目_02_build/
├── xxx项目_03_qa/
├── xxx项目_04_delivery/
└── xxx项目_05_gov/
```

初始化流程建议：

1. 先创建本地总工作目录，例如 `AI工作/`。
2. 在该目录下分别创建五个阶段仓库目录。
3. 每个阶段目录独立执行 `git init` 或绑定独立远程仓库。
4. 按阶段复制对应的 `01_req`、`02_build`、`03_qa`、`04_delivery`、`05_gov` 模板内容。
5. 通过阶段目录内的基线、引用记录、回传记录、交付清单和治理留痕传递阶段成果，不直接混写其他阶段仓库。

## 版本说明

- v0.1.0: 初始公开版。
