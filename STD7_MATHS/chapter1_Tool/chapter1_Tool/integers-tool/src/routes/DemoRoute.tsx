import DemonstrationMode from '../features/YourToolVisualization/DemonstrationMode/DemonstrationMode';
import { useLanguage } from '../contexts/LanguageContext';

export default function DemoRoute() {
  const { t, isTransitioning } = useLanguage();
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Enhanced Header with Animations */}
      <div className={`relative overflow-hidden rounded-xl transition-all duration-500 transform ${
        isTransitioning ? 'opacity-50 scale-95 translate-y-2 blur-sm' : 'opacity-100 scale-100 translate-y-0 blur-none'
      }`}>
        {/* Multi-layer Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-100 via-purple-100 to-indigo-100 opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50/80 via-transparent to-purple-50/80 animate-pulse" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-teal-400/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-teal-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        
        <div className="relative z-10 p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-3 h-3 bg-gradient-to-r from-teal-500 to-purple-500 rounded-full animate-pulse" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-700 via-purple-700 to-indigo-700 bg-clip-text text-transparent">
              {t('demo')}
            </h2>
          </div>
          
          <p className={`transition-all duration-400 text-lg ${
            isTransitioning ? 'text-gray-400 translate-x-2' : 'text-gray-700 translate-x-0'
          }`}>
            {t('topicSubtitle')}
          </p>
          
          {/* Learning Features */}
          <div className="flex flex-wrap gap-3 mt-4">
            <div className={`flex items-center space-x-2 px-3 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-teal-200/50 shadow-sm transition-all duration-300 hover:scale-105 ${
              isTransitioning ? 'opacity-50' : 'opacity-100'
            }`}>
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-teal-700">Step-by-step Learning</span>
            </div>
            
            <div className={`flex items-center space-x-2 px-3 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-purple-200/50 shadow-sm transition-all duration-300 hover:scale-105 delay-100 ${
              isTransitioning ? 'opacity-50' : 'opacity-100'
            }`}>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
              <span className="text-xs font-medium text-purple-700">Visual Animations</span>
            </div>
            
            <div className={`flex items-center space-x-2 px-3 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-indigo-200/50 shadow-sm transition-all duration-300 hover:scale-105 delay-200 ${
              isTransitioning ? 'opacity-50' : 'opacity-100'
            }`}>
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
              <span className="text-xs font-medium text-indigo-700">Interactive Examples</span>
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


