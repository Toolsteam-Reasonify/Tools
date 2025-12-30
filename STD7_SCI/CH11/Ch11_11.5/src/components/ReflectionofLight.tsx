import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
  ReactNode,
} from "react";
import translationsData from "../locales/translation.json";
import { Lightbulb, ArrowRight, ArrowLeft, Play, Pause, RotateCw, CheckCircle, XCircle, RefreshCw, Target, Award, Camera, Car, Eye, Home, Smartphone, Sun, Telescope, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

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

// Suppress runtime.lastError warnings from browser extensions
if (typeof window !== 'undefined' && typeof console !== 'undefined') {
  // Safely store original console methods
  const originalError = typeof console.error === 'function' ? console.error.bind(console) : null;
  const originalWarn = typeof console.warn === 'function' ? console.warn.bind(console) : null;
  const originalLog = typeof console.log === 'function' ? console.log.bind(console) : null;
  
  const shouldSuppress = (message: string): boolean => {
    const msg = message.toLowerCase();
    return msg.includes('runtime.lasterror') || 
           msg.includes('message port closed') || 
           msg.includes('unchecked runtime.lasterror') ||
           (msg.includes('invalid values for props') && (msg.includes('error') || msg.includes('warn') || msg.includes('log')));
  };
  
  // Override console.error with safe error handling
  if (originalError) {
    try {
      console.error = (...args: unknown[]) => {
        try {
          const message = String(args[0] || '');
          if (shouldSuppress(message)) {
            return;
          }
          originalError(...args);
        } catch (e) {
          // Silently fail if there's an error in the override
        }
      };
    } catch (e) {
      // If override fails, keep original
    }
  }
  
  // Override console.warn with safe error handling
  if (originalWarn) {
    try {
      console.warn = (...args: unknown[]) => {
        try {
          const message = String(args[0] || '');
          if (shouldSuppress(message)) {
            return;
          }
          originalWarn(...args);
        } catch (e) {
          // Silently fail if there's an error in the override
        }
      };
    } catch (e) {
      // If override fails, keep original
    }
  }
  
  // Override console.log with safe error handling
  if (originalLog) {
    try {
      console.log = (...args: unknown[]) => {
        try {
          const message = String(args[0] || '');
          if (shouldSuppress(message)) {
            return;
          }
          originalLog(...args);
        } catch (e) {
          // Silently fail if there's an error in the override
        }
      };
    } catch (e) {
      // If override fails, keep original
    }
  }
  
  // Suppress unhandled promise rejections from browser extensions
  try {
    window.addEventListener('unhandledrejection', (event) => {
      try {
        const message = String(event.reason || '');
        if (shouldSuppress(message)) {
          event.preventDefault();
        }
      } catch (e) {
        // Silently fail
      }
    });
  } catch (e) {
    // Silently fail if listener can't be added
  }
  
  // Suppress errors from browser extensions via error event listener
  try {
    window.addEventListener('error', (event) => {
      try {
        const message = String(event.message || '');
        if (shouldSuppress(message)) {
          event.preventDefault();
          event.stopPropagation();
          return false;
        }
      } catch (e) {
        // Silently fail
      }
    }, true);
  } catch (e) {
    // Silently fail if listener can't be added
  }
  
  // Suppress Chrome extension runtime errors
  try {
    if (window.chrome && window.chrome.runtime && window.chrome.runtime.lastError) {
      // Override lastError getter to prevent warnings
      Object.defineProperty(window.chrome.runtime, 'lastError', {
        get: () => null,
        configurable: true
      });
    }
  } catch (e) {
    // Silently fail if we can't override
  }
}

// Simple icon components
const BookOpen = ({ className }: { className?: string }) => {
  const svgProps: React.SVGProps<SVGSVGElement> = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    viewBox: "0 0 24 24"
  };
  
  // Filter props to remove any injected invalid props
  const filteredSvgProps: Record<string, unknown> = {};
  const invalidKeys = ['error', 'warn', 'log'];
  for (const key in svgProps) {
    if (!invalidKeys.includes(key)) {
      filteredSvgProps[key] = svgProps[key as keyof typeof svgProps];
    }
  }
  
  const pathData = "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z";
  
  return (
    <svg {...(filteredSvgProps as React.SVGProps<SVGSVGElement>)}>
      <path d={pathData} />
    </svg>
  );
};

const ClipboardCheck = ({ className }: { className?: string }) => {
  const svgProps: React.SVGProps<SVGSVGElement> = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    viewBox: "0 0 24 24"
  };
  
  // Filter props to remove any injected invalid props
  const filteredSvgProps: Record<string, unknown> = {};
  const invalidKeys = ['error', 'warn', 'log'];
  for (const key in svgProps) {
    if (!invalidKeys.includes(key)) {
      filteredSvgProps[key] = svgProps[key as keyof typeof svgProps];
    }
  }
  
  const pathData = "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9l2 2 4-4";
  
  return (
    <svg {...(filteredSvgProps as React.SVGProps<SVGSVGElement>)}>
      <path d={pathData} />
    </svg>
  );
};

const Globe = ({ className }: { className?: string }) => {
  const svgProps: React.SVGProps<SVGSVGElement> = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    viewBox: "0 0 24 24"
  };
  
  // Filter props to remove any injected invalid props
  const filteredSvgProps: Record<string, unknown> = {};
  const invalidKeys = ['error', 'warn', 'log'];
  for (const key in svgProps) {
    if (!invalidKeys.includes(key)) {
      filteredSvgProps[key] = svgProps[key as keyof typeof svgProps];
    }
  }
  
  return (
    <svg {...(filteredSvgProps as React.SVGProps<SVGSVGElement>)}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
};

type Language = "en" | "hi" | "gu";
type TabType = "learn" | "practice" | "realWorld";




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

