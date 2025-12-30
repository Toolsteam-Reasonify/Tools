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
const ShadowIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    {/* Circle representing object */}
    <circle cx="12" cy="8" r="4" fill="currentColor" opacity="0.8" />
    {/* Ellipse representing shadow */}
    <ellipse cx="12" cy="16" rx="5" ry="2" fill="currentColor" opacity="0.4" />
    {/* Light rays */}
    <line x1="12" y1="4" x2="8" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    <line x1="12" y1="4" x2="16" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.3" />
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
    // Only calculate shadow if object is between light and screen
    if (objectPos.x <= lightPos.x || objectPos.x >= screenPos) {
      return null; // No shadow if object is not between light and screen
    }

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
    e.stopPropagation();
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
      // Prevent object from going to the left of the light source
      // Object must stay to the right of the light source (with small margin)
      const minX = lightPos.x + 20; // 20px margin to prevent overlap
      const maxX = screenPos - 50; // Keep some margin from screen
      const newX = Math.max(minX, Math.min(maxX, x));
      const newY = Math.max(50, Math.min(450, y));
      const oldX = objectPos.x;
      
      setObjectPos({ x: newX, y: newY });

      // Check if object is positioned to cast shadow
      if (newX > lightPos.x && newX < screenPos) {
        if (Math.abs(newX - lightPos.x) < Math.abs(oldX - lightPos.x)) {
          giveFeedback(t('shadowSimulator.feedback.shadowBig'));
        } else if (Math.abs(newX - screenPos) < 80) {
          giveFeedback(t('shadowSimulator.feedback.shadowTiny'));
        }
      } else if (newX >= screenPos) {
        giveFeedback(t('shadowSimulator.feedback.objectBeyondScreen') || 'Object is beyond the screen! No shadow.');
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
    const numRays = 12;
    const objectSize = 30;

    for (let i = 0; i < numRays; i++) {
      const angle = (Math.PI * 2 / numRays) * i;
      const rayX = Math.cos(angle) * objectSize + objectPos.x;
      const rayY = Math.sin(angle) * objectSize + objectPos.y;

      // Check if ray is blocked by object
      const dx = rayX - objectPos.x;
      const dy = rayY - objectPos.y;
      const distanceFromObject = Math.sqrt(dx * dx + dy * dy);
      const blocked = distanceFromObject < objectSize;

      // Only draw rays that go towards the screen
      if (!blocked || rayX > objectPos.x) {
        // Calculate where ray hits the screen
        const t = (screenPos - lightPos.x) / (rayX - lightPos.x);
        const screenY = lightPos.y + (rayY - lightPos.y) * t;

        rays.push(
          <line
            key={i}
            x1={lightPos.x}
            y1={lightPos.y}
            x2={rayX > objectPos.x ? screenPos : rayX}
            y2={rayX > objectPos.x ? screenY : rayY}
            stroke={rayX > objectPos.x ? '#FFE66D' : '#FFF176'}
            strokeWidth="1"
            opacity={rayX > objectPos.x ? '0.3' : '0.6'}
            style={{ pointerEvents: 'none' }}
          />
        );
      }
    }
    return rays;
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
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
              className="cursor-default"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ userSelect: 'none' }}
            >
              {/* Light Rays */}
              {showRays && getLightRays()}

              {/* Screen */}
              <g
                onMouseDown={(e) => handleMouseDown('screen', e)}
                className="cursor-ew-resize"
                style={{ cursor: 'ew-resize' }}
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
              </g>

              {/* Shadow - Only render if shadow exists */}
              {shadow && (
                <g style={{ pointerEvents: 'none' }}>
                  <text
                    x={shadow.x}
                    y={shadow.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={60 * shadow.scale}
                    style={{
                      filter: `blur(${shadow.blur}px) brightness(0)`,
                      opacity: 0.6 + (currentObject.opacity * 0.2),
                    }}
                  >
                    {currentObject.emoji}
                  </text>
                </g>
              )}

              {/* Object */}
              <g
                onMouseDown={(e) => handleMouseDown('object', e)}
                style={{ cursor: 'move' }}
              >
                {/* Invisible larger hit area for better dragging */}
                <circle
                  cx={objectPos.x}
                  cy={objectPos.y}
                  r="50"
                  fill="transparent"
                  style={{ cursor: 'move' }}
                />
                
                {/* Emoji */}
                <text
                  x={objectPos.x}
                  y={objectPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="60"
                  style={{
                    filter: `drop-shadow(0 0 8px ${currentObject.color})`,
                    opacity: currentObject.opacity,
                    pointerEvents: 'none',
                    userSelect: 'none'
                  }}
                >
                  {currentObject.emoji}
                </text>
                <text 
                  x={objectPos.x} 
                  y={objectPos.y - 50} 
                  fill="white" 
                  fontSize="12" 
                  fontWeight="bold"
                  textAnchor="middle"
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {t('shadowSimulator.controls.dragObject')}
                </text>
              </g>

              {/* Light Source */}
              <g
                onMouseDown={(e) => handleMouseDown('light', e)}
                style={{ cursor: 'move' }}
              >
                <circle
                  cx={lightPos.x}
                  cy={lightPos.y}
                  r={lightSize === 'small' ? '20' : '35'}
                  fill="#FFD700"
                  className="transition-all"
                  style={{ cursor: 'move' }}
                />
                <circle
                  cx={lightPos.x}
                  cy={lightPos.y}
                  r={lightSize === 'small' ? '30' : '50'}
                  fill="#FFD700"
                  opacity="0.3"
                  className="animate-pulse transition-all"
                  style={{ pointerEvents: 'none' }}
                />
                <text
                  x={lightPos.x}
                  y={lightPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="20"
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  💡
                </text>
                <text 
                  x={lightPos.x - 30} 
                  y={lightPos.y - 50} 
                  fill="white" 
                  fontSize="12" 
                  fontWeight="bold"
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {t('shadowSimulator.controls.lightLabel')}
                </text>
              </g>

              {/* Helper Text */}
              {/* This text is moved to the info box below */}
            </svg>

            {/* Info Box */}
            <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white border-l-4 border-blue-400">
              <h4 className="font-bold text-lg mb-2 text-yellow-300">🔬 {t('shadowSimulator.infoBox.title')}</h4>
              {shadow ? (
                <>
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
                </>
              ) : (
                <p className="text-sm leading-relaxed">
                  Position the object between the light source and the screen to see its shadow!
                </p>
              )}
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
    }
  };

  const handlePrevious = () => {
    if (currentScenario > 0) {
      setCurrentScenario(currentScenario - 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
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
      {/* Scenario Navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        marginBottom: '30px',
        flexWrap: 'wrap'
      }}>
        {scenarios.map((_, index) => (
          <div
            key={index}
            style={{
              width: '35px',
              height: '35px',
              borderRadius: '50%',
              backgroundColor: completedScenarios.includes(index)
                ? '#27AE60'
                : index === currentScenario
                  ? '#2563EB'
                  : '#ECF0F1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '16px',
              color: index === currentScenario || completedScenarios.includes(index) ? 'white' : '#7F8C8D',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: completedScenarios.includes(index) ? '2px solid #27AE60' : '2px solid transparent'
            }}
            onClick={() => {
              setCurrentScenario(index);
              setSelectedAnswer(null);
              setShowExplanation(false);
            }}
          >
            {completedScenarios.includes(index) ? '✓' : index + 1}
          </div>
        ))}
      </div>

      {/* Question Card */}
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '15px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {/* Question */}
        <h3 style={{
          color: '#2C3E50',
          marginBottom: '25px',
          fontSize: '20px',
          lineHeight: '1.6'
        }}>
          {currentScenarioData.question}
        </h3>

        {/* Options */}
        <div style={{ marginBottom: '30px' }}>
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
              backgroundColor = '#EFF6FF';
              borderColor = '#2563EB';
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
                  boxShadow: isSelected && !showResult ? '0 4px 8px rgba(37,99,235,0.2)' : 'none'
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
                  {showResult && isCorrect ? '✓' : showResult && isSelected ? '✗' : String.fromCharCode(65 + index)}
                </div>
                <span style={{ flex: 1, lineHeight: '1.6' }}>{option}</span>
                {showResult && isCorrect && (
                  <span style={{ fontSize: '22px' }}>✓</span>
                )}
              </div>
            );
          })}
        </div>

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
                  backgroundColor: selectedAnswer === null ? '#BDC3C7' : '#2563EB',
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
    </div>
  );
};


// Real World Applications Component
const RealWorldMode: React.FC = () => {
  const { t, tValue } = useLanguage();

  // Get applications from translations
  const applications: RealWorldApp[] = (tValue('realWorld.applications') as unknown as RealWorldApp[]) || [];

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
        {/* Applications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app) => (
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
              <ShadowIcon className="w-6 h-6 text-blue-600" />
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
