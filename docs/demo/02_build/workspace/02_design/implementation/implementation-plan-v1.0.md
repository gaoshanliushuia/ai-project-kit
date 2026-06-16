# 开发实现计划总入口 v1.0

项目：中学教务管理系统 Demo

阶段：详细设计与开发实现计划

## 1. 文档目标

本目录用于指导 AI-Agent 和开发人员把已确认的需求、架构、软件功能说明和数据库设计转化为可运行的前后端 Demo、数据库脚本、基础测试和本地部署脚本。

本文件只作为总入口和索引。跨模块共享的工程约束集中写在 `global-implementation-requirements-v1.0.md`，非功能性通用要求按主题拆分到 `common/` 下，具体业务实现要求按功能模块拆分到 `modules/` 下的独立文件。

## 2. 输入依据

| 输入产物 | 路径 | 使用方式 |
|----------|------|----------|
| 需求基线 | `01_req/workspace/03_baseline/requirements-baseline-v1.0.md` | 确认实现范围和 REQ 编号 |
| 需求追踪矩阵 | `01_req/workspace/03_baseline/requirements-traceability-v1.0.md` | 建立 REQ、DES、CODE、QA 映射 |
| 原型说明 | `01_req/workspace/02_prototypes/prototype-notes-v1.0.md` | 理解页面、菜单、字段和操作 |
| 架构设计 | `02_build/workspace/01_architecture/architecture-design-v1.0.md` | 确认前后端分离、单体后端、RBAC、REST API |
| 软件功能说明 | `02_build/workspace/02_design/software-function-spec-v1.0.md` | 作为功能范围、页面字段、权限和测试关注点输入 |
| 模块设计 | `02_build/workspace/02_design/02_modules/module-design-v1.0.md` | 确认模块职责、边界、依赖、输入输出 |
| 接口契约 | `02_build/workspace/02_design/03_interfaces/interface-contracts-v1.0.md` | 确认接口路径、方法、DTO、权限和错误码 |
| 流程设计 | `02_build/workspace/02_design/04_flows/business-flow-design-v1.0.md` | 确认主流程、异常流程和人工确认点 |
| 状态与规则设计 | `02_build/workspace/02_design/05_states/state-and-rule-design-v1.0.md` | 确认状态流转、唯一性、范围约束和跨模块规则 |
| 数据库设计 | `02_build/workspace/03_database/database-design-v1.0.md` | 生成 Entity、Repository、DDL、初始化数据 |
| 编码规范 | `02_build/playbook/04_codebase/rules/CODING_RULE.md` | 约束命名、注释、分包、代码风格 |

## 3. 实施边界

必须实现：登录、主页、学生管理、班级管理、教师管理、学生课程管理、学生成绩管理。

不实现：排课算法、在线选课、家长端、学生端、复杂成绩统计分析、第三方统一身份认证、生产级权限审计和操作日志。

Demo 可简化：登录认证可使用简单 Token 或 Session 模拟；用户角色可由初始化数据内置；数据库可使用 SQLite、H2、MySQL 或 PostgreSQL 中一种；部署可使用本地脚本或 Docker Compose。

## 4. 推荐技术栈

| 层 | 推荐技术 | 说明 |
|----|----------|------|
| 前端 | Vue 3 + Vite | 与需求原型衔接，便于快速生成页面 |
| 后端 | Spring Boot 或 Node.js Express | Demo 可二选一，必须保留 Controller、Service、Repository、DTO、Entity/Model 分层 |
| 数据库 | PostgreSQL 或 MySQL | 关系型数据结构清晰 |
| 本地部署 | Docker Compose 或本地启动脚本 | 支持数据库、后端、前端一起启动 |
| 测试 | JUnit / Vitest / 接口脚本 | 覆盖关键规则和边界值 |

## 5. 目标工程结构

```text
school-edu-system/
├── frontend/
├── backend/
├── database/
├── deploy/
├── docs/
└── README.md
```

## 6. 全局要求文件

全局工程、接口、数据、权限、测试和部署要求统一维护在：

- `global-implementation-requirements-v1.0.md`

模块文件不得重复展开全局规则，只引用并遵循该文件。

## 7. 通用要求文件索引

`common/` 用于保存所有非具体业务功能的通用设计要求。代码生成时必须先读取这些文件，再生成具体模块代码。

| 主题 | 文件 | 适用范围 | 人工审查点 |
|------|------|----------|------------|
| 全局界面风格 | `common/ui-style-global-requirements.md` | 所有前端页面、布局、表单、表格、弹窗、按钮和提示 | 页面布局、颜色、状态展示、表单反馈是否一致 |
| 交互体验与可访问性 | `common/interaction-accessibility-requirements.md` | 所有前端交互、错误提示、弹窗、菜单和列表操作 | 加载、错误、确认、键盘访问和基础可访问性是否完整 |
| 安全日志与可观测性 | `common/security-observability-requirements.md` | 所有后端接口、前端 API、配置、部署脚本和运行说明 | 权限、敏感信息、日志、错误处理和启动验证是否达标 |

## 8. 模块文件索引

