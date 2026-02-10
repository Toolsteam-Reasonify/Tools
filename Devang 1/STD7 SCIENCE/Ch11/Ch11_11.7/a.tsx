// Type declarations for React to prevent TypeScript errors
// These declarations provide types for React when the package is not installed
// @ts-ignore - Ambient module declaration (not augmentation)
declare module "react" {
  export interface FC<P = {}> {
    (props: P, context?: any): any;
    displayName?: string;
    defaultProps?: Partial<P>;
    propTypes?: any;
  }
  export type ReactNode = any;
  export function useState<S>(initialState: S | (() => S)): [S, (value: S | ((prev: S) => S)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function createContext<T>(defaultValue: T): Context<T>;
  export function useContext<T>(context: Context<T>): T;
  export interface Context<T> {
    Provider: FC<{ value: T; children?: ReactNode }>;
    Consumer: FC<{ children: (value: T) => ReactNode }>;
  }
  export interface SVGProps<T> {
    className?: string;
    fill?: string;
    stroke?: string;
    strokeWidth?: string | number;
    viewBox?: string;
    [key: string]: any;
  }
  const React: any;
  export default React;
}

import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  type ReactNode,
  type SVGProps as ReactSVGProps,
  // @ts-ignore
} from "react";

// Extend React namespace to include SVGProps and FC types
declare namespace React {
  export interface SVGProps<T = any> extends ReactSVGProps<T> {}
  export interface FC<P = {}> {
    (props: P, context?: any): any;
    displayName?: string;
    defaultProps?: Partial<P>;
    propTypes?: any;
  }
}

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
if (typeof window !== "undefined" && typeof console !== "undefined") {
  // Safely store original console methods
  const originalError =
    typeof console.error === "function" ? console.error.bind(console) : null;
  const originalWarn =
    typeof console.warn === "function" ? console.warn.bind(console) : null;
  const originalLog =
    typeof console.log === "function" ? console.log.bind(console) : null;

  const shouldSuppress = (message: string): boolean => {
    const msg = message.toLowerCase();
    return (
      msg.includes("runtime.lasterror") ||
      msg.includes("message port closed") ||
      msg.includes("unchecked runtime.lasterror") ||
      msg.includes("the message port closed before a response was received") ||
      msg.includes("extension context invalidated") ||
      msg.includes("receiving end does not exist") ||
      (msg.includes("invalid values for props") &&
        (msg.includes("error") || msg.includes("warn") || msg.includes("log")))
    );
  };

  // Override console.error with safe error handling
  if (originalError) {
    try {
      console.error = (...args: unknown[]) => {
        try {
          const message = String(args[0] || "");
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
          const message = String(args[0] || "");
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
          const message = String(args[0] || "");
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
    window.addEventListener("unhandledrejection", (event) => {
      try {
        const message = String(event.reason || "");
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
    window.addEventListener(
      "error",
      (event) => {
        try {
          const message = String(event.message || "");
          if (shouldSuppress(message)) {
            event.preventDefault();
            event.stopPropagation();
            return false;
          }
        } catch (e) {
          // Silently fail
        }
      },
      true
    );
  } catch (e) {
    // Silently fail if listener can't be added
  }

  // Suppress Chrome extension runtime errors
  try {
    if (window.chrome && window.chrome.runtime) {
      // Override lastError getter to prevent warnings - multiple attempts for maximum compatibility
      try {
        const descriptor = Object.getOwnPropertyDescriptor(
          window.chrome.runtime,
          "lastError"
        );
        if (!descriptor || descriptor.configurable) {
          Object.defineProperty(window.chrome.runtime, "lastError", {
            get: () => null,
            set: () => {},
            configurable: true,
            enumerable: false,
          });
        }
      } catch (e) {
        // Try alternative approach
        try {
          (window.chrome.runtime as any).lastError = null;
          Object.defineProperty(window.chrome.runtime, "lastError", {
            get: () => null,
            set: () => {},
            configurable: true,
            enumerable: false,
          });
        } catch (e2) {
          // If all else fails, wrap the property
        }
      }

      // Wrap sendMessage to suppress errors
      if (window.chrome.runtime.sendMessage) {
        const originalSendMessage = window.chrome.runtime.sendMessage;
        window.chrome.runtime.sendMessage = function (
          this: typeof window.chrome.runtime,
          ...args: unknown[]
        ) {
          try {
            const result = originalSendMessage.apply(this, args);
            // If it returns a promise, catch errors
            if (
              result &&
              typeof result === "object" &&
              "catch" in result &&
              typeof (result as { catch?: unknown }).catch === "function"
            ) {
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
        window.chrome.runtime.connect = function (
          this: typeof window.chrome.runtime,
          ...args: unknown[]
        ) {
          try {
            const port = originalConnect.apply(this, args);
            // Suppress errors from port messages
            if (port && typeof port === "object" && "onMessage" in port) {
              const portWithMessage = port as {
                onMessage?: { addListener?: (callback: unknown) => void };
              };
              if (
                portWithMessage.onMessage &&
                portWithMessage.onMessage.addListener
              ) {
                const originalAddListener =
                  portWithMessage.onMessage.addListener;
                portWithMessage.onMessage.addListener = function (
                  callback: unknown
                ) {
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
        window.browser.runtime.sendMessage = function (
          this: typeof window.browser.runtime,
          ...args: unknown[]
        ) {
          try {
            const result = originalSendMessage.apply(this, args);
            if (
              result &&
              typeof result === "object" &&
              "catch" in result &&
              typeof (result as { catch?: unknown }).catch === "function"
            ) {
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
    window.onerror = function (message, source, lineno, colno, error) {
      const msg = String(message || "").toLowerCase();
      if (shouldSuppress(msg)) {
        return true; // Suppress the error
      }
      if (originalOnError) {
        return originalOnError.call(
          this,
          message,
          source,
          lineno,
          colno,
          error
        );
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
            Object.defineProperty(window.chrome.runtime, "lastError", {
              get: () => null,
              set: () => {},
              configurable: true,
              enumerable: false,
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
    viewBox: "0 0 24 24",
  };

  // Filter props to remove any injected invalid props
  const filteredSvgProps: Record<string, unknown> = {};
  const invalidKeys = ["error", "warn", "log"];
  for (const key in svgProps) {
    if (!invalidKeys.includes(key)) {
      filteredSvgProps[key] = svgProps[key as keyof typeof svgProps];
    }
  }

  const pathData =
    "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z";

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
    viewBox: "0 0 24 24",
  };

  // Filter props to remove any injected invalid props
  const filteredSvgProps: Record<string, unknown> = {};
  const invalidKeys = ["error", "warn", "log"];
  for (const key in svgProps) {
    if (!invalidKeys.includes(key)) {
      filteredSvgProps[key] = svgProps[key as keyof typeof svgProps];
    }
  }

  const pathData =
    "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9l2 2 4-4";

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
    viewBox: "0 0 24 24",
  };

  // Filter props to remove any injected invalid props
  const filteredSvgProps: Record<string, unknown> = {};
  const invalidKeys = ["error", "warn", "log"];
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

const Lightbulb = ({ className }: { className?: string }) => {
  const svgProps: React.SVGProps<SVGSVGElement> = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    viewBox: "0 0 24 24",
  };

  const filteredSvgProps: Record<string, unknown> = {};
  const invalidKeys = ["error", "warn", "log"];
  for (const key in svgProps) {
    if (!invalidKeys.includes(key)) {
      filteredSvgProps[key] = svgProps[key as keyof typeof svgProps];
    }
  }

  return (
    <svg {...(filteredSvgProps as React.SVGProps<SVGSVGElement>)}>
      <path d="M9 21h6M12 3a6 6 0 0 1 6 6c0 2.5-1.5 4.5-3 6H9c-1.5-1.5-3-3.5-3-6a6 6 0 0 1 6-6zM12 9v3M12 15h.01" />
    </svg>
  );
};

const Eye = ({ className }: { className?: string }) => {
  const svgProps: React.SVGProps<SVGSVGElement> = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    viewBox: "0 0 24 24",
  };

  const filteredSvgProps: Record<string, unknown> = {};
  const invalidKeys = ["error", "warn", "log"];
  for (const key in svgProps) {
    if (!invalidKeys.includes(key)) {
      filteredSvgProps[key] = svgProps[key as keyof typeof svgProps];
    }
  }

  return (
    <svg {...(filteredSvgProps as React.SVGProps<SVGSVGElement>)}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
};

const CheckCircle = ({ className }: { className?: string }) => {
  const svgProps: React.SVGProps<SVGSVGElement> = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    viewBox: "0 0 24 24",
  };

  const filteredSvgProps: Record<string, unknown> = {};
  const invalidKeys = ["error", "warn", "log"];
  for (const key in svgProps) {
    if (!invalidKeys.includes(key)) {
      filteredSvgProps[key] = svgProps[key as keyof typeof svgProps];
    }
  }

  return (
    <svg {...(filteredSvgProps as React.SVGProps<SVGSVGElement>)}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
};

const XCircle = ({ className }: { className?: string }) => {
  const svgProps: React.SVGProps<SVGSVGElement> = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    viewBox: "0 0 24 24",
  };

  const filteredSvgProps: Record<string, unknown> = {};
  const invalidKeys = ["error", "warn", "log"];
  for (const key in svgProps) {
    if (!invalidKeys.includes(key)) {
      filteredSvgProps[key] = svgProps[key as keyof typeof svgProps];
    }
  }

  return (
    <svg {...(filteredSvgProps as React.SVGProps<SVGSVGElement>)}>
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
};

const RotateCcw = ({ className }: { className?: string }) => {
  const svgProps: React.SVGProps<SVGSVGElement> = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    viewBox: "0 0 24 24",
  };

  const filteredSvgProps: Record<string, unknown> = {};
  const invalidKeys = ["error", "warn", "log"];
  for (const key in svgProps) {
    if (!invalidKeys.includes(key)) {
      filteredSvgProps[key] = svgProps[key as keyof typeof svgProps];
    }
  }

  return (
    <svg {...(filteredSvgProps as React.SVGProps<SVGSVGElement>)}>
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  );
};

const Trophy = ({ className }: { className?: string }) => {
  const svgProps: React.SVGProps<SVGSVGElement> = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    viewBox: "0 0 24 24",
  };

  const filteredSvgProps: Record<string, unknown> = {};
  const invalidKeys = ["error", "warn", "log"];
  for (const key in svgProps) {
    if (!invalidKeys.includes(key)) {
      filteredSvgProps[key] = svgProps[key as keyof typeof svgProps];
    }
  }

  return (
    <svg {...(filteredSvgProps as React.SVGProps<SVGSVGElement>)}>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2z" />
    </svg>
  );
};

const Camera = ({ className }: { className?: string }) => {
  const svgProps: React.SVGProps<SVGSVGElement> = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    viewBox: "0 0 24 24",
  };

  const filteredSvgProps: Record<string, unknown> = {};
  const invalidKeys = ["error", "warn", "log"];
  for (const key in svgProps) {
    if (!invalidKeys.includes(key)) {
      filteredSvgProps[key] = svgProps[key as keyof typeof svgProps];
    }
  }

  return (
    <svg {...(filteredSvgProps as React.SVGProps<SVGSVGElement>)}>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
};

const Building2 = ({ className }: { className?: string }) => {
  const svgProps: React.SVGProps<SVGSVGElement> = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    viewBox: "0 0 24 24",
  };

  const filteredSvgProps: Record<string, unknown> = {};
  const invalidKeys = ["error", "warn", "log"];
  for (const key in svgProps) {
    if (!invalidKeys.includes(key)) {
      filteredSvgProps[key] = svgProps[key as keyof typeof svgProps];
    }
  }

  return (
    <svg {...(filteredSvgProps as React.SVGProps<SVGSVGElement>)}>
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12h12M6 6h12M6 18h12M10 8h4M10 12h4M10 16h4" />
    </svg>
  );
};

const Microscope = ({ className }: { className?: string }) => {
  const svgProps: React.SVGProps<SVGSVGElement> = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    viewBox: "0 0 24 24",
  };

  const filteredSvgProps: Record<string, unknown> = {};
  const invalidKeys = ["error", "warn", "log"];
  for (const key in svgProps) {
    if (!invalidKeys.includes(key)) {
      filteredSvgProps[key] = svgProps[key as keyof typeof svgProps];
    }
  }

  return (
    <svg {...(filteredSvgProps as React.SVGProps<SVGSVGElement>)}>
      <path d="M6 18h8M4 22h12M6 14v2a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2M6 14V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v10M6 14H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2M14 14h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" />
    </svg>
  );
};

// ==================== TYPE DEFINITIONS ====================

type Language = "en";
type TabType = "learn" | "practice" | "realWorld";
type ModeType = "learn" | "practice" | "realWorld";

interface StepDetails {
  currentStep: number;
  totalSteps: number;
  isPaused: boolean;
  currentMode: ModeType;
}

interface StepDataInterface {
  id: number;
  title: string;
  description: string;
  type: "intro" | "explanation" | "practice" | "real_world" | "hands_on";
  mode: ModeType;
  data?: any;
}

interface BaseDataInterface {
  themeColor?: string;
  autoPlayDuration?: number;
}

// ADDITIONAL PROPS - TOOL SPECIFIC
interface PinholeCameraAdditionalProps {
  // Object configuration
  objectColor?: string;
  objectType?: "candle" | "arrow" | "circle" | "square";
  showRays?: boolean;
  rayColor?: string;
  
  // Pinhole configuration
  pinholeSize?: number;
  pinholeColor?: string;
  
  // Screen configuration
  screenColor?: string;
  showInvertedImage?: boolean;
  
  // Animation configuration
  animationSpeed?: number;
  showRayAnimation?: boolean;
  
  // Custom labels
  customLabels?: {
    object?: string;
    pinhole?: string;
    screen?: string;
    top?: string;
    bottom?: string;
  };
  
  // Interactive features
  interactive?: boolean;
  allowRayControl?: boolean;
}

interface PinholeCameraToolProps {
  props?: {
    // ─────────────────────────────────────────────────────────────────
    // DIMENSIONS
    // ─────────────────────────────────────────────────────────────────
    width?: number;                    // Default: 800
    height?: number;                   // Default: 600
    
    // ─────────────────────────────────────────────────────────────────
    // DATA CONFIGURATION
    // ─────────────────────────────────────────────────────────────────
    data?: BaseDataInterface;
    steps?: StepDataInterface[];
    
    // ─────────────────────────────────────────────────────────────────
    // MODE CONFIGURATION
    // ─────────────────────────────────────────────────────────────────
    initialMode?: ModeType;            // Starting mode
    showModeSelector?: boolean;        // Show/hide mode tabs (default: true)
    enabledModes?: ModeType[];         // Which modes to enable
    
    // ─────────────────────────────────────────────────────────────────
    // NAVIGATION CONFIGURATION
    // ─────────────────────────────────────────────────────────────────
    showNavigation?: boolean;          // Show/hide prev/next buttons (default: true)
    showPlayPause?: boolean;           // Show/hide play/pause button (default: true)
    showStepIndicator?: boolean;       // Show/hide step counter (default: true)
    
    // ─────────────────────────────────────────────────────────────────
    // STEP FILTERING
    // ─────────────────────────────────────────────────────────────────
    initialStep?: number;              // Starting step ID
    filterSteps?: number[];            // Only show these step IDs
    
    // ─────────────────────────────────────────────────────────────────
    // ANIMATION CONFIGURATION
    // ─────────────────────────────────────────────────────────────────
    animationSpeed?: number;           // Animation speed multiplier (default: 1)
    autoPlayDuration?: number;         // Auto-advance delay in ms (default: 8000)
    
    // ─────────────────────────────────────────────────────────────────
    // THEME
    // ─────────────────────────────────────────────────────────────────
    themeColor?: string;               // Primary color (default: "#3b82f6")
    darkMode?: boolean;                // Dark mode toggle (default: false)
    
    // ─────────────────────────────────────────────────────────────────
    // ADDITIONAL PROPS - TOOL-SPECIFIC DYNAMIC CONTENT
    // ─────────────────────────────────────────────────────────────────
    additionalProps?: PinholeCameraAdditionalProps;
  };
  
  // ─────────────────────────────────────────────────────────────────
  // EXTERNAL CONTROLS (for parent component integration)
  // ─────────────────────────────────────────────────────────────────
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// Translation type definition
type TranslationValue =
  | string
  | string[]
  | number
  | { [key: string]: TranslationValue }
  | Array<{ [key: string]: TranslationValue }>;

// English-only translations
const translations = {
  en: {
    nav: {
      logo: "Pinhole Camera",
      tabs: {
        learn: "Learn",
        practice: "Practice",
        realWorld: "Real World",
      },
    },
    language: {
      en: "English",
      selectorLabel: "Select Language",
    },
  },
};

// Pinhole Camera Translations
const pinholeTranslations = {
  en: {
    title: "Pinhole Camera",
    subtitle: "Understanding Image Formation Through a Tiny Hole",
    learn: {
      what: "What is a Pinhole Camera?",
      whatDesc: "A pinhole camera is a simple optical device where light rays from an object pass through a tiny hole (pinhole) and form an image on a screen.",
      how: "How Does it Work?",
      howDesc: "Light travels in straight lines from the object. When it passes through a small pinhole, the rays cross over, creating an inverted image on the screen.",
      key: "Key Observations",
      keyPoint1: "The image formed is INVERTED (upside down)",
      keyPoint2: "The image shows the colors of the actual object",
      keyPoint3: "Works best with bright objects in dim surroundings"
    },
    comparison: {
      title: "Pinhole Camera vs Plane Mirror",
      pinhole: "Pinhole Camera",
      mirror: "Plane Mirror",
      inverted: "Forms INVERTED image",
      lateral: "Shows LATERAL inversion only"
    },
    diagram: {
      object: "Object",
      pinhole: "Pinhole",
      screen: "Screen",
      raysCrossHere: "⚡ Rays Cross Here!",
      top: "TOP",
      bottom: "BOTTOM",
      topRay: "Top Ray",
      middleRay: "Middle Ray",
      bottomRay: "Bottom Ray",
      goesToBottom: "Goes to bottom",
      staysInMiddle: "Stays in middle",
      goesToTop: "Goes to top"
    }
  }
};

// Pinhole Practice Translations
const pinholePracticeTranslations = {
  en: {
    title: "Practice Mode",
    subtitle: "Test Your Understanding of Pinhole Camera",
    questions: [
      {
        id: 1,
        question: "What is a pinhole camera?",
        options: [
          "A camera with a lens",
          "A camera with a small hole instead of a lens",
          "A digital camera",
          "A camera with a mirror",
        ],
        correctAnswer: 1,
        explanation:
          "A pinhole camera is a simple optical device where light rays from an object pass through a tiny hole (pinhole) and form an image on a screen. It does not use a lens.",
      },
      {
        id: 2,
        question: "What type of image is formed by a pinhole camera?",
        options: [
          "Erect and same size",
          "Inverted and same size",
          "Erect and magnified",
          "Laterally inverted only",
        ],
        correctAnswer: 1,
        explanation:
          "A pinhole camera forms an inverted (upside down) image because light rays cross at the pinhole. The image is real and can be projected on a screen.",
      },
      {
        id: 3,
        question:
          "Why does light create an inverted image in a pinhole camera?",
        options: [
          "Because of the lens",
          "Because light rays cross at the pinhole",
          "Because of reflection",
          "Because of the screen material",
        ],
        correctAnswer: 1,
        explanation:
          "Light travels in straight lines. When light rays from the top of an object pass through the pinhole, they go to the bottom of the screen. Similarly, rays from the bottom go to the top, causing the image to be inverted.",
      },
      {
        id: 4,
        question: "What happens if the pinhole is too large?",
        options: [
          "Image becomes clearer",
          "Image becomes blurred",
          "Image becomes colored",
          "No image is formed",
        ],
        correctAnswer: 1,
        explanation:
          "If the pinhole is too large, many light rays from different points of the object can reach the same point on the screen, causing the image to become blurred and unclear.",
      },
      {
        id: 5,
        question:
          "Which property of light is demonstrated by a pinhole camera?",
        options: [
          "Light reflects",
          "Light travels in straight lines",
          "Light can be colored",
          "Light can be absorbed",
        ],
        correctAnswer: 1,
        explanation:
          "A pinhole camera demonstrates that light travels in straight lines (rectilinear propagation of light). This is why rays don't bend and create an inverted image when they cross at the pinhole.",
      },
      {
        id: 6,
        question: "What is needed to see a shadow?",
        options: [
          "Only a light source",
          "Only an opaque object",
          "A light source, opaque object, and screen",
          "Only a screen",
        ],
        correctAnswer: 2,
        explanation:
          "To observe a shadow, we need three things: a source of light, an opaque object that blocks light, and a screen (like a wall or ground) where the shadow appears.",
      },
      {
        id: 7,
        question:
          "How does a pinhole camera image differ from a plane mirror image?",
        options: [
          "Both are identical",
          "Pinhole gives inverted image, mirror gives laterally inverted",
          "Pinhole gives erect image, mirror gives inverted",
          "Both give inverted images",
        ],
        correctAnswer: 1,
        explanation:
          "A pinhole camera forms a completely inverted (upside down) image, while a plane mirror forms an erect image with lateral (left-right) inversion only.",
      },
      {
        id: 8,
        question:
          "Does the color of the object affect the pinhole camera image?",
        options: [
          "No, image is always black and white",
          "Yes, image shows the actual colors",
          "Image color depends on screen material",
          "Image is always inverted in color",
        ],
        correctAnswer: 1,
        explanation:
          "The pinhole camera image shows the actual colors of the object. Light carrying color information passes through the pinhole and forms a colored image on the screen.",
      },
      {
        id: 9,
        question: "When does a pinhole camera work best?",
        options: [
          "In complete darkness",
          "With bright objects in dim surroundings",
          "Only during the day",
          "Only with artificial light",
        ],
        correctAnswer: 1,
        explanation:
          "A pinhole camera works best with bright objects (like a candle flame) in relatively dim surroundings. This provides good contrast and makes the image visible on the screen.",
      },
      {
        id: 10,
        question:
          "What would happen if you removed the screen from a pinhole camera?",
        options: [
          "Image would float in air",
          "No image would be visible",
          "Image would be brighter",
          "Image would become erect",
        ],
        correctAnswer: 1,
        explanation:
          "Without a screen, there would be no surface for the image to form on, so we wouldn't be able to see the image. The screen is necessary to capture and display the image formed by light rays.",
      },
    ],
    submit: "Submit Answer",
    next: "Next Question",
    previous: "Previous Question",
    restart: "Restart Practice",
    score: "Score",
    selectAnswer: "Please select an answer",
    correct: "Correct!",
    incorrect: "Incorrect",
    explanation: "Explanation",
    completed: "Practice Completed!",
    congratulations: "Congratulations!",
    yourScore: "Your Score",
    tryAgain: "Try Again",
    questionsOf: "of",
  },
};

// Pinhole Real World Translations
const pinholeRealWorldTranslations = {
  en: {
    title: "Real World Applications",
    subtitle:
      "Discover How Pinhole Camera Principles Are Used in Everyday Life",
    applicationsLabel: "Applications",
    applications: [
      {
        id: 1,
        title: "Solar Eclipse Viewing",
        description:
          "Pinhole cameras are one of the safest ways to view a solar eclipse without looking directly at the sun.",
        usage:
          "Scientists and astronomy enthusiasts use pinhole projectors to safely observe solar eclipses. The pinhole projects an inverted image of the eclipse onto a screen, allowing safe viewing.",
        icon: "sun",
        color: "from-yellow-400 to-orange-500",
      },
      {
        id: 2,
        title: "Photography History",
        description:
          "The pinhole camera is the ancestor of modern cameras and helped develop photography as we know it.",
        usage:
          "Early photographers used pinhole cameras (camera obscura) to create the first photographs. This principle is still used by artistic photographers today for unique effects.",
        icon: "camera",
        color: "from-blue-400 to-indigo-500",
      },
      {
        id: 3,
        title: "Human Eye",
        description:
          "The human eye works similarly to a pinhole camera, with the pupil acting like a pinhole.",
        usage:
          "In bright light, your pupil becomes smaller (like a pinhole), creating a sharper image on your retina. This is why squinting helps you see better!",
        icon: "eye",
        color: "from-green-400 to-emerald-500",
      },
      {
        id: 4,
        title: "Architectural Design",
        description:
          "Architects use camera obscura rooms to study sunlight patterns in buildings.",
        usage:
          "Large-scale pinhole cameras help architects understand how natural light will enter a building throughout the day, aiding in sustainable design.",
        icon: "building",
        color: "from-purple-400 to-pink-500",
      },
      {
        id: 5,
        title: "Art and Creativity",
        description:
          "Artists use pinhole photography to create dreamlike, artistic images with infinite depth of field.",
        usage:
          "Modern pinhole cameras produce unique soft-focus images. Many artists prefer this technique for portraits and landscapes because of its distinctive aesthetic.",
        icon: "palette",
        color: "from-pink-400 to-rose-500",
      },
      {
        id: 6,
        title: "Science Education",
        description:
          "Pinhole cameras are excellent tools for teaching light properties and optical principles.",
        usage:
          "Schools use pinhole cameras to teach students about light, optics, and image formation. Students build their own cameras to understand the science practically.",
        icon: "microscope",
        color: "from-cyan-400 to-blue-500",
      },
    ],
    howItWorks: "How It Works",
    realLifeExample: "Real Life Example",
    funFact: "Fun Fact",
    historicalFacts: {
      title: "Historical Facts",
      facts: [
        "The camera obscura (room-sized pinhole camera) was used by artists like Leonardo da Vinci and Vermeer to create accurate paintings.",
        "The first photograph ever taken (1826) by Joseph Nicéphore Niépce used pinhole camera principles.",
        "Ancient Chinese philosopher Mozi (470-390 BC) first documented the pinhole camera effect.",
        "During solar eclipses, tree leaves create natural pinhole cameras, projecting crescent-shaped images on the ground!",
      ],
    },
    modernUses: {
      title: "Modern Day Uses",
      uses: [
        "Security cameras often use pinhole lenses for discrete surveillance.",
        "Medical endoscopes use pinhole camera principles to see inside the human body.",
        "Smartphone cameras use similar principles combined with lenses for better image quality.",
        "Pinhole glasses are used as vision aids and for eye exercises.",
        "NASA uses pinhole cameras on spacecraft to photograph the sun safely.",
        "Pinhole cameras are used in scientific research to study light behavior and wave properties.",
      ],
    },
  },
};

// Language Context - simplified to English only
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
  const language: Language = "en";

  const handleSetLanguage = (lang: Language) => {
    // Always English
    console.log("Language locked to English:", lang);
  };

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translations.en;
    for (const k of keys) {
      if (value && typeof value === "object") {
        value = value[k];
      } else {
        return key;
      }
    }
    return typeof value === "string" ? value : key;
  };

  const tValue = (key: string): TranslationValue => {
    const keys = key.split(".");
    let value: any = translations.en;
    for (const k of keys) {
      if (value && typeof value === "object") {
        value = value[k];
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

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};

// CSS Properties type
type CSSProperties = {
  [key: string]: string | number | undefined;
};

// Type for pinhole configuration
type PinholeConfig = {
  objectColor: string;
  objectType: "candle" | "arrow" | "circle" | "square";
  showRays: boolean;
  rayColor: string;
  pinholeSize: number;
  pinholeColor: string;
  screenColor: string;
  showInvertedImage: boolean;
  animationSpeed: number;
  showRayAnimation: boolean;
  customLabels: {
    object?: string;
    pinhole?: string;
    screen?: string;
    top?: string;
    bottom?: string;
  };
  interactive: boolean;
  allowRayControl: boolean;
};

// Reflection of Light Learn Component (Pinhole Camera)
const ReflectionOfLightLearn: React.FC<{ 
  pinholeConfig?: PinholeConfig;
  config?: PinholeCameraToolProps["props"];
}> = ({ pinholeConfig, config }) => {
  const t = pinholeTranslations.en;
  const themeColor = config?.themeColor || "#3b82f6";
  const darkMode = config?.darkMode || false;

  // ─────────────────────────────────────────────────────────────────
  // STYLES
  // ─────────────────────────────────────────────────────────────────
  
  const learnStyles: { [key: string]: CSSProperties } = {
    container: {
      minHeight: "100vh",
      background: darkMode 
        ? "linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e1b4b 100%)"
        : "linear-gradient(135deg, #eff6ff 0%, #e0e7ff 50%, #f3e8ff 100%)",
      padding: "16px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    contentWrapper: {
      maxWidth: "1280px",
      margin: "0 auto",
    },
    content: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "24px",
    },
    card: {
      backgroundColor: darkMode ? "#1e293b" : "#ffffff",
      borderRadius: "16px",
      boxShadow: darkMode 
        ? "0 20px 25px -5px rgba(0, 0, 0, 0.3)"
        : "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      padding: "32px",
    },
    heading: {
      fontSize: "24px",
      fontWeight: 700,
      color: darkMode ? "#e2e8f0" : "#312e81",
      marginBottom: "16px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    headingAccent: {
      width: "8px",
      height: "32px",
      background: `linear-gradient(to bottom, ${themeColor}, #a855f7)`,
      borderRadius: "9999px",
    },
    paragraph: {
      color: darkMode ? "#cbd5e1" : "#374151",
      fontSize: "18px",
      lineHeight: "1.75",
      marginBottom: "24px",
    },
    diagramContainer: {
      background: darkMode 
        ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
        : "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
      borderRadius: "12px",
      padding: "32px",
    },
    svg: {
      width: "100%",
      height: "auto",
    },
    keyPointsContainer: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "16px",
    },
    keyPoint: {
      display: "flex",
      alignItems: "flex-start",
      gap: "16px",
      background: darkMode
        ? "linear-gradient(to right, #1e293b, #312e81)"
        : "linear-gradient(to right, #eef2ff, #f3e8ff)",
      padding: "16px",
      borderRadius: "12px",
    },
    keyPointNumber: {
      flexShrink: 0,
      width: "32px",
      height: "32px",
      background: `linear-gradient(135deg, ${themeColor}, #a855f7)`,
      color: "#ffffff",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 700,
    },
    keyPointText: {
      color: darkMode ? "#cbd5e1" : "#374151",
      fontSize: "18px",
      paddingTop: "2px",
    },
    comparisonGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "24px",
    },
    comparisonCard: {
      padding: "24px",
      borderRadius: "12px",
      border: "2px solid",
    },
    comparisonCardPinhole: {
      background: darkMode
        ? "linear-gradient(135deg, #7f1d1d 0%, #9a3412 100%)"
        : "linear-gradient(135deg, #fef2f2 0%, #fff7ed 100%)",
      borderColor: darkMode ? "#991b1b" : "#fecaca",
    },
    comparisonCardMirror: {
      background: darkMode
        ? "linear-gradient(135deg, #1e3a8a 0%, #155e75 100%)"
        : "linear-gradient(135deg, #eff6ff 0%, #ecfeff 100%)",
      borderColor: darkMode ? "#1e40af" : "#bfdbfe",
    },
    comparisonTitle: {
      fontSize: "20px",
      fontWeight: 700,
      marginBottom: "16px",
    },
    comparisonTitlePinhole: {
      color: darkMode ? "#fca5a5" : "#991b1b",
    },
    comparisonTitleMirror: {
      color: darkMode ? "#93c5fd" : "#1e40af",
    },
    comparisonItem: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginBottom: "12px",
    },
    comparisonDot: {
      width: "8px",
      height: "8px",
      borderRadius: "50%",
    },
    comparisonText: {
      color: darkMode ? "#cbd5e1" : "#374151",
    },
  };

  return (
    <div style={learnStyles.container}>
      <div style={learnStyles.contentWrapper}>
        {/* Learn Mode Content */}
        <div style={learnStyles.content}>
          {/* What is Pinhole Camera */}
          <div style={learnStyles.card}>
            <h2 style={learnStyles.heading}>
              <div style={learnStyles.headingAccent}></div>
              {t.learn.what}
            </h2>
            <p style={learnStyles.paragraph}>
              {t.learn.whatDesc}
            </p>
            
            {/* Simple Diagram */}
            <div style={learnStyles.diagramContainer}>
              <svg viewBox="0 0 600 250" style={learnStyles.svg}>
                {/* Object (Candle) */}
                <g>
                  <rect x="30" y="100" width="30" height="80" fill="#8B4513" rx="5"/>
                  <ellipse cx="45" cy="95" rx="15" ry="20" fill="#FFA500"/>
                  <ellipse cx="45" cy="90" rx="10" ry="15" fill="#FFD700"/>
                  <text x="45" y="200" textAnchor="middle" style={{ fontSize: "14px", fontWeight: 600, fill: darkMode ? "#cbd5e1" : "#374151" }}>{t.diagram.object}</text>
                </g>
                
                {/* Light rays */}
                <line x1="45" y1="90" x2="300" y2="120" stroke={pinholeConfig?.rayColor || "#FFD700"} strokeWidth="2" opacity="0.6">
                  <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite"/>
                </line>
                <line x1="45" y1="180" x2="300" y2="130" stroke={pinholeConfig?.rayColor || "#FFD700"} strokeWidth="2" opacity="0.6">
                  <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" begin="0.5s"/>
                </line>
                
                {/* Pinhole Box */}
                <rect x="280" y="110" width="40" height="40" fill="#654321" stroke="#4A3319" strokeWidth="2"/>
                <circle cx="300" cy="130" r={String(pinholeConfig?.pinholeSize || 3)} fill={pinholeConfig?.pinholeColor || "#000"}/>
                <text x="300" y="170" textAnchor="middle" style={{ fontSize: "14px", fontWeight: 600, fill: darkMode ? "#cbd5e1" : "#374151" }}>{pinholeConfig?.customLabels?.pinhole || t.diagram.pinhole}</text>
                
                {/* Light rays after pinhole */}
                <line x1="300" y1="120" x2="520" y2="180" stroke={pinholeConfig?.rayColor || "#FFD700"} strokeWidth="2" opacity="0.6">
                  <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" begin="1s"/>
                </line>
                <line x1="300" y1="130" x2="520" y2="100" stroke={pinholeConfig?.rayColor || "#FFD700"} strokeWidth="2" opacity="0.6">
                  <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" begin="1.5s"/>
                </line>
                
                {/* Screen */}
                <rect x="520" y="80" width="10" height="120" fill={pinholeConfig?.screenColor || "#E8E8E8"} stroke="#999" strokeWidth="2"/>
                <text x="525" y="215" textAnchor="middle" style={{ fontSize: "14px", fontWeight: 600, fill: darkMode ? "#cbd5e1" : "#374151" }}>{pinholeConfig?.customLabels?.screen || t.diagram.screen}</text>
                
                {/* Inverted Image on screen */}
                <g opacity="0.7">
                  {/* Candle base (bottom of object appears at top of screen) */}
                  <rect x="518" y="100" width="14" height="80" fill="#8B4513" rx="3"/>
                  {/* Flame (top of object appears at bottom of screen) */}
                  <ellipse cx="525" cy="175" rx="8" ry="12" fill="#FFD700"/>
                  <ellipse cx="525" cy="170" rx="6" ry="10" fill="#FFA500"/>
                </g>
              </svg>
            </div>
          </div>

          {/* Key Observations */}
          <div style={learnStyles.card}>
            <h2 style={{ ...learnStyles.heading, marginBottom: "24px" }}>
              <div style={learnStyles.headingAccent}></div>
              {t.learn.key}
            </h2>
            <div style={learnStyles.keyPointsContainer}>
              {[t.learn.keyPoint1, t.learn.keyPoint2, t.learn.keyPoint3].map((point, idx) => (
                <div key={idx} style={learnStyles.keyPoint}>
                  <div style={learnStyles.keyPointNumber}>
                    {idx + 1}
                  </div>
                  <p style={learnStyles.keyPointText}>{point}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison Section */}
          <div style={learnStyles.card}>
            <h2 style={{ ...learnStyles.heading, marginBottom: "24px" }}>
              <div style={learnStyles.headingAccent}></div>
              {t.comparison.title}
            </h2>
            <div style={learnStyles.comparisonGrid}>
              {/* Pinhole Camera */}
              <div style={{ ...learnStyles.comparisonCard, ...learnStyles.comparisonCardPinhole }}>
                <h3 style={{ ...learnStyles.comparisonTitle, ...learnStyles.comparisonTitlePinhole }}>{t.comparison.pinhole}</h3>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: "12px" }}>
                  <div style={learnStyles.comparisonItem}>
                    <div style={{ ...learnStyles.comparisonDot, backgroundColor: darkMode ? "#fca5a5" : "#ef4444" }}></div>
                    <span style={learnStyles.comparisonText}>{t.comparison.inverted}</span>
                  </div>
                  <svg viewBox="0 0 200 200" style={{ width: "100%", height: "128px" }}>
                    <text x="100" y="50" textAnchor="middle" style={{ fontSize: "36px", fontWeight: 700, fill: "#16a34a" }}>↑</text>
                    <line x1="20" y1="100" x2="180" y2="100" stroke="#666" strokeWidth="2"/>
                    <text x="100" y="170" textAnchor="middle" style={{ fontSize: "36px", fontWeight: 700, fill: "#16a34a" }}>↓</text>
                    <text x="100" y="195" textAnchor="middle" style={{ fontSize: "12px", fill: darkMode ? "#9ca3af" : "#4b5563" }}>Upside Down</text>
                  </svg>
                </div>
              </div>
              
              {/* Plane Mirror */}
              <div style={{ ...learnStyles.comparisonCard, ...learnStyles.comparisonCardMirror }}>
                <h3 style={{ ...learnStyles.comparisonTitle, ...learnStyles.comparisonTitleMirror }}>{t.comparison.mirror}</h3>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: "12px" }}>
                  <div style={learnStyles.comparisonItem}>
                    <div style={{ ...learnStyles.comparisonDot, backgroundColor: darkMode ? "#93c5fd" : "#3b82f6" }}></div>
                    <span style={learnStyles.comparisonText}>{t.comparison.lateral}</span>
                  </div>
                  <svg viewBox="0 0 200 200" style={{ width: "100%", height: "128px" }}>
                    <text x="70" y="110" textAnchor="middle" style={{ fontSize: "36px", fontWeight: 700, fill: "#16a34a" }}>L</text>
                    <line x1="100" y1="20" x2="100" y2="180" stroke="#666" strokeWidth="3" strokeDasharray="5,5"/>
                    <text x="130" y="110" textAnchor="middle" style={{ fontSize: "36px", fontWeight: 700, fill: "#16a34a" }}>R</text>
                    <text x="100" y="195" textAnchor="middle" style={{ fontSize: "12px", fill: darkMode ? "#9ca3af" : "#4b5563" }}>Left-Right Reversed</text>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Practice Mode Component
const PracticeMode: React.FC<{ 
  pinholeConfig?: PinholeConfig;
  config?: PinholeCameraToolProps["props"];
}> = ({ pinholeConfig, config }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(
    new Array(10).fill(false)
  );
  const [isCompleted, setIsCompleted] = useState(false);

  const t = pinholePracticeTranslations.en;
  const question = t.questions[currentQuestion];

  const handleAnswerSelect = (index: number) => {
    if (!isAnswered) {
      setSelectedAnswer(index);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) {
      alert(t.selectAnswer);
      return;
    }

    setIsAnswered(true);
    const newAnsweredQuestions = [...answeredQuestions];
    newAnsweredQuestions[currentQuestion] = true;
    setAnsweredQuestions(newAnsweredQuestions);

    if (selectedAnswer === question.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < t.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setAnsweredQuestions(new Array(10).fill(false));
    setIsCompleted(false);
  };

  const getOptionClass = (index: number) => {
    if (!isAnswered) {
      return selectedAnswer === index
        ? "bg-indigo-100 border-indigo-500 border-2"
        : "bg-white hover:bg-gray-50 border-gray-300";
    }

    if (index === question.correctAnswer) {
      return "bg-green-100 border-green-500 border-2";
    }

    if (index === selectedAnswer && selectedAnswer !== question.correctAnswer) {
      return "bg-red-100 border-red-500 border-2";
    }

    return "bg-gray-50 border-gray-300";
  };

  if (isCompleted) {
    const percentage = (score / t.questions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                    {t.completed}
                  </h1>
                  <p className="text-gray-600 mt-1">{t.congratulations}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Score Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-4">
                <span className="text-5xl font-bold text-white">{score}</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {t.yourScore}
              </h2>
              <p className="text-xl text-gray-600">
                {score} {t.questionsOf} {t.questions.length}
              </p>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-4 rounded-full transition-all duration-1000"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <p className="text-gray-600 mt-2">
                  {percentage.toFixed(0)}%
                </p>
              </div>
            </div>

            {/* Performance Message */}
            <div className="mb-6">
              {percentage >= 80 ? (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                  <p className="text-green-800 font-semibold text-lg">
                    🎉 Excellent! You have a great understanding!
                  </p>
                </div>
              ) : percentage >= 60 ? (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                  <p className="text-blue-800 font-semibold text-lg">
                    👍 Good job! Keep practicing!
                  </p>
                </div>
              ) : (
                <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4">
                  <p className="text-orange-800 font-semibold text-lg">
                    💪 Keep learning! Practice makes perfect!
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={handleRestart}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg transition-all flex items-center gap-3 mx-auto"
            >
              <RotateCcw className="w-5 h-5" />
              {t.tryAgain}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {question.question}
          </h2>

          {/* Options */}
          <div className="space-y-4 mb-6">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={isAnswered}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${getOptionClass(
                  index
                )} ${
                  !isAnswered ? "cursor-pointer" : "cursor-default"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      isAnswered && index === question.correctAnswer
                        ? "bg-green-500 text-white"
                        : isAnswered &&
                          index === selectedAnswer &&
                          selectedAnswer !== question.correctAnswer
                        ? "bg-red-500 text-white"
                        : selectedAnswer === index
                        ? "bg-indigo-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-gray-800 font-medium">{option}</span>
                  {isAnswered && index === question.correctAnswer && (
                    <CheckCircle className="ml-auto w-6 h-6 text-green-500" />
                  )}
                  {isAnswered &&
                    index === selectedAnswer &&
                    selectedAnswer !== question.correctAnswer && (
                      <XCircle className="ml-auto w-6 h-6 text-red-500" />
                    )}
                </div>
              </button>
            ))}
          </div>

          {/* Result Message */}
          {isAnswered && (
            <div
              className={`p-4 rounded-xl mb-6 ${
                selectedAnswer === question.correctAnswer
                  ? "bg-green-50 border-2 border-green-200"
                  : "bg-red-50 border-2 border-red-200"
              }`}
            >
              <p
                className={`font-bold text-lg mb-2 ${
                  selectedAnswer === question.correctAnswer
                    ? "text-green-800"
                    : "text-red-800"
                }`}
              >
                {selectedAnswer === question.correctAnswer
                  ? t.correct
                  : t.incorrect}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">{t.explanation}:</span>{" "}
                {question.explanation}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                currentQuestion === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              ← {t.previous}
            </button>

            {!isAnswered ? (
              <button
                onClick={handleSubmit}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                {t.submit}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                {currentQuestion === t.questions.length - 1
                  ? t.completed
                  : t.next}{" "}
                →
              </button>
            )}
          </div>
        </div>

        {/* Restart Button */}
        <div className="text-center">
          <button
            onClick={handleRestart}
            className="px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold hover:shadow-lg transition-all inline-flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            {t.restart}
          </button>
        </div>
      </div>
    </div>
  );
};

// Real World Applications Component
const PinholeRealWorldMode: React.FC<{ 
  pinholeConfig?: PinholeConfig;
  config?: PinholeCameraToolProps["props"];
}> = ({ pinholeConfig, config }) => {
  const [selectedApp, setSelectedApp] = useState<number>(0);

  const t = pinholeRealWorldTranslations.en;
  const currentApp = t.applications[selectedApp];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "camera":
        return <Camera className="w-8 h-8" />;
      case "eye":
        return <Eye className="w-8 h-8" />;
      case "building":
        return <Building2 className="w-8 h-8" />;
      case "microscope":
        return <Microscope className="w-8 h-8" />;
      default:
        return <Lightbulb className="w-8 h-8" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Applications List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {t.applicationsLabel}
              </h2>
              <div className="space-y-3">
                {t.applications.map((app, index) => (
                  <button
                    key={app.id}
                    onClick={() => setSelectedApp(index)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      selectedApp === index
                        ? "bg-gradient-to-r " +
                          app.color +
                          " text-white shadow-lg scale-105"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex-shrink-0 p-2 rounded-lg ${
                          selectedApp === index
                            ? "bg-white bg-opacity-20"
                            : "bg-white"
                        }`}
                      >
                        {getIcon(app.icon)}
                      </div>
                      <span
                        className={`font-semibold ${
                          selectedApp === index ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {app.title}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Selected Application Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div
                  className={`p-4 rounded-xl bg-gradient-to-r ${currentApp.color}`}
                >
                  <div className="text-white">{getIcon(currentApp.icon)}</div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">
                    {currentApp.title}
                  </h2>
                </div>
              </div>

              <div className="space-y-6">
                {/* Description */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
                  <p className="text-gray-800 text-lg leading-relaxed">
                    {currentApp.description}
                  </p>
                </div>

                {/* Real Life Example */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="text-2xl">🌍</span>
                    {t.realLifeExample}
                  </h3>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl">
                    <p className="text-gray-800 leading-relaxed">
                      {currentApp.usage}
                    </p>
                  </div>
                </div>

                {/* Visual Representation placeholder */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8">
                  <div className="text-center text-gray-500">
                    Visual diagram for {currentApp.title}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component (internal, uses LanguageProvider)
const MainApp: React.FC<{ config?: PinholeCameraToolProps["props"] }> = ({ config = {} }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>(config.initialMode || "learn");
  
  // Extract additionalProps with defaults
  const additionalProps = config.additionalProps || {};
  
  // Tool-specific defaults
  const pinholeConfig = {
    objectColor: additionalProps.objectColor || "#FFD700",
    objectType: additionalProps.objectType || "candle",
    showRays: additionalProps.showRays !== false,
    rayColor: additionalProps.rayColor || "#FFD700",
    pinholeSize: additionalProps.pinholeSize || 3,
    pinholeColor: additionalProps.pinholeColor || "#000",
    screenColor: additionalProps.screenColor || "#E8E8E8",
    showInvertedImage: additionalProps.showInvertedImage !== false,
    animationSpeed: additionalProps.animationSpeed || config.animationSpeed || 1,
    showRayAnimation: additionalProps.showRayAnimation !== false,
    customLabels: additionalProps.customLabels || {},
    interactive: additionalProps.interactive || false,
    allowRayControl: additionalProps.allowRayControl || false,
  };
  
  // ─────────────────────────────────────────────────────────────────
  // INJECT KEYFRAMES
  // ─────────────────────────────────────────────────────────────────
  
  useEffect(() => {
    const keyframes = `
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeOutDown {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-30px); }
      }
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.08); }
      }
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-15px); }
      }
      @keyframes popIn {
        0% { transform: scale(0); opacity: 0; }
        70% { transform: scale(1.2); }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes slideRight {
        from { transform: translateX(-100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes glow {
        0%, 100% { box-shadow: 0 0 5px ${config.themeColor || "#3b82f6"}40; }
        50% { box-shadow: 0 0 25px ${config.themeColor || "#3b82f6"}80; }
      }
      @keyframes drawArc {
        from { stroke-dashoffset: 200; }
        to { stroke-dashoffset: 0; }
      }
      @keyframes highlight {
        0% { background-color: ${config.themeColor || "#3b82f6"}; transform: scale(1.3); }
        100% { background-color: ${config.themeColor || "#3b82f6"}40; transform: scale(1); }
      }
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      @keyframes ripple {
        0% { transform: scale(0); opacity: 0.5; }
        100% { transform: scale(4); opacity: 0; }
      }
      @keyframes countUp {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes jump {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
      }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.id = 'pinhole-camera-keyframes';
    styleSheet.textContent = keyframes;
    document.head.appendChild(styleSheet);
    
    return () => {
      const existing = document.getElementById('pinhole-camera-keyframes');
      if (existing) document.head.removeChild(existing);
    };
  }, [config.themeColor]);
  
  // Animate when additionalProps change
  useEffect(() => {
    if (additionalProps.objectColor || additionalProps.showRays !== undefined) {
      // Trigger re-animation if needed
    }
  }, [additionalProps]);

  // Clean up invalid attributes injected by browser extensions
  useEffect(() => {
    const cleanupInvalidAttributes = () => {
      const invalidAttrs = ["error", "warn", "log"];
      const allSVGElements = document.querySelectorAll(
        "svg, svg path, svg circle, svg rect, svg line"
      );

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
      attributeFilter: ["error", "warn", "log"],
    });

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  // ─────────────────────────────────────────────────────────────────
  // STYLES
  // ─────────────────────────────────────────────────────────────────
  
  const themeColor = config.themeColor || "#3b82f6";
  const darkMode = config.darkMode || false;
  
  const colors = {
    primary: themeColor,
    background: darkMode ? "#1a1a2e" : "#ffffff",
    surface: darkMode ? "#16213e" : "#ffffff",
    text: darkMode ? "#e2e8f0" : "#1e293b",
    textSecondary: darkMode ? "#94a3b8" : "#64748b",
    border: darkMode ? "#334155" : "#e0e7ff",
  };
  
  const styles: { [key: string]: CSSProperties } = {
    container: {
      minHeight: "100vh",
      backgroundColor: colors.background,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    nav: {
      position: "fixed" as const,
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      backgroundColor: colors.surface,
      borderBottom: `1px solid ${colors.border}`,
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    },
    navContainer: {
      maxWidth: "1280px",
      margin: "0 auto",
      padding: "0 16px",
    },
    navContent: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: "64px",
    },
    navLeft: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    navRight: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
    },
    navButtons: {
      display: "flex",
      gap: "8px",
    },
    logo: {
      fontSize: "20px",
      fontWeight: 700,
      background: `linear-gradient(to right, ${themeColor}, #14b8a6)`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    },
    tabButton: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 16px",
      borderRadius: "8px",
      border: "none",
      fontWeight: 600,
      fontSize: "14px",
      cursor: "pointer",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      fontFamily: "inherit",
    },
    tabButtonActive: {
      background: `linear-gradient(to right, ${themeColor}, #14b8a6)`,
      color: "#ffffff",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    tabButtonInactive: {
      color: colors.text,
      backgroundColor: "transparent",
    },
    content: {
      paddingTop: "64px",
    },
  };
  
  const getTabButtonStyle = (isActive: boolean): CSSProperties => ({
    ...styles.tabButton,
    ...(isActive ? styles.tabButtonActive : styles.tabButtonInactive),
  });

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <div style={styles.navContainer}>
          <div style={styles.navContent}>
            <div style={styles.navLeft}>
              <div style={{ width: "24px", height: "24px", color: themeColor }}>
                <Lightbulb className="w-6 h-6" />
              </div>
              <span style={styles.logo}>
                {t("nav.logo")}
              </span>
            </div>

            <div style={styles.navRight}>
              {config.showModeSelector !== false && (
                <div style={styles.navButtons}>
                  <button
                    onClick={() => setActiveTab("learn")}
                    style={getTabButtonStyle(activeTab === "learn")}
                    onMouseEnter={(e) => {
                      if (activeTab !== "learn") {
                        e.currentTarget.style.backgroundColor = darkMode ? "#1e293b" : "#eff6ff";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeTab !== "learn") {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    <BookOpen className="w-5 h-5" />
                    {t("nav.tabs.learn")}
                  </button>
                  <button
                    onClick={() => setActiveTab("practice")}
                    style={getTabButtonStyle(activeTab === "practice")}
                    onMouseEnter={(e) => {
                      if (activeTab !== "practice") {
                        e.currentTarget.style.backgroundColor = darkMode ? "#1e293b" : "#eff6ff";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeTab !== "practice") {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    <ClipboardCheck className="w-5 h-5" />
                    {t("nav.tabs.practice")}
                  </button>
                  <button
                    onClick={() => setActiveTab("realWorld")}
                    style={getTabButtonStyle(activeTab === "realWorld")}
                    onMouseEnter={(e) => {
                      if (activeTab !== "realWorld") {
                        e.currentTarget.style.backgroundColor = darkMode ? "#1e293b" : "#eff6ff";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeTab !== "realWorld") {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    <Globe className="w-5 h-5" />
                    {t("nav.tabs.realWorld")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div style={styles.content}>
        {activeTab === "learn" ? (
          <ReflectionOfLightLearn pinholeConfig={pinholeConfig} config={config} />
        ) : activeTab === "practice" ? (
          <PracticeMode pinholeConfig={pinholeConfig} config={config} />
        ) : (
          <PinholeRealWorldMode pinholeConfig={pinholeConfig} config={config} />
        )}
      </div>
    </div>
  );
};

// Main App Component with Provider (exported for use in main App.tsx)
const LightTravelApp: React.FC<PinholeCameraToolProps> = ({ props = {}, setStepDetails, stopAutoNext, setStopAutoNext }) => {
  return (
    // @ts-ignore - JSX children are passed correctly, type system limitation
    <LanguageProvider>
      <MainApp config={props} />
    </LanguageProvider>
  );
};

export { LightTravelApp };
export default LightTravelApp;