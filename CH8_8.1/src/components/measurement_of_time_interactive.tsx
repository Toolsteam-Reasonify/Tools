/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { CheckCircle, XCircle, ChevronRight, Clock, Sun } from "lucide-react";

// Type Definitions
export type Language = 'en' | 'hi' | 'gu';
export type Mode = 'demonstration' | 'practice' | 'realworld';

// Comprehensive translation dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.logo': 'Time Measurement',
    'nav.learn': 'Learn',
    'nav.practice': 'Practice',
    'nav.realworld': 'Real World',
    'header.title': 'Measurement of Time',
    'header.subtitle': 'Explore how humans have measured time through the ages',
    'early.title': 'Early Methods of Measuring Time',
    'early.subtitle': 'Before clocks and watches were invented, people observed natural events that repeat regularly',
    'early.sun.title': 'Rising and Setting of the Sun',
    'early.sun.desc': 'Daily cycle of sunrise and sunset',
    'early.moon.title': 'Phases of the Moon',
    'early.moon.desc': 'Monthly lunar cycle',
    'early.seasons.title': 'Change of Seasons',
    'early.seasons.desc': 'Yearly seasonal patterns',
    'ancient.title': 'Ancient Time-Measuring Devices',
    'device.sundial': 'Sundial',
    'device.sundial.desc': 'Measures time using the shadow of an object formed by sunlight',
    'device.waterclock': 'Water Clock',
    'device.waterclock.desc': 'Measures time by the flow of water',
    'device.hourglass': 'Hourglass',
    'device.hourglass.desc': 'Measures time using flowing sand',
    'device.candle': 'Candle Clock',
    'device.candle.desc': 'Shows time by the amount of candle burned',
    'sundial.demo': 'Sundial Demonstration',
    'sundial.timeofday': 'Time of Day',
    'waterclock.level': 'Water Level',
    'hourglass.sand': 'Sand Level',
    'pendulum.title': 'Pendulum Clock',
    'pendulum.subtitle': 'A major improvement in time measurement. It works on the regular swinging motion of a pendulum.',
    'pendulum.simple': 'Simple Pendulum',
    'pendulum.start': 'Start Pendulum',
    'pendulum.stop': 'Stop Pendulum',
    'pendulum.components': 'Components:',
    'pendulum.bob': 'Bob: A small heavy object',
    'pendulum.string': 'String: Fixed to a support',
    'pendulum.keyterms': 'Key Terms:',
    'pendulum.oscillation': 'Oscillation: One complete to-and-fro movement',
    'pendulum.timeperiod': 'Time Period: Time taken for one oscillation',
    'pendulum.facts': 'Important Facts:',
    'pendulum.fact1': 'Time period depends on the length of the string',
    'pendulum.fact2': 'Time period does NOT depend on the mass of the bob',
    'si.title': 'SI Unit of Time',
    'si.second': 'Second (s)',
    'si.second.desc': 'Base unit of time',
    'si.minute': 'Minute (min)',
    'si.minute.desc': '60 seconds = 1 minute',
    'si.hour': 'Hour (h)',
    'si.hour.desc': '60 minutes = 1 hour',
    'importance.title': 'Importance of Measuring Time',
    'importance.sports': 'Sports competitions',
    'importance.medicine': 'Medicine',
    'importance.science': 'Science experiments',
    'importance.daily': 'Daily life activities',
    'realworld.title': 'Real World Applications',
    'realworld.subtitle': 'How accurate time measurement impacts our modern world',
    'realworld.gps': 'GPS Navigation',
    'realworld.gps.desc': 'GPS satellites use atomic clocks. Even 1 microsecond error can cause 300-meter location mistakes!',
    'realworld.internet': 'Internet & Computers',
    'realworld.internet.desc': 'Computer processors sync billions of operations per second using precise clock signals',
    'realworld.finance': 'Stock Trading',
    'realworld.finance.desc': 'High-frequency trading executes millions of trades in milliseconds - timing is everything',
    'realworld.aviation': 'Air Traffic Control',
    'realworld.aviation.desc': 'Planes are separated by precise time intervals to prevent collisions in busy airspace',
    'realworld.telecom': 'Mobile Networks',
    'realworld.telecom.desc': 'Cell towers synchronize to nanosecond precision to handle millions of simultaneous calls',
    'realworld.space': 'Space Missions',
    'realworld.space.desc': 'Commands to Mars rovers must account for the 20-minute signal delay with perfect timing',
    'practice.progress': 'Question',
    'practice.of': 'of',
    'practice.score': 'Score:',
    'practice.check': 'Check Answer',
    'practice.select': 'Select an option',
    'practice.correct': 'Correct! 🎉',
    'practice.incorrect': 'Not quite right',
    'practice.previous': 'Previous',
    'practice.next': 'Next',
    'practice.complete': 'Congratulations!',
    'practice.complete.sub': "You've completed all questions!",
    'practice.finalscore': 'Final Score:',
    'practice.perfect': "Perfect score! You're a time measurement expert! 🏆",
    'practice.great': 'Great job! Keep practicing! 👏',
    'practice.good': 'Good effort! Review the concepts and try again! 💪',
  },
  hi: {
    'nav.logo': 'समय माप',
    'nav.learn': 'सीखें',
    'nav.practice': 'अभ्यास करें',
    'nav.realworld': 'वास्तविक दुनिया',
    'header.title': 'समय का मापन',
    'header.subtitle': 'जानें कि मनुष्यों ने युगों से समय कैसे मापा है',
    'early.title': 'समय मापने की प्रारंभिक विधियाँ',
    'early.subtitle': 'घड़ियों के आविष्कार से पहले, लोग नियमित रूप से दोहराई जाने वाली प्राकृतिक घटनाओं का अवलोकन करते थे',
    'early.sun.title': 'सूर्योदय और सूर्यास्त',
    'early.sun.desc': 'सूर्योदय और सूर्यास्त का दैनिक चक्र',
    'early.moon.title': 'चंद्रमा की कलाएं',
    'early.moon.desc': 'मासिक चंद्र चक्र',
    'early.seasons.title': 'मौसम का परिवर्तन',
    'early.seasons.desc': 'वार्षिक मौसमी पैटर्न',
    'ancient.title': 'प्राचीन समय-मापन उपकरण',
    'device.sundial': 'धूपघड़ी',
    'device.sundial.desc': 'सूर्य के प्रकाश से बनी छाया द्वारा समय मापता है',
    'device.waterclock': 'जलघड़ी',
    'device.waterclock.desc': 'पानी के प्रवाह से समय मापता है',
    'device.hourglass': 'रेतघड़ी',
    'device.hourglass.desc': 'बहती रेत से समय मापता है',
    'device.candle': 'मोमबत्ती घड़ी',
    'device.candle.desc': 'मोमबत्ती जलने की मात्रा से समय दिखाता है',
    'sundial.demo': 'धूपघड़ी प्रदर्शन',
    'sundial.timeofday': 'दिन का समय',
    'waterclock.level': 'पानी का स्तर',
    'hourglass.sand': 'रेत का स्तर',
    'pendulum.title': 'पेंडुलम घड़ी',
    'pendulum.subtitle': 'समय माप में एक बड़ा सुधार। यह पेंडुलम की नियमित दोलन गति पर काम करता है।',
    'pendulum.simple': 'साधारण पेंडुलम',
    'pendulum.start': 'पेंडुलम शुरू करें',
    'pendulum.stop': 'पेंडुलम रोकें',
    'pendulum.components': 'घटक:',
    'pendulum.bob': 'बोब: एक छोटी भारी वस्तु',
    'pendulum.string': 'धागा: एक सहारे से जुड़ा हुआ',
    'pendulum.keyterms': 'मुख्य शब्द:',
    'pendulum.oscillation': 'दोलन: एक पूर्ण आगे-पीछे की गति',
    'pendulum.timeperiod': 'आवर्तकाल: एक दोलन में लगने वाला समय',
    'pendulum.facts': 'महत्वपूर्ण तथ्य:',
    'pendulum.fact1': 'आवर्तकाल धागे की लंबाई पर निर्भर करता है',
    'pendulum.fact2': 'आवर्तकाल बोब के द्रव्यमान पर निर्भर नहीं करता',
    'si.title': 'समय की SI इकाई',
    'si.second': 'सेकंड (s)',
    'si.second.desc': 'समय की आधार इकाई',
    'si.minute': 'मिनट (min)',
    'si.minute.desc': '60 सेकंड = 1 मिनट',
    'si.hour': 'घंटा (h)',
    'si.hour.desc': '60 मिनट = 1 घंटा',
    'importance.title': 'समय मापने का महत्व',
    'importance.sports': 'खेल प्रतियोगिताएं',
    'importance.medicine': 'चिकित्सा',
    'importance.science': 'विज्ञान प्रयोग',
    'importance.daily': 'दैनिक जीवन गतिविधियां',
    'realworld.title': 'वास्तविक दुनिया के अनुप्रयोग',
    'realworld.subtitle': 'सटीक समय माप आधुनिक दुनिया को कैसे प्रभावित करता है',
    'realworld.gps': 'जीपीएस नेविगेशन',
    'realworld.gps.desc': 'जीपीएस उपग्रह परमाणु घड़ियों का उपयोग करते हैं। 1 माइक्रोसेकंड की त्रुटि 300 मीटर की गलती का कारण बन सकती है!',
    'realworld.internet': 'इंटरनेट और कंप्यूटर',
    'realworld.internet.desc': 'कंप्यूटर प्रोसेसर सटीक घड़ी संकेतों से प्रति सेकंड अरबों ऑपरेशन सिंक करते हैं',
    'realworld.finance': 'स्टॉक ट्रेडिंग',
    'realworld.finance.desc': 'उच्च-आवृत्ति ट्रेडिंग मिलीसेकंड में लाखों ट्रेड करती है - समय सब कुछ है',
    'realworld.aviation': 'एयर ट्रैफिक कंट्रोल',
    'realworld.aviation.desc': 'विमानों को सटीक समय अंतराल से अलग किया जाता है ताकि टकराव न हो',
    'realworld.telecom': 'मोबाइल नेटवर्क',
    'realworld.telecom.desc': 'सेल टावर नैनोसेकंड सटीकता से लाखों कॉल संभालते हैं',
    'realworld.space': 'अंतरिक्ष मिशन',
    'realworld.space.desc': 'मंगल रोवर्स को कमांड 20-मिनट विलंब के साथ पूर्ण समय पर भेजे जाते हैं',
    'practice.progress': 'प्रश्न',
    'practice.of': 'में से',
    'practice.score': 'स्कोर:',
    'practice.check': 'उत्तर जांचें',
    'practice.select': 'एक विकल्प चुनें',
    'practice.correct': 'सही! 🎉',
    'practice.incorrect': 'बिल्कुल सही नहीं',
    'practice.previous': 'पिछला',
    'practice.next': 'अगला',
    'practice.complete': 'बधाई हो!',
    'practice.complete.sub': 'आपने सभी प्रश्न पूरे कर लिए हैं!',
    'practice.finalscore': 'अंतिम स्कोर:',
    'practice.perfect': 'पूर्ण स्कोर! आप समय माप विशेषज्ञ हैं! 🏆',
    'practice.great': 'बहुत बढ़िया! अभ्यास जारी रखें! 👏',
    'practice.good': 'अच्छा प्रयास! अवधारणाओं की समीक्षा करें और फिर से प्रयास करें! 💪',
  },
  gu: {
    'nav.logo': 'સમય માપ',
    'nav.learn': 'શીખો',
    'nav.practice': 'અભ્યાસ કરો',
    'nav.realworld': 'વાસ્તવિક દુનિયા',
    'header.title': 'સમયનું માપન',
    'header.subtitle': 'જાણો કે યુગોથી માનવોએ સમય કેવી રીતે માપ્યો છે',
    'early.title': 'સમય માપવાની પ્રારંભિક પદ્ધતિઓ',
    'early.subtitle': 'ઘડિયાળોની શોધ પહેલાં, લોકો નિયમિત પુનરાવર્તિત પ્રાકૃતિક ઘટનાઓનું નિરીક્ષણ કરતા હતા',
    'early.sun.title': 'સૂર્યોદય અને સૂર્યાસ્ત',
    'early.sun.desc': 'સૂર્યોદય અને સૂર્યાસ્તનું દૈનિક ચક્ર',
    'early.moon.title': 'ચંદ્રની કળાઓ',
    'early.moon.desc': 'માસિક ચંદ્ર ચક્ર',
    'early.seasons.title': 'ઋતુઓનો પરિવર્તન',
    'early.seasons.desc': 'વાર્ષિક મૌસમી પેટર્ન',
    'ancient.title': 'પ્રાચીન સમય-માપન ઉપકરણો',
    'device.sundial': 'સૂર્યઘડિયાળ',
    'device.sundial.desc': 'સૂર્યપ્રકાશથી બનેલ પડછાયા દ્વારા સમય માપે છે',
    'device.waterclock': 'પાણીઘડિયાળ',
    'device.waterclock.desc': 'પાણીના પ્રવાહથી સમય માપે છે',
    'device.hourglass': 'રેતીઘડિયાળ',
    'device.hourglass.desc': 'વહેતી રેતીથી સમય માપે છે',
    'device.candle': 'મીણબત્તી ઘડિયાળ',
    'device.candle.desc': 'મીણબત્તી સળગવાની માત્રા દ્વારા સમય દર્શાવે છે',
    'sundial.demo': 'સૂર્યઘડિયાળ પ્રદર્શન',
    'sundial.timeofday': 'દિવસનો સમય',
    'waterclock.level': 'પાણીનું સ્તર',
    'hourglass.sand': 'રેતીનું સ્તર',
    'pendulum.title': 'લોલક ઘડિયાળ',
    'pendulum.subtitle': 'સમય માપણમાં એક મોટો સુધારો. તે લોલકની નિયમિત ઝૂલતી ગતિ પર કામ કરે છે.',
    'pendulum.simple': 'સરળ લોલક',
    'pendulum.start': 'લોલક શરૂ કરો',
    'pendulum.stop': 'લોલક રોકો',
    'pendulum.components': 'ઘટકો:',
    'pendulum.bob': 'બોબ: એક નાની ભારે વસ્તુ',
    'pendulum.string': 'દોરી: આધાર સાથે જોડાયેલ',
    'pendulum.keyterms': 'મુખ્ય શબ્દો:',
    'pendulum.oscillation': 'દોલન: એક સંપૂર્ણ આગળ-પાછળની ગતિ',
    'pendulum.timeperiod': 'સમયગાળો: એક દોલનમાં લાગતો સમય',
    'pendulum.facts': 'મહત્વપૂર્ણ તથ્યો:',
    'pendulum.fact1': 'સમયગાળો દોરીની લંબાઈ પર આધારિત છે',
    'pendulum.fact2': 'સમયગાળો બોબના દળ પર આધારિત નથી',
    'si.title': 'સમયનો SI એકમ',
    'si.second': 'સેકંડ (s)',
    'si.second.desc': 'સમયનો આધાર એકમ',
    'si.minute': 'મિનિટ (min)',
    'si.minute.desc': '60 સેકંડ = 1 મિનિટ',
    'si.hour': 'કલાક (h)',
    'si.hour.desc': '60 મિનિટ = 1 કલાક',
    'importance.title': 'સમય માપવાનું મહત્વ',
    'importance.sports': 'રમતગમતની સ્પર્ધાઓ',
    'importance.medicine': 'દવા',
    'importance.science': 'વિજ્ઞાન પ્રયોગો',
    'importance.daily': 'દૈનિક જીવન પ્રવૃત્તિઓ',
    'realworld.title': 'વાસ્તવિક દુનિયાના ઉપયોગો',
    'realworld.subtitle': 'ચોક્કસ સમય માપ આધુનિક દુનિયાને કેવી રીતે અસર કરે છે',
    'realworld.gps': 'જીપીએસ નેવિગેશન',
    'realworld.gps.desc': 'જીપીએસ ઉપગ્રહો પરમાણુ ઘડિયાળોનો ઉપયોગ કરે છે. 1 માઈક્રોસેકન્ડની ભૂલ 300 મીટરની સ્થાનિક ભૂલનું કારણ બની શકે છે!',
    'realworld.internet': 'ઇન્ટરનેટ અને કમ્પ્યુટર્સ',
    'realworld.internet.desc': 'કમ્પ્યુટર પ્રોસેસર ચોક્કસ ઘડિયાળ સંકેતોનો ઉપયોગ કરીને પ્રતિ સેકન્ડ અબજો કામગીરી સમન્વયિત કરે છે',
    'realworld.finance': 'સ્ટોક ટ્રેડિંગ',
    'realworld.finance.desc': 'ઉચ્ચ-આવૃત્તિ ટ્રેડિંગ મિલિસેકન્ડમાં લાખો વેપાર કરે છે - સમય બધું છે',
    'realworld.aviation': 'એર ટ્રાફિક કંટ્રોલ',
    'realworld.aviation.desc': 'ભીડવાળા હવાઈ ક્ષેત્રમાં અથડામણ અટકાવવા માટે વિમાનોને ચોક્કસ સમય અંતરાલ દ્વારા અલગ કરવામાં આવે છે',
    'realworld.telecom': 'મોબાઇલ નેટવર્ક્સ',
    'realworld.telecom.desc': 'સેલ ટાવર લાખો એકસાથે કોલ્સ સંભાળવા માટે નેનોસેકન્ડ ચોકસાઈથી સમન્વયિત થાય છે',
    'realworld.space': 'અવકાશ મિશન',
    'realworld.space.desc': 'મંગળ રોવર્સને કમાન્ડ 20-મિનિટના સિગ્નલ વિલંબ સાથે સંપૂર્ણ સમય માટે જવાબદાર હોવી જોઈએ',
    'practice.progress': 'પ્રશ્ન',
    'practice.of': 'નો',
    'practice.score': 'સ્કોર:',
    'practice.check': 'જવાબ તપાસો',
    'practice.select': 'એક વિકલ્પ પસંદ કરો',
    'practice.correct': 'સાચું! 🎉',
    'practice.incorrect': 'તદ્દન સાચું નથી',
    'practice.previous': 'પહેલાંનું',
    'practice.next': 'આગળ',
    'practice.complete': 'અભિનંદન!',
    'practice.complete.sub': 'તમે બધા પ્રશ્નો પૂર્ણ કર્યા છે!',
    'practice.finalscore': 'અંતિમ સ્કોર:',
    'practice.perfect': 'સંપૂર્ણ સ્કોર! તમે સમય માપણ નિષ્ણાત છો! 🏆',
    'practice.great': 'ખૂબ સારું! અભ્યાસ ચાલુ રાખો! 👏',
    'practice.good': 'સારો પ્રયાસ! ખ્યાલોની સમીક્ષા કરો અને ફરીથી પ્રયાસ કરો! 💪',
  }
};

