import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Enhanced error handling for Chrome extension runtime errors
const originalError = console.error;
const originalWarn = console.warn;

// Type guard for Chrome extension API
const hasChromeRuntime = (): boolean => {
  try {
    return typeof window !== 'undefined' && 
           typeof (window as any).chrome !== 'undefined' && 
           (window as any).chrome.runtime !== undefined;
  } catch {
    return false;
  }
};

// Log Chrome extension runtime.lastError if present
if (hasChromeRuntime()) {
  const chrome = (window as any).chrome;
  if (chrome.runtime && chrome.runtime.lastError) {
    const lastError = chrome.runtime.lastError;
    if (lastError.message) {
      originalWarn('Chrome extension runtime.lastError:', lastError.message);
    }
  }
}

// Suppress browser extension errors that don't affect the application
console.error = (...args: any[]) => {
  const errorMessage = args[0]?.toString() || '';
  // Log runtime.lastError before suppressing
  if (hasChromeRuntime()) {
    const chrome = (window as any).chrome;
    if (chrome.runtime && chrome.runtime.lastError) {
      const lastError = chrome.runtime.lastError;
      if (lastError.message) {
        originalWarn('Chrome extension runtime.lastError:', lastError.message);
      }
    }
  }
  // Suppress the specific browser extension errors
  if (
    errorMessage.includes('runtime.lastError') ||
    errorMessage.includes('message port closed') ||
    errorMessage.includes('Extension context invalidated') ||
    errorMessage.includes('Unchecked runtime.lastError')
  ) {
    return;
  }
  originalError.apply(console, args);
};

// Handle unhandled errors from browser extensions with logging
window.addEventListener('error', (event) => {
  const errorMessage = event.message || '';
  // Log Chrome extension errors before suppressing
  if (hasChromeRuntime()) {
    const chrome = (window as any).chrome;
    if (chrome.runtime && chrome.runtime.lastError) {
      const lastError = chrome.runtime.lastError;
      if (lastError.message) {
        originalWarn('Chrome extension runtime.lastError:', lastError.message);
      }
    }
  }
  if (
    errorMessage.includes('runtime.lastError') ||
    errorMessage.includes('message port closed') ||
    errorMessage.includes('Extension context invalidated') ||
    errorMessage.includes('Unchecked runtime.lastError')
  ) {
    event.preventDefault();
    return false;
  }
}, true);

// Ensure DOM is ready before rendering
function initApp() {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('Root element not found. Waiting for DOM...');
    // Retry after a short delay if root is not found
    setTimeout(initApp, 100);
    return;
  }

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  // DOM is already ready
  initApp();
}

