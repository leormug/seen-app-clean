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

        <h2 className="intro-steps-title">Instructions for use</h2>
        <ul className="intro-steps">
          <li>
            <strong>Create a one-page medical summary.</strong>
            <span>
              Make every appointment start with clarity by handing doctors the
              context they actually read.
            </span>
          </li>
          <li>
            <strong>Tell your story once.</strong>
            <span>
              Fill in the guided form&mdash;this app walks you through what
              doctors need to know.
            </span>
          </li>
          <li>
            <strong>Print and hand it over.</strong>
            <span>Present your summary before the appointment begins.</span>
          </li>
        </ul>

        <AppButton onClick={onGetStarted} variant="primary">
          Get started
        </AppButton>
      </div>
    </div>
  );
}
