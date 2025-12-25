import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Suppress browser extension errors that don't affect the application
const originalError = console.error;
console.error = (...args: any[]) => {
  const errorMessage = args[0]?.toString() || '';
  // Suppress the specific browser extension error
  if (
    errorMessage.includes('runtime.lastError') ||
    errorMessage.includes('message port closed') ||
    errorMessage.includes('Extension context invalidated')
  ) {
    return;
  }
  originalError.apply(console, args);
};

// Handle unhandled errors from browser extensions
window.addEventListener('error', (event) => {
  const errorMessage = event.message || '';
  if (
    errorMessage.includes('runtime.lastError') ||
    errorMessage.includes('message port closed') ||
    errorMessage.includes('Extension context invalidated')
  ) {
    event.preventDefault();
    return false;
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

