import React from 'react';
import ConductionLearnModeInteractive from './ConductionLearnModeInteractive';
import TopicPracticeMode from './TopicPracticeMode';
import RealWorldApplications from './RealWorldApplications';

const CircuitVisualization: React.FC<{ mode: 'learn' | 'practice' | 'applications' }> = ({ mode }) => {
  if (mode === 'practice') return <TopicPracticeMode />;
  if (mode === 'applications') return <RealWorldApplications />;
  return <ConductionLearnModeInteractive />;
};

export default CircuitVisualization;
