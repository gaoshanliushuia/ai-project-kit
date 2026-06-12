create table sys_user (
  id bigint primary key,
  username varchar(64) not null unique,
  display_name varchar(64) not null,
  role_code varchar(32) not null,
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

create table student (
  id bigint primary key,
  student_no varchar(32) not null unique,
  name varchar(64) not null,
  gender varchar(16) not null,
  class_id bigint not null,
  enrollment_year int not null,
  status varchar(16) not null
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
