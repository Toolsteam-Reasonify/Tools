import React, { useState, useEffect } from 'react';
import { Lightbulb, CheckCircle, XCircle } from 'lucide-react';
import DrawingTechniquesDemo from './components/DrawingTechniquesDemo';
import IsometricSketchDemo from './components/IsometricSketchDemo';
import SpatialCubesVisualization from './components/SpatialCubesVisualization';

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
    chapterTitle: 'Drawing 3D Shapes',
    topicTitle: 'Techniques for Drawing 3D Solids on Flat Paper',
    whatIsTopic: 'How do we draw 3D shapes on flat paper?',
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
    definition: '3D Drawing Definition',
    definitionText: 'Drawing three-dimensional solid shapes on flat paper requires special techniques to create visual illusions of depth and make them appear three-dimensional.',
    keyPropertyText: 'Two main techniques: Oblique Sketches (not proportional) and Isometric Sketches (proportional measurements).',
    importantRule: 'Oblique Sketches',
    importantRuleText: 'Give clear idea of how solid looks from front. Measurements are not proportional. Front and opposite faces appear same size.',
    sumProperty: 'Isometric Sketches',
    sumPropertyText: 'Drawn on special isometric dot paper. Measurements are exact and proportional. More accurate representation.',
    visualization: 'Drawing Visualization',
    interiorElements: 'Hidden Edges',
    exteriorElements: 'Visible Edges',
    triangleOf: 'Drawing',
    of: 'of',
    yourAnswer: 'Your Answer',
    enterAnswer: 'Enter your answer...',
    architecture: 'Technical Drawing',
    architectureDesc: 'Engineers and architects use oblique and isometric sketches to create blueprints and technical drawings.',
    navigation: 'Engineering Design',
    navigationDesc: 'Mechanical engineers use 3D drawing techniques to design machine parts and components.',
    engineering: 'Architectural Plans',
    engineeringDesc: 'Architects create building plans using isometric projections for accurate representation.',
    artDesign: 'Product Design',
    artDesignDesc: 'Product designers use 3D sketching techniques to visualize and communicate design concepts.',
    surveying: 'CAD Software',
    surveyingDesc: 'Computer-aided design software uses isometric and oblique projection principles for 3D modeling.',
    computerGraphics: 'Game Development',
    computerGraphicsDesc: 'Game developers use 3D drawing techniques to create realistic 3D environments on 2D screens.',
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
    // Button translations
    obliqueSketches: 'Oblique Sketches',
    isometricSketches: 'Isometric Sketches',
    visualisingSolidObjects: 'Visualising Solid Objects',
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
    chapterTitle: '3D आकृतियां बनाना',
    topicTitle: 'सपाट कागज पर 3D ठोस आकृतियां बनाने की तकनीकें',
    whatIsTopic: 'हम सपाट कागज पर 3D आकृतियां कैसे बनाते हैं?',
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
    definition: '3D ड्रॉइंग की परिभाषा',
    definitionText: 'सपाट कागज पर त्रि-आयामी ठोस आकृतियां बनाने के लिए गहराई की दृश्य भ्रम पैदा करने और उन्हें त्रि-आयामी दिखाने के लिए विशेष तकनीकों की आवश्यकता होती है।',
    keyPropertyText: 'दो मुख्य तकनीकें: तिरछे स्केच (अनुपातिक नहीं) और सममितीय स्केच (अनुपातिक माप)।',
    importantRule: 'तिरछे स्केच',
    importantRuleText: 'सामने से ठोस कैसा दिखता है इसका स्पष्ट विचार देते हैं। माप अनुपातिक नहीं होते। सामने और विपरीत फलक समान आकार के दिखते हैं।',
    sumProperty: 'सममितीय स्केच',
    sumPropertyText: 'विशेष सममितीय डॉट पेपर पर बनाए जाते हैं। माप सटीक और अनुपातिक होते हैं। अधिक सटीक प्रतिनिधित्व।',
    visualization: 'ड्रॉइंग दृश्यीकरण',
    interiorElements: 'छुपी हुई किनारे',
    exteriorElements: 'दिखाई देने वाली किनारे',
    triangleOf: 'ड्रॉइंग',
    of: 'का',
    yourAnswer: 'आपका उत्तर',
    enterAnswer: 'अपना उत्तर दर्ज करें...',
    architecture: 'तकनीकी ड्रॉइंग',
    architectureDesc: 'इंजीनियर और आर्किटेक्ट ब्लूप्रिंट और तकनीकी ड्रॉइंग बनाने के लिए तिरछे और सममितीय स्केच का उपयोग करते हैं।',
    navigation: 'इंजीनियरिंग डिजाइन',
    navigationDesc: 'मैकेनिकल इंजीनियर मशीन पार्ट्स और कंपोनेंट्स डिजाइन करने के लिए 3D ड्रॉइंग तकनीकों का उपयोग करते हैं।',
    engineering: 'आर्किटेक्चरल प्लान',
    engineeringDesc: 'आर्किटेक्ट सटीक प्रतिनिधित्व के लिए सममितीय प्रोजेक्शन का उपयोग करके बिल्डिंग प्लान बनाते हैं।',
    artDesign: 'प्रोडक्ट डिजाइन',
    artDesignDesc: 'प्रोडक्ट डिजाइनर डिजाइन कॉन्सेप्ट्स को विजुअलाइज और कम्यूनिकेट करने के लिए 3D स्केचिंग तकनीकों का उपयोग करते हैं।',
    surveying: 'CAD सॉफ्टवेयर',
    surveyingDesc: 'कंप्यूटर-एडेड डिजाइन सॉफ्टवेयर 3D मॉडलिंग के लिए सममितीय और तिरछे प्रोजेक्शन सिद्धांतों का उपयोग करता है।',
    computerGraphics: 'गेम डेवलपमेंट',
    computerGraphicsDesc: 'गेम डेवलपर्स 2D स्क्रीन पर यथार्थवादी 3D वातावरण बनाने के लिए 3D ड्रॉइंग तकनीकों का उपयोग करते हैं।',
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
    // Button translations
    obliqueSketches: 'तिरछे स्केच',
    isometricSketches: 'सममितीय स्केच',
    visualisingSolidObjects: 'ठोस वस्तुओं का दृश्यीकरण',
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
    chapterTitle: '3D આકૃતિઓ દોરવી',
    topicTitle: 'સપાટ કાગળ પર 3D ઘન આકૃતિઓ દોરવાની તકનીકો',
    whatIsTopic: 'અમે સપાટ કાગળ પર 3D આકૃતિઓ કેવી રીતે દોરીએ છીએ?',
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
    definition: '3D ડ્રોઇંગની વ્યાખ્યા',
    definitionText: 'સપાટ કાગળ પર ત્રિ-પરિમાણીય ઘન આકૃતિઓ દોરવા માટે ઊંડાઈની દ્રશ્ય ભ્રમણા બનાવવા અને તેમને ત્રિ-પરિમાણીય દેખાડવા માટે વિશેષ તકનીકોની જરૂર પડે છે।',
    keyPropertyText: 'બે મુખ્ય તકનીકો: ત્રાંસા સ્કેચ (પ્રમાણસર નહીં) અને સમમિતીય સ્કેચ (પ્રમાણસર માપ)।',
    importantRule: 'ત્રાંસા સ્કેચ',
    importantRuleText: 'આગળથી ઘન કેવું દેખાય છે તેનો સ્પષ્ટ વિચાર આપે છે। માપ પ્રમાણસર નથી હોતા। આગળ અને વિરુદ્ધ ફલક સમાન કદના દેખાય છે।',
    sumProperty: 'સમમિતીય સ્કેચ',
    sumPropertyText: 'વિશેષ સમમિતીય ડોટ પેપર પર દોરવામાં આવે છે। માપ ચોક્કસ અને પ્રમાણસર હોય છે। વધુ ચોક્કસ પ્રતિનિધિત્વ।',
    visualization: 'ડ્રોઇંગ દ્રશ્યીકરણ',
    interiorElements: 'છુપાયેલા કિનારા',
    exteriorElements: 'દેખાતા કિનારા',
    triangleOf: 'ડ્રોઇંગ',
    of: 'નો',
    yourAnswer: 'તમારો જવાબ',
    enterAnswer: 'તમારો જવાબ દાખલ કરો...',
    architecture: 'તકનીકી ડ્રોઇંગ',
    architectureDesc: 'ઇજનેરો અને આર્કિટેક્ટ બ્લુપ્રિન્ટ અને તકનીકી ડ્રોઇંગ બનાવવા માટે ત્રાંસા અને સમમિતીય સ્કેચનો ઉપયોગ કરે છે।',
    navigation: 'ઇજનેરી ડિઝાઇન',
    navigationDesc: 'મિકેનિકલ ઇજનેરો મશીન પાર્ટ્સ અને કંપોનન્ટ્સ ડિઝાઇન કરવા માટે 3D ડ્રોઇંગ તકનીકોનો ઉપયોગ કરે છે।',
    engineering: 'આર્કિટેક્ચરલ પ્લાન',
    engineeringDesc: 'આર્કિટેક્ટ ચોક્કસ પ્રતિનિધિત્વ માટે સમમિતીય પ્રોજેક્શનનો ઉપયોગ કરીને બિલ્ડિંગ પ્લાન બનાવે છે।',
    artDesign: 'પ્રોડક્ટ ડિઝાઇન',
    artDesignDesc: 'પ્રોડક્ટ ડિઝાઇનર ડિઝાઇન કન્સેપ્ટ્સને વિઝ્યુઅલાઇઝ અને કમ્યુનિકેટ કરવા માટે 3D સ્કેચિંગ તકનીકોનો ઉપયોગ કરે છે।',
    surveying: 'CAD સોફ્ટવેર',
    surveyingDesc: 'કમ્પ્યુટર-એડેડ ડિઝાઇન સોફ્ટવેર 3D મોડેલિંગ માટે સમમિતીય અને ત્રાંસા પ્રોજેક્શન સિદ્ધાંતોનો ઉપયોગ કરે છે।',
    computerGraphics: 'ગેમ ડેવલપમેન્ટ',
    computerGraphicsDesc: 'ગેમ ડેવલપર્સ 2D સ્ક્રીન પર વાસ્તવિક 3D વાતાવરણ બનાવવા માટે 3D ડ્રોઇંગ તકનીકોનો ઉપયોગ કરે છે।',
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
    // Button translations
    obliqueSketches: 'ત્રાંસા સ્કેચ',
    isometricSketches: 'સમમિતીય સ્કેચ',
    visualisingSolidObjects: 'ઘન વસ્તુઓનું દ્રશ્યીકરણ',
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

