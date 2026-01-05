import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
  ReactNode,
} from "react";
import translationsData from "../locales/translation.json";
import { Lightbulb } from 'lucide-react';

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
const translations: Translations = translationsData as unknown as Translations;

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
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedDemo, setSelectedDemo] = useState<'basic' | 'properties' | 'interactive'>('basic');
  const [objectDistance, setObjectDistance] = useState<number>(150);
  const [objectType, setObjectType] = useState<'candle' | 'person' | 'flower' | 'ball'>('candle');
  const [showRayDiagram, setShowRayDiagram] = useState<boolean>(true);
  const [showMeasurements, setShowMeasurements] = useState<boolean>(true);
  const [showConstructionLines, setShowConstructionLines] = useState<boolean>(true);
  const [isAnimating, _setIsAnimating] = useState<boolean>(true);
  const animationFrameRef = useRef<number>();

  // Draw arrow with label
  const drawArrow = (
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    color: string,
    label?: string
  ) => {
    const headLength = 8;
    const angle = Math.atan2(toY - fromY, toX - fromX);

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2;

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

    // Draw label
    if (label) {
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      const midX = (fromX + toX) / 2;
      const midY = (fromY + toY) / 2;
      ctx.fillText(label, midX, midY - 5);
    }
  };

  // Draw candle
  const drawCandle = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    height: number,
    isImage: boolean = false
  ) => {
    const width = height * 0.3;
    const flameHeight = height * 0.3;

    // Draw candle body
    const gradient = ctx.createLinearGradient(x - width / 2, y, x + width / 2, y);
    if (isImage) {
      gradient.addColorStop(0, 'rgba(239, 68, 68, 0.5)');
      gradient.addColorStop(0.5, 'rgba(220, 38, 38, 0.5)');
      gradient.addColorStop(1, 'rgba(185, 28, 28, 0.5)');
      ctx.setLineDash([5, 3]);
    } else {
      gradient.addColorStop(0, '#ef4444');
      gradient.addColorStop(0.5, '#dc2626');
      gradient.addColorStop(1, '#b91c1c');
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x - width / 2, y, width, height);

    if (!isImage) {
      // Add candle highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(x - width / 2 + 2, y + 5, 3, height - 10);
    }

    // Draw wick
    ctx.strokeStyle = isImage ? 'rgba(51, 51, 51, 0.5)' : '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - flameHeight * 0.3);
    ctx.stroke();

    // Draw flame
    const time = Date.now();
    const flicker = Math.sin(time / 200) * 2;
    
    if (isImage) {
      ctx.globalAlpha = 0.5;
    }

    // Outer flame (orange)
    ctx.fillStyle = '#ff6b00';
    ctx.beginPath();
    ctx.ellipse(x, y - flameHeight * 0.5 + flicker, flameHeight * 0.3, flameHeight * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Inner flame (yellow)
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.ellipse(x, y - flameHeight * 0.4 + flicker, flameHeight * 0.2, flameHeight * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();

    // Flame glow
    if (!isImage) {
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#ff6b00';
      ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
      ctx.beginPath();
      ctx.ellipse(x, y - flameHeight * 0.5 + flicker, flameHeight * 0.5, flameHeight * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    ctx.globalAlpha = 1;
    ctx.setLineDash([]);
  };

  // Draw person
  const drawPerson = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    height: number,
    isImage: boolean = false
  ) => {
    const headRadius = height * 0.15;
    const bodyHeight = height * 0.4;
    const legHeight = height * 0.3;

    if (isImage) {
      ctx.globalAlpha = 0.5;
      ctx.setLineDash([5, 3]);
    }

    // Draw head
    ctx.fillStyle = isImage ? 'rgba(251, 191, 36, 0.5)' : '#fbbf24';
    ctx.strokeStyle = isImage ? 'rgba(217, 119, 6, 0.5)' : '#d97706';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y - height + headRadius, headRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Draw body
    ctx.strokeStyle = isImage ? 'rgba(59, 130, 246, 0.5)' : '#3b82f6';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x, y - height + headRadius * 2);
    ctx.lineTo(x, y - height + headRadius * 2 + bodyHeight);
    ctx.stroke();

    // Draw arms
    ctx.beginPath();
    ctx.moveTo(x - bodyHeight * 0.5, y - height + headRadius * 2 + bodyHeight * 0.3);
    ctx.lineTo(x, y - height + headRadius * 2 + bodyHeight * 0.3);
    ctx.lineTo(x + bodyHeight * 0.5, y - height + headRadius * 2 + bodyHeight * 0.3);
    ctx.stroke();

    // Draw legs
    const legStartY = y - height + headRadius * 2 + bodyHeight;
    ctx.beginPath();
    ctx.moveTo(x, legStartY);
    ctx.lineTo(x - legHeight * 0.3, y);
    ctx.moveTo(x, legStartY);
    ctx.lineTo(x + legHeight * 0.3, y);
    ctx.stroke();

    ctx.globalAlpha = 1;
    ctx.setLineDash([]);
  };

  // Draw flower
  const drawFlower = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    height: number,
    isImage: boolean = false
  ) => {
    const petalRadius = height * 0.15;
    const centerRadius = height * 0.1;

    if (isImage) {
      ctx.globalAlpha = 0.5;
      ctx.setLineDash([5, 3]);
    }

    // Draw stem
    ctx.strokeStyle = isImage ? 'rgba(34, 197, 94, 0.5)' : '#22c55e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - height * 0.6);
    ctx.stroke();

    // Draw petals
    const petalPositions = [
      { x: 0, y: -petalRadius * 1.5 },
      { x: petalRadius * 1.5, y: 0 },
      { x: 0, y: petalRadius * 1.5 },
      { x: -petalRadius * 1.5, y: 0 },
      { x: petalRadius, y: -petalRadius },
      { x: petalRadius, y: petalRadius },
      { x: -petalRadius, y: petalRadius },
      { x: -petalRadius, y: -petalRadius },
    ];

    ctx.fillStyle = isImage ? 'rgba(236, 72, 153, 0.5)' : '#ec4899';
    petalPositions.forEach(pos => {
      ctx.beginPath();
      ctx.arc(x + pos.x, y - height + centerRadius + pos.y, petalRadius, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw center
    ctx.fillStyle = isImage ? 'rgba(251, 191, 36, 0.5)' : '#fbbf24';
    ctx.beginPath();
    ctx.arc(x, y - height + centerRadius, centerRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 1;
    ctx.setLineDash([]);
  };

  // Draw ball
  const drawBall = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    isImage: boolean = false
  ) => {
    if (isImage) {
      ctx.globalAlpha = 0.5;
      ctx.setLineDash([5, 3]);
    }

    // Create gradient for 3D effect
    const gradient = ctx.createRadialGradient(
      x - radius * 0.3,
      y - radius * 0.3,
      radius * 0.1,
      x,
      y,
      radius
    );
    
    if (isImage) {
      gradient.addColorStop(0, 'rgba(96, 165, 250, 0.8)');
      gradient.addColorStop(1, 'rgba(37, 99, 235, 0.5)');
    } else {
      gradient.addColorStop(0, '#60a5fa');
      gradient.addColorStop(1, '#2563eb');
    }

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y - radius, radius, 0, Math.PI * 2);
    ctx.fill();

    // Add highlight
    if (!isImage) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.beginPath();
      ctx.arc(x - radius * 0.4, y - radius - radius * 0.4, radius * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    ctx.setLineDash([]);
  };

  // Draw object based on type
  const drawObject = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    type: string,
    size: number,
    isImage: boolean = false
  ) => {
    switch (type) {
      case 'candle':
        drawCandle(ctx, x, y, size, isImage);
        break;
      case 'person':
        drawPerson(ctx, x, y, size, isImage);
        break;
      case 'flower':
        drawFlower(ctx, x, y, size, isImage);
        break;
      case 'ball':
        drawBall(ctx, x, y, size * 0.4, isImage);
        break;
    }
  };

  // Draw basic demonstration
  const drawBasicDemo = (ctx: CanvasRenderingContext2D, _time: number) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    // Clear canvas
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, width, height);

    // Mirror position
    const mirrorX = width / 2;
    const groundY = height - 100;
    const objectSize = 100;
    const objectX = mirrorX - objectDistance;

    // Draw ground line
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(width, groundY);
    ctx.stroke();

    // Draw mirror
    const mirrorHeight = 300;
    const mirrorY = groundY - mirrorHeight;

    // Mirror surface
    const mirrorGradient = ctx.createLinearGradient(mirrorX - 5, mirrorY, mirrorX + 5, mirrorY + mirrorHeight);
    mirrorGradient.addColorStop(0, 'rgba(147, 197, 253, 0.3)');
    mirrorGradient.addColorStop(0.5, 'rgba(96, 165, 250, 0.5)');
    mirrorGradient.addColorStop(1, 'rgba(147, 197, 253, 0.3)');
    ctx.fillStyle = mirrorGradient;
    ctx.fillRect(mirrorX - 5, mirrorY, 10, mirrorHeight);

    // Mirror border
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(mirrorX, mirrorY);
    ctx.lineTo(mirrorX, groundY);
    ctx.stroke();

    // Mirror label
    ctx.fillStyle = '#60a5fa';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('MIRROR', mirrorX, mirrorY - 20);

    // Draw construction lines (perpendicular to mirror)
    if (showConstructionLines) {
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.3)';
      ctx.lineWidth = 1;
      
      // Top point construction
      ctx.beginPath();
      ctx.moveTo(objectX, groundY - objectSize);
      ctx.lineTo(mirrorX + objectDistance, groundY - objectSize);
      ctx.stroke();

      // Bottom point construction
      ctx.beginPath();
      ctx.moveTo(objectX, groundY);
      ctx.lineTo(mirrorX + objectDistance, groundY);
      ctx.stroke();

      ctx.setLineDash([]);
    }

    // Draw ray diagram
    if (showRayDiagram) {
      const rays = [
        { fromY: groundY - objectSize, toY: groundY - objectSize },
        { fromY: groundY - objectSize * 0.5, toY: groundY - objectSize * 0.5 },
      ];

      rays.forEach((ray) => {
        // Incident ray
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(objectX, ray.fromY);
        ctx.lineTo(mirrorX, ray.fromY);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Draw small arrow
        const arrowSize = 8;
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(mirrorX - 5, ray.fromY);
        ctx.lineTo(mirrorX - 5 - arrowSize, ray.fromY - arrowSize / 2);
        ctx.lineTo(mirrorX - 5 - arrowSize, ray.fromY + arrowSize / 2);
        ctx.closePath();
        ctx.fill();

        // Reflected ray (dashed, going behind mirror)
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = '#10b981';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#10b981';
        ctx.beginPath();
        ctx.moveTo(mirrorX, ray.toY);
        ctx.lineTo(mirrorX + objectDistance, ray.toY);
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.setLineDash([]);

        // Draw small arrow for reflected ray
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.moveTo(mirrorX + objectDistance - 10, ray.toY);
        ctx.lineTo(mirrorX + objectDistance - 10 - arrowSize, ray.toY - arrowSize / 2);
        ctx.lineTo(mirrorX + objectDistance - 10 - arrowSize, ray.toY + arrowSize / 2);
        ctx.closePath();
        ctx.fill();
      });
    }

    // Draw object
    drawObject(ctx, objectX, groundY, objectType, objectSize, false);

    // Draw image (behind mirror)
    const imageX = mirrorX + objectDistance;
    drawObject(ctx, imageX, groundY, objectType, objectSize, true);

    // Draw measurements
    if (showMeasurements) {
      // Object distance
      drawArrow(ctx, objectX, groundY + 40, mirrorX - 10, groundY + 40, '#fbbf24', `${objectDistance} cm`);

      // Image distance
      drawArrow(ctx, mirrorX + 10, groundY + 40, imageX, groundY + 40, '#a78bfa', `${objectDistance} cm`);

      // Equal sign between distances
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('=', mirrorX, groundY + 70);
    }

    // Draw labels
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('OBJECT', objectX, groundY + 20);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillText('IMAGE', imageX, groundY + 20);

    // Info box
    drawInfoBox(ctx, width, height, 'basic');
  };

  // Draw properties demonstration
  const drawPropertiesDemo = (ctx: CanvasRenderingContext2D, time: number) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, width, height);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(t('planeMirrorLearn.canvas.propertiesTitle'), width / 2, 40);

    const propertyBoxes = [
      {
        x: width * 0.15,
        y: 100,
        title: '1. ' + t('planeMirrorLearn.canvas.properties.virtualImage.title'),
        description: t('planeMirrorLearn.canvas.properties.virtualImage.description'),
        icon: '🔮'
      },
      {
        x: width * 0.5,
        y: 100,
        title: '2. ' + t('planeMirrorLearn.canvas.properties.sameSize.title'),
        description: t('planeMirrorLearn.canvas.properties.sameSize.description'),
        icon: '📏'
      },
      {
        x: width * 0.85,
        y: 100,
        title: '3. ' + t('planeMirrorLearn.canvas.properties.equalDistance.title'),
        description: t('planeMirrorLearn.canvas.properties.equalDistance.description'),
        icon: '↔️'
      },
      {
        x: width * 0.25,
        y: 320,
        title: '4. ' + t('planeMirrorLearn.canvas.properties.laterallyInverted.title'),
        description: t('planeMirrorLearn.canvas.properties.laterallyInverted.description'),
        icon: '🔄'
      },
      {
        x: width * 0.75,
        y: 320,
        title: '5. ' + t('planeMirrorLearn.canvas.properties.upright.title'),
        description: t('planeMirrorLearn.canvas.properties.upright.description'),
        icon: '⬆️'
      }
    ];

    propertyBoxes.forEach((box, index) => {
      const boxWidth = 220;
      const boxHeight = 180;
      const boxX = box.x - boxWidth / 2;
      const boxY = box.y;

      // Animated appearance
      const animDelay = index * 200;
      const animProgress = Math.min(1, Math.max(0, (time - animDelay) / 500));
      const currentY = boxY + (1 - animProgress) * 50;
      const currentAlpha = animProgress;

      ctx.globalAlpha = currentAlpha;

      // Box background
      ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
      ctx.fillRect(boxX, currentY, boxWidth, boxHeight);

      // Box border with gradient
      const borderGradient = ctx.createLinearGradient(boxX, currentY, boxX + boxWidth, currentY + boxHeight);
      borderGradient.addColorStop(0, '#3b82f6');
      borderGradient.addColorStop(1, '#8b5cf6');
      ctx.strokeStyle = borderGradient;
      ctx.lineWidth = 3;
      ctx.strokeRect(boxX, currentY, boxWidth, boxHeight);

      // Icon
      ctx.font = '36px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(box.icon, box.x, currentY + 50);

      // Title
      ctx.fillStyle = '#60a5fa';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(box.title, box.x, currentY + 90);

      // Description
      ctx.fillStyle = '#94a3b8';
      ctx.font = '13px Arial';
      
      const words = box.description.split(' ');
      let line = '';
      let lineY = currentY + 115;
      const maxWidth = boxWidth - 20;

      words.forEach((word) => {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && line !== '') {
          ctx.fillText(line, box.x, lineY);
          line = word + ' ';
          lineY += 18;
        } else {
          line = testLine;
        }
      });
      ctx.fillText(line, box.x, lineY);

      ctx.globalAlpha = 1;
    });

    // Visual demonstration at bottom
    const demoY = height - 150;
    const mirrorX = width / 2;

    // Draw mirror
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(mirrorX, demoY - 60);
    ctx.lineTo(mirrorX, demoY + 60);
    ctx.stroke();

    // Draw text "AMBULANCE" on left (object)
    ctx.save();
    ctx.translate(mirrorX - 100, demoY);
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('AMBULANCE', 0, 0);
    ctx.restore();

    // Draw laterally inverted text on right (image)
    ctx.save();
    ctx.translate(mirrorX + 100, demoY);
    ctx.scale(-1, 1);
    ctx.fillStyle = 'rgba(239, 68, 68, 0.5)';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('AMBULANCE', 0, 0);
    ctx.restore();

    // Labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Object', mirrorX - 100, demoY + 30);
    ctx.fillText('Image (Laterally Inverted)', mirrorX + 100, demoY + 30);
  };

  // Draw interactive demonstration
  const drawInteractiveDemo = (ctx: CanvasRenderingContext2D, _time: number) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, width, height);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Interactive Mirror Demo - Move the Object!', width / 2, 40);

    const mirrorX = width / 2;
    const groundY = height - 100;
    const objectSize = 80;
    const objectX = mirrorX - objectDistance;

    // Draw ground
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(width, groundY);
    ctx.stroke();

    // Draw mirror
    const mirrorHeight = 280;
    const mirrorY = groundY - mirrorHeight;

    ctx.fillStyle = 'rgba(96, 165, 250, 0.2)';
    ctx.fillRect(mirrorX - 8, mirrorY, 16, mirrorHeight);

    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 5;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#60a5fa';
    ctx.beginPath();
    ctx.moveTo(mirrorX, mirrorY);
    ctx.lineTo(mirrorX, groundY);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw grid for reference
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 50; i < width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }

    // Draw rays
    if (showRayDiagram) {
      const rayPoints = [
        { y: groundY - objectSize },
        { y: groundY - objectSize * 0.5 },
      ];

      rayPoints.forEach(point => {
        // Incident ray
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(objectX, point.y);
        ctx.lineTo(mirrorX, point.y);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Virtual ray (behind mirror)
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = '#10b981';
        ctx.globalAlpha = 0.6;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#10b981';
        ctx.beginPath();
        ctx.moveTo(mirrorX, point.y);
        ctx.lineTo(mirrorX + objectDistance, point.y);
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
        ctx.setLineDash([]);
      });
    }

    // Draw object
    drawObject(ctx, objectX, groundY, objectType, objectSize, false);

    // Draw image
    const imageX = mirrorX + objectDistance;
    drawObject(ctx, imageX, groundY, objectType, objectSize, true);

    // Draw distance indicators
    if (showMeasurements) {
      // Object distance
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(objectX, groundY + 50);
      ctx.lineTo(mirrorX - 5, groundY + 50);
      ctx.stroke();

      // Arrows
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.moveTo(objectX, groundY + 50);
      ctx.lineTo(objectX + 8, groundY + 45);
      ctx.lineTo(objectX + 8, groundY + 55);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(mirrorX - 5, groundY + 50);
      ctx.lineTo(mirrorX - 13, groundY + 45);
      ctx.lineTo(mirrorX - 13, groundY + 55);
      ctx.closePath();
      ctx.fill();

      // Distance text
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${objectDistance} cm`, (objectX + mirrorX) / 2, groundY + 45);

      // Image distance
      ctx.strokeStyle = '#a78bfa';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(mirrorX + 5, groundY + 50);
      ctx.lineTo(imageX, groundY + 50);
      ctx.stroke();

      ctx.fillStyle = '#a78bfa';
      ctx.beginPath();
      ctx.moveTo(mirrorX + 5, groundY + 50);
      ctx.lineTo(mirrorX + 13, groundY + 45);
      ctx.lineTo(mirrorX + 13, groundY + 55);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(imageX, groundY + 50);
      ctx.lineTo(imageX - 8, groundY + 45);
      ctx.lineTo(imageX - 8, groundY + 55);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#a78bfa';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${objectDistance} cm`, (mirrorX + imageX) / 2, groundY + 45);
    }

    // Labels
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(t('planeMirrorLearn.canvas.object'), objectX, groundY + 80);
    ctx.fillText(t('planeMirrorLearn.canvas.real'), objectX, groundY + 95);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillText(t('planeMirrorLearn.canvas.image'), imageX, groundY + 80);
    ctx.fillText(t('planeMirrorLearn.canvas.virtual'), imageX, groundY + 95);

    // Draw info box
    drawInfoBox(ctx, width, height, 'interactive');
  };

  const drawInfoBox = (ctx: CanvasRenderingContext2D, _width: number, _height: number, mode: string) => {
    const boxX = 20;
    const boxY = 70;
    const boxWidth = 280;
    const boxHeight = mode === 'basic' ? 130 : 100;

    ctx.fillStyle = 'rgba(30, 41, 59, 0.95)';
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

    ctx.fillStyle = '#60a5fa';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(t('planeMirrorLearn.canvas.keyPoints'), boxX + 10, boxY + 25);

    ctx.font = '13px Arial';
    ctx.fillStyle = '#94a3b8';
    
    if (mode === 'basic') {
      ctx.fillText(t('planeMirrorLearn.canvas.basicPoints.point1'), boxX + 10, boxY + 50);
      ctx.fillText(t('planeMirrorLearn.canvas.basicPoints.point2'), boxX + 10, boxY + 70);
      ctx.fillText(t('planeMirrorLearn.canvas.basicPoints.point3'), boxX + 10, boxY + 90);
      ctx.fillText(t('planeMirrorLearn.canvas.basicPoints.point4'), boxX + 10, boxY + 110);
    } else if (mode === 'interactive') {
      ctx.fillText(t('planeMirrorLearn.canvas.interactivePoints.point1'), boxX + 10, boxY + 50);
      ctx.fillText(t('planeMirrorLearn.canvas.interactivePoints.point2'), boxX + 10, boxY + 70);
      ctx.fillText(t('planeMirrorLearn.canvas.interactivePoints.point3'), boxX + 10, boxY + 90);
    }
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

      if (selectedDemo === 'basic') {
        drawBasicDemo(ctx, currentTime);
      } else if (selectedDemo === 'properties') {
        drawPropertiesDemo(ctx, currentTime);
      } else if (selectedDemo === 'interactive') {
        drawInteractiveDemo(ctx, currentTime);
      }

      if (isAnimating) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [selectedDemo, objectDistance, objectType, showRayDiagram, showMeasurements, showConstructionLines, isAnimating]);

  return (
    <div style={{ 
      backgroundColor: '#0f172a', 
      minHeight: '100vh', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ 
          color: '#ffffff', 
          fontSize: '36px', 
          marginBottom: '10px',
          textShadow: '0 0 20px rgba(96, 165, 250, 0.5)'
        }}>
          {t('planeMirrorLearn.title')}
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '18px' }}>
          {t('planeMirrorLearn.subtitle')}
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
          onClick={() => setSelectedDemo('basic')}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: selectedDemo === 'basic' ? '#3b82f6' : '#1e293b',
            color: '#ffffff',
            border: selectedDemo === 'basic' ? '2px solid #60a5fa' : '2px solid #334155',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s',
            fontWeight: 'bold'
          }}
        >
          {t('planeMirrorLearn.demos.basic')}
        </button>
        <button
          onClick={() => setSelectedDemo('properties')}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: selectedDemo === 'properties' ? '#3b82f6' : '#1e293b',
            color: '#ffffff',
            border: selectedDemo === 'properties' ? '2px solid #60a5fa' : '2px solid #334155',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s',
            fontWeight: 'bold'
          }}
        >
          {t('planeMirrorLearn.demos.properties')}
        </button>
        <button
          onClick={() => setSelectedDemo('interactive')}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: selectedDemo === 'interactive' ? '#3b82f6' : '#1e293b',
            color: '#ffffff',
            border: selectedDemo === 'interactive' ? '2px solid #60a5fa' : '2px solid #334155',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s',
            fontWeight: 'bold'
          }}
        >
          {t('planeMirrorLearn.demos.interactive')}
        </button>
      </div>

      {/* Canvas */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginBottom: '25px' 
      }}>
        <canvas
          ref={canvasRef}
          width={1000}
          height={600}
          style={{
            border: '3px solid #334155',
            borderRadius: '12px',
            boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)',
            backgroundColor: '#0a0a1a'
          }}
        />
      </div>

      {/* Controls */}
      {(selectedDemo === 'basic' || selectedDemo === 'interactive') && (
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          backgroundColor: '#1e293b',
          padding: '25px',
          borderRadius: '12px',
          border: '2px solid #334155',
          marginBottom: '25px'
        }}>
          <h3 style={{ color: '#ffffff', marginBottom: '20px' }}>{t('planeMirrorLearn.controls.title')}</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#94a3b8', display: 'block', marginBottom: '8px', fontSize: '14px' }}>
              {t('planeMirrorLearn.controls.objectDistance')}: <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>{objectDistance} cm</span>
            </label>
            <input
              type="range"
              min="80"
              max="250"
              value={objectDistance}
              onChange={(e) => setObjectDistance(Number(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#94a3b8', display: 'block', marginBottom: '8px', fontSize: '14px' }}>
              {t('planeMirrorLearn.controls.objectType')}:
            </label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {['candle', 'person', 'flower', 'ball'].map((type) => (
                <button
                  key={type}
                  onClick={() => setObjectType(type as any)}
                  style={{
                    padding: '8px 16px',
                    fontSize: '14px',
                    backgroundColor: objectType === type ? '#3b82f6' : '#334155',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {type === 'candle' && '🕯️'} {type === 'person' && '🧍'} {type === 'flower' && '🌸'} {type === 'ball' && '⚽'} {t(`planeMirrorLearn.controls.${type}`)}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <label style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={showRayDiagram}
                onChange={(e) => setShowRayDiagram(e.target.checked)}
                style={{ marginRight: '8px', cursor: 'pointer' }}
              />
              {t('planeMirrorLearn.controls.showRayDiagram')}
            </label>
            <label style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={showMeasurements}
                onChange={(e) => setShowMeasurements(e.target.checked)}
                style={{ marginRight: '8px', cursor: 'pointer' }}
              />
              {t('planeMirrorLearn.controls.showMeasurements')}
            </label>
            <label style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={showConstructionLines}
                onChange={(e) => setShowConstructionLines(e.target.checked)}
                style={{ marginRight: '8px', cursor: 'pointer' }}
              />
              {t('planeMirrorLearn.controls.showConstructionLines')}
            </label>
          </div>
        </div>
      )}

      {/* Educational Content */}
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        backgroundColor: '#1e293b',
        padding: '25px',
        borderRadius: '12px',
        border: '2px solid #334155'
      }}>
        <h3 style={{ color: '#ffffff', marginBottom: '15px' }}>{t('planeMirrorLearn.content.title')}</h3>
        
        <div style={{ color: '#94a3b8', lineHeight: '1.8' }}>
          <p style={{ marginBottom: '12px' }}>
            <strong style={{ color: '#60a5fa' }}>{t('planeMirrorLearn.content.howImagesForm')}</strong> {t('planeMirrorLearn.content.howImagesFormText')}
          </p>

          <p style={{ marginBottom: '12px' }}>
            <strong style={{ color: '#10b981' }}>{t('planeMirrorLearn.content.imageCharacteristics')}</strong>
          </p>
          <ul style={{ marginLeft: '20px', marginBottom: '12px' }}>
            <li><strong>{t('planeMirrorLearn.content.characteristics.virtual')}</strong></li>
            <li><strong>{t('planeMirrorLearn.content.characteristics.erect')}</strong></li>
            <li><strong>{t('planeMirrorLearn.content.characteristics.sameSize')}</strong></li>
            <li><strong>{t('planeMirrorLearn.content.characteristics.equalDistance')}</strong></li>
            <li><strong>{t('planeMirrorLearn.content.characteristics.laterallyInverted')}</strong></li>
          </ul>

          <p style={{ marginBottom: '12px' }}>
            <strong style={{ color: '#fbbf24' }}>{t('planeMirrorLearn.content.formula')}</strong> {t('planeMirrorLearn.content.formulaText')}
          </p>

          <p>
            <strong style={{ color: '#ec4899' }}>{t('planeMirrorLearn.content.realLifeExamples')}</strong> {t('planeMirrorLearn.content.realLifeExamplesText')}
          </p>
        </div>
      </div>
    </div>
  );
};

// Practice Mode Component
interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const PracticeMode: React.FC = () => {
  const { t, tValue } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [quizComplete, setQuizComplete] = useState<boolean>(false);
  const animationFrameRef = useRef<number>();

  // Practice Questions - Load from translations
  const questionsData = tValue('planeMirrorPractice.questions') as any[];
  const questions: Question[] = questionsData.map((q: any) => ({
    id: q.id,
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
    difficulty: q.difficulty as 'easy' | 'medium' | 'hard'
  }));

  // Draw arrow head helper
  const drawArrowHead = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    pointLeft: boolean,
    color: string
  ) => {
    const size = 8;
    const direction = pointLeft ? -1 : 1;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - direction * size, y - size / 2);
    ctx.lineTo(x - direction * size, y + size / 2);
    ctx.closePath();
    ctx.fill();
  };

  // Draw candle
  const drawCandle = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    height: number,
    isImage: boolean = false
  ) => {
    const width = height * 0.3;
    const flameHeight = height * 0.3;

    if (isImage) {
      ctx.globalAlpha = 0.5;
      ctx.setLineDash([5, 3]);
    }

    // Candle body
    ctx.fillStyle = isImage ? 'rgba(239, 68, 68, 0.5)' : '#ef4444';
    ctx.fillRect(x - width / 2, y, width, height);

    if (!isImage) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(x - width / 2 + 2, y + 5, 3, height - 10);
    }

    // Wick
    ctx.strokeStyle = isImage ? 'rgba(51, 51, 51, 0.5)' : '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - flameHeight * 0.3);
    ctx.stroke();

    // Flame
    const time = Date.now();
    const flicker = Math.sin(time / 200) * 2;

    ctx.fillStyle = isImage ? 'rgba(255, 107, 0, 0.5)' : '#ff6b00';
    ctx.beginPath();
    ctx.ellipse(x, y - flameHeight * 0.5 + flicker, flameHeight * 0.3, flameHeight * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = isImage ? 'rgba(255, 215, 0, 0.5)' : '#ffd700';
    ctx.beginPath();
    ctx.ellipse(x, y - flameHeight * 0.4 + flicker, flameHeight * 0.2, flameHeight * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();

    if (!isImage) {
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#ff6b00';
      ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
      ctx.beginPath();
      ctx.ellipse(x, y - flameHeight * 0.5 + flicker, flameHeight * 0.5, flameHeight * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    ctx.globalAlpha = 1;
    ctx.setLineDash([]);
  };

  // Draw clock
  const drawClock = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    hour: number,
    minute: number,
    isImage: boolean
  ) => {
    if (isImage) {
      ctx.globalAlpha = 0.5;
      ctx.setLineDash([5, 3]);
    }

    // Clock face
    ctx.fillStyle = isImage ? 'rgba(255, 255, 255, 0.1)' : '#ffffff';
    ctx.strokeStyle = isImage ? 'rgba(51, 51, 51, 0.5)' : '#333333';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Hour markers
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30 - 90) * Math.PI / 180;
      const startX = x + Math.cos(angle) * (radius - 10);
      const startY = y + Math.sin(angle) * (radius - 10);
      const endX = x + Math.cos(angle) * (radius - 5);
      const endY = y + Math.sin(angle) * (radius - 5);

      ctx.strokeStyle = isImage ? 'rgba(51, 51, 51, 0.5)' : '#333333';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }

    // Hour hand
    const hourAngle = ((hour % 12) * 30 + minute * 0.5 - 90) * Math.PI / 180;
    ctx.strokeStyle = isImage ? 'rgba(239, 68, 68, 0.5)' : '#ef4444';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(hourAngle) * (radius * 0.5), y + Math.sin(hourAngle) * (radius * 0.5));
    ctx.stroke();

    // Minute hand
    const minuteAngle = (minute * 6 - 90) * Math.PI / 180;
    ctx.strokeStyle = isImage ? 'rgba(59, 130, 246, 0.5)' : '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(minuteAngle) * (radius * 0.7), y + Math.sin(minuteAngle) * (radius * 0.7));
    ctx.stroke();

    // Center dot
    ctx.fillStyle = isImage ? 'rgba(51, 51, 51, 0.5)' : '#333333';
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 1;
    ctx.setLineDash([]);
  };

  // Draw hand
  const drawHand = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    side: 'left' | 'right',
    isImage: boolean
  ) => {
    if (isImage) {
      ctx.globalAlpha = 0.5;
      ctx.setLineDash([5, 3]);
    }

    const armLength = 50;
    const handWidth = 20;
    const direction = side === 'right' ? 1 : -1;

    // Arm
    ctx.strokeStyle = isImage ? 'rgba(251, 191, 36, 0.5)' : '#fbbf24';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(x, y + 20);
    ctx.lineTo(x + direction * armLength, y - 30);
    ctx.stroke();

    // Hand
    ctx.fillStyle = isImage ? 'rgba(251, 191, 36, 0.5)' : '#fbbf24';
    ctx.beginPath();
    ctx.ellipse(x + direction * armLength, y - 30, handWidth, handWidth * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Fingers
    for (let i = 0; i < 5; i++) {
      const fingerX = x + direction * (armLength + (i - 2) * 6);
      const fingerY = y - 30 - 15;
      ctx.fillStyle = isImage ? 'rgba(251, 191, 36, 0.5)' : '#fbbf24';
      ctx.fillRect(fingerX - 2, fingerY, 4, 15);
    }

    ctx.globalAlpha = 1;
    ctx.setLineDash([]);
  };

  // Draw virtual image demo
  const drawVirtualImageDemo = (ctx: CanvasRenderingContext2D, width: number, height: number, _time: number) => {
    const mirrorX = width / 2;
    const groundY = height - 50;
    const objectX = mirrorX - 120;
    const canvasHeight = 80;

    // Draw mirror
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 6;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#60a5fa';
    ctx.beginPath();
    ctx.moveTo(mirrorX, groundY - 200);
    ctx.lineTo(mirrorX, groundY);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw object (candle)
    drawCandle(ctx, objectX, groundY, canvasHeight, false);

    // Draw virtual image
    const imageX = mirrorX + 120;
    drawCandle(ctx, imageX, groundY, canvasHeight, true);

    // Draw rays
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(objectX, groundY - canvasHeight);
    ctx.lineTo(mirrorX, groundY - canvasHeight);
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = '#10b981';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#10b981';
    ctx.beginPath();
    ctx.moveTo(mirrorX, groundY - canvasHeight);
    ctx.lineTo(imageX, groundY - canvasHeight);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.setLineDash([]);

    // Labels
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('OBJECT (Real)', objectX, groundY + 30);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillText('IMAGE (Virtual)', imageX, groundY + 30);

    // Screen on right side
    const screenX = width - 100;
    ctx.fillStyle = 'rgba(100, 116, 139, 0.3)';
    ctx.fillRect(screenX, groundY - 180, 60, 150);
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 3;
    ctx.strokeRect(screenX, groundY - 180, 60, 150);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Screen', screenX + 30, groundY - 190);
    ctx.fillText('(No image', screenX + 30, groundY - 10);
    ctx.fillText('forms here)', screenX + 30, groundY + 5);
  };

  // Draw distance demo
  const drawDistanceDemo = (ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
    const mirrorX = width / 2;
    const groundY = height - 80;
    const objectDist = 100 + Math.sin(time / 1000) * 50;
    const objectX = mirrorX - objectDist;
    const imageX = mirrorX + objectDist;

    // Draw ground
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(width, groundY);
    ctx.stroke();

    // Draw mirror
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 6;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#60a5fa';
    ctx.beginPath();
    ctx.moveTo(mirrorX, groundY - 180);
    ctx.lineTo(mirrorX, groundY);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw object
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(objectX, groundY - 30, 20, 0, Math.PI * 2);
    ctx.fill();

    // Draw image
    ctx.fillStyle = 'rgba(16, 185, 129, 0.5)';
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(imageX, groundY - 30, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw distance measurements
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(objectX, groundY + 20);
    ctx.lineTo(mirrorX - 5, groundY + 20);
    ctx.stroke();

    drawArrowHead(ctx, objectX, groundY + 20, true, '#fbbf24');
    drawArrowHead(ctx, mirrorX - 5, groundY + 20, false, '#fbbf24');

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.round(objectDist)} cm`, (objectX + mirrorX) / 2, groundY + 15);

    // Image distance
    ctx.strokeStyle = '#a78bfa';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(mirrorX + 5, groundY + 20);
    ctx.lineTo(imageX, groundY + 20);
    ctx.stroke();

    drawArrowHead(ctx, mirrorX + 5, groundY + 20, true, '#a78bfa');
    drawArrowHead(ctx, imageX, groundY + 20, false, '#a78bfa');

    ctx.fillStyle = '#a78bfa';
    ctx.fillText(`${Math.round(objectDist)} cm`, (mirrorX + imageX) / 2, groundY + 15);

    // Equal sign
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('=', mirrorX, groundY + 50);

    // Animated note
    const noteAlpha = (Math.sin(time / 500) + 1) / 2;
    ctx.globalAlpha = 0.5 + noteAlpha * 0.5;
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Distances are ALWAYS equal!', width / 2, 40);
    ctx.globalAlpha = 1;
  };

  // Draw magnification demo
  const drawMagnificationDemo = (ctx: CanvasRenderingContext2D, width: number, height: number, _time: number) => {
    const mirrorX = width / 2;
    const groundY = height - 80;
    const objectHeight = 100;
    const objectX = mirrorX - 120;
    const imageX = mirrorX + 120;

    // Draw mirror
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 6;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#60a5fa';
    ctx.beginPath();
    ctx.moveTo(mirrorX, groundY - 200);
    ctx.lineTo(mirrorX, groundY);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw object (arrow)
    ctx.fillStyle = '#ef4444';
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(objectX, groundY);
    ctx.lineTo(objectX, groundY - objectHeight);
    ctx.stroke();

    // Arrow head
    ctx.beginPath();
    ctx.moveTo(objectX, groundY - objectHeight);
    ctx.lineTo(objectX - 10, groundY - objectHeight + 15);
    ctx.lineTo(objectX + 10, groundY - objectHeight + 15);
    ctx.closePath();
    ctx.fill();

    // Draw image (same size)
    ctx.fillStyle = 'rgba(16, 185, 129, 0.6)';
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.8)';
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(imageX, groundY);
    ctx.lineTo(imageX, groundY - objectHeight);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(imageX, groundY - objectHeight);
    ctx.lineTo(imageX - 10, groundY - objectHeight + 15);
    ctx.lineTo(imageX + 10, groundY - objectHeight + 15);
    ctx.closePath();
    ctx.fill();
    ctx.setLineDash([]);

    // Height measurements
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    
    ctx.beginPath();
    ctx.moveTo(objectX - 30, groundY);
    ctx.lineTo(objectX - 30, groundY - objectHeight);
    ctx.stroke();
    drawArrowHead(ctx, objectX - 30, groundY, true, '#fbbf24');
    drawArrowHead(ctx, objectX - 30, groundY - objectHeight, false, '#fbbf24');

    ctx.save();
    ctx.translate(objectX - 45, groundY - objectHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`h = ${objectHeight} cm`, 0, 0);
    ctx.restore();

    // Image height
    ctx.strokeStyle = '#a78bfa';
    ctx.beginPath();
    ctx.moveTo(imageX + 30, groundY);
    ctx.lineTo(imageX + 30, groundY - objectHeight);
    ctx.stroke();
    drawArrowHead(ctx, imageX + 30, groundY, true, '#a78bfa');
    drawArrowHead(ctx, imageX + 30, groundY - objectHeight, false, '#a78bfa');

    ctx.save();
    ctx.translate(imageX + 45, groundY - objectHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#a78bfa';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`h' = ${objectHeight} cm`, 0, 0);
    ctx.restore();

    // Magnification formula
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Magnification = h\' / h = 1', width / 2, 40);
  };

  // Draw lateral inversion demo
  const drawLateralInversionDemo = (ctx: CanvasRenderingContext2D, width: number, height: number, _time: number) => {
    const mirrorX = width / 2;
    const centerY = height / 2;

    // Draw mirror
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 6;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#60a5fa';
    ctx.beginPath();
    ctx.moveTo(mirrorX, centerY - 150);
    ctx.lineTo(mirrorX, centerY + 150);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw hand on left (object)
    const handX = mirrorX - 120;
    drawHand(ctx, handX, centerY, 'right', false);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Raising RIGHT hand', handX, centerY + 80);

    // Draw hand on right (image - laterally inverted)
    const imageX = mirrorX + 120;
    drawHand(ctx, imageX, centerY, 'left', true);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillText('Image raises LEFT hand', imageX, centerY + 80);

    // Curved arrow showing inversion
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(mirrorX, centerY - 100, 80, 0, Math.PI);
    ctx.stroke();
    ctx.setLineDash([]);

    // Label
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 18px Arial';
    ctx.fillText('Lateral Inversion', mirrorX, centerY - 190);
  };

  // Draw clock demo
  const drawClockDemo = (ctx: CanvasRenderingContext2D, width: number, height: number, _time: number) => {
    const mirrorX = width / 2;
    const centerY = height / 2;
    const clockRadius = 80;

    // Draw mirror
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 6;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#60a5fa';
    ctx.beginPath();
    ctx.moveTo(mirrorX, centerY - 150);
    ctx.lineTo(mirrorX, centerY + 150);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Real clock (3:00)
    const realClockX = mirrorX - 150;
    drawClock(ctx, realClockX, centerY, clockRadius, 3, 0, false);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Actual: 3:00', realClockX, centerY + clockRadius + 30);

    // Mirror image clock (9:00)
    const imageClockX = mirrorX + 150;
    drawClock(ctx, imageClockX, centerY, clockRadius, 9, 0, true);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillText('Mirror: 9:00', imageClockX, centerY + clockRadius + 30);
  };

  // Main draw function
  const drawPracticeMode = (ctx: CanvasRenderingContext2D, time: number) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, width, height);
    
    // Visual demonstration based on question
    if (currentQuestion === 1 || currentQuestion === 0) {
      drawVirtualImageDemo(ctx, width, height, time);
    } else if (currentQuestion === 2 || currentQuestion === 4) {
      drawDistanceDemo(ctx, width, height, time);
    } else if (currentQuestion === 3 || currentQuestion === 7) {
      drawMagnificationDemo(ctx, width, height, time);
    } else if (currentQuestion === 6 || currentQuestion === 8) {
      drawLateralInversionDemo(ctx, width, height, time);
    } else {
      drawClockDemo(ctx, width, height, time);
    }
  };

  // Handle answer selection
  const handleAnswerSelect = (answerIndex: number) => {
    if (answeredQuestions.has(currentQuestion)) return;

    setSelectedAnswer(answerIndex);
    setShowExplanation(true);

    const isCorrect = answerIndex === questions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }

    setAnsweredQuestions(new Set([...answeredQuestions, currentQuestion]));
  };

  // Next question
  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizComplete(true);
    }
  };

  // Reset quiz
  const handleResetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setAnsweredQuestions(new Set());
    setQuizComplete(false);
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
      drawPracticeMode(ctx, currentTime);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [currentQuestion]);

  const question = questions[currentQuestion];

  return (
    <div style={{ 
      backgroundColor: '#0f172a', 
      minHeight: '100vh', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ 
          color: '#ffffff', 
          fontSize: '36px', 
          marginBottom: '10px',
          textShadow: '0 0 20px rgba(96, 165, 250, 0.5)'
        }}>
          📝 Plane Mirror - Practice Mode
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '18px' }}>
          Test your knowledge with interactive questions
        </p>
      </div>

      {/* Canvas */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginBottom: '25px' 
      }}>
        <canvas
          ref={canvasRef}
          width={1000}
          height={500}
          style={{
            border: '3px solid #334155',
            borderRadius: '12px',
            boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)',
            backgroundColor: '#0a0a1a'
          }}
        />
      </div>

      {/* Quiz Content */}
      {!quizComplete ? (
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          backgroundColor: '#1e293b',
          padding: '30px',
          borderRadius: '12px',
          border: '2px solid #334155'
        }}>
          {/* Progress */}
          <div style={{ marginBottom: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: '#94a3b8', fontSize: '14px' }}>
                {t('planeMirrorPractice.progress.question')} {currentQuestion + 1} {t('planeMirrorPractice.progress.of')} {questions.length}
              </span>
              <span style={{ color: '#10b981', fontSize: '14px', fontWeight: 'bold' }}>
                {t('planeMirrorPractice.progress.score')}: {score}/{questions.length}
              </span>
            </div>
            <div style={{ 
              width: '100%', 
              height: '8px', 
              backgroundColor: '#334155', 
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                height: '100%',
                backgroundColor: '#3b82f6',
                transition: 'width 0.3s'
              }} />
            </div>
          </div>

          {/* Question */}
          <div style={{ marginBottom: '25px' }}>
            <div style={{ 
              display: 'inline-block',
              padding: '4px 12px',
              backgroundColor: question.difficulty === 'easy' ? '#10b981' : question.difficulty === 'medium' ? '#f59e0b' : '#ef4444',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#ffffff',
              marginBottom: '15px',
              textTransform: 'uppercase'
            }}>
              {t(`planeMirrorPractice.difficulty.${question.difficulty}`)}
            </div>
            <h3 style={{ color: '#ffffff', fontSize: '22px', lineHeight: '1.6' }}>
              {question.question}
            </h3>
          </div>

          {/* Options */}
          <div style={{ marginBottom: '25px' }}>
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === question.correctAnswer;
              const showResult = showExplanation;

              let backgroundColor = '#334155';
              let borderColor = '#475569';
              let textColor = '#ffffff';

              if (showResult) {
                if (isCorrect) {
                  backgroundColor = 'rgba(16, 185, 129, 0.2)';
                  borderColor = '#10b981';
                } else if (isSelected && !isCorrect) {
                  backgroundColor = 'rgba(239, 68, 68, 0.2)';
                  borderColor = '#ef4444';
                }
              } else if (isSelected) {
                backgroundColor = '#3b82f6';
                borderColor = '#60a5fa';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={answeredQuestions.has(currentQuestion)}
                  style={{
                    width: '100%',
                    padding: '15px 20px',
                    marginBottom: '12px',
                    backgroundColor,
                    border: `2px solid ${borderColor}`,
                    borderRadius: '8px',
                    color: textColor,
                    fontSize: '16px',
                    textAlign: 'left',
                    cursor: answeredQuestions.has(currentQuestion) ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <span style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    flexShrink: 0
                  }}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span style={{ flex: 1 }}>{option}</span>
                  {showResult && isCorrect && <span>✓</span>}
                  {showResult && isSelected && !isCorrect && <span>✗</span>}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div style={{
              padding: '20px',
              backgroundColor: selectedAnswer === question.correctAnswer 
                ? 'rgba(16, 185, 129, 0.1)' 
                : 'rgba(239, 68, 68, 0.1)',
              border: `2px solid ${selectedAnswer === question.correctAnswer ? '#10b981' : '#ef4444'}`,
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <h4 style={{ 
                color: selectedAnswer === question.correctAnswer ? '#10b981' : '#ef4444',
                marginBottom: '10px',
                fontSize: '18px'
              }}>
                {selectedAnswer === question.correctAnswer ? t('planeMirrorPractice.feedback.correct') : t('planeMirrorPractice.feedback.incorrect')}
              </h4>
              <p style={{ color: '#94a3b8', lineHeight: '1.6', margin: 0 }}>
                {question.explanation}
              </p>
            </div>
          )}

          {/* Next Button */}
          {showExplanation && (
            <button
              onClick={handleNextQuestion}
              style={{
                width: '100%',
                padding: '15px',
                backgroundColor: '#3b82f6',
                border: 'none',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              {currentQuestion < questions.length - 1 ? t('planeMirrorPractice.buttons.nextQuestion') : t('planeMirrorPractice.buttons.viewResults')}
            </button>
          )}
        </div>
      ) : (
        /* Quiz Complete */
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          backgroundColor: '#1e293b',
          padding: '40px',
          borderRadius: '12px',
          border: '2px solid #334155',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>
            {score === questions.length ? '🏆' : score >= questions.length * 0.7 ? '🎉' : '📚'}
          </div>
          <h2 style={{ color: '#ffffff', fontSize: '32px', marginBottom: '15px' }}>
            {t('planeMirrorPractice.quizComplete.title')}
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '24px', marginBottom: '30px' }}>
            {t('planeMirrorPractice.quizComplete.yourScore')}: <span style={{ color: '#10b981', fontWeight: 'bold' }}>{score}/{questions.length}</span>
          </p>
          <div style={{ 
            width: '100%', 
            maxWidth: '400px', 
            margin: '0 auto 30px',
            height: '12px', 
            backgroundColor: '#334155', 
            borderRadius: '6px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${(score / questions.length) * 100}%`,
              height: '100%',
              backgroundColor: score === questions.length ? '#10b981' : score >= questions.length * 0.7 ? '#3b82f6' : '#f59e0b',
              transition: 'width 0.5s'
            }} />
          </div>
          <p style={{ color: '#94a3b8', marginBottom: '30px', fontSize: '16px' }}>
            {score === questions.length && t('planeMirrorPractice.quizComplete.perfect')}
            {score >= questions.length * 0.7 && score < questions.length && t('planeMirrorPractice.quizComplete.greatJob')}
            {score < questions.length * 0.7 && t('planeMirrorPractice.quizComplete.keepPracticing')}
          </p>
          <button
            onClick={handleResetQuiz}
            style={{
              padding: '15px 40px',
              backgroundColor: '#3b82f6',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            {t('planeMirrorPractice.buttons.tryAgain')}
          </button>
        </div>
      )}
    </div>
  );
};


