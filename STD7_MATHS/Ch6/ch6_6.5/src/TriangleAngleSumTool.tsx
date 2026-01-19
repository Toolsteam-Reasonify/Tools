import React, { useState, useEffect } from 'react';
import { Lightbulb, CheckCircle, XCircle, Play, RotateCcw, ChevronRight, ChevronLeft, Eye } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

interface Triangle {
  A: Point;
  B: Point;
  C: Point;
}

interface PracticeExercise {
  id: string;
  type: 'calculation' | 'identification' | 'verification';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  question: string;
  data: any;
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
    chapterTitle: 'Triangle Angle Sum',
    topicTitle: 'Understanding Angle Sum Theorem',
    whatIsTopic: 'What is the Angle Sum Theorem?',
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
    definition: 'Angle Sum Definition',
    definitionText: 'The sum of the interior angles of any triangle is always 180°. This fundamental property holds true for all triangles, regardless of their shape or size.',
    keyComponents: 'Key Components',
    keyComponentsText: 'Each triangle has three interior angles (∠A, ∠B, ∠C). The angle sum theorem states that ∠A + ∠B + ∠C = 180° for any triangle.',
    keyProperty: 'The Angle Sum Property',
    keyPropertyText: 'This property is fundamental in geometry and is used to solve various problems involving triangles. It helps us find unknown angles when we know the other angles.',
    justification: 'How It\'s Proven',
    justificationText: 'The theorem can be proven by drawing a line parallel to one side of the triangle through the opposite vertex. Using properties of parallel lines and transversals, we can show that the three angles form a straight line (180°).',
    practicalApplications: 'Practical Applications',
    practicalApplicationsText: 'This theorem is essential in architecture, engineering, surveying, and navigation. It helps ensure structural stability and accurate measurements in real-world applications.',
    visualization: 'Triangle Visualization',
    interiorElements: 'Interior Angles',
    exteriorElements: 'Angle Sum',
    triangleOf: 'Triangle',
    of: 'of',
    yourAnswer: 'Your Answer',
    enterAnswer: 'Enter your answer...',
    architecture: 'Architecture',
    architectureDesc: 'Architects use the angle sum theorem to ensure structural stability in triangular supports and roof designs.',
    navigation: 'Engineering',
    navigationDesc: 'Engineers apply this principle in truss design and load distribution calculations for bridges and buildings.',
    engineering: 'Navigation',
    engineeringDesc: 'Navigation systems rely on triangular calculations for positioning, mapping, and GPS technology.',
    artDesign: 'Surveying',
    artDesignDesc: 'Surveyors use triangle angle sums to verify measurements and ensure accuracy in land surveying.',
    surveying: 'Computer Graphics',
    surveyingDesc: '3D modeling software uses angle calculations to create realistic lighting and shadow effects.',
    computerGraphics: 'Art & Design',
    computerGraphicsDesc: 'Artists use angle concepts to create perspective drawings and architectural illustrations.',
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
    dragVerticesInstruction: 'Drag the vertices to explore angle relationships',
    mathematicalExample: 'Mathematical Example',
    given: 'Given',
    find: 'Find',
    angleSumGiven: 'Triangle with angles 60°, 70°, and 50°',
    verifySum: 'Verify that the sum equals 180°',
    findMissingAngle: 'Missing angle calculation',
    triangleAngleSumProperty: 'Triangle Angle Sum Property',
    interactiveExploration: 'Interactive Exploration: All angles in a triangle sum to 180°',
    // AngleSumProperty translations
    angleSumPropertyTitle: 'Angle Sum Property of a Triangle',
    interactiveDemonstration: 'Interactive demonstration of triangle angles',
    showAngles: 'Show Angles',
    showingAngles: 'Showing Angles...',
    reset: 'Reset',
    whatIsAngleSumProperty: 'What is the Angle Sum Property?',
    angleSumPropertyDefinition: 'The Angle Sum Property states that the sum of all three interior angles of any triangle always equals 180 degrees. This is true for all types of triangles - whether acute, obtuse, or right-angled.',
    understandingDemonstration: 'Understanding the Demonstration:',
    identifyAngleA: 'Identify Angle A (at vertex A)',
    identifyAngleB: 'Identify Angle B (at vertex B)',
    identifyAngleC: 'Identify Angle C and Calculate Sum',
    angleAStep: 'When you click "Show Angles", the first angle at vertex A is highlighted with a red arc. This angle is formed by the two sides of the triangle meeting at point A.',
    angleBStep: 'Next, Angle B at vertex B is shown with a green arc. This is the angle at the bottom-left corner of the triangle.',
    angleCStep: 'Finally, Angle C at vertex C is displayed with a blue arc. This is the angle at the bottom-right corner. When all three angles are shown, you can see the sum calculation proving the Angle Sum Property!',
    keyTakeaway: 'Key Takeaway:',
    keyTakeawayText: 'No matter what type of triangle you have or what the individual angle measurements are, when you add all three interior angles together, the sum will always be exactly 180°. This fundamental property is used extensively in geometry to solve problems involving triangles.',
    totalSum: 'Total Sum',
    angleA: 'Angle A',
    angleB: 'Angle B',
    angleC: 'Angle C'
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
    chapterTitle: 'त्रिभुज कोण योग',
    topicTitle: 'कोण योग प्रमेय की समझ',
    whatIsTopic: 'कोण योग प्रमेय क्या है?',
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
    definition: 'कोण योग की परिभाषा',
    definitionText: 'किसी भी त्रिभुज के आंतरिक कोणों का योग हमेशा 180° होता है। यह मौलिक गुणधर्म सभी त्रिभुजों के लिए सत्य है, चाहे उनका आकार या आकार कुछ भी हो।',
    keyComponents: 'मुख्य घटक',
    keyComponentsText: 'प्रत्येक त्रिभुज में तीन आंतरिक कोण (∠A, ∠B, ∠C) होते हैं। कोण योग प्रमेय कहता है कि किसी भी त्रिभुज के लिए ∠A + ∠B + ∠C = 180°।',
    keyProperty: 'कोण योग गुणधर्म',
    keyPropertyText: 'यह गुणधर्म ज्यामिति में मौलिक है और त्रिभुजों से संबंधित विभिन्न समस्याओं को हल करने के लिए उपयोग किया जाता है। यह हमें अज्ञात कोणों को खोजने में मदद करता है।',
    justification: 'इसकी पुष्टि कैसे होती है',
    justificationText: 'इस प्रमेय को त्रिभुज की एक भुजा के समानांतर विपरीत शीर्ष से एक रेखा खींचकर सिद्ध किया जा सकता है। समानांतर रेखाओं और तिर्यक रेखाओं के गुणधर्मों का उपयोग करके, हम दिखा सकते हैं कि तीनों कोण एक सीधी रेखा (180°) बनाते हैं।',
    practicalApplications: 'व्यावहारिक अनुप्रयोग',
    practicalApplicationsText: 'यह प्रमेय स्थापत्य, इंजीनियरिंग, सर्वेक्षण और नेविगेशन में आवश्यक है। यह वास्तविक दुनिया के अनुप्रयोगों में संरचनात्मक स्थिरता और सटीक माप सुनिश्चित करने में मदद करता है।',
    visualization: 'त्रिभुज दृश्यीकरण',
    interiorElements: 'आंतरिक कोण',
    exteriorElements: 'कोण योग',
    triangleOf: 'त्रिभुज',
    of: 'का',
    yourAnswer: 'आपका उत्तर',
    enterAnswer: 'अपना उत्तर दर्ज करें...',
    architecture: 'स्थापत्य',
    architectureDesc: 'स्थापत्यकार त्रिकोणीय समर्थन और छत डिजाइन में संरचनात्मक स्थिरता सुनिश्चित करने के लिए कोण योग प्रमेय का उपयोग करते हैं।',
    navigation: 'इंजीनियरिंग',
    navigationDesc: 'इंजीनियर पुलों और इमारतों के लिए ट्रस डिजाइन और भार वितरण गणना में इस सिद्धांत को लागू करते हैं।',
    engineering: 'नेविगेशन',
    engineeringDesc: 'नेविगेशन सिस्टम स्थिति निर्धारण, मैपिंग और GPS तकनीक के लिए त्रिकोणीय गणना पर निर्भर करते हैं।',
    artDesign: 'सर्वेक्षण',
    artDesignDesc: 'सर्वेक्षक भूमि सर्वेक्षण में मापों को सत्यापित करने और सटीकता सुनिश्चित करने के लिए त्रिभुज कोण योग का उपयोग करते हैं।',
    surveying: 'कंप्यूटर ग्राफिक्स',
    surveyingDesc: '3D मॉडलिंग सॉफ्टवेयर यथार्थवादी प्रकाश और छाया प्रभाव बनाने के लिए कोण गणना का उपयोग करता है।',
    computerGraphics: 'कला और डिजाइन',
    computerGraphicsDesc: 'कलाकार परिप्रेक्ष्य चित्र और स्थापत्य चित्रण बनाने के लिए कोण अवधारणाओं का उपयोग करते हैं।',
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
    dragVerticesInstruction: 'कोण संबंधों का अन्वेषण करने के लिए शीर्षों को खींचें',
    mathematicalExample: 'गणितीय उदाहरण',
    given: 'दिया गया',
    find: 'ज्ञात करें',
    angleSumGiven: 'त्रिभुज जिसके कोण 60°, 70°, और 50° हैं',
    verifySum: 'सत्यापित करें कि योग 180° के बराबर है',
    findMissingAngle: 'अज्ञात कोण गणना',
    triangleAngleSumProperty: 'त्रिभुज कोण योग गुणधर्म',
    interactiveExploration: 'इंटरैक्टिव अन्वेषण: त्रिभुज में सभी कोणों का योग 180° होता है',
    // AngleSumProperty translations
    angleSumPropertyTitle: 'त्रिभुज का कोण योग गुणधर्म',
    interactiveDemonstration: 'त्रिभुज कोणों का इंटरैक्टिव प्रदर्शन',
    showAngles: 'कोण दिखाएं',
    showingAngles: 'कोण दिखा रहे हैं...',
    reset: 'रीसेट',
    whatIsAngleSumProperty: 'कोण योग गुणधर्म क्या है?',
    angleSumPropertyDefinition: 'कोण योग गुणधर्म कहता है कि किसी भी त्रिभुज के तीनों आंतरिक कोणों का योग हमेशा 180 डिग्री के बराबर होता है। यह सभी प्रकार के त्रिभुजों के लिए सत्य है - चाहे वे न्यून, अधिक या समकोण हों।',
    understandingDemonstration: 'प्रदर्शन की समझ:',
    identifyAngleA: 'कोण A की पहचान करें (शीर्ष A पर)',
    identifyAngleB: 'कोण B की पहचान करें (शीर्ष B पर)',
    identifyAngleC: 'कोण C की पहचान करें और योग की गणना करें',
    angleAStep: 'जब आप "कोण दिखाएं" पर क्लिक करते हैं, तो शीर्ष A पर पहला कोण लाल चाप से हाइलाइट होता है। यह कोण त्रिभुज की दो भुजाओं द्वारा बिंदु A पर मिलने से बनता है।',
    angleBStep: 'अगला, शीर्ष B पर कोण B हरे चाप से दिखाया जाता है। यह त्रिभुज के निचले-बाएं कोने का कोण है।',
    angleCStep: 'अंत में, शीर्ष C पर कोण C नीले चाप से प्रदर्शित होता है। यह निचले-दाएं कोने का कोण है। जब सभी तीन कोण दिखाए जाते हैं, तो आप कोण योग गुणधर्म को सिद्ध करने वाली योग गणना देख सकते हैं!',
    keyTakeaway: 'मुख्य बात:',
    keyTakeawayText: 'चाहे आपके पास किसी भी प्रकार का त्रिभुज हो या व्यक्तिगत कोण माप कुछ भी हों, जब आप तीनों आंतरिक कोणों को एक साथ जोड़ते हैं, तो योग हमेशा ठीक 180° होगा। यह मौलिक गुणधर्म ज्यामिति में त्रिभुजों से संबंधित समस्याओं को हल करने के लिए व्यापक रूप से उपयोग किया जाता है।',
    totalSum: 'कुल योग',
    angleA: 'कोण A',
    angleB: 'कोण B',
    angleC: 'कोण C'
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
    chapterTitle: 'ત્રિકોણ કોણ સરવાળો',
    topicTitle: 'કોણ સરવાળો પ્રમેયની સમજ',
    whatIsTopic: 'કોણ સરવાળો પ્રમેય શું છે?',
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
    definition: 'કોણ સરવાળો વ્યાખ્યા',
    definitionText: 'કોઈપણ ત્રિકોણના આંતરિક કોણોનો સરવાળો હંમેશા 180° હોય છે। આ મૂળભૂત ગુણધર્મ તેમના આકાર અથવા કદને ધ્યાનમાં લીધા વગર બધા ત્રિકોણો માટે સાચું છે।',
    keyComponents: 'મુખ્ય ઘટકો',
    keyComponentsText: 'દરેક ત્રિકોણમાં ત્રણ આંતરિક કોણો (∠A, ∠B, ∠C) હોય છે। કોણ સરવાળો પ્રમેય કહે છે કે કોઈપણ ત્રિકોણ માટે ∠A + ∠B + ∠C = 180°।',
    keyProperty: 'કોણ સરવાળો ગુણધર્મ',
    keyPropertyText: 'આ ગુણધર્મ ભૂમિતિમાં મૂળભૂત છે અને ત્રિકોણો સાથે સંબંધિત વિવિધ સમસ્યાઓને હલ કરવા માટે વપરાય છે। તે અજ્ઞાત કોણો શોધવામાં અમને મદદ કરે છે।',
    justification: 'આની પુષ્ટિ કેવી રીતે થાય છે',
    justificationText: 'આ પ્રમેયને ત્રિકોણની એક બાજુને સમાંતર વિરુદ્ધ શિરોબિંદુથી એક રેખા દોરીને સિદ્ધ કરી શકાય છે। સમાંતર રેખાઓ અને તિર્યક રેખાઓના ગુણધર્મોનો ઉપયોગ કરીને, આપણે બતાવી શકીએ છીએ કે ત્રણેય કોણો એક સીધી રેખા (180°) બનાવે છે।',
    practicalApplications: 'વ્યવહારિક ઉપયોગો',
    practicalApplicationsText: 'આ પ્રમેય સ્થાપત્ય, ઇજનેરી, સર્વેક્ષણ અને નેવિગેશનમાં આવશ્યક છે। તે વાસ્તવિક વિશ્વના ઉપયોગોમાં માળખાકીય સ્થિરતા અને સચોટ માપ સુનિશ્ચિત કરવામાં મદદ કરે છે।',
    visualization: 'ત્રિકોણ દ્રશ્યીકરણ',
    interiorElements: 'આંતરિક કોણો',
    exteriorElements: 'કોણ સરવાળો',
    triangleOf: 'ત્રિકોણ',
    of: 'નો',
    yourAnswer: 'તમારો જવાબ',
    enterAnswer: 'તમારો જવાબ દાખલ કરો...',
    architecture: 'સ્થાપત્ય',
    architectureDesc: 'સ્થાપત્યકાર ત્રિકોણીય સમર્થન અને છત ડિઝાઇનમાં માળખાકીય સ્થિરતા સુનિશ્ચિત કરવા માટે કોણ સરવાળો પ્રમેયનો ઉપયોગ કરે છે।',
    navigation: 'ઇજનેરી',
    navigationDesc: 'ઇજનેરો પુલો અને ઇમારતો માટે ટ્રસ ડિઝાઇન અને લોડ વિતરણ ગણતરીઓમાં આ સિદ્ધાંત લાગુ પાડે છે।',
    engineering: 'નેવિગેશન',
    engineeringDesc: 'નેવિગેશન સિસ્ટમ સ્થિતિ નિર્ધારણ, મેપિંગ અને GPS ટેકનોલોજી માટે ત્રિકોણીય ગણતરી પર આધાર રાખે છે।',
    artDesign: 'સર્વેક્ષણ',
    artDesignDesc: 'સર્વેક્ષકો જમીન સર્વેક્ષણમાં માપોને ચકાસવા અને સચોટતા સુનિશ્ચિત કરવા માટે ત્રિકોણ કોણ સરવાળોનો ઉપયોગ કરે છે।',
    surveying: 'કમ્પ્યુટર ગ્રાફિક્સ',
    surveyingDesc: '3D મોડેલિંગ સોફ્ટવેર યથાર્થવાદી પ્રકાશ અને છાયા પ્રભાવો બનાવવા માટે કોણ ગણતરીનો ઉપયોગ કરે છે।',
    computerGraphics: 'કલા અને ડિઝાઇન',
    computerGraphicsDesc: 'કલાકારો પરિપ્રેક્ષ્ય ચિત્રો અને સ્થાપત્ય ચિત્રણ બનાવવા માટે કોણ ખ્યાલોનો ઉપયોગ કરે છે।',
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
    dragVerticesInstruction: 'કોણ સંબંધોનું અન્વેષણ કરવા માટે શિરોબિંદુઓને ખેંચો',
    mathematicalExample: 'ગણિતીય ઉદાહરણ',
    given: 'આપેલ',
    find: 'શોધો',
    angleSumGiven: 'ત્રિકોણ જેના કોણો 60°, 70°, અને 50° છે',
    verifySum: 'ચકાસો કે સરવાળો 180° જેટલો છે',
    findMissingAngle: 'અજ્ઞાત કોણ ગણતરી',
    triangleAngleSumProperty: 'ત્રિકોણ કોણ સરવાળો ગુણધર્મ',
    interactiveExploration: 'ઇન્ટરએક્ટિવ અન્વેષણ: ત્રિકોણમાં બધા કોણોનો સરવાળો 180° હોય છે',
    // AngleSumProperty translations
    angleSumPropertyTitle: 'ત્રિકોણનો કોણ સરવાળો ગુણધર્મ',
    interactiveDemonstration: 'ત્રિકોણ કોણોનું ઇન્ટરએક્ટિવ પ્રદર્શન',
    showAngles: 'કોણો બતાવો',
    showingAngles: 'કોણો બતાવી રહ્યા છીએ...',
    reset: 'રીસેટ',
    whatIsAngleSumProperty: 'કોણ સરવાળો ગુણધર્મ શું છે?',
    angleSumPropertyDefinition: 'કોણ સરવાળો ગુણધર્મ કહે છે કે કોઈપણ ત્રિકોણના ત્રણેય આંતરિક કોણોનો સરવાળો હંમેશા 180 ડિગ્રી જેટલો હોય છે। આ તમામ પ્રકારના ત્રિકોણો માટે સાચું છે - ભલે તે તીવ્ર, મંદ અથવા કાટકોણ હોય।',
    understandingDemonstration: 'પ્રદર્શનની સમજ:',
    identifyAngleA: 'કોણ A ને ઓળખો (શિરોબિંદુ A પર)',
    identifyAngleB: 'કોણ B ને ઓળખો (શિરોબિંદુ B પર)',
    identifyAngleC: 'કોણ C ને ઓળખો અને સરવાળો ગણો',
    angleAStep: 'જ્યારે તમે "કોણો બતાવો" પર ક્લિક કરો છો, ત્યારે શિરોબિંદુ A પર પહેલો કોણ લાલ ચાપથી હાઇલાઇટ થાય છે। આ કોણ ત્રિકોણની બે બાજુઓ દ્વારા બિંદુ A પર મળવાથી બને છે।',
    angleBStep: 'આગળ, શિરોબિંદુ B પર કોણ B લીલા ચાપથી બતાવવામાં આવે છે। આ ત્રિકોણના નીચે-ડાબા ખૂણાનો કોણ છે।',
    angleCStep: 'છેલ્લે, શિરોબિંદુ C પર કોણ C વાદળી ચાપથી પ્રદર્શિત થાય છે। આ નીચે-જમણા ખૂણાનો કોણ છે। જ્યારે તમામ ત્રણ કોણો બતાવવામાં આવે છે, ત્યારે તમે કોણ સરવાળો ગુણધર્મને સાબિત કરતી સરવાળો ગણતરી જોઈ શકો છો!',
    keyTakeaway: 'મુખ્ય મુદ્દો:',
    keyTakeawayText: 'ભલે તમારી પાસે કોઈપણ પ્રકારનો ત્રિકોણ હોય અથવા વ્યક્તિગત કોણ માપ કંઈપણ હોય, જ્યારે તમે ત્રણેય આંતરિક કોણોને એક સાથે ઉમેરો છો, ત્યારે સરવાળો હંમેશા બરાબર 180° હશે। આ મૂળભૂત ગુણધર્મ ભૂમિતિમાં ત્રિકોણો સાથે સંબંધિત સમસ્યાઓ હલ કરવા માટે વ્યાપક રીતે ઉપયોગમાં લેવાય છે।',
    totalSum: 'કુલ સરવાળો',
    angleA: 'કોણ A',
    angleB: 'કોણ B',
    angleC: 'કોણ C'
  }
};

