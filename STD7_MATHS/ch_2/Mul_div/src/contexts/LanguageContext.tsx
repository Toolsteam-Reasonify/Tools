import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi' | 'gu';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    appTitle: 'Multiplication & Division of Decimals',
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
    play: 'Play',
    pause: 'Pause',
    yourAnswer: 'Your Answer',
    correct: 'Correct!',
    incorrect: 'Incorrect. Try again!',
    score: 'Score',
    attempts: 'Attempts',
    solution: 'Solution',
    step: 'Step',
    of: 'of',
    clickToExpand: 'Click to expand',
    clickToCollapse: 'Click to collapse',
    questionLabel: 'Question',
    answerLabel: 'Answer',
    calculationLabel: 'Calculation',
    decimalPointMovement: 'Decimal Point Movement',
    decimalDivisionExamples: 'Decimal Division Examples',
    finding01x01Title: 'Finding 0.1 × 0.1',
    finding01x01Text1: '0.1 means one-tenth, so 0.1 × 0.1 means one-tenth of one-tenth.',
    finding01x01Text2: 'This equals one-hundredth, which is 0.01.',
    stepByStepCalculation: 'Step-by-Step Calculation',
    visualGridRepresentation: 'Visual Grid Representation',
    gridExplanation1: 'The dotted squares represent 2/10 × 3/10 or 0.2 × 0.3',
    gridExplanation2: 'Since there are 6 dotted squares out of 100, so they also represent 0.06',
    gridConclusion: 'Thus, 0.2 × 0.3 = 0.06',
    countShadedSquares: 'Count shaded squares to find the answer',
    oneZeroOnePlaceRight: '1 zero → 1 place right',
    twoZerosTwoPlacesRight: '2 zeros → 2 places right',
    threeZerosThreePlacesRight: '3 zeros → 3 places right',
    oneZeroOnePlaceLeft: '1 zero → 1 place left',
    twoZerosTwoPlacesLeft: '2 zeros → 2 places left',
    threeZerosThreePlacesLeft: '3 zeros → 3 places left',
    
    // Learn Tab - Steps
    step1Title: 'Understanding Decimal Multiplication',
    step1Desc: 'Learn the basics of multiplying decimal numbers',
    step1Concept: 'When multiplying decimals, we can convert them to fractions first, then multiply numerators and denominators.',
    
    step2Title: 'Visual Representation with Grids',
    step2Desc: 'See how decimal multiplication works using visual grids',
    step2Concept: 'Visual grids help understand decimal multiplication concepts.',
    
    step3Title: 'Multiplication by 10, 100, 1000',
    step3Desc: 'Learn the pattern for multiplying decimals by powers of 10',
    step3Concept: 'When multiplying by 10, 100, or 1000, the decimal point shifts to the right by the number of zeros.',
    
    step4Title: 'Division of Decimal Numbers',
    step4Desc: 'Learn how to divide decimal numbers step by step',
    step4Concept: 'Division of decimals can be done by converting to fractions or by moving decimal points to make whole numbers.',
    
    // Learn Tab - Key Points
    keyPoint1: 'Convert decimals to fractions for easier calculation',
    keyPoint2: 'Count decimal places to place decimal point correctly',
    keyPoint3: 'Visual grids help understand decimal concepts',
    keyPoint4: 'Practice with real-world examples',
    
    // Step 1 Learning Points
    step1Point1: 'Decimals represent parts of a whole number',
    step1Point2: 'Use visual models to understand decimal concepts',
    step1Point3: 'Convert between decimals and fractions',
    step1Point4: 'Practice with different decimal values',
    
    // Step 2 Learning Points
    step2Point1: 'Grid patterns make decimal operations visual and clear',
    step2Point2: 'Overlapping areas show the product',
    step2Point3: 'Each small square represents 0.01',
    step2Point4: 'Convert decimals to fractions for easier calculation',
    step2Point5: 'Practice with different decimal combinations',
    
    // Step 3 Learning Points
    step3Point1: 'Decimal point moves RIGHT when multiplying',
    step3Point2: 'Number of places = Number of zeros',
    step3Point3: 'Example: 0.07 × 1000 = 70',
    step3Point4: 'This rule works for any decimal number',
    step3Point5: 'Practice with different powers of 10',
    
    // Step 4 Learning Points
    step4Point1: 'Decimal point moves LEFT when dividing',
    step4Point2: 'Convert to whole numbers for easier calculation',
    step4Point3: 'Use fraction method or decimal shifting',
    step4Point4: 'Practice with different decimal divisors',
    step4Point5: 'Check your answer by multiplying back',
    
    // Practice Mode
    practiceTitle: 'Practice Problems',
    practiceSubtitle: 'Test your understanding of decimal operations',
    dataTitle: 'Problem',
    questionTitle: 'Solve',
    hintLabel: 'Hint',
    solutionLabel: 'Solution',
    stepLabel: 'Step',
    
    // Practice Questions - Multiplication
    mulQ1Question: 'Find: 0.1 × 0.1',
    mulQ1Hint: 'Convert to fractions: 0.1 = 1/10, so (1/10) × (1/10) = 1/100',
    mulQ1Solution: '0.1 × 0.1 = (1/10) × (1/10) = 1/100 = 0.01',
    mulQ1Answer: '0.01',
    
    mulQ2Question: 'Find: 0.2 × 0.3',
    mulQ2Hint: 'Convert to fractions: (2/10) × (3/10) = 6/100',
    mulQ2Solution: '0.2 × 0.3 = (2/10) × (3/10) = 6/100 = 0.06',
    mulQ2Answer: '0.06',
    
    mulQ3Question: 'Find: 1.2 × 2.5',
    mulQ3Hint: 'Multiply as whole numbers: 12 × 25 = 300, then place decimal',
    mulQ3Solution: '1.2 × 2.5 = 12 × 25 = 300, with 2 decimal places = 3.00',
    mulQ3Answer: '3.00',
    
    mulQ4Question: 'Find: 2.7 × 10',
    mulQ4Hint: 'When multiplying by 10, move decimal point one place right',
    mulQ4Solution: '2.7 × 10 = 27.0',
    mulQ4Answer: '27.0',
    
    mulQ5Question: 'Find: 1.76 × 100',
    mulQ5Hint: 'When multiplying by 100, move decimal point two places right',
    mulQ5Solution: '1.76 × 100 = 176.0',
    mulQ5Answer: '176.0',
    
    mulQ6Question: 'Find: 0.05 × 7',
    mulQ6Hint: 'Multiply 5 × 7 = 35, then place decimal point',
    mulQ6Solution: '0.05 × 7 = 0.35',
    mulQ6Answer: '0.35',
    
    // Practice Questions - Division
    divQ1Question: 'Find: 31.5 ÷ 10',
    divQ1Hint: 'When dividing by 10, move decimal point one place left',
    divQ1Solution: '31.5 ÷ 10 = 3.15',
    divQ1Answer: '3.15',
    
    divQ2Question: 'Find: 6.4 ÷ 2',
    divQ2Hint: 'Divide as whole numbers: 64 ÷ 2 = 32, then place decimal',
    divQ2Solution: '6.4 ÷ 2 = 64 ÷ 2 = 32, with 1 decimal place = 3.2',
    divQ2Answer: '3.2',
    
    divQ3Question: 'Find: 25.5 ÷ 0.5',
    divQ3Hint: 'Convert to whole numbers: 255 ÷ 5',
    divQ3Solution: '25.5 ÷ 0.5 = 255 ÷ 5 = 51',
    divQ3Answer: '51',
    
    divQ4Question: 'Find: 235.4 ÷ 100',
    divQ4Hint: 'When dividing by 100, move decimal point two places left',
    divQ4Solution: '235.4 ÷ 100 = 2.354',
    divQ4Answer: '2.354',
    
    divQ5Question: 'Find: 19.5 ÷ 5',
    divQ5Hint: 'Divide 195 ÷ 5 = 39, then place decimal point',
    divQ5Solution: '19.5 ÷ 5 = 3.9',
    divQ5Answer: '3.9',
    
    divQ6Question: 'Find: 0.4 ÷ 2',
    divQ6Hint: 'Divide 4 ÷ 2 = 2, then place decimal point',
    divQ6Solution: '0.4 ÷ 2 = 0.2',
    divQ6Answer: '0.2',
    
    // Real World Examples
    realWorldTitle: 'Real World Applications',
    realWorldSubtitle: 'See how decimal operations are used in everyday life',
    
    ex1Title: 'Shopping',
    ex1Context: 'Buy 2.5 kg apples at ₹12.50 per kg. What is the total cost?',
    ex1Question: 'Calculate total cost',
    ex1Answer: 'Total = 2.5 × 12.50 = ₹31.25',
    ex1Calculation: '2.5 × 12.50 = 31.25',
    
    ex2Title: 'Room Area',
    ex2Context: 'A room is 4.2 m long and 3.5 m wide. Find its area.',
    ex2Question: 'Calculate area',
    ex2Answer: 'Area = 4.2 × 3.5 = 14.7 m²',
    ex2Calculation: '4.2 × 3.5 = 14.7',
    
    ex3Title: 'Fuel Efficiency',
    ex3Context: 'A bike travels 36 km with 1.8 litres of fuel. How far with 1 litre?',
    ex3Question: 'Find distance per litre',
    ex3Answer: 'Distance = 36 ÷ 1.8 = 20 km',
    ex3Calculation: '36 ÷ 1.8 = 20',
    
    ex4Title: 'Fence Posts',
    ex4Context: 'Each fence post is 1.5 m apart. Total fence is 12 m. How many posts?',
    ex4Question: 'Count fence posts',
    ex4Answer: 'Posts = 12 ÷ 1.5 = 8 posts',
    ex4Calculation: '12 ÷ 1.5 = 8',
    
    ex5Title: 'Running Speed',
    ex5Context: 'A runner covers 15.6 km in 1.3 hours. What is the speed?',
    ex5Question: 'Find running speed',
    ex5Answer: 'Speed = 15.6 ÷ 1.3 = 12 km/h',
    ex5Calculation: '15.6 ÷ 1.3 = 12',
    
    ex6Title: 'Ribbon Pieces',
    ex6Context: 'Cut a 7.2 m ribbon into 0.8 m pieces. How many pieces?',
    ex6Question: 'Count ribbon pieces',
    ex6Answer: 'Pieces = 7.2 ÷ 0.8 = 9 pieces',
    ex6Calculation: '7.2 ÷ 0.8 = 9',
    
    // Why Decimal Operations Matter
    whyMatterTitle: 'Why Decimal Operations Matter?',
    whyMatterPoint1: 'Money Calculations: Essential for handling currency and financial transactions.',
    whyMatterPoint2: 'Measurements: Critical for scientific and engineering calculations.',
    whyMatterPoint3: 'Data Analysis: Important for statistics and data interpretation.',
    whyMatterPoint4: 'Daily Life: Used in shopping, cooking, and time calculations.',
    
    // Pro Tip
    proTipTitle: 'Pro Tip!',
    proTipText: 'When multiplying decimals, count the total decimal places in both numbers. The answer will have the same number of decimal places! 📊✨',
    
    // Grid Visualizations
    gridTitle: 'Visual Grid Representation',
    gridExplanation: 'This 10×10 grid represents 1 whole. Each small square = 0.01',
    shadedPart: 'Shaded Part',
    represents: 'Represents',
    whole: 'Whole',
    tenth: 'Tenth',
    hundredth: 'Hundredth',
    
    // Decimal Point Movement
    decimalMoveTitle: 'Decimal Point Movement',
    moveRight: 'Moves Right',
    moveLeft: 'Moves Left',
    places: 'places',
    zero: 'zero',
    zeros: 'zeros',
    
    // Practice Complete
    practiceComplete: 'Practice Complete!',
    practiceCompleteSubtitle: 'You\'ve finished all decimal operation exercises!',
    yourScore: 'Your Score',
    accuracy: 'Accuracy',
    performance: 'Performance',
    totalAttempts: 'Total Attempts',
    exerciseBreakdown: 'Exercise Breakdown',
    questionLabel: 'Question',
    attemptLabel: 'attempt(s)',
    practiceAgain: '🔄 Practice Again',
    
    // Input and UI
    placeholderAnswer: 'Type your answer here... ✍️',
    answerLabel: 'Answer',
    viewAssessment: 'View Assessment',
    
    // Progress labels
    questionProgress: 'Question',
    of: 'of',
    
    // Button labels
    clickToExpand: 'Click to expand',
    clickToCollapse: 'Click to collapse',
    
    // Mathematical symbols and terms
    multiply: 'Multiply',
    divide: 'Divide',
    equals: 'Equals',
    decimalPoint: 'Decimal Point',
    fraction: 'Fraction',
    wholeNumber: 'Whole Number',
    area: 'Area',
    perimeter: 'Perimeter',
    distance: 'Distance',
    speed: 'Speed',
    time: 'Time',
    cost: 'Cost',
    price: 'Price',
    quantity: 'Quantity',
    
    // Units
    rupees: '₹',
    centimeters: 'cm',
    kilometers: 'km',
    hours: 'hrs',
    litres: 'L',
    kg: 'kg',
    sides: 'sides',
    strips: 'strips',
    
    // Practice types
    basicDecimalOperation: 'Basic decimal operation',
    multiplyDivideByPowers: 'Multiplying/Dividing by 10, 100, or 1000',
    decimalByDecimal: 'Decimal by decimal operation',
    decimalByWhole: 'Decimal by whole number',
  },
  hi: {
    // Header
    appTitle: 'दशमलव का गुणा और भाग',
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
    play: 'चलाएं',
    pause: 'रोकें',
    yourAnswer: 'आपका उत्तर',
    correct: 'सही!',
    incorrect: 'गलत। पुनः प्रयास करें!',
    score: 'अंक',
    attempts: 'प्रयास',
    solution: 'समाधान',
    step: 'चरण',
    of: 'का',
    clickToExpand: 'विस्तार करने के लिए क्लिक करें',
    clickToCollapse: 'सिकोड़ने के लिए क्लिक करें',
    questionLabel: 'प्रश्न',
    answerLabel: 'उत्तर',
    calculationLabel: 'गणना',
    decimalPointMovement: 'दशमलव बिंदु की गति',
    decimalDivisionExamples: 'दशमलव भाग के उदाहरण',
    finding01x01Title: '0.1 × 0.1 ज्ञात करना',
    finding01x01Text1: '0.1 का अर्थ है एक-दसवां, इसलिए 0.1 × 0.1 का अर्थ है एक-दसवां का एक-दसवां।',
    finding01x01Text2: 'यह एक-सौवां के बराबर है, जो 0.01 है।',
    stepByStepCalculation: 'चरणबद्ध गणना',
    visualGridRepresentation: 'दृश्य ग्रिड प्रतिनिधित्व',
    gridExplanation1: 'बिंदीदार वर्ग 2/10 × 3/10 या 0.2 × 0.3 का प्रतिनिधित्व करते हैं',
    gridExplanation2: 'चूंकि 100 में से 6 बिंदीदार वर्ग हैं, इसलिए वे 0.06 का भी प्रतिनिधित्व करते हैं',
    gridConclusion: 'इस प्रकार, 0.2 × 0.3 = 0.06',
    countShadedSquares: 'उत्तर ज्ञात करने के लिए छायांकित वर्गों को गिनें',
    oneZeroOnePlaceRight: '1 शून्य → 1 स्थान दाईं ओर',
    twoZerosTwoPlacesRight: '2 शून्य → 2 स्थान दाईं ओर',
    threeZerosThreePlacesRight: '3 शून्य → 3 स्थान दाईं ओर',
    oneZeroOnePlaceLeft: '1 शून्य → 1 स्थान बाईं ओर',
    twoZerosTwoPlacesLeft: '2 शून्य → 2 स्थान बाईं ओर',
    threeZerosThreePlacesLeft: '3 शून्य → 3 स्थान बाईं ओर',
    
    // Learn Tab - Steps
    step1Title: 'दशमलव गुणा को समझना',
    step1Desc: 'दशमलव संख्याओं के गुणा की मूल बातें सीखें',
    step1Concept: 'दशमलव गुणा करते समय, हम पहले उन्हें भिन्न में बदल सकते हैं, फिर अंश और हर को गुणा करते हैं।',
    
    step2Title: 'ग्रिड के साथ दृश्य प्रतिनिधित्व',
    step2Desc: 'देखें कि दशमलव गुणा दृश्य ग्रिड का उपयोग करके कैसे काम करता है',
    step2Concept: '10×10 ग्रिड 1 पूर्ण का प्रतिनिधित्व करता है। प्रत्येक छोटा वर्ग 0.01 या 1/100 का प्रतिनिधित्व करता है।',
    
    step3Title: '10, 100, 1000 से गुणा',
    step3Desc: 'दशमलव को 10 की घातों से गुणा करने का पैटर्न सीखें',
    step3Concept: '10, 100, या 1000 से गुणा करते समय, दशमलव बिंदु शून्य की संख्या के अनुसार दाईं ओर खिसक जाता है।',
    
    step4Title: 'दशमलव संख्याओं का भाग',
    step4Desc: 'दशमलव संख्याओं को चरणबद्ध तरीके से भाग करना सीखें',
    step4Concept: 'दशमलव का भाग भिन्न में बदलकर या पूर्ण संख्या बनाने के लिए दशमलव बिंदु को स्थानांतरित करके किया जा सकता है।',
    
    // Learn Tab - Key Points
    keyPoint1: 'आसान गणना के लिए दशमलव को भिन्न में बदलें',
    keyPoint2: 'दशमलव बिंदु को सही स्थान पर रखने के लिए दशमलव स्थानों की गिनती करें',
    keyPoint3: 'दृश्य ग्रिड दशमलव अवधारणाओं को समझने में मदद करते हैं',
    keyPoint4: 'वास्तविक दुनिया के उदाहरणों के साथ अभ्यास करें',
    
    // Step 1 Learning Points
    step1Point1: 'दशमलव पूर्ण संख्या के भागों का प्रतिनिधित्व करते हैं',
    step1Point2: 'दशमलव अवधारणाओं को समझने के लिए दृश्य मॉडल का उपयोग करें',
    step1Point3: 'दशमलव और भिन्न के बीच रूपांतरण करें',
    step1Point4: 'विभिन्न दशमलव मूल्यों के साथ अभ्यास करें',
    
    // Step 2 Learning Points
    step2Point1: 'ग्रिड पैटर्न दशमलव संक्रियाओं को दृश्य और स्पष्ट बनाते हैं',
    step2Point2: 'ओवरलैपिंग क्षेत्र गुणनफल दिखाते हैं',
    step2Point3: 'प्रत्येक छोटा वर्ग 0.01 का प्रतिनिधित्व करता है',
    step2Point4: 'आसान गणना के लिए दशमलव को भिन्न में बदलें',
    step2Point5: 'विभिन्न दशमलव संयोजनों के साथ अभ्यास करें',
    
    // Step 3 Learning Points
    step3Point1: 'गुणा करते समय दशमलव बिंदु दाईं ओर खिसकता है',
    step3Point2: 'स्थानों की संख्या = शून्य की संख्या',
    step3Point3: 'उदाहरण: 0.07 × 1000 = 70',
    step3Point4: 'यह नियम किसी भी दशमलव संख्या के लिए काम करता है',
    step3Point5: '10 की विभिन्न घातों के साथ अभ्यास करें',
    
    // Step 4 Learning Points
    step4Point1: 'भाग करते समय दशमलव बिंदु बाईं ओर खिसकता है',
    step4Point2: 'आसान गणना के लिए पूर्ण संख्याओं में बदलें',
    step4Point3: 'भिन्न विधि या दशमलव स्थानांतरण का उपयोग करें',
    step4Point4: 'विभिन्न दशमलव भाजकों के साथ अभ्यास करें',
    step4Point5: 'वापस गुणा करके अपने उत्तर की जांच करें',
    
    // Practice Mode
    practiceTitle: 'अभ्यास समस्याएं',
    practiceSubtitle: 'दशमलव संक्रियाओं की अपनी समझ का परीक्षण करें',
    dataTitle: 'समस्या',
    questionTitle: 'हल करें',
    hintLabel: 'संकेत',
    solutionLabel: 'समाधान',
    stepLabel: 'चरण',
    
    // Practice Questions - Multiplication
    mulQ1Question: 'ज्ञात करें: 0.1 × 0.1',
    mulQ1Hint: 'भिन्न में बदलें: 0.1 = 1/10, इसलिए (1/10) × (1/10) = 1/100',
    mulQ1Solution: '0.1 × 0.1 = (1/10) × (1/10) = 1/100 = 0.01',
    mulQ1Answer: '0.01',
    
    mulQ2Question: 'ज्ञात करें: 0.2 × 0.3',
    mulQ2Hint: 'भिन्न में बदलें: (2/10) × (3/10) = 6/100',
    mulQ2Solution: '0.2 × 0.3 = (2/10) × (3/10) = 6/100 = 0.06',
    mulQ2Answer: '0.06',
    
    mulQ3Question: 'ज्ञात करें: 1.2 × 2.5',
    mulQ3Hint: 'पूर्ण संख्याओं के रूप में गुणा करें: 12 × 25 = 300, फिर दशमलव रखें',
    mulQ3Solution: '1.2 × 2.5 = 12 × 25 = 300, 2 दशमलव स्थानों के साथ = 3.00',
    mulQ3Answer: '3.00',
    
    mulQ4Question: 'ज्ञात करें: 2.7 × 10',
    mulQ4Hint: '10 से गुणा करते समय, दशमलव बिंदु को एक स्थान दाईं ओर ले जाएं',
    mulQ4Solution: '2.7 × 10 = 27.0',
    mulQ4Answer: '27.0',
    
    mulQ5Question: 'ज्ञात करें: 1.76 × 100',
    mulQ5Hint: '100 से गुणा करते समय, दशमलव बिंदु को दो स्थान दाईं ओर ले जाएं',
    mulQ5Solution: '1.76 × 100 = 176.0',
    mulQ5Answer: '176.0',
    
    mulQ6Question: 'ज्ञात करें: 0.05 × 7',
    mulQ6Hint: '5 × 7 = 35 गुणा करें, फिर दशमलव बिंदु रखें',
    mulQ6Solution: '0.05 × 7 = 0.35',
    mulQ6Answer: '0.35',
    
    // Practice Questions - Division
    divQ1Question: 'ज्ञात करें: 31.5 ÷ 10',
    divQ1Hint: '10 से भाग देते समय, दशमलव बिंदु को एक स्थान बाईं ओर ले जाएं',
    divQ1Solution: '31.5 ÷ 10 = 3.15',
    divQ1Answer: '3.15',
    
    divQ2Question: 'ज्ञात करें: 6.4 ÷ 2',
    divQ2Hint: 'पूर्ण संख्याओं के रूप में भाग दें: 64 ÷ 2 = 32, फिर दशमलव रखें',
    divQ2Solution: '6.4 ÷ 2 = 64 ÷ 2 = 32, 1 दशमलव स्थान के साथ = 3.2',
    divQ2Answer: '3.2',
    
    divQ3Question: 'ज्ञात करें: 25.5 ÷ 0.5',
    divQ3Hint: 'पूर्ण संख्याओं में बदलें: 255 ÷ 5',
    divQ3Solution: '25.5 ÷ 0.5 = 255 ÷ 5 = 51',
    divQ3Answer: '51',
    
    divQ4Question: 'ज्ञात करें: 235.4 ÷ 100',
    divQ4Hint: '100 से भाग देते समय, दशमलव बिंदु को दो स्थान बाईं ओर ले जाएं',
    divQ4Solution: '235.4 ÷ 100 = 2.354',
    divQ4Answer: '2.354',
    
    divQ5Question: 'ज्ञात करें: 19.5 ÷ 5',
    divQ5Hint: '195 ÷ 5 = 39 भाग दें, फिर दशमलव बिंदु रखें',
    divQ5Solution: '19.5 ÷ 5 = 3.9',
    divQ5Answer: '3.9',
    
    divQ6Question: 'ज्ञात करें: 0.4 ÷ 2',
    divQ6Hint: '4 ÷ 2 = 2 भाग दें, फिर दशमलव बिंदु रखें',
    divQ6Solution: '0.4 ÷ 2 = 0.2',
    divQ6Answer: '0.2',
    
    // Real World Examples
    realWorldTitle: 'वास्तविक दुनिया के अनुप्रयोग',
    realWorldSubtitle: 'देखें कि दशमलव संक्रियाओं का उपयोग रोजमर्रा की जिंदगी में कैसे किया जाता है',
    
    ex1Title: 'खरीदारी',
    ex1Context: '₹12.50 प्रति किलो की दर से 2.5 किलो सेब खरीदें। कुल लागत क्या है?',
    ex1Question: 'कुल लागत की गणना करें',
    ex1Answer: 'कुल = 2.5 × 12.50 = ₹31.25',
    ex1Calculation: '2.5 × 12.50 = 31.25',
    
    ex2Title: 'कमरे का क्षेत्रफल',
    ex2Context: 'एक कमरा 4.2 मीटर लंबा और 3.5 मीटर चौड़ा है। इसका क्षेत्रफल ज्ञात करें।',
    ex2Question: 'क्षेत्रफल की गणना करें',
    ex2Answer: 'क्षेत्रफल = 4.2 × 3.5 = 14.7 मी²',
    ex2Calculation: '4.2 × 3.5 = 14.7',
    
    ex3Title: 'ईंधन दक्षता',
    ex3Context: 'एक बाइक 1.8 लीटर ईंधन से 36 किमी चलती है। 1 लीटर से कितनी दूर?',
    ex3Question: 'प्रति लीटर दूरी ज्ञात करें',
    ex3Answer: 'दूरी = 36 ÷ 1.8 = 20 किमी',
    ex3Calculation: '36 ÷ 1.8 = 20',
    
    ex4Title: 'बाड़ के खंभे',
    ex4Context: 'प्रत्येक बाड़ का खंभा 1.5 मीटर दूर है। कुल बाड़ 12 मीटर है। कितने खंभे?',
    ex4Question: 'बाड़ के खंभे गिनें',
    ex4Answer: 'खंभे = 12 ÷ 1.5 = 8 खंभे',
    ex4Calculation: '12 ÷ 1.5 = 8',
    
    ex5Title: 'दौड़ने की गति',
    ex5Context: 'एक धावक 1.3 घंटे में 15.6 किमी दौड़ता है। गति क्या है?',
    ex5Question: 'दौड़ने की गति ज्ञात करें',
    ex5Answer: 'गति = 15.6 ÷ 1.3 = 12 किमी/घंटा',
    ex5Calculation: '15.6 ÷ 1.3 = 12',
    
    ex6Title: 'रिबन के टुकड़े',
    ex6Context: '7.2 मीटर रिबन को 0.8 मीटर के टुकड़ों में काटें। कितने टुकड़े?',
    ex6Question: 'रिबन के टुकड़े गिनें',
    ex6Answer: 'टुकड़े = 7.2 ÷ 0.8 = 9 टुकड़े',
    ex6Calculation: '7.2 ÷ 0.8 = 9',
    
    // Why Decimal Operations Matter
    whyMatterTitle: 'दशमलव संक्रियाएं क्यों महत्वपूर्ण हैं?',
    whyMatterPoint1: 'धन की गणना: मुद्रा और वित्तीय लेनदेन के लिए आवश्यक।',
    whyMatterPoint2: 'मापन: वैज्ञानिक और इंजीनियरिंग गणनाओं के लिए महत्वपूर्ण।',
    whyMatterPoint3: 'डेटा विश्लेषण: सांख्यिकी और डेटा व्याख्या के लिए महत्वपूर्ण।',
    whyMatterPoint4: 'दैनिक जीवन: खरीदारी, खाना पकाने और समय की गणना में उपयोग किया जाता है।',
    
    // Pro Tip
    proTipTitle: 'विशेषज्ञ सुझाव!',
    proTipText: 'दशमलव गुणा करते समय, दोनों संख्याओं में दशमलव स्थानों की कुल संख्या गिनें। उत्तर में समान संख्या में दशमलव स्थान होंगे! 📊✨',
    
    // Grid Visualizations
    gridTitle: 'दृश्य ग्रिड प्रतिनिधित्व',
    gridExplanation: 'यह 10×10 ग्रिड 1 पूर्ण का प्रतिनिधित्व करता है। प्रत्येक छोटा वर्ग = 0.01',
    shadedPart: 'छायांकित भाग',
    represents: 'प्रतिनिधित्व करता है',
    whole: 'पूर्ण',
    tenth: 'दशमांश',
    hundredth: 'शतांश',
    
    // Decimal Point Movement
    decimalMoveTitle: 'दशमलव बिंदु का स्थानांतरण',
    moveRight: 'दाईं ओर खिसकता है',
    moveLeft: 'बाईं ओर खिसकता है',
    places: 'स्थान',
    zero: 'शून्य',
    zeros: 'शून्य',
    
    // Practice Complete
    practiceComplete: 'अभ्यास पूरा!',
    practiceCompleteSubtitle: 'आपने सभी दशमलव संक्रिया अभ्यास पूरे कर लिए हैं!',
    yourScore: 'आपका स्कोर',
    accuracy: 'सटीकता',
    performance: 'प्रदर्शन',
    totalAttempts: 'कुल प्रयास',
    exerciseBreakdown: 'अभ्यास विवरण',
    questionLabel: 'प्रश्न',
    attemptLabel: 'प्रयास',
    practiceAgain: '🔄 फिर से अभ्यास करें',
    
    // Input and UI
    placeholderAnswer: 'अपना जवाब यहाँ टाइप करें... ✍️',
    answerLabel: 'जवाब',
    viewAssessment: 'मूल्यांकन देखें',
    
    // Progress labels
    questionProgress: 'प्रश्न',
    of: 'का',
    
    // Button labels
    clickToExpand: 'विस्तार करने के लिए क्लिक करें',
    clickToCollapse: 'संकुचित करने के लिए क्लिक करें',
    
    // Mathematical symbols and terms
    multiply: 'गुणा',
    divide: 'भाग',
    equals: 'बराबर',
    decimalPoint: 'दशमलव बिंदु',
    fraction: 'भिन्न',
    wholeNumber: 'पूर्ण संख्या',
    area: 'क्षेत्रफल',
    perimeter: 'परिमाप',
    distance: 'दूरी',
    speed: 'गति',
    time: 'समय',
    cost: 'लागत',
    price: 'मूल्य',
    quantity: 'मात्रा',
    
    // Units
    rupees: '₹',
    centimeters: 'सेमी',
    kilometers: 'किमी',
    hours: 'घंटे',
    litres: 'लीटर',
    kg: 'किलो',
    sides: 'भुजाएं',
    strips: 'पट्टियां',
    
    // Practice types
    basicDecimalOperation: 'मूल दशमलव संक्रिया',
    multiplyDivideByPowers: '10, 100, या 1000 से गुणा/भाग',
    decimalByDecimal: 'दशमलव से दशमलव संक्रिया',
    decimalByWhole: 'दशमलव से पूर्ण संख्या',
  },
  gu: {
    // Header
    appTitle: 'દશાંશનો ગુણાકાર અને ભાગાકાર',
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
    play: 'ચલાવો',
    pause: 'રોકો',
    yourAnswer: 'તમારો જવાબ',
    correct: 'સાચું!',
    incorrect: 'ખોટું. ફરી પ્રયાસ કરો!',
    score: 'સ્કોર',
    attempts: 'પ્રયાસો',
    solution: 'ઉકેલ',
    step: 'પગલું',
    of: 'ના',
    clickToExpand: 'વિસ્તૃત કરવા માટે ક્લિક કરો',
    clickToCollapse: 'સંકુચિત કરવા માટે ક્લિક કરો',
    questionLabel: 'પ્રશ્ન',
    answerLabel: 'જવાબ',
    calculationLabel: 'ગણના',
    decimalPointMovement: 'દશાંશ બિંદુની ગતિ',
    decimalDivisionExamples: 'દશાંશ ભાગાકારના ઉદાહરણો',
    finding01x01Title: '0.1 × 0.1 શોધવું',
    finding01x01Text1: '0.1 નો અર્થ એક-દસમો છે, તેથી 0.1 × 0.1 નો અર્થ એક-દસમાનો એક-દસમો છે.',
    finding01x01Text2: 'આ એક-સોમા જેટલું છે, જે 0.01 છે.',
    stepByStepCalculation: 'પગલાંવાર ગણના',
    visualGridRepresentation: 'દ્રશ્ય ગ્રિડ પ્રતિનિધિત્વ',
    gridExplanation1: 'બિંદુદાર ચોરસ 2/10 × 3/10 અથવા 0.2 × 0.3 નું પ્રતિનિધિત્વ કરે છે',
    gridExplanation2: '100 માંથી 6 બિંદુદાર ચોરસ હોવાથી, તેઓ 0.06 નું પણ પ્રતિનિધિત્વ કરે છે',
    gridConclusion: 'આમ, 0.2 × 0.3 = 0.06',
    countShadedSquares: 'જવાબ શોધવા માટે છાયાંકિત ચોરસ ગણો',
    oneZeroOnePlaceRight: '1 શૂન્ય → 1 સ્થાન જમણી તરફ',
    twoZerosTwoPlacesRight: '2 શૂન્યો → 2 સ્થાનો જમણી તરફ',
    threeZerosThreePlacesRight: '3 શૂન્યો → 3 સ્થાનો જમણી તરફ',
    oneZeroOnePlaceLeft: '1 શૂન્ય → 1 સ્થાન ડાબી તરફ',
    twoZerosTwoPlacesLeft: '2 શૂન્યો → 2 સ્થાનો ડાબી તરફ',
    threeZerosThreePlacesLeft: '3 શૂન્યો → 3 સ્થાનો ડાબી તરફ',
    
    // Learn Tab - Steps
    step1Title: 'દશાંશ ગુણાકારને સમજવા',
    step1Desc: 'દશાંશ સંખ્યાઓના ગુણાકારની મૂળભૂત બાબતો શીખો',
    step1Concept: 'દશાંશ ગુણાકાર કરતી વખતે, આપણે પહેલા તેમને અપૂર્ણાંકમાં બદલી શકીએ છીએ, પછી અંશ અને છેદને ગુણીએ છીએ.',
    
    step2Title: 'ગ્રિડ સાથે દ્રશ્ય પ્રતિનિધિત્વ',
    step2Desc: 'જુઓ કે દશાંશ ગુણાકાર દ્રશ્ય ગ્રિડનો ઉપયોગ કરીને કેવી રીતે કામ કરે છે',
    step2Concept: '10×10 ગ્રિડ 1 સંપૂર્ણનું પ્રતિનિધિત્વ કરે છે. દરેક નાનો ચોરસ 0.01 અથવા 1/100 નું પ્રતિનિધિત્વ કરે છે.',
    
    step3Title: '10, 100, 1000 વડે ગુણાકાર',
    step3Desc: 'દશાંશને 10 ની ઘાતો વડે ગુણાકાર કરવાનું પેટર્ન શીખો',
    step3Concept: '10, 100, અથવા 1000 વડે ગુણાકાર કરતી વખતે, દશાંશ બિંદુ શૂન્યની સંખ્યા મુજબ જમણી તરફ ખસે છે.',
    
    step4Title: 'દશાંશ સંખ્યાઓનો ભાગાકાર',
    step4Desc: 'દશાંશ સંખ્યાઓને પગલાંવાર ભાગાકાર કરવાનું શીખો',
    step4Concept: 'દશાંશનો ભાગાકાર અપૂર્ણાંકમાં બદલીને અથવા પૂર્ણ સંખ્યા બનાવવા માટે દશાંશ બિંદુને સ્થાનાંતરિત કરીને કરી શકાય છે.',
    
    // Learn Tab - Key Points
    keyPoint1: 'સરળ ગણના માટે દશાંશને અપૂર્ણાંકમાં બદલો',
    keyPoint2: 'દશાંશ બિંદુને સાચા સ્થાને મૂકવા માટે દશાંશ સ્થાનો ગણો',
    keyPoint3: 'દ્રશ્ય ગ્રિડ દશાંશ ખ્યાલોને સમજવામાં મદદ કરે છે',
    keyPoint4: 'વાસ્તવિક દુનિયાના ઉદાહરણો સાથે પ્રેક્ટિસ કરો',
    
    // Step 1 Learning Points
    step1Point1: 'દશાંશ પૂર્ણ સંખ્યાના ભાગોનું પ્રતિનિધિત્વ કરે છે',
    step1Point2: 'દશાંશ ખ્યાલોને સમજવા માટે દ્રશ્ય મોડલનો ઉપયોગ કરો',
    step1Point3: 'દશાંશ અને અપૂર્ણાંક વચ્ચે રૂપાંતરણ કરો',
    step1Point4: 'વિવિધ દશાંશ મૂલ્યો સાથે પ્રેક્ટિસ કરો',
    
    // Step 2 Learning Points
    step2Point1: 'ગ્રિડ પેટર્ન દશાંશ સંચાલનને દ્રશ્ય અને સ્પષ્ટ બનાવે છે',
    step2Point2: 'ઓવરલેપિંગ વિસ્તારો ગુણાકાર દર્શાવે છે',
    step2Point3: 'દરેક નાનો ચોરસ 0.01 નું પ્રતિનિધિત્વ કરે છે',
    step2Point4: 'સરળ ગણના માટે દશાંશને અપૂર્ણાંકમાં બદલો',
    step2Point5: 'વિવિધ દશાંશ સંયોજનો સાથે પ્રેક્ટિસ કરો',
    
    // Step 3 Learning Points
    step3Point1: 'ગુણાકાર કરતી વખતે દશાંશ બિંદુ જમણી તરફ ખસે છે',
    step3Point2: 'સ્થાનોની સંખ્યા = શૂન્યની સંખ્યા',
    step3Point3: 'ઉદાહરણ: 0.07 × 1000 = 70',
    step3Point4: 'આ નિયમ કોઈપણ દશાંશ સંખ્યા માટે કામ કરે છે',
    step3Point5: '10 ની વિવિધ ઘાતો સાથે પ્રેક્ટિસ કરો',
    
    // Step 4 Learning Points
    step4Point1: 'ભાગાકાર કરતી વખતે દશાંશ બિંદુ ડાબી તરફ ખસે છે',
    step4Point2: 'સરળ ગણના માટે પૂર્ણ સંખ્યાઓમાં બદલો',
    step4Point3: 'અપૂર્ણાંક પદ્ધતિ અથવા દશાંશ સ્થાનાંતરણનો ઉપયોગ કરો',
    step4Point4: 'વિવિધ દશાંશ ભાજકો સાથે પ્રેક્ટિસ કરો',
    step4Point5: 'વળી ગુણાકાર કરીને તમારા જવાબની તપાસ કરો',
    
    // Practice Mode
    practiceTitle: 'પ્રેક્ટિસ સમસ્યાઓ',
    practiceSubtitle: 'દશાંશ સંચાલનની તમારી સમજણનું પરીક્ષણ કરો',
    dataTitle: 'સમસ્યા',
    questionTitle: 'ઉકેલ કરો',
    hintLabel: 'સંકેત',
    solutionLabel: 'ઉકેલ',
    stepLabel: 'પગલું',
    
    // Practice Questions - Multiplication
    mulQ1Question: 'શોધો: 0.1 × 0.1',
    mulQ1Hint: 'અપૂર્ણાંકમાં બદલો: 0.1 = 1/10, તેથી (1/10) × (1/10) = 1/100',
    mulQ1Solution: '0.1 × 0.1 = (1/10) × (1/10) = 1/100 = 0.01',
    mulQ1Answer: '0.01',
    
    mulQ2Question: 'શોધો: 0.2 × 0.3',
    mulQ2Hint: 'અપૂર્ણાંકમાં બદલો: (2/10) × (3/10) = 6/100',
    mulQ2Solution: '0.2 × 0.3 = (2/10) × (3/10) = 6/100 = 0.06',
    mulQ2Answer: '0.06',
    
    mulQ3Question: 'શોધો: 1.2 × 2.5',
    mulQ3Hint: 'પૂર્ણ સંખ્યાઓ તરીકે ગુણાકાર કરો: 12 × 25 = 300, પછી દશાંશ મૂકો',
    mulQ3Solution: '1.2 × 2.5 = 12 × 25 = 300, 2 દશાંશ સ્થાનો સાથે = 3.00',
    mulQ3Answer: '3.00',
    
    mulQ4Question: 'શોધો: 2.7 × 10',
    mulQ4Hint: '10 વડે ગુણાકાર કરતી વખતે, દશાંશ બિંદુને એક સ્થાન જમણી તરફ ખસેડો',
    mulQ4Solution: '2.7 × 10 = 27.0',
    mulQ4Answer: '27.0',
    
    mulQ5Question: 'શોધો: 1.76 × 100',
    mulQ5Hint: '100 વડે ગુણાકાર કરતી વખતે, દશાંશ બિંદુને બે સ્થાન જમણી તરફ ખસેડો',
    mulQ5Solution: '1.76 × 100 = 176.0',
    mulQ5Answer: '176.0',
    
    mulQ6Question: 'શોધો: 0.05 × 7',
    mulQ6Hint: '5 × 7 = 35 ગુણાકાર કરો, પછી દશાંશ બિંદુ મૂકો',
    mulQ6Solution: '0.05 × 7 = 0.35',
    mulQ6Answer: '0.35',
    
    // Practice Questions - Division
    divQ1Question: 'શોધો: 31.5 ÷ 10',
    divQ1Hint: '10 વડે ભાગાકાર કરતી વખતે, દશાંશ બિંદુને એક સ્થાન ડાબી તરફ ખસેડો',
    divQ1Solution: '31.5 ÷ 10 = 3.15',
    divQ1Answer: '3.15',
    
    divQ2Question: 'શોધો: 6.4 ÷ 2',
    divQ2Hint: 'પૂર્ણ સંખ્યાઓ તરીકે ભાગાકાર કરો: 64 ÷ 2 = 32, પછી દશાંશ મૂકો',
    divQ2Solution: '6.4 ÷ 2 = 64 ÷ 2 = 32, 1 દશાંશ સ્થાન સાથે = 3.2',
    divQ2Answer: '3.2',
    
    divQ3Question: 'શોધો: 25.5 ÷ 0.5',
    divQ3Hint: 'પૂર્ણ સંખ્યાઓમાં બદલો: 255 ÷ 5',
    divQ3Solution: '25.5 ÷ 0.5 = 255 ÷ 5 = 51',
    divQ3Answer: '51',
    
    divQ4Question: 'શોધો: 235.4 ÷ 100',
    divQ4Hint: '100 વડે ભાગાકાર કરતી વખતે, દશાંશ બિંદુને બે સ્થાન ડાબી તરફ ખસેડો',
    divQ4Solution: '235.4 ÷ 100 = 2.354',
    divQ4Answer: '2.354',
    
    divQ5Question: 'શોધો: 19.5 ÷ 5',
    divQ5Hint: '195 ÷ 5 = 39 ભાગાકાર કરો, પછી દશાંશ બિંદુ મૂકો',
    divQ5Solution: '19.5 ÷ 5 = 3.9',
    divQ5Answer: '3.9',
    
    divQ6Question: 'શોધો: 0.4 ÷ 2',
    divQ6Hint: '4 ÷ 2 = 2 ભાગાકાર કરો, પછી દશાંશ બિંદુ મૂકો',
    divQ6Solution: '0.4 ÷ 2 = 0.2',
    divQ6Answer: '0.2',
    
    // Real World Examples
    realWorldTitle: 'વાસ્તવિક દુનિયાના ઉપયોગો',
    realWorldSubtitle: 'રોજિંદા જીવનમાં દશાંશ સંચાલનનો ઉપયોગ કેવી રીતે થાય છે તે જુઓ',
    
    ex1Title: 'ખરીદી',
    ex1Context: '₹12.50 પ્રતિ કિલો દરે 2.5 કિલો સફરજન ખરીદો. કુલ ખર્ચ શું છે?',
    ex1Question: 'કુલ ખર્ચની ગણના કરો',
    ex1Answer: 'કુલ = 2.5 × 12.50 = ₹31.25',
    ex1Calculation: '2.5 × 12.50 = 31.25',
    
    ex2Title: 'રૂમનું ક્ષેત્રફળ',
    ex2Context: 'રૂમ 4.2 મીટર લાંબો અને 3.5 મીટર પહોળો છે. તેનું ક્ષેત્રફળ શોધો.',
    ex2Question: 'ક્ષેત્રફળની ગણના કરો',
    ex2Answer: 'ક્ષેત્રફળ = 4.2 × 3.5 = 14.7 મી²',
    ex2Calculation: '4.2 × 3.5 = 14.7',
    
    ex3Title: 'ઇંધણ કાર્યક્ષમતા',
    ex3Context: 'બાઇક 1.8 લિટર ઇંધણથી 36 કિમી ચાલે છે. 1 લિટરથી કેટલી દૂર?',
    ex3Question: 'પ્રતિ લિટર અંતર શોધો',
    ex3Answer: 'અંતર = 36 ÷ 1.8 = 20 કિમી',
    ex3Calculation: '36 ÷ 1.8 = 20',
    
    ex4Title: 'વાડના થાંભલા',
    ex4Context: 'દરેક વાડનો થાંભલો 1.5 મીટર દૂર છે. કુલ વાડ 12 મીટર છે. કેટલા થાંભલા?',
    ex4Question: 'વાડના થાંભલા ગણો',
    ex4Answer: 'થાંભલા = 12 ÷ 1.5 = 8 થાંભલા',
    ex4Calculation: '12 ÷ 1.5 = 8',
    
    ex5Title: 'દોડવાની ઝડપ',
    ex5Context: 'દોડવીર 1.3 કલાકમાં 15.6 કિમી દોડે છે. ઝડપ શું છે?',
    ex5Question: 'દોડવાની ઝડપ શોધો',
    ex5Answer: 'ઝડપ = 15.6 ÷ 1.3 = 12 કિમી/કલાક',
    ex5Calculation: '15.6 ÷ 1.3 = 12',
    
    ex6Title: 'રિબનના ટુકડા',
    ex6Context: '7.2 મીટર રિબનને 0.8 મીટરના ટુકડાઓમાં કાપો. કેટલા ટુકડા?',
    ex6Question: 'રિબનના ટુકડા ગણો',
    ex6Answer: 'ટુકડા = 7.2 ÷ 0.8 = 9 ટુકડા',
    ex6Calculation: '7.2 ÷ 0.8 = 9',
    
    // Why Decimal Operations Matter
    whyMatterTitle: 'દશાંશ સંચાલન કેમ મહત્વપૂર્ણ છે?',
    whyMatterPoint1: 'પૈસાની ગણના: ચલણ અને નાણાકીય વ્યવહારો માટે જરૂરી.',
    whyMatterPoint2: 'માપન: વૈજ્ઞાનિક અને ઇજનેરી ગણનાઓ માટે મહત્વપૂર્ણ.',
    whyMatterPoint3: 'ડેટા વિશ્લેષણ: આંકડાશાસ્ત્ર અને ડેટા અર્થઘટન માટે મહત્વપૂર્ણ.',
    whyMatterPoint4: 'દૈનિક જીવન: ખરીદી, રસોઈ અને સમયની ગણનામાં ઉપયોગ થાય છે.',
    
    // Pro Tip
    proTipTitle: 'વિશેષજ્ઞ સૂચના!',
    proTipText: 'દશાંશ ગુણાકાર કરતી વખતે, બંને સંખ્યાઓમાં દશાંશ સ્થાનોની કુલ સંખ્યા ગણો. જવાબમાં સમાન સંખ્યામાં દશાંશ સ્થાનો હશે! 📊✨',
    
    // Grid Visualizations
    gridTitle: 'દ્રશ્ય ગ્રિડ પ્રતિનિધિત્વ',
    gridExplanation: 'આ 10×10 ગ્રિડ 1 સંપૂર્ણનું પ્રતિનિધિત્વ કરે છે. દરેક નાનો ચોરસ = 0.01',
    shadedPart: 'છાયાંકિત ભાગ',
    represents: 'પ્રતિનિધિત્વ કરે છે',
    whole: 'સંપૂર્ણ',
    tenth: 'દશમ',
    hundredth: 'શતમ',
    
    // Decimal Point Movement
    decimalMoveTitle: 'દશાંશ બિંદુનું સ્થાનાંતરણ',
    moveRight: 'જમણી તરફ ખસે છે',
    moveLeft: 'ડાબી તરફ ખસે છે',
    places: 'સ્થાનો',
    zero: 'શૂન્ય',
    zeros: 'શૂન્યો',
    
    // Practice Complete
    practiceComplete: 'પ્રેક્ટિસ પૂર્ણ!',
    practiceCompleteSubtitle: 'તમે બધા દશાંશ સંચાલન પ્રેક્ટિસ પૂરા કર્યા છે!',
    yourScore: 'તમારો સ્કોર',
    accuracy: 'ચોકસાઈ',
    performance: 'પ્રદર્શન',
    totalAttempts: 'કુલ પ્રયાસો',
    exerciseBreakdown: 'પ્રેક્ટિસ વિગતો',
    questionLabel: 'પ્રશ્ન',
    attemptLabel: 'પ્રયાસો',
    practiceAgain: '🔄 ફરીથી પ્રેક્ટિસ કરો',
    
    // Input and UI
    placeholderAnswer: 'તમારો જવાબ અહીં લખો... ✍️',
    answerLabel: 'જવાબ',
    viewAssessment: 'મૂલ્યાંકન જુઓ',
    
    // Progress labels
    questionProgress: 'પ્રશ્ન',
    of: 'નો',
    
    // Button labels
    clickToExpand: 'વિસ્તૃત કરવા માટે ક્લિક કરો',
    clickToCollapse: 'સંકુચિત કરવા માટે ક્લિક કરો',
    
    // Mathematical symbols and terms
    multiply: 'ગુણાકાર',
    divide: 'ભાગાકાર',
    equals: 'બરાબર',
    decimalPoint: 'દશાંશ બિંદુ',
    fraction: 'અપૂર્ણાંક',
    wholeNumber: 'પૂર્ણ સંખ્યા',
    area: 'ક્ષેત્રફળ',
    perimeter: 'પરિમિતિ',
    distance: 'અંતર',
    speed: 'ઝડપ',
    time: 'સમય',
    cost: 'ખર્ચ',
    price: 'કિંમત',
    quantity: 'પ્રમાણ',
    
    // Units
    rupees: '₹',
    centimeters: 'સેમી',
    kilometers: 'કિમી',
    hours: 'કલાકો',
    litres: 'લિટર',
    kg: 'કિલો',
    sides: 'બાજુઓ',
    strips: 'પટ્ટીઓ',
    
    // Practice types
    basicDecimalOperation: 'મૂળભૂત દશાંશ સંચાલન',
    multiplyDivideByPowers: '10, 100, અથવા 1000 વડે ગુણાકાર/ભાગાકાર',
    decimalByDecimal: 'દશાંશ દ્વારા દશાંશ સંચાલન',
    decimalByWhole: 'દશાંશ દ્વારા પૂર્ણ સંખ્યા',
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