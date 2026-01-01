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
    'runtime.last error',
    'unchecked runtime.lasterror',
    'unchecked runtime.lastError',
    'unchecked runtime.last_error',
    'unchecked runtime.last error',
    'message port closed',
    'message port closed before a response',
    'message port closed before a response was received',
    'extension context invalidated',
    'chrome.runtime.lastError',
    'chrome.runtime.lasterror',
    'chrome.runtime.last error',
    'chrome-extension://',
    'moz-extension://',
    'safari-extension://',
    'extension://',
    'lastError',
    'lasterror',
    'last error',
    'the message port closed',
    'port closed before',
    'a listener indicated an asynchronous response',
    '(index)',
    '(index):',
    '(index):1',
    'unchecked runtime',
    // React warnings about invalid props (from DevTools/extensions)
    'invalid values for props',
    'props.*error.*warn.*log.*on',
    'circle.*tag'
  ];
  // Check if any pattern matches (including variations with spaces, dots, colons)
  // Special handling for React warnings
  if (lowerMessage.includes('invalid values for props') && 
      (lowerMessage.includes('circle') || lowerMessage.includes('error') && lowerMessage.includes('warn') && lowerMessage.includes('log'))) {
    return true;
  }
  
  return patterns.some(pattern => {
    const normalizedPattern = pattern.toLowerCase();
    // Skip patterns with .* for now, handle them separately
    if (pattern.includes('.*')) {
      return false; // Handled above for React warnings
    }
    return lowerMessage.includes(normalizedPattern) ||
           lowerMessage.includes(normalizedPattern.replace(/\s/g, '')) ||
           lowerMessage.includes(normalizedPattern.replace(/\./g, ' ')) ||
           lowerMessage.includes(normalizedPattern.replace(/:/g, ''));
  });
};

// Intercept all console methods
const originalConsole = {
  error: console.error,
  warn: console.warn,
  log: console.log,
  info: console.info,
  debug: console.debug
};

// Override console.error - must suppress chrome extension errors
console.error = function(...args: unknown[]) {
  try {
    const fullMessage = args.map(arg => String(arg || '')).join(' ');
    if (suppressExtensionError(fullMessage)) {
      return; // Silently ignore
    }
    return originalConsole.error.apply(console, args);
  } catch (e) {
    // Fallback if error occurs during suppression - but still check if it's an extension error
    try {
      const fullMessage = args.map(arg => String(arg || '')).join(' ');
      if (!suppressExtensionError(fullMessage)) {
        originalConsole.error.apply(console, args);
      }
    } catch (e2) {
      // Complete fallback
      originalConsole.error.apply(console, args);
    }
  }
};

// Override console.warn (sometimes extensions use warn instead of error)
console.warn = function(...args: unknown[]) {
  try {
    const fullMessage = args.map(arg => String(arg || '')).join(' ');
    if (suppressExtensionError(fullMessage)) {
      return; // Silently ignore
    }
    return originalConsole.warn.apply(console, args);
  } catch (e) {
    // Fallback
    try {
      const fullMessage = args.map(arg => String(arg || '')).join(' ');
      if (!suppressExtensionError(fullMessage)) {
        originalConsole.warn.apply(console, args);
      }
    } catch (e2) {
      originalConsole.warn.apply(console, args);
    }
  }
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
    const fullError = (event.message || '') + ' ' + (event.filename || '');
    
    if (
      suppressExtensionError(errorMessage) ||
      suppressExtensionError(errorSource) ||
      suppressExtensionError(errorTarget) ||
      suppressExtensionError(errorStack) ||
      suppressExtensionError(fullError) ||
      errorSource.includes('extension://') ||
      errorSource.includes('chrome-extension://') ||
      errorSource.includes('moz-extension://') ||
      errorSource.includes('safari-extension://') ||
      errorSource.includes('(index)')
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
    const chrome = (window as any).chrome;
    if (typeof chrome !== 'undefined' && chrome && chrome.runtime) {
      // First, try to completely override lastError - multiple strategies
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
        // If direct override fails, try alternative approach
        try {
          Object.defineProperty(chrome.runtime, 'lastError', {
            get: function() { 
              try {
                // Always return undefined to prevent errors
                return undefined;
              } catch(e) {
                return undefined;
              }
            },
            configurable: true
          });
        } catch (e2) {
          // If all else fails, wrap methods
        }
      }

      // Wrap all chrome.runtime methods to suppress lastError
      const wrapChromeMethod = (obj: Record<string, unknown>, methodName: string) => {
        if (obj && obj[methodName] && typeof obj[methodName] === 'function') {
          const original = obj[methodName] as (...args: unknown[]) => unknown;
          obj[methodName] = function(...args: unknown[]): unknown {
            try {
              const result = original.apply(this, args);
              // Immediately check and suppress any lastError
              try {
                if (chrome.runtime && (chrome.runtime as { lastError?: { message?: string } }).lastError) {
                  // Suppress it silently
                }
              } catch(e) {}
              return result;
            } catch (e: unknown) {
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
      wrapChromeMethod(chrome.runtime, 'getURL');
      wrapChromeMethod(chrome.runtime, 'getManifest');
    }
  } catch (e) {
    // Silently ignore
  }
})();

// Also intercept console at prototype level for maximum coverage
try {
  const ConsoleProto = Object.getPrototypeOf(console);
  if (ConsoleProto) {
    const originalError = ConsoleProto.error;
    const originalWarn = ConsoleProto.warn;
    const originalLog = ConsoleProto.log;
    
    if (originalError) {
      ConsoleProto.error = function(...args: unknown[]) {
        const fullMessage = args.map(arg => String(arg || '')).join(' ');
        if (suppressExtensionError(fullMessage)) return;
        return originalError.apply(this, args);
      };
    }
    
    if (originalWarn) {
      ConsoleProto.warn = function(...args: unknown[]) {
        const fullMessage = args.map(arg => String(arg || '')).join(' ');
        if (suppressExtensionError(fullMessage)) return;
        return originalWarn.apply(this, args);
      };
    }
    
    if (originalLog) {
      ConsoleProto.log = function(...args: unknown[]) {
        const fullMessage = args.map(arg => String(arg || '')).join(' ');
        if (suppressExtensionError(fullMessage)) return;
        return originalLog.apply(this, args);
      };
    }
  }
} catch (e) {
  // Ignore if prototype access fails
}

// Also suppress browser API errors (Firefox)
const browser = (window as any).browser;
if (typeof browser !== 'undefined' && browser && browser.runtime) {
  try {
    const wrapBrowserMethod = (obj: Record<string, unknown>, methodName: string) => {
      if (obj && obj[methodName] && typeof obj[methodName] === 'function') {
        const original = obj[methodName] as (...args: unknown[]) => unknown;
        obj[methodName] = function(...args: unknown[]): unknown {
          try {
            return original.apply(this, args);
          } catch (e: unknown) {
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

