import React, { useState, useCallback, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMode } from '@/contexts/ModeContext';
import { CircuitToolProps, Mode, ProgressData } from '@/interfaces/circuitTypes';
import ElectricityLearningApp from './ElectricityLearningApp';
import PracticeMode from './PracticeMode';

const CircuitVisualization: React.FC<CircuitToolProps> = ({
  data,
  title,
  ui_config: _ui_config, // eslint-disable-line @typescript-eslint/no-unused-vars
  onStepChange: _onStepChange, // eslint-disable-line @typescript-eslint/no-unused-vars
  onPracticeComplete: _onPracticeComplete, // eslint-disable-line @typescript-eslint/no-unused-vars
  onProgress,
  onReset,
  currentStep = 0,
}) => {
  const { t } = useLanguage();
  const { currentMode: contextMode, setCurrentMode: setContextMode } = useMode();
  const [localMode, setLocalMode] = useState<Mode>(
    data.mode === 'mixed' ? 'demonstration' : data.mode
  );

  // Use context mode if available, otherwise use local mode
  const currentMode: 'demonstration' | 'practice' = data.mode === 'mixed'
    ? contextMode
    : (localMode === 'demonstration' || localMode === 'practice' ? localMode : 'demonstration');
  const [currentStepIndex, setCurrentStepIndex] = useState(currentStep);
  const [studentProgress, setStudentProgress] = useState<ProgressData>({
    current_step: currentStep,
    total_steps: data.demonstration?.steps.length || 0,
    completion_percentage: 0,
    time_spent: 0,
    exercises_completed: 0,
    current_difficulty: data.student_context.current_level,
    mastery_indicators: [],
  });




  // Listen to context mode changes
  useEffect(() => {
    if (data.mode === 'mixed' && contextMode !== currentMode) {
      if (contextMode === 'practice') {
        setCurrentStepIndex(0);
      }
    }
  }, [contextMode, data.mode, currentMode]);

  const calculateCompletionPercentage = useCallback(() => {
    const totalSteps = data.demonstration?.steps.length || 0;
    if (currentMode === 'demonstration') {
      return totalSteps > 0 ? ((currentStepIndex + 1) / totalSteps) * 100 : 0;
    }
    return 0;
  }, [currentMode, currentStepIndex, data.demonstration?.steps.length]);

  React.useEffect(() => {
    const totalSteps = data.demonstration?.steps.length || 0;
    const completionPercentage = calculateCompletionPercentage();
    const progress: ProgressData = {
      current_step: currentStepIndex,
      total_steps: totalSteps,
      completion_percentage: completionPercentage,
      time_spent: studentProgress.time_spent,
      exercises_completed: studentProgress.exercises_completed,
      current_difficulty: data.student_context.current_level,
      mastery_indicators: [],
    };
    setStudentProgress(progress);
    if (onProgress) onProgress(progress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepIndex, calculateCompletionPercentage]);

  const renderCurrentMode = () => {
    switch (currentMode) {
      case 'demonstration':
        return (
          <ElectricityLearningApp />
        );
      case 'practice':
        return (
          <PracticeMode />
        );
      default:
        return <div>{t('common.invalidMode')}</div>;
    }
  };

  // For demonstration mode, render the new learning app directly without extra wrapper
  if (currentMode === 'demonstration') {
    return <ElectricityLearningApp />;
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-teal-700 mb-2">{t(title) || title}</h1>
        </div>

        {/* Learning Objectives - Only show in demonstration mode */}
        {currentMode !== 'practice' && (
          <div className="mb-6 p-4 bg-teal-50 rounded-lg border border-teal-200 animate-fade-in">
            <h3 className="font-semibold text-teal-800 mb-2">{t('objective.1')}</h3>
            <ul className="text-sm text-teal-700 space-y-1">
              {data.metadata.learning_objectives.map((objective, index) => (
                <li key={index}>• {t(objective) || objective}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Main Content */}
        <div className="mb-6 bg-white rounded-lg shadow-lg p-6 animate-fade-in">
          {renderCurrentMode()}
        </div>


      </div>
    </div>
  );
};

export default CircuitVisualization;

