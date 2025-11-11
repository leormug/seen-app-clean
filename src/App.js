// src/App.js
import React, { useState, useEffect } from "react";
import WelcomeScreen from "./WelcomeScreen";
import CardLayoutView from "./CardLayoutView";

/** ------------ LOGIN SCREEN ------------ */
function LoginScreen({ onLogin, onShowSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="app-shell">
      <main className="welcome-main">
        <div className="login-card">
          <div className="login-heading">Log in</div>
          <div className="login-subheading">Enter your details to continue.</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <label style={{ fontSize: 13, color: "#111" }}>
              <div style={{ fontWeight: 500, marginBottom: 4, fontSize: 13 }}>
                Email
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 6,
                  border: "1px solid #bbb",
                  fontSize: 14,
                }}
              />
            </label>

            <label style={{ fontSize: 13, color: "#111" }}>
              <div style={{ fontWeight: 500, marginBottom: 4, fontSize: 13 }}>
                Password
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 6,
                  border: "1px solid #bbb",
                  fontSize: 14,
                }}
              />
            </label>
          </div>

          <div className="welcome-actions" style={{ marginTop: 16 }}>
            <button
              type="button"
              className="btn primary-btn"
              onClick={() => {
                // real auth can go here later; for now just hand off
                onLogin();
              }}
            >
              Log in
            </button>
          </div>

          <div
            style={{
              textAlign: "center",
              fontSize: 13,
              color: "#2563eb",
              marginTop: 10,
              cursor: "pointer",
            }}
            onClick={onShowSignup}
          >
            Create new account
          </div>
        </div>
      </main>
    </div>
  );
}

/** ------------ SIGNUP SCREEN ------------ */
function SignupScreen({ onSignupComplete, onBackToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  return (
    <div className="app-shell">
      <main className="welcome-main">
        <div className="login-card">
          <div className="login-heading">Create account</div>
          <div className="login-subheading">Fill in details to register.</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <label style={{ fontSize: 13 }}>
              <div style={{ fontWeight: 500, marginBottom: 4 }}>Email</div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 6,
                  border: "1px solid #bbb",
                  fontSize: 14,
                }}
              />
            </label>

            <label style={{ fontSize: 13 }}>
              <div style={{ fontWeight: 500, marginBottom: 4 }}>Password</div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 6,
                  border: "1px solid #bbb",
                  fontSize: 14,
                }}
              />
            </label>

            <label style={{ fontSize: 13 }}>
              <div style={{ fontWeight: 500, marginBottom: 4 }}>
                Confirm password
              </div>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 6,
                  border: "1px solid #bbb",
                  fontSize: 14,
                }}
              />
            </label>
          </div>

          <div className="welcome-actions" style={{ marginTop: 16 }}>
            <button
              type="button"
              className="btn primary-btn"
              onClick={() => {
                // later: validate and call API; for now just treat as logged in
                onSignupComplete();
              }}
            >
              Sign up
            </button>
          </div>

          <div
            style={{
              textAlign: "center",
              fontSize: 13,
              color: "#2563eb",
              marginTop: 10,
              cursor: "pointer",
            }}
            onClick={onBackToLogin}
          >
            Back to log in
          </div>
        </div>
      </main>
    </div>
  );
}

/** ------------ MAIN APP ------------ */

function getInitialScreen() {
  // "welcome" | "login" | "main"
  if (typeof window === "undefined") return "welcome";
  try {
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome") === "yes";
    const isLoggedIn = !!localStorage.getItem("seenUser");
    if (!hasSeenWelcome) return "welcome";
    return isLoggedIn ? "main" : "login";
  } catch {
    return "welcome";
  }
}

function App() {
  const [screen, setScreen] = useState(getInitialScreen);
  const [currentPatientName, setCurrentPatientName] = useState("");

  // tab title
  useEffect(() => {
    const name = (currentPatientName || "").trim();
    document.title = name ? `SEEN: ${name}` : "SEEN";
  }, [currentPatientName]);

  // from welcome
  const handleWelcomeStart = () => {
    try {
      localStorage.setItem("hasSeenWelcome", "yes");
    } catch {}
    const loggedIn =
      typeof window !== "undefined" &&
      !!localStorage.getItem("seenUser");
    setScreen(loggedIn ? "main" : "login");
  };

  // login → main
  const handleLoginSuccess = () => {
    try {
      localStorage.setItem("seenUser", "active");
    } catch {}
    setScreen("main");
  };

  // signup → main
  const handleSignupComplete = () => {
    try {
      localStorage.setItem("seenUser", "active");
      localStorage.setItem("hasSeenWelcome", "yes");
    } catch {}
    setScreen("main");
  };

  // from app → login (not welcome)
  const handleLogout = () => {
    try {
      localStorage.removeItem("seenUser");
    } catch {}
    setCurrentPatientName("");
    setScreen("login");
  };

  // routing between screens
  if (screen === "welcome") {
    return <WelcomeScreen onStart={handleWelcomeStart} />;
  }

  if (screen === "login") {
    return (
      <LoginScreen
        onLogin={handleLoginSuccess}
        onShowSignup={() => setScreen("signup")}
      />
    );
  }

  if (screen === "signup") {
    return (
      <SignupScreen
        onSignupComplete={handleSignupComplete}
        onBackToLogin={() => setScreen("login")}
      />
    );
  }

  // main app
  return (
    <CardLayoutView
      onPatientNameChange={setCurrentPatientName}
      onLogout={handleLogout}
    />
  );
}

export default App;
