export type PercentOperation = 'interpret' | 'percent_of_total' | 'ratio_to_percent' | 'percent_change';

export interface StepItem {
  step: string;
  equation: string;
  explanation: string;
}

export interface StepResult {
  title: string;
  steps: StepItem[];
}

export function getSteps(operation: PercentOperation, t: (key: string) => string, _params: any): StepResult {
  // Mapped for Topic 7.4 (Simple Interest) while keeping same operation IDs
  switch (operation) {
    case 'interpret':
      return siOneYear(t);
    case 'percent_of_total':
      return siMultiYears(t);
    case 'ratio_to_percent':
      return siAmount(t);
    case 'percent_change':
      return siKeyPoint(t);
    default:
      return siOneYear(t);
  }
}

// Helper function to replace placeholders in translation strings
function translateWithParams(t: (key: string) => string, key: string, params: Record<string, string | number> = {}): string {
  let text = t(key);
  Object.entries(params).forEach(([placeholder, value]) => {
    text = text.replace(new RegExp(`\\{${placeholder}\\}`, 'g'), String(value));
  });
  return text;
}

function siOneYear(t: (key: string) => string): StepResult {
  const P = 5000, R = 15, T = 1;
  const I = (P * R * T) / 100;
  return {
    title: t('step_siOneYear_title'),
    steps: [
      { 
        step: t('step_siOneYear_step1'), 
        equation: t('step_siOneYear_eq1'), 
        explanation: t('step_siOneYear_exp1') 
      },
      { 
        step: t('step_siOneYear_step2'), 
        equation: translateWithParams(t, 'step_siOneYear_eq2', { P, R, T }), 
        explanation: t('step_siOneYear_exp2') 
      },
      { 
        step: t('step_siOneYear_step3'), 
        equation: translateWithParams(t, 'step_siOneYear_eq3', { P, R, T }), 
        explanation: t('step_siOneYear_exp3') 
      },
      { 
        step: t('step_siOneYear_step4'), 
        equation: translateWithParams(t, 'step_siOneYear_eq4', { result: P * R * T, I: stripTrailingZeros(I) }), 
        explanation: t('step_siOneYear_exp4') 
      },
      { 
        step: t('step_siOneYear_step5'), 
        equation: translateWithParams(t, 'step_siOneYear_eq5', { I: stripTrailingZeros(I) }), 
        explanation: t('step_siOneYear_exp5') 
      }
    ]
  };
}

function siMultiYears(t: (key: string) => string): StepResult {
  const P = 3000, R = 5, T = 3;
  const I = (P * R * T) / 100; // = 450
  return {
    title: t('step_siMultiYears_title'),
    steps: [
      { 
        step: t('step_siMultiYears_step1'), 
        equation: t('step_siMultiYears_eq1'), 
        explanation: t('step_siMultiYears_exp1') 
      },
      { 
        step: t('step_siMultiYears_step2'), 
        equation: translateWithParams(t, 'step_siMultiYears_eq2', { P, R, T }), 
        explanation: t('step_siMultiYears_exp2') 
      },
      { 
        step: t('step_siMultiYears_step3'), 
        equation: translateWithParams(t, 'step_siMultiYears_eq3', { P, R, T }), 
        explanation: t('step_siMultiYears_exp3') 
      },
      { 
        step: t('step_siMultiYears_step4'), 
        equation: translateWithParams(t, 'step_siMultiYears_eq4', { result: P * R * T, I: stripTrailingZeros(I) }), 
        explanation: t('step_siMultiYears_exp4') 
      },
      { 
        step: t('step_siMultiYears_step5'), 
        equation: translateWithParams(t, 'step_siMultiYears_eq5', { I: stripTrailingZeros(I) }), 
        explanation: t('step_siMultiYears_exp5') 
      }
    ]
  };
}

