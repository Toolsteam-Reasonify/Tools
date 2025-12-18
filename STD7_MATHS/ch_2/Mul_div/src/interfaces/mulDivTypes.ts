export interface MultiplicationExercise {
  id: number;
  problem: string;
  answer: string | number;
  hint: string;
  solution: string;
  unit?: string;
  type: 'basic' | 'by_10_100_1000' | 'decimal_by_decimal';
}

export interface DivisionExercise {
  id: number;
  problem: string;
  answer: string | number;
  hint: string;
  solution: string;
  unit?: string;
  type: 'by_whole' | 'by_10_100_1000' | 'decimal_by_decimal';
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
  problem: string;
  answer: string;
  icon: string;
  calculation?: string;
}

export interface GridVisual {
  rows: number;
  cols: number;
  shadedCells: number[];
  totalCells: number;
  represents: string;
}

export interface DecimalOperation {
  operation: 'multiply' | 'divide';
  by: 10 | 100 | 1000;
  input: number;
  output: number;
  explanation: string;
}