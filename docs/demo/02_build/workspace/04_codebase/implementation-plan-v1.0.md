# 编码实现与 AI 代码生成实施说明 v1.0

项目：中学教务管理系统 Demo

阶段：代码实现与工程管理

## 1. 文档目标

本文件用于指导 AI-Agent 和开发人员基于需求基线、架构设计、软件功能说明和数据库设计，生成可运行的前后端 Demo 代码、基础测试和本地部署脚本。

本文件不是简单的开发任务清单，而是编码阶段的工程输入说明。AI-Agent 生成代码前应优先读取本文件，再读取详细设计、数据库设计和编码规范。

目标产出：

- 可运行的后端服务。
- 可运行的前端管理界面。
- 初始化数据库脚本。
- 本地运行配置。
- 基础部署脚本。
- 单元测试或接口验证样例。
- 代码生成和人工审查记录。

## 2. 输入依据

| 输入产物 | 路径 | 本阶段使用方式 |
|----------|------|----------------|
| 需求基线 | `01_req/workspace/01_requirements/07_baseline/requirements-baseline-v1.0.md` | 确认实现范围和 REQ 编号 |
| 需求追踪矩阵 | `01_req/workspace/01_requirements/05_traceability/requirements-traceability-v1.0.md` | 建立 REQ、DES、CODE、QA 映射 |
| 原型说明 | `01_req/workspace/01_requirements/03_prototypes/prototype-notes-v1.0.md` | 理解页面、菜单、字段和操作 |
| 可运行原型 | `01_req/workspace/01_requirements/03_prototypes/prototype-app/` | 参考页面布局和交互效果 |
| 架构设计 | `02_build/workspace/01_architecture/architecture-design-v1.0.md` | 确认前后端分离、单体后端、RBAC、REST API |
| 软件功能说明 | `02_build/workspace/02_design/software-function-spec-v1.0.md` | AI 生成代码的主要功能输入 |
| 数据库设计 | `02_build/workspace/03_database/database-design-v1.0.md` | 生成 Entity、Repository、DDL、初始化数据 |
| 编码规范 | `02_build/playbook/04_codebase/rules/CODING_RULE.md` | 约束命名、注释、分包、代码风格 |

## 3. 实施边界

### 3.1 本阶段必须实现

| 模块 | 范围 |
|------|------|
| 登录 | 账号密码登录、退出登录、当前用户信息 |
| 主页 | 当前用户角色、菜单、基础统计卡片 |
| 学生管理 | 新增、编辑、查询、停用、班级归属 |
| 班级管理 | 新增、编辑、查询、班主任绑定 |
| 教师管理 | 新增、编辑、查询、任课关系维护 |
| 学生课程管理 | 学生课程分配、重复校验、停用 |
| 学生成绩管理 | 成绩录入、编辑、查询、权限过滤、0-100 校验 |

### 3.2 本阶段不实现

- 排课算法。
- 在线选课。
- 家长端、学生端。
- 复杂成绩统计分析。
- 第三方统一身份认证。
- 生产级权限审计和操作日志。

### 3.3 Demo 可简化项

| 项 | 简化方式 | 后续真实项目处理 |
|----|----------|------------------|
| 登录认证 | 可使用简单 Token 或 Session 模拟 | 接入正式认证、密码加密和过期机制 |
| 用户角色 | 可用初始化数据内置 | 接入账号角色管理 |
| 数据库 | 可使用 SQLite、H2、MySQL 或 PostgreSQL 中一种 | 按真实部署环境确认 |
| 部署 | 本地 Docker Compose 或脚本启动 | 接入 CI/CD、环境隔离和发布审批 |

## 4. 推荐技术栈

为了让 Demo 易于运行，建议采用以下组合。实际项目可按团队技术栈替换，但必须保持同等交付物。

| 层 | 推荐技术 | 说明 |
|----|----------|------|
| 前端 | Vue 3 + Vite | 与需求原型衔接，便于快速生成页面 |
| 后端 | Spring Boot 或 Node.js Express | Demo 可二选一，本文默认描述 Spring Boot 分层 |
| 数据库 | PostgreSQL 或 MySQL | 关系型数据结构清晰 |
| 本地部署 | Docker Compose | 同时启动数据库、后端、前端 |
| 测试 | JUnit / Vitest / 接口脚本 | 覆盖关键规则和边界值 |

如果 AI-Agent 生成 Node.js 后端，也必须保留同样的分层：Controller、Service、Repository、DTO、Entity 或 Model。

## 5. 目标工程结构

### 5.1 总体目录

```text
school-edu-system/
├── frontend/
├── backend/
├── database/
├── deploy/
├── docs/
└── README.md
```