// Reflection of Light Learn Component
const ReflectionOfLightLearn = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mirrorAngle, setMirrorAngle] = useState(45);
  const [animationPhase, setAnimationPhase] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sunlightCanvasRef = useRef<HTMLCanvasElement>(null);
  const straightLineCanvasRef = useRef<HTMLCanvasElement>(null);
  const faceCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  const steps = [
    {
      title: "Understanding Reflection of Light",
      content: "When light hits a shiny surface like a mirror, it bounces back. This bouncing of light is called reflection. Watch how the light beam interacts with the mirror surface.",
      visual: "intro",
      phases: 4
    },
    {
      title: "Activity 11.5: Redirecting Sunlight",
      content: "Take a plane mirror outside on a sunny day. Hold it so sunlight falls on it. Now tilt the mirror slowly and observe how the reflected sunlight moves on a nearby wall.",
      visual: "sunlight",
      phases: 5
    },
    {
      title: "Light Travels in Straight Lines",
      content: "Using a torch and mirror with a thin beam of light, you can see that light travels in a perfectly straight line before hitting the mirror, and continues in another straight line after reflection.",
      visual: "straightLine",
      phases: 4
    },
    {
      title: "Activity 11.6: Changing Direction Interactively",
      content: "Try rotating the mirror below. Notice how the reflected light changes direction, but the incident and reflected rays always remain straight lines.",
      visual: "interactive",
      phases: 1
    },
    {
      title: "Seeing Your Reflection",
      content: "When you look in a mirror, light from your face travels to the mirror, reflects off its surface, and enters your eyes. This reflected light creates the image you see.",
      visual: "face",
      phases: 6
    }
  ];

  // Animation phase progression
  useEffect(() => {
    const currentStepData = steps[currentStep];
    if (animationPhase < currentStepData.phases) {
      const timer = setTimeout(() => {
        setAnimationPhase(prev => prev + 1);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [animationPhase, currentStep]);

  // Auto-play
  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1 && animationPhase >= steps[currentStep].phases) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setAnimationPhase(0);
      }, 2000);
      return () => clearTimeout(timer);
    } else if (isPlaying && currentStep === steps.length - 1 && animationPhase >= steps[currentStep].phases) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, animationPhase]);

  useEffect(() => {
    setAnimationPhase(0);
  }, [currentStep]);

  // Realistic Interactive Mirror Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || steps[currentStep].visual !== 'interactive') return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const drawRealisticMirror = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2 + 20;
      const mirrorLength = 160;
      const angleRad = (mirrorAngle * Math.PI) / 180;
      
      // Draw room background with gradient
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGradient.addColorStop(0, '#1a1a2e');
      bgGradient.addColorStop(1, '#16213e');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw subtle grid for depth
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 30) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }
      
      // Light source position
      const lightX = 80;
      const lightY = 80;
      
      // Draw realistic light source (torch/bulb)
      const lightGlow = ctx.createRadialGradient(lightX, lightY, 0, lightX, lightY, 40);
      lightGlow.addColorStop(0, 'rgba(255, 220, 100, 1)');
      lightGlow.addColorStop(0.3, 'rgba(255, 200, 80, 0.8)');
      lightGlow.addColorStop(0.6, 'rgba(255, 180, 60, 0.3)');
      lightGlow.addColorStop(1, 'rgba(255, 160, 40, 0)');
      ctx.fillStyle = lightGlow;
      ctx.fillRect(lightX - 40, lightY - 40, 80, 80);
      
      // Draw light bulb
      ctx.beginPath();
      ctx.arc(lightX, lightY, 12, 0, Math.PI * 2);
      ctx.fillStyle = '#ffd700';
      ctx.fill();
      ctx.strokeStyle = '#ffed4e';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Bulb highlight
      ctx.beginPath();
      ctx.arc(lightX - 3, lightY - 3, 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fill();
      
      // Calculate incident ray path
      const dx = centerX - lightX;
      const dy = centerY - lightY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Draw realistic incident light beam with cone
      const beamWidth = 8;
      ctx.save();
      ctx.translate(lightX, lightY);
      const beamAngle = Math.atan2(dy, dx);
      ctx.rotate(beamAngle);
      
      // Beam gradient
      const beamGradient = ctx.createLinearGradient(0, 0, distance, 0);
      beamGradient.addColorStop(0, 'rgba(255, 220, 100, 0.9)');
      beamGradient.addColorStop(0.5, 'rgba(255, 200, 80, 0.7)');
      beamGradient.addColorStop(1, 'rgba(255, 180, 60, 0.5)');
      
      ctx.fillStyle = beamGradient;
      ctx.beginPath();
      ctx.moveTo(0, -beamWidth/2);
      ctx.lineTo(distance, -beamWidth);
      ctx.lineTo(distance, beamWidth);
      ctx.lineTo(0, beamWidth/2);
      ctx.closePath();
      ctx.fill();
      
      // Beam edges
      ctx.strokeStyle = 'rgba(255, 200, 80, 0.4)';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Animated particles in beam
      for (let i = 0; i < 8; i++) {
        const particleProgress = ((time * 2 + i * 30) % distance) / distance;
        const px = distance * particleProgress;
        const py = (Math.sin(time * 0.05 + i) * beamWidth * 0.3);
        
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 240, 150, ${0.8 - particleProgress * 0.3})`;
        ctx.fill();
      }
      
      ctx.restore();
      
      // Draw mirror with realistic surface
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angleRad);
      
      // Mirror shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(-mirrorLength/2, 6, mirrorLength, 8);
      ctx.filter = 'blur(4px)';
      ctx.fillRect(-mirrorLength/2, 6, mirrorLength, 8);
      ctx.filter = 'none';
      
      // Mirror frame (dark edges)
      ctx.fillStyle = '#2c3e50';
      ctx.fillRect(-mirrorLength/2 - 3, -6, 3, 12);
      ctx.fillRect(mirrorLength/2, -6, 3, 12);
      
      // Mirror surface with metallic gradient
      const mirrorGradient = ctx.createLinearGradient(0, -4, 0, 4);
      mirrorGradient.addColorStop(0, '#e8f4f8');
      mirrorGradient.addColorStop(0.3, '#b8d4e0');
      mirrorGradient.addColorStop(0.5, '#90b8c8');
      mirrorGradient.addColorStop(0.7, '#b8d4e0');
      mirrorGradient.addColorStop(1, '#e8f4f8');
      ctx.fillStyle = mirrorGradient;
      ctx.fillRect(-mirrorLength/2, -4, mirrorLength, 8);
      
      // Reflective shine
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fillRect(-mirrorLength/2 + 10, -3, mirrorLength - 20, 2);
      
      // Animated reflection shimmer
      const shimmerX = ((time * 3) % (mirrorLength * 2)) - mirrorLength;
      const shimmerGradient = ctx.createLinearGradient(shimmerX - 20, 0, shimmerX + 20, 0);
      shimmerGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
      shimmerGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
      shimmerGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = shimmerGradient;
      ctx.fillRect(shimmerX - 20, -4, 40, 8);
      
      ctx.restore();
      
      // Calculate reflected beam
      const normalAngle = angleRad + Math.PI / 2;
      const incidentAngle = Math.atan2(centerY - lightY, centerX - lightX);
      const reflectedAngle = 2 * normalAngle - incidentAngle - Math.PI;
      const reflectLength = 200;
      const reflectEndX = centerX + Math.cos(reflectedAngle) * reflectLength;
      const reflectEndY = centerY + Math.sin(reflectedAngle) * reflectLength;
      
      // Draw reflected beam cone
      const reflectDist = Math.sqrt(
        Math.pow(reflectEndX - centerX, 2) + Math.pow(reflectEndY - centerY, 2)
      );
      
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(reflectedAngle);
      
      const reflectGradient = ctx.createLinearGradient(0, 0, reflectDist, 0);
      reflectGradient.addColorStop(0, 'rgba(100, 255, 180, 0.5)');
      reflectGradient.addColorStop(0.5, 'rgba(80, 240, 160, 0.4)');
      reflectGradient.addColorStop(1, 'rgba(60, 220, 140, 0.2)');
      
      ctx.fillStyle = reflectGradient;
      ctx.beginPath();
      ctx.moveTo(0, -beamWidth);
      ctx.lineTo(reflectDist, -beamWidth * 1.5);
      ctx.lineTo(reflectDist, beamWidth * 1.5);
      ctx.lineTo(0, beamWidth);
      ctx.closePath();
      ctx.fill();
      
      ctx.strokeStyle = 'rgba(80, 240, 160, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Animated particles in reflected beam
      for (let i = 0; i < 8; i++) {
        const particleProgress = ((time * 2 + i * 30) % reflectDist) / reflectDist;
        const px = reflectDist * particleProgress;
        const py = (Math.sin(time * 0.05 + i + Math.PI) * beamWidth * 0.4);
        
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 255, 200, ${0.8 - particleProgress * 0.3})`;
        ctx.fill();
      }
      
      ctx.restore();
      
      // Draw labels with better visibility
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(10, 10, 140, 80);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.strokeRect(10, 10, 140, 80);
      
      ctx.font = 'bold 13px Lexend';
      ctx.fillStyle = '#ffd700';
      ctx.fillText('● Light Source', 20, 30);
      ctx.fillStyle = '#90b8c8';
      ctx.fillText('● Mirror Surface', 20, 52);
      ctx.fillStyle = '#64ffb4';
      ctx.fillText('● Reflected Light', 20, 74);
      
      time += 1;
      animationFrameRef.current = requestAnimationFrame(drawRealisticMirror);
    };

    drawRealisticMirror();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mirrorAngle, currentStep]);

  // Realistic Sunlight Animation
  useEffect(() => {
    const canvas = sunlightCanvasRef.current;
    if (!canvas || steps[currentStep].visual !== 'sunlight') return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    const showSun = animationPhase >= 1;
    const showBeam = animationPhase >= 2;
    const showMirror = animationPhase >= 2;
    const showReflection = animationPhase >= 3;
    const showWall = animationPhase >= 3;
    const mirrorTilted = animationPhase >= 4;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Sky gradient
      const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGradient.addColorStop(0, '#87CEEB');
      skyGradient.addColorStop(0.7, '#B0E0E6');
      skyGradient.addColorStop(1, '#F0F8FF');
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Sun with realistic glow
      if (showSun) {
        const sunX = 120;
        const sunY = 80;
        const sunRadius = 35;
        
        // Outer glow
        const outerGlow = ctx.createRadialGradient(sunX, sunY, sunRadius, sunX, sunY, sunRadius * 2.5);
        outerGlow.addColorStop(0, 'rgba(255, 220, 100, 0.4)');
        outerGlow.addColorStop(0.5, 'rgba(255, 200, 80, 0.2)');
        outerGlow.addColorStop(1, 'rgba(255, 180, 60, 0)');
        ctx.fillStyle = outerGlow;
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunRadius * 2.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Sun body
        const sunGradient = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius);
        sunGradient.addColorStop(0, '#FFF9E6');
        sunGradient.addColorStop(0.7, '#FFE066');
        sunGradient.addColorStop(1, '#FFD700');
        ctx.fillStyle = sunGradient;
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Sun rays
        ctx.save();
        ctx.translate(sunX, sunY);
        ctx.rotate((frame * 0.01) % (Math.PI * 2));
        for (let i = 0; i < 12; i++) {
          ctx.rotate(Math.PI / 6);
          ctx.fillStyle = 'rgba(255, 220, 100, 0.4)';
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(sunRadius + 15, -3);
          ctx.lineTo(sunRadius + 20, 0);
          ctx.lineTo(sunRadius + 15, 3);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }
      
      // Sunlight beams to mirror
      if (showBeam && showMirror) {
        const mirrorX = 260;
        const mirrorY = mirrorTilted ? 220 : 200;
        const mirrorAngleLocal = mirrorTilted ? 30 : 45;
        
        // Multiple realistic sun rays
        for (let i = -1; i <= 1; i++) {
          const startX = 120 + i * 15;
          const startY = 80 + i * 10;
          const endX = mirrorX + i * 12;
          const endY = mirrorY;
          
          const rayGradient = ctx.createLinearGradient(startX, startY, endX, endY);
          rayGradient.addColorStop(0, `rgba(255, 220, 100, ${0.7 - Math.abs(i) * 0.2})`);
          rayGradient.addColorStop(1, `rgba(255, 200, 80, ${0.5 - Math.abs(i) * 0.15})`);
          
          ctx.strokeStyle = rayGradient;
          ctx.lineWidth = i === 0 ? 8 : 5;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.stroke();
          
          // Light particles
          const progress = (frame * 0.02) % 1;
          const px = startX + (endX - startX) * progress;
          const py = startY + (endY - startY) * progress;
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 240, 150, ${1 - progress})`;
          ctx.fill();
        }
        
        // Draw mirror
        ctx.save();
        ctx.translate(mirrorX, mirrorY);
        ctx.rotate((mirrorAngleLocal * Math.PI) / 180);
        
        // Mirror shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(-50, 8, 100, 6);
        
        // Mirror surface
        const mirrorGrad = ctx.createLinearGradient(0, -5, 0, 5);
        mirrorGrad.addColorStop(0, '#d0e8f2');
        mirrorGrad.addColorStop(0.5, '#a0c8d8');
        mirrorGrad.addColorStop(1, '#d0e8f2');
        ctx.fillStyle = mirrorGrad;
        ctx.fillRect(-50, -5, 100, 10);
        
        // Shine
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillRect(-45, -4, 90, 3);
        
        ctx.restore();
      }
      
      // Reflected beam to wall
      if (showReflection && showWall) {
        const mirrorX = 260;
        const mirrorY = mirrorTilted ? 220 : 200;
        const wallX = 380;
        const wallY = mirrorTilted ? 120 : 100;
        
        for (let i = -1; i <= 1; i++) {
          const startX = mirrorX + i * 12;
          const startY = mirrorY;
          const endX = wallX;
          const endY = wallY + i * 10;
          
          const reflectGrad = ctx.createLinearGradient(startX, startY, endX, endY);
          reflectGrad.addColorStop(0, `rgba(255, 200, 80, ${0.5 - Math.abs(i) * 0.15})`);
          reflectGrad.addColorStop(1, `rgba(255, 220, 100, ${0.7 - Math.abs(i) * 0.2})`);
          
          ctx.strokeStyle = reflectGrad;
          ctx.lineWidth = i === 0 ? 8 : 5;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.stroke();
          
          // Particles
          const progress = (frame * 0.02 + 0.5) % 1;
          const px = startX + (endX - startX) * progress;
          const py = startY + (endY - startY) * progress;
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 240, 150, ${1 - progress})`;
          ctx.fill();
        }
      }
      
      // Wall
      if (showWall) {
        const wallGrad = ctx.createLinearGradient(360, 0, 400, 0);
        wallGrad.addColorStop(0, '#D2B48C');
        wallGrad.addColorStop(1, '#F5DEB3');
        ctx.fillStyle = wallGrad;
        ctx.fillRect(360, 40, 40, 280);
        
        // Wall texture
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.lineWidth = 1;
        for (let i = 40; i < 320; i += 20) {
          ctx.beginPath();
          ctx.moveTo(360, i);
          ctx.lineTo(400, i);
          ctx.stroke();
        }
        
        // Light spot on wall
        if (showReflection) {
          const spotY = mirrorTilted ? 120 : 100;
          const spotGlow = ctx.createRadialGradient(370, spotY, 0, 370, spotY, 40);
          spotGlow.addColorStop(0, 'rgba(255, 240, 150, 0.9)');
          spotGlow.addColorStop(0.5, 'rgba(255, 220, 100, 0.5)');
          spotGlow.addColorStop(1, 'rgba(255, 200, 80, 0)');
          ctx.fillStyle = spotGlow;
          ctx.fillRect(360, spotY - 40, 40, 80);
        }
      }
      
      frame++;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animationPhase, currentStep]);

  // Realistic Straight Line Animation
  useEffect(() => {
    const canvas = straightLineCanvasRef.current;
    if (!canvas || steps[currentStep].visual !== 'straightLine') return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Dark room background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGrad.addColorStop(0, '#0a0a15');
      bgGrad.addColorStop(1, '#1a1a2e');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Grid for reference
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 30) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }
      
      const torchX = 60;
      const torchY = 180;
      const mirrorX = 260;
      const mirrorY = 180;
      
      // Draw torch
      if (animationPhase >= 1) {
        // Torch body
        ctx.fillStyle = '#34495e';
        ctx.fillRect(torchX - 15, torchY - 10, 30, 40);
        ctx.beginPath();
        ctx.arc(torchX, torchY - 10, 15, 0, Math.PI, true);
        ctx.fill();
        
        // Torch light
        const torchGlow = ctx.createRadialGradient(torchX, torchY - 10, 0, torchX, torchY - 10, 35);
        torchGlow.addColorStop(0, 'rgba(255, 220, 100, 1)');
        torchGlow.addColorStop(0.5, 'rgba(255, 200, 80, 0.6)');
        torchGlow.addColorStop(1, 'rgba(255, 180, 60, 0)');
        ctx.fillStyle = torchGlow;
        ctx.fillRect(torchX - 35, torchY - 45, 70, 70);
      }
      
      // Incident beam
      if (animationPhase >= 2) {
        const beamProgress = Math.min((frame - 20) / 40, 1);
        const currentX = torchX + (mirrorX - torchX) * beamProgress;
        
        // Beam cone
        ctx.fillStyle = 'rgba(255, 220, 100, 0.3)';
        ctx.beginPath();
        ctx.moveTo(torchX, torchY - 5);
        ctx.lineTo(currentX, mirrorY - 8);
        ctx.lineTo(currentX, mirrorY + 8);
        ctx.lineTo(torchX, torchY + 5);
        ctx.closePath();
        ctx.fill();
        
        // Center ray
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 4;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ffd700';
        ctx.beginPath();
        ctx.moveTo(torchX, torchY);
        ctx.lineTo(currentX, mirrorY);
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        // Light particles
        for (let i = 0; i < 10; i++) {
          const particlePos = ((frame * 2 + i * 20) % 200) / 200;
          if (particlePos <= beamProgress) {
            const px = torchX + (currentX - torchX) * particlePos;
            const py = torchY + (mirrorY - torchY) * particlePos;
            ctx.beginPath();
            ctx.arc(px, py, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 240, 150, ${1 - particlePos})`;
            ctx.fill();
          }
        }
      }
      
      // Mirror
      if (animationPhase >= 2) {
        ctx.save();
        ctx.translate(mirrorX, mirrorY);
        ctx.rotate(-Math.PI / 12);
        
        // Mirror shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.filter = 'blur(4px)';
        ctx.fillRect(-60, 8, 120, 8);
        ctx.filter = 'none';
        
        // Mirror surface
        const mirrorGrad = ctx.createLinearGradient(0, -6, 0, 6);
        mirrorGrad.addColorStop(0, '#e0f2f7');
        mirrorGrad.addColorStop(0.5, '#b0d4e0');
        mirrorGrad.addColorStop(1, '#e0f2f7');
        ctx.fillStyle = mirrorGrad;
        ctx.fillRect(-60, -6, 120, 12);
        
        // Shine
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(-55, -5, 110, 4);
        
        // Frame
        ctx.strokeStyle = '#34495e';
        ctx.lineWidth = 2;
        ctx.strokeRect(-60, -6, 120, 12);
        
        ctx.restore();
      }
      
      // Reflected beam
      if (animationPhase >= 3) {
        const reflectProgress = Math.min((frame - 60) / 40, 1);
        const endX = 380;
        const endY = 100;
        const currentEndX = mirrorX + (endX - mirrorX) * reflectProgress;
        const currentEndY = mirrorY + (endY - mirrorY) * reflectProgress;
        
        // Beam cone
        ctx.fillStyle = 'rgba(100, 255, 180, 0.25)';
        ctx.beginPath();
        ctx.moveTo(mirrorX, mirrorY - 8);
        ctx.lineTo(currentEndX, currentEndY - 12);
        ctx.lineTo(currentEndX, currentEndY + 12);
        ctx.lineTo(mirrorX, mirrorY + 8);
        ctx.closePath();
        ctx.fill();
        
        // Center ray
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 4;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00ff88';
        ctx.beginPath();
        ctx.moveTo(mirrorX, mirrorY);
        ctx.lineTo(currentEndX, currentEndY);
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        // Particles
        for (let i = 0; i < 10; i++) {
          const particlePos = ((frame * 2 + i * 20) % 200) / 200;
          if (particlePos <= reflectProgress) {
            const px = mirrorX + (currentEndX - mirrorX) * particlePos;
            const py = mirrorY + (currentEndY - mirrorY) * particlePos;
            ctx.beginPath();
            ctx.arc(px, py, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(100, 255, 200, ${1 - particlePos})`;
            ctx.fill();
          }
        }
      }
      
      // Reference lines
      if (animationPhase >= 4) {
        ctx.strokeStyle = 'rgba(100, 150, 255, 0.4)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(torchX, torchY);
        ctx.lineTo(mirrorX, mirrorY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(mirrorX, mirrorY);
        ctx.lineTo(380, 100);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      
      frame++;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animationPhase, currentStep]);

  // Realistic Face Reflection Animation
  useEffect(() => {
    const canvas = faceCanvasRef.current;
    if (!canvas || steps[currentStep].visual !== 'face') return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;

    const drawPerson = (x: number, y: number, mirrored: boolean = false) => {
      ctx.save();
      if (mirrored) {
        ctx.translate(x, y);
        ctx.scale(-1, 1);
        ctx.translate(-x, -y);
      }
      
      // Head
      const headGrad = ctx.createRadialGradient(x, y, 0, x, y, 35);
      headGrad.addColorStop(0, '#ffd4a3');
      headGrad.addColorStop(1, '#e6b88a');
      ctx.fillStyle = headGrad;
      ctx.beginPath();
      ctx.ellipse(x, y, 28, 35, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Hair
      ctx.fillStyle = '#2c1810';
      ctx.beginPath();
      ctx.ellipse(x, y - 15, 30, 20, 0, 0, Math.PI, true);
      ctx.fill();
      
      // Ears
      ctx.fillStyle = '#f0c9a6';
      ctx.beginPath();
      ctx.ellipse(x - 28, y, 8, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(x + 28, y, 8, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Eyes
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.ellipse(x - 12, y - 5, 6, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(x + 12, y - 5, 6, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Pupils with shine
      if (animationPhase >= 5) {
        ctx.fillStyle = '#2c1810';
        ctx.beginPath();
        ctx.arc(x - 12, y - 5, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + 12, y - 5, 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x - 10, y - 7, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + 14, y - 7, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Nose
      ctx.strokeStyle = '#d4a574';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 3, y + 8);
      ctx.stroke();
      
      // Mouth
      ctx.strokeStyle = '#c97b63';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y + 15, 8, 0, Math.PI);
      ctx.stroke();
      
      // Neck
      ctx.fillStyle = '#f0c9a6';
      ctx.fillRect(x - 12, y + 35, 24, 15);
      
      // Shirt
      ctx.fillStyle = '#4a90e2';
      ctx.beginPath();
      ctx.moveTo(x - 25, y + 50);
      ctx.lineTo(x - 12, y + 50);
      ctx.lineTo(x - 12, y + 85);
      ctx.lineTo(x - 35, y + 85);
      ctx.closePath();
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(x + 25, y + 50);
      ctx.lineTo(x + 12, y + 50);
      ctx.lineTo(x + 12, y + 85);
      ctx.lineTo(x + 35, y + 85);
      ctx.closePath();
      ctx.fill();
      
      ctx.fillRect(x - 12, y + 50, 24, 35);
      
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGrad.addColorStop(0, '#f5e6ff');
      bgGrad.addColorStop(1, '#e6f3ff');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Person
      if (animationPhase >= 1) {
        drawPerson(110, 130);
      }
      
      // Light rays from person to mirror
      if (animationPhase >= 2) {
        for (let i = 0; i < 7; i++) {
          const startX = 110;
          const startY = 100 + i * 10;
          const endX = 200;
          const endY = 100 + i * 10;
          
          const rayGrad = ctx.createLinearGradient(startX, startY, endX, endY);
          rayGrad.addColorStop(0, 'rgba(255, 180, 100, 0.6)');
          rayGrad.addColorStop(1, 'rgba(255, 160, 80, 0.2)');
          
          ctx.strokeStyle = rayGrad;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.stroke();
          
          // Arrow
          ctx.fillStyle = 'rgba(255, 180, 100, 0.5)';
          ctx.beginPath();
          ctx.moveTo(endX - 8, endY - 3);
          ctx.lineTo(endX, endY);
          ctx.lineTo(endX - 8, endY + 3);
          ctx.fill();
        }
      }
      
      // Mirror
      if (animationPhase >= 2) {
        // Mirror frame
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(195, 60, 10, 200);
        
        // Mirror surface
        const mirrorGrad = ctx.createLinearGradient(195, 60, 205, 60);
        mirrorGrad.addColorStop(0, '#d0e8f2');
        mirrorGrad.addColorStop(0.5, '#ffffff');
        mirrorGrad.addColorStop(1, '#d0e8f2');
        ctx.fillStyle = mirrorGrad;
        ctx.fillRect(197, 60, 6, 200);
        
        // Shine effect
        const shimmer = ((frame * 2) % 400) - 200;
        const shimmerGrad = ctx.createLinearGradient(200, shimmer, 200, shimmer + 100);
        shimmerGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        shimmerGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.6)');
        shimmerGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = shimmerGrad;
        ctx.fillRect(197, 60, 6, 200);
      }
      
      // Reflected person
      if (animationPhase >= 3) {
        ctx.globalAlpha = 0.85;
        drawPerson(290, 130, true);
        ctx.globalAlpha = 1;
      }
      
      // Reflected rays back to eyes
      if (animationPhase >= 4) {
        for (let i = 0; i < 7; i++) {
          const startX = 200;
          const startY = 100 + i * 10;
          const endX = 110;
          const endY = 95 + i * 8;
          
          const rayGrad = ctx.createLinearGradient(startX, startY, endX, endY);
          rayGrad.addColorStop(0, 'rgba(100, 255, 180, 0.2)');
          rayGrad.addColorStop(1, 'rgba(80, 255, 160, 0.6)');
          
          ctx.strokeStyle = rayGrad;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.stroke();
          
          // Arrow
          ctx.fillStyle = 'rgba(100, 255, 180, 0.5)';
          ctx.beginPath();
          ctx.moveTo(endX + 8, endY - 3);
          ctx.lineTo(endX, endY);
          ctx.lineTo(endX + 8, endY + 3);
          ctx.fill();
        }
      }
      
      frame++;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animationPhase, currentStep]);

  const IntroVisual = () => (
    <div className="relative w-full h-80 bg-gradient-to-br from-slate-800 via-indigo-900 to-slate-900 rounded-2xl overflow-hidden shadow-2xl">
      <canvas ref={canvasRef} width={400} height={320} className="w-full h-full" />
    </div>
  );

  const renderVisual = () => {
    switch (steps[currentStep].visual) {
      case 'intro':
        return <IntroVisual />;
      case 'sunlight':
        return (
          <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-2xl">
            <canvas ref={sunlightCanvasRef} width={400} height={320} className="w-full h-full" />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-md px-6 py-3 rounded-xl">
              <p className="text-white font-semibold text-center">
                {animationPhase === 0 && "🌞 Observe the sunlight behavior"}
                {animationPhase === 1 && "☀️ Sun emits light in all directions"}
                {animationPhase === 2 && "💡 Sunlight travels in straight lines to mirror"}
                {animationPhase === 3 && "✨ Mirror reflects light onto the wall"}
                {animationPhase === 4 && "🔄 Tilting mirror changes reflection direction"}
                {animationPhase >= 5 && "🎯 You can control where light goes!"}
              </p>
            </div>
          </div>
        );
      case 'straightLine':
        return (
          <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-2xl">
            <canvas ref={straightLineCanvasRef} width={400} height={320} className="w-full h-full" />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-md px-6 py-3 rounded-xl">
              <p className="text-white font-semibold text-center">
                {animationPhase === 0 && "🔦 Watch the torch experiment"}
                {animationPhase === 1 && "💡 Torch produces a beam of light"}
                {animationPhase === 2 && "➡️ Light travels in a STRAIGHT line"}
                {animationPhase === 3 && "↗️ Reflected light also travels STRAIGHT"}
                {animationPhase >= 4 && "✨ Light ALWAYS travels in straight lines!"}
              </p>
            </div>
          </div>
        );
      case 'interactive':
        return (
          <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-2xl">
            <canvas ref={canvasRef} width={400} height={320} className="w-full h-full" />
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-900/90 to-purple-900/90 backdrop-blur-md rounded-2xl p-5 border border-cyan-500/30 shadow-2xl">
              <div className="flex items-center gap-4">
                <RotateCw className="w-7 h-7 text-cyan-300" />
                <div className="flex flex-col gap-2">
                  <label className="text-cyan-200 text-xs font-bold uppercase tracking-wider">Rotate Mirror</label>
                  <input
                    type="range"
                    min="0"
                    max="90"
                    value={mirrorAngle}
                    onChange={(e) => setMirrorAngle(Number(e.target.value))}
                    className="w-56 h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #22d3ee 0%, #22d3ee ${mirrorAngle}%, #334155 ${mirrorAngle}%, #334155 100%)`
                    }}
                  />
                </div>
                <div className="bg-cyan-400/20 px-5 py-3 rounded-xl border border-cyan-400/40">
                  <span className="text-cyan-100 text-xl font-bold">{mirrorAngle}°</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'face':
        return (
          <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-2xl">
            <canvas ref={faceCanvasRef} width={400} height={320} className="w-full h-full" />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm px-6 py-3 rounded-xl shadow-xl">
              <p className="text-slate-800 font-semibold text-center">
                {animationPhase === 0 && "👤 How do you see yourself?"}
                {animationPhase === 1 && "🧍 You stand in front of mirror"}
                {animationPhase === 2 && "💡 Light from your face reaches mirror"}
                {animationPhase === 3 && "🪞 Mirror creates your reflection"}
                {animationPhase === 4 && "✨ Light reflects back to your eyes"}
                {animationPhase === 5 && "👁️ Your eyes receive the reflected light"}
                {animationPhase >= 6 && "🎉 That's how you see yourself!"}
              </p>
            </div>
          </div>
        );
      default:
        return <IntroVisual />;
    }
  };

  const handleStepChange = (newStep: number) => {
    setCurrentStep(newStep);
    setAnimationPhase(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Lexend', sans-serif;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%);
          cursor: pointer;
          box-shadow: 0 0 15px rgba(34, 211, 238, 0.8), 0 4px 10px rgba(0, 0, 0, 0.3);
          transition: transform 0.2s;
        }
        
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%);
          cursor: pointer;
          border: none;
          box-shadow: 0 0 15px rgba(34, 211, 238, 0.8), 0 4px 10px rgba(0, 0, 0, 0.3);
        }
      `}</style>
      
      <div className="max-w-5xl mx-auto">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
          {/* Progress */}
          <div className="h-3 bg-slate-100 relative overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-700 ease-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          
          {/* Visual */}
          <div className="p-8">
            {renderVisual()}
          </div>
          
          {/* Content */}
          <div className="p-8 bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="space-y-5 animate-fadeIn" key={currentStep}>
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-3xl shadow-xl">
                  {currentStep + 1}
                </div>
                <div className="flex-1">
                  <h2 className="text-4xl font-bold text-slate-800 mb-3">
                    {steps[currentStep].title}
                  </h2>
                  <p className="text-lg text-slate-700 leading-relaxed">
                    {steps[currentStep].content}
                  </p>
                </div>
              </div>
              
              {/* Phase Progress */}
              <div className="flex items-center gap-3 ml-21">
                <span className="text-sm font-medium text-slate-500">Animation:</span>
                <div className="flex gap-2">
                  {[...Array(steps[currentStep].phases)].map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx <= animationPhase ? 'bg-indigo-500 w-10' : 'bg-slate-300 w-2'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="p-6 bg-white border-t border-slate-200">
            <div className="flex items-center justify-between">
              <button
                onClick={() => handleStepChange(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 bg-slate-100 text-slate-700 hover:bg-slate-200 shadow-md"
              >
                <ArrowLeft className="w-5 h-5" />
                Previous
              </button>
              
              <div className="flex items-center gap-3">
                {steps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleStepChange(idx)}
                    className={`transition-all duration-300 rounded-full ${
                      idx === currentStep 
                        ? 'bg-indigo-600 w-12 h-4' 
                        : idx < currentStep
                        ? 'bg-indigo-400 w-4 h-4'
                        : 'bg-slate-300 w-4 h-4'
                    }`}
                  />
                ))}
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 bg-purple-100 text-purple-700 hover:bg-purple-200 shadow-md"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
                
                <button
                  onClick={() => handleStepChange(Math.min(steps.length - 1, currentStep + 1))}
                  disabled={currentStep === steps.length - 1}
                  className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                >
                  Next
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Key Concepts */}
        <div className="mt-8 p-8 bg-white rounded-2xl shadow-xl border border-slate-200">
          <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            Key Learning Points
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border-2 border-yellow-200 hover:scale-105 transition-transform">
              <div className="text-3xl mb-3">✨</div>
              <p className="font-bold text-yellow-900 mb-2">Straight Path</p>
              <p className="text-sm text-yellow-800">Light always travels in straight lines</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:scale-105 transition-transform">
              <div className="text-3xl mb-3">🪞</div>
              <p className="font-bold text-blue-900 mb-2">Reflection</p>
              <p className="text-sm text-blue-800">Mirrors change light direction</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 hover:scale-105 transition-transform">
              <div className="text-3xl mb-3">👁️</div>
              <p className="font-bold text-green-900 mb-2">Vision</p>
              <p className="text-sm text-green-800">Reflection helps us see images</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Practice Mode Component
const PracticeMode: React.FC = () => {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [userMirrorAngle, setUserMirrorAngle] = useState(45);
  const [targetAngle, setTargetAngle] = useState(60);
  const [userDrawing, setUserDrawing] = useState<{x: number, y: number}[]>([]);
  const [completedExercises, setCompletedExercises] = useState<boolean[]>(new Array(8).fill(false));
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const exercises = [
    {
      id: 1,
      type: 'mcq',
      question: 'What is the change in direction of light by a mirror called?',
      options: [
        'Refraction',
        'Reflection',
        'Dispersion',
        'Absorption'
      ],
      correctAnswer: 'Reflection',
      explanation: 'The change in direction of light by a mirror is called reflection. When light hits a shiny surface, it bounces back.',
      difficulty: 'Easy'
    },
    {
      id: 2,
      type: 'mcq',
      question: 'Which of the following is a luminous object?',
      options: [
        'Moon',
        'Mirror',
        'Sun',
        'Wall'
      ],
      correctAnswer: 'Sun',
      explanation: 'The Sun is a luminous object because it emits its own light. The Moon, mirror, and wall are non-luminous objects that only reflect light.',
      difficulty: 'Easy'
    },
    {
      id: 3,
      type: 'mcq',
      question: 'How does light travel?',
      options: [
        'In curved lines',
        'In zigzag patterns',
        'In straight lines',
        'In random directions'
      ],
      correctAnswer: 'In straight lines',
      explanation: 'Light always travels in straight lines. This can be observed when you shine a torch or see sunbeams through windows.',
      difficulty: 'Easy'
    },
    {
      id: 4,
      type: 'truefalse',
      question: 'The image formed by a plane mirror can be obtained on a screen.',
      correctAnswer: 'false',
      explanation: 'False. The image formed by a plane mirror cannot be obtained on a screen because it is a virtual image formed behind the mirror.',
      difficulty: 'Medium'
    },
    {
      id: 5,
      type: 'interactive-mirror',
      question: 'Adjust the mirror angle to direct the reflected light to the target spot!',
      targetAngle: 60,
      tolerance: 5,
      explanation: 'By changing the angle of the mirror, you can control where the reflected light goes. This is how periscopes and other optical instruments work.',
      difficulty: 'Medium'
    },
    {
      id: 6,
      type: 'mcq',
      question: 'What happens when you tilt a mirror while sunlight falls on it?',
      options: [
        'The reflected light position stays the same',
        'The reflected light position changes',
        'The sunlight stops reflecting',
        'The mirror becomes transparent'
      ],
      correctAnswer: 'The reflected light position changes',
      explanation: 'When you tilt the mirror, the angle at which light hits it changes, so the direction of reflected light also changes.',
      difficulty: 'Medium'
    },
    {
      id: 7,
      type: 'drawing',
      question: 'Draw the path of reflected light from the mirror!',
      explanation: 'The reflected ray should travel in a straight line from the mirror at an angle equal to the incident angle.',
      difficulty: 'Hard'
    },
    {
      id: 8,
      type: 'mcq-image',
      question: 'Why can you see your face in a mirror?',
      options: [
        'The mirror emits light',
        'Light from your face reflects off the mirror and enters your eyes',
        'Your face passes through the mirror',
        'The mirror absorbs light'
      ],
      correctAnswer: 'Light from your face reflects off the mirror and enters your eyes',
      explanation: 'You see your face because light from your face travels to the mirror, reflects off it, and enters your eyes. This reflected light creates the image you see.',
      difficulty: 'Medium'
    }
  ];

  const currentEx = exercises[currentExercise];

  // Initialize target angle for interactive-mirror exercise
  useEffect(() => {
    const exercise = exercises[currentExercise];
    if (exercise.type === 'interactive-mirror') {
      setTargetAngle(exercise.targetAngle || Math.floor(Math.random() * 40) + 40);
      setUserMirrorAngle(45);
    }
  }, [currentExercise]);

  // Interactive Mirror Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || currentEx.type !== 'interactive-mirror') return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawInteractiveMirror = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGrad.addColorStop(0, '#1e293b');
      bgGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Light source
      const lightX = 80;
      const lightY = 100;
      
      const lightGlow = ctx.createRadialGradient(lightX, lightY, 0, lightX, lightY, 35);
      lightGlow.addColorStop(0, 'rgba(255, 220, 100, 1)');
      lightGlow.addColorStop(0.5, 'rgba(255, 200, 80, 0.6)');
      lightGlow.addColorStop(1, 'rgba(255, 180, 60, 0)');
      ctx.fillStyle = lightGlow;
      ctx.fillRect(lightX - 35, lightY - 35, 70, 70);

      ctx.beginPath();
      ctx.arc(lightX, lightY, 10, 0, Math.PI * 2);
      ctx.fillStyle = '#ffd700';
      ctx.fill();

      // Mirror
      const mirrorX = 250;
      const mirrorY = 180;
      const angleRad = (userMirrorAngle * Math.PI) / 180;

      ctx.save();
      ctx.translate(mirrorX, mirrorY);
      ctx.rotate(angleRad);

      // Mirror surface
      const mirrorGrad = ctx.createLinearGradient(0, -5, 0, 5);
      mirrorGrad.addColorStop(0, '#e0f2f7');
      mirrorGrad.addColorStop(0.5, '#90c8d8');
      mirrorGrad.addColorStop(1, '#e0f2f7');
      ctx.fillStyle = mirrorGrad;
      ctx.fillRect(-60, -5, 120, 10);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fillRect(-55, -4, 110, 3);

      ctx.restore();

      // Incident beam
      const beamGrad = ctx.createLinearGradient(lightX, lightY, mirrorX, mirrorY);
      beamGrad.addColorStop(0, 'rgba(255, 220, 100, 0.8)');
      beamGrad.addColorStop(1, 'rgba(255, 200, 80, 0.4)');
      ctx.strokeStyle = beamGrad;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(lightX, lightY);
      ctx.lineTo(mirrorX, mirrorY);
      ctx.stroke();

      // Calculate reflection
      const normalAngle = angleRad + Math.PI / 2;
      const incidentAngle = Math.atan2(mirrorY - lightY, mirrorX - lightX);
      const reflectedAngle = 2 * normalAngle - incidentAngle - Math.PI;
      const reflectLength = 150;
      const reflectEndX = mirrorX + Math.cos(reflectedAngle) * reflectLength;
      const reflectEndY = mirrorY + Math.sin(reflectedAngle) * reflectLength;

      // Reflected beam
      const reflectGrad = ctx.createLinearGradient(mirrorX, mirrorY, reflectEndX, reflectEndY);
      reflectGrad.addColorStop(0, 'rgba(100, 255, 180, 0.4)');
      reflectGrad.addColorStop(1, 'rgba(80, 240, 160, 0.8)');
      ctx.strokeStyle = reflectGrad;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(mirrorX, mirrorY);
      ctx.lineTo(reflectEndX, reflectEndY);
      ctx.stroke();

      // Target spot
      const targetAngleRad = (targetAngle * Math.PI) / 180;
      const targetNormalAngle = targetAngleRad + Math.PI / 2;
      const targetReflectedAngle = 2 * targetNormalAngle - incidentAngle - Math.PI;
      const targetEndX = mirrorX + Math.cos(targetReflectedAngle) * reflectLength;
      const targetEndY = mirrorY + Math.sin(targetReflectedAngle) * reflectLength;

      ctx.beginPath();
      ctx.arc(targetEndX, targetEndY, 20, 0, Math.PI * 2);
      ctx.strokeStyle = '#ff3366';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = 'rgba(255, 51, 102, 0.2)';
      ctx.fill();

      // Target icon
      ctx.fillStyle = '#ff3366';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🎯', targetEndX, targetEndY + 6);

      // Labels
      ctx.fillStyle = 'white';
      ctx.font = '12px Lexend';
      ctx.fillText('Light Source', lightX, lightY + 30);
      ctx.fillText(`Mirror (${userMirrorAngle}°)`, mirrorX, mirrorY + 30);
      ctx.fillText('Target', targetEndX, targetEndY + 35);

      // Check if close to target
      const distance = Math.sqrt(
        Math.pow(reflectEndX - targetEndX, 2) + Math.pow(reflectEndY - targetEndY, 2)
      );
      
      if (distance < 25) {
        ctx.fillStyle = '#00ff88';
        ctx.font = 'bold 20px Lexend';
        ctx.textAlign = 'center';
        ctx.fillText('✓ Perfect!', canvas.width / 2, 30);
      }
    };

    drawInteractiveMirror();
  }, [userMirrorAngle, targetAngle, currentEx.type]);

  // Drawing Canvas
  useEffect(() => {
    const canvas = drawingCanvasRef.current;
    if (!canvas || currentEx.type !== 'drawing') return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawSetup = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Light source
      ctx.beginPath();
      ctx.arc(80, 150, 12, 0, Math.PI * 2);
      ctx.fillStyle = '#fbbf24';
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Incident ray
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(80, 150);
      ctx.lineTo(220, 150);
      ctx.stroke();

      // Arrow
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.moveTo(220, 150);
      ctx.lineTo(210, 145);
      ctx.lineTo(210, 155);
      ctx.closePath();
      ctx.fill();

      // Mirror
      ctx.save();
      ctx.translate(220, 150);
      ctx.rotate(-Math.PI / 6);
      
      ctx.fillStyle = '#60a5fa';
      ctx.fillRect(-5, -60, 10, 120);
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.strokeRect(-5, -60, 10, 120);
      
      ctx.restore();

      // Instruction text
      ctx.fillStyle = '#334155';
      ctx.font = 'bold 14px Lexend';
      ctx.fillText('Draw the reflected ray:', 20, 30);

      // User's drawing
      if (userDrawing.length > 1) {
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(userDrawing[0].x, userDrawing[0].y);
        for (let i = 1; i < userDrawing.length; i++) {
          ctx.lineTo(userDrawing[i].x, userDrawing[i].y);
        }
        ctx.stroke();
      }
    };

    drawSetup();
  }, [userDrawing, currentEx.type]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = drawingCanvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawing(true);
    setUserDrawing([{x, y}]);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = drawingCanvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setUserDrawing(prev => [...prev, {x, y}]);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    setAttempts(prev => prev + 1);
    let correct = false;

    if (currentEx.type === 'mcq' || currentEx.type === 'mcq-image') {
      correct = selectedAnswer === currentEx.correctAnswer;
    } else if (currentEx.type === 'truefalse') {
      correct = selectedAnswer === currentEx.correctAnswer;
    } else if (currentEx.type === 'interactive-mirror') {
      const diff = Math.abs(userMirrorAngle - targetAngle);
      correct = diff <= (currentEx.tolerance || 5);
    } else if (currentEx.type === 'drawing') {
      // Simple validation: check if user drew something
      correct = userDrawing.length > 20;
    }

    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setScore(prev => prev + 1);
      const newCompleted = [...completedExercises];
      newCompleted[currentExercise] = true;
      setCompletedExercises(newCompleted);
    }
  };

  const handleNext = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setIsCorrect(false);
      setUserDrawing([]);
      setUserMirrorAngle(45);
      setTargetAngle(Math.floor(Math.random() * 40) + 40);
    }
  };

  const handleReset = () => {
    setCurrentExercise(0);
    setScore(0);
    setAttempts(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCorrect(false);
    setUserDrawing([]);
    setCompletedExercises(new Array(8).fill(false));
  };

  const renderExercise = () => {
    switch (currentEx.type) {
      case 'mcq':
      case 'mcq-image':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {currentEx.options?.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showFeedback}
                  className={`p-4 rounded-xl text-left font-medium transition-all ${
                    selectedAnswer === option
                      ? showFeedback
                        ? option === currentEx.correctAnswer
                          ? 'bg-green-100 border-2 border-green-500 text-green-800'
                          : 'bg-red-100 border-2 border-red-500 text-red-800'
                        : 'bg-indigo-100 border-2 border-indigo-500 text-indigo-800'
                      : showFeedback && option === currentEx.correctAnswer
                      ? 'bg-green-50 border-2 border-green-300 text-green-700'
                      : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50'
                  } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswer === option
                        ? showFeedback && option === currentEx.correctAnswer
                          ? 'border-green-500 bg-green-500'
                          : showFeedback
                          ? 'border-red-500 bg-red-500'
                          : 'border-indigo-500 bg-indigo-500'
                        : 'border-slate-300'
                    }`}>
                      {selectedAnswer === option && showFeedback && (
                        option === currentEx.correctAnswer 
                          ? <CheckCircle className="w-4 h-4 text-white" />
                          : <XCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'truefalse':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {['true', 'false'].map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showFeedback}
                  className={`p-6 rounded-xl font-bold text-lg transition-all ${
                    selectedAnswer === option
                      ? showFeedback
                        ? option === currentEx.correctAnswer
                          ? 'bg-green-100 border-2 border-green-500 text-green-800'
                          : 'bg-red-100 border-2 border-red-500 text-red-800'
                        : 'bg-indigo-100 border-2 border-indigo-500 text-indigo-800'
                      : showFeedback && option === currentEx.correctAnswer
                      ? 'bg-green-50 border-2 border-green-300 text-green-700'
                      : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50'
                  } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {option.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        );

      case 'interactive-mirror':
        return (
          <div className="space-y-4">
            <canvas
              ref={canvasRef}
              width={400}
              height={300}
              className="w-full bg-slate-900 rounded-xl shadow-lg"
            />
            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200">
              <label className="block text-sm font-semibold text-indigo-900 mb-2">
                Mirror Angle: {userMirrorAngle}°
              </label>
              <input
                type="range"
                min="0"
                max="90"
                value={userMirrorAngle}
                onChange={(e) => setUserMirrorAngle(Number(e.target.value))}
                className="w-full h-3 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <p className="text-sm text-indigo-700 mt-2">
                💡 Tip: Adjust the mirror to make the green beam hit the red target!
              </p>
            </div>
          </div>
        );

      case 'drawing':
        return (
          <div className="space-y-4">
            <canvas
              ref={drawingCanvasRef}
              width={400}
              height={300}
              className="w-full bg-white rounded-xl shadow-lg border-2 border-slate-200 cursor-crosshair"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setUserDrawing([])}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                Clear Drawing
              </button>
              <div className="flex-1 bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  ✏️ Use your mouse to draw the path of the reflected light ray from the mirror
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const progress = ((currentExercise + 1) / exercises.length) * 100;
  const accuracyRate = attempts > 0 ? Math.round((score / attempts) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Lexend', sans-serif;
        }
      `}</style>

      <div className="max-w-4xl mx-auto">
        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-md border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Score</p>
                <p className="text-2xl font-bold text-slate-800">{score}/{exercises.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Accuracy</p>
                <p className="text-2xl font-bold text-slate-800">{accuracyRate}%</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Progress</p>
                <p className="text-2xl font-bold text-slate-800">{currentExercise + 1}/{exercises.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Exercise Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
          {/* Progress Bar */}
          <div className="h-2 bg-slate-100 relative">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Exercise Content */}
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold">
                  {currentExercise + 1}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                    Exercise {currentExercise + 1}
                  </h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-1 ${
                    currentEx.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                    currentEx.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {currentEx.difficulty}
                  </span>
                </div>
              </div>
              {completedExercises[currentExercise] && (
                <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Completed</span>
                </div>
              )}
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              {currentEx.question}
            </h2>

            {renderExercise()}

            {/* Feedback */}
            {showFeedback && (
              <div className={`mt-6 p-6 rounded-xl border-2 ${
                isCorrect
                  ? 'bg-green-50 border-green-300'
                  : 'bg-red-50 border-red-300'
              }`}>
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-1">
                    <h3 className={`text-lg font-bold mb-2 ${
                      isCorrect ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {isCorrect ? '🎉 Excellent!' : '❌ Not quite right'}
                    </h3>
                    <p className={`${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                      {currentEx.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="p-6 bg-slate-50 border-t border-slate-200">
            <div className="flex justify-between items-center">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-300 transition-all"
              >
                <RefreshCw className="w-5 h-5" />
                Restart
              </button>

              <div className="flex gap-3">
                {!showFeedback ? (
                  <button
                    onClick={handleSubmit}
                    disabled={
                      (currentEx.type === 'mcq' || currentEx.type === 'mcq-image' || currentEx.type === 'truefalse') && !selectedAnswer
                    }
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    disabled={currentExercise === exercises.length - 1}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {currentExercise === exercises.length - 1 ? 'Completed!' : 'Next Exercise'}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Exercise Navigation */}
        <div className="mt-6 bg-white p-6 rounded-xl shadow-md border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Exercise Overview</h3>
          <div className="grid grid-cols-8 gap-3">
            {exercises.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentExercise(idx);
                  setSelectedAnswer(null);
                  setShowFeedback(false);
                  setIsCorrect(false);
                }}
                className={`aspect-square rounded-lg font-bold text-lg transition-all ${
                  idx === currentExercise
                    ? 'bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg scale-110'
                    : completedExercises[idx]
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {completedExercises[idx] ? '✓' : idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Completion Message */}
        {completedExercises.every(Boolean) && (
          <div className="mt-6 bg-gradient-to-r from-green-400 to-emerald-500 p-8 rounded-2xl shadow-2xl text-white text-center">
            <Award className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">🎉 Congratulations!</h2>
            <p className="text-lg mb-4">
              You've completed all exercises with a score of {score}/{exercises.length}!
            </p>
            <p className="text-xl font-bold">Accuracy: {accuracyRate}%</p>
          </div>
        )}
      </div>
    </div>
  );
};


// Real World Applications Component
const RealWorldMode: React.FC = () => {
  const [currentApplication, setCurrentApplication] = useState(0);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const applications = [
    {
      id: 1,
      title: 'Mirrors in Daily Life',
      icon: Home,
      category: 'Everyday Use',
      description: 'We use mirrors every day for grooming, dressing, and checking our appearance. Reflection helps us see ourselves!',
      realWorldExample: 'Bathroom mirrors, dressing table mirrors, wardrobe mirrors',
      howItWorks: [
        'Light from your body and surroundings hits the mirror surface',
        'The smooth glass surface reflects light in a predictable way',
        'Reflected light enters your eyes, creating a virtual image',
        'The image appears to be behind the mirror at the same distance'
      ],
      funFacts: [
        'Ancient mirrors were made of polished bronze or copper',
        'The first glass mirrors were made in Venice around 1317',
        'Modern mirrors use a thin layer of aluminum or silver coating'
      ],
      visualization: 'mirror-daily',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      id: 2,
      title: 'Rear-View Mirrors in Vehicles',
      icon: Car,
      category: 'Transportation',
      description: 'Cars, bikes, and trucks use rear-view mirrors to see behind them without turning around, making driving safer.',
      realWorldExample: 'Car rear-view mirrors, side mirrors (wing mirrors), bike mirrors',
      howItWorks: [
        'Mirrors are positioned to reflect the view from behind the vehicle',
        'Light from vehicles and objects behind reflects into the mirror',
        'Driver can see reflected image while looking forward',
        'Convex mirrors are often used to provide wider field of view'
      ],
      funFacts: [
        'Rear-view mirrors were invented in 1911 for race cars',
        'Side mirrors have a note: "Objects are closer than they appear"',
        'Some modern cars use cameras instead of mirrors'
      ],
      visualization: 'rearview',
      color: 'from-orange-400 to-red-500'
    },
    {
      id: 3,
      title: 'Periscopes in Submarines',
      icon: Telescope,
      category: 'Military & Marine',
      description: 'Periscopes use two mirrors to let submarine crews see above water while staying underwater.',
      realWorldExample: 'Submarine periscopes, trench periscopes, crowd viewing at parades',
      howItWorks: [
        'Two plane mirrors are placed at 45° angles in a tube',
        'Top mirror reflects light from above down into the tube',
        'Bottom mirror reflects this light horizontally to the viewer',
        'Light travels in straight lines between the two reflections'
      ],
      funFacts: [
        'Periscopes can be several meters long',
        'Modern submarines use cameras instead of optical periscopes',
        'You can make a simple periscope with cardboard and mirrors'
      ],
      visualization: 'periscope',
      color: 'from-purple-400 to-indigo-500'
    },
    {
      id: 4,
      title: 'Solar Cookers',
      icon: Sun,
      category: 'Renewable Energy',
      description: 'Solar cookers use curved mirrors to reflect and focus sunlight, creating enough heat to cook food.',
      realWorldExample: 'Solar ovens, solar water heaters, concentrated solar power plants',
      howItWorks: [
        'Parabolic (curved) mirrors reflect sunlight to a focal point',
        'All reflected rays converge at one spot, concentrating energy',
        'Temperature at focal point can reach 200-300°C',
        'Food placed at focal point gets cooked by concentrated heat'
      ],
      funFacts: [
        'Solar cookers need no fuel - they run on free sunlight',
        'They work best on sunny days between 10 AM and 3 PM',
        'Large solar plants use thousands of mirrors to generate electricity'
      ],
      visualization: 'solar',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      id: 5,
      title: 'Telescopes',
      icon: Telescope,
      category: 'Astronomy',
      description: 'Reflecting telescopes use curved mirrors to collect and focus light from distant stars and planets.',
      realWorldExample: 'Hubble Space Telescope, James Webb Space Telescope, observatory telescopes',
      howItWorks: [
        'Large curved (concave) mirror collects light from distant objects',
        'Mirror reflects and focuses light to a point',
        'Secondary mirror redirects focused light to eyepiece or camera',
        'Larger mirrors can collect more light, seeing fainter objects'
      ],
      funFacts: [
        'Isaac Newton invented the reflecting telescope in 1668',
        'The largest telescope mirror is 10.4 meters in diameter',
        'Hubble Telescope has taken over 1.5 million observations'
      ],
      visualization: 'telescope',
      color: 'from-indigo-400 to-purple-600'
    },
    {
      id: 6,
      title: 'Dental Mirrors',
      icon: Eye,
      category: 'Healthcare',
      description: 'Dentists use small mirrors to see all areas inside your mouth, including hard-to-see places.',
      realWorldExample: 'Dental examination mirrors, throat examination mirrors, surgical mirrors',
      howItWorks: [
        'Small concave or plane mirror attached to a handle',
        'Dentist positions mirror to see behind teeth and gums',
        'Light reflects off mirror, showing hidden areas',
        'Mirror can also reflect light into dark areas of mouth'
      ],
      funFacts: [
        'Dental mirrors are usually double-sided',
        'They are sterilized after each patient',
        'Some dental mirrors have built-in LED lights'
      ],
      visualization: 'dental',
      color: 'from-green-400 to-teal-500'
    },
    {
      id: 7,
      title: 'Security Mirrors',
      icon: Camera,
      category: 'Safety & Security',
      description: 'Convex mirrors are used in stores, parking lots, and roads to provide a wide field of view for safety.',
      realWorldExample: 'Store surveillance mirrors, blind spot mirrors on roads, ATM security mirrors',
      howItWorks: [
        'Convex (curved outward) mirrors reflect light over a wide angle',
        'They show a larger area than plane mirrors',
        'Images appear smaller but cover more space',
        'Help see around corners and blind spots'
      ],
      funFacts: [
        'Convex mirrors always produce virtual, upright images',
        'They are also used at dangerous road turns',
        'Shop mirrors can cover entire store aisles'
      ],
      visualization: 'security',
      color: 'from-red-400 to-pink-500'
    },
    {
      id: 8,
      title: 'Smartphone Cameras',
      icon: Smartphone,
      category: 'Technology',
      description: 'Phone cameras use multiple mirrors and lenses to capture photos. The front camera uses reflection for selfies.',
      realWorldExample: 'Smartphone selfie cameras, digital cameras, webcams',
      howItWorks: [
        'Light from scene passes through camera lens',
        'Small mirror or prism redirects light to sensor',
        'Sensor captures reflected light as digital image',
        'Front camera shows mirrored preview so you can frame selfie'
      ],
      funFacts: [
        'Modern phones have 3-5 different camera lenses',
        'Periscope cameras in phones use mirrors to enable zoom',
        'Over 1.4 trillion photos are taken every year'
      ],
      visualization: 'smartphone',
      color: 'from-pink-400 to-purple-500'
    }
  ];

  const currentApp = applications[currentApplication];

  // Canvas Visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;

    const drawVisualization = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGrad.addColorStop(0, '#f8fafc');
      bgGrad.addColorStop(1, '#e2e8f0');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      switch (currentApp.visualization) {
        case 'mirror-daily':
          drawDailyMirror(ctx, frame);
          break;
        case 'rearview':
          drawRearView(ctx, frame);
          break;
        case 'periscope':
          drawPeriscope(ctx, frame);
          break;
        case 'solar':
          drawSolarCooker(ctx, frame);
          break;
        case 'telescope':
          drawTelescope(ctx, frame);
          break;
        case 'dental':
          drawDentalMirror(ctx, frame);
          break;
        case 'security':
          drawSecurityMirror(ctx, frame);
          break;
        case 'smartphone':
          drawSmartphone(ctx, frame);
          break;
      }

      frame++;
      animationRef.current = requestAnimationFrame(drawVisualization);
    };

    drawVisualization();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentApplication]);

  const drawDailyMirror = (ctx: CanvasRenderingContext2D, frame: number) => {
    // Person
    ctx.beginPath();
    ctx.arc(150, 150, 30, 0, Math.PI * 2);
    ctx.fillStyle = '#fbbf24';
    ctx.fill();
    ctx.fillStyle = '#1e293b';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('👤', 150, 165);

    // Mirror frame
    ctx.fillStyle = '#64748b';
    ctx.fillRect(280, 70, 15, 160);
    
    // Mirror surface
    const mirrorGrad = ctx.createLinearGradient(295, 70, 320, 70);
    mirrorGrad.addColorStop(0, '#e0f2f7');
    mirrorGrad.addColorStop(0.5, '#ffffff');
    mirrorGrad.addColorStop(1, '#e0f2f7');
    ctx.fillStyle = mirrorGrad;
    ctx.fillRect(295, 70, 25, 160);

    // Reflection
    ctx.save();
    ctx.scale(-1, 1);
    ctx.translate(-640, 0);
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = '#1e293b';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('👤', 470, 165);
    ctx.restore();

    // Light rays
    for (let i = 0; i < 5; i++) {
      const y = 100 + i * 20;
      ctx.strokeStyle = `rgba(251, 191, 36, ${0.3 + Math.sin(frame * 0.05 + i) * 0.2})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(150, 150);
      ctx.lineTo(295, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(295, y);
      ctx.lineTo(150, 150);
      ctx.stroke();
    }

    // Label
    ctx.fillStyle = '#334155';
    ctx.font = 'bold 14px Lexend';
    ctx.textAlign = 'center';
    ctx.fillText('You see your reflection!', 250, 260);
  };

  const drawRearView = (ctx: CanvasRenderingContext2D, frame: number) => {
    // Car (front view)
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(150, 150, 120, 80);
    ctx.fillStyle = '#1e40af';
    ctx.fillRect(160, 160, 100, 40);

    // Mirror
    ctx.fillStyle = '#64748b';
    ctx.fillRect(235, 100, 50, 40);
    const mirrorGrad = ctx.createLinearGradient(235, 100, 285, 100);
    mirrorGrad.addColorStop(0, '#bae6fd');
    mirrorGrad.addColorStop(1, '#e0f2fe');
    ctx.fillStyle = mirrorGrad;
    ctx.fillRect(237, 102, 46, 36);

    // Behind vehicle
    const carBehindX = 250 - Math.sin(frame * 0.03) * 20;
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(carBehindX, 50, 40, 30);
    
    // Reflection rays
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(carBehindX + 20, 50);
    ctx.lineTo(260, 120);
    ctx.stroke();
    ctx.setLineDash([]);

    // Label
    ctx.fillStyle = '#334155';
    ctx.font = 'bold 14px Lexend';
    ctx.textAlign = 'center';
    ctx.fillText('See behind without turning!', 250, 260);
  };

  const drawPeriscope = (ctx: CanvasRenderingContext2D, frame: number) => {
    // Submarine
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.ellipse(250, 220, 80, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(170, 200, 160, 20);

    // Water
    ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
    ctx.fillRect(0, 170, 500, 130);
    
    // Waves
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    for (let i = 0; i < 500; i += 40) {
      ctx.beginPath();
      ctx.arc(i + (frame % 40), 170, 10, 0, Math.PI);
      ctx.stroke();
    }

    // Periscope tube
    ctx.fillStyle = '#64748b';
    ctx.fillRect(240, 80, 20, 120);

    // Top mirror (45°)
    ctx.save();
    ctx.translate(250, 85);
    ctx.rotate(-Math.PI / 4);
    ctx.fillStyle = '#60a5fa';
    ctx.fillRect(-15, -3, 30, 6);
    ctx.restore();

    // Bottom mirror (45°)
    ctx.save();
    ctx.translate(250, 195);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = '#60a5fa';
    ctx.fillRect(-15, -3, 30, 6);
    ctx.restore();

    // Ship above water
    ctx.fillStyle = '#334155';
    ctx.fillRect(350, 140, 60, 30);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(360, 130, 40, 10);

    // Light path
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 3]);
    ctx.beginPath();
    ctx.moveTo(380, 145);
    ctx.lineTo(250, 85);
    ctx.lineTo(250, 195);
    ctx.lineTo(200, 195);
    ctx.stroke();
    ctx.setLineDash([]);

    // Label
    ctx.fillStyle = '#334155';
    ctx.font = 'bold 14px Lexend';
    ctx.textAlign = 'center';
    ctx.fillText('See above while underwater!', 250, 280);
  };

  const drawSolarCooker = (ctx: CanvasRenderingContext2D, frame: number) => {
    // Sun
    ctx.beginPath();
    ctx.arc(100, 80, 30, 0, Math.PI * 2);
    ctx.fillStyle = '#fbbf24';
    ctx.fill();
    
    const glow = ctx.createRadialGradient(100, 80, 20, 100, 80, 50);
    glow.addColorStop(0, 'rgba(251, 191, 36, 0.6)');
    glow.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(100, 80, 50, 0, Math.PI * 2);
    ctx.fill();

    // Parabolic mirror (curved)
    ctx.fillStyle = '#e0f2f7';
    ctx.beginPath();
    ctx.moveTo(200, 240);
    ctx.quadraticCurveTo(250, 200, 300, 240);
    ctx.lineTo(300, 250);
    ctx.quadraticCurveTo(250, 210, 200, 250);
    ctx.closePath();
    ctx.fill();
    
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Reflected rays converging
    const rays = [
      {start: {x: 100, y: 80}, mid: {x: 210, y: 235}},
      {start: {x: 100, y: 80}, mid: {x: 230, y: 220}},
      {start: {x: 100, y: 80}, mid: {x: 250, y: 215}},
      {start: {x: 100, y: 80}, mid: {x: 270, y: 220}},
      {start: {x: 100, y: 80}, mid: {x: 290, y: 235}}
    ];

    rays.forEach(ray => {
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ray.start.x, ray.start.y);
      ctx.lineTo(ray.mid.x, ray.mid.y);
      ctx.lineTo(250, 210); // Focal point
      ctx.stroke();
    });

    // Focal point (hot spot)
    const intensity = 0.5 + Math.sin(frame * 0.1) * 0.3;
    const hotspot = ctx.createRadialGradient(250, 210, 0, 250, 210, 20);
    hotspot.addColorStop(0, `rgba(255, 100, 0, ${intensity})`);
    hotspot.addColorStop(1, 'rgba(255, 100, 0, 0)');
    ctx.fillStyle = hotspot;
    ctx.beginPath();
    ctx.arc(250, 210, 20, 0, Math.PI * 2);
    ctx.fill();

    // Pot
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(235, 205, 30, 15);
    ctx.fillStyle = '#475569';
    ctx.fillRect(237, 207, 26, 11);

    // Label
    ctx.fillStyle = '#334155';
    ctx.font = 'bold 14px Lexend';
    ctx.textAlign = 'center';
    ctx.fillText('Sunlight focused to cook food!', 250, 280);
  };

  const drawTelescope = (ctx: CanvasRenderingContext2D, frame: number) => {
    // Stars
    for (let i = 0; i < 10; i++) {
      const x = 50 + i * 40;
      const y = 50 + Math.sin(frame * 0.05 + i) * 20;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#fbbf24';
      ctx.fill();
    }

    // Large curved mirror
    ctx.fillStyle = '#60a5fa';
    ctx.beginPath();
    ctx.arc(250, 200, 60, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    
    ctx.fillStyle = '#e0f2f7';
    ctx.beginPath();
    ctx.arc(250, 200, 55, Math.PI, 0);
    ctx.closePath();
    ctx.fill();

    // Secondary mirror
    ctx.fillStyle = '#60a5fa';
    ctx.fillRect(235, 150, 30, 5);

    // Telescope tube
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(190, 200);
    ctx.lineTo(190, 120);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(310, 200);
    ctx.lineTo(310, 120);
    ctx.stroke();

    // Light rays
    const starX = 250;
    const starY = 50;
    
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    
    for (let i = 0; i < 5; i++) {
      const targetX = 200 + i * 25;
      ctx.beginPath();
      ctx.moveTo(starX, starY);
      ctx.lineTo(targetX, 145);
      ctx.lineTo(250, 165);
      ctx.lineTo(230, 180);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Eyepiece
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(220, 175, 20, 30);

    // Label
    ctx.fillStyle = '#334155';
    ctx.font = 'bold 14px Lexend';
    ctx.textAlign = 'center';
    ctx.fillText('Collect light from distant stars!', 250, 280);
  };

  const drawDentalMirror = (ctx: CanvasRenderingContext2D, _frame: number) => {
    // Tooth
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(200, 120);
    ctx.lineTo(190, 180);
    ctx.lineTo(210, 185);
    ctx.lineTo(220, 180);
    ctx.lineTo(210, 120);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Gum
    ctx.fillStyle = '#fca5a5';
    ctx.fillRect(180, 180, 50, 20);

    // Dental mirror
    const mirrorX = 280;
    const mirrorY = 160;
    
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(mirrorX + 15, mirrorY, 3, 60);
    
    ctx.fillStyle = '#60a5fa';
    ctx.beginPath();
    ctx.arc(mirrorX, mirrorY, 15, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#e0f2f7';
    ctx.beginPath();
    ctx.arc(mirrorX, mirrorY, 12, 0, Math.PI * 2);
    ctx.fill();

    // Reflection rays
    ctx.strokeStyle = 'rgba(96, 165, 250, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(205, 185);
    ctx.lineTo(mirrorX, mirrorY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Light source
    ctx.beginPath();
    ctx.arc(350, 100, 20, 0, Math.PI * 2);
    ctx.fillStyle = '#fbbf24';
    ctx.fill();

    // Light to mirror
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(350, 100);
    ctx.lineTo(mirrorX, mirrorY);
    ctx.stroke();

    // Label
    ctx.fillStyle = '#334155';
    ctx.font = 'bold 14px Lexend';
    ctx.textAlign = 'center';
    ctx.fillText('See hidden areas in mouth!', 250, 280);
  };

  const drawSecurityMirror = (ctx: CanvasRenderingContext2D, frame: number) => {
    // Store corner
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(0, 0, 200, 300);
    ctx.fillRect(0, 0, 500, 150);
    
    // Aisle
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(220, 150, 60, 150);

    // Convex mirror
    const mirrorX = 180;
    const mirrorY = 130;
    
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.arc(mirrorX, mirrorY, 50, 0, Math.PI * 2);
    ctx.fill();
    
    const mirrorGrad = ctx.createRadialGradient(mirrorX, mirrorY, 0, mirrorX, mirrorY, 45);
    mirrorGrad.addColorStop(0, '#ffffff');
    mirrorGrad.addColorStop(0.5, '#bae6fd');
    mirrorGrad.addColorStop(1, '#60a5fa');
    ctx.fillStyle = mirrorGrad;
    ctx.beginPath();
    ctx.arc(mirrorX, mirrorY, 45, 0, Math.PI * 2);
    ctx.fill();

    // Person in aisle
    const personY = 200 + Math.sin(frame * 0.05) * 20;
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(240, personY, 20, 40);
    ctx.beginPath();
    ctx.arc(250, personY, 8, 0, Math.PI * 2);
    ctx.fill();

    // Reflection in mirror (smaller)
    ctx.fillStyle = 'rgba(239, 68, 68, 0.6)';
    ctx.fillRect(170, 125, 8, 15);
    ctx.beginPath();
    ctx.arc(174, 123, 3, 0, Math.PI * 2);
    ctx.fill();

    // Rays
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(250, personY + 10);
    ctx.lineTo(180, 130);
    ctx.stroke();
    ctx.setLineDash([]);

    // Label
    ctx.fillStyle = '#334155';
    ctx.font = 'bold 14px Lexend';
    ctx.textAlign = 'center';
    ctx.fillText('Wide view for safety!', 250, 290);
  };

  const drawSmartphone = (ctx: CanvasRenderingContext2D, frame: number) => {
    // Phone body
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(180, 80, 140, 180);

    // Screen
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(190, 100, 120, 140);

    // Camera module
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.arc(290, 95, 8, 0, Math.PI * 2);
    ctx.fill();

    // Lens
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(290, 95, 5, 0, Math.PI * 2);
    ctx.fill();

    // Person taking selfie
    ctx.font = '50px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('👤', 100, 160);

    // Light rays from person to camera
    for (let i = 0; i < 5; i++) {
      const angle = -0.3 + i * 0.15;
      const startX = 100 + Math.cos(angle + Math.PI) * 30;
      const startY = 140 + Math.sin(angle + Math.PI) * 30;
      
      ctx.strokeStyle = `rgba(251, 191, 36, ${0.3 + Math.sin(frame * 0.1 + i) * 0.2})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(290, 95);
      ctx.stroke();
    }

    // Preview on screen (mirrored)
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
    ctx.fillText('👤', 250, 180);

    // Label
    ctx.fillStyle = '#334155';
    ctx.font = 'bold 14px Lexend';
    ctx.textAlign = 'center';
    ctx.fillText('Mirror preview for selfies!', 250, 290);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Lexend', sans-serif;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      <div className="max-w-6xl mx-auto">
        {/* Application Selector */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {applications.map((app, idx) => {
            const Icon = app.icon;
            return (
              <button
                key={app.id}
                onClick={() => setCurrentApplication(idx)}
                className={`p-4 rounded-xl transition-all transform hover:scale-105 ${
                  idx === currentApplication
                    ? `bg-gradient-to-br ${app.color} text-white shadow-xl scale-105`
                    : 'bg-white text-slate-700 hover:shadow-lg'
                }`}
              >
                <Icon className={`w-8 h-8 mx-auto mb-2 ${idx === currentApplication ? '' : 'text-slate-600'}`} />
                <p className={`text-xs font-semibold text-center ${idx === currentApplication ? '' : 'text-slate-600'}`}>
                  {app.title}
                </p>
              </button>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
          {/* Header */}
          <div className={`bg-gradient-to-r ${currentApp.color} p-8 text-white`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  {React.createElement(currentApp.icon, { className: "w-10 h-10" })}
                </div>
                <div>
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-2">
                    {currentApp.category}
                  </span>
                  <h2 className="text-4xl font-bold">{currentApp.title}</h2>
                </div>
              </div>
              <div className="text-right">
                <span className="text-6xl font-bold opacity-20">{currentApp.id}</span>
              </div>
            </div>
          </div>

          {/* Visualization */}
          <div className="p-8 bg-slate-50">
            <canvas
              ref={canvasRef}
              width={500}
              height={300}
              className="w-full bg-white rounded-xl shadow-lg border border-slate-200"
            />
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">What is it?</h3>
                <p className="text-lg text-slate-700 leading-relaxed">{currentApp.description}</p>
              </div>

              {/* Real World Example */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
                <h3 className="text-xl font-bold text-blue-900 mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Examples in Real Life
                </h3>
                <p className="text-blue-800">{currentApp.realWorldExample}</p>
              </div>

              {/* How It Works */}
              <div>
                <button
                  onClick={() => toggleSection('howItWorks')}
                  className="w-full flex items-center justify-between bg-purple-50 p-4 rounded-xl border border-purple-200 hover:bg-purple-100 transition-all"
                >
                  <h3 className="text-xl font-bold text-purple-900">How Does It Work?</h3>
                  {expandedSection === 'howItWorks' ? (
                    <ChevronUp className="w-6 h-6 text-purple-600" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-purple-600" />
                  )}
                </button>
                {expandedSection === 'howItWorks' && (
                  <div className="mt-4 space-y-3">
                    {currentApp.howItWorks.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3 bg-white p-4 rounded-lg border border-slate-200">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                          {idx + 1}
                        </div>
                        <p className="text-slate-700 pt-1">{step}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Fun Facts */}
              <div>
                <button
                  onClick={() => toggleSection('funFacts')}
                  className="w-full flex items-center justify-between bg-green-50 p-4 rounded-xl border border-green-200 hover:bg-green-100 transition-all"
                >
                  <h3 className="text-xl font-bold text-green-900">Fun Facts</h3>
                  {expandedSection === 'funFacts' ? (
                    <ChevronUp className="w-6 h-6 text-green-600" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-green-600" />
                  )}
                </button>
                {expandedSection === 'funFacts' && (
                  <div className="mt-4 space-y-3">
                    {currentApp.funFacts.map((fact, idx) => (
                      <div key={idx} className="flex items-start gap-3 bg-white p-4 rounded-lg border border-slate-200">
                        <span className="text-2xl">💡</span>
                        <p className="text-slate-700 pt-1">{fact}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="p-6 bg-slate-50 border-t border-slate-200">
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentApplication(Math.max(0, currentApplication - 1))}
                disabled={currentApplication === 0}
                className="flex items-center gap-2 px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-5 h-5" />
                Previous
              </button>
              
              <button
                onClick={() => setCurrentApplication(Math.min(applications.length - 1, currentApplication + 1))}
                disabled={currentApplication === applications.length - 1}
                className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${currentApp.color} text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                Next
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 p-8 rounded-2xl shadow-2xl text-white">
          <div className="flex items-center gap-4 mb-4">
            <Lightbulb className="w-10 h-10" />
            <h3 className="text-2xl font-bold">Key Takeaway</h3>
          </div>
          <p className="text-lg leading-relaxed">
            Reflection of light is not just a physics concept - it's a fundamental principle that powers countless technologies we use every day. From the mirror you use each morning to the satellites orbiting Earth, reflection helps us see, communicate, and understand our world better!
          </p>
        </div>
      </div>
    </div>
  );
};

// Main App Component (internal, uses LanguageProvider)
const MainApp: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>("learn");

  // Clean up invalid attributes injected by browser extensions
  useEffect(() => {
    const cleanupInvalidAttributes = () => {
      const invalidAttrs = ['error', 'warn', 'log'];
      const allSVGElements = document.querySelectorAll('svg, svg path, svg circle, svg rect, svg line');
      
      allSVGElements.forEach((element) => {
        invalidAttrs.forEach((attr) => {
          if (element.hasAttribute(attr)) {
            element.removeAttribute(attr);
          }
        });
      });
    };

    // Run cleanup after render and on interval to catch dynamically added attributes
    cleanupInvalidAttributes();
    const interval = setInterval(cleanupInvalidAttributes, 1000);
    
    // Also use MutationObserver to catch changes in real-time
    const observer = new MutationObserver(cleanupInvalidAttributes);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['error', 'warn', 'log']
    });

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-blue-50">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-blue-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                Reflection of Light
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
          <ReflectionOfLightLearn />
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
