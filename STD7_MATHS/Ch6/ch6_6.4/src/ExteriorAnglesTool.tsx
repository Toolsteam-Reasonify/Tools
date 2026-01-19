import React, { useState, useEffect } from 'react';
import { Lightbulb, CheckCircle, XCircle } from 'lucide-react';

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
    skip: 'Skip',
    hint: 'Hint',
    learning: 'Learn',
    practice: 'Practice',
    overview: 'Overview',
    practiceComplete: 'Practice Complete!',
    congratulations: 'Congratulations!',
    youHaveCompleted: 'You have completed all practice exercises.',
    totalExercises: 'Total Exercises',
    correctAnswers: 'Correct Answers',
    accuracy: 'Accuracy',
    overviewTitle: 'Practice Overview',
    backToLearning: 'Back to Learning',
    retryPractice: 'Retry Practice',
    selectLanguage: 'Select Language',
    chapterTitle: 'Exterior Angles of Triangles',
    topicTitle: 'Understanding Exterior Angles',
    whatIsTopic: 'What are Exterior Angles?',
    practiceExercises: 'Practice Exercises',
    yourProgress: 'Your Progress',
    avgTime: 'Avg Time',
    excellent: 'Excellent!',
    goodJob: 'Good Job!',
    keepTrying: 'Keep Trying!',
    realWorldApplications: 'Real World',
    definition: 'Exterior Angle Definition',
    definitionText: 'An exterior angle is formed when one side of a triangle is extended beyond a vertex. For example, in triangle ABC, if side BC is extended to point D, the angle ACD formed at vertex C is an exterior angle.',
    keyComponents: 'Key Components',
    keyComponentsText: 'The exterior angle (∠ACD) has an adjacent interior angle (∠BCA). The other two angles of the triangle (∠A and ∠B) are called interior opposite angles or remote interior angles.',
    keyProperty: 'The Exterior Angle Property',
    keyPropertyText: 'The measure of any exterior angle of a triangle equals the sum of its two interior opposite angles. Mathematically: m∠ACD = m∠A + m∠B',
    justification: 'How It\'s Justified',
    justificationText: 'The property is proven by drawing a line through vertex C parallel to side BA. Using properties of parallel lines and transversals (alternate angles and corresponding angles), it can be shown that the exterior angle equals the sum of the two non-adjacent interior angles.',
    practicalApplications: 'Practical Applications',
    practicalApplicationsText: 'This property helps solve problems where you need to find unknown angles. For instance, if an exterior angle is 140° and one interior opposite angle is 80°, the other interior opposite angle can be found as: x = 140° - 80° = 60°',
    visualization: 'Triangle Visualization',
    interiorElements: 'Interior Angles',
    exteriorElements: 'Exterior Angles',
    triangleOf: 'Triangle',
    of: 'of',
    yourAnswer: 'Your Answer',
    enterAnswer: 'Enter your answer...',
    architecture: 'Architecture',
    architectureDesc: 'Architects use exterior angles to design roof slopes and ensure structural stability in buildings.',
    navigation: 'Engineering',
    navigationDesc: 'Engineers apply exterior angle principles in truss design and load distribution calculations.',
    engineering: 'Navigation',
    engineeringDesc: 'Navigation systems use exterior angles for triangulation and positioning calculations.',
    artDesign: 'Surveying',
    artDesignDesc: 'Surveyors use exterior angle measurements to verify land boundaries and create accurate maps.',
    surveying: 'Computer Graphics',
    surveyingDesc: '3D modeling software uses exterior angles to create realistic lighting and shadow effects.',
    computerGraphics: 'Art & Design',
    computerGraphicsDesc: 'Artists use exterior angle concepts to create perspective drawings and architectural illustrations.',
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
    dragVerticesInstruction: 'Drag the vertices to explore exterior angles',
    mathematicalExample: 'Mathematical Example',
    given: 'Given',
    find: 'Find',
    exteriorAngleGiven: 'Exterior angle = 140°',
    interiorAngleGiven: 'One interior opposite angle = 80°',
    findOtherAngle: 'Other interior opposite angle'
  },
  hi: {
    correct: 'सही!',
    incorrect: 'फिर कोशिश करें!',
    next: 'अगला',
    previous: 'पिछला',
    submit: 'जमा करें',
    skip: 'छोड़ें',
    hint: 'संकेत',
    learning: 'सीखें',
    practice: 'अभ्यास',
    overview: 'अवलोकन',
    practiceComplete: 'अभ्यास पूरा!',
    congratulations: 'बधाई हो!',
    youHaveCompleted: 'आपने सभी अभ्यास अभ्यास पूरे कर लिए हैं।',
    totalExercises: 'कुल अभ्यास',
    correctAnswers: 'सही उत्तर',
    accuracy: 'सटीकता',
    overviewTitle: 'अभ्यास अवलोकन',
    backToLearning: 'सीखने पर वापस जाएं',
    retryPractice: 'अभ्यास दोहराएं',
    selectLanguage: 'भाषा चुनें',
    chapterTitle: 'त्रिभुज के बाह्य कोण',
    topicTitle: 'बाह्य कोणों की समझ',
    whatIsTopic: 'बाह्य कोण क्या हैं?',
    practiceExercises: 'अभ्यास अभ्यास',
    yourProgress: 'आपकी प्रगति',
    avgTime: 'औसत समय',
    excellent: 'उत्कृष्ट!',
    goodJob: 'अच्छा काम!',
    keepTrying: 'कोशिश करते रहें!',
    realWorldApplications: 'वास्तविक दुनिया',
    definition: 'बाह्य कोण की परिभाषा',
    definitionText: 'बाह्य कोण तब बनता है जब त्रिभुज की एक भुजा को शीर्ष से आगे बढ़ाया जाता है। उदाहरण के लिए, त्रिभुज ABC में, यदि भुजा BC को बिंदु D तक बढ़ाया जाए, तो शीर्ष C पर बना कोण ACD एक बाह्य कोण है।',
    keyComponents: 'मुख्य घटक',
    keyComponentsText: 'बाह्य कोण (∠ACD) का एक आसन्न आंतरिक कोण (∠BCA) होता है। त्रिभुज के अन्य दो कोण (∠A और ∠B) को आंतरिक विपरीत कोण या दूरस्थ आंतरिक कोण कहा जाता है।',
    keyProperty: 'बाह्य कोण गुणधर्म',
    keyPropertyText: 'त्रिभुज के किसी भी बाह्य कोण का माप उसके दो आंतरिक विपरीत कोणों के योग के बराबर होता है। गणितीय रूप से: m∠ACD = m∠A + m∠B',
    justification: 'इसकी पुष्टि कैसे होती है',
    justificationText: 'इस गुणधर्म को शीर्ष C से भुजा BA के समानांतर एक रेखा खींचकर सिद्ध किया जाता है। समानांतर रेखाओं और तिर्यक रेखाओं के गुणधर्मों (एकांतर कोण और संगत कोण) का उपयोग करके, यह दिखाया जा सकता है कि बाह्य कोण दो गैर-आसन्न आंतरिक कोणों के योग के बराबर होता है।',
    practicalApplications: 'व्यावहारिक अनुप्रयोग',
    practicalApplicationsText: 'यह गुणधर्म उन समस्याओं को हल करने में मदद करता है जहाँ आपको अज्ञात कोण ज्ञात करने की आवश्यकता होती है। उदाहरण के लिए, यदि एक बाह्य कोण 140° है और एक आंतरिक विपरीत कोण 80° है, तो दूसरा आंतरिक विपरीत कोण इस प्रकार ज्ञात किया जा सकता है: x = 140° - 80° = 60°',
    importantRule: 'प्रक्रिया',
    importantRuleText: 'बाह्य कोण ज्ञात करने के लिए, त्रिभुज की एक भुजा को बढ़ाएं और विस्तारित भुजा और आसन्न भुजा के बीच के कोण को मापें।',
    sumProperty: 'उदाहरण',
    sumPropertyText: 'किसी भी त्रिभुज में, किसी भी शीर्ष पर बाह्य कोण अन्य शीर्षों पर दो आंतरिक कोणों के योग के बराबर होता है।',
    visualization: 'त्रिभुज दृश्यीकरण',
    interiorElements: 'आंतरिक कोण',
    exteriorElements: 'बाह्य कोण',
    triangleOf: 'त्रिभुज',
    of: 'का',
    yourAnswer: 'आपका उत्तर',
    enterAnswer: 'अपना उत्तर दर्ज करें...',
    architecture: 'स्थापत्य',
    architectureDesc: 'स्थापत्यकार छत की ढलान डिजाइन करने और इमारतों में संरचनात्मक स्थिरता सुनिश्चित करने के लिए बाह्य कोणों का उपयोग करते हैं।',
    navigation: 'इंजीनियरिंग',
    navigationDesc: 'इंजीनियर ट्रस डिजाइन और भार वितरण गणना में बाह्य कोण सिद्धांतों को लागू करते हैं।',
    engineering: 'नेविगेशन',
    engineeringDesc: 'नेविगेशन सिस्टम त्रिकोणीकरण और स्थिति निर्धारण गणना के लिए बाह्य कोणों का उपयोग करते हैं।',
    artDesign: 'सर्वेक्षण',
    artDesignDesc: 'सर्वेक्षक भूमि सीमाओं को सत्यापित करने और सटीक मानचित्र बनाने के लिए बाह्य कोण मापों का उपयोग करते हैं।',
    surveying: 'कंप्यूटर ग्राफिक्स',
    surveyingDesc: '3D मॉडलिंग सॉफ्टवेयर यथार्थवादी प्रकाश और छाया प्रभाव बनाने के लिए बाह्य कोणों का उपयोग करता है।',
    computerGraphics: 'कला और डिजाइन',
    computerGraphicsDesc: 'कलाकार परिप्रेक्ष्य चित्र और स्थापत्य चित्रण बनाने के लिए बाह्य कोण अवधारणाओं का उपयोग करते हैं।',
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
    dragVerticesInstruction: 'बाह्य कोणों का अन्वेषण करने के लिए शीर्षों को खींचें',
    mathematicalExample: 'गणितीय उदाहरण',
    given: 'दिया गया',
    find: 'ज्ञात करें',
    exteriorAngleGiven: 'बाह्य कोण = 140°',
    interiorAngleGiven: 'एक आंतरिक विपरीत कोण = 80°',
    findOtherAngle: 'दूसरा आंतरिक विपरीत कोण'
  },
  gu: {
    correct: 'સાચું!',
    incorrect: 'ફરી કોશિશ કરો!',
    next: 'આગળ',
    previous: 'પાછળ',
    submit: 'જમા કરો',
    skip: 'છોડો',
    hint: 'સંકેત',
    learning: 'શીખો',
    practice: 'અભ્યાસ',
    overview: 'અવલોકન',
    practiceComplete: 'અભ્યાસ પૂર્ણ!',
    congratulations: 'અભિનંદન!',
    youHaveCompleted: 'તમે બધા અભ્યાસ કસરતો પૂર્ણ કરી લીધી છે.',
    totalExercises: 'કુલ અભ્યાસ',
    correctAnswers: 'સાચા જવાબો',
    accuracy: 'ચોકસાઈ',
    overviewTitle: 'અભ્યાસ અવલોકન',
    backToLearning: 'શીખવા પર પાછા જાઓ',
    retryPractice: 'અભ્યાસ ફરીથી કરો',
    selectLanguage: 'ભાષા પસંદ કરો',
    chapterTitle: 'ત્રિકોણના બાહ્ય કોણો',
    topicTitle: 'બાહ્ય કોણોની સમજ',
    whatIsTopic: 'બાહ્ય કોણો શું છે?',
    practiceExercises: 'અભ્યાસ કસરતો',
    yourProgress: 'તમારી પ્રગતિ',
    avgTime: 'સરેરાશ સમય',
    excellent: 'ઉત્તમ!',
    goodJob: 'સારું કામ!',
    keepTrying: 'કોશિશ કરતા રહો!',
    realWorldApplications: 'વાસ્તવિક વિશ્વ',
    definition: 'બાહ્ય કોણની વ્યાખ્યા',
    definitionText: 'બાહ્ય કોણ ત્યારે બને છે જ્યારે ત્રિકોણની એક બાજુને શિરોબિંદુથી આગળ વિસ્તારવામાં આવે છે. ઉદાહરણ તરીકે, ત્રિકોણ ABC માં, જો બાજુ BC ને બિંદુ D સુધી વિસ્તારવામાં આવે, તો શિરોબિંદુ C પર બનેલો કોણ ACD એક બાહ્ય કોણ છે.',
    keyComponents: 'મુખ્ય ઘટકો',
    keyComponentsText: 'બાહ્ય કોણ (∠ACD) નો એક સંલગ્ન આંતરિક કોણ (∠BCA) હોય છે. ત્રિકોણના અન્ય બે કોણો (∠A અને ∠B) ને આંતરિક વિરુદ્ધ કોણો અથવા દૂરસ્થ આંતરિક કોણો કહેવામાં આવે છે.',
    keyProperty: 'બાહ્ય કોણ ગુણધર્મ',
    keyPropertyText: 'ત્રિકોણના કોઈપણ બાહ્ય કોણનું માપ તેના બે આંતરિક વિરુદ્ધ કોણોના સરવાળા જેટલું હોય છે. ગણિતીય રીતે: m∠ACD = m∠A + m∠B',
    justification: 'આની પુષ્ટિ કેવી રીતે થાય છે',
    justificationText: 'આ ગુણધર્મને શિરોબિંદુ C થી બાજુ BA ને સમાંતર એક રેખા દોરીને સિદ્ધ કરવામાં આવે છે. સમાંતર રેખાઓ અને તિર્યક રેખાઓના ગુણધર્મો (વૈકલ્પિક કોણો અને સંગત કોણો) નો ઉપયોગ કરીને, તે બતાવી શકાય છે કે બાહ્ય કોણ બે બિન-સંલગ્ન આંતરિક કોણોના સરવાળા જેટલો હોય છે.',
    practicalApplications: 'વ્યવહારિક ઉપયોગો',
    practicalApplicationsText: 'આ ગુણધર્મ તે સમસ્યાઓને હલ કરવામાં મદદ કરે છે જ્યાં તમારે અજ્ઞાત કોણો શોધવાની જરૂર હોય છે. ઉદાહરણ તરીકે, જો એક બાહ્ય કોણ 140° છે અને એક આંતરિક વિરુદ્ધ કોણ 80° છે, તો બીજો આંતરિક વિરુદ્ધ કોણ આ રીતે શોધી શકાય છે: x = 140° - 80° = 60°',
    importantRule: 'પ્રક્રિયા',
    importantRuleText: 'બાહ્ય કોણ શોધવા માટે, ત્રિકોણની એક બાજુને વિસ્તારો અને વિસ્તૃત બાજુ અને સંલગ્ન બાજુ વચ્ચેના કોણને માપો।',
    sumProperty: 'ઉદાહરણો',
    sumPropertyText: 'કોઈપણ ત્રિકોણમાં, કોઈપણ શિરોબિંદુ પર બાહ્ય કોણ અન્ય શિરોબિંદુઓ પરના બે આંતરિક કોણોના સરવાળા જેટલો હોય છે।',
    visualization: 'ત્રિકોણ દ્રશ્યીકરણ',
    interiorElements: 'આંતરિક કોણો',
    exteriorElements: 'બાહ્ય કોણો',
    triangleOf: 'ત્રિકોણ',
    of: 'નો',
    yourAnswer: 'તમારો જવાબ',
    enterAnswer: 'તમારો જવાબ દાખલ કરો...',
    architecture: 'સ્થાપત્ય',
    architectureDesc: 'સ્થાપત્યકાર છતની ઢાળ ડિઝાઇન કરવા અને ઇમારતોમાં માળખાકીય સ્થિરતા સુનિશ્ચિત કરવા માટે બાહ્ય કોણોનો ઉપયોગ કરે છે।',
    navigation: 'ઇજનેરી',
    navigationDesc: 'ઇજનેરો ટ્રસ ડિઝાઇન અને લોડ વિતરણ ગણતરીઓમાં બાહ્ય કોણ સિદ્ધાંતો લાગુ પાડે છે।',
    engineering: 'નેવિગેશન',
    engineeringDesc: 'નેવિગેશન સિસ્ટમ ત્રિકોણીકરણ અને સ્થિતિ નિર્ધારણ ગણતરીઓ માટે બાહ્ય કોણોનો ઉપયોગ કરે છે।',
    artDesign: 'સર્વેક્ષણ',
    artDesignDesc: 'સર્વેક્ષકો જમીનની સીમાઓને ચકાસવા અને સચોટ નકશા બનાવવા માટે બાહ્ય કોણ માપોનો ઉપયોગ કરે છે।',
    surveying: 'કમ્પ્યુટર ગ્રાફિક્સ',
    surveyingDesc: '3D મોડેલિંગ સોફ્ટવેર યથાર્થવાદી પ્રકાશ અને છાયા પ્રભાવો બનાવવા માટે બાહ્ય કોણોનો ઉપયોગ કરે છે।',
    computerGraphics: 'કલા અને ડિઝાઇન',
    computerGraphicsDesc: 'કલાકારો પરિપ્રેક્ષ્ય ચિત્રો અને સ્થાપત્ય ચિત્રણ બનાવવા માટે બાહ્ય કોણ ખ્યાલોનો ઉપયોગ કરે છે।',
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
    dragVerticesInstruction: 'બાહ્ય ખૂણાઓનું અન્વેષણ કરવા માટે શિરોબિંદુઓને ખેંચો',
    mathematicalExample: 'ગણિતીય ઉદાહરણ',
    given: 'આપેલ',
    find: 'શોધો',
    exteriorAngleGiven: 'બાહ્ય કોણ = 140°',
    interiorAngleGiven: 'એક આંતરિક વિરુદ્ધ કોણ = 80°',
    findOtherAngle: 'બીજો આંતરિક વિરુદ્ધ કોણ'
  }
};