### 5.2 前端目录

```text
frontend/
├── package.json
├── vite.config.js
├── src/
│   ├── main.js
│   ├── App.vue
│   ├── router/
│   ├── api/
│   ├── stores/
│   ├── layouts/
│   ├── views/
│   │   ├── LoginView.vue
│   │   ├── HomeView.vue
│   │   ├── StudentView.vue
│   │   ├── ClassView.vue
│   │   ├── TeacherView.vue
│   │   ├── StudentCourseView.vue
│   │   └── ScoreView.vue
│   └── components/
└── README.md
```

### 5.3 后端目录

```text
backend/
├── pom.xml
├── src/main/java/com/example/schooledu/
│   ├── SchoolEduApplication.java
│   ├── common/
│   ├── auth/
│   ├── user/
│   ├── student/
│   ├── classinfo/
│   ├── teacher/
│   ├── course/
│   └── score/
├── src/main/resources/
│   ├── application.yml
│   └── db/
└── src/test/
```

每个业务模块建议包含：

```text
controller/
service/
repository/
entity/
dto/
```

## 6. 统一数据定义

AI-Agent 生成 Entity、DTO、表单字段和校验规则时，必须优先使用本节定义。

### 6.1 枚举定义

| 枚举 | 值 | 说明 |
|------|----|------|
| `Gender` | `male`, `female` | 学生或教师性别 |
| `RecordStatus` | `active`, `disabled` | 通用启用状态 |
| `RoleCode` | `admin`, `academic_admin`, `head_teacher`, `teacher` | 系统角色 |

### 6.2 核心实体定义

#### Student

| 字段 | 类型 | 必填 | 约束 | 来源 |
|------|------|------|------|------|
| id | Long | 是 | 主键 | DB-003 |
| studentNo | String | 是 | 全校唯一，最大 32 字符 | REQ-003 / DB-003 |
| name | String | 是 | 最大 64 字符 | REQ-003 / DB-003 |
| gender | Gender | 是 | male / female | REQ-003 |
| classId | Long | 是 | 必须引用有效班级 | REQ-003 / REQ-004 |
| enrollmentYear | Integer | 是 | 例如 2026 | REQ-003 |
| status | RecordStatus | 是 | active / disabled | REQ-003 |

#### ClassInfo

| 字段 | 类型 | 必填 | 约束 | 来源 |
|------|------|------|------|------|
| id | Long | 是 | 主键 | DB-004 |
| gradeName | String | 是 | 例如七年级 | REQ-004 |
| className | String | 是 | 年级内唯一 | REQ-004 |
| headTeacherId | Long | 否 | 必须引用有效教师 | REQ-004 |
| status | RecordStatus | 是 | active / disabled | REQ-004 |

#### Teacher

| 字段 | 类型 | 必填 | 约束 | 来源 |
|------|------|------|------|------|
| id | Long | 是 | 主键 | DB-005 |
| teacherNo | String | 是 | 全校唯一，最大 32 字符 | REQ-005 |
| name | String | 是 | 最大 64 字符 | REQ-005 |
| gender | Gender | 否 | male / female | REQ-005 |
| status | RecordStatus | 是 | active / disabled | REQ-005 |

#### Course

| 字段 | 类型 | 必填 | 约束 | 来源 |
|------|------|------|------|------|
| id | Long | 是 | 主键 | DB-006 |
| courseCode | String | 是 | 唯一 | REQ-006 |
| courseName | String | 是 | 例如语文、数学、英语 | REQ-006 |
| status | RecordStatus | 是 | active / disabled | REQ-006 |

#### StudentCourse

| 字段 | 类型 | 必填 | 约束 | 来源 |
|------|------|------|------|------|
| id | Long | 是 | 主键 | DB-007 |
| term | String | 是 | 例如 2026-S1 | DES-006 |
| studentId | Long | 是 | 必须引用 active 学生 | REQ-006 |
| courseId | Long | 是 | 必须引用 active 课程 | REQ-006 |
| teacherId | Long | 是 | 必须引用 active 教师 | REQ-006 |
| status | RecordStatus | 是 | active / disabled | REQ-006 |

唯一性规则：同一 `term + studentId + courseId` 只能存在一条 active 记录。

#### StudentScore

| 字段 | 类型 | 必填 | 约束 | 来源 |
|------|------|------|------|------|
| id | Long | 是 | 主键 | DB-008 |
| term | String | 是 | 例如 2026-S1 | DES-007 |
| studentId | Long | 是 | 必须存在课程关系 | REQ-007 |
| courseId | Long | 是 | 必须存在课程关系 | REQ-007 |
| teacherId | Long | 是 | 必须为该课程任课教师 | REQ-007 |
| score | Integer | 是 | 0-100 | REQ-007 |
| remark | String | 否 | 最大 255 字符 | DES-007 |