// Simple translation function
const translate = (key: string, lang: Language): string => {
  return translations[lang]?.[key] || key;
};

// Utility Functions
export const formatDate = (value: Date, locale: string) =>
  new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(value);

export const formatNumber = (value: number, locale: string) =>
  new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value);

// Contexts
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  formatDate: (value: Date) => string;
  formatNumber: (value: number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  const handleSetLanguage = (lang: Language) => {
    try {
      setLanguageState(lang);
      localStorage.setItem('preferredLanguage', lang);
    } catch (error) {
      console.error('Error setting language:', error);
    }
  };

  useEffect(() => {
    const savedLang = localStorage.getItem('preferredLanguage') as Language;
    if (savedLang && ['en', 'hi', 'gu'].includes(savedLang)) {
      setLanguageState(savedLang);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const helpers = useMemo(
    () => {
      const formatDateHelper = (value: Date) => {
        try {
          return formatDate(value, language);
        } catch (error) {
          console.error('Error formatting date:', error);
          return value.toLocaleDateString();
        }
      };
      const formatNumberHelper = (value: number) => {
        try {
          return formatNumber(value, language);
        } catch (error) {
          console.error('Error formatting number:', error);
          return value.toString();
        }
      };
      const translateHelper = (key: string) => {
        return translate(key, language);
      };
      return {
        formatDate: formatDateHelper,
        formatNumber: formatNumberHelper,
        t: translateHelper,
      };
    },
    [language],
  );

  const contextValue = useMemo(() => ({
    language,
    setLanguage: handleSetLanguage,
    ...helpers,
  }), [language, helpers]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

interface ModeContextType {
  currentMode: Mode;
  setCurrentMode: (mode: Mode) => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export const ModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentMode, setCurrentMode] = useState<Mode>('demonstration');

  const contextValue = useMemo(() => ({
    currentMode,
    setCurrentMode
  }), [currentMode]);

  return (
    <ModeContext.Provider value={contextValue}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error('useMode must be used within ModeProvider');
  }
  return context;
};

// Language Selector Component
export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "hi", name: "हिंदी", flag: "🇮🇳" },
    { code: "gu", name: "ગુજરાતી", flag: "🇮🇳" },
  ];

  return (
    <div style={{ position: 'relative' }}>
      <style>{`
        /* ==================== RESPONSIVE MEDIA QUERIES ==================== */
        
        /* Hide desktop navbar, show hamburger on mobile at 936px */
        @media (max-width: 936px) {
          .desktop-nav {
            display: none !important;
          }
          
          .mobile-hamburger {
            display: flex !important;
          }
        }
        
        /* Hide hamburger on desktop */
        @media (min-width: 937px) {
          .mobile-hamburger {
            display: none !important;
          }
          
          .mobile-sidebar {
            display: none !important;
          }
        }
        
        /* Grid: 3 columns -> 2 columns at 1024px */
        @media (max-width: 1024px) and (min-width: 769px) {
          .time-units-grid-3,
          div[style*="gridTemplateColumns"][style*="repeat(3, 1fr)"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        
        /* Grid: 2 columns -> carousel at 768px */
        @media (max-width: 768px) {
          .time-units-grid-3,
          .time-units-grid-2,
          .time-units-carousel,
          div[style*="gridTemplateColumns"] {
            display: flex !important;
            overflow-x: auto !important;
            gap: 1rem !important;
            scroll-snap-type: x mandatory !important;
            -webkit-overflow-scrolling: touch !important;
            padding-bottom: 12px !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          
          .time-units-grid-3 > div,
          .time-units-grid-2 > div,
          .time-units-carousel > div,
          div[style*="gridTemplateColumns"] > div {
            min-width: 250px !important;
            max-width: 250px !important;
            flex: 0 0 auto !important;
            scroll-snap-align: center !important;
          }
        }
        
        /* Carousel scrollbar styling */
        .time-units-carousel::-webkit-scrollbar,
        div[style*="gridTemplateColumns"]::-webkit-scrollbar {
          height: 8px;
        }
        
        .time-units-carousel::-webkit-scrollbar-track,
        div[style*="gridTemplateColumns"]::-webkit-scrollbar-track {
          background: rgba(59, 130, 246, 0.1);
          border-radius: 10px;
        }
        
        .time-units-carousel::-webkit-scrollbar-thumb,
        div[style*="gridTemplateColumns"]::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #3b82f6, #1e40af);
          border-radius: 10px;
        }
        
        /* Natural visual scrollbar */
        div[style*="overflowX: auto"]::-webkit-scrollbar {
          height: 6px;
        }
        
        div[style*="overflowX: auto"]::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }
        
        div[style*="overflowX: auto"]::-webkit-scrollbar-thumb {
          background: #3b82f6;
          border-radius: 10px;
        }
        
        /* Ancient Time Components - Responsive */
        @media (max-width: 768px) {
          .mot-svg-responsive,
          .mot-water {
            max-width: 100% !important;
          }
        }
        
        /* Responsive Typography */
        @media (max-width: 768px) {
          h1 {
            font-size: 1.8rem !important;
          }
          h2 {
            font-size: 1.5rem !important;
          }
          h3 {
            font-size: 1.2rem !important;
          }
        }
        
        @media (max-width: 576px) {
          h1 {
            font-size: 1.5rem !important;
          }
          h2 {
            font-size: 1.3rem !important;
          }
          .mot-mobile-menu {
            width: 280px !important;
          }
        }
        
        /* Extra small screens: below 425px */
        @media (max-width: 425px) {
          h1 {
            font-size: 1.3rem !important;
          }
          h2 {
            font-size: 1.1rem !important;
          }
          h3 {
            font-size: 1rem !important;
          }
          
          /* Reduce padding on cards */
          .early-methods-grid > div,
          .ancient-devices-grid > div {
            padding: 12px !important;
          }
          
          /* Make all grids single column */
          .early-methods-grid,
          .ancient-devices-grid,
          div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          
          /* Pendulum section responsive */
          div[style*="minmax(280px, 1fr)"] {
            grid-template-columns: 1fr !important;
          }
          
          /* Scale down SVGs */
          svg {
            max-width: 100% !important;
            height: auto !important;
            transform: scale(0.9);
          }
          
          /* Buttons full width with less padding */
          button {
            padding: 10px 12px !important;
            font-size: 14px !important;
          }
          
          /* Reduce emoji sizes */
          div[style*="fontSize: '48px'"],
          div[style*="fontSize: '60px'"],
          div[style*="fontSize: '64px'"] {
            font-size: 32px !important;
          }
          
          .mot-mobile-menu {
            width: 100vw !important;
            max-width: 100vw !important;
          }
        }
        
        /* Ensure containers don't overflow */
        @media (max-width: 768px) {
          [style*="maxWidth"],
          [style*="width: "][style*="px"] {
            max-width: 100% !important;
          }
        }
        
        /* ============ EARLY METHODS & ANCIENT DEVICES RESPONSIVE ============ */
        
        /* Desktop: 3 columns */
        .early-methods-grid,
        .ancient-devices-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
        }
        
        /* Tablet: 2 columns at 1024px */
        @media (max-width: 1024px) {
          .early-methods-grid,
          .ancient-devices-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        
        /* Mobile: 1 column (vertical stacking) at 768px */
        @media (max-width: 768px) {
          .early-methods-grid,
          .ancient-devices-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          
          /* Adjust card heights for mobile */
          .early-methods-grid > div,
          .ancient-devices-grid > div {
            min-height: auto !important;
          }
          
          /* Scale down large emojis on mobile */
          .early-methods-grid div[style*="fontSize: '48px'"],
          .ancient-devices-grid div[style*="fontSize: '60px'"] {
            font-size: 40px !important;
          }
          
          /* Responsive SVGs in Ancient Devices */
          .ancient-devices-grid svg {
            max-width: 100% !important;
            height: auto !important;
          }
        }
        
        /* Extra small screens: even more compact */
        @media (max-width: 576px) {
          .early-methods-grid,
          .ancient-devices-grid {
            gap: 12px !important;
          }
          
          /* Further reduce emoji size */
          .early-methods-grid div[style*="fontSize: '48px'"],
          .ancient-devices-grid div[style*="fontSize: '60px'"] {
            font-size: 36px !important;
          }
          
          /* Reduce padding in cards */
          .early-methods-grid > div,
          .ancient-devices-grid > div {
            padding: 16px !important;
          }
          
          /* Make SVGs even more compact on very small screens */
          .ancient-devices-grid svg {
            transform: scale(0.85);
            transform-origin: center;
          }
        }
        

        /* Responsive demonstration areas in Ancient Devices */
        @media (max-width: 768px) {
          /* Reduce padding in demonstration areas */
          .ancient-devices-grid div[style*="backgroundColor: 'rgba"] {
            padding: 12px !important;
          }
          
          /* Adjust font sizes in Ancient Device cards */
          .ancient-devices-grid h3 {
            font-size: 18px !important;
          }
          
          .ancient-devices-grid p {
            font-size: 13px !important;
          }
          
          /* Make range sliders more touch-friendly */
          .ancient-devices-grid input[type="range"] {
            height: 10px !important;
          }
        }
        
        @media (max-width: 576px) {
          /* Even more compact on very small screens */
          .ancient-devices-grid h3 {
            font-size: 16px !important;
          }
          
          .ancient-devices-grid p {
            font-size: 12px !important;
          }
        }
        
        /* Mobile menu animations */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        /* Mobile menu button hover and active states */
        .mobile-sidebar button {
          position: relative;
          overflow: hidden;
        }
        
        .mobile-sidebar button:active {
          transform: scale(0.98);
        }
        
        .mobile-sidebar button:not([disabled]):hover {
          opacity: 0.9;
          transform: translateX(4px);
        }
        
        /* Mobile menu language selector */
        .mobile-sidebar select {
          -webkit-tap-highlight-color: transparent;
        }
        
        .mobile-sidebar select:hover {
          border-color: #9CA3AF !important;
        }
        
        /* Smooth transitions for mobile menu */
        .mobile-sidebar * {
          -webkit-tap-highlight-color: transparent;
        }
        
        /* Pendulum section responsive */
        @media (max-width: 425px) {
          .pendulum-section {
            padding: 16px !important;
            border-radius: 12px !important;
          }
          
          .pendulum-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          
          .pendulum-section h2 {
            font-size: 18px !important;
            margin-bottom: 12px !important;
          }
          
          .pendulum-section h3 {
            font-size: 16px !important;
          }
          
          .pendulum-section p {
            font-size: 13px !important;
          }
          
          .pendulum-section button {
            padding: 10px !important;
            font-size: 14px !important;
          }
          
          .pendulum-section svg {
            max-width: 160px !important;
            max-height: 240px !important;
          }
          
          /* Reduce padding on all sections for very small screens */
          .pendulum-section > div,
          .early-methods-grid,
          .ancient-devices-grid {
            padding: 12px !important;
          }
          
          /* Make container padding smaller */
          body > div,
          main > div {
            padding-left: 12px !important;
            padding-right: 12px !important;
          }
        }
        
        /* Additional fixes for small screens */
        @media (max-width: 425px) {
          /* Learning container adjustments */
          .learning-container {
            padding: 8px !important;
            padding-top: 72px !important;
          }
          
          .learning-container > div {
            padding: 0 !important;
          }
          
          /* Reduce card spacing */
          div[style*="marginBottom: '32px'"] {
            margin-bottom: 20px !important;
          }
          
          div[style*="marginBottom: '24px'"] {
            margin-bottom: 16px !important;
          }
          
          /* All white cards/sections */
          div[style*="backgroundColor: 'white'"] {
            padding: 16px !important;
            border-radius: 12px !important;
          }
          
          /* Make practice question cards narrower */
          div[style*="width: '600px'"] {
            width: 100% !important;
            max-width: 100% !important;
            padding: 12px !important;
          }
          
          /* Adjust Real World cards */
          div[style*="gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr)'"] {
            grid-template-columns: 1fr !important;
          }
          
          /* Explanation cards in pendulum section */
          div[style*="borderLeft: '4px solid"] {
            padding: 12px !important;
          }
          
          div[style*="borderLeft: '4px solid"] h4 {
            font-size: 14px !important;
          }
          
          div[style*="borderLeft: '4px solid"] li {
            font-size: 12px !important;
          }
          
          /* Pendulum info boxes gap */
          .pendulum-info {
            gap: 12px !important;
          }
          
          .info-card {
            padding: 12px !important;
            border-radius: 8px !important;
          }
          
          .info-card h4 {
            font-size: 14px !important;
            margin-bottom: 6px !important;
          }
          
          .info-card ul {
            font-size: 12px !important;
            padding-left: 16px !important;
            line-height: 1.5 !important;
          }
          
          .info-card li {
            margin-bottom: 6px !important;
          }
        }
        
        /* Fine-tune for 375px and below (iPhone SE, etc.) */
        @media (max-width: 375px) {
          .learning-container {
            padding: 6px !important;
            padding-top: 68px !important;
          }
          
          .pendulum-section {
            padding: 12px !important;
          }
          
          .pendulum-section h2 {
            font-size: 16px !important;
          }
          
          .pendulum-section h3 {
            font-size: 15px !important;
          }
          
          .pendulum-section svg {
            max-width: 140px !important;
            max-height: 220px !important;
          }
          
          .info-card {
            padding: 10px !important;
          }
          
          .info-card h4 {
            font-size: 13px !important;
          }
          
          .info-card ul {
            font-size: 11px !important;
            padding-left: 14px !important;
          }
        }
      `}</style>

      <select
        aria-label="Select Language"
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        style={{
          appearance: 'none',
          backgroundColor: 'white',
          border: '2px solid #E5E7EB',
          borderRadius: '8px',
          padding: '8px 28px 8px 12px',
          minWidth: '120px',
          color: '#4B5563',
          fontWeight: '500',
          fontSize: '14px',
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
      <div style={{
        pointerEvents: 'none',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        paddingRight: '8px',
      }}>
        <svg
          style={{ fill: '#4B5563', height: '14px', width: '14px' }}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};

// Navbar Component
export const Navbar: React.FC = () => {
  const { currentMode, setCurrentMode } = useMode();
  const { t, language, setLanguage } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on screen resize above 936px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 936 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'white',
        borderBottom: '1px solid #E5E7EB',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 16px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '64px',
            gap: '12px',
          }}>
            <div style={{ flexShrink: 0 }}>
              <div style={{
                fontSize: '20px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#2563EB',
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 6px rgba(37, 99, 235, 0.3)',
                }}>
                  <Clock size={20} color="white" />
                </div>
                <span style={{
                  background: 'linear-gradient(to right, #2563eb, #9333ea)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  {t('nav.logo')}
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="desktop-nav" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <button
                onClick={() => setCurrentMode("demonstration")}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: currentMode === "demonstration" ? '#3b82f6' : '#EFF6FF',
                  color: currentMode === "demonstration" ? 'white' : '#2563EB',
                  boxShadow: currentMode === "demonstration" ? '0 4px 6px rgba(59, 130, 246, 0.3)' : 'none',
                }}
              >
                <span style={{ fontSize: '16px' }}>📚</span>
                <span>{t('nav.learn')}</span>
              </button>

              <button
                onClick={() => setCurrentMode("practice")}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: currentMode === "practice" ? '#a855f7' : '#FAF5FF',
                  color: currentMode === "practice" ? 'white' : '#7e22ce',
                  boxShadow: currentMode === "practice" ? '0 4px 6px rgba(168, 85, 247, 0.3)' : 'none',
                }}
              >
                <span style={{ fontSize: '16px' }}>🎯</span>
                <span>{t('nav.practice')}</span>
              </button>

              <button
                onClick={() => setCurrentMode("realworld")}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: currentMode === "realworld" ? '#10b981' : '#ECFDF5',
                  color: currentMode === "realworld" ? 'white' : '#059669',
                  boxShadow: currentMode === "realworld" ? '0 4px 6px rgba(16, 185, 129, 0.3)' : 'none',
                }}
              >
                <span style={{ fontSize: '16px' }}>🌍</span>
                <span>{t('nav.realworld')}</span>
              </button>

              <LanguageSelector />
            </div>

            {/* Mobile Hamburger Button */}
            <button
              className="mobile-hamburger"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                display: 'none',
                flexDirection: 'column',
                gap: '4px',
                padding: '8px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <div style={{ width: '24px', height: '3px', background: '#2563EB', borderRadius: '2px', transition: 'all 0.3s' }} />
              <div style={{ width: '24px', height: '3px', background: '#2563EB', borderRadius: '2px', transition: 'all 0.3s' }} />
              <div style={{ width: '24px', height: '3px', background: '#2563EB', borderRadius: '2px', transition: 'all 0.3s' }} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 40,
            animation: 'fadeIn 0.3s ease',
          }}
        />
      )}

      {/* Mobile Sidebar Menu */}
      <div
        className="mobile-sidebar"
        style={{
          position: 'fixed',
          top: 0,
          right: isMobileMenuOpen ? 0 : '-320px',
          width: '300px',
          height: '100vh',
          background: 'white',
          boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.2)',
          zIndex: 50,
          transition: 'right 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'auto',
          padding: '20px',
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '28px',
            cursor: 'pointer',
            color: '#374151',
            padding: '4px',
            lineHeight: 1,
          }}
        >
          ×
        </button>

        {/* Menu Title */}
        <h3 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#1F2937',
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: '2px solid #E5E7EB',
        }}>
          Menu
        </h3>

        {/* Navigation Links */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          <button
            onClick={() => {
              setCurrentMode("demonstration");
              setIsMobileMenuOpen(false);
            }}
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.2s',
              border: currentMode === "demonstration" ? '2px solid #3b82f6' : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              backgroundColor: currentMode === "demonstration" ? '#3b82f6' : '#EFF6FF',
              color: currentMode === "demonstration" ? 'white' : '#2563EB',
              boxShadow: currentMode === "demonstration" ? '0 4px 6px rgba(59, 130, 246, 0.3)' : 'none',
              width: '100%',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '20px' }}>📚</span>
              <span>{t('nav.learn')}</span>
            </div>
            {currentMode === "demonstration" && (
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>✓</span>
            )}
          </button>

          <button
            onClick={() => {
              setCurrentMode("practice");
              setIsMobileMenuOpen(false);
            }}
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.2s',
              border: currentMode === "practice" ? '2px solid #a855f7' : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              backgroundColor: currentMode === "practice" ? '#a855f7' : '#FAF5FF',
              color: currentMode === "practice" ? 'white' : '#7e22ce',
              boxShadow: currentMode === "practice" ? '0 4px 6px rgba(168, 85, 247, 0.3)' : 'none',
              width: '100%',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '20px' }}>🎯</span>
              <span>{t('nav.practice')}</span>
            </div>
            {currentMode === "practice" && (
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>✓</span>
            )}
          </button>

          <button
            onClick={() => {
              setCurrentMode("realworld");
              setIsMobileMenuOpen(false);
            }}
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.2s',
              border: currentMode === "realworld" ? '2px solid #10b981' : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              backgroundColor: currentMode === "realworld" ? '#10b981' : '#ECFDF5',
              color: currentMode === "realworld" ? 'white' : '#059669',
              boxShadow: currentMode === "realworld" ? '0 4px 6px rgba(16, 185, 129, 0.3)' : 'none',
              width: '100%',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '20px' }}>🌍</span>
              <span>{t('nav.realworld')}</span>
            </div>
            {currentMode === "realworld" && (
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>✓</span>
            )}
          </button>

          {/* Language Selector in Mobile Menu */}
          <div style={{
            marginTop: '20px',
            paddingTop: '20px',
            borderTop: '2px solid #E5E7EB',
          }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#6B7280',
              marginBottom: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Language
            </label>
            <div style={{ position: 'relative' }}>
              <select
                aria-label="Select Language"
                value={language}
                onChange={(e) => {setLanguage(e.target.value as Language); setIsMobileMenuOpen(false)}}
                style={{
                  appearance: 'none',
                  backgroundColor: '#F9FAFB',
                  border: '2px solid #E5E7EB',
                  borderRadius: '12px',
                  padding: '14px 40px 14px 16px',
                  width: '100%',
                  color: '#1F2937',
                  fontWeight: '600',
                  fontSize: '16px',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 0.2s',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.backgroundColor = 'white';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#E5E7EB';
                  e.currentTarget.style.backgroundColor = '#F9FAFB';
                }}
              >
                {[
                  { code: "en", name: "English", flag: "🇬🇧" },
                  { code: "hi", name: "हिंदी", flag: "🇮🇳" },
                  { code: "gu", name: "ગુજરાતી", flag: "🇮🇳" },
                ].map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
              <div style={{
                pointerEvents: 'none',
                position: 'absolute',
                top: '50%',
                right: '16px',
                transform: 'translateY(-50%)',
                display: 'flex',
                alignItems: 'center',
              }}>
                <svg
                  style={{ fill: '#6B7280', height: '16px', width: '16px' }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Realistic 3D Sundial Component with perspective and sun path
const SundialSVG: React.FC<{ hour: number }> = ({ hour }) => {
  // Calculate sun position (moves from left/east to right/west)
  const sunProgress = (hour - 6) / 12; // 0 to 1 from 6AM to 6PM
  const sunX = 60 + sunProgress * 200;
  const sunY = 80 - Math.sin(sunProgress * Math.PI) * 40;

  // Calculate shadow angle and length (OPPOSITE to sun)
  // When sun is on the left (morning), shadow is on the right
  // When sun is on the right (evening), shadow is on the left
  const shadowAngle = -((hour - 12) * 15); // Negative to make it opposite
  const shadowLength = Math.abs(hour - 12) * 8 + 40;

  // Shadow end position
  const shadowRadians = (shadowAngle * Math.PI) / 180;
  const shadowEndX = 160 + Math.sin(shadowRadians) * shadowLength;
  const shadowEndY = 240 + Math.cos(shadowRadians) * shadowLength;

  return (
    <svg
      width="320"
      height="380"
      viewBox="0 0 320 380"
      style={{
        margin: '0 auto',
        display: 'block',
        filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))'
      }}
    >
      <defs>
        <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#87CEEB" />
          <stop offset="100%" stopColor="#E0F6FF" />
        </linearGradient>

        <linearGradient id="groundGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#D4A574" />
          <stop offset="100%" stopColor="#A0826D" />
        </linearGradient>

        <radialGradient id="stoneGradient" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#F5DEB3" />
          <stop offset="70%" stopColor="#D2B48C" />
          <stop offset="100%" stopColor="#C19A6B" />
        </radialGradient>

        <radialGradient id="sunGradient" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="70%" stopColor="#FFA500" />
          <stop offset="100%" stopColor="#FF8C00" />
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect x="0" y="0" width="320" height="180" fill="url(#skyGradient)" />

      {/* Sun with rays */}
      <g>
        <circle
          cx={sunX}
          cy={sunY}
          r="25"
          fill="url(#sunGradient)"
          filter="drop-shadow(0 0 15px rgba(255,215,0,0.6))"
        />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <line
            key={angle}
            x1={sunX}
            y1={sunY}
            x2={sunX + Math.cos((angle * Math.PI) / 180) * 35}
            y2={sunY + Math.sin((angle * Math.PI) / 180) * 35}
            stroke="#FFD700"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.8"
          />
        ))}
      </g>

      {/* Ground */}
      <rect x="0" y="180" width="320" height="200" fill="url(#groundGradient)" />

      {/* Sundial base */}
      <g>
        <circle
          cx="160"
          cy="240"
          r="100"
          fill="url(#stoneGradient)"
          stroke="#8B7355"
          strokeWidth="3"
        />
        <circle
          cx="160"
          cy="240"
          r="85"
          fill="none"
          stroke="#A0826D"
          strokeWidth="1"
          strokeDasharray="5,3"
          opacity="0.4"
        />
      </g>

      {/* Hour markers - stones placed as hours pass (opposite to shadow) */}
      {[6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((h) => {
        if (h > hour) return null;

        const angle = -((h - 12) * 15); // Negative to match shadow direction
        const radians = (angle * Math.PI) / 180;
        const distance = 75;
        const markerX = 160 + Math.sin(radians) * distance;
        const markerY = 240 + Math.cos(radians) * distance;

        return (
          <g key={h}>
            <circle
              cx={markerX}
              cy={markerY}
              r="6"
              fill="#696969"
              stroke="#505050"
              strokeWidth="1"
            />
            <text
              x={markerX}
              y={markerY - 12}
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fill="#2D3748"
            >
              {h > 12 ? h - 12 : h}
            </text>
          </g>
        );
      })}

      {/* Gnomon stick */}
      <g>
        <rect
          x="155"
          y="190"
          width="10"
          height="50"
          fill="#654321"
          stroke="#3E2723"
          strokeWidth="1"
          rx="2"
        />
        <circle
          cx="160"
          cy="190"
          r="6"
          fill="#654321"
          stroke="#3E2723"
          strokeWidth="1"
        />
      </g>

      {/* Shadow */}
      <line
        x1="160"
        y1="240"
        x2={shadowEndX}
        y2={shadowEndY}
        stroke="rgba(0, 0, 0, 0.4)"
        strokeWidth="8"
        strokeLinecap="round"
        filter="drop-shadow(0 1px 2px rgba(0,0,0,0.2))"
      />

      {/* Grass detail */}
      {[40, 80, 120, 200, 240, 280].map((x) => (
        <g key={x}>
          <line x1={x} y1="365" x2={x - 3} y2="375" stroke="#8B7355" strokeWidth="2" opacity="0.4" />
          <line x1={x} y1="365" x2={x + 3} y2="375" stroke="#8B7355" strokeWidth="2" opacity="0.4" />
        </g>
      ))}
    </svg>
  );
};



