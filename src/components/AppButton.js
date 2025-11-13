// src/components/AppButton.js
import React, { useRef } from "react";
import "./AppButton.css";

function AppButton({
  variant = "primary",   // "primary" | "secondary" | "danger" | "ghost"
  size = "md",           // "sm" | "md" | "lg"
  fullWidth = false,
  className = "",
  children,
  ...rest
}) {
  const ref = useRef(null);

  const handlePointerDown = (e) => {
    const btn = ref.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ink = document.createElement("span");
    ink.className = "ripple-ink";
    ink.style.left = `${x}px`;
    ink.style.top = `${y}px`;
    btn.appendChild(ink);
    ink.addEventListener("animationend", () => ink.remove(), { once: true });
  };

  const classes = [
    "btn",
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth ? "btn-fullWidth" : "",
    className,
  ].filter(Boolean).join(" ");

  return (
    <button
      ref={ref}
      className={classes}
      onPointerDown={handlePointerDown}
      {...rest}
    >
      {children}
    </button>
  );
}

export default AppButton;
