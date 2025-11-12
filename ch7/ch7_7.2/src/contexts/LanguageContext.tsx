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
    simpleEquations: 'Use of Percentages',
    simpleEquationsTitle: 'Use of Percentages',
    
    // Home Page
    masterSimpleEquations: 'Master Use of Percentages',
    masterClass7Mathematics: 'Master Class 7 Mathematics with interactive learning, practice exercises, and engaging games based on NCERT curriculum',
    startLearning: 'Start Learning',
    whatYoullLearn: 'What You\'ll Learn',
    comprehensiveTools: 'Comprehensive tools designed to make learning percentage applications engaging and effective',
    introductionDesc: 'Learn practical applications of percentages with interactive examples',
    learnDesc: 'Step-by-step explanations with visual aids',
    practiceDesc: 'Solve percentage application exercises and check your solutions',
    realWorldDesc: 'See how percentages apply in everyday life situations',
    practiceProblems: 'Practice Problems',
    interactiveExamples: 'Interactive Examples',
    readyToMaster: 'Ready to Master Use of Percentages?',
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
    
    // Learn Section (Topic 7.2 Use of Percentages)
    linearEquations: 'Percentages',
    linearEquationsDesc: 'Percentages express parts per hundred in real life (for example: saving 5% = ₹5 per ₹100; 20% blue = 20 in 100). Find "how many" by (% × total). Convert ratios to percentages using part/total × 100 (for example: 2:1 ⇒ 2/3 = 66⅔%, 1/3 = 33⅓%). Percentage change = (change/original) × 100. Profit/Loss is on CP: Profit% = (SP−CP)/CP × 100; Loss% = (CP−SP)/CP × 100.',
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
    
    // Practice Questions (Use of Percentages - Topic 7.2)
    practice_q1: 'Interpret % Statement: If 25% of 40 children like football, how many children like football?',
    practice_q2: 'Interpret % Statement: If 20% of 150 dresses are blue, how many dresses are blue?',
    practice_q3: '% of a Total: If 15% of ₹2000 income is saved, how much is saved?',
    practice_q4: '% of a Total: If 30% of 80 students are girls, how many are girls?',
    practice_q5: 'Ratio → %: A mixture has sugar and salt in ratio 3:2. What percentage is sugar?',
    practice_q6: 'Ratio → %: A mixture has water and milk in ratio 4:1. What percentage is water?',
    practice_q7: '% Change: If a price increases from ₹280 to ₹350, what is the percentage increase?',
    practice_q8: '% Change: If a price decreases from ₹500 to ₹400, what is the percentage decrease?',
    
    // ComprehensivePercentageTool (Topic 7.2)
    cpt_title: 'Use of Percentages',
    cpt_clickInstruction: 'Click on any type to see step-by-step explanation',
    cpt_backToTypes: 'Back to Types',
    cpt_interpretTitle: 'Interpret Percentage Statement',
    cpt_interpretEq: '5% * ₹100 = ₹5',
    cpt_interpretDesc: 'Understanding what percentage means with cars',
    cpt_percentOfTotalTitle: 'Percentage of a Total',
    cpt_percentOfTotalEq: '25% × 40 = 10',
    cpt_percentOfTotalDesc: 'Finding quantity from percentage with packages',
    cpt_ratioToPercentTitle: 'Ratio to Percentage',
    cpt_ratioToPercentEq: '2:1 = 2/3 × 100% ≈ 66.7%',
    cpt_ratioToPercentDesc: 'Converting ratios to percentages with people',
    cpt_percentChangeTitle: 'Percentage Change',
    cpt_percentChangeEq: 'Increase: 280→350; (70/280) × 100 = 25%',
    cpt_percentChangeDesc: 'Calculating percentage change with shopping carts',
    
    // Visualization text strings for examples and steps
    viz_percentOf: '{percent}% of ₹{base}',
    viz_carOutOfCars: '{count} car out of {total} cars = {percent}%',
    viz_carsOutOfCars: '{count} cars out of {total} cars = {percent}%',
    viz_percentMeansOutOf100: '{percent}% means {percent} out of every 100',
    viz_totalPackages: 'Total: {total} packages',
    viz_needToFindPercent: 'We need to find {percent}% of these {total} packages',
    viz_outOf: 'out of',
    viz_percentMeansPerHundred: 'Percent means per hundred, so {percent}% = {percent} out of every 100',
    viz_multiplyFractionByTotal: 'Multiply the fraction by the total to get the actual number',
    viz_calculation: 'Calculation: {result} ÷ 100 = {answer}',
    viz_packagesOutOfTotal: '{answer} packages out of {total} packages = {percent}%',
    viz_percentEqualsPackages: '{percent}% = {answer} packages',
    viz_ratio: '{a}:{b} Ratio',
    viz_peopleOutOfPeople: '{count} people out of {total} people = {fraction} ≈ {percent}%',
    viz_priceChange: '{original} → {next}',
    viz_cartsAtNewPrice: '{newCount} carts at new price, {oldCount} cart at old price = {percent}% increase',
    viz_percentIncrease: '{percent}% increase',
    viz_quantityFormula: 'Quantity = ({percent}/100) × {total}',
    viz_calculationResult: '= ({percent} × {total})/100 = {answer}',
  },
  hi: {
    // Navigation
    home: 'होम',
    introduction: 'परिचय',
    learn: 'सीखें',
    realWorld: 'वास्तविक दुनिया',
    simpleEquations: 'प्रतिशत का उपयोग',
    simpleEquationsTitle: 'प्रतिशत का उपयोग',
    
    // Home Page
    masterSimpleEquations: 'प्रतिशत के उपयोग में महारत हासिल करें',
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
    
    // Learn Section (Topic 7.2 Use of Percentages)
    linearEquations: 'प्रतिशत',
    linearEquationsDesc: 'प्रतिशत वास्तविक जीवन में “सौ में से” भाग दिखाता है (जैसे 5% बचत = हर ₹100 पर ₹5; 20% नीली पोशाक = 100 में 20). "कितने" निकालने के लिए: (% × कुल). अनुपात को प्रतिशत में: भाग/कुल × 100 (उदाहरण: 2:1 ⇒ 2/3 = 66⅔%, 1/3 = 33⅓%). प्रतिशत परिवर्तन = (परिवर्तन/मूल) × 100. लाभ/हानि हमेशा CP पर: लाभ% = (SP−CP)/CP × 100; हानि% = (CP−SP)/CP × 100.',
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
    
    // Practice Questions (Use of Percentages - Topic 7.2)
    practice_q1: 'प्रतिशत का अर्थ: यदि 40 बच्चों में से 25% को फुटबॉल पसंद है, तो कितने बच्चों को फुटबॉल पसंद है?',
    practice_q2: 'प्रतिशत का अर्थ: यदि 150 पोशाकों में से 20% नीली हैं, तो कितनी पोशाकें नीली हैं?',
    practice_q3: 'कुल का %: यदि ₹2000 आय का 15% बचाया जाता है, तो कितना बचाया जाता है?',
    practice_q4: 'कुल का %: यदि 80 छात्रों में से 30% लड़कियां हैं, तो कितनी लड़कियां हैं?',
    practice_q5: 'अनुपात → %: एक मिश्रण में चीनी और नमक का अनुपात 3:2 है। चीनी का प्रतिशत क्या है?',
    practice_q6: 'अनुपात → %: एक मिश्रण में पानी और दूध का अनुपात 4:1 है। पानी का प्रतिशत क्या है?',
    practice_q7: '% परिवर्तन: यदि कीमत ₹280 से ₹350 हो जाती है, तो प्रतिशत वृद्धि क्या है?',
    practice_q8: '% परिवर्तन: यदि कीमत ₹500 से ₹400 हो जाती है, तो प्रतिशत कमी क्या है?',
    
    // ComprehensivePercentageTool (Topic 7.2)
    cpt_title: 'प्रतिशत का उपयोग',
    cpt_clickInstruction: 'किसी भी प्रकार पर क्लिक करें चरण-दर-चरण व्याख्या देखने के लिए',
    cpt_backToTypes: 'प्रकारों पर वापस जाएं',
    cpt_interpretTitle: 'प्रतिशत का अर्थ',
    cpt_interpretEq: '₹100 * 5% = ₹5',
    cpt_interpretDesc: 'कारों के साथ प्रतिशत का मतलब समझना',
    cpt_percentOfTotalTitle: 'कुल का प्रतिशत',
    cpt_percentOfTotalEq: '25% × 40 = 10',
    cpt_percentOfTotalDesc: 'पैकेजों के साथ प्रतिशत से मात्रा निकालना',
    cpt_ratioToPercentTitle: 'अनुपात से प्रतिशत',
    cpt_ratioToPercentEq: '2:1 = 2/3 × 100% ≈ 66.7%',
    cpt_ratioToPercentDesc: 'लोगों के साथ अनुपात को प्रतिशत में बदलना',
    cpt_percentChangeTitle: 'प्रतिशत परिवर्तन',
    cpt_percentChangeEq: 'वृद्धि: 280→350; (70/280) × 100 = 25%',
    cpt_percentChangeDesc: 'खरीदारी गाड़ियों के साथ प्रतिशत परिवर्तन की गणना',
    
    // Visualization text strings for examples and steps (Hindi)
    viz_percentOf: '{percent}% का ₹{base}',
    viz_carOutOfCars: '{total} कारों में से {count} कार = {percent}%',
    viz_carsOutOfCars: '{total} कारों में से {count} कारें = {percent}%',
    viz_percentMeansOutOf100: '{percent}% का अर्थ है प्रत्येक 100 में से {percent}',
    viz_totalPackages: 'कुल: {total} पैकेज',
    viz_needToFindPercent: 'हमें इन {total} पैकेजों में से {percent}% निकालना है',
    viz_outOf: 'में से',
    viz_percentMeansPerHundred: 'प्रतिशत का अर्थ है प्रति सौ, इसलिए {percent}% = प्रत्येक 100 में से {percent}',
    viz_multiplyFractionByTotal: 'वास्तविक संख्या पाने के लिए भिन्न को कुल से गुणा करें',
    viz_calculation: 'गणना: {result} ÷ 100 = {answer}',
    viz_packagesOutOfTotal: '{total} पैकेजों में से {answer} पैकेज = {percent}%',
    viz_percentEqualsPackages: '{percent}% = {answer} पैकेज',
    viz_ratio: '{a}:{b} अनुपात',
    viz_peopleOutOfPeople: '{total} लोगों में से {count} लोग = {fraction} ≈ {percent}%',
    viz_priceChange: '{original} → {next}',
    viz_cartsAtNewPrice: '{newCount} गाड़ियां नई कीमत पर, {oldCount} गाड़ी पुरानी कीमत पर = {percent}% वृद्धि',
    viz_percentIncrease: '{percent}% वृद्धि',
    viz_quantityFormula: 'मात्रा = ({percent}/100) × {total}',
    viz_calculationResult: '= ({percent} × {total})/100 = {answer}',
  },
  gu: {
    // Navigation
    home: 'ઘર',
    introduction: 'પરિચય',
    learn: 'શીખો',
    realWorld: 'વાસ્તવિક વિશ્વ',
    simpleEquations: 'ટકાવારીનો ઉપયોગ',
    simpleEquationsTitle: 'ટકાવારીનો ઉપયોગ',
    
    // Home Page
    masterSimpleEquations: 'ટકાવારીના ઉપયોગમાં નિપુણતા મેળવો',
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
    
    // Learn Section (Topic 7.2 Use of Percentages)
    linearEquations: 'ટકાવારી',
    linearEquationsDesc: 'ટકાવારી વાસ્તવિક જીવનમાં “પ્રતિ સો” ભાગ બતાવે છે (જેમ કે 5% બચત = દર ₹100 પર ₹5; 20% વાદળી = 100 માં 20). "કેટલા" જાણવા: (% × કુલ). અનુપાતને % માં: ભાગ/કુલ × 100 (ઉદાહરણ: 2:1 ⇒ 2/3 = 66⅔%, 1/3 = 33⅓%). % ફેરફાર = (ફેરફાર/મૂળ) × 100. નફો/નુકસાન હંમેશા CP પર: નફો% = (SP−CP)/CP × 100; નુકસાન% = (CP−SP)/CP × 100.',
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
    
    // Practice Questions (Use of Percentages - Topic 7.2)
    practice_q1: 'ટકાનો અર્થ: જો 40 બાળકોમાંથી 25% ને ફૂટબોલ ગમે છે, તો કેટલા બાળકોને ફૂટબોલ ગમે છે?',
    practice_q2: 'ટકાનો અર્થ: જો 150 ડ્રેસમાંથી 20% વાદળી છે, તો કેટલી ડ્રેસ વાદળી છે?',
    practice_q3: 'કુલનું %: જો ₹2000 આવકનું 15% બચાવવામાં આવે છે, તો કેટલું બચાવવામાં આવે છે?',
    practice_q4: 'કુલનું %: જો 80 વિદ્યાર્થીઓમાંથી 30% છોકરીઓ છે, તો કેટલી છોકરીઓ છે?',
    practice_q5: 'અનુપાત → %: એક મિશ્રણમાં ખાંડ અને મીઠુંનો અનુપાત 3:2 છે. ખાંડની ટકાવારી કેટલી છે?',
    practice_q6: 'અનુપાત → %: એક મિશ્રણમાં પાણી અને દૂધનો અનુપાત 4:1 છે. પાણીની ટકાવારી કેટલી છે?',
    practice_q7: '% ફેરફાર: જો કિંમત ₹280 થી ₹350 થાય છે, તો ટકાવારી વધારો કેટલો છે?',
    practice_q8: '% ફેરફાર: જો કિંમત ₹500 થી ₹400 થાય છે, તો ટકાવારી ઘટાડો કેટલો છે?',
    
    // ComprehensivePercentageTool (Topic 7.2)
    cpt_title: 'ટકાવારીનો ઉપયોગ',
    cpt_clickInstruction: 'કોઈપણ પ્રકાર પર ક્લિક કરો પગલું-દર-પગલું સમજાવવા માટે',
    cpt_backToTypes: 'પ્રકારો પર પાછા જાઓ',
    cpt_interpretTitle: 'ટકાનો અર્થ',
    cpt_interpretEq: '₹100 * 5% = ₹5',
    cpt_interpretDesc: 'કારો સાથે ટકાનો અર્થ સમજવો',
    cpt_percentOfTotalTitle: 'કુલનું ટકા',
    cpt_percentOfTotalEq: '25% × 40 = 10',
    cpt_percentOfTotalDesc: 'પેકેજો સાથે ટકામાંથી પરિમાણ શોધવું',
    cpt_ratioToPercentTitle: 'અનુપાતથી ટકા',
    cpt_ratioToPercentEq: '2:1 = 2/3 × 100% ≈ 66.7%',
    cpt_ratioToPercentDesc: 'લોકો સાથે અનુપાતને ટકામાં બદલવું',
    cpt_percentChangeTitle: 'ટકા ફેરફાર',
    cpt_percentChangeEq: 'વધારો: 280→350; (70/280) × 100 = 25%',
    cpt_percentChangeDesc: 'શોપિંગ કાર્ટ સાથે ટકાવારી ફેરફારની ગણતરી',
    
    // Visualization text strings for examples and steps (Gujarati)
    viz_percentOf: '{percent}% નું ₹{base}',
    viz_carOutOfCars: '{total} કારોમાંથી {count} કાર = {percent}%',
    viz_carsOutOfCars: '{total} કારોમાંથી {count} કારો = {percent}%',
    viz_percentMeansOutOf100: '{percent}% એટલે દરેક 100 માંથી {percent}',
    viz_totalPackages: 'કુલ: {total} પેકેજ',
    viz_needToFindPercent: 'આપણે આ {total} પેકેજોમાંથી {percent}% શોધવાની જરૂર છે',
    viz_outOf: 'માંથી',
    viz_percentMeansPerHundred: 'ટકા એટલે પ્રતિ સો, તેથી {percent}% = દરેક 100 માંથી {percent}',
    viz_multiplyFractionByTotal: 'વાસ્તવિક સંખ્યા મેળવવા માટે અપૂર્ણાંકને કુલ સાથે ગુણો',
    viz_calculation: 'ગણતરી: {result} ÷ 100 = {answer}',
    viz_packagesOutOfTotal: '{total} પેકેજોમાંથી {answer} પેકેજ = {percent}%',
    viz_percentEqualsPackages: '{percent}% = {answer} પેકેજ',
    viz_ratio: '{a}:{b} અનુપાત',
    viz_peopleOutOfPeople: '{total} લોકોમાંથી {count} લોકો = {fraction} ≈ {percent}%',
    viz_priceChange: '{original} → {next}',
    viz_cartsAtNewPrice: '{newCount} ગાડીઓ નવી કિંમતે, {oldCount} ગાડી જૂની કિંમતે = {percent}% વધારો',
    viz_percentIncrease: '{percent}% વધારો',
    viz_quantityFormula: 'પરિમાણ = ({percent}/100) × {total}',
    viz_calculationResult: '= ({percent} × {total})/100 = {answer}',
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
