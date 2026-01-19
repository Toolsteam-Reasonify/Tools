import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface IsometricSketchDemoProps {
  language: 'en' | 'hi' | 'gu';
}

const IsometricSketchDemo: React.FC<IsometricSketchDemoProps> = ({ language }) => {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Isometric grid parameters
  const gridSize = 20;
  const dotSpacing = 25;
  const offsetX = 80;
  const offsetY = 150;

  // Cuboid dimensions (4 x 3 x 3 units)
  const length = 4;
  const breadth = 3;
  const height = 3;

  useEffect(() => {
    let timer: number;
    if (isPlaying && step < 3) {
      timer = setTimeout(() => {
        setStep(prev => Math.min(prev + 1, 3));
        if (step === 2) setIsPlaying(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, step]);

  const handlePlayPause = () => {
    if (step >= 3) {
      setStep(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setStep(0);
    setIsPlaying(false);
  };

  // Convert isometric coordinates to screen coordinates
  const isoToScreen = (x: number, y: number, z: number) => {
    const screenX = offsetX + (x - y) * dotSpacing * 0.866;
    const screenY = offsetY + (x + y) * dotSpacing * 0.5 + z * dotSpacing;
    return { x: screenX, y: screenY };
  };

  // Generate isometric dot grid
  const generateDots = () => {
    const dots = [];
    const centerOffsetX = offsetX - (gridSize * dotSpacing * 0.866) / 2;
    const centerOffsetY = offsetY - (gridSize * dotSpacing * 0.5) / 2;
    
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const x = centerOffsetX + col * dotSpacing * 0.866;
        const y = centerOffsetY + row * dotSpacing * 0.5 + (col % 2) * dotSpacing * 0.25;
        dots.push(
          <circle
            key={`${row}-${col}`}
            cx={x}
            cy={y}
            r="1.5"
            fill="#cbd5e1"
            opacity="0.4"
          />
        );
      }
    }
    return dots;
  };

  // Define cuboid vertices
  const frontBottomLeft = isoToScreen(0, 0, 0);
  const frontBottomRight = isoToScreen(length, 0, 0);
  const frontTopRight = isoToScreen(length, 0, -height);
  const frontTopLeft = isoToScreen(0, 0, -height);
  
  const backBottomLeft = isoToScreen(0, breadth, 0);
  const backBottomRight = isoToScreen(length, breadth, 0);
  const backTopRight = isoToScreen(length, breadth, -height);
  const backTopLeft = isoToScreen(0, breadth, -height);

  const translations = {
    en: {
      title: "Isometric Sketch Tutorial",
      subtitle: "Learn how to draw 3D solids with proportional measurements",
      step1: "Step 1: Isometric Dot Grid",
      step2: "Step 2: Draw Front Face", 
      step3: "Step 3: Add Parallel Lines",
      step4: "Step 4: Complete the Cuboid",
      step1Desc: "Start with the isometric dot grid - notice the equilateral triangle pattern that forms the foundation for accurate measurements.",
      step2Desc: "Draw the front face rectangle using exact measurements (4×3 units). This represents the visible face of the cuboid with proportional dimensions.",
      step3Desc: "Draw four parallel line segments of length 3 units from each corner of the front face. These lines represent the depth of the cuboid.",
      step4Desc: "Connect the matching corners with appropriate line segments to complete the isometric sketch. Hidden edges are shown with dashed lines.",
      frontFace: "Front Face",
      parallelLines: "Parallel Lines",
      length: "Length: 4 units",
      breadth: "Breadth: 3 units", 
      height: "Height: 3 units",
      tip: "Use isometric dot paper for accurate measurements! Click the step numbers to jump to any step.",
      keyPoints: "Key Points:",
      point1: "Drawn on special isometric dot paper",
      point2: "Measurements are exact and proportional",
      point3: "More accurate representation than oblique sketches",
      point4: "Uses equilateral triangle grid pattern",
      autoPlay: "Auto Play",
      pause: "Pause",
      replay: "Replay",
      reset: "Reset"
    },
    hi: {
      title: "सममितीय स्केच ट्यूटोरियल",
      subtitle: "अनुपातिक माप के साथ 3D ठोस आकृतियां बनाना सीखें",
      step1: "चरण 1: सममितीय डॉट ग्रिड",
      step2: "चरण 2: सामने का फलक खींचें",
      step3: "चरण 3: समानांतर रेखाएं जोड़ें", 
      step4: "चरण 4: घनाभ को पूरा करें",
      step1Desc: "सममितीय डॉट ग्रिड से शुरू करें - समबाहु त्रिभुज पैटर्न पर ध्यान दें जो सटीक माप के लिए आधार बनाता है।",
      step2Desc: "सामने का फलक आयत सटीक माप (4×3 इकाई) का उपयोग करके खींचें। यह अनुपातिक आयामों के साथ घनाभ के दिखाई देने वाले फलक का प्रतिनिधित्व करता है।",
      step3Desc: "सामने के फलक के प्रत्येक कोने से 3 इकाई लंबाई की चार समानांतर रेखा खंड खींचें। ये रेखाएं घनाभ की गहराई का प्रतिनिधित्व करती हैं।",
      step4Desc: "सममितीय स्केच को पूरा करने के लिए मिलान वाले कोनों को उपयुक्त रेखा खंडों से जोड़ें। छुपी हुई किनारों को बिंदुओं वाली रेखाओं से दिखाया जाता है।",
      frontFace: "सामने का फलक",
      parallelLines: "समानांतर रेखाएं",
      length: "लंबाई: 4 इकाई",
      breadth: "चौड़ाई: 3 इकाई",
      height: "ऊंचाई: 3 इकाई", 
      tip: "सटीक माप के लिए सममितीय डॉट पेपर का उपयोग करें! किसी भी चरण पर जाने के लिए चरण संख्याओं पर क्लिक करें।",
      keyPoints: "मुख्य बिंदु:",
      point1: "विशेष सममितीय डॉट पेपर पर खींचा गया",
      point2: "माप सटीक और अनुपातिक होते हैं",
      point3: "तिरछे स्केच से अधिक सटीक प्रतिनिधित्व",
      point4: "समबाहु त्रिभुज ग्रिड पैटर्न का उपयोग करता है",
      autoPlay: "स्वचालित चलाएं",
      pause: "रोकें",
      replay: "फिर से चलाएं",
      reset: "रीसेट"
    },
    gu: {
      title: "સમમિતીય સ્કેચ ટ્યુટોરિયલ",
      subtitle: "પ્રમાણસર માપ સાથે 3D ઘન આકૃતિઓ દોરવાનું શીખો",
      step1: "પગલું 1: સમમિતીય ડોટ ગ્રિડ",
      step2: "પગલું 2: આગળનો ફલક દોરો",
      step3: "પગલું 3: સમાંતર રેખાઓ ઉમેરો",
      step4: "પગલું 4: ઘનાભ પૂર્ણ કરો",
      step1Desc: "સમમિતીય ડોટ ગ્રિડથી શરૂ કરો - સમબાજુ ત્રિકોણ પેટર્ન પર ધ્યાન આપો જે ચોક્કસ માપ માટે પાયો બનાવે છે।",
      step2Desc: "આગળનો ફલક લંબચોરસ ચોક્કસ માપ (4×3 એકમ) નો ઉપયોગ કરીને દોરો। આ પ્રમાણસર પરિમાણો સાથે ઘનાભના દેખાતા ફલકનું પ્રતિનિધિત્વ કરે છે।",
      step3Desc: "આગળના ફલકના દરેક ખૂણાથી 3 એકમ લંબાઈના ચાર સમાંતર રેખા ખંડો દોરો। આ રેખાઓ ઘનાભની ઊંડાઈનું પ્રતિનિધિત્વ કરે છે।",
      step4Desc: "સમમિતીય સ્કેચ પૂર્ણ કરવા માટે મેચિંગ ખૂણાઓને યોગ્ય રેખા ખંડો સાથે જોડો। છુપાયેલા કિનારાઓ ડોટેડ રેખાઓ સાથે દર્શાવવામાં આવે છે।",
      frontFace: "આગળનો ફલક",
      parallelLines: "સમાંતર રેખાઓ",
      length: "લંબાઈ: 4 એકમ",
      breadth: "પહોળાઈ: 3 એકમ",
      height: "ઊંચાઈ: 3 એકમ",
      tip: "ચોક્કસ માપ માટે સમમિતીય ડોટ પેપરનો ઉપયોગ કરો! કોઈપણ પગલા પર જવા માટે પગલા નંબરો પર ક્લિક કરો।",
      keyPoints: "મુખ્ય બિંદુઓ:",
      point1: "વિશેષ સમમિતીય ડોટ પેપર પર દોરવામાં આવે છે",
      point2: "માપ ચોક્કસ અને પ્રમાણસર હોય છે",
      point3: "ત્રાંસા સ્કેચ કરતાં વધુ ચોક્કસ પ્રતિનિધિત્વ",
      point4: "સમબાજુ ત્રિકોણ ગ્રિડ પેટર્નનો ઉપયોગ કરે છે",
      autoPlay: "સ્વચાલિત ચલાવો",
      pause: "રોકો",
      replay: "ફરી ચલાવો",
      reset: "રીસેટ"
    }
  };

  const t = translations[language];

  const stepDescriptions = [
    {
      title: t.step1,
      description: t.step1Desc
    },
    {
      title: t.step2,
      description: t.step2Desc
    },
    {
      title: t.step3,
      description: t.step3Desc
    },
    {
      title: t.step4,
      description: t.step4Desc
    }
  ];

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
              <svg viewBox="0 0 300 300" className="w-full h-full relative" style={{ zIndex: 1 }}>
                {/* Isometric dot grid */}
                {generateDots()}

                {/* Step 2: Front face rectangle */}
                {step >= 1 && (
                  <g className="animate-fade-in">
                    <line
                      x1={frontBottomLeft.x}
                      y1={frontBottomLeft.y}
                      x2={frontBottomRight.x}
                      y2={frontBottomRight.y}
                      stroke="#3b82f6"
                      strokeWidth="3"
                      className="animate-draw"
                    />
                    <line
                      x1={frontBottomRight.x}
                      y1={frontBottomRight.y}
                      x2={frontTopRight.x}
                      y2={frontTopRight.y}
                      stroke="#3b82f6"
                      strokeWidth="3"
                      className="animate-draw"
                      style={{ animationDelay: '0.3s' }}
                    />
                    <line
                      x1={frontTopRight.x}
                      y1={frontTopRight.y}
                      x2={frontTopLeft.x}
                      y2={frontTopLeft.y}
                      stroke="#3b82f6"
                      strokeWidth="3"
                      className="animate-draw"
                      style={{ animationDelay: '0.6s' }}
                    />
                    <line
                      x1={frontTopLeft.x}
                      y1={frontTopLeft.y}
                      x2={frontBottomLeft.x}
                      y2={frontBottomLeft.y}
                      stroke="#3b82f6"
                      strokeWidth="3"
                      className="animate-draw"
                      style={{ animationDelay: '0.9s' }}
                    />
                    {/* Front Face Label */}
                    <text x={frontBottomLeft.x - 40} y={frontBottomLeft.y + 10} className="text-sm fill-blue-600 font-bold">
                      {t.frontFace}
                    </text>
                  </g>
                )}

                {/* Step 3: Parallel lines from corners */}
                {step >= 2 && (
                  <g className="animate-fade-in">
                    <line
                      x1={frontBottomLeft.x}
                      y1={frontBottomLeft.y}
                      x2={backBottomLeft.x}
                      y2={backBottomLeft.y}
                      stroke="#10b981"
                      strokeWidth="3"
                      strokeDasharray="5,5"
                      className="animate-draw"
                    />
                    <line
                      x1={frontBottomRight.x}
                      y1={frontBottomRight.y}
                      x2={backBottomRight.x}
                      y2={backBottomRight.y}
                      stroke="#10b981"
                      strokeWidth="3"
                      className="animate-draw"
                      style={{ animationDelay: '0.2s' }}
                    />
                    <line
                      x1={frontTopRight.x}
                      y1={frontTopRight.y}
                      x2={backTopRight.x}
                      y2={backTopRight.y}
                      stroke="#10b981"
                      strokeWidth="3"
                      className="animate-draw"
                      style={{ animationDelay: '0.4s' }}
                    />
                    <line
                      x1={frontTopLeft.x}
                      y1={frontTopLeft.y}
                      x2={backTopLeft.x}
                      y2={backTopLeft.y}
                      stroke="#10b981"
                      strokeWidth="3"
                      strokeDasharray="5,5"
                      className="animate-draw"
                      style={{ animationDelay: '0.6s' }}
                    />
                    {/* Parallel Lines Label */}
                    <text x={backBottomRight.x + 20} y={backBottomRight.y + 20} className="text-sm fill-green-600 font-bold">
                      {t.parallelLines}
                    </text>
                  </g>
                )}

                {/* Step 4: Back face completion */}
                {step >= 3 && (
                  <g className="animate-fade-in">
                    <line
                      x1={backBottomLeft.x}
                      y1={backBottomLeft.y}
                      x2={backBottomRight.x}
                      y2={backBottomRight.y}
                      stroke="#8b5cf6"
                      strokeWidth="3"
                      strokeDasharray="5,5"
                      className="animate-draw"
                    />
                    <line
                      x1={backBottomRight.x}
                      y1={backBottomRight.y}
                      x2={backTopRight.x}
                      y2={backTopRight.y}
                      stroke="#8b5cf6"
                      strokeWidth="3"
                      className="animate-draw"
                      style={{ animationDelay: '0.3s' }}
                    />
                    <line
                      x1={backTopRight.x}
                      y1={backTopRight.y}
                      x2={backTopLeft.x}
                      y2={backTopLeft.y}
                      stroke="#8b5cf6"
                      strokeWidth="3"
                      className="animate-draw"
                      style={{ animationDelay: '0.6s' }}
                    />
                    <line
                      x1={backTopLeft.x}
                      y1={backTopLeft.y}
                      x2={backBottomLeft.x}
                      y2={backBottomLeft.y}
                      stroke="#8b5cf6"
                      strokeWidth="3"
                      strokeDasharray="5,5"
                      className="animate-draw"
                      style={{ animationDelay: '0.9s' }}
                    />
                  </g>
                )}

                {/* Dimension labels */}
                {step >= 3 && (
                  <g className="animate-fade-in" style={{ animationDelay: '1.2s' }}>
                    {/* Length dimension */}
                    <line
                      x1={frontBottomLeft.x - 15}
                      y1={frontBottomLeft.y}
                      x2={frontTopLeft.x - 15}
                      y2={frontTopLeft.y}
                      stroke="#ef4444"
                      strokeWidth="2"
                    />
                    <text x={frontBottomLeft.x - 80} y={(frontBottomLeft.y + frontTopLeft.y) / 2 - 5} className="text-xs fill-red-600 font-bold">
                      {t.length}
                    </text>
                    
                    {/* Breadth dimension */}
                    <line
                      x1={frontBottomRight.x + 15}
                      y1={frontBottomRight.y + 5}
                      x2={backBottomRight.x + 15}
                      y2={backBottomRight.y + 5}
                      stroke="#f59e0b"
                      strokeWidth="2"
                    />
                    <text x={(frontBottomRight.x + backBottomRight.x) / 2 + 30} y={(frontBottomRight.y + backBottomRight.y) / 2 + 10} className="text-xs fill-orange-600 font-bold">
                      {t.breadth}
                    </text>
                    
                    {/* Height dimension */}
                    <line
                      x1={frontBottomRight.x + 15}
                      y1={frontBottomRight.y}
                      x2={frontTopRight.x + 15}
                      y2={frontTopRight.y}
                      stroke="#8b5cf6"
                      strokeWidth="2"
                    />
                    <text x={frontBottomRight.x + 30} y={(frontBottomRight.y + frontTopRight.y) / 2 + 5} className="text-xs fill-purple-600 font-bold">
                      {t.height}
                    </text>
                  </g>
                )}
              </svg>

              <style>{`
                @keyframes draw {
                  from {
                    stroke-dashoffset: 1000;
                  }
                  to {
                    stroke-dashoffset: 0;
                  }
                }

                @keyframes fade-in {
                  from {
                    opacity: 0;
                    transform: scale(0.95);
                  }
                  to {
                    opacity: 1;
                    transform: scale(1);
                  }
                }

                .animate-draw {
                  stroke-dasharray: 1000;
                  stroke-dashoffset: 1000;
                  animation: draw 1s ease-out forwards;
                }

                .animate-fade-in {
                  animation: fade-in 0.5s ease-out forwards;
                }
              `}</style>
            </div>

            {/* Instructions Panel */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="bg-indigo-50 rounded-lg p-6 mb-6">
                  <h2 className="text-2xl font-bold text-indigo-900 mb-4">
                    {stepDescriptions[step]?.title || `Step ${step + 1}: Isometric Dot Grid`}
                  </h2>
                  <p className="text-indigo-700 text-lg">
                    {stepDescriptions[step]?.description || "Start with the isometric dot grid - notice the equilateral triangle pattern that forms the foundation for accurate measurements."}
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
                    onClick={handlePlayPause}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-lg"
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    {step >= 3 ? t.replay : isPlaying ? t.pause : t.autoPlay}
                  </button>
                  <button
                    onClick={handleReset}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-lg"
                  >
                    <RotateCcw size={20} />
                    {t.reset}
                  </button>
                </div>

                {/* Step Indicators */}
                <div className="flex justify-center gap-2">
                  {[0, 1, 2, 3].map((idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setStep(idx);
                        setIsPlaying(false);
                      }}
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

export default IsometricSketchDemo;