唯一性规则：同一 `term + studentId + courseId` 只能存在一条成绩记录。

## 7. 通用接口规范

### 7.1 响应结构

```json
{
  "success": true,
  "code": "OK",
  "message": "success",
  "data": {}
}
```

分页响应：

```json
{
  "success": true,
  "code": "OK",
  "message": "success",
  "data": {
    "items": [],
    "page": 1,
    "pageSize": 10,
    "total": 0
  }
}
```

### 7.2 通用错误码

| 错误码 | 场景 |
|--------|------|
| `VALIDATION_ERROR` | 参数校验失败 |
| `UNAUTHORIZED` | 未登录 |
| `FORBIDDEN` | 无权限 |
| `NOT_FOUND` | 数据不存在 |
| `DUPLICATE_DATA` | 唯一性冲突 |
| `BUSINESS_RULE_FAILED` | 业务规则不满足 |

### 7.3 权限上下文

AI-Agent 生成代码时可以先定义统一上下文：

| 字段 | 说明 |
|------|------|
| currentUserId | 当前用户 ID |
| currentRoleCode | 当前角色 |
| currentTeacherId | 当前用户绑定教师 ID |
| currentClassId | 班主任绑定班级 ID |

真实项目中权限上下文获取方式由人工确认，Demo 中可用模拟登录数据实现。

## 8. 模块级开发任务

| CODE 编号 | 对应需求 | 对应设计 | 对应数据 | 任务 | 必须实现的规则 |
|-----------|----------|----------|----------|------|----------------|
| CODE-001 | REQ-001 | DES-001 | DB-001, DB-002 | 登录、退出、当前用户 | 停用账号不可登录，登录后返回角色菜单 |
| CODE-002 | REQ-002 | DES-002 | DB-001, DB-002 | 主页和菜单 | 不同角色显示不同菜单 |
| CODE-003 | REQ-003 | DES-003 | DB-003, DB-004 | 学生管理 | 学号唯一、班级有效、班主任只能看本班 |
| CODE-004 | REQ-004 | DES-004 | DB-004, DB-005 | 班级管理 | 班级名称在年级内唯一，班主任必须有效 |
| CODE-005 | REQ-005 | DES-005 | DB-005, DB-006, DB-007 | 教师管理 | 教师工号唯一，任课关系引用有效课程 |
| CODE-006 | REQ-006 | DES-006 | DB-008 | 学生课程管理 | active 学生才能分配课程，课程关系不能重复 |
| CODE-007 | REQ-007 | DES-007 | DB-009 | 学生成绩管理 | 成绩 0-100，教师只能录入任教课程，按角色过滤查询 |

### 8.1 模块开发功能详述

本节用于进一步约束 AI-Agent 生成代码时的业务理解。AI-Agent 生成某个模块前，必须先读取对应小节，不得只根据模块名称自行发挥。

#### CODE-001 登录与当前用户

关联：`REQ-001`、`DES-001`、`DB-001`、`DB-002`

功能目标：提供用户登录、退出和当前用户信息查询能力。登录成功后，前端应能拿到当前用户、角色、菜单和必要的数据权限上下文。

前端页面要求：

- 登录页包含账号、密码、登录按钮和错误提示区域。
- 登录中应显示加载状态，防止重复提交。
- 登录失败时在页面显示后端返回的业务错误信息。
- 登录成功后跳转主页。
- 已登录用户访问 `/login` 时可跳转主页。

后端接口要求：

| 接口 | 方法 | 请求 | 响应 |
|------|------|------|------|
| `/api/auth/login` | POST | `username`, `password` | token、用户信息、角色、菜单 |
| `/api/auth/logout` | POST | 无 | 退出成功 |
| `/api/auth/profile` | GET | token | 当前用户、角色、菜单、权限上下文 |

数据和约束：

- `username` 必填，最大 64 字符。
- `password` 必填，Demo 可简化校验，但代码结构必须预留加密校验。
- 停用用户不能登录。
- 用户必须至少绑定一个角色。
- 返回菜单必须按角色过滤，不得返回未授权菜单。

业务流程：

```text
用户提交账号密码
  -> 校验参数
  -> 查询用户
  -> 判断用户是否存在、密码是否正确、状态是否启用
  -> 查询角色和菜单
  -> 生成 token 或会话
  -> 返回用户信息、角色、菜单和权限上下文
```

异常场景：

