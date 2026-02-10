import React, { useState, useEffect, useMemo, Component, ErrorInfo, ReactNode, createContext, useContext, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Brain, ClipboardCheck, Globe } from 'lucide-react';

// ============================================================================
// ErrorBoundary Component
// ============================================================================

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
              <p className="text-gray-600 mb-4">
                We're sorry, but something unexpected happened. Please try refreshing the page.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ============================================================================
// Type Definitions and Interfaces
// ============================================================================

// Types from src/types/index.ts
export interface Student {
  id: number
  name: string
  progress: number
  completed: number
  accuracy: number
  status: 'on-track' | 'needs-help'
}

export interface Problem {
  id: number
  equation: string
  solution: string
  explanation: string
  difficulty?: 'Easy' | 'Medium' | 'Hard'
}

export interface Question {
  id: number
  question: string
  options: string[]
  correct: string
  explanation: string
}

export interface Game {
  id: number
  name: string
  description: string
  icon: any
  color: string
}

export interface ProgressData {
  topic: string
  completed: number
  total: number
}

export interface AssessmentResult {
  score: number
  total: number
  grade: string
  timeSpent: number
  answers: { [key: number]: string }
}

// Interfaces from src/interfaces/simpleEquationsTypes.ts
// Step definition for demonstrations
export interface DemonstrationStep {
  step_number: number;
  title: string;
  description: string;
  type: 'explanation' | 'visualization' | 'interaction' | 'assessment';
  
  // Visual state for this step
  visual_state: {
    equation?: string;
    variables?: { [key: string]: any };
    operations?: string[];
    result?: any;
  };
  
  // Interactive elements
  interactions?: {
    type: 'click' | 'drag' | 'input' | 'select';
    target: string;
    expectedValue?: any;
    hint?: string;
  }[];
  
  // Success criteria
  completion_criteria?: {
    type: 'automatic' | 'user_confirm' | 'assessment';
    condition?: any;
  };
  
  // Educational content
  learning_notes?: string;
  common_mistakes?: string[];
}

// Practice exercise definition
export interface PracticeExercise {
  exercise_id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  
  // Problem setup
  problem_data: {
    equation: string;
    type: 'addition' | 'subtraction' | 'multiplication' | 'division' | 'mixed';
    context?: string; // Word problem context
  };
  
  // Solution tracking
  solution: {
    correct_answer: any;
    solution_steps?: any[];
    multiple_solutions?: boolean;
  };
  
  // Interaction configuration
  interaction_config: {
    input_methods: string[];
    max_attempts?: number;
    hint_system?: boolean;
    progressive_hints?: string[];
  };
  
  // Assessment criteria
  assessment: {
    accuracy_weight: number;
    time_weight?: number;
    attempt_weight?: number;
    style_points?: number;
  };
}

// Tool data from backend
export interface SimpleEquationsData {
  // Tool identification
  tool_type: string;
  session_id: string;
  
  // Mode configuration
  mode: 'demonstration' | 'practice' | 'assessment' | 'mixed';
  
  // Demonstration data
  demonstration?: {
    steps: DemonstrationStep[];
    auto_progression: boolean;
    step_duration: number;
  };
  
  // Practice data
  practice?: {
    exercises: PracticeExercise[];
    session_config: {
      max_exercises: number;
      difficulty_adaptation: boolean;
      immediate_feedback: boolean;
    };
  };
  
  // Student context
  student_context: {
    current_level: string;
    learning_preferences: string[];
    previous_performance?: {
      accuracy: number;
      avg_time: number;
      completed_exercises: number;
    };
  };
  
  // Metadata
  metadata: {
    learning_objectives: string[];
    estimated_duration: number;
    prerequisite_skills: string[];
    difficulty_level: string;
  };
}

// UI Configuration
export interface SimpleEquationsUIConfig {
  // Display options
  theme: 'light' | 'dark' | 'modern' | 'playful';
  layout: 'standard' | 'compact' | 'immersive';
  
  // Interaction options
  auto_play: boolean;
  step_duration: number;
  show_controls: boolean;
  show_progress: boolean;
  
  // Educational features
  hint_system: boolean;
  progressive_difficulty: boolean;
  immediate_feedback: boolean;
  celebration_animations: boolean;
  
  // Accessibility
  high_contrast: boolean;
  large_text: boolean;
  keyboard_navigation: boolean;
  screen_reader_support: boolean;
  
  // Multilingual support
  language: 'en' | 'hi' | 'gu';
}

// Component props interface
export interface SimpleEquationsProps {
  data: SimpleEquationsData;
  title: string;
  ui_config: SimpleEquationsUIConfig;
  
  // Event handlers
  onStepChange?: (stepIndex: number, stepData: DemonstrationStep) => void;
  onPracticeComplete?: (results: PracticeResults) => void;
  onAssessmentSubmit?: (assessment: AssessmentData) => void;
  onProgress?: (progress: ProgressData) => void;
  
  // Control handlers
  onInterrupt?: () => void;
  onResume?: () => void;
  onReset?: () => void;
  
