import React from 'react';
import ExampleTool from './components/Eclipses';

const App: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
      padding: '40px 20px',
      fontFamily: '"Poppins", "Segoe UI", sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h1 style={{
          textAlign: 'center',
          color: '#1e293b',
          fontSize: '36px',
          fontWeight: 700,
          marginBottom: '40px',
          textShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          Educational Interactive Tools
        </h1>
        <ExampleTool />
      </div>
    </div>
  );
};

export default App;
