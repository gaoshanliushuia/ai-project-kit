---
name: ai-project-kit-framework
description: Maintains the ai-project-kit repository—templates, six workgroup layout, init script, docs/demo case study, and playbook-to-Cursor sync. Use when editing templates/**, docs/demo/**, ai-project-kit.js, playbook/, or when the user mentions ai-project-kit framework, workgroup structure, template initialization, or demo regeneration.
---

# ai-project-kit 框架维护 Skill

## 目标

在 ai-project-kit 仓库内安全地更新模板、示例 demo 和工具脚本，并保持六大工作组结构、playbook 与 Cursor 镜像一致。

## 输入

- 用户变更意图（新工作组、目录调整、案例更新）
- `templates/README.md` 与目标工作组 README
- 现有 `docs/demo/` 与 `scripts/cursor-script/sync-cursor.config.json`

## 输出

- 更新后的 `templates/`、`ai-project-kit.js`（如需要）
- 与模板结构一致的 `docs/demo/`
- 同步后的 `.cursor/rules/`、`.cursor/skills/`（本仓库或 demo 内）

## 标准执行顺序

1. 阅读 `playbook/rules/RULE.md` 与 `templates/README.md`，确认六大工作组与 `01_req` 扁平 workspace 结构。
2. 进入目标工作组，阅读 `playbook/README.md` 与阶段 `rules/RULE.md`，再改 `workspace/` 或模板正文。
3. 修改 `templates/` 后执行 `npm run init .tmp/bootstrap-test all` 做初始化冒烟验证。
4. 需要更新 demo 时：清空 `docs/demo/` 业务目录 → `npm run init docs/demo all` → 覆盖案例 workspace（保留轻量原型与教务案例文档）→ 更新 `docs/README.md` 路径。
5. 修改 playbook 规则/技能后执行 sync：
   - 本仓库：`AI_PROJECT_ROOT=. node scripts/cursor-script/sync-cursor.mjs --config playbook/sync-cursor.config.json --only rules|skills`
   - demo：`npm --prefix docs/demo/cursor-script run sync:rule` 与 `sync:skill`
6. 输出变更摘要：受影响工作组、路径迁移、需人工确认的评审点。

## 工作组速查

```text
01_req/workspace/01_inputs → 02_prototypes → 03_baseline
        ↓
02_build/workspace/01_architecture … 05_release
        ↓
03_qa/workspace/01_testing
        ↓
04_change/workspace/（扁平变更记录）
        ↓
05_delivery/workspace/01_delivery
        ↓
06_gov/workspace/01_governance
```

## Demo 内容映射（旧 → 新）

| 旧路径 | 新路径 |
|--------|--------|
| `01_req/workspace/01_requirements/01_inputs/` | `01_req/workspace/01_inputs/` |
| `…/03_prototypes/` | `01_req/workspace/02_prototypes/` |
| `…/04_requirements/`、`07_baseline/` 等 | `01_req/workspace/03_baseline/` |
| `03_qa/workspace/02_changes/` | `04_change/workspace/` |
| `04_delivery/` | `05_delivery/` |
| `05_gov/` | `06_gov/` |

## 使用要求

- 执行入口：`playbook/skills/SKILL.md` → `playbook/rules/RULE.md` → 目标工作组 playbook。
- `templates/` 优先于 `docs/demo/`；demo 是模板的案例投影，不是第二套标准。
- 不把客户完整代码库默认写入 `templates/01_req/workspace/02_prototypes/`。
- 发现 playbook 冲突或缺口时，先指出再回写 `rules/`、`skills/` 或 `prompts/`。
