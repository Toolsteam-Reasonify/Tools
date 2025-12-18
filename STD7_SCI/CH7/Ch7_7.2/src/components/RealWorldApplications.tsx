import React, { useState, useEffect } from 'react';
import {
  Globe, Wind, Home, Sun, Moon, Coffee, CloudSnow,
  ChevronDown, ChevronUp, Lightbulb, Sparkles, Info,
  Award, BookOpen
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Application {
  id: number;
  title: string;
  category: string;
  icon: React.ReactNode;
  description: string;
  howItWorks: string;
  scienceBehind: string;
  realExample: string;
  benefits: string[];
  difficulty: 'everyday' | 'nature' | 'technology';
}

interface RealWorldApplicationsProps {
  language?: string;
}

const ConvectionRealWorldApplications: React.FC<RealWorldApplicationsProps> = () => {
  const { t, language } = useLanguage();
  const [expandedApp, setExpandedApp] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Load applications from translations
  const getApplications = (): Application[] => {
    const translationApps = t('convection.realWorld.applications', { returnObjects: true }) as unknown;
    if (!Array.isArray(translationApps)) return [];
    return translationApps.map((app: any, index: number) => ({
      id: app.id || index + 1,
      title: app.title,
      category: app.category,
      icon: [<Wind />, <Home />, <Sparkles />, <Coffee />, <Sun />, <Home />, <Globe />, <CloudSnow />][index] || <Lightbulb />,
      description: app.description,
      howItWorks: app.howItWorks,
      scienceBehind: app.scienceBehind,
      realExample: app.realExample,
      benefits: app.benefits || [],
      difficulty: app.difficulty
    }));
  };

  const [applications, setApplications] = useState<Application[]>(getApplications());

  // Update applications when language changes
  useEffect(() => {
    setApplications(getApplications());
  }, [language]);

  const applicationsList: Application[] = applications;

  const getCategories = (): string[] => {
    return ['all', 'Nature', 'Home', 'Kitchen', 'Everyday', 'Technology'];
  };

  const categories = getCategories();

  const filteredApplications = selectedCategory === 'all'
    ? applicationsList
    : applicationsList.filter(app => app.category === selectedCategory);

  const toggleExpand = (id: number) => {
    setExpandedApp(expandedApp === id ? null : id);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Nature': return <Globe className="w-4 h-4" />;
      case 'Home': return <Home className="w-4 h-4" />;
      case 'Kitchen': return <Coffee className="w-4 h-4" />;
      case 'Everyday': return <Sparkles className="w-4 h-4" />;
      case 'Technology': return <Sun className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'everyday': return 'bg-green-100 text-green-800 border-green-300';
      case 'nature': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'technology': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    return t(`convection.realWorld.difficulty.${difficulty}` as any) || difficulty;
  };

  const getCategoryLabel = (category: string) => {
    if (category === 'all') return t('convection.realWorld.categories.all');
    return t(`convection.realWorld.categories.${category}` as any) || category;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 p-6 md:p-8"
         style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <div className="max-w-7xl mx-auto">

        {/* Category Filter */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 md:mb-8 border border-gray-100">
          <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600" />
            {t('convection.realWorld.filter.title')}
          </h3>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-1 sm:gap-2 transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category !== 'all' && getCategoryIcon(category)}
                {getCategoryLabel(category)}
              </button>
            ))}
          </div>
          <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600">
            {t('convection.realWorld.filter.showing')} <strong>{filteredApplications.length}</strong> {filteredApplications.length !== 1 ? t('convection.realWorld.filter.applications') : t('convection.realWorld.filter.application')}
          </div>
        </div>

        {/* Applications Grid */}
        <div className="space-y-6">
          {filteredApplications.map((app) => {
            const isExpanded = expandedApp === app.id;

            return (
              <div
                key={app.id}
                className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 transition-all hover:shadow-2xl"
              >
                {/* Card Header */}
                <button
                  onClick={() => toggleExpand(app.id)}
                  className="w-full p-4 sm:p-6 md:p-8 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 sm:gap-4">
                    <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                      {/* Icon */}
                      <div className="bg-gradient-to-br from-cyan-100 to-blue-100 p-3 sm:p-4 rounded-xl sm:rounded-2xl flex-shrink-0">
                        <div className="w-6 h-6 sm:w-8 sm:h-8">{app.icon}</div>
                      </div>

                      {/* Title and Description */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                            {app.title}
                          </h3>
                          <span className="px-2 sm:px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-xs font-bold flex items-center gap-1">
                            {getCategoryIcon(app.category)}
                            {getCategoryLabel(app.category)}
                          </span>
                          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold border ${getDifficultyColor(app.difficulty)}`}>
                            {getDifficultyLabel(app.difficulty)}
                          </span>
                        </div>
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                          {app.description}
                        </p>
                      </div>
                    </div>

                    {/* Expand/Collapse Icon */}
                    <div className="flex-shrink-0">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gradient-to-br from-gray-50 to-cyan-50 p-4 sm:p-6 md:p-8">
                    <div className="space-y-4 sm:space-y-6">

                      {/* How It Works */}
                      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border-l-4 border-cyan-500">
                        <h4 className="font-bold text-cyan-900 mb-2 sm:mb-3 text-base sm:text-lg flex items-center gap-2">
                          <Info className="w-4 h-4 sm:w-5 sm:h-5" />
                          {t('convection.realWorld.labels.howItWorks')}
                        </h4>
                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                          {app.howItWorks}
                        </p>
                      </div>

                      {/* Science Behind It */}
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-purple-300">
                        <h4 className="font-bold text-purple-900 mb-2 sm:mb-3 text-base sm:text-lg flex items-center gap-2">
                          <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                          {t('convection.realWorld.labels.scienceBehind')}
                        </h4>
                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                          {app.scienceBehind}
                        </p>
                      </div>

                      {/* Real Example */}
                      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-amber-300">
                        <h4 className="font-bold text-amber-900 mb-2 sm:mb-3 text-base sm:text-lg flex items-center gap-2">
                          <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                          {t('convection.realWorld.labels.realExample')}
                        </h4>
                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed italic">
                          {app.realExample}
                        </p>
                      </div>

                      {/* Benefits */}
                      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-cyan-200">
                        <h4 className="font-bold text-cyan-900 mb-3 sm:mb-4 text-base sm:text-lg flex items-center gap-2">
                          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                          {t('convection.realWorld.labels.benefits')}
                        </h4>
                        <ul className="space-y-2">
                          {app.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <span className="bg-cyan-100 text-cyan-800 rounded-full p-1 flex-shrink-0 mt-0.5">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </span>
                              <span className="text-gray-700 flex-1">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default ConvectionRealWorldApplications;