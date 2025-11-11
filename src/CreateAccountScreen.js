// src/CreateAccountScreen.js
import React, { useState } from "react";

const USER_STORAGE_KEY = "auth_users_v1";

export default function CreateAccountScreen({ onCreated }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleCreate = () => {
    if (!username.trim() || !password || !confirm) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    const user = {
      name: username.trim(),
      password,
      created: Date.now(),
    };

    try {
      // store a simple single-user array for now
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify([user]));
      console.log("Account saved to auth_users_v1:", user);
    } catch (e) {
      console.error("Failed to save account", e);
      setError("Could not save account. Check storage permissions.");
      return;
    }

    setError("");
    alert("Account created successfully. Returning to login.");
    if (typeof onCreated === "function") {
      onCreated();
    }
  };

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
              onClick={handleCreate}
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
              Create account
            </button>
          </div>

          <div style={{ textAlign: "center", marginTop: 12 }}>
            <span
              onClick={onCreated}
              style={{
                color: "#2563eb",
                fontSize: 13,
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              Back to login
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
