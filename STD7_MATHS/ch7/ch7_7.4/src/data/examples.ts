export type ExampleItem = { equation: string; solution: string; operation: string; icon: string };

const EXAMPLES: Record<string, ExampleItem[]> = {
  en: [
    { equation: 'I = (5000×15×1)/100 = ₹750', solution: '₹750', operation: 'Simple Interest (1 year)', icon: '🧮' },
    { equation: 'I = (3000×5×3)/100 = ₹450', solution: '₹450', operation: 'Simple Interest (T years)', icon: '⏱️' }
  ],
  hi: [
    { equation: 'I = (5000×15×1)/100 = ₹750', solution: '₹750', operation: 'साधारण ब्याज (1 वर्ष)', icon: '🧮' },
    { equation: 'I = (3000×5×3)/100 = ₹450', solution: '₹450', operation: 'साधारण ब्याज (T वर्ष)', icon: '⏱️' }
  ],
  gu: [
    { equation: 'I = (5000×15×1)/100 = ₹750', solution: '₹750', operation: 'સરળ વ્યાજ (1 વર્ષ)', icon: '🧮' },
    { equation: 'I = (3000×5×3)/100 = ₹450', solution: '₹450', operation: 'સરળ વ્યાજ (T વર્ષ)', icon: '⏱️' }
  ],
};

export function getExamples(language: string): ExampleItem[] {
  return EXAMPLES[language] || EXAMPLES.en;
}
