export interface MedianCalculation {
  dataset: number[];
  sortedData: number[];
  median: number;
  n: number;
  isOdd: boolean;
  middleIndex?: number;
  middleIndices?: [number, number];
}

export interface MedianExercise {
  exercise_id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  problem_data: {
    dataset: number[];
  };
  questions: Array<{
    type: 'median';
    question: string;
    expected_answer: number | string;
  }>;
  solution: {
    median: number;
    step_by_step: Array<{
      step: number;
      description: string;
      result?: string;
    }>;
  };
  interaction_config: {
    input_methods: string[];
    hint_system: boolean;
    progressive_hints: string[];
  };
}







