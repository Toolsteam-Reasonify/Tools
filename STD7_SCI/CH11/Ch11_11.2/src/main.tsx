import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Comprehensive browser extension error suppression
const suppressExtensionError = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  const patterns = [
    'runtime.lasterror',
    'runtime.lastError',
    'runtime.last_error',
    'unchecked runtime.lasterror',
    'unchecked runtime.lastError',
    'unchecked runtime.lasterror',
    'message port closed',
    'message port closed before a response',
    'message port closed before a response was received',
    'extension context invalidated',
    'chrome.runtime.lastError',
    'chrome.runtime.lasterror',
    'chrome-extension://',
    'moz-extension://',
    'safari-extension://',
    'extension://',
    'lastError',
    'lasterror',
    'the message port closed',
    'port closed before'
  ];
  return patterns.some(pattern => lowerMessage.includes(pattern));
};

// Intercept all console methods
const originalConsole = {
  error: console.error,
  warn: console.warn,
  log: console.log,
  info: console.info,
  debug: console.debug
};

// Override console.error
console.error = (...args: unknown[]) => {
  const fullMessage = args.map(arg => String(arg || '')).join(' ');
  if (suppressExtensionError(fullMessage)) {
    return; // Silently ignore
  }
  originalConsole.error.apply(console, args);
};

// Override console.warn (sometimes extensions use warn instead of error)
console.warn = (...args: unknown[]) => {
  const fullMessage = args.map(arg => String(arg || '')).join(' ');
  if (suppressExtensionError(fullMessage)) {
    return; // Silently ignore
  }
  originalConsole.warn.apply(console, args);
};

// Also intercept console.log for safety
const originalLog = console.log;
console.log = (...args: unknown[]) => {
  const fullMessage = args.map(arg => String(arg || '')).join(' ');
  if (suppressExtensionError(fullMessage)) {
    return; // Silently ignore
  }
  originalLog.apply(console, args);
};

// Handle unhandled errors from browser extensions (with capture phase)
window.addEventListener('error', (event) => {
  const errorMessage = (event.message || '').toLowerCase();
  const errorSource = (event.filename || '').toLowerCase();
  const errorTarget = ((event.target as { src?: string })?.src || '').toLowerCase();
  const errorStack = (event.error?.stack || '').toLowerCase();
  
  if (
    suppressExtensionError(errorMessage) ||
    suppressExtensionError(errorSource) ||
    suppressExtensionError(errorTarget) ||
    suppressExtensionError(errorStack) ||
    errorSource.includes('extension://') ||
    errorSource.includes('chrome-extension://') ||
    errorSource.includes('moz-extension://') ||
    errorSource.includes('safari-extension://')
  ) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    return false;
  }
}, true); // Use capture phase to catch early

// Catch unhandled promise rejections from extensions
window.addEventListener('unhandledrejection', (event) => {
  const errorMessage = String(event.reason || '').toLowerCase();
  const reason = event.reason as { stack?: string; message?: string } | undefined;
  const errorStack = String(reason?.stack || '').toLowerCase();
  const reasonMessage = String(reason?.message || '').toLowerCase();
  
  if (
    suppressExtensionError(errorMessage) ||
    suppressExtensionError(errorStack) ||
    suppressExtensionError(reasonMessage) ||
    errorStack.includes('extension://') ||
    errorStack.includes('chrome-extension://') ||
    errorStack.includes('moz-extension://') ||
    errorStack.includes('safari-extension://')
  ) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    return false;
  }
});


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

