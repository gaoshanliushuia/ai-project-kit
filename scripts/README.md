# AI 工具脚本

本目录存放各 AI IDE / 辅助工具的同步脚本。项目初始化时会**默认**将子目录复制到目标项目根目录，与 `01_req`、`02_build` 等工作组平级。

## 目录

| 子目录 | 说明 |
|--------|------|
| `cursor-script/` | 将 playbook 中的 rule / skill 同步到 `.cursor/` |
| `qoder-script/` | （预留）Qoder 等工具的 rule / skill 同步 |

## 初始化后的位置

```text
目标项目/
├── README.md
├── 01_req/
├── 02_build/
├── ...
├── cursor-script/     ← 来自本仓库 scripts/cursor-script/
└── qoder-script/      ← 未来添加后同样自动复制
```

各脚本的路径配置均相对**目标项目根**，详见各子目录 README。
