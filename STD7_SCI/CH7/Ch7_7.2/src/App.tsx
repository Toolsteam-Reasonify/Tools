import React, { useState } from 'react';
import { LanguageProvider } from './components/ConvectionLearning';
import ConvectionLearning from './components/ConvectionLearning';

const App: React.FC = () => {
  const [mode, setMode] = useState<'learn' | 'practice' | 'applications'>('learn');

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-purple-50 to-teal-50">
        <ConvectionLearning mode={mode} setMode={setMode} />
      </div>
    </LanguageProvider>
  );
};

export default App;
