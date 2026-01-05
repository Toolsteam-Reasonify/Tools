import React, { useState, useEffect, useRef, useMemo, createContext, useContext, ReactNode } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Wind, Thermometer, Sun, Flame, ChevronDown, ChevronUp, CheckCircle, XCircle, Award, Globe, Home, Coffee, CloudSnow, Sparkles, Info, BookOpen, Lightbulb } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

// ============================================================================
// Type Definitions (merged from circuitTypes.ts)
// ============================================================================
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Core Data Structures for Circuit Educational Tool
 */

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
// Translation Type Definitions
// ============================================================================

export interface LanguageOption {
  en: string;
  hi: string;
  gu: string;
  selectorLabel: string;
}

export interface NavTranslations {
  logo: string;
  tabs: {
    learn: string;
    practice: string;
    applications: string;
  };
}

export interface ConductionHeaderTranslations {
  badge: string;
  title: string;
  subtitle: string;
}

export interface ConductionIntroTranslations {
  title: string;
  para1: string;
  para2: string;
}

export interface ActivityTranslations {
  sectionTitle: string;
  safetyTitle: string;
  safetyText: string;
  simulationTitle: string;
  controls: {
    start: string;
    reset: string;
    heatIntensity: string;
  };
  heatFlowDirection: string;
  pinCard: {
    pinLabel: string;
    order: string;
    fallen: string;
    falling: string;
    waiting: string;
  };
  observations: {
    title: string;
    item1Title: string;
    item1Body: string;
    item2Title: string;
    item2Body: string;
    item3Title: string;
    item3Body: string;
  };
  table: {
    title: string;
    pin: string;
    order: string;
    status: string;
    reason: string;
    fallen: string;
    notFallen: string;
    reasonClosest: string;
    reasonProgress: string;
    reasonFarthest: string;
  };
}

export interface TestingTranslations {
  sectionTitle: string;
  callout: string;
  zoneTitle: string;
  dropHere: string;
  heatSource: string;
  heatPasses: string;
  heatBlocked: string;
  testResult: {
    title: string;
    material: string;
    type: string;
    good: string;
    poor: string;
    heatPasses: string;
    heatStops: string;
    goodDesc: string;
    poorDesc: string;
  };
  quickTest: string;
  tested: string;
}

export interface MaterialsTranslations {
  steel: string;
  copper: string;
  aluminum: string;
  wood: string;
  plastic: string;
  glass: string;
}

export interface TakeawaysTranslations {
  title: string;
  conductionTitle: string;
  conductionPoints: string[];
  goodTitle: string;
  goodPoints: string[];
  poorTitle: string;
  poorPoints: string[];
  footer: string;
}

export interface PracticeUITranslations {
  questionLabel: string;
  difficulty: {
    easy: string;
    medium: string;
    hard: string;
  };
  pointsLabel: string;
  fillBlankHint: string;
  matchHint: string;
  materials: string;
  categories: string;
  selectCategory: string;
  orderingHint: string;
  classifyHint: string;
  goodConductor: string;
  poorConductor: string;
  goodConductorLabel: string;
  poorConductorLabel: string;
  noItemsClassified: string;
  noItemsMatched: string;
  previousButton: string;
  previousButtonShort: string;
  submitButton: string;
  submitButtonShort: string;
  nextButton: string;
  nextButtonShort: string;
  tryAgainButton: string;
  tryAgainButtonShort: string;
  completeTitle: string;
  scoreSummary: string;
  questionsAnswered: string;
  scorePercentage: string;
  gradeLabel: string;
  startOverButton: string;
  correctTitle: string;
  incorrectTitle: string;
  correctAnswerLabel: string;
  progressLabel: string;
  progressQuestions: string;
  headerTitle: string;
  headerSubtitle: string;
  noQuestionsTitle: string;
  noQuestionsBody: string;
}

export interface PracticeQuestion {
  id: number;
  type: 'mcq' | 'true-false' | 'fill-blank' | 'match' | 'ordering' | 'classify' | 'sequence';
  question: string;
  options: string[];
  correctAnswer: string | string[] | Record<string, string>;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  pairs?: {
    left: string[];
    right: string[];
  };
  sequence?: string[];
}

export interface PracticeTranslations {
  ui: PracticeUITranslations;
  questions: PracticeQuestion[];
}

export interface RealWorldApplication {
  id: number;
  title: string;
  category: string;
  description: string;
  howItWorks: string;
  conductor: string;
  insulator: string;
  scienceBehind: string;
  realExample: string;
  benefits: string[];
  difficulty: 'everyday' | 'industrial' | 'advanced';
}

export interface RealWorldTranslations {
  filterTitle: string;
  allApplications: string;
  showing: string;
  application: string;
  applicationsPlural: string;
  howItWorks: string;
  goodConductorUsed: string;
  insulatorUsed: string;
  scienceBehind: string;
  realLifeExample: string;
  benefitsImpact: string;
  difficulty: {
    everyday: string;
    industrial: string;
    advanced: string;
  };
  categories: {
    all: string;
    Kitchen: string;
    Clothing: string;
    Building: string;
    Appliances: string;
    Architecture: string;
    Safety: string;
    Industry: string;
    'Space Technology': string;
  };
  applications: RealWorldApplication[];
}

export interface ConductionTranslations {
  header: ConductionHeaderTranslations;
  intro: ConductionIntroTranslations;
  activity: ActivityTranslations;
  testing: TestingTranslations;
  materials: MaterialsTranslations;
  takeaways: TakeawaysTranslations;
  practice: PracticeTranslations;
  realWorld: RealWorldTranslations;
}

export interface ConvectionLearnStep {
  id: number;
  title: string;
  description: string;
}

export interface ConvectionLearnTranslations {
  header: {
    title: string;
    subtitle: string;
  };
  step: string;
  controls: {
    previous: string;
    next: string;
    play: string;
    pause: string;
    reset: string;
  };
  indicators: {
    practice: string;
    realWorld: string;
  };
  steps: ConvectionLearnStep[];
  canvas: {
    cup1: string;
    cup2: string;
    cup2Heated: string;
    hotAirRises: string;
    coldAirSinks: string;
    hotWaterRises: string;
    coldWaterSinks: string;
    daytime: string;
    nighttime: string;
    warmerLand: string;
    coolerSea: string;
    coolerLand: string;
    warmerSea: string;
    seaBreeze: string;
    landBreeze: string;
    hot: string;
    cold: string;
    convectionCurrent: string;
  };
}

export interface ConvectionPracticeUITranslations {
  questionLabel: string;
  difficulty: {
    easy: string;
    medium: string;
    hard: string;
  };
  pointsLabel: string;
  progress: string;
  progressQuestions: string;
  outOf: string;
  previousButton: string;
  previousButtonShort: string;
  submitButton: string;
  submitButtonShort: string;
  nextButton: string;
  nextButtonShort: string;
  tryAgainButton: string;
  tryAgainButtonShort: string;
  startOverButton: string;
  completeTitle: string;
  scoreSummary: string;
  questionsAnswered: string;
  scorePercentage: string;
  gradeLabel: string;
  correctTitle: string;
  incorrectTitle: string;
  matchHint: string;
  processes: string;
  characteristics: string;
  select: string;
  sequenceHint: string;
  studyTips: string;
  tip1: string;
  tip2: string;
  tip3: string;
  tip4: string;
}

export interface ConvectionPracticeTranslations {
  header: {
    title: string;
    subtitle: string;
  };
  ui: ConvectionPracticeUITranslations;
  questions: PracticeQuestion[];
}

export interface ConvectionRealWorldTranslations {
  header: {
    title: string;
    subtitle: string;
    topic: string;
  };
  intro: {
    title: string;
    para1: string;
    para2: string;
    para3: string;
    para4: string;
    para5: string;
    para6: string;
  };
  filter: {
    title: string;
    all: string;
    showing: string;
    application: string;
    applications: string;
  };
  categories: {
    all: string;
    Nature: string;
    Home: string;
    Kitchen: string;
    Everyday: string;
    Technology: string;
  };
  difficulty: {
    everyday: string;
    nature: string;
    technology: string;
  };
  labels: {
    howItWorks: string;
    scienceBehind: string;
    realExample: string;
    benefits: string;
  };
  summary: {
    title: string;
    particleMovement: {
      title: string;
      description: string;
    };
    universalProcess: {
      title: string;
      description: string;
    };
    planetaryImpact: {
      title: string;
      description: string;
    };
    remember: string;
  };
  applications: RealWorldApplication[];
}

export interface ConvectionTranslations {
  learn: ConvectionLearnTranslations;
  practice: ConvectionPracticeTranslations;
  realWorld: ConvectionRealWorldTranslations;
}

export interface LanguageTranslations {
  language: LanguageOption;
  nav: NavTranslations;
  conduction: ConductionTranslations;
  convection: ConvectionTranslations;
}

export interface Translations {
  en: LanguageTranslations;
  hi: LanguageTranslations;
  gu: LanguageTranslations;
}

// ============================================================================
// Language Context (inline)
// ============================================================================
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
        className="appearance-none bg-white border-2 border-teal-500 rounded-lg px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 pr-6 sm:pr-8 w-40 sm:w-48 md:w-56 text-xs sm:text-sm md:text-base text-teal-700 font-medium cursor-pointer hover:border-purple-500 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-300"
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

// ============================================================================
// Navbar Component (inline)
// ============================================================================
interface NavbarProps {
  mode: 'learn' | 'practice' | 'applications';
  setMode: (mode: 'learn' | 'practice' | 'applications') => void;
}

const Navbar: React.FC<NavbarProps> = ({ mode, setMode }) => {
  const { t } = useLanguage();

  const isLearn = mode === 'learn';
  const isPractice = mode === 'practice';
  const isApplications = mode === 'applications';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-teal-50 via-purple-50 to-teal-50 border-b border-teal-200/50 shadow-sm backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex-shrink-0 flex items-center gap-1 sm:gap-2">
            <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" aria-hidden="true" />
            <span className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent">
              {t('nav.logo')}
            </span>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              type="button"
              onClick={() => setMode('learn')}
              className={`px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                isLearn
                  ? 'bg-teal-500 text-white shadow-md'
                  : 'text-teal-700 hover:bg-teal-100/50'
              }`}
            >
              <span className="hidden sm:inline">📚 </span>
              <span className="sm:hidden">📚</span>
              <span className="hidden md:inline ml-1">{t('nav.tabs.learn')}</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('practice')}
              className={`px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                isPractice
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'text-purple-700 hover:bg-purple-100/50'
              }`}
            >
              <span className="hidden sm:inline">🎯 </span>
              <span className="sm:hidden">🎯</span>
              <span className="hidden md:inline ml-1">{t('nav.tabs.practice')}</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('applications')}
              className={`px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                isApplications
                  ? 'bg-gradient-to-r from-teal-500 to-purple-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100/50'
              }`}
            >
              <span className="hidden sm:inline">🌍 </span>
              <span className="sm:hidden">🌍</span>
              <span className="hidden lg:inline ml-1">{t('nav.tabs.applications')}</span>
            </button>

            <div className="ml-1 sm:ml-2 md:ml-4">
              <LanguageSelector />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

// ============================================================================
// Convection Learn Mode Component (inline)
// ============================================================================
interface StepDataInterface {
  id: number;
  title: string;
  description: string;
  type: 'intro' | 'explanation' | 'practice' | 'real_world';
  animationData?: any;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  temp: 'hot' | 'cold';
  opacity: number;
}

