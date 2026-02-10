import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Interfaces
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

// Language Context
type Language = 'en' | 'hi' | 'gu';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    appTitle: 'Division of Fractions',
    selectLanguage: 'Select Language',
    
    // Navigation
    learn: 'Learn',
    practice: 'Practice',
    realWorld: 'Real World',
    
    // Common
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
    
    // Learn Tab - Steps
    step1Title: 'Division of Whole Number by a Fraction',
    step1Desc: 'Learn how to divide whole numbers by fractions',
    step1Concept: 'When dividing a whole number by a fraction, multiply the whole number by the reciprocal of the fraction.',
    
    step2Title: 'Reciprocal of a Fraction',
    step2Desc: 'Understand what reciprocal means and how to find it',
    step2Concept: 'The reciprocal of a fraction is obtained by interchanging the numerator and denominator.',
    
    step3Title: 'Division of a Fraction by a Whole Number',
    step3Desc: 'Learn to divide fractions by whole numbers',
    step3Concept: 'When dividing a fraction by a whole number, multiply the fraction by the reciprocal of the whole number.',
    
    step4Title: 'Division of a Fraction by Another Fraction',
    step4Desc: 'Master dividing fractions by fractions',
    step4Concept: 'To divide fractions, multiply the first fraction by the reciprocal of the second fraction.',
    
    // Demonstration Mode specific translations
    divisionVisualTitle: 'Division of Whole Number by Fraction',
    exampleTitle: 'Example: 1 ÷ 1/2',
    halfPartsQuestion: 'How many half parts do you see?',
    halfPartsAnswer: 'There are two half parts.',
    divisionResult: 'So, 1 ÷ 1/2 = 2',
    multiplicationResult: 'Also, 1 × 2/1 = 1 × 2 = 2',
    divisionRule: 'Thus, 1 ÷ 1/2 = 1 × 2/1',
    reciprocalExamples: 'Examples:',
    reciprocalDefinition: 'The non-zero numbers whose product with each other is 1, are called the reciprocals of each other.',
    reciprocalExamplesText: 'So reciprocal of 5/9 is 9/5 and the reciprocal of 9/5 is 5/9',
    understandingReciprocals: 'Understanding Reciprocals',
    observeProducts: 'Observe these products:',
    fractionDivisionTitle: 'Fraction ÷ Whole Number',
    visualizingDivision: 'Visualizing 3/4 ÷ 3',
    eachCircleRepresents: 'Each circle represents 3/4 of a whole. When we divide by 3, we\'re asking how much each part gets.',
    divisionResult3: 'Result: 3/4 ÷ 3 = 1/4',
    whatWillBe: 'What will be 3/4 ÷ 3?',
    basedOnObservations: 'Based on our earlier observations we have:',
    moreExamples: 'More Examples',
    similarlyExample: 'Similarly, 8/5 ÷ 2/3 = 8/5 × reciprocal of 2/3 = ?',
    andExample: 'and, 1/2 ÷ 3/4 = ?',
    canNowFind: 'We can now find 1/3 ÷ 6/5',
    usingReciprocalMethod: 'Using the reciprocal method:',
    fractionByFractionTitle: 'Fraction ÷ Fraction',
    stepByStep: 'Step-by-step: 1/3 ÷ 6/5',
    rememberDivision: 'Remember: Division is multiplication by the reciprocal!',
    pauseButton: '⏸️ Pause',
    playButton: '▶️ Play',
    
    // Additional hardcoded text translations
    keyPoints: 'Key Points',
    exampleQuestion1: 'So, 2/3 ÷ 7 = 2/3 × 1/7 = ?',
    exampleQuestion2: 'What is 5/7 ÷ 6, 2/7 ÷ 8?',
    
    // Key Points
    keyPoint1: 'Find the reciprocal of the divisor',
    keyPoint2: 'Multiply dividend by reciprocal',
    keyPoint3: 'Simplify the result if possible',
    keyPoint4: 'Convert mixed numbers to improper fractions first',
    keyPoint5: 'Always check your answer by multiplying back',
    
    // Practice Mode
    practiceTitle: 'Practice Questions',
    practiceSubtitle: 'Check your understanding of dividing fractions',
    questionTitle: 'Question',
    hintLabel: 'Hint',
    solutionLabel: 'Solution',
    
    // Practice Questions from Exercise 2.3
    q1Question: 'Find: 12 ÷ 3/4',
    q1Hint: 'Multiply 12 by the reciprocal of 3/4',
    q1Solution: '12 ÷ 3/4 = 12 × 4/3 = 48/3 = 16',
    q1Answer: '16',
    
    q2Question: 'Find the reciprocal of 3/7',
    q2Hint: 'Interchange numerator and denominator',
    q2Solution: 'The reciprocal of 3/7 is 7/3',
    q2Answer: '7/3',
    
    q3Question: 'Find: 7/3 ÷ 2',
    q3Hint: 'Multiply 7/3 by the reciprocal of 2',
    q3Solution: '7/3 ÷ 2 = 7/3 × 1/2 = 7/6',
    q3Answer: '7/6',
    
    q4Question: 'Find: 2/5 ÷ 1/2',
    q4Hint: 'Multiply 2/5 by the reciprocal of 1/2',
    q4Solution: '2/5 ÷ 1/2 = 2/5 × 2/1 = 4/5',
    q4Answer: '4/5',
    
    q5Question: 'Find: 4 1/3 ÷ 3',
    q5Hint: 'Convert mixed number to improper fraction first',
    q5Solution: '4 1/3 ÷ 3 = 13/3 ÷ 3 = 13/3 × 1/3 = 13/9',
    q5Answer: '13/9',
    
    q6Question: 'Find: 3 1/2 ÷ 8/3',
    q6Hint: 'Convert mixed number and multiply by reciprocal',
    q6Solution: '3 1/2 ÷ 8/3 = 7/2 ÷ 8/3 = 7/2 × 3/8 = 21/16',
    q6Answer: '21/16',
    
    // Real World Examples
    realWorldTitle: 'Real World Examples',
    realWorldSubtitle: 'Examples using division of fractions',
    
    ex1Title: 'Recipe scaling',
    ex1Context: 'Multiply ingredients by a fraction to make half or double a recipe.',
    ex1Question: 'If a recipe needs 2 1/2 cups flour and you want to make 1/2 the recipe, how much flour?',
    ex1Answer: '2 1/2 ÷ 2 = 5/2 ÷ 2 = 5/2 × 1/2 = 5/4 = 1 1/4 cups',
    
    ex2Title: 'Construction',
    ex2Context: 'Find area by multiplying fractional lengths (m) and breadth (m).',
    ex2Question: 'A room is 3 1/2 m long and 2 3/4 m wide. What is the area?',
    ex2Answer: '3 1/2 × 2 3/4 = 7/2 × 11/4 = 77/8 = 9 5/8 m²',
    
    ex3Title: 'Study time',
    ex3Context: 'If you study 3/4 of an hour daily for 5 days, total time is:',
    ex3Question: 'How many total hours do you study in 5 days?',
    ex3Answer: '3/4 × 5 = 15/4 = 3 3/4 hours',
    
    ex4Title: 'Discounts',
    ex4Context: 'Price after 3/5 discount means pay 2/5 of the price.',
    ex4Question: 'An item costs ₹120. After 3/5 discount, what do you pay?',
    ex4Answer: '₹120 × 2/5 = ₹240/5 = ₹48',
    
    ex5Title: 'Maps & scale',
    ex5Context: 'On a map with scale 1/100000, 3/5 cm represents real distance.',
    ex5Question: 'What real distance does 3/5 cm represent on this map?',
    ex5Answer: '3/5 ÷ 1/100000 = 3/5 × 100000/1 = 60000 cm = 600 m',
    
    ex6Title: 'Fuel usage',
    ex6Context: 'A car uses 3/8 of a tank each day for 4 days. Total used:',
    ex6Question: 'How much fuel is used in 4 days?',
    ex6Answer: '3/8 × 4 = 12/8 = 1 1/2 tanks',
    
    // Why Division Matters
    whyMatterTitle: 'Why dividing fractions matters?',
    whyMatterPoint1: 'Scaling quantities precisely (half, one third, three fourths of anything).',
    whyMatterPoint2: 'Finding areas of rectangles with fractional sides (l × b).',
    whyMatterPoint3: 'Adjusting recipes and mixtures by any fractional amount.',
    whyMatterPoint4: 'Discounts and taxes expressed as fractions of price.',
    whyMatterPoint5: 'Time calculations (e.g., 3/4 hour per day for several days).',
    
    // Pro Tip
    proTipTitle: 'Pro Tip!',
    proTipText: 'Find the reciprocal of the divisor, then multiply. Cancel common factors first, then simplify to lowest terms or a mixed number.',
    
    // Additional UI elements
    placeholderAnswer: 'Type your answer here...',
    answerLabel: 'Answer',
    viewAssessment: 'View Assessment',
    practiceComplete: 'Practice Complete!',
    practiceCompleteSubtitle: 'You\'ve finished all division exercises!',
    yourScore: 'Your Score',
    accuracy: 'Accuracy',
    performance: 'Performance',
    totalAttempts: 'Total Attempts',
    exerciseBreakdown: 'Exercise Breakdown',
    questionLabel: 'Question',
    attemptLabel: 'attempt(s)',
    practiceAgain: '🔄 Practice Again',
    of: 'of',
    clickToExpand: 'Click to expand',
    clickToCollapse: 'Click to collapse',
  },
  hi: {
    // Header
    appTitle: 'भिन्नों का विभाजन',
    selectLanguage: 'भाषा चुनें',
    
    // Navigation
    learn: 'सीखें',
    practice: 'अभ्यास',
    realWorld: 'वास्तविक दुनिया',
    
    // Common
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
    incorrect: 'गलत। पुनः प्रयास करें!',
    score: 'अंक',
    attempts: 'प्रयास',
    solution: 'समाधान',
    
    // Learn Tab - Steps
    step1Title: 'पूर्ण संख्या का भिन्न से विभाजन',
    step1Desc: 'पूर्ण संख्याओं को भिन्नों से विभाजित करना सीखें',
    step1Concept: 'पूर्ण संख्या को भिन्न से विभाजित करते समय, पूर्ण संख्या को भिन्न के व्युत्क्रम से गुणा करें।',
    
    step2Title: 'भिन्न का व्युत्क्रम',
    step2Desc: 'व्युत्क्रम का अर्थ समझें और इसे कैसे खोजें',
    step2Concept: 'भिन्न का व्युत्क्रम अंश और हर को आपस में बदलने से प्राप्त होता है।',
    
    step3Title: 'भिन्न का पूर्ण संख्या से विभाजन',
    step3Desc: 'भिन्नों को पूर्ण संख्याओं से विभाजित करना सीखें',
    step3Concept: 'भिन्न को पूर्ण संख्या से विभाजित करते समय, भिन्न को पूर्ण संख्या के व्युत्क्रम से गुणा करें।',
    
    step4Title: 'भिन्न का दूसरे भिन्न से विभाजन',
    step4Desc: 'भिन्नों को भिन्नों से विभाजित करने में महारत हासिल करें',
    step4Concept: 'भिन्नों को विभाजित करने के लिए, पहले भिन्न को दूसरे भिन्न के व्युत्क्रम से गुणा करें।',
    
    // Demonstration Mode specific translations
    divisionVisualTitle: 'पूर्ण संख्या का भिन्न से विभाजन',
    exampleTitle: 'उदाहरण: 1 ÷ 1/2',
    halfPartsQuestion: 'आप कितने आधे भाग देखते हैं?',
    halfPartsAnswer: 'दो आधे भाग हैं।',
    divisionResult: 'तो, 1 ÷ 1/2 = 2',
    multiplicationResult: 'साथ ही, 1 × 2/1 = 1 × 2 = 2',
    divisionRule: 'इस प्रकार, 1 ÷ 1/2 = 1 × 2/1',
    reciprocalExamples: 'उदाहरण:',
    reciprocalDefinition: 'वे गैर-शून्य संख्याएं जिनका आपस में गुणनफल 1 है, एक-दूसरे के व्युत्क्रम कहलाती हैं।',
    reciprocalExamplesText: 'तो 5/9 का व्युत्क्रम 9/5 है और 9/5 का व्युत्क्रम 5/9 है',
    understandingReciprocals: 'व्युत्क्रम को समझना',
    observeProducts: 'इन गुणनफलों को देखें:',
    fractionDivisionTitle: 'भिन्न ÷ पूर्ण संख्या',
    visualizingDivision: '3/4 ÷ 3 का दृश्यीकरण',
    eachCircleRepresents: 'प्रत्येक वृत्त एक पूर्ण के 3/4 भाग को दर्शाता है। जब हम 3 से विभाजित करते हैं, तो हम पूछ रहे हैं कि प्रत्येक भाग को कितना मिलता है।',
    divisionResult3: 'परिणाम: 3/4 ÷ 3 = 1/4',
    whatWillBe: '3/4 ÷ 3 क्या होगा?',
    basedOnObservations: 'हमारे पहले के अवलोकनों के आधार पर हमारे पास है:',
    moreExamples: 'अधिक उदाहरण',
    similarlyExample: 'इसी प्रकार, 8/5 ÷ 2/3 = 8/5 × 2/3 का व्युत्क्रम = ?',
    andExample: 'और, 1/2 ÷ 3/4 = ?',
    canNowFind: 'अब हम 1/3 ÷ 6/5 ज्ञात कर सकते हैं',
    usingReciprocalMethod: 'व्युत्क्रम विधि का उपयोग करके:',
    fractionByFractionTitle: 'भिन्न ÷ भिन्न',
    stepByStep: 'चरणबद्ध: 1/3 ÷ 6/5',
    rememberDivision: 'याद रखें: विभाजन व्युत्क्रम से गुणन है!',
    pauseButton: '⏸️ रोकें',
    playButton: '▶️ चलाएं',
    
    // Additional hardcoded text translations
    keyPoints: 'मुख्य बिंदु',
    exampleQuestion1: 'तो, 2/3 ÷ 7 = 2/3 × 1/7 = ?',
    exampleQuestion2: '5/7 ÷ 6, 2/7 ÷ 8 क्या है?',
    
    // Key Points
    keyPoint1: 'भाजक का व्युत्क्रम खोजें',
    keyPoint2: 'भाज्य को व्युत्क्रम से गुणा करें',
    keyPoint3: 'यदि संभव हो तो परिणाम को सरल बनाएं',
    keyPoint4: 'पहले मिश्रित संख्याओं को अनुचित भिन्न में बदलें',
    keyPoint5: 'वापस गुणा करके अपने उत्तर की जांच करें',
    
    // Practice Mode
    practiceTitle: 'अभ्यास प्रश्न',
    practiceSubtitle: 'भिन्नों के विभाजन की अपनी समझ का परीक्षण करें',
    questionTitle: 'प्रश्न',
    hintLabel: 'संकेत',
    solutionLabel: 'समाधान',
    
    // Practice Questions
    q1Question: 'ज्ञात करें: 12 ÷ 3/4',
    q1Hint: '12 को 3/4 के व्युत्क्रम से गुणा करें',
    q1Solution: '12 ÷ 3/4 = 12 × 4/3 = 48/3 = 16',
    q1Answer: '16',
    
    q2Question: '3/7 का व्युत्क्रम ज्ञात करें',
    q2Hint: 'अंश और हर को आपस में बदलें',
    q2Solution: '3/7 का व्युत्क्रम 7/3 है',
    q2Answer: '7/3',
    
    q3Question: 'ज्ञात करें: 7/3 ÷ 2',
    q3Hint: '7/3 को 2 के व्युत्क्रम से गुणा करें',
    q3Solution: '7/3 ÷ 2 = 7/3 × 1/2 = 7/6',
    q3Answer: '7/6',
    
    q4Question: 'ज्ञात करें: 2/5 ÷ 1/2',
    q4Hint: '2/5 को 1/2 के व्युत्क्रम से गुणा करें',
    q4Solution: '2/5 ÷ 1/2 = 2/5 × 2/1 = 4/5',
    q4Answer: '4/5',
    
    q5Question: 'ज्ञात करें: 4 1/3 ÷ 3',
    q5Hint: 'पहले मिश्रित संख्या को अनुचित भिन्न में बदलें',
    q5Solution: '4 1/3 ÷ 3 = 13/3 ÷ 3 = 13/3 × 1/3 = 13/9',
    q5Answer: '13/9',
    
    q6Question: 'ज्ञात करें: 3 1/2 ÷ 8/3',
    q6Hint: 'मिश्रित संख्या को बदलें और व्युत्क्रम से गुणा करें',
    q6Solution: '3 1/2 ÷ 8/3 = 7/2 ÷ 8/3 = 7/2 × 3/8 = 21/16',
    q6Answer: '21/16',
    
    // Real World Examples
    realWorldTitle: 'वास्तविक दुनिया के उदाहरण',
    realWorldSubtitle: 'भिन्नों के विभाजन का उपयोग करने वाले उदाहरण',
    
    ex1Title: 'रेसिपी स्केलिंग',
    ex1Context: 'आधा या दोगुना रेसिपी बनाने के लिए सामग्री को भिन्न से गुणा करें।',
    ex1Question: 'यदि एक रेसिपी में 2 1/2 कप आटा चाहिए और आप आधी रेसिपी बनाना चाहते हैं, तो कितना आटा?',
    ex1Answer: '2 1/2 ÷ 2 = 5/2 ÷ 2 = 5/2 × 1/2 = 5/4 = 1 1/4 कप',
    
    ex2Title: 'निर्माण',
    ex2Context: 'भिन्नात्मक लंबाई (मी) और चौड़ाई (मी) को गुणा करके क्षेत्रफल ज्ञात करें।',
    ex2Question: 'एक कमरा 3 1/2 मी लंबा और 2 3/4 मी चौड़ा है। क्षेत्रफल क्या है?',
    ex2Answer: '3 1/2 × 2 3/4 = 7/2 × 11/4 = 77/8 = 9 5/8 मी²',
    
    ex3Title: 'अध्ययन समय',
    ex3Context: 'यदि आप 5 दिनों तक प्रतिदिन 3/4 घंटे अध्ययन करते हैं, तो कुल समय है:',
    ex3Question: '5 दिनों में आप कितने कुल घंटे अध्ययन करते हैं?',
    ex3Answer: '3/4 × 5 = 15/4 = 3 3/4 घंटे',
    
    ex4Title: 'छूट',
    ex4Context: '3/5 छूट के बाद कीमत का मतलब है कि कीमत का 2/5 भुगतान करें।',
    ex4Question: 'एक वस्तु की कीमत ₹120 है। 3/5 छूट के बाद आप कितना भुगतान करते हैं?',
    ex4Answer: '₹120 × 2/5 = ₹240/5 = ₹48',
    
    ex5Title: 'मानचित्र और पैमाना',
    ex5Context: '1/100000 पैमाने वाले मानचित्र पर 3/5 सेमी वास्तविक दूरी का प्रतिनिधित्व करता है।',
    ex5Question: 'इस मानचित्र पर 3/5 सेमी कितनी वास्तविक दूरी का प्रतिनिधित्व करता है?',
    ex5Answer: '3/5 ÷ 1/100000 = 3/5 × 100000/1 = 60000 सेमी = 600 मी',
    
    ex6Title: 'ईंधन उपयोग',
    ex6Context: 'एक कार 4 दिनों तक प्रतिदिन 3/8 टैंक ईंधन का उपयोग करती है। कुल उपयोग:',
    ex6Question: '4 दिनों में कितना ईंधन उपयोग होता है?',
    ex6Answer: '3/8 × 4 = 12/8 = 1 1/2 टैंक',
    
    // Why Division Matters
    whyMatterTitle: 'भिन्नों का विभाजन क्यों महत्वपूर्ण है?',
    whyMatterPoint1: 'मात्राओं को सटीक रूप से स्केल करना (किसी भी चीज़ का आधा, एक तिहाई, तीन चौथाई)।',
    whyMatterPoint2: 'भिन्नात्मक भुजाओं वाले आयतों का क्षेत्रफल ज्ञात करना (लंबाई × चौड़ाई)।',
    whyMatterPoint3: 'किसी भी भिन्नात्मक मात्रा से रेसिपी और मिश्रण को समायोजित करना।',
    whyMatterPoint4: 'कीमत के भिन्न के रूप में व्यक्त छूट और कर।',
    whyMatterPoint5: 'समय गणना (उदाहरण के लिए, कई दिनों तक प्रतिदिन 3/4 घंटा)।',
    
    // Pro Tip
    proTipTitle: 'विशेषज्ञ सुझाव!',
    proTipText: 'भाजक का व्युत्क्रम खोजें, फिर गुणा करें। पहले सामान्य गुणनखंडों को रद्द करें, फिर निम्नतम पदों या मिश्रित संख्या में सरल बनाएं।',
    
    // Additional UI elements
    placeholderAnswer: 'अपना उत्तर यहाँ टाइप करें...',
    answerLabel: 'उत्तर',
    viewAssessment: 'मूल्यांकन देखें',
    practiceComplete: 'अभ्यास पूरा!',
    practiceCompleteSubtitle: 'आपने सभी विभाजन अभ्यास पूरे कर लिए हैं!',
    yourScore: 'आपका स्कोर',
    accuracy: 'सटीकता',
    performance: 'प्रदर्शन',
    totalAttempts: 'कुल प्रयास',
    exerciseBreakdown: 'अभ्यास विवरण',
    questionLabel: 'प्रश्न',
    attemptLabel: 'प्रयास',
    practiceAgain: '🔄 फिर से अभ्यास करें',
    of: 'का',
    clickToExpand: 'विस्तार करने के लिए क्लिक करें',
    clickToCollapse: 'संकुचित करने के लिए क्लिक करें',
  },
  gu: {
    // Header
    appTitle: 'અપૂર્ણાંકનું વિભાજન',
    selectLanguage: 'ભાષા પસંદ કરો',
    
    // Navigation
    learn: 'શીખો',
    practice: 'પ્રેક્ટિસ',
    realWorld: 'વાસ્તવિક દુનિયા',
    
    // Common
    next: 'આગળ',
    previous: 'પાછળ',
    submit: 'સબમિટ કરો',
    tryAgain: 'ફરી પ્રયાસ કરો',
    showHint: 'સંકેત બતાવો',
    hideHint: 'સંકેત છુપાવો',
    showSolution: 'ઉકેલ બતાવો',
    hideSolution: 'ઉકેલ છુપાવો',
    yourAnswer: 'તમારો જવાબ',
    correct: 'સાચું!',
    incorrect: 'ખોટું. ફરી પ્રયાસ કરો!',
    score: 'સ્કોર',
    attempts: 'પ્રયાસો',
    solution: 'ઉકેલ',
    
    // Learn Tab - Steps
    step1Title: 'પૂર્ણ સંખ્યાનું અપૂર્ણાંક દ્વારા વિભાજન',
    step1Desc: 'પૂર્ણ સંખ્યાઓને અપૂર્ણાંકો દ્વારા વિભાજિત કરવાનું શીખો',
    step1Concept: 'પૂર્ણ સંખ્યાને અપૂર્ણાંક દ્વારા વિભાજિત કરતી વખતે, પૂર્ણ સંખ્યાને અપૂર્ણાંકના વ્યુત્ક્રમ દ્વારા ગુણાકાર કરો।',
    
    step2Title: 'અપૂર્ણાંકનું વ્યુત્ક્રમ',
    step2Desc: 'વ્યુત્ક્રમનો અર્થ સમજો અને તેને કેવી રીતે શોધવું',
    step2Concept: 'અપૂર્ણાંકનું વ્યુત્ક્રમ અંશ અને છેદને એકબીજા સાથે બદલીને મળે છે।',
    
    step3Title: 'અપૂર્ણાંકનું પૂર્ણ સંખ્યા દ્વારા વિભાજન',
    step3Desc: 'અપૂર્ણાંકોને પૂર્ણ સંખ્યાઓ દ્વારા વિભાજિત કરવાનું શીખો',
    step3Concept: 'અપૂર્ણાંકને પૂર્ણ સંખ્યા દ્વારા વિભાજિત કરતી વખતે, અપૂર્ણાંકને પૂર્ણ સંખ્યાના વ્યુત્ક્રમ દ્વારા ગુણાકાર કરો।',
    
    step4Title: 'અપૂર્ણાંકનું બીજા અપૂર્ણાંક દ્વારા વિભાજન',
    step4Desc: 'અપૂર્ણાંકોને અપૂર્ણાંકો દ્વારા વિભાજિત કરવામાં નિપુણતા મેળવો',
    step4Concept: 'અપૂર્ણાંકોને વિભાજિત કરવા માટે, પહેલા અપૂર્ણાંકને બીજા અપૂર્ણાંકના વ્યુત્ક્રમ દ્વારા ગુણાકાર કરો।',
    
    // Demonstration Mode specific translations
    divisionVisualTitle: 'પૂર્ણ સંખ્યાનું અપૂર્ણાંક દ્વારા વિભાજન',
    exampleTitle: 'ઉદાહરણ: 1 ÷ 1/2',
    halfPartsQuestion: 'તમે કેટલા અડધા ભાગ જુઓ છો?',
    halfPartsAnswer: 'બે અડધા ભાગ છે.',
    divisionResult: 'તો, 1 ÷ 1/2 = 2',
    multiplicationResult: 'પણ, 1 × 2/1 = 1 × 2 = 2',
    divisionRule: 'આમ, 1 ÷ 1/2 = 1 × 2/1',
    reciprocalExamples: 'ઉદાહરણો:',
    reciprocalDefinition: 'જે બિન-શૂન્ય સંખ્યાઓનો એકબીજા સાથે ગુણાકાર 1 છે, તે એકબીજાના વ્યુત્ક્રમ કહેવાય છે.',
    reciprocalExamplesText: 'તો 5/9 નું વ્યુત્ક્રમ 9/5 છે અને 9/5 નું વ્યુત્ક્રમ 5/9 છે',
    understandingReciprocals: 'વ્યુત્ક્રમને સમજવું',
    observeProducts: 'આ ગુણાકારો જુઓ:',
    fractionDivisionTitle: 'અપૂર્ણાંક ÷ પૂર્ણ સંખ્યા',
    visualizingDivision: '3/4 ÷ 3 નું દ્રશ્યીકરણ',
    eachCircleRepresents: 'દરેક વર્તુળ એક પૂર્ણના 3/4 ભાગને દર્શાવે છે. જ્યારે આપણે 3 વડે ભાગીએ છીએ, ત્યારે આપણે પૂછીએ છીએ કે દરેક ભાગને કેટલું મળે છે.',
    divisionResult3: 'પરિણામ: 3/4 ÷ 3 = 1/4',
    whatWillBe: '3/4 ÷ 3 શું હશે?',
    basedOnObservations: 'આપણા પહેલાના અવલોકનોના આધારે આપણી પાસે છે:',
    moreExamples: 'વધુ ઉદાહરણો',
    similarlyExample: 'તેવી જ રીતે, 8/5 ÷ 2/3 = 8/5 × 2/3 નું વ્યુત્ક્રમ = ?',
    andExample: 'અને, 1/2 ÷ 3/4 = ?',
    canNowFind: 'હવે આપણે 1/3 ÷ 6/5 શોધી શકીએ છીએ',
    usingReciprocalMethod: 'વ્યુત્ક્રમ પદ્ધતિનો ઉપયોગ કરીને:',
    fractionByFractionTitle: 'અપૂર્ણાંક ÷ અપૂર્ણાંક',
    stepByStep: 'પગલાવાર: 1/3 ÷ 6/5',
    rememberDivision: 'યાદ રાખો: વિભાજન એ વ્યુત્ક્રમ દ્વારા ગુણાકાર છે!',
    pauseButton: '⏸️ રોકો',
    playButton: '▶️ ચલાવો',
    
    // Additional hardcoded text translations
    keyPoints: 'મુખ્ય મુદ્દાઓ',
    exampleQuestion1: 'તો, 2/3 ÷ 7 = 2/3 × 1/7 = ?',
    exampleQuestion2: '5/7 ÷ 6, 2/7 ÷ 8 શું છે?',
    
    // Key Points
    keyPoint1: 'ભાજકનું વ્યુત્ક્રમ શોધો',
    keyPoint2: 'ભાજ્યને વ્યુત્ક્રમ દ્વારા ગુણાકાર કરો',
    keyPoint3: 'શક્ય હોય તો પરિણામને સરળ બનાવો',
    keyPoint4: 'પહેલા મિશ્રિત સંખ્યાઓને અયોગ્ય અપૂર્ણાંકમાં બદલો',
    keyPoint5: 'વળી ગુણાકાર કરીને તમારા જવાબની તપાસ કરો',
    
    // Practice Mode
    practiceTitle: 'પ્રેક્ટિસ પ્રશ્નો',
    practiceSubtitle: 'અપૂર્ણાંકોના વિભાજનની તમારી સમજણનું પરીક્ષણ કરો',
    questionTitle: 'પ્રશ્ન',
    hintLabel: 'સંકેત',
    solutionLabel: 'ઉકેલ',
    
    // Practice Questions
    q1Question: 'શોધો: 12 ÷ 3/4',
    q1Hint: '12 ને 3/4 ના વ્યુત્ક્રમ દ્વારા ગુણાકાર કરો',
    q1Solution: '12 ÷ 3/4 = 12 × 4/3 = 48/3 = 16',
    q1Answer: '16',
    
    q2Question: '3/7 નું વ્યુત્ક્રમ શોધો',
    q2Hint: 'અંશ અને છેદને એકબીજા સાથે બદલો',
    q2Solution: '3/7 નું વ્યુત્ક્રમ 7/3 છે',
    q2Answer: '7/3',
    
    q3Question: 'શોધો: 7/3 ÷ 2',
    q3Hint: '7/3 ને 2 ના વ્યુત્ક્રમ દ્વારા ગુણાકાર કરો',
    q3Solution: '7/3 ÷ 2 = 7/3 × 1/2 = 7/6',
    q3Answer: '7/6',
    
    q4Question: 'શોધો: 2/5 ÷ 1/2',
    q4Hint: '2/5 ને 1/2 ના વ્યુત્ક્રમ દ્વારા ગુણાકાર કરો',
    q4Solution: '2/5 ÷ 1/2 = 2/5 × 2/1 = 4/5',
    q4Answer: '4/5',
    
    q5Question: 'શોધો: 4 1/3 ÷ 3',
    q5Hint: 'પહેલા મિશ્રિત સંખ્યાને અયોગ્ય અપૂર્ણાંકમાં બદલો',
    q5Solution: '4 1/3 ÷ 3 = 13/3 ÷ 3 = 13/3 × 1/3 = 13/9',
    q5Answer: '13/9',
    
    q6Question: 'શોધો: 3 1/2 ÷ 8/3',
    q6Hint: 'મિશ્રિત સંખ્યાને બદલો અને વ્યુત્ક્રમ દ્વારા ગુણાકાર કરો',
    q6Solution: '3 1/2 ÷ 8/3 = 7/2 ÷ 8/3 = 7/2 × 3/8 = 21/16',
    q6Answer: '21/16',
    
    // Real World Examples
    realWorldTitle: 'વાસ્તવિક દુનિયાના ઉદાહરણો',
    realWorldSubtitle: 'અપૂર્ણાંકોના વિભાજનનો ઉપયોગ કરતા ઉદાહરણો',
    
    ex1Title: 'રેસિપી સ્કેલિંગ',
    ex1Context: 'અડધી અથવા ડબલ રેસિપી બનાવવા માટે સામગ્રીને અપૂર્ણાંક દ્વારા ગુણાકાર કરો।',
    ex1Question: 'જો રેસિપીમાં 2 1/2 કપ લોટ જોઈએ અને તમે અડધી રેસિપી બનાવવા માંગો છો, તો કેટલું લોટ?',
    ex1Answer: '2 1/2 ÷ 2 = 5/2 ÷ 2 = 5/2 × 1/2 = 5/4 = 1 1/4 કપ',
    
    ex2Title: 'નિર્માણ',
    ex2Context: 'અપૂર્ણાંક લંબાઈ (મી) અને પહોળાઈ (મી) ગુણાકાર કરીને ક્ષેત્રફળ શોધો।',
    ex2Question: 'એક રૂમ 3 1/2 મી લાંબો અને 2 3/4 મી પહોળો છે। ક્ષેત્રફળ શું છે?',
    ex2Answer: '3 1/2 × 2 3/4 = 7/2 × 11/4 = 77/8 = 9 5/8 મી²',
    
    ex3Title: 'અભ્યાસ સમય',
    ex3Context: 'જો તમે 5 દિવસ સુધી દરરોજ 3/4 કલાક અભ્યાસ કરો છો, તો કુલ સમય છે:',
    ex3Question: '5 દિવસમાં તમે કુલ કેટલા કલાક અભ્યાસ કરો છો?',
    ex3Answer: '3/4 × 5 = 15/4 = 3 3/4 કલાક',
    
    ex4Title: 'છૂટ',
    ex4Context: '3/5 છૂટ પછીની કિંમતનો અર્થ છે કે કિંમતનો 2/5 ભુગતાન કરો।',
    ex4Question: 'એક વસ્તુની કિંમત ₹120 છે। 3/5 છૂટ પછી તમે કેટલું ભુગતાન કરો છો?',
    ex4Answer: '₹120 × 2/5 = ₹240/5 = ₹48',
    
    ex5Title: 'નકશા અને સ્કેલ',
    ex5Context: '1/100000 સ્કેલવાળા નકશા પર 3/5 સેમી વાસ્તવિક અંતરનું પ્રતિનિધિત્વ કરે છે।',
    ex5Question: 'આ નકશા પર 3/5 સેમી કેટલું વાસ્તવિક અંતર દર્શાવે છે?',
    ex5Answer: '3/5 ÷ 1/100000 = 3/5 × 100000/1 = 60000 સેમી = 600 મી',
    
    ex6Title: 'બળતણ વપરાશ',
    ex6Context: 'એક કાર 4 દિવસ સુધી દરરોજ 3/8 ટાંકી બળતણનો ઉપયોગ કરે છે। કુલ ઉપયોગ:',
    ex6Question: '4 દિવસમાં કેટલું બળતણ ઉપયોગ થાય છે?',
    ex6Answer: '3/8 × 4 = 12/8 = 1 1/2 ટાંકી',
    
    // Why Division Matters
    whyMatterTitle: 'અપૂર્ણાંકોનું વિભાજન શા માટે મહત્વપૂર્ણ છે?',
    whyMatterPoint1: 'માત્રાને સચોટ રીતે સ્કેલ કરવી (કોઈપણ વસ્તુનો અડધો, એક તૃતીયાંશ, ત્રણ ચતુર્થાંશ)।',
    whyMatterPoint2: 'અપૂર્ણાંક બાજુઓવાળા લંબચોરસનું ક્ષેત્રફળ શોધવું (લંબાઈ × પહોળાઈ)।',
    whyMatterPoint3: 'કોઈપણ અપૂર્ણાંક માત્રા દ્વારા રેસિપી અને મિશ્રણને સમાયોજિત કરવું।',
    whyMatterPoint4: 'કિંમતના અપૂર્ણાંક તરીકે વ્યક્ત છૂટ અને કર।',
    whyMatterPoint5: 'સમય ગણતરી (ઉદાહરણ તરીકે, કેટલાક દિવસો માટે દરરોજ 3/4 કલાક)।',
    
    // Pro Tip
    proTipTitle: 'વિશેષજ્ઞ સૂચના!',
    proTipText: 'ભાજકનું વ્યુત્ક્રમ શોધો, પછી ગુણાકાર કરો। પહેલા સામાન્ય અવયવોને રદ કરો, પછી ન્યૂનતમ પદો અથવા મિશ્રિત સંખ્યામાં સરળ બનાવો।',
    
    // Additional UI elements
    placeholderAnswer: 'તમારો જવાબ અહીં લખો...',
    answerLabel: 'જવાબ',
    viewAssessment: 'મૂલ્યાંકન જુઓ',
    practiceComplete: 'પ્રેક્ટિસ પૂર્ણ!',
    practiceCompleteSubtitle: 'તમે બધા વિભાજન પ્રેક્ટિસ પૂરા કર્યા છે!',
    yourScore: 'તમારો સ્કોર',
    accuracy: 'ચોકસાઈ',
    performance: 'પ્રદર્શન',
    totalAttempts: 'કુલ પ્રયાસો',
    exerciseBreakdown: 'પ્રેક્ટિસ વિગતો',
    questionLabel: 'પ્રશ્ન',
    attemptLabel: 'પ્રયાસો',
    practiceAgain: '🔄 ફરીથી પ્રેક્ટિસ કરો',
    of: 'નો',
    clickToExpand: 'વિસ્તૃત કરવા માટે ક્લિક કરો',
    clickToCollapse: 'સંકુચિત કરવા માટે ક્લિક કરો',
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

// Demonstration Mode Components

// Word-by-word animation component
function AnimatedText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayedText, setDisplayedText] = useState('');
  const words = text.split(' ');

  useEffect(() => {
    setDisplayedText(''); // Reset on text change
    let currentIndex = 0;
    
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        if (currentIndex < words.length) {
          setDisplayedText(words.slice(0, currentIndex + 1).join(' '));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 100); // 100ms between each word
      
      return () => clearInterval(interval);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [text, delay]);

  return <span>{displayedText}</span>;
}

