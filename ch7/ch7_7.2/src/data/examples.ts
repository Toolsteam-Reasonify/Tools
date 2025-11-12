export type ExampleItem = { equation: string; solution: string; operation: string; icon: string };

const EXAMPLES: Record<string, ExampleItem[]> = {
  en: [
    { equation: '5% of ₹100 = ₹5', solution: '₹5', operation: 'Interpret % statement', icon: '📊' },
    { equation: '25% × 40 = 10', solution: '10', operation: '% of a total', icon: '📈' },
    { equation: '2:1 = 2/3 × 100% ≈ 66.7%', solution: '≈66.7%', operation: 'Ratio → %', icon: '🧮' },
    { equation: 'Increase: 280→350; (70/280) × 100 = 25%', solution: '25%', operation: '% change', icon: '📉' },
  ],
  hi: [
    { equation: 'आय का 5% (₹100 का) = ₹5', solution: '₹5', operation: 'प्रतिशत का अर्थ', icon: '📊' },
    { equation: '25% × 40 = 10', solution: '10', operation: 'कुल का प्रतिशत', icon: '📈' },
    { equation: '2:1 = 2/3 × 100% ≈ 66.7%', solution: '≈66.7%', operation: 'अनुपात → %', icon: '🧮' },
    { equation: 'वृद्धि: 280→350; (70/280) × 100 = 25%', solution: '25%', operation: '% परिवर्तन', icon: '📉' },
  ],
  gu: [
    { equation: 'આવકનું 5% (₹100નું) = ₹5', solution: '₹5', operation: 'ટકાનો અર્થ', icon: '📊' },
    { equation: '25% × 40 = 10', solution: '10', operation: 'કુલનું %', icon: '📈' },
    { equation: '2:1 = 2/3 × 100% ≈ 66.7%', solution: '≈66.7%', operation: 'અનુપાત → %', icon: '🧮' },
    { equation: 'વધારો: 280→350; (70/280) × 100 = 25%', solution: '25%', operation: '% ફેરફાર', icon: '📉' },
  ],
};

export function getExamples(language: string): ExampleItem[] {
  return EXAMPLES[language] || EXAMPLES.en;
}
