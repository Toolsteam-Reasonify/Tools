import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import translationsData from "../locales/translation.json";

// Type declarations for browser extension APIs to prevent TypeScript errors
declare global {
  interface Window {
    chrome?: {
      runtime?: {
        lastError?: { message?: string };
        sendMessage?: (...args: unknown[]) => unknown;
        connect?: (...args: unknown[]) => unknown;
        sendNativeMessage?: (...args: unknown[]) => unknown;
      };
    };
    browser?: {
      runtime?: {
        sendMessage?: (...args: unknown[]) => unknown;
        connect?: (...args: unknown[]) => unknown;
      };
    };
  }
}

// Simple icon components
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



const BookOpen = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const ClipboardCheck = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9l2 2 4-4" />
  </svg>
);

const Globe = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

type Language = "en" | "hi" | "gu";
type TabType = "learn" | "practice" | "realWorld";



interface RealWorldApp {
  id: number;
  title: string;
  description: string;
  icon: string;
  category: string;
  example: string;
  materialType?: "transparent" | "translucent" | "opaque" | "mixed";
}

// Translation type definition
type TranslationValue =
  | string
  | string[]
  | number
  | { [key: string]: TranslationValue }
  | Array<{ [key: string]: TranslationValue }>;
type Translations = Record<Language, TranslationValue>;

// Translation system - Load from JSON file
const translations: Translations = translationsData as Translations;

// Language Context
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  tValue: (key: string) => TranslationValue;
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
    localStorage.setItem("lightMaterialsLang", lang);
  };

  useEffect(() => {
    const saved = localStorage.getItem("lightMaterialsLang") as Language;
    if (saved && ["en", "hi", "gu"].includes(saved)) {
      setLanguageState(saved);
    }
  }, []);

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: TranslationValue = translations[language];
    for (const k of keys) {
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        value = (value as Record<string, TranslationValue>)[k];
        if (value === undefined) {
          return key;
        }
      } else {
        return key;
      }
    }
    return typeof value === "string" ? value : key;
  };

  const tValue = (key: string): TranslationValue => {
    const keys = key.split(".");
    let value: TranslationValue = translations[language];
    for (const k of keys) {
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        value = (value as Record<string, TranslationValue>)[k];
        if (value === undefined) {
          return key;
        }
      } else {
        return key;
      }
    }
    return value !== undefined ? value : key;
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleSetLanguage, t, tValue }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};

