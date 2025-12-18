import React, { useState, useEffect } from 'react';
import { Lightbulb, CheckCircle, XCircle, Calculator, PlayCircle } from 'lucide-react';

// Type definitions - removed unused ShapeType

// ShapeOption removed - not used

interface PracticeExercise {
  id: string;
  type: 'calculation' | 'identification' | 'verification';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  question: string;
  data: any & {
    visualShapes?: string[];
  };
  correctAnswer: number | string | number[];
  hint: string;
  translations?: {
    [key: string]: {
      question: string;
      hint: string;
    };
  };
}

// Language translations
const translations = {
  en: {
    correct: 'Correct!',
    incorrect: 'Try again!',
    next: 'Next',
    previous: 'Previous',
    submit: 'Submit',
    hint: 'Hint',
    learning: 'Learn',
    practice: 'Practice',
    selectLanguage: 'Select Language',
    chapterTitle: 'Algebric Expressions',
    topicTitle: 'Understanding Nets',
    whatIsTopic: 'What is a Net?',
    keyProperty: 'Key Concept',
    practiceExercises: 'Practice Exercises',
    yourProgress: 'Your Progress',
    accuracy: 'Accuracy',
    avgTime: 'Avg Time',
    correctAnswers: 'Correct',
    totalExercises: 'Total',
    excellent: 'Excellent!',
    goodJob: 'Good Job!',
    keepTrying: 'Keep Trying!',
    realWorldApplications: 'Real World',
    definition: 'Net Definition',
    definitionText: 'A net is a two-dimensional skeleton-outline that, when folded, creates a 3-D shape. Think of it like unfolding a cardboard box by cutting along its edges to lay it flat on paper.',
    keyPropertyText: 'The process can be reversed: fold the net back to create the 3-D shape. The same 3-D shape can have multiple different nets.',
    importantRule: 'The Process',
    importantRuleText: 'Start with a 3-D object (like a cardboard box), cut along the edges to flatten it completely. The resulting flat pattern is the net.',
    sumProperty: 'Examples',
    sumPropertyText: 'Cuboid/Box, Cone, Cube, Cylinder, Pyramid - each has its own distinct net pattern. The Great Pyramid in Giza has a square base and four triangular sides.',
    visualization: 'Shape Visualization',
    interiorElements: '2-D Shapes',
    exteriorElements: '3-D Shapes',
    triangleOf: 'Shape',
    of: 'of',
    yourAnswer: 'Your Answer',
    enterAnswer: 'Enter your answer...',
    architecture: 'Packaging Design',
    architectureDesc: 'Nets are used to design packaging boxes, ensuring efficient material usage and proper folding.',
    navigation: 'Architecture',
    navigationDesc: 'Architects use nets to visualize how 3D structures unfold into 2D blueprints.',
    engineering: 'Manufacturing',
    engineeringDesc: 'Engineers use nets to design products that can be efficiently manufactured and assembled.',
    artDesign: 'Origami & Crafts',
    artDesignDesc: 'Artists and crafters use nets to create complex 3D paper sculptures and origami designs.',
    surveying: 'Education',
    surveyingDesc: 'Teachers use nets to help students understand the relationship between 2D and 3D geometry.',
    computerGraphics: '3D Modeling',
    computerGraphicsDesc: 'Computer graphics use nets to create realistic 3D models and animations.',
    play: 'Play',
    pause: 'Pause',
    step: 'Step',
    totalSteps: 'Total Steps',
    currentStep: 'Current Step',
    progress: 'Progress',
    completion: 'Completion',
    mastery: 'Mastery Level',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    // New dimensional content
    dimensionalClassification: 'Dimensional Classification',
    twoDimensional: 'Two-Dimensional (2-D)',
    threeDimensional: 'Three-Dimensional (3-D)',
    planeFigures: 'Plane Figures',
    solidShapes: 'Solid Shapes',
    lengthBreadth: 'Length and Breadth',
    lengthBreadthHeight: 'Length, Breadth, and Height',
    examples2D: '2-D Examples',
    examples3D: '3-D Examples',
    circle: 'Circle',
    rectangle: 'Rectangle',
    square: 'Square',
    quadrilateral: 'Quadrilateral',
    triangle: 'Triangle',
    cuboid: 'Cuboid',
    cylinder: 'Cylinder',
    cube: 'Cube',
    sphere: 'Sphere',
    pyramid: 'Pyramid',
    cone: 'Cone',
    dailyLifeObjects: 'Daily Life Objects',
    books: 'Books',
    balls: 'Balls',
    iceCreamCones: 'Ice-cream Cones',
    occupySpace: 'Occupy Space',
    drawnOnPaper: 'Drawn on Paper',
    notation: 'Notation',
    shorthand2D: '2-D',
    shorthand3D: '3-D',
    foundation: 'Foundation',
    representation: 'Representation',
    // Algebraic Expressions Guide translations
    algExprTitle: 'Algebraic Expressions',
    algExprSubtitle: 'Chapter 10: Interactive Learning Guide',
    sectionIntro: 'Introduction to Algebraic Expressions',
    sectionFormation: 'How Expressions Are Formed',
    sectionTerms: 'Terms and Factors',
    sectionLikeTerms: 'Like and Unlike Terms',
    whatAreAlgExpr: 'What are Algebraic Expressions?',
    whatAreAlgExprText: 'Algebraic expressions are mathematical phrases that combine numbers, variables, and operations. They\'re like sentences in the language of mathematics!',
    keyPoint: 'Key Point',
    keyPointText: 'Expressions help us solve puzzles, formulate problems, and work with equations in algebra.',
    buildingBlocks: 'Building Blocks',
    variables: 'Variables',
    variablesDesc: 'Can change: x, y, m, n',
    constants: 'Constants',
    constantsDesc: 'Fixed: 4, 100, -17',
    stepByStepFormation: 'Step-by-Step Formation',
    understandingTerms: 'Understanding Terms',
    understandingTermsText: 'Terms are parts of an expression that are formed separately and then added together.',
    factorsOf: 'Factors of',
    coefficients: 'Coefficients',
    coeffExample1: 'In',
    coeffExample2: 'the coefficient is',
    coeffExample3: 'When coefficient is +1, it\'s omitted:',
    likeVsUnlike: 'Like vs Unlike Terms',
    likeTerms: 'Like terms',
    likeTermsDesc: 'have the same algebraic factors (variables and powers).',
    unlikeTerms: 'Unlike terms',
    unlikeTermsDesc: 'have different algebraic factors.',
    likeTermsExamples: 'Like Terms Examples',
    unlikeTermsExamples: 'Unlike Terms Examples',
    bothHave: 'Both have',
    orderDoesntMatter: 'order doesn\'t matter',
    differentVariables: 'Different variables',
    differentPowers: 'Different powers',
    typesOfPolynomials: 'Types of Polynomials',
    monomial: 'Monomial',
    binomial: 'Binomial',
    trinomial: 'Trinomial',
    oneTerm: 'One term',
    twoTerms: 'Two terms',
    threeTerms: 'Three terms',
    // Practice mode features
    skip: 'Skip',
    overview: 'Overview',
    practiceSummary: 'Practice Summary',
    overviewCorrectAnswers: 'Correct Answers',
    overviewIncorrectAnswers: 'Incorrect Answers',
    skippedQuestions: 'Skipped Questions',
    totalQuestions: 'Total Questions',
    overviewAccuracy: 'Accuracy',
    close: 'Close',
    noCorrectYet: 'No correct answers yet',
    noIncorrectYet: 'No incorrect answers yet',
    noSkippedYet: 'No skipped questions yet',
    // Real World Applications - SVG labels
    netPattern: 'Net Pattern',
    threeDtoTwoD: '3D to 2D',
    assembly: 'Assembly',
    paperArt: 'Paper Art',
    learningLabel: 'Learning',
    threeDModel: '3D Model',
    cost: 'Cost',
    income: 'Income',
    distance: 'Distance',
    // Algebra Applications
    shoppingPricing: 'Shopping & Pricing',
    shoppingPricingDesc: 'Use expressions like "3x + 5y" to calculate total cost when buying multiple items at different prices.',
    budgetPlanning: 'Budget Planning',
    budgetPlanningDesc: 'Plan budgets using expressions like "500 + 3m" where m represents variable monthly expenses.',
    distanceCalculation: 'Distance Calculation',
    distanceCalculationDesc: 'Calculate travel distance using expressions like "60t" where t is time in hours and 60 is speed.',
    costFormula: '3x + 5y = Cost',
    incomeFormula: 'Income = 500 + 3m',
    distanceFormula: 'Distance = 60t km',
    // Expression Value Calculator
    findingValueTitle: 'Finding the Value of Expressions',
    findingValueSubtitle: 'Interactive Learning Tool',
    introTitle: 'Introduction',
    singleVarTitle: 'Single Variable',
    negativeValuesTitle: 'Negative Values',
    twoVariablesTitle: 'Two Variables',
    whatIsFindingValue: 'What is Finding the Value?',
    findingValueDesc: 'The <strong>value of an algebraic expression</strong> depends on the values of the variables in the expression.',
    keyConcept: 'Key Concept',
    keyConceptText: 'To find the value, we <strong>substitute</strong> the given value(s) of variables into the expression and calculate the result.',
    whenToUse: 'When to Use?',
    whenToUseList1: 'Checking if a value satisfies an equation',
    whenToUseList2: 'Using formulas from geometry',
    whenToUseList3: 'Solving real-world problems',
    realLifeExample: 'Example from Real Life',
    realLifeExampleText: 'Area of a square = <strong>l²</strong> (where l is the side length)',
    realLifeEx1: '• If l = 5 cm, Area = 5² = 25 cm²',
    realLifeEx2: '• If l = 10 cm, Area = 10² = 100 cm²',
    singleVarDesc: 'For expressions with <strong>one variable</strong>, substitute the value and calculate.',
    setValueOf: 'Set value of',
    calculateAllExpressions: 'Calculate All Expressions',
    substituting: 'Substituting',
    result: 'Result',
    negativeValuesDesc: '<strong>Important:</strong> When substituting negative values, use parentheses to avoid calculation errors!',
    negativeEx: 'Example: 5 × (-2) = -10',
    twoVarDesc: 'For expressions with <strong>two variables</strong>, you need values for <strong>both variables</strong> to calculate the result.',
    // Real World Applications for Expression Values
    temperatureConversion: 'Temperature Conversion',
    temperatureConversionDesc: 'Convert temperatures between Celsius and Fahrenheit using expressions like "F = 9C/5 + 32" where C represents the temperature in Celsius.',
    temperatureFormula: 'F = 9C/5 + 32',
    speedDistance: 'Speed and Distance',
    speedDistanceDesc: 'Calculate distance traveled using expressions like "d = rt" where r is speed and t is time in hours.',
    speedFormula: 'd = rt km',
    profitLoss: 'Profit and Loss Calculation',
    profitLossDesc: 'Calculate profit using expressions like "Profit = Revenue - Cost = 100x - 50x - 200" where x is the number of items sold.',
    profitFormula: 'Profit = 50x - 200',
    ageCalculation: 'Age Calculation',
    ageCalculationDesc: 'Find someone\'s age using expressions like "Age = Current Year - Birth Year" which helps in various real-life scenarios.',
    ageExample: 'If birth year = 1990 and current year = 2024, Age = 2024 - 1990 = 34',
    areaPerimeter: 'Area and Perimeter Formulas',
    areaPerimeterDesc: 'Calculate area of rectangles using expressions like "A = lw" where l is length and w is width. Substitute values to find the area.',
    areaFormula: 'Area = l × w units²',
    volumeCalculation: 'Volume Formulas',
    volumeCalculationDesc: 'Find volume of cuboids using expressions like "V = lwh" where l is length, w is width, and h is height. Substitute values to calculate volume.',
    volumeFormula: 'Volume = l × w × h units³',
    discountPricing: 'Discount and Sale Prices',
    discountPricingDesc: 'Calculate final price after discount using expressions like "Final Price = Original - (Original × Discount%)" where discount is a percentage.',
    discountFormula: 'Final Price = P(1 - d%)',
    electricityBill: 'Electricity Bill Calculation',
    electricityBillDesc: 'Calculate electricity costs using expressions like "Bill = Fixed Charge + (Units × Rate)" where rates vary based on consumption.',
    electricityFormula: 'Bill = 100 + (5 × U)',
    compoundInterest: 'Compound Interest',
    compoundInterestDesc: 'Calculate investment returns using expressions like "A = P(1 + r)ⁿ" where P is principal, r is rate, and n is time in years.',
    compoundFormula: 'Amount = P(1 + r)ⁿ'
  },
  hi: {
    correct: 'सही!',
    incorrect: 'फिर कोशिश करें!',
    next: 'अगला',
    previous: 'पिछला',
    submit: 'जमा करें',
    hint: 'संकेत',
    learning: 'सीखना',
    practice: 'अभ्यास',
    selectLanguage: 'भाषा चुनें',
    chapterTitle: 'Algebric Expressions',
    topicTitle: 'नेट की समझ',
    whatIsTopic: 'नेट क्या है?',
    keyProperty: 'मुख्य अवधारणा',
    practiceExercises: 'अभ्यास अभ्यास',
    yourProgress: 'आपकी प्रगति',
    accuracy: 'सटीकता',
    avgTime: 'औसत समय',
    correctAnswers: 'सही',
    totalExercises: 'कुल',
    excellent: 'उत्कृष्ट!',
    goodJob: 'अच्छा काम!',
    keepTrying: 'कोशिश करते रहें!',
    realWorldApplications: 'वास्तविक दुनिया',
    definition: 'नेट की परिभाषा',
    definitionText: 'एक नेट एक द्वि-आयामी कंकाल-रूपरेखा है जो मुड़ने पर 3-D आकृति बनाती है। इसे कार्डबोर्ड बॉक्स को उसके किनारों पर काटकर कागज पर सपाट बिछाने की तरह समझें।',
    keyPropertyText: 'इस प्रक्रिया को उलटा किया जा सकता है: नेट को वापस मोड़कर 3-D आकृति बनाएं। एक ही 3-D आकृति के कई अलग-अलग नेट हो सकते हैं।',
    importantRule: 'प्रक्रिया',
    importantRuleText: 'एक 3-D वस्तु (जैसे कार्डबोर्ड बॉक्स) से शुरू करें, इसे पूरी तरह सपाट करने के लिए किनारों पर काटें। परिणामी सपाट पैटर्न नेट है।',
    sumProperty: 'उदाहरण',
    sumPropertyText: 'घनाभ/बॉक्स, शंकु, घन, बेलन, पिरामिड - प्रत्येक का अपना अलग नेट पैटर्न है। गीज़ा का महान पिरामिड का वर्गाकार आधार और चार त्रिभुजाकार भुजाएं हैं।',
    visualization: 'आकृति दृश्यीकरण',
    interiorElements: '2-D आकृतियां',
    exteriorElements: '3-D आकृतियां',
    triangleOf: 'आकृति',
    of: 'का',
    yourAnswer: 'आपका उत्तर',
    enterAnswer: 'अपना उत्तर दर्ज करें...',
    architecture: 'पैकेजिंग डिजाइन',
    architectureDesc: 'नेट्स का उपयोग पैकेजिंग बॉक्स डिजाइन करने के लिए किया जाता है, जो कुशल सामग्री उपयोग और उचित मोड़ सुनिश्चित करता है।',
    navigation: 'आर्किटेक्चर',
    navigationDesc: 'आर्किटेक्ट नेट्स का उपयोग यह देखने के लिए करते हैं कि 3D संरचनाएं 2D ब्लूप्रिंट में कैसे खुलती हैं।',
    engineering: 'विनिर्माण',
    engineeringDesc: 'इंजीनियर नेट्स का उपयोग उत्पादों को डिजाइन करने के लिए करते हैं जो कुशलता से निर्मित और असेंबल किए जा सकते हैं।',
    artDesign: 'ओरिगेमी और क्राफ्ट्स',
    artDesignDesc: 'कलाकार और क्राफ्टर जटिल 3D पेपर मूर्तियां और ओरिगेमी डिजाइन बनाने के लिए नेट्स का उपयोग करते हैं।',
    surveying: 'शिक्षा',
    surveyingDesc: 'शिक्षक छात्रों को 2D और 3D ज्यामिति के बीच संबंध समझने में मदद करने के लिए नेट्स का उपयोग करते हैं।',
    computerGraphics: '3D मॉडलिंग',
    computerGraphicsDesc: 'कंप्यूटर ग्राफिक्स यथार्थवादी 3D मॉडल और एनिमेशन बनाने के लिए नेट्स का उपयोग करते हैं।',
    play: 'चलाएं',
    pause: 'रोकें',
    step: 'चरण',
    totalSteps: 'कुल चरण',
    currentStep: 'वर्तमान चरण',
    progress: 'प्रगति',
    completion: 'पूर्णता',
    mastery: 'निपुणता स्तर',
    beginner: 'शुरुआती',
    intermediate: 'मध्यम',
    advanced: 'उन्नत',
    // New dimensional content
    dimensionalClassification: 'आयामी वर्गीकरण',
    twoDimensional: 'द्वि-आयामी (2-D)',
    threeDimensional: 'त्रि-आयामी (3-D)',
    planeFigures: 'समतल आकृतियां',
    solidShapes: 'ठोस आकृतियां',
    lengthBreadth: 'लंबाई और चौड़ाई',
    lengthBreadthHeight: 'लंबाई, चौड़ाई और ऊंचाई',
    examples2D: '2-D उदाहरण',
    examples3D: '3-D उदाहरण',
    circle: 'वृत्त',
    rectangle: 'आयत',
    square: 'वर्ग',
    quadrilateral: 'चतुर्भुज',
    triangle: 'त्रिभुज',
    cuboid: 'घनाभ',
    cylinder: 'बेलन',
    cube: 'घन',
    sphere: 'गोला',
    pyramid: 'पिरामिड',
    cone: 'शंकु',
    dailyLifeObjects: 'दैनिक जीवन की वस्तुएं',
    books: 'किताबें',
    balls: 'गेंदें',
    iceCreamCones: 'आइसक्रीम कोन',
    occupySpace: 'स्थान घेरना',
    drawnOnPaper: 'कागज पर खींचा गया',
    notation: 'संकेतन',
    shorthand2D: '2-D',
    shorthand3D: '3-D',
    foundation: 'आधार',
    representation: 'प्रतिनिधित्व',
    // Algebraic Expressions Guide translations
    algExprTitle: 'बीजीय व्यंजक',
    algExprSubtitle: 'अध्याय 10: इंटरैक्टिव शिक्षण गाइड',
    sectionIntro: 'बीजीय व्यंजक का परिचय',
    sectionFormation: 'व्यंजक कैसे बनते हैं',
    sectionTerms: 'पद और गुणनखंड',
    sectionLikeTerms: 'समान और असमान पद',
    whatAreAlgExpr: 'बीजीय व्यंजक क्या हैं?',
    whatAreAlgExprText: 'बीजीय व्यंजक गणितीय वाक्य हैं जो संख्याओं, चर और संक्रियाओं को मिलाते हैं। वे गणित की भाषा में वाक्यों की तरह हैं!',
    keyPoint: 'मुख्य बिंदु',
    keyPointText: 'व्यंजक हमें पहेलियों को हल करने, समस्याओं को तैयार करने और बीजगणित में समीकरणों के साथ काम करने में मदद करते हैं।',
    buildingBlocks: 'मूलभूत तत्व',
    variables: 'चर',
    variablesDesc: 'बदल सकते हैं: x, y, m, n',
    constants: 'अचर',
    constantsDesc: 'स्थिर: 4, 100, -17',
    stepByStepFormation: 'चरण-दर-चरण निर्माण',
    understandingTerms: 'पदों को समझना',
    understandingTermsText: 'पद एक व्यंजक के भाग हैं जो अलग से बने होते हैं और फिर जोड़े जाते हैं।',
    factorsOf: 'के गुणनखंड',
    coefficients: 'गुणांक',
    coeffExample1: 'में',
    coeffExample2: 'गुणांक है',
    coeffExample3: 'जब गुणांक +1 है, तो इसे छोड़ दिया जाता है:',
    likeVsUnlike: 'समान बनाम असमान पद',
    likeTerms: 'समान पद',
    likeTermsDesc: 'एक ही बीजगणितीय गुणनखंड (चर और घात) होते हैं।',
    unlikeTerms: 'असमान पद',
    unlikeTermsDesc: 'अलग बीजगणितीय गुणनखंड होते हैं।',
    likeTermsExamples: 'समान पद के उदाहरण',
    unlikeTermsExamples: 'असमान पद के उदाहरण',
    bothHave: 'दोनों में हैं',
    orderDoesntMatter: 'क्रम मायने नहीं रखता',
    differentVariables: 'अलग चर',
    differentPowers: 'अलग घात',
    typesOfPolynomials: 'बहुपद के प्रकार',
    monomial: 'एकपदी',
    binomial: 'द्विपदी',
    trinomial: 'त्रिपदी',
    oneTerm: 'एक पद',
    twoTerms: 'दो पद',
    threeTerms: 'तीन पद',
    // Practice mode features
    skip: 'छोड़ें',
    overview: 'अवलोकन',
    practiceSummary: 'अभ्यास सारांश',
    overviewCorrectAnswers: 'सही उत्तर',
    overviewIncorrectAnswers: 'गलत उत्तर',
    skippedQuestions: 'छोड़े गए प्रश्न',
    totalQuestions: 'कुल प्रश्न',
    overviewAccuracy: 'सटीकता',
    close: 'बंद करें',
    noCorrectYet: 'अभी तक कोई सही उत्तर नहीं',
    noIncorrectYet: 'अभी तक कोई गलत उत्तर नहीं',
    noSkippedYet: 'अभी तक कोई प्रश्न नहीं छोड़ा गया',
    // Real World Applications - SVG labels
    netPattern: 'नेट पैटर्न',
    threeDtoTwoD: '3D से 2D',
    assembly: 'असेंबली',
    paperArt: 'कागज कला',
    learningLabel: 'शिक्षण',
    threeDModel: '3D मॉडल',
    cost: 'लागत',
    income: 'आय',
    distance: 'दूरी',
    // Algebra Applications
    shoppingPricing: 'खरीदारी और मूल्य',
    shoppingPricingDesc: 'विभिन्न कीमतों पर कई वस्तुओं की खरीदारी करते समय कुल लागत की गणना करने के लिए "3x + 5y" जैसे व्यंजकों का उपयोग करें।',
    budgetPlanning: 'बजट योजना',
    budgetPlanningDesc: '"500 + 3m" जैसे व्यंजकों का उपयोग करके बजट की योजना बनाएं जहाँ m परिवर्तनशील मासिक खर्चों का प्रतिनिधित्व करता है।',
    distanceCalculation: 'दूरी गणना',
    distanceCalculationDesc: 'जहाँ t घंटों में समय है और 60 गति है, "60t" जैसे व्यंजकों का उपयोग करके यात्रा दूरी की गणना करें।',
    costFormula: '3x + 5y = लागत',
    incomeFormula: 'आय = 500 + 3m',
    distanceFormula: 'दूरी = 60t किमी',
    // Expression Value Calculator
    findingValueTitle: 'व्यंजकों का मान ज्ञात करना',
    findingValueSubtitle: 'इंटरैक्टिव लर्निंग टूल',
    introTitle: 'परिचय',
    singleVarTitle: 'एकल चर',
    negativeValuesTitle: 'ऋणात्मक मान',
    twoVariablesTitle: 'दो चर',
    whatIsFindingValue: 'मान ज्ञात करना क्या है?',
    findingValueDesc: 'एक <strong>बीजीय व्यंजक का मान</strong> व्यंजक में चर के मानों पर निर्भर करता है।',
    keyConcept: 'मुख्य अवधारणा',
    keyConceptText: 'मान ज्ञात करने के लिए, हम व्यंजक में दिए गए चर(ओं) के मान को <strong>प्रतिस्थापित</strong> करते हैं और परिणाम की गणना करते हैं।',
    whenToUse: 'कब उपयोग करें?',
    whenToUseList1: 'जांचना कि कोई मान समीकरण को संतुष्ट करता है या नहीं',
    whenToUseList2: 'ज्यामिति से सूत्रों का उपयोग करना',
    whenToUseList3: 'वास्तविक दुनिया की समस्याओं को हल करना',
    realLifeExample: 'वास्तविक जीवन से उदाहरण',
    realLifeExampleText: 'वर्ग का क्षेत्रफल = <strong>l²</strong> (जहाँ l भुजा की लंबाई है)',
    realLifeEx1: '• यदि l = 5 सेमी, क्षेत्रफल = 5² = 25 सेमी²',
    realLifeEx2: '• यदि l = 10 सेमी, क्षेत्रफल = 10² = 100 सेमी²',
    singleVarDesc: 'एक चर वाले व्यंजकों के लिए, मान को प्रतिस्थापित करें और गणना करें।',
    setValueOf: 'का मान सेट करें',
    calculateAllExpressions: 'सभी व्यंजकों की गणना करें',
    substituting: 'प्रतिस्थापित करना',
    result: 'परिणाम',
    negativeValuesDesc: '<strong>महत्वपूर्ण:</strong> ऋणात्मक मानों को प्रतिस्थापित करते समय, गणना त्रुटियों से बचने के लिए कोष्ठक का उपयोग करें!',
    negativeEx: 'उदाहरण: 5 × (-2) = -10',
    twoVarDesc: 'दो चर वाले व्यंजकों के लिए, परिणाम की गणना करने के लिए आपको <strong>दोनों चरों</strong> के लिए मानों की आवश्यकता होती है।',
    // Real World Applications for Expression Values
    temperatureConversion: 'तापमान रूपांतरण',
    temperatureConversionDesc: 'सेल्सियस और फारेनहाइट के बीच तापमान को "F = 9C/5 + 32" जैसे व्यंजकों का उपयोग करके रूपांतरित करें जहाँ C सेल्सियस में तापमान है।',
    temperatureFormula: 'F = 9C/5 + 32',
    speedDistance: 'गति और दूरी',
    speedDistanceDesc: 'दूरी की गणना करने के लिए "d = rt" जैसे व्यंजकों का उपयोग करें जहाँ r गति है और t घंटों में समय है।',
    speedFormula: 'd = rt किमी',
    profitLoss: 'लाभ और हानि की गणना',
    profitLossDesc: 'लाभ की गणना करने के लिए "Profit = Revenue - Cost = 100x - 50x - 200" जैसे व्यंजकों का उपयोग करें जहाँ x बेची गई वस्तुओं की संख्या है।',
    profitFormula: 'लाभ = 50x - 200',
    ageCalculation: 'उम्र की गणना',
    ageCalculationDesc: 'किसी की उम्र ज्ञात करने के लिए "Age = Current Year - Birth Year" जैसे व्यंजकों का उपयोग करें जो विभिन्न वास्तविक जीवन परिदृश्यों में मदद करता है।',
    ageExample: 'यदि जन्म वर्ष = 1990 और वर्तमान वर्ष = 2024, उम्र = 2024 - 1990 = 34',
    areaPerimeter: 'क्षेत्रफल और परिमाप सूत्र',
    areaPerimeterDesc: 'आयतों के क्षेत्रफल की गणना करने के लिए "A = lw" जैसे व्यंजकों का उपयोग करें जहाँ l लंबाई है और w चौड़ाई है। क्षेत्रफल ज्ञात करने के लिए मानों को प्रतिस्थापित करें।',
    areaFormula: 'क्षेत्रफल = l × w इकाई²',
    volumeCalculation: 'आयतन सूत्र',
    volumeCalculationDesc: 'घनाभों के आयतन की गणना करने के लिए "V = lwh" जैसे व्यंजकों का उपयोग करें जहाँ l लंबाई, w चौड़ाई और h ऊंचाई है। आयतन की गणना करने के लिए मानों को प्रतिस्थापित करें।',
    volumeFormula: 'आयतन = l × w × h इकाई³',
    discountPricing: 'छूट और बिक्री मूल्य',
    discountPricingDesc: 'छूट के बाद अंतिम मूल्य की गणना करने के लिए "Final Price = Original - (Original × Discount%)" जैसे व्यंजकों का उपयोग करें जहाँ छूट एक प्रतिशत है।',
    discountFormula: 'अंतिम मूल्य = P(1 - d%)',
    electricityBill: 'बिजली बिल की गणना',
    electricityBillDesc: 'बिजली की लागत की गणना करने के लिए "Bill = Fixed Charge + (Units × Rate)" जैसे व्यंजकों का उपयोग करें जहाँ दरें खपत के आधार पर भिन्न होती हैं।',
    electricityFormula: 'बिल = 100 + (5 × U)',
    compoundInterest: 'चक्रवृद्धि ब्याज',
    compoundInterestDesc: 'निवेश रिटर्न की गणना करने के लिए "A = P(1 + r)ⁿ" जैसे व्यंजकों का उपयोग करें जहाँ P मूलधन है, r दर है और n वर्षों में समय है।',
    compoundFormula: 'राशि = P(1 + r)ⁿ'
  },
  gu: {
    correct: 'સાચું!',
    incorrect: 'ફરી કોશિશ કરો!',
    next: 'આગળ',
    previous: 'પાછળ',
    submit: 'જમા કરો',
    hint: 'સંકેત',
    learning: 'શીખવું',
    practice: 'અભ્યાસ',
    selectLanguage: 'ભાષા પસંદ કરો',
    chapterTitle: 'Algebric Expressions',
    topicTitle: 'નેટની સમજ',
    whatIsTopic: 'નેટ શું છે?',
    keyProperty: 'મુખ્ય ખ્યાલ',
    practiceExercises: 'અભ્યાસ કસરતો',
    yourProgress: 'તમારી પ્રગતિ',
    accuracy: 'ચોકસાઈ',
    avgTime: 'સરેરાશ સમય',
    correctAnswers: 'સાચું',
    totalExercises: 'કુલ',
    excellent: 'ઉત્તમ!',
    goodJob: 'સારું કામ!',
    keepTrying: 'કોશિશ કરતા રહો!',
    realWorldApplications: 'વાસ્તવિક વિશ્વ',
    definition: 'નેટની વ્યાખ્યા',
    definitionText: 'નેટ એક દ્વિ-પરિમાણીય કંકાલ-રૂપરેખા છે જે મુડવાથી 3-D આકૃતિ બનાવે છે। તેને કાર્ડબોર્ડ બોક્સને તેના કિનારાઓ પર કાપીને કાગળ પર સપાટ પાથરવા જેવું સમજો।',
    keyPropertyText: 'આ પ્રક્રિયાને ઉલટાવી શકાય છે: નેટને પાછળથી મુડવીને 3-D આકૃતિ બનાવો। એક જ 3-D આકૃતિના ઘણા અલગ-અલગ નેટ હોઈ શકે છે।',
    importantRule: 'પ્રક્રિયા',
    importantRuleText: 'એક 3-D વસ્તુ (જેવી કે કાર્ડબોર્ડ બોક્સ) થી શરૂ કરો, તેને સંપૂર્ણપણે સપાટ કરવા માટે કિનારાઓ પર કાપો। પરિણામી સપાટ પેટર્ન નેટ છે।',
    sumProperty: 'ઉદાહરણો',
    sumPropertyText: 'ઘનાભ/બોક્સ, શંકુ, ઘન, સિલિન્ડર, પિરામિડ - દરેકનો પોતાનો અલગ નેટ પેટર્ન છે। ગીઝાના મહાન પિરામિડનો ચોરસ પાયો અને ચાર ત્રિકોણાકાર બાજુઓ છે।',
    visualization: 'આકૃતિ દ્રશ્યીકરણ',
    interiorElements: '2-D આકૃતિઓ',
    exteriorElements: '3-D આકૃતિઓ',
    triangleOf: 'આકૃતિ',
    of: 'નો',
    yourAnswer: 'તમારો જવાબ',
    enterAnswer: 'તમારો જવાબ દાખલ કરો...',
    architecture: 'પેકેજિંગ ડિઝાઇન',
    architectureDesc: 'પેકેજિંગ બોક્સ ડિઝાઇન કરવા માટે નેટ્સનો ઉપયોગ થાય છે, જે કાર્યક્ષમ સામગ્રી ઉપયોગ અને યોગ્ય મુડવાની ખાતરી કરે છે।',
    navigation: 'આર્કિટેક્ચર',
    navigationDesc: 'આર્કિટેક્ટ નેટ્સનો ઉપયોગ એ જોવા માટે કરે છે કે 3D માળખા 2D બ્લુપ્રિન્ટમાં કેવી રીતે ખુલે છે।',
    engineering: 'ઉત્પાદન',
    engineeringDesc: 'ઇજનેરો નેટ્સનો ઉપયોગ એવા ઉત્પાદનો ડિઝાઇન કરવા માટે કરે છે જે કાર્યક્ષમ રીતે ઉત્પાદિત અને એસેમ્બલ કરી શકાય છે।',
    artDesign: 'ઓરિગામી અને ક્રાફ્ટ્સ',
    artDesignDesc: 'કલાકારો અને ક્રાફ્ટર જટિલ 3D પેપર મૂર્તિઓ અને ઓરિગામી ડિઝાઇન બનાવવા માટે નેટ્સનો ઉપયોગ કરે છે।',
    surveying: 'શિક્ષણ',
    surveyingDesc: 'શિક્ષકો વિદ્યાર્થીઓને 2D અને 3D ભૂમિતિ વચ્ચેનો સંબંધ સમજવામાં મદદ કરવા માટે નેટ્સનો ઉપયોગ કરે છે।',
    computerGraphics: '3D મોડેલિંગ',
    computerGraphicsDesc: 'કમ્પ્યુટર ગ્રાફિક્સ યથાર્થવાદી 3D મોડલ અને એનિમેશન બનાવવા માટે નેટ્સનો ઉપયોગ કરે છે।',
    play: 'ચલાવો',
    pause: 'રોકો',
    step: 'પગલું',
    totalSteps: 'કુલ પગલાં',
    currentStep: 'વર્તમાન પગલું',
    progress: 'પ્રગતિ',
    completion: 'પૂર્ણતા',
    mastery: 'નિપુણતા સ્તર',
    beginner: 'શરૂઆત',
    intermediate: 'મધ્યમ',
    advanced: 'અદ્યતન',
    // New dimensional content
    dimensionalClassification: 'પરિમાણીય વર્ગીકરણ',
    twoDimensional: 'દ્વિ-પરિમાણીય (2-D)',
    threeDimensional: 'ત્રિ-પરિમાણીય (3-D)',
    planeFigures: 'સમતલ આકૃતિઓ',
    solidShapes: 'ઘન આકૃતિઓ',
    lengthBreadth: 'લંબાઈ અને પહોળાઈ',
    lengthBreadthHeight: 'લંબાઈ, પહોળાઈ અને ઊંચાઈ',
    examples2D: '2-D ઉદાહરણો',
    examples3D: '3-D ઉદાહરણો',
    circle: 'વર્તુળ',
    rectangle: 'લંબચોરસ',
    square: 'ચોરસ',
    quadrilateral: 'ચતુષ્કોણ',
    triangle: 'ત્રિકોણ',
    cuboid: 'ઘનાભ',
    cylinder: 'સિલિન્ડર',
    cube: 'ઘન',
    sphere: 'ગોળક',
    pyramid: 'પિરામિડ',
    cone: 'શંકુ',
    dailyLifeObjects: 'દૈનિક જીવનની વસ્તુઓ',
    books: 'પુસ્તકો',
    balls: 'દડા',
    iceCreamCones: 'આઇસક્રીમ કોન',
    occupySpace: 'જગ્યા ઘેરવી',
    drawnOnPaper: 'કાગળ પર દોરેલું',
    notation: 'સંકેત',
    shorthand2D: '2-D',
    shorthand3D: '3-D',
    foundation: 'પાયો',
    representation: 'પ્રતિનિધિત્વ',
    // Algebraic Expressions Guide translations
    algExprTitle: 'બીજગણિત અભિવ્યક્તિઓ',
    algExprSubtitle: 'અધ્યાય 10: સક્રિય શિક્ષણ ગાઇડ',
    sectionIntro: 'બીજગણિત અભિવ્યક્તિઓનો પરિચય',
    sectionFormation: 'અભિવ્યક્તિઓ કેવી રીતે બનાવવામાં આવે છે',
    sectionTerms: 'શબ્દો અને અવયવો',
    sectionLikeTerms: 'સમાન અને અસમાન શબ્દો',
    whatAreAlgExpr: 'બીજગણિત અભિવ્યક્તિઓ શું છે?',
    whatAreAlgExprText: 'બીજગણિત અભિવ્યક્તિઓ ગાણિતિક શબ્દસમૂહો છે જે સંખ્યાઓ, ચલો અને ક્રિયાઓને જોડે છે. તે ગણિતની ભાષામાં વાક્યો જેવા છે!',
    keyPoint: 'મુખ્ય મુદ્દો',
    keyPointText: 'અભિવ્યક્તિઓ અમને ઉકેલવામાં મદદ કરે છે, સમસ્યાઓ ઘડવામાં મદદ કરે છે અને બીજગણિતમાં સમીકરણો સાથે કામ કરવામાં મદદ કરે છે।',
    buildingBlocks: 'મૂળભૂત બિલ્ડિંગ બ્લોક્સ',
    variables: 'ચલો',
    variablesDesc: 'બદલી શકાય છે: x, y, m, n',
    constants: 'સ્થિરાંકો',
    constantsDesc: 'ફિક્સ: 4, 100, -17',
    stepByStepFormation: 'પગલું-દર-પગલું રચના',
    understandingTerms: 'શબ્દોને સમજવા',
    understandingTermsText: 'શબ્દો એ અભિવ્યક્તિના ભાગો છે જે અલગથી બનેલા છે અને પછી ઉમેરવામાં આવે છે।',
    factorsOf: 'ના અવયવો',
    coefficients: 'ગુણાંકો',
    coeffExample1: 'માં',
    coeffExample2: 'ગુણાંક છે',
    coeffExample3: 'જ્યારે ગુણાંક +1 છે, ત્યારે તે છોડવામાં આવે છે:',
    likeVsUnlike: 'સમાન બનામ અસમાન શબ્દો',
    likeTerms: 'સમાન શબ્દો',
    likeTermsDesc: 'સમાન બીજગણિતીય અવયવો (ચલો અને શક્તિઓ) ધરાવે છે।',
    unlikeTerms: 'અસમાન શબ્દો',
    unlikeTermsDesc: 'વિવિધ બીજગણિતીય અવયવો ધરાવે છે।',
    likeTermsExamples: 'સમાન શબ્દોના ઉદાહરણો',
    unlikeTermsExamples: 'અસમાન શબ્દોના ઉદાહરણો',
    bothHave: 'બંનેમાં છે',
    orderDoesntMatter: 'ક્રમ મહત્વનું નથી',
    differentVariables: 'વિવિધ ચલો',
    differentPowers: 'વિવિધ શક્તિઓ',
    typesOfPolynomials: 'બહુપદીના પ્રકારો',
    monomial: 'મોનોમિયલ',
    binomial: 'બાયનોમિયલ',
    trinomial: 'ટ્રિનોમિયલ',
    oneTerm: 'એક શબ્દ',
    twoTerms: 'બે શબ્દો',
    threeTerms: 'ત્રણ શબ્દો',
    // Practice mode features
    skip: 'છોડો',
    overview: 'પૃષ્ઠની સમીક્ષા',
    practiceSummary: 'અભ્યાસ સારાંશ',
    overviewCorrectAnswers: 'સાચા જવાબો',
    overviewIncorrectAnswers: 'ખોટા જવાબો',
    skippedQuestions: 'છોડવામાં આવેલા પ્રશ્નો',
    totalQuestions: 'કુલ પ્રશ્નો',
    overviewAccuracy: 'ચોકસાઈ',
    close: 'બંધ કરો',
    noCorrectYet: 'હજી સુધી કોઈ સાચો જવાબ નથી',
    noIncorrectYet: 'હજી સુધી કોઈ ખોટો જવાબ નથી',
    noSkippedYet: 'હજી સુધી કોઈ પ્રશ્ન છોડવામાં આવ્યો નથી',
    // Real World Applications - SVG labels
    netPattern: 'નેટ પેટર્ન',
    threeDtoTwoD: '3D થી 2D',
    assembly: 'એસેમ્બલી',
    paperArt: 'કાગળ કલા',
    learningLabel: 'શીખવું',
    threeDModel: '3D મોડેલ',
    cost: 'ખર્ચ',
    income: 'આવક',
    distance: 'અંતર',
    // Algebra Applications
    shoppingPricing: 'ખરીદી અને ભાવ',
    shoppingPricingDesc: 'વિવિધ ભાવે અનેક વસ્તુઓ ખરીદતી વખતે કુલ ખર્ચની ગણતરી માટે "3x + 5y" જેવા અભિવ્યક્તિઓનો ઉપયોગ કરો।',
    budgetPlanning: 'બજેટ યોજના',
    budgetPlanningDesc: 'જ્યાં m ચલ માસિક ખર્ચને રજૂ કરે છે, ત્યાં "500 + 3m" જેવા અભિવ્યક્તિઓનો ઉપયોગ કરીને બજેટની યોજના બનાવો।',
    distanceCalculation: 'અંતર ગણતરી',
    distanceCalculationDesc: 'જ્યાં t કલાકમાં સમય છે અને 60 ઝડપ છે, "60t" જેવા અભિવ્યક્તિઓનો ઉપયોગ કરીને મુસાફરી અંતરની ગણતરી કરો।',
    costFormula: '3x + 5y = ખર્ચ',
    incomeFormula: 'આવક = 500 + 3m',
    distanceFormula: 'અંતર = 60t કિમી',
    // Expression Value Calculator
    findingValueTitle: 'અભિવ્યક્તિઓનું મૂલ્ય શોધવું',
    findingValueSubtitle: 'ઈન્ટરેક્ટિવ શીખવાનું સાધન',
    introTitle: 'પરિચય',
    singleVarTitle: 'એકલ ચલ',
    negativeValuesTitle: 'નકારાત્મક મૂલ્ય',
    twoVariablesTitle: 'બે ચલ',
    whatIsFindingValue: 'મૂલ્ય શોધવું તે શું છે?',
    findingValueDesc: 'બીજગણિત અભિવ્યક્તિનું મૂલ્ય અભિવ્યક્તિમાંના ચલોના મૂલ્યો પર આધાર રાખે છે।',
    keyConcept: 'મુખ્ય ખ્યાલ',
    keyConceptText: 'મૂલ્ય શોધવા માટે, આપણે અભિવ્યક્તિમાં ચલ(ઓ) ના આપેલા મૂલ્યને <strong>અવેજી</strong> કરીએ છીએ અને પરિણામની ગણતરી કરીએ છીએ।',
    whenToUse: 'ક્યારે ઉપયોગ કરવો?',
    whenToUseList1: 'ચકાસવું કે કોઈ મૂલ્ય સમીકરણને સંતોષે છે કે નહીં',
    whenToUseList2: 'ભૂમિતિમાંથી સૂત્રોનો ઉપયોગ કરવો',
    whenToUseList3: 'વાસ્તવિક જગતની સમસ્યાઓ હલ કરવી',
    realLifeExample: 'વાસ્તવિક જીવનથી ઉદાહરણ',
    realLifeExampleText: 'ચોરસનો પ્રદેશ = <strong>l²</strong> (જ્યાં l બાજુની લંબાઈ છે)',
    realLifeEx1: '• જો l = 5 સેમી, પ્રદેશ = 5² = 25 સેમી²',
    realLifeEx2: '• જો l = 10 સેમી, પ્રદેશ = 10² = 100 સેમી²',
    singleVarDesc: 'એક ચલ સાથે અભિવ્યક્તિઓ માટે, મૂલ્યનો અવેજી કરો અને ગણતરી કરો।',
    setValueOf: 'નું મૂલ્ય સેટ કરો',
    calculateAllExpressions: 'બધી અભિવ્યક્તિઓની ગણતરી કરો',
    substituting: 'અવેજી કરવી',
    result: 'પરિણામ',
    negativeValuesDesc: '<strong>મહત્વપૂર્ણ:</strong> નકારાત્મક મૂલ્યોને અવેજી કરતી વખતે, ગણતરી ભૂલોથી બચવા માટે કૌંસનો ઉપયોગ કરો!',
    negativeEx: 'ઉદાહરણ: 5 × (-2) = -10',
    twoVarDesc: 'બે ચલ સાથે અભિવ્યક્તિઓ માટે, પરિણામની ગણતરી કરવા માટે તમારે <strong>બંને ચલો</strong> માટે મૂલ્યોની જરૂર પડશે।',
    // Real World Applications for Expression Values
    temperatureConversion: 'ઉષ્ણતામાન રૂપાંતર',
    temperatureConversionDesc: 'સેલ્સિયસ અને ફેરનહિટ વચ્ચે ઉષ્ણતામાનને "F = 9C/5 + 32" જેવા અભિવ્યક્તિઓનો ઉપયોગ કરીને રૂપાંતરિત કરો જ્યાં C સેલ્સિયસમાં ઉષ્ણતામાન રજૂ કરે છે।',
    temperatureFormula: 'F = 9C/5 + 32',
    speedDistance: 'ઝડપ અને અંતર',
    speedDistanceDesc: 'પ્રવાસિત અંતરની ગણતરી કરવા માટે "d = rt" જેવા અભિવ્યક્તિઓનો ઉપયોગ કરો જ્યાં r ઝડપ છે અને t કલાકોમાં સમય છે।',
    speedFormula: 'd = rt કિમી',
    profitLoss: 'લાભ અને ખોટની ગણતરી',
    profitLossDesc: '"Profit = Revenue - Cost = 100x - 50x - 200" જેવા અભિવ્યક્તિઓનો ઉપયોગ કરીને લાભની ગણતરી કરો જ્યાં x વેચાયેલી વસ્તુઓની સંખ્યા છે।',
    profitFormula: 'લાભ = 50x - 200',
    ageCalculation: 'ઉંમરની ગણતરી',
    ageCalculationDesc: 'કોઈના ઉંમર શોધવા માટે "Age = Current Year - Birth Year" જેવા અભિવ્યક્તિઓનો ઉપયોગ કરો જે વિવિધ વાસ્તવિક જગતના દ્રશ્યોમાં મદદ કરે છે।',
    ageExample: 'જો જન્મ વર્ષ = 1990 અને વર્તમાન વર્ષ = 2024, ઉંમર = 2024 - 1990 = 34',
    areaPerimeter: 'પ્રદેશ અને પરિમાપ સૂત્રો',
    areaPerimeterDesc: 'લંબચોરસના પ્રદેશની ગણતરી કરવા માટે "A = lw" જેવા અભિવ્યક્તિઓનો ઉપયોગ કરો જ્યાં l લંબાઈ છે અને w પહોળાઈ છે। પ્રદેશ શોધવા માટે મૂલ્યોને અવેજી કરો।',
    areaFormula: 'પ્રદેશ = l × w એકમ²',
    volumeCalculation: 'આયતન સૂત્રો',
    volumeCalculationDesc: 'ઘનાભોનું આયતન શોધવા માટે "V = lwh" જેવા અભિવ્યક્તિઓનો ઉપયોગ કરો જ્યાં l લંબાઈ છે, w પહોળાઈ છે અને h ઊંચાઈ છે। આયતનની ગણતરી કરવા માટે મૂલ્યોને અવેજી કરો।',
    volumeFormula: 'આયતન = l × w × h એકમ³',
    discountPricing: 'ડિસ્કાઉન્ટ અને વેચાણ કિંમતો',
    discountPricingDesc: 'ડિસ્કાઉન્ટ પછી અંતિમ કિંમતની ગણતરી કરવા માટે "Final Price = Original - (Original × Discount%)" જેવા અભિવ્યક્તિઓનો ઉપયોગ કરો જ્યાં ડિસ્કાઉન્ટ એક ટકાવારી છે।',
    discountFormula: 'અંતિમ કિંમત = P(1 - d%)',
    electricityBill: 'વીજબિલની ગણતરી',
    electricityBillDesc: 'વીજબિલની ગણતરી કરવા માટે "Bill = Fixed Charge + (Units × Rate)" જેવા અભિવ્યક્તિઓનો ઉપયોગ કરો જ્યાં દરો વપરાશના આધારે બદલાય છે।',
    electricityFormula: 'બિલ = 100 + (5 × U)',
    compoundInterest: 'ચક્રવૃદ્ધિ વ્યાજ',
    compoundInterestDesc: 'નિવેશ વળતરની ગણતરી કરવા માટે "A = P(1 + r)ⁿ" જેવા અભિવ્યક્તિઓનો ઉપયોગ કરો જ્યાં P મૂળધન છે, r દર છે અને n વર્ષોમાં સમય છે।',
    compoundFormula: 'રકમ = P(1 + r)ⁿ'
  }
};

