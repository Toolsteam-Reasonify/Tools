import { useLanguage } from '../contexts/LanguageContext';

export default function AssessmentRoute() {
  const { t, isTransitioning } = useLanguage();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className={`relative overflow-hidden rounded-xl transition-all duration-500 transform ${
        isTransitioning ? 'opacity-50 scale-95 translate-y-2 blur-sm' : 'opacity-100 scale-100 translate-y-0 blur-none'
      }`}>
        <div className="absolute inset-0 bg-gradient-to-r from-pink-100 via-purple-100 to-teal-100 opacity-60" />
        
        <div className="relative z-10 p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-700 via-purple-700 to-teal-700 bg-clip-text text-transparent">
              {t('assessment')}
            </h2>
          </div>
          
          <p className={`transition-all duration-400 text-lg ${
            isTransitioning ? 'text-gray-400 translate-x-2' : 'text-gray-700 translate-x-0'
          }`}>
            Test your understanding of division of integers
          </p>
        </div>
      </div>

      <div className={`bg-white rounded-xl shadow-soft border p-8 text-center transition-all duration-300 ${
        isTransitioning ? 'opacity-70 scale-95' : 'opacity-100 scale-100'
      }`}>
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Division Assessment
        </h3>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Comprehensive assessment to evaluate your mastery of integer division concepts and properties.
        </p>
        <div className="text-sm text-gray-500">
          🚧 Assessment questions coming soon with detailed scoring and feedback!
        </div>
      </div>
    </div>
  );
}