// Interactive Fraction Visual Component
function FractionVisual({ numerator, denominator, isHighlighted = false, delay = 0 }: { 
  numerator: number; 
  denominator: number; 
  isHighlighted?: boolean; 
  delay?: number; 
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`fraction-grow transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
      <div className={`relative ${isHighlighted ? 'ring-4 ring-yellow-400 rounded-lg p-2' : ''}`}>
        <div className="flex flex-col items-center">
          {/* Numerator */}
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-blue-400 rounded-lg p-3 mb-1 shadow-lg">
            <span className="text-2xl font-bold text-blue-800">{numerator}</span>
          </div>
          
          {/* Fraction line */}
          <div className="w-16 h-1 bg-gray-600 my-1"></div>
          
          {/* Denominator */}
          <div className="bg-gradient-to-br from-green-100 to-green-200 border-2 border-green-400 rounded-lg p-3 shadow-lg">
            <span className="text-2xl font-bold text-green-800">{denominator}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Circle Division Visual
function CircleDivisionVisual({ whole, parts, delay = 0 }: { whole: number; parts: number; delay?: number }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`circle-grow transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
      <div className="flex items-center justify-center space-x-4">
        {Array.from({ length: whole }, (_, i) => (
          <div key={i} className="relative">
            <svg width="80" height="80" className="transform transition-all duration-300 hover:scale-110">
              <circle
                cx="40"
                cy="40"
                r="35"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                strokeDasharray="2,2"
              />
              {/* Division lines */}
              {parts === 2 && (
                <>
                  <line x1="5" y1="40" x2="75" y2="40" stroke="#ef4444" strokeWidth="2" />
                </>
              )}
              {parts === 4 && (
                <>
                  <line x1="5" y1="40" x2="75" y2="40" stroke="#ef4444" strokeWidth="2" />
                  <line x1="40" y1="5" x2="40" y2="75" stroke="#ef4444" strokeWidth="2" />
                </>
              )}
              {/* Fill one part */}
              <path
                d={parts === 2 ? "M 5 40 A 35 35 0 0 0 75 40 L 40 40 Z" : "M 40 5 A 35 35 0 0 1 75 40 L 40 40 Z"}
                fill="#60a5fa"
                fillOpacity="0.7"
              />
            </svg>
            <div className="text-center mt-2">
              <span className="text-sm font-bold text-gray-700">1/{parts}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DemonstrationMode() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const steps = [
    { id: 0, title: t('step1Title'), desc: t('step1Desc') },
    { id: 1, title: t('step2Title'), desc: t('step2Desc') },
    { id: 2, title: t('step3Title'), desc: t('step3Desc') },
    { id: 3, title: t('step4Title'), desc: t('step4Desc') },
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return;
    
    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setIsPlaying(false); // Stop at the end
      }
    }, 8000); // 8 seconds per step for division content
    
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps.length]);

  const renderStep1 = () => (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
      {/* Left - Concept */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-blue-200">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-5xl">➗</span>
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('step1Title')}
          </h3>
        </div>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
          <AnimatedText text={t('step1Concept')} />
        </p>
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-l-4 border-blue-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">🔄</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('keyPoint1')} delay={200} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border-l-4 border-purple-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">✖️</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('keyPoint2')} delay={400} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl border-l-4 border-pink-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">🔢</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('keyPoint3')} delay={600} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border-l-4 border-green-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">🔄</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('keyPoint4')} delay={800} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border-l-4 border-orange-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">✅</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('keyPoint5')} delay={1000} /></p>
          </div>
        </div>
      </div>

      {/* Right - Visual example */}
      <div className="relative bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-purple-200 overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10">
          <h4 className="text-xl md:text-2xl font-bold text-center mb-6 bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent">
            📊 {t('divisionVisualTitle')}
          </h4>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
            <div className="text-center space-y-6">
              {/* Example: 1 ÷ 1/2 */}
              <div className="space-y-4">
                <h5 className="text-lg font-bold text-gray-800">{t('exampleTitle')}</h5>
                
                {/* Visual representation */}
                <CircleDivisionVisual whole={1} parts={2} delay={500} />
                
                {/* Mathematical steps */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border-2 border-blue-300">
                  <div className="space-y-3">
                    <p className="text-gray-700">
                      <AnimatedText text={t('halfPartsQuestion')} delay={1000} />
                    </p>
                    <p className="text-lg font-bold text-green-600">
                      <AnimatedText text={t('halfPartsAnswer')} delay={1500} />
                    </p>
                    <p className="text-lg font-bold text-blue-600">
                      <AnimatedText text={t('divisionResult')} delay={2000} />
                    </p>
                    <p className="text-lg font-bold text-purple-600">
                      <AnimatedText text={t('multiplicationResult')} delay={2500} />
                    </p>
                    <p className="text-lg font-bold text-indigo-600">
                      <AnimatedText text={t('divisionRule')} delay={3000} />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
      {/* Left - Reciprocal concept */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-green-200">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-5xl">🔄</span>
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            {t('step2Title')}
          </h3>
        </div>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
          <AnimatedText text={t('step2Concept')} />
        </p>
        
        {/* Interactive examples */}
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-4 border-2 border-green-300">
            <h5 className="font-bold text-gray-800 mb-3">{t('reciprocalExamples')}</h5>
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-4">
                <FractionVisual numerator={1} denominator={2} />
                <span className="text-2xl">→</span>
                <FractionVisual numerator={2} denominator={1} isHighlighted={true} delay={500} />
              </div>
              <div className="flex items-center justify-center gap-4">
                <FractionVisual numerator={1} denominator={3} />
                <span className="text-2xl">→</span>
                <FractionVisual numerator={3} denominator={1} isHighlighted={true} delay={800} />
              </div>
              <div className="flex items-center justify-center gap-4">
                <FractionVisual numerator={2} denominator={3} />
                <span className="text-2xl">→</span>
                <FractionVisual numerator={3} denominator={2} isHighlighted={true} delay={1100} />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-300">
            <p className="text-gray-700 text-center font-medium">
              <AnimatedText text={t('reciprocalDefinition')} delay={1500} />
            </p>
          </div>
        </div>
      </div>

      {/* Right - Visual comparison */}
      <div className="relative bg-gradient-to-br from-green-100 via-teal-100 to-cyan-100 rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-green-200 overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10">
          <h4 className="text-xl md:text-2xl font-bold text-center mb-6 bg-gradient-to-r from-green-700 to-teal-700 bg-clip-text text-transparent">
            🔄 {t('understandingReciprocals')}
          </h4>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
            <div className="space-y-6">
              {/* Multiplication examples */}
              <div className="text-center">
                <h5 className="font-bold text-gray-800 mb-4">{t('observeProducts')}</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-green-100 to-green-200 rounded-lg p-4 border border-green-300">
                    <p className="font-bold text-green-800">7 × (1/7) = 1</p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg p-4 border border-blue-300">
                    <p className="font-bold text-blue-800">(2/3) × (3/2) = 1</p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg p-4 border border-purple-300">
                    <p className="font-bold text-purple-800">(5/4) × (4/5) = 1</p>
                  </div>
                  <div className="bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg p-4 border border-orange-300">
                    <p className="font-bold text-orange-800">(1/9) × 9 = 1</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border-2 border-yellow-400">
                <p className="text-center font-bold text-gray-800">
                  <AnimatedText text={t('reciprocalExamplesText')} delay={2000} />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
      {/* Left - Concept */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-orange-200">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-5xl">📖</span>
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            {t('step3Title')}
          </h3>
        </div>
        
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-300">
            <h4 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
              <span className="text-2xl">❓</span>
              {t('whatWillBe')}
            </h4>
            <p className="text-gray-700 leading-relaxed mb-4">
              <AnimatedText text={t('basedOnObservations')} />
            </p>
            <div className="bg-white rounded-xl p-4 shadow-md">
              <div className="text-center space-y-2">
                <p className="text-lg font-bold text-blue-600">3/4 ÷ 3 = 3/4 ÷ 3/1</p>
                <p className="text-lg font-bold text-green-600">= 3/4 × 1/3</p>
                <p className="text-lg font-bold text-purple-600">= 3/12 = 1/4</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Right - Interactive visual */}
      <div className="relative bg-gradient-to-br from-orange-100 via-pink-100 to-red-100 rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-orange-200 overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-red-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10">
          <h4 className="text-xl md:text-2xl font-bold text-center mb-6 bg-gradient-to-r from-orange-700 to-red-700 bg-clip-text text-transparent">
            📊 {t('fractionDivisionTitle')}
          </h4>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
            <div className="text-center space-y-6">
              {/* Visual representation of 3/4 ÷ 3 */}
              <div className="space-y-4">
                <h5 className="text-lg font-bold text-gray-800">{t('visualizingDivision')}</h5>
                
                {/* Three circles representing the whole */}
                <div className="flex justify-center space-x-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="text-center">
                      <svg width="60" height="60" className="transform transition-all duration-300 hover:scale-110">
                        <circle
                          cx="30"
                          cy="30"
                          r="25"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="2"
                        />
                        {/* 3/4 filled */}
                        <path
                          d="M 30 5 A 25 25 0 1 1 5 30 L 30 30 Z"
                          fill="#60a5fa"
                          fillOpacity="0.8"
                        />
                        <path
                          d="M 30 5 A 25 25 0 0 1 55 30 L 30 30 Z"
                          fill="#60a5fa"
                          fillOpacity="0.8"
                        />
                        <path
                          d="M 30 5 A 25 25 0 0 0 5 30 L 30 30 Z"
                          fill="#60a5fa"
                          fillOpacity="0.8"
                        />
                      </svg>
                      <div className="text-xs font-bold text-gray-700 mt-1">3/4</div>
                    </div>
                  ))}
                </div>
                
                <p className="text-sm text-gray-600">
                  <AnimatedText text={t('eachCircleRepresents')} delay={1000} />
                </p>
                
                {/* Result */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-300">
                  <p className="text-lg font-bold text-green-700">
                    <AnimatedText text={t('divisionResult3')} delay={2000} />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
      {/* Left - Concept */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-indigo-200">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-5xl">➗➗</span>
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {t('step4Title')}
          </h3>
        </div>
        
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-300">
            <h4 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
              <span className="text-2xl">🧮</span>
              {t('canNowFind')}
            </h4>
            <p className="text-gray-700 leading-relaxed mb-4">
              <AnimatedText text={t('usingReciprocalMethod')} />
            </p>
            <div className="bg-white rounded-xl p-4 shadow-md">
              <div className="text-center space-y-2">
                <p className="text-lg font-bold text-blue-600">1/3 ÷ 6/5 = 1/3 × reciprocal of 6/5</p>
                <p className="text-lg font-bold text-green-600">= 1/3 × 5/6</p>
                <p className="text-lg font-bold text-purple-600">= 5/18</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Right - Complete visual */}
      <div className="relative bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-indigo-200 overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10">
          <h4 className="text-xl md:text-2xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
            🧮 {t('fractionByFractionTitle')}
          </h4>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
            <div className="space-y-6">
              {/* Step-by-step visual */}
              <div className="text-center space-y-4">
                <h5 className="font-bold text-gray-800">{t('stepByStep')}</h5>
                
                <div className="flex items-center justify-center space-x-4">
                  <FractionVisual numerator={1} denominator={3} />
                  <span className="text-2xl">×</span>
                  <FractionVisual numerator={5} denominator={6} isHighlighted={true} delay={500} />
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-300">
                  <p className="text-lg font-bold text-green-700">
                    <AnimatedText text="= 5/18" delay={1000} />
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border-2 border-yellow-400">
                <p className="text-center font-bold text-gray-800">
                  <AnimatedText text={t('rememberDivision')} delay={1500} />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Progress header */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            ➗ {t('appTitle')} - {currentStep + 1}/{steps.length}
          </h2>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-6 md:p-8">
        {currentStep === 0 && renderStep1()}
        {currentStep === 1 && renderStep2()}
        {currentStep === 2 && renderStep3()}
        {currentStep === 3 && renderStep4()}
      </div>

      {/* Navigation buttons */}
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
          {isPlaying ? t('pauseButton') : t('playButton')}
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