// Practice exercises
const practiceExercises: PracticeExercise[] = [
  {
    id: 'ex1',
    type: 'calculation',
    difficulty: 'beginner',
    question: 'If two angles of a triangle are 60° and 70°, what is the third angle?',
    data: { angles: [60, 70] },
    correctAnswer: 50,
    hint: 'The sum of all three angles in a triangle is 180°. Subtract the given angles from 180° to find the third angle.',
    translations: {
      gu: {
        question: 'જો ત્રિકોણના બે કોણો 60° અને 70° હોય, તો ત્રીજો કોણ શું છે?',
        hint: 'ત્રિકોણમાં તમામ ત્રણ કોણોનો સરવાળો 180° છે। ત્રીજો કોણ શોધવા માટે આપેલા કોણોને 180° માંથી બાદ કરો।'
      },
      hi: {
        question: 'यदि त्रिभुज के दो कोण 60° और 70° हैं, तो तीसरा कोण क्या है?',
        hint: 'त्रिभुज में सभी तीन कोणों का योग 180° है। तीसरा कोण ज्ञात करने के लिए दिए गए कोणों को 180° में से घटाएं।'
      }
    }
  },
  {
    id: 'ex2',
    type: 'verification',
    difficulty: 'intermediate',
    question: 'Verify that a triangle with angles 45°, 60°, and 75° satisfies the angle sum theorem.',
    data: { angles: [45, 60, 75] },
    correctAnswer: 180,
    hint: 'Add all three angles: 45° + 60° + 75° = 180°. This confirms the angle sum theorem.',
    translations: {
      gu: {
        question: 'ચકાસો કે 45°, 60°, અને 75° કોણોવાળો ત્રિકોણ કોણ સરવાળો પ્રમેયને સંતુષ્ટ કરે છે।',
        hint: 'તમામ ત્રણ કોણો ઉમેરો: 45° + 60° + 75° = 180°। આ કોણ સરવાળો પ્રમેયની પુષ્ટિ કરે છે।'
      },
      hi: {
        question: 'सत्यापित करें कि 45°, 60°, और 75° कोणों वाला त्रिभुज कोण योग प्रमेय को संतुष्ट करता है।',
        hint: 'सभी तीन कोणों को जोड़ें: 45° + 60° + 75° = 180°। यह कोण योग प्रमेय की पुष्टि करता है।'
      }
    }
  },
  {
    id: 'ex3',
    type: 'calculation',
    difficulty: 'advanced',
    question: 'In a right triangle, one acute angle is 30°. What is the measure of the other acute angle?',
    data: { rightAngle: 90, acuteAngle: 30 },
    correctAnswer: 60,
    hint: 'In a right triangle, the sum of the two acute angles is 90°. So if one acute angle is 30°, the other is 90° - 30° = 60°.',
    translations: {
      gu: {
        question: 'સમકોણ ત્રિકોણમાં, એક તીવ્ર કોણ 30° છે। બીજા તીવ્ર કોણનું માપ શું છે?',
        hint: 'સમકોણ ત્રિકોણમાં, બે તીવ્ર કોણોનો સરવાળો 90° છે। તેથી જો એક તીવ્ર કોણ 30° છે, તો બીજો 90° - 30° = 60° છે।'
      },
      hi: {
        question: 'समकोण त्रिभुज में, एक न्यून कोण 30° है। दूसरे न्यून कोण का माप क्या है?',
        hint: 'समकोण त्रिभुज में, दो न्यून कोणों का योग 90° है। तो यदि एक न्यून कोण 30° है, तो दूसरा 90° - 30° = 60° है।'
      }
    }
  }
];