// Practice exercises with visual shapes data
const practiceExercises: PracticeExercise[] = [
  // Algebraic Expressions Questions
  {
    id: 'alg-ex1',
    type: 'identification',
    difficulty: 'beginner',
    question: 'What is the coefficient of x in the expression 7x + 3?',
    data: {
      visualShapes: ['Square', 'Rectangle']
    },
    correctAnswer: '7',
    hint: 'The coefficient is the number multiplied by the variable x. In 7x + 3, 7 is the coefficient.',
    translations: {
      gu: {
        question: 'વ્યક્તિકરણ 7x + 3 માં x નો ગુણાંક શું છે?',
        hint: 'ગુણાંક ચલ x દ્વારા ગુણાકાર કરેલ સંખ્યા છે। 7x + 3 માં, 7 ગુણાંક છે।'
      },
      hi: {
        question: 'व्यंजक 7x + 3 में x का गुणांक क्या है?',
        hint: 'गुणांक चर x से गुणा की गई संख्या है। 7x + 3 में, 7 गुणांक है।'
      }
    }
  },
  {
    id: 'alg-ex2',
    type: 'identification',
    difficulty: 'beginner',
    question: 'What is the constant term in the expression 5xy + 8?',
    data: {
      visualShapes: ['Circle', 'Triangle']
    },
    correctAnswer: '8',
    hint: 'A constant is a number without a variable. In 5xy + 8, the constant is 8.',
    translations: {
      gu: {
        question: 'વ્યક્તિકરણ 5xy + 8 માં અચર સંખ્યા શું છે?',
        hint: 'અચર એ વિના ચલ સાથેની સંખ્યા છે। 5xy + 8 માં, અચર 8 છે।'
      },
      hi: {
        question: 'व्यंजक 5xy + 8 में स्थिरांक क्या है?',
        hint: 'स्थिरांक चर के बिना एक संख्या है। 5xy + 8 में, स्थिरांक 8 है।'
      }
    }
  },
  {
    id: 'alg-ex3',
    type: 'identification',
    difficulty: 'intermediate',
    question: 'Which of the following are like terms: 3xy, -5xy, 7x?',
    data: {
      visualShapes: ['Rectangle', 'Square']
    },
    correctAnswer: '3xy and -5xy',
    hint: 'Like terms have the same algebraic factors. 3xy and -5xy both have xy, so they are like terms.',
    translations: {
      gu: {
        question: 'નીચેનામાંથી કયા સમાન પદો છે: 3xy, -5xy, 7x?',
        hint: 'સમાન પદોના સમાન બીજગણિતીય અવયવો હોય છે। 3xy અને -5xy બંને પાસે xy છે, તેથી તે સમાન પદો છે।'
      },
      hi: {
        question: 'निम्नलिखित में से कौन से समान पद हैं: 3xy, -5xy, 7x?',
        hint: 'समान पदों के समान बीजगणितीय गुणनखंड होते हैं। 3xy और -5xy दोनों में xy है, इसलिए वे समान पद हैं।'
      }
    }
  },
  {
    id: 'alg-ex4',
    type: 'identification',
    difficulty: 'intermediate',
    question: 'What is the result of combining like terms: 4x + 3x?',
    data: {
      visualShapes: ['Circle', 'Rectangle']
    },
    correctAnswer: '7x',
    hint: 'To combine like terms, add their coefficients. 4x + 3x = (4 + 3)x = 7x',
    translations: {
      gu: {
        question: 'સમાન પદોને જોડવાથી પરિણામ શું છે: 4x + 3x?',
        hint: 'સમાન પદોને જોડવા માટે, તેમના ગુણાંક ઉમેરો। 4x + 3x = (4 + 3)x = 7x'
      },
      hi: {
        question: 'समान पदों को जोड़ने का परिणाम क्या है: 4x + 3x?',
        hint: 'समान पदों को जोड़ने के लिए, उनके गुणांक जोड़ें। 4x + 3x = (4 + 3)x = 7x'
      }
    }
  },
  {
    id: 'alg-ex5',
    type: 'verification',
    difficulty: 'advanced',
    question: 'Identify the number of terms in: 2x² - 5xy + 3y - 7',
    data: {
      visualShapes: ['Triangle', 'Rectangle']
    },
    correctAnswer: '4',
    hint: 'Terms are separated by + or - signs. Count: 2x², -5xy, 3y, and -7 = 4 terms.',
    translations: {
      gu: {
        question: 'માં પદોની સંખ્યા ઓળખો: 2x² - 5xy + 3y - 7',
        hint: 'પદો + અથવા - ચિહ્નો દ્વારા અલગ થાય છે. ગણો: 2x², -5xy, 3y, અને -7 = 4 પદો।'
      },
      hi: {
        question: 'में पदों की संख्या पहचानें: 2x² - 5xy + 3y - 7',
        hint: 'पद + या - चिह्नों से अलग होते हैं। गिनें: 2x², -5xy, 3y, और -7 = 4 पद।'
      }
    }
  },
  {
    id: 'alg-ex6',
    type: 'identification',
    difficulty: 'advanced',
    question: 'What type of polynomial is 5x² - 3x + 7?',
    data: {
      visualShapes: ['Circle', 'Square']
    },
    correctAnswer: 'Trinomial',
    hint: 'A trinomial has three terms. This expression has 5x², -3x, and 7 = 3 terms.',
    translations: {
      gu: {
        question: '5x² - 3x + 7 કેવા પ્રકારનો બહુપદી છે?',
        hint: 'ટ્રિનોમિયલમાં ત્રણ પદો હોય છે। આ અભિવ્યક્તિમાં 5x², -3x, અને 7 = 3 પદો છે।'
      },
      hi: {
        question: '5x² - 3x + 7 किस प्रकार का बहुपद है?',
        hint: 'एक त्रिपदी में तीन पद होते हैं। इस व्यंजक में 5x², -3x, और 7 = 3 पद हैं।'
      }
    }
  },
  // Original Geometry Questions
  {
    id: 'ex1',
    type: 'identification',
    difficulty: 'beginner',
    question: 'Which of the following is a net for a cube?',
    data: { 
      shapes: ['Square net', 'Cross-shaped net', 'L-shaped net'], 
      correctType: 'Cross-shaped net',
      visualShapes: ['Square', 'Cross', 'L-shape']
    },
    correctAnswer: 'Cross-shaped net',
    hint: 'A cube net has 6 squares arranged in a cross pattern that can be folded to form a cube.',
    translations: {
      gu: {
        question: 'નીચેનામાંથી કઈ ઘનનો નેટ છે?',
        hint: 'ઘનના નેટમાં 6 ચોરસ ક્રોસ પેટર્નમાં ગોઠવાયેલા હોય છે જે ઘન બનાવવા માટે મુડી શકાય છે।'
      },
      hi: {
        question: 'निम्नलिखित में से कौन सा घन का नेट है?',
        hint: 'घन के नेट में 6 वर्ग क्रॉस पैटर्न में व्यवस्थित होते हैं जो घन बनाने के लिए मुड़ सकते हैं।'
      }
    }
  },
  {
    id: 'ex2',
    type: 'identification',
    difficulty: 'intermediate',
    question: 'What shape will this net form when folded: Circle + Triangle?',
    data: { 
      shapes: ['Cone', 'Cylinder', 'Pyramid'],
      visualShapes: ['Cone', 'Cylinder', 'Pyramid']
    },
    correctAnswer: 'Cone',
    hint: 'A cone net consists of a circular base and a triangular sector that forms the curved surface.',
    translations: {
      gu: {
        question: 'આ નેટ મુડવાથી કઈ આકૃતિ બનશે: વર્તુળ + ત્રિકોણ?',
        hint: 'શંકુના નેટમાં વર્તુળાકાર પાયો અને ત્રિકોણાકાર ક્ષેત્ર હોય છે જે વક્ર સપાટી બનાવે છે।'
      },
      hi: {
        question: 'यह नेट मुड़ने पर कौन सी आकृति बनेगी: वृत्त + त्रिभुज?',
        hint: 'शंकु के नेट में वृत्ताकार आधार और त्रिभुजाकार क्षेत्र होता है जो घुमावदार सतह बनाता है।'
      }
    }
  },
  {
    id: 'ex3',
    type: 'verification',
    difficulty: 'advanced',
    question: 'Which net pattern can make a cuboid? Select all that apply.',
    data: { 
      objects: ['Rectangular cross', 'T-shaped net', 'L-shaped net', 'Single rectangle'],
      visualShapes: ['Cuboid', 'Cuboid', 'Cuboid', 'Rectangle']
    },
    correctAnswer: 'Rectangular cross, T-shaped net, L-shaped net',
    hint: 'A cuboid can have multiple different net patterns, but all must have 6 rectangular faces that can fold to form the cuboid.',
    translations: {
      gu: {
        question: 'કઈ નેટ પેટર્ન ઘનાભ બનાવી શકે છે? બધા લાગુ પડતા પસંદ કરો।',
        hint: 'ઘનાભના ઘણા અલગ-અલગ નેટ પેટર્ન હોઈ શકે છે, પરંતુ બધામાં 6 લંબચોરસ ફલક હોવા જોઈએ જે ઘનાભ બનાવવા માટે મુડી શકે।'
      },
      hi: {
        question: 'कौन सा नेट पैटर्न घनाभ बना सकता है? सभी लागू होने वाले चुनें।',
        hint: 'घनाभ के कई अलग-अलग नेट पैटर्न हो सकते हैं, लेकिन सभी में 6 आयताकार फलक होने चाहिए जो घनाभ बनाने के लिए मुड़ सकें।'
      }
    }
  },
  {
    id: 'ex4',
    type: 'identification',
    difficulty: 'intermediate',
    question: 'What net pattern forms a cylinder when folded?',
    data: { 
      shapes: ['Two circles + rectangle', 'Single circle', 'Rectangle only', 'Triangle + circle'],
      visualShapes: ['Cylinder', 'Circle', 'Rectangle', 'Cone']
    },
    correctAnswer: 'Two circles + rectangle',
    hint: 'A cylinder net consists of two circular bases connected by a rectangular side that forms the curved surface.',
    translations: {
      gu: {
        question: 'કઈ નેટ પેટર્ન મુડવાથી સિલિન્ડર બનાવે છે?',
        hint: 'સિલિન્ડરના નેટમાં બે વર્તુળાકાર પાયા હોય છે જે લંબચોરસ બાજુ દ્વારા જોડાયેલા હોય છે જે વક્ર સપાટી બનાવે છે।'
      },
      hi: {
        question: 'कौन सा नेट पैटर्न मुड़ने पर बेलन बनाता है?',
        hint: 'बेलन के नेट में दो वृत्ताकार आधार होते हैं जो आयताकार भुजा से जुड़े होते हैं जो घुमावदार सतह बनाती है।'
      }
    }
  }
];

