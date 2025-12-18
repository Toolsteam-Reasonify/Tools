import React, { useState, useMemo } from 'react';
import {
  Home,
  Utensils,
  Thermometer,
  Snowflake,
  Flame,
  Factory,
  Coffee,
  Shirt,
  Building2,
  Mountain,
  Globe,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Info,
  Zap,
  HardHat,
  Award,
  BookOpen,
  Sparkles,
  Sun,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import i18n from '@/i18n';

interface Application {
  id: number;
  title: string;
  category: string;
  icon: React.ReactNode;
  description: string;
  howItWorks: string;
  conductor: string;
  insulator: string;
  scienceBehind: string;
  realExample: string;
  benefits: string[];
  difficulty: 'everyday' | 'industrial' | 'advanced';
}

const RealWorldApplications: React.FC = () => {
  const { t, language } = useLanguage();
  const [expandedApp, setExpandedApp] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // All hooks must be called before any conditional returns
  const applicationsData = useMemo(() => {
    const data = t('conduction.realWorld.applications', { returnObjects: true });
    // If current language has no applications, fallback to English
    if (!Array.isArray(data) || data.length === 0) {
      // Get English applications as fallback using i18n.t() with language override
      const enData = i18n.t('conduction.realWorld.applications', { returnObjects: true, lng: 'en' });
      return (Array.isArray(enData) ? enData : []) as Application[];
    }
    return data as Application[];
  }, [t, language]);

  const categories = useMemo(() => {
    const categoryData = t('conduction.realWorld.categories', { returnObjects: true });
    if (typeof categoryData === 'object' && categoryData !== null) {
      return Object.keys(categoryData).map(key => ({
        key,
        label: (categoryData as Record<string, string>)[key],
      }));
    }
    return [];
  }, [t, language]);

  // Helper function (not a hook, so can be defined after hooks)
  const getCategoryIcon = (category: string) => {
    const categoryMap: Record<string, React.ReactNode> = {
      Kitchen: <Utensils className="w-4 h-4" />,
      Clothing: <Shirt className="w-4 h-4" />,
      Building: <Building2 className="w-4 h-4" />,
      Appliances: <Zap className="w-4 h-4" />,
      Architecture: <Mountain className="w-4 h-4" />,
      Safety: <HardHat className="w-4 h-4" />,
      Industry: <Factory className="w-4 h-4" />,
      'Space Technology': <Globe className="w-4 h-4" />,
    };
    return categoryMap[category] || <Lightbulb className="w-4 h-4" />;
  };

  // Now we can check for empty data and return early (after all hooks are called)
  if (!applicationsData || applicationsData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 md:p-8 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('conduction.practice.ui.noQuestionsTitle')}</h2>
          <p className="text-gray-600">{t('conduction.practice.ui.noQuestionsBody')}</p>
        </div>
      </div>
    );
  }

  const applications: Application[] = applicationsData.map((app: Application) => ({
    ...app,
    icon: getCategoryIcon(app.category),
  }));

  const filteredApplications = selectedCategory === 'all' ? applications : applications.filter((app) => app.category === selectedCategory);

  const toggleExpand = (id: number) => {
    setExpandedApp(expandedApp === id ? null : id);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'everyday':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'industrial':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    return t(`conduction.realWorld.difficulty.${difficulty}` as any) || difficulty;
  };

  // Layout + visual style adapted to match Ch3_3.4 RealWorldApplications
  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-teal-50 via-purple-50 to-teal-50">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Filter / summary panel styled as a top card */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-teal-100 animate-fade-in">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            {t('conduction.realWorld.filterTitle')}
          </h3>
          <div className="flex flex-wrap gap-3 mb-3">
            {categories.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2 transition-all duration-200 ${
                  selectedCategory === key
                    ? 'bg-gradient-to-r from-teal-500 to-purple-500 text-white shadow-md scale-105'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {key !== 'all' && getCategoryIcon(label)}
                {label}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-600">
            {t('conduction.realWorld.showing')}{' '}
            <strong>{filteredApplications.length}</strong>{' '}
            {filteredApplications.length !== 1
              ? t('conduction.realWorld.applicationsPlural')
              : t('conduction.realWorld.application')}
          </p>
        </div>

        {/* Applications grid – cards visually similar to Ch3_3.4 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApplications.map((app, index) => {
            const isExpanded = expandedApp === app.id;

            return (
              <div
                key={app.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Header strip with icon and title */}
                <button
                  type="button"
                  onClick={() => toggleExpand(app.id)}
                  className="w-full text-left"
                >
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-indigo-50">
                        {app.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{app.title}</h3>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                          <span className="px-2 py-0.5 rounded-full bg-white/15 text-white flex items-center gap-1">
                            {getCategoryIcon(app.category)}
                            {t(`conduction.realWorld.categories.${app.category}` as any) || app.category}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full border text-[11px] font-semibold bg-white/10 text-white ${getDifficultyColor(
                              app.difficulty
                            )}`}
                          >
                            {getDifficultyLabel(app.difficulty)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-6 h-6 text-white" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-white" />
                    )}
                  </div>
                </button>

                {/* Compact summary section always visible */}
                <div className="p-5 border-t border-gray-100">
                  <p className="text-gray-600 text-sm mb-3">{app.description}</p>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    {t('conduction.realWorld.realLifeExample')}
                  </p>
                  <p className="text-gray-800 text-sm italic">{app.realExample}</p>
                </div>

                {/* Detailed section toggled by expand, styled in soft blocks */}
                {isExpanded && (
                  <div className="px-5 pb-5 space-y-4 border-t border-gray-100 bg-gradient-to-br from-gray-50 via-purple-50/30 to-teal-50/40">
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
                      <h4 className="font-bold text-blue-900 mb-2 text-sm flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        {t('conduction.realWorld.howItWorks')}
                      </h4>
                      <p className="text-gray-700 text-sm leading-relaxed">{app.howItWorks}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                        <h4 className="font-bold text-green-900 mb-2 text-sm flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          {t('conduction.realWorld.goodConductorUsed')}
                        </h4>
                        <p className="text-gray-800 text-sm font-medium">{app.conductor}</p>
                      </div>

                      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-4 border border-red-200">
                        <h4 className="font-bold text-red-900 mb-2 text-sm flex items-center gap-2">
                          <Flame className="w-4 h-4" />
                          {t('conduction.realWorld.insulatorUsed')}
                        </h4>
                        <p className="text-gray-800 text-sm font-medium">{app.insulator}</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                      <h4 className="font-bold text-purple-900 mb-2 text-sm flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        {t('conduction.realWorld.scienceBehind')}
                      </h4>
                      <p className="text-gray-700 text-sm leading-relaxed">{app.scienceBehind}</p>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-indigo-200 shadow-sm">
                      <h4 className="font-bold text-indigo-900 mb-2 text-sm flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        {t('conduction.realWorld.benefitsImpact')}
                      </h4>
                      <ul className="space-y-1.5">
                        {app.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <span className="mt-0.5 text-indigo-500">
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                            <span className="text-gray-700 flex-1">{benefit}</span>
                          </li>
                        ))}
                      </ul>
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

export default RealWorldApplications;


