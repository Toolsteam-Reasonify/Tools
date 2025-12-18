export interface SymmetryDataItem {
  label: string;
  value?: number;
  note?: string;
  color?: string;
}

export interface SymmetryExercise {
  id: number;
  prompt: string;
  answer: string | number;
  hint: string;
  solution: string;
  items?: SymmetryDataItem[];
}






