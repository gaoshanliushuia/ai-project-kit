# playbook 目录说明（AI 治理组）

`playbook` 定义项目级 AI 使用治理标准，供 `01_req`、`02_build`、`03_qa` 共同遵循。

## 本组内容

```text
playbook/
└── 01_governance/    AI 使用治理与质量约束
```

## 使用原则

- 治理责任由人承担；Agent 只能辅助生成检查清单与初稿。
- 涉及敏感数据的 AI 使用必须先完成安全检查或脱敏确认。
- 各业务组在 `05_gov/workspace/` 留痕，不在业务组内重复维护治理副本。

## 可量化标准

- 关键 AI 使用场景均有记录。
- AI 生成的重要输出已完成审查与验收。
- `workspace/01_governance/` 内建议的 Metrics 子目录能反映跨组 AI 参与度。
