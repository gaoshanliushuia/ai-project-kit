# 04 代码实现与工程管理

## 本阶段目录用途

用于保存开发任务、代码实现证据、构建记录、代码评审、缺陷修复、配置和技术债。这里不替代源码仓，而是保存实施过程中的管理和追踪材料。

## 建议目录

```text
01_tasks/             开发任务拆分、负责人、状态和关联设计项
02_implementation/    关键实现说明、提交摘要和实现证据
03_builds/            构建命令、构建记录、产物编号和失败记录
04_configs/           配置项、环境变量、依赖和运行说明
05_code-reviews/      代码评审记录、问题清单和复审结论
06_defects/           开发阶段缺陷、修复记录和复测说明
07_tech-debt/         技术债、临时方案、风险和后续计划
08_handoff/           交给测试和发布的说明
```

## 推荐文件

- `01_tasks/development-task-board.md`
- `02_implementation/key-implementation-notes.md`
- `03_builds/build-records.md`
- `04_configs/runtime-configurations.md`
- `08_handoff/test-release-handoff.md`

## 阶段完成标志

- 开发任务可追踪到需求或设计项。
- 关键构建、检查和验证结果有记录。
- 代码评审问题已关闭或记录为遗留风险。
- 测试和发布能取得版本、配置、入口和已知问题。
