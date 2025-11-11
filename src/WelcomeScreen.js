// src/WelcomeScreen.js
import React from "react";
import logo from "./assets/logo.png"; // keep this path as you have it

function WelcomeScreen({ onStart }) {
  return (
    <div className="app-shell">
      {/* Logo + brand */}
      <div className="welcome-header">
        <img src={logo} alt="SEEN logo" className="welcome-logo" />
        <div className="welcome-title">SEEN</div>
        <div className="welcome-tagline">Empowering patient communication</div>
      </div>

      <main className="welcome-main">
        <div className="welcome-card">
          <div className="welcome-eyebrow">For patients and caregivers</div>
          <div className="welcome-heading">Welcome</div>
          <div className="welcome-subheading">
            Get your story clear before every visit in a few minutes.
          </div>

          {/* Two-column content area */}
          <div className="welcome-content">
            <section className="welcome-column">
              <h2 className="welcome-section-title">What SEEN helps you do</h2>
              <ul className="welcome-bullets">
                <li>Capture your ongoing medical story in one place</li>
                <li>Highlight what matters for today’s visit</li>
                <li>Arrive with a clear, one-page summary</li>
              </ul>
            </section>

            <section className="welcome-column">
              <div className="welcome-instructions">
                <div className="welcome-instructions-title">
                  How to fill the form
                </div>
                <ol className="welcome-steps">
                  <li>
                    Start with <strong>Permanent Info</strong>. This section
                    stays saved for all visits.
                  </li>
                  <li>
                    Open <strong>Visit Info</strong> to add today&apos;s
                    symptoms, reasons, and notes.
                  </li>
                  <li>
                    Use <strong>+ Add</strong> to include more Medications or
                    Doctors.
                  </li>
                  <li>
                    Press <strong>Save Visit</strong> to keep your data on this
                    device.
                  </li>
                  <li>
                    Click <strong>Print</strong> for a one-page summary to bring
                    to your appointment.
                  </li>
                </ol>
              </div>
            </section>
          </div>

          <div className="welcome-actions">
            <button
              type="button"
              className="btn primary-btn welcome-start-btn"
              onClick={onStart}
            >
              Start
            </button>
          </div>

          <div className="welcome-footer-note">
            Your information stays on this device only.
          </div>
        </div>
      </main>
    </div>
  );
}

export default WelcomeScreen;
