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

export function getSteps(operation: PercentOperation, language: string, params: any): StepResult {
  switch (operation) {
    case 'interpret':
      return interpretPercent(language, params);
    case 'percent_of_total':
      return percentOfTotal(language, params);
    case 'ratio_to_percent':
      return ratioToPercent(language, params);
    case 'percent_change':
      return percentChange(language, params);
    default:
      return interpretPercent(language, params);
  }
}

function interpretPercent(language: string, params: { percent: number; base: number }): StepResult {
  const { percent, base } = params || { percent: 5, base: 100 };
  const answer = (percent / 100) * base;
  const map: Record<string, StepResult> = {
    en: {
      title: 'Interpreting Percentages Example',
      steps: [
        { step: 'Step 1:', equation: `Find ${percent}% of ₹${base}`, explanation: 'We want the amount corresponding to the given percent of the total.' },
        { step: 'Step 2:', equation: `${percent}% = ${percent}/100`, explanation: 'Percent means per hundred, so replace % with /100.' },
        { step: 'Step 3:', equation: `Quantity = (${percent}/100) × ${base}`, explanation: 'Multiply the fraction by the total to get the actual amount.' },
        { step: 'Step 4:', equation: `= (${percent} × ${base})/100 = ${stripTrailingZeros(answer)}`, explanation: 'Simplify the expression.' },
        { step: 'Step 5:', equation: `Answer: ₹${stripTrailingZeros(answer)} ✓`, explanation: `Interpretation: ${percent} out of every 100 rupees equals ₹${stripTrailingZeros(answer)} when the total is ₹${base}.` }
      ]
    },
    hi: {
      title: 'प्रतिशत की व्याख्या का उदाहरण',
      steps: [
        { step: 'चरण 1:', equation: `₹${base} का ${percent}% निकालें`, explanation: 'हमें कुल राशि का दिए गए प्रतिशत का मान निकालना है।' },
        { step: 'चरण 2:', equation: `${percent}% = ${percent}/100`, explanation: 'प्रतिशत का अर्थ है प्रति सौ, इसलिए % को /100 से बदलें।' },
        { step: 'चरण 3:', equation: `मात्रा = (${percent}/100) × ${base}`, explanation: 'वास्तविक राशि पाने के लिए भिन्न को कुल राशि से गुणा करें।' },
        { step: 'चरण 4:', equation: `= (${percent} × ${base})/100 = ${stripTrailingZeros(answer)}`, explanation: 'गणना करके सरल करें।' },
        { step: 'चरण 5:', equation: `उत्तर: ₹${stripTrailingZeros(answer)} ✓`, explanation: `अर्थ: हर 100 में ${percent} का मतलब ₹${stripTrailingZeros(answer)} होता है।` }
      ]
    },
    gu: {
      title: 'ટકાવારીની વ્યાખ્યા ઉદાહરણ',
      steps: [
        { step: 'પગલું 1:', equation: `₹${base} નું ${percent}% શોધો`, explanation: 'કુલ રકમના આપેલા ટકાનો મૂલ્ય શોધવો છે.' },
        { step: 'પગલું 2:', equation: `${percent}% = ${percent}/100`, explanation: 'ટકા એટલે પ્રતિ સો, એટલે % ને /100 થી બદલો.' },
        { step: 'પગલું 3:', equation: `પરિમાણ = (${percent}/100) × ${base}`, explanation: 'વાસ્તવિક રકમ મેળવવા માટે અપૂર્ણાંકને કુલ સાથે ગુણો.' },
        { step: 'પગલું 4:', equation: `= (${percent} × ${base})/100 = ${stripTrailingZeros(answer)}`, explanation: 'ગણતરી કરીને સરળ કરો.' },
        { step: 'પગલું 5:', equation: `જવાબ: ₹${stripTrailingZeros(answer)} ✓`, explanation: `અર્થ: દરેક 100 માંથી ${percent} એટલે ₹${stripTrailingZeros(answer)} થાય છે જ્યારે કુલ ₹${base} હોય.` }
      ]
    }
  };
  return map[language] || map['en'];
}