// Language Selector
const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "hi", name: "हिंदी", flag: "🇮🇳" },
    { code: "gu", name: "ગુજરાતી", flag: "🇮🇳" },
  ];

  return (
    <div className="relative">
      <select
        aria-label="Select Language"
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

// Default steps data for Topic 11.3
interface LightTravelProps {
  width?: number;
  height?: number;
}

export const LightTravelStraightLine: React.FC<LightTravelProps> = () => {
  const { t } = useLanguage();
  const [lightPos, setLightPos] = useState({ x: 150, y: 150 });
  const [objectPos, setObjectPos] = useState({ x: 400, y: 250 });
  const [screenPos, setScreenPos] = useState(650);
  const [selectedObject, setSelectedObject] = useState('cat');
  const [lightSize, setLightSize] = useState<'small' | 'large'>('small');
  const [dragging, setDragging] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [showRays, setShowRays] = useState(true);

  const objects: Record<string, { emoji: string; name: string; opacity: number; color: string }> = {
    cat: { emoji: '🐱', name: t('shadowSimulator.objects.cat'), opacity: 1, color: '#FF6B9D' },
    superhero: { emoji: '🦸', name: t('shadowSimulator.objects.superhero'), opacity: 1, color: '#4A90E2' },
    bottle: { emoji: '🍼', name: t('shadowSimulator.objects.bottle'), opacity: 0.3, color: '#66D9EF' },
    glass: { emoji: '🧊', name: t('shadowSimulator.objects.glass'), opacity: 0.5, color: '#A8E6CF' },
    paper: { emoji: '📄', name: t('shadowSimulator.objects.paper'), opacity: 1, color: '#FFE66D' },
    football: { emoji: '⚽', name: t('shadowSimulator.objects.football'), opacity: 1, color: '#FF6B35' },
    tree: { emoji: '🌲', name: t('shadowSimulator.objects.tree'), opacity: 1, color: '#2ECC71' }
  };

  const currentObject = objects[selectedObject];

  const calculateShadow = () => {
    const shadowX = screenPos;
    const distanceToLight = Math.sqrt(
      Math.pow(objectPos.x - lightPos.x, 2) +
      Math.pow(objectPos.y - lightPos.y, 2)
    );
    const distanceToScreen = Math.abs(screenPos - objectPos.x);

    const scale = 1 + (distanceToScreen / distanceToLight) * 2;
    const shadowY = lightPos.y + (objectPos.y - lightPos.y) * ((screenPos - lightPos.x) / (objectPos.x - lightPos.x));

    return { x: shadowX, y: shadowY, scale, blur: lightSize === 'large' ? 20 : 2 };
  };

  const shadow = calculateShadow();

  const giveFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(''), 2500);
  };

  const handleMouseDown = (type: string, e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(type);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!dragging) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (dragging === 'light') {
      setLightPos({ x: Math.max(50, Math.min(300, x)), y: Math.max(50, Math.min(450, y)) });
    } else if (dragging === 'object') {
      const newX = Math.max(320, Math.min(screenPos - 50, x));
      const oldX = objectPos.x;
      setObjectPos({ x: newX, y: Math.max(50, Math.min(450, y)) });

      if (Math.abs(newX - lightPos.x) < Math.abs(oldX - lightPos.x)) {
        giveFeedback(t('shadowSimulator.feedback.shadowBig'));
      } else if (Math.abs(newX - screenPos) < 80) {
        giveFeedback(t('shadowSimulator.feedback.shadowTiny'));
      }
    } else if (dragging === 'screen') {
      const newScreen = Math.max(500, Math.min(750, x));
      setScreenPos(newScreen);
      if (newScreen < screenPos) {
        giveFeedback(t('shadowSimulator.feedback.shadowShrinking'));
      }
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  const getLightRays = () => {
    const rays: JSX.Element[] = [];
    const numRays = 8;
    const objectSize = 40;

    for (let i = 0; i < numRays; i++) {
      const angle = (Math.PI * 2 / numRays) * i;
      const rayX = Math.cos(angle) * objectSize + objectPos.x;
      const rayY = Math.sin(angle) * objectSize + objectPos.y;

      const blocked = Math.sqrt(Math.pow(rayX - objectPos.x, 2) + Math.pow(rayY - objectPos.y, 2)) < objectSize;

      if (!blocked || rayX > objectPos.x) {
        rays.push(
          <line
            key={i}
            x1={lightPos.x}
            y1={lightPos.y}
            x2={rayX > objectPos.x ? screenPos : rayX}
            y2={rayX > objectPos.x ? lightPos.y + (rayY - lightPos.y) * ((screenPos - lightPos.x) / (rayX - lightPos.x)) : rayY}
            stroke={rayX > objectPos.x ? '#FFE66D' : '#FFF176'}
            strokeWidth="1"
            opacity={rayX > objectPos.x ? '0.3' : '0.6'}
          />
        );
      }
    }
    return rays;
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-2">
            🌟 {t('shadowSimulator.title')} 🌟
          </h1>
          <p className="text-gray-700 text-base sm:text-lg">{t('shadowSimulator.subtitle')}</p>
        </div>

        {/* Feedback Banner */}
        {feedback && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-lg sm:text-xl font-bold shadow-2xl animate-bounce z-50">
            {feedback}
          </div>
        )}

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Control Panel */}
          <div className="w-full lg:w-80 bg-white/90 backdrop-blur-md rounded-2xl p-4 sm:p-6 space-y-6 border-2 border-blue-200 shadow-xl">
            <div>
              <h3 className="text-blue-600 font-bold text-lg sm:text-xl mb-3 flex items-center gap-2">
                🎨 {t('shadowSimulator.objects.title')}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(objects).map(([key, obj]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedObject(key);
                      giveFeedback(`${obj.name} ${t('shadowSimulator.objects.selected')}`);
                    }}
                    className={`p-3 sm:p-4 rounded-xl text-3xl sm:text-4xl transition-all transform hover:scale-110 ${selectedObject === key
                      ? 'bg-gradient-to-br from-blue-500 to-teal-500 shadow-lg scale-105'
                      : 'bg-blue-50 hover:bg-blue-100'
                      }`}
                    style={{ borderColor: obj.color, borderWidth: selectedObject === key ? '3px' : '0' }}
                  >
                    {obj.emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-blue-600 font-bold text-lg sm:text-xl mb-3 flex items-center gap-2">
                💡 {t('shadowSimulator.lightSize.title')}
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setLightSize('small');
                    giveFeedback(t('shadowSimulator.lightSize.smallFeedback'));
                  }}
                  className={`w-full p-3 rounded-xl transition-all font-semibold ${lightSize === 'small'
                    ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {t('shadowSimulator.lightSize.small')} 🔦
                </button>
                <button
                  onClick={() => {
                    setLightSize('large');
                    giveFeedback(t('shadowSimulator.lightSize.largeFeedback'));
                  }}
                  className={`w-full p-3 rounded-xl transition-all font-semibold ${lightSize === 'large'
                    ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {t('shadowSimulator.lightSize.large')} 💡
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-blue-600 font-bold text-lg sm:text-xl mb-3">📚 {t('shadowSimulator.shadowFacts.title')}</h3>
              <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-4 text-gray-700 text-sm space-y-2 border-l-4 border-blue-500">
                <p>🔸 {t('shadowSimulator.shadowFacts.opaque')}</p>
                <p>🔹 {t('shadowSimulator.shadowFacts.translucent')}</p>
                <p>🔷 {t('shadowSimulator.shadowFacts.transparent')}</p>
                <p className="mt-3 pt-3 border-t border-blue-200">
                  Current object: <strong className="text-blue-600">{currentObject.opacity === 1 ? t('shadowSimulator.shadowFacts.currentObject.opaque') : currentObject.opacity > 0.5 ? t('shadowSimulator.shadowFacts.currentObject.translucent') : t('shadowSimulator.shadowFacts.currentObject.semiTransparent')}</strong>
                </p>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showRays}
                  onChange={(e) => setShowRays(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded"
                />
                <span className="text-gray-700 font-semibold">{t('shadowSimulator.controls.showRays')}</span>
              </label>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 bg-gradient-to-br from-blue-900 via-teal-900 to-blue-800 rounded-2xl p-4 sm:p-6 md:p-8 border-4 border-blue-400/30 shadow-2xl">
            <svg
              width="100%"
              height="500"
              className="cursor-move"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* Light Rays */}
              {showRays && getLightRays()}

              {/* Screen */}
              <g
                onMouseDown={(e) => handleMouseDown('screen', e)}
                className="cursor-ew-resize"
              >
                <rect
                  x={screenPos}
                  y="0"
                  width="10"
                  height="500"
                  fill="#E8E8E8"
                  stroke="#FFD700"
                  strokeWidth="3"
                  className="transition-all"
                />
                <text x={screenPos + 15} y="30" fill="white" fontSize="14" fontWeight="bold">
                  📺 {t('shadowSimulator.screenLabel')}
                </text>
              </g>

              {/* Shadow */}
              <ellipse
                cx={shadow.x}
                cy={shadow.y}
                rx={30 * shadow.scale}
                ry={30 * shadow.scale}
                fill="black"
                opacity={0.3 + (currentObject.opacity * 0.4)}
                filter={`blur(${shadow.blur}px)`}
                className="transition-all duration-300"
              />

              {/* Object */}
              <g
                onMouseDown={(e) => handleMouseDown('object', e)}
                className="cursor-move"
              >
                <circle
                  cx={objectPos.x}
                  cy={objectPos.y}
                  r="45"
                  fill={currentObject.color}
                  opacity={currentObject.opacity}
                  stroke="white"
                  strokeWidth="3"
                  className="transition-all"
                />
                <text
                  x={objectPos.x}
                  y={objectPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="40"
                  className="pointer-events-none"
                >
                  {currentObject.emoji}
                </text>
                <text x={objectPos.x - 40} y={objectPos.y - 60} fill="white" fontSize="12" fontWeight="bold">
                  {t('shadowSimulator.controls.dragObject')}
                </text>
              </g>

              {/* Light Source */}
              <g
                onMouseDown={(e) => handleMouseDown('light', e)}
                className="cursor-move"
              >
                <circle
                  cx={lightPos.x}
                  cy={lightPos.y}
                  r={lightSize === 'small' ? '20' : '35'}
                  fill="#FFD700"
                  className="transition-all"
                />
                <circle
                  cx={lightPos.x}
                  cy={lightPos.y}
                  r={lightSize === 'small' ? '30' : '50'}
                  fill="#FFD700"
                  opacity="0.3"
                  className="animate-pulse transition-all"
                />
                <text
                  x={lightPos.x}
                  y={lightPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="20"
                >
                  💡
                </text>
                <text x={lightPos.x - 30} y={lightPos.y - 50} fill="white" fontSize="12" fontWeight="bold">
                  {t('shadowSimulator.controls.lightLabel')}
                </text>
              </g>

              {/* Helper Text */}
              {/* This text is moved to the info box below */}
            </svg>

            {/* Info Box */}
            <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white border-l-4 border-blue-400">
              <h4 className="font-bold text-lg mb-2 text-yellow-300">🔬 {t('shadowSimulator.infoBox.title')}</h4>
              <p className="text-sm leading-relaxed">
                {shadow.scale > 2.5
                  ? t('shadowSimulator.infoBox.hugeShadow')
                  : shadow.scale < 1.3
                    ? t('shadowSimulator.infoBox.tinyShadow')
                    : t('shadowSimulator.infoBox.normalShadow')}
              </p>
              <p className="text-sm mt-2 leading-relaxed">
                {lightSize === 'large'
                  ? t('shadowSimulator.infoBox.softEdges')
                  : t('shadowSimulator.infoBox.sharpEdges')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



interface Scenario {
  id: number;
  title: string;
  situation: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  realWorldTip: string;
  imageEmoji: string;
}

// Practice Mode Component
const PracticeMode: React.FC = () => {
  const { t, tValue } = useLanguage();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [completedScenarios, setCompletedScenarios] = useState<number[]>([]);
  const [showSimulation, setShowSimulation] = useState(false);

  // Shadow puppetry simulation
  const [puppetPosition, setPuppetPosition] = useState(50);

  const [puppetShape, setPuppetShape] = useState<'hand' | 'bird' | 'dog'>('hand');

  // Fetch scenarios from translations
  const scenarios = (tValue('practice.scenarios') as unknown as Scenario[]) || [];



  const handleAnswerSelect = (index: number) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    setShowExplanation(true);
    if (selectedAnswer === scenarios[currentScenario].correctAnswer) {
      setCompletedScenarios([...completedScenarios, currentScenario]);
    }
  };

  const handleNext = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setShowSimulation(false);
    }
  };

  const handlePrevious = () => {
    if (currentScenario > 0) {
      setCurrentScenario(currentScenario - 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setShowSimulation(false);
    }
  };

  const getPuppetEmoji = () => {
    switch (puppetShape) {
      case 'hand': return '✋';
      case 'bird': return '🦅';
      case 'dog': return '🐕';
      default: return '✋';
    }
  };

  // Safe access to scenario data
  const currentScenarioData = scenarios[currentScenario];


  if (!currentScenarioData) {
    return <div className="p-8 text-center">{t('practice.loading')}</div>;
  }

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#F8F9FA'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#8E44AD',
        color: 'white',
        padding: '25px',
        borderRadius: '15px',
        marginBottom: '25px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '32px' }}>
          {t('practice.title')}
        </h1>
        <p style={{ margin: '0', fontSize: '16px', opacity: 0.95 }}>
          {t('practice.subtitle')}
        </p>
        <div style={{
          marginTop: '15px',
          display: 'flex',
          gap: '15px',
          flexWrap: 'wrap'
        }}>
          {scenarios.map((_, index) => (
            <div
              key={index}
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: completedScenarios.includes(index)
                  ? '#27AE60'
                  : index === currentScenario
                    ? 'white'
                    : 'rgba(255,255,255,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '14px',
                color: index === currentScenario ? '#8E44AD' : 'white',
                border: index === currentScenario ? '3px solid white' : 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => {
                setCurrentScenario(index);
                setSelectedAnswer(null);
                setShowExplanation(false);
                setShowSimulation(false);
              }}
            >
              {completedScenarios.includes(index) ? '✓' : index + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Simulation for Shadow Puppetry */}
      {currentScenario === 0 && (
        <div style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '15px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '3px solid #FFD700'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px'
          }}>
            <h3 style={{ color: '#8E44AD', margin: '0' }}>
              {t('practice.simulation.title')}
            </h3>
            <button
              onClick={() => setShowSimulation(!showSimulation)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#8E44AD',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >
              {showSimulation ? t('practice.simulation.hide') : t('practice.simulation.show')}
            </button>
          </div>

          {showSimulation && (
            <>
              <p style={{ color: '#555', marginBottom: '20px', fontSize: '14px' }}>
                {t('practice.simulation.intro')}
              </p>

              {/* Stage */}
              <div style={{
                backgroundColor: '#2C3E50',
                height: '250px',
                borderRadius: '10px',
                position: 'relative',
                marginBottom: '20px',
                overflow: 'hidden',
                boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.3)'
              }}>
                {/* Light source */}
                <div style={{
                  position: 'absolute',
                  left: '10%',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '40px',
                  filter: 'drop-shadow(0 0 20px #FFE66D)',
                  zIndex: 10
                }}>
                  🔥
                </div>

                {/* Light rays */}
                <svg style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                  zIndex: 1
                }}>
                  <line
                    x1="10%"
                    y1="50%"
                    x2={`${puppetPosition}%`}
                    y2="45%"
                    stroke="#FFE66D"
                    strokeWidth="2"
                    opacity="0.4"
                  />
                  <line
                    x1="10%"
                    y1="50%"
                    x2={`${puppetPosition}%`}
                    y2="55%"
                    stroke="#FFE66D"
                    strokeWidth="2"
                    opacity="0.4"
                  />
                </svg>

                {/* Puppet */}
                <div style={{
                  position: 'absolute',
                  left: `${puppetPosition}%`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: '50px',
                  zIndex: 5,
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))'
                }}>
                  {getPuppetEmoji()}
                </div>

                {/* Screen */}
                <div style={{
                  position: 'absolute',
                  right: '5%',
                  top: '5%',
                  width: '6px',
                  height: '90%',
                  backgroundColor: '#F0F0F0',
                  boxShadow: '0 0 15px rgba(255,255,255,0.6)',
                  zIndex: 2
                }} />

                {/* Shadow */}
                <div style={{
                  position: 'absolute',
                  right: '5%',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '40px',
                  height: `${80 + (50 - puppetPosition) * 2}px`,
                  backgroundColor: 'rgba(0,0,0,0.9)',
                  borderRadius: '0 20px 20px 0',
                  filter: 'blur(3px)',
                  zIndex: 1
                }} />

                {/* Stage info */}
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '10px',
                  color: 'white',
                  fontSize: '12px',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  padding: '8px 12px',
                  borderRadius: '6px'
                }}>
                  {t('practice.simulation.shadowSize')}: {puppetPosition < 35 ? t('practice.simulation.large') : puppetPosition < 50 ? t('practice.simulation.medium') : t('practice.simulation.small')}
                </div>
              </div>

              {/* Controls */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#2C3E50',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}>
                  {t('practice.simulation.puppetPosLabel')}
                </label>
                <input
                  type="range"
                  min="25"
                  max="70"
                  value={puppetPosition}
                  onChange={(e) => setPuppetPosition(Number(e.target.value))}
                  style={{
                    width: '100%',
                    height: '8px',
                    cursor: 'pointer'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#2C3E50',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}>
                  {t('practice.simulation.puppetShapeLabel')}
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {['hand', 'bird', 'dog'].map((val) => {
                    const shapeKey = val as 'hand' | 'bird' | 'dog';
                    // Need to safely access nested key
                    // But t() returns string. We can use separate keys or manual mapping.
                    // Based on JSON structure: practice.simulation.shapes.hand.label
                    const label = t(`practice.simulation.shapes.${shapeKey}.label`);
                    const emoji = t(`practice.simulation.shapes.${shapeKey}.emoji`);
                    return (
                      <button
                        key={val}
                        onClick={() => setPuppetShape(shapeKey)}
                        style={{
                          padding: '10px 15px',
                          backgroundColor: puppetShape === val ? '#8E44AD' : '#ECF0F1',
                          color: puppetShape === val ? 'white' : '#2C3E50',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '20px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '5px',
                          fontWeight: 'bold'
                        }}
                      >
                        <span>{emoji}</span>
                        <span style={{ fontSize: '11px' }}>{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#FEF9E7',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: '#F39C12'
                }}
                dangerouslySetInnerHTML={{ __html: t('practice.simulation.tip') }}
              />
            </>
          )}
        </div>
      )}

      {/* Scenario Card */}
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '15px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {/* Scenario Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          marginBottom: '20px',
          paddingBottom: '15px',
          borderBottom: '2px solid #ECF0F1'
        }}>
          <div style={{ fontSize: '50px' }}>
            {currentScenarioData.imageEmoji}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{
              color: '#8E44AD',
              margin: '0 0 5px 0',
              fontSize: '24px'
            }}>
              {currentScenarioData.title}
            </h2>
            <span style={{
              color: '#7F8C8D',
              fontSize: '14px'
            }}>
              {t('practice.controls.scenarioCount')
                .replace('{{current}}', String(currentScenario + 1))
                .replace('{{total}}', String(scenarios.length))}
            </span>
          </div>
        </div>

        {/* Situation */}
        <div style={{
          backgroundColor: '#E8F8F5',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '25px',
          borderLeft: '4px solid #1ABC9C'
        }}>
          <h3 style={{
            color: '#1ABC9C',
            marginTop: '0',
            marginBottom: '10px',
            fontSize: '16px'
          }}>
            {t('practice.headers.realWorldSituation')}
          </h3>
          <p style={{
            color: '#2C3E50',
            margin: '0',
            lineHeight: '1.8',
            fontSize: '15px'
          }}>
            {currentScenarioData.situation}
          </p>
        </div>

        {/* Question */}
        <h3 style={{
          color: '#2C3E50',
          marginBottom: '20px',
          fontSize: '18px',
          lineHeight: '1.6'
        }}>
          ❓ {currentScenarioData.question}
        </h3>

        {/* Options */}
        <div style={{ marginBottom: '25px' }}>
          {currentScenarioData.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === currentScenarioData.correctAnswer;
            const showResult = showExplanation;

            let backgroundColor = 'white';
            let borderColor = '#BDC3C7';
            let textColor = '#2C3E50';

            if (showResult) {
              if (isCorrect) {
                backgroundColor = '#D5F4E6';
                borderColor = '#27AE60';
                textColor = '#27AE60';
              } else if (isSelected && !isCorrect) {
                backgroundColor = '#FADBD8';
                borderColor = '#E74C3C';
                textColor = '#E74C3C';
              }
            } else if (isSelected) {
              backgroundColor = '#F4ECF7';
              borderColor = '#8E44AD';
            }

            return (
              <div
                key={index}
                onClick={() => handleAnswerSelect(index)}
                style={{
                  padding: '16px 20px',
                  marginBottom: '12px',
                  border: `2px solid ${borderColor}`,
                  borderRadius: '10px',
                  cursor: showExplanation ? 'default' : 'pointer',
                  backgroundColor,
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: textColor,
                  fontWeight: isSelected || (showResult && isCorrect) ? 'bold' : 'normal',
                  transform: isSelected && !showResult ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: isSelected && !showResult ? '0 4px 8px rgba(142,68,173,0.2)' : 'none'
                }}
              >
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  border: `2px solid ${borderColor}`,
                  backgroundColor: isSelected ? borderColor : 'white',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  {showResult && isCorrect ? '✓' : showResult && isSelected ? '✗' : ''}
                </div>
                <span style={{ flex: 1, lineHeight: '1.6' }}>{option}</span>
                {showResult && isCorrect && (
                  <span style={{ fontSize: '22px' }}>✓</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              backgroundColor: '#E8F8F5',
              padding: '20px',
              borderRadius: '10px',
              marginBottom: '15px',
              borderLeft: '4px solid #27AE60'
            }}>
              <h3 style={{
                color: '#27AE60',
                marginTop: '0',
                marginBottom: '12px',
                fontSize: '16px'
              }}>
                {t('practice.headers.scientificExplanation')}
              </h3>
              <p style={{
                color: '#2C3E50',
                margin: '0',
                lineHeight: '1.8',
                fontSize: '15px'
              }}>
                {currentScenarioData.explanation}
              </p>
            </div>

            <div style={{
              backgroundColor: '#FFF3CD',
              padding: '20px',
              borderRadius: '10px',
              borderLeft: '4px solid #F39C12'
            }}>
              <h3 style={{
                color: '#F39C12',
                marginTop: '0',
                marginBottom: '12px',
                fontSize: '16px'
              }}>
                {t('practice.headers.realWorldApplication')}
              </h3>
              <p style={{
                color: '#2C3E50',
                margin: '0',
                lineHeight: '1.8',
                fontSize: '15px'
              }}>
                {currentScenarioData.realWorldTip}
              </p>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div style={{
          display: 'flex',
          gap: '15px',
          justifyContent: 'space-between',
          marginTop: '25px'
        }}>
          <button
            onClick={handlePrevious}
            disabled={currentScenario === 0}
            style={{
              padding: '12px 25px',
              fontSize: '16px',
              backgroundColor: currentScenario === 0 ? '#ECF0F1' : '#95A5A6',
              color: currentScenario === 0 ? '#BDC3C7' : 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: currentScenario === 0 ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
          >
            {t('practice.controls.previous')}
          </button>

          <div style={{ display: 'flex', gap: '15px' }}>
            {!showExplanation ? (
              <button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                style={{
                  padding: '12px 30px',
                  fontSize: '16px',
                  backgroundColor: selectedAnswer === null ? '#BDC3C7' : '#8E44AD',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: selectedAnswer === null ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
              >
                {t('practice.controls.checkAnswer')}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={currentScenario === scenarios.length - 1}
                style={{
                  padding: '12px 30px',
                  fontSize: '16px',
                  backgroundColor: currentScenario === scenarios.length - 1 ? '#ECF0F1' : '#27AE60',
                  color: currentScenario === scenarios.length - 1 ? '#BDC3C7' : 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: currentScenario === scenarios.length - 1 ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
              >
                {t('practice.controls.nextScenario')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Progress Summary */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '15px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ color: '#8E44AD', marginTop: '0', marginBottom: '15px' }}>
          {t('practice.progress.title')}
        </h3>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '15px'
        }}>
          <span style={{ color: '#7F8C8D', fontSize: '15px' }}>
            {t('practice.progress.completed')}
          </span>
          <span style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#27AE60'
          }}>
            {completedScenarios.length} / {scenarios.length}
          </span>
        </div>
        <div style={{
          width: '100%',
          height: '12px',
          backgroundColor: '#ECF0F1',
          borderRadius: '6px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${(completedScenarios.length / scenarios.length) * 100}%`,
            height: '100%',
            backgroundColor: '#27AE60',
            transition: 'width 0.5s ease',
            borderRadius: '6px'
          }} />
        </div>
        {completedScenarios.length === scenarios.length && (
          <div style={{
            marginTop: '15px',
            padding: '15px',
            backgroundColor: '#D5F4E6',
            borderRadius: '8px',
            textAlign: 'center',
            color: '#27AE60',
            fontWeight: 'bold'
          }}>
            {t('practice.progress.congrats')}
          </div>
        )}
      </div>

      {/* Fun Facts Section */}
      <div style={{
        marginTop: '20px',
        backgroundColor: '#E8F4F8',
        padding: '20px',
        borderRadius: '15px',
        border: '2px solid #3498DB'
      }}>
        <h3 style={{ color: '#3498DB', marginTop: '0', marginBottom: '15px', fontSize: '18px' }}>
          {t('practice.facts.title')}
        </h3>
        <ul style={{
          color: '#2C3E50',
          margin: '0',
          paddingLeft: '20px',
          lineHeight: '1.9',
          fontSize: '14px'
        }}>
          {(tValue('practice.facts.list') as string[])?.map && (tValue('practice.facts.list') as string[]).map((fact, index) => (
            <li key={index} dangerouslySetInnerHTML={{ __html: fact }} />
          ))}
        </ul>
      </div>
    </div>
  );
};


// Real World Applications Component
const RealWorldMode: React.FC = () => {
  const { t, tValue } = useLanguage();
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterMaterial, setFilterMaterial] = useState<string>("all");

  // Get applications from translations
  const applications: RealWorldApp[] = (tValue('realWorld.applications') as unknown as RealWorldApp[]) || [];

  const categories = ["all", ...Array.from(new Set(applications.map(app => app.category)))];
  const materials = ["all", "transparent", "translucent", "opaque", "mixed"];

  // Check if any applications have materialType
  const hasMaterialTypes = applications.some(app => app.materialType);

  const filteredApplications = applications.filter(app => {
    const categoryMatch = filterCategory === "all" || app.category === filterCategory;
    const materialMatch = !hasMaterialTypes || filterMaterial === "all" || (app.materialType && app.materialType === filterMaterial);
    return categoryMatch && materialMatch;
  });

  const getMaterialBadgeColor = (type?: string) => {
    switch (type) {
      case "transparent":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "translucent":
        return "bg-purple-100 text-purple-700 border-purple-300";
      case "opaque":
        return "bg-gray-100 text-gray-700 border-gray-300";
      case "mixed":
        return "bg-green-100 text-green-700 border-green-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-500 via-teal-500 to-blue-500 text-white p-8">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-10 h-10" />
              <h2 className="text-4xl font-bold">{t('realWorld.title')}</h2>
            </div>
            <p className="text-blue-100 text-xl">
              {t('realWorld.subtitle')}
            </p>
          </div>

          {/* Filters */}
          <div className="p-6 bg-gray-50 border-b">
            <div className={`grid grid-cols-1 ${hasMaterialTypes ? 'md:grid-cols-2' : ''} gap-4`}>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('realWorld.filterCategory') || 'Filter by Category'}
                </label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === "all" ? t('realWorld.allCategories') : cat}
                    </option>
                  ))}
                </select>
              </div>

              {hasMaterialTypes && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('realWorld.filterMaterial') || 'Filter by Material Type'}
                  </label>
                  <select
                    value={filterMaterial}
                    onChange={(e) => setFilterMaterial(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  >
                    {materials.map(mat => (
                      <option key={mat} value={mat}>
                        {mat === "all" ? "All Materials" : mat.charAt(0).toUpperCase() + mat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="mt-4 text-sm text-gray-600">
              {t('realWorld.showing') || 'Showing'} {filteredApplications.length} {t('controls.of')} {applications.length} {t('realWorld.applicationsCount') || 'applications'}
            </div>
          </div>
        </div>

        {/* Applications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApplications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all p-6 border-2 border-transparent hover:border-blue-400 hover:scale-105 transform duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-6xl">{app.icon}</div>
                <div className="flex flex-col gap-2 items-end">
                  <span className="text-xs font-semibold px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {app.category}
                  </span>
                  {app.materialType && (
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${getMaterialBadgeColor(app.materialType)}`}>
                      {app.materialType.charAt(0).toUpperCase() + app.materialType.slice(1)}
                    </span>
                  )}
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                {app.title}
              </h3>

              <p className="text-gray-600 mb-4 leading-relaxed">
                {app.description}
              </p>

              <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg p-4 border-l-4 border-blue-500">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">{t('realWorld.example')} </span>
                  {app.example}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              {t('realWorld.noResults') || 'No applications found with the selected filters.'}
            </p>
            <button
              onClick={() => {
                setFilterCategory("all");
                setFilterMaterial("all");
              }}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              {t('realWorld.resetFilters') || 'Reset Filters'}
            </button>
          </div>
        )}

        {/* Summary Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Key Takeaways
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
              <div className="text-4xl mb-3">🔍</div>
              <h4 className="text-xl font-bold text-blue-700 mb-2">Transparent Materials</h4>
              <p className="text-gray-700">
                Allow light to pass almost completely through. Used when clear visibility is needed, like windows, glasses, and aquariums.
              </p>
            </div>

            <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
              <div className="text-4xl mb-3">🌫️</div>
              <h4 className="text-xl font-bold text-purple-700 mb-2">Translucent Materials</h4>
              <p className="text-gray-700">
                Allow light to pass partially through. Perfect for privacy with light, like frosted glass, lampshades, and shower doors.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-300">
              <div className="text-4xl mb-3">🚫</div>
              <h4 className="text-xl font-bold text-gray-700 mb-2">Opaque Materials</h4>
              <p className="text-gray-700">
                Block light completely. Essential for protection and shade, like umbrellas, curtains, and book covers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component (internal, uses LanguageProvider)
const MainApp: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>("learn");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-blue-50">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-blue-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                {t('nav.logo')}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("learn")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${activeTab === "learn"
                    ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-blue-50"
                    }`}
                >
                  <BookOpen className="w-5 h-5" />
                  {t('nav.tabs.learn')}
                </button>
                <button
                  onClick={() => setActiveTab("practice")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${activeTab === "practice"
                    ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-blue-50"
                    }`}
                >
                  <ClipboardCheck className="w-5 h-5" />
                  {t('nav.tabs.practice')}
                </button>
                <button
                  onClick={() => setActiveTab("realWorld")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${activeTab === "realWorld"
                    ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-blue-50"
                    }`}
                >
                  <Globe className="w-5 h-5" />
                  {t('nav.tabs.realWorld')}
                </button>
              </div>
              <LanguageSelector />
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-16">
        {activeTab === "learn" ? (
          <LightTravelStraightLine />
        ) : activeTab === "practice" ? (
          <PracticeMode />
        ) : (
          <RealWorldMode />
        )}
      </div>
    </div>
  );
};

// Main App Component with Provider (exported for use in main App.tsx)
export const LightTravelApp: React.FC = () => {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
};
