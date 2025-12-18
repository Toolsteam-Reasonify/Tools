export interface TriangleData {
  base: number;
  height: number;
  color?: string;
  isObtuse?: boolean;
}

export interface TriangleExercise {
  id: number;
  triangle: TriangleData;
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
  triangle: TriangleData;
  question: string;
  answer: string;
  icon: string;
}

