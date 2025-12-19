import React, { useState, useRef, useEffect, useMemo, createContext, useContext, ReactNode } from 'react';
import { Flame, ThermometerSun, AlertTriangle, ChevronDown, ChevronUp, Beaker, Info, RotateCcw, ChevronRight, CheckCircle, XCircle, Award, Lightbulb, Sparkles, BookOpen, Zap, HardHat, Factory, Globe, Utensils, Shirt, Building2, Mountain } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

// ============================================================================
// Type Definitions (from circuitTypes.ts)
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center gap-2">
            <Flame className="w-6 h-6 text-teal-600" aria-hidden="true" />
            <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent">
              {t('nav.logo')}
            </span>
          </div>

          <div className="flex items-center space-x-1 md:space-x-2">
            <button
              type="button"
              onClick={() => setMode('learn')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isLearn
                  ? 'bg-teal-500 text-white shadow-md'
                  : 'text-teal-700 hover:bg-teal-100/50'
              }`}
            >
              📚 {t('Learn')}
            </button>

            <button
              type="button"
              onClick={() => setMode('practice')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isPractice
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'text-purple-700 hover:bg-purple-100/50'
              }`}
            >
              🎯 {t('Practice')}
            </button>

            <button
              type="button"
              onClick={() => setMode('applications')}
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

            <div className="ml-2 md:ml-4">
              <LanguageSelector />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

// ============================================================================
// Conduction Learn Mode Component (inline)
// ============================================================================
const pins = [
  { id: 'pin1', label: 'I', xPosition: 360, fallOrder: 1, color: '#EF4444' },
  { id: 'pin2', label: 'II', xPosition: 290, fallOrder: 2, color: '#F97316' },
  { id: 'pin3', label: 'III', xPosition: 220, fallOrder: 3, color: '#FBBF24' },
  { id: 'pin4', label: 'IV', xPosition: 150, fallOrder: 4, color: '#10B981' },
];