const DEFAULT_STEPS: StepDataInterface[] = [
  {
    id: 1,
    title: "What is Convection?",
    description: "Convection is the process of heat transfer through the actual movement of particles in fluids (liquids and gases). Unlike conduction where particles stay in place, in convection, the heated particles themselves move from one place to another.",
    type: 'intro'
  },
  {
    id: 2,
    title: "Activity 7.2: Paper Cup Experiment",
    description: "Two paper cups are hung on a stick. When a candle is placed under one cup, the hot air inside rises, making that cup tilt upward. This demonstrates that hot air is lighter than cold air and rises up.",
    type: 'explanation',
    animationData: { experiment: 'paper_cups' }
  },
  {
    id: 3,
    title: "Why Does Hot Air Rise?",
    description: "When air is heated, it expands and occupies more space. This makes it less dense (lighter) compared to the surrounding cold air. The lighter hot air rises up, while heavier cold air moves down to take its place.",
    type: 'explanation',
    animationData: { experiment: 'hot_air_rising' }
  },
  {
    id: 4,
    title: "Convection in Liquids",
    description: "Water at the bottom of a beaker gets heated first. It expands, becomes lighter, and rises up. Cooler water from the sides moves down to replace it. This creates a convection current - a continuous cycle of rising hot water and sinking cold water.",
    type: 'explanation',
    animationData: { experiment: 'water_heating' }
  },
  {
    id: 5,
    title: "Interactive: Sea Breeze (Day)",
    description: "During the day, land heats up faster than water. Hot air above the land rises, and cooler air from the sea moves toward the land to replace it. This is called sea breeze, which brings relief on hot days.",
    type: 'practice',
    animationData: { experiment: 'sea_breeze' }
  },
  {
    id: 6,
    title: "Interactive: Land Breeze (Night)",
    description: "At night, land cools faster than water. Air above the sea is warmer and rises. Cooler air from the land moves toward the sea. This is called land breeze, and it reverses the direction of daytime winds.",
    type: 'practice',
    animationData: { experiment: 'land_breeze' }
  }
];

