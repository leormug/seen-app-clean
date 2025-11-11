// src/App.js
import React, { useState, useEffect } from "react";
import WelcomePageV2 from "./WelcomePageV2";
import LoginScreen from "./LoginScreen";
import CardLayoutView from "./CardLayoutView";
import CreateAccountScreen from "./CreateAccountScreen";



/* ------------ MAIN APP ------------ */
function getInitialScreen() {
  if (typeof window === "undefined") return "welcome";
  try {
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome") === "yes";
    const isLoggedIn = !!localStorage.getItem("seenUser");
    if (!hasSeenWelcome) return "welcome";
    return isLoggedIn ? "main" : "login";
  } catch {
    return "welcome";
  }
}

function App() {
  const [screen, setScreen] = useState(getInitialScreen);
  const [currentPatientName, setCurrentPatientName] = useState("");

  useEffect(() => {
    document.title = currentPatientName
      ? `SEEN: ${currentPatientName}`
      : "SEEN";
  }, [currentPatientName]);
  // Scroll to top when switching to lightweight screens
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (screen === "login" || screen === "welcome") {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [screen]);

  const handleWelcomeStart = () => {
    try {
      localStorage.setItem("hasSeenWelcome", "yes");
    } catch {}
    setScreen("login");
  };

  const handleLoginSuccess = () => {
  // seenUser already contains the saved account JSON
  setScreen("main");
};


  const handleLogout = () => {
    try {
      localStorage.removeItem("seenUser");
    } catch {}
    setCurrentPatientName("");
    setScreen("login");
  };

  if (screen === "welcome") {
    return <WelcomePageV2 onStart={handleWelcomeStart} />;
  }

  if (screen === "login") {
  return (
    <LoginScreen
      onLoggedIn={handleLoginSuccess}
      onGoToCreate={() => setScreen("create")}
    />
  );
}

if (screen === "create") {
  return <CreateAccountScreen onCreated={() => setScreen("login")} />;
}


if (screen === "create") {
  return <CreateAccountScreen onCreated={() => setScreen("login")} />;
}


  return (
    <CardLayoutView
      onPatientNameChange={setCurrentPatientName}
      onLogout={handleLogout}
    />
  );
}

export default App;
