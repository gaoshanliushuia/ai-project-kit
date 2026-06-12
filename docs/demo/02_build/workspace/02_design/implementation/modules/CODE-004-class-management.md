# CODE-004 班级管理开发实现文档

## 1. 模块标识

| 项 | 内容 |
|----|------|
| 模块名称 | 班级管理 |
| CODE 编号 | CODE-004 |
| 关联需求 | REQ-004 |
| 关联设计 | DES-004 |
| 关联数据 | DB-004, DB-005 |
| 依赖模块 | CODE-001, CODE-005 |

## 2. 功能目标

维护年级、班级、班主任和班级状态，为学生归属和班主任数据权限提供基础数据。

## 3. 前端实现要求

页面：`ClassView`

路由：`/classes`

| 区域 | 要求 |
|------|------|
| 查询条件 | 年级、班级名称、班主任、状态 |
| 列表字段 | 年级、班级名称、班主任、学生人数、状态、操作 |
| 表单字段 | 年级、班级名称、班主任 |
| 停用操作 | 停用班级时需弹出风险提示 |

建议文件：

- `frontend/src/views/ClassView.vue`
- `frontend/src/api/classApi.js`

## 4. 后端接口要求

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/classes` | GET | 分页查询班级 |
| `/api/classes` | POST | 新增班级 |
| `/api/classes/{id}` | GET | 查看班级详情 |
| `/api/classes/{id}` | PUT | 编辑班级 |
| `/api/classes/{id}/disable` | POST | 停用班级 |

建议后端文件：

- `ClassInfoController`
- `ClassInfoService`
- `ClassInfoRepository`
- `ClassInfoEntity`
- `ClassCreateRequest`
- `ClassUpdateRequest`
- `ClassQueryRequest`
- `ClassResponse`

## 5. 数据约束

| 字段 | 约束 |
|------|------|
| `gradeName` | 必填，例如七年级、八年级 |
| `className` | 必填，同一年级内唯一 |
| `headTeacherId` | 可为空；不为空时必须引用 active 教师 |
| `status` | 新增默认为 `active` |

## 6. 业务规则

- 同一年级不能存在两个相同班级名称。
- 班主任必须是 active 教师。
- 停用班级前，如果班级下存在 active 学生，应提示风险。
- Demo 可禁止停用有 active 学生的班级，也可要求先转移学生；实现时必须在代码注释或 README 中说明选择。
- 班级被停用后，学生新增和编辑不能选择该班级。

## 7. 异常和错误码

| 场景 | 错误码 |
|------|--------|
| 同一年级班级名称重复 | `DUPLICATE_DATA` |
| 班主任不存在或停用 | `BUSINESS_RULE_FAILED` |
| 有 active 学生时停用被拒绝 | `BUSINESS_RULE_FAILED` |
| 班级不存在 | `NOT_FOUND` |
| 字段缺失或格式错误 | `VALIDATION_ERROR` |

## 8. 测试与验证

- 同一年级重复班级保存失败。
- 不同年级可存在相同班级名称。
- 绑定不存在或 disabled 教师失败。
- 有 active 学生的班级停用时按规则处理并给出清晰提示。
- 停用班级不能被学生新增和编辑选择。

## 9. AI-Agent 生成要求

- 先读取 `global-implementation-requirements-v1.0.md`。
- 生成班级查询时可返回 `studentCount`，用于前端展示。
- 不要把班级名称唯一性只放在前端，后端和数据库都要保护。
- 停用班级的 Demo 处理策略必须明确，不允许静默失败。

## 10. 人工审查点

- 年级内唯一性是否可靠。
- 班主任引用是否与教师状态联动。
- 停用班级策略是否与学生管理模块一致。
- 班主任权限上下文是否能引用班级关系。