| 场景 | 错误码 |
|------|--------|
| 账号或密码为空 | `VALIDATION_ERROR` |
| 账号不存在或密码错误 | `BUSINESS_RULE_FAILED` |
| 账号停用 | `FORBIDDEN` |
| 用户未绑定角色 | `BUSINESS_RULE_FAILED` |

AI 生成要求：

- 生成 `AuthController`、`AuthService`、`LoginRequest`、`LoginResponse`、`CurrentUserResponse`。
- 生成统一的 `CurrentUserContext` 或等价对象，供后续模块判断角色和数据范围。
- 不要把角色判断散落在前端页面里，后端必须能够独立完成权限判断。

验收标准：

- 正确账号能登录并进入主页。
- 错误密码不能登录。
- 停用账号不能登录。
- 班主任、任课教师、教务管理员登录后菜单不同。

#### CODE-002 主页与菜单

关联：`REQ-002`、`DES-002`、`DB-001`、`DB-002`

功能目标：展示当前用户、角色菜单和基础统计信息，作为业务人员进入各模块的统一入口。

前端页面要求：

- 页面顶部展示当前用户姓名、角色名称和退出入口。
- 左侧或顶部菜单只展示当前角色授权的功能。
- 统计卡片展示学生数、班级数、教师数、待录成绩数。
- 菜单点击后进入对应路由。

后端接口要求：

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/auth/profile` | GET | 返回用户、角色和菜单 |
| `/api/dashboard/summary` | GET | 返回统计卡片数据 |

统计口径：

- 学生数：`student.status = active` 的数量。
- 班级数：`class_info.status = active` 的数量。
- 教师数：`teacher.status = active` 的数量。
- 待录成绩数：Demo 可用学生课程关系数减已录成绩数简化计算。

权限规则：

- 所有登录用户可访问主页。
- 菜单显示由后端返回，前端只负责渲染。
- 用户手工访问未授权路由时，前端应提示无权限；后端接口仍必须拒绝未授权访问。

AI 生成要求：

- 生成 `DashboardController`、`DashboardService`。
- 前端生成 `HomeView.vue`，调用 `profile` 和 `summary` 接口。
- 菜单数据结构应包含 `key`、`label`、`path`、`reqCode`。

验收标准：

- 教务管理员能看到所有菜单。
- 班主任不能看到班级管理、教师管理。
- 任课教师不能看到学生新增或班级维护入口。

#### CODE-003 学生管理

关联：`REQ-003`、`DES-003`、`DB-003`、`DB-004`

功能目标：维护学生基础信息，支持教务管理员新增、编辑、查询、停用学生；支持班主任查看本班学生。

前端页面要求：

- 查询条件：学号、姓名、班级、状态。
- 列表字段：学号、姓名、性别、班级、入学年份、状态、操作。
- 表单字段：学号、姓名、性别、班级、入学年份。
- 教务管理员显示新增、编辑、停用按钮。
- 班主任只显示查询和查看，不显示新增、编辑、停用。

后端接口要求：

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/students` | GET | 分页查询学生 |
| `/api/students` | POST | 新增学生 |
| `/api/students/{id}` | GET | 查看学生详情 |
| `/api/students/{id}` | PUT | 编辑学生 |
| `/api/students/{id}/disable` | POST | 停用学生 |

数据约束：

- `studentNo` 必填、全校唯一、最大 32 字符。
- `name` 必填、最大 64 字符。
- `gender` 必须是 `male` 或 `female`。
- `classId` 必须引用 active 班级。
- `enrollmentYear` 必须是合理年份，Demo 可约束为 2000-2100。
- `status` 由系统维护，新增默认为 `active`。

业务规则：

- 新增学生时必须校验学号唯一。
- 编辑学生时不能修改为不存在或 disabled 的班级。
- 停用学生后，不允许新增学生课程关系。
- 班主任查询时必须按 `currentClassId` 过滤，即使用户在请求参数中传其他班级也不能越权。

异常场景：

| 场景 | 错误码 |
|------|--------|
| 学号重复 | `DUPLICATE_DATA` |
| 班级不存在或停用 | `BUSINESS_RULE_FAILED` |
| 班主任越权查询 | 返回空结果或 `FORBIDDEN`，项目需统一口径 |
| 学生不存在 | `NOT_FOUND` |

AI 生成要求：

- 生成 `StudentController`、`StudentService`、`StudentRepository`、`StudentEntity`。
- 生成 `StudentCreateRequest`、`StudentUpdateRequest`、`StudentQueryRequest`、`StudentResponse`。
- Service 层必须集中实现唯一性、班级有效性和班主任过滤。
- 前端 `StudentView.vue` 必须同时包含查询区、列表区和表单弹窗或表单区域。

