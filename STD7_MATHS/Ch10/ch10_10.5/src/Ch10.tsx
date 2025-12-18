import React, { useState, useEffect } from 'react';
import { Lightbulb, CheckCircle, XCircle, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';

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
    // Real World Polynomial Examples
    monomialExample: 'Monomial: Area Calculation',
    monomialExampleDesc: 'Calculate area of a square: A = s². The price per item: p. These single-term expressions are monomials.',
    binomialExample: 'Binomial: Profit Calculation',
    binomialExampleDesc: 'Profit = Revenue - Cost: P = R - C. Distance with constant: d = 60t + 5. Two-term expressions are binomials.',
    trinomialExample: 'Trinomial: Quadratic Models',
    trinomialExampleDesc: 'Projectile motion: h = -16t² + 48t + 64. Temperature model: T = 3x² - 2x + 10. Three terms make trinomials.',
    polynomialExample: 'Polynomial: Complex Formulas',
    polynomialExampleDesc: 'Scientific formulas often use polynomials: Energy = mc² + ½mv². Multiple terms solve real problems.',
    areaFormula: 'A = s² (Monomial)',
    profitFormula: 'P = R - C (Binomial)',
    motionFormula: 'h = -16t² + 48t + 64 (Trinomial)',
    energyFormula: 'E = mc² + ½mv² (Polynomial)',
    oneTermNote: 'One term = Monomial',
    twoTermsNote: 'Two terms = Binomial',
    threeTermsNote: 'Three terms = Trinomial',
    multipleTermsNote: 'Multiple terms = Polynomial',
    // Polynomial Explorer translations
    polyExplorerTitle: 'Polynomial Types Explorer',
    polyExplorerSubtitle: 'Learn about Monomials, Binomials, Trinomials & Polynomials',
    monomialDef: 'An expression with only ONE term',
    binomialDef: 'An expression containing TWO unlike terms',
    trinomialDef: 'An expression containing THREE terms',
    polynomialDef: 'An expression with ONE or MORE terms',
    numberOfTerms: 'Number of terms',
    polyImportant: 'Important',
    polyImportantNote: 'All monomials, binomials, and trinomials are polynomials! A polynomial is the general term for any expression with one or more terms.',
    polyValid: '✓ Valid',
    polyInvalid: '✗ Invalid',
    monomialReason1: 'This is ONE term, not a binomial',
    binomialReason1: 'Contains 3 terms, not 2',
    trinomialReason1: 'x and 5x are like terms',
    polynomialReason1: 'Monomial is a polynomial',
    polynomialReason2: 'Binomial is a polynomial',
    polynomialReason3: 'Trinomial is a polynomial',
    polynomialReason4: '4 terms is also a polynomial',
    examples: 'Examples'
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
    // Real World Polynomial Examples
    monomialExample: 'एकपद: क्षेत्रफल गणना',
    monomialExampleDesc: 'वर्ग का क्षेत्रफल: A = s². प्रति वस्तु मूल्य: p. ये एक-पदीय व्यंजक एकपद हैं।',
    binomialExample: 'द्विपद: लाभ गणना',
    binomialExampleDesc: 'लाभ = आय - लागत: P = R - C. नियतांक के साथ दूरी: d = 60t + 5. दो पदों वाले व्यंजक द्विपद हैं।',
    trinomialExample: 'त्रिपद: द्विघात मॉडल',
    trinomialExampleDesc: 'प्रक्षेप्य गति: h = -16t² + 48t + 64. तापमान मॉडल: T = 3x² - 2x + 10. तीन पद त्रिपद बनाते हैं।',
    polynomialExample: 'बहुपद: जटिल सूत्र',
    polynomialExampleDesc: 'वैज्ञानिक सूत्र अक्सर बहुपदों का उपयोग करते हैं: ऊर्जा = mc² + ½mv². कई पद वास्तविक समस्याओं का समाधान करते हैं।',
    areaFormula: 'A = s² (एकपद)',
    profitFormula: 'P = R - C (द्विपद)',
    motionFormula: 'h = -16t² + 48t + 64 (त्रिपद)',
    energyFormula: 'E = mc² + ½mv² (बहुपद)',
    oneTermNote: 'एक पद = एकपद',
    twoTermsNote: 'दो पद = द्विपद',
    threeTermsNote: 'तीन पद = त्रिपद',
    multipleTermsNote: 'कई पद = बहुपद',
    // Polynomial Explorer translations
    polyExplorerTitle: 'बहुपद प्रकार अन्वेषक',
    polyExplorerSubtitle: 'एकपद, द्विपद, त्रिपद और बहुपद के बारे में जानें',
    monomialDef: 'केवल एक पद वाला व्यंजक',
    binomialDef: 'दो असमान पदों वाला व्यंजक',
    trinomialDef: 'तीन पदों वाला व्यंजक',
    polynomialDef: 'एक या अधिक पदों वाला व्यंजक',
    numberOfTerms: 'पदों की संख्या',
    polyImportant: 'महत्वपूर्ण',
    polyImportantNote: 'सभी एकपद, द्विपद, और त्रिपद बहुपद हैं! बहुपद एक या अधिक पदों वाले किसी भी व्यंजक के लिए सामान्य शब्द है।',
    polyValid: '✓ वैध',
    polyInvalid: '✗ अमान्य',
    monomialReason1: 'यह एक पद है, द्विपद नहीं',
    binomialReason1: 'इसमें 3 पद हैं, 2 नहीं',
    trinomialReason1: 'x और 5x समान पद हैं',
    polynomialReason1: 'एकपद एक बहुपद है',
    polynomialReason2: 'द्विपद एक बहुपद है',
    polynomialReason3: 'त्रिपद एक बहुपद है',
    polynomialReason4: '4 पद भी एक बहुपद है',
    examples: 'उदाहरण'
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
    // Real World Polynomial Examples
    monomialExample: 'એકપદ: ક્ષેત્રફળ ગણતરી',
    monomialExampleDesc: 'ચોરસનું ક્ષેત્રફળ: A = s². વસ્તુ દીઠ કિંમત: p. આ એક-પદીય અભિવ્યક્તિઓ એકપદ છે।',
    binomialExample: 'દ્વિપદ: નફો ગણતરી',
    binomialExampleDesc: 'નફો = આવક - ખર્ચ: P = R - C. અચળ સાથે અંતર: d = 60t + 5. બે પદોની અભિવ્યક્તિઓ દ્વિપદ છે।',
    trinomialExample: 'ત્રિપદ: દ્વિઘાત મોડલ્સ',
    trinomialExampleDesc: 'પ્રક્ષિપ્ત ગતિ: h = -16t² + 48t + 64. તાપમાન મોડલ: T = 3x² - 2x + 10. ત્રણ પદો ત્રિપદ બનાવે છે।',
    polynomialExample: 'બહુપદ: જટિલ સૂત્રો',
    polynomialExampleDesc: 'વૈજ્ઞાનિક સૂત્રો ઘણીવાર બહુપદનો ઉપયોગ કરે છે: ઊર્જા = mc² + ½mv². અનેક પદો વાસ્તવિક સમસ્યાઓ ઉકેલે છે।',
    areaFormula: 'A = s² (એકપદ)',
    profitFormula: 'P = R - C (દ્વિપદ)',
    motionFormula: 'h = -16t² + 48t + 64 (ત્રિપદ)',
    energyFormula: 'E = mc² + ½mv² (બહુપદ)',
    oneTermNote: 'એક પદ = એકપદ',
    twoTermsNote: 'બે પદો = દ્વિપદ',
    threeTermsNote: 'ત્રણ પદો = ત્રિપદ',
    multipleTermsNote: 'અનેક પદો = બહુપદ',
    // Polynomial Explorer translations
    polyExplorerTitle: 'બહુપદ પ્રકાર અન્વેષક',
    polyExplorerSubtitle: 'એકપદ, દ્વિપદ, ત્રિપદ અને બહુપદ વિશે શીખો',
    monomialDef: 'ફક્ત એક પદ સાથેનો સમીકરણ',
    binomialDef: 'બે અસમાન પદો ધરાવતો સમીકરણ',
    trinomialDef: 'ત્રણ પદો ધરાવતો સમીકરણ',
    polynomialDef: 'એક કે વધુ પદો ધરાવતો સમીકરણ',
    numberOfTerms: 'પદોની સંખ્યા',
    polyImportant: 'મહત્વપૂર્ણ',
    polyImportantNote: 'બધા એકપદ, દ્વિપદ અને ત્રિપદ બહુપદ છે! બહુપદ એક કે વધુ પદો ધરાવતા કોઈપણ સમીકરણ માટે સામાન્ય શબ્દ છે।',
    polyValid: '✓ માન્ય',
    polyInvalid: '✗ અમાન્ય',
    monomialReason1: 'આ એક પદ છે, દ્વિપદ નથી',
    binomialReason1: '3 પદ ધરાવે છે, 2 નહીં',
    trinomialReason1: 'x અને 5x સમાન પદ છે',
    polynomialReason1: 'એકપદ એક બહુપદ છે',
    polynomialReason2: 'દ્વિપદ એક બહુપદ છે',
    polynomialReason3: 'ત્રિપદ એક બહુપદ છે',
    polynomialReason4: '4 પદ પણ એક બહુપદ છે',
    examples: 'ઉદાહરણો'
  }
};

