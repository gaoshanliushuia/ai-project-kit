# 状态与规则设计文档 v1.0

项目：中学教务管理系统 Demo

阶段：详细设计

## 1. 文档目标

本文定义系统状态字段、状态流转、禁止流转、唯一性规则、范围约束和跨模块业务规则，为数据库设计、开发实现计划和测试用例提供规则依据。

## 2. 输入依据

| 输入产物 | 来源 |
|----------|------|
| 需求基线 | `01_req/workspace/01_requirements/07_baseline/requirements-baseline-v1.0.md` |
| 软件功能说明 | `02_build/workspace/02_design/software-function-spec-v1.0.md` |
| 模块设计 | `02_build/workspace/02_design/02_modules/module-design-v1.0.md` |
| 流程设计 | `02_build/workspace/02_design/04_flows/business-flow-design-v1.0.md` |

## 3. 状态字段

| 对象 | 状态字段 | 取值 | 说明 |
|------|----------|------|------|
| 用户 | `status` | `active`, `disabled` | 停用用户不能登录 |
| 学生 | `status` | `active`, `disabled` | 停用学生不能新增课程关系 |
| 班级 | `status` | `active`, `disabled` | 停用班级不能被学生新增或编辑选择 |
| 教师 | `status` | `active`, `disabled` | 停用教师不能作为新课程关系任课教师 |
| 课程 | `status` | `active`, `disabled` | 停用课程不能被分配 |
| 教师任课关系 | `status` | `active`, `disabled` | active 关系用于学生课程和成绩权限校验 |
| 学生课程关系 | `status` | `active`, `disabled` | disabled 关系不参与新成绩录入，但历史成绩保留 |

## 4. 状态流转

```text
active -> disabled
```

Demo 中不设计从 `disabled` 恢复为 `active` 的流程。如真实项目需要恢复，应补充审批、影响分析和审计要求。

## 5. 禁止流转和影响

| 对象 | 禁止或限制规则 |
|------|----------------|
| 用户 | `disabled` 用户不能登录，也不能访问业务接口 |
| 学生 | `disabled` 学生不能新增学生课程关系 |
| 班级 | 存在 active 学生时停用策略需人工确认；停用后不能被学生选择 |
| 教师 | `disabled` 教师不能被绑定为任课教师 |
| 课程 | `disabled` 课程不能被分配给学生 |
| 学生课程关系 | 停用后不删除历史成绩 |

## 6. 唯一性规则

| 规则 | 适用对象 | 错误码 |
|------|----------|--------|
| 学号全校唯一 | Student | `DUPLICATE_DATA` |
| 同一年级班级名称唯一 | ClassInfo | `DUPLICATE_DATA` |
| 教师工号全校唯一 | Teacher | `DUPLICATE_DATA` |
| 课程编码唯一 | Course | `DUPLICATE_DATA` |
| 同一 active 教师课程关系不能重复 | TeacherCourse | `DUPLICATE_DATA` |
| 同一 `term + studentId + courseId` 只能存在一条 active 学生课程关系 | StudentCourse | `DUPLICATE_DATA` |
| 同一 `term + studentId + courseId` 只能存在一条成绩记录 | StudentScore | `DUPLICATE_DATA` |

## 7. 范围和格式约束

| 字段 | 约束 |
|------|------|
| `studentNo` | 必填，最大 32 字符 |
| `teacherNo` | 必填，最大 32 字符 |
| `name` | 必填，最大 64 字符 |
| `gender` | `male` 或 `female` |
| `enrollmentYear` | Demo 可约束为 2000-2100 |
| `term` | 必填，例如 `2026-S1` |
| `score` | 必填整数，范围 0-100 |
| `remark` | 可为空，最大 255 字符 |

## 8. 权限规则

| 角色 | 数据范围 |
|------|----------|
| 教务管理员 | 可维护学生、班级、教师、课程关系；可查询全部成绩 |
| 班主任 | 只能查询本班学生和本班成绩 |
| 任课教师 | 只能查询和维护自己任教课程相关成绩 |

权限过滤必须由后端实现。前端按钮隐藏只用于改善体验，不能作为安全边界。

## 9. 跨模块规则

- 学生管理依赖班级状态。
- 班级管理依赖教师状态。
- 学生课程管理依赖学生、课程、教师和教师任课关系。
- 成绩管理依赖学生课程关系和教师任课关系。
- 停用类操作不得物理删除数据。
- 历史成绩不因学生、教师、课程或课程关系停用而删除。

## 10. 下游交接

交给数据库设计：

- 状态字段、唯一约束、非空约束、成绩范围约束和必要索引。

交给开发实现计划：

- 每个模块的 Service 层必须实现本文件中的状态、唯一性、范围和权限规则。

交给测试阶段：

- 状态影响、唯一性冲突、成绩边界、权限过滤和跨模块依赖必须形成测试用例。
