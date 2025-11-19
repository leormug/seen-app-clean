// src/IntroScreen.js
import React from "react";
import AppButton from "./components/AppButton";
import seenLogo from "./assets/seen-logo.png";
import "./index.css";

export default function IntroScreen({ onGetStarted }) {
  return (
    <div className="intro-root">
      <div className="intro-card">
        <img src={seenLogo} alt="SEEN logo" className="intro-logo" />

        <h1 className="intro-title">Welcome to SEEN</h1>
        <p className="intro-copy">
          SEEN helps you walk into appointments with a one-page summary doctors
          actually read.
        </p>

        <AppButton onClick={onGetStarted} variant="primary">
          Get started
        </AppButton>
      </div>
    </div>
  );
}
