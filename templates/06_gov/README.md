# 06_gov（AI 治理组）

AI 治理组服务于 `01_req`、`02_build`、`03_qa`、`04_change`、`05_delivery`，统一管理 AI 使用规范、审查、验收与 Metrics。它可以在项目交付后集中复盘，也可以在项目过程中持续留痕。

## 本组阶段

| 编号 | 目录 | 职责 |
|------|------|------|
| 01 | `01_governance` | AI 使用治理与质量约束 |

`workspace` 与 `playbook` 对应，默认只创建 `01_governance/`；具体留痕类型作为本级 README 中的建议子目录按需创建。

## 目录结构

```text
06_gov/
├── playbook/
│   ├── README.md
│   └── 01_governance/
└── workspace/
    ├── README.md
    └── 01_governance/
```

## 与其他组的关系

- **不替代** 业务交付；业务材料仍在 `01_req` / `02_build` / `03_qa` / `04_change` / `05_delivery`。
- **统一登记** 各组使用 AI 的关键活动、审查结论与验收记录。
- **Metrics** 在 `workspace/01_governance/` 内建议的 Metrics 子目录汇总跨组数据，观察 AI 成熟度。

## 建议阅读顺序

1. 本文件
2. `playbook/01_governance/README.md`
3. `playbook/01_governance/rules/RULE.md`
4. 若使用 Cursor 并已 sync：`.cursor/rules/governance.mdc`；其他 IDE 请接入同路径 playbook 规则
