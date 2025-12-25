import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
  ReactNode,
  useMemo,
} from "react";

// Simple icon components
const Play = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const Pause = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
  </svg>
);

const ChevronLeft = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const ChevronRight = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const RotateCcw = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M1 4v6h6M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
  </svg>
);

const Droplets = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
  </svg>
);

type StepMode = "learn" | "practice" | "real_world";
type LearnStage =
  | "overview"
  | "evaporation"
  | "transpiration"
  | "condensation"
  | "precipitation"
  | "collection"
  | "complete";
type LearnActiveElement =
  | "sun"
  | "water"
  | "vapor"
  | "clouds"
  | "rain"
  | "ground"
  | "underground"
  | "plants"
  | "all";
type Language = "en" | "hi" | "gu";

interface BaseStep {
  id: number;
  title: string;
  description: string;
  mode: StepMode;
}

interface LearnStep extends BaseStep {
  mode: "learn";
  type: "intro" | "explanation";
  data: {
    stage: LearnStage;
    activeElements?: LearnActiveElement[];
  };
}

type Step = LearnStep;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

// Translation system
const translations: Record<Language, any> = {
  en: {
    nav: {
      logo: "Water Cycle Learning",
      tabs: {
        learn: "Learn",
        practice: "Practice",
        applications: "Applications",
      },
    },
    language: {
      en: "English",
      hi: "हिंदी",
      gu: "ગુજરાતી",
      selectorLabel: "Select Language",
    },
    controls: {
      step: "Step",
      of: "of",
      previous: "Previous",
      next: "Next",
      play: "Play",
      pause: "Pause",
      reset: "Reset",
    },
    steps: {
      overview: {
        title: "What is the Water Cycle?",
        description:
          "The water cycle is the continuous movement of water on, above, and below the Earth's surface. Water moves between oceans, atmosphere, and land through evaporation, condensation, and precipitation.",
      },
      evaporation: {
        title: "Step 1: Evaporation",
        description:
          "When the Sun heats water in oceans, rivers, and lakes, it evaporates and becomes water vapor. Watch the water droplets rise upward from the water surface as they turn into invisible vapor.",
      },
      transpiration: {
        title: "Step 2: Transpiration",
        description:
          "Water also evaporates from trees and plants through transpiration. Plants absorb water through their roots and release water vapor through tiny pores in their leaves. Watch the water droplets rising from the tree.",
      },
      condensation: {
        title: "Step 3: Condensation",
        description:
          "As water vapor rises into the atmosphere, it cools down. When it cools enough, the water vapor condenses into tiny water droplets, forming clouds. Notice how the vapor disappears and clouds form.",
      },
      precipitation: {
        title: "Step 4: Precipitation",
        description:
          "When clouds become heavy with water droplets, they release the water back to Earth as precipitation - rain, snow, or hail. Watch the rain falling from the clouds.",
      },
      collection: {
        title: "Step 5: Collection",
        description:
          "Rainwater that falls on Earth flows into ponds, lakes, rivers, and oceans. Some water flows over the surface as runoff. The water is collected and ready to evaporate again.",
      },
      complete: {
        title: "Step 6: The Complete Cycle",
        description:
          "The water cycle is complete! Water evaporates from water bodies and plants, forms clouds through condensation, falls as rain, and collects again. This continuous process helps redistribute water across Earth.",
      },
    },
    canvas: {
      evaporation: "Evaporation",
      transpiration: "Transpiration",
      condensation: "Condensation",
      precipitation: "Precipitation",
      collection: "Collection",
      sun: "Sun",
      waterBody: "Water Body",
      clouds: "Clouds",
      rain: "Rain",
    },
  },
  hi: {
    nav: {
      logo: "जल चक्र सीखें",
      tabs: { learn: "सीखें", practice: "अभ्यास", applications: "अनुप्रयोग" },
    },
    language: {
      en: "English",
      hi: "हिंदी",
      gu: "ગુજરાતી",
      selectorLabel: "भाषा चुनें",
    },
    controls: {
      step: "चरण",
      of: "का",
      previous: "पिछला",
      next: "अगला",
      play: "चलाएं",
      pause: "रोकें",
      reset: "रीसेट",
    },
    steps: {
      overview: {
        title: "जल चक्र क्या है?",
        description:
          "जल चक्र पृथ्वी की सतह पर, ऊपर और नीचे जल की निरंतर गति है। जल वाष्पीकरण, संघनन और वर्षा के माध्यम से महासागरों, वायुमंडल और भूमि के बीच घूमता है।",
      },
      evaporation: {
        title: "चरण 1: वाष्पीकरण",
        description:
          "जब सूर्य महासागरों, नदियों और झीलों में पानी को गर्म करता है, तो यह वाष्पित होकर जलवाष्प बन जाता है। देखें कि पानी की बूंदें कैसे पानी की सतह से ऊपर उठती हैं।",
      },
      transpiration: {
        title: "चरण 2: वाष्पोत्सर्जन",
        description:
          "पेड़ों और पौधों से भी वाष्पोत्सर्जन के माध्यम से पानी वाष्पित होता है। पौधे अपनी जड़ों के माध्यम से पानी को अवशोषित करते हैं और अपनी पत्तियों में छोटे छिद्रों के माध्यम से जलवाष्प छोड़ते हैं।",
      },
      condensation: {
        title: "चरण 3: संघनन",
        description:
          "जैसे ही जलवाष्प वायुमंडल में ऊपर उठता है, यह ठंडा हो जाता है। जब यह पर्याप्त ठंडा हो जाता है, तो जलवाष्प छोटी पानी की बूंदों में संघनित होकर बादल बनाता है।",
      },
      precipitation: {
        title: "चरण 4: वर्षा",
        description:
          "जब बादल पानी की बूंदों से भारी हो जाते हैं, तो वे पानी को वर्षा के रूप में पृथ्वी पर वापस छोड़ते हैं - बारिश, बर्फ या ओले के रूप में।",
      },
      collection: {
        title: "चरण 5: संग्रहण",
        description:
          "पृथ्वी पर गिरने वाला वर्षा जल तालाबों, झीलों, नदियों और महासागरों में बहता है। कुछ पानी सतह पर प्रवाह के रूप में बहता है।",
      },
      complete: {
        title: "चरण 6: पूर्ण चक्र",
        description:
          "जल चक्र पूर्ण है! पानी जल निकायों और पौधों से वाष्पित होता है, संघनन के माध्यम से बादल बनाता है, बारिश के रूप में गिरता है, और फिर से एकत्र होता है।",
      },
    },
    canvas: {
      evaporation: "वाष्पीकरण",
      transpiration: "वाष्पोत्सर्जन",
      condensation: "संघनन",
      precipitation: "वर्षा",
      collection: "संग्रहण",
      sun: "सूर्य",
      waterBody: "जल निकाय",
      clouds: "बादल",
      rain: "बारिश",
    },
  },
  gu: {
    nav: {
      logo: "જળ ચક્ર શીખો",
      tabs: { learn: "શીખો", practice: "અભ્યાસ", applications: "અનુપ્રયોગો" },
    },
    language: {
      en: "English",
      hi: "हिंदी",
      gu: "ગુજરાતી",
      selectorLabel: "ભાષા પસંદ કરો",
    },
    controls: {
      step: "પગલું",
      of: "નું",
      previous: "અગાઉ",
      next: "આગળ",
      play: "ચલાવો",
      pause: "થોભાવો",
      reset: "રીસેટ",
    },
    steps: {
      overview: {
        title: "જળ ચક્ર શું છે?",
        description:
          "જળ ચક્ર એ પૃથ્વીની સપાટી પર, ઉપર અને નીચે પાણીની સતત હલચલ છે। બાષ્પીભવન, સંઘનન અને વરસાદ દ્વારા પાણી મહાસાગરો, વાતાવરણ અને જમીન વચ્ચે ફરે છે।",
      },
      evaporation: {
        title: "પગલું 1: બાષ્પીભવન",
        description:
          "જ્યારે સૂર્ય મહાસાગરો, નદીઓ અને તળાવોમાં પાણીને ગરમ કરે છે, ત્યારે તે બાષ્પીભવન થાય છે અને જળ વરાળ બને છે। જુઓ કે પાણીના ટીપાં કેવી રીતે પાણીની સપાટીથી ઉપર જાય છે।",
      },
      transpiration: {
        title: "પગલું 2: વાષ્પોત્સર્જન",
        description:
          "વૃક્ષો અને છોડમાંથી પણ વાષ્પોત્સર્જન દ્વારા પાણી બાષ્પીભવન થાય છે। છોડ તેમના મૂળ દ્વારા પાણી શોષી લે છે અને તેમના પાંદડાઓમાં નાના છિદ્રો દ્વારા જળ વરાળ મુક્ત કરે છે।",
      },
      condensation: {
        title: "પગલું 3: સંઘનન",
        description:
          "જેમ જેમ જળ વરાળ વાતાવરણમાં ઉપર જાય છે, તે ઠંડુ થાય છે। જ્યારે તે પૂરતું ઠંડુ થાય છે, ત્યારે જળ વરાળ નાના પાણીના ટીપાંમાં સંઘનિત થઈને વાદળો બનાવે છે।",
      },
      precipitation: {
        title: "પગલું 4: વરસાદ",
        description:
          "જ્યારે વાદળો પાણીના ટીપાંથી ભારે થાય છે, ત્યારે તેઓ પાણીને વરસાદ તરીકે પૃથ્વી પર પાછા છોડે છે - વરસાદ, બરફ અથવા કરાના રૂપમાં।",
      },
      collection: {
        title: "પગલું 5: સંગ્રહ",
        description:
          "પૃથ્વી પર પડતો વરસાદી પાણી તળાવો, સરોવરો, નદીઓ અને મહાસાગરોમાં વહે છે। કેટલાક પાણી સપાટી પર વહેણ તરીકે વહે છે।",
      },
      complete: {
        title: "પગલું 6: સંપૂર્ણ ચક્ર",
        description:
          "જળ ચક્ર પૂર્ણ છે! પાણી જળ સંસ્થાઓ અને છોડમાંથી બાષ્પીભવન થાય છે, સંઘનન દ્વારા વાદળો બનાવે છે, વરસાદ તરીકે પડે છે અને ફરી એકત્રિત થાય છે।",
      },
    },
    canvas: {
      evaporation: "બાષ્પીભવન",
      transpiration: "વાષ્પોત્સર્જન",
      condensation: "સંઘનન",
      precipitation: "વરસાદ",
      collection: "સંગ્રહ",
      sun: "સૂર્ય",
      waterBody: "જળ સંસ્થા",
      clouds: "વાદળો",
      rain: "વરસાદ",
    },
  },
};

