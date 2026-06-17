# 01_req（需求组）

需求组负责需求收集、原型与需求基线签发，向 `workspace/03_baseline/` 输出已确认的需求基线。

## 本组阶段

| 编号 | 目录 | 职责 |
|------|------|------|
| 01 | `workspace/01_inputs` | 原始会议、调研、访谈和业务材料 |
| 02 | `workspace/02_prototypes` | 原型、页面流转和交互说明 |
| 03 | `workspace/03_baseline` | 已签发需求基线和下游引用材料 |

AI 治理不在本组维护，统一写入 `06_gov/workspace/`。

## 目录结构

```text
01_req/
├── README.md
├── playbook/
│   ├── README.md
│   └── 01_requirements/
└── workspace/
    ├── README.md
    ├── 01_inputs/
    ├── 02_prototypes/
    └── 03_baseline/
```

## 下游引用

需求基线化后，将以下内容写入 `workspace/03_baseline/`：

- 已确认需求基线
- 原型基线
- 需求追踪关系
- 待确认事项和评审结论摘要

实施组在对应阶段目录内记录引用的需求基线版本。

## AI 治理

凡在本组使用 AI 参与关键活动，在 `06_gov/workspace/01_governance/` 内建议的治理子目录登记，并注明来源组 `01_req`。
