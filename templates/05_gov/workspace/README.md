# workspace 目录说明（AI 治理组）

`workspace` 保存跨组的 AI 治理留痕与 Metrics。

## 目录

```text
workspace/
├── 01_usage-log/        按组/阶段记录 AI 使用（标注 01_req / 02_build / 03_qa / 04_delivery）
├── 02_prompt-reviews/   Prompt 审查
├── 03_security-checks/    数据安全与脱敏检查
├── 04_code-reviews/       AI 辅助代码 Review
├── 05_output-acceptance/  AI 输出人工验收
├── 06_metrics/            跨组 AI 参与度与研发活动指标
└── 07_retrospective/      经验复盘与最佳实践
```

## 推荐文件

- `01_usage-log/ai-usage-log.md`
- `02_prompt-reviews/prompt-review-record.md`
- `05_output-acceptance/ai-output-acceptance.md`
- `06_metrics/project-ai-metrics.md`
- `07_retrospective/ai-governance-retrospective.md`

## Metrics 建议统计

- 各组需求/设计/代码/测试项数量
- AI 参与项数量
- Review 与验收次数
- 缺陷与变更数量（可与 03_qa 交叉引用）

Metrics 不追求精确工时，重点观察 AI 成熟度。

## 与各业务组的关系

业务组负责交付物；`05_gov` 负责 AI 相关的过程合规与质量证据。每条记录应能关联到业务编号（REQ、DES、DEF、CR）及来源组。