// Practice exercises
const practiceExercises: PracticeExercise[] = [
  {
    id: 'ex1',
    type: 'calculation',
    difficulty: 'beginner',
    question: 'If the interior angles of a triangle are 40°, 80°, and 60°, what is the exterior angle at the vertex with 40°?',
    data: { interiorAngles: [40, 80, 60] },
    correctAnswer: 140,
    hint: 'The exterior angle equals 180° minus the interior angle at that vertex.',
    translations: {
      gu: {
        question: 'જો ત્રિકોણના આંતરિક કોણો 40°, 80°, અને 60° હોય, તો 40° વાળા શિરોબિંદુ પર બાહ્ય કોણ શું છે?',
        hint: 'બાહ્ય કોણ તે શિરોબિંદુ પરના આંતરિક કોણમાંથી 180° બાદ કરવાથી મળે છે।'
      },
      hi: {
        question: 'यदि त्रिभुज के आंतरिक कोण 40°, 80°, और 60° हैं, तो 40° वाले शीर्ष पर बाह्य कोण क्या है?',
        hint: 'बाह्य कोण उस शीर्ष पर आंतरिक कोण में से 180° घटाने पर मिलता है।'
      }
    }
  },
  {
    id: 'ex2',
    type: 'identification',
    difficulty: 'intermediate',
    question: 'In a triangle, if one exterior angle is 100°, what are the possible values of the opposite interior angles?',
    data: { exteriorAngle: 100 },
    correctAnswer: '40° and 60°',
    hint: 'The exterior angle equals the sum of the two opposite interior angles. Since the sum of all interior angles is 180°, the third angle must be 80°.',
    translations: {
      gu: {
        question: 'ત્રિકોણમાં, જો એક બાહ્ય કોણ 100° હોય, તો વિરુદ્ધ આંતરિક કોણોના શક્ય મૂલ્યો શું છે?',
        hint: 'બાહ્ય કોણ બે વિરુદ્ધ આંતરિક કોણોના સરવાળા જેટલો હોય છે। તમામ આંતરિક કોણોનો સરવાળો 180° હોવાથી, ત્રીજો કોણ 80° હોવો જોઈએ।'
      },
      hi: {
        question: 'त्रिभुज में, यदि एक बाह्य कोण 100° है, तो विपरीत आंतरिक कोणों के संभावित मान क्या हैं?',
        hint: 'बाह्य कोण दो विपरीत आंतरिक कोणों के योग के बराबर होता है। चूंकि सभी आंतरिक कोणों का योग 180° है, तीसरा कोण 80° होना चाहिए।'
      }
    }
  },
  {
    id: 'ex3',
    type: 'verification',
    difficulty: 'advanced',
    question: 'Verify the exterior angle theorem: If interior angles are 40°, 80°, and 60°, show that the exterior angle at the 40° vertex equals 80° + 60°.',
    data: { interiorAngles: [40, 80, 60] },
    correctAnswer: 140,
    hint: 'Calculate the exterior angle (180° - 40° = 140°) and verify it equals the sum of the other two interior angles (80° + 60° = 140°).',
    translations: {
      gu: {
        question: 'બાહ્ય કોણ પ્રમેય ચકાસો: જો આંતરિક કોણો 40°, 80°, અને 60° હોય, તો બતાવો કે 40° શિરોબિંદુ પર બાહ્ય કોણ 80° + 60° જેટલો છે।',
        hint: 'બાહ્ય કોણની ગણતરી કરો (180° - 40° = 140°) અને ચકાસો કે તે અન્ય બે આંતરિક કોણોના સરવાળા જેટલો છે (80° + 60° = 140°)।'
      },
      hi: {
        question: 'बाह्य कोण प्रमेय सत्यापित करें: यदि आंतरिक कोण 40°, 80°, और 60° हैं, तो दिखाएं कि 40° शीर्ष पर बाह्य कोण 80° + 60° के बराबर है।',
        hint: 'बाह्य कोण की गणना करें (180° - 40° = 140°) और सत्यापित करें कि यह अन्य दो आंतरिक कोणों के योग के बराबर है (80° + 60° = 140°)।'
      }
    }
  }
];

