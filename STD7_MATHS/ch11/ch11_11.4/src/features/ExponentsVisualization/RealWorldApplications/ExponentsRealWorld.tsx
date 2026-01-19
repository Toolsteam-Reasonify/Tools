import { useState, useEffect } from 'react';
import { Globe, Rocket, Dna, DollarSign, Sun, Lightbulb, Cpu, FlaskConical } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

// Hardcoded translations for Real World page
const realWorldTranslations = {
  en: {
    heroTitle: 'Standard Form in the Real World',
    heroDescription: 'Discover how standard form (scientific notation) helps us understand massive and tiny numbers in astronomy, biology, chemistry, physics, economics, and computer science!',
    categoryAstronomy: 'Astronomy',
    categoryBiology: 'Biology',
    categoryChemistry: 'Chemistry',
    categoryPhysics: 'Physics',
    categoryEconomics: 'Economics & Finance',
    categoryComputer: 'Computer Science',
    originalNumber: 'Original Number',
    exponentialForm: 'Standard Form',
    breakdown: 'Breakdown',
    base: 'Base',
    exponent: 'Exponent',
    result: 'Result',
    whatThisMeans: 'What This Means',
    funFact: 'Fun Fact',
    animatedCalculation: 'Animated Calculation',
    whyUseStandardForm: 'Why Use Standard Form?',
    reason1: 'Easier to read and write large numbers',
    reason2: 'Simpler to compare different values',
    reason3: 'Makes calculations more efficient',
    reason4: 'Universal in science and technology'
  },
  hi: {
    heroTitle: 'वास्तविक दुनिया में मानक रूप',
    heroDescription: 'खोजें कि मानक रूप (वैज्ञानिक संकेतन) खगोल विज्ञान, जीव विज्ञान, रसायन विज्ञान, भौतिकी, अर्थशास्त्र और कंप्यूटर विज्ञान में बड़ी और छोटी संख्याओं को समझने में कैसे मदद करता है!',
    categoryAstronomy: 'खगोल विज्ञान',
    categoryBiology: 'जीव विज्ञान',
    categoryChemistry: 'रसायन विज्ञान',
    categoryPhysics: 'भौतिकी',
    categoryEconomics: 'अर्थशास्त्र और वित्त',
    categoryComputer: 'कंप्यूटर विज्ञान',
    originalNumber: 'मूल संख्या',
    exponentialForm: 'मानक रूप',
    breakdown: 'विभाजन',
    base: 'आधार',
    exponent: 'घातांक',
    result: 'परिणाम',
    whatThisMeans: 'इसका क्या मतलब है',
    funFact: 'मजेदार तथ्य',
    animatedCalculation: 'एनिमेटेड गणना',
    whyUseStandardForm: 'मानक रूप क्यों उपयोग करें?',
    reason1: 'बड़ी संख्याओं को पढ़ने और लिखने में आसान',
    reason2: 'विभिन्न मूल्यों की तुलना करना आसान',
    reason3: 'गणना को अधिक कुशल बनाता है',
    reason4: 'विज्ञान और प्रौद्योगिकी में सार्वभौमिक'
  },
  gu: {
    heroTitle: 'વાસ્તવિક વિશ્વમાં ધોરીત રૂપ',
    heroDescription: 'અન્વેષણ કરો કે ધોરીત રૂપ (વૈજ્ઞાનિક સંકેત) ખગોળ વિજ્ઞાન, બાયોલોજી, રસાયણ વિજ્ઞાન, ભૌતિક વિજ્ઞાન, અર્થશાસ્ત્ર અને કમ્પ્યુટર વિજ્ઞાનમાં મોટી અને નાની સંખ્યાઓ સમજવામાં કેવી રીતે મદદ કરે છે!',
    categoryAstronomy: 'ખગોળ વિજ્ઞાન',
    categoryBiology: 'બાયોલોજી',
    categoryChemistry: 'રસાયણ વિજ્ઞાન',
    categoryPhysics: 'ભૌતિક વિજ્ઞાન',
    categoryEconomics: 'અર્થશાસ્ત્ર અને ફાઇનાન્સ',
    categoryComputer: 'કમ્પ્યુટર વિજ્ઞાન',
    originalNumber: 'મૂળ સંખ્યા',
    exponentialForm: 'ધોરીત રૂપ',
    breakdown: 'વિઘટન',
    base: 'આધાર',
    exponent: 'ઘાતાંક',
    result: 'પરિણામ',
    whatThisMeans: 'આનો અર્થ શું છે',
    funFact: 'રસપ્રદ તથ્ય',
    animatedCalculation: 'એનિમેટેડ ગણતરી',
    whyUseStandardForm: 'ધોરીત રૂપ શા માટે ઉપયોગ કરો?',
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
    // Astronomy
    {
      id: 'earth-sun-distance',
      title: {
        en: 'Distance from Earth to Sun',
        hi: 'पृथ्वी से सूर्य की दूरी',
        gu: 'પૃથ્વીથી સૂર્યની દૂરી'
      },
      icon: <Sun className="w-8 h-8" />,
      category: 'astronomy',
      description: {
        en: 'The distance from Earth to the Sun is approximately 1.5 × 10⁸ km (150,000,000 km). Standard form makes this massive distance easy to work with in calculations and comparisons with other planetary distances.',
        hi: 'पृथ्वी से सूर्य की दूरी लगभग 1.5 × 10⁸ km (150,000,000 km) है। मानक रूप इस विशाल दूरी को गणना में और अन्य ग्रहों की दूरियों के साथ तुलना करने में आसान बनाता है।',
        gu: 'પૃથ્વીથી સૂર્યની દૂરી લગભગ 1.5 × 10⁸ km (150,000,000 km) છે. ધોરીત રૂપ આ વિશાળ અંતરને ગણતરીઓમાં અને અન્ય ગ્રહોની અંતરો સાથે તુલના કરવામાં સરળ બનાવે છે.'
      },
      calculation: {
        original: '150,000,000 km',
        exponential: '1.5 × 10⁸ km',
        base: 10,
        exponent: 8,
        result: '150 million kilometers'
      },
      funFact: {
        en: 'Light from the Sun takes about 8 minutes and 20 seconds to reach Earth!',
        hi: 'सूर्य से प्रकाश को पृथ्वी तक पहुंचने में लगभग 8 मिनट 20 सेकंड लगते हैं!',
        gu: 'સૂર્યનો પ્રકાશ પૃથ્વી સુધી પહોંચવામાં લગભગ 8 મિનિટ અને 20 સેકન્ડ લાગે છે!'
      },
      color: 'from-yellow-500 to-orange-500'
    },
    // Biology
    {
      id: 'bacteria-size',
      title: {
        en: 'Bacteria Size',
        hi: 'जीवाणु का आकार',
        gu: 'જીવાણુનું કદ'
      },
      icon: <Dna className="w-8 h-8" />,
      category: 'biology',
      description: {
        en: 'The size of bacteria is approximately 2 × 10⁻⁶ m (0.000002 m). Standard form helps us express these incredibly tiny measurements that are difficult to work with in decimal form.',
        hi: 'जीवाणु का आकार लगभग 2 × 10⁻⁶ m (0.000002 m) है। मानक रूप हमें इन अविश्वसनीय रूप से छोटे मापों को व्यक्त करने में मदद करता है जिन्हें दशमलव रूप में काम करना मुश्किल है।',
        gu: 'જીવાણુનું કદ લગભગ 2 × 10⁻⁶ m (0.000002 m) છે. ધોરીત રૂપ આ અવિશ્વસનીય રીતે નાના માપોને વ્યક્ત કરવામાં મદદ કરે છે જે દશાંશ સ્વરૂપમાં કામ કરવા મુશ્કેલ છે.'
      },
      calculation: {
        original: '0.000002 m',
        exponential: '2 × 10⁻⁶ m',
        base: 10,
        exponent: -6,
        result: '2 micrometers'
      },
      funFact: {
        en: 'A single gram of soil can contain up to 40 million bacterial cells!',
        hi: 'मिट्टी के एक ग्राम में 40 मिलियन तक जीवाणु कोशिकाएं हो सकती हैं!',
        gu: 'માટીના એક ગ્રામમાં 40 મિલિયન સુધી જીવાણુ કોષો હોઈ શકે છે!'
      },
      color: 'from-green-500 to-emerald-500'
    },
    // Chemistry
    {
      id: 'avogadro-number',
      title: {
        en: "Avogadro's Number",
        hi: 'अवोगाद्रो संख्या',
        gu: 'અવોગાડ્રોની સંખ્યા'
      },
      icon: <FlaskConical className="w-8 h-8" />,
      category: 'chemistry',
      description: {
        en: 'Avogadro\'s number is 6.022 × 10²³, representing the number of atoms or molecules in one mole of a substance. This constant is fundamental in chemistry for calculations involving moles.',
        hi: 'अवोगाद्रो संख्या 6.022 × 10²³ है, जो किसी पदार्थ के एक मोल में परमाणुओं या अणुओं की संख्या का प्रतिनिधित्व करती है। यह स्थिरांक मोल से संबंधित गणनाओं में रसायन विज्ञान में मौलिक है।',
        gu: 'અવોગાડ્રોની સંખ્યા 6.022 × 10²³ છે, જે પદાર્થના એક મોલમાં પરમાણુ અથવા અણુઓની સંખ્યાનું પ્રતિનિધિત્વ કરે છે. આ સતત રસાયણ વિજ્ઞાનમાં મોલ સંબંધિત ગણતરીઓમાં મૂળભૂત છે.'
      },
      calculation: {
        original: '602,200,000,000,000,000,000,000',
        exponential: '6.022 × 10²³',
        base: 10,
        exponent: 23,
        result: '602.2 sextillion'
      },
      funFact: {
        en: 'If you had 6.022 × 10²³ water molecules, you would have about 18 milliliters of water - just one tablespoon!',
        hi: 'यदि आपके पास 6.022 × 10²³ पानी के अणु होते, तो आपके पास लगभग 18 मिलीलीटर पानी होता - सिर्फ एक चम्मच!',
        gu: 'જો તમારી પાસે 6.022 × 10²³ પાણીના અણુ હોત, તો તમારી પાસે લગભગ 18 મિલીલીટર પાણી હોત - ફક્ત એક ચમચી!'
      },
      color: 'from-cyan-500 to-blue-500'
    },
    // Physics
    {
      id: 'speed-of-light',
      title: {
        en: 'Speed of Light',
        hi: 'प्रकाश की गति',
        gu: 'પ્રકાશની ગતિ'
      },
      icon: <Lightbulb className="w-8 h-8" />,
      category: 'physics',
      description: {
        en: 'The speed of light in vacuum is approximately 3 × 10⁸ m/s (300,000,000 m/s). This constant is one of the most fundamental values in physics, appearing in Einstein\'s famous equation E = mc².',
        hi: 'निर्वात में प्रकाश की गति लगभग 3 × 10⁸ m/s (300,000,000 m/s) है। यह स्थिरांक भौतिकी में सबसे मौलिक मूल्यों में से एक है, जो आइंस्टीन के प्रसिद्ध समीकरण E = mc² में दिखाई देता है।',
        gu: 'શૂન્યતામાં પ્રકાશની ઝડપ લગભગ 3 × 10⁸ m/s (300,000,000 m/s) છે. આ સતત ભૌતિક વિજ્ઞાનમાં સૌથી મૂળભૂત મૂલ્યોમાંથી એક છે, જે આઇન્સ્ટાઇનના પ્રસિદ્ધ સમીકરણ E = mc² માં દેખાય છે.'
      },
      calculation: {
        original: '300,000,000 m/s',
        exponential: '3 × 10⁸ m/s',
        base: 10,
        exponent: 8,
        result: '300 million meters per second'
      },
      funFact: {
        en: 'At the speed of light, you could travel around Earth 7.5 times in just one second!',
        hi: 'प्रकाश की गति पर, आप केवल एक सेकंड में पृथ्वी के चारों ओर 7.5 बार यात्रा कर सकते हैं!',
        gu: 'પ્રકાશની ઝડપે, તમે ફક્ત એક સેકન્ડમાં પૃથ્વીની આસપાસ 7.5 વખત મુસાફરી કરી શકો છો!'
      },
      color: 'from-purple-500 to-pink-500'
    },
    // Economics & Finance
    {
      id: 'national-debt-gdp',
      title: {
        en: 'National Debt or GDP',
        hi: 'राष्ट्रीय ऋण या जीडीपी',
        gu: 'રાષ્ટ્રીય દેવું અથવા GDP'
      },
      icon: <DollarSign className="w-8 h-8" />,
      category: 'economics',
      description: {
        en: 'Large economic figures like national debts or GDPs are often expressed in standard form. For example, 2.4 × 10¹² dollars represents $2,400,000,000,000 - a much more readable format!',
        hi: 'राष्ट्रीय ऋण या जीडीपी जैसी बड़ी आर्थिक आंकड़े अक्सर मानक रूप में व्यक्त की जाती हैं। उदाहरण के लिए, 2.4 × 10¹² डॉलर $2,400,000,000,000 का प्रतिनिधित्व करता है - एक बहुत अधिक पठनीय प्रारूप!',
        gu: 'રાષ્ટ્રીય દેવું અથવા GDP જેવા મોટા આર્થિક આંકડાઓ ઘણી વાર ધોરીત રૂપમાં વ્યક્ત કરવામાં આવે છે. ઉદાહરણ તરીકે, 2.4 × 10¹² ડોલર $2,400,000,000,000 નું પ્રતિનિધિત્વ કરે છે - એક વધુ વાંચી શકાય તેવું ફોર્મેટ!'
      },
      calculation: {
        original: '$2,400,000,000,000',
        exponential: '2.4 × 10¹² dollars',
        base: 10,
        exponent: 12,
        result: '2.4 trillion dollars'
      },
      funFact: {
        en: 'If you stacked $2.4 trillion in $100 bills, the stack would be over 2,600 kilometers tall - that\'s taller than Mount Everest!',
        hi: 'यदि आप $100 के बिलों में $2.4 ट्रिलियन को ढेर करें, तो ढेर 2,600 किलोमीटर से अधिक लंबा होगा - यह माउंट एवरेस्ट से भी ऊंचा है!',
        gu: 'જો તમે $100 ની બિલોમાં $2.4 ટ્રિલિયનને ઢગલો કરો, તો ઢગલો 2,600 કિલોમીટરથી વધુ ઊંચો હશે - તે માઉન્ટ એવરેસ્ટથી પણ ઊંચું છે!'
      },
      color: 'from-green-500 to-teal-500'
    },
    // Computer Science
    {
      id: 'processing-speed',
      title: {
        en: 'Computer Processing Speed',
        hi: 'कंप्यूटर प्रसंस्करण गति',
        gu: 'કમ્પ્યુટર પ્રોસેસિંગ ઝડપ'
      },
      icon: <Cpu className="w-8 h-8" />,
      category: 'computer',
      description: {
        en: 'Modern computers can perform operations at speeds like 3 × 10⁹ operations per second (3,000,000,000 ops/s). Standard form makes it easy to compare and understand these incredible speeds.',
        hi: 'आधुनिक कंप्यूटर 3 × 10⁹ संचालन प्रति सेकंड (3,000,000,000 ops/s) जैसी गति से संचालन कर सकते हैं। मानक रूप इन अविश्वसनीय गति की तुलना और समझना आसान बनाता है।',
        gu: 'આધુનિક કમ્પ્યુટર 3 × 10⁹ ઓપરેશન પ્રતિ સેકન્ડ (3,000,000,000 ops/s) જેવી ઝડપે કામગીરી કરી શકે છે. ધોરીત રૂપ આ અવિશ્વસનીય ઝડપોની તુલના અને સમજવા માટે સરળ બનાવે છે.'
      },
      calculation: {
        original: '3,000,000,000 operations/second',
        exponential: '3 × 10⁹ ops/s',
        base: 10,
        exponent: 9,
        result: '3 billion operations per second'
      },
      funFact: {
        en: 'A modern CPU can perform more calculations in one second than a human could do in their entire lifetime!',
        hi: 'एक आधुनिक CPU एक सेकंड में उतने अधिक गणना कर सकता है जितना एक मनुष्य अपने पूरे जीवन में कर सकता है!',
        gu: 'એક આધુનિક CPU એક સેકન્ડમાં એટલી ગણતરીઓ કરી શકે છે જેટલી એક મનુષ્ય પોતાના આખા જીવનકાળમાં કરી શકે છે!'
      },
      color: 'from-indigo-500 to-purple-500'
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
            // Handle negative exponents
            if (exponent < 0) {
              const absExp = Math.abs(exponent);
              return '0.' + '0'.repeat(absExp - 1) + '1';
            }
            // For positive 10^n, return the result as string
            return '1' + '0'.repeat(exponent);
          }
          
          // For base 2
          if (base === 2) {
            if (exponent <= 52 && exponent >= -52) { // Safe for calculations
              const result = Math.pow(2, exponent);
              if (exponent < 0) {
                return result.toString();
              }
              return Math.floor(result).toString();
            } else {
              return `2^${exponent}`;
            }
          }
          
          // For other bases
          const result = Math.pow(base, exponent);
          if (exponent < 0) {
            return result.toString();
          }
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
            <Rocket className="w-6 h-6 text-pink-400 animate-bounce-slow" />
          </div>
          <p className="text-lg text-purple-200 max-w-3xl mx-auto leading-relaxed">
            {tr.heroDescription}
          </p>
        </div>
      </div>

      {/* Examples Grid - All Applications */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {examples.map((example, idx) => (
            <div
              key={example.id}
              onClick={() => setSelectedExample(example.id)}
              className={`cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                selectedExample === example.id ? 'scale-105' : ''
              }`}
              style={{
                animation: `fadeInUp 0.6s ease-out forwards`,
                animationDelay: `${idx * 0.15}s`,
                opacity: 0
              }}
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
                      {language === 'en' ? 'Click to see details →' : language === 'hi' ? 'विवरण देखने के लिए क्लिक करें →' : 'વિગતો જોવા માટે ક્લિક કરો →'}
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
                      <h3 className="text-xl font-bold mb-4 text-cyan-300">{tr.originalNumber}</h3>
                      <div className="bg-gradient-to-r from-red-600/30 to-orange-600/30 rounded-xl p-4 font-mono text-lg break-all">
                        {selected.calculation.original}
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <h3 className="text-xl font-bold mb-4 text-green-300">{tr.exponentialForm}</h3>
                      <div className="bg-gradient-to-r from-green-600/30 to-emerald-600/30 rounded-xl p-4 font-mono text-2xl text-center font-bold">
                        {selected.calculation.exponential}
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <h3 className="text-xl font-bold mb-4 text-purple-300">{tr.breakdown}</h3>
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
                      <h3 className="text-xl font-bold mb-4 text-yellow-300">{tr.whatThisMeans}</h3>
                      <p className="text-lg leading-relaxed text-purple-200">{selected.description[language]}</p>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 rounded-2xl p-6 border border-yellow-400/30">
                      <h3 className="text-xl font-bold mb-4 text-yellow-300">{tr.funFact}</h3>
                      <p className="text-lg leading-relaxed">{selected.funFact[language]}</p>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <h3 className="text-xl font-bold mb-4 text-cyan-300">{tr.animatedCalculation}</h3>
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
                      <h3 className="text-xl font-bold mb-4 text-indigo-300">{tr.whyUseStandardForm}</h3>
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
        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(30px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
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
        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-up { animation: slide-up 0.5s ease-out; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default ExponentsRealWorld;
