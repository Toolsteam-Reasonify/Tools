export interface DemonstrationStep {
  step_number: number;
  title: string;
  description: string;
  type: 'explanation' | 'visualization' | 'interaction' | 'assessment';
  visual_state: Record<string, unknown>;
  interactions?: {
    type: 'click' | 'drag' | 'input' | 'select';
    target: string;
    expectedValue?: unknown;
    hint?: string;
  }[];
  completion_criteria?: {
    type: 'automatic' | 'user_confirm' | 'assessment';
    condition?: unknown;
  };
  learning_notes?: string;
  common_mistakes?: string[];
}

export interface PracticeExercise {
  exercise_id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  problem_data: Record<string, unknown>;
  solution: {
    correct_answer: unknown;
    solution_steps?: unknown[];
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
    style_points?: number;
  };
}

export interface YourToolData {
  tool_type: string;
  session_id: string;
  mode: 'demonstration' | 'practice' | 'assessment' | 'mixed';
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
}