| CODE | 模块 | 模块文件 | 关联需求 | 关联设计 | 关联数据 | 依赖 |
|------|------|----------|----------|----------|----------|------|
| CODE-001 | 登录与当前用户 | `modules/CODE-001-authentication.md` | REQ-001 | DES-001 | DB-001, DB-002 | 无 |
| CODE-002 | 主页与菜单 | `modules/CODE-002-dashboard.md` | REQ-002 | DES-002 | DB-001, DB-002 | CODE-001 |
| CODE-003 | 学生管理 | `modules/CODE-003-student-management.md` | REQ-003 | DES-003 | DB-003, DB-004 | CODE-001, CODE-004 |
| CODE-004 | 班级管理 | `modules/CODE-004-class-management.md` | REQ-004 | DES-004 | DB-004, DB-005 | CODE-001, CODE-005 |
| CODE-005 | 教师管理与任课关系 | `modules/CODE-005-teacher-management.md` | REQ-005 | DES-005 | DB-005, DB-006, DB-007 | CODE-001 |
| CODE-006 | 学生课程管理 | `modules/CODE-006-student-course-management.md` | REQ-006 | DES-006 | DB-008 | CODE-003, CODE-005 |
| CODE-007 | 学生成绩管理 | `modules/CODE-007-score-management.md` | REQ-007 | DES-007 | DB-009 | CODE-003, CODE-005, CODE-006 |

## 9. AI-Agent 生成顺序

1. 读取本总入口和全局实现要求。
2. 读取 `common/` 下所有非功能性通用要求。
3. 生成项目骨架和根 README。
4. 生成数据库脚本和初始化数据。
5. 生成后端 common、异常、响应、权限上下文。
6. 按 `modules/` 文件逐个生成业务模块，每次只生成一个模块。
7. 生成前端路由、布局、API 封装和业务页面。
8. 生成关键测试。
9. 生成部署脚本和本地启动说明。
10. 人工运行、审查、修复和记录问题。

## 10. AI-Agent 提示词模板

### 10.1 生成项目骨架

```text
请读取：
1. 02_build/workspace/02_design/implementation/implementation-plan-v1.0.md
2. 02_build/workspace/02_design/implementation/global-implementation-requirements-v1.0.md
3. 02_build/workspace/02_design/implementation/common/
4. 02_build/workspace/02_design/software-function-spec-v1.0.md
5. 02_build/workspace/03_database/database-design-v1.0.md
6. 02_build/playbook/04_codebase/rules/CODING_RULE.md

请生成中学教务管理系统 Demo 的前后端项目骨架、数据库脚本目录和 deploy 目录。先不要实现全部业务逻辑，只生成可运行骨架和 README。
```

### 10.2 生成单个业务模块

```text
请读取全局实现要求、common 通用要求和当前模块文件：
1. 02_build/workspace/02_design/implementation/global-implementation-requirements-v1.0.md
2. 02_build/workspace/02_design/implementation/common/
3. 02_build/workspace/02_design/implementation/modules/{当前模块文件}.md

请只生成当前模块相关的前端页面、API 封装、后端 Controller、Service、Repository、Entity、DTO 和必要测试，不要同时生成其他业务模块。
```

### 10.3 生成部署脚本

```text
请基于全局实现要求中的部署与运行脚本要求生成本地部署脚本、env.example、启动说明和访问地址。
```

## 11. 人工审查清单

| 检查项 | 是否必须 |
|--------|----------|
| 是否覆盖 REQ-001 至 REQ-007 | 是 |
| 是否引用 DES-001 至 DES-007 | 是 |
| 是否实现数据字段和约束 | 是 |
| 是否存在越权查询或越权写入 | 是 |
| 是否只依赖前端校验 | 是 |
| 是否有硬编码密码或敏感信息 | 是 |
| 是否能本地启动 | 是 |
| 是否有基础测试或验证脚本 | 是 |
| 是否有部署说明 | 是 |
| 是否遵循 `common/` 下非功能性通用要求 | 是 |

## 12. 本阶段输出

| 产物 | 建议位置 |
|------|----------|
| 开发实现计划总入口 | `02_build/workspace/02_design/implementation/implementation-plan-v1.0.md` |
| 全局实现要求 | `02_build/workspace/02_design/implementation/global-implementation-requirements-v1.0.md` |
| 非功能性通用要求 | `02_build/workspace/02_design/implementation/common/` |
| 模块级开发实现文档 | `02_build/workspace/02_design/implementation/modules/` |
| 前后端源码 | 实际代码仓库或 `02_build/workspace/04_codebase/` 下的示例目录 |
| 数据库脚本 | 代码工程中的 `database/` |
| 部署脚本 | 代码工程中的 `deploy/` |
| 构建、测试、评审和运行材料 | `02_build/workspace/04_codebase/` |

## 13. 交接说明

交给代码阶段：先引用 `02_design` 下的软件功能说明、模块设计、接口契约、流程设计、状态与规则设计，再引用本目录下的总入口、全局要求、`common/` 非功能性通用要求和模块级开发实现文档。

交给测试阶段：可运行版本或源码位置、前端启动方式、后端启动方式、数据库初始化方式、测试账号和角色说明、已知问题清单、REQ/DES/CODE 映射关系、权限和成绩等关键测试关注点。
