import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
  useRef,
} from "react";
import type { ReactNode } from "react";
import { Globe } from "lucide-react";

// Simple i18n stub to replace react-i18next
const i18n = {
  language: "en",
  on: (_event: string, _handler: (lang: string) => void) => {
    // Stub implementation
  },
  off: (_event: string, _handler: (lang: string) => void) => {
    // Stub implementation
  },
  changeLanguage: (_lang: string) => {
    // Stub implementation
  },
};

// Simple useTranslation stub
const useTranslation = () => {
  return {
    t: (key: string, _options?: Record<string, unknown>): string => {
      return key;
    },
  };
};

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
if (typeof window !== "undefined") {
  // Override console.error to filter out Chrome extension errors
  const originalError = console.error;
  console.error = (...args: any[]) => {
    const errorMessage = args[0]?.toString() || "";
    // Filter out Chrome extension runtime.lastError messages and resource loading errors
    if (
      errorMessage.includes("runtime.lastError") ||
      errorMessage.includes("message port closed") ||
      errorMessage.includes("Unchecked runtime.lastError") ||
      errorMessage.includes("The message port closed") ||
      errorMessage.includes("chrome-extension://") ||
      errorMessage.includes("ERR_FILE_NOT_FOUND") ||
      errorMessage.includes("locales/") ||
      errorMessage.includes("Failed to load resource")
    ) {
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

    // Wrap sendMessage to handle errors gracefully
    const originalSendMessage = window.chrome.runtime.sendMessage;
    if (originalSendMessage) {
      window.chrome.runtime.sendMessage = function (...args: any[]) {
        try {
          return originalSendMessage.apply(this, args);
        } catch (error) {
          // Silently handle Chrome extension message errors
          if (error && typeof error === "object" && "message" in error) {
            const errorMsg = String(error.message || "");
            if (
              errorMsg.includes("message port closed") ||
              errorMsg.includes("runtime.lastError")
            ) {
              return; // Suppress these errors
            }
          }
          throw error;
        }
      };
    }
  }

  // Add global error handler to catch Chrome extension errors
  const originalOnError = window.onerror;
  window.onerror = function (message, source, lineno, colno, error) {
    const errorMessage = String(message || "");
    const sourceStr = String(source || "");
    // Suppress Chrome extension errors
    if (
      errorMessage.includes("runtime.lastError") ||
      errorMessage.includes("message port closed") ||
      errorMessage.includes("Unchecked runtime.lastError") ||
      errorMessage.includes("ERR_FILE_NOT_FOUND") ||
      sourceStr.includes("chrome-extension://") ||
      sourceStr.includes("locales/")
    ) {
      return true; // Suppress the error
    }
    // Call original error handler for other errors
    if (originalOnError) {
      return originalOnError.call(this, message, source, lineno, colno, error);
    }
    return false;
  };

  // Also handle unhandled promise rejections
  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    if (reason && typeof reason === "object" && "message" in reason) {
      const errorMsg = String(reason.message || "");
      if (
        errorMsg.includes("runtime.lastError") ||
        errorMsg.includes("message port closed") ||
        errorMsg.includes("Unchecked runtime.lastError") ||
        errorMsg.includes("ERR_FILE_NOT_FOUND") ||
        errorMsg.includes("chrome-extension://") ||
        errorMsg.includes("locales/") ||
        errorMsg.includes("The message port closed")
      ) {
        event.preventDefault(); // Suppress the error
        return;
      }
    }
    // Also check error string representation
    const errorStr = String(reason || "");
    if (
      errorStr.includes("runtime.lastError") ||
      errorStr.includes("message port closed") ||
      errorStr.includes("Unchecked runtime.lastError")
    ) {
      event.preventDefault();
    }
  });

  // Suppress console warnings for Chrome extension errors
  const originalWarn = console.warn;
  console.warn = (...args: any[]) => {
    const warningMessage = args[0]?.toString() || "";
    if (
      warningMessage.includes("runtime.lastError") ||
      warningMessage.includes("message port closed") ||
      warningMessage.includes("Unchecked runtime.lastError") ||
      warningMessage.includes("chrome-extension://") ||
      warningMessage.includes("ERR_FILE_NOT_FOUND") ||
      warningMessage.includes("locales/") ||
      warningMessage.includes("Failed to load resource")
    ) {
      return; // Suppress these warnings
    }
    originalWarn.apply(console, args);
  };

  // Add error event listener to catch resource loading errors from Chrome extensions
  window.addEventListener("error", (event) => {
    const target = event.target as HTMLElement | null;
    const source = event.filename || (target as any)?.src || "";
    const errorMessage = event.message || "";

    // Suppress Chrome extension resource loading errors
    if (
      String(source).includes("chrome-extension://") ||
      String(source).includes("locales/") ||
      errorMessage.includes("ERR_FILE_NOT_FOUND") ||
      errorMessage.includes("Failed to load resource")
    ) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  }, true); // Use capture phase to catch errors early
}

// ============================================================================
// Type Definitions
// ============================================================================
export type Language = "en" | "hi" | "gu";
export type LanguageCode = Language; // Alias for compatibility

export interface LanguageSelector {
  en: string;
  hi: string;
  gu: string;
  selectorLabel: string;
}

export interface NavTranslations {
  logo: string;
  tabs: {
    learn: string;
    practice: string;
    applications: string;
  };
}

export interface BaseTranslations {
  language: LanguageSelector;
  nav: NavTranslations;
  learn: {
    header: string;
    subtitle: string;
    modes: {
      explore: { title: string; description: string; icon: string };
      daynight: { title: string; description: string; icon: string };
      timezones: { title: string; description: string; icon: string };
      seasons: { title: string; description: string; icon: string };
      effects: { title: string; description: string; icon: string };
    };
    labels: {
      sun: string;
      northPole: string;
      southPole: string;
      west: string;
      east: string;
      axisTilt: string;
      day: string;
      night: string;
      facingSun: string;
      awayFromSun: string;
    };
    controls: {
      title: string;
      pause: string;
      play: string;
      rotationSpeed: string;
    };
    keyFacts: {
      title: string;
      rotationPeriod: string;
      equatorialSpeed: string;
      axisTilt: string;
      timeZones: string;
    };
    effects: {
      title: string;
      coriolisEffect: string;
      coriolisDesc: string;
      equatorialBulge: string;
      bulgeDesc: string;
      tidalForces: string;
      tidalDesc: string;
      starTrails: string;
      starDesc: string;
    };
    location: {
      localTime: string;
      timezone: string;
      utcOffset: string;
      status: string;
      daytime: string;
      nighttime: string;
    };
  };
  practice: {
    question: string;
    of: string;
    score: string;
    submitAnswer: string;
    nextQuestion: string;
    viewResults: string;
    explanation: string;
    quizCompleted: string;
    yourScore: string;
    perfect: string;
    excellent: string;
    goodJob: string;
    keepPracticing: string;
    tryAgain: string;
    questions: Array<{
      question: string;
      options: string[];
      explanation: string;
    }>;
  };
  realWorld: {
    title: string;
    subtitle: string;
    overview: string;
    keyFeatures: string;
    impact: string;
    location: string;
    realWorldImpact: string;
    connection: string;
    examples: Array<{
      title: string;
      location: string;
      description: string;
      category: string;
      impact: string;
      keyFeatures: string[];
      connection: string;
    }>;
  };
}

// Basic translations data
const translationsData: { [key: string]: BaseTranslations } = {
  en: {
    language: {
      en: "English",
      hi: "Hindi",
      gu: "Gujarati",
      selectorLabel: "Choose language",
    },
    nav: {
      logo: "Rotation of the Earth",
      tabs: {
        learn: "Learn",
        practice: "Practice",
        applications: "Real World",
      },
    },
    learn: {
      header: 'Rotation of the Earth',
      subtitle: 'Interactive Science Learning Experience',
      modes: {
        explore: { title: 'Explore Earth\'s Rotation', description: 'Earth rotates on its axis once every 24 hours, spinning from west to east at about 1,670 km/h at the equator. This rotation is what gives us our day and night cycle.', icon: '🔭' },
        daynight: { title: 'Day & Night Cycle', description: 'As Earth rotates, different parts face the Sun creating day, while the opposite side experiences night. The boundary between day and night is called the terminator.', icon: '🌓' },
        timezones: { title: 'Time Zones', description: 'Earth is divided into 24 time zones. Each zone represents 15° of longitude, or 1 hour of time difference. Click on any city marker to see its local time!', icon: '🕐' },
        seasons: { title: 'Axis Tilt & Seasons', description: 'Earth\'s axis is tilted 23.5° from vertical. This tilt, combined with Earth\'s orbit around the Sun, creates the four seasons we experience throughout the year.', icon: '🍂' },
        effects: { title: 'Effects of Rotation', description: 'Earth\'s rotation causes many phenomena including the Coriolis effect which deflects winds and ocean currents, the bulging of Earth at the equator, and the apparent motion of stars.', icon: '🌀' }
      },
      labels: { sun: 'Sun', northPole: 'North Pole', southPole: 'South Pole', west: 'West', east: 'East', axisTilt: 'Axis Tilt', day: 'DAY', night: 'NIGHT', facingSun: 'Facing the Sun', awayFromSun: 'Away from Sun' },
      controls: { title: 'Controls', pause: 'Pause', play: 'Play', rotationSpeed: 'Rotation Speed' },
      keyFacts: { title: 'Key Facts', rotationPeriod: 'Rotation Period', equatorialSpeed: 'Equatorial Speed', axisTilt: 'Axis Tilt', timeZones: 'Time Zones' },
      effects: { title: 'Effects of Earth\'s Rotation', coriolisEffect: 'Coriolis Effect', coriolisDesc: 'Deflects winds and ocean currents, creating weather patterns', equatorialBulge: 'Equatorial Bulge', bulgeDesc: 'Earth is 43 km wider at equator due to centrifugal force', tidalForces: 'Tidal Forces', tidalDesc: 'Combined with Moon\'s gravity, creates ocean tides', starTrails: 'Star Trails', starDesc: 'Stars appear to move in circles around celestial poles' },
      location: { localTime: 'Local Time', timezone: 'Timezone', utcOffset: 'UTC Offset', status: 'Status', daytime: 'Daytime', nighttime: 'Nighttime' }
    },
    practice: {
      question: "Question",
      of: "of",
      score: "Score",
      submitAnswer: "Submit Answer",
      nextQuestion: "Next Question",
      viewResults: "View Results",
      explanation: "Explanation",
      quizCompleted: "Quiz Completed!",
      yourScore: "Your Score",
      perfect: "Perfect! You're a Rotation expert!",
      excellent: "Excellent work! You understand Earth's rotation well!",
      goodJob: "Good job! Keep learning about Earth's rotation!",
      keepPracticing: "Keep practicing! Review the rotation concepts.",
      tryAgain: "Try Again",
      questions: [],
    },
    realWorld: {
      title: "Real World: Earth's Rotation",
      subtitle:
        "Discover how Earth's spin affects our everyday world",
      overview: "Overview",
      keyFeatures: "Key Features",
      impact: "Impact",
      location: "Location",
      realWorldImpact: "Real-World Impact",
      connection: "Connection to Earth's Rotation",
      examples: [],
    },
  },
  hi: {
    language: {
      en: "English",
      hi: "हिंदी",
      gu: "ગુજરાતી",
      selectorLabel: "भाषा चुनें",
    },
    nav: {
      logo: "पृथ्वी का घूर्णन",
      tabs: {
        learn: "सीखें",
        practice: "अभ्यास",
        applications: "वास्तविक दुनिया",
      },
    },
    learn: {
      header: 'पृथ्वी का घूर्णन',
      subtitle: 'इंटरैक्टिव विज्ञान सीखने का अनुभव',
      modes: {
        explore: { title: 'पृथ्वी के घूर्णन का अन्वेषण', description: 'पृथ्वी अपनी धुरी पर हर 24 घंटे में एक बार घूमती है, भूमध्य रेखा पर लगभग 1,670 किमी/घंटा की गति से पश्चिम से पूर्व की ओर घूमती है। यह घूर्णन ही हमें दिन और रात का चक्र देता है।', icon: '🔭' },
        daynight: { title: 'दिन और रात का चक्र', description: 'जैसे-जैसे पृथ्वी घूमती है, विभिन्न भाग सूर्य की ओर होते हैं जिससे दिन बनता है, जबकि विपरीत पक्ष रात का अनुभव करता है। दिन और रात के बीच की सीमा को टर्मिनेटर कहा जाता है।', icon: '🌓' },
        timezones: { title: 'समय क्षेत्र', description: 'पृथ्वी को 24 समय क्षेत्रों में विभाजित किया गया है। प्रत्येक क्षेत्र 15° देशांतर या 1 घंटे के समय अंतर का प्रतिनिधित्व करता है। किसी भी शहर के मार्कर पर क्लिक करें और उसका स्थानीय समय देखें!', icon: '🕐' },
        seasons: { title: 'अक्ष झुकाव और ऋतुएं', description: 'पृथ्वी की धुरी ऊर्ध्वाधर से 23.5° झुकी हुई है। यह झुकाव, सूर्य के चारों ओर पृथ्वी की कक्षा के साथ मिलकर, चार ऋतुओं का निर्माण करता है जिन्हें हम पूरे वर्ष अनुभव करते हैं।', icon: '🍂' },
        effects: { title: 'घूर्णन के प्रभाव', description: 'पृथ्वी का घूर्णन कई घटनाओं का कारण बनता है जिसमें कोरिओलिस प्रभाव शामिल है जो हवाओं और समुद्री धाराओं को विक्षेपित करता है, भूमध्य रेखा पर पृथ्वी का उभार, और तारों की स्पष्ट गति।', icon: '🌀' }
      },
      labels: { sun: 'सूर्य', northPole: 'उत्तरी ध्रुव', southPole: 'दक्षिणी ध्रुव', west: 'पश्चिम', east: 'पूर्व', axisTilt: 'अक्ष झुकाव', day: 'दिन', night: 'रात', facingSun: 'सूर्य की ओर', awayFromSun: 'सूर्य से दूर' },
      controls: { title: 'नियंत्रण', pause: 'रोकें', play: 'चलाएं', rotationSpeed: 'घूर्णन गति' },
      keyFacts: { title: 'मुख्य तथ्य', rotationPeriod: 'घूर्णन अवधि', equatorialSpeed: 'भूमध्यरेखीय गति', axisTilt: 'अक्ष झुकाव', timeZones: 'समय क्षेत्र' },
      effects: { title: 'पृथ्वी के घूर्णन के प्रभाव', coriolisEffect: 'कोरिओलिस प्रभाव', coriolisDesc: 'हवाओं और समुद्री धाराओं को विक्षेपित करता है, मौसम के पैटर्न बनाता है', equatorialBulge: 'भूमध्यरेखीय उभार', bulgeDesc: 'अपकेंद्रीय बल के कारण पृथ्वी भूमध्य रेखा पर 43 किमी चौड़ी है', tidalForces: 'ज्वारीय बल', tidalDesc: 'चंद्रमा के गुरुत्वाकर्षण के साथ मिलकर, समुद्री ज्वार बनाता है', starTrails: 'तारा पथ', starDesc: 'तारे आकाशीय ध्रुवों के चारों ओर वृत्तों में घूमते हुए दिखाई देते हैं' },
      location: { localTime: 'स्थानीय समय', timezone: 'समय क्षेत्र', utcOffset: 'UTC ऑफसेट', status: 'स्थिति', daytime: 'दिन का समय', nighttime: 'रात का समय' }
    },
    practice: {
      question: "प्रश्न",
      of: "का",
      score: "स्कोर",
      submitAnswer: "उत्तर जमा करें",
      nextQuestion: "अगला प्रश्न",
      viewResults: "परिणाम देखें",
      explanation: "व्याख्या",
      quizCompleted: "क्विज़ पूर्ण!",
      yourScore: "आपका स्कोर",
      perfect: "बिल्कुल सही! आप पृथ्वी के घूर्णन के विशेषज्ञ हैं!",
      excellent: "उत्कृष्ट कार्य! आप पृथ्वी के घूर्णन को अच्छी तरह समझते हैं!",
      goodJob: "अच्छा काम! पृथ्वी के घूर्णन के बारे में सीखना जारी रखें!",
      keepPracticing: "अभ्यास जारी रखें! घूर्णन की अवधारणाओं की समीक्षा करें।",
      tryAgain: "फिर से कोशिश करें",
      questions: [],
    },
    realWorld: {
      title: "वास्तविक दुनिया: पृथ्वी का घूर्णन",
      subtitle:
        "खोजें कि पृथ्वी का घूर्णन हमारे दैनिक जीवन को कैसे प्रभावित करता है",
      overview: "अवलोकन",
      keyFeatures: "मुख्य विशेषताएं",
      impact: "प्रभाव",
      location: "स्थान",
      realWorldImpact: "वास्तविक दुनिया का प्रभाव",
      connection: "पृथ्वी के घूर्णन से संबंध",
      examples: [],
    },
  },
  gu: {
    language: {
      en: "English",
      hi: "હિન્દી",
      gu: "ગુજરાતી",
      selectorLabel: "ભાષા પસંદ કરો",
    },
    nav: {
      logo: "પૃથ્વીનું પરિભ્રમણ",
      tabs: {
        learn: "શીખો",
        practice: "પ્રેક્ટિસ",
        applications: "વાસ્તવિક વિશ્વ",
      },
    },
    learn: {
      header: 'પૃથ્વીનું પરિભ્રમણ',
      subtitle: 'ઇન્ટરેક્ટિવ વિજ્ઞાન શીખવાનો અનુભવ',
      modes: {
        explore: { title: 'પૃથ્વીના પરિભ્રમણની શોધ', description: 'પૃથ્વી તેની ધરી પર દર 24 કલાકમાં એક વખત ફરે છે, વિષુવવૃત્ત પર લગભગ 1,670 કિમી/કલાકની ઝડપે પશ્ચિમથી પૂર્વ તરફ ફરે છે. આ પરિભ્રમણ જ આપણને દિવસ અને રાત્રિનું ચક્ર આપે છે।', icon: '🔭' },
        daynight: { title: 'દિવસ અને રાત્રિનું ચક્ર', description: 'જેમ જેમ પૃથ્વી ફરે છે, વિવિધ ભાગો સૂર્ય તરફ હોય છે જે દિવસ બનાવે છે, જ્યારે વિરુદ્ધ બાજુ રાત્રિનો અનુભવ કરે છે. દિવસ અને રાત્રિ વચ્ચેની સીમાને ટર્મિનેટર કહેવામાં આવે છે।', icon: '🌓' },
        timezones: { title: 'સમય ઝોન', description: 'પૃથ્વીને 24 સમય ઝોનમાં વિભાજિત કરવામાં આવી છે. દરેક ઝોન 15° રેખાંશ અથવા 1 કલાકના સમયના તફાવતનું પ્રતિનિધિત્વ કરે છે. કોઈપણ શહેરના માર્કર પર ક્લિક કરો અને તેનો સ્થાનિક સમય જુઓ!', icon: '🕐' },
        seasons: { title: 'અક્ષ નમણ અને ઋતુઓ', description: 'પૃથ્વીની ધરી ઊભીથી 23.5° નમેલી છે. આ નમણ, સૂર્યની આસપાસ પૃથ્વીની કક્ષા સાથે મળીને, ચાર ઋતુઓનું નિર્માણ કરે છે જે આપણે આખા વર્ષ દરમિયાન અનુભવીએ છીએ।', icon: '🍂' },
        effects: { title: 'પરિભ્રમણની અસરો', description: 'પૃથ્વીનું પરિભ્રમણ ઘણી ઘટનાઓનું કારણ બને છે જેમાં કોરિઓલિસ અસર સામેલ છે જે પવન અને સમુદ્રી પ્રવાહોને વિચલિત કરે છે, વિષુવવૃત્ત પર પૃથ્વીનો ઉભાર, અને તારાઓની સ્પષ્ટ ગતિ।', icon: '🌀' }
      },
      labels: { sun: 'સૂર્ય', northPole: 'ઉત્તર ધ્રુવ', southPole: 'દક્ષિણ ધ્રુવ', west: 'પશ્ચિમ', east: 'પૂર્વ', axisTilt: 'અક્ષ નમણ', day: 'દિવસ', night: 'રાત્રિ', facingSun: 'સૂર્ય તરફ', awayFromSun: 'સૂર્યથી દૂર' },
      controls: { title: 'નિયંત્રણો', pause: 'રોકો', play: 'ચલાવો', rotationSpeed: 'પરિભ્રમણ ઝડપ' },
      keyFacts: { title: 'મુખ્ય તથ્યો', rotationPeriod: 'પરિભ્રમણ સમયગાળો', equatorialSpeed: 'વિષુવવૃત્તીય ઝડપ', axisTilt: 'અક્ષ નમણ', timeZones: 'સમય ઝોન' },
      effects: { title: 'પૃથ્વીના પરિભ્રમણની અસરો', coriolisEffect: 'કોરિઓલિસ અસર', coriolisDesc: 'પવન અને સમુદ્રી પ્રવાહોને વિચલિત કરે છે, હવામાન પેટર્ન બનાવે છે', equatorialBulge: 'વિષુવવૃત્તીય ઉભાર', bulgeDesc: 'કેન્દ્રત્યાગી બળને કારણે પૃથ્વી વિષુવવૃત્ત પર 43 કિમી પહોળી છે', tidalForces: 'ભરતી બળો', tidalDesc: 'ચંદ્રના ગુરુત્વાકર્ષણ સાથે મળીને, સમુદ્રી ભરતી બનાવે છે', starTrails: 'તારા પથ', starDesc: 'તારાઓ આકાશીય ધ્રુવોની આસપાસ વર્તુળોમાં ફરતા દેખાય છે' },
      location: { localTime: 'સ્થાનિક સમય', timezone: 'સમય ઝોન', utcOffset: 'UTC ઓફસેટ', status: 'સ્થિતિ', daytime: 'દિવસનો સમય', nighttime: 'રાત્રિનો સમય' }
    },
    practice: {
      question: "પ્રશ્ન",
      of: "ના",
      score: "સ્કોર",
      submitAnswer: "જવાબ સબમિટ કરો",
      nextQuestion: "આગળનો પ્રશ્ન",
      viewResults: "પરિણામો જુઓ",
      explanation: "સમજૂતી",
      quizCompleted: "ક્વિઝ પૂર્ણ!",
      yourScore: "તમારો સ્કોર",
      perfect: "સંપૂર્ણ! તમે પૃથ્વીના પરિભ્રમણના નિષ્ણાત છો!",
      excellent: "ઉત્કૃષ્ટ કાર્ય! તમે પૃથ્વીના પરિભ્રમણને સારી રીતે સમજો છો!",
      goodJob: "સારું કામ! પૃથ્વીના પરિભ્રમણ વિશે શીખવાનું ચાલુ રાખો!",
      keepPracticing: "પ્રેક્ટિસ ચાલુ રાખો! પરિભ્રમણની વિભાવનાઓની સમીક્ષા કરો.",
      tryAgain: "ફરી પ્રયાસ કરો",
      questions: [],
    },
    realWorld: {
      title: "વાસ્તવિક વિશ્વ: પૃથ્વીનું પરિભ્રમણ",
      subtitle:
        "શોધો કે પૃથ્વીનું પરિભ્રમણ આપણા રોજિંદા જીવનને કેવી રીતે અસર કરે છે",
      overview: "સંખ્યાત્મક",
      keyFeatures: "મુખ્ય લક્ષણો",
      impact: "પ્રભાવ",
      location: "સ્થાન",
      realWorldImpact: "વાસ્તવિક વિશ્વનો પ્રભાવ",
      connection: "પૃથ્વીના પરિભ્રમણ સાથે જોડાણ",
      examples: [],
    },
  },
};

