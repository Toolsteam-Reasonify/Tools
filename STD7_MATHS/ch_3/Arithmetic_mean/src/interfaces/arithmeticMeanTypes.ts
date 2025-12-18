export interface ArithmeticMeanExercise {
  exercise_id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  problem_data: {
    dataset: number[];
    context?: string; // e.g., "heights of students", "rainfall data", "marks obtained"
    unit?: string; // e.g., "cm", "mm", "marks"
    show_table?: boolean;
    show_range?: boolean;
  };
  questions: {
    type: 'mean' | 'range' | 'comparison' | 'interpretation';
    question: string;
    expected_answer?: number | string;
    multiple_choice?: {
      options: string[];
      correct_index: number;
    };
  }[];
  solution: {
    mean: number;
    range?: number;
    step_by_step: {
      step: number;
      description: string;
      calculation?: string;
      result?: number;
    }[];
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
    conceptual_understanding?: number;
  };
}

export interface DemonstrationStep {
  step_number: number;
  title: string;
  description: string;
  type: 'explanation' | 'visualization' | 'interaction' | 'calculation';
  visual_state: {
    dataset: number[];
    current_calculation?: string;
    highlighted_values?: number[];
    animation_phase?: number;
  };
  interactions?: {
    type: 'click' | 'drag' | 'input' | 'select';
    target: string;
    expectedValue?: unknown;
    hint?: string;
  }[];
  completion_criteria?: {
    type: 'automatic' | 'user_confirm' | 'calculation';
    condition?: unknown;
  };
  learning_notes?: string;
  common_mistakes?: string[];
}

export interface ArithmeticMeanToolData {
  tool_type: string;
  session_id: string;
  mode: 'demonstration' | 'practice' | 'assessment' | 'mixed';
  demonstration?: {
    steps: DemonstrationStep[];
    auto_progression: boolean;
    step_duration: number;
  };
  practice?: {
    exercises: ArithmeticMeanExercise[];
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
}

export interface MeanCalculation {
  dataset: number[];
  sum: number;
  count: number;
  mean: number;
  range?: number;
  sorted_data?: number[];
}

export interface RangeCalculation {
  dataset: number[];
  min: number;
  max: number;
  range: number;
  sorted_data: number[];
}

export interface StatisticalVisualization {
  type: 'bar_chart' | 'number_line' | 'table' | 'comparison';
  data: number[];
  mean_line?: boolean;
  range_highlight?: boolean;
  interactive?: boolean;
}
