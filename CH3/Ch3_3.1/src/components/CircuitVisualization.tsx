import React from 'react';
import { useMode } from '@/contexts/ModeContext';
import TorchlightLearning from './TorchlightLearning';
import TorchlightPractice from './TorchlightPractice';

const CircuitVisualization: React.FC = () => {
  const { currentMode } = useMode();

  // Render based on current mode
  if (currentMode === 'practice') {
    return <TorchlightPractice />;
  }

  // Default to demonstration/learn mode
  return <TorchlightLearning />;
};

export default CircuitVisualization;