const TriangleAngleSumTool: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<'demonstration' | 'practice' | 'realworld'>('demonstration');
  const [language, setLanguage] = useState<'en' | 'hi' | 'gu'>(() => {
    const savedLanguage = localStorage.getItem('ch6-6-5-language');
    return (savedLanguage as 'en' | 'hi' | 'gu') || 'en';
  });
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [studentAnswer, setStudentAnswer] = useState<string>('');
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [triangle, setTriangle] = useState<Triangle>({
    A: { x: 200, y: 100 },
    B: { x: 100, y: 200 },
    C: { x: 300, y: 200 }
  });


  const t = translations[language];

  // Handle language change and save to localStorage
  const handleLanguageChange = (newLanguage: 'en' | 'hi' | 'gu') => {
    setLanguage(newLanguage);
    localStorage.setItem('ch6-6-5-language', newLanguage);
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

    if (isCorrect) {
      setFeedback(t.correct);
      
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
    }
  };

  const calculateAngle = (p1: Point, p2: Point, p3: Point): number => {
    const v1 = { x: p1.x - p2.x, y: p1.y - p2.y };
    const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };
    const dot = v1.x * v2.x + v1.y * v2.y;
    const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
    const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
    const angle = Math.acos(dot / (mag1 * mag2));
    return (angle * 180) / Math.PI;
  };

  const getInteriorAngles = () => {
    const angleA = calculateAngle(triangle.C, triangle.A, triangle.B);
    const angleB = calculateAngle(triangle.A, triangle.B, triangle.C);
    const angleC = calculateAngle(triangle.B, triangle.C, triangle.A);
    return { A: angleA, B: angleB, C: angleC };
  };

  const getAngleSum = () => {
    const angles = getInteriorAngles();
    return angles.A + angles.B + angles.C;
  };

  const handleMouseDown = (vertex: keyof Triangle, e: React.MouseEvent) => {
    const startX = e.clientX;
    const startY = e.clientY;
    const startPoint = triangle[vertex];

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      setTriangle(prev => ({
        ...prev,
        [vertex]: {
          x: startPoint.x + deltaX,
          y: startPoint.y + deltaY
        }
      }));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };







  const renderTriangle = () => {
    const interiorAngles = getInteriorAngles();
    const angleSum = getAngleSum();

    return (
      <svg width="400" height="300" className="border border-gray-300 rounded-lg bg-gray-50">
        {/* Triangle sides */}
        <line
          x1={triangle.A.x}
          y1={triangle.A.y}
          x2={triangle.B.x}
          y2={triangle.B.y}
          stroke="#3b82f6"
          strokeWidth="3"
        />
        <line
          x1={triangle.B.x}
          y1={triangle.B.y}
          x2={triangle.C.x}
          y2={triangle.C.y}
          stroke="#3b82f6"
          strokeWidth="3"
        />
        <line
          x1={triangle.C.x}
          y1={triangle.C.y}
          x2={triangle.A.x}
          y2={triangle.A.y}
          stroke="#3b82f6"
          strokeWidth="3"
        />

        {/* Angle arcs */}
        <>
          <path
            d={`M ${triangle.C.x} ${triangle.C.y} A 20 20 0 0 1 ${triangle.C.x + 20} ${triangle.C.y - 10} L ${triangle.C.x} ${triangle.C.y}`}
            fill="none"
            stroke="#22c55e"
            strokeWidth="2"
          />
          <path
            d={`M ${triangle.A.x} ${triangle.A.y} A 20 20 0 0 1 ${triangle.A.x - 20} ${triangle.A.y + 10} L ${triangle.A.x} ${triangle.A.y}`}
            fill="none"
            stroke="#22c55e"
            strokeWidth="2"
          />
          <path
            d={`M ${triangle.B.x} ${triangle.B.y} A 20 20 0 0 1 ${triangle.B.x + 20} ${triangle.B.y + 10} L ${triangle.B.x} ${triangle.B.y}`}
            fill="none"
            stroke="#22c55e"
            strokeWidth="2"
          />
        </>

        {/* Vertices */}
        <circle
          cx={triangle.A.x}
          cy={triangle.A.y}
          r="8"
          fill="#3b82f6"
          className="cursor-move"
          onMouseDown={(e) => handleMouseDown('A', e)}
        />
        <circle
          cx={triangle.B.x}
          cy={triangle.B.y}
          r="8"
          fill="#3b82f6"
          className="cursor-move"
          onMouseDown={(e) => handleMouseDown('B', e)}
        />
        <circle
          cx={triangle.C.x}
          cy={triangle.C.y}
          r="8"
          fill="#3b82f6"
          className="cursor-move"
          onMouseDown={(e) => handleMouseDown('C', e)}
        />

        {/* Labels */}
        <text x={triangle.A.x + 15} y={triangle.A.y - 10} className="text-lg font-bold fill-gray-700">A</text>
        <text x={triangle.B.x - 25} y={triangle.B.y + 5} className="text-lg font-bold fill-gray-700">B</text>
        <text x={triangle.C.x + 15} y={triangle.C.y + 5} className="text-lg font-bold fill-gray-700">C</text>

        {/* Angle measurements */}
        <>
          <text x={triangle.C.x + 25} y={triangle.C.y - 15} className="text-sm fill-green-600 font-medium">
            {interiorAngles.C.toFixed(1)}°
          </text>
          <text x={triangle.A.x - 35} y={triangle.A.y + 20} className="text-sm fill-green-600 font-medium">
            {interiorAngles.A.toFixed(1)}°
          </text>
          <text x={triangle.B.x + 25} y={triangle.B.y + 20} className="text-sm fill-green-600 font-medium">
            {interiorAngles.B.toFixed(1)}°
          </text>
        </>

        {/* Angle sum display */}
        <text x="200" y="280" className="text-lg fill-blue-600 font-bold text-center">
          ∠A + ∠B + ∠C = {angleSum.toFixed(1)}°
        </text>
      </svg>
    );
  };

  const renderPracticeMode = () => {
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
                <div className="flex justify-center gap-4">
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
                  <div className="flex justify-center mb-4">
            {renderTriangle()}
          </div>
          
                <div className="text-center">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-green-50 p-3 rounded-lg">
                        <h5 className="font-semibold text-green-800 mb-2">{t.interiorElements}</h5>
                        <div className="space-y-1">
                          <p>∠A = {getInteriorAngles().A.toFixed(1)}°</p>
                          <p>∠B = {getInteriorAngles().B.toFixed(1)}°</p>
                          <p>∠C = {getInteriorAngles().C.toFixed(1)}°</p>
                        </div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <h5 className="font-semibold text-blue-800 mb-2">{t.exteriorElements}</h5>
                        <div className="space-y-1">
                          <p className="font-medium">∠A + ∠B + ∠C = {getAngleSum().toFixed(1)}°</p>
                          <p className="text-green-600 font-medium">≈ 180° ✓</p>
                </div>
                </div>
                </div>
              </div>
            </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // AngleSumProperty component state
  const [currentAngle, setCurrentAngle] = useState<number>(0);
  const [showAngles, setShowAngles] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // Angle measurements
  const angleA = 60;
  const angleB = 50;
  const angleC = 70;

  // Triangle vertices
  const trianglePoints = "400,150 250,450 550,450";

  const handleShowAngles = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setShowAngles(true);
    setCurrentAngle(0);

    // Show angles one by one automatically
    setTimeout(() => setCurrentAngle(1), 100);
    setTimeout(() => setCurrentAngle(2), 1000);
    setTimeout(() => {
      setCurrentAngle(3);
      setIsAnimating(false);
    }, 2000);
  };

  const handleReset = () => {
    setShowAngles(false);
    setCurrentAngle(0);
    setIsAnimating(false);
  };

  const renderAngleSumProperty = () => {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-indigo-900 mb-2">
            {t.angleSumPropertyTitle}
          </h1>
        </div>

        {/* Main Canvas */}
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <svg width="100%" height="550" viewBox="0 0 800 550" className="overflow-visible">
            <defs>
              <linearGradient id="triangleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#6366f1', stopOpacity: 0.2 }} />
                <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 0.2 }} />
              </linearGradient>
            </defs>

            {/* Main Triangle */}
            <polygon
              points={trianglePoints}
              fill="url(#triangleGrad)"
              stroke="#4f46e5"
              strokeWidth="4"
            />

            {/* Vertex labels */}
            <text x="400" y="135" textAnchor="middle" className="text-3xl font-bold fill-indigo-900">A</text>
            <text x="235" y="475" textAnchor="middle" className="text-3xl font-bold fill-indigo-900">B</text>
            <text x="565" y="475" textAnchor="middle" className="text-3xl font-bold fill-indigo-900">C</text>

            {/* Angle A (Red) - at top vertex */}
            {(currentAngle >= 1) && (
              <g className="animate-fadeIn">
                <path
                  d="M 400 150 L 375 185 A 30 30 0 0 0 425 185 Z"
                  fill="#ef4444"
                  opacity="0.7"
                  stroke="#dc2626"
                  strokeWidth="3"
                />
                <text x="400" y="205" textAnchor="middle" className="text-2xl font-bold fill-white">
                  {angleA}°
                </text>
              </g>
            )}

            {/* Angle B (Green) - at bottom left vertex */}
            {(currentAngle >= 2) && (
              <g className="animate-fadeIn">
                <path
                  d="M 250 450 L 320 420 A 80 80 0 0 0 280 380 Z"
                  fill="#10b981"
                  opacity="0.7"
                  stroke="#059669"
                  strokeWidth="3"
                />
                <text x="300" y="400" textAnchor="middle" className="text-2xl font-bold fill-white">
                  {angleB}°
                </text>
              </g>
            )}

            {/* Angle C (Blue) - at bottom right vertex */}
            {(currentAngle >= 3) && (
              <g className="animate-fadeIn">
                <path
                  d="M 550 450 L 520 375 A 75 75 0 0 0 495 425 Z"
                  fill="#3b82f6"
                  opacity="0.7"
                  stroke="#2563eb"
                  strokeWidth="3"
                />
                <text x="515" y="415" textAnchor="middle" className="text-2xl font-bold fill-white">
                  {angleC}°
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* Total Sum Display - Outside and below the triangle */}
        {currentAngle === 3 && (
          <div className="animate-fadeIn flex justify-center mt-6">
            <div className="bg-blue-100 border-4 border-blue-600 rounded-xl px-8 py-6 shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-900 mb-2">
                  {t.totalSum}
                </div>
                <div className="text-3xl font-bold text-blue-700">
                  {angleA}° + {angleB}° + {angleC}° = {angleA + angleB + angleC}°
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleShowAngles}
            disabled={isAnimating}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-8 py-3 rounded-lg font-semibold shadow-lg transition-all transform hover:scale-105 disabled:scale-100"
          >
            <Eye className="w-5 h-5" />
            {isAnimating ? t.showingAngles : t.showAngles}
          </button>
          
          <button
            onClick={handleReset}
            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg transition-all transform hover:scale-105"
          >
            <RotateCcw className="w-5 h-5" />
            {t.reset}
          </button>
        </div>

        {/* Definition and Explanation */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-indigo-900 mb-4">
            {t.whatIsAngleSumProperty}
          </h2>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            <span className="font-bold text-indigo-700">{t.angleSumPropertyDefinition}</span>
          </p>
        </div>
      </div>
    );
  };

  const renderDemonstrationMode = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-5xl mx-auto">
          {renderAngleSumProperty()}
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
                  <polygon points="50,20 20,60 80,60" fill="#E5E7EB" stroke="#14b8a6" strokeWidth="2"/>
                  <line x1="50" y1="20" x2="50" y2="60" stroke="#ef4444" strokeWidth="2" strokeDasharray="3,3"/>
                  <text x="45" y="15" className="text-xs font-bold fill-teal-600">Roof Design</text>
                </svg>
              </div>
            </div>
          </div>

          {/* Engineering */}
          <div className="application-card bg-white rounded-3xl shadow-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-purple-200">
            <div className="text-center">
              <div className="text-6xl mb-4">⚙️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{t.navigation}</h3>
              <p className="text-gray-600 mb-4">
                {t.navigationDesc}
              </p>
              <div className="bg-purple-50 p-4 rounded-xl">
                <svg width="100" height="80" viewBox="0 0 100 80" className="mx-auto">
                  <rect x="20" y="30" width="60" height="40" fill="#F3E8FF" stroke="#a855f7" strokeWidth="2"/>
                  <polygon points="30,20 50,10 70,20" fill="#E0E7FF" stroke="#7c3aed" strokeWidth="2"/>
                  <text x="45" y="15" className="text-xs font-bold fill-purple-600">Truss Design</text>
                </svg>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="application-card bg-white rounded-3xl shadow-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-indigo-200">
            <div className="text-center">
              <div className="text-6xl mb-4">🧭</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{t.engineering}</h3>
              <p className="text-gray-600 mb-4">
                {t.engineeringDesc}
              </p>
              <div className="bg-indigo-50 p-4 rounded-xl">
                <svg width="100" height="80" viewBox="0 0 100 80" className="mx-auto">
                  <circle cx="50" cy="40" r="25" fill="#E0E7FF" stroke="#6366F1" strokeWidth="2"/>
                  <polygon points="50,20 40,35 60,35" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2"/>
                  <text x="45" y="15" className="text-xs font-bold fill-indigo-600">GPS</text>
                </svg>
              </div>
            </div>
          </div>
          
          {/* Surveying */}
          <div className="application-card bg-white rounded-3xl shadow-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-pink-200">
            <div className="text-center">
              <div className="text-6xl mb-4">📐</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{t.artDesign}</h3>
              <p className="text-gray-600 mb-4">
                {t.artDesignDesc}
              </p>
              <div className="bg-pink-50 p-4 rounded-xl">
                <svg width="100" height="80" viewBox="0 0 100 80" className="mx-auto">
                  <rect x="30" y="20" width="40" height="40" fill="#FCE7F3" stroke="#EC4899" strokeWidth="2"/>
                  <polygon points="50,10 30,30 70,30" fill="#FDF2F8" stroke="#DB2777" strokeWidth="2"/>
                  <text x="45" y="75" className="text-xs font-bold fill-pink-600">Surveying</text>
                </svg>
              </div>
            </div>
          </div>
          
          {/* Computer Graphics */}
          <div className="application-card bg-white rounded-3xl shadow-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-emerald-200">
            <div className="text-center">
              <div className="text-6xl mb-4">💻</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{t.surveying}</h3>
              <p className="text-gray-600 mb-4">
                {t.surveyingDesc}
              </p>
              <div className="bg-emerald-50 p-4 rounded-xl">
                <svg width="100" height="80" viewBox="0 0 100 80" className="mx-auto">
                  <rect x="20" y="30" width="60" height="40" fill="#D1FAE5" stroke="#10B981" strokeWidth="2"/>
                  <polygon points="30,20 50,10 70,20" fill="#A7F3D0" stroke="#059669" strokeWidth="2"/>
                  <text x="45" y="75" className="text-xs font-bold fill-emerald-600">3D Modeling</text>
                </svg>
              </div>
            </div>
          </div>
          
          {/* Art & Design */}
          <div className="application-card bg-white rounded-3xl shadow-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-cyan-200">
            <div className="text-center">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{t.computerGraphics}</h3>
              <p className="text-gray-600 mb-4">
                {t.computerGraphicsDesc}
              </p>
              <div className="bg-cyan-50 p-4 rounded-xl">
                <svg width="100" height="80" viewBox="0 0 100 80" className="mx-auto">
                  <polygon points="50,20 20,50 50,80 80,50" fill="#E0F2FE" stroke="#06B6D4" strokeWidth="2"/>
                  <circle cx="50" cy="50" r="15" fill="#FDF2F8" stroke="#DB2777" strokeWidth="2"/>
                  <text x="45" y="15" className="text-xs font-bold fill-cyan-600">Art Design</text>
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

      {/* CSS Animation Styles */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TriangleAngleSumTool;
