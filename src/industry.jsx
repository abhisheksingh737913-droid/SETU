import React, { useEffect, useMemo, useState } from "react";
import "./industry.css";

const STORAGE_KEY = "SetuIndustry";

const emptyState = {
  company: { name: "", industry: "", location: "", website: "", description: "" },
  jobs: [],
  applications: [],
  interviews: [],
  selections: [],
  notifications: [],
};

function loadIndustryData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState;
    const saved = JSON.parse(raw);
    return {
      ...emptyState,
      ...saved,
      company: { ...emptyState.company, ...(saved.company || {}) },
      jobs: Array.isArray(saved.jobs) ? saved.jobs : [],
      applications: Array.isArray(saved.applications) ? saved.applications : [],
      interviews: Array.isArray(saved.interviews) ? saved.interviews : [],
      selections: Array.isArray(saved.selections) ? saved.selections : [],
      notifications: Array.isArray(saved.notifications) ? saved.notifications : [],
    };
  } catch {
    return emptyState;
  }
}

function IndustryApp({ onLogout }) {
  const [activePage, setActivePage] = useState("Dashboard");
  const [data, setData] = useState(loadIndustryData);
  const [jobForm, setJobForm] = useState({
    title: "",
    type: "Internship",
    location: "",
    skills: "",
    description: "",
    package: "",
  });
  const [showJobForm, setShowJobForm] = useState(false);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const showMessage = (message) => {
    setNotification(message);
    window.clearTimeout(showMessage.timer);
    showMessage.timer = window.setTimeout(() => setNotification(""), 2500);
  };

  const setField = (key, value) => setData((prev) => ({ ...prev, [key]: value }));

  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, company: { ...prev.company, [name]: value } }));
  };

  const saveCompany = (e) => {
    e.preventDefault();
    if (!data.company.name.trim()) {
      showMessage("Enter company name first.");
      return;
    }
    showMessage("Company profile saved.");
  };

  const handleJobChange = (e) => {
    const { name, value } = e.target;
    setJobForm((prev) => ({ ...prev, [name]: value }));
  };

  const postJob = (e) => {
    e.preventDefault();
    if (!jobForm.title.trim() || !jobForm.skills.trim()) {
      showMessage("Job title and required skills are required.");
      return;
    }
    const job = {
      id: Date.now(),
      title: jobForm.title.trim(),
      type: jobForm.type,
      location: jobForm.location.trim(),
      skills: jobForm.skills.split(",").map((s) => s.trim()).filter(Boolean),
      description: jobForm.description.trim(),
      package: jobForm.package.trim(),
      createdAt: new Date().toLocaleDateString(),
    };
    setField("jobs", [job, ...data.jobs]);
    setJobForm({ title: "", type: "Internship", location: "", skills: "", description: "", package: "" });
    setShowJobForm(false);
    showMessage("Job posted successfully.");
  };

  const deleteJob = (id) => {
    setField("jobs", data.jobs.filter((job) => job.id !== id));
    showMessage("Job removed.");
  };

  const applications = useMemo(() => {
    const own = data.applications;
    try {
      const student = JSON.parse(localStorage.getItem("SetuStudent") || "null");
      const studentApps = Array.isArray(student?.applications) ? student.applications : [];
      const profile = student?.profile || {};
      const studentSkills = Array.isArray(student?.skills) ? student.skills : [];
      const derived = studentApps.map((app) => {
        const matchingJob = data.jobs.find((job) => String(job.id) === String(app.jobId));
        return {
          id: `student-${app.id}`,
          student: profile.name || "Student",
          email: profile.email || "",
          jobId: app.jobId,
          job: app.jobTitle || matchingJob?.title || "Job",
          company: matchingJob?.company || data.company.name || "Company",
          appliedDate: app.appliedDate || "",
          status: app.status || "Applied",
          skills: studentSkills.filter((s) => s.verified).map((s) => s.name),
        };
      });
      const map = new Map();
      [...derived, ...own].forEach((item) => map.set(String(item.id), item));
      return [...map.values()];
    } catch {
      return own;
    }
  }, [data.applications, data.jobs, data.company.name]);

  useEffect(() => {
    if (applications.length !== data.applications.length) {
      setData((prev) => ({ ...prev, applications }));
    }
  }, [applications, data.applications.length]);

  const updateApplicationStatus = (id, status, candidate = null, job = null) => {
    const current = data.applications.find((a) => String(a.id) === String(id));
    const target = current || (candidate && job ? {
      id,
      student: candidate.name,
      jobId: job.id,
      job: job.title,
      appliedDate: new Date().toLocaleDateString(),
      status: "Applied",
      skills: candidate.skills,
    } : null);
    if (!target) return;
    setField("applications", current
      ? data.applications.map((a) => String(a.id) === String(id) ? { ...a, status } : a)
      : [...data.applications, { ...target, status }]);
    try {
      const student = JSON.parse(localStorage.getItem("SetuStudent") || "null");
      if (student?.applications) {
        student.applications = student.applications.map((a) => String(`student-${a.id}`) === String(id) || String(a.id) === String(current?.id) ? { ...a, status } : a);
        localStorage.setItem("SetuStudent", JSON.stringify(student));
      }
    } catch {}
    showMessage(status === "Shortlisted" ? "Candidate shortlisted." : "Application updated.");
  };

  const scheduleInterview = (application) => {
    const interview = {
      id: Date.now(),
      applicationId: application.id,
      student: application.student,
      job: application.job,
      date: new Date().toLocaleDateString(),
      round: "Technical Round",
      status: "Scheduled",
    };
    setField("interviews", [interview, ...data.interviews]);
    updateApplicationStatus(application.id, "Interview Scheduled");
    showMessage("Interview scheduled.");
  };

  const selectCandidate = (application) => {
    const selection = {
      id: Date.now(),
      applicationId: application.id,
      student: application.student,
      role: application.job,
      package: "Offer to be decided",
      date: new Date().toLocaleDateString(),
    };
    setField("selections", [selection, ...data.selections]);
    updateApplicationStatus(application.id, "Selected");
    showMessage("Candidate selected.");
  };

  const student = (() => {
    try { return JSON.parse(localStorage.getItem("SetuStudent") || "null"); } catch { return null; }
  })();
  const verifiedStudents = student?.profile && Array.isArray(student?.skills)
    ? [{
        id: "current-student",
        name: student.profile.name || "Student",
        course: student.profile.course || "",
        branch: student.profile.branch || "",
        location: student.profile.location || "",
        skills: student.skills.filter((s) => s.verified).map((s) => s.name),
        allSkills: student.skills.map((s) => s.name),
      }]
    : [];

  const matches = data.jobs.flatMap((job) => verifiedStudents.map((candidate) => {
    const required = job.skills.map((s) => s.toLowerCase());
    const candidateSkills = candidate.skills.map((s) => s.toLowerCase());
    const matched = required.filter((s) => candidateSkills.includes(s));
    const missing = required.filter((s) => !candidateSkills.includes(s));
    const percent = required.length ? Math.round((matched.length / required.length) * 100) : 0;
    return { job, candidate, percent, matched, missing };
  }));

  const shortlisted = applications.filter((a) => a.status === "Shortlisted");
  const activeJobs = data.jobs.length;
  const hiringRate = applications.length ? Math.round((data.selections.length / applications.length) * 100) : 0;

  const logout = () => {
    if (onLogout) onLogout();
    else window.location.reload();
  };

  return (
    <div className="industry-layout step3-industry-page">
      <aside className="industry-sidebar">
        <div className="industry-logo">
          <div className="industry-logo-icon">SETU</div>
          <div><h2>Setu</h2><span>Industry Portal</span></div>
        </div>
        <nav className="industry-nav">
          {[
            ["Dashboard", "🏠"], ["Company Profile", "🏢"], ["Jobs & Internships", "💼"],
            ["Candidate Matching", "🎯"], ["Applications", "📋"], ["Shortlisted", "⭐"],
            ["Interviews", "🎤"], ["Selections", "🏆"], ["Skill Gap", "🧠"],
            ["College Talent", "🎓"], ["Market Insights", "📈"], ["Analytics", "📊"],
            ["Notifications", "🔔"], ["Settings", "⚙️"]
          ].map(([title, icon]) => (
            <button key={title} className={`industry-nav-item ${activePage === title ? "active" : ""}`} onClick={() => setActivePage(title)}>
              <span>{icon}</span><span>{title}</span>
            </button>
          ))}
        </nav>
        <button className="industry-logout" onClick={logout}>🚪 Logout</button>
      </aside>

      <main className="industry-main">
        <header className="industry-header">
          <div><h1>{activePage}</h1><p>Manage your company hiring and talent activities.</p></div>
          <div className="industry-header-right">
            <button className="header-notification" onClick={() => setActivePage("Notifications")}>🔔</button>
            <div className="industry-company-avatar">{data.company.name ? data.company.name.charAt(0).toUpperCase() : "C"}</div>
          </div>
        </header>
        {notification && <div className="industry-toast">{notification}</div>}
        <section className="industry-content">
          {activePage === "Dashboard" && <Dashboard jobs={data.jobs} applications={applications} shortlisted={shortlisted.length} interviews={data.interviews} selections={data.selections} company={data.company} setActivePage={setActivePage} />}
          {activePage === "Company Profile" && <CompanyProfile company={data.company} handleCompanyChange={handleCompanyChange} saveCompany={saveCompany} />}
          {activePage === "Jobs & Internships" && <JobsPage jobs={data.jobs} showJobForm={showJobForm} setShowJobForm={setShowJobForm} jobForm={jobForm} handleJobChange={handleJobChange} postJob={postJob} deleteJob={deleteJob} />}
          {activePage === "Candidate Matching" && <CandidateMatching matches={matches} applications={applications} onShortlist={updateApplicationStatus} onInterview={scheduleInterview} />}
          {activePage === "Applications" && <Applications applications={applications} onShortlist={updateApplicationStatus} onInterview={scheduleInterview} onSelect={selectCandidate} />}
          {activePage === "Shortlisted" && <SimpleApplications title="Shortlisted Candidates" subtitle="Students shortlisted for further rounds." items={shortlisted} emptyIcon="⭐" emptyTitle="No shortlisted candidates" emptyText="Shortlist candidates from Applications or Candidate Matching." />}
          {activePage === "Interviews" && <SimpleInterviews interviews={data.interviews} />}
          {activePage === "Selections" && <SimpleSelections selections={data.selections} />}
          {activePage === "Skill Gap" && <SkillGap matches={matches} />}
          {activePage === "College Talent" && <CollegeTalent candidates={verifiedStudents} />}
          {activePage === "Market Insights" && <MarketInsights jobs={data.jobs} />}
          {activePage === "Analytics" && <Analytics jobs={data.jobs} applications={applications} selections={data.selections} interviews={data.interviews} shortlisted={shortlisted.length} />}
          {activePage === "Notifications" && <Notifications notifications={data.notifications} />}
          {activePage === "Settings" && <Settings />}
        </section>
      </main>
    </div>
  );
}

