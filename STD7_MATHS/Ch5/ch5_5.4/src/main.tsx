import React from 'react'
import ReactDOM from 'react-dom/client'
import Chapter5Tool from './components/Chapter5Tool.tsx'
import './index.css'

// Suppress Chrome extension runtime.lastError messages
if (typeof window !== 'undefined') {
  const originalError = window.console.error;
  window.console.error = function(...args: any[]) {
    // Filter out Chrome extension errors
    if (args.length > 0) {
      const errorMessage = String(args[0]);
      if (
        errorMessage.includes('runtime.lastError') ||
        errorMessage.includes('message port closed') ||
        errorMessage.includes('Extension context invalidated')
      ) {
        return; // Suppress these errors
      }
    }
    originalError.apply(console, args);
  };
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Chapter5Tool />
  </React.StrictMode>,
)

