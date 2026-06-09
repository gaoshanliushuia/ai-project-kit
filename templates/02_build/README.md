# 02_build（实施组）

实施组负责架构、详细设计、数据库、代码实现与版本发布。

## 本组阶段

| 编号 | 目录 | 职责 |
|------|------|------|
| 01 | `01_architecture` | 系统架构设计 |
| 02 | `02_design` | 详细设计 |
| 03 | `03_database` | 数据库设计 |
| 04 | `04_codebase` | 代码实现与工程管理 |
| 05 | `05_release` | 版本发布与迭代 |

AI 治理统一在 `05_gov/` 维护。

## 目录结构

```text
02_build/
├── playbook/    01_architecture … 05_release
└── workspace/
    ├── 01_architecture/ … 05_release/
    └── imports/req/    ← 引用 01_req 的 handoff
```

## 协作

- **上游**：`imports/req/` 中的需求基线版本。
- **下游接收**：`03_qa/workspace/feedback/to-build/`。
- **交付输出**：发布完成后，将版本、部署记录、测试结论、已知问题和验收范围交给 `04_delivery`。
- **治理**：AI 活动在 `05_gov/workspace/` 登记。
