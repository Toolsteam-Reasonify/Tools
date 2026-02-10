import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FractionAdditionVisual } from '../features/Multiplication/Shared/FractionAddition';
import { GridFractionAddition } from '../features/Multiplication/Shared/GridFractionAddition';
import { CircleMultiplyVisual } from '../features/Multiplication/Shared/CircleMultiplyVisual';

type Language = 'en' | 'hi' | 'gu';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Reuse structure/keys but adapt appTitle and some labels for Multiplication content
const translations: Record<Language, Record<string, string>> = {
  en: {
    appTitle: 'Multiplication of Fractions',
    selectLanguage: 'Select Language',
    learn: 'Learn',
    practice: 'Practice',
    realWorld: 'Real World',
    next: 'Next',
    previous: 'Previous',
    submit: 'Submit',
    tryAgain: 'Try Again',
    showHint: 'Show Hint',
    hideHint: 'Hide Hint',
    showSolution: 'Show Solution',
    hideSolution: 'Hide Solution',
    yourAnswer: 'Your Answer',
    correct: 'Correct!',
    incorrect: 'Incorrect. Try again!',
    score: 'Score',
    attempts: 'Attempts',
    solution: 'Solution',
    step1Title: 'Multiply Fraction by Whole Number',
    step2Title: 'Multiply Proper/Improper Fractions',
    step3Title: 'Practice with Visual Models',
    step4Title: 'Word Problems and Applications',
    step1Desc: 'Understand repeated addition and area models',
    step2Desc: 'Multiply numerators and denominators; simplify',
    step3Desc: 'Use shapes to reason about products',
    step4Desc: 'Apply multiplication of fractions to situations',
    pause: '⏸️ Pause',
    play: '▶️ Play',
    expand: 'Click to expand',
    collapse: 'Click to collapse',
    examplesSubtitle: 'Examples using multiplication of fractions',
    questionLabel: 'Question',
    attemptLabel: 'attempt(s)',
    placeholderAnswer: 'Type your answer... ✍️',
    answerLabel: 'Answer',
    viewAssessment: 'View Assessment',
    practiceTitle: 'Practice Questions',
    practiceSubtitle: 'Check your understanding of multiplying fractions',
    questionProgress: 'Question',
    of: 'of',
    practiceComplete: 'Practice Complete!',
    practiceCompleteSubtitle: 'You have finished all exercises!',
    yourScore: 'Your Score',
    accuracy: 'Accuracy',
    performance: 'Performance',
    totalAttempts: 'Total Attempts',
    exerciseBreakdown: 'Exercise Breakdown',
    practiceAgain: '🔄 Practice Again',

    // Real world + info
    ex1Title: 'Recipe scaling',
    ex1Context: 'Multiply ingredients by a fraction to make half or double a recipe.',
    ex1Formula: '1/2 × 3 cups sugar = 1 1/2 cups',
    ex2Title: 'Construction',
    ex2Context: 'Find area by multiplying fractional lengths (m) and breadths (m).',
    ex2Formula: '3/4 m × 2/5 m = 3/10 m²',
    ex3Title: 'Study time',
    ex3Context: 'If you study 3/4 of an hour daily for 5 days, total time is:',
    ex3Formula: '5 × 3/4 h = 15/4 h = 3 h 45 m',
    ex4Title: 'Discounts',
    ex4Context: 'Price after 3/5 discount means pay 2/5 of the price.',
    ex4Formula: '2/5 × ₹1000 = ₹400',
    ex5Title: 'Maps & scale',
    ex5Context: 'On a map with scale 1/100000, 3/5 cm represents real distance:',
    ex5Formula: '3/5 × 100000 cm = 60000 cm = 0.6 km',
    ex6Title: 'Fuel usage',
    ex6Context: 'A car uses 3/8 of a tank each day for 4 days. Total used:',
    ex6Formula: '4 × 3/8 = 12/8 = 3/2 tanks',
    whyTitle: 'Why multiplying fractions matters?',
    whyP1: 'Scaling quantities precisely (half, one third, three fourths of anything).',
    whyP2: 'Finding areas of rectangles with fractional sides (l × b).',
    whyP3: 'Adjusting recipes and mixtures by any fractional amount.',
    whyP4: 'Discounts and taxes expressed as fractions of price.',
    whyP5: 'Time calculations (e.g., 3/4 hour per day for several days).',
    proTipTitle: 'Pro Tip!',
    proTipShort: '🧠 Multiply tops and bottoms, cancel common factors first, then simplify to lowest terms or a mixed number.',
    
    // Fraction Addition Section
    fractionAdditionTitle: 'Multiplication of a Fraction by a Whole Number',
    fractionAdditionSubtitle: 'Visualize fraction multiplication as repeated addition',
    fractionAdditionExample: '1/4 + 1/4 = 2×1/4',
    fractionAdditionExplanation: 'When denominators are the same, add the numerators and keep the denominator unchanged.',
    fractionAdditionVisual: 'Two quarters make a half',
    gridTitle: 'Grid Models for Fraction Addition',
    gridSubtitle: 'Visualize fraction addition using grid models',
    step2Guide1: 'Convert to improper fractions if needed.',
    step2Guide2: 'Cancel common factors across numerator and denominator.',
    step2Guide3: 'Multiply numerators and multiply denominators.',
    step2Guide4: 'Simplify the fraction to lowest terms.',
    step2Guide5: 'If improper, convert to a mixed number.',
    step3Intro: 'Shade with circle sectors to see the overlapping part as the product.',
    step3Guide1: 'Draw guides for each denominator.',
    step3Guide2: 'Shade the first fraction in blue and the second in purple.',
    step3Guide3: 'The overlapped green region represents the product.',
    step3Guide4: 'Read and simplify the resulting fraction.',
    step3Guide5: 'Use visual models to understand fraction relationships.',
    step3Guide6: 'Practice with different fraction combinations for mastery.',
    gridHint: 'Grid models help visualize how fractions with the same denominator combine!',
    interactiveVisual: 'Interactive Visual',
  },
  hi: {
    appTitle: 'भिन्नों का गुणा',
    selectLanguage: 'भाषा चुनें',
    learn: 'सीखें',
    practice: 'अभ्यास',
    realWorld: 'वास्तविक दुनिया',
    next: 'अगला',
    previous: 'पिछला',
    submit: 'जमा करें',
    tryAgain: 'पुनः प्रयास करें',
    showHint: 'संकेत दिखाएं',
    hideHint: 'संकेत छिपाएं',
    showSolution: 'समाधान दिखाएं',
    hideSolution: 'समाधान छिपाएं',
    yourAnswer: 'आपका उत्तर',
    correct: 'सही!',
    incorrect: 'गलत, पुनः प्रयास करें!',
    score: 'अंक',
    attempts: 'प्रयास',
    solution: 'समाधान',
    step1Title: 'भिन्न × पूर्ण संख्या',
    step2Title: 'भिन्न × भिन्न',
    step3Title: 'चित्रों से अभ्यास',
    step4Title: 'शब्द समस्याएँ',
    step1Desc: 'दोहराव योग और क्षेत्र मॉडल',
    step2Desc: 'अंशों/हरों का गुणा और सरल करना',
    step3Desc: 'आकृतियों से गुणन समझें',
    step4Desc: 'वास्तविक जीवन में उपयोग',
    pause: '⏸️ रोकें',
    play: '▶️ चलाएँ',
    expand: 'विस्तार करें',
    collapse: 'संकुचित करें',
    examplesSubtitle: 'भिन्नों के गुणन के उपयोग के उदाहरण',
    questionLabel: 'प्रश्न',
    attemptLabel: 'प्रयास',
    placeholderAnswer: 'अपना उत्तर लिखें... ✍️',
    answerLabel: 'उत्तर',
    viewAssessment: 'मूल्यांकन देखें',
    practiceTitle: 'अभ्यास प्रश्न',
    practiceSubtitle: 'भिन्नों के गुणन की समझ जाँचें',
    questionProgress: 'प्रश्न',
    of: 'का',
    practiceComplete: 'अभ्यास पूर्ण!',
    practiceCompleteSubtitle: 'आपने सभी अभ्यास पूरे कर लिए हैं!',
    yourScore: 'आपका स्कोर',
    accuracy: 'सटीकता',
    performance: 'प्रदर्शन',
    totalAttempts: 'कुल प्रयास',
    exerciseBreakdown: 'अभ्यास विवरण',
    practiceAgain: '🔄 फिर से अभ्यास करें',

    // Real world + info
    ex1Title: 'रेसिपी स्केलिंग',
    ex1Context: 'किसी रेसिपी को आधा/दोगुना करने के लिए सामग्री को भिन्न से गुणा करें।',
    ex1Formula: '1/2 × 3 कप चीनी = 1 1/2 कप',
    ex2Title: 'निर्माण',
    ex2Context: 'लंबाई और चौड़ाई भिन्न होने पर क्षेत्रफल निकालें।',
    ex2Formula: '3/4 m × 2/5 m = 3/10 m²',
    ex3Title: 'अध्ययन समय',
    ex3Context: 'यदि आप 5 दिनों तक रोज़ 3/4 घंटा पढ़ते हैं, कुल समय:',
    ex3Formula: '5 × 3/4 h = 15/4 h = 3 h 45 m',
    ex4Title: 'छूट',
    ex4Context: '3/5 छूट के बाद आपको मूल्य का 2/5 देना होगा।',
    ex4Formula: '2/5 × ₹1000 = ₹400',
    ex5Title: 'मानचित्र और स्केल',
    ex5Context: '1/100000 स्केल वाले मानचित्र पर 3/5 सेमी वास्तविक दूरी दर्शाता है:',
    ex5Formula: '3/5 × 100000 सेमी = 60000 सेमी = 0.6 किमी',
    ex6Title: 'ईंधन उपयोग',
    ex6Context: 'कार रोज 3/8 टैंक 4 दिनों तक उपयोग करती है। कुल उपयोग:',
    ex6Formula: '4 × 3/8 = 12/8 = 3/2 टैंक',
    whyTitle: 'भिन्नों के गुणन का महत्व',
    whyP1: 'मात्राओं को ठीक-ठीक स्केल करना (आधा, तिहाई, तीन-चौथाई)।',
    whyP2: 'भिन्नात्मक भुजाओं वाले आयतों का क्षेत्रफल (l × b)।',
    whyP3: 'रेसिपी/मिश्रण को किसी भी भिन्न मात्रा से समायोजित करना।',
    whyP4: 'छूट और कर, मूल्य के भिन्न के रूप में।',
    whyP5: 'समय गणना (जैसे कई दिनों के लिए रोज 3/4 घंटा)।',
    proTipTitle: 'विशेषज्ञ सुझाव!',
    proTipShort: '🧠 अंश/हर को गुणा करें, पहले समान गुणक काटें, फिर निम्नतम रूप या मिश्रित भिन्न में सरल करें।',
    
    // Fraction Addition Section
    fractionAdditionTitle: 'समान हर वाले भिन्नों का जोड़',
    fractionAdditionSubtitle: 'भिन्न जोड़ को समान भागों के मिलाने के रूप में देखें',
    fractionAdditionExample: '1/4 + 1/4 = 2/4',
    fractionAdditionExplanation: 'जब हर समान हों, तो अंशों को जोड़ें और हर को वही रखें।',
    fractionAdditionVisual: 'दो चौथाई मिलकर आधा बनाते हैं',
    gridTitle: 'ग्रिड मॉडल से भिन्नों का जोड़',
    gridSubtitle: 'ग्रिड की मदद से भिन्न जोड़ का दृष्य',
    step2Guide1: 'ज़रूरत हो तो मिश्रित भिन्न को अशुद्ध भिन्न में बदलें।',
    step2Guide2: 'अंश और हर के समान गुणकों को काटें।',
    step2Guide3: 'अंशों का गुणा करें और हरों का गुणा करें।',
    step2Guide4: 'प्राप्त भिन्न को निम्नतम रूप में सरल करें।',
    step2Guide5: 'यदि अशुद्ध भिन्न हो तो मिश्रित भिन्न में बदलें।',
    step3Intro: 'वृत्त के भागों को शेड करें; ओवरलैप क्षेत्र गुणनफल है।',
    step3Guide1: 'हर के अनुसार गाइड रेखाएँ बनाएं।',
    step3Guide2: 'पहले भिन्न को नीला और दूसरे को बैंगनी शेड करें।',
    step3Guide3: 'ओवरलैप किया हरा भाग गुणनफल दर्शाता है।',
    step3Guide4: 'भिन्न पढ़ें और सरल करें।',
    step3Guide5: 'भिन्न संबंधों को समझने के लिए दृश्य मॉडल का उपयोग करें।',
    step3Guide6: 'निपुणता के लिए विभिन्न भिन्न संयोजनों के साथ अभ्यास करें।',
    gridHint: 'ग्रिड मॉडल समान हर वाले भिन्नों के मिलाने को समझने में मदद करते हैं!',
    interactiveVisual: 'इंटरैक्टिव विज़ुअल',
  },
  gu: {
    appTitle: 'અણુનો ગુણાકાર',
    selectLanguage: 'ભાષા પસંદ કરો',
    learn: 'શીખો',
    practice: 'પ્રેક્ટિસ',
    realWorld: 'વાસ્તવિક દુનિયા',
    next: 'આગળ',
    previous: 'પાછળ',
    submit: 'સબમિટ',
    tryAgain: 'ફરી પ્રયાસ કરો',
    showHint: 'સંકેત બતાવો',
    hideHint: 'સંકેત છુપાવો',
    showSolution: 'ઉકેલ બતાવો',
    hideSolution: 'ઉકેલ છુપાવો',
    yourAnswer: 'તમારો જવાબ',
    correct: 'સાચું!',
    incorrect: 'ખોટું, ફરી પ્રયાસ કરો!',
    score: 'સ્કોર',
    attempts: 'પ્રયાસો',
    solution: 'ઉકેલ',
    step1Title: 'અણુ × પૂર્ણ સંખ્યા',
    step2Title: 'અણુ × અણુ',
    step3Title: 'ચિત્રોથી પ્રેક્ટિસ',
    step4Title: 'શબ્દ સમસ્યાઓ',
    step1Desc: 'પૂનરાવર્તિત વધારણ અને વિસ્તાર મોડલ',
    step2Desc: 'આંશ/હરના ગુણાકાર અને સરળીકરણ',
    step3Desc: 'આકારોથી ગુણાકાર સમજવો',
    step4Desc: 'વાસ્તવિક જીવનમાં ઉપયોગ',
    pause: '⏸️ રોકો',
    play: '▶️ ચલાવો',
    expand: 'વિસ્તૃત કરો',
    collapse: 'સંકુચિત કરો',
    examplesSubtitle: 'અણુના ગુણાકારના ઉપયોગના ઉદાહરણો',
    questionLabel: 'પ્રશ્ન',
    attemptLabel: 'પ્રયાસ',
    placeholderAnswer: 'તમારો જવાબ લખો... ✍️',
    answerLabel: 'જવાબ',
    viewAssessment: 'મૂલ્યાંકન જુઓ',
    practiceTitle: 'પ્રેક્ટિસ પ્રશ્નો',
    practiceSubtitle: 'અણુના ગુણાકારની સમજ ચકાસો',
    questionProgress: 'પ્રશ્ન',
    of: 'નો',
    practiceComplete: 'પ્રેક્ટિસ પૂર્ણ!',
    practiceCompleteSubtitle: 'તમે બધા અભ્યાસ પૂરાં કર્યા!',
    yourScore: 'તમારો સ્કોર',
    accuracy: 'ચોકસાઈ',
    performance: 'પ્રદર્શન',
    totalAttempts: 'કુલ પ્રયાસો',
    exerciseBreakdown: 'અભ્યાસ વિગતો',
    practiceAgain: '🔄 ફરીથી પ્રેક્ટિસ કરો',

    // Real world + info
    ex1Title: 'રસોઈ સ્કેલિંગ',
    ex1Context: 'રેસીપીને અડધી/બમણી કરવા ઘટકોને ભિન્નથી ગુણાકાર કરો.',
    ex1Formula: '1/2 × 3 કપ ખાંડ = 1 1/2 કપ',
    ex2Title: 'બાંધકામ',
    ex2Context: 'લંબાઈ અને પહોળાઈ ભિન્ન હોય ત્યારે ક્ષેત્રફળ કાઢો.',
    ex2Formula: '3/4 m × 2/5 m = 3/10 m²',
    ex3Title: 'અભ્યાસ સમય',
    ex3Context: 'જો તમે 5 દિવસ સુધી દરરોજ 3/4 કલાક અભ્યાસ કરો, કુલ સમય:',
    ex3Formula: '5 × 3/4 h = 15/4 h = 3 h 45 m',
    ex4Title: 'ડિસ્કાઉન્ટ',
    ex4Context: '3/5 ડિસ્કાઉન્ટ બાદ કિંમતનું 2/5 ચૂકવવું પડે.',
    ex4Formula: '2/5 × ₹1000 = ₹400',
    ex5Title: 'નકશો અને સ્કેલ',
    ex5Context: '1/100000 સ્કેલના નકશા પર 3/5 સેમી વાસ્તવિક અંતર દર્શાવે છે:',
    ex5Formula: '3/5 × 100000 સે.મી. = 60000 સે.મી. = 0.6 કિ.મી.',
    ex6Title: 'ઇંધણ ઉપયોગ',
    ex6Context: 'કાર દરરોજ 3/8 ટાંકી 4 દિવસ માટે વાપરે છે. કુલ ઉપયોગ:',
    ex6Formula: '4 × 3/8 = 12/8 = 3/2 ટાંકી',
    whyTitle: 'ભિન્નોના ગુણાકાર શા માટે જરૂરી?',
    whyP1: 'માત્રાઓને ચોક્કસ પ્રમાણમાં સ્કેલ કરવી (અડધી, ત્રિજ, ત્રણ-ચોથી).',
    whyP2: 'ભિન્ન બાજુઓવાળા આયતનું ક્ષેત્રફળ (l × b).',
    whyP3: 'રસોઈ/મિશ્રણને કોઈપણ ભિન્ન માત્રાથી એડજસ્ટ કરવું.',
    whyP4: 'ડિસ્કાઉન્ટ અને કર કિંમતના ભિન્નરૂપે.',
    whyP5: 'સમય ગણતરી (દિવસો સુધી દરરોજ 3/4 કલાક).',
    proTipTitle: 'પ્રો ટિપ!',
    proTipShort: '🧠 ઉપર/નીચે ગુણાકાર કરો, પહેલા સમાન ગુણકો કાપો, પછી લોવીસ્ટ ટર્મ અથવા મિક્ષડમાં સરળ કરો.',
    
    // Fraction Addition Section
    fractionAdditionTitle: 'સમાન છેદવાળા અણુનો સરવાળો',
    fractionAdditionSubtitle: 'અણુના સરવાળાને સમાન ભાગોને જોડવા તરીકે કલ્પો',
    fractionAdditionExample: '1/4 + 1/4 = 2/4',
    fractionAdditionExplanation: 'જ્યારે છેદ સમાન હોય, તો અંશોને ઉમેરો અને છેદને તેવો જ રાખો.',
    fractionAdditionVisual: 'બે ચોથાઈ મળીને અડધો બને છે',
    gridTitle: 'ગ્રિડ મોડેલથી અણુ ઉમેરો',
    gridSubtitle: 'ગ્રિડ દ્વારા અણુ ઉમેરવાનું દૃશ્યીકરણ',
    step2Guide1: 'જરૂર પડે તો મિક્સ્ડને ઇમ્પ્રોપર અણુમાં બદલો.',
    step2Guide2: 'આંશ/હરનાં સામાન્ય ગુણકો કાપો.',
    step2Guide3: 'આંશોનું ગુણાકાર અને હરોનું ગુણાકાર કરો.',
    step2Guide4: 'પરિણામને લોવીસ્ટ ટર્મમાં સરળ કરો.',
    step2Guide5: 'જો ઇમ્પ્રોપર હોય તો મિક્ષડમાં બદલો.',
    step3Intro: 'વર્તુળ ભાગોને શેડ કરો; ઓવરલૅપ વિસ્તાર ગુણાકાર છે.',
    step3Guide1: 'દર હિસાબે માર્ગદર્શિકા રેખાઓ દોરો.',
    step3Guide2: 'પહેલો અણુ વાદળી અને બીજો જાંબલી રંગે શેડ કરો.',
    step3Guide3: 'ઓવરલૅપ કરાયેલો લીલો ભાગ ગુણાકાર દર્શાવે છે.',
    step3Guide4: 'અણુ વાંચો અને સરળ કરો.',
    step3Guide5: 'અણુ સંબંધો સમજવા માટે દૃશ્ય મોડેલનો ઉપયોગ કરો.',
    step3Guide6: 'નિપુણતા માટે વિવિધ અણુ સંયોજનો સાથે અભ્યાસ કરો.',
    gridHint: 'ગ્રિડ મોડેલો સમાન છેદવાળા અણુઓ કેવી રીતે જોડાય છે તે બતાવે છે!',
    interactiveVisual: 'ઇન્ટરેક્ટિવ વિઝ્યુઅલ',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] ?? translations.en[key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// DemonstrationMode Component
function AnimatedText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [words, setWords] = useState<string[]>([]);

  useEffect(() => {
    setWords(text.split(' '));
  }, [text]);

  return (
    <span className="word-animate">
      {words.map((w, i) => (
        <span key={i} className={`delay-${(i % 10) + 1}`} style={{ animationDelay: `${delay + i * 80}ms` }}>
          {w}{' '}
        </span>
      ))}
    </span>
  );
}

export default function DemonstrationMode() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const steps = [
    { id: 0, title: t('fractionAdditionTitle'), desc: t('fractionAdditionSubtitle') },
    { id: 1, title: t('gridTitle'), desc: t('gridSubtitle') },
    { id: 2, title: t('step2Title'), desc: t('step2Desc') },
    { id: 3, title: t('step3Title'), desc: t('step3Desc') },
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
      else setIsPlaying(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps.length]);

  const renderPanel = (title: string, description: string, content: React.ReactNode) => (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-blue-200">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-5xl">✖️</span>
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {title}
          </h3>
        </div>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed">
          <AnimatedText text={description} />
        </p>
      </div>
      <div className="relative bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-purple-200 overflow-hidden">
        <div className="bg-white/90 rounded-2xl p-4 shadow-xl flex items-center justify-center">
          {content}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">✖️ {t('appTitle')} - {currentStep + 1}/{steps.length}</h2>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-6 md:p-8">
        {currentStep === 0 && (
          <FractionAdditionVisual />
        )}
        {currentStep === 1 && (
          <GridFractionAddition />
        )}
        {currentStep === 2 && (
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Left: step-wise guide */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-5xl">✖️</span>
                <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {t('step2Title')}
                </h3>
              </div>
              <div className="space-y-4 text-gray-800">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 border-l-4 border-blue-400">
                  <span className="shrink-0 text-xl">①</span>
                  <div><AnimatedText text={t('step2Guide1')} /></div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-purple-50 border-l-4 border-purple-400">
                  <span className="shrink-0 text-xl">②</span>
                  <div><AnimatedText text={t('step2Guide2')} /></div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-green-50 border-l-4 border-green-400">
                  <span className="shrink-0 text-xl">③</span>
                  <div><AnimatedText text={t('step2Guide3')} /></div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50 border-l-4 border-emerald-400">
                  <span className="shrink-0 text-xl">④</span>
                  <div><AnimatedText text={t('step2Guide4')} /></div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 border-l-4 border-amber-400">
                  <span className="shrink-0 text-xl">⑤</span>
                  <div><AnimatedText text={t('step2Guide5')} /></div>
                </div>
              </div>
            </div>
            {/* Right: bright circle visuals */}
            <div className="relative bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-purple-200 overflow-hidden">
              <div className="bg-white/90 rounded-2xl p-4 shadow-xl flex items-center justify-center">
                <div className="flex flex-col items-center gap-8">
                  <CircleMultiplyVisual
                    left={{ numerator: 1, denominator: 2, color: '#3b82f6' }}
                    right={{ numerator: 1, denominator: 3, color: '#8b5cf6' }}
                    product={{ numerator: 1, denominator: 6, color: '#10b981' }}
                    size={120}
                  />
                  <CircleMultiplyVisual
                    left={{ numerator: 1, denominator: 3, color: '#3b82f6' }}
                    right={{ numerator: 1, denominator: 2, color: '#8b5cf6' }}
                    product={{ numerator: 1, denominator: 6, color: '#10b981' }}
                    size={120}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        {currentStep === 3 && (
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Left: step-wise practice tips */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-5xl">✖️</span>
                <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {t('step3Title')}
                </h3>
              </div>
              <p className="text-gray-700 mb-4"><AnimatedText text={t('step3Intro')} /></p>
              <div className="space-y-4 text-gray-800">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 border-l-4 border-blue-400">
                  <span className="shrink-0 text-xl">①</span>
                  <div><AnimatedText text={t('step3Guide1')} /></div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-purple-50 border-l-4 border-purple-400">
                  <span className="shrink-0 text-xl">②</span>
                  <div><AnimatedText text={t('step3Guide2')} /></div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50 border-l-4 border-emerald-400">
                  <span className="shrink-0 text-xl">③</span>
                  <div><AnimatedText text={t('step3Guide3')} /></div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-cyan-50 border-l-4 border-cyan-400">
                  <span className="shrink-0 text-xl">④</span>
                  <div><AnimatedText text={t('step3Guide4')} /></div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-orange-50 border-l-4 border-orange-400">
                  <span className="shrink-0 text-xl">⑤</span>
                  <div><AnimatedText text={t('step3Guide5')} /></div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-red-50 border-l-4 border-red-400">
                  <span className="shrink-0 text-xl">⑥</span>
                  <div><AnimatedText text={t('step3Guide6')} /></div>
                </div>
              </div>
            </div>
            {/* Right: interactive visuals */}
            <div className="relative bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-purple-200 overflow-hidden">
              <div className="bg-white/90 rounded-2xl p-4 shadow-xl flex items-center justify-center">
                <div className="flex flex-col items-center gap-8">
                  <CircleMultiplyVisual
                    left={{ numerator: 2, denominator: 3, color: '#3b82f6' }}
                    right={{ numerator: 3, denominator: 5, color: '#8b5cf6' }}
                    product={{ numerator: 2, denominator: 5, color: '#10b981' }}
                    size={120}
                  />
                  <CircleMultiplyVisual
                    left={{ numerator: 3, denominator: 4, color: '#3b82f6' }}
                    right={{ numerator: 1, denominator: 2, color: '#8b5cf6' }}
                    product={{ numerator: 3, denominator: 8, color: '#10b981' }}
                    size={120}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Step 5 removed as requested */}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-6 bg-white rounded-xl shadow-lg border">
        <button
          onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
          disabled={currentStep === 0}
          className={`w-full sm:w-auto px-4 py-2 rounded-lg font-medium text-base transition-all duration-300 ${
            currentStep === 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 transform hover:scale-105'
          }`}
        >
          ← {t('previous')}
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-base transition-all duration-300 transform hover:scale-105 ${
            isPlaying
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl'
              : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 shadow-lg hover:shadow-xl'
          }`}
        >
          {isPlaying ? t('pause') : t('play')}
        </button>
        <button
          onClick={() => setCurrentStep(s => Math.min(steps.length - 1, s + 1))}
          disabled={currentStep === steps.length - 1}
          className={`w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-base transition-all duration-300 transform hover:scale-105 ${
            currentStep === steps.length - 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
          }`}
        >
          {t('next')} →
        </button>
      </div>
    </div>
  );
}
