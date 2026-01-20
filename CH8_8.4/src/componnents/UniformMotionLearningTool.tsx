import React, { useState, useEffect } from 'react';

interface DataPoint {
  time: number;
  distance: string;
}

type Language = 'en' | 'hi' | 'gu';

// Translations (keeping same as before for brevity)
const translations = {
  en: {
    title: "Uniform & Non-uniform Motion",
    subtitle: "Discover the fascinating world of motion through interactive simulations and engaging lessons",
    learn: "Learn", simulate: "Simulate", applications: "Applications",
    uniformMotion: "Uniform Linear Motion", nonUniformMotion: "Non-uniform Linear Motion",
    constantSpeed: "Constant speed throughout", speedNeverChanges: "Speed never changes",
    equalDistances: "Equal distances in equal times", exampleTrain: "Example: Train at steady speed",
    speedChanging: "Speed keeps changing", fasterSlower: "Faster and slower alternately",
    unequalDistances: "Unequal distances in equal times", exampleCar: "Example: Car in city traffic",
    howToIdentify: "How to Identify Motion Type?",
    lookAtDistance: "Look at the distance covered in equal time intervals:",
    sameDistance: "Same distance every time", differentDistances: "Different distances",
    uniformMotionLabel: "Uniform Motion", nonUniformMotionLabel: "Non-uniform Motion",
    simulationTitle: "Interactive Simulation",
    simulationDesc: "Watch both types of motion side by side!",
    uniformLabel: "Uniform Motion - Constant Speed", nonUniformLabel: "Non-uniform Motion - Changing Speed",
    start: "Start", stop: "Stop", reset: "Reset",
    timeElapsed: "Time Elapsed", distanceCovered: "Distance Covered", currentSpeed: "Current Speed",
    recordedData: "Recorded Data", time: "Time", totalDistance: "Total Distance",
    intervalDistance: "Interval Distance", whatToObserve: "What to Observe",
    observeGreen: "The green car covers the same distance every second",
    observeRed: "The red car speeds up and slows down",
    observeTable: "Check the tables - uniform motion shows equal interval distances",
    applicationsTitle: "Real-World Applications",
    applicationsDesc: "See how uniform and non-uniform motion appear in everyday life",
    highSpeedTrains: "High-Speed Trains",
    highSpeedTrainsDesc: "Modern bullet trains maintain constant speeds on straight tracks.",
    cityTraffic: "City Traffic", cityTrafficDesc: "Cars constantly speed up and slow down in city streets.",
    conveyorBelts: "Conveyor Belts", conveyorBeltsDesc: "Factory assembly lines move at constant speeds.",
    rollerCoasters: "Roller Coasters", rollerCoastersDesc: "Continuously changing speed - accelerating and decelerating.",
    cruiseFlight: "Cruise Flight", cruiseFlightDesc: "Airplanes maintain steady cruising speeds.",
    marathonRunning: "Marathon Running", marathonRunningDesc: "Runners adjust their pace throughout the race.",
    whyMatters: "Why Understanding Motion Matters",
    whyMattersDesc: "Understanding motion helps engineers design better systems.",
    didYouKnowTitle: "Beyond the Textbook", didYouKnowDesc: "Exciting modern concepts about motion!",
    selfDrivingCars: "Self-Driving Cars", selfDrivingCarsDesc: "Modern self-driving cars use AI to adjust their speed.",
    spaceTravel: "Motion in Space", spaceTravelDesc: "Spacecraft travel at approximately 28,000 km/h!",
    sportsTech: "Sports Technology", sportsTechDesc: "Athletes use motion tracking to analyze their performance.",
    hyperloop: "Future Transport: Hyperloop", hyperloopDesc: "Could travel at over 1,000 km/h!"
  },
  hi: {
    title: "समान और असमान गति", subtitle: "इंटरैक्टिव सिमुलेशन और रोचक पाठों के माध्यम से गति की दुनिया की खोज करें",
    learn: "सीखें", simulate: "सिमुलेट", applications: "अनुप्रयोग", didYouKnow: "क्या आप जानते हैं?",
    uniformMotion: "समान रेखीय गति", nonUniformMotion: "असमान रेखीय गति",
    constantSpeed: "पूरे समय स्थिर गति", speedNeverChanges: "गति में परिवर्तन नहीं होता",
    equalDistances: "समान समय में समान दूरी", exampleTrain: "उदाहरण: स्थिर गति से चलती ट्रेन",
    speedChanging: "गति बदलती रहती है", fasterSlower: "कभी तेज, कभी धीमी",
    unequalDistances: "समान समय में अलग-अलग दूरी", exampleCar: "उदाहरण: शहर के ट्रैफिक में कार",
    howToIdentify: "गति के प्रकार की पहचान कैसे करें?", lookAtDistance: "समान समयांतराल में तय की गई दूरी को देखें:",
    sameDistance: "हर बार समान दूरी", differentDistances: "हर बार अलग दूरी",
    uniformMotionLabel: "समान गति", nonUniformMotionLabel: "असमान गति",
    simulationTitle: "इंटरैक्टिव सिमुलेशन", simulationDesc: "दोनों प्रकार की गति को साथ-साथ देखें!",
    uniformLabel: "समान गति - स्थिर चाल", nonUniformLabel: "असमान गति - बदलती चाल",
    start: "शुरू करें", stop: "रोकें", reset: "रीसेट",
    timeElapsed: "बीता समय", distanceCovered: "तय दूरी", currentSpeed: "वर्तमान गति",
    recordedData: "रिकॉर्ड किया गया डेटा", time: "समय", totalDistance: "कुल दूरी",
    intervalDistance: "प्रति अंतराल दूरी", whatToObserve: "क्या देखें",
    observeGreen: "हरी कार हर सेकंड समान दूरी तय करती है",
    observeRed: "लाल कार कभी तेज होती है, कभी धीमी",
    observeTable: "तालिकाएँ देखें — समान गति में अंतराल दूरी समान रहती है",
    applicationsTitle: "वास्तविक जीवन के अनुप्रयोग", applicationsDesc: "देखें कि रोज़मर्रा की ज़िंदगी में समान और असमान गति कैसी दिखती है",
    highSpeedTrains: "हाई-स्पीड ट्रेनें", highSpeedTrainsDesc: "आधुनिक बुलेट ट्रेनें सीधी पटरियों पर स्थिर गति बनाए रखती हैं।",
    cityTraffic: "शहर का ट्रैफिक", cityTrafficDesc: "शहर की सड़कों पर गाड़ियाँ लगातार गति बढ़ाती और घटाती रहती हैं।",
    conveyorBelts: "कन्वेयर बेल्ट", conveyorBeltsDesc: "कारखानों की असेंबली लाइनें स्थिर गति से चलती हैं।",
    rollerCoasters: "रोलर कोस्टर", rollerCoastersDesc: "गति लगातार बदलती रहती है — त्वरन और मंदन।",
    cruiseFlight: "क्रूज़ उड़ान", cruiseFlightDesc: "विमान क्रूज़ ऊँचाई पर स्थिर गति बनाए रखते हैं।",
    marathonRunning: "मैराथन दौड़", marathonRunningDesc: "धावक दौड़ के दौरान अपनी चाल समायोजित करते रहते हैं।",
    whyMatters: "यह क्यों महत्वपूर्ण है", whyMattersDesc: "गति की समझ इंजीनियरों को बेहतर प्रणालियाँ डिज़ाइन करने में मदद करती है।",
    didYouKnowTitle: "पाठ्यपुस्तक से परे", didYouKnowDesc: "गति से जुड़ी आधुनिक और रोमांचक अवधारणाएँ!",
    selfDrivingCars: "स्वचालित (सेल्फ-ड्राइविंग) कारें", selfDrivingCarsDesc: "आधुनिक स्वचालित कारें AI के माध्यम से अपनी गति समायोजित करती हैं।",
    spaceTravel: "अंतरिक्ष में गति", spaceTravelDesc: "अंतरिक्ष यान लगभग 28,000 किमी/घंटा की गति से चलते हैं!",
    sportsTech: "खेल प्रौद्योगिकी", sportsTechDesc: "एथलीट प्रदर्शन विश्लेषण के लिए मोशन-ट्रैकિંગ का उपयोग करते हैं।",
    hyperloop: "भविष्य का परिवहन: हाइपरलूप", hyperloopDesc: "1,000 किमी/घंटा से अधिक की गति से यात्रा संभव!"
  },
  gu: {
    title: "એકસમાન અને અસમાન ગતિ", subtitle: "ઇન્ટરેક્ટિવ સિમ્યુલેશન અને રસપ્રદ પાઠો દ્વારા ગતિની દુનિયા શોધો",
    learn: "શીખો", simulate: "સિમ્યુલેટ", applications: "ઉપયોગો", didYouKnow: "શું તમે જાણો છો?",
    uniformMotion: "એકસમાન રેખીય ગતિ", nonUniformMotion: "અસમાન રેખીય ગતિ",
    constantSpeed: "સંપૂર્ણ સમય દરમિયાન સ્થિર ઝડપ", speedNeverChanges: "ઝડપમાં ફેરફાર થતો નથી",
    equalDistances: "સમાન સમયમાં સમાન અંતર", exampleTrain: "ઉદાહરણ: સ્થિર ઝડપે દોડતી ટ્રેન",
    speedChanging: "ઝડપ બદલાતી રહે છે", fasterSlower: "ક્યારેક ઝડપી, ક્યારેક ધીમી",
    unequalDistances: "સમાન સમયમાં જુદા જુદા અંતર", exampleCar: "ઉદાહરણ: શહેરના ટ્રાફિકમાં કાર",
    howToIdentify: "ગતિનો પ્રકાર કેવી રીતે ઓળખવો?", lookAtDistance: "સમાન સમય અંતરાલમાં કવર થયેલા અંતરને જુઓ:",
    sameDistance: "દર વખતે સમાન અંતર", differentDistances: "દર વખતે જુદો અંતર",
    uniformMotionLabel: "એકસમાન ગતિ", nonUniformMotionLabel: "અસમાન ગતિ",
    simulationTitle: "ઇન્ટરેક્ટિવ સિમ્યુલેશન", simulationDesc: "બંને પ્રકારની ગતિને બાજુ-બાજુ જુઓ!",
    uniformLabel: "એકસમાન ગતિ - સ્થિર ઝડપ", nonUniformLabel: "અસમાન ગતિ - બદલાતી ઝડપ",
    start: "શરૂ કરો", stop: "બંધ કરો", reset: "રીસેટ",
    timeElapsed: "ગત સમય", distanceCovered: "કવર થયેલું અંતર", currentSpeed: "વર્તમાન ઝડપ",
    recordedData: "રેકોર્ડ થયેલો ડેટા", time: "સમય", totalDistance: "કુલ અંતર",
    intervalDistance: "દર અંતરાલનું અંતર", whatToObserve: "શું જોવું",
    observeGreen: "લીલી કાર દર સેકન્ડે સમાન અંતર કાપે છે",
    observeRed: "લાલ કાર ક્યારેક ઝડપી બને છે, ક્યારેક ધીમી થાય છે",
    observeTable: "ટેબલ જુઓ — એકસમાન ગતિમાં અંતરાલ અંતર સમાન રહે છે",
    applicationsTitle: "વાસ્તવિક જીવનના ઉપયોગો", applicationsDesc: "રોજિંદા જીવનમાં એકસમાન અને અસમાન ગતિ કેવી દેખાય છે તે જુઓ",
    highSpeedTrains: "હાઈ-સ્પીડ ટ્રેનો", highSpeedTrainsDesc: "આધુનિક બુલેટ ટ્રેનો સીધી પાટીઓ પર સ્થિર ઝડપ જાળવે છે.",
    cityTraffic: "શહેરનો ટ્રાફિક", cityTrafficDesc: "શહેરની સડકો પર કારો સતત ઝડપ વધારી અને ઘટાડી રહે છે.",
    conveyorBelts: "કન્વેયર બેલ્ટ", conveyorBeltsDesc: "ફેક્ટરી એસેમ્બલી લાઈનો સ્થિર ઝડપે ચાલે છે.",
    rollerCoasters: "રોલર કોસ્ટર", rollerCoastersDesc: "ઝડપ સતત બદલાતી રહે છે — પ્રવેગ અને મંદન.",
    cruiseFlight: "ક્રૂઝ ફ્લાઇટ", cruiseFlightDesc: "વિમાનો ક્રૂઝ ઊંચાઈ પર સ્થિર ઝડપ જાળવે છે.",
    marathonRunning: "મેરેથોન દોડ", marathonRunningDesc: "દોડ દરમ્યાન દોડકો પોતાની ઝડપ સમયાંતરે સમાયોજિત કરે છે.",
    whyMatters: "આ કેમ મહત્વનું છે", whyMattersDesc: "ગતિની સમજ ઇજનેરોને વધુ સારી સિસ્ટમો ડિઝાઇન કરવામાં મદદ કરે છે.",
    didYouKnowTitle: "પાઠ્યપુસ્તકથી પરે", didYouKnowDesc: "ગતિ વિષયની આધુનિક અને રોમાંચક કલ્પનાઓ!",
    selfDrivingCars: "સ્વચાલિત (સેલ્ફ-ડ્રાઈવિંગ) કારો", selfDrivingCarsDesc: "આધુનિક સ્વચાલિત કારો AI દ્વારા પોતાની ઝડપ સમાયોજિત કરે છે.",
    spaceTravel: "અવકાશમાં ગતિ", spaceTravelDesc: "અવકાશ યાનો લગભગ 28,000 કિમી/કલાકની ઝડપે ચાલે છે!",
    sportsTech: "રમતગમત ટેકનોલોજી", sportsTechDesc: "ક્રીડાપટુઓ પ્રદર્શન વિશ્લેષણ માટે મોશન-ટ્રેકિંગનો ઉપયોગ કરે છે.",
    hyperloop: "ભવિષ્યનું પરિવહન: હાઇપરલૂપ", hyperloopDesc: "1,000 કિમી/કલાકથી વધુ ઝડપે મુસાફરી શક્ય!"
  }
};

const UniformMotionLearningTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'learn' | 'simulate' | 'applications' | 'didYouKnow'>('learn');
  const [language, setLanguage] = useState<Language>('en');
  const [uniformRunning, setUniformRunning] = useState<boolean>(false);
  const [nonUniformRunning, setNonUniformRunning] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [viewportWidth, setViewportWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [uniformPosition, setUniformPosition] = useState<number>(0);
  const [nonUniformPosition, setNonUniformPosition] = useState<number>(0);
  const [uniformTime, setUniformTime] = useState<number>(0);
  const [nonUniformTime, setNonUniformTime] = useState<number>(0);
  const [uniformData, setUniformData] = useState<DataPoint[]>([]);
  const [nonUniformData, setNonUniformData] = useState<DataPoint[]>([]);

  const t = translations[language];
  const nonUniformSpeeds: number[] = [10, 25, 15, 30, 20, 35];

  // Handle viewport changes for responsiveness
  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu when switching to desktop
  useEffect(() => {
    if (viewportWidth > 860 && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [viewportWidth, isMobileMenuOpen]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (uniformRunning && uniformPosition < 100) {
      interval = setInterval(() => {
        setUniformPosition((prev) => {
          const newPos = Math.min(prev + 2, 100);
          if (newPos >= 100) setUniformRunning(false);
          return newPos;
        });
        setUniformTime((prev) => prev + 1);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [uniformRunning, uniformPosition]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (nonUniformRunning && nonUniformPosition < 100) {
      interval = setInterval(() => {
        setNonUniformPosition((prev) => {
          const speedIndex = Math.floor(prev / 16.67) % nonUniformSpeeds.length;
          const speed = nonUniformSpeeds[speedIndex] / 10;
          const newPos = Math.min(prev + speed, 100);
          if (newPos >= 100) setNonUniformRunning(false);
          return newPos;
        });
        setNonUniformTime((prev) => prev + 1);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [nonUniformRunning, nonUniformPosition, nonUniformSpeeds]);

  useEffect(() => {
    if (uniformTime % 10 === 0 && uniformTime > 0) {
      setUniformData((prev) => [...prev, {
        time: uniformTime / 10,
        distance: (uniformPosition / 100 * 120).toFixed(1)
      }]);
    }
  }, [uniformTime, uniformPosition]);

  useEffect(() => {
    if (nonUniformTime % 10 === 0 && nonUniformTime > 0) {
      setNonUniformData((prev) => [...prev, {
        time: nonUniformTime / 10,
        distance: (nonUniformPosition / 100 * 120).toFixed(1)
      }]);
    }
  }, [nonUniformTime, nonUniformPosition]);

  const resetUniform = () => { setUniformRunning(false); setUniformPosition(0); setUniformTime(0); setUniformData([]); };
  const resetNonUniform = () => { setNonUniformRunning(false); setNonUniformPosition(0); setNonUniformTime(0); setNonUniformData([]); };
  const resetBoth = () => { resetUniform(); resetNonUniform(); };
  const startBoth = () => { if (uniformPosition < 100) setUniformRunning(true); if (nonUniformPosition < 100) setNonUniformRunning(true); };
  const stopBoth = () => { setUniformRunning(false); setNonUniformRunning(false); };

  const renderCar = (position: number, color: string) => (
    <svg width="50" height="28" viewBox="0 0 50 28" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{
        position: 'absolute', top: '50%', transform: 'translateY(-50%)',
        left: `calc(${position}% - 25px)`, transition: 'left 0.1s linear',
        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))'
      }}>
      <path d="M8 18 L10 11 L15 8 L35 8 L40 11 L42 18 L42 22 L8 22 L8 18 Z" fill={color} stroke="#1a1a1a" strokeWidth="1"/>
      <path d="M14 11 L15 8 L35 8 L36 11 Z" fill={color === '#10b981' ? '#059669' : '#d97706'} stroke="#1a1a1a" strokeWidth="1"/>
      <rect x="16" y="9" width="7" height="5" rx="0.5" fill="#60a5fa" opacity="0.7" stroke="#1a1a1a" strokeWidth="0.7"/>
      <rect x="27" y="9" width="7" height="5" rx="0.5" fill="#60a5fa" opacity="0.7" stroke="#1a1a1a" strokeWidth="0.7"/>
      <circle cx="14" cy="22" r="3.5" fill="#1a1a1a" stroke="#64748b" strokeWidth="1.2"/>
      <circle cx="14" cy="22" r="1.8" fill="#94a3b8"/>
      <circle cx="36" cy="22" r="3.5" fill="#1a1a1a" stroke="#64748b" strokeWidth="1.2"/>
      <circle cx="36" cy="22" r="1.8" fill="#94a3b8"/>
      <circle cx="40" cy="16" r="1.2" fill="#fef08a" opacity="0.9"/>
    </svg>
  );

  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #dbeafe 100%)'
    }}>
      {/* Navbar */}
      <nav style={{
        background: 'white', boxShadow: '0 2px 15px rgba(0, 0, 0, 0.08)',
        padding: '0 20px', position: 'sticky', top: 0, zIndex: 1000, borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{
          maxWidth: '1400px', margin: '0 auto', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between', height: '70px'
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            fontSize: '1.5em', fontWeight: 700
          }}>
            <span style={{
              fontSize: '1.8em',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>⚡</span>
            <span style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              {language === 'en' ? 'Energy and Motion' : language === 'hi' ? 'ऊर्जा और गति' : 'ઊર્જા અને ગતિ'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', position: 'relative' }}>
            {viewportWidth > 860 ? (
              <>
                {['learn', 'simulate', 'applications'].map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab as any)}
                    style={{
                      padding: '10px 24px', border: 'none', borderRadius: '10px', cursor: 'pointer',
                      background: activeTab === tab ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
                      color: activeTab === tab ? 'white' : '#64748b',
                      fontSize: '0.95em', fontWeight: 600, transition: 'all 0.3s ease',
                      display: 'flex', alignItems: 'center', gap: '8px',
                      boxShadow: activeTab === tab ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none'
                    }}>
                    <span>{tab === 'learn' ? '📚' : tab === 'simulate' ? '🔬' : tab === 'applications' ? '🌍' : '💡'}</span>
                    {t[tab as keyof typeof t] as string}
                  </button>
                ))}
                <select value={language} onChange={(e) => setLanguage(e.target.value as Language)}
                  style={{
                    padding: '10px 16px', border: '2px solid #e5e7eb', borderRadius: '10px',
                    background: 'white', fontSize: '0.95em', fontWeight: 600,
                    cursor: 'pointer', marginLeft: '12px'
                  }}>
                  <option value="en">🇬🇧 English</option>
                  <option value="hi">🇮🇳 हिंदी</option>
                  <option value="gu">🇮🇳 ગુજરાતી</option>
                </select>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                  aria-label="Open menu"
                  style={{
                    padding: '10px 14px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    background: 'white',
                    fontSize: '1.2em',
                    fontWeight: 700,
                    cursor: 'pointer',
                    color: '#1f2937'
                  }}
                >
                  ☰
                </button>
                {isMobileMenuOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '70px',
                    right: 0,
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.12)',
                    padding: '12px',
                    width: 'calc(100vw - 40px)',
                    maxWidth: '320px',
                    zIndex: 1100
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {['learn', 'simulate', 'applications'].map((tab) => (
                        <button key={tab} onClick={() => { setActiveTab(tab as any); setIsMobileMenuOpen(false); }}
                          style={{
                            padding: '12px 16px', border: 'none', borderRadius: '10px', cursor: 'pointer',
                            background: activeTab === tab ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : '#f8fafc',
                            color: activeTab === tab ? 'white' : '#475569',
                            fontSize: '0.95em', fontWeight: 700, transition: 'all 0.3s ease',
                            display: 'flex', alignItems: 'center', gap: '8px',
                            boxShadow: activeTab === tab ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none'
                          }}>
                          <span>{tab === 'learn' ? '📚' : tab === 'simulate' ? '🔬' : tab === 'applications' ? '🌍' : '💡'}</span>
                          {t[tab as keyof typeof t] as string}
                        </button>
                      ))}
                      <select value={language} onChange={(e) => { setLanguage(e.target.value as Language);  setIsMobileMenuOpen(false); }}
                        style={{
                          padding: '12px 14px', border: '2px solid #e5e7eb', borderRadius: '10px',
                          background: 'white', fontSize: '0.95em', fontWeight: 600,
                          cursor: 'pointer', width: '100%'
                        }}>
                        <option value="en">🇬🇧 English</option>
                        <option value="hi">🇮🇳 हिंदी</option>
                        <option value="gu">🇮🇳 ગુજરાતી</option>
                      </select>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Learn Tab */}
        {activeTab === 'learn' && (
          <div>
            {/* Hero */}
            <div style={{
              backgroundColor: 'cadetblue',
              borderRadius: '24px',
              padding: '50px',
              paddingTop: '10px',
              marginBottom: '40px',
              boxShadow: '0 20px 50px rgba(99, 102, 241, 0.3)',
              color: 'white',
              textAlign: 'center'
            }}>
              <h1 style={{
                fontSize: '3em',
                fontWeight: 800,
                marginBottom: '15px',
                textShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}>
                {t.title}
              </h1>
              <p style={{
                fontSize: '1.3em',
                opacity: 0.95,
                maxWidth: '700px',
                margin: '0 auto',
                lineHeight: 1.6,
              }}>
                {t.subtitle}
              </p>
            </div>

            {/* Concept cards - REDESIGNED */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: viewportWidth > 768 ? '1fr 1fr' : '1fr',
              gap: '30px',
              marginBottom: '40px'
            }}>
              {/* Uniform Motion Card */}
              <div style={{
                background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                borderRadius: '24px',
                padding: '40px',
                boxShadow: '0 10px 40px rgba(16, 185, 129, 0.15)',
                border: '3px solid #10b981',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 15px 50px rgba(16, 185, 129, 0.25)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 40px rgba(16, 185, 129, 0.15)';
              }}>
                {/* Decorative circle */}
                <div style={{
                  position: 'absolute',
                  top: '-40px',
                  right: '-40px',
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  background: '#10b981',
                  opacity: 0.1
                }} />
                
                <h3 style={{
                  color: '#065f46',
                  fontSize: '1.8em',
                  fontWeight: 800,
                  marginTop: '0px',
                  marginBottom: '30px',
                  position: 'relative'
                }}>
                  {t.uniformMotion}
                </h3>
                
                <div style={{
                  background: 'white',
                  borderRadius: '15px',
                  padding: '25px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                }}>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0
                  }}>
                    {[
                      t.constantSpeed,
                      t.speedNeverChanges,
                      t.equalDistances,
                      t.exampleTrain
                    ].map((item, idx) => (
                      <li key={idx} style={{
                        padding: '15px 0',
                        borderBottom: idx < 3 ? '2px solid #ecfdf5' : 'none',
                        color: '#1f2937',
                        fontSize: '1.1em',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px'
                      }}>
                        <span style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          background: '#10b981',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.2em',
                          flexShrink: 0,
                          fontWeight: 'bold'
                        }}>✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Non-uniform Motion Card */}
              <div style={{
                background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                borderRadius: '24px',
                padding: '40px',
                boxShadow: '0 10px 40px rgba(245, 158, 11, 0.15)',
                border: '3px solid #f59e0b',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 15px 50px rgba(245, 158, 11, 0.25)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 40px rgba(245, 158, 11, 0.15)';
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-40px',
                  right: '-40px',
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  background: '#f59e0b',
                  opacity: 0.1
                }} />
                
                <h3 style={{
                  color: '#92400e',
                  fontSize: '1.8em',
                  fontWeight: 800,
                  marginTop: '0px',
                  marginBottom: '30px',
                  position: 'relative'
                }}>
                  {t.nonUniformMotion}
                </h3>
                
                <div style={{
                  background: 'white',
                  borderRadius: '15px',
                  padding: '25px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                }}>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0
                  }}>
                    {[
                      t.speedChanging,
                      t.fasterSlower,
                      t.unequalDistances,
                      t.exampleCar
                    ].map((item, idx) => (
                      <li key={idx} style={{
                        padding: '15px 0',
                        borderBottom: idx < 3 ? '2px solid #fffbeb' : 'none',
                        color: '#1f2937',
                        fontSize: '1.1em',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px'
                      }}>
                        <span style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          background: '#f59e0b',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.2em',
                          flexShrink: 0,
                          fontWeight: 'bold'
                        }}>✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* How to Identify section */}
            <div style={{
              background: 'white',
              borderRadius: '24px',
              padding: '45px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
              border: '2px solid #e5e7eb'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                marginBottom: '30px'
              }}>
                <div style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5em',
                  flexShrink: 0,
                  boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)'
                }}>🔍</div>
                <h3 style={{
                  color: '#1a1a1a',
                  fontSize: '2em',
                  fontWeight: 800,
                  margin: 0
                }}>
                  {t.howToIdentify}
                </h3>
              </div>
              
              <p style={{
                color: '#64748b',
                fontSize: '1.2em',
                marginBottom: '35px',
                lineHeight: 1.7,
                fontWeight: 500,
                textAlign: 'left',
                paddingLeft: '10px'
              }}>
                {t.lookAtDistance}
              </p>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: viewportWidth > 768 ? '1fr 1fr' : '1fr',
                gap: '20px'
              }}>
                {/* Green box */}
                <div style={{
                  padding: '25px', textAlign: 'center',
                  background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                  borderRadius: '16px', border: '3px solid #10b981',
                  boxShadow: '0 6px 20px rgba(16, 185, 129, 0.2)'
                }}>
                  <div style={{
                    fontSize: '1.3em', color: '#10b981', fontWeight: 800, marginBottom: '10px'
                  }}>{t.sameDistance}</div>
                  <div style={{
                    fontSize: '1.5em', color: '#065f46', fontWeight: 700
                  }}>→ {t.uniformMotionLabel}</div>
                </div>

                {/* Orange box */}
                <div style={{
                  padding: '25px', textAlign: 'center',
                  background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                  borderRadius: '16px', border: '3px solid #f59e0b',
                  boxShadow: '0 6px 20px rgba(245, 158, 11, 0.2)'
                }}>
                  <div style={{
                    fontSize: '1.3em', color: '#f59e0b', fontWeight: 800, marginBottom: '10px'
                  }}>{t.differentDistances}</div>
                  <div style={{
                    fontSize: '1.5em', color: '#92400e', fontWeight: 700
                  }}>→ {t.nonUniformMotionLabel}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Simulate Tab WITH DATA TABLES */}
        {activeTab === 'simulate' && (
          <div>
            <div style={{
              background: 'white', borderRadius: '20px', padding: '35px',
              marginBottom: '30px', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
              textAlign: 'center'
            }}>
              <h2 style={{ fontSize: '2em', fontWeight: 700, marginBottom: '10px' }}>
                🔬 {t.simulationTitle}
              </h2>
              <p style={{ color: '#64748b', fontSize: '1.15em', lineHeight: 1.6 }}>
                {t.simulationDesc}
              </p>
            </div>

            {/* Control buttons */}
            <div style={{
              background: 'white', borderRadius: '20px', padding: '25px',
              marginBottom: '25px', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
              display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap'
            }}>
              <button onClick={startBoth} disabled={(uniformRunning || uniformPosition >= 100) && (nonUniformRunning || nonUniformPosition >= 100)}
                style={{
                  padding: '16px 40px', fontSize: '1.1em', fontWeight: 700,
                  border: 'none', borderRadius: '15px',
                  cursor: (uniformRunning || uniformPosition >= 100) && (nonUniformRunning || nonUniformPosition >= 100) ? 'not-allowed' : 'pointer',
                  background: (uniformRunning || uniformPosition >= 100) && (nonUniformRunning || nonUniformPosition >= 100) ? '#e0e0e0' : 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white', boxShadow: '0 6px 18px rgba(16, 185, 129, 0.4)',
                  display: 'flex', alignItems: 'center', gap: '10px'
                }}>
                <span>▶️</span> {t.start}
              </button>
              
              <button onClick={stopBoth} disabled={!uniformRunning && !nonUniformRunning}
                style={{
                  padding: '16px 40px', fontSize: '1.1em', fontWeight: 700,
                  border: 'none', borderRadius: '15px',
                  cursor: !uniformRunning && !nonUniformRunning ? 'not-allowed' : 'pointer',
                  background: !uniformRunning && !nonUniformRunning ? '#e0e0e0' : 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: 'white', boxShadow: '0 6px 18px rgba(239, 68, 68, 0.4)',
                  display: 'flex', alignItems: 'center', gap: '10px'
                }}>
                <span>⏸️</span> {t.stop}
              </button>
              
              <button onClick={resetBoth}
                style={{
                  padding: '16px 40px', fontSize: '1.1em', fontWeight: 700,
                  border: '3px solid #6366f1', borderRadius: '15px', cursor: 'pointer',
                  background: 'white', color: '#6366f1',
                  boxShadow: '0 6px 18px rgba(99, 102, 241, 0.2)',
                  display: 'flex', alignItems: 'center', gap: '10px'
                }}>
                <span>🔄</span> {t.reset}
              </button>
            </div>

            {/* Side by side tracks */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: viewportWidth > 900 ? '1fr 1fr' : '1fr',
              gap: '25px'
            }}>
              {/* Uniform Track */}
              <div style={{
                background: 'white', borderRadius: '20px', padding: '30px',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)', border: '4px solid #10b981'
              }}>
                <h3 style={{
                  color: '#10b981', fontSize: '1.3em', fontWeight: 700, marginBottom: '20px'
                }}>🟢 {t.uniformLabel}</h3>
                
                {/* Track */}
                <div style={{
                  position: 'relative', height: '90px',
                  background: 'linear-gradient(180deg, #dbeafe 0%, #eff6ff 50%, #dbeafe 100%)',
                  borderRadius: '12px', marginBottom: '20px',
                  border: '3px solid #93c5fd', overflow: 'visible'
                }}>
                  <div style={{
                    position: 'absolute', top: '50%', left: 0, right: 0, height: '4px',
                    background: 'repeating-linear-gradient(90deg, #fbbf24 0px, #fbbf24 25px, transparent 25px, transparent 45px)',
                    transform: 'translateY(-50%)', opacity: 0.7
                  }} />
                  
                  {[0, 24, 48, 72, 96, 120].map((mark, idx) => (
                    <div key={mark} style={{
                      position: 'absolute', left: `${(mark / 120) * 100}%`,
                      top: 0, bottom: 0, width: '2px',
                      background: idx === 0 || idx === 5 ? '#3b82f6' : '#bfdbfe'
                    }}>
                      <span style={{
                        position: 'absolute', bottom: '-25px', left: '50%',
                        transform: 'translateX(-50%)', fontSize: '0.8em',
                        color: '#64748b', fontWeight: 600
                      }}>{mark}m</span>
                    </div>
                  ))}
                  
                  {renderCar(uniformPosition, '#10b981')}
                </div>
                
                {/* Stats */}
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '10px', marginTop: '35px'
                }}>
                  <div style={{
                    background: '#ecfdf5', padding: '12px', borderRadius: '10px', textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.75em', color: '#059669', marginBottom: '4px', fontWeight: 600 }}>
                      ⏱️ {t.time}
                    </div>
                    <div style={{ fontSize: '1.3em', color: '#065f46', fontWeight: 800 }}>
                      {(uniformTime / 10).toFixed(1)}s
                    </div>
                  </div>
                  <div style={{
                    background: '#ecfdf5', padding: '12px', borderRadius: '10px', textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.75em', color: '#059669', marginBottom: '4px', fontWeight: 600 }}>
                      📏 {language === 'en' ? 'Distance' : language === 'hi' ? 'दूरी' : 'અંતર'}
                    </div>
                    <div style={{ fontSize: '1.3em', color: '#065f46', fontWeight: 800 }}>
                      {(uniformPosition * 120 / 100).toFixed(1)}m
                    </div>
                  </div>
                  <div style={{
                    background: '#ecfdf5', padding: '12px', borderRadius: '10px', textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.75em', color: '#059669', marginBottom: '4px', fontWeight: 600 }}>
                      ⚡ {language === 'en' ? 'Speed' : language === 'hi' ? 'गति' : 'ઝડપ'}
                    </div>
                    <div style={{ fontSize: '1.3em', color: '#065f46', fontWeight: 800 }}>
                      {uniformTime > 0 ? ((uniformPosition * 120 / 100) / (uniformTime / 10)).toFixed(1) : '0.0'}
                    </div>
                  </div>
                </div>

                {/* DATA TABLE FOR UNIFORM */}
                {uniformData.length > 0 && (
                  <div style={{ marginTop: '25px' }}>
                    <h4 style={{ fontSize: '1.1em', fontWeight: 700, marginBottom: '12px', color: '#065f46' }}>
                      📊 {t.recordedData}
                    </h4>
                    <div style={{ overflowX: 'auto', borderRadius: '12px', border: '2px solid #10b981' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
                        <thead>
                          <tr style={{ background: '#10b981' }}>
                            <th style={{ color: 'white', padding: '12px', textAlign: 'center', fontWeight: 600, fontSize: '0.85em' }}>
                              {t.time} (s)
                            </th>
                            <th style={{ color: 'white', padding: '12px', textAlign: 'center', fontWeight: 600, fontSize: '0.85em' }}>
                              {t.totalDistance} (m)
                            </th>
                            <th style={{ color: 'white', padding: '12px', textAlign: 'center', fontWeight: 600, fontSize: '0.85em' }}>
                              {t.intervalDistance} (m)
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {uniformData.map((row, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid #ecfdf5' }}>
                              <td style={{ padding: '10px', textAlign: 'center', fontWeight: 600 }}>
                                {row.time}
                              </td>
                              <td style={{ padding: '10px', textAlign: 'center', fontWeight: 600 }}>
                                {row.distance}
                              </td>
                              <td style={{
                                padding: '10px', textAlign: 'center',
                                background: '#fef3c7', fontWeight: 800, color: '#92400e'
                              }}>
                                {index === 0 ? row.distance : (parseFloat(row.distance) - parseFloat(uniformData[index - 1].distance)).toFixed(1)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Non-uniform Track (same structure) */}
              <div style={{
                background: 'white', borderRadius: '20px', padding: '30px',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)', border: '4px solid #f59e0b'
              }}>
                <h3 style={{
                  color: '#f59e0b', fontSize: '1.3em', fontWeight: 700, marginBottom: '20px'
                }}>🔴 {t.nonUniformLabel}</h3>
                
                <div style={{
                  position: 'relative', height: '90px',
                  background: 'linear-gradient(180deg, #dbeafe 0%, #eff6ff 50%, #dbeafe 100%)',
                  borderRadius: '12px', marginBottom: '20px',
                  border: '3px solid #93c5fd', overflow: 'visible'
                }}>
                  <div style={{
                    position: 'absolute', top: '50%', left: 0, right: 0, height: '4px',
                    background: 'repeating-linear-gradient(90deg, #fbbf24 0px, #fbbf24 25px, transparent 25px, transparent 45px)',
                    transform: 'translateY(-50%)', opacity: 0.7
                  }} />
                  
                  {[0, 24, 48, 72, 96, 120].map((mark, idx) => (
                    <div key={mark} style={{
                      position: 'absolute', left: `${(mark / 120) * 100}%`,
                      top: 0, bottom: 0, width: '2px',
                      background: idx === 0 || idx === 5 ? '#3b82f6' : '#bfdbfe'
                    }}>
                      <span style={{
                        position: 'absolute', bottom: '-25px', left: '50%',
                        transform: 'translateX(-50%)', fontSize: '0.8em',
                        color: '#64748b', fontWeight: 600
                      }}>{mark}m</span>
                    </div>
                  ))}
                  
                  {renderCar(nonUniformPosition, '#f59e0b')}
                </div>
                
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '10px', marginTop: '35px'
                }}>
                  <div style={{
                    background: '#fffbeb', padding: '12px', borderRadius: '10px', textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.75em', color: '#d97706', marginBottom: '4px', fontWeight: 600 }}>
                      ⏱️ {t.time}
                    </div>
                    <div style={{ fontSize: '1.3em', color: '#92400e', fontWeight: 800 }}>
                      {(nonUniformTime / 10).toFixed(1)}s
                    </div>
                  </div>
                  <div style={{
                    background: '#fffbeb', padding: '12px', borderRadius: '10px', textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.75em', color: '#d97706', marginBottom: '4px', fontWeight: 600 }}>
                      📏 {language === 'en' ? 'Distance' : language === 'hi' ? 'दूरी' : 'અંતર'}
                    </div>
                    <div style={{ fontSize: '1.3em', color: '#92400e', fontWeight: 800 }}>
                      {(nonUniformPosition * 120 / 100).toFixed(1)}m
                    </div>
                  </div>
                  <div style={{
                    background: '#fffbeb', padding: '12px', borderRadius: '10px', textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.75em', color: '#d97706', marginBottom: '4px', fontWeight: 600 }}>
                      ⚡ {language === 'en' ? 'Speed' : language === 'hi' ? 'गति' : 'ઝડપ'}
                    </div>
                    <div style={{ fontSize: '1.3em', color: '#92400e', fontWeight: 800 }}>
                      {nonUniformTime > 0 ? ((nonUniformPosition * 120 / 100) / (nonUniformTime / 10)).toFixed(1) : '0.0'}
                    </div>
                  </div>
                </div>

                {/* DATA TABLE FOR NON-UNIFORM */}
                {nonUniformData.length > 0 && (
                  <div style={{ marginTop: '25px' }}>
                    <h4 style={{ fontSize: '1.1em', fontWeight: 700, marginBottom: '12px', color: '#92400e' }}>
                      📊 {t.recordedData}
                    </h4>
                    <div style={{ overflowX: 'auto', borderRadius: '12px', border: '2px solid #f59e0b' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
                        <thead>
                          <tr style={{ background: '#f59e0b' }}>
                            <th style={{ color: 'white', padding: '12px', textAlign: 'center', fontWeight: 600, fontSize: '0.85em' }}>
                              {t.time} (s)
                            </th>
                            <th style={{ color: 'white', padding: '12px', textAlign: 'center', fontWeight: 600, fontSize: '0.85em' }}>
                              {t.totalDistance} (m)
                            </th>
                            <th style={{ color: 'white', padding: '12px', textAlign: 'center', fontWeight: 600, fontSize: '0.85em' }}>
                              {t.intervalDistance} (m)
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {nonUniformData.map((row, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid #fffbeb'}}>
                              <td style={{ padding: '10px', textAlign: 'center', fontWeight: 600 }}>
                                {row.time}
                              </td>
                              <td style={{ padding: '10px', textAlign: 'center', fontWeight: 600 }}>
                                {row.distance}
                              </td>
                              <td style={{
                                padding: '10px', textAlign: 'center', fontWeight: 800, color: '#92400e', backgroundColor: '#d1fae5'
                              }}>
                                {index === 0 ? row.distance : (parseFloat(row.distance) - parseFloat(nonUniformData[index - 1].distance)).toFixed(1)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* What to Observe */}
            <div style={{
              background: 'white', borderRadius: '20px', padding: '35px',
              marginTop: '25px', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)'
            }}>
              <h4 style={{
                fontSize: '1.5em', fontWeight: 700, marginBottom: '25px',
                display: 'flex', alignItems: 'center', gap: '12px'
              }}>
                <span>👀</span> {t.whatToObserve}
              </h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{
                  padding: '20px',
                  background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
                  borderRadius: '12px', fontSize: '1.1em', fontWeight: 500,
                  borderLeft: '5px solid #10b981'
                }}>• {t.observeGreen}</div>
                
                <div style={{
                  padding: '20px',
                  background: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
                  borderRadius: '12px', fontSize: '1.1em', fontWeight: 500,
                  borderLeft: '5px solid #f59e0b'
                }}>• {t.observeRed}</div>
                
                <div style={{
                  padding: '20px',
                  background: 'linear-gradient(135deg, #ede9fe, #ddd6fe)',
                  borderRadius: '12px', fontSize: '1.1em', fontWeight: 500,
                  borderLeft: '5px solid #8b5cf6'
                }}>• {t.observeTable}</div>
              </div>
            </div>
          </div>
        )}

        {/* Applications Tab WITH HOVER EFFECTS */}
        {activeTab === 'applications' && (
          <div>
            <div style={{
              background: 'white', borderRadius: '20px', padding: '35px',
              marginBottom: '30px', textAlign: 'center'
            }}>
              <h2 style={{ fontSize: '2em', fontWeight: 700, marginBottom: '10px' }}>
                🌍 {t.applicationsTitle}
              </h2>
              <p style={{ color: '#64748b', fontSize: '1.15em', lineHeight: 1.6 }}>
                {t.applicationsDesc}
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: viewportWidth > 768 ? 'repeat(2, 1fr)' : '1fr',
              gap: '25px'
            }}>
              {[
                { icon: '🚄', title: t.highSpeedTrains, desc: t.highSpeedTrainsDesc, type: 'uniform' },
                { icon: '🚗', title: t.cityTraffic, desc: t.cityTrafficDesc, type: 'non-uniform' },
                { icon: '🏭', title: t.conveyorBelts, desc: t.conveyorBeltsDesc, type: 'uniform' },
                { icon: '🎢', title: t.rollerCoasters, desc: t.rollerCoastersDesc, type: 'non-uniform' },
                { icon: '✈️', title: t.cruiseFlight, desc: t.cruiseFlightDesc, type: 'uniform' },
                { icon: '🏃', title: t.marathonRunning, desc: t.marathonRunningDesc, type: 'non-uniform' }
              ].map((app, idx) => (
                <div key={idx} style={{
                  background: 'white', borderRadius: '20px', padding: '30px',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
                  border: '2px solid #f0f0f0',
                  transition: 'all 0.3s ease', cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 15px 45px rgba(0, 0, 0, 0.15)';
                  e.currentTarget.style.borderColor = app.type === 'uniform' ? '#10b981' : '#f59e0b';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.08)';
                  e.currentTarget.style.borderColor = '#f0f0f0';
                }}>
                  <div style={{ fontSize: '3em', marginBottom: '15px' }}>{app.icon}</div>
                  <h3 style={{ fontSize: '1.4em', fontWeight: 700, marginBottom: '12px' }}>{app.title}</h3>
                  <div style={{
                    display: 'inline-block', padding: '6px 12px',
                    background: app.type === 'uniform' ? 'linear-gradient(135deg, #d1fae5, #a7f3d0)' : 'linear-gradient(135deg, #fef3c7, #fde68a)',
                    borderRadius: '8px', fontSize: '0.85em', fontWeight: 600,
                    color: app.type === 'uniform' ? '#065f46' : '#92400e',
                    marginBottom: '12px'
                  }}>
                    {app.type === 'uniform' ? t.uniformMotionLabel : t.nonUniformMotionLabel}
                  </div>
                  <p style={{ color: '#64748b', fontSize: '1.05em', lineHeight: 1.7 }}>{app.desc}</p>
                </div>
              ))}
            </div>

            {/* Did You Know section duplicated under Applications */}
            <div style={{
              background: 'white', borderRadius: '20px', padding: '35px',
              marginTop: '35px', textAlign: 'center',marginBottom: '35px'
            }}>
              <h2 style={{ fontSize: '2em', fontWeight: 700, marginBottom: '10px' }}>
                💡 {t.didYouKnowTitle}
              </h2>
              <p style={{ color: '#64748b', fontSize: '1.15em', lineHeight: 1.6 }}>
                {t.didYouKnowDesc}
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: viewportWidth > 768 ? 'repeat(2, 1fr)' : '1fr',
              gap: '25px', marginTop: '10px'
            }}>
              {[
                { icon: '🤖', title: t.selfDrivingCars, desc: t.selfDrivingCarsDesc, color1: '#8b5cf6', color2: '#7c3aed' },
                { icon: '🚀', title: t.spaceTravel, desc: t.spaceTravelDesc, color1: '#3b82f6', color2: '#2563eb' },
                { icon: '⚽', title: t.sportsTech, desc: t.sportsTechDesc, color1: '#10b981', color2: '#059669' },
                { icon: '🚅', title: t.hyperloop, desc: t.hyperloopDesc, color1: '#ef4444', color2: '#dc2626' }
              ].map((concept, idx) => (
                <div key={idx} style={{
                  background: 'white', borderRadius: '20px', padding: '35px',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
                  border: `3px solid #f0f0f0`,
                  transition: 'all 0.3s ease', cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 15px 45px rgba(0, 0, 0, 0.15)';
                  e.currentTarget.style.borderColor = concept.color1;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.08)';
                  e.currentTarget.style.borderColor = '#f0f0f0';
                }}>
                  <div style={{ fontSize: '4em', marginBottom: '20px' }}>{concept.icon}</div>
                  <h3 style={{ fontSize: '1.5em', fontWeight: 700, marginBottom: '15px' }}>{concept.title}</h3>
                  <p style={{ color: '#64748b', fontSize: '1.1em', lineHeight: 1.8 }}>{concept.desc}</p>
                  <div style={{
                    marginTop: '20px', display: 'inline-block', padding: '10px 20px',
                    background: `linear-gradient(135deg, ${concept.color1}, ${concept.color2})`,
                    color: 'white', borderRadius: '25px', fontSize: '0.9em',
                    fontWeight: 700, boxShadow: `0 4px 12px ${concept.color1}40`
                  }}>
                    {language === 'en' ? '21st Century Science' : language === 'hi' ? '२१वीं सदी का विज्ञान' : '21મી સદીનું વિજ્ઞાન'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UniformMotionLearningTool;