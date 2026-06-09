# 05 版本发布与迭代

## 本阶段目录用途

用于保存版本计划、发布范围、构建产物记录、环境准备、部署验证、回滚方案和发布复盘。这里的材料应能支持可重复发布和问题追溯。

## 建议目录

```text
01_plans/             版本计划、发布范围、排除项和上线窗口
02_artifacts/         构建产物记录、校验值、来源分支和版本号
03_environments/      环境准备、配置差异、权限和依赖检查
04_deployment/        部署步骤、脚本顺序、执行记录和负责人
05_rollback/          回滚方案、触发条件、演练记录和补偿措施
06_verification/      发布验证清单、结果和异常处理
07_known-issues/      已知问题、风险接受和后续处理
08_retrospective/     发布复盘和下一轮迭代建议
```

## 推荐文件

- `01_plans/release-plan-v<版本号>.md`
- `04_deployment/deployment-runbook.md`
- `05_rollback/rollback-plan.md`
- `06_verification/release-verification.md`
- `08_retrospective/release-retrospective.md`

## 阶段完成标志

- 发布范围、版本号、构建产物和配置项已确认。
- 发布前检查和发布验证有结果记录。
- 回滚方案可执行，并有明确触发条件。
- 发布问题进入缺陷、变更或复盘清单。
