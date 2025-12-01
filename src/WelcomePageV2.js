// src/WelcomePageV2.js
import React, { useState } from "react";
import AppButton from "./components/AppButton";
import seenLogo from "./assets/seen-logo.png";

export default function WelcomePageV2({ onCreateAccount }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();

    if (!trimmedName || !password || !password2) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== password2) {
      setError("Passwords do not match.");
      return;
    }

    const user = {
      name: trimmedName,
      password,
    };

    if (onCreateAccount) onCreateAccount(user);

    setName("");
    setPassword("");
    setPassword2("");
  }

  return (
    <div
      className="welcome-screen"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: 24,
        boxSizing: "border-box",
      }}
    >
      {/* Logo + Title */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 24,
          marginTop: 20,
        }}
      >
        <img
          src={seenLogo}
          alt="SEEN logo"
          style={{
            width: 100,
            height: 100,
            objectFit: "contain",
            marginBottom: 8,
          }}
        />

        <h1 style={{ fontSize: 30, margin: 0 }}>SEEN</h1>

        <div
          style={{
            fontSize: 14,
            color: "#7a7a7aff",
            fontWeight: 500,
            fontVariant: "small-caps",   
            marginTop: 4,
            marginBottom: 20,
          }}
        >
          Be heard. Be believed.
        </div>

        <h2 style={{ fontSize: 22, margin: "20px 0 10px" }}>Welcome</h2>

        <div
          style={{
            fontSize: 16,
            color: "#444",
            maxWidth: 600,
            lineHeight: 1.5,
            margin: "0 auto 20px",
            textAlign: "left",
          }}
        >
          <p style={{ marginTop: 0 }}>
            Create a one-page health summary to give your new doctor on your
            first appointment.
          </p>

          <p style={{ fontWeight: 600, marginBottom: 6 }}>How it works:</p>

          <ul style={{ paddingLeft: 20, marginTop: 0 }}>
            <li style={{ marginBottom: 10 }}>
              <strong>Write your story once.</strong> The top paragraph is
              crucial—it tells your doctor your timeline clearly and linearly.
              Follow the sample text provided.
            </li>
            <li style={{ marginBottom: 10 }}>
              <strong>Add key details.</strong> Symptoms, treatments tried,
              what helps and what doesn’t.
            </li>
            <li style={{ marginBottom: 10 }}>
              <strong>Print and hand to your doctor.</strong> Watch how
              differently they treat you when they have what they need.
            </li>
          </ul>
        </div>
      </div>

      {/* Create Account Form */}
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: 16,
          background: "#fff",
          width: "100%",
          maxWidth: 340,
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        }}
      >
        <h3 style={{ fontSize: 18, margin: "0 0 12px" }}>Create Account</h3>

        {error && (
          <div
            style={{
              marginBottom: 12,
              padding: 8,
              borderRadius: 4,
              background: "#f8d7da",
              color: "#721c24",
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <label style={{ display: "block", marginBottom: 10, fontSize: 14 }}>
            <div style={{ marginBottom: 4, fontWeight: 500 }}>Username</div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="off"
              style={{
                width: "100%",
                padding: 6,
                fontSize: 13,
                boxSizing: "border-box",
              }}
            />
          </label>

          {/* Password */}
          <label style={{ display: "block", marginBottom: 10, fontSize: 14 }}>
            <div style={{ marginBottom: 4, fontWeight: 500 }}>Password</div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              style={{
                width: "100%",
                padding: 6,
                fontSize: 13,
                boxSizing: "border-box",
              }}
            />
          </label>

          {/* Confirm Password */}
          <label style={{ display: "block", marginBottom: 16, fontSize: 14 }}>
            <div style={{ marginBottom: 4, fontWeight: 500 }}>
              Confirm Password
            </div>
            <input
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              autoComplete="new-password"
              style={{
                width: "100%",
                padding: 6,
                fontSize: 13,
                boxSizing: "border-box",
              }}
            />
          </label>

          <AppButton type="submit" variant="primary" style={{ width: "100%" }}>
            Create Account
          </AppButton>
        </form>

        <div
          style={{
            marginTop: 12,
            fontSize: 12,
            color: "#666",
            textAlign: "center",
          }}
        >
          Your information stays private on your device. Nothing is sent to a
          server.
        </div>
      </div>
    </div>
  );
}
