import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
  ReactNode,
} from "react";
import translationsData from "../locales/translation.json";
import { Lightbulb, ArrowRight, ArrowLeft, CheckCircle, XCircle, RefreshCw, Award, Camera, Car, Eye, Home, Smartphone, Sun, Telescope, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

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
           msg.includes('the message port closed before a response was received') ||
           msg.includes('extension context invalidated') ||
           msg.includes('receiving end does not exist') ||
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
    if (window.chrome && window.chrome.runtime) {
      // Override lastError getter to prevent warnings - multiple attempts for maximum compatibility
      try {
        const descriptor = Object.getOwnPropertyDescriptor(window.chrome.runtime, 'lastError');
        if (!descriptor || descriptor.configurable) {
          Object.defineProperty(window.chrome.runtime, 'lastError', {
            get: () => null,
            set: () => {},
            configurable: true,
            enumerable: false
          });
        }
      } catch (e) {
        // Try alternative approach
        try {
          (window.chrome.runtime as any).lastError = null;
          Object.defineProperty(window.chrome.runtime, 'lastError', {
            get: () => null,
            set: () => {},
            configurable: true,
            enumerable: false
          });
        } catch (e2) {
          // If all else fails, wrap the property
        }
      }
      
      // Wrap sendMessage to suppress errors
      if (window.chrome.runtime.sendMessage) {
        const originalSendMessage = window.chrome.runtime.sendMessage;
        window.chrome.runtime.sendMessage = function(this: typeof window.chrome.runtime, ...args: unknown[]) {
          try {
            const result = originalSendMessage.apply(this, args);
            // If it returns a promise, catch errors
            if (result && typeof result === 'object' && 'catch' in result && typeof (result as { catch?: unknown }).catch === 'function') {
              return (result as Promise<unknown>).catch(() => {
                // Suppress promise rejections from extensions
              });
            }
            return result;
          } catch (e) {
            // Suppress errors from extension messaging
            return;
          }
        } as typeof originalSendMessage;
      }
      
      // Wrap connect to suppress connection errors
      if (window.chrome.runtime.connect) {
        const originalConnect = window.chrome.runtime.connect;
        window.chrome.runtime.connect = function(this: typeof window.chrome.runtime, ...args: unknown[]) {
          try {
            const port = originalConnect.apply(this, args);
            // Suppress errors from port messages
            if (port && typeof port === 'object' && 'onMessage' in port) {
              const portWithMessage = port as { onMessage?: { addListener?: (callback: unknown) => void } };
              if (portWithMessage.onMessage && portWithMessage.onMessage.addListener) {
                const originalAddListener = portWithMessage.onMessage.addListener;
                portWithMessage.onMessage.addListener = function(callback: unknown) {
                  try {
                    return originalAddListener.call(this, callback);
                  } catch (e) {
                    // Suppress listener errors
                  }
                };
              }
            }
            return port;
          } catch (e) {
            // Suppress connection errors
            return null as any;
          }
        } as typeof originalConnect;
      }
    }
    
    // Handle browser (Firefox) extension API
    if (window.browser && window.browser.runtime) {
      if (window.browser.runtime.sendMessage) {
        const originalSendMessage = window.browser.runtime.sendMessage;
        window.browser.runtime.sendMessage = function(this: typeof window.browser.runtime, ...args: unknown[]) {
          try {
            const result = originalSendMessage.apply(this, args);
            if (result && typeof result === 'object' && 'catch' in result && typeof (result as { catch?: unknown }).catch === 'function') {
              return (result as Promise<unknown>).catch(() => {});
            }
            return result;
          } catch (e) {
            return;
          }
        } as typeof originalSendMessage;
      }
    }
  } catch (e) {
    // Silently fail if we can't override
  }
  
  // Additional error suppression for extension-related errors
  try {
    const originalOnError = window.onerror;
    window.onerror = function(message, source, lineno, colno, error) {
      const msg = String(message || '').toLowerCase();
      if (shouldSuppress(msg)) {
        return true; // Suppress the error
      }
      if (originalOnError) {
        return originalOnError.call(this, message, source, lineno, colno, error);
      }
      return false;
    };
  } catch (e) {
    // Silently fail if we can't override
  }
  
  // Suppress errors that might be logged after page load
  try {
    // Periodic check to suppress any new errors (runs every 100ms for first 5 seconds)
    let checkCount = 0;
    const maxChecks = 50;
    const errorCheckInterval = setInterval(() => {
      checkCount++;
      if (checkCount >= maxChecks) {
        clearInterval(errorCheckInterval);
        return;
      }
      
      // Re-check and suppress chrome.runtime.lastError
      if (window.chrome && window.chrome.runtime) {
        try {
          if (window.chrome.runtime.lastError) {
            Object.defineProperty(window.chrome.runtime, 'lastError', {
              get: () => null,
              set: () => {},
              configurable: true,
              enumerable: false
            });
          }
        } catch (e) {
          // Ignore
        }
      }
    }, 100);
  } catch (e) {
    // Ignore
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
  const { t, language } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedDemo, setSelectedDemo] = useState<'law' | 'types' | 'interactive'>('law');
  const [lightAngle, setLightAngle] = useState<number>(45);
  const [showNormal, setShowNormal] = useState<boolean>(true);
  const [showAngles, setShowAngles] = useState<boolean>(true);
  const [isAnimating, setIsAnimating] = useState<boolean>(true);
  const animationFrameRef = useRef<number>();

  // Draw arrow
  const drawArrow = (
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    color: string,
    width: number = 2
  ) => {
    const headLength = 10;
    const angle = Math.atan2(toY - fromY, toX - fromX);

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width;

    // Draw line
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    // Draw arrowhead
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(
      toX - headLength * Math.cos(angle - Math.PI / 6),
      toY - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      toX - headLength * Math.cos(angle + Math.PI / 6),
      toY - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();
  };

  // Draw Law of Reflection demo
  const drawLawOfReflection = (ctx: CanvasRenderingContext2D, time: number) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    // Clear canvas with light background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Mirror position
    const mirrorY = height / 2;
    const mirrorX = width / 2;
    const mirrorLength = 300;

    // Draw mirror
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(mirrorX - mirrorLength / 2, mirrorY);
    ctx.lineTo(mirrorX + mirrorLength / 2, mirrorY);
    ctx.stroke();

    // Draw mirror surface effect
    ctx.strokeStyle = 'rgba(96, 165, 250, 0.3)';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(mirrorX - mirrorLength / 2, mirrorY);
    ctx.lineTo(mirrorX + mirrorLength / 2, mirrorY);
    ctx.stroke();

    // Draw normal line
    if (showNormal) {
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(mirrorX, mirrorY - 150);
      ctx.lineTo(mirrorX, mirrorY + 150);
      ctx.stroke();
      ctx.setLineDash([]);

      // Label normal
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(t('learn.canvas.normal'), mirrorX + 40, mirrorY - 160);
    }

    // Calculate ray positions
    const incidentAngle = (lightAngle * Math.PI) / 180;
    const rayLength = 150;

    // Incident ray start and end points
    const incidentStartX = mirrorX - rayLength * Math.sin(incidentAngle);
    const incidentStartY = mirrorY - rayLength * Math.cos(incidentAngle);

    // Reflected ray end point
    const reflectedEndX = mirrorX + rayLength * Math.sin(incidentAngle);
    const reflectedEndY = mirrorY - rayLength * Math.cos(incidentAngle);

    // Animation timing: 0-1000ms for incident, 1000-2000ms for reflected
    const cycleTime = isAnimating ? (time % 2000) : 2000;
    const incidentProgress = Math.min(1, cycleTime / 1000);
    const reflectedProgress = cycleTime > 1000 ? Math.min(1, (cycleTime - 1000) / 1000) : 0;

    // Draw incident ray (from start to mirror)
    const incidentCurrentX = incidentStartX + (mirrorX - incidentStartX) * incidentProgress;
    const incidentCurrentY = incidentStartY + (mirrorY - incidentStartY) * incidentProgress;

    // Always draw the full incident ray once it reaches the mirror
    if (incidentProgress >= 1) {
      // Draw complete incident ray
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ef4444';
      drawArrow(ctx, incidentStartX, incidentStartY, mirrorX, mirrorY, '#ef4444', 3);
      ctx.shadowBlur = 0;
    } else {
      // Draw animated incident ray
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ef4444';
      drawArrow(ctx, incidentStartX, incidentStartY, incidentCurrentX, incidentCurrentY, '#ef4444', 3);
      ctx.shadowBlur = 0;
    }

    // Draw reflected ray (from mirror to end) - only after incident ray reaches mirror
    if (incidentProgress >= 1) {
      const reflectedCurrentX = mirrorX + (reflectedEndX - mirrorX) * reflectedProgress;
      const reflectedCurrentY = mirrorY + (reflectedEndY - mirrorY) * reflectedProgress;

      ctx.shadowBlur = 15;
      ctx.shadowColor = '#10b981';
      drawArrow(ctx, mirrorX, mirrorY, reflectedCurrentX, reflectedCurrentY, '#10b981', 3);
      ctx.shadowBlur = 0;

      // Draw complete reflected ray once animation is done
      if (reflectedProgress >= 1) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#10b981';
        drawArrow(ctx, mirrorX, mirrorY, reflectedEndX, reflectedEndY, '#10b981', 3);
        ctx.shadowBlur = 0;
      }
    }

    // Draw angles - show incident angle once incident ray reaches mirror
    // Show both angles once reflected ray is complete
    if (showAngles && incidentProgress >= 1) {
      const normalAngle = -Math.PI / 2; // Normal points upward (negative Y direction)
      const angleRadius = 40;
      const incidentAngleRad = (lightAngle * Math.PI) / 180;

      // Incident angle: angle between normal and incident ray
      // Normal is at -90°, incident ray is at normalAngle - incidentAngleRad
      const incidentRayAngle = normalAngle - incidentAngleRad;
      
      // Reflected angle: angle between normal and reflected ray
      // Reflected ray is at normalAngle + incidentAngleRad
      const reflectedRayAngle = normalAngle + incidentAngleRad;

      // Draw incident angle arc (only the arc curve between normal and incident ray)
      if (incidentProgress >= 1) {
        const incidentArcStart = normalAngle;
        const incidentArcEnd = incidentRayAngle;
        
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        // Draw only the arc, not a filled sector
        ctx.arc(mirrorX, mirrorY, angleRadius, incidentArcStart, incidentArcEnd, false);
        ctx.stroke();

        // Label for incident angle
        const incidentLabelAngle = (incidentArcStart + incidentArcEnd) / 2;
        const incidentLabelX = mirrorX + (angleRadius + 30) * Math.cos(incidentLabelAngle);
        const incidentLabelY = mirrorY + (angleRadius + 30) * Math.sin(incidentLabelAngle);
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 15px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(t('learn.canvas.incidentAngle').replace('{{angle}}', lightAngle.toString()), incidentLabelX, incidentLabelY);
      }

      // Draw reflected angle arc (only the arc curve between normal and reflected ray) - only when reflected ray is visible
      if (incidentProgress >= 1 && reflectedProgress > 0) {
        const reflectedArcStart = normalAngle;
        const reflectedArcEnd = reflectedRayAngle;
        
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        // Draw only the arc, not a filled sector
        ctx.arc(mirrorX, mirrorY, angleRadius, reflectedArcStart, reflectedArcEnd, true);
        ctx.stroke();

        // Label for reflected angle
        const reflectedLabelAngle = (reflectedArcStart + reflectedArcEnd) / 2;
        const reflectedLabelX = mirrorX + (angleRadius + 30) * Math.cos(reflectedLabelAngle);
        const reflectedLabelY = mirrorY + (angleRadius + 30) * Math.sin(reflectedLabelAngle);
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 15px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(t('learn.canvas.reflectedAngle').replace('{{angle}}', lightAngle.toString()), reflectedLabelX, reflectedLabelY);
      }
    }

    // Draw labels
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(t('learn.canvas.incidentRay'), incidentStartX, incidentStartY - 20);

    if (incidentProgress >= 1 && reflectedProgress >= 1) {
      ctx.fillStyle = '#10b981';
      ctx.fillText(t('learn.canvas.reflectedRay'), reflectedEndX, reflectedEndY - 20);
    }

    // Draw point of incidence
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(mirrorX, mirrorY, 5, 0, Math.PI * 2);
    ctx.fill();

    // Info box
    drawInfoBox(ctx, width, height);
  };

  // Draw Types of Reflection demo
  const drawTypesOfReflection = (ctx: CanvasRenderingContext2D, time: number) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    // Light background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const centerY = height / 2;
    const leftX = width / 4;
    const rightX = (3 * width) / 4;

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(t('learn.types.regularTitle'), leftX, 50);
    ctx.fillText(t('learn.types.diffuseTitle'), rightX, 50);

    // Draw regular reflection (smooth surface)
    drawSmoothReflection(ctx, leftX, centerY, time);

    // Draw diffuse reflection (rough surface)
    drawRoughReflection(ctx, rightX, centerY, time);

    // Descriptions
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    
    const wrapText = (text: string, x: number, y: number, maxWidth: number) => {
      const words = text.split(' ');
      let line = '';
      let lineY = y;

      for (const word of words) {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && line !== '') {
          ctx.fillText(line, x, lineY);
          line = word + ' ';
          lineY += 20;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, x, lineY);
    };

    wrapText(
      'Parallel incident rays remain parallel after reflection',
      leftX,
      height - 80,
      200
    );
    wrapText(
      'Parallel incident rays scatter in different directions',
      rightX,
      height - 80,
      200
    );
  };

  const drawSmoothReflection = (ctx: CanvasRenderingContext2D, x: number, y: number, time: number) => {
    const mirrorLength = 200;
    const numRays = 5;
    
    // Animation timing: 0-1000ms for incident, 1000-2000ms for reflected
    const cycleTime = isAnimating ? (time % 2000) : 2000;
    const incidentProgress = Math.min(1, cycleTime / 1000);
    const reflectedProgress = cycleTime > 1000 ? Math.min(1, (cycleTime - 1000) / 1000) : 0;

    // Draw smooth mirror
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x - mirrorLength / 2, y);
    ctx.lineTo(x + mirrorLength / 2, y);
    ctx.stroke();

    // Glossy effect
    const gradient = ctx.createLinearGradient(x - mirrorLength / 2, y - 20, x + mirrorLength / 2, y + 20);
    gradient.addColorStop(0, 'rgba(96, 165, 250, 0.1)');
    gradient.addColorStop(0.5, 'rgba(96, 165, 250, 0.3)');
    gradient.addColorStop(1, 'rgba(96, 165, 250, 0.1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(x - mirrorLength / 2, y, mirrorLength, 30);

    // Draw parallel rays
    for (let i = 0; i < numRays; i++) {
      const offset = ((i - (numRays - 1) / 2) * 30);
      const rayX = x + offset;
      const angle = 30 * (Math.PI / 180);
      const rayLength = 80;

      // Incident ray start and end points
      const incidentStartX = rayX - rayLength * Math.sin(angle);
      const incidentStartY = y - rayLength * Math.cos(angle);

      // Draw incident ray (from start to mirror)
      if (incidentProgress >= 1) {
        // Draw complete incident ray
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(incidentStartX, incidentStartY);
        ctx.lineTo(rayX, y);
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else {
        // Draw animated incident ray
        const incidentCurrentX = incidentStartX + (rayX - incidentStartX) * incidentProgress;
        const incidentCurrentY = incidentStartY + (y - incidentStartY) * incidentProgress;
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(incidentStartX, incidentStartY);
        ctx.lineTo(incidentCurrentX, incidentCurrentY);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Reflected ray (from mirror to end) - only after incident ray reaches mirror
      if (incidentProgress >= 1) {
        const reflectedEndX = rayX + rayLength * Math.sin(angle);
        const reflectedEndY = y - rayLength * Math.cos(angle);
        const reflectedCurrentX = rayX + (reflectedEndX - rayX) * reflectedProgress;
        const reflectedCurrentY = y + (reflectedEndY - y) * reflectedProgress;

        ctx.strokeStyle = '#10b981';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#10b981';
        ctx.beginPath();
        ctx.moveTo(rayX, y);
        ctx.lineTo(reflectedCurrentX, reflectedCurrentY);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Draw complete reflected ray once animation is done
        if (reflectedProgress >= 1) {
          ctx.strokeStyle = '#10b981';
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#10b981';
          ctx.beginPath();
          ctx.moveTo(rayX, y);
          ctx.lineTo(reflectedEndX, reflectedEndY);
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      }
    }

    // Label
    ctx.fillStyle = '#60a5fa';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(t('learn.types.smoothSurface'), x, y + 60);
  };

  const drawRoughReflection = (ctx: CanvasRenderingContext2D, x: number, y: number, time: number) => {
    const surfaceLength = 200;
    const numRays = 5;
    
    // Animation timing: 0-1000ms for incident, 1000-2000ms for reflected
    const cycleTime = isAnimating ? (time % 2000) : 2000;
    const incidentProgress = Math.min(1, cycleTime / 1000);
    const reflectedProgress = cycleTime > 1000 ? Math.min(1, (cycleTime - 1000) / 1000) : 0;

    // Draw rough surface
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    const segments = 20;
    for (let i = 0; i <= segments; i++) {
      const segX = x - surfaceLength / 2 + (i * surfaceLength) / segments;
      const roughness = Math.sin(i * 1.5) * 5 + Math.cos(i * 2.3) * 3;
      if (i === 0) {
        ctx.moveTo(segX, y + roughness);
      } else {
        ctx.lineTo(segX, y + roughness);
      }
    }
    ctx.stroke();

    // Draw texture
    ctx.fillStyle = 'rgba(100, 116, 139, 0.2)';
    for (let i = 0; i < 30; i++) {
      const px = x - surfaceLength / 2 + Math.random() * surfaceLength;
      const py = y + Math.random() * 40;
      ctx.fillRect(px, py, 2, 2);
    }

    // Draw scattered rays
    for (let i = 0; i < numRays; i++) {
      const offset = ((i - (numRays - 1) / 2) * 30);
      const rayX = x + offset;
      const angle = 30 * (Math.PI / 180);
      const rayLength = 80;

      // Incident ray start and end points
      const incidentStartX = rayX - rayLength * Math.sin(angle);
      const incidentStartY = y - rayLength * Math.cos(angle);

      // Draw incident ray (from start to surface)
      if (incidentProgress >= 1) {
        // Draw complete incident ray
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(incidentStartX, incidentStartY);
        ctx.lineTo(rayX, y);
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else {
        // Draw animated incident ray
        const incidentCurrentX = incidentStartX + (rayX - incidentStartX) * incidentProgress;
        const incidentCurrentY = incidentStartY + (y - incidentStartY) * incidentProgress;
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(incidentStartX, incidentStartY);
        ctx.lineTo(incidentCurrentX, incidentCurrentY);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Scattered reflected rays (from surface to end) - only after incident ray reaches surface
      if (incidentProgress >= 1) {
        const scatterAngles = [-50, -30, -10, 10, 30]; // Different scatter angles
        const scatterAngle = (scatterAngles[i] * Math.PI) / 180;
        const reflectedEndX = rayX + rayLength * Math.sin(scatterAngle);
        const reflectedEndY = y - rayLength * Math.abs(Math.cos(scatterAngle));
        const reflectedCurrentX = rayX + (reflectedEndX - rayX) * reflectedProgress;
        const reflectedCurrentY = y + (reflectedEndY - y) * reflectedProgress;

        ctx.strokeStyle = '#10b981';
        ctx.globalAlpha = 0.7;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#10b981';
        ctx.beginPath();
        ctx.moveTo(rayX, y);
        ctx.lineTo(reflectedCurrentX, reflectedCurrentY);
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;

        // Draw complete reflected ray once animation is done
        if (reflectedProgress >= 1) {
          ctx.strokeStyle = '#10b981';
          ctx.globalAlpha = 0.7;
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#10b981';
          ctx.beginPath();
          ctx.moveTo(rayX, y);
          ctx.lineTo(reflectedEndX, reflectedEndY);
          ctx.stroke();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
        }
      }
    }

    // Label
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(t('learn.types.roughSurface'), x, y + 60);
  };

  const drawInfoBox = (ctx: CanvasRenderingContext2D, _width: number, height: number) => {
    const boxX = 20;
    const boxY = height - 120;
    const boxWidth = 300;
    const boxHeight = 100;

    ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(t('learn.infoBox.lawTitle'), boxX + 10, boxY + 25);

    ctx.font = '14px Arial';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(t('learn.infoBox.lawFormula'), boxX + 10, boxY + 50);
    ctx.fillText(t('learn.infoBox.lawDesc1'), boxX + 10, boxY + 70);
    ctx.fillText(t('learn.infoBox.lawDesc2'), boxX + 10, boxY + 87);
  };

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let startTime = Date.now();

    const animate = () => {
      const currentTime = Date.now() - startTime;

      if (selectedDemo === 'law') {
        drawLawOfReflection(ctx, currentTime);
      } else if (selectedDemo === 'types') {
        drawTypesOfReflection(ctx, currentTime);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [selectedDemo, lightAngle, showNormal, showAngles, isAnimating, language, t]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Lexend', sans-serif;
        }
      `}</style>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ 
          color: '#1e293b', 
          fontSize: '36px', 
          marginBottom: '10px',
          fontWeight: 'bold'
        }}>
          {t('learn.title')}
        </h1>
        <p style={{ color: '#64748b', fontSize: '18px' }}>
          {t('learn.subtitle')}
        </p>
      </div>

      {/* Demo Selection */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '15px', 
        marginBottom: '25px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setSelectedDemo('law')}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: selectedDemo === 'law' ? '#3b82f6' : '#1e293b',
            color: '#ffffff',
            border: selectedDemo === 'law' ? '2px solid #60a5fa' : '2px solid #334155',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s',
            fontWeight: 'bold'
          }}
        >
          {t('learn.demos.law')}
        </button>
        <button
          onClick={() => setSelectedDemo('types')}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: selectedDemo === 'types' ? '#3b82f6' : '#1e293b',
            color: '#ffffff',
            border: selectedDemo === 'types' ? '2px solid #60a5fa' : '2px solid #334155',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s',
            fontWeight: 'bold'
          }}
        >
          {t('learn.demos.types')}
        </button>
      </div>

      {/* Canvas */}
      <div className="flex justify-center mb-6">
        <canvas
          ref={canvasRef}
          width={900}
          height={600}
          className="border-3 border-slate-200 rounded-xl shadow-lg bg-white"
          style={{
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
          }}
        />
      </div>

      {/* Controls */}
      {selectedDemo === 'law' && (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md border border-slate-200 mb-6">
          <h3 className="text-slate-800 font-bold text-lg mb-5">{t('learn.controls.title')}</h3>
          
          <div className="mb-5">
            <label className="text-slate-700 block mb-2 text-sm font-medium">
              {t('learn.controls.angleOfIncidence')} <span className="text-blue-600 font-bold">{lightAngle}°</span>
            </label>
            <input
              type="range"
              min="10"
              max="80"
              value={lightAngle}
              onChange={(e) => setLightAngle(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="flex gap-4 flex-wrap">
            <label className="text-slate-700 flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showNormal}
                onChange={(e) => setShowNormal(e.target.checked)}
                className="mr-2 cursor-pointer accent-blue-600"
              />
              {t('learn.controls.showNormalLine')}
            </label>
            <label className="text-slate-700 flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showAngles}
                onChange={(e) => setShowAngles(e.target.checked)}
                className="mr-2 cursor-pointer accent-blue-600"
              />
              {t('learn.controls.showAngleMeasurements')}
            </label>
            <label className="text-slate-700 flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isAnimating}
                onChange={(e) => setIsAnimating(e.target.checked)}
                className="mr-2 cursor-pointer accent-blue-600"
              />
              {t('learn.controls.animateLightTravel')}
            </label>
          </div>
        </div>
      )}

      {/* Educational Content */}
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md border border-slate-200">
        <h3 className="text-slate-800 font-bold text-lg mb-4">{t('learn.concepts.title')}</h3>
        
        {selectedDemo === 'law' && (
          <div className="text-slate-700 leading-relaxed">
            <p className="mb-3">
              <strong className="text-blue-600">{t('learn.concepts.law.title')}</strong> {t('learn.concepts.law.description')}
            </p>
            <ul className="ml-5 mb-3 list-disc space-y-1">
              <li>{t('learn.concepts.law.point1')}</li>
              <li>{t('learn.concepts.law.point2')}</li>
              <li>{t('learn.concepts.law.point3')}</li>
            </ul>
            <p>
              <strong className="text-red-500">{t('learn.concepts.law.redRay')}</strong> {t('learn.concepts.law.redRayDesc')}<br/>
              <strong className="text-green-500">{t('learn.concepts.law.greenRay')}</strong> {t('learn.concepts.law.greenRayDesc')}<br/>
              <strong className="text-yellow-500">{t('learn.concepts.law.yellowLine')}</strong> {t('learn.concepts.law.yellowLineDesc')}
            </p>
          </div>
        )}

        {selectedDemo === 'types' && (
          <div className="text-slate-700 leading-relaxed">
            <p className="mb-3">
              <strong className="text-blue-600">{t('learn.concepts.types.regularTitle')}</strong> {t('learn.concepts.types.regularDesc')}
            </p>
            <p>
              <strong className="text-slate-600">{t('learn.concepts.types.diffuseTitle')}</strong> {t('learn.concepts.types.diffuseDesc')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Practice Mode Component
const PracticeMode: React.FC = () => {
  const { t, tValue } = useLanguage();
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
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>(new Array(8).fill(null));
  const [showOverview, setShowOverview] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const exercises = [
    {
      id: 1,
      type: 'mcq',
      question: t('practice.exercises.1.question'),
      options: tValue('practice.exercises.1.options') as string[],
      correctAnswer: t('practice.exercises.1.options.1'),
      explanation: t('practice.exercises.1.explanation'),
      difficulty: 'Easy'
    },
    {
      id: 2,
      type: 'mcq',
      question: t('practice.exercises.2.question'),
      options: tValue('practice.exercises.2.options') as string[],
      correctAnswer: t('practice.exercises.2.options.2'),
      explanation: t('practice.exercises.2.explanation'),
      difficulty: 'Easy'
    },
    {
      id: 3,
      type: 'mcq',
      question: t('practice.exercises.3.question'),
      options: tValue('practice.exercises.3.options') as string[],
      correctAnswer: t('practice.exercises.3.options.2'),
      explanation: t('practice.exercises.3.explanation'),
      difficulty: 'Easy'
    },
    {
      id: 4,
      type: 'truefalse',
      question: t('practice.exercises.4.question'),
      correctAnswer: 'false',
      explanation: t('practice.exercises.4.explanation'),
      difficulty: 'Medium'
    },
    {
      id: 5,
      type: 'interactive-mirror',
      question: t('practice.exercises.5.question'),
      targetAngle: 60,
      tolerance: 5,
      explanation: t('practice.exercises.5.explanation'),
      difficulty: 'Medium'
    },
    {
      id: 6,
      type: 'mcq',
      question: t('practice.exercises.6.question'),
      options: tValue('practice.exercises.6.options') as string[],
      correctAnswer: t('practice.exercises.6.options.1'),
      explanation: t('practice.exercises.6.explanation'),
      difficulty: 'Medium'
    },
    {
      id: 7,
      type: 'drawing',
      question: t('practice.exercises.7.question'),
      explanation: t('practice.exercises.7.explanation'),
      difficulty: 'Hard'
    },
    {
      id: 8,
      type: 'mcq-image',
      question: t('practice.exercises.8.question'),
      options: tValue('practice.exercises.8.options') as string[],
      correctAnswer: t('practice.exercises.8.options.1'),
      explanation: t('practice.exercises.8.explanation'),
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
      ctx.fillText(t('practice.interactive.lightSource'), lightX, lightY + 30);
      ctx.fillText(t('practice.interactive.mirror').replace('{{angle}}', userMirrorAngle.toString()), mirrorX, mirrorY + 30);
      ctx.fillText(t('practice.interactive.target'), targetEndX, targetEndY + 35);

      // Check if close to target
      const distance = Math.sqrt(
        Math.pow(reflectEndX - targetEndX, 2) + Math.pow(reflectEndY - targetEndY, 2)
      );
      
      if (distance < 25) {
        ctx.fillStyle = '#00ff88';
        ctx.font = 'bold 20px Lexend';
        ctx.textAlign = 'center';
        ctx.fillText(t('practice.interactive.perfect'), canvas.width / 2, 30);
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
      ctx.fillText(t('practice.drawing.instruction'), 20, 30);

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
    let userAnswer: string | null = null;

    if (currentEx.type === 'mcq' || currentEx.type === 'mcq-image') {
      userAnswer = selectedAnswer;
      correct = selectedAnswer === currentEx.correctAnswer;
    } else if (currentEx.type === 'truefalse') {
      userAnswer = selectedAnswer;
      correct = selectedAnswer === currentEx.correctAnswer;
    } else if (currentEx.type === 'interactive-mirror') {
      userAnswer = `${userMirrorAngle}°`;
      const diff = Math.abs(userMirrorAngle - targetAngle);
      correct = diff <= (currentEx.tolerance || 5);
    } else if (currentEx.type === 'drawing') {
      userAnswer = userDrawing.length > 20 ? t('practice.overview.drawn') : t('practice.overview.notDrawn');
      correct = userDrawing.length > 20;
    }

    // Store user's answer
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentExercise] = userAnswer;
    setUserAnswers(newUserAnswers);

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
    setUserAnswers(new Array(8).fill(null));
    setShowOverview(false);
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
                  {option === 'true' ? t('practice.trueFalse.true') : t('practice.trueFalse.false')}
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
                {t('practice.interactive.mirrorAngle')} {userMirrorAngle}°
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
                {t('practice.interactive.tip')}
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
                {t('practice.drawing.clearDrawing')}
              </button>
              <div className="flex-1 bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  {t('practice.drawing.tip')}
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

  // Overview Component
  if (showOverview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800&display=swap');
          
          * {
            font-family: 'Lexend', sans-serif;
          }
        `}</style>

        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">{t('practice.overview.title')}</h1>
                <p className="text-slate-600">{t('practice.overview.subtitle')}</p>
              </div>
              <button
                onClick={() => setShowOverview(false)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                {t('practice.overview.backToPractice')}
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-medium">{t('practice.overview.correct')}</p>
                  <p className="text-2xl font-bold text-slate-800">{score}/{exercises.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-medium">{t('practice.overview.incorrect')}</p>
                  <p className="text-2xl font-bold text-slate-800">{exercises.length - score}/{exercises.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-medium">{t('practice.overview.accuracy')}</p>
                  <p className="text-2xl font-bold text-slate-800">{accuracyRate}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Exercise Overview List */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800">{t('practice.overview.exerciseList')}</h2>
            </div>
            <div className="divide-y divide-slate-200">
              {exercises.map((exercise, idx) => {
                const userAnswer = userAnswers[idx];
                const isCorrectAnswer = completedExercises[idx];
                
                // Get current translations dynamically
                const exerciseNum = (idx + 1).toString();
                const currentQuestion = t(`practice.exercises.${exerciseNum}.question`);
                const currentExplanation = t(`practice.exercises.${exerciseNum}.explanation`);
                
                let correctAnswerText = '';
                
                if (exercise.type === 'mcq' || exercise.type === 'mcq-image') {
                  // For MCQ, get the correct answer index from the exercise
                  // The correctAnswer is stored as the translated option text
                  // We need to find which option index it corresponds to
                  const options = tValue(`practice.exercises.${exerciseNum}.options`) as string[];
                  if (options && Array.isArray(options)) {
                    // Find the correct answer - it's stored as the translated string
                    // We need to match it with current options or use the exercise's correctAnswer
                    // Since correctAnswer is already translated, we can use it directly
                    correctAnswerText = exercise.correctAnswer || '';
                  } else {
                    correctAnswerText = exercise.correctAnswer || '';
                  }
                } else if (exercise.type === 'truefalse') {
                  // For true/false, translate the boolean value
                  if (exercise.correctAnswer === 'true') {
                    correctAnswerText = t('practice.trueFalse.true');
                  } else if (exercise.correctAnswer === 'false') {
                    correctAnswerText = t('practice.trueFalse.false');
                  } else {
                    correctAnswerText = exercise.correctAnswer || '';
                  }
                } else if (exercise.type === 'interactive-mirror') {
                  correctAnswerText = `${exercise.targetAngle || 0}°`;
                } else if (exercise.type === 'drawing') {
                  correctAnswerText = t('practice.overview.drawingRequired');
                }

                return (
                  <div key={idx} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${
                        isCorrectAnswer 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-slate-800">{currentQuestion}</h3>
                          {isCorrectAnswer ? (
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                          )}
                        </div>
                        <div className="space-y-2 mt-3">
                          <div className={`p-3 rounded-lg ${
                            isCorrectAnswer 
                              ? 'bg-green-50 border border-green-200' 
                              : 'bg-red-50 border border-red-200'
                          }`}>
                            <p className="text-sm font-medium text-slate-600 mb-1">{t('practice.overview.yourAnswer')}</p>
                            <p className={`font-semibold ${
                              isCorrectAnswer ? 'text-green-700' : 'text-red-700'
                            }`}>
                              {userAnswer || t('practice.overview.notAnswered')}
                            </p>
                          </div>
                          {!isCorrectAnswer && (
                            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                              <p className="text-sm font-medium text-slate-600 mb-1">{t('practice.overview.correctAnswer')}</p>
                              <p className="font-semibold text-blue-700">{correctAnswerText}</p>
                            </div>
                          )}
                          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                            <p className="text-sm font-medium text-slate-600 mb-1">{t('practice.overview.explanation')}</p>
                            <p className="text-slate-700">{currentExplanation}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Lexend', sans-serif;
        }
      `}</style>

      <div className="max-w-4xl mx-auto">

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
                    {t('practice.exercise').replace('{{num}}', (currentExercise + 1).toString())}
                  </h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-1 ${
                    currentEx.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                    currentEx.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {currentEx.difficulty === 'Easy' ? t('practice.difficulty.easy') :
                     currentEx.difficulty === 'Medium' ? t('practice.difficulty.medium') :
                     t('practice.difficulty.hard')}
                  </span>
                </div>
              </div>
              {completedExercises[currentExercise] && (
                <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">{t('practice.completed')}</span>
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
                      {isCorrect ? t('practice.excellent') : t('practice.notQuiteRight')}
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
                {t('practice.restart')}
              </button>

              <div className="flex gap-3">
                {!showFeedback && (
                  <button
                    onClick={handleSubmit}
                    disabled={
                      (currentEx.type === 'mcq' || currentEx.type === 'mcq-image' || currentEx.type === 'truefalse') && !selectedAnswer
                    }
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('practice.submitAnswer')}
                  </button>
                )}
                <button
                  onClick={handleNext}
                  disabled={currentExercise === exercises.length - 1}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('practice.nextExercise')}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Completion Message */}
        {completedExercises.every(Boolean) && (
          <div className="mt-6 bg-gradient-to-r from-green-400 to-emerald-500 p-8 rounded-2xl shadow-2xl text-white text-center">
            <Award className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">{t('practice.congratulations')}</h2>
            <p className="text-lg mb-4">
              {t('practice.completedAllText').replace('{{score}}', score.toString()).replace('{{total}}', exercises.length.toString())}
            </p>
            <p className="text-xl font-bold mb-6">{t('practice.accuracyLabel')} {accuracyRate}%</p>
            <button
              onClick={() => setShowOverview(true)}
              className="flex items-center gap-2 px-8 py-3 bg-white text-green-600 rounded-xl font-semibold hover:shadow-lg transition-all mx-auto"
            >
              {t('practice.overview.viewOverview')}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* View Overview Button (always visible when there are attempts) */}
        {!completedExercises.every(Boolean) && attempts > 0 && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setShowOverview(true)}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              {t('practice.overview.viewOverview')}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


// Real World Applications Component
const RealWorldMode: React.FC = () => {
  const { t, tValue, language } = useLanguage();
  const [currentApplication, setCurrentApplication] = useState(0);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const applications = [
    {
      id: 1,
      title: t('realWorld.applications.1.title'),
      icon: Home,
      category: t('realWorld.applications.1.category'),
      description: t('realWorld.applications.1.description'),
      realWorldExample: t('realWorld.applications.1.example'),
      howItWorks: tValue('realWorld.applications.1.howItWorks') as string[],
      funFacts: tValue('realWorld.applications.1.funFacts') as string[],
      visualization: 'mirror-daily',
      color: 'from-blue-400 to-cyan-500',
      canvasLabel: t('realWorld.applications.1.canvasLabel')
    },
    {
      id: 2,
      title: t('realWorld.applications.2.title'),
      icon: Car,
      category: t('realWorld.applications.2.category'),
      description: t('realWorld.applications.2.description'),
      realWorldExample: t('realWorld.applications.2.example'),
      howItWorks: tValue('realWorld.applications.2.howItWorks') as string[],
      funFacts: tValue('realWorld.applications.2.funFacts') as string[],
      visualization: 'rearview',
      color: 'from-orange-400 to-red-500',
      canvasLabel: t('realWorld.applications.2.canvasLabel')
    },
    {
      id: 3,
      title: t('realWorld.applications.3.title'),
      icon: Telescope,
      category: t('realWorld.applications.3.category'),
      description: t('realWorld.applications.3.description'),
      realWorldExample: t('realWorld.applications.3.example'),
      howItWorks: tValue('realWorld.applications.3.howItWorks') as string[],
      funFacts: tValue('realWorld.applications.3.funFacts') as string[],
      visualization: 'periscope',
      color: 'from-purple-400 to-indigo-500',
      canvasLabel: t('realWorld.applications.3.canvasLabel')
    },
    {
      id: 4,
      title: t('realWorld.applications.4.title'),
      icon: Sun,
      category: t('realWorld.applications.4.category'),
      description: t('realWorld.applications.4.description'),
      realWorldExample: t('realWorld.applications.4.example'),
      howItWorks: tValue('realWorld.applications.4.howItWorks') as string[],
      funFacts: tValue('realWorld.applications.4.funFacts') as string[],
      visualization: 'solar',
      color: 'from-yellow-400 to-orange-500',
      canvasLabel: t('realWorld.applications.4.canvasLabel')
    },
    {
      id: 5,
      title: t('realWorld.applications.5.title'),
      icon: Telescope,
      category: t('realWorld.applications.5.category'),
      description: t('realWorld.applications.5.description'),
      realWorldExample: t('realWorld.applications.5.example'),
      howItWorks: tValue('realWorld.applications.5.howItWorks') as string[],
      funFacts: tValue('realWorld.applications.5.funFacts') as string[],
      visualization: 'telescope',
      color: 'from-indigo-400 to-purple-600',
      canvasLabel: t('realWorld.applications.5.canvasLabel')
    },
    {
      id: 6,
      title: t('realWorld.applications.6.title'),
      icon: Eye,
      category: t('realWorld.applications.6.category'),
      description: t('realWorld.applications.6.description'),
      realWorldExample: t('realWorld.applications.6.example'),
      howItWorks: tValue('realWorld.applications.6.howItWorks') as string[],
      funFacts: tValue('realWorld.applications.6.funFacts') as string[],
      visualization: 'dental',
      color: 'from-green-400 to-teal-500',
      canvasLabel: t('realWorld.applications.6.canvasLabel')
    },
    {
      id: 7,
      title: t('realWorld.applications.7.title'),
      icon: Camera,
      category: t('realWorld.applications.7.category'),
      description: t('realWorld.applications.7.description'),
      realWorldExample: t('realWorld.applications.7.example'),
      howItWorks: tValue('realWorld.applications.7.howItWorks') as string[],
      funFacts: tValue('realWorld.applications.7.funFacts') as string[],
      visualization: 'security',
      color: 'from-red-400 to-pink-500',
      canvasLabel: t('realWorld.applications.7.canvasLabel')
    },
    {
      id: 8,
      title: t('realWorld.applications.8.title'),
      icon: Smartphone,
      category: t('realWorld.applications.8.category'),
      description: t('realWorld.applications.8.description'),
      realWorldExample: t('realWorld.applications.8.example'),
      howItWorks: tValue('realWorld.applications.8.howItWorks') as string[],
      funFacts: tValue('realWorld.applications.8.funFacts') as string[],
      visualization: 'smartphone',
      color: 'from-pink-400 to-purple-500',
      canvasLabel: t('realWorld.applications.8.canvasLabel')
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
  }, [currentApplication, language, t]);

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
    ctx.fillText(t('realWorld.applications.1.canvasLabel'), 250, 260);
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
    ctx.fillText(t('realWorld.applications.2.canvasLabel'), 250, 260);
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
    ctx.fillText(t('realWorld.applications.3.canvasLabel'), 250, 280);
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
    ctx.fillText(t('realWorld.applications.4.canvasLabel'), 250, 280);
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
    ctx.fillText(t('realWorld.applications.5.canvasLabel'), 250, 280);
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
    ctx.fillText(t('realWorld.applications.6.canvasLabel'), 250, 280);
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
    ctx.fillText(t('realWorld.applications.7.canvasLabel'), 250, 290);
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
    ctx.fillText(t('realWorld.applications.8.canvasLabel'), 250, 290);
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
                  {t('realWorld.example')}
                </h3>
                <p className="text-blue-800">{currentApp.realWorldExample}</p>
              </div>

              {/* How It Works */}
              <div>
                <button
                  onClick={() => toggleSection('howItWorks')}
                  className="w-full flex items-center justify-between bg-purple-50 p-4 rounded-xl border border-purple-200 hover:bg-purple-100 transition-all"
                >
                  <h3 className="text-xl font-bold text-purple-900">{t('realWorld.howItWorks')}</h3>
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
                  <h3 className="text-xl font-bold text-green-900">{t('realWorld.funFacts')}</h3>
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
                {t('realWorld.previous')}
              </button>
              
              <button
                onClick={() => setCurrentApplication(Math.min(applications.length - 1, currentApplication + 1))}
                disabled={currentApplication === applications.length - 1}
                className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${currentApp.color} text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {t('realWorld.next')}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 p-8 rounded-2xl shadow-2xl text-white">
          <div className="flex items-center gap-4 mb-4">
            <Lightbulb className="w-10 h-10" />
            <h3 className="text-2xl font-bold">{t('realWorld.keyTakeaway')}</h3>
          </div>
          <p className="text-lg leading-relaxed">
            {t('realWorld.keyTakeawayText')}
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
