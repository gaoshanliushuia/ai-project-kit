# CODE-001 登录与当前用户开发实现文档

## 1. 模块标识

| 项 | 内容 |
|----|------|
| 模块名称 | 登录与当前用户 |
| CODE 编号 | CODE-001 |
| 关联需求 | REQ-001 |
| 关联设计 | DES-001 |
| 关联数据 | DB-001, DB-002 |
| 依赖模块 | 无 |

## 2. 功能目标

提供用户登录、退出和当前用户信息查询能力。登录成功后，前端应能拿到当前用户、角色、菜单和必要的数据权限上下文。

## 3. 前端实现要求

页面：`LoginView`

路由：`/login`

字段和交互：

| 字段或元素 | 要求 |
|------------|------|
| username | 必填，最大 64 字符 |
| password | 必填，密码输入 |
| 登录按钮 | 登录中显示加载状态，防止重复提交 |
| 错误提示 | 登录失败时展示后端返回的业务错误 |

登录成功后跳转主页。已登录用户访问 `/login` 时可跳转主页。

建议文件：

- `frontend/src/views/LoginView.vue`
- `frontend/src/api/authApi.js`
- `frontend/src/stores/authStore.js`

## 4. 后端接口要求

| 接口 | 方法 | 请求 | 响应 |
|------|------|------|------|
| `/api/auth/login` | POST | `username`, `password` | token、用户信息、角色、菜单 |
| `/api/auth/logout` | POST | 无 | 退出成功 |
| `/api/auth/profile` | GET | token | 当前用户、角色、菜单、权限上下文 |

建议后端文件：

- `AuthController`
- `AuthService`
- `LoginRequest`
- `LoginResponse`
- `CurrentUserResponse`
- `CurrentUserContext`

## 5. 数据和业务规则

- `username` 必填，最大 64 字符。
- `password` 必填，Demo 可简化校验，但代码结构必须预留加密校验。
- 停用用户不能登录。
- 用户必须至少绑定一个角色。
- 返回菜单必须按角色过滤，不得返回未授权菜单。
- 角色和权限上下文必须由后端返回，前端不得硬编码全部权限规则。

## 6. 业务流程

```text
用户提交账号密码
  -> 校验参数
  -> 查询用户
  -> 判断用户是否存在、密码是否正确、状态是否启用
  -> 查询角色和菜单
  -> 生成 token 或会话
  -> 返回用户信息、角色、菜单和权限上下文
```

## 7. 异常和错误码

| 场景 | 错误码 |
|------|--------|
| 账号或密码为空 | `VALIDATION_ERROR` |
| 账号不存在或密码错误 | `BUSINESS_RULE_FAILED` |
| 账号停用 | `FORBIDDEN` |
| 用户未绑定角色 | `BUSINESS_RULE_FAILED` |
| 未登录访问 profile | `UNAUTHORIZED` |

## 8. 测试与验证

- 正确账号能登录并进入主页。
- 错误密码不能登录。
- 停用账号不能登录。
- 未登录访问 `/api/auth/profile` 返回未授权。
- 班主任、任课教师、教务管理员登录后菜单不同。

## 9. AI-Agent 生成要求

- 先读取 `global-implementation-requirements-v1.0.md`。
- 生成统一的 `CurrentUserContext` 或等价对象，供后续模块判断角色和数据范围。
- 不要把角色判断散落在前端页面里，后端必须能够独立完成权限判断。
- Demo 密码校验可以简化，但不得硬编码真实敏感信息。

## 10. 人工审查点

- 登录失败信息是否友好且不泄露数据库异常。
- token 或 session 模拟方式是否清晰标注为 Demo 简化。
- 菜单和权限上下文是否来自后端。
- 后续模块是否能复用统一权限上下文。