function Dashboard({ jobs, applications, shortlisted, interviews, selections, company, setActivePage }) {
  return <div>
    <div className="welcome-box">
      <div><span className="welcome-label">INDUSTRY PORTAL</span><h2>Welcome{company.name ? `, ${company.name}` : ""} 👋</h2><p>Find the right talent and build your future team.</p></div>
      <button onClick={() => setActivePage("Jobs & Internships")}>+ Post New Job</button>
    </div>
    <div className="industry-stats">
      <StatCard icon="💼" title="Active Jobs" value={jobs.length} />
      <StatCard icon="📋" title="Applications" value={applications.length} />
      <StatCard icon="⭐" title="Shortlisted" value={shortlisted} />
      <StatCard icon="🎤" title="Interviews" value={interviews.length} />
      <StatCard icon="🏆" title="Selections" value={selections.length} />
    </div>
    <div className="industry-grid">
      <div className="industry-panel"><div className="panel-header"><h3>Recent Jobs</h3><button onClick={() => setActivePage("Jobs & Internships")}>View All</button></div>
        {jobs.length ? jobs.slice(0, 5).map((job) => <div className="job-mini-card" key={job.id}><div><h4>{job.title}</h4><p>{job.type} • {job.location || "Location not added"}</p></div><span>{job.skills.length} skills</span></div>) : <EmptyState icon="💼" title="No jobs posted" text="Post your first internship or job." />}
      </div>
      <div className="industry-panel"><div className="panel-header"><h3>Hiring Overview</h3></div>
        <div className="overview-item"><span>Applications</span><strong>{applications.length}</strong></div>
        <div className="overview-item"><span>Shortlisted</span><strong>{shortlisted}</strong></div>
        <div className="overview-item"><span>Interviews</span><strong>{interviews.length}</strong></div>
        <div className="overview-item"><span>Selections</span><strong>{selections.length}</strong></div>
      </div>
    </div>
  </div>;
}

