export interface ModeExercise {
  exercise_id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  problem_data: { dataset: number[]; context?: string; unit?: string; show_table?: boolean };
  questions: { type: 'mode'; question: string; expected_answer?: number | string }[];
  solution: { modes: number[]; step_by_step: { step: number; description: string; result?: string }[] };
  interaction_config: { input_methods: string[]; max_attempts?: number; hint_system?: boolean; progressive_hints?: string[] };
}

export interface ModeCalculation {
  dataset: number[];
  frequencyMap: Record<string, number>;
  modes: number[];
  maxFrequency: number;
}



