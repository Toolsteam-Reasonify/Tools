import React, { useState, useEffect } from 'react';
import { Lightbulb, CheckCircle, XCircle, RotateCcw, Play, Pause } from 'lucide-react';

// Type definitions
type ShapeType = 'cube' | 'pyramid' | 'cone';

interface ShapeOption {
  id: ShapeType;
  name: string;
  color: string;
}

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
    skip: 'Skip',
    learning: 'Learn',
    practice: 'Practice',
    selectLanguage: 'Select Language',
    chapterTitle: 'Net for Building 3-D Shapes',
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
    // Overview page translations
    overviewTitle: 'Practice Complete!',
    overviewSubtitle: 'Great job completing all the exercises!',
    yourScore: 'Your Score',
    totalQuestions: 'Total Questions',
    correctAnswers: 'Correct Answers',
    accuracy: 'Accuracy',
    totalAttempts: 'Total Attempts',
    restartPractice: 'Restart Practice',
    backToLearning: 'Back to Learning',
    excellentWork: 'Excellent Work!',
    goodJob: 'Good Job!',
    keepPracticing: 'Keep Practicing!',
    // NetsExplanation translations
    netsTitle: '13.3: Nets for Building 3-D Shapes',
    keyDefinitions: 'Key Definitions from the Summary',
    netDefinition: 'Net:',
    netDefinitionText: 'A 2-D "skeleton-outline" of a 3-D solid.',
    actionDefinition: 'Action:',
    actionDefinitionText: 'A net is a pattern that, when folded, results in a 3-D shape.',
    processDefinition: 'Process:',
    processDefinitionText: 'You can get a net by taking a 3-D object, like a cardboard box, cutting its edges, and laying it flat. This animation shows the reverse: folding the net back into the 3-D shape.',
    interactiveAnimation: 'Interactive Animation: Cube Net',
    animationDescription: 'Click the button to see the 2D net fold into a 3D cube and back.',
    foldIntoCube: 'Fold into Cube',
    unfoldToNet: 'Unfold to Net',
    faceFront: 'Front',
    faceBack: 'Back',
    faceTop: 'Top',
    faceBottom: 'Bottom',
    faceLeft: 'Left',
    faceRight: 'Right'
  },
  hi: {
    correct: 'सही!',
    incorrect: 'फिर कोशिश करें!',
    next: 'अगला',
    previous: 'पिछला',
    submit: 'जमा करें',
    hint: 'संकेत',
    skip: 'छोड़ें',
    learning: 'सीखें',
    practice: 'अभ्यास',
    selectLanguage: 'भाषा चुनें',
    chapterTitle: '3-D आकृतियां बनाने के लिए नेट',
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
    // Overview page translations
    overviewTitle: 'अभ्यास पूरा!',
    overviewSubtitle: 'सभी अभ्यास पूरे करने का बहुत अच्छा काम!',
    yourScore: 'आपका स्कोर',
    totalQuestions: 'कुल प्रश्न',
    correctAnswers: 'सही उत्तर',
    accuracy: 'सटीकता',
    totalAttempts: 'कुल प्रयास',
    restartPractice: 'अभ्यास फिर से शुरू करें',
    backToLearning: 'सीखने पर वापस जाएं',
    excellentWork: 'उत्कृष्ट काम!',
    goodJob: 'अच्छा काम!',
    keepPracticing: 'अभ्यास जारी रखें!',
    // NetsExplanation translations
    netsTitle: '13.3: 3-D आकृतियां बनाने के लिए नेट',
    keyDefinitions: 'सारांश से मुख्य परिभाषाएं',
    netDefinition: 'नेट:',
    netDefinitionText: '3-D ठोस का 2-D "कंकाल-रूपरेखा"।',
    actionDefinition: 'कार्रवाई:',
    actionDefinitionText: 'एक नेट एक पैटर्न है जो मुड़ने पर 3-D आकृति बनाता है।',
    processDefinition: 'प्रक्रिया:',
    processDefinitionText: 'आप एक 3-D वस्तु लेकर, जैसे कार्डबोर्ड बॉक्स, उसके किनारों को काटकर और इसे सपाट बिछाकर नेट प्राप्त कर सकते हैं। यह एनिमेशन रिवर्स दिखाता है: नेट को वापस 3-D आकृति में मोड़ना।',
    interactiveAnimation: 'इंटरैक्टिव एनिमेशन: घन नेट',
    animationDescription: '2D नेट को 3D घन में मुड़ते हुए देखने के लिए बटन पर क्लिक करें।',
    foldIntoCube: 'घन में मोड़ें',
    unfoldToNet: 'नेट में खोलें',
    faceFront: 'सामने',
    faceBack: 'पीछे',
    faceTop: 'ऊपर',
    faceBottom: 'नीचे',
    faceLeft: 'बाएं',
    faceRight: 'दाएं'
  },
  gu: {
    correct: 'સાચું!',
    incorrect: 'ફરી કોશિશ કરો!',
    next: 'આગળ',
    previous: 'પાછળ',
    submit: 'જમા કરો',
    hint: 'સંકેત',
    skip: 'છોડો',
    learning: 'શીખો',
    practice: 'અભ્યાસ',
    selectLanguage: 'ભાષા પસંદ કરો',
    chapterTitle: '3-D આકૃતિઓ બનાવવા માટે નેટ',
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
    // Overview page translations
    overviewTitle: 'અભ્યાસ પૂર્ણ!',
    overviewSubtitle: 'બધા અભ્યાસ પૂરા કરવાનું ખૂબ સારું કામ!',
    yourScore: 'તમારો સ્કોર',
    totalQuestions: 'કુલ પ્રશ્નો',
    correctAnswers: 'સાચા જવાબો',
    accuracy: 'ચોકસાઈ',
    totalAttempts: 'કુલ પ્રયાસો',
    restartPractice: 'અભ્યાસ ફરીથી શરૂ કરો',
    backToLearning: 'શીખવા પર પાછા જાઓ',
    excellentWork: 'ઉત્તમ કામ!',
    goodJob: 'સારું કામ!',
    keepPracticing: 'અભ્યાસ ચાલુ રાખો!',
    // NetsExplanation translations
    netsTitle: '13.3: 3-D આકૃતિઓ બનાવવા માટે નેટ',
    keyDefinitions: 'સારાંશમાંથી મુખ્ય વ્યાખ્યાઓ',
    netDefinition: 'નેટ:',
    netDefinitionText: '3-D ઘનની 2-D "કંકાલ-રૂપરેખા"।',
    actionDefinition: 'ક્રિયા:',
    actionDefinitionText: 'નેટ એ એક પેટર્ન છે જે મુડવાથી 3-D આકૃતિ બનાવે છે।',
    processDefinition: 'પ્રક્રિયા:',
    processDefinitionText: 'તમે 3-D વસ્તુ લઈને, જેવી કે કાર્ડબોર્ડ બોક્સ, તેના કિનારાઓને કાપીને અને તેને સપાટ પાથરીને નેટ મેળવી શકો છો. આ એનિમેશન રિવર્સ દર્શાવે છે: નેટને પાછળથી 3-D આકૃતિમાં મુડવું।',
    interactiveAnimation: 'ઇન્ટરેક્ટિવ એનિમેશન: ઘન નેટ',
    animationDescription: '2D નેટને 3D ઘનમાં મુડતું જોવા માટે બટન પર ક્લિક કરો।',
    foldIntoCube: 'ઘનમાં મુડો',
    unfoldToNet: 'નેરમાં ખોલો',
    faceFront: 'આગળ',
    faceBack: 'પાછળ',
    faceTop: 'ઉપર',
    faceBottom: 'નીચે',
    faceLeft: 'ડાબે',
    faceRight: 'જમણે'
  }
};

