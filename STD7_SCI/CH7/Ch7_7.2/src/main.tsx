import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './i18n'
import './index.css'

// Remove Jinno feature block/banner (only after React fully renders)
// This runs well after React has mounted to avoid interfering with app content
const initJinnoRemoval = () => {
  // Wait for React to fully render before starting removal
  const startRemoval = () => {
    const checkAndRemove = () => {
      // Only look for elements with explicit Jinno identifiers (very safe)
      const jinnoSelectors = [
        '[class*="jinno" i]',
        '[id*="jinno" i]',
        '[data-jinno]'
      ];
      
      jinnoSelectors.forEach(selector => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => {
            // NEVER remove anything inside the root app container
            const root = document.getElementById('root');
            if (root && root.contains(el)) {
              return; // Skip app content
            }
            el.remove();
          });
        } catch (e) {
          // Ignore selector errors
        }
      });

      // Only check fixed/absolute positioned elements OUTSIDE root
      const root = document.getElementById('root');
      if (!root) return;

      document.querySelectorAll('div').forEach((el) => {
        // NEVER touch anything inside root
        if (root.contains(el)) {
          return;
        }
        
        const text = el.textContent || '';
        // Very specific check - only exact Jinno welcome message
        if (text.includes('Welcome to Jinno') && text.includes('Start for free')) {
          const styles = window.getComputedStyle(el);
          // Only remove fixed/absolute positioned banners
          if ((styles.position === 'fixed' || styles.position === 'absolute') && 
              (el.getAttribute('class')?.toLowerCase().includes('banner') ||
               el.getAttribute('class')?.toLowerCase().includes('notification'))) {
            el.remove();
          }
        }
      });
    };

    // Run after ensuring React has rendered
    setTimeout(checkAndRemove, 2000);
    
    // Monitor for new elements (only outside root)
    const observer = new MutationObserver((mutations) => {
      const root = document.getElementById('root');
      if (!root) return;

      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as Element;
            // NEVER touch root content
            if (root.contains(el)) {
              return;
            }
            
            const text = el.textContent || '';
            if (text.includes('Welcome to Jinno') && text.includes('Start for free')) {
              const styles = window.getComputedStyle(el);
              if (styles.position === 'fixed' || styles.position === 'absolute') {
                el.remove();
              }
            }
          }
        });
      });
    });

    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  };

  // Wait for React to mount (check for root content)
  const checkReactReady = setInterval(() => {
    const root = document.getElementById('root');
    if (root && root.children.length > 0 && root.querySelector('div')) {
      clearInterval(checkReactReady);
      // Wait additional time to ensure React is fully done
      setTimeout(startRemoval, 500);
    }
  }, 200);

  // Safety timeout - don't start removal until at least 2 seconds after page load
  setTimeout(() => {
    clearInterval(checkReactReady);
    startRemoval();
  }, 2000);
};

// Only start after DOM is ready and React has had time to initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initJinnoRemoval, 1000);
  });
} else {
  setTimeout(initJinnoRemoval, 1000);
}

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

