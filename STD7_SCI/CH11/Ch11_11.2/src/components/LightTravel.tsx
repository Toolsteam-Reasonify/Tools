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

interface Step {
  id: number;
  title: string;
  description: string;
  activity: "matchbox" | "pipe" | "conclusion";
}

interface PracticeQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  visualType?: "matchbox" | "pipe" | "concept";
}

interface RealWorldApp {
  id: number;
  title: string;
  description: string;
  icon: string;
  category: string;
  example: string;
}

// Translation type definition
type TranslationValue = string | string[] | number | { [key: string]: TranslationValue } | Array<{ [key: string]: TranslationValue }>;
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
    localStorage.setItem("lightTravelLang", lang);
  };

  useEffect(() => {
    const saved = localStorage.getItem("lightTravelLang") as Language;
    if (saved && ["en", "hi", "gu"].includes(saved)) {
      setLanguageState(saved);
    }
  }, []);

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: TranslationValue = translations[language];
    for (const k of keys) {
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
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
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
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
    title: "Introduction",
    description: "",
    activity: "matchbox",
  },
  {
    id: 2,
    title: "Matchbox Setup",
    description: "",
    activity: "matchbox",
  },
  {
    id: 3,
    title: "Aligned Matchboxes",
    description: "",
    activity: "matchbox",
  },
  {
    id: 4,
    title: "Misaligned Matchboxes",
    description: "",
    activity: "matchbox",
  },
  {
    id: 5,
    title: "Pipe Introduction",
    description: "",
    activity: "pipe",
  },
  {
    id: 6,
    title: "Straight Pipe",
    description: "",
    activity: "pipe",
  },
  {
    id: 7,
    title: "Bent Pipe",
    description: "",
    activity: "pipe",
  },
  {
    id: 8,
    title: "Conclusion",
    description: "",
    activity: "conclusion",
  },
];

interface LightTravelProps {
  width?: number;
  height?: number;
}

export const LightTravelStraightLine: React.FC<LightTravelProps> = ({
  width = 800,
  height = 600,
}) => {
  const { t } = useLanguage();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [animationProgress, setAnimationProgress] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const steps = DEFAULT_STEPS;

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setTimeout(() => {
      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex((prev) => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, 7000);
    return () => window.clearTimeout(timer);
  }, [isPlaying, currentStepIndex, steps.length]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      setAnimationProgress((prev) => (prev + 0.02) % 1);
      animationFrameRef.current = window.requestAnimationFrame(animate);
    };

    animationFrameRef.current = window.requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Draw on canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const stepKey = getStepKey(currentStepIndex);
    drawVisualization(ctx, width, height, stepKey, animationProgress, t);
  }, [currentStepIndex, animationProgress, width, height, t]);

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
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

  const getStepKey = (index: number): string => {
    const keys = [
      "intro",
      "matchbox_setup",
      "matchbox_aligned",
      "matchbox_misaligned",
      "pipe_intro",
      "pipe_straight",
      "pipe_bent",
      "conclusion",
    ];
    return keys[index] || "intro";
  };

  const stepKey = getStepKey(currentStepIndex);
  const title = t(`steps.${stepKey}.title`);
  const description = t(`steps.${stepKey}.description`);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-blue-50">
      {/* Main Content */}
      <div className="w-full max-w-7xl mx-auto pt-4 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mt-6">
          <div className="bg-gradient-to-r from-blue-500 via-teal-500 to-blue-500 text-white p-4 sm:p-6">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <h2 className="text-xl sm:text-2xl font-semibold">{title}</h2>
              <div className="text-sm bg-white/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full backdrop-blur-sm">
                {t("controls.step")} {currentStepIndex + 1} {t("controls.of")}{" "}
                {steps.length}
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
                disabled={currentStepIndex === steps.length - 1}
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
                    width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Drawing function for visualizations