// Language Context
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>("en");

  const handleSetLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("waterCycleLang", lang);
  };

  useEffect(() => {
    const saved = localStorage.getItem("waterCycleLang") as Language;
    if (saved && ["en", "hi", "gu"].includes(saved)) {
      setLanguageState(saved);
    }
  }, []);

  const t = (key: string) => {
    const keys = key.split(".");
    let value: any = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

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
  if (!context)
    throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};

// Language Selector
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

// Default steps data (7 steps only)
const DEFAULT_STEPS: Step[] = [
  {
    id: 1,
    title: "What is the Water Cycle?",
    description: "",
    type: "intro",
    mode: "learn",
    data: { stage: "overview" },
  },
  {
    id: 2,
    title: "Step 1: Evaporation",
    description: "",
    type: "explanation",
    mode: "learn",
    data: { stage: "evaporation", activeElements: ["sun", "water", "vapor"] },
  },
  {
    id: 3,
    title: "Step 2: Transpiration",
    description: "",
    type: "explanation",
    mode: "learn",
    data: { stage: "transpiration", activeElements: ["plants", "vapor"] },
  },
  {
    id: 4,
    title: "Step 3: Condensation",
    description: "",
    type: "explanation",
    mode: "learn",
    data: { stage: "condensation", activeElements: ["vapor", "clouds"] },
  },
  {
    id: 5,
    title: "Step 4: Precipitation",
    description: "",
    type: "explanation",
    mode: "learn",
    data: { stage: "precipitation", activeElements: ["clouds", "rain"] },
  },
  {
    id: 6,
    title: "Step 5: Collection",
    description: "",
    type: "explanation",
    mode: "learn",
    data: { stage: "collection", activeElements: ["rain", "water"] },
  },
  {
    id: 7,
    title: "Step 6: The Complete Cycle",
    description: "",
    type: "explanation",
    mode: "learn",
    data: { stage: "complete", activeElements: ["all"] },
  },
];

