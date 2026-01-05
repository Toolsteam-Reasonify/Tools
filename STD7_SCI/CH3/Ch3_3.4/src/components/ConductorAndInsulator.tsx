/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useEffect, useState, useRef, useCallback, ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  CheckCircle, XCircle, RotateCcw,
  ChevronRight, ChevronLeft, Trophy, Star, BookOpen,
  Target, Brain, Home, Lightbulb, Info
} from 'lucide-react';
import i18n from '@/i18n';

// ============================================================================
// TYPE DEFINITIONS
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
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format a number according to the current locale
 */
export const formatNumber = (value: number, options?: Intl.NumberFormatOptions): string => {
  const locale = i18n.language || 'en';
  return new Intl.NumberFormat(locale, options).format(value);
};

/**
 * Format a date according to the current locale
 */
export const formatDate = (date: Date | number | string, options?: Intl.DateTimeFormatOptions): string => {
  const locale = i18n.language || 'en';
  const dateObj = typeof date === 'string' ? new Date(date) : typeof date === 'number' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
};

/**
 * Format currency according to the current locale
 */
export const formatCurrency = (value: number, currency: string = 'INR', options?: Intl.NumberFormatOptions): string => {
  const locale = i18n.language || 'en';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    ...options,
  }).format(value);
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number, options?: Intl.NumberFormatOptions): string => {
  const locale = i18n.language || 'en';
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    ...options,
  }).format(value / 100);
};

// Lightweight Intl formatting helpers bound to the current i18n language
export function intlFormatDate(
  date: Date | number | string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }
): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  return new Intl.DateTimeFormat(i18n.language, options).format(d);
}

export function intlFormatNumber(
  value: number,
  options: Intl.NumberFormatOptions = {}
): string {
  return new Intl.NumberFormat(i18n.language, options).format(value);
}

export function intlFormatCurrency(
  value: number,
  currency: string = 'INR',
  options: Intl.NumberFormatOptions = {}
): string {
  return new Intl.NumberFormat(i18n.language, { style: 'currency', currency, ...options }).format(value);
}

// ============================================================================
// CONTEXT PROVIDERS
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
        className="appearance-none bg-white border-2 border-teal-500 rounded-lg px-4 py-2 pr-8 w-48 text-teal-700 font-medium cursor-pointer hover:border-purple-500 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-300"
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

// TorchlightLearning Component (ConductorInsulatorSimulation)
type MaterialType = "conductor" | "insulator";

interface Material {
  id: string;
  label: string;
  type: MaterialType;
  color: string;
  description: string;
}

interface Position {
  x: number;
  y: number;
}

// Material definitions with realistic colors
const materials: Material[] = [
  { id: "iron", label: "Iron rod", type: "conductor", color: "#333333", description: "a metal that allows electricity to flow through it" },
  { id: "copper", label: "Copper rod", type: "conductor", color: "#C98A5A", description: "an excellent conductor of electricity" },
  { id: "graphite", label: "Pencil graphite", type: "conductor", color: "#808080", description: "the 'lead' in pencils, which conducts electricity" },
  { id: "wood", label: "Wood", type: "insulator", color: "#8B5A2B", description: "a natural material that does not conduct electricity" },
  { id: "plastic", label: "Plastic", type: "insulator", color: "#1E90FF", description: "a synthetic material that blocks electricity" },
  { id: "pencil", label: "Pencil", type: "insulator", color: "#FF3333", description: "the wooden body of a pencil, which does not conduct electricity" },
  { id: "rubber", label: "Rubber", type: "insulator", color: "#FF69B4", description: "used to cover wires because it stops electricity" },
  { id: "glass", label: "Glass", type: "insulator", color: "#87CEEB", description: "transparent material that does not conduct electricity" }
];

const GAP_POSITION = { x: 230, y: 150 };
const SNAP_DISTANCE = 40;

