// src/CreateAccountScreen.js
import React, { useState } from "react";
import logo from "./assets/logo.png";

const STORAGE_KEY = "seenUser";

export default function CreateAccountScreen({ onCreated, onGoToLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const name = username.trim();

    if (!name) {
      setError("Please enter a name/username.");
      return;
    }
    if (!password) {
      setError("Please choose a password.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    const record = {
      name,
      password,      // plain text, for now
      createdAt: Date.now(),
    };

    try {
      console.log("[Create] Writing user to localStorage:", record);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
      console.log("[Create] Stored value:", localStorage.getItem(STORAGE_KEY));
    } catch (err) {
      console.error("[Create] Could not write to localStorage:", err);
      setError("Could not save account in this browser.");
      return;
    }

    if (typeof onCreated === "function") onCreated();
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

        <h1
          style={{
            margin: "0 0 24px 0",
            fontSize: 28,
            fontWeight: 700,
            color: "#111827",
          }}
        >
          Create your SEEN account
        </h1>

        <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
          <input
            type="text"
            placeholder="Name or username"
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
            }}
          />

          <input
            type="password"
            placeholder="Choose a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
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

          <input
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
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
              background: "#009024",
              color: "#ffffff",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 0 0 1px rgba(148,163,184,0.6)",
            }}
          >
            Create account
          </button>
        </form>

        <button
          type="button"
          onClick={onGoToLogin}
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
          I already have an account
        </button>
      </div>
    </div>
  );
}