// Practice exercises with visual shapes data
const practiceExercises: PracticeExercise[] = [
  {
    id: 'alg-ex1',
    type: 'identification',
    difficulty: 'beginner',
    question: 'What is the coefficient of x in the expression 7x + 3?',
    data: {},
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
    data: {},
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
    difficulty: 'beginner',
    question: 'What type of polynomial is 7xy?',
    data: {},
    correctAnswer: 'Monomial',
    hint: 'A monomial has only one term. 7xy is a single term, so it is a monomial.',
    translations: {
      gu: {
        question: '7xy કેવા પ્રકારનો બહુપદી છે?',
        hint: 'એકપદીમાં માત્ર એક પદ હોય છે. 7xy એક જ પદ છે, તેથી તે એકપદી છે।'
      },
      hi: {
        question: '7xy किस प्रकार का बहुपद है?',
        hint: 'एकपद में केवल एक पद होता है। 7xy एक ही पद है, इसलिए यह एकपद है।'
      }
    }
  },
  {
    id: 'alg-ex4',
    type: 'identification',
    difficulty: 'beginner',
    question: 'What type of polynomial is x + y?',
    data: {},
    correctAnswer: 'Binomial',
    hint: 'A binomial has exactly two unlike terms. x + y has two terms, so it is a binomial.',
    translations: {
      gu: {
        question: 'x + y કેવા પ્રકારનો બહુપદી છે?',
        hint: 'દ્વિપદીમાં બે અસમાન પદો હોય છે. x + y માં બે પદો છે, તેથી તે દ્વિપદી છે।'
      },
      hi: {
        question: 'x + y किस प्रकार का बहुपद है?',
        hint: 'द्विपद में बिल्कुल दो असमान पद होते हैं। x + y में दो पद हैं, इसलिए यह द्विपद है।'
      }
    }
  },
  {
    id: 'alg-ex5',
    type: 'identification',
    difficulty: 'intermediate',
    question: 'Which of the following are like terms: 3xy, -5xy, 7x?',
    data: {},
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
    id: 'alg-ex6',
    type: 'identification',
    difficulty: 'intermediate',
    question: 'What is the result of combining like terms: 4x + 3x?',
    data: {},
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
    id: 'alg-ex7',
    type: 'identification',
    difficulty: 'intermediate',
    question: 'What type of polynomial is 5x² - 3x + 7?',
    data: {},
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
  {
    id: 'alg-ex8',
    type: 'identification',
    difficulty: 'intermediate',
    question: 'What is the result of combining like terms: 2a - 5a + 3a?',
    data: {},
    correctAnswer: '0a or 0',
    hint: 'Combine like terms: 2a - 5a + 3a = (2 - 5 + 3)a = 0a = 0',
    translations: {
      gu: {
        question: 'સમાન પદોને જોડવાથી પરિણામ શું છે: 2a - 5a + 3a?',
        hint: 'સમાન પદોને જોડો: 2a - 5a + 3a = (2 - 5 + 3)a = 0a = 0'
      },
      hi: {
        question: 'समान पदों को जोड़ने का परिणाम क्या है: 2a - 5a + 3a?',
        hint: 'समान पदों को जोड़ें: 2a - 5a + 3a = (2 - 5 + 3)a = 0a = 0'
      }
    }
  },
  {
    id: 'alg-ex9',
    type: 'verification',
    difficulty: 'advanced',
    question: 'Identify the number of terms in: 2x² - 5xy + 3y - 7',
    data: {},
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
    id: 'alg-ex10',
    type: 'identification',
    difficulty: 'advanced',
    question: 'What type of polynomial is a + b + c + d?',
    data: {},
    correctAnswer: 'Polynomial',
    hint: 'A polynomial is an expression with one or more terms. This expression has 4 terms, so it is a polynomial (specifically a polynomial with 4 terms).',
    translations: {
      gu: {
        question: 'a + b + c + d કેવા પ્રકારનો બહુપદી છે?',
        hint: 'બહુપદી એક અથવા વધુ પદો સાથેની અભિવ્યક્તિ છે. આ અભિવ્યક્તિમાં 4 પદો છે, તેથી તે બહુપદી છે।'
      },
      hi: {
        question: 'a + b + c + d किस प्रकार का बहुपद है?',
        hint: 'बहुपद एक या अधिक पदों वाला व्यंजक है। इस व्यंजक में 4 पद हैं, इसलिए यह एक बहुपद है।'
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

  // Polynomial Types Explorer Component
  const PolynomialExplorer: React.FC<{ language: 'en' | 'hi' | 'gu' }> = ({ language }) => {
    const [selectedType, setSelectedType] = useState<PolynomialType>('monomial');
    const [showDefinition, setShowDefinition] = useState(false);
    const [animatedExamples, setAnimatedExamples] = useState<number[]>([]);

    const t = translations[language];

    type PolynomialType = 'monomial' | 'binomial' | 'trinomial' | 'polynomial';

    interface Example {
      expression: string;
      isValid: boolean;
      reason?: string;
    }

    interface PolynomialData {
      type: PolynomialType;
      title: string;
      definition: string;
      termCount: string;
      examples: Example[];
      color: string;
      bgColor: string;
      borderColor: string;
    }

    const polynomialData: Record<PolynomialType, PolynomialData> = {
      monomial: {
        type: 'monomial',
        title: t.monomial,
        definition: t.monomialDef,
        termCount: t.oneTerm,
        examples: [
          { expression: '7xy', isValid: true },
          { expression: '-5m', isValid: true },
          { expression: '3z²', isValid: true },
          { expression: '4', isValid: true },
          { expression: '10pq', isValid: true, reason: t.monomialReason1 }
        ],
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-300'
      },
      binomial: {
        type: 'binomial',
        title: t.binomial,
        definition: t.binomialDef,
        termCount: t.twoTerms,
        examples: [
          { expression: 'x + y', isValid: true },
          { expression: 'm - 5', isValid: true },
          { expression: 'mn + 4m', isValid: true },
          { expression: 'a² - b²', isValid: true },
          { expression: 'a + b + 5', isValid: false, reason: t.binomialReason1 }
        ],
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-300'
      },
      trinomial: {
        type: 'trinomial',
        title: t.trinomial,
        definition: t.trinomialDef,
        termCount: t.threeTerms,
        examples: [
          { expression: 'x + y + 7', isValid: true },
          { expression: 'ab + a + b', isValid: true },
          { expression: '3x² - 5x + 2', isValid: true },
          { expression: 'm + n + 10', isValid: true },
          { expression: 'x + y + 5x', isValid: false, reason: t.trinomialReason1 }
        ],
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-300'
      },
      polynomial: {
        type: 'polynomial',
        title: 'Polynomial',
        definition: t.polynomialDef,
        termCount: '1+ terms',
        examples: [
          { expression: '5x', isValid: true, reason: t.polynomialReason1 },
          { expression: 'x + y', isValid: true, reason: t.polynomialReason2 },
          { expression: 'x² + 2x + 1', isValid: true, reason: t.polynomialReason3 },
          { expression: 'a + b + c + d', isValid: true, reason: t.polynomialReason4 }
        ],
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-300'
      }
    };

    useEffect(() => {
      setShowDefinition(false);
      setAnimatedExamples([]);
      const timer = setTimeout(() => setShowDefinition(true), 100);
      
      const exampleTimers = polynomialData[selectedType].examples.map((_, index) => 
        setTimeout(() => {
          setAnimatedExamples(prev => [...prev, index]);
        }, 300 + index * 200)
      );

      return () => {
        clearTimeout(timer);
        exampleTimers.forEach(t => clearTimeout(t));
      };
    }, [selectedType]);

    const currentData = polynomialData[selectedType];

    return (
      <div className="space-y-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpen className="w-10 h-10 text-indigo-600" />
              <h1 className="text-4xl font-bold text-gray-800">{t.polyExplorerTitle}</h1>
            </div>
          </div>

          {/* Type Selector */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {Object.entries(polynomialData).map(([key, data]) => (
              <button
                key={key}
                onClick={() => setSelectedType(key as PolynomialType)}
                className={`p-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  selectedType === key
                    ? `${data.bgColor} ${data.borderColor} border-4 shadow-lg`
                    : 'bg-white border-2 border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`text-xl ${selectedType === key ? data.color : 'text-gray-600'}`}>
                  {data.title}
                </div>
                <div className="text-sm text-gray-500 mt-1">{data.termCount}</div>
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className={`${currentData.bgColor} rounded-2xl p-8 border-4 ${currentData.borderColor} shadow-xl transition-all duration-500 ${
            showDefinition ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            {/* Definition Card */}
            <div className="bg-white rounded-xl p-6 mb-6 shadow-md">
              <div className="flex items-start gap-4">
                <Sparkles className={`w-8 h-8 ${currentData.color} flex-shrink-0 mt-1`} />
                <div>
                  <h2 className={`text-2xl font-bold ${currentData.color} mb-2`}>
                    {currentData.title}
                  </h2>
                  <p className="text-gray-700 text-lg font-medium">
                    {currentData.definition}
                  </p>
                  <div className={`inline-block mt-3 px-4 py-2 ${currentData.bgColor} rounded-full`}>
                    <span className={`font-semibold ${currentData.color}`}>
                      {t.numberOfTerms}: {currentData.termCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Examples */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                {t.examples}:
              </h3>
              <div className="grid gap-4">
                {currentData.examples.map((example, index) => (
                  <div
                    key={index}
                    className={`bg-white rounded-lg p-4 shadow-md border-2 transition-all duration-500 ${
                      animatedExamples.includes(index)
                        ? 'opacity-100 translate-x-0'
                        : 'opacity-0 -translate-x-8'
                    } ${
                      example.isValid
                        ? 'border-green-300 hover:border-green-400'
                        : 'border-red-300 hover:border-red-400'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`text-2xl font-mono font-bold px-4 py-2 rounded-lg ${
                          example.isValid ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {example.expression}
                        </div>
                        {example.reason && (
                          <div className="text-sm text-gray-600 italic">
                            {example.reason}
                          </div>
                        )}
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        example.isValid
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {example.isValid ? t.polyValid : t.polyInvalid}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Note for Polynomial */}
            {selectedType === 'polynomial' && (
              <div className="mt-6 bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                <p className="text-yellow-800 font-medium">
                  <strong>{t.polyImportant}:</strong> {t.polyImportantNote}
                </p>
              </div>
            )}
          </div>
        </div>

        <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in { animation: fade-in 0.6s ease-out; }
        `}</style>
      </div>
    );
  };

  const renderDemonstrationMode = () => (
    <div className="space-y-6">
      <PolynomialExplorer language={language} />
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
                        <div className="text-2xl font-bold">{feedback}</div>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-8 h-8" />
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
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{t.realWorldApplications}</h2>
        </div>
        
        {/* Applications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Monomial Example */}
          <div className="application-card bg-white rounded-3xl shadow-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-blue-200">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-3">{t.monomialExample}</h3>
              <p className="text-gray-600 mb-4">
                {t.monomialExampleDesc}
              </p>
              <div className="bg-blue-50 p-4 rounded-xl">
                <div className="font-mono text-lg font-bold text-blue-700">{t.areaFormula}</div>
              </div>
              <div className="mt-4 text-sm text-gray-500 font-medium">
                {t.oneTermNote}
              </div>
            </div>
          </div>

          {/* Binomial Example */}
          <div className="application-card bg-white rounded-3xl shadow-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-green-200">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-3">{t.binomialExample}</h3>
              <p className="text-gray-600 mb-4">
                {t.binomialExampleDesc}
              </p>
              <div className="bg-green-50 p-4 rounded-xl">
                <div className="font-mono text-lg font-bold text-green-700">{t.profitFormula}</div>
              </div>
              <div className="mt-4 text-sm text-gray-500 font-medium">
                {t.twoTermsNote}
              </div>
            </div>
          </div>

          {/* Trinomial Example */}
          <div className="application-card bg-white rounded-3xl shadow-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-purple-200">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-3">{t.trinomialExample}</h3>
              <p className="text-gray-600 mb-4">
                {t.trinomialExampleDesc}
              </p>
              <div className="bg-purple-50 p-4 rounded-xl">
                <div className="font-mono text-lg font-bold text-purple-700">{t.motionFormula}</div>
              </div>
              <div className="mt-4 text-sm text-gray-500 font-medium">
                {t.threeTermsNote}
              </div>
            </div>
          </div>

          {/* Polynomial Example */}
          <div className="application-card bg-white rounded-3xl shadow-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-orange-200">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-3">{t.polynomialExample}</h3>
              <p className="text-gray-600 mb-4">
                {t.polynomialExampleDesc}
              </p>
              <div className="bg-orange-50 p-4 rounded-xl">
                <div className="font-mono text-lg font-bold text-orange-700">{t.energyFormula}</div>
              </div>
              <div className="mt-4 text-sm text-gray-500 font-medium">
                {t.multipleTermsNote}
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
              {t.chapterTitle}
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
                {t.learning}
              </button>
              <button
                onClick={() => setCurrentMode('practice')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                  currentMode === 'practice'
                    ? 'bg-white text-teal-600 shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {t.practice}
              </button>
              <button
                onClick={() => setCurrentMode('realworld')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                  currentMode === 'realworld'
                    ? 'bg-white text-teal-600 shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {t.realWorldApplications}
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
