# 02 详细设计

## 本阶段目录用途

用于保存模块设计、接口契约、流程、状态、异常和设计评审材料。这里的材料应能直接拆分开发任务，并为测试用例提供依据。

## 建议目录

```text
01_modules/           模块职责、边界、依赖和任务拆分依据
02_interfaces/        API、事件、消息、错误码和字段契约
03_flows/             主流程、分支流程、异常流程和补偿流程
04_states/            状态机、状态流转规则和禁止流转场景
05_rules/             业务规则、计算规则、校验规则和权限规则
06_exceptions/        异常处理、重试、幂等、降级和回滚设计
07_test-points/       可测试点、用例设计依据和风险场景
08_reviews/           设计评审、问题清单和关闭记录
09_baseline/          已确认设计基线
```

## 推荐文件

- `01_modules/module-design.md`
- `02_interfaces/interface-contracts.md`
- `04_states/state-machine.md`
- `06_exceptions/error-handling.md`
- `07_test-points/design-test-points.md`

## 阶段完成标志

- 设计项可映射到需求编号和架构决策编号。
- 核心接口字段、错误码、鉴权、超时和幂等规则已定义。
- 关键流程覆盖异常、补偿和回滚路径。
- 开发和测试能基于设计材料开始工作。
