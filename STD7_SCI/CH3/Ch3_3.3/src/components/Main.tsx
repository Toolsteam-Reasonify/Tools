/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { CheckCircle, XCircle, ChevronRight, Lightbulb } from "lucide-react";
import i18n from '@/i18n';

// Type Definitions
export type Language = 'en' | 'hi' | 'gu';
export type Mode = 'demonstration' | 'practice' | 'assessment' | 'mixed';
export type StepType = 'explanation' | 'visualization' | 'interaction' | 'assessment';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

// Circuit component types
export interface CircuitComponent {
  id: string;
  type: 'cell' | 'battery' | 'lamp' | 'led' | 'switch' | 'wire' | 'conductor' | 'insulator';
  position: { x: number; y: number };
  connections: string[]; // IDs of connected components
  state?: 'on' | 'off' | 'open' | 'closed';
  polarity?: 'correct' | 'incorrect' | 'neutral';
}

// Step definition for demonstrations
export interface DemonstrationStep {
  step_number: number;
  title: string;
  description: string;
  type: StepType;
  visual_state: {
    components: CircuitComponent[];
    circuit_complete: boolean;
    current_flowing: boolean;
  };
  interactions?: {
    type: 'click' | 'drag' | 'input' | 'select';
    target: string;
    expectedValue?: any;
    hint?: string;
  }[];
  completion_criteria?: {
    type: 'automatic' | 'user_confirm' | 'assessment';
    condition?: any;
  };
  learning_notes?: string;
  common_mistakes?: string[];
}

// Practice exercise definition
export interface PracticeExercise {
  exercise_id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  problem_data: {
    circuit_setup: CircuitComponent[];
    question_type: 'build_circuit' | 'identify_component' | 'test_conductor' | 'troubleshoot';
    correct_solution: any;
  };
  solution: {
    correct_answer: any;
    solution_steps?: any[];
    multiple_solutions?: boolean;
  };
  interaction_config: {
    input_methods: string[];
    max_attempts?: number;
    hint_system?: boolean;
    progressive_hints?: string[];
  };
  assessment: {
    accuracy_weight: number;
    time_weight?: number;
    attempt_weight?: number;
  };
}

// Tool data from backend
export interface CircuitToolData {
  tool_type: string;
  session_id: string;
  mode: Mode;
  demonstration?: {
    steps: DemonstrationStep[];
    auto_progression: boolean;
    step_duration: number;
  };
  practice?: {
    exercises: PracticeExercise[];
    session_config: {
      max_exercises: number;
      difficulty_adaptation: boolean;
      immediate_feedback: boolean;
    };
  };
  student_context: {
    current_level: string;
    learning_preferences: string[];
    previous_performance?: {
      accuracy: number;
      avg_time: number;
      completed_exercises: number;
    };
  };
  metadata: {
    learning_objectives: string[];
    estimated_duration: number;
    prerequisite_skills: string[];
    difficulty_level: string;
  };
}

// UI Configuration
export interface CircuitUIConfig {
  theme: 'light' | 'dark' | 'modern' | 'playful';
  layout: 'standard' | 'compact' | 'immersive';
  auto_play: boolean;
  step_duration: number;
  show_controls: boolean;
  show_progress: boolean;
  hint_system: boolean;
  progressive_difficulty: boolean;
  immediate_feedback: boolean;
  celebration_animations: boolean;
  high_contrast: boolean;
  large_text: boolean;
  keyboard_navigation: boolean;
  screen_reader_support: boolean;
}

// Component props interface
export interface CircuitToolProps {
  data: CircuitToolData;
  title: string;
  ui_config: CircuitUIConfig;
  onStepChange?: (stepIndex: number, stepData: DemonstrationStep) => void;
  onPracticeComplete?: (results: PracticeResults) => void;
  onAssessmentSubmit?: (assessment: AssessmentData) => void;
  onProgress?: (progress: ProgressData) => void;
  onInterrupt?: () => void;
  onResume?: () => void;
  onReset?: () => void;
  currentStep?: number;
  isInterrupted?: boolean;
}

// Practice results tracking
export interface PracticeResults {
  exercise_id: string;
  student_answer: any;
  correct_answer: any;
  is_correct: boolean;
  attempts: number;
  time_taken: number;
  hints_used: number;
  confidence_level?: number;
  feedback: string;
}

// Assessment data
export interface AssessmentData {
  overall_score: number;
  accuracy: number;
  speed_score: number;
  understanding_indicators: {
    concept: string;
    mastery_level: number;
  }[];
  recommendations: string[];
}

// Progress tracking
export interface ProgressData {
  current_step: number;
  total_steps: number;
  completion_percentage: number;
  time_spent: number;
  exercises_completed: number;
  current_difficulty: string;
  mastery_indicators: {
    skill: string;
    level: number;
  }[];
}

interface Circuit {
  id: string;
  svg: JSX.Element;
  isCorrect: boolean;
}

interface PracticeQuestion {
  id: string;
  question: string;
  type: "diagram";
  circuits: Circuit[];
  correctAnswer: string;
  explanation: string;
  hint?: string;
}

interface ElectricalComponent {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
}

// Utility Functions
export const formatDate = (value: Date, locale: string) =>
  new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(value);

export const formatNumber = (value: number, locale: string) =>
  new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value);

export const formatCurrency = (value: number, locale: string) =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

