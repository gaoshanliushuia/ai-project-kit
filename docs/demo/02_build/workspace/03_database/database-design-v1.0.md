# 数据库设计说明 v1.0

项目：中学教务管理系统 Demo

阶段：数据库设计

## 1. 输入依据

| 输入产物 | 来源 |
|----------|------|
| 软件功能说明文档 | `02_build/workspace/02_design/software-function-spec-v1.0.md` |
| 架构设计说明 | `02_build/workspace/01_architecture/architecture-design-v1.0.md` |
| 需求基线 | `01_req/workspace/03_baseline/requirements-baseline-v1.0.md` |

## 2. 核心数据表

| DB 编号 | 表名 | 说明 | 关联需求 |
|---------|------|------|----------|
| DB-001 | `sys_user` | 系统用户账号 | REQ-001 |
| DB-002 | `sys_role` | 系统角色 | REQ-002 |
| DB-003 | `student` | 学生信息 | REQ-003 |
| DB-004 | `class_info` | 班级信息 | REQ-004 |
| DB-005 | `teacher` | 教师信息 | REQ-005 |
| DB-006 | `course` | 课程信息 | REQ-006 |
| DB-007 | `teacher_course` | 教师任课关系 | REQ-005 |
| DB-008 | `student_course` | 学生课程关系 | REQ-006 |
| DB-009 | `student_score` | 学生成绩 | REQ-007 |

## 3. 关键字段设计

### 3.1 student

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | bigint | PK | 主键 |
| student_no | varchar(32) | unique, not null | 学号 |
| name | varchar(64) | not null | 姓名 |
| gender | varchar(16) | not null | 性别 |
| class_id | bigint | not null | 班级 ID |
| enrollment_year | int | not null | 入学年份 |
| status | varchar(16) | not null | active / disabled |

### 3.2 class_info

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | bigint | PK | 主键 |
| grade_name | varchar(32) | not null | 年级 |
| class_name | varchar(64) | not null | 班级名称 |
| head_teacher_id | bigint | nullable | 班主任教师 ID |
| status | varchar(16) | not null | active / disabled |

唯一性规则：

```text
unique(grade_name, class_name)
```

### 3.3 teacher

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | bigint | PK | 主键 |
| teacher_no | varchar(32) | unique, not null | 教师工号 |
| name | varchar(64) | not null | 教师姓名 |
| gender | varchar(16) | nullable | 性别 |
| status | varchar(16) | not null | active / disabled |

### 3.4 course

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | bigint | PK | 主键 |
| course_code | varchar(32) | unique, not null | 课程编号 |
| course_name | varchar(64) | not null | 课程名称 |
| status | varchar(16) | not null | active / disabled |

### 3.5 teacher_course

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | bigint | PK | 主键 |
| teacher_id | bigint | not null | 教师 ID |
| course_id | bigint | not null | 课程 ID |
| status | varchar(16) | not null | active / disabled |

唯一性规则：

```text
unique(teacher_id, course_id, status)
```

### 3.6 student_course

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | bigint | PK | 主键 |
| term | varchar(32) | not null | 学期 |
| student_id | bigint | not null | 学生 ID |
| course_id | bigint | not null | 课程 ID |
| teacher_id | bigint | not null | 任课教师 ID |
| status | varchar(16) | not null | active / disabled |

唯一性建议：

```text
unique(term, student_id, course_id, status)
```

Demo 中需注意：如果停用历史关系后允许重新分配，可改为在服务层保证 active 状态唯一。

### 3.7 student_score

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | bigint | PK | 主键 |
| term | varchar(32) | not null | 学期 |
| student_id | bigint | not null | 学生 ID |
| course_id | bigint | not null | 课程 ID |
| teacher_id | bigint | not null | 录入教师 ID |
| score | int | not null | 成绩，0-100 |
| remark | varchar(255) | nullable | 备注 |

## 4. 示例 DDL 片段