function StatCard({ icon, title, value }) { return <div className="industry-stat-card"><div className="stat-icon">{icon}</div><div><span>{title}</span><h3>{value}</h3></div></div>; }

function CompanyProfile({ company, handleCompanyChange, saveCompany }) { return <div className="industry-panel large-panel"><div className="page-title"><h2>Company Profile</h2><p>Add your company information.</p></div><form className="industry-form" onSubmit={saveCompany}>
  <div className="form-row"><Field label="Company Name" name="name" value={company.name} onChange={handleCompanyChange} placeholder="Enter company name" /><Field label="Industry" name="industry" value={company.industry} onChange={handleCompanyChange} placeholder="e.g. IT, Finance, Healthcare" /></div>
  <div className="form-row"><Field label="Location" name="location" value={company.location} onChange={handleCompanyChange} placeholder="Enter location" /><Field label="Website" name="website" value={company.website} onChange={handleCompanyChange} placeholder="Company website" /></div>
  <div className="form-group"><label>Company Description</label><textarea name="description" value={company.description} onChange={handleCompanyChange} rows="5" placeholder="Describe your company..." /></div>
  <button className="primary-button">Save Company Profile</button>
</form></div>; }

function JobsPage({ jobs, showJobForm, setShowJobForm, jobForm, handleJobChange, postJob, deleteJob }) { return <div>
  <div className="page-heading-row"><div><h2>Jobs & Internships</h2><p>Create and manage your hiring opportunities.</p></div><button className="primary-button" onClick={() => setShowJobForm(!showJobForm)}>+ Post Job</button></div>
  {showJobForm && <form className="industry-panel industry-form job-form" onSubmit={postJob}><h3>Post New Job / Internship</h3><div className="form-row"><Field label="Job Title" name="title" value={jobForm.title} onChange={handleJobChange} placeholder="e.g. Java Developer Intern" /><div className="form-group"><label>Type</label><select name="type" value={jobForm.type} onChange={handleJobChange}><option>Internship</option><option>Full Time</option><option>Part Time</option></select></div></div><div className="form-row"><Field label="Location" name="location" value={jobForm.location} onChange={handleJobChange} placeholder="e.g. Gurgaon / Remote" /><Field label="Package / Stipend" name="package" value={jobForm.package} onChange={handleJobChange} placeholder="e.g. ₹25,000/month" /></div><div className="form-group"><label>Required Skills</label><input name="skills" value={jobForm.skills} onChange={handleJobChange} placeholder="Java, React, SQL, Git" /><small>Separate skills using commas.</small></div><div className="form-group"><label>Job Description</label><textarea name="description" value={jobForm.description} onChange={handleJobChange} rows="5" placeholder="Describe requirements and responsibilities..." /></div><div className="form-actions"><button type="button" className="secondary-button" onClick={() => setShowJobForm(false)}>Cancel</button><button className="primary-button">Publish Job</button></div></form>}
  <div className="job-list">{jobs.length ? jobs.map((job) => <div className="industry-job-card" key={job.id}><div className="job-card-top"><div><span className="job-type">{job.type}</span><h3>{job.title}</h3><p>📍 {job.location || "Location not specified"}</p></div><button className="delete-button" onClick={() => deleteJob(job.id)}>Delete</button></div><div className="skill-list">{job.skills.map((s) => <span key={s}>{s}</span>)}</div>{job.package && <p className="job-package">💰 {job.package}</p>}{job.description && <p className="job-description">{job.description}</p>}</div>) : <div className="industry-panel"><EmptyState icon="💼" title="No jobs or internships" text="Your posted opportunities will appear here." /></div>}</div>
</div>; }