// Practice exercises with visual shapes data
const Ch10: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<'demonstration' | 'practice' | 'realworld'>('demonstration');
  const [language, setLanguage] = useState<'en' | 'hi' | 'gu'>(() => {
    const savedLanguage = localStorage.getItem('ch10-language');
    return (savedLanguage as 'en' | 'hi' | 'gu') || 'en';
  });
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [studentAnswer, setStudentAnswer] = useState<string>('');
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [showOverview, setShowOverview] = useState(false);
  const [practiceResults, setPracticeResults] = useState<{
    correct: string[];
    incorrect: string[];
    skipped: string[];
  }>({
    correct: [],
    incorrect: [],
    skipped: []
  });

  const t = translations[language];

  // Handle language change and save to localStorage
  const handleLanguageChange = (newLanguage: 'en' | 'hi' | 'gu') => {
    setLanguage(newLanguage);
    localStorage.setItem('ch10-language', newLanguage);
  };

  // Auto-progression for demonstration mode (DISABLED - not used with AlgebraicExpressionsGuide)

  const getTranslatedText = (item: any, field: string, lang: string) => {
    if (item.translations && item.translations[lang] && item.translations[lang][field]) {
      return item.translations[lang][field];
    }
    return item[field];
  };

  const handleSubmitAnswer = () => {
    const currentExercise = practiceExercises[currentExerciseIndex];
    if (!currentExercise) return;

    const newAttempts = attempts + 1;
    let isCorrect = false;

    if (Array.isArray(currentExercise.correctAnswer)) {
      const studentAnswers = studentAnswer.split(',').map(a => parseInt(a.trim()));
      isCorrect = studentAnswers.length === currentExercise.correctAnswer.length &&
        studentAnswers.every((ans, idx) => ans === (currentExercise.correctAnswer as number[])[idx]);
    } else if (typeof currentExercise.correctAnswer === 'string') {
      isCorrect = studentAnswer.toLowerCase().trim() === currentExercise.correctAnswer.toLowerCase().trim();
    } else {
      isCorrect = parseInt(studentAnswer) === currentExercise.correctAnswer;
    }

    if (isCorrect) {
      setFeedback(t.correct);
      setPracticeResults(prev => {
        const newResults = {
          ...prev,
          correct: [...prev.correct, currentExercise.id]
        };
        
        // Check if all questions are completed
        const totalCompleted = newResults.correct.length + newResults.incorrect.length + newResults.skipped.length;
        if (totalCompleted >= practiceExercises.length - 1) {
          setTimeout(() => setShowOverview(true), 2000);
        }
        
        return newResults;
      });
      
      setTimeout(() => {
        if (currentExerciseIndex < practiceExercises.length - 1) {
          setCurrentExerciseIndex(prev => prev + 1);
        }
        setStudentAnswer('');
        setFeedback('');
        setShowHint(false);
        setAttempts(0);
      }, 1500);
    } else {
      setFeedback(t.incorrect);
      setAttempts(newAttempts);
      if (newAttempts >= 3) {
        setPracticeResults(prev => {
          const newResults = {
            ...prev,
            incorrect: [...prev.incorrect, currentExercise.id]
          };
          
          // Check if all questions are completed
          const totalCompleted = newResults.correct.length + newResults.incorrect.length + newResults.skipped.length;
          if (totalCompleted >= practiceExercises.length - 1) {
            setTimeout(() => setShowOverview(true), 500);
          }
          
          return newResults;
        });
      }
    }
  };

  const handleSkip = () => {
    const currentExercise = practiceExercises[currentExerciseIndex];
    if (!currentExercise) return;

    setPracticeResults(prev => {
      const newResults = {
        ...prev,
        skipped: [...prev.skipped, currentExercise.id]
      };

      // Check if all questions are completed
      const totalCompleted = newResults.correct.length + newResults.incorrect.length + newResults.skipped.length;
      if (totalCompleted >= practiceExercises.length) {
        setTimeout(() => setShowOverview(true), 500);
      }

      return newResults;
    });

    setStudentAnswer('');
    setFeedback('');
    setShowHint(false);
    setAttempts(0);

    if (currentExerciseIndex < practiceExercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    }
  };

  // Expression Value Calculator Component
  const ExpressionValueCalculator: React.FC = () => {
    const [activeSection, setActiveSection] = useState(() => {
      const savedSection = localStorage.getItem('ch10-learn-section');
      return savedSection ? parseInt(savedSection) : 1;
    });
    const [singleVarValue, setSingleVarValue] = useState(2);
    const [negativeVarValue, setNegativeVarValue] = useState(-2);
    const [varA, setVarA] = useState(3);
    const [varB, setVarB] = useState(2);
    const [showSteps, setShowSteps] = useState(false);
    
    // Animation states for each section
    const [showSingleVarTitle, setShowSingleVarTitle] = useState(false);
    const [showSingleVarDesc, setShowSingleVarDesc] = useState(false);
    const [showSingleVarControl, setShowSingleVarControl] = useState(false);
    const [showSingleVarButton, setShowSingleVarButton] = useState(false);
    const [showSingleVarExamples, setShowSingleVarExamples] = useState(false);
    
    // States for tracking which example explanation is visible
    const [currentExplanationIndex, setCurrentExplanationIndex] = useState(-1);
    const [currentNegativeExplanationIndex, setCurrentNegativeExplanationIndex] = useState(-1);
    const [currentTwoVarExplanationIndex, setCurrentTwoVarExplanationIndex] = useState(-1);
    
    const [showNegativeTitle, setShowNegativeTitle] = useState(false);
    const [showNegativeDesc, setShowNegativeDesc] = useState(false);
    const [showNegativeControl, setShowNegativeControl] = useState(false);
    const [showNegativeButton, setShowNegativeButton] = useState(false);
    const [showNegativeExamples, setShowNegativeExamples] = useState(false);
    
    const [showTwoVarTitle, setShowTwoVarTitle] = useState(false);
    const [showTwoVarDesc, setShowTwoVarDesc] = useState(false);
    const [showTwoVarControls, setShowTwoVarControls] = useState(false);
    const [showTwoVarButton, setShowTwoVarButton] = useState(false);
    const [showTwoVarExamples, setShowTwoVarExamples] = useState(false);

    const sections = [
      { id: 1, title: t.singleVarTitle, icon: "🔢" },
      { id: 2, title: t.negativeValuesTitle, icon: "➖" },
      { id: 3, title: t.twoVariablesTitle, icon: "✖️" }
    ];

    const singleVarExpressions = [
      { expr: "x + 4", calc: (x: number) => x + 4, steps: (x: number) => `${x} + 4 = ${x + 4}` },
      { expr: "4x - 3", calc: (x: number) => 4 * x - 3, steps: (x: number) => `4 × ${x} - 3 = ${4 * x} - 3 = ${4 * x - 3}` },
      { expr: "19 - 5x²", calc: (x: number) => 19 - 5 * x * x, steps: (x: number) => `19 - 5 × ${x}² = 19 - 5 × ${x * x} = 19 - ${5 * x * x} = ${19 - 5 * x * x}` }
    ];

    const negativeExpressions = [
      { expr: "5n - 2", calc: (n: number) => 5 * n - 2, steps: (n: number) => `5 × (${n}) - 2 = ${5 * n} - 2 = ${5 * n - 2}` },
      { expr: "5n² + 5n - 2", calc: (n: number) => 5 * n * n + 5 * n - 2, steps: (n: number) => `5 × (${n})² + 5 × (${n}) - 2 = 5 × ${n * n} + ${5 * n} - 2 = ${5 * n * n} + ${5 * n} - 2 = ${5 * n * n + 5 * n - 2}` }
    ];

    const twoVarExpressions = [
      { expr: "a + b", calc: (a: number, b: number) => a + b, steps: (a: number, b: number) => `${a} + ${b} = ${a + b}` },
      { expr: "7a - 4b", calc: (a: number, b: number) => 7 * a - 4 * b, steps: (a: number, b: number) => `7 × ${a} - 4 × ${b} = ${7 * a} - ${4 * b} = ${7 * a - 4 * b}` },
      { expr: "a² + 2ab + b²", calc: (a: number, b: number) => a * a + 2 * a * b + b * b, steps: (a: number, b: number) => `${a}² + 2 × ${a} × ${b} + ${b}² = ${a * a} + ${2 * a * b} + ${b * b} = ${a * a + 2 * a * b + b * b}` }
    ];

    const handleAnimate = () => {
      // Handle Single Variable section
      if (activeSection === 1) {
        setCurrentExplanationIndex(-1);
        setShowSteps(true);
        
        setTimeout(() => setCurrentExplanationIndex(0), 500);
        setTimeout(() => setCurrentExplanationIndex(1), 3000);
        setTimeout(() => setCurrentExplanationIndex(2), 5500);
      }
      
      // Handle Negative Values section
      if (activeSection === 2) {
        setCurrentNegativeExplanationIndex(-1);
        setShowSteps(true);
        
        setTimeout(() => setCurrentNegativeExplanationIndex(0), 500);
        setTimeout(() => setCurrentNegativeExplanationIndex(1), 3000);
      }
      
      // Handle Two Variables section
      if (activeSection === 3) {
        setCurrentTwoVarExplanationIndex(-1);
        setShowSteps(true);
        
        setTimeout(() => setCurrentTwoVarExplanationIndex(0), 500);
        setTimeout(() => setCurrentTwoVarExplanationIndex(1), 3000);
        setTimeout(() => setCurrentTwoVarExplanationIndex(2), 5500);
      }
    };

    // Sequential animations for Single Variable section
    useEffect(() => {
      if (activeSection === 1) {
        // Reset all animation states
        setShowSingleVarTitle(false);
        setShowSingleVarDesc(false);
        setShowSingleVarControl(false);
        setShowSingleVarButton(false);
        setShowSingleVarExamples(false);
        setCurrentExplanationIndex(-1);
        setShowSteps(false);

        // Start sequential animations
        setTimeout(() => setShowSingleVarTitle(true), 400);
        setTimeout(() => setShowSingleVarDesc(true), 1000);
        setTimeout(() => setShowSingleVarControl(true), 1600);
        setTimeout(() => setShowSingleVarButton(true), 2200);
        setTimeout(() => setShowSingleVarExamples(true), 2800);
      }
    }, [activeSection]);

    // Sequential animations for Negative Values section
    useEffect(() => {
      if (activeSection === 2) {
        // Reset all animation states
        setShowNegativeTitle(false);
        setShowNegativeDesc(false);
        setShowNegativeControl(false);
        setShowNegativeButton(false);
        setShowNegativeExamples(false);
        setCurrentNegativeExplanationIndex(-1);
        setShowSteps(false);

        // Start sequential animations
        setTimeout(() => setShowNegativeTitle(true), 400);
        setTimeout(() => setShowNegativeDesc(true), 1000);
        setTimeout(() => setShowNegativeControl(true), 1600);
        setTimeout(() => setShowNegativeButton(true), 2200);
        setTimeout(() => setShowNegativeExamples(true), 2800);
      }
    }, [activeSection]);

    // Sequential animations for Two Variables section
    useEffect(() => {
      if (activeSection === 3) {
        // Reset all animation states
        setShowTwoVarTitle(false);
        setShowTwoVarDesc(false);
        setShowTwoVarControls(false);
        setShowTwoVarButton(false);
        setShowTwoVarExamples(false);
        setCurrentTwoVarExplanationIndex(-1);
        setShowSteps(false);

        // Start sequential animations
        setTimeout(() => setShowTwoVarTitle(true), 400);
        setTimeout(() => setShowTwoVarDesc(true), 1000);
        setTimeout(() => setShowTwoVarControls(true), 1600);
        setTimeout(() => setShowTwoVarButton(true), 2200);
        setTimeout(() => setShowTwoVarExamples(true), 2800);
      }
    }, [activeSection]);

    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-purple-50 to-pink-50 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-purple-500 rounded-full mb-4">
              <Calculator className="text-white" size={32} />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              {t.findingValueTitle}
            </h1>
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  setActiveSection(section.id);
                  localStorage.setItem('ch10-learn-section', section.id.toString());
                  setShowSteps(false);
                }}
                className={`p-4 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                  activeSection === section.id
                    ? 'bg-gradient-to-r from-teal-500 to-purple-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 shadow hover:shadow-md'
                }`}
              >
                <div className="text-2xl mb-2">{section.icon}</div>
                <div className="font-semibold text-sm">{section.title}</div>
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 min-h-96">
            {/* Single Variable Section */}
            {activeSection === 1 && (
              <div className="space-y-6">
                {/* Title */}
                <div className={`transition-all duration-700 ${showSingleVarTitle ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">{t.singleVarTitle}</h2>
                </div>
                
                {/* Description */}
                <div className={`bg-teal-50 p-6 rounded-lg transition-all duration-700 ${showSingleVarDesc ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                  <p className="text-lg text-gray-700" dangerouslySetInnerHTML={{ __html: t.singleVarDesc }} />
                </div>

                {/* Control */}
                <div className={`bg-white border-2 border-teal-200 rounded-lg p-6 transition-all duration-700 ${showSingleVarControl ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    {t.setValueOf} x: {singleVarValue}
                  </label>
                  <input
                    type="range"
                    min="-5"
                    max="10"
                    value={singleVarValue}
                    onChange={(e) => {
                      setSingleVarValue(Number(e.target.value));
                      setShowSteps(false);
                      setCurrentExplanationIndex(-1);
                    }}
                    className="w-full h-2 bg-teal-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>-5</span>
                    <span>10</span>
                  </div>
                </div>

                {/* Button */}
                <div className={`transition-all duration-700 ${showSingleVarButton ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                  <button
                    onClick={handleAnimate}
                    className="w-full bg-gradient-to-r from-teal-500 to-purple-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                  >
                    <PlayCircle size={20} />
                    {t.calculateAllExpressions}
                  </button>
                </div>

                {/* Examples */}
                <div className={`grid gap-4 transition-all duration-700 ${showSingleVarExamples ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                  {singleVarExpressions.map((item, idx) => (
                    <div
                      key={idx}
                      className={`bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border-2 border-purple-200 transition-all duration-700 ${
                        currentExplanationIndex === idx ? 'scale-105 shadow-lg border-purple-500' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xl font-mono font-bold text-purple-800">{item.expr}</span>
                        {currentExplanationIndex === idx && (
                          <CheckCircle className="text-green-500 animate-bounce" size={24} />
                        )}
                      </div>
                      {currentExplanationIndex === idx && showSteps && (
                        <div className="bg-white p-4 rounded-lg animate-fade-in">
                          <p className="text-gray-600 mb-2">{t.substituting} x = {singleVarValue}:</p>
                          <p className="font-mono text-lg text-gray-800">{item.steps(singleVarValue)}</p>
                          <div className="mt-3 pt-3 border-t-2 border-purple-200">
                            <span className="text-2xl font-bold text-purple-600">
                              {t.result} = {item.calc(singleVarValue)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Negative Values Section */}
            {activeSection === 2 && (
              <div className="space-y-6">
                {/* Title */}
                <div className={`transition-all duration-700 ${showNegativeTitle ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">{t.negativeValuesTitle}</h2>
                </div>
                
                {/* Description */}
                <div className={`bg-red-50 p-6 rounded-lg border-l-4 border-red-500 transition-all duration-700 ${showNegativeDesc ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                  <p className="text-lg text-gray-700" dangerouslySetInnerHTML={{ __html: t.negativeValuesDesc }} />
                  <p className="text-gray-600 mt-2">{t.negativeEx}</p>
                </div>

                {/* Control */}
                <div className={`bg-white border-2 border-red-200 rounded-lg p-6 transition-all duration-700 ${showNegativeControl ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    {t.setValueOf} n: {negativeVarValue}
                  </label>
                  <input
                    type="range"
                    min="-10"
                    max="5"
                    value={negativeVarValue}
                    onChange={(e) => {
                      setNegativeVarValue(Number(e.target.value));
                      setShowSteps(false);
                      setCurrentNegativeExplanationIndex(-1);
                    }}
                    className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>-10</span>
                    <span>5</span>
                  </div>
                </div>

                {/* Button */}
                <div className={`transition-all duration-700 ${showNegativeButton ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                  <button
                    onClick={handleAnimate}
                    className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                  >
                    <PlayCircle size={20} />
                    {t.calculateAllExpressions}
                  </button>
                </div>

                {/* Examples */}
                <div className={`grid gap-4 transition-all duration-700 ${showNegativeExamples ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                  {negativeExpressions.map((item, idx) => (
                    <div
                      key={idx}
                      className={`bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg border-2 border-red-200 transition-all duration-700 ${
                        currentNegativeExplanationIndex === idx ? 'scale-105 shadow-lg border-red-500' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xl font-mono font-bold text-red-800">{item.expr}</span>
                        {currentNegativeExplanationIndex === idx && (
                          <CheckCircle className="text-green-500 animate-bounce" size={24} />
                        )}
                      </div>
                      {currentNegativeExplanationIndex === idx && showSteps && (
                        <div className="bg-white p-4 rounded-lg animate-fade-in">
                          <p className="text-gray-600 mb-2">{t.substituting} n = {negativeVarValue}:</p>
                          <p className="font-mono text-lg text-gray-800">{item.steps(negativeVarValue)}</p>
                          <div className="mt-3 pt-3 border-t-2 border-red-200">
                            <span className="text-2xl font-bold text-red-600">
                              {t.result} = {item.calc(negativeVarValue)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Two Variables Section */}
            {activeSection === 3 && (
              <div className="space-y-6">
                {/* Title */}
                <div className={`transition-all duration-700 ${showTwoVarTitle ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">{t.twoVariablesTitle}</h2>
                </div>
                
                {/* Description */}
                <div className={`bg-green-50 p-6 rounded-lg border-l-4 border-green-500 transition-all duration-700 ${showTwoVarDesc ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                  <p className="text-lg text-gray-700" dangerouslySetInnerHTML={{ __html: t.twoVarDesc }} />
                </div>

                {/* Controls */}
                <div className={`grid md:grid-cols-2 gap-6 transition-all duration-700 ${showTwoVarControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                  <div className="bg-white border-2 border-green-200 rounded-lg p-6">
                    <label className="block text-lg font-semibold text-gray-700 mb-3">
                      {t.setValueOf} a: {varA}
                    </label>
                    <input
                      type="range"
                      min="-5"
                      max="10"
                      value={varA}
                      onChange={(e) => {
                        setVarA(Number(e.target.value));
                        setShowSteps(false);
                        setCurrentTwoVarExplanationIndex(-1);
                      }}
                      className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div className="bg-white border-2 border-blue-200 rounded-lg p-6">
                    <label className="block text-lg font-semibold text-gray-700 mb-3">
                      {t.setValueOf} b: {varB}
                    </label>
                    <input
                      type="range"
                      min="-5"
                      max="10"
                      value={varB}
                      onChange={(e) => {
                        setVarB(Number(e.target.value));
                        setShowSteps(false);
                        setCurrentTwoVarExplanationIndex(-1);
                      }}
                      className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Button */}
                <div className={`transition-all duration-700 ${showTwoVarButton ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                  <button
                    onClick={handleAnimate}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                  >
                    <PlayCircle size={20} />
                    {t.calculateAllExpressions}
                  </button>
                </div>

                {/* Examples */}
                <div className={`grid gap-4 transition-all duration-700 ${showTwoVarExamples ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                  {twoVarExpressions.map((item, idx) => (
                    <div
                      key={idx}
                      className={`bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border-2 border-green-200 transition-all duration-700 ${
                        currentTwoVarExplanationIndex === idx ? 'scale-105 shadow-lg border-green-500' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xl font-mono font-bold text-green-800">{item.expr}</span>
                        {currentTwoVarExplanationIndex === idx && (
                          <CheckCircle className="text-green-500 animate-bounce" size={24} />
                        )}
                      </div>
                      {currentTwoVarExplanationIndex === idx && showSteps && (
                        <div className="bg-white p-4 rounded-lg animate-fade-in">
                          <p className="text-gray-600 mb-2">{t.substituting} a = {varA}, b = {varB}:</p>
                          <p className="font-mono text-lg text-gray-800">{item.steps(varA, varB)}</p>
                          <div className="mt-3 pt-3 border-t-2 border-green-200">
                            <span className="text-2xl font-bold text-green-600">
                              {t.result} = {item.calc(varA, varB)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <style>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fade-in {
            animation: fade-in 0.5s ease-out;
          }

          input[type="range"]::-webkit-slider-thumb {
            appearance: none;
            width: 20px;
            height: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            cursor: pointer;
            border-radius: 50%;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }

          input[type="range"]::-moz-range-thumb {
            width: 20px;
            height: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            cursor: pointer;
            border-radius: 50%;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            border: none;
          }
        `}</style>
      </div>
    );
  };

  const renderDemonstrationMode = () => (
    <div className="space-y-6">
      <ExpressionValueCalculator />
    </div>
  );

  const renderPracticeMode = () => {
    const currentExercise = practiceExercises[currentExerciseIndex];
    if (!currentExercise) return null;

    return (
      <>
        <div className="space-y-6">
        {/* Exercise content */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-6 md:p-8">
          <div>
            {/* Left - Question */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-orange-200">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-5xl">📖</span>
                <h3 className="text-2xl md:text-3xl font-bold text-gradient-teal-purple">
                  {t.practiceExercises}
                </h3>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-300">
                  <h4 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
                    <span className="text-2xl">📋</span>
                    {t.practiceExercises}
                  </h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {getTranslatedText(currentExercise, 'question', language)}
                  </p>
                  
                  {/* Difficulty indicator */}
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    currentExercise.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                    currentExercise.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {t[currentExercise.difficulty]}
                  </span>
                </div>

                {/* Answer Input */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-300">
                  <h4 className="font-bold text-lg mb-3 text-gray-800 flex items-center gap-2">
                    <span className="text-2xl">❓</span>
                    {t.yourAnswer}
                  </h4>
                  <div className="bg-white rounded-xl p-4 shadow-md">
                    <input
                      type="text"
                      value={studentAnswer}
                      onChange={(e) => setStudentAnswer(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSubmitAnswer();
                        }
                      }}
                      placeholder={t.enterAnswer}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 text-lg"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap justify-center gap-4">
                  {!showHint && (
                    <button
                      onClick={() => setShowHint(true)}
                      className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-colors font-medium shadow-lg hover:scale-105"
                    >
                      <Lightbulb className="w-5 h-5" />
                      {t.hint}
                    </button>
                  )}
                  
                  <button
                    onClick={handleSkip}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors font-medium shadow-lg hover:scale-105"
                  >
                    <XCircle className="w-5 h-5" />
                    {t.skip}
                  </button>

                  <button
                    onClick={handleSubmitAnswer}
                    className="flex items-center gap-2 px-8 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-colors font-medium shadow-lg hover:scale-105"
                  >
                    <CheckCircle className="w-5 h-5" />
                    {t.submit}
                  </button>
                </div>

                {/* Hint Display */}
                {showHint && (
                  <div className="hint-display p-6 bg-yellow-50 border-2 border-yellow-200 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">💡</div>
                      <div className="text-lg text-yellow-800 font-medium">
                        {getTranslatedText(currentExercise, 'hint', language)}
                      </div>
                    </div>
                  </div>
                )}

                {/* Feedback */}
                {feedback && (
                  <div className={`feedback p-6 rounded-2xl border-2 flex items-center justify-center gap-4 ${
                    feedback === t.correct 
                      ? 'bg-green-50 border-green-200 text-green-800'
                      : 'bg-red-50 border-red-200 text-red-700'
                  }`}>
                    {feedback === t.correct ? (
                      <>
                        <CheckCircle className="w-8 h-8" />
                        <div className="text-3xl">🎉</div>
                        <div className="text-2xl font-bold">{feedback}</div>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-8 h-8" />
                        <div className="text-3xl">🤔</div>
                        <div className="text-2xl font-bold">{feedback}</div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Overview Modal */}
      {showOverview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                  📊 {t.practiceSummary}
                </h2>
                <button
                  onClick={() => setShowOverview(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  {t.close}
                </button>
              </div>

              {/* Stats Summary */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-xl border-2 border-green-200">
                  <div className="text-3xl font-bold text-green-600">
                    {practiceResults.correct.length}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{t.overviewCorrectAnswers}</div>
                </div>
                <div className="bg-red-50 p-4 rounded-xl border-2 border-red-200">
                  <div className="text-3xl font-bold text-red-600">
                    {practiceResults.incorrect.length}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{t.overviewIncorrectAnswers}</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-xl border-2 border-yellow-200">
                  <div className="text-3xl font-bold text-yellow-600">
                    {practiceResults.skipped.length}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{t.skippedQuestions}</div>
                </div>
              </div>

              {/* Accuracy */}
              <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-blue-800">{t.overviewAccuracy}</div>
                    <div className="text-4xl font-bold text-blue-600 mt-2">
                      {practiceResults.correct.length + practiceResults.incorrect.length + practiceResults.skipped.length > 0
                        ? Math.round((practiceResults.correct.length / (practiceResults.correct.length + practiceResults.incorrect.length + practiceResults.skipped.length)) * 100)
                        : 0}%
                    </div>
                  </div>
                  <div className="text-6xl">🎯</div>
                </div>
              </div>

              {/* Detailed Lists */}
              <div className="grid md:grid-cols-3 gap-4">
                {/* Correct Answers */}
                <div className="bg-green-50 p-4 rounded-xl border-2 border-green-200">
                  <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                    ✅ {t.overviewCorrectAnswers}
                  </h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {practiceResults.correct.length > 0 ? (
                      practiceResults.correct.map((id, idx) => (
                        <div key={idx} className="bg-white p-2 rounded-lg text-sm text-gray-700">
                          {practiceExercises.find(ex => ex.id === id)?.question || id}
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500 text-sm">{t.noCorrectYet}</div>
                    )}
                  </div>
                </div>

                {/* Incorrect Answers */}
                <div className="bg-red-50 p-4 rounded-xl border-2 border-red-200">
                  <h3 className="font-bold text-red-800 mb-3 flex items-center gap-2">
                    ❌ {t.overviewIncorrectAnswers}
                  </h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {practiceResults.incorrect.length > 0 ? (
                      practiceResults.incorrect.map((id, idx) => (
                        <div key={idx} className="bg-white p-2 rounded-lg text-sm text-gray-700">
                          {practiceExercises.find(ex => ex.id === id)?.question || id}
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500 text-sm">{t.noIncorrectYet}</div>
                    )}
                  </div>
                </div>

                {/* Skipped Questions */}
                <div className="bg-yellow-50 p-4 rounded-xl border-2 border-yellow-200">
                  <h3 className="font-bold text-yellow-800 mb-3 flex items-center gap-2">
                    ⏭️ {t.skippedQuestions}
                  </h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {practiceResults.skipped.length > 0 ? (
                      practiceResults.skipped.map((id, idx) => (
                        <div key={idx} className="bg-white p-2 rounded-lg text-sm text-gray-700">
                          {practiceExercises.find(ex => ex.id === id)?.question || id}
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500 text-sm">{t.noSkippedYet}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </>
    );
  };

    const renderRealWorldApplications = () => (
    <div className="space-y-6">
      {/* Applications content */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-6 md:p-8">
        {/* Applications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Packaging Design */}
          <div className="application-card bg-white rounded-3xl shadow-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-teal-200">
            <div className="text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{t.architecture}</h3>
              <p className="text-gray-600 mb-4">
                {t.architectureDesc}
              </p>
              <div className="bg-teal-50 p-4 rounded-xl">
                <svg width="100" height="80" viewBox="0 0 100 80" className="mx-auto">
                  <rect x="20" y="20" width="60" height="40" fill="#E5E7EB" stroke="#14b8a6" strokeWidth="2"/>
                  <rect x="10" y="30" width="20" height="20" fill="#CCFBF1" stroke="#0d9488" strokeWidth="2"/>
                  <rect x="70" y="30" width="20" height="20" fill="#CCFBF1" stroke="#0d9488" strokeWidth="2"/>
                  <text x="45" y="15" className="text-xs font-bold fill-teal-600">{t.netPattern}</text>
                </svg>
              </div>
            </div>
          </div>

          {/* Architecture */}
          <div className="application-card bg-white rounded-3xl shadow-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-purple-200">
            <div className="text-center">
              <div className="text-6xl mb-4">🏗️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{t.navigation}</h3>
              <p className="text-gray-600 mb-4">
                {t.navigationDesc}
              </p>
              <div className="bg-purple-50 p-4 rounded-xl">
                <svg width="100" height="80" viewBox="0 0 100 80" className="mx-auto">
                  <polygon points="50,20 20,60 80,60" fill="#F3E8FF" stroke="#a855f7" strokeWidth="2"/>
                  <rect x="30" y="40" width="40" height="20" fill="#E0E7FF" stroke="#7c3aed" strokeWidth="2"/>
                  <text x="45" y="15" className="text-xs font-bold fill-purple-600">{t.threeDtoTwoD}</text>
                </svg>
              </div>
            </div>
          </div>

          {/* Manufacturing */}
          <div className="application-card bg-white rounded-3xl shadow-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-indigo-200">
            <div className="text-center">
              <div className="text-6xl mb-4">⚙️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{t.engineering}</h3>
              <p className="text-gray-600 mb-4">
                {t.engineeringDesc}
              </p>
              <div className="bg-indigo-50 p-4 rounded-xl">
                <svg width="100" height="80" viewBox="0 0 100 80" className="mx-auto">
                  <rect x="20" y="30" width="60" height="40" fill="#E0E7FF" stroke="#6366F1" strokeWidth="2"/>
                  <rect x="10" y="20" width="20" height="20" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2"/>
                  <rect x="70" y="20" width="20" height="20" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2"/>
                  <text x="45" y="15" className="text-xs font-bold fill-indigo-600">{t.assembly}</text>
                </svg>
              </div>
            </div>
          </div>

          {/* Origami & Crafts */}
          <div className="application-card bg-white rounded-3xl shadow-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-pink-200">
            <div className="text-center">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{t.artDesign}</h3>
              <p className="text-gray-600 mb-4">
                {t.artDesignDesc}
              </p>
              <div className="bg-pink-50 p-4 rounded-xl">
                <svg width="100" height="80" viewBox="0 0 100 80" className="mx-auto">
                  <polygon points="50,20 20,50 50,80 80,50" fill="#FCE7F3" stroke="#EC4899" strokeWidth="2"/>
                  <circle cx="50" cy="50" r="15" fill="#FDF2F8" stroke="#DB2777" strokeWidth="2"/>
                  <text x="45" y="15" className="text-xs font-bold fill-pink-600">{t.paperArt}</text>
                </svg>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="application-card bg-white rounded-3xl shadow-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-emerald-200">
            <div className="text-center">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{t.surveying}</h3>
              <p className="text-gray-600 mb-4">
                {t.surveyingDesc}
              </p>
              <div className="bg-emerald-50 p-4 rounded-xl">
                <svg width="100" height="80" viewBox="0 0 100 80" className="mx-auto">
                  <rect x="30" y="20" width="40" height="40" fill="#D1FAE5" stroke="#10B981" strokeWidth="2"/>
                  <polygon points="50,10 30,30 70,30" fill="#A7F3D0" stroke="#059669" strokeWidth="2"/>
                  <text x="45" y="75" className="text-xs font-bold fill-emerald-600">{t.learningLabel}</text>
                </svg>
              </div>
            </div>
          </div>

          {/* 3D Modeling */}
          <div className="application-card bg-white rounded-3xl shadow-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-cyan-200">
            <div className="text-center">
              <div className="text-6xl mb-4">💻</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{t.computerGraphics}</h3>
              <p className="text-gray-600 mb-4">
                {t.computerGraphicsDesc}
              </p>
              <div className="bg-cyan-50 p-4 rounded-xl">
                <svg width="100" height="80" viewBox="0 0 100 80" className="mx-auto">
                  <rect x="20" y="30" width="60" height="40" fill="#E0F2FE" stroke="#06B6D4" strokeWidth="2"/>
                  <rect x="10" y="20" width="20" height="20" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2"/>
                  <rect x="70" y="20" width="20" height="20" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2"/>
                  <text x="45" y="15" className="text-xs font-bold fill-cyan-600">{t.threeDModel}</text>
                </svg>
              </div>
            </div>
          </div>

          {/* Algebra: Shopping & Pricing */}
          <div className="application-card bg-white rounded-3xl shadow-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-blue-200">
            <div className="text-center">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{t.shoppingPricing}</h3>
              <p className="text-gray-600 mb-4">
                {t.shoppingPricingDesc}
              </p>
              <div className="bg-blue-50 p-4 rounded-xl">
                <div className="font-mono text-lg font-bold text-blue-700">{t.costFormula}</div>
              </div>
            </div>
          </div>

          {/* Algebra: Budget Planning */}
          <div className="application-card bg-white rounded-3xl shadow-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-emerald-200">
            <div className="text-center">
              <div className="text-6xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{t.budgetPlanning}</h3>
              <p className="text-gray-600 mb-4">
                {t.budgetPlanningDesc}
              </p>
              <div className="bg-emerald-50 p-4 rounded-xl">
                <div className="font-mono text-lg font-bold text-emerald-700">{t.incomeFormula}</div>
              </div>
            </div>
          </div>

          {/* Algebra: Distance & Speed */}
          <div className="application-card bg-white rounded-3xl shadow-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-amber-200">
            <div className="text-center">
              <div className="text-6xl mb-4">🚗</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{t.distanceCalculation}</h3>
              <p className="text-gray-600 mb-4">
                {t.distanceCalculationDesc}
              </p>
              <div className="bg-amber-50 p-4 rounded-xl">
                <div className="font-mono text-lg font-bold text-amber-700">{t.distanceFormula}</div>
              </div>
            </div>
          </div>

          {/* Temperature Conversion */}
          <div className="application-card bg-white rounded-3xl shadow-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-red-200">
            <div className="text-center">
              <div className="text-6xl mb-4">🌡️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{t.temperatureConversion}</h3>
              <p className="text-gray-600 mb-4">
                {t.temperatureConversionDesc}
              </p>
              <div className="bg-red-50 p-4 rounded-xl">
                <div className="font-mono text-lg font-bold text-red-700">{t.temperatureFormula}</div>
              </div>
            </div>
          </div>

          {/* Profit and Loss */}
          <div className="application-card bg-white rounded-3xl shadow-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-green-200">
            <div className="text-center">
              <div className="text-6xl mb-4">📈</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{t.profitLoss}</h3>
              <p className="text-gray-600 mb-4">
                {t.profitLossDesc}
              </p>
              <div className="bg-green-50 p-4 rounded-xl">
                <div className="font-mono text-lg font-bold text-green-700">{t.profitFormula}</div>
              </div>
            </div>
          </div>

          {/* Age Calculation */}
          <div className="application-card bg-white rounded-3xl shadow-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-indigo-200">
            <div className="text-center">
              <div className="text-6xl mb-4">🎂</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{t.ageCalculation}</h3>
              <p className="text-gray-600 mb-4">
                {t.ageCalculationDesc}
              </p>
              <div className="bg-indigo-50 p-4 rounded-xl">
                <p className="text-sm text-gray-700">{t.ageExample}</p>
              </div>
            </div>
          </div>

          {/* Area & Perimeter */}
          <div className="application-card bg-white rounded-3xl shadow-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-blue-200">
            <div className="text-center">
              <div className="text-6xl mb-4">📐</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{t.areaPerimeter}</h3>
              <p className="text-gray-600 mb-4">
                {t.areaPerimeterDesc}
              </p>
              <div className="bg-blue-50 p-4 rounded-xl">
                <div className="font-mono text-lg font-bold text-blue-700">{t.areaFormula}</div>
              </div>
            </div>
          </div>

          {/* Volume Calculation */}
          <div className="application-card bg-white rounded-3xl shadow-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-purple-200">
            <div className="text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{t.volumeCalculation}</h3>
              <p className="text-gray-600 mb-4">
                {t.volumeCalculationDesc}
              </p>
              <div className="bg-purple-50 p-4 rounded-xl">
                <div className="font-mono text-lg font-bold text-purple-700">{t.volumeFormula}</div>
              </div>
            </div>
          </div>

          {/* Discount & Pricing */}
          <div className="application-card bg-white rounded-3xl shadow-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-rose-200">
            <div className="text-center">
              <div className="text-6xl mb-4">🏷️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{t.discountPricing}</h3>
              <p className="text-gray-600 mb-4">
                {t.discountPricingDesc}
              </p>
              <div className="bg-rose-50 p-4 rounded-xl">
                <div className="font-mono text-lg font-bold text-rose-700">{t.discountFormula}</div>
              </div>
            </div>
          </div>

          {/* Electricity Bill */}
          <div className="application-card bg-white rounded-3xl shadow-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-yellow-200">
            <div className="text-center">
              <div className="text-6xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{t.electricityBill}</h3>
              <p className="text-gray-600 mb-4">
                {t.electricityBillDesc}
              </p>
              <div className="bg-yellow-50 p-4 rounded-xl">
                <div className="font-mono text-lg font-bold text-yellow-700">{t.electricityFormula}</div>
              </div>
            </div>
          </div>

          {/* Compound Interest */}
          <div className="application-card bg-white rounded-3xl shadow-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-teal-200">
            <div className="text-center">
              <div className="text-6xl mb-4">💹</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{t.compoundInterest}</h3>
              <p className="text-gray-600 mb-4">
                {t.compoundInterestDesc}
              </p>
              <div className="bg-teal-50 p-4 rounded-xl">
                <div className="font-mono text-lg font-bold text-teal-700">{t.compoundFormula}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-purple-50 to-pink-50">
      {/* Header with Navigation */}
      <header className="bg-gradient-to-r from-teal-600 via-purple-600 to-pink-600 text-white shadow-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            {/* Logo/Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
              📚 {t.chapterTitle}
            </h1>
            
            {/* Navigation Buttons */}
            <nav className="flex items-center gap-3">
              <button
                onClick={() => setCurrentMode('demonstration')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                  currentMode === 'demonstration'
                    ? 'bg-white text-teal-600 shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                📚 {t.learning}
              </button>
              <button
                onClick={() => setCurrentMode('practice')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                  currentMode === 'practice'
                    ? 'bg-white text-teal-600 shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                ✍️ {t.practice}
              </button>
              <button
                onClick={() => setCurrentMode('realworld')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                  currentMode === 'realworld'
                    ? 'bg-white text-teal-600 shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                🌍 {t.realWorldApplications}
              </button>
            </nav>

            {/* Language Selector */}
            <div className="flex items-center gap-3">
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value as 'en' | 'hi' | 'gu')}
                className="px-3 py-2 rounded-lg bg-white text-gray-800 font-medium shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="gu">ગુજરાતી</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Main Content */}
        <div className="main-content">
          {currentMode === 'demonstration' && renderDemonstrationMode()}
          {currentMode === 'practice' && renderPracticeMode()}
          {currentMode === 'realworld' && renderRealWorldApplications()}
        </div>

      </main>
    </div>
  );
};

export default Ch10;