// Get appropriate font family based on language
export const getFontFamilyForLanguage = (lang: Language | string): string => {
  const language = lang as Language;
  switch (language) {
    case "hi":
      return '"Noto Sans Devanagari", "Noto Sans", sans-serif';
    case "gu":
      return '"Noto Sans Gujarati", "Noto Sans", sans-serif';
    case "en":
    default:
      return 'Poppins, "Noto Sans", sans-serif';
  }
};

// ============================================================================
// Language Context
// ============================================================================
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, options?: Record<string, unknown>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { t: i18nT } = useTranslation();
  // Get initial language from localStorage or default to "en"
  const getInitialLanguage = (): Language => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("i18nextLng");
        if (saved && (saved === "en" || saved === "hi" || saved === "gu")) {
          return saved as Language;
        }
      } catch (error) {
        // Ignore localStorage errors
      }
    }
    return (i18n.language?.split("-")[0] as Language) || "en";
  };
  const initialLanguage = getInitialLanguage();
  const [language, setLanguageState] = useState<Language>(initialLanguage);

  // Custom translation function that accesses translationsData directly
  const t = useCallback(
    (key: string, options?: Record<string, unknown>): string => {
      try {
        // Try to get translation from translationsData first
        const keys = key.split(".");
        let value: any = translationsData[language];

        for (const k of keys) {
          if (value && typeof value === "object" && k in value) {
            value = value[k];
          } else {
            // Fallback to i18next
            const i18nValue = i18nT(key, options);
            if (i18nValue && i18nValue !== key) {
              return i18nValue;
            }
            // If not found, return the key as fallback
            return key;
          }
        }

        // If we have a string value, return it (with interpolation if needed)
        if (typeof value === "string") {
          if (options) {
            // Simple interpolation: replace {key} with values from options
            return value.replace(/\{(\w+)\}/g, (match, key) => {
              return options[key]?.toString() || match;
            });
          }
          return value;
        }

        // Fallback to i18next
        const i18nValue = i18nT(key, options);
        if (i18nValue && i18nValue !== key) {
          return i18nValue;
        }

        // Final fallback: return the key
        return key;
      } catch (error) {
        // Fallback to i18next on error
        const i18nValue = i18nT(key, options);
        if (i18nValue && i18nValue !== key) {
          return i18nValue;
        }
        return key;
      }
    },
    [language, i18nT]
  );

  useEffect(() => {
    // Sync i18n.language with current state on mount
    i18n.language = language;

    // Suppress Chrome extension runtime.lastError warnings
    if (typeof window !== "undefined" && window.chrome?.runtime?.lastError) {
      // Silently handle extension errors
      try {
        window.chrome.runtime.lastError = undefined;
      } catch {
        // Ignore errors when clearing
      }
    }

    const handleLanguageChanged = (lng: string) => {
      const base = (lng?.split("-")[0] as Language) || "en";
      setLanguageState(base);
    };

    try {
      i18n.on("languageChanged", handleLanguageChanged);
    } catch (error) {
      // Handle i18n event listener errors
      console.warn("Failed to set up language change listener:", error);
    }

    return () => {
      try {
        i18n.off("languageChanged", handleLanguageChanged);
      } catch (error) {
        // Handle cleanup errors silently
      }
    };
  }, []);

  const handleSetLanguage = (lang: Language) => {
    // Update state directly since i18n is a stub
    setLanguageState(lang);
    i18n.language = lang;
    i18n.changeLanguage(lang);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("i18nextLng", lang);
      } catch (error) {
        // Handle localStorage errors (e.g., quota exceeded, private browsing)
        console.warn(
          "Failed to save language preference to localStorage:",
          error
        );
      }
    }
  };

  useEffect(() => {
    // Sync i18n.language with current state
    i18n.language = language;
    
    // Ensure we're in the browser and DOM is ready before accessing documentElement
    if (typeof window !== "undefined" && document && document.documentElement) {
      try {
        document.documentElement.lang = language;
      } catch (error) {
        // Silently handle any DOM access errors during SSR or before mount
        // This prevents "deferred DOM Node could not be resolved" warnings
      }
    }
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleSetLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};

// ============================================================================
// Language Selector Component
// ============================================================================
const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: "en", name: t("language.en"), flag: "🇬🇧" },
    { code: "hi", name: t("language.hi"), flag: "🇮🇳" },
    { code: "gu", name: t("language.gu"), flag: "🇮🇳" },
  ];

  return (
    <div className="relative">
      <select
        aria-label={t("language.selectorLabel")}
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="appearance-none bg-white border-2 border-teal-500 rounded-lg px-1.5 sm:px-2 md:px-3 lg:px-4 py-1.5 sm:py-2 pr-5 sm:pr-6 md:pr-8 w-28 xs:w-32 sm:w-36 md:w-44 lg:w-48 xl:w-56 text-[10px] xs:text-xs sm:text-sm md:text-base text-teal-700 font-medium cursor-pointer hover:border-purple-500 active:border-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-300 touch-manipulation min-h-[36px] sm:min-h-[40px]"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 sm:px-1.5 md:px-2">
        <svg
          className="fill-current h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-teal-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};

// ============================================================================
// Navbar Component
// ============================================================================
interface NavbarProps {
  mode: "learn" | "practice" | "applications";
  setMode: (mode: "learn" | "practice" | "applications") => void;
}

const Navbar: React.FC<NavbarProps> = ({ mode, setMode }) => {
  const { t } = useLanguage();

  const isLearn = mode === "learn";
  const isPractice = mode === "practice";
  const isApplications = mode === "applications";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-teal-50 via-purple-50 to-teal-50 border-b border-teal-200/50 shadow-sm backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-18">
          <div className="flex-shrink-0 flex items-center gap-1 sm:gap-2 min-w-0">
            <Globe
              className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-teal-600 flex-shrink-0"
              aria-hidden="true"
            />
            <span className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent truncate">
              {t("nav.logo")}
            </span>
          </div>

          <div className="flex items-center space-x-0.5 sm:space-x-1 md:space-x-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => setMode("learn")}
              className={`px-1.5 py-1.5 sm:px-2.5 sm:py-2 md:px-3 md:py-2 lg:px-4 rounded-lg text-[10px] xs:text-xs sm:text-sm font-medium transition-all duration-200 touch-manipulation min-h-[36px] sm:min-h-[40px] ${isLearn
                ? "bg-teal-500 text-white shadow-md"
                : "text-teal-700 hover:bg-teal-100/50 active:bg-teal-200/50"
                }`}
            >
              <span className="hidden xs:inline">📚 </span>
              <span className="xs:hidden">📚</span>
              <span className="hidden sm:inline md:hidden lg:inline ml-0.5 sm:ml-1">
                {t("nav.tabs.learn")}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMode("practice")}
              className={`px-1.5 py-1.5 sm:px-2.5 sm:py-2 md:px-3 md:py-2 lg:px-4 rounded-lg text-[10px] xs:text-xs sm:text-sm font-medium transition-all duration-200 touch-manipulation min-h-[36px] sm:min-h-[40px] ${isPractice
                ? "bg-purple-500 text-white shadow-md"
                : "text-purple-700 hover:bg-purple-100/50 active:bg-purple-200/50"
                }`}
            >
              <span className="hidden xs:inline">🎯 </span>
              <span className="xs:hidden">🎯</span>
              <span className="hidden sm:inline md:hidden lg:inline ml-0.5 sm:ml-1">
                {t("nav.tabs.practice")}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMode("applications")}
              className={`px-1.5 py-1.5 sm:px-2.5 sm:py-2 md:px-3 md:py-2 lg:px-4 rounded-lg text-[10px] xs:text-xs sm:text-sm font-medium transition-all duration-200 touch-manipulation min-h-[36px] sm:min-h-[40px] ${isApplications
                ? "bg-gradient-to-r from-teal-500 to-purple-500 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-100/50 active:bg-gray-200/50"
                }`}
            >
              <span className="hidden xs:inline">🌍 </span>
              <span className="xs:hidden">🌍</span>
              <span className="hidden lg:inline ml-0.5 sm:ml-1">
                {t("nav.tabs.applications")}
              </span>
            </button>

            <div className="ml-0.5 sm:ml-1 md:ml-2 lg:ml-4">
              <LanguageSelector />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

// ============================================================================
// Rotation Educational Component Constants and Data
// ============================================================================

// ============================================================================
// Placeholder Mode Components (with Topic Title Headers)
// ============================================================================

// Learn Mode Component
interface RotationLearnModeProps {
  props?: {
    language?: LanguageCode;
  };
}

