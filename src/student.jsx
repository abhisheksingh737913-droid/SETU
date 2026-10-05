
import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./student.css";

/* =========================================================
   STUDENT DASHBOARD
   Frontend Only
   No Backend / No Database / No API
   ========================================================= */

const initialData = {
  profile: {
    name: "",
    photo: "",
    college: "",
    course: "",
    branch: "",
    semester: "",
    cgpa: "",
    education: "",
    github: "",
    linkedin: "",
    portfolio: "",
  },

  skills: [],

  applications: [],

  interviews: [],

  selections: [],

  jobs: [],

  documents: [],

  notifications: [],

  privacy: {
    name: true,
    college: true,
    course: true,
    branch: true,
    semester: true,
    cgpa: false,
    skills: true,
    resume: false,
    certificates: false,
    phone: false,
    email: false,
    address: false,
  },

  settings: {
    emailNotifications: true,
    jobNotifications: true,
    interviewNotifications: true,
    assessmentNotifications: true,
  },
};

/* =========================================================
   LOCAL STORAGE
   ========================================================= */

function loadStudentData() {
  try {
    const saved = localStorage.getItem("SetuStudent");

    if (saved) {
      return {
        ...initialData,
        ...JSON.parse(saved),
      };
    }
  } catch (error) {
    console.error("Could not load student data", error);
  }

  return initialData;
}

/* =========================================================
   MENU
   ========================================================= */

const menuItems = [
  {
    title: "MAIN",
    items: [
      { id: "dashboard", icon: "🏠", label: "Dashboard" },
    ],
  },
  {
    title: "PROFILE",
    items: [
      { id: "profile", icon: "👤", label: "My Profile" },
      { id: "skills", icon: "🧠", label: "My Skills" },
      { id: "assessment", icon: "📝", label: "Skill Assessment" },
      { id: "documents", icon: "📄", label: "Resume & Certificates" },
    ],
  },
  {
    title: "OPPORTUNITIES",
    items: [
      { id: "jobs", icon: "💼", label: "Jobs & Internships" },
      { id: "match", icon: "🎯", label: "AI Job Match" },
      { id: "applications", icon: "📝", label: "My Applications" },
      { id: "interviews", icon: "🎤", label: "Interviews" },
      { id: "selections", icon: "🏆", label: "My Selections" },
    ],
  },
  {
    title: "AI & ANALYTICS",
    items: [
      { id: "assistant", icon: "🤖", label: "AI Career Assistant" },
      { id: "analytics", icon: "📊", label: "Career Analytics" },
    ],
  },
  {
    title: "ACCOUNT",
    items: [
      { id: "privacy", icon: "🔐", label: "Privacy & Data" },
      { id: "notifications", icon: "🔔", label: "Notifications" },
      { id: "settings", icon: "⚙️", label: "Settings" },
    ],
  },
];

/* =========================================================
   MAIN APP
   ========================================================= */

function StudentApp() {
  const [activePage, setActivePage] = useState("dashboard");
  const [data, setData] = useState(loadStudentData);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(
      "SetuStudent",
      JSON.stringify(data)
    );
  }, [data]);

  function updateData(key, value) {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function updateProfile(profile) {
    setData((prev) => ({
      ...prev,
      profile,
    }));
  }

  function updatePrivacy(privacy) {
    setData((prev) => ({
      ...prev,
      privacy,
    }));
  }

  function updateSettings(settings) {
    setData((prev) => ({
      ...prev,
      settings,
    }));
  }

  function navigate(page) {
    setActivePage(page);
    setSidebarOpen(false);
    window.scrollTo(0, 0);
  }

  const pageTitles = {
    dashboard: "Dashboard",
    profile: "My Profile",
    skills: "My Skills",
    assessment: "Skill Assessment",
    documents: "Resume & Certificates",
    jobs: "Jobs & Internships",
    match: "AI Job Match",
    applications: "My Applications",
    interviews: "Interviews",
    selections: "My Selections",
    assistant: "AI Career Assistant",
    analytics: "Career Analytics",
    privacy: "Privacy & Data",
    notifications: "Notifications",
    settings: "Settings",
  };

  return (
    <div className="student-app">

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`student-sidebar ${sidebarOpen ? "open" : ""}`}>

        <div className="brand-box">
          <div className="brand-logo">SETU</div>

          <div>
            <h2>Setu</h2>
            <span>Student Portal</span>
          </div>
        </div>

        <div className="student-mini-profile">

          <div className="mini-avatar">
            {data.profile.photo ? (
              <img src={data.profile.photo} alt="Profile" />
            ) : (
              "👨‍🎓"
            )}
          </div>

          <div>
            <strong>
              {data.profile.name || "Student"}
            </strong>

            <small>
              {data.profile.college || "Complete your profile"}
            </small>
          </div>

        </div>

        <nav className="sidebar-navigation">

          {menuItems.map((section) => (
            <div className="menu-section" key={section.title}>

              <div className="menu-section-title">
                {section.title}
              </div>

              {section.items.map((item) => (
                <button
                  key={item.id}
                  className={`menu-item ${
                    activePage === item.id ? "active" : ""
                  }`}
                  onClick={() => navigate(item.id)}
                >
                  <span className="menu-icon">
                    {item.icon}
                  </span>

                  <span>{item.label}</span>
                </button>
              ))}

            </div>
          ))}

        </nav>

        <button
          className="logout-button"
          onClick={() => {
            localStorage.removeItem("SetuStudent");
            window.location.reload();
          }}
        >
          🚪 Logout
        </button>

      </aside>

      {/* MAIN AREA */}
      <main className="student-main">

        {/* HEADER */}
        <header className="student-header">

          <div className="header-left">

            <button
              className="mobile-menu-button"
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </button>

            <div>
              <h1>{pageTitles[activePage]}</h1>
              <p>Student Career & Placement Portal</p>
            </div>

          </div>

          <div className="header-right">

            <button
              className="header-icon-button"
              onClick={() => navigate("notifications")}
            >
              🔔

              {data.notifications.length > 0 && (
                <span className="notification-dot">
                  {data.notifications.length}
                </span>
              )}
            </button>

            <button
              className="header-profile"
              onClick={() => navigate("profile")}
            >

              <div className="header-avatar">
                {data.profile.photo ? (
                  <img src={data.profile.photo} alt="Profile" />
                ) : (
                  "👨‍🎓"
                )}
              </div>

              <div>
                <strong>
                  {data.profile.name || "Student"}
                </strong>

                <small>
                  {data.profile.branch || "Complete profile"}
                </small>
              </div>

            </button>

          </div>

        </header>

        {/* CONTENT */}
        <section className="student-content">

          {activePage === "dashboard" && (
            <Dashboard
              data={data}
              navigate={navigate}
            />
          )}

          {activePage === "profile" && (
            <Profile
              profile={data.profile}
              updateProfile={updateProfile}
            />
          )}

          {activePage === "skills" && (
            <Skills
              skills={data.skills}
              updateSkills={(skills) =>
                updateData("skills", skills)
              }
            />
          )}

          {activePage === "assessment" && (
            <SkillAssessment
              skills={data.skills}
              updateSkills={(skills) =>
                updateData("skills", skills)
              }
            />
          )}

          {activePage === "documents" && (
            <Documents
              documents={data.documents}
              updateDocuments={(documents) =>
                updateData("documents", documents)
              }
            />
          )}

          {activePage === "jobs" && (
            <Jobs
              jobs={data.jobs}
              applications={data.applications}
              updateApplications={(applications) =>
                updateData("applications", applications)
              }
            />
          )}

          {activePage === "match" && (
            <JobMatch
              skills={data.skills}
              jobs={data.jobs}
            />
          )}

          {activePage === "applications" && (
            <Applications
              applications={data.applications}
            />
          )}

          {activePage === "interviews" && (
            <Interviews
              interviews={data.interviews}
            />
          )}

          {activePage === "selections" && (
            <Selections
              selections={data.selections}
            />
          )}

          {activePage === "assistant" && (
            <CareerAssistant
              skills={data.skills}
            />
          )}

          {activePage === "analytics" && (
            <Analytics
              data={data}
            />
          )}

          {activePage === "privacy" && (
            <Privacy
              privacy={data.privacy}
              updatePrivacy={updatePrivacy}
            />
          )}

          {activePage === "notifications" && (
            <Notifications
              notifications={data.notifications}
            />
          )}

          {activePage === "settings" && (
            <Settings
              settings={data.settings}
              updateSettings={updateSettings}
            />
          )}

        </section>

      </main>

    </div>
  );
}

