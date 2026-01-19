import React, { useState } from "react";
import { motion, useAnimation } from "framer-motion";

interface CrossSectionVisualizerProps {
  language?: 'en' | 'hi' | 'gu';
}

export default function CrossSectionVisualizer({ language = 'en' }: CrossSectionVisualizerProps) {
  const controls = useAnimation();
  const [selectedBlock, setSelectedBlock] = useState<'all' | 'slicing' | 'shadow' | 'views'>('all');

  // Language translations
  const translations = {
    en: {
      title: "Visualising Solid Shapes — Interactive Summary",
      subtitle: "Three visual ways to represent 3D solids:",
      slicing: "Slicing (cross-sections)",
      shadow: "Shadow",
      views: "Different Views",
      slicingTitle: "1. Slicing → Cross-Sections",
      slicingDesc: "Watch the plane move through the cuboid — the resulting cross-section is shown on the right.",
      slicingTip: "Tip: The shape depends on the cut direction — vertical, horizontal, or slanted.",
      shadowTitle: "2. Shadow Play",
      shadowDesc: "Move the light source to see how the 2D shadow changes shape and size.",
      shadowNote: "Note: Shadows are 2D projections affected by light position and direction.",
      viewsTitle: "3. Different Views (Top / Front / Side)",
      viewsDesc: "Toggle between views to see how the same object appears from different angles.",
      front: "Front",
      side: "Side",
      top: "Top",
      crossSection: "Cross-Section",
      shadowLabel: "Shadow",
      info: "Info",
      viewsInfo: "Front shows height × width; Side shows depth × height; Top shows length × breadth.",
      showAll: "Show All",
      showSlicing: "Show Slicing",
      showShadow: "Show Shadow",
      showViews: "Show Views"
    },
    hi: {
      title: "ठोस आकृतियों का दृश्यीकरण — इंटरैक्टिव सारांश",
      subtitle: "3D ठोसों का प्रतिनिधित्व करने के तीन दृश्य तरीके:",
      slicing: "काटना (क्रॉस-सेक्शन)",
      shadow: "छाया",
      views: "विभिन्न दृश्य",
      slicingTitle: "1. काटना → क्रॉस-सेक्शन",
      slicingDesc: "घनाभ के माध्यम से समतल को चलते हुए देखें — परिणामी क्रॉस-सेक्शन दाईं ओर दिखाया गया है।",
      slicingTip: "सुझाव: आकार कटाव की दिशा पर निर्भर करता है — ऊर्ध्वाधर, क्षैतिज, या तिर्यक।",
      shadowTitle: "2. छाया खेल",
      shadowDesc: "प्रकाश स्रोत को हिलाकर देखें कि 2D छाया कैसे आकार और आकार बदलती है।",
      shadowNote: "नोट: छायाएं 2D प्रक्षेपण हैं जो प्रकाश की स्थिति और दिशा से प्रभावित होती हैं।",
      viewsTitle: "3. विभिन्न दृश्य (शीर्ष / सामने / बगल)",
      viewsDesc: "विभिन्न कोणों से एक ही वस्तु कैसे दिखती है, इसे देखने के लिए दृश्यों के बीच टॉगल करें।",
      front: "सामने",
      side: "बगल",
      top: "शीर्ष",
      crossSection: "क्रॉस-सेक्शन",
      shadowLabel: "छाया",
      info: "जानकारी",
      viewsInfo: "सामने ऊंचाई × चौड़ाई दिखाता है; बगल गहराई × ऊंचाई दिखाता है; शीर्ष लंबाई × चौड़ाई दिखाता है।",
      showAll: "सभी दिखाएं",
      showSlicing: "काटना दिखाएं",
      showShadow: "छाया दिखाएं",
      showViews: "दृश्य दिखाएं"
    },
    gu: {
      title: "ઘન આકૃતિઓનું દ્રશ્યીકરણ — ઇન્ટરેક્ટિવ સારાંશ",
      subtitle: "3D ઘનોનું પ્રતિનિધિત્વ કરવાના ત્રણ દ્રશ્ય માર્ગો:",
      slicing: "કાપવું (ક્રોસ-સેક્શન)",
      shadow: "પડછાયો",
      views: "વિવિધ દ્રશ્યો",
      slicingTitle: "1. કાપવું → ક્રોસ-સેક્શન",
      slicingDesc: "ઘનાભ દ્વારા પ્લેન ફરતું જુઓ — પરિણામી ક્રોસ-સેક્શન જમણી બાજુ બતાવવામાં આવ્યું છે।",
      slicingTip: "સૂચના: આકાર કાપવાની દિશા પર આધાર રાખે છે — ઊભું, આડું, અથવા તિર્યક।",
      shadowTitle: "2. પડછાયો ખેલ",
      shadowDesc: "પ્રકાશ સ્ત્રોતને ખસેડીને જુઓ કે 2D પડછાયો કેવી રીતે આકાર અને કદ બદલે છે।",
      shadowNote: "નોંધ: પડછાયાઓ 2D પ્રક્ષેપણ છે જે પ્રકાશની સ્થિતિ અને દિશા દ્વારા પ્રભાવિત થાય છે।",
      viewsTitle: "3. વિવિધ દ્રશ્યો (ટોપ / ફ્રન્ટ / સાઇડ)",
      viewsDesc: "એ જ વસ્તુ વિવિધ ખૂણાઓથી કેવી દેખાય છે તે જોવા માટે દ્રશ્યો વચ્ચે ટોગલ કરો।",
      front: "ફ્રન્ટ",
      side: "સાઇડ",
      top: "ટોપ",
      crossSection: "ક્રોસ-સેક્શન",
      shadowLabel: "પડછાયો",
      info: "માહિતી",
      viewsInfo: "ફ્રન્ટ ઊંચાઈ × પહોળાઈ બતાવે છે; સાઇડ ઊંડાઈ × ઊંચાઈ બતાવે છે; ટોપ લંબાઈ × પહોળાઈ બતાવે છે।",
      showAll: "બધા બતાવો",
      showSlicing: "કાપવું બતાવો",
      showShadow: "પડછાયો બતાવો",
      showViews: "દ્રશ્યો બતાવો"
    }
  };

  const t = translations[language];

  // Start initial animation
  React.useEffect(() => {
    controls.start({ x: [0, 120, 0], transition: { duration: 4, ease: "easeInOut", repeat: Infinity } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-teal-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gradient-teal-purple">
            {t.title}
          </h1>
          
          <p className="text-center text-gray-600 mb-6 text-lg">
            {t.subtitle} <strong>{t.slicing}</strong>, <strong>{t.shadow}</strong>, <strong>{t.views}</strong>.
          </p>

          {/* Block Selection Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={() => setSelectedBlock('all')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${
                selectedBlock === 'all'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                  : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300'
              }`}
            >
              <span className="text-lg mr-2">📚</span>
              {t.showAll}
            </button>
            <button
              onClick={() => setSelectedBlock('slicing')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${
                selectedBlock === 'slicing'
                  ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white'
                  : 'bg-gradient-to-r from-teal-100 to-teal-200 text-teal-700 hover:from-teal-200 hover:to-teal-300'
              }`}
            >
              <span className="text-lg mr-2">✂️</span>
              {t.showSlicing}
            </button>
            <button
              onClick={() => setSelectedBlock('shadow')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${
                selectedBlock === 'shadow'
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                  : 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 hover:from-purple-200 hover:to-purple-300'
              }`}
            >
              <span className="text-lg mr-2">🌞</span>
              {t.showShadow}
            </button>
            <button
              onClick={() => setSelectedBlock('views')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${
                selectedBlock === 'views'
                  ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white'
                  : 'bg-gradient-to-r from-pink-100 to-pink-200 text-pink-700 hover:from-pink-200 hover:to-pink-300'
              }`}
            >
              <span className="text-lg mr-2">👁️</span>
              {t.showViews}
            </button>
          </div>

          {/* Conditional Content Rendering */}
          {selectedBlock === 'all' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Slicing Panel */}
              <section className="bg-white rounded-2xl p-6 shadow-lg border-2 border-teal-200 hover:shadow-xl transition-all duration-300">
                <h2 className="text-xl font-bold mb-3 text-teal-700 flex items-center gap-2">
                  <span className="text-2xl">✂️</span>
                  {t.slicingTitle}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  {t.slicingDesc}
                </p>

                <div className="flex gap-4 items-center">
                  <div className="relative w-48 h-40 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-slate-200 flex items-center justify-center">
                    <svg viewBox="0 0 220 160" className="w-full h-full">
                      <polygon points="40,30 150,30 190,70 80,70" fill="#E6F0FF" stroke="#9DB8FF" strokeWidth="2" />
                      <polygon points="40,30 40,110 80,150 80,70" fill="#D9E9FF" stroke="#9DB8FF" strokeWidth="2" />
                      <polygon points="80,70 190,70 150,30 40,30" fill="#CFE6FF" stroke="#9DB8FF" strokeWidth="2" />
                      <polyline points="40,110 80,150 190,110 150,70" fill="none" stroke="#7C9FE6" strokeWidth="2" />
                      <motion.rect
                        x={28}
                        y={20}
                        width={160}
                        height={8}
                        rx={2}
                        fill="#FFD4D4"
                        opacity={0.8}
                        animate={{ y: [20, 100, 20] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <motion.rect x={98} y={60} width={24} height={24} fill="#FFB6B6" opacity={0.9}
                        animate={{ scale: [1, 1.1, 1], rotate: [0, 2, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity }}
                      />
                    </svg>
                  </div>
                  <div className="w-28 h-28 bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 border-gray-200 flex flex-col items-center justify-center shadow-md">
                    <div className="text-xs text-gray-600 font-medium">{t.crossSection}</div>
                    <div className="mt-2 w-16 h-16 bg-gradient-to-br from-red-200 to-red-300 border-2 border-red-400 rounded-lg flex items-center justify-center shadow-sm">
                      <svg viewBox="0 0 24 24" className="w-10 h-10">
                        <rect x="2" y="2" width="20" height="20" fill="#FF8A8A" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-xs text-gray-600 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                  💡 {t.slicingTip}
                </div>
              </section>

              {/* Shadow Panel */}
              <section className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-200 hover:shadow-xl transition-all duration-300">
                <h2 className="text-xl font-bold mb-3 text-purple-700 flex items-center gap-2">
                  <span className="text-2xl">🌞</span>
                  {t.shadowTitle}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  {t.shadowDesc}
                </p>
                <div className="flex gap-4 items-center">
                  <div className="relative w-48 h-40 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-slate-200 flex items-center justify-center overflow-hidden">
                    <svg viewBox="0 0 220 160" className="w-full h-full">
                      <rect x="0" y="120" width="220" height="40" fill="#F7F7F8" />
                      <ellipse cx="110" cy="60" rx="28" ry="12" fill="#E6FFF2" stroke="#9DDFAF" strokeWidth="2" />
                      <rect x="82" y="60" width="56" height="48" fill="#E6FFF2" stroke="#9DDFAF" strokeWidth="2" />
                      <ellipse cx="110" cy="108" rx="28" ry="12" fill="#CFFFE0" stroke="#9DDFAF" strokeWidth="2" />
                      <motion.circle cx={30} cy={20} r={8} fill="#FFF59A" stroke="#FFD54F" strokeWidth="2" 
                        animate={{ cx: [30, 190, 30] }} 
                        transition={{ duration: 6, repeat: Infinity, ease: "linear" }} 
                      />
                      <motion.ellipse cx="150" cy="124" rx="40" ry="12" fill="#BFBFBF" opacity={0.6}
                        animate={{ 
                          rx: [12, 40, 12], 
                          ry: [28, 12, 28], 
                          transform: ["skewX(0deg)", "skewX(-20deg)", "skewX(0deg)"] 
                        }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </svg>
                  </div>
                  <div className="w-28 h-28 bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 border-gray-200 flex flex-col items-center justify-center shadow-md">
                    <div className="text-xs text-gray-600 font-medium">{t.shadowLabel}</div>
                    <div className="mt-2 w-16 h-16 bg-gradient-to-t from-gray-200 to-gray-100 rounded-full flex items-center justify-center shadow-sm">
                      <svg viewBox="0 0 24 24" className="w-10 h-10 opacity-80">
                        <ellipse cx="12" cy="16" rx="8" ry="3" fill="#B0B0B0" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-xs text-gray-600 bg-purple-50 p-3 rounded-lg border-l-4 border-purple-400">
                  📝 {t.shadowNote}
                </div>
              </section>

              {/* Views Panel */}
              <section className="bg-white rounded-2xl p-6 shadow-lg border-2 border-pink-200 hover:shadow-xl transition-all duration-300">
                <h2 className="text-xl font-bold mb-3 text-pink-700 flex items-center gap-2">
                  <span className="text-2xl">👁️</span>
                  {t.viewsTitle}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  {t.viewsDesc}
                </p>
                <div className="grid grid-cols-3 gap-2 items-center mb-4">
                  <button className="text-xs py-2 px-3 rounded-lg bg-gradient-to-r from-teal-100 to-teal-200 text-teal-700 font-medium hover:from-teal-200 hover:to-teal-300 transition-all duration-200" 
                    onClick={() => controls.start({ x: 0 })}>
                    {t.front}
                  </button>
                  <button className="text-xs py-2 px-3 rounded-lg bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 font-medium hover:from-purple-200 hover:to-purple-300 transition-all duration-200" 
                    onClick={() => controls.start({ x: 50 })}>
                    {t.side}
                  </button>
                  <button className="text-xs py-2 px-3 rounded-lg bg-gradient-to-r from-pink-100 to-pink-200 text-pink-700 font-medium hover:from-pink-200 hover:to-pink-300 transition-all duration-200" 
                    onClick={() => controls.start({ x: 100 })}>
                    {t.top}
                  </button>
                </div>
                <div className="mt-3 flex gap-4 items-center">
                  <div className="w-48 h-40 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-slate-200 flex items-center justify-center overflow-hidden">
                    <motion.div animate={controls as any} transition={{ duration: 0.6 }} className="w-full h-full flex items-center justify-center">
                      <div className="flex w-[260px] items-center">
                        <div className="w-80 flex-shrink-0 flex flex-col items-center">
                          <div className="text-xs text-gray-600 font-medium">{t.front}</div>
                          <svg viewBox="0 0 120 100" className="w-36 h-28 mt-2">
                            <rect x="30" y="20" width="60" height="60" fill="#E6F7FF" stroke="#8FBFFF" strokeWidth="2" />
                          </svg>
                        </div>
                        <div className="w-80 flex-shrink-0 flex flex-col items-center">
                          <div className="text-xs text-gray-600 font-medium">{t.side}</div>
                          <svg viewBox="0 0 120 100" className="w-36 h-28 mt-2">
                            <rect x="10" y="20" width="40" height="60" fill="#E6FFF2" stroke="#8FE6B7" strokeWidth="2" />
                          </svg>
                        </div>
                        <div className="w-80 flex-shrink-0 flex flex-col items-center">
                          <div className="text-xs text-gray-600 font-medium">{t.top}</div>
                          <svg viewBox="0 0 120 100" className="w-36 h-28 mt-2">
                            <rect x="20" y="30" width="80" height="40" fill="#FFF3E6" stroke="#FFCF9A" strokeWidth="2" />
                          </svg>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                  <div className="w-28 h-28 bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 border-gray-200 flex flex-col items-center justify-center shadow-md">
                    <div className="text-xs text-gray-600 font-medium">{t.info}</div>
                    <div className="mt-2 text-center text-xs text-gray-600 px-2">
                      {t.viewsInfo}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {selectedBlock === 'slicing' && (
            <div className="max-w-2xl mx-auto">
              <section className="bg-white rounded-2xl p-6 shadow-lg border-2 border-teal-200 hover:shadow-xl transition-all duration-300">
                <h2 className="text-xl font-bold mb-3 text-teal-700 flex items-center gap-2">
                  <span className="text-2xl">✂️</span>
                  {t.slicingTitle}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  {t.slicingDesc}
                </p>
                <div className="flex gap-4 items-center">
                  <div className="relative w-48 h-40 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-slate-200 flex items-center justify-center">
                    <svg viewBox="0 0 220 160" className="w-full h-full">
                      <polygon points="40,30 150,30 190,70 80,70" fill="#E6F0FF" stroke="#9DB8FF" strokeWidth="2" />
                      <polygon points="40,30 40,110 80,150 80,70" fill="#D9E9FF" stroke="#9DB8FF" strokeWidth="2" />
                      <polygon points="80,70 190,70 150,30 40,30" fill="#CFE6FF" stroke="#9DB8FF" strokeWidth="2" />
                      <polyline points="40,110 80,150 190,110 150,70" fill="none" stroke="#7C9FE6" strokeWidth="2" />
                      <motion.rect
                        x={28}
                        y={20}
                        width={160}
                        height={8}
                        rx={2}
                        fill="#FFD4D4"
                        opacity={0.8}
                        animate={{ y: [20, 100, 20] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <motion.rect x={98} y={60} width={24} height={24} fill="#FFB6B6" opacity={0.9}
                        animate={{ scale: [1, 1.1, 1], rotate: [0, 2, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity }}
                      />
                    </svg>
                  </div>
                  <div className="w-28 h-28 bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 border-gray-200 flex flex-col items-center justify-center shadow-md">
                    <div className="text-xs text-gray-600 font-medium">{t.crossSection}</div>
                    <div className="mt-2 w-16 h-16 bg-gradient-to-br from-red-200 to-red-300 border-2 border-red-400 rounded-lg flex items-center justify-center shadow-sm">
                      <svg viewBox="0 0 24 24" className="w-10 h-10">
                        <rect x="2" y="2" width="20" height="20" fill="#FF8A8A" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-xs text-gray-600 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                  💡 {t.slicingTip}
                </div>
              </section>
            </div>
          )}

          {selectedBlock === 'shadow' && (
            <div className="max-w-2xl mx-auto">
              <section className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-200 hover:shadow-xl transition-all duration-300">
                <h2 className="text-xl font-bold mb-3 text-purple-700 flex items-center gap-2">
                  <span className="text-2xl">🌞</span>
                  {t.shadowTitle}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  {t.shadowDesc}
                </p>
                <div className="flex gap-4 items-center">
                  <div className="relative w-48 h-40 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-slate-200 flex items-center justify-center overflow-hidden">
                    <svg viewBox="0 0 220 160" className="w-full h-full">
                      <rect x="0" y="120" width="220" height="40" fill="#F7F7F8" />
                      <ellipse cx="110" cy="60" rx="28" ry="12" fill="#E6FFF2" stroke="#9DDFAF" strokeWidth="2" />
                      <rect x="82" y="60" width="56" height="48" fill="#E6FFF2" stroke="#9DDFAF" strokeWidth="2" />
                      <ellipse cx="110" cy="108" rx="28" ry="12" fill="#CFFFE0" stroke="#9DDFAF" strokeWidth="2" />
                      <motion.circle cx={30} cy={20} r={8} fill="#FFF59A" stroke="#FFD54F" strokeWidth="2" 
                        animate={{ cx: [30, 190, 30] }} 
                        transition={{ duration: 6, repeat: Infinity, ease: "linear" }} 
                      />
                      <motion.ellipse cx="150" cy="124" rx="40" ry="12" fill="#BFBFBF" opacity={0.6}
                        animate={{ 
                          rx: [12, 40, 12], 
                          ry: [28, 12, 28], 
                          transform: ["skewX(0deg)", "skewX(-20deg)", "skewX(0deg)"] 
                        }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </svg>
                  </div>
                  <div className="w-28 h-28 bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 border-gray-200 flex flex-col items-center justify-center shadow-md">
                    <div className="text-xs text-gray-600 font-medium">{t.shadowLabel}</div>
                    <div className="mt-2 w-16 h-16 bg-gradient-to-t from-gray-200 to-gray-100 rounded-full flex items-center justify-center shadow-sm">
                      <svg viewBox="0 0 24 24" className="w-10 h-10 opacity-80">
                        <ellipse cx="12" cy="16" rx="8" ry="3" fill="#B0B0B0" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-xs text-gray-600 bg-purple-50 p-3 rounded-lg border-l-4 border-purple-400">
                  📝 {t.shadowNote}
                </div>
              </section>
            </div>
          )}

          {selectedBlock === 'views' && (
            <div className="max-w-2xl mx-auto">
              <section className="bg-white rounded-2xl p-6 shadow-lg border-2 border-pink-200 hover:shadow-xl transition-all duration-300">
                <h2 className="text-xl font-bold mb-3 text-pink-700 flex items-center gap-2">
                  <span className="text-2xl">👁️</span>
                  {t.viewsTitle}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  {t.viewsDesc}
                </p>
                <div className="grid grid-cols-3 gap-2 items-center mb-4">
                  <button className="text-xs py-2 px-3 rounded-lg bg-gradient-to-r from-teal-100 to-teal-200 text-teal-700 font-medium hover:from-teal-200 hover:to-teal-300 transition-all duration-200" 
                    onClick={() => controls.start({ x: 0 })}>
                    {t.front}
                  </button>
                  <button className="text-xs py-2 px-3 rounded-lg bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 font-medium hover:from-purple-200 hover:to-purple-300 transition-all duration-200" 
                    onClick={() => controls.start({ x: 50 })}>
                    {t.side}
                  </button>
                  <button className="text-xs py-2 px-3 rounded-lg bg-gradient-to-r from-pink-100 to-pink-200 text-pink-700 font-medium hover:from-pink-200 hover:to-pink-300 transition-all duration-200" 
                    onClick={() => controls.start({ x: 100 })}>
                    {t.top}
                  </button>
                </div>
                <div className="mt-3 flex gap-4 items-center">
                  <div className="w-48 h-40 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-slate-200 flex items-center justify-center overflow-hidden">
                    <motion.div animate={controls as any} transition={{ duration: 0.6 }} className="w-full h-full flex items-center justify-center">
                      <div className="flex w-[260px] items-center">
                        <div className="w-80 flex-shrink-0 flex flex-col items-center">
                          <div className="text-xs text-gray-600 font-medium">{t.front}</div>
                          <svg viewBox="0 0 120 100" className="w-36 h-28 mt-2">
                            <rect x="30" y="20" width="60" height="60" fill="#E6F7FF" stroke="#8FBFFF" strokeWidth="2" />
                          </svg>
                        </div>
                        <div className="w-80 flex-shrink-0 flex flex-col items-center">
                          <div className="text-xs text-gray-600 font-medium">{t.side}</div>
                          <svg viewBox="0 0 120 100" className="w-36 h-28 mt-2">
                            <rect x="10" y="20" width="40" height="60" fill="#E6FFF2" stroke="#8FE6B7" strokeWidth="2" />
                          </svg>
                        </div>
                        <div className="w-80 flex-shrink-0 flex flex-col items-center">
                          <div className="text-xs text-gray-600 font-medium">{t.top}</div>
                          <svg viewBox="0 0 120 100" className="w-36 h-28 mt-2">
                            <rect x="20" y="30" width="80" height="40" fill="#FFF3E6" stroke="#FFCF9A" strokeWidth="2" />
                          </svg>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                  <div className="w-28 h-28 bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 border-gray-200 flex flex-col items-center justify-center shadow-md">
                    <div className="text-xs text-gray-600 font-medium">{t.info}</div>
                    <div className="mt-2 text-center text-xs text-gray-600 px-2">
                      {t.viewsInfo}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}