function drawVisualization(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  stage: string,
  progress: number,
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

  if (stage === "intro") {
    drawIntro(ctx, width, height, progress, t);
  } else if (stage === "matchbox_setup") {
    drawMatchboxSetup(ctx, width, height, progress, t);
  } else if (stage === "matchbox_aligned") {
    drawMatchboxAligned(ctx, width, height, progress, t);
  } else if (stage === "matchbox_misaligned") {
    drawMatchboxMisaligned(ctx, width, height, progress, t);
  } else if (stage === "pipe_intro") {
    drawPipeIntro(ctx, width, height, progress, t);
  } else if (stage === "pipe_straight") {
    drawPipeStraight(ctx, width, height, progress, t);
  } else if (stage === "pipe_bent") {
    drawPipeBent(ctx, width, height, progress, t);
  } else if (stage === "conclusion") {
    drawConclusion(ctx, width, height, progress, t);
  }
}

function drawIntro(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  t: (key: string) => string
) {
  const centerX = width / 2;
  const centerY = height / 2;

  // Question mark
  ctx.fillStyle = "#60A5FA";
  ctx.font = "bold 120px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(96, 165, 250, 0.5)";
  ctx.shadowBlur = 20;
  ctx.fillText(t("canvas.intro.questionMark"), centerX, centerY);
  ctx.shadowBlur = 0;

  // Animated light rays
  const numRays = 8;
  for (let i = 0; i < numRays; i++) {
    const angle = (i * (360 / numRays) + progress * 180) * (Math.PI / 180);
    const rayLength = 100 + Math.sin(progress * Math.PI * 2 + i) * 20;

    ctx.strokeStyle = `rgba(255, 215, 0, ${
      0.3 + Math.sin(progress * Math.PI * 2 + i) * 0.3
    })`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(
      centerX + Math.cos(angle) * 80,
      centerY + Math.sin(angle) * 80
    );
    ctx.lineTo(
      centerX + Math.cos(angle) * (80 + rayLength),
      centerY + Math.sin(angle) * (80 + rayLength)
    );
    ctx.stroke();
  }

  // Title
  ctx.fillStyle = "#FFF";
  ctx.font = "bold 24px Arial";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 10;
  ctx.fillText(t("canvas.intro.title"), centerX, height - 50);
  ctx.shadowBlur = 0;
}

function drawMatchboxSetup(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  t: (key: string) => string
) {
  const centerY = height / 2;
  const boxWidth = 80;
  const boxHeight = 50;
  const spacing = 150;
  const startX = width / 2 - spacing;

  // Draw three matchboxes
  for (let i = 0; i < 3; i++) {
    const x = startX + i * spacing;
    const y = centerY - boxHeight / 2;

    // Matchbox body
    ctx.fillStyle = "#8B4513";
    ctx.strokeStyle = "#654321";
    ctx.lineWidth = 2;
    ctx.fillRect(x, y, boxWidth, boxHeight);
    ctx.strokeRect(x, y, boxWidth, boxHeight);

    // Inner tray
    ctx.fillStyle = "#D2691E";
    ctx.fillRect(x + 10, y + 10, boxWidth - 20, boxHeight - 20);

    // Hole (animated appearance)
    const holeSize = Math.min(progress * 15, 15);
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(x + boxWidth / 2, centerY, holeSize, 0, Math.PI * 2);
    ctx.fill();

    // Label
    ctx.fillStyle = "#FFF";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`${t("canvas.matchbox_setup.boxLabel")} ${i + 1}`, x + boxWidth / 2, y + boxHeight + 25);
  }

  // Instructions
  ctx.fillStyle = "#60A5FA";
  ctx.font = "bold 20px Arial";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 10;
  ctx.fillText(
    t("canvas.matchbox_setup.instruction"),
    width / 2,
    80
  );
  ctx.shadowBlur = 0;
}

function drawMatchboxAligned(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  t: (key: string) => string
) {
  const centerY = height / 2;
  const boxWidth = 80;
  const boxHeight = 50;
  const spacing = 150;
  const startX = width / 2 - spacing;

  // Draw torch
  const torchX = 50;
  const torchY = centerY;

  // Torch body
  ctx.fillStyle = "#FFD700";
  ctx.beginPath();
  ctx.arc(torchX, torchY, 20, 0, Math.PI * 2);
  ctx.fill();

  // Light beam (animated)
  const beamProgress = Math.min(progress * 1.5, 1);
  const beamEndX = startX + 3 * spacing + 100;

  ctx.strokeStyle = `rgba(255, 215, 0, ${0.6 - progress * 0.2})`;
  ctx.lineWidth = 40;
  ctx.beginPath();
  ctx.moveTo(torchX + 20, torchY);
  ctx.lineTo(torchX + 20 + (beamEndX - torchX - 20) * beamProgress, torchY);
  ctx.stroke();

  // Focused beam
  ctx.strokeStyle = `rgba(255, 255, 150, ${0.8})`;
  ctx.lineWidth = 15;
  ctx.beginPath();
  ctx.moveTo(torchX + 20, torchY);
  ctx.lineTo(torchX + 20 + (beamEndX - torchX - 20) * beamProgress, torchY);
  ctx.stroke();

  // Draw three matchboxes
  for (let i = 0; i < 3; i++) {
    const x = startX + i * spacing;
    const y = centerY - boxHeight / 2;

    // Matchbox body
    ctx.fillStyle = "#8B4513";
    ctx.strokeStyle = "#654321";
    ctx.lineWidth = 2;
    ctx.fillRect(x, y, boxWidth, boxHeight);
    ctx.strokeRect(x, y, boxWidth, boxHeight);

    // Inner tray
    ctx.fillStyle = "#D2691E";
    ctx.fillRect(x + 10, y + 10, boxWidth - 20, boxHeight - 20);

    // Hole
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(x + boxWidth / 2, centerY, 15, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw screen
  const screenX = beamEndX;
  ctx.fillStyle = "#FFF";
  ctx.fillRect(screenX, centerY - 100, 10, 200);

  // Light spot on screen (animated)
  if (beamProgress > 0.8) {
    const spotProgress = (beamProgress - 0.8) * 5;
    const spotSize = 30 * spotProgress;

    const spotGradient = ctx.createRadialGradient(
      screenX,
      centerY,
      0,
      screenX,
      centerY,
      spotSize
    );
    spotGradient.addColorStop(0, "rgba(255, 255, 150, 0.9)");
    spotGradient.addColorStop(1, "rgba(255, 255, 150, 0)");

    ctx.fillStyle = spotGradient;
    ctx.beginPath();
    ctx.arc(screenX, centerY, spotSize, 0, Math.PI * 2);
    ctx.fill();
  }

  // Instructions
  ctx.fillStyle = "#10B981";
  ctx.font = "bold 20px Arial";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 10;
  ctx.fillText(t("canvas.matchbox_aligned.message"), width / 2, 80);
  ctx.shadowBlur = 0;
}

function drawMatchboxMisaligned(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  t: (key: string) => string
) {
  const centerY = height / 2;
  const boxWidth = 80;
  const boxHeight = 50;
  const spacing = 150;
  const startX = width / 2 - spacing;

  // Draw torch
  const torchX = 50;
  const torchY = centerY;

  // Torch body
  ctx.fillStyle = "#FFD700";
  ctx.beginPath();
  ctx.arc(torchX, torchY, 20, 0, Math.PI * 2);
  ctx.fill();

  // Light beam (blocked)
  const beamProgress = Math.min(progress * 1.5, 1);
  const blockX = startX + spacing + boxWidth / 2 - 30;

  ctx.strokeStyle = `rgba(255, 215, 0, ${0.6 - progress * 0.2})`;
  ctx.lineWidth = 40;
  ctx.beginPath();
  ctx.moveTo(torchX + 20, torchY);
  ctx.lineTo(
    Math.min(torchX + 20 + (blockX - torchX - 20) * beamProgress, blockX),
    torchY
  );
  ctx.stroke();

  // Focused beam
  ctx.strokeStyle = `rgba(255, 255, 150, ${0.8})`;
  ctx.lineWidth = 15;
  ctx.beginPath();
  ctx.moveTo(torchX + 20, torchY);
  ctx.lineTo(
    Math.min(torchX + 20 + (blockX - torchX - 20) * beamProgress, blockX),
    torchY
  );
  ctx.stroke();

  // Draw three matchboxes (middle one misaligned)
  for (let i = 0; i < 3; i++) {
    const x = startX + i * spacing;
    let y = centerY - boxHeight / 2;

    // Middle box is offset
    const offset = i === 1 ? 30 * Math.sin(progress * Math.PI) : 0;
    y += offset;

    // Matchbox body
    ctx.fillStyle = i === 1 ? "#A0522D" : "#8B4513";
    ctx.strokeStyle = i === 1 ? "#8B4513" : "#654321";
    ctx.lineWidth = 2;
    ctx.fillRect(x, y, boxWidth, boxHeight);
    ctx.strokeRect(x, y, boxWidth, boxHeight);

    // Inner tray
    ctx.fillStyle = "#D2691E";
    ctx.fillRect(x + 10, y + 10, boxWidth - 20, boxHeight - 20);

    // Hole
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(x + boxWidth / 2, y + boxHeight / 2, 15, 0, Math.PI * 2);
    ctx.fill();

    // Arrow showing misalignment
    if (i === 1 && offset > 5) {
      ctx.strokeStyle = "#EF4444";
      ctx.fillStyle = "#EF4444";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x + boxWidth / 2, y - 30);
      ctx.lineTo(x + boxWidth / 2, y - 10);
      ctx.stroke();

      // Arrow head
      ctx.beginPath();
      ctx.moveTo(x + boxWidth / 2, y - 10);
      ctx.lineTo(x + boxWidth / 2 - 5, y - 18);
      ctx.lineTo(x + boxWidth / 2 + 5, y - 18);
      ctx.closePath();
      ctx.fill();
    }
  }

  // Draw screen
  const screenX = startX + 3 * spacing + 100;
  ctx.fillStyle = "#FFF";
  ctx.fillRect(screenX, centerY - 100, 10, 200);

  // No light spot (with X mark)
  if (beamProgress > 0.8) {
    ctx.strokeStyle = "#EF4444";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(screenX - 20, centerY - 20);
    ctx.lineTo(screenX + 20, centerY + 20);
    ctx.moveTo(screenX + 20, centerY - 20);
    ctx.lineTo(screenX - 20, centerY + 20);
    ctx.stroke();
  }

  // Instructions
  ctx.fillStyle = "#EF4444";
  ctx.font = "bold 20px Arial";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 10;
  ctx.fillText(
    t("canvas.matchbox_misaligned.message"),
    width / 2,
    80
  );
  ctx.shadowBlur = 0;
}

function drawPipeIntro(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  t: (key: string) => string
) {
  const centerX = width / 2;
  const centerY = height / 2;

  // Draw pipe (animated appearance)
  const pipeLength = 300 * Math.min(progress * 1.5, 1);
  const pipeY = centerY;

  ctx.strokeStyle = "#64748B";
  ctx.lineWidth = 40;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(centerX - 150, pipeY);
  ctx.lineTo(centerX - 150 + pipeLength, pipeY);
  ctx.stroke();

  // Inner pipe
  ctx.strokeStyle = "#94A3B8";
  ctx.lineWidth = 30;
  ctx.beginPath();
  ctx.moveTo(centerX - 150, pipeY);
  ctx.lineTo(centerX - 150 + pipeLength, pipeY);
  ctx.stroke();

  // Candle (on left)
  if (progress > 0.3) {
    const candleX = centerX - 180;
    const candleY = centerY + 50;

    // Candle body
    ctx.fillStyle = "#F3E5AB";
    ctx.fillRect(candleX - 10, candleY, 20, 60);

    // Flame
    const flameSize = 20 + Math.sin(progress * Math.PI * 8) * 3;
    const flameGradient = ctx.createRadialGradient(
      candleX,
      candleY - 10,
      0,
      candleX,
      candleY - 10,
      flameSize
    );
    flameGradient.addColorStop(0, "#FFF");
    flameGradient.addColorStop(0.4, "#FFD700");
    flameGradient.addColorStop(1, "#FF4500");

    ctx.fillStyle = flameGradient;
    ctx.beginPath();
    ctx.ellipse(candleX, candleY - 10, 12, flameSize, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Eye (on right)
  if (progress > 0.6) {
    const eyeX = centerX + 180;
    const eyeY = centerY;

    // Eye white
    ctx.fillStyle = "#FFF";
    ctx.beginPath();
    ctx.ellipse(eyeX, eyeY, 25, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eye outline
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Pupil
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(eyeX - 5, eyeY, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  // Instructions
  ctx.fillStyle = "#60A5FA";
  ctx.font = "bold 20px Arial";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 10;
  ctx.fillText(t("canvas.pipe_intro.question"), centerX, 80);
  ctx.shadowBlur = 0;
}

function drawPipeStraight(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  t: (key: string) => string
) {
  const centerX = width / 2;
  const centerY = height / 2;

  // Draw straight pipe
  const pipeStartX = centerX - 200;
  const pipeEndX = centerX + 200;

  ctx.strokeStyle = "#64748B";
  ctx.lineWidth = 40;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(pipeStartX, centerY);
  ctx.lineTo(pipeEndX, centerY);
  ctx.stroke();

  // Inner pipe
  ctx.strokeStyle = "#94A3B8";
  ctx.lineWidth = 30;
  ctx.beginPath();
  ctx.moveTo(pipeStartX, centerY);
  ctx.lineTo(pipeEndX, centerY);
  ctx.stroke();

  // Light ray through pipe (animated)
  const rayProgress = Math.min(progress * 1.5, 1);
  const rayEndX = pipeStartX + (pipeEndX - pipeStartX) * rayProgress;

  ctx.strokeStyle = "rgba(255, 215, 0, 0.7)";
  ctx.lineWidth = 20;
  ctx.beginPath();
  ctx.moveTo(pipeStartX, centerY);
  ctx.lineTo(rayEndX, centerY);
  ctx.stroke();

  // Brighter center ray
  ctx.strokeStyle = "rgba(255, 255, 150, 0.9)";
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(pipeStartX, centerY);
  ctx.lineTo(rayEndX, centerY);
  ctx.stroke();

  // Candle (on left)
  const candleX = pipeStartX - 50;
  const candleY = centerY + 80;

  // Candle body
  ctx.fillStyle = "#F3E5AB";
  ctx.fillRect(candleX - 10, candleY, 20, 60);

  // Flame
  const flameSize = 20 + Math.sin(progress * Math.PI * 8) * 3;
  const flameGradient = ctx.createRadialGradient(
    candleX,
    candleY - 10,
    0,
    candleX,
    candleY - 10,
    flameSize
  );
  flameGradient.addColorStop(0, "#FFF");
  flameGradient.addColorStop(0.4, "#FFD700");
  flameGradient.addColorStop(1, "#FF4500");

  ctx.fillStyle = flameGradient;
  ctx.beginPath();
  ctx.ellipse(candleX, candleY - 10, 12, flameSize, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eye (on right)
  const eyeX = pipeEndX + 50;
  const eyeY = centerY;

  // Eye white
  ctx.fillStyle = "#FFF";
  ctx.beginPath();
  ctx.ellipse(eyeX, eyeY, 25, 20, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eye outline
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Pupil (looking at flame)
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.arc(eyeX - 5, eyeY, 8, 0, Math.PI * 2);
  ctx.fill();

  // Glint in eye if light reaches
  if (rayProgress > 0.9) {
    ctx.fillStyle = "#FFD700";
    ctx.beginPath();
    ctx.arc(eyeX - 3, eyeY - 3, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Checkmark
  if (rayProgress > 0.9) {
    ctx.strokeStyle = "#10B981";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(pipeEndX + 80, centerY - 80);
    ctx.lineTo(pipeEndX + 100, centerY - 60);
    ctx.lineTo(pipeEndX + 140, centerY - 100);
    ctx.stroke();
  }

  // Instructions
  ctx.fillStyle = "#10B981";
  ctx.font = "bold 20px Arial";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 10;
  ctx.fillText(t("canvas.pipe_straight.message"), centerX, 80);
  ctx.shadowBlur = 0;
}

function drawPipeBent(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  t: (key: string) => string
) {
  const centerX = width / 2;
  const centerY = height / 2;

  // Draw bent pipe (animated bending)
  const bendAmount = Math.min(progress, 1) * 100;

  ctx.strokeStyle = "#64748B";
  ctx.lineWidth = 40;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(centerX - 200, centerY);
  ctx.lineTo(centerX - 50, centerY);
  ctx.quadraticCurveTo(
    centerX,
    centerY - bendAmount,
    centerX + 50,
    centerY
  );
  ctx.lineTo(centerX + 200, centerY);
  ctx.stroke();

  // Inner pipe
  ctx.strokeStyle = "#94A3B8";
  ctx.lineWidth = 30;
  ctx.beginPath();
  ctx.moveTo(centerX - 200, centerY);
  ctx.lineTo(centerX - 50, centerY);
  ctx.quadraticCurveTo(
    centerX,
    centerY - bendAmount,
    centerX + 50,
    centerY
  );
  ctx.lineTo(centerX + 200, centerY);
  ctx.stroke();

  // Light ray (stops at bend)
  if (progress > 0.3) {
    const rayProgress = Math.min((progress - 0.3) * 1.5, 1);
    const rayLength = 150 * rayProgress;

    ctx.strokeStyle = "rgba(255, 215, 0, 0.7)";
    ctx.lineWidth = 20;
    ctx.beginPath();
    ctx.moveTo(centerX - 200, centerY);
    ctx.lineTo(centerX - 200 + rayLength, centerY);
    ctx.stroke();

    // Brighter center ray
    ctx.strokeStyle = "rgba(255, 255, 150, 0.9)";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(centerX - 200, centerY);
    ctx.lineTo(centerX - 200 + rayLength, centerY);
    ctx.stroke();

    // Show light blocked (X mark at bend point)
    if (rayProgress > 0.9) {
      ctx.strokeStyle = "#EF4444";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(centerX - 60, centerY - 10);
      ctx.lineTo(centerX - 40, centerY + 10);
      ctx.moveTo(centerX - 40, centerY - 10);
      ctx.lineTo(centerX - 60, centerY + 10);
      ctx.stroke();
    }
  }

  // Candle (on left)
  const candleX = centerX - 250;
  const candleY = centerY + 80;

  // Candle body
  ctx.fillStyle = "#F3E5AB";
  ctx.fillRect(candleX - 10, candleY, 20, 60);

  // Flame
  const flameSize = 20 + Math.sin(progress * Math.PI * 8) * 3;
  const flameGradient = ctx.createRadialGradient(
    candleX,
    candleY - 10,
    0,
    candleX,
    candleY - 10,
    flameSize
  );
  flameGradient.addColorStop(0, "#FFF");
  flameGradient.addColorStop(0.4, "#FFD700");
  flameGradient.addColorStop(1, "#FF4500");

  ctx.fillStyle = flameGradient;
  ctx.beginPath();
  ctx.ellipse(candleX, candleY - 10, 12, flameSize, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eye (on right) - confused/unable to see
  const eyeX = centerX + 250;
  const eyeY = centerY;

  // Eye white
  ctx.fillStyle = "#FFF";
  ctx.beginPath();
  ctx.ellipse(eyeX, eyeY, 25, 20, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eye outline
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Pupil (looking confused)
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.arc(eyeX, eyeY + 5, 8, 0, Math.PI * 2);
  ctx.fill();

  // X mark over eye (can't see)
  if (progress > 0.8) {
    ctx.strokeStyle = "#EF4444";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(eyeX - 30, eyeY - 30);
    ctx.lineTo(eyeX + 30, eyeY + 30);
    ctx.moveTo(eyeX + 30, eyeY - 30);
    ctx.lineTo(eyeX - 30, eyeY + 30);
    ctx.stroke();
  }

  // Instructions
  ctx.fillStyle = "#EF4444";
  ctx.font = "bold 20px Arial";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 10;
  ctx.fillText(t("canvas.pipe_bent.message"), centerX, 80);
  ctx.shadowBlur = 0;
}

function drawConclusion(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  t: (key: string) => string
) {
  const centerX = width / 2;
  const centerY = height / 2;

  // Draw multiple light rays demonstrating straight line travel
  const numRays = 5;
  for (let i = 0; i < numRays; i++) {
    const startX = 100;
    const startY = 100 + i * 100;
    const endX = width - 100;
    const endY = startY;

    // Animate rays
    const rayProgress = Math.min((progress - i * 0.1) * 1.2, 1);
    if (rayProgress > 0) {
      const currentEndX = startX + (endX - startX) * rayProgress;

      // Glow
      ctx.strokeStyle = `rgba(255, 215, 0, ${0.3 - i * 0.05})`;
      ctx.lineWidth = 30;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(currentEndX, endY);
      ctx.stroke();

      // Bright ray
      ctx.strokeStyle = `rgba(255, 255, 150, ${0.8 - i * 0.1})`;
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(currentEndX, endY);
      ctx.stroke();

      // Arrow at end
      if (rayProgress > 0.95) {
        ctx.fillStyle = "#FFD700";
        ctx.beginPath();
        ctx.moveTo(currentEndX, endY);
        ctx.lineTo(currentEndX - 15, endY - 8);
        ctx.lineTo(currentEndX - 15, endY + 8);
        ctx.closePath();
        ctx.fill();
      }
    }
  }

  // Central icon - lightbulb with checkmark
  if (progress > 0.5) {
    const iconProgress = (progress - 0.5) * 2;

    // Lightbulb glow
    const glowGradient = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      60
    );
    glowGradient.addColorStop(0, "rgba(255, 215, 0, 0.8)");
    glowGradient.addColorStop(1, "rgba(255, 215, 0, 0)");

    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 60 * iconProgress, 0, Math.PI * 2);
    ctx.fill();

    // Lightbulb
    ctx.fillStyle = "#FFD700";
    ctx.font = "80px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("💡", centerX, centerY);

    // Checkmark
    if (iconProgress > 0.7) {
      ctx.strokeStyle = "#10B981";
      ctx.lineWidth = 10;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(centerX + 30, centerY - 40);
      ctx.lineTo(centerX + 50, centerY - 20);
      ctx.lineTo(centerX + 90, centerY - 60);
      ctx.stroke();
    }
  }

  // Title
  ctx.fillStyle = "#10B981";
  ctx.font = "bold 32px Arial";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 15;
  ctx.fillText(t("canvas.conclusion.title"), centerX, height - 80);
  ctx.shadowBlur = 0;

  // Subtitle
  ctx.fillStyle = "#FFF";
  ctx.font = "20px Arial";
  ctx.fillText(
    t("canvas.conclusion.subtitle"),
    centerX,
    height - 40
  );
}

// Practice Mode Component
const PracticeMode: React.FC = () => {
  const { t, tValue } = useLanguage();

  const questionsData = tValue("practice.questions");
  const questions: PracticeQuestion[] = useMemo(() => {
    return Array.isArray(questionsData) ? (questionsData as unknown as PracticeQuestion[]) : [];
  }, [questionsData]);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);


  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <p className="text-gray-600">{t("practice.loading")}</p>
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
    
    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
    if (isCorrect && !answeredQuestions.includes(currentQuestion)) {
      setScore(score + 1);
    }
    if (!answeredQuestions.includes(currentQuestion)) {
      setAnsweredQuestions([...answeredQuestions, currentQuestion]);
    }
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
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
          <div className="text-center">
            <div className="mb-6">
              <CheckCircle className="w-24 h-24 text-green-500 mx-auto animate-bounce" />
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              {t("practice.complete")}
            </h2>
            <p className="text-2xl text-gray-600 mb-3">
              {t("practice.finalScore")}
            </p>
            <p className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-8">
              {score} / {questions.length}
            </p>
            <div className="mb-8">
              <p className="text-lg text-gray-700">
                {percentage === 100
                  ? t("practice.scoreMessages.perfect")
                  : percentage >= 75
                  ? t("practice.scoreMessages.great")
                  : percentage >= 50
                  ? t("practice.scoreMessages.good")
                  : t("practice.scoreMessages.keepLearning")}
              </p>
            </div>
            <button
              onClick={handleRestart}
              className="px-10 py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all"
            >
              {t("practice.restart")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const isCorrect = showResult && selectedAnswer === question.correctAnswer;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-blue-50 p-4">
      <div className="max-w-5xl mx-auto py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 via-teal-500 to-blue-500 text-white p-6">
            <h2 className="text-3xl font-bold mb-2">{t("practice.title")}</h2>
            <p className="text-blue-100 text-lg">{t("practice.subtitle")}</p>
            <div className="mt-6 flex justify-between items-center flex-wrap gap-4">
              <span className="text-sm bg-white/20 px-5 py-2.5 rounded-full font-semibold">
                {t("practice.question")} {currentQuestion + 1} / {questions.length}
              </span>
              <span className="text-sm bg-white/20 px-5 py-2.5 rounded-full font-semibold">
                {t("practice.score")}: {score}
              </span>
            </div>
          </div>

          <div className="p-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-8">
              {question.question}
            </h3>

            <div className="space-y-4 mb-8">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const showCorrect = showResult && index === question.correctAnswer;
                const showWrong = showResult && isSelected && !showCorrect;

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showResult}
                    className={`
                      w-full text-left p-5 rounded-xl border-2 transition-all transform
                      ${
                        showCorrect
                          ? "border-green-500 bg-green-50 scale-105 shadow-lg"
                          : showWrong
                          ? "border-red-500 bg-red-50"
                          : isSelected
                          ? "border-blue-500 bg-blue-50 scale-105"
                          : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                      }
                      ${showResult ? "cursor-not-allowed" : "cursor-pointer"}
                    `}
                  >
                    <div className="flex items-center">
                      <span
                        className={`
                        flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mr-4
                        ${
                          showCorrect
                            ? "bg-green-500 text-white"
                            : showWrong
                            ? "bg-red-500 text-white"
                            : isSelected
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700"
                        }
                      `}
                      >
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="font-medium text-gray-800 text-lg flex-1">
                        {option}
                      </span>
                      {showResult && (
                        <span className="ml-auto">
                          {showCorrect ? (
                            <CheckCircle className="w-8 h-8 text-green-500" />
                          ) : isSelected ? (
                            <XCircle className="w-8 h-8 text-red-500" />
                          ) : null}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {showResult && (
              <div
                className={`
                p-6 rounded-xl mb-6 border-2
                ${
                  isCorrect
                    ? "bg-green-50 border-green-300"
                    : "bg-amber-50 border-amber-300"
                }
              `}
              >
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <CheckCircle className="w-7 h-7 text-green-600 flex-shrink-0 mt-1" />
                  ) : (
                    <Lightbulb className="w-7 h-7 text-amber-600 flex-shrink-0 mt-1" />
                  )}
                  <div>
                    <p className="font-bold text-xl mb-2">
                      {isCorrect ? t("practice.correct") : t("practice.incorrect")}
                    </p>
                    <p className="text-gray-800 leading-relaxed">
                      <span className="font-semibold">
                        {t("practice.explanation")}
                      </span>{" "}
                      {question.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              {!showResult ? (
                <button
                  onClick={handleCheckAnswer}
                  disabled={selectedAnswer === null}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t("practice.checkAnswer")}
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  disabled={currentQuestion === questions.length - 1}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t("practice.nextQuestion")}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-full p-2 shadow-md">
          <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-teal-500 transition-all duration-500"
              style={{
                width: `${(answeredQuestions.length / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Real World Applications Component
const RealWorldMode: React.FC = () => {
  const { t, tValue } = useLanguage();

  const applicationsData = tValue("realWorld.applications");
  const applications: RealWorldApp[] = useMemo(() => {
    return Array.isArray(applicationsData) ? (applicationsData as unknown as RealWorldApp[]) : [];
  }, [applicationsData]);


  if (applications.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <p className="text-gray-600">{t("realWorld.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-500 via-teal-500 to-blue-500 text-white p-8">
            <h2 className="text-4xl font-bold mb-3">{t("realWorld.title")}</h2>
            <p className="text-blue-100 text-xl">{t("realWorld.subtitle")}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all p-6 border-2 border-transparent hover:border-blue-400 hover:scale-105 transform duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-6xl">{app.icon}</div>
                <span className="text-xs font-semibold px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                  {app.category}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                {app.title}
              </h3>

              <p className="text-gray-600 mb-4 leading-relaxed">
                {app.description}
              </p>

              <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg p-4 border-l-4 border-blue-500">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">{t("realWorld.example")}</span> {app.example}
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
              <Lightbulb className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                {t("nav.logo")}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("learn")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    activeTab === "learn"
                      ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-blue-50"
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                  {t("nav.tabs.learn")}
                </button>
                <button
                  onClick={() => setActiveTab("practice")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    activeTab === "practice"
                      ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-blue-50"
                  }`}
                >
                  <ClipboardCheck className="w-5 h-5" />
                  {t("nav.tabs.practice")}
                </button>
                <button
                  onClick={() => setActiveTab("realWorld")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    activeTab === "realWorld"
                      ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-blue-50"
                  }`}
                >
                  <Globe className="w-5 h-5" />
                  {t("nav.tabs.realWorld")}
                </button>
              </div>
              <LanguageSelector />
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-16">
        {activeTab === "learn" ? (
          <LightTravelStraightLine width={800} height={600} />
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