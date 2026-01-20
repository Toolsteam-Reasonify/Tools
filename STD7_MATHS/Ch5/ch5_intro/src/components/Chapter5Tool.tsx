import React, { useState, useEffect } from 'react';
import { Lightbulb, CheckCircle, XCircle, RotateCcw, SkipForward, Trophy, ArrowLeft } from 'lucide-react';

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
    chapterTitle: 'Related Angles',
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
    sumPropertyText: 'Cuboid/Box, Cone, Cube, Cylinder  c, Pyramid - each has its own distinct net pattern. The Great Pyramid in Giza has a square base and four triangular sides.',
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
    clockWatch: 'Clock & Watch',
    clockWatchDesc: 'The hour and minute hands of a clock form complementary angles (90°) at 3:00, 9:00, etc. Understanding these angles helps read time accurately.',
    construction: 'Construction & Carpentry',
    constructionDesc: 'Builders use complementary angles to ensure walls meet at perfect right angles (90°). Corner joints, door frames, and window installations rely on complementary angle measurements.',
    doorWindow: 'Doors & Windows',
    doorWindowDesc: 'Door openings and window frames utilize complementary angles. When a door is open at 45°, the remaining angle is also 45°, together forming a 90° right angle.',
    angleNavigation: 'Navigation & Compass',
    angleNavigationDesc: 'Navigation uses complementary angles for direction. North-East, North-West, South-East, and South-West are all 45° from cardinal directions, forming 90° angles.',
    roadsBridges: 'Roads & Bridges',
    roadsBridgesDesc: 'Straight roads and bridge designs use supplementary angles (180°). When roads turn, the angles on opposite sides are supplementary, ensuring smooth traffic flow.',
    angleArchitecture: 'Architecture',
    angleArchitectureDesc: 'Architects use supplementary angles in building designs. Straight lines, flat surfaces, and parallel structures all incorporate 180° angles for stability and aesthetics.',
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
    chapterTitle: 'Related Angles',
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
    clockWatch: 'घड़ी और वॉच',
    clockWatchDesc: 'घड़ी की घंटे और मिनट की सुई 3:00, 9:00 आदि पर पूरक कोण (90°) बनाती हैं। इन कोणों को समझने से समय सटीक रूप से पढ़ने में मदद मिलती है।',
    construction: 'निर्माण और बढ़ईगीरी',
    constructionDesc: 'निर्माता दीवारों को सही समकोण (90°) पर मिलाने के लिए पूरक कोणों का उपयोग करते हैं। कोने के जोड़, दरवाजे के फ्रेम और खिड़की की स्थापना पूरक कोण माप पर निर्भर करती है।',
    doorWindow: 'दरवाजे और खिड़कियां',
    doorWindowDesc: 'दरवाजे के खुलेपन और खिड़की के फ्रेम पूरक कोणों का उपयोग करते हैं। जब दरवाजा 45° पर खुला होता है, तो शेष कोण भी 45° होता है, साथ मिलकर 90° का समकोण बनाते हैं।',
    angleNavigation: 'नेविगेशन और कम्पास',
    angleNavigationDesc: 'नेविगेशन दिशा के लिए पूरक कोणों का उपयोग करता है। उत्तर-पूर्व, उत्तर-पश्चिम, दक्षिण-पूर्व और दक्षिण-पश्चिम सभी मुख्य दिशाओं से 45° हैं, 90° का कोण बनाते हैं।',
    roadsBridges: 'सड़कें और पुल',
    roadsBridgesDesc: 'सीधी सड़कें और पुल डिजाइन संपूरक कोणों (180°) का उपयोग करते हैं। जब सड़कें मुड़ती हैं, तो विपरीत पक्षों के कोण संपूरक होते हैं, सुचारू यातायात प्रवाह सुनिश्चित करते हैं।',
    angleArchitecture: 'वास्तुकला',
    angleArchitectureDesc: 'वास्तुकार भवन डिजाइन में संपूरक कोणों का उपयोग करते हैं। सीधी रेखाएं, सपाट सतहें और समानांतर संरचनाएं सभी स्थिरता और सौंदर्य के लिए 180° कोणों को शामिल करती हैं।',
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
    chapterTitle: 'Related Angles',
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
    clockWatch: 'ઘડિયાળ અને વોચ',
    clockWatchDesc: 'ઘડિયાળની કલાક અને મિનિટની સોય 3:00, 9:00 વગેરે પર પૂરક કોણ (90°) બનાવે છે। આ કોણોને સમજવાથી સમય સચોટ રીતે વાંચવામાં મદદ મળે છે।',
    construction: 'બાંધકામ અને સુથારી',
    constructionDesc: 'બાંધકામ કરનાર દિવાલોને સંપૂર્ણ કાટકોણ (90°) પર મળે તેની ખાતરી કરવા માટે પૂરક કોણોનો ઉપયોગ કરે છે। ખૂણા જોડાણ, દરવાજાના ફ્રેમ અને વિન્ડો ઇન્સ્ટોલેશન પૂરક કોણ માપ પર આધાર રાખે છે।',
    doorWindow: 'દરવાજા અને વિન્ડો',
    doorWindowDesc: 'દરવાજાના ખુલ્લા સ્થાન અને વિન્ડો ફ્રેમ પૂરક કોણોનો ઉપયોગ કરે છે। જ્યારે દરવાજો 45° પર ખુલ્લો હોય છે, ત્યારે બાકીનો કોણ પણ 45° હોય છે, સાથે મળીને 90° નો કાટકોણ બનાવે છે।',
    angleNavigation: 'નેવિગેશન અને કમ્પાસ',
    angleNavigationDesc: 'નેવિગેશન દિશા માટે પૂરક કોણોનો ઉપયોગ કરે છે। ઉત્તર-પૂર્વ, ઉત્તર-પશ્ચિમ, દક્ષિણ-પૂર્વ અને દક્ષિણ-પશ્ચિમ બધા મુખ્ય દિશાઓથી 45° છે, 90° નો કોણ બનાવે છે।',
    roadsBridges: 'રસ્તા અને પુલ',
    roadsBridgesDesc: 'સીધા રસ્તા અને પુલ ડિઝાઇન સંપૂરક કોણો (180°) નો ઉપયોગ કરે છે। જ્યારે રસ્તા વળે છે, ત્યારે વિરોધી બાજુના કોણ સંપૂરક હોય છે, સરળ ટ્રાફિક પ્રવાહની ખાતરી કરે છે।',
    angleArchitecture: 'આર્કિટેક્ચર',
    angleArchitectureDesc: 'આર્કિટેક્ટ બિલ્ડિંગ ડિઝાઇનમાં સંપૂરક કોણોનો ઉપયોગ કરે છે। સીધી રેખાઓ, સપાટ સપાટીઓ અને સમાંતર માળખાં બધા સ્થિરતા અને સૌંદર્ય માટે 180° કોણોને શામેલ કરે છે।',
    furniture: 'ફર્નિચર ડિઝાઇન',
    furnitureDesc: 'ફર્નિચર બનાવનાર સપાટ સપાટીઓ માટે સંપૂરક કોણોનો ઉપયોગ કરે છે। ટેબલ, શેલ્ફ અને કેબિનેટમાં સ્થિરતા અને યોગ્ય સંરેખણની ખાતરી કરવા માટે સીધા કિનારાઓ (180°) હોય છે।',
    geometry: 'જ્યામિતિ અને સર્વેક્ષણ',
    geometryDesc: 'સર્વેયર્સ જમીન માપવા, પ્રદેશોનો નકશો બનાવવા અને કોણ સંબંધોનો ઉપયોગ કરીને સચોટ મિલકત સીમાઓની ખાતરી કરવા માટે પૂરક અને સંપૂરક કોણોનો ઉપયોગ કરે છે।'
  }
};

