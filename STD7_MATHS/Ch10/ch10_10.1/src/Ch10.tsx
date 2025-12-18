import React, { useState } from 'react';
import { Lightbulb, CheckCircle, XCircle, BookOpen, Sparkles, Binary, Boxes } from 'lucide-react';

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
    term: 'Term',
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
    startWithVar: 'Start with variable',
    multiplyBy: 'Multiply',
    by: 'by',
    add: 'Add',
    times: 'times',
    takeVar: 'Take variable',
    multiplyThem: 'Multiply them →',
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
    distanceFormula: 'Distance = 60t km'
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
    term: 'पद',
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
    startWithVar: 'चर से शुरू करें',
    multiplyBy: 'गुणा करें',
    by: 'से',
    add: 'जोड़ें',
    times: 'बार',
    takeVar: 'चर लें',
    multiplyThem: 'उन्हें गुणा करें →',
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
    distanceFormula: 'दूरी = 60t किमी'
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
    term: 'શબ્દ',
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
    startWithVar: 'ચલથી શરૂ કરો',
    multiplyBy: 'ગુણાકાર',
    by: 'દ્વારા',
    add: 'ઉમેરો',
    times: 'ગુણ્યા',
    takeVar: 'ચલ લો',
    multiplyThem: 'તેમને ગુણો →',
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
    distanceFormula: 'અંતર = 60t કિમી'
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

  // Algebraic Expressions Guide Component
  const AlgebraicExpressionsGuide: React.FC = () => {
    const [currentSection, setCurrentSection] = useState(0);
    const [animateIn, setAnimateIn] = useState(true);

    // Section 10.1: Introduction with animations
    const IntroSection = () => {
      const [showTitle, setShowTitle] = useState(false);
      const [visibleExamples, setVisibleExamples] = useState<number[]>([]);
      const [displayedText, setDisplayedText] = useState('');
      const [textIndex, setTextIndex] = useState(0);

      const fullText = React.useMemo(() => t.whatAreAlgExprText, [t]);
      const expressions = React.useMemo(() => ['x + 3', 'y - 5', '4x + 5', '10y - 5'], []);

      // Reset when section changes
      React.useEffect(() => {
        if (currentSection === 0) {
          setShowTitle(false);
          setVisibleExamples([]);
          setDisplayedText('');
          setTextIndex(0);

          // Start animation sequence
          const timer1 = setTimeout(() => setShowTitle(true), 500);

          // Type out text character by character
          let currentIndex = 0;
          const wordTimer = setInterval(() => {
            if (currentIndex < fullText.length) {
              currentIndex++;
              setTextIndex(currentIndex);
              setDisplayedText(fullText.substring(0, currentIndex));
            } else {
              clearInterval(wordTimer);
              
              // Start showing examples one by one after a brief delay
              setTimeout(() => {
                // Show all examples one by one with delay
                for (let i = 0; i < expressions.length; i++) {
                  setTimeout(() => {
                    setVisibleExamples(prev => {
                      // Prevent duplicates
                      if (!prev.includes(i)) {
                        return [...prev, i];
                      }
                      return prev;
                    });
                  }, i * 800);
                }
              }, 500);
            }
          }, 50); // 50ms per character

          return () => {
            clearTimeout(timer1);
            if (wordTimer) clearInterval(wordTimer);
          };
        }
      }, [currentSection, fullText, expressions]);

      return (
        <div className="space-y-6">
          <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-l-4 border-blue-500 transition-all duration-500 ${
            showTitle ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}>
            <h3 className="text-xl font-bold text-blue-900 mb-3">{t.whatAreAlgExpr}</h3>
            <p className="text-gray-700 leading-relaxed min-h-[60px]">
              {displayedText}
              {textIndex < fullText.length && <span className="animate-pulse">|</span>}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {expressions.map((expr, idx) => {
              const isVisible = visibleExamples.includes(idx);
              return (
                <div
                  key={idx}
                  className={`bg-white p-4 rounded-lg shadow-md border-2 border-purple-200 hover:border-purple-400 transition-all transform ${
                    isVisible 
                      ? 'opacity-100 translate-y-0 scale-100 hover:scale-105' 
                      : 'opacity-0 -translate-y-4 scale-95'
                  }`}
                  style={{ transitionDelay: `${idx * 0.2}s` }}
                >
                  <div className="text-2xl font-mono text-center text-purple-600">
                    {isVisible ? expr : ' '}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    };

    // Section 10.2: How Expressions Are Formed with animations
    const FormationSection = () => {
      const [activeExample, setActiveExample] = useState(0);
      const [showHeading, setShowHeading] = useState(false);
      const [showBuildingBlocks, setShowBuildingBlocks] = useState(false);
      const [showFormationTitle, setShowFormationTitle] = useState(false);
      const [visibleButtons, setVisibleButtons] = useState<number[]>([]);
      const [showSteps, setShowSteps] = useState(false);
      const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
      
      const examples = [
        {
          expr: '4x + 5',
          steps: [`${t.startWithVar} x`, `${t.multiplyBy} x ${t.by} 4 → 4x`, `${t.add} 5 → 4x + 5`],
          color: 'blue'
        },
        {
          expr: 'x²',
          steps: [`${t.startWithVar} x`, `${t.multiplyBy} x ${t.by} itself`, 'x × x = x²'],
          color: 'green'
        },
        {
          expr: '2y²',
          steps: [`${t.startWithVar} y`, `${t.multiplyBy} y ${t.by} y → y²`, `${t.multiplyBy} ${t.by} 2 → 2y²`],
          color: 'purple'
        },
        {
          expr: 'xy',
          steps: [`${t.takeVar} x`, `${t.takeVar} y`, `${t.multiplyThem} xy`],
          color: 'red'
        }
      ];

      const current = examples[activeExample];

      // Animate when section changes to 10.2
      React.useEffect(() => {
        if (currentSection === 1) {
          // Reset all states
          setShowHeading(false);
          setShowBuildingBlocks(false);
          setShowFormationTitle(false);
          setVisibleButtons([]);
          setShowSteps(false);
          setVisibleSteps([]);

          // Animation sequence: 1. Heading, 2. Building Blocks, 3. Formation Title, 4. Steps
          const timer1 = setTimeout(() => setShowHeading(true), 300);
          const timer2 = setTimeout(() => setShowBuildingBlocks(true), 1000);
          const timer3 = setTimeout(() => {
            setShowFormationTitle(true);
            // Show buttons after formation title
            for (let i = 0; i < examples.length; i++) {
              setTimeout(() => {
                setVisibleButtons(prev => [...prev, i]);
              }, 300 + (i * 400));
            }
          }, 1800);
          
          // Show steps after buttons
          setTimeout(() => {
            setShowSteps(true);
            for (let i = 0; i < current.steps.length; i++) {
              setTimeout(() => {
                setVisibleSteps(prev => [...prev, i]);
              }, i * 300);
            }
          }, 3500);

          return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
          };
        }
      }, [currentSection]);

      return (
        <div className="space-y-6">
          {/* Heading Block */}
          <div className={`bg-white rounded-xl shadow-2xl p-8 transition-all duration-500 ${
            showHeading ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="text-2xl">✨</div>
              <div className="text-lg text-purple-600 font-semibold">Practice 10.2</div>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">{t.sectionFormation}</h2>
          </div>

          {/* Building Blocks Section */}
          <div className={`bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border-l-4 border-green-500 transition-all duration-500 ${
            showBuildingBlocks ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}>
            <h3 className="text-xl font-bold text-green-900 mb-3">{t.buildingBlocks}</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="font-bold text-green-700 mb-2">{t.variables}</div>
                <div className="text-sm text-gray-600">{t.variablesDesc}</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="font-bold text-blue-700 mb-2">{t.constants}</div>
                <div className="text-sm text-gray-600">{t.constantsDesc}</div>
              </div>
            </div>
          </div>

          {/* Step-by-Step Formation Block */}
          <div className={`bg-white p-6 rounded-lg shadow-lg border-2 border-gray-200 transition-all duration-500 ${
            showFormationTitle ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}>
            <h4 className="font-bold text-lg mb-4 text-gray-800">{t.stepByStepFormation}</h4>
            
            <div className="flex justify-center gap-2 mb-6">
              {examples.map((_, idx) => {
                const isVisible = visibleButtons.includes(idx);
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveExample(idx)}
                    className={`px-4 py-2 rounded-lg font-mono font-bold transition-all ${
                      activeExample === idx
                        ? 'bg-indigo-600 text-white scale-110'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    } ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                    }`}
                  >
                    {examples[idx].expr}
                  </button>
                );
              })}
            </div>

            {showSteps && (
              <div className={`bg-${current.color}-50 p-6 rounded-lg border-2 border-${current.color}-200 transition-all duration-500 ${
                showSteps ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                <div className="text-3xl font-mono text-center mb-6 font-bold text-gray-800">
                  {current.expr}
                </div>
                
                <div className="space-y-3">
                  {current.steps.map((step, idx) => {
                    const isStepVisible = visibleSteps.includes(idx);
                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm transform transition-all hover:translate-x-2 ${
                          isStepVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-grow">
                          <span className="font-semibold text-gray-800">{t.step} {idx + 1}:</span>
                          <span className="text-gray-700">{step}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    };

    // Section 10.3: Terms and Factors with animations
    const TermsSection = () => {
      const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
      const [showHeader, setShowHeader] = useState(false);
      const [visibleExamples, setVisibleExamples] = useState<number[]>([]);
      const [visibleTerms, setVisibleTerms] = useState<{ [key: number]: number[] }>({});

      const termExamples = [
        { expr: '4x² - 3xy', terms: ['4x²', '-3xy'], factors: { '4x²': ['4', 'x', 'x'], '-3xy': ['-3', 'x', 'y'] } },
        { expr: '5xy + 10', terms: ['5xy', '10'], factors: { '5xy': ['5', 'x', 'y'], '10': ['10'] } }
      ];

      // Animate when section changes to 10.3
      React.useEffect(() => {
        if (currentSection === 2) {
          setShowHeader(false);
          setVisibleExamples([]);
          setVisibleTerms({});

          const timer1 = setTimeout(() => setShowHeader(true), 500);
          
          // Show examples one by one
          setTimeout(() => {
            for (let i = 0; i < termExamples.length; i++) {
              setTimeout(() => {
                setVisibleExamples(prev => [...prev, i]);
                
                // Show terms for each example after a delay
                setTimeout(() => {
                  for (let j = 0; j < termExamples[i].terms.length; j++) {
                    setTimeout(() => {
                      setVisibleTerms(prev => ({
                        ...prev,
                        [i]: [...(prev[i] || []), j]
                      }));
                    }, j * 400);
                  }
                }, 800);
              }, i * 1200);
            }
          }, 1500);

          return () => {
            clearTimeout(timer1);
          };
        }
      }, [currentSection]);

      return (
        <div className="space-y-6">
          <div className={`bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border-l-4 border-purple-500 transition-all duration-500 ${
            showHeader ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}>
            <h3 className="text-xl font-bold text-purple-900 mb-3">{t.understandingTerms}</h3>
            <p className="text-gray-700">
              {t.understandingTermsText}
            </p>
          </div>

          {termExamples.map((example, exIdx) => {
            const isExampleVisible = visibleExamples.includes(exIdx);
            const visibleTermIndices = visibleTerms[exIdx] || [];
            return (
              <div key={exIdx} className={`bg-white p-6 rounded-lg shadow-lg border-2 border-gray-200 transition-all duration-500 ${
                isExampleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
              }`}>
                <div className="text-2xl font-mono text-center mb-6 font-bold text-gray-800 bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-lg">
                  {example.expr}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {example.terms.map((term, idx) => {
                    const isTermVisible = visibleTermIndices.includes(idx);
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedTerm(term)}
                        className={`p-4 rounded-lg border-2 transition-all transform hover:scale-105 ${
                          selectedTerm === term
                            ? 'border-purple-500 bg-purple-50 shadow-lg'
                            : 'border-gray-300 bg-white hover:border-purple-300'
                        } ${
                          isTermVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                        }`}
                      >
                        <div className="text-sm font-semibold text-gray-600 mb-2">{t.term} {idx + 1}</div>
                        <div className="text-xl font-mono font-bold text-purple-600">{term}</div>
                      </button>
                    );
                  })}
                </div>

              {selectedTerm && example.factors[selectedTerm as keyof typeof example.factors] && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-lg border-2 border-purple-300">
                  <div className="font-bold mb-3 text-purple-900">{t.factorsOf} {selectedTerm}:</div>
                  <div className="flex gap-3 justify-center flex-wrap">
                    {example.factors[selectedTerm as keyof typeof example.factors]?.map((factor: string, idx: number) => (
                      <div
                        key={idx}
                        className="bg-white px-6 py-3 rounded-lg shadow-md border-2 border-purple-200 font-mono text-lg font-bold text-purple-700"
                      >
                        {factor}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              </div>
            );
          })}

          <div className="bg-blue-50 p-5 rounded-lg border border-blue-300">
            <h4 className="font-bold text-blue-900 mb-3">📊 {t.coefficients}</h4>
            <div className="space-y-2 text-gray-700">
              <p>• {t.coeffExample1} <span className="font-mono font-bold">5xy</span>, {t.coeffExample2} <span className="font-bold text-blue-600">5</span></p>
              <p>• {t.coeffExample1} <span className="font-mono font-bold">-7x²y²</span>, {t.coeffExample2} <span className="font-bold text-blue-600">-7</span></p>
              <p>• {t.coeffExample3} <span className="font-mono">1x</span> → <span className="font-mono font-bold">x</span></p>
            </div>
          </div>
        </div>
      );
    };

    // Section 10.4: Like and Unlike Terms with animations
    const LikeTermsSection = () => {
      const [showHeader, setShowHeader] = useState(false);
      const [showLikeSection, setShowLikeSection] = useState(false);
      const [showUnlikeSection, setShowUnlikeSection] = useState(false);
      const [visibleLikeExamples, setVisibleLikeExamples] = useState<number[]>([]);
      const [visibleUnlikeExamples, setVisibleUnlikeExamples] = useState<number[]>([]);
      const [visiblePolyTypes, setVisiblePolyTypes] = useState<number[]>([]);

      React.useEffect(() => {
        if (currentSection === 3) {
          setShowHeader(false);
          setShowLikeSection(false);
          setShowUnlikeSection(false);
          setVisibleLikeExamples([]);
          setVisibleUnlikeExamples([]);
          setVisiblePolyTypes([]);

          const timer1 = setTimeout(() => setShowHeader(true), 500);
          const timer2 = setTimeout(() => setShowLikeSection(true), 1500);
          const timer3 = setTimeout(() => setShowUnlikeSection(true), 2500);

          // Show like examples
          setTimeout(() => {
            for (let i = 0; i < 2; i++) {
              setTimeout(() => {
                setVisibleLikeExamples(prev => [...prev, i]);
              }, i * 400);
            }
          }, 2000);

          // Show unlike examples
          setTimeout(() => {
            for (let i = 0; i < 2; i++) {
              setTimeout(() => {
                setVisibleUnlikeExamples(prev => [...prev, i]);
              }, i * 400);
            }
          }, 3000);

          // Show polynomial types
          setTimeout(() => {
            for (let i = 0; i < 3; i++) {
              setTimeout(() => {
                setVisiblePolyTypes(prev => [...prev, i]);
              }, i * 400);
            }
          }, 4000);

          return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
          };
        }
      }, [currentSection]);

      return (
        <div className="space-y-6">
          <div className={`bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg border-l-4 border-orange-500 transition-all duration-500 ${
            showHeader ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}>
            <h3 className="text-xl font-bold text-orange-900 mb-3">{t.likeVsUnlike}</h3>
            <p className="text-gray-700 mb-3">
              <span className="font-bold">{t.likeTerms}</span> {t.likeTermsDesc}
            </p>
            <p className="text-gray-700">
              <span className="font-bold">{t.unlikeTerms}</span> {t.unlikeTermsDesc}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className={`bg-green-50 p-6 rounded-lg border-2 border-green-300 transition-all duration-500 ${
              showLikeSection ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
            }`}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <h4 className="font-bold text-green-900">{t.likeTermsExamples}</h4>
              </div>
              <div className="space-y-3">
                <div className={`bg-white p-3 rounded-lg shadow transition-all ${
                  visibleLikeExamples.includes(0) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  <span className="font-mono font-bold text-green-700">2xy</span> {t.of} <span className="font-mono font-bold text-green-700">5xy</span>
                  <div className="text-sm text-gray-600 mt-1">{t.bothHave} xy</div>
                </div>
                <div className={`bg-white p-3 rounded-lg shadow transition-all ${
                  visibleLikeExamples.includes(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  <span className="font-mono font-bold text-green-700">-4ab</span> {t.of} <span className="font-mono font-bold text-green-700">7ba</span>
                  <div className="text-sm text-gray-600 mt-1">ab = ba ({t.orderDoesntMatter})</div>
                </div>
              </div>
            </div>

            <div className={`bg-red-50 p-6 rounded-lg border-2 border-red-300 transition-all duration-500 ${
              showUnlikeSection ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
            }`}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <h4 className="font-bold text-red-900">{t.unlikeTermsExamples}</h4>
              </div>
              <div className="space-y-3">
                <div className={`bg-white p-3 rounded-lg shadow transition-all ${
                  visibleUnlikeExamples.includes(0) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  <span className="font-mono font-bold text-red-700">3xy</span> {t.of} <span className="font-mono font-bold text-red-700">3x</span>
                  <div className="text-sm text-gray-600 mt-1">{t.differentVariables}</div>
                </div>
                <div className={`bg-white p-3 rounded-lg shadow transition-all ${
                  visibleUnlikeExamples.includes(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  <span className="font-mono font-bold text-red-700">6xy²</span> {t.of} <span className="font-mono font-bold text-red-700">9x²y</span>
                  <div className="text-sm text-gray-600 mt-1">{t.differentPowers}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-gray-200">
            <h4 className="font-bold text-lg mb-4 text-gray-800">🏷️ {t.typesOfPolynomials}</h4>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { icon: '1️⃣', title: t.monomial, desc: t.oneTerm, examples: '7xy, -5m, 3z²', color: 'blue' },
                { icon: '2️⃣', title: t.binomial, desc: t.twoTerms, examples: 'x + y, m - 5', color: 'purple' },
                { icon: '3️⃣', title: t.trinomial, desc: t.threeTerms, examples: 'x + y + 7', color: 'pink' }
              ].map((type, idx) => (
                <div key={idx} className={`bg-gradient-to-br from-${type.color}-50 to-${type.color}-100 p-5 rounded-lg border-2 border-${type.color}-300 transform hover:scale-105 transition-all ${
                  visiblePolyTypes.includes(idx) ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                }`}>
                  <div className="text-2xl mb-2">{type.icon}</div>
                  <div className={`font-bold text-${type.color}-900 mb-2`}>{type.title}</div>
                  <div className="text-sm text-gray-700 mb-2">{type.desc}</div>
                  <div className={`font-mono text-${type.color}-700 font-bold`}>{type.examples}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    };

    const sections = [
      {
        id: '10.1',
        title: t.sectionIntro,
        icon: <BookOpen className="w-6 h-6" />,
        content: <IntroSection />
      }
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-purple-50 to-pink-50 p-6">
        <div className="max-w-5xl mx-auto">
          {/* Content Card */}
          <div className={`bg-white rounded-xl shadow-2xl p-8 mb-6 transition-all duration-300 ${
            animateIn ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
          }`}>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-200">
              <div className="bg-gradient-to-r from-teal-500 to-purple-500 p-3 rounded-lg text-white">
                {sections[currentSection].icon}
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-500">{t.learning} {sections[currentSection].id}</div>
                <h2 className="text-2xl font-bold text-gray-800">{sections[currentSection].title}</h2>
              </div>
            </div>

            <div className="min-h-[500px]">
              {sections[currentSection].content}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDemonstrationMode = () => (
    <div className="space-y-6">
      <AlgebraicExpressionsGuide />
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
