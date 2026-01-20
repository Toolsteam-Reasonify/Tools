import React, { useState, useEffect } from 'react';
import { Lightbulb, CheckCircle, XCircle, RotateCcw, SkipForward, Trophy, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    chapterTitle: 'Pair of Lines',
    topicTitle: 'Pairs of Lines',
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
    sumPropertyText: 'Cuboid/Box, Cone, Cube, Cylinder  , Pyramid - each has its own distinct net pattern. The Great Pyramid in Giza has a square base and four triangular sides.',
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
    // Angles content
    relatedAngles: 'Related Angles',
    anglesIntroduction: 'Lines and Angles',
    complementaryAngles: 'Complementary Angles',
    supplementaryAngles: 'Supplementary Angles',
    angleDefinition: 'Definition: Angle',
    angleDefinitionText: 'An angle is formed when lines or line segments meet. The corners formed when two lines or line segments intersect at a point create angles.',
    keyPoints: 'Key Points',
    typesOfAngles: 'Types of Angles',
    acuteAngle: 'Acute: Less than 90°',
    rightAngle: 'Right: Exactly 90°',
    obtuseAngle: 'Obtuse: Greater than 90°',
    angleMeasurement: 'Angles are measured in degrees (°)',
    angleFormation: 'Angles are formed at the point of intersection',
    angleSymbol: 'Symbol: ∠ABC represents angle ABC',
    sum90: 'Sum = 90° | Forms a right angle',
    sum180: 'Sum = 180° | Forms a straight line',
    formsStraightLine: 'forms a straight line',
    examples: 'Examples',
    adjustAngle: 'Adjust Angle 1',
    animateAngles: 'Animate Angles',
    interactiveDiagram: 'Interactive Diagram',
    quickSummary: 'Quick Summary',
    skip: 'Skip',
    overview: 'Overview',
    completed: 'Completed',
    questionNumber: 'Question',
    totalQuestions: 'Total Questions',
    backToPractice: 'Back to Practice',
    practiceComplete: 'Practice Complete!',
    congratulations: 'Congratulations!',
    youHaveCompleted: 'You have completed all practice exercises.',
    overviewTitle: 'Practice Overview',
    exerciseNumber: 'Exercise',
    status: 'Status',
    skipped: 'Skipped',
    statusCorrect: 'Correct',
    statusIncorrect: 'Incorrect',
    notAttempted: 'Not Attempted',
    score: 'Score',
    restartPractice: 'Restart Practice',
    question: 'Question',
    // Real World Applications for Angles
    clockWatch: 'Railroad Tracks',
    clockWatchDesc: 'Railway tracks are parallel lines that never meet. When a crossing (transversal) cuts across the tracks, it creates corresponding angles that are equal, ensuring safe track design.',
    construction: 'Street Grid',
    constructionDesc: 'City streets form a grid where roads act as transversals cutting through parallel avenues. This creates alternate interior angles that help in urban planning and navigation.',
    doorWindow: 'Railway Crossing',
    doorWindowDesc: 'Railway crossings show a transversal (crossing road) cutting across parallel railroad tracks. The angles formed help engineers design safe and efficient crossing points.',
    angleNavigation: 'Bridge Support Beams',
    angleNavigationDesc: 'Bridge structures use parallel beams with transversal support members. The angles formed (corresponding, alternate interior) ensure structural stability and load distribution.',
    roadsBridges: 'Window Panes',
    roadsBridgesDesc: 'Window panes have horizontal and vertical bars (parallel lines) with diagonal support (transversal). This creates various angle pairs that strengthen the window structure.',
    angleArchitecture: 'Ladder Design',
    angleArchitectureDesc: 'Ladders have parallel rungs connected by transversal side rails. The angles formed between rungs and rails follow geometric principles ensuring stability and safety.',
    furniture: 'Furniture Design',
    furnitureDesc: 'Furniture makers use supplementary angles for flat surfaces. Tables, shelves, and cabinets have straight edges (180°) to ensure stability and proper alignment.',
    geometry: 'Geometry & Surveying',
    geometryDesc: 'Surveyors use complementary and supplementary angles to measure land, map territories, and ensure accurate property boundaries using angle relationships.'
  },
  hi: {
    correct: 'सही!',
    incorrect: 'फिर कोशिश करें!',
    next: 'अगला',
    previous: 'पिछला',
    submit: 'जमा करें',
    hint: 'संकेत',
    learning: 'सीखें',
    practice: 'अभ्यास',
    selectLanguage: 'भाषा चुनें',
    chapterTitle: 'रेखाओं के युग्म',
    topicTitle: 'रेखाओं के युग्म',
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
    // Angles content
    relatedAngles: 'संबंधित कोण',
    anglesIntroduction: 'रेखाएं और कोण',
    complementaryAngles: 'पूरक कोण',
    supplementaryAngles: 'संपूरक कोण',
    angleDefinition: 'परिभाषा: कोण',
    angleDefinitionText: 'जब रेखाएं या रेखा खंड मिलते हैं तो कोण बनता है। जब दो रेखाएं या रेखा खंड एक बिंदु पर प्रतिच्छेद करते हैं तो वे कोण बनाते हैं।',
    keyPoints: 'मुख्य बिंदु',
    typesOfAngles: 'कोणों के प्रकार',
    acuteAngle: 'न्यून: 90° से कम',
    rightAngle: 'समकोण: बिल्कुल 90°',
    obtuseAngle: 'अधिक: 90° से अधिक',
    angleMeasurement: 'कोण डिग्री (°) में मापे जाते हैं',
    angleFormation: 'कोण प्रतिच्छेदन बिंदु पर बनते हैं',
    angleSymbol: 'प्रतीक: ∠ABC कोण ABC का प्रतिनिधित्व करता है',
    sum90: 'योग = 90° | समकोण बनाता है',
    sum180: 'योग = 180° | सीधी रेखा बनाता है',
    formsStraightLine: 'एक सीधी रेखा बनाता है',
    examples: 'उदाहरण',
    adjustAngle: 'कोण 1 समायोजित करें',
    animateAngles: 'कोणों को एनिमेट करें',
    interactiveDiagram: 'इंटरैक्टिव आरेख',
    quickSummary: 'त्वरित सारांश',
    skip: 'छोड़ें',
    overview: 'अवलोकन',
    completed: 'पूर्ण',
    questionNumber: 'प्रश्न',
    totalQuestions: 'कुल प्रश्न',
    backToPractice: 'अभ्यास पर वापस जाएं',
    practiceComplete: 'अभ्यास पूर्ण!',
    congratulations: 'बधाई हो!',
    youHaveCompleted: 'आपने सभी अभ्यास अभ्यास पूर्ण कर लिए हैं।',
    overviewTitle: 'अभ्यास अवलोकन',
    exerciseNumber: 'अभ्यास',
    status: 'स्थिति',
    skipped: 'छोड़ा गया',
    statusCorrect: 'सही',
    statusIncorrect: 'गलत',
    notAttempted: 'प्रयास नहीं किया',
    score: 'स्कोर',
    restartPractice: 'अभ्यास पुनः प्रारंभ करें',
    question: 'प्रश्न',
    // Real World Applications for Angles
    clockWatch: 'रेलवे पटरियां',
    clockWatchDesc: 'रेलवे पटरियां समानांतर रेखाएं हैं जो कभी नहीं मिलतीं। जब कोई क्रॉसिंग (ट्रांसवर्सल) पटरियों को काटती है, तो यह समतुल्य कोण बनाती है जो समान होते हैं, सुरक्षित ट्रैक डिजाइन सुनिश्चित करते हैं।',
    construction: 'सड़क ग्रिड',
    constructionDesc: 'शहर की सड़कें एक ग्रिड बनाती हैं जहां सड़कें समानांतर मार्गों को काटती हुई ट्रांसवर्सल के रूप में कार्य करती हैं। यह पर्यायी आंतरिक कोण बनाता है जो शहरी योजना और नेविगेशन में मदद करते हैं।',
    doorWindow: 'रेलवे क्रॉसिंग',
    doorWindowDesc: 'रेलवे क्रॉसिंग एक ट्रांसवर्सल (क्रॉसिंग रोड) को समानांतर रेलवे पटरियों को काटते हुए दिखाता है। बने कोण इंजीनियरों को सुरक्षित और कुशल क्रॉसिंग पॉइंट डिजाइन करने में मदद करते हैं।',
    angleNavigation: 'पुल समर्थन बीम',
    angleNavigationDesc: 'पुल संरचनाएं ट्रांसवर्सल समर्थन सदस्यों के साथ समानांतर बीम का उपयोग करती हैं। बने कोण (समतुल्य, पर्यायी आंतरिक) संरचनात्मक स्थिरता और भार वितरण सुनिश्चित करते हैं।',
    roadsBridges: 'खिड़की के पैन',
    roadsBridgesDesc: 'खिड़की के पैन में क्षैतिज और ऊर्ध्वाधर बार (समानांतर रेखाएं) विकर्ण समर्थन (ट्रांसवर्सल) के साथ होते हैं। यह विभिन्न कोण जोड़े बनाता है जो खिड़की की संरचना को मजबूत करते हैं।',
    angleArchitecture: 'सीढ़ी डिजाइन',
    angleArchitectureDesc: 'सीढ़ियों में समानांतर डंडे होते हैं जो ट्रांसवर्सल साइड रेल से जुड़े होते हैं। डंडों और रेल के बीच बने कोण ज्यामितीय सिद्धांतों का पालन करते हैं जो स्थिरता और सुरक्षा सुनिश्चित करते हैं।',
    furniture: 'फर्नीचर डिजाइन',
    furnitureDesc: 'फर्नीचर निर्माता सपाट सतहों के लिए संपूरक कोणों का उपयोग करते हैं। मेजें, शेल्फ और कैबिनेट में स्थिरता और उचित संरेखण सुनिश्चित करने के लिए सीधे किनारे (180°) होते हैं।',
    geometry: 'ज्यामिति और सर्वेक्षण',
    geometryDesc: 'सर्वेक्षक भूमि मापने, क्षेत्र मैप करने और कोण संबंधों का उपयोग करके सटीक संपत्ति सीमाओं को सुनिश्चित करने के लिए पूरक और संपूरक कोणों का उपयोग करते हैं।'
  },
  gu: {
    correct: 'સાચું!',
    incorrect: 'ફરી કોશિશ કરો!',
    next: 'આગળ',
    previous: 'પાછળ',
    submit: 'જમા કરો',
    hint: 'સંકેત',
    learning: 'શીખો',
    practice: 'અભ્યાસ',
    selectLanguage: 'ભાષા પસંદ કરો',
    chapterTitle: 'રેખાઓના જોડી',
    topicTitle: 'રેખાઓના જોડી',
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
    // Angles content
    relatedAngles: 'સંબંધિત કોણ',
    anglesIntroduction: 'રેખાઓ અને કોણ',
    complementaryAngles: 'પૂરક કોણ',
    supplementaryAngles: 'સંપૂરક કોણ',
    angleDefinition: 'વ્યાખ્યા: કોણ',
    angleDefinitionText: 'કોણ બનાવાય છે જ્યારે રેખાઓ અથવા રેખા સેગમેન્ટ મળે છે. બે રેખાઓ અથવા રેખા સેગમેન્ટ સંપર્ક બિંદુ પર એકબીજાને છેદે છે ત્યારે કોણ બનાવે છે।',
    keyPoints: 'મુખ્ય મુદ્દાઓ',
    typesOfAngles: 'કોણના પ્રકારો',
    acuteAngle: 'તીવ્ર: 90° કરતા ઓછું',
    rightAngle: 'સમ કોણ: બરાબર 90°',
    obtuseAngle: 'સ્થૂળ: 90° કરતા વધારે',
    angleMeasurement: 'કોણ ડિગ્રી (°) માં માપવામાં આવે છે',
    angleFormation: 'કોણ છેદક બિંદુ પર બને છે',
    angleSymbol: 'ચિહ્ન: ∠ABC એ એન્ગલ ABC નું પ્રતિનિધિત્વ કરે છે',
    sum90: 'સરવાળો = 90° | સમ કોણ બનાવે છે',
    sum180: 'સરવાળો = 180° | સીધી રેખા બનાવે છે',
    formsStraightLine: 'સીધી રેખા બનાવે છે',
    examples: 'ઉદાહરણો',
    adjustAngle: 'કોણ 1 સમાયોજિત કરો',
    animateAngles: 'કોણોને ઍનીમેટ કરો',
    interactiveDiagram: 'ઇન્ટરેક્ટિવ આકૃતિ',
    quickSummary: 'ઝડપી સારાંશ',
    skip: 'છોડી દો',
    overview: 'સારાંશ',
    completed: 'પૂર્ણ',
    questionNumber: 'પ્રશ્ન',
    totalQuestions: 'કુલ પ્રશ્નો',
    backToPractice: 'અભ્યાસ પર પાછા જાઓ',
    practiceComplete: 'અભ્યાસ પૂર્ણ!',
    congratulations: 'અભિનંદન!',
    youHaveCompleted: 'તમે બધા અભ્યાસ કસરતો પૂર્ણ કરી લીધી છે.',
    overviewTitle: 'અભ્યાસ સારાંશ',
    exerciseNumber: 'કસરત',
    status: 'સ્થિતિ',
    skipped: 'છોડી દીધી',
    statusCorrect: 'સાચું',
    statusIncorrect: 'ખોટું',
    notAttempted: 'પ્રયાસ નથી કર્યો',
    score: 'સ્કોર',
    restartPractice: 'અભ્યાસ ફરી શરૂ કરો',
    question: 'પ્રશ્ન',
    // Real World Applications for Angles
    clockWatch: 'રેલ્વે પાટા',
    clockWatchDesc: 'રેલ્વે પાટા સમાંતર રેખાઓ છે જે ક્યારેય મળતી નથી. જ્યારે કોઈ ક્રોસિંગ (ટ્રાન્સવર્સલ) પાટાને કાપે છે, ત્યારે તે સંગત કોણ બનાવે છે જે સમાન હોય છે, સુરક્ષિત ટ્રેક ડિઝાઇનની ખાતરી કરે છે.',
    construction: 'રસ્તા ગ્રિડ',
    constructionDesc: 'શહેરના રસ્તાઓ ગ્રિડ બનાવે છે જ્યાં રસ્તાઓ સમાંતર માર્ગોને કાપતા ટ્રાન્સવર્સલ તરીકે કાર્ય કરે છે. આ પર્યાયી આંતરિક કોણ બનાવે છે જે શહેરી આયોજન અને નેવિગેશનમાં મદદ કરે છે.',
    doorWindow: 'રેલ્વે ક્રોસિંગ',
    doorWindowDesc: 'રેલ્વે ક્રોસિંગ એક ટ્રાન્સવર્સલ (ક્રોસિંગ રોડ)ને સમાંતર રેલ્વે પાટાને કાપતા બતાવે છે. બનેલા કોણ એન્જિનિયરોને સુરક્ષિત અને કાર્યક્ષમ ક્રોસિંગ પોઇન્ટ ડિઝાઇન કરવામાં મદદ કરે છે.',
    angleNavigation: 'પુલ સપોર્ટ બીમ',
    angleNavigationDesc: 'પુલની રચનાઓ ટ્રાન્સવર્સલ સપોર્ટ સભ્યો સાથે સમાંતર બીમનો ઉપયોગ કરે છે. બનેલા કોણ (સંગત, પર્યાયી આંતરિક) માળખાકીય સ્થિરતા અને ભાર વિતરણની ખાતરી કરે છે.',
    roadsBridges: 'વિન્ડો પેન',
    roadsBridgesDesc: 'વિન્ડો પેનમાં આડી અને ઊભી બાર (સમાંતર રેખાઓ) વિકર્ણ સપોર્ટ (ટ્રાન્સવર્સલ) સાથે હોય છે. આ વિવિધ કોણ જોડી બનાવે છે જે વિન્ડોની રચનાને મજબૂત કરે છે.',
    angleArchitecture: 'સીડી ડિઝાઇન',
    angleArchitectureDesc: 'સીડીમાં સમાંતર પગથિયાં હોય છે જે ટ્રાન્સવર્સલ સાઇડ રેલથી જોડાયેલા હોય છે. પગથિયાં અને રેલ વચ્ચે બનેલા કોણ ભૌમિતિક સિદ્ધાંતોનું પાલન કરે છે જે સ્થિરતા અને સુરક્ષાની ખાતરી કરે છે.',
    furniture: 'ફર્નિચર ડિઝાઇન',
    furnitureDesc: 'ફર્નિચર બનાવનાર સપાટ સપાટીઓ માટે સંપૂરક કોણોનો ઉપયોગ કરે છે। ટેબલ, શેલ્ફ અને કેબિનેટમાં સ્થિરતા અને યોગ્ય સંરેખણની ખાતરી કરવા માટે સીધા કિનારાઓ (180°) હોય છે।',
    geometry: 'જ્યામિતિ અને સર્વેક્ષણ',
    geometryDesc: 'સર્વેયર્સ જમીન માપવા, પ્રદેશોનો નકશો બનાવવા અને કોણ સંબંધોનો ઉપયોગ કરીને સચોટ મિલકત સીમાઓની ખાતરી કરવા માટે પૂરક અને સંપૂરક કોણોનો ઉપયોગ કરે છે।'
  }
};

