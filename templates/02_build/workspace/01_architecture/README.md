# 01 系统架构设计

## 本阶段目录用途

用于保存本项目的架构驱动因素、候选方案、正式架构、技术决策、风险和架构评审结果。这里的材料应能指导详细设计、数据库设计、开发和部署。

## 建议目录

```text
01_drivers/           架构驱动因素、质量属性、约束和优先级
02_context/           系统边界、上下游系统、用户入口和数据流
03_options/           候选方案、选型对比和取舍说明
04_decisions/         架构决策记录 ADR
05_diagrams/          上下文图、容器图、部署图、集成图
06_integration/       外部系统、协议、接口边界和依赖清单
07_risk-register/     架构风险、缓解措施和验证方案
08_reviews/           架构评审、问题清单和关闭记录
09_baseline/          已确认架构基线
```

## 推荐文件

- `01_drivers/architecture-drivers.md`
- `04_decisions/adr-index.md`
- `06_integration/external-dependencies.md`
- `07_risk-register/architecture-risks.md`
- `09_baseline/architecture-baseline-v<版本号>.md`

## 阶段完成标志

- 每个关键非功能需求都有架构应对策略。
- 外部系统依赖、协议、异常处理和责任边界已明确。
- 技术选型有备选方案和取舍理由。
- 架构风险已分级，并有缓解或验证计划。
