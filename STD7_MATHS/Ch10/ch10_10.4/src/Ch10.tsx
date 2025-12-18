import React, { useState } from 'react';
import { Lightbulb, CheckCircle, XCircle, Boxes } from 'lucide-react';

interface PracticeExercise {
  id: string;
  type: 'calculation' | 'identification' | 'verification';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  question: string;
  data: any & { visualShapes?: string[] };
  correctAnswer: number | string | number[];
  hint: string;
  translations?: { [key: string]: { question: string; hint: string } };
}

type PracticeResults = { correct: string[]; incorrect: string[]; skipped: string[] };

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
    distanceFormula: 'Distance = 60t km',
    // 10.4 Like and Unlike Terms specific
    combiningLikeTerms: 'Combining Like Terms',
    combiningRule: 'When combining like terms, add or subtract their coefficients while keeping the variables the same.',
    example: 'Example'
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
    distanceFormula: 'दूरी = 60t किमी',
    // 10.4 Like and Unlike Terms specific
    combiningLikeTerms: 'समान पदों को जोड़ना',
    combiningRule: 'समान पदों को जोड़ते समय, उनके गुणांक जोड़ें या घटाएं जबकि चर समान रहें।',
    example: 'उदाहरण'
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
    engineeringDesc: 'ઇજનેરો નેટ્સનો ઉપયોગ એવા ઉત્પાદનો ડિઝાઇન કરવા માટે કરે છે જે કાર્યક્ષમ રીતે ઉત્પાદિત અને એસેમ્બર કરી શકાય છે।',
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
    // Algebraic Expressions Guide translations
    algExprTitle: 'બીજગણિત અભિવ્યક્તિઓ',
    algExprSubtitle: 'અધ્યાય 10: સક્રિય શિક્ષણ ગાઇડ',
    sectionIntro: 'બીજગણિત અભિવ્યક્તિઓનો પરિચય',
    sectionFormation: 'અભિવ્યક્તિઓ કેવી રીતે બનાવવામાં આવે છે',
    sectionTerms: 'શબ્દો અને અવયવો',
    sectionLikeTerms: 'સમાન અને અસમાન શબ્દો',
    whatAreAlgExpr: 'બીજગણિત અભિવ્યક્તિઓ શું છે?',
    whatAreAlgExprText: 'બીજગણિત અભિવ્યક્તિઓ ગાણિતિક શબ્દસમૂહો છે જે સંખ્યાઓ, ચલો અને ક્રિયાઓને જોડે છે। તે ગણિતની ભાષામાં વાક્યો જેવા છે!',
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
    distanceFormula: 'અંતર = 60t કિમી',
    // 10.4 Like and Unlike Terms specific
    combiningLikeTerms: 'સમાન શબ્દોને જોડવા',
    combiningRule: 'સમાન શબ્દોને જોડતી વખતે, તેમના ગુણાંક ઉમેરો અથવા બાદબાકી કરો જ્યારે ચલો સમાન રહે છે।',
    example: 'ઉદાહરણ'
  }
};

