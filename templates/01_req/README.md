# 01_req（需求组）

需求组负责需求收集、分析、原型、基线与追踪矩阵，并向实施组输出已确认的需求基线。

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
    └── 01_requirements/
```

## 下游交接

需求基线化后，将以下内容写入 `workspace/01_requirements/` 内建议的基线或交接子目录：

- 已确认需求基线
- 原型基线
- 需求追踪矩阵
- 评审结论摘要

实施组在对应阶段目录内记录引用的需求基线版本。

## AI 治理

凡在本组使用 AI 参与关键活动，在 `05_gov/workspace/01_governance/` 内建议的治理子目录登记，并注明来源组 `01_req`。