const ExteriorAnglesTool: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<'demonstration' | 'practice' | 'realworld'>('demonstration');
  const [language, setLanguage] = useState<'en' | 'hi' | 'gu'>(() => {
    const savedLanguage = localStorage.getItem('ch6-6-4-language');
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
    totalExercises: practiceExercises.length,
    correctAnswers: 0,
    skippedExercises: 0,
    completedExercises: 0
  });
  const [triangle, setTriangle] = useState<Triangle>({
    A: { x: 200, y: 100 },
    B: { x: 100, y: 200 },
    C: { x: 300, y: 200 }
  });

  // Fixed interior angles: 40°, 80°, 60°
  const fixedInteriorAngles = { A: 40, B: 80, C: 60 };
  const [showAngles, setShowAngles] = useState(false);
  const [showExteriorAngles, setShowExteriorAngles] = useState(false);

  const t = translations[language];

  // Handle language change and save to localStorage
  const handleLanguageChange = (newLanguage: 'en' | 'hi' | 'gu') => {
    setLanguage(newLanguage);
    localStorage.setItem('ch6-6-4-language', newLanguage);
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


  const getInteriorAngles = () => {
    // Return fixed interior angles: 40°, 80°, 60°
    return fixedInteriorAngles;
  };

  const getExteriorAngles = () => {
    const interiorAngles = getInteriorAngles();
    return {
      A: 180 - interiorAngles.A, // 180 - 40 = 140°
      B: 180 - interiorAngles.B, // 180 - 80 = 100°
      C: 180 - interiorAngles.C  // 180 - 60 = 120°
    };
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
      setPracticeStats(prev => ({
        ...prev,
        correctAnswers: prev.correctAnswers + 1,
        completedExercises: prev.completedExercises + 1
      }));
      
      setTimeout(() => {
        moveToNextExercise();
      }, 1500);
    } else {
      setFeedback(t.incorrect);
      setAttempts(newAttempts);
    }
  };

  const handleSkipExercise = () => {
    setPracticeStats(prev => ({
      ...prev,
      skippedExercises: prev.skippedExercises + 1,
      completedExercises: prev.completedExercises + 1
    }));
    moveToNextExercise();
  };

  const moveToNextExercise = () => {
    if (currentExerciseIndex < practiceExercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    } else {
      setShowOverview(true);
    }
    setStudentAnswer('');
    setFeedback('');
    setShowHint(false);
    setAttempts(0);
  };

  const renderTriangle = () => {
    const interiorAngles = getInteriorAngles();
    const exteriorAngles = getExteriorAngles();


    // Helper function to create arc path
    const createArcPath = (center: Point, radius: number, startAngle: number, endAngle: number) => {
      const start = {
        x: center.x + radius * Math.cos(startAngle * Math.PI / 180),
        y: center.y + radius * Math.sin(startAngle * Math.PI / 180)
      };
      const end = {
        x: center.x + radius * Math.cos(endAngle * Math.PI / 180),
        y: center.y + radius * Math.sin(endAngle * Math.PI / 180)
      };
      
      const largeArcFlag = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
      
      return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
    };


    // Calculate extension points
    // For vertex A, extend along AC edge direction
    const extA = {
      x: triangle.A.x + (triangle.A.x - triangle.C.x) * 0.5,
      y: triangle.A.y + (triangle.A.y - triangle.C.y) * 0.5
    };
    // For vertex B, extend along AB edge direction
    const extB = {
      x: triangle.B.x + (triangle.B.x - triangle.A.x) * 0.5,
      y: triangle.B.y + (triangle.B.y - triangle.A.y) * 0.5
    };
    // For vertex C, extend along BC edge direction
    const extC = {
      x: triangle.C.x + (triangle.C.x - triangle.B.x) * 0.5,
      y: triangle.C.y + (triangle.C.y - triangle.B.y) * 0.5
    };

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

        {/* Exterior angle extensions */}
        {showExteriorAngles && (
          <>
            <line
              x1={triangle.A.x}
              y1={triangle.A.y}
              x2={extA.x}
              y2={extA.y}
              stroke="#ef4444"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <line
              x1={triangle.B.x}
              y1={triangle.B.y}
              x2={extB.x}
              y2={extB.y}
              stroke="#ef4444"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <line
              x1={triangle.C.x}
              y1={triangle.C.y}
              x2={extC.x}
              y2={extC.y}
              stroke="#ef4444"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          </>
        )}

        {/* Interior angle arcs */}
        {showAngles && (
          <>
            {/* Angle at A */}
            <path
              d={createArcPath(triangle.A, 20, 
                Math.atan2(triangle.C.y - triangle.A.y, triangle.C.x - triangle.A.x) * 180 / Math.PI,
                Math.atan2(triangle.B.y - triangle.A.y, triangle.B.x - triangle.A.x) * 180 / Math.PI
              )}
              fill="none"
              stroke="#22c55e"
              strokeWidth="2"
            />
            {/* Angle at B */}
            <path
              d={createArcPath(triangle.B, 20,
                Math.atan2(triangle.A.y - triangle.B.y, triangle.A.x - triangle.B.x) * 180 / Math.PI,
                Math.atan2(triangle.C.y - triangle.B.y, triangle.C.x - triangle.B.x) * 180 / Math.PI
              )}
              fill="none"
              stroke="#22c55e"
              strokeWidth="2"
            />
            {/* Angle at C */}
            <path
              d={createArcPath(triangle.C, 12,
                Math.atan2(triangle.B.y - triangle.C.y, triangle.B.x - triangle.C.x) * 180 / Math.PI,
                Math.atan2(triangle.A.y - triangle.C.y, triangle.A.x - triangle.C.x) * 180 / Math.PI
              )}
              fill="none"
              stroke="#22c55e"
              strokeWidth="2"
            />
          </>
        )}

        {/* Exterior angle arcs */}
        {showExteriorAngles && (
          <>
            {/* Exterior angle at A */}
            <path
              d={createArcPath(triangle.A, 15,
                Math.atan2(triangle.B.y - triangle.A.y, triangle.B.x - triangle.A.x) * 180 / Math.PI,
                Math.atan2(extA.y - triangle.A.y, extA.x - triangle.A.x) * 180 / Math.PI
              )}
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
            />
            {/* Exterior angle at B */}
            <path
              d={createArcPath(triangle.B, 25,
                Math.atan2(triangle.C.y - triangle.B.y, triangle.C.x - triangle.B.x) * 180 / Math.PI,
                Math.atan2(extB.y - triangle.B.y, extB.x - triangle.B.x) * 180 / Math.PI
              )}
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
            />
            {/* Exterior angle at C */}
            <path
              d={createArcPath(triangle.C, 25,
                Math.atan2(triangle.A.y - triangle.C.y, triangle.A.x - triangle.C.x) * 180 / Math.PI,
                Math.atan2(extC.y - triangle.C.y, extC.x - triangle.C.x) * 180 / Math.PI
              )}
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
            />
          </>
        )}

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
        <text x={triangle.C.x - 5} y={triangle.C.y + 20} className="text-lg font-bold fill-gray-700">C</text>

        {/* Angle measurements */}
        {showAngles && (
          <>
            {/* Interior angle labels positioned at arc midpoints */}
            <text 
              x={triangle.A.x + 25 * Math.cos((Math.atan2(triangle.C.y - triangle.A.y, triangle.C.x - triangle.A.x) + Math.atan2(triangle.B.y - triangle.A.y, triangle.B.x - triangle.A.x)) / 2)} 
              y={triangle.A.y + 25 * Math.sin((Math.atan2(triangle.C.y - triangle.A.y, triangle.C.x - triangle.A.x) + Math.atan2(triangle.B.y - triangle.A.y, triangle.B.x - triangle.A.x)) / 2) + 8} 
              className="text-sm fill-green-600 font-medium"
            >
              {Math.round(interiorAngles.A)}°
            </text>
            <text 
              x={triangle.B.x + 25 * Math.cos((Math.atan2(triangle.A.y - triangle.B.y, triangle.A.x - triangle.B.x) + Math.atan2(triangle.C.y - triangle.B.y, triangle.C.x - triangle.B.x)) / 2)} 
              y={triangle.B.y + 25 * Math.sin((Math.atan2(triangle.A.y - triangle.B.y, triangle.A.x - triangle.B.x) + Math.atan2(triangle.C.y - triangle.B.y, triangle.C.x - triangle.B.x)) / 2)} 
              className="text-sm fill-green-600 font-medium"
            >
              {Math.round(interiorAngles.B)}°
            </text>
            <text 
              x={triangle.C.x + 25 * Math.cos((Math.atan2(triangle.B.y - triangle.C.y, triangle.B.x - triangle.C.x) + Math.atan2(triangle.A.y - triangle.C.y, triangle.A.x - triangle.C.x)) / 2) - 80} 
              y={triangle.C.y + 25 * Math.sin((Math.atan2(triangle.B.y - triangle.C.y, triangle.B.x - triangle.C.x) + Math.atan2(triangle.A.y - triangle.C.y, triangle.A.x - triangle.C.x)) / 2) - 15} 
              className="text-sm fill-green-600 font-medium"
            >
              {Math.round(interiorAngles.C)}°
            </text>
          </>
        )}

        {/* Exterior angle measurements */}
        {showExteriorAngles && (
          <>
            {/* Exterior angle labels positioned at arc midpoints */}
            <text 
              x={triangle.A.x + 30 * Math.cos((Math.atan2(triangle.B.y - triangle.A.y, triangle.B.x - triangle.A.x) + Math.atan2(extA.y - triangle.A.y, extA.x - triangle.A.x)) / 2) - 100} 
              y={triangle.A.y + 30 * Math.sin((Math.atan2(triangle.B.y - triangle.A.y, triangle.B.x - triangle.A.x) + Math.atan2(extA.y - triangle.A.y, extA.x - triangle.A.x)) / 2)} 
              className="text-sm fill-red-600 font-medium"
            >
              {Math.round(exteriorAngles.A)}°
            </text>
            <text 
              x={triangle.B.x + 30 * Math.cos((Math.atan2(triangle.C.y - triangle.B.y, triangle.C.x - triangle.B.x) + Math.atan2(extB.y - triangle.B.y, extB.x - triangle.B.x)) / 2)} 
              y={triangle.B.y + 30 * Math.sin((Math.atan2(triangle.C.y - triangle.B.y, triangle.C.x - triangle.B.x) + Math.atan2(extB.y - triangle.B.y, extB.x - triangle.B.x)) / 2) + 8} 
              className="text-sm fill-red-600 font-medium"
            >
              {Math.round(exteriorAngles.B)}°
            </text>
            <text 
              x={triangle.C.x + 30 * Math.cos((Math.atan2(triangle.A.y - triangle.C.y, triangle.A.x - triangle.C.x) + Math.atan2(extC.y - triangle.C.y, extC.x - triangle.C.x)) / 2)} 
              y={triangle.C.y + 30 * Math.sin((Math.atan2(triangle.A.y - triangle.C.y, triangle.A.x - triangle.C.x) + Math.atan2(extC.y - triangle.C.y, extC.x - triangle.C.x)) / 2)} 
              className="text-sm fill-red-600 font-medium"
            >
              {Math.round(exteriorAngles.C)}°
            </text>
          </>
        )}
      </svg>
    );
  };

  const renderDemonstrationMode = () => (
    <div className="space-y-6">
      {/* Interactive Triangle */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-6 md:p-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gradient-teal-purple mb-4">
            📐 {t.visualization}
          </h2>
        </div>

        <div className="flex justify-center mb-6">
          {renderTriangle()}
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setShowAngles(!showAngles)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              showAngles ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {t.interiorElements}
          </button>
          <button
            onClick={() => setShowExteriorAngles(!showExteriorAngles)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              showExteriorAngles ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {t.exteriorElements}
          </button>
        </div>
      </div>
      
      {/* Understanding Exterior Angles Definition Block */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8 max-w-4xl mx-auto">
            {/* Definition */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200 transform transition-all duration-1000 ease-out animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl">📖</span>
                <h3 className="text-2xl font-bold text-blue-800">{t.definition}</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                {t.definitionText}
              </p>
            </div>

            {/* Key Property */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200 transform transition-all duration-1000 ease-out animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl">🔑</span>
                <h3 className="text-2xl font-bold text-purple-800">{t.keyProperty}</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                {t.keyPropertyText}
              </p>
            </div>

            {/* Mathematical Example */}
            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-8 border-2 border-red-200 transform transition-all duration-1000 ease-out animate-fade-in-up" style={{animationDelay: '1.0s'}}>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl">🧮</span>
                <h3 className="text-2xl font-bold text-red-800">{t.mathematicalExample}</h3>
              </div>
              <div className="text-gray-700 leading-relaxed text-lg">
                <p className="mb-4">{t.given}: {t.exteriorAngleGiven}, {t.interiorAngleGiven}</p>
                <p className="mb-4">{t.find}: {t.findOtherAngle}</p>
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <p className="font-mono text-lg font-semibold text-red-600">
                    x = 140° - 80° = 60°
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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

                  <button
                    onClick={handleSkipExercise}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors font-medium shadow-lg hover:scale-105"
                  >
                    <XCircle className="w-5 h-5" />
                    {t.skip}
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
                          <p>∠A = {Math.round(getInteriorAngles().A)}°</p>
                          <p>∠B = {Math.round(getInteriorAngles().B)}°</p>
                          <p>∠C = {Math.round(getInteriorAngles().C)}°</p>
                        </div>
                      </div>
                      <div className="bg-red-50 p-3 rounded-lg">
                        <h5 className="font-semibold text-red-800 mb-2">{t.exteriorElements}</h5>
                        <div className="space-y-1">
                          <p>∠A' = {Math.round(getExteriorAngles().A)}°</p>
                          <p>∠B' = {Math.round(getExteriorAngles().B)}°</p>
                          <p>∠C' = {Math.round(getExteriorAngles().C)}°</p>
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

  const renderOverviewPage = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-8 md:p-12">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-4xl md:text-5xl font-bold text-gradient-teal-purple mb-4">
            {t.congratulations}
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            {t.practiceComplete}
          </p>
          <p className="text-lg text-gray-700">
            {t.youHaveCompleted}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Total Exercises */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200 text-center">
              <div className="text-4xl mb-3">📚</div>
              <h3 className="text-xl font-bold text-blue-800 mb-2">{t.totalExercises}</h3>
              <p className="text-3xl font-bold text-blue-600">{practiceStats.totalExercises}</p>
            </div>

            {/* Correct Answers */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 text-center">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="text-xl font-bold text-green-800 mb-2">{t.correctAnswers}</h3>
              <p className="text-3xl font-bold text-green-600">{practiceStats.correctAnswers}</p>
            </div>

            {/* Accuracy */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200 text-center">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-xl font-bold text-purple-800 mb-2">{t.accuracy}</h3>
              <p className="text-3xl font-bold text-purple-600">
                {practiceStats.totalExercises > 0 
                  ? Math.round((practiceStats.correctAnswers / practiceStats.totalExercises) * 100)
                  : 0}%
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-6">
            <button
              onClick={() => {
                setCurrentMode('demonstration');
                setShowOverview(false);
                setCurrentExerciseIndex(0);
                setPracticeStats({
                  totalExercises: practiceExercises.length,
                  correctAnswers: 0,
                  skippedExercises: 0,
                  completedExercises: 0
                });
              }}
              className="flex items-center gap-3 px-8 py-4 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-colors font-semibold text-lg shadow-lg hover:scale-105"
            >
              <span className="text-2xl">📚</span>
              {t.backToLearning}
            </button>

            <button
              onClick={() => {
                setShowOverview(false);
                setCurrentExerciseIndex(0);
                setPracticeStats({
                  totalExercises: practiceExercises.length,
                  correctAnswers: 0,
                  skippedExercises: 0,
                  completedExercises: 0
                });
              }}
              className="flex items-center gap-3 px-8 py-4 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors font-semibold text-lg shadow-lg hover:scale-105"
            >
              <span className="text-2xl">🔄</span>
              {t.retryPractice}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

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
          {showOverview ? renderOverviewPage() : (
            <>
              {currentMode === 'demonstration' && renderDemonstrationMode()}
              {currentMode === 'practice' && renderPracticeMode()}
              {currentMode === 'realworld' && renderRealWorldApplications()}
            </>
          )}
        </div>

      </main>
    </div>
  );
};

export default ExteriorAnglesTool;