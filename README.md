# ai-project-kit

`ai-project-kit` 是一个面向 AI 辅助研发全过程的项目框架仓库。这个仓库本身负责维护模板源、初始化脚本、示例 demo 和 Cursor 规则/技能同步，而不是承载具体项目的阶段产物。

## 仓库职责

- `templates/` 是模板源头，`templates/README.md` 会被 `init` 复制到目标项目根目录。
- `docs/demo/` 是完整案例，结构要和模板初始化结果保持一致。
- `playbook/` 是本仓库框架维护用的规则/技能源。
- `ai-project-kit.js` 负责把模板初始化到目标目录。
- `scripts/` 里包含同步和示例维护脚本。

## 快速使用

初始化完整项目：

```bash
npm run init <target> all
```

只初始化某个工作组：

```bash
npm run init <target> req
npm run init <target> build
npm run init <target> qa
npm run init <target> change
npm run init <target> delivery
npm run init <target> gov
```

本地冒烟验证：

```bash
npm run init .tmp/bootstrap-test all
```

更新 demo 案例：

```bash
npm run regenerate:demo
```

## 维护顺序

修改框架标准时，优先改 `templates/`，再做初始化验证，最后同步 `docs/demo/`：

1. 先更新模板内容。
2. 用 `npm run init .tmp/bootstrap-test all` 验证初始化结果。
3. 需要时再同步 `docs/demo/` 的案例内容。
4. playbook 规则或技能改动后，执行对应同步脚本。

## Cursor 同步

本仓库提供框架级 Cursor 规则和技能同步能力：

```bash
npm run sync:kit-rule
npm run sync:kit-skill
```

如果是在目标项目内同步阶段级规则/技能，请按该项目的同步脚本和配置执行。

## 目录概览

```text
ai-project-kit/
├── README.md
├── ai-project-kit.js
├── templates/
├── docs/
├── playbook/
└── scripts/
```

## 版本说明

- v0.1.0: 初始公开版。

