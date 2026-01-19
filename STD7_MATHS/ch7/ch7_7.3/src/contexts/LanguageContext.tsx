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
    simpleEquations: 'PRICES RELATED TO AN ITEM OR BUYING AND SELLING',
    simpleEquationsTitle: 'PRICES RELATED TO AN ITEM OR BUYING AND SELLING',
    
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
    
    // Learn Section (Topic 7.3 Profit and Loss)
    linearEquations: 'Prices Related to an Item or Buying and Selling',
    linearEquationsDesc: 'Cost Price (CP) is the price at which an item is bought. Selling Price (SP) is the price at which an item is sold. Profit occurs when SP > CP, Loss occurs when CP > SP. Profit % and Loss % are calculated on Cost Price.',
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
    
    // Practice Questions (Topic 7.3 Profit and Loss - 8 questions: 2 each for 4 concepts)
    practice_q1: 'Profit Calculation: If CP = ₹100 and SP = ₹120, find the profit.',
    practice_q2: 'Profit Calculation: If CP = ₹250 and SP = ₹300, find the profit.',
    practice_q3: 'Loss Calculation: If CP = ₹150 and SP = ₹120, find the loss.',
    practice_q4: 'Loss Calculation: If CP = ₹400 and SP = ₹350, find the loss.',
    practice_q5: 'Profit Percentage: If CP = ₹200 and profit = ₹40, find profit %.',
    practice_q6: 'Profit Percentage: If CP = ₹500 and profit = ₹75, find profit %.',
    practice_q7: 'Loss Percentage: If CP = ₹300 and loss = ₹45, find loss %.',
    practice_q8: 'Loss Percentage: If CP = ₹600 and loss = ₹90, find loss %.',
    
    // ComprehensivePercentageTool (Topic 7.3)
    cpt_title: 'Percentage Conversions',
    cpt_clickInstruction: 'Click on any type to see step-by-step explanation',
    cpt_backToTypes: 'Back to Types',
    cpt_step: 'Step',
    cpt_fractionToPercentTitle: 'Fraction → Percentage',
    cpt_fractionToPercentEq: '1/4 × 100 = 25%',
    cpt_fractionToPercentDesc: 'Converting fractions to percentages',
    cpt_decimalToPercentTitle: 'Decimal → Percentage',
    cpt_decimalToPercentEq: '0.75 × 100 = 75%',
    cpt_decimalToPercentDesc: 'Converting decimals to percentages',
    cpt_percentToFractionTitle: '% → Fraction',
    cpt_percentToFractionEq: '60% = 60/100 = 3/5',
    cpt_percentToFractionDesc: 'Converting percentages to fractions',
    cpt_partOfTotalTitle: 'Part of Total',
    cpt_partOfTotalEq: '8/20 = (8×5)/(20×5) = 40/100 = 40%',
    cpt_partOfTotalDesc: 'Finding percentage of a part from total',
    
    // Step explanation strings for ComprehensivePercentageTool
    step_fractionToPercent_title: 'Fraction to Percentage: 1/4 × 100 = 25%',
    step_fractionToPercent_step1_explanation: 'Start with the fraction 1/4. We want to convert this to a percentage.',
    step_fractionToPercent_step1_visual: '1 out of 4 coins highlighted',
    step_fractionToPercent_step2_explanation: 'To convert a fraction to percentage, multiply by 100.',
    step_fractionToPercent_step3_explanation: 'Multiply numerator by 100: 1 × 100 = 100. Then divide by denominator: 100 ÷ 4 = 25.',
    step_fractionToPercent_step3_visual: 'Each group has 25 coins',
    step_fractionToPercent_step4_explanation: 'Final answer: 1/4 = 25%. This means 1 out of 4 coins equals 25 out of 100 coins.',
    step_fractionToPercent_step4_visual: 'Visual representation',
    
    step_decimalToPercent_title: 'Decimal to Percentage: 0.75 × 100 = 75%',
    step_decimalToPercent_step1_explanation: 'Start with the decimal 0.75. We want to convert this to a percentage.',
    step_decimalToPercent_step1_visual: '3 out of 4 books',
    step_decimalToPercent_step2_explanation: 'To convert a decimal to percentage, multiply by 100.',
    step_decimalToPercent_step3_explanation: 'The result is 75, which means 75 out of 100, or 75%.',
    step_decimalToPercent_step3_visual: '75% of the books',
    
    step_percentToFraction_title: 'Percentage to Fraction: 60% = 3/5',
    step_percentToFraction_step1_explanation: 'Start with the percentage 60%. We want to convert this to a fraction.',
    step_percentToFraction_step1_visual: '3 out of 5 glasses filled',
    step_percentToFraction_step2_explanation: 'Percentage means per hundred, so write it over 100.',
    step_percentToFraction_step3_explanation: 'Simplify by dividing numerator and denominator by 20: 60÷20 = 3, 100÷20 = 5.',
    step_percentToFraction_step3_visual: 'Simplified: 3/5',
    
    step_partOfTotal_title: 'Part of Total: 8/20 = 40%',
    step_partOfTotal_step1_explanation: 'Start with the fraction 8/20. We want to convert this to a percentage.',
    step_partOfTotal_step1_visual: '8 out of 20 candles lit',
    step_partOfTotal_step2_explanation: 'Find an equivalent fraction over 100 by multiplying numerator and denominator by 5.',
    step_partOfTotal_step3_explanation: 'Now the denominator is 100, so it reads 40 out of 100, which is 40%.',
    step_partOfTotal_step3_visual: '40% of the total',
  },
  hi: {
    // Navigation
    home: 'होम',
    introduction: 'परिचय',
    learn: 'सीखें',
    realWorld: 'वास्तविक दुनिया',
    simpleEquations: 'किसी वस्तु से संबंधित मूल्य या खरीद और बिक्री',
    simpleEquationsTitle: 'किसी वस्तु से संबंधित मूल्य या खरीद और बिक्री',
    
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
    
    // Learn Section (Topic 7.3 Profit and Loss)
    linearEquations: 'किसी वस्तु से संबंधित मूल्य या खरीद और बिक्री',
    linearEquationsDesc: 'क्रय मूल्य (CP) वह मूल्य है जिस पर कोई वस्तु खरीदी जाती है। विक्रय मूल्य (SP) वह मूल्य है जिस पर कोई वस्तु बेची जाती है। लाभ तब होता है जब SP > CP, हानि तब होती है जब CP > SP। लाभ % और हानि % की गणना क्रय मूल्य पर की जाती है।',
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
    
    // Practice Questions (Topic 7.3 Profit and Loss - 8 questions: 2 each for 4 concepts)
    practice_q1: 'लाभ गणना: यदि CP = ₹100 और SP = ₹120, तो लाभ ज्ञात करें।',
    practice_q2: 'लाभ गणना: यदि CP = ₹250 और SP = ₹300, तो लाभ ज्ञात करें।',
    practice_q3: 'हानि गणना: यदि CP = ₹150 और SP = ₹120, तो हानि ज्ञात करें।',
    practice_q4: 'हानि गणना: यदि CP = ₹400 और SP = ₹350, तो हानि ज्ञात करें।',
    practice_q5: 'लाभ प्रतिशत: यदि CP = ₹200 और लाभ = ₹40, तो लाभ % ज्ञात करें।',
    practice_q6: 'लाभ प्रतिशत: यदि CP = ₹500 और लाभ = ₹75, तो लाभ % ज्ञात करें।',
    practice_q7: 'हानि प्रतिशत: यदि CP = ₹300 और हानि = ₹45, तो हानि % ज्ञात करें।',
    practice_q8: 'हानि प्रतिशत: यदि CP = ₹600 और हानि = ₹90, तो हानि % ज्ञात करें।',
    
    // ComprehensivePercentageTool (Topic 7.3)
    cpt_title: 'प्रतिशत रूपांतरण',
    cpt_clickInstruction: 'किसी भी प्रकार पर क्लिक करें चरण-दर-चरण व्याख्या देखने के लिए',
    cpt_backToTypes: 'प्रकारों पर वापस जाएं',
    cpt_step: 'चरण',
    cpt_fractionToPercentTitle: 'भिन्न → प्रतिशत',
    cpt_fractionToPercentEq: '1/4 × 100 = 25%',
    cpt_fractionToPercentDesc: 'भिन्न को प्रतिशत में बदलना',
    cpt_decimalToPercentTitle: 'दशमलव → प्रतिशत',
    cpt_decimalToPercentEq: '0.75 × 100 = 75%',
    cpt_decimalToPercentDesc: 'दशमलव को प्रतिशत में बदलना',
    cpt_percentToFractionTitle: '% → भिन्न',
    cpt_percentToFractionEq: '60% = 60/100 = 3/5',
    cpt_percentToFractionDesc: 'प्रतिशत को भिन्न में बदलना',
    cpt_partOfTotalTitle: 'कुल का भाग',
    cpt_partOfTotalEq: '8/20 = (8×5)/(20×5) = 40/100 = 40%',
    cpt_partOfTotalDesc: 'कुल में से भाग का प्रतिशत निकालना',
    
    // Step explanation strings for ComprehensivePercentageTool (Hindi)
    step_fractionToPercent_title: 'भिन्न से प्रतिशत: 1/4 × 100 = 25%',
    step_fractionToPercent_step1_explanation: 'भिन्न 1/4 से शुरू करें। हम इसे प्रतिशत में बदलना चाहते हैं।',
    step_fractionToPercent_step1_visual: '4 सिक्कों में से 1 सिक्का हाइलाइट किया गया',
    step_fractionToPercent_step2_explanation: 'भिन्न को प्रतिशत में बदलने के लिए 100 से गुणा करें।',
    step_fractionToPercent_step3_explanation: 'अंश को 100 से गुणा करें: 1 × 100 = 100। फिर हर से भाग दें: 100 ÷ 4 = 25।',
    step_fractionToPercent_step3_visual: 'प्रत्येक समूह में 25 सिक्के हैं',
    step_fractionToPercent_step4_explanation: 'अंतिम उत्तर: 1/4 = 25%। इसका मतलब है कि 4 सिक्कों में से 1 सिक्का 100 सिक्कों में से 25 सिक्कों के बराबर है।',
    step_fractionToPercent_step4_visual: 'दृश्य प्रतिनिधित्व',
    
    step_decimalToPercent_title: 'दशमलव से प्रतिशत: 0.75 × 100 = 75%',
    step_decimalToPercent_step1_explanation: 'दशमलव 0.75 से शुरू करें। हम इसे प्रतिशत में बदलना चाहते हैं।',
    step_decimalToPercent_step1_visual: '4 किताबों में से 3 किताबें',
    step_decimalToPercent_step2_explanation: 'दशमलव को प्रतिशत में बदलने के लिए 100 से गुणा करें।',
    step_decimalToPercent_step3_explanation: 'परिणाम 75 है, जिसका मतलब है 100 में से 75, या 75%।',
    step_decimalToPercent_step3_visual: 'किताबों का 75%',
    
    step_percentToFraction_title: 'प्रतिशत से भिन्न: 60% = 3/5',
    step_percentToFraction_step1_explanation: 'प्रतिशत 60% से शुरू करें। हम इसे भिन्न में बदलना चाहते हैं।',
    step_percentToFraction_step1_visual: '5 गिलास में से 3 गिलास भरे हुए',
    step_percentToFraction_step2_explanation: 'प्रतिशत का अर्थ है प्रति सौ, इसलिए इसे 100 के ऊपर लिखें।',
    step_percentToFraction_step3_explanation: 'अंश और हर को 20 से भाग देकर सरल करें: 60÷20 = 3, 100÷20 = 5।',
    step_percentToFraction_step3_visual: 'सरलीकृत: 3/5',
    
    step_partOfTotal_title: 'कुल का भाग: 8/20 = 40%',
    step_partOfTotal_step1_explanation: 'भिन्न 8/20 से शुरू करें। हम इसे प्रतिशत में बदलना चाहते हैं।',
    step_partOfTotal_step1_visual: '20 मोमबत्तियों में से 8 मोमबत्तियां जली हुई',
    step_partOfTotal_step2_equation: 'हर को 100 बनाएं',
    step_partOfTotal_step2_explanation: 'अंश और हर को 5 से गुणा करके 100 के ऊपर एक समतुल्य भिन्न खोजें।',
    step_partOfTotal_step3_explanation: 'अब हर 100 है, इसलिए यह 100 में से 40 पढ़ता है, जो 40% है।',
    step_partOfTotal_step3_visual: 'कुल का 40%',
  },
  gu: {
    // Navigation
    home: 'ઘર',
    introduction: 'પરિચય',
    learn: 'શીખો',
    realWorld: 'વાસ્તવિક વિશ્વ',
    simpleEquations: 'કોઈ વસ્તુ સાથે સંબંધિત કિંમતો અથવા ખરીદી અને વેચાણ',
    simpleEquationsTitle: 'કોઈ વસ્તુ સાથે સંબંધિત કિંમતો અથવા ખરીદી અને વેચાણ',
    
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
    
    // Learn Section (Topic 7.3 Profit and Loss)
    linearEquations: 'કોઈ વસ્તુ સાથે સંબંધિત કિંમતો અથવા ખરીદી અને વેચાણ',
    linearEquationsDesc: 'ક્રય મૂલ્ય (CP) એ કિંમત છે જેના પર કોઈ વસ્તુ ખરીદવામાં આવે છે। વિક્રય મૂલ્ય (SP) એ કિંમત છે જેના પર કોઈ વસ્તુ વેચવામાં આવે છે। નફો ત્યારે થાય છે જ્યારે SP > CP, નુકસાન ત્યારે થાય છે જ્યારે CP > SP। નફા % અને નુકસાન % ની ગણતરી ક્રય મૂલ્ય પર કરવામાં આવે છે।',
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
    
    // Practice Questions (Topic 7.3 Profit and Loss - 8 questions: 2 each for 4 concepts)
    practice_q1: 'નફો ગણતરી: જો CP = ₹100 અને SP = ₹120, તો નફો શોધો।',
    practice_q2: 'નફો ગણતરી: જો CP = ₹250 અને SP = ₹300, તો નફો શોધો।',
    practice_q3: 'નુકસાન ગણતરી: જો CP = ₹150 અને SP = ₹120, તો નુકસાન શોધો।',
    practice_q4: 'નુકસાન ગણતરી: જો CP = ₹400 અને SP = ₹350, તો નુકસાન શોધો।',
    practice_q5: 'નફો ટકાવારી: જો CP = ₹200 અને નફો = ₹40, તો નફો % શોધો।',
    practice_q6: 'નફો ટકાવારી: જો CP = ₹500 અને નફો = ₹75, તો નફો % શોધો।',
    practice_q7: 'નુકસાન ટકાવારી: જો CP = ₹300 અને નુકસાન = ₹45, તો નુકસાન % શોધો।',
    practice_q8: 'નુકસાન ટકાવારી: જો CP = ₹600 અને નુકસાન = ₹90, તો નુકસાન % શોધો।',
    
    // ComprehensivePercentageTool (Topic 7.3)
    cpt_title: 'ટકાવારી રૂપાંતરણ',
    cpt_clickInstruction: 'કોઈપણ પ્રકાર પર ક્લિક કરો પગલું-દર-પગલું સમજાવવા માટે',
    cpt_backToTypes: 'પ્રકારો પર પાછા જાઓ',
    cpt_step: 'પગલું',
    cpt_fractionToPercentTitle: 'અપૂર્ણાંક → ટકાવારી',
    cpt_fractionToPercentEq: '1/4 × 100 = 25%',
    cpt_fractionToPercentDesc: 'અપૂર્ણાંકને ટકાવારીમાં બદલવું',
    cpt_decimalToPercentTitle: 'દશાંશ → ટકાવારી',
    cpt_decimalToPercentEq: '0.75 × 100 = 75%',
    cpt_decimalToPercentDesc: 'દશાંશને ટકાવારીમાં બદલવું',
    cpt_percentToFractionTitle: '% → અપૂર્ણાંક',
    cpt_percentToFractionEq: '60% = 60/100 = 3/5',
    cpt_percentToFractionDesc: 'ટકાવારીને અપૂર્ણાંકમાં બદલવું',
    cpt_partOfTotalTitle: 'કુલનો ભાગ',
    cpt_partOfTotalEq: '8/20 = (8×5)/(20×5) = 40/100 = 40%',
    cpt_partOfTotalDesc: 'કુલમાંથી ભાગની ટકાવારી શોધવી',
    
    // Step explanation strings for ComprehensivePercentageTool (Gujarati)
    step_fractionToPercent_title: 'અપૂર્ણાંકથી ટકાવારી: 1/4 × 100 = 25%',
    step_fractionToPercent_step1_explanation: 'અપૂર્ણાંક 1/4 થી શરૂ કરો। અમે તેને ટકાવારીમાં બદલવા માંગીએ છીએ.',
    step_fractionToPercent_step1_visual: '4 સિક્કામાંથી 1 સિક્કો હાઇલાઇટ કર્યો',
    step_fractionToPercent_step2_explanation: 'અપૂર્ણાંકને ટકાવારીમાં બદલવા માટે 100 વડે ગુણો.',
    step_fractionToPercent_step3_explanation: 'અંશને 100 વડે ગુણો: 1 × 100 = 100. પછી છેદ વડે ભાગો: 100 ÷ 4 = 25.',
    step_fractionToPercent_step3_visual: 'દરેક જૂથમાં 25 સિક્કા છે',
    step_fractionToPercent_step4_explanation: 'અંતિમ જવાબ: 1/4 = 25%. આનો અર્થ 4 સિક્કામાંથી 1 સિક્કો 100 સિક્કામાંથી 25 સિક્કા બરાબર છે.',
    step_fractionToPercent_step4_visual: 'દ્રશ્ય પ્રતિનિધિત્વ',
    
    step_decimalToPercent_title: 'દશાંશથી ટકાવારી: 0.75 × 100 = 75%',
    step_decimalToPercent_step1_explanation: 'દશાંશ 0.75 થી શરૂ કરો। અમે તેને ટકાવારીમાં બદલવા માંગીએ છીએ.',
    step_decimalToPercent_step1_visual: '4 પુસ્તકોમાંથી 3 પુસ્તકો',
    step_decimalToPercent_step2_explanation: 'દશાંશને ટકાવારીમાં બદલવા માટે 100 વડે ગુણો.',
    step_decimalToPercent_step3_explanation: 'પરિણામ 75 છે, જેનો અર્થ 100 માંથી 75, અથવા 75% છે.',
    step_decimalToPercent_step3_visual: 'પુસ્તકોનો 75%',
    
    step_percentToFraction_title: 'ટકાવારીથી અપૂર્ણાંક: 60% = 3/5',
    step_percentToFraction_step1_explanation: 'ટકાવારી 60% થી શરૂ કરો। અમે તેને અપૂર્ણાંકમાં બદલવા માંગીએ છીએ.',
    step_percentToFraction_step1_visual: '5 ગ્લાસમાંથી 3 ગ્લાસ ભરેલા',
    step_percentToFraction_step2_explanation: 'ટકા એટલે પ્રતિ સો, તેથી તેને 100 ની ઉપર લખો.',
    step_percentToFraction_step3_explanation: 'અંશ અને છેદને 20 વડે ભાગીને સરળ બનાવો: 60÷20 = 3, 100÷20 = 5.',
    step_percentToFraction_step3_visual: 'સરળ: 3/5',
    
    step_partOfTotal_title: 'કુલનો ભાગ: 8/20 = 40%',
    step_partOfTotal_step1_explanation: 'અપૂર્ણાંક 8/20 થી શરૂ કરો। અમે તેને ટકાવારીમાં બદલવા માંગીએ છીએ.',
    step_partOfTotal_step1_visual: '20 મોમબત્તીઓમાંથી 8 મોમબત્તીઓ પ્રકાશિત',
    step_partOfTotal_step2_equation: 'હરને 100 બનાવો',
    step_partOfTotal_step2_explanation: 'અંશ અને છેદને 5 વડે ગુણીને 100 ની ઉપર એક સમકક્ષ અપૂર્ણાંક શોધો.',
    step_partOfTotal_step3_explanation: 'હવે છેદ 100 છે, તેથી તે 100 માંથી 40 વાંચે છે, જે 40% છે.',
    step_partOfTotal_step3_visual: 'કુલનો 40%',
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
