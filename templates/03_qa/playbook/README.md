# playbook 目录说明（测试变更组）

`playbook` 是测试变更组的标准库。

## 本组阶段

```text
playbook/
├── 01_testing/
└── 02_changes/
```

## 阶段关系

```text
引用需求 + 实施基线
    -> 01_testing <-> 02_changes
    -> feedback/to-build/ -> 02_build
```

AI 治理见 `05_gov/playbook/01_governance/`。

## 使用原则

- 测试用例关联 REQ 编号。
- 变更关联 CR 编号与受影响 REQ/DES。
- 回传实施组时使用结构化 feedback。
- AI 留痕写入 `05_gov/workspace/`。
