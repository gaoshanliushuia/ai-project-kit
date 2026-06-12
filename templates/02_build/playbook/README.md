# playbook 目录说明（实施组）

`playbook` 是实施组的标准库，覆盖架构到版本发布的全过程。

## 本组阶段

```text
playbook/
├── 01_architecture/
├── 02_design/
├── 03_database/
├── 04_codebase/
└── 05_release/
```

## 阶段关系

```text
需求基线
    -> 01_architecture
    -> 02_design（生成软件功能说明和开发实现计划）
    -> 03_database
    -> 04_codebase（读取开发实现计划并生成代码）
    -> 05_release
    <- 03_qa/workspace/02_changes/ 回传事项
    -> 04_delivery/playbook/01_delivery
```

AI 治理见 `05_gov/playbook/01_governance/`。

## 使用原则

- 所有产出必须能追踪到 REQ 编号。
- 只引用需求组已确认的需求基线，并在对应阶段目录记录来源版本。
- 开发实现计划由 `02_design` 阶段生成，放入 `02_build/workspace/02_design/implementation/`。
- 具体代码生成 Prompt 由 `04_codebase` 阶段维护，放入 `02_build/playbook/04_codebase/prompts/CODE_GENERATION_PROMPT.md`。
- `04_codebase` 工作区只保存源码、脚本、构建、测试、评审和运行材料，不保存实现计划文档。
- 发布阶段需要向 `04_delivery` 输出可验收、可移交、可运维的交付基线。
- AI 留痕写入 `05_gov/workspace/`。
