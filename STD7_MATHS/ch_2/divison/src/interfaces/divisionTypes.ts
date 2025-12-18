export interface Fraction {
  numerator: number;
  denominator: number;
  isMixed?: boolean;
  wholePart?: number;
}

export interface DivisionExercise {
  id: number;
  dividend: Fraction;
  divisor: Fraction;
  question: string;
  answer: string;
  hint: string;
  solution: string;
  visualSteps?: VisualStep[];
}

export interface VisualStep {
  id: number;
  title: string;
  description: string;
  visual: 'circle' | 'rectangle' | 'number-line' | 'equation';
  data: any;
}

export interface DemoStep {
  id: number;
  title: string;
  description: string;
  concept: string;
  visual?: VisualStep;
}

export interface RealWorldExample {
  id: number;
  title: string;
  context: string;
  question: string;
  answer: string;
  icon: string;
  visualData?: {
    type: 'recipe' | 'construction' | 'study' | 'discount' | 'maps' | 'fuel';
    values: any;
  };
}

export interface PracticeQuestion {
  id: number;
  question: string;
  dividend: string;
  divisor: string;
  correctAnswer: string;
  options?: string[];
  hint: string;
  explanation: string;
}


