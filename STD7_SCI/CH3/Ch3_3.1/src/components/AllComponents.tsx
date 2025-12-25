/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, createContext, useContext, useEffect, ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Zap, Battery, Lightbulb, Power, Eye, CheckCircle, ChevronLeft, ChevronRight, XCircle, Award, RotateCcw, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

// ============================================================================
// TYPE DEFINITIONS (from circuitTypes.ts)
// ============================================================================

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

// ============================================================================
// CONTEXT PROVIDERS (from LanguageContext.tsx and ModeContext.tsx)
// ============================================================================

// LanguageContext
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

// ModeContext
type ModeType = 'demonstration' | 'practice';

interface ModeContextType {
  currentMode: ModeType;
  setCurrentMode: (mode: ModeType) => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export const ModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentMode, setCurrentMode] = useState<ModeType>('demonstration');

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

// ============================================================================
// COMPONENTS
// ============================================================================

// LanguageSelector Component
export const LanguageSelector: React.FC = () => {
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
        className="appearance-none bg-white border-2 border-teal-500 rounded-lg px-4 py-2 pr-8 text-teal-700 font-medium cursor-pointer hover:border-purple-500 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-300"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
        <svg className="fill-current h-4 w-4 text-teal-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};

// Navbar Component
export const Navbar: React.FC = () => {
  const { t } = useLanguage();
  const { currentMode, setCurrentMode } = useMode();
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  const isApplicationsPage = location.pathname === '/applications';

  const handleModeClick = (mode: 'demonstration' | 'practice') => {
    if (isHomePage) {
      setCurrentMode(mode);
    } else {
      navigate('/');
      // Use setTimeout to ensure navigation happens before mode change
      setTimeout(() => setCurrentMode(mode), 0);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-teal-50 via-purple-50 to-teal-50 border-b border-teal-200/50 shadow-sm backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent">
              ⚡ {t('nav.logo')}
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1 md:space-x-2">
            {/* Learn Button */}
            {isHomePage ? (
              <button
                onClick={() => handleModeClick('demonstration')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentMode === 'demonstration'
                    ? 'bg-teal-500 text-white shadow-md'
                    : 'text-teal-700 hover:bg-teal-100/50'
                }`}
              >
                📚 {t('nav.learn')}
              </button>
            ) : (
              <Link
                to="/"
                className="px-4 py-2 rounded-lg font-medium text-teal-700 hover:bg-teal-100/50 transition-all duration-200"
              >
                📚 {t('nav.learn')}
              </Link>
            )}

            {/* Practice Button */}
            {isHomePage ? (
              <button
                onClick={() => handleModeClick('practice')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentMode === 'practice'
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'text-purple-700 hover:bg-purple-100/50'
                }`}
              >
                🎯 {t('nav.practice')}
              </button>
            ) : (
              <Link
                to="/"
                className="px-4 py-2 rounded-lg font-medium text-purple-700 hover:bg-purple-100/50 transition-all duration-200"
              >
                🎯 {t('nav.practice')}
              </Link>
            )}

            {/* Real World Applications Link */}
            <Link
              to="/applications"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isApplicationsPage
                  ? 'bg-gradient-to-r from-teal-500 to-purple-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100/50'
              }`}
            >
              🌍 {t('nav.applications')}
            </Link>

            {/* Language Selector */}
            <div className="ml-2 md:ml-4">
              <LanguageSelector />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

// TorchlightLearning Component
type Step = 'observe' | 'parts';

export const TorchlightLearning: React.FC = () => {
  const { t } = useLanguage();
  const [step, setStep] = useState<Step>('observe');
  const [torchOn, setTorchOn] = useState(false);
  const baseDelay = 0.08;

  const Animated: React.FC<{ index: number; className?: string; children: React.ReactNode }> = ({ index, className = '', children }) => (
    <div
      className={`animate-fade-in ${className}`}
      style={{ animationDelay: `${index * baseDelay}s`, animationFillMode: 'both' }}
    >
      {children}
    </div>
  );

  const renderObserve = () => (
    <div className="bg-white p-8 rounded-2xl shadow-xl">
      <Animated index={0} className="flex items-center gap-3 text-3xl font-bold text-orange-600 mb-6">
        <Eye className="w-10 h-10" />
        <span>{t('torch.observe.title')}</span>
      </Animated>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Interactive Torch */}
        <Animated index={1} className="bg-gradient-to-br from-gray-100 to-gray-200 p-8 rounded-xl">
          <Animated index={0}>
            <h3 className="text-xl font-semibold text-center mb-6">{t('torch.observe.clickTorch')}</h3>
          </Animated>

          <div className="relative flex flex-col items-center">
            {torchOn && (
              <div
                className="absolute -top-20 w-0 h-0 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-b-[80px] border-b-yellow-400 opacity-50 animate-pulse"
                style={{ filter: 'blur(8px)' }}
              />
            )}

            <Animated index={1}>
              <div
                onClick={() => setTorchOn(!torchOn)}
                className="relative cursor-pointer transform hover:scale-105 transition-transform"
              >
                {/* Torch Head */}
                <div
                  className={`w-32 h-24 rounded-t-full ${
                    torchOn ? 'bg-gradient-to-b from-yellow-300 to-yellow-400' : 'bg-gradient-to-b from-gray-400 to-gray-500'
                  } relative shadow-xl`}
                >
                  <div
                    className={`absolute inset-4 rounded-full ${torchOn ? 'bg-yellow-200 animate-pulse' : 'bg-gray-300'} border-4 border-gray-600 shadow-inner`}
                  >
                    {torchOn && (
                      <>
                        <div className="absolute inset-0 rounded-full bg-yellow-100 animate-ping opacity-75" />
                        <div className="absolute inset-2 rounded-full bg-white opacity-50" />
                      </>
                    )}
                  </div>
                </div>
                {/* Torch Body */}
                <div className="w-28 h-40 mx-auto bg-gradient-to-b from-red-600 to-red-700 rounded-b-2xl shadow-xl relative">
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                    <div className={`w-12 h-6 rounded-full ${torchOn ? 'bg-green-400' : 'bg-gray-500'} shadow-inner relative transition-all`}>
                      <div
                        className={`absolute top-1 ${torchOn ? 'right-1' : 'left-1'} w-4 h-4 bg-white rounded-full shadow-md transition-all`}
                      />
                    </div>
                    <p className="text-xs text-white text-center mt-1 font-semibold">{torchOn ? t('component.on') : t('component.off')}</p>
                  </div>
                </div>
              </div>
            </Animated>
            <Animated index={2}>
              <p className="mt-8 text-center text-gray-700 font-semibold bg-blue-50 p-3 rounded-lg">
                {torchOn ? t('torch.observe.lampGlowing') : t('torch.observe.lampNotGlowing')}
              </p>
            </Animated>
          </div>
        </Animated>

        {/* Definition */}
        <div>
          <Animated index={2} className="bg-blue-50 p-8 md:p-10 rounded-2xl mb-6">
            <Animated index={0}>
              <h3 className="font-bold text-blue-800 mb-3">{t('torch.observe.whatNotice')}</h3>
            </Animated>
            <Animated index={1} className="bg-white p-6 md:p-8 rounded-xl shadow-sm flex items-start gap-4 max-w-3xl">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
              <p className="text-base text-gray-700 leading-relaxed">{t('torch.observe.definition')}</p>
            </Animated>
          </Animated>
        </div>
      </div>

      <Animated index={3} className="flex justify-end mt-8">
        <button
          onClick={() => setStep('parts')}
          className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
        >
          {t('torch.observe.nextParts')}
          <ChevronRight className="inline w-5 h-5 ml-2" />
        </button>
      </Animated>
    </div>
  );

  const renderParts = () => (
    <div className="bg-white p-8 rounded-2xl shadow-xl">
      <Animated index={0}>
        <h2 className="text-3xl font-bold text-orange-600 mb-6">{t('torch.parts.title')}</h2>
      </Animated>

      <Animated index={1} className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8 rounded-xl mb-8 overflow-x-auto">
        <svg width="100%" height="400" viewBox="0 0 600 400" className="min-w-[560px]">
          {/* Lamp */}
          <g transform="translate(100, 50)">
            <ellipse cx="40" cy="30" rx="35" ry="30" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
            <circle cx="40" cy="30" r="15" fill="#FCD34D" className="animate-pulse" />
            <text x="40" y="80" textAnchor="middle" className="text-sm font-semibold">
              {t('torch.parts.lamp')}
            </text>
          </g>

          {/* Switch */}
          <g transform="translate(250, 50)">
            <rect x="10" y="15" width="60" height="30" rx="5" fill="#E5E7EB" stroke="#6B7280" strokeWidth="2" />
            <rect x="20" y="20" width="20" height="20" rx="3" fill="#10B981" />
            <text x="40" y="80" textAnchor="middle" className="text-sm font-semibold">
              {t('torch.parts.switch')}
            </text>
          </g>

          {/* Cells */}
          <g transform="translate(400, 40)">
            <rect x="5" y="0" width="30" height="50" rx="5" fill="#DC2626" stroke="#991B1B" strokeWidth="2" />
            <rect x="15" y="-5" width="10" height="8" fill="#374151" />
            <rect x="45" y="0" width="30" height="50" rx="5" fill="#DC2626" stroke="#991B1B" strokeWidth="2" />
            <rect x="55" y="-5" width="10" height="8" fill="#374151" />
            <text x="40" y="80" textAnchor="middle" className="text-sm font-semibold">
              {t('torch.parts.cells')}
            </text>
          </g>

          {/* Wires */}
          <line
            x1="140"
            y1="80"
            x2="260"
            y2="80"
            stroke="#3B82F6"
            strokeWidth="3"
            strokeDasharray="5,5"
          >
            <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite" />
          </line>

          <line
            x1="310"
            y1="80"
            x2="410"
            y2="70"
            stroke="#3B82F6"
            strokeWidth="3"
            strokeDasharray="5,5"
          >
            <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite" />
          </line>

          <g transform="translate(270, 200)">
            <line x1="0" y1="0" x2="80" y2="0" stroke="#3B82F6" strokeWidth="4" />
            <text x="40" y="25" textAnchor="middle" className="text-sm font-semibold">
              {t('torch.parts.wires')}
            </text>
          </g>
        </svg>
      </Animated>

      {/* Component Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Lightbulb, title: t('torch.parts.lampCard'), desc: t('torch.parts.lampDesc'), color: 'yellow' },
          { icon: Power, title: t('torch.parts.switchCard'), desc: t('torch.parts.switchDesc'), color: 'green' },
          { icon: Battery, title: t('torch.parts.cellCard'), desc: t('torch.parts.cellDesc'), color: 'red' },
          { icon: Zap, title: t('torch.parts.wiresCard'), desc: t('torch.parts.wiresDesc'), color: 'blue' },
        ].map((item, i) => (
          <Animated
            key={item.title}
            index={i + 2}
            className={`bg-gradient-to-br from-${item.color}-50 to-${item.color}-100 p-4 rounded-xl border-2 border-${item.color}-300 transition`}
          >
            <div className="text-center">
              <item.icon className={`w-12 h-12 mx-auto text-${item.color}-600 mb-2`} />
              <h4 className="font-bold text-gray-800">{item.title}</h4>
              <p className="text-xs text-gray-600 mt-1">{item.desc}</p>
            </div>
          </Animated>
        ))}
      </div>

      <Animated index={6} className="flex justify-start">
        <button
          onClick={() => setStep('observe')}
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
        >
          <ChevronLeft className="inline w-5 h-5 mr-2" />
          {t('torch.parts.back')}
        </button>
      </Animated>
    </div>
  );

  const steps: Record<Step, JSX.Element> = {
    observe: renderObserve(),
    parts: renderParts(),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">{steps[step]}</div>
    </div>
  );
};

// TorchlightPractice Component
interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

export const TorchlightPractice: React.FC = () => {
  const { t } = useLanguage();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const questions: Question[] = [
    {
      id: 1,
      question: t('practice.ex6.q1'),
      options: [
        t('practice.ex6.q1o1'),
        t('practice.ex6.q1o2'),
        t('practice.ex6.q1o3'),
        t('practice.ex6.q1o4'),
      ],
      correctAnswer: t('practice.ex6.q1o2'),
    },
    {
      id: 2,
      question: t('practice.ex6.q2'),
      options: [
        t('practice.ex6.q2o1'),
        t('practice.ex6.q2o2'),
        t('practice.ex6.q2o3'),
        t('practice.ex6.q2o4'),
      ],
      correctAnswer: t('practice.ex6.q2o2'),
    },
    {
      id: 3,
      question: t('practice.ex6.q3'),
      options: [
        t('practice.ex6.q3o1'),
        t('practice.ex6.q3o2'),
        t('practice.ex6.q3o3'),
        t('practice.ex6.q3o4'),
      ],
      correctAnswer: t('practice.ex6.q3o2'),
    },
    {
      id: 4,
      question: t('practice.ex6.q4'),
      options: [
        t('practice.ex6.q4o1'),
        t('practice.ex6.q4o2'),
        t('practice.ex6.q4o3'),
        t('practice.ex6.q4o4'),
      ],
      correctAnswer: t('practice.ex6.q4o3'),
    },
    {
      id: 5,
      question: t('practice.ex6.q5'),
      options: [
        t('practice.ex6.q5o1'),
        t('practice.ex6.q5o2'),
        t('practice.ex6.q5o3'),
        t('practice.ex6.q5o4'),
      ],
      correctAnswer: t('practice.ex6.q5o3'),
    },
  ];

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionSelect = (option: string) => {
    setSelectedAnswer(option);
  };

  const handleNext = () => {
    // Save the answer
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: selectedAnswer }));

    // Move to next question or show results
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(answers[questions[currentQuestionIndex + 1]?.id] || '');
    } else {
      // Calculate score
      let correctCount = 0;
      questions.forEach((q) => {
        if (answers[q.id] === q.correctAnswer || (q.id === currentQuestion.id && selectedAnswer === q.correctAnswer)) {
          correctCount++;
        }
      });
      setScore(correctCount);
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(answers[questions[currentQuestionIndex - 1]?.id] || '');
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setAnswers({});
    setShowResults(false);
    setScore(0);
  };

  const getAnswerStatus = (questionId: number, option: string) => {
    if (!showResults) return null;

    const question = questions.find((q) => q.id === questionId);
    const userAnswer = answers[questionId];

    if (option === question?.correctAnswer) {
      return 'correct';
    }
    if (option === userAnswer && option !== question?.correctAnswer) {
      return 'incorrect';
    }
    return null;
  };

  if (showResults) {
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <div className="text-center mb-8">
              <Award className="w-24 h-24 mx-auto text-yellow-500 mb-4" />
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{t('practice.summary.title')}</h1>
              <p className="text-xl text-gray-600">
                {percentage >= 80 ? t('practice.summary.excellent') : percentage >= 60 ? t('practice.summary.good') : t('practice.summary.keepPracticing')}
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl mb-6">
              <div className="text-center">
                <p className="text-lg text-gray-700 mb-2">{t('practice.summary.totalScore')}</p>
                <p className="text-5xl font-bold text-blue-600" aria-label={t('practice.summary.totalScore')}>
                  {score}/{questions.length}
                </p>
                <p className="text-2xl text-gray-600 mt-2">
                  {t('practice.summary.scoreLine', { correct: score, total: questions.length, percentage })}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {t('practice.summary.exerciseCount', { count: questions.length })}
                </p>
              </div>
            </div>

            {/* Review Answers */}
            <div className="space-y-4 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('common.examples')}:</h2>
              {questions.map((question, index) => {
                const userAnswer = answers[question.id];
                const isCorrect = userAnswer === question.correctAnswer;

                return (
                  <div
                    key={question.id}
                    className={`p-4 rounded-lg border-2 ${isCorrect ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 mb-2">
                          {t('practice.ex6.question')} {index + 1}: {question.question}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">{t('common.yourAnswer')} </span>
                          <span className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                            {userAnswer || t('practice.ex1.notLabeled')}
                          </span>
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-semibold">{t('common.correct')}: </span>
                            <span className="text-green-700">{question.correctAnswer}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleRestart}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105"
              >
                <RotateCcw className="w-6 h-6" />
                {t('practice.summary.restart')}
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-teal-500 text-white py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-teal-600 transition-all transform hover:scale-105"
              >
                <Home className="w-6 h-6" />
                {t('practice.summary.backToLearn')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-blue-600">{t('practice.header.title')}</h1>
              <div className="bg-blue-100 px-4 py-2 rounded-lg">
                <p className="text-sm text-gray-600">
                  {t('practice.ex6.question')} {currentQuestionIndex + 1} {t('practice.ex6.of')} {questions.length}
                </p>
              </div>
            </div>
            <p className="text-gray-600">{t('practice.header.subtitle')}</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{currentQuestion.question}</h2>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === option;
                const status = getAnswerStatus(currentQuestion.id, option);

                return (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(option)}
                    disabled={showResults}
                    className={`w-full p-4 rounded-xl text-left transition-all transform hover:scale-102 ${isSelected
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-102'
                        : status === 'correct'
                          ? 'bg-green-100 border-2 border-green-500'
                          : status === 'incorrect'
                            ? 'bg-red-100 border-2 border-red-500'
                            : 'bg-gray-50 border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${isSelected
                            ? 'bg-white text-blue-600'
                            : status === 'correct'
                              ? 'bg-green-500 text-white'
                              : status === 'incorrect'
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-200 text-gray-600'
                          }`}
                      >
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className={`flex-1 font-semibold ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                        {option}
                      </span>
                      {status === 'correct' && <CheckCircle className="w-6 h-6 text-green-600" />}
                      {status === 'incorrect' && <XCircle className="w-6 h-6 text-red-600" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {t('common.previous')}
            </button>
            <button
              onClick={handleNext}
              disabled={!selectedAnswer}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {currentQuestionIndex === questions.length - 1 ? t('practice.ex6.checkQuiz') : t('common.next')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// CircuitVisualization Component
export const CircuitVisualization: React.FC = () => {
  const { currentMode } = useMode();

  // Render based on current mode
  if (currentMode === 'practice') {
    return <TorchlightPractice />;
  }

  // Default to demonstration/learn mode
  return <TorchlightLearning />;
};

// RealWorldApplications Component
export const RealWorldApplications: React.FC = () => {
  const { t } = useLanguage();

  const usageCategories = [
    {
      id: 'cooking',
      icon: '🍳',
      title: t('realworld.cooking'),
      color: 'from-orange-400 to-red-500',
    },
    {
      id: 'lighting',
      icon: '💡',
      title: t('realworld.lighting'),
      color: 'from-yellow-400 to-orange-500',
    },
    {
      id: 'transportation',
      icon: '🚗',
      title: t('realworld.transportation'),
      color: 'from-blue-400 to-cyan-500',
    },
    {
      id: 'heating',
      icon: '❄️',
      title: t('realworld.heating'),
      color: 'from-cyan-400 to-blue-500',
    },
    {
      id: 'entertainment',
      icon: '📺',
      title: t('realworld.entertainment'),
      color: 'from-purple-400 to-pink-500',
    },
    {
      id: 'communication',
      icon: '📱',
      title: t('realworld.communication'),
      color: 'from-teal-400 to-green-500',
    },
  ];

  const applicationCards = [
    {
      id: 'cooking',
      icon: '🍳',
      title: t('realworld.cooking'),
      description: t('realworld.desc.cooking'),
      examples: [
        t('realworld.example.cooking.stove'),
        t('realworld.example.cooking.microwave'),
        t('realworld.example.cooking.kettle'),
        t('realworld.example.cooking.toaster'),
      ],
      color: 'from-orange-400 to-red-500',
    },
    {
      id: 'lighting',
      icon: '💡',
      title: t('realworld.lighting'),
      description: t('realworld.desc.lighting'),
      examples: [
        t('realworld.example.lighting.bulbs'),
        t('realworld.example.lighting.street'),
        t('realworld.example.lighting.flashlight'),
        t('realworld.example.lighting.lamp'),
      ],
      color: 'from-yellow-400 to-orange-500',
    },
    {
      id: 'transportation',
      icon: '🚗',
      title: t('realworld.transportation'),
      description: t('realworld.desc.transportation'),
      examples: [
        t('realworld.example.transportation.cars'),
        t('realworld.example.transportation.trains'),
        t('realworld.example.transportation.trams'),
        t('realworld.example.transportation.ebikes'),
      ],
      color: 'from-blue-400 to-cyan-500',
    },
    {
      id: 'heating',
      icon: '❄️',
      title: t('realworld.heating'),
      description: t('realworld.desc.heating'),
      examples: [
        t('realworld.example.heating.ac'),
        t('realworld.example.heating.heater'),
        t('realworld.example.heating.blanket'),
        t('realworld.example.heating.fan'),
      ],
      color: 'from-cyan-400 to-blue-500',
    },
    {
      id: 'entertainment',
      icon: '📺',
      title: t('realworld.entertainment'),
      description: t('realworld.desc.entertainment'),
      examples: [
        t('realworld.example.entertainment.tv'),
        t('realworld.example.entertainment.computer'),
        t('realworld.example.entertainment.console'),
        t('realworld.example.entertainment.speakers'),
      ],
      color: 'from-purple-400 to-pink-500',
    },
    {
      id: 'communication',
      icon: '📱',
      title: t('realworld.communication'),
      description: t('realworld.desc.communication'),
      examples: [
        t('realworld.example.communication.phones'),
        t('realworld.example.communication.router'),
        t('realworld.example.communication.radio'),
        t('realworld.example.communication.satellite'),
      ],
      color: 'from-teal-400 to-green-500',
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
                  <h3 className="font-semibold text-gray-800 mb-2">{t('common.examples')}</h3>
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

        {/* Visual Representation Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 animate-fade-in">
          <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">
            {t('realworld.usageCategories')}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {usageCategories.map((app) => (
              <div key={app.id} className="text-center">
                <div className={`w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br ${app.color} flex items-center justify-center text-4xl shadow-md`}>
                  {app.icon}
                </div>
                <p className="text-sm font-medium text-gray-700">{app.title}</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${app.color} transition-all duration-500`}
                    style={{
                      width: `${Math.random() * 30 + 10}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>


      </div>
    </div>
  );
};

// Default exports for backward compatibility
export default {
  LanguageSelector,
  Navbar,
  TorchlightLearning,
  TorchlightPractice,
  CircuitVisualization,
  RealWorldApplications,
};

