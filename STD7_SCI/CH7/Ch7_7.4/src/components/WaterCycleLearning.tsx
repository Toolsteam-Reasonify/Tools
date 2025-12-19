import React, { useState, useEffect, useRef, createContext, useContext, ReactNode, useMemo } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, RotateCcw, Droplets, ChevronDown, ChevronUp, Sparkles, Info, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

type StepMode = 'learn' | 'practice' | 'real_world';

type LearnStage = 'overview' | 'evaporation' | 'condensation' | 'precipitation' | 'collection' | 'complete';

type LearnActiveElement = 'sun' | 'water' | 'vapor' | 'clouds' | 'rain' | 'ground' | 'all';

type PracticeQuestionType = 'sequence' | 'single';

interface BaseStep {
  id: number;
  title: string;
  description: string;
  mode: StepMode;
}

interface LearnStep extends BaseStep {
  mode: 'learn';
  type: 'intro' | 'explanation';
  data: {
    stage: LearnStage;
    activeElements?: LearnActiveElement[];
  };
}

interface PracticeChoiceData {
  question: string;
  answer: string;
  options: string[];
  type?: PracticeQuestionType;
}

interface PracticeSequenceData {
  question: string;
  answer: string[];
  type: 'sequence';
}

type PracticeData = PracticeChoiceData | PracticeSequenceData;

interface PracticeStep extends BaseStep {
  mode: 'practice';
  type: 'intro' | 'practice';
  data: PracticeData;
}

type RealWorldExample = 'clothes' | 'dew' | 'harvesting' | 'ice-stupa';

interface RealWorldStep extends BaseStep {
  mode: 'real_world';
  type: 'real_world';
  data: {
    example: RealWorldExample;
    image: string;
    relatedStage: LearnStage;
  };
}

type Step = LearnStep | PracticeStep | RealWorldStep;

// ============================================================================
// Language Context (inline)
// ============================================================================
type Language = 'en' | 'hi' | 'gu';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, options?: Record<string, unknown>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const initialLanguage = (i18n.language?.split('-')[0] as Language) || 'en';
  const [language, setLanguageState] = useState<Language>(initialLanguage);

  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      const base = (lng?.split('-')[0] as Language) || 'en';
      setLanguageState(base);
    };
    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, []);

  const handleSetLanguage = (lang: Language) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