// Water Clock Component - Ancient Design
const WaterClockSVG: React.FC<{ waterLevel: number }> = ({ waterLevel }) => {
  // Ancient water clock with cylindrical container and spout
  const containerHeight = 180;
  const waterHeight = (waterLevel / 100) * containerHeight;
  const waterTop = 230 - waterHeight;

  // Scale markings
  const hourMarks = 12;

  return (
    <svg width="280" height="300" viewBox="0 0 280 300" style={{ maxWidth: '100%', height: 'auto' }}>
      <defs>
        {/* Water gradient */}
        <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4FC3F7" />
          <stop offset="50%" stopColor="#29B6F6" />
          <stop offset="100%" stopColor="#039BE5" />
        </linearGradient>

        {/* Clay pot gradient */}
        <linearGradient id="clayPotGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#A0522D" />
          <stop offset="50%" stopColor="#CD853F" />
          <stop offset="100%" stopColor="#A0522D" />
        </linearGradient>

        {/* Bronze/metal gradient for bands */}
        <linearGradient id="bronzeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B6914" />
          <stop offset="50%" stopColor="#CD9F4D" />
          <stop offset="100%" stopColor="#8B6914" />
        </linearGradient>

        {/* Shadow */}
        <filter id="dropShadow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
          <feOffset dx="2" dy="3" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Base platform */}
      <ellipse
        cx="140"
        cy="295"
        rx="85"
        ry="12"
        fill="#654321"
        opacity="0.6"
      />
      <ellipse
        cx="140"
        cy="292"
        rx="82"
        ry="10"
        fill="#8B4513"
        stroke="#654321"
        strokeWidth="2"
      />

      {/* Main cylindrical container - clay pot style */}
      <g filter="url(#dropShadow)">
        {/* Pot body */}
        <path
          d="M 70 50 
             Q 70 48, 72 48
             L 208 48
             Q 210 48, 210 50
             L 210 230
             Q 210 235, 205 238
             L 75 238
             Q 70 235, 70 230 Z"
          fill="url(#clayPotGradient)"
          stroke="#8B4513"
          strokeWidth="2"
        />

        {/* Pot rim - top */}
        <ellipse
          cx="140"
          cy="48"
          rx="70"
          ry="8"
          fill="#A0522D"
          stroke="#8B4513"
          strokeWidth="2"
        />
        <ellipse
          cx="140"
          cy="46"
          rx="68"
          ry="7"
          fill="#CD853F"
        />

        {/* Pot base ring */}
        <ellipse
          cx="140"
          cy="238"
          rx="68"
          ry="8"
          fill="#8B4513"
        />
      </g>

      {/* Decorative bronze bands */}
      <g>
        <ellipse cx="140" cy="80" rx="72" ry="4" fill="url(#bronzeGradient)" opacity="0.8" />
        <ellipse cx="140" cy="140" rx="72" ry="4" fill="url(#bronzeGradient)" opacity="0.8" />
        <ellipse cx="140" cy="200" rx="72" ry="4" fill="url(#bronzeGradient)" opacity="0.8" />
      </g>

      {/* Hour markings on the side with Roman numerals style */}
      <g>
        {Array.from({ length: hourMarks }, (_, i) => {
          const y = 50 + (i * (180 / (hourMarks - 1)));
          const isCurrentLevel = waterTop <= y && waterTop >= y - 15;

          return (
            <g key={i}>
              {/* Hour line */}
              <line
                x1="50"
                y1={y}
                x2="65"
                y2={y}
                stroke={isCurrentLevel ? "#D97706" : "#654321"}
                strokeWidth={isCurrentLevel ? "3" : "2"}
              />
              {/* Hour number */}
              <text
                x="40"
                y={y + 5}
                fontSize={isCurrentLevel ? "16" : "14"}
                fontWeight={isCurrentLevel ? "bold" : "600"}
                fill={isCurrentLevel ? "#D97706" : "#654321"}
                textAnchor="end"
              >
                {12 - i}
              </text>
            </g>
          );
        })}
      </g>

      {/* Water inside - with wave effect */}
      <g>
        {/* Main water body */}
        <path
          d={`M 72 ${waterTop} 
              L 208 ${waterTop}
              L 208 230
              Q 208 234, 204 236
              L 76 236
              Q 72 234, 72 230 Z`}
          fill="url(#waterGradient)"
          opacity="0.75"
        />

        {/* Water surface with subtle wave animation */}
        {waterLevel > 5 && (
          <>
            <ellipse
              cx="140"
              cy={waterTop}
              rx="68"
              ry="3"
              fill="#81D4FA"
              opacity="0.5"
            >
              <animate attributeName="rx" values="66;70;66" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;0.3;0.5" dur="3s" repeatCount="indefinite" />
            </ellipse>

            {/* Water shine/reflection */}
            <ellipse
              cx="120"
              cy={waterTop + 20}
              rx="15"
              ry="25"
              fill="white"
              opacity="0.2"
            />
          </>
        )}
      </g>

      {/* Spout at bottom with water dripping */}
      <g>
        {/* Spout structure */}
        <path
          d="M 195 230 L 210 230 L 210 240 Q 210 242, 208 244 L 197 244 Q 195 242, 195 240 Z"
          fill="#8B4513"
          stroke="#654321"
          strokeWidth="2"
        />
        <rect
          x="208"
          y="234"
          width="15"
          height="8"
          rx="2"
          fill="#8B4513"
          stroke="#654321"
          strokeWidth="1.5"
        />

        {/* Collection bowl below */}
        <ellipse
          cx="228"
          cy="285"
          rx="25"
          ry="8"
          fill="#CD853F"
          stroke="#8B4513"
          strokeWidth="2"
        />
        <path
          d="M 203 285 Q 203 295, 228 295 Q 253 295, 253 285"
          fill="url(#clayPotGradient)"
          stroke="#8B4513"
          strokeWidth="2"
        />

        {/* Collected water in bowl */}
        <ellipse
          cx="228"
          cy="287"
          rx="22"
          ry="6"
          fill="url(#waterGradient)"
          opacity="0.7"
        />
      </g>

      {/* Dripping water animation - only if there's water */}
      {waterLevel > 10 && (
        <g>
          {/* Water drops falling */}
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <ellipse
                cx="216"
                cy="260"
                rx="2"
                ry="4"
                fill="#039BE5"
                opacity="0.8"
              >
                <animate
                  attributeName="cy"
                  values="246;278"
                  dur="1.5s"
                  repeatCount="indefinite"
                  begin={`${i * 0.5}s`}
                />
                <animate
                  attributeName="opacity"
                  values="0.8;0"
                  dur="1.5s"
                  repeatCount="indefinite"
                  begin={`${i * 0.5}s`}
                />
              </ellipse>
            </g>
          ))}

          {/* Continuous stream */}
          <line
            x1="216"
            y1="244"
            x2="216"
            y2="270"
            stroke="#4FC3F7"
            strokeWidth="1.5"
            opacity="0.4"
          >
            <animate
              attributeName="opacity"
              values="0.4;0.2;0.4"
              dur="1s"
              repeatCount="indefinite"
            />
          </line>
        </g>
      )}

      {/* Decorative ancient patterns on pot */}
      <g opacity="0.3">
        {/* Geometric pattern */}
        <path
          d="M 80 100 L 90 110 L 80 120 M 100 100 L 110 110 L 100 120 M 120 100 L 130 110 L 120 120"
          stroke="#654321"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M 150 160 L 160 170 L 150 180 M 170 160 L 180 170 L 170 180 M 190 160 L 200 170 L 190 180"
          stroke="#654321"
          strokeWidth="1.5"
          fill="none"
        />
      </g>

      {/* Title label */}
      <text
        x="140"
        y="25"
        fontSize="16"
        fontWeight="bold"
        fill="#654321"
        textAnchor="middle"
      >
        Ancient Water Clock
      </text>

      {/* Water level indicator */}
      {waterLevel > 0 && (
        <g>
          <rect
            x="220"
            y="45"
            width="50"
            height="40"
            rx="6"
            fill="white"
            stroke="#8B4513"
            strokeWidth="2"
            opacity="0.95"
          />
          <text
            x="245"
            y="62"
            fontSize="11"
            fontWeight="600"
            fill="#654321"
            textAnchor="middle"
          >
            Water
          </text>
          <text
            x="245"
            y="77"
            fontSize="16"
            fontWeight="bold"
            fill="#039BE5"
            textAnchor="middle"
          >
            {waterLevel}%
          </text>
        </g>
      )}
    </svg>
  );
};