const RotationLearnMode: React.FC<RotationLearnModeProps> = ({ props: _props }) => {
  const { language, t } = useLanguage();
  type LearningMode = 'explore' | 'daynight' | 'timezones' | 'seasons' | 'effects';

  interface Location {
    name: string;
    angle: number;
    timezone: string;
    offset: number;
  }

  const [activeMode, setActiveMode] = useState<LearningMode>('explore');
  const [isRotating, setIsRotating] = useState(true);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showLabels, setShowLabels] = useState(true);
  const animationRef = useRef<number | undefined>(undefined);

  const locations: Location[] = [
    { name: 'London', angle: 0, timezone: 'GMT', offset: 0 },
    { name: 'New York', angle: -75, timezone: 'EST', offset: -5 },
    { name: 'Tokyo', angle: 139, timezone: 'JST', offset: 9 },
    { name: 'Sydney', angle: 151, timezone: 'AEDT', offset: 11 },
    { name: 'Dubai', angle: 55, timezone: 'GST', offset: 4 },
    { name: 'Mumbai', angle: 73, timezone: 'IST', offset: 5.5 },
  ];

  useEffect(() => {
    if (isRotating) {
      const animate = () => {
        setRotationAngle(prev => (prev + 0.3 * rotationSpeed) % 360);
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRotating, rotationSpeed]);

  const getTimeAtLocation = (offset: number): string => {
    const baseHour = (rotationAngle / 15 + 12) % 24;
    const localHour = (baseHour + offset + 24) % 24;
    const hours = Math.floor(localHour);
    const minutes = Math.floor((localHour % 1) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const isDayTime = (angle: number): boolean => {
    const normalizedAngle = ((angle + rotationAngle + 180) % 360 + 360) % 360;
    return normalizedAngle > 90 && normalizedAngle < 270;
  };

  // Multilingual translations
  // learnTrans object removed - using translationsData via t()

  const modeInfo: Record<LearningMode, { title: string; description: string; icon: string }> = {
    explore: {
      title: t('learn.modes.explore.title'),
      description: t('learn.modes.explore.description'),
      icon: t('learn.modes.explore.icon')
    },
    daynight: {
      title: t('learn.modes.daynight.title'),
      description: t('learn.modes.daynight.description'),
      icon: t('learn.modes.daynight.icon')
    },
    timezones: {
      title: t('learn.modes.timezones.title'),
      description: t('learn.modes.timezones.description'),
      icon: t('learn.modes.timezones.icon')
    },
    seasons: {
      title: t('learn.modes.seasons.title'),
      description: t('learn.modes.seasons.description'),
      icon: t('learn.modes.seasons.icon')
    },
    effects: {
      title: t('learn.modes.effects.title'),
      description: t('learn.modes.effects.description'),
      icon: t('learn.modes.effects.icon')
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e8f5e9 0%, #e3f2fd 50%, #f3e5f5 100%)',
      fontFamily: getFontFamilyForLanguage(language),
      color: '#1a365d',
      padding: 'clamp(10px, 3vw, 20px)'
    }}>
      {/* Header */}
      <header style={{
        textAlign: 'center',
        marginBottom: 'clamp(16px, 4vw, 24px)',
        padding: 'clamp(12px, 3vw, 20px) 0'
      }}>
        <h1 style={{
          fontSize: 'clamp(1.5rem, 5vw, 2.8rem)',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #1565c0, #7b1fa2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(8px, 2vw, 16px)',
          flexWrap: 'wrap',
          padding: '0 10px'
        }}>
          <span style={{ fontSize: 'clamp(2rem, 6vw, 3rem)' }}>🌍</span>
          <span style={{ textAlign: 'center' }}>{t('learn.header')}</span>
        </h1>
        <p style={{
          color: '#546e7a',
          marginTop: 8,
          fontSize: 'clamp(0.85rem, 2.5vw, 1.15rem)',
          fontWeight: 400,
          padding: '0 10px'
        }}>
          {t('learn.subtitle')}
        </p>
      </header>

      {/* Mode Navigation */}
      <nav style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 'clamp(4px, 1.5vw, 8px)',
        marginBottom: 'clamp(16px, 4vw, 30px)',
        flexWrap: 'wrap',
        padding: '0 clamp(4px, 2vw, 12px)'
      }}>
        {(Object.keys(modeInfo) as LearningMode[]).map(mode => (
          <button
            key={mode}
            onClick={() => setActiveMode(mode)}
            style={{
              padding: 'clamp(10px, 2.5vw, 14px) clamp(12px, 3vw, 22px)',
              background: activeMode === mode
                ? 'linear-gradient(135deg, #1976d2, #7b1fa2)'
                : '#ffffff',
              border: activeMode === mode
                ? 'none'
                : '2px solid #e0e0e0',
              borderRadius: 30,
              color: activeMode === mode ? '#fff' : '#546e7a',
              cursor: 'pointer',
              fontSize: 'clamp(0.7rem, 2vw, 0.95rem)',
              fontWeight: activeMode === mode ? 600 : 500,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: activeMode === mode
                ? '0 6px 20px rgba(25, 118, 210, 0.35)'
                : '0 2px 8px rgba(0,0,0,0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(4px, 1vw, 8px)',
              whiteSpace: 'nowrap',
              minHeight: '44px',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent'
            }}
          >
            <span style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)', flexShrink: 0 }}>{modeInfo[mode].icon}</span>
            <span className="mode-title hidden sm:inline">{modeInfo[mode].title.split(' ').slice(0, 2).join(' ')}</span>
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="learn-main-content" style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: 'clamp(16px, 3vw, 30px)',
        maxWidth: 1400,
        margin: '0 auto',
        padding: '0 clamp(8px, 2vw, 16px)',
        width: '100%'
      }}>
        {/* Earth Visualization Area */}
        <div style={{
          background: '#ffffff',
          borderRadius: 'clamp(16px, 3vw, 24px)',
          padding: 'clamp(20px, 4vw, 40px)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          minHeight: 'clamp(400px, 60vw, 520px)'
        }}>
          {/* Visualization Container */}
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            maxWidth: 700
          }}>
            {/* Sun */}
            <div style={{
              position: 'absolute',
              right: 20,
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8
            }}>
              <div className="sun-container" style={{
                width: 'clamp(60px, 12vw, 100px)',
                height: 'clamp(60px, 12vw, 100px)',
                background: 'radial-gradient(circle, #fff9c4 0%, #ffeb3b 30%, #ffa000 70%, #ff6f00 100%)',
                borderRadius: '50%',
                boxShadow: '0 0 50px 15px rgba(255, 193, 7, 0.4), 0 0 100px 30px rgba(255, 152, 0, 0.2)',
                animation: 'sunPulse 3s ease-in-out infinite'
              }} />
              {showLabels && (
                <span style={{
                  fontSize: 'clamp(0.75rem, 2vw, 0.95rem)',
                  fontWeight: 600,
                  color: '#f57c00',
                  background: 'rgba(255, 243, 224, 0.9)',
                  padding: '4px 12px',
                  borderRadius: 12
                }}>☀️ {t('learn.labels.sun')}</span>
              )}
            </div>

            {/* Sun rays */}
            <div style={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 'clamp(150px, 30vw, 300px)',
              height: 'clamp(150px, 30vw, 300px)',
              background: 'radial-gradient(ellipse at right, rgba(255, 235, 59, 0.15) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />

            {/* Earth Container */}
            <div className="earth-container" style={{
              position: 'relative',
              width: 'clamp(200px, 40vw, 320px)',
              height: 'clamp(200px, 40vw, 320px)',
              marginRight: 'clamp(40px, 8vw, 80px)'
            }}>
              {/* Axis line */}
              <div style={{
                position: 'absolute',
                left: '50%',
                top: 'clamp(-40px, -8vw, -50px)',
                width: 'clamp(3px, 0.5vw, 4px)',
                height: 'clamp(300px, 60vw, 420px)',
                background: 'linear-gradient(to bottom, #9c27b0, rgba(156, 39, 176, 0.2) 20%, rgba(156, 39, 176, 0.2) 80%, #9c27b0)',
                transform: `translateX(-50%) rotate(${activeMode === 'seasons' ? 23.5 : 0}deg)`,
                transformOrigin: 'center center',
                borderRadius: 3,
                transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: 5
              }} />

              {/* North Pole Label */}
              {showLabels && (
                <div style={{
                  position: 'absolute',
                  top: 'clamp(-60px, -12vw, -70px)',
                  left: '50%',
                  transform: `translateX(-50%) rotate(${activeMode === 'seasons' ? 23.5 : 0}deg)`,
                  transformOrigin: 'center 230px',
                  transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                  fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
                  fontWeight: 600,
                  color: '#7b1fa2',
                  background: '#f3e5f5',
                  padding: 'clamp(3px, 0.8vw, 4px) clamp(8px, 2vw, 10px)',
                  borderRadius: 8,
                  whiteSpace: 'nowrap'
                }}>
                  🧭 {t('learn.labels.northPole')}
                </div>
              )}

              {/* South Pole Label */}
              {showLabels && (
                <div style={{
                  position: 'absolute',
                  bottom: 'clamp(-60px, -12vw, -70px)',
                  left: '50%',
                  transform: `translateX(-50%) rotate(${activeMode === 'seasons' ? 23.5 : 0}deg)`,
                  transformOrigin: 'center -110px',
                  transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                  fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
                  fontWeight: 600,
                  color: '#7b1fa2',
                  background: '#f3e5f5',
                  padding: 'clamp(3px, 0.8vw, 4px) clamp(8px, 2vw, 10px)',
                  borderRadius: 8,
                  whiteSpace: 'nowrap'
                }}>
                  🧭 {t('learn.labels.southPole')}
                </div>
              )}

              {/* West Label */}
              {showLabels && (
                <div className="direction-label" style={{
                  position: 'absolute',
                  left: activeMode === 'seasons' ? 'clamp(-100px, -15vw, -90px)' : 'clamp(-90px, -12vw, -80px)',
                  top: '50%',
                  transform: `translateY(-50%) rotate(${activeMode === 'seasons' ? 23.5 : 0}deg)`,
                  transformOrigin: activeMode === 'seasons' ? 'clamp(150px, 25vw, 170px) center' : 'center',
                  transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                  fontSize: 'clamp(0.7rem, 2vw, 0.85rem)',
                  fontWeight: 600,
                  color: '#546e7a',
                  background: '#ffffff',
                  padding: 'clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)',
                  borderRadius: 8,
                  whiteSpace: 'nowrap',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  {t('learn.labels.west')}
                </div>
              )}

              {/* East Label */}
              {showLabels && (
                <div className="direction-label" style={{
                  position: 'absolute',
                  right: activeMode === 'seasons' ? 'clamp(-100px, -15vw, -90px)' : 'clamp(-90px, -12vw, -80px)',
                  top: '50%',
                  transform: `translateY(-50%) rotate(${activeMode === 'seasons' ? 23.5 : 0}deg)`,
                  transformOrigin: activeMode === 'seasons' ? 'clamp(-150px, -25vw, -170px) center' : 'center',
                  transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                  fontSize: 'clamp(0.7rem, 2vw, 0.85rem)',
                  fontWeight: 600,
                  color: '#546e7a',
                  background: '#ffffff',
                  padding: 'clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)',
                  borderRadius: 8,
                  whiteSpace: 'nowrap',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  {t('learn.labels.east')}
                </div>
              )}

              {/* Axis tilt indicator */}
              {activeMode === 'seasons' && (
                <div style={{
                  position: 'absolute',
                  top: -30,
                  right: -80,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  animation: 'fadeIn 0.5s ease',
                  background: '#fff3e0',
                  padding: '8px 14px',
                  borderRadius: 12,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                  <span style={{ fontSize: '1.5rem' }}>📐</span>
                  <div>
                    <div style={{ fontWeight: 700, color: '#e65100', fontSize: '1.1rem' }}>23.5°</div>
                    <div style={{ fontSize: '0.75rem', color: '#bf360c' }}>{t('learn.labels.axisTilt')}</div>
                  </div>
                </div>
              )}

              {/* Earth */}
              <div style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 0 0 4px rgba(33, 150, 243, 0.2), 0 15px 50px rgba(0,0,0,0.15), inset -40px -20px 60px rgba(0, 0, 80, 0.3)',
                transform: `rotate(${activeMode === 'seasons' ? 23.5 : 0}deg)`,
                transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
              }}>
                {/* Ocean base */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, #4fc3f7 0%, #0288d1 40%, #01579b 100%)',
                  borderRadius: '50%'
                }} />

                {/* Rotating surface layer */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  transform: `rotateY(${rotationAngle}deg)`,
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.05s linear'
                }}>
                  <svg viewBox="0 0 100 100" style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%'
                  }}>
                    <defs>
                      <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#66bb6a" />
                        <stop offset="50%" stopColor="#43a047" />
                        <stop offset="100%" stopColor="#2e7d32" />
                      </linearGradient>
                      <filter id="landShadow">
                        <feDropShadow dx="1" dy="1" stdDeviation="0.5" floodColor="#1b5e20" floodOpacity="0.3" />
                      </filter>
                    </defs>

                    {/* Continents */}
                    <path
                      d="M 12 22 Q 22 17, 32 22 Q 38 32, 34 42 Q 28 48, 18 44 Q 8 38, 12 22"
                      fill="url(#landGrad)"
                      filter="url(#landShadow)"
                    />
                    <path
                      d="M 22 52 Q 30 47, 34 52 Q 38 68, 28 80 Q 20 75, 22 52"
                      fill="url(#landGrad)"
                      filter="url(#landShadow)"
                    />
                    <path
                      d="M 42 18 Q 52 15, 58 22 Q 56 32, 48 38 L 52 58 Q 48 72, 42 68 Q 38 54, 42 38 Q 36 28, 42 18"
                      fill="url(#landGrad)"
                      filter="url(#landShadow)"
                    />
                    <path
                      d="M 58 12 Q 78 10, 88 22 Q 94 38, 84 44 Q 74 50, 64 40 Q 54 30, 58 12"
                      fill="url(#landGrad)"
                      filter="url(#landShadow)"
                    />
                    <path
                      d="M 72 58 Q 86 55, 88 65 Q 84 76, 72 73 Q 66 68, 72 58"
                      fill="url(#landGrad)"
                      filter="url(#landShadow)"
                    />

                    {/* Ice caps */}
                    <ellipse cx="50" cy="6" rx="32" ry="6" fill="rgba(255, 255, 255, 0.95)" />
                    <ellipse cx="50" cy="94" rx="28" ry="6" fill="rgba(255, 255, 255, 0.95)" />

                    {/* Clouds */}
                    <ellipse cx="22" cy="32" rx="9" ry="3" fill="rgba(255, 255, 255, 0.7)" />
                    <ellipse cx="68" cy="28" rx="11" ry="4" fill="rgba(255, 255, 255, 0.6)" />
                    <ellipse cx="52" cy="52" rx="13" ry="4" fill="rgba(255, 255, 255, 0.5)" />
                  </svg>
                </div>

                {/* Night shadow */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  background: 'linear-gradient(to left, transparent 45%, rgba(10, 20, 50, 0.85) 55%, rgba(5, 10, 30, 0.95) 100%)',
                  zIndex: 3
                }} />

                {/* Atmosphere highlight */}
                <div style={{
                  position: 'absolute',
                  inset: -5,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 65% 35%, rgba(255, 255, 255, 0.25) 0%, transparent 40%)',
                  pointerEvents: 'none'
                }} />
              </div>

              {/* Location markers for timezone mode */}
              {activeMode === 'timezones' && locations.map((loc, i) => {
                const rad = (loc.angle + rotationAngle) * Math.PI / 180;
                const x = 160 + Math.sin(rad) * 130;
                const y = 160 - Math.cos(rad) * 45;
                const isDay = isDayTime(loc.angle);
                const visible = Math.cos(rad) > -0.3;

                return visible ? (
                  <div
                    key={loc.name}
                    onClick={() => setSelectedLocation(loc)}
                    style={{
                      position: 'absolute',
                      left: x,
                      top: y,
                      transform: 'translate(-50%, -50%)',
                      cursor: 'pointer',
                      zIndex: 10,
                      animation: `popIn 0.4s ease ${i * 0.08}s both`
                    }}
                  >
                    <div style={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      background: isDay
                        ? 'linear-gradient(135deg, #ffca28, #ff9800)'
                        : 'linear-gradient(135deg, #7986cb, #3f51b5)',
                      border: '3px solid white',
                      boxShadow: `0 3px 12px ${isDay ? 'rgba(255, 152, 0, 0.5)' : 'rgba(63, 81, 181, 0.5)'}`,
                      transition: 'all 0.3s ease'
                    }} />
                    {showLabels && (
                      <div style={{
                        position: 'absolute',
                        top: 24,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#fff',
                        padding: '6px 10px',
                        borderRadius: 8,
                        fontSize: '0.75rem',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 3px 12px rgba(0,0,0,0.15)',
                        border: '1px solid #e0e0e0'
                      }}>
                        <div style={{ fontWeight: 700, color: '#1a237e' }}>{loc.name}</div>
                        <div style={{
                          color: isDay ? '#e65100' : '#283593',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          justifyContent: 'center'
                        }}>
                          {isDay ? '☀️' : '🌙'} {getTimeAtLocation(loc.offset)}
                        </div>
                      </div>
                    )}
                  </div>
                ) : null;
              })}

            </div>

            {/* Day/Night labels */}
            {activeMode === 'daynight' && (
              <>
                <div style={{
                  position: 'absolute',
                  right: 'clamp(10px, 5vw, 150px)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  textAlign: 'center',
                  animation: 'fadeIn 0.5s ease',
                  background: 'linear-gradient(135deg, #fff8e1, #ffecb3)',
                  padding: 'clamp(10px, 2vw, 16px) clamp(12px, 3vw, 20px)',
                  borderRadius: 'clamp(12px, 2vw, 16px)',
                  boxShadow: '0 4px 20px rgba(255, 152, 0, 0.2)',
                  maxWidth: 'clamp(100px, 25vw, 180px)'
                }}>
                  <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', marginBottom: 4 }}>☀️</div>
                  <div style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)', fontWeight: 700, color: '#e65100' }}>{t('learn.labels.day')}</div>
                  <div style={{ fontSize: 'clamp(0.7rem, 1.8vw, 0.85rem)', color: '#f57c00', marginTop: 2 }}>{t('learn.labels.facingSun')}</div>
                </div>
                <div style={{
                  position: 'absolute',
                  left: 'clamp(10px, 3vw, 30px)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  textAlign: 'center',
                  animation: 'fadeIn 0.5s ease 0.2s both',
                  background: 'linear-gradient(135deg, #e8eaf6, #c5cae9)',
                  padding: 'clamp(10px, 2vw, 16px) clamp(12px, 3vw, 20px)',
                  borderRadius: 'clamp(12px, 2vw, 16px)',
                  boxShadow: '0 4px 20px rgba(63, 81, 181, 0.2)',
                  maxWidth: 'clamp(100px, 25vw, 180px)'
                }}>
                  <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', marginBottom: 4 }}>🌙</div>
                  <div style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)', fontWeight: 700, color: '#283593' }}>{t('learn.labels.night')}</div>
                  <div style={{ fontSize: 'clamp(0.7rem, 1.8vw, 0.85rem)', color: '#3949ab', marginTop: 2 }}>{t('learn.labels.awayFromSun')}</div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Info Panel */}
        <aside style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(16px, 3vw, 20px)'
        }}>
          {/* Mode Info Card */}
          <div style={{
            background: '#ffffff',
            borderRadius: 'clamp(16px, 3vw, 20px)',
            padding: 'clamp(16px, 3vw, 24px)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.08)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(8px, 2vw, 12px)',
              marginBottom: 'clamp(12px, 2vw, 16px)',
              flexWrap: 'wrap'
            }}>
              <span style={{
                fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                background: 'linear-gradient(135deg, #e3f2fd, #f3e5f5)',
                padding: 'clamp(8px, 2vw, 12px)',
                borderRadius: 'clamp(12px, 2vw, 16px)',
                flexShrink: 0
              }}>{modeInfo[activeMode].icon}</span>
              <h2 style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.35rem)',
                fontWeight: 700,
                color: '#1a237e',
                margin: 0,
                lineHeight: 1.3
              }}>
                {modeInfo[activeMode].title}
              </h2>
            </div>
            <p style={{
              color: '#546e7a',
              lineHeight: 1.75,
              fontSize: 'clamp(0.875rem, 2vw, 1rem)',
              margin: 0
            }}>
              {modeInfo[activeMode].description}
            </p>
          </div>

          {/* Controls Card */}
          <div style={{
            background: '#ffffff',
            borderRadius: 'clamp(16px, 3vw, 20px)',
            padding: 'clamp(16px, 3vw, 24px)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{
              fontSize: 'clamp(0.95rem, 2.2vw, 1.1rem)',
              fontWeight: 700,
              marginBottom: 'clamp(14px, 2.5vw, 18px)',
              color: '#1a237e',
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(6px, 1.5vw, 8px)'
            }}>
              <span>🎮</span> {t('learn.controls.title')}
            </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)' }}>
              <div style={{ display: 'flex', gap: 'clamp(8px, 2vw, 12px)', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setIsRotating(!isRotating)}
                  style={{
                    flex: 1,
                    minWidth: '120px',
                    padding: 'clamp(12px, 2.5vw, 16px) clamp(16px, 3vw, 24px)',
                    background: isRotating
                      ? 'linear-gradient(135deg, #ef5350, #e53935)'
                      : 'linear-gradient(135deg, #66bb6a, #43a047)',
                    border: 'none',
                    borderRadius: 14,
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    transition: 'all 0.3s ease',
                    boxShadow: isRotating
                      ? '0 6px 20px rgba(229, 57, 53, 0.3)'
                      : '0 6px 20px rgba(67, 160, 71, 0.3)',
                    minHeight: '44px',
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent'
                  }}
                >
                  {isRotating ? '⏸️ ' + t('learn.controls.pause') : '▶️ ' + t('learn.controls.play')}
                </button>
                <button
                  onClick={() => setShowLabels(!showLabels)}
                  style={{
                    padding: 'clamp(12px, 2.5vw, 16px) clamp(14px, 3vw, 20px)',
                    background: showLabels
                      ? 'linear-gradient(135deg, #42a5f5, #1e88e5)'
                      : '#f5f5f5',
                    border: showLabels ? 'none' : '2px solid #e0e0e0',
                    borderRadius: 14,
                    color: showLabels ? '#fff' : '#757575',
                    cursor: 'pointer',
                    fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
                    fontWeight: 600,
                    transition: 'all 0.3s ease',
                    minHeight: '44px',
                    minWidth: '44px',
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent'
                  }}
                >
                  🏷️
                </button>
              </div>

              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 10
                }}>
                  <span style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', color: '#546e7a', fontWeight: 500 }}>
                    {t('learn.controls.rotationSpeed')}
                  </span>
                  <span style={{
                    fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                    fontWeight: 700,
                    color: '#1976d2',
                    background: '#e3f2fd',
                    padding: 'clamp(2px, 0.5vw, 2px) clamp(8px, 2vw, 10px)',
                    borderRadius: 8
                  }}>
                    {rotationSpeed}x
                  </span>
                </div>
                <input
                  type="range"
                  min="0.25"
                  max="5"
                  step="0.25"
                  value={rotationSpeed}
                  onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    height: 'clamp(6px, 1.5vw, 10px)',
                    borderRadius: 4,
                    background: 'linear-gradient(90deg, #1976d2, #7b1fa2)',
                    cursor: 'pointer',
                    appearance: 'none',
                    outline: 'none',
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Key Facts Card */}
          <div style={{
            background: 'linear-gradient(135deg, #e3f2fd, #f3e5f5)',
            borderRadius: 20,
            padding: 24,
            boxShadow: '0 8px 30px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              marginBottom: 16,
              color: '#1a237e',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <span>📊</span> {t('learn.keyFacts.title')}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: t('learn.keyFacts.rotationPeriod'), value: '23h 56m 4s', icon: '⏱️', color: '#1565c0' },
                { label: t('learn.keyFacts.equatorialSpeed'), value: '1,670 km/h', icon: '💨', color: '#00897b' },
                { label: t('learn.keyFacts.axisTilt'), value: '23.5°', icon: '📐', color: '#e65100' },
                { label: t('learn.keyFacts.timeZones'), value: '24', icon: '🌐', color: '#7b1fa2' }
              ].map((fact) => (
                <div
                  key={fact.label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: '#ffffff',
                    borderRadius: 12,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                  }}
                >
                  <span style={{
                    color: '#546e7a',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    fontWeight: 500
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>{fact.icon}</span>
                    {fact.label}
                  </span>
                  <span style={{
                    fontWeight: 700,
                    color: fact.color,
                    fontSize: '1.05rem'
                  }}>
                    {fact.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Effects Card (conditional) */}
          {activeMode === 'effects' && (
            <div style={{
              background: '#ffffff',
              borderRadius: 20,
              padding: 24,
              boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
              animation: 'slideUp 0.5s ease'
            }}>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                marginBottom: 16,
                color: '#7b1fa2',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
                <span>🌀</span> {t('learn.effects.title')}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { title: t('learn.effects.coriolisEffect'), desc: t('learn.effects.coriolisDesc'), emoji: '🌪️' },
                  { title: t('learn.effects.equatorialBulge'), desc: t('learn.effects.bulgeDesc'), emoji: '🥚' },
                  { title: t('learn.effects.tidalForces'), desc: t('learn.effects.tidalDesc'), emoji: '🌊' },
                  { title: t('learn.effects.starTrails'), desc: t('learn.effects.starDesc'), emoji: '✨' }
                ].map((effect) => (
                  <div
                    key={effect.title}
                    style={{
                      padding: '14px 16px',
                      background: 'linear-gradient(135deg, #faf5ff, #f3e5f5)',
                      borderRadius: 12,
                      borderLeft: '4px solid #7b1fa2'
                    }}
                  >
                    <div style={{
                      fontWeight: 700,
                      color: '#4a148c',
                      marginBottom: 4,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8
                    }}>
                      <span>{effect.emoji}</span>
                      {effect.title}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#6a1b9a', lineHeight: 1.5 }}>
                      {effect.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Location Card (conditional) */}
          {selectedLocation && activeMode === 'timezones' && (
            <div style={{
              background: 'linear-gradient(135deg, #fff8e1, #ffecb3)',
              borderRadius: 20,
              padding: 24,
              boxShadow: '0 8px 30px rgba(255, 152, 0, 0.15)',
              animation: 'slideUp 0.3s ease'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16
              }}>
                <h3 style={{
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: '#e65100',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  margin: 0
                }}>
                  <span>📍</span> {selectedLocation.name}
                </h3>
                <button
                  onClick={() => setSelectedLocation(null)}
                  style={{
                    background: 'rgba(230, 81, 0, 0.1)',
                    border: 'none',
                    color: '#e65100',
                    cursor: 'pointer',
                    fontSize: '1.3rem',
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >×</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: t('learn.location.localTime'), value: getTimeAtLocation(selectedLocation.offset) },
                  { label: t('learn.location.timezone'), value: selectedLocation.timezone },
                  { label: t('learn.location.utcOffset'), value: `${selectedLocation.offset >= 0 ? '+' : ''}${selectedLocation.offset}h` },
                  { label: t('learn.location.status'), value: isDayTime(selectedLocation.angle) ? `☀️ ${t('learn.location.daytime')}` : `🌙 ${t('learn.location.nighttime')}` }
                ].map(item => (
                  <div
                    key={item.label}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      background: '#fff',
                      padding: '10px 14px',
                      borderRadius: 10
                    }}
                  >
                    <span style={{ color: '#bf360c', fontWeight: 500 }}>{item.label}</span>
                    <span style={{ fontWeight: 700, color: '#e65100' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </main>

      {/* CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes sunPulse {
          0%, 100% { box-shadow: 0 0 50px 15px rgba(255, 193, 7, 0.4), 0 0 100px 30px rgba(255, 152, 0, 0.2); }
          50% { box-shadow: 0 0 60px 20px rgba(255, 193, 7, 0.5), 0 0 120px 40px rgba(255, 152, 0, 0.3); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes popIn {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 22px;
          height: 22px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          border: 3px solid #1976d2;
        }
        
        button:hover {
          transform: translateY(-2px);
          filter: brightness(1.05);
        }
        
        button:active {
          transform: translateY(0);
        }
      `}} />
    </div>
  );
};

// Practice Mode Component
type QuestionType = 'mcq' | 'truefalse' | 'fillblank' | 'matching' | 'ordering';

interface Question {
  id: number;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | number | number[];
  explanation: string;
  hint?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  matchPairs?: { left: string; right: string }[];
  orderItems?: string[];
}

interface QuizResult {
  questionId: number;
  isCorrect: boolean;
  userAnswer: string | number | number[];
  timeTaken: number;
}

interface RotationPracticeModeProps {
  props?: {
    language?: LanguageCode;
  };
}

const RotationPracticeMode: React.FC<RotationPracticeModeProps> = ({
  props: _props,
}) => {
  const { language, t } = useLanguage();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [streak, setStreak] = useState(0);

  const questionsData: Record<Language, Question[]> = {
    en: [
      {
        id: 1,
        type: 'mcq',
        question: 'How long does it take for Earth to complete one full rotation on its axis?',
        options: ['12 hours', '24 hours', '365 days', '30 days'],
        correctAnswer: 1,
        explanation: 'Earth takes approximately 24 hours (23 hours, 56 minutes, and 4 seconds to be exact) to complete one full rotation on its axis. This is why we have day and night cycles.',
        hint: 'Think about how long a complete day-night cycle lasts.',
        difficulty: 'easy'
      },
      {
        id: 2,
        type: 'mcq',
        question: 'In which direction does Earth rotate when viewed from above the North Pole?',
        options: ['Clockwise', 'Counter-clockwise', 'It doesn\'t rotate', 'Both directions'],
        correctAnswer: 1,
        explanation: 'Earth rotates counter-clockwise (from west to east) when viewed from above the North Pole. This is why the Sun appears to rise in the east and set in the west.',
        hint: 'Where does the Sun rise?',
        difficulty: 'easy'
      },
      {
        id: 3,
        type: 'truefalse',
        question: 'The Earth\'s axis is tilted at approximately 23.5 degrees.',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'True! Earth\'s axis is tilted at about 23.5 degrees relative to its orbital plane. This tilt is responsible for the seasons.',
        difficulty: 'easy'
      },
      {
        id: 4,
        type: 'mcq',
        question: 'What is the speed of Earth\'s rotation at the equator?',
        options: ['About 500 km/h', 'About 1,000 km/h', 'About 1,670 km/h', 'About 2,500 km/h'],
        correctAnswer: 2,
        explanation: 'At the equator, Earth\'s surface moves at approximately 1,670 km/h (or about 1,040 mph) due to rotation. This speed decreases as you move toward the poles.',
        hint: 'It\'s faster than any commercial airplane!',
        difficulty: 'medium'
      },
      {
        id: 5,
        type: 'fillblank',
        question: 'Earth is divided into _____ time zones.',
        correctAnswer: '24',
        explanation: 'Earth is divided into 24 time zones, each representing 15 degrees of longitude (360° ÷ 24 = 15°). Each zone differs by one hour from its neighbors.',
        hint: 'Think about hours in a day...',
        difficulty: 'easy'
      },
      {
        id: 6,
        type: 'mcq',
        question: 'What causes day and night on Earth?',
        options: [
          'Earth\'s revolution around the Sun',
          'Earth\'s rotation on its axis',
          'The Moon blocking sunlight',
          'The Sun moving around Earth'
        ],
        correctAnswer: 1,
        explanation: 'Day and night are caused by Earth\'s rotation on its axis. As Earth spins, different parts face toward or away from the Sun, creating the day-night cycle.',
        difficulty: 'easy'
      },
      {
        id: 7,
        type: 'truefalse',
        question: 'People at the North Pole experience the same day length as people at the equator.',
        options: ['True', 'False'],
        correctAnswer: 1,
        explanation: 'False! Due to Earth\'s axial tilt, people at the poles experience extreme variations in day length throughout the year, including 24 hours of daylight in summer and 24 hours of darkness in winter.',
        difficulty: 'medium'
      },
      {
        id: 8,
        type: 'mcq',
        question: 'The Coriolis effect, caused by Earth\'s rotation, deflects moving objects in which direction in the Northern Hemisphere?',
        options: ['To the left', 'To the right', 'Downward', 'Upward'],
        correctAnswer: 1,
        explanation: 'In the Northern Hemisphere, the Coriolis effect deflects moving objects to the right of their direction of motion. In the Southern Hemisphere, it deflects them to the left.',
        hint: 'Think about how hurricanes spin in the Northern Hemisphere.',
        difficulty: 'hard'
      },
      {
        id: 9,
        type: 'matching',
        question: 'Match the following terms with their correct descriptions:',
        matchPairs: [
          { left: 'Rotation', right: 'Earth spinning on its axis' },
          { left: 'Revolution', right: 'Earth orbiting the Sun' },
          { left: 'Axis', right: 'Imaginary line through poles' },
          { left: 'Equator', right: 'Line dividing Earth in half' }
        ],
        correctAnswer: [0, 1, 2, 3],
        explanation: 'Rotation is Earth spinning on its axis (causing day/night). Revolution is Earth orbiting the Sun (causing years). The axis is the imaginary line through the poles.',
        difficulty: 'medium'
      },
      {
        id: 10,
        type: 'ordering',
        question: 'Put these events in order from sunrise to the next sunrise:',
        orderItems: ['Sunrise (Sun appears in east)', 'Noon (Sun at highest point)', 'Sunset (Sun disappears in west)', 'Midnight (Sun on opposite side)'],
        correctAnswer: [0, 1, 2, 3],
        explanation: 'During one Earth rotation: The Sun rises in the east, reaches its highest point at noon, sets in the west, and at midnight is on the opposite side of Earth.',
        difficulty: 'easy'
      },
      {
        id: 11,
        type: 'mcq',
        question: 'Why does Earth bulge slightly at the equator?',
        options: [
          'Because of the Moon\'s gravity',
          'Because of centrifugal force from rotation',
          'Because of volcanic activity',
          'Because of ocean water weight'
        ],
        correctAnswer: 1,
        explanation: 'Earth\'s rotation creates a centrifugal force that pushes material outward at the equator, causing Earth to bulge. The equatorial diameter is about 43 km larger than the polar diameter.',
        hint: 'Think about what happens when you spin something...',
        difficulty: 'hard'
      },
      {
        id: 12,
        type: 'fillblank',
        question: 'The exact time for one Earth rotation is 23 hours, 56 minutes, and _____ seconds.',
        correctAnswer: '4',
        explanation: 'One complete rotation of Earth (a sidereal day) takes 23 hours, 56 minutes, and 4 seconds. The 24-hour day we use includes the extra time needed because Earth has moved in its orbit.',
        hint: 'It\'s a single digit number.',
        difficulty: 'hard'
      },
      {
        id: 13,
        type: 'truefalse',
        question: 'If Earth stopped rotating, one side would always face the Sun.',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'True! If Earth stopped rotating, one hemisphere would experience permanent day while the other would have permanent night. This would cause extreme temperature differences.',
        difficulty: 'medium'
      },
      {
        id: 14,
        type: 'mcq',
        question: 'What would happen to our weight if Earth rotated faster?',
        options: [
          'We would weigh more',
          'We would weigh less',
          'Our weight wouldn\'t change',
          'We would float away immediately'
        ],
        correctAnswer: 1,
        explanation: 'If Earth rotated faster, the increased centrifugal force would make us weigh slightly less, especially at the equator. Currently, rotation already makes us about 0.3% lighter at the equator.',
        difficulty: 'hard'
      },
      {
        id: 15,
        type: 'mcq',
        question: 'How many degrees does Earth rotate in one hour?',
        options: ['10 degrees', '15 degrees', '20 degrees', '30 degrees'],
        correctAnswer: 1,
        explanation: 'Earth rotates 360 degrees in 24 hours, so it rotates 15 degrees per hour (360 ÷ 24 = 15). This is why each time zone represents 15 degrees of longitude.',
        hint: 'Divide 360 by 24.',
        difficulty: 'medium'
      }
    ],
    hi: [
      {
        id: 1,
        type: 'mcq',
        question: 'पृथ्वी को अपनी धुरी पर एक पूर्ण चक्कर लगाने में कितना समय लगता है?',
        options: ['12 घंटे', '24 घंटे', '365 दिन', '30 दिन'],
        correctAnswer: 1,
        explanation: 'पृथ्वी को अपनी धुरी पर एक पूर्ण चक्कर लगाने में लगभग 24 घंटे (सटीक होने के लिए 23 घंटे, 56 मिनट और 4 सेकंड) लगते हैं। इसी कारण हमारे पास दिन और रात के चक्र होते हैं।',
        hint: 'सोचिए कि एक पूरा दिन-रात का चक्र कितने समय तक चलता है।',
        difficulty: 'easy'
      },
      {
        id: 2,
        type: 'mcq',
        question: 'उत्तरी ध्रुव के ऊपर से देखने पर पृथ्वी किस दिशा में घूमती है?',
        options: ['दक्षिणावर्त (Clockwise)', 'वामावर्त (Counter-clockwise)', 'यह नहीं घूमती', 'दोनों दिशाओं में'],
        correctAnswer: 1,
        explanation: 'उत्तरी ध्रुव के ऊपर से देखने पर पृथ्वी वामावर्त (पश्चिम से पूर्व की ओर) घूमती है। यही कारण है कि सूर्य पूर्व में उगता और पश्चिम में अस्त होता दिखाई देता है।',
        hint: 'सूर्य कहाँ उगता है?',
        difficulty: 'easy'
      },
      {
        id: 3,
        type: 'truefalse',
        question: 'पृथ्वी की धुरी लगभग 23.5 डिग्री झुकी हुई है।',
        options: ['सत्य', 'असत्य'],
        correctAnswer: 0,
        explanation: 'सत्य! पृथ्वी की धुरी अपने कक्षीय तल के सापेक्ष लगभग 23.5 डिग्री झुकी हुई है। यह झुकाव ऋतुओं के लिए जिम्मेदार है।',
        difficulty: 'easy'
      },
      {
        id: 4,
        type: 'mcq',
        question: 'भूमध्य रेखा पर पृथ्वी के घूर्णन की गति क्या है?',
        options: ['लगभग 500 किमी/घंटा', 'लगभग 1,000 किमी/घंटा', 'लगभग 1,670 किमी/घंटा', 'लगभग 2,500 किमी/घंटा'],
        correctAnswer: 2,
        explanation: 'भूमध्य रेखा पर, घूर्णन के कारण पृथ्वी की सतह लगभग 1,670 किमी/घंटा (या लगभग 1,040 मील प्रति घंटे) की गति से चलती है। जैसे-जैसे आप ध्रुवों की ओर बढ़ते हैं, यह गति कम होती जाती है।',
        hint: 'यह किसी भी वाणिज्यिक हवाई जहाज से तेज है!',
        difficulty: 'medium'
      },
      {
        id: 5,
        type: 'fillblank',
        question: 'पृथ्वी को _____ समय क्षेत्रों में विभाजित किया गया है।',
        correctAnswer: '24',
        explanation: 'पृथ्वी को 24 समय क्षेत्रों में विभाजित किया गया है, जिनमें से प्रत्येक 15 डिग्री देशांतर (360° ÷ 24 = 15°) का प्रतिनिधित्व करता है। प्रत्येक क्षेत्र अपने पड़ोसियों से एक घंटे भिन्न होता है।',
        hint: 'एक दिन में कितने घंटे होते हैं, इस बारे में सोचें...',
        difficulty: 'easy'
      },
      {
        id: 6,
        type: 'mcq',
        question: 'पृथ्वी पर दिन और रात का क्या कारण है?',
        options: [
          'सूर्य के चारों ओर पृथ्वी की परिक्रमा',
          'अपनी धुरी पर पृथ्वी का घूर्णन',
          'चंद्रमा द्वारा सूर्य के प्रकाश को रोकना',
          'पृथ्वी के चारों ओर सूर्य की गति'
        ],
        correctAnswer: 1,
        explanation: 'दिन और रात पृथ्वी के अपनी धुरी पर घूमने के कारण होते हैं। जैसे ही पृथ्वी घूमती है, विभिन्न भाग सूर्य की ओर या उससे दूर होते हैं, जिससे दिन-रात का चक्र बनता है।',
        difficulty: 'easy'
      },
      {
        id: 7,
        type: 'truefalse',
        question: 'उत्तरी ध्रुव पर लोग भूमध्य रेखा पर लोगों के समान दिन की लंबाई का अनुभव करते हैं।',
        options: ['सत्य', 'असत्य'],
        correctAnswer: 1,
        explanation: 'असत्य! पृथ्वी के अक्षीय झुकाव के कारण, ध्रुवों पर लोग पूरे वर्ष दिन की लंबाई में अत्यधिक भिन्नता का अनुभव करते हैं, जिसमें गर्मियों में 24 घंटे की रोशनी और सर्दियों में 24 घंटे का अंधेरा शामिल है।',
        difficulty: 'medium'
      },
      {
        id: 8,
        type: 'mcq',
        question: 'कोरिओलिस प्रभाव, पृथ्वी के घूर्णन के कारण, उत्तरी गोलार्ध में गतिशील वस्तुओं को किस दिशा में विक्षेपित करता है?',
        options: ['बाईं ओर', 'दाईं ओर', 'नीचे की ओर', 'ऊपर की ओर'],
        correctAnswer: 1,
        explanation: 'उत्तरी गोलार्ध में, कोरिओलिस प्रभाव गतिशील वस्तुओं को उनकी गति की दिशा के दाईं ओर विक्षेपित करता है। दक्षिणी गोलार्ध में, यह उन्हें बाईं ओर विक्षेपित करता है।',
        hint: 'सोचिए कि उत्तरी गोलार्ध में तूफान कैसे घूमते हैं।',
        difficulty: 'hard'
      },
      {
        id: 9,
        type: 'matching',
        question: 'निम्नलिखित शब्दों को उनके सही विवरण के साथ मिलाएँ:',
        matchPairs: [
          { left: 'घूर्णन (Rotation)', right: 'पृथ्वी का अपनी धुरी पर घूमना' },
          { left: 'परिक्रमण (Revolution)', right: 'सूर्य की परिक्रमा करती पृथ्वी' },
          { left: 'अक्ष (Axis)', right: 'ध्रुवों से गुजरने वाली काल्पनिक रेखा' },
          { left: 'भूमध्य रेखा (Equator)', right: 'पृथ्वी को आधे में विभाजित करने वाली रेखा' }
        ],
        correctAnswer: [0, 1, 2, 3],
        explanation: 'घूर्णन पृथ्वी का अपनी धुरी पर घूमना है (जिससे दिन/रात होते हैं)। परिक्रमण सूर्य के चारों ओर पृथ्वी की कक्षा है (जिससे वर्ष बनते हैं)। अक्ष ध्रुवों के माध्यम से काल्पनिक रेखा है।',
        difficulty: 'medium'
      },
      {
        id: 10,
        type: 'ordering',
        question: 'सूर्योदय से अगले सूर्योदय तक इन घटनाओं को क्रम में रखें:',
        orderItems: ['सूर्योदय (सूर्य पूर्व में दिखाई देता है)', 'दोपहर (सूर्य उच्चतम बिंदु पर)', 'सूर्यास्त (सूर्य पश्चिम में गायब हो जाता है)', 'मध्यरात्रि (सूर्य पृथ्वी के विपरीत दिशा में)'],
        correctAnswer: [0, 1, 2, 3],
        explanation: 'एक पृथ्वी घूर्णन के दौरान: सूर्य पूर्व में उगता है, दोपहर में अपने उच्चतम बिंदु पर पहुँचता है, पश्चिम में अस्त होता है, और मध्यरात्रि में पृथ्वी के विपरीत दिशा में होता है।',
        difficulty: 'easy'
      },
      {
        id: 11,
        type: 'mcq',
        question: 'पृथ्वी भूमध्य रेखा पर थोड़ी क्यों उभरी हुई है?',
        options: [
          'चंद्रमा के गुरुत्वाकर्षण के कारण',
          'घूर्णन से अपकेंद्रीय बल के कारण',
          'ज्वालामुखी गतिविधि के कारण',
          'समुद्र के पानी के वजन के कारण'
        ],
        correctAnswer: 1,
        explanation: 'पृथ्वी का घूर्णन एक अपकेंद्रीय बल (centrifugal force) बनाता है जो भूमध्य रेखा पर सामग्री को बाहर की ओर धकेलता है, जिससे पृथ्वी उभर जाती है। भूमध्यरेखीय व्यास ध्रुवीय व्यास से लगभग 43 किमी बड़ा है।',
        hint: 'सोचिए कि जब आप किसी चीज को घुमाते हैं तो क्या होता है...',
        difficulty: 'hard'
      },
      {
        id: 12,
        type: 'fillblank',
        question: 'पृथ्वी के एक घूर्णन का सटीक समय 23 घंटे, 56 मिनट और _____ सेकंड है।',
        correctAnswer: '4',
        explanation: 'पृथ्वी का एक पूर्ण घूर्णन (एक नक्षत्र दिवस) 23 घंटे, 56 मिनट और 4 सेकंड लेता है। जिस 24-घंटे के दिन का हम उपयोग करते हैं उसमें अतिरिक्त समय शामिल होता है क्योंकि पृथ्वी अपनी कक्षा में आगे बढ़ चुकी होती है।',
        hint: 'यह एक अंक की संख्या है।',
        difficulty: 'hard'
      },
      {
        id: 13,
        type: 'truefalse',
        question: 'यदि पृथ्वी घूमना बंद कर दे, तो एक पक्ष हमेशा सूर्य का सामना करेगा।',
        options: ['सत्य', 'असत्य'],
        correctAnswer: 0,
        explanation: 'सत्य! यदि पृथ्वी घूमना बंद कर देती है, तो एक गोलार्ध में स्थायी दिन होगा जबकि दूसरे में स्थायी रात होगी। इससे अत्यधिक तापमान अंतर पैदा होगा।',
        difficulty: 'medium'
      },
      {
        id: 14,
        type: 'mcq',
        question: 'यदि पृथ्वी तेजी से घूमती तो हमारे वजन का क्या होता?',
        options: [
          'हमारा वजन अधिक होगा',
          'हमारा वजन कम होगा',
          'हमारा वजन नहीं बदलेगा',
          'हम तुरंत तैरने लगेंगे'
        ],
        correctAnswer: 1,
        explanation: 'यदि पृथ्वी तेजी से घूमती, तो बढ़ा हुआ अपकेंद्रीय बल हमें थोड़ा हल्का बना देता, विशेष रूप से भूमध्य रेखा पर। वर्तमान में, घूर्णन हमें भूमध्य रेखा पर लगभग 0.3% हल्का बनाता है।',
        difficulty: 'hard'
      },
      {
        id: 15,
        type: 'mcq',
        question: 'पृथ्वी एक घंटे में कितने डिग्री घूमती है?',
        options: ['10 डिग्री', '15 डिग्री', '20 डिग्री', '30 डिग्री'],
        correctAnswer: 1,
        explanation: 'पृथ्वी 24 घंटों में 360 डिग्री घूमती है, इसलिए यह प्रति घंटे 15 डिग्री घूमती है (360 ÷ 24 = 15)। यही कारण है कि प्रत्येक समय क्षेत्र 15 डिग्री देशांतर का प्रतिनिधित्व करता है।',
        hint: '360 को 24 से विभाजित करें।',
        difficulty: 'medium'
      }
    ],
    gu: [
      {
        id: 1,
        type: 'mcq',
        question: 'પૃથ્વીને તેની ધરી પર એક પૂર્ણ પરિભ્રમણ પૂર્ણ કરવામાં કેટલો સમય લાગે છે?',
        options: ['12 કલાક', '24 કલાક', '365 દિવસ', '30 દિવસ'],
        correctAnswer: 1,
        explanation: 'પૃથ્વીને તેની ધરી પર એક પૂર્ણ પરિભ્રમણ પૂર્ણ કરવામાં આશરે 24 કલાક (ચોક્કસ થવા માટે 23 કલાક, 56 મિનિટ અને 4 સેકન્ડ) લાગે છે. આ કારણે આપણી પાસે દિવસ અને રાત્રિના ચક્ર છે.',
        hint: 'વિચારો કે એક સંપૂર્ણ દિવસ-રાતનું ચક્ર કેટલો સમય ચાલે છે.',
        difficulty: 'easy'
      },
      {
        id: 2,
        type: 'mcq',
        question: 'ઉત્તર ધ્રુવની ઉપરથી જોતી વખતે પૃથ્વી કઈ દિશામાં ફરે છે?',
        options: ['ઘડિયાળની દિશામાં (Clockwise)', 'ઘડિયાળની વિરુદ્ધ દિશામાં (Counter-clockwise)', 'તે ફરતી નથી', 'બંને દિશામાં'],
        correctAnswer: 1,
        explanation: 'ઉત્તર ધ્રુવની ઉપરથી જોતી વખતે પૃથ્વી ઘડિયાળની વિરુદ્ધ દિશામાં (પશ્ચિમથી પૂર્વ તરફ) ફરે છે. આથી જ સૂર્ય પૂર્વમાં ઊગતો અને પશ્ચિમમાં આથમતો દેખાય છે.',
        hint: 'સૂર્ય ક્યાં ઊગે છે?',
        difficulty: 'easy'
      },
      {
        id: 3,
        type: 'truefalse',
        question: 'પૃથ્વીની ધરી આશરે 23.5 ડિગ્રી નમેલી છે.',
        options: ['સાચું', 'ખોટું'],
        correctAnswer: 0,
        explanation: 'સાચું! પૃથ્વીની ધરી તેના ભ્રમણકક્ષાના સમતલની સાપેક્ષે લગભગ 23.5 ડિગ્રી નમેલી છે. આ નમણ ઋતુઓ માટે જવાબદાર છે.',
        difficulty: 'easy'
      },
      {
        id: 4,
        type: 'mcq',
        question: 'વિષુવવૃત્ત પર પૃથ્વીના પરિભ્રમણની ઝડપ શું છે?',
        options: ['આશરે 500 કિમી/કલાક', 'આશરે 1,000 કિમી/કલાક', 'આશરે 1,670 કિમી/કલાક', 'આશરે 2,500 કિમી/કલાક'],
        correctAnswer: 2,
        explanation: 'વિષુવવૃત્ત પર, પરિભ્રમણને કારણે પૃથ્વીની સપાટી આશરે 1,670 કિમી/કલાક (અથવા લગભગ 1,040 માઇલ પ્રતિ કલાક) ની ઝડપે ગતિ કરે છે. જેમ જેમ તમે ધ્રુવો તરફ આગળ વધો છો, આ ઝડપ ઘટતી જાય છે.',
        hint: 'તે કોઈપણ કોમર્શિયલ એરપ્લેન કરતા ઝડપી છે!',
        difficulty: 'medium'
      },
      {
        id: 5,
        type: 'fillblank',
        question: 'પૃથ્વીને _____ સમય ઝોનમાં વહેંચવામાં આવી છે.',
        correctAnswer: '24',
        explanation: 'પૃથ્વીને 24 સમય ઝોનમાં વહેંચવામાં આવી છે, જેમાં દરેક 15 ડિગ્રી રેખાંશ (360° ÷ 24 = 15°) નું પ્રતિનિધિત્વ કરે છે. દરેક ઝોન તેના પડોશીઓથી એક કલાક અલગ હોય છે.',
        hint: 'એક દિવસમાં કેટલા કલાક હોય છે તે વિશે વિચારો...',
        difficulty: 'easy'
      },
      {
        id: 6,
        type: 'mcq',
        question: 'પૃથ્વી પર દિવસ અને રાતનું કારણ શું છે?',
        options: [
          'સૂર્યની આસપાસ પૃથ્વીની પરિક્રમા',
          'તેની ધરી પર પૃથ્વીનું પરિભ્રમણ',
          'ચંદ્ર દ્વારા સૂર્યપ્રકાશને અવરોધવો',
          'પૃથ્વીની આસપાસ સૂર્યની ગતિ'
        ],
        correctAnswer: 1,
        explanation: 'દિવસ અને રાત પૃથ્વીના તેની ધરી પર ફરવાને કારણે થાય છે. જેમ પૃથ્વી ફરે છે, વિવિધ ભાગો સૂર્ય તરફ અથવા તેનાથી દૂર હોય છે, જે દિવસ-રાતનું ચક્ર બનાવે છે.',
        difficulty: 'easy'
      },
      {
        id: 7,
        type: 'truefalse',
        question: 'ઉત્તર ધ્રુવ પરના લોકો વિષુવવૃત્ત પરના લોકો જેટલી જ દિવસની લંબાઈનો અનુભવ કરે છે.',
        options: ['સાચું', 'ખોટું'],
        correctAnswer: 1,
        explanation: 'ખોટું! પૃથ્વીના અક્ષીય નમણને કારણે, ધ્રુવો પરના લોકો આખા વર્ષ દરમિયાન દિવસની લંબાઈમાં અત્યંત ભિન્નતાનો અનુભવ કરે છે, જેમાં ઉનાળામાં 24 કલાક પ્રકાશ અને શિયાળામાં 24 કલાક અંધકારનો સમાવેશ થાય છે.',
        difficulty: 'medium'
      },
      {
        id: 8,
        type: 'mcq',
        question: 'કોરિઓલિસ અસર, પૃથ્વીના પરિભ્રમણને કારણે, ઉત્તરીય ગોળાર્ધમાં ગતિશીલ વસ્તુઓને કઈ દિશામાં વિચલિત કરે છે?',
        options: ['ડાબી બાજુ', 'જમણી બાજુ', 'નીચે તરફ', 'ઉપર તરફ'],
        correctAnswer: 1,
        explanation: 'ઉત્તરીય ગોળાર્ધમાં, કોરિઓલિસ અસર ગતિશીલ વસ્તુઓને તેમની ગતિની દિશાની જમણી બાજુએ વિચલિત કરે છે. દક્ષિણી ગોળાર્ધમાં, તે તેમને ડાબી બાજુએ વિચલિત કરે છે.',
        hint: 'વિચારો કે ઉત્તરીય ગોળાર્ધમાં વાવાઝોડા કેવી રીતે ફરે છે.',
        difficulty: 'hard'
      },
      {
        id: 9,
        type: 'matching',
        question: 'નીચેના શબ્દોને તેમના સાચા વર્ણન સાથે જોડો:',
        matchPairs: [
          { left: 'પરિભ્રમણ (Rotation)', right: 'પૃથ્વીનું તેની ધરી પર ફરવું' },
          { left: 'પરિક્રમા (Revolution)', right: 'સૂર્યની પ્રદક્ષિણા કરતી પૃથ્વી' },
          { left: 'અક્ષ (Axis)', right: 'ધ્રુવોમાંથી પસાર થતી કાલ્પનિક રેખા' },
          { left: 'વિષુવવૃત્ત (Equator)', right: 'પૃથ્વીને અડધા ભાગમાં વહેંચતી રેખા' }
        ],
        correctAnswer: [0, 1, 2, 3],
        explanation: 'પરિભ્રમણ એ પૃથ્વીનું તેની ધરી પર ફરવું છે (જે દિવસ/રાતનું કારણ બને છે). પરિક્રમા એ સૂર્યની આસપાસ પૃથ્વીની કક્ષા છે (જે વર્ષો બનાવે છે). અક્ષ એ ધ્રુવોમાંથી પસાર થતી કાલ્પનિક રેખા છે.',
        difficulty: 'medium'
      },
      {
        id: 10,
        type: 'ordering',
        question: 'સૂર્યોદયથી બીજા સૂર્યોદય સુધી આ ઘટનાઓને ક્રમમાં ગોઠવો:',
        orderItems: ['સૂર્યોદય (સૂર્ય પૂર્વમાં દેખાય છે)', 'બપોર (સૂર્ય ઉચ્ચતમ બિંદુ પર)', 'સૂર્યાસ્ત (સૂર્ય પશ્ચિમમાં અદૃશ્ય થઈ જાય છે)', 'મધરાત (સૂર્ય પૃથ્વીની વિરુદ્ધ બાજુએ)'],
        correctAnswer: [0, 1, 2, 3],
        explanation: 'એક પૃથ્વી પરિભ્રમણ દરમિયાન: સૂર્ય પૂર્વમાં ઊગે છે, બપોરે તેના ઉચ્ચતમ બિંદુ પર પહોંચે છે, પશ્ચિમમાં આથમે છે, અને મધરાતે પૃથ્વીની વિરુદ્ધ બાજુએ હોય છે.',
        difficulty: 'easy'
      },
      {
        id: 11,
        type: 'mcq',
        question: 'પૃથ્વી વિષુવવૃત્ત પર શા માટે થોડી ઉપસેલી છે?',
        options: [
          'ચંદ્રના ગુરુત્વાકર્ષણને કારણે',
          'પરિભ્રમણથી કેન્દ્રત્યાગી બળને કારણે',
          'જ્વાળામુખી પ્રવૃત્તિને કારણે',
          'સમુદ્રના પાણીના વજનને કારણે'
        ],
        correctAnswer: 1,
        explanation: 'પૃથ્વીનું પરિભ્રમણ એક કેન્દ્રત્યાગી બળ (centrifugal force) બનાવે છે જે વિષુવવૃત્ત પર પદાર્થને બહારની તરફ ધકેલે છે, જેનાથી પૃથ્વી ઉપસી આવે છે. વિષુવવૃત્તીય વ્યાસ ધ્રુવીય વ્યાસ કરતા લગભગ 43 કિમી મોટો છે.',
        hint: 'વિચારો કે જ્યારે તમે કોઈ વસ્તુને ફેરવો છો ત્યારે શું થાય છે...',
        difficulty: 'hard'
      },
      {
        id: 12,
        type: 'fillblank',
        question: 'પૃથ્વીના એક પરિભ્રમણનો ચોક્કસ સમય 23 કલાક, 56 મિનિટ અને _____ સેકન્ડ છે.',
        correctAnswer: '4',
        explanation: 'પૃથ્વીનું એક પૂર્ણ પરિભ્રમણ (એક નક્ષત્ર દિવસ) 23 કલાક, 56 મિનિટ અને 4 સેકન્ડ લે છે. જે 24-કલાકના દિવસનો આપણે ઉપયોગ કરીએ છીએ તેમાં વધારાનો સમય શામેલ હોય છે કારણ કે પૃથ્વી તેની ભ્રમણકક્ષામાં આગળ વધી ચૂકી હોય છે.',
        hint: 'આ એક અંકની સંખ્યા છે.',
        difficulty: 'hard'
      },
      {
        id: 13,
        type: 'truefalse',
        question: 'જો પૃથ્વી ફરતી બંધ થઈ જાય, તો એક બાજુ હંમેશા સૂર્યનો સામનો કરશે.',
        options: ['સાચું', 'ખોટું'],
        correctAnswer: 0,
        explanation: 'સાચું! જો પૃથ્વી ફરતી બંધ થઈ જાય, તો એક ગોળાર્ધમાં કાયમી દિવસ હશે જ્યારે બીજામાં કાયમી રાત્રિ હશે. આનાથી તાપમાનમાં ભારે તફાવત સર્જાશે.',
        difficulty: 'medium'
      },
      {
        id: 14,
        type: 'mcq',
        question: 'જો પૃથ્વી વધુ ઝડપે ફરતી તો આપણા વજનનું શું થાત?',
        options: [
          'આપણું વજન વધારે હોત',
          'આપણું વજન ઓછું હોત',
          'આપણું વજન બદલાશે નહીં',
          'આપણે તરત જ તરવા લાગીશું'
        ],
        correctAnswer: 1,
        explanation: 'જો પૃથ્વી વધુ ઝડપે ફરતી, તો વધેલું કેન્દ્રત્યાગી બળ આપણને થોડું હળવું બનાવશે, ખાસ કરીને વિષુવવૃત્ત પર. હાલમાં, પરિભ્રમણ આપણને વિષુવવૃત્ત પર લગભગ 0.3% હળવા બનાવે છે.',
        difficulty: 'hard'
      },
      {
        id: 15,
        type: 'mcq',
        question: 'પૃથ્વી એક કલાકમાં કેટલા ડિગ્રી ફરે છે?',
        options: ['10 ડિગ્રી', '15 ડિગ્રી', '20 ડિગ્રી', '30 ડિગ્રી'],
        correctAnswer: 1,
        explanation: 'પૃથ્વી 24 કલાકમાં 360 ડિગ્રી ફરે છે, તેથી તે પ્રતિ કલાક 15 ડિગ્રી ફરે છે (360 ÷ 24 = 15). આથી જ દરેક સમય ઝોન 15 ડિગ્રી રેખાંશનું પ્રતિનિધિત્વ કરે છે.',
        hint: '360 ને 24 વડે ભાગો.',
        difficulty: 'medium'
      }
    ]
  };

  const allQuestions = questionsData[language];

  // Filter to only MCQs
  const filteredQuestions = allQuestions.filter(q => q.type === 'mcq');

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  useEffect(() => {
    if (!quizCompleted && !showResult) {
      const interval = setInterval(() => setTimer(prev => prev + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [quizCompleted, showResult]);

  const handleSubmit = () => {
    if (!currentQuestion) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const userAnswer = selectedAnswer as number;

    setStreak(isCorrect ? streak + 1 : 0);
    setResults([...results, { questionId: currentQuestion.id, isCorrect, userAnswer, timeTaken: timer }]);
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      resetQuestion();
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuestion = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setTimer(0);
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setResults([]);
    setQuizCompleted(false);
    setStreak(0);
    resetQuestion();
  };

  const getScore = () => Math.round((results.filter(r => r.isCorrect).length / results.length) * 100);

  // Quiz Completed Screen
  if (quizCompleted) {
    const score = getScore();
    const totalTime = results.reduce((acc, r) => acc + r.timeTaken, 0);

    const uiText = {
      en: { time: 'Time', correct: 'Correct', question: 'Question' },
      hi: { time: 'समय', correct: 'सही', question: 'प्रश्न' },
      gu: { time: 'સમય', correct: 'સાચું', question: 'પ્રશ્ન' }
    };
    const ut = uiText[language];

    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e8f5e9 0%, #e3f2fd 50%, #f3e5f5 100%)',
        fontFamily: getFontFamilyForLanguage(language),
        padding: 'clamp(15px, 4vw, 30px)'
      }}>
        <div style={{
          maxWidth: 800,
          margin: '0 auto',
          background: '#fff',
          borderRadius: 'clamp(16px, 3vw, 24px)',
          padding: 'clamp(20px, 5vw, 40px)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <div style={{ fontSize: '4rem', marginBottom: 16 }}>
              {score >= 80 ? '🏆' : score >= 60 ? '🌟' : score >= 40 ? '💪' : '📚'}
            </div>
            <h1 style={{
              fontSize: 'clamp(1.5rem, 5vw, 2.2rem)',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #1565c0, #7b1fa2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {t('practice.quizCompleted')}
            </h1>
            <p style={{ color: '#546e7a', marginTop: 8 }}>
              {score >= 80 ? t('practice.perfect') :
                score >= 60 ? t('practice.excellent') :
                  score >= 40 ? t('practice.goodJob') :
                    t('practice.keepPracticing')}
            </p>
          </div>

          <div className="quiz-results-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'clamp(12px, 3vw, 20px)', marginBottom: 'clamp(20px, 4vw, 30px)' }}>
            <div style={{ background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)', padding: 24, borderRadius: 16, textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#1565c0' }}>{score}%</div>
              <div style={{ color: '#546e7a', fontWeight: 500 }}>{t('practice.score')}</div>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)', padding: 24, borderRadius: 16, textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#2e7d32' }}>
                {results.filter(r => r.isCorrect).length}/{results.length}
              </div>
              <div style={{ color: '#546e7a', fontWeight: 500 }}>{ut.correct}</div>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #f3e5f5, #e1bee7)', padding: 24, borderRadius: 16, textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#7b1fa2' }}>
                {Math.floor(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, '0')}
              </div>
              <div style={{ color: '#546e7a', fontWeight: 500 }}>{ut.time}</div>
            </div>
          </div>

          <div style={{ marginBottom: 30 }}>
            <h3 style={{ color: '#1a237e', marginBottom: 16 }}>📊 {t('practice.viewResults')}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {results.map((result, index) => {
                const question = allQuestions.find(q => q.id === result.questionId);
                return (
                  <div key={index} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                    background: result.isCorrect ? '#e8f5e9' : '#ffebee',
                    borderRadius: 12, borderLeft: `4px solid ${result.isCorrect ? '#4caf50' : '#f44336'}`
                  }}>
                    <span style={{ fontSize: '1.3rem' }}>{result.isCorrect ? '✅' : '❌'}</span>
                    <span style={{ flex: 1, color: '#37474f', fontWeight: 500 }}>
                      Q{index + 1}: {question?.question.substring(0, 50)}...
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <button onClick={restartQuiz} style={{
            width: '100%', padding: 'clamp(14px, 3vw, 18px) clamp(24px, 4vw, 32px)',
            background: 'linear-gradient(135deg, #1976d2, #7b1fa2)',
            border: 'none', borderRadius: 14, color: '#fff', fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
            fontWeight: 600, cursor: 'pointer', boxShadow: '0 6px 20px rgba(25, 118, 210, 0.3)',
            minHeight: '48px',
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
            transition: 'all 0.2s ease'
          }}>
            🔄 {t('practice.tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e8f5e9 0%, #e3f2fd 50%, #f3e5f5 100%)',
      fontFamily: getFontFamilyForLanguage(language),
      padding: 'clamp(10px, 3vw, 20px)'
    }}>
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '0 clamp(8px, 2vw, 16px)', width: '100%' }}>
        {/* Question Card */}
        <div style={{ background: '#fff', borderRadius: 'clamp(16px, 3vw, 24px)', padding: 'clamp(16px, 4vw, 32px)', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
          {/* Progress */}
          <div style={{ marginBottom: 'clamp(16px, 3vw, 24px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
              <span style={{ color: '#546e7a', fontWeight: 500, fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>
                {t('practice.question')} {currentQuestionIndex + 1} {t('practice.of')} {filteredQuestions.length}
              </span>
            </div>
            <div style={{ height: 'clamp(6px, 1.5vw, 10px)', background: '#e0e0e0', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${((currentQuestionIndex + 1) / filteredQuestions.length) * 100}%`,
                background: 'linear-gradient(90deg, #1976d2, #7b1fa2)', borderRadius: 4, transition: 'width 0.5s ease'
              }} />
            </div>
          </div>

          {/* Question */}
          <div style={{ marginBottom: 'clamp(20px, 4vw, 28px)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'clamp(8px, 2vw, 12px)' }}>
              <span style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', background: 'linear-gradient(135deg, #e3f2fd, #f3e5f5)', padding: 'clamp(6px, 1.5vw, 10px) clamp(10px, 2vw, 14px)', borderRadius: 12, flexShrink: 0 }}>
                ❓
              </span>
              <h2 style={{ fontSize: 'clamp(1rem, 3vw, 1.3rem)', fontWeight: 600, color: '#1a237e', margin: 0, lineHeight: 1.5 }}>
                {currentQuestion?.question}
              </h2>
            </div>
          </div>

          {/* Answer Options */}
          <div style={{ marginBottom: 'clamp(16px, 3vw, 24px)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
              {currentQuestion?.options?.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = showResult && index === currentQuestion.correctAnswer;
                const isWrong = showResult && isSelected && index !== currentQuestion.correctAnswer;

                return (
                  <button key={index} onClick={() => !showResult && setSelectedAnswer(index)} disabled={showResult}
                    style={{
                      padding: 'clamp(14px, 3vw, 18px) clamp(16px, 3vw, 22px)',
                      background: isCorrect ? 'linear-gradient(135deg, #e8f5e9, #c8e6c9)'
                        : isWrong ? 'linear-gradient(135deg, #ffebee, #ffcdd2)'
                          : isSelected ? 'linear-gradient(135deg, #e3f2fd, #bbdefb)' : '#f5f5f5',
                      border: `2px solid ${isCorrect ? '#4caf50' : isWrong ? '#f44336' : isSelected ? '#1976d2' : 'transparent'}`,
                      borderRadius: 14, cursor: showResult ? 'default' : 'pointer', textAlign: 'left',
                      fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', fontWeight: 500, color: '#37474f', display: 'flex', alignItems: 'center', gap: 'clamp(10px, 2vw, 14px)',
                      minHeight: '56px',
                      touchAction: 'manipulation',
                      WebkitTapHighlightColor: 'transparent',
                      transition: 'all 0.2s ease'
                    }}>
                    <span style={{
                      width: 'clamp(28px, 4vw, 36px)', height: 'clamp(28px, 4vw, 36px)', borderRadius: '50%',
                      background: isCorrect ? '#4caf50' : isWrong ? '#f44336' : isSelected ? '#1976d2' : '#e0e0e0',
                      color: (isSelected || isCorrect || isWrong) ? '#fff' : '#757575',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, flexShrink: 0,
                      fontSize: 'clamp(0.85rem, 2vw, 1rem)'
                    }}>
                      {isCorrect ? '✓' : isWrong ? '✗' : String.fromCharCode(65 + index)}
                    </span>
                    <span style={{ flex: 1, wordBreak: 'break-word' }}>{option}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanation */}
          {showResult && (
            <div style={{
              padding: '18px 22px',
              background: results[results.length - 1]?.isCorrect ? 'linear-gradient(135deg, #e8f5e9, #c8e6c9)' : 'linear-gradient(135deg, #fff3e0, #ffe0b2)',
              borderRadius: 14, marginBottom: 20
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: '1.8rem' }}>{results[results.length - 1]?.isCorrect ? '🎉' : '💡'}</span>
                <h3 style={{ margin: 0, color: results[results.length - 1]?.isCorrect ? '#2e7d32' : '#e65100' }}>
                  {results[results.length - 1]?.isCorrect ? (language === 'hi' ? 'सही!' : language === 'gu' ? 'સાચું!' : 'Correct!') : (language === 'hi' ? 'बिलकुल सही नहीं' : language === 'gu' ? 'તદ્દન યોગ્ય નથી' : 'Not quite right')}
                </h3>
              </div>
              <p style={{ margin: 0, color: '#546e7a', lineHeight: 1.7 }}>
                <strong style={{ display: 'block', marginBottom: 4 }}>{t('practice.explanation')}:</strong>
                {currentQuestion?.explanation}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 'clamp(10px, 2vw, 14px)', flexWrap: 'wrap' }}>
            {!showResult ? (
              <button onClick={handleSubmit}
                disabled={selectedAnswer === null}
                style={{
                  flex: 1, padding: 'clamp(14px, 3vw, 18px) clamp(24px, 4vw, 32px)', background: 'linear-gradient(135deg, #1976d2, #7b1fa2)',
                  border: 'none', borderRadius: 14, color: '#fff', fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)', fontWeight: 600, cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(25, 118, 210, 0.3)',
                  opacity: selectedAnswer === null ? 0.5 : 1,
                  minWidth: 'clamp(150px, 30vw, 200px)',
                  minHeight: '48px',
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'transparent',
                  transition: 'all 0.2s ease'
                }}>✓ {t('practice.submitAnswer')}</button>
            ) : (
              <button onClick={handleNext} style={{
                flex: 1, padding: 'clamp(14px, 3vw, 18px) clamp(24px, 4vw, 32px)', background: 'linear-gradient(135deg, #43a047, #2e7d32)',
                border: 'none', borderRadius: 14, color: '#fff', fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)', fontWeight: 600, cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(46, 125, 50, 0.3)',
                minWidth: 'clamp(150px, 30vw, 200px)',
                minHeight: '48px',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent',
                transition: 'all 0.2s ease'
              }}>
                {currentQuestionIndex < filteredQuestions.length - 1 ? `→ ${t('practice.nextQuestion')}` : `🏁 ${t('practice.viewResults')}`}
              </button>
            )}
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
        button:hover:not(:disabled) { transform: translateY(-2px); }
        button:active:not(:disabled) { transform: translateY(0); }
        input:focus { border-color: #1976d2 !important; box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1); }
      `}} />
    </div>
  );
};

// Real World Applications Mode Component
type RealWorldTopic = 'aviation' | 'navigation' | 'weather' | 'satellites' | 'daily-life' | 'sports';

interface TopicContent {
  title: string;
  icon: string;
  description: string;
  facts: { title: string; content: string; icon: string }[];
}

interface RotationRealWorldProps {
  props?: {
    language?: LanguageCode;
  };
}

const RotationRealWorld: React.FC<RotationRealWorldProps> = ({ props: _props }) => {
  const { language, t } = useLanguage();
  const [activeTopic, setActiveTopic] = useState<RealWorldTopic>('aviation');
  const [flightDirection, setFlightDirection] = useState<'east' | 'west'>('east');
  const [planePosition, setPlanePosition] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [weatherHemisphere, setWeatherHemisphere] = useState<'north' | 'south'>('north');
  const [satelliteOrbit, setSatelliteOrbit] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedCity, setSelectedCity] = useState(0);
  const animationRef = useRef<number | undefined>(undefined);

  const citiesData: Record<Language, { name: string; timezone: number; country: string }[]> = {
    en: [
      { name: 'New York', timezone: -5, country: 'USA' },
      { name: 'London', timezone: 0, country: 'UK' },
      { name: 'Dubai', timezone: 4, country: 'UAE' },
      { name: 'Mumbai', timezone: 5.5, country: 'India' },
      { name: 'Tokyo', timezone: 9, country: 'Japan' },
      { name: 'Sydney', timezone: 11, country: 'Australia' }
    ],
    hi: [
      { name: 'न्यूयॉर्क', timezone: -5, country: 'USA' },
      { name: 'लंदन', timezone: 0, country: 'UK' },
      { name: 'दुबई', timezone: 4, country: 'UAE' },
      { name: 'मुंबई', timezone: 5.5, country: 'India' },
      { name: 'टोक्यो', timezone: 9, country: 'Japan' },
      { name: 'सिडनी', timezone: 11, country: 'Australia' }
    ],
    gu: [
      { name: 'ન્યુ યોર્ક', timezone: -5, country: 'USA' },
      { name: 'લંડન', timezone: 0, country: 'UK' },
      { name: 'દુબઈ', timezone: 4, country: 'UAE' },
      { name: 'મુંબઈ', timezone: 5.5, country: 'India' },
      { name: 'ટોક્યો', timezone: 9, country: 'Japan' },
      { name: 'સિડની', timezone: 11, country: 'Australia' }
    ]
  };

  const cities = citiesData[language];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (activeTopic === 'satellites') {
      const animate = () => {
        setSatelliteOrbit(prev => (prev + 0.3) % 360);
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
      return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
    }
  }, [activeTopic]);

  const simulateFlight = () => {
    setIsAnimating(true);
    setPlanePosition(0);
    const speed = flightDirection === 'east' ? 3 : 2;
    const interval = setInterval(() => {
      setPlanePosition(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnimating(false);
          return 100;
        }
        return prev + speed;
      });
    }, 50);
  };

  const getTimeInCity = (timezone: number) => {
    const utc = currentTime.getTime() + currentTime.getTimezoneOffset() * 60000;
    const cityTime = new Date(utc + 3600000 * timezone);
    return cityTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const topicsData: Record<Language, Record<RealWorldTopic, TopicContent>> = {
    en: {
      aviation: {
        title: 'Aviation & Flight Times',
        icon: '✈️',
        description: 'Earth\'s rotation significantly affects flight times. Flying east (with Earth\'s rotation) is generally faster than flying west due to jet streams created by the rotation.',
        facts: [
          { title: 'Eastbound Flights Are Faster', content: 'A flight from New York to London (eastbound) takes about 7 hours, while the return flight takes about 8 hours due to prevailing westerly winds.', icon: '⏱️' },
          { title: 'Jet Streams', content: 'Jet streams are fast-flowing air currents at 9-12 km altitude, flowing west to east due to Earth\'s rotation. They can reach 400 km/h.', icon: '💨' },
          { title: 'Fuel Savings', content: 'Airlines save millions in fuel costs by planning routes that take advantage of jet streams. Eastbound flights can save up to 10% fuel.', icon: '⛽' },
          { title: 'Great Circle Routes', content: 'Pilots fly curved paths (great circles) rather than straight lines on maps. These are actually the shortest routes on a sphere.', icon: '🗺️' }
        ]
      },
      navigation: {
        title: 'Navigation & GPS',
        icon: '🧭',
        description: 'Modern navigation systems must account for Earth\'s rotation. GPS satellites, ships, and aircraft all compensate for Earth\'s spin to maintain accuracy.',
        facts: [
          { title: 'GPS Corrections', content: 'GPS satellites must account for Earth\'s rotation to provide accurate positioning. Without corrections, your location would be off by hundreds of meters.', icon: '📡' },
          { title: 'Ship Navigation', content: 'Ships crossing oceans must factor in Earth\'s rotation when plotting courses. The Coriolis effect can push ships off course over long distances.', icon: '🚢' },
          { title: 'Military Accuracy', content: 'Long-range missiles and artillery must account for Earth\'s rotation. A shell fired north in the Northern Hemisphere will land slightly to the right.', icon: '🎯' },
          { title: 'Surveying', content: 'Land surveyors must account for Earth\'s rotation when making precise measurements over large distances.', icon: '📐' }
        ]
      },
      weather: {
        title: 'Weather Patterns',
        icon: '🌪️',
        description: 'Earth\'s rotation creates the Coriolis effect, which shapes global weather patterns, ocean currents, and the direction hurricanes spin.',
        facts: [
          { title: 'Hurricane Spin Direction', content: 'Hurricanes spin counter-clockwise in the Northern Hemisphere and clockwise in the Southern Hemisphere due to the Coriolis effect.', icon: '🌀' },
          { title: 'Trade Winds', content: 'The reliable trade winds that sailors have used for centuries are created by Earth\'s rotation deflecting air moving toward the equator.', icon: '⛵' },
          { title: 'Ocean Currents', content: 'Major ocean currents like the Gulf Stream are influenced by Earth\'s rotation, carrying warm water and affecting coastal climates.', icon: '🌊' },
          { title: 'Weather Forecasting', content: 'Meteorologists must factor Earth\'s rotation into weather models. It affects how high and low pressure systems move and develop.', icon: '🌤️' }
        ]
      },
      satellites: {
        title: 'Satellites & Space',
        icon: '🛰️',
        description: 'Earth\'s rotation is crucial for satellite launches and orbits. Launching toward the east gets a speed boost from Earth\'s rotation.',
        facts: [
          { title: 'Launch Advantage', content: 'Rockets launched eastward from the equator get a free 1,670 km/h boost from Earth\'s rotation, saving significant fuel.', icon: '🚀' },
          { title: 'Geostationary Orbit', content: 'Satellites at 35,786 km altitude orbit at the same rate as Earth rotates, appearing stationary. Used for TV and weather satellites.', icon: '📺' },
          { title: 'ISS Orbit', content: 'The International Space Station orbits Earth every 90 minutes, experiencing 16 sunrises and sunsets daily.', icon: '🛸' },
          { title: 'Space Launch Sites', content: 'Launch sites are often built near the equator (like French Guiana) to maximize the rotational speed boost.', icon: '🏗️' }
        ]
      },
      'daily-life': {
        title: 'Daily Life',
        icon: '🌅',
        description: 'Earth\'s rotation shapes our daily routines, from sunrise and sunset times to time zones that coordinate global activities.',
        facts: [
          { title: 'Time Zones', content: 'The world is divided into 24 time zones because Earth rotates 15° per hour. This allows for coordinated time across the globe.', icon: '🕐' },
          { title: 'Jet Lag', content: 'When you travel across time zones, your body\'s internal clock gets out of sync with local time. It takes about 1 day per zone to adjust.', icon: '😴' },
          { title: 'Business & Communication', content: 'Global businesses must coordinate across time zones. When it\'s morning in New York, it\'s evening in Tokyo.', icon: '💼' },
          { title: 'Day Length Variation', content: 'Due to Earth\'s tilt, day length varies by season and latitude. Near the poles, summer brings 24-hour daylight.', icon: '📅' }
        ]
      },
      sports: {
        title: 'Sports & Games',
        icon: '⚽',
        description: 'Earth\'s rotation affects long-range sports and games in subtle but measurable ways, from golf to baseball to shooting sports.',
        facts: [
          { title: 'Long Golf Drives', content: 'A 300-meter golf drive can be deflected by about 1 cm due to Earth\'s rotation. Professional golfers don\'t usually compensate.', icon: '⛳' },
          { title: 'Baseball', content: 'A baseball thrown from New York to Los Angeles would be deflected about 100 meters to the right by the Coriolis effect.', icon: '⚾' },
          { title: 'Olympic Shooting', content: 'In Olympic rifle shooting, competitors must account for Earth\'s rotation over long distances. The effect is small but measurable.', icon: '🎯' },
          { title: 'Soccer & Cricket', content: 'While Earth\'s rotation doesn\'t noticeably affect soccer or cricket at normal scales, wind patterns do affect outdoor sports.', icon: '🏏' }
        ]
      }
    },
    hi: {
      aviation: {
        title: 'उड्डयन और उड़ान समय',
        icon: '✈️',
        description: 'पृथ्वी का घूर्णन उड़ान के समय को महत्वपूर्ण रूप से प्रभावित करता है। पूर्व की ओर उड़ान भरना (पृथ्वी के घूर्णन के साथ) आम तौर पर घूर्णन द्वारा निर्मित जेट धाराओं के कारण पश्चिम की ओर उड़ान भरने की तुलना में तेज होता है।',
        facts: [
          { title: 'पूर्व की ओर उड़ानें तेज होती हैं', content: 'न्यूयॉर्क से लंदन (पूर्व की ओर) की उड़ान में लगभग 7 घंटे लगते हैं, जबकि वापसी की उड़ान में प्रचलित पश्चिमी हवाओं के कारण लगभग 8 घंटे लगते हैं।', icon: '⏱️' },
          { title: 'जेट स्ट्रीम', content: 'जेट स्ट्रीम 9-12 किमी की ऊंचाई पर तेजी से बहने वाली वायु धाराएं हैं, जो पृथ्वी के घूर्णन के कारण पश्चिम से पूर्व की ओर बहती हैं। वे 400 किमी/घंटा तक पहुँच सकती हैं।', icon: '💨' },
          { title: 'ईंधन की बचत', content: 'एयरलाइंस जेट धाराओं का लाभ उठाने वाले मार्गों की योजना बनाकर ईंधन लागत में लाखों बचाती हैं। पूर्व की ओर जाने वाली उड़ानें 10% तक ईंधन बचा सकती हैं।', icon: '⛽' },
          { title: 'ग्रेट सर्कल रूट्स', content: 'पायलट नक्शे पर सीधी रेखाओं के बजाय घुमावदार रास्तों (तय किए गए वृत्त) से उड़ान भरते हैं। ये वास्तव में एक गोले पर सबसे छोटे रास्ते हैं।', icon: '🗺️' }
        ]
      },
      navigation: {
        title: 'नेविगेशन और जीपीएस',
        icon: '🧭',
        description: 'आधुनिक नेविगेशन सिस्टम को पृथ्वी के घूर्णन के लिए जिम्मेदार होना चाहिए। जीपीएस उपग्रह, जहाज और विमान सभी सटीकता बनाए रखने के लिए पृथ्वी के स्पिन की भरपाई करते हैं।',
        facts: [
          { title: 'जीपीएस सुधार', content: 'सटीक स्थिति प्रदान करने के लिए जीपीएस उपग्रहों को पृथ्वी के घूर्णन के लिए जिम्मेदार होना चाहिए। सुधार के बिना, आपका स्थान सैकड़ों मीटर तक गलत होगा।', icon: '📡' },
          { title: 'जहाज नेविगेशन', content: 'महासागरों को पार करने वाले जहाजों को पाठ्यक्रम तैयार करते समय पृथ्वी के घूर्णन को ध्यान में रखना चाहिए। कोरिओलिस प्रभाव लंबी दूरी पर जहाजों को पाठ्यक्रम से बाहर धकेल सकता है।', icon: '🚢' },
          { title: 'सैन्य सटीकता', content: 'लंबी दूरी की मिसाइलों और तोपखाने को पृथ्वी के घूर्णन के लिए जिम्मेदार होना चाहिए। उत्तरी गोलार्ध में उत्तर की ओर दागा गया एक गोला थोड़ा दाईं ओर गिरेगा।', icon: '🎯' },
          { title: 'सर्वेक्षण', content: 'भूमि सर्वेक्षणकर्ताओं को बड़ी दूरी पर सटीक माप करते समय पृथ्वी के घूर्णन के लिए जिम्मेदार होना चाहिए।', icon: '📐' }
        ]
      },
      weather: {
        title: 'मौसम के पैटर्न',
        icon: '🌪️',
        description: 'पृथ्वी का घूर्णन कोरिओलिस प्रभाव पैदा करता है, जो वैश्विक मौसम के पैटर्न, महासागरीय धाराओं और तूफानों के घूमने की दिशा को आकार देता है।',
        facts: [
          { title: 'तूफान की स्पिन दिशा', content: 'कोरिओलिस प्रभाव के कारण उत्तरी गोलार्ध में तूफान वामावर्त (counter-clockwise) और दक्षिणी गोलार्ध में दक्षिणावर्त (clockwise) घूमते हैं।', icon: '🌀' },
          { title: 'ट्रेड विंड्स', content: 'भरोसेमंद व्यापारिक हवाएं जिनका नाविकों ने सदियों से उपयोग किया है, पृथ्वी के घूर्णन द्वारा भूमध्य रेखा की ओर बढ़ने वाली हवा को विक्षेपित करके बनाई गई हैं।', icon: '⛵' },
          { title: 'महासागरीय धाराएँ', content: 'गल्फ स्ट्रीम जैसी प्रमुख महासागरीय धाराएँ पृथ्वी के घूर्णन से प्रभावित होती हैं, जो गर्म पानी ले जाती हैं और तटीय जलवायु को प्रभावित करती हैं।', icon: '🌊' },
          { title: 'मौसम की भविष्यवाणी', content: 'मौसम विज्ञानियों को मौसम मॉडल में पृथ्वी के घूर्णन को शामिल करना चाहिए। यह प्रभावित करता है कि उच्च और निम्न दबाव प्रणालियां कैसे चलती और विकसित होती हैं।', icon: '🌤️' }
        ]
      },
      satellites: {
        title: 'उपग्रह और अंतरिक्ष',
        icon: '🛰️',
        description: 'पृथ्वी का घूर्णन उपग्रह प्रक्षेपण और कक्षाओं के लिए महत्वपूर्ण है। पूर्व की ओर प्रक्षेपण करने से पृथ्वी के घूर्णन से गति को बढ़ावा मिलता है।',
        facts: [
          { title: 'लॉन्च एडवांटेज', content: 'भूमध्य रेखा से पूर्व की ओर प्रक्षेपित रॉकेटों को पृथ्वी के घूर्णन से 1,670 किमी/घंटा की मुफ्त बढ़त मिलती है, जिससे महत्वपूर्ण ईंधन की बचत होती है।', icon: '🚀' },
          { title: 'भूस्थिर कक्षा', content: '35,786 किमी की ऊंचाई पर उपग्रह उसी दर से परिक्रमा करते हैं जिस दर से पृथ्वी घूमती है, जो स्थिर दिखाई देती है। टीवी और मौसम उपग्रहों के लिए उपयोग किया जाता है।', icon: '📺' },
          { title: 'आईएसएस ऑर्बिट', content: 'अंतर्राष्ट्रीय अंतरिक्ष स्टेशन हर 90 मिनट में पृथ्वी की परिक्रमा करता है, जिसमें प्रतिदिन 16 सूर्योदय और सूर्यास्त होते हैं।', icon: '🛸' },
          { title: 'अंतरिक्ष प्रक्षेपण स्थल', content: 'घूर्णन गति को अधिकतम करने के लिए प्रक्षेपण स्थल अक्सर भूमध्य रेखा (जैसे फ्रेंच गुयाना) के पास बनाए जाते हैं।', icon: '🏗️' }
        ]
      },
      'daily-life': {
        title: 'दैनिक जीवन',
        icon: '🌅',
        description: 'पृथ्वी का घूर्णन हमारी दैनिक दिनचर्या को आकार देता है, सूर्योदय और सूर्यास्त के समय से लेकर समय क्षेत्रों तक जो वैश्विक गतिविधियों का समन्वय करते हैं।',
        facts: [
          { title: 'समय क्षेत्र', content: 'दुनिया को 24 समय क्षेत्रों में विभाजित किया गया है क्योंकि पृथ्वी प्रति घंटे 15° घूमती है। यह दुनिया भर में समन्वित समय की अनुमति देता है।', icon: '🕐' },
          { title: 'जेट लैग', content: 'जब आप समय क्षेत्रों में यात्रा करते हैं, तो आपके शरीर की आंतरिक घड़ी स्थानीय समय के साथ तालमेल से बाहर हो जाती है। इसे समायोजित करने में प्रति क्षेत्र लगभग 1 दिन लगता है।', icon: '😴' },
          { title: 'व्यापार और संचार', content: 'वैश्विक व्यवसायों को समय क्षेत्रों में समन्वय करना चाहिए। जब न्यूयॉर्क में सुबह होती है, तो टोक्यो में शाम होती है।', icon: '💼' },
          { title: 'दिन की लंबाई भिन्नता', content: 'पृथ्वी के झुकाव के कारण, दिन की लंबाई मौसम और अक्षांश के अनुसार बदलती रहती है। ध्रुवों के पास, गर्मी 24 घंटे की रोशनी लाती है।', icon: '📅' }
        ]
      },
      sports: {
        title: 'खेल और गेम्स',
        icon: '⚽',
        description: 'पृथ्वी का घूर्णन लंबी दूरी के खेलों और खेलों को सूक्ष्म लेकिन मापनीय तरीकों से प्रभावित करता है, गोल्फ से लेकर बेसबॉल तक शूटिंग के खेल तक।',
        facts: [
          { title: 'लॉन्ग गोल्फ ड्राइव', content: 'पृथ्वी के घूर्णन के कारण 300 मीटर की गोल्फ ड्राइव लगभग 1 सेमी तक विक्षेपित हो सकती है। पेशेवर गोल्फर आमतौर पर इसकी भरपाई नहीं करते हैं।', icon: '⛳' },
          { title: 'बेसबॉल', content: 'न्यूयॉर्क से लॉस एंजिल्स में फेंकी गई बेसबॉल कोरिओलिस प्रभाव से लगभग 100 मीटर दाईं ओर विक्षेपित हो जाएगी।', icon: '⚾' },
          { title: 'ओलंपिक शूटिंग', content: 'ओलंपिक राइफल शूटिंग में, प्रतियोगियों को लंबी दूरी पर पृथ्वी के घूर्णन के लिए जिम्मेदार होना चाहिए। प्रभाव छोटा लेकिन मापनीय है।', icon: '🎯' },
          { title: 'फ़ुटबॉल और क्रिकेट', content: 'जबकि पृथ्वी का घूर्णन सामान्य पैमाने पर सॉकर या क्रिकेट को विशेष रूप से प्रभावित नहीं करता है, हवा के पैटर्न बाहरी खेलों को प्रभावित करते हैं।', icon: '🏏' }
        ]
      }
    },
    gu: {
      aviation: {
        title: 'ઉડ્ડયન અને ફ્લાઇટ ટાઇમ્સ',
        icon: '✈️',
        description: 'પૃથ્વીનું પરિભ્રમણ ફ્લાઇટના સમયને નોંધપાત્ર રીતે અસર કરે છે. પૂર્વ તરફ ઉડવું (પૃથ્વીના પરિભ્રમણ સાથે) સામાન્ય રીતે પરિભ્રમણ દ્વારા સર્જાયેલા જેટ સ્ટ્રીમ્સને કારણે પશ્ચિમ તરફ ઉડવા કરતાં ઝડપી હોય છે.',
        facts: [
          { title: 'પૂર્વ તરફની ફ્લાઇટ્સ વધુ ઝડપી છે', content: 'ન્યુ યોર્કથી લંડન (પૂર્વ તરફ) ની ફ્લાઇટમાં ડ લગભગ 7 કલાક લાગે છે, જ્યારે પરત ફરતી ફ્લાઇટમાં પ્રવર્તમાન પશ્ચિમી પવનોને કારણે લગભગ 8 કલાક લાગે છે.', icon: '⏱️' },
          { title: 'જેટ સ્ટ્રીમ્સ', content: 'જેટ સ્ટ્રીમ્સ 9-12 કિમીની ઉંચાઈએ ઝડપથી વહેતા હવાના પ્રવાહો છે, જે પૃથ્વીના પરિભ્રમણને કારણે પશ્ચિમથી પૂર્વ તરફ વહે છે. તેઓ 400 કિમી/કલાક સુધી પહોંચી શકે છે.', icon: '💨' },
          { title: 'બળતણ બચત', content: 'જેટ સ્ટ્રીમ્સનો લાભ લેતા રૂટનું આયોજન કરીને એરલાઇન્સ ઇંધણ ખર્ચમાં લાખો બચાવે છે. પૂર્વ તરફની ફ્લાઇટ્સ 10% સુધી ઇંધણ બચાવી શકે છે.', icon: '⛽' },
          { title: 'ગ્રેટ સર્કલ રૂટ્સ', content: 'પાયલોટ નકશા પર સીધી રેખાઓને બદલે વક્ર પાથ (ગ્રેટ સર્કલ) ઉડે છે. ગોળા પર વાસ્તવમાં આ સૌથી ટૂંકા માર્ગો છે.', icon: '🗺️' }
        ]
      },
      navigation: {
        title: 'નેવિગેશન અને GPS',
        icon: '🧭',
        description: 'આધુનિક નેવિગેશન સિસ્ટમ્સે પૃથ્વીના પરિભ્રમણને ધ્યાનમાં લેવું જોઈએ. ચોકસાઈ જાળવવા માટે GPS ઉપગ્રહો, જહાજો અને વિમાનો બધા પૃથ્વીના સ્પિન માટે વળતર આપે છે.',
        facts: [
          { title: 'GPS કરેક્શન', content: 'ચોક્કસ સ્થાન પ્રદાન કરવા માટે GPS ઉપગ્રહોએ પૃથ્વીના પરિભ્રમણને ધ્યાનમાં લેવું જોઈએ. સુધારા વિના, તમારું સ્થાન સેંકડો મીટર દૂર હશે.', icon: '📡' },
          { title: 'શિપ નેવિગેશન', content: 'મહાસાગરોને પાર કરતા જહાજોએ અભ્યાસક્રમો ઘડતી વખતે પૃથ્વીના પરિભ્રમણને ધ્યાનમાં લેવું જોઈએ. કોરિઓલિસ અસર જહાજોને લાંબા અંતર સુધી માર્ગથી દૂર ધકેલી શકે છે.', icon: '🚢' },
          { title: 'લશ્કરી ચોકસાઈ', content: 'લાંબા અંતરની મિસાઈલો અને આર્ટિલરીએ પૃથ્વીના પરિભ્રમણને ધ્યાનમાં લેવું જોઈએ. ઉત્તરીય ગોળાર્ધમાં ઉત્તર તરફ છોડવામાં આવેલો ગોળો થોડો જમણી બાજુએ ઉતરશે.', icon: '🎯' },
          { title: 'સર્વેક્ષણ', content: 'જમીન સર્વેક્ષકોએ મોટા અંતર પર ચોક્કસ માપન કરતી વખતે પૃથ્વીના પરિભ્રમણને ધ્યાનમાં લેવું જોઈએ.', icon: '📐' }
        ]
      },
      weather: {
        title: 'હવામાન પેટર્ન',
        icon: '🌪️',
        description: 'પૃથ્વીનું પરિભ્રમણ કોરિઓલિસ અસર બનાવે છે, જે વૈશ્વિક હવામાન પેટર્ન, સમુદ્રના પ્રવાહો અને વાવાઝોડાની સ્પિન દિશાને આકાર આપે છે.',
        facts: [
          { title: 'હરિકેન સ્પિન દિશા', content: 'કોરિઓલિસ અસરને કારણે ઉત્તરીય ગોળાર્ધમાં વાવાઝોડા ઘડિયાળની વિરુદ્ધ દિશામાં (counter-clockwise) અને દક્ષિણી ગોળાર્ધમાં ઘડિયાળની દિશામાં (clockwise) ફરે છે.', icon: '🌀' },
          { title: 'વેપારી પવન', content: 'સદીઓથી ખલાસીઓએ જે વિશ્વસનીય વેપારી પવનોનો ઉપયોગ કર્યો છે તે પૃથ્વીના પરિભ્રમણ દ્વારા વિષુવવૃત્ત તરફ જતી હવાને વાળવાથી બનાવવામાં આવે છે.', icon: '⛵' },
          { title: 'મહાસાગરના પ્રવાહો', content: 'ગલ્ફ સ્ટ્રીમ જેવા મુખ્ય મહાસાગરના પ્રવાહો પૃથ્વીના પરિભ્રમણથી પ્રભાવિત થાય છે, ગરમ પાણીનું વહન કરે છે અને દરિયાકાંઠાના આબોહવાને અસર કરે છે.', icon: '🌊' },
          { title: 'હવામાનની આગાહી', content: 'હવામાનશાસ્ત્રીઓએ હવામાન મોડેલોમાં પૃથ્વીના પરિભ્રમણને ધ્યાનમાં લેવું જોઈએ. ઉચ્ચ અને નીચા દબાણની સિસ્ટમો કેવી રીતે ફરે છે અને વિકાસ પામે છે તે આને અસર કરે છે.', icon: '🌤️' }
        ]
      },
      satellites: {
        title: 'ઉપગ્રહો અને અવકાશ',
        icon: '🛰️',
        description: 'ઉપગ્રહ પ્રક્ષેપણ અને ભ્રમણકક્ષા માટે પૃથ્વીનું પરિભ્રમણ મહત્વપૂર્ણ છે. પૂર્વ તરફ પ્રક્ષેપણ કરવાથી પૃથ્વીના પરિભ્રમણથી ગતિમાં વધારો થાય છે.',
        facts: [
          { title: 'લોન્ચ એડવાન્ટેજ', content: 'વિષુવવૃત્તથી પૂર્વ તરફ લોન્ચ કરાયેલા રોકેટને પૃથ્વીના પરિભ્રમણથી 1,670 કિમી/કલાકનો મફત વેગ મળે છે, જે નોંધપાત્ર બળતણ બચાવે છે.', icon: '🚀' },
          { title: 'જિયોસ્ટેશનરી ઓર્બિટ', content: '35,786 કિમીની ઉંચાઈ પરના ઉપગ્રહો પૃથ્વી જેટલા જ દરે પરિભ્રમણ કરે છે, જે સ્થિર દેખાય છે. ટીવી અને હવામાન ઉપગ્રહો માટે વપરાય છે.', icon: '📺' },
          { title: 'ISS ઓર્બિટ', content: 'ઇન્ટરનેશનલ સ્પેસ સ્ટેશન દર 90 મિનિટે પૃથ્વીની ભ્રમણકક્ષા કરે છે, દરરોજ 16 સૂર્યોદય અને સૂર્યાસ્તનો અનુભવ કરે છે.', icon: '🛸' },
          { title: 'સ્પેસ લોન્ચ સાઇટ્સ', content: 'પરિભ્રમણ ગતિ વધારવા માટે લોન્ચ સાઇટ્સ ઘણીવાર વિષુવવૃત્ત (જેમ કે ફ્રેન્ચ ગુયાના) ની નજીક બનાવવામાં આવે છે.', icon: '🏗️' }
        ]
      },
      'daily-life': {
        title: 'દૈનિક જીવન',
        icon: '🌅',
        description: 'પૃથ્વીનું પરિભ્રમણ આપણી દિનચર્યાઓને આકાર આપે છે, સૂર્યોદય અને સૂર્યાસ્તના સમયથી લઈને સમય ઝોન સુધી જે વૈશ્વિક પ્રવૃત્તિઓનું સંકલન કરે છે.',
        facts: [
          { title: 'સમય ઝોન', content: 'વિશ્વને 24 સમય ઝોનમાં વહેંચવામાં આવ્યું છે કારણ કે પૃથ્વી કલાક દીઠ 15° ફરે છે. આ સમગ્ર વિશ્વમાં સંકલિત સમય માટે પરવાનગી આપે છે.', icon: '🕐' },
          { title: 'જેટ લેગ', content: 'જ્યારે તમે સમય ઝોનમાં મુસાફરી કરો છો, ત્યારે તમારા શરીરની આંતરિક ઘડિયાળ સ્થાનિક સમય સાથે સુમેળની બહાર થઈ જાય છે. તેને સમાયોજિત કરવા માટે ઝોન દીઠ આશરે 1 દિવસ લાગે છે.', icon: '😴' },
          { title: 'વ્યાપાર અને સંચાર', content: 'વૈશ્વિક વ્યવસાયોએ સમય ઝોનમાં સંકલન કરવું જોઈએ. જ્યારે ન્યુ યોર્કમાં સવાર હોય છે, ત્યારે ટોક્યોમાં સાંજ હોય છે.', icon: '💼' },
          { title: 'દિવસની લંબાઈમાં ભિન્નતા', content: 'પૃથ્વીના નમવાને કારણે, દિવસની લંબાઈ ઋતુ અને અક્ષાંશ પ્રમાણે બદલાય છે. ધ્રુવો નજીક, ઉનાળો 24-કલાક પ્રકાશ લાવે છે.', icon: '📅' }
        ]
      },
      sports: {
        title: 'રમતો અને ગેમ્સ',
        icon: '⚽',
        description: 'પૃથ્વીનું પરિભ્રમણ લાંબા અંતરની રમતો અને રમતોને સૂક્ષ્મ પરંતુ માપી શકાય તેવા રીતે અસર કરે છે, ગોલ્ફથી બેઝબોલથી શૂટિંગ સ્પોર્ટ્સ સુધી.',
        facts: [
          { title: 'લોંગ ગોલ્ફ ડ્રાઈવ્સ', content: 'પૃથ્વીના પરિભ્રમણને કારણે 300-મીટરની ગોલ્ફ ડ્રાઈવ લગભગ 1 સેમી જેટલી વિચલિત થઈ શકે છે. પ્રોફેશનલ ગોલ્ફરો સામાન્ય રીતે વળતર આપતા નથી.', icon: '⛳' },
          { title: 'બેઝબોલ', content: 'ન્યુ યોર્કથી લોસ એન્જલસમાં ફેંકવામાં આવેલો બેઝબોલ કોરિઓલિસ અસરથી જમણી તરફ આશરે 100 મીટર વિચલિત થશે.', icon: '⚾' },
          { title: 'ઓલિમ્પિક શૂટિંગ', content: 'ઓલિમ્પિક રાઈફલ શૂટિંગમાં, સ્પર્ધકોએ લાંબા અંતર પર પૃથ્વીના પરિભ્રમણને ધ્યાનમાં લેવું જોઈએ. અસર નાની છે પરંતુ માપી શકાય તેવી છે.', icon: '🎯' },
          { title: 'સોકર અને ક્રિકેટ', content: 'જ્યારે પૃથ્વીનું પરિભ્રમણ સામાન્ય ભીંગડા પર સોકર અથવા ક્રિકેટને નોંધપાત્ર રીતે અસર કરતું નથી, પવનની પેટર્ન આઉટડોર રમતોને અસર કરે છે.', icon: '🏏' }
        ]
      }
    }
  };

  const topics = topicsData[language];

  const currentTopic = topics[activeTopic];

  const uiText = {
    en: {
      interactive: 'Interactive Demonstration',
      flightSim: 'Flight Time Simulator',
      selectDirection: 'Select Direction:',
      eastbound: '→ Eastbound (Faster)',
      westbound: '← Westbound (Slower)',
      newYork: 'New York',
      london: 'London',
      jetStream: 'Jet Stream',
      flying: '✈️ Flying...',
      startFlight: '🛫 Start Flight',
      fastFlight: '⚡ Fast Flight!',
      slowFlight: '🐢 Slower Flight',
      jetStreamHelp: 'Jet streams helped push the plane, saving ~1 hour!',
      jetStreamHinder: 'Flying against jet streams added ~1 hour to the trip.',
      hurricaneSpin: 'Hurricane Spin Direction',
      selectHemisphere: 'Select Hemisphere:',
      northern: 'Northern',
      southern: 'Southern',
      counterClockwise: '↺ Counter-Clockwise',
      clockwise: '↻ Clockwise',
      inThe: 'In the',
      hemisphereSpins: 'Hemisphere, hurricanes spin',
      dueToCoriolis: 'due to the Coriolis effect.',
      satelliteOrbits: 'Satellite Orbits',
      geostationary: 'Geostationary',
      iss: 'ISS',
      orbit24hr: '24 hr orbit',
      orbit90min: '90 min orbit',
      worldTimeZones: 'World Time Zones',
      didYouKnow: 'Did you know?',
      gpsCoriolis: 'GPS & Coriolis Correction',
      withoutCorrection: 'Without correction',
      withCorrection: 'With correction',
      gpsExplanation: "Earth's rotation causes moving objects to curve. GPS, missiles, and even long kicks must account for this Coriolis effect!",
      sportsRotation: "Sports & Earth's Rotation",
      golf: 'Golf',
      baseball: 'Baseball',
      shooting: 'Shooting',
      soccer: 'Soccer',
      golfEffect: '300m drive deflected ~1cm',
      baseballEffect: 'Home runs not affected noticeably',
      shootingEffect: 'Olympic shooters must compensate',
      soccerEffect: 'Wind patterns affect outdoor play',
      sportsConclusion: '🤔 The effect is real but usually too small to notice in most sports!',
      keyFacts: 'Key Facts',
      thinkAboutIt: 'Think About It',
      timeComparison: "When it's {t1} in {c1}, it's {t2} in {c2}!"
    },
    hi: {
      interactive: 'इंटरैक्टिव प्रदर्शन',
      flightSim: 'उड़ान समय सिम्युलेटर',
      selectDirection: 'दिशा चुनें:',
      eastbound: '→ पूर्व की ओर (तेज़)',
      westbound: '← पश्चिम की ओर (धीमा)',
      newYork: 'न्यूयॉर्क',
      london: 'लंदन',
      jetStream: 'जेट स्ट्रीम',
      flying: '✈️ उड़ रहा है...',
      startFlight: '🛫 उड़ान शुरू करें',
      fastFlight: '⚡ तेज़ उड़ान!',
      slowFlight: '🐢 धीमी उड़ान',
      jetStreamHelp: 'जेट धाराओं ने विमान को धक्का देने में मदद की, ~1 घंटे की बचत हुई!',
      jetStreamHinder: 'जेट धाराओं के खिलाफ उड़ान भरने से यात्रा में ~1 घंटा जुड़ गया।',
      hurricaneSpin: 'तूफान स्पिन दिशा',
      selectHemisphere: 'गोलार्ध चुनें:',
      northern: 'उत्तरी',
      southern: 'दक्षिणी',
      counterClockwise: '↺ वामावर्त (Counter-Clockwise)',
      clockwise: '↻ दक्षिणावर्त (Clockwise)',
      inThe: '',
      hemisphereSpins: 'गोलार्ध में, कोरिओलिस प्रभाव के कारण तूफान',
      dueToCoriolis: 'घूमते हैं।',
      satelliteOrbits: 'उपग्रह कक्षाएँ',
      geostationary: 'भूस्थिर',
      iss: 'आईएसएस',
      orbit24hr: '24 घंटे की कक्षा',
      orbit90min: '90 मिनट की कक्षा',
      worldTimeZones: 'विश्व समय क्षेत्र',
      didYouKnow: 'क्या आप जानते हैं?',
      gpsCoriolis: 'जीपीएस और कोरिओलिस सुधार',
      withoutCorrection: 'सुधार के बिना',
      withCorrection: 'सुधार के साथ',
      gpsExplanation: "पृथ्वी के घूर्णन के कारण चलती वस्तुएं मुड़ जाती हैं। जीपीएस, मिसाइलों और यहां तक कि लंबी किक को भी इस कोरिओलिस प्रभाव का हिसाब रखना चाहिए!",
      sportsRotation: "खेल और पृथ्वी का घूर्णन",
      golf: 'गोल्फ',
      baseball: 'बेसबॉल',
      shooting: 'शूटिंग',
      soccer: 'फुटबॉल',
      golfEffect: '300 मी ड्राइव ~1 सेमी विक्षेपित',
      baseballEffect: 'होम रन विशेष रूप से प्रभावित नहीं होते',
      shootingEffect: 'ओलंपिक निशानेबाजों को भरपाई करनी चाहिए',
      soccerEffect: 'हवा के पैटर्न बाहरी खेल को प्रभावित करते हैं',
      sportsConclusion: '🤔 प्रभाव वास्तविक है लेकिन आमतौर पर अधिकांश खेलों में नोटिस करने के लिए बहुत छोटा है!',
      keyFacts: 'मुख्य तथ्य',
      thinkAboutIt: 'इसके बारे में सोचो',
      timeComparison: "जब {c1} में {t1} है, तो {c2} में {t2} है!"
    },
    gu: {
      interactive: 'ઇન્ટરેક્ટિવ પ્રદર્શન',
      flightSim: 'ફ્લાઇટ ટાઇમ સિમ્યુલેટર',
      selectDirection: 'દિશા પસંદ કરો:',
      eastbound: '→ પૂર્વ તરફ (ઝડપી)',
      westbound: '← પશ્ચિમ તરફ (ધીમું)',
      newYork: 'ન્યુ યોર્ક',
      london: 'લંડન',
      jetStream: 'જેટ સ્ટ્રીમ',
      flying: '✈️ ઉડી રહ્યું છે...',
      startFlight: '🛫 ફ્લાઇટ શરૂ કરો',
      fastFlight: '⚡ ઝડપી ફ્લાઇટ!',
      slowFlight: '🐢 ધીમી ફ્લાઇટ',
      jetStreamHelp: 'જેટ સ્ટ્રીમ્સ વિમાનને ધકેલવામાં મદદ કરે છે, ~1 કલાક બચાવે છે!',
      jetStreamHinder: 'જેટ સ્ટ્રીમ્સ સામે ઉડવાથી મુસાફરીમાં ~1 કલાક ઉમેરાય છે.',
      hurricaneSpin: 'વાવાઝોડાની સ્પિન દિશા',
      selectHemisphere: 'ગોળાર્ધ પસંદ કરો:',
      northern: 'ઉત્તરીય',
      southern: 'દક્ષિણી',
      counterClockwise: '↺ ઘડિયાળની વિરુદ્ધ (Counter-Clockwise)',
      clockwise: '↻ ઘડિયાળની દિશામાં (Clockwise)',
      inThe: '',
      hemisphereSpins: 'ગોળાર્ધમાં, કોરિઓલિસ અસરને કારણે વાવાઝોડા',
      dueToCoriolis: 'ફરે છે.',
      satelliteOrbits: 'ઉપગ્રહ ભ્રમણકક્ષા',
      geostationary: 'ભૂસ્થિર',
      iss: 'ISS',
      orbit24hr: '24 કલાક ભ્રમણકક્ષા',
      orbit90min: '90 મિનિટ ભ્રમણકક્ષા',
      worldTimeZones: 'વિશ્વ સમય ઝોન',
      didYouKnow: 'શું તમે જાણો છો?',
      gpsCoriolis: 'GPS અને કોરિઓલિસ કરેક્શન',
      withoutCorrection: 'સુધારા વિના',
      withCorrection: 'સુધારા સાથે',
      gpsExplanation: "પૃથ્વીના પરિભ્રમણને કારણે ગતિશીલ વસ્તુઓ વળી જાય છે. GPS, મિસાઇલો અને લાંબી કિક્સ પણ આ કોરિઓલિસ અસરને ધ્યાનમાં લેવી જોઈએ!",
      sportsRotation: "રમતો અને પૃથ્વીનું પરિભ્રમણ",
      golf: 'ગોલ્ફ',
      baseball: 'બેઝબોલ',
      shooting: 'શૂટિંગ',
      soccer: 'સોકર',
      golfEffect: '300 મીટર ડ્રાઈવ ~1 સેમી વિચલિત',
      baseballEffect: 'હોમ રન ખાસ પ્રભાવિત થતા નથી',
      shootingEffect: 'ઓલિમ્પિક શૂટરોએ વળતર આપવું જોઈએ',
      soccerEffect: 'પવનની પેટર્ન આઉટડોર રમતને અસર કરે છે',
      sportsConclusion: '🤔 અસર વાસ્તવિક છે પરંતુ સામાન્ય રીતે મોટાભાગની રમતોમાં જોવા માટે ખૂબ નાની છે!',
      keyFacts: 'મુખ્ય તથ્યો',
      thinkAboutIt: 'આના વિશે વિચારો',
      timeComparison: "જ્યારે {c1} માં {t1} હોય, ત્યારે {c2} માં {t2} હોય છે!"
    }
  };

  const ut = uiText[language];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e8f5e9 0%, #e3f2fd 50%, #f3e5f5 100%)',
      fontFamily: '"Poppins", "Segoe UI", sans-serif',
      padding: 'clamp(10px, 3vw, 20px)'
    }}>
      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: 24, padding: '16px 0' }}>
        <h1 style={{
          fontSize: 'clamp(1.5rem, 5vw, 2.4rem)', fontWeight: 700,
          background: 'linear-gradient(135deg, #1565c0, #7b1fa2)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(8px, 2vw, 12px)',
          flexWrap: 'wrap', padding: '0 10px'
        }}>
          <span style={{ fontSize: '2.5rem' }}>🌍</span>
          {t('realWorld.title')}
        </h1>
        <p style={{ color: '#546e7a', marginTop: 8, fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)', padding: '0 10px' }}>
          {t('realWorld.subtitle')}
        </p>
      </header>

      {/* Topic Navigation */}
      <nav style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(4px, 1.5vw, 8px)', marginBottom: 'clamp(20px, 4vw, 30px)', flexWrap: 'wrap', padding: '0 clamp(4px, 2vw, 12px)' }}>
        {(Object.keys(topics) as RealWorldTopic[]).map(topic => (
          <button key={topic} onClick={() => setActiveTopic(topic)}
            style={{
              padding: 'clamp(10px, 2.5vw, 14px) clamp(14px, 3vw, 22px)',
              background: activeTopic === topic ? 'linear-gradient(135deg, #1976d2, #7b1fa2)' : '#ffffff',
              border: activeTopic === topic ? 'none' : '2px solid #e0e0e0',
              borderRadius: 25, color: activeTopic === topic ? '#fff' : '#546e7a',
              cursor: 'pointer', fontSize: 'clamp(0.75rem, 2vw, 0.95rem)', fontWeight: activeTopic === topic ? 600 : 500,
              transition: 'all 0.3s ease',
              boxShadow: activeTopic === topic ? '0 6px 20px rgba(25, 118, 210, 0.35)' : '0 2px 8px rgba(0,0,0,0.08)',
              display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.5vw, 10px)',
              minHeight: '44px',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent'
            }}>
            <span style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', flexShrink: 0 }}>{topics[topic].icon}</span>
            <span className="hidden sm:inline">{topics[topic].title.split(' ')[0]}</span>
          </button>
        ))}
      </nav>

      <main className="realworld-main-grid" style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr', gap: 'clamp(16px, 3vw, 24px)', padding: '0 clamp(8px, 2vw, 16px)', width: '100%' }}>
        {/* Interactive Demo Section */}
        <div style={{ background: '#ffffff', borderRadius: 'clamp(16px, 3vw, 24px)', padding: 'clamp(20px, 4vw, 28px)', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 12px)', marginBottom: 'clamp(16px, 3vw, 20px)', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', background: 'linear-gradient(135deg, #e3f2fd, #f3e5f5)', padding: 'clamp(8px, 2vw, 12px)', borderRadius: 'clamp(12px, 2vw, 16px)', flexShrink: 0 }}>{currentTopic.icon}</span>
            <div>
              <h2 style={{ fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', fontWeight: 700, color: '#1a237e', margin: 0 }}>{currentTopic.title}</h2>
              <p style={{ color: '#546e7a', margin: 'clamp(4px, 1vw, 4px) 0 0 0', fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}>{ut.interactive}</p>
            </div>
          </div>

          {/* Aviation Demo */}
          {activeTopic === 'aviation' && (
            <div style={{ background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)', borderRadius: 16, padding: 20 }}>
              <h3 style={{ color: '#1565c0', margin: '0 0 16px 0', fontSize: '1.1rem' }}>✈️ {ut.flightSim}</h3>

              <div style={{ marginBottom: 16 }}>
                <label style={{ color: '#37474f', fontWeight: 500, display: 'block', marginBottom: 8, fontSize: 'clamp(0.85rem, 2vw, 0.95rem)' }}>{ut.selectDirection}</label>
                <div style={{ display: 'flex', gap: 'clamp(8px, 2vw, 12px)', flexWrap: 'wrap' }}>
                  <button onClick={() => setFlightDirection('east')}
                    style={{
                      flex: 1, minWidth: '120px', padding: 'clamp(12px, 2.5vw, 16px)', background: flightDirection === 'east' ? '#1976d2' : '#fff',
                      border: `2px solid ${flightDirection === 'east' ? '#1976d2' : '#e0e0e0'}`, borderRadius: 10,
                      color: flightDirection === 'east' ? '#fff' : '#546e7a', fontWeight: 600, cursor: 'pointer',
                      fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', minHeight: '44px',
                      touchAction: 'manipulation',
                      WebkitTapHighlightColor: 'transparent',
                      transition: 'all 0.2s ease'
                    }}>
                    {ut.eastbound}
                  </button>
                  <button onClick={() => setFlightDirection('west')}
                    style={{
                      flex: 1, minWidth: '120px', padding: 'clamp(12px, 2.5vw, 16px)', background: flightDirection === 'west' ? '#1976d2' : '#fff',
                      border: `2px solid ${flightDirection === 'west' ? '#1976d2' : '#e0e0e0'}`, borderRadius: 10,
                      color: flightDirection === 'west' ? '#fff' : '#546e7a', fontWeight: 600, cursor: 'pointer',
                      fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', minHeight: '44px',
                      touchAction: 'manipulation',
                      WebkitTapHighlightColor: 'transparent',
                      transition: 'all 0.2s ease'
                    }}>
                    {ut.westbound}
                  </button>
                </div>
              </div>

              <div style={{ background: '#fff', borderRadius: 'clamp(10px, 2vw, 12px)', padding: 'clamp(16px, 3vw, 20px)', position: 'relative', overflow: 'hidden', marginBottom: 'clamp(12px, 2vw, 16px)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'clamp(16px, 3vw, 20px)', gap: 'clamp(8px, 2vw, 12px)' }}>
                  <div style={{ textAlign: 'center', flex: 1 }}><div style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>🗽</div><div style={{ fontWeight: 600, color: '#1a237e', fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>{ut.newYork}</div></div>
                  <div style={{ textAlign: 'center', flex: 1 }}><div style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>🏰</div><div style={{ fontWeight: 600, color: '#1a237e', fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>{ut.london}</div></div>
                </div>

                <div style={{ height: 'clamp(50px, 8vw, 60px)', background: 'linear-gradient(90deg, #e3f2fd, #bbdefb)', borderRadius: 'clamp(25px, 5vw, 30px)', position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(20px, 4vw, 30px)', opacity: 0.3, color: '#1565c0' }}>
                    {[...Array(5)].map((_, i) => <span key={i} style={{ fontSize: 'clamp(1rem, 2.5vw, 1.5rem)' }}>→</span>)}
                  </div>
                  <div style={{ position: 'absolute', top: 'clamp(-18px, -3vw, -20px)', left: '50%', transform: 'translateX(-50%)', fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)', color: '#1565c0', fontWeight: 500 }}>{ut.jetStream} →</div>
                  <div style={{
                    position: 'absolute', left: flightDirection === 'east' ? `${planePosition}%` : `${100 - planePosition}%`,
                    transform: `translateX(-50%) scaleX(${flightDirection === 'east' ? 1 : -1})`, fontSize: 'clamp(1.5rem, 3vw, 2rem)', transition: 'left 0.05s linear'
                  }}>✈️</div>
                </div>
              </div>

              <button onClick={simulateFlight} disabled={isAnimating}
                style={{
                  width: '100%', padding: 'clamp(12px, 2.5vw, 16px)', background: isAnimating ? '#bdbdbd' : 'linear-gradient(135deg, #43a047, #2e7d32)',
                  border: 'none', borderRadius: 12, color: '#fff', fontWeight: 600, fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', cursor: isAnimating ? 'default' : 'pointer',
                  boxShadow: isAnimating ? 'none' : '0 4px 15px rgba(46, 125, 50, 0.3)',
                  minHeight: '48px',
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'transparent',
                  transition: 'all 0.2s ease'
                }}>
                {isAnimating ? ut.flying : ut.startFlight}
              </button>

              {planePosition >= 100 && (
                <div style={{ marginTop: 16, padding: '14px 18px', background: flightDirection === 'east' ? '#e8f5e9' : '#fff3e0', borderRadius: 12, textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, color: flightDirection === 'east' ? '#2e7d32' : '#e65100', fontSize: '1.1rem' }}>
                    {flightDirection === 'east' ? ut.fastFlight : ut.slowFlight}
                  </div>
                  <div style={{ color: '#546e7a', marginTop: 4 }}>
                    {flightDirection === 'east' ? ut.jetStreamHelp : ut.jetStreamHinder}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Weather Demo */}
          {activeTopic === 'weather' && (
            <div style={{ background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)', borderRadius: 16, padding: 20 }}>
              <h3 style={{ color: '#2e7d32', margin: '0 0 16px 0', fontSize: '1.1rem' }}>🌀 {ut.hurricaneSpin}</h3>

              <div style={{ marginBottom: 16 }}>
                <label style={{ color: '#37474f', fontWeight: 500, display: 'block', marginBottom: 8, fontSize: 'clamp(0.85rem, 2vw, 0.95rem)' }}>{ut.selectHemisphere}</label>
                <div style={{ display: 'flex', gap: 'clamp(8px, 2vw, 12px)', flexWrap: 'wrap' }}>
                  <button onClick={() => setWeatherHemisphere('north')}
                    style={{
                      flex: 1, minWidth: '120px', padding: 'clamp(12px, 2.5vw, 16px)', background: weatherHemisphere === 'north' ? '#2e7d32' : '#fff',
                      border: `2px solid ${weatherHemisphere === 'north' ? '#2e7d32' : '#e0e0e0'}`, borderRadius: 10,
                      color: weatherHemisphere === 'north' ? '#fff' : '#546e7a', fontWeight: 600, cursor: 'pointer',
                      fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', minHeight: '44px',
                      touchAction: 'manipulation',
                      WebkitTapHighlightColor: 'transparent',
                      transition: 'all 0.2s ease'
                    }}>🌍 {ut.northern}</button>
                  <button onClick={() => setWeatherHemisphere('south')}
                    style={{
                      flex: 1, minWidth: '120px', padding: 'clamp(12px, 2.5vw, 16px)', background: weatherHemisphere === 'south' ? '#2e7d32' : '#fff',
                      border: `2px solid ${weatherHemisphere === 'south' ? '#2e7d32' : '#e0e0e0'}`, borderRadius: 10,
                      color: weatherHemisphere === 'south' ? '#fff' : '#546e7a', fontWeight: 600, cursor: 'pointer',
                      fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', minHeight: '44px',
                      touchAction: 'manipulation',
                      WebkitTapHighlightColor: 'transparent',
                      transition: 'all 0.2s ease'
                    }}>🌏 {ut.southern}</button>
                </div>
              </div>

              <div style={{ background: '#fff', borderRadius: 'clamp(12px, 2vw, 16px)', padding: 'clamp(20px, 4vw, 30px)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: 'clamp(120px, 25vw, 150px)', height: 'clamp(120px, 25vw, 150px)', borderRadius: '50%', background: 'radial-gradient(circle, #e3f2fd 0%, #1976d2 50%, #0d47a1 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', boxShadow: '0 8px 30px rgba(25, 118, 210, 0.3)'
                }}>
                  <div style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', animation: `spin${weatherHemisphere === 'north' ? 'CCW' : 'CW'} 3s linear infinite` }}>🌀</div>
                  <div style={{ position: 'absolute', width: 'clamp(16px, 3vw, 20px)', height: 'clamp(16px, 3vw, 20px)', background: '#fff', borderRadius: '50%' }} />
                </div>

                <div style={{ marginTop: 'clamp(16px, 3vw, 20px)', textAlign: 'center' }}>
                  <div style={{ fontSize: 'clamp(1rem, 2.5vw, 1.3rem)', fontWeight: 700, color: '#1565c0', marginBottom: 'clamp(6px, 1.5vw, 8px)' }}>
                    {weatherHemisphere === 'north' ? ut.counterClockwise : ut.clockwise}
                  </div>
                  <div style={{ color: '#546e7a', lineHeight: 1.6, fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>
                    {ut.inThe} {weatherHemisphere === 'north' ? ut.northern : ut.southern} {ut.hemisphereSpins} {weatherHemisphere === 'north' ? ut.counterClockwise : ut.clockwise} {ut.dueToCoriolis}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Satellites Demo */}
          {activeTopic === 'satellites' && (
            <div style={{ background: 'linear-gradient(135deg, #f3e5f5, #e1bee7)', borderRadius: 16, padding: 20 }}>
              <h3 style={{ color: '#7b1fa2', margin: '0 0 16px 0', fontSize: '1.1rem' }}>🛰️ {ut.satelliteOrbits}</h3>

              <div style={{ background: '#1a1a2e', borderRadius: 'clamp(12px, 2vw, 16px)', padding: 'clamp(20px, 4vw, 30px)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', minHeight: 'clamp(200px, 40vw, 250px)' }}>
                {[...Array(30)].map((_, i) => (
                  <div key={i} style={{ position: 'absolute', width: 2, height: 2, background: '#fff', borderRadius: '50%', left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: Math.random() * 0.8 + 0.2 }} />
                ))}

                <div style={{ width: 'clamp(60px, 12vw, 80px)', height: 'clamp(60px, 12vw, 80px)', borderRadius: '50%', background: 'linear-gradient(135deg, #4fc3f7 0%, #0288d1 50%, #01579b 100%)', boxShadow: '0 0 30px rgba(79, 195, 247, 0.4)', position: 'relative', zIndex: 2 }}>
                  <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'linear-gradient(to left, transparent 50%, rgba(0,0,0,0.5) 100%)' }} />
                </div>

                <div style={{ position: 'absolute', width: 'clamp(150px, 30vw, 200px)', height: 'clamp(150px, 30vw, 200px)', border: '2px dashed rgba(255,255,255,0.3)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', width: 'clamp(150px, 30vw, 200px)', height: 'clamp(150px, 30vw, 200px)', transform: `rotate(${satelliteOrbit}deg)` }}>
                  <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)' }}>🛰️</div>
                </div>

                <div style={{ position: 'absolute', width: 'clamp(100px, 20vw, 130px)', height: 'clamp(100px, 20vw, 130px)', border: '2px dashed rgba(255,200,0,0.4)', borderRadius: '50%', transform: 'rotate(30deg)' }} />
                <div style={{ position: 'absolute', width: 'clamp(100px, 20vw, 130px)', height: 'clamp(100px, 20vw, 130px)', transform: `rotate(${30 + satelliteOrbit * 3}deg)` }}>
                  <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', fontSize: 'clamp(1rem, 2vw, 1.2rem)' }}>🛸</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'clamp(10px, 2vw, 14px)', marginTop: 16 }}>
                <div style={{ background: '#fff', padding: 'clamp(10px, 2vw, 14px) clamp(12px, 2.5vw, 18px)', borderRadius: 10, textAlign: 'center' }}>
                  <div style={{ color: '#9e9e9e', fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)' }}>🛰️ {ut.geostationary}</div>
                  <div style={{ color: '#7b1fa2', fontWeight: 700, fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>35,786 km</div>
                  <div style={{ color: '#546e7a', fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)' }}>{ut.orbit24hr}</div>
                </div>
                <div style={{ background: '#fff', padding: 'clamp(10px, 2vw, 14px) clamp(12px, 2.5vw, 18px)', borderRadius: 10, textAlign: 'center' }}>
                  <div style={{ color: '#ffc107', fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)' }}>🛸 {ut.iss}</div>
                  <div style={{ color: '#7b1fa2', fontWeight: 700, fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>408 km</div>
                  <div style={{ color: '#546e7a', fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)' }}>{ut.orbit90min}</div>
                </div>
              </div>
            </div>
          )}

          {/* Daily Life Demo */}
          {activeTopic === 'daily-life' && (
            <div style={{ background: 'linear-gradient(135deg, #fff3e0, #ffe0b2)', borderRadius: 16, padding: 20 }}>
              <h3 style={{ color: '#e65100', margin: '0 0 16px 0', fontSize: '1.1rem' }}>🕐 {ut.worldTimeZones}</h3>

              <div style={{ background: '#fff', borderRadius: 12, padding: 20 }}>
                <div className="city-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(100px, 20vw, 140px), 1fr))', gap: 'clamp(8px, 2vw, 14px)' }}>
                  {cities.map((city, index) => (
                    <div key={city.name} onClick={() => setSelectedCity(index)}
                      style={{
                        padding: 'clamp(12px, 2.5vw, 16px)', background: selectedCity === index ? 'linear-gradient(135deg, #fff3e0, #ffe0b2)' : '#f5f5f5',
                        borderRadius: 12, cursor: 'pointer', textAlign: 'center', border: selectedCity === index ? '2px solid #ff9800' : '2px solid transparent', transition: 'all 0.3s ease',
                        minHeight: '120px',
                        touchAction: 'manipulation',
                        WebkitTapHighlightColor: 'transparent'
                      }}>
                      <div style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', marginBottom: 4 }}>
                        {index === 0 ? '🗽' : index === 1 ? '🏰' : index === 2 ? '🏜️' : index === 3 ? '🕌' : index === 4 ? '🗼' : '🦘'}
                      </div>
                      <div style={{ fontWeight: 700, color: '#1a237e', fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}>{city.name}</div>
                      <div style={{ fontFamily: 'monospace', fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)', fontWeight: 700, color: '#e65100', marginTop: 4 }}>{getTimeInCity(city.timezone)}</div>
                      <div style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.7rem)', color: '#9e9e9e' }}>UTC{city.timezone >= 0 ? '+' : ''}{city.timezone}</div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 16, padding: '14px 18px', background: '#e8f5e9', borderRadius: 10 }}>
                  <div style={{ fontWeight: 600, color: '#2e7d32', marginBottom: 4 }}>💡 {ut.didYouKnow}</div>
                  <div style={{ color: '#546e7a', fontSize: '0.9rem' }}>
                    {ut.timeComparison
                      .replace('{t1}', getTimeInCity(cities[selectedCity].timezone))
                      .replace('{c1}', cities[selectedCity].name)
                      .replace('{t2}', getTimeInCity(cities[(selectedCity + 3) % 6].timezone))
                      .replace('{c2}', cities[(selectedCity + 3) % 6].name)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Demo */}
          {activeTopic === 'navigation' && (
            <div style={{ background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)', borderRadius: 16, padding: 20 }}>
              <h3 style={{ color: '#1565c0', margin: '0 0 16px 0', fontSize: '1.1rem' }}>🧭 {ut.gpsCoriolis}</h3>

              <div style={{ background: '#fff', borderRadius: 12, padding: 20, textAlign: 'center' }}>
                <div style={{ width: 200, height: 200, margin: '0 auto 20px', borderRadius: '50%', background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)', position: 'relative', border: '3px solid #4caf50' }}>
                  <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'rgba(0,0,0,0.1)' }} />
                  <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(0,0,0,0.1)' }} />
                  <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '1.5rem' }}>🎯</div>
                  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                    <path d="M 100 180 Q 130 100, 115 65" fill="none" stroke="#f44336" strokeWidth="2" strokeDasharray="5,5" />
                    <path d="M 100 180 Q 90 100, 100 60" fill="none" stroke="#4caf50" strokeWidth="2" />
                  </svg>
                  <div style={{ position: 'absolute', bottom: '10%', left: '50%', transform: 'translateX(-50%)', fontSize: '1.5rem' }}>🚀</div>
                  <div style={{ position: 'absolute', top: '30%', right: '35%', fontSize: '0.8rem', color: '#f44336' }}>✗</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ width: 20, height: 3, background: '#f44336' }} /><span style={{ fontSize: '0.85rem', color: '#546e7a' }}>{ut.withoutCorrection}</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ width: 20, height: 3, background: '#4caf50' }} /><span style={{ fontSize: '0.85rem', color: '#546e7a' }}>{ut.withCorrection}</span></div>
                </div>

                <div style={{ padding: '14px', background: '#e3f2fd', borderRadius: 10, color: '#1565c0', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {ut.gpsExplanation}
                </div>
              </div>
            </div>
          )}

          {/* Sports Demo */}
          {activeTopic === 'sports' && (
            <div style={{ background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)', borderRadius: 16, padding: 20 }}>
              <h3 style={{ color: '#2e7d32', margin: '0 0 16px 0', fontSize: '1.1rem' }}>⚽ {ut.sportsRotation}</h3>

              <div style={{ background: '#fff', borderRadius: 12, padding: 20 }}>
                <div className="sports-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16 }}>
                  <div style={{ padding: 16, background: '#f1f8e9', borderRadius: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>⛳</div>
                    <div style={{ fontWeight: 700, color: '#33691e', marginBottom: 4 }}>{ut.golf}</div>
                    <div style={{ color: '#546e7a', fontSize: '0.85rem' }}>{ut.golfEffect}</div>
                  </div>
                  <div style={{ padding: 16, background: '#e3f2fd', borderRadius: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>⚾</div>
                    <div style={{ fontWeight: 700, color: '#1565c0', marginBottom: 4 }}>{ut.baseball}</div>
                    <div style={{ color: '#546e7a', fontSize: '0.85rem' }}>{ut.baseballEffect}</div>
                  </div>
                  <div style={{ padding: 16, background: '#fce4ec', borderRadius: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🎯</div>
                    <div style={{ fontWeight: 700, color: '#c2185b', marginBottom: 4 }}>{ut.shooting}</div>
                    <div style={{ color: '#546e7a', fontSize: '0.85rem' }}>{ut.shootingEffect}</div>
                  </div>
                  <div style={{ padding: 16, background: '#fff3e0', borderRadius: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>⚽</div>
                    <div style={{ fontWeight: 700, color: '#e65100', marginBottom: 4 }}>{ut.soccer}</div>
                    <div style={{ color: '#546e7a', fontSize: '0.85rem' }}>{ut.soccerEffect}</div>
                  </div>
                </div>

                <div style={{ marginTop: 16, padding: '14px', background: '#e8f5e9', borderRadius: 10, textAlign: 'center' }}>
                  <span style={{ color: '#2e7d32', fontWeight: 500 }}>{ut.sportsConclusion}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Facts Section */}
        <div style={{ background: '#ffffff', borderRadius: 'clamp(16px, 3vw, 24px)', padding: 'clamp(20px, 4vw, 28px)', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1a237e', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>📚 {ut.keyFacts}</h2>

          <p style={{ color: '#546e7a', lineHeight: 1.7, marginBottom: 24, padding: '16px', background: 'linear-gradient(135deg, #f5f5f5, #eeeeee)', borderRadius: 12 }}>
            {currentTopic.description}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {currentTopic.facts.map((fact, index) => (
              <div key={index} style={{ padding: '18px 20px', background: 'linear-gradient(135deg, #f8f9fa, #ffffff)', borderRadius: 14, borderLeft: '4px solid #1976d2', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: '1.5rem' }}>{fact.icon}</span>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#1a237e' }}>{fact.title}</h3>
                </div>
                <p style={{ margin: 0, color: '#546e7a', lineHeight: 1.7, fontSize: '0.95rem' }}>{fact.content}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24, padding: 20, background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)', borderRadius: 16 }}>
            <h3 style={{ color: '#2e7d32', margin: '0 0 12px 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 8 }}>💡 {ut.thinkAboutIt}</h3>
            <p style={{ color: '#37474f', margin: 0, lineHeight: 1.7 }}>
              {(() => {
                const thinkPrompts: Record<Language, Record<RealWorldTopic, string>> = {
                  en: {
                    aviation: 'Why do you think most major airports are built in the eastern parts of continents?',
                    navigation: 'How would GPS work differently if Earth rotated twice as fast?',
                    weather: 'Would hurricanes exist on a planet that doesn\'t rotate?',
                    satellites: 'Why are most rocket launch sites located near the equator?',
                    'daily-life': 'What would happen to time zones if Earth rotated in the opposite direction?',
                    sports: 'Would snipers need to adjust their aim more at the equator or near the poles?'
                  },
                  hi: {
                    aviation: 'आपको क्या लगता है कि अधिकांश प्रमुख हवाई अड्डे महाद्वीपों के पूर्वी हिस्सों में क्यों बने हैं?',
                    navigation: 'यदि पृथ्वी दोगुनी तेजी से घूमती तो जीपीएस कैसे अलग तरह से काम करता?',
                    weather: 'क्या उस ग्रह पर तूफान मौजूद होंगे जो घूर्णन नहीं करता है?',
                    satellites: 'अधिकांश रॉकेट प्रक्षेपण स्थल भूमध्य रेखा के पास क्यों स्थित हैं?',
                    'daily-life': 'यदि पृथ्वी विपरीत दिशा में घूमती तो समय क्षेत्रों का क्या होता?',
                    sports: 'क्या स्नाइपर्स को भूमध्य रेखा पर या ध्रुवों के पास अपना निशाना अधिक समायोजित करने की आवश्यकता होगी?'
                  },
                  gu: {
                    aviation: 'તમને કેમ લાગે છે કે મોટાભાગના મુખ્ય એરપોર્ટ ખંડોના પૂર્વીય ભાગોમાં બાંધવામાં આવ્યા છે?',
                    navigation: 'જો પૃથ્વી બમણી ઝડપે ફરતી હોત તો GPS કેવી રીતે અલગ રીતે કામ કરશે?',
                    weather: 'શું એવા ગ્રહ પર વાવાઝોડા હશે જે ફરતા નથી?',
                    satellites: 'શા માટે મોટાભાગના રોકેટ લોન્ચ સાઇટ્સ વિષુવવૃત્તની નજીક સ્થિત છે?',
                    'daily-life': 'જો પૃથ્વી વિરુદ્ધ દિશામાં ફરતી હોત તો સમય ઝોનનું શું થાત?',
                    sports: 'શું સ્નાઈપર્સે વિષુવવૃત્ત પર કે ધ્રુવોની નજીક તેમનો ઉદ્દેશ્ય વધુ સમાયોજિત કરવાની જરૂર પડશે?'
                  }
                };
                return thinkPrompts[language][activeTopic];
              })()}
            </p>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes spinCCW { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        @keyframes spinCW { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        /* Responsive Styles for Rotation Component */
        
        /* Base responsive utilities */
        @media (min-width: 1024px) {
          .learn-main-content {
            grid-template-columns: 1fr 380px !important;
          }
        }
        
        @media (max-width: 1023px) {
          .learn-main-content {
            grid-template-columns: 1fr !important;
          }
        }
        
        /* Mode title visibility on mobile */
        @media (max-width: 640px) {
          .mode-title {
            display: none;
          }
        }
        
        /* Earth visualization responsive sizing */
        @media (max-width: 768px) {
          .earth-container {
            width: 250px !important;
            height: 250px !important;
          }
        
          .sun-container {
            width: 70px !important;
            height: 70px !important;
          }
        
          .axis-line {
            height: 350px !important;
            top: -40px !important;
          }
        }
        
        @media (max-width: 480px) {
          .earth-container {
            width: 200px !important;
            height: 200px !important;
          }
        
          .sun-container {
            width: 60px !important;
            height: 60px !important;
            right: 10px !important;
          }
        
          .axis-line {
            height: 300px !important;
            top: -30px !important;
          }
        
          .direction-label {
            font-size: 0.7rem !important;
            padding: 3px 8px !important;
          }
        }
        
        /* Practice mode responsive grid */
        @media (max-width: 768px) {
          .quiz-results-grid {
            grid-template-columns: 1fr !important;
          }
        }
        
        /* Real World mode responsive grid */
        @media (min-width: 1024px) {
          .realworld-main-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        
        @media (max-width: 1023px) {
          .realworld-main-grid {
            grid-template-columns: 1fr !important;
          }
        
          .city-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        
          .sports-grid {
            grid-template-columns: 1fr !important;
          }
        }
        
        @media (max-width: 480px) {
          .city-grid {
            grid-template-columns: 1fr !important;
          }
        }
        
        /* Button hover effects - disable on touch devices */
        @media (hover: hover) {
          button:hover:not(:disabled) {
            transform: translateY(-2px);
            filter: brightness(1.05);
          }
        }
        
        button:active:not(:disabled) {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

// ============================================================================
// Main RotationLearning Component (Router)
// ============================================================================
interface RotationLearningProps {
  mode: "learn" | "practice" | "applications";
  setMode: (mode: "learn" | "practice" | "applications") => void;
}

const RotationLearning: React.FC<RotationLearningProps> = ({
  mode,
  setMode,
}) => {
  return (
    <>
      <Navbar mode={mode} setMode={setMode} />
      <div className="pt-14 sm:pt-16 md:pt-18 px-2 xs:px-3 sm:px-4 md:px-5 lg:px-6 xl:px-8 pb-4 sm:pb-6 md:pb-8 overflow-x-hidden">
        {mode === "learn" && <RotationLearnMode />}
        {mode === "practice" && <RotationPracticeMode />}
        {mode === "applications" && <RotationRealWorld />}
      </div>
    </>
  );
};

// Export as named exports
export { RotationLearnMode, RotationPracticeMode, RotationRealWorld };

// Default export for main component
export default RotationLearning;
