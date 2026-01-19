import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface TriangleInfo {
  id: string;
  name: {
    en: string;
    hi: string;
    gu: string;
  };
  definition: {
    en: string;
    hi: string;
    gu: string;
  };
  properties: {
    en: string[];
    hi: string[];
    gu: string[];
  };
  color: string;
}

const AdvancedExteriorAnglesTool: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<'demonstration' | 'practice' | 'realworld'>('demonstration');
  const [language, setLanguage] = useState<'en' | 'hi' | 'gu'>(() => {
    const savedLanguage = localStorage.getItem('ch6-6-6-language');
    return (savedLanguage as 'en' | 'hi' | 'gu') || 'en';
  });
  const [expandedTriangle, setExpandedTriangle] = useState<string>('equilateral');
  
  // Practice mode state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>(new Array(6).fill(''));
  const [showOverview, setShowOverview] = useState(false);
  const [practiceScore, setPracticeScore] = useState(0);

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
      chapterTitle: 'Advanced Exterior Angles',
      topicTitle: 'Understanding Advanced Exterior Angle Properties',
      whatIsTopic: 'What are Advanced Exterior Angle Properties?',
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
      definition: 'Advanced Exterior Angle Definition',
      definitionText: 'Advanced exterior angle properties involve complex triangle scenarios including different triangle types (acute, right, obtuse, equilateral, isosceles, scalene) and their unique exterior angle characteristics.',
      keyComponents: 'Key Components',
      keyComponentsText: 'Different triangle types have distinct exterior angle patterns. Acute triangles have all exterior angles greater than 90°, right triangles have one exterior angle equal to 90°, and obtuse triangles have one exterior angle less than 90°.',
      keyProperty: 'Advanced Properties',
      keyPropertyText: 'The exterior angle theorem applies universally, but the specific values depend on the triangle type. Equilateral triangles have all exterior angles equal to 120°, while scalene triangles have varying exterior angles.',
      justification: 'Mathematical Proof',
      justificationText: 'The advanced properties are proven through geometric constructions and angle relationships. Each triangle type exhibits unique exterior angle patterns based on its internal angle structure.',
      practicalApplications: 'Advanced Applications',
      practicalApplicationsText: 'These advanced properties are crucial in complex architectural designs, structural engineering, computer graphics, and physics applications where precise angle calculations are required.',
      visualization: 'Advanced Triangle Visualization',
      interiorElements: 'Interior Angles',
      exteriorElements: 'Exterior Angles',
      triangleOf: 'Triangle',
      of: 'of',
      yourAnswer: 'Your Answer',
      enterAnswer: 'Enter your answer...',
      architecture: 'Advanced Architecture',
      architectureDesc: 'Complex roof structures and geodesic domes use advanced exterior angle calculations for optimal structural integrity.',
      navigation: 'Structural Engineering',
      navigationDesc: 'Bridge trusses and space frames rely on exterior angle properties for stability and load distribution.',
      engineering: 'Computer Graphics',
      engineeringDesc: '3D modeling and rendering algorithms use exterior angle calculations for realistic lighting and shadow effects.',
      artDesign: 'Physics & Optics',
      artDesignDesc: 'Light refraction and wave propagation calculations involve exterior angle principles for accurate modeling.',
      surveying: 'Advanced Surveying',
      surveyingDesc: 'Precision surveying instruments use exterior angle calculations for high-accuracy measurements.',
      computerGraphics: 'Mathematical Modeling',
      computerGraphicsDesc: 'Complex mathematical models rely on exterior angle properties for accurate geometric calculations.',
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
      dragVerticesInstruction: 'Drag the vertices to explore advanced exterior angle relationships',
      mathematicalExample: 'Mathematical Example',
      given: 'Given',
      find: 'Find',
      exteriorAngleGiven: 'Equilateral triangle with interior angles 60° each',
      interiorAngleGiven: 'Exterior angle calculation',
      findOtherAngle: 'Exterior angle at each vertex'
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
      chapterTitle: 'उन्नत बाह्य कोण',
      topicTitle: 'उन्नत बाह्य कोण गुणों की समझ',
      whatIsTopic: 'उन्नत बाह्य कोण गुण क्या हैं?',
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
      definition: 'उन्नत बाह्य कोण परिभाषा',
      definitionText: 'उन्नत बाह्य कोण गुणों में जटिल त्रिभुज परिदृश्य शामिल हैं जिनमें विभिन्न त्रिभुज प्रकार (न्यूनकोण, समकोण, अधिककोण, समबाहु, समद्विबाहु, विषमबाहु) और उनके अद्वितीय बाह्य कोण लक्षण शामिल हैं।',
      keyComponents: 'मुख्य घटक',
      keyComponentsText: 'विभिन्न त्रिभुज प्रकारों के अलग-अलग बाह्य कोण पैटर्न होते हैं। न्यूनकोण त्रिभुजों में सभी बाह्य कोण 90° से अधिक होते हैं, समकोण त्रिभुजों में एक बाह्य कोण 90° के बराबर होता है, और अधिककोण त्रिभुजों में एक बाह्य कोण 90° से कम होता है।',
      keyProperty: 'उन्नत गुण',
      keyPropertyText: 'बाह्य कोण प्रमेय सार्वभौमिक रूप से लागू होता है, लेकिन विशिष्ट मान त्रिभुज प्रकार पर निर्भर करते हैं। समबाहु त्रिभुजों में सभी बाह्य कोण 120° के बराबर होते हैं, जबकि विषमबाहु त्रिभुजों में भिन्न बाह्य कोण होते हैं।',
      justification: 'गणितीय प्रमाण',
      justificationText: 'उन्नत गुणों को ज्यामितीय निर्माण और कोण संबंधों के माध्यम से सिद्ध किया जाता है। प्रत्येक त्रिभुज प्रकार अपनी आंतरिक कोण संरचना के आधार पर अद्वितीय बाह्य कोण पैटर्न प्रदर्शित करता है।',
      practicalApplications: 'उन्नत अनुप्रयोग',
      practicalApplicationsText: 'ये उन्नत गुण जटिल स्थापत्य डिजाइन, संरचनात्मक इंजीनियरिंग, कंप्यूटर ग्राफिक्स और भौतिकी अनुप्रयोगों में महत्वपूर्ण हैं जहाँ सटीक कोण गणनाओं की आवश्यकता होती है।',
      visualization: 'उन्नत त्रिभुज दृश्यीकरण',
      interiorElements: 'आंतरिक कोण',
      exteriorElements: 'बाह्य कोण',
      triangleOf: 'त्रिभुज',
      of: 'का',
      yourAnswer: 'आपका उत्तर',
      enterAnswer: 'अपना उत्तर दर्ज करें...',
      architecture: 'उन्नत स्थापत्य',
      architectureDesc: 'जटिल छत संरचनाएं और भूगोलीय गुंबद इष्टतम संरचनात्मक अखंडता के लिए उन्नत बाह्य कोण गणनाओं का उपयोग करते हैं।',
      navigation: 'संरचनात्मक इंजीनियरिंग',
      navigationDesc: 'पुल ट्रस और स्पेस फ्रेम स्थिरता और भार वितरण के लिए बाह्य कोण गुणों पर निर्भर करते हैं।',
      engineering: 'कंप्यूटर ग्राफिक्स',
      engineeringDesc: '3D मॉडलिंग और रेंडरिंग एल्गोरिदम यथार्थवादी प्रकाश और छाया प्रभावों के लिए बाह्य कोण गणनाओं का उपयोग करते हैं।',
      artDesign: 'भौतिकी और प्रकाशिकी',
      artDesignDesc: 'प्रकाश अपवर्तन और तरंग प्रसार गणनाएं सटीक मॉडलिंग के लिए बाह्य कोण सिद्धांतों को शामिल करती हैं।',
      surveying: 'उन्नत सर्वेक्षण',
      surveyingDesc: 'सटीक सर्वेक्षण उपकरण उच्च-सटीकता मापों के लिए बाह्य कोण गणनाओं का उपयोग करते हैं।',
      computerGraphics: 'गणितीय मॉडलिंग',
      computerGraphicsDesc: 'जटिल गणितीय मॉडल सटीक ज्यामितीय गणनाओं के लिए बाह्य कोण गुणों पर निर्भर करते हैं।',
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
      dragVerticesInstruction: 'उन्नत बाह्य कोण संबंधों का अन्वेषण करने के लिए शीर्षों को खींचें',
      mathematicalExample: 'गणितीय उदाहरण',
      given: 'दिया गया',
      find: 'ज्ञात करें',
      exteriorAngleGiven: 'समबाहु त्रिभुज जिसके आंतरिक कोण प्रत्येक 60° हैं',
      interiorAngleGiven: 'बाह्य कोण गणना',
      findOtherAngle: 'प्रत्येक शीर्ष पर बाह्य कोण'
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
      chapterTitle: 'ઉન્નત બાહ્ય કોણો',
      topicTitle: 'ઉન્નત બાહ્ય કોણ ગુણધર્મોની સમજ',
      whatIsTopic: 'ઉન્નત બાહ્ય કોણ ગુણધર્મો શું છે?',
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
      definition: 'ઉન્નત બાહ્ય કોણ વ્યાખ્યા',
      definitionText: 'ઉન્નત બાહ્ય કોણ ગુણધર્મોમાં જટિલ ત્રિકોણ પરિસ્થિતિઓ શામેલ છે જેમાં વિવિધ ત્રિકોણ પ્રકારો (ન્યૂનકોણ, સમકોણ, અધિકકોણ, સમબાહુ, સમદ્વિબાહુ, વિષમબાહુ) અને તેમના અનન્ય બાહ્ય કોણ લક્ષણો શામેલ છે।',
      keyComponents: 'મુખ્ય ઘટકો',
      keyComponentsText: 'વિવિધ ત્રિકોણ પ્રકારોના અલગ-અલગ બાહ્ય કોણ પેટર્ન હોય છે। ન્યૂનકોણ ત્રિકોણોમાં બધા બાહ્ય કોણો 90° કરતાં વધારે હોય છે, સમકોણ ત્રિકોણોમાં એક બાહ્ય કોણ 90° જેટલો હોય છે, અને અધિકકોણ ત્રિકોણોમાં એક બાહ્ય કોણ 90° કરતાં ઓછો હોય છે।',
      keyProperty: 'ઉન્નત ગુણધર્મો',
      keyPropertyText: 'બાહ્ય કોણ પ્રમેય સાર્વત્રિક રીતે લાગુ પડે છે, પરંતુ ચોક્કસ મૂલ્યો ત્રિકોણ પ્રકાર પર આધાર રાખે છે। સમબાહુ ત્રિકોણોમાં બધા બાહ્ય કોણો 120° જેટલા હોય છે, જ્યારે વિષમબાહુ ત્રિકોણોમાં વિવિધ બાહ્ય કોણો હોય છે।',
      justification: 'ગાણિતિક પુરાવો',
      justificationText: 'ઉન્નત ગુણધર્મોને ભૂમિતીય નિર્માણ અને કોણ સંબંધો દ્વારા સિદ્ધ કરવામાં આવે છે। દરેક ત્રિકોણ પ્રકાર તેની આંતરિક કોણ સંરચનાના આધારે અનન્ય બાહ્ય કોણ પેટર્ન પ્રદર્શિત કરે છે।',
      practicalApplications: 'ઉન્નત ઉપયોગો',
      practicalApplicationsText: 'આ ઉન્નત ગુણધર્મો જટિલ સ્થાપત્ય ડિઝાઇન, માળખાકીય ઇજનેરી, કમ્પ્યુટર ગ્રાફિક્સ અને ભૌતિકશાસ્ત્ર ઉપયોગોમાં મહત્વપૂર્ણ છે જ્યાં સચોટ કોણ ગણતરીઓની જરૂર હોય છે।',
      visualization: 'ઉન્નત ત્રિકોણ દ્રશ્યીકરણ',
      interiorElements: 'આંતરિક કોણો',
      exteriorElements: 'બાહ્ય કોણો',
      triangleOf: 'ત્રિકોણ',
      of: 'નો',
      yourAnswer: 'તમારો જવાબ',
      enterAnswer: 'તમારો જવાબ દાખલ કરો...',
      architecture: 'ઉન્નત સ્થાપત્ય',
      architectureDesc: 'જટિલ છત માળખા અને ભૂગોળીય ગુંબદ શ્રેષ્ઠ માળખાકીય અખંડતા માટે ઉન્નત બાહ્ય કોણ ગણતરીઓનો ઉપયોગ કરે છે।',
      navigation: 'માળખાકીય ઇજનેરી',
      navigationDesc: 'પુલ ટ્રસ અને સ્પેસ ફ્રેમ સ્થિરતા અને લોડ વિતરણ માટે બાહ્ય કોણ ગુણધર્મો પર આધાર રાખે છે।',
      engineering: 'કમ્પ્યુટર ગ્રાફિક્સ',
      engineeringDesc: '3D મોડલિંગ અને રેન્ડરિંગ એલ્ગોરિધમ્સ યથાર્થવાદી પ્રકાશ અને છાયા પ્રભાવો માટે બાહ્ય કોણ ગણતરીઓનો ઉપયોગ કરે છે।',
      artDesign: 'ભૌતિકશાસ્ત્ર અને ઓપ્ટિક્સ',
      artDesignDesc: 'પ્રકાશ અપવર્તન અને તરંગ પ્રસાર ગણતરીઓ સચોટ મોડલિંગ માટે બાહ્ય કોણ સિદ્ધાંતોને શામેલ કરે છે।',
      surveying: 'ઉન્નત સર્વેક્ષણ',
      surveyingDesc: 'સચોટ સર્વેક્ષણ સાધનો ઉચ્ચ-સચોટતા માપો માટે બાહ્ય કોણ ગણતરીઓનો ઉપયોગ કરે છે।',
      computerGraphics: 'ગાણિતિક મોડલિંગ',
      computerGraphicsDesc: 'જટિલ ગાણિતિક મોડલો સચોટ ભૂમિતીય ગણતરીઓ માટે બાહ્ય કોણ ગુણધર્મો પર આધાર રાખે છે।',
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
      dragVerticesInstruction: 'ઉન્નત બાહ્ય કોણ સંબંધોનું અન્વેષણ કરવા માટે શિરોબિંદુઓને ખેંચો',
      mathematicalExample: 'ગણિતીય ઉદાહરણ',
      given: 'આપેલ',
      find: 'શોધો',
      exteriorAngleGiven: 'સમબાહુ ત્રિકોણ જેના આંતરિક કોણો દરેક 60° છે',
      interiorAngleGiven: 'બાહ્ય કોણ ગણતરી',
      findOtherAngle: 'દરેક શિરોબિંદુ પર બાહ્ય કોણ'
    }
  };

  const t = translations[language];

  // Special Triangles data
  const triangles: TriangleInfo[] = [
    {
      id: 'equilateral',
      name: {
        en: 'Equilateral Triangle',
        hi: 'समबाहु त्रिभुज',
        gu: 'સમબાજુ ત્રિકોણ'
      },
      definition: {
        en: 'A triangle where all three sides have equal lengths.',
        hi: 'एक त्रिभुज जहां तीनों भुजाओं की लंबाई बराबर होती है।',
        gu: 'એક ત્રિકોણ જ્યાં ત્રણેય બાજુઓની લંબાઈ સમાન હોય છે।'
      },
      properties: {
        en: [
          'All sides are of the same length',
          'Each angle measures exactly 60°',
          'Has three lines of symmetry',
          'All angles are equal'
        ],
        hi: [
          'सभी भुजाएं समान लंबाई की होती हैं',
          'प्रत्येक कोण ठीक 60° का होता है',
          'तीन सममिति रेखाएं होती हैं',
          'सभी कोण बराबर होते हैं'
        ],
        gu: [
          'બધી બાજુઓ સમાન લંબાઈની હોય છે',
          'દરેક કોણ બરાબર 60° નો હોય છે',
          'ત્રણ સમમિતિ રેખાઓ હોય છે',
          'બધા કોણ સમાન હોય છે'
        ]
      },
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'isosceles',
      name: {
        en: 'Isosceles Triangle',
        hi: 'समद्विबाहु त्रिभुज',
        gu: 'સમદ્વિબાજુ ત્રિકોણ'
      },
      definition: {
        en: 'A triangle where two sides have equal lengths.',
        hi: 'एक त्रिभुज जहां दो भुजाओं की लंबाई बराबर होती है।',
        gu: 'એક ત્રિકોણ જ્યાં બે બાજુઓની લંબાઈ સમાન હોય છે।'
      },
      properties: {
        en: [
          'Two sides have the same length (equal sides)',
          'The third side is called the base',
          'Base angles are equal in measure',
          'Has one line of symmetry'
        ],
        hi: [
          'दो भुजाएं समान लंबाई की होती हैं (समान भुजाएं)',
          'तीसरी भुजा को आधार कहा जाता है',
          'आधार कोण माप में बराबर होते हैं',
          'एक सममिति रेखा होती है'
        ],
        gu: [
          'બે બાજુઓ સમાન લંબાઈની હોય છે (સમાન બાજુઓ)',
          'ત્રીજી બાજુને આધાર કહેવામાં આવે છે',
          'આધાર કોણ માપમાં સમાન હોય છે',
          'એક સમમિતિ રેખા હોય છે'
        ]
      },
      color: 'from-purple-500 to-purple-600'
    }
  ];

  // Handle language change and save to localStorage
  const handleLanguageChange = (newLanguage: 'en' | 'hi' | 'gu') => {
    setLanguage(newLanguage);
    localStorage.setItem('ch6-6-6-language', newLanguage);
  };

  // Diagram components
  const EquilateralDiagram: React.FC = () => (
    <svg viewBox="0 0 200 200" className="w-full max-w-xs mx-auto mb-4">
      {/* Triangle */}
      <polygon points="100,20 30,170 170,170" fill="rgba(59, 130, 246, 0.2)" stroke="rgb(59, 130, 246)" strokeWidth="2" />
      
      {/* Vertices */}
      <circle cx="100" cy="20" r="5" fill="rgb(59, 130, 246)" />
      <circle cx="30" cy="170" r="5" fill="rgb(59, 130, 246)" />
      <circle cx="170" cy="170" r="5" fill="rgb(59, 130, 246)" />
      
      {/* Labels */}
      <text x="100" y="10" textAnchor="middle" className="text-sm font-bold fill-blue-600">A</text>
      <text x="15" y="180" textAnchor="middle" className="text-sm font-bold fill-blue-600">B</text>
      <text x="185" y="180" textAnchor="middle" className="text-sm font-bold fill-blue-600">C</text>
      
      {/* Side labels */}
      <text x="60" y="85" textAnchor="middle" className="text-xs fill-blue-600 font-semibold">a</text>
      <text x="140" y="85" textAnchor="middle" className="text-xs fill-blue-600 font-semibold">a</text>
      <text x="100" y="190" textAnchor="middle" className="text-xs fill-blue-600 font-semibold">a</text>
      
      {/* Angles */}
      <text x="100" y="45" textAnchor="middle" className="text-xs fill-blue-600 font-semibold">60°</text>
      <text x="45" y="160" textAnchor="middle" className="text-xs fill-blue-600 font-semibold">60°</text>
      <text x="155" y="160" textAnchor="middle" className="text-xs fill-blue-600 font-semibold">60°</text>
    </svg>
  );

  const IsoscelesDiagram: React.FC = () => (
    <svg viewBox="0 0 200 200" className="w-full max-w-xs mx-auto mb-4">
      {/* Triangle */}
      <polygon points="100,30 40,160 160,160" fill="rgba(168, 85, 247, 0.2)" stroke="rgb(168, 85, 247)" strokeWidth="2" />
      
      {/* Vertices */}
      <circle cx="100" cy="30" r="5" fill="rgb(168, 85, 247)" />
      <circle cx="40" cy="160" r="5" fill="rgb(168, 85, 247)" />
      <circle cx="160" cy="160" r="5" fill="rgb(168, 85, 247)" />
      
      {/* Labels */}
      <text x="100" y="15" textAnchor="middle" className="text-sm font-bold fill-purple-600">X</text>
      <text x="25" y="175" textAnchor="middle" className="text-sm font-bold fill-purple-600">Y</text>
      <text x="175" y="175" textAnchor="middle" className="text-sm font-bold fill-purple-600">Z</text>
      
      {/* Side labels */}
      <text x="100" y="180" textAnchor="middle" className="text-xs fill-purple-600 font-semibold">Base (c)</text>
      
      {/* Angles */}
      <text x="55" y="150" textAnchor="middle" className="text-xs fill-purple-600 font-semibold">α</text>
      <text x="145" y="150" textAnchor="middle" className="text-xs fill-purple-600 font-semibold">α</text>
      <text x="100" y="50" textAnchor="middle" className="text-xs fill-purple-600 font-semibold">β</text>
    </svg>
  );

  const renderDemonstrationMode = () => (
    <div className="space-y-6">
      {/* Special Triangles Guide */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-6 md:p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gradient-teal-purple mb-4">
            📐 {language === 'en' ? 'Special Triangles' : language === 'hi' ? 'विशेष त्रिभुज' : 'વિશેષ ત્રિકોણ'}
          </h2>
          <p className="text-lg text-gray-600">
            {language === 'en' ? 'Equilateral and Isosceles Triangles' : language === 'hi' ? 'समबाहु और समद्विबाहु त्रिभुज' : 'સમબાજુ અને સમદ્વિબાજુ ત્રિકોણ'}
          </p>
        </div>

        {/* Cards */}
        <div className="space-y-6">
          {triangles.map((triangle) => (
            <div
              key={triangle.id}
              className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl border border-gray-200"
            >
              {/* Header */}
              <button
                onClick={() => setExpandedTriangle(expandedTriangle === triangle.id ? '' : triangle.id)}
                className={`w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r ${triangle.color} text-white hover:opacity-90 transition-opacity`}
              >
                <h3 className="text-xl font-bold">{triangle.name[language]}</h3>
                {expandedTriangle === triangle.id ? (
                  <ChevronUp size={24} />
                ) : (
                  <ChevronDown size={24} />
                )}
              </button>

              {/* Content */}
              {expandedTriangle === triangle.id && (
                <div className="p-6 space-y-6">
                  {/* Definition */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      {language === 'en' ? 'Definition' : language === 'hi' ? 'परिभाषा' : 'વ્યાખ્યા'}
                    </h4>
                    <p className="text-gray-700 leading-relaxed">{triangle.definition[language]}</p>
                  </div>

                  {/* Diagram */}
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">
                      {language === 'en' ? 'Diagram' : language === 'hi' ? 'आरेख' : 'આકૃતિ'}
                    </h4>
                    {triangle.id === 'equilateral' ? (
                      <EquilateralDiagram />
                    ) : (
                      <IsoscelesDiagram />
                    )}
                  </div>

                  {/* Properties */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">
                      {language === 'en' ? 'Key Properties' : language === 'hi' ? 'मुख्य गुण' : 'મુખ્ય ગુણધર્મો'}
                    </h4>
                    <ul className="space-y-3">
                      {triangle.properties[language].map((property, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-gradient-to-r ${triangle.color}`} />
                          <span className="text-gray-700">{property}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
          <h3 className="text-2xl font-bold text-blue-800 mb-6">
            {language === 'en' ? 'Comparison' : language === 'hi' ? 'तुलना' : 'સરખામણી'}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-700">
              <thead className="border-b border-blue-300">
                <tr>
                  <th className="text-left py-3 px-4 text-blue-900 font-semibold">
                    {language === 'en' ? 'Feature' : language === 'hi' ? 'विशेषता' : 'વિશેષતા'}
                  </th>
                  <th className="text-left py-3 px-4 text-blue-600 font-semibold">
                    {triangles[0].name[language]}
                  </th>
                  <th className="text-left py-3 px-4 text-purple-600 font-semibold">
                    {triangles[1].name[language]}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-blue-200">
                  <td className="py-3 px-4 text-blue-900 font-medium">
                    {language === 'en' ? 'Equal Sides' : language === 'hi' ? 'समान भुजाएं' : 'સમાન બાજુઓ'}
                  </td>
                  <td className="py-3 px-4">
                    {language === 'en' ? 'All 3 sides' : language === 'hi' ? 'सभी 3 भुजाएं' : 'બધી 3 બાજુઓ'}
                  </td>
                  <td className="py-3 px-4">
                    {language === 'en' ? '2 sides' : language === 'hi' ? '2 भुजाएं' : '2 બાજુઓ'}
                  </td>
                </tr>
                <tr className="border-b border-blue-200">
                  <td className="py-3 px-4 text-blue-900 font-medium">
                    {language === 'en' ? 'Equal Angles' : language === 'hi' ? 'समान कोण' : 'સમાન કોણ'}
                  </td>
                  <td className="py-3 px-4">
                    {language === 'en' ? 'All 3 angles (60° each)' : language === 'hi' ? 'सभी 3 कोण (प्रत्येक 60°)' : 'બધા 3 કોણ (દરેક 60°)'}
                  </td>
                  <td className="py-3 px-4">
                    {language === 'en' ? '2 base angles' : language === 'hi' ? '2 आधार कोण' : '2 આધાર કોણ'}
                  </td>
                </tr>
                <tr className="border-b border-blue-200">
                  <td className="py-3 px-4 text-blue-900 font-medium">
                    {language === 'en' ? 'Lines of Symmetry' : language === 'hi' ? 'सममिति रेखाएं' : 'સમમિતિ રેખાઓ'}
                  </td>
                  <td className="py-3 px-4">3</td>
                  <td className="py-3 px-4">1</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-blue-900 font-medium">
                    {language === 'en' ? 'Base' : language === 'hi' ? 'आधार' : 'આધાર'}
                  </td>
                  <td className="py-3 px-4">
                    {language === 'en' ? 'None' : language === 'hi' ? 'कोई नहीं' : 'કોઈ નહીં'}
                  </td>
                  <td className="py-3 px-4">
                    {language === 'en' ? 'Yes (third side)' : language === 'hi' ? 'हां (तीसरी भुजा)' : 'હા (ત્રીજી બાજુ)'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPracticeMode = () => {
    const practiceQuestions = [
      {
        id: 1,
        question: {
          en: "In an equilateral triangle, what is the measure of each exterior angle?",
          hi: "एक समबाहु त्रिभुज में, प्रत्येक बाह्य कोण का माप क्या है?",
          gu: "સમબાજુ ત્રિકોણમાં, દરેક બાહ્ય કોણનું માપ કેટલું છે?"
        },
        answer: 120,
        explanation: {
          en: "In an equilateral triangle, each interior angle is 60°. The exterior angle = 180° - 60° = 120°",
          hi: "समबाहु त्रिभुज में, प्रत्येक अंतः कोण 60° है। बाह्य कोण = 180° - 60° = 120°",
          gu: "સમબાજુ ત્રિકોણમાં, દરેક આંતરિક કોણ 60° છે। બાહ્ય કોણ = 180° - 60° = 120°"
        }
      },
      {
        id: 2,
        question: {
          en: "In an isosceles triangle with base angles 50° each, what is the exterior angle at the vertex?",
          hi: "50° प्रत्येक आधार कोण वाले समद्विबाहु त्रिभुज में, शीर्ष पर बाह्य कोण क्या है?",
          gu: "50° દરેક આધાર કોણ વાળા સમદ્વિબાજુ ત્રિકોણમાં, શિરોબિંદુ પર બાહ્ય કોણ કેટલું છે?"
        },
        answer: 80,
        explanation: {
          en: "Vertex angle = 180° - 50° - 50° = 80°. Exterior angle = 180° - 80° = 100°",
          hi: "शीर्ष कोण = 180° - 50° - 50° = 80°। बाह्य कोण = 180° - 80° = 100°",
          gu: "શિરોબિંદુ કોણ = 180° - 50° - 50° = 80°। બાહ્ય કોણ = 180° - 80° = 100°"
        }
      },
      {
        id: 3,
        question: {
          en: "If an equilateral triangle has an exterior angle of 120°, what is the measure of the opposite interior angle?",
          hi: "यदि एक समबाहु त्रिभुज का बाह्य कोण 120° है, तो विपरीत अंतः कोण का माप क्या है?",
          gu: "જો સમબાજુ ત્રિકોણનો બાહ્ય કોણ 120° છે, તો વિરુદ્ધ આંતરિક કોણનું માપ કેટલું છે?"
        },
        answer: 60,
        explanation: {
          en: "In an equilateral triangle, exterior angle = 180° - interior angle. So 120° = 180° - interior angle, therefore interior angle = 60°",
          hi: "समबाहु त्रिभुज में, बाह्य कोण = 180° - अंतः कोण। तो 120° = 180° - अंतः कोण, इसलिए अंतः कोण = 60°",
          gu: "સમબાજુ ત્રિકોણમાં, બાહ્ય કોણ = 180° - આંતરિક કોણ। તો 120° = 180° - આંતરિક કોણ, તેથી આંતરિક કોણ = 60°"
        }
      },
      {
        id: 4,
        question: {
          en: "In an isosceles triangle, if the vertex angle is 100°, what is the exterior angle at each base angle?",
          hi: "समद्विबाहु त्रिभुज में, यदि शीर्ष कोण 100° है, तो प्रत्येक आधार कोण पर बाह्य कोण क्या है?",
          gu: "સમદ્વિબાજુ ત્રિકોણમાં, જો શિરોબિંદુ કોણ 100° છે, તો દરેક આધાર કોણ પર બાહ્ય કોણ કેટલું છે?"
        },
        answer: 140,
        explanation: {
          en: "Each base angle = (180° - 100°) ÷ 2 = 40°. Exterior angle at base = 180° - 40° = 140°",
          hi: "प्रत्येक आधार कोण = (180° - 100°) ÷ 2 = 40°। आधार पर बाह्य कोण = 180° - 40° = 140°",
          gu: "દરેક આધાર કોણ = (180° - 100°) ÷ 2 = 40°। આધાર પર બાહ્ય કોણ = 180° - 40° = 140°"
        } 
      },
      {
        id: 5,
        question: {
          en: "What is the sum of all exterior angles in an equilateral triangle?",
          hi: "समबाहु त्रिभुज में सभी बाह्य कोणों का योग क्या है?",
          gu: "સમબાજુ ત્રિકોણમાં બધા બાહ્ય કોણોનો સરવાળો કેટલો છે?"
        },
        answer: 360,
        explanation: {
          en: "Each exterior angle = 120°, so sum = 120° × 3 = 360°. This is true for any triangle.",
          hi: "प्रत्येक बाह्य कोण = 120°, तो योग = 120° × 3 = 360°। यह किसी भी त्रिभुज के लिए सत्य है।",
          gu: "દરેક બાહ્ય કોણ = 120°, તો સરવાળો = 120° × 3 = 360°। આ કોઈપણ ત્રિકોણ માટે સાચું છે।"
        }
      },
      {
        id: 6,
        question: {
          en: "In an isosceles triangle with equal sides of length 8 cm and base 6 cm, if the base angles are 70° each, what is the exterior angle at the vertex?",
          hi: "8 सेमी समान भुजाओं और 6 सेमी आधार वाले समद्विबाहु त्रिभुज में, यदि आधार कोण प्रत्येक 70° हैं, तो शीर्ष पर बाह्य कोण क्या है?",
          gu: "8 સેમી સમાન બાજુઓ અને 6 સેમી આધાર વાળા સમદ્વિબાજુ ત્રિકોણમાં, જો આધાર કોણ દરેક 70° છે, તો શિરોબિંદુ પર બાહ્ય કોણ કેટલું છે?"
        },
        answer: 40,
        explanation: {
          en: "Vertex angle = 180° - 70° - 70° = 40°. Exterior angle at vertex = 180° - 40° = 140°",
          hi: "शीर्ष कोण = 180° - 70° - 70° = 40°। शीर्ष पर बाह्य कोण = 180° - 40° = 140°",
          gu: "શિરોબિંદુ કોણ = 180° - 70° - 70° = 40°। શિરોબિંદુ પર બાહ્ય કોણ = 180° - 40° = 140°"
        }
      }
    ];

    const handleAnswerSubmit = (answer: string) => {
      const newAnswers = [...userAnswers];
      newAnswers[currentQuestion] = answer;
      setUserAnswers(newAnswers);
    };

    const nextQuestion = () => {
      if (currentQuestion < practiceQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setShowOverview(true);
        calculateScore();
      }
    };

    const prevQuestion = () => {
      if (currentQuestion > 0) {
        setCurrentQuestion(currentQuestion - 1);
      }
    };

    const calculateScore = () => {
      let score = 0;
      practiceQuestions.forEach((question, index) => {
        if (parseFloat(userAnswers[index]) === question.answer) {
          score++;
        }
      });
      setPracticeScore(score);
    };

    const resetPractice = () => {
      setCurrentQuestion(0);
      setUserAnswers(new Array(6).fill(''));
      setShowOverview(false);
      setPracticeScore(0);
    };

    if (showOverview) {
    return (
      <div className="space-y-6">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-6 md:p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gradient-teal-purple mb-4">
                {language === 'hi' ? '📊 अभ्यास सारांश' : language === 'gu' ? '📊 અભ્યાસ સારાંશ' : '📊 Practice Overview'}
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                {language === 'hi' 
                  ? 'समबाहु और समद्विबाहु त्रिभुजों के बाह्य कोणों पर आपके प्रदर्शन का विस्तृत विश्लेषण'
                  : language === 'gu' 
                  ? 'સમબાજુ અને સમદ્વિબાજુ ત્રિકોણોના બાહ્ય કોણો પર તમારા પ્રદર્શનનું વિગતવાર વિશ્લેષણ'
                  : 'Detailed analysis of your performance on exterior angles of equilateral and isosceles triangles'
                }
              </p>
              <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-6 mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {language === 'hi' ? 'आपका स्कोर' : language === 'gu' ? 'તમારો સ્કોર' : 'Your Score'}
                </h3>
                <div className="text-4xl font-bold text-green-600">
                  {practiceScore}/{practiceQuestions.length}
                </div>
                <div className="text-lg text-gray-600 mt-2">
                  {language === 'hi' 
                    ? `${Math.round((practiceScore / practiceQuestions.length) * 100)}% सही उत्तर`
                    : language === 'gu' 
                    ? `${Math.round((practiceScore / practiceQuestions.length) * 100)}% સાચા જવાબ`
                    : `${Math.round((practiceScore / practiceQuestions.length) * 100)}% Correct`
                  }
                </div>
                <div className="mt-4">
                  {practiceScore === practiceQuestions.length ? (
                    <div className="text-green-700 font-semibold text-lg">
                      {language === 'hi' ? '🎉 उत्कृष्ट! आपने सभी प्रश्न सही किए!' : language === 'gu' ? '🎉 ઉત્તમ! તમે બધા પ્રશ્નો સાચા કર્યા!' : '🎉 Excellent! You got all questions correct!'}
                    </div>
                  ) : practiceScore >= practiceQuestions.length * 0.8 ? (
                    <div className="text-blue-700 font-semibold text-lg">
                      {language === 'hi' ? '👍 बहुत अच्छा! आपका प्रदर्शन उत्कृष्ट है!' : language === 'gu' ? '👍 ખૂબ સારું! તમારું પ્રદર્શન ઉત્તમ છે!' : '👍 Very Good! Your performance is excellent!'}
                    </div>
                  ) : practiceScore >= practiceQuestions.length * 0.6 ? (
                    <div className="text-yellow-700 font-semibold text-lg">
                      {language === 'hi' ? '📚 अच्छा काम! थोड़ा और अभ्यास करें!' : language === 'gu' ? '📚 સારું કામ! થોડું વધુ અભ્યાસ કરો!' : '📚 Good Work! Practice a bit more!'}
                    </div>
                  ) : (
                    <div className="text-orange-700 font-semibold text-lg">
                      {language === 'hi' ? '💪 कोशिश करते रहें! अधिक अभ्यास की जरूरत है!' : language === 'gu' ? '💪 કોશિશ કરતા રહો! વધુ અભ્યાસની જરૂર છે!' : '💪 Keep Trying! More practice needed!'}
                    </div>
                  )}
                </div>
              </div>
          </div>
          
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {practiceQuestions.map((question, index) => {
                const isCorrect = parseFloat(userAnswers[index]) === question.answer;
                return (
                  <div key={question.id} className={`bg-white rounded-xl p-4 border-2 ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-700">
                        {language === 'hi' ? 'प्रश्न' : language === 'gu' ? 'પ્રશ્ન' : 'Question'} {index + 1}
                      </span>
                      <span className={`text-lg ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        {isCorrect ? '✓' : '✗'}
                      </span>
            </div>
                    <p className="text-sm text-gray-600 mb-2">{question.question[language]}</p>
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">
                        {language === 'hi' ? 'आपका उत्तर:' : language === 'gu' ? 'તમારો જવાબ:' : 'Your Answer:'} 
                      </span> {userAnswers[index] || (language === 'hi' ? 'कोई उत्तर नहीं' : language === 'gu' ? 'કોઈ જવાબ નથી' : 'No Answer')}
            </div>
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">
                        {language === 'hi' ? 'सही उत्तर:' : language === 'gu' ? 'સાચો જવાબ:' : 'Correct Answer:'} 
                      </span> {question.answer}°
            </div>
                    <div className="text-xs text-gray-500 mt-2">{question.explanation[language]}</div>
          </div>
                );
              })}
            </div>

            {/* Key Concepts Summary */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {language === 'hi' ? '📚 मुख्य अवधारणाएं' : language === 'gu' ? '📚 મુખ્ય ખ્યાલો' : '📚 Key Concepts'}
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                  <h4 className="font-bold text-blue-800 mb-2">
                    {language === 'hi' ? 'समबाहु त्रिभुज' : language === 'gu' ? 'સમબાજુ ત્રિકોણ' : 'Equilateral Triangle'}
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• {language === 'hi' ? 'सभी कोण 60°' : language === 'gu' ? 'બધા કોણ 60°' : 'All angles 60°'}</li>
                    <li>• {language === 'hi' ? 'सभी बाह्य कोण 120°' : language === 'gu' ? 'બધા બાહ્ય કોણ 120°' : 'All exterior angles 120°'}</li>
                    <li>• {language === 'hi' ? 'तीन सममिति रेखाएं' : language === 'gu' ? 'ત્રણ સમમિતિ રેખાઓ' : 'Three lines of symmetry'}</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
                  <h4 className="font-bold text-purple-800 mb-2">
                    {language === 'hi' ? 'समद्विबाहु त्रिभुज' : language === 'gu' ? 'સમદ્વિબાજુ ત્રિકોણ' : 'Isosceles Triangle'}
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• {language === 'hi' ? 'दो समान भुजाएं' : language === 'gu' ? 'બે સમાન બાજુઓ' : 'Two equal sides'}</li>
                    <li>• {language === 'hi' ? 'दो समान आधार कोण' : language === 'gu' ? 'બે સમાન આધાર કોણ' : 'Two equal base angles'}</li>
                    <li>• {language === 'hi' ? 'एक सममिति रेखा' : language === 'gu' ? 'એક સમમિતિ રેખા' : 'One line of symmetry'}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Learning Tips */}
            <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6 mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {language === 'hi' ? '💡 सीखने के सुझाव' : language === 'gu' ? '💡 શીખવાના સૂચનો' : '💡 Learning Tips'}
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">
                    {language === 'hi' ? 'सूत्र याद रखें' : language === 'gu' ? 'સૂત્ર યાદ રાખો' : 'Remember the Formula'}
                  </h4>
                  <p className="text-sm text-gray-700">
                    {language === 'hi' 
                      ? 'बाह्य कोण = 180° - अंतः कोण'
                      : language === 'gu' 
                      ? 'બાહ્ય કોણ = 180° - આંતરિક કોણ'
                      : 'Exterior angle = 180° - Interior angle'
                    }
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">
                    {language === 'hi' ? 'विशेष गुण' : language === 'gu' ? 'વિશેષ ગુણધર્મો' : 'Special Properties'}
                  </h4>
                  <p className="text-sm text-gray-700">
                    {language === 'hi' 
                      ? 'समबाहु में सभी कोण बराबर, समद्विबाहु में आधार कोण बराबर'
                      : language === 'gu' 
                      ? 'સમબાજુમાં બધા કોણ સમાન, સમદ્વિબાજુમાં આધાર કોણ સમાન'
                      : 'Equilateral: all angles equal, Isosceles: base angles equal'
                    }
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">
                    {language === 'hi' ? 'अभ्यास करें' : language === 'gu' ? 'અભ્યાસ કરો' : 'Practice More'}
                  </h4>
                  <p className="text-sm text-gray-700">
                    {language === 'hi' 
                      ? 'विभिन्न कोण मानों के साथ अभ्यास करें'
                      : language === 'gu' 
                      ? 'વિવિધ કોણ મૂલ્યો સાથે અભ્યાસ કરો'
                      : 'Practice with different angle values'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={resetPractice}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                {language === 'hi' ? 'फिर से प्रयास करें' : language === 'gu' ? 'ફરીથી પ્રયાસ કરો' : 'Try Again'}
              </button>
            </div>
        </div>
      </div>
    );
    }

    const currentQ = practiceQuestions[currentQuestion];
    
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-6 md:p-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gradient-teal-purple mb-4">
              ✍️ {language === 'hi' ? 'अभ्यास प्रश्न' : language === 'gu' ? 'અભ્યાસ પ્રશ્નો' : 'Practice Questions'}
            </h2>
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="text-lg text-gray-600">
                {language === 'hi' ? 'प्रश्न' : language === 'gu' ? 'પ્રશ્ન' : 'Question'} {currentQuestion + 1}/{practiceQuestions.length}
              </span>
              <div className="flex gap-1">
                {practiceQuestions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index === currentQuestion ? 'bg-blue-600' : 
                      index < currentQuestion ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                {currentQ.question[language]}
              </h3>
          
          <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-lg font-medium text-gray-700">
                    {language === 'hi' ? 'उत्तर:' : language === 'gu' ? 'જવાબ:' : 'Answer:'}
                  </label>
                  <input
                    type="number"
                    value={userAnswers[currentQuestion]}
                    onChange={(e) => handleAnswerSubmit(e.target.value)}
                    placeholder={language === 'hi' ? 'संख्या दर्ज करें' : language === 'gu' ? 'સંખ્યા દાખલ કરો' : 'Enter number'}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-lg w-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="text-gray-500">°</span>
            </div>
                
                {userAnswers[currentQuestion] && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <strong>{language === 'hi' ? 'स्पष्टीकरण:' : language === 'gu' ? 'સ્પષ્ટતા:' : 'Explanation:'}</strong>
                    </p>
                    <p className="text-sm text-blue-600 mt-1">{currentQ.explanation[language]}</p>
            </div>
                )}
            </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  currentQuestion === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                {language === 'hi' ? 'पिछला' : language === 'gu' ? 'પાછલું' : 'Previous'}
              </button>
              
              <button
                onClick={nextQuestion}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                {currentQuestion === practiceQuestions.length - 1
                  ? (language === 'hi' ? 'समाप्त करें' : language === 'gu' ? 'સમાપ્ત કરો' : 'Finish')
                  : (language === 'hi' ? 'अगला' : language === 'gu' ? 'આગળ' : 'Next')
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRealWorldApplications = () => {
    const realWorldExamples = [
      {
        id: 1,
        title: {
          en: "Equilateral Triangles in Architecture",
          hi: "वास्तुकला में समबाहु त्रिभुज",
          gu: "સ્થાપત્યમાં સમબાજુ ત્રિકોણ"
        },
        description: {
          en: "Equilateral triangles are fundamental in architectural design, especially in geodesic domes and pyramid structures. The 60° interior angles and 120° exterior angles provide optimal structural stability and aesthetic appeal. Architects use these properties to create self-supporting structures that distribute weight evenly.",
          hi: "समबाहु त्रिभुज वास्तुकला डिजाइन में मौलिक हैं, विशेष रूप से भूगोलीय गुंबद और पिरामिड संरचनाओं में। 60° अंतः कोण और 120° बाह्य कोण इष्टतम संरचनात्मक स्थिरता और सौंदर्य अपील प्रदान करते हैं। वास्तुकार इन गुणों का उपयोग स्व-समर्थित संरचनाएं बनाने के लिए करते हैं जो वजन को समान रूप से वितरित करती हैं।",
          gu: "સમબાજુ ત્રિકોણ સ્થાપત્ય ડિઝાઇનમાં મૂળભૂત છે, ખાસ કરીને ભૂગોળીય ગુંબદ અને પિરામિડ માળખાઓમાં। 60° આંતરિક કોણો અને 120° બાહ્ય કોણો શ્રેષ્ઠ માળખાકીય સ્થિરતા અને સૌંદર્ય આકર્ષણ પ્રદાન કરે છે। સ્થાપત્યકારો આ ગુણધર્મોનો ઉપયોગ સ્વ-સમર્થિત માળખાઓ બનાવવા માટે કરે છે જે વજનને સમાન રીતે વિતરિત કરે છે।"
        },
        calculation: {
          en: "Exterior angle = 180° - 60° = 120° (perfect for structural joints)",
          hi: "बाह्य कोण = 180° - 60° = 120° (संरचनात्मक जोड़ों के लिए आदर्श)",
          gu: "બાહ્ય કોણ = 180° - 60° = 120° (માળખાકીય જોડાણો માટે આદર્શ)"
        },
        icon: "🏛️"
      },
      {
        id: 2,
        title: {
          en: "Isosceles Triangles in Bridge Design",
          hi: "पुल डिजाइन में समद्विबाहु त्रिभुज",
          gu: "પુલ ડિઝાઇનમાં સમદ્વિબાજુ ત્રિકોણ"
        },
        description: {
          en: "Isosceles triangles are crucial in truss bridge construction. The equal sides provide symmetry and balance, while the base distributes loads efficiently. Engineers calculate exterior angles to determine optimal joint angles for maximum strength and minimal material usage in suspension bridges and arch structures.",
          hi: "ट्रस पुल निर्माण में समद्विबाहु त्रिभुज महत्वपूर्ण हैं। समान भुजाएं सममिति और संतुलन प्रदान करती हैं, जबकि आधार भार को कुशलतापूर्वक वितरित करता है। इंजीनियर निलंबन पुलों और मेहराब संरचनाओं में अधिकतम शक्ति और न्यूनतम सामग्री उपयोग के लिए इष्टतम जोड़ कोण निर्धारित करने के लिए बाह्य कोणों की गणना करते हैं।",
          gu: "ટ્રસ પુલ બાંધકામમાં સમદ્વિબાજુ ત્રિકોણ મહત્વપૂર્ણ છે। સમાન બાજુઓ સમમિતિ અને સંતુલન પ્રદાન કરે છે, જ્યારે આધાર લોડને કાર્યક્ષમ રીતે વિતરિત કરે છે। ઇજનેરો સસ્પેન્શન પુલો અને આર્ચ માળખાઓમાં મહત્તમ શક્તિ અને લઘુત્તમ સામગ્રી ઉપયોગ માટે શ્રેષ્ઠ જોડાણ કોણો નક્કી કરવા માટે બાહ્ય કોણોની ગણતરી કરે છે।"
        },
        calculation: {
          en: "Load distribution angle = 180° - base angle (optimizes force transfer)",
          hi: "भार वितरण कोण = 180° - आधार कोण (बल स्थानांतरण को अनुकूलित करता है)",
          gu: "લોડ વિતરણ કોણ = 180° - આધાર કોણ (બળ સ્થાનાંતરણને ઑપ્ટિમાઇઝ કરે છે)"
        },
        icon: "🌉"
      },
      {
        id: 3,
        title: {
          en: "Equilateral Triangles in Crystallography",
          hi: "क्रिस्टल विज्ञान में समबाहु त्रिभुज",
          gu: "ક્રિસ્ટલ વિજ્ઞાનમાં સમબાજુ ત્રિકોણ"
        },
        description: {
          en: "In crystallography, equilateral triangles form the basis of hexagonal crystal structures. The 120° exterior angles create perfect bonding angles for atoms, leading to stable crystal formations. Scientists use these geometric properties to predict crystal growth patterns and design new materials.",
          hi: "क्रिस्टल विज्ञान में, समबाहु त्रिभुज षट्कोणीय क्रिस्टल संरचनाओं का आधार बनाते हैं। 120° बाह्य कोण परमाणुओं के लिए आदर्श बंधन कोण बनाते हैं, जिससे स्थिर क्रिस्टल निर्माण होता है। वैज्ञानिक क्रिस्टल वृद्धि पैटर्न की भविष्यवाणी करने और नई सामग्रियों को डिजाइन करने के लिए इन ज्यामितीय गुणों का उपयोग करते हैं।",
          gu: "ક્રિસ્ટલ વિજ્ઞાનમાં, સમબાજુ ત્રિકોણ ષટ્કોણીય ક્રિસ્ટલ માળખાઓનો આધાર બનાવે છે। 120° બાહ્ય કોણો પરમાણુઓ માટે આદર્શ બંધન કોણો બનાવે છે, જેના પરિણામે સ્થિર ક્રિસ્ટલ નિર્માણ થાય છે। વૈજ્ઞાનિકો ક્રિસ્ટલ વૃદ્ધિ પેટર્નની આગાહી કરવા અને નવી સામગ્રીઓ ડિઝાઇન કરવા માટે આ ભૂમિતીય ગુણધર્મોનો ઉપયોગ કરે છે।"
        },
        calculation: {
          en: "Atomic bonding angle = 120° (optimal for hexagonal structures)",
          hi: "परमाणु बंधन कोण = 120° (षट्कोणीय संरचनाओं के लिए आदर्श)",
          gu: "પરમાણુ બંધન કોણ = 120° (ષટ્કોણીય માળખાઓ માટે આદર્શ)"
        },
        icon: "💎"
      },
      {
        id: 4,
        title: {
          en: "Isosceles Triangles in Navigation",
          hi: "नेविगेशन में समद्विबाहु त्रिभुज",
          gu: "નેવિગેશનમાં સમદ્વિબાજુ ત્રિકોણ"
        },
        description: {
          en: "Navigation systems use isosceles triangles for triangulation and GPS positioning. The equal sides represent equal distances from reference points, while the vertex angle helps calculate precise locations. Surveyors and navigators rely on exterior angle calculations to determine accurate positions and distances in mapping and navigation.",
          hi: "नेविगेशन सिस्टम त्रिकोणीकरण और GPS पोजिशनिंग के लिए समद्विबाहु त्रिभुज का उपयोग करते हैं। समान भुजाएं संदर्भ बिंदुओं से समान दूरी का प्रतिनिधित्व करती हैं, जबकि शीर्ष कोण सटीक स्थानों की गणना करने में मदद करता है। सर्वेक्षक और नाविक मानचित्रण और नेविगेशन में सटीक स्थिति और दूरी निर्धारित करने के लिए बाह्य कोण गणनाओं पर निर्भर करते हैं।",
          gu: "નેવિગેશન સિસ્ટમ્સ ત્રિકોણીકરણ અને GPS પોઝિશનિંગ માટે સમદ્વિબાજુ ત્રિકોણનો ઉપયોગ કરે છે। સમાન બાજુઓ સંદર્ભ બિંદુઓથી સમાન અંતરનું પ્રતિનિધિત્વ કરે છે, જ્યારે શિરોબિંદુ કોણ સચોટ સ્થાનોની ગણતરી કરવામાં મદદ કરે છે। સર્વેક્ષકો અને નાવિકો મેપિંગ અને નેવિગેશનમાં સચોટ સ્થિતિ અને અંતર નક્કી કરવા માટે બાહ્ય કોણ ગણતરીઓ પર આધાર રાખે છે।"
        },
        calculation: {
          en: "Position angle = 180° - base angle (for accurate triangulation)",
          hi: "स्थिति कोण = 180° - आधार कोण (सटीक त्रिकोणीकरण के लिए)",
          gu: "સ્થિતિ કોણ = 180° - આધાર કોણ (સચોટ ત્રિકોણીકરણ માટે)"
        },
        icon: "🧭"
      },
      {
        id: 5,
        title: {
          en: "Equilateral Triangles in Art & Design",
          hi: "कला और डिजाइन में समबाहु त्रिभुज",
          gu: "કલા અને ડિઝાઇનમાં સમબાજુ ત્રિકોણ"
        },
        description: {
          en: "Artists and designers use equilateral triangles to create harmonious compositions and optical illusions. The 120° exterior angles create perfect geometric patterns in Islamic art, Celtic designs, and modern graphic design. The mathematical precision of these angles helps create visually appealing and balanced artistic works.",
          hi: "कलाकार और डिजाइनर सामंजस्यपूर्ण रचनाएं और ऑप्टिकल भ्रम बनाने के लिए समबाहु त्रिभुज का उपयोग करते हैं। 120° बाह्य कोण इस्लामी कला, सेल्टिक डिजाइन और आधुनिक ग्राफिक डिजाइन में आदर्श ज्यामितीय पैटर्न बनाते हैं। इन कोणों की गणितीय सटीकता दृश्य रूप से आकर्षक और संतुलित कलात्मक कार्यों को बनाने में मदद करती है।",
          gu: "કલાકારો અને ડિઝાઇનરો સુમેળસૂચક રચનાઓ અને ઓપ્ટિકલ ભ્રમ બનાવવા માટે સમબાજુ ત્રિકોણનો ઉપયોગ કરે છે। 120° બાહ્ય કોણો ઇસ્લામિક કલા, સેલ્ટિક ડિઝાઇન અને આધુનિક ગ્રાફિક ડિઝાઇનમાં આદર્શ ભૂમિતીય પેટર્ન બનાવે છે। આ કોણોની ગાણિતિક સચોટતા દૃશ્ય રીતે આકર્ષક અને સંતુલિત કલાત્મક કાર્યો બનાવવામાં મદદ કરે છે।"
        },
        calculation: {
          en: "Design angle = 120° (creates perfect geometric harmony)",
          hi: "डिजाइन कोण = 120° (आदर्श ज्यामितीय सामंजस्य बनाता है)",
          gu: "ડિઝાઇન કોણ = 120° (આદર્શ ભૂમિતીય સુમેળ બનાવે છે)"
        },
        icon: "🎨"
      },
      {
        id: 6,
        title: {
          en: "Isosceles Triangles in Engineering",
          hi: "इंजीनियरिंग में समद्विबाहु त्रिभुज",
          gu: "ઇજનેરીમાં સમદ્વિબાજુ ત્રિકોણ"
        },
        description: {
          en: "Mechanical engineers use isosceles triangles in gear design, machine components, and structural supports. The symmetry of equal sides provides balanced force distribution, while exterior angle calculations help optimize mechanical efficiency. These triangles are essential in designing stable frameworks for machinery and equipment.",
          hi: "मैकेनिकल इंजीनियर गियर डिजाइन, मशीन घटकों और संरचनात्मक समर्थन में समद्विबाहु त्रिभुज का उपयोग करते हैं। समान भुजाओं की सममिति संतुलित बल वितरण प्रदान करती है, जबकि बाह्य कोण गणनाएं यांत्रिक दक्षता को अनुकूलित करने में मदद करती हैं। ये त्रिभुज मशीनरी और उपकरणों के लिए स्थिर फ्रेमवर्क डिजाइन करने में आवश्यक हैं।",
          gu: "મિકેનિકલ ઇજનેરો ગિયર ડિઝાઇન, મશીન ઘટકો અને માળખાકીય સમર્થનમાં સમદ્વિબાજુ ત્રિકોણનો ઉપયોગ કરે છે। સમાન બાજુઓની સમમિતિ સંતુલિત બળ વિતરણ પ્રદાન કરે છે, જ્યારે બાહ્ય કોણ ગણતરીઓ મિકેનિકલ કાર્યક્ષમતાને ઑપ્ટિમાઇઝ કરવામાં મદદ કરે છે। આ ત્રિકોણો મશીનરી અને સાધનો માટે સ્થિર ફ્રેમવર્ક ડિઝાઇન કરવામાં આવશ્યક છે।"
        },
        calculation: {
          en: "Force angle = 180° - vertex angle (optimizes mechanical advantage)",
          hi: "बल कोण = 180° - शीर्ष कोण (यांत्रिक लाभ को अनुकूलित करता है)",
          gu: "બળ કોણ = 180° - શિરોબિંદુ કોણ (મિકેનિકલ લાભને ઑપ્ટિમાઇઝ કરે છે)"
        },
        icon: "⚙️"
      }
    ];

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-6 md:p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gradient-teal-purple mb-4">
              🌍 {language === 'hi' ? 'वास्तविक दुनिया के अनुप्रयोग' : language === 'gu' ? 'વાસ્તવિક વિશ્વના ઉપયોગો' : 'Real World Applications'}
            </h2>
            <p className="text-lg text-gray-600">
              {language === 'hi' 
                ? 'उन्नत बाह्य कोण गुणों के वास्तविक जीवन में उपयोग के उदाहरण'
                : language === 'gu' 
                ? 'ઉન્નત બાહ્ય કોણ ગુણધર્મોના વાસ્તવિક જીવનમાં ઉપયોગના ઉદાહરણો'
                : 'Examples of advanced exterior angle properties in real life'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {realWorldExamples.map((example) => (
              <div key={example.id} className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-gray-100">
                <div className="text-center mb-4">
                  <div className="text-5xl mb-3">{example.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {example.title[language]}
                  </h3>
          </div>
          
                <div className="space-y-4">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {example.description[language]}
                  </p>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      {language === 'hi' ? 'गणना:' : language === 'gu' ? 'ગણતરી:' : 'Calculation:'}
                    </h4>
                    <p className="text-blue-800 font-mono text-sm">
                      {example.calculation[language]}
                    </p>
            </div>
          </div>
            </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {language === 'hi' ? 'क्यों महत्वपूर्ण है?' : language === 'gu' ? 'શા માટે મહત્વપૂર્ણ છે?' : 'Why is it Important?'}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {language === 'hi' 
                  ? 'उन्नत बाह्य कोण गुण न केवल गणित में बल्कि आधुनिक तकनीक और इंजीनियरिंग में भी महत्वपूर्ण हैं। ये गुण हमें जटिल संरचनाओं को डिजाइन करने, सटीक माप करने और नवीन समाधान विकसित करने में मदद करते हैं।'
                  : language === 'gu' 
                  ? 'ઉન્નત બાહ્ય કોણ ગુણધર્મો માત્ર ગણિતમાં જ નહીં, પણ આધુનિક ટેકનોલોજી અને ઇજનેરીમાં પણ મહત્વપૂર્ણ છે। આ ગુણધર્મો આપણને જટિલ માળખાઓ ડિઝાઇન કરવા, સચોટ માપ કરવા અને નવીન ઉકેલો વિકસાવવામાં મદદ કરે છે।'
                  : 'Advanced exterior angle properties are important not only in mathematics but also in modern technology and engineering. These properties help us design complex structures, make precise measurements, and develop innovative solutions.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

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

export default AdvancedExteriorAnglesTool;
