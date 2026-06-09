# 03 数据库设计

## 本阶段目录用途

用于保存数据模型、字段字典、脚本、迁移、容量、数据质量和数据评审材料。这里的材料应能支撑开发、测试、发布和后续运维。

## 建议目录

```text
01_models/            概念模型、逻辑模型、物理模型和 ER 图
02_dictionary/        表结构、字段字典、枚举、主外键和约束
03_scripts/           DDL、DML、初始化、迁移和回滚脚本
04_migration/         迁移计划、执行顺序、校验和回滚说明
05_data-quality/      数据质量规则、校验脚本和异常数据处理
06_capacity/          容量评估、索引设计、归档和备份策略
07_security/          敏感字段、脱敏、权限和审计要求
08_reviews/           数据库评审、问题清单和关闭记录
09_baseline/          已确认数据库设计基线
```

## 推荐文件

- `02_dictionary/table-field-dictionary.md`
- `03_scripts/script-execution-order.md`
- `04_migration/migration-plan.md`
- `06_capacity/index-and-capacity-plan.md`
- `07_security/sensitive-data-list.md`

## 阶段完成标志

- 核心表字段字典完整，并能映射到业务对象或接口字段。
- 脚本有执行顺序、适用环境和回滚说明。
- 关键查询、索引、容量和归档策略已说明。
- 敏感字段和审计字段已标注。
