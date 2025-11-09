// src/LoginGate.jsx
// Minimal version: login/signup + copyright only.

import React, { useEffect, useState } from "react";
import bcrypt from "bcryptjs";

const USERS_KEY = "auth_users_v1";
const SESSION_KEY = "auth_session_user";

function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function saveUsers(obj) {
  localStorage.setItem(USERS_KEY, JSON.stringify(obj));
}

export default function LoginGate({ children }) {
  const [users, setUsers] = useState({});
  const [sessionUser, setSessionUser] = useState("");
  const [loginUser, setLoginUser] = useState("");
  const [pw, setPw] = useState("");
  const [newUser, setNewUser] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [err, setErr] = useState("");
  const [mode, setMode] = useState("login");

useEffect(() => {
  setMode("login");
}, []);

useEffect(() => {
  const u = loadUsers();
  setUsers(u);
  const s = localStorage.getItem(SESSION_KEY);
  if (s && u[s]) setSessionUser(s);
}, []);

 /*  function logout() {
    localStorage.removeItem(SESSION_KEY);
    setSessionUser("");
  } */

  function onSignup(e) {
    e.preventDefault();
    const u = newUser.trim();
    if (!u) return setErr("Username required");
    if (users[u]) return setErr("Exists");
    if (newPw !== confirmPw) return setErr("Mismatch");
    const hash = bcrypt.hashSync(newPw, 10);
    const next = { ...users, [u]: { hash } };
    saveUsers(next);
    setUsers(next);
    localStorage.setItem(SESSION_KEY, u);
    setSessionUser(u);
    console.log("saved users", localStorage.getItem(USERS_KEY));
  }

  function onLogin(e) {
    e.preventDefault();
    const u = loginUser.trim();
    const rec = users[u];
    if (!rec) return setErr("User not found");
    if (bcrypt.compareSync(pw, rec.hash)) {
      localStorage.setItem(SESSION_KEY, u);
      setSessionUser(u);
    } else setErr("Wrong password");
  }

  if (!sessionUser) {
    const card = {
      width: 380,
      padding: 20,
      border: "1px solid #ddd",
      borderRadius: 16,
      background: "#fff",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    };
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div style={card}>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
           <img
  src={`${process.env.PUBLIC_URL}/logo.png`}
  alt="App Logo"
  style={{
    width: "120px",
    height: "120px",
    borderRadius: "10px",
    objectFit: "cover",
    marginBottom: "12px",
  }}
/>
          </div>

          {mode === "login" ? (
            <form onSubmit={onLogin}>
              <h1 style={{ textAlign: "center", fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif', }}>Sign in</h1>
              <input
                type="text"
                placeholder="Username"
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                style={{ width: "100%", marginBottom: 8, padding: 8 }}
              />
              <input
                type="password"
                placeholder="Password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                style={{ width: "100%", marginBottom: 8, padding: 8 }}
              />
              {err && <div style={{ color: "red" }}>{err}</div>}
              <button type="submit" style={{ width: "100%", padding: 10, background: "#111827", color: "#fff", borderRadius: 10 }}>
                Enter
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                style={{ border: "none", background: "none", color: "#555", marginTop: 8, textDecoration: "underline", cursor: "pointer" }}
              >
                Create account
              </button>
            </form>
          ) : (
            <form onSubmit={onSignup}>
              <h1 style={{ textAlign: "center" }}>Create account</h1>
              <input
                type="text"
                placeholder="Username"
                value={newUser}
                onChange={(e) => setNewUser(e.target.value)}
                style={{ width: "100%", marginBottom: 8, padding: 8 }}
              />
              <input
                type="password"
                placeholder="Create password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                style={{ width: "100%", marginBottom: 8, padding: 8 }}
              />
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                style={{ width: "100%", marginBottom: 8, padding: 8 }}
              />
              {err && <div style={{ color: "red" }}>{err}</div>}
              <button type="submit" style={{ width: "100%", padding: 10, background: "#111827", color: "#fff", borderRadius: 10 }}>
                Save account
              </button>
              <button
                type="button"
                onClick={() => setMode("login")}
                style={{ border: "none", background: "none", color: "#555", marginTop: 8, textDecoration: "underline", cursor: "pointer" }}
              >
                Back to sign in
              </button>
            </form>
          )}
        </div>

       {/*  <div
          style={{
            position: "absolute",
            bottom: 20,
            width: "100%",
            textAlign: "center",
            fontSize: 12,
            color: "#777",
          }}
        >
          © {new Date().getFullYear()} Leor Mugrabi. All rights reserved.
        </div> */}
      </div>
    );
  }

  // Logged-in children shown here
// Logged-in children shown here
return <>{children}</>;
}
