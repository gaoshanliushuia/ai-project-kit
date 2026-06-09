# workspace 目录说明（需求组）

`workspace` 是需求组的执行区。

## 本组目录

```text
workspace/
├── 01_requirements/     需求分析、原型、基线、追踪
└── handoff/             向 02_build 输出的已确认基线
```

## 总体原则

- 正式输出必须带版本、负责人、日期和 REQ 编号。
- `handoff/` 只放已签发基线，不放过程稿。
- AI 使用记录在 `05_gov/workspace/01_usage-log/` 登记，并标注来源组 `01_req`。

## 推荐工作方式

1. 在 `01_requirements/` 完成分析与评审。
2. 基线化后整理到 `handoff/requirements-v<版本号>/`。
3. 通知实施组更新 `02_build/workspace/imports/req/`。
