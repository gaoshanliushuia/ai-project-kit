# workspace 目录说明（需求组）

`workspace` 是需求组的执行区。

## 本组目录

```text
workspace/
└── 01_requirements/     需求分析、原型、基线、追踪
```

## 总体原则

- 正式输出必须带版本、负责人、日期和 REQ 编号。
- 默认只创建到 `01_requirements/` 这一层；更细的子目录按本级 README 建议按需创建。
- 需求基线和交接材料应放在 `01_requirements/` 内的建议子目录中统一管理。
- AI 使用记录在 `05_gov/workspace/01_governance/` 内建议的治理子目录登记，并标注来源组 `01_req`。

## 推荐工作方式

1. 在 `01_requirements/` 完成分析与评审。
2. 基线化后整理到 `01_requirements/` 内建议的基线或交接目录。
3. 通知实施组引用对应需求基线版本。
