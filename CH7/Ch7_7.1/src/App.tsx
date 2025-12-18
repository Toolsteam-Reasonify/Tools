import React, { useState } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import Navbar from './components/Navbar';
import CircuitVisualization from './components/CircuitVisualization';

const App: React.FC = () => {
  const [mode, setMode] = useState<'learn' | 'practice' | 'applications'>('learn');

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-purple-50 to-teal-50">
        <Navbar mode={mode} setMode={setMode} />
        <div className="pt-16 px-3 sm:px-4 md:px-6">
          <CircuitVisualization mode={mode} />
        </div>
      </div>
    </LanguageProvider>
  );
};

export default App;