function CandidateMatching({ matches, applications, onShortlist, onInterview }) { return <div><div className="page-heading"><h2>AI Candidate Matching</h2><p>Match verified student skills with your job requirements.</p></div><div className="industry-panel"><div className="ai-banner">🤖<div><h3>AI Matching Engine</h3><p>Frontend prototype: match percentage is calculated from verified student skills.</p></div></div>{matches.length ? <div className="matching-list">{matches.sort((a,b) => b.percent-a.percent).map((m) => { const existing = applications.find((a) => String(a.jobId) === String(m.job.id) && a.student === m.candidate.name); return <div className="matching-job" key={`${m.job.id}-${m.candidate.id}`}><div><h3>{m.candidate.name} — {m.job.title}</h3><p>{m.percent}% skill match</p><div className="skill-list">{m.candidate.skills.map((s) => <span key={s}>{s}</span>)}</div>{m.missing.length > 0 && <small>Missing: {m.missing.join(", ")}</small>}</div><div className="match-actions"><strong>{m.percent}%</strong>{existing ? <span className="status-badge">{existing.status}</span> : <button className="primary-button small" onClick={() => { onShortlist(existing?.id || `match-${m.job.id}-${m.candidate.id}`, "Shortlisted", m.candidate, m.job); }}>Shortlist</button>}{existing && existing.status === "Shortlisted" && <button className="outline-button" onClick={() => onInterview(existing)}>Interview</button>}</div></div>; })}</div> : <EmptyState icon="🎯" title="No candidates available" text="Add a verified student skill profile and post a matching job." />}</div></div>; }

