# ai-project-kit 项目级 Playbook

本目录保存 **ai-project-kit 仓库自身** 的框架约束与执行方法，供维护 `templates/`、`docs/demo/`、`scripts/` 和发布流程时使用。

与初始化后业务项目不同：业务项目的 playbook 分布在 `01_req` … `06_gov` 各工作组内；本目录只描述 **框架仓库** 的维护边界。

## 内容

| 路径 | 用途 |
|------|------|
| `rules/RULE.md` | 框架维护必须遵守的约束（目录、版本、同步、demo） |
| `skills/SKILL.md` | 在本仓库内推进模板、demo、脚本变更的标准步骤 |

## 同步到 Cursor

在项目根目录执行：

```bash
AI_PROJECT_ROOT=. node scripts/cursor-script/sync-cursor.mjs --config playbook/sync-cursor.config.json --only rules
AI_PROJECT_ROOT=. node scripts/cursor-script/sync-cursor.mjs --config playbook/sync-cursor.config.json --only skills
```

产物写入 `.cursor/rules/ai-project-kit.mdc` 与 `.cursor/skills/ai-project-kit-framework/SKILL.md`。

## 维护原则

- 先改 `playbook/`，再执行 sync，最后提交 playbook 与 `.cursor/` 镜像。
- 业务阶段规则以 `templates/**/playbook/**` 为准；本目录不替代各工作组阶段规则。
