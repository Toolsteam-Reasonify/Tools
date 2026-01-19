import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  language: 'en' | 'hi' | 'gu';
  setLanguage: (lang: 'en' | 'hi' | 'gu') => void;
  t: (key: string) => string;
  isTransitioning: boolean;
  localizeDigitsInText: (text: string) => string;
  formatNumber: (num: number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

// Comprehensive translations
const translations = {
  en: {
    // Navigation
    home: 'Home',
    introduction: 'Introduction',
    learn: 'Learn',
    realWorld: 'Real World',
    simpleEquations: 'Percentage - Another Way of Comparing Quantities',
    simpleEquationsTitle: 'Percentage - Another Way of Comparing Quantities',
    
    // Home Page
    masterSimpleEquations: 'Master Percentage Conversions',
    masterClass7Mathematics: 'Master Class 7 Mathematics with interactive learning, practice exercises, and engaging games based on NCERT curriculum',
    startLearning: 'Start Learning',
    whatYoullLearn: 'What You\'ll Learn',
    comprehensiveTools: 'Comprehensive tools designed to make learning percentage conversions engaging and effective',
    introductionDesc: 'Learn the basics of percentage conversions with interactive examples',
    learnDesc: 'Step-by-step explanations with visual aids',
    practiceDesc: 'Solve percentage conversion exercises and check your solutions',
    realWorldDesc: 'See how percentages apply in everyday life',
    practiceProblems: 'Practice Problems',
    interactiveExamples: 'Interactive Examples',
    readyToMaster: 'Ready to Master Percentage Conversions?',
    joinThousands: 'Join thousands of students and teachers who are making mathematics engaging and accessible.',
    startYourJourney: 'Start Your Journey',
    
    // Common
    correct: 'Correct!',
    incorrect: 'Try again!',
    learning: 'Learning',
    practice: 'Practice',
    assessment: 'Assessment',
    selectEquation: 'Select Equation:',
    yourAnswer: 'Your Answer:',
    submit: 'Submit',
    hint: 'Hint',
    progress: 'Progress:',
    accuracy: 'Accuracy',
    avgTime: 'Avg Time',
    correctAnswers: 'Correct',
    incorrectAnswers: 'Incorrect',
    totalExercises: 'Total',
    excellent: 'Excellent!',
    goodJob: 'Good Job!',
    keepTrying: 'Keep Trying!',
    showSolution: 'Show Solution',
    hideSolution: 'Hide Solution',
    reset: 'Reset',
    stepByStepSolution: 'Step-by-Step Solution:',
    nextStep: 'Next Step',
    complete: 'Complete',
    
    // Real World
    realWorldApps: 'Real World Applications',
    selectCategory: 'Select Category:',
    difficulty: 'Difficulty:',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    equation: 'Equation:',
    solution: 'Solution:',
    context: 'Context:',
    shopping: 'Shopping',
    cooking: 'Cooking',
    construction: 'Construction',
    sports: 'Sports',
    finance: 'Finance',
    science: 'Science',
    
    // Learn Section (Topic 7.1 Percentages)
    linearEquations: 'Percentages',
    linearEquationsDesc: 'Percentage (%) means per hundred and represents parts out of 100. Convert fractions/decimals to percentages by multiplying by 100; convert percentages to fractions by dividing by 100. Parts of a whole always add to 100%.',
    solvingByAddition: 'Solving by Addition',
    solvingByAdditionDesc: 'When we have subtraction in an equation, we add the same number to both sides to isolate the variable. This maintains the balance of the equation.',
    solvingBySubtraction: 'Solving by Subtraction',
    solvingBySubtractionDesc: 'When we have addition in an equation, we subtract the same number from both sides to isolate the variable. This maintains the balance of the equation.',
    solvingByMultiplication: 'Solving by Multiplication',
    solvingByMultiplicationDesc: 'When we have division in an equation, we multiply both sides by the same number to isolate the variable. This maintains the balance of the equation.',
    solvingByDivision: 'Solving by Division',
    solvingByDivisionDesc: 'When we have multiplication in an equation, we divide both sides by the same number to isolate the variable. This maintains the balance of the equation.',
    originalEquation: 'Original equation',
    originalEquationWithSubtraction: 'Original equation with subtraction',
    originalEquationWithAddition: 'Original equation with addition',
    originalEquationWithDivision: 'Original equation with division',
    originalEquationWithMultiplication: 'Original equation with multiplication',
    subtractFromBothSides: 'Subtract 5 from both sides',
    addToBothSides: 'Add 3 to both sides to isolate x',
    subtractFromBothSidesToIsolate: 'Subtract 4 from both sides to isolate x',
    multiplyBothSides: 'Multiply both sides by 3 to isolate x',
    divideBothSides: 'Divide both sides by 3 to isolate x',
    simplifyToFindAnswer: 'Simplify to find the answer',
    simplifyStep: 'Simplify: 5 - 5 = 0 and 12 - 5 = 7',
    verifySolution: 'Verify the solution by substituting x = 7',
    simplifyAdditionStep: 'Simplify: -3 + 3 = 0 and 8 + 3 = 11',
    verifyAdditionSolution: 'Verify the solution by substituting x = 11',
    simplifySubtractionStep: 'Simplify: 4 - 4 = 0 and 7 - 4 = 3',
    verifySubtractionSolution: 'Verify the solution by substituting x = 3',
    simplifyMultiplicationStep: 'Simplify: 3/3 = 1 and 4 × 3 = 12',
    verifyMultiplicationSolution: 'Verify the solution by substituting x = 12',
    simplifyDivisionStep: 'Simplify: 3x ÷ 3 = x and 15 ÷ 3 = 5',
    verifyDivisionSolution: 'Verify the solution by substituting x = 5',
    linearEquationExample: 'Linear Equation Example',
    additionMethodExample: 'Addition Method Example',
    subtractionMethodExample: 'Subtraction Method Example',
    multiplicationMethodExample: 'Multiplication Method Example',
    divisionMethodExample: 'Division Method Example',
    solving: 'Solving:',
    play: 'Play',
    pause: 'Pause',
    previous: 'Previous',
    next: 'Next',
    
    // Practice Mode
    practiceMode: 'Practice Mode',
    question: 'Question',
    skippedQuestions: 'Skipped Questions',
    notAttempted: 'Not Attempted',
    totalQuestions: 'Total Questions',
    finalGrade: 'Final Grade',
    accuracyRate: 'Accuracy Rate',
    avgTimePerQuestion: 'Avg Time/Question',
    questionByQuestionReview: 'Question by Question Review',
    startNewSession: 'Start New Session',
    loadingQuestions: 'Loading questions...',
    showAnswer: 'Show Answer',
    hideAnswer: 'Hide Answer',
    tryAgain: 'Try Again',
    skip: 'Skip',
    skipped: 'Skipped',
    sessionComplete: 'Session Complete!',
    sessionSummary: 'Here\'s your complete session summary',
    correctAnswer: 'Correct Answer',
    check: 'Check',
    notAttempt: 'Not Attempt',
    
    // Practice Questions (All 4 Types: 2 each)
    practice_q1: 'Convert 1/4 to a percentage.',
    practice_q2: 'Convert 3/5 to a percentage.',
    practice_q3: 'Convert 0.75 to a percentage.',
    practice_q4: 'Convert 0.6 to a percentage.',
    practice_q5: 'Convert 60% to a fraction.',
    practice_q6: 'Convert 25% to a fraction.',
    practice_q7: 'What percentage is 8 out of 20?',
    practice_q8: 'What percentage is 15 out of 30?',
    
    // Comprehensive Percentage Tool
    percentageConversions: 'Percentage Conversions',
    clickOnAnyType: 'Click on any type to see step-by-step explanation',
    backToTypes: 'Back to Types',
    
    // Conversion Types
    fractionToPercentage: 'Fraction → Percentage',
    decimalToPercentage: 'Decimal → Percentage',
    percentageToFraction: '% → Fraction',
    partOfTotal: 'Part of Total',
    
    // Descriptions
    convertingFractionsToPercentages: 'Converting fractions to percentages',
    convertingDecimalsToPercentages: 'Converting decimals to percentages',
    convertingPercentagesToFractions: 'Converting percentages to fractions',
    findingPercentageOfPart: 'Finding percentage of a part from total',
    
    // Common phrases
    step: 'Step',
    answer: 'Answer',
    start: 'Start',
    result: 'Result',
    part: 'Part',
    empty: 'Empty',
    percentage: 'Percentage',
    finalAnswer: 'Final Answer',
    visualRepresentation: 'Visual representation',
    outOf: 'out of',
    highlighted: 'highlighted',
    coins: 'coins',
    books: 'books',
    eachGroup: 'Each group',
    has: 'has',
    total: 'total',
    
    // Fraction to Percentage steps
    ftp_title: 'Fraction to Percentage: 1/4 × 100 = 25%',
    ftp_step1_eq: '1/4 = ?%',
    ftp_step1_exp: 'Start with the fraction 1/4. We want to convert this to a percentage.',
    ftp_step1_visual: '1 out of 4 coins highlighted',
    ftp_step2_eq: '1/4 × 100',
    ftp_step2_exp: 'To convert a fraction to percentage, multiply by 100.',
    ftp_step3_eq: '100/4 = 25',
    ftp_step3_exp: 'Multiply numerator by 100: 1 × 100 = 100. Then divide by denominator: 100 ÷ 4 = 25.',
    ftp_step4_eq: 'Answer: 25%',
    ftp_step4_exp: 'Final answer: 1/4 = 25%. This means 1 out of 4 coins equals 25 out of 100 coins.',
    
    // Decimal to Percentage steps
    dtp_title: 'Decimal to Percentage: 0.75 × 100 = 75%',
    dtp_step1_eq: '0.75 = ?%',
    dtp_step1_exp: 'Start with the decimal 0.75. We want to convert this to a percentage.',
    dtp_step1_visual: '1 out of 5 books represents 0.75 (75%)',
    dtp_step2_eq: '0.75 × 100',
    dtp_step2_exp: 'To convert a decimal to percentage, multiply by 100.',
    dtp_step2_visual: 'Multiplying 0.75 by 100 gives us 75',
    dtp_step3_eq: '75%',
    dtp_step3_exp: 'The result is 75, which means 75 out of 100, or 75%.',
    dtp_step3_visual: 'Final answer: 0.75 = 75%',
    
    // Percentage to Fraction steps
    ptf_title: 'Percentage to Fraction: 60% = 3/5',
    ptf_step1_eq: '60% = ?',
    ptf_step1_exp: 'Start with the percentage 60%. We want to convert this to a fraction.',
    ptf_step2_eq: '60% = 60/100',
    ptf_step2_exp: 'Percentage means per hundred, so write it over 100.',
    ptf_step3_eq: '60/100 = 3/5',
    ptf_step3_exp: 'Simplify the fraction by dividing both numerator and denominator by their greatest common divisor (20).',
    
    // Part of Total steps
    pot_title: 'Part of Total: 8/20 = 40%',
    pot_step1_eq: '8/20 = ?%',
    pot_step1_exp: 'Start with the fraction 8/20. We want to find what percentage this represents.',
    pot_step2_eq: '8/20 = (8×5)/(20×5) = 40/100',
    pot_step2_exp: 'Make the denominator 100 by multiplying both numerator and denominator by 5.',
    pot_step3_eq: '40/100 = 40%',
    pot_step3_exp: 'When the denominator is 100, the numerator is the percentage. So 40/100 = 40%.',
  },
  hi: {
    // Navigation
    home: 'होम',
    introduction: 'परिचय',
    learn: 'सीखें',
    realWorld: 'वास्तविक दुनिया',
    simpleEquations: 'प्रतिशत - मात्राओं की तुलना का दूसरा तरीका',
    simpleEquationsTitle: 'प्रतिशत - मात्राओं की तुलना का दूसरा तरीका',
    
    // Home Page
    masterSimpleEquations: 'प्रतिशत रूपांतरण में महारत हासिल करें',
    masterClass7Mathematics: 'एनसीईआरटी पाठ्यक्रम के आधार पर इंटरैक्टिव सीखने, अभ्यास अभ्यास और आकर्षक गेम के साथ कक्षा 7 गणित में महारत हासिल करें',
    startLearning: 'सीखना शुरू करें',
    whatYoullLearn: 'आप क्या सीखेंगे',
    comprehensiveTools: 'सरल समीकरणों को सीखने को आकर्षक और प्रभावी बनाने के लिए डिज़ाइन किए गए व्यापक उपकरण',
    introductionDesc: 'इंटरैक्टिव उदाहरणों के साथ सरल समीकरणों की मूल बातें सीखें',
    learnDesc: 'दृश्य सहायता के साथ चरण-दर-चरण स्पष्टीकरण',
    practiceDesc: 'अभ्यास हल करें और अपने समाधान जांचें',
    realWorldDesc: 'देखें कि समीकरण रोजमर्रा की जिंदगी में कैसे लागू होते हैं',
    practiceProblems: 'अभ्यास समस्याएं',
    interactiveExamples: 'इंटरैक्टिव उदाहरण',
    readyToMaster: 'सरल समीकरणों में महारत हासिल करने के लिए तैयार हैं?',
    joinThousands: 'हजारों छात्रों और शिक्षकों में शामिल हों जो गणित को आकर्षक और सुलभ बना रहे हैं।',
    startYourJourney: 'अपनी यात्रा शुरू करें',
    
    // Common
    correct: 'सही!',
    incorrect: 'फिर कोशिश करें!',
    learning: 'सीखना',
    practice: 'अभ्यास',
    assessment: 'मूल्यांकन',
    selectEquation: 'समीकरण चुनें:',
    yourAnswer: 'आपका उत्तर:',
    submit: 'जमा करें',
    hint: 'संकेत',
    progress: 'प्रगति:',
    accuracy: 'सटीकता',
    avgTime: 'औसत समय',
    correctAnswers: 'सही',
    incorrectAnswers: 'गलत',
    totalExercises: 'कुल',
    excellent: 'उत्कृष्ट!',
    goodJob: 'अच्छा काम!',
    keepTrying: 'कोशिश करते रहें!',
    showSolution: 'समाधान दिखाएं',
    hideSolution: 'समाधान छुपाएं',
    reset: 'रीसेट',
    stepByStepSolution: 'चरण-दर-चरण समाधान:',
    nextStep: 'अगला चरण',
    complete: 'पूर्ण',
    
    // Real World
    realWorldApps: 'वास्तविक दुनिया के अनुप्रयोग',
    selectCategory: 'श्रेणी चुनें:',
    difficulty: 'कठिनाई:',
    beginner: 'शुरुआती',
    intermediate: 'मध्यम',
    advanced: 'उन्नत',
    equation: 'समीकरण:',
    solution: 'समाधान:',
    context: 'संदर्भ:',
    shopping: 'खरीदारी',
    cooking: 'खाना पकाना',
    construction: 'निर्माण',
    sports: 'खेल',
    finance: 'वित्त',
    science: 'विज्ञान',
    
    // Learn Section (Topic 7.1 Percentages)
    linearEquations: 'प्रतिशत',
    linearEquationsDesc: 'प्रतिशत (%) का अर्थ है “सौ में से”। भिन्न/दशमलव को प्रतिशत में बदलने के लिए 100 से गुणा करें; प्रतिशत को भिन्न में बदलने के लिए 100 से भाग दें। किसी पूर्ण के सभी भाग मिलकर 100% होते हैं।',
    solvingByAddition: 'जोड़ द्वारा हल करना',
    solvingByAdditionDesc: 'जब हमारे पास समीकरण में घटाव होता है, तो हम चर को अलग करने के लिए दोनों पक्षों में समान संख्या जोड़ते हैं। यह समीकरण के संतुलन को बनाए रखता है।',
    solvingBySubtraction: 'घटाव द्वारा हल करना',
    solvingBySubtractionDesc: 'जब हमारे पास समीकरण में जोड़ होता है, तो हम चर को अलग करने के लिए दोनों पक्षों से समान संख्या घटाते हैं। यह समीकरण के संतुलन को बनाए रखता है।',
    solvingByMultiplication: 'गुणा द्वारा हल करना',
    solvingByMultiplicationDesc: 'जब हमारे पास समीकरण में भाग होता है, तो हम चर को अलग करने के लिए दोनों पक्षों को समान संख्या से गुणा करते हैं। यह समीकरण के संतुलन को बनाए रखता है।',
    solvingByDivision: 'भाग द्वारा हल करना',
    solvingByDivisionDesc: 'जब हमारे पास समीकरण में गुणा होता है, तो हम चर को अलग करने के लिए दोनों पक्षों को समान संख्या से भाग देते हैं। यह समीकरण के संतुलन को बनाए रखता है।',
    originalEquation: 'मूल समीकरण',
    originalEquationWithSubtraction: 'घटाव के साथ मूल समीकरण',
    originalEquationWithAddition: 'जोड़ के साथ मूल समीकरण',
    originalEquationWithDivision: 'भाग के साथ मूल समीकरण',
    originalEquationWithMultiplication: 'गुणा के साथ मूल समीकरण',
    subtractFromBothSides: 'दोनों पक्षों से 5 घटाएं',
    addToBothSides: 'x को अलग करने के लिए दोनों पक्षों में 3 जोड़ें',
    subtractFromBothSidesToIsolate: 'x को अलग करने के लिए दोनों पक्षों से 4 घटाएं',
    multiplyBothSides: 'x को अलग करने के लिए दोनों पक्षों को 3 से गुणा करें',
    divideBothSides: 'x को अलग करने के लिए दोनों पक्षों को 3 से भाग दें',
    simplifyToFindAnswer: 'उत्तर ज्ञात करने के लिए सरल करें',
    simplifyStep: 'सरल करें: 5 - 5 = 0 और 12 - 5 = 7',
    verifySolution: 'x = 7 प्रतिस्थापित करके समाधान सत्यापित करें',
    simplifyAdditionStep: 'सरल करें: -3 + 3 = 0 और 8 + 3 = 11',
    verifyAdditionSolution: 'x = 11 प्रतिस्थापित करके समाधान सत्यापित करें',
    simplifySubtractionStep: 'सरल करें: 4 - 4 = 0 और 7 - 4 = 3',
    verifySubtractionSolution: 'x = 3 प्रतिस्थापित करके समाधान सत्यापित करें',
    simplifyMultiplicationStep: 'सरल करें: 3/3 = 1 और 4 × 3 = 12',
    verifyMultiplicationSolution: 'x = 12 प्रतिस्थापित करके समाधान सत्यापित करें',
    simplifyDivisionStep: 'सरल करें: 3x ÷ 3 = x और 15 ÷ 3 = 5',
    verifyDivisionSolution: 'x = 5 प्रतिस्थापित करके समाधान सत्यापित करें',
    linearEquationExample: 'रैखिक समीकरण उदाहरण',
    additionMethodExample: 'जोड़ विधि उदाहरण',
    subtractionMethodExample: 'घटाव विधि उदाहरण',
    multiplicationMethodExample: 'गुणा विधि उदाहरण',
    divisionMethodExample: 'भाग विधि उदाहरण',
    solving: 'हल करना:',
    play: 'चलाएं',
    pause: 'रोकें',
    previous: 'पिछला',
    next: 'अगला',
    
    // Practice Mode
    practiceMode: 'अभ्यास मोड',
    question: 'प्रश्न',
    skippedQuestions: 'छोड़े गए प्रश्न',
    notAttempted: 'प्रयास नहीं किया',
    totalQuestions: 'कुल प्रश्न',
    finalGrade: 'अंतिम ग्रेड',
    accuracyRate: 'सटीकता दर',
    avgTimePerQuestion: 'प्रति प्रश्न औसत समय',
    questionByQuestionReview: 'प्रश्न दर प्रश्न समीक्षा',
    startNewSession: 'नया सत्र शुरू करें',
    loadingQuestions: 'प्रश्न लोड हो रहे हैं...',
    showAnswer: 'उत्तर दिखाएं',
    hideAnswer: 'उत्तर छुपाएं',
    tryAgain: 'फिर कोशिश करें',
    skip: 'छोड़ें',
    skipped: 'छोड़ा गया',
    sessionComplete: 'सत्र पूरा!',
    sessionSummary: 'यहाँ आपका पूरा सत्र सारांश है',
    correctAnswer: 'सही उत्तर',
    check: 'जांच',
    notAttempt: 'प्रयास नहीं करें',
    
    // Practice Questions (Fractions → Percentages)
    // Practice Questions (All 4 Types: 2 each)
    practice_q1: '1/4 को प्रतिशत में बदलें।',
    practice_q2: '3/5 को प्रतिशत में बदलें।',
    practice_q3: '0.75 को प्रतिशत में बदलें।',
    practice_q4: '0.6 को प्रतिशत में बदलें।',
    practice_q5: '60% को भिन्न में बदलें।',
    practice_q6: '25% को भिन्न में बदलें।',
    practice_q7: '20 में से 8 कितना प्रतिशत है?',
    practice_q8: '30 में से 15 कितना प्रतिशत है?',
    
    // Comprehensive Percentage Tool
    percentageConversions: 'प्रतिशत रूपांतरण',
    clickOnAnyType: 'चरण-दर-चरण स्पष्टीकरण देखने के लिए किसी भी प्रकार पर क्लिक करें',
    backToTypes: 'प्रकारों पर वापस जाएं',
    
    // Conversion Types
    fractionToPercentage: 'भिन्न → प्रतिशत',
    decimalToPercentage: 'दशमलव → प्रतिशत',
    percentageToFraction: '% → भिन्न',
    partOfTotal: 'कुल का भाग',
    
    // Descriptions
    convertingFractionsToPercentages: 'भिन्न को प्रतिशत में बदलना',
    convertingDecimalsToPercentages: 'दशमलव को प्रतिशत में बदलना',
    convertingPercentagesToFractions: 'प्रतिशत को भिन्न में बदलना',
    findingPercentageOfPart: 'कुल में से भाग का प्रतिशत निकालना',
    
    // Common phrases
    step: 'चरण',
    answer: 'उत्तर',
    start: 'शुरू',
    result: 'परिणाम',
    part: 'भाग',
    empty: 'खाली',
    percentage: 'प्रतिशत',
    finalAnswer: 'अंतिम उत्तर',
    visualRepresentation: 'दृश्य प्रतिनिधित्व',
    outOf: 'में से',
    highlighted: 'हाइलाइट',
    coins: 'सिक्के',
    books: 'किताबें',
    eachGroup: 'प्रत्येक समूह',
    has: 'में',
    total: 'कुल',
    
    // Fraction to Percentage steps
    ftp_title: 'भिन्न से प्रतिशत: 1/4 × 100 = 25%',
    ftp_step1_eq: '1/4 = ?%',
    ftp_step1_exp: 'भिन्न 1/4 से शुरू करें। हम इसे प्रतिशत में बदलना चाहते हैं।',
    ftp_step1_visual: '4 में से 1 सिक्का हाइलाइट',
    ftp_step2_eq: '1/4 × 100',
    ftp_step2_exp: 'भिन्न को प्रतिशत में बदलने के लिए 100 से गुणा करें।',
    ftp_step3_eq: '100/4 = 25',
    ftp_step3_exp: 'अंश को 100 से गुणा करें: 1 × 100 = 100। फिर हर से भाग दें: 100 ÷ 4 = 25।',
    ftp_step4_eq: 'उत्तर: 25%',
    ftp_step4_exp: 'अंतिम उत्तर: 1/4 = 25%। इसका मतलब 4 सिक्कों में से 1 सिक्का 100 सिक्कों में से 25 सिक्कों के बराबर है।',
    
    // Decimal to Percentage steps
    dtp_title: 'दशमलव से प्रतिशत: 0.75 × 100 = 75%',
    dtp_step1_eq: '0.75 = ?%',
    dtp_step1_exp: 'दशमलव 0.75 से शुरू करें। हम इसे प्रतिशत में बदलना चाहते हैं।',
    dtp_step1_visual: '5 में से 1 किताब 0.75 (75%) दिखाती है',
    dtp_step2_eq: '0.75 × 100',
    dtp_step2_exp: 'दशमलव को प्रतिशत में बदलने के लिए 100 से गुणा करें।',
    dtp_step2_visual: '0.75 को 100 से गुणा करने पर 75 मिलता है',
    dtp_step3_eq: '75%',
    dtp_step3_exp: 'परिणाम 75 है, जिसका मतलब 100 में से 75, या 75% है।',
    dtp_step3_visual: 'अंतिम उत्तर: 0.75 = 75%',
    
    // Percentage to Fraction steps
    ptf_title: 'प्रतिशत से भिन्न: 60% = 3/5',
    ptf_step1_eq: '60% = ?',
    ptf_step1_exp: 'प्रतिशत 60% से शुरू करें। हम इसे भिन्न में बदलना चाहते हैं।',
    ptf_step2_eq: '60% = 60/100',
    ptf_step2_exp: 'प्रतिशत का अर्थ सौ में से होता है, इसलिए इसे 100 पर लिखें।',
    ptf_step3_eq: '60/100 = 3/5',
    ptf_step3_exp: 'अंश और हर दोनों को उनके सबसे बड़े सामान्य भाजक (20) से भाग देकर भिन्न को सरल बनाएं।',
    
    // Part of Total steps
    pot_title: 'कुल का भाग: 8/20 = 40%',
    pot_step1_eq: '8/20 = ?%',
    pot_step1_exp: 'भिन्न 8/20 से शुरू करें। हम यह जानना चाहते हैं कि यह कितना प्रतिशत दर्शाता है।',
    pot_step2_eq: '8/20 = (8×5)/(20×5) = 40/100',
    pot_step2_exp: 'अंश और हर दोनों को 5 से गुणा करके हर को 100 बनाएं।',
    pot_step3_eq: '40/100 = 40%',
    pot_step3_exp: 'जब हर 100 होता है, तो अंश प्रतिशत होता है। इसलिए 40/100 = 40%।',
  },
  gu: {
    // Navigation
    home: 'ઘર',
    introduction: 'પરિચય',
    learn: 'શીખો',
    realWorld: 'વાસ્તવિક વિશ્વ',
    simpleEquations: 'ટકાવારી - જથ્થાઓની તુલના કરવાની બીજી રીત',
    simpleEquationsTitle: 'ટકાવારી - જથ્થાઓની તુલના કરવાની બીજી રીત',
    
    // Home Page
    masterSimpleEquations: 'ટકાવારી રૂપાંતરણમાં નિપુણતા મેળવો',
    masterClass7Mathematics: 'એનસીઇઆરટી અભ્યાસક્રમના આધારે ઇન્ટરેક્ટિવ શીખવા, પ્રેક્ટિસ કસરતો અને આકર્ષક રમતો સાથે ધોરણ 7 ગણિતમાં નિપુણતા મેળવો',
    startLearning: 'શીખવાનું શરૂ કરો',
    whatYoullLearn: 'તમે શું શીખશો',
    comprehensiveTools: 'સરળ સમીકરણોને શીખવાનું આકર્ષક અને અસરકારક બનાવવા માટે ડિઝાઇન કરેલા વ્યાપક સાધનો',
    introductionDesc: 'ઇન્ટરેક્ટિવ ઉદાહરણો સાથે સરળ સમીકરણોની મૂળભૂત વાતો શીખો',
    learnDesc: 'વિઝ્યુઅલ સહાયતા સાથે પગલું-દર-પગલું સ્પષ્ટતા',
    practiceDesc: 'કસરતો હલ કરો અને તમારા ઉકેલો તપાસો',
    realWorldDesc: 'જુઓ કે સમીકરણો રોજિંદા જીવનમાં કેવી રીતે લાગુ પડે છે',
    practiceProblems: 'પ્રેક્ટિસ સમસ્યાઓ',
    interactiveExamples: 'ઇન્ટરેક્ટિવ ઉદાહરણો',
    readyToMaster: 'સરળ સમીકરણોમાં નિપુણતા મેળવવા માટે તૈયાર છો?',
    joinThousands: 'હજારો વિદ્યાર્થીઓ અને શિક્ષકોમાં જોડાઓ જે ગણિતને આકર્ષક અને સુલભ બનાવી રહ્યા છે.',
    startYourJourney: 'તમારી યાત્રા શરૂ કરો',
    
    // Common
    correct: 'સાચું!',
    incorrect: 'ફરી કોશિશ કરો!',
    learning: 'શીખવું',
    practice: 'પ્રેક્ટિસ',
    assessment: 'મૂલ્યાંકન',
    selectEquation: 'સમીકરણ પસંદ કરો:',
    yourAnswer: 'તમારો જવાબ:',
    submit: 'સબમિટ',
    hint: 'સંકેત',
    progress: 'પ્રગતિ:',
    accuracy: 'ચોકસાઈ',
    avgTime: 'સરેરાશ સમય',
    correctAnswers: 'સાચું',
    incorrectAnswers: 'ખોટું',
    totalExercises: 'કુલ',
    excellent: 'ઉત્તમ!',
    goodJob: 'સારું કામ!',
    keepTrying: 'કોશિશ કરતા રહો!',
    showSolution: 'ઉકેલ બતાવો',
    hideSolution: 'ઉકેલ છુપાવો',
    reset: 'રીસેટ',
    stepByStepSolution: 'પગલું-દર-પગલું ઉકેલ:',
    nextStep: 'આગળનું પગલું',
    complete: 'પૂર્ણ',
    
    // Real World
    realWorldApps: 'વાસ્તવિક વિશ્વના ઉપયોગો',
    selectCategory: 'શ્રેણી પસંદ કરો:',
    difficulty: 'મુશ્કેલી:',
    beginner: 'શરૂઆત',
    intermediate: 'મધ્યમ',
    advanced: 'અદ્યતન',
    equation: 'સમીકરણ:',
    solution: 'ઉકેલ:',
    context: 'સંદર્ભ:',
    shopping: 'ખરીદી',
    cooking: 'રસોઈ',
    construction: 'બાંધકામ',
    sports: 'રમત',
    finance: 'વિત્ત',
    science: 'વિજ્ઞાન',
    
    // Learn Section (Topic 7.1 Percentages)
    linearEquations: 'ટકાવારી',
    linearEquationsDesc: 'ટકાવારી (%) નો અર્થ “પ્રતિ સો” અને તે 100 માંથી ભાગો દર્શાવે છે. અપૂર્ણાંક/દશાંશને ટકાવારીમાં બદલવા માટે 100 વડે ગુણો; ટકાવારીને અપૂર્ણાંકમાં બદલવા માટે 100 વડે ભાગો. સંપૂર્ણના બધા ભાગો મળીને 100% થાય છે.',
    solvingByAddition: 'જોડાણ દ્વારા હલ કરવું',
    solvingByAdditionDesc: 'જ્યારે આપણી પાસે સમીકરણમાં બાદબાકી હોય છે, ત્યારે આપણે ચલને અલગ કરવા માટે બંને બાજુઓમાં સમાન સંખ્યા ઉમેરીએ છીએ. આ સમીકરણનું સંતુલન જાળવે છે.',
    solvingBySubtraction: 'બાદબાકી દ્વારા હલ કરવું',
    solvingBySubtractionDesc: 'જ્યારે આપણી પાસે સમીકરણમાં જોડાણ હોય છે, ત્યારે આપણે ચલને અલગ કરવા માટે બંને બાજુઓમાંથી સમાન સંખ્યા બાદ કરીએ છીએ. આ સમીકરણનું સંતુલન જાળવે છે.',
    solvingByMultiplication: 'ગુણાકાર દ્વારા હલ કરવું',
    solvingByMultiplicationDesc: 'જ્યારે આપણી પાસે સમીકરણમાં ભાગાકાર હોય છે, ત્યારે આપણે ચલને અલગ કરવા માટે બંને બાજુઓને સમાન સંખ્યા વડે ગુણીએ છીએ. આ સમીકરણનું સંતુલન જાળવે છે.',
    solvingByDivision: 'ભાગાકાર દ્વારા હલ કરવું',
    solvingByDivisionDesc: 'જ્યારે આપણી પાસે સમીકરણમાં ગુણાકાર હોય છે, ત્યારે આપણે ચલને અલગ કરવા માટે બંને બાજુઓને સમાન સંખ્યા વડે ભાગીએ છીએ. આ સમીકરણનું સંતુલન જાળવે છે.',
    originalEquation: 'મૂળ સમીકરણ',
    originalEquationWithSubtraction: 'બાદબાકી સાથે મૂળ સમીકરણ',
    originalEquationWithAddition: 'જોડાણ સાથે મૂળ સમીકરણ',
    originalEquationWithDivision: 'ભાગાકાર સાથે મૂળ સમીકરણ',
    originalEquationWithMultiplication: 'ગુણાકાર સાથે મૂળ સમીકરણ',
    subtractFromBothSides: 'બંને બાજુઓમાંથી 5 બાદ કરો',
    addToBothSides: 'x ને અલગ કરવા માટે બંને બાજુઓમાં 3 ઉમેરો',
    subtractFromBothSidesToIsolate: 'x ને અલગ કરવા માટે બંને બાજુઓમાંથી 4 બાદ કરો',
    multiplyBothSides: 'x ને અલગ કરવા માટે બંને બાજુઓને 3 વડે ગુણો',
    divideBothSides: 'x ને અલગ કરવા માટે બંને બાજુઓને 3 વડે ભાગો',
    simplifyToFindAnswer: 'જવાબ શોધવા માટે સરળ બનાવો',
    simplifyStep: 'સરળ બનાવો: 5 - 5 = 0 અને 12 - 5 = 7',
    verifySolution: 'x = 7 મૂકીને ઉકેલ ચકાસો',
    simplifyAdditionStep: 'સરળ બનાવો: -3 + 3 = 0 અને 8 + 3 = 11',
    verifyAdditionSolution: 'x = 11 મૂકીને ઉકેલ ચકાસો',
    simplifySubtractionStep: 'સરળ બનાવો: 4 - 4 = 0 અને 7 - 4 = 3',
    verifySubtractionSolution: 'x = 3 મૂકીને ઉકેલ ચકાસો',
    simplifyMultiplicationStep: 'સરળ બનાવો: 3/3 = 1 અને 4 × 3 = 12',
    verifyMultiplicationSolution: 'x = 12 મૂકીને ઉકેલ ચકાસો',
    simplifyDivisionStep: 'સરળ બનાવો: 3x ÷ 3 = x અને 15 ÷ 3 = 5',
    verifyDivisionSolution: 'x = 5 મૂકીને ઉકેલ ચકાસો',
    linearEquationExample: 'રેખીય સમીકરણ ઉદાહરણ',
    additionMethodExample: 'જોડાણ પદ્ધતિ ઉદાહરણ',
    subtractionMethodExample: 'બાદબાકી પદ્ધતિ ઉદાહરણ',
    multiplicationMethodExample: 'ગુણાકાર પદ્ધતિ ઉદાહરણ',
    divisionMethodExample: 'ભાગાકાર પદ્ધતિ ઉદાહરણ',
    solving: 'હલ કરવું:',
    play: 'ચલાવો',
    pause: 'રોકો',
    previous: 'પાછલું',
    next: 'આગળનું',
    
    // Practice Mode
    practiceMode: 'પ્રેક્ટિસ મોડ',
    question: 'પ્રશ્ન',
    skippedQuestions: 'છોડેલા પ્રશ્નો',
    notAttempted: 'પ્રયાસ નથી કર્યો',
    totalQuestions: 'કુલ પ્રશ્નો',
    finalGrade: 'અંતિમ ગ્રેડ',
    accuracyRate: 'ચોકસાઈ દર',
    avgTimePerQuestion: 'પ્રતિ પ્રશ્ન સરેરાશ સમય',
    questionByQuestionReview: 'પ્રશ્ન દર પ્રશ્ન સમીક્ષા',
    startNewSession: 'નવો સત્ર શરૂ કરો',
    loadingQuestions: 'પ્રશ્નો લોડ થઈ રહ્યા છે...',
    showAnswer: 'જવાબ બતાવો',
    hideAnswer: 'જવાબ છુપાવો',
    tryAgain: 'ફરી કોશિશ કરો',
    skip: 'છોડો',
    skipped: 'છોડાયેલું',
    sessionComplete: 'સત્ર પૂર્ણ!',
    sessionSummary: 'અહીં તમારો સંપૂર્ણ સત્ર સારાંશ છે',
    correctAnswer: 'સાચો જવાબ',
    check: 'તપાસ',
    notAttempt: 'પ્રયાસ ન કરો',
    
    // Practice Questions (Fractions → Percentages)
    // Practice Questions (All 4 Types: 2 each)
    practice_q1: '1/4 ને ટકાવારીમાં બદલો।',
    practice_q2: '3/5 ને ટકાવારીમાં બદલો।',
    practice_q3: '0.75 ને ટકાવારીમાં બદલો।',
    practice_q4: '0.6 ને ટકાવારીમાં બદલો।',
    practice_q5: '60% ને અપૂર્ણાંકમાં બદલો।',
    practice_q6: '25% ને અપૂર્ણાંકમાં બદલો।',
    practice_q7: '20 માંથી 8 કેટલા ટકા છે?',
    practice_q8: '30 માંથી 15 કેટલા ટકા છે?',
    
    // Comprehensive Percentage Tool
    percentageConversions: 'ટકાવારી રૂપાંતરણ',
    clickOnAnyType: 'પગલું-દર-પગલું સ્પષ્ટતા જોવા માટે કોઈ પણ પ્રકાર પર ક્લિક કરો',
    backToTypes: 'પ્રકારો પર પાછા જાઓ',
    
    // Conversion Types
    fractionToPercentage: 'અપૂર્ણાંક → ટકાવારી',
    decimalToPercentage: 'દશાંશ → ટકાવારી',
    percentageToFraction: '% → અપૂર્ણાંક',
    partOfTotal: 'કુલનો ભાગ',
    
    // Descriptions
    convertingFractionsToPercentages: 'અપૂર્ણાંકને ટકાવારીમાં બદલવું',
    convertingDecimalsToPercentages: 'દશાંશને ટકાવારીમાં બદલવું',
    convertingPercentagesToFractions: 'ટકાવારીને અપૂર્ણાંકમાં બદલવું',
    findingPercentageOfPart: 'કુલમાંથી ભાગની ટકાવારી શોધવી',
    
    // Common phrases
    step: 'પગલું',
    answer: 'ઉત્તર',
    start: 'શરૂ',
    result: 'પરિણામ',
    part: 'ભાગ',
    empty: 'ખાલી',
    percentage: 'ટકાવારી',
    finalAnswer: 'અંતિમ જવાબ',
    visualRepresentation: 'દૃશ્ય પ્રતિનિધિત્વ',
    outOf: 'માંથી',
    highlighted: 'હાઇલાઇટ',
    coins: 'સિક્કા',
    books: 'પુસ્તકો',
    eachGroup: 'દરેક જૂથ',
    has: 'માં',
    total: 'કુલ',
    
    // Fraction to Percentage steps
    ftp_title: 'અપૂર્ણાંકથી ટકાવારી: 1/4 × 100 = 25%',
    ftp_step1_eq: '1/4 = ?%',
    ftp_step1_exp: 'અપૂર્ણાંક 1/4 થી શરૂ કરો। અમે તેને ટકાવારીમાં બદલવા માંગીએ છીએ.',
    ftp_step1_visual: '4 માંથી 1 સિક્કો હાઇલાઇટ',
    ftp_step2_eq: '1/4 × 100',
    ftp_step2_exp: 'અપૂર્ણાંકને ટકાવારીમાં બદલવા માટે 100 વડે ગુણો.',
    ftp_step3_eq: '100/4 = 25',
    ftp_step3_exp: 'અંશને 100 વડે ગુણો: 1 × 100 = 100। પછી હર વડે ભાગો: 100 ÷ 4 = 25.',
    ftp_step4_eq: 'જવાબ: 25%',
    ftp_step4_exp: 'અંતિમ જવાબ: 1/4 = 25%। આનો અર્થ 4 સિક્કામાંથી 1 સિક્કો 100 સિક્કામાંથી 25 સિક્કા બરાબર છે.',
    
    // Decimal to Percentage steps
    dtp_title: 'દશાંશથી ટકાવારી: 0.75 × 100 = 75%',
    dtp_step1_eq: '0.75 = ?%',
    dtp_step1_exp: 'દશાંશ 0.75 થી શરૂ કરો। અમે તેને ટકાવારીમાં બદલવા માંગીએ છીએ.',
    dtp_step1_visual: '5 માંથી 1 પુસ્તક 0.75 (75%) દર્શાવે છે',
    dtp_step2_eq: '0.75 × 100',
    dtp_step2_exp: 'દશાંશને ટકાવારીમાં બદલવા માટે 100 વડે ગુણો.',
    dtp_step2_visual: '0.75 ને 100 વડે ગુણતાં 75 મળે છે',
    dtp_step3_eq: '75%',
    dtp_step3_exp: 'પરિણામ 75 છે, જેનો અર્થ 100 માંથી 75, અથવા 75% છે.',
    dtp_step3_visual: 'અંતિમ જવાબ: 0.75 = 75%',
    
    // Percentage to Fraction steps
    ptf_title: 'ટકાવારીથી અપૂર્ણાંક: 60% = 3/5',
    ptf_step1_eq: '60% = ?',
    ptf_step1_exp: 'ટકાવારી 60% થી શરૂ કરો। અમે તેને અપૂર્ણાંકમાં બદલવા માંગીએ છીએ.',
    ptf_step2_eq: '60% = 60/100',
    ptf_step2_exp: 'ટકાવારીનો અર્થ પ્રતિ સો થાય છે, તેથી તેને 100 પર લખો.',
    ptf_step3_eq: '60/100 = 3/5',
    ptf_step3_exp: 'અંશ અને હર બંનેને તેમના સૌથી મોટા સામાન્ય ભાજક (20) વડે ભાગીને અપૂર્ણાંકને સરળ બનાવો.',
    
    // Part of Total steps
    pot_title: 'કુલનો ભાગ: 8/20 = 40%',
    pot_step1_eq: '8/20 = ?%',
    pot_step1_exp: 'અપૂર્ણાંક 8/20 થી શરૂ કરો। અમે જાણવા માંગીએ છીએ કે આ કેટલી ટકાવારી દર્શાવે છે.',
    pot_step2_eq: '8/20 = (8×5)/(20×5) = 40/100',
    pot_step2_exp: 'અંશ અને હર બંનેને 5 વડે ગુણીને હરને 100 બનાવો.',
    pot_step3_eq: '40/100 = 40%',
    pot_step3_exp: 'જ્યારે હર 100 હોય છે, ત્યારે અંશ ટકાવારી હોય છે. તેથી 40/100 = 40%।',
  }
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'hi' | 'gu'>(() => {
    // Load language from localStorage on initialization
    const savedLanguage = localStorage.getItem('selectedLanguage') as 'en' | 'hi' | 'gu' | null;
    return savedLanguage || 'en';
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  const localizeDigitsInText = (text: string): string => {
    // For now, just return the text as-is
    // In a real implementation, this would convert digits to the appropriate script
    return text;
  };

  const formatNumber = (num: number): string => {
    return num.toString();
  };

  const handleSetLanguage = (lang: 'en' | 'hi' | 'gu') => {
    setIsTransitioning(true);
    // Save language to localStorage
    localStorage.setItem('selectedLanguage', lang);
    setTimeout(() => {
      setLanguage(lang);
      setIsTransitioning(false);
    }, 100); // Further reduced for smoother switching
  };

  const value: LanguageContextType = {
    language,
    setLanguage: handleSetLanguage,
    t,
    isTransitioning,
    localizeDigitsInText,
    formatNumber
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
