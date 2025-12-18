import PracticeMode from '../features/DivisionVisualization/PracticeMode/PracticeMode';
import { useLanguage } from '../contexts/LanguageContext';

export default function PracticeRoute() {
  const { t, isTransitioning } = useLanguage();
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Enhanced Header with Animations */}
      <div className={`relative overflow-hidden rounded-xl transition-all duration-500 transform ${
        isTransitioning ? 'opacity-50 scale-95 translate-y-2' : 'opacity-100 scale-100 translate-y-0'
      }`}>
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-100 via-purple-100 to-indigo-100 animate-pulse opacity-50" />
        
        <div className="relative z-10 p-6">
          <div className="flex items-center space-x-3 mb-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-700 to-purple-700 bg-clip-text text-transparent">
              🎯 {t('practice')} {t('mode')}
            </h2>
          </div>
          <p className={`transition-all duration-300 ${
            isTransitioning ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {t('interactiveLearning') || 'Interactive learning with immediate feedback and comprehensive assessment'}
          </p>
          
          {/* Learning Mode Indicators */}
          <div className="flex items-center space-x-4 mt-4">
            <div className="flex items-center space-x-2 px-3 py-1 bg-teal-100 rounded-full">
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-teal-700">{t('guidedPractice') || 'Guided Practice'}</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-1 bg-purple-100 rounded-full">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
              <span className="text-xs font-medium text-purple-700">{t('knowledgeAssessment') || 'Knowledge Assessment'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Practice Mode with Navigation Buttons */}
      <div className={`transition-all duration-700 ease-out delay-200 transform ${
        isTransitioning ? 'opacity-30 scale-95 translate-y-4 blur-sm' : 'opacity-100 scale-100 translate-y-0 blur-none'
      }`}>
        <PracticeMode />
      </div>
    </div>
  );
}