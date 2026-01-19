import React, { useState, useEffect } from 'react';

interface Point {
  x: number;
  y: number;
}

interface Translations {
    [key: string]: string;
}

const PythagorasTheoremTool: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<'demonstration' | 'practice' | 'realworld'>('demonstration');
  const [language, setLanguage] = useState<'en' | 'hi' | 'gu'>(() => {
    const savedLanguage = localStorage.getItem('ch6-6-8-language');
    return (savedLanguage as 'en' | 'hi' | 'gu') || 'en';
  });
  // Practice mode state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>(new Array(6).fill(''));
  const [showOverview, setShowOverview] = useState(false);
  const [practiceScore, setPracticeScore] = useState(0);
  
  // Demonstration mode state
  const [step, setStep] = useState(0);

  const translations: Record<'en' | 'hi' | 'gu', Translations> = {
    en: {
      chapterTitle: "Chapter 6: Triangles",
      topicTitle: "Pythagoras Theorem",
      whatIsTopic: "Explore the relationship between sides of right triangles",
      learning: "Learn",
      practice: "Practice",
      realWorldApplications: "Real World Applications",
      visualization: "Pythagoras Theorem",
      dragVerticesInstruction: "Drag the vertices to explore different right triangles and verify the theorem",
      interiorElements: "Show Squares",
      exteriorElements: "Show Measurements",
      definition: "Definition",
      definitionText: "In a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides.",
      keyComponents: "Key Components",
      keyComponentsText: "Right triangle has three sides: two legs and one hypotenuse. The theorem relates their lengths.",
      keyProperty: "Key Property",
      keyPropertyText: "a² + b² = c², where c is the hypotenuse and a, b are the legs.",
      justification: "Mathematical Justification",
      justificationText: "This relationship is fundamental in geometry and has numerous practical applications.",
      practicalApplications: "Practical Applications",
      practicalApplicationsText: "Used in construction, navigation, engineering, and computer graphics.",
      mathematicalExample: "Example",
      given: "Given",
      exteriorAngleGiven: "Right triangle with legs 3 and 4",
      find: "Find",
      findOtherAngle: "Length of hypotenuse",
      practiceExercises: "Practice Exercises",
      architecture: "Construction",
      architectureDesc: "Builders use the theorem to ensure walls are perpendicular and structures are square",
      navigation: "Navigation",
      navigationDesc: "GPS systems use triangulation based on the Pythagorean theorem for positioning",
      engineering: "Engineering",
      engineeringDesc: "Structural analysis and design using right triangle relationships",
      artDesign: "Computer Graphics",
      artDesignDesc: "3D graphics and game development rely on distance calculations using the theorem",
      surveying: "Astronomy",
      surveyingDesc: "Astronomers calculate distances between celestial objects using triangular relationships",
      computerGraphics: "Architecture",
      computerGraphicsDesc: "Architects design triangular structures ensuring proper proportions and stability",
      physics: "Physics",
      physicsDesc: "Wave propagation and force analysis in triangular systems"
    },
    hi: {
      chapterTitle: "अध्याय 6: त्रिभुज",
      topicTitle: "पाइथागोरस प्रमेय",
      whatIsTopic: "समकोण त्रिभुज की भुजाओं के बीच संबंध का अन्वेषण करें",
      learning: "सीखें",
      practice: "अभ्यास",
      realWorldApplications: "वास्तविक दुनिया के अनुप्रयोग",
      visualization: "पाइथागोरस प्रमेय",
      dragVerticesInstruction: "विभिन्न समकोण त्रिभुजों का अन्वेषण करने और प्रमेय को सत्यापित करने के लिए शीर्षों को खींचें",
      interiorElements: "वर्ग दिखाएं",
      exteriorElements: "माप दिखाएं",
      definition: "परिभाषा",
      definitionText: "समकोण त्रिभुज में, कर्ण का वर्ग अन्य दो भुजाओं के वर्गों के योग के बराबर होता है।",
      keyComponents: "मुख्य घटक",
      keyComponentsText: "समकोण त्रिभुज में तीन भुजाएं होती हैं: दो पैर और एक कर्ण। प्रमेय उनकी लंबाई से संबंधित है।",
      keyProperty: "मुख्य गुण",
      keyPropertyText: "a² + b² = c², जहाँ c कर्ण है और a, b पैर हैं।",
      justification: "गणितीय औचित्य",
      justificationText: "यह संबंध ज्यामिति में मौलिक है और कई व्यावहारिक अनुप्रयोग हैं।",
      practicalApplications: "व्यावहारिक अनुप्रयोग",
      practicalApplicationsText: "निर्माण, नेविगेशन, इंजीनियरिंग और कंप्यूटर ग्राफिक्स में उपयोग किया जाता है।",
      mathematicalExample: "उदाहरण",
      given: "दिया गया",
      exteriorAngleGiven: "पैर 3 और 4 वाला समकोण त्रिभुज",
      find: "ज्ञात करें",
      findOtherAngle: "कर्ण की लंबाई",
      practiceExercises: "अभ्यास अभ्यास",
      architecture: "निर्माण",
      architectureDesc: "बिल्डर दीवारों को लंबवत सुनिश्चित करने और संरचनाओं को वर्गाकार बनाने के लिए प्रमेय का उपयोग करते हैं",
      navigation: "नेविगेशन",
      navigationDesc: "GPS सिस्टम स्थिति निर्धारण के लिए पाइथागोरस प्रमेय पर आधारित त्रिकोणीकरण का उपयोग करते हैं",
      engineering: "इंजीनियरिंग",
      engineeringDesc: "समकोण त्रिभुज संबंधों का उपयोग करके संरचनात्मक विश्लेषण और डिजाइन",
      artDesign: "कंप्यूटर ग्राफिक्स",
      artDesignDesc: "3D ग्राफिक्स और गेम डेवलपमेंट प्रमेय का उपयोग करके दूरी गणना पर निर्भर करते हैं",
      surveying: "खगोल विज्ञान",
      surveyingDesc: "खगोलविद त्रिकोणीय संबंधों का उपयोग करके खगोलीय वस्तुओं के बीच की दूरियों की गणना करते हैं",
      computerGraphics: "स्थापत्य",
      computerGraphicsDesc: "स्थापत्यकार उचित अनुपात और स्थिरता सुनिश्चित करते हुए त्रिकोणीय संरचनाओं को डिजाइन करते हैं",
      physics: "भौतिकी",
      physicsDesc: "त्रिकोणीय सिस्टम में तरंग प्रसार और बल विश्लेषण"
    },
    gu: {
      chapterTitle: "પ્રકરણ 6: ત્રિકોણ",
      topicTitle: "પાયથાગોરસ પ્રમેય",
      whatIsTopic: "સમકોણ ત્રિકોણની બાજુઓ વચ્ચેના સંબંધનું અન્વેષણ કરો",
      learning: "શીખો",
      practice: "અભ્યાસ",
      realWorldApplications: "વાસ્તવિક વિશ્વના ઉપયોગો",
      visualization: "પાયથાગોરસ પ્રમેય",
      dragVerticesInstruction: "વિવિધ સમકોણ ત્રિકોણોનું અન્વેષણ કરવા અને પ્રમેયને ચકાસવા માટે શિરોબિંદુઓને ખેંચો",
      interiorElements: "ચોરસ બતાવો",
      exteriorElements: "માપ બતાવો",
      definition: "વ્યાખ્યા",
      definitionText: "સમકોણ ત્રિકોણમાં, કર્ણનો વર્ગ અન્ય બે બાજુઓના વર્ગોના સરવાળા જેટલો હોય છે।",
      keyComponents: "મુખ્ય ઘટકો",
      keyComponentsText: "સમકોણ ત્રિકોણમાં ત્રણ બાજુઓ હોય છે: બે પગ અને એક કર્ણ। પ્રમેય તેમની લંબાઈ સાથે સંબંધિત છે।",
      keyProperty: "મુખ્ય ગુણધર્મો",
      keyPropertyText: "a² + b² = c², જ્યાં c કર્ણ છે અને a, b પગ છે।",
      justification: "ગાણિતિક યોગ્યતા",
      justificationText: "આ સંબંધ ભૂમિતિમાં મૂળભૂત છે અને અસંખ્ય વ્યવહારિક ઉપયોગો છે।",
      practicalApplications: "વ્યવહારિક ઉપયોગો",
      practicalApplicationsText: "નિર્માણ, નેવિગેશન, એન્જિનિયરિંગ અને કમ્પ્યુટર ગ્રાફિક્સમાં ઉપયોગ થાય છે।",
      mathematicalExample: "ઉદાહરણ",
      given: "આપેલ",
      exteriorAngleGiven: "પગ 3 અને 4 સાથે સમકોણ ત્રિકોણ",
      find: "શોધો",
      findOtherAngle: "કર્ણની લંબાઈ",
      practiceExercises: "અભ્યાસ કસરતો",
      architecture: "નિર્માણ",
      architectureDesc: "બિલ્ડરો દિવાલોને લંબ સુનિશ્ચિત કરવા અને માળખાઓને ચોરસ બનાવવા માટે પ્રમેયનો ઉપયોગ કરે છે",
      navigation: "નેવિગેશન",
      navigationDesc: "GPS સિસ્ટમ્સ સ્થિતિ નિર્ધારણ માટે પાયથાગોરસ પ્રમેય પર આધારિત ત્રિકોણીકરણનો ઉપયોગ કરે છે",
      engineering: "એન્જિનિયરિંગ",
      engineeringDesc: "સમકોણ ત્રિકોણ સંબંધોનો ઉપયોગ કરીને માળખાકીય વિશ્લેષણ અને ડિઝાઇન",
      artDesign: "કમ્પ્યુટર ગ્રાફિક્સ",
      artDesignDesc: "3D ગ્રાફિક્સ અને ગેમ ડેવલપમેન્ટ પ્રમેયનો ઉપયોગ કરીને દૂરી ગણતરી પર આધાર રાખે છે",
      surveying: "ખગોળ વિજ્ઞાન",
      surveyingDesc: "ખગોળવિદો ત્રિકોણાકાર સંબંધોનો ઉપયોગ કરીને ખગોળીય વસ્તુઓ વચ્ચેની દૂરીઓની ગણતરી કરે છે",
      computerGraphics: "સ્થાપત્ય",
      computerGraphicsDesc: "સ્થાપત્યકાર યોગ્ય પ્રમાણ અને સ્થિરતા સુનિશ્ચિત કરતા ત્રિકોણાકાર માળખાઓને ડિઝાઇન કરે છે",
      physics: "ભૌતિકશાસ્ત્ર",
      physicsDesc: "ત્રિકોણાકાર સિસ્ટમ્સમાં તરંગ પ્રસાર અને બળ વિશ્લેષણ"
    }
  };

  const t = translations[language];

  // Practice Questions Data
  const practiceQuestions = [
    {
      id: 1,
      question: {
        en: "A right triangle has legs of length 3 and 4. What is the length of the hypotenuse?",
        hi: "एक समकोण त्रिभुज की भुजाएं 3 और 4 हैं। कर्ण की लंबाई क्या है?",
        gu: "સમકોણ ત્રિકોણની બાજુઓ 3 અને 4 છે। કર્ણની લંબાઈ કેટલી છે?"
      },
      answer: 5,
      explanation: {
        en: "Using a² + b² = c²: 3² + 4² = 9 + 16 = 25, so c = √25 = 5",
        hi: "a² + b² = c² का उपयोग करके: 3² + 4² = 9 + 16 = 25, इसलिए c = √25 = 5",
        gu: "a² + b² = c² નો ઉપયોગ કરીને: 3² + 4² = 9 + 16 = 25, તેથી c = √25 = 5"
      }
    },
    {
      id: 2,
      question: {
        en: "A ladder 10 meters long leans against a wall. The base is 6 meters from the wall. How high does the ladder reach?",
        hi: "10 मीटर लंबी सीढ़ी दीवार के सहारे खड़ी है। आधार दीवार से 6 मीटर दूर है। सीढ़ी कितनी ऊंचाई तक पहुंचती है?",
        gu: "10 મીટર લાંબી સીડી દિવાલ પર ટેકવાયેલી છે। આધાર દિવાલથી 6 મીટર દૂર છે। સીડી કેટલી ઊંચાઈ સુધી પહોંચે છે?"
      },
      answer: 8,
      explanation: {
        en: "Using a² + b² = c²: 6² + h² = 10², so 36 + h² = 100, h² = 64, h = 8",
        hi: "a² + b² = c² का उपयोग करके: 6² + h² = 10², इसलिए 36 + h² = 100, h² = 64, h = 8",
        gu: "a² + b² = c² નો ઉપયોગ કરીને: 6² + h² = 10², તેથી 36 + h² = 100, h² = 64, h = 8"
      }
    },
    {
      id: 3,
      question: {
        en: "A right triangle has hypotenuse 13 and one leg 5. What is the length of the other leg?",
        hi: "एक समकोण त्रिभुज का कर्ण 13 है और एक भुजा 5 है। दूसरी भुजा की लंबाई क्या है?",
        gu: "સમકોણ ત્રિકોણનો કર્ણ 13 છે અને એક બાજુ 5 છે। બીજી બાજુની લંબાઈ કેટલી છે?"
      },
      answer: 12,
      explanation: {
        en: "Using a² + b² = c²: 5² + b² = 13², so 25 + b² = 169, b² = 144, b = 12",
        hi: "a² + b² = c² का उपयोग करके: 5² + b² = 13², इसलिए 25 + b² = 169, b² = 144, b = 12",
        gu: "a² + b² = c² નો ઉપયોગ કરીને: 5² + b² = 13², તેથી 25 + b² = 169, b² = 144, b = 12"
      }
    },
    {
      id: 4,
      question: {
        en: "A rectangular field is 8 meters wide and 15 meters long. What is the diagonal distance across the field?",
        hi: "एक आयताकार मैदान 8 मीटर चौड़ा और 15 मीटर लंबा है। मैदान के आर-पार विकर्ण दूरी क्या है?",
        gu: "આયતાકાર મેદાન 8 મીટર પહોળું અને 15 મીટર લાંબું છે। મેદાનના આર-પાર વિકર્ણ દૂરી કેટલી છે?"
      },
      answer: 17,
      explanation: {
        en: "Using a² + b² = c²: 8² + 15² = 64 + 225 = 289, so c = √289 = 17",
        hi: "a² + b² = c² का उपयोग करके: 8² + 15² = 64 + 225 = 289, इसलिए c = √289 = 17",
        gu: "a² + b² = c² નો ઉપયોગ કરીને: 8² + 15² = 64 + 225 = 289, તેથી c = √289 = 17"
      }
    },
    {
      id: 5,
      question: {
        en: "A right triangle has legs of length 7 and 24. What is the length of the hypotenuse?",
        hi: "एक समकोण त्रिभुज की भुजाएं 7 और 24 हैं। कर्ण की लंबाई क्या है?",
        gu: "સમકોણ ત્રિકોણની બાજુઓ 7 અને 24 છે। કર્ણની લંબાઈ કેટલી છે?"
      },
      answer: 25,
      explanation: {
        en: "Using a² + b² = c²: 7² + 24² = 49 + 576 = 625, so c = √625 = 25",
        hi: "a² + b² = c² का उपयोग करके: 7² + 24² = 49 + 576 = 625, इसलिए c = √625 = 25",
        gu: "a² + b² = c² નો ઉપયોગ કરીને: 7² + 24² = 49 + 576 = 625, તેથી c = √625 = 25"
      }
    },
    {
      id: 6,
      question: {
        en: "A right triangle has hypotenuse 25 and one leg 15. What is the length of the other leg?",
        hi: "एक समकोण त्रिभुज का कर्ण 25 है और एक भुजा 15 है। दूसरी भुजा की लंबाई क्या है?",
        gu: "સમકોણ ત્રિકોણનો કર્ણ 25 છે અને એક બાજુ 15 છે। બીજી બાજુની લંબાઈ કેટલી છે?"
      },
      answer: 20,
      explanation: {
        en: "Using a² + b² = c²: 15² + b² = 25², so 225 + b² = 625, b² = 400, b = 20",
        hi: "a² + b² = c² का उपयोग करके: 15² + b² = 25², इसलिए 225 + b² = 625, b² = 400, b = 20",
        gu: "a² + b² = c² નો ઉપયોગ કરીને: 15² + b² = 25², તેથી 225 + b² = 625, b² = 400, b = 20"
      }
    }
  ];

  // Real World Examples Data
  const realWorldExamples = [
    {
      id: 1,
      title: {
        en: "Construction & Architecture",
        hi: "निर्माण और वास्तुकला",
        gu: "બાંધકામ અને સ્થાપત્ય"
      },
      description: {
        en: "Builders use the Pythagorean theorem to ensure walls are perpendicular and roofs are properly angled. For example, when building a 3-4-5 triangle corner, they verify the diagonal is exactly 5 units.",
        hi: "बिल्डर पाइथागोरस प्रमेय का उपयोग यह सुनिश्चित करने के लिए करते हैं कि दीवारें लंबवत हैं और छतें सही कोण पर हैं। उदाहरण के लिए, 3-4-5 त्रिभुज कोना बनाते समय, वे सत्यापित करते हैं कि विकर्ण बिल्कुल 5 इकाई है।",
        gu: "બિલ્ડરો દિવાલો લંબરૂપ છે અને છત સાચા કોણ પર છે તેની ખાતરી કરવા માટે પાયથાગોરસ પ્રમેયનો ઉપયોગ કરે છે। ઉદાહરણ તરીકે, 3-4-5 ત્રિકોણ કોણ બનાવતી વખતે, તેઓ ચકાસે છે કે વિકર્ણ બરાબર 5 એકમ છે।"
      },
      calculation: {
        en: "3² + 4² = 9 + 16 = 25 = 5²",
        hi: "3² + 4² = 9 + 16 = 25 = 5²",
        gu: "3² + 4² = 9 + 16 = 25 = 5²"
      },
      icon: "🏗️"
    },
    {
      id: 2,
      title: {
        en: "Navigation & GPS",
        hi: "नेविगेशन और GPS",
        gu: "નેવિગેશન અને GPS"
      },
      description: {
        en: "GPS systems calculate distances between points using the Pythagorean theorem. When you're at coordinates (0,0) and want to reach (3,4), the direct distance is √(3² + 4²) = 5 units.",
        hi: "GPS सिस्टम पाइथागोरस प्रमेय का उपयोग करके बिंदुओं के बीच की दूरी की गणना करते हैं। जब आप निर्देशांक (0,0) पर हैं और (3,4) तक पहुंचना चाहते हैं, तो सीधी दूरी √(3² + 4²) = 5 इकाई है।",
        gu: "GPS સિસ્ટમ્સ પાયથાગોરસ પ્રમેયનો ઉપયોગ કરીને બિંદુઓ વચ્ચેની દૂરીની ગણતરી કરે છે। જ્યારે તમે કોઓર્ડિનેટ્સ (0,0) પર છો અને (3,4) સુધી પહોંચવા માંગો છો, તો સીધી દૂરી √(3² + 4²) = 5 એકમ છે।"
      },
      calculation: {
        en: "√(3² + 4²) = √(9 + 16) = √25 = 5",
        hi: "√(3² + 4²) = √(9 + 16) = √25 = 5",
        gu: "√(3² + 4²) = √(9 + 16) = √25 = 5"
      },
      icon: "🧭"
    },
    {
      id: 3,
      title: {
        en: "Computer Graphics",
        hi: "कंप्यूटर ग्राफिक्स",
        gu: "કમ્પ્યુટર ગ્રાફિક્સ"
      },
      description: {
        en: "Video games and 3D graphics use the Pythagorean theorem to calculate distances between objects, determine collision detection, and create realistic lighting effects.",
        hi: "वीडियो गेम और 3D ग्राफिक्स वस्तुओं के बीच की दूरी की गणना, टक्कर का पता लगाने और यथार्थवादी प्रकाश प्रभाव बनाने के लिए पाइथागोरस प्रमेय का उपयोग करते हैं।",
        gu: "વિડિયો ગેમ્સ અને 3D ગ્રાફિક્સ ઑબ્જેક્ટ્સ વચ્ચેની દૂરીની ગણતરી, કોલિઝન ડિટેક્શન નક્કી કરવા અને વાસ્તવિક પ્રકાશ પ્રભાવો બનાવવા માટે પાયથાગોરસ પ્રમેયનો ઉપયોગ કરે છે।"
      },
      calculation: {
        en: "Distance = √((x₂-x₁)² + (y₂-y₁)²)",
        hi: "दूरी = √((x₂-x₁)² + (y₂-y₁)²)",
        gu: "દૂરી = √((x₂-x₁)² + (y₂-y₁)²)"
      },
      icon: "🎮"
    },
    {
      id: 4,
      title: {
        en: "Surveying & Mapping",
        hi: "सर्वेक्षण और मानचित्रण",
        gu: "સર્વેક્ષણ અને નકશાકારી"
      },
      description: {
        en: "Surveyors use the Pythagorean theorem to measure distances and create accurate maps. They establish right angles by creating 3-4-5 triangles to ensure precise measurements.",
        hi: "सर्वेक्षक दूरी मापने और सटीक मानचित्र बनाने के लिए पाइथागोरस प्रमेय का उपयोग करते हैं। वे सटीक माप सुनिश्चित करने के लिए 3-4-5 त्रिभुज बनाकर समकोण स्थापित करते हैं।",
        gu: "સર્વેક્ષકો દૂરી માપવા અને સચોટ નકશા બનાવવા માટે પાયથાગોરસ પ્રમેયનો ઉપયોગ કરે છે। તેઓ સચોટ માપનોની ખાતરી કરવા માટે 3-4-5 ત્રિકોણ બનાવીને સમકોણ સ્થાપિત કરે છે।"
      },
      calculation: {
        en: "3² + 4² = 5² (Perfect right angle)",
        hi: "3² + 4² = 5² (सही समकोण)",
        gu: "3² + 4² = 5² (સંપૂર્ણ સમકોણ)"
      },
      icon: "📐"
    },
    {
      id: 5,
      title: {
        en: "Physics & Engineering",
        hi: "भौतिकी और इंजीनियरिंग",
        gu: "ભૌતિકશાસ્ત્ર અને ઇજનેરી"
      },
      description: {
        en: "Engineers use the Pythagorean theorem to calculate forces, velocities, and distances in mechanical systems. For example, calculating the resultant force when two forces act at right angles.",
        hi: "इंजीनियर यांत्रिक प्रणालियों में बल, वेग और दूरी की गणना के लिए पाइथागोरस प्रमेय का उपयोग करते हैं। उदाहरण के लिए, जब दो बल समकोण पर कार्य करते हैं तो परिणामी बल की गणना करना।",
        gu: "ઇજનેરો યાંત્રિક સિસ્ટમ્સમાં બળ, વેગ અને દૂરીની ગણતરી માટે પાયથાગોરસ પ્રમેયનો ઉપયોગ કરે છે। ઉદાહરણ તરીકે, જ્યારે બે બળો સમકોણ પર કાર્ય કરે છે ત્યારે પરિણામી બળની ગણતરી કરવી।"
      },
      calculation: {
        en: "Resultant = √(F₁² + F₂²)",
        hi: "परिणामी = √(F₁² + F₂²)",
        gu: "પરિણામી = √(F₁² + F₂²)"
      },
      icon: "⚙️"
    },
    {
      id: 6,
      title: {
        en: "Astronomy & Space",
        hi: "खगोल विज्ञान और अंतरिक्ष",
        gu: "ખગોળશાસ્ત્ર અને અવકાશ"
      },
      description: {
        en: "Astronomers use the Pythagorean theorem to calculate distances between celestial objects. For example, determining the distance to a star using parallax measurements and trigonometric relationships.",
        hi: "खगोलविद खगोलीय वस्तुओं के बीच की दूरी की गणना के लिए पाइथागोरस प्रमेय का उपयोग करते हैं। उदाहरण के लिए, लंबन माप और त्रिकोणमितीय संबंधों का उपयोग करके तारे की दूरी निर्धारित करना।",
        gu: "ખગોળવિદો ખગોળીય વસ્તુઓ વચ્ચેની દૂરીની ગણતરી માટે પાયથાગોરસ પ્રમેયનો ઉપયોગ કરે છે। ઉદાહરણ તરીકે, લંબન માપ અને ત્રિકોણમિતીય સંબંધોનો ઉપયોગ કરીને તારાની દૂરી નક્કી કરવી।"
      },
      calculation: {
        en: "Distance = √(parallax₁² + parallax₂²)",
        hi: "दूरी = √(लंबन₁² + लंबन₂²)",
        gu: "દૂરી = √(લંબન₁² + લંબન₂²)"
      },
      icon: "🌌"
    }
  ];

  const handleLanguageChange = (newLanguage: 'en' | 'hi' | 'gu') => {
    setLanguage(newLanguage);
    localStorage.setItem('ch6-6-8-language', newLanguage);
  };

  // Auto-loop through demonstration steps
  useEffect(() => {
    if (currentMode === 'demonstration') {
      const interval = setInterval(() => {
        setStep((prevStep) => (prevStep + 1) % 4);
      }, 4000); // Change step every 4 seconds
      return () => clearInterval(interval);
    }
  }, [currentMode]);






  // Practice mode helper functions
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






  const renderDemonstrationMode = () => {
    const sideA = 3;
    const sideB = 4;
    const sideC = Math.sqrt(sideA * sideA + sideB * sideB);
    const scale = 30;

    const points: Record<string, Point> = {
      A: { x: 250, y: 280 },
      B: { x: 250 + sideB * scale, y: 280 },
      C: { x: 250, y: 280 - sideA * scale },
    };

    const areaA = sideA * sideA;
    const areaB = sideB * sideB;
    const areaC = sideC * sideC;

    const steps = [
      {
        title: language === 'hi' ? 'समकोण त्रिभुज' : language === 'gu' ? 'સમકોણ ત્રિકોણ' : 'Right Triangle',
        description: language === 'hi' 
          ? `भुजाओं a, b और कर्ण c वाले समकोण त्रिभुज से शुरू करें।`
          : language === 'gu' 
          ? `બાજુઓ a, b અને કર્ણ c સાથે સમકોણ ત્રિકોણથી શરૂ કરો।`
          : `Start with a right triangle with sides a, b and hypotenuse c.`,
        show: ['triangle'],
      },
      {
        title: language === 'hi' ? 'भुजाओं की लंबाई' : language === 'gu' ? 'બાજુઓની લંબાઈ' : 'Side Lengths',
        description: language === 'hi' 
          ? `भुजा a = ${sideA}, भुजा b = ${sideB}, कर्ण c = ${Math.round(sideC)}`
          : language === 'gu' 
          ? `બાજુ a = ${sideA}, બાજુ b = ${sideB}, કર્ણ c = ${Math.round(sideC)}`
          : `Side a = ${sideA}, Side b = ${sideB}, Hypotenuse c = ${Math.round(sideC)}`,
        show: ['triangle'],
      },
      {
        title: language === 'hi' ? 'क्षेत्रफल गणना' : language === 'gu' ? 'ક્ષેત્રફળ ગણતરી' : 'Area Calculation',
        description: language === 'hi' 
          ? `a² = ${areaA}, b² = ${areaB}, c² = ${Math.round(areaC)}`
          : language === 'gu' 
          ? `a² = ${areaA}, b² = ${areaB}, c² = ${Math.round(areaC)}`
          : `a² = ${areaA}, b² = ${areaB}, c² = ${Math.round(areaC)}`,
        show: ['triangle'],
      },
      {
        title: language === 'hi' ? 'पाइथागोरस प्रमेय' : language === 'gu' ? 'પાયથાગોરસ પ્રમેય' : 'Pythagorean Theorem',
        description: language === 'hi' 
          ? `पाइथागोरस प्रमेय कहता है: a² + b² = c²\nभुजा a = ${sideA}, भुजा b = ${sideB}, कर्ण c = ${Math.round(sideC)}\na² = ${areaA}, b² = ${areaB}, c² = ${Math.round(areaC)}\n${areaA} + ${areaB} = ${Math.round(areaC)}`
          : language === 'gu' 
          ? `પાયથાગોરસ પ્રમેય કહે છે: a² + b² = c²\nબાજુ a = ${sideA}, બાજુ b = ${sideB}, કર્ણ c = ${Math.round(sideC)}\na² = ${areaA}, b² = ${areaB}, c² = ${Math.round(areaC)}\n${areaA} + ${areaB} = ${Math.round(areaC)}`
          : `The Pythagorean theorem states: a² + b² = c²\nSide a = ${sideA}, Side b = ${sideB}, Hypotenuse c = ${Math.round(sideC)}\na² = ${areaA}, b² = ${areaB}, c² = ${Math.round(areaC)}\n${areaA} + ${areaB} = ${Math.round(areaC)}`,
        show: ['triangle'],
      },
    ];

    const currentStep = steps[step];

    return (
      <div className="space-y-6">
        {/* Pythagorean Visualizer */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-6 md:p-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gradient-teal-purple mb-4">
              📐 {t.visualization}
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              {language === 'hi' 
                ? 'पाइथागोरस प्रमेय का इंटरैक्टिव चरण-दर-चरण स्पष्टीकरण'
                : language === 'gu' 
                ? 'પાયથાગોરસ પ્રમેયનું ઇન્ટરએક્ટિવ પગલું-દર-પગલું સ્પષ્ટતા'
                : 'Interactive step-by-step explanation of the Pythagorean theorem'
              }
              </p>
          </div>
            
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Visualization */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-xl p-8">
              <div className="flex flex-col items-center justify-center min-h-96">
                <svg
                  viewBox="0 0 500 400"
                  className="w-full h-auto border border-gray-200 rounded"
                >
                  {/* Grid */}
                  <defs>
                    <pattern
                      id="grid"
                      width="20"
                      height="20"
                      patternUnits="userSpaceOnUse"
                    >
          <path
                        d="M 20 0 L 0 0 0 20"
            fill="none"
                        stroke="#f0f0f0"
                        strokeWidth="0.5"
                      />
                    </pattern>
                  </defs>
                  <rect width="500" height="400" fill="url(#grid)" />




                  {/* Right Triangle */}
                  {currentStep.show.includes('triangle') && (
                    <>
                      <polygon
                        points={`${points.A.x},${points.A.y} ${points.B.x},${points.B.y} ${points.C.x},${points.C.y}`}
                        fill="#e0e7ff"
                        stroke="#4f46e5"
                        strokeWidth="3"
                      />

                      {/* Right angle indicator */}
            <rect
                        x={points.A.x}
                        y={points.A.y - 15}
                        width="15"
                        height="15"
              fill="none"
                        stroke="#4f46e5"
                        strokeWidth="1"
                      />

                      {/* Labels */}
                      {/* Step 1: Show only a, b, c */}
                      {step === 0 && (
                        <>
                          <text
                            x={(points.A.x + points.C.x) / 2 - 50}
                            y={(points.A.y + points.C.y) / 2}
                            className="text-lg font-bold fill-indigo-900"
                          >
                            a
            </text>
                          <text
                            x={(points.A.x + points.B.x) / 2}
                            y={points.A.y + 30}
                            textAnchor="middle"
                            className="text-lg font-bold fill-indigo-900"
                          >
                            b
            </text>
                          <text
                            x={(points.B.x + points.C.x) / 2 + 25}
                            y={(points.B.y + points.C.y) / 2 - 10}
                            className="text-lg font-bold fill-indigo-900"
                          >
                            c
            </text>
          </>
        )}

                      {/* Step 2: Show values a=3, b=4, c=5 */}
                      {step === 1 && (
                        <>
                          <text
                            x={(points.A.x + points.C.x) / 2 - 50}
                            y={(points.A.y + points.C.y) / 2}
                            className="text-lg font-bold fill-indigo-900"
                          >
                            a={sideA}
            </text>
                          <text
                            x={(points.A.x + points.B.x) / 2}
                            y={points.A.y + 30}
                            textAnchor="middle"
                            className="text-lg font-bold fill-indigo-900"
                          >
                            b={sideB}
            </text>
                          <text
                            x={(points.B.x + points.C.x) / 2 + 25}
                            y={(points.B.y + points.C.y) / 2 - 10}
                            className="text-lg font-bold fill-indigo-900"
                          >
                            c={sideC.toFixed(0)}
            </text>
          </>
        )}

                      {/* Step 3: Show square values a²=9, b²=16, c²=25 */}
                      {step === 2 && (
                        <>
                          <text
                            x={(points.A.x + points.C.x) / 2 - 50}
                            y={(points.A.y + points.C.y) / 2}
                            className="text-lg font-bold fill-red-600"
                          >
                            a²={areaA}
          </text>
                          <text
                            x={(points.A.x + points.B.x) / 2}
                            y={points.A.y + 30}
                            textAnchor="middle"
                            className="text-lg font-bold fill-red-600"
                          >
                            b²={areaB}
                          </text>
                          <text
                            x={(points.B.x + points.C.x) / 2 + 25}
                            y={(points.B.y + points.C.y) / 2 - 10}
                            className="text-lg font-bold fill-red-600"
                          >
                            c²={Math.round(areaC)}
                          </text>
                        </>
                      )}

                      {/* Step 4: Show all details (both values and squares) */}
                      {step === 3 && (
                        <>
                          {/* Side values */}
                          <text
                            x={(points.A.x + points.C.x) / 2 - 50}
                            y={(points.A.y + points.C.y) / 2}
                            className="text-lg font-bold fill-indigo-900"
                          >
                            a={sideA}
        </text>
                          <text
                            x={(points.A.x + points.B.x) / 2}
                            y={points.A.y + 30}
                            textAnchor="middle"
                            className="text-lg font-bold fill-indigo-900"
                          >
                            b={sideB}
                          </text>
                          <text
                            x={(points.B.x + points.C.x) / 2 + 25}
                            y={(points.B.y + points.C.y) / 2 - 10}
                            className="text-lg font-bold fill-indigo-900"
                          >
                            c={sideC.toFixed(0)}
                          </text>
                          
                          {/* Square values */}
                          <text
                            x={(points.A.x + points.C.x) / 2 - 50}
                            y={(points.A.y + points.C.y) / 2 + 25}
                            className="text-sm font-bold fill-red-600"
                          >
                            a²={areaA}
                          </text>
                          <text
                            x={(points.A.x + points.B.x) / 2}
                            y={points.A.y + 55}
                            textAnchor="middle"
                            className="text-sm font-bold fill-red-600"
                          >
                            b²={areaB}
                          </text>
                          <text
                            x={(points.B.x + points.C.x) / 2 + 25}
                            y={(points.B.y + points.C.y) / 2 + 15}
                            className="text-sm font-bold fill-red-600"
                          >
                            c²={Math.round(areaC)}
                          </text>
                        </>
                      )}

                      {/* Vertices */}
                      <circle cx={points.A.x} cy={points.A.y} r="4" fill="#4f46e5" />
                      <circle cx={points.B.x} cy={points.B.y} r="4" fill="#4f46e5" />
                      <circle cx={points.C.x} cy={points.C.y} r="4" fill="#4f46e5" />

                      {/* Vertex Labels */}
                      <text
                        x={points.A.x - 20}
                        y={points.A.y + 25}
                        className="text-lg font-bold fill-indigo-900"
                      >
                        A
                      </text>
                      <text
                        x={points.B.x + 15}
                        y={points.B.y + 25}
                        className="text-lg font-bold fill-indigo-900"
                      >
                        B
                      </text>
                      <text
                        x={points.C.x - 20}
                        y={points.C.y - 15}
                        className="text-lg font-bold fill-indigo-900"
                      >
                        C
                      </text>
                    </>
                  )}

                </svg>
          </div>
          </div>
          
            {/* Controls and Explanation */}
            <div className="flex flex-col gap-6">
              {/* Static Definition Block */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-indigo-900 mb-4">
                  {language === 'hi' ? 'परिभाषा' : language === 'gu' ? 'વ્યાખ્યા' : 'Definition'}
                </h2>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border-l-4 border-indigo-500">
                    <h3 className="font-semibold text-indigo-900 mb-2">
                      {language === 'hi' ? 'पाइथागोरस प्रमेय' : language === 'gu' ? 'પાયથાગોરસ પ્રમેય' : 'Pythagorean Theorem'}
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {language === 'hi' 
                        ? 'समकोण त्रिभुज में, कर्ण का वर्ग अन्य दो भुजाओं के वर्गों के योग के बराबर होता है।'
                        : language === 'gu' 
                        ? 'સમકોણ ત્રિકોણમાં, કર્ણનો વર્ગ અન્ય બે બાજુઓના વર્ગોના સરવાળા જેટલો હોય છે।'
                        : 'In a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides.'
                      }
                    </p>
              </div>
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4 border-l-4 border-teal-500">
                    <h3 className="font-semibold text-teal-900 mb-2">
                      {language === 'hi' ? 'सूत्र' : language === 'gu' ? 'સૂત્ર' : 'Formula'}
                    </h3>
                    <p className="text-gray-700 text-lg font-mono text-center">
                      a² + b² = c²
                    </p>
            </div>
                </div>
              </div>

              {/* Dynamic Step-by-Step Block */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-indigo-900">
                    {currentStep.title}
                  </h2>
                  <span className="text-sm font-semibold bg-indigo-100 text-indigo-900 px-3 py-1 rounded-full">
                    {language === 'hi' ? 'चरण' : language === 'gu' ? 'પગલું' : 'Step'} {step + 1}/{steps.length}
                  </span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap mb-8">
                  {currentStep.description}
                </p>

                {/* Step Indicators */}
                <div className="flex gap-2 mb-8">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 flex-1 rounded-full transition-all ${
                        index === step
                          ? 'bg-indigo-600'
                          : 'bg-indigo-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPracticeMode = () => {
    const currentQ = practiceQuestions[currentQuestion];

    if (showOverview) {
      return (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-6 md:p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gradient-teal-purple mb-4">
                {language === 'hi' ? '📊 अभ्यास सारांश' : language === 'gu' ? '📊 અભ્યાસ સારાંશ' : '📊 Practice Overview'}
              </h2>
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
                      </span> {question.answer}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">{question.explanation[language]}</div>
                  </div>
                );
              })}
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
    );
  };

  const renderRealWorldApplications = () => (
      <div className="space-y-6">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-6 md:p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gradient-teal-purple mb-4">
            🌍 {language === 'hi' ? 'वास्तविक दुनिया के अनुप्रयोग' : language === 'gu' ? 'વાસ્તવિક વિશ્વના ઉપયોગો' : 'Real World Applications'}
          </h2>
          <p className="text-lg text-gray-600">
            {language === 'hi' 
              ? 'पाइथागोरस प्रमेय के वास्तविक जीवन में उपयोग के उदाहरण'
              : language === 'gu' 
              ? 'પાયથાગોરસ પ્રમેયના વાસ્તવિક જીવનમાં ઉપયોગના ઉદાહરણો'
              : 'Examples of Pythagorean theorem applications in real life'
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
                ? 'पाइथागोरस प्रमेय न केवल गणित में बल्कि दैनिक जीवन में भी महत्वपूर्ण है। यह हमें सटीक माप, दूरी की गणना और यहां तक कि तकनीकी नवाचारों में भी मदद करता है।'
                : language === 'gu' 
                ? 'પાયથાગોરસ પ્રમેય માત્ર ગણિતમાં જ નહીં, પણ દૈનિક જીવનમાં પણ મહત્વપૂર્ણ છે। તે આપણને સચોટ માપ, દૂરીની ગણતરી અને તકનીકી નવીનતાઓમાં પણ મદદ કરે છે।'
                : 'The Pythagorean theorem is important not only in mathematics but also in daily life. It helps us with accurate measurements, distance calculations, and even in technological innovations.'
              }
            </p>
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

export default PythagorasTheoremTool;
