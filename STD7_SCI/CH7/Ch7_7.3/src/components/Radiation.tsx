import React, { useState, useEffect, useRef, createContext, useContext, ReactNode } from 'react';
import { 
  Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Sun, Radio, Flame,
  Globe, Home, Zap, Shirt, ChevronDown, ChevronUp,
  CheckCircle, XCircle, Award, Trophy, AlertCircle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

// Type declaration for Chrome extension APIs (to suppress runtime.lastError warnings)
declare global {
  interface Window {
    chrome?: {
      runtime?: {
        lastError?: { message?: string } | undefined;
        sendMessage?: (...args: any[]) => void;
      };
    };
  }
}

// Suppress Chrome extension runtime.lastError warnings
if (typeof window !== 'undefined') {
  // Override console.error to filter out Chrome extension errors
  const originalError = console.error;
  console.error = (...args: any[]) => {
    const errorMessage = args[0]?.toString() || '';
    // Filter out Chrome extension runtime.lastError messages
    if (errorMessage.includes('runtime.lastError') || 
        errorMessage.includes('message port closed')) {
      return; // Suppress these errors
    }
    originalError.apply(console, args);
  };

  // Handle Chrome extension errors globally
  if (window.chrome?.runtime) {
    // Clear any existing lastError to prevent warnings
    try {
      if (window.chrome.runtime.lastError) {
        window.chrome.runtime.lastError = undefined;
      }
    } catch {
      // Ignore errors when clearing
    }
  }
}

// ============================================================================
// Type Definitions
// ============================================================================
export type LanguageCode = "en" | "hi" | "gu";
export type Language = 'en' | 'hi' | 'gu';

export const getFontFamilyForLanguage = (language: LanguageCode) => {
  if (language === "hi") return '"Noto Sans Devanagari", system-ui, sans-serif';
  if (language === "gu") return '"Noto Sans Gujarati", system-ui, sans-serif';
  return '"Inter", system-ui, sans-serif';
};

// ============================================================================
// Language Context (moved to top for use by all components)
// ============================================================================
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, options?: Record<string, unknown>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const initialLanguage = (i18n.language?.split('-')[0] as Language) || 'en';
  const [language, setLanguageState] = useState<Language>(initialLanguage);

  useEffect(() => {
    // Suppress Chrome extension runtime.lastError warnings
    if (typeof window !== 'undefined' && window.chrome?.runtime?.lastError) {
      // Silently handle extension errors
      try {
        window.chrome.runtime.lastError = undefined;
      } catch {
        // Ignore errors when clearing
      }
    }

    const handleLanguageChanged = (lng: string) => {
      const base = (lng?.split('-')[0] as Language) || 'en';
      setLanguageState(base);
    };
    
    try {
      i18n.on('languageChanged', handleLanguageChanged);
    } catch (error) {
      // Handle i18n event listener errors
      console.warn('Failed to set up language change listener:', error);
    }
    
    return () => {
      try {
        i18n.off('languageChanged', handleLanguageChanged);
      } catch (error) {
        // Handle cleanup errors silently
      }
    };
  }, []);

  const handleSetLanguage = (lang: Language) => {
    i18n.changeLanguage(lang);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('i18nextLng', lang);
      } catch (error) {
        // Handle localStorage errors (e.g., quota exceeded, private browsing)
        console.warn('Failed to save language preference to localStorage:', error);
      }
    }
  };

  useEffect(() => {
    // Ensure we're in the browser and DOM is ready before accessing documentElement
    if (typeof window !== 'undefined' && document && document.documentElement) {
      try {
        document.documentElement.lang = language;
      } catch (error) {
        // Silently handle any DOM access errors during SSR or before mount
        // This prevents "deferred DOM Node could not be resolved" warnings
      }
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
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

interface RadiationLearnModeProps {
  props?: {
    width?: number;
    height?: number;
    data?: BaseDataInterface;
    steps?: StepDataInterface[];
    language?: LanguageCode;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

interface RadiationWave {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  speed: number;
  maxRadius: number;
}

interface StepDetails {
  currentStep: number;
  totalSteps: number;
  isPaused: boolean;
}

interface StepDataInterface {
  id: number;
  title: string;
  description: string;
  type: 'intro' | 'explanation' | 'practice' | 'real_world';
  animationData?: any;
}

interface BaseDataInterface {
  themeColor?: string;
  autoPlayDuration?: number;
}

interface LearnStepText {
  id: number;
  title: string;
  description: string;
}

interface LearnTranslations {
  headerTitle: string;
  headerSubtitle: string;
  stepLabel: string;
  ofLabel: string;
  stepTypeLabels: {
    intro: string;
    explanation: string;
    practice: string;
    real_world: string;
  };
  practiceBadge: string;
  realWorldBadge: string;
  controls: {
    previous: string;
    next: string;
    play: string;
    pause: string;
    reset: string;
  };
  steps: LearnStepText[];
  canvas: {
    introHotObject: string;
    introPerson: string;
    introMainLabel: string;
    introSubLabel: string;
    fireplacePema: string;
    fireplacePalden: string;
    fireplaceLabel: string;
    sunSpace: string;
    sunVacuumNote: string;
    sunLabel: string;
    earthLabel: string;
    sunDistanceNote: string;
    utensilTitle: string;
    utensilLabel: string;
    colorSunLabel: string;
    colorWhiteCloth: string;
    colorReflects: string;
    colorStaysCool: string;
    colorBlackCloth: string;
    colorAbsorbs: string;
    colorBecomesHot: string;
    comparisonConduction: string;
    comparisonNeedsDirect: string;
    comparisonContact: string;
    comparisonSolidMedium: string;
    comparisonConvection: string;
    comparisonNeedsParticles: string;
    comparisonMovement: string;
    comparisonFluidMedium: string;
    comparisonRadiation: string;
    comparisonNoMedium: string;
    comparisonNeeded: string;
    comparisonWorksVacuum: string;
    defaultTitle: string;
  };
  heatingWater: {
    temperatureLabel: string;
    phaseLabel: string;
    phaseNameCold: string;
    phaseNameWarming: string;
    phaseNameHot: string;
    phaseNameBoiling: string;
    phaseNameSteam: string;
    phaseCold: string;
    phaseWarming: string;
    phaseHot: string;
    phaseBoiling: string;
    phaseSteam: string;
    startHeating: string;
    reset: string;
    keyPoints: string;
    keyPoint1: string;
    keyPoint2: string;
    keyPoint3: string;
    keyPoint4: string;
  };
}

interface LearnTranslationsType {
  en: LearnTranslations;
  hi: LearnTranslations;
  gu: LearnTranslations;
}

const learnTranslations: LearnTranslationsType = {
  en: {
    headerTitle: 'Topic 7.3: Radiation',
    headerSubtitle: 'Heat Transfer Without Any Medium',
    stepLabel: 'Step',
    ofLabel: 'of',
    stepTypeLabels: {
      intro: 'INTRODUCTION',
      explanation: 'EXPLANATION',
      practice: 'PRACTICE',
      real_world: 'REAL WORLD',
    },
    practiceBadge: 'Interactive Practice Mode',
    realWorldBadge: 'Real-World Application',
    controls: {
      previous: 'Previous',
      next: 'Next',
      play: 'Play',
      pause: 'Pause',
      reset: 'Reset',
    },
    steps: [
      {
        id: 1,
        title: 'What is Radiation?',
        description:
          'Radiation is the process of heat transfer that does NOT require any medium (solid, liquid, or gas). Heat travels directly from a hot object through empty space to reach us. Unlike conduction and convection, radiation can travel through vacuum!',
      },
      {
        id: 2,
        title: 'Heat from the Fireplace',
        description:
          'Remember Pema and Palden sitting around the fireplace? They felt warm even though they were not touching the fire. The heat reached them directly through radiation - traveling through the air without needing the air to move!',
      },
      {
        id: 3,
        title: "The Sun's Heat",
        description:
          'The Sun is 150 million kilometers away in space (vacuum). Yet we feel its warmth on Earth! This is radiation at work. Heat from the Sun travels through the vacuum of space to reach us - no medium needed!',
      },
      {
        id: 4,
        title: 'All Objects Radiate Heat',
        description:
          'Every object radiates heat to its surroundings. A hot utensil kept away from flame gradually cools down by radiating heat to cooler surroundings. Hotter objects radiate more heat than cooler objects.',
      },
      {
        id: 5,
        title: 'Interactive: Light vs Dark Colors',
        description:
          'Light colors REFLECT heat radiation, keeping you cool in summer. Dark colors ABSORB heat radiation, keeping you warm in winter. This is why we wear white clothes in summer and dark clothes in winter!',
      },
      {
        id: 6,
        title: 'Comparing Heat Transfer Methods',
        description:
          'Conduction needs solid contact. Convection needs particle movement in fluids. Radiation needs NO medium - it can travel through vacuum! All three can happen together, like when heating water in a pan.',
      },
      {
        id: 7,
        title: 'Heating Water',
        description:
          'Watch how water molecules move faster as heat is applied. When water reaches 100°C, it begins to boil and transform into steam through radiation and convection working together.',
      },
    ],
    canvas: {
      introHotObject: '🔥 Hot Object',
      introPerson: '👤 Person',
      introMainLabel: 'Heat Radiation ~~~>',
      introSubLabel: '(No medium needed!)',
      fireplacePema: 'Pema',
      fireplacePalden: 'Palden',
      fireplaceLabel: 'Heat radiates in all directions',
      sunSpace: 'SPACE',
      sunVacuumNote: '(Vacuum - No Air!)',
      sunLabel: '☀️ Sun',
      earthLabel: '🌍 Earth',
      sunDistanceNote: 'Heat radiation travels 150 million km!',
      utensilTitle: 'Hot Utensil',
      utensilLabel: 'Radiating heat to surroundings',
      colorSunLabel: '☀️ Sun Radiation',
      colorWhiteCloth: 'White Cloth',
      colorReflects: 'REFLECTS heat ❄️',
      colorStaysCool: 'Stays Cool',
      colorBlackCloth: 'Black Cloth',
      colorAbsorbs: 'ABSORBS heat 🔥',
      colorBecomesHot: 'Becomes Hot',
      comparisonConduction: 'CONDUCTION',
      comparisonNeedsDirect: 'Needs direct',
      comparisonContact: 'contact',
      comparisonSolidMedium: '(Solid medium)',
      comparisonConvection: 'CONVECTION',
      comparisonNeedsParticles: 'Needs particle',
      comparisonMovement: 'movement',
      comparisonFluidMedium: '(Fluid medium)',
      comparisonRadiation: 'RADIATION',
      comparisonNoMedium: 'NO medium',
      comparisonNeeded: 'needed!',
      comparisonWorksVacuum: '(Works in vacuum)',
      defaultTitle: 'Radiation Animation',
    },
    heatingWater: {
      temperatureLabel: 'Temperature:',
      phaseLabel: 'Phase:',
      phaseNameCold: 'Cold',
      phaseNameWarming: 'Warming',
      phaseNameHot: 'Hot',
      phaseNameBoiling: 'Boiling',
      phaseNameSteam: 'Steam',
      phaseCold: 'Water is cold - molecules moving slowly',
      phaseWarming: 'Water is warming - molecules moving faster',
      phaseHot: 'Water is hot - molecules moving rapidly',
      phaseBoiling: 'Water is boiling - bubbles forming!',
      phaseSteam: 'Steam forming - water turning to vapor!',
      startHeating: '🔥 Start Heating',
      reset: '❄️ Reset',
      keyPoints: '🌡️ Key Points:',
      keyPoint1: 'Water boils at 100°C (212°F) at sea level',
      keyPoint2: 'Heat energy increases molecular movement',
      keyPoint3: 'Bubbles form when water vapor pressure exceeds atmospheric pressure',
      keyPoint4: 'Steam is water in gaseous state',
    },
  },
  hi: {
    headerTitle: 'विषय 7.3: विकिरण',
    headerSubtitle: 'कोई माध्यम बिना ऊष्मा का स्थानांतरण',
    stepLabel: 'चरण',
    ofLabel: 'में से',
    stepTypeLabels: {
      intro: 'परिचय',
      explanation: 'व्याख्या',
      practice: 'अभ्यास',
      real_world: 'वास्तविक जीवन',
    },
    practiceBadge: 'इंटरैक्टिव अभ्यास मोड',
    realWorldBadge: 'वास्तविक जीवन में उपयोग',
    controls: {
      previous: 'पिछला',
      next: 'अगला',
      play: 'चलाएँ',
      pause: 'रोकें',
      reset: 'रीसेट करें',
    },
    steps: [
      {
        id: 1,
        title: 'विकिरण क्या है?',
        description:
          'विकिरण ऊष्मा स्थानांतरण की वह प्रक्रिया है जिसे किसी माध्यम (ठोस, तरल या गैस) की आवश्यकता नहीं होती। ऊष्मा सीधे एक गर्म वस्तु से खाली स्थान के माध्यम से हम तक पहुँचती है। चालन और संवहन के विपरीत, विकिरण निर्वात से होकर यात्रा कर सकता है!',
      },
      {
        id: 2,
        title: 'अंगीठी से ऊष्मा',
        description:
          'क्या आपको याद है पेमा और पेल्डन अंगीठी के चारों ओर बैठे थे? उन्हें गर्मी महसूस हुई भले ही वे आग को छू नहीं रहे थे। ऊष्मा सीधे विकिरण के माध्यम से उन तक पहुँची - हवा से होकर यात्रा करते हुए बिना हवा को हिलाने की आवश्यकता के!',
      },
      {
        id: 3,
        title: 'सूर्य की ऊष्मा',
        description:
          'सूर्य अंतरिक्ष में 150 मिलियन किलोमीटर दूर है (निर्वात)। फिर भी हम पृथ्वी पर इसकी गर्मी महसूस करते हैं! यह विकिरण का काम है। सूर्य से ऊष्मा निर्वात अंतरिक्ष से होकर हम तक पहुँचती है - किसी माध्यम की आवश्यकता नहीं!',
      },
      {
        id: 4,
        title: 'सभी वस्तुएँ ऊष्मा का विकिरण करती हैं',
        description:
          'हर वस्तु अपने आस-पास में ऊष्मा का विकिरण करती है। आग से दूर रखा गया गर्म बर्तन धीरे-धीरे ठंडा होता है, अपने आस-पास के ठंडे वातावरण में ऊष्मा का विकिरण करके। गर्म वस्तुएँ ठंडी वस्तुओं की तुलना में अधिक ऊष्मा का विकिरण करती हैं।',
      },
      {
        id: 5,
        title: 'इंटरैक्टिव: हल्के बनाम गहरे रंग',
        description:
          'हल्के रंग ऊष्मा विकिरण को परावर्तित करते हैं, गर्मी में आपको ठंडा रखते हैं। गहरे रंग ऊष्मा विकिरण को अवशोषित करते हैं, सर्दी में आपको गर्म रखते हैं। इसीलिए हम गर्मी में सफेद कपड़े और सर्दी में गहरे कपड़े पहनते हैं!',
      },
      {
        id: 6,
        title: 'ऊष्मा स्थानांतरण विधियों की तुलना',
        description:
          'चालन को ठोस संपर्क चाहिए। संवहन को तरल पदार्थों में कणों की गति चाहिए। विकिरण को कोई माध्यम नहीं चाहिए - यह निर्वात से होकर यात्रा कर सकता है! तीनों एक साथ हो सकते हैं, जैसे कि पैन में पानी गर्म करते समय।',
      },
      {
        id: 7,
        title: 'पानी को गर्म करना',
        description:
          'देखें कि गर्मी लगाने पर जल के अणु तेजी से कैसे चलते हैं। जब पानी 100°C तक पहुँचता है, तो यह उबलना शुरू कर देता है और विकिरण तथा संवहन के साथ मिलकर भाप में बदल जाता है।',
      },
    ],
    canvas: {
      introHotObject: '🔥 गर्म वस्तु',
      introPerson: '👤 व्यक्ति',
      introMainLabel: 'ऊष्मा विकिरण ~~~>',
      introSubLabel: '(किसी माध्यम की आवश्यकता नहीं!)',
      fireplacePema: 'पेमा',
      fireplacePalden: 'पेल्डन',
      fireplaceLabel: 'ऊष्मा चारों दिशाओं में फैलती है',
      sunSpace: 'अंतरिक्ष',
      sunVacuumNote: '(निर्वात - कोई वायु नहीं!)',
      sunLabel: '☀️ सूर्य',
      earthLabel: '🌍 पृथ्वी',
      sunDistanceNote: 'ऊष्मा विकिरण 150 मिलियन km की दूरी तय करता है!',
      utensilTitle: 'गर्म बर्तन',
      utensilLabel: 'आस-पास में ऊष्मा का विकिरण',
      colorSunLabel: '☀️ सूर्य का विकिरण',
      colorWhiteCloth: 'सफेद कपड़ा',
      colorReflects: 'ऊष्मा परावर्तित करता है ❄️',
      colorStaysCool: 'ठंडा रहता है',
      colorBlackCloth: 'काला कपड़ा',
      colorAbsorbs: 'ऊष्मा अवशोषित करता है 🔥',
      colorBecomesHot: 'गरम हो जाता है',
      comparisonConduction: 'चालन',
      comparisonNeedsDirect: 'सीधे संपर्क',
      comparisonContact: 'की आवश्यकता',
      comparisonSolidMedium: '(ठोस माध्यम)',
      comparisonConvection: 'संवहन',
      comparisonNeedsParticles: 'कणों की',
      comparisonMovement: 'गति चाहिए',
      comparisonFluidMedium: '(तरल / गैस माध्यम)',
      comparisonRadiation: 'विकिरण',
      comparisonNoMedium: 'कोई माध्यम',
      comparisonNeeded: 'नहीं चाहिए!',
      comparisonWorksVacuum: '(निर्वात में भी काम करता है)',
      defaultTitle: 'विकिरण एनीमेशन',
    },
    heatingWater: {
      temperatureLabel: 'तापमान:',
      phaseLabel: 'अवस्था:',
      phaseNameCold: 'ठंडा',
      phaseNameWarming: 'गर्म हो रहा',
      phaseNameHot: 'गर्म',
      phaseNameBoiling: 'उबल रहा',
      phaseNameSteam: 'भाप',
      phaseCold: 'पानी ठंडा है - अणु धीरे-धीरे चल रहे हैं',
      phaseWarming: 'पानी गर्म हो रहा है - अणु तेजी से चल रहे हैं',
      phaseHot: 'पानी गर्म है - अणु तेजी से चल रहे हैं',
      phaseBoiling: 'पानी उबल रहा है - बुलबुले बन रहे हैं!',
      phaseSteam: 'भाप बन रही है - पानी वाष्प में बदल रहा है!',
      startHeating: '🔥 गर्म करना शुरू करें',
      reset: '❄️ रीसेट करें',
      keyPoints: '🌡️ मुख्य बिंदु:',
      keyPoint1: 'समुद्र तल पर पानी 100°C (212°F) पर उबलता है',
      keyPoint2: 'ऊष्मा ऊर्जा अणुओं की गति को बढ़ाती है',
      keyPoint3: 'जब जल वाष्प दबाव वायुमंडलीय दबाव से अधिक हो जाता है तो बुलबुले बनते हैं',
      keyPoint4: 'भाप गैसीय अवस्था में पानी है',
    },
  },
  gu: {
    headerTitle: 'વિષય 7.3: વિકિરણ',
    headerSubtitle: 'માધ્યમ વિના ઉષ્મા સ્થાનાંતરણ',
    stepLabel: 'પગલું',
    ofLabel: 'માંથી',
    stepTypeLabels: {
      intro: 'પરિચય',
      explanation: 'સમજાણ',
      practice: 'અભ્યાસ',
      real_world: 'વાસ્તવિક જીવન',
    },
    practiceBadge: 'ઇન્ટરેક્ટિવ અભ્યાસ મોડ',
    realWorldBadge: 'વાસ્તવિક જીવનમાં ઉપયોગ',
    controls: {
      previous: 'પાછલું',
      next: 'આગલું',
      play: 'ચાલુ કરો',
      pause: 'રોકો',
      reset: 'રીસેટ કરો',
    },
    steps: [
      {
        id: 1,
        title: 'વિકિરણ શું છે?',
        description:
          'વિકિરણ એ ઉષ્મા સ્થાનાંતરણની પ્રક્રિયા છે જેને કોઈ માધ્યમ (ઘન, પ્રવાહી અથવા વાયુ) ની જરૂર પડતી નથી. ઉષ્મા સીધી ગરમ વસ્તુથી ખાલી જગ્યામાંથી આપણા સુધી પહોંચે છે. ચાલન અને સંવહનથી વિપરીત, વિકિરણ શૂન્યાવકાશમાંથી પસાર થઈ શકે છે!',
      },
      {
        id: 2,
        title: 'ચૂલામાંથી ઉષ્મા',
        description:
          'યાદ છે પેમા અને પેલ્ડન ચૂલાની આસપાસ બેઠા હતા? તેમને ગરમી લાગી હતી ભલે તેઓ આગને સ્પર્શ ન કરતા હોય. ઉષ્મા સીધી વિકિરણ દ્વારા તેમના સુધી પહોંચી - હવામાંથી પસાર થતી બિના હવાને ખસેડવાની જરૂર પડ્યા વગર!',
      },
      {
        id: 3,
        title: 'સૂર્યની ઉષ્મા',
        description:
          'સૂર્ય અવકાશમાં 150 મિલિયન કિલોમીટર દૂર છે (શૂન્યાવકાશ). છતાં આપણે પૃથ્વી પર તેની ગરમી અનુભવીએ છીએ! આ વિકિરણનું કામ છે. સૂર્યની ઉષ્મા શૂન્યાવકાશ અવકાશમાંથી પસાર થઈ આપણા સુધી પહોંચે છે - કોઈ માધ્યમની જરૂર નથી!',
      },
      {
        id: 4,
        title: 'બધી વસ્તુઓ ઉષ્માનો વિકિરણ કરે છે',
        description:
          'દરેક વસ્તુ પોતાની આસપાસ ઉષ્માનો વિકિરણ કરે છે. આગથી દૂર રાખેલું ગરમ વાસણ ધીમે ધીમે ઠંડું થાય છે, પોતાની આસપાસના ઠંડા વાતાવરણમાં ઉષ્માનો વિકિરણ કરીને. ગરમ વસ્તુઓ ઠંડી વસ્તુઓ કરતાં વધુ ઉષ્માનો વિકિરણ કરે છે.',
      },
      {
        id: 5,
        title: 'ઇન્ટરેક્ટિવ: હળવા વિરુદ્ધ ગાઢ રંગો',
        description:
          'હળવા રંગો ઉષ્મા વિકિરણને પરાવર્તિત કરે છે, ઉનાળામાં તમને ઠંડક આપે છે. ગાઢ રંગો ઉષ્મા વિકિરણને શોષે છે, શિયાળામાં તમને ગરમી આપે છે. તેથી જ આપણે ઉનાળામાં સફેદ કપડાં અને શિયાળામાં ગાઢ કપડાં પહેરીએ છીએ!',
      },
      {
        id: 6,
        title: 'ઉષ્મા સ્થાનાંતરણ પદ્ધતિઓની તુલના',
        description:
          'ચાલનને ઘન સંપર્ક જોઈએ. સંવહનને પ્રવાહીમાં કણોની ગતિ જોઈએ. વિકિરણને કોઈ માધ્યમ જોઈએ નથી - તે શૂન્યાવકાશમાંથી પસાર થઈ શકે છે! ત્રણેય એક સાથે થઈ શકે છે, જેમ કે પાનમાં પાણી ગરમ કરતી વખતે.',
      },
      {
        id: 7,
        title: 'પાણી ગરમ કરવું',
        description:
          'જુઓ કે ગરમી લાગવાથી પાણીના અણુઓ કેટલા ઝડપથી ખસે છે. જ્યારે પાણી 100°C સુધી પહોંચે છે, ત્યારે તે ઉકળવાનું શરૂ કરે છે અને વિકિરણ અને સંવહન સાથે મળીને વરાળમાં રૂપાંતરિત થાય છે.',
      },
    ],
    canvas: {
      introHotObject: '🔥 ગરમ વસ્તુ',
      introPerson: '👤 વ્યક્તિ',
      introMainLabel: 'ઉષ્મા વિકિરણ ~~~>',
      introSubLabel: '(કોઈ માધ્યમની જરૂર નથી!)',
      fireplacePema: 'પેમા',
      fireplacePalden: 'પેલ્ડન',
      fireplaceLabel: 'ઉષ્મા ચારેય દિશામાં ફેલાય છે',
      sunSpace: 'અવકાશ',
      sunVacuumNote: '(શૂન્યાવકાશ - હવા નથી!)',
      sunLabel: '☀️ સૂર્ય',
      earthLabel: '🌍 પૃથ્વી',
      sunDistanceNote: 'ઉષ્મા વિકિરણ 150 મિલિયન km સુધી પહોંચે છે!',
      utensilTitle: 'ગરમ વાસણ',
      utensilLabel: 'આસપાસ ઉષ્મા છૂટે છે',
      colorSunLabel: '☀️ સૂર્યનું વિકિરણ',
      colorWhiteCloth: 'સફેદ કપડું',
      colorReflects: 'ઉષ્મા પરાવર્તિત કરે છે ❄️',
      colorStaysCool: 'ઠંડુ રહે છે',
      colorBlackCloth: 'કાળું કપડું',
      colorAbsorbs: 'ઉષ્મા શોષે છે 🔥',
      colorBecomesHot: 'ગરમ बनी જાય છે',
      comparisonConduction: 'ચાલન',
      comparisonNeedsDirect: 'સિધો સંપર્ક',
      comparisonContact: 'જરૂરી છે',
      comparisonSolidMedium: '(ઠોસ માધ્યમ)',
      comparisonConvection: 'સંવહન',
      comparisonNeedsParticles: 'કણોની',
      comparisonMovement: 'ચળવળ જોઈએ',
      comparisonFluidMedium: '(દ્રવ / વાયુ માધ્યમ)',
      comparisonRadiation: 'વિકિરણ',
      comparisonNoMedium: 'કોઈ માધ્યમ',
      comparisonNeeded: 'જરૂર નથી!',
      comparisonWorksVacuum: '(શૂન્યાવકાશમાં પણ કામ કરે છે)',
      defaultTitle: 'વિકિરણ એનિમેશન',
    },
    heatingWater: {
      temperatureLabel: 'તાપમાન:',
      phaseLabel: 'અવસ્થા:',
      phaseNameCold: 'ઠંડું',
      phaseNameWarming: 'ગરમ થઈ રહ્યું',
      phaseNameHot: 'ગરમ',
      phaseNameBoiling: 'ઉકળી રહ્યું',
      phaseNameSteam: 'વરાળ',
      phaseCold: 'પાણી ઠંડું છે - અણુઓ ધીમે ધીમે ખસી રહ્યા છે',
      phaseWarming: 'પાણી ગરમ થઈ રહ્યું છે - અણુઓ ઝડપથી ખસી રહ્યા છે',
      phaseHot: 'પાણી ગરમ છે - અણુઓ ખૂબ ઝડપથી ખસી રહ્યા છે',
      phaseBoiling: 'પાણી ઉકળી રહ્યું છે - પરપોટા બની રહ્યા છે!',
      phaseSteam: 'વરાળ બની રહી છે - પાણી વરાળમાં રૂપાંતરિત થઈ રહ્યું છે!',
      startHeating: '🔥 ગરમ કરવાનું શરૂ કરો',
      reset: '❄️ રીસેટ કરો',
      keyPoints: '🌡️ મુખ્ય મુદ્દાઓ:',
      keyPoint1: 'સમુદ્ર સપાટી પર પાણી 100°C (212°F) પર ઉકળે છે',
      keyPoint2: 'ઉષ્મા ઊર્જા આણ્વિક ગતિને વધારે છે',
      keyPoint3: 'જ્યારે પાણીનો વરાળ દબાણ વાયુમંડળીય દબાણ કરતાં વધી જાય છે ત્યારે પરપોટા બને છે',
      keyPoint4: 'વરાળ એ ગેસીય સ્થિતિમાં પાણી છે',
    },
  },
};

const DEFAULT_STEPS: StepDataInterface[] = [
  {
    id: 1,
    title: "What is Radiation?",
    description: "Radiation is the process of heat transfer that does NOT require any medium (solid, liquid, or gas). Heat travels directly from a hot object through empty space to reach us. Unlike conduction and convection, radiation can travel through vacuum!",
    type: 'intro',
    animationData: { experiment: 'intro' }
  },
  {
    id: 2,
    title: "Heat from the Fireplace",
    description: "Remember Pema and Palden sitting around the fireplace? They felt warm even though they weren't touching the fire. The heat reached them directly through radiation - traveling through the air without needing the air to move!",
    type: 'explanation',
    animationData: { experiment: 'fireplace' }
  },
  {
    id: 3,
    title: "The Sun's Heat",
    description: "The Sun is 150 million kilometers away in space (vacuum). Yet we feel its warmth on Earth! This is radiation at work. Heat from the Sun travels through the vacuum of space to reach us - no medium needed!",
    type: 'explanation',
    animationData: { experiment: 'sun_heat' }
  },
  {
    id: 4,
    title: "All Objects Radiate Heat",
    description: "Every object radiates heat to its surroundings. A hot utensil kept away from flame gradually cools down by radiating heat to cooler surroundings. Hotter objects radiate more heat than cooler objects.",
    type: 'explanation',
    animationData: { experiment: 'utensil_cooling' }
  },
  {
    id: 5,
    title: "Interactive: Light vs Dark Colors",
    description: "Light colors REFLECT heat radiation, keeping you cool in summer. Dark colors ABSORB heat radiation, keeping you warm in winter. This is why we wear white clothes in summer and dark clothes in winter!",
    type: 'practice',
    animationData: { experiment: 'color_absorption' }
  },
  {
    id: 6,
    title: "Comparing Heat Transfer Methods",
    description: "Conduction needs solid contact. Convection needs particle movement in fluids. Radiation needs NO medium - it can travel through vacuum! All three can happen together, like when heating water in a pan.",
    type: 'explanation',
    animationData: { experiment: 'comparison' }
  },
  {
    id: 7,
    title: "Heating Water",
    description: "Watch how water molecules move faster as heat is applied. When water reaches 100°C, it begins to boil and transform into steam through radiation and convection working together.",
    type: 'explanation',
    animationData: { experiment: 'heating_water' }
  }
];

// HeatingWaterAnimation Component
interface HeatingWaterAnimationProps {
  language: LanguageCode;
  translations: LearnTranslations['heatingWater'];
}

const HeatingWaterAnimation: React.FC<HeatingWaterAnimationProps> = ({ language: _language, translations }) => {
  const [temperature, setTemperature] = useState(25);
  const [isHeating, setIsHeating] = useState(false);
  const [phase, setPhase] = useState<'cold' | 'warming' | 'hot' | 'boiling' | 'steam'>('cold');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    type: 'molecule' | 'bubble' | 'vapor';
  }>>([]);

  useEffect(() => {
    if (!isHeating) return;

    const interval = setInterval(() => {
      setTemperature((prev) => {
        if (prev >= 100) {
          return 100;
        }
        return prev + 0.5;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isHeating]);

  useEffect(() => {
    if (temperature < 40) setPhase('cold');
    else if (temperature < 70) setPhase('warming');
    else if (temperature < 95) setPhase('hot');
    else if (temperature < 100) setPhase('boiling');
    else setPhase('steam');
  }, [temperature]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize water molecules
    if (particlesRef.current.length === 0) {
      for (let i = 0; i < 80; i++) {
        particlesRef.current.push({
          x: 95 + Math.random() * 195,
          y: 200 + Math.random() * 55,
          vx: 0,
          vy: 0,
          size: 2.5,
          opacity: 0.6,
          type: 'molecule'
        });
      }
    }

    // Helper functions
    const getWaterColor = (temp: number) => {
      if (temp < 40) {
        return { top: 'rgba(100, 180, 255, 0.7)', bottom: 'rgba(70, 150, 230, 0.8)' };
      } else if (temp < 70) {
        return { top: 'rgba(120, 190, 255, 0.7)', bottom: 'rgba(90, 160, 240, 0.8)' };
      } else if (temp < 95) {
        return { top: 'rgba(140, 200, 255, 0.7)', bottom: 'rgba(110, 170, 250, 0.8)' };
      } else {
        return { top: 'rgba(160, 210, 255, 0.6)', bottom: 'rgba(130, 180, 255, 0.7)' };
      }
    };

    const drawFlames = (ctx: CanvasRenderingContext2D, intensity: number) => {
      const time = Date.now() * 0.005;
      const flames = [
        { x: 165, height: 28 },
        { x: 185, height: 35 },
        { x: 200, height: 38 },
        { x: 215, height: 35 },
        { x: 235, height: 28 }
      ];

      flames.forEach((flame, i) => {
        const flicker = Math.sin(time + i) * 5;
        const height = (flame.height + flicker) * intensity;

        // Outer flame (orange)
        const gradient1 = ctx.createLinearGradient(flame.x, 280, flame.x, 280 - height);
        gradient1.addColorStop(0, 'rgba(255, 100, 0, 0.8)');
        gradient1.addColorStop(0.5, 'rgba(255, 150, 0, 0.6)');
        gradient1.addColorStop(1, 'rgba(255, 200, 0, 0)');

        ctx.fillStyle = gradient1;
        ctx.beginPath();
        ctx.moveTo(flame.x - 10, 280);
        ctx.quadraticCurveTo(flame.x - 7, 280 - height * 0.7, flame.x, 280 - height);
        ctx.quadraticCurveTo(flame.x + 7, 280 - height * 0.7, flame.x + 10, 280);
        ctx.closePath();
        ctx.fill();

        // Inner flame (yellow-white)
        const gradient2 = ctx.createLinearGradient(flame.x, 280, flame.x, 280 - height * 0.7);
        gradient2.addColorStop(0, 'rgba(255, 255, 100, 0.9)');
        gradient2.addColorStop(0.5, 'rgba(255, 255, 200, 0.7)');
        gradient2.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient2;
        ctx.beginPath();
        ctx.moveTo(flame.x - 5, 280);
        ctx.quadraticCurveTo(flame.x - 3, 280 - height * 0.5, flame.x, 280 - height * 0.7);
        ctx.quadraticCurveTo(flame.x + 3, 280 - height * 0.5, flame.x + 5, 280);
        ctx.closePath();
        ctx.fill();
      });
    };

    const drawPan = (ctx: CanvasRenderingContext2D) => {
    // Pan body (trapezoid shape) - reduced size
    ctx.fillStyle = '#8b7355';
    ctx.strokeStyle = '#5d4a3a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(95, 200);
    ctx.lineTo(102, 255);
    ctx.lineTo(298, 255);
    ctx.lineTo(305, 200);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Pan rim
    ctx.fillStyle = '#a0826d';
    ctx.fillRect(92, 193, 216, 10);
    ctx.strokeRect(92, 193, 216, 10);

    // Pan handle
    ctx.fillStyle = '#8b7355';
    ctx.fillRect(310, 225, 28, 8);
    ctx.strokeRect(310, 225, 28, 8);
    ctx.beginPath();
    ctx.arc(338, 229, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Shine on pan
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(115, 215);
      ctx.lineTo(130, 245);
      ctx.stroke();
    };

    const drawWaterSurface = (ctx: CanvasRenderingContext2D) => {
      const time = Date.now() * 0.003;
      const boilingEffect = phase === 'boiling' || phase === 'steam' ? 1 : 0;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(102, 200);
      
      // Create wavy surface
      for (let x = 102; x <= 298; x += 5) {
        const wave = Math.sin((x - 102) * 0.05 + time) * 2 * (1 + boilingEffect * 2);
        ctx.lineTo(x, 200 + wave);
      }
      
      ctx.lineTo(298, 255);
      ctx.lineTo(102, 255);
      ctx.closePath();

      // Water gradient based on temperature
      const waterColor = getWaterColor(temperature);
      const gradient = ctx.createLinearGradient(200, 200, 200, 255);
      gradient.addColorStop(0, waterColor.top);
      gradient.addColorStop(1, waterColor.bottom);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Add shimmer effect
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.beginPath();
      ctx.ellipse(200, 227, 70, 20, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const updateParticles = (ctx: CanvasRenderingContext2D) => {
      const movementFactor = temperature / 50;
      const time = Date.now();

      // Generate bubbles when boiling
      if ((phase === 'boiling' || phase === 'steam') && Math.random() < 0.15) {
        particlesRef.current.push({
          x: 110 + Math.random() * 188,
          y: 250,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -2 - Math.random() * 1.5, // Negative value ensures upward movement
          size: 2.5 + Math.random() * 3,
          opacity: 0.8,
          type: 'bubble'
        });
      }

    // Generate vapor/steam above water
    if (temperature > 70 && Math.random() < 0.2) {
      particlesRef.current.push({
        x: 110 + Math.random() * 188,
        y: 195,
        vx: (Math.random() - 0.5) * 1,
        vy: -0.8 - Math.random() * 0.7,
        size: 3 + Math.random() * 4,
        opacity: 0.5,
        type: 'vapor'
      });
    }

    // Update and draw all particles
    particlesRef.current = particlesRef.current.filter(particle => {
      if (particle.type === 'molecule') {
        // Water molecules - brownian motion
        particle.x += Math.sin(time * 0.001 + particle.x) * movementFactor * 0.1;
        particle.y += Math.cos(time * 0.001 + particle.y) * movementFactor * 0.1;

        // Keep molecules within water bounds
        if (particle.x < 107) particle.x = 107;
        if (particle.x > 293) particle.x = 293;
        if (particle.y < 205) particle.y = 205;
        if (particle.y > 250) particle.y = 250;

        // Draw molecule
        ctx.fillStyle = `rgba(70, 130, 220, ${particle.opacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        return true;
      } else if (particle.type === 'bubble') {
        // Bubbles rise and expand
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.size *= 1.01;
        particle.opacity *= 0.98;

        // Remove bubble if it reaches surface or fades out
        if (particle.y < 200 || particle.opacity < 0.1) {
          // Convert to vapor at surface
          if (particle.y < 200) {
            particlesRef.current.push({
              x: particle.x,
              y: 195,
              vx: (Math.random() - 0.5) * 1.5,
              vy: -1 - Math.random() * 0.5,
              size: particle.size * 1.5,
              opacity: 0.6,
              type: 'vapor'
            });
          }
          return false;
        }

        // Draw bubble with blue color
        ctx.strokeStyle = `rgba(70, 130, 220, ${particle.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.stroke();

        // Bubble fill (light blue)
        ctx.fillStyle = `rgba(100, 180, 255, ${particle.opacity * 0.4})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size - 1, 0, Math.PI * 2);
        ctx.fill();

        // Bubble highlight (white highlight on blue bubble)
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity * 0.5})`;
        ctx.beginPath();
        ctx.arc(particle.x - particle.size * 0.3, particle.y - particle.size * 0.3, particle.size * 0.3, 0, Math.PI * 2);
        ctx.fill();

        return true;
      } else if (particle.type === 'vapor') {
        // Vapor rises and disperses
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.99;
        particle.size *= 1.02;
        particle.opacity *= 0.96;

        // Remove vapor when it fades or goes off screen
        if (particle.opacity < 0.05 || particle.y < 50) {
          return false;
        }

        // Draw vapor with gradient
        const vaporGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size
        );
        vaporGradient.addColorStop(0, `rgba(230, 240, 255, ${particle.opacity})`);
        vaporGradient.addColorStop(0.5, `rgba(200, 220, 255, ${particle.opacity * 0.5})`);
        vaporGradient.addColorStop(1, `rgba(180, 200, 255, 0)`);

        ctx.fillStyle = vaporGradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        return true;
      }
      return false;
    });
    };

    const drawTemperatureGauge = (ctx: CanvasRenderingContext2D) => {
      // Thermometer (further reduced size)
      const thermoX = 25;
      const thermoY = 100;
      const thermoWidth = 14;
      const thermoHeight = 100;
      const bulbRadius = 9;
      const bulbY = thermoY + thermoHeight + bulbRadius - 2;

      ctx.fillStyle = '#fff';
      ctx.fillRect(thermoX, thermoY, thermoWidth, thermoHeight);
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.strokeRect(thermoX, thermoY, thermoWidth, thermoHeight);

      // Mercury/indicator
      const mercuryHeight = (temperature / 100) * thermoHeight;
      const gradient = ctx.createLinearGradient(thermoX, thermoY + thermoHeight, thermoX, thermoY);
      gradient.addColorStop(0, '#ff3333');
      gradient.addColorStop(0.5, '#ff6633');
      gradient.addColorStop(1, '#ff9933');
      ctx.fillStyle = gradient;
      ctx.fillRect(thermoX + 2, (thermoY + thermoHeight) - mercuryHeight, thermoWidth - 4, mercuryHeight + bulbRadius - 2);

      // Bulb
      ctx.beginPath();
      ctx.arc(thermoX + thermoWidth / 2, bulbY, bulbRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Temperature text
      ctx.fillStyle = '#333';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${temperature.toFixed(1)}°C`, thermoX + thermoWidth / 2, thermoY - 8);

      // Scale marks
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      ctx.font = '7px Arial';
      ctx.fillStyle = '#333';
      for (let i = 0; i <= 100; i += 25) {
        const y = (thermoY + thermoHeight) - (i / 100) * thermoHeight;
        ctx.beginPath();
        ctx.moveTo(thermoX + thermoWidth, y);
        ctx.lineTo(thermoX + thermoWidth + 4, y);
        ctx.stroke();
        ctx.fillText(`${i}°`, thermoX + thermoWidth + 6, y + 2);
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background gradient
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGradient.addColorStop(0, '#f8f9fa');
      bgGradient.addColorStop(1, '#e9ecef');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stove
      ctx.fillStyle = '#2c2c2c';
      ctx.fillRect(95, 280, 210, 28);
      
      // Draw burner
      ctx.fillStyle = '#444';
      ctx.beginPath();
      ctx.ellipse(200, 280, 56, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Draw flames (animated)
      if (isHeating) {
        const flameIntensity = Math.min(temperature / 100, 1);
        drawFlames(ctx, flameIntensity);
      }

      // Draw pan
      drawPan(ctx);

      // Update and draw particles
      updateParticles(ctx);

      // Draw water surface with ripples
      drawWaterSurface(ctx);

      // Draw temperature gauge
      drawTemperatureGauge(ctx);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [temperature, isHeating, phase]);

  const getPhaseName = () => {
    switch (phase) {
      case 'cold':
        return translations.phaseNameCold;
      case 'warming':
        return translations.phaseNameWarming;
      case 'hot':
        return translations.phaseNameHot;
      case 'boiling':
        return translations.phaseNameBoiling;
      case 'steam':
        return translations.phaseNameSteam;
      default:
        return '';
    }
  };

  const getPhaseDescription = () => {
    switch (phase) {
      case 'cold':
        return translations.phaseCold;
      case 'warming':
        return translations.phaseWarming;
      case 'hot':
        return translations.phaseHot;
      case 'boiling':
        return translations.phaseBoiling;
      case 'steam':
        return translations.phaseSteam;
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Canvas */}
      <div className="bg-white rounded-lg p-4 sm:p-4 mb-6 w-full shadow-md">
        <canvas
          ref={canvasRef}
          width={400}
          height={380}
          className="w-full rounded-lg"
        />
      </div>

      {/* Temperature Display */}
      <div className="bg-gradient-to-r from-blue-500 to-red-500 rounded-lg p-4 sm:p-6 mb-6 w-full">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white font-semibold text-sm sm:text-base">{translations.temperatureLabel}</span>
          <span className="text-white text-xl sm:text-2xl font-bold">{temperature.toFixed(1)}°C</span>
        </div>
        <div className="w-full bg-white bg-opacity-30 rounded-full h-4">
          <div
            className="bg-white rounded-full h-4 transition-all duration-300"
            style={{ width: `${temperature}%` }}
          />
        </div>
      </div>

      {/* Phase Description */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 w-full">
        <p className="text-blue-800 font-medium text-sm sm:text-base">
          {translations.phaseLabel} <span className="uppercase">{getPhaseName()}</span>
        </p>
        <p className="text-blue-700 text-xs sm:text-sm mt-2">{getPhaseDescription()}</p>
      </div>

      {/* Controls */}
      <div className="flex gap-4 justify-center w-full">
        <button
          onClick={() => setIsHeating(true)}
          disabled={isHeating || temperature >= 100}
          className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors duration-200 text-sm sm:text-base"
        >
          {translations.startHeating}
        </button>
        <button
          onClick={() => {
            setIsHeating(false);
            setTemperature(25);
            particlesRef.current = particlesRef.current.filter(p => p.type === 'molecule');
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors duration-200 text-sm sm:text-base"
        >
          {translations.reset}
        </button>
      </div>

      {/* Educational Information */}
      <div className="mt-6 sm:mt-8 space-y-4 text-gray-700 w-full">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-bold text-base sm:text-lg mb-2">{translations.keyPoints}</h3>
          <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
            <li>{translations.keyPoint1}</li>
            <li>{translations.keyPoint2}</li>
            <li>{translations.keyPoint3}</li>
            <li>{translations.keyPoint4}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const RadiationLearnMode: React.FC<RadiationLearnModeProps> = ({
  props = {},
  setStepDetails,
  stopAutoNext,
  setStopAutoNext
}) => {
  const { language: contextLanguage } = useLanguage();
  const language: LanguageCode = (props.language || (contextLanguage as LanguageCode) || 'en') as LanguageCode;
  const t: LearnTranslations = (learnTranslations[language] || learnTranslations.en) as LearnTranslations;
  const width = props.width || 800;
  const height = props.height || 500;
  const steps = props.steps || DEFAULT_STEPS;
  const stepTexts: LearnStepText[] =
    t.steps.length === DEFAULT_STEPS.length ? t.steps : learnTranslations.en.steps;
  const canvasFontFamily =
    language === 'hi'
      ? 'Noto Sans Devanagari'
      : language === 'gu'
      ? 'Noto Sans Gujarati'
      : 'Inter';

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(!stopAutoNext);
  const [, setAnimationFrame] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [radiationWaves, setRadiationWaves] = useState<RadiationWave[]>([]);
  const [time, setTime] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const lastFrameTime = useRef<number>(Date.now());

  const currentStep = steps[currentStepIndex];

  useEffect(() => {
    if (setStepDetails) {
      setStepDetails({
        currentStep: currentStepIndex + 1,
        totalSteps: steps.length,
        isPaused: !isPlaying
      });
    }
  }, [currentStepIndex, steps.length, isPlaying, setStepDetails]);

  useEffect(() => {
    if (!isPlaying || stopAutoNext) return;

    const timer = setTimeout(() => {
      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex(prev => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, props.data?.autoPlayDuration || 8000);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, stopAutoNext, steps.length, props.data?.autoPlayDuration]);

  useEffect(() => {
    const animate = () => {
      const now = Date.now();
      const deltaTime = (now - lastFrameTime.current) / 1000; // Convert to seconds
      lastFrameTime.current = now;

      setTime(prev => prev + deltaTime);
      setAnimationFrame(prev => prev + 1);
      
      // Update particles
      updateParticles(deltaTime);
      updateRadiationWaves(deltaTime);
      
      drawAnimation();
      animationRef.current = requestAnimationFrame(animate);
    };

    if (isPlaying && currentStep.animationData?.experiment !== 'heating_water') {
      lastFrameTime.current = Date.now();
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, currentStep, particles, radiationWaves]);

  // Initialize particles for different animations
  const createFireParticles = () => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        x: width / 2 + (Math.random() - 0.5) * 40,
        y: height - 100,
        vx: (Math.random() - 0.5) * 1,
        vy: -2 - Math.random() * 2,
        size: 3 + Math.random() * 5,
        opacity: 1,
        color: Math.random() > 0.5 ? '#FF6347' : '#FFA500',
        life: 0,
        maxLife: 1 + Math.random() * 2
      });
    }
    return newParticles;
  };

  const updateParticles = (deltaTime: number) => {
    setParticles(prev => {
      const updated = prev.map(p => ({
        ...p,
        x: p.x + p.vx * deltaTime * 60,
        y: p.y + p.vy * deltaTime * 60,
        life: p.life + deltaTime,
        opacity: Math.max(0, 1 - (p.life / p.maxLife))
      })).filter(p => p.life < p.maxLife && p.opacity > 0.01);

      // Add new particles for continuous effects
      if (currentStep.animationData?.experiment === 'fireplace' && updated.length < 30) {
        const newP = createFireParticles().slice(0, 2);
        return [...updated, ...newP];
      }

      return updated;
    });
  };

  const updateRadiationWaves = (deltaTime: number) => {
    setRadiationWaves(prev => {
      const updated = prev.map(w => ({
        ...w,
        radius: w.radius + w.speed * deltaTime,
        opacity: Math.max(0, w.opacity - deltaTime * 0.4)
      })).filter(w => w.radius < w.maxRadius && w.opacity > 0.01);

      return updated;
    });
  };

  // Initialize particles when step changes
  useEffect(() => {
    setParticles([]);
    setRadiationWaves([]);
    setTime(0);
    
    if (currentStep.animationData?.experiment === 'fireplace') {
      setParticles(createFireParticles());
    }
  }, [currentStepIndex]);

  const drawAnimation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    switch (currentStep.animationData?.experiment) {
      case 'intro':
        drawIntroAnimation(ctx);
        break;
      case 'fireplace':
        drawFireplaceAnimation(ctx);
        break;
      case 'sun_heat':
        drawSunHeatAnimation(ctx);
        break;
      case 'utensil_cooling':
        drawUtensilCooling(ctx);
        break;
      case 'color_absorption':
        drawColorAbsorption(ctx);
        break;
      case 'comparison':
        drawComparison(ctx);
        break;
      case 'heating_water':
        // HeatingWaterAnimation is rendered as a React component, not canvas
        drawDefaultAnimation(ctx);
        break;
      default:
        drawDefaultAnimation(ctx);
    }
  };

  const drawIntroAnimation = (ctx: CanvasRenderingContext2D) => {
    // Hot object on left with pulsing glow
    const pulseScale = 1 + Math.sin(time * 2) * 0.1;
    
    // Outer glow
    const outerGlow = ctx.createRadialGradient(150, height / 2, 20, 150, height / 2, 100 * pulseScale);
    outerGlow.addColorStop(0, 'rgba(255, 200, 0, 0.4)');
    outerGlow.addColorStop(0.5, 'rgba(255, 100, 0, 0.2)');
    outerGlow.addColorStop(1, 'rgba(255, 69, 0, 0)');
    ctx.fillStyle = outerGlow;
    ctx.beginPath();
    ctx.arc(150, height / 2, 100 * pulseScale, 0, Math.PI * 2);
    ctx.fill();
    
    // Hot object
    const objectGradient = ctx.createRadialGradient(150, height / 2, 0, 150, height / 2, 60);
    objectGradient.addColorStop(0, '#FFD700');
    objectGradient.addColorStop(0.5, '#FF8C00');
    objectGradient.addColorStop(1, '#FF4500');
    ctx.fillStyle = objectGradient;
    ctx.beginPath();
    ctx.arc(150, height / 2, 60, 0, Math.PI * 2);
    ctx.fill();

    // Smooth radiation waves with sine wave pattern moving FROM hot object TO person
    const totalDistance = width - 300; // Distance from hot object (150) to person (width-150)
    
    for (let i = 0; i < 8; i++) {
      const waveSpeed = 150; // pixels per second
      const spacing = 60; // spacing between waves
      const offset = (time * waveSpeed + i * spacing) % (totalDistance + 100);
      const progress = offset / (totalDistance + 100);
      const alpha = Math.sin(progress * Math.PI) * 0.7;
      
      if (offset > totalDistance) continue; // Don't draw waves past the person
      
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = `rgb(255, ${100 + progress * 100}, 0)`;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(255, 100, 0, 0.5)';
      
      ctx.beginPath();
      
      // Smooth sine wave moving from left (hot object) to right (person)
      const waveStartX = 150 + 70; // Start from edge of hot object
      const waveLength = 80; // Length of each wave segment
      
      for (let x = 0; x < waveLength && (waveStartX + offset + x) < width - 150; x += 3) {
        const currentX = waveStartX + offset + x;
        const localProgress = x / waveLength;
        const amplitude = 25 * (1 - progress * 0.3) * Math.sin(localProgress * Math.PI);
        const frequency = 0.15;
        const y = height / 2 + Math.sin((x + time * 100) * frequency) * amplitude;
        
        if (x === 0) {
          ctx.moveTo(currentX, y);
        } else {
          ctx.lineTo(currentX, y);
        }
      }
      ctx.stroke();
      ctx.restore();
    }

    // Person on right with subtle animation
    const personBob = Math.sin(time * 1.5) * 3;
    drawPerson(ctx, width - 150, height / 2 + 50 + personBob);

    // Heat effect particles around person
    for (let i = 0; i < 5; i++) {
      const angle = (time + i * 1.2) * 2;
      const radius = 70 + Math.sin(time * 3 + i) * 10;
      const px = width - 150 + Math.cos(angle) * radius;
      const py = height / 2 + 50 + personBob + Math.sin(angle) * radius;
      
      ctx.fillStyle = `rgba(255, 150, 0, ${0.3 * Math.sin(time * 2 + i)})`;
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Labels with subtle animation
    const labelBob = Math.sin(time * 2) * 2;
    ctx.fillStyle = '#000';
    ctx.font = `bold 18px ${canvasFontFamily}`;
    ctx.textAlign = 'center';
    ctx.shadowBlur = 5;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.fillText(t.canvas.introHotObject, 150, height - 50 + labelBob);
    ctx.fillText(t.canvas.introPerson, width - 150, height - 50 - labelBob);
    ctx.shadowBlur = 0;
    
    ctx.fillStyle = '#FF4500';
    ctx.font = `bold 16px ${canvasFontFamily}`;
    const arrowAlpha = 0.5 + Math.sin(time * 3) * 0.3;
    ctx.globalAlpha = arrowAlpha;
    ctx.fillText(t.canvas.introMainLabel, width / 2, 50);
    ctx.globalAlpha = 1;
    ctx.fillText(t.canvas.introSubLabel, width / 2, 75);
  };

  const drawFireplaceAnimation = (ctx: CanvasRenderingContext2D) => {
    // Fireplace
    const brickGradient = ctx.createLinearGradient(width / 2 - 80, height - 150, width / 2 + 80, height - 150);
    brickGradient.addColorStop(0, '#8B4513');
    brickGradient.addColorStop(0.5, '#A0522D');
    brickGradient.addColorStop(1, '#8B4513');
    ctx.fillStyle = brickGradient;
    ctx.fillRect(width / 2 - 80, height - 150, 160, 150);
    
    // Fire with dynamic flames
    ctx.save();
    const fireGradient = ctx.createLinearGradient(width / 2, height - 150, width / 2, height - 60);
    fireGradient.addColorStop(0, '#FFD700');
    fireGradient.addColorStop(0.3, '#FFA500');
    fireGradient.addColorStop(0.6, '#FF6347');
    fireGradient.addColorStop(1, '#FF4500');
    ctx.fillStyle = fireGradient;
    
    // Multiple flame layers for depth
    for (let layer = 0; layer < 3; layer++) {
      ctx.globalAlpha = 0.7 - layer * 0.2;
      ctx.beginPath();
      
      for (let i = -40; i <= 40; i += 10) {
        const baseY = height - 150;
        const flameHeight = 70 + Math.sin(time * 3 + i * 0.1 + layer) * 20;
        const flickerX = Math.sin(time * 4 + i * 0.2 + layer * 2) * 5;
        const flickerY = Math.cos(time * 5 + i * 0.15 + layer * 1.5) * 8;
        
        if (i === -40) {
          ctx.moveTo(width / 2 + i, baseY);
        }
        
        // Create flame shape with bezier curves
        const controlPointHeight = flameHeight * (0.7 + layer * 0.1);
        ctx.quadraticCurveTo(
          width / 2 + i + flickerX,
          baseY - controlPointHeight + flickerY,
          width / 2 + i + 10,
          baseY
        );
      }
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // Fire particles
    particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.opacity;
      const particleGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      particleGradient.addColorStop(0, p.color);
      particleGradient.addColorStop(1, 'rgba(255, 100, 0, 0)');
      ctx.fillStyle = particleGradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Radiation waves emanating in ALL directions (smoother with multiple frequencies)
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 18) {
      for (let i = 0; i < 6; i++) {
        const waveTime = time * 100 + i * 40;
        const offset = waveTime % 180;
        const progress = offset / 180;
        const alpha = Math.sin(progress * Math.PI) * 0.6;
        const distance = 100 + offset;
        
        const startX = width / 2;
        const startY = height - 100;
        const endX = startX + Math.cos(angle) * distance;
        const endY = startY + Math.sin(angle) * distance;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = `hsl(${20 + progress * 40}, 100%, 50%)`;
        ctx.lineWidth = 4 * (1 - progress);
        ctx.lineCap = 'round';
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(255, 100, 0, 0.4)';
        
        // Draw curved radiation path
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        const controlX = startX + Math.cos(angle) * distance * 0.5;
        const controlY = startY - distance * 0.3;
        ctx.quadraticCurveTo(controlX, controlY, endX, endY);
        ctx.stroke();
        ctx.restore();
      }
    }

    // Two people sitting with subtle breathing animation
    const breathScale1 = 1 + Math.sin(time * 1.2) * 0.02;
    const breathScale2 = 1 + Math.sin(time * 1.2 + 1) * 0.02;
    
    ctx.save();
    ctx.translate(width / 2 - 150, height - 50);
    ctx.scale(breathScale1, breathScale1);
    ctx.translate(-(width / 2 - 150), -(height - 50));
    drawPerson(ctx, width / 2 - 150, height - 50);
    ctx.restore();
    
    ctx.save();
    ctx.translate(width / 2 + 150, height - 50);
    ctx.scale(breathScale2, breathScale2);
    ctx.translate(-(width / 2 + 150), -(height - 50));
    drawPerson(ctx, width / 2 + 150, height - 50);
    ctx.restore();

    // Heat shimmer effect
    for (let x = width / 2 - 100; x < width / 2 + 100; x += 20) {
      for (let y = height - 150; y > height - 300; y -= 30) {
        const shimmer = Math.sin(time * 5 + x * 0.1 + y * 0.05) * 2;
        ctx.fillStyle = `rgba(255, 200, 100, ${0.1 * (1 - (height - 150 - y) / 150)})`;
        ctx.fillRect(x + shimmer, y, 15, 25);
      }
    }

    // Labels
    ctx.fillStyle = '#000';
    ctx.font = `bold 16px ${canvasFontFamily}`;
    ctx.textAlign = 'center';
    ctx.shadowBlur = 3;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.fillText(t.canvas.fireplacePema, width / 2 - 150, height - 20);
    ctx.fillText(t.canvas.fireplacePalden, width / 2 + 150, height - 20);
    ctx.shadowBlur = 0;
    
    const glow = 0.7 + Math.sin(time * 2) * 0.3;
    ctx.fillStyle = `rgba(255, 69, 0, ${glow})`;
    ctx.fillText(t.canvas.fireplaceLabel, width / 2, 40);
  };

  const drawSunHeatAnimation = (ctx: CanvasRenderingContext2D) => {
    // Space (black/blue) background with twinkling stars across the whole canvas
    const spaceGradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      10,
      width / 2,
      height / 2,
      Math.max(width, height)
    );
    spaceGradient.addColorStop(0, '#020617');
    spaceGradient.addColorStop(0.5, '#020617');
    spaceGradient.addColorStop(1, '#000000');
    ctx.fillStyle = spaceGradient;
    ctx.fillRect(0, 0, width, height);

    // Twinkling stars over entire background
    for (let i = 0; i < 80; i++) {
      const starX = (i * 73) % width;
      const starY = (i * 59) % height;
      const twinkle = 0.3 + Math.abs(Math.sin(time * 2 + i * 0.5)) * 0.7;
      
      ctx.save();
      ctx.globalAlpha = twinkle;
      ctx.fillStyle = '#FFF';
      ctx.shadowBlur = 3;
      ctx.shadowColor = '#FFF';
      ctx.beginPath();
      ctx.arc(starX, starY, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Animated sun glow (draw on top of space/stars)
    const glowPulse = 1 + Math.sin(time * 2) * 0.15;
    // Shifted sun slightly downward (y: 100 -> 140)
    const sunCenterY = 140;
    const sunGlow = ctx.createRadialGradient(150, sunCenterY, 20, 150, sunCenterY, 80 * glowPulse);
    sunGlow.addColorStop(0, 'rgba(255, 255, 200, 0.8)');
    sunGlow.addColorStop(0.5, 'rgba(255, 215, 0, 0.4)');
    sunGlow.addColorStop(1, 'rgba(255, 165, 0, 0)');
    ctx.fillStyle = sunGlow;
    ctx.beginPath();
    ctx.arc(150, sunCenterY, 80 * glowPulse, 0, Math.PI * 2);
    ctx.fill();
    
    // Sun core
    const sunGradient = ctx.createRadialGradient(150, sunCenterY, 0, 150, sunCenterY, 50);
    sunGradient.addColorStop(0, '#FFFACD');
    sunGradient.addColorStop(0.5, '#FFD700');
    sunGradient.addColorStop(1, '#FFA500');
    ctx.fillStyle = sunGradient;
    ctx.beginPath();
    ctx.arc(150, sunCenterY, 50, 0, Math.PI * 2);
    ctx.fill();

    // Animated sun rays with rotation
    const rayRotation = time * 0.5;
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 + rayRotation;
      const rayLength = 75 + Math.sin(time * 3 + i) * 5;
      const rayWidth = 4 + Math.sin(time * 4 + i * 0.5) * 1.5;
      
      ctx.save();
      ctx.strokeStyle = `rgba(255, 165, 0, ${0.8 + Math.sin(time * 2 + i) * 0.2})`;
      ctx.lineWidth = rayWidth;
      ctx.lineCap = 'round';
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(255, 200, 0, 0.5)';
      ctx.beginPath();
      ctx.moveTo(150 + Math.cos(angle) * 55, sunCenterY + Math.sin(angle) * 55);
      ctx.lineTo(150 + Math.cos(angle) * rayLength, sunCenterY + Math.sin(angle) * rayLength);
      ctx.stroke();
      ctx.restore();
    }

    // Centered SPACE / vacuum text (shifted slightly down)
    ctx.fillStyle = '#FFF';
    ctx.font = `bold 16px ${canvasFontFamily}`;
    ctx.textAlign = 'center';
    ctx.shadowBlur = 5;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
    ctx.fillText(t.canvas.sunSpace, width / 2, 140);
    ctx.fillText(t.canvas.sunVacuumNote, width / 2, 160);
    ctx.shadowBlur = 0;

    // Smooth radiation beams traveling through space
    const beamCount = 12;
    for (let i = 0; i < beamCount; i++) {
      const baseOffset = (time * 200 + i * 50) % (width - 350);
      const beamX = 200 + baseOffset;
      const beamProgress = baseOffset / (width - 350);
      
      // Beam head (bright)
      const headAlpha = Math.sin(beamProgress * Math.PI) * 0.9;
      // Shift beams down (y: 125 -> 145)
      const beamGradient = ctx.createLinearGradient(beamX - 30, 145, beamX + 30, 145);
      beamGradient.addColorStop(0, 'rgba(255, 200, 0, 0)');
      beamGradient.addColorStop(0.4, `rgba(255, 220, 0, ${headAlpha})`);
      beamGradient.addColorStop(0.6, `rgba(255, 180, 0, ${headAlpha})`);
      beamGradient.addColorStop(1, 'rgba(255, 200, 0, 0)');
      
      ctx.fillStyle = beamGradient;
      ctx.fillRect(beamX - 30, 140, 60, 10);
      
      // Beam glow
      ctx.save();
      ctx.globalAlpha = headAlpha * 0.3;
      ctx.shadowBlur = 15;
      ctx.shadowColor = 'rgba(255, 200, 0, 0.8)';
      ctx.fillStyle = 'rgba(255, 200, 0, 0.5)';
      ctx.fillRect(beamX - 20, 142, 40, 6);
      ctx.restore();
    }

    // Earth with atmosphere
    const earthX = width - 150;
    // Shift Earth down to align with lowered sun/beams (y: 125 -> 165)
    const earthY = 165;
    
    // Atmosphere glow
    const atmosphereGlow = ctx.createRadialGradient(earthX, earthY, 50, earthX, earthY, 75);
    atmosphereGlow.addColorStop(0, 'rgba(100, 150, 255, 0)');
    atmosphereGlow.addColorStop(0.7, 'rgba(100, 150, 255, 0.2)');
    atmosphereGlow.addColorStop(1, 'rgba(100, 150, 255, 0)');
    ctx.fillStyle = atmosphereGlow;
    ctx.beginPath();
    ctx.arc(earthX, earthY, 75, 0, Math.PI * 2);
    ctx.fill();
    
    // Earth with rotation effect
    const earthGradient = ctx.createRadialGradient(
      earthX - 15, earthY - 15, 10,
      earthX, earthY, 60
    );
    earthGradient.addColorStop(0, '#87CEEB');
    earthGradient.addColorStop(0.3, '#4169E1');
    earthGradient.addColorStop(0.6, '#228B22');
    earthGradient.addColorStop(0.8, '#1E90FF');
    earthGradient.addColorStop(1, '#000080');
    ctx.fillStyle = earthGradient;
    ctx.beginPath();
    ctx.arc(earthX, earthY, 60, 0, Math.PI * 2);
    ctx.fill();
    
    // Clouds on Earth
    for (let i = 0; i < 5; i++) {
      const cloudAngle = (time * 0.2 + i * 1.2) % (Math.PI * 2);
      const cloudRadius = 45 + (i % 2) * 10;
      const cloudX = earthX + Math.cos(cloudAngle) * cloudRadius;
      const cloudY = earthY + Math.sin(cloudAngle) * cloudRadius;
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.arc(cloudX, cloudY, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Labels with subtle glow
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold 18px ${canvasFontFamily}`;
    ctx.textAlign = 'center';
    ctx.shadowBlur = 5;
    ctx.shadowColor = 'rgba(255, 200, 0, 0.8)';
    // Shifted labels down to stay close to moved objects
    ctx.fillText(t.canvas.sunLabel, 150, 220);
    ctx.shadowColor = 'rgba(0, 150, 255, 0.8)';
    ctx.fillText(t.canvas.earthLabel, earthX, 250);
    ctx.shadowBlur = 0;
    
    ctx.fillStyle = '#FF8C00';
    ctx.font = `bold 16px ${canvasFontFamily}`;
    const textPulse = 0.8 + Math.sin(time * 2) * 0.2;
    ctx.globalAlpha = textPulse;
    ctx.fillText(t.canvas.sunDistanceNote, width / 2, height - 30);
    ctx.globalAlpha = 1;
  };

  const drawUtensilCooling = (ctx: CanvasRenderingContext2D) => {
    // Hot utensil with metallic sheen
    const metalGradient = ctx.createLinearGradient(width / 2 - 60, height / 2 - 40, width / 2 + 60, height / 2 + 40);
    metalGradient.addColorStop(0, '#E8E8E8');
    metalGradient.addColorStop(0.3, '#C0C0C0');
    metalGradient.addColorStop(0.5, '#A9A9A9');
    metalGradient.addColorStop(0.7, '#C0C0C0');
    metalGradient.addColorStop(1, '#D3D3D3');
    ctx.fillStyle = metalGradient;
    ctx.fillRect(width / 2 - 60, height / 2 - 40, 120, 80);
    
    // Inner pot
    const innerGradient = ctx.createLinearGradient(width / 2, height / 2 - 30, width / 2, height / 2 + 30);
    innerGradient.addColorStop(0, '#A9A9A9');
    innerGradient.addColorStop(0.5, '#808080');
    innerGradient.addColorStop(1, '#696969');
    ctx.fillStyle = innerGradient;
    ctx.fillRect(width / 2 - 50, height / 2 - 30, 100, 60);

    // Smooth temperature decay
    const coolingRate = 0.15; // Temperature drops by this per second
    const maxTemp = 100;
    const minTemp = 25;
    const temp = Math.max(minTemp, maxTemp - time * coolingRate * 10);
    const glowIntensity = (temp - minTemp) / (maxTemp - minTemp);
    
    // Multi-layered heat glow with smooth falloff
    for (let layer = 0; layer < 3; layer++) {
      const layerRadius = 80 + layer * 40;
      const layerIntensity = glowIntensity * (1 - layer * 0.25);
      const pulse = 1 + Math.sin(time * 2 + layer) * 0.1;
      
      const glowGradient = ctx.createRadialGradient(
        width / 2, height / 2, 30,
        width / 2, height / 2, layerRadius * pulse
      );
      glowGradient.addColorStop(0, `rgba(255, ${100 + layerIntensity * 100}, 0, ${layerIntensity * 0.4})`);
      glowGradient.addColorStop(0.5, `rgba(255, ${100 + layerIntensity * 50}, 0, ${layerIntensity * 0.2})`);
      glowGradient.addColorStop(1, 'rgba(255, 100, 0, 0)');
      ctx.fillStyle = glowGradient;
      ctx.fillRect(0, 0, width, height);
    }

    // Smooth expanding radiation waves
    if (glowIntensity > 0.1) {
      for (let i = 0; i < 8; i++) {
        const waveTime = time * 80 + i * 30;
        const waveRadius = (waveTime % 250) + 50;
        const waveProgress = ((waveTime % 250) / 250);
        const waveAlpha = Math.sin(waveProgress * Math.PI) * glowIntensity * 0.5;
        
        ctx.save();
        ctx.globalAlpha = waveAlpha;
        ctx.strokeStyle = `hsl(${20 - waveProgress * 20}, 100%, ${50 + waveProgress * 20}%)`;
        ctx.lineWidth = 3 * (1 - waveProgress);
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(255, 100, 0, 0.3)';
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, waveRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }

    // Heat shimmer particles rising
    if (glowIntensity > 0.2) {
      for (let i = 0; i < 10; i++) {
        const shimmerX = width / 2 + (Math.sin(time * 2 + i) * 40);
        const shimmerY = height / 2 - ((time * 30 + i * 20) % 100);
        const shimmerAlpha = glowIntensity * (1 - ((time * 30 + i * 20) % 100) / 100);
        
        ctx.save();
        ctx.globalAlpha = shimmerAlpha * 0.4;
        ctx.fillStyle = '#FFA500';
        ctx.beginPath();
        ctx.arc(shimmerX, shimmerY, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Temperature display with smooth number animation
    const displayTemp = Math.round(temp);
    const tempColor = temp > 60 ? '#FF4500' : temp > 40 ? '#FF8C00' : '#000';
    
    ctx.save();
    ctx.fillStyle = tempColor;
    ctx.font = `bold 32px ${canvasFontFamily}`;
    ctx.textAlign = 'center';
    ctx.shadowBlur = 8;
    ctx.shadowColor = temp > 50 ? 'rgba(255, 100, 0, 0.5)' : 'rgba(0, 0, 0, 0.2)';
    ctx.fillText(`${displayTemp}°C`, width / 2, height / 2 + 15);
    ctx.restore();

    // Labels
    ctx.fillStyle = '#000';
    ctx.font = `bold 18px ${canvasFontFamily}`;
    ctx.textAlign = 'center';
    ctx.shadowBlur = 3;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.fillText(t.canvas.utensilTitle, width / 2, 50);
    ctx.shadowBlur = 0;
    
    ctx.fillStyle = '#FF4500';
    ctx.font = `bold 16px ${canvasFontFamily}`;
    const labelPulse = 0.7 + Math.sin(time * 2) * 0.3;
    ctx.globalAlpha = labelPulse * glowIntensity;
    ctx.fillText(t.canvas.utensilLabel, width / 2, height - 30);
    ctx.globalAlpha = 1;
  };

  const drawColorAbsorption = (ctx: CanvasRenderingContext2D) => {
    // Animated sun with corona
    const coronaPulse = 1 + Math.sin(time * 1.5) * 0.1;
    const coronaGlow = ctx.createRadialGradient(width / 2, 80, 20, width / 2, 80, 60 * coronaPulse);
    coronaGlow.addColorStop(0, 'rgba(255, 255, 200, 0.6)');
    coronaGlow.addColorStop(0.5, 'rgba(255, 215, 0, 0.3)');
    coronaGlow.addColorStop(1, 'rgba(255, 165, 0, 0)');
    ctx.fillStyle = coronaGlow;
    ctx.beginPath();
    ctx.arc(width / 2, 80, 60 * coronaPulse, 0, Math.PI * 2);
    ctx.fill();
    
    // Sun
    const sunGradient = ctx.createRadialGradient(width / 2, 80, 0, width / 2, 80, 40);
    sunGradient.addColorStop(0, '#FFFACD');
    sunGradient.addColorStop(0.6, '#FFD700');
    sunGradient.addColorStop(1, '#FFA500');
    ctx.fillStyle = sunGradient;
    ctx.beginPath();
    ctx.arc(width / 2, 80, 40, 0, Math.PI * 2);
    ctx.fill();

    // Animated sun rays
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 + time * 0.3;
      const rayPulse = Math.sin(time * 3 + i) * 0.3 + 0.7;
      
      ctx.save();
      ctx.globalAlpha = rayPulse;
      ctx.strokeStyle = '#FFA500';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(255, 165, 0, 0.4)';
      ctx.beginPath();
      ctx.moveTo(width / 2 + Math.cos(angle) * 45, 80 + Math.sin(angle) * 45);
      ctx.lineTo(width / 2 + Math.cos(angle) * 65, 80 + Math.sin(angle) * 65);
      ctx.stroke();
      ctx.restore();
    }

    // Smooth radiation beams coming down to white cloth
    for (let i = 0; i < 15; i++) {
      const x = 100 + i * 14;
      const beamPhase = (time * 60 + i * 10) % 160;
      const beamY = 140 + beamPhase;
      const beamProgress = beamPhase / 160;
      const beamAlpha = Math.sin(beamProgress * Math.PI) * 0.7;
      
      ctx.save();
      ctx.globalAlpha = beamAlpha;
      const beamGradient = ctx.createLinearGradient(x, beamY - 15, x, beamY + 15);
      beamGradient.addColorStop(0, 'rgba(255, 220, 0, 0)');
      beamGradient.addColorStop(0.5, 'rgba(255, 200, 0, 1)');
      beamGradient.addColorStop(1, 'rgba(255, 220, 0, 0)');
      ctx.strokeStyle = beamGradient;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x, beamY - 15);
      ctx.lineTo(x, beamY + 15);
      ctx.stroke();
      ctx.restore();
    }

    // White cloth with fabric texture
    const whiteGradient = ctx.createLinearGradient(100, 300, 300, 450);
    whiteGradient.addColorStop(0, '#FFFFFF');
    whiteGradient.addColorStop(0.5, '#F5F5F5');
    whiteGradient.addColorStop(1, '#EBEBEB');
    ctx.fillStyle = whiteGradient;
    ctx.fillRect(100, 300, 200, 150);
    
    // Cloth border
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.strokeRect(100, 300, 200, 150);

    // Reflection arrows from white cloth (smooth animation)
    for (let i = 0; i < 5; i++) {
      const x = 130 + i * 40;
      const reflectPhase = (time * 70 + i * 20) % 100;
      const reflectY = 300 - reflectPhase;
      const reflectProgress = reflectPhase / 100;
      const reflectAlpha = Math.sin(reflectProgress * Math.PI) * 0.8;
      
      ctx.save();
      ctx.globalAlpha = reflectAlpha;
      const reflectGradient = ctx.createLinearGradient(x, reflectY + 20, x, reflectY - 20);
      reflectGradient.addColorStop(0, 'rgba(255, 220, 0, 0)');
      reflectGradient.addColorStop(0.5, 'rgba(255, 200, 100, 1)');
      reflectGradient.addColorStop(1, 'rgba(255, 220, 0, 0)');
      ctx.strokeStyle = reflectGradient;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(255, 200, 0, 0.5)';
      
      ctx.beginPath();
      ctx.moveTo(x, reflectY + 20);
      ctx.lineTo(x, reflectY - 20);
      ctx.stroke();
      
      // Arrow head
      ctx.fillStyle = reflectGradient;
      ctx.beginPath();
      ctx.moveTo(x, reflectY - 20);
      ctx.lineTo(x - 6, reflectY - 10);
      ctx.lineTo(x + 6, reflectY - 10);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // Radiation beams to black cloth
    for (let i = 0; i < 15; i++) {
      const x = width - 300 + i * 14;
      const beamPhase = (time * 60 + i * 10) % 160;
      const beamY = 140 + beamPhase;
      const beamProgress = beamPhase / 160;
      const beamAlpha = Math.sin(beamProgress * Math.PI) * 0.7;
      
      ctx.save();
      ctx.globalAlpha = beamAlpha;
      const beamGradient = ctx.createLinearGradient(x, beamY - 15, x, beamY + 15);
      beamGradient.addColorStop(0, 'rgba(255, 220, 0, 0)');
      beamGradient.addColorStop(0.5, 'rgba(255, 200, 0, 1)');
      beamGradient.addColorStop(1, 'rgba(255, 220, 0, 0)');
      ctx.strokeStyle = beamGradient;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x, beamY - 15);
      ctx.lineTo(x, beamY + 15);
      ctx.stroke();
      ctx.restore();
    }

    // Black cloth with fabric texture
    const blackGradient = ctx.createLinearGradient(width - 300, 300, width - 100, 450);
    blackGradient.addColorStop(0, '#1A1A1A');
    blackGradient.addColorStop(0.5, '#000000');
    blackGradient.addColorStop(1, '#0A0A0A');
    ctx.fillStyle = blackGradient;
    ctx.fillRect(width - 300, 300, 200, 150);
    
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 3;
    ctx.strokeRect(width - 300, 300, 200, 150);

    // Heat absorption glow from black (pulsing)
    const absorbPulse = 0.8 + Math.sin(time * 2) * 0.2;
    const absorbGradient = ctx.createRadialGradient(
      width - 200, 375, 40,
      width - 200, 375, 140 * absorbPulse
    );
    absorbGradient.addColorStop(0, 'rgba(255, 100, 0, 0.5)');
    absorbGradient.addColorStop(0.5, 'rgba(255, 80, 0, 0.3)');
    absorbGradient.addColorStop(1, 'rgba(255, 100, 0, 0)');
    ctx.fillStyle = absorbGradient;
    ctx.beginPath();
    ctx.arc(width - 200, 375, 140 * absorbPulse, 0, Math.PI * 2);
    ctx.fill();
    
    // Heat shimmer above black cloth
    for (let i = 0; i < 8; i++) {
      const shimmerX = width - 250 + i * 20 + Math.sin(time * 3 + i) * 10;
      const shimmerY = 290 - ((time * 40 + i * 15) % 80);
      const shimmerAlpha = 1 - ((time * 40 + i * 15) % 80) / 80;
      
      ctx.save();
      ctx.globalAlpha = shimmerAlpha * 0.6;
      ctx.fillStyle = '#FF6347';
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(255, 100, 0, 0.5)';
      ctx.beginPath();
      ctx.arc(shimmerX, shimmerY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Labels
    ctx.fillStyle = '#000';
    ctx.font = `bold 20px ${canvasFontFamily}`;
    ctx.textAlign = 'center';
    ctx.shadowBlur = 5;
    ctx.shadowColor = 'rgba(255, 200, 0, 0.4)';
    ctx.fillText(t.canvas.colorSunLabel, width / 2, 30);
    ctx.shadowBlur = 0;
    
    ctx.font = `bold 18px ${canvasFontFamily}`;
    ctx.fillText(t.canvas.colorWhiteCloth, 200, 270);
    ctx.font = `15px ${canvasFontFamily}`;
    ctx.fillText(t.canvas.colorReflects, 200, 470);
    ctx.fillText(t.canvas.colorStaysCool, 200, 490);
   
    ctx.font = `bold 18px ${canvasFontFamily}`;
    ctx.fillStyle = '#FFF';
    ctx.shadowBlur = 3;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.fillText(t.canvas.colorBlackCloth, width - 200, 270);
    ctx.font = `15px ${canvasFontFamily}`;
    ctx.fillText(t.canvas.colorAbsorbs, width - 200, 470);
    ctx.fillText(t.canvas.colorBecomesHot, width - 200, 490);
    ctx.shadowBlur = 0;
  };

  const drawComparison = (ctx: CanvasRenderingContext2D) => {
    const boxWidth = width / 3 - 40;
    const boxHeight = height - 100;

    // CONDUCTION BOX
    ctx.fillStyle = '#FFE4E1';
    ctx.fillRect(20, 50, boxWidth, boxHeight);
    ctx.strokeStyle = '#FF6347';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 50, boxWidth, boxHeight);

    ctx.fillStyle = '#000';
    ctx.font = `bold 18px ${canvasFontFamily}`;
    ctx.textAlign = 'center';
    ctx.shadowBlur = 3;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.fillText(t.canvas.comparisonConduction, 20 + boxWidth / 2, 80);
    ctx.shadowBlur = 0;
    
    // Animated particles with heat transfer
    const particleCount = 6;
    for (let i = 0; i < particleCount; i++) {
      const baseX = 30 + i * (boxWidth - 20) / (particleCount - 1);
      const baseY = 150;
      
      // Heat intensity decreases along the chain
      const heatIntensity = Math.max(0, 1 - i / particleCount);
      const vibration = Math.sin(time * 10 + i * 0.5) * 3 * heatIntensity;
      
      const particleGradient = ctx.createRadialGradient(baseX, baseY, 0, baseX, baseY, 18);
      if (i < 2) {
        particleGradient.addColorStop(0, '#FFD700');
        particleGradient.addColorStop(0.5, '#FF6347');
        particleGradient.addColorStop(1, '#FF4500');
      } else {
        particleGradient.addColorStop(0, '#87CEEB');
        particleGradient.addColorStop(0.7, '#4682B4');
        particleGradient.addColorStop(1, '#1E90FF');
      }
      
      ctx.fillStyle = particleGradient;
      ctx.beginPath();
      ctx.arc(baseX, baseY + vibration, 15, 0, Math.PI * 2);
      ctx.fill();
      
      // Connection lines showing contact
      if (i < particleCount - 1) {
        ctx.strokeStyle = 'rgba(100, 100, 100, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(baseX + 15, baseY + vibration);
        const nextVib = Math.sin(time * 10 + (i + 1) * 0.5) * 3 * Math.max(0, 1 - (i + 1) / particleCount);
        ctx.lineTo(baseX + (boxWidth - 20) / (particleCount - 1) - 15, baseY + nextVib);
        ctx.stroke();
      }
      
      // Heat transfer animation
      if (i < particleCount - 1) {
        const transferPhase = (time * 2 + i * 0.3) % 1;
        const transferX = baseX + 15 + transferPhase * ((boxWidth - 20) / (particleCount - 1) - 30);
        ctx.save();
        ctx.globalAlpha = Math.sin(transferPhase * Math.PI) * heatIntensity;
        ctx.fillStyle = '#FF8C00';
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(255, 140, 0, 0.5)';
        ctx.beginPath();
        ctx.arc(transferX, baseY, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
    
    ctx.fillStyle = '#333';
    ctx.font = `13px ${canvasFontFamily}`;
    ctx.fillText(t.canvas.comparisonNeedsDirect, 20 + boxWidth / 2, 210);
    ctx.fillText(t.canvas.comparisonContact, 20 + boxWidth / 2, 230);
    ctx.fillText(t.canvas.comparisonSolidMedium, 20 + boxWidth / 2, 250);

    // CONVECTION BOX
    ctx.fillStyle = '#E0F2F7';
    ctx.fillRect(width / 3 + 10, 50, boxWidth, boxHeight);
    ctx.strokeStyle = '#2196F3';
    ctx.lineWidth = 3;
    ctx.strokeRect(width / 3 + 10, 50, boxWidth, boxHeight);

    ctx.fillStyle = '#000';
    ctx.font = `bold 18px ${canvasFontFamily}`;
    ctx.shadowBlur = 3;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.fillText(t.canvas.comparisonConvection, width / 3 + 10 + boxWidth / 2, 80);
    ctx.shadowBlur = 0;
    
    // Circular convection current animation
    const centerX = width / 3 + 10 + boxWidth / 2;
    const centerY = 150;
    const radius = 50;
    
    // Draw flowing particles in circular path
    for (let i = 0; i < 8; i++) {
      const angle = (time * 1.5 + i * Math.PI / 4) % (Math.PI * 2);
      const particleX = centerX + Math.cos(angle) * radius;
      const particleY = centerY + Math.sin(angle) * radius * 0.6; // Elliptical path
      
      const isHot = angle < Math.PI; // Top half is hot
      const particleGradient = ctx.createRadialGradient(particleX, particleY, 0, particleX, particleY, 8);
      
      if (isHot) {
        particleGradient.addColorStop(0, '#FF6347');
        particleGradient.addColorStop(1, 'rgba(255, 99, 71, 0)');
      } else {
        particleGradient.addColorStop(0, '#4682B4');
        particleGradient.addColorStop(1, 'rgba(70, 130, 180, 0)');
      }
      
      ctx.save();
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = particleGradient;
      ctx.beginPath();
      ctx.arc(particleX, particleY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    
    // Convection current path
    ctx.strokeStyle = 'rgba(33, 150, 243, 0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radius, radius * 0.6, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Direction arrows
    drawArrowHead(ctx, centerX, centerY - radius * 0.6, 0, '#FF6347');
    drawArrowHead(ctx, centerX + radius, centerY, Math.PI / 2, '#4682B4');
    drawArrowHead(ctx, centerX, centerY + radius * 0.6, Math.PI, '#4682B4');
    drawArrowHead(ctx, centerX - radius, centerY, -Math.PI / 2, '#FF6347');

    ctx.fillStyle = '#333';
    ctx.font = `13px ${canvasFontFamily}`;
    ctx.fillText(t.canvas.comparisonNeedsParticles, centerX, 220);
    ctx.fillText(t.canvas.comparisonMovement, centerX, 240);
    ctx.fillText(t.canvas.comparisonFluidMedium, centerX, 260);

    // RADIATION BOX
    ctx.fillStyle = '#FFF9E6';
    ctx.fillRect(width * 2/3, 50, boxWidth, boxHeight);
    ctx.strokeStyle = '#FF9800';
    ctx.lineWidth = 3;
    ctx.strokeRect(width * 2/3, 50, boxWidth, boxHeight);

    ctx.fillStyle = '#000';
    ctx.font = `bold 18px ${canvasFontFamily}`;
    ctx.shadowBlur = 3;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.fillText(t.canvas.comparisonRadiation, width * 2/3 + boxWidth / 2, 80);
    ctx.shadowBlur = 0;
    
    // Hot source on left
    const sourceX = width * 2/3 + 30;
    const sourceY = 150;
    
    const sourceGradient = ctx.createRadialGradient(sourceX, sourceY, 5, sourceX, sourceY, 20);
    sourceGradient.addColorStop(0, '#FFD700');
    sourceGradient.addColorStop(0.7, '#FF8C00');
    sourceGradient.addColorStop(1, '#FF6347');
    ctx.fillStyle = sourceGradient;
    ctx.beginPath();
    ctx.arc(sourceX, sourceY, 20, 0, Math.PI * 2);
    ctx.fill();
    
    // Smooth wavy radiation lines traveling
    for (let i = 0; i < 6; i++) {
      const wavePhase = (time * 100 + i * 25) % (boxWidth - 80);
      const waveProgress = wavePhase / (boxWidth - 80);
      const waveAlpha = Math.sin(waveProgress * Math.PI) * 0.8;
      
      ctx.save();
      ctx.globalAlpha = waveAlpha;
      ctx.strokeStyle = `hsl(${30 + waveProgress * 30}, 100%, ${50 + waveProgress * 20}%)`;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(255, 152, 0, 0.3)';
      
      ctx.beginPath();
      const startX = sourceX + 25;
      for (let x = 0; x < wavePhase; x += 3) {
        const waveY = sourceY + Math.sin((x + time * 50) * 0.1) * 10;
        if (x === 0) {
          ctx.moveTo(startX + x, waveY);
        } else {
          ctx.lineTo(startX + x, waveY);
        }
      }
      ctx.stroke();
      ctx.restore();
    }

    ctx.fillStyle = '#333';
    ctx.font = `13px ${canvasFontFamily}`;
    ctx.fillText(t.canvas.comparisonNoMedium, width * 2/3 + boxWidth / 2, 230);
    ctx.fillText(t.canvas.comparisonNeeded, width * 2/3 + boxWidth / 2, 250);
    ctx.fillText(t.canvas.comparisonWorksVacuum, width * 2/3 + boxWidth / 2, 270);
  };

  const drawDefaultAnimation = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#000';
    ctx.font = `bold 24px ${canvasFontFamily}`;
    ctx.textAlign = 'center';
    ctx.fillText(t.canvas.defaultTitle, width / 2, height / 2);
  };

  const drawPerson = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    // Head
    ctx.fillStyle = '#FFD7A6';
    ctx.beginPath();
    ctx.arc(x, y - 40, 20, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.strokeStyle = '#2196F3';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(x, y - 20);
    ctx.lineTo(x, y + 20);
    ctx.stroke();

    // Arms
    ctx.beginPath();
    ctx.moveTo(x - 20, y);
    ctx.lineTo(x + 20, y);
    ctx.stroke();

    // Legs
    ctx.beginPath();
    ctx.moveTo(x, y + 20);
    ctx.lineTo(x - 15, y + 50);
    ctx.moveTo(x, y + 20);
    ctx.lineTo(x + 15, y + 50);
    ctx.stroke();
  };

  const drawArrowHead = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    angle: number,
    color: string
  ) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 8 * Math.cos(angle - Math.PI / 6), y - 8 * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(x - 8 * Math.cos(angle + Math.PI / 6), y - 8 * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
  };

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setAnimationFrame(0);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      setAnimationFrame(0);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (setStopAutoNext) {
      setStopAutoNext(isPlaying);
    }
  };

  const reset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(true);
    setAnimationFrame(0);
    if (setStopAutoNext) {
      setStopAutoNext(false);
    }
  };

  return (
    <div
      className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden"
      style={{ fontFamily: getFontFamilyForLanguage(language) }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Radio className="w-8 h-8" />
              <h1 className="text-2xl sm:text-3xl font-bold">{t.headerTitle}</h1>
            </div>
            <p className="text-orange-100 text-sm sm:text-base">{t.headerSubtitle}</p>
          </div>
          <div className="text-right">
            <div className="text-xs sm:text-sm opacity-90">
              {t.stepLabel} {currentStepIndex + 1} {t.ofLabel} {steps.length}
            </div>
            <div className="text-xs opacity-75 mt-1">
              {t.stepTypeLabels[currentStep.type]}
            </div>
          </div>
        </div>

        <div className="mt-4 bg-white bg-opacity-20 rounded-full h-2 overflow-hidden">
          <div
            className="h-2 bg-white rounded-full transition-all duration-500"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 md:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
          {stepTexts[currentStepIndex]?.title}
        </h2>

        {currentStep.animationData?.experiment === 'heating_water' ? (
          <div className="mb-6 rounded-xl p-4 border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
            <HeatingWaterAnimation language={language} translations={t.heatingWater} />
          </div>
        ) : (
          <div
            className={`mb-6 rounded-xl p-4 border-2 border-orange-200 ${
              currentStep.animationData?.experiment === 'sun_heat'
                ? 'bg-[radial-gradient(circle_at_top,_#111827,_#020617)]'
                : 'bg-gradient-to-br from-orange-50 to-red-50'
            }`}
          >
            <canvas
              ref={canvasRef}
              width={width}
              height={height}
              className={`w-full rounded-lg shadow-md ${
                currentStep.animationData?.experiment === 'sun_heat'
                  ? 'bg-transparent'
                  : 'bg-white'
              }`}
            />
          </div>
        )}

        <div className="bg-gradient-to-r from-orange-50 to-pink-50 p-6 rounded-xl border-l-4 border-orange-500">
          <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
            {stepTexts[currentStepIndex]?.description}
          </p>
        </div>

        {currentStep.type === 'real_world' && (
          <div className="mt-4 bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-xl">
            <div className="flex items-center gap-2 text-purple-800 font-semibold">
              <Sun className="w-5 h-5" />
              {t.realWorldBadge}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-50 p-4 sm:p-6 border-t border-gray-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={prevStep}
            disabled={currentStepIndex === 0}
            className="flex items-center justify-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition"
          >
            <ChevronLeft className="w-5 h-5" />
            {t.controls.previous}
          </button>

          <div className="flex gap-3 justify-center">
            <button
              onClick={togglePlay}
              className="flex items-center justify-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isPlaying ? t.controls.pause : t.controls.play}
            </button>

            <button
              onClick={reset}
              className="flex items-center justify-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition"
            >
              <RotateCcw className="w-5 h-5" />
              {t.controls.reset}
            </button>
          </div>

          <button
            onClick={nextStep}
            disabled={currentStepIndex === steps.length - 1}
            className="flex items-center justify-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-orange-700 hover:to-red-700 transition"
          >
            {t.controls.next}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Export as named export
export { RadiationLearnMode };

// Consolidated Radiation Learning Component
// This file consolidates all radiation-related components into a single file

// LanguageProvider and useLanguage are now defined at the top of the file

// ============================================================================
// Language Selector Component (inline)
// ============================================================================
const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'en', name: t('language.en'), flag: '🇬🇧' },
    { code: 'hi', name: t('language.hi'), flag: '🇮🇳' },
    { code: 'gu', name: t('language.gu'), flag: '🇮🇳' },
  ];

  return (
    <div className="relative">
      <select
        aria-label={t('language.selectorLabel')}
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="appearance-none bg-white border-2 border-teal-500 rounded-lg px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 pr-6 sm:pr-8 w-40 sm:w-48 md:w-56 text-xs sm:text-sm md:text-base text-teal-700 font-medium cursor-pointer hover:border-purple-500 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-300"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 sm:px-2">
        <svg className="fill-current h-3 w-3 sm:h-4 sm:w-4 text-teal-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};

// ============================================================================
// Navbar Component (inline)
// ============================================================================
interface NavbarProps {
  mode: 'learn' | 'practice' | 'applications';
  setMode: (mode: 'learn' | 'practice' | 'applications') => void;
}

const Navbar: React.FC<NavbarProps> = ({ mode, setMode }) => {
  const { t } = useLanguage();

  const isLearn = mode === 'learn';
  const isPractice = mode === 'practice';
  const isApplications = mode === 'applications';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-teal-50 via-purple-50 to-teal-50 border-b border-teal-200/50 shadow-sm backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex-shrink-0 flex items-center gap-1 sm:gap-2">
            <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" aria-hidden="true" />
            <span className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent">
              {t('nav.logo')}
            </span>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              type="button"
              onClick={() => setMode('learn')}
              className={`px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                isLearn
                  ? 'bg-teal-500 text-white shadow-md'
                  : 'text-teal-700 hover:bg-teal-100/50'
              }`}
            >
              <span className="hidden sm:inline">📚 </span>
              <span className="sm:hidden">📚</span>
              <span className="hidden md:inline ml-1">{t('nav.tabs.learn')}</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('practice')}
              className={`px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                isPractice
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'text-purple-700 hover:bg-purple-100/50'
              }`}
            >
              <span className="hidden sm:inline">🎯 </span>
              <span className="sm:hidden">🎯</span>
              <span className="hidden md:inline ml-1">{t('nav.tabs.practice')}</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('applications')}
              className={`px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                isApplications
                  ? 'bg-gradient-to-r from-teal-500 to-purple-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100/50'
              }`}
            >
              <span className="hidden sm:inline">🌍 </span>
              <span className="sm:hidden">🌍</span>
              <span className="hidden lg:inline ml-1">{t('nav.tabs.applications')}</span>
            </button>

            <div className="ml-1 sm:ml-2 md:ml-4">
              <LanguageSelector />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

// ============================================================================
// Main RadiationLearning Component (Router)
// ============================================================================
interface RadiationLearningProps {
  mode: 'learn' | 'practice' | 'applications';
  setMode: (mode: 'learn' | 'practice' | 'applications') => void;
}

const RadiationLearning: React.FC<RadiationLearningProps> = ({ mode, setMode }) => {
  return (
    <>
      <Navbar mode={mode} setMode={setMode} />
      <div className="pt-14 sm:pt-16 px-2 sm:px-3 md:px-4 lg:px-6 pb-4 sm:pb-6">
        {mode === 'practice' && <RadiationPracticeMode />}
        {mode === 'applications' && <RadiationRealWorld />}
        {mode === 'learn' && <RadiationLearnMode />}
      </div>
    </>
  );
};


// Imports already at top of file

interface Application {
  id: number;
  title: string;
  category: "nature" | "home" | "everyday" | "technology" | "clothing";
  description: string;
  howItWorks: string;
  scienceBehind: string;
  realExample: string;
  benefits: string[];
  difficulty: "everyday" | "nature" | "technology";
  icon: string;
}

interface RadiationRealWorldProps {
  props?: {
    language?: LanguageCode;
  };
}

interface RealWorldTranslations {
  headerTitle: string;
  headerSubtitle: string;
  categories: {
    all: string;
    nature: string;
    home: string;
    everyday: string;
    technology: string;
    clothing: string;
  };
  showingCount: (count: number) => string;
  difficultyLabels: {
    everyday: string;
    nature: string;
    technology: string;
  };
  sectionTitles: {
    whatIsIt: string;
    howItWorks: string;
    scienceBehind: string;
    realExample: string;
    benefits: string;
  };
  summaryTitle: string;
  summaryCards: {
    noMediumTitle: string;
    noMediumBody: string;
    allObjectsTitle: string;
    allObjectsBody: string;
    emWavesTitle: string;
    emWavesBody: string;
  };
  applications: Application[];
}

interface RealWorldTranslationsType {
  en: RealWorldTranslations;
  hi: RealWorldTranslations;
  gu: RealWorldTranslations;
}

const realWorldTranslations: RealWorldTranslationsType = {
  en: {
    headerTitle: "Radiation in the Real World",
    headerSubtitle: "Discover How Radiation Works in Daily Life",
    categories: {
      all: "All Applications",
      nature: "Nature",
      home: "Home",
      everyday: "Everyday",
      technology: "Technology",
      clothing: "Clothing",
    },
    showingCount: (count: number) =>
      `Showing ${count} application${count !== 1 ? "s" : ""}`,
    difficultyLabels: {
      everyday: "Everyday Life",
      nature: "Natural Process",
      technology: "Technology",
    },
    sectionTitles: {
      whatIsIt: "What Is It?",
      howItWorks: "How It Works",
      scienceBehind: "Science Behind It",
      realExample: "Real Indian Example",
      benefits: "Benefits & Importance",
    },
    summaryTitle: "Key Insights About Radiation",
    summaryCards: {
      noMediumTitle: "No Medium Needed",
      noMediumBody:
        "Radiation can travel through vacuum - unlike conduction and convection which require a medium with particles.",
      allObjectsTitle: "All Objects Radiate",
      allObjectsBody:
        "Every object above absolute zero radiates heat. Hotter objects radiate more intensely than cooler ones.",
      emWavesTitle: "Electromagnetic Waves",
      emWavesBody:
        "Heat radiation travels as infrared electromagnetic waves at the speed of light (300,000 km/s).",
    },
    applications: [
      {
        id: 1,
        title: "Feeling Warmth from Fireplace",
        category: "home",
        description:
          "When Pema and Palden sat around the fireplace in Gangtok, they felt warm even without touching the fire. This warmth traveled directly from the fire to them through radiation - no medium needed!",
        howItWorks:
          "The fire emits heat radiation in all directions. This radiation travels through the air (but doesn't need the air!) and reaches people sitting nearby. When this radiation hits your skin, it transfers energy and you feel warm.",
        scienceBehind:
          "Radiation travels as electromagnetic waves (infrared). These waves don't require particles to travel - they can even go through vacuum! The hotter the fire (higher temperature), the more radiation it emits.",
        realExample:
          "Across India, from Himalayan regions using bukhari (traditional heaters) to coastal areas with bonfires, people experience radiation warmth. In Sikkim, families gather around fireplaces during winter, feeling the heat directly without any contact.",
        benefits: [
          "Can feel warmth from a distance without touching hot objects",
          "Works even when air is still (no convection needed)",
          "Provides instant warmth as soon as fire starts",
          "Can warm multiple people in different directions simultaneously",
        ],
        difficulty: "everyday",
        icon: "🔥",
      },
      {
        id: 2,
        title: "Sun's Energy Reaching Earth",
        category: "nature",
        description:
          "The Sun is 150 million kilometers away from Earth, with empty space (vacuum) in between. Yet we feel the Sun's warmth every day! This incredible journey happens entirely through radiation.",
        howItWorks:
          "The Sun emits enormous amounts of heat and light as radiation. This radiation travels through the complete vacuum of space - where there are NO particles at all - and reaches Earth in about 8 minutes, traveling at the speed of light (300,000 km/second).",
        scienceBehind:
          "Solar radiation includes visible light, infrared (heat), and ultraviolet rays. Unlike conduction (needs contact) and convection (needs particle movement), radiation requires NO medium. It's pure energy transfer through electromagnetic waves.",
        realExample:
          "Kerala receives intense solar radiation near the equator, making it warmer than Gangtok (as Palden noticed!). Solar radiation drives India's agriculture through photosynthesis, powers solar panels across Gujarat and Rajasthan, and causes the monsoon through differential heating.",
        benefits: [
          "Provides all energy for life on Earth through photosynthesis",
          "Drives weather patterns and water cycle (evaporation)",
          "Enables vitamin D production in human skin",
          "Source of clean solar energy for electricity",
        ],
        difficulty: "nature",
        icon: "☀️",
      },
      {
        id: 3,
        title: "White vs Dark Clothes",
        category: "clothing",
        description:
          "Why do we wear white clothes in summer and dark clothes in winter? It's all about how different colors interact with heat radiation - reflecting or absorbing it!",
        howItWorks:
          "Light colors (white, cream) REFLECT most incoming heat radiation back into the environment. Dark colors (black, navy) ABSORB most heat radiation and convert it to internal heat energy.",
        scienceBehind:
          "When radiation hits a surface, it can be reflected, absorbed, or transmitted. White surfaces reflect up to 80-90% of radiation, while black surfaces absorb 80-90%. Absorbed radiation becomes heat energy in the material.",
        realExample:
          "In Rajasthan's desert regions, people traditionally wear white clothing to stay cool under intense sun (45°C). In Ladakh's cold winters (-20°C), dark clothing helps absorb any available solar radiation for warmth. Indian cricket team wears whites in Test matches played during hot days!",
        benefits: [
          "White in summer: Stays 5-10°C cooler than dark clothes",
          "Dark in winter: Absorbs solar heat, providing natural warmth",
          "Simple, no-energy solution for thermal comfort",
          "Traditional Indian clothing follows this principle",
        ],
        difficulty: "everyday",
        icon: "👕",
      },
      {
        id: 4,
        title: "Drying Clothes in Sunlight",
        category: "everyday",
        description:
          "Wet clothes dry much faster on a sunny day compared to a cloudy day. The Sun's radiation heats the water in clothes, causing rapid evaporation - a daily example of radiation at work!",
        howItWorks:
          "Solar radiation travels through space and air to reach wet clothes. This radiation transfers energy to water molecules in the fabric, increasing their kinetic energy. Fast-moving water molecules escape as vapor (evaporation).",
        scienceBehind:
          "Evaporation rate depends on temperature. Solar radiation raises water temperature from ~25°C to 40-50°C on cloth surface. At higher temperatures, more water molecules have enough energy to break free and evaporate.",
        realExample:
          "Every Indian household practices this daily! Clothes hung in direct sunlight at noon (when solar radiation is strongest) dry in 2-3 hours, while in shade they may take 6-8 hours. In monsoon season (cloudy), clothes take even longer as radiation is blocked by clouds.",
        benefits: [
          "Saves electricity (no need for clothes dryers)",
          "Natural disinfection - UV rays in sunlight kill bacteria",
          "Free energy from the Sun",
          "Clothes smell fresh from outdoor drying",
        ],
        difficulty: "everyday",
        icon: "👔",
      },
      {
        id: 5,
        title: "Solar Cookers",
        category: "technology",
        description:
          "Solar cookers use mirrors to concentrate the Sun's radiation onto a cooking pot. Food gets cooked using only sunlight - no gas, no electricity, no smoke! Pure radiation cooking.",
        howItWorks:
          "Parabolic mirrors reflect and focus solar radiation onto a central point where the cooking pot is placed. This concentrated radiation can reach temperatures of 150-200°C, enough to cook rice, vegetables, and lentils.",
        scienceBehind:
          "Mirrors redirect radiation rays toward a focal point. When parallel radiation rays from the Sun hit a parabolic mirror, they all reflect to one spot. This concentration multiplies the radiation intensity by 50-100 times!",
        realExample:
          "Gujarat and Rajasthan have many solar cooker projects. Tulsi Chanrai Foundation provided solar cookers to villages in Gujarat. During summer, these cookers can prepare a full meal (dal, rice, vegetables) for a family of 4-5 in 2-3 hours using only sunlight!",
        benefits: [
          "Zero fuel cost - completely free cooking energy",
          "No smoke or indoor air pollution (unlike wood fires)",
          "Reduces deforestation (no need for firewood)",
          "Food retains more nutrients with slow solar cooking",
        ],
        difficulty: "technology",
        icon: "🍳",
      },
      {
        id: 6,
        title: "Greenhouse Effect on Earth",
        category: "nature",
        description:
          "Earth's atmosphere acts like a greenhouse, trapping heat radiation from the Sun. This natural process keeps our planet warm enough for life - without it, Earth would be frozen at -18°C!",
        howItWorks:
          "Solar radiation passes through the atmosphere and warms Earth's surface. Earth then radiates heat back as infrared radiation. Greenhouse gases (CO₂, water vapor, methane) trap some of this outgoing radiation, keeping Earth warm.",
        scienceBehind:
          "Visible light from Sun penetrates atmosphere easily. Earth absorbs it and re-emits as infrared (heat) radiation. Greenhouse gases are transparent to visible light but opaque to infrared - they trap the heat trying to escape.",
        realExample:
          "Natural greenhouse effect maintains India's livable temperatures. However, excessive CO₂ from vehicles and industry enhances this effect, causing global warming. This affects Indian monsoons and Himalayan glaciers like those near Gangtok.",
        benefits: [
          "Maintains Earth's average temperature at +15°C (instead of -18°C)",
          "Enables liquid water to exist on Earth's surface",
          "Makes agriculture and life possible",
          "Natural climate regulation system",
        ],
        difficulty: "nature",
        icon: "🌍",
      },
      {
        id: 7,
        title: "Thermal Imaging Cameras",
        category: "technology",
        description:
          "These special cameras can 'see' heat radiation that our eyes cannot detect. They create images based on infrared radiation emitted by objects, revealing temperature differences.",
        howItWorks:
          "All objects above absolute zero (-273°C) emit infrared radiation. Thermal cameras detect this radiation and convert it to visible images - hotter objects appear bright (red/white), cooler objects appear dark (blue/black).",
        scienceBehind:
          "Amount of infrared radiation emitted increases rapidly with temperature (Stefan-Boltzmann law: power ∝ T⁴). A surface at 37°C (body temperature) emits much more radiation than one at 27°C (room temperature).",
        realExample:
          "During COVID-19, thermal cameras detected fever at airports across India by sensing excess body heat radiation. Indian Army uses them at LOC for night surveillance. Firefighters in Mumbai use them to locate people in smoke-filled buildings - heat radiation passes through smoke!",
        benefits: [
          "Non-contact temperature measurement (important for COVID screening)",
          "Works in complete darkness (detects heat, not light)",
          "Can detect heat loss in buildings (energy audits)",
          "Medical diagnosis - detects inflammation and blood flow issues",
        ],
        difficulty: "technology",
        icon: "📷",
      },
      {
        id: 8,
        title: "Heat Radiation from Hot Utensils",
        category: "home",
        description:
          "A hot metal pot kept on the table (away from the stove) gradually cools down. Where does the heat go? It radiates away to the cooler surroundings - walls, air, table - through radiation!",
        howItWorks:
          "The hot utensil (say at 80°C) emits heat radiation in all directions. Cooler surroundings (at 25°C room temperature) absorb this radiation. The utensil keeps radiating until temperatures equalize.",
        scienceBehind:
          "ALL objects continuously radiate heat to surroundings. Hotter objects radiate more intensely. Net heat transfer occurs from hot to cold. A 80°C pot radiates about 16 times more power than a 25°C wall!",
        realExample:
          "After cooking, grandmother's hot kadhai gradually cools on the kitchen counter. You can feel heat radiating from it if you hold your hand nearby (without touching!). The metal emits infrared radiation that your skin senses as warmth.",
        benefits: [
          "Automatic cooling without any effort",
          "Radiation works alongside conduction and convection",
          "Can feel heat without direct contact (safety feature)",
          "Faster cooling for hot items due to radiation",
        ],
        difficulty: "everyday",
        icon: "🍲",
      },
      {
        id: 9,
        title: "Night Vision Technology",
        category: "technology",
        description:
          "Night vision devices let us 'see' in darkness by detecting infrared heat radiation from warm objects (humans, animals, vehicles) even when there's no visible light.",
        howItWorks:
          "Objects warmer than surroundings emit more infrared radiation. Night vision devices detect this invisible radiation, amplify the signal electronically, and display it as a green-tinted visible image.",
        scienceBehind:
          "Human body at 37°C emits peak radiation at wavelength 9.4 micrometers (infrared - invisible to eyes). Night vision detects wavelengths 0.7-14 micrometers, covering near and thermal infrared regions.",
        realExample:
          "Indian security forces use night vision at borders. Wildlife researchers in Jim Corbett National Park use thermal cameras to study nocturnal tigers without disturbing them. The cameras detect body heat radiation from tigers against cooler forest background.",
        benefits: [
          "Security and surveillance in complete darkness",
          "Wildlife observation without visible light disturbance",
          "Search and rescue operations at night",
          "Military operations and border patrol",
        ],
        difficulty: "technology",
        icon: "🌙",
      },
      {
        id: 10,
        title: "Earth's Energy Balance",
        category: "nature",
        description:
          "Earth receives radiation from the Sun and radiates heat back to space. These two radiation flows must balance, or Earth would keep heating up or cooling down continuously!",
        howItWorks:
          "Earth receives ~1360 W/m² solar radiation at top of atmosphere. About 30% is reflected back to space. Remaining 70% is absorbed, warms Earth, and is re-radiated as infrared radiation to space.",
        scienceBehind:
          "Incoming solar radiation (shortwave) = Outgoing terrestrial radiation (longwave) for stable temperature. Earth's average temperature adjusts until radiation out equals radiation in. Currently receiving ~240 W/m² net, radiating same amount back.",
        realExample:
          "This balance maintains Earth's climate. However, increasing greenhouse gases trap more outgoing radiation, causing warming. This affects Indian agriculture, water resources, and Himalayan ice. Scientists monitor this balance using satellites to understand climate change.",
        benefits: [
          "Maintains stable global average temperature (~15°C)",
          "Enables predictable seasons and climate patterns",
          "Allows life to adapt to stable conditions",
          "Understanding this helps predict climate change",
        ],
        difficulty: "nature",
        icon: "⚖️",
      },
    ],
  },
  hi: {
    headerTitle: "वास्तविक जीवन में विकिरण",
    headerSubtitle: "देखिए विकिरण हमारे दैनिक जीवन में कैसे काम करता है",
    categories: {
      all: "सभी उदाहरण",
      nature: "प्रकृति",
      home: "घर",
      everyday: "दैनिक जीवन",
      technology: "प्रौद्योगिकी",
      clothing: "कपड़े",
    },
    showingCount: (count: number) => `कुल ${count} उदाहरण दिखाए जा रहे हैं`,
    difficultyLabels: {
      everyday: "दैनिक जीवन",
      nature: "प्राकृतिक प्रक्रिया",
      technology: "प्रौद्योगिकी",
    },
    sectionTitles: {
      whatIsIt: "क्या है यह?",
      howItWorks: "यह कैसे काम करता है",
      scienceBehind: "इसके पीछे का विज्ञान",
      realExample: "भारतीय उदाहरण",
      benefits: "महत्त्व और लाभ",
    },
    summaryTitle: "विकिरण से जुड़ी मुख्य बातें",
    summaryCards: {
      noMediumTitle: "कोई माध्यम आवश्यक नहीं",
      noMediumBody:
        "विकिरण निर्वात में भी यात्रा कर सकता है, जबकि चालन और संवहन के लिए कणों वाला माध्यम आवश्यक होता है।",
      allObjectsTitle: "हर वस्तु विकिरण करती है",
      allObjectsBody:
        "पूर्ण शून्य से ऊपर तापमान वाली हर वस्तु ऊष्मा विकिरण करती है। जितनी अधिक गरम वस्तु होगी, उतना अधिक विकिरण करेगी।",
      emWavesTitle: "विद्युत-चुंबकीय तरंगें",
      emWavesBody:
        "ऊष्मा विकिरण अवरक्त (इन्फ्रारेड) विद्युत-चुंबकीय तरंगों के रूप में प्रकाश की चाल (300,000 km/s) से चलता है।",
    },
    applications: [
      {
        id: 1,
        title: "अंगीठी से गर्मी महसूस करना",
        category: "home",
        description:
          "जब पेमा और पेल्डन गंगटोक में अंगीठी के चारों ओर बैठे थे, तो उन्हें आग को छुए बिना भी गर्मी महसूस हुई। यह गर्मी सीधे आग से विकिरण के माध्यम से उन तक पहुँची - किसी माध्यम की आवश्यकता नहीं!",
        howItWorks:
          "आग सभी दिशाओं में ऊष्मा विकिरण उत्सर्जित करती है। यह विकिरण हवा से होकर यात्रा करता है (लेकिन हवा की जरूरत नहीं!) और पास बैठे लोगों तक पहुँचता है। जब यह विकिरण आपकी त्वचा से टकराता है, तो यह ऊर्जा स्थानांतरित करता है और आपको गर्मी महसूस होती है।",
        scienceBehind:
          "विकिरण विद्युत-चुंबकीय तरंगों (अवरक्त) के रूप में यात्रा करता है। इन तरंगों को यात्रा करने के लिए कणों की आवश्यकता नहीं होती - वे निर्वात से भी गुजर सकती हैं! जितनी गर्म आग (उच्च तापमान), उतना अधिक विकिरण उत्सर्जित होता है।",
        realExample:
          "पूरे भारत में, हिमालयी क्षेत्रों में बुखारी (पारंपरिक हीटर) का उपयोग करने से लेकर तटीय क्षेत्रों में अलाव तक, लोग विकिरण गर्मी का अनुभव करते हैं। सिक्किम में, परिवार सर्दियों के दौरान अंगीठी के चारों ओर इकट्ठा होते हैं, बिना किसी संपर्क के सीधे गर्मी महसूस करते हैं।",
        benefits: [
          "गर्म वस्तुओं को छुए बिना दूर से गर्मी महसूस कर सकते हैं",
          "हवा शांत होने पर भी काम करता है (संवहन की आवश्यकता नहीं)",
          "आग शुरू होते ही तुरंत गर्मी प्रदान करता है",
          "एक साथ अलग-अलग दिशाओं में कई लोगों को गर्म कर सकता है",
        ],
        difficulty: "everyday",
        icon: "🔥",
      },
      {
        id: 2,
        title: "सूर्य की ऊर्जा पृथ्वी तक पहुँचना",
        category: "nature",
        description:
          "सूर्य पृथ्वी से 150 मिलियन किलोमीटर दूर है, बीच में खाली स्थान (निर्वात) है। फिर भी हम हर दिन सूर्य की गर्मी महसूस करते हैं! यह अविश्वसनीय यात्रा पूरी तरह से विकिरण के माध्यम से होती है।",
        howItWorks:
          "सूर्य विकिरण के रूप में भारी मात्रा में ऊष्मा और प्रकाश उत्सर्जित करता है। यह विकिरण अंतरिक्ष के पूर्ण निर्वात से होकर यात्रा करता है - जहाँ कोई कण नहीं हैं - और लगभग 8 मिनट में प्रकाश की गति (300,000 km/सेकंड) से पृथ्वी तक पहुँचता है।",
        scienceBehind:
          "सौर विकिरण में दृश्य प्रकाश, अवरक्त (ऊष्मा), और पराबैंगनी किरणें शामिल हैं। चालन (संपर्क चाहिए) और संवहन (कण गति चाहिए) के विपरीत, विकिरण को कोई माध्यम नहीं चाहिए। यह विद्युत-चुंबकीय तरंगों के माध्यम से शुद्ध ऊर्जा स्थानांतरण है।",
        realExample:
          "केरल भूमध्य रेखा के पास तीव्र सौर विकिरण प्राप्त करता है, जिससे यह गंगटोक से अधिक गर्म होता है (जैसा कि पेल्डन ने देखा!)। सौर विकिरण प्रकाश संश्लेषण के माध्यम से भारत की कृषि को चलाता है, गुजरात और राजस्थान में सौर पैनलों को शक्ति प्रदान करता है, और अंतर ऊष्मीकरण के माध्यम से मानसून का कारण बनता है।",
        benefits: [
          "प्रकाश संश्लेषण के माध्यम से पृथ्वी पर जीवन के लिए सभी ऊर्जा प्रदान करता है",
          "मौसम के पैटर्न और जल चक्र (वाष्पीकरण) को चलाता है",
          "मानव त्वचा में विटामिन D उत्पादन को सक्षम बनाता है",
          "बिजली के लिए स्वच्छ सौर ऊर्जा का स्रोत",
        ],
        difficulty: "nature",
        icon: "☀️",
      },
      {
        id: 3,
        title: "सफेद बनाम गहरे कपड़े",
        category: "clothing",
        description:
          "हम गर्मी में सफेद कपड़े और सर्दी में गहरे कपड़े क्यों पहनते हैं? यह सब इस बात पर निर्भर करता है कि अलग-अलग रंग ऊष्मा विकिरण के साथ कैसे बातचीत करते हैं - इसे परावर्तित या अवशोषित करते हैं!",
        howItWorks:
          "हल्के रंग (सफेद, क्रीम) अधिकांश आने वाले ऊष्मा विकिरण को पर्यावरण में वापस परावर्तित करते हैं। गहरे रंग (काला, नेवी) अधिकांश ऊष्मा विकिरण को अवशोषित करते हैं और इसे आंतरिक ऊष्मा ऊर्जा में परिवर्तित करते हैं।",
        scienceBehind:
          "जब विकिरण किसी सतह से टकराता है, तो यह परावर्तित, अवशोषित या संचरित हो सकता है। सफेद सतहें 80-90% विकिरण को परावर्तित करती हैं, जबकि काली सतहें 80-90% अवशोषित करती हैं। अवशोषित विकिरण सामग्री में ऊष्मा ऊर्जा बन जाता है।",
        realExample:
          "राजस्थान के रेगिस्तानी क्षेत्रों में, लोग पारंपरिक रूप से तीव्र धूप (45°C) में ठंडा रहने के लिए सफेद कपड़े पहनते हैं। लद्दाख की ठंडी सर्दियों (-20°C) में, गहरे कपड़े गर्मी के लिए उपलब्ध सौर विकिरण को अवशोषित करने में मदद करते हैं। भारतीय क्रिकेट टीम गर्म दिनों में खेले जाने वाले टेस्ट मैचों में सफेद पहनती है!",
        benefits: [
          "गर्मी में सफेद: गहरे कपड़ों की तुलना में 5-10°C ठंडा रहता है",
          "सर्दी में गहरा: सौर ऊष्मा को अवशोषित करता है, प्राकृतिक गर्मी प्रदान करता है",
          "थर्मल आराम के लिए सरल, बिना ऊर्जा का समाधान",
          "पारंपरिक भारतीय कपड़े इस सिद्धांत का पालन करते हैं",
        ],
        difficulty: "everyday",
        icon: "👕",
      },
      {
        id: 4,
        title: "धूप में कपड़े सुखाना",
        category: "everyday",
        description:
          "गीले कपड़े बादल वाले दिन की तुलना में धूप वाले दिन में बहुत तेजी से सूखते हैं। सूर्य का विकिरण कपड़ों में पानी को गर्म करता है, जिससे तेजी से वाष्पीकरण होता है - विकिरण का दैनिक उदाहरण!",
        howItWorks:
          "सौर विकिरण अंतरिक्ष और हवा से होकर गीले कपड़ों तक पहुँचता है। यह विकिरण कपड़े में पानी के अणुओं में ऊर्जा स्थानांतरित करता है, उनकी गतिज ऊर्जा बढ़ाता है। तेजी से चलने वाले पानी के अणु वाष्प (वाष्पीकरण) के रूप में बच जाते हैं।",
        scienceBehind:
          "वाष्पीकरण दर तापमान पर निर्भर करती है। सौर विकिरण कपड़े की सतह पर पानी के तापमान को ~25°C से 40-50°C तक बढ़ाता है। उच्च तापमान पर, अधिक पानी के अणुओं के पास मुक्त होने और वाष्पित होने के लिए पर्याप्त ऊर्जा होती है।",
        realExample:
          "हर भारतीय घर में यह दैनिक अभ्यास होता है! दोपहर में सीधी धूप में लटकाए गए कपड़े (जब सौर विकिरण सबसे मजबूत होता है) 2-3 घंटे में सूख जाते हैं, जबकि छाया में उन्हें 6-8 घंटे लग सकते हैं। मानसून के मौसम (बादल) में, कपड़े और भी लंबे समय तक लेते हैं क्योंकि बादलों द्वारा विकिरण अवरुद्ध हो जाता है।",
        benefits: [
          "बिजली बचाता है (कपड़े सुखाने वाली मशीन की आवश्यकता नहीं)",
          "प्राकृतिक कीटाणुशोधन - सूर्य के प्रकाश में यूवी किरणें बैक्टीरिया को मारती हैं",
          "सूर्य से मुफ्त ऊर्जा",
          "बाहर सुखाने से कपड़े ताजा महकते हैं",
        ],
        difficulty: "everyday",
        icon: "👔",
      },
      {
        id: 5,
        title: "सौर कुकर",
        category: "technology",
        description:
          "सौर कुकर सूर्य के विकिरण को केंद्रित करने के लिए दर्पण का उपयोग करते हैं। भोजन केवल सूर्य के प्रकाश का उपयोग करके पकाया जाता है - कोई गैस नहीं, कोई बिजली नहीं, कोई धुआँ नहीं! शुद्ध विकिरण खाना पकाना।",
        howItWorks:
          "परवलयिक दर्पण सौर विकिरण को एक केंद्रीय बिंदु पर परावर्तित और केंद्रित करते हैं जहाँ खाना पकाने का बर्तन रखा जाता है। यह केंद्रित विकिरण 150-200°C तक तापमान पहुँच सकता है, चावल, सब्जियाँ और दाल पकाने के लिए पर्याप्त।",
        scienceBehind:
          "दर्पण विकिरण किरणों को एक फोकल बिंदु की ओर पुनर्निर्देशित करते हैं। जब सूर्य से समानांतर विकिरण किरणें एक परवलयिक दर्पण से टकराती हैं, तो वे सभी एक स्थान पर परावर्तित होती हैं। यह एकाग्रता विकिरण की तीव्रता को 50-100 गुना बढ़ा देती है!",
        realExample:
          "गुजरात और राजस्थान में कई सौर कुकर परियोजनाएँ हैं। तुलसी चानराई फाउंडेशन ने गुजरात के गाँवों में सौर कुकर प्रदान किए। गर्मियों के दौरान, ये कुकर केवल सूर्य के प्रकाश का उपयोग करके 4-5 लोगों के परिवार के लिए 2-3 घंटे में पूरा भोजन (दाल, चावल, सब्जियाँ) तैयार कर सकते हैं!",
        benefits: [
          "शून्य ईंधन लागत - पूरी तरह से मुफ्त खाना पकाने की ऊर्जा",
          "कोई धुआँ या घरेलू वायु प्रदूषण नहीं (लकड़ी की आग के विपरीत)",
          "वनों की कटाई कम करता है (लकड़ी की आवश्यकता नहीं)",
          "धीमी सौर खाना पकाने से भोजन अधिक पोषक तत्व बनाए रखता है",
        ],
        difficulty: "technology",
        icon: "🍳",
      },
      {
        id: 6,
        title: "पृथ्वी पर ग्रीनहाउस प्रभाव",
        category: "nature",
        description:
          "पृथ्वी का वायुमंडल एक ग्रीनहाउस की तरह काम करता है, सूर्य से ऊष्मा विकिरण को फँसाता है। यह प्राकृतिक प्रक्रिया हमारे ग्रह को जीवन के लिए पर्याप्त गर्म रखती है - इसके बिना, पृथ्वी -18°C पर जमी होगी!",
        howItWorks:
          "सौर विकिरण वायुमंडल से होकर गुजरता है और पृथ्वी की सतह को गर्म करता है। पृथ्वी फिर अवरक्त विकिरण के रूप में ऊष्मा वापस विकिरण करती है। ग्रीनहाउस गैसें (CO₂, जल वाष्प, मीथेन) इस बाहर जाने वाले विकिरण के कुछ हिस्से को फँसाती हैं, पृथ्वी को गर्म रखती हैं।",
        scienceBehind:
          "सूर्य से दृश्य प्रकाश वायुमंडल में आसानी से प्रवेश करता है। पृथ्वी इसे अवशोषित करती है और अवरक्त (ऊष्मा) विकिरण के रूप में पुनः उत्सर्जित करती है। ग्रीनहाउस गैसें दृश्य प्रकाश के लिए पारदर्शी होती हैं लेकिन अवरक्त के लिए अपारदर्शी - वे बचने की कोशिश कर रही ऊष्मा को फँसाती हैं।",
        realExample:
          "प्राकृतिक ग्रीनहाउस प्रभाव भारत के रहने योग्य तापमान को बनाए रखता है। हालाँकि, वाहनों और उद्योग से अत्यधिक CO₂ इस प्रभाव को बढ़ाता है, जिससे ग्लोबल वार्मिंग होती है। यह भारतीय मानसून और हिमालयी ग्लेशियरों को प्रभावित करता है जैसे गंगटोक के पास।",
        benefits: [
          "पृथ्वी के औसत तापमान को +15°C पर बनाए रखता है (-18°C के बजाय)",
          "पृथ्वी की सतह पर तरल पानी के अस्तित्व को सक्षम बनाता है",
          "कृषि और जीवन को संभव बनाता है",
          "प्राकृतिक जलवायु विनियमन प्रणाली",
        ],
        difficulty: "nature",
        icon: "🌍",
      },
      {
        id: 7,
        title: "थर्मल इमेजिंग कैमरे",
        category: "technology",
        description:
          "ये विशेष कैमरे ऊष्मा विकिरण को 'देख' सकते हैं जिसे हमारी आँखें नहीं देख सकतीं। वे वस्तुओं द्वारा उत्सर्जित अवरक्त विकिरण के आधार पर छवियाँ बनाते हैं, तापमान अंतर को प्रकट करते हैं।",
        howItWorks:
          "पूर्ण शून्य (-273°C) से ऊपर की सभी वस्तुएँ अवरक्त विकिरण उत्सर्जित करती हैं। थर्मल कैमरे इस विकिरण का पता लगाते हैं और इसे दृश्य छवियों में परिवर्तित करते हैं - गर्म वस्तुएँ चमकीली (लाल/सफेद) दिखाई देती हैं, ठंडी वस्तुएँ अंधेरी (नीली/काली) दिखाई देती हैं।",
        scienceBehind:
          "उत्सर्जित अवरक्त विकिरण की मात्रा तापमान के साथ तेजी से बढ़ती है (स्टीफन-बोल्ट्जमैन नियम: शक्ति ∝ T⁴)। 37°C (शरीर का तापमान) पर एक सतह 27°C (कमरे का तापमान) वाली सतह की तुलना में बहुत अधिक विकिरण उत्सर्जित करती है।",
        realExample:
          "COVID-19 के दौरान, थर्मल कैमरों ने अत्यधिक शरीर की ऊष्मा विकिरण का पता लगाकर भारत भर के हवाई अड्डों पर बुखार का पता लगाया। भारतीय सेना LOC पर रात के निगरानी के लिए उनका उपयोग करती है। मुंबई के अग्निशामक धुएँ से भरे भवनों में लोगों का पता लगाने के लिए उनका उपयोग करते हैं - ऊष्मा विकिरण धुएँ से होकर गुजरता है!",
        benefits: [
          "गैर-संपर्क तापमान माप (COVID स्क्रीनिंग के लिए महत्वपूर्ण)",
          "पूर्ण अंधकार में काम करता है (ऊष्मा का पता लगाता है, प्रकाश नहीं)",
          "भवनों में ऊष्मा हानि का पता लगा सकता है (ऊर्जा ऑडिट)",
          "चिकित्सा निदान - सूजन और रक्त प्रवाह समस्याओं का पता लगाता है",
        ],
        difficulty: "technology",
        icon: "📷",
      },
      {
        id: 8,
        title: "गर्म बर्तनों से ऊष्मा विकिरण",
        category: "home",
        description:
          "एक गर्म धातु का बर्तन मेज पर रखा गया (चूल्हे से दूर) धीरे-धीरे ठंडा हो जाता है। ऊष्मा कहाँ जाती है? यह विकिरण के माध्यम से ठंडे वातावरण - दीवारें, हवा, मेज - में विकिरण करती है!",
        howItWorks:
          "गर्म बर्तन (मान लें 80°C पर) सभी दिशाओं में ऊष्मा विकिरण उत्सर्जित करता है। ठंडा वातावरण (25°C कमरे के तापमान पर) इस विकिरण को अवशोषित करता है। बर्तन तब तक विकिरण करता रहता है जब तक तापमान समान नहीं हो जाता।",
        scienceBehind:
          "सभी वस्तुएँ लगातार अपने आस-पास में ऊष्मा का विकिरण करती हैं। गर्म वस्तुएँ अधिक तीव्रता से विकिरण करती हैं। शुद्ध ऊष्मा स्थानांतरण गर्म से ठंडे की ओर होता है। 80°C का बर्तन 25°C की दीवार की तुलना में लगभग 16 गुना अधिक शक्ति विकिरण करता है!",
        realExample:
          "खाना पकाने के बाद, दादी का गर्म कढ़ाई रसोई काउंटर पर धीरे-धीरे ठंडी हो जाती है। यदि आप अपना हाथ पास रखते हैं (बिना छुए!) तो आप इससे विकिरण होने वाली गर्मी महसूस कर सकते हैं। धातु अवरक्त विकिरण उत्सर्जित करती है जिसे आपकी त्वचा गर्मी के रूप में महसूस करती है।",
        benefits: [
          "बिना किसी प्रयास के स्वचालित ठंडा होना",
          "विकिरण चालन और संवहन के साथ काम करता है",
          "सीधे संपर्क के बिना गर्मी महसूस कर सकते हैं (सुरक्षा सुविधा)",
          "विकिरण के कारण गर्म वस्तुओं के लिए तेजी से ठंडा होना",
        ],
        difficulty: "everyday",
        icon: "🍲",
      },
      {
        id: 9,
        title: "रात्रि दृष्टि प्रौद्योगिकी",
        category: "technology",
        description:
          "रात्रि दृष्टि उपकरण हमें अंधेरे में गर्म वस्तुओं (मनुष्य, जानवर, वाहन) से अवरक्त ऊष्मा विकिरण का पता लगाकर 'देखने' देते हैं, भले ही दृश्य प्रकाश न हो।",
        howItWorks:
          "आस-पास की तुलना में गर्म वस्तुएँ अधिक अवरक्त विकिरण उत्सर्जित करती हैं। रात्रि दृष्टि उपकरण इस अदृश्य विकिरण का पता लगाते हैं, सिग्नल को इलेक्ट्रॉनिक रूप से प्रवर्धित करते हैं, और इसे हरे रंग की दृश्य छवि के रूप में प्रदर्शित करते हैं।",
        scienceBehind:
          "37°C पर मानव शरीर 9.4 माइक्रोमीटर तरंगदैर्ध्य पर शिखर विकिरण उत्सर्जित करता है (अवरक्त - आँखों के लिए अदृश्य)। रात्रि दृष्टि 0.7-14 माइक्रोमीटर तरंगदैर्ध्य का पता लगाती है, निकट और थर्मल अवरक्त क्षेत्रों को कवर करती है।",
        realExample:
          "भारतीय सुरक्षा बल सीमाओं पर रात्रि दृष्टि का उपयोग करते हैं। जिम कॉर्बेट राष्ट्रीय उद्यान में वन्यजीव शोधकर्ता रात्रिचर बाघों का अध्ययन करने के लिए थर्मल कैमरों का उपयोग करते हैं बिना उन्हें परेशान किए। कैमरे ठंडे जंगल की पृष्ठभूमि के खिलाफ बाघों से शरीर की ऊष्मा विकिरण का पता लगाते हैं।",
        benefits: [
          "पूर्ण अंधकार में सुरक्षा और निगरानी",
          "दृश्य प्रकाश व्यवधान के बिना वन्यजीव अवलोकन",
          "रात में खोज और बचाव अभियान",
          "सैन्य अभियान और सीमा गश्त",
        ],
        difficulty: "technology",
        icon: "🌙",
      },
      {
        id: 10,
        title: "पृथ्वी का ऊर्जा संतुलन",
        category: "nature",
        description:
          "पृथ्वी सूर्य से विकिरण प्राप्त करती है और अंतरिक्ष में वापस ऊष्मा विकिरण करती है। इन दो विकिरण प्रवाहों को संतुलित होना चाहिए, अन्यथा पृथ्वी लगातार गर्म या ठंडी होती रहेगी!",
        howItWorks:
          "पृथ्वी वायुमंडल के शीर्ष पर ~1360 W/m² सौर विकिरण प्राप्त करती है। लगभग 30% अंतरिक्ष में वापस परावर्तित हो जाता है। शेष 70% अवशोषित होता है, पृथ्वी को गर्म करता है, और अंतरिक्ष में अवरक्त विकिरण के रूप में पुनः विकिरण होता है।",
        scienceBehind:
          "आने वाला सौर विकिरण (लघु तरंग) = बाहर जाने वाला स्थलीय विकिरण (दीर्घ तरंग) स्थिर तापमान के लिए। पृथ्वी का औसत तापमान तब तक समायोजित होता है जब तक बाहर जाने वाला विकिरण आने वाले विकिरण के बराबर नहीं हो जाता। वर्तमान में ~240 W/m² शुद्ध प्राप्त हो रहा है, उतनी ही मात्रा वापस विकिरण कर रहा है।",
        realExample:
          "यह संतुलन पृथ्वी की जलवायु को बनाए रखता है। हालाँकि, बढ़ती ग्रीनहाउस गैसें अधिक बाहर जाने वाले विकिरण को फँसाती हैं, जिससे वार्मिंग होती है। यह भारतीय कृषि, जल संसाधनों और हिमालयी बर्फ को प्रभावित करता है जैसे गंगटोक के पास। वैज्ञानिक जलवायु परिवर्तन को समझने के लिए उपग्रहों का उपयोग करके इस संतुलन की निगरानी करते हैं।",
        benefits: [
          "स्थिर वैश्विक औसत तापमान (~15°C) बनाए रखता है",
          "अनुमानित मौसम और जलवायु पैटर्न को सक्षम बनाता है",
          "जीवन को स्थिर स्थितियों के अनुकूल होने की अनुमति देता है",
          "इसे समझना जलवायु परिवर्तन की भविष्यवाणी करने में मदद करता है",
        ],
        difficulty: "nature",
        icon: "⚖️",
      },
    ],
  },
  gu: {
    headerTitle: "વાસ્તવિક જીવનમાં વિકિરણ",
    headerSubtitle:
      "જોઈએ કે વિકિરણ આપણી રોજિંદી જિંદગીમાં કેવી રીતે કામ કરે છે",
    categories: {
      all: "બધા ઉદાહરણો",
      nature: "પ્રકૃતિ",
      home: "ઘર",
      everyday: "દૈનિક જીવન",
      technology: "ટેક્નોલોજી",
      clothing: "કપડા",
    },
    showingCount: (count: number) => `કુલ ${count} ઉદાહરણ દર્શાવવામાં આવ્યા છે`,
    difficultyLabels: {
      everyday: "દૈનિક જીવન",
      nature: "પ્રાકૃતિક પ્રક્રિયા",
      technology: "ટેક્નોલોજી",
    },
    sectionTitles: {
      whatIsIt: "આ શું છે?",
      howItWorks: "આ કેવી રીતે કાર્ય કરે છે",
      scienceBehind: "પાછળનો વિજ્ઞાન",
      realExample: "ભારતીય ઉદાહરણ",
      benefits: "મહત્ત્વ અને ફાયદા",
    },
    summaryTitle: "વિકિરણ વિશેની મુખ્ય વાતો",
    summaryCards: {
      noMediumTitle: "કોઈ માધ્યમ જરૂરી નથી",
      noMediumBody:
        "વિકિરણ શૂન્યાવકાશમાં પણ જઈ શકે છે, જ્યારે ચાલન અને સંવહન માટે કણો ધરાવતું માધ્યમ જરૂરી છે।",
      allObjectsTitle: "બધા પદાર્થો વિકિરણ કરે છે",
      allObjectsBody:
        "સંપૂર્ણ શૂન્યથી વધુ તાપમાન ધરાવતા દરેક પદાર્થ ઉષ્મા વિકિરણ કરે છે। જેટલું વધુ તાપમાન, તેટલું વધુ વિકિરણ।",
      emWavesTitle: "વિદ્યુત-ચુંબકીય તરંગો",
      emWavesBody:
        "ઉષ્મા વિકિરણ ઇન્ફ્રારેડ વિદ્યુત-ચુંબકીય તરંગોના રૂપમાં પ્રકાશની ગતિએ (300,000 km/s) પ્રવાસ કરે છે।",
    },
    applications: [
      {
        id: 1,
        title: "ચૂલામાંથી ગરમી અનુભવવી",
        category: "home",
        description:
          "જ્યારે પેમા અને પેલ્ડન ગંગટોકમાં ચૂલાની આસપાસ બેઠા હતા, ત્યારે તેઓએ આગને સ્પર્શ કર્યા વગર પણ ગરમી અનુભવી. આ ગરમી સીધી આગથી વિકિરણ દ્વારા તેમના સુધી પહોંચી - કોઈ માધ્યમની જરૂર નથી!",
        howItWorks:
          "આગ બધી દિશાઓમાં ઉષ્મા વિકિરણ ઉત્સર્જિત કરે છે. આ વિકિરણ હવામાંથી પસાર થાય છે (પરંતુ હવાની જરૂર નથી!) અને નજીક બેઠા લોકો સુધી પહોંચે છે. જ્યારે આ વિકિરણ તમારી ત્વચા સાથે ટકરાય છે, ત્યારે તે ઊર્જા સ્થાનાંતરિત કરે છે અને તમને ગરમી લાગે છે।",
        scienceBehind:
          "વિકિરણ વિદ્યુત-ચુંબકીય તરંગો (ઇન્ફ્રારેડ) તરીકે પ્રવાસ કરે છે। આ તરંગોને પ્રવાસ કરવા માટે કણોની જરૂર પડતી નથી - તેઓ શૂન્યાવકાશમાંથી પણ પસાર થઈ શકે છે! જેટલી ગરમ આગ (ઉચ્ચ તાપમાન), તેટલું વધુ વિકિરણ ઉત્સર્જિત થાય છે।",
        realExample:
          "ભારતભરમાં, હિમાલયન પ્રદેશોમાં બુખારી (પરંપરાગત હીટર) નો ઉપયોગ કરવાથી લઈને તટીય વિસ્તારોમાં અગ્નિ સુધી, લોકો વિકિરણ ગરમીનો અનુભવ કરે છે। સિક્કિમમાં, પરિવારો શિયાળા દરમિયાન ચૂલાની આસપાસ એકઠા થાય છે, કોઈ સંપર્ક વગર સીધી ગરમી અનુભવે છે।",
        benefits: [
          "ગરમ વસ્તુઓને સ્પર્શ કર્યા વગર અંતરથી ગરમી અનુભવી શકે છે",
          "હવા શાંત હોય ત્યારે પણ કામ કરે છે (સંવહનની જરૂર નથી)",
          "આગ શરૂ થતાં જ તરત જ ગરમી પ્રદાન કરે છે",
          "એક સાથે વિવિધ દિશાઓમાં બહુવિધ લોકોને ગરમ કરી શકે છે",
        ],
        difficulty: "everyday",
        icon: "🔥",
      },
      {
        id: 2,
        title: "સૂર્યની ઊર્જા પૃથ્વી સુધી પહોંચવી",
        category: "nature",
        description:
          "સૂર્ય પૃથ્વીથી 150 મિલિયન કિલોમીટર દૂર છે, વચ્ચે ખાલી જગ્યા (શૂન્યાવકાશ) છે। છતાં આપણે દરરોજ સૂર્યની ગરમી અનુભવીએ છીએ! આ અવિશ્વસનીય પ્રવાસ સંપૂર્ણપણે વિકિરણ દ્વારા થાય છે।",
        howItWorks:
          "સૂર્ય વિકિરણના રૂપમાં ભારી માત્રામાં ઉષ્મા અને પ્રકાશ ઉત્સર્જિત કરે છે। આ વિકિરણ અવકાશના સંપૂર્ણ શૂન્યાવકાશમાંથી પસાર થાય છે - જ્યાં કોઈ કણ નથી - અને લગભગ 8 મિનિટમાં પ્રકાશની ગતિએ (300,000 km/સેકંડ) પૃથ્વી સુધી પહોંચે છે।",
        scienceBehind:
          "સૌર વિકિરણમાં દૃશ્યમાન પ્રકાશ, ઇન્ફ્રારેડ (ઉષ્મા), અને અલ્ટ્રાવાયોલેટ કિરણોનો સમાવેશ થાય છે. ચાલન (સંપર્ક જોઈએ) અને સંવહન (કણ ગતિ જોઈએ) કરતાં વિપરીત, વિકિરણને કોઈ માધ્યમ જોઈએ નથી. તે વિદ્યુત-ચુંબકીય તરંગો દ્વારા શુદ્ધ ઊર્જા સ્થાનાંતરણ છે।",
        realExample:
          "કેરળ ભૂમધ્યરેખાની નજીક તીવ્ર સૌર વિકિરણ પ્રાપ્ત કરે છે, જે તેને ગંગટોક કરતાં ગરમ બનાવે છે (જેમ કે પેલ્ડને જોયું!)। સૌર વિકિરણ પ્રકાશસંશ્લેષણ દ્વારા ભારતની કૃષિને ચલાવે છે, ગુજરાત અને રાજસ્થાનમાં સૌર પેનલોને શક્તિ આપે છે, અને વિભેદક ગરમી દ્વારા મોસમનું કારણ બને છે।",
        benefits: [
          "પ્રકાશસંશ્લેષણ દ્વારા પૃથ્વી પર જીવન માટે બધી ઊર્જા પ્રદાન કરે છે",
          "હવામાન પેટર્ન અને પાણી ચક્ર (બાષ્પીભવન) ચલાવે છે",
          "માનવ ત્વચામાં વિટામિન D ઉત્પાદનને સક્ષમ બનાવે છે",
          "વીજળી માટે સ્વચ્છ સૌર ઊર્જાનો સ્રોત",
        ],
        difficulty: "nature",
        icon: "☀️",
      },
      {
        id: 3,
        title: "સફેદ વિરુદ્ધ ગાઢ કપડાં",
        category: "clothing",
        description:
          "આપણે ઉનાળામાં સફેદ કપડાં અને શિયાળામાં ગાઢ કપડાં કેમ પહેરીએ છીએ? તે બધું અલગ-અલગ રંગો ઉષ્મા વિકિરણ સાથે કેવી રીતે ક્રિયાપ્રતિક્રિયા કરે છે તેના પર આધારિત છે - તેને પરાવર્તિત અથવા શોષે છે!",
        howItWorks:
          "હળવા રંગો (સફેદ, ક્રીમ) મોટાભાગના આવતા ઉષ્મા વિકિરણને પર્યાવરણમાં પાછા પરાવર્તિત કરે છે। ગાઢ રંગો (કાળો, નેવી) મોટાભાગના ઉષ્મા વિકિરણને શોષે છે અને તેને આંતરિક ઉષ્મા ઊર્જામાં રૂપાંતરિત કરે છે।",
        scienceBehind:
          "જ્યારે વિકિરણ કોઈ સપાટી સાથે ટકરાય છે, ત્યારે તે પરાવર્તિત, શોષાય અથવા પ્રસારિત થઈ શકે છે। સફેદ સપાટીઓ 80-90% વિકિરણને પરાવર્તિત કરે છે, જ્યારે કાળી સપાટીઓ 80-90% શોષે છે। શોષાયેલ વિકિરણ સામગ્રીમાં ઉષ્મા ઊર્જા બની જાય છે।",
        realExample:
          "રાજસ્થાનના રણ પ્રદેશોમાં, લોકો પરંપરાગત રીતે તીવ્ર સૂર્ય (45°C) હેઠળ ઠંડુ રહેવા માટે સફેદ કપડાં પહેરે છે। લદાખની ઠંડી શિયાળામાં (-20°C), ગાઢ કપડાં ગરમી માટે ઉપલબ્ધ કોઈપણ સૌર વિકિરણને શોષવામાં મદદ કરે છે। ભારતીય ક્રિકેટ ટીમ ગરમ દિવસોમાં ખેલાયેલા ટેસ્ટ મેચોમાં સફેદ પહેરે છે!",
        benefits: [
          "ઉનાળામાં સફેદ: ગાઢ કપડાં કરતાં 5-10°C ઠંડુ રહે છે",
          "શિયાળામાં ગાઢ: સૌર ઉષ્માને શોષે છે, કુદરતી ગરમી પ્રદાન કરે છે",
          "થર્મલ આરામ માટે સરળ, બિન-ઊર્જા ઉકેલ",
          "પરંપરાગત ભારતીય કપડાં આ સિદ્ધાંતનું પાલન કરે છે",
        ],
        difficulty: "everyday",
        icon: "👕",
      },
      {
        id: 4,
        title: "સૂર્યપ્રકાશમાં કપડાં સુકાવવા",
        category: "everyday",
        description:
          "ભીના કપડાં બાદળી દિવસની તુલનામાં સૂર્યપ્રકાશવાળા દિવસે ખૂબ ઝડપથી સૂકાય છે। સૂર્યનું વિકિરણ કપડાંમાં પાણીને ગરમ કરે છે, જેને કારણે ઝડપી બાષ્પીભવન થાય છે - કામ પર વિકિરણનું દૈનિક ઉદાહરણ!",
        howItWorks:
          "સૌર વિકિરણ અવકાશ અને હવામાંથી પસાર થઈ ભીના કપડાં સુધી પહોંચે છે। આ વિકિરણ કાપડમાં પાણીના અણુઓમાં ઊર્જા સ્થાનાંતરિત કરે છે, તેમની ગતિ ઊર્જા વધારે છે। ઝડપથી ફરતા પાણીના અણુઓ બાષ્પ (બાષ્પીભવન) તરીકે બચી જાય છે।",
        scienceBehind:
          "બાષ્પીભવન દર તાપમાન પર આધાર રાખે છે। સૌર વિકિરણ કાપડની સપાટી પર પાણીનું તાપમાન ~25°C થી 40-50°C સુધી વધારે છે। ઉચ્ચ તાપમાને, વધુ પાણીના અણુઓને મુક્ત થવા અને બાષ્પીભવન માટે પૂરતી ઊર્જા હોય છે।",
        realExample:
          "દરેક ભારતીય ઘરમાં આ દૈનિક પ્રથા છે! બપોરે સીધા સૂર્યપ્રકાશમાં લટકાવેલા કપડાં (જ્યારે સૌર વિકિરણ સૌથી મજબૂત હોય છે) 2-3 કલાકમાં સૂકાય છે, જ્યારે છાંયામાં તેમને 6-8 કલાક લાગી શકે છે। મોસમી સીઝન (બાદળી) માં, કપડાં વધુ સમય લે છે કારણ કે વિકિરણ બાદળો દ્વારા અવરોધિત થાય છે।",
        benefits: [
          "વીજળી બચાવે છે (કપડાં સુકાવનારની જરૂર નથી)",
          "કુદરતી જંતુનાશક - સૂર્યપ્રકાશમાં UV કિરણો બેક્ટેરિયાને મારે છે",
          "સૂર્યથી મફત ઊર્જા",
          "બહાર સુકાવવાથી કપડાં તાજા સુગંધ આવે છે",
        ],
        difficulty: "everyday",
        icon: "👔",
      },
      {
        id: 5,
        title: "સૌર કૂકર",
        category: "technology",
        description:
          "સૌર કૂકર સૂર્યના વિકિરણને કેન્દ્રિત કરવા માટે અરીસાનો ઉપયોગ કરે છે। ખોરાક માત્ર સૂર્યપ્રકાશનો ઉપયોગ કરીને તૈયાર થાય છે - કોઈ ગેસ નથી, કોઈ વીજળી નથી, કોઈ ધુમાડો નથી! શુદ્ધ વિકિરણ રસોઈ।",
        howItWorks:
          "પેરાબોલિક અરીસા સૌર વિકિરણને કેન્દ્રીય બિંદુ પર પરાવર્તિત અને ફોકસ કરે છે જ્યાં રસોઈનું વાસણ મૂકવામાં આવે છે। આ કેન્દ્રિત વિકિરણ 150-200°C સુધી તાપમાન પહોંચી શકે છે, ચોખા, શાકભાજી અને દાળ તૈયાર કરવા માટે પૂરતું।",
        scienceBehind:
          "અરીસા વિકિરણ કિરણોને ફોકલ બિંદુ તરફ પુનઃનિર્દેશિત કરે છે। જ્યારે સૂર્યથી સમાંતર વિકિરણ કિરણો પેરાબોલિક અરીસા સાથે ટકરાય છે, ત્યારે તેઓ બધા એક જગ્યાએ પરાવર્તિત થાય છે। આ સાંદ્રતા વિકિરણની તીવ્રતાને 50-100 ગણી વધારે છે!",
        realExample:
          "ગુજરાત અને રાજસ્થાનમાં ઘણા સૌર કૂકર પ્રોજેક્ટ્સ છે। તુલસી ચાનરાઈ ફાઉન્ડેશને ગુજરાતના ગામોમાં સૌર કૂકર પ્રદાન કર્યા. ઉનાળા દરમિયાન, આ કૂકર માત્ર સૂર્યપ્રકાશનો ઉપયોગ કરીને 4-5 લોકોના પરિવાર માટે 2-3 કલાકમાં સંપૂર્ણ ભોજન (દાળ, ચોખા, શાકભાજી) તૈયાર કરી શકે છે!",
        benefits: [
          "શૂન્ય ઇંધણ ખર્ચ - સંપૂર્ણપણે મફત રસોઈ ઊર્જા",
          "કોઈ ધુમાડો અથવા ઘરની હવા પ્રદૂષણ નથી (લાકડાની આગથી વિપરીત)",
          "વનનાશ ઘટાડે છે (લાકડાની જરૂર નથી)",
          "ધીમી સૌર રસોઈ સાથે ખોરાક વધુ પોષક તત્વો જાળવી રાખે છે",
        ],
        difficulty: "technology",
        icon: "🍳",
      },
      {
        id: 6,
        title: "પૃથ્વી પર ગ્રીનહાઉસ અસર",
        category: "nature",
        description:
          "પૃથ્વીનું વાતાવરણ ગ્રીનહાઉસની જેમ કાર્ય કરે છે, સૂર્યથી ઉષ્મા વિકિરણને ફસાવે છે। આ કુદરતી પ્રક્રિયા આપણા ગ્રહને જીવન માટે પૂરતું ગરમ રાખે છે - આ વગર, પૃથ્વી -18°C પર જડી હશે!",
        howItWorks:
          "સૌર વિકિરણ વાતાવરણમાંથી પસાર થાય છે અને પૃથ્વીની સપાટીને ગરમ કરે છે। પૃથ્વી પછી ઇન્ફ્રારેડ વિકિરણ તરીકે ઉષ્મા પાછી વિકિરણ કરે છે। ગ્રીનહાઉસ વાયુઓ (CO₂, પાણીની વરાળ, મિથેન) આ બહાર જતા વિકિરણના કેટલાક ભાગને ફસાવે છે, પૃથ્વીને ગરમ રાખે છે।",
        scienceBehind:
          "સૂર્યથી દૃશ્યમાન પ્રકાશ વાતાવરણમાં સરળતાથી પ્રવેશ કરે છે। પૃથ્વી તેને શોષે છે અને ઇન્ફ્રારેડ (ઉષ્મા) વિકિરણ તરીકે પુનઃ ઉત્સર્જિત કરે છે। ગ્રીનહાઉસ વાયુઓ દૃશ્યમાન પ્રકાશ માટે પારદર્શક હોય છે પરંતુ ઇન્ફ્રારેડ માટે અપારદર્શક - તેઓ બચવાનો પ્રયાસ કરતી ઉષ્માને ફસાવે છે।",
        realExample:
          "કુદરતી ગ્રીનહાઉસ અસર ભારતના રહેવાયોગ્ય તાપમાનને જાળવી રાખે છે। જો કે, વાહનો અને ઉદ્યોગમાંથી અતિશય CO₂ આ અસરને વધારે છે, જે વૈશ્વિક તાપમાન વધારાનું કારણ બને છે। આ ભારતીય મોસમ અને હિમાલયન હિમનદોને અસર કરે છે જેમ કે ગંગટોકની નજીક।",
        benefits: [
          "પૃથ્વીના સરેરાશ તાપમાનને +15°C પર જાળવી રાખે છે (-18°C ને બદલે)",
          "પૃથ્વીની સપાટી પર પ્રવાહી પાણીના અસ્તિત્વને સક્ષમ બનાવે છે",
          "કૃષિ અને જીવનને શક્ય બનાવે છે",
          "કુદરતી આબોહવા નિયમન પ્રણાલી",
        ],
        difficulty: "nature",
        icon: "🌍",
      },
      {
        id: 7,
        title: "થર્મલ ઇમેજિંગ કેમેરા",
        category: "technology",
        description:
          "આ વિશેષ કેમેરા ઉષ્મા વિકિરણને 'જોઈ' શકે છે જે આપણી આંખો શોધી શકતી નથી। તેઓ વસ્તુઓ દ્વારા ઉત્સર્જિત ઇન્ફ્રારેડ વિકિરણના આધારે છબીઓ બનાવે છે, તાપમાનના તફાવતોને ઉજાગર કરે છે।",
        howItWorks:
          "સંપૂર્ણ શૂન્ય (-273°C) થી ઉપરની બધી વસ્તુઓ ઇન્ફ્રારેડ વિકિરણ ઉત્સર્જિત કરે છે। થર્મલ કેમેરા આ વિકિરણનો પતો લગાવે છે અને તેને દૃશ્યમાન છબીઓમાં રૂપાંતરિત કરે છે - ગરમ વસ્તુઓ તેજસ્વી (લાલ/સફેદ) દેખાય છે, ઠંડી વસ્તુઓ ઘેરી (નીલી/કાળી) દેખાય છે।",
        scienceBehind:
          "ઉત્સર્જિત ઇન્ફ્રારેડ વિકિરણની માત્રા તાપમાન સાથે ઝડપથી વધે છે (સ્ટેફન-બોલ્ટ્ઝમેન કાયદો: શક્તિ ∝ T⁴)। 37°C (શરીરનું તાપમાન) પરની સપાટી 27°C (કોઠાનું તાપમાન) પરની સપાટી કરતાં ખૂબ વધુ વિકિરણ ઉત્સર્જિત કરે છે।",
        realExample:
          "COVID-19 દરમિયાન, થર્મલ કેમેરાઓએ અતિશય શરીરની ઉષ્મા વિકિરણની સંવેદના કરીને ભારતભરના હવાઈમથકો પર તાવનો પતો લગાવ્યો। ભારતીય સેના LOC પર રાત્રિ નિરીક્ષણ માટે તેમનો ઉપયોગ કરે છે। મુંબઈના અગ્નિશામક ધુમાડાથી ભરેલા ઇમારતોમાં લોકોનું સ્થાન નક્કી કરવા માટે તેમનો ઉપયોગ કરે છે - ઉષ્મા વિકિરણ ધુમાડામાંથી પસાર થાય છે!",
        benefits: [
          "બિન-સંપર્ક તાપમાન માપન (COVID સ્ક્રીનિંગ માટે મહત્વપૂર્ણ)",
          "સંપૂર્ણ અંધકારમાં કામ કરે છે (ઉષ્મા શોધે છે, પ્રકાશ નહીં)",
          "ઇમારતોમાં ઉષ્મા નુકસાન શોધી શકે છે (ઊર્જા ઓડિટ)",
          "તબીબી નિદાન - સોજો અને રક્ત પ્રવાહ સમસ્યાઓ શોધે છે",
        ],
        difficulty: "technology",
        icon: "📷",
      },
      {
        id: 8,
        title: "ગરમ વાસણોમાંથી ઉષ્મા વિકિરણ",
        category: "home",
        description:
          "એક ગરમ ધાતુનું વાસણ ટેબલ પર મૂકવામાં આવ્યું છે (ચૂલાથી દૂર) ધીમે ધીમે ઠંડુ થાય છે। ઉષ્મા ક્યાં જાય છે? તે વિકિરણ દ્વારા ઠંડા વાતાવરણ - દિવાલો, હવા, ટેબલ - માં વિકિરણ કરે છે!",
        howItWorks:
          "ગરમ વાસણ (કહો કે 80°C પર) બધી દિશાઓમાં ઉષ્મા વિકિરણ ઉત્સર્જિત કરે છે। ઠંડું વાતાવરણ (25°C કોઠાના તાપમાન પર) આ વિકિરણને શોષે છે। વાસણ તાપમાન સમાન થાય ત્યાં સુધી વિકિરણ કરતું રહે છે।",
        scienceBehind:
          "બધી વસ્તુઓ સતત પોતાની આસપાસ ઉષ્માનો વિકિરણ કરે છે। ગરમ વસ્તુઓ વધુ તીવ્રતાથી વિકિરણ કરે છે। ચોખ્ખું ઉષ્મા સ્થાનાંતરણ ગરમથી ઠંડા તરફ થાય છે। 80°C નું વાસણ 25°C ની દિવાલ કરતાં લગભગ 16 ગણી વધુ શક્તિ વિકિરણ કરે છે!",
        realExample:
          "રસોઈ પછી, દાદીનું ગરમ કઢાઈ રસોઈ કાઉન્ટર પર ધીમે ધીમે ઠંડુ થાય છે। જો તમે તમારો હાથ નજીક રાખો છો (સ્પર્શ કર્યા વગર!) તો તમે તેમાંથી વિકિરણ થતી ગરમી અનુભવી શકો છો। ધાતુ ઇન્ફ્રારેડ વિકિરણ ઉત્સર્જિત કરે છે જે તમારી ત્વચા ગરમી તરીકે અનુભવે છે।",
        benefits: [
          "કોઈ પ્રયાસ વગર સ્વચાલિત ઠંડક",
          "વિકિરણ ચાલન અને સંવહન સાથે કામ કરે છે",
          "સીધા સંપર્ક વગર ગરમી અનુભવી શકે છે (સુરક્ષા સુવિધા)",
          "વિકિરણને કારણે ગરમ વસ્તુઓ માટે ઝડપી ઠંડક",
        ],
        difficulty: "everyday",
        icon: "🍲",
      },
      {
        id: 9,
        title: "રાત્રિ દ્રષ્ટિ ટેક્નોલોજી",
        category: "technology",
        description:
          "રાત્રિ દ્રષ્ટિ ઉપકરણો અંધારામાં ગરમ વસ્તુઓ (મનુષ્યો, પશુઓ, વાહનો) થી ઇન્ફ્રારેડ ઉષ્મા વિકિરણનો પતો લગાવીને આપણને 'જોવા' દે છે, ભલે દૃશ્યમાન પ્રકાશ ન હોય।",
        howItWorks:
          "આસપાસ કરતાં ગરમ વસ્તુઓ વધુ ઇન્ફ્રારેડ વિકિરણ ઉત્સર્જિત કરે છે। રાત્રિ દ્રષ્ટિ ઉપકરણો આ અદૃશ્ય વિકિરણનો પતો લગાવે છે, સિગ્નલને ઇલેક્ટ્રોનિક રીતે વિસ્તૃત કરે છે, અને તેને લીલા રંગની દૃશ્યમાન છબી તરીકે પ્રદર્શિત કરે છે।",
        scienceBehind:
          "37°C પર માનવ શરીર 9.4 માઇક્રોમીટર તરંગલંબાઈ પર પીક વિકિરણ ઉત્સર્જિત કરે છે (ઇન્ફ્રારેડ - આંખો માટે અદૃશ્ય)। રાત્રિ દ્રષ્ટિ 0.7-14 માઇક્રોમીટર તરંગલંબાઈ શોધે છે, નજીક અને થર્મલ ઇન્ફ્રારેડ પ્રદેશોને આવરી લે છે।",
        realExample:
          "ભારતીય સુરક્ષા દળો સીમાઓ પર રાત્રિ દ્રષ્ટિનો ઉપયોગ કરે છે। જીમ કોર્બેટ રાષ્ટ્રીય ઉદ્યાનમાં વન્યજીવન સંશોધકો રાત્રિચર વાઘોનો અભ્યાસ કરવા માટે થર્મલ કેમેરાનો ઉપયોગ કરે છે તેમને ખલેલ પહોંચાડ્યા વગર। કેમેરા ઠંડા જંગલની પૃષ્ઠભૂમિ સામે વાઘોમાંથી શરીરની ઉષ્મા વિકિરણનો પતો લગાવે છે।",
        benefits: [
          "સંપૂર્ણ અંધકારમાં સુરક્ષા અને નિરીક્ષણ",
          "દૃશ્યમાન પ્રકાશ વિક્ષેપ વગર વન્યજીવન અવલોકન",
          "રાત્રે શોધ અને બચાવ કામગીરી",
          "લશ્કરી કામગીરી અને સીમા પહેરો",
        ],
        difficulty: "technology",
        icon: "🌙",
      },
      {
        id: 10,
        title: "પૃથ્વીનું ઊર્જા સંતુલન",
        category: "nature",
        description:
          "પૃથ્વી સૂર્યથી વિકિરણ પ્રાપ્ત કરે છે અને અવકાશમાં પાછી ઉષ્મા વિકિરણ કરે છે। આ બે વિકિરણ પ્રવાહો સંતુલિત હોવા જોઈએ, અન્યથા પૃથ્વી સતત ગરમ અથવા ઠંડી થતી રહેશે!",
        howItWorks:
          "પૃથ્વી વાતાવરણની ટોચ પર ~1360 W/m² સૌર વિકિરણ પ્રાપ્ત કરે છે। લગભગ 30% અવકાશમાં પાછું પરાવર્તિત થાય છે। બાકી 70% શોષાય છે, પૃથ્વીને ગરમ કરે છે, અને અવકાશમાં ઇન્ફ્રારેડ વિકિરણ તરીકે પુનઃ વિકિરણ થાય છે।",
        scienceBehind:
          "આવતું સૌર વિકિરણ (લઘુ તરંગ) = બહાર જતું સ્થળીય વિકિરણ (દીર્ઘ તરંગ) સ્થિર તાપમાન માટે। પૃથ્વીનું સરેરાશ તાપમાન ત્યાં સુધી સમાયોજિત થાય છે જ્યાં સુધી બહાર જતું વિકિરણ આવતા વિકિરણની બરાબર ન થાય। હાલમાં ~240 W/m² ચોખ્ખું પ્રાપ્ત થઈ રહ્યું છે, સમાન માત્રા પાછી વિકિરણ કરી રહ્યું છે।",
        realExample:
          "આ સંતુલન પૃથ્વીની આબોહવાને જાળવી રાખે છે। જો કે, વધતી ગ્રીનહાઉસ વાયુઓ વધુ બહાર જતા વિકિરણને ફસાવે છે, જે વાર્મિંગનું કારણ બને છે। આ ભારતીય કૃષિ, પાણી સંસાધનો અને હિમાલયન બરફને અસર કરે છે જેમ કે ગંગટોકની નજીક। વૈજ્ઞાનિકો આબોહવા પરિવર્તનને સમજવા માટે ઉપગ્રહોનો ઉપયોગ કરીને આ સંતુલનનું નિરીક્ષણ કરે છે।",
        benefits: [
          "સ્થિર વૈશ્વિક સરેરાશ તાપમાન (~15°C) જાળવી રાખે છે",
          "અનુમાનિત મોસમ અને આબોહવા પેટર્નને સક્ષમ બનાવે છે",
          "જીવનને સ્થિર પરિસ્થિતિઓ સાથે અનુકૂળ થવાની મંજૂરી આપે છે",
          "આને સમજવું આબોહવા પરિવર્તનની આગાહી કરવામાં મદદ કરે છે",
        ],
        difficulty: "nature",
        icon: "⚖️",
      },
    ],
  },
};

const RadiationRealWorld: React.FC<RadiationRealWorldProps> = ({ props }) => {
  const { language: contextLanguage } = useLanguage();
  const language: LanguageCode = (props?.language ||
    (contextLanguage as LanguageCode) ||
    "en") as LanguageCode;
  const t: RealWorldTranslations = (realWorldTranslations[language] || realWorldTranslations.en) as RealWorldTranslations;
  const APPLICATIONS: Application[] =
    t.applications.length > 0 ? t.applications : realWorldTranslations.en.applications;
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedApp, setExpandedApp] = useState<number | null>(null);

  const categories = [
    { value: "all", label: t.categories.all, icon: Globe },
    { value: "nature", label: t.categories.nature, icon: Sun },
    { value: "home", label: t.categories.home, icon: Home },
    { value: "everyday", label: t.categories.everyday, icon: Zap },
    { value: "technology", label: t.categories.technology, icon: Flame },
    { value: "clothing", label: t.categories.clothing, icon: Shirt },
  ];

  const filteredApplications =
    selectedCategory === "all"
      ? APPLICATIONS
      : APPLICATIONS.filter((app) => app.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      nature: "border-green-300 bg-green-50",
      home: "border-blue-300 bg-blue-50",
      everyday: "border-purple-300 bg-purple-50",
      technology: "border-red-300 bg-red-50",
      clothing: "border-pink-300 bg-pink-50",
    };
    return colors[category] || "border-gray-300 bg-gray-50";
  };

  const getDifficultyBadge = (difficulty: string) => {
    const badges: { [key: string]: { color: string; label: string } } = {
      everyday: {
        color: "bg-green-100 text-green-800",
        label: t.difficultyLabels.everyday,
      },
      nature: {
        color: "bg-blue-100 text-blue-800",
        label: t.difficultyLabels.nature,
      },
      technology: {
        color: "bg-purple-100 text-purple-800",
        label: t.difficultyLabels.technology,
      },
    };
    return badges[difficulty] || badges.everyday;
  };

  return (
    <div
      className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden"
      style={{ fontFamily: getFontFamilyForLanguage(language) }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white p-4 sm:p-6 md:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 mb-4">
          <Globe className="w-10 h-10" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{t.headerTitle}</h1>
            <p className="text-orange-100 text-sm sm:text-base">
              {t.headerSubtitle}
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
                  selectedCategory === category.value
                    ? "bg-white text-orange-600"
                    : "bg-white bg-opacity-20 text-white hover:bg-opacity-30"
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.label}
              </button>
            );
          })}
        </div>

        <div className="mt-3 sm:mt-4 text-orange-100 text-xs sm:text-sm">
          {t.showingCount(filteredApplications.length)}
        </div>
      </div>

      {/* Applications Grid */}
      <div className="p-4 sm:p-6 md:p-8">
        <div className="space-y-6">
          {filteredApplications.map((app) => (
            <div
              key={app.id}
              className={`border-2 rounded-2xl overflow-hidden transition-all ${
                expandedApp === app.id
                  ? "shadow-xl"
                  : "shadow-md hover:shadow-lg"
              } ${getCategoryColor(app.category)}`}
            >
              {/* Application Header */}
              <button
                onClick={() =>
                  setExpandedApp(expandedApp === app.id ? null : app.id)
                }
                className="w-full p-4 sm:p-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between hover:bg-white hover:bg-opacity-50 transition text-left"
              >
                <div className="flex items-center gap-3 sm:gap-4 flex-1 text-left">
                  <div className="text-3xl sm:text-4xl">{app.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">
                      {app.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          getDifficultyBadge(app.difficulty).color
                        }`}
                      >
                        {getDifficultyBadge(app.difficulty).label}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-600 capitalize">
                        • {app.category}
                      </span>
                    </div>
                  </div>
                </div>
                {expandedApp === app.id ? (
                  <ChevronUp className="w-6 h-6 text-gray-600" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-600" />
                )}
              </button>

              {/* Expanded Content */}
              {expandedApp === app.id && (
                <div className="px-4 sm:px-6 pb-6 space-y-6 bg-white">
                  {/* Description */}
                  <div className="border-l-4 border-cyan-500 pl-4 py-2">
                    <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                      <span className="text-cyan-500">●</span>{" "}
                      {t.sectionTitles.whatIsIt}
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {app.description}
                    </p>
                  </div>

                  {/* How It Works */}
                  <div className="border-l-4 border-purple-500 pl-4 py-2">
                    <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                      <span className="text-purple-500">●</span>{" "}
                      {t.sectionTitles.howItWorks}
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {app.howItWorks}
                    </p>
                  </div>

                  {/* Science Behind It */}
                  <div className="border-l-4 border-amber-500 pl-4 py-2">
                    <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                      <span className="text-amber-500">●</span>{" "}
                      {t.sectionTitles.scienceBehind}
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {app.scienceBehind}
                    </p>
                  </div>

                  {/* Real Example */}
                  <div className="border-l-4 border-green-500 pl-4 py-2">
                    <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                      <span className="text-green-500">●</span>{" "}
                      {t.sectionTitles.realExample}
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {app.realExample}
                    </p>
                  </div>

                  {/* Benefits */}
                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="text-blue-500">●</span>{" "}
                      {t.sectionTitles.benefits}
                    </h4>
                    <ul className="space-y-2">
                      {app.benefits.map((benefit, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-gray-700"
                        >
                          <span className="text-blue-500 mt-1">✓</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Export as named export
export { RadiationRealWorld };


// Imports already at top of file

interface Question {
  id: number;
  question: string;
  type: "mcq" | "true_false" | "match" | "sequence";
  options?: string[];
  correctAnswer: string | string[] | { [key: string]: string };
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  points: number;
}

interface RadiationPracticeModeProps {
  props?: {
    language?: LanguageCode;
  };
}

interface PracticeTranslations {
  headerTitle: string;
  headerSubtitle: string;
  pointsLabel: string;
  progressLabel: (answered: number, total: number) => string;
  questionLabel: (id: number) => string;
  submitAnswer: string;
  next: string;
  previous: string;
  restartQuiz: string;
  finalTitle: string;
  finalSubtitle: string;
  totalPoints: string;
  scoreLabel: string;
  correctLabel: string;
  gradeLabel: string;
  keyRemindersTitle: string;
  keyReminders: string[];
  correctFeedback: string;
  incorrectFeedback: string;
  arrangeSequenceHint: string;
  selectAnswerPlaceholder: string;
  gradeExcellent: string;
  gradeGood: string;
  gradeKeepPracticing: string;
  difficultyLabels?: {
    easy: string;
    medium: string;
    hard: string;
  };
  questions: Question[];
}

interface PracticeTranslationsType {
  en: PracticeTranslations;
  hi: PracticeTranslations;
  gu: PracticeTranslations;
}

const practiceTranslations: PracticeTranslationsType = {
  en: {
    headerTitle: "Radiation Practice Quiz",
    headerSubtitle: "Test Your Understanding",
    pointsLabel: "points",
    progressLabel: (answered: number, total: number) =>
      `${answered} of ${total} questions answered`,
    questionLabel: (id: number) => `Q${id}`,
    submitAnswer: "Submit Answer",
    next: "Next",
    previous: "Previous",
    restartQuiz: "Restart Quiz",
    finalTitle: "Quiz Complete! 🎉",
    finalSubtitle: "Great job completing the radiation quiz!",
    totalPoints: "Total Points",
    scoreLabel: "Score",
    correctLabel: "Correct",
    gradeLabel: "Grade",
    keyRemindersTitle: "📚 Key Reminders:",
    keyReminders: [
      "Radiation does NOT need any medium - works in vacuum!",
      "Sun's heat reaches Earth through radiation across 150 million km",
      "Light colors reflect heat, dark colors absorb heat",
      "All objects radiate heat to their surroundings",
      "Conduction and convection need a medium, radiation doesn't",
    ],
    correctFeedback: "✓ Correct!",
    incorrectFeedback: "✗ Incorrect",
    arrangeSequenceHint:
      "Use the arrows to arrange these steps in the correct order",
    selectAnswerPlaceholder: "Select answer...",
    gradeExcellent: "Excellent! 🌟",
    gradeGood: "Good Job! 👍",
    gradeKeepPracticing: "Keep Practicing! 📚",
    difficultyLabels: {
      easy: "EASY",
      medium: "MEDIUM",
      hard: "HARD",
    },
    questions: [
      {
        id: 1,
        question: "What is radiation?",
        type: "mcq",
        options: [
          "Heat transfer through direct contact between particles",
          "Heat transfer through movement of particles in fluids",
          "Heat transfer without requiring any medium",
          "Heat transfer only in solids",
        ],
        correctAnswer: "Heat transfer without requiring any medium",
        explanation:
          "Radiation is the process of heat transfer that does NOT require any medium (solid, liquid, or gas). Heat travels directly from a hot object through empty space.",
        difficulty: "easy",
        points: 10,
      },
      {
        id: 2,
        question: "Radiation can travel through vacuum (empty space).",
        type: "true_false",
        options: ["True", "False"],
        correctAnswer: "True",
        explanation:
          "TRUE! This is what makes radiation unique. The Sun's heat reaches Earth by traveling through 150 million km of vacuum space. No medium is needed!",
        difficulty: "easy",
        points: 10,
      },
      {
        id: 3,
        question: "How does heat from the Sun reach Earth?",
        type: "mcq",
        options: [
          "Through conduction in the atmosphere",
          "Through convection currents in space",
          "Through radiation across vacuum",
          "Through air particles in space",
        ],
        correctAnswer: "Through radiation across vacuum",
        explanation:
          "The Sun's heat reaches Earth through radiation. It travels 150 million kilometers through the vacuum of space where there are no particles to conduct or convect heat!",
        difficulty: "medium",
        points: 15,
      },
      {
        id: 4,
        question:
          "Why do we wear white clothes in summer and dark clothes in winter?",
        type: "mcq",
        options: [
          "White clothes absorb heat, dark clothes reflect heat",
          "White clothes reflect heat, dark clothes absorb heat",
          "Color has no effect on heat",
          "White clothes conduct heat better",
        ],
        correctAnswer: "White clothes reflect heat, dark clothes absorb heat",
        explanation:
          "Light colors REFLECT most heat radiation (keeping us cool in summer), while dark colors ABSORB more heat radiation (keeping us warm in winter).",
        difficulty: "medium",
        points: 15,
      },
      {
        id: 5,
        question: "All objects radiate heat to their surroundings.",
        type: "true_false",
        options: ["True", "False"],
        correctAnswer: "True",
        explanation:
          "TRUE! Every object radiates heat. A hot utensil kept away from flame gradually cools down by radiating heat to cooler surroundings. Hotter objects radiate more heat.",
        difficulty: "easy",
        points: 10,
      },
      {
        id: 6,
        question:
          "Pema and Palden felt warm sitting near the fireplace even without touching the fire. This warmth was due to:",
        type: "mcq",
        options: [
          "Conduction through the air",
          "Convection currents in the room",
          "Radiation from the fire",
          "Reflected heat from walls",
        ],
        correctAnswer: "Radiation from the fire",
        explanation:
          "The warmth they felt was due to RADIATION - heat traveling directly from the fire to them through the air without needing the air particles to move.",
        difficulty: "medium",
        points: 15,
      },
      {
        id: 7,
        question: "Which statement about radiation is INCORRECT?",
        type: "mcq",
        options: [
          "Radiation requires a medium to travel",
          "Radiation can travel through vacuum",
          "All objects radiate heat",
          "The Sun's heat reaches Earth by radiation",
        ],
        correctAnswer: "Radiation requires a medium to travel",
        explanation:
          "This is INCORRECT! Radiation does NOT require any medium. This is what makes it different from conduction and convection, which both need a medium.",
        difficulty: "hard",
        points: 20,
      },
      {
        id: 8,
        question:
          "A hot metal pot is kept on a table (not on a stove). It gradually cools down. What process causes this cooling?",
        type: "mcq",
        options: [
          "Conduction to the table only",
          "Convection in the air only",
          "Radiation to surroundings only",
          "All three: conduction, convection, and radiation",
        ],
        correctAnswer: "All three: conduction, convection, and radiation",
        explanation:
          "The pot cools through ALL THREE processes: conduction to the table, convection to air around it, and radiation to all surroundings. But the textbook emphasizes radiation!",
        difficulty: "hard",
        points: 20,
      },
      {
        id: 9,
        question: "Wet clothes dry faster in sunlight because:",
        type: "mcq",
        options: [
          "Wind blows the water away",
          "Sun's radiation heats water molecules causing faster evaporation",
          "Air conducts heat to clothes",
          "Sunlight absorbs the water",
        ],
        correctAnswer:
          "Sun's radiation heats water molecules causing faster evaporation",
        explanation:
          "The Sun's RADIATION heats the water in clothes, making water molecules move faster and evaporate more quickly. The heat travels through space and air via radiation!",
        difficulty: "medium",
        points: 15,
      },
      {
        id: 10,
        question: "Heat transfer methods can work together at the same time.",
        type: "true_false",
        options: ["True", "False"],
        correctAnswer: "True",
        explanation:
          "TRUE! When heating water in a pan: conduction transfers heat from flame to pan, convection heats the water, and radiation makes you feel warmth near the flame. All three work together!",
        difficulty: "easy",
        points: 10,
      },
      {
        id: 11,
        question:
          "Match each heat transfer process with its key characteristic:",
        type: "match",
        options: [
          "Conduction|Particles pass heat to neighbors without moving position",
          "Convection|Particles physically move carrying heat with them",
          "Radiation|No medium needed, works in vacuum",
          "All three|Require a temperature difference",
        ],
        correctAnswer: {
          Conduction:
            "Particles pass heat to neighbors without moving position",
          Convection: "Particles physically move carrying heat with them",
          Radiation: "No medium needed, works in vacuum",
          "All three": "Require a temperature difference",
        },
        explanation:
          "Each heat transfer method has unique characteristics. Radiation's ability to work without any medium makes it special - that's how the Sun's energy reaches us!",
        difficulty: "hard",
        points: 25,
      },
      {
        id: 12,
        question:
          "Arrange these statements about solar cookers in the correct order from start to finish:",
        type: "sequence",
        options: [
          "Sunlight reaches Earth through radiation across space",
          "Mirrors reflect and concentrate sunlight",
          "Concentrated radiation heats the cooking pot",
          "Food in the pot gets cooked",
          "All this happens without any medium for heat transfer!",
        ],
        correctAnswer: [
          "Sunlight reaches Earth through radiation across space",
          "Mirrors reflect and concentrate sunlight",
          "Concentrated radiation heats the cooking pot",
          "Food in the pot gets cooked",
          "All this happens without any medium for heat transfer!",
        ],
        explanation:
          "Solar cookers demonstrate radiation perfectly: the Sun's energy travels through vacuum, gets concentrated by mirrors, and heats food - all through radiation without needing particles to carry the heat!",
        difficulty: "hard",
        points: 25,
      },
    ],
  },
  hi: {
    headerTitle: "विकिरण अभ्यास क्विज",
    headerSubtitle: "अपनी समझ की जाँच करें",
    pointsLabel: "अंक",
    progressLabel: (answered: number, total: number) =>
      `${answered} में से ${total} प्रश्न हल किए गए`,
    questionLabel: (id: number) => `प्रश्न ${id}`,
    submitAnswer: "उत्तर जमा करें",
    next: "अगला",
    previous: "पिछला",
    restartQuiz: "क्विज़ फिर से शुरू करें",
    finalTitle: "क्विज़ पूरा! 🎉",
    finalSubtitle: "विकिरण पर क्विज़ पूरा करने के लिए शाबाश!",
    totalPoints: "कुल अंक",
    scoreLabel: "स्कोर",
    correctLabel: "सही उत्तर",
    gradeLabel: "ग्रेड",
    keyRemindersTitle: "📚 मुख्य बातें:",
    keyReminders: [
      "विकिरण को किसी भी माध्यम की आवश्यकता नहीं होती - निर्वात में भी काम करता है!",
      "सूर्य की ऊष्मा 150 मिलियन km दूर से विकिरण के द्वारा पृथ्वी तक पहुँचती है",
      "हल्के रंग ऊष्मा को परावर्तित करते हैं, गहरे रंग ऊष्मा को अधिक अवशोषित करते हैं",
      "सभी वस्तुएँ अपने आस-पास में ऊष्मा का विकिरण करती हैं",
      "चालन और संवहन को माध्यम चाहिए, विकिरण को नहीं",
    ],
    correctFeedback: "✓ सही उत्तर!",
    incorrectFeedback: "✗ गलत उत्तर",
    arrangeSequenceHint:
      "कृपया तीरों का उपयोग करके इन चरणों को सही क्रम में लगाएँ",
    selectAnswerPlaceholder: "उत्तर चुनें...",
    gradeExcellent: "उत्कृष्ट! 🌟",
    gradeGood: "अच्छा काम! 👍",
    gradeKeepPracticing: "लगातार अभ्यास करते रहें! 📚",
    difficultyLabels: {
      easy: "आसान",
      medium: "मध्यम",
      hard: "कठिन",
    },
    questions: [
      {
        id: 1,
        question: "विकिरण क्या है?",
        type: "mcq",
        options: [
          "कणों के सीधे संपर्क से ऊष्मा का स्थानांतरण",
          "द्रवों / गैसों में कणों की गति से ऊष्मा का स्थानांतरण",
          "ऊष्मा का बिना किसी माध्यम के स्थानांतरण",
          "केवल ठोसों में ऊष्मा का स्थानांतरण",
        ],
        correctAnswer: "ऊष्मा का बिना किसी माध्यम के स्थानांतरण",
        explanation:
          "विकिरण वह प्रक्रिया है जिसमें ऊष्मा का स्थानांतरण किसी भी माध्यम (ठोस, द्रव या गैस) के बिना होता है। ऊष्मा सीधे गर्म वस्तु से खाली स्थान के माध्यम से हमारे पास पहुँचती है।",
        difficulty: "easy",
        points: 10,
      },
      {
        id: 2,
        question: "विकिरण निर्वात (खाली स्थान) में भी यात्रा कर सकता है।",
        type: "true_false",
        options: ["सही", "गलत"],
        correctAnswer: "सही",
        explanation:
          "सही! यही बात विकिरण को विशेष बनाती है। सूर्य की ऊष्मा 150 मिलियन km के निर्वात से होकर पृथ्वी तक पहुँचती है। इसके लिए किसी माध्यम की आवश्यकता नहीं होती।",
        difficulty: "easy",
        points: 10,
      },
      {
        id: 3,
        question: "सूर्य की ऊष्मा पृथ्वी तक कैसे पहुँचती है?",
        type: "mcq",
        options: [
          "वायुमंडल में चालन के द्वारा",
          "अंतरिक्ष में संवहन धाराओं के द्वारा",
          "निर्वात में विकिरण के द्वारा",
          "अंतरिक्ष में वायु कणों के द्वारा",
        ],
        correctAnswer: "निर्वात में विकिरण के द्वारा",
        explanation:
          "सूर्य की ऊष्मा पृथ्वी तक विकिरण के द्वारा पहुँचती है। यह 150 मिलियन km दूर अंतरिक्ष के निर्वात से होकर आती है, जहाँ चालन या संवहन के लिए कोई कण नहीं होते।",
        difficulty: "medium",
        points: 15,
      },
      {
        id: 4,
        question:
          "हम गर्मियों में सफेद कपड़े और सर्दियों में गहरे रंग के कपड़े क्यों पहनते हैं?",
        type: "mcq",
        options: [
          "सफेद कपड़े ऊष्मा अवशोषित करते हैं, गहरे कपड़े ऊष्मा परावर्तित करते हैं",
          "सफेद कपड़े ऊष्मा परावर्तित करते हैं, गहरे कपड़े ऊष्मा अवशोषित करते हैं",
          "रंग का ऊष्मा से कोई संबंध नहीं है",
          "सफेद कपड़े ऊष्मा को बेहतर चलित करते हैं",
        ],
        correctAnswer:
          "सफेद कपड़े ऊष्मा परावर्तित करते हैं, गहरे कपड़े ऊष्मा अवशोषित करते हैं",
        explanation:
          "हल्के रंग (जैसे सफेद) अधिकांश ऊष्मा विकिरण को परावर्तित कर देते हैं, इसलिए गर्मियों में हमें ठंडा रखते हैं। गहरे रंग अधिक ऊष्मा विकिरण को अवशोषित करते हैं, इसलिए सर्दियों में हमें गरम रखते हैं।",
        difficulty: "medium",
        points: 15,
      },
      {
        id: 5,
        question: "सभी वस्तुएँ अपने आस-पास की ओर ऊष्मा का विकिरण करती हैं।",
        type: "true_false",
        options: ["सही", "गलत"],
        correctAnswer: "सही",
        explanation:
          "सही! हर वस्तु ऊष्मा का कुछ न कुछ विकिरण करती है। चूल्हे से हटाया गया गरम बर्तन धीरे-धीरे ठंडा हो जाता है क्योंकि वह अपने आसपास की ठंडी वस्तुओं की ओर ऊष्मा विकिरित करता है। तापमान जितना अधिक, विकिरण उतना अधिक।",
        difficulty: "easy",
        points: 10,
      },
      {
        id: 6,
        question:
          "पेमा और पेल्डन आग के पास बैठे थे और बिना छुए ही उन्हें गरमी महसूस हुई। यह गरमी किस कारण से थी?",
        type: "mcq",
        options: [
          "वायु के द्वारा चालन",
          "कक्ष में संवहन धाराओं के कारण",
          "आग से आने वाले विकिरण के कारण",
          "दीवारों से परावर्तित ऊष्मा के कारण",
        ],
        correctAnswer: "आग से आने वाले विकिरण के कारण",
        explanation:
          "उन्हें महसूस हुई गरमी विकिरण के कारण थी। ऊष्मा सीधे आग से उनके शरीर तक हवा के माध्यम से पहुँची, बिना इस के कि हवा के कणों को बहुत अधिक हिलना-डुलना पड़े।",
        difficulty: "medium",
        points: 15,
      },
      {
        id: 7,
        question: "विकिरण के बारे में कौन-सा कथन गलत है?",
        type: "mcq",
        options: [
          "विकिरण के लिए माध्यम आवश्यक है",
          "विकिरण निर्वात में भी यात्रा कर सकता है",
          "सभी वस्तुएँ ऊष्मा का विकिरण करती हैं",
          "सूर्य की ऊष्मा पृथ्वी तक विकिरण से पहुँचती है",
        ],
        correctAnswer: "विकिरण के लिए माध्यम आवश्यक है",
        explanation:
          "यह कथन गलत है। विकिरण को किसी भी माध्यम की आवश्यकता नहीं होती। यही बात इसे चालन और संवहन से अलग बनाती है, जिन्हें माध्यम चाहिए।",
        difficulty: "hard",
        points: 20,
      },
      {
        id: 8,
        question:
          "एक गरम धातु का बर्तन मेज पर रखा है (चूल्हे पर नहीं)। वह धीरे-धीरे ठंडा हो जाता है। यह ठंडा होना किस प्रक्रिया के कारण होता है?",
        type: "mcq",
        options: [
          "केवल मेज की ओर चालन",
          "केवल वायु में संवहन",
          "केवल आसपास की ओर विकिरण",
          "तीनों: चालन, संवहन और विकिरण",
        ],
        correctAnswer: "तीनों: चालन, संवहन और विकिरण",
        explanation:
          "बर्तन तीनों तरीकों से ऊष्मा खोता है: मेज की ओर चालन, आसपास की वायु की ओर संवहन और चारों ओर की वस्तुओं की ओर विकिरण। पाठ्यपुस्तक विशेष रूप से विकिरण पर जोर देती है।",
        difficulty: "hard",
        points: 20,
      },
      {
        id: 9,
        question: "गीले कपड़े धूप में अधिक जल्दी सूख जाते हैं क्योंकि:",
        type: "mcq",
        options: [
          "हवा पानी को उड़ा ले जाती है",
          "सूर्य का विकिरण पानी के कणों को गरम कर तेज वाष्पीकरण कराता है",
          "हवा ऊष्मा का चालन करके कपड़ों को गरम करती है",
          "सूर्य का प्रकाश पानी को सोख लेता है",
        ],
        correctAnswer:
          "सूर्य का विकिरण पानी के कणों को गरम कर तेज वाष्पीकरण कराता है",
        explanation:
          "सूर्य का विकिरण कपड़ों में मौजूद पानी को गरम करता है, जिससे जल-अणु तेज़ गति से हिलने लगते हैं और जल्दी वाष्पित हो जाते हैं। ऊष्मा अंतरिक्ष और वायु से होकर विकिरण द्वारा कपड़ों तक पहुँचती है।",
        difficulty: "medium",
        points: 15,
      },
      {
        id: 10,
        question:
          "ऊष्मा के विभिन्न स्थानांतरण के तरीके एक साथ काम कर सकते हैं।",
        type: "true_false",
        options: ["सही", "गलत"],
        correctAnswer: "सही",
        explanation:
          "सही! जब हम पतीले में पानी गरम करते हैं: चालन से ऊष्मा चूल्हे से पतीले तक जाती है, संवहन से पानी गरम होता है और विकिरण से हमें ज्वाला के पास ऊष्मा महसूस होती है। तीनों तरीके एक साथ काम करते हैं।",
        difficulty: "easy",
        points: 10,
      },
      {
        id: 11,
        question:
          "प्रत्येक ऊष्मा स्थानांतरण प्रक्रिया का उसके मुख्य गुण के साथ मिलान कीजिए:",
        type: "match",
        options: [
          "चालन|कण अपनी जगह से बिना हिले पड़ोसी कणों को ऊष्मा देते हैं",
          "संवहन|कण स्वयं चलकर ऊष्मा को साथ ले जाते हैं",
          "विकिरण|बिना किसी माध्यम के, निर्वात में भी कार्य करता है",
          "सभी|तापांतर (तापमान का अंतर) आवश्यक है",
        ],
        correctAnswer: {
          चालन: "कण अपनी जगह से बिना हिले पड़ोसी कणों को ऊष्मा देते हैं",
          संवहन: "कण स्वयं चलकर ऊष्मा को साथ ले जाते हैं",
          विकिरण: "बिना किसी माध्यम के, निर्वात में भी कार्य करता है",
          सभी: "तापांतर (तापमान का अंतर) आवश्यक है",
        },
        explanation:
          "प्रत्येक ऊष्मा स्थानांतरण विधि की अपनी विशेषता होती है। विकिरण की यह विशेषता कि उसे किसी माध्यम की आवश्यकता नहीं होती, उसे खास बनाती है – इसी से सूर्य की ऊर्जा हम तक पहुँचती है।",
        difficulty: "hard",
        points: 25,
      },
      {
        id: 12,
        question:
          "सौर कुकर के बारे में इन कथनों को सही क्रम में लगाएँ (आरंभ से अंत तक):",
        type: "sequence",
        options: [
          "सूर्य का प्रकाश विकिरण के रूप में अंतरिक्ष से पृथ्वी तक पहुँचता है",
          "दर्पण सूर्य के प्रकाश को परावर्तित और केंद्रित करते हैं",
          "केंद्रित विकिरण से पकाने वाला बर्तन गरम हो जाता है",
          "बर्तन में रखा भोजन पक जाता है",
          "यह सब बिना किसी माध्यम के ऊष्मा स्थानांतरण के होता है!",
        ],
        correctAnswer: [
          "सूर्य का प्रकाश विकिरण के रूप में अंतरिक्ष से पृथ्वी तक पहुँचता है",
          "दर्पण सूर्य के प्रकाश को परावर्तित और केंद्रित करते हैं",
          "केंद्रित विकिरण से पकाने वाला बर्तन गरम हो जाता है",
          "बर्तन में रखा भोजन पक जाता है",
          "यह सब बिना किसी माध्यम के ऊष्मा स्थानांतरण के होता है!",
        ],
        explanation:
          "सौर कुकर विकिरण का एक अच्छा उदाहरण हैं: सूर्य की ऊर्जा निर्वात से होकर आती है, दर्पणों द्वारा केंद्रित की जाती है और बर्तन को गरम कर भोजन पकाती है – यह सब केवल विकिरण के द्वारा होता है।",
        difficulty: "hard",
        points: 25,
      },
    ],
  },
  gu: {
    headerTitle: "વિકિરણ પ્રેક્ટિસ ક્વિઝ",
    headerSubtitle: "તમારી સમજ તપાસો",
    pointsLabel: "અંકો",
    progressLabel: (answered: number, total: number) =>
      `${total}માંથી ${answered} પ્રશ્નોના જવાબ આપ્યા`,
    questionLabel: (id: number) => `પ્રશ્ન ${id}`,
    submitAnswer: "જવાબ મોકલો",
    next: "આગળ",
    previous: "પાછળ",
    restartQuiz: "ક્વિઝ ફરી શરૂ કરો",
    finalTitle: "ક્વિઝ પૂર્ણ! 🎉",
    finalSubtitle: "વિકિરણ વિષય પર ક્વિઝ પૂર્ણ કરવા બદલ ખૂબ સારું!",
    totalPoints: "કુલ અંકો",
    scoreLabel: "સ્કોર",
    correctLabel: "સાચા જવાબ",
    gradeLabel: "ગ્રેડ",
    keyRemindersTitle: "📚 મહત્વના મુદ્દા:",
    keyReminders: [
      "વિકિરણને કોઈ માધ્યમની જરૂર પડતી નથી - ખાલી જગ્યામાં પણ કામ કરે છે!",
      "સૂર્યની ઉષ્મા 150 મિલિયન km દૂરથી વિકિરણ દ્વારા પૃથ્વી સુધી પહોંચે છે",
      "હળવા રંગો ઉષ્મા પરાવર્તિત કરે છે, ગાઢ રંગો વધુ ઉષ્મા શોષે છે",
      "બધી વસ્તુઓ પોતાની આસપાસ ઉષ્માનો વિકિરણ કરે છે",
      "ચાલન અને સંવહનને માધ્યમ જોઈએ, વિકિરણને નહિ",
    ],
    correctFeedback: "✓ સાચો જવાબ!",
    incorrectFeedback: "✗ ખોટો જવાબ",
    arrangeSequenceHint: "તીર બટનોનો ઉપયોગ કરીને પગથિયાંને યોગ્ય ક્રમમાં મૂકો",
    selectAnswerPlaceholder: "જવાબ પસંદ કરો...",
    gradeExcellent: "ઉત્તમ! 🌟",
    gradeGood: "સારો પ્રયાસ! 👍",
    gradeKeepPracticing: "અભ્યાસ ચાલુ રાખો! 📚",
    difficultyLabels: {
      easy: "સરળ",
      medium: "મધ્યમ",
      hard: "કઠિન",
    },
    questions: [
      {
        id: 1,
        question: "વિકિરણ શું છે?",
        type: "mcq",
        options: [
          "કણોના સીધા સંપર્કથી ઉષ્મા સ્થાનાંતરણ",
          "દ્રવ / વાયુમાં કણોની ચાલથી ઉષ્મા સ્થાનાંતરણ",
          "કોઈ માધ્યમ વગર ઉષ્મા સ્થાનાંતરણ",
          "ફક્ત ઠોસમાં ઉષ્મા સ્થાનાંતરણ",
        ],
        correctAnswer: "કોઈ માધ્યમ વગર ઉષ્મા સ્થાનાંતરણ",
        explanation:
          "વિકિરણ એ એવી પ્રક્રિયા છે જેમાં ઉષ્માનું સ્થાનાંતરણ કોઈ પણ માધ્યમ (ઠોસ, દ્રવ કે વાયુ) વગર થાય છે। ગરમ પદાર્થમાંથી ઉષ્મા ખાલી જગ્યા મારફતે સીધી અમારી પાસે પહોંચે છે।",
        difficulty: "easy",
        points: 10,
      },
      {
        id: 2,
        question: "વિકિરણ શૂન્યાવકાશ (ખાલી જગ્યા)માં પણ ફેલાઈ શકે છે.",
        type: "true_false",
        options: ["સાચું", "ખોટું"],
        correctAnswer: "સાચું",
        explanation:
          "સાચું! આ જ વિકિરણની ખાસિયત છે। સૂર્યની ઉષ્મા 150 મિલિયન km લાંબા શૂન્યાવકાશમાંથી પસાર થઈને પૃથ્વી સુધી પહોંચે છે। તેને કોઈ માધ્યમની જરૂર પડતી નથી।",
        difficulty: "easy",
        points: 10,
      },
      {
        id: 3,
        question: "સૂર્યની ઉષ્મા પૃથ્વી સુધી કેવી રીતે પહોંચે છે?",
        type: "mcq",
        options: [
          "વાયુમંડળમાં ચालन દ્વારા",
          "અવકાશમાં સંવહન પ્રવાહોથી",
          "શૂન્યાવકાશમાં વિકિરણ દ્વારા",
          "અવકાશમાં હવાના કણોથી",
        ],
        correctAnswer: "શૂન્યાવકાશમાં વિકિરણ દ્વારા",
        explanation:
          "સૂર્યની ઉષ્મા પૃથ્વી સુધી વિકિરણ દ્વારા આવે છે। તે 150 મિલિયન km દૂરના શૂન્યાવકાશમાંથી પસાર થાય છે, જ્યાં ચालन કે સંવહન માટે કોઈ કણ હાજર નથી।",
        difficulty: "medium",
        points: 15,
      },
      {
        id: 4,
        question:
          "અમે ઉનાળામાં સફેદ કપડાં અને શિયાળામાં ગાઢ રંગના કપડાં શા માટે પહેરીએ છીએ?",
        type: "mcq",
        options: [
          "સફેદ કપડાં ઉષ્મા શોષે છે, ગાઢ કપડાં ઉષ્મા પરાવર્તિત કરે છે",
          "સફેદ કપડાં ઉષ્મા પરાવર્તિત કરે છે, ગાઢ કપડાં ઉષ્મા શોષે છે",
          "રંગનો ઉષ્મા સાથે કોઈ સંબંધ નથી",
          "સફેદ કપડાં ઉષ્મા સારી રીતે ચલિત કરે છે",
        ],
        correctAnswer:
          "સફેદ કપડાં ઉષ્મા પરાવર્તિત કરે છે, ગાઢ કપડાં ઉષ્મા શોષે છે",
        explanation:
          "હળવા રંગો (જેમ કે સફેદ) મોટા ભાગનું ઉષ્મા વિકિરણ પરાવર્તિત કરે છે, તેથી ઉનાળામાં આપણને ઠંડું રાખે છે। ગાઢ રંગો વધુ ઉષ્મા વિકિરણ શોષે છે, તેથી શિયાળામાં આપણને ગરમ રાખે છે।",
        difficulty: "medium",
        points: 15,
      },
      {
        id: 5,
        question: "બધા પદાર્થો પોતાની આસપાસની તરફ ઉષ્મા વિકિરણ કરે છે.",
        type: "true_false",
        options: ["સાચું", "ખોટું"],
        correctAnswer: "સાચું",
        explanation:
          "સાચું! દરેક પદાર્થ કંઈક ઉષ્મા વિકિરણ કરે છે। ચુલ્હાથી દૂર મૂકેલું ગરમ વાસણ ધીમે ધીમે ઠંડુ થઈ જાય છે કારણ કે તે આસપાસના ઠંડા પદાર્થોની તરફ ઉષ્મા વિકિરણ કરે છે। ગરમ પદાર્થ વધુ વિકિરણ કરે છે।",
        difficulty: "easy",
        points: 10,
      },
      {
        id: 6,
        question:
          "પેમા અને પેલ્ડન અગ્નિ પાસે બેઠા હતા અને વગર સ્પર્શ્યા પણ તેમને ગરમી લાગી। આ ગરમી કઈ પ્રક્રિયાના કારણે હતી?",
        type: "mcq",
        options: [
          "હવાના દ્વારા ચालन",
          "ખંડમાં સંવહન પ્રવાહોના કારણે",
          "અગ્નિ તરફથી આવતું વિકિરણ",
          "ભીંતોથી પરાવર્તિત ઉષ્મા",
        ],
        correctAnswer: "અગ્નિ તરફથી આવતું વિકિરણ",
        explanation:
          "તેમને લાગેલી ગરમી વિકિરણના કારણે હતી। ઉષ્મા સીધી જ અગ્નિમાંથી તેમના શરીર સુધી હવામાંથી આવી, હવાના કણોને વધુ હલનચલનની જરૂર વગર।",
        difficulty: "medium",
        points: 15,
      },
      {
        id: 7,
        question: "વિકિરણ વિશે નીચેનું કયું નિવેદન ખોટું છે?",
        type: "mcq",
        options: [
          "વિકિરણ માટે માધ્યમ જરૂરી છે",
          "વિકિરણ શૂન્યાવકાશમાં પણ જઈ શકે છે",
          "બધા પદાર્થો ઉષ્મા વિકિરણ કરે છે",
          "સૂર્યની ઉષ્મા પૃથ્વી સુધી વિકિરણ દ્વારા આવે છે",
        ],
        correctAnswer: "વિકિરણ માટે માધ્યમ જરૂરી છે",
        explanation:
          "આ નિવેદન ખોટું છે। વિકિરણને કોઈ માધ્યમની જરૂર નથી। આ જ તેને ચાલન અને સંવહનથી અલગ બનાવે છે, જેને માધ્યમની જરૂર પડે છે।",
        difficulty: "hard",
        points: 20,
      },
      {
        id: 8,
        question:
          "એક ગરમ ધાતુનું વાસણ ટેબલ પર મૂકેલું છે (ચુલ્હા પર નથી)। તે ધીમે ધીમે ઠંડુ થાય છે। આ ઠંડુ થવું કઈ પ્રક્રિયા/પ્રક્રિયાઓના કારણે છે?",
        type: "mcq",
        options: [
          "ફક્ત ટેબલ તરફ ચાલન",
          "ફક્ત હવામાં સંવહન",
          "ફક્ત આસપાસની તરફ વિકિરણ",
          "ત્રણેય: ચાલન, સંવહન અને વિકિરણ",
        ],
        correctAnswer: "ત્રણેય: ચાલન, સંવહન અને વિકિરણ",
        explanation:
          "વાસણથી ઉષ્મા ત્રણેય રીતે બહાર જાય છે: ટેબલ તરફ ચલન દ્વારા, આસપાસની હવા તરફ સંવહનથી અને ચારે તરફના પદાર્થોની તરફ વિકિરણથી। પાઠ્યપુસ્તક ખાસ કરીને વિકિરણ પર ભાર મૂકે છે।",
        difficulty: "hard",
        points: 20,
      },
      {
        id: 9,
        question: "ધુપમાં કપડાં વધારે ઝડપથી પણા (સૂખા) થઈ જાય છે કારણ કે:",
        type: "mcq",
        options: [
          "પવન પાણી ઉડાવી નાખે છે",
          "સૂર્યનું વિકિરણ પાણીના કણોને ગરમ કરીને ઝડપી બાષ્પીભવન કરાવે છે",
          "હવા ઉષ્મા ચલીત કરી કપડાંને ગરમ કરે છે",
          "સૂર્યપ્રકાશ પાણી શોષી લે છે",
        ],
        correctAnswer:
          "સૂર્યનું વિકિરણ પાણીના કણોને ગરમ કરીને ઝડપી બાષ્પીભવન કરાવે છે",
        explanation:
          "સૂર્યનું વિકિરણ કપડાંમાં રહેલા પાણીને ગરમ કરે છે, જેના કારણે જલકણો ઝડપથી હલવા લાગે છે અને વધુ ઝડપથી બાષ્પીભવન થાય છે। ઉષ્મા અવકાશ અને હવામાંથી પસાર થઈ વિકિરણ દ્વારા કપડાં સુધી પહોંચે છે।",
        difficulty: "medium",
        points: 15,
      },
      {
        id: 10,
        question: "ઉષ્મા સ્થાનાંતરણની અલગ અલગ રીતો એક સાથે કામ કરી શકે છે।",
        type: "true_false",
        options: ["સાચું", "ખોટું"],
        correctAnswer: "સાચું",
        explanation:
          "સાચું! જ્યારે આપણે વાસણમાં પાણી ગરમ કરીએ ત્યારે: ચાલનથી ઉષ્મા ચુલ્હાથી વાસણ સુધી જાય છે, સંવહનથી પાણી ગરમ થાય છે અને વિકિરણથી આપણને જ્વાળા પાસેઊષ્મા અનુભવાય છે। ત્રણેય રીતો એકસાથે કાર્ય કરે છે।",
        difficulty: "easy",
        points: 10,
      },
      {
        id: 11,
        question:
          "દરેક ઉષ્મા સ્થાનાંતરણ પ્રક્રિયાને તેના મુખ્ય લક્ષણ સાથે જોડો:",
        type: "match",
        options: [
          "ચાલન|કણો પોતાની જગ્યા છોડ્યા વગર પડોશી કણોને ઉષ્મા આપે છે",
          "સંવહન|કણો સ્વયં ચાલીને ઉષ્માને સાથે લઈ જાય છે",
          "વિકિરણ|કોઈ માધ્યમ વગર, શૂન્યાવકાશમાં પણ કાર્ય કરે છે",
          "બધા|તાપમાનમાં તફાવત (તાપાંત્ર) જરૂરી છે",
        ],
        correctAnswer: {
          ચાલન: "કણો પોતાની જગ્યા છોડ્યા વગર પડોશી કણોને ઉષ્મા આપે છે",
          સંવહન: "કણો સ્વયં ચાલીને ઉષ્માને સાથે લઈ જાય છે",
          વિકિરણ: "કોઈ માધ્યમ વગર, શૂન્યાવકાશમાં પણ કાર્ય કરે છે",
          બધા: "તાપમાનમાં તફાવત (તાપાંત્ર) જરૂરી છે",
        },
        explanation:
          "દરેક ઉષ્મા સ્થાનાંતરણ પ્રક્રીયાની પોતાની ખાસિયત હોય છે। વિકિરણની સૌથી મોટી ખાસિયત એ છે કે તેને કોઈ માધ્યમની જરૂર નથી – આ કારણે જ સૂર્યની ઊર્જા અમારાં સુધી પહોંચી શકે છે।",
        difficulty: "hard",
        points: 25,
      },
      {
        id: 12,
        question:
          "સોલાર કુકર વિશે આવેલા આ નિવેદનોને યોગ્ય ક્રમમાં મૂકો (શરૂઆતથી અંત સુધી):",
        type: "sequence",
        options: [
          "સૂર્યપ્રકાશ વિકિરણ સ્વરૂપે અવકાશમાંથી પૃથ્વી સુધી પહોંચે છે",
          "આઈના / પ્રતિબિંબ દર્પણો સૂર્યપ્રકાશને પરાવર્તિત અને એકત્રિત કરે છે",
          "એકત્રિત થયેલ વિકિરણથી રસોઈનું વાસણ ગરમ થાય છે",
          "વાસણમાં રહેલું ખોરાક તૈયાર થઈ જાય છે",
          "આ બધું ઉષ્મા સ્થાનાંતરણ માટે કોઈ માધ્યમ વગર થાય છે!",
        ],
        correctAnswer: [
          "સૂર્યપ્રકાશ વિકિરણ સ્વરૂપે અવકાશમાંથી પૃથ્વી સુધી પહોંચે છે",
          "આઈના / પ્રતિબિંબ દર્પણો સૂર્યપ્રકાશને પરાવર્તિત અને એકત્રિત કરે છે",
          "એકત્રિત થયેલ વિકિરણથી રસોઈનું વાસણ ગરમ થાય છે",
          "વાસણમાં રહેલું ખોરાક તૈયાર થઈ જાય છે",
          "આ બધું ઉષ્મા સ્થાનાંતરણ માટે કોઈ માધ્યમ વગર થાય છે!",
        ],
        explanation:
          "સોલાર કુકર વિકિરણનું ઉત્તમ ઉદાહરણ છે: સૂર્યની ઊર્જા શૂન્યાવકાશમાંથી આવી, દર્પણોથી એકત્રિત થાય છે અને વાસણને ગરમ કરીને ખોરાક રાંધે છે – આ બધું ફક્ત વિકિરણ દ્વારા જ થાય છે।",
        difficulty: "hard",
        points: 25,
      },
    ],
  },
};

const RadiationPracticeMode: React.FC<RadiationPracticeModeProps> = ({
  props,
}) => {
  const { language: contextLanguage } = useLanguage();
  const language: LanguageCode = (props?.language ||
    (contextLanguage as LanguageCode) ||
    "en") as LanguageCode;
  const t: PracticeTranslations = (practiceTranslations[language] || practiceTranslations.en) as PracticeTranslations;
  const QUESTIONS: Question[] =
    t.questions.length > 0 ? t.questions : practiceTranslations.en.questions;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [matchPairs, setMatchPairs] = useState<{ [key: string]: string }>({});
  const [sequenceOrder, setSequenceOrder] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(
    new Set()
  );
  const [correctAnswers, setCorrectAnswers] = useState<Set<number>>(new Set());
  const [score, setScore] = useState(0);

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const isAnswered = answeredQuestions.has(currentQuestion.id);
  const isCorrect = correctAnswers.has(currentQuestion.id);

  const checkAnswer = () => {
    let correct = false;

    if (
      currentQuestion.type === "mcq" ||
      currentQuestion.type === "true_false"
    ) {
      correct = selectedAnswer === currentQuestion.correctAnswer;
    } else if (currentQuestion.type === "match") {
      const correctMatch = currentQuestion.correctAnswer as {
        [key: string]: string;
      };
      correct = Object.keys(correctMatch).every(
        (key) => matchPairs[key] === correctMatch[key]
      );
    } else if (currentQuestion.type === "sequence") {
      const correctSeq = currentQuestion.correctAnswer as string[];
      correct =
        sequenceOrder.length === correctSeq.length &&
        sequenceOrder.every((item, index) => item === correctSeq[index]);
    }

    if (correct && !answeredQuestions.has(currentQuestion.id)) {
      setScore(score + currentQuestion.points);
      setCorrectAnswers(new Set([...correctAnswers, currentQuestion.id]));
    }

    setAnsweredQuestions(new Set([...answeredQuestions, currentQuestion.id]));
    setShowFeedback(true);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      resetQuestion();
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      resetQuestion();
    }
  };

  const resetQuestion = () => {
    setSelectedAnswer("");
    setMatchPairs({});
    setSequenceOrder([]);
    setShowFeedback(false);
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnsweredQuestions(new Set());
    setCorrectAnswers(new Set());
    setScore(0);
    resetQuestion();
  };

  const moveSequenceItem = (index: number, direction: "up" | "down") => {
    const newOrder = [...sequenceOrder];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex >= 0 && targetIndex < newOrder.length) {
      [newOrder[index], newOrder[targetIndex]] = [
        newOrder[targetIndex],
        newOrder[index],
      ];
      setSequenceOrder(newOrder);
    }
  };

  const totalPoints = QUESTIONS.reduce((sum, q) => sum + q.points, 0);
  const percentage =
    totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;
  const allQuestionsAnswered = answeredQuestions.size === QUESTIONS.length;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 border-green-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "hard":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getDifficultyLabel = (difficulty: "easy" | "medium" | "hard") => {
    if (t.difficultyLabels) {
      return t.difficultyLabels[difficulty];
    }
    return difficulty.toUpperCase();
  };

  const getGrade = () => {
    if (percentage >= 80)
      return { grade: "A", message: t.gradeExcellent, color: "text-green-600" };
    if (percentage >= 60)
      return { grade: "B", message: t.gradeGood, color: "text-blue-600" };
    return {
      grade: "C",
      message: t.gradeKeepPracticing,
      color: "text-orange-600",
    };
  };

  React.useEffect(() => {
    if (
      currentQuestion.type === "sequence" &&
      sequenceOrder.length === 0 &&
      currentQuestion.options
    ) {
      setSequenceOrder([...currentQuestion.options]);
    }
  }, [currentQuestion, sequenceOrder.length]);

  return (
    <div
      className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden"
      style={{ fontFamily: getFontFamilyForLanguage(language) }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8" />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">{t.headerTitle}</h1>
              <p className="text-orange-100 text-xs sm:text-sm">
                {t.headerSubtitle}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl sm:text-3xl font-bold">{score}</div>
            <div className="text-xs sm:text-sm text-orange-100">
              {t.pointsLabel}
            </div>
          </div>
        </div>

        <div className="bg-white bg-opacity-20 rounded-full h-2 sm:h-3 overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{
              width: `${(answeredQuestions.size / QUESTIONS.length) * 100}%`,
            }}
          />
        </div>
        <div className="text-xs sm:text-sm text-orange-100 mt-2 text-center sm:text-left">
          {t.progressLabel(answeredQuestions.size, QUESTIONS.length)}
        </div>
      </div>

      {/* Question Content */}
      <div className="p-4 sm:p-6 md:p-8">
        {!allQuestionsAnswered ? (
          <>
            <div className="mb-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <span className="text-xl sm:text-2xl font-bold text-orange-600">
                    {t.questionLabel(currentQuestion.id)}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(
                      currentQuestion.difficulty
                    )}`}
                  >
                    {getDifficultyLabel(currentQuestion.difficulty)}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-300">
                    {currentQuestion.points} {t.pointsLabel}
                  </span>
                </div>
              </div>

              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-6">
                {currentQuestion.question}
              </h2>

              {/* MCQ and True/False */}
              {(currentQuestion.type === "mcq" ||
                currentQuestion.type === "true_false") && (
                <div className="space-y-3">
                  {currentQuestion.options?.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => !isAnswered && setSelectedAnswer(option)}
                      disabled={isAnswered}
                      className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                        selectedAnswer === option
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-orange-300 hover:bg-orange-50"
                      } ${
                        isAnswered
                          ? "cursor-not-allowed opacity-75"
                          : "cursor-pointer"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            selectedAnswer === option
                              ? "border-orange-500 bg-orange-500"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedAnswer === option && (
                            <div className="w-3 h-3 bg-white rounded-full" />
                          )}
                        </div>
                        <span className="font-medium text-gray-700">
                          {option}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Match */}
              {currentQuestion.type === "match" && (
                <div className="space-y-4">
                  {currentQuestion.options?.map((pair, index) => {
                    const [left] = pair.split("|");
                    return (
                      <div key={index} className="flex items-center gap-4">
                        <div className="flex-1 p-3 bg-orange-50 rounded-lg border border-orange-200 font-medium text-gray-700">
                          {left}
                        </div>
                        <div className="text-orange-500 font-bold">→</div>
                        <select
                          value={matchPairs[left] || ""}
                          onChange={(e) =>
                            setMatchPairs({
                              ...matchPairs,
                              [left]: e.target.value,
                            })
                          }
                          disabled={isAnswered}
                          className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none disabled:opacity-75 disabled:cursor-not-allowed"
                        >
                          <option value="">{t.selectAnswerPlaceholder}</option>
                          {currentQuestion.options?.map((p, i) => (
                            <option key={i} value={p.split("|")[1]}>
                              {p.split("|")[1]}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Sequence */}
              {currentQuestion.type === "sequence" && (
                <div className="space-y-3">
                  <div className="text-sm text-gray-600 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <AlertCircle className="inline w-4 h-4 mr-2" />
                    {t.arrangeSequenceHint}
                  </div>
                  {sequenceOrder.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200"
                    >
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => moveSequenceItem(index, "up")}
                          disabled={index === 0 || isAnswered}
                          className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => moveSequenceItem(index, "down")}
                          disabled={
                            index === sequenceOrder.length - 1 || isAnswered
                          }
                          className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          ▼
                        </button>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1 font-medium text-gray-700">
                        {item}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Feedback */}
            {showFeedback && (
              <div
                className={`mb-6 p-6 rounded-xl border-2 ${
                  isCorrect
                    ? "bg-green-50 border-green-500"
                    : "bg-red-50 border-red-500"
                }`}
              >
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  )}
                  <div>
                    <div
                      className={`font-bold text-lg mb-2 ${
                        isCorrect ? "text-green-800" : "text-red-800"
                      }`}
                    >
                      {isCorrect ? t.correctFeedback : t.incorrectFeedback}
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-200">
              <button
                onClick={prevQuestion}
                disabled={currentQuestionIndex === 0}
                className="flex items-center justify-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition text-sm sm:text-base"
              >
                <ChevronLeft className="w-5 h-5" />
                {t.previous}
              </button>

              {!showFeedback ? (
                <button
                  onClick={checkAnswer}
                  disabled={
                    ((currentQuestion.type === "mcq" ||
                      currentQuestion.type === "true_false") &&
                      !selectedAnswer) ||
                    (currentQuestion.type === "match" &&
                      Object.keys(matchPairs).length <
                        (currentQuestion.options?.length || 0)) ||
                    isAnswered
                  }
                  className="px-6 py-2 sm:px-8 sm:py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-orange-700 hover:to-red-700 transition text-sm sm:text-base"
                >
                  {t.submitAnswer}
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  disabled={currentQuestionIndex === QUESTIONS.length - 1}
                  className="flex items-center justify-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-orange-700 hover:to-red-700 transition text-sm sm:text-base"
                >
                  {t.next}
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </>
        ) : (
          /* Final Summary */
          <div className="text-center py-8">
            <div className="mb-6">
              <Award className="w-24 h-24 mx-auto text-orange-500 mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {t.finalTitle}
              </h2>
              <p className="text-gray-600">{t.finalSubtitle}</p>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 mb-8 border-2 border-orange-200">
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div>
                  <div className="text-4xl font-bold text-orange-600">
                    {score}
                  </div>
                  <div className="text-sm text-gray-600">{t.totalPoints}</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-blue-600">
                    {percentage}%
                  </div>
                  <div className="text-sm text-gray-600">{t.scoreLabel}</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-green-600">
                    {correctAnswers.size}/{QUESTIONS.length}
                  </div>
                  <div className="text-sm text-gray-600">{t.correctLabel}</div>
                </div>
              </div>

              <div className={`text-2xl font-bold ${getGrade().color}`}>
                {t.gradeLabel}: {getGrade().grade} - {getGrade().message}
              </div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-lg text-blue-900 mb-3">
                {t.keyRemindersTitle}
              </h3>
              <ul className="text-left text-gray-700 space-y-2">
                {t.keyReminders.map((reminder: string, index: number) => (
                  <li key={index}>✓ {reminder}</li>
                ))}
              </ul>
            </div>

            <button
              onClick={restartQuiz}
              className="flex items-center gap-2 px-8 py-4 mx-auto bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-bold text-lg hover:from-orange-700 hover:to-red-700 transition shadow-lg"
            >
              <RotateCcw className="w-5 h-5" />
              {t.restartQuiz}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Export as named export
export { RadiationPracticeMode };

// Default export for main component
export default RadiationLearning;


/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Core Data Structures for Circuit Educational Tool
 */
export type Mode = 'demonstration' | 'practice' | 'assessment' | 'mixed';
export type StepType = 'explanation' | 'visualization' | 'interaction' | 'assessment';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

// Circuit component types
export interface CircuitComponent {
  id: string;
  type: 'cell' | 'battery' | 'lamp' | 'led' | 'switch' | 'wire' | 'conductor' | 'insulator';
  position: { x: number; y: number };
  connections: string[]; // IDs of connected components
  state?: 'on' | 'off' | 'open' | 'closed';
  polarity?: 'correct' | 'incorrect' | 'neutral';
}

// Step definition for demonstrations
export interface DemonstrationStep {
  step_number: number;
  title: string;
  description: string;
  type: StepType;
  visual_state: {
    components: CircuitComponent[];
    circuit_complete: boolean;
    current_flowing: boolean;
  };
  interactions?: {
    type: 'click' | 'drag' | 'input' | 'select';
    target: string;
    expectedValue?: any;
    hint?: string;
  }[];
  completion_criteria?: {
    type: 'automatic' | 'user_confirm' | 'assessment';
    condition?: any;
  };
  learning_notes?: string;
  common_mistakes?: string[];
}

// Practice exercise definition
export interface PracticeExercise {
  exercise_id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  problem_data: {
    circuit_setup: CircuitComponent[];
    question_type: 'build_circuit' | 'identify_component' | 'test_conductor' | 'troubleshoot';
    correct_solution: any;
  };
  solution: {
    correct_answer: any;
    solution_steps?: any[];
    multiple_solutions?: boolean;
  };
  interaction_config: {
    input_methods: string[];
    max_attempts?: number;
    hint_system?: boolean;
    progressive_hints?: string[];
  };
  assessment: {
    accuracy_weight: number;
    time_weight?: number;
    attempt_weight?: number;
  };
}

// Tool data from backend
export interface CircuitToolData {
  tool_type: string;
  session_id: string;
  mode: Mode;
  demonstration?: {
    steps: DemonstrationStep[];
    auto_progression: boolean;
    step_duration: number;
  };
  practice?: {
    exercises: PracticeExercise[];
    session_config: {
      max_exercises: number;
      difficulty_adaptation: boolean;
      immediate_feedback: boolean;
    };
  };
  student_context: {
    current_level: string;
    learning_preferences: string[];
    previous_performance?: {
      accuracy: number;
      avg_time: number;
      completed_exercises: number;
    };
  };
  metadata: {
    learning_objectives: string[];
    estimated_duration: number;
    prerequisite_skills: string[];
    difficulty_level: string;
  };
}

// UI Configuration
export interface CircuitUIConfig {
  theme: 'light' | 'dark' | 'modern' | 'playful';
  layout: 'standard' | 'compact' | 'immersive';
  auto_play: boolean;
  step_duration: number;
  show_controls: boolean;
  show_progress: boolean;
  hint_system: boolean;
  progressive_difficulty: boolean;
  immediate_feedback: boolean;
  celebration_animations: boolean;
  high_contrast: boolean;
  large_text: boolean;
  keyboard_navigation: boolean;
  screen_reader_support: boolean;
}

// Component props interface
export interface CircuitToolProps {
  data: CircuitToolData;
  title: string;
  ui_config: CircuitUIConfig;
  onStepChange?: (stepIndex: number, stepData: DemonstrationStep) => void;
  onPracticeComplete?: (results: PracticeResults) => void;
  onAssessmentSubmit?: (assessment: AssessmentData) => void;
  onProgress?: (progress: ProgressData) => void;
  onInterrupt?: () => void;
  onResume?: () => void;
  onReset?: () => void;
  currentStep?: number;
  isInterrupted?: boolean;
}

// Practice results tracking
export interface PracticeResults {
  exercise_id: string;
  student_answer: any;
  correct_answer: any;
  is_correct: boolean;
  attempts: number;
  time_taken: number;
  hints_used: number;
  confidence_level?: number;
  feedback: string;
}

// Assessment data
export interface AssessmentData {
  overall_score: number;
  accuracy: number;
  speed_score: number;
  understanding_indicators: {
    concept: string;
    mastery_level: number;
  }[];
  recommendations: string[];
}

// Progress tracking
export interface ProgressData {
  current_step: number;
  total_steps: number;
  completion_percentage: number;
  time_spent: number;
  exercises_completed: number;
  current_difficulty: string;
  mastery_indicators: {
    skill: string;
    level: number;
  }[];
}