验收标准：

- 重复学号新增失败。
- 班主任账号看不到其他班学生。
- 停用学生不能进入后续课程分配。

#### CODE-004 班级管理

关联：`REQ-004`、`DES-004`、`DB-004`、`DB-005`

功能目标：维护年级、班级、班主任和班级状态，为学生归属和班主任数据权限提供基础数据。

前端页面要求：

- 查询条件：年级、班级名称、班主任、状态。
- 列表字段：年级、班级名称、班主任、学生人数、状态、操作。
- 表单字段：年级、班级名称、班主任。
- 停用班级时需弹出风险提示。

后端接口要求：

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/classes` | GET | 分页查询班级 |
| `/api/classes` | POST | 新增班级 |
| `/api/classes/{id}` | GET | 查看班级详情 |
| `/api/classes/{id}` | PUT | 编辑班级 |
| `/api/classes/{id}/disable` | POST | 停用班级 |

数据约束：

- `gradeName` 必填，例如七年级、八年级。
- `className` 必填，同一年级内唯一。
- `headTeacherId` 可为空；不为空时必须引用 active 教师。
- `status` 新增默认为 `active`。

业务规则：

- 同一年级不能存在两个相同班级名称。
- 班主任必须是 active 教师。
- 停用班级前，如果班级下存在 active 学生，应提示风险；Demo 可禁止停用，也可要求先转移学生，需在代码注释中说明选择。
- 班级被停用后，学生新增和编辑不能选择该班级。

AI 生成要求：

- 生成 `ClassInfoController`、`ClassInfoService`、`ClassInfoRepository`、`ClassInfoEntity`。
- 生成班级查询时可返回 `studentCount`，用于前端展示。
- 不要把班级名称唯一性只放在前端，后端和数据库都要保护。

验收标准：

- 同一年级重复班级保存失败。
- 绑定不存在教师失败。
- 有 active 学生的班级停用时按规则处理并给出清晰提示。

#### CODE-005 教师管理与任课关系

关联：`REQ-005`、`DES-005`、`DB-005`、`DB-006`、`DB-007`

功能目标：维护教师基础信息和教师任课关系，为学生课程分配和成绩录入权限提供依据。

前端页面要求：

- 查询条件：教师工号、教师姓名、任课课程、状态。
- 列表字段：教师工号、姓名、性别、任课课程、状态、操作。
- 表单字段：教师工号、姓名、性别、状态。
- 任课关系维护可以在教师编辑页中使用课程多选。

后端接口要求：

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/teachers` | GET | 分页查询教师 |
| `/api/teachers` | POST | 新增教师 |
| `/api/teachers/{id}` | GET | 查看教师详情 |
| `/api/teachers/{id}` | PUT | 编辑教师 |
| `/api/teachers/{id}/courses` | PUT | 维护教师任课课程 |
| `/api/teachers/{id}/disable` | POST | 停用教师 |

数据约束：

- `teacherNo` 必填、全校唯一、最大 32 字符。
- `name` 必填、最大 64 字符。
- `courseIds` 中每个课程必须为 active。
- `teacher_course` 中同一 active 教师课程关系不能重复。

业务规则：

- 停用教师后，不能再新增以该教师为任课教师的学生课程关系。
- 维护任课关系时，传入课程列表应覆盖当前 active 任课关系；需要保留历史时可将旧关系置为 disabled。
- 任课教师只能录入自己任课课程的成绩。

AI 生成要求：

- 生成 `TeacherController`、`TeacherService`、`TeacherRepository`、`TeacherCourseRepository`。
- 生成 `TeacherCreateRequest`、`TeacherUpdateRequest`、`TeacherCourseUpdateRequest`。
- 前端教师表单要能显示和维护任课课程。
- Service 层要封装“教师是否任教某课程”的查询方法，供成绩模块复用。

验收标准：

- 重复教师工号保存失败。
- 教师任课关系可维护并能被学生课程和成绩模块引用。
- 停用教师不能继续用于新课程关系。

#### CODE-006 学生课程管理

关联：`REQ-006`、`DES-006`、`DB-008`

功能目标：维护学生在某学期与课程、任课教师之间的关系，防止重复分配，为成绩录入提供前置依据。

前端页面要求：

- 查询条件：学期、学生、班级、课程、任课教师、状态。
- 列表字段：学期、学生、班级、课程、任课教师、状态、操作。
- 表单字段：学期、学生、课程、任课教师。
- 新增时下拉数据只显示 active 学生、active 课程、active 教师。

