import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { ModeProvider } from './contexts/ModeContext';
import Navbar from './components/Navbar';
import CircuitVisualization from './components/CircuitVisualization';
import RealWorldApplications from './components/RealWorldApplications';
import { CircuitUIConfig } from './interfaces/circuitTypes';
import { sampleCircuitData } from './data/sampleData';

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

