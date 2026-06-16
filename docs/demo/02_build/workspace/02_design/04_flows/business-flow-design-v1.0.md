# 业务流程设计文档 v1.0

项目：中学教务管理系统 Demo

阶段：详细设计

## 1. 文档目标

本文定义核心业务主流程、异常流程和人工确认点，为开发实现计划、接口测试和人工验收提供流程依据。

## 2. 输入依据

| 输入产物 | 来源 |
|----------|------|
| 需求基线 | `01_req/workspace/03_baseline/requirements-baseline-v1.0.md` |
| 软件功能说明 | `02_build/workspace/02_design/software-function-spec-v1.0.md` |
| 模块设计 | `02_build/workspace/02_design/02_modules/module-design-v1.0.md` |
| 接口契约 | `02_build/workspace/02_design/03_interfaces/interface-contracts-v1.0.md` |

## 3. 登录与主页流程

```text
用户输入账号密码
  -> 前端校验必填
  -> 调用 /api/auth/login
  -> 后端校验账号、密码、状态、角色
  -> 返回 token、当前用户、角色、菜单
  -> 前端保存会话并进入主页
  -> 调用 /api/dashboard/summary
  -> 展示统计卡片和授权菜单
```

异常流程：

- 账号或密码为空：前端拦截或后端返回 `VALIDATION_ERROR`。
- 账号不存在或密码错误：后端返回 `BUSINESS_RULE_FAILED`。
- 账号停用：后端返回 `FORBIDDEN`。
- 未登录访问主页接口：后端返回 `UNAUTHORIZED`。

## 4. 学生维护流程

```text
教务管理员打开学生管理
  -> 查询班级下拉数据
  -> 填写学生资料
  -> 前端校验必填和基本格式
  -> 调用 /api/students
  -> 后端校验学号唯一、班级 active、字段范围
  -> 保存学生并返回结果
  -> 前端刷新学生列表
```

班主任查询流程：

```text
班主任打开学生管理
  -> 调用 /api/students
  -> 后端读取 currentClassId
  -> 忽略或限制请求中的其他班级参数
  -> 只返回本班学生
```

异常流程：

- 学号重复：返回 `DUPLICATE_DATA`。
- 班级不存在或停用：返回 `BUSINESS_RULE_FAILED`。
- 班主任越权查询：返回空结果或 `FORBIDDEN`，实现计划中需统一口径。

## 5. 班级与教师维护流程

班级维护主流程：

```text
教务管理员维护班级
  -> 填写年级、班级名称、班主任
  -> 后端校验同年级班级名称唯一
  -> 后端校验班主任为 active 教师
  -> 保存班级
```

教师维护主流程：

```text
教务管理员维护教师
  -> 填写教师资料
  -> 选择任课课程
  -> 后端校验教师工号唯一
  -> 后端校验课程 active
  -> 覆盖或更新教师任课关系
```

人工确认点：

- 有 active 学生的班级是否允许停用。
- 教师任课关系覆盖时是否保留历史。

## 6. 学生课程分配流程

```text
教务管理员打开学生课程管理
  -> 选择学期、学生、课程、任课教师
  -> 后端校验学生 active
  -> 后端校验课程 active
  -> 后端校验教师 active
  -> 后端校验教师任教该课程
  -> 后端校验 term + studentId + courseId 唯一
  -> 保存学生课程关系
```

异常流程：

- 学生、课程、教师停用：返回 `BUSINESS_RULE_FAILED`。
- 教师未任教课程：返回 `FORBIDDEN` 或 `BUSINESS_RULE_FAILED`。
- 重复分配：返回 `DUPLICATE_DATA`。

## 7. 成绩录入流程

```text
任课教师打开成绩管理
  -> 查询自己任教范围内学生课程关系
  -> 选择学生课程关系
  -> 输入成绩和备注
  -> 后端校验学生课程关系存在
  -> 后端校验当前教师任教该课程
  -> 后端校验成绩为 0-100
  -> 后端校验 term + studentId + courseId 唯一
  -> 保存成绩
```

查询权限流程：

- 教务管理员可查询全部成绩。
- 班主任只能查询本班成绩。
- 任课教师只能查询自己任教课程成绩。

异常流程：

- 成绩为空或超出范围：返回 `VALIDATION_ERROR`。
- 学生未绑定课程：返回 `BUSINESS_RULE_FAILED`。
- 任课教师越权：返回 `FORBIDDEN`。
- 重复录入成绩：返回 `DUPLICATE_DATA`。

## 8. 下游交接

交给开发实现计划：

- 每个流程对应一个或多个模块级实现任务。
- 异常流程必须落实到 Service 校验、错误码和测试。
- 人工确认点必须写入实现计划审查清单。

交给测试阶段：

- 登录失败、班主任过滤、课程重复分配、成绩边界和教师越权录入必须形成测试用例。
