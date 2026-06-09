# workspace 目录说明（测试变更组）

`workspace` 是测试变更组的执行区。

## 本组目录

```text
workspace/
├── 01_testing/
├── 02_changes/
└── feedback/
    └── to-build/        向 02_build 回传
```

## 总体原则

- 缺陷、变更必须有唯一编号（DEF、CR）。
- `feedback/to-build/` 内容应结构化并引用 REQ/DES。
- AI 使用记录在 `05_gov/workspace/` 登记，并标注来源组 `03_qa`。

## 推荐工作方式

1. 基于需求与实施基线编写测试材料。
2. 变更统一在 `02_changes/` 管理。
3. 需实施组处理的事项写入 `feedback/to-build/`。
