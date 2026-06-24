# Cursor Rules / Skills 同步工具

将 playbook 下的 `rules/RULE.md` 与 `skills/SKILL.md` 同步到项目根 `.cursor/rules/` 与 `.cursor/skills/`，供 Cursor Agent 使用。

本目录 `cursor-script/` 集中存放 Cursor 相关辅助脚本、配置与 npm 命令。

## 目录结构

```text
cursor-script/
├── package.json              # npm 命令入口
├── sync-cursor.config.json   # rule/skill 映射配置
├── sync-cursor.mjs           # 同步脚本
└── README.md
```

## 前置条件

- 已安装 [Node.js](https://nodejs.org/)（建议 18+）

## 快速开始

在 **`framework/cursor-script/`** 目录下执行：

```bash
cd framework/cursor-script

# 同步全部 rule
npm run sync:rule

# 同步全部 skill
npm run sync:skill

# 只同步指定 rule（id 见 sync-cursor.config.json）
npm run sync:rule -- coding

# 只同步指定 skill
npm run sync:skill -- coding
```

在项目根目录执行（不进入子目录）：

```bash
npm --prefix framework/cursor-script run sync:rule
npm --prefix framework/cursor-script run sync:skill -- coding
```

> **注意：** 给 npm 脚本传参时必须写 `--`，否则参数不会传给同步脚本。

## 命令一览

| 命令 | 说明 |
|------|------|
| `npm run sync:rule` | 同步配置中**全部** rule |
| `npm run sync:rule -- <id>` | 只同步指定 rule id（可多个） |
| `npm run sync:skill` | 同步配置中**全部** skill |
| `npm run sync:skill -- <id>` | 只同步指定 skill id（可多个） |
| `npm run sync:rule:dry` | 预览 rule 同步，不写文件 |
| `npm run sync:skill:dry` | 预览 skill 同步，不写文件 |
| `npm run sync:rule:check` | 检查 rule 是否已与 playbook 一致（CI 可用） |
| `npm run sync:skill:check` | 检查 skill 是否已与 playbook 一致（CI 可用） |
| `npm run sync:validate` | 校验全部 source 路径并 dry-run 预览（不写入） |

### 附加 flag（写在 `--` 之后）

也可直接调用 Node 脚本（在 `cursor-script/` 下）：

```bash
node sync-cursor.mjs --only rules --dry-run
node sync-cursor.mjs --only skills coding --force
```

| flag | 说明 |
|------|------|
| `--dry-run` | 只打印将创建/更新/不变，不写文件 |
| `--force` | 即使内容 hash 相同也强制写入 |
| `--check-clean` | 若目标与源不一致则 exit 2（配合 `--dry-run` 用于检查） |

## 配置文件

映射关系在本目录 `sync-cursor.config.json`：

```json
{
  "rules": [
    {
      "id": "coding",
      "source": "02_build/playbook/03_code/rules/RULE.md",
      "target": ".cursor/rules/coding.mdc",
      "description": "...",
      "alwaysApply": false,
      "globs": ["02_build/playbook/03_code/**", "02_build/workspace/03_code/**"]
    }
  ],
  "skills": [
    {
      "id": "coding",
      "source": "02_build/playbook/03_code/skills/SKILL.md",
      "target": ".cursor/skills/coding/SKILL.md",
      "name": "coding",
      "description": "...",
      "governanceRule": "coding",
      "ruleSource": "02_build/playbook/03_code/rules/RULE.md",
      "playbookBase": "02_build/playbook/03_code"
    }
  ]
}
```

> `source` / `target` 路径均相对**项目根**（含 `01_req/`、`02_build/` 等六大工作组的那一层），不是相对 `framework/` 或 `cursor-script/`。脚本会自动识别：位于 `framework/cursor-script/` 时，项目根为 `framework` 的上一级。

### 字段说明

**rules**

| 字段 | 说明 |
|------|------|
| `id` | 命令行指定名称，如 `npm run sync:rule -- coding` |
| `source` | playbook 源文件（相对项目根） |
| `target` | 生成的 `.mdc` 路径 |
| `description` | Cursor rule frontmatter |
| `alwaysApply` | 是否全局生效 |
| `globs` | 文件匹配范围（数组，写入时用逗号连接） |

**skills**

| 字段 | 说明 |
|------|------|
| `id` | 命令行指定名称 |
| `source` | playbook 源 `SKILL.md` |
| `target` | `.cursor/skills/<name>/SKILL.md` |
| `name` | Cursor skill 名称 |
| `description` | 触发描述（Agent 据此判断是否选用） |
| `governanceRule` | 对应 rule 的 id（不含 `.mdc`） |
| `ruleSource` | playbook 中 RULE.md 路径（写入「使用要求」） |
| `playbookBase` | 阶段 playbook 根目录（写入回写路径） |

## 同步逻辑

### Rule

1. 读取 `source` 正文
2. 去掉 playbook 模板说明段（含「本目录保存…」）
3. 拼接 `description` / `alwaysApply` / `globs` frontmatter
4. 写入 `target`（内容未变则跳过，除非 `--force`）

### Skill

1. 读取 playbook `SKILL.md` 正文（去掉源 frontmatter）
2. 保留「目标 / 输入 / 输出 / 执行步骤」等主体
3. 用配置自动生成「使用要求」（指向 `.cursor/rules` 与 playbook 路径）
4. 写入 `name` / `description` frontmatter 到 `target`

## 新增 rule / skill 流程

### 新增 rule

1. 在 playbook 创建 `rules/RULE-xxx.md`（或 `RULE.md`）
2. 在 `sync-cursor.config.json` 的 `rules` 数组增加一条，填写 `id`、`source`、`target`、`globs` 等
3. 执行 `npm run sync:rule -- <新id>`

### 新增 skill

1. 在 playbook 创建 `skills/SKILL.md`（或子目录下的 `SKILL.md`）
2. 在 `sync-cursor.config.json` 的 `skills` 数组增加一条
3. 执行 `npm run sync:skill -- <新id>`

## 当前已注册的 id

### Rules

`requirements`, `architecture`, `design`, `coding`, `coding-standards`, `release`, `testing`, `changes`, `delivery`, `governance`

### Skills

`req-baseline`, `architect`, `design`, `coding`, `release`, `test`, `change`, `deliver`, `govern`

## 推荐工作流

1. 在 playbook 修改 `RULE.md` / `SKILL.md`，走评审与版本发布
2. 在 `framework/cursor-script/` 执行 `npm run sync:rule` / `npm run sync:skill`（或指定 id）
3. 将 playbook 与 `.cursor/` 变更一并提交 Git
4. 在 Cursor Settings → Rules / Skills 确认已识别

## 源与产物关系

| 类型 | 文档源（版本化） | Cursor 运行时 |
|------|------------------|---------------|
| Rule | `**/playbook/**/rules/RULE.md` | `.cursor/rules/*.mdc` |
| Skill | `**/playbook/**/skills/SKILL.md` | `.cursor/skills/*/SKILL.md` |

**playbook 是正文来源；`.cursor/` 是 Cursor 读取的运行时镜像。** 修改 playbook 后需执行 sync 才会更新 Agent 行为。
