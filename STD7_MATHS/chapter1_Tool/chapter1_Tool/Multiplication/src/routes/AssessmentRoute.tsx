import React from 'react';
import AssessmentHandler from '../features/MultiplicationVisualization/AssessmentHandler/AssessmentHandler';
import { useLanguage } from '../contexts/LanguageContext';

export default function AssessmentRoute() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('assessment')}</h1>
        <p className="text-gray-600">Test your multiplication skills</p>
      </div>
      
      <AssessmentHandler />
    </div>
  );
}