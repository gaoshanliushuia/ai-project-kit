# 全局开发实现要求 v1.0

项目：中学教务管理系统 Demo

适用范围：所有 `modules/` 下的模块级开发实现文档，以及 `common/` 下非功能性通用要求的工程落地。

说明：本文件维护工程结构、接口、数据、权限、测试和部署等全局实现要求。界面风格、交互体验、安全日志与可观测性等非具体功能性要求按主题放在 `common/` 目录中，代码生成时必须同时读取。

## 1. 目标工程结构

```text
school-edu-system/
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.js
│       ├── App.vue
│       ├── router/
│       ├── api/
│       ├── stores/
│       ├── layouts/
│       ├── views/
│       └── components/
├── backend/
│   ├── src/main/java/com/example/schooledu/
│   │   ├── common/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── student/
│   │   ├── classinfo/
│   │   ├── teacher/
│   │   ├── course/
│   │   └── score/
│   ├── src/main/resources/
│   └── src/test/
├── database/
├── deploy/
└── README.md
```

每个后端业务模块建议包含 `controller/`、`service/`、`repository/`、`entity/`、`dto/`。每个前端业务模块至少包含视图文件和对应 API 封装文件。

## 2. 统一数据定义

### 2.1 枚举

| 枚举 | 值 | 说明 |
|------|----|------|
| `Gender` | `male`, `female` | 学生或教师性别 |
| `RecordStatus` | `active`, `disabled` | 通用启用状态 |
| `RoleCode` | `admin`, `academic_admin`, `head_teacher`, `teacher` | 系统角色 |

### 2.2 核心实体

| 实体 | 关键字段 | 主要约束 |
|------|----------|----------|
| `Student` | `id`, `studentNo`, `name`, `gender`, `classId`, `enrollmentYear`, `status` | 学号全校唯一；班级必须有效；新增默认 active |
| `ClassInfo` | `id`, `gradeName`, `className`, `headTeacherId`, `status` | 同一年级内班级名称唯一；班主任必须引用有效教师 |
| `Teacher` | `id`, `teacherNo`, `name`, `gender`, `status` | 教师工号全校唯一 |
| `Course` | `id`, `courseCode`, `courseName`, `status` | 课程编码唯一 |
| `TeacherCourse` | `id`, `teacherId`, `courseId`, `status` | 同一 active 教师课程关系不能重复 |
| `StudentCourse` | `id`, `term`, `studentId`, `courseId`, `teacherId`, `status` | 同一 `term + studentId + courseId` 只能存在一条 active 记录 |
| `StudentScore` | `id`, `term`, `studentId`, `courseId`, `teacherId`, `score`, `remark` | 成绩 0-100；同一 `term + studentId + courseId` 只能存在一条成绩记录 |

## 3. 通用接口规范

统一成功响应：

```json
{
  "success": true,
  "code": "OK",
  "message": "success",
  "data": {}
}
```

统一分页响应：

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

通用错误码：

| 错误码 | 场景 |
|--------|------|
| `VALIDATION_ERROR` | 参数校验失败 |
| `UNAUTHORIZED` | 未登录 |
| `FORBIDDEN` | 无权限 |
| `NOT_FOUND` | 数据不存在 |
| `DUPLICATE_DATA` | 唯一性冲突 |
| `BUSINESS_RULE_FAILED` | 业务规则不满足 |

## 4. 权限上下文

AI-Agent 生成代码时可以先定义统一上下文：

| 字段 | 说明 |
|------|------|
| `currentUserId` | 当前用户 ID |
| `currentRoleCode` | 当前角色 |
| `currentTeacherId` | 当前用户绑定教师 ID |
| `currentClassId` | 班主任绑定班级 ID |

真实项目中权限上下文获取方式由人工确认，Demo 中可用模拟登录数据实现。权限判断必须由后端独立完成，前端只负责展示和交互控制。

## 5. 前端实现要求