function siAmount(t: (key: string) => string): StepResult {
  const P = 5000, I = 750; // from Anita example
  const A = P + I;
  return {
    title: t('step_siAmount_title'),
    steps: [
      { 
        step: t('step_siAmount_step1'), 
        equation: t('step_siAmount_eq1'), 
        explanation: t('step_siAmount_exp1') 
      },
      { 
        step: t('step_siAmount_step2'), 
        equation: translateWithParams(t, 'step_siAmount_eq2', { P, I }), 
        explanation: t('step_siAmount_exp2') 
      },
      { 
        step: t('step_siAmount_step3'), 
        equation: translateWithParams(t, 'step_siAmount_eq3', { P, I }), 
        explanation: t('step_siAmount_exp3') 
      },
      { 
        step: t('step_siAmount_step4'), 
        equation: translateWithParams(t, 'step_siAmount_eq4', { A: stripTrailingZeros(A) }), 
        explanation: t('step_siAmount_exp4') 
      },
      { 
        step: t('step_siAmount_step5'), 
        equation: translateWithParams(t, 'step_siAmount_eq5', { A: stripTrailingZeros(A) }), 
        explanation: t('step_siAmount_exp5') 
      }
    ]
  };
}

function siKeyPoint(t: (key: string) => string): StepResult {
  return {
    title: t('step_siKeyPoint_title'),
    steps: [
      { 
        step: t('step_siKeyPoint_step1'), 
        equation: t('step_siKeyPoint_eq1'), 
        explanation: t('step_siKeyPoint_exp1') 
      },
      { 
        step: t('step_siKeyPoint_step2'), 
        equation: t('step_siKeyPoint_eq2'), 
        explanation: t('step_siKeyPoint_exp2') 
      },
      { 
        step: t('step_siKeyPoint_step3'), 
        equation: t('step_siKeyPoint_eq3'), 
        explanation: t('step_siKeyPoint_exp3') 
      },
      { 
        step: t('step_siKeyPoint_step4'), 
        equation: t('step_siKeyPoint_eq4'), 
        explanation: t('step_siKeyPoint_exp4') 
      },
      { 
        step: t('step_siKeyPoint_step5'), 
        equation: t('step_siKeyPoint_eq5'), 
        explanation: t('step_siKeyPoint_exp5') 
      }
    ]
  };
}

export function parseEquationToParams(operation: PercentOperation, equation: string): any {
  try {
    if (operation === 'interpret') {
      // e.g., "5% of ₹100 = ₹5"
      const m = equation.match(/(\d+(?:\.\d+)?)%\s*of\s*₹?(\d+(?:\.\d+)?)/i);
      if (m) return { percent: parseFloat(m[1]), base: parseFloat(m[2]) };
      return { percent: 5, base: 100 };
    }
    if (operation === 'percent_of_total') {
      // e.g., "25% × 40 = 10"
      const m = equation.match(/(\d+(?:\.\d+)?)%\s*[×x*]\s*(\d+(?:\.\d+)?)/i);
      if (m) return { percent: parseFloat(m[1]), total: parseFloat(m[2]) };
      return { percent: 25, total: 40 };
    }
    if (operation === 'ratio_to_percent') {
      // e.g., "2:1 = 2/3 × 100% ≈ 66.7%"
      const m = equation.match(/(\d+)\s*:\s*(\d+)/);
      if (m) return { a: parseFloat(m[1]), b: parseFloat(m[2]) };
      return { a: 2, b: 1 };
    }
    if (operation === 'percent_change') {
      // e.g., "Increase: 280→350; (70/280) × 100 = 25%"
      const m = equation.match(/(\d+(?:,\d+|\.\d+)*)\s*[→\-]\s*(\d+(?:,\d+|\.\d+)*)/);
      const toNum = (s: string) => parseFloat(s.replace(/,/g, ''));
      if (m) return { original: toNum(m[1]), next: toNum(m[2]) };
      return { original: 280, next: 350 };
    }
  } catch {}
  return {};
}

function stripTrailingZeros(n: number): string {
  return Number.isInteger(n) ? String(n) : parseFloat(n.toFixed(2)).toString();
}