// ============================================================================
// Language Selector Component (inline)
// ============================================================================
const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'en', name: t('language.en'), flag: '🇬🇧' },
    { code: 'hi', name: t('language.hi'), flag: '🇮🇳' },
    { code: 'gu', name: t('language.gu'), flag: '🇮🇳' },
  ];

  return (
    <div className="relative">
      <select
        aria-label={t('language.selectorLabel')}
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="appearance-none bg-white border-2 border-teal-500 rounded-lg px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 pr-6 sm:pr-8 text-xs sm:text-sm md:text-base text-teal-700 font-medium cursor-pointer hover:border-purple-500 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-300"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 sm:px-2">
        <svg className="fill-current h-3 w-3 sm:h-4 sm:w-4 text-teal-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};

const DEFAULT_STEPS: Step[] = [
  {
    id: 1,
    title: 'What is the Water Cycle?',
    description:
      "The water cycle is the continuous movement of water on, above, and below the Earth's surface. Water moves upward as water vapor through evaporation and downward through precipitation (rain, snow, hail), passing through soil, rocks, and plants, and finally returning to water bodies.",
    type: 'intro',
    mode: 'learn',
    data: { stage: 'overview' },
  },
  {
    id: 2,
    title: 'Evaporation: Water Rises',
    description:
      "When the Sun heats water in oceans, rivers, and lakes, it evaporates and becomes water vapor. The Sun's radiation provides the energy needed to convert liquid water into gas. Water also evaporates from trees and plants through a process called transpiration.",
    type: 'explanation',
    mode: 'learn',
    data: { stage: 'evaporation', activeElements: ['sun', 'water', 'vapor'] },
  },
  {
    id: 3,
    title: 'Condensation: Clouds Form',
    description:
      'As water vapor rises up into the atmosphere, it cools down. When it cools enough, the water vapor condenses into tiny water droplets, forming clouds. This process is called condensation.',
    type: 'explanation',
    mode: 'learn',
    data: { stage: 'condensation', activeElements: ['vapor', 'clouds'] },
  },
  {
    id: 4,
    title: 'Precipitation: Rain Falls',
    description:
      'When clouds become heavy with water droplets, they release the water back to Earth as precipitation - rain, snow, or hail. This water falls on the surface, replenishing water bodies.',
    type: 'explanation',
    mode: 'learn',
    data: { stage: 'precipitation', activeElements: ['clouds', 'rain', 'water'] },
  },
  {
    id: 5,
    title: 'Collection & Infiltration',
    description:
      'Rainwater that falls on Earth either flows into ponds, lakes, rivers, and oceans, or seeps into the ground through infiltration. Water that infiltrates gets stored as groundwater in underground layers called aquifers.',
    type: 'explanation',
    mode: 'learn',
    data: { stage: 'collection', activeElements: ['rain', 'ground', 'water'] },
  },
  {
    id: 6,
    title: 'The Complete Cycle',
    description:
      'The water cycle helps redistribute and replenish water across Earth. It conserves the total amount of water on our planet through this continuous movement - evaporation, condensation, precipitation, and collection.',
    type: 'explanation',
    mode: 'learn',
    data: { stage: 'complete', activeElements: ['all'] },
  },
  {
    id: 7,
    title: 'Practice: Identify the Stages',
    description: "Let's test your understanding! Click on the correct part of the water cycle for each question.",
    type: 'intro',
    mode: 'practice',
    data: {
      question: 'Which process converts water from liquid to gas?',
      answer: 'evaporation',
      options: ['evaporation', 'condensation', 'precipitation', 'collection'],
    },
  },
  {
    id: 8,
    title: 'Practice: Condensation',
    description: 'Great! Now identify the next stage.',
    type: 'practice',
    mode: 'practice',
    data: {
      question: 'What happens when water vapor cools down in the atmosphere?',
      answer: 'condensation',
      options: ['evaporation', 'condensation', 'precipitation', 'infiltration'],
    },
  },
  {
    id: 9,
    title: 'Practice: Precipitation',
    description: 'Excellent progress! One more question.',
    type: 'practice',
    mode: 'practice',
    data: {
      question: 'What do we call it when water falls from clouds as rain, snow, or hail?',
      answer: 'precipitation',
      options: ['evaporation', 'transpiration', 'precipitation', 'condensation'],
    },
  },
  {
    id: 10,
    title: 'Practice: Complete the Cycle',
    description: 'Final challenge! Arrange the stages in the correct order.',
    type: 'practice',
    mode: 'practice',
    data: {
      question: 'Arrange the water cycle stages in order:',
      answer: ['evaporation', 'condensation', 'precipitation', 'collection'],
      type: 'sequence',
    },
  },
  {
    id: 11,
    title: 'Real World: Drying Clothes',
    description:
      "Have you noticed wet clothes drying faster on sunny days? The Sun's heat causes water in the clothes to evaporate faster. This is the same evaporation process that happens in the water cycle! The Sun provides the energy needed to convert liquid water into water vapor.",
    type: 'real_world',
    mode: 'real_world',
    data: {
      example: 'clothes',
      image: 'clothes-drying',
      relatedStage: 'evaporation',
    },
  },
  {
    id: 12,
    title: 'Real World: Morning Dew',
    description:
      'Early morning dew on grass is water cycle in action! During the night, water vapor in the air cools down and condenses on cool surfaces like grass and leaves. This is the same condensation process that forms clouds in the sky.',
    type: 'real_world',
    mode: 'real_world',
    data: {
      example: 'dew',
      image: 'morning-dew',
      relatedStage: 'condensation',
    },
  },
  {
    id: 13,
    title: 'Real World: Rainwater Harvesting',
    description:
      'In many parts of India, people collect rainwater using harvesting systems. This harvested water seeps into the ground, replenishing groundwater in aquifers. This demonstrates the collection and infiltration stage of the water cycle, helping ensure sustainable water supply.',
    type: 'real_world',
    mode: 'real_world',
    data: {
      example: 'harvesting',
      image: 'rainwater-harvest',
      relatedStage: 'collection',
    },
  },
  {
    id: 14,
    title: 'Real World: Ice Stupas in Ladakh',
    description:
      'In Ladakh, people create ice stupas - tall cone-shaped ice structures - by spraying water into cold air during winter. The water freezes layer by layer. In spring, these stupas melt slowly, providing water for farming. This innovative technique uses the water cycle principles of freezing (precipitation) and melting to solve water scarcity.',
    type: 'real_world',
    mode: 'real_world',
    data: {
      example: 'ice-stupa',
      image: 'ice-stupa',
      relatedStage: 'complete',
    },
  },
];

interface RealWorldApplication {
  id: number;
  title: string;
  category: string;
  description: string;
  howItWorks: string;
  scienceBehind: string;
  realExample: string;
  benefits: string[];
  relatedStage: LearnStage;
  example: RealWorldExample;
}

// Transform RealWorldStep to RealWorldApplication format
const transformToApplication = (step: RealWorldStep, t: (key: string) => string): RealWorldApplication => {
  const appData = t(`waterCycle.realWorld.applications.${step.data.example}`, { returnObjects: true }) as any;
  
  return {
    id: step.id,
    title: step.title.replace('Real World: ', ''),
    description: step.description,
    relatedStage: step.data.relatedStage,
    example: step.data.example,
    category: appData?.category || 'Everyday',
    howItWorks: appData?.howItWorks || '',
    scienceBehind: appData?.scienceBehind || '',
    realExample: appData?.realExample || '',
    benefits: appData?.benefits || []
  };
};

const RealWorldApplicationsView: React.FC<{ steps: RealWorldStep[] }> = ({ steps }) => {
  const { t } = useLanguage();
  const [expandedApp, setExpandedApp] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const applications = useMemo(() => steps.map(step => transformToApplication(step, t)), [steps, t]);
  const categories = ['all', 'everyday', 'nature', 'technology'];
  
  const filteredApplications = selectedCategory === 'all' 
    ? applications 
    : applications.filter(app => app.category.toLowerCase() === selectedCategory);

  const toggleExpand = (id: number) => {
    setExpandedApp(expandedApp === id ? null : id);
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Everyday': 'border-teal-300 bg-teal-50',
      'Nature': 'border-green-300 bg-green-50',
      'Technology': 'border-purple-300 bg-purple-50'
    };
    return colors[category] || 'border-gray-300 bg-gray-50';
  };

  return (
    <div className="space-y-6">
      {/* Filter / summary panel */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-teal-100 animate-fade-in">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-teal-600" />
          {t('waterCycle.realWorld.ui.filterByCategory')}
        </h3>
        <div className="flex flex-wrap gap-3 mb-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-teal-500 to-purple-500 text-white shadow-md scale-105'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {t(`waterCycle.realWorld.ui.categories.${category}`)}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-600">
          {t('waterCycle.realWorld.ui.showing')} <strong>{filteredApplications.length}</strong>{' '}
          {filteredApplications.length !== 1 ? t('waterCycle.realWorld.ui.applications') : t('waterCycle.realWorld.ui.application')}
        </p>
      </div>

      {/* Applications grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApplications.map((app, index) => {
          const isExpanded = expandedApp === app.id;

          return (
            <div
              key={app.id}
              className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 animate-fade-in ${getCategoryColor(app.category)}`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Header strip with icon and title */}
              <button
                type="button"
                onClick={() => toggleExpand(app.id)}
                className="w-full text-left"
              >
                <div className="bg-gradient-to-r from-teal-500 via-purple-500 to-teal-500 p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white text-2xl">
                      {app.example === 'clothes' && '👔'}
                      {app.example === 'dew' && '💧'}
                      {app.example === 'harvesting' && '🏠'}
                      {app.example === 'ice-stupa' && '❄️'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-white mb-1">{app.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="px-2 py-0.5 rounded-full bg-white/15 text-white">
                          {app.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-white/10 text-white text-[11px] font-semibold">
                          {app.relatedStage}
                        </span>
                      </div>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-6 h-6 text-white flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-white flex-shrink-0" />
                  )}
                </div>
              </button>

              {/* Compact summary section always visible */}
              <div className="p-5 border-t border-gray-100">
                <p className="text-gray-600 text-sm mb-3">{app.description}</p>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  {t('waterCycle.realWorld.ui.realLifeExample')}
                </p>
                <p className="text-gray-800 text-sm italic">{app.realExample}</p>
              </div>

              {/* Detailed section toggled by expand */}
              {isExpanded && (
                <div className="px-5 pb-5 space-y-4 border-t border-gray-100 bg-gradient-to-br from-gray-50 via-purple-50/30 to-teal-50/40">
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
                    <h4 className="font-bold text-blue-900 mb-2 text-sm flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      {t('waterCycle.realWorld.ui.howItWorks')}
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{app.howItWorks}</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                    <h4 className="font-bold text-purple-900 mb-2 text-sm flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      {t('waterCycle.realWorld.ui.scienceBehind')}
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{app.scienceBehind}</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-indigo-200 shadow-sm">
                    <h4 className="font-bold text-indigo-900 mb-2 text-sm flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      {t('waterCycle.realWorld.ui.benefits')}
                    </h4>
                    <ul className="space-y-1.5">
                      {app.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
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
  );
};

interface WaterCycleLearningProps {
  width?: number;
  height?: number;
  steps?: Step[];
  mode: 'learn' | 'practice' | 'applications';
  setMode: (mode: 'learn' | 'practice' | 'applications') => void;
}

const WaterCycleLearning: React.FC<WaterCycleLearningProps> = ({
  width = 800,
  height = 600,
  steps: propSteps,
  mode,
  setMode,
}) => {
  const { t, language } = useLanguage();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  // Map 'applications' to 'real_world' for internal use
  const selectedMode: StepMode = mode === 'applications' ? 'real_world' : mode;

  // Build steps from translations
  const steps: Step[] = useMemo(() => {
    if (propSteps) return propSteps;
    
    try {
      const learnSteps = t('waterCycle.learn.steps', { returnObjects: true }) as any[];
      const practiceSteps = t('waterCycle.practice.steps', { returnObjects: true }) as any[];
      const realWorldSteps = t('waterCycle.realWorld.steps', { returnObjects: true }) as any[];

      const allSteps: Step[] = [
        ...(Array.isArray(learnSteps) && learnSteps.length > 0 ? learnSteps.map((step, idx) => ({
          id: step.id || idx + 1,
          title: step.title,
          description: step.description,
          type: (idx === 0 ? 'intro' : 'explanation') as 'intro' | 'explanation',
          mode: 'learn' as const,
          data: {
            stage: (['overview', 'evaporation', 'condensation', 'precipitation', 'collection', 'complete'][idx] || 'overview') as LearnStage,
            activeElements: idx === 1 ? ['sun', 'water', 'vapor'] : idx === 2 ? ['vapor', 'clouds'] : idx === 3 ? ['clouds', 'rain', 'water'] : idx === 4 ? ['rain', 'ground', 'water'] : idx === 5 ? ['all'] : undefined
          }
        }) : []),
        ...(Array.isArray(practiceSteps) && practiceSteps.length > 0 ? practiceSteps.map((step, idx) => ({
          id: step.id || idx + 7,
          title: step.title,
          description: step.description,
          type: (idx === 0 ? 'intro' : 'practice') as 'intro' | 'practice',
          mode: 'practice' as const,
          data: {
            question: step.question,
            answer: step.answer,
            options: step.options,
            type: step.type || 'single'
          }
        }) : []),
        ...(Array.isArray(realWorldSteps) && realWorldSteps.length > 0 ? realWorldSteps.map((step, idx) => ({
          id: step.id || idx + 11,
          title: step.title,
          description: step.description,
          type: 'real_world' as const,
          mode: 'real_world' as const,
          data: {
            example: (['clothes', 'dew', 'harvesting', 'ice-stupa'][idx] || 'clothes') as RealWorldExample,
            image: (['clothes-drying', 'morning-dew', 'rainwater-harvest', 'ice-stupa'][idx] || 'clothes-drying'),
            relatedStage: (['evaporation', 'condensation', 'collection', 'complete'][idx] || 'evaporation') as LearnStage
          }
        }) : [])
      ];

      return allSteps.length > 0 ? allSteps : DEFAULT_STEPS;
    } catch {
      return DEFAULT_STEPS;
    }
  }, [t, propSteps]);
  const [practiceAnswer, setPracticeAnswer] = useState<string | null>(null);
  const [sequenceOrder, setSequenceOrder] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const isSequenceData = (data: PracticeData): data is PracticeSequenceData =>
    Array.isArray(data.answer);

  const isChoiceData = (data: PracticeData): data is PracticeChoiceData =>
    !Array.isArray(data.answer);

  const modeSteps = useMemo(() => steps.filter((step) => step.mode === selectedMode), [steps, selectedMode]);
  const currentStep = modeSteps[currentStepIndex];
  
  // Get translated step data
  const translatedStep = useMemo(() => {
    if (!currentStep) return null;
    
    if (currentStep.mode === 'learn') {
      const learnSteps = t('waterCycle.learn.steps', { returnObjects: true }) as any[];
      const stepData = learnSteps?.find((s: any) => s.id === currentStep.id) || currentStep;
      return { ...currentStep, title: stepData.title, description: stepData.description };
    } else if (currentStep.mode === 'practice') {
      const practiceSteps = t('waterCycle.practice.steps', { returnObjects: true }) as any[];
      const stepData = practiceSteps?.find((s: any) => s.id === currentStep.id) || currentStep;
      return {
        ...currentStep,
        title: stepData.title,
        description: stepData.description,
        data: {
          ...currentStep.data,
          question: stepData.question || (currentStep.data as PracticeChoiceData).question,
          options: stepData.options || (currentStep.data as PracticeChoiceData).options,
          answer: stepData.answer || (currentStep.data as PracticeChoiceData).answer
        }
      };
    } else {
      const realWorldSteps = t('waterCycle.realWorld.steps', { returnObjects: true }) as any[];
      const stepData = realWorldSteps?.find((s: any) => s.id === currentStep.id) || currentStep;
      return { ...currentStep, title: stepData.title, description: stepData.description };
    }
  }, [currentStep, t]);
  
  const displayStep = translatedStep || currentStep;

  useEffect(() => {
    if (!isPlaying || selectedMode === 'practice') return;
    const timer = window.setTimeout(() => {
      if (currentStepIndex < modeSteps.length - 1) {
        setCurrentStepIndex((prev) => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, 8000);
    return () => window.clearTimeout(timer);
  }, [isPlaying, currentStepIndex, modeSteps.length, selectedMode]);

  useEffect(() => {
    if (selectedMode !== 'learn') return;

    const animate = () => {
      setAnimationProgress((prev) => (prev + 0.01) % 1);
      animationFrameRef.current = window.requestAnimationFrame(animate);
    };

    animationFrameRef.current = window.requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [selectedMode]);

  useEffect(() => {
    if (selectedMode !== 'learn' || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const stage =
      displayStep && displayStep.mode === 'learn'
        ? displayStep.data.stage
        : 'overview';
    const activeElements =
      displayStep && displayStep.mode === 'learn' && displayStep.data.activeElements
        ? displayStep.data.activeElements
        : [];

    drawWaterCycle(ctx, width, height, stage, activeElements, animationProgress, t);
  }, [displayStep, animationProgress, width, height, selectedMode, t]);

  const nextStep = () => {
    if (currentStepIndex < modeSteps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setPracticeAnswer(null);
      setShowFeedback(false);
      setSequenceOrder([]);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setPracticeAnswer(null);
      setShowFeedback(false);
      setSequenceOrder([]);
    }
  };

  const resetMode = () => {
    setCurrentStepIndex(0);
    setPracticeAnswer(null);
    setShowFeedback(false);
    setSequenceOrder([]);
  };

  const handleModeChange = (newMode: 'learn' | 'practice' | 'applications') => {
    setMode(newMode);
    setCurrentStepIndex(0);
    setPracticeAnswer(null);
    setShowFeedback(false);
    setSequenceOrder([]);
    setIsPlaying(newMode !== 'practice');
  };

  const handlePracticeAnswer = (answer: string) => {
    if (!displayStep || displayStep.mode !== 'practice') return;
    const data = displayStep.data;
    if (isChoiceData(data)) {
      setPracticeAnswer(answer);
      setShowFeedback(true);
      const isCorrect = answer === data.answer;
      if (isCorrect) {
        window.setTimeout(() => {
          if (currentStepIndex < modeSteps.length - 1) {
            nextStep();
          }
        }, 2000);
      }
    }
  };

  const handleSequenceSelection = (item: string) => {
    setSequenceOrder((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  };

  const checkSequence = () => {
    if (!displayStep || displayStep.mode !== 'practice') return;
    const data = displayStep.data;
    if (isSequenceData(data)) {
      const correctOrder = data.answer;
      const isCorrect = JSON.stringify(sequenceOrder) === JSON.stringify(correctOrder);
      setShowFeedback(true);
      setPracticeAnswer(isCorrect ? 'correct' : 'incorrect');
      if (isCorrect) {
        window.setTimeout(() => {
          if (currentStepIndex < modeSteps.length - 1) {
            nextStep();
          }
        }, 2000);
      }
    }
  };

  const isLearn = mode === 'learn';
  const isPractice = mode === 'practice';
  const isApplications = mode === 'applications';

  // For Real World mode, we don't need currentStep
  if (selectedMode === 'real_world') {
    // Render Real World Applications view
  } else if (!currentStep) {
    return null;
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Navbar - matching Ch7_7.1 style */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-teal-50 via-purple-50 to-teal-50 border-b border-teal-200/50 shadow-sm backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo / title */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <Droplets className="w-6 h-6 text-teal-600" aria-hidden="true" />
              <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent">
                {t('nav.logo')}
              </span>
            </div>

            {/* Primary navigation actions */}
            <div className="flex items-center space-x-1 md:space-x-2">
              {/* Learn button */}
              <button
                type="button"
                onClick={() => handleModeChange('learn')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isLearn
                    ? 'bg-teal-500 text-white shadow-md'
                    : 'text-teal-700 hover:bg-teal-100/50'
                }`}
              >
                <span className="hidden sm:inline">📚 </span>
                <span className="sm:hidden">📚</span>
                <span className="hidden md:inline ml-1">{t('nav.tabs.learn')}</span>
              </button>

              {/* Practice button */}
              <button
                type="button"
                onClick={() => handleModeChange('practice')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isPractice
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'text-purple-700 hover:bg-purple-100/50'
                }`}
              >
                <span className="hidden sm:inline">🎯 </span>
                <span className="sm:hidden">🎯</span>
                <span className="hidden md:inline ml-1">{t('nav.tabs.practice')}</span>
              </button>

              {/* Real-world applications button */}
              <button
                type="button"
                onClick={() => handleModeChange('applications')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isApplications
                    ? 'bg-gradient-to-r from-teal-500 to-purple-500 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100/50'
                }`}
              >
                <span className="hidden sm:inline">🌍 </span>
                <span className="sm:hidden">🌍</span>
                <span className="hidden lg:inline ml-1">{t('nav.tabs.applications')}</span>
              </button>

              {/* Language selector */}
              <div className="ml-2 md:ml-4">
                <LanguageSelector />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in">
        {/* Content header - only show for learn and practice modes */}
        {selectedMode !== 'real_world' && displayStep && (
          <div className="bg-gradient-to-r from-teal-500 via-purple-500 to-teal-500 text-white p-4 sm:p-6">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <h2 className="text-xl sm:text-2xl font-semibold">{displayStep.title}</h2>
              <div className="text-sm bg-white/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full backdrop-blur-sm">
                {t('waterCycle.controls.step')} {currentStepIndex + 1} {t('waterCycle.controls.of')} {modeSteps.length}
              </div>
            </div>
          </div>
        )}

        <div className="p-4 sm:p-6 md:p-8">
          {selectedMode === 'learn' && (
            <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl shadow-lg p-4 sm:p-6 mb-6">
              <canvas
                ref={canvasRef}
                width={width}
                height={height}
                className="w-full border-2 border-teal-200 rounded-lg"
              />
            </div>
          )}

          {selectedMode === 'practice' && displayStep && displayStep.mode === 'practice' && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg p-6 sm:p-8 mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-purple-900 mb-6">
                {displayStep.data.question}
              </h3>

            {displayStep && isSequenceData(displayStep.data) ? (
              <div>
                <div className="mb-6">
                  <h4 className="font-semibold text-lg mb-3 text-gray-700">
                    {t('waterCycle.practice.ui.availableOptions')}
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {displayStep.data.answer.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleSequenceSelection(option)}
                        disabled={sequenceOrder.includes(option)}
                        className={`px-4 sm:px-6 py-3 sm:py-4 rounded-lg font-semibold transition-all ${
                          sequenceOrder.includes(option)
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:scale-105'
                        }`}
                      >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-lg mb-3 text-gray-700">{t('waterCycle.practice.ui.yourOrder')}</h4>
                  <div className="flex gap-2 min-h-[60px] p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    {sequenceOrder.map((item, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold flex items-center gap-2"
                      >
                        {index + 1}. {item.charAt(0).toUpperCase() + item.slice(1)}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={checkSequence}
                  disabled={displayStep && sequenceOrder.length !== (displayStep.data as PracticeSequenceData).answer.length}
                  className={`w-full py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg transition-all ${
                    displayStep && sequenceOrder.length === (displayStep.data as PracticeSequenceData).answer.length
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
{t('waterCycle.practice.ui.checkAnswer')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {displayStep && isChoiceData(displayStep.data) &&
                  displayStep.data.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handlePracticeAnswer(option)}
                      disabled={practiceAnswer !== null}
                      className={`px-6 py-4 rounded-xl font-semibold text-lg transition-all ${
                        practiceAnswer === option
                          ? option === displayStep.data.answer
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg scale-105'
                            : 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg'
                          : practiceAnswer !== null
                          ? 'bg-gray-200 text-gray-400'
                          : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:scale-105'
                      }`}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </button>
                  ))}
              </div>
            )}

            {showFeedback && displayStep && (
              <div
                className={`mt-6 p-4 rounded-lg text-center font-semibold ${
                  practiceAnswer === 'correct' ||
                  (displayStep.mode === 'practice' &&
                    isChoiceData(displayStep.data) &&
                    practiceAnswer === displayStep.data.answer)
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {practiceAnswer === 'correct' ||
                (displayStep.mode === 'practice' &&
                  isChoiceData(displayStep.data) &&
                  practiceAnswer === displayStep.data.answer)
                  ? t('waterCycle.practice.ui.correct')
                  : t('waterCycle.practice.ui.tryAgain')}
              </div>
            )}
          </div>
        )}

          {selectedMode === 'real_world' ? (
            <RealWorldApplicationsView steps={steps.filter(s => s.mode === 'real_world') as RealWorldStep[]} />
          ) : displayStep && (
            <>
              <div className="bg-gradient-to-r from-teal-50 via-purple-50 to-teal-50 rounded-xl p-4 sm:p-6 mb-6 border-l-4 border-teal-500">
                <p className="text-gray-800 text-base sm:text-lg leading-relaxed">{displayStep.description}</p>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <button
              onClick={prevStep}
              disabled={currentStepIndex === 0}
              className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-all w-full sm:w-auto"
            >
              <ChevronLeft className="w-5 h-5" />
              {t('waterCycle.controls.previous')}
            </button>

            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              {selectedMode === 'learn' && (
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-teal-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex-1 sm:flex-none"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-5 h-5" />
                      {t('waterCycle.controls.pause')}
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      {t('waterCycle.controls.play')}
                    </>
                  )}
                </button>
              )}

              <button
                onClick={resetMode}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all flex-1 sm:flex-none"
              >
                <RotateCcw className="w-5 h-5" />
                {t('waterCycle.controls.reset')}
              </button>
            </div>

            <button
              onClick={nextStep}
              disabled={currentStepIndex === modeSteps.length - 1}
              className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-teal-600 to-purple-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all w-full sm:w-auto"
            >
              {t('waterCycle.controls.next')}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

              <div className="mt-6">
                <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-600 via-purple-600 to-teal-600 transition-all duration-300 rounded-full"
                    style={{ width: `${((currentStepIndex + 1) / modeSteps.length) * 100}%` }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

function drawWaterCycle(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  stage: LearnStage,
  activeElements: LearnActiveElement[],
  progress: number,
  t: (key: string) => string,
) {
  const waterY = height * 0.7;

  const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
  skyGradient.addColorStop(0, '#87CEEB');
  skyGradient.addColorStop(1, '#E0F6FF');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, width, height * 0.6);

  const groundGradient = ctx.createLinearGradient(0, height * 0.6, 0, height);
  groundGradient.addColorStop(0, '#90EE90');
  groundGradient.addColorStop(0.5, '#8FBC8F');
  groundGradient.addColorStop(1, '#654321');
  ctx.fillStyle = groundGradient;
  ctx.fillRect(0, height * 0.6, width, height * 0.4);

  if (activeElements.includes('sun') || activeElements.includes('all')) {
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(width * 0.15, height * 0.15, 40, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI * 2) / 12 + progress * Math.PI * 2;
      const x1 = width * 0.15 + Math.cos(angle) * 50;
      const y1 = height * 0.15 + Math.sin(angle) * 50;
      const x2 = width * 0.15 + Math.cos(angle) * 65;
      const y2 = height * 0.15 + Math.sin(angle) * 65;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }

  ctx.fillStyle = '#4682B4';
  ctx.beginPath();
  ctx.ellipse(width * 0.3, waterY, width * 0.25, 40, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#8B7355';
  ctx.beginPath();
  ctx.moveTo(width * 0.7, height * 0.6);
  ctx.lineTo(width * 0.8, height * 0.3);
  ctx.lineTo(width * 0.9, height * 0.6);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(width * 0.75, height * 0.35);
  ctx.lineTo(width * 0.8, height * 0.3);
  ctx.lineTo(width * 0.85, height * 0.35);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#8B4513';
  ctx.fillRect(width * 0.55, height * 0.5, 15, 60);
  ctx.fillStyle = '#228B22';
  ctx.beginPath();
  ctx.arc(width * 0.5625, height * 0.48, 30, 0, Math.PI * 2);
  ctx.fill();

  if ((activeElements.includes('vapor') || activeElements.includes('all')) && (stage === 'evaporation' || stage === 'complete')) {
    drawAnimatedArrow(ctx, width * 0.3, waterY - 20, width * 0.35, height * 0.4, '#00CED1', progress);
    drawAnimatedArrow(ctx, width * 0.25, waterY - 20, width * 0.3, height * 0.45, '#00CED1', progress + 0.3);

    for (let i = 0; i < 5; i++) {
      const x = width * 0.25 + i * 20 + Math.sin(progress * Math.PI * 2 + i) * 10;
      const y = height * 0.5 - progress * 100 - i * 15;
      ctx.fillStyle = `rgba(0, 206, 209, ${0.6 - progress})`;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (
    (activeElements.includes('clouds') || activeElements.includes('all')) &&
    (stage === 'condensation' || stage === 'precipitation' || stage === 'complete')
  ) {
    drawCloud(ctx, width * 0.4, height * 0.25, 80);
    drawCloud(ctx, width * 0.6, height * 0.2, 100);
  }

  if (
    (activeElements.includes('rain') || activeElements.includes('all')) &&
    (stage === 'precipitation' || stage === 'collection' || stage === 'complete')
  ) {
    ctx.strokeStyle = '#4682B4';
    ctx.lineWidth = 2;
    for (let i = 0; i < 15; i++) {
      const x = width * 0.35 + i * 20 + Math.sin(progress * Math.PI * 2 + i) * 5;
      const y1 = height * 0.35 + ((progress * 200 + i * 10) % 200);
      const y2 = y1 + 15;
      ctx.beginPath();
      ctx.moveTo(x, y1);
      ctx.lineTo(x, y2);
      ctx.stroke();
    }
  }

  if (
    (activeElements.includes('ground') || activeElements.includes('all')) &&
    (stage === 'collection' || stage === 'complete')
  ) {
    drawAnimatedArrow(ctx, width * 0.4, height * 0.65, width * 0.4, height * 0.85, '#4169E1', progress);
    ctx.fillStyle = 'rgba(70, 130, 180, 0.5)';
    ctx.fillRect(width * 0.35, height * 0.85, width * 0.3, 30);
  }

  ctx.fillStyle = '#000000';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';

  if (stage === 'evaporation' || stage === 'complete') {
    ctx.fillText(t('waterCycle.learn.canvas.evaporation'), width * 0.3, height * 0.55);
  }
  if (stage === 'condensation' || stage === 'complete') {
    ctx.fillText(t('waterCycle.learn.canvas.condensation'), width * 0.5, height * 0.15);
  }
  if (stage === 'precipitation' || stage === 'complete') {
    ctx.fillText(t('waterCycle.learn.canvas.precipitation'), width * 0.5, height * 0.4);
  }
  if (stage === 'collection' || stage === 'complete') {
    ctx.fillText(t('waterCycle.learn.canvas.collection'), width * 0.5, height * 0.73);
    ctx.fillText(t('waterCycle.learn.canvas.infiltration'), width * 0.5, height * 0.95);
  }
}

function drawAnimatedArrow(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  color: string,
  progress: number,
) {
  const animatedProgress = progress % 1;
  const currentX = fromX + (toX - fromX) * animatedProgress;
  const currentY = fromY + (toY - fromY) * animatedProgress;

  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(currentX, currentY);
  ctx.stroke();

  const angle = Math.atan2(toY - fromY, toX - fromX);
  const headLength = 15;

  ctx.beginPath();
  ctx.moveTo(currentX, currentY);
  ctx.lineTo(
    currentX - headLength * Math.cos(angle - Math.PI / 6),
    currentY - headLength * Math.sin(angle - Math.PI / 6),
  );
  ctx.lineTo(
    currentX - headLength * Math.cos(angle + Math.PI / 6),
    currentY - headLength * Math.sin(angle + Math.PI / 6),
  );
  ctx.closePath();
  ctx.fill();
}

function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.fillStyle = '#FFFFFF';

  ctx.beginPath();
  ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x + size * 0.4, y - size * 0.1, size * 0.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x - size * 0.4, y - size * 0.1, size * 0.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x + size * 0.2, y + size * 0.2, size * 0.35, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x - size * 0.2, y + size * 0.2, size * 0.35, 0, Math.PI * 2);
  ctx.fill();
}


export default WaterCycleLearning;


