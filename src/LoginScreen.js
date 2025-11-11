// src/LoginScreen.js
import React, { useState } from "react";
import logo from "./assets/logo.png";

const STORAGE_KEY = "seenUser";

function loadUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    console.log("[Login] raw from localStorage:", raw);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    console.log("[Login] parsed user:", parsed);
    return parsed;
  } catch (err) {
    console.error("[Login] error reading user from localStorage:", err);
    return null;
  }
}

export default function LoginScreen({ onLoggedIn, onGoToCreate }) {
  const saved = loadUser();
  const [username, setUsername] = useState(saved?.name || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    console.log("[Login] handleSubmit, saved =", saved);

    if (!saved) {
      setError("No account found on this device. Please create one.");
      return;
    }

    if (password !== saved.password) {
      setError("Incorrect password.");
      return;
    }

    if (typeof onLoggedIn === "function") onLoggedIn();
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          background: "#ffffff",
          borderRadius: 24,
          boxShadow: "0 24px 60px rgba(15,23,42,0.18)",
          padding: "32px 40px 32px",
          boxSizing: "border-box",
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: 20 }}>
          <img
            src={logo}
            alt="SEEN logo"
            style={{
              width: 112,
              height: 112,
              objectFit: "contain",
              borderRadius: 24,
            }}
          />
        </div>

        {/* Title */}
        <h1
          style={{
            margin: "0 0 24px 0",
            fontSize: 32,
            fontWeight: 700,
            color: "#111827",
          }}
        >
          Sign in
        </h1>

        <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            style={{
              width: "100%",
              padding: "10px 12px",
              fontSize: 14,
              borderRadius: 4,
              border: "1px solid #d1d5db",
              marginBottom: 8,
              boxSizing: "border-box",
              backgroundColor: "#ffffff",
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            style={{
              width: "100%",
              padding: "10px 12px",
              fontSize: 14,
              borderRadius: 4,
              border: "1px solid #d1d5db",
              marginBottom: 8,
              boxSizing: "border-box",
            }}
          />

          {error && (
            <div
              style={{
                marginTop: 4,
                marginBottom: 8,
                fontSize: 13,
                color: "#dc2626",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              marginTop: 4,
              padding: "12px 16px",
              borderRadius: 999,
              border: "none",
              background: "#020617",
              color: "#ffffff",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 0 0 1px rgba(148,163,184,0.6)",
            }}
          >
            Sign in
          </button>
        </form>

        <button
          type="button"
          onClick={onGoToCreate}
          style={{
            marginTop: 16,
            padding: 0,
            border: "none",
            background: "transparent",
            fontSize: 13,
            color: "#111827",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          Create a new account
        </button>
      </div>
    </div>
  );
}
