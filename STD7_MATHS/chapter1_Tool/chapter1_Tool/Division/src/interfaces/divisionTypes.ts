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
  problem_data: {
    dividend: number;
    divisor: number;
    show_visual?: boolean;
    show_steps?: boolean;
    use_groups?: boolean;
    remainder_handling?: 'show' | 'hide' | 'explain';
  };
  solution: {
    quotient: number;
    remainder?: number;
    solution_steps?: {
      step: number;
      description: string;
      partial_result?: number;
      remaining?: number;
    }[];
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

export interface DivisionToolData {
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

// Division-specific visual representations
export interface DivisionVisual {
  type: 'groups' | 'number_line' | 'long_division' | 'array';
  dividend: number;
  divisor: number;
  quotient: number;
  remainder: number;
  steps: DivisionStep[];
}

export interface DivisionStep {
  step_number: number;
  operation: string;
  description: string;
  visual_state: {
    groups_formed?: number;
    items_per_group?: number;
    remaining_items?: number;
    position_on_line?: number;
  };
}

// Division properties for topic 1.5
export interface DivisionProperty {
  name: 'identity' | 'zero_dividend' | 'zero_divisor' | 'self_division' | 'distributive';
  title: string;
  description: string;
  formula: string;
  examples: DivisionExample[];
  counterexamples?: DivisionExample[];
}

export interface DivisionExample {
  dividend: number;
  divisor: number;
  quotient: number;
  remainder?: number;
  explanation: string;
}