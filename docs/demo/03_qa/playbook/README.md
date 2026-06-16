# playbook 目录说明（测试组）

`playbook` 是测试组的标准库。

## 本组阶段

```text
playbook/
└── 01_testing/
```

## 阶段关系

```text
引用需求 + 实施基线
    -> 01_testing
    -> 测试结论 / 缺陷复测 / 发布建议 -> 02_build / 04_change
```

AI 治理见 `06_gov/playbook/01_governance/`。

## 使用原则

- 测试用例关联 REQ 编号。
- 缺陷、测试结论和发布建议应结构化回传。
- 如需正式变更控制，应进入 `04_change/` 组处理。
- AI 留痕写入 `06_gov/workspace/`。
