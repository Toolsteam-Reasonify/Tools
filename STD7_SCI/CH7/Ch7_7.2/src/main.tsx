import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './i18n'
import './index.css'

// Suppress harmless browser extension errors
// These errors occur when browser extensions (like React DevTools) try to communicate
// but the connection closes before a response is received - this is completely harmless
const originalConsoleError = console.error
console.error = (...args: any[]) => {
  const errorMessage = args[0]?.toString() || ''
  
  // Suppress runtime.lastError messages from browser extensions
  if (
    errorMessage.includes('runtime.lastError') ||
    errorMessage.includes('message port closed') ||
    errorMessage.includes('Extension context invalidated') ||
    errorMessage.includes('Receiving end does not exist')
  ) {
    // Silently ignore these harmless extension errors
    return
  }
  
  // Log all other errors normally
  originalConsoleError.apply(console, args)
}

// Global error handler to catch and suppress harmless browser extension errors
window.addEventListener('error', (event) => {
  const errorMessage = event.message || ''
  
  // Suppress runtime.lastError messages from browser extensions
  if (
    errorMessage.includes('runtime.lastError') ||
    errorMessage.includes('message port closed') ||
    errorMessage.includes('Extension context invalidated') ||
    errorMessage.includes('Receiving end does not exist')
  ) {
    event.preventDefault()
    return false
  }
})

// Handle unhandled promise rejections that might be related to extensions
window.addEventListener('unhandledrejection', (event) => {
  const errorMessage = event.reason?.message?.toString() || event.reason?.toString() || ''
  
  if (
    errorMessage.includes('runtime.lastError') ||
    errorMessage.includes('message port closed') ||
    errorMessage.includes('Extension context invalidated') ||
    errorMessage.includes('Receiving end does not exist')
  ) {
    event.preventDefault()
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