// Contexts
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, options?: Record<string, unknown>) => string;
  formatDate: (value: Date) => string;
  formatNumber: (value: number) => string;
  formatCurrency: (value: number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { t, ready } = useTranslation();
  const initialLanguage = (i18n.language?.split('-')[0] as Language) || 'en';
  const [language, setLanguageState] = useState<Language>(initialLanguage);
  const [isReady, setIsReady] = useState(false);

  // Wait for i18n to be ready
  useEffect(() => {
    if (ready && i18n.isInitialized) {
      setIsReady(true);
    } else {
      // Fallback: check if i18n is initialized after a short delay
      const timer = setTimeout(() => {
        if (i18n.isInitialized) {
          setIsReady(true);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [ready]);

  useEffect(() => {
    if (!isReady) return;

    const handleLanguageChanged = (lng: string) => {
      try {
        const base = (lng?.split('-')[0] as Language) || 'en';
        setLanguageState(base);
      } catch (error) {
        console.error('Error handling language change:', error);
      }
    };

    if (i18n.isInitialized) {
      i18n.on('languageChanged', handleLanguageChanged);
      return () => {
        i18n.off('languageChanged', handleLanguageChanged);
      };
    }
  }, [isReady]);

  const handleSetLanguage = (lang: Language) => {
    try {
      if (i18n.isInitialized) {
        i18n.changeLanguage(lang).catch((error) => {
          console.error('Error changing language:', error);
        });
        // Safe localStorage access with error handling
        try {
          localStorage.setItem('i18nextLng', lang);
        } catch (storageError) {
          // Handle localStorage errors (e.g., quota exceeded, private browsing)
          console.warn('Could not save language preference to localStorage:', storageError);
        }
      }
    } catch (error) {
      console.error('Error setting language:', error);
    }
  };

  useEffect(() => {
    if (isReady) {
      document.documentElement.lang = language;
    }
  }, [language, isReady]);

  const helpers = useMemo(
    () => {
      const formatDateHelper = (value: Date) => {
        try {
          return formatDate(value, language);
        } catch (error) {
          console.error('Error formatting date:', error);
          return value.toLocaleDateString();
        }
      };
      const formatNumberHelper = (value: number) => {
        try {
          return formatNumber(value, language);
        } catch (error) {
          console.error('Error formatting number:', error);
          return value.toString();
        }
      };
      const formatCurrencyHelper = (value: number) => {
        try {
          return formatCurrency(value, language);
        } catch (error) {
          console.error('Error formatting currency:', error);
          return `₹${value}`;
        }
      };
      return {
        formatDate: formatDateHelper,
        formatNumber: formatNumberHelper,
        formatCurrency: formatCurrencyHelper,
      };
    },
    [language],
  );

  // Safe translation function with error handling
  const safeT = (key: string, options?: Record<string, unknown>) => {
    try {
      if (!isReady || !i18n.isInitialized) {
        return key;
      }
      return t(key, options);
    } catch (error) {
      console.error(`Translation error for key "${key}":`, error);
      return key;
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        t: safeT,
        ...helpers,
      }}
    >
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

interface ModeContextType {
  currentMode: Mode;
  setCurrentMode: (mode: Mode) => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export const ModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentMode, setCurrentMode] = useState<Mode>('demonstration');

  return (
    <ModeContext.Provider value={{ currentMode, setCurrentMode }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error('useMode must be used within ModeProvider');
  }
  return context;
};

// Components
export const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: "en", name: t("language.en"), flag: "🇬🇧" },
    { code: "hi", name: t("language.hi"), flag: "🇮🇳" },
    { code: "gu", name: t("language.gu"), flag: "🇮🇳" },
  ];

  return (
    <div className="relative">
      <select
        aria-label={t("language.selectorLabel")}
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="appearance-none bg-white border-2 border-teal-500 rounded-lg px-4 py-2 pr-8 w-48 text-teal-700 font-medium cursor-pointer hover:border-purple-500 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-300"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
        <svg
          className="fill-current h-4 w-4 text-teal-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};

export const Navbar: React.FC = () => {
  const { t } = useLanguage();
  const { currentMode, setCurrentMode } = useMode();
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";
  const isApplicationsPage = location.pathname === "/applications";

  const handleModeClick = (mode: "demonstration" | "practice") => {
    if (isHomePage) {
      setCurrentMode(mode);
    } else {
      navigate("/");
      // Use setTimeout to ensure navigation happens before mode change
      setTimeout(() => setCurrentMode(mode), 0);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-teal-50 via-purple-50 to-teal-50 border-b border-teal-200/50 shadow-sm backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo/Title */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent"
            >
              ⚡ <span className="hidden xs:inline">{t("nav.logo")}</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1 sm:space-x-1.5 md:space-x-2">
            {/* Learn Button */}
            {isHomePage ? (
              <button
                onClick={() => handleModeClick("demonstration")}
                className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm md:text-base font-medium transition-all duration-200 ${
                  currentMode === "demonstration"
                    ? "bg-teal-500 text-white shadow-md"
                    : "text-teal-700 hover:bg-teal-100/50"
                }`}
              >
                📚 <span className="hidden xs:inline">{t("nav.learn")}</span>
              </button>
            ) : (
              <Link
                to="/"
                className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm md:text-base font-medium text-teal-700 hover:bg-teal-100/50 transition-all duration-200"
              >
                📚 <span className="hidden xs:inline">{t("nav.learn")}</span>
              </Link>
            )}

            {/* Practice Button */}
            {isHomePage ? (
              <button
                onClick={() => handleModeClick("practice")}
                className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm md:text-base font-medium transition-all duration-200 ${
                  currentMode === "practice"
                    ? "bg-purple-500 text-white shadow-md"
                    : "text-purple-700 hover:bg-purple-100/50"
                }`}
              >
                🎯 <span className="hidden xs:inline">{t("nav.practice")}</span>
              </button>
            ) : (
              <Link
                to="/"
                className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm md:text-base font-medium text-purple-700 hover:bg-purple-100/50 transition-all duration-200"
              >
                🎯 <span className="hidden xs:inline">{t("nav.practice")}</span>
              </Link>
            )}

            {/* Real World Applications Link */}
            <Link
              to="/applications"
              className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm md:text-base font-medium transition-all duration-200 ${
                isApplicationsPage
                  ? "bg-gradient-to-r from-teal-500 to-purple-500 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100/50"
              }`}
            >
              🌍{" "}
              <span className="hidden sm:inline">{t("nav.applications")}</span>
            </Link>

            {/* Language Selector */}
            <div className="ml-1 sm:ml-2 md:ml-4">
              <LanguageSelector />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export const RealWorldApplications: React.FC = () => {
  const { t } = useLanguage();

  const applicationCards = [
    {
      id: "cooking",
      icon: "🍳",
      title: t("realworld.cooking"),
      description: t("realworld.desc.cooking"),
      examples: [
        t("realworld.example.cooking.stove"),
        t("realworld.example.cooking.microwave"),
        t("realworld.example.cooking.kettle"),
        t("realworld.example.cooking.toaster"),
      ],
      color: "from-orange-400 to-red-500",
    },
    {
      id: "lighting",
      icon: "💡",
      title: t("realworld.lighting"),
      description: t("realworld.desc.lighting"),
      examples: [
        t("realworld.example.lighting.bulbs"),
        t("realworld.example.lighting.street"),
        t("realworld.example.lighting.flashlight"),
        t("realworld.example.lighting.lamp"),
      ],
      color: "from-yellow-400 to-orange-500",
    },
    {
      id: "transportation",
      icon: "🚗",
      title: t("realworld.transportation"),
      description: t("realworld.desc.transportation"),
      examples: [
        t("realworld.example.transportation.cars"),
        t("realworld.example.transportation.trains"),
        t("realworld.example.transportation.trams"),
        t("realworld.example.transportation.ebikes"),
      ],
      color: "from-blue-400 to-cyan-500",
    },
    {
      id: "heating",
      icon: "❄️",
      title: t("realworld.heating"),
      description: t("realworld.desc.heating"),
      examples: [
        t("realworld.example.heating.ac"),
        t("realworld.example.heating.heater"),
        t("realworld.example.heating.blanket"),
        t("realworld.example.heating.fan"),
      ],
      color: "from-cyan-400 to-blue-500",
    },
    {
      id: "entertainment",
      icon: "📺",
      title: t("realworld.entertainment"),
      description: t("realworld.desc.entertainment"),
      examples: [
        t("realworld.example.entertainment.tv"),
        t("realworld.example.entertainment.computer"),
        t("realworld.example.entertainment.console"),
        t("realworld.example.entertainment.speakers"),
      ],
      color: "from-purple-400 to-pink-500",
    },
    {
      id: "communication",
      icon: "📱",
      title: t("realworld.communication"),
      description: t("realworld.desc.communication"),
      examples: [
        t("realworld.example.communication.phones"),
        t("realworld.example.communication.router"),
        t("realworld.example.communication.radio"),
        t("realworld.example.communication.satellite"),
      ],
      color: "from-teal-400 to-green-500",
    },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-teal-50 via-purple-50 to-teal-50">
      <div className="max-w-7xl mx-auto">
        {/* Applications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {applicationCards.map((app, index) => (
            <div
              key={app.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`bg-gradient-to-r ${app.color} p-6 text-center`}>
                <div className="text-6xl mb-2">{app.icon}</div>
                <h2 className="text-2xl font-bold text-white">{app.title}</h2>
              </div>

              <div className="p-6">
                <p className="text-gray-600 mb-4">{app.description}</p>
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {t("common.examples")}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {app.examples.map((example, idx) => (
                      <div
                        key={idx}
                        className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        {example}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const TorchlightLearning: React.FC = () => {
  const { t } = useLanguage();
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null
  );

  const components: ElectricalComponent[] = useMemo(
    () => [
      {
        id: "cell",
        name: t("learn.symbols.cell.name"),
        category: t("learnSymbols.categories.power"),
        description: t("learn.symbols.cell.description"),
        icon: "🔋",
      },
      {
        id: "battery",
        name: t("learn.symbols.battery.name"),
        category: t("learnSymbols.categories.power"),
        description: t("learn.symbols.battery.description"),
        icon: "🔋",
      },
      {
        id: "lamp",
        name: t("learn.symbols.lamp.name"),
        category: t("learnSymbols.categories.output"),
        description: t("learn.symbols.lamp.description"),
        icon: "💡",
      },
      {
        id: "led",
        name: t("learn.symbols.led.name"),
        category: t("learnSymbols.categories.output"),
        description: t("learn.symbols.led.description"),
        icon: "💡",
      },
      {
        id: "switch-on",
        name: t("learn.symbols.switchOn.name"),
        category: t("learnSymbols.categories.control"),
        description: t("learn.symbols.switchOn.description"),
        icon: "🔘",
      },
      {
        id: "switch-off",
        name: t("learn.symbols.switchOff.name"),
        category: t("learnSymbols.categories.control"),
        description: t("learn.symbols.switchOff.description"),
        icon: "🔘",
      },
      {
        id: "wire",
        name: t("learn.symbols.wire.name"),
        category: t("learnSymbols.categories.conductor"),
        description: t("learn.symbols.wire.description"),
        icon: "⚡",
      },
    ],
    [t]
  );

  const positiveLabel = t("learn.examples.labels.positive");
  const negativeLabel = t("learn.examples.labels.negative");

  const ElectricCellSVG = () => (
    <svg
      width="120"
      height="60"
      viewBox="0 0 120 60"
      aria-label={t("learn.symbols.cell.name")}
    >
      <line x1="10" y1="30" x2="40" y2="30" stroke="#ff9800" strokeWidth="3" />
      <line x1="40" y1="20" x2="40" y2="40" stroke="#000" strokeWidth="4" />
      <line x1="80" y1="15" x2="80" y2="45" stroke="#000" strokeWidth="4" />
      <line x1="80" y1="30" x2="110" y2="30" stroke="#ff9800" strokeWidth="3" />
      <text x="35" y="15" fontSize="12" fontWeight="bold" fill="#e74c3c">
        {negativeLabel}
      </text>
      <text x="75" y="15" fontSize="12" fontWeight="bold" fill="#e74c3c">
        {positiveLabel}
      </text>
    </svg>
  );

  const BatterySVG = () => (
    <svg
      width="140"
      height="60"
      viewBox="0 0 140 60"
      aria-label={t("learn.symbols.battery.name")}
    >
      <line x1="10" y1="30" x2="30" y2="30" stroke="#ff9800" strokeWidth="3" />
      <line x1="30" y1="20" x2="30" y2="40" stroke="#000" strokeWidth="4" />
      <line x1="50" y1="15" x2="50" y2="45" stroke="#000" strokeWidth="4" />
      <line x1="70" y1="20" x2="70" y2="40" stroke="#000" strokeWidth="4" />
      <line x1="90" y1="15" x2="90" y2="45" stroke="#000" strokeWidth="4" />
      <line x1="110" y1="20" x2="110" y2="40" stroke="#000" strokeWidth="4" />
      <line
        x1="110"
        y1="30"
        x2="130"
        y2="30"
        stroke="#ff9800"
        strokeWidth="3"
      />
      <text x="25" y="15" fontSize="12" fontWeight="bold" fill="#e74c3c">
        {negativeLabel}
      </text>
      <text x="105" y="15" fontSize="12" fontWeight="bold" fill="#e74c3c">
        {positiveLabel}
      </text>
    </svg>
  );

  const ElectricLampSVG = () => (
    <svg
      width="120"
      height="80"
      viewBox="0 0 120 80"
      aria-label={t("learn.symbols.lamp.name")}
    >
      <line x1="10" y1="40" x2="35" y2="40" stroke="#ff9800" strokeWidth="3" />
      <circle
        cx="60"
        cy="40"
        r="20"
        stroke="#000"
        strokeWidth="3"
        fill="none"
      />
      <line x1="50" y1="30" x2="70" y2="50" stroke="#000" strokeWidth="2" />
      <line x1="50" y1="50" x2="70" y2="30" stroke="#000" strokeWidth="2" />
      <line x1="85" y1="40" x2="110" y2="40" stroke="#ff9800" strokeWidth="3" />
    </svg>
  );

  const LEDSVG = () => (
    <svg
      width="140"
      height="80"
      viewBox="0 0 140 80"
      aria-label={t("learn.symbols.led.name")}
    >
      <line x1="10" y1="40" x2="40" y2="40" stroke="#ff9800" strokeWidth="3" />
      <polygon
        points="40,25 40,55 70,40"
        stroke="#000"
        strokeWidth="3"
        fill="none"
      />
      <line x1="70" y1="25" x2="70" y2="55" stroke="#000" strokeWidth="3" />
      <line x1="70" y1="40" x2="100" y2="40" stroke="#ff9800" strokeWidth="3" />
      <line x1="50" y1="20" x2="60" y2="10" stroke="#ffeb3b" strokeWidth="2" />
      <polygon points="60,10 55,12 58,15" fill="#ffeb3b" />
      <line x1="60" y1="20" x2="70" y2="10" stroke="#ffeb3b" strokeWidth="2" />
      <polygon points="70,10 65,12 68,15" fill="#ffeb3b" />
    </svg>
  );

  const SwitchOnSVG = () => (
    <svg
      width="120"
      height="60"
      viewBox="0 0 120 60"
      aria-label={t("learn.symbols.switchOn.name")}
    >
      <line x1="10" y1="30" x2="40" y2="30" stroke="#ff9800" strokeWidth="3" />
      <circle cx="40" cy="30" r="4" fill="#000" />
      <line x1="40" y1="30" x2="80" y2="30" stroke="#000" strokeWidth="3" />
      <circle cx="80" cy="30" r="4" fill="#000" />
      <line x1="80" y1="30" x2="110" y2="30" stroke="#ff9800" strokeWidth="3" />
      <text x="50" y="20" fontSize="10" fill="#27ae60" fontWeight="bold">
        {t("component.on")}
      </text>
    </svg>
  );

  const SwitchOffSVG = () => (
    <svg
      width="120"
      height="60"
      viewBox="0 0 120 60"
      aria-label={t("learn.symbols.switchOff.name")}
    >
      <line x1="10" y1="30" x2="40" y2="30" stroke="#ff9800" strokeWidth="3" />
      <circle cx="40" cy="30" r="4" fill="#000" />
      <line x1="40" y1="30" x2="75" y2="15" stroke="#000" strokeWidth="3" />
      <circle cx="80" cy="30" r="4" fill="#000" />
      <line x1="80" y1="30" x2="110" y2="30" stroke="#ff9800" strokeWidth="3" />
      <line
        x1="75"
        y1="15"
        x2="85"
        y2="10"
        stroke="#e74c3c"
        strokeWidth="1"
        strokeDasharray="2,2"
      />
      <text x="50" y="12" fontSize="10" fill="#e74c3c" fontWeight="bold">
        {t("component.off")}
      </text>
    </svg>
  );

  const WireSVG = () => (
    <svg
      width="120"
      height="40"
      viewBox="0 0 120 40"
      aria-label={t("learn.symbols.wire.name")}
    >
      <line x1="10" y1="20" x2="110" y2="20" stroke="#ff9800" strokeWidth="4" />
      <circle cx="10" cy="20" r="3" fill="#000" />
      <circle cx="110" cy="20" r="3" fill="#000" />
    </svg>
  );

  const renderSymbol = (id: string) => {
    switch (id) {
      case "cell":
        return <ElectricCellSVG />;
      case "battery":
        return <BatterySVG />;
      case "lamp":
        return <ElectricLampSVG />;
      case "led":
        return <LEDSVG />;
      case "switch-on":
        return <SwitchOnSVG />;
      case "switch-off":
        return <SwitchOffSVG />;
      case "wire":
        return <WireSVG />;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#f8f9fa",
      }}
      aria-label={t("learnSymbols.aria.page")}
    >
      <div
        style={{
          backgroundColor: "#2c3e50",
          color: "white",
          padding: "30px",
          borderRadius: "10px",
          marginBottom: "30px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            margin: "0 0 10px 0",
            fontSize: "2.5em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "15px",
          }}
        >
          <span>⚡</span>
          <span>{t("learnSymbols.header.title")}</span>
        </h1>
        <p style={{ margin: 0, fontSize: "1.1em", opacity: 0.9 }}>
          {t("learnSymbols.header.subtitle")}
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
        aria-label={t("learnSymbols.aria.symbolsGrid")}
      >
        {components.map((component) => (
          <div
            key={component.id}
            onClick={() => setSelectedComponent(component.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) =>
              e.key === "Enter" && setSelectedComponent(component.id)
            }
            style={{
              backgroundColor: "white",
              padding: "25px",
              borderRadius: "10px",
              boxShadow:
                selectedComponent === component.id
                  ? "0 4px 12px rgba(52, 152, 219, 0.4)"
                  : "0 2px 8px rgba(0,0,0,0.1)",
              cursor: "pointer",
              transition: "all 0.3s",
              border:
                selectedComponent === component.id
                  ? "3px solid #3498db"
                  : "3px solid transparent",
              transform:
                selectedComponent === component.id
                  ? "translateY(-5px)"
                  : "translateY(0)",
            }}
            aria-pressed={selectedComponent === component.id}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "20px",
                paddingBottom: "15px",
                borderBottom: "2px solid #ecf0f1",
              }}
            >
              <div
                style={{
                  fontSize: "2em",
                  marginRight: "15px",
                  backgroundColor: "#ecf0f1",
                  padding: "10px",
                  borderRadius: "8px",
                }}
                aria-hidden
              >
                {component.icon}
              </div>
              <div>
                <h3
                  style={{
                    margin: "0 0 5px 0",
                    color: "#2c3e50",
                    fontSize: "1.4em",
                  }}
                >
                  {component.name}
                </h3>
                <span
                  style={{
                    display: "inline-block",
                    padding: "4px 12px",
                    backgroundColor: "#3498db",
                    color: "white",
                    borderRadius: "12px",
                    fontSize: "0.85em",
                    fontWeight: "bold",
                  }}
                >
                  {component.category}
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px",
                backgroundColor: "#fafafa",
                borderRadius: "8px",
                marginBottom: "15px",
                minHeight: "100px",
                border: "2px dashed #ddd",
              }}
              aria-label={t("learnSymbols.aria.symbolPreview", {
                component: component.name,
              })}
            >
              {renderSymbol(component.id)}
            </div>

            <p
              style={{
                margin: 0,
                color: "#555",
                fontSize: "0.95em",
                lineHeight: "1.6",
                fontStyle: "italic",
              }}
            >
              {component.description}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            color: "#2c3e50",
            borderBottom: "3px solid #3498db",
            paddingBottom: "15px",
            marginBottom: "25px",
          }}
        >
          {t("learnSymbols.example.title")}
        </h2>

        <svg
          width="100%"
          height="350"
          viewBox="0 0 800 350"
          style={{
            border: "2px solid #ddd",
            borderRadius: "8px",
            backgroundColor: "#fafafa",
          }}
          aria-label={t("learnSymbols.example.title")}
        >
          <g transform="translate(150, 150)">
            <line x1="0" y1="20" x2="0" y2="40" stroke="#000" strokeWidth="4" />
            <line
              x1="20"
              y1="15"
              x2="20"
              y2="45"
              stroke="#000"
              strokeWidth="4"
            />
            <line
              x1="40"
              y1="20"
              x2="40"
              y2="40"
              stroke="#000"
              strokeWidth="4"
            />
            <line
              x1="60"
              y1="15"
              x2="60"
              y2="45"
              stroke="#000"
              strokeWidth="4"
            />
            <text
              x="30"
              y="-5"
              fontSize="14"
              fontWeight="bold"
              textAnchor="middle"
            >
              {t("learnSymbols.example.batteryLabel")}
            </text>
            <text x="-15" y="35" fontSize="16" fontWeight="bold" fill="#e74c3c">
              {negativeLabel}
            </text>
            <text x="75" y="35" fontSize="16" fontWeight="bold" fill="#e74c3c">
              {positiveLabel}
            </text>
          </g>

          <line
            x1="210"
            y1="180"
            x2="210"
            y2="100"
            stroke="#ff9800"
            strokeWidth="5"
          />
          <line
            x1="210"
            y1="100"
            x2="350"
            y2="100"
            stroke="#ff9800"
            strokeWidth="5"
          />

          <g transform="translate(350, 100)">
            <circle cx="0" cy="0" r="6" fill="#000" />
            <line x1="0" y1="0" x2="80" y2="0" stroke="#000" strokeWidth="5" />
            <circle cx="80" cy="0" r="6" fill="#000" />
            <text
              x="40"
              y="-15"
              fontSize="14"
              fontWeight="bold"
              textAnchor="middle"
              fill="#27ae60"
            >
              {t("learn.symbols.switchOn.name")}
            </text>
          </g>

          <line
            x1="430"
            y1="100"
            x2="550"
            y2="100"
            stroke="#ff9800"
            strokeWidth="5"
          />

          <g transform="translate(550, 100)">
            <circle
              cx="0"
              cy="0"
              r="35"
              stroke="#000"
              strokeWidth="4"
              fill="#ffeb3b"
              opacity="0.4"
            />
            <line
              x1="-18"
              y1="-18"
              x2="18"
              y2="18"
              stroke="#000"
              strokeWidth="3"
            />
            <line
              x1="-18"
              y1="18"
              x2="18"
              y2="-18"
              stroke="#000"
              strokeWidth="3"
            />
            <text
              x="0"
              y="60"
              fontSize="14"
              fontWeight="bold"
              textAnchor="middle"
            >
              {t("learn.symbols.lamp.name")}
            </text>
          </g>

          <line
            x1="550"
            y1="135"
            x2="550"
            y2="250"
            stroke="#ff9800"
            strokeWidth="5"
          />
          <line
            x1="550"
            y1="250"
            x2="150"
            y2="250"
            stroke="#ff9800"
            strokeWidth="5"
          />
          <line
            x1="150"
            y1="250"
            x2="150"
            y2="180"
            stroke="#ff9800"
            strokeWidth="5"
          />

          <circle cx="210" cy="180" r="5" fill="#000" />
          <circle cx="210" cy="100" r="5" fill="#000" />
          <circle cx="350" cy="100" r="5" fill="#000" />
          <circle cx="430" cy="100" r="5" fill="#000" />
          <circle cx="550" cy="100" r="5" fill="#000" />
          <circle cx="550" cy="135" r="5" fill="#000" />
          <circle cx="550" cy="250" r="5" fill="#000" />
          <circle cx="150" cy="250" r="5" fill="#000" />
          <circle cx="150" cy="180" r="5" fill="#000" />

          <text x="270" y="85" fontSize="14" fill="#e74c3c" fontWeight="bold">
            {t("learnSymbols.example.currentFlow")}
          </text>

          <polygon points="490,100 485,95 485,105" fill="#e74c3c" />
          <polygon points="550,200 545,195 555,195" fill="#e74c3c" />
          <polygon points="300,250 305,245 305,255" fill="#e74c3c" />
          <polygon points="150,220 145,225 155,225" fill="#e74c3c" />
        </svg>

        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            backgroundColor: "#e8f4f8",
            borderLeft: "4px solid #3498db",
            borderRadius: "4px",
          }}
        >
          <p style={{ margin: 0, fontSize: "0.95em", lineHeight: "1.6" }}>
            <strong>{t("learnSymbols.example.circuitHeading")}</strong>{" "}
            {t("learnSymbols.example.circuitExplanation")}
          </p>
        </div>
      </div>
    </div>
  );
};

export const TorchlightPractice: React.FC = () => {
  const { t } = useLanguage();
  const [practiceAnswers, setPracticeAnswers] = useState<{
    [key: string]: string;
  }>({});
  const [practiceSubmitted, setPracticeSubmitted] = useState<{
    [key: string]: boolean;
  }>({});
  const [showHints, setShowHints] = useState<{ [key: string]: boolean }>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const practiceQuestions: PracticeQuestion[] = [
    {
      id: "p1",
      question: t("practice.questions.p1.question"),
      type: "diagram",
      circuits: [
        {
          id: "p1a",
          svg: (
            <svg width="250" height="150" viewBox="0 0 250 150">
              <line
                x1="40"
                y1="75"
                x2="70"
                y2="75"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="70"
                y1="60"
                x2="70"
                y2="90"
                stroke="black"
                strokeWidth="3"
              />
              <line
                x1="80"
                y1="65"
                x2="80"
                y2="85"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="80"
                y1="75"
                x2="110"
                y2="75"
                stroke="black"
                strokeWidth="2"
              />
              <circle
                cx="140"
                cy="75"
                r="20"
                stroke="black"
                strokeWidth="2"
                fill="none"
              />
              <line
                x1="125"
                y1="60"
                x2="155"
                y2="90"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="155"
                y1="60"
                x2="125"
                y2="90"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="160"
                y1="75"
                x2="210"
                y2="75"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="40"
                y1="75"
                x2="40"
                y2="110"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="40"
                y1="110"
                x2="210"
                y2="110"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="210"
                y1="110"
                x2="210"
                y2="75"
                stroke="black"
                strokeWidth="2"
              />
              <text x="65" y="50" fontSize="12" fill="blue">
                {t("practice.svg.positive")}
              </text>
              <text x="75" y="105" fontSize="12" fill="blue">
                {t("practice.svg.negative")}
              </text>
            </svg>
          ),
          isCorrect: true,
        },
        {
          id: "p1b",
          svg: (
            <svg width="250" height="150" viewBox="0 0 250 150">
              <line
                x1="40"
                y1="75"
                x2="70"
                y2="75"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="70"
                y1="60"
                x2="70"
                y2="90"
                stroke="black"
                strokeWidth="3"
              />
              <line
                x1="80"
                y1="65"
                x2="80"
                y2="85"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="80"
                y1="75"
                x2="110"
                y2="75"
                stroke="black"
                strokeWidth="2"
              />
              <path
                d="M 115 75 L 145 60 L 145 90 Z"
                stroke="black"
                strokeWidth="2"
                fill="none"
              />
              <line
                x1="145"
                y1="75"
                x2="155"
                y2="75"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="155"
                y1="60"
                x2="155"
                y2="90"
                stroke="black"
                strokeWidth="2"
              />
              <path
                d="M 135 50 L 145 40 M 140 50 L 145 40 L 145 45"
                stroke="orange"
                strokeWidth="1.5"
                fill="none"
              />
              <line
                x1="155"
                y1="75"
                x2="210"
                y2="75"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="40"
                y1="75"
                x2="40"
                y2="110"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="40"
                y1="110"
                x2="210"
                y2="110"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="210"
                y1="110"
                x2="210"
                y2="75"
                stroke="black"
                strokeWidth="2"
              />
            </svg>
          ),
          isCorrect: false,
        },
      ],
      correctAnswer: "p1a",
      explanation: t("practice.questions.p1.explanation"),
      hint: t("practice.questions.p1.hint"),
    },
    {
      id: "p2",
      question: t("practice.questions.p2.question"),
      type: "diagram",
      circuits: [
        {
          id: "p2a",
          svg: (
            <svg width="250" height="150" viewBox="0 0 250 150">
              <line
                x1="30"
                y1="75"
                x2="50"
                y2="75"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="50"
                y1="60"
                x2="50"
                y2="90"
                stroke="black"
                strokeWidth="3"
              />
              <line
                x1="60"
                y1="65"
                x2="60"
                y2="85"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="70"
                y1="60"
                x2="70"
                y2="90"
                stroke="black"
                strokeWidth="3"
              />
              <line
                x1="80"
                y1="65"
                x2="80"
                y2="85"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="80"
                y1="75"
                x2="110"
                y2="75"
                stroke="black"
                strokeWidth="2"
              />
              <path
                d="M 115 75 L 145 60 L 145 90 Z"
                stroke="black"
                strokeWidth="2"
                fill="none"
              />
              <line
                x1="145"
                y1="75"
                x2="155"
                y2="75"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="155"
                y1="60"
                x2="155"
                y2="90"
                stroke="black"
                strokeWidth="2"
              />
              <path
                d="M 135 50 L 145 40 M 140 50 L 145 40 L 145 45"
                stroke="orange"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M 145 50 L 155 40 M 150 50 L 155 40 L 155 45"
                stroke="orange"
                strokeWidth="1.5"
                fill="none"
              />
              <line
                x1="155"
                y1="75"
                x2="220"
                y2="75"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="30"
                y1="75"
                x2="30"
                y2="110"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="30"
                y1="110"
                x2="220"
                y2="110"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="220"
                y1="110"
                x2="220"
                y2="75"
                stroke="black"
                strokeWidth="2"
              />
              <text x="45" y="50" fontSize="12" fill="blue">
                {t("practice.svg.positive")}
              </text>
              <text x="120" y="95" fontSize="12" fill="green">
                {t("practice.svg.positive")}
              </text>
              <text x="150" y="95" fontSize="12" fill="red">
                {t("practice.svg.negative")}
              </text>
            </svg>
          ),
          isCorrect: true,
        },
        {
          id: "p2b",
          svg: (
            <svg width="250" height="150" viewBox="0 0 250 150">
              <line
                x1="30"
                y1="75"
                x2="50"
                y2="75"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="50"
                y1="60"
                x2="50"
                y2="90"
                stroke="black"
                strokeWidth="3"
              />
              <line
                x1="60"
                y1="65"
                x2="60"
                y2="85"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="60"
                y1="75"
                x2="110"
                y2="75"
                stroke="black"
                strokeWidth="2"
              />
              <path
                d="M 115 75 L 145 60 L 145 90 Z"
                stroke="black"
                strokeWidth="2"
                fill="none"
              />
              <line
                x1="145"
                y1="75"
                x2="155"
                y2="75"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="155"
                y1="60"
                x2="155"
                y2="90"
                stroke="black"
                strokeWidth="2"
              />
              <path
                d="M 135 50 L 145 40 M 140 50 L 145 40 L 145 45"
                stroke="orange"
                strokeWidth="1.5"
                fill="none"
              />
              <line
                x1="155"
                y1="75"
                x2="220"
                y2="75"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="30"
                y1="75"
                x2="30"
                y2="110"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="30"
                y1="110"
                x2="220"
                y2="110"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="220"
                y1="110"
                x2="220"
                y2="75"
                stroke="black"
                strokeWidth="2"
              />
            </svg>
          ),
          isCorrect: false,
        },
      ],
      correctAnswer: "p2a",
      explanation: t("practice.questions.p2.explanation"),
      hint: t("practice.questions.p2.hint"),
    },
    {
      id: "p3",
      question: t("practice.questions.p3.question"),
      type: "diagram",
      circuits: [
        {
          id: "p3a",
          svg: (
            <svg width="250" height="150" viewBox="0 0 250 150">
              <line
                x1="40"
                y1="75"
                x2="70"
                y2="75"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="70"
                y1="60"
                x2="70"
                y2="90"
                stroke="black"
                strokeWidth="3"
              />
              <line
                x1="80"
                y1="65"
                x2="80"
                y2="85"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="80"
                y1="75"
                x2="100"
                y2="75"
                stroke="black"
                strokeWidth="2"
              />
              <circle cx="110" cy="75" r="3" fill="black" />
              <circle cx="140" cy="75" r="3" fill="black" />
              <line
                x1="110"
                y1="75"
                x2="135"
                y2="65"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="140"
                y1="75"
                x2="160"
                y2="75"
                stroke="black"
                strokeWidth="2"
              />
              <circle
                cx="185"
                cy="75"
                r="20"
                stroke="black"
                strokeWidth="2"
                fill="none"
              />
              <line
                x1="170"
                y1="60"
                x2="200"
                y2="90"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="200"
                y1="60"
                x2="170"
                y2="90"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="205"
                y1="75"
                x2="210"
                y2="75"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="40"
                y1="75"
                x2="40"
                y2="110"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="40"
                y1="110"
                x2="210"
                y2="110"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="210"
                y1="110"
                x2="210"
                y2="75"
                stroke="black"
                strokeWidth="2"
              />
              <text x="120" y="60" fontSize="11" fill="red">
                {t("practice.svg.switchOff")}
              </text>
            </svg>
          ),
          isCorrect: true,
        },
        {
          id: "p3b",
          svg: (
            <svg width="250" height="150" viewBox="0 0 250 150">
              <line
                x1="40"
                y1="75"
                x2="70"
                y2="75"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="70"
                y1="60"
                x2="70"
                y2="90"
                stroke="black"
                strokeWidth="3"
              />
              <line
                x1="80"
                y1="65"
                x2="80"
                y2="85"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="80"
                y1="75"
                x2="100"
                y2="75"
                stroke="black"
                strokeWidth="2"
              />
              <circle cx="110" cy="75" r="3" fill="black" />
              <circle cx="140" cy="75" r="3" fill="black" />
              <line
                x1="110"
                y1="75"
                x2="140"
                y2="75"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="140"
                y1="75"
                x2="160"
                y2="75"
                stroke="black"
                strokeWidth="2"
              />
              <circle
                cx="185"
                cy="75"
                r="20"
                stroke="black"
                strokeWidth="2"
                fill="none"
              />
              <line
                x1="170"
                y1="60"
                x2="200"
                y2="90"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="200"
                y1="60"
                x2="170"
                y2="90"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="205"
                y1="75"
                x2="210"
                y2="75"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="40"
                y1="75"
                x2="40"
                y2="110"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="40"
                y1="110"
                x2="210"
                y2="110"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="210"
                y1="110"
                x2="210"
                y2="75"
                stroke="black"
                strokeWidth="2"
              />
              <text x="120" y="60" fontSize="11" fill="green">
                {t("practice.svg.switchOn")}
              </text>
            </svg>
          ),
          isCorrect: false,
        },
      ],
      correctAnswer: "p3a",
      explanation: t("practice.questions.p3.explanation"),
      hint: t("practice.questions.p3.hint"),
    },
    {
      id: "p4",
      question: t("practice.questions.p4.question"),
      type: "diagram",
      circuits: [
        {
          id: "p4a",
          svg: (
            <svg width="250" height="150" viewBox="0 0 250 150">
              <line
                x1="80"
                y1="75"
                x2="110"
                y2="75"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="110"
                y1="55"
                x2="110"
                y2="95"
                stroke="black"
                strokeWidth="4"
              />
              <line
                x1="125"
                y1="60"
                x2="125"
                y2="90"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="125"
                y1="75"
                x2="150"
                y2="75"
                stroke="black"
                strokeWidth="2"
              />
              <text x="103" y="45" fontSize="18" fontWeight="bold" fill="blue">
                {t("practice.svg.positive")}
              </text>
              <text x="118" y="120" fontSize="18" fontWeight="bold" fill="blue">
                {t("practice.svg.negative")}
              </text>
              <text x="60" y="65" fontSize="12" fill="gray">
                {t("practice.svg.longLine")}
              </text>
              <path
                d="M 90 60 L 110 55"
                stroke="gray"
                strokeWidth="1"
                markerEnd="url(#arrow-gray)"
              />
              <text x="130" y="65" fontSize="12" fill="gray">
                {t("practice.svg.shortLine")}
              </text>
              <path
                d="M 140 60 L 125 60"
                stroke="gray"
                strokeWidth="1"
                markerEnd="url(#arrow-gray)"
              />
              <defs>
                <marker
                  id="arrow-gray"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                >
                  <path d="M0,0 L0,6 L9,3 z" fill="gray" />
                </marker>
              </defs>
            </svg>
          ),
          isCorrect: true,
        },
        {
          id: "p4b",
          svg: (
            <svg width="250" height="150" viewBox="0 0 250 150">
              <line
                x1="80"
                y1="75"
                x2="110"
                y2="75"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="110"
                y1="55"
                x2="110"
                y2="95"
                stroke="black"
                strokeWidth="4"
              />
              <line
                x1="125"
                y1="60"
                x2="125"
                y2="90"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="125"
                y1="75"
                x2="150"
                y2="75"
                stroke="black"
                strokeWidth="2"
              />
              <text x="103" y="45" fontSize="18" fontWeight="bold" fill="blue">
                {t("practice.svg.negative")}
              </text>
              <text x="118" y="120" fontSize="18" fontWeight="bold" fill="blue">
                {t("practice.svg.positive")}
              </text>
              <text x="60" y="65" fontSize="12" fill="gray">
                {t("practice.svg.longLine")}
              </text>
              <path
                d="M 90 60 L 110 55"
                stroke="gray"
                strokeWidth="1"
                markerEnd="url(#arrow-gray2)"
              />
              <text x="130" y="65" fontSize="12" fill="gray">
                {t("practice.svg.shortLine")}
              </text>
              <path
                d="M 140 60 L 125 60"
                stroke="gray"
                strokeWidth="1"
                markerEnd="url(#arrow-gray2)"
              />
              <defs>
                <marker
                  id="arrow-gray2"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                >
                  <path d="M0,0 L0,6 L9,3 z" fill="gray" />
                </marker>
              </defs>
            </svg>
          ),
          isCorrect: false,
        },
      ],
      correctAnswer: "p4a",
      explanation: t("practice.questions.p4.explanation"),
      hint: t("practice.questions.p4.hint"),
    },
    {
      id: "p5",
      question: t("practice.questions.p5.question"),
      type: "diagram",
      circuits: [
        {
          id: "p5a",
          svg: (
            <svg width="250" height="150" viewBox="0 0 250 150">
              <line
                x1="30"
                y1="75"
                x2="60"
                y2="75"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="60"
                y1="60"
                x2="60"
                y2="90"
                stroke="black"
                strokeWidth="3"
              />
              <line
                x1="70"
                y1="65"
                x2="70"
                y2="85"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="70"
                y1="75"
                x2="100"
                y2="75"
                stroke="black"
                strokeWidth="2"
              />
              <path
                d="M 105 75 L 135 60 L 135 90 Z"
                stroke="black"
                strokeWidth="2"
                fill="none"
              />
              <line
                x1="135"
                y1="75"
                x2="145"
                y2="75"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="145"
                y1="60"
                x2="145"
                y2="90"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="145"
                y1="75"
                x2="220"
                y2="75"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="30"
                y1="75"
                x2="30"
                y2="110"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="30"
                y1="110"
                x2="220"
                y2="110"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="220"
                y1="110"
                x2="220"
                y2="75"
                stroke="black"
                strokeWidth="2"
              />
              <text
                x="110"
                y="100"
                fontSize="14"
                fontWeight="bold"
                fill="green"
              >
                {t("practice.svg.positive")}
              </text>
              <text x="140" y="100" fontSize="14" fontWeight="bold" fill="red">
                {t("practice.svg.negative")}
              </text>
              <path
                d="M 70 50 L 120 50"
                stroke="red"
                strokeWidth="2"
                markerEnd="url(#arrowred)"
              />
              <defs>
                <marker
                  id="arrowred"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                >
                  <path d="M0,0 L0,6 L9,3 z" fill="red" />
                </marker>
              </defs>
              <text x="70" y="45" fontSize="11" fontWeight="bold" fill="red">
                {t("practice.svg.currentFlow")}
              </text>
              <path
                d="M 125 50 L 135 40 M 130 50 L 135 40 L 135 45"
                stroke="orange"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          ),
          isCorrect: true,
        },
        {
          id: "p5b",
          svg: (
            <svg width="250" height="150" viewBox="0 0 250 150">
              <line
                x1="30"
                y1="75"
                x2="60"
                y2="75"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="60"
                y1="60"
                x2="60"
                y2="90"
                stroke="black"
                strokeWidth="3"
              />
              <line
                x1="70"
                y1="65"
                x2="70"
                y2="85"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="70"
                y1="75"
                x2="100"
                y2="75"
                stroke="black"
                strokeWidth="2"
              />
              <path
                d="M 145 75 L 115 60 L 115 90 Z"
                stroke="black"
                strokeWidth="2"
                fill="none"
              />
              <line
                x1="115"
                y1="75"
                x2="105"
                y2="75"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="105"
                y1="60"
                x2="105"
                y2="90"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="145"
                y1="75"
                x2="220"
                y2="75"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="30"
                y1="75"
                x2="30"
                y2="110"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="30"
                y1="110"
                x2="220"
                y2="110"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="220"
                y1="110"
                x2="220"
                y2="75"
                stroke="black"
                strokeWidth="2"
              />
              <text x="100" y="100" fontSize="14" fontWeight="bold" fill="red">
                {t("practice.svg.negative")}
              </text>
              <text
                x="130"
                y="100"
                fontSize="14"
                fontWeight="bold"
                fill="green"
              >
                {t("practice.svg.positive")}
              </text>
              <path
                d="M 115 50 L 125 40 M 120 50 L 125 40 L 125 45"
                stroke="orange"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          ),
          isCorrect: false,
        },
      ],
      correctAnswer: "p5a",
      explanation: t("practice.questions.p5.explanation"),
      hint: t("practice.questions.p5.hint"),
    },
  ];

  const handlePracticeSubmit = (questionId: string) => {
    setPracticeSubmitted({ ...practiceSubmitted, [questionId]: true });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < practiceQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const question = practiceQuestions[currentQuestion];
  const isSubmitted = practiceSubmitted[question.id];
  const selectedAnswer = practiceAnswers[question.id];
  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg sm:rounded-xl shadow-xl p-4 sm:p-6 md:p-8">
          <div className="flex gap-3 sm:gap-4 mb-6 sm:mb-8">
            <span className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-lg sm:text-xl shadow-lg">
              {currentQuestion + 1}
            </span>
            <div className="flex-1">
              <p className="font-bold text-gray-800 text-base sm:text-lg md:text-xl mb-1 sm:mb-2">
                {question.question}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">
                {t("practice.ui.selectInstruction")}
              </p>
            </div>
          </div>

          {question.hint && !isSubmitted && (
            <div className="mb-6">
              <button
                onClick={() =>
                  setShowHints({
                    ...showHints,
                    [question.id]: !showHints[question.id],
                  })
                }
                className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold transition-all"
              >
                <Lightbulb className="w-5 h-5" />
                {showHints[question.id]
                  ? t("practice.ui.hideHint")
                  : t("practice.ui.showHint")}
              </button>
              {showHints[question.id] && (
                <div className="mt-3 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
                  <p className="text-sm text-gray-700">💡 {question.hint}</p>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {question.circuits.map((circuit, cIndex) => {
              const isSelected = selectedAnswer === circuit.id;
              const showResult = isSubmitted && isSelected;

              return (
                <div
                  key={circuit.id}
                  onClick={() =>
                    !isSubmitted &&
                    setPracticeAnswers({
                      ...practiceAnswers,
                      [question.id]: circuit.id,
                    })
                  }
                  className={`relative rounded-lg sm:rounded-xl p-4 sm:p-6 cursor-pointer transition-all duration-300 ${
                    showResult
                      ? isCorrect
                        ? "border-2 border-green-500 bg-green-50 shadow-xl sm:scale-105"
                        : "border-2 border-red-500 bg-red-50 shadow-xl"
                      : isSelected
                      ? "border-2 border-blue-500 bg-blue-50 shadow-lg"
                      : "border border-gray-300 hover:border-gray-400 hover:shadow-md"
                  } ${isSubmitted ? "cursor-not-allowed" : ""}`}
                >
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center font-bold text-gray-700 text-base sm:text-lg shadow-md">
                    {String.fromCharCode(65 + cIndex)}
                  </div>

                  {showResult && (
                    <div
                      className={`absolute top-3 right-3 sm:top-4 sm:right-4 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-white font-bold text-xs sm:text-sm shadow-lg ${
                        isCorrect ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {isCorrect ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />{" "}
                          <span className="hidden sm:inline">
                            {t("practice.ui.correct")}
                          </span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />{" "}
                          <span className="hidden sm:inline">
                            {t("practice.ui.wrong")}
                          </span>
                        </span>
                      )}
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-lg p-4 sm:p-6 md:p-8 mt-10 sm:mt-12 mb-3 sm:mb-4 flex items-center justify-center min-h-[140px] sm:min-h-[180px] border border-gray-200 overflow-x-auto">
                    <div className="w-full max-w-full">{circuit.svg}</div>
                  </div>

                  {isSelected && !isSubmitted && (
                    <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!isSubmitted ? (
            <button
              onClick={() => handlePracticeSubmit(question.id)}
              disabled={!selectedAnswer}
              className={`w-full py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-white text-base sm:text-lg transition-all shadow-lg ${
                selectedAnswer
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 cursor-pointer active:scale-95"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {selectedAnswer
                ? t("practice.ui.checkAnswer")
                : t("practice.ui.selectPrompt")}
            </button>
          ) : (
            <div
              className={`p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 mb-4 sm:mb-6 ${
                isCorrect
                  ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-500"
                  : "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-500"
              }`}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
                    isCorrect ? "bg-green-500" : "bg-orange-500"
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  ) : (
                    <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800 mb-1 sm:mb-2 text-base sm:text-lg">
                    {isCorrect
                      ? t("practice.ui.correctTitle")
                      : t("practice.ui.incorrectTitle")}
                  </p>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    {question.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 sm:gap-4 mt-4 sm:mt-6">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
              className="flex-1 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              <span className="hidden sm:inline">←</span>{" "}
              {t("practice.ui.previous")}
            </button>
            <button
              onClick={handleNextQuestion}
              disabled={currentQuestion >= practiceQuestions.length - 1}
              className="flex-1 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg flex items-center justify-center gap-1 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {t("practice.ui.next")}{" "}
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 text-center text-gray-600 text-xs sm:text-sm px-4">
          <p>{t("practice.ui.footer")}</p>
        </div>
      </div>
    </div>
  );
};

export const CircuitVisualization: React.FC = () => {
  const { currentMode } = useMode();

  // Render based on current mode
  if (currentMode === "practice") {
    return <TorchlightPractice />;
  }

  // Default to demonstration/learn mode
  return <TorchlightLearning />;
};

// Default export
export default CircuitVisualization;
