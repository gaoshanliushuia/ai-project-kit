const { createApp, computed, ref } = window.Vue;

const roles = [
  {
    id: "admin",
    name: "教务管理员",
    description: "维护学生、班级、教师、课程和成绩数据",
    menus: ["home", "students", "classes", "teachers", "courses", "scores"],
  },
  {
    id: "teacher",
    name: "任课教师",
    description: "查看任教课程学生名单，录入和查询成绩",
    menus: ["home", "courses", "scores"],
  },
  {
    id: "headTeacher",
    name: "班主任",
    description: "查看本班学生和成绩",
    menus: ["home", "students", "scores"],
  },
];

const menus = [
  { id: "home", label: "主页", req: "REQ-002" },
  { id: "students", label: "学生管理", req: "REQ-003" },
  { id: "classes", label: "班级管理", req: "REQ-004" },
  { id: "teachers", label: "教师管理", req: "REQ-005" },
  { id: "courses", label: "学生课程管理", req: "REQ-006" },
  { id: "scores", label: "学生成绩管理", req: "REQ-007" },
];

const students = [
  { no: "S2026001", name: "陈一", gender: "女", className: "七年级一班", status: "在读" },
  { no: "S2026002", name: "李明", gender: "男", className: "七年级一班", status: "在读" },
  { no: "S2026003", name: "王小雨", gender: "女", className: "七年级二班", status: "在读" },
];

const classes = [
  { grade: "七年级", name: "七年级一班", headTeacher: "张老师", status: "启用" },
  { grade: "七年级", name: "七年级二班", headTeacher: "李老师", status: "启用" },
  { grade: "八年级", name: "八年级一班", headTeacher: "王老师", status: "启用" },
];

const teachers = [
  { no: "T001", name: "张老师", courses: "语文", role: "班主任 / 任课教师" },
  { no: "T002", name: "李老师", courses: "数学", role: "班主任 / 任课教师" },
  { no: "T003", name: "王老师", courses: "英语", role: "任课教师" },
];

const studentCourses = [
  { term: "2026-S1", student: "陈一", className: "七年级一班", course: "语文", teacher: "张老师" },
  { term: "2026-S1", student: "李明", className: "七年级一班", course: "数学", teacher: "李老师" },
  { term: "2026-S1", student: "王小雨", className: "七年级二班", course: "英语", teacher: "王老师" },
];

const scores = [
  { term: "2026-S1", student: "陈一", className: "七年级一班", course: "语文", score: 92, teacher: "张老师" },
  { term: "2026-S1", student: "李明", className: "七年级一班", course: "数学", score: 88, teacher: "李老师" },
  { term: "2026-S1", student: "王小雨", className: "七年级二班", course: "英语", score: 95, teacher: "王老师" },
];