function Applications({ applications, onShortlist, onInterview, onSelect }) { return <div><div className="page-heading"><h2>Applications</h2><p>Manage applications received from students.</p></div><div className="industry-panel">{applications.length ? applications.map((app) => <div className="application-card" key={app.id}><div><h3>{app.student}</h3><p>{app.job}</p><small>{app.appliedDate}</small></div><div className="application-actions"><span className="status-badge">{app.status || "Applied"}</span>{app.status === "Applied" && <button className="outline-button" onClick={() => onShortlist(app.id, "Shortlisted")}>Shortlist</button>}{app.status === "Shortlisted" && <button className="outline-button" onClick={() => onInterview(app)}>Interview</button>}{app.status === "Interview Scheduled" && <button className="primary-button small" onClick={() => onSelect(app)}>Select</button>}</div></div>) : <EmptyState icon="📋" title="No applications yet" text="Applications will appear here when students apply." />}</div></div>; }

function SimpleApplications({ title, subtitle, items, emptyIcon, emptyTitle, emptyText }) { return <div><div className="page-heading"><h2>{title}</h2><p>{subtitle}</p></div><div className="industry-panel">{items.length ? items.map((x) => <div className="application-card" key={x.id}><div><h3>{x.student}</h3><p>{x.job}</p></div><span className="status-badge">{x.status}</span></div>) : <EmptyState icon={emptyIcon} title={emptyTitle} text={emptyText} />}</div></div>; }

function SimpleInterviews({ interviews }) { return <div><div className="page-heading"><h2>Interviews</h2><p>Manage candidate interviews.</p></div><div className="industry-panel">{interviews.length ? interviews.map((i) => <div className="interview-card" key={i.id}><div><h3>{i.student}</h3><p>{i.job}</p></div><div><strong>{i.date}</strong><p>{i.round} • {i.status}</p></div></div>) : <EmptyState icon="🎤" title="No interviews scheduled" text="Shortlist a candidate and schedule an interview." />}</div></div>; }

function SimpleSelections({ selections }) { return <div><div className="page-heading"><h2>Selections</h2><p>View selected candidates and offers.</p></div><div className="industry-panel">{selections.length ? selections.map((s) => <div className="selection-card" key={s.id}><div><h3>{s.student}</h3><p>{s.role}</p></div><strong>{s.package}</strong></div>) : <EmptyState icon="🏆" title="No selections yet" text="Select a candidate after the interview stage." />}</div></div>; }