export const TorchlightLearning: React.FC = () => {
  const { t } = useLanguage();
  
  // State for material positions - initialized near the circuit gap
  const [materialPositions, setMaterialPositions] = useState<Record<string, Position>>(() => {
    const positions: Record<string, Position> = {};
    materials.forEach((material, index) => {
      // Arrange materials in two rows below the gap
      const row = Math.floor(index / 4);
      const col = index % 4;
      positions[material.id] = {
        x: 120 + col * 80,
        y: 270 + row * 50
      };
    });
    return positions;
  });

  const [draggedMaterial, setDraggedMaterial] = useState<Material | null>(null);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [materialInGap, setMaterialInGap] = useState<Material | null>(null);
  const [prediction, setPrediction] = useState<MaterialType | null>(null);
  const [showPrediction, setShowPrediction] = useState<boolean>(false);
  const [testedMaterials, setTestedMaterials] = useState<Material[]>([]);
  const [showCurrentFlow, setShowCurrentFlow] = useState<boolean>(true);
  const [nearGap, setNearGap] = useState<boolean>(false);

  const svgRef = useRef<SVGSVGElement>(null);

  const isBulbOn = materialInGap?.type === "conductor";

  // Convert screen coordinates to SVG coordinates
  const screenToSVG = useCallback((clientX: number, clientY: number): Position => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const svg = svgRef.current;

    const screenCTM = svg.getScreenCTM();
    if (!screenCTM) return { x: 0, y: 0 };

    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const svgP = pt.matrixTransform(screenCTM.inverse());
    return { x: svgP.x, y: svgP.y };
  }, []);

  // Check if position is near the gap
  const isNearGap = useCallback((x: number, y: number): boolean => {
    const distance = Math.sqrt(
      Math.pow(x - GAP_POSITION.x, 2) + Math.pow(y - GAP_POSITION.y, 2)
    );
    return distance < SNAP_DISTANCE;
  }, []);

  // Handle mouse down on material
  const handleMouseDown = useCallback((e: React.MouseEvent, material: Material) => {
    e.preventDefault();
    const svgCoords = screenToSVG(e.clientX, e.clientY);
    const pos = materialPositions[material.id];
    setDraggedMaterial(material);
    setDragOffset({
      x: svgCoords.x - pos.x,
      y: svgCoords.y - pos.y
    });
  }, [materialPositions, screenToSVG]);

  // Handle mouse move
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!draggedMaterial) return;
    e.preventDefault();

    const svgCoords = screenToSVG(e.clientX, e.clientY);
    const newX = svgCoords.x - dragOffset.x;
    const newY = svgCoords.y - dragOffset.y;

    // Constrain within circuit area (with some padding)
    const constrainedX = Math.max(50, Math.min(450, newX));
    const constrainedY = Math.max(50, Math.min(370, newY));

    setMaterialPositions(prev => ({
      ...prev,
      [draggedMaterial.id]: { x: constrainedX, y: constrainedY }
    }));

    // Check if near gap for visual feedback
    setNearGap(isNearGap(constrainedX, constrainedY));
  }, [draggedMaterial, dragOffset, isNearGap, screenToSVG]);

  // Handle mouse up
  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (!draggedMaterial) return;
    e.preventDefault();

    const pos = materialPositions[draggedMaterial.id];

    // Check if should snap to gap
    if (isNearGap(pos.x, pos.y)) {
      // Snap to gap position
      setMaterialPositions(prev => ({
        ...prev,
        [draggedMaterial.id]: { x: GAP_POSITION.x, y: GAP_POSITION.y }
      }));

      // Set as active material in circuit
      if (materialInGap && materialInGap.id !== draggedMaterial.id) {
        // Move previous material away from gap
        setMaterialPositions(prev => ({
          ...prev,
          [materialInGap.id]: { x: prev[materialInGap.id].x + 60, y: prev[materialInGap.id].y + 40 }
        }));
      }

      setMaterialInGap(draggedMaterial);
      setPrediction(null);
      setShowPrediction(false);

      // Add to tested materials
      if (!testedMaterials.find(m => m.id === draggedMaterial.id)) {
        setTestedMaterials(prev => [...prev, draggedMaterial]);
      }
    } else {
      // If material was in gap and dragged away, remove it from circuit
      if (materialInGap && materialInGap.id === draggedMaterial.id) {
        setMaterialInGap(null);
        setPrediction(null);
        setShowPrediction(false);
      }
    }

    setDraggedMaterial(null);
    setNearGap(false);
  }, [draggedMaterial, materialPositions, isNearGap, materialInGap, testedMaterials]);

  useEffect(() => {
    if (draggedMaterial) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedMaterial, handleMouseMove, handleMouseUp]);

  const handlePrediction = (predictedType: MaterialType) => {
    if (!materialInGap) return;
    setPrediction(predictedType);
    setShowPrediction(true);
  };

  const resetSimulation = () => {
    // Reset all material positions to initial state
    const positions: Record<string, Position> = {};
    materials.forEach((material, index) => {
      const row = Math.floor(index / 4);
      const col = index % 4;
      positions[material.id] = {
        x: 120 + col * 80,
        y: 270 + row * 50
      };
    });
    setMaterialPositions(positions);
    setMaterialInGap(null);
    setPrediction(null);
    setShowPrediction(false);
    setDraggedMaterial(null);
    setTestedMaterials([]);
  };

  const isPredictionCorrect = prediction === materialInGap?.type;

  // Localization helpers for material labels/descriptions
  const getMat = useCallback((id: string) => materials.find(m => m.id === id)!, []);
  const getMatLabel = useCallback((id: string) => {
    const base = getMat(id);
    return t(`learn.materialNames.${id}`, { defaultValue: base.label });
  }, [getMat, t]);
  const getMatDescription = useCallback((id: string) => {
    const base = getMat(id);
    return t(`learn.materialDescriptions.${id}`, { defaultValue: base.description });
  }, [getMat, t]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Circuit Visualization */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-indigo-900">{t('learn.circuitTestArea', { defaultValue: 'Circuit Test Area' })}</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCurrentFlow(!showCurrentFlow)}
                  className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                >
                  {showCurrentFlow
                    ? t('learn.hideCurrent', { defaultValue: 'Hide Current' })
                    : t('learn.showCurrent', { defaultValue: 'Show Current' })}
                </button>
                <button
                  onClick={resetSimulation}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  {t('common.reset', { defaultValue: 'Reset' })}
                </button>
              </div>
            </div>

            {/* Circuit SVG */}
            <svg
              ref={svgRef}
              viewBox="0 0 500 370"
              className="w-full border-2 border-gray-200 rounded-lg bg-gray-50"
              style={{ cursor: draggedMaterial ? 'grabbing' : 'default' }}
            >
              {/* Battery */}
              <g transform="translate(80, 150)">
                <defs>
                  <linearGradient id="batteryGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#2c3e50', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#34495e', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <rect x="-15" y="-35" width="30" height="70" rx="3" fill="url(#batteryGrad)" stroke="#1a252f" strokeWidth="2" />
                <rect x="-5" y="-42" width="10" height="7" rx="1" fill="#c0c0c0" stroke="#888" strokeWidth="1" />
                <text x="-15" y="-48" fontSize="16" fill="#e74c3c" fontWeight="bold" textAnchor="middle">+</text>
                <text x="-15" y="55" fontSize="16" fill="#3498db" fontWeight="bold" textAnchor="middle">−</text>
                <rect x="-8" y="-15" width="16" height="8" fill="#3498db" opacity="0.6" rx="1" />
                <rect x="-8" y="7" width="16" height="8" fill="#e74c3c" opacity="0.6" rx="1" />
                
                {/* Connection terminals */}
                <circle cx="0" cy="-35" r="3" fill="#D4AF37" stroke="#B87333" strokeWidth="1" />
                <circle cx="0" cy="35" r="3" fill="#D4AF37" stroke="#B87333" strokeWidth="1" />
              </g>

              {/* Wire from battery negative terminal to gap (bottom-left side) */}
              <line x1="80" y1="185" x2="80" y2="220" stroke="#B87333" strokeWidth="4" />
              <line x1="80" y1="185" x2="80" y2="220" stroke="#D4AF37" strokeWidth="2" />
              <line x1="80" y1="220" x2="180" y2="220" stroke="#B87333" strokeWidth="4" />
              <line x1="80" y1="220" x2="180" y2="220" stroke="#D4AF37" strokeWidth="2" />
              <line x1="180" y1="220" x2="180" y2="150" stroke="#B87333" strokeWidth="4" />
              <line x1="180" y1="220" x2="180" y2="150" stroke="#D4AF37" strokeWidth="2" />

              {/* Left terminal of gap */}
              <circle cx="180" cy="150" r="5" fill="#C0C0C0" stroke="#888" strokeWidth="2" />

              {/* Gap area with snap highlight */}
              <circle
                cx={GAP_POSITION.x}
                cy={GAP_POSITION.y}
                r={SNAP_DISTANCE}
                fill={nearGap ? "#4caf50" : "transparent"}
                opacity="0.1"
                stroke={nearGap ? "#4caf50" : "#ddd"}
                strokeWidth="2"
                strokeDasharray="5,5"
              />

              {/* Right terminal of gap */}
              <circle cx="280" cy="150" r="5" fill="#C0C0C0" stroke="#888" strokeWidth="2" />

              {/* Wire from gap to bulb */}
              <line x1="280" y1="150" x2="360" y2="150" stroke="#B87333" strokeWidth="4" />
              <line x1="280" y1="150" x2="360" y2="150" stroke="#D4AF37" strokeWidth="2" />
              <line x1="360" y1="150" x2="360" y2="80" stroke="#B87333" strokeWidth="4" />
              <line x1="360" y1="150" x2="360" y2="80" stroke="#D4AF37" strokeWidth="2" />

              {/* Bulb */}
              <g transform="translate(360, 80)">
                <defs>
                  <radialGradient id="bulbGrad">
                    <stop offset="0%" style={{ stopColor: isBulbOn ? '#FFFF00' : '#E0E0E0', stopOpacity: 1 }} />
                    <stop offset="70%" style={{ stopColor: isBulbOn ? '#FFA500' : '#C0C0C0', stopOpacity: 0.8 }} />
                    <stop offset="100%" style={{ stopColor: isBulbOn ? '#FF8C00' : '#A0A0A0', stopOpacity: 1 }} />
                  </radialGradient>
                </defs>

                {isBulbOn && (
                  <>
                    <circle cx="0" cy="0" r="35" fill="yellow" opacity="0.2" />
                    <circle cx="0" cy="0" r="40" fill="yellow" opacity="0.1" />
                    <circle cx="0" cy="0" r="45" fill="yellow" opacity="0.05" />
                  </>
                )}

                <circle cx="0" cy="0" r="25" fill="url(#bulbGrad)" stroke="#555" strokeWidth="2" />
                <path
                  d="M -8,-8 L -4,-4 L -8,0 L -4,4 L -8,8 M 8,-8 L 4,-4 L 8,0 L 4,4 L 8,8 M -4,-4 L 4,-4 M -4,4 L 4,4"
                  stroke={isBulbOn ? "#FF4500" : "#666"}
                  strokeWidth="2"
                  fill="none"
                />
                <rect x="-8" y="20" width="16" height="3" fill="#A0A0A0" />
                <rect x="-8" y="23" width="16" height="2" fill="#888" />
                <rect x="-8" y="25" width="16" height="3" fill="#A0A0A0" />
                <rect x="-6" y="28" width="12" height="4" fill="#777" />
              </g>

              {/* Wire from bulb back to battery positive terminal */}
              <line x1="360" y1="55" x2="360" y2="30" stroke="#B87333" strokeWidth="4" />
              <line x1="360" y1="55" x2="360" y2="30" stroke="#D4AF37" strokeWidth="2" />
              <line x1="360" y1="30" x2="80" y2="30" stroke="#B87333" strokeWidth="4" />
              <line x1="360" y1="30" x2="80" y2="30" stroke="#D4AF37" strokeWidth="2" />
              <line x1="80" y1="30" x2="80" y2="115" stroke="#B87333" strokeWidth="4" />
              <line x1="80" y1="30" x2="80" y2="115" stroke="#D4AF37" strokeWidth="2" />

              {/* Current flow animation */}
              {isBulbOn && showCurrentFlow && (
                <>
                  <circle r="4" fill="#FF6B6B" opacity="0.8">
                    <animateMotion dur="3s" repeatCount="indefinite" path="M80,115 L80,30 L360,30 L360,55" />
                  </circle>
                  <circle r="4" fill="#FF6B6B" opacity="0.8">
                    <animateMotion dur="3s" repeatCount="indefinite" begin="1s" path="M360,80 L360,150 L280,150" />
                  </circle>
                  <circle r="4" fill="#FF6B6B" opacity="0.8">
                    <animateMotion dur="3s" repeatCount="indefinite" begin="2s" path="M180,150 L180,220 L80,220 L80,185" />
                  </circle>
                </>
              )}

              {/* Labels */}
              <text x="50" y="150" fontSize="13" fill="#2c3e50" textAnchor="middle" fontWeight="bold">{t('learn.cell', { defaultValue: 'Cell' })}</text>
              <text x="360" y="15" fontSize="13" fill="#2c3e50" textAnchor="middle" fontWeight="bold">{t('learn.bulb', { defaultValue: 'Bulb' })}</text>
              <text x="230" y="175" fontSize="11" fill="#666" textAnchor="middle" fontStyle="italic">
                {materialInGap
                  ? t('learn.connectionMade', { defaultValue: 'Connection Made' })
                  : t('learn.dragObjectHere', { defaultValue: '↓ Drag Object Here ↓' })}
              </text>

              {/* Instruction text */}
              <text x="250" y="245" fontSize="12" fill="#555" textAnchor="middle" fontWeight="bold">
                {t('learn.materialsToTest', { defaultValue: 'Materials to Test (Drag into circuit gap)' })}
              </text>

              {/* Draggable materials */}
              {materials.map((material) => {
                const pos = materialPositions[material.id];
                const isInGap = materialInGap?.id === material.id;
                const isDragging = draggedMaterial?.id === material.id;
                const localizedLabel = getMatLabel(material.id);

                return (
                  <g
                    key={material.id}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                    onMouseDown={(e) => handleMouseDown(e, material)}
                    opacity={isDragging ? 0.7 : 1}
                  >
                    <defs>
                      <linearGradient id={`materialGrad-${material.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: material.color, stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: material.color, stopOpacity: 0.7 }} />
                      </linearGradient>
                    </defs>

                    {/* Material body */}
                    <rect
                      x="-30"
                      y="-12"
                      width="60"
                      height="24"
                      rx="3"
                      fill={`url(#materialGrad-${material.id})`}
                      stroke={isInGap ? "#4caf50" : "#333"}
                      strokeWidth={isInGap ? "3" : "2"}
                    />

                    {/* Highlight effect */}
                    <rect
                      x="-26"
                      y="-9"
                      width="18"
                      height="6"
                      rx="2"
                      fill="white"
                      opacity="0.4"
                    />

                    {/* Label */}
                    <text
                      x="0"
                      y="3"
                      fontSize="8"
                      fill="white"
                      textAnchor="middle"
                      fontWeight="bold"
                      style={{
                        textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                        pointerEvents: 'none'
                      }}
                    >
                      {localizedLabel.length > 10 ? localizedLabel.substring(0, 9) + '...' : localizedLabel}
                    </text>

                    {/* Connection indicator when in gap */}
                    {isInGap && (
                      <>
                        <line x1="-30" y1="0" x2="-50" y2="0" stroke="#4caf50" strokeWidth="3" />
                        <line x1="30" y1="0" x2="50" y2="0" stroke="#4caf50" strokeWidth="3" />
                      </>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Prediction Section */}
            {materialInGap && !showPrediction && (
              <div className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
                <p className="text-sm font-semibold text-yellow-900 mb-3">
                  {t('learn.makePrediction', { defaultValue: 'Make a Prediction: Will the {{label}} complete the circuit?', label: getMatLabel(materialInGap.id) })}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handlePrediction("conductor")}
                    className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold"
                  >
                    {t('learn.predYesConduct', { defaultValue: 'Yes, it will conduct!' })}
                  </button>
                  <button
                    onClick={() => handlePrediction("insulator")}
                    className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold"
                  >
                    {t('learn.predNoInsulator', { defaultValue: "No, it's an insulator" })}
                  </button>
                </div>
              </div>
            )}

            {/* Prediction Result */}
            {materialInGap && showPrediction && (
              <div className={`mt-4 p-4 rounded-lg border-2 ${isPredictionCorrect
                  ? 'bg-green-50 border-green-400'
                  : 'bg-red-50 border-red-400'
                }`}>
                <p className="font-bold text-lg mb-2">
                  {isPredictionCorrect
                    ? t('learn.resultCorrect', { defaultValue: "That's Correct!" })
                    : t('learn.notQuite', { defaultValue: '❌ Not quite!' })}
                </p>
                <p className="text-sm">
                  {materialInGap && (
                    <>
                      {t('learn.isAType', { defaultValue: '{{label}} is a', label: getMatLabel(materialInGap.id) })} <strong>{materialInGap.type}</strong>. {getMatDescription(materialInGap.id)}
                      <br />
                      {isPredictionCorrect
                        ? t('learn.explainerOnAlt', { defaultValue: 'Because it allows electrons to flow, the loop is closed and the bulb lights up! 💡' })
                        : t('learn.explainerOffAlt', { defaultValue: 'Because it blocks electron flow, the circuit remains broken and the bulb stays off. 🚫' })}
                    </>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Information Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Current Status */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
                <Info size={20} />
                {t('learn.information', { defaultValue: 'Information' })}
              </h2>

              {materialInGap ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{t('learn.materialInCircuit', { defaultValue: 'Material in Circuit:' })}</p>
                    <p className="font-bold text-lg text-indigo-900">{getMatLabel(materialInGap.id)}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">{t('learn.type', { defaultValue: 'Type:' })}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${materialInGap.type === "conductor"
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                      }`}>
                      {materialInGap.type === "conductor"
                        ? t('learn.conductor', { defaultValue: '⚡ Conductor' })
                        : t('learn.insulator', { defaultValue: '🚫 Insulator' })}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">{t('learn.bulbStatus', { defaultValue: 'Bulb Status:' })}</p>
                    <div className="flex items-center gap-2">
                      <Lightbulb size={20} className={isBulbOn ? "text-yellow-500" : "text-gray-400"} />
                      <span className={`font-semibold ${isBulbOn ? "text-green-600" : "text-gray-500"}`}>
                        {isBulbOn
                          ? t('learn.onGlowing', { defaultValue: 'ON (Glowing ✨)' })
                          : t('learn.offNotGlowing', { defaultValue: 'OFF (Not glowing)' })}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-700">
                      <strong>{getMatLabel(materialInGap.id)}</strong> {t('learn.isDescription', { defaultValue: 'is' })} {getMatDescription(materialInGap.id)}.
                      {isBulbOn
                        ? t('learn.explainerOn', { defaultValue: ' It allows electric current to pass through, so the bulb glows!' })
                        : t('learn.explainerOff', { defaultValue: ' It does not allow electric current to pass through, so the bulb stays off.' })}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  {t('learn.dragMaterialToTest', { defaultValue: '👆 Drag a material into the circuit gap to test if it conducts electricity!' })}
                </p>
              )}
            </div>

            {/* Tested Materials Table */}
            {testedMaterials.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-indigo-900 mb-3">{t('learn.testResults', { defaultValue: 'Test Results' })}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-2 px-2">{t('learn.material', { defaultValue: 'Material' })}</th>
                        <th className="text-center py-2 px-2">{t('learn.typeHeader', { defaultValue: 'Type' })}</th>
                        <th className="text-center py-2 px-2">{t('learn.bulbHeader', { defaultValue: 'Bulb' })}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {testedMaterials.map((material) => (
                        <tr key={material.id} className="border-b border-gray-100">
                          <td className="py-2 px-2">{getMatLabel(material.id)}</td>
                          <td className="text-center py-2 px-2">
                            <span className={`text-xs px-2 py-1 rounded ${material.type === "conductor" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}>
                              {material.type === "conductor" ? "C" : "I"}
                            </span>
                          </td>
                          <td className="text-center py-2 px-2">
                            {material.type === "conductor" ? "✓" : "✗"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  onClick={() => setTestedMaterials([])}
                  className="mt-3 w-full py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                >
                  {t('learn.clearResults', { defaultValue: 'Clear Results' })}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// TorchlightPractice Component
type QuestionType = 'mcq' | 'trueFalse' | 'identify' | 'scenario';
type DifficultyLevel = 'easy' | 'medium' | 'hard';

interface Question {
  id: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  question: {
    english: string;
    hindi: string;
    gujarati: string;
  };
  options?: {
    english: string[];
    hindi: string[];
    gujarati: string[];
  };
  correctAnswer: number;
  explanation: {
    english: string;
    hindi: string;
    gujarati: string;
  };
  topic: string;
}

export const TorchlightPractice: React.FC = () => {
  const { t, language } = useLanguage();
  const [currentView, setCurrentView] = useState<'topics' | 'practice' | 'results'>('topics');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Map i18n language codes to component language format
  const getLanguageKey = (): 'english' | 'hindi' | 'gujarati' => {
    if (language === 'hi') return 'hindi';
    if (language === 'gu') return 'gujarati';
    return 'english';
  };
  const langKey = getLanguageKey();

  // Question Bank
  const questionBank: Question[] = [
    // Basic Conductor/Insulator Identification - Easy
    {
      id: 'ci_1',
      type: 'mcq',
      difficulty: 'easy',
      question: {
        english: 'Which of the following is a conductor of electricity?',
        hindi: 'निम्नलिखित में से कौन विद्युत का सुचालक है?',
        gujarati: 'નીચેનામાંથી કયું વીજળીનું સુવાહક છે?'
      },
      options: {
        english: ['Plastic scale', 'Copper wire', 'Rubber eraser', 'Wooden stick'],
        hindi: ['प्लास्टिक स्केल', 'तांबे का तार', 'रबर का इरेज़र', 'लकड़ी की छड़ी'],
        gujarati: ['પ્લાસ્ટિક સ્કેલ', 'તાંબાનો તાર', 'રબરનું ઇરેઝર', 'લાકડાની લાકડી']
      },
      correctAnswer: 1,
      explanation: {
        english: 'Copper wire is a conductor because it is made of metal. Metals allow electricity to flow through them easily.',
        hindi: 'तांबे का तार एक सुचालक है क्योंकि यह धातु से बना होता है। धातुएं विद्युत को आसानी से प्रवाहित होने देती हैं।',
        gujarati: 'તાંબાનો તાર સુવાહક છે કારણ કે તે ધાતુથી બનેલો છે. ધાતુઓ વીજળીને સરળતાથી વહેવા દે છે.'
      },
      topic: 'identification'
    },
    {
      id: 'ci_2',
      type: 'mcq',
      difficulty: 'easy',
      question: {
        english: 'Which material is an insulator?',
        hindi: 'कौन सी सामग्री कुचालक है?',
        gujarati: 'કઈ સામગ્રી કુવાહક છે?'
      },
      options: {
        english: ['Iron nail', 'Aluminum foil', 'Glass bangle', 'Steel spoon'],
        hindi: ['लोहे की कील', 'एल्युमिनियम फॉयल', 'कांच की चूड़ी', 'स्टील का चम्मच'],
        gujarati: ['લોખંડની ખીલી', 'એલ્યુમિનિયમ ફોઇલ', 'કાચનું બંગડી', 'સ્ટીલનો ચમચો']
      },
      correctAnswer: 2,
      explanation: {
        english: 'Glass bangle is an insulator because glass does not allow electricity to pass through it.',
        hindi: 'कांच की चूड़ी एक कुचालक है क्योंकि कांच विद्युत को अपने माध्यम से नहीं जाने देता।',
        gujarati: 'કાચનું બંગડી કુવાહક છે કારણ કે કાચ વીજળીને તેમાંથી પસાર થવા દેતું નથી.'
      },
      topic: 'identification'
    },
    {
      id: 'ci_3',
      type: 'trueFalse',
      difficulty: 'easy',
      question: {
        english: 'All metals are good conductors of electricity.',
        hindi: 'सभी धातुएं विद्युत की अच्छी सुचालक होती हैं।',
        gujarati: 'બધી ધાતુઓ વીજળીની સારી સુવાહક છે.'
      },
      options: {
        english: ['True', 'False'],
        hindi: ['सही', 'गलत'],
        gujarati: ['સાચું', 'ખોટું']
      },
      correctAnswer: 0,
      explanation: {
        english: 'True! All metals like copper, iron, aluminum, gold, and silver are good conductors of electricity.',
        hindi: 'सही! तांबा, लोहा, एल्युमिनियम, सोना और चांदी जैसी सभी धातुएं विद्युत की अच्छी सुचालक होती हैं।',
        gujarati: 'સાચું! તાંબુ, લોખંડ, એલ્યુમિનિયમ, સોનું અને ચાંદી જેવી બધી ધાતુઓ વીજળીની સારી સુવાહક છે.'
      },
      topic: 'properties'
    },
    {
      id: 'ci_4',
      type: 'trueFalse',
      difficulty: 'easy',
      question: {
        english: 'Plastic is a good conductor of electricity.',
        hindi: 'प्लास्टिक विद्युत का अच्छा सुचालक है।',
        gujarati: 'પ્લાસ્ટિક વીજળીનું સારું સુવાહક છે.'
      },
      options: {
        english: ['True', 'False'],
        hindi: ['सही', 'गलत'],
        gujarati: ['સાચું', 'ખોટું']
      },
      correctAnswer: 1,
      explanation: {
        english: 'False! Plastic is an insulator and does not allow electricity to pass through it. That\'s why wires are covered with plastic.',
        hindi: 'गलत! प्लास्टिक एक कुचालक है और विद्युत को अपने माध्यम से नहीं जाने देता। इसीलिए तारों को प्लास्टिक से ढका जाता है।',
        gujarati: 'ખોટું! પ્લાસ્ટિક કુવાહક છે અને વીજળીને તેમાંથી પસાર થવા દેતું નથી. તેથી જ તારોને પ્લાસ્ટિકથી ઢાંકવામાં આવે છે.'
      },
      topic: 'properties'
    },
    {
      id: 'ci_5',
      type: 'mcq',
      difficulty: 'medium',
      question: {
        english: 'Why are electric wires made of copper or aluminum?',
        hindi: 'विद्युत तार तांबे या एल्युमिनियम से क्यों बनाए जाते हैं?',
        gujarati: 'વીજળીના તાર તાંબા અથવા એલ્યુમિનિયમમાંથી કેમ બનાવવામાં આવે છે?'
      },
      options: {
        english: ['Because they are cheap', 'Because they are good conductors', 'Because they are colorful', 'Because they are light'],
        hindi: ['क्योंकि वे सस्ते हैं', 'क्योंकि वे अच्छे सुचालक हैं', 'क्योंकि वे रंगीन हैं', 'क्योंकि वे हल्के हैं'],
        gujarati: ['કારણ કે તેઓ સસ્તા છે', 'કારણ કે તેઓ સારા સુવાહક છે', 'કારણ કે તેઓ રંગીન છે', 'કારણ કે તેઓ હલકા છે']
      },
      correctAnswer: 1,
      explanation: {
        english: 'Copper and aluminum are good conductors of electricity, so they allow electric current to flow easily through them.',
        hindi: 'तांबा और एल्युमिनियम विद्युत के अच्छे सुचालक हैं, इसलिए वे विद्युत धारा को आसानी से प्रवाहित होने देते हैं।',
        gujarati: 'તાંબુ અને એલ્યુમિનિયમ વીજળીના સારા સુવાહક છે, તેથી તેઓ વિદ્યુત પ્રવાહને સરળતાથી વહેવા દે છે.'
      },
      topic: 'wires'
    },
    {
      id: 'ci_6',
      type: 'mcq',
      difficulty: 'medium',
      question: {
        english: 'Why are electric wires covered with plastic or rubber?',
        hindi: 'विद्युत तारों को प्लास्टिक या रबर से क्यों ढका जाता है?',
        gujarati: 'વીજળીના તારોને પ્લાસ્ટિક અથવા રબરથી કેમ ઢાંકવામાં આવે છે?'
      },
      options: {
        english: ['To make them look colorful', 'To protect us from electric shock', 'To make them stronger', 'To make them waterproof'],
        hindi: ['उन्हें रंगीन दिखाने के लिए', 'हमें बिजली के झटके से बचाने के लिए', 'उन्हें मजबूत बनाने के लिए', 'उन्हें जलरोधी बनाने के लिए'],
        gujarati: ['તેમને રંગીન બનાવવા માટે', 'આપણને વીજળીના આંચકાથી બચાવવા માટે', 'તેમને વધુ મજબૂત બનાવવા માટે', 'તેમને પાણીરોધક બનાવવા માટે']
      },
      correctAnswer: 1,
      explanation: {
        english: 'Plastic and rubber are insulators. They prevent electricity from flowing out of the wires and protect us from electric shocks.',
        hindi: 'प्लास्टिक और रबर कुचालक हैं। वे विद्युत को तारों से बाहर बहने से रोकते हैं और हमें बिजली के झटके से बचाते हैं।',
        gujarati: 'પ્લાસ્ટિક અને રબર કુવાહક છે. તેઓ વીજળીને તારમાંથી બહાર વહેતી અટકાવે છે અને આપણને વીજળીના આંચકાથી બચાવે છે.'
      },
      topic: 'wires'
    },
    {
      id: 'ci_7',
      type: 'mcq',
      difficulty: 'medium',
      question: {
        english: 'What will happen if we use wooden sticks instead of metal wires in a circuit?',
        hindi: 'यदि हम सर्किट में धातु के तारों के बजाय लकड़ी की छड़ियों का उपयोग करें तो क्या होगा?',
        gujarati: 'જો આપણે સર્કિટમાં ધાતુના તારોને બદલે લાકડાની લાકડીઓનો ઉપયોગ કરીએ તો શું થશે?'
      },
      options: {
        english: ['The lamp will glow brighter', 'The lamp will not glow', 'The circuit will work better', 'Nothing will change'],
        hindi: ['लैंप अधिक चमकेगा', 'लैंप नहीं चमकेगा', 'सर्किट बेहतर काम करेगा', 'कुछ नहीं बदलेगा'],
        gujarati: ['દીવો વધુ તેજસ્વી થશે', 'દીવો પ્રકાશશે નહીં', 'સર્કિટ વધુ સારી રીતે કામ કરશે', 'કંઈ બદલાશે નહીં']
      },
      correctAnswer: 1,
      explanation: {
        english: 'Wood is an insulator, so it does not allow electricity to pass through. The circuit will not be complete and the lamp will not glow.',
        hindi: 'लकड़ी एक कुचालक है, इसलिए यह विद्युत को अपने माध्यम से नहीं जाने देती। सर्किट पूर्ण नहीं होगा और लैंप नहीं चमकेगा।',
        gujarati: 'લાકડું કુવાહક છે, તેથી તે વીજળીને તેમાંથી પસાર થવા દેતું નથી. સર્કિટ પૂર્ણ થશે નહીં અને દીવો પ્રકાશશે નહીં.'
      },
      topic: 'wires'
    },
    {
      id: 'ci_8',
      type: 'trueFalse',
      difficulty: 'medium',
      question: {
        english: 'Silver is the best conductor of electricity among all metals.',
        hindi: 'चांदी सभी धातुओं में विद्युत का सबसे अच्छा सुचालक है।',
        gujarati: 'ચાંદી બધી ધાતુઓમાં વીજળીનું શ્રેષ્ઠ સુવાહક છે.'
      },
      options: {
        english: ['True', 'False'],
        hindi: ['सही', 'गलत'],
        gujarati: ['સાચું', 'ખોટું']
      },
      correctAnswer: 0,
      explanation: {
        english: 'True! Silver is the best conductor, followed by copper and gold. However, copper is most commonly used because silver is expensive.',
        hindi: 'सही! चांदी सबसे अच्छा सुचालक है, उसके बाद तांबा और सोना। हालांकि, तांबे का सबसे अधिक उपयोग किया जाता है क्योंकि चांदी महंगी है।',
        gujarati: 'સાચું! ચાંદી શ્રેષ્ઠ સુવાહક છે, ત્યારબાદ તાંબુ અને સોનું. જો કે, તાંબુનો સૌથી વધુ ઉપયોગ થાય છે કારણ કે ચાંદી મોંઘી છે.'
      },
      topic: 'properties'
    },
    {
      id: 'ci_9',
      type: 'mcq',
      difficulty: 'medium',
      question: {
        english: 'In a conduction tester, what does it mean if the lamp glows when we touch an object?',
        hindi: 'चालन परीक्षक में, यदि हम किसी वस्तु को छूने पर लैंप चमकता है तो इसका क्या मतलब है?',
        gujarati: 'વહન પરીક્ષકમાં, જો આપણે કોઈ વસ્તુને સ્પર્શ કરીએ અને દીવો પ્રકાશે તો તેનો અર્થ શું છે?'
      },
      options: {
        english: ['The object is an insulator', 'The object is a conductor', 'The tester is broken', 'The battery is dead'],
        hindi: ['वस्तु एक कुचालक है', 'वस्तु एक सुचालक है', 'परीक्षक टूट गया है', 'बैटरी खत्म हो गई है'],
        gujarati: ['વસ્તુ કુવાહક છે', 'વસ્તુ સુવાહક છે', 'પરીક્ષક તૂટી ગયું છે', 'બેટરી ખતમ થઈ ગઈ છે']
      },
      correctAnswer: 1,
      explanation: {
        english: 'If the lamp glows, it means electricity can flow through the object, so it is a conductor.',
        hindi: 'यदि लैंप चमकता है, तो इसका मतलब है कि वस्तु के माध्यम से विद्युत प्रवाहित हो सकती है, इसलिए यह एक सुचालक है।',
        gujarati: 'જો દીવો પ્રકાશે છે, તો તેનો અર્થ એ કે વીજળી વસ્તુમાંથી પસાર થઈ શકે છે, તેથી તે સુવાહક છે.'
      },
      topic: 'testing'
    },
    {
      id: 'ci_10',
      type: 'mcq',
      difficulty: 'medium',
      question: {
        english: 'What are the main components needed to make a conduction tester?',
        hindi: 'चालन परीक्षक बनाने के लिए मुख्य घटक क्या आवश्यक हैं?',
        gujarati: 'વહન પરીક્ષક બનાવવા માટે મુખ્ય ઘટકો શું જરૂરી છે?'
      },
      options: {
        english: ['Cell, lamp, and wires', 'Only a battery', 'Switch and bulb only', 'Magnet and compass'],
        hindi: ['सेल, लैंप और तार', 'केवल बैटरी', 'केवल स्विच और बल्ब', 'चुंबक और कम्पास'],
        gujarati: ['સેલ, દીવો અને તારો', 'ફક્ત બેટરી', 'ફક્ત સ્વીચ અને બલ્બ', 'ચુંબક અને હોકાયંત્ર']
      },
      correctAnswer: 0,
      explanation: {
        english: 'A conduction tester needs a cell (battery) for power, a lamp to show when current flows, and wires to connect everything with free ends for testing.',
        hindi: 'चालन परीक्षक को बिजली के लिए एक सेल (बैटरी), धारा प्रवाहित होने पर दिखाने के लिए एक लैंप, और सब कुछ जोड़ने के लिए तारों की आवश्यकता होती है जिनके मुक्त सिरे परीक्षण के लिए हों।',
        gujarati: 'વહન પરીક્ષકને પાવર માટે સેલ (બેટરી), પ્રવાહ વહે ત્યારે બતાવવા માટે દીવો, અને બધું જોડવા માટે તારોની જરૂર છે જેના મુક્ત છેડાઓ પરીક્ષણ માટે હોય.'
      },
      topic: 'testing'
    },
    {
      id: 'ci_11',
      type: 'mcq',
      difficulty: 'medium',
      question: {
        english: 'Why should we never touch electrical appliances with wet hands?',
        hindi: 'हमें गीले हाथों से विद्युत उपकरणों को कभी क्यों नहीं छूना चाहिए?',
        gujarati: 'આપણે ભીના હાથથી વિદ્યુત ઉપકરણોને કેમ નહીં સ્પર્શ કરવું જોઈએ?'
      },
      options: {
        english: ['Water makes appliances dirty', 'Water is a conductor and increases risk of electric shock', 'It damages the appliance', 'It wastes electricity'],
        hindi: ['पानी उपकरणों को गंदा करता है', 'पानी एक सुचालक है और बिजली के झटके का खतरा बढ़ाता है', 'यह उपकरण को नुकसान पहुंचाता है', 'यह बिजली बर्बाद करता है'],
        gujarati: ['પાણી ઉપકરણોને ગંદા બનાવે છે', 'પાણી સુવાહક છે અને વીજળીના આંચકાનું જોખમ વધારે છે', 'તે ઉપકરણને નુકસાન પહોંચાડે છે', 'તે વીજળી બગાડે છે']
      },
      correctAnswer: 1,
      explanation: {
        english: 'Water (especially with dissolved salts) is a conductor of electricity. Wet hands increase the risk of electric current passing through our body, causing shock.',
        hindi: 'पानी (विशेषकर घुले हुए लवण के साथ) विद्युत का सुचालक है। गीले हाथ हमारे शरीर के माध्यम से विद्युत धारा प्रवाहित होने का खतरा बढ़ाते हैं, जिससे झटका लग सकता है।',
        gujarati: 'પાણી (ખાસ કરીને ઓગળેલા ક્ષાર સાથે) વીજળીનું સુવાહક છે. ભીના હાથ આપણા શરીરમાંથી વિદ્યુત પ્રવાહ પસાર થવાનું જોખમ વધારે છે, જે આંચકો આપી શકે છે.'
      },
      topic: 'safety'
    },
    {
      id: 'ci_12',
      type: 'trueFalse',
      difficulty: 'hard',
      question: {
        english: 'Human body is a conductor of electricity.',
        hindi: 'मानव शरीर विद्युत का सुचालक है।',
        gujarati: 'માનવ શરીર વીજળીનું સુવાહક છે.'
      },
      options: {
        english: ['True', 'False'],
        hindi: ['सही', 'गलत'],
        gujarati: ['સાચું', 'ખોટું']
      },
      correctAnswer: 0,
      explanation: {
        english: 'True! Human body contains water and salts that make it a conductor of electricity. This is why electric shock can be dangerous or even fatal.',
        hindi: 'सही! मानव शरीर में पानी और लवण होते हैं जो इसे विद्युत का सुचालक बनाते हैं। यही कारण है कि बिजली का झटका खतरनाक या घातक भी हो सकता है।',
        gujarati: 'સાચું! માનવ શરીરમાં પાણી અને ક્ષાર છે જે તેને વીજળીનું સુવાહક બનાવે છે. આ કારણે જ વીજળીનો આંચકો ખતરનાક અથવા જીવલેણ પણ હોઈ શકે છે.'
      },
      topic: 'safety'
    },
    {
      id: 'ci_13',
      type: 'mcq',
      difficulty: 'hard',
      question: {
        english: 'What should you do if you see a wire with damaged insulation?',
        hindi: 'यदि आप क्षतिग्रस्त इन्सुलेशन वाले तार को देखें तो आपको क्या करना चाहिए?',
        gujarati: 'જો તમે ક્ષતિગ્રસ્ત ઇન્સ્યુલેશન સાથેના તારને જુઓ તો તમારે શું કરવું જોઈએ?'
      },
      options: {
        english: ['Touch it to check if it works', 'Leave it as it is', 'Inform an adult and do not touch it', 'Try to repair it yourself'],
        hindi: ['इसे छूकर देखें कि यह काम करता है या नहीं', 'इसे जैसा है वैसा ही छोड़ दें', 'किसी वयस्क को सूचित करें और इसे न छुएं', 'इसे स्वयं ठीक करने का प्रयास करें'],
        gujarati: ['તે કામ કરે છે કે નહીં તે તપાસવા માટે તેને સ્પર્શ કરો', 'તેને જેમ છે તેમ છોડી દો', 'કોઈ પુખ્ત વયના વ્યક્તિને જાણ કરો અને તેને સ્પર્શ ન કરો', 'તેને જાતે સરખું કરવાનો પ્રયાસ કરો']
      },
      correctAnswer: 2,
      explanation: {
        english: 'Damaged insulation exposes the conducting wire, which can cause electric shock. Always inform an adult and never touch or try to repair it yourself.',
        hindi: 'क्षतिग्रस्त इन्सुलेशन सुचालक तार को उजागर कर देता है, जिससे बिजली का झटका लग सकता है। हमेशा किसी वयस्क को सूचित करें और इसे कभी भी खुद न छुएं या ठीक करने का प्रयास न करें।',
        gujarati: 'ક્ષતિગ્રસ્ત ઇન્સ્યુલેશન સુવાહક તારને ખુલ્લો પાડે છે, જે વીજળીનો આંચકો આપી શકે છે. હંમેશા પુખ્ત વયના વ્યક્તિને જાણ કરો અને ક્યારેય જાતે સ્પર્શ કરો નહીં અથવા સારું કરવાનો પ્રયાસ કરો નહીં.'
      },
      topic: 'safety'
    },
    {
      id: 'ci_14',
      type: 'mcq',
      difficulty: 'medium',
      question: {
        english: 'Why are the handles of electric tools made of plastic or rubber?',
        hindi: 'विद्युत उपकरणों के हैंडल प्लास्टिक या रबर से क्यों बनाए जाते हैं?',
        gujarati: 'વીજળીના સાધનોના હેન્ડલ પ્લાસ્ટિક અથવા રબરથી કેમ બનાવવામાં આવે છે?'
      },
      options: {
        english: ['To make them comfortable to hold', 'To protect from electric shock', 'To make them look nice', 'To make them cheaper'],
        hindi: ['उन्हें पकड़ने में आरामदायक बनाने के लिए', 'बिजली के झटके से बचाने के लिए', 'उन्हें अच्छा दिखाने के लिए', 'उन्हें सस्ता बनाने के लिए'],
        gujarati: ['તેમને પકડવામાં આરામદાયક બનાવવા માટે', 'વીજળીના આંચકાથી બચાવવા માટે', 'તેમને સુંદર બનાવવા માટે', 'તેમને સસ્તા બનાવવા માટે']
      },
      correctAnswer: 1,
      explanation: {
        english: 'Plastic and rubber are insulators. Handles made of these materials prevent electricity from reaching our hands and protect us from shocks.',
        hindi: 'प्लास्टिक और रबर कुचालक हैं। इन सामग्रियों से बने हैंडल विद्युत को हमारे हाथों तक पहुंचने से रोकते हैं और हमें झटके से बचाते हैं।',
        gujarati: 'પ્લાસ્ટિક અને રબર કુવાહક છે. આ સામગ્રીઓથી બનેલા હેન્ડલ વીજળીને આપણા હાથ સુધી પહોંચતી અટકાવે છે અને આપણને આંચકાથી બચાવે છે.'
      },
      topic: 'applications'
    },
    {
      id: 'ci_15',
      type: 'mcq',
      difficulty: 'hard',
      question: {
        english: 'A bird sitting on a single electric wire does not get shocked. Why?',
        hindi: 'एकल बिजली के तार पर बैठा पक्षी झटका नहीं खाता। क्यों?',
        gujarati: 'એક વીજળીના તાર પર બેઠેલા પક્ષીને આંચકો લાગતો નથી. શા માટે?'
      },
      options: {
        english: ['Birds are insulators', 'Birds have thick feathers', 'Current needs a complete path to flow', 'The wire has low voltage'],
        hindi: ['पक्षी कुचालक होते हैं', 'पक्षियों के मोटे पंख होते हैं', 'धारा को प्रवाहित होने के लिए पूर्ण पथ की आवश्यकता होती है', 'तार में कम वोल्टेज होता है'],
        gujarati: ['પક્ષીઓ કુવાહક છે', 'પક્ષીઓને જાડા પીંછાં હોય છે', 'પ્રવાહને વહેવા માટે સંપૂર્ણ માર્ગની જરૂર છે', 'તારમાં ઓછું વોલ્ટેજ છે']
      },
      correctAnswer: 2,
      explanation: {
        english: 'Electric current needs a complete circuit to flow. The bird touches only one wire, so current has no complete path to flow through its body.',
        hindi: 'विद्युत धारा को प्रवाहित होने के लिए पूर्ण सर्किट की आवश्यकता होती है। पक्षी केवल एक तार को छूता है, इसलिए धारा के पास उसके शरीर से प्रवाहित होने के लिए कोई पूर्ण पथ नहीं है।',
        gujarati: 'વિદ્યુત પ્રવાહને વહેવા માટે સંપૂર્ણ સર્કિટની જરૂર છે. પક્ષી ફક્ત એક તારને સ્પર્શે છે, તેથી પ્રવાહને તેના શરીરમાંથી વહેવા માટે કોઈ સંપૂર્ણ માર્ગ નથી.'
      },
      topic: 'applications'
    },
    {
      id: 'ci_16',
      type: 'mcq',
      difficulty: 'hard',
      question: {
        english: 'You want to test if a coin is a conductor. Your tester\'s lamp doesn\'t glow when you touch the coin. What could be the problem?',
        hindi: 'आप यह परीक्षण करना चाहते हैं कि सिक्का सुचालक है या नहीं। जब आप सिक्के को छूते हैं तो आपके परीक्षक का लैंप नहीं चमकता। समस्या क्या हो सकती है?',
        gujarati: 'તમે પરીક્ષણ કરવા માંગો છો કે સિક્કો સુવાહક છે કે નહીં. જ્યારે તમે સિક્કાને સ્પર્શ કરો છો ત્યારે તમારા પરીક્ષકનો દીવો પ્રકાશતો નથી. સમસ્યા શું હોઈ શકે?'
      },
      options: {
        english: ['The coin is not a conductor', 'The battery may be dead or wires may be loose', 'Coins cannot conduct electricity', 'The lamp is too bright'],
        hindi: ['सिक्का सुचालक नहीं है', 'बैटरी खत्म हो सकती है या तार ढीले हो सकते हैं', 'सिक्के विद्युत का संचालन नहीं कर सकते', 'लैंप बहुत चमकीला है'],
        gujarati: ['સિક્કો સુવાહક નથી', 'બેટરી ખતમ થઈ ગઈ હશે અથવા તારો ઢીલા હશે', 'સિક્કા વીજળી વહન કરી શકતા નથી', 'દીવો ખૂબ તેજસ્વી છે']
      },
      correctAnswer: 1,
      explanation: {
        english: 'Coins are made of metal and are conductors. If the lamp doesn\'t glow, check if the battery is working or if the connections are loose. Test by touching the free ends together first.',
        hindi: 'सिक्के धातु से बने होते हैं और सुचालक होते हैं। यदि लैंप नहीं चमकता है, तो जांचें कि बैटरी काम कर रही है या नहीं या कनेक्शन ढीले हैं या नहीं। पहले मुक्त सिरों को एक साथ छूकर परीक्षण करें।',
        gujarati: 'સિક્કા ધાતુથી બનેલા છે અને સુવાહક છે. જો દીવો પ્રકાશતો નથી, તો તપાસો કે બેટરી કામ કરી રહી છે કે નહીં અથવા જોડાણો ઢીલા છે કે નહીં. પહેલા મુક્ત છેડાઓને સાથે સ્પર્શ કરીને પરીક્ષણ કરો.'
      },
      topic: 'testing'
    },
    {
      id: 'ci_17',
      type: 'mcq',
      difficulty: 'hard',
      question: {
        english: 'Which material combination would be BEST for making a safe electrical plug?',
        hindi: 'सुरक्षित विद्युत प्लग बनाने के लिए कौन सा सामग्री संयोजन सर्वोत्तम होगा?',
        gujarati: 'સુરક્ષિત વિદ્યુત પ્લગ બનાવવા માટે કઈ સામગ્રી સંયોજન શ્રેષ્ઠ હશે?'
      },
      options: {
        english: ['Metal pins with plastic body', 'All plastic', 'All metal', 'Wood pins with metal body'],
        hindi: ['प्लास्टिक बॉडी के साथ धातु की पिन', 'सभी प्लास्टिक', 'सभी धातु', 'धातु की बॉडी के साथ लकड़ी की पिन'],
        gujarati: ['પ્લાસ્ટિક બોડી સાથે ધાતુની પિન', 'બધું પ્લાસ્ટિક', 'બધી ધાતુ', 'ધાતુના શરીર સાથે લાકડાની પિન']
      },
      correctAnswer: 0,
      explanation: {
        english: 'Metal pins conduct electricity to make the connection, while the plastic body insulates and protects us from touching the conducting parts.',
        hindi: 'धातु की पिन कनेक्शन बनाने के लिए विद्युत का संचालन करती हैं, जबकि प्लास्टिक की बॉडी हमें सुचालक भागों को छूने से इन्सुलेट और सुरक्षित करती है।',
        gujarati: 'ધાતુની પિન જોડાણ બનાવવા માટે વીજળી વહન કરે છે, જ્યારે પ્લાસ્ટિક બોડી આપણને સુવાહક ભાગોને સ્પર્શ કરવાથી અલગ રાખે છે અને સુરક્ષિત કરે છે.'
      },
      topic: 'applications'
    },
    {
      id: 'ci_18',
      type: 'trueFalse',
      difficulty: 'hard',
      question: {
        english: 'Pure water (distilled water) is a poor conductor of electricity.',
        hindi: 'शुद्ध पानी (आसुत जल) विद्युत का कमजोर सुचालक है।',
        gujarati: 'શુદ્ધ પાણી (નિસ્યંદિત પાણી) વીજળીનું નબળું સુવાહક છે.'
      },
      options: {
        english: ['True', 'False'],
        hindi: ['सही', 'गलत'],
        gujarati: ['સાચું', 'ખોટું']
      },
      correctAnswer: 0,
      explanation: {
        english: 'True! Pure water doesn\'t conduct electricity well. But water we use daily has dissolved salts and minerals that make it a good conductor.',
        hindi: 'सही! शुद्ध पानी विद्युत का अच्छा संचालन नहीं करता। लेकिन हम रोजाना जो पानी उपयोग करते हैं उसमें घुले हुए लवण और खनिज होते हैं जो इसे अच्छा सुचालक बनाते हैं।',
        gujarati: 'સાચું! શુદ્ધ પાણી વીજળીનું સારું વહન કરતું નથી. પરંતુ આપણે દરરોજ જે પાણીનો ઉપયોગ કરીએ છીએ તેમાં ઓગળેલા ક્ષાર અને ખનિજો હોય છે જે તેને સારું સુવાહક બનાવે છે.'
      },
      topic: 'properties'
    }
  ];

  // Topic definitions
  const topics = [
    {
      id: 'identification',
      name: t('practice.topics.identification.name'),
      description: t('practice.topics.identification.description'),
      icon: '🔍',
      color: 'blue',
      questionCount: questionBank.filter(q => q.topic === 'identification').length
    },
    {
      id: 'properties',
      name: t('practice.topics.properties.name'),
      description: t('practice.topics.properties.description'),
      icon: '⚡',
      color: 'green',
      questionCount: questionBank.filter(q => q.topic === 'properties').length
    },
    {
      id: 'wires',
      name: t('practice.topics.wires.name'),
      description: t('practice.topics.wires.description'),
      icon: '🔌',
      color: 'purple',
      questionCount: questionBank.filter(q => q.topic === 'wires').length
    },
    {
      id: 'testing',
      name: t('practice.topics.testing.name'),
      description: t('practice.topics.testing.description'),
      icon: '🧪',
      color: 'yellow',
      questionCount: questionBank.filter(q => q.topic === 'testing').length
    },
    {
      id: 'safety',
      name: t('practice.topics.safety.name'),
      description: t('practice.topics.safety.description'),
      icon: '⚠️',
      color: 'red',
      questionCount: questionBank.filter(q => q.topic === 'safety').length
    },
    {
      id: 'applications',
      name: t('practice.topics.applications.name'),
      description: t('practice.topics.applications.description'),
      icon: '💡',
      color: 'orange',
      questionCount: questionBank.filter(q => q.topic === 'applications').length
    }
  ];

  const startPractice = (topicId: string | null) => {
    let questions: Question[] = [];

    if (topicId === 'mixed') {
      // Mixed practice: 3 random questions from each topic
      topics.forEach(topic => {
        const topicQuestions = questionBank.filter(q => q.topic === topic.id);
        const shuffled = [...topicQuestions].sort(() => Math.random() - 0.5);
        questions.push(...shuffled.slice(0, 3));
      });
    } else if (topicId) {
      // Topic-specific practice
      questions = questionBank.filter(q => q.topic === topicId);
    }

    // Shuffle questions
    questions = questions.sort(() => Math.random() - 0.5);

    setSelectedTopic(topicId);
    setCurrentQuestions(questions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setUserAnswers(new Array(questions.length).fill(null));
    setShowResults(false);
    setCurrentView('practice');
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (!isAnswered) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer !== null && !isAnswered) {
      setIsAnswered(true);
      const newUserAnswers = [...userAnswers];
      newUserAnswers[currentQuestionIndex] = selectedAnswer;
      setUserAnswers(newUserAnswers);

      if (selectedAnswer === currentQuestions[currentQuestionIndex].correctAnswer) {
        setScore(score + 1);
      }
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(userAnswers[currentQuestionIndex - 1]);
      setIsAnswered(true);
    }
  };

  const resetPractice = () => {
    startPractice(selectedTopic);
  };

  const currentQuestion = currentQuestions[currentQuestionIndex];
  const percentage = Math.round((score / currentQuestions.length) * 100);

  // Topic Selection Screen
  const renderTopicSelection = () => (
    <div className="bg-white p-8 rounded-2xl shadow-xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          ⚡ {t('practice.practiceMode')}
        </h1>
      </div>

      {/* Mixed Practice Card */}
      <div
        onClick={() => startPractice('mixed')}
        className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-xl shadow-lg cursor-pointer transform hover:scale-105 transition-all border-2 border-purple-600"
      >
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-3xl">
              🎯
            </div>
            <div>
              <h3 className="text-2xl font-bold">{t('practice.mixedPractice')}</h3>
              <p className="text-purple-100">{t('practice.allTopics')}</p>
              <p className="text-sm text-purple-200 mt-1">
                {topics.reduce((sum, topic) => sum + Math.min(3, topic.questionCount), 0)} {t('practice.questions')}
              </p>
            </div>
          </div>
          <ChevronRight className="w-8 h-8" />
        </div>
      </div>

      {/* Individual Topic Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map((topic) => (
          <div
            key={topic.id}
            onClick={() => startPractice(topic.id)}
            className={`bg-gradient-to-br from-${topic.color}-50 to-${topic.color}-100 p-6 rounded-xl shadow-md cursor-pointer transform hover:scale-105 transition-all border-2 border-${topic.color}-300 hover:border-${topic.color}-500`}
          >
            <div className="text-center">
              <div className="text-5xl mb-3">{topic.icon}</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {topic.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {topic.description}
              </p>
              <div className={`inline-flex items-center gap-2 px-3 py-1 bg-${topic.color}-200 text-${topic.color}-800 rounded-full text-sm font-semibold`}>
                <Target className="w-4 h-4" />
                {topic.questionCount} {t('practice.questions')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Practice Screen
  const renderPractice = () => {
    if (showResults) {
      return renderResults();
    }

    if (!currentQuestion) return null;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    return (
      <div className="bg-white p-8 rounded-2xl shadow-xl">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">
              {t('practice.progress')}: {currentQuestionIndex + 1} / {currentQuestions.length}
            </span>
            <span className="text-sm font-semibold text-gray-700">
              {t('practice.yourScore')}: {score} / {currentQuestions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Difficulty Badge */}
        <div className="mb-4">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
            currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
            <Brain className="w-4 h-4" />
            {currentQuestion.difficulty === 'easy' ? t('practice.easy') :
              currentQuestion.difficulty === 'medium' ? t('practice.medium') :
                t('practice.hard')}
          </span>
        </div>

        {/* Question */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl mb-6 border-2 border-blue-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            {currentQuestion.question[langKey]}
          </h3>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {currentQuestion.options?.[langKey].map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={isAnswered}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${isAnswered
                ? index === currentQuestion.correctAnswer
                  ? 'bg-green-100 border-green-500 text-green-800'
                  : index === selectedAnswer
                    ? 'bg-red-100 border-red-500 text-red-800'
                    : 'bg-gray-50 border-gray-300 text-gray-600'
                : selectedAnswer === index
                  ? 'bg-blue-100 border-blue-500 text-blue-800'
                  : 'bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                } ${isAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${isAnswered
                  ? index === currentQuestion.correctAnswer
                    ? 'bg-green-500 text-white'
                    : index === selectedAnswer
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  : selectedAnswer === index
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                  }`}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="flex-1 font-medium">{option}</span>
                {isAnswered && index === currentQuestion.correctAnswer && (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                )}
                {isAnswered && index === selectedAnswer && index !== currentQuestion.correctAnswer && (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Feedback */}
        {isAnswered && (
          <div className={`p-6 rounded-xl mb-6 border-2 ${isCorrect
            ? 'bg-green-50 border-green-500'
            : 'bg-red-50 border-red-500'
            }`}>
            <div className="flex items-start gap-3 mb-3">
              {isCorrect ? (
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              )}
              <div>
                <h4 className={`text-xl font-bold mb-2 ${isCorrect ? 'text-green-800' : 'text-red-800'
                  }`}>
                  {isCorrect ? t('practice.correct') : t('practice.incorrect')}
                </h4>
                {!isCorrect && (
                  <p className="text-red-700 mb-2">
                    <strong>{t('practice.correctAnswer')}</strong> {currentQuestion.options?.[langKey][currentQuestion.correctAnswer]}
                  </p>
                )}
                <p className="text-gray-700">
                  <strong>{t('practice.explanation')}</strong> {currentQuestion.explanation[langKey]}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          {currentQuestionIndex > 0 && (
            <button
              onClick={handlePrevious}
              className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              {t('common.previous')}
            </button>
          )}

          {!isAnswered ? (
            <button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className={`flex-1 py-3 rounded-lg font-semibold transition ${selectedAnswer === null
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600'
                }`}
            >
              {t('practice.submitAnswer')}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition flex items-center justify-center gap-2"
            >
              {currentQuestionIndex < currentQuestions.length - 1 ? t('practice.nextQuestion') : t('practice.finishPractice')}
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    );
  };

  // Results Screen
  const renderResults = () => {
    const getPerformanceMessage = () => {
      if (percentage >= 80) {
        return {
          title: t('practice.excellentWork'),
          message: t('practice.outstandingWork'),
          icon: Trophy,
          color: 'yellow'
        };
      } else if (percentage >= 60) {
        return {
          title: t('practice.goodJob'),
          message: t('practice.goodWork'),
          icon: Star,
          color: 'blue'
        };
      } else {
        return {
          title: t('practice.keepPracticing'),
          message: t('practice.dontGiveUp'),
          icon: BookOpen,
          color: 'purple'
        };
      }
    };

    const performance = getPerformanceMessage();
    const PerformanceIcon = performance.icon;

    return (
      <div className="bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-${performance.color}-100 mb-4`}>
            <PerformanceIcon className={`w-12 h-12 text-${performance.color}-600`} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {performance.title}
          </h2>
          <p className="text-lg text-gray-600">
            {performance.message}
          </p>
        </div>

        {/* Score Display */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-xl mb-8 border-2 border-blue-200">
          <div className="text-center">
            <p className="text-gray-600 mb-2">{t('practice.yourScore')}</p>
            <div className="text-6xl font-bold text-gray-800 mb-2">
              {score} / {currentQuestions.length}
            </div>
            <div className="text-3xl font-bold text-blue-600">
              {percentage}%
            </div>
          </div>
        </div>

        {/* Performance Breakdown */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-green-50 p-4 rounded-xl border-2 border-green-200 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-700">{score}</div>
            <div className="text-sm text-gray-600">
              {t('practice.correct')}
            </div>
          </div>
          <div className="bg-red-50 p-4 rounded-xl border-2 border-red-200 text-center">
            <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-700">{currentQuestions.length - score}</div>
            <div className="text-sm text-gray-600">
              {t('practice.incorrect')}
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200 text-center">
            <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-700">{currentQuestions.length}</div>
            <div className="text-sm text-gray-600">
              {t('practice.total')}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => setCurrentView('topics')}
            className="flex-1 px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            {t('practice.backToTopics')}
          </button>
          <button
            onClick={resetPractice}
            className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-lg hover:from-green-600 hover:to-blue-600 transition flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            {t('practice.tryAgain')}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {currentView === 'topics' && renderTopicSelection()}
        {currentView === 'practice' && renderPractice()}
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

