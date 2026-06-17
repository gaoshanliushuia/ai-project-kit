# playbook 目录说明（实施组）

`playbook` 是实施组的标准库，覆盖架构到版本发布的全过程。

## 本组阶段

```text
playbook/
├── 01_architecture/
├── 02_design/
├── 03_code/
└── 04_release/
```

## 阶段关系

```text
需求基线
    -> 01_architecture
    -> 02_design（生成软件功能说明、UI 设计、数据库设计和开发实现计划）
    -> 03_code（读取开发实现计划并生成代码）
    -> 04_release
    <- 03_qa/workspace/01_testing/ 测试结论
    <- 04_change/workspace/ 变更回传事项
    -> 05_delivery/playbook/01_delivery
```

AI 治理见 `06_gov/playbook/01_governance/`。

## 使用原则

- 所有产出必须能追踪到 REQ 编号。
- 只引用需求组已确认的需求基线，并在对应阶段目录记录来源版本。
- 开发实现计划和数据库设计由 `02_design` 阶段生成，公共文件合并放入 `02_build/workspace/02_design/common/`，模块级实现说明放入 `02_build/workspace/02_design/modules/`，数据库设计、ER 图、脚本和回滚说明放入 `02_build/workspace/02_design/database/`。
- 代码阶段 Prompt 由 `03_code` 阶段维护，统一放入 `02_build/playbook/03_code/prompts/PROMPT.md`，同时覆盖任务拆分、验证交接和可运行代码生成。
- `03_code` 工作区只保存源码、脚本、构建、测试、评审和运行材料，不保存实现计划文档。
- 发布阶段需要向 `05_delivery` 输出可验收、可移交、可运维的交付基线。
- AI 留痕写入 `06_gov/workspace/`。