后端接口要求：

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/student-courses` | GET | 分页查询学生课程关系 |
| `/api/student-courses` | POST | 新增学生课程关系 |
| `/api/student-courses/{id}` | GET | 查看关系详情 |
| `/api/student-courses/{id}/disable` | POST | 停用学生课程关系 |

数据约束：

- `term` 必填，例如 `2026-S1`。
- `studentId` 必须引用 active 学生。
- `courseId` 必须引用 active 课程。
- `teacherId` 必须引用 active 教师。
- 同一 `term + studentId + courseId` 只能存在一条 active 关系。

业务规则：

- 停用学生不能分配课程。
- 停用课程不能被分配。
- 停用教师不能作为任课教师。
- 教师必须已经绑定该课程的任课关系。
- 停用课程关系不删除历史成绩。

AI 生成要求：

- 生成 `StudentCourseController`、`StudentCourseService`、`StudentCourseRepository`、`StudentCourseEntity`。
- Service 层必须调用教师任课关系校验。
- 前端新增表单应在选择课程后过滤可选任课教师，或提交时由后端校验并返回明确错误。
- 查询结果应包含学生姓名、班级名称、课程名称、教师姓名，不能只返回 ID。

验收标准：

- 重复分配同一学生同一学期同一课程失败。
- 停用学生不能分配课程。
- 未任教该课程的教师不能被绑定。

#### CODE-007 学生成绩管理

关联：`REQ-007`、`DES-007`、`DB-009`

功能目标：支持任课教师录入和编辑自己任教课程的学生成绩，支持教务管理员、班主任和任课教师按权限查询成绩。

前端页面要求：

- 查询条件：学期、班级、学生、课程、任课教师。
- 列表字段：学期、学生、班级、课程、成绩、录入教师、备注。
- 表单字段：学生课程关系、成绩、备注。
- 任课教师显示录入和编辑按钮；班主任只读；教务管理员可查询全部。
- 成绩输入控件必须限制为数字，并在前端提示 0-100。

后端接口要求：

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/scores` | GET | 分页查询成绩 |
| `/api/scores` | POST | 录入成绩 |
| `/api/scores/{id}` | GET | 查看成绩详情 |
| `/api/scores/{id}` | PUT | 编辑成绩 |

数据约束：

- `term` 必填。
- `studentId`、`courseId`、`teacherId` 必须能匹配 active 或历史有效学生课程关系。
- `score` 必须是整数，范围 0-100。
- 同一 `term + studentId + courseId` 只能存在一条成绩记录。
- `remark` 最大 255 字符。

权限规则：

- 教务管理员可查询全部成绩。
- 班主任只能查询本班学生成绩。
- 任课教师只能查询和维护自己任教课程的成绩。
- 任课教师不能给非任教课程录入或编辑成绩。

业务流程：

```text
任课教师选择学期、学生、课程
  -> 后端校验学生课程关系存在
  -> 后端校验当前教师任教该课程
  -> 后端校验成绩范围和唯一性
  -> 保存成绩
  -> 返回成绩记录
```

异常场景：

| 场景 | 错误码 |
|------|--------|
| 成绩为空或超出范围 | `VALIDATION_ERROR` |
| 学生未绑定该课程 | `BUSINESS_RULE_FAILED` |
| 教师无任课权限 | `FORBIDDEN` |
| 成绩重复录入 | `DUPLICATE_DATA` |

AI 生成要求：

- 生成 `ScoreController`、`ScoreService`、`ScoreRepository`、`StudentScoreEntity`。
- 生成 `ScoreCreateRequest`、`ScoreUpdateRequest`、`ScoreQueryRequest`、`ScoreResponse`。
- Service 层必须复用学生课程关系和教师任课关系校验。
- 前端 `ScoreView.vue` 必须支持按角色控制按钮可见性。
- 必须生成覆盖 `0`、`100`、`-1`、`101` 的测试。

验收标准：

- 0 和 100 可以保存。
- -1 和 101 不能保存。
- 任课教师不能录入非任教课程成绩。
- 班主任只能看到本班成绩。

## 9. 前端实现要求

### 9.1 页面与路由

| 页面 | 路由 | 关联需求 | 说明 |
|------|------|----------|------|
| 登录页 | `/login` | REQ-001 | 账号密码登录 |
| 主页 | `/` | REQ-002 | 角色菜单、统计卡片 |
| 学生管理 | `/students` | REQ-003 | 列表、查询、新增、编辑、停用 |
| 班级管理 | `/classes` | REQ-004 | 列表、查询、新增、编辑 |
| 教师管理 | `/teachers` | REQ-005 | 列表、查询、新增、任课维护 |
| 学生课程管理 | `/student-courses` | REQ-006 | 课程分配、重复校验提示 |
| 学生成绩管理 | `/scores` | REQ-007 | 成绩录入、编辑、查询 |