interface WaterCycleLearningProps {
  width?: number;
  height?: number;
  steps?: Step[];
  mode: "learn" | "practice" | "applications";
  setMode: (mode: "learn" | "practice" | "applications") => void;
}

const WaterCycleLearning: React.FC<WaterCycleLearningProps> = ({
  width = 800,
  height = 600,
  steps: propSteps,
  mode: _mode,
  setMode: _setMode,
}) => {
  const { t } = useLanguage();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const steps = useMemo(() => propSteps || DEFAULT_STEPS, [propSteps]);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const modeSteps = useMemo(
    () => steps.filter((step) => step.mode === "learn"),
    [steps]
  );
  const currentStep = modeSteps[currentStepIndex];

  // Initialize particles
  useEffect(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 15; i++) {
      newParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 2,
        vy: -Math.random() * 2 - 1,
        size: Math.random() * 5 + 3,
        opacity: Math.random() * 0.6 + 0.4,
        color: "#00CED1",
      });
    }
    setParticles(newParticles);
  }, [width, height]);

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setTimeout(() => {
      if (currentStepIndex < modeSteps.length - 1) {
        setCurrentStepIndex((prev) => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, 8000);
    return () => window.clearTimeout(timer);
  }, [isPlaying, currentStepIndex, modeSteps.length]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      setAnimationProgress((prev) => (prev + 0.005) % 1);
      setParticles((prevParticles) =>
        prevParticles
          .map((p) => ({
            ...p,
            y: p.y + p.vy,
            x: p.x + Math.sin(p.y * 0.01) * 0.5,
            opacity: p.y < 0 ? 0 : p.opacity,
          }))
          .map((p) =>
            p.y < 0
              ? { ...p, y: height, opacity: Math.random() * 0.6 + 0.4 }
              : p
          )
      );
      animationFrameRef.current = window.requestAnimationFrame(animate);
    };

    animationFrameRef.current = window.requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [height]);

  // Draw on canvas
  useEffect(() => {
    if (!canvasRef.current || !currentStep) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const stage = currentStep.data.stage;
    const activeElements = currentStep.data.activeElements || [];

    drawWaterCycle(
      ctx,
      width,
      height,
      stage,
      activeElements,
      animationProgress,
      particles,
      t
    );
  }, [currentStep, animationProgress, particles, width, height, t]);

  const nextStep = () => {
    if (currentStepIndex < modeSteps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const resetMode = () => {
    setCurrentStepIndex(0);
  };

  if (!currentStep) {
    return <div className="text-center p-8">No steps available</div>;
  }

  const stepKey = currentStep.data.stage;
  const title = t(`steps.${stepKey}.title`);
  const description = t(`steps.${stepKey}.description`);

  return (
    <div className="w-full max-w-7xl mx-auto mt-20">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-teal-50 via-purple-50 to-teal-50 border-b border-teal-200/50 shadow-sm backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0 flex items-center gap-2">
              <Droplets className="w-6 h-6 text-teal-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent">
                {t("nav.logo")}
              </span>
            </div>

            <div className="ml-auto">
              <LanguageSelector />
            </div>
          </div>
        </div>
      </nav>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-teal-500 via-purple-500 to-teal-500 text-white p-4 sm:p-6">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h2 className="text-xl sm:text-2xl font-semibold">{title}</h2>
            <div className="text-sm bg-white/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full backdrop-blur-sm">
              {t("controls.step")} {currentStepIndex + 1} {t("controls.of")}{" "}
              {modeSteps.length}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-8">
          <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl shadow-lg p-4 sm:p-6 mb-6">
            <canvas
              ref={canvasRef}
              width={width}
              height={height}
              className="w-full border-2 border-teal-200 rounded-lg"
            />
          </div>

          <div className="bg-gradient-to-r from-teal-50 via-purple-50 to-teal-50 rounded-xl p-4 sm:p-6 mb-6 border-l-4 border-teal-500">
            <p className="text-gray-800 text-base sm:text-lg leading-relaxed">
              {description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <button
              onClick={prevStep}
              disabled={currentStepIndex === 0}
              className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-all w-full sm:w-auto"
            >
              <ChevronLeft className="w-5 h-5" />
              {t("controls.previous")}
            </button>

            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-teal-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex-1 sm:flex-none"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-5 h-5" />
                    {t("controls.pause")}
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    {t("controls.play")}
                  </>
                )}
              </button>

              <button
                onClick={resetMode}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all flex-1 sm:flex-none"
              >
                <RotateCcw className="w-5 h-5" />
                {t("controls.reset")}
              </button>
            </div>

            <button
              onClick={nextStep}
              disabled={currentStepIndex === modeSteps.length - 1}
              className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-teal-600 to-purple-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all w-full sm:w-auto"
            >
              {t("controls.next")}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-600 via-purple-600 to-teal-600 transition-all duration-300 rounded-full"
                style={{
                  width: `${
                    ((currentStepIndex + 1) / modeSteps.length) * 100
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Drawing function with FIXED animations
function drawWaterCycle(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  stage: LearnStage,
  activeElements: LearnActiveElement[],
  progress: number,
  _particles: Particle[],
  t: (key: string) => string
) {
  const waterY = height * 0.7;
  const groundY = height * 0.6;

  // Sky
  const skyGradient = ctx.createLinearGradient(0, 0, 0, groundY);
  skyGradient.addColorStop(0, "#87CEEB");
  skyGradient.addColorStop(0.5, "#B0E0E6");
  skyGradient.addColorStop(1, "#E0F6FF");
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, width, groundY);

  // Ground - GREEN SURFACE (FIXED - NO WAVES)
  ctx.fillStyle = "#90EE90";
  ctx.fillRect(0, groundY, width, waterY - groundY);

  // Underground
  const undergroundGradient = ctx.createLinearGradient(0, waterY, 0, height);
  undergroundGradient.addColorStop(0, "#8FBC8F");
  undergroundGradient.addColorStop(0.4, "#8B7355");
  undergroundGradient.addColorStop(1, "#4A3520");
  ctx.fillStyle = undergroundGradient;
  ctx.fillRect(0, waterY, width, height - waterY);

  // Sun
  if (activeElements.includes("sun") || activeElements.includes("all")) {
    const sunPulse = 1 + Math.sin(progress * Math.PI * 2) * 0.1;
    ctx.fillStyle = "#FFD700";
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#FFA500";
    ctx.beginPath();
    ctx.arc(width * 0.15, height * 0.15, 40 * sunPulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Sun rays
    ctx.strokeStyle = "#FFD700";
    ctx.lineWidth = 3;
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI * 2) / 12 + progress * Math.PI * 2;
      const rayLength = 50 + Math.sin(progress * Math.PI * 4 + i) * 10;
      const x1 = width * 0.15 + Math.cos(angle) * (50 * sunPulse);
      const y1 = height * 0.15 + Math.sin(angle) * (50 * sunPulse);
      const x2 = width * 0.15 + Math.cos(angle) * rayLength;
      const y2 = height * 0.15 + Math.sin(angle) * rayLength;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }

  // Water body
  ctx.fillStyle = "#4682B4";
  ctx.fillRect(width * 0.05, waterY, width * 0.3, height - waterY);

  // Mountain - FIXED TO BROWN COLOR ONLY
  ctx.fillStyle = "#8B7355";
  ctx.beginPath();
  ctx.moveTo(width * 0.7, groundY);
  ctx.lineTo(width * 0.8, height * 0.3);
  ctx.lineTo(width * 0.9, groundY);
  ctx.closePath();
  ctx.fill();

  // Tree - FIXED (positioned on green ground, NO sway)
  const treeX = width * 0.55;
  const treeY = groundY;

  // Tree trunk (NO sway animation)
  ctx.fillStyle = "#8B4513";
  ctx.fillRect(treeX - 7.5, treeY, 15, 60);

  // Tree leaves
  ctx.fillStyle = "#228B22";
  ctx.beginPath();
  ctx.arc(treeX, treeY - 10, 30, 0, Math.PI * 2);
  ctx.fill();

  // STEP 2: Evaporation - Water droplets rising from water body
  if (stage === "evaporation") {
    for (let i = 0; i < 10; i++) {
      const x =
        width * 0.1 + i * 20 + Math.sin(progress * Math.PI * 2 + i) * 10;
      const riseHeight = (progress * 200 + i * 20) % 200;
      const y = waterY - riseHeight;
      const opacity = Math.max(0, 1 - riseHeight / 200);

      if (y > height * 0.3) {
        ctx.fillStyle = `rgba(30, 144, 255, ${opacity * 0.7})`;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // STEP 3: Transpiration - Water droplets rising from tree ONLY
  if (stage === "transpiration") {
    for (let i = 0; i < 6; i++) {
      const x = treeX + Math.sin(progress * Math.PI * 2 + i) * 15;
      const riseHeight = (progress * 180 + i * 30) % 180;
      const y = treeY - 40 - riseHeight;
      const opacity = Math.max(0, 1 - riseHeight / 180);

      if (y > height * 0.3) {
        ctx.fillStyle = `rgba(34, 139, 34, ${opacity * 0.7})`;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // STEP 4: Condensation - NO droplets, only clouds forming
  if (stage === "condensation") {
    const cloudFloat = Math.sin(progress * Math.PI * 2) * 5;
    drawCloud(ctx, width * 0.4 + cloudFloat, height * 0.25, 80);
    drawCloud(ctx, width * 0.6 - cloudFloat, height * 0.2, 100);
  }

  // STEP 5: Precipitation - ONLY rain falling from clouds, NO background droplets
  if (stage === "precipitation") {
    // Clouds
    const cloudFloat = Math.sin(progress * Math.PI * 2) * 5;
    drawCloud(ctx, width * 0.4 + cloudFloat, height * 0.25, 80);
    drawCloud(ctx, width * 0.6 - cloudFloat, height * 0.2, 100);

    // Rain falling from clouds
    ctx.strokeStyle = "#4682B4";
    ctx.lineWidth = 2;
    for (let i = 0; i < 20; i++) {
      const x =
        width * 0.35 + i * 25 + Math.sin(progress * Math.PI * 2 + i) * 5;
      const fallProgress = (progress * 300 + i * 15) % 300;
      const y1 = height * 0.3 + fallProgress;
      const y2 = y1 + 20;

      if (y1 < groundY) {
        ctx.globalAlpha = Math.max(0, 1 - fallProgress / 300);
        ctx.beginPath();
        ctx.moveTo(x, y1);
        ctx.lineTo(x, y2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  }

  // STEP 6: Collection - NO falling rain, NO rising droplets, just static water
  if (stage === "collection") {
    // Just show the collected water (already drawn)
  }

  // STEP 7: Complete cycle - Small animation showing entire process
  if (stage === "complete") {
    // Clouds
    const cloudFloat = Math.sin(progress * Math.PI * 2) * 3;
    drawCloud(ctx, width * 0.4 + cloudFloat, height * 0.25, 70);
    drawCloud(ctx, width * 0.6 - cloudFloat, height * 0.2, 85);

    // Small evaporation (3 droplets)
    for (let i = 0; i < 3; i++) {
      const x = width * 0.15 + i * 25;
      const riseHeight = (progress * 150 + i * 50) % 150;
      const y = waterY - riseHeight;
      const opacity = Math.max(0, 1 - riseHeight / 150);

      if (y > height * 0.35 && y < waterY) {
        ctx.fillStyle = `rgba(30, 144, 255, ${opacity * 0.5})`;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Small rain (5 drops)
    ctx.strokeStyle = "#4682B4";
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      const x = width * 0.45 + i * 30;
      const fallProgress = (progress * 200 + i * 40) % 200;
      const y1 = height * 0.35 + fallProgress;
      const y2 = y1 + 15;

      if (y1 < groundY) {
        ctx.globalAlpha = Math.max(0, 1 - fallProgress / 200);
        ctx.beginPath();
        ctx.moveTo(x, y1);
        ctx.lineTo(x, y2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  }

  // Labels
  ctx.fillStyle = "#000000";
  ctx.font = "bold 14px sans-serif";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
  ctx.shadowBlur = 4;

  if (stage === "evaporation") {
    ctx.fillText(t("canvas.evaporation"), width * 0.2, waterY - 120);
  }
  if (stage === "transpiration") {
    ctx.fillText(t("canvas.transpiration"), treeX, treeY - 80);
  }
  if (stage === "condensation" || stage === "complete") {
    ctx.fillText(t("canvas.condensation"), width * 0.5, height * 0.15);
  }
  if (stage === "precipitation" || stage === "complete") {
    ctx.fillText(t("canvas.precipitation"), width * 0.5, height * 0.42);
  }
  if (stage === "collection") {
    ctx.fillText(t("canvas.collection"), width * 0.2, waterY + 30);
  }

  ctx.shadowBlur = 0;
}

function drawCloud(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
) {
  ctx.fillStyle = "#FFFFFF";
  ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
  ctx.shadowBlur = 10;

  ctx.beginPath();
  ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x + size * 0.4, y - size * 0.1, size * 0.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x - size * 0.4, y - size * 0.1, size * 0.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x + size * 0.2, y + size * 0.2, size * 0.35, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x - size * 0.2, y + size * 0.2, size * 0.35, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowBlur = 0;
}

export default WaterCycleLearning;
