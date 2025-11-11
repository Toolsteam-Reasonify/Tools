export interface ExerciseData {
  label: string;
  value: number;
  color?: string;
}

export interface CircleExercise {
  id: number;
  prompt: string;
  answer: string | number;
  hint: string;
  solution: string;
  data?: ExerciseData[];
  unit?: string;
}


