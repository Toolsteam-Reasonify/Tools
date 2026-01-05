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

// Check if error is from browser extension (should be suppressed)
const isExtensionError = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  return (
    lowerMessage.includes('runtime.lasterror') ||
    lowerMessage.includes('message port closed') ||
    lowerMessage.includes('extension context invalidated') ||
    lowerMessage.includes('unchecked runtime.lasterror') ||
    lowerMessage.includes('receiving end does not exist') ||
    lowerMessage.includes('could not establish connection')
  );
};

// Suppress browser extension errors that don't affect the application
console.error = (...args: any[]) => {
  const errorMessage = args[0]?.toString() || '';
  
  // Check if this is a browser extension error
  if (isExtensionError(errorMessage)) {
    // Silently suppress - these are harmless browser extension errors
    return;
  }
  
  // Check for runtime.lastError in Chrome extensions
  if (hasChromeRuntime()) {
    try {
      const chrome = (window as any).chrome;
      if (chrome.runtime && chrome.runtime.lastError) {
        const lastError = chrome.runtime.lastError;
        // Suppress if it's a known extension error
        if (lastError.message && isExtensionError(lastError.message)) {
          return;
        }
      }
    } catch {
      // Ignore errors when checking chrome.runtime
    }
  }
  
  originalError.apply(console, args);
};

// Suppress console.warn for extension errors
console.warn = (...args: any[]) => {
  const warnMessage = args[0]?.toString() || '';
  
  if (isExtensionError(warnMessage)) {
    return;
  }
  
  originalWarn.apply(console, args);
};

// Handle unhandled errors from browser extensions
window.addEventListener('error', (event) => {
  const errorMessage = event.message || event.error?.message || '';
  
  if (isExtensionError(errorMessage)) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }
}, true);

// Handle unhandled promise rejections (where extension errors often appear)
window.addEventListener('unhandledrejection', (event) => {
  const errorMessage = event.reason?.message || event.reason?.toString() || '';
  
  if (isExtensionError(errorMessage)) {
    event.preventDefault();
    return false;
  }
});

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

