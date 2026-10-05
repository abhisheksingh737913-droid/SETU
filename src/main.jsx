import React, { useState } from "react";
import { createRoot } from "react-dom/client";

import StudentApp from "./student";
import CollegeApp from "./college";
import IndustryApp from "./industry";

import "./main.css";

function MainApp() {
  const [role, setRole] = useState(null);
  const [auth, setAuth] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  // Dashboard open
  if (auth && role === "student") {
    return <StudentApp />;
  }

  if (auth && role === "college") {
    return <CollegeApp onLogout={() => setAuth(false)} />;
  }

  if (auth && role === "industry") {
    return <IndustryApp />;
  }

  // Login/Register screen
  if (role) {
    return (
      <AuthScreen
        role={role}
        isRegister={isRegister}
        setIsRegister={setIsRegister}
        onBack={() => {
          setRole(null);
          setIsRegister(false);
        }}
        onSuccess={() => setAuth(true)}
      />
    );
  }

  // Main landing page
  return (
    <div className="landing-page">

      {/* Background effects */}
      <div className="bg-orb orb-one"></div>
      <div className="bg-orb orb-two"></div>
      <div className="bg-orb orb-three"></div>

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="brand">
         <div className="brand-logo">
            <span></span>
         </div> 
          <div className="brand-name">
             SETU
          </div>
        </div>

        <div className="nav-links">
          <a className="active">Home</a>
          <a>About</a>
          <a>Features</a>
          <a>Contact</a>
        </div>

        <button
          className="nav-login"
          onClick={() => {
            setRole("student");
            setIsRegister(false);
          }}
        >
          Sign In
        </button>
      </nav>

      {/* HERO */}
      <section className="hero">

        {/* LEFT */}
        <div className="hero-left">

          <div className="mini-heading">
            Learn <span>•</span> Connect <span>•</span> Grow
          </div>

          <div className="ai-pill">
            ✦ AI-POWERED CAREER ECOSYSTEM
          </div>

          <h1>
            Your Career.
            <br />
            <span>Our Connection.</span>
          </h1>

          <p className="hero-description">
            Bridging the gap between talented students,
            forward-thinking colleges and innovative industries.
          </p>

          {/* STATS */}
          <div className="stats">

            <div className="stat">
              <strong>0</strong>
              <small>Partner Colleges</small>
            </div>

            <div className="stat">
              <strong>0</strong>
              <small>Hiring Companies</small>
            </div>

            <div className="stat">
              <strong>0</strong>
              <small>Students Placed</small>
            </div>

          </div>

        </div>

        {/* RIGHT ILLUSTRATION */}
        <div className="hero-visual">

          <div className="city-glow"></div>

          {/* Connection circles */}
          <div className="connection connection-one"></div>
          <div className="connection connection-two"></div>

          {/* Floating icons */}
          <div className="floating-icon icon-student">🎓</div>
          <div className="floating-icon icon-college">🏫</div>
          <div className="floating-icon icon-industry">💼</div>

          {/* People */}
          <div className="people">

            <div className="person student-person">
              <div className="head">👨🏻</div>
              <div className="body blue-body">💻</div>
            </div>

            <div className="person college-person">
              <div className="head">👩🏻</div>
              <div className="body purple-body">📱</div>
            </div>

            <div className="person industry-person">
              <div className="head">👨🏻‍💼</div>
              <div className="body cyan-body">💻</div>
            </div>

          </div>

          <div className="visual-text">
            CONNECTING
            <span>THE FUTURE</span>
          </div>

        </div>

      </section>

      {/* WAVY DIVIDER */}
      <div className="wave-divider"></div>

      {/* ROLE SECTION */}
      <section className="path-section">

        <div className="path-heading">
          <div>
            <h2>Choose Your Path</h2>
            <p>Select the option that best describes you.</p>
          </div>

          <div className="path-badge">
            3 Stakeholders
          </div>
        </div>

        <div className="role-grid">

          {/* STUDENT */}
          <button
            className="role-card student-card"
            onClick={() => {
              setRole("student");
              setIsRegister(true);
            }}
          >
            <div className="role-icon">🎓</div>

            <div className="role-content">
              <h3>I'm a Student</h3>
              <p>
                Find internships, jobs & build your future.
              </p>
            </div>

            <div className="role-arrow">→</div>

            <div className="card-glow"></div>
          </button>

          {/* COLLEGE */}
          <button
            className="role-card college-card"
            onClick={() => {
              setRole("college");
              setIsRegister(true);
            }}
          >
            <div className="role-icon">🏫</div>

            <div className="role-content">
              <h3>I represent a College</h3>
              <p>
                Manage placements & connect with companies.
              </p>
            </div>

            <div className="role-arrow">→</div>

            <div className="card-glow"></div>
          </button>

          {/* INDUSTRY */}
          <button
            className="role-card industry-card"
            onClick={() => {
              setRole("industry");
              setIsRegister(false);
            }}
          >
            <div className="role-icon">💼</div>

            <div className="role-content">
              <h3>I represent an Industry</h3>
              <p>
                Hire talent, post opportunities and grow your team.
              </p>
            </div>

            <div className="role-arrow">→</div>

            <div className="card-glow"></div>
          </button>

        </div>

      </section>

      {/* WHY SECTION */}
      <section className="why-section">

        <h2>Why Choose <span>Setu?</span></h2>

        <div className="feature-grid">

          <Feature
            icon="✓"
            title="Verified Skills"
            text="Ensure genuine and capable student profiles."
          />

          <Feature
            icon="✦"
            title="Smart Matching"
            text="AI-powered matching between skills and jobs."
          />

          <Feature
            icon="⌁"
            title="Direct Connect"
            text="Connect students, colleges and industries."
          />

          <Feature
            icon="↗"
            title="Career Growth"
            text="Build your career with better opportunities."
          />

          <Feature
            icon="🏫"
            title="Trusted Network"
            text="Connect with colleges and companies."
          />

          <Feature
            icon="◷"
            title="24/7 Support"
            text="Your career journey never stops."
          />

        </div>

      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-brand">
          <div className="brand-logo small">
            <span>I</span>
            <span>C</span>
          </div>

          <strong>
            Industry<span>Connect</span>
          </strong>
        </div>

        <p>
          Learn &nbsp;•&nbsp; Connect &nbsp;•&nbsp; Grow
        </p>

        <p className="copyright">
          © 2023 Setu. All rights reserved.
        </p>
      </footer>

    </div>
  );
}