| 页面 | 路由 | 关联需求 | 说明 |
|------|------|----------|------|
| 登录页 | `/login` | REQ-001 | 账号密码登录 |
| 主页 | `/` | REQ-002 | 角色菜单、统计卡片 |
| 学生管理 | `/students` | REQ-003 | 列表、查询、新增、编辑、停用 |
| 班级管理 | `/classes` | REQ-004 | 列表、查询、新增、编辑 |
| 教师管理 | `/teachers` | REQ-005 | 列表、查询、新增、任课维护 |
| 学生课程管理 | `/student-courses` | REQ-006 | 课程分配、重复校验提示 |
| 学生成绩管理 | `/scores` | REQ-007 | 成绩录入、编辑、查询 |

建议生成 API 文件：

```text
frontend/src/api/authApi.js
frontend/src/api/dashboardApi.js
frontend/src/api/studentApi.js
frontend/src/api/classApi.js
frontend/src/api/teacherApi.js
frontend/src/api/studentCourseApi.js
frontend/src/api/scoreApi.js
```

前端校验用于提升体验，后端仍必须重复校验，不得只依赖前端校验。API 文件只负责请求封装，不写复杂业务判断。

## 6. 后端实现要求

| 层 | 职责 |
|----|------|
| Controller | 接收请求、参数校验、返回统一响应 |
| Service | 业务规则、权限过滤、事务控制 |
| Repository | 数据访问 |
| Entity | 数据库表映射 |
| DTO | 请求和响应数据结构 |
| Common | 统一响应、错误码、异常处理、权限上下文 |

后端必须实现：

- 全局异常处理。
- 参数校验错误统一返回。
- 业务错误统一返回。
- 分页查询。
- 角色权限判断。
- 初始化数据加载。

事务边界至少覆盖新增学生、停用学生、分配学生课程、录入成绩等关键写操作。

## 7. 数据库脚本要求

建议生成：

```text
database/
├── 001_schema.sql
├── 002_seed_roles.sql
├── 003_seed_demo_data.sql
└── README.md
```

`001_schema.sql` 必须包含 `sys_user`、`sys_role`、`student`、`class_info`、`teacher`、`course`、`teacher_course`、`student_course`、`student_score`，并包含主键、唯一约束、非空约束、成绩范围约束和必要索引。

初始化数据必须包含系统管理员、教务管理员、班主任、任课教师、示例班级、示例教师、示例课程、示例学生、示例课程关系和示例成绩。

## 8. 部署与运行脚本要求

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

`env.example` 至少包含：

```text
DB_HOST=localhost
DB_PORT=5432
DB_NAME=school_edu
DB_USER=school_edu
DB_PASSWORD=school_edu
BACKEND_PORT=8080
FRONTEND_PORT=5173
```

启动脚本应检查运行依赖、启动数据库、执行初始化脚本或提示初始化方式、启动后端、启动前端并输出访问地址。

## 9. 测试与验证要求

后端或接口测试必须覆盖：

| 测试项 | 覆盖规则 |
|--------|----------|
| 登录失败 | REQ-001 |
| 学号重复 | REQ-003 |
| 班主任数据过滤 | REQ-003 |
| 学生课程重复分配 | REQ-006 |
| 成绩边界 0、100、-1、101 | REQ-007 |
| 教师越权录入成绩 | REQ-007 |

前端验证必须覆盖不同角色菜单、学生管理字段完整性、成绩录入范围校验和 API 错误信息展示。

AI-Agent 生成代码后，应提供后端测试、前端启动、后端启动和部署启动命令。实际命令可根据最终技术栈调整，但必须写入项目根 `README.md` 或 `deploy/README.md`。

## 10. 全局人工审查点

- 是否覆盖 REQ-001 至 REQ-007。
- 是否实现字段、唯一性、状态和范围约束。
- 是否存在越权查询或越权写入。
- 是否只依赖前端校验。
- 是否有硬编码密码或敏感信息。
- 是否能本地启动。
- 是否有基础测试或验证脚本。
- 是否有部署说明。
