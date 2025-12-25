import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './i18n'
import './index.css'

// Handle browser extension errors gracefully
if (typeof window !== 'undefined') {
  // Suppress unchecked runtime.lastError from browser extensions
  window.addEventListener('error', (event) => {
    if (event.message && event.message.includes('runtime.lastError')) {
      event.preventDefault();
      return false;
    }
  }, true);

  // Also handle unhandled promise rejections that might be from extensions
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && typeof event.reason === 'string' && event.reason.includes('runtime.lastError')) {
      event.preventDefault();
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