function SkillGap({ matches }) { const gaps = matches.filter((m) => m.missing.length); return <div><div className="page-heading"><h2>Skill Gap Analysis</h2><p>See which required skills are missing from verified student profiles.</p></div><div className="industry-panel">{gaps.length ? gaps.map((g) => <div className="matching-job" key={`${g.job.id}-${g.candidate.id}`}><div><h3>{g.job.title} — {g.candidate.name}</h3><p>Missing: {g.missing.join(", ")}</p></div><strong>{g.percent}% match</strong></div>) : <EmptyState icon="🧠" title="No skill gaps found" text="Post a job and compare it with verified student skills." />}</div></div>; }

function CollegeTalent({ candidates }) { return <div><div className="page-heading"><h2>College Talent</h2><p>Discover students from connected colleges.</p></div><div className="industry-panel">{candidates.length ? candidates.map((c) => <div className="application-card" key={c.id}><div><h3>{c.name}</h3><p>{c.course} {c.branch && `• ${c.branch}`}</p></div><div className="skill-list">{c.skills.map((s) => <span key={s}>{s}</span>)}</div></div>) : <EmptyState icon="🎓" title="No student data available" text="Verified student data will appear when it is available in this browser." />}</div></div>; }

function MarketInsights({ jobs }) { const counts = {}; jobs.flatMap((j) => j.skills).forEach((s) => { counts[s] = (counts[s] || 0) + 1; }); const top = Object.entries(counts).sort((a,b) => b[1]-a[1]).slice(0,8); return <div><div className="page-heading"><h2>Market Insights</h2><p>Basic insights from your own posted job requirements.</p></div><div className="industry-grid"><div className="industry-panel"><h3>Top Required Skills</h3>{top.length ? top.map(([skill,count]) => <div className="overview-item" key={skill}><span>{skill}</span><strong>{count}</strong></div>) : <EmptyState icon="📈" title="No market data" text="Post jobs with required skills to generate insights." />}</div><div className="industry-panel"><h3>Hiring Snapshot</h3><div className="overview-item"><span>Active Jobs</span><strong>{jobs.length}</strong></div><div className="overview-item"><span>Unique Skills</span><strong>{Object.keys(counts).length}</strong></div></div></div></div>; }

function Analytics({ jobs, applications, selections, interviews, shortlisted }) { const hiringRate = applications.length ? Math.round((selections.length / applications.length)*100) : 0; return <div><div className="page-heading"><h2>Hiring Analytics</h2><p>Overview of your hiring activity.</p></div><div className="industry-stats"><StatCard icon="💼" title="Jobs" value={jobs.length} /><StatCard icon="📋" title="Applications" value={applications.length} /><StatCard icon="⭐" title="Shortlisted" value={shortlisted} /><StatCard icon="🎤" title="Interviews" value={interviews.length} /><StatCard icon="🏆" title="Selections" value={selections.length} /><StatCard icon="📈" title="Hiring Rate" value={`${hiringRate}%`} /></div><div className="industry-panel"><div className="overview-item"><span>Applications → Shortlist</span><strong>{applications.length ? `${Math.round((shortlisted/applications.length)*100)}%` : "0%"}</strong></div><div className="overview-item"><span>Applications → Selection</span><strong>{hiringRate}%</strong></div></div></div>; }

function Notifications({ notifications }) { return <div><div className="page-heading"><h2>Notifications</h2><p>Hiring and platform notifications.</p></div><div className="industry-panel">{notifications.length ? notifications.map((n) => <div className="application-card" key={n.id}><div><h3>{n.title}</h3><p>{n.message}</p></div></div>) : <EmptyState icon="🔔" title="No notifications" text="New application, interview and platform updates will appear here." />}</div></div>; }

function Settings() { return <div><div className="page-heading"><h2>Settings</h2><p>Manage your Setu account.</p></div><div className="industry-panel settings-list"><div className="setting-item"><div><h3>Account</h3><p>Company data is stored locally in this frontend prototype.</p></div></div><div className="setting-item"><div><h3>Data & Privacy</h3><p>Student information is used only for local demo matching.</p></div></div></div></div>; }

function Field({ label, name, value, onChange, placeholder }) { return <div className="form-group"><label>{label}</label><input name={name} value={value || ""} onChange={onChange} placeholder={placeholder} /></div>; }
function EmptyState({ icon, title, text }) { return <div className="empty-state"><div className="empty-icon">{icon}</div><h3>{title}</h3><p>{text}</p></div>; }

export default IndustryApp;
