# 接口契约文档 v1.0

项目：中学教务管理系统 Demo

阶段：详细设计

## 1. 文档目标

本文集中定义前后端 REST API 契约，包括路径、方法、请求 DTO、响应 DTO、权限要求和错误码。后续数据库设计、开发实现计划和测试用例必须引用本文，不应从代码中反推接口。

## 2. 输入依据

| 输入产物 | 来源 |
|----------|------|
| 软件功能说明 | `02_build/workspace/02_design/software-function-spec-v1.0.md` |
| 模块设计 | `02_build/workspace/02_design/02_modules/module-design-v1.0.md` |
| 架构设计 | `02_build/workspace/01_architecture/architecture-design-v1.0.md` |

## 3. 通用响应

成功响应：

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

## 4. 通用错误码

| 错误码 | 场景 |
|--------|------|
| `VALIDATION_ERROR` | 请求参数缺失、类型错误或范围错误 |
| `UNAUTHORIZED` | 未登录或 Token 无效 |
| `FORBIDDEN` | 当前角色无权访问或越权操作 |
| `NOT_FOUND` | 目标数据不存在 |
| `DUPLICATE_DATA` | 唯一性冲突 |
| `BUSINESS_RULE_FAILED` | 业务规则不满足 |

## 5. 接口总表

| DES | 接口 | 方法 | 请求 DTO | 响应 DTO | 权限 |
|-----|------|------|----------|----------|------|
| DES-001 | `/api/auth/login` | POST | `LoginRequest` | `LoginResponse` | 未登录可访问 |
| DES-001 | `/api/auth/logout` | POST | 无 | `CommonResponse` | 已登录 |
| DES-001 | `/api/auth/profile` | GET | 无 | `CurrentUserResponse` | 已登录 |
| DES-002 | `/api/dashboard/summary` | GET | 无 | `DashboardSummaryResponse` | 已登录 |
| DES-003 | `/api/students` | GET | `StudentQueryRequest` | `Page<StudentResponse>` | 教务管理员、班主任 |
| DES-003 | `/api/students` | POST | `StudentCreateRequest` | `StudentResponse` | 教务管理员 |
| DES-003 | `/api/students/{id}` | GET | 路径参数 `id` | `StudentResponse` | 教务管理员、班主任 |
| DES-003 | `/api/students/{id}` | PUT | `StudentUpdateRequest` | `StudentResponse` | 教务管理员 |
| DES-003 | `/api/students/{id}/disable` | POST | 路径参数 `id` | `CommonResponse` | 教务管理员 |
| DES-004 | `/api/classes` | GET | `ClassQueryRequest` | `Page<ClassResponse>` | 教务管理员 |
| DES-004 | `/api/classes` | POST | `ClassCreateRequest` | `ClassResponse` | 教务管理员 |
| DES-004 | `/api/classes/{id}` | PUT | `ClassUpdateRequest` | `ClassResponse` | 教务管理员 |
| DES-004 | `/api/classes/{id}/disable` | POST | 路径参数 `id` | `CommonResponse` | 教务管理员 |
| DES-005 | `/api/teachers` | GET | `TeacherQueryRequest` | `Page<TeacherResponse>` | 教务管理员 |
| DES-005 | `/api/teachers` | POST | `TeacherCreateRequest` | `TeacherResponse` | 教务管理员 |
| DES-005 | `/api/teachers/{id}` | PUT | `TeacherUpdateRequest` | `TeacherResponse` | 教务管理员 |
| DES-005 | `/api/teachers/{id}/courses` | PUT | `TeacherCourseUpdateRequest` | `TeacherResponse` | 教务管理员 |
| DES-005 | `/api/teachers/{id}/disable` | POST | 路径参数 `id` | `CommonResponse` | 教务管理员 |
| DES-006 | `/api/student-courses` | GET | `StudentCourseQueryRequest` | `Page<StudentCourseResponse>` | 教务管理员、任课教师 |
| DES-006 | `/api/student-courses` | POST | `StudentCourseCreateRequest` | `StudentCourseResponse` | 教务管理员 |
| DES-006 | `/api/student-courses/{id}/disable` | POST | 路径参数 `id` | `CommonResponse` | 教务管理员 |
| DES-007 | `/api/scores` | GET | `ScoreQueryRequest` | `Page<ScoreResponse>` | 教务管理员、班主任、任课教师 |
| DES-007 | `/api/scores` | POST | `ScoreCreateRequest` | `ScoreResponse` | 任课教师 |
| DES-007 | `/api/scores/{id}` | PUT | `ScoreUpdateRequest` | `ScoreResponse` | 任课教师 |

## 6. DTO 字段摘要

| DTO | 关键字段 |
|-----|----------|
| `LoginRequest` | `username`, `password` |
| `StudentCreateRequest` | `studentNo`, `name`, `gender`, `classId`, `enrollmentYear` |
| `ClassCreateRequest` | `gradeName`, `className`, `headTeacherId` |
| `TeacherCreateRequest` | `teacherNo`, `name`, `gender`, `courseIds` |
| `StudentCourseCreateRequest` | `term`, `studentId`, `courseId`, `teacherId` |
| `ScoreCreateRequest` | `term`, `studentId`, `courseId`, `score`, `remark` |

## 7. 设计规则

- 所有列表接口默认分页。
- 所有写接口必须校验角色权限。
- 所有业务接口必须读取统一权限上下文。
- DTO 字段必须与软件功能说明和数据库设计保持一致。
- 错误响应不得暴露数据库异常、堆栈或内部类名。

## 8. 下游交接

交给开发实现计划：

- 按接口总表拆分 Controller、Service、DTO 和测试。
- 每个 CODE 模块实现时必须引用对应 DES 接口。

交给测试阶段：

- 按接口契约设计接口测试、权限测试、异常测试和边界测试。
