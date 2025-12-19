import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./i18n";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// Suppress browser extension errors (harmless warnings from extensions like React DevTools, ad blockers, etc.)
const suppressExtensionErrors = () => {
  // Suppress console errors from browser extensions
  const originalError = console.error;
  console.error = (...args) => {
    const errorMessage = args[0]?.toString() || "";
    if (
      errorMessage.includes("runtime.lastError") ||
      errorMessage.includes("message port closed") ||
      errorMessage.includes("Extension context invalidated") ||
      errorMessage.includes(
        "The message port closed before a response was received"
      )
    ) {
      return; // Suppress browser extension errors
    }
    originalError.apply(console, args);
  };

  // Handle unhandled promise rejections from browser extensions
  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason?.message || event.reason?.toString() || "";
    if (
      reason.includes("message port closed") ||
      reason.includes("Extension context invalidated") ||
      reason.includes("runtime.lastError") ||
      reason.includes("The message port closed before a response was received")
    ) {
      event.preventDefault(); // Suppress browser extension errors
    }
  });

  // Suppress Chrome extension runtime errors
  // eslint-disable-next-line no-undef
  if (
    typeof chrome !== "undefined" &&
    chrome.runtime &&
    chrome.runtime.lastError
  ) {
    // Override chrome.runtime.lastError access to prevent errors
    // eslint-disable-next-line no-undef
    const originalLastError = chrome.runtime.lastError;
    // eslint-disable-next-line no-undef
    Object.defineProperty(chrome.runtime, "lastError", {
      get: function () {
        return originalLastError;
      },
      configurable: true,
    });
  }
};

// Initialize error suppression
suppressExtensionErrors();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