// Practice exercises with visual shapes data
const practiceExercises: PracticeExercise[] = [
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

// SVG Shape Component for practice exercises
const ShapeSVG: React.FC<{ shapeName: string; size?: number }> = ({ shapeName, size = 120 }) => {
  const renderShape = () => {
    const viewBox = `0 0 ${size} ${size}`;
    const center = size / 2;
    const radius = size * 0.35;
    const rectSize = size * 0.6;
    const rectOffset = (size - rectSize) / 2;

    switch (shapeName) {
      case 'Circle':
        return (
          <svg viewBox={viewBox} className="w-full h-full">
            <circle cx={center} cy={center} r={radius} fill="#14b8a6" stroke="#0d9488" strokeWidth="3" />
            <line x1={center} y1={center} x2={center + radius} y2={center} stroke="#0d9488" strokeWidth="2" strokeDasharray="3,3" />
            <circle cx={center} cy={center} r="2" fill="#0d9488" />
            <text x={center + radius/2} y={center - 5} fill="#0d9488" fontSize="10" fontWeight="bold">r</text>
          </svg>
        );
      
      case 'Rectangle':
        return (
          <svg viewBox={viewBox} className="w-full h-full">
            <rect x={rectOffset} y={rectOffset + size * 0.1} width={rectSize} height={rectSize * 0.7} fill="#14b8a6" stroke="#0d9488" strokeWidth="3" />
            <text x={center} y={center} fill="#fff" fontSize="10" fontWeight="bold">l</text>
            <text x={rectOffset - 15} y={center} fill="#0d9488" fontSize="10" fontWeight="bold">w</text>
          </svg>
        );
      
      case 'Square':
        return (
          <svg viewBox={viewBox} className="w-full h-full">
            <rect x={rectOffset} y={rectOffset} width={rectSize} height={rectSize} fill="#14b8a6" stroke="#0d9488" strokeWidth="3" />
            <text x={center} y={center} fill="#fff" fontSize="10" fontWeight="bold">s</text>
          </svg>
        );
      
      case 'Cross':
        return (
          <svg viewBox={viewBox} className="w-full h-full">
            {/* Cross-shaped net pattern */}
            <rect x={center - rectSize/2} y={center - rectSize/2} width={rectSize/2} height={rectSize/2} fill="#14b8a6" stroke="#0d9488" strokeWidth="2" />
            <rect x={center} y={center - rectSize/2} width={rectSize/2} height={rectSize/2} fill="#14b8a6" stroke="#0d9488" strokeWidth="2" />
            <rect x={center - rectSize/2} y={center} width={rectSize/2} height={rectSize/2} fill="#14b8a6" stroke="#0d9488" strokeWidth="2" />
            <rect x={center} y={center} width={rectSize/2} height={rectSize/2} fill="#14b8a6" stroke="#0d9488" strokeWidth="2" />
            <rect x={center - rectSize} y={center - rectSize/2} width={rectSize/2} height={rectSize/2} fill="#14b8a6" stroke="#0d9488" strokeWidth="2" />
            <rect x={center + rectSize/2} y={center - rectSize/2} width={rectSize/2} height={rectSize/2} fill="#14b8a6" stroke="#0d9488" strokeWidth="2" />
            <text x={center} y={center + rectSize/2 + 20} fill="#0d9488" fontSize="10" fontWeight="bold">Cube Net</text>
          </svg>
        );
      
      case 'L-shape':
        return (
          <svg viewBox={viewBox} className="w-full h-full">
            {/* L-shaped net pattern */}
            <rect x={center - rectSize/2} y={center - rectSize/2} width={rectSize/2} height={rectSize/2} fill="#14b8a6" stroke="#0d9488" strokeWidth="2" />
            <rect x={center} y={center - rectSize/2} width={rectSize/2} height={rectSize/2} fill="#14b8a6" stroke="#0d9488" strokeWidth="2" />
            <rect x={center - rectSize/2} y={center} width={rectSize/2} height={rectSize/2} fill="#14b8a6" stroke="#0d9488" strokeWidth="2" />
            <rect x={center} y={center} width={rectSize/2} height={rectSize/2} fill="#14b8a6" stroke="#0d9488" strokeWidth="2" />
            <rect x={center - rectSize} y={center} width={rectSize/2} height={rectSize/2} fill="#14b8a6" stroke="#0d9488" strokeWidth="2" />
            <rect x={center - rectSize/2} y={center + rectSize/2} width={rectSize/2} height={rectSize/2} fill="#14b8a6" stroke="#0d9488" strokeWidth="2" />
            <text x={center} y={center + rectSize + 20} fill="#0d9488" fontSize="10" fontWeight="bold">L-shaped Net</text>
          </svg>
        );
      
      case 'Cone':
        return (
          <svg viewBox={viewBox} className="w-full h-full">
            {/* Cone net pattern */}
            <circle cx={center} cy={center + rectSize/3} r={radius/2} fill="#a855f7" stroke="#7c3aed" strokeWidth="2" />
            <polygon points={`${center},${center - rectSize/3} ${center - radius/2},${center + rectSize/3} ${center + radius/2},${center + rectSize/3}`} fill="#a855f7" stroke="#7c3aed" strokeWidth="2" />
            <text x={center - 20} y={center + rectSize/2 + 20} fill="#7c3aed" fontSize="10" fontWeight="bold">Cone Net</text>
          </svg>
        );
      
      case 'Cylinder':
        return (
          <svg viewBox={viewBox} className="w-full h-full">
            {/* Cylinder net pattern */}
            <circle cx={center} cy={center - rectSize/4} r={radius/2} fill="#10b981" stroke="#059669" strokeWidth="2" />
            <circle cx={center} cy={center + rectSize/4} r={radius/2} fill="#10b981" stroke="#059669" strokeWidth="2" />
            <rect x={center - radius/2} y={center - rectSize/4} width={radius} height={rectSize/2} fill="#10b981" stroke="#059669" strokeWidth="2" />
            <text x={center - 25} y={center + rectSize/2 + 20} fill="#059669" fontSize="10" fontWeight="bold">Cylinder Net</text>
          </svg>
        );
      
      case 'Pyramid':
        return (
          <svg viewBox={viewBox} className="w-full h-full">
            {/* Pyramid net pattern */}
            <polygon points={`${center},${center - rectSize/3} ${center - rectSize/3},${center + rectSize/6} ${center + rectSize/3},${center + rectSize/6}`} fill="#a855f7" stroke="#7c3aed" strokeWidth="2" />
            <polygon points={`${center - rectSize/3},${center + rectSize/6} ${center + rectSize/3},${center + rectSize/6} ${center + rectSize/6},${center + rectSize/2} ${center - rectSize/6},${center + rectSize/2}`} fill="#a855f7" stroke="#7c3aed" strokeWidth="2" />
            <text x={center - 20} y={center + rectSize/2 + 20} fill="#7c3aed" fontSize="10" fontWeight="bold">Pyramid Net</text>
          </svg>
        );
      
      case 'Cuboid':
        const cubeOffset = size * 0.2;
        const cubeSize = size * 0.5;
        const depth = size * 0.15;
        return (
          <svg viewBox={viewBox} className="w-full h-full">
            <path d={`M${cubeOffset},${cubeOffset + depth} L${cubeOffset + cubeSize},${cubeOffset + depth} L${cubeOffset + cubeSize},${cubeOffset + cubeSize + depth} L${cubeOffset},${cubeOffset + cubeSize + depth} Z`} fill="#a855f7" stroke="#7c3aed" strokeWidth="2" />
            <path d={`M${cubeOffset},${cubeOffset + depth} L${cubeOffset + depth},${cubeOffset} L${cubeOffset + cubeSize + depth},${cubeOffset} L${cubeOffset + cubeSize},${cubeOffset + depth} Z`} fill="#c084fc" stroke="#7c3aed" strokeWidth="2" />
            <path d={`M${cubeOffset + cubeSize},${cubeOffset + depth} L${cubeOffset + cubeSize + depth},${cubeOffset} L${cubeOffset + cubeSize + depth},${cubeOffset + cubeSize} L${cubeOffset + cubeSize},${cubeOffset + cubeSize + depth} Z`} fill="#9333ea" stroke="#7c3aed" strokeWidth="2" />
            <text x={center} y={center + 10} fill="#fff" fontSize="9" fontWeight="bold">Cuboid</text>
          </svg>
        );
      
      case 'Cylinder3D':
        const cylHeight = size * 0.5;
        const cylRadius = size * 0.25;
        const cylTop = rectOffset + size * 0.1;
        return (
          <svg viewBox={viewBox} className="w-full h-full">
            <ellipse cx={center} cy={cylTop} rx={cylRadius} ry={size * 0.08} fill="#a855f7" stroke="#7c3aed" strokeWidth="2" />
            <rect x={center - cylRadius} y={cylTop} width={cylRadius * 2} height={cylHeight} fill="#a855f7" stroke="none" />
            <line x1={center - cylRadius} y1={cylTop} x2={center - cylRadius} y2={cylTop + cylHeight} stroke="#7c3aed" strokeWidth="2" />
            <line x1={center + cylRadius} y1={cylTop} x2={center + cylRadius} y2={cylTop + cylHeight} stroke="#7c3aed" strokeWidth="2" />
            <ellipse cx={center} cy={cylTop + cylHeight} rx={cylRadius} ry={size * 0.08} fill="#9333ea" stroke="#7c3aed" strokeWidth="2" />
            <text x={center - 15} y={center} fill="#fff" fontSize="9" fontWeight="bold">Cylinder</text>
          </svg>
        );
      
      case 'Cube':
        const cubeOffset2 = size * 0.2;
        const cubeSize2 = size * 0.5;
        const depth2 = size * 0.15;
        return (
          <svg viewBox={viewBox} className="w-full h-full">
            <path d={`M${cubeOffset2},${cubeOffset2 + depth2 + 10} L${cubeOffset2 + cubeSize2},${cubeOffset2 + depth2 + 10} L${cubeOffset2 + cubeSize2},${cubeOffset2 + cubeSize2 + depth2 + 10} L${cubeOffset2},${cubeOffset2 + cubeSize2 + depth2 + 10} Z`} fill="#a855f7" stroke="#7c3aed" strokeWidth="2" />
            <path d={`M${cubeOffset2},${cubeOffset2 + depth2 + 10} L${cubeOffset2 + depth2},${cubeOffset2 + 10} L${cubeOffset2 + cubeSize2 + depth2},${cubeOffset2 + 10} L${cubeOffset2 + cubeSize2},${cubeOffset2 + depth2 + 10} Z`} fill="#c084fc" stroke="#7c3aed" strokeWidth="2" />
            <path d={`M${cubeOffset2 + cubeSize2},${cubeOffset2 + depth2 + 10} L${cubeOffset2 + cubeSize2 + depth2},${cubeOffset2 + 10} L${cubeOffset2 + cubeSize2 + depth2},${cubeOffset2 + cubeSize2 + 10} L${cubeOffset2 + cubeSize2},${cubeOffset2 + cubeSize2 + depth2 + 10} Z`} fill="#9333ea" stroke="#7c3aed" strokeWidth="2" />
            <text x={center} y={center + 15} fill="#fff" fontSize="9" fontWeight="bold">Cube</text>
          </svg>
        );
      
      case 'Sphere':
        return (
          <svg viewBox={viewBox} className="w-full h-full">
            <defs>
              <radialGradient id={`sphereGradient-${size}`}>
                <stop offset="30%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#7c3aed" />
              </radialGradient>
            </defs>
            <circle cx={center} cy={center} r={radius} fill={`url(#sphereGradient-${size})`} stroke="#7c3aed" strokeWidth="2" />
            <ellipse cx={center} cy={center} rx={radius} ry={radius * 0.3} fill="none" stroke="#6d28d9" strokeWidth="1.5" opacity="0.6" />
            <ellipse cx={center} cy={center} rx={radius * 0.3} ry={radius} fill="none" stroke="#6d28d9" strokeWidth="1.5" opacity="0.6" />
            <text x={center - 15} y={center + radius + 15} fill="#4c1d95" fontSize="9" fontWeight="bold">Sphere</text>
          </svg>
        );
      
      case 'Cone3D':
        const coneBase = size * 0.4;
        const coneHeight = size * 0.6;
        const coneTop = rectOffset;
        const coneBottom = coneTop + coneHeight;
        return (
          <svg viewBox={viewBox} className="w-full h-full">
            <ellipse cx={center} cy={coneBottom} rx={coneBase * 0.5} ry={size * 0.08} fill="#a855f7" stroke="#7c3aed" strokeWidth="2" />
            <path d={`M${center - coneBase * 0.5},${coneBottom} L${center},${coneTop} L${center + coneBase * 0.5},${coneBottom}`} fill="#9333ea" stroke="#7c3aed" strokeWidth="2" />
            <text x={center - 10} y={center + 25} fill="#fff" fontSize="9" fontWeight="bold">Cone</text>
          </svg>
        );
      
      default:
        return (
          <svg viewBox={viewBox} className="w-full h-full">
            <circle cx={center} cy={center} r={radius} fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" />
            <text x={center} y={center} fill="#6b7280" fontSize="10" textAnchor="middle" dominantBaseline="middle">?</text>
          </svg>
        );
    }
  };

  return <div className="w-full h-full flex items-center justify-center">{renderShape()}</div>;
};

const NetFoldingAnimation: React.FC = () => {
  const [selectedShape, setSelectedShape] = useState<ShapeType>('cube');
  const [isAnimating, setIsAnimating] = useState(false);
  const [foldProgress, setFoldProgress] = useState(0);

  const shapes: ShapeOption[] = [
    { id: 'cube', name: 'Cube', color: 'from-blue-400 to-blue-600' },
    { id: 'pyramid', name: 'Pyramid', color: 'from-amber-400 to-amber-600' },
    { id: 'cone', name: 'Cone', color: 'from-rose-400 to-rose-600' }
  ];

  const startAnimation = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setFoldProgress(0);
    
    const duration = 4000;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      setFoldProgress(progress);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };
    
    requestAnimationFrame(animate);
  };

  const resetAnimation = () => {
    setIsAnimating(false);
    setFoldProgress(0);
  };

  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const renderCubeNet = () => {
    const progress = easeInOutCubic(foldProgress);
    const size = 90;
    const halfSize = size / 2;
    
    // When animation completes, show perfect cube
    if (progress >= 0.95) {
      const finalRotateY = progress > 0.95 ? (progress - 0.95) * 20 * 360 : 0;
      
      return (
        <div 
          className="relative"
          style={{ 
            transform: `rotateX(-25deg) rotateY(${-35 + finalRotateY}deg)`,
            transformStyle: 'preserve-3d',
            width: `${size}px`,
            height: `${size}px`
          }}
        >
          {/* Front Face */}
          <div 
            className="absolute bg-gradient-to-br from-blue-400 to-blue-600 border border-white/60 flex items-center justify-center text-white font-bold text-sm"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              transform: `translateZ(${halfSize}px)`,
              transformStyle: 'preserve-3d',
              left: `-${halfSize}px`,
              top: `-${halfSize}px`,
              backfaceVisibility: 'visible'
            }}
          >
            FRONT
          </div>
          
          {/* Back Face */}
          <div 
            className="absolute bg-gradient-to-br from-blue-400 to-blue-600 border border-white/60 flex items-center justify-center text-white font-bold text-sm"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              transform: `translateZ(${-halfSize}px) rotateY(180deg)`,
              transformStyle: 'preserve-3d',
              left: `-${halfSize}px`,
              top: `-${halfSize}px`,
              backfaceVisibility: 'visible'
            }}
          >
            BACK
          </div>
          
          {/* Top Face */}
          <div 
            className="absolute bg-gradient-to-br from-blue-300 to-blue-500 border border-white/60 flex items-center justify-center text-white font-bold text-sm"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              transform: `rotateX(90deg) translateZ(${halfSize}px)`,
              transformStyle: 'preserve-3d',
              left: `-${halfSize}px`,
              top: `-${halfSize}px`,
              backfaceVisibility: 'visible'
            }}
          >
            TOP
          </div>
          
          {/* Bottom Face */}
          <div 
            className="absolute bg-gradient-to-br from-blue-600 to-blue-800 border border-white/60 flex items-center justify-center text-white font-bold text-sm"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              transform: `rotateX(-90deg) translateZ(${halfSize}px)`,
              transformStyle: 'preserve-3d',
              left: `-${halfSize}px`,
              top: `-${halfSize}px`,
              backfaceVisibility: 'visible'
            }}
          >
            BOTTOM
          </div>
          
          {/* Right Face */}
          <div 
            className="absolute bg-gradient-to-br from-blue-500 to-blue-700 border border-white/60 flex items-center justify-center text-white font-bold text-sm"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              transform: `rotateY(90deg) translateZ(${halfSize}px)`,
              transformStyle: 'preserve-3d',
              left: `-${halfSize}px`,
              top: `-${halfSize}px`,
              backfaceVisibility: 'visible'
            }}
          >
            RIGHT
          </div>
          
          {/* Left Face */}
          <div 
            className="absolute bg-gradient-to-br from-blue-500 to-blue-700 border border-white/60 flex items-center justify-center text-white font-bold text-sm"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              transform: `rotateY(-90deg) translateZ(${halfSize}px)`,
              transformStyle: 'preserve-3d',
              left: `-${halfSize}px`,
              top: `-${halfSize}px`,
              backfaceVisibility: 'visible'
            }}
          >
            LEFT
          </div>
        </div>
      );
    }
    
    // Folding animation
    const phase1 = Math.min(progress * 1.5, 1);
    const phase2 = Math.min(Math.max((progress - 0.25) * 1.5, 0), 1);
    const phase3 = Math.min(Math.max((progress - 0.5) * 2, 0), 1);
    
    const topAngle = phase1 * 90;
    const bottomAngle = phase1 * 90;
    const leftAngle = phase2 * 90;
    const rightAngle = phase2 * 90;
    const backAngle = phase3 * 180;
    const moveZ = phase3 * halfSize;
    
    return (
      <div 
        className="relative"
        style={{ 
          transform: `rotateX(-20deg) rotateY(-30deg)`,
          transformStyle: 'preserve-3d',
          width: `${size}px`,
          height: `${size}px`
        }}
      >
        {/* Front Face */}
        <div 
          className="absolute bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white/80 flex items-center justify-center text-white font-bold"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            transform: `translateZ(${moveZ}px)`,
            transformStyle: 'preserve-3d',
            left: `-${halfSize}px`,
            top: `-${halfSize}px`
          }}
        >
          FRONT
        </div>
        
        {/* Top Face */}
        <div 
          className="absolute bg-gradient-to-br from-blue-300 to-blue-500 border-2 border-white/80 flex items-center justify-center text-white font-bold"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            transformOrigin: 'bottom center',
            transform: `translateY(-${size}px) rotateX(-${topAngle}deg) translateZ(${moveZ}px)`,
            transformStyle: 'preserve-3d',
            left: `-${halfSize}px`,
            top: `-${halfSize}px`
          }}
        >
          TOP
        </div>
        
        {/* Bottom Face */}
        <div 
          className="absolute bg-gradient-to-br from-blue-600 to-blue-800 border-2 border-white/80 flex items-center justify-center text-white font-bold"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            transformOrigin: 'top center',
            transform: `translateY(${size}px) rotateX(${bottomAngle}deg) translateZ(${moveZ}px)`,
            transformStyle: 'preserve-3d',
            left: `-${halfSize}px`,
            top: `-${halfSize}px`
          }}
        >
          BOTTOM
        </div>
        
        {/* Left Face */}
        <div 
          className="absolute bg-gradient-to-br from-blue-500 to-blue-700 border-2 border-white/80 flex items-center justify-center text-white font-bold"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            transformOrigin: 'right center',
            transform: `translateX(-${size}px) rotateY(${leftAngle}deg) translateZ(${moveZ}px)`,
            transformStyle: 'preserve-3d',
            left: `-${halfSize}px`,
            top: `-${halfSize}px`
          }}
        >
          LEFT
        </div>
        
        {/* Right Face */}
        <div 
          className="absolute bg-gradient-to-br from-blue-500 to-blue-700 border-2 border-white/80 flex items-center justify-center text-white font-bold"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            transformOrigin: 'left center',
            transform: `translateX(${size}px) rotateY(-${rightAngle}deg) translateZ(${moveZ}px)`,
            transformStyle: 'preserve-3d',
            left: `-${halfSize}px`,
            top: `-${halfSize}px`
          }}
        >
          RIGHT
        </div>
        
        {/* Back Face */}
        <div 
          className="absolute bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white/80 flex items-center justify-center text-white font-bold"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            transformOrigin: 'right center',
            transform: `translateX(-${size * 2}px) rotateY(${backAngle}deg) translateZ(-${moveZ}px)`,
            transformStyle: 'preserve-3d',
            left: `-${halfSize}px`,
            top: `-${halfSize}px`
          }}
        >
          BACK
        </div>
      </div>
    );
  };

  const renderPyramidNet = () => {
    const progress = easeInOutCubic(foldProgress);
    const baseSize = 90;
    const pyramidHeight = 75; // Increased height for better proportions
    
    // Perfect pyramid at the end
    if (progress >= 0.95) {
      const finalRotateY = progress > 0.95 ? (progress - 0.95) * 20 * 360 : 0;
      const halfBase = baseSize / 2;
      
      // Calculate proper pyramid angle (arctan of height/half-base)
      const pyramidAngle = Math.atan(pyramidHeight / halfBase) * (180 / Math.PI);
      
      return (
        <div 
          className="relative"
          style={{ 
            transform: `rotateX(-25deg) rotateY(${-35 + finalRotateY}deg)`,
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Base Square */}
          <div 
            className="absolute bg-gradient-to-br from-amber-600 to-amber-800 border border-white/60"
            style={{
              width: `${baseSize}px`,
              height: `${baseSize}px`,
              transform: `rotateX(90deg) translateZ(0px)`,
              transformStyle: 'preserve-3d',
              left: `-${halfBase}px`,
              top: `-${halfBase}px`
            }}
          />
          
          {/* Front Triangle */}
          <div 
            className="absolute"
            style={{
              width: 0,
              height: 0,
              borderLeft: `${halfBase}px solid transparent`,
              borderRight: `${halfBase}px solid transparent`,
              borderBottom: `${pyramidHeight}px solid #f59e0b`,
              transform: `translateY(${halfBase}px) rotateX(-${pyramidAngle}deg) translateZ(${halfBase * 0.5}px)`,
              transformStyle: 'preserve-3d',
              left: `-${halfBase}px`,
              top: `-${halfBase}px`,
              filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))'
            }}
          />
          
          {/* Right Triangle */}
          <div 
            className="absolute"
            style={{
              width: 0,
              height: 0,
              borderLeft: `${halfBase}px solid transparent`,
              borderRight: `${halfBase}px solid transparent`,
              borderBottom: `${pyramidHeight}px solid #d97706`,
              transform: `translateX(${halfBase}px) rotateY(90deg) rotateX(-${pyramidAngle}deg) translateZ(${halfBase * 0.5}px)`,
              transformStyle: 'preserve-3d',
              left: `-${halfBase}px`,
              top: `-${halfBase}px`,
              filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))'
            }}
          />
          
          {/* Back Triangle */}
          <div 
            className="absolute"
            style={{
              width: 0,
              height: 0,
              borderLeft: `${halfBase}px solid transparent`,
              borderRight: `${halfBase}px solid transparent`,
              borderBottom: `${pyramidHeight}px solid #f59e0b`,
              transform: `translateY(-${halfBase}px) rotateY(180deg) rotateX(-${pyramidAngle}deg) translateZ(${halfBase * 0.5}px)`,
              transformStyle: 'preserve-3d',
              left: `-${halfBase}px`,
              top: `-${halfBase}px`,
              filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))'
            }}
          />
          
          {/* Left Triangle */}
          <div 
            className="absolute"
            style={{
              width: 0,
              height: 0,
              borderLeft: `${halfBase}px solid transparent`,
              borderRight: `${halfBase}px solid transparent`,
              borderBottom: `${pyramidHeight}px solid #d97706`,
              transform: `translateX(-${halfBase}px) rotateY(-90deg) rotateX(-${pyramidAngle}deg) translateZ(${halfBase * 0.5}px)`,
              transformStyle: 'preserve-3d',
              left: `-${halfBase}px`,
              top: `-${halfBase}px`,
              filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))'
            }}
          />
          
          {/* Apex point */}
          <div 
            className="absolute w-3 h-3 bg-amber-300 rounded-full"
            style={{
              transform: `translateY(-${pyramidHeight}px) translateZ(0px)`,
              transformStyle: 'preserve-3d',
              left: `-${halfBase}px`,
              top: `-${halfBase}px`,
              boxShadow: '0 3px 6px rgba(0,0,0,0.5)'
            }}
          />
        </div>
      );
    }
    
    // Folding animation
    const triangleHeight = 90;
    const halfBase = baseSize / 2;
    
    // Improved folding sequence - each triangle folds at different times
    const frontFold = Math.min(progress * 2.5, 1) * 54;
    const rightFold = Math.min(Math.max((progress - 0.15) * 2.5, 0), 1) * 54;
    const backFold = Math.min(Math.max((progress - 0.3) * 2.5, 0), 1) * 54;
    const leftFold = Math.min(Math.max((progress - 0.45) * 2.5, 0), 1) * 54;
    
    return (
      <div 
        className="relative"
        style={{ 
          transform: `rotateX(-25deg) rotateY(-35deg)`,
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Base Square */}
        <div 
          className="absolute bg-gradient-to-br from-amber-600 to-amber-800 border-2 border-white/80 flex items-center justify-center text-white font-bold"
          style={{
            width: `${baseSize}px`,
            height: `${baseSize}px`,
            transform: `rotateX(90deg)`,
            transformStyle: 'preserve-3d',
            left: `-${halfBase}px`,
            top: `-${halfBase}px`,
            fontSize: '12px'
          }}
        >
          BASE
        </div>
        
        {/* Front Triangle */}
        <div 
          style={{
            position: 'absolute',
            transformOrigin: 'bottom center',
            transform: `translateX(0px) translateY(${halfBase}px) rotateX(${90 - frontFold}deg)`,
            transformStyle: 'preserve-3d',
            left: `-${halfBase}px`,
            top: `-${halfBase}px`
          }}
        >
          <div 
            style={{
              width: 0,
              height: 0,
              borderLeft: `${halfBase}px solid transparent`,
              borderRight: `${halfBase}px solid transparent`,
              borderBottom: `${triangleHeight}px solid #f59e0b`,
              filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))'
            }}
          />
        </div>
        
        {/* Right Triangle */}
        <div 
          style={{
            position: 'absolute',
            transformOrigin: 'bottom center',
            transform: `translateX(${halfBase}px) translateY(0px) rotateY(90deg) rotateX(${90 - rightFold}deg)`,
            transformStyle: 'preserve-3d',
            left: `-${halfBase}px`,
            top: `-${halfBase}px`
          }}
        >
          <div 
            style={{
              width: 0,
              height: 0,
              borderLeft: `${halfBase}px solid transparent`,
              borderRight: `${halfBase}px solid transparent`,
              borderBottom: `${triangleHeight}px solid #d97706`,
              filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))'
            }}
          />
        </div>
        
        {/* Back Triangle */}
        <div 
          style={{
            position: 'absolute',
            transformOrigin: 'bottom center',
            transform: `translateX(0px) translateY(-${halfBase}px) rotateY(180deg) rotateX(${90 - backFold}deg)`,
            transformStyle: 'preserve-3d',
            left: `-${halfBase}px`,
            top: `-${halfBase}px`
          }}
        >
          <div 
            style={{
              width: 0,
              height: 0,
              borderLeft: `${halfBase}px solid transparent`,
              borderRight: `${halfBase}px solid transparent`,
              borderBottom: `${triangleHeight}px solid #f59e0b`,
              filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))'
            }}
          />
        </div>
        
        {/* Left Triangle */}
        <div 
          style={{
            position: 'absolute',
            transformOrigin: 'bottom center',
            transform: `translateX(-${halfBase}px) translateY(0px) rotateY(-90deg) rotateX(${90 - leftFold}deg)`,
            transformStyle: 'preserve-3d',
            left: `-${halfBase}px`,
            top: `-${halfBase}px`
          }}
        >
          <div 
            style={{
              width: 0,
              height: 0,
              borderLeft: `${halfBase}px solid transparent`,
              borderRight: `${halfBase}px solid transparent`,
              borderBottom: `${triangleHeight}px solid #d97706`,
              filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))'
            }}
          />
        </div>
      </div>
    );
  };

  const renderConeNet = () => {
    const progress = easeInOutCubic(foldProgress);
    const radius = 50;
    const height = 100;
    
    const curlProgress = Math.min(progress * 1.3, 1);
    const rollAngle = curlProgress * 360;
    const baseMove = Math.min(Math.max((progress - 0.3) * 2, 0), 1);
    const baseFold = baseMove * 90;
    const finalRotateY = progress > 0.7 ? (progress - 0.7) * 3.33 * 360 : 0;
    
    return (
      <div 
        className="relative"
        style={{ 
          transform: `rotateX(-20deg) rotateY(${finalRotateY}deg)`,
          transformStyle: 'preserve-3d'
        }}
      >
        <div style={{ transformStyle: 'preserve-3d', position: 'relative' }}>
          
          {/* Cone surface */}
          <div 
            style={{
              position: 'absolute',
              width: `${radius * 2}px`,
              height: `${height}px`,
              transformOrigin: 'bottom left',
              transform: `rotateY(${rollAngle}deg)`,
              transformStyle: 'preserve-3d',
              left: `-${radius}px`,
              top: `-${height}px`,
            }}
          >
            <div
              style={{
                width: `${radius * 2}px`,
                height: `${height}px`,
                background: 'linear-gradient(to bottom right, #fb7185, #e11d48)',
                border: '2px solid rgba(255,255,255,0.8)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                clipPath: curlProgress < 0.5 
                  ? 'polygon(50% 0%, 85% 50%, 50% 100%, 15% 50%)'
                  : 'none',
                borderRadius: curlProgress > 0.5 ? '50%' : '0%',
                transformStyle: 'preserve-3d',
              }}
            />
          </div>
          
          {/* Circular base */}
          <div 
            style={{
              position: 'absolute',
              width: `${radius * 1.6}px`,
              height: `${radius * 1.6}px`,
              borderRadius: '50%',
              background: 'linear-gradient(to bottom right, #f43f5e, #be123c)',
              border: '2px solid rgba(255,255,255,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              transformOrigin: 'center center',
              transform: `translateX(${radius * 0.8}px) translateY(${height - radius * 0.8}px) rotateX(${baseFold}deg) translateZ(${baseMove * -30}px)`,
              transformStyle: 'preserve-3d',
              left: `-${radius}px`,
              top: `-${height}px`,
              fontSize: '11px'
            }}
          >
            BASE
          </div>
          
          {/* Cone tip */}
          {progress > 0.5 && (
            <div 
              style={{
                position: 'absolute',
                width: '6px',
                height: '6px',
                background: '#fda4af',
                borderRadius: '50%',
                boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
                transform: `translateX(0px) translateY(${-height + 20}px) translateZ(5px)`,
                transformStyle: 'preserve-3d',
                left: `-${radius}px`,
                top: `-${height}px`,
              }}
            />
          )}
        </div>
      </div>
    );
  };

  const renderShape = () => {
    switch (selectedShape) {
      case 'cube':
        return renderCubeNet();
      case 'pyramid':
        return renderPyramidNet();
      case 'cone':
        return renderConeNet();
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-8">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">3D Net Folding Animation</h1>
          <p className="text-purple-200">Watch how 2D nets fold into perfect 3D shapes</p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          {shapes.map((shape) => (
            <button
              key={shape.id}
              onClick={() => {
                setSelectedShape(shape.id);
                resetAnimation();
              }}
              className={`px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                selectedShape === shape.id
                  ? `bg-gradient-to-r ${shape.color} text-white shadow-lg`
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {shape.name}
            </button>
          ))}
        </div>

        <div 
          className="relative bg-white/5 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-8 flex items-center justify-center overflow-hidden"
          style={{ height: '500px', perspective: '1200px' }}
        >
          {renderShape()}
        </div>

        <div className="flex justify-center items-center gap-4">
          <button
            onClick={isAnimating ? () => setIsAnimating(false) : startAnimation}
            disabled={foldProgress === 1 && !isAnimating}
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isAnimating ? (
              <>
                <Pause className="w-5 h-5" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                {foldProgress === 0 ? 'Start' : 'Resume'}
              </>
            )}
          </button>
          
          <button
            onClick={resetAnimation}
            className="flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all transform hover:scale-105 shadow-lg"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
        </div>

      </div>
    </div>
  );
};

const Chapter13Tool: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<'demonstration' | 'practice' | 'realworld'>('demonstration');
  const [language, setLanguage] = useState<'en' | 'hi' | 'gu'>(() => {
    const savedLanguage = localStorage.getItem('ch13-13-3-language');
    return (savedLanguage as 'en' | 'hi' | 'gu') || 'en';
  });
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [studentAnswer, setStudentAnswer] = useState<string>('');
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [showOverview, setShowOverview] = useState(false);
  const [practiceStats, setPracticeStats] = useState({
    totalQuestions: 0,
    correctAnswers: 0,
    totalAttempts: 0
  });

  const t = translations[language];

  // Handle language change and save to localStorage
  const handleLanguageChange = (newLanguage: 'en' | 'hi' | 'gu') => {
    setLanguage(newLanguage);
    localStorage.setItem('ch13-13-3-language', newLanguage);
  };

  // Auto-progression for demonstration mode
  useEffect(() => {
    if (currentMode === 'demonstration') {
      const timer = setTimeout(() => {
        setCurrentStep(prev => (prev + 1) % 3);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [currentMode, currentStep]);

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

    // Update statistics
    setPracticeStats(prev => ({
      totalQuestions: prev.totalQuestions + 1,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      totalAttempts: prev.totalAttempts + newAttempts
    }));

    if (isCorrect) {
      setFeedback(t.correct);
      
      setTimeout(() => {
        if (currentExerciseIndex < practiceExercises.length - 1) {
          setCurrentExerciseIndex(prev => prev + 1);
        } else {
          // All questions completed, show overview
          setShowOverview(true);
        }
        setStudentAnswer('');
        setFeedback('');
        setShowHint(false);
        setAttempts(0);
      }, 1500);
    } else {
      setFeedback(t.incorrect);
      setAttempts(newAttempts);
    }
  };

  const handleSkip = () => {
    const currentExercise = practiceExercises[currentExerciseIndex];
    if (!currentExercise) return;

    // Update statistics for skipped question
    setPracticeStats(prev => ({
      totalQuestions: prev.totalQuestions + 1,
      correctAnswers: prev.correctAnswers,
      totalAttempts: prev.totalAttempts + attempts
    }));

    if (currentExerciseIndex < practiceExercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    } else {
      // All questions completed, show overview
      setShowOverview(true);
    }
    setStudentAnswer('');
    setFeedback('');
    setShowHint(false);
    setAttempts(0);
  };

  const renderOverview = () => {
    const accuracy = practiceStats.totalQuestions > 0 ? 
      Math.round((practiceStats.correctAnswers / practiceStats.totalQuestions) * 100) : 0;
    
    const getPerformanceMessage = () => {
      if (accuracy >= 90) return t.excellentWork;
      if (accuracy >= 70) return t.goodJob;
      return t.keepPracticing;
    };

    const getPerformanceColor = () => {
      if (accuracy >= 90) return 'from-green-500 to-emerald-500';
      if (accuracy >= 70) return 'from-blue-500 to-cyan-500';
      return 'from-orange-500 to-red-500';
    };

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-8 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-4xl font-bold text-gradient-teal-purple mb-4">
              {t.overviewTitle}
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              {t.overviewSubtitle}
            </p>
            <div className={`inline-block px-6 py-3 rounded-xl bg-gradient-to-r ${getPerformanceColor()} text-white font-bold text-lg`}>
              {getPerformanceMessage()}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center border-2 border-blue-200">
              <div className="text-3xl font-bold text-blue-600 mb-2">{practiceStats.totalQuestions}</div>
              <div className="text-gray-700 font-medium">{t.totalQuestions}</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 text-center border-2 border-green-200">
              <div className="text-3xl font-bold text-green-600 mb-2">{practiceStats.correctAnswers}</div>
              <div className="text-gray-700 font-medium">{t.correctAnswers}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 text-center border-2 border-purple-200">
              <div className="text-3xl font-bold text-purple-600 mb-2">{accuracy}%</div>
              <div className="text-gray-700 font-medium">{t.accuracy}</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">{t.yourScore}</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-700">{practiceStats.totalAttempts}</div>
                <div className="text-sm text-gray-600">{t.totalAttempts}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-700">{accuracy}%</div>
                <div className="text-sm text-gray-600">{t.accuracy}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                setShowOverview(false);
                setCurrentExerciseIndex(0);
                setPracticeStats({ totalQuestions: 0, correctAnswers: 0, totalAttempts: 0 });
                setStudentAnswer('');
                setFeedback('');
                setShowHint(false);
                setAttempts(0);
              }}
              className="px-8 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              🔄 {t.restartPractice}
            </button>
            <button
              onClick={() => setCurrentMode('demonstration')}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              📚 {t.backToLearning}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // NetsExplanation Component
  const NetsExplanation: React.FC<{ language: 'en' | 'hi' | 'gu' }> = ({ language }) => {
    const [isFolded, setIsFolded] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const t = translations[language];

    // Trigger sequential animations on mount
    useEffect(() => {
      setIsVisible(true);
    }, []);

    return (
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-6 md:p-8 max-w-4xl mx-auto">
        <div 
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 md:p-8 mb-6 border-2 border-blue-200 transition-all duration-1000"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
            transitionDelay: '200ms'
          }}
        >
          <h3 className="text-xl md:text-2xl font-bold text-blue-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">📖</span>
            {t.keyDefinitions}
          </h3>
          <ul className="list-disc pl-6 space-y-4 text-gray-700 leading-relaxed">
            <li 
              className="transition-all duration-1000"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
                transitionDelay: '400ms'
              }}
            >
              <strong className="text-blue-700">{t.netDefinition}</strong> {t.netDefinitionText}
            </li>
            <li 
              className="transition-all duration-1000"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
                transitionDelay: '600ms'
              }}
            >
              <strong className="text-blue-700">{t.actionDefinition}</strong> {t.actionDefinitionText}
            </li>
            <li 
              className="transition-all duration-1000"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
                transitionDelay: '800ms'
              }}
            >
              <strong className="text-blue-700">{t.processDefinition}</strong> {t.processDefinitionText}
            </li>
          </ul>
        </div>

        <div 
          className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 md:p-8 border-2 border-purple-200 text-center transition-all duration-1000"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
            transitionDelay: '1000ms'
          }}
        >
          <h3 className="text-xl md:text-2xl font-bold text-purple-800 mb-4 flex items-center justify-center gap-2">
            <span className="text-2xl">🎬</span>
            {t.interactiveAnimation}
          </h3>
          <p className="text-gray-700 mb-6 text-lg">
            {t.animationDescription}
          </p>

          {/* 3D Scene Container */}
          <div className="mb-6 flex justify-center items-center" style={{ 
            width: '100%',
            height: '400px',
            perspective: '1200px'
          }}>
            <div 
              className="relative"
              style={{
                width: '300px',
                height: '300px',
                transformStyle: 'preserve-3d',
                transform: isFolded 
                  ? 'rotateX(-20deg) rotateY(-35deg)' 
                  : 'rotateX(-15deg) rotateY(-30deg)'
              }}
            >
              {/* Cube Faces - Net layout: Back(top), Top(above Back), Front(center), Left(left), Right(right), Bottom(below) */}
              
              {/* Front Face - Center of the net */}
              <div
                className="absolute bg-gradient-to-br from-blue-500 to-blue-600 border-2 border-white text-white font-bold flex items-center justify-center shadow-lg text-xs"
                style={{
                  width: '100px',
                  height: '100px',
                  left: '100px',
                  top: '100px',
                  marginLeft: '-50px',
                  marginTop: '-50px',
                  transform: isFolded 
                    ? 'translateZ(50px)' 
                    : 'translateZ(0px)',
                  transformStyle: 'preserve-3d',
                  transformOrigin: 'center center',
                  transition: 'transform 3000ms ease-in-out',
                  transitionDelay: isFolded ? '0ms' : '0ms'
                }}
              >
                {t.faceFront}
              </div>
              
              {/* Back Face - Top of the net (above Front) */}
              <div
                className="absolute bg-gradient-to-br from-blue-600 to-blue-700 border-2 border-white text-white font-bold flex items-center justify-center shadow-lg text-xs"
                style={{
                  width: '100px',
                  height: '100px',
                  left: '100px',
                  top: '0px',
                  marginLeft: '-50px',
                  marginTop: '-50px',
                  transform: isFolded 
                    ? 'rotateY(180deg) translateZ(50px)' 
                    : 'translate(0px, 0px)',
                  transformStyle: 'preserve-3d',
                  transformOrigin: isFolded ? 'center center' : 'bottom center',
                  transition: 'transform 3000ms ease-in-out',
                  transitionDelay: isFolded ? '1000ms' : '0ms'
                }}
              >
                {t.faceBack}
              </div>
              
              {/* Top Face - Above Back in the net */}
              <div
                className="absolute bg-gradient-to-br from-blue-400 to-blue-500 border-2 border-white text-white font-bold flex items-center justify-center shadow-lg text-xs"
                style={{
                  width: '100px',
                  height: '100px',
                  left: '100px',
                  top: '-100px',
                  marginLeft: '-50px',
                  marginTop: '-50px',
                  transform: isFolded 
                    ? 'rotateX(90deg) translateZ(50px)' 
                    : 'translate(0px, 0px)',
                  transformStyle: 'preserve-3d',
                  transformOrigin: isFolded ? 'center center' : 'bottom center',
                  transition: 'transform 3000ms ease-in-out',
                  transitionDelay: isFolded ? '500ms' : '0ms'
                }}
              >
                {t.faceTop}
              </div>
              
              {/* Bottom Face - Below Front in the net */}
              <div
                className="absolute bg-gradient-to-br from-blue-700 to-blue-800 border-2 border-white text-white font-bold flex items-center justify-center shadow-lg text-xs"
                style={{
                  width: '100px',
                  height: '100px',
                  left: '100px',
                  top: '200px',
                  marginLeft: '-50px',
                  marginTop: '-50px',
                  transform: isFolded 
                    ? 'rotateX(-90deg) translateZ(50px)' 
                    : 'translate(0px, 0px)',
                  transformStyle: 'preserve-3d',
                  transformOrigin: isFolded ? 'center center' : 'top center',
                  transition: 'transform 3000ms ease-in-out',
                  transitionDelay: isFolded ? '1500ms' : '0ms'
                }}
              >
                {t.faceBottom}
              </div>
              
              {/* Left Face - Left of Front in the net */}
              <div
                className="absolute bg-gradient-to-br from-blue-500 to-blue-600 border-2 border-white text-white font-bold flex items-center justify-center shadow-lg text-xs"
                style={{
                  width: '100px',
                  height: '100px',
                  left: '0px',
                  top: '100px',
                  marginLeft: '-50px',
                  marginTop: '-50px',
                  transform: isFolded 
                    ? 'rotateY(-90deg) translateZ(50px)' 
                    : 'translate(0px, 0px)',
                  transformStyle: 'preserve-3d',
                  transformOrigin: isFolded ? 'center center' : 'right center',
                  transition: 'transform 3000ms ease-in-out',
                  transitionDelay: isFolded ? '2000ms' : '0ms'
                }}
              >
                {t.faceLeft}
              </div>
              
              {/* Right Face - Right of Front in the net */}
              <div
                className="absolute bg-gradient-to-br from-blue-500 to-blue-600 border-2 border-white text-white font-bold flex items-center justify-center shadow-lg text-xs"
                style={{
                  width: '100px',
                  height: '100px',
                  left: '200px',
                  top: '100px',
                  marginLeft: '-50px',
                  marginTop: '-50px',
                  transform: isFolded 
                    ? 'rotateY(90deg) translateZ(50px)' 
                    : 'translate(0px, 0px)',
                  transformStyle: 'preserve-3d',
                  transformOrigin: isFolded ? 'center center' : 'left center',
                  transition: 'transform 3000ms ease-in-out',
                  transitionDelay: isFolded ? '2500ms' : '0ms'
                }}
              >
                {t.faceRight}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsFolded(!isFolded)}
            className="px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-lg"
          >
            {isFolded ? `🔄 ${t.unfoldToNet}` : `📦 ${t.foldIntoCube}`}
          </button>
        </div>
      </div>
    );
  };

  const renderDemonstrationMode = () => (
    <div className="space-y-6">
      <NetsExplanation language={language} />
    </div>
  );

  const renderPracticeMode = () => {
    if (showOverview) {
      return renderOverview();
    }

    const currentExercise = practiceExercises[currentExerciseIndex];
    if (!currentExercise) return null;

    return (
      <div className="space-y-6">
        {/* Exercise content */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
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
                <div className="flex justify-center gap-4 flex-wrap">
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
                    onClick={handleSubmitAnswer}
                    className="flex items-center gap-2 px-8 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-colors font-medium shadow-lg hover:scale-105"
                  >
                    <CheckCircle className="w-5 h-5" />
                    {t.submit}
                  </button>

                  <button
                    onClick={handleSkip}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors font-medium shadow-lg hover:scale-105"
                  >
                    ⏭️ {t.skip}
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

            {/* Right - Visualization */}
            <div className="relative bg-gradient-to-br from-orange-100 via-pink-100 to-red-100 rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-orange-200 overflow-hidden">
              {/* Animated background orbs */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-300/30 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-red-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              
              <div className="relative z-10">
                <h4 className="text-xl md:text-2xl font-bold text-center mb-6 text-gradient-teal-purple">
                  {t.visualization}
                </h4>
                
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
                  {/* Display shapes mentioned in the current exercise */}
                  {currentExercise.data.visualShapes && (
                    <div className="space-y-4">
                      <div className="text-center mb-4">
                        <span className="text-lg font-semibold text-gray-700">
                          {language === 'en' ? 'Shapes in this exercise:' : 
                           language === 'hi' ? 'इस अभ्यास में आकृतियां:' : 
                           'આ અભ્યાસમાં આકૃતિઓ:'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        {currentExercise.data.visualShapes.map((shapeName: string, index: number) => (
                          <div key={index} className="bg-gray-50 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                            <div className="h-24 w-24 mx-auto mb-2">
                              <ShapeSVG shapeName={shapeName} size={96} />
                            </div>
                            <div className="text-center">
                              <span className="text-sm font-medium text-gray-700">
                                {language === 'en' ? shapeName :
                                 language === 'hi' ? (
                                   shapeName === 'Circle' ? 'वृत्त' :
                                   shapeName === 'Rectangle' ? 'आयत' :
                                   shapeName === 'Triangle' ? 'त्रिभुज' :
                                   shapeName === 'Cube' ? 'घन' :
                                   shapeName === 'Cuboid' ? 'घनाभ' :
                                   shapeName === 'Cylinder' ? 'बेलन' :
                                   shapeName === 'Sphere' ? 'गोला' :
                                   shapeName === 'Cone' ? 'शंकु' :
                                   shapeName
                                 ) :
                                 language === 'gu' ? (
                                   shapeName === 'Circle' ? 'વર્તુળ' :
                                   shapeName === 'Rectangle' ? 'લંબચોરસ' :
                                   shapeName === 'Triangle' ? 'ત્રિકોણ' :
                                   shapeName === 'Cube' ? 'ઘન' :
                                   shapeName === 'Cuboid' ? 'ઘનાભ' :
                                   shapeName === 'Cylinder' ? 'સિલિન્ડર' :
                                   shapeName === 'Sphere' ? 'ગોળક' :
                                   shapeName === 'Cone' ? 'શંકુ' :
                                   shapeName
                                 ) : shapeName}
                              </span>
                              <div className="text-xs text-gray-500 mt-1">
                                {/* Show if it's 2D or 3D */}
                                {(['Circle', 'Rectangle', 'Triangle', 'Square', 'Quadrilateral'].includes(shapeName)) ? 
                                  (language === 'en' ? '2-D Shape' : language === 'hi' ? '2-D आकृति' : '2-D આકૃતિ') :
                                  (language === 'en' ? '3-D Shape' : language === 'hi' ? '3-D आकृति' : '3-D આકૃતિ')
                                }
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
                  <text x="45" y="15" className="text-xs font-bold fill-teal-600">Net Pattern</text>
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
                  <text x="45" y="15" className="text-xs font-bold fill-purple-600">3D to 2D</text>
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
                  <text x="45" y="15" className="text-xs font-bold fill-indigo-600">Assembly</text>
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
                  <text x="45" y="15" className="text-xs font-bold fill-pink-600">Paper Art</text>
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
                  <text x="45" y="75" className="text-xs font-bold fill-emerald-600">Learn</text>
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
                  <text x="45" y="15" className="text-xs font-bold fill-cyan-600">3D Model</text>
                </svg>
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

export default Chapter13Tool;
