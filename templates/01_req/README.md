# 01_req（需求组）

需求组负责需求收集、分析、原型、基线与追踪矩阵，并向实施组输出 handoff。

## 本组阶段

| 编号 | 目录 | 职责 |
|------|------|------|
| 01 | `01_requirements` | 需求收集与需求分析 |

AI 治理不在本组维护，统一写入 `05_gov/workspace/`。

## 目录结构

```text
01_req/
├── README.md
├── playbook/
│   ├── README.md
│   └── 01_requirements/
└── workspace/
    ├── README.md
    ├── 01_requirements/
    └── handoff/        ← 向 02_build 输出的基线出口
```

## 下游交接

需求基线化后，将以下内容写入 `workspace/handoff/`（建议按版本分子目录，如 `requirements-v1.0/`）：

- 已确认需求基线
- 原型基线
- 需求追踪矩阵
- 评审结论摘要

实施组从 `02_build/workspace/imports/req/` 引用。

## AI 治理

凡在本组使用 AI 参与关键活动，在 `05_gov/workspace/01_usage-log/` 等处登记，并注明来源组 `01_req`。
