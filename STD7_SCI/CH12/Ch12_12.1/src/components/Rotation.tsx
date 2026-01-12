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
    title: string;
    subtitle: string;
    whatIsIt: string;
    realLifeExample: string;
    previous: string;
    autoPlay: string;
    pause: string;
    next: string;
    startOver: string;
    phases: Record<string, {
      title: string;
      simple: string[];
      example: string[];
    }>;
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
      title: "The Water Cycle",
      subtitle:
        "Learn how water moves around our planet in a continuous cycle!",
      whatIsIt: "What is it?",
      realLifeExample: "Real-Life Example",
      previous: "Previous",
      autoPlay: "Auto Play",
      pause: "Pause",
      next: "Next",
      startOver: "Start Over",
      phases: {},
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
      perfect: "Perfect! You're a Water Cycle expert!",
      excellent: "Excellent work! You understand the water cycle well!",
      goodJob: "Good job! Keep learning about the water cycle!",
      keepPracticing: "Keep practicing! Review the water cycle concepts.",
      tryAgain: "Try Again",
      questions: [],
    },
    realWorld: {
      title: "Real World",
      subtitle:
        "Discover how heat transfer and water cycle concepts are applied in real life",
      overview: "Overview",
      keyFeatures: "Key Features",
      impact: "Impact",
      location: "Location",
      realWorldImpact: "Real-World Impact",
      connection: "Connection to Water Cycle & Heat Transfer",
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
      title: "जल चक्र",
      subtitle:
        "जानें कि पानी हमारे ग्रह के चारों ओर एक निरंतर चक्र में कैसे चलता है!",
      whatIsIt: "यह क्या है?",
      realLifeExample: "वास्तविक जीवन का उदाहरण",
      previous: "पिछला",
      autoPlay: "ऑटो प्ले",
      pause: "रोकें",
      next: "अगला",
      startOver: "शुरू करें",
      phases: {},
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
      perfect: "बिल्कुल सही! आप जल चक्र के विशेषज्ञ हैं!",
      excellent: "उत्कृष्ट कार्य! आप जल चक्र को अच्छी तरह समझते हैं!",
      goodJob: "अच्छा काम! जल चक्र के बारे में सीखना जारी रखें!",
      keepPracticing: "अभ्यास जारी रखें! जल चक्र की अवधारणाओं की समीक्षा करें।",
      tryAgain: "फिर से कोशिश करें",
      questions: [],
    },
    realWorld: {
      title: "वास्तविक दुनिया",
      subtitle:
        "खोजें कि ऊष्मा स्थानांतरण और जल चक्र की अवधारणाएं वास्तविक जीवन में कैसे लागू होती हैं",
      overview: "अवलोकन",
      keyFeatures: "मुख्य विशेषताएं",
      impact: "प्रभाव",
      location: "स्थान",
      realWorldImpact: "वास्तविक दुनिया का प्रभाव",
      connection: "जल चक्र और ऊष्मा स्थानांतरण से संबंध",
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
      title: "જળ ચક્ર",
      subtitle: "જાણો કે પાણી આપણા ગ્રહની આસપાસ સતત ચક્રમાં કેવી રીતે ફરે છે!",
      whatIsIt: "આ શું છે?",
      realLifeExample: "વાસ્તવિક જીવનનું ઉદાહરણ",
      previous: "પહેલાનું",
      autoPlay: "ઓટો પ્લે",
      pause: "રોકો",
      next: "આગળ",
      startOver: "ફરી શરૂ કરો",
      phases: {},
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
      perfect: "સંપૂર્ણ! તમે જળ ચક્રના નિષ્ણાત છો!",
      excellent: "ઉત્કૃષ્ટ કાર્ય! તમે જળ ચક્રને સારી રીતે સમજો છો!",
      goodJob: "સારું કામ! જળ ચક્ર વિશે શીખવાનું ચાલુ રાખો!",
      keepPracticing: "પ્રેક્ટિસ ચાલુ રાખો! જળ ચક્રની વિભાવનાઓની સમીક્ષા કરો.",
      tryAgain: "ફરી પ્રયાસ કરો",
      questions: [],
    },
    realWorld: {
      title: "વાસ્તવિક વિશ્વ",
      subtitle:
        "શોધો કે ઉષ્મા સ્થાનાંતરણ અને જળ ચક્રની વિભાવનાઓ વાસ્તવિક જીવનમાં કેવી રીતે લાગુ થાય છે",
      overview: "સંખ્યાત્મક",
      keyFeatures: "મુખ્ય લક્ષણો",
      impact: "પ્રભાવ",
      location: "સ્થાન",
      realWorldImpact: "વાસ્તવિક વિશ્વનો પ્રભાવ",
      connection: "જળ ચક્ર અને ઉષ્મા સ્થાનાંતરણ સાથે જોડાણ",
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
  const initialLanguage = (i18n.language?.split("-")[0] as Language) || "en";
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
        className="appearance-none bg-white border-2 border-teal-500 rounded-lg px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 pr-6 sm:pr-8 w-40 sm:w-48 md:w-56 text-xs sm:text-sm md:text-base text-teal-700 font-medium cursor-pointer hover:border-purple-500 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-300"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 sm:px-2">
        <svg
          className="fill-current h-3 w-3 sm:h-4 sm:w-4 text-teal-500"
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
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex-shrink-0 flex items-center gap-1 sm:gap-2">
            <Globe
              className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600"
              aria-hidden="true"
            />
            <span className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent">
              {t("nav.logo")}
            </span>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              type="button"
              onClick={() => setMode("learn")}
              className={`px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                isLearn
                  ? "bg-teal-500 text-white shadow-md"
                  : "text-teal-700 hover:bg-teal-100/50"
              }`}
            >
              <span className="hidden sm:inline">📚 </span>
              <span className="sm:hidden">📚</span>
              <span className="hidden md:inline ml-1">
                {t("nav.tabs.learn")}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMode("practice")}
              className={`px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                isPractice
                  ? "bg-purple-500 text-white shadow-md"
                  : "text-purple-700 hover:bg-purple-100/50"
              }`}
            >
              <span className="hidden sm:inline">🎯 </span>
              <span className="sm:hidden">🎯</span>
              <span className="hidden md:inline ml-1">
                {t("nav.tabs.practice")}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMode("applications")}
              className={`px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                isApplications
                  ? "bg-gradient-to-r from-teal-500 to-purple-500 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100/50"
              }`}
            >
              <span className="hidden sm:inline">🌍 </span>
              <span className="sm:hidden">🌍</span>
              <span className="hidden lg:inline ml-1">
                {t("nav.tabs.applications")}
              </span>
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

  const modeInfo: Record<LearningMode, { title: string; description: string; icon: string }> = {
    explore: {
      title: 'Explore Earth\'s Rotation',
      description: 'Earth rotates on its axis once every 24 hours, spinning from west to east at about 1,670 km/h at the equator. This rotation is what gives us our day and night cycle.',
      icon: '🔭'
    },
    daynight: {
      title: 'Day & Night Cycle',
      description: 'As Earth rotates, different parts face the Sun creating day, while the opposite side experiences night. The boundary between day and night is called the terminator.',
      icon: '🌓'
    },
    timezones: {
      title: 'Time Zones',
      description: 'Earth is divided into 24 time zones. Each zone represents 15° of longitude, or 1 hour of time difference. Click on any city marker to see its local time!',
      icon: '🕐'
    },
    seasons: {
      title: 'Axis Tilt & Seasons',
      description: 'Earth\'s axis is tilted 23.5° from vertical. This tilt, combined with Earth\'s orbit around the Sun, creates the four seasons we experience throughout the year.',
      icon: '🍂'
    },
    effects: {
      title: 'Effects of Rotation',
      description: 'Earth\'s rotation causes many phenomena including the Coriolis effect which deflects winds and ocean currents, the bulging of Earth at the equator, and the apparent motion of stars.',
      icon: '🌀'
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e8f5e9 0%, #e3f2fd 50%, #f3e5f5 100%)',
      fontFamily: '"Poppins", "Segoe UI", sans-serif',
      color: '#1a365d',
      padding: 20
    }}>
      {/* Header */}
      <header style={{
        textAlign: 'center',
        marginBottom: 24,
        padding: '20px 0'
      }}>
        <h1 style={{
          fontSize: '2.8rem',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #1565c0, #7b1fa2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16
        }}>
          <span style={{ fontSize: '3rem' }}>🌍</span>
          Rotation of the Earth
        </h1>
        <p style={{ 
          color: '#546e7a', 
          marginTop: 8,
          fontSize: '1.15rem',
          fontWeight: 400
        }}>
          Interactive Science Learning Experience
        </p>
      </header>

      {/* Mode Navigation */}
      <nav style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 30,
        flexWrap: 'wrap',
        padding: '0 20px'
      }}>
        {(Object.keys(modeInfo) as LearningMode[]).map(mode => (
          <button
            key={mode}
            onClick={() => setActiveMode(mode)}
            style={{
              padding: '12px 22px',
              background: activeMode === mode 
                ? 'linear-gradient(135deg, #1976d2, #7b1fa2)' 
                : '#ffffff',
              border: activeMode === mode 
                ? 'none' 
                : '2px solid #e0e0e0',
              borderRadius: 30,
              color: activeMode === mode ? '#fff' : '#546e7a',
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontWeight: activeMode === mode ? 600 : 500,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: activeMode === mode 
                ? '0 6px 20px rgba(25, 118, 210, 0.35)' 
                : '0 2px 8px rgba(0,0,0,0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>{modeInfo[mode].icon}</span>
            {modeInfo[mode].title.split(' ').slice(0, 2).join(' ')}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main style={{
        display: 'grid',
        gridTemplateColumns: '1fr 380px',
        gap: 30,
        maxWidth: 1400,
        margin: '0 auto'
      }}>
        {/* Earth Visualization Area */}
        <div style={{
          background: '#ffffff',
          borderRadius: 24,
          padding: 40,
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          minHeight: 520
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
              <div style={{
                width: 100,
                height: 100,
                background: 'radial-gradient(circle, #fff9c4 0%, #ffeb3b 30%, #ffa000 70%, #ff6f00 100%)',
                borderRadius: '50%',
                boxShadow: '0 0 50px 15px rgba(255, 193, 7, 0.4), 0 0 100px 30px rgba(255, 152, 0, 0.2)',
                animation: 'sunPulse 3s ease-in-out infinite'
              }} />
              {showLabels && (
                <span style={{
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#f57c00',
                  background: 'rgba(255, 243, 224, 0.9)',
                  padding: '4px 12px',
                  borderRadius: 12
                }}>☀️ Sun</span>
              )}
            </div>

            {/* Sun rays */}
            <div style={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 300,
              height: 300,
              background: 'radial-gradient(ellipse at right, rgba(255, 235, 59, 0.15) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />

            {/* Earth Container */}
            <div style={{
              position: 'relative',
              width: 320,
              height: 320,
              marginRight: 80
            }}>
              {/* Axis line */}
              <div style={{
                position: 'absolute',
                left: '50%',
                top: -50,
                width: 4,
                height: 420,
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
                  top: -70,
                  left: '50%',
                  transform: `translateX(-50%) rotate(${activeMode === 'seasons' ? 23.5 : 0}deg)`,
                  transformOrigin: 'center 230px',
                  transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#7b1fa2',
                  background: '#f3e5f5',
                  padding: '4px 10px',
                  borderRadius: 8,
                  whiteSpace: 'nowrap'
                }}>
                  🧭 North Pole
                </div>
              )}

              {/* South Pole Label */}
              {showLabels && (
                <div style={{
                  position: 'absolute',
                  bottom: -70,
                  left: '50%',
                  transform: `translateX(-50%) rotate(${activeMode === 'seasons' ? 23.5 : 0}deg)`,
                  transformOrigin: 'center -110px',
                  transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#7b1fa2',
                  background: '#f3e5f5',
                  padding: '4px 10px',
                  borderRadius: 8,
                  whiteSpace: 'nowrap'
                }}>
                  🧭 South Pole
                </div>
              )}

              {/* West Label */}
              {showLabels && (
                <div style={{
                  position: 'absolute',
                  left: -80,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#546e7a',
                  background: '#ffffff',
                  padding: '4px 10px',
                  borderRadius: 8,
                  whiteSpace: 'nowrap',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  West
                </div>
              )}

              {/* East Label */}
              {showLabels && (
                <div style={{
                  position: 'absolute',
                  right: -80,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#546e7a',
                  background: '#ffffff',
                  padding: '4px 10px',
                  borderRadius: 8,
                  whiteSpace: 'nowrap',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  East
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
                    <div style={{ fontSize: '0.75rem', color: '#bf360c' }}>Axis Tilt</div>
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
                  right: 150,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  textAlign: 'center',
                  animation: 'fadeIn 0.5s ease',
                  background: 'linear-gradient(135deg, #fff8e1, #ffecb3)',
                  padding: '16px 20px',
                  borderRadius: 16,
                  boxShadow: '0 4px 20px rgba(255, 152, 0, 0.2)'
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 4 }}>☀️</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#e65100' }}>DAY</div>
                  <div style={{ fontSize: '0.85rem', color: '#f57c00', marginTop: 2 }}>Facing the Sun</div>
                </div>
                <div style={{
                  position: 'absolute',
                  left: 30,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  textAlign: 'center',
                  animation: 'fadeIn 0.5s ease 0.2s both',
                  background: 'linear-gradient(135deg, #e8eaf6, #c5cae9)',
                  padding: '16px 20px',
                  borderRadius: 16,
                  boxShadow: '0 4px 20px rgba(63, 81, 181, 0.2)'
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 4 }}>🌙</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#283593' }}>NIGHT</div>
                  <div style={{ fontSize: '0.85rem', color: '#3949ab', marginTop: 2 }}>Away from Sun</div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Info Panel */}
        <aside style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 20
        }}>
          {/* Mode Info Card */}
          <div style={{
            background: '#ffffff',
            borderRadius: 20,
            padding: 24,
            boxShadow: '0 8px 30px rgba(0,0,0,0.08)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 16
            }}>
              <span style={{ 
                fontSize: '2.5rem',
                background: 'linear-gradient(135deg, #e3f2fd, #f3e5f5)',
                padding: 12,
                borderRadius: 16
              }}>{modeInfo[activeMode].icon}</span>
              <h2 style={{
                fontSize: '1.35rem',
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
              fontSize: '1rem',
              margin: 0
            }}>
              {modeInfo[activeMode].description}
            </p>
          </div>

          {/* Controls Card */}
          <div style={{
            background: '#ffffff',
            borderRadius: 20,
            padding: 24,
            boxShadow: '0 8px 30px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              marginBottom: 18,
              color: '#1a237e',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <span>🎮</span> Controls
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => setIsRotating(!isRotating)}
                  style={{
                    flex: 1,
                    padding: '14px 20px',
                    background: isRotating 
                      ? 'linear-gradient(135deg, #ef5350, #e53935)' 
                      : 'linear-gradient(135deg, #66bb6a, #43a047)',
                    border: 'none',
                    borderRadius: 14,
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    transition: 'all 0.3s ease',
                    boxShadow: isRotating 
                      ? '0 6px 20px rgba(229, 57, 53, 0.3)' 
                      : '0 6px 20px rgba(67, 160, 71, 0.3)'
                  }}
                >
                  {isRotating ? '⏸️ Pause' : '▶️ Play'}
                </button>
                <button
                  onClick={() => setShowLabels(!showLabels)}
                  style={{
                    padding: '14px 18px',
                    background: showLabels 
                      ? 'linear-gradient(135deg, #42a5f5, #1e88e5)' 
                      : '#f5f5f5',
                    border: showLabels ? 'none' : '2px solid #e0e0e0',
                    borderRadius: 14,
                    color: showLabels ? '#fff' : '#757575',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    transition: 'all 0.3s ease'
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
                  <span style={{ fontSize: '0.9rem', color: '#546e7a', fontWeight: 500 }}>
                    Rotation Speed
                  </span>
                  <span style={{ 
                    fontSize: '0.9rem', 
                    fontWeight: 700,
                    color: '#1976d2',
                    background: '#e3f2fd',
                    padding: '2px 10px',
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
                    height: 8,
                    borderRadius: 4,
                    background: 'linear-gradient(90deg, #1976d2, #7b1fa2)',
                    cursor: 'pointer',
                    appearance: 'none',
                    outline: 'none'
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
              <span>📊</span> Key Facts
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Rotation Period', value: '23h 56m 4s', icon: '⏱️', color: '#1565c0' },
                { label: 'Equatorial Speed', value: '1,670 km/h', icon: '💨', color: '#00897b' },
                { label: 'Axis Tilt', value: '23.5°', icon: '📐', color: '#e65100' },
                { label: 'Time Zones', value: '24', icon: '🌐', color: '#7b1fa2' }
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
                <span>🌀</span> Effects of Earth's Rotation
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { title: 'Coriolis Effect', desc: 'Deflects winds and ocean currents, creating weather patterns', emoji: '🌪️' },
                  { title: 'Equatorial Bulge', desc: 'Earth is 43 km wider at equator due to centrifugal force', emoji: '🥚' },
                  { title: 'Tidal Forces', desc: 'Combined with Moon\'s gravity, creates ocean tides', emoji: '🌊' },
                  { title: 'Star Trails', desc: 'Stars appear to move in circles around celestial poles', emoji: '✨' }
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
                  { label: 'Local Time', value: getTimeAtLocation(selectedLocation.offset) },
                  { label: 'Timezone', value: selectedLocation.timezone },
                  { label: 'UTC Offset', value: `${selectedLocation.offset >= 0 ? '+' : ''}${selectedLocation.offset}h` },
                  { label: 'Status', value: isDayTime(selectedLocation.angle) ? '☀️ Daytime' : '🌙 Nighttime' }
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
      <style dangerouslySetInnerHTML={{__html: `
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [streak, setStreak] = useState(0);

  const allQuestions: Question[] = [
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
  ];

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
    
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e8f5e9 0%, #e3f2fd 50%, #f3e5f5 100%)',
        fontFamily: '"Poppins", sans-serif',
        padding: 30
      }}>
        <div style={{
          maxWidth: 800,
          margin: '0 auto',
          background: '#fff',
          borderRadius: 24,
          padding: 40,
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <div style={{ fontSize: '4rem', marginBottom: 16 }}>
              {score >= 80 ? '🏆' : score >= 60 ? '🌟' : score >= 40 ? '💪' : '📚'}
            </div>
            <h1 style={{
              fontSize: '2.2rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #1565c0, #7b1fa2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Quiz Completed!
            </h1>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 30 }}>
            <div style={{ background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)', padding: 24, borderRadius: 16, textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#1565c0' }}>{score}%</div>
              <div style={{ color: '#546e7a', fontWeight: 500 }}>Score</div>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)', padding: 24, borderRadius: 16, textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#2e7d32' }}>
                {results.filter(r => r.isCorrect).length}/{results.length}
              </div>
              <div style={{ color: '#546e7a', fontWeight: 500 }}>Correct</div>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #f3e5f5, #e1bee7)', padding: 24, borderRadius: 16, textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#7b1fa2' }}>
                {Math.floor(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, '0')}
              </div>
              <div style={{ color: '#546e7a', fontWeight: 500 }}>Time</div>
            </div>
          </div>

          <div style={{ marginBottom: 30 }}>
            <h3 style={{ color: '#1a237e', marginBottom: 16 }}>📊 Question Review</h3>
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
            width: '100%', padding: '16px 32px',
            background: 'linear-gradient(135deg, #1976d2, #7b1fa2)',
            border: 'none', borderRadius: 14, color: '#fff', fontSize: '1.1rem',
            fontWeight: 600, cursor: 'pointer', boxShadow: '0 6px 20px rgba(25, 118, 210, 0.3)'
          }}>
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e8f5e9 0%, #e3f2fd 50%, #f3e5f5 100%)',
      fontFamily: '"Poppins", sans-serif',
      padding: 20
    }}>
      <main style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Question Card */}
        <div style={{ background: '#fff', borderRadius: 24, padding: 32, boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
          {/* Progress */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ color: '#546e7a', fontWeight: 500 }}>
                Question {currentQuestionIndex + 1} of {filteredQuestions.length}
              </span>
            </div>
            <div style={{ height: 8, background: '#e0e0e0', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${((currentQuestionIndex + 1) / filteredQuestions.length) * 100}%`,
                background: 'linear-gradient(90deg, #1976d2, #7b1fa2)', borderRadius: 4, transition: 'width 0.5s ease'
              }} />
            </div>
          </div>

          {/* Question */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <span style={{ fontSize: '1.5rem', background: 'linear-gradient(135deg, #e3f2fd, #f3e5f5)', padding: '8px 12px', borderRadius: 12 }}>
                ❓
              </span>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 600, color: '#1a237e', margin: 0, lineHeight: 1.5 }}>
                {currentQuestion?.question}
              </h2>
            </div>
          </div>

          {/* Answer Options */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {currentQuestion?.options?.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = showResult && index === currentQuestion.correctAnswer;
                const isWrong = showResult && isSelected && index !== currentQuestion.correctAnswer;
                
                return (
                  <button key={index} onClick={() => !showResult && setSelectedAnswer(index)} disabled={showResult}
                    style={{
                      padding: '16px 20px',
                      background: isCorrect ? 'linear-gradient(135deg, #e8f5e9, #c8e6c9)' 
                        : isWrong ? 'linear-gradient(135deg, #ffebee, #ffcdd2)'
                        : isSelected ? 'linear-gradient(135deg, #e3f2fd, #bbdefb)' : '#f5f5f5',
                      border: `2px solid ${isCorrect ? '#4caf50' : isWrong ? '#f44336' : isSelected ? '#1976d2' : 'transparent'}`,
                      borderRadius: 14, cursor: showResult ? 'default' : 'pointer', textAlign: 'left',
                      fontSize: '1rem', fontWeight: 500, color: '#37474f', display: 'flex', alignItems: 'center', gap: 12
                    }}>
                    <span style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: isCorrect ? '#4caf50' : isWrong ? '#f44336' : isSelected ? '#1976d2' : '#e0e0e0',
                      color: (isSelected || isCorrect || isWrong) ? '#fff' : '#757575',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600
                    }}>
                      {isCorrect ? '✓' : isWrong ? '✗' : String.fromCharCode(65 + index)}
                    </span>
                    {option}
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
                  {results[results.length - 1]?.isCorrect ? 'Correct!' : 'Not quite right'}
                </h3>
              </div>
              <p style={{ margin: 0, color: '#546e7a', lineHeight: 1.7 }}>{currentQuestion?.explanation}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 12 }}>
            {!showResult ? (
              <button onClick={handleSubmit}
                disabled={selectedAnswer === null}
                style={{
                  flex: 1, padding: '16px 32px', background: 'linear-gradient(135deg, #1976d2, #7b1fa2)',
                  border: 'none', borderRadius: 14, color: '#fff', fontSize: '1.05rem', fontWeight: 600, cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(25, 118, 210, 0.3)',
                  opacity: selectedAnswer === null ? 0.5 : 1
                }}>✓ Check Answer</button>
            ) : (
              <button onClick={handleNext} style={{
                flex: 1, padding: '16px 32px', background: 'linear-gradient(135deg, #43a047, #2e7d32)',
                border: 'none', borderRadius: 14, color: '#fff', fontSize: '1.05rem', fontWeight: 600, cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(46, 125, 50, 0.3)'
              }}>
                {currentQuestionIndex < filteredQuestions.length - 1 ? '→ Next Question' : '🏁 See Results'}
              </button>
            )}
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
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
  const [activeTopic, setActiveTopic] = useState<RealWorldTopic>('aviation');
  const [flightDirection, setFlightDirection] = useState<'east' | 'west'>('east');
  const [planePosition, setPlanePosition] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [weatherHemisphere, setWeatherHemisphere] = useState<'north' | 'south'>('north');
  const [satelliteOrbit, setSatelliteOrbit] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedCity, setSelectedCity] = useState(0);
  const animationRef = useRef<number | undefined>(undefined);

  const cities = [
    { name: 'New York', timezone: -5, country: 'USA' },
    { name: 'London', timezone: 0, country: 'UK' },
    { name: 'Dubai', timezone: 4, country: 'UAE' },
    { name: 'Mumbai', timezone: 5.5, country: 'India' },
    { name: 'Tokyo', timezone: 9, country: 'Japan' },
    { name: 'Sydney', timezone: 11, country: 'Australia' }
  ];

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

  const topics: Record<RealWorldTopic, TopicContent> = {
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
  };

  const currentTopic = topics[activeTopic];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e8f5e9 0%, #e3f2fd 50%, #f3e5f5 100%)',
      fontFamily: '"Poppins", "Segoe UI", sans-serif',
      padding: 20
    }}>
      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: 24, padding: '16px 0' }}>
        <h1 style={{
          fontSize: '2.4rem', fontWeight: 700,
          background: 'linear-gradient(135deg, #1565c0, #7b1fa2)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12
        }}>
          <span style={{ fontSize: '2.5rem' }}>🌍</span>
          Real World: Earth's Rotation
        </h1>
        <p style={{ color: '#546e7a', marginTop: 8, fontSize: '1.1rem' }}>
          Discover how Earth's spin affects our everyday world
        </p>
      </header>

      {/* Topic Navigation */}
      <nav style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 30, flexWrap: 'wrap', padding: '0 20px' }}>
        {(Object.keys(topics) as RealWorldTopic[]).map(topic => (
          <button key={topic} onClick={() => setActiveTopic(topic)}
            style={{
              padding: '12px 20px',
              background: activeTopic === topic ? 'linear-gradient(135deg, #1976d2, #7b1fa2)' : '#ffffff',
              border: activeTopic === topic ? 'none' : '2px solid #e0e0e0',
              borderRadius: 25, color: activeTopic === topic ? '#fff' : '#546e7a',
              cursor: 'pointer', fontSize: '0.95rem', fontWeight: activeTopic === topic ? 600 : 500,
              transition: 'all 0.3s ease',
              boxShadow: activeTopic === topic ? '0 6px 20px rgba(25, 118, 210, 0.35)' : '0 2px 8px rgba(0,0,0,0.08)',
              display: 'flex', alignItems: 'center', gap: 8
            }}>
            <span style={{ fontSize: '1.2rem' }}>{topics[topic].icon}</span>
            {topics[topic].title.split(' ')[0]}
          </button>
        ))}
      </nav>

      <main style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Interactive Demo Section */}
        <div style={{ background: '#ffffff', borderRadius: 24, padding: 28, boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: '2.5rem', background: 'linear-gradient(135deg, #e3f2fd, #f3e5f5)', padding: 12, borderRadius: 16 }}>{currentTopic.icon}</span>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1a237e', margin: 0 }}>{currentTopic.title}</h2>
              <p style={{ color: '#546e7a', margin: '4px 0 0 0', fontSize: '0.9rem' }}>Interactive Demonstration</p>
            </div>
          </div>

          {/* Aviation Demo */}
          {activeTopic === 'aviation' && (
            <div style={{ background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)', borderRadius: 16, padding: 20 }}>
              <h3 style={{ color: '#1565c0', margin: '0 0 16px 0', fontSize: '1.1rem' }}>✈️ Flight Time Simulator</h3>
              
              <div style={{ marginBottom: 16 }}>
                <label style={{ color: '#37474f', fontWeight: 500, display: 'block', marginBottom: 8 }}>Select Direction:</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setFlightDirection('east')}
                    style={{ flex: 1, padding: '12px', background: flightDirection === 'east' ? '#1976d2' : '#fff',
                      border: `2px solid ${flightDirection === 'east' ? '#1976d2' : '#e0e0e0'}`, borderRadius: 10,
                      color: flightDirection === 'east' ? '#fff' : '#546e7a', fontWeight: 600, cursor: 'pointer' }}>
                    → Eastbound (Faster)
                  </button>
                  <button onClick={() => setFlightDirection('west')}
                    style={{ flex: 1, padding: '12px', background: flightDirection === 'west' ? '#1976d2' : '#fff',
                      border: `2px solid ${flightDirection === 'west' ? '#1976d2' : '#e0e0e0'}`, borderRadius: 10,
                      color: flightDirection === 'west' ? '#fff' : '#546e7a', fontWeight: 600, cursor: 'pointer' }}>
                    ← Westbound (Slower)
                  </button>
                </div>
              </div>

              <div style={{ background: '#fff', borderRadius: 12, padding: 20, position: 'relative', overflow: 'hidden', marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div style={{ textAlign: 'center' }}><div style={{ fontSize: '2rem' }}>🗽</div><div style={{ fontWeight: 600, color: '#1a237e' }}>New York</div></div>
                  <div style={{ textAlign: 'center' }}><div style={{ fontSize: '2rem' }}>🏰</div><div style={{ fontWeight: 600, color: '#1a237e' }}>London</div></div>
                </div>
                
                <div style={{ height: 60, background: 'linear-gradient(90deg, #e3f2fd, #bbdefb)', borderRadius: 30, position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 30, opacity: 0.3, color: '#1565c0' }}>
                    {[...Array(5)].map((_, i) => <span key={i} style={{ fontSize: '1.5rem' }}>→</span>)}
                  </div>
                  <div style={{ position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)', fontSize: '0.75rem', color: '#1565c0', fontWeight: 500 }}>Jet Stream →</div>
                  <div style={{ position: 'absolute', left: flightDirection === 'east' ? `${planePosition}%` : `${100 - planePosition}%`,
                    transform: `translateX(-50%) scaleX(${flightDirection === 'east' ? 1 : -1})`, fontSize: '2rem', transition: 'left 0.05s linear' }}>✈️</div>
                </div>
              </div>

              <button onClick={simulateFlight} disabled={isAnimating}
                style={{ width: '100%', padding: '14px', background: isAnimating ? '#bdbdbd' : 'linear-gradient(135deg, #43a047, #2e7d32)',
                  border: 'none', borderRadius: 12, color: '#fff', fontWeight: 600, fontSize: '1rem', cursor: isAnimating ? 'default' : 'pointer',
                  boxShadow: isAnimating ? 'none' : '0 4px 15px rgba(46, 125, 50, 0.3)' }}>
                {isAnimating ? '✈️ Flying...' : '🛫 Start Flight'}
              </button>

              {planePosition >= 100 && (
                <div style={{ marginTop: 16, padding: '14px 18px', background: flightDirection === 'east' ? '#e8f5e9' : '#fff3e0', borderRadius: 12, textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, color: flightDirection === 'east' ? '#2e7d32' : '#e65100', fontSize: '1.1rem' }}>
                    {flightDirection === 'east' ? '⚡ Fast Flight!' : '🐢 Slower Flight'}
                  </div>
                  <div style={{ color: '#546e7a', marginTop: 4 }}>
                    {flightDirection === 'east' ? 'Jet streams helped push the plane, saving ~1 hour!' : 'Flying against jet streams added ~1 hour to the trip.'}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Weather Demo */}
          {activeTopic === 'weather' && (
            <div style={{ background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)', borderRadius: 16, padding: 20 }}>
              <h3 style={{ color: '#2e7d32', margin: '0 0 16px 0', fontSize: '1.1rem' }}>🌀 Hurricane Spin Direction</h3>

              <div style={{ marginBottom: 16 }}>
                <label style={{ color: '#37474f', fontWeight: 500, display: 'block', marginBottom: 8 }}>Select Hemisphere:</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setWeatherHemisphere('north')}
                    style={{ flex: 1, padding: '12px', background: weatherHemisphere === 'north' ? '#2e7d32' : '#fff',
                      border: `2px solid ${weatherHemisphere === 'north' ? '#2e7d32' : '#e0e0e0'}`, borderRadius: 10,
                      color: weatherHemisphere === 'north' ? '#fff' : '#546e7a', fontWeight: 600, cursor: 'pointer' }}>🌍 Northern</button>
                  <button onClick={() => setWeatherHemisphere('south')}
                    style={{ flex: 1, padding: '12px', background: weatherHemisphere === 'south' ? '#2e7d32' : '#fff',
                      border: `2px solid ${weatherHemisphere === 'south' ? '#2e7d32' : '#e0e0e0'}`, borderRadius: 10,
                      color: weatherHemisphere === 'south' ? '#fff' : '#546e7a', fontWeight: 600, cursor: 'pointer' }}>🌏 Southern</button>
                </div>
              </div>

              <div style={{ background: '#fff', borderRadius: 16, padding: 30, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle, #e3f2fd 0%, #1976d2 50%, #0d47a1 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', boxShadow: '0 8px 30px rgba(25, 118, 210, 0.3)' }}>
                  <div style={{ fontSize: '3rem', animation: `spin${weatherHemisphere === 'north' ? 'CCW' : 'CW'} 3s linear infinite` }}>🌀</div>
                  <div style={{ position: 'absolute', width: 20, height: 20, background: '#fff', borderRadius: '50%' }} />
                </div>
                
                <div style={{ marginTop: 20, textAlign: 'center' }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1565c0', marginBottom: 8 }}>
                    {weatherHemisphere === 'north' ? '↺ Counter-Clockwise' : '↻ Clockwise'}
                  </div>
                  <div style={{ color: '#546e7a', lineHeight: 1.6 }}>
                    In the {weatherHemisphere === 'north' ? 'Northern' : 'Southern'} Hemisphere,
                    hurricanes spin {weatherHemisphere === 'north' ? 'counter-clockwise' : 'clockwise'} due to the Coriolis effect.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Satellites Demo */}
          {activeTopic === 'satellites' && (
            <div style={{ background: 'linear-gradient(135deg, #f3e5f5, #e1bee7)', borderRadius: 16, padding: 20 }}>
              <h3 style={{ color: '#7b1fa2', margin: '0 0 16px 0', fontSize: '1.1rem' }}>🛰️ Satellite Orbits</h3>

              <div style={{ background: '#1a1a2e', borderRadius: 16, padding: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', minHeight: 250 }}>
                {[...Array(30)].map((_, i) => (
                  <div key={i} style={{ position: 'absolute', width: 2, height: 2, background: '#fff', borderRadius: '50%', left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: Math.random() * 0.8 + 0.2 }} />
                ))}
                
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #4fc3f7 0%, #0288d1 50%, #01579b 100%)', boxShadow: '0 0 30px rgba(79, 195, 247, 0.4)', position: 'relative', zIndex: 2 }}>
                  <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'linear-gradient(to left, transparent 50%, rgba(0,0,0,0.5) 100%)' }} />
                </div>

                <div style={{ position: 'absolute', width: 200, height: 200, border: '2px dashed rgba(255,255,255,0.3)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', width: 200, height: 200, transform: `rotate(${satelliteOrbit}deg)` }}>
                  <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', fontSize: '1.5rem' }}>🛰️</div>
                </div>

                <div style={{ position: 'absolute', width: 130, height: 130, border: '2px dashed rgba(255,200,0,0.4)', borderRadius: '50%', transform: 'rotate(30deg)' }} />
                <div style={{ position: 'absolute', width: 130, height: 130, transform: `rotate(${30 + satelliteOrbit * 3}deg)` }}>
                  <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', fontSize: '1.2rem' }}>🛸</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
                <div style={{ background: '#fff', padding: '12px 16px', borderRadius: 10, textAlign: 'center' }}>
                  <div style={{ color: '#9e9e9e', fontSize: '0.8rem' }}>🛰️ Geostationary</div>
                  <div style={{ color: '#7b1fa2', fontWeight: 700 }}>35,786 km</div>
                  <div style={{ color: '#546e7a', fontSize: '0.75rem' }}>24 hr orbit</div>
                </div>
                <div style={{ background: '#fff', padding: '12px 16px', borderRadius: 10, textAlign: 'center' }}>
                  <div style={{ color: '#ffc107', fontSize: '0.8rem' }}>🛸 ISS</div>
                  <div style={{ color: '#7b1fa2', fontWeight: 700 }}>408 km</div>
                  <div style={{ color: '#546e7a', fontSize: '0.75rem' }}>90 min orbit</div>
                </div>
              </div>
            </div>
          )}

          {/* Daily Life Demo */}
          {activeTopic === 'daily-life' && (
            <div style={{ background: 'linear-gradient(135deg, #fff3e0, #ffe0b2)', borderRadius: 16, padding: 20 }}>
              <h3 style={{ color: '#e65100', margin: '0 0 16px 0', fontSize: '1.1rem' }}>🕐 World Time Zones</h3>

              <div style={{ background: '#fff', borderRadius: 12, padding: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  {cities.map((city, index) => (
                    <div key={city.name} onClick={() => setSelectedCity(index)}
                      style={{ padding: '14px', background: selectedCity === index ? 'linear-gradient(135deg, #fff3e0, #ffe0b2)' : '#f5f5f5',
                        borderRadius: 12, cursor: 'pointer', textAlign: 'center', border: selectedCity === index ? '2px solid #ff9800' : '2px solid transparent', transition: 'all 0.3s ease' }}>
                      <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>
                        {index === 0 ? '🗽' : index === 1 ? '🏰' : index === 2 ? '🏜️' : index === 3 ? '🕌' : index === 4 ? '🗼' : '🦘'}
                      </div>
                      <div style={{ fontWeight: 700, color: '#1a237e', fontSize: '0.9rem' }}>{city.name}</div>
                      <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 700, color: '#e65100', marginTop: 4 }}>{getTimeInCity(city.timezone)}</div>
                      <div style={{ fontSize: '0.7rem', color: '#9e9e9e' }}>UTC{city.timezone >= 0 ? '+' : ''}{city.timezone}</div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 16, padding: '14px 18px', background: '#e8f5e9', borderRadius: 10 }}>
                  <div style={{ fontWeight: 600, color: '#2e7d32', marginBottom: 4 }}>💡 Did you know?</div>
                  <div style={{ color: '#546e7a', fontSize: '0.9rem' }}>
                    When it's {getTimeInCity(cities[selectedCity].timezone)} in {cities[selectedCity].name}, 
                    it's {getTimeInCity(cities[(selectedCity + 3) % 6].timezone)} in {cities[(selectedCity + 3) % 6].name}!
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Demo */}
          {activeTopic === 'navigation' && (
            <div style={{ background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)', borderRadius: 16, padding: 20 }}>
              <h3 style={{ color: '#1565c0', margin: '0 0 16px 0', fontSize: '1.1rem' }}>🧭 GPS & Coriolis Correction</h3>

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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ width: 20, height: 3, background: '#f44336' }} /><span style={{ fontSize: '0.85rem', color: '#546e7a' }}>Without correction</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ width: 20, height: 3, background: '#4caf50' }} /><span style={{ fontSize: '0.85rem', color: '#546e7a' }}>With correction</span></div>
                </div>

                <div style={{ padding: '14px', background: '#e3f2fd', borderRadius: 10, color: '#1565c0', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Earth's rotation causes moving objects to curve. GPS, missiles, and even long kicks must account for this Coriolis effect!
                </div>
              </div>
            </div>
          )}

          {/* Sports Demo */}
          {activeTopic === 'sports' && (
            <div style={{ background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)', borderRadius: 16, padding: 20 }}>
              <h3 style={{ color: '#2e7d32', margin: '0 0 16px 0', fontSize: '1.1rem' }}>⚽ Sports & Earth's Rotation</h3>

              <div style={{ background: '#fff', borderRadius: 12, padding: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={{ padding: 16, background: '#f1f8e9', borderRadius: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>⛳</div>
                    <div style={{ fontWeight: 700, color: '#33691e', marginBottom: 4 }}>Golf</div>
                    <div style={{ color: '#546e7a', fontSize: '0.85rem' }}>300m drive deflected ~1cm</div>
                  </div>
                  <div style={{ padding: 16, background: '#e3f2fd', borderRadius: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>⚾</div>
                    <div style={{ fontWeight: 700, color: '#1565c0', marginBottom: 4 }}>Baseball</div>
                    <div style={{ color: '#546e7a', fontSize: '0.85rem' }}>Home runs not affected noticeably</div>
                  </div>
                  <div style={{ padding: 16, background: '#fce4ec', borderRadius: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🎯</div>
                    <div style={{ fontWeight: 700, color: '#c2185b', marginBottom: 4 }}>Shooting</div>
                    <div style={{ color: '#546e7a', fontSize: '0.85rem' }}>Olympic shooters must compensate</div>
                  </div>
                  <div style={{ padding: 16, background: '#fff3e0', borderRadius: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>⚽</div>
                    <div style={{ fontWeight: 700, color: '#e65100', marginBottom: 4 }}>Soccer</div>
                    <div style={{ color: '#546e7a', fontSize: '0.85rem' }}>Wind patterns affect outdoor play</div>
                  </div>
                </div>

                <div style={{ marginTop: 16, padding: '14px', background: '#e8f5e9', borderRadius: 10, textAlign: 'center' }}>
                  <span style={{ color: '#2e7d32', fontWeight: 500 }}>🤔 The effect is real but usually too small to notice in most sports!</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Facts Section */}
        <div style={{ background: '#ffffff', borderRadius: 24, padding: 28, boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1a237e', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>📚 Key Facts</h2>

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
            <h3 style={{ color: '#2e7d32', margin: '0 0 12px 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 8 }}>💡 Think About It</h3>
            <p style={{ color: '#37474f', margin: 0, lineHeight: 1.7 }}>
              {activeTopic === 'aviation' && 'Why do you think most major airports are built in the eastern parts of continents?'}
              {activeTopic === 'navigation' && 'How would GPS work differently if Earth rotated twice as fast?'}
              {activeTopic === 'weather' && 'Would hurricanes exist on a planet that doesn\'t rotate?'}
              {activeTopic === 'satellites' && 'Why are most rocket launch sites located near the equator?'}
              {activeTopic === 'daily-life' && 'What would happen to time zones if Earth rotated in the opposite direction?'}
              {activeTopic === 'sports' && 'Would snipers need to adjust their aim more at the equator or near the poles?'}
            </p>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes spinCCW { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        @keyframes spinCW { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        button:hover { transform: translateY(-2px); }
        button:active { transform: translateY(0); }
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
      <div className="pt-14 sm:pt-16 px-2 sm:px-3 md:px-4 lg:px-6 pb-4 sm:pb-6">
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
