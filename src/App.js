// src/App.js
import React, { useState, useEffect } from "react";
import WelcomePageV2 from "./WelcomePageV2";
import CardLayoutView from "./CardLayoutView";

/* ------------ LOGIN SCREEN ------------ */
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="app-shell">
      <main className="welcome-main">
        <div className="login-card">
          <div className="login-heading">Log in</div>
          <div className="login-subheading">
            Enter your details to continue.
          </div>

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
          </div>

          {/* Log in button */}
          <div className="welcome-actions" style={{ marginTop: 16 }}>
            <button
              type="button"
              className="btn primary-btn"
              onClick={() => onLogin()}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "6px",
                border: "1px solid #2563eb",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                fontSize: "15px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Log in
            </button>
          </div>

          {/* Create account text at bottom */}
          {/* <div
            style={{
              textAlign: "center",
              fontSize: 13,
              color: "#2563eb",
              marginTop: 12,
            }}
          >
            Create account
          </div> */}
        </div>
      </main>
    </div>
  );
}



/* ------------ MAIN APP ------------ */
function getInitialScreen() {
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

  useEffect(() => {
    document.title = currentPatientName
      ? `SEEN: ${currentPatientName}`
      : "SEEN";
  }, [currentPatientName]);
  // Scroll to top when switching to lightweight screens
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (screen === "login" || screen === "welcome") {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [screen]);

  const handleWelcomeStart = () => {
    try {
      localStorage.setItem("hasSeenWelcome", "yes");
    } catch {}
    setScreen("login");
  };

  const handleLoginSuccess = () => {
    try {
      localStorage.setItem("seenUser", "active");
    } catch {}
    setScreen("main");
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("seenUser");
    } catch {}
    setCurrentPatientName("");
    setScreen("login");
  };

  if (screen === "welcome") {
    return <WelcomePageV2 onStart={handleWelcomeStart} />;
  }

  if (screen === "login") {
    return <LoginScreen onLogin={handleLoginSuccess} />;
  }

  return (
    <CardLayoutView
      onPatientNameChange={setCurrentPatientName}
      onLogout={handleLogout}
    />
  );
}

export default App;
