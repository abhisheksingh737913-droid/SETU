import React, { useMemo, useState } from "react";
import "./college.css";

const STORAGE_KEY = "SetuCollege";

const initialData = {
  college: {
    name: "",
    email: "",
    registrationId: "",
  },
  students: [],
  courses: [],
  companies: [],
  jobs: [],
  applications: [],
  interviews: [],
  selections: [],
  permissions: {},
  notifications: [],
};

const menuItems = [
  ["Dashboard", "⌂"],
  ["Students", "👨‍🎓"],
  ["Courses & Departments", "📚"],
  ["Companies", "🏢"],
  ["Jobs & Internships", "💼"],
  ["Data Permissions", "🔐"],
  ["Applications", "📝"],
  ["Interviews", "🎤"],
  ["Selections", "🏆"],
  ["Placement Analytics", "📊"],
  ["Skill Analytics", "🧠"],
  ["AI College Insights", "🤖"],
  ["Notifications", "🔔"],
  ["Settings", "⚙️"],
];

function loadCollegeData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return initialData;

    const parsed = JSON.parse(saved);
    return {
      ...initialData,
      ...parsed,
      college: {
        ...initialData.college,
        ...(parsed.college || {}),
      },
      students: Array.isArray(parsed.students) ? parsed.students : [],
      courses: Array.isArray(parsed.courses) ? parsed.courses : [],
      companies: Array.isArray(parsed.companies) ? parsed.companies : [],
      jobs: Array.isArray(parsed.jobs) ? parsed.jobs : [],
      applications: Array.isArray(parsed.applications)
        ? parsed.applications
        : [],
      interviews: Array.isArray(parsed.interviews) ? parsed.interviews : [],
      selections: Array.isArray(parsed.selections) ? parsed.selections : [],
      permissions: parsed.permissions || {},
      notifications: Array.isArray(parsed.notifications)
        ? parsed.notifications
        : [],
    };
  } catch (error) {
    console.error("Could not load college data", error);
    return initialData;
  }
}