/* =========================================================
   DASHBOARD
   ========================================================= */

function Dashboard({ data, navigate }) {

  const profile = data.profile || {};
  const skills = Array.isArray(data.skills) ? data.skills : [];
  const applications = Array.isArray(data.applications) ? data.applications : [];
  const interviews = Array.isArray(data.interviews) ? data.interviews : [];
  const selections = Array.isArray(data.selections) ? data.selections : [];
  const documents = Array.isArray(data.documents) ? data.documents : [];

  /* ---------------------------------------------------------
     1. PROFILE COMPLETION
     --------------------------------------------------------- */
  const profileFields = [
    profile.name,
    profile.college,
    profile.course,
    profile.branch,
    profile.semester,
    profile.cgpa,
    profile.education,
    profile.github,
    profile.linkedin,
  ];

  const filledFields = profileFields.filter(
    (field) => field !== null && field !== undefined && String(field).trim() !== ""
  ).length;

  const profileCompletion = Math.round(
    (filledFields / profileFields.length) * 100
  );

  /* ---------------------------------------------------------
     2. VERIFIED SKILLS
     --------------------------------------------------------- */
  const verifiedSkills = skills.filter(
    (skill) => skill && skill.verified === true
  ).length;

  const skillVerificationRate = skills.length
    ? Math.round((verifiedSkills / skills.length) * 100)
    : 0;

  const averageSkillScore = skills.length
    ? Math.round(
        skills.reduce((total, skill) => total + (Number(skill.score) || 0), 0) /
          skills.length
      )
    : 0;

  /* ---------------------------------------------------------
     3-6. APPLICATION / INTERVIEW / SELECTION COUNTS
     --------------------------------------------------------- */
  const applicationCount = applications.length;

  const shortlisted = applications.filter(
    (application) => application.status === "Shortlisted"
  ).length;

  const interviewCount = interviews.length;
  const selectionCount = selections.length;

  /* ---------------------------------------------------------
     7. CAREER READINESS
     Dynamic score based on actual student data.

     Weight:
     Profile completion       = 40%
     Verified skills          = 25%
     Skill assessment score   = 20%
     Documents                = 10%
     Career activity          = 5%
     --------------------------------------------------------- */
  const assessmentScore = Math.min(averageSkillScore, 100);
  const documentScore = Math.min(documents.length * 50, 100);
  const careerActivityScore = Math.min(
    applicationCount * 20 + interviewCount * 30 + selectionCount * 50,
    100
  );

  const careerReadiness = Math.round(
    profileCompletion * 0.4 +
      skillVerificationRate * 0.25 +
      assessmentScore * 0.2 +
      documentScore * 0.1 +
      careerActivityScore * 0.05
  );

  const readinessLabel =
    careerReadiness >= 80
      ? "Excellent"
      : careerReadiness >= 60
        ? "Good"
        : careerReadiness >= 40
          ? "Getting Started"
          : "Needs Improvement";

  /* ---------------------------------------------------------
     8. RECENT ACTIVITY
     --------------------------------------------------------- */
  const recentActivity = [
    ...applications.map((application) => ({
      id: `application-${application.id}`,
      title: `${application.jobTitle || "Job application"}`,
      subtitle: `${application.company || "Company"} • ${application.status || "Applied"}`,
      date: application.appliedDate || application.date || "Recent",
      type: "Application",
    })),
    ...interviews.map((interview) => ({
      id: `interview-${interview.id}`,
      title: `${interview.role || "Interview"}`,
      subtitle: `${interview.company || "Company"} • ${interview.status || "Scheduled"}`,
      date: interview.date || "Upcoming",
      type: "Interview",
    })),
    ...selections.map((selection) => ({
      id: `selection-${selection.id}`,
      title: `${selection.role || "Selection"}`,
      subtitle: `${selection.company || "Company"} • Selected`,
      date: selection.date || "Recent",
      type: "Selection",
    })),
  ]
    .slice(-6)
    .reverse();

  return (
    <div>

      {/* WELCOME */}
      <div className="welcome-section">
        <div>
          <h2>
            Welcome{profile.name ? `, ${profile.name}` : ""}
            👋
          </h2>

          <p>
            Manage your skills, applications and career journey.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => navigate("profile")}
        >
          👤 Complete Profile
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="stats-grid">

        <StatCard
          icon="👤"
          title="Profile Completion"
          value={`${profileCompletion}%`}
          progress={profileCompletion}
          onClick={() => navigate("profile")}
        />

        <StatCard
          icon="🧠"
          title="Verified Skills"
          value={verifiedSkills}
          onClick={() => navigate("skills")}
        />

        <StatCard
          icon="📝"
          title="Applications"
          value={applicationCount}
          onClick={() => navigate("applications")}
        />

        <StatCard
          icon="🎯"
          title="Shortlisted"
          value={shortlisted}
          onClick={() => navigate("applications")}
        />

        <StatCard
          icon="🎤"
          title="Interviews"
          value={interviewCount}
          onClick={() => navigate("interviews")}
        />

        <StatCard
          icon="🏆"
          title="Selections"
          value={selectionCount}
          onClick={() => navigate("selections")}
        />

      </div>

      {/* PROFILE + CAREER READINESS */}
      <div className="dashboard-grid">

        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h3>Profile Strength</h3>
              <p>Complete your profile to improve opportunities.</p>
            </div>

            <strong>{profileCompletion}%</strong>
          </div>

          <div className="large-progress">
            <div
              style={{
                width: `${profileCompletion}%`,
              }}
            />
          </div>

          {profileCompletion < 100 ? (
            <button
              className="outline-button"
              onClick={() => navigate("profile")}
            >
              Complete Profile →
            </button>
          ) : (
            <div className="success-message">
              ✓ Profile completed
            </div>
          )}
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h3>Career Readiness</h3>
              <p>{readinessLabel} — based on your current activity.</p>
            </div>

            <strong>{careerReadiness}%</strong>
          </div>

          <div className="large-progress">
            <div
              style={{
                width: `${careerReadiness}%`,
              }}
            />
          </div>

          <div className="overview-list">
            <OverviewRow
              label="Profile"
              value={`${profileCompletion}%`}
            />
            <OverviewRow
              label="Verified Skills"
              value={`${verifiedSkills}/${skills.length}`}
            />
            <OverviewRow
              label="Assessment Score"
              value={`${assessmentScore}%`}
            />
            <OverviewRow
              label="Documents"
              value={documents.length}
            />
          </div>
        </div>

      </div>

      {/* CAREER OVERVIEW */}
      <div className="dashboard-grid">

        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h3>Career Overview</h3>
              <p>Your current career activity.</p>
            </div>

            <span className="card-icon">📊</span>
          </div>

          <div className="overview-list">
            <OverviewRow
              label="Skills Added"
              value={skills.length}
            />

            <OverviewRow
              label="Verified Skills"
              value={verifiedSkills}
            />

            <OverviewRow
              label="Applications"
              value={applicationCount}
            />

            <OverviewRow
              label="Shortlisted"
              value={shortlisted}
            />

            <OverviewRow
              label="Interviews"
              value={interviewCount}
            />

            <OverviewRow
              label="Selections"
              value={selectionCount}
            />
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h3>Recent Activity</h3>
              <p>Your latest applications and career updates.</p>
            </div>

            <span className="card-icon">🕒</span>
          </div>

          {recentActivity.length > 0 ? (
            <div className="overview-list">
              {recentActivity.map((activity) => (
                <OverviewRow
                  key={activity.id}
                  label={activity.title}
                  value={activity.date}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📌</div>
              <h3>No recent activity</h3>
              <p>Start by adding skills, taking an assessment or applying for jobs.</p>
            </div>
          )}
        </div>

      </div>

      {/* QUICK ACTIONS */}
      <div className="section-heading">
        <div>
          <h2>Quick Actions</h2>
          <p>Manage your career activities.</p>
        </div>
      </div>

      <div className="quick-actions-grid">

        <QuickAction
          icon="🧠"
          title="Add Skills"
          description="Add your technical skills"
          onClick={() => navigate("skills")}
        />

        <QuickAction
          icon="📝"
          title="Take Assessment"
          description="Verify your skills"
          onClick={() => navigate("assessment")}
        />

        <QuickAction
          icon="💼"
          title="Find Jobs"
          description="Explore opportunities"
          onClick={() => navigate("jobs")}
        />

        <QuickAction
          icon="📄"
          title="Upload Resume"
          description="Manage documents"
          onClick={() => navigate("documents")}
        />

        <QuickAction
          icon="🤖"
          title="AI Career Assistant"
          description="Get career guidance"
          onClick={() => navigate("assistant")}
        />

        <QuickAction
          icon="🎯"
          title="AI Job Match"
          description="Check job compatibility"
          onClick={() => navigate("match")}
        />

      </div>

    </div>
  );
}

/* =========================================================
   STAT CARD
   ========================================================= */

function StatCard({
  icon,
  title,
  value,
  progress,
  onClick,
}) {
  return (
    <button className="stat-card" onClick={onClick}>

      <div className="stat-top">
        <span className="stat-icon">
          {icon}
        </span>

        <span className="stat-arrow">
          →
        </span>
      </div>

      <h3>{value}</h3>

      <p>{title}</p>

      {progress !== undefined && (
        <div className="small-progress">
          <div
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      )}

    </button>
  );
}

/* =========================================================
   PROFILE
   ========================================================= */

function Profile({ profile, updateProfile }) {

  const [form, setForm] = useState({
    ...profile,
    name: profile?.name || "",
    photo: profile?.photo || "",
    college: profile?.college || "",
    course: profile?.course || "",
    branch: profile?.branch || "",
    semester: profile?.semester || "",
    cgpa: profile?.cgpa || "",
    education: profile?.education || "",
    github: profile?.github || "",
    linkedin: profile?.linkedin || "",
    portfolio: profile?.portfolio || "",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm({
      ...profile,
      name: profile?.name || "",
      photo: profile?.photo || "",
      college: profile?.college || "",
      course: profile?.course || "",
      branch: profile?.branch || "",
      semester: profile?.semester || "",
      cgpa: profile?.cgpa || "",
      education: profile?.education || "",
      github: profile?.github || "",
      linkedin: profile?.linkedin || "",
      portfolio: profile?.portfolio || "",
    });
  }, [profile]);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSaved(false);
  }

  function handleSubmit(e) {
    e.preventDefault();

    updateProfile(form);
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  }

  return (
    <div>

      <PageIntro
        title="My Profile"
        description="Add and manage your personal and education information."
      />

      <form onSubmit={handleSubmit}>

        <div className="profile-layout">

          <div className="dashboard-card profile-photo-card">

            <div className="profile-large-avatar">

              {form.photo ? (
                <img
                  src={form.photo}
                  alt="Profile"
                />
              ) : (
                "👨‍🎓"
              )}

            </div>

            <h3>
              {form.name || "Your Name"}
            </h3>

            <p>
              {form.college || "Your College"}
            </p>

            <label className="input-label">
              Profile Photo
            </label>

            <input
              id="profile-photo-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const allowedTypes = [
                  "image/jpeg",
                  "image/png",
                  "image/webp",
                ];

                if (!allowedTypes.includes(file.type)) {
                  alert("Please select a JPG, PNG or WEBP image.");
                  e.target.value = "";
                  return;
                }

                if (file.size > 2 * 1024 * 1024) {
                  alert("Profile photo must be 2 MB or less.");
                  e.target.value = "";
                  return;
                }

                const reader = new FileReader();

                reader.onload = () => {
                  setForm((prev) => ({
                    ...prev,
                    photo: reader.result,
                  }));
                  setSaved(false);
                };

                reader.onerror = () => {
                  alert("Could not read the selected image.");
                  e.target.value = "";
                };

                reader.readAsDataURL(file);
              }}
            />

            <small className="info-note">
              JPG, PNG or WEBP • Maximum 2 MB
            </small>

            {form.photo && (
              <button
                type="button"
                className="outline-button"
                style={{ marginTop: "10px" }}
                onClick={() => {
                  setForm((prev) => ({
                    ...prev,
                    photo: "",
                  }));
                  const input = document.getElementById(
                    "profile-photo-input"
                  );
                  if (input) input.value = "";
                  setSaved(false);
                }}
              >
                Remove Photo
              </button>
            )}

          </div>

          <div className="dashboard-card">

            <div className="card-header">
              <div>
                <h3>Personal Information</h3>
                <p>Your basic student information.</p>
              </div>
            </div>

            <div className="form-grid">

              <InputField
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />

              <InputField
                label="College"
                name="college"
                value={form.college}
                onChange={handleChange}
                placeholder="Enter college name"
              />

              <InputField
                label="Course Name"
                name="course"
                value={form.course}
                onChange={handleChange}
                placeholder="e.g. B.Tech"
              />

              <InputField
                label="Branch / Department"
                name="branch"
                value={form.branch}
                onChange={handleChange}
                placeholder="e.g. CSE"
              />

              <InputField
                label="Semester"
                name="semester"
                value={form.semester}
                onChange={handleChange}
                placeholder="e.g. 5"
              />

              <div className="input-group">
                <label>CGPA</label>
                <input
                  type="number"
                  name="cgpa"
                  value={form.cgpa || ""}
                  onChange={handleChange}
                  placeholder="Enter CGPA (0-10)"
                  min="0"
                  max="10"
                  step="0.01"
                />
              </div>

            </div>

          </div>

        </div>

        <div className="dashboard-card form-section">

          <div className="card-header">
            <div>
              <h3>Education Details</h3>
              <p>Add your educational background.</p>
            </div>
          </div>

          <textarea
            name="education"
            value={form.education}
            onChange={handleChange}
            placeholder="e.g. 12th, Diploma, previous degree, achievements..."
            rows="5"
          />

        </div>

        <div className="dashboard-card form-section">

          <div className="card-header">
            <div>
              <h3>Professional Links</h3>
              <p>Add your GitHub, LinkedIn and portfolio.</p>
            </div>
          </div>

          <div className="form-grid">

            <InputField
              label="GitHub"
              name="github"
              value={form.github}
              onChange={handleChange}
              placeholder="https://github.com/..."
            />

            <InputField
              label="LinkedIn"
              name="linkedin"
              value={form.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/..."
            />

            <InputField
              label="Portfolio"
              name="portfolio"
              value={form.portfolio}
              onChange={handleChange}
              placeholder="Portfolio URL"
            />

          </div>

        </div>

        <div className="save-area">

          {saved && (
            <span className="save-success">
              ✓ Profile saved successfully
            </span>
          )}

          <button className="primary-button" type="submit">
            Save Profile
          </button>

        </div>

      </form>

    </div>
  );
}

