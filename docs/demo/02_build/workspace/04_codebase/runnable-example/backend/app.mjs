const menus = [
  { key: "home", label: "主页", path: "/" },
  { key: "students", label: "学生管理", path: "/students" },
  { key: "classes", label: "班级管理", path: "/classes" },
  { key: "teachers", label: "教师管理", path: "/teachers" },
  { key: "studentCourses", label: "学生课程管理", path: "/student-courses" },
  { key: "scores", label: "学生成绩管理", path: "/scores" },
];

const menuByRole = {
  academic_admin: ["home", "students", "classes", "teachers", "studentCourses", "scores"],
  head_teacher: ["home", "students", "scores"],
  teacher: ["home", "studentCourses", "scores"],
};

function ok(data) {
  return { success: true, code: "OK", message: "success", data };
}

function fail(code, message) {
  return { success: false, code, message, data: null };
}

function createSeedData() {
  return {
    users: [
      {
        username: "academic_admin",
        password: "demo123",
        name: "教务管理员",
        roleCode: "academic_admin",
        status: "active",
      },
      {
        username: "head_teacher_01",
        password: "demo123",
        name: "张老师",
        roleCode: "head_teacher",
        teacherId: 1,
        classId: 1,
        status: "active",
      },
      {
        username: "teacher_zhang",
        password: "demo123",
        name: "张老师",
        roleCode: "teacher",
        teacherId: 1,
        status: "active",
      },
    ],
    classes: [
      { id: 1, gradeName: "七年级", className: "七年级一班", headTeacherId: 1, status: "active" },
      { id: 2, gradeName: "七年级", className: "七年级二班", headTeacherId: 2, status: "active" },
    ],
    teachers: [
      { id: 1, teacherNo: "T001", name: "张老师", status: "active" },
      { id: 2, teacherNo: "T002", name: "李老师", status: "active" },
    ],
    courses: [
      { id: 1, courseCode: "CHN", courseName: "语文", status: "active" },
      { id: 2, courseCode: "MATH", courseName: "数学", status: "active" },
    ],
    teacherCourses: [
      { id: 1, teacherId: 1, courseId: 1, status: "active" },
      { id: 2, teacherId: 2, courseId: 2, status: "active" },
    ],
    students: [
      {
        id: 1,
        studentNo: "S2026001",
        name: "陈一",
        gender: "female",
        classId: 1,
        enrollmentYear: 2026,
        status: "active",
      },
      {
        id: 2,
        studentNo: "S2026002",
        name: "李明",
        gender: "male",
        classId: 1,
        enrollmentYear: 2026,
        status: "active",
      },
      {
        id: 3,
        studentNo: "S2026003",
        name: "王小雨",
        gender: "female",
        classId: 2,
        enrollmentYear: 2026,
        status: "active",
      },
    ],
    studentCourses: [
      { id: 1, term: "2026-S1", studentId: 1, courseId: 1, teacherId: 1, status: "active" },
      { id: 2, term: "2026-S1", studentId: 2, courseId: 1, teacherId: 1, status: "active" },
    ],
    scores: [{ id: 1, term: "2026-S1", studentId: 1, courseId: 1, teacherId: 1, score: 92, remark: "" }],
  };
}

function withNames(data, record) {
  const student = data.students.find((item) => item.id === record.studentId);
  const course = data.courses.find((item) => item.id === record.courseId);
  const teacher = data.teachers.find((item) => item.id === record.teacherId);
  const classInfo = student ? data.classes.find((item) => item.id === student.classId) : undefined;

  return {
    ...record,
    studentName: student?.name,
    className: classInfo?.className,
    courseName: course?.courseName,
    teacherName: teacher?.name,
  };
}

export function createDemoApp(seed = createSeedData()) {
  const data = structuredClone(seed);

  function getProfile(username) {
    const user = data.users.find((item) => item.username === username);
    if (!user) return fail("NOT_FOUND", "用户不存在");
    if (user.status !== "active") return fail("FORBIDDEN", "账号已停用");

    return ok({
      username: user.username,
      name: user.name,
      roleCode: user.roleCode,
      teacherId: user.teacherId,
      classId: user.classId,
      menus: menus.filter((menu) => menuByRole[user.roleCode]?.includes(menu.key)),
    });
  }

  function listStudents(currentUser, query = {}) {
    let items = data.students;

    if (currentUser.roleCode === "head_teacher") {
      items = items.filter((student) => student.classId === currentUser.classId);
    }

    if (query.name) {
      items = items.filter((student) => student.name.includes(query.name));
    }

    return ok(items.map((student) => ({ ...student, className: data.classes.find((item) => item.id === student.classId)?.className })));
  }

  function createStudent(currentUser, request) {
    if (currentUser.roleCode !== "academic_admin") return fail("FORBIDDEN", "无权新增学生");
    if (!request.studentNo || !request.name || !request.gender || !request.classId || !request.enrollmentYear) {
      return fail("VALIDATION_ERROR", "学生必填字段不完整");
    }
    if (data.students.some((student) => student.studentNo === request.studentNo)) {
      return fail("DUPLICATE_DATA", "学号已存在");
    }
    const classInfo = data.classes.find((item) => item.id === request.classId && item.status === "active");
    if (!classInfo) return fail("BUSINESS_RULE_FAILED", "班级不存在或已停用");

    const student = {
      id: Math.max(...data.students.map((item) => item.id)) + 1,
      status: "active",
      ...request,
    };
    data.students.push(student);
    return ok(student);
  }

  function createScore(currentUser, request) {
    if (!Number.isInteger(request.score) || request.score < 0 || request.score > 100) {
      return fail("VALIDATION_ERROR", "成绩必须在 0-100 之间");
    }

    const relation = data.studentCourses.find(
      (item) =>
        item.term === request.term &&
        item.studentId === request.studentId &&
        item.courseId === request.courseId &&
        item.status === "active",
    );
    if (!relation) return fail("BUSINESS_RULE_FAILED", "学生未绑定该课程");

    if (currentUser.roleCode === "teacher" && relation.teacherId !== currentUser.teacherId) {
      return fail("FORBIDDEN", "不能录入非任教课程成绩");
    }

    if (data.scores.some((item) => item.term === request.term && item.studentId === request.studentId && item.courseId === request.courseId)) {
      return fail("DUPLICATE_DATA", "成绩已存在");
    }

    const score = {
      id: Math.max(...data.scores.map((item) => item.id)) + 1,
      teacherId: relation.teacherId,
      remark: "",
      ...request,
    };
    data.scores.push(score);
    return ok(score);
  }

  function listScores(currentUser) {
    let items = data.scores;
    if (currentUser.roleCode === "teacher") {
      items = items.filter((score) => score.teacherId === currentUser.teacherId);
    }
    if (currentUser.roleCode === "head_teacher") {
      items = items.filter((score) => {
        const student = data.students.find((item) => item.id === score.studentId);
        return student?.classId === currentUser.classId;
      });
    }
    return ok(items.map((item) => withNames(data, item)));
  }

  return {
    data,
    getProfile,
    listStudents,
    createStudent,
    createScore,
    listScores,
  };
}

export { createSeedData, fail, ok };
