# CODE-006 学生课程管理开发实现文档

## 1. 模块标识

| 项 | 内容 |
|----|------|
| 模块名称 | 学生课程管理 |
| CODE 编号 | CODE-006 |
| 关联需求 | REQ-006 |
| 关联设计 | DES-006 |
| 关联数据 | DB-008 |
| 依赖模块 | CODE-003, CODE-005 |

## 2. 功能目标

维护学生在某学期与课程、任课教师之间的关系，防止重复分配，为成绩录入提供前置依据。

## 3. 前端实现要求

页面：`StudentCourseView`

路由：`/student-courses`

| 区域 | 要求 |
|------|------|
| 查询条件 | 学期、学生、班级、课程、任课教师、状态 |
| 列表字段 | 学期、学生、班级、课程、任课教师、状态、操作 |
| 表单字段 | 学期、学生、课程、任课教师 |
| 下拉数据 | 新增时只显示 active 学生、active 课程、active 教师 |

建议文件：

- `frontend/src/views/StudentCourseView.vue`
- `frontend/src/api/studentCourseApi.js`

## 4. 后端接口要求

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/student-courses` | GET | 分页查询学生课程关系 |
| `/api/student-courses` | POST | 新增学生课程关系 |
| `/api/student-courses/{id}` | GET | 查看关系详情 |
| `/api/student-courses/{id}/disable` | POST | 停用学生课程关系 |

建议后端文件：

- `StudentCourseController`
- `StudentCourseService`
- `StudentCourseRepository`
- `StudentCourseEntity`
- `StudentCourseCreateRequest`
- `StudentCourseQueryRequest`
- `StudentCourseResponse`

## 5. 数据约束

| 字段 | 约束 |
|------|------|
| `term` | 必填，例如 `2026-S1` |
| `studentId` | 必须引用 active 学生 |
| `courseId` | 必须引用 active 课程 |
| `teacherId` | 必须引用 active 教师 |
| `status` | 新增默认为 active |

同一 `term + studentId + courseId` 只能存在一条 active 关系。

## 6. 业务规则

- 停用学生不能分配课程。
- 停用课程不能被分配。
- 停用教师不能作为任课教师。
- 教师必须已经绑定该课程的任课关系。
- 停用课程关系不删除历史成绩。
- 查询结果应包含学生姓名、班级名称、课程名称、教师姓名，不能只返回 ID。

## 7. 异常和错误码

| 场景 | 错误码 |
|------|--------|
| 学生不存在或停用 | `BUSINESS_RULE_FAILED` |
| 课程不存在或停用 | `BUSINESS_RULE_FAILED` |
| 教师不存在或停用 | `BUSINESS_RULE_FAILED` |
| 教师未任教该课程 | `FORBIDDEN` 或 `BUSINESS_RULE_FAILED`，项目需统一口径 |
| 重复分配同一课程 | `DUPLICATE_DATA` |
| 关系不存在 | `NOT_FOUND` |

## 8. 测试与验证

- 重复分配同一学生同一学期同一课程失败。
- 停用学生不能分配课程。
- 停用教师不能被绑定。
- 未任教该课程的教师不能被绑定。
- 停用课程关系后，历史成绩仍可查询。

## 9. AI-Agent 生成要求

- 先读取 `global-implementation-requirements-v1.0.md`。
- Service 层必须调用教师任课关系校验。
- 前端新增表单应在选择课程后过滤可选任课教师，或提交时由后端校验并返回明确错误。
- 唯一性校验必须在后端实现，数据库层也应有约束或唯一索引。

## 10. 人工审查点

- 学生、课程、教师状态是否全部校验。
- 任课关系校验是否复用教师模块能力。
- 重复分配是否无法并发绕过。
- 停用课程关系是否不会破坏成绩历史。
