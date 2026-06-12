# CODE-003 学生管理开发实现文档

## 1. 模块标识

| 项 | 内容 |
|----|------|
| 模块名称 | 学生管理 |
| CODE 编号 | CODE-003 |
| 关联需求 | REQ-003 |
| 关联设计 | DES-003 |
| 关联数据 | DB-003, DB-004 |
| 依赖模块 | CODE-001, CODE-004 |

## 2. 功能目标

维护学生基础信息，支持教务管理员新增、编辑、查询、停用学生；支持班主任查看本班学生。

## 3. 前端实现要求

页面：`StudentView`

路由：`/students`

| 区域 | 要求 |
|------|------|
| 查询条件 | 学号、姓名、班级、状态 |
| 列表字段 | 学号、姓名、性别、班级、入学年份、状态、操作 |
| 表单字段 | 学号、姓名、性别、班级、入学年份 |
| 按钮 | 教务管理员显示新增、编辑、停用；班主任只显示查询和查看 |

建议文件：

- `frontend/src/views/StudentView.vue`
- `frontend/src/api/studentApi.js`

## 4. 后端接口要求

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/students` | GET | 分页查询学生 |
| `/api/students` | POST | 新增学生 |
| `/api/students/{id}` | GET | 查看学生详情 |
| `/api/students/{id}` | PUT | 编辑学生 |
| `/api/students/{id}/disable` | POST | 停用学生 |

建议后端文件：

- `StudentController`
- `StudentService`
- `StudentRepository`
- `StudentEntity`
- `StudentCreateRequest`
- `StudentUpdateRequest`
- `StudentQueryRequest`
- `StudentResponse`

## 5. 数据约束

| 字段 | 约束 |
|------|------|
| `studentNo` | 必填、全校唯一、最大 32 字符 |
| `name` | 必填、最大 64 字符 |
| `gender` | 必须是 `male` 或 `female` |
| `classId` | 必须引用 active 班级 |
| `enrollmentYear` | 必须是合理年份，Demo 可约束为 2000-2100 |
| `status` | 系统维护，新增默认为 `active` |

## 6. 业务规则

- 新增学生时必须校验学号唯一。
- 编辑学生时不能修改为不存在或 disabled 的班级。
- 停用学生后，不允许新增学生课程关系。
- 班主任查询时必须按 `currentClassId` 过滤，即使用户在请求参数中传其他班级也不能越权。
- 前端校验不能替代后端校验。

## 7. 异常和错误码

| 场景 | 错误码 |
|------|--------|
| 学号重复 | `DUPLICATE_DATA` |
| 班级不存在或停用 | `BUSINESS_RULE_FAILED` |
| 班主任越权查询 | 返回空结果或 `FORBIDDEN`，项目需统一口径 |
| 学生不存在 | `NOT_FOUND` |
| 字段缺失或格式错误 | `VALIDATION_ERROR` |

## 8. 测试与验证

- 重复学号新增失败。
- 班级无效时不能保存学生。
- 班主任账号看不到其他班学生。
- 教务管理员可以新增、编辑、停用学生。
- 停用学生不能进入后续课程分配。

## 9. AI-Agent 生成要求

- 先读取 `global-implementation-requirements-v1.0.md`。
- Service 层必须集中实现唯一性、班级有效性和班主任过滤。
- 查询结果应返回班级展示名称，不要只返回 `classId`。
- 前端 `StudentView` 必须同时包含查询区、列表区和表单弹窗或表单区域。

## 10. 人工审查点

- 学号唯一性是否同时在后端和数据库层保护。
- 班主任过滤是否无法被请求参数绕过。
- 停用学生后是否影响课程分配。
- 表单字段是否与软件功能说明和数据库设计一致。