createApp({
  setup() {
    const selectedRoleId = ref("admin");
    const activeMenu = ref("home");
    const loginVisible = ref(true);

    const currentRole = computed(() => roles.find((role) => role.id === selectedRoleId.value) || roles[0]);
    const visibleMenus = computed(() => menus.filter((menu) => currentRole.value.menus.includes(menu.id)));
    const activeMenuMeta = computed(() => menus.find((menu) => menu.id === activeMenu.value) || menus[0]);

    function loginAs(roleId) {
      selectedRoleId.value = roleId;
      loginVisible.value = false;
      activeMenu.value = "home";
    }

    function setMenu(menuId) {
      activeMenu.value = menuId;
    }

    function showLogin() {
      loginVisible.value = true;
    }

    return {
      roles,
      menus,
      students,
      classes,
      teachers,
      studentCourses,
      scores,
      selectedRoleId,
      activeMenu,
      loginVisible,
      currentRole,
      visibleMenus,
      activeMenuMeta,
      loginAs,
      setMenu,
      showLogin,
    };
  },
  template: `
    <main class="prototype-shell">
      <section v-if="loginVisible" class="login-page">
        <div class="login-card">
          <p class="eyebrow">UI-001 / REQ-001</p>
          <h1>中学教务管理系统</h1>
          <p class="muted">原型演示系统，用于业务确认页面、流程、字段和权限边界。</p>

          <label class="field">
            <span>账号</span>
            <input value="demo_user" readonly />
          </label>
          <label class="field">
            <span>密码</span>
            <input value="******" type="password" readonly />
          </label>

          <div class="role-grid">
            <button v-for="role in roles" :key="role.id" class="role-card" @click="loginAs(role.id)">
              <strong>{{ role.name }}</strong>
              <span>{{ role.description }}</span>
            </button>
          </div>
        </div>
      </section>

      <section v-else class="app-layout">
        <aside class="sidebar">
          <div class="brand">
            <span class="brand-mark">教</span>
            <div>
              <strong>教务管理</strong>
              <span>Prototype v1.0</span>
            </div>
          </div>

          <nav>
            <button
              v-for="menu in visibleMenus"
              :key="menu.id"
              :class="{ active: activeMenu === menu.id }"
              @click="setMenu(menu.id)"
            >
              <span>{{ menu.label }}</span>
              <small>{{ menu.req }}</small>
            </button>
          </nav>
        </aside>

        <section class="content">
          <header class="topbar">
            <div>
              <p class="eyebrow">当前角色</p>
              <h2>{{ currentRole.name }}</h2>
            </div>
            <button class="secondary" @click="showLogin">切换角色 / 返回登录</button>
          </header>

          <section class="page-card">
            <p class="eyebrow">{{ activeMenuMeta.req }}</p>
            <h1>{{ activeMenuMeta.label }}</h1>

            <div v-if="activeMenu === 'home'" class="dashboard">
              <article>
                <strong>学生数</strong>
                <span>1,236</span>
                <small>按班级归属维护</small>
              </article>
              <article>
                <strong>班级数</strong>
                <span>28</span>
                <small>年级 / 班主任维护</small>
              </article>
              <article>
                <strong>教师数</strong>
                <span>96</span>
                <small>支持任课关系</small>
              </article>
              <article>
                <strong>待录成绩</strong>
                <span>12</span>
                <small>任课教师待办</small>
              </article>
            </div>

            <div v-if="activeMenu === 'students'">
              <div class="toolbar">
                <input placeholder="学号 / 姓名" />
                <select><option>全部班级</option><option>七年级一班</option></select>
                <button>查询</button>
                <button v-if="currentRole.id === 'admin'">新增学生</button>
              </div>
              <table>
                <thead><tr><th>学号</th><th>姓名</th><th>性别</th><th>班级</th><th>状态</th><th>操作</th></tr></thead>
                <tbody>
                  <tr v-for="student in students" :key="student.no">
                    <td>{{ student.no }}</td><td>{{ student.name }}</td><td>{{ student.gender }}</td>
                    <td>{{ student.className }}</td><td>{{ student.status }}</td>
                    <td>{{ currentRole.id === 'admin' ? '编辑 / 停用' : '查看' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-if="activeMenu === 'classes'">
              <div class="toolbar"><button>新增班级</button><button>导出班级清单</button></div>
              <table>
                <thead><tr><th>年级</th><th>班级</th><th>班主任</th><th>状态</th><th>操作</th></tr></thead>
                <tbody>
                  <tr v-for="item in classes" :key="item.name">
                    <td>{{ item.grade }}</td><td>{{ item.name }}</td><td>{{ item.headTeacher }}</td><td>{{ item.status }}</td><td>编辑</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-if="activeMenu === 'teachers'">
              <div class="toolbar"><input placeholder="教师姓名" /><button>查询</button><button>新增教师</button></div>
              <table>
                <thead><tr><th>工号</th><th>姓名</th><th>任课</th><th>角色</th><th>操作</th></tr></thead>
                <tbody>
                  <tr v-for="teacher in teachers" :key="teacher.no">
                    <td>{{ teacher.no }}</td><td>{{ teacher.name }}</td><td>{{ teacher.courses }}</td><td>{{ teacher.role }}</td><td>编辑 / 任课</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-if="activeMenu === 'courses'">
              <div class="toolbar"><select><option>2026-S1</option></select><button>分配课程</button><button>检查重复</button></div>
              <table>
                <thead><tr><th>学期</th><th>学生</th><th>班级</th><th>课程</th><th>任课教师</th><th>操作</th></tr></thead>
                <tbody>
                  <tr v-for="item in studentCourses" :key="item.student + item.course">
                    <td>{{ item.term }}</td><td>{{ item.student }}</td><td>{{ item.className }}</td><td>{{ item.course }}</td><td>{{ item.teacher }}</td><td>查看 / 停用</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-if="activeMenu === 'scores'">
              <div class="toolbar">
                <select><option>2026-S1</option></select>
                <select><option>全部课程</option><option>语文</option><option>数学</option></select>
                <button>查询</button>
                <button v-if="currentRole.id !== 'headTeacher'">录入成绩</button>
              </div>
              <table>
                <thead><tr><th>学期</th><th>学生</th><th>班级</th><th>课程</th><th>成绩</th><th>录入教师</th></tr></thead>
                <tbody>
                  <tr v-for="item in scores" :key="item.student + item.course">
                    <td>{{ item.term }}</td><td>{{ item.student }}</td><td>{{ item.className }}</td><td>{{ item.course }}</td><td>{{ item.score }}</td><td>{{ item.teacher }}</td>
                  </tr>
                </tbody>
              </table>
              <p class="hint">校验规则：成绩范围为 0-100；任课教师只能录入自己任教课程。</p>
            </div>
          </section>
        </section>
      </section>
    </main>
  `,
}).mount("#app");