  // State
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

// Progress tracking (from interfaces - note: different from types/ProgressData)
export interface ProgressDataDetailed {
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

// Language content interface
export interface LanguageContent {
  en: {
    [key: string]: string;
  };
  hi: {
    [key: string]: string;
  };
  gu: {
    [key: string]: string;
  };
}

// Real World Application interface
export interface RealWorldApplication {
  id: string;
  title: string;
  description: string;
  equation: string;
  context: string;
  visual_representation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'shopping' | 'cooking' | 'construction' | 'sports' | 'finance' | 'science';
}

// Type definitions for SimpleEquationsTool Component
interface EquationType {
  id: string;
  name: string;
  equation: string;
  solution: string;
  rule: string;
  description: string;
  icon: string;
  color: string;
  steps: string[];
  translations?: {
    [key: string]: {
      name: string;
      rule: string;
      description: string;
      steps: string[];
    };
  };
}

interface Exercise {
  id: string;
  promptKey: string;
  prompt: string;
  answer: string;
  attempted: boolean;
  correct?: boolean;
  skipped: boolean;
}

interface QuestionAttempt {
  questionId: string;
  answer: string;
  isCorrect: boolean;
  attempts: number;
  timeSpent: number;
  skipped: boolean;
}

// ============================================================================
// Data
// ============================================================================

// Practice problems from src/data/problems.ts
export const practiceProblems: Problem[] = [
  {
    id: 1,
    equation: 'x - 7 = 8',
    solution: '15',
    explanation: 'Add 7 to both sides: x - 7 + 7 = 8 + 7, so x = 15'
  },
  {
    id: 2,
    equation: 'y - 4 = 8',
    solution: '12',
    explanation: 'Add 4 to both sides: y - 4 + 4 = 8 + 4, so y = 12'
  },
  {
    id: 3,
    equation: 'z - 3 = 18',
    solution: '21',
    explanation: 'Add 3 to both sides: z - 3 + 3 = 18 + 3, so z = 21'
  },
  {
    id: 4,
    equation: 'w - 2 = 6',
    solution: '8',
    explanation: 'Add 2 to both sides: w - 2 + 2 = 6 + 2, so w = 8'
  },
  {
    id: 5,
    equation: 'a - 3 = 8',
    solution: '11',
    explanation: 'Add 3 to both sides: a - 3 + 3 = 8 + 3, so a = 11'
  },
  {
    id: 6,
    equation: 'b - 5 = 4',
    solution: '9',
    explanation: 'Add 5 to both sides: b - 5 + 5 = 4 + 5, so b = 9'
  },
  {
    id: 7,
    equation: 'c - 6 = 12',
    solution: '18',
    explanation: 'Add 6 to both sides: c - 6 + 6 = 12 + 6, so c = 18'
  },
  {
    id: 8,
    equation: 'd - 2 = 5',
    solution: '7',
    explanation: 'Add 2 to both sides: d - 2 + 2 = 5 + 2, so d = 7'
  },
  {
    id: 9,
    equation: 'e - 8 = 25',
    solution: '33',
    explanation: 'Add 8 to both sides: e - 8 + 8 = 25 + 8, so e = 33'
  },
  {
    id: 10,
    equation: 'f - 7 = 6',
    solution: '13',
    explanation: 'Add 7 to both sides: f - 7 + 7 = 6 + 7, so f = 13'
  },
  {
    id: 11,
    equation: 'x - 3 = 5',
    solution: '8',
    explanation: 'Add 3 to both sides: x - 3 + 3 = 5 + 3, so x = 8'
  },
  {
    id: 12,
    equation: 'y - 12 = 18',
    solution: '30',
    explanation: 'Add 12 to both sides: y - 12 + 12 = 18 + 12, so y = 30'
  },
  {
    id: 13,
    equation: 'z - 9 = 11',
    solution: '20',
    explanation: 'Add 9 to both sides: z - 9 + 9 = 11 + 9, so z = 20'
  },
  {
    id: 14,
    equation: 'w - 15 = 10',
    solution: '25',
    explanation: 'Add 15 to both sides: w - 15 + 15 = 10 + 15, so w = 25'
  },
  {
    id: 15,
    equation: 'a - 20 = 5',
    solution: '25',
    explanation: 'Add 20 to both sides: a - 20 + 20 = 5 + 20, so a = 25'
  }
]

export const assessmentQuestions: Question[] = [
  {
    id: 1,
    question: 'What is the value of x in the equation x - 5 = 7?',
    options: ['10', '11', '12', '13'],
    correct: '12',
    explanation: 'Add 5 to both sides: x - 5 + 5 = 7 + 5, so x = 12'
  },
  {
    id: 2,
    question: 'Solve for y: y - 3 = 8',
    options: ['5', '10', '11', '12'],
    correct: '11',
    explanation: 'Add 3 to both sides: y - 3 + 3 = 8 + 3, so y = 11'
  },
  {
    id: 3,
    question: 'What is the solution to x - 7 = 8?',
    options: ['14', '15', '16', '17'],
    correct: '15',
    explanation: 'Add 7 to both sides: x - 7 + 7 = 8 + 7, so x = 15'
  },
  {
    id: 4,
    question: 'Find the value of w in w - 4 = 8',
    options: ['10', '11', '12', '13'],
    correct: '12',
    explanation: 'Add 4 to both sides: w - 4 + 4 = 8 + 4, so w = 12'
  },
  {
    id: 5,
    question: 'Solve: x - 2 = 6',
    options: ['6', '7', '8', '9'],
    correct: '8',
    explanation: 'Add 2 to both sides: x - 2 + 2 = 6 + 2, so x = 8'
  },
  {
    id: 6,
    question: 'What is the value of x in the equation x - 3 = 5?',
    options: ['6', '7', '8', '9'],
    correct: '8',
    explanation: 'Add 3 to both sides: x - 3 + 3 = 5 + 3, so x = 8'
  },
  {
    id: 7,
    question: 'Solve for y: y - 6 = 12',
    options: ['16', '17', '18', '19'],
    correct: '18',
    explanation: 'Add 6 to both sides: y - 6 + 6 = 12 + 6, so y = 18'
  },
  {
    id: 8,
    question: 'Find the value of z in z - 8 = 7',
    options: ['13', '14', '15', '16'],
    correct: '15',
    explanation: 'Add 8 to both sides: z - 8 + 8 = 7 + 8, so z = 15'
  },
  {
    id: 9,
    question: 'Solve: w - 9 = 11',
    options: ['18', '19', '20', '21'],
    correct: '20',
    explanation: 'Add 9 to both sides: w - 9 + 9 = 11 + 9, so w = 20'
  },
  {
    id: 10,
    question: 'What is the solution to a - 12 = 18?',
    options: ['28', '29', '30', '31'],
    correct: '30',
    explanation: 'Add 12 to both sides: a - 12 + 12 = 18 + 12, so a = 30'
  },
  {
    id: 11,
    question: 'Solve for b: b - 15 = 10',
    options: ['23', '24', '25', '26'],
    correct: '25',
    explanation: 'Add 15 to both sides: b - 15 + 15 = 10 + 15, so b = 25'
  },
  {
    id: 12,
    question: 'Find the value of x in x - 20 = 5',
    options: ['23', '24', '25', '26'],
    correct: '25',
    explanation: 'Add 20 to both sides: x - 20 + 20 = 5 + 20, so x = 25'
  },
  {
    id: 13,
    question: 'Solve: y - 25 = 15',
    options: ['38', '39', '40', '41'],
    correct: '40',
    explanation: 'Add 25 to both sides: y - 25 + 25 = 15 + 25, so y = 40'
  },
  {
    id: 14,
    question: 'What is the value of z in z - 30 = 20?',
    options: ['48', '49', '50', '51'],
    correct: '50',
    explanation: 'Add 30 to both sides: z - 30 + 30 = 20 + 30, so z = 50'
  },
  {
    id: 15,
    question: 'Solve: w - 40 = 10',
    options: ['48', '49', '50', '51'],
    correct: '50',
    explanation: 'Add 40 to both sides: w - 40 + 40 = 10 + 40, so w = 50'
  }
]

// ============================================================================
// Utility Functions
// ============================================================================

// Utils from src/utils/index.ts
export const generateRandomEquation = (type: 'addition' | 'subtraction' | 'multiplication' | 'division') => {
  const operations = {
    addition: () => {
      const a = Math.floor(Math.random() * 10) + 1
      const b = Math.floor(Math.random() * 10) + 1
      return { equation: `x + ${a} = ${a + b}`, solution: b.toString() }
    },
    subtraction: () => {
      const a = Math.floor(Math.random() * 10) + 1
      const b = Math.floor(Math.random() * 10) + 1
      return { equation: `x - ${a} = ${b}`, solution: (a + b).toString() }
    },
    multiplication: () => {
      const a = Math.floor(Math.random() * 5) + 2
      const b = Math.floor(Math.random() * 10) + 1
      return { equation: `${a}x = ${a * b}`, solution: b.toString() }
    },
    division: () => {
      const a = Math.floor(Math.random() * 5) + 2
      const b = Math.floor(Math.random() * 10) + 1
      return { equation: `x ÷ ${a} = ${b}`, solution: (a * b).toString() }
    }
  }
  
  return operations[type]()
}

export const calculateGrade = (score: number, total: number) => {
  const percentage = (score / total) * 100
  if (percentage >= 90) return { grade: 'A+', color: 'text-green-400' }
  if (percentage >= 80) return { grade: 'A', color: 'text-green-400' }
  if (percentage >= 70) return { grade: 'B+', color: 'text-blue-400' }
  if (percentage >= 60) return { grade: 'B', color: 'text-blue-400' }
  if (percentage >= 50) return { grade: 'C', color: 'text-yellow-400' }
  return { grade: 'D', color: 'text-red-400' }
}

export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export const validateAnswer = (userAnswer: string, correctAnswer: string) => {
  return userAnswer.trim() === correctAnswer.trim()
}

export const getProgressColor = (progress: number) => {
  if (progress >= 90) return 'text-green-400'
  if (progress >= 80) return 'text-blue-400'
  if (progress >= 70) return 'text-yellow-400'
  return 'text-red-400'
}

// ============================================================================
// Context Providers
// ============================================================================

// VisualizationStateContext from src/contexts/VisualizationStateContext.tsx
interface ToolState {
  toolId: string;
  toolType: string;
  isActive: boolean;
  isInterrupted: boolean;
  currentStep: number;
  totalSteps: number;
  progress: number;
  data: any;
  timestamp: string;
  canResume: boolean;
  mode: string;
  practiceResults?: any[];
}

interface VisualizationStateContextType {
  toolStates: { [toolId: string]: ToolState };
  setToolState: (toolId: string, state: ToolState) => void;
  getToolState: (toolId: string) => ToolState | undefined;
  clearToolState: (toolId: string) => void;
  getAllActiveTools: () => ToolState[];
}

const VisualizationStateContext = createContext<VisualizationStateContextType | undefined>(undefined);

export const useVisualizationState = () => {
  const context = useContext(VisualizationStateContext);
  if (!context) {
    throw new Error('useVisualizationState must be used within a VisualizationStateProvider');
  }
  return context;
};

interface VisualizationStateProviderProps {
  children: ReactNode;
}

export const VisualizationStateProvider: React.FC<VisualizationStateProviderProps> = ({ children }) => {
  const [toolStates, setToolStates] = useState<{ [toolId: string]: ToolState }>({});

  const setToolState = useCallback((toolId: string, state: ToolState) => {
    setToolStates(prev => ({
      ...prev,
      [toolId]: state
    }));
  }, []);

  const getToolState = useCallback((toolId: string) => {
    return toolStates[toolId];
  }, [toolStates]);

  const clearToolState = useCallback((toolId: string) => {
    setToolStates(prev => {
      const newStates = { ...prev };
      delete newStates[toolId];
      return newStates;
    });
  }, []);

  const getAllActiveTools = useCallback(() => {
    return Object.values(toolStates).filter(tool => tool.isActive);
  }, [toolStates]);

  const value: VisualizationStateContextType = {
    toolStates,
    setToolState,
    getToolState,
    clearToolState,
    getAllActiveTools
  };

  return (
    <VisualizationStateContext.Provider value={value}>
      {children}
    </VisualizationStateContext.Provider>
  );
};

// InterruptContext from src/contexts/InterruptContext.tsx
interface InterruptContextType {
  isInterrupted: boolean;
  interruptedToolId: string | null;
  interruptTool: (toolId: string) => void;
  resumeTool: (toolId: string) => void;
  pauseAllTools: () => void;
  resumeAllTools: () => void;
}

const InterruptContext = createContext<InterruptContextType | undefined>(undefined);

export const useInterrupt = () => {
  const context = useContext(InterruptContext);
  if (!context) {
    throw new Error('useInterrupt must be used within an InterruptProvider');
  }
  return context;
};

interface InterruptProviderProps {
  children: ReactNode;
}

export const InterruptProvider: React.FC<InterruptProviderProps> = ({ children }) => {
  const [isInterrupted, setIsInterrupted] = useState(false);
  const [interruptedToolId, setInterruptedToolId] = useState<string | null>(null);

  const interruptTool = useCallback((toolId: string) => {
    setIsInterrupted(true);
    setInterruptedToolId(toolId);
  }, []);

  const resumeTool = useCallback((toolId: string) => {
    if (interruptedToolId === toolId) {
      setIsInterrupted(false);
      setInterruptedToolId(null);
    }
  }, [interruptedToolId]);

  const pauseAllTools = useCallback(() => {
    setIsInterrupted(true);
  }, []);

  const resumeAllTools = useCallback(() => {
    setIsInterrupted(false);
    setInterruptedToolId(null);
  }, []);

  const value: InterruptContextType = {
    isInterrupted,
    interruptedToolId,
    interruptTool,
    resumeTool,
    pauseAllTools,
    resumeAllTools
  };

  return (
    <InterruptContext.Provider value={value}>
      {children}
    </InterruptContext.Provider>
  );
};

// LanguageContext from src/contexts/LanguageContext.tsx
interface LanguageContextType {
  language: 'en' | 'hi' | 'gu';
  setLanguage: (lang: 'en' | 'hi' | 'gu') => void;
  t: (key: string) => string;
  isTransitioning: boolean;
  localizeDigitsInText: (text: string) => string;
  formatNumber: (num: number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

// Comprehensive translations
const translations = {
  en: {
    // Navigation
    home: 'Home',
    introduction: 'Introduction',
    learn: 'Learn',
    realWorld: 'Real World',
    simpleEquations: 'Simple Equations - Subtraction',
    simpleEquationsTitle: 'Simple Equations - Subtraction',
    
    // Home Page
    masterSimpleEquations: 'Master Simple Equations',
    masterClass7Mathematics: 'Master Class 7 Mathematics with interactive learning, practice exercises, and engaging games based on NCERT curriculum',
    startLearning: 'Start Learning',
    whatYoullLearn: 'What You\'ll Learn',
    comprehensiveTools: 'Comprehensive tools designed to make learning simple equations engaging and effective',
    introductionDesc: 'Learn the basics of simple equations with interactive examples',
    learnDesc: 'Step-by-step explanations with visual aids',
    practiceDesc: 'Solve exercises and check your solutions',
    realWorldDesc: 'See how equations apply in everyday life',
    practiceProblems: 'Practice Problems',
    interactiveExamples: 'Interactive Examples',
    readyToMaster: 'Ready to Master Simple Equations?',
    joinThousands: 'Join thousands of students and teachers who are making mathematics engaging and accessible.',
    startYourJourney: 'Start Your Journey',
    
    // Common
    correct: 'Correct!',
    incorrect: 'Try again!',
    learning: 'Learning',
    practice: 'Practice',
    assessment: 'Assessment',
    selectEquation: 'Select Equation:',
    yourAnswer: 'Your Answer:',
    submit: 'Submit',
    hint: 'Hint',
    progress: 'Progress:',
    accuracy: 'Accuracy',
    avgTime: 'Avg Time',
    correctAnswers: 'Correct',
    incorrectAnswers: 'Incorrect',
    totalExercises: 'Total',
    excellent: 'Excellent!',
    goodJob: 'Good Job!',
    keepTrying: 'Keep Trying!',
    showSolution: 'Show Solution',
    hideSolution: 'Hide Solution',
    reset: 'Reset',
    stepByStepSolution: 'Step-by-Step Solution:',
    nextStep: 'Next Step',
    complete: 'Complete',
    
    // Real World
    realWorldApps: 'Real World Applications',
    selectCategory: 'Select Category:',
    difficulty: 'Difficulty:',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    equation: 'Equation:',
    solution: 'Solution:',
    context: 'Context:',
    shopping: 'Shopping',
    cooking: 'Cooking',
    construction: 'Construction',
    sports: 'Sports',
    finance: 'Finance',
    science: 'Science',
    
    // Learn Section
    linearEquations: 'Linear Equations',
    linearEquationsDesc: 'Linear equations are equations where the highest power of the variable is 1. They can be solved using basic algebraic operations like addition, subtraction, multiplication, and division.',
    solvingByAddition: 'Solving by Addition',
    solvingByAdditionDesc: 'When we have subtraction in an equation, we add the same number to both sides to isolate the variable. This maintains the balance of the equation.',
    solvingBySubtraction: 'Solving by Subtraction',
    solvingBySubtractionDesc: 'When we have addition in an equation, we subtract the same number from both sides to isolate the variable. This maintains the balance of the equation.',
    solvingByMultiplication: 'Solving by Multiplication',
    solvingByMultiplicationDesc: 'When we have division in an equation, we multiply both sides by the same number to isolate the variable. This maintains the balance of the equation.',
    solvingByDivision: 'Solving by Division',
    solvingByDivisionDesc: 'When we have multiplication in an equation, we divide both sides by the same number to isolate the variable. This maintains the balance of the equation.',
    originalEquation: 'Original equation',
    originalEquationWithSubtraction: 'Original equation with subtraction',
    originalEquationWithAddition: 'Original equation with addition',
    originalEquationWithDivision: 'Original equation with division',
    originalEquationWithMultiplication: 'Original equation with multiplication',
    subtractFromBothSides: 'Subtract 5 from both sides',
    addToBothSides: 'Add 3 to both sides to isolate x',
    subtractFromBothSidesToIsolate: 'Subtract 4 from both sides to isolate x',
    multiplyBothSides: 'Multiply both sides by 3 to isolate x',
    divideBothSides: 'Divide both sides by 3 to isolate x',
    simplifyToFindAnswer: 'Simplify to find the answer',
    simplifyStep: 'Simplify: 5 - 5 = 0 and 12 - 5 = 7',
    verifySolution: 'Verify the solution by substituting x = 7',
    simplifyAdditionStep: 'Simplify: -3 + 3 = 0 and 8 + 3 = 11',
    verifyAdditionSolution: 'Verify the solution by substituting x = 11',
    simplifySubtractionStep: 'Simplify: 4 - 4 = 0 and 7 - 4 = 3',
    verifySubtractionSolution: 'Verify the solution by substituting x = 3',
    simplifyMultiplicationStep: 'Simplify: 3/3 = 1 and 4 × 3 = 12',
    verifyMultiplicationSolution: 'Verify the solution by substituting x = 12',
    simplifyDivisionStep: 'Simplify: 3x ÷ 3 = x and 15 ÷ 3 = 5',
    verifyDivisionSolution: 'Verify the solution by substituting x = 5',
    linearEquationExample: 'Linear Equation Example',
    additionMethodExample: 'Addition Method Example',
    subtractionMethodExample: 'Subtraction Method Example',
    multiplicationMethodExample: 'Multiplication Method Example',
    divisionMethodExample: 'Division Method Example',
    solving: 'Solving:',
    play: 'Play',
    pause: 'Pause',
    previous: 'Previous',
    next: 'Next',
    
    // Practice Mode
    practiceMode: 'Practice Mode',
    question: 'Question',
    skippedQuestions: 'Skipped Questions',
    notAttempted: 'Not Attempted',
    totalQuestions: 'Total Questions',
    finalGrade: 'Final Grade',
    accuracyRate: 'Accuracy Rate',
    avgTimePerQuestion: 'Avg Time/Question',
    questionByQuestionReview: 'Question by Question Review',
    startNewSession: 'Start New Session',
    loadingQuestions: 'Loading questions...',
    showAnswer: 'Show Answer',
    hideAnswer: 'Hide Answer',
    tryAgain: 'Try Again',
    skip: 'Skip',
    skipped: 'Skipped',
    sessionComplete: 'Session Complete!',
    sessionSummary: 'Here\'s your complete session summary',
    correctAnswer: 'Correct Answer',
    check: 'Check',
    notAttempt: 'Not Attempt',
    
    // Practice Questions
    practice_q1: 'Solve: x - 7 = 8',
    practice_q2: 'Solve: x - 4 = 8',
    practice_q3: 'Solve: x - 3 = 18',
    practice_q4: 'Solve: x - 2 = 6',
    practice_q5: 'Solve: x - 3 = 8',
    practice_q6: 'Solve: x - 5 = 4',
    practice_q7: 'Solve: x - 6 = 12',
    practice_q8: 'Solve: x - 2 = 5',
    practice_q9: 'Solve: x - 8 = 25',
    practice_q10: 'Solve: x - 7 = 6',
    practice_q11: 'Solve: x - 3 = 5',
    practice_q12: 'Solve: x - 12 = 18'
  },
  hi: {
    // Navigation
    home: 'होम',
    introduction: 'परिचय',
    learn: 'सीखें',
    realWorld: 'वास्तविक दुनिया',
    simpleEquations: 'सरल समीकरण - घटाव',
    simpleEquationsTitle: 'सरल समीकरण - घटाव',
    
    // Home Page
    masterSimpleEquations: 'सरल समीकरणों में महारत हासिल करें',
    masterClass7Mathematics: 'एनसीईआरटी पाठ्यक्रम के आधार पर इंटरैक्टिव सीखने, अभ्यास अभ्यास और आकर्षक गेम के साथ कक्षा 7 गणित में महारत हासिल करें',
    startLearning: 'सीखना शुरू करें',
    whatYoullLearn: 'आप क्या सीखेंगे',
    comprehensiveTools: 'सरल समीकरणों को सीखने को आकर्षक और प्रभावी बनाने के लिए डिज़ाइन किए गए व्यापक उपकरण',
    introductionDesc: 'इंटरैक्टिव उदाहरणों के साथ सरल समीकरणों की मूल बातें सीखें',
    learnDesc: 'दृश्य सहायता के साथ चरण-दर-चरण स्पष्टीकरण',
    practiceDesc: 'अभ्यास हल करें और अपने समाधान जांचें',
    realWorldDesc: 'देखें कि समीकरण रोजमर्रा की जिंदगी में कैसे लागू होते हैं',
    practiceProblems: 'अभ्यास समस्याएं',
    interactiveExamples: 'इंटरैक्टिव उदाहरण',
    readyToMaster: 'सरल समीकरणों में महारत हासिल करने के लिए तैयार हैं?',
    joinThousands: 'हजारों छात्रों और शिक्षकों में शामिल हों जो गणित को आकर्षक और सुलभ बना रहे हैं।',
    startYourJourney: 'अपनी यात्रा शुरू करें',
    
    // Common
    correct: 'सही!',
    incorrect: 'फिर कोशिश करें!',
    learning: 'सीखना',
    practice: 'अभ्यास',
    assessment: 'मूल्यांकन',
    selectEquation: 'समीकरण चुनें:',
    yourAnswer: 'आपका उत्तर:',
    submit: 'जमा करें',
    hint: 'संकेत',
    progress: 'प्रगति:',
    accuracy: 'सटीकता',
    avgTime: 'औसत समय',
    correctAnswers: 'सही',
    incorrectAnswers: 'गलत',
    totalExercises: 'कुल',
    excellent: 'उत्कृष्ट!',
    goodJob: 'अच्छा काम!',
    keepTrying: 'कोशिश करते रहें!',
    showSolution: 'समाधान दिखाएं',
    hideSolution: 'समाधान छुपाएं',
    reset: 'रीसेट',
    stepByStepSolution: 'चरण-दर-चरण समाधान:',
    nextStep: 'अगला चरण',
    complete: 'पूर्ण',
    
    // Real World
    realWorldApps: 'वास्तविक दुनिया के अनुप्रयोग',
    selectCategory: 'श्रेणी चुनें:',
    difficulty: 'कठिनाई:',
    beginner: 'शुरुआती',
    intermediate: 'मध्यम',
    advanced: 'उन्नत',
    equation: 'समीकरण:',
    solution: 'समाधान:',
    context: 'संदर्भ:',
    shopping: 'खरीदारी',
    cooking: 'खाना पकाना',
    construction: 'निर्माण',
    sports: 'खेल',
    finance: 'वित्त',
    science: 'विज्ञान',
    
    // Learn Section
    linearEquations: 'रैखिक समीकरण',
    linearEquationsDesc: 'रैखिक समीकरण वे समीकरण हैं जहाँ चर की सबसे बड़ी घात 1 है। इन्हें जोड़, घटाव, गुणा और भाग जैसी बुनियादी बीजगणितीय संक्रियाओं का उपयोग करके हल किया जा सकता है।',
    solvingByAddition: 'जोड़ द्वारा हल करना',
    solvingByAdditionDesc: 'जब हमारे पास समीकरण में घटाव होता है, तो हम चर को अलग करने के लिए दोनों पक्षों में समान संख्या जोड़ते हैं। यह समीकरण के संतुलन को बनाए रखता है।',
    solvingBySubtraction: 'घटाव द्वारा हल करना',
    solvingBySubtractionDesc: 'जब हमारे पास समीकरण में जोड़ होता है, तो हम चर को अलग करने के लिए दोनों पक्षों से समान संख्या घटाते हैं। यह समीकरण के संतुलन को बनाए रखता है।',
    solvingByMultiplication: 'गुणा द्वारा हल करना',
    solvingByMultiplicationDesc: 'जब हमारे पास समीकरण में भाग होता है, तो हम चर को अलग करने के लिए दोनों पक्षों को समान संख्या से गुणा करते हैं। यह समीकरण के संतुलन को बनाए रखता है।',
    solvingByDivision: 'भाग द्वारा हल करना',
    solvingByDivisionDesc: 'जब हमारे पास समीकरण में गुणा होता है, तो हम चर को अलग करने के लिए दोनों पक्षों को समान संख्या से भाग देते हैं। यह समीकरण के संतुलन को बनाए रखता है।',
    originalEquation: 'मूल समीकरण',
    originalEquationWithSubtraction: 'घटाव के साथ मूल समीकरण',
    originalEquationWithAddition: 'जोड़ के साथ मूल समीकरण',
    originalEquationWithDivision: 'भाग के साथ मूल समीकरण',
    originalEquationWithMultiplication: 'गुणा के साथ मूल समीकरण',
    subtractFromBothSides: 'दोनों पक्षों से 5 घटाएं',
    addToBothSides: 'x को अलग करने के लिए दोनों पक्षों में 3 जोड़ें',
    subtractFromBothSidesToIsolate: 'x को अलग करने के लिए दोनों पक्षों से 4 घटाएं',
    multiplyBothSides: 'x को अलग करने के लिए दोनों पक्षों को 3 से गुणा करें',
    divideBothSides: 'x को अलग करने के लिए दोनों पक्षों को 3 से भाग दें',
    simplifyToFindAnswer: 'उत्तर ज्ञात करने के लिए सरल करें',
    simplifyStep: 'सरल करें: 5 - 5 = 0 और 12 - 5 = 7',
    verifySolution: 'x = 7 प्रतिस्थापित करके समाधान सत्यापित करें',
    simplifyAdditionStep: 'सरल करें: -3 + 3 = 0 और 8 + 3 = 11',
    verifyAdditionSolution: 'x = 11 प्रतिस्थापित करके समाधान सत्यापित करें',
    simplifySubtractionStep: 'सरल करें: 4 - 4 = 0 और 7 - 4 = 3',
    verifySubtractionSolution: 'x = 3 प्रतिस्थापित करके समाधान सत्यापित करें',
    simplifyMultiplicationStep: 'सरल करें: 3/3 = 1 और 4 × 3 = 12',
    verifyMultiplicationSolution: 'x = 12 प्रतिस्थापित करके समाधान सत्यापित करें',
    simplifyDivisionStep: 'सरल करें: 3x ÷ 3 = x और 15 ÷ 3 = 5',
    verifyDivisionSolution: 'x = 5 प्रतिस्थापित करके समाधान सत्यापित करें',
    linearEquationExample: 'रैखिक समीकरण उदाहरण',
    additionMethodExample: 'जोड़ विधि उदाहरण',
    subtractionMethodExample: 'घटाव विधि उदाहरण',
    multiplicationMethodExample: 'गुणा विधि उदाहरण',
    divisionMethodExample: 'भाग विधि उदाहरण',
    solving: 'हल करना:',
    play: 'चलाएं',
    pause: 'रोकें',
    previous: 'पिछला',
    next: 'अगला',
    
    // Practice Mode
    practiceMode: 'अभ्यास मोड',
    question: 'प्रश्न',
    skippedQuestions: 'छोड़े गए प्रश्न',
    notAttempted: 'प्रयास नहीं किया',
    totalQuestions: 'कुल प्रश्न',
    finalGrade: 'अंतिम ग्रेड',
    accuracyRate: 'सटीकता दर',
    avgTimePerQuestion: 'प्रति प्रश्न औसत समय',
    questionByQuestionReview: 'प्रश्न दर प्रश्न समीक्षा',
    startNewSession: 'नया सत्र शुरू करें',
    loadingQuestions: 'प्रश्न लोड हो रहे हैं...',
    showAnswer: 'उत्तर दिखाएं',
    hideAnswer: 'उत्तर छुपाएं',
    tryAgain: 'फिर कोशिश करें',
    skip: 'छोड़ें',
    skipped: 'छोड़ा गया',
    sessionComplete: 'सत्र पूरा!',
    sessionSummary: 'यहाँ आपका पूरा सत्र सारांश है',
    correctAnswer: 'सही उत्तर',
    check: 'जांच',
    notAttempt: 'प्रयास नहीं करें',
    
    // Practice Questions
    practice_q1: 'हल करें: x - 7 = 8',
    practice_q2: 'हल करें: x - 4 = 8',
    practice_q3: 'हल करें: x - 3 = 18',
    practice_q4: 'हल करें: x - 2 = 6',
    practice_q5: 'हल करें: x - 3 = 8',
    practice_q6: 'हल करें: x - 5 = 4',
    practice_q7: 'हल करें: x - 6 = 12',
    practice_q8: 'हल करें: x - 2 = 5',
    practice_q9: 'हल करें: x - 8 = 25',
    practice_q10: 'हल करें: x - 7 = 6',
    practice_q11: 'हल करें: x - 3 = 5',
    practice_q12: 'हल करें: x - 12 = 18'
  },
  gu: {
    // Navigation
    home: 'ઘર',
    introduction: 'પરિચય',
    learn: 'શીખો',
    realWorld: 'વાસ્તવિક વિશ્વ',
    simpleEquations: 'સરળ સમીકરણો - બાદબાકી',
    simpleEquationsTitle: 'સરળ સમીકરણો - બાદબાકી',
    
    // Home Page
    masterSimpleEquations: 'સરળ સમીકરણોમાં નિપુણતા મેળવો',
    masterClass7Mathematics: 'એનસીઇઆરટી અભ્યાસક્રમના આધારે ઇન્ટરેક્ટિવ શીખવા, પ્રેક્ટિસ કસરતો અને આકર્ષક રમતો સાથે ધોરણ 7 ગણિતમાં નિપુણતા મેળવો',
    startLearning: 'શીખવાનું શરૂ કરો',
    whatYoullLearn: 'તમે શું શીખશો',
    comprehensiveTools: 'સરળ સમીકરણોને શીખવાનું આકર્ષક અને અસરકારક બનાવવા માટે ડિઝાઇન કરેલા વ્યાપક સાધનો',
    introductionDesc: 'ઇન્ટરેક્ટિવ ઉદાહરણો સાથે સરળ સમીકરણોની મૂળભૂત વાતો શીખો',
    learnDesc: 'વિઝ્યુઅલ સહાયતા સાથે પગલું-દર-પગલું સ્પષ્ટતા',
    practiceDesc: 'કસરતો હલ કરો અને તમારા ઉકેલો તપાસો',
    realWorldDesc: 'જુઓ કે સમીકરણો રોજિંદા જીવનમાં કેવી રીતે લાગુ પડે છે',
    practiceProblems: 'પ્રેક્ટિસ સમસ્યાઓ',
    interactiveExamples: 'ઇન્ટરેક્ટિવ ઉદાહરણો',
    readyToMaster: 'સરળ સમીકરણોમાં નિપુણતા મેળવવા માટે તૈયાર છો?',
    joinThousands: 'હજારો વિદ્યાર્થીઓ અને શિક્ષકોમાં જોડાઓ જે ગણિતને આકર્ષક અને સુલભ બનાવી રહ્યા છે.',
    startYourJourney: 'તમારી યાત્રા શરૂ કરો',
    
    // Common
    correct: 'સાચું!',
    incorrect: 'ફરી કોશિશ કરો!',
    learning: 'શીખવું',
    practice: 'પ્રેક્ટિસ',
    assessment: 'મૂલ્યાંકન',
    selectEquation: 'સમીકરણ પસંદ કરો:',
    yourAnswer: 'તમારો જવાબ:',
    submit: 'સબમિટ',
    hint: 'સંકેત',
    progress: 'પ્રગતિ:',
    accuracy: 'ચોકસાઈ',
    avgTime: 'સરેરાશ સમય',
    correctAnswers: 'સાચું',
    incorrectAnswers: 'ખોટું',
    totalExercises: 'કુલ',
    excellent: 'ઉત્તમ!',
    goodJob: 'સારું કામ!',
    keepTrying: 'કોશિશ કરતા રહો!',
    showSolution: 'ઉકેલ બતાવો',
    hideSolution: 'ઉકેલ છુપાવો',
    reset: 'રીસેટ',
    stepByStepSolution: 'પગલું-દર-પગલું ઉકેલ:',
    nextStep: 'આગળનું પગલું',
    complete: 'પૂર્ણ',
    
    // Real World
    realWorldApps: 'વાસ્તવિક વિશ્વના ઉપયોગો',
    selectCategory: 'શ્રેણી પસંદ કરો:',
    difficulty: 'મુશ્કેલી:',
    beginner: 'શરૂઆત',
    intermediate: 'મધ્યમ',
    advanced: 'અદ્યતન',
    equation: 'સમીકરણ:',
    solution: 'ઉકેલ:',
    context: 'સંદર્ભ:',
    shopping: 'ખરીદી',
    cooking: 'રસોઈ',
    construction: 'બાંધકામ',
    sports: 'રમત',
    finance: 'વિત્ત',
    science: 'વિજ્ઞાન',
    
    // Learn Section
    linearEquations: 'રેખીય સમીકરણો',
    linearEquationsDesc: 'રેખીય સમીકરણો એવા સમીકરણો છે જ્યાં ચલની સર્વોચ્ચ ઘાત 1 છે. તેમને જોડાણ, બાદબાકી, ગુણાકાર અને ભાગાકાર જેવી મૂળભૂત બીજગણિતીય ક્રિયાઓનો ઉપયોગ કરીને હલ કરી શકાય છે.',
    solvingByAddition: 'જોડાણ દ્વારા હલ કરવું',
    solvingByAdditionDesc: 'જ્યારે આપણી પાસે સમીકરણમાં બાદબાકી હોય છે, ત્યારે આપણે ચલને અલગ કરવા માટે બંને બાજુઓમાં સમાન સંખ્યા ઉમેરીએ છીએ. આ સમીકરણનું સંતુલન જાળવે છે.',
    solvingBySubtraction: 'બાદબાકી દ્વારા હલ કરવું',
    solvingBySubtractionDesc: 'જ્યારે આપણી પાસે સમીકરણમાં જોડાણ હોય છે, ત્યારે આપણે ચલને અલગ કરવા માટે બંને બાજુઓમાંથી સમાન સંખ્યા બાદ કરીએ છીએ. આ સમીકરણનું સંતુલન જાળવે છે.',
    solvingByMultiplication: 'ગુણાકાર દ્વારા હલ કરવું',
    solvingByMultiplicationDesc: 'જ્યારે આપણી પાસે સમીકરણમાં ભાગાકાર હોય છે, ત્યારે આપણે ચલને અલગ કરવા માટે બંને બાજુઓને સમાન સંખ્યા વડે ગુણીએ છીએ. આ સમીકરણનું સંતુલન જાળવે છે.',
    solvingByDivision: 'ભાગાકાર દ્વારા હલ કરવું',
    solvingByDivisionDesc: 'જ્યારે આપણી પાસે સમીકરણમાં ગુણાકાર હોય છે, ત્યારે આપણે ચલને અલગ કરવા માટે બંને બાજુઓને સમાન સંખ્યા વડે ભાગીએ છીએ. આ સમીકરણનું સંતુલન જાળવે છે.',
    originalEquation: 'મૂળ સમીકરણ',
    originalEquationWithSubtraction: 'બાદબાકી સાથે મૂળ સમીકરણ',
    originalEquationWithAddition: 'જોડાણ સાથે મૂળ સમીકરણ',
    originalEquationWithDivision: 'ભાગાકાર સાથે મૂળ સમીકરણ',
    originalEquationWithMultiplication: 'ગુણાકાર સાથે મૂળ સમીકરણ',
    subtractFromBothSides: 'બંને બાજુઓમાંથી 5 બાદ કરો',
    addToBothSides: 'x ને અલગ કરવા માટે બંને બાજુઓમાં 3 ઉમેરો',
    subtractFromBothSidesToIsolate: 'x ને અલગ કરવા માટે બંને બાજુઓમાંથી 4 બાદ કરો',
    multiplyBothSides: 'x ને અલગ કરવા માટે બંને બાજુઓને 3 વડે ગુણો',
    divideBothSides: 'x ને અલગ કરવા માટે બંને બાજુઓને 3 વડે ભાગો',
    simplifyToFindAnswer: 'જવાબ શોધવા માટે સરળ બનાવો',
    simplifyStep: 'સરળ બનાવો: 5 - 5 = 0 અને 12 - 5 = 7',
    verifySolution: 'x = 7 મૂકીને ઉકેલ ચકાસો',
    simplifyAdditionStep: 'સરળ બનાવો: -3 + 3 = 0 અને 8 + 3 = 11',
    verifyAdditionSolution: 'x = 11 મૂકીને ઉકેલ ચકાસો',
    simplifySubtractionStep: 'સરળ બનાવો: 4 - 4 = 0 અને 7 - 4 = 3',
    verifySubtractionSolution: 'x = 3 મૂકીને ઉકેલ ચકાસો',
    simplifyMultiplicationStep: 'સરળ બનાવો: 3/3 = 1 અને 4 × 3 = 12',
    verifyMultiplicationSolution: 'x = 12 મૂકીને ઉકેલ ચકાસો',
    simplifyDivisionStep: 'સરળ બનાવો: 3x ÷ 3 = x અને 15 ÷ 3 = 5',
    verifyDivisionSolution: 'x = 5 મૂકીને ઉકેલ ચકાસો',
    linearEquationExample: 'રેખીય સમીકરણ ઉદાહરણ',
    additionMethodExample: 'જોડાણ પદ્ધતિ ઉદાહરણ',
    subtractionMethodExample: 'બાદબાકી પદ્ધતિ ઉદાહરણ',
    multiplicationMethodExample: 'ગુણાકાર પદ્ધતિ ઉદાહરણ',
    divisionMethodExample: 'ભાગાકાર પદ્ધતિ ઉદાહરણ',
    solving: 'હલ કરવું:',
    play: 'ચલાવો',
    pause: 'રોકો',
    previous: 'પાછલું',
    next: 'આગળનું',
    
    // Practice Mode
    practiceMode: 'પ્રેક્ટિસ મોડ',
    question: 'પ્રશ્ન',
    skippedQuestions: 'છોડેલા પ્રશ્નો',
    notAttempted: 'પ્રયાસ નથી કર્યો',
    totalQuestions: 'કુલ પ્રશ્નો',
    finalGrade: 'અંતિમ ગ્રેડ',
    accuracyRate: 'ચોકસાઈ દર',
    avgTimePerQuestion: 'પ્રતિ પ્રશ્ન સરેરાશ સમય',
    questionByQuestionReview: 'પ્રશ્ન દર પ્રશ્ન સમીક્ષા',
    startNewSession: 'નવો સત્ર શરૂ કરો',
    loadingQuestions: 'પ્રશ્નો લોડ થઈ રહ્યા છે...',
    showAnswer: 'જવાબ બતાવો',
    hideAnswer: 'જવાબ છુપાવો',
    tryAgain: 'ફરી કોશિશ કરો',
    skip: 'છોડો',
    skipped: 'છોડાયેલું',
    sessionComplete: 'સત્ર પૂર્ણ!',
    sessionSummary: 'અહીં તમારો સંપૂર્ણ સત્ર સારાંશ છે',
    correctAnswer: 'સાચો જવાબ',
    check: 'તપાસ',
    notAttempt: 'પ્રયાસ ન કરો',
    
    // Practice Questions
    practice_q1: 'હલ કરો: x - 7 = 8',
    practice_q2: 'હલ કરો: x - 4 = 8',
    practice_q3: 'હલ કરો: x - 3 = 18',
    practice_q4: 'હલ કરો: x - 2 = 6',
    practice_q5: 'હલ કરો: x - 3 = 8',
    practice_q6: 'હલ કરો: x - 5 = 4',
    practice_q7: 'હલ કરો: x - 6 = 12',
    practice_q8: 'હલ કરો: x - 2 = 5',
    practice_q9: 'હલ કરો: x - 8 = 25',
    practice_q10: 'હલ કરો: x - 7 = 6',
    practice_q11: 'હલ કરો: x - 3 = 5',
    practice_q12: 'હલ કરો: x - 12 = 18'
  }
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'hi' | 'gu'>(() => {
    // Load language from localStorage on initialization
    const savedLanguage = localStorage.getItem('selectedLanguage') as 'en' | 'hi' | 'gu' | null;
    return savedLanguage || 'en';
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  const localizeDigitsInText = (text: string): string => {
    // For now, just return the text as-is
    // In a real implementation, this would convert digits to the appropriate script
    return text;
  };

  const formatNumber = (num: number): string => {
    return num.toString();
  };

  const handleSetLanguage = (lang: 'en' | 'hi' | 'gu') => {
    setIsTransitioning(true);
    // Save language to localStorage
    localStorage.setItem('selectedLanguage', lang);
    setTimeout(() => {
      setLanguage(lang);
      setIsTransitioning(false);
    }, 300);
  };

  const value: LanguageContextType = {
    language,
    setLanguage: handleSetLanguage,
    t,
    isTransitioning,
    localizeDigitsInText,
    formatNumber
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// UserProfileContext from src/contexts/UserProfileContext.tsx
interface UserProgress {
  toolType: string;
  progress: number;
  timeSpent: number;
  exercisesCompleted: number;
  accuracy: number;
  finalScore?: number;
  completed?: boolean;
  masteryLevel?: number;
}

interface UserProfile {
  userId: string;
  name: string;
  level: string;
  preferences: {
    language: 'en' | 'hi' | 'gu';
    theme: 'light' | 'dark';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
  };
  progress: { [toolType: string]: UserProgress };
  totalTimeSpent: number;
  totalExercisesCompleted: number;
  averageAccuracy: number;
}

interface UserProfileContextType {
  userProfile: UserProfile;
  updateProgress: (progress: UserProgress) => void;
  trackToolUsage: (toolType: string) => void;
  updatePreferences: (preferences: Partial<UserProfile['preferences']>) => void;
  resetProgress: () => void;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};

interface UserProfileProviderProps {
  children: ReactNode;
}

export const UserProfileProvider: React.FC<UserProfileProviderProps> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    userId: 'student_001',
    name: 'Student',
    level: 'beginner',
    preferences: {
      language: 'en',
      theme: 'light',
      difficulty: 'beginner'
    },
    progress: {},
    totalTimeSpent: 0,
    totalExercisesCompleted: 0,
    averageAccuracy: 0
  });

  const updateProgress = useCallback((progress: UserProgress) => {
    setUserProfile(prev => {
      const newProgress = { ...prev.progress, [progress.toolType]: progress };
      
      // Calculate totals
      const totalTimeSpent = Object.values(newProgress).reduce((sum, p) => sum + p.timeSpent, 0);
      const totalExercisesCompleted = Object.values(newProgress).reduce((sum, p) => sum + p.exercisesCompleted, 0);
      const averageAccuracy = Object.values(newProgress).reduce((sum, p) => sum + p.accuracy, 0) / Object.keys(newProgress).length || 0;
      
      return {
        ...prev,
        progress: newProgress,
        totalTimeSpent,
        totalExercisesCompleted,
        averageAccuracy
      };
    });
  }, []);

  const trackToolUsage = useCallback((toolType: string) => {
    setUserProfile(prev => ({
      ...prev,
      progress: {
        ...prev.progress,
        [toolType]: {
          ...prev.progress[toolType],
          toolType,
          progress: prev.progress[toolType]?.progress || 0,
          timeSpent: prev.progress[toolType]?.timeSpent || 0,
          exercisesCompleted: prev.progress[toolType]?.exercisesCompleted || 0,
          accuracy: prev.progress[toolType]?.accuracy || 0
        }
      }
    }));
  }, []);

  const updatePreferences = useCallback((preferences: Partial<UserProfile['preferences']>) => {
    setUserProfile(prev => ({
      ...prev,
      preferences: { ...prev.preferences, ...preferences }
    }));
  }, []);

  const resetProgress = useCallback(() => {
    setUserProfile(prev => ({
      ...prev,
      progress: {},
      totalTimeSpent: 0,
      totalExercisesCompleted: 0,
      averageAccuracy: 0
    }));
  }, []);

  const value: UserProfileContextType = {
    userProfile,
    updateProgress,
    trackToolUsage,
    updatePreferences,
    resetProgress
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
};

// SessionContext from src/contexts/SessionContext.tsx
interface LearningSession {
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  currentTool: string;
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
  practiceResults: any[];
  sessionData: any;
  isActive: boolean;
}

interface SessionContextType {
  currentSession: LearningSession | null;
  startSession: (toolType: string, sessionData: any) => string;
  endSession: () => void;
  updateSessionProgress: (step: number, completed: boolean) => void;
  addPracticeResult: (result: any) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  isSessionActive: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

interface SessionProviderProps {
  children: ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const [currentSession, setCurrentSession] = useState<LearningSession | null>(null);

  const startSession = useCallback((toolType: string, sessionData: any) => {
    const sessionId = `session_${Date.now()}`;
    const newSession: LearningSession = {
      sessionId,
      startTime: new Date(),
      currentTool: toolType,
      currentStep: 0,
      totalSteps: sessionData.demonstration?.steps.length || 0,
      completedSteps: [],
      practiceResults: [],
      sessionData,
      isActive: true
    };
    
    setCurrentSession(newSession);
    return sessionId;
  }, []);

  const endSession = useCallback(() => {
    if (currentSession) {
      setCurrentSession(prev => prev ? {
        ...prev,
        endTime: new Date(),
        isActive: false
      } : null);
    }
  }, [currentSession]);

  const updateSessionProgress = useCallback((step: number, completed: boolean) => {
    setCurrentSession(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        currentStep: step,
        completedSteps: completed 
          ? [...prev.completedSteps, step]
          : prev.completedSteps
      };
    });
  }, []);

  const addPracticeResult = useCallback((result: any) => {
    setCurrentSession(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        practiceResults: [...prev.practiceResults, result]
      };
    });
  }, []);

  const pauseSession = useCallback(() => {
    setCurrentSession(prev => prev ? { ...prev, isActive: false } : null);
  }, []);

  const resumeSession = useCallback(() => {
    setCurrentSession(prev => prev ? { ...prev, isActive: true } : null);
  }, []);

  const value: SessionContextType = {
    currentSession,
    startSession,
    endSession,
    updateSessionProgress,
    addPracticeResult,
    pauseSession,
    resumeSession,
    isSessionActive: currentSession?.isActive || false
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};

// ============================================================================
// Navigation Component
// ============================================================================

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { path: '/', label: t('learn'), icon: Brain },
    { path: '/practice', label: t('practice'), icon: ClipboardCheck },
    { path: '/real-world', label: t('realWorld'), icon: Globe },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-teal-500/90 to-purple-600/90 backdrop-blur-md border-b border-white/30 fixed top-0 left-0 right-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Left side - Navigation Buttons */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-white/20 text-white'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Center - Logo */}
          <div className="flex-1 flex justify-center">
            <Link to="/" className="flex items-center space-x-2 text-white">
              <span className="text-xl font-bold">{t('simpleEquations')}</span>
            </Link>
          </div>

          {/* Right side - Language Selector */}
          <div className="hidden md:flex items-center justify-end">
            <div className="flex items-center gap-2">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'hi' | 'gu')}
                className="px-3 py-2 text-sm border border-white/30 rounded-lg bg-white/20 text-white focus:ring-2 focus:ring-teal-500 hover:bg-white/30 transition-colors cursor-pointer"
                style={{fontFamily: 'Poppins, sans-serif'}}
              >
                <option value="en" className="bg-gray-800 text-white">🇺🇸 English</option>
                <option value="hi" className="bg-gray-800 text-white">🇮🇳 हिन्दी</option>
                <option value="gu" className="bg-gray-800 text-white">🇮🇳 ગુજરાતી</option>
              </select>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden absolute right-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-white/80 p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gradient-to-r from-teal-500/80 to-purple-600/80 backdrop-blur-md rounded-lg mt-2 shadow-lg">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? 'bg-white/20 text-white'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              
              {/* Mobile Language Selector */}
              <div className="flex items-center gap-2 px-3 py-2">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'en' | 'hi' | 'gu')}
                  className="px-3 py-2 text-sm border border-white/30 rounded-lg bg-white/20 text-white focus:ring-2 focus:ring-teal-500 hover:bg-white/30 transition-colors cursor-pointer"
                  style={{fontFamily: 'Poppins, sans-serif'}}
                >
                  <option value="en" className="bg-gray-800 text-white">🇺🇸 English</option>
                  <option value="hi" className="bg-gray-800 text-white">🇮🇳 हिन्दी</option>
                  <option value="gu" className="bg-gray-800 text-white">🇮🇳 ગુજરાતી</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