export default function CollegeApp({ onLogout }) {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [data, setData] = useState(loadCollegeData);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function saveData(nextData) {
    setData(nextData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData));
  }

  function updateData(key, value) {
    setData((prev) => {
      const next = { ...prev, [key]: value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  function navigate(menu) {
    setActiveMenu(menu);
    setSidebarOpen(false);
    window.scrollTo(0, 0);
  }

  function handleLogout() {
    localStorage.removeItem("collegeLoggedIn");
    localStorage.removeItem("collegeUser");
    if (typeof onLogout === "function") {
      onLogout();
      return;
    }
    window.location.reload();
  }

  const title = activeMenu;

  return (
    <div className="dashboard-layout">
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <div className="small-logo">SETU</div>
          <div>
            <h2>Setu</h2>
            <span>College Portal</span>
          </div>
        </div>

        <div className="menu-title">MAIN MENU</div>

        <div className="sidebar-menu">
          {menuItems.map(([name, icon]) => (
            <button
              key={name}
              className={activeMenu === name ? "menu-item active" : "menu-item"}
              onClick={() => navigate(name)}
            >
              <span>{icon}</span>
              {name}
            </button>
          ))}
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen((value) => !value)}
            aria-label="Open menu"
          >
            ☰
          </button>

          <div>
            <h1>{title}</h1>
            <p>
              {data.college.name || "College"} • College Management Portal
            </p>
          </div>

          <div className="profile-box">
            <div className="profile-circle">
              {(data.college.name || "C").charAt(0).toUpperCase()}
            </div>
            <div>
              <strong>{data.college.name || "College Admin"}</strong>
              <span>Administrator</span>
            </div>
          </div>
        </header>

        {activeMenu === "Dashboard" && (
          <DashboardHome data={data} navigate={navigate} />
        )}

        {activeMenu === "Students" && (
          <StudentsSection
            students={data.students}
            updateStudents={(value) => updateData("students", value)}
          />
        )}

        {activeMenu === "Courses & Departments" && (
          <CoursesSection
            courses={data.courses}
            updateCourses={(value) => updateData("courses", value)}
          />
        )}

        {activeMenu === "Companies" && (
          <CompaniesSection
            companies={data.companies}
            updateCompanies={(value) => updateData("companies", value)}
          />
        )}

        {activeMenu === "Jobs & Internships" && (
          <JobsSection
            jobs={data.jobs}
            companies={data.companies}
            updateJobs={(value) => updateData("jobs", value)}
          />
        )}

        {activeMenu === "Data Permissions" && (
          <PermissionsSection
            students={data.students}
            permissions={data.permissions}
            updatePermissions={(value) => updateData("permissions", value)}
          />
        )}

        {activeMenu === "Applications" && (
          <ApplicationsSection applications={data.applications} />
        )}

        {activeMenu === "Interviews" && (
          <InterviewsSection interviews={data.interviews} />
        )}

        {activeMenu === "Selections" && (
          <SelectionsSection selections={data.selections} />
        )}

        {activeMenu === "Placement Analytics" && <PlacementAnalytics data={data} />}

        {activeMenu === "Skill Analytics" && <SkillAnalytics students={data.students} />}

        {activeMenu === "AI College Insights" && <AIInsights data={data} />}

        {activeMenu === "Notifications" && (
          <NotificationsSection notifications={data.notifications} />
        )}

        {activeMenu === "Settings" && (
          <SettingsSection
            college={data.college}
            onSave={(college) => updateData("college", college)}
          />
        )}
      </main>
    </div>
  );
}

function DashboardHome({ data, navigate }) {
  const stats = [
    { icon: "👨‍🎓", title: "Total Students", value: data.students.length },
    { icon: "🏢", title: "Approved Companies", value: data.companies.length },
    { icon: "💼", title: "Active Jobs", value: data.jobs.length },
    { icon: "📝", title: "Applications", value: data.applications.length },
    { icon: "🎤", title: "Interviews", value: data.interviews.length },
    { icon: "🏆", title: "Selections", value: data.selections.length },
  ];

  const recent = [
    ...data.students.map((item) => ({
      id: `student-${item.id}`,
      title: `Student added: ${item.name}`,
      date: item.date || "Recent",
    })),
    ...data.companies.map((item) => ({
      id: `company-${item.id}`,
      title: `Company added: ${item.name}`,
      date: item.date || "Recent",
    })),
    ...data.jobs.map((item) => ({
      id: `job-${item.id}`,
      title: `Job posted: ${item.title}`,
      date: item.date || "Recent",
    })),
  ].slice(-5).reverse();

  return (
    <div className="dashboard-home">
      <div className="welcome-card">
        <div>
          <span className="welcome-label">COLLEGE ADMINISTRATION</span>
          <h2>Welcome to College Dashboard 👋</h2>
          <p>
            Manage students, companies, jobs, internships and placement
            activities from one place.
          </p>
        </div>
        <div className="welcome-icon">🏫</div>
      </div>

      <div className="stats-grid">
        {stats.map((item) => (
          <StatCard key={item.title} {...item} />
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h3>Students</h3>
              <p>Manage students from all departments.</p>
            </div>
            <button className="outline-btn" onClick={() => navigate("Students")}>
              + Add Student
            </button>
          </div>

          {data.students.length === 0 ? (
            <EmptyBlock
              icon="👨‍🎓"
              title="No students added yet"
              text="Open Students and add your first student."
            />
          ) : (
            <div className="simple-list">
              {data.students.slice(-5).reverse().map((student) => (
                <div className="simple-row" key={student.id}>
                  <div>
                    <strong>{student.name}</strong>
                    <span>
                      {student.branch || "Department not set"} • Semester {student.semester || "-"}
                    </span>
                  </div>
                  <span>{student.cgpa ? `CGPA ${student.cgpa}` : "CGPA -"}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h3>Recent Activity</h3>
              <p>Latest college portal activity.</p>
            </div>
            <span className="card-icon">🕒</span>
          </div>

          {recent.length === 0 ? (
            <EmptyBlock
              icon="📌"
              title="No recent activity"
              text="Add students, companies or jobs to get started."
            />
          ) : (
            <div className="simple-list">
              {recent.map((item) => (
                <div className="simple-row" key={item.id}>
                  <div>
                    <strong>{item.title}</strong>
                  </div>
                  <span>{item.date}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StudentsSection({ students, updateStudents }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    course: "B.Tech",
    branch: "",
    semester: "",
    cgpa: "",
  });
  const [search, setSearch] = useState("");

  function addStudent(e) {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      alert("Student name and email are required.");
      return;
    }

    const duplicate = students.some(
      (student) => student.email.toLowerCase() === form.email.trim().toLowerCase()
    );

    if (duplicate) {
      alert("A student with this email already exists.");
      return;
    }

    const student = {
      id: Date.now(),
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      date: new Date().toLocaleDateString(),
    };

    updateStudents([...students, student]);
    setForm({
      name: "",
      email: "",
      course: "B.Tech",
      branch: "",
      semester: "",
      cgpa: "",
    });
  }

  function removeStudent(id) {
    if (!window.confirm("Remove this student?")) return;
    updateStudents(students.filter((student) => student.id !== id));
  }

  const filtered = students.filter((student) => {
    const text = `${student.name} ${student.email} ${student.branch} ${student.course}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <div>
      <PageIntro
        title="Students"
        description="Add, search and manage students from all departments."
      />

      <div className="dashboard-card">
        <div className="card-header">
          <div>
            <h3>Add Student</h3>
            <p>Enter student information for the college talent pool.</p>
          </div>
        </div>

        <form className="form-grid" onSubmit={addStudent}>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Student full name"
          />
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Student email"
          />
          <input
            value={form.course}
            onChange={(e) => setForm({ ...form, course: e.target.value })}
            placeholder="Course"
          />
          <input
            value={form.branch}
            onChange={(e) => setForm({ ...form, branch: e.target.value })}
            placeholder="Branch / Department"
          />
          <input
            value={form.semester}
            onChange={(e) => setForm({ ...form, semester: e.target.value })}
            placeholder="Semester"
          />
          <input
            type="number"
            min="0"
            max="10"
            step="0.01"
            value={form.cgpa}
            onChange={(e) => setForm({ ...form, cgpa: e.target.value })}
            placeholder="CGPA"
          />

          <div style={{ gridColumn: "1 / -1" }}>
            <button className="primary-btn" type="submit">
              + Add Student
            </button>
          </div>
        </form>
      </div>

      <div className="section-heading">
        <div>
          <h2>Student List</h2>
          <p>{students.length} student{students.length === 1 ? "" : "s"} added</p>
        </div>
        <input
          className="table-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search student..."
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyBlock
          icon="👨‍🎓"
          title="No students found"
          text="Add a student or change your search."
        />
      ) : (
        <div className="dashboard-card table-card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th>Branch</th>
                  <th>Semester</th>
                  <th>CGPA</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((student) => (
                  <tr key={student.id}>
                    <td><strong>{student.name}</strong></td>
                    <td>{student.email}</td>
                    <td>{student.course || "-"}</td>
                    <td>{student.branch || "-"}</td>
                    <td>{student.semester || "-"}</td>
                    <td>{student.cgpa || "-"}</td>
                    <td>
                      <button
                        className="delete-button"
                        onClick={() => removeStudent(student.id)}
                        type="button"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function CoursesSection({ courses, updateCourses }) {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");

  function addCourse(e) {
    e.preventDefault();
    if (!name.trim()) return;

    updateCourses([
      ...courses,
      {
        id: Date.now(),
        name: name.trim(),
        department: department.trim(),
      },
    ]);

    setName("");
    setDepartment("");
  }

  return (
    <div>
      <PageIntro
        title="Courses & Departments"
        description="Maintain the academic structure used by the college."
      />

      <div className="dashboard-card">
        <form className="form-grid" onSubmit={addCourse}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Course name e.g. B.Tech"
          />
          <input
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="Department e.g. CSE"
          />
          <button className="primary-btn" type="submit">
            + Add Course
          </button>
        </form>
      </div>

      {courses.length === 0 ? (
        <EmptyBlock
          icon="📚"
          title="No courses added"
          text="Add your first course and department."
        />
      ) : (
        <div className="cards-list">
          {courses.map((course) => (
            <div className="dashboard-card mini-card" key={course.id}>
              <strong>{course.name}</strong>
              <span>{course.department || "Department not set"}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CompaniesSection({ companies, updateCompanies }) {
  const [form, setForm] = useState({ name: "", email: "", status: "Approved" });

  function addCompany(e) {
    e.preventDefault();
    if (!form.name.trim()) return;

    updateCompanies([
      ...companies,
      {
        id: Date.now(),
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        date: new Date().toLocaleDateString(),
      },
    ]);

    setForm({ name: "", email: "", status: "Approved" });
  }

  return (
    <div>
      <PageIntro
        title="Companies"
        description="Manage companies allowed to collaborate with your college."
      />

      <div className="dashboard-card">
        <form className="form-grid" onSubmit={addCompany}>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Company name"
          />
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Company email"
          />
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option>Approved</option>
            <option>Pending</option>
            <option>Blocked</option>
          </select>
          <button className="primary-btn" type="submit">
            + Add Company
          </button>
        </form>
      </div>

      {companies.length === 0 ? (
        <EmptyBlock
          icon="🏢"
          title="No companies added"
          text="Add companies to build the college-industry network."
        />
      ) : (
        <div className="dashboard-card table-card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Added</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => (
                  <tr key={company.id}>
                    <td><strong>{company.name}</strong></td>
                    <td>{company.email || "-"}</td>
                    <td><StatusBadge status={company.status} /></td>
                    <td>{company.date || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function JobsSection({ jobs, companies, updateJobs }) {
  const [form, setForm] = useState({
    title: "",
    company: companies[0]?.name || "",
    type: "Internship",
    location: "",
    eligibility: "",
    skills: "",
    package: "",
  });

  function addJob(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.company.trim()) {
      alert("Job title and company are required.");
      return;
    }

    const job = {
      id: Date.now(),
      title: form.title.trim(),
      company: form.company.trim(),
      type: form.type,
      location: form.location.trim(),
      eligibility: form.eligibility.trim(),
      package: form.package.trim(),
      skills: form.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
      date: new Date().toLocaleDateString(),
    };

    updateJobs([...jobs, job]);
    setForm({
      title: "",
      company: companies[0]?.name || "",
      type: "Internship",
      location: "",
      eligibility: "",
      skills: "",
      package: "",
    });
  }

  return (
    <div>
      <PageIntro
        title="Jobs & Internships"
        description="Post opportunities that can later be shared with students."
      />

      <div className="dashboard-card">
        <form className="form-grid" onSubmit={addJob}>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Job / Internship title"
          />

          <input
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            placeholder="Company"
          />

          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option>Internship</option>
            <option>Job</option>
          </select>

          <input
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="Location"
          />

          <input
            value={form.eligibility}
            onChange={(e) => setForm({ ...form, eligibility: e.target.value })}
            placeholder="Eligibility e.g. B.Tech CSE"
          />

          <input
            value={form.package}
            onChange={(e) => setForm({ ...form, package: e.target.value })}
            placeholder="Package / Stipend"
          />

          <input
            value={form.skills}
            onChange={(e) => setForm({ ...form, skills: e.target.value })}
            placeholder="Required skills: React, SQL, Java"
            style={{ gridColumn: "1 / -1" }}
          />

          <button className="primary-btn" type="submit">
            + Post Opportunity
          </button>
        </form>
      </div>

      {jobs.length === 0 ? (
        <EmptyBlock
          icon="💼"
          title="No opportunities posted"
          text="Create your first job or internship."
        />
      ) : (
        <div className="cards-list">
          {jobs.map((job) => (
            <div className="dashboard-card job-summary-card" key={job.id}>
              <div>
                <span className="document-type">{job.type}</span>
                <h3>{job.title}</h3>
                <p>{job.company}</p>
                <small>
                  {job.location || "Location not set"} • {job.eligibility || "Eligibility not set"}
                </small>
              </div>
              <div className="skill-tags">
                {(job.skills || []).map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PermissionsSection({ students, permissions, updatePermissions }) {
  function toggle(studentId, field) {
    const current = permissions[studentId] || {};
    updatePermissions({
      ...permissions,
      [studentId]: {
        ...current,
        [field]: current[field] === false ? true : false,
      },
    });
  }

  const fields = ["name", "course", "branch", "semester", "cgpa", "skills", "resume"];

  return (
    <div>
      <PageIntro
        title="Data Permissions"
        description="Control which student information can be shared with industry."
      />

      {students.length === 0 ? (
        <EmptyBlock
          icon="🔐"
          title="No students available"
          text="Add students before configuring data permissions."
        />
      ) : (
        <div className="dashboard-card table-card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  {fields.map((field) => (
                    <th key={field}>{field}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const setting = permissions[student.id] || {};
                  return (
                    <tr key={student.id}>
                      <td><strong>{student.name}</strong></td>
                      {fields.map((field) => (
                        <td key={field}>
                          <button
                            type="button"
                            className={`permission-toggle ${setting[field] !== false ? "on" : ""}`}
                            onClick={() => toggle(student.id, field)}
                          >
                            {setting[field] !== false ? "ON" : "OFF"}
                          </button>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function ApplicationsSection({ applications }) {
  return (
    <div>
      <PageIntro
        title="Applications"
        description="Review student applications received through SETU."
      />

      {applications.length === 0 ? (
        <EmptyBlock
          icon="📝"
          title="No applications yet"
          text="Student applications will appear here when opportunities are connected."
        />
      ) : (
        <TableCard
          headers={["Student", "Job", "Company", "Status", "Date"]}
          rows={applications.map((item) => [
            item.student || "Student",
            item.jobTitle || item.job || "-",
            item.company || "-",
            <StatusBadge key={`status-${item.id}`} status={item.status || "Applied"} />,
            item.date || item.appliedDate || "-",
          ])}
        />
      )}
    </div>
  );
}

function InterviewsSection({ interviews }) {
  return (
    <div>
      <PageIntro
        title="Interviews"
        description="Track interviews scheduled for students."
      />

      {interviews.length === 0 ? (
        <EmptyBlock
          icon="🎤"
          title="No interviews scheduled"
          text="Interview records will appear here when they are created."
        />
      ) : (
        <TableCard
          headers={["Student", "Company", "Role", "Date", "Time", "Status"]}
          rows={interviews.map((item) => [
            item.student || "Student",
            item.company || "-",
            item.role || "-",
            item.date || "-",
            item.time || "-",
            <StatusBadge key={`interview-${item.id}`} status={item.status || "Scheduled"} />,
          ])}
        />
      )}
    </div>
  );
}

function SelectionsSection({ selections }) {
  return (
    <div>
      <PageIntro
        title="Selections"
        description="View final placement and internship selections."
      />

      {selections.length === 0 ? (
        <EmptyBlock
          icon="🏆"
          title="No selections yet"
          text="Selected students will appear here."
        />
      ) : (
        <TableCard
          headers={["Student", "Company", "Role", "Package", "Date"]}
          rows={selections.map((item) => [
            item.student || "Student",
            item.company || "-",
            item.role || "-",
            item.package || "-",
            item.date || "-",
          ])}
        />
      )}
    </div>
  );
}

function PlacementAnalytics({ data }) {
  const totalStudents = data.students.length;
  const placed = data.selections.length;
  const placementRate = totalStudents
    ? Math.round((placed / totalStudents) * 100)
    : 0;

  return (
    <div>
      <PageIntro
        title="Placement Analytics"
        description="Understand placement activity and outcomes."
      />

      <div className="stats-grid">
        <StatCard icon="👨‍🎓" title="Total Students" value={totalStudents} />
        <StatCard icon="🏆" title="Selections" value={placed} />
        <StatCard icon="📈" title="Placement Rate" value={`${placementRate}%`} />
        <StatCard icon="📝" title="Applications" value={data.applications.length} />
        <StatCard icon="🎤" title="Interviews" value={data.interviews.length} />
        <StatCard icon="💼" title="Opportunities" value={data.jobs.length} />
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card readiness-card">
          <h3>Placement Readiness</h3>
          <div className="readiness-circle">{placementRate}%</div>
          <p>
            This prototype uses the current selection-to-student ratio as a simple
            placement outcome indicator.
          </p>
        </div>

        <div className="dashboard-card">
          <h3>Activity Summary</h3>
          <div className="overview-list">
            <OverviewRow label="Students" value={data.students.length} />
            <OverviewRow label="Companies" value={data.companies.length} />
            <OverviewRow label="Jobs" value={data.jobs.length} />
            <OverviewRow label="Applications" value={data.applications.length} />
            <OverviewRow label="Interviews" value={data.interviews.length} />
            <OverviewRow label="Selections" value={data.selections.length} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SkillAnalytics({ students }) {
  const skillCount = useMemo(() => {
    const counter = {};

    students.forEach((student) => {
      const skills = Array.isArray(student.skills) ? student.skills : [];
      skills.forEach((skill) => {
        const name = typeof skill === "string" ? skill : skill.name;
        if (!name) return;
        const key = name.toLowerCase();
        counter[key] = {
          name,
          count: (counter[key]?.count || 0) + 1,
        };
      });
    });

    return Object.values(counter).sort((a, b) => b.count - a.count);
  }, [students]);

  return (
    <div>
      <PageIntro
        title="Skill Analytics"
        description="See which skills are represented across the student pool."
      />

      {skillCount.length === 0 ? (
        <EmptyBlock
          icon="🧠"
          title="No skill data"
          text="Student skill data will appear here when it is available."
        />
      ) : (
        <div className="dashboard-card">
          {skillCount.map((skill) => (
            <div className="skill-analysis-row" key={skill.name}>
              <div className="analysis-name">
                <strong>{skill.name}</strong>
              </div>
              <div className="analysis-progress">
                <div>
                  <span
                    style={{
                      width: `${Math.min(skill.count * 10, 100)}%`,
                    }}
                  />
                </div>
              </div>
              <strong>{skill.count} students</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AIInsights({ data }) {
  const insights = [];

  if (data.students.length === 0) {
    insights.push("Start by adding students so SETU can build a college talent pool.");
  }

  if (data.jobs.length === 0) {
    insights.push("No active opportunities are posted. Add jobs or internships to increase placement activity.");
  }

  if (data.companies.length === 0) {
    insights.push("Add industry partners to build stronger college-company connections.");
  }

  if (data.students.length > 0 && data.selections.length === 0) {
    insights.push("No selections are recorded yet. Use skill and placement analytics to identify readiness gaps.");
  }

  if (insights.length === 0) {
    insights.push("Your college portal has active students, opportunities and company activity. Review placement analytics regularly.");
  }

  return (
    <div>
      <PageIntro
        title="AI College Insights"
        description="Rule-based prototype insights from the current college data."
      />

      <div className="cards-list">
        {insights.map((text, index) => (
          <div className="dashboard-card insight-card" key={index}>
            <div className="ai-avatar">🤖</div>
            <div>
              <h3>SETU Insight</h3>
              <p>{text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationsSection({ notifications }) {
  return (
    <div>
      <PageIntro
        title="Notifications"
        description="College updates and activity notifications."
      />

      {notifications.length === 0 ? (
        <EmptyBlock
          icon="🔔"
          title="No notifications"
          text="New updates will appear here when the workflow is connected."
        />
      ) : (
        <div className="cards-list">
          {notifications.map((item) => (
            <div className="dashboard-card notification-card" key={item.id}>
              <div className="notification-icon">🔔</div>
              <div>
                <h3>{item.title}</h3>
                <p>{item.message}</p>
                <small>{item.date}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SettingsSection({ college, onSave }) {
  const [form, setForm] = useState({
    name: college.name || "",
    email: college.email || "",
    registrationId: college.registrationId || "",
  });
  const [saved, setSaved] = useState(false);

  function submit(e) {
    e.preventDefault();
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <PageIntro
        title="Settings"
        description="Manage your college profile settings."
      />

      <div className="dashboard-card">
        <form className="form-grid" onSubmit={submit}>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="College name"
          />
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="College email"
          />
          <input
            value={form.registrationId}
            onChange={(e) => setForm({ ...form, registrationId: e.target.value })}
            placeholder="College registration ID"
          />

          <button className="primary-btn" type="submit">
            Save Settings
          </button>

          {saved && <span className="save-success">✓ Settings saved</span>}
        </form>
      </div>
    </div>
  );
}

function PageIntro({ title, description }) {
  return (
    <div className="page-intro">
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div>
        <p>{title}</p>
        <h2>{value}</h2>
      </div>
    </div>
  );
}

function EmptyBlock({ icon, title, text }) {
  return (
    <div className="section-empty">
      <div className="section-empty-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

function TableCard({ headers, rows }) {
  return (
    <div className="dashboard-card table-card">
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OverviewRow({ label, value }) {
  return (
    <div className="overview-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function StatusBadge({ status }) {
  const normalized = String(status || "").toLowerCase();
  const className =
    normalized.includes("select")
      ? "status-success"
      : normalized.includes("short") || normalized.includes("interview")
      ? "status-warning"
      : normalized.includes("reject") || normalized.includes("block")
      ? "status-danger"
      : "status-neutral";

  return <span className={`status-badge ${className}`}>{status}</span>;
}
