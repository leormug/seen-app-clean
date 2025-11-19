// src/App.js
import React, { useEffect, useRef, useState } from "react";
import IntroScreen from "./IntroScreen";
import SignupScreen from "./SignupScreen";
import LoginScreen from "./LoginScreen";
import CardLayoutView from "./CardLayoutView";
import AppButton from "./components/AppButton";

const SESSION_KEY = "auth_session_v1";
const USER_STORAGE_KEY = "auth_users_v1";

const SCREENS = {
  INTRO: "intro",
  SIGNUP: "signup",
  LOGIN: "login",
  APP: "app",
};

// REAL MODE: 28-minute inactivity, warn 30 seconds before
const INACTIVITY_LIMIT_MS = 28 * 60 * 1000; // 28 minutes
const WARNING_BEFORE_MS = 30 * 1000;        // 30 seconds

// ---------- account helpers ----------
function readUser() {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed)) {
      if (parsed.length > 0 && parsed[0] && typeof parsed[0] === "object") {
        return parsed[0];
      }
      return null;
    }

    if (parsed && typeof parsed === "object") {
      return parsed;
    }

    return null;
  } catch {
    return null;
  }
}

function writeUser(user) {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch {
    // ignore
  }
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [screen, setScreen] = useState(() => {
    const account = readUser();
    return account ? SCREENS.LOGIN : SCREENS.INTRO;
  });

  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [lockPassword, setLockPassword] = useState("");
  const [lockError, setLockError] = useState("");

  const lastActivityRef = useRef(Date.now());

  // ----- auth flow -----
  const handleAccountCreated = (user) => {
    if (user) {
      writeUser(user); // persist account
      setCurrentUser(user);
      setIsLocked(false);
      setShowTimeoutWarning(false);
      lastActivityRef.current = Date.now();
      try {
        localStorage.setItem(SESSION_KEY, "true");
      } catch {
        // ignore
      }
    }
    setScreen(SCREENS.APP);
  };

  const handleLoggedIn = (user) => {
    if (user) {
      writeUser(user); // keep stored account updated
      setCurrentUser(user);
      setIsLocked(false);
      setShowTimeoutWarning(false);
      lastActivityRef.current = Date.now();
      try {
        localStorage.setItem(SESSION_KEY, "true");
      } catch {
        // ignore
      }
    }
    setScreen(SCREENS.APP);
  };

  const handleLogout = () => {
    // End session only; account remains in localStorage
    setCurrentUser(null);
    setShowTimeoutWarning(false);
    setIsLocked(false);
    setLockPassword("");
    setLockError("");
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      // ignore
    }
    setScreen(SCREENS.LOGIN);
  };

  const staySignedIn = () => {
    lastActivityRef.current = Date.now();
    setShowTimeoutWarning(false);
  };

  const handleUnlockSubmit = (e) => {
    e?.preventDefault?.();
    setLockError("");

    const stored = readUser();
    if (!stored) {
      // No account? Send to full login
      handleLogout();
      return;
    }

    if (lockPassword === stored.password) {
      setIsLocked(false);
      setLockPassword("");
      lastActivityRef.current = Date.now();
    } else {
      setLockError("Incorrect password. Please try again.");
    }
  };

  const handleUnlockLogout = () => {
    handleLogout();
  };

  // ----- inactivity / timeout -----
  useEffect(() => {
    // Only track when on the form, logged in, and not locked
    if (screen !== SCREENS.APP || !currentUser || isLocked) return;

    lastActivityRef.current = Date.now();

    const handleActivity = () => {
      lastActivityRef.current = Date.now();
      if (showTimeoutWarning) {
        setShowTimeoutWarning(false);
      }
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);
    window.addEventListener("touchstart", handleActivity);

    const intervalId = setInterval(() => {
      const now = Date.now();
      const idleMs = now - lastActivityRef.current;

      if (idleMs >= INACTIVITY_LIMIT_MS) {
        // lock overlay
        setShowTimeoutWarning(false);
        setIsLocked(true);
        setLockPassword("");
        setLockError("");
        clearInterval(intervalId);
        return;
      }

      const warnThreshold = INACTIVITY_LIMIT_MS - WARNING_BEFORE_MS;
      if (idleMs >= warnThreshold) {
        setShowTimeoutWarning(true);
      }
    }, 1000);

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
      clearInterval(intervalId);
    };
  }, [screen, currentUser, isLocked, showTimeoutWarning]);

  // ----- warning modal (20 seconds before lock) -----
  const timeoutModal =
    showTimeoutWarning && screen === SCREENS.APP && currentUser && !isLocked ? (
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9000,
        }}
      >
        <div
          style={{
            background: "#ffffff",
            padding: "20px 22px",
            borderRadius: 10,
            maxWidth: 360,
            width: "90%",
            boxShadow: "0 10px 30px rgba(15,23,42,0.3)",
            fontFamily:
              "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              marginBottom: 10,
            }}
          >
            You’ll be logged out soon
          </div>
          <p
            style={{
              fontSize: 14,
              marginBottom: 16,
              color: "#374151",
              lineHeight: 1.5,
            }}
          >
            You&apos;ll be logged out in about 20 seconds due to inactivity.{" "}
            <strong>Click below to stay logged in.</strong>
          </p>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <AppButton type="button" variant="primary" onClick={staySignedIn}>
              Stay logged in
            </AppButton>
          </div>
        </div>
      </div>
    ) : null;

  // ----- lock overlay (after inactivity limit) -----
  const lockOverlay =
    isLocked && readUser() ? (
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(66, 106, 200, 0.96)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9500,
        }}
      >
        <form
          onSubmit={handleUnlockSubmit}
          style={{
            background: "#ffffff",
            padding: "22px 22px 18px",
            borderRadius: 12,
            maxWidth: 360,
            width: "90%",
            boxShadow: "0 14px 40px rgba(15,23,42,0.5)",
            fontFamily:
              "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            Session locked
          </div>
          <p
            style={{
              fontSize: 14,
              color: "#4b5563",
              lineHeight: 1.5,
              marginBottom: 12,
            }}
          >
            For your security, you&apos;ve been logged out after inactivity.
            Re-enter your password to continue.
          </p>

          <div style={{ marginBottom: 12, marginTop: 4 }}>
            <label
              htmlFor="lock-password"
              style={{
                display: "block",
                fontSize: 13,
                marginBottom: 4,
              }}
            >
              Password
            </label>
            <input
              id="lock-password"
              type="password"
              autoComplete="current-password"
              value={lockPassword}
              onChange={(e) => setLockPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 6,
                border: "1px solid #d1d5db",
                fontSize: 14,
              }}
            />
          </div>

          {lockError && (
            <div
              style={{
                fontSize: 12,
                color: "#b91c1c",
                marginBottom: 8,
              }}
            >
              {lockError}
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 6,
            }}
          >
            <button
              type="button"
              onClick={handleUnlockLogout}
              style={{
                border: "none",
                background: "transparent",
                color: "#6b7280",
                fontSize: 13,
                textDecoration: "underline",
                cursor: "pointer",
                padding: 0,
              }}
            >
              Log out instead
            </button>

            <AppButton type="submit" variant="primary">
              Unlock
            </AppButton>
          </div>
        </form>
      </div>
    ) : null;

  // ----- screen selection -----
  let content = null;
  switch (screen) {
    case SCREENS.INTRO:
      content = <IntroScreen onGetStarted={() => setScreen(SCREENS.SIGNUP)} />;
      break;
    case SCREENS.SIGNUP:
      content = <SignupScreen onSignedUp={handleAccountCreated} />;
      break;
    case SCREENS.LOGIN:
      content = (
        <LoginScreen
          onLoggedIn={handleLoggedIn}
          onGoToCreate={() => setScreen(SCREENS.SIGNUP)}
        />
      );
      break;
    case SCREENS.APP:
      content = (
        <CardLayoutView
          onLogout={handleLogout}
          // CardLayoutView handles patient/visit data itself via local state + localStorage
        />
      );
      break;
    default:
      content = (
        <LoginScreen
          onLoggedIn={handleLoggedIn}
          onGoToCreate={() => setScreen(SCREENS.SIGNUP)}
        />
      );
  }

  return (
    <>
      {content}
      {timeoutModal}
      {lockOverlay}
    </>
  );
}
