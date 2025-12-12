import React, { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { DemonstrationStep, CircuitUIConfig } from '@/interfaces/circuitTypes';
import CircuitCanvas from './CircuitCanvas';

interface DemonstrationModeProps {
  steps: DemonstrationStep[];
  currentStep: number;
  isPlaying: boolean;
  ui_config: CircuitUIConfig;
  onStepComplete: () => void;
}

const DemonstrationMode: React.FC<DemonstrationModeProps> = ({
  steps,
  currentStep,
  isPlaying,
  ui_config,
  onStepComplete,
}) => {
  const { t } = useLanguage();
  
  const currentStepData = steps[currentStep];
  const stepTypeLabel = currentStepData?.type
    ? t(`demo.stepType.${currentStepData.type}`) || currentStepData.type
    : '';

  useEffect(() => {
    if (isPlaying && currentStepData?.completion_criteria?.type === 'automatic') {
      const timer = setTimeout(() => {
        onStepComplete();
      }, ui_config.step_duration);
      
      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentStep, ui_config.step_duration, onStepComplete, currentStepData]);

  const handleInteraction = (_componentId: string) => { // eslint-disable-line @typescript-eslint/no-unused-vars
    if (currentStepData?.completion_criteria?.type === 'user_confirm') {
      onStepComplete();
    }
  };

  const renderStepContent = () => {
    if (!currentStepData) return null;
    
    switch (currentStepData.type) {
      case 'explanation':
        return (
          <div className="explanation-step p-6 bg-gradient-to-br from-teal-50 to-purple-50 rounded-lg animate-fade-in">
            <h3 className="text-2xl font-semibold text-teal-800 mb-4">
              {t(currentStepData.title) || currentStepData.title}
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              {t(currentStepData.description) || currentStepData.description}
            </p>
            
            {currentStepData.learning_notes && (
              <div className="mt-4 p-4 bg-teal-100 rounded-lg border-l-4 border-teal-500">
                <p className="text-sm text-teal-800 font-medium">{t(currentStepData.learning_notes) || currentStepData.learning_notes}</p>
              </div>
            )}
            
            {currentStepData.completion_criteria?.type === 'user_confirm' && (
              <button
                onClick={() => handleInteraction('')}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-teal-500 to-purple-500 text-white rounded-lg hover:from-teal-600 hover:to-purple-600 transition-all font-semibold"
              >
                {t('common.gotIt')} {t('common.continue')} →
              </button>
            )}
          </div>
        );
        
      case 'visualization':
        return (
          <div className="visualization-step animate-fade-in">
            <h3 className="text-2xl font-semibold text-purple-800 mb-4">
              {t(currentStepData.title) || currentStepData.title}
            </h3>
            
            <CircuitCanvas
              components={currentStepData.visual_state.components}
              circuitComplete={currentStepData.visual_state.circuit_complete}
              currentFlowing={currentStepData.visual_state.current_flowing}
              onComponentClick={handleInteraction}
              interactive={true}
            />
            
            <p className="text-gray-600 mt-4 text-lg">{t(currentStepData.description) || currentStepData.description}</p>
          </div>
        );
        
      case 'interaction':
        return (
          <div className="interaction-step p-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg animate-fade-in">
            <h3 className="text-2xl font-semibold text-green-800 mb-3">
              {t(currentStepData.title) || currentStepData.title}
            </h3>
            <p className="text-green-700 mb-6 text-lg">{t(currentStepData.description) || currentStepData.description}</p>
            
            <CircuitCanvas
              components={currentStepData.visual_state.components}
              circuitComplete={currentStepData.visual_state.circuit_complete}
              currentFlowing={currentStepData.visual_state.current_flowing}
              onComponentClick={handleInteraction}
              interactive={true}
            />
            
            {currentStepData.interactions?.some(i => i.hint) && (
              <div className="hints mt-6 p-4 bg-yellow-100 rounded-lg border border-yellow-300">
                <h4 className="font-semibold text-yellow-800 mb-2">💡 {t('common.hint')}:</h4>
                {currentStepData.interactions?.map((interaction, index) => 
                  interaction.hint && (
                    <p key={index} className="text-sm text-yellow-700 mt-1">
                      • {t(interaction.hint) || interaction.hint}
                    </p>
                  )
                )}
              </div>
            )}
          </div>
        );
        
      default:
        return (
          <div className="unknown-step p-6 bg-gray-100 rounded-lg">
            <p>{t('demo.unknownType')}: {currentStepData.type}</p>
          </div>
        );
    }
  };
  
  return (
    <div className="demonstration-mode">
      {/* Step indicator */}
      <div className="step-indicator mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600 font-medium">
            {t('practice.exercise')} {currentStep + 1} {t('practice.of')} {steps.length}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            currentStepData?.type === 'explanation' ? 'bg-teal-100 text-teal-800' :
            currentStepData?.type === 'visualization' ? 'bg-purple-100 text-purple-800' :
            currentStepData?.type === 'interaction' ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {stepTypeLabel}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-teal-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Main step content */}
      {renderStepContent()}
      
      {/* Common mistakes warning */}
      {currentStepData?.common_mistakes && currentStepData.common_mistakes.length > 0 && (
        <div className="common-mistakes mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="font-semibold text-red-800 mb-2">⚠️ {t('common.mistakesTitle')}</h4>
          <ul className="text-sm text-red-700 space-y-1">
            {currentStepData.common_mistakes.map((mistake, index) => (
              <li key={index}>• {t(mistake) || mistake}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DemonstrationMode;