// ============================================================================
// Layout Component
// ============================================================================

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        {children}
      </main>
    </div>
  )
}

// ============================================================================
// SimpleEquationsTool Component
// ============================================================================


// Visual equation data with icons and colors
const equationTypes: EquationType[] = [
  {
    id: 'simple_subtraction',
    name: 'Simple Subtraction',
    equation: 'x - 3 = 8',
    solution: '11',
    rule: 'Add 3',
    description: 'Simple subtraction equations',
    icon: '➖',
    color: 'bg-green-500',
    steps: [
      'Start with: x - 3 = 8',
      'To isolate x, add 3 to both sides',
      'x - 3 + 3 = 8 + 3',
      'Simplify: x = 11',
      'Check: 11 - 3 = 8 ✓'
    ],
    translations: {
      gu: { 
        name: 'સરળ બાદબાકી', 
        rule: '3 ઉમેરો', 
        description: 'સરળ બાદબાકી સમીકરણો',
        steps: [
          'શરૂ કરો: x - 3 = 8',
          'x ને અલગ કરવા માટે, બંને બાજુથી 3 ઉમેરો',
          'x - 3 + 3 = 8 + 3',
          'સરળ બનાવો: x = 11',
          'તપાસો: 11 - 3 = 8 ✓'
        ]
      },
      hi: { 
        name: 'सरल घटाव', 
        rule: '3 जोड़ें', 
        description: 'सरल घटाव के समीकरण',
        steps: [
          'शुरू करें: x - 3 = 8',
          'x को अलग करने के लिए, दोनों तरफ 3 जोड़ें',
          'x - 3 + 3 = 8 + 3',
          'सरल करें: x = 11',
          'जांचें: 11 - 3 = 8 ✓'
        ]
      }
    }
  },
  {
    id: 'subtraction_with_coefficient',
    name: 'Subtraction with Coefficient',
    equation: '2x - 5 = 7',
    solution: '6',
    rule: 'Add 5, then divide by 2',
    description: 'Subtraction equations with coefficients',
    icon: '➖',
    color: 'bg-blue-500',
    steps: [
      'Start with: 2x - 5 = 7',
      'Step 1: Add 5 to both sides',
      '2x - 5 + 5 = 7 + 5',
      'Simplify: 2x = 12',
      'Step 2: Divide both sides by 2',
      '2x ÷ 2 = 12 ÷ 2',
      'Final answer: x = 6',
      'Check: 2 × 6 - 5 = 7 ✓'
    ],
    translations: {
      gu: { 
        name: 'ગુણાંક સાથે બાદબાકી', 
        rule: '5 ઉમેરો, પછી 2 થી ભાગો', 
        description: 'ગુણાંક સાથે બાદબાકી સમીકરણો',
        steps: [
          'શરૂ કરો: 2x - 5 = 7',
          'પગલું 1: બંને બાજુથી 5 ઉમેરો',
          '2x - 5 + 5 = 7 + 5',
          'સરળ બનાવો: 2x = 12',
          'પગલું 2: બંને બાજુથી 2 થી ભાગો',
          '2x ÷ 2 = 12 ÷ 2',
          'અંતિમ જવાબ: x = 6',
          'તપાસો: 2 × 6 - 5 = 7 ✓'
        ]
      },
      hi: { 
        name: 'गुणांक के साथ घटाव', 
        rule: '5 जोड़ें, फिर 2 से भाग दें', 
        description: 'गुणांक के साथ घटाव के समीकरण',
        steps: [
          'शुरू करें: 2x - 5 = 7',
          'चरण 1: दोनों तरफ 5 जोड़ें',
          '2x - 5 + 5 = 7 + 5',
          'सरल करें: 2x = 12',
          'चरण 2: दोनों तरफ 2 से भाग दें',
          '2x ÷ 2 = 12 ÷ 2',
          'अंतिम उत्तर: x = 6',
          'जांचें: 2 × 6 - 5 = 7 ✓'
        ]
      }
    }
  },
  {
    id: 'subtraction_word_problem',
    name: 'Subtraction Word Problem',
    equation: 'x - 9 = 6',
    solution: '15',
    rule: 'Add 9',
    description: 'Real-world subtraction problems',
    icon: '📝',
    color: 'bg-purple-500',
    steps: [
      'Start with: x - 9 = 6',
      'To isolate x, add 9 to both sides',
      'x - 9 + 9 = 6 + 9',
      'Simplify: x = 15',
      'Check: 15 - 9 = 6 ✓'
    ],
    translations: {
      gu: { 
        name: 'બાદબાકી શબ્દ સમસ્યા', 
        rule: '9 ઉમેરો', 
        description: 'વાસ્તવિક જગતની બાદબાકી સમસ્યાઓ',
        steps: [
          'શરૂ કરો: x - 9 = 6',
          'x ને અલગ કરવા માટે, બંને બાજુથી 9 ઉમેરો',
          'x - 9 + 9 = 6 + 9',
          'સરળ બનાવો: x = 15',
          'તપાસો: 15 - 9 = 6 ✓'
        ]
      },
      hi: { 
        name: 'घटाव शब्द समस्या', 
        rule: '9 जोड़ें', 
        description: 'वास्तविक दुनिया की घटाव की समस्याएं',
        steps: [
          'शुरू करें: x - 9 = 6',
          'x को अलग करने के लिए, दोनों तरफ 9 जोड़ें',
          'x - 9 + 9 = 6 + 9',
          'सरल करें: x = 15',
          'जांचें: 15 - 9 = 6 ✓'
        ]
      }
    }
  }
];