function percentOfTotal(language: string, params: { percent: number; total: number }): StepResult {
  const { percent, total } = params || { percent: 25, total: 40 };
  const answer = (percent / 100) * total;
  const map: Record<string, StepResult> = {
    en: {
      title: 'Converting Percentages to "How Many" Example',
      steps: [
        { step: 'Step 1:', equation: `Find ${percent}% of ${total}`, explanation: 'We want the quantity that corresponds to the given percent of the total.' },
        { step: 'Step 2:', equation: `${percent}% = ${percent}/100`, explanation: 'Percent means per hundred, so replace % with /100.' },
        { step: 'Step 3:', equation: `Quantity = (${percent}/100) × ${total}`, explanation: 'Multiply the fraction by the total to get the actual number.' },
        { step: 'Step 4:', equation: `= (${percent} × ${total})/100 = ${stripTrailingZeros(answer)}`, explanation: 'Compute and simplify to find the result.' },
        { step: 'Step 5:', equation: `Answer: ${stripTrailingZeros(answer)} ✓`, explanation: `Interpretation: ${percent} out of every 100 equals ${stripTrailingZeros(answer)} out of ${total}.` }
      ]
    },
    hi: {
      title: 'प्रतिशत को "कितने" में बदलने का उदाहरण',
      steps: [
        { step: 'चरण 1:', equation: `${total} का ${percent}% निकालें`, explanation: 'हमें कुल का दिए गए प्रतिशत का मान निकालना है।' },
        { step: 'चरण 2:', equation: `${percent}% = ${percent}/100`, explanation: 'प्रतिशत का अर्थ है प्रति सौ, इसलिए % को /100 से बदलें।' },
        { step: 'चरण 3:', equation: `मात्रा = (${percent}/100) × ${total}`, explanation: 'वास्तविक संख्या पाने के लिए भिन्न को कुल से गुणा करें।' },
        { step: 'चरण 4:', equation: `= (${percent} × ${total})/100 = ${stripTrailingZeros(answer)}`, explanation: 'गणना करके सरल करें।' },
        { step: 'चरण 5:', equation: `उत्तर: ${stripTrailingZeros(answer)} ✓`, explanation: `अर्थ: हर 100 में ${percent}, तो ${total} में ${stripTrailingZeros(answer)}।` }
      ]
    },
    gu: {
      title: 'ટકાવારીને "કેટલા" માં રૂપાંતર ઉદાહરણ',
      steps: [
        { step: 'પગલું 1:', equation: `${total} નું ${percent}% શોધો`, explanation: 'કુલ માંથી આપેલા ટકાનો અર્થ કેટલો થાય તે શોધવું.' },
        { step: 'પગલું 2:', equation: `${percent}% = ${percent}/100`, explanation: 'ટકા એટલે પ્રતિ સો.' },
        { step: 'પગલું 3:', equation: `પરિમાણ = (${percent}/100) × ${total}`, explanation: 'અપૂર્ણાંકને કુલ સાથે ગુણો.' },
        { step: 'પગલું 4:', equation: `= (${percent} × ${total})/100 = ${stripTrailingZeros(answer)}`, explanation: 'ગણતરી કરીને સરળ કરો.' },
        { step: 'પગલું 5:', equation: `જવાબ: ${stripTrailingZeros(answer)} ✓`, explanation: `અર્થ: દરેક 100 માંથી ${percent}, તો ${total} માં ${stripTrailingZeros(answer)}.` }
      ]
    }
  };
  return map[language] || map['en'];
}

function ratioToPercent(language: string, params: { a: number; b: number }): StepResult {
  const { a, b } = params || { a: 2, b: 1 };
  const total = a + b;
  const fraction = a / total;
  const percent = fraction * 100;
  const approx = stripTrailingZeros(percent);
  const map: Record<string, StepResult> = {
    en: {
      title: 'Ratio to Percentage Example',
      steps: [
        { step: 'Step 1:', equation: `Interpret ${a}:${b} as parts of a whole`, explanation: `Total parts = ${a} + ${b} = ${total}, share = ${a}/${total}.` },
        { step: 'Step 2:', equation: `Convert to percent: (${a}/${total}) × 100%`, explanation: 'Multiply the fraction by 100 to express as a percentage.' },
        { step: 'Step 3:', equation: `= ${a} × 100 ÷ ${total} ≈ ${approx}%`, explanation: `Compute the value; ${a}/${total} × 100 ≈ ${approx}%.` },
        { step: 'Step 4:', equation: `Answer: ≈ ${approx}% ✓`, explanation: `Thus, the ratio ${a}:${b} corresponds to about ${approx}%.` },
        { step: 'Step 5:', equation: `${a}:${b} = ${a}/${total} × 100% ≈ ${approx}%`, explanation: 'Summary of the conversion.' }
      ]
    },
    hi: {
      title: 'अनुपात → प्रतिशत उदाहरण',
      steps: [
        { step: 'चरण 1:', equation: `${a}:${b} को पूरे के हिस्सों के रूप में समझें`, explanation: `कुल भाग = ${a} + ${b} = ${total}, हिस्सा = ${a}/${total}.` },
        { step: 'चरण 2:', equation: `प्रतिशत में बदलें: (${a}/${total}) × 100%`, explanation: 'प्रतिशत पाने के लिए 100 से गुणा करें।' },
        { step: 'चरण 3:', equation: `= ${a} × 100 ÷ ${total} ≈ ${approx}%`, explanation: `मान निकालें; ${a}/${total} का 100 ≈ ${approx}% है।` },
        { step: 'चरण 4:', equation: `उत्तर: ≈ ${approx}% ✓`, explanation: `अतः अनुपात ${a}:${b} लगभग ${approx}% है।` },
        { step: 'चरण 5:', equation: `${a}:${b} = ${a}/${total} × 100% ≈ ${approx}%`, explanation: 'परिवर्तन का सारांश।' }
      ]
    },
    gu: {
      title: 'અનુપાત → ટકાવારી ઉદાહરણ',
      steps: [
        { step: 'પગલું 1:', equation: `${a}:${b} ને સમગ્રના ભાગ તરીકે સમજો`, explanation: `કુલ ભાગ = ${a} + ${b} = ${total}, હિસ્સો = ${a}/${total}.` },
        { step: 'પગલું 2:', equation: `ટકાવારીમાં બદલો: (${a}/${total}) × 100%`, explanation: 'ટકામાં દર્શાવવા 100 થી ગુણ કરો.' },
        { step: 'પગલું 3:', equation: `= ${a} × 100 ÷ ${total} ≈ ${approx}%`, explanation: `મૂલ્ય ગણો; ${a}/${total} × 100 ≈ ${approx}%.` },
        { step: 'પગલું 4:', equation: `જવાબ: ≈ ${approx}% ✓`, explanation: `અટલે અનુપાત ${a}:${b} આશરે ${approx}% છે.` },
        { step: 'પગલું 5:', equation: `${a}:${b} = ${a}/${total} × 100% ≈ ${approx}%`, explanation: 'રૂપાંતરના સારાંશ.' }
      ]
    }
  };
  return map[language] || map['en'];
}

