export interface LineSymmetryShape {
  name: string;
  linesOfSymmetry: number;
  hasLineSymmetry: boolean;
  hasRotationalSymmetry: boolean;
  orderOfRotation?: number;
  angleOfRotation?: number;
  centerOfRotation?: string;
}

export interface LineSymmetryExercise {
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
  linesOfSymmetry?: number;
  orderOfRotation?: number;
  angleOfRotation?: number;
  question: string;
  answer: string;
  icon: string;
}
