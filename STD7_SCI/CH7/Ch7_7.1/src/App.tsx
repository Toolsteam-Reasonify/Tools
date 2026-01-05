import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './components/ConductionOfHeatLearning';
import ConductionLearning from './components/ConductionOfHeatLearning';

const App: React.FC = () => {
  const [mode, setMode] = useState<'learn' | 'practice' | 'applications'>('learn');

  // Debug: Log that App is rendering
  useEffect(() => {
    console.log('App component mounted');
  }, []);

  // Safely remove grey banners/Jinno blocks - only check elements outside #root
  useEffect(() => {
    const removeBanners = () => {
      try {
        const root = document.getElementById('root');
        if (!root) return;
        
        // Only check direct children of body (banners are usually injected here)
        Array.from(document.body.children).forEach((el) => {
          const htmlEl = el as HTMLElement;
          // Skip root element completely
          if (htmlEl.id === 'root') return;
          
          const computed = window.getComputedStyle(htmlEl);
          const bg = computed.backgroundColor.toLowerCase();
          const text = (htmlEl.textContent || '').toLowerCase();
          
          // Only remove if it's clearly a banner (Jinno-related or grey banner pattern)
          if (text.includes('jinno') || text.includes('jinnos') || 
              (text.includes('welcome') && text.includes('feature'))) {
            htmlEl.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important;';
            return;
          }
          
          // Only target grey banners that are NOT inside root
          const isGrey = bg.includes('rgb(128') || bg.includes('grey') || bg.includes('gray');
          if (isGrey && computed.borderRadius !== '0px' && 
              htmlEl.offsetHeight > 30 && htmlEl.offsetHeight < 150 &&
              !root.contains(htmlEl)) {
            htmlEl.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important;';
          }
        });
      } catch (e) {
        // Silent fail
      }
    };

    // Remove after a short delay to let React render first
    const timeout = setTimeout(removeBanners, 100);
    
    // Set up observer - only watch for new children of body
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            const el = node as HTMLElement;
            if (el.id === 'root') return;
            removeBanners();
          }
        });
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: false // Only watch direct children, not all descendants
    });
    
    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, []);

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-purple-50 to-teal-50">
        <ConductionLearning mode={mode} setMode={setMode} />
      </div>
    </LanguageProvider>
  );
};

export default App;
