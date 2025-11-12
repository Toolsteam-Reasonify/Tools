import { useState, useEffect } from 'react';
import { Globe, DollarSign, Smartphone, Zap, Lightbulb, Scale, Calculator } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

// Hardcoded translations for Real World page
const realWorldTranslations = {
  en: {
    heroTitle: 'Real-World Applications of the Decimal Number System',
    heroDescription: 'See how decimal numbers are used every day in money, measurements, time, science, and digital devices.',
    categoryMoney: 'Money & Currency',
    categoryMeasurements: 'Measurements',
    categoryTime: 'Time Calculation',
    categoryScience: 'Science & Engineering',
    categoryDevices: 'Digital Devices',
    originalNumber: 'Original Number',
    exponentialForm: 'Exponential Form',
    breakdown: 'Breakdown',
    base: 'Base',
    exponent: 'Exponent',
    result: 'Result',
    whatThisMeans: 'What This Means',
    funFact: 'Fun Fact',
    animatedCalculation: 'Animated Calculation',
    whyUseExponents: 'Why Use Exponents?',
    reason1: 'Easier to read and write large numbers',
    reason2: 'Simpler to compare different values',
    reason3: 'Makes calculations more efficient',
    reason4: 'Universal in science and technology'
  },
  hi: {
    heroTitle: 'दशमलव संख्या प्रणाली के वास्तविक जीवन उपयोग',
    heroDescription: 'देखें कि दशमलव संख्याएँ रोज़मर्रा में धन, माप, समय, विज्ञान और डिजिटल उपकरणों में कैसे उपयोग होती हैं।',
    categoryMoney: 'धन और मुद्रा',
    categoryMeasurements: 'माप',
    categoryTime: 'समय गणना',
    categoryScience: 'विज्ञान और अभियांत्रिकी',
    categoryDevices: 'डिजिटल उपकरण',
    originalNumber: 'मूल संख्या',
    exponentialForm: 'घातीय रूप',
    breakdown: 'विभाजन',
    base: 'आधार',
    exponent: 'घातांक',
    result: 'परिणाम',
    whatThisMeans: 'इसका क्या मतलब है',
    funFact: 'मजेदार तथ्य',
    animatedCalculation: 'एनिमेटेड गणना',
    whyUseExponents: 'घातांक क्यों उपयोग करें?',
    reason1: 'बड़ी संख्याओं को पढ़ने और लिखने में आसान',
    reason2: 'विभिन्न मूल्यों की तुलना करना आसान',
    reason3: 'गणना को अधिक कुशल बनाता है',
    reason4: 'विज्ञान और प्रौद्योगिकी में सार्वभौमिक'
  },
  gu: {
    heroTitle: 'દશાંશ સંખ્યા પ્રણાલીના વાસ્તવિક ઉપયોગો',
    heroDescription: 'જુઓ કે દશાંશ સંખ્યાઓ દૈનિક જીવનમાં પૈસા, માપ, સમય, વિજ્ઞાન અને ડિજિટલ ઉપકરણોમાં કેવી રીતે વપરાય છે.',
    categoryMoney: 'પૈસા અને ચલણ',
    categoryMeasurements: 'માપ',
    categoryTime: 'સમય ગણતરી',
    categoryScience: 'વિજ્ઞાન અને ઇજનેરી',
    categoryDevices: 'ડિજિટલ ઉપકરણો',
    originalNumber: 'મૂળ સંખ્યા',
    exponentialForm: 'ઘાતીય સ્વરૂપ',
    breakdown: 'વિઘટન',
    base: 'આધાર',
    exponent: 'ઘાતાંક',
    result: 'પરિણામ',
    whatThisMeans: 'આનો અર્થ શું છે',
    funFact: 'રસપ્રદ તથ્ય',
    animatedCalculation: 'એનિમેટેડ ગણતરી',
    whyUseExponents: 'ઘાતાંક શા માટે ઉપયોગ કરો?',
    reason1: 'મોટી સંખ્યાઓ વાંચવા અને લખવા સરળ',
    reason2: 'વિવિધ મૂલ્યોની તુલના કરવી સરળ',
    reason3: 'ગણતરીઓને વધુ કાર્યક્ષમ બનાવે છે',
    reason4: 'વિજ્ઞાન અને ટેક્નોલોજીમાં સાર્વત્રિક'
  }
};

