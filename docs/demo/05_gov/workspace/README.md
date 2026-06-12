# workspace 目录说明（AI 治理组）

`workspace` 保存跨组的 AI 治理留痕与 Metrics。

## 本组目录

```text
workspace/
└── 01_governance/    AI 使用治理与质量证据
```

## 总体原则

- 默认只创建到 `01_governance/` 这一层；更细的子目录按本级 README 建议按需创建。
- 治理目录用于沉淀 AI 使用记录、Prompt 审查、安全检查、代码审查、输出验收、Metrics 和复盘。
- 每条记录应能关联到业务编号（REQ、DES、DEF、CR）及来源组。

## Metrics 建议统计

- 各组需求/设计/代码/测试项数量
- AI 参与项数量
- Review 与验收次数
- 缺陷与变更数量（可与 03_qa 交叉引用）

Metrics 不追求精确工时，重点观察 AI 成熟度。

