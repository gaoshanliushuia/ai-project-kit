# workspace 目录说明（实施组）

`workspace` 是实施组的执行区。

## 本组目录

```text
workspace/
├── 01_architecture/
├── 02_design/
├── 03_database/
├── 04_codebase/
└── 05_release/
```

## 总体原则

- 默认只创建到阶段目录这一层；更细的子目录按各阶段 README 建议按需创建。
- 不直接修改需求基线；如需引用需求材料，在对应阶段目录内记录来源版本。
- 处理测试变更组回传项时，在本组对应阶段留修复记录。
- AI 使用记录在 `06_gov/workspace/` 登记，并标注来源组 `02_build`。

## 推荐工作方式

1. 确认需求基线版本，并在 `01_architecture/` 或相关阶段目录内记录引用来源。
2. 按 `01`~`05` 顺序推进。
3. 定期处理测试变更组反馈。
4. 发布完成后，将交付所需材料移交到 `05_delivery/workspace/01_delivery/`。
