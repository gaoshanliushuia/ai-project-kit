# workspace 目录说明（实施组）

`workspace` 是实施组的执行区。

## 本组目录

```text
workspace/
├── 01_architecture/ … 05_release/
└── imports/
    └── req/             引用 01_req 的 handoff（只读）
```

## 总体原则

- 不直接在 `imports/req/` 中修改需求。
- 处理 `03_qa/feedback/to-build/` 回传项时，在本组对应阶段留修复记录。
- AI 使用记录在 `05_gov/workspace/` 登记，并标注来源组 `02_build`。

## 推荐工作方式

1. 确认 `imports/req/` 中的需求基线版本。
2. 按 `01`~`05` 顺序推进。
3. 定期处理测试变更组 feedback。
4. 发布完成后，将交付所需材料移交到 `04_delivery/workspace/01_delivery/`。