// LinesAndAnglesTutorial component types and constants
type AnglePair =
  | 'corresponding'
  | 'alternateInterior'
  | 'consecutiveInterior'
  | 'alternateExterior'
  | 'interior'
  | 'exterior';
type ViewState = 'intersecting' | AnglePair;

// LinesAndAnglesTutorial translations
const linesAndAnglesTranslations: Record<'en' | 'hi' | 'gu', any> = {
  en: {
    title: '5.3: Pairs of Lines & Transversals',
    subtitle: 'A **transversal** is a line that intersects two or more lines at distinct points.',
    makeParallel: 'Make Lines Parallel',
    makeNonParallel: 'Make Lines Non-Parallel',
    interior: 'Interior',
    exterior: 'Exterior',
    corresponding: 'Corresponding',
    alternateInterior: 'Alternate Interior',
    consecutiveInterior: 'Same Side Interior',
    alternateExterior: 'Alternate Exterior',
    explanations: {
      intersecting: {
        title: 'Intersecting Lines',
        description: 'Two lines are intersecting if they have one point in common. This common point is their point of intersection.',
      },
      interior: {
        title: 'Interior Angles',
        description: 'These are the angles that lie "between" the two main lines. (Angles 3, 4, 5, 6)',
      },
      exterior: {
        title: 'Exterior Angles',
        description: 'These are the angles that lie "outside" the two main lines. (Angles 1, 2, 7, 8)',
      },
      corresponding: {
        title: 'Corresponding Angles',
        description: 'Pairs: (1, 5), (2, 6), (3, 7), (4, 8). When lines are parallel, these angles are EQUAL.',
      },
      alternateInterior: {
        title: 'Alternate Interior Angles',
        description: 'Pairs: (3, 6), (4, 5). They are on opposite sides of the transversal and between the lines. When lines are parallel, these angles are EQUAL.',
      },
      consecutiveInterior: {
        title: 'Interior Angles on the Same Side',
        description: 'Pairs: (3, 5), (4, 6). When lines are parallel, these angles are SUPPLEMENTARY (add up to 180°).',
      },
      alternateExterior: {
        title: 'Alternate Exterior Angles',
        description: 'Pairs: (1, 8), (2, 7). They are on opposite sides of the transversal and outside the lines. When lines are parallel, these angles are EQUAL.',
      },
    },
  },
  hi: {
    title: '5.3: रेखाओं के युग्म और ट्रांसवर्सल',
    subtitle: 'एक **ट्रांसवर्सल** वह रेखा है जो दो या अधिक रेखाओं को अलग-अलग बिंदुओं पर काटती है।',
    makeParallel: 'रेखाओं को समांतर बनाएं',
    makeNonParallel: 'रेखाओं को गैर-समांतर बनाएं',
    interior: 'आंतरिक',
    exterior: 'बाह्य',
    corresponding: 'समतुल्य',
    alternateInterior: 'पर्यायी आंतरिक',
    consecutiveInterior: 'समान पक्ष आंतरिक',
    alternateExterior: 'पर्यायी बाह्य',
    explanations: {
      intersecting: {
        title: 'प्रतिच्छेदित रेखाएं',
        description: 'दो रेखाएं प्रतिच्छेदित होती हैं यदि उनका एक बिंदु समान हो। यह समान बिंदु उनका प्रतिच्छेदन बिंदु है।',
      },
      interior: {
        title: 'आंतरिक कोण',
        description: 'ये वे कोण हैं जो दो मुख्य रेखाओं के "बीच" स्थित हैं। (कोण 3, 4, 5, 6)',
      },
      exterior: {
        title: 'बाह्य कोण',
        description: 'ये वे कोण हैं जो दो मुख्य रेखाओं के "बाहर" स्थित हैं। (कोण 1, 2, 7, 8)',
      },
      corresponding: {
        title: 'समतुल्य कोण',
        description: 'जोड़े: (1, 5), (2, 6), (3, 7), (4, 8)। जब रेखाएं समांतर होती हैं, तो ये कोण समान होते हैं।',
      },
      alternateInterior: {
        title: 'पर्यायी आंतरिक कोण',
        description: 'जोड़े: (3, 6), (4, 5)। वे ट्रांसवर्सल के विपरीत पक्षों पर और रेखाओं के बीच स्थित हैं। जब रेखाएं समांतर होती हैं, तो ये कोण समान होते हैं।',
      },
      consecutiveInterior: {
        title: 'समान पक्ष के आंतरिक कोण',
        description: 'जोड़े: (3, 5), (4, 6)। जब रेखाएं समांतर होती हैं, तो ये कोण संपूरक होते हैं (180° तक जुड़ते हैं)।',
      },
      alternateExterior: {
        title: 'पर्यायी बाह्य कोण',
        description: 'जोड़े: (1, 8), (2, 7)। वे ट्रांसवर्सल के विपरीत पक्षों पर और रेखाओं के बाहर स्थित हैं। जब रेखाएं समांतर होती हैं, तो ये कोण समान होते हैं।',
      },
    },
  },
  gu: {
    title: '5.3: રેખાઓના જોડી અને ટ્રાન્સવર્સલ',
    subtitle: 'એક **ટ્રાન્સવર્સલ** રેખા છે જે બે અથવા વધુ રેખાઓને અલગ બિંદુઓ પર છેદે છે.',
    makeParallel: 'રેખાઓને સમાંતર બનાવો',
    makeNonParallel: 'રેખાઓને અસમાંતર બનાવો',
    interior: 'આંતરિક',
    exterior: 'બાહ્ય',
    corresponding: 'સંગત',
    alternateInterior: 'પર્યાયી આંતરિક',
    consecutiveInterior: 'સમાન બાજુ આંતરિક',
    alternateExterior: 'પર્યાયી બાહ્ય',
    explanations: {
      intersecting: {
        title: 'છેદક રેખાઓ',
        description: 'બે રેખાઓ છેદક હોય છે જો તેમનો એક બિંદુ સામાન્ય હોય. આ સામાન્ય બિંદુ તેમનો છેદ બિંદુ છે.',
      },
      interior: {
        title: 'આંતરિક કોણ',
        description: 'આ કોણ છે જે બે મુખ્ય રેખાઓના "બીच" આવેલા છે. (કોણ 3, 4, 5, 6)',
      },
      exterior: {
        title: 'બાહ્ય કોણ',
        description: 'આ કોણ છે જે બે મુખ્ય રેખાઓના "બહાર" આવેલા છે. (કોણ 1, 2, 7, 8)',
      },
      corresponding: {
        title: 'સંગત કોણ',
        description: 'જોડી: (1, 5), (2, 6), (3, 7), (4, 8). જ્યારે રેખાઓ સમાંતર હોય છે, ત્યારે આ કોણ સમાન હોય છે.',
      },
      alternateInterior: {
        title: 'પર્યાયી આંતરિક કોણ',
        description: 'જોડી: (3, 6), (4, 5). તે ટ્રાન્સવર્સલની વિપરીત બાજુઓ પર અને રેખાઓ વચ્ચે આવેલા છે. જ્યારે રેખાઓ સમાંતર હોય છે, ત્યારે આ કોણ સમાન હોય છે.',
      },
      consecutiveInterior: {
        title: 'સમાન બાજુના આંતરિક કોણ',
        description: 'જોડી: (3, 5), (4, 6). જ્યારે રેખાઓ સમાંતર હોય છે, ત્યારે આ કોણ સંપૂરક હોય છે (180° સુધી ઉમેરે છે).',
      },
      alternateExterior: {
        title: 'પર્યાયી બાહ્ય કોણ',
        description: 'જોડી: (1, 8), (2, 7). તે ટ્રાન્સવર્સલની વિપરીત બાજુઓ પર અને રેખાઓની બહાર આવેલા છે. જ્યારે રેખાઓ સમાંતર હોય છે, ત્યારે આ કોણ સમાન હોય છે.',
      },
    },
  },
};

