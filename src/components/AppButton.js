// src/components/AppButton.js
import React from "react";
import "./AppButton.css";

function AppButton({
  variant = "primary",   // "primary" | "secondary" | "danger" | "ghost"
  size = "md",           // "sm" | "md" | "lg"
  fullWidth = false,
  className = "",
  children,
  ...rest
}) {
  const classes = [
    "btn",
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth ? "btn-fullWidth" : "",
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}

export default AppButton;
