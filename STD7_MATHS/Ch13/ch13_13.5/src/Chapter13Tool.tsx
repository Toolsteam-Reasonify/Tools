import React, { useState, useEffect } from 'react';
import { Lightbulb, CheckCircle, XCircle } from 'lucide-react';
import CrossSectionVisualizer from './components/CrossSectionVisualizer';

// Type definitions
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
    learning: 'Learning',
    practice: 'Practice',
    selectLanguage: 'Select Language',
    chapterTitle: 'Introduction',
    topicTitle: 'Dimensions and Classification',
    whatIsTopic: 'What are dimensions?',
    keyProperty: 'Key Concept',
    practiceExercises: 'Practice Exercises',
    yourProgress: 'Your Progress',
    avgTime: 'Avg Time',
    totalExercises: 'Total',
    excellent: 'Excellent!',
    keepTrying: 'Keep Trying!',
    realWorldApplications: 'Real World',
    definition: 'Dimension Definition',
    definitionText: 'Objects in daily life like books, balls, and ice-cream cones have length, breadth, and height (or depth), making them three-dimensional shapes that occupy space.',
    keyPropertyText: 'Shapes can be classified based on their dimensions: 2-D (two-dimensional) and 3-D (three-dimensional).',
    importantRule: '2-D Figures',
    importantRuleText: 'Figures drawn on paper that have only length and breadth are called two-dimensional or plane figures.',
    sumProperty: '3-D Shapes',
    sumPropertyText: 'These are solid shapes that have three dimensions: length, breadth, and height.',
    visualization: 'Shape Visualization',
    interiorElements: '2-D Shapes',
    exteriorElements: '3-D Shapes',
    triangleOf: 'Shape',
    of: 'of',
    yourAnswer: 'Your Answer',
    enterAnswer: 'Enter your answer...',
    architecture: 'Architecture',
    architectureDesc: 'Architects use 3-D shapes to design buildings and structures.',
    navigation: 'Navigation',
    navigationDesc: 'Navigation systems use 2-D maps to represent 3-D terrain.',
    engineering: 'Engineering',
    engineeringDesc: 'Engineers work with both 2-D blueprints and 3-D models.',
    artDesign: 'Art & Design',
    artDesignDesc: 'Artists create 2-D drawings and 3-D sculptures.',
    surveying: 'Surveying',
    surveyingDesc: 'Surveyors measure 3-D land and create 2-D maps.',
    computerGraphics: 'Computer Graphics',
    computerGraphicsDesc: 'Developers create 3-D models displayed on 2-D screens.',
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
    // CrossSectionDemo translations
    crossSectionTitle: '3D Solid Cross-Section Visualization',
    crossSectionSubtitle: 'Explore how different cuts through a 3D object create various cross-sections',
    cuboidTitle: '3D Cuboid (Bread Loaf)',
    autoRotatingNote: '(Auto-rotating for better view)',
    crossSectionResult: 'Cross-Section Result',
    shapeLabel: 'Shape:',
    squareShape: '■ Square',
    rectangleShape: '▬ Rectangle',
    verticalCutDesc: 'Vertical cut produces a square cross-section',
    angledCutDesc: 'Angled cut produces a rectangular cross-section',
    controlsTitle: 'Controls',
    cutPosition: 'Cut Position',
    cutAngle: 'Cut Angle',
    vertical: '(Vertical)',
    angled: '(Angled)',
    animateCut: 'Animate Cut',
    reset: 'Reset',
    keyConcepts: 'Key Concepts',
    concept1: 'A vertical cut (90°) through a cuboid produces a square cross-section',
    concept2: 'Different cutting angles produce different cross-sectional shapes (rectangles of varying dimensions)',
    concept3: 'The cross-section boundary is always a plane curve (in this case, a polygon)',
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
    keepPracticing: 'Keep Practicing!'
  },
  hi: {
    correct: 'सही!',
    incorrect: 'फिर कोशिश करें!',
    next: 'अगला',
    previous: 'पिछला',
    submit: 'जमा करें',
    hint: 'संकेत',
    skip: 'छोड़ें',
    learning: 'सीखना',
    practice: 'अभ्यास',
    selectLanguage: 'भाषा चुनें',
    chapterTitle: 'परिचय',
    topicTitle: 'आयाम और वर्गीकरण',
    whatIsTopic: 'आयाम क्या हैं?',
    keyProperty: 'मुख्य अवधारणा',
    practiceExercises: 'अभ्यास अभ्यास',
    yourProgress: 'आपकी प्रगति',
    avgTime: 'औसत समय',
    totalExercises: 'कुल',
    excellent: 'उत्कृष्ट!',
    keepTrying: 'कोशिश करते रहें!',
    realWorldApplications: 'वास्तविक दुनिया',
    definition: 'आयाम की परिभाषा',
    definitionText: 'दैनिक जीवन की वस्तुएं जैसे किताबें, गेंदें और आइसक्रीम कोन में लंबाई, चौड़ाई और ऊंचाई (या गहराई) होती है, जो उन्हें त्रि-आयामी आकृतियां बनाती हैं जो स्थान घेरती हैं।',
    keyPropertyText: 'आकृतियों को उनके आयामों के आधार पर वर्गीकृत किया जा सकता है: 2-D (द्वि-आयामी) और 3-D (त्रि-आयामी)।',
    importantRule: '2-D आकृतियां',
    importantRuleText: 'कागज पर खींची गई आकृतियां जिनमें केवल लंबाई और चौड़ाई होती है, द्वि-आयामी या समतल आकृतियां कहलाती हैं।',
    sumProperty: '3-D आकृतियां',
    sumPropertyText: 'ये ठोस आकृतियां हैं जिनमें तीन आयाम होते हैं: लंबाई, चौड़ाई और ऊंचाई।',
    visualization: 'आकृति दृश्यीकरण',
    interiorElements: '2-D आकृतियां',
    exteriorElements: '3-D आकृतियां',
    triangleOf: 'आकृति',
    of: 'का',
    yourAnswer: 'आपका उत्तर',
    enterAnswer: 'अपना उत्तर दर्ज करें...',
    architecture: 'वास्तुकला',
    architectureDesc: 'वास्तुकार इमारतों और संरचनाओं को डिजाइन करने के लिए 3-D आकृतियों का उपयोग करते हैं।',
    navigation: 'नेविगेशन',
    navigationDesc: 'नेविगेशन सिस्टम 3-D भूभाग का प्रतिनिधित्व करने के लिए 2-D मानचित्रों का उपयोग करते हैं।',
    engineering: 'इंजीनियरिंग',
    engineeringDesc: 'इंजीनियर 2-D ब्लूप्रिंट और 3-D मॉडल दोनों के साथ काम करते हैं।',
    artDesign: 'कला और डिजाइन',
    artDesignDesc: 'कलाकार 2-D चित्र और 3-D मूर्तियां बनाते हैं।',
    surveying: 'सर्वेक्षण',
    surveyingDesc: 'सर्वेक्षक 3-D भूमि को मापते हैं और 2-D मानचित्र बनाते हैं।',
    computerGraphics: 'कंप्यूटर ग्राफिक्स',
    computerGraphicsDesc: 'डेवलपर्स 2-D स्क्रीन पर प्रदर्शित 3-D मॉडल बनाते हैं।',
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
    // CrossSectionDemo translations
    crossSectionTitle: '3D ठोस काट-खंड दृश्यीकरण',
    crossSectionSubtitle: '3D वस्तु के विभिन्न कटावों से विभिन्न काट-खंड कैसे बनते हैं, इसे देखें',
    cuboidTitle: '3D घनाभ (ब्रेड लोफ)',
    autoRotatingNote: '(बेहतर दृश्य के लिए स्वतः घूर्णन)',
    crossSectionResult: 'काट-खंड परिणाम',
    shapeLabel: 'आकार:',
    squareShape: '■ वर्ग',
    rectangleShape: '▬ आयत',
    verticalCutDesc: 'ऊर्ध्वाधर कटाव वर्गाकार काट-खंड बनाता है',
    angledCutDesc: 'तिर्यक कटाव आयताकार काट-खंड बनाता है',
    controlsTitle: 'नियंत्रण',
    cutPosition: 'कटाव स्थिति',
    cutAngle: 'कटाव कोण',
    vertical: '(ऊर्ध्वाधर)',
    angled: '(तिर्यक)',
    animateCut: 'कटाव एनिमेट करें',
    reset: 'रीसेट',
    keyConcepts: 'मुख्य अवधारणाएं',
    concept1: 'घनाभ के माध्यम से ऊर्ध्वाधर कटाव (90°) एक वर्गाकार काट-खंड बनाता है',
    concept2: 'विभिन्न कटाव कोण विभिन्न काट-खंडीय आकार बनाते हैं (विभिन्न आयामों के आयत)',
    concept3: 'काट-खंड की सीमा हमेशा एक समतल वक्र होती है (इस मामले में, एक बहुभुज)',
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
    keepPracticing: 'अभ्यास जारी रखें!'
  },
  gu: {
    correct: 'સાચું!',
    incorrect: 'ફરી કોશિશ કરો!',
    next: 'આગળ',
    previous: 'પાછળ',
    submit: 'જમા કરો',
    hint: 'સંકેત',
    skip: 'છોડો',
    learning: 'શીખવું',
    practice: 'અભ્યાસ',
    selectLanguage: 'ભાષા પસંદ કરો',
    chapterTitle: 'પરિચય',
    topicTitle: 'પરિમાણ અને વર્ગીકરણ',
    whatIsTopic: 'પરિમાણ શું છે?',
    keyProperty: 'મુખ્ય ખ્યાલ',
    practiceExercises: 'અભ્યાસ કસરતો',
    yourProgress: 'તમારી પ્રગતિ',
    avgTime: 'સરેરાશ સમય',
    totalExercises: 'કુલ',
    excellent: 'ઉત્તમ!',
    keepTrying: 'કોશિશ કરતા રહો!',
    realWorldApplications: 'વાસ્તવિક વિશ્વ',
    definition: 'પરિમાણની વ્યાખ્યા',
    definitionText: 'દૈનિક જીવનની વસ્તુઓ જેવી કે પુસ્તકો, દડા અને આઇસક્રીમ કોનમાં લંબાઈ, પહોળાઈ અને ઊંચાઈ (અથવા ઊંડાઈ) હોય છે, જે તેમને ત્રિ-પરિમાણીય આકૃતિઓ બનાવે છે જે જગ્યા ઘેરે છે।',
    keyPropertyText: 'આકૃતિઓને તેમના પરિમાણોના આધારે વર્ગીકૃત કરી શકાય છે: 2-D (દ્વિ-પરિમાણીય) અને 3-D (ત્રિ-પરિમાણીય)।',
    importantRule: '2-D આકૃતિઓ',
    importantRuleText: 'કાગળ પર દોરેલી આકૃતિઓ જેમાં માત્ર લંબાઈ અને પહોળાઈ હોય છે, દ્વિ-પરિમાણીય અથવા સમતલ આકૃતિઓ કહેવાય છે।',
    sumProperty: '3-D આકૃતિઓ',
    sumPropertyText: 'આ ઘન આકૃતિઓ છે જેમાં ત્રણ પરિમાણ હોય છે: લંબાઈ, પહોળાઈ અને ઊંચાઈ।',
    visualization: 'આકૃતિ દ્રશ્યીકરણ',
    interiorElements: '2-D આકૃતિઓ',
    exteriorElements: '3-D આકૃતિઓ',
    triangleOf: 'આકૃતિ',
    of: 'નો',
    yourAnswer: 'તમારો જવાબ',
    enterAnswer: 'તમારો જવાબ દાખલ કરો...',
    architecture: 'આર્કિટેક્ચર',
    architectureDesc: 'આર્કિટેક્ટ ઇમારતો અને માળખાઓ ડિઝાઇન કરવા માટે 3-D આકૃતિઓનો ઉપયોગ કરે છે।',
    navigation: 'નેવિગેશન',
    navigationDesc: 'નેવિગેશન સિસ્ટમ 3-D ભૂપ્રદેશનું પ્રતિનિધિત્વ કરવા માટે 2-D નકશાઓનો ઉપયોગ કરે છે।',
    engineering: 'ઇજનેરી',
    engineeringDesc: 'ઇજનેરો 2-D બ્લુપ્રિન્ટ અને 3-D મોડલ બંને સાથે કામ કરે છે।',
    artDesign: 'કલા અને ડિઝાઇન',
    artDesignDesc: 'કલાકારો 2-D ચિત્રો અને 3-D મૂર્તિઓ બનાવે છે।',
    surveying: 'સર્વેક્ષણ',
    surveyingDesc: 'સર્વેક્ષકો 3-D જમીન માપે છે અને 2-D નકશા બનાવે છે।',
    computerGraphics: 'કમ્પ્યુટર ગ્રાફિક્સ',
    computerGraphicsDesc: 'ડેવલપર્સ 2-D સ્ક્રીન પર પ્રદર્શિત 3-D મોડલ બનાવે છે।',
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
    // CrossSectionDemo translations
    crossSectionTitle: '3D ઘન કાપ-ભાગ દ્રશ્યીકરણ',
    crossSectionSubtitle: '3D વસ્તુના વિવિધ કાપથી વિવિધ કાપ-ભાગો કેવી રીતે બને છે તે જુઓ',
    cuboidTitle: '3D ઘનાકાર (બ્રેડ લોફ)',
    autoRotatingNote: '(વધુ સારા દૃશ્ય માટે ઓટો-ફરતું)',
    crossSectionResult: 'કાપ-ભાગ પરિણામ',
    shapeLabel: 'આકાર:',
    squareShape: '■ ચોરસ',
    rectangleShape: '▬ લંબચોરસ',
    verticalCutDesc: 'ઊભો કાપ ચોરસ કાપ-ભાગ બનાવે છે',
    angledCutDesc: 'તિર્યક કાપ લંબચોરસ કાપ-ભાગ બનાવે છે',
    controlsTitle: 'નિયંત્રણો',
    cutPosition: 'કાપ સ્થિતિ',
    cutAngle: 'કાપ કોણ',
    vertical: '(ઊભું)',
    angled: '(તિર્યક)',
    animateCut: 'કાપ એનિમેટ કરો',
    reset: 'રીસેટ',
    keyConcepts: 'મુખ્ય વિભાવનાઓ',
    concept1: 'ઘનાકાર દ્વારા ઊભો કાપ (90°) ચોરસ કાપ-ભાગ બનાવે છે',
    concept2: 'વિવિધ કાપ કોણો વિવિધ કાપ-ભાગીય આકારો બનાવે છે (વિવિધ પરિમાણોના લંબચોરસ)',
    concept3: 'કાપ-ભાગની સીમા હંમેશા સમતલ વળાંક હોય છે (આ કિસ્સામાં, એક બહુકોણ)',
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
    keepPracticing: 'અભ્યાસ ચાલુ રાખો!'
  }
};