// Embedded CSS for LinesAndAnglesTutorial
const linesAndAnglesCssStyles = `
  .geo-container {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    width: 100%;
    max-width: 700px;
    margin: 0 auto;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    background: #ffffff;
    overflow: hidden;
  }
  .geo-header {
    padding: 1.5rem;
    background: #f9f9f9;
    border-bottom: 1px solid #ddd;
  }
  .geo-header h2 {
    margin: 0 0 0.5rem 0;
    color: #333;
  }
  .geo-header p {
    margin: 0;
    font-size: 0.95rem;
    color: #555;
  }
  .geo-svg {
    width: 100%;
    height: auto;
    background: #fafcff;
  }
  .line {
    stroke: #555;
    stroke-width: 2;
  }
  .transversal {
    stroke: #007bff;
    stroke-width: 2.5;
  }
  .line-label {
    font-family: 'Times New Roman', serif;
    font-style: italic;
    font-size: 1.25rem;
    fill: #333;
  }
  .angle-label {
    font-size: 1rem;
    font-weight: bold;
    fill: #111;
    -webkit-user-select: none;
    user-select: none;
  }
  .geo-controls {
    padding: 1.5rem;
    border-top: 1px solid #eee;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: #fdfdfd;
  }
  .toggle-parallel {
    padding: 0.75rem 1rem;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    background-color: #28a745;
    color: white;
    cursor: pointer;
    transition: background-color 0.2s ease, box-shadow 0.2s ease;
  }
  .toggle-parallel:hover {
    background-color: #218838;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  .button-group {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .button-group button {
    flex-grow: 1;
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
    border: 1px solid #007bff;
    background: #fff;
    color: #007bff;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease;
  }
  .button-group button:hover {
    background: #e6f2ff;
  }
  .geo-explanation {
    padding: 1.5rem;
    background: #fdfdfd;
    border-top: 1px dashed #ddd;
    min-height: 100px;
  }
  .geo-explanation h3 {
    margin-top: 0;
    color: #007bff;
  }
  .geo-explanation p {
    margin-bottom: 0;
    line-height: 1.6;
  }
`;