// Improved Hourglass Component with realistic sand flow
const ImprovedHourglassSVG: React.FC<{ sandLevel: number; isFlipped: boolean }> = ({ sandLevel, isFlipped }) => {
  const topSand = Math.max(0, sandLevel);
  const bottomSand = 100 - sandLevel;

  return (
    <svg
      width="150"
      height="230"
      viewBox="0 0 150 250"
      style={{
        transition: 'transform 0.5s ease',
        transform: isFlipped ? 'rotate(180deg)' : 'rotate(0deg)',
        maxWidth: '100%',
        height: 'auto'
      }}
    >
      <defs>
        {/* Clip paths for precise sand filling */}
        <clipPath id="topChamberClip">
          <path d="M 60 35 L 90 35 L 90 100 L 75 115 L 60 100 Z" />
        </clipPath>
        <clipPath id="bottomChamberClip">
          <path d="M 60 150 L 75 135 L 90 150 L 90 215 L 60 215 Z" />
        </clipPath>
        <linearGradient id="sandGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F4A460" />
          <stop offset="100%" stopColor="#D2691E" />
        </linearGradient>
      </defs>

      {/* Wooden frame top */}
      <rect x="30" y="20" width="90" height="15" rx="3" fill="#8B4513" stroke="#654321" strokeWidth="2" />

      {/* Glass container outline */}
      <path
        d="M 40 35 L 60 35 L 60 100 L 75 115 L 90 100 L 90 35 L 110 35 L 110 215 L 90 215 L 90 150 L 75 135 L 60 150 L 60 215 L 40 215 L 40 35 Z"
        fill="rgba(255, 255, 255, 0.05)"
        stroke="#333"
        strokeWidth="3"
      />

      {/* Top chamber sand - with clipPath for perfect fit */}
      {topSand > 0 && (
        <g clipPath="url(#topChamberClip)">
          <rect
            x="60"
            y={35 + (65 * (100 - topSand) / 100)}
            width="30"
            height={65 * topSand / 100 + 15}
            fill="url(#sandGradient)"
            opacity="0.95"
          />
        </g>
      )}

      {/* Bottom chamber sand - with clipPath for perfect fit */}
      {bottomSand > 0 && (
        <g clipPath="url(#bottomChamberClip)">
          <rect
            x="60"
            y={215 - (65 * bottomSand / 100)}
            width="30"
            height={65 * bottomSand / 100}
            fill="url(#sandGradient)"
            opacity="0.95"
          />
        </g>
      )}

      {/* Falling sand particles */}
      {sandLevel > 0 && sandLevel < 100 && (
        <g>
          <ellipse cx="75" cy="118" rx="2" ry="4" fill="#F4A460" opacity="0.8">
            <animate attributeName="cy" values="118;135" dur="0.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0" dur="0.5s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="73" cy="120" rx="1.5" ry="3" fill="#F4A460" opacity="0.6">
            <animate attributeName="cy" values="120;135" dur="0.6s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0" dur="0.6s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="77" cy="119" rx="1.5" ry="3" fill="#F4A460" opacity="0.6">
            <animate attributeName="cy" values="119;135" dur="0.55s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0" dur="0.55s" repeatCount="indefinite" />
          </ellipse>
        </g>
      )}

      {/* Wooden frame bottom */}
      <rect x="30" y="215" width="90" height="15" rx="3" fill="#8B4513" stroke="#654321" strokeWidth="2" />

      {/* Glass shine effects */}
      <path
        d="M 45 40 L 50 40 L 50 110 L 45 105 Z"
        fill="white"
        opacity="0.2"
      />
      <path
        d="M 45 140 L 50 145 L 50 210 L 45 210 Z"
        fill="white"
        opacity="0.2"
      />
    </svg>
  );
};


