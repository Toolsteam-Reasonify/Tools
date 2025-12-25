import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
  ReactNode,
  useMemo,
} from "react";
import translationsData from "../locales/translation.json";

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

const Lightbulb = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M9 18h6M10 22h4M15 8a5 5 0 1 0-6 0c0 2 1 3 1 5h4c0-2 1-3 1-5z" />
  </svg>
);

const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

const XCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
  </svg>
);

type StepMode = "learn" | "practice" | "real_world";
type LearnStage =
  | "overview"
  | "luminous_objects"
  | "non_luminous_objects"
  | "natural_sources"
  | "artificial_sources"
  | "complete";

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
    lightObjects?: Array<{
      name: string;
      type: "natural" | "artificial";
      luminous: boolean;
    }>;
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

interface PracticeQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface RealWorldApp {
  id: number;
  title: string;
  description: string;
  icon: string;
}

// Translation system
const translations: Record<Language, any> = {
  en: {
    nav: {
      logo: "Sources of Light Learning",
      tabs: {
        learn: "Learn",
        practice: "Practice",
        applications: "Applications",
        real_world: "Real World",
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
        title: "What are Sources of Light?",
        description:
          "Light is essential for vision and life on Earth. The Sun is our primary natural source of light. But there are many other sources - both natural and artificial. Let's explore the fascinating world of light sources!",
      },
      luminous_objects: {
        title: "Luminous Objects",
        description:
          "Objects that emit their own light are called luminous objects. The Sun, stars, lightning, fire, and certain animals like fireflies produce their own light through various natural processes.",
      },
      non_luminous_objects: {
        title: "Non-Luminous Objects",
        description:
          "Objects that do not emit their own light are called non-luminous objects. The Moon is a perfect example - it doesn't produce its own light but reflects sunlight that falls on it. This is why we can see the Moon at night!",
      },
      natural_sources: {
        title: "Natural Sources of Light",
        description:
          "The Sun gives out or emits its own light and is the main source of natural light on Earth. Other natural sources include stars, lightning, natural fire, and bioluminescent animals like fireflies that use light to communicate.",
      },
      artificial_sources: {
        title: "Artificial Sources of Light",
        description:
          "In ancient times, humans learned to create fire - the earliest form of artificial lighting. With time, they created light using different fuels like animal fat, oil, wax, and gas. Today, most lighting needs are met by electric lighting.",
      },
      complete: {
        title: "Complete Understanding",
        description:
          "You now understand the difference between luminous and non-luminous objects, natural and artificial light sources, and the evolution of lighting technology from ancient fire to modern LEDs. Light sources are essential for life and modern society!",
      },
    },
  },
  hi: {
    nav: {
      logo: "प्रकाश के स्रोत सीखें",
      tabs: { learn: "सीखें", practice: "अभ्यास", applications: "अनुप्रयोग", real_world: "वास्तविक दुनिया" },
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
        title: "प्रकाश के स्रोत क्या हैं?",
        description:
          "प्रकाश पृथ्वी पर जीवन और दृष्टि के लिए आवश्यक है। सूर्य हमारा प्राथमिक प्राकृतिक प्रकाश स्रोत है। लेकिन कई अन्य स्रोत हैं - प्राकृतिक और कृत्रिम दोनों। आइए प्रकाश स्रोतों की आकर्षक दुनिया का अन्वेषण करें!",
      },
      luminous_objects: {
        title: "दीप्तिमान वस्तुएं",
        description:
          "वे वस्तुएं जो अपना स्वयं का प्रकाश उत्सर्जित करती हैं, दीप्तिमान वस्तुएं कहलाती हैं। सूर्य, तारे, बिजली, आग, और जुगनू जैसे कुछ जानवर विभिन्न प्राकृतिक प्रक्रियाओं के माध्यम से अपना स्वयं का प्रकाश उत्पन्न करते हैं।",
      },
      non_luminous_objects: {
        title: "गैर-दीप्तिमान वस्तुएं",
        description:
          "वे वस्तुएं जो अपना स्वयं का प्रकाश उत्सर्जित नहीं करतीं, गैर-दीप्तिमान वस्तुएं कहलाती हैं। चंद्रमा एक आदर्श उदाहरण है - यह अपना प्रकाश उत्पन्न नहीं करता बल्कि सूर्य के प्रकाश को परावर्तित करता है।",
      },
      natural_sources: {
        title: "प्रकाश के प्राकृतिक स्रोत",
        description:
          "सूर्य अपना स्वयं का प्रकाश देता है और पृथ्वी पर प्राकृतिक प्रकाश का मुख्य स्रोत है। अन्य प्राकृतिक स्रोतों में तारे, बिजली, प्राकृतिक आग, और जुगनू शामिल हैं।",
      },
      artificial_sources: {
        title: "कृत्रिम प्रकाश स्रोत",
        description:
          "प्राचीन काल में, मनुष्यों ने आग बनाना सीखा - कृत्रिम प्रकाश का सबसे पहला रूप। समय के साथ, उन्होंने विभिन्न ईंधनों का उपयोग करके प्रकाश बनाया। आज, अधिकांश प्रकाश आवश्यकताएं विद्युत प्रकाश द्वारा पूरी की जाती हैं।",
      },
      complete: {
        title: "पूर्ण समझ",
        description:
          "अब आप दीप्तिमान और गैर-दीप्तिमान वस्तुओं, प्राकृतिक और कृत्रिम प्रकाश स्रोतों, और प्राचीन आग से आधुनिक एलईडी तक प्रकाश प्रौद्योगिकी के विकास के बीच अंतर को समझते हैं।",
      },
    },
  },
  gu: {
    nav: {
      logo: "પ્રકાશના સ્રોતો શીખો",
      tabs: { learn: "શીખો", practice: "અભ્યાસ", applications: "અનુપ્રયોગો", real_world: "વાસ્તવિક દુનિયા" },
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
        title: "પ્રકાશના સ્રોતો શું છે?",
        description:
          "પૃથ્વી પર જીવન અને દ્રષ્ટિ માટે પ્રકાશ આવશ્યક છે। સૂર્ય આપણો પ્રાથમિક કુદરતી પ્રકાશ સ્રોત છે। પરંતુ ઘણા અન્ય સ્રોતો છે - કુદરતી અને કૃત્રિમ બંને। ચાલો પ્રકાશ સ્રોતોની આકર્ષક દુનિયાનું અન્વેષણ કરીએ!",
      },
      luminous_objects: {
        title: "પ્રકાશિત વસ્તુઓ",
        description:
          "જે વસ્તુઓ પોતાનો પ્રકાશ ઉત્સર્જન કરે છે તેને પ્રકાશિત વસ્તુઓ કહેવામાં આવે છે। સૂર્ય, તારાઓ, વીજળી, અગ્નિ અને જુગનુ જેવા કેટલાક પ્રાણીઓ વિવિધ કુદરતી પ્રક્રિયાઓ દ્વારા પોતાનો પ્રકાશ ઉત્પન્ન કરે છે।",
      },
      non_luminous_objects: {
        title: "બિન-પ્રકાશિત વસ્તુઓ",
        description:
          "જે વસ્તુઓ પોતાનો પ્રકાશ ઉત્સર્જન કરતી નથી તેને બિન-પ્રકાશિત વસ્તુઓ કહેવામાં આવે છે। ચંદ્ર એક સંપૂર્ણ ઉદાહરણ છે - તે પોતાનો પ્રકાશ ઉત્પન્ન કરતું નથી પરંતુ સૂર્યના પ્રકાશને પ્રતિબિંબિત કરે છે।",
      },
      natural_sources: {
        title: "પ્રકાશના કુદરતી સ્રોતો",
        description:
          "સૂર્ય પોતાનો પ્રકાશ આપે છે અને પૃથ્વી પર કુદરતી પ્રકાશનો મુખ્ય સ્રોત છે। અન્ય કુદરતી સ્રોતોમાં તારાઓ, વીજળી, કુદરતી અગ્નિ અને જુગનુ સામેલ છે।",
      },
      artificial_sources: {
        title: "કૃત્રિમ પ્રકાશ સ્રોતો",
        description:
          "પ્રાચીન કાળમાં, માનવોએ અગ્નિ બનાવવાનું શીખ્યા - કૃત્રિમ પ્રકાશનું પ્રથમ સ્વરૂપ। સમય સાથે, તેઓએ વિવિધ ઇંધણોનો ઉપયોગ કરીને પ્રકાશ બનાવ્યો। આજે, મોટાભાગની પ્રકાશ જરૂરિયાતો ઇલેક્ટ્રિક પ્રકાશ દ્વારા પૂરી થાય છે।",
      },
      complete: {
        title: "સંપૂર્ણ સમજ",
        description:
          "હવે તમે પ્રકાશિત અને બિન-પ્રકાશિત વસ્તુઓ, કુદરતી અને કૃત્રિમ પ્રકાશ સ્રોતો, અને પ્રાચીન અગ્નિથી આધુનિક LEDsમાં પ્રકાશ તકનીકીના વિકાસ વચ્ચેનો તફાવત સમજો છો।",
      },
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
    localStorage.setItem("sourcesOfLightLang", lang);
  };

  useEffect(() => {
    const saved = localStorage.getItem("sourcesOfLightLang") as Language;
    if (saved && ["en", "hi", "gu"].includes(saved)) {
      setLanguageState(saved);
    }
  }, []);

  const t = (key: string) => {
    const keys = key.split(".");
    // First try to get from external JSON translations
    let value: any = translationsData[language as keyof typeof translationsData];
    for (const k of keys) {
      value = value?.[k];
    }
    // If not found, fallback to internal translations
    if (value === undefined || value === key) {
      value = translations[language];
      for (const k of keys) {
        value = value?.[k];
      }
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
        className="appearance-none bg-white border-2 border-blue-500 rounded-lg px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 pr-6 sm:pr-8 w-40 sm:w-48 md:w-56 text-xs sm:text-sm md:text-base text-blue-700 font-medium cursor-pointer hover:border-teal-500 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-300"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 sm:px-2">
        <svg
          className="fill-current h-3 w-3 sm:h-4 sm:w-4 text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};

// Default steps data
const DEFAULT_STEPS: Step[] = [
  {
    id: 1,
    title: "What are Sources of Light?",
    description: "",
    type: "intro",
    mode: "learn",
    data: { stage: "overview" },
  },
  {
    id: 3,
    title: "Non-Luminous Objects",
    description: "",
    type: "explanation",
    mode: "learn",
    data: {
      stage: "non_luminous_objects",
      lightObjects: [
        { name: "Moon", type: "natural", luminous: false },
        { name: "Earth", type: "natural", luminous: false },
        { name: "Buildings", type: "artificial", luminous: false },
      ],
    },
  },
  {
    id: 4,
    title: "Natural Sources of Light",
    description: "",
    type: "explanation",
    mode: "learn",
    data: {
      stage: "natural_sources",
      lightObjects: [
        { name: "Sun", type: "natural", luminous: true },
        { name: "Stars", type: "natural", luminous: true },
        { name: "Lightning", type: "natural", luminous: true },
        { name: "Fireflies", type: "natural", luminous: true },
      ],
    },
  },
  {
    id: 5,
    title: "Artificial Sources of Light",
    description: "",
    type: "explanation",
    mode: "learn",
    data: {
      stage: "artificial_sources",
      lightObjects: [
        { name: "Candle", type: "artificial", luminous: true },
        { name: "Oil Lamp", type: "artificial", luminous: true },
        { name: "Light Bulb", type: "artificial", luminous: true },
        { name: "LED", type: "artificial", luminous: true },
      ],
    },
  },
  {
    id: 7,
    title: "Complete Understanding",
    description: "",
    type: "explanation",
    mode: "learn",
    data: { stage: "complete" },
  },
];

// Practice Mode Component
const PracticeMode: React.FC = () => {
  const { t } = useLanguage();

  const questionsData = t("practice.questions");
  const questions: PracticeQuestion[] = Array.isArray(questionsData) 
    ? questionsData 
    : [];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);

  // Early return if no questions available
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-blue-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-2xl w-full text-center">
          <p className="text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (!showResult) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) {
      alert(t("practice.selectAnswer"));
      return;
    }
    setShowResult(true);
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    setAnsweredQuestions([...answeredQuestions, currentQuestion]);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions([]);
  };

  const isQuizComplete = answeredQuestions.length === questions.length;

  if (isQuizComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-blue-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-2xl w-full">
          <div className="text-center">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {t("practice.complete")}
            </h2>
            <p className="text-xl text-gray-600 mb-2">
              {t("practice.finalScore")}
            </p>
            <p className="text-5xl font-bold text-blue-600 mb-6">
              {score} / {questions.length}
            </p>
            <button
              onClick={handleRestart}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              {t("practice.restart")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 via-teal-500 to-blue-500 text-white p-6">
            <h2 className="text-2xl font-bold mb-2">{t("practice.title")}</h2>
            <p className="text-blue-100">{t("practice.subtitle")}</p>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm bg-white/20 px-4 py-2 rounded-full">
                {t("practice.question")} {currentQuestion + 1} /{" "}
                {questions.length}
              </span>
              <span className="text-sm bg-white/20 px-4 py-2 rounded-full">
                {t("practice.score")}: {score}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              {question.question}
            </h3>

            <div className="space-y-3 mb-6">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedAnswer === index
                      ? showResult
                        ? index === question.correctAnswer
                          ? "border-green-500 bg-green-50"
                          : "border-red-500 bg-red-50"
                        : "border-blue-500 bg-blue-50"
                      : showResult && index === question.correctAnswer
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                  } ${showResult ? "cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <div className="flex items-center">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-700 mr-3">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="font-medium text-gray-800">{option}</span>
                    {showResult && (
                      <span className="ml-auto">
                        {index === question.correctAnswer ? (
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        ) : selectedAnswer === index ? (
                          <XCircle className="w-6 h-6 text-red-500" />
                        ) : null}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {showResult && (
              <div
                className={`p-4 rounded-lg mb-6 ${
                  selectedAnswer === question.correctAnswer
                    ? "bg-green-50 border-2 border-green-200"
                    : "bg-red-50 border-2 border-red-200"
                }`}
              >
                <p className="font-semibold text-lg mb-2">
                  {selectedAnswer === question.correctAnswer
                    ? t("practice.correct")
                    : t("practice.incorrect")}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">
                    {t("practice.explanation")}
                  </span>{" "}
                  {question.explanation}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              {!showResult ? (
                <button
                  onClick={handleCheckAnswer}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  {t("practice.checkAnswer")}
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  disabled={currentQuestion === questions.length - 1}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t("practice.nextQuestion")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Real World Applications Component
const RealWorldMode: React.FC = () => {
  const { t } = useLanguage();

  const applicationsData = t("realWorld.applications");
  const applications: RealWorldApp[] = Array.isArray(applicationsData)
    ? applicationsData
    : [];

  // Early return if no applications available
  if (applications.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-blue-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-2xl w-full text-center">
          <p className="text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-500 via-teal-500 to-blue-500 text-white p-6">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              {t("realWorld.title")}
            </h2>
            <p className="text-blue-100">{t("realWorld.subtitle")}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 border-2 border-transparent hover:border-blue-300"
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl flex-shrink-0">{app.icon}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {app.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {app.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface SourcesOfLightProps {
  width?: number;
  height?: number;
  steps?: Step[];
  mode: "learn" | "practice" | "applications";
  setMode: (mode: "learn" | "practice" | "applications") => void;
}

const SourcesOfLight: React.FC<SourcesOfLightProps> = ({
  width = 800,
  height = 600,
  steps: propSteps,
  mode: _mode,
  setMode: _setMode,
}) => {
  const { t } = useLanguage();
  const [currentMode, setCurrentMode] = useState<StepMode>("learn");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const steps = useMemo(() => propSteps || DEFAULT_STEPS, [propSteps]);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const modeSteps = useMemo(
    () => steps.filter((step) => step.mode === currentMode),
    [steps, currentMode]
  );
  const currentStep = modeSteps[currentStepIndex];

  // Reset step index when mode changes
  useEffect(() => {
    setCurrentStepIndex(0);
  }, [currentMode]);

  // Initialize particles for light rays
  useEffect(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 20; i++) {
      newParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1,
        size: Math.random() * 3 + 2,
        opacity: Math.random() * 0.6 + 0.4,
        color: "#FFD700",
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
      setAnimationProgress((prev) => (prev + 0.01) % 1);
      setParticles((prevParticles) =>
        prevParticles.map((p) => ({
          ...p,
          x: (p.x + p.vx + width) % width,
          y: (p.y + p.vy + height) % height,
          opacity: 0.3 + Math.sin(animationProgress * Math.PI * 2 + p.x) * 0.3,
        }))
      );
      animationFrameRef.current = window.requestAnimationFrame(animate);
    };

    animationFrameRef.current = window.requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [height, width, animationProgress]);

  // Draw on canvas
  useEffect(() => {
    if (!canvasRef.current || !currentStep) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const stage = currentStep.data.stage;
    const lightObjects = currentStep.data.lightObjects || [];

    drawLightSources(
      ctx,
      width,
      height,
      stage,
      lightObjects,
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

  // Shared Navbar Component
  const renderNavbar = () => {
    const activeMode = currentMode;
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-50 via-teal-50 to-blue-50 border-b border-blue-200/50 shadow-sm backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0 flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-blue-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                {t("nav.logo")}
              </span>
            </div>

            {/* Mode Buttons */}
            <div className="flex items-center gap-2 mx-2 sm:mx-4">
              <button
                onClick={() => setCurrentMode("learn")}
                className={`px-3 sm:px-4 py-2 rounded-lg font-semibold text-sm sm:text-base transition-all ${
                  activeMode === "learn"
                    ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {t("nav.tabs.learn")}
              </button>
              <button
                onClick={() => setCurrentMode("practice")}
                className={`px-3 sm:px-4 py-2 rounded-lg font-semibold text-sm sm:text-base transition-all ${
                  activeMode === "practice"
                    ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {t("nav.tabs.practice")}
              </button>
              <button
                onClick={() => setCurrentMode("real_world")}
                className={`px-3 sm:px-4 py-2 rounded-lg font-semibold text-sm sm:text-base transition-all ${
                  activeMode === "real_world"
                    ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {t("nav.tabs.real_world")}
              </button>
            </div>

            <div className="ml-auto flex items-center gap-4">
              <LanguageSelector />
            </div>
          </div>
        </div>
      </nav>
    );
  };

  // Render Practice Mode
  if (currentMode === "practice") {
    return (
      <div className="w-full">
        {renderNavbar()}
        <div className="mt-20">
          <PracticeMode />
        </div>
      </div>
    );
  }

  // Render Real World Mode
  if (currentMode === "real_world") {
    return (
      <div className="w-full">
        {renderNavbar()}
        <div className="mt-20">
          <RealWorldMode />
        </div>
      </div>
    );
  }

  // Render Learn Mode (default)
  if (!currentStep) {
    return <div className="text-center p-8">No steps available</div>;
  }

  const stepKey = currentStep.data.stage;
  const title = t(`steps.${stepKey}.title`);
  const description = t(`steps.${stepKey}.description`);

  return (
    <div className="w-full max-w-7xl mx-auto mt-20">
      {renderNavbar()}

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 via-teal-500 to-blue-500 text-white p-4 sm:p-6">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h2 className="text-xl sm:text-2xl font-semibold">{title}</h2>
            <div className="text-sm bg-white/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full backdrop-blur-sm">
              {t("controls.step")} {currentStepIndex + 1} {t("controls.of")}{" "}
              {modeSteps.length}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-8">
          <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-xl shadow-lg p-4 sm:p-6 mb-6">
            <canvas
              ref={canvasRef}
              width={width}
              height={height}
              className="w-full border-2 border-blue-300 rounded-lg"
            />
          </div>

          <div className="bg-gradient-to-r from-blue-50 via-teal-50 to-blue-50 rounded-xl p-4 sm:p-6 mb-6 border-l-4 border-blue-500">
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
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex-1 sm:flex-none"
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
              className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all w-full sm:w-auto"
            >
              {t("controls.next")}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 via-teal-600 to-blue-600 transition-all duration-300 rounded-full"
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

// Drawing function for light sources
function drawLightSources(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  stage: LearnStage,
  lightObjects: Array<{ name: string; type: string; luminous: boolean }>,
  progress: number,
  particles: Particle[],
  t: (key: string) => string
) {
  // Dark background
  const bgGradient = ctx.createRadialGradient(
    width / 2,
    height / 2,
    0,
    width / 2,
    height / 2,
    width / 2
  );
  bgGradient.addColorStop(0, "#1e293b");
  bgGradient.addColorStop(1, "#0f172a");
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  // Stars background
  for (let i = 0; i < 50; i++) {
    const x = (i * 137) % width;
    const y = (i * 173) % height;
    const twinkle = Math.sin(progress * Math.PI * 2 + i) * 0.5 + 0.5;

    ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + twinkle * 0.7})`;
    ctx.beginPath();
    ctx.arc(x, y, 1 + twinkle, 0, Math.PI * 2);
    ctx.fill();
  }

  if (stage === "overview") {
    drawOverview(ctx, width, height, progress, t);
  } else if (stage === "luminous_objects") {
    drawLuminousObjects(ctx, width, height, lightObjects, progress, t);
  } else if (stage === "non_luminous_objects") {
    drawNonLuminousObjects(ctx, width, height, progress, t);
  } else if (stage === "natural_sources") {
    drawNaturalSources(ctx, width, height, lightObjects, progress, t);
  } else if (stage === "artificial_sources") {
    drawArtificialSources(ctx, width, height, lightObjects, progress, t);
  } else if (stage === "complete") {
    drawComplete(ctx, width, height, progress, particles, t);
  }
}

function drawOverview(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  t: (key: string) => string
) {
  const centerX = width / 2;
  const centerY = height / 2;

  // Central sun
  const sunRadius = 60 + Math.sin(progress * Math.PI * 2) * 10;
  const sunGradient = ctx.createRadialGradient(
    centerX,
    centerY,
    0,
    centerX,
    centerY,
    sunRadius
  );
  sunGradient.addColorStop(0, "#FFF4B0");
  sunGradient.addColorStop(0.5, "#FFD700");
  sunGradient.addColorStop(1, "#FFA500");

  ctx.fillStyle = sunGradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, sunRadius, 0, Math.PI * 2);
  ctx.fill();

  // Sun rays
  ctx.strokeStyle = "#FFD700";
  ctx.lineWidth = 4;
  for (let i = 0; i < 12; i++) {
    const angle = (i * 30 + progress * 180) * (Math.PI / 180);
    const rayStart = sunRadius + 10;
    const rayEnd = sunRadius + 40;

    ctx.globalAlpha = 0.6 + Math.sin(progress * Math.PI * 2 + i) * 0.4;
    ctx.beginPath();
    ctx.moveTo(
      centerX + Math.cos(angle) * rayStart,
      centerY + Math.sin(angle) * rayStart
    );
    ctx.lineTo(
      centerX + Math.cos(angle) * rayEnd,
      centerY + Math.sin(angle) * rayEnd
    );
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Orbiting light sources
  const orbitRadius = 150;
  const numObjects = 6;

  for (let i = 0; i < numObjects; i++) {
    const angle = (i * (360 / numObjects) + progress * 60) * (Math.PI / 180);
    const x = centerX + Math.cos(angle) * orbitRadius;
    const y = centerY + Math.sin(angle) * orbitRadius;

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, 15);
    gradient.addColorStop(0, "#FFF");
    gradient.addColorStop(0.5, "#60A5FA");
    gradient.addColorStop(1, "rgba(96, 165, 250, 0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#3B82F6";
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  // Title text
  ctx.fillStyle = "#FFF";
  ctx.font = "bold 28px Poppins, sans-serif";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 10;
  ctx.fillText(t("canvas.overview.title"), centerX, height - 50);
  ctx.shadowBlur = 0;
}

function drawLuminousObjects(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  lightObjects: Array<{ name: string }>,
  progress: number,
  t: (key: string) => string
) {
  const numObjects = lightObjects.length;
  const spacing = width / (numObjects + 1);
  const yPos = height / 2;

  lightObjects.forEach((obj, idx) => {
    const x = spacing * (idx + 1);
    const pulseSize = 40 + Math.sin(progress * Math.PI * 2 + idx) * 8;

    // Outer glow
    const outerGlow = ctx.createRadialGradient(
      x,
      yPos,
      0,
      x,
      yPos,
      pulseSize + 30
    );
    outerGlow.addColorStop(0, "rgba(255, 215, 0, 0.8)");
    outerGlow.addColorStop(0.5, "rgba(255, 165, 0, 0.4)");
    outerGlow.addColorStop(1, "rgba(255, 165, 0, 0)");

    ctx.fillStyle = outerGlow;
    ctx.beginPath();
    ctx.arc(x, yPos, pulseSize + 30, 0, Math.PI * 2);
    ctx.fill();

    // Main object
    const gradient = ctx.createRadialGradient(x, yPos, 0, x, yPos, pulseSize);
    gradient.addColorStop(0, "#FFF4B0");
    gradient.addColorStop(0.5, "#FFD700");
    gradient.addColorStop(1, "#FFA500");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, yPos, pulseSize, 0, Math.PI * 2);
    ctx.fill();

    // Light rays
    ctx.strokeStyle = "rgba(255, 215, 0, 0.6)";
    ctx.lineWidth = 3;
    for (let i = 0; i < 8; i++) {
      const angle = (i * 45 + progress * 180) * (Math.PI / 180);
      const rayStart = pulseSize + 5;
      const rayEnd = pulseSize + 25;

      ctx.beginPath();
      ctx.moveTo(
        x + Math.cos(angle) * rayStart,
        yPos + Math.sin(angle) * rayStart
      );
      ctx.lineTo(x + Math.cos(angle) * rayEnd, yPos + Math.sin(angle) * rayEnd);
      ctx.stroke();
    }

    // Label
    ctx.fillStyle = "#FFF";
    ctx.font = "bold 16px Poppins, sans-serif";
    ctx.textAlign = "center";
    ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
    ctx.shadowBlur = 8;
    ctx.fillText(obj.name, x, yPos + pulseSize + 50);
    ctx.shadowBlur = 0;
  });

  // Title
  ctx.fillStyle = "#FFD700";
  ctx.font = "bold 24px Poppins, sans-serif";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 10;
  ctx.fillText(t("canvas.luminous_objects.title"), width / 2, 50);
  ctx.shadowBlur = 0;
}

function drawNonLuminousObjects(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  t: (key: string) => string
) {
  // Sun (light source)
  const sunX = width * 0.2;
  const sunY = height * 0.3;
  const sunRadius = 50;

  const sunGradient = ctx.createRadialGradient(
    sunX,
    sunY,
    0,
    sunX,
    sunY,
    sunRadius
  );
  sunGradient.addColorStop(0, "#FFF4B0");
  sunGradient.addColorStop(0.5, "#FFD700");
  sunGradient.addColorStop(1, "#FFA500");

  ctx.fillStyle = sunGradient;
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
  ctx.fill();

  // Sun rays
  ctx.strokeStyle = "rgba(255, 215, 0, 0.5)";
  ctx.lineWidth = 3;
  for (let i = 0; i < 12; i++) {
    const angle = (i * 30 + progress * 180) * (Math.PI / 180);
    ctx.beginPath();
    ctx.moveTo(
      sunX + Math.cos(angle) * (sunRadius + 5),
      sunY + Math.sin(angle) * (sunRadius + 5)
    );
    ctx.lineTo(
      sunX + Math.cos(angle) * (sunRadius + 25),
      sunY + Math.sin(angle) * (sunRadius + 25)
    );
    ctx.stroke();
  }

  // Moon (non-luminous)
  const moonX = width * 0.7;
  const moonY = height * 0.5;
  const moonRadius = 60;

  // Light rays from sun to moon
  ctx.strokeStyle = "rgba(255, 215, 0, 0.3)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    const offset = (i - 2) * 15;
    ctx.beginPath();
    ctx.moveTo(sunX + sunRadius, sunY + offset);
    ctx.lineTo(moonX - moonRadius, moonY + offset);
    ctx.stroke();
  }

  // Moon body
  ctx.fillStyle = "#CBD5E1";
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
  ctx.fill();

  // Moon craters
  ctx.fillStyle = "#94A3B8";
  ctx.beginPath();
  ctx.arc(moonX - 20, moonY - 15, 12, 0, Math.PI * 2);
  ctx.arc(moonX + 15, moonY + 10, 8, 0, Math.PI * 2);
  ctx.arc(moonX + 5, moonY - 25, 10, 0, Math.PI * 2);
  ctx.fill();

  // Reflected light on moon
  const reflectGradient = ctx.createRadialGradient(
    moonX - 20,
    moonY - 20,
    0,
    moonX - 20,
    moonY - 20,
    40
  );
  reflectGradient.addColorStop(0, "rgba(255, 255, 255, 0.5)");
  reflectGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

  ctx.fillStyle = reflectGradient;
  ctx.beginPath();
  ctx.arc(moonX - 20, moonY - 20, 40, 0, Math.PI * 2);
  ctx.fill();

  // Labels
  ctx.fillStyle = "#FFD700";
  ctx.font = "bold 16px Poppins, sans-serif";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
  ctx.shadowBlur = 8;
  ctx.fillText(t("canvas.non_luminous_objects.sunLabel"), sunX, sunY + sunRadius + 30);

  ctx.fillStyle = "#FFF";
  ctx.fillText(t("canvas.non_luminous_objects.moonLabel"), moonX, moonY + moonRadius + 30);
  ctx.font = "14px Poppins, sans-serif";
  ctx.fillText(t("canvas.non_luminous_objects.reflectsLabel"), moonX, moonY + moonRadius + 50);
  ctx.shadowBlur = 0;

  // Title
  ctx.fillStyle = "#60A5FA";
  ctx.font = "bold 24px Poppins, sans-serif";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 10;
  ctx.fillText(t("canvas.non_luminous_objects.title"), width / 2, 50);
  ctx.shadowBlur = 0;
}

function drawNaturalSources(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  lightObjects: Array<{ name: string }>,
  progress: number,
  t: (key: string) => string
) {
  const centerY = height / 2;
  const spacing = width / (lightObjects.length + 1);

  lightObjects.forEach((obj, idx) => {
    const x = spacing * (idx + 1);
    const size = 35 + Math.sin(progress * Math.PI * 2 + idx * 0.5) * 5;

    // Icon-specific rendering
    if (obj.name === "Sun") {
      const gradient = ctx.createRadialGradient(
        x,
        centerY,
        0,
        x,
        centerY,
        size + 20
      );
      gradient.addColorStop(0, "#FFF");
      gradient.addColorStop(0.3, "#FFD700");
      gradient.addColorStop(1, "rgba(255, 165, 0, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, centerY, size + 20, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#FFD700";
      ctx.beginPath();
      ctx.arc(x, centerY, size, 0, Math.PI * 2);
      ctx.fill();

      // Rays
      ctx.strokeStyle = "#FFA500";
      ctx.lineWidth = 3;
      for (let i = 0; i < 12; i++) {
        const angle = (i * 30 + progress * 120) * (Math.PI / 180);
        ctx.beginPath();
        ctx.moveTo(
          x + Math.cos(angle) * (size + 5),
          centerY + Math.sin(angle) * (size + 5)
        );
        ctx.lineTo(
          x + Math.cos(angle) * (size + 20),
          centerY + Math.sin(angle) * (size + 20)
        );
        ctx.stroke();
      }
    } else if (obj.name === "Stars") {
      for (let i = 0; i < 5; i++) {
        const starX = x + (i - 2) * 20;
        const starSize = 3 + Math.sin(progress * Math.PI * 4 + i) * 2;
        ctx.fillStyle = "#FFF";
        ctx.beginPath();
        ctx.arc(starX, centerY, starSize, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (obj.name === "Lightning") {
      ctx.strokeStyle = "#60A5FA";
      ctx.lineWidth = 4;
      ctx.shadowColor = "#60A5FA";
      ctx.shadowBlur = 15;

      ctx.beginPath();
      ctx.moveTo(x, centerY - 40);
      ctx.lineTo(x - 10, centerY - 10);
      ctx.lineTo(x + 10, centerY);
      ctx.lineTo(x - 5, centerY + 30);
      ctx.stroke();

      ctx.shadowBlur = 0;
    } else if (obj.name === "Fireflies") {
      const glowIntensity = Math.sin(progress * Math.PI * 4) * 0.5 + 0.5;
      const gradient = ctx.createRadialGradient(x, centerY, 0, x, centerY, 25);
      gradient.addColorStop(0, `rgba(255, 255, 100, ${glowIntensity})`);
      gradient.addColorStop(1, "rgba(255, 255, 100, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, centerY, 25, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(180, 255, 100, ${0.8 + glowIntensity * 0.2})`;
      ctx.beginPath();
      ctx.arc(x, centerY, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Label
    ctx.fillStyle = "#FFF";
    ctx.font = "bold 14px Poppins, sans-serif";
    ctx.textAlign = "center";
    ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
    ctx.shadowBlur = 8;
    const labelKey = `canvas.natural_sources.${obj.name.toLowerCase().replace(/\s+/g, "_")}`;
    ctx.fillText(t(labelKey) || obj.name, x, centerY + 70);
    ctx.shadowBlur = 0;
  });

  // Title
  ctx.fillStyle = "#34D399";
  ctx.font = "bold 24px Poppins, sans-serif";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 10;
  ctx.fillText(t("canvas.natural_sources.title"), width / 2, 50);
  ctx.shadowBlur = 0;
}

function drawArtificialSources(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  lightObjects: Array<{ name: string }>,
  progress: number,
  t: (key: string) => string
) {
  const centerY = height / 2;
  const spacing = width / (lightObjects.length + 1);

  lightObjects.forEach((obj, idx) => {
    const x = spacing * (idx + 1);

    if (obj.name === "Candle") {
      // Candle body
      ctx.fillStyle = "#F3E5AB";
      ctx.fillRect(x - 10, centerY, 20, 60);

      // Flame
      const flameSize = 20 + Math.sin(progress * Math.PI * 4 + idx) * 3;
      const flameGradient = ctx.createRadialGradient(
        x,
        centerY - 10,
        0,
        x,
        centerY - 10,
        flameSize
      );
      flameGradient.addColorStop(0, "#FFF");
      flameGradient.addColorStop(0.4, "#FFD700");
      flameGradient.addColorStop(1, "#FF4500");

      ctx.fillStyle = flameGradient;
      ctx.beginPath();
      ctx.ellipse(x, centerY - 10, 12, flameSize, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (obj.name === "Oil Lamp") {
      // Oil lamp glow effect
      const lampGlow = ctx.createRadialGradient(
        x,
        centerY - 20,
        0,
        x,
        centerY - 20,
        50
      );
      lampGlow.addColorStop(0, "rgba(255, 215, 0, 0.3)");
      lampGlow.addColorStop(0.5, "rgba(255, 165, 0, 0.15)");
      lampGlow.addColorStop(1, "rgba(255, 165, 0, 0)");

      ctx.fillStyle = lampGlow;
      ctx.beginPath();
      ctx.arc(x, centerY - 20, 50, 0, Math.PI * 2);
      ctx.fill();

      // Lamp base (container) - bottom part
      const baseGradient = ctx.createLinearGradient(
        x - 20,
        centerY + 25,
        x + 20,
        centerY + 25
      );
      baseGradient.addColorStop(0, "#654321");
      baseGradient.addColorStop(0.5, "#8B4513");
      baseGradient.addColorStop(1, "#654321");

      ctx.fillStyle = baseGradient;
      ctx.beginPath();
      ctx.ellipse(x, centerY + 25, 22, 18, 0, 0, Math.PI * 2);
      ctx.fill();

      // Lamp body (glass/container) - main part
      const bodyGradient = ctx.createLinearGradient(
        x - 15,
        centerY - 5,
        x + 15,
        centerY + 15
      );
      bodyGradient.addColorStop(0, "rgba(139, 69, 19, 0.8)");
      bodyGradient.addColorStop(0.3, "rgba(160, 82, 45, 0.9)");
      bodyGradient.addColorStop(0.7, "rgba(139, 69, 19, 0.9)");
      bodyGradient.addColorStop(1, "rgba(101, 67, 33, 0.8)");

      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      ctx.ellipse(x, centerY + 5, 18, 25, 0, 0, Math.PI * 2);
      ctx.fill();

      // Oil level indicator (inside the lamp)
      ctx.fillStyle = "rgba(255, 215, 0, 0.4)";
      ctx.beginPath();
      ctx.ellipse(x, centerY + 12, 12, 15, 0, 0, Math.PI * 2);
      ctx.fill();

      // Lamp neck/spout
      ctx.fillStyle = "#654321";
      ctx.beginPath();
      ctx.ellipse(x, centerY - 8, 8, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      // Wick (coming out of the spout)
      ctx.strokeStyle = "#4A4A4A";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, centerY - 8);
      ctx.lineTo(x, centerY - 25);
      ctx.stroke();

      // Flame with proper animation
      const flameSize = 16 + Math.sin(progress * Math.PI * 4 + idx) * 4;
      const flameGradient = ctx.createRadialGradient(
        x,
        centerY - 28,
        0,
        x,
        centerY - 28,
        flameSize
      );
      flameGradient.addColorStop(0, "#FFFFFF");
      flameGradient.addColorStop(0.2, "#FFD700");
      flameGradient.addColorStop(0.5, "#FFA500");
      flameGradient.addColorStop(0.8, "#FF6347");
      flameGradient.addColorStop(1, "rgba(255, 99, 71, 0)");

      ctx.fillStyle = flameGradient;
      ctx.beginPath();
      // Draw a more realistic flame shape
      ctx.ellipse(x, centerY - 28, 8, flameSize, 0, 0, Math.PI * 2);
      ctx.fill();

      // Inner flame core (brighter)
      const innerFlameSize = flameSize * 0.6;
      const innerGradient = ctx.createRadialGradient(
        x,
        centerY - 28,
        0,
        x,
        centerY - 28,
        innerFlameSize
      );
      innerGradient.addColorStop(0, "#FFFFFF");
      innerGradient.addColorStop(0.5, "#FFD700");
      innerGradient.addColorStop(1, "rgba(255, 215, 0, 0)");

      ctx.fillStyle = innerGradient;
      ctx.beginPath();
      ctx.ellipse(x, centerY - 28, 5, innerFlameSize, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (obj.name === "Light Bulb") {
      // Bulb glow
      const glowGradient = ctx.createRadialGradient(
        x,
        centerY,
        0,
        x,
        centerY,
        45
      );
      glowGradient.addColorStop(0, "rgba(255, 255, 200, 0.8)");
      glowGradient.addColorStop(0.5, "rgba(255, 215, 0, 0.4)");
      glowGradient.addColorStop(1, "rgba(255, 215, 0, 0)");

      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(x, centerY, 45, 0, Math.PI * 2);
      ctx.fill();

      // Bulb body
      ctx.fillStyle = "#FFF9E6";
      ctx.beginPath();
      ctx.arc(x, centerY, 30, 0, Math.PI * 2);
      ctx.fill();

      // Bulb base
      ctx.fillStyle = "#64748B";
      ctx.fillRect(x - 12, centerY + 25, 24, 15);
    } else if (obj.name === "LED") {
      // LED glow (more efficient, focused)
      const ledGradient = ctx.createRadialGradient(
        x,
        centerY,
        0,
        x,
        centerY,
        35
      );
      ledGradient.addColorStop(0, "rgba(100, 200, 255, 1)");
      ledGradient.addColorStop(0.5, "rgba(59, 130, 246, 0.5)");
      ledGradient.addColorStop(1, "rgba(59, 130, 246, 0)");

      ctx.fillStyle = ledGradient;
      ctx.beginPath();
      ctx.arc(x, centerY, 35, 0, Math.PI * 2);
      ctx.fill();

      // LED chip
      ctx.fillStyle = "#3B82F6";
      ctx.beginPath();
      ctx.arc(x, centerY, 20, 0, Math.PI * 2);
      ctx.fill();

      // LED base
      ctx.fillStyle = "#64748B";
      ctx.fillRect(x - 10, centerY + 18, 20, 12);
    }

    // Label
    ctx.fillStyle = "#FFF";
    ctx.font = "bold 14px Poppins, sans-serif";
    ctx.textAlign = "center";
    ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
    ctx.shadowBlur = 8;
    const labelKey = `canvas.artificial_sources.${obj.name.toLowerCase().replace(/\s+/g, "_")}`;
    ctx.fillText(t(labelKey) || obj.name, x, centerY + 90);
    ctx.shadowBlur = 0;
  });

  // Title
  ctx.fillStyle = "#F59E0B";
  ctx.font = "bold 24px Poppins, sans-serif";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 10;
  ctx.fillText(t("canvas.artificial_sources.title"), width / 2, 50);
  ctx.shadowBlur = 0;
}

function drawComplete(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  particles: Particle[],
  t: (key: string) => string
) {
  const centerX = width / 2;
  const centerY = height / 2;

  // Animated particles representing light
  particles.forEach((p) => {
    const gradient = ctx.createRadialGradient(
      p.x,
      p.y,
      0,
      p.x,
      p.y,
      p.size * 2
    );
    gradient.addColorStop(0, `rgba(255, 215, 0, ${p.opacity})`);
    gradient.addColorStop(1, "rgba(255, 215, 0, 0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = `rgba(255, 255, 100, ${p.opacity})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  });

  // Central celebration burst
  const burstSize = 80 + Math.sin(progress * Math.PI * 2) * 20;
  const burstGradient = ctx.createRadialGradient(
    centerX,
    centerY,
    0,
    centerX,
    centerY,
    burstSize
  );
  burstGradient.addColorStop(0, "#FFF");
  burstGradient.addColorStop(0.3, "#FFD700");
  burstGradient.addColorStop(0.6, "#3B82F6");
  burstGradient.addColorStop(1, "rgba(59, 130, 246, 0)");

  ctx.fillStyle = burstGradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, burstSize, 0, Math.PI * 2);
  ctx.fill();

  // Lightbulb icon
  ctx.fillStyle = "#FFD700";
  ctx.font = "80px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("💡", centerX, centerY);

  // Orbiting icons
  const icons = ["☀️", "⭐", "⚡", "🔥", "💡"];
  const orbitRadius = 120;

  icons.forEach((icon, idx) => {
    const angle =
      (idx * (360 / icons.length) + progress * 90) * (Math.PI / 180);
    const x = centerX + Math.cos(angle) * orbitRadius;
    const y = centerY + Math.sin(angle) * orbitRadius;

    ctx.font = "40px Arial";
    ctx.fillText(icon, x, y);
  });

  // Completion text
  ctx.fillStyle = "#FFF";
  ctx.font = "bold 32px Poppins, sans-serif";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
  ctx.shadowBlur = 15;
  ctx.fillText(t("canvas.complete.title"), centerX, height - 80);

  ctx.font = "18px Poppins, sans-serif";
  ctx.fillText(t("canvas.complete.message"), centerX, height - 50);
  ctx.shadowBlur = 0;
}

export default SourcesOfLight;