/* =========================================================
   SKILLS
   ========================================================= */

function Skills({ skills, updateSkills }) {

  const [skillName, setSkillName] = useState("");

  function addSkill(e) {
    e.preventDefault();

    const name = skillName.trim();

    if (!name) return;

    const exists = skills.some(
      (skill) =>
        skill.name.toLowerCase() === name.toLowerCase()
    );

    if (exists) {
      alert("This skill is already added.");
      return;
    }

    const newSkill = {
      id: Date.now(),
      name,
      score: 0,
      verified: false,
    };

    updateSkills([...skills, newSkill]);
    setSkillName("");
  }

  function removeSkill(id) {
    updateSkills(
      skills.filter((skill) => skill.id !== id)
    );
  }

  return (
    <div>

      <PageIntro
        title="My Skills"
        description="Add your skills and track their verification status."
      />

      <div className="dashboard-card">

        <form
          className="add-skill-form"
          onSubmit={addSkill}
        >

          <input
            type="text"
            value={skillName}
            onChange={(e) =>
              setSkillName(e.target.value)
            }
            placeholder="Enter skill e.g. Java, Python, React..."
          />

          <button className="primary-button">
            + Add Skill
          </button>

        </form>

      </div>

      <div className="section-heading">
        <div>
          <h2>Your Skills</h2>
          <p>
            {skills.length} skill
            {skills.length !== 1 ? "s" : ""} added
          </p>
        </div>
      </div>

      {skills.length === 0 ? (
        <EmptyState
          icon="🧠"
          title="No skills added yet"
          description="Add your technical or soft skills to get started."
        />
      ) : (
        <div className="skills-grid">

          {skills.map((skill) => (

            <div className="skill-card" key={skill.id}>

              <div className="skill-card-top">

                <div className="skill-symbol">
                  🧠
                </div>

                <button
                  className="delete-button"
                  onClick={() =>
                    removeSkill(skill.id)
                  }
                >
                  ×
                </button>

              </div>

              <div
                className="skill-name-visible"
                title={skill.name || "Unnamed Skill"}
                style={{
                  display: "block",
                  fontSize: "20px",
                  fontWeight: 700,
                  lineHeight: 1.3,
                  margin: "12px 0 8px",
                  color: "#0f172a",
                  wordBreak: "break-word",
                }}
              >
                {skill.name || "Unnamed Skill"}
              </div>

              <div className="skill-score">
                Score: <strong>{skill.score}%</strong>
              </div>

              <div
                className={
                  skill.verified
                    ? "verified-badge"
                    : "unverified-badge"
                }
              >
                {skill.verified
                  ? "✓ Verified"
                  : "○ Unverified"}
              </div>

              <div className="small-progress">
                <div
                  style={{
                    width: `${skill.score}%`,
                  }}
                />
              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}

/* =========================================================
   SKILL ASSESSMENT
   ========================================================= */

const assessmentQuestions = [
  {
    question:
      "Which data structure follows the FIFO principle?",
    options: [
      "Stack",
      "Queue",
      "Tree",
      "Graph",
    ],
    answer: "Queue",
  },
  {
    question:
      "Which keyword is used to create a class in Java?",
    options: [
      "class",
      "struct",
      "object",
      "define",
    ],
    answer: "class",
  },
  {
    question:
      "Which language is mainly used for styling web pages?",
    options: [
      "HTML",
      "CSS",
      "SQL",
      "Python",
    ],
    answer: "CSS",
  },
  {
    question:
      "Which SQL command is used to retrieve data?",
    options: [
      "INSERT",
      "UPDATE",
      "SELECT",
      "DELETE",
    ],
    answer: "SELECT",
  },
  {
    question:
      "Which technology is used to build component-based user interfaces?",
    options: [
      "React",
      "MySQL",
      "MongoDB",
      "Git",
    ],
    answer: "React",
  },
];

function SkillAssessment({ skills, updateSkills }) {

  const [selectedSkill, setSelectedSkill] = useState("");
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  function startTest() {

    if (!selectedSkill) {
      alert("Please select a skill first.");
      return;
    }

    setStarted(true);
    setResult(null);
    setAnswers({});
  }

  function selectAnswer(index, option) {
    setAnswers((prev) => ({
      ...prev,
      [index]: option,
    }));
  }

  function submitTest() {

    let correct = 0;

    assessmentQuestions.forEach(
      (question, index) => {
        if (answers[index] === question.answer) {
          correct++;
        }
      }
    );

    const score = Math.round(
      (correct / assessmentQuestions.length) * 100
    );

    setResult(score);

    const updatedSkills = skills.map((skill) => {

      if (
        skill.name.toLowerCase() ===
        selectedSkill.toLowerCase()
      ) {
        return {
          ...skill,
          score,
          verified: score >= 60,
        };
      }

      return skill;
    });

    updateSkills(updatedSkills);
  }

  return (
    <div>

      <PageIntro
        title="Skill Assessment"
        description="Take a test to verify your skills."
      />

      {!started && !result && (

        <div className="dashboard-card assessment-start">

          <div className="assessment-icon">
            📝
          </div>

          <h2>Start Skill Assessment</h2>

          <p>
            Select one of your added skills and take the assessment.
          </p>

          {skills.length === 0 ? (

            <EmptyState
              icon="🧠"
              title="No skills available"
              description="Please add a skill from My Skills before starting an assessment."
            />

          ) : (

            <>
              <select
                value={selectedSkill}
                onChange={(e) =>
                  setSelectedSkill(e.target.value)
                }
              >
                <option value="">
                  Select a skill
                </option>

                {skills.map((skill) => (
                  <option
                    key={skill.id}
                    value={skill.name}
                  >
                    {skill.name}
                  </option>
                ))}
              </select>

              <button
                className="primary-button"
                onClick={startTest}
              >
                Start Test
              </button>
            </>

          )}

        </div>

      )}

      {started && !result && (

        <div>

          <div className="assessment-header">

            <div>
              <h2>{selectedSkill} Assessment</h2>
              <p>
                {assessmentQuestions.length} questions
              </p>
            </div>

          </div>

          {assessmentQuestions.map(
            (question, index) => (

              <div
                className="dashboard-card question-card"
                key={index}
              >

                <h3>
                  Q{index + 1}. {question.question}
                </h3>

                <div className="options-grid">

                  {question.options.map(
                    (option) => (

                      <label
                        key={option}
                        className={`option ${
                          answers[index] === option
                            ? "selected"
                            : ""
                        }`}
                      >

                        <input
                          type="radio"
                          name={`question-${index}`}
                          checked={
                            answers[index] === option
                          }
                          onChange={() =>
                            selectAnswer(
                              index,
                              option
                            )
                          }
                        />

                        {option}

                      </label>

                    )
                  )}

                </div>

              </div>

            )
          )}

          <button
            className="primary-button"
            onClick={submitTest}
          >
            Submit Assessment
          </button>

        </div>

      )}

      {result !== null && (

        <div className="dashboard-card assessment-result">

          <div className="result-circle">
            {result}%
          </div>

          <h2>Assessment Completed</h2>

          <p>
            {result >= 60
              ? `${selectedSkill} is now verified.`
              : `You need ${selectedSkill} improvement.`}
          </p>

          <div
            className={
              result >= 60
                ? "verified-badge"
                : "unverified-badge"
            }
          >
            {result >= 60
              ? "✓ Skill Verified"
              : "○ Skill Not Verified"}
          </div>

          <button
            className="outline-button"
            onClick={() => {
              setStarted(false);
              setResult(null);
            }}
          >
            Take Another Test
          </button>

        </div>

      )}

    </div>
  );
}

/* =========================================================
   DOCUMENTS
   ========================================================= */

function Documents({ documents, updateDocuments }) {

  const [type, setType] = useState("Resume");
  const [name, setName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ];

    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      alert("Please select a PDF, DOC, DOCX, JPG or PNG file.");
      e.target.value = "";
      return;
    }

    if (file.size > maxSize) {
      alert("File size must be 5 MB or less.");
      e.target.value = "";
      return;
    }

    setSelectedFile(file);

    if (!name.trim()) {
      setName(file.name.replace(/\.[^/.]+$/, ""));
    }
  }

  function addDocument(e) {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please choose a file first.");
      return;
    }

    if (!name.trim()) {
      alert("Enter a document name.");
      return;
    }

    setUploading(true);

    const reader = new FileReader();

    reader.onload = () => {
      const newDocument = {
        id: Date.now(),
        name: name.trim(),
        type,
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
        fileData: reader.result,
        date: new Date().toLocaleDateString(),
      };

      updateDocuments([...documents, newDocument]);
      setName("");
      setSelectedFile(null);
      setUploading(false);

      const fileInput = document.querySelector?.("input[type='file']");
      if (fileInput) fileInput.value = "";
    };

    reader.onerror = () => {
      setUploading(false);
      alert("Could not read the selected file.");
    };

    reader.readAsDataURL(selectedFile);
  }

  function openStoredDocument(document) {
    if (!document.fileData) {
      alert("This document does not contain an uploaded file.");
      return;
    }

    try {
      const commaIndex = document.fileData.indexOf(",");
      const base64 =
        commaIndex >= 0
          ? document.fileData.slice(commaIndex + 1)
          : document.fileData;

      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);

      for (let i = 0; i < binary.length; i += 1) {
        bytes[i] = binary.charCodeAt(i);
      }

      const blob = new Blob([bytes], {
        type:
          document.fileType ||
          "application/octet-stream",
      });

      const url = URL.createObjectURL(blob);
      const newWindow = window.open(url, "_blank");

      if (!newWindow) {
        URL.revokeObjectURL(url);
        alert("Please allow pop-ups in your browser to view the document.");
        return;
      }

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 60_000);
    } catch (error) {
      console.error("Could not open document", error);
      alert("This document could not be opened. Please upload it again.");
    }
  }

  function removeDocument(id) {
    updateDocuments(
      documents.filter((document) => document.id !== id)
    );
  }

  function formatFileSize(bytes) {
    if (!bytes) return "Unknown size";
    if (bytes < 1024 * 1024) {
      return `${Math.round(bytes / 1024)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  return (
    <div>

      <PageIntro
        title="Resume & Certificates"
        description="Upload and manage your resume, certificates and project files."
      />

      <div className="dashboard-card">

        <h3>Add Document</h3>

        <form
          className="document-form"
          onSubmit={addDocument}
        >

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option>Resume</option>
            <option>Certificate</option>
            <option>Project</option>
          </select>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Document name"
          />

          <input
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleFileChange}
          />

          <button
            className="primary-button"
            type="submit"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "+ Add Document"}
          </button>

        </form>

        {selectedFile && (
          <p className="info-note">
            Selected: <strong>{selectedFile.name}</strong> ({formatFileSize(selectedFile.size)})
          </p>
        )}

        <p className="info-note">
          Frontend prototype: selected files are stored locally in this browser for demo purposes.
          Maximum file size: 5 MB.
        </p>

      </div>

      <div className="section-heading">
        <div>
          <h2>Your Documents</h2>
          <p>{documents.length} document{documents.length !== 1 ? "s" : ""} added</p>
        </div>
      </div>

      {documents.length === 0 ? (

        <EmptyState
          icon="📄"
          title="No documents added"
          description="Upload your resume, certificates or project files."
        />

      ) : (

        <div className="documents-grid">

          {documents.map((document) => (

            <div
              className="document-card"
              key={document.id}
            >

              <div className="document-icon">
                {document.type === "Resume"
                  ? "📄"
                  : document.type === "Certificate"
                  ? "🏅"
                  : "💻"}
              </div>

              <div>
                <span className="document-type">
                  {document.type}
                </span>

                <h3>{document.name}</h3>

                <small>
                  File: {document.fileName || document.name}
                </small>

                <br />

                <small>
                  Added: {document.date}
                  {document.fileSize ? ` • ${formatFileSize(document.fileSize)}` : ""}
                </small>

                <div style={{ marginTop: "10px" }}>
                  {document.fileData && (
                    <button
                      type="button"
                      className="outline-button"
                      onClick={() => openStoredDocument(document)}
                    >
                      View / Open
                    </button>
                  )}
                </div>
              </div>

              <button
                type="button"
                className="delete-button"
                onClick={() => removeDocument(document.id)}
                title={`Delete ${document.name}`}
              >
                ×
              </button>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

/* =========================================================
   JOBS
   ========================================================= */

function Jobs({
  jobs,
  applications,
  updateApplications,
}) {

  const [filter, setFilter] = useState("All");

  const filteredJobs = jobs.filter((job) => {
    if (filter === "All") return true;
    return job.type === filter;
  });

  function applyJob(job) {

    const alreadyApplied = applications.some(
      (application) =>
        application.jobId === job.id
    );

    if (alreadyApplied) {
      alert("You already applied for this opportunity.");
      return;
    }

    const application = {
      id: Date.now(),
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      appliedDate: new Date().toLocaleDateString(),
      status: "Applied",
    };

    updateApplications([
      ...applications,
      application,
    ]);

    alert("Application submitted.");
  }

  return (
    <div>

      <PageIntro
        title="Jobs & Internships"
        description="Explore opportunities shared with you."
      />

      <div className="filter-bar">

        <button
          className={filter === "All" ? "filter-active" : ""}
          onClick={() => setFilter("All")}
        >
          All
        </button>

        <button
          className={
            filter === "Job" ? "filter-active" : ""
          }
          onClick={() => setFilter("Job")}
        >
          Jobs
        </button>

        <button
          className={
            filter === "Internship"
              ? "filter-active"
              : ""
          }
          onClick={() => setFilter("Internship")}
        >
          Internships
        </button>

      </div>

      {filteredJobs.length === 0 ? (

        <EmptyState
          icon="💼"
          title="No jobs or internships available"
          description="New opportunities will appear here when your college/company adds them."
        />

      ) : (

        <div className="jobs-grid">

          {filteredJobs.map((job) => (

            <div
              className="job-card"
              key={job.id}
            >

              <div className="job-card-top">

                <div className="company-logo">
                  🏢
                </div>

                <span className="job-type">
                  {job.type}
                </span>

              </div>

              <h2>{job.title}</h2>

              <p className="company-name">
                {job.company}
              </p>

              <div className="job-details">
                <span>📍 {job.location}</span>
                <span>💰 {job.package}</span>
                <span>🎓 {job.eligibility}</span>
              </div>

              <div className="required-skills">

                <strong>Required Skills</strong>

                <div>
                  {job.skills?.map(
                    (skill) => (
                      <span
                        className="skill-tag"
                        key={skill}
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>

              </div>

              <button
                className="primary-button full-width"
                onClick={() => applyJob(job)}
              >
                Apply Now
              </button>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

/* =========================================================
   AI JOB MATCH
   ========================================================= */

function JobMatch({ skills, jobs }) {

  const verifiedSkillNames = skills
    .filter((skill) => skill.verified)
    .map((skill) => skill.name.toLowerCase());

  const matches = useMemo(() => {

    return jobs.map((job) => {

      const requiredSkills = job.skills || [];

      if (requiredSkills.length === 0) {
        return {
          ...job,
          match: 0,
          missing: [],
        };
      }

      const matched = requiredSkills.filter(
        (required) =>
          verifiedSkillNames.includes(
            required.toLowerCase()
          )
      );

      const percentage = Math.round(
        (matched.length / requiredSkills.length) * 100
      );

      const missing = requiredSkills.filter(
        (required) =>
          !verifiedSkillNames.includes(
            required.toLowerCase()
          )
      );

      return {
        ...job,
        match: percentage,
        missing,
      };

    });

  }, [jobs, verifiedSkillNames.join(",")]);

  return (
    <div>

      <PageIntro
        title="AI Job Match"
        description="Compare your verified skills with company requirements."
      />

      {jobs.length === 0 ? (

        <EmptyState
          icon="🎯"
          title="No job data available"
          description="Job matching will appear here when companies publish opportunities."
        />

      ) : skills.filter((s) => s.verified).length === 0 ? (

        <EmptyState
          icon="🧠"
          title="No verified skills"
          description="Complete skill assessments to get meaningful job matches."
        />

      ) : (

        <div className="match-grid">

          {matches.map((job) => (

            <div
              className="dashboard-card match-card"
              key={job.id}
            >

              <div className="match-top">

                <div>
                  <h2>{job.title}</h2>
                  <p>{job.company}</p>
                </div>

                <div className="match-circle">
                  {job.match}%
                </div>

              </div>

              <div className="match-progress">
                <div
                  style={{
                    width: `${job.match}%`,
                  }}
                />
              </div>

              <p className="match-label">
                {job.match >= 80
                  ? "Excellent Match"
                  : job.match >= 60
                  ? "Good Match"
                  : job.match >= 40
                  ? "Partial Match"
                  : "Low Match"}
              </p>

              {job.missing.length > 0 && (

                <div className="missing-skills">

                  <strong>Missing Skills</strong>

                  <div>
                    {job.missing.map(
                      (skill) => (
                        <span
                          className="missing-tag"
                          key={skill}
                        >
                          {skill}
                        </span>
                      )
                    )}
                  </div>

                </div>

              )}

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

/* =========================================================
   APPLICATIONS
   ========================================================= */

function Applications({ applications }) {

  return (
    <div>

      <PageIntro
        title="My Applications"
        description="Track all your job and internship applications."
      />

      {applications.length === 0 ? (

        <EmptyState
          icon="📝"
          title="No applications yet"
          description="Your applications will appear here after you apply for a job."
        />

      ) : (

        <div className="dashboard-card table-card">

          <div className="table-container">

            <table>

              <thead>
                <tr>
                  <th>Job</th>
                  <th>Company</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {applications.map(
                  (application) => (

                    <tr key={application.id}>

                      <td>
                        <strong>
                          {application.jobTitle}
                        </strong>
                      </td>

                      <td>
                        {application.company}
                      </td>

                      <td>
                        {application.appliedDate}
                      </td>

                      <td>
                        <StatusBadge
                          status={
                            application.status
                          }
                        />
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

      )}

    </div>
  );
}

/* =========================================================
   INTERVIEWS
   ========================================================= */

function Interviews({ interviews }) {

  return (
    <div>

      <PageIntro
        title="Interviews"
        description="View your upcoming and completed interviews."
      />

      {interviews.length === 0 ? (

        <EmptyState
          icon="🎤"
          title="No interviews scheduled"
          description="Interview details will appear here when you are shortlisted."
        />

      ) : (

        <div className="interviews-grid">

          {interviews.map((interview) => (

            <div
              className="dashboard-card interview-card"
              key={interview.id}
            >

              <div className="interview-icon">
                🎤
              </div>

              <div>
                <h2>{interview.company}</h2>
                <p>{interview.role}</p>
              </div>

              <div className="interview-details">
                <span>
                  📅 {interview.date}
                </span>

                <span>
                  🕐 {interview.time}
                </span>

                <span>
                  🔄 {interview.round}
                </span>

                <span>
                  💻 {interview.mode}
                </span>
              </div>

              <StatusBadge
                status={
                  interview.status || "Scheduled"
                }
              />

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

/* =========================================================
   SELECTIONS
   ========================================================= */

function Selections({ selections }) {

  return (
    <div>

      <PageIntro
        title="My Selections"
        description="View your selected companies and offers."
      />

      {selections.length === 0 ? (

        <EmptyState
          icon="🏆"
          title="No selections yet"
          description="Your selection details will appear here after successful placement."
        />

      ) : (

        <div className="selection-grid">

          {selections.map((selection) => (

            <div
              className="selection-card"
              key={selection.id}
            >

              <div className="selection-trophy">
                🏆
              </div>

              <span className="selected-label">
                SELECTED
              </span>

              <h2>{selection.company}</h2>

              <p>{selection.role}</p>

              <div className="package-box">
                <small>Package</small>
                <strong>
                  {selection.package}
                </strong>
              </div>

              <div className="selection-date">
                Selection Date:{" "}
                {selection.date}
              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

/* =========================================================
   AI CAREER ASSISTANT
   ========================================================= */

function CareerAssistant({ skills }) {

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  function sendMessage(e) {

    e.preventDefault();

    if (!input.trim()) return;

    const userMessage = input.trim();

    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        text: userMessage,
      },
      {
        type: "ai",
        text:
          "AI Career Assistant is currently a frontend prototype. Your request can be connected to an AI API later.",
      },
    ]);

    setInput("");
  }

  function analyzeRequirement() {

    if (!input.trim()) {
      alert("Paste a job requirement first.");
      return;
    }

    const text = input.toLowerCase();

    const possibleSkills = [
      "java",
      "python",
      "c++",
      "react",
      "javascript",
      "sql",
      "html",
      "css",
      "node.js",
      "mongodb",
      "git",
      "aws",
      "docker",
    ];

    const required = possibleSkills.filter(
      (skill) => text.includes(skill)
    );

    const studentSkills = skills.map(
      (skill) => skill.name.toLowerCase()
    );

    const missing = required.filter(
      (skill) =>
        !studentSkills.includes(skill)
    );

    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        text: input.trim(),
      },
      {
        type: "ai",
        text:
          required.length > 0
            ? `Required skills detected: ${required.join(
                ", "
              )}. Missing skills from your current profile: ${
                missing.length
                  ? missing.join(", ")
                  : "None"
              }.`
            : "No recognizable technical skills were detected in the pasted requirement.",
      },
    ]);

    setInput("");
  }

  return (
    <div>

      <PageIntro
        title="AI Career Assistant"
        description="Paste a job requirement and compare it with your skills."
      />

      <div className="assistant-layout">

        <div className="dashboard-card chat-card">

          <div className="chat-header">
            <div className="ai-avatar">
              🤖
            </div>

            <div>
              <h3>AI Career Assistant</h3>
              <p>Career guidance prototype</p>
            </div>
          </div>

          <div className="chat-messages">

            {messages.length === 0 ? (

              <div className="chat-empty">

                <div>🤖</div>

                <h3>
                  How can I help you?
                </h3>

                <p>
                  Paste a job description or ask a career-related question.
                </p>

              </div>

            ) : (

              messages.map((message, index) => (

                <div
                  className={`chat-message ${message.type}`}
                  key={index}
                >
                  {message.text}
                </div>

              ))

            )}

          </div>

          <form
            className="chat-input-area"
            onSubmit={sendMessage}
          >

            <textarea
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              placeholder="Paste job requirements or ask something..."
              rows="3"
            />

            <div className="assistant-actions">

              <button
                type="button"
                className="outline-button"
                onClick={analyzeRequirement}
              >
                🎯 Analyze Requirements
              </button>

              <button className="primary-button">
                Send →
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   ANALYTICS
   ========================================================= */

function Analytics({ data }) {

  const verifiedSkills = data.skills.filter(
    (skill) => skill.verified
  );

  const averageSkillScore =
    data.skills.length > 0
      ? Math.round(
          data.skills.reduce(
            (sum, skill) => sum + Number(skill.score || 0),
            0
          ) / data.skills.length
        )
      : 0;

  const profileFieldValues = [
    data.profile.name,
    data.profile.college,
    data.profile.course,
    data.profile.branch,
    data.profile.semester,
    data.profile.cgpa,
    data.profile.education,
    data.profile.github,
    data.profile.linkedin,
  ];

  const profileCompletion = Math.round(
    (profileFieldValues.filter(
      (value) => value && String(value).trim() !== ""
    ).length /
      profileFieldValues.length) *
      100
  );

  const applications = data.applications || [];
  const interviews = data.interviews || [];
  const selections = data.selections || [];
  const documents = data.documents || [];

  const shortlistedCount = applications.filter(
    (application) => application.status === "Shortlisted"
  ).length;

  const readiness = Math.round(
    profileCompletion * 0.4 +
      Math.min(100, verifiedSkills.length * 20) * 0.25 +
      averageSkillScore * 0.2 +
      Math.min(100, documents.length * 25) * 0.1 +
      Math.min(100, applications.length * 20 + interviews.length * 10 + selections.length * 20) * 0.05
  );

  const strongestSkill =
    data.skills.length > 0
      ? [...data.skills].sort(
          (a, b) => Number(b.score || 0) - Number(a.score || 0)
        )[0]
      : null;

  const improvementSkills = [...data.skills]
    .filter((skill) => Number(skill.score || 0) < 60)
    .sort((a, b) => Number(a.score || 0) - Number(b.score || 0))
    .slice(0, 3);

  function readinessLabel(score) {
    if (score >= 80) return "Excellent readiness";
    if (score >= 60) return "Good progress";
    if (score >= 40) return "Getting there";
    return "Needs improvement";
  }

  return (
    <div>

      <PageIntro
        title="Career Analytics"
        description="Understand your current career progress, skills and readiness."
      />

      <div className="analytics-grid">

        <AnalyticsCard
          title="Profile Completion"
          value={`${profileCompletion}%`}
          icon="👤"
          progress={profileCompletion}
        />

        <AnalyticsCard
          title="Average Skill Score"
          value={`${averageSkillScore}%`}
          icon="🧠"
          progress={averageSkillScore}
        />

        <AnalyticsCard
          title="Verified Skills"
          value={verifiedSkills.length}
          icon="✓"
        />

        <AnalyticsCard
          title="Applications"
          value={applications.length}
          icon="📝"
        />

        <AnalyticsCard
          title="Shortlisted"
          value={shortlistedCount}
          icon="🎯"
        />

        <AnalyticsCard
          title="Interviews"
          value={interviews.length}
          icon="🎤"
        />

        <AnalyticsCard
          title="Selections"
          value={selections.length}
          icon="🏆"
        />

        <AnalyticsCard
          title="Documents"
          value={documents.length}
          icon="📄"
        />

      </div>

      <div className="dashboard-grid">

        <div className="dashboard-card">

          <div className="card-header">
            <div>
              <h3>Skill Strength</h3>
              <p>Your current skill assessment scores.</p>
            </div>
          </div>

          {data.skills.length === 0 ? (

            <EmptyState
              icon="📊"
              title="No skill data"
              description="Add and assess skills to see analytics."
            />

          ) : (

            <div className="skill-analytics">

              {data.skills.map((skill) => (

                <div
                  className="skill-analysis-row"
                  key={skill.id}
                >

                  <div className="analysis-name">
                    <strong>{skill.name || "Unnamed Skill"}</strong>

                    {skill.verified && (
                      <span>✓</span>
                    )}
                  </div>

                  <div className="analysis-progress">
                    <div>
                      <span
                        style={{
                          width: `${Math.min(100, Math.max(0, Number(skill.score || 0)))}%`,
                        }}
                      />
                    </div>
                  </div>

                  <strong>
                    {Number(skill.score || 0)}%
                  </strong>

                </div>

              ))}

            </div>

          )}

        </div>

        <div className="dashboard-card readiness-card">

          <div className="card-header">
            <div>
              <h3>Career Readiness</h3>
              <p>Based on profile, skills and career activity.</p>
            </div>
          </div>

          <div className="readiness-circle">
            {readiness}%
          </div>

          <h3>{readinessLabel(readiness)}</h3>

          <p>
            Keep improving your profile, verified skills, assessments and documents.
          </p>

        </div>

      </div>

      <div className="dashboard-grid">

        <div className="dashboard-card">

          <div className="card-header">
            <div>
              <h3>Strongest Skill</h3>
              <p>Your highest current assessment score.</p>
            </div>
          </div>

          {strongestSkill ? (
            <>
              <h2>{strongestSkill.name}</h2>
              <p>
                Score: <strong>{Number(strongestSkill.score || 0)}%</strong>
                {strongestSkill.verified ? " • Verified" : " • Not verified yet"}
              </p>
            </>
          ) : (
            <EmptyState
              icon="🧠"
              title="No strongest skill yet"
              description="Add and assess at least one skill."
            />
          )}

        </div>

        <div className="dashboard-card">

          <div className="card-header">
            <div>
              <h3>Skills to Improve</h3>
              <p>Focus on these skills next.</p>
            </div>
          </div>

          {improvementSkills.length === 0 ? (
            <p className="success-message">
              ✓ No immediate skill weakness detected.
            </p>
          ) : (
            <div className="overview-list">
              {improvementSkills.map((skill) => (
                <OverviewRow
                  key={skill.id}
                  label={skill.name || "Unnamed Skill"}
                  value={`${Number(skill.score || 0)}%`}
                />
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   PRIVACY
   ========================================================= */

function Privacy({ privacy, updatePrivacy }) {

  const privacyItems = [
    ["name", "Name"],
    ["college", "College"],
    ["course", "Course"],
    ["branch", "Branch"],
    ["semester", "Semester"],
    ["cgpa", "CGPA"],
    ["skills", "Skills"],
    ["resume", "Resume"],
    ["certificates", "Certificates"],
    ["phone", "Phone"],
    ["email", "Email"],
    ["address", "Address"],
  ];

  function toggle(key) {

    updatePrivacy({
      ...privacy,
      [key]: !privacy[key],
    });

  }

  return (
    <div>

      <PageIntro
        title="Privacy & Data Visibility"
        description="Control which information can be visible to companies."
      />

      <div className="dashboard-card privacy-card">

        <div className="privacy-info">
          <div className="privacy-icon">
            🔐
          </div>

          <div>
            <h3>Your Data Visibility</h3>
            <p>
              These controls represent which information
              you allow companies to access.
            </p>
          </div>
        </div>

        <div className="privacy-list">

          {privacyItems.map(
            ([key, label]) => (

              <div
                className="privacy-row"
                key={key}
              >

                <div>
                  <strong>{label}</strong>

                  <small>
                    Company visibility
                  </small>
                </div>

                <button
                  className={`toggle ${
                    privacy[key]
                      ? "on"
                      : ""
                  }`}
                  onClick={() =>
                    toggle(key)
                  }
                >
                  <span />
                </button>

              </div>

            )
          )}

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   NOTIFICATIONS
   ========================================================= */

function Notifications({ notifications }) {

  return (
    <div>

      <PageIntro
        title="Notifications"
        description="Stay updated about jobs, interviews and assessments."
      />

      {notifications.length === 0 ? (

        <EmptyState
          icon="🔔"
          title="No notifications"
          description="New job, interview and college/company updates will appear here."
        />

      ) : (

        <div className="notifications-list">

          {notifications.map(
            (notification) => (

              <div
                className="notification-card"
                key={notification.id}
              >

                <div className="notification-icon">
                  🔔
                </div>

                <div>
                  <h3>
                    {notification.title}
                  </h3>

                  <p>
                    {notification.message}
                  </p>

                  <small>
                    {notification.date}
                  </small>
                </div>

              </div>

            )
          )}

        </div>

      )}

    </div>
  );
}

/* =========================================================
   SETTINGS
   ========================================================= */

function Settings({
  settings,
  updateSettings,
}) {

  const settingsItems = [
    [
      "emailNotifications",
      "Email Notifications",
      "Receive important account updates.",
    ],
    [
      "jobNotifications",
      "Job Notifications",
      "Get notified about new opportunities.",
    ],
    [
      "interviewNotifications",
      "Interview Notifications",
      "Receive interview reminders.",
    ],
    [
      "assessmentNotifications",
      "Assessment Notifications",
      "Receive skill assessment results.",
    ],
  ];

  function toggle(key) {

    updateSettings({
      ...settings,
      [key]: !settings[key],
    });

  }

  return (
    <div>

      <PageIntro
        title="Settings"
        description="Manage your student account preferences."
      />

      <div className="dashboard-card">

        <h3>Notification Preferences</h3>

        <div className="settings-list">

          {settingsItems.map(
            ([key, title, description]) => (

              <div
                className="settings-row"
                key={key}
              >

                <div>
                  <strong>{title}</strong>
                  <p>{description}</p>
                </div>

                <button
                  className={`toggle ${
                    settings[key]
                      ? "on"
                      : ""
                  }`}
                  onClick={() =>
                    toggle(key)
                  }
                >
                  <span />
                </button>

              </div>

            )
          )}

        </div>

      </div>

      <div className="dashboard-card danger-zone">

        <h3>Account</h3>

        <p>
          Student data is currently stored only in
          this browser for the frontend prototype.
        </p>

        <button
          className="danger-button"
          onClick={() => {

            const confirmDelete =
              window.confirm(
                "Delete all student dashboard data?"
              );

            if (confirmDelete) {
              localStorage.removeItem(
                "SetuStudent"
              );

              window.location.reload();
            }

          }}
        >
          Delete Local Data
        </button>

      </div>

    </div>
  );
}

/* =========================================================
   REUSABLE COMPONENTS
   ========================================================= */

function PageIntro({
  title,
  description,
}) {

  return (
    <div className="page-intro">

      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

    </div>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
}) {

  return (
    <div className="input-group">

      <label>{label}</label>

      <input
        type="text"
        name={name}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
      />

    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
}) {

  return (
    <div className="empty-state">

      <div className="empty-icon">
        {icon}
      </div>

      <h2>{title}</h2>

      <p>{description}</p>

    </div>
  );
}

function OverviewRow({
  label,
  value,
}) {

  return (
    <div className="overview-row">

      <span>{label}</span>

      <strong>{value}</strong>

    </div>
  );
}

function QuickAction({
  icon,
  title,
  description,
  onClick,
}) {

  return (
    <button
      className="quick-action"
      onClick={onClick}
    >

      <span className="quick-icon">
        {icon}
      </span>

      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      <span className="quick-arrow">
        →
      </span>

    </button>
  );
}

function StatusBadge({ status }) {

  const statusClass =
    status?.toLowerCase().replace(
      /\s/g,
      "-"
    );

  return (
    <span
      className={`status-badge ${statusClass}`}
    >
      {status}
    </span>
  );
}

function AnalyticsCard({
  title,
  value,
  icon,
  progress,
}) {

  return (
    <div className="analytics-card">

      <div className="analytics-card-top">

        <span className="analytics-icon">
          {icon}
        </span>

        <span>{title}</span>

      </div>

      <strong>{value}</strong>

      {progress !== undefined && (
        <div className="small-progress">
          <div
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      )}

    </div>
  );
}

/* =========================================================
   RENDER
   ========================================================= */

export default StudentApp;