// Helper to define which angles to highlight for each pair
const angleGroups: Record<AnglePair, number[]> = {
  interior: [3, 4, 5, 6],
  exterior: [1, 2, 7, 8],
  corresponding: [1, 5, 2, 6, 3, 7, 4, 8],
  alternateInterior: [3, 6, 4, 5],
  consecutiveInterior: [3, 5, 4, 6],
  alternateExterior: [1, 8, 2, 7],
};

// Helper to assign colors to paired angles
const getAngleColor = (angle: number, view: AnglePair): string => {
  const groups = angleGroups[view];
  if (!groups.includes(angle)) return 'transparent';

  switch (view) {
    case 'interior':
      return 'rgba(255, 165, 0, 0.7)'; // Orange
    case 'exterior':
      return 'rgba(0, 191, 255, 0.7)'; // Deep Sky Blue
    case 'corresponding':
      if ([1, 5].includes(angle)) return 'rgba(255, 99, 71, 0.7)'; // Tomato
      if ([2, 6].includes(angle)) return 'rgba(60, 179, 113, 0.7)'; // Medium Sea Green
      if ([3, 7].includes(angle)) return 'rgba(238, 130, 238, 0.7)'; // Violet
      if ([4, 8].includes(angle)) return 'rgba(106, 90, 205, 0.7)'; // Slate Blue
      break;
    case 'alternateInterior':
      if ([3, 6].includes(angle)) return 'rgba(255, 99, 71, 0.7)'; // Tomato
      if ([4, 5].includes(angle)) return 'rgba(60, 179, 113, 0.7)'; // Medium Sea Green
      break;
    case 'consecutiveInterior':
      if ([3, 5].includes(angle)) return 'rgba(255, 99, 71, 0.7)'; // Tomato
      if ([4, 6].includes(angle)) return 'rgba(60, 179, 113, 0.7)'; // Medium Sea Green
      break;
    case 'alternateExterior':
      if ([1, 8].includes(angle)) return 'rgba(255, 99, 71, 0.7)'; // Tomato
      if ([2, 7].includes(angle)) return 'rgba(60, 179, 113, 0.7)'; // Medium Sea Green
      break;
  }
  return 'transparent';
};

