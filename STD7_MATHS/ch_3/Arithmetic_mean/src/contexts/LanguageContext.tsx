import { createContext, useContext, useMemo, useState, ReactNode, useEffect } from 'react';

export type SupportedLanguage = 'en' | 'hi' | 'gu';

type LanguageContextValue = {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
  formatNumber: (n: number) => string;
  localizeDigitsInText: (text: string) => string;
  normalizeDigitsInText: (text: string) => string;
  isTransitioning: boolean;
};

const translations: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Navigation
    learn: 'Learn',
    practice: 'Practice',
    realWorld: 'Real World',
    demo: 'Demonstration',
    ArithmeticMeanTool: 'Arithmetic Mean Tool',
    
    // Common
    next: 'Next',
    previous: 'Previous',
    play: 'Play',
    pause: 'Pause',
    Step: 'Step',
    submit: 'Submit',
    correct: 'Correct!',
    incorrect: 'Incorrect',
    tryAgain: 'Try Again',
    showHint: 'Show Hint',
    hideHint: 'Hide Hint',
    showSolution: 'Show Solution',
    hideSolution: 'Hide Solution',
    yourAnswer: 'Your Answer',
    placeholderAnswer: 'Enter your answer here...',
    
    // Step navigation
    step: 'Step',
    of: 'of',
    Steps: 'Steps',
    
    // Learn section
    understandingArithmeticMean: 'Understanding Arithmetic Mean',
    arithmeticMeanDescription: 'The arithmetic mean is the average of a set of numbers. It\'s calculated by adding all numbers and dividing by the count.',
    step1Title: 'Arithmetic Mean',
    step1Concept: 'The arithmetic mean is the average of a set of numbers.',
    meanCalculationStepByStep: 'Mean Calculation Step by Step',
    stepByStepDescription: 'Learn how to calculate the arithmetic mean step by step with examples.',
    findingTheRange: 'Finding the Range',
    rangeDescription: 'The range is the difference between the highest and lowest values in a dataset.',
    comparingHeights: 'Comparing Heights',
    heightsDescription: 'When we have height data, we can find the mean height and see how individual heights compare to the average.',
    
    // Key points
    centralTendencyPoint: 'Mean shows the center of data.',
    dataAnalysisPoint: 'Compare groups and guide decisions.',
    realWorldApplicationsPoint: 'Used in stats, business, science, daily life.',
    universalConceptPoint: 'Core idea for advanced math and data science.',
    
    // Formulas
    formulaMeanSummation: 'Arithmetic Mean = ∑₁ⁿ xᵢ / n',
    formulaMeanExplicit: 'Arithmetic Mean = (x₁ + x₂ + ... + xₙ) / n',
    meanFormula: 'Mean Formula',
    rangeLabel: 'Range',
    sumOfAllDataPoints: 'Sum of all data points',
    numberOfDataPoints: 'Number of data points',
    nIsNumObservations: 'where n is the number of observations',
    rangeDefinition: 'Difference between highest and lowest numbers',
    howToFindRange: 'How to find Range:',
    rangeStep1Order: '1. Put the numbers from smallest to largest.',
    rangeStep2Subtract: '2. Subtract the lowest value from the largest.',
    
    // Real World header
    realWorldExamples: 'Real World Examples',
    realWorldDescription: 'Discover how arithmetic mean works in everyday situations',
    
    // Real World cards - titles
    temperature: 'temperature',
    bankBalance: 'bankBalance',
    elevation: 'elevation',
    sportsScore: 'sportsScore',
    debtPayment: 'debtPayment',
    stockMarket: 'stockMarket',
    
    // Real World cards - contexts/questions
    morningTemperatureContext: 'Morning temperatures recorded over three days: 3°C, 6°C, and 6°C. What is the mean?',
    bankBalanceContext: 'Bank balance changes: +₹200, -₹50, +₹150. What is the mean change?',
    elevationContext: 'Hike elevation changes: +5m, -12m, 0m, +0m. What is the mean position?',
    sportsScoreContext: 'Team scored points across matches: 1, 3, 2. What is the mean score?',
    debtPaymentContext: 'Payments towards a loan: ₹-100, ₹-50, ₹-50. What is the mean payment?',
    stockMarketContext: 'Stock price at close: ₹900, ₹980, ₹970. What is the mean price?',
    
    // Real World labels
    finalAmount: 'Final Amount',
    finalScore: 'Final Score',
    finalPosition: 'Final Position',
    finalTemperature: 'Final Temperature',
    clickToExpand: 'clickToExpand',
    clickToCollapse: 'clickToCollapse',
    questionLabel: 'Question',
    
    // Practice mode
    practiceMode: 'Practice Mode',
    practiceSubtitle: 'Master arithmetic mean through interactive exercises',
    questionProgress: 'Question',
    dataTitle: 'Data',
    questionTitle: 'Question',
    value: 'Value',
    data: 'Data',
    meanCalculation: 'Mean Calculation',
    sumOfValues: 'Sum of Values',
    numberOfValues: 'Number of Values',
    mean: 'Mean',
    answerLabel: 'Answer',
    performance: 'Performance',
    
    // Assessment
    arithmeticMeanMasteryComplete: 'Arithmetic Mean Mastery Complete!',
    completedAllPracticeExercises: 'You have completed all practice exercises',
    yourScore: 'Your Score',
    accuracy: 'Accuracy',
    totalAttempts: 'Total Attempts',
    exerciseBreakdown: 'Exercise Breakdown',
    attemptLabel: 'attempts',
    practiceAgain: 'Practice Again',
    viewAssessment: 'View Assessment',
    
    // Contextual labels
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
    firstInnings: '1st Inning',
    secondInnings: '2nd Inning',
    thirdInnings: '3rd Inning',
    fourthInnings: '4th Inning',
    fifthInnings: '5th Inning',
    sixthInnings: '6th Inning',
    studentA: 'Elle',
    studentB: 'Mark',
    studentC: 'James',
    studentD: 'Sarah',
    studentE: 'David',
    studentF: 'Emma',
    studentG: 'Michael',
    studentH: 'Lisa',
    studentI: 'John',
    studentJ: 'Anna',
    student1: 'Aarav',
    student2: 'Bella',
    student3: 'Carlos',
    student4: 'Diya',
    student5: 'Ethan',
    student6: 'Fatima',
    student7: 'George',
    student8: 'Hana',
    student9: 'Ivan',
    student10: 'Julia',
    // Teacher names for age demo
    teacher1: 'Mr. Sharma',
    teacher2: 'Ms. Patel',
    teacher3: 'Mr. Khan',
    teacher4: 'Ms. Thomas',
    teacher5: 'Mr. Mehta',
    teacher6: 'Ms. Roy',
    teacher7: 'Mr. Verma',
    teacher8: 'Ms. Desai',
    teacher9: 'Mr. Iyer',
    teacher10: 'Ms. Joshi',
    // Girls list for height demo
    girl1: 'Ava',
    girl2: 'Bella',
    girl3: 'Chloe',
    girl4: 'Diya',
    girl5: 'Emma',
    girl6: 'Hana',
    girl7: 'Isha',
    girl8: 'Julia',
    girl9: 'Kiara',
    girl10: 'Luna',
    
    // Units
    hours: 'hours',
    runs: 'runs',
    Runs: 'Runs',
    years: 'years',
    innings: 'innings',
    Innings: 'Innings',
    mm: 'mm',
    cm: 'cm',
    marks: 'marks',
    girlsHeights: 'Girls\' heights',
    'Girls Heights': "Girls' heights",
    // Demo titles used in UI
    'Batsman Runs': "Batsman's Runs",
    'Teachers Ages': 'Teachers\' ages',
    // Step-by-step labels used in Demo
    'Add All Numbers': 'Add all numbers',
    'Count The Innings': 'Count the innings',
    'Divide Sum By Count': 'Divide sum by count',
    'Basic Mean': 'Basic Mean',
    'Comparison': 'Comparison',
    'Below Mean': 'Below Mean',
    aboveMean: 'Above Mean',
    
    // Exercise content
    studyHoursAnalysis: 'Study Hours Analysis',
    studyHoursDescription: 'Ashish studies for different hours on three consecutive days. Calculate the mean study time.',
    meanStudyTimeQuestion: 'What is the mean study time per day?',
    ashishStudyHours: 'Ashish\'s study hours',
    
    batsmanPerformance: "Batsman's Performance",
    batsmanPerformanceDescription: "A batsman scored runs in six innings. Find the mean runs per inning.",
    batsmanRunsContext: "Runs scored in six innings",
    meanRunsQuestion: "Calculate the mean runs scored per inning.",
    
    weeklyRainfallAnalysis: "Weekly Rainfall Analysis",
    weeklyRainfallDescription: "Analyze the rainfall data for a week and answer the questions.",
    dailyRainfallContext: "Daily rainfall for a week",
    meanRainfallQuestion: "Find the mean rainfall for the week.",
    
    studentHeights: "Student Heights",
    studentHeightsDescription: "A class has students with different heights. Calculate the mean height.",
    studentsHeightsContext: "Students' heights in centimeters",
    meanHeightQuestion: "What is the mean height of the students?",
    
    temperatureRecords: "Temperature Records",
    temperatureRecordsDescription: "Daily temperature readings for a week. Find the mean temperature.",
    dailyTemperatureContext: "Daily temperature in Celsius",
    meanTemperatureQuestion: "Calculate the mean temperature for the week.",
    
    testScores: "Test Scores",
    testScoresDescription: "Students' test scores in mathematics. Analyze the performance.",
    mathematicsTestContext: "Mathematics test scores out of 100",
    meanTestScoreQuestion: "What is the mean test score?",
    
    // Hints
    hint1MeanFormula: 'Remember: Mean = Sum of all values ÷ Number of values',
    hint1AddNumbers: 'First add 4 + 5 + 3, then divide by 3',
    hint2AddRuns: 'Start by adding all the runs: 36 + 35 + 50 + 46 + 60 + 55',
    hint2DivideInnings: 'Then divide the total by 6 (number of innings)',
    hint3AddRainfall: 'Add all the rainfall values first',
    hint3DivideSeven: 'Divide by 7 to get the mean',
    hint4AddHeights: 'Add all the height values first',
    hint4DivideStudents: 'Then divide by 10 (number of students)',
    hint5AddTemperatures: 'Add all temperature values: 22 + 25 + 28 + 24 + 26 + 23 + 27',
    hint5DivideSevenTemp: 'Divide by 7 to get the mean',
    hint6AddTestScores: 'Add all the test scores first',
    hint6DivideTen: 'Divide by 10 to get the mean',
    
    // Real World
    whyArithmeticMeanMatters: 'Why Arithmetic Mean Matters?',
    proTip: 'Pro Tip!',
    proTipText: 'When calculating arithmetic mean, always remember: Sum of all values ÷ Number of values. This formula works for any dataset and helps you find the average quickly!',
    
    // Header title
    arithmeticMean: 'Arithmetic Mean',
  },
  hi: {
    // Navigation
    learn: 'सीखें',
    practice: 'अभ्यास',
    realWorld: 'वास्तविक जीवन',
    demo: 'प्रदर्शन',
    ArithmeticMeanTool: 'अंकगणितीय माध्य टूल',
    
    // Common
    next: 'अगला',
    previous: 'पिछला',
    play: 'चलाएँ',
    pause: 'रोकें',
    Step: 'चरण',
    submit: 'जमा करें',
    correct: 'सही!',
    incorrect: 'गलत',
    tryAgain: 'फिर प्रयास करें',
    showHint: 'संकेत दिखाएं',
    hideHint: 'संकेत छुपाएं',
    showSolution: 'समाधान दिखाएं',
    hideSolution: 'समाधान छुपाएं',
    yourAnswer: 'आपका उत्तर',
    placeholderAnswer: 'यहाँ अपना उत्तर दर्ज करें...',
    
    // Step navigation
    step: 'चरण',
    of: 'का',
    Steps: 'चरण',
    
    // Learn section
    understandingArithmeticMean: 'अंकगणितीय माध्य को समझना',
    arithmeticMeanDescription: 'अंकगणितीय माध्य संख्याओं के समूह का औसत है। इसे सभी संख्याओं को जोड़कर और गिनती से भाग देकर गणना की जाती है।',
    step1Title: 'अंकगणितीय माध्य',
    step1Concept: 'अंकगणितीय माध्य संख्याओं के समूह का औसत है।',
    meanCalculationStepByStep: 'चरणबद्ध माध्य गणना',
    stepByStepDescription: 'उदाहरणों के साथ अंकगणितीय माध्य की गणना चरणबद्ध तरीके से सीखें।',
    findingTheRange: 'रेंज ज्ञात करना',
    rangeDescription: 'रेंज डेटासेट में उच्चतम और निम्नतम मूल्यों के बीच का अंतर है।',
    comparingHeights: 'ऊंचाई की तुलना',
    heightsDescription: 'जब हमारे पास ऊंचाई का डेटा हो, तो हम औसत ऊंचाई ज्ञात कर सकते हैं और देख सकते हैं कि व्यक्तिगत ऊंचाई औसत से कैसे तुलना करती है।',
    
    // Key points
    centralTendencyPoint: 'माध्य डेटा का केंद्र दिखाता है।',
    dataAnalysisPoint: 'समूहों की तुलना करें और निर्णय लें।',
    realWorldApplicationsPoint: 'आंकड़े, व्यापार, विज्ञान और दैनिक उपयोग।',
    universalConceptPoint: 'उन्नत गणित व डेटा विज्ञान की मूल बात।',
    
    // Formulas
    formulaMeanSummation: 'अंकगणितीय माध्य = ∑₁ⁿ xᵢ / n',
    formulaMeanExplicit: 'अंकगणितीय माध्य = (x₁ + x₂ + ... + xₙ) / n',
    meanFormula: 'माध्य सूत्र',
    rangeLabel: 'परास',
    sumOfAllDataPoints: 'सभी डाटा बिंदुओं का योग',
    numberOfDataPoints: 'डाटा बिंदुओं की संख्या',
    nIsNumObservations: 'जहाँ n प्रेक्षणों की संख्या है',
    rangeDefinition: 'सबसे बड़े और सबसे छोटे संख्याओं के बीच का अंतर',
    howToFindRange: 'परास कैसे ज्ञात करें:',
    rangeStep1Order: '1. संख्याओं को छोटे से बड़े क्रम में रखें।',
    rangeStep2Subtract: '2. सबसे बड़े में से सबसे छोटे को घटाएं।',
    
    // Real World header
    realWorldExamples: 'वास्तविक जीवन के उदाहरण',
    realWorldDescription: 'देखें कि दैनिक जीवन में अंकगणितीय माध्य कैसे काम करता है',
    
    // Real World cards - titles
    temperature: 'तापमान',
    bankBalance: 'बैंक शेष',
    elevation: 'ऊँचाई',
    sportsScore: 'खेल स्कोर',
    debtPayment: 'कर्ज भुगतान',
    stockMarket: 'शेयर बाजार',
    
    // Real World cards - contexts/questions
    morningTemperatureContext: 'तीन दिनों के सुबह के तापमान: 3°C, 6°C, 6°C। माध्य क्या है?',
    bankBalanceContext: 'बैंक बैलेंस में बदलाव: +₹200, -₹50, +₹150। औसत बदलाव क्या है?',
    elevationContext: 'पैदल यात्रा में ऊँचाई परिवर्तन: +5m, -12m, 0m, +0m। औसत स्थिति क्या है?',
    sportsScoreContext: 'टीम ने मैचों में अंक बनाए: 1, 3, 2। औसत स्कोर क्या है?',
    debtPaymentContext: 'ऋण के लिए भुगतान: ₹-100, ₹-50, ₹-50। औसत भुगतान क्या है?',
    stockMarketContext: 'बाजार बंद होने पर कीमतें: ₹900, ₹980, ₹970। औसत कीमत क्या है?',
    
    // Real World labels
    finalAmount: 'अंतिम राशि',
    finalScore: 'अंतिम स्कोर',
    finalPosition: 'अंतिम स्थान',
    finalTemperature: 'अंतिम तापमान',
    clickToExpand: 'विस्तार हेतु क्लिक करें',
    clickToCollapse: 'संकुचित करने हेतु क्लिक करें',
    questionLabel: 'प्रश्न',
    
    // Practice mode
    practiceMode: 'अभ्यास मोड',
    practiceSubtitle: 'इंटरैक्टिव अभ्यास के माध्यम से अंकगणितीय माध्य में महारत हासिल करें',
    questionProgress: 'प्रश्न',
    dataTitle: 'डेटा',
    questionTitle: 'प्रश्न',
    value: 'मान',
    data: 'डेटा',
    meanCalculation: 'माध्य गणना',
    sumOfValues: 'मानों का योग',
    numberOfValues: 'मानों की संख्या',
    mean: 'माध्य',
    answerLabel: 'उत्तर',
    performance: 'प्रदर्शन',
    
    // Assessment
    arithmeticMeanMasteryComplete: 'अंकगणितीय माध्य में महारत पूर्ण!',
    completedAllPracticeExercises: 'आपने सभी अभ्यास अभ्यास पूरे कर लिए हैं',
    yourScore: 'आपका स्कोर',
    accuracy: 'सटीकता',
    totalAttempts: 'कुल प्रयास',
    exerciseBreakdown: 'अभ्यास विवरण',
    attemptLabel: 'प्रयास',
    practiceAgain: 'फिर से अभ्यास करें',
    viewAssessment: 'मूल्यांकन देखें',
    
    // Contextual labels
    monday: 'सोमवार',
    tuesday: 'मंगलवार',
    wednesday: 'बुधवार',
    thursday: 'गुरुवार',
    friday: 'शुक्रवार',
    saturday: 'शनिवार',
    sunday: 'रविवार',
    firstInnings: 'पहली पारी',
    secondInnings: 'दूसरी पारी',
    thirdInnings: 'तीसरी पारी',
    fourthInnings: 'चौथी पारी',
    fifthInnings: 'पांचवीं पारी',
    sixthInnings: 'छठी पारी',
    studentA: 'एले',
    studentB: 'मार्क',
    studentC: 'जेम्स',
    studentD: 'सारा',
    studentE: 'डेविड',
    studentF: 'एम्मा',
    studentG: 'माइकल',
    studentH: 'लिसा',
    studentI: 'जॉन',
    studentJ: 'एना',
    student1: 'आरव',
    student2: 'बेला',
    student3: 'कार्लोस',
    student4: 'दिया',
    student5: 'ईथन',
    student6: 'फ़ातिमा',
    student7: 'जॉर्ज',
    student8: 'हाना',
    student9: 'इवान',
    student10: 'जूलिया',
    // Teacher names for age demo
    teacher1: 'शर्मा सर',
    teacher2: 'पटेल मैडम',
    teacher3: 'खान सर',
    teacher4: 'थॉमस मैडम',
    teacher5: 'मेहता सर',
    teacher6: 'रॉय मैडम',
    teacher7: 'वर्मा सर',
    teacher8: 'देसाई मैडम',
    teacher9: 'अय्यर सर',
    teacher10: 'जोशी मैडम',
    // Girls list for height demo
    girl1: 'आन्या',
    girl2: 'बेला',
    girl3: 'खुशी',
    girl4: 'दिया',
    girl5: 'एम्मा',
    girl6: 'हाना',
    girl7: 'ईशा',
    girl8: 'जूलिया',
    girl9: 'कियारा',
    girl10: 'लूना',
    
    // Units
    hours: 'घंटे',
    runs: 'रन',
    Runs: 'रन',
    years: 'वर्ष',
    innings: 'पारियां',
    Innings: 'पारी',
    mm: 'मिमी',
    cm: 'सेमी',
    marks: 'अंक',
    girlsHeights: 'लड़कियों की ऊंचाई',
    'Girls Heights': 'लड़कियों की ऊंचाई',
    // Demo titles used in UI
    'Batsman Runs': 'बल्लेबाज के रन',
    'Teachers Ages': 'शिक्षकों की आयु',
    
    // Exercise content
    // Step-by-step labels used in Demo
    'Add All Numbers': 'सभी संख्याओं को जोड़ें',
    'Count The Innings': 'पारियों की गिनती करें',
    'Divide Sum By Count': 'योग को गिनती से भाग दें',
    'Basic Mean': 'मूल माध्य',
    'Comparison': 'तुलना',
    'Below Mean': 'माध्य से कम',
    aboveMean: 'माध्य से अधिक',
    studyHoursAnalysis: 'अध्ययन घंटे विश्लेषण',
    studyHoursDescription: 'आशीष तीन लगातार दिनों में अलग-अलग घंटे पढ़ता है। औसत अध्ययन समय की गणना करें।',
    meanStudyTimeQuestion: 'प्रति दिन औसत अध्ययन समय क्या है?',
    ashishStudyHours: 'आशीष के अध्ययन के घंटे',
    
    batsmanPerformance: "बल्लेबाज का प्रदर्शन",
    batsmanPerformanceDescription: "एक बल्लेबाज ने छह पारियों में रन बनाए। प्रति पारी औसत रन ज्ञात करें।",
    batsmanRunsContext: "छह पारियों में बनाए गए रन",
    meanRunsQuestion: "प्रति पारी औसत रन की गणना करें।",
    
    weeklyRainfallAnalysis: "साप्ताहिक वर्षा विश्लेषण",
    weeklyRainfallDescription: "एक सप्ताह के वर्षा डेटा का विश्लेषण करें और प्रश्नों के उत्तर दें।",
    dailyRainfallContext: "एक सप्ताह की दैनिक वर्षा",
    meanRainfallQuestion: "सप्ताह की औसत वर्षा ज्ञात करें।",
    
    studentHeights: "छात्रों की ऊंचाई",
    studentHeightsDescription: "एक कक्षा में छात्रों की अलग-अलग ऊंचाई है। औसत ऊंचाई की गणना करें।",
    studentsHeightsContext: "सेंटीमीटर में छात्रों की ऊंचाई",
    meanHeightQuestion: "छात्रों की औसत ऊंचाई क्या है?",
    
    temperatureRecords: "तापमान रिकॉर्ड",
    temperatureRecordsDescription: "एक सप्ताह के दैनिक तापमान रीडिंग। औसत तापमान ज्ञात करें।",
    dailyTemperatureContext: "सेल्सियस में दैनिक तापमान",
    meanTemperatureQuestion: "सप्ताह का औसत तापमान गणना करें।",
    
    testScores: "टेस्ट स्कोर",
    testScoresDescription: "गणित में छात्रों के टेस्ट स्कोर। प्रदर्शन का विश्लेषण करें।",
    mathematicsTestContext: "100 में से गणित टेस्ट स्कोर",
    meanTestScoreQuestion: "औसत टेस्ट स्कोर क्या है?",
    
    // Hints
    hint1MeanFormula: 'याद रखें: माध्य = सभी मूल्यों का योग ÷ मूल्यों की संख्या',
    hint1AddNumbers: 'पहले 4 + 5 + 3 जोड़ें, फिर 3 से भाग दें',
    hint2AddRuns: 'सभी रन जोड़कर शुरू करें: 36 + 35 + 50 + 46 + 60 + 55',
    hint2DivideInnings: 'फिर कुल को 6 (पारियों की संख्या) से भाग दें',
    hint3AddRainfall: 'पहले सभी वर्षा मूल्य जोड़ें',
    hint3DivideSeven: 'माध्य प्राप्त करने के लिए 7 से भाग दें',
    hint4AddHeights: 'पहले सभी ऊंचाई मूल्य जोड़ें',
    hint4DivideStudents: 'फिर 10 (छात्रों की संख्या) से भाग दें',
    hint5AddTemperatures: 'सभी तापमान मूल्य जोड़ें: 22 + 25 + 28 + 24 + 26 + 23 + 27',
    hint5DivideSevenTemp: 'माध्य प्राप्त करने के लिए 7 से भाग दें',
    hint6AddTestScores: 'पहले सभी टेस्ट स्कोर जोड़ें',
    hint6DivideTen: 'माध्य प्राप्त करने के लिए 10 से भाग दें',
    
    // Real World
    whyArithmeticMeanMatters: 'अंकगणितीय माध्य क्यों महत्वपूर्ण है?',
    proTip: 'पेशेवर सुझाव!',
    proTipText: 'अंकगणितीय माध्य की गणना करते समय हमेशा याद रखें: सभी मूल्यों का योग ÷ मूल्यों की संख्या। यह सूत्र किसी भी डेटासेट के लिए काम करता है और आपको औसत जल्दी खोजने में मदद करता है!',
    
    // Header title
    arithmeticMean: 'अंकगणितीय माध्य',
  },
  gu: {
    // Navigation
    learn: 'શીખો',
    practice: 'અભ્યાસ',
    realWorld: 'વાસ્તવિક દુનિયા',
    demo: 'પ્રદર્શન',
    ArithmeticMeanTool: 'અંકગણિત મધ્ય સાધન',
    
    // Common
    next: 'આગળ',
    previous: 'પાછળ',
    play: 'ચાલુ',
    pause: 'વિરામ',
    Step: 'પગલું',
    submit: 'જમા કરો',
    correct: 'સાચું!',
    incorrect: 'ખોટું',
    tryAgain: 'ફરીથી પ્રયાસ કરો',
    showHint: 'સંકેત બતાવો',
    hideHint: 'સંકેત છુપાવો',
    showSolution: 'ઉકેલ બતાવો',
    hideSolution: 'ઉકેલ છુપાવો',
    yourAnswer: 'તમારો જવાબ',
    placeholderAnswer: 'અહીં તમારો જવાબ દાખલ કરો...',
    
    // Step navigation
    step: 'પગલું',
    of: 'ના',
    Steps: 'પગલાં',
    
    // Learn section
    understandingArithmeticMean: 'અંકગણિતીય સરેરાશને સમજવું',
    arithmeticMeanDescription: 'અંકગણિતીય સરેરાશ એ સંખ્યાઓના સમૂહનો સરેરાશ છે. તે બધી સંખ્યાઓ ઉમેરીને અને ગણતરી વડે ભાગીને ગણવામાં આવે છે.',
    step1Title: 'અંકગણિત મધ્ય',
    step1Concept: 'અંકગણિત મધ્ય સંખ્યાઓના સમૂહનો સરેરાશ છે.',
    meanCalculationStepByStep: 'પગલાંબદ્ધ મધ્ય ગણતરી',
    stepByStepDescription: 'ઉદાહરણો સાથે અંકગણિતીય સરેરાશની ગણતરી પગલાંબદ્ધ રીતે શીખો.',
    findingTheRange: 'રેન્જ શોધવી',
    rangeDescription: 'રેન્જ ડેટાસેટમાં સર્વોચ્ચ અને સર્વનિમ્ન મૂલ્યો વચ્ચેનો તફાવત છે.',
    comparingHeights: 'ઊંચાઈની તુલના',
    heightsDescription: 'જ્યારે આપણી પાસે ઊંચાઈનો ડેટા હોય, તો આપણે સરેરાશ ઊંચાઈ શોધી શકીએ છીએ અને જોઈ શકીએ છીએ કે વ્યક્તિગત ઊંચાઈ સરેરાશ સાથે કેવી રીતે તુલના કરે છે.',
    
    // Key points
    centralTendencyPoint: 'મધ્ય ડેટાનો કેન્દ્ર બતાવે છે.',
    dataAnalysisPoint: 'જૂથોની તુલના કરો, નિર્ણયમાં મદદ.',
    realWorldApplicationsPoint: 'આંકડા, વ્યવસાય, વિજ્ઞાન અને દૈનિક ઉપયોગ.',
    universalConceptPoint: 'ઉચ્ચ ગણિત અને ડેટા વિજ્ઞાનની મૂળ વાત.',
    
    // Formulas
    formulaMeanSummation: 'અંકગણિત મધ્ય = ∑₁ⁿ xᵢ / n',
    formulaMeanExplicit: 'અંકગણિત મધ્ય = (x₁ + x₂ + ... + xₙ) / n',
    meanFormula: 'મધ્ય સૂત્ર',
    rangeLabel: 'રેન્જ',
    sumOfAllDataPoints: 'બધા ડેટા પોઈન્ટ્સનો સરવાળો',
    numberOfDataPoints: 'ડેટા પોઈન્ટ્સની સંખ્યા',
    nIsNumObservations: 'જ્યાં n અવલોકનોની સંખ્યા છે',
    rangeDefinition: 'સર્વોચ્ચ અને સર્વનિમ્ન સંખ્યાઓ વચ્ચેનો તફાવત',
    howToFindRange: 'રેન્જ કેવી રીતે શોધવી:',
    rangeStep1Order: '1. સંખ્યાઓને નાના થી મોટા ક્રમે ગોઠવો.',
    rangeStep2Subtract: '2. સૌથી નાનામાંથી સૌથી મોટું બાદ કરો.',
    
    // Real World header
    realWorldExamples: 'વાસ્તવિક જીવનના ઉદાહરણ',
    realWorldDescription: 'દૈનિક જીવનમાં અંકગણિત મધ્ય કેવી રીતે કામ કરે છે તે જાણો',
    
    // Real World cards - titles
    temperature: 'તાપમાન',
    bankBalance: 'બેંક બેલેન્સ',
    elevation: 'ઊંચાઈ',
    sportsScore: 'રમતનું સ્કોર',
    debtPayment: 'કરજ ચુકવણી',
    stockMarket: 'શેર બજાર',
    
    // Real World cards - contexts/questions
    morningTemperatureContext: 'ત્રણ દિવસના સવારના તાપમાન: 3°C, 6°C, 6°C. સરેરાશ શું છે?',
    bankBalanceContext: 'બેંક બેલેન્સમાં ફેરફાર: +₹200, -₹50, +₹150. સરેરાશ ફેરફાર શું છે?',
    elevationContext: 'હાઇકમાં ઊંચાઈ બદલાવ: +5m, -12m, 0m, +0m. સરેરાશ સ્થિતિ શું છે?',
    sportsScoreContext: 'ટીમે મેચોમાં પોઈન્ટ બનાવ્યા: 1, 3, 2. સરેરાશ સ્કોર શું છે?',
    debtPaymentContext: 'કરજ માટે ચુકવણીઓ: ₹-100, ₹-50, ₹-50. સરેરાશ ચુકવણી શું છે?',
    stockMarketContext: 'બંધ ભાવ: ₹900, ₹980, ₹970. સરેરાશ ભાવ શું છે?',
    
    // Real World labels
    finalAmount: 'અંતિમ રકમ',
    finalScore: 'અંતિમ સ્કોર',
    finalPosition: 'અંતિમ સ્થિતિ',
    finalTemperature: 'અંતિમ તાપમાન',
    clickToExpand: 'વિસ્તાર માટે ક્લિક કરો',
    clickToCollapse: 'સંકુચિત કરવા ક્લિક કરો',
    questionLabel: 'પ્રશ્ન',
    
    // Practice mode
    practiceMode: 'અભ્યાસ મોડ',
    practiceSubtitle: 'ઇન્ટરએક્ટિવ કસરતો દ્વારા અંકગણિત મધ્યમાં નિપુણતા મેળવો',
    questionProgress: 'પ્રશ્ન',
    dataTitle: 'ડેટા',
    questionTitle: 'પ્રશ્ન',
    value: 'મૂલ્ય',
    data: 'ડેટા',
    meanCalculation: 'મધ્ય ગણતરી',
    sumOfValues: 'મૂલ્યોનો સરવાળો',
    numberOfValues: 'મૂલ્યોની સંખ્યા',
    mean: 'મધ્ય',
    answerLabel: 'જવાબ',
    performance: 'પ્રદર્શન',
    
    // Assessment
    arithmeticMeanMasteryComplete: 'અંકગણિત મધ્યમાં નિપુણતા પૂર્ણ!',
    completedAllPracticeExercises: 'તમે બધા અભ્યાસ કસરતો પૂર્ણ કરી છે',
    yourScore: 'તમારો સ્કોર',
    accuracy: 'ચોકસાઈ',
    totalAttempts: 'કુલ પ્રયાસો',
    exerciseBreakdown: 'કસરત વિગતો',
    attemptLabel: 'પ્રયાસો',
    practiceAgain: 'ફરીથી અભ્યાસ કરો',
    viewAssessment: 'મૂલ્યાંકન જુઓ',
    
    // Contextual labels
    monday: 'સોમવાર',
    tuesday: 'મંગળવાર',
    wednesday: 'બુધવાર',
    thursday: 'ગુરુવાર',
    friday: 'શુક્રવાર',
    saturday: 'શનિવાર',
    sunday: 'રવિવાર',
    firstInnings: 'પહેલી પારી',
    secondInnings: 'બીજી પારી',
    thirdInnings: 'ત્રીજી પારી',
    fourthInnings: 'ચોથી પારી',
    fifthInnings: 'પાંચમી પારી',
    sixthInnings: 'છઠ્ઠી પારી',
    studentA: 'એલે',
    studentB: 'માર્ક',
    studentC: 'જેમ્સ',
    studentD: 'સારા',
    studentE: 'ડેવિડ',
    studentF: 'એમ્મા',
    studentG: 'માઇકલ',
    studentH: 'લિસા',
    studentI: 'જ્હોન',
    studentJ: 'એના',
    student1: 'આરવ',
    student2: 'બેલા',
    student3: 'કાર્લોસ',
    student4: 'દિયા',
    student5: 'ઈથન',
    student6: 'ફાતીમા',
    student7: 'જોર્જ',
    student8: 'હાના',
    student9: 'ઇવાન',
    student10: 'જુલિયા',
    // Teacher names for age demo
    teacher1: 'શર્મા સર',
    teacher2: 'પટેલ મેಡમ',
    teacher3: 'ખાન સર',
    teacher4: 'થોમસ મેಡમ',
    teacher5: 'મેહતા સર',
    teacher6: 'રોય મેಡમ',
    teacher7: 'વર્મા સર',
    teacher8: 'દેસાઈ મેಡમ',
    teacher9: 'અય્યર સર',
    teacher10: 'જોશી મેಡમ',
    // Girls list for height demo
    girl1: 'આન્યા',
    girl2: 'બેલા',
    girl3: 'ખુશી',
    girl4: 'દિયા',
    girl5: 'એમ્મા',
    girl6: 'હાના',
    girl7: 'ઈશા',
    girl8: 'જુલિયા',
    girl9: 'કિયારા',
    girl10: 'લૂના',
    
    // Units
    hours: 'કલાકો',
    runs: 'રન',
    Runs: 'રન',
    years: 'વર્ષ',
    innings: 'ઇનિંગ્સ',
    Innings: 'ઇનિંગ',
    mm: 'મિમી',
    cm: 'સેમી',
    marks: 'ગુણ',
    girlsHeights: 'છોકરીઓની ઊંચાઈ',
    'Girls Heights': 'છોકરીઓની ઊંચાઈ',
    // Demo titles used in UI
    'Batsman Runs': 'બેટ્સમેનના રન',
    'Teachers Ages': 'શિક્ષકોની ઉંમર',
    
    // Exercise content
    // Step-by-step labels used in Demo
    'Add All Numbers': 'બધા આંકડા ઉમેરો',
    'Count The Innings': 'ઇનિંગ્સની સંખ્યા ગણો',
    'Divide Sum By Count': 'કુલને સંખ્યાથી વિભાગો',
    'Basic Mean': 'મૂળ મધ્ય',
    'Comparison': 'તુલના',
    'Below Mean': 'મધ્યથી નીચે',
    aboveMean: 'મધ્યથી ઉપર',
    studyHoursAnalysis: 'અભ્યાસ કલાક વિશ્લેષણ',
    studyHoursDescription: 'આશિષ ત્રણ સતત દિવસોમાં અલગ-અલગ કલાકો અભ્યાસ કરે છે. સરેરાશ અભ્યાસ સમયની ગણતરી કરો.',
    meanStudyTimeQuestion: 'પ્રતિ દિવસ સરેરાશ અભ્યાસ સમય શું છે?',
    ashishStudyHours: 'આશિષના અભ્યાસના કલાકો',
    
    batsmanPerformance: "બેટ્સમેનનું પ્રદર્શન",
    batsmanPerformanceDescription: "એક બેટ્સમેને છ ઇનિંગ્સમાં રન બનાવ્યા. પ્રતિ ઇનિંગ સરેરાશ રન શોધો.",
    batsmanRunsContext: "છ ઇનિંગ્સમાં બનાવેલા રન",
    meanRunsQuestion: "પ્રતિ ઇનિંગ સરેરાશ રનની ગણતરી કરો.",
    
    weeklyRainfallAnalysis: "સાપ્તાહિક વર્ષા વિશ્લેષણ",
    weeklyRainfallDescription: "એક અઠવાડિયાના વર્ષા ડેટાનું વિશ્લેષણ કરો અને પ્રશ્નોના જવાબ આપો.",
    dailyRainfallContext: "એક અઠવાડિયાની દૈનિક વર્ષા",
    meanRainfallQuestion: "અઠવાડિયાની સરેરાશ વર્ષા શોધો.",
    
    studentHeights: "વિદ્યાર્થીઓની ઊંચાઈ",
    studentHeightsDescription: "એક વર્ગમાં વિદ્યાર્થીઓની અલગ-અલગ ઊંચાઈ છે. સરેરાશ ઊંચાઈની ગણતરી કરો.",
    studentsHeightsContext: "સેન્ટીમીટરમાં વિદ્યાર્થીઓની ઊંચાઈ",
    meanHeightQuestion: "વિદ્યાર્થીઓની સરેરાશ ઊંચાઈ શું છે?",
    
    temperatureRecords: "તાપમાન રેકોર્ડ",
    temperatureRecordsDescription: "એક અઠવાડિયાના દૈનિક તાપમાન રીડિંગ. સરેરાશ તાપમાન શોધો.",
    dailyTemperatureContext: "સેલ્સિયસમાં દૈનિક તાપમાન",
    meanTemperatureQuestion: "અઠવાડિયાના સરેરાશ તાપમાનની ગણતરી કરો.",
    
    testScores: "ટેસ્ટ સ્કોર",
    testScoresDescription: "ગણિતમાં વિદ્યાર્થીઓના ટેસ્ટ સ્કોર. પ્રદર્શનનું વિશ્લેષણ કરો.",
    mathematicsTestContext: "100માંથી ગણિત ટેસ્ટ સ્કોર",
    meanTestScoreQuestion: "સરેરાશ ટેસ્ટ સ્કોર શું છે?",
    
    // Hints
    hint1MeanFormula: 'યાદ રાખો: સરેરાશ = બધા મૂલ્યોનો સરવાળો ÷ મૂલ્યોની સંખ્યા',
    hint1AddNumbers: 'પહેલા 4 + 5 + 3 ઉમેરો, પછી 3 વડે ભાગો',
    hint2AddRuns: 'બધા રન ઉમેરીને શરૂ કરો: 36 + 35 + 50 + 46 + 60 + 55',
    hint2DivideInnings: 'પછી કુલને 6 (ઇનિંગ્સની સંખ્યા) વડે ભાગો',
    hint3AddRainfall: 'પહેલા બધા વરસાદ મૂલ્યો ઉમેરો',
    hint3DivideSeven: 'સરેરાશ મેળવવા માટે 7 વડે ભાગો',
    hint4AddHeights: 'પહેલા બધા ઊંચાઈ મૂલ્યો ઉમેરો',
    hint4DivideStudents: 'પછી 10 (વિદ્યાર્થીઓની સંખ્યા) વડે ભાગો',
    hint5AddTemperatures: 'બધા તાપમાન મૂલ્યો ઉમેરો: 22 + 25 + 28 + 24 + 26 + 23 + 27',
    hint5DivideSevenTemp: 'સરેરાશ મેળવવા માટે 7 વડે ભાગો',
    hint6AddTestScores: 'પહેલા બધા ટેસ્ટ સ્કોર ઉમેરો',
    hint6DivideTen: 'સરેરાશ મેળવવા માટે 10 વડે ભાગો',
    
    // Real World
    whyArithmeticMeanMatters: 'અંકગણિત મધ્ય કેમ મહત્વપૂર્ણ છે?',
    proTip: 'વ્યવસાયિક સલાહ!',
    proTipText: 'અંકગણિત મધ્યની ગણતરી કરતી વખતે હંમેશા યાદ રાખો: બધા મૂલ્યોનો સરવાળો ÷ મૂલ્યોની સંખ્યા. આ સૂત્ર કોઈપણ ડેટાસેટ માટે કામ કરે છે અને તમને સરેરાશ ઝડપથી શોધવામાં મદદ કરે છે!',
    
    // Header title
    arithmeticMean: 'અંકગણિત મધ્ય',
  },
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Load saved language from localStorage or default to 'en'
  const [language, setLanguage] = useState<SupportedLanguage>(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage') as SupportedLanguage;
    return savedLanguage || 'en';
  });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const t = useMemo(() => (key: string) => (translations[language][key] ?? translations.en[key] ?? key), [language]);

  const digitMaps: Record<SupportedLanguage, Record<string, string>> = {
    en: { '0': '0', '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9' },
    hi: { '0': '०', '1': '१', '2': '२', '3': '३', '4': '४', '5': '५', '6': '६', '7': '७', '8': '८', '9': '९' },
    gu: { '0': '૦', '1': '૧', '2': '૨', '3': '૩', '4': '૪', '5': '૫', '6': '૬', '7': '૭', '8': '૮', '9': '૯' },
  };

  const formatNumber = (n: number) => String(n).replace(/[0-9]/g, (d) => digitMaps[language][d]);
  const localizeDigitsInText = (text: string) => text.replace(/[0-9]/g, (d) => digitMaps[language][d]);
  const normalizeDigitsInText = (text: string) => {
    // Build reverse maps once per language
    const reverseMap: Record<string, string> = {};
    Object.entries(digitMaps).forEach(([, map]) => {
      Object.entries(map).forEach(([ascii, localized]) => {
        reverseMap[localized] = ascii;
      });
    });
    return String(text).replace(/[0-9०-९૦-૯]/g, (d) => reverseMap[d] ?? d);
  };

  // Ensure language persists on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage') as SupportedLanguage;
    if (savedLanguage && savedLanguage !== language) {
      setLanguage(savedLanguage);
    }
  }, []); // Only run on mount

  // Enhanced setLanguage with transition animation and persistence
  const setLanguageWithAnimation = (lang: SupportedLanguage) => {
    if (lang === language) return;
    
    // Save language to localStorage for persistence
    localStorage.setItem('selectedLanguage', lang);
    
    setIsTransitioning(true);
    
    // Add a slight delay to show the transition effect
    setTimeout(() => {
      setLanguage(lang);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300); // Animation duration
    }, 150);
  };

  const value = useMemo(() => ({ 
    language, 
    setLanguage: setLanguageWithAnimation, 
    t, 
    formatNumber, 
    localizeDigitsInText, 
    normalizeDigitsInText,
    isTransitioning 
  }), [language, t, formatNumber, localizeDigitsInText, normalizeDigitsInText, isTransitioning]);
  
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}