// Practice exercises
const practiceExercises: PracticeExercise[] = [
  {
    id: 'like-ex1',
    type: 'identification',
    difficulty: 'beginner',
    question: 'Which of the following are like terms: 5x, -3x, 7y?',
    data: { visualShapes: ['Square', 'Rectangle'] },
    correctAnswer: '5x and -3x',
    hint: 'Like terms have the same variable part. 5x and -3x both have x.',
    translations: {
      gu: {
        question: 'નીચેનામાંથી કયા સમાન પદો છે: 5x, -3x, 7y?',
        hint: 'સમાન પદોમાં સમાન ચલ ભાગ હોય છે। 5x અને -3x બંનેમાં x છે।'
      },
      hi: {
        question: 'निम्नलिखित में से कौन से समान पद हैं: 5x, -3x, 7y?',
        hint: 'समान पदों में समान चर भाग होता है। 5x और -3x दोनों में x है।'
      }
    }
  },
  {
    id: 'like-ex2',
    type: 'calculation',
    difficulty: 'beginner',
    question: 'Combine like terms: 7x + 3x',
    data: { visualShapes: ['Circle', 'Triangle'] },
    correctAnswer: '10x',
    hint: 'Add the coefficients: 7 + 3 = 10, keep the variable x.',
    translations: {
      gu: {
        question: 'સમાન પદોને જોડો: 7x + 3x',
        hint: 'ગુણાંક ઉમેરો: 7 + 3 = 10, ચલ x રાખો।'
      },
      hi: {
        question: 'समान पदों को जोड़ें: 7x + 3x',
        hint: 'गुणांक जोड़ें: 7 + 3 = 10, चर x रखें।'
      }
    }
  },
  {
    id: 'like-ex3',
    type: 'calculation',
    difficulty: 'intermediate',
    question: 'Simplify: 8xy - 3xy + 2xy',
    data: { visualShapes: ['Rectangle', 'Square'] },
    correctAnswer: '7xy',
    hint: 'Combine coefficients: 8 - 3 + 2 = 7, keep xy.',
    translations: {
      gu: {
        question: 'સરળ કરો: 8xy - 3xy + 2xy',
        hint: 'ગુણાંકને જોડો: 8 - 3 + 2 = 7, xy રાખો।'
      },
      hi: {
        question: 'सरलीकरण करें: 8xy - 3xy + 2xy',
        hint: 'गुणांक जोड़ें: 8 - 3 + 2 = 7, xy रखें।'
      }
    }
  },
  {
    id: 'like-ex4',
    type: 'identification',
    difficulty: 'intermediate',
    question: 'Are 4x² and 4x like terms?',
    data: { visualShapes: ['Circle', 'Rectangle'] },
    correctAnswer: 'No',
    hint: 'x² and x are different. x² means x×x, while x is just x.',
    translations: {
      gu: {
        question: 'શું 4x² અને 4x સમાન પદો છે?',
        hint: 'x² અને x અલગ છે। x² એટલે x×x, જ્યારે x ફક્ત x છે।'
      },
      hi: {
        question: 'क्या 4x² और 4x समान पद हैं?',
        hint: 'x² और x अलग हैं। x² का मतलब x×x है, जबकि x सिर्फ x है।'
      }
    }
  },
  {
    id: 'like-ex5',
    type: 'calculation',
    difficulty: 'advanced',
    question: 'Simplify: 5x² + 3x - 2x² + 7x',
    data: { visualShapes: ['Triangle', 'Rectangle'] },
    correctAnswer: '3x² + 10x',
    hint: 'Group like terms: (5x² - 2x²) + (3x + 7x) = 3x² + 10x',
    translations: {
      gu: {
        question: 'સરળ કરો: 5x² + 3x - 2x² + 7x',
        hint: 'સમાન પદોને જૂથબદ્ધ કરો: (5x² - 2x²) + (3x + 7x) = 3x² + 10x'
      },
      hi: {
        question: 'सरलीकरण करें: 5x² + 3x - 2x² + 7x',
        hint: 'समान पदों को समूहित करें: (5x² - 2x²) + (3x + 7x) = 3x² + 10x'
      }
    }
  },
  {
    id: 'like-ex6',
    type: 'calculation',
    difficulty: 'advanced',
    question: 'Combine: 3xy² - 5xy² + 2xy² - xy²',
    data: { visualShapes: ['Circle', 'Square'] },
    correctAnswer: '-xy²',
    hint: 'Add all coefficients: 3 - 5 + 2 - 1 = -1, so -1xy² = -xy²',
    translations: {
      gu: {
        question: 'જોડો: 3xy² - 5xy² + 2xy² - xy²',
        hint: 'બધા ગુણાંક ઉમેરો: 3 - 5 + 2 - 1 = -1, તેથી -1xy² = -xy²'
      },
      hi: {
        question: 'जोड़ें: 3xy² - 5xy² + 2xy² - xy²',
        hint: 'सभी गुणांक जोड़ें: 3 - 5 + 2 - 1 = -1, इसलिए -1xy² = -xy²'
      }
    }
  }
];

