import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Comprehensive browser extension error suppression
const suppressExtensionError = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  const patterns = [
    'runtime.lasterror',
    'unchecked runtime.lasterror',
    'message port closed',
    'extension context invalidated',
    'message port closed before a response',
    'chrome-extension://',
    'moz-extension://',
    'safari-extension://',
    'extension://'
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
console.error = (...args: any[]) => {
  const fullMessage = args.map(arg => String(arg || '')).join(' ');
  if (suppressExtensionError(fullMessage)) {
    return; // Silently ignore
  }
  originalConsole.error.apply(console, args);
};

// Override console.warn (sometimes extensions use warn instead of error)
console.warn = (...args: any[]) => {
  const fullMessage = args.map(arg => String(arg || '')).join(' ');
  if (suppressExtensionError(fullMessage)) {
    return; // Silently ignore
  }
  originalConsole.warn.apply(console, args);
};

// Also intercept console.log for safety
const originalLog = console.log;
console.log = (...args: any[]) => {
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
  const errorTarget = (event.target as any)?.src || '';
  
  if (
    suppressExtensionError(errorMessage) ||
    suppressExtensionError(errorSource) ||
    suppressExtensionError(errorTarget) ||
    errorSource.includes('extension://') ||
    errorSource.includes('chrome-extension://') ||
    errorSource.includes('moz-extension://')
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
  const errorStack = String((event.reason as any)?.stack || '').toLowerCase();
  
  if (
    suppressExtensionError(errorMessage) ||
    suppressExtensionError(errorStack) ||
    errorStack.includes('extension://') ||
    errorStack.includes('chrome-extension://') ||
    errorStack.includes('moz-extension://')
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