const ConductionLearnModeInteractive: React.FC = () => {
  const { t } = useLanguage();
  const [expandedSections, setExpandedSections] = useState<string[]>(['intro', 'activity']);

  const [heatIntensity, setHeatIntensity] = useState(0);
  const [fallenPins, setFallenPins] = useState<string[]>([]);
  const [isHeating, setIsHeating] = useState(false);
  const [currentFallingPin, setCurrentFallingPin] = useState<string | null>(null);

  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [testedMaterials, setTestedMaterials] = useState<string[]>([]);
  const [showMaterialResult, setShowMaterialResult] = useState(false);

  const [draggedMaterial, setDraggedMaterial] = useState<string | null>(null);
  const [materialPositions, setMaterialPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [materialInTest, setMaterialInTest] = useState<string | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]));
  };

  const materials = useMemo(
    () => [
      { id: 'steel', name: t('conduction.materials.steel'), type: 'conductor', color: '#64748B', emoji: '🔧' },
      { id: 'copper', name: t('conduction.materials.copper'), type: 'conductor', color: '#C87533', emoji: '🟠' },
      { id: 'aluminum', name: t('conduction.materials.aluminum'), type: 'conductor', color: '#A8A9AD', emoji: '⚪' },
      { id: 'wood', name: t('conduction.materials.wood'), type: 'insulator', color: '#8B5A2B', emoji: '🪵' },
      { id: 'plastic', name: t('conduction.materials.plastic'), type: 'insulator', color: '#3B82F6', emoji: '🔴' },
      { id: 'glass', name: t('conduction.materials.glass'), type: 'insulator', color: '#93C5FD', emoji: '💎' },
    ],
    [t],
  );

  useEffect(() => {
    const positions: Record<string, { x: number; y: number }> = {};
    materials.forEach((material, index) => {
      const col = index % 3;
      const row = Math.floor(index / 3);
      positions[material.id] = {
        x: 100 + col * 100,
        y: 280 + row * 60,
      };
    });
    setMaterialPositions(positions);
  }, []);

  const startHeating = () => {
    setIsHeating(true);
    setHeatIntensity(0);
    setFallenPins([]);
    setCurrentFallingPin(null);

    const heatInterval = setInterval(() => {
      setHeatIntensity((prev) => {
        const newIntensity = prev + 1;

        pins.forEach((pin) => {
          const triggerPoint = pin.fallOrder * 25;

          if (newIntensity === triggerPoint - 2 && !fallenPins.includes(pin.id) && currentFallingPin !== pin.id) {
            setTimeout(() => {
              setCurrentFallingPin(pin.id);
              setTimeout(() => {
                setFallenPins((prevPins) => [...prevPins, pin.id]);
                setCurrentFallingPin(null);
              }, 1000);
            }, 100);
          }
        });

        if (newIntensity >= 100) {
          clearInterval(heatInterval);
          setTimeout(() => setIsHeating(false), 500);
          return 100;
        }
        return newIntensity;
      });
    }, 100);
  };

  const resetHeating = () => {
    setHeatIntensity(0);
    setFallenPins([]);
    setIsHeating(false);
    setCurrentFallingPin(null);
  };

  const screenToSVG = (clientX: number, clientY: number) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()!.inverse());
    return { x: svgP.x, y: svgP.y };
  };

  const handleMaterialMouseDown = (e: React.MouseEvent, materialId: string) => {
    e.preventDefault();
    setDraggedMaterial(materialId);
  };

  const handleMaterialMouseMove = (e: React.MouseEvent) => {
    if (!draggedMaterial || !svgRef.current) return;
    e.preventDefault();

    const svgCoords = screenToSVG(e.clientX, e.clientY);
    setMaterialPositions((prev) => ({
      ...prev,
      [draggedMaterial]: { x: svgCoords.x, y: svgCoords.y },
    }));
  };

  const handleMaterialMouseUp = () => {
    if (!draggedMaterial) return;

    const pos = materialPositions[draggedMaterial];
    const testZone = { x: 230, y: 150, radius: 50 };
    const distance = Math.sqrt(Math.pow(pos.x - testZone.x, 2) + Math.pow(pos.y - testZone.y, 2));

    if (distance < testZone.radius) {
      setMaterialPositions((prev) => ({
        ...prev,
        [draggedMaterial]: { x: testZone.x, y: testZone.y },
      }));
      setMaterialInTest(draggedMaterial);
      setSelectedMaterial(draggedMaterial);
      if (!testedMaterials.includes(draggedMaterial)) {
        setTestedMaterials((prev) => [...prev, draggedMaterial]);
      }
      setShowMaterialResult(true);
    }

    setDraggedMaterial(null);
  };

  const testMaterial = (materialId: string) => {
    setSelectedMaterial(materialId);
    setShowMaterialResult(true);
    if (!testedMaterials.includes(materialId)) {
      setTestedMaterials((prev) => [...prev, materialId]);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-6 md:p-8"
      style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes smoothFall {
          0% { transform: translateY(0); opacity: 1; }
          20% { transform: translateY(10px); opacity: 0.9; }
          50% { transform: translateY(40px); opacity: 0.7; }
          80% { transform: translateY(90px); opacity: 0.5; }
          100% { transform: translateY(115px); opacity: 1; }
        }
        @keyframes waxMelt {
          0% { opacity: 1; transform: scaleY(1); }
          50% { opacity: 0.5; transform: scaleY(0.7); }
          100% { opacity: 0; transform: scaleY(0.3); }
        }
        @keyframes heatPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
      `}</style>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 mb-6 sm:mb-8">
          <button
            onClick={() => toggleSection('activity')}
            className="w-full bg-gradient-to-r from-red-600 to-orange-600 p-6 text-white flex items-center justify-between hover:from-red-700 hover:to-orange-700 transition"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <Beaker className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">🔥 {t('conduction.activity.sectionTitle')}</h2>
            </div>
            {expandedSections.includes('activity') ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
          </button>

          {expandedSections.includes('activity') && (
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 sm:p-5 lg:p-6 rounded-lg mb-6 sm:mb-8">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-red-900 mb-2">{t('conduction.activity.safetyTitle')}</h4>
                    <p className="text-red-800 text-sm">{t('conduction.activity.safetyText')}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-slate-100 p-4 sm:p-6 rounded-2xl border-2 border-gray-300 mb-6 sm:mb-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
                  <h4 className="text-lg sm:text-xl font-bold text-gray-800">🎮 {t('conduction.activity.simulationTitle')}</h4>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={startHeating}
                      disabled={isHeating}
                      className={`px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base font-semibold flex items-center gap-2 ${
                        isHeating ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'
                      }`}
                    >
                      <Flame className="w-5 h-5" />
                      {t('conduction.activity.controls.start')}
                    </button>
                    <button
                      onClick={resetHeating}
                      className="px-4 sm:px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm sm:text-base font-semibold flex items-center gap-2"
                    >
                      <RotateCcw className="w-5 h-5" />
                      {t('conduction.activity.controls.reset')}
                    </button>
                  </div>
                </div>

                <div className="mb-6 bg-white p-3 sm:p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">{t('conduction.activity.controls.heatIntensity')}</span>
                    <span className="text-sm font-bold text-orange-600">{heatIntensity}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div className="h-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 transition-all duration-300 rounded-full" style={{ width: `${heatIntensity}%` }}>
                      {heatIntensity > 0 && <div className="h-full w-full animate-pulse"></div>}
                    </div>
                  </div>
                </div>

                <div className="w-full overflow-x-auto">
                  <svg
                    ref={svgRef}
                    viewBox="0 0 500 280"
                    className="min-w-[360px] sm:min-w-[420px] w-full bg-white rounded-xl shadow-md"
                    preserveAspectRatio="xMidYMid meet"
                  >
                  <defs>
                    <linearGradient id="woodGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#8B4513" />
                      <stop offset="50%" stopColor="#A0522D" />
                      <stop offset="100%" stopColor="#654321" />
                    </linearGradient>
                  </defs>
                  <rect x="20" y="240" width="460" height="30" fill="url(#woodGradient)" stroke="#5C2E0A" strokeWidth="2" rx="4" />
                  <rect x="20" y="240" width="460" height="5" fill="#A0522D" opacity="0.6" />

                  <rect x="50" y="80" width="12" height="160" fill="#2C3E50" stroke="#1a252f" strokeWidth="1.5" rx="2" />
                  <ellipse cx="56" cy="245" rx="25" ry="8" fill="#34495E" />
                  <rect x="31" y="235" width="50" height="10" fill="#2C3E50" rx="2" />

                  <rect x="58" y="95" width="20" height="12" fill="#34495E" stroke="#1a252f" strokeWidth="1" rx="2" />
                  <circle cx="68" cy="101" r="3" fill="#7F8C8D" />

                  <rect x="78" y="98" width="340" height="8" fill="#94A3B8" stroke="#64748B" strokeWidth="2" rx="2" />
                  <rect x="78" y="99" width="340" height="2" fill="#CBD5E1" opacity="0.6" rx="1" />

                  {heatIntensity > 0 && (
                    <>
                      <defs>
                        <radialGradient id="heatGlow" cx="50%" cy="50%">
                          <stop offset="0%" stopColor="#FCD34D" stopOpacity={heatIntensity / 100} />
                          <stop offset="50%" stopColor="#F59E0B" stopOpacity={heatIntensity / 150} />
                          <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
                        </radialGradient>
                      </defs>
                      <circle cx="415" cy="102" r={40 + heatIntensity / 5} fill="url(#heatGlow)" className="animate-pulse" />
                      <circle cx="415" cy="102" r={25 + heatIntensity / 10} fill="#F59E0B" opacity={heatIntensity / 200} />
                    </>
                  )}

                  {heatIntensity > 0 && (
                    <>
                      {[...Array(3)].map((_, i) => {
                        const offset = (heatIntensity / 100) * 320;
                        return (
                          <line
                            key={i}
                            x1={415 - offset + i * 30}
                            y1="102"
                            x2={415 - offset + i * 30 - 20}
                            y2="102"
                            stroke="#F59E0B"
                            strokeWidth="3"
                            opacity={(heatIntensity / 100) * (1 - i * 0.3)}
                            className="transition-all duration-300"
                          />
                        );
                      })}
                    </>
                  )}

                  {pins.map((pin) => {
                    const hasFallen = fallenPins.includes(pin.id);
                    const isFalling = currentFallingPin === pin.id;
                    const pinTopY = hasFallen ? 200 : isFalling ? 150 : 85;
                    const waxMelted = hasFallen || isFalling;
                    const showGlow = heatIntensity >= pin.fallOrder * 20;

                    return (
                      <g key={pin.id}>
                        {!waxMelted && (
                          <>
                            <ellipse
                              cx={pin.xPosition}
                              cy="95"
                              rx="10"
                              ry="7"
                              fill="#FCD34D"
                              opacity={showGlow ? 0.5 : 1}
                              className={showGlow ? 'animate-pulse' : ''}
                              style={{ transition: 'opacity 0.5s ease' }}
                            />
                            {showGlow && <circle cx={pin.xPosition} cy="95" r="15" fill="#F59E0B" opacity="0.2" className="animate-ping" />}
                          </>
                        )}

                        {isFalling && (
                          <g style={{ animation: 'fadeIn 0.3s ease-in' }}>
                            <ellipse cx={pin.xPosition} cy="100" rx="8" ry="5" fill="#FCD34D" opacity="0.7" />
                            <ellipse cx={pin.xPosition} cy="105" rx="6" ry="4" fill="#FCD34D" opacity="0.5" />
                            <ellipse cx={pin.xPosition} cy="110" rx="4" ry="3" fill="#FCD34D" opacity="0.3" />
                          </g>
                        )}

                        <g
                          style={{
                            transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            transform: `translateY(${pinTopY - 85}px)`,
                          }}
                        >
                          <circle cx={pin.xPosition} cy={85} r="5" fill={pin.color} stroke="#1F2937" strokeWidth="1" />
                          <line x1={pin.xPosition} y1={90} x2={pin.xPosition} y2={110} stroke={pin.color} strokeWidth="3" strokeLinecap="round" />
                          <polygon points={`${pin.xPosition},110 ${pin.xPosition - 2.5},106 ${pin.xPosition + 2.5},106`} fill={pin.color} />
                        </g>

                        <text x={pin.xPosition} y="75" textAnchor="middle" className="text-sm font-bold" fill={hasFallen ? pin.color : '#1F2937'} style={{ transition: 'fill 0.3s ease' }}>
                          {pin.label}
                        </text>

                        {hasFallen && (
                          <text
                            x={pin.xPosition}
                            y="230"
                            textAnchor="middle"
                            className="text-xs font-bold"
                            fill={pin.color}
                            style={{
                              animation: 'fadeInScale 0.5s ease-out',
                              transformOrigin: 'center',
                            }}
                          >
                            ✓ Fallen
                          </text>
                        )}
                      </g>
                    );
                  })}

                  <g>
                    <rect x="405" y="150" width="20" height="40" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1.5" rx="2" />
                    <rect x="405" y="150" width="20" height="8" fill="#FCD34D" rx="2" />
                    <rect x="413.5" y="145" width="1.5" height="8" fill="#2C3E50" />
                    <ellipse cx="414.5" cy="138" rx="6" ry="10" fill="#FCD34D" className={isHeating ? 'animate-pulse' : ''} />
                    {isHeating && (
                      <>
                        <path d="M 414.5 133 Q 412 128, 414.5 123" stroke="#F59E0B" strokeWidth="2.5" fill="none" className="animate-pulse" />
                        <path d="M 414.5 133 Q 417 128, 414.5 123" stroke="#FBBF24" strokeWidth="2" fill="none" className="animate-pulse" />
                        <ellipse cx="414.5" cy="138" rx="3" ry="6" fill="#3B82F6" opacity="0.6" className="animate-pulse" />
                      </>
                    )}
                    <rect x="402" y="190" width="26" height="4" fill="#9CA3AF" rx="1" />
                    <rect x="400" y="194" width="30" height="8" fill="#6B7280" rx="2" />
                  </g>

                  <text x="56" y="75" textAnchor="middle" className="text-xs font-semibold" fill="#2C3E50">
                    Stand
                  </text>
                  <text x="248" y="90" textAnchor="middle" className="text-xs font-semibold" fill="#475569">
                    Metal strip
                  </text>
                  <text x="415" y="220" textAnchor="middle" className="text-xs font-semibold" fill="#F59E0B">
                    {t('conduction.testing.heatSource')}
                  </text>

                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                      <polygon points="0 0, 10 3, 0 6" fill="#F59E0B" />
                    </marker>
                  </defs>
                  <line x1="390" y1="125" x2="100" y2="125" stroke="#F59E0B" strokeWidth="3" strokeDasharray="8,4" markerEnd="url(#arrowhead)" opacity="0.7" />
                  <text x="245" y="145" textAnchor="middle" className="text-xs sm:text-sm font-bold" fill="#F59E0B">
                    {t('conduction.activity.heatFlowDirection')}
                  </text>
                  </svg>
                </div>

                <div className="mt-6 grid md:grid-cols-4 gap-3">
                  {pins.map((pin) => {
                    const hasFallen = fallenPins.includes(pin.id);
                    const expectedFall = heatIntensity >= pin.fallOrder * 25;

                    return (
                      <div
                        key={pin.id}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          hasFallen ? 'bg-green-50 border-green-400' : expectedFall && !hasFallen ? 'bg-yellow-50 border-yellow-400 animate-pulse' : 'bg-gray-50 border-gray-300'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-2xl font-bold mb-1" style={{ color: pin.color }}>
                            {t('conduction.activity.pinCard.pinLabel')} ({pin.label})
                          </div>
                          <div className="text-xs text-gray-600 mb-2">{t('conduction.activity.pinCard.order', { order: pin.fallOrder })}</div>
                          {hasFallen && <div className="text-sm font-bold text-green-700">{t('conduction.activity.pinCard.fallen')}</div>}
                          {expectedFall && !hasFallen && <div className="text-sm font-bold text-yellow-700">{t('conduction.activity.pinCard.falling')}</div>}
                          {!expectedFall && !hasFallen && <div className="text-sm text-gray-500">{t('conduction.activity.pinCard.waiting')}</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-xl border-2 border-blue-300 mb-6">
                <h4 className="font-bold text-blue-900 mb-4 text-base sm:text-lg">🔬 {t('conduction.activity.observations.title')}</h4>
                <div className="space-y-3">
                  <div className="bg-white p-3 sm:p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">1️⃣</span>
                      <div>
                        <p className="font-bold text-gray-800 text-sm sm:text-base">{t('conduction.activity.observations.item1Title')}</p>
                        <p className="text-xs sm:text-sm text-gray-600">{t('conduction.activity.observations.item1Body')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-3 sm:p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">2️⃣</span>
                      <div>
                        <p className="font-bold text-gray-800 text-sm sm:text-base">{t('conduction.activity.observations.item2Title')}</p>
                        <p className="text-xs sm:text-sm text-gray-600">{t('conduction.activity.observations.item2Body')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-3 sm:p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">💡</span>
                      <div>
                        <p className="font-bold text-gray-800 text-sm sm:text-base">{t('conduction.activity.observations.item3Title')}</p>
                        <p className="text-xs sm:text-sm text-gray-600">{t('conduction.activity.observations.item3Body')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 sm:p-6 rounded-xl border-2 border-purple-200">
                <h4 className="font-bold text-purple-900 mb-4 text-base sm:text-lg">📊 {t('conduction.activity.table.title')}</h4>
                <div className="overflow-x-auto">
                  <table className="w-full bg-white rounded-lg overflow-hidden shadow-md">
                    <thead className="bg-purple-100">
                      <tr>
                        <th className="p-3 text-left font-bold text-purple-900">{t('conduction.activity.table.pin')}</th>
                        <th className="p-3 text-left font-bold text-purple-900">{t('conduction.activity.table.order')}</th>
                        <th className="p-3 text-left font-bold text-purple-900">{t('conduction.activity.table.status')}</th>
                        <th className="p-3 text-left font-bold text-purple-900">{t('conduction.activity.table.reason')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pins.map((pin, index) => (
                        <tr key={pin.id} className={`border-t border-purple-200 ${index % 2 === 1 ? 'bg-purple-50' : ''}`}>
                          <td className="p-3 font-semibold">
                            {t('conduction.activity.pinCard.pinLabel')} ({pin.label})
                          </td>
                          <td className="p-3">{pin.fallOrder}</td>
                          <td className="p-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${fallenPins.includes(pin.id) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                              {fallenPins.includes(pin.id) ? t('conduction.activity.table.fallen') : t('conduction.activity.table.notFallen')}
                            </span>
                          </td>
                          <td className="p-3 text-sm text-gray-600">
                            {pin.fallOrder === 1
                              ? t('conduction.activity.table.reasonClosest')
                              : pin.fallOrder === 4
                              ? t('conduction.activity.table.reasonFarthest')
                              : t('conduction.activity.table.reasonProgress')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 mb-6 sm:mb-8">
          <button
            onClick={() => toggleSection('testing')}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white flex items-center justify-between hover:from-green-700 hover:to-emerald-700 transition"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <ThermometerSun className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">🎯 {t('conduction.testing.sectionTitle')}</h2>
            </div>
            {expandedSections.includes('testing') ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
          </button>

          {expandedSections.includes('testing') && (
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
                <p className="text-sm font-semibold text-yellow-900">🖱️ {t('conduction.testing.callout')}</p>
              </div>

              <div className="grid lg:grid-cols-3 gap-4 lg:gap-6 items-start">
                <div className="lg:col-span-2 bg-gradient-to-br from-gray-50 to-slate-100 p-4 sm:p-6 rounded-xl border-2 border-gray-300">
                  <h4 className="font-bold text-gray-800 mb-4 text-sm sm:text-base md:text-lg text-center">{t('conduction.testing.zoneTitle')}</h4>

                  <div className="w-full overflow-x-auto">
                    <svg
                      ref={svgRef}
                      viewBox="0 0 500 400"
                      className="min-w-[360px] sm:min-w-[420px] w-full bg-white rounded-xl shadow-md"
                      onMouseMove={handleMaterialMouseMove}
                      onMouseUp={handleMaterialMouseUp}
                      onMouseLeave={handleMaterialMouseUp}
                      preserveAspectRatio="xMidYMid meet"
                    >
                    <circle cx="230" cy="150" r="50" fill="none" stroke="#10B981" strokeWidth="3" strokeDasharray="8,4" opacity="0.5" />
                    <text x="230" y="90" textAnchor="middle" className="text-xs font-bold" fill="#10B981">
                      {t('conduction.testing.dropHere')}
                    </text>

                    <g>
                      <circle cx="80" cy="150" r="35" fill="#FCD34D" opacity="0.3" className="animate-pulse" />
                      <circle cx="80" cy="150" r="25" fill="#F59E0B" opacity="0.5" className="animate-pulse" />
                      <Flame x="65" y="135" className="w-8 h-8 text-red-500" />
                      <text x="80" y="200" textAnchor="middle" className="text-xs font-bold" fill="#F59E0B">
                        {t('conduction.testing.heatSource')}
                      </text>
                    </g>

                    {materialInTest && (
                      <>
                        <line x1="115" y1="150" x2="180" y2="150" stroke="#F59E0B" strokeWidth="3" strokeDasharray="5,5" className="animate-pulse" />
                        <defs>
                          <marker id="arrow-heat" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                            <polygon points="0 0, 10 3, 0 6" fill="#F59E0B" />
                          </marker>
                        </defs>
                        <line x1="115" y1="150" x2="175" y2="150" stroke="#F59E0B" strokeWidth="3" markerEnd="url(#arrow-heat)" className="animate-pulse" />
                      </>
                    )}

                    {materialInTest && (
                      <>
                        {materials.find((m) => m.id === materialInTest)?.type === 'conductor' ? (
                          <>
                            <line x1="280" y1="150" x2="345" y2="150" stroke="#10B981" strokeWidth="3" strokeDasharray="5,5" className="animate-pulse" />
                            <line x1="285" y1="150" x2="345" y2="150" stroke="#10B981" strokeWidth="3" markerEnd="url(#arrow-success)" />
                            <defs>
                              <marker id="arrow-success" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                                <polygon points="0 0, 10 3, 0 6" fill="#10B981" />
                              </marker>
                            </defs>
                            <circle cx="380" cy="150" r="25" fill="#FCD34D" className="animate-pulse" />
                            <circle cx="380" cy="150" r="30" fill="#FBBF24" opacity="0.4" className="animate-ping" />
                            <text x="380" y="155" textAnchor="middle" className="text-2xl">
                              💡
                            </text>
                            <text x="380" y="190" textAnchor="middle" className="text-xs font-bold" fill="#10B981">
                              {t('conduction.testing.heatPasses')}
                            </text>
                          </>
                        ) : (
                          <>
                            <line x1="280" y1="150" x2="345" y2="150" stroke="#DC2626" strokeWidth="3" strokeDasharray="5,5" opacity="0.5" />
                            <text x="315" y="145" textAnchor="middle" className="text-2xl">
                              🚫
                            </text>
                            <circle cx="380" cy="150" r="25" fill="#6B7280" opacity="0.3" />
                            <text x="380" y="155" textAnchor="middle" className="text-2xl opacity-50">
                              💡
                            </text>
                            <text x="380" y="190" textAnchor="middle" className="text-xs font-bold" fill="#DC2626">
                              {t('conduction.testing.heatBlocked')}
                            </text>
                          </>
                        )}
                      </>
                    )}

                    {materials.map((material) => {
                      const pos = materialPositions[material.id] || { x: 0, y: 0 };
                      const isDragging = draggedMaterial === material.id;
                      const isInTest = materialInTest === material.id;

                      return (
                        <g
                          key={material.id}
                          transform={`translate(${pos.x}, ${pos.y})`}
                          onMouseDown={(e) => handleMaterialMouseDown(e as any, material.id)}
                          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                          className={isDragging ? 'opacity-80' : ''}
                        >
                          <rect
                            x="-35"
                            y="-15"
                            width="70"
                            height="30"
                            rx="5"
                            fill={material.color}
                            stroke={isInTest ? '#10B981' : '#333'}
                            strokeWidth={isInTest ? 3 : 2}
                            opacity="0.9"
                          />
                          <text
                            x="0"
                            y="5"
                            textAnchor="middle"
                            className="text-xs font-bold"
                            fill="white"
                            style={{ pointerEvents: 'none' }}
                          >
                            {material.emoji} {material.name}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                  </div>
                </div>

                <div className="space-y-4">
                  {selectedMaterial && showMaterialResult && (
                    <div className="bg-white rounded-lg shadow-lg p-5 border-2 border-indigo-200">
                      <h3 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
                        <Info className="w-5 h-5" />
                        {t('conduction.testing.testResult.title')}
                      </h3>
                      {(() => {
                        const material = materials.find((m) => m.id === selectedMaterial);
                        if (!material) return null;
                        const isCondutor = material.type === 'conductor';

                        return (
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm text-gray-600 mb-1">{t('conduction.testing.testResult.material')}</p>
                              <p className="font-bold text-lg">
                                {material.emoji} {material.name}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 mb-1">{t('conduction.testing.testResult.type')}</p>
                              <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${isCondutor ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {isCondutor ? t('conduction.testing.testResult.good') : t('conduction.testing.testResult.poor')}
                              </span>
                            </div>
                            <div className={`p-3 rounded-lg ${isCondutor ? 'bg-green-50' : 'bg-red-50'}`}>
                              <p className="text-xs font-semibold mb-1">{isCondutor ? t('conduction.testing.testResult.heatPasses') : t('conduction.testing.testResult.heatStops')}</p>
                              <p className="text-xs text-gray-700">
                                {isCondutor ? t('conduction.testing.testResult.goodDesc') : t('conduction.testing.testResult.poorDesc')}
                              </p>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  <div className="bg-white rounded-lg shadow-lg p-5">
                    <h4 className="font-bold text-gray-800 mb-3">{t('conduction.testing.quickTest')}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {materials.map((material) => (
                        <button
                          key={material.id}
                          onClick={() => testMaterial(material.id)}
                          className={`p-2 rounded-lg text-xs font-semibold border-2 transition-all ${
                            selectedMaterial === material.id ? 'bg-indigo-100 border-indigo-400 text-indigo-900' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {material.emoji} {material.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {testedMaterials.length > 0 && (
                    <div className="bg-white rounded-lg shadow-lg p-5">
                      <h4 className="font-bold text-gray-800 mb-3">
                        {t('conduction.testing.tested', { count: testedMaterials.length, total: materials.length })}
                      </h4>
                      <div className="space-y-2">
                        {testedMaterials.map((materialId) => {
                          const material = materials.find((m) => m.id === materialId);
                          if (!material) return null;
                          return (
                            <div key={materialId} className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded">
                              <span>
                                {material.emoji} {material.name}
                              </span>
                              <span className={`font-bold ${material.type === 'conductor' ? 'text-green-600' : 'text-red-600'}`}>{material.type === 'conductor' ? '✓' : '✗'}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
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

  const applicationsData = useMemo(() => {
    const data = t('conduction.realWorld.applications', { returnObjects: true });
    if (!Array.isArray(data) || data.length === 0) {
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

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-teal-50 via-purple-50 to-teal-50">
      <div className="max-w-7xl mx-auto space-y-8">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApplications.map((app, index) => {
            const isExpanded = expandedApp === app.id;

            return (
              <div
                key={app.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
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

                <div className="p-5 border-t border-gray-100">
                  <p className="text-gray-600 text-sm mb-3">{app.description}</p>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    {t('conduction.realWorld.realLifeExample')}
                  </p>
                  <p className="text-gray-800 text-sm italic">{app.realExample}</p>
                </div>

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
    </div>
  );
};

// ============================================================================
// Topic Practice Mode Component (inline)
// ============================================================================
interface Question {
  id: number;
  type: 'mcq' | 'true-false' | 'fill-blank' | 'match' | 'ordering' | 'classify';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

const TopicPracticeMode: React.FC = () => {
  const { t, language } = useLanguage();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[]>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [matchPairs, setMatchPairs] = useState<Record<string, string>>({});
  const [orderedItems, setOrderedItems] = useState<string[]>([]);
  const [classifications, setClassifications] = useState<Record<string, string>>({});

  const questions: Question[] = useMemo(() => {
    const questionsData = t('conduction.practice.questions', { returnObjects: true });
    if (!Array.isArray(questionsData) || questionsData.length === 0) {
      const enData = i18n.t('conduction.practice.questions', { returnObjects: true, lng: 'en' });
      return (Array.isArray(enData) ? enData : []) as Question[];
    }
    return questionsData as Question[];
  }, [t, language]);

  React.useEffect(() => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setShowFeedback(false);
    setScore(0);
    setAnsweredQuestions([]);
    setMatchPairs({});
    setOrderedItems([]);
    setClassifications({});
  }, [language]);

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('conduction.practice.ui.noQuestionsTitle')}</h2>
          <p className="text-gray-600">{t('conduction.practice.ui.noQuestionsBody')}</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  const handleAnswerSelect = (answer: string) => {
    if (showFeedback) return;
    
    if (currentQuestion.type === 'match') {
      return;
    } else if (currentQuestion.type === 'ordering') {
      return;
    } else if (currentQuestion.type === 'classify') {
      return;
    } else {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmit = () => {
    if (!selectedAnswer && currentQuestion.type !== 'match' && currentQuestion.type !== 'ordering' && currentQuestion.type !== 'classify') return;

    let isCorrect = false;

    if (currentQuestion.type === 'match') {
      const correctPairs = currentQuestion.correctAnswer as string[];
      const userPairs = Object.entries(matchPairs).map(([k, v]) => `${k}|${v}`);
      isCorrect = correctPairs.length === userPairs.length && 
                  correctPairs.every(pair => userPairs.includes(pair));
    } else if (currentQuestion.type === 'ordering') {
      const correctOrder = currentQuestion.correctAnswer as string[];
      isCorrect = JSON.stringify(orderedItems) === JSON.stringify(correctOrder);
    } else if (currentQuestion.type === 'classify') {
      const correctClassifications = currentQuestion.correctAnswer as string[];
      const userClassifications = Object.entries(classifications).map(([k, v]) => `${k}|${v}`);
      isCorrect = correctClassifications.length === userClassifications.length &&
                  correctClassifications.every(pair => userClassifications.includes(pair));
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
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setShowFeedback(false);
      setMatchPairs({});
      setOrderedItems([]);
      setClassifications({});
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer('');
      setShowFeedback(false);
      setMatchPairs({});
      setOrderedItems([]);
      setClassifications({});
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setShowFeedback(false);
    setScore(0);
    setAnsweredQuestions([]);
    setMatchPairs({});
    setOrderedItems([]);
    setClassifications({});
  };

  const isCorrect = () => {
    if (currentQuestion.type === 'match') {
      const correctPairs = currentQuestion.correctAnswer as string[];
      const userPairs = Object.entries(matchPairs).map(([k, v]) => `${k}|${v}`);
      return correctPairs.length === userPairs.length && 
             correctPairs.every(pair => userPairs.includes(pair));
    } else if (currentQuestion.type === 'ordering') {
      const correctOrder = currentQuestion.correctAnswer as string[];
      return JSON.stringify(orderedItems) === JSON.stringify(correctOrder);
    } else if (currentQuestion.type === 'classify') {
      const correctClassifications = currentQuestion.correctAnswer as string[];
      const userClassifications = Object.entries(classifications).map(([k, v]) => `${k}|${v}`);
      return correctClassifications.length === userClassifications.length &&
             correctClassifications.every(pair => userClassifications.includes(pair));
    }
    return selectedAnswer === currentQuestion.correctAnswer;
  };

  const handleMatchPair = (item: string, category: string) => {
    setMatchPairs(prev => ({
      ...prev,
      [item]: category
    }));
  };

  const initializeOrdering = () => {
    if (currentQuestion.type === 'ordering' && orderedItems.length === 0) {
      setOrderedItems([...(currentQuestion.options || [])]);
    }
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...orderedItems];
    if (direction === 'up' && index > 0) {
      [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
    } else if (direction === 'down' && index < newOrder.length - 1) {
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    }
    setOrderedItems(newOrder);
  };

  const handleClassification = (item: string, category: string) => {
    setClassifications(prev => ({
      ...prev,
      [item]: category
    }));
  };

  React.useEffect(() => {
    if (currentQuestion.type === 'ordering') {
      initializeOrdering();
    }
  }, [currentQuestionIndex]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'hard': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case 'mcq':
      case 'true-false':
      case 'fill-blank':
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={showFeedback}
                className={`w-full p-4 rounded-xl text-left transition-all border-2 ${
                  selectedAnswer === option
                    ? showFeedback
                      ? isCorrect()
                        ? 'bg-green-50 border-green-500 text-green-900'
                        : 'bg-red-50 border-red-500 text-red-900'
                      : 'bg-indigo-50 border-indigo-500 text-indigo-900'
                    : 'bg-white border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option}</span>
                  {showFeedback && selectedAnswer === option && (
                    isCorrect() ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )
                  )}
                  {showFeedback && option === currentQuestion.correctAnswer && selectedAnswer !== option && (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  )}
                </div>
              </button>
            ))}
          </div>
        );

      case 'match':
        const matchItems = currentQuestion.options?.map(opt => opt.split('|')[0]) || [];
        const matchCategories = [...new Set(currentQuestion.options?.map(opt => opt.split('|')[1]) || [])];
        
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">{t('conduction.practice.ui.matchHint')}</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-bold text-gray-700 mb-3">{t('conduction.practice.ui.materials')}</h4>
                {matchItems.map((item) => (
                  <div key={item} className="bg-blue-50 p-3 rounded-lg border-2 border-blue-200">
                    <div className="font-medium text-gray-800 mb-2">{item}</div>
                    <select
                      value={matchPairs[item] || ''}
                      onChange={(e) => handleMatchPair(item, e.target.value)}
                      disabled={showFeedback}
                      className="w-full p-2 rounded border border-gray-300 text-sm"
                    >
                      <option value="">{t('conduction.practice.ui.selectCategory')}</option>
                      {matchCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-gray-700 mb-3">{t('conduction.practice.ui.categories')}</h4>
                {matchCategories.map((category) => {
                  const matchedItems = Object.entries(matchPairs)
                    .filter(([_, cat]) => cat === category)
                    .map(([item]) => item);
                  
                  return (
                    <div key={category} className="bg-green-50 p-3 rounded-lg border-2 border-green-200 min-h-[60px]">
                      <div className="font-bold text-green-800 mb-2">{category}</div>
                      {matchedItems.length > 0 ? (
                        <div className="space-y-1">
                          {matchedItems.map(item => (
                            <div key={item} className="text-sm bg-white px-2 py-1 rounded">
                              {item}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500 italic">{t('conduction.practice.ui.noItemsMatched')}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'ordering':
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">{t('conduction.practice.ui.orderingHint')}</p>
            <div className="space-y-2">
              {orderedItems.map((item, index) => (
                <div key={index} className="bg-white p-4 rounded-xl border-2 border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="bg-indigo-100 text-indigo-800 font-bold px-3 py-1 rounded-full text-sm">
                      {index + 1}
                    </span>
                    <span className="font-medium text-gray-800">{item}</span>
                  </div>
                  {!showFeedback && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => moveItem(index, 'up')}
                        disabled={index === 0}
                        className={`p-2 rounded-lg ${
                          index === 0 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                        }`}
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => moveItem(index, 'down')}
                        disabled={index === orderedItems.length - 1}
                        className={`p-2 rounded-lg ${
                          index === orderedItems.length - 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
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

      case 'classify':
        const classifyItems = currentQuestion.options || [];
        const categories = [t('conduction.practice.ui.goodConductor'), t('conduction.practice.ui.poorConductor')];
        
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">{t('conduction.practice.ui.classifyHint')}</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-bold text-gray-700 mb-3">{t('conduction.practice.ui.materials')}</h4>
                {classifyItems.map((item) => (
                  <div key={item} className="bg-purple-50 p-3 rounded-lg border-2 border-purple-200">
                    <div className="font-medium text-gray-800 mb-2">{item}</div>
                    <select
                      value={classifications[item] || ''}
                      onChange={(e) => handleClassification(item, e.target.value)}
                      disabled={showFeedback}
                      className="w-full p-2 rounded border border-gray-300 text-sm"
                    >
                      <option value="">{t('conduction.practice.ui.selectCategory')}</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-gray-700 mb-3">{t('conduction.practice.ui.categories')}</h4>
                {categories.map((category) => {
                  const classifiedItems = Object.entries(classifications)
                    .filter(([_, cat]) => cat === category)
                    .map(([item]) => item);
                  const isGoodConductor = category === t('conduction.practice.ui.goodConductor');
                  
                  return (
                    <div key={category} className={`p-4 rounded-lg border-2 min-h-[120px] ${
                      isGoodConductor
                        ? 'bg-green-50 border-green-300' 
                        : 'bg-red-50 border-red-300'
                    }`}>
                      <div className={`font-bold mb-2 ${
                        isGoodConductor ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {isGoodConductor ? t('conduction.practice.ui.goodConductorLabel') : t('conduction.practice.ui.poorConductorLabel')}
                      </div>
                      {classifiedItems.length > 0 ? (
                        <div className="space-y-1">
                          {classifiedItems.map(item => (
                            <div key={item} className="text-sm bg-white px-3 py-1 rounded">
                              {item}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500 italic">{t('conduction.practice.ui.noItemsClassified')}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canSubmit = () => {
    if (currentQuestion.type === 'match') {
      return Object.keys(matchPairs).length === (currentQuestion.options?.length || 0);
    } else if (currentQuestion.type === 'ordering') {
      return orderedItems.length > 0;
    } else if (currentQuestion.type === 'classify') {
      return Object.keys(classifications).length === (currentQuestion.options?.length || 0);
    }
    return selectedAnswer !== '';
  };

  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6"
         style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 mb-6">
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-indigo-100 text-indigo-800 font-bold px-4 py-2 rounded-full">
                    {t('conduction.practice.ui.questionLabel', { current: currentQuestionIndex + 1, total: questions.length })}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getDifficultyColor(currentQuestion.difficulty)}`}>
                    {t(`conduction.practice.ui.difficulty.${currentQuestion.difficulty}`)}
                  </span>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-bold">
                    {t('conduction.practice.ui.pointsLabel', { points: currentQuestion.points })}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {currentQuestion.question}
                </h2>
                {currentQuestion.type === 'fill-blank' && (
                  <p className="text-sm text-gray-500 italic">{t('conduction.practice.ui.fillBlankHint')}</p>
                )}
              </div>
            </div>

            {renderQuestion()}

            {showFeedback && (
              <div className={`mt-6 p-6 rounded-xl border-2 ${
                isCorrect() 
                  ? 'bg-green-50 border-green-400' 
                  : 'bg-red-50 border-red-400'
              }`}>
                <div className="flex items-start gap-3">
                  {isCorrect() ? (
                    <CheckCircle className="w-7 h-7 text-green-600 flex-shrink-0 mt-1" />
                  ) : (
                    <XCircle className="w-7 h-7 text-red-600 flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-1">
                    <p className="font-bold text-lg mb-2">
                      {isCorrect() ? t('conduction.practice.ui.correctTitle') : t('conduction.practice.ui.incorrectTitle')}
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      {currentQuestion.explanation}
                    </p>
                    {!isCorrect() && (
                      <div className="mt-3 p-3 bg-white rounded-lg">
                        <p className="text-sm font-semibold text-gray-700 mb-1">
                          <Lightbulb className="w-4 h-4 inline mr-1" />
                          {t('conduction.practice.ui.correctAnswerLabel')}
                        </p>
                        <p className="text-sm text-green-700 font-semibold">
                          {Array.isArray(currentQuestion.correctAnswer) 
                            ? currentQuestion.correctAnswer.join(', ')
                            : currentQuestion.correctAnswer}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 ${
                  currentQuestionIndex === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {t('conduction.practice.ui.previousButton')}
              </button>

              <div className="flex gap-3">
                {!showFeedback ? (
                  <button
                    onClick={handleSubmit}
                    disabled={!canSubmit()}
                    className={`px-8 py-3 rounded-xl font-semibold flex items-center gap-2 ${
                      canSubmit()
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <CheckCircle className="w-5 h-5" />
                    {t('conduction.practice.ui.submitButton')}
                  </button>
                ) : (
                  <>
                    {!isLastQuestion ? (
                      <button
                        onClick={handleNext}
                        className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 flex items-center gap-2"
                      >
                        {t('conduction.practice.ui.nextButton')}
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    ) : (
                      <button
                        onClick={handleRestart}
                        className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 flex items-center gap-2"
                      >
                        <RotateCcw className="w-5 h-5" />
                        {t('conduction.practice.ui.tryAgainButton')}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {isLastQuestion && showFeedback && (
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl shadow-xl p-8 border-2 border-yellow-300">
            <div className="text-center">
              <Award className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{t('conduction.practice.ui.completeTitle')}</h2>
              <p className="text-xl text-gray-700 mb-6">
                {t('conduction.practice.ui.scoreSummary', { score, total: totalPoints })}
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl">
                  <div className="text-3xl font-bold text-green-600">{answeredQuestions.length}</div>
                  <div className="text-sm text-gray-600">{t('conduction.practice.ui.questionsAnswered')}</div>
                </div>
                <div className="bg-white p-4 rounded-xl">
                  <div className="text-3xl font-bold text-blue-600">{Math.round((score / totalPoints) * 100)}%</div>
                  <div className="text-sm text-gray-600">{t('conduction.practice.ui.scorePercentage')}</div>
                </div>
                <div className="bg-white p-4 rounded-xl">
                  <div className="text-3xl font-bold text-purple-600">
                    {score >= totalPoints * 0.8 ? 'A' : score >= totalPoints * 0.6 ? 'B' : 'C'}
                  </div>
                  <div className="text-sm text-gray-600">{t('conduction.practice.ui.gradeLabel')}</div>
                </div>
              </div>

              <button
                onClick={handleRestart}
                className="px-10 py-4 rounded-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 flex items-center gap-2 mx-auto text-lg"
              >
                <RotateCcw className="w-6 h-6" />
                {t('conduction.practice.ui.startOverButton')}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// ============================================================================
// Main ConductionLearning Component (Router)
// ============================================================================
interface ConductionLearningProps {
  mode: 'learn' | 'practice' | 'applications';
  setMode: (mode: 'learn' | 'practice' | 'applications') => void;
}

const ConductionLearning: React.FC<ConductionLearningProps> = ({ mode, setMode }) => {
  return (
    <>
      <Navbar mode={mode} setMode={setMode} />
      <div className="pt-16 px-3 sm:px-4 md:px-6">
        {mode === 'practice' && <TopicPracticeMode />}
        {mode === 'applications' && <RealWorldApplications />}
        {mode === 'learn' && <ConductionLearnModeInteractive />}
      </div>
    </>
  );
};

export default ConductionLearning;
