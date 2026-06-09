# 01 测试与质量保证

## 本阶段目录用途

用于保存测试策略、测试设计、测试数据、执行记录、缺陷、回归和质量报告。这里的材料应能说明“测了什么、没测什么、结果如何、风险是什么”。

## 建议目录

```text
01_strategy/          测试范围、类型、优先级、资源和退出标准
02_cases/             测试用例、场景、步骤、期望结果和覆盖关系
03_test-data/         测试数据准备、账号、数据脚本和清理方式
04_execution/         测试执行记录、版本、环境和结果
05_defects/           缺陷记录、复现步骤、影响范围和复测结果
06_regression/        回归范围、回归用例和执行结果
07_reports/           测试日报、质量报告和发布建议
08_traceability/      需求、设计、用例和缺陷追踪矩阵
```

## 推荐文件

- `01_strategy/test-strategy.md`
- `02_cases/test-case-list.md`
- `04_execution/test-execution-record.md`
- `05_defects/defect-register.md`
- `07_reports/quality-report.md`

## 阶段完成标志

- 高优先级需求有对应测试用例。
- 阻塞和严重缺陷已关闭或获得风险接受。
- 测试报告明确发布建议、失败范围和遗留风险。
- 回归范围与本次变更影响范围一致。