// Practice exercises with visual shapes data
const practiceExercises: PracticeExercise[] = [
  {
    id: 'ex1',
    type: 'identification',
    difficulty: 'beginner',
    question: 'What type of cross-section do you get when you make a vertical cut through a cuboid?',
    data: { 
      shapes: ['Square', 'Rectangle', 'Circle', 'Triangle'], 
      correctType: 'Square',
      visualShapes: ['Square', 'Rectangle', 'Circle', 'Triangle']
    },
    correctAnswer: 'Square',
    hint: 'A vertical cut through a cuboid creates a square cross-section because it cuts through equal dimensions.',
    translations: {
      gu: {
        question: 'ઘનાભમાં ઊભો કાપ કરતા તમને કેવા પ્રકારનો ક્રોસ-સેક્શન મળે છે?',
        hint: 'ઘનાભમાં ઊભો કાપ ચોરસ ક્રોસ-સેક્શન બનાવે છે કારણ કે તે સમાન પરિમાણોમાંથી કાપે છે।'
      },
      hi: {
        question: 'घनाभ में ऊर्ध्वाधर कटाव करने पर आपको किस प्रकार का क्रॉस-सेक्शन मिलता है?',
        hint: 'घनाभ में ऊर्ध्वाधर कटाव एक वर्गाकार क्रॉस-सेक्शन बनाता है क्योंकि यह समान आयामों से काटता है।'
      }
    }
  },
  {
    id: 'ex2',
    type: 'identification',
    difficulty: 'beginner',
    question: 'What happens to the shadow of a cylinder when the light source moves from left to right?',
    data: { 
      shapes: ['Shadow gets longer', 'Shadow gets shorter', 'Shadow stays same', 'Shadow disappears'],
      visualShapes: ['Cylinder', 'Cylinder', 'Cylinder', 'Cylinder']
    },
    correctAnswer: 'Shadow gets longer',
    hint: 'As the light source moves, the angle changes, making the shadow appear longer and more distorted.',
    translations: {
      gu: {
        question: 'પ્રકાશ સ્ત્રોત ડાબેથી જમણે ખસે ત્યારે સિલિન્ડરના પડછાયામાં શું થાય છે?',
        hint: 'પ્રકાશ સ્ત્રોત ખસે ત્યારે, કોણ બદલાય છે, જે પડછાયાને લાંબો અને વધુ વિકૃત બનાવે છે।'
      },
      hi: {
        question: 'जब प्रकाश स्रोत बाएं से दाएं जाता है तो बेलन की छाया का क्या होता है?',
        hint: 'जब प्रकाश स्रोत चलता है, तो कोण बदलता है, जिससे छाया लंबी और अधिक विकृत दिखती है।'
      }
    }
  },
  {
    id: 'ex3',
    type: 'identification',
    difficulty: 'intermediate',
    question: 'Which view shows the depth and height of a 3D object?',
    data: { 
      shapes: ['Front view', 'Side view', 'Top view', 'All views'],
      visualShapes: ['Cuboid', 'Cuboid', 'Cuboid', 'Cuboid']
    },
    correctAnswer: 'Side view',
    hint: 'The side view shows the depth (how far back) and height (how tall) of a 3D object.',
    translations: {
      gu: {
        question: 'કયો દ્રશ્ય 3D વસ્તુની ઊંડાઈ અને ઊંચાઈ બતાવે છે?',
        hint: 'સાઇડ દ્રશ્ય 3D વસ્તુની ઊંડાઈ (કેટલી પાછળ) અને ઊંચાઈ (કેટલી ઊંચી) બતાવે છે।'
      },
      hi: {
        question: 'कौन सा दृश्य 3D वस्तु की गहराई और ऊंचाई दिखाता है?',
        hint: 'साइड दृश्य 3D वस्तु की गहराई (कितनी पीछे) और ऊंचाई (कितनी ऊंची) दिखाता है।'
      }
    }
  },
  {
    id: 'ex4',
    type: 'verification',
    difficulty: 'intermediate',
    question: 'If you slice a cone horizontally, what shape will the cross-section be?',
    data: { 
      shapes: ['Circle', 'Triangle', 'Square', 'Rectangle'],
      visualShapes: ['Circle', 'Triangle', 'Square', 'Rectangle']
    },
    correctAnswer: 'Circle',
    hint: 'A horizontal slice through a cone creates a circular cross-section because cones have circular bases.',
    translations: {
      gu: {
        question: 'જો તમે શંકુને આડું કાપો, તો ક્રોસ-સેક્શનનો આકાર શું હશે?',
        hint: 'શંકુમાં આડો કાપ ગોળાકાર ક્રોસ-સેક્શન બનાવે છે કારણ કે શંકુમાં ગોળાકાર પાયા હોય છે।'
      },
      hi: {
        question: 'यदि आप शंकु को क्षैतिज रूप से काटते हैं, तो क्रॉस-सेक्शन का आकार क्या होगा?',
        hint: 'शंकु में क्षैतिज कटाव एक गोलाकार क्रॉस-सेक्शन बनाता है क्योंकि शंकु में गोलाकार आधार होते हैं।'
      }
    }
  },
  {
    id: 'ex5',
    type: 'calculation',
    difficulty: 'advanced',
    question: 'A cube has a side length of 4 cm. What is the area of its front view?',
    data: { 
      shapes: ['16 cm²', '24 cm²', '32 cm²', '64 cm²'],
      visualShapes: ['Square', 'Square', 'Square', 'Square']
    },
    correctAnswer: '16 cm²',
    hint: 'The front view of a cube is a square with the same side length as the cube. Area = side × side = 4 × 4 = 16 cm².',
    translations: {
      gu: {
        question: 'એક ઘનની બાજુની લંબાઈ 4 સેમી છે. તેના ફ્રન્ટ દ્રશ્યનું ક્ષેત્રફળ કેટલું છે?',
        hint: 'ઘનનો ફ્રન્ટ દ્રશ્ય એ ઘન જેવી જ બાજુની લંબાઈ સાથેનો ચોરસ છે. ક્ષેત્રફળ = બાજુ × બાજુ = 4 × 4 = 16 સેમી²।'
      },
      hi: {
        question: 'एक घन की भुजा की लंबाई 4 सेमी है। इसके फ्रंट दृश्य का क्षेत्रफल क्या है?',
        hint: 'घन का फ्रंट दृश्य घन के समान भुजा की लंबाई वाला वर्ग है। क्षेत्रफल = भुजा × भुजा = 4 × 4 = 16 सेमी²।'
      }
    }
  },
  {
    id: 'ex6',
    type: 'verification',
    difficulty: 'advanced',
    question: 'Which statement about shadows is correct?',
    data: { 
      shapes: ['Shadows are always 2D', 'Shadows can be 3D', 'Shadows have no shape', 'Shadows are always circles'],
      visualShapes: ['Shadow', 'Shadow', 'Shadow', 'Shadow']
    },
    correctAnswer: 'Shadows are always 2D',
    hint: 'Shadows are 2D projections of 3D objects onto a surface. They represent the outline of the object.',
    translations: {
      gu: {
        question: 'પડછાયાઓ વિશે કયું વિધાન સાચું છે?',
        hint: 'પડછાયાઓ એ સપાટી પર 3D વસ્તુઓના 2D પ્રક્ષેપણ છે. તેઓ વસ્તુની રૂપરેખા રજૂ કરે છે।'
      },
      hi: {
        question: 'छायाओं के बारे में कौन सा कथन सही है?',
        hint: 'छायाएं एक सतह पर 3D वस्तुओं के 2D प्रक्षेपण हैं। वे वस्तु की रूपरेखा का प्रतिनिधित्व करती हैं।'
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
      
      case 'Triangle':
        return (
          <svg viewBox={viewBox} className="w-full h-full">
            <polygon points={`${center},${rectOffset} ${rectOffset},${rectOffset + rectSize} ${rectOffset + rectSize},${rectOffset + rectSize}`} fill="#14b8a6" stroke="#0d9488" strokeWidth="3" />
            <line x1={center} y1={rectOffset} x2={center} y2={rectOffset + rectSize} stroke="#0d9488" strokeWidth="2" strokeDasharray="3,3" />
            <text x={center + 10} y={center} fill="#0d9488" fontSize="10" fontWeight="bold">h</text>
            <text x={center} y={rectOffset + rectSize + 15} fill="#0d9488" fontSize="10" fontWeight="bold">b</text>
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
      
      case 'Cylinder':
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
      
      case 'Cone':
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

const Chapter13Tool: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<'demonstration' | 'practice' | 'realworld'>('demonstration');
  const [language, setLanguage] = useState<'en' | 'hi' | 'gu'>(() => {
    const savedLanguage = localStorage.getItem('ch13-13-1-language');
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
    localStorage.setItem('ch13-13-1-language', newLanguage);
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

  const renderDemonstrationMode = () => (
    <div className="space-y-6">
      <CrossSectionVisualizer language={language} />
    </div>
  );

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
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gradient-teal-purple mb-4">
            {t.realWorldApplications}
          </h2>
          <p className="text-lg text-gray-600">
            {language === 'en' ? 'Discover how visualizing solid shapes is used in real-world applications' :
             language === 'hi' ? 'जानें कि वास्तविक दुनिया के अनुप्रयोगों में ठोस आकृतियों के दृश्यीकरण का उपयोग कैसे किया जाता है' :
             'જાણો કે વાસ્તવિક વિશ્વના ઉપયોગોમાં ઘન આકૃતિઓના દ્રશ્યીકરણનો ઉપયોગ કેવી રીતે થાય છે'}
          </p>
        </div>

        {/* Applications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Medical Imaging */}
          <div className="application-card bg-white rounded-3xl shadow-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-blue-200">
            <div className="text-center">
              <div className="text-6xl mb-4">🏥</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {language === 'en' ? 'Medical Imaging' :
                 language === 'hi' ? 'चिकित्सा इमेजिंग' :
                 'મેડિકલ ઇમેજિંગ'}
              </h3>
              <p className="text-gray-600 mb-4">
                {language === 'en' ? 'CT scans and MRI use cross-sections to visualize internal organs and structures in 3D.' :
                 language === 'hi' ? 'सीटी स्कैन और एमआरआई आंतरिक अंगों और संरचनाओं को 3D में देखने के लिए क्रॉस-सेक्शन का उपयोग करते हैं।' :
                 'CT સ્કેન અને MRI આંતરિક અંગો અને માળખાઓને 3D માં જોવા માટે ક્રોસ-સેક્શનનો ઉપયોગ કરે છે।'}
              </p>
              <div className="bg-blue-50 p-4 rounded-xl">
                <svg width="100" height="80" viewBox="0 0 100 80" className="mx-auto">
                  <ellipse cx="50" cy="40" rx="30" ry="20" fill="#E6F3FF" stroke="#3B82F6" strokeWidth="2"/>
                  <line x1="20" y1="20" x2="80" y2="60" stroke="#EF4444" strokeWidth="2" strokeDasharray="3,3"/>
                  <line x1="20" y1="60" x2="80" y2="20" stroke="#EF4444" strokeWidth="2" strokeDasharray="3,3"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Architecture */}
          <div className="application-card bg-white rounded-3xl shadow-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-teal-200">
            <div className="text-center">
              <div className="text-6xl mb-4">🏗️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{t.architecture}</h3>
              <p className="text-gray-600 mb-4">
                {t.architectureDesc}
              </p>
              <div className="bg-teal-50 p-4 rounded-xl">
                <svg width="100" height="80" viewBox="0 0 100 80" className="mx-auto">
                  <rect x="20" y="40" width="60" height="40" fill="#E5E7EB" stroke="#14b8a6" strokeWidth="2"/>
                  <polygon points="20,40 50,20 80,40" fill="#CCFBF1" stroke="#0d9488" strokeWidth="2"/>
                  <text x="45" y="15" className="text-xs font-bold fill-teal-600">120°</text>
                </svg>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="application-card bg-white rounded-3xl shadow-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-purple-200">
            <div className="text-center">
              <div className="text-6xl mb-4">🧭</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{t.navigation}</h3>
              <p className="text-gray-600 mb-4">
                {t.navigationDesc}
              </p>
              <div className="bg-purple-50 p-4 rounded-xl">
                <svg width="100" height="80" viewBox="0 0 100 80" className="mx-auto">
                  <polygon points="50,20 20,60 80,60" fill="#F3E8FF" stroke="#a855f7" strokeWidth="2"/>
                  <circle cx="50" cy="40" r="3" fill="#EF4444"/>
                  <text x="45" y="15" className="text-xs font-bold fill-purple-600">135°</text>
                </svg>
              </div>
            </div>
          </div>

          {/* Engineering */}
          <div className="application-card bg-white rounded-3xl shadow-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-indigo-200">
            <div className="text-center">
              <div className="text-6xl mb-4">⚙️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{t.engineering}</h3>
              <p className="text-gray-600 mb-4">
                {t.engineeringDesc}
              </p>
              <div className="bg-indigo-50 p-4 rounded-xl">
                <svg width="100" height="80" viewBox="0 0 100 80" className="mx-auto">
                  <polygon points="30,30 70,30 70,70 30,70" fill="#E0E7FF" stroke="#6366F1" strokeWidth="2"/>
                  <polygon points="70,30 90,50 70,70" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2"/>
                  <text x="75" y="25" className="text-xs font-bold fill-indigo-600">90°</text>
                </svg>
              </div>
            </div>
          </div>

          {/* Art & Design */}
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
                  <text x="45" y="15" className="text-xs font-bold fill-pink-600">108°</text>
                </svg>
              </div>
            </div>
          </div>

          {/* Surveying */}
          <div className="application-card bg-white rounded-3xl shadow-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-emerald-200">
            <div className="text-center">
              <div className="text-6xl mb-4">📐</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{t.surveying}</h3>
              <p className="text-gray-600 mb-4">
                {t.surveyingDesc}
              </p>
              <div className="bg-emerald-50 p-4 rounded-xl">
                <svg width="100" height="80" viewBox="0 0 100 80" className="mx-auto">
                  <polygon points="50,20 20,60 80,60" fill="#D1FAE5" stroke="#10B981" strokeWidth="2"/>
                  <line x1="20" y1="60" x2="10" y2="50" stroke="#EF4444" strokeWidth="2" strokeDasharray="3,3"/>
                  <text x="5" y="45" className="text-xs font-bold fill-emerald-600">120°</text>
                </svg>
              </div>
            </div>
          </div>

          {/* Computer Graphics */}
          <div className="application-card bg-white rounded-3xl shadow-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-cyan-200">
            <div className="text-center">
              <div className="text-6xl mb-4">💻</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{t.computerGraphics}</h3>
              <p className="text-gray-600 mb-4">
                {t.computerGraphicsDesc}
              </p>
              <div className="bg-cyan-50 p-4 rounded-xl">
                <svg width="100" height="80" viewBox="0 0 100 80" className="mx-auto">
                  <polygon points="30,30 70,30 70,70 30,70" fill="#E0F2FE" stroke="#06B6D4" strokeWidth="2"/>
                  <polygon points="70,30 90,50 70,70" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2"/>
                  <text x="75" y="25" className="text-xs font-bold fill-cyan-600">90°</text>
                </svg>
              </div>
            </div>
          </div>

          {/* Manufacturing */}
          <div className="application-card bg-white rounded-3xl shadow-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-orange-200">
            <div className="text-center">
              <div className="text-6xl mb-4">🏭</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {language === 'en' ? 'Manufacturing' :
                 language === 'hi' ? 'विनिर्माण' :
                 'ઉત્પાદન'}
              </h3>
              <p className="text-gray-600 mb-4">
                {language === 'en' ? 'Quality control uses cross-sections to inspect internal structures of products.' :
                 language === 'hi' ? 'गुणवत्ता नियंत्रण उत्पादों की आंतरिक संरचना का निरीक्षण करने के लिए क्रॉस-सेक्शन का उपयोग करता है।' :
                 'ગુણવત્તા નિયંત્રણ ઉત્પાદનોની આંતરિક માળખાનું નિરીક્ષણ કરવા માટે ક્રોસ-સેક્શનનો ઉપયોગ કરે છે।'}
              </p>
              <div className="bg-orange-50 p-4 rounded-xl">
                <svg width="100" height="80" viewBox="0 0 100 80" className="mx-auto">
                  <rect x="20" y="30" width="60" height="40" fill="#FED7AA" stroke="#EA580C" strokeWidth="2"/>
                  <line x1="50" y1="10" x2="50" y2="70" stroke="#EF4444" strokeWidth="2" strokeDasharray="3,3"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Gaming */}
          <div className="application-card bg-white rounded-3xl shadow-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-violet-200">
            <div className="text-center">
              <div className="text-6xl mb-4">🎮</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {language === 'en' ? 'Gaming & VR' :
                 language === 'hi' ? 'गेमिंग और वीआर' :
                 'ગેમિંગ અને VR'}
              </h3>
              <p className="text-gray-600 mb-4">
                {language === 'en' ? '3D games and virtual reality use multiple views to create immersive experiences.' :
                 language === 'hi' ? '3D गेम और वर्चुअल रियलिटी इमर्सिव अनुभव बनाने के लिए कई दृश्यों का उपयोग करते हैं।' :
                 '3D ગેમ્સ અને વર્ચુઅલ રિયલિટી ઇમર્સિવ અનુભવો બનાવવા માટે બહુવિધ દ્રશ્યોનો ઉપયોગ કરે છે।'}
              </p>
              <div className="bg-violet-50 p-4 rounded-xl">
                <svg width="100" height="80" viewBox="0 0 100 80" className="mx-auto">
                  <polygon points="50,20 20,50 50,80 80,50" fill="#F3E8FF" stroke="#8B5CF6" strokeWidth="2"/>
                  <circle cx="50" cy="50" r="8" fill="#A855F7"/>
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
