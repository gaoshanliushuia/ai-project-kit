# 02_build（实施组）

实施组负责架构、详细设计（含数据库设计）、代码实现与版本发布。

## 本组阶段

| 编号 | 目录 | 职责 |
|------|------|------|
| 01 | `01_architecture` | 系统架构设计 |
| 02 | `02_design` | 详细设计、UI 设计、数据库设计与开发实现计划 |
| 03 | `03_code` | 代码生成、实现与工程管理 |
| 04 | `04_release` | 版本发布与迭代 |

AI 治理统一在 `06_gov/` 维护。

## 目录结构

```text
02_build/
├── playbook/    01_architecture、02_design、03_code、04_release
└── workspace/
    ├── 01_architecture/
    ├── 02_design/    common、modules、interfaces、database
    ├── 03_code/      01_source … 06_runtime
    └── 04_release/
```

## 协作

- **上游**：在对应阶段目录内记录引用的需求基线版本。
- **设计到代码**：`02_design` 产出开发实现计划、模块级实现文档和 `database/` 数据库设计产物，`03_code` 的 `agents/agent.md` 读取这些文档生成代码。
- **下游接收**：测试组输出测试结论，正式变更进入 `04_change/workspace/` 统一管理。
- **交付输出**：发布完成后，将版本、部署记录、测试结论、已知问题和验收范围交给 `05_delivery`。
- **治理**：AI 活动在 `06_gov/workspace/` 登记。
