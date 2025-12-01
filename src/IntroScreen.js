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

        <h1 className="intro-title">Welcome</h1>

        <h2 className="intro-steps-title">Instructions for use</h2>
        <ul className="intro-steps">
          <span>Make your first appointment start with clarity by handing doctors the
              context they actually read and pay attention to.<br></br><br></br> </span>
          <li>
            <strong>Tell your story.</strong>
            <span>Fill in the guided form&mdash;this app walks you through what
              doctors need to know.
            </span>
          </li>
          <li>
            <strong>Print it out, hand it over.</strong>
            <span>Present your summary directly to the new doctor before the appointment begins. </span>
          </li>
        </ul>

        <AppButton onClick={onGetStarted} variant="primary">
          Get started
        </AppButton>
      </div>
    </div>
  );
}