function percentChange(language: string, params: { original: number; next: number }): StepResult {
  const { original, next } = params || { original: 280, next: 350 };
  const change = next - original;
  const percent = (change / original) * 100;
  const approx = stripTrailingZeros(percent);
  const changeWord = percent >= 0 ? 'increase' : 'decrease';
  const map: Record<string, StepResult> = {
    en: {
      title: 'Percentage Change Example',
      steps: [
        { step: 'Step 1:', equation: 'Identify original and new values', explanation: `Original = ${original}, New = ${next}.` },
        { step: 'Step 2:', equation: `Find change: New − Original = ${next} − ${original} = ${stripTrailingZeros(change)}` , explanation: 'Change measures how much it changed.' },
        { step: 'Step 3:', equation: 'Percent change = (Change / Original) × 100%', explanation: 'Use the percentage change formula.' },
        { step: 'Step 4:', equation: `Substitute: (${stripTrailingZeros(change)}/${original}) × 100% = ${approx}%`, explanation: 'Compute the fraction and multiply by 100.' },
        { step: 'Step 5:', equation: `Answer: ${approx}% ✓`, explanation: `${original} to ${next} is a ${approx}% ${changeWord}.` }
      ]
    },
    hi: {
      title: 'प्रतिशत परिवर्तन (Percentage Change) उदाहरण',
      steps: [
        { step: 'चरण 1:', equation: 'मूल्य पहचानें', explanation: `मूल = ${original}, नया = ${next}.` },
        { step: 'चरण 2:', equation: `परिवर्तन = नया − मूल = ${next} − ${original} = ${stripTrailingZeros(change)}`, explanation: 'यह परिवर्तन की मात्रा है।' },
        { step: 'चरण 3:', equation: 'प्रतिशत परिवर्तन = (Change / मूल) × 100%', explanation: 'प्रतिशत परिवर्तन का सूत्र।' },
        { step: 'चरण 4:', equation: `स्थानापन्न: (${stripTrailingZeros(change)}/${original}) × 100% = ${approx}%`, explanation: 'भिन्न को 100 से गुणा करें।' },
        { step: 'चरण 5:', equation: `उत्तर: ${approx}% ✓`, explanation: `${original} से ${next} तक का परिवर्तन ${approx}% ${percent >= 0 ? 'वृद्धि' : 'कमी'} है।` }
      ]
    },
    gu: {
      title: 'ટકાવારી ફેરફાર ઉદાહરણ',
      steps: [
        { step: 'પગલું 1:', equation: 'મૂલ અને નવું મૂલ્ય ઓળખો', explanation: `મૂલ = ${original}, નવું = ${next}.` },
        { step: 'પગલું 2:', equation: `ફેરફાર = નવું − મૂળ = ${next} − ${original} = ${stripTrailingZeros(change)}`, explanation: 'આ ફેરફારનું પરિમાણ છે.' },
        { step: 'પગલું 3:', equation: '% ફેરફાર = (Change / મૂળ) × 100%', explanation: 'ટકાવારી ફેરફારનું સૂત્ર.' },
        { step: 'પગલું 4:', equation: `સ્થાનાપન્ન: (${stripTrailingZeros(change)}/${original}) × 100% = ${approx}%`, explanation: 'અંશને 100 થી ગુણ કરો.' },
        { step: 'પગલું 5:', equation: `જવાબ: ${approx}% ✓`, explanation: `${original} થી ${next} સુધીનો ફેરફાર ${approx}% ${percent >= 0 ? 'વધારો' : 'ઘટાડો'} છે.` }
      ]
    }
  };
  return map[language] || map['en'];
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
