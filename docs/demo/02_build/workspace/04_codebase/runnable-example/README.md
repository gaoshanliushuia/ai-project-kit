# 可运行代码示例

本目录是 `04_codebase` 阶段的可运行代码示例，用于展示 AI-Agent 在读取 `implementation-plan-v1.0.md` 后，应该生成什么类型的工程产物。

它不是完整生产系统，而是一个最小可运行前后端 Demo，覆盖：

- 当前用户和角色菜单。
- 学生列表查询。
- 重复学号校验。
- 成绩列表查询。
- 成绩 0-100 后端校验。
- 前端静态页面。
- 后端 API。
- 数据库 schema/seed 示例。
- 本地启动脚本。
- 行为测试。

## 目录结构

```text
runnable-example/
├── backend/
│   ├── app.mjs
│   └── server.mjs
├── frontend/
│   ├── index.html
│   ├── main.js
│   └── style.css
├── database/
│   ├── 001_schema.sql
│   └── 002_seed_demo_data.sql
├── deploy/
│   ├── env.example
│   ├── start-local.ps1
│   └── start-local.sh
├── tests/
│   └── app.test.mjs
└── package.json
```

## 运行方式

```bash
npm start
```

访问：

```text
http://localhost:8080
```

## 测试

```bash
npm test
```

## API 示例

```text
GET  /api/auth/profile?username=academic_admin
GET  /api/students
POST /api/students
GET  /api/scores
POST /api/scores
```

## 与 implementation-plan 的关系

本示例重点落地 `implementation-plan-v1.0.md` 中的以下要求：

- 统一响应结构。
- 角色菜单。
- 学号唯一校验。
- 班主任数据过滤。
- 成绩范围校验。
- 任课教师权限校验。
- 前端页面调用后端 API。
- 可运行脚本和测试命令。

真实项目中应继续按 `CODE-001` 到 `CODE-007` 逐模块扩展，补齐班级管理、教师管理、学生课程管理等完整代码。
