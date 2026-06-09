# 05_gov（AI 治理组）

AI 治理组服务于 `01_req`、`02_build`、`03_qa`、`04_delivery`，统一管理 AI 使用规范、审查、验收与 Metrics。它可以在项目交付后集中复盘，也可以在项目过程中持续留痕。

## 本组阶段

| 编号 | 目录 | 职责 |
|------|------|------|
| 01 | `01_governance`（playbook） | AI 使用治理与质量约束 |

workspace 按留痕类型分目录，不再与 playbook 一一编号对应。

## 目录结构

```text
05_gov/
├── playbook/
│   ├── README.md
│   └── 01_governance/
└── workspace/
    ├── README.md
    ├── 01_usage-log/
    ├── 02_prompt-reviews/
    ├── 03_security-checks/
    ├── 04_code-reviews/
    ├── 05_output-acceptance/
    ├── 06_metrics/
    └── 07_retrospective/
```

## 与其他组的关系

- **不替代** 业务交付；业务材料仍在 `01_req` / `02_build` / `03_qa` / `04_delivery`。
- **统一登记** 各组使用 AI 的关键活动、审查结论与验收记录。
- **Metrics** 在 `06_metrics/` 汇总跨组数据，观察 AI 成熟度。

## 建议阅读顺序

1. 本文件
2. `playbook/01_governance/README.md`
3. `workspace/README.md`
