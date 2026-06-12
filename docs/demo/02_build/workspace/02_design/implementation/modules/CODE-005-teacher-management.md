# CODE-005 教师管理与任课关系开发实现文档

## 1. 模块标识

| 项 | 内容 |
|----|------|
| 模块名称 | 教师管理与任课关系 |
| CODE 编号 | CODE-005 |
| 关联需求 | REQ-005 |
| 关联设计 | DES-005 |
| 关联数据 | DB-005, DB-006, DB-007 |
| 依赖模块 | CODE-001 |

## 2. 功能目标

维护教师基础信息和教师任课关系，为学生课程分配和成绩录入权限提供依据。

## 3. 前端实现要求

页面：`TeacherView`

路由：`/teachers`

| 区域 | 要求 |
|------|------|
| 查询条件 | 教师工号、教师姓名、任课课程、状态 |
| 列表字段 | 教师工号、姓名、性别、任课课程、状态、操作 |
| 表单字段 | 教师工号、姓名、性别、状态 |
| 任课关系 | 可在教师编辑页中使用课程多选维护 |

建议文件：

- `frontend/src/views/TeacherView.vue`
- `frontend/src/api/teacherApi.js`

## 4. 后端接口要求

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/teachers` | GET | 分页查询教师 |
| `/api/teachers` | POST | 新增教师 |
| `/api/teachers/{id}` | GET | 查看教师详情 |
| `/api/teachers/{id}` | PUT | 编辑教师 |
| `/api/teachers/{id}/courses` | PUT | 维护教师任课课程 |
| `/api/teachers/{id}/disable` | POST | 停用教师 |

建议后端文件：

- `TeacherController`
- `TeacherService`
- `TeacherRepository`
- `TeacherCourseRepository`
- `TeacherEntity`
- `TeacherCourseEntity`
- `TeacherCreateRequest`
- `TeacherUpdateRequest`
- `TeacherCourseUpdateRequest`
- `TeacherResponse`

## 5. 数据约束

| 字段 | 约束 |
|------|------|
| `teacherNo` | 必填、全校唯一、最大 32 字符 |
| `name` | 必填、最大 64 字符 |
| `gender` | 可为空；如填写必须是 `male` 或 `female` |
| `courseIds` | 每个课程必须为 active |
| `teacher_course` | 同一 active 教师课程关系不能重复 |

## 6. 业务规则

- 新增教师时必须校验教师工号唯一。
- 维护任课关系时，传入课程列表应覆盖当前 active 任课关系。
- 如果需要保留历史，可将旧关系置为 disabled。
- 停用教师后，不能再新增以该教师为任课教师的学生课程关系。
- 任课教师只能录入自己任课课程的成绩。

## 7. 异常和错误码

| 场景 | 错误码 |
|------|--------|
| 教师工号重复 | `DUPLICATE_DATA` |
| 课程不存在或停用 | `BUSINESS_RULE_FAILED` |
| 教师不存在 | `NOT_FOUND` |
| 停用教师继续被新课程关系引用 | `BUSINESS_RULE_FAILED` |
| 字段缺失或格式错误 | `VALIDATION_ERROR` |

## 8. 测试与验证

- 重复教师工号保存失败。
- 教师任课关系可维护并能被学生课程和成绩模块引用。
- 停用教师不能继续用于新课程关系。
- 任课关系中不能绑定 disabled 课程。
- 教师是否任教某课程的查询方法可被成绩模块复用。

## 9. AI-Agent 生成要求

- 先读取 `global-implementation-requirements-v1.0.md`。
- 前端教师表单要能显示和维护任课课程。
- Service 层要封装“教师是否任教某课程”的查询方法，供学生课程和成绩模块复用。
- 如果数据库设计中未明确 `teacher_course` 细节，必须标记为 Demo 实现假设并保持与 DB 编号映射。

## 10. 人工审查点

- 教师工号唯一性是否同时在后端和数据库层保护。
- 任课关系覆盖策略是否清楚。
- 停用教师对学生课程和成绩录入的影响是否一致。
- 成绩模块是否能复用任课关系校验。
