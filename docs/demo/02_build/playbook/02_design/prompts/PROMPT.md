# 详细设计 Prompt

## 使用场景

请基于需求基线、可运行原型、页面说明和架构设计，生成详细设计阶段的设计文档集。设计文档必须足够指导后续开发实现计划、数据库设计和测试设计，不能只写模块概述。

本 Prompt 只用于生成 `02_build/workspace/02_design/` 下的设计文档。开发实现计划是这些设计文档的下游产物，应使用同目录下的 `IMPLEMENTATION_PLAN_PROMPT.md` 另行生成到 `02_build/workspace/02_design/implementation/`。

## Prompt 模板

```text
你是 Architect Agent / Developer Agent，正在执行 ai-project-kit 的「详细设计」阶段。

请先遵循本阶段 playbook 和 rules，基于下面输入材料生成详细设计文档集初稿。

输入材料：
{粘贴或引用需求基线、需求追踪矩阵、页面原型说明、可运行原型、架构设计、权限模型、业务规则、待确认问题}

请按以下文件结构输出：
1. `02_build/workspace/02_design/software-function-spec-v1.0.md`：软件功能说明文档，说明每个 DES 功能的页面、接口、字段、权限、异常、测试关注点和 AI 代码生成注意事项。
2. `02_build/workspace/02_design/02_modules/module-design-v1.0.md`：模块设计文档，说明模块职责、边界、依赖、输入输出和跨模块协作。
3. `02_build/workspace/02_design/03_interfaces/interface-contracts-v1.0.md`：接口契约文档，集中定义接口路径、方法、请求 DTO、响应 DTO、权限、错误码和分页规则。
4. `02_build/workspace/02_design/04_flows/business-flow-design-v1.0.md`：流程设计文档，说明主流程、异常流程、补偿流程和人工确认点。
5. `02_build/workspace/02_design/05_states/state-and-rule-design-v1.0.md`：状态与规则设计文档，说明状态字段、状态流转、禁止流转、唯一性、范围约束和跨模块业务规则。

每个设计文档必须包含：
- 文档目标：说明该设计文档如何服务下游开发实现计划、数据库设计和测试设计。
- 输入依据：列出需求、原型、架构和版本来源。
- 设计内容：写到开发人员、测试人员和 AI-Agent 可执行的粒度。
- 追踪关系：建立 REQ、ARCH、DES、DB、CODE、QA 的映射或引用。
- 设计评审清单：列出必须人工确认的接口、权限、业务规则和异常口径。
- 下游交接：明确哪些内容交给数据库设计、开发实现计划和测试阶段。

输出要求：
- 不要编造未确认的业务规则。
- 对假设内容使用“假设”标记，对待确认内容使用“待确认”标记。
- 每个高优先级 REQ 必须有 DES 设计项。
- 每个功能章节必须具体到字段、接口、权限、异常、测试和 AI 代码生成要求。
- 接口契约必须包含路径、方法、参数、返回、错误码和权限要求。
- 数据约束必须写清唯一性、必填、枚举、状态、范围和跨表规则。
- 设计文档必须先落在 `02_build/workspace/02_design/` 下；不得跳过设计文档直接生成 implementation-plan。
- implementation-plan 是设计文档的下游产物，必须基于上述设计文档集生成，不能替代设计文档本身。
- 文档必须能直接作为 implementation-plan、数据库设计和测试用例设计的输入。
```

## 使用后检查

- 是否每个功能都有独立 DES 章节。
- 是否包含页面字段、接口契约、权限规则和异常场景。
- 是否提供请求/响应样例和测试关注点。
- 是否能指导 AI-Agent 生成前后端代码而不偏离需求。
- 是否先生成了详细设计文档集，而不是直接生成 implementation-plan。
- 是否明确 implementation-plan 是设计文档的下游产物。
- 是否明确数据库、编码、测试的下游输入。