const Ch10: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<'demonstration' | 'practice' | 'realworld'>('demonstration');
  const [language, setLanguage] = useState<'en' | 'hi' | 'gu'>(() => (localStorage.getItem('ch10-language') as any) || 'en');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [studentAnswer, setStudentAnswer] = useState<string>('');
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [showOverview, setShowOverview] = useState(false);
  const [practiceResults, setPracticeResults] = useState<PracticeResults>({ correct: [], incorrect: [], skipped: [] });

  const t = translations[language as keyof typeof translations];
  const handleLanguageChange = (newLanguage: 'en' | 'hi' | 'gu') => { setLanguage(newLanguage); localStorage.setItem('ch10-language', newLanguage); };
  const getTranslatedText = (item: any, field: string, lang: string) => (item.translations && item.translations[lang] && item.translations[lang][field]) ? item.translations[lang][field] : item[field];

  const handleSubmitAnswer = () => {
    const currentExercise = practiceExercises[currentExerciseIndex];
    if (!currentExercise) return;
    const newAttempts = attempts + 1; let isCorrect = false;
    if (Array.isArray(currentExercise.correctAnswer)) {
      const studentAnswers = studentAnswer.split(',').map((a: string) => parseInt(a.trim(), 10));
      isCorrect = studentAnswers.length === currentExercise.correctAnswer.length && studentAnswers.every((ans: number, idx: number) => ans === (currentExercise.correctAnswer as number[])[idx]);
    } else if (typeof currentExercise.correctAnswer === 'string') {
      isCorrect = studentAnswer.toLowerCase().trim() === (currentExercise.correctAnswer as string).toLowerCase().trim();
    } else {
      isCorrect = parseInt(studentAnswer, 10) === currentExercise.correctAnswer;
    }
    if (isCorrect) {
      setFeedback(t.correct);
      setPracticeResults((prev) => { const newResults = { ...prev, correct: [...prev.correct, currentExercise.id] }; const total = newResults.correct.length + newResults.incorrect.length + newResults.skipped.length; if (total >= practiceExercises.length - 1) setTimeout(() => setShowOverview(true), 2000); return newResults; });
      setTimeout(() => { if (currentExerciseIndex < practiceExercises.length - 1) setCurrentExerciseIndex((p) => p + 1); setStudentAnswer(''); setFeedback(''); setShowHint(false); setAttempts(0); }, 1500);
    } else {
      setFeedback(t.incorrect); setAttempts(newAttempts);
      if (newAttempts >= 3) {
        setPracticeResults((prev) => { const newResults = { ...prev, incorrect: [...prev.incorrect, currentExercise.id] }; const total = newResults.correct.length + newResults.incorrect.length + newResults.skipped.length; if (total >= practiceExercises.length - 1) setTimeout(() => setShowOverview(true), 500); return newResults; });
      }
    }
  };
  const handleSkip = () => {
    const currentExercise = practiceExercises[currentExerciseIndex];
    if (!currentExercise) return;
    setPracticeResults((prev) => { const newResults = { ...prev, skipped: [...prev.skipped, currentExercise.id] }; const total = newResults.correct.length + newResults.incorrect.length + newResults.skipped.length; if (total >= practiceExercises.length) setTimeout(() => setShowOverview(true), 500); return newResults; });
    setStudentAnswer(''); setFeedback(''); setShowHint(false); setAttempts(0);
    if (currentExerciseIndex < practiceExercises.length - 1) setCurrentExerciseIndex((p) => p + 1);
  };

  // 10.4 Like and Unlike Terms Section
  const LikeUnlikeTermsSection: React.FC = () => {
    const [selectedPair, setSelectedPair] = useState(0);
    const [showMainBlock, setShowMainBlock] = useState(false);
    const [showMainHeading, setShowMainHeading] = useState(false);
    const [showMainContent, setShowMainContent] = useState(false);
    const [showLikeCard, setShowLikeCard] = useState(false);
    const [showLikeCardContent, setShowLikeCardContent] = useState(false);
    const [showUnlikeCard, setShowUnlikeCard] = useState(false);
    const [showUnlikeCardContent, setShowUnlikeCardContent] = useState(false);
    const [visibleCards, setVisibleCards] = useState<number[]>([]);
    const [visibleCardHeadings, setVisibleCardHeadings] = useState<number[]>([]);
    const [visibleCardContent, setVisibleCardContent] = useState<number[]>([]);
    const [showCombiningBlock, setShowCombiningBlock] = useState(false);
    const [showCombiningHeading, setShowCombiningHeading] = useState(false);
    const [showCombiningContent, setShowCombiningContent] = useState(false);
    const [visibleCombiningExamples, setVisibleCombiningExamples] = useState<number[]>([]);

    const termPairs = [
      { like: ['3x', '7x', '-2x'], unlike: ['5y', '4z', '9'], reason: t.bothHave + ' x' },
      { like: ['4xy', '-xy', '10xy'], unlike: ['3x', '2y', '6'], reason: t.bothHave + ' xy' },
      { like: ['2x²', '5x²', '-3x²'], unlike: ['4x', '7x³', '2y²'], reason: t.bothHave + ' x²' }
    ];

    const combiningExamples = [
      { expr: '5x + 3x', step1: '(5 + 3)x', result: '8x' },
      { expr: '7y - 2y', step1: '(7 - 2)y', result: '5y' },
      { expr: '4ab + 2ab - 3ab', step1: '(4 + 2 - 3)ab', result: '3ab' }
    ];

    React.useEffect(() => {
      // Reset all states
      setShowMainBlock(false);
      setShowMainHeading(false);
      setShowMainContent(false);
      setShowLikeCard(false);
      setShowLikeCardContent(false);
      setShowUnlikeCard(false);
      setShowUnlikeCardContent(false);
      setVisibleCards([]);
      setVisibleCardHeadings([]);
      setVisibleCardContent([]);
      setShowCombiningBlock(false);
      setShowCombiningHeading(false);
      setShowCombiningContent(false);
      setVisibleCombiningExamples([]);

      // Sequential animation for main block
      const timer1 = setTimeout(() => setShowMainBlock(true), 150);
      const timer2 = setTimeout(() => setShowMainHeading(true), 300);
      const timer3 = setTimeout(() => setShowMainContent(true), 450);
      const timer4 = setTimeout(() => setShowLikeCard(true), 600);
      const timer5 = setTimeout(() => setShowLikeCardContent(true), 750);
      const timer6 = setTimeout(() => setShowUnlikeCard(true), 900);
      const timer7 = setTimeout(() => setShowUnlikeCardContent(true), 1050);

      // Animate comparison cards
      setTimeout(() => {
        for (let i = 0; i < termPairs.length; i++) {
          setTimeout(() => {
            setVisibleCards(prev => [...prev, i]);
            setTimeout(() => setVisibleCardHeadings(prev => [...prev, i]), 150);
            setTimeout(() => setVisibleCardContent(prev => [...prev, i]), 300);
          }, i * 500);
        }
      }, 1250);

      // Animate combining section
      const combiningStartTime = 1250 + (termPairs.length * 500) + 300;
      setTimeout(() => setShowCombiningBlock(true), combiningStartTime);
      setTimeout(() => setShowCombiningHeading(true), combiningStartTime + 150);
      setTimeout(() => setShowCombiningContent(true), combiningStartTime + 300);
      
      // Animate combining examples
      setTimeout(() => {
        for (let i = 0; i < 3; i++) {
          setTimeout(() => setVisibleCombiningExamples(prev => [...prev, i]), i * 200);
        }
      }, combiningStartTime + 450);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
        clearTimeout(timer5);
        clearTimeout(timer6);
        clearTimeout(timer7);
      };
    }, []);

    return (
      <div className="space-y-6">
        <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-l-4 border-blue-500 transition-all duration-500 ${showMainBlock ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <h3 className={`text-xl font-bold text-blue-900 mb-3 transition-all duration-500 ${showMainHeading ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>{t.likeVsUnlike}</h3>
          <div className={`grid grid-cols-2 gap-4 transition-all duration-500 ${showMainContent ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <div className={`bg-white p-4 rounded-lg shadow transition-all duration-500 ${showLikeCard ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <div className={`transition-all duration-500 ${showLikeCardContent ? 'opacity-100' : 'opacity-0'}`}>
                <div className="font-bold text-green-700 mb-2">{t.likeTerms}</div>
                <div className="text-sm text-gray-600">{t.likeTermsDesc}</div>
              </div>
            </div>
            <div className={`bg-white p-4 rounded-lg shadow transition-all duration-500 ${showUnlikeCard ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <div className={`transition-all duration-500 ${showUnlikeCardContent ? 'opacity-100' : 'opacity-0'}`}>
                <div className="font-bold text-red-700 mb-2">{t.unlikeTerms}</div>
                <div className="text-sm text-gray-600">{t.unlikeTermsDesc}</div>
              </div>
            </div>
          </div>
        </div>

        {termPairs.map((pair, idx) => {
          const isVisible = visibleCards.includes(idx);
          const isHeadingVisible = visibleCardHeadings.includes(idx);
          const isContentVisible = visibleCardContent.includes(idx);
          return (
            <div key={idx} className={`bg-white p-6 rounded-lg shadow-lg border-2 border-gray-200 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
                  <h4 className={`font-bold text-green-800 mb-3 text-center transition-all duration-500 ${isHeadingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>{t.likeTerms}</h4>
                  <div className={`transition-all duration-500 ${isContentVisible ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="flex gap-2 justify-center flex-wrap">
                      {pair.like.map((term, i) => (
                        <div key={i} className="bg-white px-4 py-2 rounded-lg shadow font-mono text-lg font-bold text-green-700">{term}</div>
                      ))}
                    </div>
                    <p className="text-center mt-3 text-sm text-gray-600">{pair.reason}</p>
                  </div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border-2 border-red-300">
                  <h4 className={`font-bold text-red-800 mb-3 text-center transition-all duration-500 ${isHeadingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>{t.unlikeTerms}</h4>
                  <div className={`transition-all duration-500 ${isContentVisible ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="flex gap-2 justify-center flex-wrap">
                      {pair.unlike.map((term, i) => (
                        <div key={i} className="bg-white px-4 py-2 rounded-lg shadow font-mono text-lg font-bold text-red-700">{term}</div>
                      ))}
                    </div>
                    <p className="text-center mt-3 text-sm text-gray-600">{t.differentVariables}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {showCombiningBlock && (
          <div className={`bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border-l-4 border-purple-500 transition-all duration-500 ${showCombiningBlock ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h3 className={`text-xl font-bold text-purple-900 mb-3 transition-all duration-500 ${showCombiningHeading ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>{t.combiningLikeTerms}</h3>
            <p className={`text-gray-700 mb-4 transition-all duration-500 ${showCombiningContent ? 'opacity-100' : 'opacity-0'}`}>{t.combiningRule}</p>
            <div className={`space-y-4 transition-all duration-500 ${showCombiningContent ? 'opacity-100' : 'opacity-0'}`}>
              {combiningExamples.map((ex, idx) => {
                const isExampleVisible = visibleCombiningExamples.includes(idx);
                return (
                  <div key={idx} className={`bg-white p-4 rounded-lg shadow transition-all duration-500 ${isExampleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                    <div className="flex items-center justify-around text-lg">
                      <span className="font-mono font-bold text-gray-800">{ex.expr}</span>
                      <span className="text-purple-600">→</span>
                      <span className="font-mono text-gray-700">{ex.step1}</span>
                      <span className="text-purple-600">→</span>
                      <span className="font-mono font-bold text-purple-700 text-xl">{ex.result}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const AlgebraicExpressionsGuide: React.FC = () => {
    const [currentSection] = useState(0);
    const [animateIn, setAnimateIn] = useState(true);

    const sections = [
      { id: '10.4', title: t.sectionLikeTerms, icon: <Boxes className="w-6 h-6" />, content: <LikeUnlikeTermsSection /> }
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-purple-50 to-pink-50 p-6">
        <div className="max-w-5xl mx-auto">
          <div className={`bg-white rounded-xl shadow-2xl p-8 mb-6 transition-all duration-300 ${animateIn ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}`}>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-200">
              <div className="bg-gradient-to-r from-teal-500 to-purple-500 p-3 rounded-lg text-white">{sections[currentSection].icon}</div>
              <div>
                <div className="text-sm font-semibold text-gray-500">{t.practice} {sections[currentSection].id}</div>
                <h2 className="text-2xl font-bold text-gray-800">{sections[currentSection].title}</h2>
              </div>
            </div>
            <div className="min-h-[500px]">{sections[currentSection].content}</div>
          </div>
        </div>
      </div>
    );
  };

  const renderDemonstrationMode = () => (<div className="space-y-6"><AlgebraicExpressionsGuide /></div>);

  const currentExercise = practiceExercises[currentExerciseIndex];
  const renderPracticeMode = () => {
    if (!currentExercise) return null;
    return (
      <>
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-6 md:p-8">
            <div>
              <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-orange-200">
                <div className="flex items-center gap-3 mb-6"><span className="text-5xl">📖</span><h3 className="text-2xl md:text-3xl font-bold text-gradient-teal-purple">{t.practiceExercises}</h3></div>
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-300">
                    <h4 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2"><span className="text-2xl">📋</span>{t.practiceExercises}</h4>
                    <p className="text-gray-700 leading-relaxed mb-4">{getTranslatedText(currentExercise, 'question', language)}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${currentExercise.difficulty === 'beginner' ? 'bg-green-100 text-green-800' : currentExercise.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{t[currentExercise.difficulty]}</span>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-300">
                    <h4 className="font-bold text-lg mb-3 text-gray-800 flex items-center gap-2"><span className="text-2xl">❓</span>{t.yourAnswer}</h4>
                    <div className="bg-white rounded-xl p-4 shadow-md">
                      <input type="text" value={studentAnswer} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStudentAnswer(e.target.value)} onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') { e.preventDefault(); handleSubmitAnswer(); } }} placeholder={t.enterAnswer} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 text-lg" />
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4">
                    {!showHint && (<button onClick={() => setShowHint(true)} className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-colors font-medium shadow-lg hover:scale-105"><Lightbulb className="w-5 h-5" />{t.hint}</button>)}
                    <button onClick={handleSkip} className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors font-medium shadow-lg hover:scale-105"><XCircle className="w-5 h-5" />{t.skip}</button>
                    <button onClick={handleSubmitAnswer} className="flex items-center gap-2 px-8 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-colors font-medium shadow-lg hover:scale-105"><CheckCircle className="w-5 h-5" />{t.submit}</button>
                  </div>
                  {showHint && (<div className="hint-display p-6 bg-yellow-50 border-2 border-yellow-200 rounded-2xl"><div className="flex items-center gap-3"><div className="text-2xl">💡</div><div className="text-lg text-yellow-800 font-medium">{getTranslatedText(currentExercise, 'hint', language)}</div></div></div>)}
                  {feedback && (<div className={`feedback p-6 rounded-2xl border-2 flex items-center justify-center gap-4 ${feedback === t.correct ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-700'}`}>
                    {feedback === t.correct ? (<><CheckCircle className="w-8 h-8" /><div className="text-3xl">🎉</div><div className="text-2xl font-bold">{feedback}</div></>) : (<><XCircle className="w-8 h-8" /><div className="text-3xl">🤔</div><div className="text-2xl font-bold">{feedback}</div></>)}
                  </div>)}
                </div>
              </div>
            </div>
          </div>
        </div>
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
      <header className="bg-gradient-to-r from-teal-600 via-purple-600 to-pink-600 text-white shadow-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">📚 {t.chapterTitle}</h1>
            <nav className="flex items-center gap-3">
              <button onClick={() => setCurrentMode('demonstration')} className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${currentMode === 'demonstration' ? 'bg-white text-teal-600 shadow-lg' : 'bg-white/10 text-white hover:bg-white/20'}`}>📚 {t.learning}</button>
              <button onClick={() => setCurrentMode('practice')} className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${currentMode === 'practice' ? 'bg-white text-teal-600 shadow-lg' : 'bg-white/10 text-white hover:bg-white/20'}`}>✍️ {t.practice}</button>
              <button onClick={() => setCurrentMode('realworld')} className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${currentMode === 'realworld' ? 'bg-white text-teal-600 shadow-lg' : 'bg-white/10 text-white hover:bg-white/20'}`}>🌍 {t.realWorldApplications}</button>
            </nav>
            <div className="flex items-center gap-3">
              <select value={language} onChange={(e) => handleLanguageChange(e.target.value as 'en' | 'hi' | 'gu')} className="px-3 py-2 rounded-lg bg-white text-gray-800 font-medium shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white">
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="gu">ગુજરાતી</option>
              </select>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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