```sql
create table student (
  id bigint primary key,
  student_no varchar(32) not null unique,
  name varchar(64) not null,
  gender varchar(16) not null,
  class_id bigint not null,
  enrollment_year int not null,
  status varchar(16) not null
);

create table class_info (
  id bigint primary key,
  grade_name varchar(32) not null,
  class_name varchar(64) not null,
  head_teacher_id bigint,
  status varchar(16) not null,
  constraint uk_class_grade_name unique (grade_name, class_name)
);

create table teacher (
  id bigint primary key,
  teacher_no varchar(32) not null unique,
  name varchar(64) not null,
  gender varchar(16),
  status varchar(16) not null
);

create table course (
  id bigint primary key,
  course_code varchar(32) not null unique,
  course_name varchar(64) not null,
  status varchar(16) not null
);

create table teacher_course (
  id bigint primary key,
  teacher_id bigint not null,
  course_id bigint not null,
  status varchar(16) not null,
  constraint uk_teacher_course unique (teacher_id, course_id, status)
);

create table student_course (
  id bigint primary key,
  term varchar(32) not null,
  student_id bigint not null,
  course_id bigint not null,
  teacher_id bigint not null,
  status varchar(16) not null,
  constraint uk_student_course unique (term, student_id, course_id, status)
);

create table student_score (
  id bigint primary key,
  term varchar(32) not null,
  student_id bigint not null,
  course_id bigint not null,
  teacher_id bigint not null,
  score int not null,
  remark varchar(255),
  constraint uk_student_score unique (term, student_id, course_id),
  constraint chk_student_score_range check (score >= 0 and score <= 100)
);
```

## 5. 初始化数据

| 类型 | 示例 |
|------|------|
| 角色 | 系统管理员、教务管理员、班主任、任课教师 |
| 班级 | 七年级一班、七年级二班 |
| 课程 | 语文、数学、英语 |
| 教师 | 张老师、李老师、王老师 |

## 6. 索引设计

| 表名 | 索引 | 目的 |
|------|------|------|
| `student` | `idx_student_class_id(class_id)` | 班主任按班级查询学生 |
| `student` | `idx_student_status(status)` | 过滤启用学生 |
| `student_course` | `idx_student_course_student(student_id)` | 查询学生课程 |
| `student_course` | `idx_student_course_teacher(teacher_id)` | 任课教师查询课程学生 |
| `student_score` | `idx_score_student(student_id)` | 学生维度查询成绩 |
| `student_score` | `idx_score_class_course(term, course_id)` | 成绩列表按学期课程查询 |

## 7. 脚本交付要求

真实项目交付时，不应只提供 DDL 片段，至少应拆成以下脚本：

| 脚本 | 内容 | 执行顺序 |
|------|------|----------|
| `001_schema.sql` | 建表、主键、唯一约束、检查约束、索引 | 1 |
| `002_seed_roles.sql` | 系统角色、菜单、演示用户 | 2 |
| `003_seed_demo_data.sql` | 班级、教师、课程、学生、课程关系、成绩 | 3 |
| `rollback_001_schema.sql` | Demo 环境清理或回滚脚本 | 按需 |

## 8. 数据质量规则

| 规则编号 | 规则 | 落点 |
|----------|------|------|
| DQ-001 | 学号全校唯一 | `student.student_no` 唯一约束 + Service 校验 |
| DQ-002 | 教师工号全校唯一 | `teacher.teacher_no` 唯一约束 + Service 校验 |
| DQ-003 | 同一年级班级名唯一 | `class_info(grade_name, class_name)` 唯一约束 |
| DQ-004 | active 学生课程关系不可重复 | Service 校验 + `student_course` 约束 |
| DQ-005 | 成绩范围 0-100 | `student_score` check 约束 + Service 校验 |
| DQ-006 | 任课教师才能录入成绩 | Service 校验 `teacher_course` 和 `student_course` |

## 9. 数据库评审清单

进入编码阶段前必须确认：

| 检查项 | 结论 |
|--------|------|
| 是否覆盖软件功能说明中的所有数据对象 | 待评审 |
| 是否定义主键、唯一约束和必要索引 | 待评审 |
| 是否定义成绩范围等数据约束 | 待评审 |
| 是否有初始化数据脚本 | 待评审 |
| 是否有回滚或重建说明 | 待评审 |
| 是否说明哪些规则由数据库约束，哪些规则由 Service 层实现 | 待评审 |

## 10. AI-Agent 与人工分工

| 工作 | 执行主体 |
|------|----------|
| 根据功能说明生成候选表结构 | AI-Agent |
| 生成字段字典和 DDL 初稿 | AI-Agent |
| 确认主键、唯一约束、索引和字段类型 | 人工 |
| 确认数据安全、迁移和回滚策略 | 人工 |

## 11. 下游交接

交给编码阶段：

- 表结构和字段字典。
- DDL 片段。
- 约束和校验规则。

交给测试阶段：

- 测试数据准备方式。
- 成绩边界值。
- 学生课程关系唯一性规则。
