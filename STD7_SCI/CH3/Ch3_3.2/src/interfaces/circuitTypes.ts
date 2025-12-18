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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectedValue?: any;
    hint?: string;
  }[];
  completion_criteria?: {
    type: 'automatic' | 'user_confirm' | 'assessment';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    correct_solution: any;
  };
  solution: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    correct_answer: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  student_answer: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

