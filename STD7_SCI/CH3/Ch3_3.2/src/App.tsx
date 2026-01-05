import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  LanguageProvider,
  ModeProvider,
  Navbar,
  CircuitVisualization,
  RealWorldApplications,
  CircuitUIConfig,
  sampleCircuitData,
} from './components/SimpleElectricCircuit';

const App: React.FC = () => {
  const [uiConfig] = useState<CircuitUIConfig>({
    theme: 'modern',
    layout: 'standard',
    auto_play: false,
    step_duration: 3000,
    show_controls: true,
    show_progress: true,
    hint_system: true,
    progressive_difficulty: true,
    immediate_feedback: true,
    celebration_animations: true,
    high_contrast: false,
    large_text: false,
    keyboard_navigation: true,
    screen_reader_support: true,
  });

  // Suppress browser extension errors
  React.useEffect(() => {
    const originalError = console.error;
    const originalWarn = console.warn;
    
    // Suppress console errors from browser extensions
    console.error = (...args: any[]) => {
      const errorMessage = args[0]?.toString() || '';
      if (
        errorMessage.includes('message port') ||
        errorMessage.includes('runtime.lastError') ||
        errorMessage.includes('Extension context invalidated') ||
        errorMessage.includes('Unchecked runtime.lastError')
      ) {
        return; // Suppress browser extension errors
      }
      originalError.apply(console, args);
    };

    // Suppress console warnings from browser extensions
    console.warn = (...args: any[]) => {
      const warnMessage = args[0]?.toString() || '';
      if (
        warnMessage.includes('message port') ||
        warnMessage.includes('runtime.lastError') ||
        warnMessage.includes('Extension context invalidated')
      ) {
        return; // Suppress browser extension warnings
      }
      originalWarn.apply(console, args);
    };

    // Global error handler for unhandled errors
    const handleError = (event: ErrorEvent) => {
      if (
        event.message?.includes('message port') ||
        event.message?.includes('runtime.lastError') ||
        event.message?.includes('Extension context invalidated')
      ) {
        event.preventDefault();
        return false;
      }
    };

    window.addEventListener('error', handleError);

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
      window.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <LanguageProvider>
      <ModeProvider>
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <div className="min-h-screen bg-gradient-to-br from-teal-50 via-purple-50 to-teal-50">
            <Navbar />
            <div className="pt-16">
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <CircuitVisualization 
                      data={sampleCircuitData}
                  title="title.circuits"
                      ui_config={uiConfig}
                    />
                  } 
                />
                <Route 
                  path="/applications" 
                  element={<RealWorldApplications />} 
                />
              </Routes>
            </div>
          </div>
        </Router>
      </ModeProvider>
    </LanguageProvider>
  );
};

export default App;