### 9.2 前端数据校验

| 模块 | 校验 |
|------|------|
| 登录 | username、password 必填 |
| 学生管理 | studentNo、name、gender、classId、enrollmentYear 必填 |
| 班级管理 | gradeName、className 必填 |
| 教师管理 | teacherNo、name 必填 |
| 学生课程管理 | term、studentId、courseId、teacherId 必填 |
| 成绩管理 | term、studentId、courseId、score 必填，score 为 0-100 |

前端校验用于提升体验，后端仍必须重复校验，不得只依赖前端校验。

### 9.3 前端 API 文件

建议生成：

```text
frontend/src/api/authApi.js
frontend/src/api/studentApi.js
frontend/src/api/classApi.js
frontend/src/api/teacherApi.js
frontend/src/api/studentCourseApi.js
frontend/src/api/scoreApi.js
```

每个 API 文件应只负责请求封装，不写复杂业务判断。

## 10. 后端实现要求

### 10.1 分层职责

| 层 | 职责 |
|----|------|
| Controller | 接收请求、参数校验、返回统一响应 |
| Service | 业务规则、权限过滤、事务控制 |
| Repository | 数据访问 |
| Entity | 数据库表映射 |
| DTO | 请求和响应数据结构 |
| Common | 统一响应、错误码、异常处理、权限上下文 |

### 10.2 事务边界

| 场景 | 事务要求 |
|------|----------|
| 新增学生 | 校验学号唯一和班级有效后保存 |
| 停用学生 | 停用学生，并阻止后续课程分配 |
| 分配学生课程 | 校验学生、课程、教师和重复关系后保存 |
| 录入成绩 | 校验课程关系、教师权限和成绩范围后保存 |

### 10.3 后端必须实现的通用能力

- 全局异常处理。
- 参数校验错误统一返回。
- 业务错误统一返回。
- 分页查询。
- 角色权限判断。
- 初始化数据加载。

## 11. 数据库脚本要求

建议生成：

```text
database/
├── 001_schema.sql
├── 002_seed_roles.sql
├── 003_seed_demo_data.sql
└── README.md
```

### 11.1 `001_schema.sql`

必须包含：

- `sys_user`
- `sys_role`
- `student`
- `class_info`
- `teacher`
- `course`
- `student_course`
- `student_score`

必须包含：

- 主键。
- 唯一约束。
- 非空约束。
- 成绩范围约束。
- 必要索引。

### 11.2 `002_seed_roles.sql`

必须初始化：

- 系统管理员。
- 教务管理员。
- 班主任。
- 任课教师。

### 11.3 `003_seed_demo_data.sql`

必须初始化：

- 示例班级。
- 示例教师。
- 示例课程。
- 示例学生。
- 示例课程关系。
- 示例成绩。

## 12. 部署与运行脚本要求

建议生成：

```text
deploy/
├── docker-compose.yml
├── env.example
├── start-local.sh
├── start-local.ps1
├── stop-local.sh
└── README.md
```

### 12.1 `docker-compose.yml`

至少包含：

- `database` 服务。
- `backend` 服务。
- `frontend` 服务。

### 12.2 `env.example`

至少包含：

```text
DB_HOST=localhost
DB_PORT=5432
DB_NAME=school_edu
DB_USER=school_edu
DB_PASSWORD=school_edu
BACKEND_PORT=8080
FRONTEND_PORT=5173
```

### 12.3 启停脚本

`start-local.sh` 和 `start-local.ps1` 应完成：

- 检查 Node、Java、Docker 是否存在，按项目技术栈调整。
- 启动数据库。
- 执行初始化脚本或提示初始化方式。
- 启动后端。
- 启动前端。
- 输出访问地址。

`stop-local.sh` 应停止本地服务或提示使用 Docker Compose 停止。

## 13. 测试与验证要求

### 13.1 后端测试

必须覆盖：

| 测试项 | 覆盖规则 |
|--------|----------|
| 登录失败 | REQ-001 |
| 学号重复 | REQ-003 |
| 班主任数据过滤 | REQ-003 |
| 学生课程重复分配 | REQ-006 |
| 成绩边界 0、100、-1、101 | REQ-007 |
| 教师越权录入成绩 | REQ-007 |

### 13.2 前端验证

必须验证：

- 不同角色菜单不同。
- 学生管理表格和表单字段完整。
- 成绩录入表单有前端范围校验。
- API 错误信息能展示给用户。

### 13.3 运行验收

AI-Agent 生成代码后，应提供以下验证命令：

