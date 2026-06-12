import assert from "node:assert/strict";
import { test } from "node:test";

import { createDemoApp } from "../backend/app.mjs";

test("academic admin profile returns full menu", () => {
  const app = createDemoApp();
  const result = app.getProfile("academic_admin");

  assert.equal(result.success, true);
  assert.equal(result.data.roleCode, "academic_admin");
  assert.deepEqual(
    result.data.menus.map((menu) => menu.key),
    ["home", "students", "classes", "teachers", "studentCourses", "scores"],
  );
});

test("creating a duplicate student is rejected", () => {
  const app = createDemoApp();
  const result = app.createStudent(
    { roleCode: "academic_admin" },
    {
      studentNo: "S2026001",
      name: "重复学生",
      gender: "male",
      classId: 1,
      enrollmentYear: 2026,
    },
  );

  assert.equal(result.success, false);
  assert.equal(result.code, "DUPLICATE_DATA");
});

test("score outside 0-100 is rejected", () => {
  const app = createDemoApp();
  const result = app.createScore(
    { roleCode: "teacher", teacherId: 1 },
    {
      term: "2026-S1",
      studentId: 1,
      courseId: 1,
      score: 101,
      remark: "非法成绩",
    },
  );

  assert.equal(result.success, false);
  assert.equal(result.code, "VALIDATION_ERROR");
});
