// src/WelcomePageV2.js
import React from "react";

function WelcomePageV2() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f9fafb", // same as forms
        padding: "24px",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          padding: "32px 28px 24px 28px",
          boxSizing: "border-box",
        }}
      >
        {/* Logo + title */}
<div
  style={{
    display: "flex",
    alignItems: "center",
    marginBottom: "18px",
  }}
>
  <div
    style={{
      width: "44px",
      height: "44px",
      borderRadius: "8px",
      backgroundColor: "#2563eb",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginRight: "12px",
      flexShrink: 0,
      overflow: "hidden",
    }}
  >
    <img
      src={require("./assets/icon-rounded.png")}
      alt="SEEN logo"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
      }}
    />
  </div>

  <div>
    <div
      style={{
        fontSize: "22px",
        fontWeight: 700,
        color: "#111827",
      }}
    >
      SEEN
    </div>
    <div
  style={{
    fontSize: "13px",
    color: "#6b7280",
    fontVariant: "small-caps",
    letterSpacing: "0.4px",
  }}
>
  finally taken seriously
</div>

  </div>
</div>


        {/* Body copy */}
        <div style={{ marginBottom: "16px" }}>
          <div
            style={{
              fontSize: "18px",
              fontWeight: 600,
              color: "#111827",
              marginBottom: "8px",
            }}
          >
            Welcome
          </div>
          <p
            style={{
              fontSize: "14px",
              lineHeight: 1.6,
              color: "#374151",
              margin: 0,
            }}
          >
             You deserve doctors who listen. SEEN helps you walk into every appointment prepared, respected, and heard.

          </p>
        </div>

        {/* Key points, better line height and flush wrapping */}
         <ul
  style={{
    listStyle: "disc",
    paddingLeft: "18px",
    margin: "0 0 24px 0",
    fontSize: "13px",
    color: "#374151",
    lineHeight: 1.8,            // higher line height
  }}
>
  <li style={{ marginBottom: "6px", textIndent: "0" }}>
    <b>Tell your story once</b> Capture your symptoms, timeline, and what you’ve tried—in your own words.
  </li>
  <li style={{ marginBottom: "6px", textIndent: "0" }}>
    <b>Customize for each visit.</b> Add appointment-specific details in seconds.
  </li>
  <li style={{ marginBottom: "6px",textIndent: "0" }}>
    <b>Hand them what they need.</b> Give your doctor a clear, complete summary so they can focus on helping you.
  </li>
  <li style={{ textIndent: "0" }}>
    <b>This is where the magic happens.</b> Doctors thank you. They take you seriously. Your appointments finally feel like partnerships.
  </li>
</ul>


        {/* Create Account button, matching form style */}
        <div style={{ textAlign: "center" }}>
          <button
            type="button"
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "6px",
              border: "1px solid #2563eb",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
            onClick={() => {
              alert("Create Account pressed (wire to signup)");
            }}
          >
            Create Account
          </button>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "16px",
            fontSize: "11px",
            color: "#9ca3af",
            textAlign: "center",
          }}
        >
          Your information stays on this device. Nothing is sent to a server.
        </div>
      </div>
    </div>
  );
}

export default WelcomePageV2;
