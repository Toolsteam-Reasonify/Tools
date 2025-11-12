import { useState, useEffect } from 'react';
import { Globe, Rocket, Dna, DollarSign, Smartphone, Zap, TrendingUp, Database, Atom, Sun, Lightbulb, Scale, Cpu } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

// Hardcoded translations for Real World page
const realWorldTranslations = {
  en: {
    heroTitle: 'Exponents in the Real World',
    heroDescription: 'Discover how exponential notation helps us understand massive numbers in space, biology, technology, and finance!',
    categorySpace: 'Space & Astronomy',
    categoryBiology: 'Biology & Medicine',
    categoryTechnology: 'Technology',
    categoryFinance: 'Finance & Growth',
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
    heroTitle: 'वास्तविक दुनिया में घातांक',
    heroDescription: 'खोजें कि घातीय संकेतन हमें अंतरिक्ष, जीव विज्ञान, प्रौद्योगिकी और वित्त में बड़ी संख्याओं को समझने में कैसे मदद करता है!',
    categorySpace: 'अंतरिक्ष और खगोल विज्ञान',
    categoryBiology: 'जीव विज्ञान और चिकित्सा',
    categoryTechnology: 'प्रौद्योगिकी',
    categoryFinance: 'वित्त और विकास',
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
    heroTitle: 'વાસ્તવિક વિશ્વમાં ઘાતાંક',
    heroDescription: 'અન્વેષણ કરો કે ઘાતીય સંકેત સ્પેસ, બાયોલોજી, ટેક્નોલોજી અને ફાઇનાન્સમાં મોટી સંખ્યાઓ સમજવામાં કેવી રીતે મદદ કરે છે!',
    categorySpace: 'અવકાશ અને ખગોળ',
    categoryBiology: 'બાયોલોજી અને તબીબી',
    categoryTechnology: 'ટેક્નોલોજી',
    categoryFinance: 'ફાઇનાન્સ અને વૃદ્ધિ',
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
  const [activeTab, setActiveTab] = useState<string>('space');
  
  // Get translations based on current language
  const tr = realWorldTranslations[language];

  const examples: RealWorldExample[] = [
    {
      id: 'earth-mass',
      title: {
        en: 'Mass of Earth',
        hi: 'पृथ्वी का द्रव्यमान',
        gu: 'પૃથ્વીનો દળ'
      },
      icon: <Globe className="w-8 h-8" />,
      category: 'space',
      description: {
        en: 'The Earth weighs approximately 5.97 × 10²⁴ kilograms. Without exponents, this number would have 24 digits!',
        hi: 'पृथ्वी का वजन लगभग 5.97 × 10²⁴ किलोग्राम है। घातांक के बिना, इस संख्या के 24 अंक होंगे!',
        gu: 'પૃથ્વીનું વજન લગભગ 5.97 × 10²⁴ કિલોગ્રામ છે. ઘાતાંક વિના, આ સંખ્યાને 24 અંકો હશે!'
      },
      calculation: {
        original: '5,970,000,000,000,000,000,000,000 kg',
        exponential: '5.97 × 10²⁴ kg',
        base: 10,
        exponent: 24,
        result: '5.97 followed by 24 zeros'
      },
      funFact: {
        en: 'Earth gains about 40,000 tons of space dust every year!',
        hi: 'पृथ्वी हर साल लगभग 40,000 टन अंतरिक्ष धूल प्राप्त करती है!',
        gu: 'પૃથ્વી દર વર્ષે લગભગ 40,000 ટન અવકાશ ધૂળ મેળવે છે!'
      },
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'sun-distance',
      title: {
        en: 'Distance to Sun',
        hi: 'सूर्य की दूरी',
        gu: 'સૂર્યની દૂરી'
      },
      icon: <Sun className="w-8 h-8" />,
      category: 'space',
      description: {
        en: 'The Sun is about 1.496 × 10¹¹ meters away from Earth. Light from the Sun takes 8 minutes to reach us!',
        hi: 'सूर्य पृथ्वी से लगभग 1.496 × 10¹¹ मीटर दूर है। सूर्य से आने वाली प्रकाश को हम तक पहुंचने में 8 मिनट लगते हैं!',
        gu: 'સૂર્ય પૃથ્વીથી લગભગ 1.496 × 10¹¹ મીટર દૂર છે. સૂર્યનો પ્રકાશ અમને સુધી પહોંચવામાં 8 મિનિટ લે છે!'
      },
      calculation: {
        original: '149,600,000,000 meters',
        exponential: '1.496 × 10¹¹ meters',
        base: 10,
        exponent: 11,
        result: '149.6 million kilometers'
      },
      funFact: {
        en: 'If you could drive to the Sun at 100 km/h, it would take 170 years!',
        hi: 'यदि आप 100 किमी/घंटा की गति से सूर्य तक गाड़ी चला सकते हैं, तो 170 वर्ष लगेंगे!',
        gu: 'જો તમે 100 કિમી/કલાકની ઝડપથી સૂર્ય સુધી ગાડી ચલાવી શકો છો, તો 170 વર્ષ લાગશે!'
      },
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'speed-of-light',
      title: {
        en: 'Speed of Light',
        hi: 'प्रकाश की गति',
        gu: 'પ્રકાશની ગતિ'
      },
      icon: <Lightbulb className="w-8 h-8" />,
      category: 'space',
      description: {
        en: 'Light travels at approximately 3 × 10⁸ meters per second. This incredible speed allows light to travel vast distances in space!',
        hi: 'प्रकाश लगभग 3 × 10⁸ मीटर प्रति सेकंड की गति से यात्रा करता है। यह अविश्वसनीय गति प्रकाश को अंतरिक्ष में विशाल दूरी तय करने की अनुमति देती है!',
        gu: 'પ્રકાશ લગભગ 3 × 10⁸ મીટર પ્રતિ સેકન્ડની ઝડપે પ્રવાસ કરે છે. આ અવિશ્વસનીય ઝડપ પ્રકાશને અવકાશમાં વિશાળ અંતર કાપવાની મંજૂરી આપે છે!'
      },
      calculation: {
        original: '300,000,000 meters/second',
        exponential: '3 × 10⁸ m/s',
        base: 10,
        exponent: 8,
        result: '300 million meters per second'
      },
      funFact: {
        en: 'It takes light only about 1.28 seconds to travel from the Moon to Earth!',
        hi: 'चंद्रमा से पृथ्वी तक प्रकाश को यात्रा करने में केवल 1.28 सेकंड लगते हैं!',
        gu: 'ચંદ્રથી પૃથ્વી સુધી પ્રકાશને મુસાફરી કરવામાં માત્ર 1.28 સેકન્ડ લાગે છે!'
      },
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'bacteria',
      title: {
        en: 'Bacterial Growth',
        hi: 'जीवाणु वृद्धि',
        gu: 'બેક્ટેરિયલ વૃદ્ધિ'
      },
      icon: <Dna className="w-8 h-8" />,
      category: 'biology',
      description: {
        en: 'A single bacterium can divide every 20 minutes. After 10 hours, one bacterium becomes 2³⁰ bacteria!',
        hi: 'एक जीवाणु हर 20 मिनट में विभाजित हो सकता है। 10 घंटे बाद, एक जीवाणु 2³⁰ जीवाणु बन जाता है!',
        gu: 'એક જીવાણુ દર 20 મિનિટમાં વિભાજિત થઈ શકે છે. 10 કલાક પછી, એક જીવાણુ 2³⁰ જીવાણુ બની જાય છે!'
      },
      calculation: {
        original: '1,073,741,824 bacteria',
        exponential: '2³⁰ bacteria',
        base: 2,
        exponent: 30,
        result: 'Over 1 billion bacteria'
      },
      funFact: {
        en: 'Your body has more bacterial cells than human cells!',
        hi: 'आपके शरीर में मानव कोशिकाओं से अधिक जीवाणु कोशिकाएं हैं!',
        gu: 'તમારા શરીરમાં માનવ કોષો કરતાં વધુ બેક્ટેરિયલ કોષો છે!'
      },
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'compound-interest',
      title: {
        en: 'Compound Interest',
        hi: 'चक्रवृद्धि ब्याज',
        gu: 'ચક્રવૃદ્ધિ વ્યાજ'
      },
      icon: <DollarSign className="w-8 h-8" />,
      category: 'finance',
      description: {
        en: 'If you invest ₹10,000 at 8% annual interest, after 10 years you will have: 10000 × (1.08)¹⁰',
        hi: 'यदि आप ₹10,000 को 8% वार्षिक ब्याज पर निवेश करते हैं, तो 10 वर्षों के बाद आपके पास होगा: 10000 × (1.08)¹⁰',
        gu: 'જો તમે ₹10,000 નો 8% વાર્ષિક વ્યાજ પર રોકાણ કરો છો, તો 10 વર્ષ પછી તમારી પાસે હશે: 10000 × (1.08)¹⁰'
      },
      calculation: {
        original: '₹21,589.25',
        exponential: '10000 × (1.08)¹⁰',
        base: 1.08,
        exponent: 10,
        result: '₹21,589.25'
      },
      funFact: {
        en: 'Albert Einstein called compound interest "the eighth wonder of the world"!',
        hi: 'अल्बर्ट आइंस्टीन ने चक्रवृद्धि ब्याज को "दुनिया का आठवां अजूबा" कहा था!',
        gu: 'આલ્બર્ટ આઇન્સ્ટાઈને ચક્રવૃદ્ધિ વ્યાજને "વિશ્વનું આઠમું અજુબું" કહ્યું હતું!'
      },
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'computer-storage',
      title: {
        en: 'Computer Storage',
        hi: 'कंप्यूटर स्टोरेज',
        gu: 'કમ્પ્યુટર સ્ટોરેજ'
      },
      icon: <Database className="w-8 h-8" />,
      category: 'technology',
      description: {
        en: '1 GB (Gigabyte) = 2³⁰ bytes. Modern phones have storage measured in these massive numbers!',
        hi: '1 GB (गीगाबाइट) = 2³⁰ बाइट्स। आधुनिक फोन में इन विशाल संख्याओं में स्टोरेज मापा जाता है!',
        gu: '1 GB (ગીગાબાઇટ) = 2³⁰ બાઇટ્સ. આધુનિક ફોનોમાં આ વિશાળ સંખ્યાઓમાં સ્ટોરેજ માપવામાં આવે છે!'
      },
      calculation: {
        original: '1,073,741,824 bytes',
        exponential: '2³⁰ bytes',
        base: 2,
        exponent: 30,
        result: '1 Gigabyte'
      },
      funFact: {
        en: 'The first computer hard drive (1956) was 2³⁴ bytes and weighed over a ton!',
        hi: 'पहला कंप्यूटर हार्ड ड्राइव (1956) 2³⁴ बाइट्स का था और एक टन से अधिक वजन का था!',
        gu: 'પહેલું કમ્પ્યુટર હાર્ડ ડ્રાઇવ (1956) 2³⁴ બાઇટ્સનું હતું અને એક ટનથી વધુ વજનનું હતું!'
      },
      color: 'from-indigo-500 to-blue-500'
    },
    {
      id: 'atoms',
      title: {
        en: 'Atoms in Human Body',
        hi: 'मानव शरीर में परमाणु',
        gu: 'માનવ શરીરમાં પરમાણુ'
      },
      icon: <Atom className="w-8 h-8" />,
      category: 'biology',
      description: {
        en: 'An average human body contains approximately 7 × 10²⁷ atoms!',
        hi: 'एक औसत मानव शरीर में लगभग 7 × 10²⁷ परमाणु होते हैं!',
        gu: 'સરેરાશ માનવ શરીરમાં લગભગ 7 × 10²⁷ પરમાણુ હોય છે!'
      },
      calculation: {
        original: '7,000,000,000,000,000,000,000,000,000 atoms',
        exponential: '7 × 10²⁷ atoms',
        base: 10,
        exponent: 27,
        result: '7 octillion atoms'
      },
      funFact: {
        en: 'About 65% of your body is oxygen atoms!',
        hi: 'आपके शरीर का लगभग 65% ऑक्सीजन परमाणु हैं!',
        gu: 'તમારા શરીરનો લગભગ 65% ઓક્સિજન પરમાણુ છે!'
      },
      color: 'from-red-500 to-orange-500'
    },
    {
      id: 'dna-base-pairs',
      title: {
        en: 'DNA Base Pairs',
        hi: 'डीएनए बेस पेयर',
        gu: 'DNA બેસ પેયર'
      },
      icon: <Dna className="w-8 h-8" />,
      category: 'biology',
      description: {
        en: 'The human genome contains approximately 3 × 10⁹ base pairs. This massive amount of genetic information is packed into every cell!',
        hi: 'मानव जीनोम में लगभग 3 × 10⁹ बेस पेयर होते हैं। यह बड़ी मात्रा में आनुवंशिक जानकारी हर कोशिका में संकुचित होती है!',
        gu: 'માનવ જીનોમમાં લગભગ 3 × 10⁹ બેસ પેયર હોય છે. આ વિશાળ માત્રામાં જનીની માહિતી દરેક કોષમાં પેક કરવામાં આવે છે!'
      },
      calculation: {
        original: '3,000,000,000 base pairs',
        exponential: '3 × 10⁹ base pairs',
        base: 10,
        exponent: 9,
        result: '3 billion base pairs'
      },
      funFact: {
        en: 'If you stretched out all the DNA in your body, it would reach the Sun and back over 600 times!',
        hi: 'यदि आप अपने शरीर में सभी DNA फैलाते हैं, तो यह सूर्य तक पहुंच जाएगा और 600 गुना वापस आएगा!',
        gu: 'જો તમે તમારા શરીરમાં બધા DNA ને ખેંચ્યા હોત, તો તે સૂર્ય સુધી પહોંચશે અને 600 વાર પાછું આવશે!'
      },
      color: 'from-cyan-500 to-blue-500'
    },
    {
      id: 'internet-data',
      title: {
        en: 'Internet Data Transfer',
        hi: 'इंटरनेट डेटा ट्रांसफर',
        gu: 'ઇન્ટરનેટ ડેટા ટ્રાન્સફર'
      },
      icon: <Smartphone className="w-8 h-8" />,
      category: 'technology',
      description: {
        en: 'Every day, about 2.5 × 10¹⁸ bytes of data are created on the internet!',
        hi: 'हर दिन, इंटरनेट पर लगभग 2.5 × 10¹⁸ बाइट्स डेटा बनता है!',
        gu: 'દરરોજ, ઇન્ટરનેટ પર લગભગ 2.5 × 10¹⁸ બાઇટ્સ ડેટા બનાવવામાં આવે છે!'
      },
      calculation: {
        original: '2,500,000,000,000,000,000 bytes',
        exponential: '2.5 × 10¹⁸ bytes',
        base: 10,
        exponent: 18,
        result: '2.5 Exabytes per day'
      },
      funFact: {
        en: '90% of all data ever created was made in just the last 2 years!',
        hi: 'कभी बनाए गए सभी डेटा का 90% केवल पिछले 2 वर्षों में बनाया गया था!',
        gu: 'ક્યારેય બનાવવામાં આવેલા બધા ડેટાનો 90% માત્ર છેલ્લા 2 વર્ષોમાં બનાવવામાં આવ્યો હતો!'
      },
      color: 'from-cyan-500 to-teal-500'
    },
    {
      id: 'transistors-on-chip',
      title: {
        en: 'Transistors on a Chip',
        hi: 'एक चिप पर ट्रांजिस्टर',
        gu: 'એક ચિપ પર ટ્રાન્ઝિસ્ટર'
      },
      icon: <Cpu className="w-8 h-8" />,
      category: 'technology',
      description: {
        en: 'The number of transistors on microchips doubles approximately every two years, a trend known as Moore\'s Law. Modern CPUs can have billions of transistors!',
        hi: 'माइक्रोचिप पर ट्रांजिस्टर की संख्या लगभग हर दो साल में दोगुनी हो जाती है, जिसे मूर का नियम कहा जाता है। आधुनिक सीपीयू में अरबों ट्रांजिस्टर हो सकते हैं!',
        gu: 'માઇક્રોચિપ્સ પર ટ્રાન્ઝિસ્ટરની સંખ્યા લગભગ દર બે વર્ષે બમણી થાય છે, જેને મૂરનો નિયમ કહેવાય છે. આધુનિક CPU માં અબજો ટ્રાન્ઝિસ્ટર હોઈ શકે છે!'
      },
      calculation: {
        original: '10,000,000,000 transistors',
        exponential: '10¹⁰ transistors',
        base: 10,
        exponent: 10,
        result: '10 billion transistors'
      },
      funFact: {
        en: 'The first microprocessor (Intel 4004 in 1971) had 2,300 transistors. Today, a single chip can have over 100 billion!',
        hi: 'पहला माइक्रोप्रोसेसर (1971 में इंटेल 4004) में 2,300 ट्रांजिस्टर थे। आज, एक ही चिप में 100 अरब से अधिक हो सकते हैं!',
        gu: 'પ્રથમ માઇક્રોપ્રોસેસર (1971 માં ઇન્ટેલ 4004) માં 2,300 ટ્રાન્ઝિસ્ટર હતા. આજે, એક જ ચિપમાં 100 અબજથી વધુ હોઈ શકે છે!'
      },
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'population-growth',
      title: {
        en: 'Population Growth',
        hi: 'जनसंख्या वृद्धि',
        gu: 'લોકસંખ્યા વૃદ્ધિ'
      },
      icon: <TrendingUp className="w-8 h-8" />,
      category: 'finance',
      description: {
        en: 'If a city grows at 5% per year, its population follows the formula: P × (1.05)ⁿ',
        hi: 'यदि एक शहर प्रति वर्ष 5% की दर से बढ़ता है, तो इसकी जनसंख्या सूत्र का अनुसरण करती है: P × (1.05)ⁿ',
        gu: 'જો એક શહેર દર વર્ષે 5% ના દરે વધે છે, તો તેની લોકસંખ્યા ફોર્મ્યુલાનું પાલન કરે છે: P × (1.05)ⁿ'
      },
      calculation: {
        original: 'Population after 20 years',
        exponential: 'P × (1.05)²⁰',
        base: 1.05,
        exponent: 20,
        result: '2.65 times original'
      },
      funFact: {
        en: 'World population reached 8 billion in 2022!',
        hi: 'विश्व जनसंख्या 2022 में 8 अरब तक पहुंच गई!',
        gu: 'વિશ્વ લોકસંખ્યા 2022 માં 8 અબજ પહોંચી ગઈ!'
      },
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 'inflation',
      title: {
        en: 'Inflation',
        hi: 'मुद्रास्फीति',
        gu: 'ફુગાવો'
      },
      icon: <Scale className="w-8 h-8" />,
      category: 'finance',
      description: {
        en: 'If inflation is 3% per year, the purchasing power of ₹100 will decrease over time. After 10 years, it will be worth: 100 × (0.97)¹⁰',
        hi: 'यदि मुद्रास्फीति प्रति वर्ष 3% है, तो ₹100 की क्रय शक्ति समय के साथ घट जाएगी। 10 वर्षों के बाद, इसका मूल्य होगा: 100 × (0.97)¹⁰',
        gu: 'જો ફુગાવો દર વર્ષે 3% હોય, તો ₹100 ની ખરીદ શક્તિ સમય જતાં ઘટશે. 10 વર્ષ પછી, તેનું મૂલ્ય હશે: 100 × (0.97)¹⁰'
      },
      calculation: {
        original: '₹73.74',
        exponential: '100 × (0.97)¹⁰',
        base: 0.97,
        exponent: 10,
        result: '₹73.74'
      },
      funFact: {
        en: 'Hyperinflation can cause prices to double in a single day!',
        hi: 'अति-मुद्रास्फीति के कारण कीमतें एक ही दिन में दोगुनी हो सकती हैं!',
        gu: 'અતિ-ફુગાવાને કારણે કિંમતો એક જ દિવસમાં બમણી થઈ શકે છે!'
      },
      color: 'from-red-500 to-orange-500'
    }
  ];

  const categories = [
    { id: 'space', label: tr.categorySpace, icon: <Rocket className="w-5 h-5" /> },
    { id: 'biology', label: tr.categoryBiology, icon: <Dna className="w-5 h-5" /> },
    { id: 'technology', label: tr.categoryTechnology, icon: <Zap className="w-5 h-5" /> },
    { id: 'finance', label: tr.categoryFinance, icon: <DollarSign className="w-5 h-5" /> }
  ];

  const filteredExamples = examples.filter(ex => ex.category === activeTab);
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
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 text-center">
          <div className="inline-flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-lg px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full mb-4 border border-white/20 animate-fade-in max-w-full mx-auto flex-wrap justify-center min-h-[60px] sm:min-h-[70px]">
            <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 animate-spin-slow flex-shrink-0" />
            <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 break-words px-2">
              {tr.heroTitle}
            </h1>
            <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400 animate-bounce-slow flex-shrink-0" />
          </div>
          <p className="text-sm sm:text-base md:text-lg text-purple-200 max-w-4xl mx-auto leading-relaxed break-words px-4 py-2">
            {tr.heroDescription}
          </p>
        </div>
      </div>

      {/* Summary removed as per requirements */}

      {/* Category Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8">
        <div className="flex gap-2 sm:gap-3 flex-wrap justify-center">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveTab(cat.id);
                setSelectedExample(null);
              }}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 text-sm sm:text-base ${
                activeTab === cat.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/50'
                  : 'bg-white/10 backdrop-blur-sm hover:bg-white/20'
              }`}
            >
              <span className="flex-shrink-0">{cat.icon}</span>
              <span className="break-words">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Examples Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12">
          {filteredExamples.map((example, idx) => (
            <div
              key={example.id}
              onClick={() => setSelectedExample(example.id)}
              className={`cursor-pointer transform transition-all duration-300 hover:scale-105 animate-fade-in ${
                selectedExample === example.id ? 'scale-105' : ''
              }`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className={`bg-gradient-to-br ${example.color} p-1 rounded-2xl shadow-2xl hover:shadow-3xl`}>
                <div className="bg-slate-900/90 backdrop-blur-lg rounded-2xl p-5 sm:p-6 md:p-7 h-full border border-white/10 min-h-[200px]">
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`p-2 sm:p-3 bg-gradient-to-br ${example.color} rounded-xl flex-shrink-0`}>
                      {example.icon}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold break-words flex-1 leading-tight">{example.title[language]}</h3>
                  </div>
                  <p className="text-purple-200 mb-4 text-xs sm:text-sm leading-relaxed break-words min-h-[60px]">{example.description[language]}</p>
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
              <div className="bg-slate-900/95 backdrop-blur-lg rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 border border-white/20">
                <div className="flex items-start justify-between mb-8 gap-4">
                  <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className={`p-3 sm:p-4 md:p-5 bg-gradient-to-br ${selected.color} rounded-xl flex-shrink-0`}>
                      {selected.icon}
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold break-words leading-tight">{selected.title[language]}</h2>
                  </div>
                  <button
                    onClick={() => setSelectedExample(null)}
                    className="text-white/60 hover:text-white text-2xl font-bold transition-all flex-shrink-0"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                  {/* Left: Calculation */}
                  <div className="space-y-4 sm:space-y-6">
                    <div className="bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10">
                      <h3 className="text-lg sm:text-xl font-bold mb-4 text-cyan-300 break-words">📝 {tr.originalNumber}</h3>
                      <div className="bg-gradient-to-r from-red-600/30 to-orange-600/30 rounded-xl p-3 sm:p-4 font-mono text-base sm:text-lg break-all">
                        {selected.calculation.original}
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10">
                      <h3 className="text-lg sm:text-xl font-bold mb-4 text-green-300 break-words">✨ {tr.exponentialForm}</h3>
                      <div className="bg-gradient-to-r from-green-600/30 to-emerald-600/30 rounded-xl p-3 sm:p-4 font-mono text-xl sm:text-2xl text-center font-bold break-words">
                        {selected.calculation.exponential}
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10">
                      <h3 className="text-lg sm:text-xl font-bold mb-4 text-purple-300 break-words">🔢 {tr.breakdown}</h3>
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center justify-between bg-blue-600/20 rounded-lg p-2 sm:p-3">
                          <span className="font-semibold text-sm sm:text-base break-words">{tr.base}:</span>
                          <span className="text-xl sm:text-2xl font-bold text-blue-300 break-words">{selected.calculation.base}</span>
                        </div>
                        <div className="flex items-center justify-between bg-purple-600/20 rounded-lg p-2 sm:p-3">
                          <span className="font-semibold text-sm sm:text-base break-words">{tr.exponent}:</span>
                          <span className="text-xl sm:text-2xl font-bold text-purple-300 break-words">{selected.calculation.exponent}</span>
                        </div>
                        <div className="flex items-center justify-between bg-pink-600/20 rounded-lg p-2 sm:p-3">
                          <span className="font-semibold text-sm sm:text-base break-words">{tr.result}:</span>
                          <span className="text-lg sm:text-xl font-bold text-pink-300 break-words">{selected.calculation.result}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Visualization */}
                  <div className="space-y-4 sm:space-y-6">
                    <div className="bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10">
                      <h3 className="text-lg sm:text-xl font-bold mb-4 text-yellow-300 break-words">🎯 {tr.whatThisMeans}</h3>
                      <p className="text-base sm:text-lg leading-relaxed text-purple-200 break-words">{selected.description[language]}</p>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 rounded-2xl p-4 sm:p-6 border border-yellow-400/30">
                      <h3 className="text-lg sm:text-xl font-bold mb-4 text-yellow-300 break-words">💡 {tr.funFact}</h3>
                      <p className="text-base sm:text-lg leading-relaxed break-words">{selected.funFact[language]}</p>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10">
                      <h3 className="text-lg sm:text-xl font-bold mb-4 text-cyan-300 break-words">🧮 {tr.animatedCalculation}</h3>
                      <div className="bg-gradient-to-r from-cyan-600/30 to-blue-600/30 rounded-xl p-4 sm:p-6 text-center overflow-hidden">
                        <div className="text-sm text-cyan-200 mb-2">
                          {selected.calculation.base}<sup>{selected.calculation.exponent}</sup> =
                        </div>
                        <div className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono text-yellow-300 animate-pulse break-all overflow-wrap-anywhere px-2 whitespace-normal">
                          {animatedNumber}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-2xl p-4 sm:p-6 border border-indigo-400/30">
                      <h3 className="text-lg sm:text-xl font-bold mb-4 text-indigo-300 break-words">📚 {tr.whyUseExponents}</h3>
                      <ul className="space-y-2 text-purple-200 break-words">
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