interface RealWorldExample {
  id: string;
  title: { [key: string]: string };
  icon: React.ReactNode;
  category: string;
  description: { [key: string]: string };
  calculation: {
    original: string;
    exponential: string;
    base: number;
    exponent: number;
    result: string;
  };
  funFact: { [key: string]: string };
  color: string;
}

const ExponentsRealWorld = () => {
  const { language } = useLanguage();
  const [selectedExample, setSelectedExample] = useState<string | null>(null);
  const [animatedNumber, setAnimatedNumber] = useState<string>('0');
  
  // Get translations based on current language
  const tr = realWorldTranslations[language];

  const examples: RealWorldExample[] = [
    // Money & Currency
    {
      id: 'money-currency',
      title: {
        en: 'Money and Currency',
        hi: 'धन और मुद्रा',
        gu: 'પૈસા અને ચલણ'
      },
      icon: <DollarSign className="w-8 h-8" />,
      category: 'money',
      description: {
        en: 'All financial transactions like ₹25.75 or $10.50 use decimals to represent whole units and parts (paise/cents).',
        hi: '₹25.75 या $10.50 जैसी सभी वित्तीय लेनदेन में रुपये/डॉलर और पैसे/सेंट दर्शाने के लिए दशमलव का उपयोग होता है।',
        gu: '₹25.75 અથવા $10.50 જેવા તમામ નાણાકીય વ્યવહારોમાં રૂપિયા/ડોલર અને પૈસા/સેન્ટ દર્શાવવા દશાંશનો ઉપયોગ થાય છે.'
      },
      calculation: {
        original: '₹25.75',
        exponential: '25 + 75/100',
        base: 10,
        exponent: 0,
        result: '25 rupees and 75 paise'
      },
      funFact: {
        en: 'Prices use decimals so we can pay exactly, without rounding to whole units.',
        hi: 'दाम दशमलव में लिखे जाते हैं ताकि सटीक भुगतान हो सके, बिना पूर्णांक तक गोल किए।',
        gu: 'ભાવ દશાંશમાં લખાય છે જેથી બરાબર ચુકવણી કરી શકાય, પૂર્ણાંક સુધી રાઉન્ડ કર્યા વગર.'
      },
      color: 'from-green-500 to-emerald-500'
    },
    // Measurements
    {
      id: 'measurements',
      title: {
        en: 'Measurements',
        hi: 'माप',
        gu: 'માપ'
      },
      icon: <Scale className="w-8 h-8" />,
      category: 'measurements',
      description: {
        en: 'Decimals give precision in length (2.5 m), weight (1.75 kg), and temperature (36.6°C).',
        hi: 'दशमलव लंबाई (2.5 मी), भार (1.75 किग्रा) और तापमान (36.6°C) में सटीकता देते हैं।',
        gu: 'દશાંશ લંબાઈ (2.5 મી), વજન (1.75 કિગ્રા) અને તાપમાન (36.6°C) માં ચોકસાઈ આપે છે.'
      },
      calculation: {
        original: '1.75 kg',
        exponential: '1 + 75/100 kg',
        base: 10,
        exponent: 0,
        result: '1 kg and 750 g'
      },
      funFact: {
        en: 'Sports, cooking, and medicine rely on precise decimal measurements.',
        hi: 'खेल, खाना पकाने और चिकित्सा में सटीक दशमलव माप आवश्यक हैं।',
        gu: 'રમત, રસોઈ અને દવાખાનામાં ચોક્કસ દશાંશ માપ પર આધાર રાખે છે.'
      },
      color: 'from-blue-500 to-cyan-500'
    },
    // Time Calculation
    {
      id: 'time-calc',
      title: {
        en: 'Time Calculation',
        hi: 'समय गणना',
        gu: 'સમય ગણતરી'
      },
      icon: <Zap className="w-8 h-8" />,
      category: 'time',
      description: {
        en: 'Decimals represent fractions of an hour, e.g., 1.5 hours = 1 hour 30 minutes.',
        hi: 'दशमलव घंटे के अंश बताते हैं — जैसे 1.5 घंटे = 1 घंटा 30 मिनट।',
        gu: 'દશાંશ કલાકના અંશો દર્શાવે છે — જેમ કે 1.5 કલાક = 1 કલાક 30 મિનિટ.'
      },
      calculation: {
        original: '1.5 hours',
        exponential: '1 + 50/100 hours',
        base: 10,
        exponent: 0,
        result: '1 hour 30 minutes'
      },
      funFact: {
        en: 'Timesheets and billing often use decimal hours for easy calculation.',
        hi: 'टाइमशीट और बिलिंग में आसान गणना के लिए दशमलव घंटे का उपयोग होता है।',
        gu: 'ટાઈમશીટ અને બિલિંગમાં સરળ ગણતરી માટે દશાંશ કલાકો વપરાય છે.'
      },
      color: 'from-yellow-500 to-orange-500'
    },
    // Science & Engineering
    {
      id: 'science-eng',
      title: {
        en: 'Science and Engineering',
        hi: 'विज्ञान और अभियांत्रिकी',
        gu: 'વિજ્ઞાન અને ઇજનેરી'
      },
      icon: <Lightbulb className="w-8 h-8" />,
      category: 'science',
      description: {
        en: 'Decimals express readings like π ≈ 3.14 and g ≈ 9.8 m/s² for practical calculations.',
        hi: 'π ≈ 3.14 और g ≈ 9.8 m/s² जैसी रीडिंग व्यावहारिक गणनाओं के लिए दशमलव में लिखी जाती हैं।',
        gu: 'π ≈ 3.14 અને g ≈ 9.8 m/s² જેવી રીડિંગ પ્રાયોગિક ગણતરી માટે દશાંશમાં લખાય છે.'
      },
      calculation: {
        original: 'π ≈ 3.14',
        exponential: '3 + 14/100',
        base: 10,
        exponent: 0,
        result: 'approximation to two decimal places'
      },
      funFact: {
        en: 'Engineers round to decimals depending on required accuracy.',
        hi: 'इंजीनियर आवश्यक शुद्धता के अनुसार दशमलव तक राउंड करते हैं।',
        gu: 'ઇજનેરો જરૂરી ચોકસાઈ મુજબ દશાંશ સુધી રાઉન્ડ કરે છે.'
      },
      color: 'from-purple-500 to-pink-500'
    },
    // Digital Devices
    {
      id: 'digital-devices',
      title: {
        en: 'Digital Devices',
        hi: 'डिजिटल उपकरण',
        gu: 'ડિજિટલ ઉપકરણો'
      },
      icon: <Smartphone className="w-8 h-8" />,
      category: 'devices',
      description: {
        en: 'Calculators, computers and instruments display user-facing values in decimals for clarity.',
        hi: 'कैलकुलेटर, कंप्यूटर और उपकरण स्पष्टता के लिए दशमलव में मान दिखाते हैं।',
        gu: 'કેલ્ક્યુલેટર, કમ્પ્યુટર અને સાધનો સ્પષ્ટતા માટે દશાંશમાં મૂલ્યો દર્શાવે છે.'
      },
      calculation: {
        original: 'Temperature: 36.6°C',
        exponential: '36 + 6/10 °C',
        base: 10,
        exponent: 0,
        result: 'one decimal precision'
      },
      funFact: {
        en: 'Most sensors output decimals that software further processes and formats.',
        hi: 'अधिकांश सेंसर दशमलव में आउटपुट देते हैं, जिन्हें सॉफ़्टवेयर प्रोसेस और फॉर्मैट करता है।',
        gu: 'ઘણા સેન્સર દશાંશમાં આઉટપુટ આપે છે, જેને સોફ્ટવેર વધુ પ્રક્રિયા અને ફોર્મેટ કરે છે.'
      },
      color: 'from-cyan-500 to-teal-500'
    },
    // Decimal Number System
    {
      id: 'decimal-system',
      title: {
        en: 'Decimal Number System',
        hi: 'दशमलव संख्या प्रणाली',
        gu: 'દશાંશ સંખ્યા પ્રણાલી'
      },
      icon: <Calculator className="w-8 h-8" />,
      category: 'science',
      description: {
        en: 'The decimal system uses base 10, where each place represents a power of 10. For example, 234.56 = 2×10² + 3×10¹ + 4×10⁰ + 5×10⁻¹ + 6×10⁻²',
        hi: 'दशमलव प्रणाली आधार 10 का उपयोग करती है, जहाँ प्रत्येक स्थान 10 की घात का प्रतिनिधित्व करता है। उदाहरण: 234.56 = 2×10² + 3×10¹ + 4×10⁰ + 5×10⁻¹ + 6×10⁻²',
        gu: 'દશાંશ પ્રણાલી આધાર 10 નો ઉપયોગ કરે છે, જ્યાં દરેક સ્થાન 10 ની ઘાતનું પ્રતિનિધિત્વ કરે છે. ઉદાહરણ: 234.56 = 2×10² + 3×10¹ + 4×10⁰ + 5×10⁻¹ + 6×10⁻²'
      },
      calculation: {
        original: '234.56',
        exponential: '2×10² + 3×10¹ + 4×10⁰ + 5×10⁻¹ + 6×10⁻²',
        base: 10,
        exponent: 2,
        result: '200 + 30 + 4 + 0.5 + 0.06 = 234.56'
      },
      funFact: {
        en: 'The decimal system has been used for over 1000 years and is based on counting with 10 fingers!',
        hi: 'दशमलव प्रणाली 1000 वर्षों से अधिक समय से उपयोग की जा रही है और यह 10 उंगलियों से गिनने पर आधारित है!',
        gu: 'દશાંશ પ્રણાલી 1000 વર્ષથી વધુ સમયથી વપરાય છે અને તે 10 આંગળીઓથી ગણતરી પર આધારિત છે!'
      },
      color: 'from-indigo-500 to-violet-500'
    }
  ];

  const selected = examples.find(ex => ex.id === selectedExample);

  useEffect(() => {
    if (selected) {
      const { base, exponent } = selected.calculation;
      
      // Calculate the final result
      const calculateResult = () => {
        try {
          // Check if base is a decimal (like 1.08 or 1.05)
          if (base % 1 !== 0) {
            // For decimal bases, calculate and display
            const result = Math.pow(base, exponent);
            return isFinite(result) ? result.toFixed(2).replace(/\.?0+$/, '') : `${base.toFixed(2)}^${exponent}`;
          }
          
          // For integer bases with powers of 10
          if (base === 10) {
            // For 10^n, just return the result as string
            return '1' + '0'.repeat(exponent);
          }
          
          // For base 2
          if (base === 2) {
            if (exponent <= 52) { // Safe for BigInt calculations
              const result = Math.pow(2, exponent);
              return Math.floor(result).toString();
            } else {
              return `2^${exponent}`;
            }
          }
          
          // For other bases
          const result = Math.pow(base, exponent);
          if (result > Number.MAX_SAFE_INTEGER || exponent > 52) {
            return `${base}^${exponent}`;
          }
          
          return Math.floor(result).toString();
        } catch (e) {
          return `${base}^${exponent}`;
        }
      };

      const targetValue = calculateResult();
      
      // Set the target value immediately without animation for precision
      setAnimatedNumber(targetValue);
    }
  }, [selected]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse-slow"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-lg px-6 py-3 rounded-full mb-4 border border-white/20 animate-fade-in">
            <Globe className="w-6 h-6 text-blue-400 animate-spin-slow" />
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200">
              {tr.heroTitle}
            </h1>
            <Lightbulb className="w-6 h-6 text-pink-400 animate-bounce-slow" />
          </div>
          <p className="text-lg text-purple-200 max-w-3xl mx-auto leading-relaxed">
            {tr.heroDescription}
          </p>
        </div>
      </div>

      {/* Summary removed as per requirements */}

      {/* Examples Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {examples.map((example, idx) => (
            <div
              key={example.id}
              onClick={() => setSelectedExample(example.id)}
              className={`cursor-pointer transform transition-all duration-300 hover:scale-105 animate-fade-in ${
                selectedExample === example.id ? 'scale-105' : ''
              }`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className={`bg-gradient-to-br ${example.color} p-1 rounded-2xl shadow-2xl hover:shadow-3xl`}>
                <div className="bg-slate-900/90 backdrop-blur-lg rounded-2xl p-6 h-full border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 bg-gradient-to-br ${example.color} rounded-xl`}>
                      {example.icon}
                    </div>
                    <h3 className="text-xl font-bold">{example.title[language]}</h3>
                  </div>
                  <p className="text-purple-200 mb-4 text-sm leading-relaxed">{example.description[language]}</p>
                  <div className="bg-white/5 rounded-lg p-3 font-mono text-center">
                    <div className="text-2xl font-bold text-yellow-300">
                      {example.calculation.exponential}
                    </div>
                  </div>
                  {selectedExample === example.id && (
                    <div className="mt-3 text-center text-sm text-cyan-300 font-semibold animate-pulse">
                      Click to see details →
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed View */}
        {selected && (
          <div className="animate-slide-up">
            <div className={`bg-gradient-to-br ${selected.color} p-1 rounded-3xl shadow-2xl`}>
              <div className="bg-slate-900/95 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 bg-gradient-to-br ${selected.color} rounded-xl`}>
                      {selected.icon}
                    </div>
                    <h2 className="text-3xl font-bold">{selected.title[language]}</h2>
                  </div>
                  <button
                    onClick={() => setSelectedExample(null)}
                    className="text-white/60 hover:text-white text-2xl font-bold transition-all"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left: Calculation */}
                  <div className="space-y-6">
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <h3 className="text-xl font-bold mb-4 text-cyan-300">📝 {tr.originalNumber}</h3>
                      <div className="bg-gradient-to-r from-red-600/30 to-orange-600/30 rounded-xl p-4 font-mono text-lg break-all">
                        {selected.calculation.original}
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <h3 className="text-xl font-bold mb-4 text-green-300">✨ {tr.exponentialForm}</h3>
                      <div className="bg-gradient-to-r from-green-600/30 to-emerald-600/30 rounded-xl p-4 font-mono text-2xl text-center font-bold">
                        {selected.calculation.exponential}
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <h3 className="text-xl font-bold mb-4 text-purple-300">🔢 {tr.breakdown}</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between bg-blue-600/20 rounded-lg p-3">
                          <span className="font-semibold">{tr.base}:</span>
                          <span className="text-2xl font-bold text-blue-300">{selected.calculation.base}</span>
                        </div>
                        <div className="flex items-center justify-between bg-purple-600/20 rounded-lg p-3">
                          <span className="font-semibold">{tr.exponent}:</span>
                          <span className="text-2xl font-bold text-purple-300">{selected.calculation.exponent}</span>
                        </div>
                        <div className="flex items-center justify-between bg-pink-600/20 rounded-lg p-3">
                          <span className="font-semibold">{tr.result}:</span>
                          <span className="text-xl font-bold text-pink-300">{selected.calculation.result}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Visualization */}
                  <div className="space-y-6">
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <h3 className="text-xl font-bold mb-4 text-yellow-300">🎯 {tr.whatThisMeans}</h3>
                      <p className="text-lg leading-relaxed text-purple-200">{selected.description[language]}</p>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 rounded-2xl p-6 border border-yellow-400/30">
                      <h3 className="text-xl font-bold mb-4 text-yellow-300">💡 {tr.funFact}</h3>
                      <p className="text-lg leading-relaxed">{selected.funFact[language]}</p>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <h3 className="text-xl font-bold mb-4 text-cyan-300">🧮 {tr.animatedCalculation}</h3>
                      <div className="bg-gradient-to-r from-cyan-600/30 to-blue-600/30 rounded-xl p-6 text-center overflow-hidden">
                        <div className="text-sm text-cyan-200 mb-2">
                          {selected.calculation.base}<sup>{selected.calculation.exponent}</sup> =
                        </div>
                        <div className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono text-yellow-300 animate-pulse break-all overflow-wrap-anywhere px-2 whitespace-normal">
                          {animatedNumber}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-2xl p-6 border border-indigo-400/30">
                      <h3 className="text-xl font-bold mb-4 text-indigo-300">📚 {tr.whyUseExponents}</h3>
                      <ul className="space-y-2 text-purple-200">
                        <li className="flex items-start gap-2">
                          <span className="text-green-400">✓</span>
                          <span>{tr.reason1}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-400">✓</span>
                          <span>{tr.reason2}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-400">✓</span>
                          <span>{tr.reason3}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-400">✓</span>
                          <span>{tr.reason4}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.5s ease-out; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default ExponentsRealWorld;