// Real World Applications Component
const RealWorldMode: React.FC = () => {
  const { t, tValue } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedScenario, setSelectedScenario] = useState<number>(0);
  const animationFrameRef = useRef<number>();

  // Real World Scenarios - Load from translations
  interface RealWorldScenario {
    id: number;
    title: string;
    description: string;
    scenario: string;
    icon: string;
  }

  const scenariosData = tValue('planeMirrorRealWorld.scenarios') as any[];
  const realWorldScenarios: RealWorldScenario[] = scenariosData.map((s: any) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    scenario: s.scenario,
    icon: s.title.split(' ')[0] // Extract emoji from title (first word)
  }));

  // Draw person helper
  const drawPerson = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    height: number,
    isImage: boolean
  ) => {
    const headRadius = height * 0.15;
    const bodyHeight = height * 0.4;

    if (isImage) {
      ctx.globalAlpha = 0.5;
      ctx.setLineDash([5, 3]);
    }

    // Head
    ctx.fillStyle = isImage ? 'rgba(251, 191, 36, 0.5)' : '#fbbf24';
    ctx.strokeStyle = isImage ? 'rgba(217, 119, 6, 0.5)' : '#d97706';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y - height + headRadius, headRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Body
    ctx.strokeStyle = isImage ? 'rgba(59, 130, 246, 0.5)' : '#3b82f6';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x, y - height + headRadius * 2);
    ctx.lineTo(x, y - height + headRadius * 2 + bodyHeight);
    ctx.stroke();

    // Arms
    ctx.beginPath();
    ctx.moveTo(x - bodyHeight * 0.5, y - height + headRadius * 2 + bodyHeight * 0.3);
    ctx.lineTo(x, y - height + headRadius * 2 + bodyHeight * 0.3);
    ctx.lineTo(x + bodyHeight * 0.5, y - height + headRadius * 2 + bodyHeight * 0.3);
    ctx.stroke();

    // Legs
    const legStartY = y - height + headRadius * 2 + bodyHeight;
    ctx.beginPath();
    ctx.moveTo(x, legStartY);
    ctx.lineTo(x - height * 0.1, y);
    ctx.moveTo(x, legStartY);
    ctx.lineTo(x + height * 0.1, y);
    ctx.stroke();

    ctx.globalAlpha = 1;
    ctx.setLineDash([]);
  };

  // Ambulance Scenario
  const drawAmbulanceScenario = (ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
    const carY = height / 2 + 50;
    const ambulanceY = height / 2 + 50;
    const mirrorX = width * 0.3;
    const ambulanceX = width * 0.7 + Math.sin(time / 1000) * 20;

    // Draw road
    ctx.fillStyle = '#374151';
    ctx.fillRect(0, carY + 30, width, 100);

    // Road markings
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.setLineDash([20, 15]);
    ctx.beginPath();
    ctx.moveTo(0, carY + 80);
    ctx.lineTo(width, carY + 80);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw car (viewer's car)
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(mirrorX - 40, carY, 80, 50);
    ctx.fillStyle = '#60a5fa';
    ctx.fillRect(mirrorX - 30, carY + 10, 60, 30);

    // Rear-view mirror
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(mirrorX - 60, carY - 80, 120, 60);
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 3;
    ctx.strokeRect(mirrorX - 60, carY - 80, 120, 60);

    // Mirror surface
    ctx.fillStyle = 'rgba(96, 165, 250, 0.2)';
    ctx.fillRect(mirrorX - 55, carY - 75, 110, 50);

    // Draw ambulance behind
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(ambulanceX - 40, ambulanceY, 80, 50);
    
    // Ambulance windows
    ctx.fillStyle = '#fee2e2';
    ctx.fillRect(ambulanceX - 30, ambulanceY + 10, 60, 30);

    // "AMBULANCE" text on ambulance (backwards)
    ctx.save();
    ctx.translate(ambulanceX, ambulanceY + 25);
    ctx.scale(-1, 1);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('AMBULANCE', 0, 0);
    ctx.restore();

    // Reflection in mirror (correct way)
    const reflectedX = mirrorX - (ambulanceX - mirrorX) * 0.3;
    const reflectedY = carY - 50;
    const reflectionScale = 0.5;

    ctx.globalAlpha = 0.8;
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(
      reflectedX - 40 * reflectionScale,
      reflectedY,
      80 * reflectionScale,
      50 * reflectionScale
    );

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('AMBULANCE', reflectedX, reflectedY + 15);
    ctx.globalAlpha = 1;

    // Labels
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Driver sees "AMBULANCE" correctly in mirror!', width / 2, 40);

    // Arrows showing reflection
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(ambulanceX, ambulanceY);
    ctx.lineTo(reflectedX, reflectedY + 25);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  // Dressing Room Scenario
  const drawDressingRoomScenario = (ctx: CanvasRenderingContext2D, width: number, height: number, _time: number) => {
    const mirrorX = width / 2;
    const groundY = height - 80;
    const personHeight = 160;
    const personX = mirrorX - 120;

    // Draw room
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, width, groundY);

    // Draw floor
    ctx.fillStyle = '#475569';
    ctx.fillRect(0, groundY, width, height - groundY);

    // Draw mirror (full length)
    const mirrorHeight = 250;
    const mirrorY = groundY - mirrorHeight;

    ctx.fillStyle = 'rgba(96, 165, 250, 0.3)';
    ctx.fillRect(mirrorX - 10, mirrorY, 20, mirrorHeight);

    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 8;
    ctx.strokeRect(mirrorX - 15, mirrorY - 5, 30, mirrorHeight + 10);

    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(mirrorX, mirrorY);
    ctx.lineTo(mirrorX, groundY);
    ctx.stroke();

    // Draw person
    drawPerson(ctx, personX, groundY, personHeight, false);

    // Draw image
    const imageX = mirrorX + 120;
    drawPerson(ctx, imageX, groundY, personHeight, true);

    // Height measurement
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    
    // Person height
    ctx.beginPath();
    ctx.moveTo(personX - 40, groundY);
    ctx.lineTo(personX - 40, groundY - personHeight);
    ctx.stroke();

    // Mirror height
    ctx.strokeStyle = '#10b981';
    ctx.beginPath();
    ctx.moveTo(mirrorX - 40, mirrorY);
    ctx.lineTo(mirrorX - 40, groundY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Labels
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`Person: ${personHeight}cm`, personX - 50, groundY - personHeight / 2);

    ctx.fillStyle = '#10b981';
    ctx.fillText(`Mirror: ${mirrorHeight}cm`, mirrorX - 50, mirrorY + mirrorHeight / 2);

    // Info text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Mirror needs to be only HALF your height to see full body!', width / 2, 40);
  };

  // Rear-View Mirror Scenario
  const drawRearViewMirrorScenario = (ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
    const carY = height - 150;
    const mirrorY = height / 2 - 50;
    
    // Draw sky
    const skyGradient = ctx.createLinearGradient(0, 0, 0, height / 2);
    skyGradient.addColorStop(0, '#0c4a6e');
    skyGradient.addColorStop(1, '#075985');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, width, height / 2);

    // Draw road
    ctx.fillStyle = '#374151';
    ctx.fillRect(0, height / 2, width, height / 2);

    // Road lines
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.setLineDash([30, 20]);
    ctx.beginPath();
    ctx.moveTo(0, height / 2 + 50);
    ctx.lineTo(width, height / 2 + 50);
    ctx.stroke();
    ctx.setLineDash([]);

    // Your car interior view
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, carY, width, 150);

    // Dashboard
    ctx.fillStyle = '#374151';
    ctx.fillRect(0, carY, width, 30);

    // Rear-view mirror
    const mirrorCenterX = width / 2;
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(mirrorCenterX - 100, mirrorY, 200, 80);
    
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 4;
    ctx.strokeRect(mirrorCenterX - 100, mirrorY, 200, 80);

    // Mirror surface (showing reflection)
    ctx.fillStyle = 'rgba(96, 165, 250, 0.2)';
    ctx.fillRect(mirrorCenterX - 95, mirrorY + 5, 190, 70);

    // Car behind in mirror
    const behindCarX = mirrorCenterX + Math.sin(time / 1000) * 20;
    const behindCarY = mirrorY + 30;
    
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(behindCarX - 30, behindCarY, 60, 30);
    
    ctx.fillStyle = '#fecaca';
    ctx.fillRect(behindCarX - 25, behindCarY + 5, 50, 20);

    // Distance indicator
    const distance = 50 + Math.abs(Math.sin(time / 1000)) * 30;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`~${Math.round(distance)}m away`, mirrorCenterX, mirrorY - 10);

    // Labels
    ctx.font = 'bold 18px Arial';
    ctx.fillText('Rear-View Mirror (Plane Mirror)', width / 2, 40);
    ctx.font = '14px Arial';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Shows accurate distance to vehicles behind', width / 2, 65);
  };

  // Dance Studio Scenario
  const drawDanceStudioScenario = (ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
    const mirrorX = width * 0.7;
    const groundY = height - 80;

    // Draw studio floor
    ctx.fillStyle = '#92400e';
    ctx.fillRect(0, groundY, width, height - groundY);

    // Draw wall
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(0, 0, width, groundY);

    // Draw mirror (large)
    const mirrorHeight = 300;
    const mirrorY = groundY - mirrorHeight;

    ctx.fillStyle = 'rgba(96, 165, 250, 0.2)';
    ctx.fillRect(mirrorX - 10, mirrorY, 20, mirrorHeight);

    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 12;
    ctx.strokeRect(mirrorX - 20, mirrorY - 10, 40, mirrorHeight + 20);

    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(mirrorX, mirrorY);
    ctx.lineTo(mirrorX, groundY);
    ctx.stroke();

    // Draw dancer with pose
    const dancerX = mirrorX - 150;
    const pose = Math.sin(time / 500);

    // Dancer body
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(dancerX, groundY - 100);
    ctx.lineTo(dancerX, groundY - 50);
    ctx.stroke();

    // Arms in dance pose
    ctx.beginPath();
    ctx.moveTo(dancerX - 40, groundY - 85 + pose * 10);
    ctx.lineTo(dancerX, groundY - 85);
    ctx.lineTo(dancerX + 40, groundY - 85 - pose * 10);
    ctx.stroke();

    // Legs
    ctx.beginPath();
    ctx.moveTo(dancerX, groundY - 50);
    ctx.lineTo(dancerX - 20, groundY);
    ctx.moveTo(dancerX, groundY - 50);
    ctx.lineTo(dancerX + 20, groundY);
    ctx.stroke();

    // Head
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(dancerX, groundY - 110, 10, 0, Math.PI * 2);
    ctx.fill();

    // Draw reflection
    const imageX = mirrorX + 150;

    ctx.globalAlpha = 0.5;
    ctx.setLineDash([5, 5]);
    
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(imageX, groundY - 100);
    ctx.lineTo(imageX, groundY - 50);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(imageX - 40, groundY - 85 + pose * 10);
    ctx.lineTo(imageX, groundY - 85);
    ctx.lineTo(imageX + 40, groundY - 85 - pose * 10);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(imageX, groundY - 50);
    ctx.lineTo(imageX - 20, groundY);
    ctx.moveTo(imageX, groundY - 50);
    ctx.lineTo(imageX + 20, groundY);
    ctx.stroke();

    ctx.fillStyle = 'rgba(251, 191, 36, 0.5)';
    ctx.beginPath();
    ctx.arc(imageX, groundY - 110, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 1;
    ctx.setLineDash([]);

    // Labels
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Dance Studio Mirror', width / 2, 40);
    ctx.font = '14px Arial';
    ctx.fillStyle = '#78350f';
    ctx.fillText('Dancers use mirrors to check form and synchronization', width / 2, 65);
  };

  // Periscope Scenario
  const drawPeriscopeScenario = (ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
    const periscopeX = width / 2;
    const waterY = height * 0.6;

    // Draw sky
    const skyGradient = ctx.createLinearGradient(0, 0, 0, waterY);
    skyGradient.addColorStop(0, '#0ea5e9');
    skyGradient.addColorStop(1, '#38bdf8');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, width, waterY);

    // Draw water
    const waterGradient = ctx.createLinearGradient(0, waterY, 0, height);
    waterGradient.addColorStop(0, '#0284c7');
    waterGradient.addColorStop(1, '#0369a1');
    ctx.fillStyle = waterGradient;
    ctx.fillRect(0, waterY, width, height - waterY);

    // Water surface line
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 5]);
    ctx.beginPath();
    ctx.moveTo(0, waterY);
    ctx.lineTo(width, waterY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw boat above water
    const boatX = width * 0.75 + Math.sin(time / 1000) * 30;
    const boatY = waterY - 40;

    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(boatX - 50, boatY);
    ctx.lineTo(boatX + 50, boatY);
    ctx.lineTo(boatX + 40, boatY + 30);
    ctx.lineTo(boatX - 40, boatY + 30);
    ctx.closePath();
    ctx.fill();

    // Periscope tube
    ctx.fillStyle = '#374151';
    ctx.fillRect(periscopeX - 15, waterY + 50, 30, 150);

    // Top mirror (45 degrees)
    const topMirrorY = waterY - 30;
    ctx.save();
    ctx.translate(periscopeX, topMirrorY);
    ctx.rotate(-Math.PI / 4);
    ctx.fillStyle = '#60a5fa';
    ctx.fillRect(-30, -3, 60, 6);
    ctx.restore();

    // Bottom mirror (45 degrees)
    const bottomMirrorY = waterY + 200;
    ctx.save();
    ctx.translate(periscopeX, bottomMirrorY);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = '#60a5fa';
    ctx.fillRect(-30, -3, 60, 6);
    ctx.restore();

    // Draw light path
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#fbbf24';

    // From boat to top mirror
    ctx.beginPath();
    ctx.moveTo(boatX, boatY + 15);
    ctx.lineTo(periscopeX + 15, topMirrorY - 15);
    ctx.stroke();

    // Down the periscope
    ctx.beginPath();
    ctx.moveTo(periscopeX - 5, topMirrorY + 15);
    ctx.lineTo(periscopeX - 5, bottomMirrorY - 15);
    ctx.stroke();

    // To viewer
    ctx.beginPath();
    ctx.moveTo(periscopeX - 15, bottomMirrorY + 15);
    ctx.lineTo(periscopeX - 50, bottomMirrorY + 15);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw eye viewing
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(periscopeX - 60, bottomMirrorY + 15, 15, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(periscopeX - 60, bottomMirrorY + 15, 6, 0, Math.PI * 2);
    ctx.fill();

    // Labels
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Periscope - Two Plane Mirrors at 45°', width / 2, 40);

    ctx.font = '14px Arial';
    ctx.fillStyle = '#fbbf24';
    ctx.textAlign = 'left';
    ctx.fillText('1st Reflection', periscopeX + 25, topMirrorY);
    ctx.fillText('2nd Reflection', periscopeX + 25, bottomMirrorY);

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('ABOVE WATER', width / 2, waterY - 120);
    ctx.fillText('UNDERWATER', width / 2, waterY + 30);
  };

  // Barber Shop Scenario
  const drawBarberShopScenario = (ctx: CanvasRenderingContext2D, width: number, height: number, _time: number) => {
    const frontMirrorX = width * 0.3;
    const backMirrorX = width * 0.7;
    const chairY = height - 120;

    // Draw room
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(0, 0, width, chairY);

    // Draw floor
    ctx.fillStyle = '#92400e';
    ctx.fillRect(0, chairY, width, height - chairY);

    // Front mirror
    const mirrorHeight = 280;
    const mirrorY = chairY - mirrorHeight;

    ctx.fillStyle = 'rgba(96, 165, 250, 0.3)';
    ctx.fillRect(frontMirrorX - 10, mirrorY, 20, mirrorHeight);

    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 10;
    ctx.strokeRect(frontMirrorX - 15, mirrorY - 5, 30, mirrorHeight + 10);

    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(frontMirrorX, mirrorY);
    ctx.lineTo(frontMirrorX, chairY);
    ctx.stroke();

    // Back mirror
    ctx.fillStyle = 'rgba(96, 165, 250, 0.3)';
    ctx.fillRect(backMirrorX - 10, mirrorY, 20, mirrorHeight);

    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 10;
    ctx.strokeRect(backMirrorX - 15, mirrorY - 5, 30, mirrorHeight + 10);

    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(backMirrorX, mirrorY);
    ctx.lineTo(backMirrorX, chairY);
    ctx.stroke();

    // Person in chair (facing front mirror)
    const personX = width / 2;
    const headY = chairY - 80;

    // Head
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(personX, headY, 20, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(personX - 25, headY + 15, 50, 60);

    // Back of head in back mirror (visible in front mirror)
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.setLineDash([5, 5]);
    
    const backHeadX = frontMirrorX - (personX - frontMirrorX);
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(backHeadX, headY, 15, 0, Math.PI * 2);
    ctx.fill();

    // Back of body
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(backHeadX - 20, headY + 12, 40, 50);
    
    ctx.restore();
    ctx.setLineDash([]);

    // Arrows showing reflection path
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(personX, headY - 40);
    ctx.lineTo(backMirrorX, headY - 40);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(backMirrorX, headY - 40);
    ctx.lineTo(frontMirrorX, headY - 40);
    ctx.stroke();
    ctx.setLineDash([]);

    // Labels
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Barber Shop Double Mirror System', width / 2, 40);

    ctx.font = '14px Arial';
    ctx.fillStyle = '#78350f';
    ctx.fillText('See back of your head in front mirror!', width / 2, 65);

    ctx.fillStyle = '#60a5fa';
    ctx.textAlign = 'left';
    ctx.fillText('Front\nMirror', frontMirrorX - 60, mirrorY + mirrorHeight / 2);
    ctx.fillText('Back\nMirror', backMirrorX + 25, mirrorY + mirrorHeight / 2);
  };

  // Main draw function
  const drawRealWorldScenario = (ctx: CanvasRenderingContext2D, time: number) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, width, height);

    // Draw scenario-specific visualization
    switch (selectedScenario) {
      case 0:
        drawAmbulanceScenario(ctx, width, height, time);
        break;
      case 1:
        drawDressingRoomScenario(ctx, width, height, time);
        break;
      case 2:
        drawRearViewMirrorScenario(ctx, width, height, time);
        break;
      case 3:
        drawDanceStudioScenario(ctx, width, height, time);
        break;
      case 4:
        drawPeriscopeScenario(ctx, width, height, time);
        break;
      case 5:
        drawBarberShopScenario(ctx, width, height, time);
        break;
    }
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
      drawRealWorldScenario(ctx, currentTime);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [selectedScenario]);

  return (
    <div style={{ 
      backgroundColor: '#0f172a', 
      minHeight: '100vh', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ 
          color: '#ffffff', 
          fontSize: '36px', 
          marginBottom: '10px',
          textShadow: '0 0 20px rgba(96, 165, 250, 0.5)'
        }}>
          {t('planeMirrorRealWorld.title')}
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '18px' }}>
          {t('planeMirrorRealWorld.subtitle')}
        </p>
      </div>

      {/* Canvas */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginBottom: '25px' 
      }}>
        <canvas
          ref={canvasRef}
          width={1000}
          height={500}
          style={{
            border: '3px solid #334155',
            borderRadius: '12px',
            boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)',
            backgroundColor: '#0a0a1a'
          }}
        />
      </div>

      {/* Scenario Selection */}
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '15px',
          marginBottom: '25px'
        }}>
          {realWorldScenarios.map((scenario, index) => (
            <button
              key={scenario.id}
              onClick={() => setSelectedScenario(index)}
              style={{
                padding: '20px',
                backgroundColor: selectedScenario === index ? '#3b82f6' : '#1e293b',
                border: selectedScenario === index ? '2px solid #60a5fa' : '2px solid #334155',
                borderRadius: '12px',
                color: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.3s',
                textAlign: 'left'
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>{scenario.icon}</div>
              <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#ffffff' }}>
                {scenario.title}
              </h3>
              <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
                {scenario.description}
              </p>
            </button>
          ))}
        </div>

        {/* Scenario Details */}
        <div style={{
          backgroundColor: '#1e293b',
          padding: '30px',
          borderRadius: '12px',
          border: '2px solid #334155'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '15px' }}>
            <span style={{ fontSize: '48px' }}>{realWorldScenarios[selectedScenario].icon}</span>
            <h2 style={{ color: '#ffffff', fontSize: '28px', margin: 0 }}>
              {realWorldScenarios[selectedScenario].title}
            </h2>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '18px', lineHeight: '1.8' }}>
            {realWorldScenarios[selectedScenario].scenario}
          </p>
        </div>
      </div>
    </div>
  );
};

// Main App Component (internal, uses LanguageProvider)

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
    <div className="min-h-screen bg-white">
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
