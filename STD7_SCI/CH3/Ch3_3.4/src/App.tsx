import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider, ModeProvider, Navbar, CircuitVisualization, RealWorldApplications } from './components/ConductorAndInsulator';

const App: React.FC = () => {
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
            <div className="pt-16 px-3 sm:px-4 md:px-6">
              <Routes>
                <Route
                  path="/"
                  element={<CircuitVisualization />}
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
