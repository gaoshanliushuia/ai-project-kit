insert into sys_user (id, username, display_name, role_code, status)
values
  (1, 'academic_admin', '教务管理员', 'academic_admin', 'active'),
  (2, 'head_teacher_01', '张老师', 'head_teacher', 'active'),
  (3, 'teacher_zhang', '张老师', 'teacher', 'active');

insert into class_info (id, grade_name, class_name, head_teacher_id, status)
values
  (1, '七年级', '七年级一班', 1, 'active'),
  (2, '七年级', '七年级二班', 2, 'active');

insert into student (id, student_no, name, gender, class_id, enrollment_year, status)
values
  (1, 'S2026001', '陈一', 'female', 1, 2026, 'active'),
  (2, 'S2026002', '李明', 'male', 1, 2026, 'active'),
  (3, 'S2026003', '王小雨', 'female', 2, 2026, 'active');

insert into student_score (id, term, student_id, course_id, teacher_id, score, remark)
values
  (1, '2026-S1', 1, 1, 1, 92, '');