// Angle Label Component
const AngleLabel: React.FC<{
  n: number;
  x: number;
  y: number;
  view: ViewState;
  animate?: 'parallel' | 'nonParallel';
}> = ({ n, x, y, view, animate }) => {
  // Calculate positions for parallel vs non-parallel
  const getYPosition = (parallel: boolean) => {
    if (!parallel) return y;
    
    // For angles 5-8 (bottom intersection), adjust for parallel position
    // Line m is at y=250 when parallel, so angles need to be positioned accordingly
    if (n === 5) return 230; // Above line m when parallel (y=250)
    if (n === 6) return 230;
    if (n === 7) return 270; // Below line m when parallel
    if (n === 8) return 270;
    return y;
  };

  const getXPosition = (parallel: boolean) => {
    if (!parallel) return x;
    
    // Adjust x position for better positioning when parallel
    if (n === 5 || n === 7) return 200;
    if (n === 6 || n === 8) return 245;
    return x;
  };

  const parallelY = getYPosition(true);
  const parallelX = getXPosition(true);

  const variants = {
    nonParallel: { y, x },
    parallel: { y: parallelY, x: parallelX },
  };

  const isHighlighted =
    view !== 'intersecting' && angleGroups[view as AnglePair].includes(n);
  const color = view !== 'intersecting' ? getAngleColor(n, view as AnglePair) : 'transparent';

  return (
    <motion.g
      variants={animate ? variants : undefined}
      animate={animate}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
    >
      <motion.circle
        cx={animate === 'parallel' ? parallelX + 7 : x + 7}
        cy={animate === 'parallel' ? parallelY - 5 : y - 5}
        r={12}
        fill={color}
        initial={{ scale: 0 }}
        animate={{ scale: isHighlighted ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      />
      <motion.text
        x={animate === 'parallel' ? parallelX : x}
        y={animate === 'parallel' ? parallelY : y}
        className="angle-label"
      >
        {n}
      </motion.text>
    </motion.g>
  );
};

// LinesAndAnglesTutorial Component
const LinesAndAnglesTutorial: React.FC<{ language: 'en' | 'hi' | 'gu' }> = ({ language }) => {
  const t = linesAndAnglesTranslations[language];
  const [isParallel, setIsParallel] = useState(false);
  const [view, setView] = useState<ViewState>('intersecting');
  
  // Sequential animation states
  const [showDiagram, setShowDiagram] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // Animate line coordinates for proper parallel lines
  const line2Y1 = isParallel ? 250 : 200;
  const line2Y2 = isParallel ? 250 : 150;
  const textY = isParallel ? 245 : 195;

  const textVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  // Sequential animation on mount
  useEffect(() => {
    const timer1 = setTimeout(() => setShowDiagram(true), 100);
    const timer2 = setTimeout(() => setShowControls(true), 800);
    const timer3 = setTimeout(() => setShowExplanation(true), 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <>
      <style>{linesAndAnglesCssStyles}</style>
      
      <div className="geo-container">

        {/* SVG Canvas for visualization */}
        <motion.svg
          viewBox="0 0 400 300"
          className="geo-svg"
          aria-label="Geometric lines and angles"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ 
            opacity: showDiagram ? 1 : 0, 
            scale: showDiagram ? 1 : 0.9 
          }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          {/* Line 1 (l) */}
          <line x1="0" y1="100" x2="400" y2="100" className="line" />
          <text x="10" y="95" className="line-label">
            l
          </text>

          {/* Line 2 (m) - Animated */}
          <motion.line
            x1="0"
            x2="400"
            y1={line2Y1}
            y2={line2Y2}
            className="line"
            animate={{
              y1: line2Y1,
              y2: line2Y2,
            }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          />
          <motion.text
            x="10"
            y={textY}
            className="line-label"
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          >
            m
          </motion.text>

          {/* Transversal (p) */}
          <line x1="100" y1="0" x2="300" y2="300" className="line transversal" />
          <text x="85" y="20" className="line-label">
            p
          </text>

          {/* Intersection 1 (Top) */}
          <AngleLabel
            n={1}
            x={125}
            y={80}
            view={view}
          />
          <AngleLabel
            n={2}
            x={190}
            y={80}
            view={view}
          />
          <AngleLabel
            n={3}
            x={145}
            y={120}
            view={view}
          />
          <AngleLabel
            n={4}
            x={190}
            y={120}
            view={view}
          />

          {/* Intersection 2 (Bottom) - Animated */}
          {/* When non-parallel, intersection is around (220, 167) on line m */}
          <AngleLabel
            n={5}
            x={205}
            y={147}
            view={view}
            animate={isParallel ? 'parallel' : 'nonParallel'}
          />
          <AngleLabel
            n={6}
            x={250}
            y={147}
            view={view}
            animate={isParallel ? 'parallel' : 'nonParallel'}
          />
          <AngleLabel
            n={7}
            x={205}
            y={187}
            view={view}
            animate={isParallel ? 'parallel' : 'nonParallel'}
          />
          <AngleLabel
            n={8}
            x={250}
            y={187}
            view={view}
            animate={isParallel ? 'parallel' : 'nonParallel'}
          />
        </motion.svg>

        {/* Controls */}
        <motion.div 
          className="geo-controls"
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: showControls ? 1 : 0, 
            y: showControls ? 0 : 20 
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <button
            onClick={() => setIsParallel(!isParallel)}
            className="toggle-parallel"
          >
            {isParallel ? t.makeNonParallel : t.makeParallel}
          </button>
          <div className="button-group">
            <button onClick={() => setView('interior')}>{t.interior}</button>
            <button onClick={() => setView('exterior')}>{t.exterior}</button>
            <button onClick={() => setView('corresponding')}>{t.corresponding}</button>
            <button onClick={() => setView('alternateInterior')}>
              {t.alternateInterior}
            </button>
            <button onClick={() => setView('consecutiveInterior')}>
              {t.consecutiveInterior}
            </button>
            <button onClick={() => setView('alternateExterior')}>
              {t.alternateExterior}
            </button>
          </div>
        </motion.div>

        {/* Explanation Box */}
        <motion.div 
          className="geo-explanation"
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: showExplanation ? 1 : 0, 
            y: showExplanation ? 0 : 20 
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.3 }}
            >
              <h3>{t.explanations[view].title}</h3>
              <p>{t.explanations[view].description}</p>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
};

// Practice exercises with visual shapes data
// All questions based on Topic 5.3: Pairs of Lines (matching Learn mode)
const practiceExercises: PracticeExercise[] = [
  // Intersecting Lines Questions
  {
    id: 'ex1',
    type: 'identification',
    difficulty: 'beginner',
    question: 'What do we call the point where two intersecting lines meet?',
    data: { 
        shapes: ['Transversal point', 'Intersection point', 'Parallel point', 'Angle point'],
      visualShapes: ['Circle', 'Circle', 'Circle', 'Circle']
    },
    correctAnswer: 'Intersection point',
    hint: 'When two lines intersect, they meet at a common point called the intersection point.',
    translations: {
      gu: {
        question: 'બે છેદક રેખાઓ જ્યાં મળે છે તે બિંદુને શું કહેવાય છે?',
        hint: 'બે રેખાઓ જ્યારે છેદે છે, ત્યારે તે એક સામાન્ય બિંદુ પર મળે છે જેને છેદક બિંદુ કહેવાય છે.'
      },
      hi: {
        question: 'दो प्रतिच्छेदित रेखाएं जहां मिलती हैं, उस बिंदु को क्या कहते हैं?',
        hint: 'जब दो रेखाएं प्रतिच्छेदित होती हैं, तो वे एक समान बिंदु पर मिलती हैं जिसे प्रतिच्छेदन बिंदु कहते हैं।'
      }
    }
  },
  // Transversal Questions
  {
    id: 'ex2',
    type: 'identification',
    difficulty: 'beginner',
    question: 'A line that intersects two or more lines at distinct points is called?',
    data: { 
      shapes: ['Parallel line', 'Perpendicular line', 'Transversal', 'Intersecting line'],
      visualShapes: ['Circle', 'Circle', 'Circle', 'Circle']
    },
    correctAnswer: 'Transversal',
    hint: 'A transversal is a line that intersects two or more lines at distinct points.',
    translations: {
      gu: {
        question: 'એક રેખા જે બે અથવા વધુ રેખાઓને અલગ બિંદુઓ પર છેદે છે તેને શું કહેવાય છે?',
        hint: 'ટ્રાન્સવર્સલ એ રેખા છે જે બે અથવા વધુ રેખાઓને અલગ બિંદુઓ પર છેદે છે.'
      },
      hi: {
        question: 'एक रेखा जो दो या अधिक रेखाओं को अलग-अलग बिंदुओं पर काटती है, उसे क्या कहते हैं?',
        hint: 'एक ट्रांसवर्सल वह रेखा है जो दो या अधिक रेखाओं को अलग-अलग बिंदुओं पर काटती है।'
      }
    }
  },
  // Angle Type Questions
  {
    id: 'ex3',
    type: 'identification',
    difficulty: 'beginner',
    question: 'Which angles are on the same side of the transversal, one interior and one exterior?',
    data: { 
      shapes: ['Alternate interior angles', 'Alternate exterior angles', 'Interior same side angles', 'Corresponding angles'],
      visualShapes: ['Circle', 'Circle', 'Circle', 'Circle']
    },
    correctAnswer: 'Corresponding angles',
    hint: 'Corresponding angles are on the same side of the transversal, one interior and one exterior. Examples: ∠1 and ∠5, ∠2 and ∠6.',
    translations: {
      gu: {
        question: 'કયા કોણો ટ્રાન્સવર્સલની એક જ બાજુએ હોય છે, એક આંતરિક અને એક બાહ્ય?',
        hint: 'સંગત કોણો ટ્રાન્સવર્સલની એક જ બાજુએ હોય છે, એક આંતરિક અને એક બાહ્ય. ઉદાહરણ: ∠1 અને ∠5, ∠2 અને ∠6.'
      },
      hi: {
        question: 'कौन से कोण ट्रांसवर्सल के एक ही पक्ष पर होते हैं, एक आंतरिक और एक बाहरी?',
        hint: 'समतुल्य कोण ट्रांसवर्सल के एक ही पक्ष पर होते हैं, एक आंतरिक और एक बाहरी। उदाहरण: ∠1 और ∠5, ∠2 और ∠6।'
      }
    }
  },
  {
    id: 'ex4',
    type: 'identification',
    difficulty: 'beginner',
    question: 'Which angles are on opposite sides of the transversal, both interior?',
    data: { 
      shapes: ['Corresponding angles', 'Alternate interior angles', 'Alternate exterior angles', 'Exterior same side angles'],
      visualShapes: ['Circle', 'Circle', 'Circle', 'Circle']
    },
    correctAnswer: 'Alternate interior angles',
    hint: 'Alternate interior angles are on opposite sides of the transversal, both interior. Examples: ∠3 and ∠6, ∠4 and ∠5.',
    translations: {
      gu: {
        question: 'કયા કોણો ટ્રાન્સવર્સલની વિપરીત બાજુઓ પર હોય છે, બંને આંતરિક?',
        hint: 'પર્યાયી આંતરિક કોણો ટ્રાન્સવર્સલની વિપરીત બાજુઓ પર હોય છે, બંને આંતરિક. ઉદાહરણ: ∠3 અને ∠6, ∠4 અને ∠5.'
      },
      hi: {
        question: 'कौन से कोण ट्रांसवर्सल के विपरीत पक्षों पर होते हैं, दोनों आंतरिक?',
        hint: 'पर्यायी अंतःकोण ट्रांसवर्सल के विपरीत पक्षों पर होते हैं, दोनों आंतरिक। उदाहरण: ∠3 और ∠6, ∠4 और ∠5।'
      }
    }
  },
  {
    id: 'ex5',
    type: 'identification',
    difficulty: 'beginner',
    question: 'Which angles are on opposite sides of the transversal, both exterior?',
    data: { 
      shapes: ['Corresponding angles', 'Alternate interior angles', 'Exterior same side angles', 'Alternate exterior angles'],
      visualShapes: ['Circle', 'Circle', 'Circle', 'Circle']
    },
    correctAnswer: 'Alternate exterior angles',
    hint: 'Alternate exterior angles are on opposite sides of the transversal, both exterior. Examples: ∠1 and ∠8, ∠2 and ∠7.',
    translations: {
      gu: {
        question: 'કયા કોણો ટ્રાન્સવર્સલની વિપરીત બાજુઓ પર હોય છે, બંને બાહ્ય?',
        hint: 'પર્યાયી બાહ્ય કોણો ટ્રાન્સવર્સલની વિપરીત બાજુઓ પર હોય છે, બંને બાહ્ય. ઉદાહરણ: ∠1 અને ∠8, ∠2 અને ∠7.'
      },
      hi: {
        question: 'कौन से कोण ट्रांसवर्सल के विपरीत पक्षों पर होते हैं, दोनों बाह्य?',
        hint: 'पर्यायी बाह्य कोण ट्रांसवर्सल के विपरीत पक्षों पर होते हैं, दोनों बाह्य। उदाहरण: ∠1 और ∠8, ∠2 और ∠7।'
      }
    }
  },
  {
    id: 'ex6',
    type: 'identification',
    difficulty: 'beginner',
    question: 'Which angles are on the same side of the transversal, both interior, and their sum is 180°?',
    data: { 
      shapes: ['Corresponding angles', 'Alternate interior angles', 'Interior same side angles', 'Alternate exterior angles'],
      visualShapes: ['Circle', 'Circle', 'Circle', 'Circle']
    },
    correctAnswer: 'Interior same side angles',
    hint: 'Interior angles on the same side of the transversal are supplementary (sum = 180°). Examples: ∠3 and ∠5, ∠4 and ∠6.',
    translations: {
      gu: {
        question: 'કયા કોણો ટ્રાન્સવર્સલની એક જ બાજુએ હોય છે, બંને આંતરિક, અને તેમનો સરવાળો 180° છે?',
        hint: 'ટ્રાન્સવર્સલની એક જ બાજુના આંતરિક કોણો સંપૂરક છે (સરવાળો = 180°). ઉદાહરણ: ∠3 અને ∠5, ∠4 અને ∠6.'
      },
      hi: {
        question: 'कौन से कोण ट्रांसवर्सल के एक ही पक्ष पर होते हैं, दोनों आंतरिक, और उनका योग 180° है?',
        hint: 'ट्रांसवर्सल के एक ही पक्ष के आंतरिक कोण संपूरक होते हैं (योग = 180°)। उदाहरण: ∠3 और ∠5, ∠4 और ∠6।'
      }
    }
  },
  // Parallel Lines Questions
  {
    id: 'ex7',
    type: 'calculation',
    difficulty: 'beginner',
    question: 'If corresponding angle ∠1 = 65°, what is ∠5?',
    data: { visualShapes: ['ParallelLines'] },
    correctAnswer: 65,
    hint: 'In parallel lines cut by a transversal, corresponding angles are equal. So ∠1 = ∠5.',
    translations: {
      gu: {
        question: 'જો સમતુલ્ય કોણ ∠1 = 65° હોય, તો ∠5 કેટલો?',
        hint: 'સમાંતર રેખાઓમાં ટ્રાન્સવર્સલથી બનેલા સમતુલ્ય કોણો સમાન હોય છે. તેથી ∠1 = ∠5.'
      },
      hi: {
        question: 'यदि समतुल्य कोण ∠1 = 65° है, तो ∠5 कितना होगा?',
        hint: 'समांतर रेखाओं को ट्रांसवर्सल काटे तो समतुल्य कोण समान होते हैं। अतः ∠1 = ∠5.'
      }
    }
  },
  {
    id: 'ex8',
    type: 'calculation',
    difficulty: 'beginner',
    question: 'If alternate interior angle ∠3 = 72°, what is ∠6?',
    data: { visualShapes: ['ParallelLines'] },
    correctAnswer: 72,
    hint: 'Alternate interior angles are equal when the lines are parallel (cut by a transversal). So ∠3 = ∠6.',
    translations: {
      gu: {
        question: 'જો પર્યાયી આંતરિક કોણ ∠3 = 72° હોય, તો ∠6 કેટલો?',
        hint: 'સમાંતર રેખાઓમાં પર્યાયી આંતરિક કોણો સમાન હોય છે. તેથી ∠3 = ∠6.'
      },
      hi: {
        question: 'यदि पर्यायी अंतःकोण ∠3 = 72° है, तो ∠6 कितना होगा?',
        hint: 'समांतर रेखाओं के लिए पर्यायी अंतःकोण समान होते हैं। अतः ∠3 = ∠6.'
      }
    }
  },
  {
    id: 'ex9',
    type: 'calculation',
    difficulty: 'intermediate',
    question: 'If interior angles on the same side are ∠4 and ∠6 and ∠4 = 110°, find ∠6.',
    data: { visualShapes: ['ParallelLines'] },
    correctAnswer: 70,
    hint: 'Interior angles on the same side of a transversal are supplementary: ∠4 + ∠6 = 180°. So ∠6 = 180° - 110° = 70°.',
    translations: {
      gu: {
        question: 'એક જ બાજુના આંતરિક કોણો ∠4 અને ∠6 છે અને ∠4 = 110° હોય તો ∠6 શોધો.',
        hint: 'એક જ બાજુના આંતરિક કોણો સંપૂરક હોય છે: ∠4 + ∠6 = 180°. એટલે ∠6 = 180° - 110° = 70°.'
      },
      hi: {
        question: 'यदि समान पक्ष के अंतःकोण ∠4 और ∠6 हैं और ∠4 = 110° है, तो ∠6 ज्ञात करें।',
        hint: 'समान पक्ष के अंतःकोण संपूरक होते हैं: ∠4 + ∠6 = 180°. अतः ∠6 = 180° - 110° = 70°.'
      }
    }
  },
  {
    id: 'ex10',
    type: 'verification',
    difficulty: 'intermediate',
    question: 'Given ∠1 = ∠5, are lines l and m parallel? (Yes/No)',
    data: { visualShapes: ['ParallelLines'] },
    correctAnswer: 'Yes',
    hint: 'If a pair of corresponding angles are equal, the lines are parallel.',
    translations: {
      gu: {
        question: 'આપેલ છે ∠1 = ∠5, શું રેખાઓ l અને m સમાંતર છે? (Yes/No)',
        hint: 'સમતુલ્ય કોણો સમાન હોય તો રેખાઓ સમાંતર હોય છે.'
      },
      hi: {
        question: 'यदि ∠1 = ∠5 दिया है, तो क्या रेखाएं l और m समांतर हैं? (Yes/No)',
        hint: 'यदि समतुल्य कोण समान हों, तो रेखाएं समांतर होती हैं।'
      }
    }
  },
  {
    id: 'ex11',
    type: 'identification',
    difficulty: 'beginner',
    question: 'If ∠3 and ∠6 are equal, what is their relation? (Choose: corresponding/alternate interior/interior same side)',
    data: { visualShapes: ['ParallelLines'] },
    correctAnswer: 'alternate interior',
    hint: 'When a transversal cuts parallel lines, ∠3 and ∠6 form an alternate interior pair.',
    translations: {
      gu: {
        question: 'જો ∠3 અને ∠6 સમાન હોય, તો તેમનો સંબંધ શું? (પસંદ કરો: corresponding/alternate interior/interior same side)',
        hint: 'ટ્રાન્સવર્સલ સમાંતર રેખાઓને છેદે ત્યારે ∠3 અને ∠6 પર્યાયી આંતરિક બને છે.'
      },
      hi: {
        question: 'यदि ∠3 और ∠6 समान हों, तो उनका संबंध क्या है? (चुनें: corresponding/alternate interior/interior same side)',
        hint: 'ट्रांसवर्सल जब समांतर रेखाओं को काटता है तो ∠3 और ∠6 पर्यायी अंतःकोण होते हैं।'
      }
    }
  }
];

const Chapter5Tool: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<'demonstration' | 'practice' | 'realworld'>('demonstration');
  const [language, setLanguage] = useState<'en' | 'hi' | 'gu'>(() => {
    const savedLanguage = localStorage.getItem('ch5-language');
    return (savedLanguage as 'en' | 'hi' | 'gu') || 'en';
  });
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [studentAnswer, setStudentAnswer] = useState<string>('');
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [showOverview, setShowOverview] = useState(false);
  const [exerciseStatus, setExerciseStatus] = useState<Record<string, 'correct' | 'incorrect' | 'skipped' | 'notAttempted'>>({});
  const [selectedOption, setSelectedOption] = useState<string>('');

  const t = translations[language];

  // Handle language change and save to localStorage
  const handleLanguageChange = (newLanguage: 'en' | 'hi' | 'gu') => {
    setLanguage(newLanguage);
    localStorage.setItem('ch5-language', newLanguage);
  };


  // Reset selected option when exercise changes
  useEffect(() => {
    setSelectedOption('');
    setStudentAnswer('');
    setFeedback('');
    setShowHint(false);
  }, [currentExerciseIndex]);

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

    if (currentExercise.type === 'identification') {
      // Single selection - compare directly
      isCorrect = selectedOption.toLowerCase().trim() === String(currentExercise.correctAnswer).toLowerCase().trim();
    } else if (Array.isArray(currentExercise.correctAnswer)) {
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
      setExerciseStatus(prev => ({
        ...prev,
        [currentExercise.id]: 'correct'
      }));
      
      setTimeout(() => {
        if (currentExerciseIndex < practiceExercises.length - 1) {
          setCurrentExerciseIndex(prev => prev + 1);
        } else {
          // All exercises completed
          setShowOverview(true);
        }
        setStudentAnswer('');
        setFeedback('');
        setShowHint(false);
        setAttempts(0);
        setSelectedOption('');
      }, 1500);
    } else {
      setFeedback(t.incorrect);
      setAttempts(newAttempts);
      setExerciseStatus(prev => ({
        ...prev,
        [currentExercise.id]: 'incorrect'
      }));
    }
  };

  const handleSkip = () => {
    const currentExercise = practiceExercises[currentExerciseIndex];
    if (!currentExercise) return;

    setExerciseStatus(prev => ({
      ...prev,
      [currentExercise.id]: 'skipped'
    }));

    if (currentExerciseIndex < practiceExercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    } else {
      setShowOverview(true);
    }
    setStudentAnswer('');
    setFeedback('');
    setShowHint(false);
    setAttempts(0);
    setSelectedOption('');
  };


  const renderDemonstrationMode = () => (
    <div className="w-full">
      <LinesAndAnglesTutorial language={language} />
    </div>
  );

  const renderOverview = () => {
    const totalExercises = practiceExercises.length;
    const correctCount = Object.values(exerciseStatus).filter(s => s === 'correct').length;
    const incorrectCount = Object.values(exerciseStatus).filter(s => s === 'incorrect').length;
    const skippedCount = Object.values(exerciseStatus).filter(s => s === 'skipped').length;
    const score = totalExercises > 0 ? Math.round((correctCount / totalExercises) * 100) : 0;

    return (
      <div className="space-y-6">
        {/* Overview Header */}
        <div className="bg-gradient-to-br from-teal-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl p-8 text-white text-center">
          <Trophy className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-4xl font-bold mb-2">{t.congratulations}</h2>
          <p className="text-xl">{t.practiceComplete}</p>
          <p className="text-lg mt-2 opacity-90">{t.youHaveCompleted}</p>
        </div>

        {/* Score Summary */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-6 md:p-8">
          <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">{t.overviewTitle}</h3>
          
          {/* Score Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200 text-center">
              <div className="text-3xl font-bold text-green-600">{correctCount}</div>
              <div className="text-sm text-green-700 mt-2">{t.statusCorrect}</div>
            </div>
            <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200 text-center">
              <div className="text-3xl font-bold text-red-600">{incorrectCount}</div>
              <div className="text-sm text-red-700 mt-2">{t.statusIncorrect}</div>
            </div>
            <div className="bg-yellow-50 rounded-xl p-6 border-2 border-yellow-200 text-center">
              <div className="text-3xl font-bold text-yellow-600">{skippedCount}</div>
              <div className="text-sm text-yellow-700 mt-2">{t.skipped}</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 text-center">
              <div className="text-3xl font-bold text-blue-600">{score}%</div>
              <div className="text-sm text-blue-700 mt-2">{t.score}</div>
            </div>
          </div>

          {/* Exercise Details Table */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-teal-500 to-purple-500 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">{t.exerciseNumber}</th>
                  <th className="px-6 py-4 text-left">{t.question}</th>
                  <th className="px-6 py-4 text-center">{t.status}</th>
                </tr>
              </thead>
              <tbody>
                {practiceExercises.map((exercise, index) => {
                  const status = exerciseStatus[exercise.id] || 'notAttempted';
                  const statusColors = {
                    correct: 'bg-green-100 text-green-800 border-green-300',
                    incorrect: 'bg-red-100 text-red-800 border-red-300',
                    skipped: 'bg-yellow-100 text-yellow-800 border-yellow-300',
                    notAttempted: 'bg-gray-100 text-gray-600 border-gray-300'
                  };
                  const statusText = {
                    correct: t.statusCorrect,
                    incorrect: t.statusIncorrect,
                    skipped: t.skipped,
                    notAttempted: t.notAttempted
                  };
                  
                  return (
                    <tr key={exercise.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 font-semibold">{index + 1}</td>
                      <td className="px-6 py-4">
                        {getTranslatedText(exercise, 'question', language)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium border-2 ${statusColors[status]}`}>
                          {statusText[status]}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => {
                setShowOverview(false);
                setCurrentExerciseIndex(0);
                setExerciseStatus({});
                setStudentAnswer('');
                setFeedback('');
                setShowHint(false);
                setAttempts(0);
                setSelectedOption('');
              }}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-purple-500 text-white rounded-xl hover:from-teal-600 hover:to-purple-600 transition-all font-medium shadow-lg hover:scale-105 text-lg"
            >
              <RotateCcw className="w-5 h-5" />
              {t.restartPractice}
            </button>
            <button
              onClick={() => setCurrentMode('demonstration')}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all font-medium shadow-lg hover:scale-105 text-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              {t.backToPractice}
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
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 w-full">
          <div className="w-full">
            {/* Question */}
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 border-2 border-orange-200 max-w-4xl mx-auto w-full overflow-x-hidden">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <span className="text-3xl sm:text-4xl md:text-5xl">📖</span>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gradient-teal-purple">
                  {t.practiceExercises}
                </h3>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-orange-300">
                  <h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4 text-gray-800 flex items-center gap-2">
                    <span className="text-xl sm:text-2xl">📋</span>
                    {t.practiceExercises}
                  </h4>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4 break-words">
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
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-blue-300">
                  <h4 className="font-bold text-base sm:text-lg mb-2 sm:mb-3 text-gray-800 flex items-center gap-2">
                    <span className="text-xl sm:text-2xl">❓</span>
                    {t.yourAnswer}
                  </h4>
                  <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-md">
                    {currentExercise.type === 'identification' && Array.isArray((currentExercise.data as any)?.shapes) ? (
                      <div className="space-y-2">
                        {(currentExercise.data as any).shapes.map((opt: string, idx: number) => (
                          <label key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                              type="radio"
                              name={`exercise-${currentExercise.id}`}
                              className="w-4 h-4"
                              checked={selectedOption === opt}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedOption(opt);
                                }
                              }}
                            />
                            <span className="text-sm sm:text-base text-gray-800">{opt}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
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
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 text-base sm:text-lg"
                      />
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-2 sm:gap-3 md:gap-4 flex-wrap">
                  {!showHint && (
                    <button
                      onClick={() => setShowHint(true)}
                      className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-yellow-500 text-white rounded-lg sm:rounded-xl hover:bg-yellow-600 transition-colors font-medium text-sm sm:text-base shadow-lg hover:scale-105"
                    >
                      <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5" />
                      {t.hint}
                    </button>
                  )}
                  
                  <button
                    onClick={handleSubmitAnswer}
                    className="flex items-center gap-1 sm:gap-2 px-5 sm:px-8 py-2 sm:py-3 bg-teal-500 text-white rounded-lg sm:rounded-xl hover:bg-teal-600 transition-colors font-medium text-sm sm:text-base shadow-lg hover:scale-105"
                  >
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    {t.submit}
                  </button>

                  <button
                    onClick={handleSkip}
                    className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-500 text-white rounded-lg sm:rounded-xl hover:bg-gray-600 transition-colors font-medium text-sm sm:text-base shadow-lg hover:scale-105"
                  >
                    <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
                    {t.skip}
                  </button>
                </div>

                {/* Hint Display */}
                {showHint && (
                  <div className="hint-display p-4 sm:p-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl sm:rounded-2xl">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="text-xl sm:text-2xl">💡</div>
                      <div className="text-base sm:text-lg text-yellow-800 font-medium break-words">
                        {getTranslatedText(currentExercise, 'hint', language)}
                      </div>
                    </div>
                  </div>
                )}

                {/* Feedback */}
                {feedback && (
                  <div className={`feedback p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 flex items-center justify-center gap-2 sm:gap-4 ${
                    feedback === t.correct 
                      ? 'bg-green-50 border-green-200 text-green-800'
                      : 'bg-red-50 border-red-200 text-red-700'
                  }`}>
                    {feedback === t.correct ? (
                      <>
                        <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                        <div className="text-2xl sm:text-3xl">🎉</div>
                        <div className="text-lg sm:text-2xl font-bold">{feedback}</div>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                        <div className="text-2xl sm:text-3xl">🤔</div>
                        <div className="text-lg sm:text-2xl font-bold">{feedback}</div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRealWorldApplications = () => {
    const drawAngleArc = (cx: number, cy: number, radius: number, startAngle: number, endAngle: number, color: string) => {
      const start = (startAngle * Math.PI) / 180;
      const end = (endAngle * Math.PI) / 180;
      const x1 = cx + radius * Math.cos(start);
      const y1 = cy - radius * Math.sin(start);
      const x2 = cx + radius * Math.cos(end);
      const y2 = cy - radius * Math.sin(end);
      const largeArc = endAngle - startAngle > 180 ? 1 : 0;
      return (
        <path
          d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 0 ${x2} ${y2}`}
          fill="none"
          stroke={color}
          strokeWidth="2"
          opacity="0.8"
        />
      );
    };

    return (
      <div className="space-y-4 sm:space-y-6 w-full">
        {/* Applications content */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 w-full overflow-x-hidden">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">{t.realWorldApplications}</h2>
          
          {/* Applications Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Railroad Tracks - Parallel Lines with Transversal */}
            <div className="application-card bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-blue-200">
                            <div className="text-center">
                <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🚂</div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">{t.clockWatch}</h3>
                <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm break-words">
                  {t.clockWatchDesc}
                </p>
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                  <svg width="100%" height="120" viewBox="0 0 120 120" preserveAspectRatio="xMidYMid meet" className="mx-auto max-w-[120px] max-h-[120px]">
                    {/* Parallel railroad tracks */}
                    <line x1="10" y1="30" x2="110" y2="30" stroke="#555" strokeWidth="3"/>
                    <line x1="10" y1="50" x2="110" y2="50" stroke="#555" strokeWidth="3"/>
                    {/* Transversal crossing */}
                    <line x1="40" y1="10" x2="80" y2="70" stroke="#3b82f6" strokeWidth="3"/>
                    {/* Angle indicators */}
                    <circle cx="50" cy="30" r="2" fill="#10b981"/>
                    <circle cx="65" cy="50" r="2" fill="#10b981"/>
                    <text x="52" y="28" fill="#10b981" fontSize="10" fontWeight="bold">∠1</text>
                    <text x="67" y="48" fill="#10b981" fontSize="10" fontWeight="bold">∠2</text>
                  </svg>
                              </div>
                            </div>
                          </div>

            {/* Street Grid - Intersecting Lines */}
            <div className="application-card bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-teal-200">
              <div className="text-center">
                <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🏙️</div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">{t.construction}</h3>
                <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm break-words">
                  {t.constructionDesc}
                </p>
                <div className="bg-teal-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                  <svg width="100%" height="120" viewBox="0 0 120 120" preserveAspectRatio="xMidYMid meet" className="mx-auto max-w-[120px] max-h-[120px]">
                    {/* Parallel streets (horizontal) */}
                    <line x1="10" y1="35" x2="110" y2="35" stroke="#555" strokeWidth="2.5"/>
                    <line x1="10" y1="60" x2="110" y2="60" stroke="#555" strokeWidth="2.5"/>
                    <line x1="10" y1="85" x2="110" y2="85" stroke="#555" strokeWidth="2.5"/>
                    {/* Transversal roads (diagonal) */}
                    <line x1="40" y1="10" x2="80" y2="110" stroke="#14b8a6" strokeWidth="3"/>
                    {/* Angle indicators */}
                    <circle cx="50" cy="35" r="2" fill="#10b981"/>
                    <circle cx="60" cy="60" r="2" fill="#10b981"/>
                    <text x="52" y="33" fill="#10b981" fontSize="9" fontWeight="bold">∠</text>
                  </svg>
                      </div>
                    </div>
                </div>

            {/* Railway Crossing - Transversal */}
            <div className="application-card bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-purple-200">
            <div className="text-center">
                <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🚧</div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">{t.doorWindow}</h3>
                <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm break-words">
                  {t.doorWindowDesc}
                </p>
                <div className="bg-purple-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                  <svg width="100%" height="120" viewBox="0 0 120 120" preserveAspectRatio="xMidYMid meet" className="mx-auto max-w-[120px] max-h-[120px]">
                    {/* Parallel tracks */}
                    <line x1="10" y1="35" x2="110" y2="35" stroke="#555" strokeWidth="3"/>
                    <line x1="10" y1="55" x2="110" y2="55" stroke="#555" strokeWidth="3"/>
                    {/* Crossing road (transversal) */}
                    <line x1="60" y1="10" x2="60" y2="80" stroke="#a855f7" strokeWidth="4" strokeDasharray="5,3"/>
                    {/* Angle markers */}
                    <circle cx="60" cy="35" r="2.5" fill="#ec4899"/>
                    <circle cx="60" cy="55" r="2.5" fill="#ec4899"/>
                    {/* Labels */}
                    <text x="65" y="33" fill="#ec4899" fontSize="10" fontWeight="bold">∠</text>
                    <text x="65" y="53" fill="#ec4899" fontSize="10" fontWeight="bold">∠</text>
                </svg>
              </div>
            </div>
          </div>

            {/* Bridge Support Beams - Parallel with Transversal */}
            <div className="application-card bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-indigo-200">
            <div className="text-center">
                <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🌉</div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">{t.angleNavigation}</h3>
                <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm break-words">
                  {t.angleNavigationDesc}
                </p>
                <div className="bg-indigo-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                  <svg width="100%" height="120" viewBox="0 0 120 120" preserveAspectRatio="xMidYMid meet" className="mx-auto max-w-[120px] max-h-[120px]">
                    {/* Parallel beams */}
                    <line x1="15" y1="30" x2="105" y2="30" stroke="#6366F1" strokeWidth="4"/>
                    <line x1="15" y1="70" x2="105" y2="70" stroke="#6366F1" strokeWidth="4"/>
                    {/* Transversal support */}
                    <line x1="40" y1="30" x2="40" y2="70" stroke="#10b981" strokeWidth="3"/>
                    <line x1="60" y1="30" x2="60" y2="70" stroke="#10b981" strokeWidth="3"/>
                    <line x1="80" y1="30" x2="80" y2="70" stroke="#10b981" strokeWidth="3"/>
                    {/* Angle markers */}
                    <circle cx="40" cy="30" r="2" fill="#ec4899"/>
                    <circle cx="40" cy="70" r="2" fill="#ec4899"/>
                </svg>
              </div>
            </div>
          </div>

            {/* Window Panes - Grid with Diagonal */}
            <div className="application-card bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-orange-200">
            <div className="text-center">
                <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🪟</div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">{t.roadsBridges}</h3>
                <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm break-words">
                  {t.roadsBridgesDesc}
                </p>
                <div className="bg-orange-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                  <svg width="100%" height="120" viewBox="0 0 120 120" preserveAspectRatio="xMidYMid meet" className="mx-auto max-w-[120px] max-h-[120px]">
                    {/* Window frame */}
                    <rect x="20" y="20" width="80" height="80" fill="none" stroke="#555" strokeWidth="3"/>
                    {/* Horizontal bars */}
                    <line x1="20" y1="45" x2="100" y2="45" stroke="#555" strokeWidth="2"/>
                    <line x1="20" y1="70" x2="100" y2="70" stroke="#555" strokeWidth="2"/>
                    {/* Vertical bars */}
                    <line x1="45" y1="20" x2="45" y2="100" stroke="#555" strokeWidth="2"/>
                    <line x1="70" y1="20" x2="70" y2="100" stroke="#555" strokeWidth="2"/>
                    {/* Diagonal transversal */}
                    <line x1="20" y1="20" x2="100" y2="100" stroke="#f97316" strokeWidth="2.5" strokeDasharray="4,2"/>
                    {/* Angle markers */}
                    <circle cx="45" cy="45" r="2" fill="#10b981"/>
                </svg>
              </div>
            </div>
          </div>

            {/* Ladder Design - Parallel Rungs */}
            <div className="application-card bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-pink-200">
            <div className="text-center">
                <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🪜</div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">{t.angleArchitecture}</h3>
                <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm break-words">
                  {t.angleArchitectureDesc}
                </p>
                <div className="bg-pink-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                  <svg width="100%" height="120" viewBox="0 0 120 120" preserveAspectRatio="xMidYMid meet" className="mx-auto max-w-[120px] max-h-[120px]">
                    {/* Ladder side rails (transversals) */}
                    <line x1="35" y1="20" x2="35" y2="100" stroke="#a855f7" strokeWidth="4"/>
                    <line x1="85" y1="20" x2="85" y2="100" stroke="#a855f7" strokeWidth="4"/>
                    {/* Parallel rungs */}
                    <line x1="35" y1="30" x2="85" y2="30" stroke="#ec4899" strokeWidth="3"/>
                    <line x1="35" y1="50" x2="85" y2="50" stroke="#ec4899" strokeWidth="3"/>
                    <line x1="35" y1="70" x2="85" y2="70" stroke="#ec4899" strokeWidth="3"/>
                    <line x1="35" y1="90" x2="85" y2="90" stroke="#ec4899" strokeWidth="3"/>
                    {/* Angle markers */}
                    <circle cx="35" cy="30" r="2" fill="#10b981"/>
                    <circle cx="35" cy="50" r="2" fill="#10b981"/>
                    <text x="55" y="25" fill="#10b981" fontSize="10" fontWeight="bold">∠</text>
                </svg>
              </div>
            </div>
          </div>

            {/* Furniture Design - Supplementary */}
            <div className="application-card bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-emerald-200">
            <div className="text-center">
                <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🪑</div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">{t.furniture}</h3>
                <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm break-words">
                  {t.furnitureDesc}
                </p>
                <div className="bg-emerald-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                  <svg width="100%" height="120" viewBox="0 0 120 120" preserveAspectRatio="xMidYMid meet" className="mx-auto max-w-[120px] max-h-[120px]">
                    {/* Table with straight edge */}
                    <rect x="25" y="50" width="70" height="15" fill="#D1FAE5" stroke="#10B981" strokeWidth="3"/>
                    <line x1="20" y1="50" x2="100" y2="50" stroke="#10B981" strokeWidth="4"/>
                    <text x="50" y="45" fill="#10b981" fontSize="10" fontWeight="bold">180°</text>
                    {/* Table legs */}
                    <line x1="35" y1="65" x2="35" y2="90" stroke="#059669" strokeWidth="2"/>
                    <line x1="85" y1="65" x2="85" y2="90" stroke="#059669" strokeWidth="2"/>
                </svg>
              </div>
            </div>
          </div>

            {/* Geometry & Surveying - Both */}
            <div className="application-card bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-cyan-200">
            <div className="text-center">
                <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">📐</div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">{t.geometry}</h3>
                <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm break-words">
                  {t.geometryDesc}
                </p>
                <div className="bg-cyan-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                  <svg width="100%" height="120" viewBox="0 0 120 120" preserveAspectRatio="xMidYMid meet" className="mx-auto max-w-[120px] max-h-[120px]">
                    {/* Surveying triangle */}
                    <line x1="60" y1="20" x2="30" y2="80" stroke="#06B6D4" strokeWidth="2"/>
                    <line x1="30" y1="80" x2="90" y2="80" stroke="#06B6D4" strokeWidth="2"/>
                    <line x1="90" y1="80" x2="60" y2="20" stroke="#06B6D4" strokeWidth="2"/>
                    {/* Right angle indicator */}
                    <line x1="30" y1="80" x2="30" y2="60" stroke="#10b981" strokeWidth="2" strokeDasharray="3,3"/>
                    <line x1="30" y1="60" x2="50" y2="60" stroke="#10b981" strokeWidth="2" strokeDasharray="3,3"/>
                    {drawAngleArc(30, 80, 15, 0, 90, '#10b981')}
                    <text x="32" y="70" fill="#10b981" fontSize="10" fontWeight="bold">90°</text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-purple-50 to-pink-50 overflow-x-hidden">
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
      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 overflow-x-hidden">
        {/* Main Content */}
        <div className="main-content w-full">
          {currentMode === 'demonstration' && renderDemonstrationMode()}
          {currentMode === 'practice' && renderPracticeMode()}
          {currentMode === 'realworld' && renderRealWorldApplications()}
        </div>
      </main>
    </div>
  );
};

export default Chapter5Tool;
