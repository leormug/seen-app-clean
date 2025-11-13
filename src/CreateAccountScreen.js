// src/CreateAccountScreen.js
import React, { useState } from "react";
import AppButton from "./components/AppButton"; // path is correct if this file is directly in src/

const USER_STORAGE_KEY = "auth_users_v1";

export default function CreateAccountScreen({ onCreated }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleCreate = (e) => {
  e?.preventDefault?.();
  try {
    // mark that the welcome has been passed
    localStorage.setItem("seen_started", "1");

    // mark that a user exists
    localStorage.setItem("seen_user_created", "1");

    // treat as logged in
    localStorage.setItem("seen_auth", "1");
  } catch {}

  // go straight to the main SEEN form
  window.location.reload();
};

// Go back to Login screen
const handleBackToLogin = (e) => {
  e?.preventDefault?.();
  try {
    // We’ve already started the app → don’t show Welcome again
    localStorage.setItem("seen_started", "1");
    // Make sure we are NOT treated as logged in
    localStorage.removeItem("seen_auth");
  } catch {}
  // Reload so App.js re-evaluates which screen to show
  window.location.reload();
};
const alreadyCreated = localStorage.getItem("seen_user_created") === "1";

  return (
    <div className="app-shell">
      <main className="welcome-main">
        <div className="login-card">
          <div className="login-heading">Create account</div>
          <div className="login-subheading">
            Save a simple local account on this device.
          </div>

          {error && (
            <div
              style={{
                marginTop: 4,
                marginBottom: 8,
                fontSize: 13,
                color: "#b91c1c",
              }}
            >
              {error}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <label style={{ fontSize: 13 }}>
              <div style={{ fontWeight: 500, marginBottom: 4 }}>Name</div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 6,
                  border: "1px solid #bbb",
                  fontSize: 14,
                }}
              />
            </label>

            <form onSubmit={handleSubmit}>
  <input
    type="password"
    autoComplete="current-password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />

  <button type="submit">Password</button>
</form>

           <form onSubmit={handleSubmit}>
  <input
    type="password"
    autoComplete="current-password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />

  <button type="submit">Confirm password</button>
</form>
          </div>

          <div className="welcome-actions" style={{ marginTop: 16 }}>
            {/* call handleCreate, not handleSave */}
            <AppButton variant="primary" onClick={handleCreate}>
              Create account
            </AppButton>
          </div>

          {alreadyCreated && (
  <div
    className="back-link"
    onClick={handleBackToLogin}
    style={{
      marginTop: "16px",
      fontSize: "14px",
      color: "#2563eb",
      cursor: "pointer",
      textDecoration: "underline"
    }}
  >
    Back to Login
  </div>
)}

        </div>
      </main>
    </div>
  );
}
