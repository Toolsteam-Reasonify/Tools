export interface RotationExample {
  id: number;
  shape: string;
  order: number;
  angle: number;
  center: { x: number; y: number };
  vertices?: Array<{ x: number; y: number; label?: string }>;
}

export interface RotationalSymmetryExercise {
  id: number;
  question: string;
  answer: string | number;
  hint: string;
  solution: string;
  shape?: string;
  figure?: string;
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
  order: number;
  angle: number;
  question: string;
  answer: string;
  icon: string;
}



