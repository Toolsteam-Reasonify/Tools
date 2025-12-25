import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Comprehensive browser extension error suppression
const suppressExtensionError = (message: string): boolean => {
  if (!message) return false;
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
    'port closed before',
    'a listener indicated an asynchronous response',
    'message port closed before a response was received'
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
  try {
    const fullMessage = args.map(arg => String(arg || '')).join(' ');
    if (suppressExtensionError(fullMessage)) {
      return; // Silently ignore
    }
    originalConsole.error.apply(console, args);
  } catch (e) {
    // Fallback if error occurs during suppression
    originalConsole.error.apply(console, args);
  }
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
  try {
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
  } catch (e) {
    // Ignore errors in error handler
  }
}, true); // Use capture phase to catch early

// Catch unhandled promise rejections from extensions
window.addEventListener('unhandledrejection', (event) => {
  try {
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
  } catch (e) {
    // Ignore errors in error handler
  }
});

// Suppress Chrome runtime errors directly - comprehensive wrapping
// This runs immediately when the module loads
(function suppressChromeErrors() {
  try {
    if (typeof chrome !== 'undefined' && chrome && chrome.runtime) {
      // First, try to completely override lastError
      try {
        const descriptor = Object.getOwnPropertyDescriptor(chrome.runtime, 'lastError');
        if (!descriptor || descriptor.configurable !== false) {
          Object.defineProperty(chrome.runtime, 'lastError', {
            get: function() { return undefined; },
            set: function() {},
            configurable: true,
            enumerable: false
          });
        }
      } catch (e) {
        // If we can't override, wrap methods instead
      }

      // Wrap all chrome.runtime methods to suppress lastError
      const wrapChromeMethod = (obj: any, methodName: string) => {
        if (obj && obj[methodName] && typeof obj[methodName] === 'function') {
          const original = obj[methodName];
          obj[methodName] = function(...args: any[]) {
            try {
              const result = original.apply(this, args);
              // Suppress any lastError that might occur
              if (chrome.runtime && (chrome.runtime as any).lastError) {
                return;
              }
              return result;
            } catch (e: any) {
              // Suppress all errors from extensions
              return;
            }
          };
        }
      };

      // Wrap common chrome.runtime methods
      wrapChromeMethod(chrome.runtime, 'sendMessage');
      wrapChromeMethod(chrome.runtime, 'connect');
      wrapChromeMethod(chrome.runtime, 'sendNativeMessage');
    }
  } catch (e) {
    // Silently ignore
  }
})();

// Also suppress browser API errors (Firefox)
if (typeof browser !== 'undefined' && browser.runtime) {
  try {
    const wrapBrowserMethod = (obj: any, methodName: string) => {
      if (obj && obj[methodName] && typeof obj[methodName] === 'function') {
        const original = obj[methodName];
        obj[methodName] = function(...args: any[]) {
          try {
            return original.apply(this, args);
          } catch (e: any) {
            return;
          }
        };
      }
    };
    wrapBrowserMethod(browser.runtime, 'sendMessage');
    wrapBrowserMethod(browser.runtime, 'connect');
  } catch (e) {
    // Ignore
  }
}


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

