# ai-project-kit 框架维护 rules

本目录保存 ai-project-kit **仓库级** 可复用规则。规则约束框架维护方式，不替代各工作组阶段 playbook。

## 适用范围

- 维护 `templates/`、`docs/demo/`、`scripts/`、`ai-project-kit.js`
- 更新六大工作组目录结构与初始化行为
- 编写或调整 `docs/README.md` 实施指导

## 目录与职责

项目按 **六大工作组** 组织，组内阶段从 `01` 重新编号：

| 目录 | 职责 |
|------|------|
| `01_req` | 需求输入、原型、需求基线 |
| `02_build` | 架构、设计、数据库、编码、发布 |
| `03_qa` | 测试与质量保证 |
| `04_change` | 变更与配置管理（独立工作组） |
| `05_delivery` | 交付与验收 |
| `06_gov` | AI 使用治理 |

每个工作组包含 `playbook/`（标准）与 `workspace/`（项目产物）。**`templates/` 是唯一模板源头**；`docs/demo/` 是完整案例，结构必须与初始化结果一致。

## 维护规则

- 修改框架标准时，**先改 `templates/`**，再 `npm run init .tmp/bootstrap-test all` 验证，最后同步 `docs/demo/`。
- 不在 `templates/` 与 `docs/demo/` 之间手工双向漂移；demo 应通过初始化 + 案例内容覆盖生成。
- `playbook/**/rules|skills|prompts` 是 Cursor 规则/技能正文源；修改后须执行对应 `sync:rule` / `sync:skill`（业务项目用 `cursor-script/`，本仓库用 `playbook/sync-cursor.config.json`）。
- `workspace/` 只放案例或项目执行产物，不把研讨/客户专用大工程直接当作通用模板默认内容。
- 跨组引用使用业务编号（`REQ`、`DES`、`DB`、`CODE`、`QA`、`CR`、`DEL`、`GOV`），目录编号仅在组内有效。

## 需求组结构（v0.1.0+）

`01_req/workspace/` 采用扁平三阶段：

```text
01_inputs/      原始会议、调研、访谈
02_prototypes/  原型与交互说明
03_baseline/    已签发需求基线与追踪材料
```

不得恢复 `workspace/01_requirements/` 等多层中间目录作为默认模板结构。

## Demo 规则

- `docs/demo/` 案例主题为「中学教务管理系统」，范围控制在登录、主页、学生/班级/教师/课程/成绩管理。
- Demo 的 playbook 来自模板初始化；workspace 使用案例内容，可保留轻量 `prototype-app`，不得复制完整客户级前端工程到 demo。
- Demo 内路径、组编号、变更组位置须与 `templates/README.md` 一致（含 `04_change`、`05_delivery`、`06_gov`）。

## 版本与发布

- 框架版本与 `package.json`、`templates/README.md` 保持一致。
- 破坏性目录变更须在 README 与 `docs/README.md` 同步说明迁移方式。
- 可复用经验优先回写对应阶段 `playbook/`，再考虑写入本目录。

## AI 协同规则

- AI 可用于生成模板、demo 文档和脚本初稿，但目录边界与组间关系须人工确认。
- 不得将未评审的 AI 输出直接当作已签发基线或交付依据。
- 在本仓库做较大结构变更时，在 PR 说明中列出受影响的工作组与迁移要点。