// Pendulum Animation Component
const PendulumAnimation: React.FC<{ isSwinging: boolean }> = ({ isSwinging }) => {
  const [angle, setAngle] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (!isSwinging) {
      setAngle(0);
      return;
    }

    const interval = setInterval(() => {
      setAngle((prev) => {
        const maxAngle = 30;
        const newAngle = prev + direction * 2;

        if (newAngle >= maxAngle) {
          setDirection(-1);
          return maxAngle;
        } else if (newAngle <= -maxAngle) {
          setDirection(1);
          return -maxAngle;
        }
        return newAngle;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [isSwinging, direction]);

  return (
    <svg width="200" height="300" viewBox="0 0 200 300" style={{ margin: '0 auto', maxWidth: '100%', height: 'auto' }}>
      {/* Support */}
      <rect x="95" y="20" width="10" height="20" fill="#8B4513" />

      {/* String */}
      <line
        x1="100"
        y1="40"
        x2={100 + Math.sin((angle * Math.PI) / 180) * 100}
        y2={140 + Math.cos((angle * Math.PI) / 180) * 100}
        stroke="#333"
        strokeWidth="2"
      />

      {/* Bob */}
      <circle
        cx={100 + Math.sin((angle * Math.PI) / 180) * 100}
        cy={140 + Math.cos((angle * Math.PI) / 180) * 100}
        r="20"
        fill="#FF6B6B"
        stroke="#333"
        strokeWidth="2"
      />

      {/* Arc showing motion */}
      <path
        d="M 70 240 Q 100 160 130 240"
        fill="none"
        stroke="#94A3B8"
        strokeWidth="1"
        strokeDasharray="5,5"
        opacity="0.5"
      />
    </svg>
  );
};

// Learning Mode Component (continuing in next message due to length...)

// Learning Mode Component
export const TimeMeasurementLearning: React.FC = () => {
  const { t } = useLanguage();
  const [isPendulumSwinging, setIsPendulumSwinging] = useState(false);
  const [sundialHour, setSundialHour] = useState(12);
  const [waterLevel, setWaterLevel] = useState(100);
  const [sandLevel, setSandLevel] = useState(100);
  const [isHourglassFlipped, setIsHourglassFlipped] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setWaterLevel((prev) => {
        if (prev <= 0) return 100;
        return prev - 1;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSandLevel((prev) => {
        if (prev <= 0) {
          setIsHourglassFlipped((f) => !f);
          return 100;
        }
        return prev - 1;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#FFFFFF',
      padding: '16px',
      paddingTop: '80px',
    }}
      className="learning-container"
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* Early Methods Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          padding: '24px',
          marginBottom: '32px',
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#1F2937',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            justifyContent: 'center',
          }}>
            <Sun size={24} color="#FBBF24" />
            {t('early.title')}
          </h2>
          <p style={{ color: '#4B5563', marginBottom: '24px' }}>
            {t('early.subtitle')}
          </p>

          <div className="early-methods-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
              padding: '24px',
              borderRadius: '12px',
              border: '2px solid #FCD34D',
              textAlign: 'center',
              minHeight: '200px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: 'scale(1)',
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05) translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 15px 30px rgba(252, 211, 77, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                fontSize: '48px',
                marginBottom: '12px',
                transition: 'all 0.3s ease',
              }}>🌅</div>
              <h3 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px', color: '#78350F' }}>
                {t('early.sun.title')}
              </h3>
              <p style={{ fontSize: '14px', color: '#92400E' }}>{t('early.sun.desc')}</p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #DBEAFE, #BFDBFE)',
              padding: '24px',
              borderRadius: '12px',
              border: '2px solid #93C5FD',
              textAlign: 'center',
              minHeight: '200px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: 'scale(1)',
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05) translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 15px 30px rgba(147, 197, 253, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                fontSize: '48px',
                marginBottom: '12px',
                transition: 'all 0.3s ease',
              }}>🌙</div>
              <h3 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px', color: '#1E3A8A' }}>
                {t('early.moon.title')}
              </h3>
              <p style={{ fontSize: '14px', color: '#1E40AF' }}>{t('early.moon.desc')}</p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)',
              padding: '24px',
              borderRadius: '12px',
              border: '2px solid #6EE7B7',
              textAlign: 'center',
              minHeight: '200px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: 'scale(1)',
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05) translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 15px 30px rgba(110, 231, 183, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                fontSize: '48px',
                marginBottom: '12px',
                transition: 'all 0.3s ease',
              }}>🍂</div>
              <h3 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px', color: '#064E3B' }}>
                {t('early.seasons.title')}
              </h3>
              <p style={{ fontSize: '14px', color: '#065F46' }}>{t('early.seasons.desc')}</p>
            </div>
          </div>
        </div>

        {/* Ancient Devices with Demonstrations */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          padding: '24px',
          marginBottom: '32px',
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#1F2937',
            marginBottom: '24px',
          }}>
            {t('ancient.title')}
          </h2>

          {/* Device Demonstrations Grid - 3 columns */}
          <div className="ancient-devices-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
          }}>
            {/* Sundial Demo with Card */}
            <div style={{
              background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
              padding: '24px',
              borderRadius: '20px',
              border: '2px solid #FCD34D',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}>
              {/* Icon and Title */}
              <div style={{
                textAlign: 'center',
                marginBottom: '16px',
              }}>
                <div style={{ fontSize: '60px', marginBottom: '8px' }}>🌞</div>
                <h3 style={{
                  fontWeight: 'bold',
                  fontSize: '20px',
                  color: '#78350F',
                  marginBottom: '8px',
                }}>
                  {t('device.sundial')}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#92400E',
                  marginBottom: '16px',
                }}>
                  {t('device.sundial.desc')}
                </p>
              </div>

              {/* Demonstration */}
              <div style={{
                backgroundColor: 'rgba(254, 243, 199, 0.5)',
                padding: '20px',
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '16px',
              }}>
                <SundialSVG hour={sundialHour} />
              </div>
              <div style={{ marginTop: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '12px',
                  textAlign: 'center',
                  color: '#78350F',
                }}>
                  {t('sundial.timeofday')}: {sundialHour}:00
                </label>
                <input
                  type="range"
                  min="6"
                  max="18"
                  value={sundialHour}
                  onChange={(e) => setSundialHour(Number(e.target.value))}
                  style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '4px',
                    background: 'linear-gradient(to right, #A855F7, #EC4899)',
                    outline: 'none',
                    cursor: 'pointer',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                  }}
                />
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '8px',
                  fontSize: '12px',
                  color: '#92400E',
                  fontWeight: '500',
                }}>
                  <span>6 AM</span>
                  <span>12 PM</span>
                  <span>6 PM</span>
                </div>
              </div>
            </div>

            {/* Water Clock Demo with Card */}
            <div style={{
              background: 'linear-gradient(135deg, #DBEAFE, #BFDBFE)',
              padding: '24px',
              borderRadius: '20px',
              border: '2px solid #93C5FD',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}>
              {/* Icon and Title */}
              <div style={{
                textAlign: 'center',
                marginBottom: '16px',
              }}>
                <div style={{ fontSize: '60px', marginBottom: '8px' }}>💧</div>
                <h3 style={{
                  fontWeight: 'bold',
                  fontSize: '20px',
                  color: '#1E3A8A',
                  marginBottom: '8px',
                }}>
                  {t('device.waterclock')}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#1E40AF',
                  marginBottom: '16px',
                }}>
                  {t('device.waterclock.desc')}
                </p>
              </div>

              {/* Demonstration */}
              <div style={{
                backgroundColor: 'rgba(219, 234, 254, 0.5)',
                padding: '20px',
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '12px',
                minHeight: '300px',
              }}>
                <WaterClockSVG waterLevel={waterLevel} />
              </div>
              <p style={{
                fontSize: '16px',
                textAlign: 'center',
                marginTop: '8px',
                color: '#1E40AF',
                fontWeight: '600',
              }}>
                {t('waterclock.level')}: {Math.round(waterLevel)}%
              </p>
            </div>

            {/* Hourglass Demo with Card */}
            <div style={{
              background: 'linear-gradient(135deg, #FED7AA, #FDBA74)',
              padding: '24px',
              borderRadius: '20px',
              border: '2px solid #FB923C',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}>
              {/* Icon and Title */}
              <div style={{
                textAlign: 'center',
                marginBottom: '16px',
              }}>
                <div style={{ fontSize: '60px', marginBottom: '8px' }}>⏳</div>
                <h3 style={{
                  fontWeight: 'bold',
                  fontSize: '20px',
                  color: '#7C2D12',
                  marginBottom: '8px',
                }}>
                  {t('device.hourglass')}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#9A3412',
                  marginBottom: '16px',
                }}>
                  {t('device.hourglass.desc')}
                </p>
              </div>

              {/* Demonstration */}
              <div style={{
                backgroundColor: 'rgba(254, 215, 170, 0.5)',
                padding: '20px',
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '12px',
                minHeight: '260px',
              }}>
                <ImprovedHourglassSVG sandLevel={sandLevel} isFlipped={isHourglassFlipped} />
              </div>
              <p style={{
                fontSize: '16px',
                textAlign: 'center',
                marginTop: '8px',
                color: '#9A3412',
                fontWeight: '600',
              }}>
                {t('hourglass.sand')}: {Math.round(sandLevel)}%
              </p>
            </div>
          </div>
        </div>

        {/* Pendulum Clock Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          padding: '24px',
          marginBottom: '32px',
        }}
          className="pendulum-section"
        >
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#1F2937',
            marginBottom: '16px',
          }}>
            {t('pendulum.title')}
          </h2>
          <p style={{ color: '#4B5563', marginBottom: '24px', fontSize: '15px' }}>
            {t('pendulum.subtitle')}
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}
            className="pendulum-grid"
          >
            {/* Pendulum Animation */}
            <div style={{
              background: 'linear-gradient(135deg, #E9D5FF, #D8B4FE)',
              padding: '20px',
              borderRadius: '16px',
              border: '2px solid #C084FC',
            }}>
              <h3 style={{
                fontWeight: 'bold',
                fontSize: '20px',
                marginBottom: '12px',
                color: '#581C87',
                textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                textAlign: 'center',
              }}>
                {t('pendulum.simple')}
              </h3>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                minHeight: '250px',
              }}>
                <PendulumAnimation isSwinging={isPendulumSwinging} />
              </div>
              <button
                onClick={() => setIsPendulumSwinging(!isPendulumSwinging)}
                style={{
                  width: '100%',
                  marginTop: '12px',
                  padding: '12px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  color: 'white',
                  transition: 'all 0.2s',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: isPendulumSwinging ? '#DC2626' : '#10B981',
                }}
              >
                {isPendulumSwinging ? `⏸ ${t('pendulum.stop')}` : `▶ ${t('pendulum.start')}`}
              </button>
            </div>

            {/* Pendulum Explanation */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="pendulum-info">
              <div style={{
                backgroundColor: '#DBEAFE',
                padding: '16px',
                borderRadius: '8px',
                borderLeft: '4px solid #3B82F6',
              }}
                className="info-card"
              >
                <h4 style={{
                  fontWeight: 'bold',
                  marginBottom: '8px',
                  color: '#1E3A8A',
                  fontSize: '16px',
                }}>
                  {t('pendulum.components')}
                </h4>
                <ul style={{ fontSize: '14px', color: '#1E40AF', paddingLeft: '20px', lineHeight: '1.6' }}>
                  <li style={{ marginBottom: '8px' }}>{t('pendulum.bob')}</li>
                  <li>{t('pendulum.string')}</li>
                </ul>
              </div>

              <div style={{
                backgroundColor: '#E9D5FF',
                padding: '16px',
                borderRadius: '8px',
                borderLeft: '4px solid #A855F7',
              }}
                className="info-card"
              >
                <h4 style={{
                  fontWeight: 'bold',
                  marginBottom: '8px',
                  color: '#6B21A8',
                  fontSize: '16px',
                }}>
                  {t('pendulum.keyterms')}
                </h4>
                <ul style={{ fontSize: '14px', color: '#7C3AED', paddingLeft: '20px', lineHeight: '1.6' }}>
                  <li style={{ marginBottom: '8px' }}>{t('pendulum.oscillation')}</li>
                  <li>{t('pendulum.timeperiod')}</li>
                </ul>
              </div>

              <div style={{
                backgroundColor: '#D1FAE5',
                padding: '16px',
                borderRadius: '8px',
                borderLeft: '4px solid #10B981',
              }}
                className="info-card"
              >
                <h4 style={{
                  fontWeight: 'bold',
                  marginBottom: '8px',
                  color: '#065F46',
                  fontSize: '16px',
                }}>
                  {t('pendulum.facts')}
                </h4>
                <ul style={{ fontSize: '14px', color: '#047857', paddingLeft: '20px', lineHeight: '1.6' }}>
                  <li style={{ marginBottom: '8px' }}>✓ {t('pendulum.fact1')}</li>
                  <li>✓ {t('pendulum.fact2')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* SI Unit Section */}
        <div style={{
          background: 'linear-gradient(135deg, #14B8A6, #3B82F6)',
          color: 'white',
          borderRadius: '16px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          padding: '24px',
          marginBottom: '32px',
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '16px',
          }}>
            {t('si.title')}
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '20px',
          }}>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              padding: '24px',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: 'scale(1)',
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05) translateY(-5px)';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0)';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '8px' }}>⏱️</div>
              <h3 style={{ fontWeight: 'bold', fontSize: '20px', marginBottom: '8px' }}>
                {t('si.second')}
              </h3>
              <p style={{ fontSize: '14px', opacity: 0.9 }}>{t('si.second.desc')}</p>
            </div>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              padding: '24px',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: 'scale(1)',
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05) translateY(-5px)';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0)';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '8px' }}>⏰</div>
              <h3 style={{ fontWeight: 'bold', fontSize: '20px', marginBottom: '8px' }}>
                {t('si.minute')}
              </h3>
              <p style={{ fontSize: '14px', opacity: 0.9 }}>{t('si.minute.desc')}</p>
            </div>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              padding: '24px',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: 'scale(1)',
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05) translateY(-5px)';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0)';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '8px' }}>🕐</div>
              <h3 style={{ fontWeight: 'bold', fontSize: '20px', marginBottom: '8px' }}>
                {t('si.hour')}
              </h3>
              <p style={{ fontSize: '14px', opacity: 0.9 }}>{t('si.hour.desc')}</p>
            </div>
          </div>
        </div>

        {/* Importance Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          padding: '24px',
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#1F2937',
            marginBottom: '16px',
          }}>
            {t('importance.title')}
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '16px',
          }}>
            {[
              { icon: '🏃', text: t('importance.sports') },
              { icon: '💊', text: t('importance.medicine') },
              { icon: '🔬', text: t('importance.science') },
              { icon: '🏠', text: t('importance.daily') }
            ].map((item, idx) => (
              <div key={idx} style={{
                background: 'linear-gradient(135deg, #F9FAFB, #F3F4F6)',
                padding: '16px',
                borderRadius: '12px',
                textAlign: 'center',
                border: '1px solid #E5E7EB',
                transition: 'all 0.2s',
                cursor: 'pointer',
              }}>
                <div style={{ fontSize: '36px', marginBottom: '8px' }}>{item.icon}</div>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#4B5563' }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Real World Applications Component
export const TimeMeasurementRealWorld: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F9FAFB',
      padding: '16px',
      paddingTop: '80px',
    }}
      className="realworld-container"
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '48px',
        }}>
          <h1 style={{
            fontSize: '42px',
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #10b981, #059669)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '16px',
          }}>
            {t('realworld.title')}
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#6B7280',
            maxWidth: '800px',
            margin: '0 auto',
          }}>
            {t('realworld.subtitle')}
          </p>
        </div>

        {/* Real World Applications Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
        }}>
          {/* GPS Navigation */}
          <div style={{
            background: 'white',
            padding: '32px',
            borderRadius: '16px',
            border: '3px solid #818CF8',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(129, 140, 248, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={{
              fontSize: '64px',
              marginBottom: '16px',
              textAlign: 'center',
            }}>🛰️</div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#4338CA',
              marginBottom: '16px',
              textAlign: 'center',
            }}>
              {t('realworld.gps')}
            </h3>
            <p style={{
              fontSize: '16px',
              color: '#4B5563',
              lineHeight: '1.8',
              textAlign: 'center',
            }}>
              {t('realworld.gps.desc')}
            </p>
          </div>

          {/* Internet & Computers */}
          <div style={{
            background: 'white',
            padding: '32px',
            borderRadius: '16px',
            border: '3px solid #5EEAD4',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(94, 234, 212, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={{
              fontSize: '64px',
              marginBottom: '16px',
              textAlign: 'center',
            }}>💻</div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#0F766E',
              marginBottom: '16px',
              textAlign: 'center',
            }}>
              {t('realworld.internet')}
            </h3>
            <p style={{
              fontSize: '16px',
              color: '#4B5563',
              lineHeight: '1.8',
              textAlign: 'center',
            }}>
              {t('realworld.internet.desc')}
            </p>
          </div>

          {/* Stock Trading */}
          <div style={{
            background: 'white',
            padding: '32px',
            borderRadius: '16px',
            border: '3px solid #FCD34D',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(252, 211, 77, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={{
              fontSize: '64px',
              marginBottom: '16px',
              textAlign: 'center',
            }}>📈</div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#92400E',
              marginBottom: '16px',
              textAlign: 'center',
            }}>
              {t('realworld.finance')}
            </h3>
            <p style={{
              fontSize: '16px',
              color: '#4B5563',
              lineHeight: '1.8',
              textAlign: 'center',
            }}>
              {t('realworld.finance.desc')}
            </p>
          </div>

          {/* Air Traffic Control */}
          <div style={{
            background: 'white',
            padding: '32px',
            borderRadius: '16px',
            border: '3px solid #60A5FA',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(96, 165, 250, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={{
              fontSize: '64px',
              marginBottom: '16px',
              textAlign: 'center',
            }}>✈️</div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#1E40AF',
              marginBottom: '16px',
              textAlign: 'center',
            }}>
              {t('realworld.aviation')}
            </h3>
            <p style={{
              fontSize: '16px',
              color: '#4B5563',
              lineHeight: '1.8',
              textAlign: 'center',
            }}>
              {t('realworld.aviation.desc')}
            </p>
          </div>

          {/* Mobile Networks */}
          <div style={{
            background: 'white',
            padding: '32px',
            borderRadius: '16px',
            border: '3px solid #F9A8D4',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(249, 168, 212, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={{
              fontSize: '64px',
              marginBottom: '16px',
              textAlign: 'center',
            }}>📱</div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#9F1239',
              marginBottom: '16px',
              textAlign: 'center',
            }}>
              {t('realworld.telecom')}
            </h3>
            <p style={{
              fontSize: '16px',
              color: '#4B5563',
              lineHeight: '1.8',
              textAlign: 'center',
            }}>
              {t('realworld.telecom.desc')}
            </p>
          </div>

          {/* Space Missions */}
          <div style={{
            background: 'white',
            padding: '32px',
            borderRadius: '16px',
            border: '3px solid #A5B4FC',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(165, 180, 252, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={{
              fontSize: '64px',
              marginBottom: '16px',
              textAlign: 'center',
            }}>🚀</div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#3730A3',
              marginBottom: '16px',
              textAlign: 'center',
            }}>
              {t('realworld.space')}
            </h3>
            <p style={{
              fontSize: '16px',
              color: '#4B5563',
              lineHeight: '1.8',
              textAlign: 'center',
            }}>
              {t('realworld.space.desc')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Practice Question Interface
interface PracticeQuestion {
  id: string;
  question: { en: string; hi: string; gu: string };
  type: 'mcq' | 'true-false';
  options: { en: string[]; hi: string[]; gu: string[] };
  correctAnswer: string;
  explanation: { en: string; hi: string; gu: string };
}

// Practice Mode Component
export const TimeMeasurementPractice: React.FC = () => {
  const { t, language } = useLanguage();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const practiceQuestions: PracticeQuestion[] = [
    {
      id: 'q1',
      question: {
        en: 'What is the SI unit of time?',
        hi: 'समय की SI इकाई क्या है?',
        gu: 'સમયનો SI એકમ શું છે?'
      },
      type: 'mcq',
      options: {
        en: ['Minute', 'Hour', 'Second', 'Day'],
        hi: ['मिनट', 'घंटा', 'सेकंड', 'दिन'],
        gu: ['મિનિટ', 'કલાક', 'સેકંડ', 'દિવસ']
      },
      correctAnswer: 'Second',
      explanation: {
        en: 'The SI (International System) unit of time is the second (s).',
        hi: 'समय की SI (अंतर्राष्ट्रीय प्रणाली) इकाई सेकंड (s) है।',
        gu: 'સમયનો SI (આંતરરાષ્ટ્રીય પ્રણાલી) એકમ સેકંડ (s) છે.'
      }
    },
    {
      id: 'q2',
      question: {
        en: 'Which device measures time using the shadow formed by sunlight?',
        hi: 'कौन सा उपकरण सूर्य के प्रकाश से बनी छाया का उपयोग करके समय मापता है?',
        gu: 'કયું ઉપકરણ સૂર્યપ્રકાશથી બનેલ પડછાયાનો ઉપયોગ કરીને સમય માપે છે?'
      },
      type: 'mcq',
      options: {
        en: ['Water clock', 'Sundial', 'Hourglass', 'Pendulum clock'],
        hi: ['जलघड़ी', 'धूपघड़ी', 'रेतघड़ी', 'पेंडुलम घड़ी'],
        gu: ['પાણીઘડિયાળ', 'સૂર્યઘડિયાળ', 'રેતીઘડિયાળ', 'લોલક ઘડિયાળ']
      },
      correctAnswer: 'Sundial',
      explanation: {
        en: 'A sundial measures time using the shadow of an object (gnomon) formed by sunlight.',
        hi: 'धूपघड़ी सूर्य के प्रकाश से बनी किसी वस्तु (गोमन) की छाया का उपयोग करके समय मापती है।',
        gu: 'સૂર્યઘડિયાળ સૂર્યપ્રકાશથી બનેલ વસ્તુ (ગ્નોમોન)ના પડછાયાનો ઉપયોગ કરીને સમય માપે છે.'
      }
    },
    {
      id: 'q3',
      question: {
        en: 'What is one complete to-and-fro movement of a pendulum called?',
        hi: 'पेंडुलम की एक पूर्ण आगे-पीछे की गति को क्या कहते हैं?',
        gu: 'લોલકની એક સંપૂર્ણ આગળ-પાછળની ગતિને શું કહેવાય છે?'
      },
      type: 'mcq',
      options: {
        en: ['Vibration', 'Revolution', 'Rotation', 'Oscillation'],
        hi: ['कंपन', 'परिक्रमण', 'घूर्णन', 'दोलन'],
        gu: ['કંપન', 'પરિક્રમા', 'પરિભ્રમણ', 'દોલન']
      },
      correctAnswer: 'Oscillation',
      explanation: {
        en: 'One complete to-and-fro movement of a pendulum is called one oscillation.',
        hi: 'पेंडुलम की एक पूर्ण आगे-पीछे की गति को एक दोलन कहते हैं।',
        gu: 'લોલકની એક સંપૂર્ણ આગળ-પાછળની ગતિને એક દોલન કહે છે.'
      }
    },
    {
      id: 'q4',
      question: {
        en: 'The time period of a pendulum depends on the mass of the bob.',
        hi: 'पेंडुलम का आवर्तकाल बोब के द्रव्यमान पर निर्भर करता है।',
        gu: 'લોલકનો સમયગાળો બોબના દળ પર આધારિત છે.'
      },
      type: 'true-false',
      options: {
        en: ['True', 'False'],
        hi: ['सत्य', 'असत्य'],
        gu: ['સાચું', 'ખોટું']
      },
      correctAnswer: 'False',
      explanation: {
        en: 'False. The time period of a pendulum depends on the length of the string, NOT on the mass of the bob.',
        hi: 'असत्य। पेंडुलम का आवर्तकाल धागे की लंबाई पर निर्भर करता है, बोब के द्रव्यमान पर नहीं।',
        gu: 'ખોટું. લોલકનો સમયગાળો દોરીની લંબાઈ પર આધારિત છે, બોબના દળ પર નહીં.'
      }
    },
    {
      id: 'q5',
      question: {
        en: 'How many seconds are there in one minute?',
        hi: 'एक मिनट में कितने सेकंड होते हैं?',
        gu: 'એક મિનિટમાં કેટલા સેકંડ હોય છે?'
      },
      type: 'mcq',
      options: {
        en: ['60', '30', '100', '120'],
        hi: ['60', '30', '100', '120'],
        gu: ['60', '30', '100', '120']
      },
      correctAnswer: '60',
      explanation: {
        en: 'There are 60 seconds in one minute.',
        hi: 'एक मिनट में 60 सेकंड होते हैं।',
        gu: 'એક મિનિટમાં 60 સેકંડ હોય છે.'
      }
    },
    {
      id: 'q6',
      question: {
        en: 'Which ancient device measures time using flowing water?',
        hi: 'कौन सा प्राचीन उपकरण बहते पानी का उपयोग करके समय मापता है?',
        gu: 'કયું પ્રાચીન ઉપકરણ વહેતા પાણીનો ઉપયોગ કરીને સમય માપે છે?'
      },
      type: 'mcq',
      options: {
        en: ['Sundial', 'Pendulum', 'Hourglass', 'Water clock'],
        hi: ['धूपघड़ी', 'पेंडुलम', 'रेतघड़ी', 'जलघड़ी'],
        gu: ['સૂર્યઘડિયાળ', 'લોલક', 'રેતઘડિયાળ', 'પાણીઘડિયાળ']
      },
      correctAnswer: 'Water clock',
      explanation: {
        en: 'A water clock measures time by the flow of water from one container to another.',
        hi: 'जलघड़ी एक पात्र से दूसरे में पानी के प्रवाह से समय मापती है।',
        gu: 'પાણીઘડિયાળ એક પાત્રમાંથી બીજામાં પાણીના પ્રવાહ દ્વારા સમય માપે છે.'
      }
    },
    {
      id: 'q7',
      question: {
        en: 'What does the time period of a pendulum primarily depend on?',
        hi: 'पेंडुलम का आवर्तकाल मुख्य रूप से किस पर निर्भर करता है?',
        gu: 'લોલકનો સમયગાળો મુખ્યત્વે શેના પર આધાર રાખે છે?'
      },
      type: 'mcq',
      options: {
        en: ['Length of the string', 'Mass of the bob', 'Color of the bob', 'Temperature'],
        hi: ['धागे की लंबाई', 'बोब का द्रव्यमान', 'बोब का रंग', 'तापमान'],
        gu: ['તારની લંબાઈ', 'બોબનો દળ', 'બોબનો રંગ', 'તાપમાન']
      },
      correctAnswer: 'Length of the string',
      explanation: {
        en: 'The time period of a pendulum depends on the length of the string, not on the mass of the bob.',
        hi: 'पेंडुलम का आवर्तकाल धागे की लंबाई पर निर्भर करता है, बोब के द्रव्यमान पर नहीं।',
        gu: 'લોલકનો સમયગાળો તારની લંબાઈ પર આધાર રાખે છે, બોબના દળ પર નહીં.'
      }
    },
    {
      id: 'q8',
      question: {
        en: 'How many minutes are there in one hour?',
        hi: 'एक घंटे में कितने मिनट होते हैं?',
        gu: 'એક કલાકમાં કેટલી મિનિટ હોય છે?'
      },
      type: 'mcq',
      options: {
        en: ['30', '24', '60', '100'],
        hi: ['30', '24', '60', '100'],
        gu: ['30', '24', '60', '100']
      },
      correctAnswer: '60',
      explanation: {
        en: 'There are 60 minutes in one hour.',
        hi: 'एक घंटे में 60 मिनट होते हैं।',
        gu: 'એક કલાકમાં 60 મિનિટ હોય છે.'
      }
    },
    {
      id: 'q9',
      question: {
        en: 'Which device uses sand to measure time?',
        hi: 'कौन सा उपकरण समय मापने के लिए रेत का उपयोग करता है?',
        gu: 'કયું ઉપકરણ સમય માપવા માટે રેતનો ઉપયોગ કરે છે?'
      },
      type: 'mcq',
      options: {
        en: ['Hourglass', 'Sundial', 'Water clock', 'Pendulum'],
        hi: ['रेतघड़ी', 'धूपघड़ी', 'जलघड़ी', 'पेंडुलम'],
        gu: ['રેતઘડિયાળ', 'સૂર્યઘડિયાળ', 'પાણીઘડિયાળ', 'લોલક']
      },
      correctAnswer: 'Hourglass',
      explanation: {
        en: 'An hourglass measures time using flowing sand from one chamber to another.',
        hi: 'रेतघड़ी एक कक्ष से दूसरे में बहती रेत का उपयोग करके समय मापती है।',
        gu: 'રેતઘડિયાળ એક ખંડમાંથી બીજામાં વહેતી રેત દ્વારા સમય માપે છે.'
      }
    },
    {
      id: 'q10',
      question: {
        en: 'What did ancient people observe to measure time before clocks were invented?',
        hi: 'घड़ियों के आविष्कार से पहले प्राचीन लोग समय मापने के लिए क्या देखते थे?',
        gu: 'ઘડિયાળોની શોધ પહેલાં પ્રાચીન લોકો સમય માપવા માટે શું નિરીક્ષણ કરતા હતા?'
      },
      type: 'mcq',
      options: {
        en: ['Mobile phones', 'Digital watches', 'Computers', 'Natural events like sunrise and seasons'],
        hi: ['मोबाइल फोन', 'डिजिटल घड़ियां', 'कंप्यूटर', 'सूर्योदय और मौसम जैसी प्राकृतिक घटनाएं'],
        gu: ['મોબાઇલ ફોન', 'ડિજિટલ ઘડિયાળો', 'કમ્પ્યુટર', 'સૂર્યોદય અને ઋતુઓ જેવી પ્રાકૃતિક ઘટનાઓ']
      },
      correctAnswer: 'Natural events like sunrise and seasons',
      explanation: {
        en: 'Ancient people observed natural events that repeat regularly, such as sunrise, sunset, phases of the moon, and change of seasons.',
        hi: 'प्राचीन लोग नियमित रूप से दोहराई जाने वाली प्राकृतिक घटनाओं का अवलोकन करते थे, जैसे सूर्योदय, सूर्यास्त, चंद्रमा की कलाएं और मौसम का परिवर्तन।',
        gu: 'પ્રાચીન લોકો નિયમિત પુનરાવર્તિત પ્રાકૃતિક ઘટનાઓનું નિરીક્ષણ કરતા હતા, જેમ કે સૂર્યોદય, સૂર્યાસ્ત, ચંદ્રની કળાઓ અને ઋતુઓનો પરિવર્તન.'
      }
    }
  ];

  const question = practiceQuestions[currentQuestion];

  const handleSubmit = () => {
    if (!isSubmitted && selectedAnswer) {
      setIsSubmitted(true);
      const correctAnswerText = question.options[language][question.options.en.indexOf(question.correctAnswer)];
      if (selectedAnswer === correctAnswerText) {
        setScore(score + 1);
      }
    }
  };

  const handleNext = () => {
    if (currentQuestion < practiceQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
      setIsSubmitted(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer('');
      setIsSubmitted(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const correctAnswerText = question.options[language][question.options.en.indexOf(question.correctAnswer)];
  const isCorrect = selectedAnswer === correctAnswerText;
  const progress = ((currentQuestion + 1) / practiceQuestions.length) * 100;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F9FAFB',
      padding: '16px',
      paddingTop: '80px',
    }}
      className="practice-container"
    >
      <div style={{ width: '600px', maxWidth: '100%', margin: '0 auto' }} className="practice-content">
        {/* Progress Bar */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          padding: '24px',
          marginBottom: '24px',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
          }}>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#4B5563' }}>
              {t('practice.progress')} {currentQuestion + 1} {t('practice.of')} {practiceQuestions.length}
            </span>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#9333EA' }}>
              {t('practice.score')} {score}/{currentQuestion + (isSubmitted ? 1 : 0)}
            </span>
          </div>
          <div style={{
            width: '100%',
            backgroundColor: '#E5E7EB',
            borderRadius: '9999px',
            height: '12px',
          }}>
            <div
              style={{
                background: 'linear-gradient(to right, #9333EA, #EC4899)',
                height: '12px',
                borderRadius: '9999px',
                transition: 'all 0.3s',
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          padding: '32px',
        }}>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
            <div style={{
              flexShrink: 0,
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #9333EA, #EC4899)',
              color: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '20px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            }}>
              {currentQuestion + 1}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{
                fontWeight: 'bold',
                color: '#1F2937',
                fontSize: '20px',
              }}>
                {question.question[language]}
              </p>
            </div>
          </div>

          {/* Options */}
          <div style={{ marginBottom: '24px' }}>
            {question.options[language].map((option, index) => {
              const isSelected = selectedAnswer === option;
              const showResult = isSubmitted && isSelected;
              const isCorrectOption = option === correctAnswerText;
              const showCorrectMark = isSubmitted && !isSelected && isCorrectOption;

              return (
                <button
                  key={index}
                  onClick={() => !isSubmitted && setSelectedAnswer(option)}
                  disabled={isSubmitted}
                  style={{
                    width: '100%',
                    minHeight: '70px',
                    padding: '20px 24px',
                    borderRadius: '12px',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                    marginBottom: '16px',
                    border: showResult
                      ? isCorrect
                        ? '3px solid #10B981'
                        : '3px solid #EF4444'
                      : showCorrectMark
                        ? '3px solid #10B981'
                        : isSelected
                          ? '3px solid #9333EA'
                          : '2px solid #D1D5DB',
                    backgroundColor: showResult
                      ? isCorrect
                        ? '#D1FAE5'
                        : '#FEE2E2'
                      : showCorrectMark
                        ? '#D1FAE5'
                        : isSelected
                          ? '#F3E8FF'
                          : 'white',
                    cursor: isSubmitted ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '16px',
                    fontWeight: '500',
                    color: showResult
                      ? isCorrect ? '#065F46' : '#991B1B'
                      : showCorrectMark
                        ? '#065F46'
                        : isSelected ? '#581C87' : '#374151',
                    boxShadow: isSelected && !isSubmitted ? '0 4px 6px -1px rgba(147, 51, 234, 0.2)' : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitted) {
                      e.currentTarget.style.transform = 'translateX(4px)';
                      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(147, 51, 234, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitted) {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.boxShadow = isSelected ? '0 4px 6px -1px rgba(147, 51, 234, 0.2)' : 'none';
                    }
                  }}
                >
                  <span style={{
                    fontWeight: isSelected || showCorrectMark ? 'bold' : '500',
                    fontSize: '17px',
                    flex: 1,
                  }}>
                    {option}
                  </span>
                  <span style={{
                    minWidth: '32px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    {showResult && (
                      isCorrect ? (
                        <CheckCircle size={28} color="#10B981" strokeWidth={2.5} />
                      ) : (
                        <XCircle size={28} color="#EF4444" strokeWidth={2.5} />
                      )
                    )}
                    {showCorrectMark && (
                      <CheckCircle size={28} color="#10B981" strokeWidth={2.5} />
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Submit Button */}
          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={!selectedAnswer}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                fontWeight: 'bold',
                color: 'white',
                fontSize: '18px',
                transition: 'all 0.2s',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                border: 'none',
                cursor: selectedAnswer ? 'pointer' : 'not-allowed',
                background: selectedAnswer
                  ? 'linear-gradient(to right, #9333EA, #EC4899)'
                  : '#D1D5DB',
              }}
            >
              {selectedAnswer ? t('practice.check') : t('practice.select')}
            </button>
          ) : (
            <div
              style={{
                padding: '24px',
                borderRadius: '12px',
                border: '2px solid',
                borderColor: isCorrect ? '#10B981' : '#F59E0B',
                backgroundColor: isCorrect ? '#D1FAE5' : '#FED7AA',
                marginBottom: '24px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'start', gap: '16px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    backgroundColor: isCorrect ? '#10B981' : '#F59E0B',
                  }}
                >
                  {isCorrect ? (
                    <CheckCircle size={24} color="white" />
                  ) : (
                    <XCircle size={24} color="white" />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontWeight: 'bold',
                    color: '#1F2937',
                    marginBottom: '8px',
                    fontSize: '18px',
                  }}>
                    {isCorrect ? t('practice.correct') : t('practice.incorrect')}
                  </p>
                  <p style={{ color: '#4B5563' }}>
                    {question.explanation[language]}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '12px',
                fontWeight: 'bold',
                fontSize: '16px',
                color: currentQuestion === 0 ? '#9CA3AF' : '#4B5563',
                backgroundColor: currentQuestion === 0 ? '#F3F4F6' : '#E5E7EB',
                border: 'none',
                cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer',
                opacity: currentQuestion === 0 ? 0.5 : 1,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (currentQuestion !== 0) {
                  e.currentTarget.style.backgroundColor = '#D1D5DB';
                }
              }}
              onMouseLeave={(e) => {
                if (currentQuestion !== 0) {
                  e.currentTarget.style.backgroundColor = '#E5E7EB';
                }
              }}
            >
              ← {t('practice.previous')}
            </button>
            <button
              onClick={handleNext}
              disabled={currentQuestion >= practiceQuestions.length - 1 || !isSubmitted}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '12px',
                fontWeight: 'bold',
                fontSize: '16px',
                color: 'white',
                background: (currentQuestion >= practiceQuestions.length - 1 || !isSubmitted)
                  ? '#D1D5DB'
                  : 'linear-gradient(to right, #9333EA, #EC4899)',
                boxShadow: isSubmitted && currentQuestion < practiceQuestions.length - 1
                  ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                border: 'none',
                cursor: (currentQuestion >= practiceQuestions.length - 1 || !isSubmitted)
                  ? 'not-allowed'
                  : 'pointer',
                opacity: (currentQuestion >= practiceQuestions.length - 1 || !isSubmitted) ? 0.5 : 1,
              }}
            >
              {t('practice.next')} <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Completion Message */}
        {currentQuestion === practiceQuestions.length - 1 && isSubmitted && (
          <div style={{
            marginTop: '24px',
            background: 'linear-gradient(to right, #9333EA, #EC4899)',
            color: 'white',
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            padding: '32px',
            textAlign: 'center',
          }}>
            <h2 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '16px' }}>
              {t('practice.complete')}
            </h2>
            <p style={{ fontSize: '20px', marginBottom: '8px' }}>
              {t('practice.complete.sub')}
            </p>
            <p style={{ fontSize: '28px', fontWeight: 'bold' }}>
              {t('practice.finalscore')} {score} / {practiceQuestions.length}
            </p>
            <p style={{ marginTop: '16px', fontSize: '18px' }}>
              {score === practiceQuestions.length
                ? t('practice.perfect')
                : score >= practiceQuestions.length * 0.7
                  ? t('practice.great')
                  : t('practice.good')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Component
export const MeasurementOfTime: React.FC = () => {
  const { currentMode } = useMode();

  return (
    <>
      <Navbar />
      {currentMode === 'practice' ? (
        <TimeMeasurementPractice />
      ) : currentMode === 'realworld' ? (
        <TimeMeasurementRealWorld />
      ) : (
        <TimeMeasurementLearning />
      )}
    </>
  );
};

// App Wrapper Component
const MeasurementOfTimeApp: React.FC = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Gujarati:wght@400;500;600;700&display=swap');
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        body {
          overflow-x: hidden;
          background-color: #FFFFFF !important;
        }
        
        html {
          background-color: #FFFFFF !important;
        }
        
        /* Improved Gujarati text rendering */
        html[lang="gu"],
        html[lang="gu"] * {
          font-family: 'Noto Sans Gujarati', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
          font-weight: 500 !important;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }
        
        html[lang="gu"] h1,
        html[lang="gu"] h2,
        html[lang="gu"] h3 {
          font-weight: 700 !important;
          letter-spacing: 0.02em;
        }
        
        html[lang="gu"] p,
        html[lang="gu"] span,
        html[lang="gu"] div {
          font-weight: 500 !important;
          line-height: 1.7 !important;
        }
        
        /* Fix text overflow for all languages */
        h1, h2, h3, h4, h5, h6, p, span, div {
          word-wrap: break-word;
          overflow-wrap: break-word;
          hyphens: auto;
        }
        
        /* Custom range slider styling */
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
        }
        
        input[type="range"]::-webkit-slider-track {
          height: 8px;
          border-radius: 4px;
          background: linear-gradient(to right, #A855F7, #EC4899);
        }
        
        input[type="range"]::-moz-range-track {
          height: 8px;
          border-radius: 4px;
          background: linear-gradient(to right, #A855F7, #EC4899);
        }
        
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #9333EA;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #9333EA;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
        }
        
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 8px rgba(147, 51, 234, 0.4);
        }
        
        input[type="range"]::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 8px rgba(147, 51, 234, 0.4);
        }
        
        /* Responsive breakpoints */
        @media (max-width: 1024px) {
          /* 3 column grids become 2 columns on tablets */
          [style*="gridTemplateColumns: repeat(3, 1fr)"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        
        @media (max-width: 768px) {
          /* 2-3 column grids become 1 column on mobile */
          [style*="gridTemplateColumns: repeat(3, 1fr)"],
          [style*="gridTemplateColumns: repeat(2, 1fr)"] {
            grid-template-columns: 1fr !important;
          }
        }
        
        @media (max-width: 640px) {
          nav {
            padding: 0 12px !important;
          }
          
          nav > div > div {
            height: 56px !important;
          }
          
          button {
            font-size: 12px !important;
            padding: 6px 12px !important;
          }
          
          select {
            min-width: 100px !important;
            font-size: 12px !important;
          }
          
          h1 {
            font-size: 28px !important;
          }
          
          h2 {
            font-size: 22px !important;
          }
        }
        
        @media (max-width: 480px) {
          h1 {
            font-size: 24px !important;
          }
          
          h2 {
            font-size: 20px !important;
          }
          
          h3 {
            font-size: 16px !important;
          }
          
          p {
            font-size: 14px !important;
          }
        }
        
        /* Very small screens (below 425px) */
        @media (max-width: 425px) {
          body {
            overflow-x: hidden !important;
          }
          
          h1 {
            font-size: 22px !important;
            line-height: 1.3 !important;
          }
          
          h2 {
            font-size: 18px !important;
            line-height: 1.3 !important;
          }
          
          h3 {
            font-size: 15px !important;
            line-height: 1.3 !important;
          }
          
          p {
            font-size: 13px !important;
            line-height: 1.5 !important;
          }
          
          button {
            font-size: 13px !important;
            padding: 8px 14px !important;
            border-radius: 8px !important;
          }
          
          /* Ensure all sections have proper padding */
          section,
          main > div > div {
            padding: 12px !important;
          }
          
          /* Cards and containers */
          div[style*="padding: '24px'"],
          div[style*="padding: '32px'"] {
            padding: 14px !important;
          }
          
          /* Grids */
          div[style*="gap: '24px'"],
          div[style*="gap: '20px'"] {
            gap: 12px !important;
          }
          
          /* SVG containers */
          svg {
            max-width: 100% !important;
            height: auto !important;
          }
          
          /* Practice container */
          .practice-container {
            padding: 8px !important;
            padding-top: 72px !important;
          }
          
          .practice-content {
            width: 100% !important;
            padding: 0 4px !important;
          }
          
          /* Practice question cards */
          .practice-content > div {
            padding: 16px !important;
            border-radius: 12px !important;
          }
          
          /* Question options */
          .practice-content button[style*="minHeight"] {
            min-height: 56px !important;
            padding: 14px 16px !important;
            font-size: 14px !important;
          }
          
          /* Real World container */
          .realworld-container {
            padding: 8px !important;
            padding-top: 72px !important;
          }
          
          .realworld-container h1 {
            font-size: 28px !important;
          }
          
          .realworld-container h3 {
            font-size: 18px !important;
          }
          
          .realworld-container p {
            font-size: 14px !important;
            line-height: 1.6 !important;
          }
          
          /* Real World cards grid */
          .realworld-container > div > div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          
          .realworld-container > div > div[style*="gridTemplateColumns"] > div {
            padding: 20px !important;
          }
        }
        
        /* Ultra small screens (below 375px - iPhone SE) */
        @media (max-width: 375px) {
          h1 {
            font-size: 20px !important;
          }
          
          h2 {
            font-size: 17px !important;
          }
          
          h3 {
            font-size: 14px !important;
          }
          
          p, li {
            font-size: 12px !important;
          }
          
          button {
            font-size: 12px !important;
            padding: 8px 12px !important;
          }
        }
      `}</style>
      <LanguageProvider>
        <ModeProvider>
          <MeasurementOfTime />
        </ModeProvider>
      </LanguageProvider>
    </>
  );
};

export default MeasurementOfTimeApp;