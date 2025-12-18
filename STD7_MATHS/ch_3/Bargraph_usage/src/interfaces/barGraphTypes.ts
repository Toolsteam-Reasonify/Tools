export interface BarGraphData {
  label: string;
  value: number;
  color?: string;
}

export interface BarGraphExercise {
  id: number;
  data: BarGraphData[];
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
  data: BarGraphData[];
  question: string;
  answer: string;
  icon: string;
}






