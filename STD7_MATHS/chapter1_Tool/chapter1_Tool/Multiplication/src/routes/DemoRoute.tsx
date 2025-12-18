import DemonstrationMode from '../features/MultiplicationVisualization/DemonstrationMode/DemonstrationMode';
import { useLanguage } from '../contexts/LanguageContext';

export default function DemoRoute() {
  const { t, isTransitioning } = useLanguage();
  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6 animate-fade-in">
      {/* Enhanced Header with Animations */}
      <div className={`relative overflow-hidden rounded-lg sm:rounded-xl transition-all duration-500 transform ${
        isTransitioning ? 'opacity-50 scale-95 translate-y-2 blur-sm' : 'opacity-100 scale-100 translate-y-0 blur-none'
      }`}>
        {/* Multi-layer Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-100 via-accent-100 to-success-100 opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50/80 via-transparent to-accent-50/80 animate-pulse" />
        <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-br from-accent-400/20 to-brand-400/20 rounded-full blur-xl sm:blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-0 w-12 h-12 sm:w-18 sm:h-18 md:w-24 md:h-24 bg-gradient-to-tr from-brand-400/20 to-accent-400/20 rounded-full blur-lg sm:blur-xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        
        <div className="relative z-10 p-3 sm:p-4 md:p-6">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-brand-500 to-accent-500 rounded-full animate-pulse" />
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-brand-700 via-accent-700 to-success-700 bg-clip-text text-transparent">
              {t('demo')} - <span className="hidden sm:inline">Multiplication Mastery</span><span className="sm:hidden">Multiply</span>
            </h2>
          </div>
          
          <p className={`transition-all duration-400 text-sm sm:text-base md:text-lg ${
            isTransitioning ? 'text-gray-400 translate-x-2' : 'text-gray-700 translate-x-0'
          }`}>
            {t('topicSubtitle')}
          </p>
          
          {/* Learning Features */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mt-3 sm:mt-4">
            <div className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 sm:py-2 bg-white/70 backdrop-blur-sm rounded-full border border-brand-200/50 shadow-sm transition-all duration-300 hover:scale-105 ${
              isTransitioning ? 'opacity-50' : 'opacity-100'
            }`}>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-brand-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-brand-700">{t('visualGridArrays')}</span>
            </div>
            
            <div className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 sm:py-2 bg-white/70 backdrop-blur-sm rounded-full border border-accent-200/50 shadow-sm transition-all duration-300 hover:scale-105 delay-100 ${
              isTransitioning ? 'opacity-50' : 'opacity-100'
            }`}>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-accent-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
              <span className="text-xs font-medium text-accent-700">{t('repeatedAdditionTag')}</span>
            </div>
            
            <div className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 sm:py-2 bg-white/70 backdrop-blur-sm rounded-full border border-success-200/50 shadow-sm transition-all duration-300 hover:scale-105 delay-200 ${
              isTransitioning ? 'opacity-50' : 'opacity-100'
            }`}>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-success-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
              <span className="text-xs font-medium text-success-700">{t('mathematicalPropertiesTag')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Demonstration Mode */}
      <div className={`transition-all duration-700 ease-out delay-300 transform ${
        isTransitioning ? 'opacity-30 scale-95 translate-y-4 blur-sm' : 'opacity-100 scale-100 translate-y-0 blur-none'
      }`}>
        <DemonstrationMode />
      </div>
    </div>
  );
}