// src/SignupScreen.js
import React, { useState } from "react";
import AppButton from "./components/AppButton";
import seenLogo from "./assets/seen-logo.png";

const USER_STORAGE_KEY = "auth_users_v1";

function persistUser(user) {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch {
    // ignore write failures
  }
}

export default function SignupScreen({ onSignedUp }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const trimmed = username.trim();
    if (!trimmed || !password || !confirmPassword) {
      setError("Please complete all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const user = { name: trimmed, password };
    persistUser(user);

    if (onSignedUp) {
      onSignedUp(user);
    }

    setUsername("");
    setPassword("");
    setConfirmPassword("");
  }

  return (
    <div
      className="signup-screen"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        boxSizing: "border-box",
        background: "#f5f6f8",
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: 24,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          src={seenLogo}
          alt="SEEN logo"
          style={{
            width: 84,
            height: 84,
            objectFit: "contain",
            marginBottom: 12,
          }}
        />
        <h1 style={{ fontSize: 26, margin: 0 }}>Create your account</h1>
      </div>

      {error && (
        <div
          style={{
            marginBottom: 12,
            padding: 10,
            borderRadius: 6,
            background: "#fef2f2",
            color: "#991b1b",
            fontSize: 14,
            maxWidth: 360,
            width: "100%",
          }}
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: 360,
          background: "#fff",
          borderRadius: 12,
          padding: 20,
          boxShadow: "0 12px 30px rgba(15, 23, 42, 0.12)",
          border: "1px solid #e5e7eb",
        }}
      >
        <label style={{ display: "block", marginBottom: 14, fontSize: 14 }}>
          <div style={{ marginBottom: 4, fontWeight: 500 }}>Username</div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="off"
            style={{
              width: "100%",
              padding: 8,
              fontSize: 14,
              borderRadius: 6,
              border: "1px solid #d1d5db",
              boxSizing: "border-box",
            }}
          />
        </label>

        <label style={{ display: "block", marginBottom: 16, fontSize: 14 }}>
          <div style={{ marginBottom: 4, fontWeight: 500 }}>Password</div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            style={{
              width: "100%",
              padding: 8,
              fontSize: 14,
              borderRadius: 6,
              border: "1px solid #d1d5db",
              boxSizing: "border-box",
            }}
          />
        </label>

        <label style={{ display: "block", marginBottom: 16, fontSize: 14 }}>
          <div style={{ marginBottom: 4, fontWeight: 500 }}>
            Confirm password
          </div>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            style={{
              width: "100%",
              padding: 8,
              fontSize: 14,
              borderRadius: 6,
              border: "1px solid #d1d5db",
              boxSizing: "border-box",
            }}
          />
        </label>

        <AppButton type="submit" variant="primary" style={{ width: "100%" }}>
          Sign up
        </AppButton>

        <div
          style={{
            fontSize: 12,
            color: "#6b7280",
            marginTop: 12,
            textAlign: "center",
          }}
        >
          Your account data stays on this computer. Nothing is uploaded.
        </div>
      </form>
    </div>
  );
}
