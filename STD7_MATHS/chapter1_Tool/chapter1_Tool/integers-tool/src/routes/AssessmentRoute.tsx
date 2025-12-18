import { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function AssessmentRoute() {
  const { t, isTransitioning } = useLanguage();
  
  // Show a redirect notice since assessment is now merged with practice
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Redirect Notice */}
      <div className={`relative overflow-hidden rounded-xl transition-all duration-500 transform ${
        isTransitioning ? 'opacity-50 scale-95 translate-y-2' : 'opacity-100 scale-100 translate-y-0'
      }`}>
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100 via-indigo-100 to-teal-100 animate-pulse opacity-50" />
        
        <div className="relative z-10 p-8 text-center">
          <div className="text-6xl mb-4 animate-bounce">📊</div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-teal-700 bg-clip-text text-transparent mb-4">
            {t('assessment')} Mode
          </h2>
          <p className="text-gray-600 mb-6 text-lg">
            Assessment has been integrated with Practice for a seamless learning experience
          </p>
          
          {/* Redirect Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-purple-200/50 shadow-lg max-w-md mx-auto">
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-lg font-semibold text-gray-800">📊 Unified Learning Experience</div>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">
              Practice exercises flow seamlessly into assessment questions for comprehensive learning
            </p>
            
            <div className="flex items-center justify-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
                <span className="text-teal-700 font-medium">Practice Phase</span>
              </div>
              <div className="text-gray-400">→</div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                <span className="text-purple-700 font-medium">Assessment Phase</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <a 
              href="#practice" 
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-teal-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span>Go to Interactive Mode</span>
              <span className="text-xl">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}