/* ================= AUTH SCREEN ================= */

function AuthScreen({
  role,
  isRegister,
  setIsRegister,
  onBack,
  onSuccess
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const roleData = {
    student: {
      title: "Student Login",
      subtitle: "Find your dream opportunities",
      icon: "🎓",
      color: "student-auth"
    },

    college: {
      title: "College Login",
      subtitle: "Manage placements with ease",
      icon: "🏫",
      color: "college-auth"
    },

    industry: {
      title: "Industry Login",
      subtitle: "Hire the right talent",
      icon: "💼",
      color: "industry-auth"
    }
  };

  const data = roleData[role];

  const change = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const submit = (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      alert("Please enter email and password.");
      return;
    }

    if (isRegister) {
      if (!form.name) {
        alert("Please enter your name.");
        return;
      }

      if (form.password !== form.confirmPassword) {
        alert("Passwords do not match.");
        return;
      }
    }

    onSuccess();
  };

  return (
    <div className={`auth-page ${data.color}`}>

      <div className="auth-background"></div>

      <button className="auth-back" onClick={onBack}>
        ← Back
      </button>

      <div className="auth-wrapper">

        {/* LEFT */}
        <div className="auth-brand-side">

          <div className="big-logo">
            <span>SETU</span>
            
          </div>

          {/* <h1>
            Industry<span>Connect</span>
          </h1> */}

          <p>Learn&nbsp; • &nbsp;Connect&nbsp; • &nbsp;Grow</p>

          <div className="auth-illustration">
            {data.icon}
          </div>

          <h3>
            Great Opportunities
            <br />
            Build Great Futures
          </h3>

        </div>

        {/* RIGHT */}
        <div className="auth-form-side">

          <div className="auth-role-icon">
            {data.icon}
          </div>

          <h2>
            {isRegister ? "Create Your Account" : "Welcome Back"}
          </h2>

          <p className="auth-subtitle">
            {isRegister
              ? "Get started and be a part of Setu."
              : `Sign in to continue to your ${role} dashboard.`}
          </p>

          <form onSubmit={submit}>

            {isRegister && (
              <div className="input-box">
                <span>👤</span>

                <input
                  name="name"
                  placeholder={
                    role === "college"
                      ? "College Name"
                      : role === "industry"
                      ? "Company Name"
                      : "Full Name"
                  }
                  value={form.name}
                  onChange={change}
                />
              </div>
            )}

            <div className="input-box">
              <span>✉</span>

              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={form.email}
                onChange={change}
              />
            </div>

            <div className="input-box">
              <span>🔒</span>

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={change}
              />
            </div>

            {isRegister && (
              <div className="input-box">
                <span>🔐</span>

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={form.confirmPassword}
                  onChange={change}
                />
              </div>
            )}

            {!isRegister && (
              <div className="remember-row">
                <label>
                  <input type="checkbox" />
                  Remember me
                </label>

                <button
                  type="button"
                  className="forgot"
                  onClick={() =>
                    alert("Password reset feature can be connected later.")
                  }
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button className="login-button" type="submit">
              {isRegister ? "Sign Up" : "Login"}
              <span>→</span>
            </button>

          </form>

          {role !== "industry" && (
            <div className="switch-text">
              {isRegister
                ? "Already have an account?"
                : "Don't have an account?"}

              <button
                onClick={() => setIsRegister(!isRegister)}
              >
                {isRegister ? "Login" : "Sign Up"}
              </button>
            </div>
          )}

          {role === "industry" && (
            <div className="industry-message">
              Industry accounts are created after
              college approval/invitation.
            </div>
          )}

        </div>

      </div>
    </div>
  );
}


/* FEATURE COMPONENT */

function Feature({ icon, title, text }) {
  return (
    <div className="feature-card">

      <div className="feature-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{text}</p>

    </div>
  );
}


createRoot(
  document.getElementById("root")
).render(
  <MainApp />
);