// src/LoginScreen.js
import React, { useState } from "react";

const USER_STORAGE_KEY = "auth_users_v1";

function readUser() {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);

    // If it’s an array (e.g. [{name, password}, ...]), take the first user
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed[0];
    }

    // If it’s already an object with name/password, use it directly
    if (parsed && typeof parsed === "object") {
      return parsed;
    }

    return null;
  } catch {
    return null;
  }
}

export default function LoginScreen({ onLoggedIn, onGoToCreate }) {
  const existing = readUser();

  const [username, setUsername] = useState(existing?.name || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const saved = readUser();

    if (!saved) {
      setError("No account saved yet. Please create one.");
      return;
    }

    if (
      username.trim() !== (saved.name || "").trim() ||
      password !== saved.password
    ) {
      setError("Incorrect name or password.");
      return;
    }

    setError("");
    if (typeof onLoggedIn === "function") onLoggedIn();
  };

  const hasSaved = !!existing;


  return (
    <div className="app-shell">
      <main className="welcome-main">
        <div className="login-card">
          <div className="login-heading">Log in</div>
          <div className="login-subheading">
            Enter your details to continue.
          </div>

          {/* Gray info only if there is truly no saved user */}
          {!hasSaved && (
            <div
              style={{
                marginTop: 8,
                marginBottom: 8,
                fontSize: 13,
                color: "#374151",
              }}
            >
              No account found on this device. Please create one.
            </div>
          )}

          {/* Red error text */}
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
          </div>

          <div className="welcome-actions" style={{ marginTop: 16 }}>
            <button
              type="button"
              className="btn primary-btn"
              onClick={handleLogin}
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

          <div style={{ textAlign: "center", marginTop: 12 }}>
            <span
              onClick={onGoToCreate}
              style={{
                color: "#2563eb",
                fontSize: 13,
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              Create new account
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
