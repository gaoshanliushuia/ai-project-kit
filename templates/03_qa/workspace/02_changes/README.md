# 02 变更与配置管理

## 本阶段目录用途

用于统一保存项目变更申请、影响分析、审批、实施、验证和关闭记录。这里是全项目变更的总账，受影响阶段目录中应保留变更编号引用。

## 建议目录

```text
01_requests/          变更申请、来源、原因、紧急程度和提出人
02_impact-analysis/   范围、成本、周期、质量、数据、接口和上线影响
03_approvals/         评审、审批、拒绝、延期和风险接受记录
04_implementation/    变更实施计划、执行记录和受影响项更新
05_verification/      变更验证、复测、回归和结果确认
06_configuration/     配置项、基线、版本和环境差异记录
07_closure/           关闭记录、复盘和后续改进
08_register/          变更台账和状态汇总
```

## 推荐文件

- `08_register/change-register.md`
- `01_requests/change-request-template.md`
- `02_impact-analysis/change-impact-analysis.md`
- `03_approvals/change-approval-record.md`
- `07_closure/change-closure-record.md`

## 阶段完成标志

- 每个变更有编号、状态、负责人和影响范围。
- 已批准变更同步更新受影响阶段。
- 紧急变更补齐事后评审和风险说明。
- 关闭前完成验证、文档同步和基线更新确认。
