import React, { useState } from 'react';
import Rotation, { LanguageProvider } from './components/Rotation';

const App: React.FC = () => {
  const [mode, setMode] = useState<"learn" | "practice" | "applications">("learn");

  return (
    <LanguageProvider>
      <Rotation mode={mode} setMode={setMode} />
    </LanguageProvider>
  );
};

export default App;