const SimpleEquationsTool: React.FC = () => {
  const [currentMode] = useState<'demonstration' | 'practice' | 'assessment'>('demonstration');
  const { language, t } = useLanguage();
  const [selectedEquation, setSelectedEquation] = useState<string>('simple_subtraction');
  
  // Practice mode state
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [attempts, setAttempts] = useState<QuestionAttempt[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  
  // Demonstration mode state
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);


  // Initialize practice exercises
  const baseExercises = useMemo<Omit<Exercise, 'attempted' | 'correct' | 'skipped'>[]>(() => [
    { id: 'q1', promptKey: 'practice_q1', prompt: 'Solve: x - 3 = 8', answer: '11' },
    { id: 'q2', promptKey: 'practice_q2', prompt: 'Solve: y - 7 = 5', answer: '12' },
    { id: 'q3', promptKey: 'practice_q3', prompt: 'Solve: 2x - 5 = 7', answer: '6' },
    { id: 'q4', promptKey: 'practice_q4', prompt: 'Solve: z - 9 = 6', answer: '15' },
    { id: 'q5', promptKey: 'practice_q5', prompt: 'Solve: 3a - 8 = 10', answer: '6' },
    { id: 'q6', promptKey: 'practice_q6', prompt: 'Solve: b - 12 = 8', answer: '20' },
  ], []);

  // Initialize exercises with tracking
  useEffect(() => {
    setExercises(baseExercises.map(ex => ({ ...ex, attempted: false, skipped: false })));
  }, [baseExercises]);

  // Reset question timer when index changes
  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [index]);

  // Update exercises when language changes
  useEffect(() => {
    setExercises(prev => prev.map(ex => ({
      ...ex,
      prompt: t(ex.promptKey) || ex.prompt
    })));
  }, [language, t]);

  // Demonstration mode controls
  function next() {
    const equation = equationTypes.find(eq => eq.id === selectedEquation) || equationTypes[0];
    const steps = getTranslatedText(equation, 'steps', language);
    setCurrentStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }
  
  function prev() {
    setCurrentStepIndex((i) => Math.max(i - 1, 0));
  }
  
  function reset() {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }

  useEffect(() => {
    if (!isPlaying) return;
    const equation = equationTypes.find(eq => eq.id === selectedEquation) || equationTypes[0];
    const steps = getTranslatedText(equation, 'steps', language);
    const id = setInterval(() => {
      setCurrentStepIndex((i) => {
        if (i >= steps.length - 1) {
          setIsPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, 2500);
    return () => clearInterval(id);
  }, [isPlaying, selectedEquation, language]);

  const getTranslatedText = (item: any, field: string, lang: string) => {
    if (item.translations && item.translations[lang] && item.translations[lang][field]) {
      return item.translations[lang][field];
    }
    return item[field];
  };

  // Practice mode functions
  function onResult(ok: boolean) {
    const timeSpent = (Date.now() - questionStartTime) / 1000;
    const currentExercise = exercises[index];
    
    const attempt: QuestionAttempt = {
      questionId: currentExercise.id,
      answer: ok ? 'correct' : 'incorrect',
      isCorrect: ok,
      attempts: 1,
      timeSpent,
      skipped: false
    };
    
    setAttempts(prev => [...prev, attempt]);
    setExercises(prev => prev.map((ex, i) => 
      i === index ? { ...ex, attempted: true, correct: ok } : ex
    ));

    if (ok) {
      setCorrectCount((c) => c + 1);
    }
  }

  function goToPrevious() {
    if (index > 0) {
      setIndex(index - 1);
    }
  }

  function goToNext() {
    if (index < exercises.length - 1) {
      setIndex(index + 1);
    }
  }

  function skipQuestion() {
    const timeSpent = (Date.now() - questionStartTime) / 1000;
    const currentExercise = exercises[index];
    
    const attempt: QuestionAttempt = {
      questionId: currentExercise.id,
      answer: '',
      isCorrect: false,
      attempts: 0,
      timeSpent,
      skipped: true
    };
    
    setAttempts(prev => [...prev, attempt]);
    setExercises(prev => prev.map((ex, i) => 
      i === index ? { ...ex, skipped: true, attempted: false } : ex
    ));

    if (index < exercises.length - 1) {
      setIndex(index + 1);
    }
  }

  // Transport Controls Component
  const TransportControls = ({ onPrev, onNext, onPlayPause, isPlaying }: {
    onPrev: () => void;
    onNext: () => void;
    onPlayPause: () => void;
    isPlaying: boolean;
  }) => (
    <div className="flex items-center gap-2">
      <button
        onClick={onPrev}
        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
        title="Previous Step"
      >
        ⏮️
      </button>
      <button
        onClick={onPlayPause}
        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
        title={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? "⏸️" : "▶️"}
      </button>
      <button
        onClick={onNext}
        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
        title="Next Step"
      >
        ⏭️
      </button>
    </div>
  );

  // Reset Button Component
  const ResetButton = ({ onReset }: { onReset: () => void }) => (
    <button
      onClick={onReset}
      className="px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium"
      title="Reset to Beginning"
    >
      🔄 Reset
    </button>
  );

  const renderDemonstrationMode = () => {
    const equation = equationTypes.find(eq => eq.id === selectedEquation) || equationTypes[0];
    const steps = getTranslatedText(equation, 'steps', language);
    
    return (
      <div className="space-y-6 transition-all duration-500 ease-out">
        {/* Enhanced Header with Teal-Purple Theme */}
        <div className="bg-gradient-to-r from-teal-50 to-purple-50 p-4 rounded-xl border border-teal-200/50 shadow-lg">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <TransportControls onPrev={prev} onNext={next} onPlayPause={() => setIsPlaying((v) => !v)} isPlaying={isPlaying} />
              <ResetButton onReset={reset} />
            </div>
            
            {/* Enhanced Progress Indicator */}
            <div className="flex items-center gap-3">
              <div className="text-sm font-medium bg-gradient-to-r from-teal-700 to-purple-700 bg-clip-text text-transparent">
                Step {currentStepIndex + 1} / {steps.length}
              </div>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-teal-400 to-purple-500 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Equation Selector */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-2xl">🔽</div>
            <label className="text-lg font-semibold text-gray-700">Select Equation Type</label>
          </div>
          <select
            value={selectedEquation}
            onChange={(e) => setSelectedEquation(e.target.value)}
            className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-teal-200 focus:border-teal-500 bg-white shadow-sm"
          >
            {equationTypes.map(eq => {
              const eqData = getTranslatedText(eq, 'name', language);
              return (
                <option key={eq.id} value={eq.id}>
                  {eq.icon} {eqData}: {eq.equation}
                </option>
              );
            })}
          </select>
        </div>

        {/* Enhanced Content Section */}
        <div className="transition-all duration-700 ease-out">
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">{equation.icon}</div>
              <div className="text-2xl font-bold text-gray-800 mb-2">
                {getTranslatedText(equation, 'name', language)}
              </div>
              <div className="text-5xl font-bold text-gray-800 mb-4">
                {equation.equation}
              </div>
              <div className="text-lg text-gray-600">
                {getTranslatedText(equation, 'description', language)}
              </div>
            </div>
            
            {/* Step Display */}
            <div className="bg-gradient-to-br from-teal-50 to-purple-50 rounded-xl p-6 border border-teal-200">
              <div className="text-center mb-4">
                <div className="text-lg font-semibold text-gray-800">Step-by-Step Solution</div>
              </div>
              <div className="space-y-4">
                {steps.map((step: string, stepIndex: number) => (
                  <div 
                    key={stepIndex} 
                    className={`p-4 bg-white rounded-lg border transition-all duration-500 ${
                      stepIndex <= currentStepIndex 
                        ? 'opacity-100 transform translate-x-0 border-teal-200' 
                        : 'opacity-50 transform translate-x-4 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        stepIndex <= currentStepIndex 
                          ? 'bg-teal-500 text-white scale-100' 
                          : 'bg-gray-300 text-gray-500 scale-75'
                      }`}>
                        {stepIndex + 1}
                      </div>
                      <div className="flex-1 text-gray-700">
                        {step}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPracticeMode = () => {
    const currentExercise = exercises[index];
    const completedCount = exercises.filter(ex => ex.attempted && ex.correct).length;
    const attemptedCount = exercises.filter(ex => ex.attempted).length;
    const skippedCount = exercises.filter(ex => ex.skipped).length;
    const notAttemptedCount = exercises.filter(ex => !ex.attempted && !ex.skipped).length;
    const incorrectCount = attemptedCount - completedCount;
    const allQuestionsCompleted = exercises.every(ex => ex.attempted || ex.skipped);

    if (allQuestionsCompleted) {
      const totalTimeSpent = attempts.reduce((sum, attempt) => sum + attempt.timeSpent, 0);
      const averageTimePerQuestion = totalTimeSpent / exercises.length;
      const accuracyRate = exercises.length > 0 ? (correctCount / exercises.length) * 100 : 0;
      
      return (
        <div className="p-6 space-y-6">
          {/* SESSION COMPLETE HEADER */}
          <div className="text-center p-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
            <div className="text-3xl font-bold text-green-700 mb-2">🎉 Session Complete! 🎉</div>
            <div className="text-lg text-gray-600">Here's your complete session summary</div>
          </div>

          {/* COMPREHENSIVE STATISTICS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200 shadow-sm">
              <div className="text-4xl font-bold text-green-600">{correctCount}</div>
              <div className="text-sm text-gray-700 font-medium">Correct Answers</div>
            </div>
            
            <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200 shadow-sm">
              <div className="text-4xl font-bold text-red-600">{incorrectCount}</div>
              <div className="text-sm text-gray-700 font-medium">Incorrect Answers</div>
            </div>
            
            <div className="text-center p-6 bg-yellow-50 rounded-lg border border-yellow-200 shadow-sm">
              <div className="text-4xl font-bold text-yellow-600">{skippedCount}</div>
              <div className="text-sm text-gray-700 font-medium">Skipped Questions</div>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-4xl font-bold text-gray-600">{notAttemptedCount}</div>
              <div className="text-sm text-gray-700 font-medium">Not Attempted</div>
            </div>
          </div>

          {/* PERFORMANCE METRICS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <div className="text-4xl font-bold text-purple-600">{accuracyRate.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Accuracy Rate</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-blue-600">{exercises.length}</div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border border-green-200">
              <div className="text-3xl font-bold text-green-600">{Math.round(averageTimePerQuestion)}s</div>
              <div className="text-sm text-gray-600">Avg Time/Question</div>
            </div>
          </div>

          {/* RESTART BUTTON */}
          <div className="text-center">
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Start New Session
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Simple Progress Header */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Practice Mode</h3>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">
                Question {index + 1} / {exercises.length}
              </div>
            </div>
          </div>
          
          {/* Simple Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((index + 1) / exercises.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Question */}
        <PracticeExerciseCard 
          prompt={currentExercise.prompt} 
          answer={currentExercise.answer} 
          onResult={onResult}
          questionNumber={index + 1}
          totalQuestions={exercises.length}
          onPrevious={goToPrevious}
          onNext={goToNext}
          onSkip={skipQuestion}
          canGoPrevious={index > 0}
          canGoNext={index < exercises.length - 1}
        />
      </div>
    );
  };

  // PracticeExerciseCard Component
  const PracticeExerciseCard = ({ 
    prompt, 
    answer, 
    onResult,
    questionNumber,
    totalQuestions,
    onPrevious,
    onNext,
    onSkip,
    canGoPrevious = true,
    canGoNext = true
  }: {
    prompt: string;
    answer: string;
    onResult?: (correct: boolean) => void;
    questionNumber?: number;
    totalQuestions?: number;
    onPrevious?: () => void;
    onNext?: () => void;
    onSkip?: () => void;
    canGoPrevious?: boolean;
    canGoNext?: boolean;
  }) => {
    const [value, setValue] = useState('');
    const [feedback, setFeedback] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);

    // Reset state when question changes
    useEffect(() => {
      setValue('');
      setFeedback(null);
      setIsSubmitted(false);
      setShowAnswer(false);
    }, [prompt]);

    function check() {
      if (!value.trim()) return;
      
      setIsSubmitted(true);
      
      const ok = value.trim() === answer;
      
      setFeedback(ok ? 'Correct!' : 'Incorrect');
      onResult?.(ok);
    }

    function handleKeyPress(e: React.KeyboardEvent) {
      if (e.key === 'Enter' && !isSubmitted) {
        check();
      }
    }

    function reset() {
      setValue('');
      setFeedback(null);
      setIsSubmitted(false);
      setShowAnswer(false);
    }

    return (
      <div className="practice-card bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
        {/* TOP NAVIGATION */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
          <div className="flex justify-between items-center">
            <button
              onClick={onPrevious}
              disabled={!canGoPrevious}
              className={`px-6 py-3 rounded-lg font-bold text-lg ${
                !canGoPrevious
                  ? 'bg-white/20 text-white/50 cursor-not-allowed'
                  : 'bg-white/30 hover:bg-white/40 transform hover:scale-105'
              }`}
            >
              ← PREVIOUS
            </button>

            <div className="text-center">
              <div className="text-xl font-bold">
                Question {questionNumber || 1} / {totalQuestions || 1}
              </div>
            </div>

            <button
              onClick={onNext}
              disabled={!canGoNext}
              className={`px-6 py-3 rounded-lg font-bold text-lg ${
                !canGoNext
                  ? 'bg-white/20 text-white/50 cursor-not-allowed'
                  : 'bg-white/30 hover:bg-white/40 transform hover:scale-105'
              }`}
            >
              NEXT →
            </button>
          </div>
        </div>

        {/* QUESTION CONTENT */}
        <div className="p-8 space-y-6">
          <div className="text-center">
            <div className="text-xl font-semibold text-gray-800 mb-4">
              {prompt}
            </div>
          </div>

          <div className="space-y-4">
            <input 
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg text-center"
              placeholder="Your answer" 
              value={value} 
              onChange={(e) => setValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isSubmitted}
              type="text"
            />
            
            <div className="flex justify-center gap-3">
              <button 
                className={`px-6 py-2 rounded-lg font-medium ${
                  isSubmitted || !value.trim()
                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                onClick={check}
                disabled={isSubmitted || !value.trim()}
              >
                Submit
              </button>
            </div>
          </div>

          {/* FEEDBACK */}
          {feedback && (
            <div className={`text-center py-3 px-4 rounded-lg ${
              feedback === 'Correct!' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              <div className="text-2xl mb-1">
                {feedback === 'Correct!' ? '✅' : '❌'}
              </div>
              <div className="text-lg font-semibold">{feedback}</div>
            </div>
          )}

          {/* SHOW ANSWER */}
          {showAnswer && (
            <div className="bg-blue-100 text-blue-800 p-6 rounded-xl text-center border-4 border-blue-300">
              <div className="text-lg font-bold mb-2">📚 Correct Answer</div>
              <div className="text-3xl font-bold">{answer}</div>
            </div>
          )}

          {/* ACTION BUTTONS */}
          {isSubmitted && (
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowAnswer(!showAnswer)}
                className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-bold"
              >
                {showAnswer ? 'Hide Answer' : 'Show Answer'}
              </button>
              
              <button
                onClick={reset}
                className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-bold"
              >
                Try Again
              </button>
            </div>
          )}

          {/* SKIP BUTTON */}
          <div className="flex justify-center gap-4">
            <button
              onClick={onSkip}
              className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-medium"
            >
              ⏭️ Skip
            </button>
          </div>
        </div>

        {/* BOTTOM NAVIGATION */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <button
              onClick={onPrevious}
              disabled={!canGoPrevious}
              className="px-4 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            <div className="text-center">
              <div className="text-sm font-medium text-gray-600">
                {questionNumber || 1} / {totalQuestions || 1}
              </div>
            </div>

            <button
              onClick={onNext}
              disabled={!canGoNext}
              className="px-4 py-2 bg-green-500 text-white rounded font-medium hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderAssessmentMode = () => {
    const correctAnswers = attempts.filter(r => r.isCorrect).length;
    const accuracy = attempts.length > 0 ? (correctAnswers / attempts.length) * 100 : 0;
    const avgTime = attempts.length > 0 ? 
      attempts.reduce((sum, r) => sum + r.timeSpent, 0) / attempts.length : 0;

    return (
      <div className="assessment-mode space-y-6">
        {/* Visual Stats Cards */}
        <div className="stats-grid grid grid-cols-3 gap-6">
          <div className="stat-card bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="text-center">
              <div className="text-4xl mb-2">✅</div>
              <div className="text-4xl font-bold">{correctAnswers}</div>
              <div className="text-blue-100">Correct Answers</div>
            </div>
          </div>
          
          <div className="stat-card bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="text-center">
              <div className="text-4xl mb-2">🎯</div>
              <div className="text-4xl font-bold">{Math.round(accuracy)}%</div>
              <div className="text-green-100">Accuracy</div>
            </div>
          </div>
          
          <div className="stat-card bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="text-center">
              <div className="text-4xl mb-2">⚡</div>
              <div className="text-4xl font-bold">{Math.round(avgTime)}s</div>
              <div className="text-purple-100">Avg Time</div>
            </div>
          </div>
        </div>

        {/* Visual Performance Feedback */}
        <div className="performance-feedback bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-center">
            <div className="text-6xl mb-4">
              {accuracy >= 80 ? '🌟' : accuracy >= 60 ? '👍' : '💪'}
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-4">
              {accuracy >= 80 ? 'Excellent!' : accuracy >= 60 ? 'Good Job!' : 'Keep Trying!'}
            </div>
            
            {/* Visual Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-6 mb-6">
              <div 
                className={`h-6 rounded-full transition-all duration-1000 ${
                  accuracy >= 80 ? 'bg-green-500' : accuracy >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${accuracy}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Main Content */}
        <div className="main-content">
          {currentMode === 'demonstration' && renderDemonstrationMode()}
          {currentMode === 'practice' && renderPracticeMode()}
          {currentMode === 'assessment' && renderAssessmentMode()}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Page Components
// ============================================================================

// RealWorldApplications from src/pages/RealWorldApplications.tsx
interface RealWorldApplicationPage {
  id: string;
  title: string;
  description: string;
  equation: string;
  solution: string;
  context: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'shopping' | 'cooking' | 'construction' | 'sports' | 'finance' | 'science';
  icon: string;
  color: string;
  translations?: {
    [key: string]: {
      title: string;
      description: string;
      context: string;
    };
  };
}

const realWorldApplications: RealWorldApplicationPage[] = [
  {
    id: 'shopping_budget',
    title: 'Shopping Budget',
    description: 'Calculate remaining budget after purchases',
    equation: 'x - 25 = 75',
    solution: '100',
    context: 'You have some money for shopping. After buying a book for ₹25, you have ₹75 left. How much money did you start with?',
    difficulty: 'beginner',
    category: 'shopping',
    icon: '🛒',
    color: 'bg-blue-500',
    translations: {
      hi: { 
        title: 'खरीदारी बजट', 
        description: 'खरीदारी के बाद बचे बजट की गणना', 
        context: 'आपके पास खरीदारी के लिए कुछ पैसे हैं। ₹25 में किताब खरीदने के बाद, आपके पास ₹75 बचे हैं। आपने कितने पैसे से शुरुआत की थी?' 
      },
      gu: { 
        title: 'ખરીદી બજેટ', 
        description: 'ખરીદી પછી બાકી બજેટની ગણતરી', 
        context: 'તમારી પાસે ખરીદી માટે કેટલાક પૈસા છે। ₹25 માં પુસ્તક ખરીદ્યા પછી, તમારી પાસે ₹75 બાકી છે। તમે કેટલા પૈસાથી શરૂઆત કરી હતી?' 
      }
    }
  },
  {
    id: 'cooking_recipe',
    title: 'Recipe Scaling',
    description: 'Scale recipe ingredients proportionally',
    equation: 'x - 2 = 6',
    solution: '8',
    context: 'A recipe serves some people. After serving 2 people, you have 6 servings left. How many people does the original recipe serve?',
    difficulty: 'intermediate',
    category: 'cooking',
    icon: '👨‍🍳',
    color: 'bg-orange-500',
    translations: {
      hi: { 
        title: 'रेसिपी स्केलिंग', 
        description: 'रेसिपी के घटकों को अनुपात में स्केल करें', 
        context: 'एक रेसिपी कुछ लोगों को परोसती है। 2 लोगों को परोसने के बाद, आपके पास 6 सर्विंग्स बचे हैं। मूल रेसिपी कितने लोगों को परोसती है?' 
      },
      gu: { 
        title: 'રેસિપી સ્કેલિંગ', 
        description: 'રેસિપીના ઘટકોને પ્રમાણમાં સ્કેલ કરો', 
        context: 'એક રેસિપી કેટલાક લોકોને સેવા આપે છે। 2 લોકોને સેવા આપ્યા પછી, તમારી પાસે 6 સર્વિંગ્સ બાકી છે। મૂળ રેસિપી કેટલા લોકોને સેવા આપે છે?' 
      }
    }
  },
  {
    id: 'construction_materials',
    title: 'Material Calculation',
    description: 'Calculate materials needed for construction',
    equation: 'x - 5 = 15',
    solution: '20',
    context: 'You have some bricks for construction. After using 5 bricks, you have 15 bricks left. How many bricks did you start with?',
    difficulty: 'advanced',
    category: 'construction',
    icon: '🏗️',
    color: 'bg-gray-500',
    translations: {
      hi: { 
        title: 'सामग्री गणना', 
        description: 'निर्माण के लिए आवश्यक सामग्री की गणना', 
        context: 'आपके पास निर्माण के लिए कुछ ईंटें हैं। 5 ईंटें इस्तेमाल करने के बाद, आपके पास 15 ईंटें बची हैं। आपने कितनी ईंटों से शुरुआत की थी?' 
      },
      gu: { 
        title: 'સામગ્રી ગણતરી', 
        description: 'બાંધકામ માટે જરૂરી સામગ્રીની ગણતરી', 
        context: 'તમારી પાસે બાંધકામ માટે કેટલીક ઈંટો છે। 5 ઈંટો વાપર્યા પછી, તમારી પાસે 15 ઈંટો બાકી છે। તમે કેટલી ઈંટો સાથે શરૂઆત કરી હતી?' 
      }
    }
  },
  {
    id: 'sports_scoring',
    title: 'Game Scoring',
    description: 'Calculate points needed to win',
    equation: 'x - 15 = 15',
    solution: '30',
    context: 'Your team has some points. After losing 15 points, you have 15 points left. How many points did you start with?',
    difficulty: 'beginner',
    category: 'sports',
    icon: '⚽',
    color: 'bg-green-500',
    translations: {
      hi: { 
        title: 'गेम स्कोरिंग', 
        description: 'जीतने के लिए आवश्यक अंकों की गणना', 
        context: 'आपकी टीम के पास कुछ अंक हैं। 15 अंक खोने के बाद, आपके पास 15 अंक बचे हैं। आपने कितने अंकों से शुरुआत की थी?' 
      },
      gu: { 
        title: 'ગેમ સ્કોરિંગ', 
        description: 'જીતવા માટે જરૂરી પોઈન્ટની ગણતરી', 
        context: 'તમારી ટીમ પાસે કેટલાક પોઈન્ટ છે। 15 પોઈન્ટ ગુમાવ્યા પછી, તમારી પાસે 15 પોઈન્ટ બાકી છે। તમે કેટલા પોઈન્ટ સાથે શરૂઆત કરી હતી?' 
      }
    }
  },
  {
    id: 'finance_interest',
    title: 'Interest Calculation',
    description: 'Calculate simple interest on investments',
    equation: 'x - 500 = 1500',
    solution: '2000',
    context: 'You have some money invested. After earning ₹500 interest, your total is ₹2000. How much did you originally invest?',
    difficulty: 'intermediate',
    category: 'finance',
    icon: '💰',
    color: 'bg-yellow-500',
    translations: {
      hi: { 
        title: 'ब्याज गणना', 
        description: 'निवेश पर साधारण ब्याज की गणना', 
        context: 'आपके पास कुछ पैसा निवेशित है। ₹500 ब्याज कमाने के बाद, आपका कुल ₹2000 है। आपने मूल रूप से कितना निवेश किया था?' 
      },
      gu: { 
        title: 'વ્યાજ ગણતરી', 
        description: 'નિવેશ પર સરળ વ્યાજની ગણતરી', 
        context: 'તમારી પાસે કેટલાક પૈસા રોકાયેલા છે। ₹500 વ્યાજ કમાયા પછી, તમારું કુલ ₹2000 છે। તમે મૂળ રીતે કેટલા રોક્યા હતા?' 
      }
    }
  },
  {
    id: 'science_measurement',
    title: 'Scientific Measurement',
    description: 'Convert units in scientific calculations',
    equation: 'x - 500 = 500',
    solution: '1000',
    context: 'You have some liquid in a container. After using 500 milliliters, you have 500 milliliters left. How much liquid did you start with?',
    difficulty: 'advanced',
    category: 'science',
    icon: '🧪',
    color: 'bg-purple-500',
    translations: {
      hi: { 
        title: 'वैज्ञानिक माप', 
        description: 'वैज्ञानिक गणनाओं में इकाइयों का रूपांतरण', 
        context: 'आपके पास कंटेनर में कुछ तरल है। 500 मिलीलीटर इस्तेमाल करने के बाद, आपके पास 500 मिलीलीटर बचा है। आपने कितने मिलीलीटर से शुरुआत की थी?' 
      },
      gu: { 
        title: 'વૈજ્ઞાનિક માપ', 
        description: 'વૈજ્ઞાનિક ગણતરીઓમાં એકમોનું રૂપાંતર', 
        context: 'તમારી પાસે કન્ટેનરમાં કેટલાક પ્રવાહી છે। 500 મિલીલીટર વાપર્યા પછી, તમારી પાસે 500 મિલીલીટર બાકી છે। તમે કેટલા મિલીલીટર સાથે શરૂઆત કરી હતી?' 
      }
    }
  }
];

const RealWorldApplications: React.FC = () => {
  const { language, t } = useLanguage();
  const [selectedApp, setSelectedApp] = useState<RealWorldApplicationPage | null>(null);

  const getTranslatedText = (item: any, field: string, lang: string) => {
    if (item.translations && item.translations[lang] && item.translations[lang][field]) {
      return item.translations[lang][field];
    }
    return item[field];
  };

  const filteredApplications = realWorldApplications;


  const renderApplicationCard = (app: RealWorldApplicationPage) => {
    const appData = {
      ...app,
      title: getTranslatedText(app, 'title', language),
      description: getTranslatedText(app, 'description', language),
      context: getTranslatedText(app, 'context', language)
    };

    return (
      <div 
        key={app.id}
        onClick={() => setSelectedApp(app)}
        className="application-card bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:border-teal-300 transition-all cursor-pointer hover:scale-105"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="text-3xl">{app.icon}</div>
          <div className="text-xl font-bold text-gray-800">{appData.title}</div>
        </div>
        
        <div className="text-gray-600 mb-4">{appData.description}</div>
        
        <div className="equation-display mb-4">
          <div className="text-2xl font-bold text-gray-800 text-center">
            {app.equation}
          </div>
        </div>


        <div className="text-sm text-gray-500 text-center">
          {appData.context.substring(0, 100)}...
        </div>
      </div>
    );
  };

  const renderApplicationDetail = (app: RealWorldApplicationPage) => {
    const appData = {
      ...app,
      title: getTranslatedText(app, 'title', language),
      description: getTranslatedText(app, 'description', language),
      context: getTranslatedText(app, 'context', language)
    };

    return (
      <div className="application-detail bg-white rounded-2xl p-8 shadow-lg">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="text-5xl">{app.icon}</div>
            <div>
              <div className="text-3xl font-bold text-gray-800">{appData.title}</div>
              <div className="text-gray-600">{appData.description}</div>
            </div>
          </div>
          <button
            onClick={() => setSelectedApp(null)}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Problem */}
          <div className="problem-section">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{t('context')}:</h3>
              <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                <div className="text-lg text-blue-800">{appData.context}</div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{t('equation')}:</h3>
              <div className="p-6 bg-gray-50 border-2 border-gray-200 rounded-xl text-center">
                <div className="text-4xl font-bold text-gray-800">{app.equation}</div>
              </div>
            </div>
          </div>

          {/* Right Column - Solution */}
          <div className="solution-section">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{t('solution')}:</h3>
              <div className="p-6 bg-green-50 border-2 border-green-200 rounded-xl">
                <div className="text-center">
                  <div className="text-4xl mb-4">🎯</div>
                  <div className="text-2xl font-bold text-green-800">
                    x = {app.solution}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    );
  };

  return (
    <div className="real-world-applications min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 p-4" style={{fontFamily: 'Poppins, sans-serif'}}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="header flex justify-center items-center mb-8">
          <div className="text-4xl font-bold text-gray-800">🌍 {t('realWorldApps')}</div>
        </div>


        {/* Main Content */}
        <div className="main-content">
          {selectedApp ? (
            renderApplicationDetail(selectedApp)
          ) : (
            <div className="applications-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApplications.map(renderApplicationCard)}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

// ============================================================================
// DemonstrationMode Component
// ============================================================================

// AnimatedText helper component
function AnimatedText({ text, delay = 0, speed = 100 }: { text: string; delay?: number; speed?: number }) {
  const [displayedText, setDisplayedText] = useState('');
  const words = text.split(' ');

  useEffect(() => {
    setDisplayedText(''); // Reset on text change
    let currentIndex = 0;
    
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        if (currentIndex < words.length) {
          setDisplayedText(words.slice(0, currentIndex + 1).join(' '));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, speed); // Configurable speed between each word
      
      return () => clearInterval(interval);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [text, speed]);

  return <span>{displayedText}</span>;
}

function DemonstrationMode() {
  const { isTransitioning } = useLanguage();

  return (
    <div className={`transition-all duration-100 ease-out ${
      isTransitioning ? 'opacity-70 scale-995' : 'opacity-100 scale-100'
    }`}>
      {/* Equation Examples Block */}
      <div className="transition-all duration-800 ease-out">
          <div className="bg-gradient-to-br from-white to-teal-50/50 rounded-xl border border-teal-100 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-teal-500 to-purple-600 h-1"></div>
            <div className="p-4">
              <EquationAnimation />
            </div>
        </div>
      </div>

      {/* Step-by-Step Explanation Block */}
      <div className="transition-all duration-800 ease-out mt-6">
        <div className="bg-gradient-to-br from-white to-blue-50/50 rounded-xl border border-blue-100 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-1"></div>
          <div className="p-4">
            <StepByStepExplanation />
          </div>
        </div>
      </div>
    </div>
  );
}

function EquationAnimation() {
  return <LinearEquationExample />;
}

function LinearEquationExample() {
  const { t, language } = useLanguage();
  const [showTitle, setShowTitle] = useState(false);
  const [showDefinition, setShowDefinition] = useState(false);
  const [showVariableX, setShowVariableX] = useState(false);
  const [showRestOfDefinition, setShowRestOfDefinition] = useState(false);
  const [showExamplesTitle, setShowExamplesTitle] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [visibleExampleIndex, setVisibleExampleIndex] = useState(-1);
  
  useEffect(() => {
    // Reset all states when language changes
    setShowTitle(false);
    setShowDefinition(false);
    setShowVariableX(false);
    setShowRestOfDefinition(false);
    setShowExamplesTitle(false);
    setShowExamples(false);
    setVisibleExampleIndex(-1);

    // Sequential display with custom delays
    const timer1 = setTimeout(() => setShowTitle(true), 0); // "Linear Equations" title
    const timer2 = setTimeout(() => setShowDefinition(true), 700); // First definition sentence (700ms after title)
    const timer3 = setTimeout(() => setShowVariableX(true), 1900); // Variable x symbol (1200ms after first definition)
    const timer4 = setTimeout(() => setShowRestOfDefinition(true), 3100); // Second definition sentence (1200ms after x symbol)
    const timer5 = setTimeout(() => setShowExamplesTitle(true), 4100); // "Examples" title (1000ms after second definition)
    const timer6 = setTimeout(() => setShowExamples(true), 5500); // Examples container (1400ms after examples title)
    const timer7 = setTimeout(() => setVisibleExampleIndex(0), 6700); // Addition example (1200ms after container)
    const timer8 = setTimeout(() => setVisibleExampleIndex(1), 8000); // Subtraction example (1300ms after Addition)
    const timer9 = setTimeout(() => setVisibleExampleIndex(2), 9300); // Multiplication example (1300ms after Subtraction)
    const timer10 = setTimeout(() => setVisibleExampleIndex(3), 10600); // Division example (1300ms after Multiplication)

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
      clearTimeout(timer7);
      clearTimeout(timer8);
      clearTimeout(timer9);
      clearTimeout(timer10);
    };
  }, [language]); // Re-run when language changes

  // Language-specific equation examples
  const equationExamples = {
    en: [
      { equation: "x + 5 = 12", solution: "x = 7", operation: "Addition", icon: "➕" },
      { equation: "x - 3 = 8", solution: "x = 11", operation: "Subtraction", icon: "➖" },
      { equation: "2x = 10", solution: "x = 5", operation: "Multiplication", icon: "✖️" },
      { equation: "x/4 = 3", solution: "x = 12", operation: "Division", icon: "➗" }
    ],
    hi: [
      { equation: "x + 5 = 12", solution: "x = 7", operation: "जोड़", icon: "➕" },
      { equation: "x - 3 = 8", solution: "x = 11", operation: "घटाव", icon: "➖" },
      { equation: "2x = 10", solution: "x = 5", operation: "गुणा", icon: "✖️" },
      { equation: "x/4 = 3", solution: "x = 12", operation: "भाग", icon: "➗" }
    ],
    gu: [
      { equation: "x + 5 = 12", solution: "x = 7", operation: "સરવાળો", icon: "➕" },
      { equation: "x - 3 = 8", solution: "x = 11", operation: "બાદબાકી", icon: "➖" },
      { equation: "2x = 10", solution: "x = 5", operation: "ગુણાકાર", icon: "✖️" },
      { equation: "x/4 = 3", solution: "x = 12", operation: "ભાગાકાર", icon: "➗" }
    ]
  };

  const currentExamples = equationExamples[language] || equationExamples.en;

  return (
    <div className="rounded-xl bg-gradient-to-br from-teal-50 to-purple-50 border-2 border-teal-200/60 p-4 shadow-lg mt-2 relative overflow-hidden">
      {/* Definition Section */}
      <div className="text-center mb-6">
        <h3 className={`text-lg font-bold bg-gradient-to-r from-teal-700 to-purple-700 bg-clip-text text-transparent mb-4 transition-all duration-1000 ease-out ${
          showTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          {t('linearEquations')}
        </h3>
        
        {/* Definition Text */}
        <div className="space-y-3">
                  <p className={`text-gray-700 text-sm transition-all duration-1000 ease-out ${
                    showDefinition ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}>
                    <AnimatedText text={`${(t('linearEquationsDesc') || '').split('.')[0] || ''}.`} delay={0} />
                  </p>
          
          {/* Variable X Display */}
          <div className={`transition-all duration-1000 ease-out ${
            showVariableX ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}>
            <div className="inline-block bg-gradient-to-r from-teal-400 to-purple-400 text-white text-4xl font-bold px-6 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
              x
            </div>
            {language === 'hi' && (
              <div className="mt-3">
                <AnimatedText text="इन्हें जोड़, घटाव, गुणा और भाग जैसी बुनियादी बीजगणितीय संक्रियाओं का उपयोग करके हल किया जा सकता है।" delay={0} />
              </div>
            )}
          </div>
          
                  <p className={`text-gray-700 text-sm transition-all duration-1000 ease-out ${
                    showRestOfDefinition ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}>
                    <AnimatedText text={language === 'hi' ? '' : `${(t('linearEquationsDesc') || '').split('.')[1] || ''}.`} delay={0} />
                  </p>
        </div>
      </div>

      {/* Examples Section */}
      {showExamples && (
        <div className={`transition-all duration-1000 ease-out ${
          showExamples ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}>
          <h4 className={`text-md font-semibold text-gray-800 mb-4 text-center transition-all duration-1000 ease-out ${
            showExamplesTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            {language === 'en' ? 'Examples' : language === 'hi' ? 'उदाहरण' : 'ઉદાહરણો'}
          </h4>
          
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <div className="grid grid-cols-2 gap-4">
                {currentExamples.map((example, index) => (
                  <div
                    key={index}
                    className={`transition-all duration-1200 ease-out ${
                      visibleExampleIndex >= index 
                        ? 'opacity-100 translate-y-0 scale-100' 
                        : 'opacity-0 translate-y-8 scale-95'
                    }`}
                  >
                            <AnimatedEquation
                              equation={example.equation}
                              operation={example.operation}
                              icon={example.icon}
                            />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AnimatedEquation({ equation, operation, icon }: {
  equation: string;
  operation: string;
  icon: string;
}) {
  const [displayedEquation, setDisplayedEquation] = useState('');

  useEffect(() => {
    setDisplayedEquation(equation);
  }, [equation]);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-teal-200/50 shadow-inner hover:shadow-md transition-all duration-300 hover:scale-105">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-lg">{icon}</span>
          <span className="text-sm font-semibold text-gray-700">{operation}</span>
        </div>
        
        {/* Equation Display */}
        <div className="text-lg font-mono mb-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
          <span className="text-black">
            {displayedEquation}
          </span>
        </div>
      </div>
    </div>
  );
}

function StepByStepExplanation() {
  const { language } = useLanguage();
  const [showBlock2, setShowBlock2] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showStep1, setShowStep1] = useState(false);
  const [showStep2, setShowStep2] = useState(false);
  const [showStep3, setShowStep3] = useState(false);
  const [showStep4, setShowStep4] = useState(false);
  const [showStep5, setShowStep5] = useState(false);
  const [isLooping, setIsLooping] = useState(false);

  // Language-specific step explanations for subtraction example: x - 5 = 7
  const stepExplanations = {
    en: {
      title: "Subtraction Examples",
      steps: [
        {
          step: "Step 1:",
          equation: "x - 5 = 7",
          explanation: "Start with the given equation"
        },
        {
          step: "Step 2:",
          equation: "x - 5 + 5 = 7 + 5",
          explanation: "Add 5 to both sides to isolate x"
        },
        {
          step: "Step 3:",
          equation: "x = 12",
          explanation: "Simplify both sides"
        },
        {
          step: "Step 4:",
          equation: "12 - 5 = 7",
          explanation: "Check: Substitute x = 12 back into original equation"
        },
        {
          step: "Step 5:",
          equation: "7 = 7 ✓",
          explanation: "Verification: Both sides are equal, solution is correct"
        }
      ]
    },
    hi: {
      title: "घटाव के उदाहरण",
      steps: [
        {
          step: "चरण 1:",
          equation: "x - 5 = 7",
          explanation: "दिए गए समीकरण से शुरू करें"
        },
        {
          step: "चरण 2:",
          equation: "x - 5 + 5 = 7 + 5",
          explanation: "x को अलग करने के लिए दोनों तरफ में 5 जोड़ें"
        },
        {
          step: "चरण 3:",
          equation: "x = 12",
          explanation: "दोनों तरफ को सरल बनाएं"
        },
        {
          step: "चरण 4:",
          equation: "12 - 5 = 7",
          explanation: "जांच: x = 12 को मूल समीकरण में रखें"
        },
        {
          step: "चरण 5:",
          equation: "7 = 7 ✓",
          explanation: "सत्यापन: दोनों तरफ बराबर हैं, समाधान सही है"
        }
      ]
    },
    gu: {
      title: "બાદબાકીના ઉદાહરણો",
      steps: [
        {
          step: "પગલું 1:",
          equation: "x - 5 = 7",
          explanation: "આપેલ સમીકરણથી શરૂ કરો"
        },
        {
          step: "પગલું 2:",
          equation: "x - 5 + 5 = 7 + 5",
          explanation: "x ને અલગ કરવા માટે બંને બાજુઓમાં 5 ઉમેરો"
        },
        {
          step: "પગલું 3:",
          equation: "x = 12",
          explanation: "બંને બાજુને સરળ બનાવો"
        },
        {
          step: "પગલું 4:",
          equation: "12 - 5 = 7",
          explanation: "તપાસ: x = 12 ને મૂળ સમીકરણમાં મૂકો"
        },
        {
          step: "પગલું 5:",
          equation: "7 = 7 ✓",
          explanation: "સત્યાપન: બંને બાજુ સમાન છે, ઉકેલ સાચો છે"
        }
      ]
    }
  };

  const currentExplanation = stepExplanations[language] || stepExplanations.en;

  useEffect(() => {
    // Reset all states when language changes
    setShowBlock2(false);
    setShowTitle(false);
    setShowStep1(false);
    setShowStep2(false);
    setShowStep3(false);
    setShowStep4(false);
    setShowStep5(false);
    setIsLooping(false);

    // Wait for Block 1 to complete (10600ms + 300ms buffer)
    const block2StartTimer = setTimeout(() => setShowBlock2(true), 10900);
    
    // Sequential step display (relative to block 2 start)
    const timer1 = setTimeout(() => setShowTitle(true), 11100); // 200ms after block 2 starts
    const timer2 = setTimeout(() => setShowStep1(true), 11400); // 500ms after block 2 starts
    const timer3 = setTimeout(() => setShowStep2(true), 11900); // 1000ms after block 2 starts
    const timer4 = setTimeout(() => setShowStep3(true), 12400); // 1500ms after block 2 starts
    const timer5 = setTimeout(() => setShowStep4(true), 12900); // 2000ms after block 2 starts
    const timer6 = setTimeout(() => setShowStep5(true), 13400); // 2500ms after block 2 starts
    
    // Start looping after all steps are shown
    const loopTimer = setTimeout(() => {
      setIsLooping(true);
    }, 14400); // Start loop 1 second after step 5 is shown

    return () => {
      clearTimeout(block2StartTimer);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
      clearTimeout(loopTimer);
    };
  }, [language]);

  // Loop effect - separate useEffect for looping
  useEffect(() => {
    if (!isLooping) return;

    const loopInterval = setInterval(() => {
      // Reset all steps
      setShowTitle(false);
      setShowStep1(false);
      setShowStep2(false);
      setShowStep3(false);
      setShowStep4(false);
      setShowStep5(false);
      
      // Restart the sequence
      setTimeout(() => setShowTitle(true), 200);
      setTimeout(() => setShowStep1(true), 500);
      setTimeout(() => setShowStep2(true), 1000);
      setTimeout(() => setShowStep3(true), 1500);
      setTimeout(() => setShowStep4(true), 2000);
      setTimeout(() => setShowStep5(true), 2500);
    }, 4000); // Loop every 4 seconds (3.5s for steps + 0.5s pause)

    return () => {
      clearInterval(loopInterval);
    };
  }, [isLooping]);

  return (
    <div className={`rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200/60 p-4 shadow-lg transition-all duration-1000 ease-out ${
      showBlock2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
    }`}>
      {/* Title */}
      <div className="text-center mb-6">
        <h3 className={`text-lg font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent mb-4 transition-all duration-1000 ease-out ${
          showTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          {currentExplanation.title}
        </h3>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {currentExplanation.steps.map((step, index) => (
          <div
            key={index}
            className={`bg-white rounded-lg p-4 border border-blue-200 shadow-sm transition-all duration-1000 ease-out ${
              (index === 0 && showStep1) || 
              (index === 1 && showStep2) || 
              (index === 2 && showStep3) || 
              (index === 3 && showStep4) || 
              (index === 4 && showStep5)
                ? 'opacity-100 translate-x-0 scale-100' 
                : 'opacity-0 translate-x-4 scale-95'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-bold px-3 py-1 rounded-full min-w-fit transition-all duration-800 ease-out">
                {step.step}
              </div>
              <div className="flex-1">
                <div className="text-lg font-mono text-black mb-2 bg-gray-50 rounded p-2 border transition-all duration-800 ease-out">
                  {step.equation}
                </div>
                <p className="text-gray-700 text-sm transition-all duration-800 ease-out">
                  <AnimatedText text={step.explanation} delay={0} speed={200} />
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// LearnPage from src/pages/LearnPage.tsx
const LearnPage = () => {
  return <DemonstrationMode />;
};

// ============================================================================
// PracticeMode Components
// ============================================================================

// PracticeExerciseCard from src/features/YourToolVisualization/PracticeMode/PracticeExerciseCard.tsx
type PracticeExerciseCardProps = {
  prompt: string;
  answer: number;
  onResult?: (correct: boolean) => void;
  questionNumber?: number;
  totalQuestions?: number;
  isAttempted?: boolean;
  isSkipped?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  onSkip?: () => void;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
};

function PracticeExerciseCardFromPracticeMode({ 
  prompt, 
  answer, 
  onResult,
  questionNumber,
  totalQuestions,
  onPrevious,
  onNext,
  onSkip,
  canGoPrevious = true,
  canGoNext = true
}: PracticeExerciseCardProps) {
  const { t } = useLanguage();
  const [value, setValue] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  // Reset state when question changes
  useEffect(() => {
    setValue('');
    setFeedback(null);
    setIsSubmitted(false);
    setShowAnswer(false);
  }, [prompt]);

  function check() {
    if (!value.trim()) return;
    
    setIsSubmitted(true);
    
    const num = Number(value.trim());
    const ok = num === answer;
    
    setFeedback(ok ? 'correct' : 'incorrect');
    onResult?.(ok);
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !isSubmitted) {
      check();
    }
  }

  function reset() {
    setValue('');
    setFeedback(null);
    setIsSubmitted(false);
    setShowAnswer(false);
  }

  return (
    <div className="practice-card bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
      {/* TOP NAVIGATION - ALWAYS VISIBLE */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
          <button
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-lg ${
              !canGoPrevious
                ? 'bg-white/20 text-white/50 cursor-not-allowed'
                : 'bg-white/30 hover:bg-white/40 transform hover:scale-105'
            }`}
          >
            ← <span className="hidden sm:inline">{t('previous')}</span>
          </button>

          <div className="text-center">
            <div className="text-base sm:text-xl font-bold">
{t('question')} {questionNumber || 1} / {totalQuestions || 1}
            </div>
          </div>

          <button
            onClick={onNext}
            disabled={!canGoNext}
            className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-lg ${
              !canGoNext
                ? 'bg-white/20 text-white/50 cursor-not-allowed'
                : 'bg-white/30 hover:bg-white/40 transform hover:scale-105'
            }`}
          >
            <span className="hidden sm:inline">{t('next')}</span> →
          </button>
        </div>
      </div>

      {/* QUESTION CONTENT */}
      <div className="p-8 space-y-6">
        <div className="text-center">
          <div className="text-xl font-semibold text-gray-800 mb-4">
            {prompt}
          </div>
        </div>

        <div className="space-y-4">
          <input 
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg text-center"
            placeholder={t('yourAnswer')} 
            value={value} 
            onChange={(e) => setValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isSubmitted}
            type="number"
          />
          
          <div className="flex justify-center gap-3">
            <button 
              className={`px-6 py-2 rounded-lg font-medium ${
                isSubmitted || !value.trim()
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              onClick={check}
              disabled={isSubmitted || !value.trim()}
            >
{t('submit')}
            </button>
          </div>
        </div>

        {/* FEEDBACK */}
        {feedback && (
          <div className={`text-center py-4 px-6 rounded-xl border-2 shadow-lg ${
            feedback === 'correct' 
              ? 'bg-green-50 text-green-800 border-green-300' 
              : 'bg-red-50 text-red-800 border-red-300'
          }`}>
            <div className="text-3xl mb-2">
              {feedback === 'correct' ? '✅' : '❌'}
            </div>
            <div className="text-xl font-bold">
              {feedback === 'correct' ? t('correct') + '!' : t('incorrect')}
            </div>
          </div>
        )}

        {/* SIMPLE NAVIGATION AFTER ANSWER */}
        {isSubmitted && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex justify-center gap-4">
              <button
                onClick={onPrevious}
                disabled={!canGoPrevious}
                className="px-4 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                ← {t('previous')}
              </button>
              
              <button
                onClick={onNext}
                disabled={!canGoNext}
                className="px-4 py-2 bg-green-500 text-white rounded font-medium hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {t('next')} →
              </button>
            </div>
          </div>
        )}

        {/* SHOW ANSWER */}
        {showAnswer && (
          <div className="bg-blue-100 text-blue-800 p-6 rounded-xl text-center border-4 border-blue-300">
            <div className="text-lg font-bold mb-2">📚 {t('correctAnswer')}</div>
            <div className="text-3xl font-bold">{answer}</div>
          </div>
        )}

        {/* ACTION BUTTONS */}
        {isSubmitted && (
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setShowAnswer(!showAnswer)}
              className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-bold"
            >
{showAnswer ? t('hideAnswer') : t('showAnswer')}
            </button>
            
            <button
              onClick={reset}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-bold"
            >
{t('tryAgain')}
            </button>
          </div>
        )}

        {/* SKIP BUTTON */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onSkip}
            className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-medium"
          >
⏭️ {t('skip')}
          </button>
        </div>
      </div>

      {/* BOTTOM NAVIGATION */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="flex justify-between items-center">
          <button
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className="px-4 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            ← {t('previous')}
          </button>

          <div className="text-center">
            <div className="text-sm font-medium text-gray-600">
              {questionNumber || 1} / {totalQuestions || 1}
            </div>
          </div>

          <button
            onClick={onNext}
            disabled={!canGoNext}
            className="px-4 py-2 bg-green-500 text-white rounded font-medium hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {t('next')} →
          </button>
        </div>
      </div>
    </div>
  );
}

// PracticeMode from src/features/YourToolVisualization/PracticeMode/PracticeMode.tsx
type PracticeModeExercise = { 
  id: string;
  promptKey: string; 
  prompt: string; 
  answer: number; 
  attempted: boolean;
  correct?: boolean;
  skipped: boolean;
};

type PracticeModeQuestionAttempt = {
  questionId: string;
  answer: string;
  isCorrect: boolean;
  attempts: number;
  timeSpent: number;
  skipped: boolean;
};

function PracticeMode() {
  const { t, language } = useLanguage();
  
  const baseExercises = useMemo<Omit<PracticeModeExercise, 'attempted' | 'correct' | 'skipped'>[]>(() => [
    { id: 'q1', promptKey: 'practice_q1', prompt: t('practice_q1'), answer: 8 },
    { id: 'q2', promptKey: 'practice_q2', prompt: t('practice_q2'), answer: 8 },
    { id: 'q3', promptKey: 'practice_q3', prompt: t('practice_q3'), answer: 18 },
    { id: 'q4', promptKey: 'practice_q4', prompt: t('practice_q4'), answer: 6 },
    { id: 'q5', promptKey: 'practice_q5', prompt: t('practice_q5'), answer: 8 },
    { id: 'q6', promptKey: 'practice_q6', prompt: t('practice_q6'), answer: 4 },
  ], [t]);

  // Initialize exercises with tracking
  const [exercises, setExercises] = useState<PracticeModeExercise[]>(() => 
    baseExercises.map(ex => ({ ...ex, attempted: false, skipped: false }))
  );

  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [attempts, setAttempts] = useState<PracticeModeQuestionAttempt[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  // Reset question timer when index changes
  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [index]);

  // Update exercises when language changes
  useEffect(() => {
    setExercises(prev => prev.map(ex => ({
      ...ex,
      prompt: t(ex.promptKey) // Use translated prompt
    })));
  }, [language, t]);

  function onResult(ok: boolean) {
    const timeSpent = (Date.now() - questionStartTime) / 1000;
    const currentExercise = exercises[index];
    
    // Record the attempt
    const attempt: PracticeModeQuestionAttempt = {
      questionId: currentExercise.id,
      answer: ok ? 'correct' : 'incorrect',
      isCorrect: ok,
      attempts: 1,
      timeSpent,
      skipped: false
    };
    
    setAttempts(prev => [...prev, attempt]);

    // Update exercise status
    setExercises(prev => prev.map((ex, i) => 
      i === index ? { ...ex, attempted: true, correct: ok } : ex
    ));

    if (ok) {
      setCorrectCount((c) => c + 1);
    }
  }

  function goToPrevious() {
    if (index > 0) {
      setIndex(index - 1);
    }
  }

  function goToNext() {
    if (index < exercises.length - 1) {
      setIndex(index + 1);
    }
  }

  function skipQuestion() {
    const timeSpent = (Date.now() - questionStartTime) / 1000;
    const currentExercise = exercises[index];
    
    // Record as skipped
    const attempt: PracticeModeQuestionAttempt = {
      questionId: currentExercise.id,
      answer: '',
      isCorrect: false,
      attempts: 0,
      timeSpent,
      skipped: true
    };
    
    setAttempts(prev => [...prev, attempt]);

    // Update exercise status
    setExercises(prev => prev.map((ex, i) => 
      i === index ? { ...ex, skipped: true, attempted: false } : ex
    ));

    // Move to next question automatically
    if (index < exercises.length - 1) {
      setIndex(index + 1);
    }
  }

  const currentExercise = exercises[index];
  const completedCount = exercises.filter(ex => ex.attempted && ex.correct).length;
  const attemptedCount = exercises.filter(ex => ex.attempted).length;
  const skippedCount = exercises.filter(ex => ex.skipped).length;
  const incorrectCount = attemptedCount - completedCount;

  // Check if session is complete (all questions attempted or skipped)
  const allQuestionsCompleted = exercises.every(ex => ex.attempted || ex.skipped);
  
  // Calculate comprehensive statistics
  const calculateGrade = () => {
    const percentage = (correctCount / exercises.length) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  };

  // If session is complete, show comprehensive summary
  if (allQuestionsCompleted) {
    const totalTimeSpent = attempts.reduce((sum, attempt) => sum + attempt.timeSpent, 0);
    const averageTimePerQuestion = totalTimeSpent / exercises.length;
    const accuracyRate = exercises.length > 0 ? (correctCount / exercises.length) * 100 : 0;
    
    return (
      <div className="p-6 space-y-6">
        {/* SESSION COMPLETE HEADER */}
        <div className="text-center p-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
          <div className="text-3xl font-bold text-green-700 mb-2">🎉 {t('sessionComplete')} 🎉</div>
          <div className="text-lg text-gray-600">{t('sessionSummary')}</div>
        </div>

        {/* COMPREHENSIVE STATISTICS - 3 CATEGORIES */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="text-center p-4 sm:p-6 bg-green-50 rounded-lg border border-green-200 shadow-sm">
            <div className="text-3xl sm:text-4xl font-bold text-green-600">{correctCount}</div>
            <div className="text-xs sm:text-sm text-gray-700 font-medium">{t('correctAnswers')}</div>
          </div>
          
          <div className="text-center p-4 sm:p-6 bg-red-50 rounded-lg border border-red-200 shadow-sm">
            <div className="text-3xl sm:text-4xl font-bold text-red-600">{incorrectCount}</div>
            <div className="text-xs sm:text-sm text-gray-700 font-medium">{t('incorrectAnswers')}</div>
          </div>
          
          <div className="text-center p-4 sm:p-6 bg-yellow-50 rounded-lg border border-yellow-200 shadow-sm">
            <div className="text-3xl sm:text-4xl font-bold text-yellow-600">{skippedCount}</div>
            <div className="text-xs sm:text-sm text-gray-700 font-medium">{t('skippedQuestions')}</div>
          </div>
        </div>

        {/* TOTAL QUESTIONS ROW */}
        <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200 shadow-sm">
          <div className="text-5xl font-bold text-blue-600 mb-2">{exercises.length}</div>
          <div className="text-lg text-gray-700 font-semibold">{t('totalQuestions')}</div>
        </div>

        {/* PERFORMANCE METRICS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <div className="text-4xl font-bold text-purple-600">{calculateGrade()}</div>
            <div className="text-sm text-gray-600">{t('finalGrade')}</div>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
            <div className="text-3xl font-bold text-blue-600">{accuracyRate.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">{t('accuracyRate')}</div>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border border-green-200">
            <div className="text-3xl font-bold text-green-600">{Math.round(averageTimePerQuestion)}s</div>
            <div className="text-sm text-gray-600">{t('avgTimePerQuestion')}</div>
          </div>
        </div>


        {/* RESTART BUTTON */}
        <div className="text-center">
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
{t('startNewSession')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Simple Progress Header */}
      <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 mb-3">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">{t('practiceMode')}</h3>
          </div>
          <div className="text-center sm:text-right">
            <div className="text-xs sm:text-sm text-gray-600">
{t('question')} {index + 1} / {exercises.length}
            </div>
          </div>
        </div>
        
        {/* Simple Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((index + 1) / exercises.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Current Question */}
      {currentExercise ? (
        <PracticeExerciseCardFromPracticeMode 
          prompt={currentExercise.prompt} 
          answer={currentExercise.answer} 
          onResult={onResult}
          questionNumber={index + 1}
          totalQuestions={exercises.length}
          onPrevious={goToPrevious}
          onNext={goToNext}
          onSkip={skipQuestion}
          canGoPrevious={index > 0}
          canGoNext={index < exercises.length - 1}
        />
      ) : (
        <div className="text-center p-8">
          <div className="text-xl text-gray-600">{t('loadingQuestions')}</div>
        </div>
      )}
    </div>
  );
}

// PracticePage from src/pages/PracticePage.tsx
const PracticePage = () => {
  return <PracticeMode />;
};

// ============================================================================
// SharedControls Components
// ============================================================================

// ModeSwitcher from src/features/YourToolVisualization/SharedControls/ModeSwitcher.tsx
function ModeSwitcher() {
  const { language, setLanguage, isTransitioning, t } = useLanguage();
  const location = useLocation();
  const isDemo = location.pathname === '/' || location.pathname.startsWith('/learn');
  const isPractice = location.pathname.startsWith('/practice');
  const isReal = location.pathname.startsWith('/real-world');

  return (
    <div className="flex items-center gap-4">
      {/* Enhanced Mode Navigation */}
      <div className={`inline-flex rounded-2xl overflow-hidden border-2 border-white/40 bg-gradient-to-r from-white/20 via-white/15 to-white/20 backdrop-blur-md px-1.5 py-1 shadow-lg transition-all duration-500 ${
        isTransitioning ? 'scale-95 opacity-70 blur-sm' : 'scale-100 opacity-100 blur-none'
      }`}>
        <Link 
          to="/" 
          className={`group relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-xl transform hover:scale-105 ${
            isDemo 
              ? 'bg-gradient-to-r from-teal-500 to-purple-500 text-white shadow-lg scale-105' 
              : 'text-white hover:bg-white/20 hover:text-teal-100'
          }`}
        >
          <div className="flex items-center space-x-2">
            <span className="text-lg">📚</span>
            <span>{t('learn')}</span>
          </div>
          {isDemo && <div className="absolute inset-0 bg-gradient-to-r from-teal-400/30 to-purple-400/30 rounded-xl animate-pulse" />}
        </Link>
        
        <Link 
          to="/practice" 
          className={`group relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-xl transform hover:scale-105 ${
            isPractice 
              ? 'bg-gradient-to-r from-purple-500 to-teal-500 text-white shadow-lg scale-105' 
              : 'text-white hover:bg-white/20 hover:text-purple-100'
          }`}
        >
          <div className="flex items-center space-x-2">
            <span className="text-lg">🎯</span>
            <span>{t('practice')}</span>
          </div>
          {isPractice && <div className="absolute inset-0 bg-gradient-to-r from-purple-400/30 to-teal-400/30 rounded-xl animate-pulse" />}
        </Link>
        
        <Link 
          to="/real-world" 
          className={`group relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-xl transform hover:scale-105 ${
            isReal 
              ? 'bg-gradient-to-r from-teal-500 to-indigo-500 text-white shadow-lg scale-105' 
              : 'text-white hover:bg-white/20 hover:text-teal-100'
          }`}
        >
          <div className="flex items-center space-x-2">
            <span className="text-lg">🌍</span>
            <span>{t('realWorld')}</span>
          </div>
          {isReal && <div className="absolute inset-0 bg-gradient-to-r from-teal-400/30 to-indigo-400/30 rounded-xl animate-pulse" />}
        </Link>
      </div>

      {/* Clean Language Selector */}
      <div className="relative">
        <select 
          className={`appearance-none bg-white/90 text-gray-800 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-400 border border-white/30 shadow-md transition-all duration-300 cursor-pointer ${
            isTransitioning ? 'opacity-70' : 'opacity-100 hover:shadow-lg'
          }`} 
          value={language} 
          onChange={(e) => setLanguage(e.target.value as 'en' | 'hi' | 'gu')}
        >
          <option value="en">🇺🇸 English</option>
          <option value="hi">🇮🇳 हिंदी</option>
          <option value="gu">🇮🇳 ગુજરાતી</option>
        </select>
        
        {/* Simple Dropdown Arrow */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        {/* Simple Loading Indicator */}
        {isTransitioning && (
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <div className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
}

// ResetButton from src/features/YourToolVisualization/SharedControls/ResetButton.tsx
type ResetButtonProps = {
  onReset?: () => void;
};

function ResetButtonFromSharedControls({ onReset }: ResetButtonProps) {
  const { isTransitioning, t } = useLanguage();
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = () => {
    setIsResetting(true);
    setTimeout(() => {
      if (onReset) onReset();
      setIsResetting(false);
    }, 300);
  };

  return (
    <button 
      className={`group relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-400/50 ${
        isResetting 
          ? 'scale-95 bg-orange-600 text-white shadow-inner animate-pulse' 
          : isTransitioning
          ? 'opacity-50 scale-95 bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-white hover:bg-orange-50 text-orange-700 border-2 border-orange-200/60 hover:border-orange-300 shadow-md hover:shadow-lg'
      }`}
      onClick={handleReset}
      disabled={isTransitioning}
    >
      <div className="flex items-center space-x-2">
        <span className={`text-lg transition-transform duration-300 ${
          isResetting ? 'animate-spin' : 'group-hover:animate-bounce'
        }`}>
          🔄
        </span>
        <span className="font-semibold">{t('reset')}</span>
      </div>
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-400/20 to-red-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Reset progress indicator */}
      {isResetting && (
        <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-b-lg animate-pulse w-full" />
      )}
    </button>
  );
}

// SimpleTransportControls from src/features/YourToolVisualization/SharedControls/SimpleTransportControls.tsx
type SimpleTransportControlsProps = {
  onPrev?: () => void;
  onNext?: () => void;
};

function SimpleTransportControls({ onPrev, onNext }: SimpleTransportControlsProps) {
  const { isTransitioning, t } = useLanguage();
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const handleButtonClick = (action: 'prev' | 'next', callback?: () => void) => {
    setActiveButton(action);
    setTimeout(() => setActiveButton(null), 150);
    if (callback) callback();
  };

  return (
    <div className={`flex items-center gap-2 sm:gap-3 transition-all duration-300 ${
      isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
    }`}>
      {/* Previous Button */}
      <button 
        className={`group relative px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-400/50 ${
          activeButton === 'prev' 
            ? 'scale-95 bg-teal-600 text-white shadow-inner' 
            : 'bg-white hover:bg-teal-50 text-teal-700 border-2 border-teal-200/60 hover:border-teal-300 shadow-md hover:shadow-lg'
        }`}
        onClick={() => handleButtonClick('prev', onPrev)}
      >
        <div className="flex items-center space-x-1 sm:space-x-2">
          <span className="text-sm sm:text-lg group-hover:animate-bounce">⏮️</span>
          <span className="font-semibold hidden sm:inline">{t('previous')}</span>
        </div>
        
        {/* Animated border */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-teal-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </button>

      {/* Next Button */}
      <button 
        className={`group relative px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400/50 ${
          activeButton === 'next' 
            ? 'scale-95 bg-purple-600 text-white shadow-inner' 
            : 'bg-white hover:bg-purple-50 text-purple-700 border-2 border-purple-200/60 hover:border-purple-300 shadow-md hover:shadow-lg'
        }`}
        onClick={() => handleButtonClick('next', onNext)}
      >
        <div className="flex items-center space-x-1 sm:space-x-2">
          <span className="font-semibold hidden sm:inline">{t('next')}</span>
          <span className="text-sm sm:text-lg group-hover:animate-bounce">⏭️</span>
        </div>
        
        {/* Animated border */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-400/20 to-teal-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </button>
    </div>
  );
}

// TransportControls from src/features/YourToolVisualization/SharedControls/TransportControls.tsx
type TransportControlsProps = {
  onPrev?: () => void;
  onNext?: () => void;
  onPlayPause?: () => void;
  isPlaying?: boolean;
};

function TransportControlsFromSharedControls({ onPrev, onNext, onPlayPause, isPlaying }: TransportControlsProps) {
  const { isTransitioning, t } = useLanguage();
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const handleButtonClick = (action: 'prev' | 'next' | 'playPause', callback?: () => void) => {
    setActiveButton(action);
    setTimeout(() => setActiveButton(null), 150);
    if (callback) callback();
  };

  return (
    <div className={`flex items-center gap-2 sm:gap-3 transition-all duration-300 ${
      isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
    }`}>
      {/* Previous Button */}
      <button 
        className={`group relative px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-400/50 ${
          activeButton === 'prev' 
            ? 'scale-95 bg-teal-600 text-white shadow-inner' 
            : 'bg-white hover:bg-teal-50 text-teal-700 border-2 border-teal-200/60 hover:border-teal-300 shadow-md hover:shadow-lg'
        }`}
        onClick={() => handleButtonClick('prev', onPrev)}
      >
        <div className="flex items-center space-x-1 sm:space-x-2">
          <span className="text-sm sm:text-lg group-hover:animate-bounce">⏮️</span>
          <span className="font-semibold hidden sm:inline">{t('previous')}</span>
        </div>
        
        {/* Animated border */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-teal-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </button>

      {/* Play/Pause Button */}
      <button 
        className={`group relative px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg font-bold text-xs sm:text-sm transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-400/50 shadow-lg hover:shadow-xl ${
          activeButton === 'playPause' 
            ? 'scale-95 shadow-inner' 
            : isPlaying 
            ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white animate-pulse' 
            : 'bg-gradient-to-r from-teal-500 via-purple-500 to-teal-600 hover:from-teal-600 hover:via-purple-600 hover:to-teal-700 text-white'
        }`}
        onClick={() => handleButtonClick('playPause', onPlayPause)}
      >
        <div className="flex items-center space-x-1 sm:space-x-2">
          <span className={`text-sm sm:text-lg transition-transform duration-200 ${
            isPlaying ? 'animate-pulse' : 'group-hover:animate-bounce'
          }`}>
            {isPlaying ? '⏸️' : '▶️'}
          </span>
          <span className="font-bold hidden sm:inline">{isPlaying ? t('pause') : t('play')}</span>
        </div>
        
        {/* Glow effect for play button */}
        {!isPlaying && (
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-teal-400/30 to-purple-400/30 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
        )}
      </button>

      {/* Next Button */}
      <button 
        className={`group relative px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400/50 ${
          activeButton === 'next' 
            ? 'scale-95 bg-purple-600 text-white shadow-inner' 
            : 'bg-white hover:bg-purple-50 text-purple-700 border-2 border-purple-200/60 hover:border-purple-300 shadow-md hover:shadow-lg'
        }`}
        onClick={() => handleButtonClick('next', onNext)}
      >
        <div className="flex items-center space-x-1 sm:space-x-2">
          <span className="font-semibold hidden sm:inline">{t('next')}</span>
          <span className="text-sm sm:text-lg group-hover:animate-bounce">⏭️</span>
        </div>
        
        {/* Animated border */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-400/20 to-teal-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </button>
    </div>
  );
}

// ============================================================================
// Exports
// ============================================================================

export default SimpleEquationsTool;
export { ErrorBoundary, Navigation, Layout, RealWorldApplications, LearnPage, PracticePage, DemonstrationMode, PracticeMode, PracticeExerciseCardFromPracticeMode, ModeSwitcher, ResetButtonFromSharedControls, SimpleTransportControls, TransportControlsFromSharedControls };