// Practice exercises with 3D drawing techniques
const practiceExercises: PracticeExercise[] = [
  {
    id: 'ex1',
    type: 'identification',
    difficulty: 'beginner',
    question: 'Which drawing technique shows measurements that are NOT proportional? Oblique Sketches or Isometric Sketches?',
    data: { 
      techniques: ['Oblique Sketches', 'Isometric Sketches'], 
      correctType: 'Oblique',
      visualShapes: ['ObliqueCube', 'IsometricCube']
    },
    correctAnswer: 'Oblique Sketches',
    hint: 'Oblique sketches give a clear idea from the front but measurements are not proportional. Isometric sketches have exact proportional measurements.',
    translations: {
      gu: {
        question: 'કઈ ડ્રોઇંગ તકનીક માપ દર્શાવે છે જે પ્રમાણસર નથી? ત્રાંસા સ્કેચ કે સમમિતીય સ્કેચ?',
        hint: 'ત્રાંસા સ્કેચ આગળથી સ્પષ્ટ વિચાર આપે છે પરંતુ માપ પ્રમાણસર નથી હોતા। સમમિતીય સ્કેચમાં ચોક્કસ પ્રમાણસર માપ હોય છે।'
      },
      hi: {
        question: 'कौन सी ड्रॉइंग तकनीक माप दिखाती है जो अनुपातिक नहीं है? तिरछे स्केच या सममितीय स्केच?',
        hint: 'तिरछे स्केच सामने से स्पष्ट विचार देते हैं लेकिन माप अनुपातिक नहीं होते। सममितीय स्केच में सटीक अनुपातिक माप होते हैं।'
      }
    }
  },
  {
    id: 'ex2',
    type: 'identification',
    difficulty: 'intermediate',
    question: 'In oblique sketches, which lines are drawn with dotted lines? Visible edges or Hidden edges?',
    data: { 
      lineTypes: ['Visible edges', 'Hidden edges'],
      visualShapes: ['ObliqueCubeWithHidden']
    },
    correctAnswer: 'Hidden edges',
    hint: 'In oblique sketches, hidden edges (edges that are not visible from the front view) are drawn with dotted lines.',
    translations: {
      gu: {
        question: 'ત્રાંસા સ્કેચમાં, કઈ રેખાઓ ડોટેડ રેખાઓ સાથે દોરવામાં આવે છે? દેખાતા કિનારા કે છુપાયેલા કિનારા?',
        hint: 'ત્રાંસા સ્કેચમાં, છુપાયેલા કિનારા (આગળના દૃશ્યથી દેખાતા નથી) ડોટેડ રેખાઓ સાથે દોરવામાં આવે છે।'
      },
      hi: {
        question: 'तिरछे स्केच में, कौन सी रेखाएं बिंदुओं वाली रेखाओं से खींची जाती हैं? दिखाई देने वाली किनारे या छुपी हुई किनारे?',
        hint: 'तिरछे स्केच में, छुपी हुई किनारे (सामने के दृश्य से दिखाई नहीं देने वाली) बिंदुओं वाली रेखाओं से खींची जाती हैं।'
      }
    }
  },
  {
    id: 'ex3',
    type: 'verification',
    difficulty: 'advanced',
    question: 'Which drawing technique is drawn on special isometric dot paper and has exact proportional measurements?',
    data: { 
      techniques: ['Oblique Sketches', 'Isometric Sketches', 'Perspective Sketches'],
      visualShapes: ['IsometricGrid', 'ObliqueGrid']
    },
    correctAnswer: 'Isometric Sketches',
    hint: 'Isometric sketches are drawn on special isometric dot paper (which divides the page into small equilateral triangles) and have exact proportional measurements.',
    translations: {
      gu: {
        question: 'કઈ ડ્રોઇંગ તકનીક વિશેષ સમમિતીય ડોટ પેપર પર દોરવામાં આવે છે અને ચોક્કસ પ્રમાણસર માપ ધરાવે છે?',
        hint: 'સમમિતીય સ્કેચ વિશેષ સમમિતીય ડોટ પેપર પર દોરવામાં આવે છે (જે પૃષ્ઠને નાના સમબાજુ ત્રિકોણમાં વિભાજિત કરે છે) અને ચોક્કસ પ્રમાણસર માપ ધરાવે છે।'
      },
      hi: {
        question: 'कौन सी ड्रॉइंग तकनीक विशेष सममितीय डॉट पेपर पर खींची जाती है और सटीक अनुपातिक माप रखती है?',
        hint: 'सममितीय स्केच विशेष सममितीय डॉट पेपर पर खींचे जाते हैं (जो पेज को छोटे समबाहु त्रिभुजों में विभाजित करता है) और सटीक अनुपातिक माप रखते हैं।'
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
      case 'ObliqueCube':
        const obliqueOffset = size * 0.2;
        const obliqueSize = size * 0.5;
        const obliqueDepth = size * 0.3;
        return (
          <svg viewBox={viewBox} className="w-full h-full">
            {/* Front face */}
            <rect x={obliqueOffset} y={obliqueOffset} width={obliqueSize} height={obliqueSize} fill="#a855f7" stroke="#7c3aed" strokeWidth="2" />
            {/* Back face (same size as front) */}
            <rect x={obliqueOffset + obliqueDepth} y={obliqueOffset + obliqueDepth} width={obliqueSize} height={obliqueSize} fill="#c084fc" stroke="#7c3aed" strokeWidth="2" />
            {/* Connecting lines */}
            <line x1={obliqueOffset} y1={obliqueOffset} x2={obliqueOffset + obliqueDepth} y2={obliqueOffset + obliqueDepth} stroke="#7c3aed" strokeWidth="2" />
            <line x1={obliqueOffset + obliqueSize} y1={obliqueOffset} x2={obliqueOffset + obliqueSize + obliqueDepth} y2={obliqueOffset + obliqueDepth} stroke="#7c3aed" strokeWidth="2" />
            <line x1={obliqueOffset} y1={obliqueOffset + obliqueSize} x2={obliqueOffset + obliqueDepth} y2={obliqueOffset + obliqueSize + obliqueDepth} stroke="#7c3aed" strokeWidth="2" />
            <line x1={obliqueOffset + obliqueSize} y1={obliqueOffset + obliqueSize} x2={obliqueOffset + obliqueSize + obliqueDepth} y2={obliqueOffset + obliqueSize + obliqueDepth} stroke="#7c3aed" strokeWidth="2" />
            <text x={center - 20} y={center + obliqueSize + 20} fill="#4c1d95" fontSize="9" fontWeight="bold">Oblique</text>
          </svg>
        );

      case 'IsometricCube':
        const isoOffset = size * 0.2;
        const isoSize = size * 0.4;
        const isoDepth = size * 0.2;
        return (
          <svg viewBox={viewBox} className="w-full h-full">
            {/* Isometric cube with 30-degree angles */}
            <path d={`M${center},${isoOffset} L${center + isoSize},${isoOffset + isoDepth} L${center + isoSize},${isoOffset + isoSize + isoDepth} L${center},${isoOffset + isoSize} Z`} fill="#14b8a6" stroke="#0d9488" strokeWidth="2" />
            <path d={`M${center},${isoOffset} L${center - isoDepth},${isoOffset + isoDepth} L${center - isoDepth},${isoOffset + isoSize + isoDepth} L${center},${isoOffset + isoSize} Z`} fill="#0d9488" stroke="#0d9488" strokeWidth="2" />
            <path d={`M${center + isoSize},${isoOffset + isoDepth} L${center + isoSize - isoDepth},${isoOffset + isoDepth * 2} L${center + isoSize - isoDepth},${isoOffset + isoSize + isoDepth} L${center + isoSize},${isoOffset + isoSize + isoDepth} Z`} fill="#0891b2" stroke="#0d9488" strokeWidth="2" />
            <text x={center - 15} y={center + isoSize + 20} fill="#0d9488" fontSize="9" fontWeight="bold">Isometric</text>
          </svg>
        );

      case 'ObliqueCubeWithHidden':
        const hiddenOffset = size * 0.2;
        const hiddenSize = size * 0.5;
        const hiddenDepth = size * 0.3;
        return (
          <svg viewBox={viewBox} className="w-full h-full">
            {/* Front face */}
            <rect x={hiddenOffset} y={hiddenOffset} width={hiddenSize} height={hiddenSize} fill="#a855f7" stroke="#7c3aed" strokeWidth="2" />
            {/* Back face */}
            <rect x={hiddenOffset + hiddenDepth} y={hiddenOffset + hiddenDepth} width={hiddenSize} height={hiddenSize} fill="#c084fc" stroke="#7c3aed" strokeWidth="2" />
            {/* Visible connecting lines */}
            <line x1={hiddenOffset} y1={hiddenOffset} x2={hiddenOffset + hiddenDepth} y2={hiddenOffset + hiddenDepth} stroke="#7c3aed" strokeWidth="2" />
            <line x1={hiddenOffset + hiddenSize} y1={hiddenOffset} x2={hiddenOffset + hiddenSize + hiddenDepth} y2={hiddenOffset + hiddenDepth} stroke="#7c3aed" strokeWidth="2" />
            <line x1={hiddenOffset} y1={hiddenOffset + hiddenSize} x2={hiddenOffset + hiddenDepth} y2={hiddenOffset + hiddenSize + hiddenDepth} stroke="#7c3aed" strokeWidth="2" />
            {/* Hidden edges (dotted lines) */}
            <line x1={hiddenOffset + hiddenSize} y1={hiddenOffset + hiddenSize} x2={hiddenOffset + hiddenSize + hiddenDepth} y2={hiddenOffset + hiddenSize + hiddenDepth} stroke="#7c3aed" strokeWidth="2" strokeDasharray="3,3" />
            <line x1={hiddenOffset + hiddenSize} y1={hiddenOffset} x2={hiddenOffset + hiddenSize} y2={hiddenOffset + hiddenSize} stroke="#7c3aed" strokeWidth="2" strokeDasharray="3,3" />
            <line x1={hiddenOffset + hiddenSize + hiddenDepth} y1={hiddenOffset + hiddenDepth} x2={hiddenOffset + hiddenSize + hiddenDepth} y2={hiddenOffset + hiddenSize + hiddenDepth} stroke="#7c3aed" strokeWidth="2" strokeDasharray="3,3" />
            <text x={center - 25} y={center + hiddenSize + 20} fill="#4c1d95" fontSize="9" fontWeight="bold">Hidden Edges</text>
          </svg>
        );

      case 'IsometricGrid':
        return (
          <svg viewBox={viewBox} className="w-full h-full">
            {/* Isometric grid pattern */}
            <defs>
              <pattern id="isometricGrid" patternUnits="userSpaceOnUse" width="20" height="20">
                <path d="M0,10 L10,0 L20,10 L10,20 Z" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#isometricGrid)" />
            <text x={center} y={center} fill="#6b7280" fontSize="10" fontWeight="bold" textAnchor="middle">Isometric Grid</text>
          </svg>
        );

      case 'ObliqueGrid':
        return (
          <svg viewBox={viewBox} className="w-full h-full">
            {/* Oblique grid pattern */}
            <defs>
              <pattern id="obliqueGrid" patternUnits="userSpaceOnUse" width="20" height="20">
                <rect x="0" y="0" width="20" height="20" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#obliqueGrid)" />
            <text x={center} y={center} fill="#6b7280" fontSize="10" fontWeight="bold" textAnchor="middle">Oblique Grid</text>
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
  const [selectedSketchType, setSelectedSketchType] = useState<'oblique' | 'isometric' | 'visualization'>('oblique');
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

  const renderDemonstrationMode = () => (
    <div className="space-y-6">
      {selectedSketchType === 'oblique' ? (
        <DrawingTechniquesDemo language={language} />
      ) : selectedSketchType === 'isometric' ? (
        <IsometricSketchDemo language={language} />
      ) : (
        <SpatialCubesVisualization language={language} />
      )}
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
    <div className="space-y-8">
      {/* Applications content */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-6 md:p-8">
        {/* Applications Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 1. Architecture & Building Design */}
          <div className="application-card bg-white rounded-3xl shadow-2xl p-8 hover:shadow-xl transition-all duration-300 border-2 border-teal-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="text-6xl">🏛️</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {language === 'en' ? 'Architecture & Building Design' : 
                   language === 'hi' ? 'वास्तुकला और भवन डिजाइन' : 
                   'આર્કિટેક્ચર અને બિલ્ડિંગ ડિઝાઇન'}
                </h3>
                <p className="text-sm text-gray-500">
                  {language === 'en' ? 'Professional blueprints and construction planning' : 
                   language === 'hi' ? 'पेशेवर ब्लूप्रिंट और निर्माण योजना' : 
                   'વ્યાવસાયિક બ્લુપ્રિન્ટ અને બાંધકામ આયોજન'}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-teal-50 p-4 rounded-xl border-2 border-teal-200">
                <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <span>📋</span>
                  {language === 'en' ? 'Implementation:' : language === 'hi' ? 'कार्यान्वयन:' : 'અમલીકરણ:'}
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 font-bold">•</span>
                    <span>{language === 'en' ? 'Floor plans use oblique projection to show room layouts clearly' : 
                          language === 'hi' ? 'फ्लोर प्लान में कमरों का लेआउट स्पष्ट रूप से दिखाने के लिए तिरछे प्रक्षेपण का उपयोग किया जाता है' : 
                          'ફ્લોર પ્લાન રૂમ લેઆઉટ સ્પષ્ટપણે દર્શાવવા માટે ત્રાંસા પ્રોજેક્શનનો ઉપયોગ કરે છે'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 font-bold">•</span>
                    <span>{language === 'en' ? 'Isometric drawings show accurate dimensions for walls, doors, and windows' : 
                          language === 'hi' ? 'सममितीय चित्र दीवारों, दरवाजों और खिड़कियों के सटीक आयाम दिखाते हैं' : 
                          'સમમિતીય ચિત્રો દિવાલો, દરવાજા અને બારીઓ માટે ચોક્કસ પરિમાણો દર્શાવે છે'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 font-bold">•</span>
                    <span>{language === 'en' ? 'Elevation views help visualize building facades from different angles' : 
                          language === 'hi' ? 'उन्नयन दृश्य विभिन्न कोणों से इमारत के मुखौटे को देखने में मदद करते हैं' : 
                          'એલિવેશન વ્યૂ વિવિધ ખૂણાઓથી બિલ્ડિંગ ફેસેડ જોવામાં મદદ કરે છે'}</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span>🎯</span>
                  {language === 'en' ? 'Real Example:' : language === 'hi' ? 'वास्तविक उदाहरण:' : 'વાસ્તવિક ઉદાહરણ:'}
                </h4>
                <div className="bg-white p-4 rounded-lg">
                  <svg width="100%" height="150" viewBox="0 0 300 150" className="mx-auto">
                    {/* Building facade in oblique projection */}
                    <rect x="50" y="40" width="120" height="80" fill="#E5E7EB" stroke="#14b8a6" strokeWidth="2"/>
                    <rect x="80" y="60" width="25" height="35" fill="#93C5FD" stroke="#3B82F6" strokeWidth="1.5"/>
                    <rect x="115" y="60" width="25" height="35" fill="#93C5FD" stroke="#3B82F6" strokeWidth="1.5"/>
                    <rect x="90" y="100" width="30" height="20" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1.5"/>
                    <polygon points="50,40 110,20 230,20 170,40" fill="#F59E0B" stroke="#D97706" strokeWidth="2"/>
                    
                    {/* Oblique depth lines */}
                    <line x1="170" y1="40" x2="230" y2="20" stroke="#14b8a6" strokeWidth="2"/>
                    <line x1="170" y1="120" x2="230" y2="100" stroke="#14b8a6" strokeWidth="2"/>
                    <rect x="170" y="40" width="60" height="80" fill="#D1D5DB" stroke="#14b8a6" strokeWidth="2"/>
                    
                    <text x="150" y="145" className="text-xs font-bold fill-teal-700">
                      {language === 'en' ? 'Building Elevation (Oblique)' : 
                       language === 'hi' ? 'भवन उन्नयन (तिरछा)' : 
                       'બિલ્ડિંગ એલિવેશન (ત્રાંસું)'}
                    </text>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Mechanical Engineering */}
          <div className="application-card bg-white rounded-3xl shadow-2xl p-8 hover:shadow-xl transition-all duration-300 border-2 border-purple-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="text-6xl">⚙️</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {language === 'en' ? 'Mechanical Engineering' : 
                   language === 'hi' ? 'यांत्रिक इंजीनियरिंग' : 
                   'મિકેનિકલ ઇજનેરી'}
                </h3>
                <p className="text-sm text-gray-500">
                  {language === 'en' ? 'Machine parts and component design' : 
                   language === 'hi' ? 'मशीन पार्ट्स और कंपोनेंट डिजाइन' : 
                   'મશીન પાર્ટ્સ અને કંપોનન્ટ ડિઝાઇન'}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-xl border-2 border-purple-200">
                <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <span>📋</span>
                  {language === 'en' ? 'Implementation:' : language === 'hi' ? 'कार्यान्वयन:' : 'અમલીકરણ:'}
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>{language === 'en' ? 'Isometric views show gears, bolts, and mechanical parts with exact dimensions' : 
                          language === 'hi' ? 'सममितीय दृश्य गियर, बोल्ट और यांत्रिक पुर्जों को सटीक आयामों के साथ दिखाते हैं' : 
                          'સમમિતીય દૃશ્યો ગિયર્સ, બોલ્ટ્સ અને મિકેનિકલ પાર્ટ્સને ચોક્કસ પરિમાણો સાથે દર્શાવે છે'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>{language === 'en' ? 'Assembly drawings use oblique projection to show how parts fit together' : 
                          language === 'hi' ? 'असेंबली चित्र भागों को एक साथ कैसे फिट किया जाए यह दिखाने के लिए तिरछे प्रक्षेपण का उपयोग करते हैं' : 
                          'એસેમ્બલી ડ્રોઇંગ્સ પાર્ટ્સ કેવી રીતે એકસાથે ફિટ થાય છે તે દર્શાવવા માટે ત્રાંસા પ્રોજેક્શનનો ઉપયોગ કરે છે'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>{language === 'en' ? 'Hidden edges shown with dotted lines reveal internal mechanisms' : 
                          language === 'hi' ? 'बिंदुओं वाली रेखाओं के साथ दिखाई गई छिपी हुई किनारें आंतरिक तंत्र को प्रकट करती हैं' : 
                          'ડોટેડ રેખાઓ સાથે દર્શાવવામાં આવેલી છુપાયેલી કિનારાઓ આંતરિક પદ્ધતિઓ દર્શાવે છે'}</span>
                  </li>
                </ul>
              </div>

              <div className="bg-indigo-50 p-4 rounded-xl border-2 border-indigo-200">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span>🎯</span>
                  {language === 'en' ? 'Real Example:' : language === 'hi' ? 'वास्तविक उदाहरण:' : 'વાસ્તવિક ઉદાહરણ:'}
                </h4>
                <div className="bg-white p-4 rounded-lg">
                  <svg width="100%" height="150" viewBox="0 0 300 150" className="mx-auto">
                    {/* Isometric gear/mechanical part */}
                    <path d="M100,50 L140,30 L180,50 L180,90 L140,110 L100,90 Z" fill="#F3E8FF" stroke="#a855f7" strokeWidth="2"/>
                    <path d="M100,50 L100,90 L140,110 L140,70 Z" fill="#E0E7FF" stroke="#7c3aed" strokeWidth="2"/>
                    <path d="M140,30 L180,50 L180,90 L140,70 Z" fill="#DDD6FE" stroke="#9333ea" strokeWidth="2"/>
                    
                    {/* Internal circle (gear center) */}
                    <circle cx="140" cy="70" r="15" fill="#FBBF24" stroke="#F59E0B" strokeWidth="2"/>
                    <circle cx="140" cy="70" r="8" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5"/>
                    
                    {/* Dimension lines */}
                    <line x1="180" y1="50" x2="200" y2="50" stroke="#EF4444" strokeWidth="1" strokeDasharray="2,2"/>
                    <line x1="180" y1="90" x2="200" y2="90" stroke="#EF4444" strokeWidth="1" strokeDasharray="2,2"/>
                    <line x1="195" y1="50" x2="195" y2="90" stroke="#EF4444" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                    <text x="200" y="72" className="text-xs fill-red-600 font-bold">40mm</text>
                    
                    <text x="150" y="145" className="text-xs font-bold fill-purple-700" textAnchor="middle">
                      {language === 'en' ? 'Gear Component (Isometric)' : 
                       language === 'hi' ? 'गियर कंपोनेंट (सममितीय)' : 
                       'ગિયર કંપોનન્ટ (સમમિતીય)'}
                    </text>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Product & Industrial Design */}
          <div className="application-card bg-white rounded-3xl shadow-2xl p-8 hover:shadow-xl transition-all duration-300 border-2 border-pink-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="text-6xl">📱</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {language === 'en' ? 'Product & Industrial Design' : 
                   language === 'hi' ? 'उत्पाद और औद्योगिक डिजाइन' : 
                   'પ્રોડક્ટ અને ઔદ્યોગિક ડિઝાઇન'}
                </h3>
                <p className="text-sm text-gray-500">
                  {language === 'en' ? 'Consumer products and packaging design' : 
                   language === 'hi' ? 'उपभोक्ता उत्पाद और पैकेजिंग डिजाइन' : 
                   'ગ્રાહક ઉત્પાદનો અને પેકેજિંગ ડિઝાઇન'}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-pink-50 p-4 rounded-xl border-2 border-pink-200">
                <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <span>📋</span>
                  {language === 'en' ? 'Implementation:' : language === 'hi' ? 'कार्यान्वयन:' : 'અમલીકરણ:'}
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-pink-600 font-bold">•</span>
                    <span>{language === 'en' ? 'Smartphone and electronics sketches show design from multiple angles' : 
                          language === 'hi' ? 'स्मार्टफोन और इलेक्ट्रॉनिक्स स्केच कई कोणों से डिजाइन दिखाते हैं' : 
                          'સ્માર્ટફોન અને ઇલેક્ટ્રોનિક્સ સ્કેચ અનેક ખૂણાઓથી ડિઝાઇન દર્શાવે છે'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-600 font-bold">•</span>
                    <span>{language === 'en' ? 'Packaging boxes use oblique drawings to visualize final product' : 
                          language === 'hi' ? 'पैकेजिंग बक्से अंतिम उत्पाद को देखने के लिए तिरछे चित्रों का उपयोग करते हैं' : 
                          'પેકેજિંગ બોક્સ અંતિમ ઉત્પાદનને જોવા માટે ત્રાંસા ચિત્રોનો ઉપયોગ કરે છે'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-600 font-bold">•</span>
                    <span>{language === 'en' ? 'Furniture design uses isometric views for accurate assembly instructions' : 
                          language === 'hi' ? 'फर्नीचर डिजाइन सटीक असेंबली निर्देशों के लिए सममितीय दृश्यों का उपयोग करता है' : 
                          'ફર્નિચર ડિઝાઇન ચોક્કસ એસેમ્બલી સૂચનાઓ માટે સમમિતીય દૃશ્યોનો ઉપયોગ કરે છે'}</span>
                  </li>
                </ul>
              </div>

              <div className="bg-rose-50 p-4 rounded-xl border-2 border-rose-200">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span>🎯</span>
                  {language === 'en' ? 'Real Example:' : language === 'hi' ? 'वास्तविक उदाहरण:' : 'વાસ્તવિક ઉદાહરણ:'}
                </h4>
                <div className="bg-white p-4 rounded-lg">
                  <svg width="100%" height="150" viewBox="0 0 300 150" className="mx-auto">
                    {/* Product box in oblique */}
                    <rect x="80" y="50" width="80" height="60" fill="#FCE7F3" stroke="#EC4899" strokeWidth="2"/>
                    <path d="M160,50 L185,35 L185,95 L160,110 Z" fill="#FDF2F8" stroke="#F472B6" strokeWidth="2"/>
                    <path d="M80,50 L105,35 L185,35 L160,50 Z" fill="#FBCFE8" stroke="#DB2777" strokeWidth="2"/>
                    
                    {/* Product label */}
                    <rect x="95" y="65" width="50" height="30" fill="#FFF" stroke="#EC4899" strokeWidth="1.5" rx="3"/>
                    <text x="120" y="82" className="text-xs font-bold fill-pink-600" textAnchor="middle">PRODUCT</text>
                    <circle cx="110" cy="90" r="3" fill="#EC4899"/>
                    <circle cx="120" cy="90" r="3" fill="#F472B6"/>
                    <circle cx="130" cy="90" r="3" fill="#FBCFE8"/>
                    
                    <text x="150" y="145" className="text-xs font-bold fill-pink-700" textAnchor="middle">
                      {language === 'en' ? 'Product Packaging (Oblique)' : 
                       language === 'hi' ? 'उत्पाद पैकेजिंग (तिरछा)' : 
                       'પ્રોડક્ટ પેકેજિંગ (ત્રાંસું)'}
                    </text>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Video Games & Animation */}
          <div className="application-card bg-white rounded-3xl shadow-2xl p-8 hover:shadow-xl transition-all duration-300 border-2 border-cyan-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="text-6xl">🎮</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {language === 'en' ? 'Video Games & Animation' : 
                   language === 'hi' ? 'वीडियो गेम्स और एनिमेशन' : 
                   'વિડિયો ગેમ્સ અને એનિમેશન'}
                </h3>
                <p className="text-sm text-gray-500">
                  {language === 'en' ? '3D environments and character modeling' : 
                   language === 'hi' ? '3D वातावरण और चरित्र मॉडलिंग' : 
                   '3D વાતાવરણ અને પાત્ર મોડેલિંગ'}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-cyan-50 p-4 rounded-xl border-2 border-cyan-200">
                <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <span>📋</span>
                  {language === 'en' ? 'Implementation:' : language === 'hi' ? 'कार्यान्वयन:' : 'અમલીકરણ:'}
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-600 font-bold">•</span>
                    <span>{language === 'en' ? 'Isometric perspective used in strategy games like SimCity and Age of Empires' : 
                          language === 'hi' ? 'SimCity और Age of Empires जैसे रणनीति खेलों में सममितीय परिप्रेक्ष्य का उपयोग किया जाता है' : 
                          'SimCity અને Age of Empires જેવી વ્યૂહરચના રમતોમાં સમમિતીય પરિપ્રેક્ષ્યનો ઉપયોગ થાય છે'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-600 font-bold">•</span>
                    <span>{language === 'en' ? 'Minecraft uses oblique-style blocks to create its iconic 3D world' : 
                          language === 'hi' ? 'Minecraft अपनी प्रतिष्ठित 3D दुनिया बनाने के लिए तिरछे-शैली के ब्लॉक का उपयोग करता है' : 
                          'Minecraft તેની પ્રતિષ્ઠિત 3D દુનિયા બનાવવા માટે ત્રાંસી શૈલીના બ્લોક્સનો ઉપયોગ કરે છે'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-600 font-bold">•</span>
                    <span>{language === 'en' ? '2D games use isometric grids to simulate 3D movement on flat screens' : 
                          language === 'hi' ? '2D गेम्स सपाट स्क्रीन पर 3D गति का अनुकरण करने के लिए सममितीय ग्रिड का उपयोग करते हैं' : 
                          '2D ગેમ્સ સપાટ સ્ક્રીન પર 3D હલનચલનનું અનુકરણ કરવા માટે સમમિતીય ગ્રિડનો ઉપયોગ કરે છે'}</span>
                  </li>
                </ul>
              </div>

              <div className="bg-sky-50 p-4 rounded-xl border-2 border-sky-200">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span>🎯</span>
                  {language === 'en' ? 'Real Example:' : language === 'hi' ? 'वास्तविक उदाहरण:' : 'વાસ્તવિક ઉદાહરણ:'}
                </h4>
                <div className="bg-white p-4 rounded-lg">
                  <svg width="100%" height="150" viewBox="0 0 300 150" className="mx-auto">
                    {/* Isometric game scene */}
                    {/* Ground tiles */}
                    <path d="M100,80 L130,65 L160,80 L130,95 Z" fill="#86EFAC" stroke="#22C55E" strokeWidth="2"/>
                    <path d="M130,65 L160,50 L190,65 L160,80 Z" fill="#6EE7B7" stroke="#10B981" strokeWidth="2"/>
                    <path d="M160,80 L190,65 L220,80 L190,95 Z" fill="#86EFAC" stroke="#22C55E" strokeWidth="2"/>
                    
                    {/* Building/cube */}
                    <path d="M130,45 L160,30 L190,45 L190,65 L160,80 L130,65 Z" fill="#E0F2FE" stroke="#06B6D4" strokeWidth="2"/>
                    <path d="M130,45 L130,65 L160,80 L160,60 Z" fill="#BAE6FD" stroke="#0EA5E9" strokeWidth="2"/>
                    <path d="M160,30 L190,45 L190,65 L160,60 Z" fill="#7DD3FC" stroke="#0284C7" strokeWidth="2"/>
                    
                    {/* Tree */}
                    <polygon points="215,50 220,40 225,50" fill="#16A34A" stroke="#15803D" strokeWidth="1.5"/>
                    <rect x="219" y="50" width="2" height="8" fill="#92400E"/>
                    
                    <text x="150" y="145" className="text-xs font-bold fill-cyan-700" textAnchor="middle">
                      {language === 'en' ? 'Isometric Game World' : 
                       language === 'hi' ? 'सममितीय गेम दुनिया' : 
                       'સમમિતીય ગેમ વર્લ્ડ'}
                    </text>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Interior Design */}
          <div className="application-card bg-white rounded-3xl shadow-2xl p-8 hover:shadow-xl transition-all duration-300 border-2 border-amber-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="text-6xl">🛋️</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {language === 'en' ? 'Interior Design & Space Planning' : 
                   language === 'hi' ? 'आंतरिक डिजाइन और स्थान योजना' : 
                   'ઇન્ટિરિયર ડિઝાઇન અને સ્પેસ પ્લાનિંગ'}
                </h3>
                <p className="text-sm text-gray-500">
                  {language === 'en' ? 'Room layouts and furniture placement' : 
                   language === 'hi' ? 'कमरे का लेआउट और फर्नीचर प्लेसमेंट' : 
                   'રૂમ લેઆઉટ અને ફર્નિચર પ્લેસમેન્ટ'}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-amber-50 p-4 rounded-xl border-2 border-amber-200">
                <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <span>📋</span>
                  {language === 'en' ? 'Implementation:' : language === 'hi' ? 'कार्यान्वयन:' : 'અમલીકરણ:'}
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{language === 'en' ? 'Room layouts show furniture arrangement in oblique view for clarity' : 
                          language === 'hi' ? 'कमरे के लेआउट स्पष्टता के लिए तिरछे दृश्य में फर्नीचर व्यवस्था दिखाते हैं' : 
                          'રૂમ લેઆઉટ સ્પષ્ટતા માટે ત્રાંસા દૃશ્યમાં ફર્નિચર વ્યવસ્થા દર્શાવે છે'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{language === 'en' ? 'Kitchen cabinet designs use isometric drawings for accurate measurements' : 
                          language === 'hi' ? 'रसोई कैबिनेट डिजाइन सटीक माप के लिए सममितीय चित्रों का उपयोग करते हैं' : 
                          'કિચન કેબિનેટ ડિઝાઇન ચોક્કસ માપ માટે સમમિતીય ચિત્રોનો ઉપયોગ કરે છે'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{language === 'en' ? '3D room visualizations help clients see design before implementation' : 
                          language === 'hi' ? '3D कमरे की कल्पना ग्राहकों को कार्यान्वयन से पहले डिजाइन देखने में मदद करती है' : 
                          '3D રૂમ વિઝ્યુઅલાઇઝેશન ક્લાયન્ટ્સને અમલીકરણ પહેલાં ડિઝાઇન જોવામાં મદદ કરે છે'}</span>
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-4 rounded-xl border-2 border-yellow-200">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span>🎯</span>
                  {language === 'en' ? 'Real Example:' : language === 'hi' ? 'वास्तविक उदाहरण:' : 'વાસ્તવિક ઉદાહરણ:'}
                </h4>
                <div className="bg-white p-4 rounded-lg">
                  <svg width="100%" height="150" viewBox="0 0 300 150" className="mx-auto">
                    {/* Room interior in oblique */}
                    <rect x="60" y="40" width="140" height="80" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2"/>
                    
                    {/* Furniture - Sofa */}
                    <rect x="80" y="90" width="50" height="20" fill="#D946EF" stroke="#A21CAF" strokeWidth="2"/>
                    <rect x="80" y="80" width="50" height="10" fill="#E879F9" stroke="#C026D3" strokeWidth="1.5"/>
                    
                    {/* Table */}
                    <rect x="150" y="100" width="30" height="15" fill="#A78BFA" stroke="#7C3AED" strokeWidth="2"/>
                    <line x1="155" y1="115" x2="155" y2="120" stroke="#6D28D9" strokeWidth="2"/>
                    <line x1="175" y1="115" x2="175" y2="120" stroke="#6D28D9" strokeWidth="2"/>
                    
                    {/* Window */}
                    <rect x="140" y="50" width="40" height="30" fill="#93C5FD" stroke="#3B82F6" strokeWidth="2"/>
                    <line x1="160" y1="50" x2="160" y2="80" stroke="#2563EB" strokeWidth="1.5"/>
                    <line x1="140" y1="65" x2="180" y2="65" stroke="#2563EB" strokeWidth="1.5"/>
                    
                    <text x="150" y="145" className="text-xs font-bold fill-amber-700" textAnchor="middle">
                      {language === 'en' ? 'Room Interior (Oblique)' : 
                       language === 'hi' ? 'कमरे का इंटीरियर (तिरछा)' : 
                       'રૂમ ઇન્ટિરિયર (ત્રાંસું)'}
                    </text>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* 6. Manufacturing & Prototyping */}
          <div className="application-card bg-white rounded-3xl shadow-2xl p-8 hover:shadow-xl transition-all duration-300 border-2 border-emerald-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="text-6xl">🏭</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {language === 'en' ? 'Manufacturing & 3D Printing' : 
                   language === 'hi' ? 'निर्माण और 3D प्रिंटिंग' : 
                   'ઉત્પાદન અને 3D પ્રિન્ટિંગ'}
                </h3>
                <p className="text-sm text-gray-500">
                  {language === 'en' ? 'Rapid prototyping and production planning' : 
                   language === 'hi' ? 'त्वरित प्रोटोटाइपिंग और उत्पादन योजना' : 
                   'ઝડપી પ્રોટોટાઇપિંગ અને ઉત્પાદન આયોજન'}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-emerald-50 p-4 rounded-xl border-2 border-emerald-200">
                <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <span>📋</span>
                  {language === 'en' ? 'Implementation:' : language === 'hi' ? 'कार्यान्वयन:' : 'અમલીકરણ:'}
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{language === 'en' ? 'CAD software converts isometric drawings to 3D printer instructions' : 
                          language === 'hi' ? 'CAD सॉफ्टवेयर सममितीय चित्रों को 3D प्रिंटर निर्देशों में परिवर्तित करता है' : 
                          'CAD સોફ્ટવેર સમમિતીય ચિત્રોને 3D પ્રિન્ટર સૂચનાઓમાં રૂપાંતરિત કરે છે'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{language === 'en' ? 'Factory layouts use oblique views to plan machine placement' : 
                          language === 'hi' ? 'कारखाने के लेआउट मशीन प्लेसमेंट की योजना बनाने के लिए तिरछे दृश्यों का उपयोग करते हैं' : 
                          'ફેક્ટરી લેઆઉટ મશીન પ્લેસમેન્ટ આયોજિત કરવા માટે ત્રાંસા દૃશ્યોનો ઉપયોગ કરે છે'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{language === 'en' ? 'Quality control uses technical drawings to verify product dimensions' : 
                          language === 'hi' ? 'गुणवत्ता नियंत्रण उत्पाद आयामों को सत्यापित करने के लिए तकनीकी चित्रों का उपयोग करता है' : 
                          'ગુણવત્તા નિયંત્રણ ઉત્પાદન પરિમાણોની ચકાસણી માટે તકનીકી ચિત્રોનો ઉપયોગ કરે છે'}</span>
                  </li>
                </ul>
              </div>

              <div className="bg-teal-50 p-4 rounded-xl border-2 border-teal-200">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span>🎯</span>
                  {language === 'en' ? 'Real Example:' : language === 'hi' ? 'वास्तविक उदाहरण:' : 'વાસ્તવિક ઉદાહરણ:'}
                </h4>
                <div className="bg-white p-4 rounded-lg">
                  <svg width="100%" height="150" viewBox="0 0 300 150" className="mx-auto">
                    {/* 3D printer nozzle and object */}
                    <rect x="120" y="20" width="60" height="15" fill="#6B7280" stroke="#374151" strokeWidth="2"/>
                    <rect x="145" y="35" width="10" height="20" fill="#9CA3AF" stroke="#4B5563" strokeWidth="1.5"/>
                    
                    {/* Object being printed (isometric cube) */}
                    <path d="M120,80 L150,65 L180,80 L180,110 L150,125 L120,110 Z" fill="#D1FAE5" stroke="#10B981" strokeWidth="2"/>
                    <path d="M120,80 L120,110 L150,125 L150,95 Z" fill="#A7F3D0" stroke="#059669" strokeWidth="2"/>
                    <path d="M150,65 L180,80 L180,110 L150,95 Z" fill="#6EE7B7" stroke="#047857" strokeWidth="2"/>
                    
                    {/* Layer lines */}
                    <line x1="120" y1="90" x2="180" y2="90" stroke="#34D399" strokeWidth="1" strokeDasharray="3,3"/>
                    <line x1="120" y1="100" x2="180" y2="100" stroke="#34D399" strokeWidth="1" strokeDasharray="3,3"/>
                    
                    {/* Printing indicator */}
                    <circle cx="150" cy="55" r="3" fill="#EF4444" opacity="0.8"/>
                    
                    <text x="150" y="145" className="text-xs font-bold fill-emerald-700" textAnchor="middle">
                      {language === 'en' ? '3D Printing Process' : 
                       language === 'hi' ? '3D प्रिंटिंग प्रक्रिया' : 
                       '3D પ્રિન્ટિંગ પ્રક્રિયા'}
                    </text>
                  </svg>
                </div>
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
        {/* Sketch Type Selection Buttons - Only show in Learning mode */}
        {currentMode === 'demonstration' && (
          <div className="mb-8 flex justify-center gap-4 flex-wrap">
            <button
              onClick={() => setSelectedSketchType('oblique')}
              className={`px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg ${
                selectedSketchType === 'oblique'
                  ? 'bg-blue-600 text-white scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
              }`}
            >
              📐 {t.obliqueSketches}
            </button>
            <button
              onClick={() => setSelectedSketchType('isometric')}
              className={`px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg ${
                selectedSketchType === 'isometric'
                  ? 'bg-green-600 text-white scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
              }`}
            >
              📏 {t.isometricSketches}
            </button>
            <button
              onClick={() => setSelectedSketchType('visualization')}
              className={`px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg ${
                selectedSketchType === 'visualization'
                  ? 'bg-purple-600 text-white scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
              }`}
            >
              👁️ {t.visualisingSolidObjects}
            </button>
          </div>
        )}

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