// Practice exercises with visual shapes data
// 3 Complementary Angle Questions + 3 Supplementary Angle Questions
// Practice exercises with visual shapes data
// 3 Complementary Angle Questions + 3 Supplementary Angle Questions
const practiceExercises: PracticeExercise[] = [
  // Complementary Angle Questions
  {
    id: 'ex1',
    type: 'calculation',
    difficulty: 'beginner',
    question: 'If angle A = 30°, what is the measure of its complementary angle?',
    data: { 
      visualShapes: ['Circle']
    },
    correctAnswer: 60,
    hint: 'Complementary angles add up to 90°. So if angle A = 30°, the complementary angle = 90° - 30° = 60°.',
    translations: {
      gu: {
        question: 'જો કોણ A = 30° હોય, તો તેના પૂરક કોણનું માપ શું છે?',
        hint: 'પૂરક કોણો 90° સુધી ઉમેરે છે. તેથી જો કોણ A = 30° હોય, તો પૂરક કોણ = 90° - 30° = 60°.'
      },
      hi: {
        question: 'यदि कोण A = 30° है, तो उसके पूरक कोण का माप क्या है?',
        hint: 'पूरक कोण 90° तक जुड़ते हैं। इसलिए यदि कोण A = 30° है, तो पूरक कोण = 90° - 30° = 60°।'
      }
    }
  },
  {
    id: 'ex2',
    type: 'calculation',
    difficulty: 'beginner',
    question: 'If angle B = 75°, what is the measure of its complementary angle?',
    data: { 
      visualShapes: ['Circle']
    },
    correctAnswer: 15,
    hint: 'Complementary angles add up to 90°. So if angle B = 75°, the complementary angle = 90° - 75° = 15°.',
    translations: {
      gu: {
        question: 'જો કોણ B = 75° હોય, તો તેના પૂરક કોણનું માપ શું છે?',
        hint: 'પૂરક કોણો 90° સુધી ઉમેરે છે. તેથી જો કોણ B = 75° હોય, તો પૂરક કોણ = 90° - 75° = 15°.'
      },
      hi: {
        question: 'यदि कोण B = 75° है, तो उसके पूरक कोण का माप क्या है?',
        hint: 'पूरक कोण 90° तक जुड़ते हैं। इसलिए यदि कोण B = 75° है, तो पूरक कोण = 90° - 75° = 15°।'
      }
    }
  },
  {
    id: 'ex3',
    type: 'identification',
    difficulty: 'beginner',
    question: 'Which of the following are complementary angles?',
    data: { 
      shapes: ['30° and 60°', '45° and 135°', '20° and 70°', '100° and 80°'],
      visualShapes: ['Circle', 'Circle', 'Circle', 'Circle']
    },
    correctAnswer: '30° and 60°, 20° and 70°',
    hint: 'Complementary angles add up to 90°. Check: 30° + 60° = 90° ✓, 20° + 70° = 90° ✓, but 45° + 135° = 180° (supplementary) and 100° + 80° = 180° (supplementary).',
    translations: {
      gu: {
        question: 'નીચેનામાંથી કયા પૂરક કોણો છે?',
        hint: 'પૂરક કોણો 90° સુધી ઉમેરે છે. તપાસો: 30° + 60° = 90° ✓, 20° + 70° = 90° ✓, પરંતુ 45° + 135° = 180° (સંપૂરક) અને 100° + 80° = 180° (સંપૂરક).'
      },
      hi: {
        question: 'निम्नलिखित में से कौन से पूरक कोण हैं?',
        hint: 'पूरक कोण 90° तक जुड़ते हैं। जांचें: 30° + 60° = 90° ✓, 20° + 70° = 90° ✓, लेकिन 45° + 135° = 180° (संपूरक) और 100° + 80° = 180° (संपूरक)।'
      }
    }
  },
  // Supplementary Angle Questions
  {
    id: 'ex4',
    type: 'calculation',
    difficulty: 'intermediate',
    question: 'If angle X = 120°, what is the measure of its supplementary angle?',
    data: { 
      visualShapes: ['Circle']
    },
    correctAnswer: 60,
    hint: 'Supplementary angles add up to 180°. So if angle X = 120°, the supplementary angle = 180° - 120° = 60°.',
    translations: {
      gu: {
        question: 'જો કોણ X = 120° હોય, તો તેના સંપૂરક કોણનું માપ શું છે?',
        hint: 'સંપૂરક કોણો 180° સુધી ઉમેરે છે. તેથી જો કોણ X = 120° હોય, તો સંપૂરક કોણ = 180° - 120° = 60°.'
      },
      hi: {
        question: 'यदि कोण X = 120° है, तो उसके संपूरक कोण का माप क्या है?',
        hint: 'संपूरक कोण 180° तक जुड़ते हैं। इसलिए यदि कोण X = 120° है, तो संपूरक कोण = 180° - 120° = 60°।'
      }
    }
  },
  {
    id: 'ex5',
    type: 'identification',
    difficulty: 'intermediate',
    question: 'Which of the following are supplementary angles?',
    data: { 
      shapes: ['50° and 130°', '90° and 90°', '45° and 45°', '70° and 110°'],
      visualShapes: ['Circle', 'Circle', 'Circle', 'Circle']
    },
    correctAnswer: '50° and 130°, 70° and 110°',
    hint: 'Supplementary angles add up to 180°. Check: 50° + 130° = 180° ✓, 70° + 110° = 180° ✓, but 90° + 90° = 180° (also supplementary, but both are right angles), 45° + 45° = 90° (complementary).',
    translations: {
      gu: {
        question: 'નીચેનામાંથી કયા સંપૂરક કોણો છે?',
        hint: 'સંપૂરક કોણો 180° સુધી ઉમેરે છે. તપાસો: 50° + 130° = 180° ✓, 70° + 110° = 180° ✓, પરંતુ 90° + 90° = 180° (પણ સંપૂરક, પરંતુ બંને કાટકોણ છે), 45° + 45° = 90° (પૂરક).'
      },
      hi: {
        question: 'निम्नलिखित में से कौन से संपूरक कोण हैं?',
        hint: 'संपूरक कोण 180° तक जुड़ते हैं। जांचें: 50° + 130° = 180° ✓, 70° + 110° = 180° ✓, लेकिन 90° + 90° = 180° (भी संपूरक, लेकिन दोनों समकोण हैं), 45° + 45° = 90° (पूरक)।'
      }
    }
  },
  {
    id: 'ex6',
    type: 'calculation',
    difficulty: 'intermediate',
    question: 'Two angles are supplementary. If one angle is 85°, what is the measure of the other angle?',
    data: { 
      visualShapes: ['Circle']
    },
    correctAnswer: 95,
    hint: 'Supplementary angles add up to 180°. So if one angle is 85°, the other angle = 180° - 85° = 95°.',
    translations: {
      gu: {
        question: 'બે કોણ સંપૂરક છે. જો એક કોણ 85° હોય, તો બીજા કોણનું માપ શું છે?',
        hint: 'સંપૂરક કોણો 180° સુધી ઉમેરે છે. તેથી જો એક કોણ 85° હોય, તો બીજો કોણ = 180° - 85° = 95°.'
      },
      hi: {
        question: 'दो कोण संपूरक हैं। यदि एक कोण 85° है, तो दूसरे कोण का माप क्या है?',
        hint: 'संपूरक कोण 180° तक जुड़ते हैं। इसलिए यदि एक कोण 85° है, तो दूसरा कोण = 180° - 85° = 95°।'
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
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  
  // Angles learning state
  const [activeTab, setActiveTab] = useState<'complementary' | 'supplementary' | null>(null);
  const [angle1, setAngle1] = useState(30);
  const [angle2Comp, setAngle2Comp] = useState(60);
  const [angle1Supp, setAngle1Supp] = useState(110);
  const [angle2Supp, setAngle2Supp] = useState(70);
  const [isAnimating, setIsAnimating] = useState(false);


  const t = translations[language];

  // Handle language change and save to localStorage
  const handleLanguageChange = (newLanguage: 'en' | 'hi' | 'gu') => {
    setLanguage(newLanguage);
    localStorage.setItem('ch5-language', newLanguage);
  };

  // Auto-calculate complementary and supplementary angles
  useEffect(() => {
    setAngle2Comp(90 - angle1);
  }, [angle1]);

  useEffect(() => {
    setAngle2Supp(180 - angle1Supp);
  }, [angle1Supp]);

  const animateAngles = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    const duration = 4000; // Slower animation (4 seconds)
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      if (activeTab === 'complementary') {
        // Use oscillation between 15° and 75° (keeping both angles positive and within 10-80 range)
        // This ensures angle1 ranges from 15° to 75°, so angle2 ranges from 75° to 15°
        const minAngle = 15;
        const maxAngle = 75;
        const range = maxAngle - minAngle;
        // Use sine wave oscillating between 0 and 1, then scale to range
        const normalizedProgress = (Math.sin(progress * Math.PI * 2) + 1) / 2; // 0 to 1
        const newAngle = minAngle + normalizedProgress * range;
        const clampedAngle = Math.max(10, Math.min(80, Math.round(newAngle)));
        setAngle1(clampedAngle);
      } else if (activeTab === 'supplementary') {
        // Use oscillation between 30° and 150° (keeping both angles positive and within 20-160 range)
        // This ensures angle1 ranges from 30° to 150°, so angle2 ranges from 150° to 30°
        const minAngle = 30;
        const maxAngle = 150;
        const range = maxAngle - minAngle;
        // Use sine wave oscillating between 0 and 1, then scale to range
        const normalizedProgress = (Math.sin(progress * Math.PI * 2) + 1) / 2; // 0 to 1
        const newAngle = minAngle + normalizedProgress * range;
        const clampedAngle = Math.max(20, Math.min(160, Math.round(newAngle)));
        setAngle1Supp(clampedAngle);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    animate();
  };

  // Helper function to split text into sentences and animate them
  const AnimatedText = ({ text, baseDelay = 0.8, className = "" }: { text: string, baseDelay?: number, className?: string }) => {
    // Split text by periods, exclamation marks, or question marks followed by space or end of string
    const sentences = text.split(/(?<=[.!?।।])\s+/).filter(s => s.trim());
    
    return (
      <div className={className}>
        {sentences.map((sentence, index) => (
          <span
            key={index}
            className="inline animate-fadeIn"
            style={{
              animationDelay: `${baseDelay + (index * 0.4)}s`,
              animationFillMode: 'both'
            }}
          >
            {sentence}{index < sentences.length - 1 ? ' ' : ''}
          </span>
        ))}
      </div>
    );
  };

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
        strokeWidth="3"
        opacity="0.8"
      />
    );
  };

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
      const correctSet = new Set(
        String(currentExercise.correctAnswer)
          .split(',')
          .map(s => s.trim().toLowerCase())
          .filter(Boolean)
      );
      const selectedSet = new Set(selectedOptions.map(s => s.trim().toLowerCase()));
      if (correctSet.size === selectedSet.size) {
        isCorrect = [...correctSet].every(opt => selectedSet.has(opt));
      } else {
        isCorrect = false;
      }
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
        setSelectedOptions([]);
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
    setSelectedOptions([]);
  };

  const ComplementaryDiagram = () => (
    <svg width="100%" height="300" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet" className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg max-h-[400px] w-full">
      <line x1="50" y1="200" x2="350" y2="200" stroke="#1e293b" strokeWidth="2" />
      <line x1="200" y1="200" x2={200 + 150 * Math.cos((angle1 * Math.PI) / 180)} y2={200 - 150 * Math.sin((angle1 * Math.PI) / 180)} stroke="#3b82f6" strokeWidth="3" />
      <line x1="200" y1="200" x2="200" y2="50" stroke="#8b5cf6" strokeWidth="3" />
      {drawAngleArc(200, 200, 60, 0, angle1, '#3b82f6')}
      {drawAngleArc(200, 200, 80, angle1, 90, '#8b5cf6')}
      <text x={200 + 90 * Math.cos((angle1 / 2 * Math.PI) / 180)} y={200 - 90 * Math.sin((angle1 / 2 * Math.PI) / 180)} fill="#3b82f6" fontSize="20" fontWeight="bold">{angle1}°</text>
      <text x={200 + 100 * Math.cos(((angle1 + (90 - angle1) / 2) * Math.PI) / 180)} y={200 - 100 * Math.sin(((angle1 + (90 - angle1) / 2) * Math.PI) / 180)} fill="#8b5cf6" fontSize="20" fontWeight="bold">{angle2Comp}°</text>
      <text x="150" y="250" fill="#059669" fontSize="18" fontWeight="bold">{angle1}° + {angle2Comp}° = 90°</text>
      <rect x="190" y="190" width="10" height="10" fill="none" stroke="#1e293b" strokeWidth="1.5" />
    </svg>
  );

  const SupplementaryDiagram = () => (
    <svg width="100%" height="300" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet" className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg max-h-[400px] w-full">
      <line x1="50" y1="200" x2="350" y2="200" stroke="#1e293b" strokeWidth="2" />
      <line x1="200" y1="200" x2={200 + 150 * Math.cos((angle1Supp * Math.PI) / 180)} y2={200 - 150 * Math.sin((angle1Supp * Math.PI) / 180)} stroke="#ec4899" strokeWidth="3" />
      {drawAngleArc(200, 200, 60, 0, angle1Supp, '#ec4899')}
      {drawAngleArc(200, 200, 80, angle1Supp, 180, '#a855f7')}
      <text x={200 + 90 * Math.cos((angle1Supp / 2 * Math.PI) / 180)} y={200 - 90 * Math.sin((angle1Supp / 2 * Math.PI) / 180)} fill="#ec4899" fontSize="20" fontWeight="bold">{angle1Supp}°</text>
      <text x={200 + 100 * Math.cos(((angle1Supp + (180 - angle1Supp) / 2) * Math.PI) / 180)} y={200 - 100 * Math.sin(((angle1Supp + (180 - angle1Supp) / 2) * Math.PI) / 180)} fill="#a855f7" fontSize="20" fontWeight="bold">{angle2Supp}°</text>
      <text x="120" y="250" fill="#059669" fontSize="18" fontWeight="bold">{angle1Supp}° + {angle2Supp}° = 180°</text>
    </svg>
  );


  const renderDemonstrationMode = () => (
    <div className="space-y-4 sm:space-y-6 w-full">
      {/* Angle Definition Block - First */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 border-t-4 border-blue-500 w-full animate-slideIn">
        <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 bg-blue-50 rounded-xl border-l-4 border-blue-500">
          <span className="text-2xl sm:text-3xl animate-fadeIn" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>📖</span>
          <div className="flex-1">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3 animate-fadeIn" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>{t.angleDefinition}</h3>
            <AnimatedText 
              text={t.angleDefinitionText} 
              baseDelay={0.8} 
              className="text-gray-700 text-base sm:text-lg leading-relaxed break-words"
            />
          </div>
        </div>
      </div>

      {/* Topic Selection Buttons - Side by Side */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6 w-full">
        <button
          onClick={() => setActiveTab('complementary')}
          className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all transform hover:scale-105 ${
            activeTab === 'complementary' 
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white ring-2 sm:ring-4 ring-blue-200' 
              : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
          }`}
        >
          {t.complementaryAngles}
        </button>
        <button
          onClick={() => setActiveTab('supplementary')}
          className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all transform hover:scale-105 ${
            activeTab === 'supplementary' 
              ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white ring-2 sm:ring-4 ring-purple-200' 
              : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
          }`}
        >
          {t.supplementaryAngles}
        </button>
      </div>

      {/* Content Display */}
      {activeTab === 'complementary' && (
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 w-full overflow-x-hidden animate-slideIn">
          {/* Definition */}
          <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 bg-blue-50 rounded-xl border-l-4 border-blue-500 animate-fadeIn" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <span className="text-2xl sm:text-3xl animate-fadeIn" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>📖</span>
            <div className="flex-1">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3 animate-fadeIn" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>{t.complementaryAngles}</h3>
              <AnimatedText 
                text={
                  language === 'en' ? 'When the sum of the measures of two angles is 90°, the angles are called complementary angles.' :
                  language === 'hi' ? 'जब दो कोणों के मापों का योग 90° हो, तो कोणों को पूरक कोण कहा जाता है।' :
                  'જ્યારે બે કોણના માપનો સરવાળો 90° હોય, તો કોણને પૂરક કોણ કહેવામાં આવે છે।'
                }
                baseDelay={0.9}
                className="text-gray-700 text-base sm:text-lg leading-relaxed break-words"
              />
            </div>
          </div>
          
          {/* Interactive Diagram */}
          <div className="animate-fadeIn" style={{ animationDelay: '1.5s', animationFillMode: 'both' }}>
            <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 animate-fadeIn" style={{ animationDelay: '1.7s', animationFillMode: 'both' }}>{t.interactiveDiagram}:</h4>
            <div className="animate-fadeIn" style={{ animationDelay: '2s', animationFillMode: 'both' }}>
              <ComplementaryDiagram />
            </div>
          </div>
          
          {/* Controls */}
          <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4 animate-fadeIn" style={{ animationDelay: '2.3s', animationFillMode: 'both' }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <label className="text-gray-700 font-semibold text-sm sm:text-base min-w-[100px] sm:min-w-[120px]">{t.adjustAngle}:</label>
              <input type="range" min="10" max="80" value={angle1} onChange={(e) => setAngle1(Number(e.target.value))} className="flex-1 w-full sm:w-auto h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer" />
              <span className="text-blue-600 font-bold text-base sm:text-lg min-w-[50px] sm:min-w-[60px]">{angle1}°</span>
            </div>
            <button onClick={animateAngles} disabled={isAnimating} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 text-sm sm:text-base">
              <RotateCcw className={`w-4 h-4 sm:w-5 sm:h-5 ${isAnimating ? 'animate-spin' : ''}`} />
              {t.animateAngles}
            </button>
          </div>

        </div>
      )}

      {activeTab === 'supplementary' && (
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 w-full overflow-x-hidden animate-slideIn">
          {/* Definition */}
          <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 bg-purple-50 rounded-xl border-l-4 border-purple-500 animate-fadeIn" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <span className="text-2xl sm:text-3xl animate-fadeIn" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>📖</span>
            <div className="flex-1">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3 animate-fadeIn" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>{t.supplementaryAngles}</h3>
              <AnimatedText 
                text={
                  language === 'en' ? 'When the sum of the measures of two angles is 180°, the angles are called supplementary angles.' :
                  language === 'hi' ? 'जब दो कोणों के मापों का योग 180° हो, तो कोणों को संपूरक कोण कहा जाता है।' :
                  'જ્યારે બે કોણના માપનો સરવાળો 180° હોય, તો કોણને સંપૂરક કોણ કહેવામાં આવે છે।'
                }
                baseDelay={0.9}
                className="text-gray-700 text-base sm:text-lg leading-relaxed break-words"
              />
            </div>
          </div>
          
          {/* Interactive Diagram */}
          <div className="animate-fadeIn" style={{ animationDelay: '1.5s', animationFillMode: 'both' }}>
            <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 animate-fadeIn" style={{ animationDelay: '1.7s', animationFillMode: 'both' }}>{t.interactiveDiagram}:</h4>
            <div className="animate-fadeIn" style={{ animationDelay: '2s', animationFillMode: 'both' }}>
              <SupplementaryDiagram />
            </div>
          </div>
          
          {/* Controls */}
          <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4 animate-fadeIn" style={{ animationDelay: '2.3s', animationFillMode: 'both' }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <label className="text-gray-700 font-semibold text-sm sm:text-base min-w-[100px] sm:min-w-[120px]">{t.adjustAngle}:</label>
              <input type="range" min="20" max="160" value={angle1Supp} onChange={(e) => setAngle1Supp(Number(e.target.value))} className="flex-1 w-full sm:w-auto h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer" />
              <span className="text-purple-600 font-bold text-base sm:text-lg min-w-[50px] sm:min-w-[60px]">{angle1Supp}°</span>
            </div>
            <button onClick={animateAngles} disabled={isAnimating} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 text-sm sm:text-base">
              <RotateCcw className={`w-4 h-4 sm:w-5 sm:h-5 ${isAnimating ? 'animate-spin' : ''}`} />
              {t.animateAngles}
            </button>
          </div>
        </div>
      )}
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
                              type="checkbox"
                              className="w-4 h-4"
                              checked={selectedOptions.includes(opt)}
                              onChange={(e) => {
                                setSelectedOptions(prev => {
                                  if (e.target.checked) {
                                    return [...prev, opt];
                                  } else {
                                    return prev.filter(o => o !== opt);
                                  }
                                });
                              }}
                            />
                            <span className="text-sm sm:text-base text-gray-800">{opt}</span>
                          </label>
                        ))}
                        <div className="text-xs text-gray-500 mt-1">Select all that apply.</div>
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
            {/* Clock & Watch - Complementary */}
            <div className="application-card bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-blue-200">
                            <div className="text-center">
                <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🕐</div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">{t.clockWatch}</h3>
                <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm break-words">
                  {t.clockWatchDesc}
                </p>
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                  <svg width="100%" height="120" viewBox="0 0 120 120" preserveAspectRatio="xMidYMid meet" className="mx-auto max-w-[120px] max-h-[120px]">
                    <circle cx="60" cy="60" r="50" fill="#EFF6FF" stroke="#3b82f6" strokeWidth="2"/>
                    <circle cx="60" cy="60" r="3" fill="#3b82f6"/>
                    {/* Hour hand at 3 */}
                    <line x1="60" y1="60" x2="100" y2="60" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round"/>
                    {/* Minute hand at 12 */}
                    <line x1="60" y1="60" x2="60" y2="20" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round"/>
                    {drawAngleArc(60, 60, 25, 0, 90, '#10b981')}
                    <text x="75" y="45" fill="#10b981" fontSize="12" fontWeight="bold">90°</text>
                  </svg>
                              </div>
                            </div>
                          </div>

            {/* Construction & Carpentry - Complementary */}
            <div className="application-card bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-teal-200">
              <div className="text-center">
                <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🔨</div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">{t.construction}</h3>
                <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm break-words">
                  {t.constructionDesc}
                </p>
                <div className="bg-teal-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                  <svg width="100%" height="120" viewBox="0 0 120 120" preserveAspectRatio="xMidYMid meet" className="mx-auto max-w-[120px] max-h-[120px]">
                    {/* Wall corner */}
                    <line x1="20" y1="60" x2="60" y2="60" stroke="#14b8a6" strokeWidth="4"/>
                    <line x1="60" y1="60" x2="60" y2="20" stroke="#14b8a6" strokeWidth="4"/>
                    {drawAngleArc(60, 60, 20, 0, 90, '#10b981')}
                    <text x="70" y="50" fill="#10b981" fontSize="12" fontWeight="bold">90°</text>
                    <rect x="58" y="58" width="4" height="4" fill="#0d9488"/>
                  </svg>
                      </div>
                    </div>
                </div>

            {/* Doors & Windows - Complementary */}
            <div className="application-card bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-purple-200">
            <div className="text-center">
                <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🚪</div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">{t.doorWindow}</h3>
                <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm break-words">
                  {t.doorWindowDesc}
                </p>
                <div className="bg-purple-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                  <svg width="100%" height="120" viewBox="0 0 120 120" preserveAspectRatio="xMidYMid meet" className="mx-auto max-w-[120px] max-h-[120px]">
                    {/* Door frame */}
                    <line x1="30" y1="30" x2="30" y2="90" stroke="#a855f7" strokeWidth="3"/>
                    <line x1="30" y1="30" x2="90" y2="30" stroke="#a855f7" strokeWidth="2"/>
                    {/* Door at 45° */}
                    <line x1="30" y1="30" x2={30 + 50 * Math.cos(Math.PI / 4)} y2={30 + 50 * Math.sin(Math.PI / 4)} stroke="#ec4899" strokeWidth="3"/>
                    {drawAngleArc(30, 30, 25, 0, 45, '#ec4899')}
                    {drawAngleArc(30, 30, 30, 45, 90, '#8b5cf6')}
                    <text x="45" y="50" fill="#ec4899" fontSize="10" fontWeight="bold">45°</text>
                    <text x="20" y="50" fill="#8b5cf6" fontSize="10" fontWeight="bold">45°</text>
                </svg>
              </div>
            </div>
          </div>

            {/* Navigation & Compass - Complementary */}
            <div className="application-card bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-indigo-200">
            <div className="text-center">
                <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🧭</div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">{t.angleNavigation}</h3>
                <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm break-words">
                  {t.angleNavigationDesc}
                </p>
                <div className="bg-indigo-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                  <svg width="100%" height="120" viewBox="0 0 120 120" preserveAspectRatio="xMidYMid meet" className="mx-auto max-w-[120px] max-h-[120px]">
                    {/* Compass rose */}
                    <circle cx="60" cy="60" r="45" fill="#E0E7FF" stroke="#6366F1" strokeWidth="2"/>
                    <line x1="60" y1="15" x2="60" y2="30" stroke="#6366F1" strokeWidth="2"/>
                    <text x="55" y="12" fill="#6366F1" fontSize="10" fontWeight="bold">N</text>
                    {/* NE direction at 45° */}
                    <line x1="60" y1="60" x2={60 + 35 * Math.cos(Math.PI / 4)} y2={60 - 35 * Math.sin(Math.PI / 4)} stroke="#10b981" strokeWidth="2"/>
                    {/* N direction */}
                    <line x1="60" y1="60" x2="60" y2="25" stroke="#6366F1" strokeWidth="2"/>
                    {drawAngleArc(60, 60, 28, 0, 45, '#10b981')}
                    <text x="75" y="50" fill="#10b981" fontSize="10" fontWeight="bold">45°</text>
                </svg>
              </div>
            </div>
          </div>

            {/* Roads & Bridges - Supplementary */}
            <div className="application-card bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-orange-200">
            <div className="text-center">
                <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🛣️</div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">{t.roadsBridges}</h3>
                <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm break-words">
                  {t.roadsBridgesDesc}
                </p>
                <div className="bg-orange-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                  <svg width="100%" height="120" viewBox="0 0 120 120" preserveAspectRatio="xMidYMid meet" className="mx-auto max-w-[120px] max-h-[120px]">
                    {/* Straight road */}
                    <line x1="10" y1="60" x2="110" y2="60" stroke="#f97316" strokeWidth="6" strokeLinecap="round"/>
                    {/* Road markings */}
                    <line x1="30" y1="60" x2="50" y2="60" stroke="#fff" strokeWidth="2" strokeDasharray="3,3"/>
                    <line x1="70" y1="60" x2="90" y2="60" stroke="#fff" strokeWidth="2" strokeDasharray="3,3"/>
                    {/* Angle indicator */}
                    <line x1="60" y1="60" x2="60" y2="30" stroke="#f97316" strokeWidth="2" opacity="0.3"/>
                    <path d="M 60 60 L 60 60" stroke="#10b981" strokeWidth="3" opacity="0.8"/>
                    <text x="65" y="45" fill="#10b981" fontSize="10" fontWeight="bold">180°</text>
                </svg>
              </div>
            </div>
          </div>

            {/* Architecture - Supplementary */}
            <div className="application-card bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-pink-200">
            <div className="text-center">
                <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🏛️</div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">{t.angleArchitecture}</h3>
                <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm break-words">
                  {t.angleArchitectureDesc}
                </p>
                <div className="bg-pink-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                  <svg width="100%" height="120" viewBox="0 0 120 120" preserveAspectRatio="xMidYMid meet" className="mx-auto max-w-[120px] max-h-[120px]">
                    {/* Building structure with straight lines */}
                    <rect x="40" y="40" width="40" height="30" fill="#FCE7F3" stroke="#EC4899" strokeWidth="2"/>
                    <line x1="30" y1="70" x2="90" y2="70" stroke="#EC4899" strokeWidth="3"/>
                    {/* Flat roof - 180° line */}
                    <line x1="35" y1="40" x2="85" y2="40" stroke="#a855f7" strokeWidth="3"/>
                    <circle cx="60" cy="40" r="2" fill="#a855f7"/>
                    <text x="45" y="35" fill="#10b981" fontSize="10" fontWeight="bold">180°</text>
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
