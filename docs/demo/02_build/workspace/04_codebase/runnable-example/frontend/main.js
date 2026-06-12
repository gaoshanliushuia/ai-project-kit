const roleSelect = document.querySelector("#roleSelect");
const menus = document.querySelector("#menus");
const studentRows = document.querySelector("#studentRows");
const scoreRows = document.querySelector("#scoreRows");
const studentResult = document.querySelector("#studentResult");
const scoreResult = document.querySelector("#scoreResult");

function headers() {
  const roleCode = roleSelect.value;
  return {
    "Content-Type": "application/json",
    "x-role-code": roleCode,
    "x-teacher-id": "1",
    "x-class-id": "1",
  };
}

async function request(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      ...headers(),
      ...(options.headers || {}),
    },
  });
  return response.json();
}

function renderJson(target, payload) {
  target.textContent = JSON.stringify(payload, null, 2);
}

async function loadProfile() {
  const username =
    roleSelect.value === "academic_admin"
      ? "academic_admin"
      : roleSelect.value === "head_teacher"
        ? "head_teacher_01"
        : "teacher_zhang";
  const result = await request(`/api/auth/profile?username=${username}`);
  menus.innerHTML = result.data.menus.map((menu) => `<span>${menu.label}</span>`).join("");
}

async function loadStudents() {
  const result = await request("/api/students");
  studentRows.innerHTML = result.data
    .map((student) => `<tr><td>${student.studentNo}</td><td>${student.name}</td><td>${student.className}</td><td>${student.status}</td></tr>`)
    .join("");
}

async function loadScores() {
  const result = await request("/api/scores");
  scoreRows.innerHTML = result.data
    .map((score) => `<tr><td>${score.studentName}</td><td>${score.className}</td><td>${score.courseName}</td><td>${score.score}</td></tr>`)
    .join("");
}

async function refresh() {
  await loadProfile();
  await loadStudents();
  await loadScores();
}

document.querySelector("#duplicateStudentButton").addEventListener("click", async () => {
  const result = await request("/api/students", {
    method: "POST",
    body: JSON.stringify({
      studentNo: "S2026001",
      name: "重复学生",
      gender: "male",
      classId: 1,
      enrollmentYear: 2026,
    }),
  });
  renderJson(studentResult, result);
});

document.querySelector("#invalidScoreButton").addEventListener("click", async () => {
  const result = await request("/api/scores", {
    method: "POST",
    body: JSON.stringify({
      term: "2026-S1",
      studentId: 1,
      courseId: 1,
      score: 101,
      remark: "非法成绩",
    }),
  });
  renderJson(scoreResult, result);
});

roleSelect.addEventListener("change", refresh);

refresh();
