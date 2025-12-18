export interface ParallelogramData {
  base: number;
  height: number;
  area?: number;
  perimeter?: number;
  color?: string;
}

export interface ParallelogramExercise {
  id: number;
  parallelogram: ParallelogramData;
  question: string;
  answer: string | number;
  hint: string;
  solution: string;
  unit?: string;
}

export interface DemoStep {
  id: number;
  title: string;
  description: string;
  concept: string;
}

export interface RealWorldExample {
  id: number;
  title: string;
  context: string;
  parallelogram: ParallelogramData;
  question: string;
  answer: string;
  icon: string;
}
