// src/LoginScreen.js
import React, { useState, useEffect } from "react";
import AppButton from "./components/AppButton";
import seenLogo from "./assets/seen-logo.png";

const USER_STORAGE_KEY = "auth_users_v1";

function readUser() {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed[0];
    }
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

  // Always start blank
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [timeoutMessage, setTimeoutMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("timeout") === "1") {
      setTimeoutMessage(
        "Session timed out for your security. Please log back in."
      );
    } else {
      setTimeoutMessage("");
    }
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!existing) {
      setError("No account found. Please create an account first.");
      return;
    }

    if (username.trim() !== existing.name || password !== existing.password) {
      setError("Incorrect username or password.");
      return;
    }

    // Mark session as active
    localStorage.setItem(
      "auth_session",
      JSON.stringify({
        startedAt: Date.now(),
        userName: existing.name,
      })
    );

    if (onLoggedIn) {
      onLoggedIn(existing);
    }
  }

  return (
    <div
      className="login-screen"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        boxSizing: "border-box",
      }}
    >
      {/* Logo + title */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <img
          src={seenLogo}
          alt="SEEN logo"
          style={{
            width: 80,
            height: 80,
            objectFit: "contain",
            marginBottom: 8,
          }}
        />
        <h1 style={{ fontSize: 24, margin: 0 }}>SEEN</h1>
        <div
          style={{
            fontSize: 14,
            color: "#555",
            fontVariant: "small-caps",
            letterSpacing: "0.06em",
            marginTop: 4,
          }}
        >
          Be heard. Be believed.
        </div>
      </div>

      {/* Messages */}
      {timeoutMessage && (
        <div
          style={{
            marginBottom: 12,
            padding: 8,
            borderRadius: 4,
            background: "#fff3cd",
            color: "#856404",
            fontSize: 14,
            maxWidth: 360,
          }}
        >
          {timeoutMessage}
        </div>
      )}

      {error && (
        <div
          style={{
            marginBottom: 12,
            padding: 8,
            borderRadius: 4,
            background: "#f8d7da",
            color: "#721c24",
            fontSize: 14,
            maxWidth: 360,
          }}
        >
          {error}
        </div>
      )}

      {/* Single form */}
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        style={{ maxWidth: 360, width: "100%", margin: "0 auto" }}
      >
        {/* Username */}
        <label style={{ display: "block", marginBottom: 12, fontSize: 14 }}>
          <div style={{ marginBottom: 4, fontWeight: 500 }}>Username</div>
          <input
            type="text"
            name="seen-username"
            autoComplete="off"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: "100%",
              padding: 8,
              fontSize: 14,
              boxSizing: "border-box",
            }}
          />
        </label>

        {/* Password */}
        <label style={{ display: "block", marginBottom: 16, fontSize: 14 }}>
          <div style={{ marginBottom: 4, fontWeight: 500 }}>Password</div>
          <input
            type="password"
            name="seen-password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: 8,
              fontSize: 14,
              boxSizing: "border-box",
            }}
          />
        </label>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          <AppButton type="submit" variant="primary" style={{ flex: 1 }}>
            Log in
          </AppButton>
          
        </div>
      </form>
    </div>
  );
}