```bash
cd backend
./mvnw test
./mvnw spring-boot:run
```

```bash
cd frontend
npm install
npm run dev
```

```bash
cd deploy
docker compose up -d
```

实际命令可根据最终技术栈调整，但必须写入项目根 `README.md` 或 `deploy/README.md`。

## 14. AI-Agent 生成顺序

为了降低一次性生成过多代码导致失控的风险，建议按以下顺序让 AI-Agent 工作：

1. 生成项目骨架和根 README。
2. 生成数据库脚本和初始化数据。
3. 生成后端 common、异常、响应、权限上下文。
4. 生成登录和主页模块。
5. 生成学生、班级、教师基础模块。
6. 生成学生课程和成绩模块。
7. 生成前端路由、布局和 API 封装。
8. 生成各业务页面。
9. 生成测试。
10. 生成部署脚本。
11. 人工运行、审查、修复和记录问题。

每一步都应提交可审查的增量，不建议一次性让 AI-Agent 生成全部系统。

## 15. AI-Agent 提示词模板

### 15.1 生成项目骨架

```text
你是 Developer Agent，正在执行 ai-project-kit 的代码实现阶段。

请读取：
1. 02_build/workspace/04_codebase/implementation-plan-v1.0.md
2. 02_build/workspace/02_design/software-function-spec-v1.0.md
3. 02_build/workspace/03_database/database-design-v1.0.md
4. 02_build/playbook/04_codebase/rules/CODING_RULE.md

请生成中学教务管理系统 Demo 的前后端项目骨架、数据库脚本目录和 deploy 目录。

要求：
- 保留 frontend、backend、database、deploy 目录。
- 后端按 Controller、Service、Repository、Entity、DTO 分层。
- 前端按 views、api、router、components 分层。
- 先不要实现全部业务逻辑，只生成可运行骨架和 README。
- 输出需要人工确认的技术栈假设。
```

### 15.2 生成学生管理模块

```text
请基于 CODE-003 生成学生管理模块。

输入依据：
- DES-003 学生管理功能说明
- DB-003 student 表设计
- 本文件第 6 节 Student 数据定义
- 本文件第 9、10 节前后端实现要求

必须实现：
1. 学生分页查询。
2. 新增学生。
3. 编辑学生。
4. 停用学生。
5. 学号唯一校验。
6. 班级有效校验。
7. 班主任只能查询本班学生。

输出：
- 后端 Controller、Service、Repository、Entity、DTO。
- 前端 StudentView、studentApi。
- 必要测试。
- 需要人工确认的权限上下文获取方式。
```

### 15.3 生成部署脚本

```text
请基于 implementation-plan-v1.0.md 第 12 节生成本地部署脚本。

要求：
1. 生成 deploy/docker-compose.yml。
2. 生成 deploy/env.example。
3. 生成 deploy/start-local.sh 和 deploy/start-local.ps1。
4. 生成 deploy/README.md。
5. 说明数据库、后端、前端启动顺序。
6. 输出本地访问地址。
7. 标注需要人工确认的端口、数据库密码和环境变量。
```

## 16. 人工审查清单

AI-Agent 生成代码后，开发人员必须检查：

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

不满足上述检查项时，不得进入测试阶段。

## 17. 本阶段输出

编码阶段最终应输出：

| 产物 | 建议位置 |
|------|----------|
| 开发任务清单 | `02_build/workspace/04_codebase/01_tasks/` |
| 前后端源码 | 实际代码仓库或 `02_build/workspace/04_codebase/` 下的示例目录 |
| 数据库脚本 | `database/` 或 `06_runtime/database/` |
| 部署脚本 | `deploy/` 或 `06_runtime/deploy/` |
| 单元测试和验证记录 | `02_build/workspace/04_codebase/03_tests/` |
| 构建记录 | `02_build/workspace/04_codebase/02_builds/` |
| 代码评审记录 | `02_build/workspace/04_codebase/04_reviews/` |
| 已知问题和技术债 | `02_build/workspace/04_codebase/05_defects/` |
| 运行说明和环境变量 | `02_build/workspace/04_codebase/06_runtime/` |

## 18. 交接给测试阶段

交给 `03_qa/workspace/01_testing/` 的材料必须包含：

- 可运行版本或源码位置。
- 前端启动方式。
- 后端启动方式。
- 数据库初始化方式。
- 测试账号和角色说明。
- 已知问题清单。
- REQ、DES、CODE 映射关系。
- 权限、成绩、课程关系等关键测试关注点。

测试人员不应从代码中反推业务规则，应优先引用需求基线、软件功能说明和本实现说明。
