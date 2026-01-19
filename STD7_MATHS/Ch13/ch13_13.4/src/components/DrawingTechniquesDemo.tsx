import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface DrawingTechniquesDemoProps {
  language: 'en' | 'hi' | 'gu';
}

const ObliqueSketchDemo: React.FC<{ language: 'en' | 'hi' | 'gu' }> = ({ language }) => {
  const [step, setStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  const translations = {
    en: {
      title: "Oblique Sketch Tutorial",
      subtitle: "Learn how to draw 3D solids on a 2D surface",
      step1: "Step 1: Draw the Front Face",
      step2: "Step 2: Draw the Opposite Face", 
      step3: "Step 3: Join Corresponding Corners",
      step4: "Step 4: Add Hidden Edges",
      step1Desc: "Start by drawing the front face of the cube",
      step2Desc: "Draw the back face, slightly offset to create depth",
      step3Desc: "Connect the matching corners with solid lines",
      step4Desc: "Use dotted lines for edges that would be hidden",
      front: "Front",
      back: "Back",
      keyPoints: "Key Points:",
      point1: "Front and back faces are the same size",
      point2: "Measurements are not to exact scale",
      point3: "Dotted lines show hidden edges",
      point4: "Back face is offset to create depth",
      autoPlay: "Auto Play",
      pause: "Pause",
      replay: "Replay",
      reset: "Reset",
      tip: "Practice on squared paper for best results! Click the step numbers to jump to any step."
    },
    hi: {
      title: "तिरछे स्केच ट्यूटोरियल",
      subtitle: "2D सतह पर 3D ठोस आकृतियां बनाना सीखें",
      step1: "चरण 1: सामने का फलक खींचें",
      step2: "चरण 2: विपरीत फलक खींचें",
      step3: "चरण 3: संबंधित कोनों को जोड़ें",
      step4: "चरण 4: छुपी हुई किनारे जोड़ें",
      step1Desc: "घन के सामने के फलक को खींचकर शुरू करें",
      step2Desc: "गहराई बनाने के लिए पीछे का फलक थोड़ा ऑफसेट करके खींचें",
      step3Desc: "मिलान वाले कोनों को ठोस रेखाओं से जोड़ें",
      step4Desc: "छुपी हुई किनारों के लिए बिंदुओं वाली रेखाएं उपयोग करें",
      front: "सामने",
      back: "पीछे",
      keyPoints: "मुख्य बिंदु:",
      point1: "सामने और पीछे के फलक समान आकार के होते हैं",
      point2: "माप सटीक पैमाने पर नहीं होते",
      point3: "बिंदुओं वाली रेखाएं छुपी हुई किनारों को दिखाती हैं",
      point4: "गहराई बनाने के लिए पीछे का फलक ऑफसेट होता है",
      autoPlay: "स्वचालित चलाएं",
      pause: "रोकें",
      replay: "फिर से चलाएं",
      reset: "रीसेट",
      tip: "सबसे अच्छे परिणामों के लिए वर्गाकार कागज पर अभ्यास करें! किसी भी चरण पर जाने के लिए चरण संख्याओं पर क्लिक करें।"
    },
    gu: {
      title: "ત્રાંસા સ્કેચ ટ્યુટોરિયલ",
      subtitle: "2D સપાટ પર 3D ઘન આકૃતિઓ દોરવાનું શીખો",
      step1: "પગલું 1: આગળનો ફલક દોરો",
      step2: "પગલું 2: વિરુદ્ધ ફલક દોરો",
      step3: "પગલું 3: સંબંધિત ખૂણાઓને જોડો",
      step4: "પગલું 4: છુપાયેલા કિનારા ઉમેરો",
      step1Desc: "ઘનના આગળના ફલકને દોરીને શરૂ કરો",
      step2Desc: "ઊંડાઈ બનાવવા માટે પાછળના ફલકને થોડો ઓફસેટ કરીને દોરો",
      step3Desc: "મેચિંગ ખૂણાઓને ઘન રેખાઓ સાથે જોડો",
      step4Desc: "છુપાયેલા કિનારાઓ માટે ડોટેડ રેખાઓ ઉપયોગ કરો",
      front: "આગળ",
      back: "પાછળ",
      keyPoints: "મુખ્ય બિંદુઓ:",
      point1: "આગળ અને પાછળના ફલક સમાન કદના હોય છે",
      point2: "માપ ચોક્કસ સ્કેલ પર નથી હોતા",
      point3: "ડોટેડ રેખાઓ છુપાયેલા કિનારાઓને બતાવે છે",
      point4: "ઊંડાઈ બનાવવા માટે પાછળનો ફલક ઓફસેટ હોય છે",
      autoPlay: "સ્વચાલિત ચલાવો",
      pause: "રોકો",
      replay: "ફરી ચલાવો",
      reset: "રીસેટ",
      tip: "સર્વોત્તમ પરિણામો માટે ચોરસ કાગળ પર અભ્યાસ કરો! કોઈપણ પગલા પર જવા માટે પગલા નંબરો પર ક્લિક કરો।"
    }
  };

  const t = translations[language];

  const steps = [
    { title: t.step1, description: t.step1Desc },
    { title: t.step2, description: t.step2Desc },
    { title: t.step3, description: t.step3Desc },
    { title: t.step4, description: t.step4Desc }
  ];

  useEffect(() => {
    if (autoPlay && step < 3) {
      const timer = setTimeout(() => {
        setStep(prev => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    } else if (autoPlay && step === 3) {
      setAutoPlay(false);
    }
  }, [autoPlay, step]);

  const reset = () => {
    setStep(0);
    setAutoPlay(false);
  };

  const togglePlay = () => {
    if (step === 3) {
      reset();
      setAutoPlay(true);
    } else {
      setAutoPlay(!autoPlay);
    }
  };

  const GridBackground = () => (
    <svg className="absolute inset-0 w-full h-full opacity-20" style={{ zIndex: 0 }}>
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="gray" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
            <p className="text-indigo-100">{t.subtitle}</p>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Canvas Area */}
            <div className="bg-gray-50 rounded-lg p-6 relative" style={{ minHeight: '400px' }}>
              <GridBackground />
              <svg viewBox="0 0 300 300" className="w-full h-full relative" style={{ zIndex: 1 }}>
                {/* Step 1: Front Face */}
                <rect
                  x="80"
                  y="100"
                  width="80"
                  height="80"
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="3"
                  className={`transition-all duration-1000 ${step >= 0 ? 'opacity-100' : 'opacity-0'}`}
                  style={{
                    strokeDasharray: step === 0 ? '320' : '0',
                    strokeDashoffset: step === 0 ? '320' : '0',
                    animation: step === 0 ? 'drawRect 1.5s ease-out forwards' : 'none'
                  }}
                />

                {/* Step 2: Back Face (Offset) */}
                <rect
                  x="140"
                  y="60"
                  width="80"
                  height="80"
                  fill="none"
                  stroke="#7c3aed"
                  strokeWidth="3"
                  className={`transition-all duration-1000 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}
                  style={{
                    strokeDasharray: step === 1 ? '320' : '0',
                    strokeDashoffset: step === 1 ? '320' : '0',
                    animation: step === 1 ? 'drawRect 1.5s ease-out forwards' : 'none'
                  }}
                />

                {/* Step 3: Connecting Lines */}
                {step >= 2 && (
                  <>
                    <line x1="80" y1="100" x2="140" y2="60" stroke="#059669" strokeWidth="2.5"
                      className="transition-all duration-700"
                      style={{
                        strokeDasharray: '85',
                        strokeDashoffset: step === 2 ? '85' : '0',
                        animation: step === 2 ? 'drawLine 0.8s ease-out forwards' : 'none'
                      }}
                    />
                    <line x1="160" y1="100" x2="220" y2="60" stroke="#059669" strokeWidth="2.5"
                      className="transition-all duration-700"
                      style={{
                        strokeDasharray: '85',
                        strokeDashoffset: step === 2 ? '85' : '0',
                        animation: step === 2 ? 'drawLine 0.8s 0.2s ease-out forwards' : 'none'
                      }}
                    />
                    <line x1="160" y1="180" x2="220" y2="140" stroke="#059669" strokeWidth="2.5"
                      className="transition-all duration-700"
                      style={{
                        strokeDasharray: '85',
                        strokeDashoffset: step === 2 ? '85' : '0',
                        animation: step === 2 ? 'drawLine 0.8s 0.4s ease-out forwards' : 'none'
                      }}
                    />
                  </>
                )}

                {/* Step 4: Hidden Edge (Dotted Line) */}
                {step >= 3 && (
                  <line x1="80" y1="180" x2="140" y2="140" stroke="#dc2626" strokeWidth="2.5"
                    strokeDasharray="5,5"
                    className="transition-all duration-700"
                    style={{
                      strokeDasharray: step === 3 ? '5,5' : '85',
                      strokeDashoffset: step === 3 ? '0' : '85',
                      animation: step === 3 ? 'drawDottedLine 1s ease-out forwards' : 'none'
                    }}
                  />
                )}

                {/* Labels */}
                {step >= 0 && (
                  <text x="120" y="145" fill="#4f46e5" fontSize="12" fontWeight="bold" className="animate-fade-in">
                    {t.front}
                  </text>
                )}
                {step >= 1 && (
                  <text x="165" y="105" fill="#7c3aed" fontSize="12" fontWeight="bold" className="animate-fade-in">
                    {t.back}
                  </text>
                )}
              </svg>

              <style>{`
                @keyframes drawRect {
                  to {
                    stroke-dashoffset: 0;
                  }
                }
                @keyframes drawLine {
                  to {
                    stroke-dashoffset: 0;
                  }
                }
                @keyframes drawDottedLine {
                  from {
                    opacity: 0;
                  }
                  to {
                    opacity: 1;
                  }
                }
                @keyframes fadeIn {
                  from {
                    opacity: 0;
                  }
                  to {
                    opacity: 1;
                  }
                }
                .animate-fade-in {
                  animation: fadeIn 0.5s ease-in;
                }
              `}</style>
            </div>

            {/* Instructions Panel */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="bg-indigo-50 rounded-lg p-6 mb-6">
                  <h2 className="text-2xl font-bold text-indigo-900 mb-4">
                    {steps[step].title}
                  </h2>
                  <p className="text-indigo-700 text-lg">
                    {steps[step].description}
                  </p>
                </div>

                {/* Key Points */}
                <div className="bg-purple-50 rounded-lg p-6">
                  <h3 className="font-bold text-purple-900 mb-3 text-lg">{t.keyPoints}</h3>
                  <ul className="space-y-2 text-purple-800">
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2">•</span>
                      <span>{t.point1}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2">•</span>
                      <span>{t.point2}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2">•</span>
                      <span>{t.point3}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2">•</span>
                      <span>{t.point4}</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Controls */}
              <div className="mt-6">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <button
                    onClick={togglePlay}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-lg"
                  >
                    {autoPlay ? <Pause size={20} /> : <Play size={20} />}
                    {autoPlay ? t.pause : step === 3 ? t.replay : t.autoPlay}
                  </button>
                  <button
                    onClick={reset}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-lg"
                  >
                    <RotateCcw size={20} />
                    {t.reset}
                  </button>
                </div>

                {/* Step Indicators */}
                <div className="flex justify-center gap-2">
                  {steps.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setStep(idx)}
                      className={`w-12 h-12 rounded-full font-bold transition-all ${
                        step === idx
                          ? 'bg-indigo-600 text-white scale-110 shadow-lg'
                          : step > idx
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-300 text-gray-600 hover:bg-gray-400'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="bg-gray-50 p-6 border-t">
            <p className="text-gray-600 text-center">
              <span className="font-semibold">{language === 'en' ? 'Tip:' : language === 'hi' ? 'सुझाव:' : 'સૂચના:'}</span> {t.tip}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const DrawingTechniquesDemo: React.FC<DrawingTechniquesDemoProps> = ({ language }) => {
  const [currentTechnique, setCurrentTechnique] = useState<'oblique' | 'isometric' | 'visualization'>('oblique');
  const [currentStep, setCurrentStep] = useState(0);

  const translations = {
    en: {
      title: '3D Drawing Techniques',
      obliqueTitle: 'Oblique Sketches',
      isometricTitle: 'Isometric Sketches',
      visualizationTitle: 'Visualizing Solid Objects',
      obliqueDescription: 'Oblique sketches give a clear idea of how a solid looks from the front. Measurements are not proportional.',
      isometricDescription: 'Isometric sketches are drawn on special isometric dot paper. Measurements are exact and proportional.',
      visualizationDescription: 'Learn to visualize combined shapes where some parts may be hidden.',
      step1: 'Step 1: Draw the front face',
      step2: 'Step 2: Draw the opposite face (slightly offset)',
      step3: 'Step 3: Join corresponding corners',
      step4: 'Step 4: Use dotted lines for hidden edges',
      step1Iso: 'Step 1: Use isometric dot paper',
      step2Iso: 'Step 2: Draw rectangles systematically',
      step3Iso: 'Step 3: Connect parallel line segments',
      step4Iso: 'Step 4: Maintain proportional measurements',
      keyDifference: 'Key Difference',
      proportional: 'Proportional',
      notProportional: 'Not Proportional',
      frontView: 'Front View',
      hiddenEdges: 'Hidden Edges',
      visibleEdges: 'Visible Edges',
      practice: 'Practice on squared paper',
      accurate: 'More accurate representation'
    },
    hi: {
      title: '3D ड्रॉइंग तकनीकें',
      obliqueTitle: 'तिरछे स्केच',
      isometricTitle: 'सममितीय स्केच',
      visualizationTitle: 'ठोस वस्तुओं का दृश्यीकरण',
      obliqueDescription: 'तिरछे स्केच सामने से ठोस कैसा दिखता है इसका स्पष्ट विचार देते हैं। माप अनुपातिक नहीं होते।',
      isometricDescription: 'सममितीय स्केच विशेष सममितीय डॉट पेपर पर खींचे जाते हैं। माप सटीक और अनुपातिक होते हैं।',
      visualizationDescription: 'संयुक्त आकृतियों का दृश्यीकरण सीखें जहां कुछ भाग छुपे हो सकते हैं।',
      step1: 'चरण 1: सामने का फलक खींचें',
      step2: 'चरण 2: विपरीत फलक खींचें (थोड़ा ऑफसेट)',
      step3: 'चरण 3: संबंधित कोनों को जोड़ें',
      step4: 'चरण 4: छुपी हुई किनारों के लिए बिंदुओं वाली रेखाएं उपयोग करें',
      step1Iso: 'चरण 1: सममितीय डॉट पेपर उपयोग करें',
      step2Iso: 'चरण 2: आयतों को व्यवस्थित रूप से खींचें',
      step3Iso: 'चरण 3: समानांतर रेखा खंडों को जोड़ें',
      step4Iso: 'चरण 4: अनुपातिक माप बनाए रखें',
      keyDifference: 'मुख्य अंतर',
      proportional: 'अनुपातिक',
      notProportional: 'अनुपातिक नहीं',
      frontView: 'सामने का दृश्य',
      hiddenEdges: 'छुपी हुई किनारे',
      visibleEdges: 'दिखाई देने वाली किनारे',
      practice: 'वर्गाकार कागज पर अभ्यास करें',
      accurate: 'अधिक सटीक प्रतिनिधित्व'
    },
    gu: {
      title: '3D ડ્રોઇંગ તકનીકો',
      obliqueTitle: 'ત્રાંસા સ્કેચ',
      isometricTitle: 'સમમિતીય સ્કેચ',
      visualizationTitle: 'ઘન વસ્તુઓનું દ્રશ્યીકરણ',
      obliqueDescription: 'ત્રાંસા સ્કેચ આગળથી ઘન કેવું દેખાય છે તેનો સ્પષ્ટ વિચાર આપે છે। માપ પ્રમાણસર નથી હોતા।',
      isometricDescription: 'સમમિતીય સ્કેચ વિશેષ સમમિતીય ડોટ પેપર પર દોરવામાં આવે છે। માપ ચોક્કસ અને પ્રમાણસર હોય છે।',
      visualizationDescription: 'સંયુક્ત આકૃતિઓનું દ્રશ્યીકરણ શીખો જ્યાં કેટલાક ભાગ છુપાયેલા હોઈ શકે છે।',
      step1: 'પગલું 1: આગળનો ફલક દોરો',
      step2: 'પગલું 2: વિરુદ્ધ ફલક દોરો (થોડો ઓફસેટ)',
      step3: 'પગલું 3: સંબંધિત ખૂણાઓને જોડો',
      step4: 'પગલું 4: છુપાયેલા કિનારાઓ માટે ડોટેડ રેખાઓ ઉપયોગ કરો',
      step1Iso: 'પગલું 1: સમમિતીય ડોટ પેપર ઉપયોગ કરો',
      step2Iso: 'પગલું 2: લંબચોરસોને વ્યવસ્થિત રીતે દોરો',
      step3Iso: 'પગલું 3: સમાંતર રેખા ખંડોને જોડો',
      step4Iso: 'પગલું 4: પ્રમાણસર માપ જાળવો',
      keyDifference: 'મુખ્ય તફાવત',
      proportional: 'પ્રમાણસર',
      notProportional: 'પ્રમાણસર નહીં',
      frontView: 'આગળનો દેખાવ',
      hiddenEdges: 'છુપાયેલા કિનારા',
      visibleEdges: 'દેખાતા કિનારા',
      practice: 'ચોરસ કાગળ પર અભ્યાસ કરો',
      accurate: 'વધુ ચોક્કસ પ્રતિનિધિત્વ'
    }
  };

  const t = translations[language];

  // Auto-progression for demonstration steps
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentStep(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearTimeout(timer);
  }, [currentStep]);


  const renderIsometricSteps = () => {
    const steps = [
      { title: t.step1Iso, description: 'Use special isometric dot paper' },
      { title: t.step2Iso, description: 'Draw rectangles systematically' },
      { title: t.step3Iso, description: 'Connect parallel line segments' },
      { title: t.step4Iso, description: 'Maintain exact proportional measurements' }
    ];

    return (
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className={`p-4 rounded-xl border-2 transition-all duration-500 ${
            currentStep === index 
              ? 'bg-green-50 border-green-300 shadow-lg scale-105' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                currentStep === index ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {index + 1}
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">{step.title}</h4>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderVisualizationContent = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
        <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">🧩</span>
          {t.visualizationTitle}
        </h4>
        <p className="text-gray-700 mb-4">{t.visualizationDescription}</p>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h5 className="font-semibold text-gray-800 mb-2">{t.visibleEdges}</h5>
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-lg flex items-center justify-center">
              <div className="w-12 h-12 border-2 border-blue-500"></div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h5 className="font-semibold text-gray-800 mb-2">{t.hiddenEdges}</h5>
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="w-12 h-12 border-2 border-gray-400 border-dashed"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // If oblique technique is selected, show the full-screen demo
  if (currentTechnique === 'oblique') {
    return <ObliqueSketchDemo language={language} />;
  }

  return (
    <div className="space-y-6">
      {/* Main Content */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-6 md:p-8">
        {/* Technique Selector */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          <button
            onClick={() => setCurrentTechnique('oblique')}
            className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            📐 {t.obliqueTitle}
          </button>
          <button
            onClick={() => setCurrentTechnique('isometric')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              currentTechnique === 'isometric'
                ? 'bg-green-500 text-white shadow-lg scale-105'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            📏 {t.isometricTitle}
          </button>
          <button
            onClick={() => setCurrentTechnique('visualization')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              currentTechnique === 'visualization'
                ? 'bg-purple-500 text-white shadow-lg scale-105'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            👁️ {t.visualizationTitle}
          </button>
        </div>

        {/* Technique Content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left - Steps */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
              {currentTechnique === 'isometric' ? t.isometricTitle : t.visualizationTitle}
            </h3>
            
            {currentTechnique === 'isometric' && renderIsometricSteps()}
            {currentTechnique === 'visualization' && renderVisualizationContent()}
          </div>

          {/* Right - Visual Demo */}
          <div className="bg-gradient-to-br from-blue-100 via-green-100 to-purple-100 rounded-2xl shadow-xl p-6 border-2 border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
              {language === 'en' ? 'Visual Demonstration' : 
               language === 'hi' ? 'दृश्य प्रदर्शन' : 
               'દ્રશ્ય પ્રદર્શન'}
            </h3>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              {currentTechnique === 'isometric' && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4">
                      <svg viewBox="0 0 120 120" className="w-full h-full">
                        {/* Isometric cube */}
                        <path d="M60,20 L90,35 L90,65 L60,80 Z" fill="#14b8a6" stroke="#0d9488" strokeWidth="2" />
                        <path d="M60,20 L30,35 L30,65 L60,80 Z" fill="#0d9488" stroke="#0d9488" strokeWidth="2" />
                        <path d="M90,35 L90,65 L60,80 L60,50 Z" fill="#0891b2" stroke="#0d9488" strokeWidth="2" />
                        <text x="60" y="95" fill="#0d9488" fontSize="10" fontWeight="bold" textAnchor="middle">Isometric Sketch</text>
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600">{t.isometricDescription}</p>
                    <div className="mt-4">
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        {t.proportional}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {currentTechnique === 'visualization' && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4">
                      <svg viewBox="0 0 120 120" className="w-full h-full">
                        {/* Combined shapes visualization */}
                        <rect x="20" y="40" width="30" height="30" fill="#a855f7" stroke="#7c3aed" strokeWidth="2" />
                        <rect x="35" y="55" width="30" height="30" fill="#c084fc" stroke="#7c3aed" strokeWidth="2" />
                        <rect x="50" y="70" width="30" height="30" fill="#9333ea" stroke="#7c3aed" strokeWidth="2" />
                        <line x1="20" y1="40" x2="35" y2="55" stroke="#7c3aed" strokeWidth="2" />
                        <line x1="50" y1="40" x2="65" y2="55" stroke="#7c3aed" strokeWidth="2" />
                        <line x1="20" y1="70" x2="35" y2="85" stroke="#7c3aed" strokeWidth="2" />
                        <line x1="50" y1="70" x2="65" y2="85" stroke="#7c3aed" strokeWidth="2" strokeDasharray="3,3" />
                        <line x1="50" y1="40" x2="50" y2="70" stroke="#7c3aed" strokeWidth="2" strokeDasharray="3,3" />
                        <text x="60" y="110" fill="#4c1d95" fontSize="10" fontWeight="bold" textAnchor="middle">Combined Shapes</text>
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600">{t.visualizationDescription}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Key Differences */}
        <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-200">
          <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">⚖️</span>
            {t.keyDifference}
          </h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-xl shadow-md">
              <h5 className="font-semibold text-gray-800 mb-2">{t.obliqueTitle}</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• {t.notProportional}</li>
                <li>• {t.frontView}</li>
                <li>• {t.practice}</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-md">
              <h5 className="font-semibold text-gray-800 mb-2">{t.isometricTitle}</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• {t.proportional}</li>
                <li>• {t.accurate}</li>
                <li>• Special dot paper</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawingTechniquesDemo;