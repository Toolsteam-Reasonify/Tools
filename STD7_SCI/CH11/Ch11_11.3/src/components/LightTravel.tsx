import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
  ReactNode,
} from "react";

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
  activity:
    | "intro"
    | "materials"
    | "transparent"
    | "translucent"
    | "opaque"
    | "comparison"
    | "conclusion";
}

interface PracticeQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  visualType?: string;
}

interface RealWorldApp {
  id: number;
  title: string;
  description: string;
  icon: string;
  category: string;
  example: string;
  materialType: "transparent" | "translucent" | "opaque" | "mixed";
}

// Translation type definition
type TranslationValue =
  | string
  | string[]
  | number
  | { [key: string]: TranslationValue }
  | Array<{ [key: string]: TranslationValue }>;

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
    // Translation system removed - return key as-is
    return key;
  };

  const tValue = (key: string): TranslationValue => {
    // Translation system removed - return key as-is
    return key;
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
const DEFAULT_STEPS: Step[] = [
  {
    id: 1,
    title: "Introduction to Materials",
    description:
      "Light behaves differently when it encounters different materials",
    activity: "intro",
  },
  {
    id: 2,
    title: "Types of Materials",
    description: "Understanding transparent, translucent, and opaque materials",
    activity: "materials",
  },
  {
    id: 3,
    title: "Transparent Materials",
    description: "Light passes almost completely through transparent materials",
    activity: "transparent",
  },
  {
    id: 4,
    title: "Translucent Materials",
    description: "Light passes partially through translucent materials",
    activity: "translucent",
  },
  {
    id: 5,
    title: "Opaque Materials",
    description: "Light does not pass through opaque materials",
    activity: "opaque",
  },
  {
    id: 6,
    title: "Conclusion",
    description: "Summary of light behavior with materials",
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
    }, 10000);
    return () => window.clearTimeout(timer);
  }, [isPlaying, currentStepIndex, steps.length]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      setAnimationProgress((prev) => (prev + 0.01) % 1);
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

    const step = steps[currentStepIndex];
    drawVisualization(ctx, width, height, step.activity, animationProgress);
  }, [currentStepIndex, animationProgress, width, height, steps]);

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

  const step = steps[currentStepIndex];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-blue-50">
      {/* Main Content */}
      <div className="w-full max-w-7xl mx-auto pt-4 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mt-6">
          <div className="bg-gradient-to-r from-blue-500 via-teal-500 to-blue-500 text-white p-4 sm:p-6">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <h2 className="text-xl sm:text-2xl font-semibold">
                {step.title}
              </h2>
              <div className="text-sm bg-white/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full backdrop-blur-sm">
                Step {currentStepIndex + 1} of {steps.length}
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
                {step.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <button
                onClick={prevStep}
                disabled={currentStepIndex === 0}
                className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-all w-full sm:w-auto"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>

              <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex-1 sm:flex-none"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-5 h-5" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      Play
                    </>
                  )}
                </button>

                <button
                  onClick={resetMode}
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all flex-1 sm:flex-none"
                >
                  <RotateCcw className="w-5 h-5" />
                  Reset
                </button>
              </div>

              <button
                onClick={nextStep}
                disabled={currentStepIndex === steps.length - 1}
                className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all w-full sm:w-auto"
              >
                Next
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
  progress: number
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
    drawIntro(ctx, width, height, progress);
  } else if (stage === "materials") {
    drawMaterials(ctx, width, height, progress);
  } else if (stage === "transparent") {
    drawTransparent(ctx, width, height, progress);
  } else if (stage === "translucent") {
    drawTranslucent(ctx, width, height, progress);
  } else if (stage === "opaque") {
    drawOpaque(ctx, width, height, progress);
  } else if (stage === "conclusion") {
    drawConclusion(ctx, width, height, progress);
  }
}

function drawIntro(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number
) {
  const centerX = width / 2;
  const centerY = height / 2;

  // Title
  ctx.fillStyle = "#60A5FA";
  ctx.font = "bold 36px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(96, 165, 250, 0.5)";
  ctx.shadowBlur = 20;
  ctx.fillText("Light & Materials", centerX, centerY - 80);
  ctx.shadowBlur = 0;

  // Animated light beam
  const beamProgress = Math.min(progress * 1.5, 1);
  const beamStartX = 100;
  const beamEndX = beamStartX + (width - 200) * beamProgress;

  // Light source
  ctx.fillStyle = "#FFD700";
  ctx.beginPath();
  ctx.arc(beamStartX, centerY, 25, 0, Math.PI * 2);
  ctx.fill();

  // Light beam
  ctx.strokeStyle = "rgba(255, 215, 0, 0.6)";
  ctx.lineWidth = 40;
  ctx.beginPath();
  ctx.moveTo(beamStartX + 25, centerY);
  ctx.lineTo(beamEndX, centerY);
  ctx.stroke();

  // Brighter center
  ctx.strokeStyle = "rgba(255, 255, 150, 0.8)";
  ctx.lineWidth = 15;
  ctx.beginPath();
  ctx.moveTo(beamStartX + 25, centerY);
  ctx.lineTo(beamEndX, centerY);
  ctx.stroke();

  // Subtitle
  ctx.fillStyle = "#FFF";
  ctx.font = "20px Arial";
  ctx.fillText(
    "How does light interact with different materials?",
    centerX,
    centerY + 100
  );
}

function drawMaterials(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number
) {
  const centerX = width / 2;
  const spacing = width / 3;
  const materialY = height / 2;

  // Three materials with their properties
  const materials = [
    {
      name: "Transparent",
      color: "rgba(150, 200, 255, 0.3)",
      border: "#60A5FA",
      offset: 0,
      lightIntensity: 0.9,
      lightPasses: true,
    },
    {
      name: "Translucent",
      color: "rgba(150, 200, 255, 0.6)",
      border: "#3B82F6",
      offset: 0.2,
      lightIntensity: 0.5,
      lightPasses: true,
    },
    {
      name: "Opaque",
      color: "rgba(100, 100, 100, 0.9)",
      border: "#1F2937",
      offset: 0.4,
      lightIntensity: 0,
      lightPasses: false,
    },
  ];

  materials.forEach((mat, i) => {
    const matProgress = Math.max(0, Math.min(1, (progress - mat.offset) * 1.5));
    if (matProgress > 0) {
      const columnX = spacing * (i + 0.5);
      const torchX = columnX - 120;
      const materialX = columnX;
      const screenX = columnX + 120;

      // Torch
      if (matProgress > 0.1) {
        ctx.fillStyle = "#FFD700";
        ctx.beginPath();
        ctx.arc(torchX, materialY, 15, 0, Math.PI * 2);
        ctx.fill();
      }

      // Light beam animation
      const beamProgress = Math.min((matProgress - 0.1) * 1.2, 1);
      
      // Beam to material
      if (beamProgress > 0) {
        ctx.strokeStyle = "rgba(255, 215, 0, 0.6)";
        ctx.lineWidth = 25;
        ctx.beginPath();
        ctx.moveTo(torchX + 15, materialY);
        ctx.lineTo(
          torchX + 15 + (materialX - torchX - 50) * beamProgress,
          materialY
        );
        ctx.stroke();
      }

      // Material box
      const boxProgress = Math.min((matProgress - 0.2) * 2, 1);
      if (boxProgress > 0) {
        ctx.fillStyle = mat.color;
        ctx.strokeStyle = mat.border;
        ctx.lineWidth = 3;
        const boxHeight = 100 * boxProgress;
        ctx.fillRect(materialX - 40, materialY - boxHeight / 2, 80, boxHeight);
        ctx.strokeRect(materialX - 40, materialY - boxHeight / 2, 80, boxHeight);

        // Add texture for translucent
        if (mat.name === "Translucent" && boxProgress > 0.5) {
          for (let j = 0; j < 15; j++) {
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3})`;
            ctx.fillRect(
              materialX - 35 + Math.random() * 70,
              materialY - boxHeight / 2 + 10 + Math.random() * (boxHeight - 20),
              4,
              4
            );
          }
        }

        // Wood texture for opaque
        if (mat.name === "Opaque" && boxProgress > 0.5) {
          ctx.strokeStyle = "rgba(80, 50, 20, 0.5)";
          ctx.lineWidth = 2;
          for (let j = 0; j < 6; j++) {
            ctx.beginPath();
            ctx.moveTo(materialX - 35, materialY - boxHeight / 2 + j * 15);
            ctx.lineTo(materialX + 35, materialY - boxHeight / 2 + j * 15);
            ctx.stroke();
          }
        }
      }

      // Light passes through (for transparent and translucent)
      if (mat.lightPasses && beamProgress > 0.5) {
        const throughProgress = (beamProgress - 0.5) * 2;
        if (throughProgress > 0) {
          ctx.strokeStyle = `rgba(255, 215, 0, ${mat.lightIntensity * 0.6})`;
          ctx.lineWidth = 25;
          ctx.beginPath();
          ctx.moveTo(materialX + 40, materialY);
          ctx.lineTo(
            materialX + 40 + (screenX - materialX - 50) * throughProgress,
            materialY
          );
          ctx.stroke();

          // Brighter beam
          ctx.strokeStyle = `rgba(255, 255, 150, ${mat.lightIntensity * 0.8})`;
          ctx.lineWidth = 15;
          ctx.beginPath();
          ctx.moveTo(materialX + 40, materialY);
          ctx.lineTo(
            materialX + 40 + (screenX - materialX - 50) * throughProgress,
            materialY
          );
          ctx.stroke();
        }
      }

      // Screen
      if (beamProgress > 0.3) {
        ctx.fillStyle = "#FFF";
        ctx.fillRect(screenX - 8, materialY - 60, 8, 120);
      }

      // Light spot on screen (for transparent and translucent)
      if (mat.lightPasses && beamProgress > 0.8) {
        const spotProgress = (beamProgress - 0.8) * 5;
        if (spotProgress > 0) {
          const spotGradient = ctx.createRadialGradient(
            screenX - 8,
            materialY,
            0,
            screenX - 8,
            materialY,
            35
          );
          spotGradient.addColorStop(0, `rgba(255, 255, 150, ${mat.lightIntensity * spotProgress})`);
          spotGradient.addColorStop(1, "rgba(255, 255, 150, 0)");
          ctx.fillStyle = spotGradient;
          ctx.beginPath();
          ctx.arc(screenX - 8, materialY, 35, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Shadow for opaque
      if (!mat.lightPasses && beamProgress > 0.6) {
        const shadowProgress = (beamProgress - 0.6) * 2.5;
        if (shadowProgress > 0) {
          ctx.fillStyle = `rgba(0, 0, 0, ${0.5 * shadowProgress})`;
          ctx.fillRect(materialX + 40, materialY - 60, screenX - materialX - 48, 120);
        }
      }

      // Label
      if (matProgress > 0.3) {
        ctx.fillStyle = "#FFF";
        ctx.font = "bold 18px Arial";
        ctx.textAlign = "center";
        ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
        ctx.shadowBlur = 5;
        ctx.fillText(mat.name, columnX, materialY + 100);
        ctx.shadowBlur = 0;
      }
    }
  });

  // Title
  ctx.fillStyle = "#60A5FA";
  ctx.font = "bold 28px Arial";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 10;
  ctx.fillText("Three Types of Materials", centerX, 50);
  ctx.shadowBlur = 0;
}

function drawTransparent(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number
) {
  const centerX = width / 2;
  const centerY = height / 2;
  const torchX = 100;
  const materialX = centerX;
  const screenX = width - 100;

  // Torch
  ctx.fillStyle = "#FFD700";
  ctx.beginPath();
  ctx.arc(torchX, centerY, 20, 0, Math.PI * 2);
  ctx.fill();

  // Light beam animation
  const beamProgress = Math.min(progress * 1.5, 1);

  // Beam to material
  ctx.strokeStyle = "rgba(255, 215, 0, 0.6)";
  ctx.lineWidth = 40;
  ctx.beginPath();
  ctx.moveTo(torchX + 20, centerY);
  ctx.lineTo(
    torchX + 20 + (materialX - torchX - 70) * Math.min(beamProgress * 2, 1),
    centerY
  );
  ctx.stroke();

  // Transparent material (glass)
  ctx.fillStyle = "rgba(150, 200, 255, 0.3)";
  ctx.strokeStyle = "#60A5FA";
  ctx.lineWidth = 3;
  ctx.fillRect(materialX - 50, centerY - 80, 100, 160);
  ctx.strokeRect(materialX - 50, centerY - 80, 100, 160);

  // Light passes through
  if (beamProgress > 0.4) {
    const throughProgress = (beamProgress - 0.4) * 1.67;
    ctx.strokeStyle = "rgba(255, 215, 0, 0.6)";
    ctx.lineWidth = 40;
    ctx.beginPath();
    ctx.moveTo(materialX + 50, centerY);
    ctx.lineTo(
      materialX + 50 + (screenX - materialX - 70) * throughProgress,
      centerY
    );
    ctx.stroke();

    // Brighter beam
    ctx.strokeStyle = "rgba(255, 255, 150, 0.8)";
    ctx.lineWidth = 15;
    ctx.beginPath();
    ctx.moveTo(materialX + 50, centerY);
    ctx.lineTo(
      materialX + 50 + (screenX - materialX - 70) * throughProgress,
      centerY
    );
    ctx.stroke();
  }

  // Screen
  ctx.fillStyle = "#FFF";
  ctx.fillRect(screenX - 10, centerY - 100, 10, 200);

  // Light spot on screen
  if (beamProgress > 0.9) {
    const spotGradient = ctx.createRadialGradient(
      screenX - 10,
      centerY,
      0,
      screenX - 10,
      centerY,
      40
    );
    spotGradient.addColorStop(0, "rgba(255, 255, 150, 0.9)");
    spotGradient.addColorStop(1, "rgba(255, 255, 150, 0)");
    ctx.fillStyle = spotGradient;
    ctx.beginPath();
    ctx.arc(screenX - 10, centerY, 40, 0, Math.PI * 2);
    ctx.fill();
  }

  // Title label
  ctx.fillStyle = "#10B981";
  ctx.font = "bold 24px Arial";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 10;
  ctx.fillText("Transparent: Light passes almost completely", centerX, 80);
  ctx.shadowBlur = 0;

  // Component labels
  ctx.fillStyle = "#FFF";
  ctx.font = "bold 18px Arial";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
  ctx.shadowBlur = 5;
  
  // Light source label
  ctx.fillText("Light source", torchX, centerY + 50);
  
  // Material type label
  ctx.fillText("Transparent", materialX, centerY + 100);
  
  // Screen label (below the screen object)
  ctx.fillText("Screen", screenX - 5, centerY + 120);
  
  ctx.shadowBlur = 0;
}

function drawTranslucent(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number
) {
  const centerX = width / 2;
  const centerY = height / 2;
  const torchX = 100;
  const materialX = centerX;
  const screenX = width - 100;

  // Torch
  ctx.fillStyle = "#FFD700";
  ctx.beginPath();
  ctx.arc(torchX, centerY, 20, 0, Math.PI * 2);
  ctx.fill();

  // Light beam animation
  const beamProgress = Math.min(progress * 1.5, 1);

  // Beam to material
  ctx.strokeStyle = "rgba(255, 215, 0, 0.6)";
  ctx.lineWidth = 40;
  ctx.beginPath();
  ctx.moveTo(torchX + 20, centerY);
  ctx.lineTo(
    torchX + 20 + (materialX - torchX - 70) * Math.min(beamProgress * 2, 1),
    centerY
  );
  ctx.stroke();

  // Translucent material (frosted glass)
  ctx.fillStyle = "rgba(150, 200, 255, 0.6)";
  ctx.strokeStyle = "#3B82F6";
  ctx.lineWidth = 3;
  ctx.fillRect(materialX - 50, centerY - 80, 100, 160);
  ctx.strokeRect(materialX - 50, centerY - 80, 100, 160);

  // Add texture for translucent effect
  for (let i = 0; i < 20; i++) {
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3})`;
    ctx.fillRect(
      materialX - 40 + Math.random() * 80,
      centerY - 70 + Math.random() * 140,
      5,
      5
    );
  }

  // Light passes through partially (scattered)
  if (beamProgress > 0.4) {
    const throughProgress = (beamProgress - 0.4) * 1.67;

    // Scattered light
    ctx.strokeStyle = "rgba(255, 215, 0, 0.3)";
    ctx.lineWidth = 50;
    ctx.beginPath();
    ctx.moveTo(materialX + 50, centerY);
    ctx.lineTo(
      materialX + 50 + (screenX - materialX - 70) * throughProgress,
      centerY
    );
    ctx.stroke();

    // Main beam (dimmer)
    ctx.strokeStyle = "rgba(255, 255, 150, 0.5)";
    ctx.lineWidth = 20;
    ctx.beginPath();
    ctx.moveTo(materialX + 50, centerY);
    ctx.lineTo(
      materialX + 50 + (screenX - materialX - 70) * throughProgress,
      centerY
    );
    ctx.stroke();
  }

  // Screen
  ctx.fillStyle = "#FFF";
  ctx.fillRect(screenX - 10, centerY - 100, 10, 200);

  // Dimmer light spot on screen
  if (beamProgress > 0.9) {
    const spotGradient = ctx.createRadialGradient(
      screenX - 10,
      centerY,
      0,
      screenX - 10,
      centerY,
      50
    );
    spotGradient.addColorStop(0, "rgba(255, 255, 150, 0.5)");
    spotGradient.addColorStop(1, "rgba(255, 255, 150, 0)");
    ctx.fillStyle = spotGradient;
    ctx.beginPath();
    ctx.arc(screenX - 10, centerY, 50, 0, Math.PI * 2);
    ctx.fill();
  }

  // Title label
  ctx.fillStyle = "#F59E0B";
  ctx.font = "bold 24px Arial";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 10;
  ctx.fillText("Translucent: Light passes partially", centerX, 80);
  ctx.shadowBlur = 0;

  // Component labels
  ctx.fillStyle = "#FFF";
  ctx.font = "bold 18px Arial";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
  ctx.shadowBlur = 5;
  
  // Light source label
  ctx.fillText("Light source", torchX, centerY + 50);
  
  // Material type label
  ctx.fillText("Translucent", materialX, centerY + 100);
  
  // Screen label (below the screen object)
  ctx.fillText("Screen", screenX - 5, centerY + 120);
  
  ctx.shadowBlur = 0;
}

function drawOpaque(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number
) {
  const centerX = width / 2;
  const centerY = height / 2;
  const torchX = 100;
  const materialX = centerX;
  const screenX = width - 100;

  // Torch
  ctx.fillStyle = "#FFD700";
  ctx.beginPath();
  ctx.arc(torchX, centerY, 20, 0, Math.PI * 2);
  ctx.fill();

  // Light beam animation
  const beamProgress = Math.min(progress * 1.5, 1);

  // Beam to material (blocked)
  const blockX = materialX - 50;
  ctx.strokeStyle = "rgba(255, 215, 0, 0.6)";
  ctx.lineWidth = 40;
  ctx.beginPath();
  ctx.moveTo(torchX + 20, centerY);
  ctx.lineTo(
    Math.min(torchX + 20 + (blockX - torchX - 20) * beamProgress, blockX),
    centerY
  );
  ctx.stroke();

  // Opaque material (cardboard/wood)
  ctx.fillStyle = "rgba(139, 69, 19, 0.95)";
  ctx.strokeStyle = "#1F2937";
  ctx.lineWidth = 3;
  ctx.fillRect(materialX - 50, centerY - 80, 100, 160);
  ctx.strokeRect(materialX - 50, centerY - 80, 100, 160);

  // Wood texture
  ctx.strokeStyle = "rgba(101, 67, 33, 0.5)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.moveTo(materialX - 40, centerY - 70 + i * 20);
    ctx.lineTo(materialX + 40, centerY - 70 + i * 20);
    ctx.stroke();
  }

  // No light passes through - X mark
  if (beamProgress > 0.9) {
    ctx.strokeStyle = "#EF4444";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(materialX + 30, centerY - 30);
    ctx.lineTo(materialX + 70, centerY + 30);
    ctx.moveTo(materialX + 70, centerY - 30);
    ctx.lineTo(materialX + 30, centerY + 30);
    ctx.stroke();
  }

  // Screen
  ctx.fillStyle = "#FFF";
  ctx.fillRect(screenX - 10, centerY - 100, 10, 200);

  // No light on screen - dark
  if (beamProgress > 0.9) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fillRect(screenX - 10, centerY - 100, 10, 200);
  }

  // Shadow behind material
  if (beamProgress > 0.5) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(materialX + 50, centerY - 80, screenX - materialX - 60, 160);
  }

  // Title label
  ctx.fillStyle = "#EF4444";
  ctx.font = "bold 24px Arial";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 10;
  ctx.fillText("Opaque: Light does NOT pass through", centerX, 80);
  ctx.shadowBlur = 0;

  // Component labels
  ctx.fillStyle = "#FFF";
  ctx.font = "bold 18px Arial";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
  ctx.shadowBlur = 5;
  
  // Light source label
  ctx.fillText("Light source", torchX, centerY + 50);
  
  // Material type label
  ctx.fillText("Opaque", materialX, centerY + 100);
  
  // Screen label (below the screen object)
  ctx.fillText("Screen", screenX - 5, centerY + 120);
  
  ctx.shadowBlur = 0;
}

function drawConclusion(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number
) {
  const centerX = width / 2;
  const centerY = height / 2;

  // Central lightbulb
  if (progress > 0.3) {
    const bulbProgress = (progress - 0.3) * 1.5;
    const glowGradient = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      80
    );
    glowGradient.addColorStop(0, `rgba(255, 215, 0, ${0.8 * bulbProgress})`);
    glowGradient.addColorStop(1, "rgba(255, 215, 0, 0)");

    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 80 * bulbProgress, 0, Math.PI * 2);
    ctx.fill();

    // Lightbulb emoji
    ctx.fillStyle = "#FFD700";
    ctx.font = "80px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("💡", centerX, centerY);
  }

  // Key points
  const points = [
    { text: "Transparent: Light passes completely", y: centerY - 150 },
    { text: "Translucent: Light passes partially", y: centerY + 120 },
    { text: "Opaque: Light blocked completely", y: centerY + 170 },
  ];

  points.forEach((point, i) => {
    const pointProgress = Math.max(
      0,
      Math.min(1, (progress - 0.5 - i * 0.1) * 3)
    );
    if (pointProgress > 0) {
      ctx.fillStyle = `rgba(255, 255, 255, ${pointProgress})`;
      ctx.font = "20px Arial";
      ctx.textAlign = "center";
      ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
      ctx.shadowBlur = 5;
      ctx.fillText(point.text, centerX, point.y);
      ctx.shadowBlur = 0;
    }
  });

  // Title
  ctx.fillStyle = "#10B981";
  ctx.font = "bold 32px Arial";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 15;
  ctx.fillText("Materials & Light", centerX, 80);
  ctx.shadowBlur = 0;
}

// Practice Mode Component
const PracticeMode: React.FC = () => {
  const questions: PracticeQuestion[] = [
    {
      id: 1,
      question: "Which type of material allows light to pass almost completely through it?",
      options: [
        "Opaque",
        "Transparent",
        "Translucent",
        "Reflective"
      ],
      correctAnswer: 1,
      explanation: "Transparent materials like clear glass allow light to pass almost completely through them, so we can see clearly through them.",
      visualType: "transparent"
    },
    {
      id: 2,
      question: "What happens when light hits an opaque object?",
      options: [
        "Light passes completely through",
        "Light passes partially through",
        "Light does not pass through at all",
        "Light speeds up"
      ],
      correctAnswer: 2,
      explanation: "Opaque materials like wood or metal do not allow light to pass through them. This is why they form dark shadows.",
      visualType: "opaque"
    },
    {
      id: 3,
      question: "Which of these is an example of a translucent material?",
      options: [
        "Clear window glass",
        "Wooden door",
        "Frosted glass",
        "Metal plate"
      ],
      correctAnswer: 2,
      explanation: "Frosted glass is translucent - it allows some light to pass through but scatters it, so you cannot see clearly through it.",
      visualType: "translucent"
    },
    {
      id: 4,
      question: "Why do opaque objects form darker shadows than translucent objects?",
      options: [
        "Because they are bigger",
        "Because they are heavier",
        "Because they block all light completely",
        "Because they reflect more light"
      ],
      correctAnswer: 2,
      explanation: "Opaque objects block all the light that hits them, creating darker shadows. Translucent objects let some light through, so their shadows are lighter.",
      visualType: "shadow"
    },
    {
      id: 5,
      question: "If you shine a torch through tracing paper, what type of material is the tracing paper?",
      options: [
        "Transparent",
        "Translucent",
        "Opaque",
        "Luminous"
      ],
      correctAnswer: 1,
      explanation: "Tracing paper is translucent. You can see light through it, but objects on the other side appear blurry because the light is scattered.",
      visualType: "translucent"
    },
    {
      id: 6,
      question: "Which statement is TRUE about transparent materials?",
      options: [
        "They form the darkest shadows",
        "They can create faint shadows",
        "They never allow any light through",
        "They always change the color of light"
      ],
      correctAnswer: 1,
      explanation: "Even transparent materials can create faint shadows because they may absorb or reflect a small amount of light.",
      visualType: "transparent"
    },
    {
      id: 7,
      question: "What is the main difference between transparent and translucent materials?",
      options: [
        "Transparent materials are always colored",
        "You can see clearly through transparent materials but not through translucent ones",
        "Translucent materials block all light",
        "There is no difference"
      ],
      correctAnswer: 1,
      explanation: "Transparent materials like clear glass allow you to see clearly through them, while translucent materials like frosted glass scatter light so you cannot see clearly through them.",
      visualType: "comparison"
    },
    {
      id: 8,
      question: "Which of the following materials would block the most light?",
      options: [
        "Clear plastic bottle",
        "Tissue paper",
        "Cardboard",
        "Clean water"
      ],
      correctAnswer: 2,
      explanation: "Cardboard is an opaque material that blocks all light, while the others allow varying amounts of light to pass through.",
      visualType: "opaque"
    },
    {
      id: 9,
      question: "A student places different objects between a torch and a screen. Which object will create NO shadow on the screen?",
      options: [
        "A clear glass plate",
        "A book",
        "Butter paper",
        "None - all objects create some shadow"
      ],
      correctAnswer: 3,
      explanation: "All objects create at least some shadow. Even transparent objects can create faint shadows because they absorb or reflect a small amount of light.",
      visualType: "shadow"
    },
    {
      id: 10,
      question: "Why is frosted glass used in bathroom windows instead of clear glass?",
      options: [
        "It is cheaper than clear glass",
        "It provides privacy while still allowing light to enter",
        "It blocks all light completely",
        "It is stronger than clear glass"
      ],
      correctAnswer: 1,
      explanation: "Frosted glass is translucent - it scatters light so people cannot see clearly through it (providing privacy), but still allows light to pass through (keeping the room bright).",
      visualType: "translucent"
    },
    {
      id: 11,
      question: "Which type of material would be best for making an umbrella?",
      options: [
        "Transparent material",
        "Translucent material",
        "Opaque material",
        "Any material works equally well"
      ],
      correctAnswer: 2,
      explanation: "Opaque materials are best for umbrellas because they block all light and rain completely, providing maximum protection from sun and rain.",
      visualType: "opaque"
    },
    {
      id: 12,
      question: "A greenhouse is built using transparent glass. What is the main advantage of this?",
      options: [
        "Glass is the cheapest material",
        "Maximum sunlight can reach the plants inside",
        "It keeps the greenhouse very cold",
        "It blocks all insects"
      ],
      correctAnswer: 1,
      explanation: "Transparent glass allows almost all sunlight to pass through to the plants inside, while still protecting them from wind and cold. Plants need maximum sunlight for photosynthesis.",
      visualType: "transparent"
    },
    {
      id: 13,
      question: "If you cannot see clearly through a material but light passes through it, the material is:",
      options: [
        "Transparent",
        "Translucent",
        "Opaque",
        "Luminous"
      ],
      correctAnswer: 1,
      explanation: "Translucent materials allow light to pass through but scatter it, so you cannot see clearly through them. Examples include frosted glass, butter paper, and thin fabric.",
      visualType: "translucent"
    },
    {
      id: 14,
      question: "Which combination is CORRECT?",
      options: [
        "Clear water - Opaque, Cardboard - Transparent",
        "Glass window - Transparent, Tracing paper - Translucent",
        "Frosted glass - Opaque, Metal sheet - Transparent",
        "Tissue paper - Opaque, Wood - Translucent"
      ],
      correctAnswer: 1,
      explanation: "Glass windows are transparent (you can see clearly through them), and tracing paper is translucent (light passes through but you cannot see clearly).",
      visualType: "comparison"
    },
    {
      id: 15,
      question: "What would happen if you replaced a transparent window with an opaque wall?",
      options: [
        "More light would enter the room",
        "The same amount of light would enter",
        "No natural light would enter the room",
        "Only some light would enter"
      ],
      correctAnswer: 2,
      explanation: "An opaque wall blocks all light completely. No natural light would be able to pass through it into the room, making the room dark during the day.",
      visualType: "opaque"
    }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (!showResult) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) {
      alert("Please select an answer!");
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

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
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
              Quiz Complete! 🎉
            </h2>
            <p className="text-2xl text-gray-600 mb-3">
              Your Final Score
            </p>
            <p className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-8">
              {score} / {questions.length}
            </p>
            <div className="mb-8">
              <p className="text-lg text-gray-700">
                {percentage === 100
                  ? "Perfect! You're a materials expert! 🌟"
                  : percentage >= 80
                  ? "Excellent! You have a great understanding! 🎊"
                  : percentage >= 70
                  ? "Great job! You understand materials well! 🎉"
                  : percentage >= 60
                  ? "Good effort! Keep learning! 📚"
                  : "Keep practicing to improve! 💪"}
              </p>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleRestart}
                className="px-10 py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all"
              >
                Try Again
              </button>
            </div>
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
            <h2 className="text-3xl font-bold mb-2">Practice: Materials & Light</h2>
            <p className="text-blue-100 text-lg">Test your understanding of transparent, translucent, and opaque materials</p>
            <div className="mt-6 flex justify-between items-center flex-wrap gap-4">
              <span className="text-sm bg-white/20 px-5 py-2.5 rounded-full font-semibold">
                Question {currentQuestion + 1} / {questions.length}
              </span>
              <span className="text-sm bg-white/20 px-5 py-2.5 rounded-full font-semibold">
                Score: {score} / {answeredQuestions.length}
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
                      {isCorrect ? "Correct! 🎉" : "Not quite right"}
                    </p>
                    <p className="text-gray-800 leading-relaxed">
                      <span className="font-semibold">Explanation: </span>
                      {question.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>
              
              <div className="flex-1 flex gap-4">
                {!showResult ? (
                  <button
                    onClick={handleCheckAnswer}
                    disabled={selectedAnswer === null}
                    className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Check Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    disabled={currentQuestion === questions.length - 1}
                    className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Question
                  </button>
                )}
              </div>
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
          <p className="text-center text-sm text-gray-600 mt-2">
            {answeredQuestions.length} of {questions.length} questions answered
          </p>
        </div>
      </div>
    </div>
  );
};

// Real World Applications Component
const RealWorldMode: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterMaterial, setFilterMaterial] = useState<string>("all");

  const applications: RealWorldApp[] = [
    {
      id: 1,
      title: "Windows & Doors",
      description: "Homes use transparent glass for windows to let light in while protecting from weather. Frosted or translucent glass is used for bathroom windows for privacy while still allowing light.",
      icon: "🏠",
      category: "Architecture",
      example: "Clear glass windows let you see outside, while frosted bathroom windows give privacy",
      materialType: "mixed"
    },
    {
      id: 2,
      title: "Greenhouses",
      description: "Greenhouses use transparent materials like glass or clear plastic to allow maximum sunlight to reach plants while protecting them from cold and wind.",
      icon: "🌱",
      category: "Agriculture",
      example: "Farmers grow vegetables year-round in transparent greenhouses",
      materialType: "transparent"
    },
    {
      id: 3,
      title: "Sunglasses & Goggles",
      description: "Sunglasses use translucent tinted materials that block some light to protect eyes from bright sunlight while still allowing us to see clearly.",
      icon: "🕶️",
      category: "Eye Protection",
      example: "Sunglasses reduce bright sunlight but you can still see through them",
      materialType: "translucent"
    },
    {
      id: 4,
      title: "Lampshades",
      description: "Lampshades are often made from translucent materials that soften and diffuse light, creating pleasant ambient lighting instead of harsh direct light.",
      icon: "💡",
      category: "Lighting",
      example: "Paper lampshades spread light evenly across a room",
      materialType: "translucent"
    },
    {
      id: 5,
      title: "Privacy Screens",
      description: "Office dividers and hospital curtains use translucent materials to provide privacy while still allowing light to pass through, keeping spaces bright.",
      icon: "🏥",
      category: "Privacy",
      example: "Hospital curtains around beds let light through but hide patients",
      materialType: "translucent"
    },
    {
      id: 6,
      title: "Curtains & Blinds",
      description: "Homes use different materials - transparent curtains for light, translucent ones for soft light with privacy, and opaque blinds to block light completely for sleeping.",
      icon: "🪟",
      category: "Home Design",
      example: "Thick curtains block morning sunlight so you can sleep longer",
      materialType: "mixed"
    },
    {
      id: 7,
      title: "Camera Filters",
      description: "Photographers use transparent and translucent filters on cameras to control how much light enters, creating different effects in photos.",
      icon: "📷",
      category: "Photography",
      example: "UV filters protect camera lenses while still allowing light through",
      materialType: "transparent"
    },
    {
      id: 8,
      title: "Solar Panels",
      description: "Solar panels have a transparent glass cover that lets sunlight reach the solar cells inside while protecting them from rain and damage.",
      icon: "☀️",
      category: "Energy",
      example: "Clear glass on solar panels lets maximum sunlight in to generate electricity",
      materialType: "transparent"
    },
    {
      id: 9,
      title: "Food Packaging",
      description: "Clear plastic packaging for fruits and vegetables is transparent so shoppers can see the food inside. Some packaging is translucent to protect sensitive items from too much light.",
      icon: "🥗",
      category: "Food Industry",
      example: "Transparent plastic boxes let you check if strawberries are fresh",
      materialType: "transparent"
    },
    {
      id: 10,
      title: "Aquariums",
      description: "Aquarium walls are made of transparent glass or acrylic so we can observe fish and marine life clearly while keeping water contained.",
      icon: "🐠",
      category: "Entertainment",
      example: "Thick transparent glass in aquariums lets visitors see underwater creatures",
      materialType: "transparent"
    },
    {
      id: 11,
      title: "Umbrellas",
      description: "Most umbrellas use opaque fabric to completely block rain and sunlight, while some decorative umbrellas use translucent materials for style.",
      icon: "☂️",
      category: "Daily Use",
      example: "Black opaque umbrellas block all sunlight and rain",
      materialType: "opaque"
    },
    {
      id: 12,
      title: "Traffic Signals",
      description: "Traffic light covers use translucent colored materials (red, yellow, green) that allow light to shine through while adding color for different signals.",
      icon: "🚦",
      category: "Transportation",
      example: "Red translucent covers let light through but make it appear red",
      materialType: "translucent"
    },
    {
      id: 13,
      title: "Book Covers",
      description: "Books use opaque covers to protect pages from light, dust, and damage. The pages inside are also opaque so text on one side doesn't show through to the other.",
      icon: "📚",
      category: "Education",
      example: "Cardboard book covers completely block light and protect pages",
      materialType: "opaque"
    },
    {
      id: 14,
      title: "Car Windshields",
      description: "Car windshields are made of transparent glass or plastic so drivers can see clearly. Side windows may have translucent tinting to reduce glare and heat.",
      icon: "🚗",
      category: "Transportation",
      example: "Clear windshields provide full visibility for safe driving",
      materialType: "mixed"
    },
    {
      id: 15,
      title: "Stained Glass Windows",
      description: "Churches and decorative buildings use translucent colored glass that creates beautiful patterns with light while partially obscuring the view.",
      icon: "⛪",
      category: "Art & Architecture",
      example: "Colored glass in churches creates colorful light patterns inside",
      materialType: "translucent"
    },
    {
      id: 16,
      title: "Swimming Pool Covers",
      description: "Pool covers are usually opaque to block sunlight, preventing algae growth and reducing water evaporation. Some safety covers use translucent materials.",
      icon: "🏊",
      category: "Recreation",
      example: "Opaque pool covers keep water clean by blocking sunlight",
      materialType: "opaque"
    },
    {
      id: 17,
      title: "X-Ray Films",
      description: "Medical X-ray films are translucent, allowing doctors to see bones and internal structures when light is shone through them.",
      icon: "🏥",
      category: "Medical",
      example: "Doctors hold X-ray films up to light to see bone fractures",
      materialType: "translucent"
    },
    {
      id: 18,
      title: "Smartphone Screens",
      description: "Phone screens use transparent glass or plastic over the display, allowing you to see images clearly while protecting the electronics inside.",
      icon: "📱",
      category: "Technology",
      example: "Transparent screen protectors shield your phone while letting you see the display",
      materialType: "transparent"
    },
    {
      id: 19,
      title: "Tents & Camping Gear",
      description: "Tent fabric is opaque to provide shade and privacy. Some tents have transparent windows for ventilation and to see outside.",
      icon: "⛺",
      category: "Outdoor Activities",
      example: "Opaque tent walls provide shelter and privacy while camping",
      materialType: "mixed"
    },
    {
      id: 20,
      title: "Glasses & Contact Lenses",
      description: "Eyeglasses and contact lenses are made of transparent materials to correct vision without blocking sight. They allow light to pass through clearly.",
      icon: "👓",
      category: "Vision Correction",
      example: "Transparent lenses help you see clearly without blocking your view",
      materialType: "transparent"
    },
    {
      id: 21,
      title: "Plastic Bottles",
      description: "Water bottles are transparent so you can see the contents and check cleanliness. Milk bottles may be translucent to protect from light damage.",
      icon: "🍶",
      category: "Packaging",
      example: "Clear plastic bottles let you see how much water is left",
      materialType: "transparent"
    },
    {
      id: 22,
      title: "Shower Doors",
      description: "Bathrooms use frosted or textured translucent glass for shower doors to provide privacy while still allowing light to enter the shower area.",
      icon: "🚿",
      category: "Home Design",
      example: "Frosted shower doors give privacy but keep the bathroom bright",
      materialType: "translucent"
    },
    {
      id: 23,
      title: "Projection Screens",
      description: "Movie theater screens are typically opaque white surfaces that reflect projected light to create bright, clear images for viewers.",
      icon: "🎬",
      category: "Entertainment",
      example: "White opaque screens in theaters reflect movie projector light",
      materialType: "opaque"
    },
    {
      id: 24,
      title: "Diving Masks",
      description: "Scuba diving and snorkeling masks use transparent glass or plastic so divers can see underwater clearly while protecting their eyes.",
      icon: "🤿",
      category: "Water Sports",
      example: "Clear diving masks let you see colorful fish and coral underwater",
      materialType: "transparent"
    }
  ];

  const categories = ["all", ...Array.from(new Set(applications.map(app => app.category)))];
  const materials = ["all", "transparent", "translucent", "opaque", "mixed"];

  const filteredApplications = applications.filter(app => {
    const categoryMatch = filterCategory === "all" || app.category === filterCategory;
    const materialMatch = filterMaterial === "all" || app.materialType === filterMaterial;
    return categoryMatch && materialMatch;
  });

  const getMaterialBadgeColor = (type: string) => {
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
              <h2 className="text-4xl font-bold">Real World Applications</h2>
            </div>
            <p className="text-blue-100 text-xl">
              Discover how transparent, translucent, and opaque materials are used in everyday life
            </p>
          </div>

          {/* Filters */}
          <div className="p-6 bg-gray-50 border-b">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Filter by Category
                </label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === "all" ? "All Categories" : cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Filter by Material Type
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
            </div>

            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredApplications.length} of {applications.length} applications
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
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${getMaterialBadgeColor(app.materialType)}`}>
                    {app.materialType.charAt(0).toUpperCase() + app.materialType.slice(1)}
                  </span>
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
                  <span className="font-semibold">💡 Example: </span>
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
              No applications found with the selected filters.
            </p>
            <button
              onClick={() => {
                setFilterCategory("all");
                setFilterMaterial("all");
              }}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Reset Filters
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
  const [activeTab, setActiveTab] = useState<TabType>("learn");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-blue-50">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-blue-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                Light & Materials
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
                  Learn
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
                  Practice
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
                  Real World
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
