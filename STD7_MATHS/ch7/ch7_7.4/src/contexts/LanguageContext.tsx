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
    simpleEquations: 'Simple Interest',
    simpleEquationsTitle: 'Simple Interest',
    
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
    step: 'Step',
    stepWithNumber: 'Step {n}:',
    solutionGoal: 'x = {solution}',
    solutionLabel: 'x = I in ₹',
    
    // RealWorldApplications type titles
    rwa_siBasics: 'Simple Interest Basics',
    rwa_siFormula: 'Simple Interest Formula',
    rwa_amount: 'Amount (A = P + I)',
    rwa_keyPoints: 'Key Points & Examples',
    
    // RealWorldApplications step texts
    rwa_convertMonths: 'Convert months to years: T = months/12',
    rwa_applyFormula: 'Apply formula: I = (P × R × T)/100',
    rwa_substituteCompute: 'Substitute values and compute I',
    
    // Step descriptions for si_basic_terms
    rwa_step_identifyPrincipal: 'Identify principal (P): the borrowed money',
    rwa_step_identifyRate: 'Identify rate (R): percent per annum',
    rwa_step_identifyTime: 'Identify time (T): years of borrowing',
    rwa_step_computeInterest: 'Compute interest (I) with formula when needed',
    rwa_step_computeAmount: 'Compute amount (A) using A = P + I',
    
    // Step descriptions for si_what_is_principal
    rwa_step_identifyTotalAmount: 'Identify total amount A and interest I',
    rwa_step_useRelation: 'Use relation: P = A − I',
    rwa_step_computePrincipal: 'Compute principal P',
    
    // Step descriptions for si_rate_meaning
    rwa_step_rateExample: 'Rate 10% p.a. ⇒ on ₹100, interest is ₹10 in 1 year',
    rwa_step_rateProportion: 'So for ₹200, interest is ₹20; for ₹500, interest is ₹50 (direct proportion)',
    rwa_step_estimateInterest: 'Use this idea to quickly estimate yearly interest',
    
    // Step descriptions for si_one_year
    rwa_step_writeFormula: 'Write formula: I = (P × R)/100',
    rwa_step_substitutePR: 'Substitute: P = ₹2000, R = 8%',
    rwa_step_calculate: 'Calculate: I = (2000 × 8)/100',
    rwa_step_multiply: 'Multiply: 2000 × 8 = 16000',
    rwa_step_divide100: 'Divide by 100: 16000/100 = ₹160',
    
    // Step descriptions for si_multi_years
    rwa_step_writeFormulaMulti: 'Write formula: I = (P × R × T)/100',
    rwa_step_substitutePRT: 'Substitute: P = ₹3000, R = 5%, T = 3',
    rwa_step_multiplyPRT: 'Multiply: 3000 × 5 × 3 = 45000',
    rwa_step_divide100Result: 'Divide by 100: 45000/100 = ₹450',
    
    // Step descriptions for si_amount
    rwa_step_writeAmountFormula: 'Write amount formula: A = P + I',
    rwa_step_useValues: 'Use values from the example: P = ₹5000, I = ₹750',
    rwa_step_substituteAdd: 'Substitute: A = 5000 + 750',
    rwa_step_computeAmountFinal: 'Compute: A = ₹5750',
    
    // Step descriptions for si_amount_example_b
    rwa_step_computeInterestFormula: 'Compute interest: I=(P×R×T)/100',
    rwa_step_addToPrincipal: 'Add to principal: A=P+I',
    rwa_step_reportAmount: 'Report amount A',
    
    // Step descriptions for si_example_anita
    rwa_step_writeFormulaAnita: 'Write formula: I = (P × R × T)/100',
    rwa_step_substituteAnita: 'Substitute: P = ₹5000, R = 15%, T = 1',
    rwa_step_multiplyAnita: 'Multiply: 5000 × 15 × 1 = 75000',
    rwa_step_divideAnita: 'Divide by 100: 75000/100 = ₹750',
    rwa_step_amountAnita: 'Amount: A = P + I = 5000 + 750 = ₹5750',
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
    
    // Practice Questions (Topic 7.4 Simple Interest)
    practice_q1: 'Simple Interest: Find I on ₹8,000 at 12% p.a. for 3 years.',
    practice_q2: 'Simple Interest: Find Amount A after 2 years on ₹5,000 at 8% p.a.',
    practice_q3: 'Simple Interest: What rate R gives ₹600 interest on ₹4,000 in 3 years?',
    practice_q4: 'Simple Interest: In how many years will ₹3,000 amount to ₹3,900 at 10% p.a.?',
    practice_q5: 'Simple Interest: Find principal P if I=₹1,200 at 5% p.a. for 4 years.',
    practice_q6: 'Simple Interest: Ramesh borrowed ₹12,000 at 9% p.a.; find final payment after stepwise changes.',
    practice_q7: 'Simple Interest: Compute I for ₹9,000 at 10% p.a. for 2 years.',
    practice_q8: 'Simple Interest: Compute A for ₹12,000 at 6% p.a. for 3 years.',
    
    // ComprehensivePercentageTool (Topic 7.4 - Simple Interest)
    cpt_title: 'Simple Interest',
    cpt_clickInstruction: 'Click on any type to see step-by-step explanation',
    cpt_backToTypes: 'Back to Types',
    cpt_step: 'Step',
    cpt_siOneYearTitle: 'Simple Interest (1 year)',
    cpt_siOneYearEq: 'I = (5000 × 15 × 1)/100 = ₹750',
    cpt_siOneYearDesc: 'Use I = (P×R×T)/100 for T = 1 year',
    cpt_siMultiYearsTitle: 'Simple Interest (T years)',
    cpt_siMultiYearsEq: 'I = (3000 × 5 × 3)/100 = ₹450',
    cpt_siMultiYearsDesc: 'Multiply by time for multiple years',
    
    // Visualization text strings for examples and steps (English)
    viz_findPercentOf: 'We want to find {percent}% of ₹{base}. This means {percent} cars out of every 100 cars.',
    viz_totalCars: 'Total: ₹{base} (100 cars, showing representative 20 cars)',
    viz_carsOutOf: 'cars out of',
    viz_percentMeans: '{percent}% means {percent} out of every 100 cars',
    viz_multiplyFraction: 'Multiply the fraction by {base} to get the actual number of cars (or rupees)',
    viz_calculation: 'Calculation: {result} ÷ 100 = {answer} cars (or ₹{answer})',
    viz_carsOutOf100: '{count} cars out of 100 cars = {percent}%',
    viz_percentMeansOutOf100: '{percent}% means {percent} out of every 100',
    viz_soPercentOf: 'So {percent}% of ₹{base} = ₹{answer} (1 highlighted car out of 20 shown, representing {percent} out of 100)',
    viz_siFormula: 'Simple Interest formula for multiple years',
    viz_carRepresentsPrincipal: 'Each car represents Principal (P). We multiply by Rate (R) and Time (T), then divide by 100.',
    viz_substitute: 'Substitute: P={P}, R={R}%, T={T}',
    viz_cars: 'cars',
    viz_principalEquals: 'Principal = ₹{P} (10 cars, each = ₹{carValue}). Rate = {R}% per year. Time = {T} years.',
    viz_multiply: 'Multiply P × R × T = {result} (represented by cars, each ≈ ₹{carValue})',
    viz_interestFor: 'Interest = ₹{I} for {T} years (9 cars, each ≈ ₹{carValue})',
    viz_answerForYears: 'Answer: I = ₹{I} for {T} years',
    viz_totalSiForYears: 'Total Simple Interest = ₹{I} for {T} years',
    viz_eachCarRepresentsInterest: 'Each car represents ₹{carValue} of interest',
    viz_formulaCalculation: 'Formula: I = (₹{P} × {R}% × {T}) ÷ 100 = ₹{I}',
    
    // Step explanations for percentTool.ts
    step_siOneYear_title: 'Simple Interest (1 year)',
    step_siOneYear_step1: 'Step 1:',
    step_siOneYear_eq1: 'I = (P × R × T)/100',
    step_siOneYear_exp1: 'Use the simple interest formula.',
    step_siOneYear_step2: 'Step 2:',
    step_siOneYear_eq2: 'Substitute: P={P}, R={R}%, T={T}',
    step_siOneYear_exp2: 'Fill in principal, rate, and time.',
    step_siOneYear_step3: 'Step 3:',
    step_siOneYear_eq3: 'I = ({P} × {R} × {T})/100',
    step_siOneYear_exp3: 'Multiply P, R, and T.',
    step_siOneYear_step4: 'Step 4:',
    step_siOneYear_eq4: '= {result}/100 = ₹{I}',
    step_siOneYear_exp4: 'Divide by 100 to get interest.',
    step_siOneYear_step5: 'Step 5:',
    step_siOneYear_eq5: 'Answer: I = ₹{I} ✓',
    step_siOneYear_exp5: 'Interest for one year.',
    
    step_siMultiYears_title: 'Simple Interest (T years)',
    step_siMultiYears_step1: 'Step 1:',
    step_siMultiYears_eq1: 'I = (P × R × T)/100',
    step_siMultiYears_exp1: 'Use the SI formula for multiple years.',
    step_siMultiYears_step2: 'Step 2:',
    step_siMultiYears_eq2: 'Substitute: P={P}, R={R}%, T={T}',
    step_siMultiYears_exp2: 'Insert the values.',
    step_siMultiYears_step3: 'Step 3:',
    step_siMultiYears_eq3: 'I = ({P} × {R} × {T})/100',
    step_siMultiYears_exp3: 'Multiply P, R, and T.',
    step_siMultiYears_step4: 'Step 4:',
    step_siMultiYears_eq4: '= {result}/100 = ₹{I}',
    step_siMultiYears_exp4: 'Divide by 100 to get interest.',
    step_siMultiYears_step5: 'Step 5:',
    step_siMultiYears_eq5: 'Answer: I = ₹{I} ✓',
    step_siMultiYears_exp5: 'Total simple interest for T years.',
    
    step_siAmount_title: 'Amount (A = P + I)',
    step_siAmount_step1: 'Step 1:',
    step_siAmount_eq1: 'A = P + I',
    step_siAmount_exp1: 'Amount equals principal plus interest.',
    step_siAmount_step2: 'Step 2:',
    step_siAmount_eq2: 'Use values: P={P}, I={I}',
    step_siAmount_exp2: 'Take values from the example.',
    step_siAmount_step3: 'Step 3:',
    step_siAmount_eq3: 'A = {P} + {I}',
    step_siAmount_exp3: 'Substitute.',
    step_siAmount_step4: 'Step 4:',
    step_siAmount_eq4: '= ₹{A}',
    step_siAmount_exp4: 'Add to get total amount.',
    step_siAmount_step5: 'Step 5:',
    step_siAmount_eq5: 'Answer: A = ₹{A} ✓',
    step_siAmount_exp5: 'Total to repay.',
    
    step_siKeyPoint_title: 'Key Point: Interest on Principal Only',
    step_siKeyPoint_step1: 'Step 1:',
    step_siKeyPoint_eq1: 'Simple Interest depends only on P',
    step_siKeyPoint_exp1: 'In SI, interest is always on the original principal.',
    step_siKeyPoint_step2: 'Step 2:',
    step_siKeyPoint_eq2: 'No compounding',
    step_siKeyPoint_exp2: 'Interest is not added to principal for future calculations.',
    step_siKeyPoint_step3: 'Step 3:',
    step_siKeyPoint_eq3: 'Example: P=₹1000, R=10% p.a., T=3',
    step_siKeyPoint_exp3: 'Yearly interest = ₹100 every year.',
    step_siKeyPoint_step4: 'Step 4:',
    step_siKeyPoint_eq4: 'Total I = 100 × 3 = ₹300',
    step_siKeyPoint_exp4: 'Add yearly interest for T years.',
    step_siKeyPoint_step5: 'Step 5:',
    step_siKeyPoint_eq5: 'Amount A = P + I = 1000 + 300 = ₹1300',
    step_siKeyPoint_exp5: 'Total to repay.',
    
    // DemonstrationMode texts
    demo_siTitle: 'Simple Interest',
    demo_siDefinition: 'Simple Interest is interest calculated only on the original principal.',
    demo_siFormulaNote: 'I = (P×R×T)/100 सूत्र से निकाला जाता है।',
    demo_siUsage: 'Use I = (P×R×T)/100 and A = P + I.',
    demo_examples: 'Examples',
  },
  hi: {
    // Navigation
    home: 'होम',
    introduction: 'परिचय',
    learn: 'सीखें',
    realWorld: 'वास्तविक दुनिया',
    simpleEquations: 'साधारण ब्याज',
    simpleEquationsTitle: 'साधारण ब्याज',
    
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
    step: 'चरण',
    stepWithNumber: 'चरण {n}:',
    solutionGoal: 'x = {solution}',
    solutionLabel: 'x = I in ₹',
    
    // RealWorldApplications type titles (Hindi)
    rwa_siBasics: 'साधारण ब्याज की मूल बातें',
    rwa_siFormula: 'साधारण ब्याज का सूत्र',
    rwa_amount: 'राशि (A = P + I)',
    rwa_keyPoints: 'मुख्य बिंदु और उदाहरण',
    
    // RealWorldApplications step texts (Hindi)
    rwa_convertMonths: 'महीनों को वर्षों में बदलें: T = महीने/12',
    rwa_applyFormula: 'सूत्र लागू करें: I = (P × R × T)/100',
    rwa_substituteCompute: 'मान रखें और I की गणना करें',
    
    // Step descriptions for si_basic_terms (Hindi)
    rwa_step_identifyPrincipal: 'मूलधन (P) की पहचान करें: उधार ली गई राशि',
    rwa_step_identifyRate: 'दर (R) की पहचान करें: प्रतिशत प्रति वर्ष',
    rwa_step_identifyTime: 'समय (T) की पहचान करें: उधार की अवधि वर्षों में',
    rwa_step_computeInterest: 'आवश्यकता होने पर सूत्र से ब्याज (I) की गणना करें',
    rwa_step_computeAmount: 'A = P + I का उपयोग करके राशि (A) की गणना करें',
    
    // Step descriptions for si_what_is_principal (Hindi)
    rwa_step_identifyTotalAmount: 'कुल राशि A और ब्याज I की पहचान करें',
    rwa_step_useRelation: 'संबंध का उपयोग करें: P = A − I',
    rwa_step_computePrincipal: 'मूलधन P की गणना करें',
    
    // Step descriptions for si_rate_meaning (Hindi)
    rwa_step_rateExample: 'दर 10% p.a. ⇒ ₹100 पर, 1 वर्ष में ब्याज ₹10 है',
    rwa_step_rateProportion: 'तो ₹200 के लिए, ब्याज ₹20 है; ₹500 के लिए, ब्याज ₹50 है (सीधा अनुपात)',
    rwa_step_estimateInterest: 'वार्षिक ब्याज का तुरंत अनुमान लगाने के लिए इस विचार का उपयोग करें',
    
    // Step descriptions for si_one_year (Hindi)
    rwa_step_writeFormula: 'सूत्र लिखें: I = (P × R)/100',
    rwa_step_substitutePR: 'स्थानापन्न करें: P = ₹2000, R = 8%',
    rwa_step_calculate: 'गणना करें: I = (2000 × 8)/100',
    rwa_step_multiply: 'गुणा करें: 2000 × 8 = 16000',
    rwa_step_divide100: '100 से भाग दें: 16000/100 = ₹160',
    
    // Step descriptions for si_multi_years (Hindi)
    rwa_step_writeFormulaMulti: 'सूत्र लिखें: I = (P × R × T)/100',
    rwa_step_substitutePRT: 'स्थानापन्न करें: P = ₹3000, R = 5%, T = 3',
    rwa_step_multiplyPRT: 'गुणा करें: 3000 × 5 × 3 = 45000',
    rwa_step_divide100Result: '100 से भाग दें: 45000/100 = ₹450',
    
    // Step descriptions for si_amount (Hindi)
    rwa_step_writeAmountFormula: 'राशि सूत्र लिखें: A = P + I',
    rwa_step_useValues: 'उदाहरण से मान लें: P = ₹5000, I = ₹750',
    rwa_step_substituteAdd: 'स्थानापन्न करें: A = 5000 + 750',
    rwa_step_computeAmountFinal: 'गणना करें: A = ₹5750',
    
    // Step descriptions for si_amount_example_b (Hindi)
    rwa_step_computeInterestFormula: 'ब्याज की गणना करें: I=(P×R×T)/100',
    rwa_step_addToPrincipal: 'मूलधन में जोड़ें: A=P+I',
    rwa_step_reportAmount: 'राशि A रिपोर्ट करें',
    
    // Step descriptions for si_example_anita (Hindi)
    rwa_step_writeFormulaAnita: 'सूत्र लिखें: I = (P × R × T)/100',
    rwa_step_substituteAnita: 'स्थानापन्न करें: P = ₹5000, R = 15%, T = 1',
    rwa_step_multiplyAnita: 'गुणा करें: 5000 × 15 × 1 = 75000',
    rwa_step_divideAnita: '100 से भाग दें: 75000/100 = ₹750',
    rwa_step_amountAnita: 'राशि: A = P + I = 5000 + 750 = ₹5750',
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
    
    // Practice Questions (Topic 7.4 Simple Interest)
    practice_q1: 'साधारण ब्याज: ₹8,000 पर 12% वार्षिक दर से 3 वर्षों का I निकालें।',
    practice_q2: 'साधारण ब्याज: ₹5,000 पर 8% p.a. के लिए 2 वर्षों के बाद राशि A निकालें।',
    practice_q3: 'साधारण ब्याज: ₹4,000 पर 3 वर्षों में ₹600 ब्याज के लिए दर R कितनी होगी?',
    practice_q4: 'साधारण ब्याज: ₹3,000 कितने वर्षों में 10% p.a. पर ₹3,900 बनेगा?',
    practice_q5: 'साधारण ब्याज: यदि I=₹1,200, R=5% p.a., T=4 वर्ष, तो मूलधन P ज्ञात करें।',
    practice_q6: 'साधारण ब्याज: रमेश ने ₹12,000 9% p.a. पर उधार लिया; चरणों के बाद अंतिम भुगतान ज्ञात करें।',
    practice_q7: 'साधारण ब्याज: ₹9,000 पर 10% p.a. के लिए 2 वर्षों का I निकालें।',
    practice_q8: 'साधारण ब्याज: ₹12,000 पर 6% p.a. के लिए 3 वर्षों की राशि A निकालें।',
    
    // ComprehensivePercentageTool (Topic 7.4 - Simple Interest) (Hindi)
    cpt_title: 'साधारण ब्याज',
    cpt_clickInstruction: 'किसी भी प्रकार पर क्लिक करें चरण-दर-चरण व्याख्या देखने के लिए',
    cpt_backToTypes: 'प्रकारों पर वापस जाएं',
    cpt_step: 'चरण',
    cpt_siOneYearTitle: 'साधारण ब्याज (1 वर्ष)',
    cpt_siOneYearEq: 'I = (5000 × 15 × 1)/100 = ₹750',
    cpt_siOneYearDesc: 'T = 1 वर्ष के लिए I = (P×R×T)/100',
    cpt_siMultiYearsTitle: 'साधारण ब्याज (T वर्ष)',
    cpt_siMultiYearsEq: 'I = (3000 × 5 × 3)/100 = ₹450',
    cpt_siMultiYearsDesc: 'कई वर्षों के लिए समय से गुणा करें',
    
    // Visualization text strings for examples and steps (Hindi)
    viz_findPercentOf: 'हमें ₹{base} का {percent}% ज्ञात करना है। इसका मतलब है कि हर 100 कारों में से {percent} कारें।',
    viz_totalCars: 'कुल: ₹{base} (100 कारें, 20 प्रतिनिधि कारें दिखाई गईं)',
    viz_carsOutOf: 'कारें में से',
    viz_percentMeans: '{percent}% का मतलब है हर 100 कारों में से {percent} कारें',
    viz_multiplyFraction: 'वास्तविक कारों (या रुपये) की संख्या प्राप्त करने के लिए भिन्न को {base} से गुणा करें',
    viz_calculation: 'गणना: {result} ÷ 100 = {answer} कारें (या ₹{answer})',
    viz_carsOutOf100: '100 कारों में से {count} कारें = {percent}%',
    viz_percentMeansOutOf100: '{percent}% का मतलब है हर 100 में से {percent}',
    viz_soPercentOf: 'तो ₹{base} का {percent}% = ₹{answer} (20 में से 1 हाइलाइट कार, 100 में से {percent} का प्रतिनिधित्व करती है)',
    viz_siFormula: 'कई वर्षों के लिए साधारण ब्याज का सूत्र',
    viz_carRepresentsPrincipal: 'प्रत्येक कार मूलधन (P) का प्रतिनिधित्व करती है। हम दर (R) और समय (T) से गुणा करते हैं, फिर 100 से भाग देते हैं।',
    viz_substitute: 'स्थानापन्न: P={P}, R={R}%, T={T}',
    viz_cars: 'कारें',
    viz_principalEquals: 'मूलधन = ₹{P} (10 कारें, प्रत्येक = ₹{carValue})। दर = {R}% प्रति वर्ष। समय = {T} वर्ष।',
    viz_multiply: 'P × R × T = {result} गुणा करें (कारों द्वारा दर्शाया गया, प्रत्येक ≈ ₹{carValue})',
    viz_interestFor: 'ब्याज = ₹{I} {T} वर्षों के लिए (9 कारें, प्रत्येक ≈ ₹{carValue})',
    viz_answerForYears: 'उत्तर: I = ₹{I} {T} वर्षों के लिए',
    viz_totalSiForYears: 'कुल साधारण ब्याज = ₹{I} {T} वर्षों के लिए',
    viz_eachCarRepresentsInterest: 'प्रत्येक कार ₹{carValue} ब्याज का प्रतिनिधित्व करती है',
    viz_formulaCalculation: 'सूत्र: I = (₹{P} × {R}% × {T}) ÷ 100 = ₹{I}',
    
    // Step explanations for percentTool.ts (Hindi)
    step_siOneYear_title: 'साधारण ब्याज (1 वर्ष)',
    step_siOneYear_step1: 'चरण 1:',
    step_siOneYear_eq1: 'I = (P × R × T)/100',
    step_siOneYear_exp1: 'साधारण ब्याज का सूत्र।',
    step_siOneYear_step2: 'चरण 2:',
    step_siOneYear_eq2: 'स्थानापन्न: P={P}, R={R}%, T={T}',
    step_siOneYear_exp2: 'मूलधन, दर और समय भरें।',
    step_siOneYear_step3: 'चरण 3:',
    step_siOneYear_eq3: 'I = ({P} × {R} × {T})/100',
    step_siOneYear_exp3: 'P, R, T का गुणन।',
    step_siOneYear_step4: 'चरण 4:',
    step_siOneYear_eq4: '= {result}/100 = ₹{I}',
    step_siOneYear_exp4: '100 से भाग देकर ब्याज पाएं।',
    step_siOneYear_step5: 'चरण 5:',
    step_siOneYear_eq5: 'उत्तर: I = ₹{I} ✓',
    step_siOneYear_exp5: 'एक वर्ष का ब्याज।',
    
    step_siMultiYears_title: 'साधारण ब्याज (T वर्ष)',
    step_siMultiYears_step1: 'चरण 1:',
    step_siMultiYears_eq1: 'I = (P × R × T)/100',
    step_siMultiYears_exp1: 'कई वर्षों के लिए SI का सूत्र।',
    step_siMultiYears_step2: 'चरण 2:',
    step_siMultiYears_eq2: 'स्थानापन्न: P={P}, R={R}%, T={T}',
    step_siMultiYears_exp2: 'मान भरें।',
    step_siMultiYears_step3: 'चरण 3:',
    step_siMultiYears_eq3: 'I = ({P} × {R} × {T})/100',
    step_siMultiYears_exp3: 'गुणन करें।',
    step_siMultiYears_step4: 'चरण 4:',
    step_siMultiYears_eq4: '= {result}/100 = ₹{I}',
    step_siMultiYears_exp4: '100 से भाग दें।',
    step_siMultiYears_step5: 'चरण 5:',
    step_siMultiYears_eq5: 'उत्तर: I = ₹{I} ✓',
    step_siMultiYears_exp5: 'T वर्षों का ब्याज।',
    
    step_siAmount_title: 'राशि (A = P + I)',
    step_siAmount_step1: 'चरण 1:',
    step_siAmount_eq1: 'A = P + I',
    step_siAmount_exp1: 'राशि = मूलधन + ब्याज।',
    step_siAmount_step2: 'चरण 2:',
    step_siAmount_eq2: 'मान लें: P={P}, I={I}',
    step_siAmount_exp2: 'उदाहरण के मान लें।',
    step_siAmount_step3: 'चरण 3:',
    step_siAmount_eq3: 'A = {P} + {I}',
    step_siAmount_exp3: 'स्थानापन्न करें।',
    step_siAmount_step4: 'चरण 4:',
    step_siAmount_eq4: '= ₹{A}',
    step_siAmount_exp4: 'जोड़कर कुल राशि पाएं।',
    step_siAmount_step5: 'चरण 5:',
    step_siAmount_eq5: 'उत्तर: A = ₹{A} ✓',
    step_siAmount_exp5: 'कुल चुकाई जाने वाली राशि।',
    
    step_siKeyPoint_title: 'मुख्य बिंदु: ब्याज केवल मूलधन पर',
    step_siKeyPoint_step1: 'चरण 1:',
    step_siKeyPoint_eq1: 'SI केवल P पर निर्भर करता है',
    step_siKeyPoint_exp1: 'साधारण ब्याज हमेशा मूलधन पर ही लगता है।',
    step_siKeyPoint_step2: 'चरण 2:',
    step_siKeyPoint_eq2: 'कोई चक्रवृद्धि नहीं',
    step_siKeyPoint_exp2: 'ब्याज को आगे की गणना में मूलधन में नहीं जोड़ा जाता।',
    step_siKeyPoint_step3: 'चरण 3:',
    step_siKeyPoint_eq3: 'उदाहरण: P=₹1000, R=10% p.a., T=3',
    step_siKeyPoint_exp3: 'हर वर्ष ब्याज ₹100।',
    step_siKeyPoint_step4: 'चरण 4:',
    step_siKeyPoint_eq4: 'कुल I = 100 × 3 = ₹300',
    step_siKeyPoint_exp4: 'T वर्षों के लिए जोड़ें।',
    step_siKeyPoint_step5: 'चरण 5:',
    step_siKeyPoint_eq5: 'A = P + I = 1000 + 300 = ₹1300',
    step_siKeyPoint_exp5: 'कुल देय राशि।',
    
    // DemonstrationMode texts (Hindi)
    demo_siTitle: 'साधारण ब्याज',
    demo_siDefinition: 'साधारण ब्याज वह ब्याज है जो केवल मूलधन पर लगाया जाता है।',
    demo_siFormulaNote: 'I = (P×R×T)/100 सूत्र से निकाला जाता है।',
    demo_siUsage: 'I = (P×R×T)/100 और A = P + I का उपयोग करें।',
    demo_examples: 'उदाहरण',
  },
  gu: {
    // Navigation
    home: 'ઘર',
    introduction: 'પરિચય',
    learn: 'શીખો',
    realWorld: 'વાસ્તવિક વિશ્વ',
    simpleEquations: 'સરળ વ્યાજ',
    simpleEquationsTitle: 'સરળ વ્યાજ',
    
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
    step: 'પગલું',
    stepWithNumber: 'પગલું {n}:',
    solutionGoal: 'x = {solution}',
    solutionLabel: 'x = I in ₹',
    
    // RealWorldApplications type titles (Gujarati)
    rwa_siBasics: 'સરળ વ્યાજની મૂળ બાબતો',
    rwa_siFormula: 'સરળ વ્યાજનો સૂત્ર',
    rwa_amount: 'રકમ (A = P + I)',
    rwa_keyPoints: 'મુખ્ય મુદ્દા અને ઉદાહરણો',
    
    // RealWorldApplications step texts (Gujarati)
    rwa_convertMonths: 'મહિના ને વર્ષમાં રૂપાંતર કરો: T = મહિના/12',
    rwa_applyFormula: 'સૂત્ર લાગુ કરો: I = (P × R × T)/100',
    rwa_substituteCompute: 'મૂલ્યો મૂકો અને I ની ગણતરી કરો',
    
    // Step descriptions for si_basic_terms (Gujarati)
    rwa_step_identifyPrincipal: 'મૂળધન (P) ઓળખો: ઉધાર લેવામાં આવેલા પૈસા',
    rwa_step_identifyRate: 'દર (R) ઓળખો: પ્રતિશત પ્રતિ વર્ષ',
    rwa_step_identifyTime: 'સમય (T) ઓળખો: ઉધારનો સમય વર્ષોમાં',
    rwa_step_computeInterest: 'જરૂરી હોય ત્યારે સૂત્ર સાથે વ્યાજ (I) ગણો',
    rwa_step_computeAmount: 'A = P + I નો ઉપયોગ કરીને રકમ (A) ગણો',
    
    // Step descriptions for si_what_is_principal (Gujarati)
    rwa_step_identifyTotalAmount: 'કુલ રકમ A અને વ્યાજ I ઓળખો',
    rwa_step_useRelation: 'સંબંધનો ઉપયોગ કરો: P = A − I',
    rwa_step_computePrincipal: 'મૂળધન P ગણો',
    
    // Step descriptions for si_rate_meaning (Gujarati)
    rwa_step_rateExample: 'દર 10% p.a. ⇒ ₹100 પર, 1 વર્ષમાં વ્યાજ ₹10 છે',
    rwa_step_rateProportion: 'તો ₹200 માટે, વ્યાજ ₹20 છે; ₹500 માટે, વ્યાજ ₹50 છે (સીધા પ્રમાણ)',
    rwa_step_estimateInterest: 'વાર્ષિક વ્યાજનો ઝડપથી અંદાજ લગાવવા માટે આ વિચારનો ઉપયોગ કરો',
    
    // Step descriptions for si_one_year (Gujarati)
    rwa_step_writeFormula: 'સૂત્ર લખો: I = (P × R)/100',
    rwa_step_substitutePR: 'સ્થાનાપન્ન કરો: P = ₹2000, R = 8%',
    rwa_step_calculate: 'ગણતરી કરો: I = (2000 × 8)/100',
    rwa_step_multiply: 'ગુણાકાર કરો: 2000 × 8 = 16000',
    rwa_step_divide100: '100 વડે ભાગો: 16000/100 = ₹160',
    
    // Step descriptions for si_multi_years (Gujarati)
    rwa_step_writeFormulaMulti: 'સૂત્ર લખો: I = (P × R × T)/100',
    rwa_step_substitutePRT: 'સ્થાનાપન્ન કરો: P = ₹3000, R = 5%, T = 3',
    rwa_step_multiplyPRT: 'ગુણાકાર કરો: 3000 × 5 × 3 = 45000',
    rwa_step_divide100Result: '100 વડે ભાગો: 45000/100 = ₹450',
    
    // Step descriptions for si_amount (Gujarati)
    rwa_step_writeAmountFormula: 'રકમ સૂત્ર લખો: A = P + I',
    rwa_step_useValues: 'ઉદાહરણમાંથી મૂલ્યો લો: P = ₹5000, I = ₹750',
    rwa_step_substituteAdd: 'સ્થાનાપન્ન કરો: A = 5000 + 750',
    rwa_step_computeAmountFinal: 'ગણતરી કરો: A = ₹5750',
    
    // Step descriptions for si_amount_example_b (Gujarati)
    rwa_step_computeInterestFormula: 'વ્યાજ ગણો: I=(P×R×T)/100',
    rwa_step_addToPrincipal: 'મૂળધનમાં ઉમેરો: A=P+I',
    rwa_step_reportAmount: 'રકમ A રિપોર્ટ કરો',
    
    // Step descriptions for si_example_anita (Gujarati)
    rwa_step_writeFormulaAnita: 'સૂત્ર લખો: I = (P × R × T)/100',
    rwa_step_substituteAnita: 'સ્થાનાપન્ન કરો: P = ₹5000, R = 15%, T = 1',
    rwa_step_multiplyAnita: 'ગુણાકાર કરો: 5000 × 15 × 1 = 75000',
    rwa_step_divideAnita: '100 વડે ભાગો: 75000/100 = ₹750',
    rwa_step_amountAnita: 'રકમ: A = P + I = 5000 + 750 = ₹5750',
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

    // Practice Questions (Topic 7.4 Simple Interest)
    practice_q1: 'સરળ વ્યાજ: ₹8,000 પર 12% p.a. માટે 3 વર્ષનું I શોધો.',
    practice_q2: 'સરળ વ્યાજ: ₹5,000 પર 8% p.a. માટે 2 વર્ષ પછીની રકમ A શોધો.',
    practice_q3: 'સરળ વ્યાજ: ₹4,000 પર 3 વર્ષમાં ₹600 વ્યાજ માટે દર R કેટલો?',
    practice_q4: 'સરળ વ્યાજ: ₹3,000 10% p.a. પર કેટલા વર્ષમાં ₹3,900 બનશે?',
    practice_q5: 'સરળ વ્યાજ: I=₹1,200, R=5% p.a., T=4 વર્ષ હોય તો મૂળધન P શોધો.',
    practice_q6: 'સરળ વ્યાજ: રમેશે ₹12,000 9% p.a. પર લીધું; પગલાં પછી અંતિમ ચુકવણી શોધો.',
    practice_q7: 'સરળ વ્યાજ: ₹9,000 પર 10% p.a. માટે 2 વર્ષનું I શોધો.',
    practice_q8: 'સરળ વ્યાજ: ₹12,000 પર 6% p.a. માટે 3 વર્ષની રકમ A શોધો.',
    
    // ComprehensivePercentageTool (Topic 7.4 - Simple Interest) (Gujarati)
    cpt_title: 'સરળ વ્યાજ',
    cpt_clickInstruction: 'કોઈપણ પ્રકાર પર ક્લિક કરો પગલું-દર-પગલું સમજાવવા માટે',
    cpt_backToTypes: 'પ્રકારો પર પાછા જાઓ',
    cpt_step: 'પગલું',
    cpt_siOneYearTitle: 'સરળ વ્યાજ (1 વર્ષ)',
    cpt_siOneYearEq: 'I = (5000 × 15 × 1)/100 = ₹750',
    cpt_siOneYearDesc: 'T = 1 વર્ષ માટે I = (P×R×T)/100',
    cpt_siMultiYearsTitle: 'સરળ વ્યાજ (T વર્ષ)',
    cpt_siMultiYearsEq: 'I = (3000 × 5 × 3)/100 = ₹450',
    cpt_siMultiYearsDesc: 'ઘણા વર્ષો માટે સમયથી ગુણો',
    
    // Visualization text strings for examples and steps (Gujarati)
    viz_findPercentOf: 'આપણે ₹{base} નો {percent}% શોધવાની જરૂર છે. આનો અર્થ છે કે દરેક 100 કારોમાંથી {percent} કારો.',
    viz_totalCars: 'કુલ: ₹{base} (100 કારો, 20 પ્રતિનિધિ કારો બતાવવામાં આવી છે)',
    viz_carsOutOf: 'કારોમાંથી',
    viz_percentMeans: '{percent}% એટલે દરેક 100 કારોમાંથી {percent} કારો',
    viz_multiplyFraction: 'વાસ્તવિક કારો (અથવા રૂપિયા)ની સંખ્યા મેળવવા માટે અપૂર્ણાંકને {base} વડે ગુણો',
    viz_calculation: 'ગણતરી: {result} ÷ 100 = {answer} કારો (અથવા ₹{answer})',
    viz_carsOutOf100: '100 કારોમાંથી {count} કારો = {percent}%',
    viz_percentMeansOutOf100: '{percent}% એટલે દરેક 100 માંથી {percent}',
    viz_soPercentOf: 'તો ₹{base} નો {percent}% = ₹{answer} (20 માંથી 1 હાઇલાઇટ કાર, 100 માંથી {percent} નું પ્રતિનિધિત્વ કરે છે)',
    viz_siFormula: 'ઘણા વર્ષો માટે સરળ વ્યાજનું સૂત્ર',
    viz_carRepresentsPrincipal: 'દરેક કાર મૂળધન (P) નું પ્રતિનિધિત્વ કરે છે. આપણે દર (R) અને સમય (T) વડે ગુણાકાર કરીએ છીએ, પછી 100 વડે ભાગીએ છીએ.',
    viz_substitute: 'સ્થાનાપન્ન: P={P}, R={R}%, T={T}',
    viz_cars: 'કારો',
    viz_principalEquals: 'મૂળધન = ₹{P} (10 કારો, દરેક = ₹{carValue}). દર = {R}% પ્રતિ વર્ષ. સમય = {T} વર્ષ.',
    viz_multiply: 'P × R × T = {result} ગુણાકાર કરો (કારો દ્વારા દર્શાવેલ, દરેક ≈ ₹{carValue})',
    viz_interestFor: 'વ્યાજ = ₹{I} {T} વર્ષો માટે (9 કારો, દરેક ≈ ₹{carValue})',
    viz_answerForYears: 'જવાબ: I = ₹{I} {T} વર્ષો માટે',
    viz_totalSiForYears: 'કુલ સરળ વ્યાજ = ₹{I} {T} વર્ષો માટે',
    viz_eachCarRepresentsInterest: 'દરેક કાર ₹{carValue} વ્યાજનું પ્રતિનિધિત્વ કરે છે',
    viz_formulaCalculation: 'સૂત્ર: I = (₹{P} × {R}% × {T}) ÷ 100 = ₹{I}',
    
    // Step explanations for percentTool.ts (Gujarati)
    step_siOneYear_title: 'સરળ વ્યાજ (1 વર્ષ)',
    step_siOneYear_step1: 'પગલું 1:',
    step_siOneYear_eq1: 'I = (P × R × T)/100',
    step_siOneYear_exp1: 'સરળ વ્યાજનું સૂત્ર.',
    step_siOneYear_step2: 'પગલું 2:',
    step_siOneYear_eq2: 'સ્થાનાપન્ન: P={P}, R={R}%, T={T}',
    step_siOneYear_exp2: 'મૂળધન, દર અને સમય भरो.',
    step_siOneYear_step3: 'પગલું 3:',
    step_siOneYear_eq3: 'I = ({P} × {R} × {T})/100',
    step_siOneYear_exp3: 'P, R, T નું ગુણાકાર.',
    step_siOneYear_step4: 'પગલું 4:',
    step_siOneYear_eq4: '= {result}/100 = ₹{I}',
    step_siOneYear_exp4: '100 થી ભાગ આપી વ્યાજ મેળવો.',
    step_siOneYear_step5: 'પગલું 5:',
    step_siOneYear_eq5: 'જવાબ: I = ₹{I} ✓',
    step_siOneYear_exp5: 'એક વર્ષનું વ્યાજ.',
    
    step_siMultiYears_title: 'સરળ વ્યાજ (T વર્ષ)',
    step_siMultiYears_step1: 'પગલું 1:',
    step_siMultiYears_eq1: 'I = (P × R × T)/100',
    step_siMultiYears_exp1: 'ઘણા વર્ષો માટે SI નું સૂત્ર.',
    step_siMultiYears_step2: 'પગલું 2:',
    step_siMultiYears_eq2: 'સ્થાનાપન્ન: P={P}, R={R}%, T={T}',
    step_siMultiYears_exp2: 'મૂલ્યો भरो.',
    step_siMultiYears_step3: 'પગલું 3:',
    step_siMultiYears_eq3: 'I = ({P} × {R} × {T})/100',
    step_siMultiYears_exp3: 'ગુણાકાર કરો.',
    step_siMultiYears_step4: 'પગલું 4:',
    step_siMultiYears_eq4: '= {result}/100 = ₹{I}',
    step_siMultiYears_exp4: '100 થી ભાગ આપો.',
    step_siMultiYears_step5: 'પગલું 5:',
    step_siMultiYears_eq5: 'જવાબ: I = ₹{I} ✓',
    step_siMultiYears_exp5: 'T વર્ષનું વ્યાજ.',
    
    step_siAmount_title: 'રકમ (A = P + I)',
    step_siAmount_step1: 'પગલું 1:',
    step_siAmount_eq1: 'A = P + I',
    step_siAmount_exp1: 'રકમ = મૂળધન + વ્યાજ.',
    step_siAmount_step2: 'પગલું 2:',
    step_siAmount_eq2: 'મૂલ્યો: P={P}, I={I}',
    step_siAmount_exp2: 'ઉદાહરણના મૂલ્યો લો.',
    step_siAmount_step3: 'પગલું 3:',
    step_siAmount_eq3: 'A = {P} + {I}',
    step_siAmount_exp3: 'સ્થાનાપન્ન કરો.',
    step_siAmount_step4: 'પગલું 4:',
    step_siAmount_eq4: '= ₹{A}',
    step_siAmount_exp4: 'બંને ઉમેરો.',
    step_siAmount_step5: 'પગલું 5:',
    step_siAmount_eq5: 'જવાબ: A = ₹{A} ✓',
    step_siAmount_exp5: 'ચુકવવાની કુલ રકમ.',
    
    step_siKeyPoint_title: 'મુખ્ય મુદ્દો: વ્યાજ ફક્ત મૂળધન પર',
    step_siKeyPoint_step1: 'પગલું 1:',
    step_siKeyPoint_eq1: 'SI ફક્ત P પર આધારિત છે',
    step_siKeyPoint_exp1: 'સરળ વ્યાજ હંમેશા મૂળધન પર જ ગણાય છે.',
    step_siKeyPoint_step2: 'પગલું 2:',
    step_siKeyPoint_eq2: 'કોઈ કમ્પાઉન્ડિંગ નથી',
    step_siKeyPoint_exp2: 'આગલા વર્ષ માટે વ્યાજ મૂળમાં ઉમેરાતું નથી.',
    step_siKeyPoint_step3: 'પગલું 3:',
    step_siKeyPoint_eq3: 'ઉદાહરણ: P=₹1000, R=10% p.a., T=3',
    step_siKeyPoint_exp3: 'દર વર્ષે વ્યાજ ₹100.',
    step_siKeyPoint_step4: 'પગલું 4:',
    step_siKeyPoint_eq4: 'કુલ I = 100 × 3 = ₹300',
    step_siKeyPoint_exp4: 'T વર્ષ માટે ઉમેરો.',
    step_siKeyPoint_step5: 'પગલું 5:',
    step_siKeyPoint_eq5: 'A = P + I = 1000 + 300 = ₹1300',
    step_siKeyPoint_exp5: 'ચુકવવાની કુલ રકમ.',
    
    // DemonstrationMode texts (Gujarati)
    demo_siTitle: 'સરળ વ્યાજ',
    demo_siDefinition: 'સરળ વ્યાજ એ એવું વ્યાજ છે જે માત્ર મૂળધન પર ગણાય છે.',
    demo_siFormulaNote: 'I = (P×R×T)/100 સૂત્ર થી નિકાલાય છે.',
    demo_siUsage: 'I = (P×R×T)/100 અને A = P + I નો ઉપયોગ કરો.',
    demo_examples: 'ઉદાહરણો',
  }
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'hi' | 'gu'>(() => {
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
