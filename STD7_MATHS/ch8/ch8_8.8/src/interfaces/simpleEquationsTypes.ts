/**
 * Core Data Structures for Simple Equations Educational Tool
 */

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