const ConvectionLearnMode: React.FC = () => {
  const { t, language } = useLanguage();
  const width = 800;
  const height = 500;

  const steps: StepDataInterface[] = useMemo(() => {
    const translated = t('convection.learn.steps', { returnObjects: true }) as unknown;
    const base: StepDataInterface[] =
      Array.isArray(translated) && translated.length
        ? (translated as StepDataInterface[])
        : DEFAULT_STEPS;

    return base.map((step, index) => ({
      ...step,
      type: (step.type || DEFAULT_STEPS[index]?.type || 'intro') as StepDataInterface['type'],
      animationData: DEFAULT_STEPS[index]?.animationData ?? step.animationData,
    }));
  }, [t, language]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [animationFrame, setAnimationFrame] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const currentStep = steps[currentStepIndex] || {
    id: 0,
    title: '',
    description: '',
    type: 'intro' as const
  };

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex(prev => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, 8000);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, steps.length]);

  useEffect(() => {
    initializeAnimation();
  }, [currentStep]);

  useEffect(() => {
    const animate = () => {
      setAnimationFrame(prev => prev + 1);
      drawAnimation();
      animationRef.current = requestAnimationFrame(animate);
    };

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, particles, currentStep]);

  const initializeAnimation = () => {
    const newParticles: Particle[] = [];
    
    if (currentStep.animationData?.experiment === 'hot_air_rising') {
      for (let i = 0; i < 30; i++) {
        newParticles.push({
          x: width / 2 + (Math.random() - 0.5) * 100,
          y: height - 100 + Math.random() * 50,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -1 - Math.random() * 0.5,
          temp: 'hot',
          opacity: 0.7 + Math.random() * 0.3
        });
      }
      
      for (let i = 0; i < 20; i++) {
        newParticles.push({
          x: Math.random() * width,
          y: Math.random() * 150,
          vx: (Math.random() - 0.5) * 0.3,
          vy: 0.5 + Math.random() * 0.3,
          temp: 'cold',
          opacity: 0.5 + Math.random() * 0.3
        });
      }
    }

    setParticles(newParticles);
  };

  const drawAnimation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    if (currentStep.animationData?.experiment === 'paper_cups') {
      drawPaperCupsExperiment(ctx);
    } else if (currentStep.animationData?.experiment === 'hot_air_rising') {
      drawHotAirRising(ctx);
    } else if (currentStep.animationData?.experiment === 'water_heating') {
      drawWaterHeating(ctx);
    } else if (currentStep.animationData?.experiment === 'sea_breeze') {
      drawSeaBreeze(ctx);
    } else if (currentStep.animationData?.experiment === 'land_breeze') {
      drawLandBreeze(ctx);
    } else {
      drawIntroAnimation(ctx);
    }

    updateParticles();
  };

  const drawPaperCupsExperiment = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(width / 2 - 200, 150, 400, 10);

    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(width / 2 - 120, 150);
    ctx.lineTo(width / 2 - 120, 230);
    ctx.stroke();

    const tiltY = Math.sin(animationFrame * 0.05) * 20;
    ctx.beginPath();
    ctx.moveTo(width / 2 + 120, 150);
    ctx.lineTo(width / 2 + 120, 230 - tiltY);
    ctx.stroke();

    ctx.fillStyle = '#F5F5DC';
    ctx.beginPath();
    ctx.moveTo(width / 2 - 140, 230);
    ctx.lineTo(width / 2 - 100, 230);
    ctx.lineTo(width / 2 - 95, 280);
    ctx.lineTo(width / 2 - 145, 280);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#8B7355';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.save();
    ctx.translate(width / 2 + 120, 230 - tiltY);
    ctx.rotate(-tiltY * 0.01);
    ctx.translate(-(width / 2 + 120), -(230 - tiltY));
    
    ctx.fillStyle = '#FFE4B5';
    ctx.beginPath();
    ctx.moveTo(width / 2 + 100, 230 - tiltY);
    ctx.lineTo(width / 2 + 140, 230 - tiltY);
    ctx.lineTo(width / 2 + 145, 280 - tiltY);
    ctx.lineTo(width / 2 + 95, 280 - tiltY);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#8B7355';
    ctx.stroke();
    ctx.restore();

    drawCandle(ctx, width / 2 + 120, height - 80);

    for (let i = 0; i < 5; i++) {
      const offset = (animationFrame + i * 10) % 100;
      ctx.fillStyle = `rgba(255, 100, 0, ${0.3 - offset / 300})`;
      ctx.beginPath();
      ctx.arc(width / 2 + 120, height - 80 - offset, 15 - offset / 10, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#000';
    ctx.font = 'bold 16px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(t('convection.learn.canvas.cup1'), width / 2 - 120, 310);
    ctx.fillText(t('convection.learn.canvas.cup2Heated'), width / 2 + 120, 310 - tiltY);
  };

  const drawHotAirRising = (ctx: CanvasRenderingContext2D) => {
    drawCandle(ctx, width / 2, height - 60);

    particles.forEach(particle => {
      if (particle.temp === 'hot') {
        ctx.fillStyle = `rgba(255, 100, 50, ${particle.opacity})`;
      } else {
        ctx.fillStyle = `rgba(100, 150, 255, ${particle.opacity})`;
      }
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = particle.temp === 'hot' ? 'rgba(255, 0, 0, 0.5)' : 'rgba(0, 0, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(particle.x, particle.y);
      ctx.lineTo(particle.x + particle.vx * 20, particle.y + particle.vy * 20);
      ctx.stroke();
    });

    ctx.fillStyle = '#FF6347';
    ctx.font = 'bold 18px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(t('convection.learn.canvas.hotAirRises'), width / 2, 50);

    ctx.fillStyle = '#4682B4';
    ctx.fillText(t('convection.learn.canvas.coldAirSinks'), width / 2 + 80, height - 20);
  };

  const drawWaterHeating = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 120, 120);
    ctx.lineTo(width / 2 - 100, 140);
    ctx.lineTo(width / 2 - 100, 350);
    ctx.lineTo(width / 2 + 100, 350);
    ctx.lineTo(width / 2 + 100, 140);
    ctx.lineTo(width / 2 + 120, 120);
    ctx.stroke();

    ctx.fillStyle = 'rgba(100, 150, 255, 0.3)';
    ctx.fillRect(width / 2 - 100, 150, 200, 200);

    const time = animationFrame * 0.02;
    
    ctx.strokeStyle = `rgba(255, 50, 50, ${0.5 + Math.sin(time) * 0.3})`;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(width / 2, 340);
    for (let y = 340; y > 160; y -= 10) {
      const x = width / 2 + Math.sin((340 - y) * 0.1 + time) * 15;
      ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.strokeStyle = `rgba(50, 100, 255, ${0.5 + Math.cos(time) * 0.3})`;
    
    ctx.beginPath();
    ctx.moveTo(width / 2 - 80, 160);
    for (let y = 160; y < 340; y += 10) {
      const x = width / 2 - 80 + Math.sin((y - 160) * 0.1 + time) * 10;
      ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(width / 2 + 80, 160);
    for (let y = 160; y < 340; y += 10) {
      const x = width / 2 + 80 + Math.sin((y - 160) * 0.1 + time) * 10;
      ctx.lineTo(x, y);
    }
    ctx.stroke();

    drawCandle(ctx, width / 2, height - 40);

    drawArrow(ctx, width / 2, 300, width / 2, 180, 'rgba(255, 0, 0, 0.7)');
    drawArrow(ctx, width / 2 + 80, 180, width / 2 + 80, 300, 'rgba(0, 0, 255, 0.7)');

    ctx.fillStyle = '#000';
    ctx.font = '14px Inter';
    ctx.fillText(t('convection.learn.canvas.hotWaterRises'), width / 2 - 150, 250);
    ctx.fillText(t('convection.learn.canvas.coldWaterSinks'), width / 2 + 110, 250);
  };

  const drawSeaBreeze = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(width - 80, 60, 35, 0, Math.PI * 2);
    ctx.fill();

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(width - 80 + Math.cos(angle) * 40, 60 + Math.sin(angle) * 40);
      ctx.lineTo(width - 80 + Math.cos(angle) * 55, 60 + Math.sin(angle) * 55);
      ctx.stroke();
    }

    ctx.fillStyle = '#DEB887';
    ctx.fillRect(0, height / 2, width / 2, height / 2);

    ctx.strokeStyle = 'rgba(255, 140, 0, 0.7)';
    ctx.lineWidth = 2;
    for (let y = height / 2 + 30; y < height / 2 + 100; y += 20) {
      ctx.beginPath();
      for (let x = 0; x < width / 2; x += 20) {
        const waveY = y + Math.sin((x - animationFrame * 2) * 0.12) * 4;
        if (x === 0) {
          ctx.moveTo(x, waveY);
        } else {
          ctx.lineTo(x, waveY);
        }
      }
      ctx.stroke();
    }

    const gradient = ctx.createLinearGradient(width / 2, 0, width, 0);
    gradient.addColorStop(0, '#4682B4');
    gradient.addColorStop(1, '#1E90FF');
    ctx.fillStyle = gradient;
    ctx.fillRect(width / 2, height / 2, width / 2, height / 2);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    for (let y = height / 2 + 40; y < height; y += 30) {
      ctx.beginPath();
      for (let x = width / 2; x < width; x += 20) {
        const waveY = y + Math.sin((x - animationFrame * 2) * 0.1) * 5;
        if (x === width / 2) {
          ctx.moveTo(x, waveY);
        } else {
          ctx.lineTo(x, waveY);
        }
      }
      ctx.stroke();
    }

    for (let i = 0; i < 4; i++) {
      const offset = (animationFrame + i * 15) % 120;
      const x = width / 4 + (Math.random() - 0.5) * 100;
      ctx.fillStyle = `rgba(255, 100, 0, ${0.4 - offset / 300})`;
      ctx.beginPath();
      ctx.arc(x, height / 2 - offset, 20 - offset / 10, 0, Math.PI * 2);
      ctx.fill();
    }

    const arrowY = height / 2 - 60;
    for (let i = 0; i < 3; i++) {
      const x = width / 2 + 250 - ((animationFrame + i * 40) % 250);
      if (x > width / 2 + 20) {
        drawArrow(ctx, x, arrowY, x - 30, arrowY, '#4169E1', 3);
      }
    }

    ctx.fillStyle = '#000';
    ctx.font = 'bold 18px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(t('convection.learn.canvas.daytime'), width / 2, 30);
    
    ctx.font = '16px Inter';
    ctx.fillText(t('convection.learn.canvas.warmerLand'), width / 4, height - 30);
    ctx.fillText(t('convection.learn.canvas.coolerSea'), width * 3 / 4, height - 30);
    
    ctx.fillStyle = '#4169E1';
    ctx.font = 'bold 16px Inter';
    ctx.fillText(t('convection.learn.canvas.seaBreeze'), width / 2, arrowY - 20);
  };

  const drawLandBreeze = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#F0E68C';
    ctx.beginPath();
    ctx.arc(width - 80, 60, 30, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(200, 200, 150, 0.5)';
    ctx.beginPath();
    ctx.arc(width - 90, 55, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(width - 70, 65, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFF';
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * width;
      const y = Math.random() * (height / 2);
      const size = Math.random() * 2 + 1;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#8B7355';
    ctx.fillRect(0, height / 2, width / 2, height / 2);

    const gradient = ctx.createLinearGradient(width / 2, 0, width, 0);
    gradient.addColorStop(0, '#2F4F4F');
    gradient.addColorStop(1, '#4682B4');
    ctx.fillStyle = gradient;
    ctx.fillRect(width / 2, height / 2, width / 2, height / 2);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 2;
    for (let y = height / 2 + 30; y < height / 2 + 90; y += 20) {
      ctx.beginPath();
      for (let x = width / 2; x < width; x += 20) {
        const waveY = y + Math.sin((x + animationFrame * 2) * 0.12) * 5;
        if (x === width / 2) {
          ctx.moveTo(x, waveY);
        } else {
          ctx.lineTo(x, waveY);
        }
      }
      ctx.stroke();
    }

    for (let i = 0; i < 4; i++) {
      const offset = (animationFrame + i * 15) % 120;
      const x = width * 3 / 4 + (Math.random() - 0.5) * 100;
      ctx.fillStyle = `rgba(255, 200, 100, ${0.3 - offset / 400})`;
      ctx.beginPath();
      ctx.arc(x, height / 2 - offset, 18 - offset / 12, 0, Math.PI * 2);
      ctx.fill();
    }

    const arrowY = height / 2 - 60;
    for (let i = 0; i < 3; i++) {
      const x = width / 2 - 250 + ((animationFrame + i * 40) % 250);
      if (x < width / 2 - 20) {
        drawArrow(ctx, x, arrowY, x + 30, arrowY, '#9370DB', 3);
      }
    }

    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 18px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(t('convection.learn.canvas.nighttime'), width / 2, 30);
    
    ctx.font = '16px Inter';
    ctx.fillText(t('convection.learn.canvas.coolerLand'), width / 4, height - 30);
    ctx.fillText(t('convection.learn.canvas.warmerSea'), width * 3 / 4, height - 30);
    
    ctx.fillStyle = '#9370DB';
    ctx.font = 'bold 16px Inter';
    ctx.fillText(t('convection.learn.canvas.landBreeze'), width / 2, arrowY - 20);
  };

  const drawIntroAnimation = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.strokeRect(width / 2 - 150, height / 2 - 150, 300, 300);

    for (let i = 0; i < 8; i++) {
      const y = height / 2 + 130 - ((animationFrame + i * 20) % 250);
      ctx.fillStyle = `rgba(255, ${100 - (animationFrame + i * 20) % 250 / 2}, 0, 0.7)`;
      ctx.beginPath();
      ctx.arc(width / 2, y, 12, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let i = 0; i < 8; i++) {
      const y = height / 2 - 130 + ((animationFrame + i * 20) % 250);
      ctx.fillStyle = `rgba(0, ${100 + (animationFrame + i * 20) % 250 / 2}, 255, 0.7)`;
      ctx.beginPath();
      ctx.arc(width / 2 + 100, y, 12, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#FF4500';
    ctx.font = 'bold 20px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(t('convection.learn.canvas.hot'), width / 2, height / 2 + 180);

    ctx.fillStyle = '#4169E1';
    ctx.fillText(t('convection.learn.canvas.cold'), width / 2, height / 2 - 180);

    ctx.fillStyle = '#000';
    ctx.font = 'bold 24px Inter';
    ctx.fillText(t('convection.learn.canvas.convectionCurrent'), width / 2, height / 2 + 230);
  };

  const drawCandle = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.fillStyle = '#FBBF24';
    ctx.fillRect(x - 10, y, 20, 35);
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(x - 10, y, 20, 8);

    ctx.fillStyle = '#2C3E50';
    ctx.fillRect(x - 1, y - 5, 2, 8);

    ctx.fillStyle = '#FCD34D';
    ctx.beginPath();
    ctx.ellipse(x, y - 8, 6, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#3B82F6';
    ctx.beginPath();
    ctx.ellipse(x, y - 8, 3, 6, 0, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawArrow = (
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    color: string,
    width: number = 2
  ) => {
    const headLength = 15;
    const angle = Math.atan2(toY - fromY, toX - fromX);

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width;

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(
      toX - headLength * Math.cos(angle - Math.PI / 6),
      toY - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      toX - headLength * Math.cos(angle + Math.PI / 6),
      toY - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();
  };

  const updateParticles = () => {
    setParticles(prevParticles =>
      prevParticles.map(particle => {
        let newX = particle.x + particle.vx;
        let newY = particle.y + particle.vy;

        if (particle.temp === 'hot') {
          if (newY < 50) {
            newY = height - 100;
            newX = width / 2 + (Math.random() - 0.5) * 100;
          }
        } else {
          if (newY > height - 50) {
            newY = 50;
            newX = Math.random() * width;
          }
        }

        if (newX < 0) newX = width;
        if (newX > width) newX = 0;

        return { ...particle, x: newX, y: newY };
      })
    );
  };

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setAnimationFrame(0);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      setAnimationFrame(0);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const reset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(true);
    setAnimationFrame(0);
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Wind className="w-8 h-8" />
              <h1 className="text-3xl font-bold">{t('convection.learn.header.title')}</h1>
            </div>
            <p className="text-blue-100">{t('convection.learn.header.subtitle')}</p>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90">
              {t('convection.learn.step', { current: currentStepIndex + 1, total: steps.length })}
            </div>
            {currentStep?.type && (
              <div className="text-xs opacity-75 mt-1">
                {currentStep.type.toUpperCase()}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 bg-white bg-opacity-20 rounded-full h-2 overflow-hidden">
          <div
            className="h-2 bg-white rounded-full transition-all duration-500"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">{currentStep.title}</h2>

        <div className="mb-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border-2 border-blue-200">
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="w-full rounded-lg bg-white shadow-md"
          />
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-6 rounded-xl border-l-4 border-blue-500">
          <p className="text-gray-700 leading-relaxed text-lg">{currentStep.description}</p>
        </div>

        {currentStep?.type === 'practice' &&
          currentStep?.animationData?.experiment !== 'sea_breeze' &&
          currentStep?.animationData?.experiment !== 'land_breeze' && (
          <div className="mt-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-xl">
            <div className="flex items-center gap-2 text-green-800 font-semibold">
              <Thermometer className="w-5 h-5" />
              {t('convection.learn.indicators.practice')}
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-50 p-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition"
          >
            <ChevronLeft className="w-5 h-5" />
            {t('convection.learn.controls.previous')}
          </button>

          <div className="flex gap-3">
            <button
              onClick={togglePlay}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isPlaying ? t('convection.learn.controls.pause') : t('convection.learn.controls.play')}
            </button>

            <button
              onClick={reset}
              className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition"
            >
              <RotateCcw className="w-5 h-5" />
              {t('convection.learn.controls.reset')}
            </button>
          </div>

          <button
            onClick={nextStep}
            disabled={currentStepIndex === steps.length - 1}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-cyan-700 transition"
          >
            {t('convection.learn.controls.next')}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Real World Applications Component (inline)
// ============================================================================
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

const RealWorldApplications: React.FC = () => {
  const { t, language } = useLanguage();
  const [expandedApp, setExpandedApp] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Hindi translations for Real World Applications
  const hindiApplications: Application[] = [
    {
      id: 1,
      title: 'समुद्री हवा और भूमि हवा',
      category: 'Nature',
      icon: <Wind />,
      description: 'तटीय क्षेत्र अलग-अलग हीटिंग दरों के कारण दिन और रात में अलग-अलग हवा पैटर्न का अनुभव करते हैं।',
      howItWorks: 'दिन के दौरान, जमीन पानी से तेजी से गर्म होती है। जमीन से गर्म हवा ऊपर उठती है, ठंडी समुद्री हवा अंदर आती है (समुद्री हवा)। रात में, जमीन तेजी से ठंडी होती है। समुद्र से गर्म हवा ऊपर उठती है, जमीन से ठंडी हवा समुद्र की ओर जाती है (भूमि हवा)।',
      scienceBehind: 'जमीन की विशिष्ट ऊष्मा क्षमता कम होती है (तेजी से गर्म/ठंडी होती है)। पानी की विशिष्ट ऊष्मा क्षमता अधिक होती है (धीरे-धीरे गर्म/ठंडी होती है)। यह तापमान अंतर दबाव अंतर पैदा करता है, जिससे संवहन के माध्यम से हवा की गति होती है।',
      realExample: 'केरल (पाठ्यपुस्तक में उल्लिखित तटीय क्षेत्र) में, लोग गर्म दोपहर में ठंडी समुद्री हवा का अनुभव करते हैं, जो प्राकृतिक राहत प्रदान करती है। इसीलिए तटीय क्षेत्रों में घरों में समुद्र की ओर खिड़कियां होती हैं - इस ताज़ा हवा को पकड़ने के लिए!',
      benefits: [
        'गर्म दिनों में प्राकृतिक ठंडक',
        'तटीय तापमान को मध्यम रखता है',
        'नौकायन के लिए अनुमानित हवा पैटर्न बनाता है',
        'चरम तापमान भिन्नताओं को कम करता है',
        'तटीय घरों में ताज़ी हवा का संचार प्रदान करता है'
      ],
      difficulty: 'everyday'
    },
    {
      id: 2,
      title: 'संवहन के साथ कमरा गर्म करना',
      category: 'Home',
      icon: <Home />,
      description: 'कमरे के हीटर हवा संचार पैटर्न बनाकर पूरे कमरे को कुशलतापूर्वक गर्म करने के लिए संवहन का उपयोग करते हैं।',
      howItWorks: 'हीटर इसके पास की हवा को गर्म करता है। गर्म हवा फैलती है, हल्की हो जाती है, छत तक उठती है। जैसे ही यह छत पर ठंडी होती है, यह सघन हो जाती है और दीवारों के साथ नीचे आती है। यह एक संवहन धारा बनाता है जो पूरे कमरे में गर्म हवा को प्रसारित करती है।',
      scienceBehind: 'गर्म हवा की घनत्व कम होती है (अणु अलग-अलग फैलते हैं)। ठंडी हवा की घनत्व अधिक होती है (अणु एक साथ करीब होते हैं)। घनत्व अंतर उत्प्लावन बल पैदा करता है, जो संवहन धाराओं नामक निरंतर संचार बनाता है।',
      realExample: 'हिमालयी क्षेत्रों में, पारंपरिक बुखारी (लकड़ी का हीटर) का उपयोग किया जाता है। यह हवा को गर्म करता है जो ऊपर उठती है और पूरे कमरे में प्रसारित होती है। पंखे के बिना भी, पूरा कमरा प्राकृतिक संवहन के माध्यम से गर्म हो जाता है!',
      benefits: [
        'पूरे कमरे का कुशल हीटिंग',
        'यांत्रिक संचार की आवश्यकता नहीं',
        'समान तापमान वितरण',
        'ऊर्जा कुशल हीटिंग',
        'बिजली के बिना प्राकृतिक रूप से काम करता है'
      ],
      difficulty: 'everyday'
    },
    {
      id: 3,
      title: 'अगरबत्ती से उठता धुआं',
      category: 'Everyday',
      icon: <Sparkles />,
      description: 'अगरबत्ती (धूप) से धुआं हमेशा ऊपर की ओर उठता है, जो गैसों में संवहन को प्रदर्शित करता है।',
      howItWorks: 'जब अगरबत्ती जलती है, तो यह धुआं (गर्म गैसें + छोटे ठोस कण) पैदा करती है। ये गर्म गैसें आसपास की हवा से गर्म होती हैं, जिससे वे हल्की हो जाती हैं। संवहन के माध्यम से, हल्का धुआं ऊपर की ओर उठता है।',
      scienceBehind: 'धुएं का तापमान परिवेशी हवा से अधिक होता है। गर्म गैसें फैलती हैं, घनत्व को ~1.2 kg/m³ से ~0.9 kg/m³ तक कम करती हैं। कम घनत्व ऊपर की ओर उत्प्लावन बल बनाता है, जिससे धुआं ऊपर उठता है।',
      realExample: 'भारत भर में मंदिरों, घरों और धार्मिक समारोहों में, आप अगरबत्ती के धुएं को सीधे ऊपर उठते देख सकते हैं जब हवा नहीं होती। यह काम पर शुद्ध संवहन है!',
      benefits: [
        'संवहन को दृश्य रूप से प्रदर्शित करता है',
        'संचार के माध्यम से प्राकृतिक वायु ताज़गी',
        'धुआं फर्श के स्तर पर जमा नहीं होता',
        'दिखाता है कि तापमान घनत्व को प्रभावित करता है',
        'ऊष्मा स्थानांतरण का शैक्षिक प्रदर्शन'
      ],
      difficulty: 'everyday'
    },
    {
      id: 4,
      title: 'उबलता पानी और खाना बनाना',
      category: 'Kitchen',
      icon: <Coffee />,
      description: 'पानी संवहन धाराओं के कारण पूरे बर्तन में समान रूप से उबलता है, न कि केवल नीचे।',
      howItWorks: 'बर्तन के नीचे का पानी आग से गर्म होता है। यह फैलता है, हल्का हो जाता है, और ऊपर उठता है। ऊपर/बाजू से ठंडा पानी इसे बदलने के लिए नीचे जाता है। यह निरंतर चक्र सभी पानी को समान रूप से गर्म करता है।',
      scienceBehind: '100°C पर पानी का घनत्व ~958 kg/m³ होता है। 20°C पर पानी का घनत्व ~998 kg/m³ होता है। 4% घनत्व अंतर मजबूत संवहन धाराएं बनाता है। संवहन के माध्यम से ऊष्मा स्थानांतरण स्थिर पानी में चालन की तुलना में 100-1000 गुना तेज होता है।',
      realExample: 'जब दादी थुक्पा (पाठ्यपुस्तक में उल्लिखित) बनाती हैं, तो उन्हें लगातार हिलाने की जरूरत नहीं होती। संवहन धाराएं स्वाभाविक रूप से सूप को मिलाती हैं, गर्मी को समान रूप से वितरित करती हैं। इसीलिए पानी समान रूप से उबलता है, न कि केवल नीचे!',
      benefits: [
        'तरल पदार्थों का समान हीटिंग',
        'तेज खाना बनाने का समय',
        'भोजन में गर्म स्थान नहीं',
        'सामग्री का प्राकृतिक मिश्रण',
        'ऊर्जा कुशल खाना बनाना'
      ],
      difficulty: 'everyday'
    },
    {
      id: 5,
      title: 'गर्म हवा के गुब्बारे',
      category: 'Technology',
      icon: <Sun />,
      description: 'गर्म हवा के गुब्बारे संवहन और उत्प्लावन के सिद्धांत का उपयोग करके तैरते और उड़ते हैं।',
      howItWorks: 'बर्नर गुब्बारे के अंदर की हवा को गर्म करता है। गर्म हवा फैलती है और बाहर की हवा से कम घनी हो जाती है। हल्की गर्म हवा उत्प्लावन बल बनाती है, गुब्बारे को ऊपर उठाती है। ठंडी हवा इसे नीचे लाती है।',
      scienceBehind: '100°C पर, हवा का घनत्व ~0.95 kg/m³ तक गिर जाता है (20°C पर 1.2 kg/m³ से)। एक बड़ा गुब्बारा कई हज़ार किलोग्राम हवा को विस्थापित करता है, टोकरी, यात्रियों और उपकरणों को उठाने के लिए पर्याप्त उत्प्लावन बनाता है।',
      realExample: 'राजस्थान और अन्य स्थानों में गर्म हवा के गुब्बारे उत्सव इस सिद्धांत को प्रदर्शित करते हैं। 2,800 m³ आयतन वाला एक गुब्बारा 4-5 लोगों प्लस उपकरणों को उठा सकता है, सभी संवहन के माध्यम से गर्म हवा से संचालित!',
      benefits: [
        'इंजन के बिना मानव उड़ान सक्षम करता है',
        'शांतिपूर्ण, शांत उड़ान का अनुभव',
        'वैज्ञानिक सिद्धांतों को प्रदर्शित करता है',
        'पर्यटन और मनोरंजन गतिविधि',
        'पर्यावरण के अनुकूल परिवहन'
      ],
      difficulty: 'everyday'
    },
    {
      id: 6,
      title: 'चिमनी और वेंटिलेशन',
      category: 'Home',
      icon: <Home />,
      description: 'चिमनी यांत्रिक पंखे के बिना धुआं हटाने और निरंतर वायु प्रवाह बनाने के लिए संवहन का उपयोग करती है।',
      howItWorks: 'आग से गर्म धुआं और गैसें बाहर की हवा से कम घनी होती हैं। वे चिमनी के माध्यम से ऊपर उठती हैं, नीचे कम दबाव बनाती हैं। ताज़ी हवा नीचे से अंदर खींची जाती है ताकि उठती गर्म हवा को बदल सके, निरंतर ड्राफ्ट बनाती है।',
      scienceBehind: 'स्टैक प्रभाव: दबाव अंतर प्रवाह को चलाता है। लंबी चिमनी मजबूत ड्राफ्ट बनाती है। 200°C का तापमान अंतर केवल प्राकृतिक संवहन के माध्यम से 5-10 m/s की वायु प्रवाह वेग बना सकता है।',
      realExample: 'बुखारी (पाठ्यपुस्तक में उल्लिखित पारंपरिक हिमालयी हीटर) में एक चिमनी पाइप होता है। धुआं स्वाभाविक रूप से इसके माध्यम से ऊपर उठता है, बाहर निकलता है जबकि कमरे में ताज़ी हवा खींचता है - सभी बिना किसी पंखे या बिजली के!',
      benefits: [
        'धुआं और प्रदूषकों को स्वाभाविक रूप से हटाता है',
        'बिजली की आवश्यकता नहीं',
        'ताज़ी हवा का संचार बनाता है',
        'इनडोर वायु गुणवत्ता में सुधार करता है',
        'सदियों पुरानी विश्वसनीय तकनीक'
      ],
      difficulty: 'everyday'
    },
    {
      id: 7,
      title: 'समुद्री धाराएं',
      category: 'Nature',
      icon: <Globe />,
      description: 'पृथ्वी की जलवायु को नियंत्रित करने वाली विशाल समुद्री धाराएं संवहन द्वारा संचालित होती हैं।',
      howItWorks: 'सूर्य भूमध्य रेखा के पास पानी को गर्म करता है। गर्म पानी फैलता है और सतह पर ध्रुवों की ओर बढ़ता है। ध्रुवों पर, पानी ठंडा होता है, सघन हो जाता है, नीचे जाता है, और गहरे स्तरों पर भूमध्य रेखा की ओर लौटता है। यह वैश्विक कन्वेयर बेल्ट बनाता है।',
      scienceBehind: 'थर्मोहलाइन संचार: तापमान (थर्मो) और लवणता (हैलाइन) अंतर द्वारा संचालित। भूमध्य रेखा पर गर्म पानी (25°C) ध्रुवों पर ठंडे पानी (2°C) से कम घना होता है। संवहन ग्रहीय पैमाने पर काम करता है।',
      realExample: 'गल्फ स्ट्रीम कैरिबियन से यूरोप तक गर्म पानी ले जाती है, यूके की जलवायु को समान अक्षांशों से कहीं अधिक गर्म बनाती है। यह विशाल संवहन धारा 1 मिलियन परमाणु ऊर्जा संयंत्रों जितनी गर्मी स्थानांतरित करती है!',
      benefits: [
        'वैश्विक जलवायु को नियंत्रित करता है',
        'ग्रह के चारों ओर गर्मी वितरित करता है',
        'समुद्री पारिस्थितिकी तंत्र का समर्थन करता है',
        'मौसम पैटर्न को प्रभावित करता है',
        'कुछ क्षेत्रों को रहने योग्य बनाता है'
      ],
      difficulty: 'everyday'
    },
    {
      id: 8,
      title: 'वायुमंडलीय संचार और मौसम',
      category: 'Nature',
      icon: <CloudSnow />,
      description: 'वैश्विक हवा पैटर्न और मौसम प्रणालियां पृथ्वी के वायुमंडल में विशाल संवहन द्वारा बनाई जाती हैं।',
      howItWorks: 'सूर्य भूमध्य रेखा को ध्रुवों से अधिक गर्म करता है। गर्म भूमध्यरेखीय हवा ऊपर उठती है (कम दबाव)। हवा सतह पर ध्रुवों से भूमध्य रेखा की ओर चलती है, व्यापारिक हवाएं बनाती है। भूमध्य रेखा पर उठती हवा उच्च ऊंचाई पर ध्रुवों की ओर चलती है।',
      scienceBehind: 'हैडली सेल: वायुमंडल में बड़े पैमाने पर संवहन सेल। भूमध्य रेखा और ध्रुवों के बीच 50°C का तापमान अंतर संचार को चलाता है। कोरिओलिस प्रभाव रोटेशन जोड़ता है, जटिल पैटर्न बनाता है।',
      realExample: 'भारत में मानसून संवहन द्वारा संचालित होता है! गर्मी: जमीन महासागर से तेजी से गर्म होती है, भारत के ऊपर गर्म हवा ऊपर उठती है, महासागर से नम हवा बारिश लाती है। यह विशाल संवहन प्रणाली 1.4 अरब लोगों को खिलाती है!',
      benefits: [
        'वैश्विक हवा पैटर्न बनाता है',
        'मानसून बारिश को चलाता है',
        'वैश्विक रूप से गर्मी वितरित करता है',
        'बादल निर्माण सक्षम करता है',
        'पृथ्वी को रहने योग्य बनाता है'
      ],
      difficulty: 'everyday'
    }
  ];

  // Gujarati translations for Real World Applications
  const gujaratiApplications: Application[] = [
    {
      id: 1,
      title: 'સમુદ્રની હવા અને જમીનની હવા',
      category: 'Nature',
      icon: <Wind />,
      description: 'કિનારાના વિસ્તારો જમીન અને પાણીની વિવિધ હીટિંગ દરોના કારણે દિવસ અને રાત્રિ દરમિયાન વિવિધ પવન પેટર્નનો અનુભવ કરે છે.',
      howItWorks: 'દિવસ દરમિયાન, જમીન પાણી કરતાં ઝડપથી ગરમ થાય છે. જમીનથી ગરમ હવા ઉપર ઉઠે છે, ઠંડી સમુદ્રની હવા અંદર આવે છે (સમુદ્રની હવા). રાત્રે, જમીન ઝડપથી ઠંડી થાય છે. સમુદ્રથી ગરમ હવા ઉપર ઉઠે છે, જમીનથી ઠંડી હવા સમુદ્ર તરફ જાય છે (જમીનની હવા).',
      scienceBehind: 'જમીનની ચોક્કસ ઉષ્ણતા ક્ષમતા ઓછી છે (ઝડપથી ગરમ/ઠંડી થાય છે). પાણીની ચોક્કસ ઉષ્ણતા ક્ષમતા વધુ છે (ધીમે ધીમે ગરમ/ઠંડી થાય છે). આ તાપમાનનો તફાવત દબાણનો તફાવત બનાવે છે, જે સંવહન દ્વારા હવાની ગતિનું કારણ બને છે.',
      realExample: 'કેરળ (પાઠ્યપુસ્તકમાં ઉલ્લેખિત કિનારાનો વિસ્તાર) માં, લોકો ગરમ બપોરે ઠંડી સમુદ્રની હવાનો અનુભવ કરે છે, જે કુદરતી રાહત આપે છે. તેથી જ કિનારાના વિસ્તારોમાં ઘરોમાં સમુદ્રની તરફ વિન્ડો હોય છે - આ તાજી હવા પકડવા માટે!',
      benefits: [
        'ગરમ દિવસો દરમિયાન કુદરતી ઠંડક',
        'કિનારાના તાપમાનને મધ્યમ રાખે છે',
        'નૌકાયન માટે અનુમાનિત પવન પેટર્ન બનાવે છે',
        'આત્યંતિક તાપમાન ભિન્નતાઓને ઘટાડે છે',
        'કિનારાના ઘરોમાં તાજી હવાનું પરિભ્રમણ પ્રદાન કરે છે'
      ],
      difficulty: 'everyday'
    },
    {
      id: 2,
      title: 'સંવહન સાથે રૂમ હીટિંગ',
      category: 'Home',
      icon: <Home />,
      description: 'રૂમ હીટર હવા પરિભ્રમણ પેટર્ન બનાવીને સંપૂર્ણ રૂમને કાર્યક્ષમ રીતે ગરમ કરવા માટે સંવહનનો ઉપયોગ કરે છે.',
      howItWorks: 'હીટર તેની નજીકની હવાને ગરમ કરે છે. ગરમ હવા ફેલાય છે, હળવી બને છે, છત સુધી ઉપર ઉઠે છે. જેમ જેમ તે છત પર ઠંડી થાય છે, તે ગાઢ બને છે અને દીવાલો સાથે નીચે આવે છે. આ સંવહન ધારા બનાવે છે જે સંપૂર્ણ રૂમમાં ગરમ હવાને પરિભ્રમણ કરાવે છે.',
      scienceBehind: 'ગરમ હવાની ઘનતા ઓછી છે (અણુઓ અલગ-અલગ ફેલાય છે). ઠંડી હવાની ઘનતા વધુ છે (અણુઓ એકબીજાની નજીક હોય છે). ઘનતાનો તફાવત ઉત્પ્લાવન બળ બનાવે છે, જે સંવહન ધારાઓ નામના સતત પરિભ્રમણ બનાવે છે.',
      realExample: 'હિમાલયન વિસ્તારોમાં, પરંપરાગત બુખારી (લાકડાનો હીટર) ઉપયોગમાં લેવાય છે. તે હવાને ગરમ કરે છે જે ઉપર ઉઠે છે અને સંપૂર્ણ રૂમમાં પરિભ્રમણ કરે છે. પંખા વગર પણ, સંપૂર્ણ રૂમ કુદરતી સંવહન દ્વારા ગરમ થાય છે!',
      benefits: [
        'સંપૂર્ણ રૂમનું કાર્યક્ષમ હીટિંગ',
        'યાંત્રિક પરિભ્રમણની જરૂર નથી',
        'સમાન તાપમાન વિતરણ',
        'ઊર્જા કાર્યક્ષમ હીટિંગ',
        'વીજળી વગર કુદરતી રીતે કામ કરે છે'
      ],
      difficulty: 'everyday'
    },
    {
      id: 3,
      title: 'અગરબત્તીમાંથી ઉઠતો ધુમાડો',
      category: 'Everyday',
      icon: <Sparkles />,
      description: 'અગરબત્તી (ધૂપ) માંથી ધુમાડો હંમેશા ઉપરની તરફ ઉઠે છે, જે વાયુઓમાં સંવહનને દર્શાવે છે.',
      howItWorks: 'જ્યારે અગરબત્તી બળે છે, ત્યારે તે ધુમાડો (ગરમ વાયુઓ + નાના ઘન કણો) ઉત્પન્ન કરે છે. આ ગરમ વાયુઓ આસપાસની હવા કરતાં ગરમ હોય છે, જે તેમને હળવા બનાવે છે. સંવહન દ્વારા, હળવો ધુમાડો ઉપરની તરફ ઉઠે છે.',
      scienceBehind: 'ધુમાડાનું તાપમાન પર્યાવરણીય હવા કરતાં વધુ છે. ગરમ વાયુઓ ફેલાય છે, ઘનતાને ~1.2 kg/m³ થી ~0.9 kg/m³ સુધી ઘટાડે છે. ઓછી ઘનતા ઉપરની તરફ ઉત્પ્લાવન બળ બનાવે છે, જે ધુમાડાને ઉપર ઉઠાડે છે.',
      realExample: 'ભારત ભરમાં મંદિરો, ઘરો અને ધાર્મિક સમારંભોમાં, તમે અગરબત્તીના ધુમાડાને સીધા ઉપર ઉઠતા જોઈ શકો છો જ્યારે પવન નથી. આ કામ પર શુદ્ધ સંવહન છે!',
      benefits: [
        'સંવહનને દ્રશ્ય રીતે દર્શાવે છે',
        'પરિભ્રમણ દ્વારા કુદરતી હવા તાજગી',
        'ધુમાડો ફ્લોર સ્તરે જમા થતો નથી',
        'દર્શાવે છે કે તાપમાન ઘનતાને અસર કરે છે',
        'ઉષ્ણતા સ્થાનાંતરણનું શૈક્ષણિક પ્રદર્શન'
      ],
      difficulty: 'everyday'
    },
    {
      id: 4,
      title: 'ઉકળતું પાણી અને રસોઈ',
      category: 'Kitchen',
      icon: <Coffee />,
      description: 'પાણી સંવહન ધારાઓના કારણે સંપૂર્ણ પોટમાં સમાન રીતે ઉકળે છે, માત્ર નીચે જ નહીં.',
      howItWorks: 'પોટના નીચેનું પાણી જ્યોત દ્વારા ગરમ થાય છે. તે ફેલાય છે, હળવું બને છે અને ઉપર ઉઠે છે. ઉપર/બાજુઓથી ઠંડું પાણી તેને બદલવા માટે નીચે જાય છે. આ સતત ચક્ર બધા પાણીને સમાન રીતે ગરમ કરે છે.',
      scienceBehind: '100°C પર પાણીની ઘનતા ~958 kg/m³ છે. 20°C પર પાણીની ઘનતા ~998 kg/m³ છે. 4% ઘનતાનો તફાવત મજબૂત સંવહન ધારાઓ બનાવે છે. સંવહન દ્વારા ઉષ્ણતા સ્થાનાંતરણ સ્થિર પાણીમાં conduction કરતાં 100-1000 ગણું ઝડપી છે.',
      realExample: 'જ્યારે દાદી થુપ્પા (પાઠ્યપુસ્તકમાં ઉલ્લેખિત) બનાવે છે, ત્યારે તેમને સતત હલાવવાની જરૂર નથી. સંવહન ધારાઓ કુદરતી રીતે સૂપને મિશ્રિત કરે છે, ઉષ્ણતાને સમાન રીતે વિતરિત કરે છે. તેથી જ પાણી સમાન રીતે ઉકળે છે, માત્ર નીચે જ નહીં!',
      benefits: [
        'પ્રવાહીઓનું સમાન હીટિંગ',
        'ઝડપી રસોઈનો સમય',
        'ખોરાકમાં ગરમ સ્થાનો નથી',
        'ઘટકોનું કુદરતી મિશ્રણ',
        'ઊર્જા કાર્યક્ષમ રસોઈ'
      ],
      difficulty: 'everyday'
    },
    {
      id: 5,
      title: 'ગરમ હવાના ગુબ્બારા',
      category: 'Technology',
      icon: <Sun />,
      description: 'ગરમ હવાના ગુબ્બારા સંવહન અને ઉત્પ્લાવનના સિદ્ધાંતનો ઉપયોગ કરીને તરે છે અને ઉડે છે.',
      howItWorks: 'બર્નર ગુબ્બારાની અંદરની હવાને ગરમ કરે છે. ગરમ હવા ફેલાય છે અને બહારની હવા કરતાં ઓછી ઘનતા બને છે. હળવી ગરમ હવા ઉત્પ્લાવન બળ બનાવે છે, ગુબ્બારાને ઉપર ઉઠાડે છે. ઠંડી હવા તેને નીચે લાવે છે.',
      scienceBehind: '100°C પર, હવાની ઘનતા ~0.95 kg/m³ સુધી ઘટે છે (20°C પર 1.2 kg/m³ થી). એક મોટો ગુબ્બારો કેટલાક હજાર કિલોગ્રામ હવાને વિસ્થાપિત કરે છે, ટોપલી, મુસાફરો અને સાધનોને ઉઠાવવા માટે પૂરતું ઉત્પ્લાવન બનાવે છે.',
      realExample: 'રાજસ્થાન અને અન્ય સ્થળોમાં ગરમ હવાના ગુબ્બારા તહેવારો આ સિદ્ધાંતને પ્રદર્શિત કરે છે. 2,800 m³ વોલ્યુમવાળો ગુબ્બારો 4-5 લોકો પ્લસ સાધનોને ઉઠાવી શકે છે, બધા સંવહન દ્વારા ગરમ હવાથી સંચાલિત!',
      benefits: [
        'ઇજને વગર માનવ ઉડાન સક્ષમ કરે છે',
        'શાંતિપૂર્ણ, શાંત ઉડાનનો અનુભવ',
        'વૈજ્ઞાનિક સિદ્ધાંતોને દર્શાવે છે',
        'પર્યટન અને મનોરંજન પ્રવૃત્તિ',
        'પર્યાવરણ-મૈત્રીપૂર્ણ પરિવહન'
      ],
      difficulty: 'everyday'
    },
    {
      id: 6,
      title: 'ચિમની અને વેન્ટિલેશન',
      category: 'Home',
      icon: <Home />,
      description: 'ચિમની યાંત્રિક પંખા વગર ધુમાડો દૂર કરવા અને સતત વાયુ પ્રવાહ બનાવવા માટે સંવહનનો ઉપયોગ કરે છે.',
      howItWorks: 'આગમાંથી ગરમ ધુમાડો અને વાયુઓ બહારની હવા કરતાં ઓછી ઘનતા હોય છે. તે ચિમની દ્વારા ઉપર ઉઠે છે, નીચે ઓછું દબાણ બનાવે છે. તાજી હવા નીચેથી અંદર ખેંચાય છે જેથી ઉઠતી ગરમ હવાને બદલી શકાય, સતત ડ્રાફ્ટ બનાવે છે.',
      scienceBehind: 'સ્ટેક અસર: દબાણનો તફાવત પ્રવાહને ચલાવે છે. લાંબી ચિમની મજબૂત ડ્રાફ્ટ બનાવે છે. 200°C નો તાપમાન તફાવત માત્ર કુદરતી સંવહન દ્વારા 5-10 m/s ની વાયુ પ્રવાહ વેગ બનાવી શકે છે.',
      realExample: 'બુખારી (પાઠ્યપુસ્તકમાં ઉલ્લેખિત પરંપરાગત હિમાલયન હીટર) માં એક ચિમની પાઇપ હોય છે. ધુમાડો કુદરતી રીતે તેના દ્વારા ઉપર ઉઠે છે, બહાર નીકળે છે જ્યારે રૂમમાં તાજી હવા ખેંચે છે - બધા કોઈ પંખા અથવા વીજળી વગર!',
      benefits: [
        'ધુમાડો અને પ્રદૂષકોને કુદરતી રીતે દૂર કરે છે',
        'વીજળીની જરૂર નથી',
        'તાજી હવાનું પરિભ્રમણ બનાવે છે',
        'ઇનડોર વાયુ ગુણવત્તામાં સુધારો કરે છે',
        'સદીઓ જૂની વિશ્વસનીય ટેકનોલોજી'
      ],
      difficulty: 'everyday'
    },
    {
      id: 7,
      title: 'સમુદ્રની ધારાઓ',
      category: 'Nature',
      icon: <Globe />,
      description: 'પૃથ્વીની આબોહવાને નિયંત્રિત કરતી વિશાળ સમુદ્રની ધારાઓ સંવહન દ્વારા સંચાલિત થાય છે.',
      howItWorks: 'સૂર્ય ભૂમધ્ય રેખાની નજીક પાણીને ગરમ કરે છે. ગરમ પાણી ફેલાય છે અને સપાટી પર ધ્રુવો તરફ આગળ વધે છે. ધ્રુવો પર, પાણી ઠંડું થાય છે, ગાઢ બને છે, નીચે જાય છે અને ઊંડા સ્તરો પર ભૂમધ્ય રેખા તરફ પરત આવે છે. આ વૈશ્વિક કન્વેયર બેલ્ટ બનાવે છે.',
      scienceBehind: 'થર્મોહેલાઇન પરિભ્રમણ: તાપમાન (થર્મો) અને લવણતા (હેલાઇન) તફાવત દ્વારા સંચાલિત. ભૂમધ્ય રેખા પર ગરમ પાણી (25°C) ધ્રુવો પર ઠંડા પાણી (2°C) કરતાં ઓછી ઘનતા હોય છે. સંવહન ગ્રહ-સ્તરે કામ કરે છે.',
      realExample: 'ગલ્ફ સ્ટ્રીમ કેરિબિયનથી યુરોપ સુધી ગરમ પાણી લઈ જાય છે, UK ની આબોહવાને સમાન અક્ષાંશો કરતાં ખૂબ વધુ ગરમ બનાવે છે. આ વિશાળ સંવહન ધારા 1 મિલિયન પરમાણુ ઊર્જા પ્લાન્ટ જેટલી ઉષ્ણતા સ્થાનાંતરિત કરે છે!',
      benefits: [
        'વૈશ્વિક આબોહવાને નિયંત્રિત કરે છે',
        'ગ્રહની આસપાસ ઉષ્ણતા વિતરિત કરે છે',
        'સમુદ્રી પારિસ્થિતિકી તંત્રને સપોર્ટ કરે છે',
        'હવામાન પેટર્નને પ્રભાવિત કરે છે',
        'કેટલાક પ્રદેશોને રહેવા યોગ્ય બનાવે છે'
      ],
      difficulty: 'everyday'
    },
    {
      id: 8,
      title: 'વાયુમંડળીય પરિભ્રમણ અને હવામાન',
      category: 'Nature',
      icon: <CloudSnow />,
      description: 'વૈશ્વિક પવન પેટર્ન અને હવામાન સિસ્ટમો પૃથ્વીના વાયુમંડળમાં વિશાળ સંવહન દ્વારા બનાવવામાં આવે છે.',
      howItWorks: 'સૂર્ય ભૂમધ્ય રેખાને ધ્રુવો કરતાં વધુ ગરમ કરે છે. ગરમ ભૂમધ્યરેખીય હવા ઉપર ઉઠે છે (ઓછું દબાણ). હવા સપાટી પર ધ્રુવોથી ભૂમધ્ય રેખા તરફ ખસે છે, વેપારી પવનો બનાવે છે. ભૂમધ્ય રેખા પર ઉઠતી હવા ઊંચી ઊંચાઈ પર ધ્રુવો તરફ ખસે છે.',
      scienceBehind: 'હેડલી સેલ: વાયુમંડળમાં મોટા પાયે સંવહન સેલ. ભૂમધ્ય રેખા અને ધ્રુવો વચ્ચે 50°C નો તાપમાન તફાવત પરિભ્રમણને ચલાવે છે. કોરિયોલિસ અસર રોટેશન ઉમેરે છે, જટિલ પેટર્ન બનાવે છે.',
      realExample: 'ભારતમાં મોસમ સંવહન દ્વારા સંચાલિત થાય છે! ઉનાળો: જમીન મહાસાગર કરતાં ઝડપથી ગરમ થાય છે, ભારત પર ગરમ હવા ઉપર ઉઠે છે, મહાસાગરથી ભેજવાળી હવા વરસાદ લાવે છે. આ વિશાળ સંવહન સિસ્ટમ 1.4 અબજ લોકોને ખવડાવે છે!',
      benefits: [
        'વૈશ્વિક પવન પેટર્ન બનાવે છે',
        'મોસમ વરસાદને ચલાવે છે',
        'વૈશ્વિક રીતે ઉષ્ણતા વિતરિત કરે છે',
        'મેઘ નિર્માણ સક્ષમ કરે છે',
        'પૃથ્વીને રહેવા યોગ્ય બનાવે છે'
      ],
      difficulty: 'everyday'
    }
  ];

  const getApplications = (): Application[] => {
    try {
      // If language is Hindi, use Hindi translations directly
      if (language === 'hi') {
        return hindiApplications.map((app, index) => ({
          ...app,
          icon: [<Wind />, <Home />, <Sparkles />, <Coffee />, <Sun />, <Home />, <Globe />, <CloudSnow />][index] || <Lightbulb />
        }));
      }

      // If language is Gujarati, use Gujarati translations directly
      if (language === 'gu') {
        return gujaratiApplications.map((app, index) => ({
          ...app,
          icon: [<Wind />, <Home />, <Sparkles />, <Coffee />, <Sun />, <Home />, <Globe />, <CloudSnow />][index] || <Lightbulb />
        }));
      }

      // For English, try to load from translations
      const translationApps = t('convection.realWorld.applications', { returnObjects: true }) as unknown;
      if (!Array.isArray(translationApps) || translationApps.length === 0) {
        return [];
      }

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
    } catch (error) {
      console.warn('Error loading real world applications:', error);
      // Return appropriate language fallback
      if (language === 'hi') {
        return hindiApplications.map((app, index) => ({
          ...app,
          icon: [<Wind />, <Home />, <Sparkles />, <Coffee />, <Sun />, <Home />, <Globe />, <CloudSnow />][index] || <Lightbulb />
        }));
      }
      if (language === 'gu') {
        return gujaratiApplications.map((app, index) => ({
          ...app,
          icon: [<Wind />, <Home />, <Sparkles />, <Coffee />, <Sun />, <Home />, <Globe />, <CloudSnow />][index] || <Lightbulb />
        }));
      }
      return [];
    }
  };

  const [applications, setApplications] = useState<Application[]>(getApplications());

  useEffect(() => {
    setApplications(getApplications());
  }, [language, t]);

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

        <div className="space-y-6">
          {filteredApplications.map((app) => {
            const isExpanded = expandedApp === app.id;

            return (
              <div
                key={app.id}
                className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 transition-all hover:shadow-2xl"
              >
                <button
                  onClick={() => toggleExpand(app.id)}
                  className="w-full p-4 sm:p-6 md:p-8 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 sm:gap-4">
                    <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                      <div className="bg-gradient-to-br from-cyan-100 to-blue-100 p-3 sm:p-4 rounded-xl sm:rounded-2xl flex-shrink-0">
                        <div className="w-6 h-6 sm:w-8 sm:h-8">{app.icon}</div>
                      </div>

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

                    <div className="flex-shrink-0">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                      )}
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gradient-to-br from-gray-50 to-cyan-50 p-4 sm:p-6 md:p-8">
                    <div className="space-y-4 sm:space-y-6">

                      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border-l-4 border-cyan-500">
                        <h4 className="font-bold text-cyan-900 mb-2 sm:mb-3 text-base sm:text-lg flex items-center gap-2">
                          <Info className="w-4 h-4 sm:w-5 sm:h-5" />
                          {t('convection.realWorld.labels.howItWorks')}
                        </h4>
                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                          {app.howItWorks}
                        </p>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-purple-300">
                        <h4 className="font-bold text-purple-900 mb-2 sm:mb-3 text-base sm:text-lg flex items-center gap-2">
                          <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                          {t('convection.realWorld.labels.scienceBehind')}
                        </h4>
                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                          {app.scienceBehind}
                        </p>
                      </div>

                      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-amber-300">
                        <h4 className="font-bold text-amber-900 mb-2 sm:mb-3 text-base sm:text-lg flex items-center gap-2">
                          <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                          {t('convection.realWorld.labels.realExample')}
                        </h4>
                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed italic">
                          {app.realExample}
                        </p>
                      </div>

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

// ============================================================================
// Topic Practice Mode Component (inline)
// ============================================================================
interface Question {
  id: number;
  type: 'mcq' | 'true-false' | 'match' | 'sequence';
  question: string;
  options?: string[];
  pairs?: { left: string[]; right: string[] };
  sequence?: string[];
  correctAnswer: string | string[] | Record<string, string>;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

const TopicPracticeMode: React.FC = () => {
  const { t, language } = useLanguage();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[] | Record<string, string>>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [matchPairs, setMatchPairs] = useState<Record<string, string>>({});
  const [sequenceOrder, setSequenceOrder] = useState<string[]>([]);

  // Gujarati translations for practice questions (fallback)
  const gujaratiQuestions: Question[] = [
    {
      id: 1,
      type: 'mcq',
      question: 'સંવહન શું છે?',
      options: [
        'કણોની ગતિ વગર ઉષ્ણતા સ્થાનાંતરણ',
        'કણોની વાસ્તવિક ગતિ દ્વારા ઉષ્ણતા સ્થાનાંતરણ',
        'વિદ્યુતચુંબકીય તરંગો દ્વારા ઉષ્ણતા સ્થાનાંતરણ',
        'છૂંદવાથી ઉષ્ણતા સ્થાનાંતરણ'
      ],
      correctAnswer: 'કણોની વાસ્તવિક ગતિ દ્વારા ઉષ્ણતા સ્થાનાંતરણ',
      explanation: 'સંવહન એ ઉષ્ણતા સ્થાનાંતરણની પ્રક્રિયા છે જ્યાં ગરમ થયેલા કણો પોતે એક સ્થાનથી બીજા સ્થાને ખસે છે. આ તરલ પદાર્થો (પ્રવાહી અને વાયુઓ) માં થાય છે.',
      difficulty: 'easy',
      points: 10
    },
    {
      id: 2,
      type: 'true-false',
      question: 'ગતિવિધિ 7.2 માં, મીણબત્તીની ઉપરનો કાગળનો કપ ઊભો થાય છે કારણ કે ગરમ હવા ઠંડી હવા કરતાં ભારે છે.',
      options: ['સાચું', 'ખોટું'],
      correctAnswer: 'ખોટું',
      explanation: 'ખોટું! ગરમ હવા ઠંડી હવા કરતાં હળવી છે. જ્યારે હવા ગરમ થાય છે, ત્યારે તે ફેલાય છે અને ઓછી ઘનતા બને છે, જે તેને ઉપર ઉઠાડે છે. તેથી જ કપ ઉપરની તરફ ઝુકે છે.',
      difficulty: 'easy',
      points: 10
    },
    {
      id: 3,
      type: 'mcq',
      question: 'ગરમ હવા કેમ ઉપર ઉઠે છે?',
      options: [
        'કારણ કે તે ઠંડી હવા કરતાં ભારે છે',
        'કારણ કે તે ફેલાય છે અને હળવી બને છે',
        'ગુરુત્વાકર્ષણના કારણે',
        'પવનના કારણે'
      ],
      correctAnswer: 'કારણ કે તે ફેલાય છે અને હળવી બને છે',
      explanation: 'જ્યારે હવા ગરમ થાય છે, ત્યારે તે ફેલાય છે અને વધુ જગ્યા લે છે. આ તેને ઠંડી હવા કરતાં ઓછી ઘનતા (હળવી) બનાવે છે, તેથી તે ઉપર ઉઠે છે.',
      difficulty: 'easy',
      points: 10
    },
    {
      id: 4,
      type: 'mcq',
      question: 'નીચેથી ગરમ થતા બીકરમાં પાણી ક્યાં જાય છે?',
      options: [
        'ગરમ પાણી કેન્દ્રમાં ઉપર ઉઠે છે, ઠંડું પાણી બાજુઓથી નીચે જાય છે',
        'ગરમ પાણી નીચે જાય છે, ઠંડું પાણી ઉપર ઉઠે છે',
        'પાણી સ્થિર રહે છે',
        'બધું પાણી રેન્ડમ રીતે ખસે છે'
      ],
      correctAnswer: 'ગરમ પાણી કેન્દ્રમાં ઉપર ઉઠે છે, ઠંડું પાણી બાજુઓથી નીચે જાય છે',
      explanation: 'નીચેનું પાણી ગરમ થાય છે, ફેલાય છે, હળવું બને છે અને કેન્દ્ર દ્વારા ઉપર ઉઠે છે. બાજુઓથી ઠંડું પાણી તેને બદલવા માટે નીચે જાય છે, જે સંવહન ધારા બનાવે છે.',
      difficulty: 'medium',
      points: 15
    },
    {
      id: 5,
      type: 'mcq',
      question: 'સમુદ્રની હવા શું છે?',
      options: [
        'દિવસ દરમિયાન જમીનથી સમુદ્ર તરફ પવન',
        'દિવસ દરમિયાન સમુદ્રથી જમીન તરફ પવન',
        'રાત્રિ દરમિયાન સમુદ્રથી જમીન તરફ પવન',
        'માત્ર સમુદ્રમાં થતો પવન'
      ],
      correctAnswer: 'દિવસ દરમિયાન સમુદ્રથી જમીન તરફ પવન',
      explanation: 'દિવસ દરમિયાન, જમીન પાણી કરતાં ઝડપથી ગરમ થાય છે. જમીનની ઉપરની ગરમ હવા ઉપર ઉઠે છે, અને સમુદ્રથી ઠંડી હવા જમીન તરફ ખસે છે. આ સમુદ્રની હવા છે.',
      difficulty: 'medium',
      points: 15
    },
    {
      id: 6,
      type: 'mcq',
      question: 'જમીનની હવા શું છે?',
      options: [
        'દિવસ દરમિયાન જમીનથી સમુદ્ર તરફ પવન',
        'દિવસ દરમિયાન સમુદ્રથી જમીન તરફ પવન',
        'રાત્રિ દરમિયાન જમીનથી સમુદ્ર તરફ પવન',
        'માત્ર જમીન પર થતો પવન'
      ],
      correctAnswer: 'રાત્રિ દરમિયાન જમીનથી સમુદ્ર તરફ પવન',
      explanation: 'રાત્રે, જમીન પાણી કરતાં ઝડપથી ઠંડી થાય છે. સમુદ્રની ઉપરની હવા ગરમ હોય છે અને ઉપર ઉઠે છે. જમીનથી ઠંડી હવા સમુદ્ર તરફ ખસે છે. આ જમીનની હવા છે.',
      difficulty: 'medium',
      points: 15
    },
    {
      id: 7,
      type: 'true-false',
      question: 'સંવહન ઘન પદાર્થોમાં થઈ શકે છે.',
      options: ['સાચું', 'ખોટું'],
      correctAnswer: 'ખોટું',
      explanation: 'ખોટું! સંવહન માટે કણોને એક સ્થાનથી બીજા સ્થાને ખસવાની જરૂર છે. ઘન પદાર્થોમાં, કણો સ્થિર સ્થિતિમાં હોય છે, તેથી સંવહન થઈ શકતું નથી. સંવહન માત્ર તરલ પદાર્થો (પ્રવાહી અને વાયુઓ) માં થાય છે.',
      difficulty: 'medium',
      points: 15
    },
    {
      id: 8,
      type: 'mcq',
      question: 'દિવસ દરમિયાન, જમીન અને સમુદ્રનું તાપમાન કેવી રીતે વર્તે છે:',
      options: [
        'જમીન ઝડપથી ગરમ થાય છે, સમુદ્ર ધીમે ગરમ થાય છે',
        'સમુદ્ર ઝડપથી ગરમ થાય છે, જમીન ધીમે ગરમ થાય છે',
        'બંને સમાન ઝડપે ગરમ થાય છે',
        'જમીન ઠંડી થાય છે, સમુદ્ર ગરમ થાય છે'
      ],
      correctAnswer: 'જમીન ઝડપથી ગરમ થાય છે, સમુદ્ર ધીમે ગરમ થાય છે',
      explanation: 'જમીનની ઉષ્ણતા ક્ષમતા પાણી કરતાં ઓછી છે, તેથી તે દિવસ દરમિયાન ઝડપથી ગરમ થાય છે. આ તાપમાનનો તફાવત સમુદ્રની હવા બનાવે છે.',
      difficulty: 'hard',
      points: 20
    },
    {
      id: 9,
      type: 'mcq',
      question: 'અગરબત્તીમાંથી ધુમાડો કેમ ઉપર ઉઠે છે?',
      options: [
        'કારણ કે ધુમાડો ઘન છે',
        'કારણ કે ધુમાડો હવા કરતાં હળવો છે',
        'કારણ કે ધુમાડો ગરમ વાયુઓનું મિશ્રણ છે અને સંવહનના કારણે ઉપર ઉઠે છે',
        'પવનના કારણે'
      ],
      correctAnswer: 'કારણ કે ધુમાડો ગરમ વાયુઓનું મિશ્રણ છે અને સંવહનના કારણે ઉપર ઉઠે છે',
      explanation: 'ધુમાડો ગરમ વાયુઓ અને નાના ઘન કણોનું મિશ્રણ છે. આસપાસની હવા કરતાં ગરમ હોવાને કારણે, તે હળવો છે અને સંવહન દ્વારા ઉપર ઉઠે છે.',
      difficulty: 'medium',
      points: 15
    },
    {
      id: 10,
      type: 'true-false',
      question: 'રાત્રે, સમુદ્ર કિનારાની નજીક પવનની દિશા દિવસની તુલનામાં ઉલટાય છે.',
      options: ['સાચું', 'ખોટું'],
      correctAnswer: 'સાચું',
      explanation: 'સાચું! દિવસ દરમિયાન, અમારી પાસે સમુદ્રની હવા (સમુદ્રથી જમીન) છે. રાત્રે, અમારી પાસે જમીનની હવા (જમીનથી સમુદ્ર) છે. વિવિધ ગરમી અને ઠંડકના દરોના કારણે દિશા ઉલટાય છે.',
      difficulty: 'easy',
      points: 10
    },
    {
      id: 11,
      type: 'match',
      question: 'પ્રક્રિયાને તેની લાક્ષણિકતા સાથે મેળવો:',
      pairs: {
        left: ['ચાલન', 'સંવહન', 'વિકિરણ', 'સંવહન ધારા'],
        right: [
          'કણો સ્થિતિમાં રહે છે',
          'કણો એક સ્થાનથી બીજા સ્થાને ખસે છે',
          'કોઈ માધ્યમ જરૂરી નથી',
          'પ્રવાહીની ગોળાકાર ગતિ'
        ]
      },
      correctAnswer: {
        'ચાલન': 'કણો સ્થિતિમાં રહે છે',
        'સંવહન': 'કણો એક સ્થાનથી બીજા સ્થાને ખસે છે',
        'વિકિરણ': 'કોઈ માધ્યમ જરૂરી નથી',
        'સંવહન ધારા': 'પ્રવાહીની ગોળાકાર ગતિ'
      },
      explanation: 'ચાલન: કણો જગ્યાએ રહે છે. સંવહન: કણો ખસે છે. વિકિરણ: કોઈ માધ્યમ જરૂરી નથી. સંવહન ધારા: ગરમ પ્રવાહીનો સતત ગોળાકાર પ્રવાહ.',
      difficulty: 'hard',
      points: 20
    },
    {
      id: 12,
      type: 'sequence',
      question: 'પાણી ગરમ કરવામાં સંવહનના પગલાંઓને સાચા ક્રમમાં ગોઠવો:',
      sequence: [
        'નીચેનું પાણી ગરમ થાય છે',
        'ગરમ પાણી ફેલાય છે અને હળવું બને છે',
        'ગરમ પાણી ઉપર ઉઠે છે',
        'બાજુઓથી ઠંડું પાણી નીચે જાય છે',
        'નીચેનું ઠંડું પાણી ગરમ થાય છે'
      ],
      correctAnswer: [
        'નીચેનું પાણી ગરમ થાય છે',
        'ગરમ પાણી ફેલાય છે અને હળવું બને છે',
        'ગરમ પાણી ઉપર ઉઠે છે',
        'બાજુઓથી ઠંડું પાણી નીચે જાય છે',
        'નીચેનું ઠંડું પાણી ગરમ થાય છે'
      ],
      explanation: 'આ પાણીમાં સંવહનનો સાચો ક્રમ છે. ચક્ર સતત પુનરાવર્તિત થાય છે, જે સંવહન ધારા બનાવે છે.',
      difficulty: 'hard',
      points: 25
    }
  ];

  const getQuestions = (): Question[] => {
    try {
      // If language is Gujarati, use Gujarati translations directly
      if (language === 'gu') {
        return gujaratiQuestions;
      }

      const translationQuestions = t('convection.practice.questions', { returnObjects: true }) as unknown;
      if (!Array.isArray(translationQuestions) || translationQuestions.length === 0) {
        // Fallback to English if translations are not available
        if (language === 'en') {
          return [];
        }
        // For other languages (hi), try to use English as fallback or return empty
        return [];
      }
      
      return translationQuestions.map((q: any) => ({
        id: q.id,
        type: q.type,
        question: q.question || '',
        options: q.options || [],
        pairs: q.pairs,
        sequence: q.sequence,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || '',
        difficulty: q.difficulty || 'easy',
        points: q.points || 10
      }));
    } catch (error) {
      console.warn('Error loading practice questions:', error);
      // Return Gujarati questions as fallback if language is Gujarati
      if (language === 'gu') {
        return gujaratiQuestions;
      }
      return [];
    }
  };

  const [questions, setQuestions] = useState<Question[]>(getQuestions());

  useEffect(() => {
    const newQuestions = getQuestions();
    setQuestions(newQuestions);
    // Reset question state when language changes
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setShowFeedback(false);
    setMatchPairs({});
    setSequenceOrder([]);
    setScore(0);
    setAnsweredQuestions([]);
  }, [language, t]);

  const questionsList: Question[] = questions;

  const currentQuestion = questionsList[currentQuestionIndex];
  const totalPoints = questionsList.reduce((sum, q) => sum + q.points, 0);

  const handleAnswerSelect = (answer: string) => {
    if (showFeedback) return;
    setSelectedAnswer(answer);
  };

  const handleMatchPair = (left: string, right: string) => {
    setMatchPairs(prev => ({
      ...prev,
      [left]: right
    }));
  };

  const handleSequenceMove = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const newOrder = [...sequenceOrder];
      [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
      setSequenceOrder(newOrder);
    } else if (direction === 'down' && index < sequenceOrder.length - 1) {
      const newOrder = [...sequenceOrder];
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
      setSequenceOrder(newOrder);
    }
  };

  React.useEffect(() => {
    if (currentQuestion && currentQuestion.type === 'sequence' && sequenceOrder.length === 0) {
      setSequenceOrder([...(currentQuestion.sequence || [])].sort(() => Math.random() - 0.5));
    }
  }, [currentQuestionIndex, currentQuestion, language]);

  const handleSubmit = () => {
    let isCorrect = false;

    if (currentQuestion.type === 'match') {
      const correctPairs = currentQuestion.correctAnswer as Record<string, string>;
      isCorrect = Object.keys(correctPairs).every(key => matchPairs[key] === correctPairs[key]);
    } else if (currentQuestion.type === 'sequence') {
      isCorrect = JSON.stringify(sequenceOrder) === JSON.stringify(currentQuestion.correctAnswer);
    } else {
      isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    }

    if (isCorrect && !answeredQuestions.includes(currentQuestion.id)) {
      setScore(score + currentQuestion.points);
    }

    if (!answeredQuestions.includes(currentQuestion.id)) {
      setAnsweredQuestions([...answeredQuestions, currentQuestion.id]);
    }

    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questionsList.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setShowFeedback(false);
      setMatchPairs({});
      setSequenceOrder([]);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer('');
      setShowFeedback(false);
      setMatchPairs({});
      setSequenceOrder([]);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setShowFeedback(false);
    setScore(0);
    setAnsweredQuestions([]);
    setMatchPairs({});
    setSequenceOrder([]);
  };

  const isCorrect = () => {
    if (currentQuestion.type === 'match') {
      const correctPairs = currentQuestion.correctAnswer as Record<string, string>;
      return Object.keys(correctPairs).every(key => matchPairs[key] === correctPairs[key]);
    } else if (currentQuestion.type === 'sequence') {
      return JSON.stringify(sequenceOrder) === JSON.stringify(currentQuestion.correctAnswer);
    }
    return selectedAnswer === currentQuestion.correctAnswer;
  };

  const canSubmit = () => {
    if (currentQuestion.type === 'match') {
      return Object.keys(matchPairs).length === currentQuestion.pairs?.left.length;
    } else if (currentQuestion.type === 'sequence') {
      return sequenceOrder.length > 0;
    }
    return selectedAnswer !== '';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'hard': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    return t(`convection.practice.ui.difficulty.${difficulty}` as any);
  };

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case 'mcq':
      case 'true-false':
        return (
          <div className="space-y-2 sm:space-y-3">
            {currentQuestion.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={showFeedback}
                className={`w-full p-3 sm:p-4 rounded-lg sm:rounded-xl text-left transition-all border-2 ${
                  selectedAnswer === option
                    ? showFeedback
                      ? isCorrect()
                        ? 'bg-green-50 border-green-500 text-green-900'
                        : 'bg-red-50 border-red-500 text-red-900'
                      : 'bg-cyan-50 border-cyan-500 text-cyan-900'
                    : 'bg-white border-gray-200 hover:border-cyan-300 hover:bg-cyan-50'
                } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-sm sm:text-base flex-1">{option}</span>
                  {showFeedback && selectedAnswer === option && (
                    isCorrect() ? (
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 flex-shrink-0" />
                    )
                  )}
                  {showFeedback && option === currentQuestion.correctAnswer && selectedAnswer !== option && (
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>
        );

      case 'match':
        const leftItems = currentQuestion.pairs?.left || [];
        const rightItems = currentQuestion.pairs?.right || [];

        return (
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-gray-600 mb-4">{t('convection.practice.ui.matchHint')}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-3">
                <h4 className="font-bold text-sm sm:text-base text-gray-700 mb-3">{t('convection.practice.ui.processes')}</h4>
                {leftItems.map((item) => (
                  <div key={item} className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                    <div className="font-medium text-gray-800 mb-2">{item}</div>
                    <select
                      value={matchPairs[item] || ''}
                      onChange={(e) => handleMatchPair(item, e.target.value)}
                      disabled={showFeedback}
                      className="w-full p-2 sm:p-3 rounded border border-gray-300 text-xs sm:text-sm"
                    >
                      <option value="">{t('convection.practice.ui.select')}</option>
                      {rightItems.map(right => (
                        <option key={right} value={right}>{right}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-sm sm:text-base text-gray-700 mb-3">{t('convection.practice.ui.characteristics')}</h4>
                {rightItems.map((item) => (
                  <div key={item} className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                    <div className="font-medium text-green-800">{item}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'sequence':
        return (
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-gray-600 mb-4">{t('convection.practice.ui.sequenceHint')}</p>
            <div className="space-y-2">
              {sequenceOrder.map((item, index) => (
                <div key={index} className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 border-gray-200 flex items-center justify-between gap-2 sm:gap-3">
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <span className="bg-cyan-100 text-cyan-800 font-bold px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="font-medium text-gray-800 text-sm sm:text-base truncate">{item}</span>
                  </div>
                  {!showFeedback && (
                    <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleSequenceMove(index, 'up')}
                        disabled={index === 0}
                        className={`p-1.5 sm:p-2 rounded-lg text-xs sm:text-sm ${
                          index === 0
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-cyan-100 text-cyan-600 hover:bg-cyan-200'
                        }`}
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => handleSequenceMove(index, 'down')}
                        disabled={index === sequenceOrder.length - 1}
                        className={`p-1.5 sm:p-2 rounded-lg text-xs sm:text-sm ${
                          index === sequenceOrder.length - 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-cyan-100 text-cyan-600 hover:bg-cyan-200'
                        }`}
                      >
                        ▼
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isLastQuestion = currentQuestionIndex === questionsList.length - 1;

  if (!questionsList || questionsList.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 p-3 sm:p-4 md:p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl p-4 sm:p-6 md:p-8 border border-gray-100 max-w-2xl text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">{t('convection.practice.ui.noQuestionsTitle')}</h2>
          <p className="text-gray-600">{t('convection.practice.ui.noQuestionsBody')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 p-3 sm:p-4 md:p-6"
         style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <div className="max-w-5xl mx-auto">

        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl overflow-hidden border border-gray-100 mb-4 sm:mb-6">
          <div className="p-4 sm:p-6 md:p-8">
            <div className="flex items-start justify-between mb-4 sm:mb-6">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <span className="bg-cyan-100 text-cyan-800 font-bold px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm">
                    {t('convection.practice.ui.questionLabel', { current: currentQuestionIndex + 1, total: questionsList.length })}
                  </span>
                  <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold border ${getDifficultyColor(currentQuestion.difficulty)}`}>
                    {getDifficultyLabel(currentQuestion.difficulty)}
                  </span>
                  <span className="bg-teal-100 text-teal-800 px-2 sm:px-3 py-1 rounded-full text-xs font-bold">
                    {t('convection.practice.ui.pointsLabel', { points: currentQuestion.points })}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2">
                  {currentQuestion.question}
                </h2>
              </div>
            </div>

            {renderQuestion()}

            {showFeedback && (
              <div className={`mt-4 sm:mt-6 p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 ${
                isCorrect()
                  ? 'bg-green-50 border-green-400'
                  : 'bg-red-50 border-red-400'
              }`}>
                <div className="flex items-start gap-2 sm:gap-3">
                  {isCorrect() ? (
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-green-600 flex-shrink-0 mt-1" />
                  ) : (
                    <XCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-red-600 flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-base sm:text-lg mb-2">
                      {isCorrect() ? t('convection.practice.ui.correctTitle') : t('convection.practice.ui.incorrectTitle')}
                    </p>
                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold flex items-center justify-center gap-2 ${
                  currentQuestionIndex === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <span className="hidden sm:inline">{t('convection.practice.ui.previousButton')}</span>
                <span className="sm:hidden">{t('convection.practice.ui.previousButtonShort')}</span>
              </button>

              <div className="flex gap-2 sm:gap-3">
                {!showFeedback ? (
                  <button
                    onClick={handleSubmit}
                    disabled={!canSubmit()}
                    className={`px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold flex items-center justify-center gap-2 flex-1 sm:flex-initial ${
                      canSubmit()
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">{t('convection.practice.ui.submitButton')}</span>
                    <span className="sm:hidden">{t('convection.practice.ui.submitButtonShort')}</span>
                  </button>
                ) : (
                  <>
                    {!isLastQuestion ? (
                      <button
                        onClick={handleNext}
                        className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 flex items-center justify-center gap-2 flex-1 sm:flex-initial"
                      >
                        <span className="hidden sm:inline">{t('convection.practice.ui.nextButton')}</span>
                        <span className="sm:hidden">{t('convection.practice.ui.nextButtonShort')}</span>
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    ) : (
                      <button
                        onClick={handleRestart}
                        className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 flex items-center justify-center gap-2 flex-1 sm:flex-initial"
                      >
                        <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="hidden sm:inline">{t('convection.practice.ui.tryAgainButton')}</span>
                        <span className="sm:hidden">{t('convection.practice.ui.tryAgainButtonShort')}</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {isLastQuestion && showFeedback && (
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl p-4 sm:p-6 md:p-8 border-2 border-yellow-300">
            <div className="text-center">
              <Award className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-600 mx-auto mb-3 sm:mb-4" />
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2">{t('convection.practice.ui.completeTitle')}</h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-4 sm:mb-6">
                {t('convection.practice.ui.scoreSummary', { score, total: totalPoints })}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl">
                  <div className="text-2xl sm:text-3xl font-bold text-green-600">{answeredQuestions.length}</div>
                  <div className="text-xs sm:text-sm text-gray-600">{t('convection.practice.ui.questionsAnswered')}</div>
                </div>
                <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600">{Math.round((score / totalPoints) * 100)}%</div>
                  <div className="text-xs sm:text-sm text-gray-600">{t('convection.practice.ui.scorePercentage')}</div>
                </div>
                <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl">
                  <div className="text-2xl sm:text-3xl font-bold text-purple-600">
                    {score >= totalPoints * 0.8 ? 'A' : score >= totalPoints * 0.6 ? 'B' : 'C'}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">{t('convection.practice.ui.gradeLabel')}</div>
                </div>
              </div>

              <button
                onClick={handleRestart}
                className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700 flex items-center justify-center gap-2 mx-auto text-sm sm:text-base md:text-lg"
              >
                <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
                {t('convection.practice.ui.startOverButton')}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// ============================================================================
// Main ConvectionLearning Component (Router)
// ============================================================================
interface ConvectionLearningProps {
  mode: 'learn' | 'practice' | 'applications';
  setMode: (mode: 'learn' | 'practice' | 'applications') => void;
}

const ConvectionLearning: React.FC<ConvectionLearningProps> = ({ mode, setMode }) => {
  return (
    <>
      <Navbar mode={mode} setMode={setMode} />
      <div className="pt-14 sm:pt-16 px-2 sm:px-3 md:px-4 lg:px-6 pb-4 sm:pb-6">
        {mode === 'practice' && <TopicPracticeMode />}
        {mode === 'applications' && <RealWorldApplications />}
        {mode === 'learn' && <ConvectionLearnMode />}
      </div>
    </>
  );
};

export default ConvectionLearning;
