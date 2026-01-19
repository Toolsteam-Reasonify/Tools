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
    simpleEquations: 'Simple Equations - Subtraction',
    simpleEquationsTitle: 'Simple Equations - Subtraction',
    
    // Home Page
    masterSimpleEquations: 'Master Simple Equations',
    masterClass7Mathematics: 'Master Class 7 Mathematics with interactive learning, practice exercises, and engaging games based on NCERT curriculum',
    startLearning: 'Start Learning',
    whatYoullLearn: 'What You\'ll Learn',
    comprehensiveTools: 'Comprehensive tools designed to make learning simple equations engaging and effective',
    introductionDesc: 'Learn the basics of simple equations with interactive examples',
    learnDesc: 'Step-by-step explanations with visual aids',
    practiceDesc: 'Solve exercises and check your solutions',
    realWorldDesc: 'See how equations apply in everyday life',
    practiceProblems: 'Practice Problems',
    interactiveExamples: 'Interactive Examples',
    readyToMaster: 'Ready to Master Simple Equations?',
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
    
    // Learn Section
    linearEquations: 'Linear Equations',
    linearEquationsDesc: 'Linear equations are equations where the highest power of the variable is 1. They can be solved using basic algebraic operations like addition, subtraction, multiplication, and division.',
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
    
    // Practice Questions
    practice_q1: 'Solve: x - 7 = 8',
    practice_q2: 'Solve: x - 4 = 8',
    practice_q3: 'Solve: x - 3 = 18',
    practice_q4: 'Solve: x - 2 = 6',
    practice_q5: 'Solve: x - 3 = 8',
    practice_q6: 'Solve: x - 5 = 4',
    practice_q7: 'Solve: x - 6 = 12',
    practice_q8: 'Solve: x - 2 = 5',
    practice_q9: 'Solve: x - 8 = 25',
    practice_q10: 'Solve: x - 7 = 6',
    practice_q11: 'Solve: x - 3 = 5',
    practice_q12: 'Solve: x - 12 = 18'
  },
  hi: {
    // Navigation
    home: 'होम',
    introduction: 'परिचय',
    learn: 'सीखें',
    realWorld: 'वास्तविक दुनिया',
    simpleEquations: 'सरल समीकरण - घटाव',
    simpleEquationsTitle: 'सरल समीकरण - घटाव',
    
    // Home Page
    masterSimpleEquations: 'सरल समीकरणों में महारत हासिल करें',
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
    
    // Learn Section
    linearEquations: 'रैखिक समीकरण',
    linearEquationsDesc: 'रैखिक समीकरण वे समीकरण हैं जहाँ चर की सबसे बड़ी घात 1 है। इन्हें जोड़, घटाव, गुणा और भाग जैसी बुनियादी बीजगणितीय संक्रियाओं का उपयोग करके हल किया जा सकता है।',
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
    
    // Practice Questions
    practice_q1: 'हल करें: x - 7 = 8',
    practice_q2: 'हल करें: x - 4 = 8',
    practice_q3: 'हल करें: x - 3 = 18',
    practice_q4: 'हल करें: x - 2 = 6',
    practice_q5: 'हल करें: x - 3 = 8',
    practice_q6: 'हल करें: x - 5 = 4',
    practice_q7: 'हल करें: x - 6 = 12',
    practice_q8: 'हल करें: x - 2 = 5',
    practice_q9: 'हल करें: x - 8 = 25',
    practice_q10: 'हल करें: x - 7 = 6',
    practice_q11: 'हल करें: x - 3 = 5',
    practice_q12: 'हल करें: x - 12 = 18'
  },
  gu: {
    // Navigation
    home: 'ઘર',
    introduction: 'પરિચય',
    learn: 'શીખો',
    realWorld: 'વાસ્તવિક વિશ્વ',
    simpleEquations: 'સરળ સમીકરણો - બાદબાકી',
    simpleEquationsTitle: 'સરળ સમીકરણો - બાદબાકી',
    
    // Home Page
    masterSimpleEquations: 'સરળ સમીકરણોમાં નિપુણતા મેળવો',
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
    
    // Learn Section
    linearEquations: 'રેખીય સમીકરણો',
    linearEquationsDesc: 'રેખીય સમીકરણો એવા સમીકરણો છે જ્યાં ચલની સર્વોચ્ચ ઘાત 1 છે. તેમને જોડાણ, બાદબાકી, ગુણાકાર અને ભાગાકાર જેવી મૂળભૂત બીજગણિતીય ક્રિયાઓનો ઉપયોગ કરીને હલ કરી શકાય છે.',
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
    
    // Practice Questions
    practice_q1: 'હલ કરો: x - 7 = 8',
    practice_q2: 'હલ કરો: x - 4 = 8',
    practice_q3: 'હલ કરો: x - 3 = 18',
    practice_q4: 'હલ કરો: x - 2 = 6',
    practice_q5: 'હલ કરો: x - 3 = 8',
    practice_q6: 'હલ કરો: x - 5 = 4',
    practice_q7: 'હલ કરો: x - 6 = 12',
    practice_q8: 'હલ કરો: x - 2 = 5',
    practice_q9: 'હલ કરો: x - 8 = 25',
    practice_q10: 'હલ કરો: x - 7 = 6',
    practice_q11: 'હલ કરો: x - 3 = 5',
    practice_q12: 'હલ કરો: x - 12 = 18'
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
    }, 300);
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
