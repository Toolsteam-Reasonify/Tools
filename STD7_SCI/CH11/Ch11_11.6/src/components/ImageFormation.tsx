import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
  type ReactNode,
} from "react";
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

// Translation type definitions merged from a.tsx
export interface Translation {
  nav: {
    logo: string;
    tabs: {
      learn: string;
      practice: string;
      realWorld: string;
    };
  };
  language: {
    en: string;
    hi: string;
    gu: string;
    selectorLabel: string;
  };
  controls: {
    step: string;
    of: string;
    previous: string;
    next: string;
    play: string;
    pause: string;
    reset: string;
  };
  shadowSimulator: {
    title: string;
    subtitle: string;
    objects: {
      title: string;
      cat: string;
      superhero: string;
      bottle: string;
      glass: string;
      paper: string;
      football: string;
      tree: string;
      selected: string;
    };
    lightSize: {
      title: string;
      small: string;
      large: string;
      smallFeedback: string;
      largeFeedback: string;
    };
    shadowFacts: {
      title: string;
      opaque: string;
      translucent: string;
      transparent: string;
      currentObject: {
        opaque: string;
        translucent: string;
        semiTransparent: string;
      };
    };
    controls: {
      showRays: string;
      dragHelper: string;
      screenLabel: string;
      lightLabel: string;
      dragObject: string;
    };
    feedback: {
      shadowBig: string;
      shadowTiny: string;
      shadowShrinking: string;
      objectBehindLight: string;
      objectBeyondScreen: string;
    };
    infoBox: {
      title: string;
      hugeShadow: string;
      tinyShadow: string;
      normalShadow: string;
      softEdges: string;
      sharpEdges: string;
      positionObject: string;
    };
  };
  canvas: {
    intro: {
      title: string;
      questionMark: string;
    };
    matchbox_setup: {
      instruction: string;
      boxLabel: string;
    };
    matchbox_aligned: {
      message: string;
    };
    matchbox_misaligned: {
      message: string;
    };
    pipe_intro: {
      question: string;
    };
    pipe_straight: {
      message: string;
    };
    pipe_bent: {
      message: string;
    };
    conclusion: {
      title: string;
      subtitle: string;
    };
  };
  learn: {
    title: string;
    subtitle: string;
    demos: {
      law: string;
      types: string;
    };
    canvas: {
      normal: string;
      incidentRay: string;
      reflectedRay: string;
      incidentAngle: string;
      reflectedAngle: string;
      scenarios?: Array<{
        id: number;
        title: string;
        situation: string;
        question: string;
        options: string[];
        correctAnswer: number;
        explanation: string;
        realWorldTip: string;
        imageEmoji: string;
      }>;
    };
    controls: {
      title: string;
      angleOfIncidence: string;
      showNormalLine: string;
      showAngleMeasurements: string;
      animateLightTravel: string;
      previous?: string;
      checkAnswer?: string;
      nextScenario?: string;
      scenarioCount?: string;
    };
    concepts: {
      title: string;
      law: {
        title: string;
        description: string;
        point1: string;
        point2: string;
        point3: string;
        redRay: string;
        redRayDesc: string;
        greenRay: string;
        greenRayDesc: string;
        yellowLine: string;
        yellowLineDesc: string;
      };
      types: {
        regularTitle: string;
        regularDesc: string;
        diffuseTitle: string;
        diffuseDesc: string;
      };
    };
    infoBox: {
      lawTitle: string;
      lawFormula: string;
      lawDesc1: string;
      lawDesc2: string;
    };
    types: {
      regularTitle: string;
      diffuseTitle: string;
      smoothSurface: string;
      roughSurface: string;
      regularDesc: string;
      diffuseDesc: string;
    };
    headers?: {
      realWorldSituation: string;
      scientificExplanation: string;
      realWorldApplication: string;
    };
    progress?: {
      title: string;
      completed: string;
      congrats: string;
    };
    facts?: {
      title: string;
      list: string[];
    };
    simulation?: {
      title: string;
      show: string;
      hide: string;
      intro: string;
      shadowSize: string;
      large: string;
      medium: string;
      small: string;
      puppetPosLabel: string;
      puppetShapeLabel: string;
      shapes: {
        hand: {
          label: string;
          emoji: string;
        };
        bird: {
          label: string;
          emoji: string;
        };
        dog: {
          label: string;
          emoji: string;
        };
      };
      tip: string;
    };
  };
  practice: {
    title: string;
    subtitle?: string;
    stats: {
      score: string;
      accuracy: string;
      progress: string;
    };
    exercise: string;
    difficulty: {
      easy: string;
      medium: string;
      hard: string;
    };
    completed: string;
    restart: string;
    submitAnswer: string;
    nextExercise: string;
    completedAll: string;
    congratulations: string;
    completedAllText: string;
    accuracyLabel: string;
    excellent: string;
    notQuiteRight: string;
    interactive: {
      mirrorAngle: string;
      tip: string;
      lightSource: string;
      mirror: string;
      target: string;
      perfect: string;
    };
    drawing: {
      instruction: string;
      clearDrawing: string;
      tip: string;
    };
    exercises: {
      [key: string]: {
        question: string;
        options?: string[];
        explanation: string;
      };
    };
    trueFalse: {
      true: string;
      false: string;
    };
    overview: {
      title: string;
      subtitle: string;
      backToPractice: string;
      viewOverview: string;
      correct: string;
      incorrect: string;
      accuracy: string;
      exerciseList: string;
      yourAnswer: string;
      correctAnswer: string;
      explanation: string;
      notAnswered: string;
      drawn: string;
      notDrawn: string;
      drawingRequired: string;
    };
    scenarios?: Array<{
      id: number;
      title: string;
      situation: string;
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
      realWorldTip: string;
      imageEmoji: string;
    }>;
    controls?: {
      previous: string;
      checkAnswer: string;
      nextScenario: string;
      scenarioCount: string;
    };
    headers?: {
      realWorldSituation: string;
      scientificExplanation: string;
      realWorldApplication: string;
    };
    progress?: {
      title: string;
      completed: string;
      congrats: string;
    };
    facts?: {
      title: string;
      list: string[];
    };
    simulation?: {
      title: string;
      show: string;
      hide: string;
      intro: string;
      shadowSize: string;
      large: string;
      medium: string;
      small: string;
      puppetPosLabel: string;
      puppetShapeLabel: string;
      shapes: {
        hand: {
          label: string;
          emoji: string;
        };
        bird: {
          label: string;
          emoji: string;
        };
        dog: {
          label: string;
          emoji: string;
        };
      };
      tip: string;
    };
  };
  realWorld: {
    title: string;
    subtitle: string;
    previous?: string;
    next?: string;
    keyTakeaway?: string;
    keyTakeawayText?: string;
    howItWorks?: string;
    funFacts?: string;
    example?: string;
    searchPlaceholder?: string;
    allCategories?: string;
    loading?: string;
    applications: Array<{
      id: number;
      title: string;
      category?: string;
      description: string;
      example?: string;
      icon?: string;
      howItWorks?: string[];
      funFacts?: string[];
      canvasLabel?: string;
    }>;
  };
  planeMirrorLearn: {
    title: string;
    subtitle: string;
    demos: {
      basic: string;
      properties: string;
      interactive: string;
    };
    controls: {
      title: string;
      objectDistance: string;
      objectType: string;
      showRayDiagram: string;
      showMeasurements: string;
      showConstructionLines: string;
      candle: string;
      person: string;
      flower: string;
      ball: string;
    };
    canvas: {
      object: string;
      real: string;
      image: string;
      virtual: string;
      mirrorLabel: string;
      objectReal: string;
      imageVirtual: string;
      screenLabel: string;
      noImageFormsHere: string;
      unitCm: string;
      propertiesTitle: string;
      keyPoints: string;
      basicPoints: {
        point1: string;
        point2: string;
        point3: string;
        point4: string;
      };
      interactivePoints: {
        point1: string;
        point2: string;
        point3: string;
      };
      properties: {
        virtualImage: {
          title: string;
          description: string;
        };
        sameSize: {
          title: string;
          description: string;
        };
        equalDistance: {
          title: string;
          description: string;
        };
        laterallyInverted: {
          title: string;
          description: string;
        };
        upright: {
          title: string;
          description: string;
        };
      };
    };
    content: {
      title: string;
      howImagesForm: string;
      howImagesFormText: string;
      imageCharacteristics: string;
      characteristics: {
        virtual: string;
        erect: string;
        sameSize: string;
        equalDistance: string;
        laterallyInverted: string;
      };
      formula: string;
      formulaText: string;
      realLifeExamples: string;
      realLifeExamplesText: string;
    };
  };
  planeMirrorPractice: {
    title: string;
    subtitle: string;
    progress: {
      question: string;
      of: string;
      score: string;
    };
    difficulty: {
      easy: string;
      medium: string;
      hard: string;
    };
    feedback: {
      correct: string;
      incorrect: string;
    };
    buttons: {
      nextQuestion: string;
      viewResults: string;
      tryAgain: string;
    };
    quizComplete: {
      title: string;
      yourScore: string;
      perfect: string;
      greatJob: string;
      keepPracticing: string;
    };
    questions: Array<{
      id: number;
      question: string;
      options: string[];
      explanation: string;
      difficulty: string;
    }>;
  };
  planeMirrorRealWorld: {
    title: string;
    subtitle: string;
    driverSeesAmbulance: string;
    scenarios: Array<{
      id: number;
      title: string;
      description: string;
      scenario: string;
    }>;
  };
}

export interface Translations {
  en: Translation;
  hi: Translation;
  gu: Translation;
}

// Translation type definition (for backward compatibility with existing code)
type TranslationValue =
  | string
  | string[]
  | number
  | { [key: string]: TranslationValue }
  | Array<{ [key: string]: TranslationValue }>;

// Translation system - Inline translations object
const translations: Translations = {
  en: {
    nav: {
      logo: "Reflection of Light",
      tabs: {
        learn: "Learn",
        practice: "Practice",
        realWorld: "Real World",
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
    shadowSimulator: {
      title: "Shadow Maker Simulator",
      subtitle: "Play with light and shadows like a scientist!",
      objects: {
        title: "Choose Your Object!",
        cat: "Cat Cut-out",
        superhero: "Superhero",
        bottle: "Water Bottle",
        glass: "Frosted Glass",
        paper: "Paper Sheet",
        football: "Football",
        tree: "Tree",
        selected: "selected! Drag it around!",
      },
      lightSize: {
        title: "Light Size",
        small: "Small Light (Sharp Shadow)",
        large: "Large Light (Soft Shadow)",
        smallFeedback: "Sharp shadow activated!",
        largeFeedback: "Soft, blurry shadow mode!",
      },
      shadowFacts: {
        title: "Shadow Facts!",
        opaque: "Opaque objects = Dark shadows",
        translucent: "Translucent objects = Faint shadows",
        transparent: "Transparent objects = Almost no shadow",
        currentObject: {
          opaque: "Opaque",
          translucent: "Translucent",
          semiTransparent: "Semi-transparent",
        },
      },
      controls: {
        showRays: "Show Light Rays",
        dragHelper: "Drag the light, object, and screen to see shadows change!",
        screenLabel: "Screen (Drag me!)",
        lightLabel: "Light",
        dragObject: "Drag me!",
      },
      feedback: {
        shadowBig: "Whoa! Your shadow grew SUPER BIG!",
        shadowTiny: "Nice move! You made a tiny shadow!",
        shadowShrinking: "Getting closer! Shadow shrinking!",
        objectBehindLight: "Object is behind the light source! No shadow.",
        objectBeyondScreen: "Object is beyond the screen! No shadow.",
      },
      infoBox: {
        title: "What's Happening?",
        hugeShadow: "HUGE shadow! The object is super close to the light!",
        tinyShadow: "Tiny shadow! The object is close to the screen!",
        normalShadow: "Normal shadow size! Try moving things around!",
        softEdges: "Soft edges because the light is BIG!",
        sharpEdges: "Sharp edges because the light is SMALL!",
        positionObject:
          "Position the object between the light source and the screen to see its shadow!",
      },
    },
    canvas: {
      intro: {
        title: "Does Light Travel in a Straight Line?",
        questionMark: "?",
      },
      matchbox_setup: {
        instruction: "Make holes in the same position on each matchbox",
        boxLabel: "Box",
      },
      matchbox_aligned: {
        message: "Aligned holes - Light passes through!",
      },
      matchbox_misaligned: {
        message: "Misaligned holes - Light is blocked!",
      },
      pipe_intro: {
        question: "Can we see through a pipe?",
      },
      pipe_straight: {
        message: "Straight pipe - You can see the flame!",
      },
      pipe_bent: {
        message: "Bent pipe - Cannot see the flame!",
      },
      conclusion: {
        title: "Light Travels in a Straight Line!",
        subtitle: "Both experiments confirm this important property of light",
      },
    },
    learn: {
      title: "✨ Reflection of Light ✨",
      subtitle: "Interactive demonstrations of how light reflects off surfaces",
      demos: {
        law: "📐 Law of Reflection",
        types: "🔄 Types of Reflection",
      },
      canvas: {
        normal: "Normal",
        incidentRay: "Incident Ray",
        reflectedRay: "Reflected Ray",
        incidentAngle: "∠i = {{angle}}°",
        reflectedAngle: "∠r = {{angle}}°",
      },
      controls: {
        title: "⚙️ Controls",
        angleOfIncidence: "Angle of Incidence:",
        showNormalLine: "Show Normal Line",
        showAngleMeasurements: "Show Angle Measurements",
        animateLightTravel: "Animate Light Travel",
      },
      concepts: {
        title: "📚 Key Concepts",
        law: {
          title: "The Law of Reflection",
          description: "states that when light reflects off a surface:",
          point1:
            "The incident ray, reflected ray, and normal all lie in the same plane",
          point2:
            "The angle of incidence (∠i) equals the angle of reflection (∠r)",
          point3:
            "Both angles are measured from the normal (perpendicular line to the surface)",
          redRay: "Red ray:",
          redRayDesc: "Incident light approaching the mirror",
          greenRay: "Green ray:",
          greenRayDesc: "Reflected light bouncing off the mirror",
          yellowLine: "Yellow dashed line:",
          yellowLineDesc: "Normal (perpendicular to surface)",
        },
        types: {
          regularTitle: "Regular (Specular) Reflection:",
          regularDesc:
            "Occurs on smooth surfaces like mirrors and calm water. Parallel incident rays remain parallel after reflection, creating clear images.",
          diffuseTitle: "Diffuse Reflection:",
          diffuseDesc:
            "Occurs on rough surfaces like paper, walls, and clothing. Parallel incident rays scatter in different directions, which is why we can see most objects from any angle but they don't form clear reflections.",
        },
      },
      infoBox: {
        lawTitle: "Law of Reflection:",
        lawFormula: "∠i = ∠r",
        lawDesc1: "Angle of incidence equals",
        lawDesc2: "angle of reflection",
      },
      types: {
        regularTitle: "Regular Reflection",
        diffuseTitle: "Diffuse Reflection",
        smoothSurface: "Smooth Surface",
        roughSurface: "Rough Surface",
        regularDesc: "Parallel incident rays remain parallel after reflection",
        diffuseDesc: "Parallel incident rays scatter in different directions",
      },
    },
    practice: {
      title: "Practice Mode",
      stats: {
        score: "Score",
        accuracy: "Accuracy",
        progress: "Progress",
      },
      exercise: "Exercise {{num}}",
      difficulty: {
        easy: "Easy",
        medium: "Medium",
        hard: "Hard",
      },
      completed: "Completed",
      restart: "Restart",
      submitAnswer: "Submit Answer",
      nextExercise: "Next Exercise",
      completedAll: "Completed!",
      congratulations: "🎉 Congratulations!",
      completedAllText:
        "You've completed all exercises with a score of {{score}}/{{total}}!",
      accuracyLabel: "Accuracy:",
      excellent: "🎉 Excellent!",
      notQuiteRight: "❌ Not quite right",
      interactive: {
        mirrorAngle: "Mirror Angle:",
        tip: "💡 Tip: Adjust the mirror to make the green beam hit the red target!",
        lightSource: "Light Source",
        mirror: "Mirror ({{angle}}°)",
        target: "Target",
        perfect: "✓ Perfect!",
      },
      drawing: {
        instruction: "Draw the reflected ray:",
        clearDrawing: "Clear Drawing",
        tip: "✏️ Use your mouse to draw the path of the reflected light ray from the mirror",
      },
      exercises: {
        "1": {
          question:
            "What is the change in direction of light by a mirror called?",
          options: ["Refraction", "Reflection", "Dispersion", "Absorption"],
          explanation:
            "The change in direction of light by a mirror is called reflection. When light hits a shiny surface, it bounces back.",
        },
        "2": {
          question: "Which of the following is a luminous object?",
          options: ["Moon", "Mirror", "Sun", "Wall"],
          explanation:
            "The Sun is a luminous object because it emits its own light. The Moon, mirror, and wall are non-luminous objects that only reflect light.",
        },
        "3": {
          question: "How does light travel?",
          options: [
            "In curved lines",
            "In zigzag patterns",
            "In straight lines",
            "In random directions",
          ],
          explanation:
            "Light always travels in straight lines. This can be observed when you shine a torch or see sunbeams through windows.",
        },
        "4": {
          question:
            "The image formed by a plane mirror can be obtained on a screen.",
          explanation:
            "False. The image formed by a plane mirror cannot be obtained on a screen because it is a virtual image formed behind the mirror.",
        },
        "5": {
          question:
            "Adjust the mirror angle to direct the reflected light to the target spot!",
          explanation:
            "By changing the angle of the mirror, you can control where the reflected light goes. This is how periscopes and other optical instruments work.",
        },
        "6": {
          question:
            "What happens when you tilt a mirror while sunlight falls on it?",
          options: [
            "The reflected light position stays the same",
            "The reflected light position changes",
            "The sunlight stops reflecting",
            "The mirror becomes transparent",
          ],
          explanation:
            "When you tilt the mirror, the angle at which light hits it changes, so the direction of reflected light also changes.",
        },
        "7": {
          question: "Draw the path of reflected light from the mirror!",
          explanation:
            "The reflected ray should travel in a straight line from the mirror at an angle equal to the incident angle.",
        },
        "8": {
          question: "Why can you see your face in a mirror?",
          options: [
            "The mirror emits light",
            "Light from your face reflects off the mirror and enters your eyes",
            "Your face passes through the mirror",
            "The mirror absorbs light",
          ],
          explanation:
            "You see your face because light from your face travels to the mirror, reflects off it, and enters your eyes. This reflected light creates the image you see.",
        },
      },
      trueFalse: {
        true: "TRUE",
        false: "FALSE",
      },
      overview: {
        title: "Exercise Overview",
        subtitle: "Review your answers and see all correct solutions",
        backToPractice: "Back to Practice",
        viewOverview: "View Overview",
        correct: "Correct",
        incorrect: "Incorrect",
        accuracy: "Accuracy",
        exerciseList: "All Exercises",
        yourAnswer: "Your Answer",
        correctAnswer: "Correct Answer",
        explanation: "Explanation",
        notAnswered: "Not answered",
        drawn: "Drawing submitted",
        notDrawn: "No drawing",
        drawingRequired: "Drawing required",
      },
    },
    realWorld: {
      title: "Real World Applications",
      subtitle: "Discover how reflection of light is used in everyday life",
      previous: "Previous",
      next: "Next",
      keyTakeaway: "Key Takeaway",
      keyTakeawayText:
        "Reflection of light is not just a physics concept - it's a fundamental principle that powers countless technologies we use every day. From the mirror you use each morning to the satellites orbiting Earth, reflection helps us see, communicate, and understand our world better!",
      howItWorks: "How Does It Work?",
      funFacts: "Fun Facts",
      example: "Example:",
      applications: [
        {
          id: 1,
          title: "Mirrors in Daily Life",
          category: "Everyday Use",
          description:
            "We use mirrors every day for grooming, dressing, and checking our appearance. Reflection helps us see ourselves!",
          example: "Bathroom mirrors, dressing table mirrors, wardrobe mirrors",
          howItWorks: [
            "Light from your body and surroundings hits the mirror surface",
            "The smooth glass surface reflects light in a predictable way",
            "Reflected light enters your eyes, creating a virtual image",
            "The image appears to be behind the mirror at the same distance",
          ],
          funFacts: [
            "Ancient mirrors were made of polished bronze or copper",
            "The first glass mirrors were made in Venice around 1317",
            "Modern mirrors use a thin layer of aluminum or silver coating",
          ],
          canvasLabel: "You see your reflection!",
        },
        {
          id: 2,
          title: "Rear-View Mirrors in Vehicles",
          category: "Transportation",
          description:
            "Cars, bikes, and trucks use rear-view mirrors to see behind them without turning around, making driving safer.",
          example:
            "Car rear-view mirrors, side mirrors (wing mirrors), bike mirrors",
          howItWorks: [
            "Mirrors are positioned to reflect the view from behind the vehicle",
            "Light from vehicles and objects behind reflects into the mirror",
            "Driver can see reflected image while looking forward",
            "Convex mirrors are often used to provide wider field of view",
          ],
          funFacts: [
            "Rear-view mirrors were invented in 1911 for race cars",
            'Side mirrors have a note: "Objects are closer than they appear"',
            "Some modern cars use cameras instead of mirrors",
          ],
          canvasLabel: "See behind without turning!",
        },
        {
          id: 3,
          title: "Periscopes in Submarines",
          category: "Military & Marine",
          description:
            "Periscopes use two mirrors to let submarine crews see above water while staying underwater.",
          example:
            "Submarine periscopes, trench periscopes, crowd viewing at parades",
          howItWorks: [
            "Two plane mirrors are placed at 45° angles in a tube",
            "Top mirror reflects light from above down into the tube",
            "Bottom mirror reflects this light horizontally to the viewer",
            "Light travels in straight lines between the two reflections",
          ],
          funFacts: [
            "Periscopes can be several meters long",
            "Modern submarines use cameras instead of optical periscopes",
            "You can make a simple periscope with cardboard and mirrors",
          ],
          canvasLabel: "See above while underwater!",
        },
        {
          id: 4,
          title: "Solar Cookers",
          category: "Renewable Energy",
          description:
            "Solar cookers use curved mirrors to reflect and focus sunlight, creating enough heat to cook food.",
          example:
            "Solar ovens, solar water heaters, concentrated solar power plants",
          howItWorks: [
            "Parabolic (curved) mirrors reflect sunlight to a focal point",
            "All reflected rays converge at one spot, concentrating energy",
            "Temperature at focal point can reach 200-300°C",
            "Food placed at focal point gets cooked by concentrated heat",
          ],
          funFacts: [
            "Solar cookers need no fuel - they run on free sunlight",
            "They work best on sunny days between 10 AM and 3 PM",
            "Large solar plants use thousands of mirrors to generate electricity",
          ],
          canvasLabel: "Sunlight focused to cook food!",
        },
        {
          id: 5,
          title: "Telescopes",
          category: "Astronomy",
          description:
            "Reflecting telescopes use curved mirrors to collect and focus light from distant stars and planets.",
          example:
            "Hubble Space Telescope, James Webb Space Telescope, observatory telescopes",
          howItWorks: [
            "Large curved (concave) mirror collects light from distant objects",
            "Mirror reflects and focuses light to a point",
            "Secondary mirror redirects focused light to eyepiece or camera",
            "Larger mirrors can collect more light, seeing fainter objects",
          ],
          funFacts: [
            "Isaac Newton invented the reflecting telescope in 1668",
            "The largest telescope mirror is 10.4 meters in diameter",
            "Hubble Telescope has taken over 1.5 million observations",
          ],
          canvasLabel: "Collect light from distant stars!",
        },
        {
          id: 6,
          title: "Dental Mirrors",
          category: "Healthcare",
          description:
            "Dentists use small mirrors to see all areas inside your mouth, including hard-to-see places.",
          example:
            "Dental examination mirrors, throat examination mirrors, surgical mirrors",
          howItWorks: [
            "Small concave or plane mirror attached to a handle",
            "Dentist positions mirror to see behind teeth and gums",
            "Light reflects off mirror, showing hidden areas",
            "Mirror can also reflect light into dark areas of mouth",
          ],
          funFacts: [
            "Dental mirrors are usually double-sided",
            "They are sterilized after each patient",
            "Some dental mirrors have built-in LED lights",
          ],
          canvasLabel: "See hidden areas in mouth!",
        },
        {
          id: 7,
          title: "Security Mirrors",
          category: "Safety & Security",
          description:
            "Convex mirrors are used in stores, parking lots, and roads to provide a wide field of view for safety.",
          example:
            "Store surveillance mirrors, blind spot mirrors on roads, ATM security mirrors",
          howItWorks: [
            "Convex (curved outward) mirrors reflect light over a wide angle",
            "They show a larger area than plane mirrors",
            "Images appear smaller but cover more space",
            "Help see around corners and blind spots",
          ],
          funFacts: [
            "Convex mirrors always produce virtual, upright images",
            "They are also used at dangerous road turns",
            "Shop mirrors can cover entire store aisles",
          ],
          canvasLabel: "Wide view for safety!",
        },
        {
          id: 8,
          title: "Smartphone Cameras",
          category: "Technology",
          description:
            "Phone cameras use multiple mirrors and lenses to capture photos. The front camera uses reflection for selfies.",
          example: "Smartphone selfie cameras, digital cameras, webcams",
          howItWorks: [
            "Light from scene passes through camera lens",
            "Small mirror or prism redirects light to sensor",
            "Sensor captures reflected light as digital image",
            "Front camera shows mirrored preview so you can frame selfie",
          ],
          funFacts: [
            "Modern phones have 3-5 different camera lenses",
            "Periscope cameras in phones use mirrors to enable zoom",
            "Over 1.4 trillion photos are taken every year",
          ],
          canvasLabel: "Mirror preview for selfies!",
        },
      ],
    },
    planeMirrorLearn: {
      title: "🪞 Image Formation in Plane Mirror 🪞",
      subtitle: "Explore how plane mirrors create virtual images",
      demos: {
        basic: "📐 Basic Formation",
        properties: "✨ Image Properties",
        interactive: "🎮 Interactive Demo",
      },
      controls: {
        title: "⚙️ Controls",
        objectDistance: "Object Distance from Mirror",
        objectType: "Object Type",
        showRayDiagram: "Show Ray Diagram",
        showMeasurements: "Show Measurements",
        showConstructionLines: "Show Construction Lines",
        candle: "candle",
        person: "person",
        flower: "flower",
        ball: "ball",
      },
      canvas: {
        object: "Object",
        real: "(Real)",
        image: "Image",
        virtual: "(Virtual)",
        mirrorLabel: "MIRROR",
        objectReal: "OBJECT (Real)",
        imageVirtual: "IMAGE (Virtual)",
        screenLabel: "Screen",
        noImageFormsHere: "(No image forms here)",
        unitCm: "cm",
        propertiesTitle: "Properties of Image in Plane Mirror",
        keyPoints: "📐 Key Points:",
        basicPoints: {
          point1: "• Image is virtual (behind mirror)",
          point2: "• Same size as object",
          point3: "• Equal distance from mirror",
          point4: "• Laterally inverted",
        },
        interactivePoints: {
          point1: "• Use slider to move object",
          point2: "• Notice image moves equally",
          point3: "• Distance always remains equal",
        },
        properties: {
          virtualImage: {
            title: "1. Virtual Image",
            description:
              "Image forms behind the mirror, cannot be projected on screen",
          },
          sameSize: {
            title: "2. Same Size",
            description: "Image size equals object size (magnification = 1)",
          },
          equalDistance: {
            title: "3. Equal Distance",
            description: "Image distance = Object distance from mirror",
          },
          laterallyInverted: {
            title: "4. Laterally Inverted",
            description: "Left and right sides appear swapped",
          },
          upright: {
            title: "5. Upright/Erect",
            description: "Image has same orientation as object",
          },
        },
      },
      content: {
        title: "📚 Understanding Image Formation",
        howImagesForm: "How Images Form:",
        howImagesFormText:
          "When light rays from an object hit a plane mirror, they reflect according to the law of reflection. The reflected rays appear to come from a point behind the mirror, creating a virtual image.",
        imageCharacteristics: "Image Characteristics:",
        characteristics: {
          virtual:
            "Virtual: The image cannot be projected on a screen as light doesn't actually pass through it",
          erect: "Erect: The image is upright, same orientation as the object",
          sameSize:
            "Same Size: The image has the same dimensions as the object",
          equalDistance:
            "Equal Distance: Image distance from mirror equals object distance",
          laterallyInverted:
            "Laterally Inverted: Left and right sides are swapped",
        },
        formula: "Formula:",
        formulaText:
          "For plane mirrors, if object distance is d, then image distance is also d (behind the mirror). Magnification = 1 (same size).",
        realLifeExamples: "Real-Life Examples:",
        realLifeExamplesText:
          "Looking at yourself in a bathroom mirror, rear-view mirrors in vehicles, dressing room mirrors, and periscopes all use plane mirror image formation.",
      },
    },
    planeMirrorPractice: {
      title: "📝 Plane Mirror - Practice Mode",
      subtitle: "Test your knowledge with interactive questions",
      progress: {
        question: "Question",
        of: "of",
        score: "Score",
      },
      difficulty: {
        easy: "easy",
        medium: "medium",
        hard: "hard",
      },
      feedback: {
        correct: "✓ Correct!",
        incorrect: "✗ Incorrect",
      },
      buttons: {
        nextQuestion: "Next Question →",
        viewResults: "View Results →",
        tryAgain: "Try Again 🔄",
      },
      quizComplete: {
        title: "Quiz Complete!",
        yourScore: "Your Score:",
        perfect: "Perfect! You have mastered plane mirror concepts! 🌟",
        greatJob: "Great job! You have a strong understanding! 👏",
        keepPracticing:
          "Keep practicing! Review the concepts and try again! 💪",
      },
      questions: [
        {
          id: 1,
          question: "What type of image is formed by a plane mirror?",
          options: [
            "Real and inverted",
            "Virtual and erect",
            "Real and erect",
            "Virtual and inverted",
          ],
          explanation:
            "A plane mirror always forms a VIRTUAL and ERECT image. Virtual means the image cannot be projected on a screen, and erect means it has the same orientation as the object.",
          difficulty: "easy",
        },
        {
          id: 2,
          question:
            "If an object is placed 5 cm in front of a plane mirror, how far behind the mirror will the image appear?",
          options: ["2.5 cm", "5 cm", "10 cm", "15 cm"],
          explanation:
            "The image distance equals the object distance. If the object is 5 cm in front, the image appears 5 cm behind the mirror. This is one of the fundamental properties of plane mirrors.",
          difficulty: "easy",
        },
        {
          id: 3,
          question: "What is the magnification produced by a plane mirror?",
          options: ["0.5", "1", "2", "Variable"],
          explanation:
            "Magnification = Image height / Object height. For plane mirrors, the image size equals object size, so magnification = 1. This means no enlargement or reduction occurs.",
          difficulty: "medium",
        },
        {
          id: 4,
          question:
            "Why does the word 'AMBULANCE' appear reversed on the front of ambulances?",
          options: [
            "It's a design choice",
            "So drivers see it correctly in their rear-view mirrors",
            "To make it look unique",
            "It's written in a different language",
          ],
          explanation:
            "The word is laterally inverted so that when drivers look in their rear-view mirrors (which are plane mirrors), they see the word correctly and can identify the ambulance quickly.",
          difficulty: "medium",
        },
        {
          id: 5,
          question:
            "A person stands 2 meters from a plane mirror. What is the distance between the person and their image?",
          options: ["2 meters", "4 meters", "1 meter", "3 meters"],
          explanation:
            "The person is 2m in front of the mirror, and the image is 2m behind the mirror. Total distance = 2m + 2m = 4 meters. This is object distance + image distance.",
          difficulty: "medium",
        },
        {
          id: 6,
          question:
            "Which of the following is NOT a characteristic of an image formed by a plane mirror?",
          options: [
            "Same size as object",
            "Laterally inverted",
            "Can be projected on screen",
            "Appears as far behind mirror as object is in front",
          ],
          explanation:
            "Virtual images CANNOT be projected on a screen because light rays don't actually pass through the image position. All other options are true characteristics of plane mirror images.",
          difficulty: "hard",
        },
        {
          id: 7,
          question:
            "If you raise your right hand in front of a mirror, which hand appears to be raised in the image?",
          options: ["Right hand", "Left hand", "Both hands", "Neither hand"],
          explanation:
            "Due to lateral inversion, your right hand appears as the left hand of your mirror image. This is why when you raise your right hand, the image appears to raise its left hand.",
          difficulty: "easy",
        },
        {
          id: 8,
          question:
            "A 6 ft tall person stands in front of a plane mirror. What is the height of the image?",
          options: ["3 ft", "6 ft", "12 ft", "9 ft"],
          explanation:
            "The image height equals the object height in a plane mirror. Since magnification = 1, a 6 ft tall person produces a 6 ft tall image.",
          difficulty: "easy",
        },
        {
          id: 9,
          question:
            "What happens to the image if you move closer to a plane mirror?",
          options: [
            "Image size increases",
            "Image moves closer to mirror from behind",
            "Image size decreases",
            "Image becomes real",
          ],
          explanation:
            "As you move closer, the image also moves closer to the mirror from behind, maintaining equal distance. The image size remains the same (magnification = 1), but it appears larger to your eye because it's closer.",
          difficulty: "hard",
        },
        {
          id: 10,
          question:
            "A clock shows 3:00. What time will appear to show in a plane mirror?",
          options: ["3:00", "9:00", "12:00", "6:00"],
          explanation:
            "Due to lateral inversion, 3:00 (where the hour hand points right) appears as 9:00 (hour hand pointing left) in the mirror. The image is horizontally flipped.",
          difficulty: "hard",
        },
      ],
    },
    planeMirrorRealWorld: {
      title: "🌍 Plane Mirror - Real World Applications",
      subtitle: "See how plane mirrors are used in everyday life",
      driverSeesAmbulance: "Driver sees \"AMBULANCE\" correctly in mirror!",
      scenarios: [
        {
          id: 1,
          title: "🚑 Ambulance Mirror Writing",
          description: "Emergency vehicles use lateral inversion",
          scenario:
            "Why is 'AMBULANCE' written backwards on emergency vehicles? When drivers look in their rear-view mirrors (plane mirrors), the laterally inverted text appears correctly, allowing them to quickly identify the emergency vehicle and give way.",
        },
        {
          id: 2,
          title: "🪞 Dressing Room Mirrors",
          description: "Full-length mirrors for outfit checking",
          scenario:
            "A full-length plane mirror needs to be only half your height to show your complete image! This is because the angle of incidence equals the angle of reflection, allowing you to see from head to toe in a smaller mirror.",
        },
        {
          id: 3,
          title: "🚗 Vehicle Rear-View Mirrors",
          description: "Plane mirrors in cars for rear visibility",
          scenario:
            "The inside rear-view mirror in cars is a plane mirror. It gives you a true sense of distance to vehicles behind you because the image distance equals object distance. Side mirrors are often convex for wider field of view.",
        },
        {
          id: 4,
          title: "💃 Dance Studio Mirrors",
          description: "Dancers use mirrors to check their form",
          scenario:
            "Dance studios have large plane mirrors so dancers can see their movements in real-time. The virtual image appears at the same distance behind the mirror, helping dancers judge their positioning and synchronization accurately.",
        },
        {
          id: 5,
          title: "🔬 Periscope in Submarines",
          description: "Multiple plane mirrors for seeing above water",
          scenario:
            "Periscopes use two plane mirrors at 45° angles. Light reflects off the top mirror, travels down, reflects off the bottom mirror, and reaches your eyes. Each reflection follows the law of reflection, allowing submarine crews to see above the water surface.",
        },
        {
          id: 6,
          title: "✂️ Barber Shop Mirrors",
          description: "Two mirrors showing back of head",
          scenario:
            "Barbers use two mirrors - one in front and one behind you. You see multiple reflections: your back in the rear mirror appears in the front mirror. Each reflection is a virtual image, allowing you to check your haircut from all angles.",
        },
      ],
    },
  },
  hi: {
    nav: {
      logo: "प्रकाश का परावर्तन",
      tabs: {
        learn: "सीखें",
        practice: "अभ्यास",
        realWorld: "वास्तविक दुनिया",
      },
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
    shadowSimulator: {
      title: "छाया निर्माता सिम्युलेटर",
      subtitle: "एक वैज्ञानिक की तरह प्रकाश और छाया के साथ खेलें!",
      objects: {
        title: "अपना वस्तु चुनें!",
        cat: "बिल्ली कट-आउट",
        superhero: "सुपरहीरो",
        bottle: "पानी की बोतल",
        glass: "फ्रॉस्टेड ग्लास",
        paper: "कागज की शीट",
        football: "फुटबॉल",
        tree: "पेड़",
        selected: "चुना गया! इसे चारों ओर खींचें!",
      },
      lightSize: {
        title: "प्रकाश का आकार",
        small: "छोटा प्रकाश (तीव्र छाया)",
        large: "बड़ा प्रकाश (नरम छाया)",
        smallFeedback: "तीव्र छाया सक्रिय!",
        largeFeedback: "नरम, धुंधली छाया मोड!",
      },
      shadowFacts: {
        title: "छाया तथ्य!",
        opaque: "अपारदर्शी वस्तुएं = गहरी छाया",
        translucent: "अर्ध-पारदर्शी वस्तुएं = हल्की छाया",
        transparent: "पारदर्शी वस्तुएं = लगभग कोई छाया नहीं",
        currentObject: {
          opaque: "अपारदर्शी",
          translucent: "अर्ध-पारदर्शी",
          semiTransparent: "अर्ध-पारदर्शी",
        },
      },
      controls: {
        showRays: "प्रकाश किरणें दिखाएं",
        dragHelper:
          "छाया बदलते देखने के लिए प्रकाश, वस्तु और स्क्रीन को खींचें!",
        screenLabel: "स्क्रीन (मुझे खींचें!)",
        lightLabel: "प्रकाश",
        dragObject: "मुझे खींचें!",
      },
      feedback: {
        shadowBig: "वाह! आपकी छाया बहुत बड़ी हो गई!",
        shadowTiny: "अच्छी चाल! आपने एक छोटी छाया बनाई!",
        shadowShrinking: "करीब आ रहे हैं! छाया सिकुड़ रही है!",
        objectBehindLight: "वस्तु प्रकाश स्रोत के पीछे है! कोई छाया नहीं।",
        objectBeyondScreen: "वस्तु स्क्रीन के पार है! कोई छाया नहीं।",
      },
      infoBox: {
        title: "क्या हो रहा है?",
        hugeShadow: "विशाल छाया! वस्तु प्रकाश के बहुत करीब है!",
        tinyShadow: "छोटी छाया! वस्तु स्क्रीन के करीब है!",
        normalShadow:
          "सामान्य छाया आकार! चीजों को इधर-उधर घुमाने का प्रयास करें!",
        softEdges: "नरम किनारे क्योंकि प्रकाश बड़ा है!",
        sharpEdges: "तीव्र किनारे क्योंकि प्रकाश छोटा है!",
        positionObject:
          "छाया देखने के लिए वस्तु को प्रकाश स्रोत और स्क्रीन के बीच रखें!",
      },
    },
    canvas: {
      intro: {
        title: "क्या प्रकाश सीधी रेखा में यात्रा करता है?",
        questionMark: "?",
      },
      matchbox_setup: {
        instruction: "प्रत्येक माचिस के डिब्बे में एक ही स्थान पर छेद करें",
        boxLabel: "डिब्बा",
      },
      matchbox_aligned: {
        message: "संरेखित छेद - प्रकाश गुजरता है!",
      },
      matchbox_misaligned: {
        message: "गलत संरेखित छेद - प्रकाश अवरुद्ध है!",
      },
      pipe_intro: {
        question: "क्या हम पाइप के माध्यम से देख सकते हैं?",
      },
      pipe_straight: {
        message: "सीधा पाइप - आप लौ देख सकते हैं!",
      },
      pipe_bent: {
        message: "मुड़ा हुआ पाइप - लौ नहीं देख सकते!",
      },
      conclusion: {
        title: "प्रकाश सीधी रेखा में यात्रा करता है!",
        subtitle: "दोनों प्रयोग इस प्रकाश के महत्वपूर्ण गुण की पुष्टि करते हैं",
      },
    },
    learn: {
      title: "✨ प्रकाश का परावर्तन ✨",
      subtitle: "सतहों से प्रकाश के परावर्तन के इंटरैक्टिव प्रदर्शन",
      demos: {
        law: "📐 परावर्तन का नियम",
        types: "🔄 परावर्तन के प्रकार",
      },
      canvas: {
        normal: "सामान्य",
        incidentRay: "आपतित किरण",
        reflectedRay: "परावर्तित किरण",
        incidentAngle: "∠i = {{angle}}°",
        reflectedAngle: "∠r = {{angle}}°",
        scenarios: [
          {
            id: 1,
            title: "छाया कठपुतली प्रदर्शन",
            situation:
              "प्रिया अपने स्कूल के सांस्कृतिक कार्यक्रम के लिए छाया कठपुतली (तोगालू गोम्बेयाता) प्रदर्शन कर रही है। उसने देखा कि जब वह कठपुतली को प्रकाश स्रोत के करीब ले जाती है, तो स्क्रीन पर छाया में कुछ दिलचस्प होता है।",
            question:
              "प्रिया को अपनी कठपुतली की छाया स्क्रीन पर बड़ी दिखाने के लिए क्या करना चाहिए?",
            options: [
              "कठपुतली को स्क्रीन के करीब ले जाएं",
              "कठपुतली को प्रकाश स्रोत के करीब ले जाएं",
              "प्रकाश स्रोत को स्क्रीन के करीब ले जाएं",
              "अधिक चमकदार प्रकाश का उपयोग करें",
            ],
            correctAnswer: 1,
            explanation:
              "जब प्रिया कठपुतली को प्रकाश स्रोत के करीब ले जाती है (स्क्रीन को स्थिर रखते हुए), छाया बड़ी हो जाती है। ऐसा इसलिए है क्योंकि स्रोत से प्रकाश किरणें कठपुतली के चारों ओर से गुजरने के बाद अधिक फैलती हैं, जिससे स्क्रीन पर एक बड़ी छाया बनती है। छाया कठपुतली कलाकार अपने पात्रों के आकार को नियंत्रित करने के लिए इस सिद्धांत का उपयोग करते हैं!",
            realWorldTip:
              "पारंपरिक भारतीय छाया कठपुतली रूप जैसे थोलू बोम्मलाटा (आंध्र प्रदेश), तोगालू गोम्बेयाता (कर्नाटक), और रावण छाया (ओडिशा) सदियों से अपने प्रदर्शन में नाटकीय प्रभाव बनाने के लिए इस सिद्धांत का उपयोग कर रहे हैं!",
            imageEmoji: "🎭",
          },
          {
            id: 2,
            title: "सूर्यास्त पर क्रिकेट मैच",
            situation:
              "रोहन और उसके दोस्त शाम को क्रिकेट खेल रहे हैं। जैसे-जैसे सूर्य आकाश में नीचे आता है, रोहन देखता है कि जमीन पर उनकी छायाएं दोपहर के समय की तुलना में बहुत लंबी हो रही हैं।",
            question:
              "शाम को छायाएं दोपहर की तुलना में क्यों लंबी हो जाती हैं?",
            options: [
              "शाम को लोग लंबे हो जाते हैं",
              "सूर्य आकाश में नीचे है, जो प्रकाश का एक अलग कोण बनाता है",
              "शाम को जमीन नरम हो जाती है",
              "शाम के दौरान हवा में अधिक धूल होती है",
            ],
            correctAnswer: 1,
            explanation:
              "दोपहर में, सूर्य आकाश में ऊंचा होता है, लगभग सिर के ऊपर सीधा। प्रकाश एक खड़ी कोण पर पड़ता है, जिससे छोटी छायाएं बनती हैं। शाम को, सूर्य क्षितिज के पास नीचे होता है। प्रकाश एक कम कोण पर यात्रा करता है, जैसे कि प्रिया की कठपुतली तब बड़ी छाया बनाती है जब प्रकाश स्रोत अलग तरीके से रखा जाता है। यही कारण है कि छायाएं दोपहर में सबसे छोटी और सूर्योदय और सूर्यास्त के दौरान सबसे लंबी होती हैं!",
            realWorldTip:
              "यही कारण है कि फोटोग्राफर बाहरी फोटोग्राफी के लिए 'गोल्डन आवर' (सुबह जल्दी या देर शाम) पसंद करते हैं - लंबी, नरम छायाएं तस्वीरों में गहराई और नाटक जोड़ती हैं!",
            imageEmoji: "🏏",
          },
          {
            id: 3,
            title: "ट्रैफिक सिग्नल सुरक्षा",
            situation:
              "कव्या देखती है कि एक व्यस्त यातायात चौराहे पर, बहुत ऊंचे स्ट्रीटलाइट हैं। उसके चाचा बताते हैं कि ये लाइटें छाया से संबंधित एक अच्छे कारण से ऊंचाई पर रखी गई हैं।",
            question:
              "यातायात चौराहों पर स्ट्रीटलाइट जमीन से ऊंचे क्यों रखी जाती हैं?",
            options: [
              "उन्हें अधिक सजावटी बनाने के लिए",
              "सड़क पर छायाओं को कम करने और दृश्यता बेहतर बनाने के लिए",
              "बिजली बचाने के लिए",
              "उन्हें नुकसान से बचाने के लिए",
            ],
            correctAnswer: 1,
            explanation:
              "जब प्रकाश स्रोत ऊंचाई पर रखे जाते हैं, तो वस्तुओं (जैसे वाहन, खंभे, और लोगों) की छायाएं छोटी और कम प्रमुख हो जाती हैं। यह सड़क पर अंधेरे पैच को कम करता है और सभी सड़क उपयोगकर्ताओं के लिए दृश्यता बेहतर बनाता है। यदि लाइटें नीचे रखी जातीं, तो वे बड़ी, भ्रमित करने वाली छायाएं बनातीं जो खतरों को छुपा सकती थीं और ड्राइविंग को खतरनाक बना सकती थीं। प्रकाश स्रोत की स्थिति सीधे छाया के आकार और सड़क सुरक्षा को प्रभावित करती है!",
            realWorldTip:
              "आधुनिक स्ट्रीट लाइटिंग डिज़ाइन छाया निर्माण पर ध्यान से विचार करता है। LED स्ट्रीटलाइट को छायाओं को कम करने के लिए रखा जाता है जबकि समान प्रकाश व्यवस्था प्रदान करते हुए, रात में सड़कों को सुरक्षित बनाता है!",
            imageEmoji: "🚦",
          },
          {
            id: 4,
            title: "सौर ग्रहण अवलोकन",
            situation:
              "एक सौर ग्रहण के दौरान, आदित्य के विज्ञान शिक्षक ने ग्रहण को सुरक्षित रूप से देखने के लिए एक पिनहोल प्रोजेक्टर स्थापित किया। आदित्य स्क्रीन पर एक अर्धचंद्राकार छवि देखता है और सोचता है कि हम सीधे ग्रहण को क्यों नहीं देख सकते।",
            question:
              "सौर ग्रहण को सीधे देखना खतरनाक क्यों है, और पिनहोल प्रोजेक्टर कैसे मदद करता है?",
            options: [
              "ग्रहण हानिकारक किरणें उत्सर्जित करता है जिन्हें पिनहोल अवरुद्ध करता है",
              "पिनहोल ग्रहण को सुरक्षित रूप से बढ़ाता है",
              "सीधे देखने से आंखें क्षतिग्रस्त हो सकती हैं; पिनहोल स्क्रीन पर एक सुरक्षित छवि बनाता है",
              "पिनहोल एक नकली ग्रहण छवि बनाता है",
            ],
            correctAnswer: 2,
            explanation:
              "सौर ग्रहण के दौरान, सूर्य अभी भी बहुत चमकदार है और यदि सीधे देखा जाए तो आपकी आंखों को स्थायी रूप से नुकसान पहुंचा सकता है। एक पिनहोल प्रोजेक्टर छाया निर्माण के समान सिद्धांत पर काम करता है - ग्रहण से प्रकाश एक छोटे छेद से गुजरता है और स्क्रीन पर एक छवि बनाता है। यह हमें सूर्य को सीधे देखे बिना ग्रहण के छाया पैटर्न को सुरक्षित रूप से देखने की अनुमति देता है। ग्रहण के दौरान चंद्रमा पृथ्वी पर एक छाया डाल रहा है!",
            realWorldTip:
              "सौर ग्रहण के दौरान, खगोलविद और शिक्षक समुदायों में पिनहोल प्रोजेक्टर स्थापित करते हैं ताकि लोगों को इस दुर्लभ खगोलीय घटना को सुरक्षित रूप से देखने में मदद मिल सके। उचित उपकरण के बिना कभी भी सीधे सूर्य या ग्रहण को न देखें!",
            imageEmoji: "🌑",
          },
          {
            id: 5,
            title: "पुरातात्विक खोज",
            situation:
              "डॉ. शर्मा, कर्नाटक में हंपी में एक पुरातत्वविद्, प्राचीन चट्टान की नक्काशी की तस्वीर लेने की आवश्यकता है। वह देखती है कि दिन के कुछ समय के दौरान, नक्काशी देखने और फोटोग्राफ करने में बहुत आसान होती है।",
            question:
              "विवरण को सबसे अधिक दिखाने के लिए डॉ. शर्मा के लिए चट्टान की नक्काशी की तस्वीर लेने का सबसे अच्छा समय कब होगा?",
            options: [
              "दोपहर में जब सूर्य सीधे सिर के ऊपर हो",
              "सुबह जल्दी या देर शाम जब सूर्य कोण पर हो",
              "रात में टॉर्च के साथ",
              "बादल वाले दिन में जब कोई सीधी धूप न हो",
            ],
            correctAnswer: 1,
            explanation:
              "जब सूर्य कोण पर होता है (सुबह जल्दी या देर शाम), यह चट्टान की नक्काशी वाली खांचे और विवरणों में छायाएं बनाता है। ये छायाएं त्रि-आयामी विशेषताओं को अधिक दिखाई देने योग्य और नाटकीय बनाती हैं। दोपहर में, जब सूर्य सिर के ऊपर होता है, तो न्यूनतम छायाएं होती हैं, जिससे नक्काशी सपाट और देखने में कठिन लगती है। यह छाया निर्माण का वही सिद्धांत है - प्रकाश स्रोत की स्थिति प्रभावित करती है कि छायाएं विवरणों को कैसे प्रकट या छुपाती हैं!",
            realWorldTip:
              "पुरातत्वविद्, वास्तुकार, और कला इतिहासकार कलाकृतियों और संरचनाओं का अध्ययन करने के लिए 'रेकिंग लाइट' (कम कोण पर प्रकाश) का उपयोग करते हैं। यह तकनीक बनावट, उपकरण के निशान, और घिसाव पैटर्न को प्रकट करती है जो अन्यथा अदृश्य हो सकते हैं!",
            imageEmoji: "🏛️",
          },
          {
            id: 6,
            title: "किसान और सूर्यघड़ी",
            situation:
              "राजस्थान के एक गांव में, बुजुर्ग किसान अभी भी अपनी छाया लंबाई का अवलोकन करके दिन के दौरान समय का अनुमान लगाने के लिए पारंपरिक ज्ञान का उपयोग करते हैं। रमेश के दादा ने उसे यह प्राचीन कौशल सिखाया।",
            question:
              "किसान छाया लंबाई का उपयोग करके अनुमानित समय कैसे लगा सकते हैं?",
            options: [
              "छायाएं यादृच्छिक हैं और समय नहीं बता सकतीं",
              "छाया लंबाई अनुमानित रूप से बदलती है: दोपहर में सबसे छोटी, सुबह/शाम में लंबी",
              "छायाएं हमेशा उत्तर की ओर इंगित करती हैं",
              "समय के साथ छाया का रंग बदलता है",
            ],
            correctAnswer: 1,
            explanation:
              "सूर्य की स्थिति पूरे दिन अनुमानित रूप से बदलती है। सूर्योदय पर, छायाएं लंबी होती हैं और पश्चिम की ओर इंगित करती हैं। जैसे-जैसे सूर्य उगता है, छायाएं छोटी हो जाती हैं और घूमती हैं। दोपहर में (सौर दोपहर), छायाएं सबसे छोटी होती हैं और उत्तर की ओर इंगित करती हैं (कर्क रेखा के उत्तर में स्थानों में जैसे भारत का अधिकांश हिस्सा)। दोपहर के बाद, छायाएं फिर से लंबी हो जाती हैं और पूर्व की ओर इंगित करती हैं। छाया निर्माण का यह अनुमानित पैटर्न सदियों से सूर्यघड़ी और पारंपरिक समय रखने में उपयोग किया गया है!",
            realWorldTip:
              "सूर्यघड़ी मानवता के सबसे पुराने वैज्ञानिक उपकरणों में से एक है, 5,000 से अधिक वर्षों से उपयोग की जा रही है! कई प्राचीन भारतीय मंदिरों में सूर्यघड़ी के निशान हैं। आप एक छड़ी का उपयोग करके और धूप वाले दिन पर प्रति घंटे छाया स्थितियों को चिह्नित करके घर पर एक साधारण सूर्यघड़ी भी बना सकते हैं!",
            imageEmoji: "🌾",
          },
          {
            id: 7,
            title: "अग्निशामक और छायाएं",
            situation:
              "एक अग्नि सुरक्षा प्रदर्शन के दौरान, अग्निशामक लक्ष्मी छात्रों को समझाती है कि अग्निशामक कभी-कभी धुएं से भरे इमारतों में खोज करते समय कई कोणों से शक्तिशाली रोशनी का उपयोग क्यों करते हैं।",
            question:
              "बचाव अभियानों के दौरान अग्निशामक अलग-अलग कोणों से कई प्रकाश स्रोतों का उपयोग क्यों करते हैं?",
            options: [
              "केवल इमारत को अधिक चमकदार बनाने के लिए",
              "भ्रमित करने वाली छायाओं को कम करने और बाधाओं को स्पष्ट रूप से देखने के लिए",
              "धुएं को भगाने के लिए",
              "अन्य अग्निशामकों को संकेत देने के लिए",
            ],
            correctAnswer: 1,
            explanation:
              "एक एकल प्रकाश स्रोत मजबूत छायाएं बनाता है जो बाधाओं, पीड़ितों, या खतरों को छुपा सकता है। जब प्रकाश केवल एक दिशा से आता है, तो वस्तुएं प्रकाश को अवरुद्ध करती हैं और अंधेरे छाया क्षेत्र बनाती हैं जहां कुछ भी नहीं देखा जा सकता। विभिन्न कोणों से कई रोशनी का उपयोग करके, अग्निशामक इन छाया क्षेत्रों को कम करते हैं। यदि एक रोशनी छाया बनाती है, तो एक अलग कोण से दूसरी रोशनी इसे प्रकाशित करती है। यह छाया निर्माण की समझ का एक व्यावहारिक अनुप्रयोग है!",
            realWorldTip:
              "फिल्म और फोटोग्राफी स्टूडियो भी छायाओं को नियंत्रित करने और वांछित प्रभाव बनाने के लिए कई प्रकाश स्रोतों (की लाइट, फिल लाइट, बैक लाइट) का उपयोग करते हैं। छाया निर्माण की समझ कई व्यवसायों में महत्वपूर्ण है!",
            imageEmoji: "🚒",
          },
          {
            id: 8,
            title: "भवन डिज़ाइन और छायाएं",
            situation:
              "वास्तुकार श्रीमती पटेल बैंगलोर में एक नई अपार्टमेंट इमारत डिज़ाइन कर रही हैं। उन्हें इमारत की स्थिति को सावधानी से योजना बनाने की आवश्यकता है ताकि यह सुनिश्चित हो सके कि यह दोपहर के घंटों के दौरान बच्चों के खेलने के समय पड़ोसी खेल के मैदान पर लंबी छायाएं न डाले।",
            question:
              "इमारत को स्थित करते समय श्रीमती पटेल को छाया निर्माण के बारे में क्या विचार करना चाहिए?",
            options: [
              "भवन डिज़ाइन में छायाएं मायने नहीं रखतीं",
              "भवन की ऊंचाई, सूर्य का पथ, और दिन भर छाया की दिशा",
              "केवल इमारत का रंग छायाओं को प्रभावित करता है",
              "छायाएं पूरे दिन एक ही आकार की होती हैं",
            ],
            correctAnswer: 1,
            explanation:
              "इमारत एक अपारदर्शी वस्तु के रूप में काम करती है जो सूर्य के प्रकाश को अवरुद्ध करती है। ऊंची इमारतें लंबी छायाएं बनाती हैं। सूर्य की स्थिति पूरे दिन और मौसमों में बदलती है - गर्मियों में यह उच्च होता है (छोटी छायाएं) और सर्दियों में नीचे (लंबी छायाएं)। श्रीमती पटेल को गणना करनी चाहिए कि विभिन्न समय और मौसमों में छायाएं कहां गिरेंगी। बैंगलोर जैसे गर्म जलवायु में, छायाएं मूल्यवान शीतलन प्रदान कर सकती हैं, लेकिन खेल के मैदान के प्रकाश को अवरुद्ध करना सुरक्षा और उपयोगिता को कम करता है। यही कारण है कि कई शहरों में नए निर्माण के लिए 'छाया प्रभाव अध्ययन' आवश्यक हैं!",
            realWorldTip:
              "आधुनिक स्थायी वास्तुकला भवन डिज़ाइन को अनुकूलित करने के लिए 'छाया विश्लेषण' सॉफ़्टवेयर का उपयोग करती है। कुछ इमारतें जानबूझकर प्राकृतिक शीतलन के लिए छायादार आंगन बनाने के लिए डिज़ाइन की जाती हैं, जबकि अन्य दिन भर दिलचस्प वास्तुशिल्प प्रभाव बनाने के लिए छाया पैटर्न का उपयोग करती हैं!",
            imageEmoji: "🏢",
          },
        ],
      },
      controls: {
        title: "⚙️ नियंत्रण",
        angleOfIncidence: "आपतन कोण:",
        showNormalLine: "सामान्य रेखा दिखाएं",
        showAngleMeasurements: "कोण माप दिखाएं",
        animateLightTravel: "प्रकाश यात्रा को एनिमेट करें",
        previous: "← पिछला",
        checkAnswer: "उत्तर जांचें",
        nextScenario: "अगला परिदृश्य →",
        scenarioCount: "परिदृश्य {{current}} / {{total}}",
      },
      concepts: {
        title: "📚 मुख्य अवधारणाएं",
        law: {
          title: "परावर्तन का नियम",
          description: "कहता है कि जब प्रकाश एक सतह से परावर्तित होता है:",
          point1:
            "आपतित किरण, परावर्तित किरण, और सामान्य सभी एक ही तल में स्थित होते हैं",
          point2: "आपतन कोण (∠i) परावर्तन कोण (∠r) के बराबर होता है",
          point3: "दोनों कोण सामान्य (सतह के लंबवत रेखा) से मापे जाते हैं",
          redRay: "लाल किरण:",
          redRayDesc: "दर्पण के पास आने वाली आपतित प्रकाश",
          greenRay: "हरी किरण:",
          greenRayDesc: "दर्पण से उछलने वाली परावर्तित प्रकाश",
          yellowLine: "पीली धराशायी रेखा:",
          yellowLineDesc: "सामान्य (सतह के लंबवत)",
        },
        types: {
          regularTitle: "नियमित (स्पेक्युलर) परावर्तन:",
          regularDesc:
            "दर्पण और शांत पानी जैसी चिकनी सतहों पर होता है। समानांतर आपतित किरणें परावर्तन के बाद समानांतर रहती हैं, स्पष्ट छवियां बनाती हैं।",
          diffuseTitle: "विकीर्ण परावर्तन:",
          diffuseDesc:
            "कागज, दीवारें और कपड़े जैसी खुरदरी सतहों पर होता है। समानांतर आपतित किरणें विभिन्न दिशाओं में बिखर जाती हैं, यही कारण है कि हम अधिकांश वस्तुओं को किसी भी कोण से देख सकते हैं लेकिन वे स्पष्ट परावर्तन नहीं बनाती हैं।",
        },
      },
      infoBox: {
        lawTitle: "परावर्तन का नियम:",
        lawFormula: "∠i = ∠r",
        lawDesc1: "आपतन कोण बराबर है",
        lawDesc2: "परावर्तन कोण",
      },
      types: {
        regularTitle: "नियमित परावर्तन",
        diffuseTitle: "विकीर्ण परावर्तन",
        smoothSurface: "चिकनी सतह",
        roughSurface: "खुरदरी सतह",
        regularDesc: "समानांतर आपतित किरणें परावर्तन के बाद समानांतर रहती हैं",
        diffuseDesc: "समानांतर आपतित किरणें विभिन्न दिशाओं में बिखर जाती हैं",
      },
      headers: {
        realWorldSituation: "📖 वास्तविक दुनिया की स्थिति",
        scientificExplanation: "💡 वैज्ञानिक व्याख्या",
        realWorldApplication: "🌍 वास्तविक दुनिया का अनुप्रयोग",
      },
      progress: {
        title: "📊 आपकी प्रगति",
        completed: "पूर्ण परिदृश्य:",
        congrats:
          "🎉 बधाई हो! आपने सभी वास्तविक दुनिया के परिदृश्य पूरे कर लिए हैं!",
      },
      facts: {
        title: "🌟 भारत से अद्भुत छाया तथ्य",
        list: [
          "<strong>कोणार्क सूर्य मंदिर</strong> (ओडिशा) को इस तरह डिज़ाइन किया गया था कि सूर्य की पहली किरणें इसके मुख्य प्रवेश द्वार पर पड़ें, शानदार छाया पैटर्न बनाते हुए",
          "<strong>जंतर मंतर</strong> वेधशालाएं दिल्ली, जयपुर और अन्य शहरों में विशाल छाया-प्रक्षेपण उपकरण (सूर्यघड़ी) का उपयोग अविश्वसनीय सटीकता के साथ समय और खगोलीय स्थितियों को ट्रैक करने के लिए करती हैं",
          "प्राचीन भारतीय गणितज्ञ जैसे <strong>आर्यभट्ट</strong> (5वीं शताब्दी CE) ने पृथ्वी की परिधि और खगोलीय पिंडों की दूरियों की गणना करने के लिए छायाओं का अध्ययन किया",
          "भारत में पारंपरिक <strong>छाया कठपुतली</strong> प्रदर्शन अक्सर रात भर चलते हैं, रामायण और महाभारत जैसे महाकाव्यों की कहानियां चलती छायाओं के माध्यम से बताई जाती हैं",
          "राजस्थान में <strong>दिलवाड़ा मंदिर</strong> जटिल संगमरमर नक्काशी पर दिन भर बदलते छाया पैटर्न बनाने के लिए स्थित हैं",
        ],
      },
      simulation: {
        title: "🎭 छाया कठपुतली सिम्युलेटर",
        show: "सिम्युलेशन दिखाएं",
        hide: "सिम्युलेशन छुपाएं",
        intro:
          "पारंपरिक भारतीय छाया कठपुतली में छायाएं कैसे बदलती हैं देखने के लिए कठपुतली को हिलाएं और प्रकाश दूरी समायोजित करें!",
        shadowSize: "छाया का आकार",
        large: "बड़ा",
        medium: "मध्यम",
        small: "छोटा",
        puppetPosLabel: "🎭 कठपुतली की स्थिति (प्रकाश के करीब = बड़ी छाया)",
        puppetShapeLabel: "कठपुतली का आकार चुनें",
        shapes: {
          hand: {
            label: "हाथ",
            emoji: "✋",
          },
          bird: {
            label: "पक्षी",
            emoji: "🦅",
          },
          dog: {
            label: "कुत्ता",
            emoji: "🐕",
          },
        },
        tip: "<strong>💡 इसे आजमाएं:</strong> छाया को बड़ा बनाने के लिए कठपुतली को प्रकाश स्रोत (बाएं) के करीब ले जाएं! पारंपरिक छाया कठपुतली कलाकार प्रदर्शन के दौरान पात्रों को बढ़ने या सिकुड़ने के लिए इस तकनीक का उपयोग करते हैं।",
      },
    },
    practice: {
      title: "🌍 वास्तविक दुनिया में छायाओं",
      subtitle: "जानें कि छाया रचना आपणे दैनिक जीवन को कैसे प्रभावित करती है",
      stats: {
        score: "स्कोर",
        accuracy: "सटीकता",
        progress: "प्रगति",
      },
      exercise: "अभ्यास {{num}}",
      difficulty: {
        easy: "आसान",
        medium: "मध्यम",
        hard: "कठिन",
      },
      completed: "पूर्ण",
      restart: "पुनः आरंभ करें",
      submitAnswer: "उत्तर जमा करें",
      nextExercise: "अगला अभ्यास",
      completedAll: "पूर्ण!",
      congratulations: "🎉 बधाई हो!",
      completedAllText:
        "आपने सभी अभ्यास {{score}}/{{total}} के स्कोर के साथ पूरे कर लिए हैं!",
      accuracyLabel: "सटीकता:",
      excellent: "🎉 उत्कृष्ट!",
      notQuiteRight: "❌ बिल्कुल सही नहीं",
      interactive: {
        mirrorAngle: "दर्पण कोण:",
        tip: "💡 सुझाव: हरे बीम को लाल लक्ष्य पर मारने के लिए दर्पण को समायोजित करें!",
        lightSource: "प्रकाश स्रोत",
        mirror: "दर्पण ({{angle}}°)",
        target: "लक्ष्य",
        perfect: "✓ उत्तम!",
      },
      drawing: {
        instruction: "परावर्तित किरण खींचें:",
        clearDrawing: "ड्राइंग साफ करें",
        tip: "✏️ दर्पण से परावर्तित प्रकाश किरण का पथ खींचने के लिए अपने माउस का उपयोग करें",
      },
      exercises: {
        "1": {
          question:
            "दर्पण द्वारा प्रकाश की दिशा में परिवर्तन को क्या कहा जाता है?",
          options: ["अपवर्तन", "परावर्तन", "विक्षेपण", "अवशोषण"],
          explanation:
            "दर्पण द्वारा प्रकाश की दिशा में परिवर्तन को परावर्तन कहा जाता है। जब प्रकाश एक चमकदार सतह से टकराता है, तो यह वापस उछलता है।",
        },
        "2": {
          question: "निम्नलिखित में से कौन सी एक दीप्त वस्तु है?",
          options: ["चंद्रमा", "दर्पण", "सूर्य", "दीवार"],
          explanation:
            "सूर्य एक दीप्त वस्तु है क्योंकि यह अपना प्रकाश उत्सर्जित करता है। चंद्रमा, दर्पण और दीवार गैर-दीप्त वस्तुएं हैं जो केवल प्रकाश को परावर्तित करती हैं।",
        },
        "3": {
          question: "प्रकाश कैसे यात्रा करता है?",
          options: [
            "वक्र रेखाओं में",
            "ज़िगज़ैग पैटर्न में",
            "सीधी रेखाओं में",
            "यादृच्छिक दिशाओं में",
          ],
          explanation:
            "प्रकाश हमेशा सीधी रेखाओं में यात्रा करता है। इसे तब देखा जा सकता है जब आप टॉर्च चलाते हैं या खिड़कियों के माध्यम से सूर्य की किरणें देखते हैं।",
        },
        "4": {
          question:
            "समतल दर्पण द्वारा बनी छवि को स्क्रीन पर प्राप्त किया जा सकता है।",
          explanation:
            "गलत। समतल दर्पण द्वारा बनी छवि को स्क्रीन पर प्राप्त नहीं किया जा सकता क्योंकि यह दर्पण के पीछे बनी एक आभासी छवि है।",
        },
        "5": {
          question:
            "परावर्तित प्रकाश को लक्ष्य स्थान पर निर्देशित करने के लिए दर्पण कोण को समायोजित करें!",
          explanation:
            "दर्पण के कोण को बदलकर, आप नियंत्रित कर सकते हैं कि परावर्तित प्रकाश कहाँ जाता है। यही तरीका है जिससे पेरिस्कोप और अन्य ऑप्टिकल उपकरण काम करते हैं।",
        },
        "6": {
          question:
            "जब सूर्य का प्रकाश दर्पण पर पड़ता है तो दर्पण को झुकाने पर क्या होता है?",
          options: [
            "परावर्तित प्रकाश की स्थिति समान रहती है",
            "परावर्तित प्रकाश की स्थिति बदल जाती है",
            "सूर्य का प्रकाश परावर्तित होना बंद हो जाता है",
            "दर्पण पारदर्शी हो जाता है",
          ],
          explanation:
            "जब आप दर्पण को झुकाते हैं, तो जिस कोण पर प्रकाश उससे टकराता है वह बदल जाता है, इसलिए परावर्तित प्रकाश की दिशा भी बदल जाती है।",
        },
        "7": {
          question: "दर्पण से परावर्तित प्रकाश का पथ खींचें!",
          explanation:
            "परावर्तित किरण को दर्पण से आपतन कोण के बराबर कोण पर सीधी रेखा में यात्रा करनी चाहिए।",
        },
        "8": {
          question: "आप दर्पण में अपना चेहरा क्यों देख सकते हैं?",
          options: [
            "दर्पण प्रकाश उत्सर्जित करता है",
            "आपके चेहरे से प्रकाश दर्पण से परावर्तित होकर आपकी आंखों में प्रवेश करता है",
            "आपका चेहरा दर्पण से होकर गुजरता है",
            "दर्पण प्रकाश को अवशोषित करता है",
          ],
          explanation:
            "आप अपना चेहरा देखते हैं क्योंकि आपके चेहरे से प्रकाश दर्पण तक यात्रा करता है, उससे परावर्तित होता है, और आपकी आंखों में प्रवेश करता है। यह परावर्तित प्रकाश वह छवि बनाता है जिसे आप देखते हैं।",
        },
      },
      trueFalse: {
        true: "सत्य",
        false: "असत्य",
      },
      overview: {
        title: "अभ्यास अवलोकन",
        subtitle: "अपने उत्तरों की समीक्षा करें और सभी सही समाधान देखें",
        backToPractice: "अभ्यास पर वापस जाएं",
        viewOverview: "अवलोकन देखें",
        correct: "सही",
        incorrect: "गलत",
        accuracy: "सटीकता",
        exerciseList: "सभी अभ्यास",
        yourAnswer: "आपका उत्तर",
        correctAnswer: "सही उत्तर",
        explanation: "व्याख्या",
        notAnswered: "उत्तर नहीं दिया",
        drawn: "चित्र सबमिट किया",
        notDrawn: "कोई चित्र नहीं",
        drawingRequired: "चित्र आवश्यक",
      },
      scenarios: [
        {
          id: 1,
          title: "छाया कठपुतली प्रदर्शन",
          situation:
            "प्रिया अपने स्कूल के सांस्कृतिक कार्यक्रम के लिए छाया कठपुतली (तोगालू गोम्बेयाता) कर रही है। उसने देखा कि जब वह कठपुतली को प्रकाश स्रोत के करीब ले जाती है, तो स्क्रीन पर छाया में कुछ दिलचस्प होता है।",
          question:
            "प्रिया को अपनी कठपुतली की छाया स्क्रीन पर बड़ी दिखाने के लिए क्या करना चाहिए?",
          options: [
            "कठपुतली को स्क्रीन के करीब ले जाएं",
            "कठपुतली को प्रकाश स्रोत के करीब ले जाएं",
            "प्रकाश स्रोत को स्क्रीन के करीब ले जाएं",
            "अधिक चमकदार प्रकाश का उपयोग करें",
          ],
          correctAnswer: 1,
          explanation:
            "जब प्रिया कठपुतली को प्रकाश स्रोत के करीब ले जाती है (स्क्रीन को स्थिर रखते हुए), छाया बड़ी हो जाती है। ऐसा इसलिए है क्योंकि स्रोत से प्रकाश किरणें कठपुतली के चारों ओर से गुजरने के बाद अधिक फैलती हैं, जिससे स्क्रीन पर एक बड़ी छाया बनती है। छाया कठपुतली कलाकार अपने पात्रों के आकार को नियंत्रित करने के लिए इस सिद्धांत का उपयोग करते हैं!",
          realWorldTip:
            "पारंपरिक भारतीय छाया कठपुतली रूप जैसे थोलू बोम्मलाटा (आंध्र प्रदेश), तोगालू गोम्बेयाता (कर्नाटक), और रावण छाया (ओडिशा) सदियों से अपने प्रदर्शन में नाटकीय प्रभाव बनाने के लिए इस सिद्धांत का उपयोग कर रहे हैं!",
          imageEmoji: "🎭",
        },
        {
          id: 2,
          title: "सूर्यास्त पर क्रिकेट मैच",
          situation:
            "रोहन और उसके दोस्त शाम को क्रिकेट खेल रहे हैं। जैसे-जैसे सूर्य आकाश में नीचे आता है, रोहन देखता है कि जमीन पर उनकी छायाएं दोपहर के समय की तुलना में बहुत लंबी हो रही हैं।",
          question: "शाम को छायाएं दोपहर की तुलना में क्यों लंबी हो जाती हैं?",
          options: [
            "शाम को लोग लंबे हो जाते हैं",
            "सूर्य आकाश में नीचे है, जो प्रकाश का एक अलग कोण बनाता है",
            "शाम को जमीन नरम हो जाती है",
            "शाम के दौरान हवा में अधिक धूल होती है",
          ],
          correctAnswer: 1,
          explanation:
            "दोपहर में, सूर्य आकाश में ऊंचा होता है, लगभग सिर के ऊपर सीधा। प्रकाश एक खड़ी कोण पर पड़ता है, जिससे छोटी छायाएं बनती हैं। शाम को, सूर्य क्षितिज के पास नीचे होता है। प्रकाश एक कम कोण पर यात्रा करता है, जैसे कि प्रिया की कठपुतली तब बड़ी छाया बनाती है जब प्रकाश स्रोत अलग तरीके से रखा जाता है। यही कारण है कि छायाएं दोपहर में सबसे छोटी और सूर्योदय और सूर्यास्त के दौरान सबसे लंबी होती हैं!",
          realWorldTip:
            "यही कारण है कि फोटोग्राफर बाहरी फोटोग्राफी के लिए 'गोल्डन आवर' (सुबह जल्दी या देर शाम) पसंद करते हैं - लंबी, नरम छायाएं तस्वीरों में गहराई और नाटक जोड़ती हैं!",
          imageEmoji: "🏏",
        },
        {
          id: 3,
          title: "ट्रैफिक सिग्नल सुरक्षा",
          situation:
            "कव्या देखती है कि एक व्यस्त यातायात चौराहे पर, बहुत ऊंचे स्ट्रीटलाइट हैं। उसके चाचा बताते हैं कि ये लाइटें छाया से संबंधित एक अच्छे कारण से ऊंचाई पर रखी गई हैं।",
          question:
            "यातायात चौराहों पर स्ट्रीटलाइट जमीन से ऊंचे क्यों रखी जाती हैं?",
          options: [
            "उन्हें अधिक सजावटी बनाने के लिए",
            "सड़क पर छायाओं को कम करने और दृश्यता बेहतर बनाने के लिए",
            "बिजली बचाने के लिए",
            "उन्हें नुकसान से बचाने के लिए",
          ],
          correctAnswer: 1,
          explanation:
            "जब प्रकाश स्रोत ऊंचाई पर रखे जाते हैं, तो वस्तुओं (जैसे वाहन, खंभे, और लोगों) की छायाएं छोटी और कम प्रमुख हो जाती हैं। यह सड़क पर अंधेरे पैच को कम करता है और सभी सड़क उपयोगकर्ताओं के लिए दृश्यता बेहतर बनाता है। यदि लाइटें नीचे रखी जातीं, तो वे बड़ी, भ्रमित करने वाली छायाएं बनातीं जो खतरों को छुपा सकती थीं और ड्राइविंग को खतरनाक बना सकती थीं। प्रकाश स्रोत की स्थिति सीधे छाया के आकार और सड़क सुरक्षा को प्रभावित करती है!",
          realWorldTip:
            "आधुनिक स्ट्रीट लाइटिंग डिज़ाइन छाया निर्माण पर ध्यान से विचार करता है। LED स्ट्रीटलाइट को छायाओं को कम करने के लिए रखा जाता है जबकि समान प्रकाश व्यवस्था प्रदान करते हुए, रात में सड़कों को सुरक्षित बनाता है!",
          imageEmoji: "🚦",
        },
        {
          id: 4,
          title: "सौर ग्रहण अवलोकन",
          situation:
            "एक सौर ग्रहण के दौरान, आदित्य के विज्ञान शिक्षक ने ग्रहण को सुरक्षित रूप से देखने के लिए एक पिनहोल प्रोजेक्टर स्थापित किया। आदित्य स्क्रीन पर एक अर्धचंद्राकार छवि देखता है और सोचता है कि हम सीधे ग्रहण को क्यों नहीं देख सकते।",
          question:
            "सौर ग्रहण को सीधे देखना खतरनाक क्यों है, और पिनहोल प्रोजेक्टर कैसे मदद करता है?",
          options: [
            "ग्रहण हानिकारक किरणें उत्सर्जित करता है जिन्हें पिनहोल अवरुद्ध करता है",
            "पिनहोल ग्रहण को सुरक्षित रूप से बढ़ाता है",
            "सीधे देखने से आंखें क्षतिग्रस्त हो सकती हैं; पिनहोल स्क्रीन पर एक सुरक्षित छवि बनाता है",
            "पिनहोल एक नकली ग्रहण छवि बनाता है",
          ],
          correctAnswer: 2,
          explanation:
            "सौर ग्रहण के दौरान, सूर्य अभी भी बहुत चमकदार है और यदि सीधे देखा जाए तो आपकी आंखों को स्थायी रूप से नुकसान पहुंचा सकता है। एक पिनहोल प्रोजेक्टर छाया निर्माण के समान सिद्धांत पर काम करता है - ग्रहण से प्रकाश एक छोटे छेद से गुजरता है और स्क्रीन पर एक छवि बनाता है। यह हमें सूर्य को सीधे देखे बिना ग्रहण के छाया पैटर्न को सुरक्षित रूप से देखने की अनुमति देता है। ग्रहण के दौरान चंद्रमा पृथ्वी पर एक छाया डाल रहा है!",
          realWorldTip:
            "सौर ग्रहण के दौरान, खगोलविद और शिक्षक समुदायों में पिनहोल प्रोजेक्टर स्थापित करते हैं ताकि लोगों को इस दुर्लभ खगोलीय घटना को सुरक्षित रूप से देखने में मदद मिल सके। उचित उपकरण के बिना कभी भी सीधे सूर्य या ग्रहण को न देखें!",
          imageEmoji: "🌑",
        },
        {
          id: 5,
          title: "पुरातात्विक खोज",
          situation:
            "डॉ. शर्मा, कर्नाटक में हंपी में एक पुरातत्वविद्, प्राचीन चट्टान की नक्काशी की तस्वीर लेने की आवश्यकता है। वह देखती है कि दिन के कुछ समय के दौरान, नक्काशी देखने और फोटोग्राफ करने में बहुत आसान होती है।",
          question:
            "विवरण को सबसे अधिक दिखाने के लिए डॉ. शर्मा के लिए चट्टान की नक्काशी की तस्वीर लेने का सबसे अच्छा समय कब होगा?",
          options: [
            "दोपहर में जब सूर्य सीधे सिर के ऊपर हो",
            "सुबह जल्दी या देर शाम जब सूर्य कोण पर हो",
            "रात में टॉर्च के साथ",
            "बादल वाले दिन में जब कोई सीधी धूप न हो",
          ],
          correctAnswer: 1,
          explanation:
            "जब सूर्य कोण पर होता है (सुबह जल्दी या देर शाम), यह चट्टान की नक्काशी वाली खांचे और विवरणों में छायाएं बनाता है। ये छायाएं त्रि-आयामी विशेषताओं को अधिक दिखाई देने योग्य और नाटकीय बनाती हैं। दोपहर में, जब सूर्य सिर के ऊपर होता है, तो न्यूनतम छायाएं होती हैं, जिससे नक्काशी सपाट और देखने में कठिन लगती है। यह छाया निर्माण का वही सिद्धांत है - प्रकाश स्रोत की स्थिति प्रभावित करती है कि छायाएं विवरणों को कैसे प्रकट या छुपाती हैं!",
          realWorldTip:
            "पुरातत्वविद्, वास्तुकार, और कला इतिहासकार कलाकृतियों और संरचनाओं का अध्ययन करने के लिए 'रेकिंग लाइट' (कम कोण पर प्रकाश) का उपयोग करते हैं। यह तकनीक बनावट, उपकरण के निशान, और घिसाव पैटर्न को प्रकट करती है जो अन्यथा अदृश्य हो सकते हैं!",
          imageEmoji: "🏛️",
        },
        {
          id: 6,
          title: "किसान और सूर्यघड़ी",
          situation:
            "राजस्थान के एक गांव में, बुजुर्ग किसान अभी भी अपनी छाया लंबाई का अवलोकन करके दिन के दौरान समय का अनुमान लगाने के लिए पारंपरिक ज्ञान का उपयोग करते हैं। रमेश के दादा ने उसे यह प्राचीन कौशल सिखाया।",
          question:
            "किसान छाया लंबाई का उपयोग करके अनुमानित समय कैसे लगा सकते हैं?",
          options: [
            "छायाएं यादृच्छिक हैं और समय नहीं बता सकतीं",
            "छाया लंबाई अनुमानित रूप से बदलती है: दोपहर में सबसे छोटी, सुबह/शाम में लंबी",
            "छायाएं हमेशा उत्तर की ओर इंगित करती हैं",
            "समय के साथ छाया का रंग बदलता है",
          ],
          correctAnswer: 1,
          explanation:
            "सूर्य की स्थिति पूरे दिन अनुमानित रूप से बदलती है। सूर्योदय पर, छायाएं लंबी होती हैं और पश्चिम की ओर इंगित करती हैं। जैसे-जैसे सूर्य उगता है, छायाएं छोटी हो जाती हैं और घूमती हैं। दोपहर में (सौर दोपहर), छायाएं सबसे छोटी होती हैं और उत्तर की ओर इंगित करती हैं (कर्क रेखा के उत्तर में स्थानों में जैसे भारत का अधिकांश हिस्सा)। दोपहर के बाद, छायाएं फिर से लंबी हो जाती हैं और पूर्व की ओर इंगित करती हैं। छाया निर्माण का यह अनुमानित पैटर्न सदियों से सूर्यघड़ी और पारंपरिक समय रखने में उपयोग किया गया है!",
          realWorldTip:
            "सूर्यघड़ी मानवता के सबसे पुराने वैज्ञानिक उपकरणों में से एक है, 5,000 से अधिक वर्षों से उपयोग की जा रही है! कई प्राचीन भारतीय मंदिरों में सूर्यघड़ी के निशान हैं। आप एक छड़ी का उपयोग करके और धूप वाले दिन पर प्रति घंटे छाया स्थितियों को चिह्नित करके घर पर एक साधारण सूर्यघड़ी भी बना सकते हैं!",
          imageEmoji: "🌾",
        },
        {
          id: 7,
          title: "अग्निशामक और छायाएं",
          situation:
            "एक अग्नि सुरक्षा प्रदर्शन के दौरान, अग्निशामक लक्ष्मी छात्रों को समझाती है कि अग्निशामक कभी-कभी धुएं से भरे इमारतों में खोज करते समय कई कोणों से शक्तिशाली रोशनी का उपयोग क्यों करते हैं।",
          question:
            "बचाव अभियानों के दौरान अग्निशामक अलग-अलग कोणों से कई प्रकाश स्रोतों का उपयोग क्यों करते हैं?",
          options: [
            "केवल इमारत को अधिक चमकदार बनाने के लिए",
            "भ्रमित करने वाली छायाओं को कम करने और बाधाओं को स्पष्ट रूप से देखने के लिए",
            "धुएं को भगाने के लिए",
            "अन्य अग्निशामकों को संकेत देने के लिए",
          ],
          correctAnswer: 1,
          explanation:
            "एक एकल प्रकाश स्रोत मजबूत छायाएं बनाता है जो बाधाओं, पीड़ितों, या खतरों को छुपा सकता है। जब प्रकाश केवल एक दिशा से आता है, तो वस्तुएं प्रकाश को अवरुद्ध करती हैं और अंधेरे छाया क्षेत्र बनाती हैं जहां कुछ भी नहीं देखा जा सकता। विभिन्न कोणों से कई रोशनी का उपयोग करके, अग्निशामक इन छाया क्षेत्रों को कम करते हैं। यदि एक रोशनी छाया बनाती है, तो एक अलग कोण से दूसरी रोशनी इसे प्रकाशित करती है। यह छाया निर्माण की समझ का एक व्यावहारिक अनुप्रयोग है!",
          realWorldTip:
            "फिल्म और फोटोग्राफी स्टूडियो भी छायाओं को नियंत्रित करने और वांछित प्रभाव बनाने के लिए कई प्रकाश स्रोतों (की लाइट, फिल लाइट, बैक लाइट) का उपयोग करते हैं। छाया निर्माण की समझ कई व्यवसायों में महत्वपूर्ण है!",
          imageEmoji: "🚒",
        },
        {
          id: 8,
          title: "भवन डिज़ाइन और छायाएं",
          situation:
            "वास्तुकार श्रीमती पटेल बैंगलोर में एक नई अपार्टमेंट इमारत डिज़ाइन कर रही हैं। उन्हें इमारत की स्थिति को सावधानी से योजना बनाने की आवश्यकता है ताकि यह सुनिश्चित हो सके कि यह दोपहर के घंटों के दौरान बच्चों के खेलने के समय पड़ोसी खेल के मैदान पर लंबी छायाएं न डाले।",
          question:
            "इमारत को स्थित करते समय श्रीमती पटेल को छाया निर्माण के बारे में क्या विचार करना चाहिए?",
          options: [
            "भवन डिज़ाइन में छायाएं मायने नहीं रखतीं",
            "भवन की ऊंचाई, सूर्य का पथ, और दिन भर छाया की दिशा",
            "केवल इमारत का रंग छायाओं को प्रभावित करता है",
            "छायाएं पूरे दिन एक ही आकार की होती हैं",
          ],
          correctAnswer: 1,
          explanation:
            "इमारत एक अपारदर्शी वस्तु के रूप में काम करती है जो सूर्य के प्रकाश को अवरुद्ध करती है। ऊंची इमारतें लंबी छायाएं बनाती हैं। सूर्य की स्थिति पूरे दिन और मौसमों में बदलती है - गर्मियों में यह उच्च होता है (छोटी छायाएं) और सर्दियों में नीचे (लंबी छायाएं)। श्रीमती पटेल को गणना करनी चाहिए कि विभिन्न समय और मौसमों में छायाएं कहां गिरेंगी। बैंगलोर जैसे गर्म जलवायु में, छायाएं मूल्यवान शीतलन प्रदान कर सकती हैं, लेकिन खेल के मैदान के प्रकाश को अवरुद्ध करना सुरक्षा और उपयोगिता को कम करता है। यही कारण है कि कई शहरों में नए निर्माण के लिए 'छाया प्रभाव अध्ययन' आवश्यक हैं!",
          realWorldTip:
            "आधुनिक स्थायी वास्तुकला भवन डिज़ाइन को अनुकूलित करने के लिए 'छाया विश्लेषण' सॉफ़्टवेयर का उपयोग करती है। कुछ इमारतें जानबूझकर प्राकृतिक शीतलन के लिए छायादार आंगन बनाने के लिए डिज़ाइन की जाती हैं, जबकि अन्य दिन भर दिलचस्प वास्तुशिल्प प्रभाव बनाने के लिए छाया पैटर्न का उपयोग करती हैं!",
          imageEmoji: "🏢",
        },
      ],
      controls: {
        previous: "← पिछला",
        checkAnswer: "उत्तर जांचें",
        nextScenario: "अगला परिदृश्य →",
        scenarioCount: "परिदृश्य {{current}} / {{total}}",
      },
      headers: {
        realWorldSituation: "📖 वास्तविक दुनिया की स्थिति",
        scientificExplanation: "💡 वैज्ञानिक व्याख्या",
        realWorldApplication: "🌍 वास्तविक दुनिया का अनुप्रयोग",
      },
      progress: {
        title: "📊 आपकी प्रगति",
        completed: "पूर्ण परिदृश्य:",
        congrats:
          "🎉 बधाई हो! आपने सभी वास्तविक दुनिया के परिदृश्य पूरे कर लिए हैं!",
      },
      facts: {
        title: "🌟 भारत से अद्भुत छाया तथ्य",
        list: [
          "<strong>कोणार्क सूर्य मंदिर</strong> (ओडिशा) को इस तरह डिज़ाइन किया गया था कि सूर्य की पहली किरणें इसके मुख्य प्रवेश द्वार पर पड़ें, शानदार छाया पैटर्न बनाते हुए",
          "<strong>जंतर मंतर</strong> वेधशालाएं दिल्ली, जयपुर और अन्य शहरों में विशाल छाया-प्रक्षेपण उपकरण (सूर्यघड़ी) का उपयोग अविश्वसनीय सटीकता के साथ समय और खगोलीय स्थितियों को ट्रैक करने के लिए करती हैं",
          "प्राचीन भारतीय गणितज्ञ जैसे <strong>आर्यभट्ट</strong> (5वीं शताब्दी CE) ने पृथ्वी की परिधि और खगोलीय पिंडों की दूरियों की गणना करने के लिए छायाओं का अध्ययन किया",
          "भारत में पारंपरिक <strong>छाया कठपुतली</strong> प्रदर्शन अक्सर रात भर चलते हैं, रामायण और महाभारत जैसे महाकाव्यों की कहानियां चलती छायाओं के माध्यम से बताई जाती हैं",
          "राजस्थान में <strong>दिलवाड़ा मंदिर</strong> जटिल संगमरमर नक्काशी पर दिन भर बदलते छाया पैटर्न बनाने के लिए स्थित हैं",
        ],
      },
      simulation: {
        title: "🎭 छाया कठपुतली सिम्युलेटर",
        show: "सिम्युलेशन दिखाएं",
        hide: "सिम्युलेशन छुपाएं",
        intro:
          "पारंपरिक भारतीय छाया कठपुतली में छायाएं कैसे बदलती हैं देखने के लिए कठपुतली को हिलाएं और प्रकाश दूरी समायोजित करें!",
        shadowSize: "छाया का आकार",
        large: "बड़ा",
        medium: "मध्यम",
        small: "छोटा",
        puppetPosLabel: "🎭 कठपुतली की स्थिति (प्रकाश के करीब = बड़ी छाया)",
        puppetShapeLabel: "कठपुतली का आकार चुनें",
        shapes: {
          hand: {
            label: "हाथ",
            emoji: "✋",
          },
          bird: {
            label: "पक्षी",
            emoji: "🦅",
          },
          dog: {
            label: "कुत्ता",
            emoji: "🐕",
          },
        },
        tip: "<strong>💡 इसे आजमाएं:</strong> छाया को बड़ा बनाने के लिए कठपुतली को प्रकाश स्रोत (बाएं) के करीब ले जाएं! पारंपरिक छाया कठपुतली कलाकार प्रदर्शन के दौरान पात्रों को बढ़ने या सिकुड़ने के लिए इस तकनीक का उपयोग करते हैं।",
      },
    },
    realWorld: {
      title: "वास्तविक दुनिया के अनुप्रयोग",
      subtitle:
        "जानें कि रोजमर्रा की जिंदगी में प्रकाश की सीधी-रेखा संपत्ति का उपयोग कैसे किया जाता है",
      searchPlaceholder: "अनुप्रयोग खोजें...",
      allCategories: "सभी श्रेणियां",
      loading: "अनुप्रयोग लोड हो रहे हैं...",
      example: "उदाहरण:",
      applications: [
        {
          id: 1,
          title: "पनडुब्बियों में पेरिस्कोप",
          description:
            "पनडुब्बियां पानी के नीचे रहते हुए पानी के ऊपर देखने के लिए पेरिस्कोप का उपयोग करती हैं। पेरिस्कोप सीधे पथों में प्रकाश को पुनर्निर्देशित करने के लिए दर्पणों का उपयोग करते हैं।",
          icon: "🔭",
          category: "सैन्य और नेविगेशन",
          example: "45° कोण पर दो दर्पण प्रकाश को प्रतिबिंबित करते हैं।",
        },
        {
          id: 2,
          title: "लेजर पॉइंटर",
          description:
            "निर्माण में पूरी तरह से सीधी संदर्भ रेखाएं बनाने के लिए उपयोग किया जाता है।",
          icon: "🔦",
          category: "निर्माण और इंजीनियरिंग",
          example: "निर्माण कार्यकर्ता लेजर स्तरों का उपयोग करते हैं।",
        },
        {
          id: 3,
          title: "फाइबर ऑप्टिक केबल",
          description:
            "इंटरनेट डेटा संचारित करने के लिए प्रकाश का उपयोग करते हैं।",
          icon: "🌐",
          category: "संचार प्रौद्योगिकी",
          example: "आपका इंटरनेट फाइबर ऑप्टिक्स का उपयोग करता है।",
        },
        {
          id: 4,
          title: "टॉर्च और स्पॉटलाइट",
          description: "केंद्रित प्रकाश बीम बनाते हैं।",
          icon: "🔦",
          category: "प्रकाश और सुरक्षा",
          example: "आपातकालीन उत्तरदाता स्पॉटलाइट का उपयोग करते हैं।",
        },
        {
          id: 5,
          title: "कैमरा और फोटोग्राफी",
          description: "सीधी रेखाओं में प्रकाश यात्रा के कारण काम करते हैं।",
          icon: "📷",
          category: "इमेजिंग और कला",
          example: "फोटो लेते समय प्रकाश सीधी रेखाओं में यात्रा करता है।",
        },
        {
          id: 6,
          title: "सौर कुकर",
          description:
            "सूर्य के प्रकाश को केंद्रित करने के लिए दर्पणों का उपयोग करते हैं।",
          icon: "☀️",
          category: "सतत ऊर्जा",
          example: "सौर कुकर भोजन पकाने का स्वच्छ तरीका प्रदान करते हैं।",
        },
        {
          id: 7,
          title: "छाया और धूपघड़ी",
          description: "प्रकाश की सीधी रेखा गति के कारण छाया बनती है।",
          icon: "🌤️",
          category: "खगोल विज्ञान",
          example: "धूपघड़ी का उपयोग हजारों वर्षों से किया जाता है।",
        },
        {
          id: 8,
          title: "यातायात संकेत",
          description: "स्पष्ट दृश्य के लिए रखे गए हैं।",
          icon: "🚦",
          category: "परिवहन",
          example: "यातायात लाइट चौराहों पर ऊंची रखी जाती हैं।",
        },
        {
          id: 9,
          title: "ऑप्टिकल उपकरण",
          description: "माइक्रोस्कोप और टेलीस्कोप।",
          icon: "🔬",
          category: "विज्ञान",
          example: "खगोलविद टेलीस्कोप का उपयोग करते हैं।",
        },
        {
          id: 10,
          title: "बारकोड स्कैनर",
          description: "उत्पाद कोड पढ़ने के लिए लेजर का उपयोग करते हैं।",
          icon: "🏪",
          category: "खुदरा",
          example: "स्कैनर बारकोड पर सीधी बीम भेजते हैं।",
        },
        {
          id: 11,
          title: "चिकित्सा एंडोस्कोप",
          description: "शरीर के अंदर देखने के लिए।",
          icon: "🏥",
          category: "चिकित्सा",
          example: "डॉक्टर पतली ट्यूबों के माध्यम से प्रकाश का उपयोग करते हैं।",
        },
        {
          id: 12,
          title: "मंच प्रकाश",
          description: "नाटकीय प्रभाव बनाते हैं।",
          icon: "🎭",
          category: "मनोरंजन",
          example: "थिएटर में स्पॉटलाइट कलाकारों को ट्रैक करते हैं।",
        },
      ],
    },
    planeMirrorLearn: {
      title: "🪞 समतल दर्पण में छवि निर्माण 🪞",
      subtitle: "जानें कि समतल दर्पण आभासी छवियां कैसे बनाते हैं",
      demos: {
        basic: "📐 मूल निर्माण",
        properties: "✨ छवि गुण",
        interactive: "🎮 इंटरैक्टिव डेमो",
      },
      controls: {
        title: "⚙️ नियंत्रण",
        objectDistance: "दर्पण से वस्तु की दूरी",
        objectType: "वस्तु का प्रकार",
        showRayDiagram: "किरण आरेख दिखाएं",
        showMeasurements: "माप दिखाएं",
        showConstructionLines: "निर्माण रेखाएं दिखाएं",
        candle: "मोमबत्ती",
        person: "व्यक्ति",
        flower: "फूल",
        ball: "गेंद",
      },
      canvas: {
        object: "वस्तु",
        real: "(वास्तविक)",
        image: "छवि",
        virtual: "(आभासी)",
        mirrorLabel: "दर्पण",
        objectReal: "वस्तु (वास्तविक)",
        imageVirtual: "छवि (आभासी)",
        screenLabel: "स्क्रीन",
        noImageFormsHere: "(यहाँ कोई छवि नहीं बनती)",
        unitCm: "सेमी",
        propertiesTitle: "समतल दर्पण में छवि के गुण",
        keyPoints: "📐 मुख्य बिंदु:",
        basicPoints: {
          point1: "• छवि आभासी है (दर्पण के पीछे)",
          point2: "• वस्तु के समान आकार",
          point3: "• दर्पण से समान दूरी",
          point4: "• पार्श्व रूप से उलटी",
        },
        interactivePoints: {
          point1: "• वस्तु को हिलाने के लिए स्लाइडर का उपयोग करें",
          point2: "• ध्यान दें कि छवि समान रूप से चलती है",
          point3: "• दूरी हमेशा समान रहती है",
        },
        properties: {
          virtualImage: {
            title: "1. आभासी छवि",
            description:
              "छवि दर्पण के पीछे बनती है, स्क्रीन पर प्रक्षेपित नहीं की जा सकती",
          },
          sameSize: {
            title: "2. समान आकार",
            description: "छवि का आकार वस्तु के आकार के बराबर (आवर्धन = 1)",
          },
          equalDistance: {
            title: "3. समान दूरी",
            description: "छवि की दूरी = दर्पण से वस्तु की दूरी",
          },
          laterallyInverted: {
            title: "4. पार्श्व रूप से उलटी",
            description: "बाएं और दाएं पक्ष बदले हुए दिखाई देते हैं",
          },
          upright: {
            title: "5. सीधी/खड़ी",
            description: "छवि का अभिविन्यास वस्तु के समान है",
          },
        },
      },
      content: {
        title: "📚 छवि निर्माण को समझना",
        howImagesForm: "छवियां कैसे बनती हैं:",
        howImagesFormText:
          "जब किसी वस्तु से प्रकाश किरणें समतल दर्पण पर टकराती हैं, तो वे परावर्तन के नियम के अनुसार परावर्तित होती हैं। परावर्तित किरणें दर्पण के पीछे एक बिंदु से आती हुई प्रतीत होती हैं, जिससे एक आभासी छवि बनती है।",
        imageCharacteristics: "छवि की विशेषताएं:",
        characteristics: {
          virtual:
            "आभासी: छवि को स्क्रीन पर प्रक्षेपित नहीं किया जा सकता क्योंकि प्रकाश वास्तव में इससे होकर नहीं गुजरता",
          erect: "सीधी: छवि सीधी है, वस्तु के समान अभिविन्यास",
          sameSize: "समान आकार: छवि के आयाम वस्तु के समान हैं",
          equalDistance:
            "समान दूरी: दर्पण से छवि की दूरी वस्तु की दूरी के बराबर है",
          laterallyInverted:
            "पार्श्व रूप से उलटी: बाएं और दाएं पक्ष बदले हुए हैं",
        },
        formula: "सूत्र:",
        formulaText:
          "समतल दर्पणों के लिए, यदि वस्तु की दूरी d है, तो छवि की दूरी भी d है (दर्पण के पीछे)। आवर्धन = 1 (समान आकार)।",
        realLifeExamples: "वास्तविक जीवन के उदाहरण:",
        realLifeExamplesText:
          "बाथरूम के दर्पण में अपने आप को देखना, वाहनों में रियर-व्यू दर्पण, ड्रेसिंग रूम के दर्पण, और पेरिस्कोप सभी समतल दर्पण छवि निर्माण का उपयोग करते हैं।",
      },
    },
    planeMirrorPractice: {
      title: "📝 समतल दर्पण - अभ्यास मोड",
      subtitle: "इंटरैक्टिव प्रश्नों के साथ अपने ज्ञान का परीक्षण करें",
      progress: {
        question: "प्रश्न",
        of: "का",
        score: "स्कोर",
      },
      difficulty: {
        easy: "आसान",
        medium: "मध्यम",
        hard: "कठिन",
      },
      feedback: {
        correct: "✓ सही!",
        incorrect: "✗ गलत",
      },
      buttons: {
        nextQuestion: "अगला प्रश्न →",
        viewResults: "परिणाम देखें →",
        tryAgain: "पुनः प्रयास करें 🔄",
      },
      quizComplete: {
        title: "क्विज पूर्ण!",
        yourScore: "आपका स्कोर:",
        perfect:
          "उत्तम! आपने समतल दर्पण की अवधारणाओं में महारत हासिल कर ली है! 🌟",
        greatJob: "बहुत बढ़िया! आपकी समझ मजबूत है! 👏",
        keepPracticing:
          "अभ्यास जारी रखें! अवधारणाओं की समीक्षा करें और फिर से कोशिश करें! 💪",
      },
      questions: [
        {
          id: 1,
          question: "समतल दर्पण द्वारा किस प्रकार की छवि बनती है?",
          options: [
            "वास्तविक और उलटी",
            "आभासी और सीधी",
            "वास्तविक और सीधी",
            "आभासी और उलटी",
          ],
          explanation:
            "एक समतल दर्पण हमेशा एक आभासी और सीधी छवि बनाता है। आभासी का अर्थ है कि छवि को स्क्रीन पर प्रक्षेपित नहीं किया जा सकता, और सीधी का अर्थ है कि इसका अभिविन्यास वस्तु के समान है।",
          difficulty: "easy",
        },
        {
          id: 2,
          question:
            "यदि एक वस्तु को समतल दर्पण के सामने 5 सेमी की दूरी पर रखा जाता है, तो छवि दर्पण के पीछे कितनी दूरी पर दिखाई देगी?",
          options: ["2.5 सेमी", "5 सेमी", "10 सेमी", "15 सेमी"],
          explanation:
            "छवि की दूरी वस्तु की दूरी के बराबर होती है। यदि वस्तु 5 सेमी सामने है, तो छवि दर्पण के पीछे 5 सेमी दिखाई देती है। यह समतल दर्पणों के मूलभूत गुणों में से एक है।",
          difficulty: "easy",
        },
        {
          id: 3,
          question: "समतल दर्पण द्वारा उत्पादित आवर्धन क्या है?",
          options: ["0.5", "1", "2", "परिवर्तनशील"],
          explanation:
            "आवर्धन = छवि की ऊंचाई / वस्तु की ऊंचाई। समतल दर्पणों के लिए, छवि का आकार वस्तु के आकार के बराबर होता है, इसलिए आवर्धन = 1। इसका अर्थ है कि कोई बढ़ाव या कमी नहीं होती।",
          difficulty: "medium",
        },
        {
          id: 4,
          question:
            "एम्बुलेंस के सामने 'AMBULANCE' शब्द उल्टा क्यों लिखा होता है?",
          options: [
            "यह एक डिज़ाइन विकल्प है",
            "ताकि ड्राइवर अपने रियर-व्यू दर्पण में इसे सही देख सकें",
            "इसे अनोखा बनाने के लिए",
            "यह एक अलग भाषा में लिखा गया है",
          ],
          explanation:
            "शब्द पार्श्व रूप से उलटा होता है ताकि जब ड्राइवर अपने रियर-व्यू दर्पणों (जो समतल दर्पण हैं) में देखते हैं, तो वे शब्द को सही देख सकें और एम्बुलेंस को तुरंत पहचान सकें।",
          difficulty: "medium",
        },
        {
          id: 5,
          question:
            "एक व्यक्ति समतल दर्पण से 2 मीटर की दूरी पर खड़ा है। व्यक्ति और उसकी छवि के बीच की दूरी क्या है?",
          options: ["2 मीटर", "4 मीटर", "1 मीटर", "3 मीटर"],
          explanation:
            "व्यक्ति दर्पण के सामने 2 मीटर है, और छवि दर्पण के पीछे 2 मीटर है। कुल दूरी = 2 मीटर + 2 मीटर = 4 मीटर। यह वस्तु की दूरी + छवि की दूरी है।",
          difficulty: "medium",
        },
        {
          id: 6,
          question:
            "निम्नलिखित में से कौन सा समतल दर्पण द्वारा बनी छवि की विशेषता नहीं है?",
          options: [
            "वस्तु के समान आकार",
            "पार्श्व रूप से उलटी",
            "स्क्रीन पर प्रक्षेपित की जा सकती है",
            "दर्पण के पीछे उतनी ही दूरी पर दिखाई देती है जितनी वस्तु सामने है",
          ],
          explanation:
            "आभासी छवियों को स्क्रीन पर प्रक्षेपित नहीं किया जा सकता क्योंकि प्रकाश किरणें वास्तव में छवि की स्थिति से होकर नहीं गुजरती हैं। अन्य सभी विकल्प समतल दर्पण छवियों की सच्ची विशेषताएं हैं।",
          difficulty: "hard",
        },
        {
          id: 7,
          question:
            "यदि आप दर्पण के सामने अपना दाहिना हाथ उठाते हैं, तो छवि में कौन सा हाथ उठा हुआ दिखाई देगा?",
          options: ["दाहिना हाथ", "बायां हाथ", "दोनों हाथ", "कोई भी हाथ नहीं"],
          explanation:
            "पार्श्व उलटने के कारण, आपका दाहिना हाथ आपकी दर्पण छवि के बाएं हाथ के रूप में दिखाई देता है। इसीलिए जब आप अपना दाहिना हाथ उठाते हैं, तो छवि अपना बायां हाथ उठाती हुई दिखाई देती है।",
          difficulty: "easy",
        },
        {
          id: 8,
          question:
            "एक 6 फीट लंबा व्यक्ति समतल दर्पण के सामने खड़ा है। छवि की ऊंचाई क्या है?",
          options: ["3 फीट", "6 फीट", "12 फीट", "9 फीट"],
          explanation:
            "समतल दर्पण में छवि की ऊंचाई वस्तु की ऊंचाई के बराबर होती है। चूंकि आवर्धन = 1, 6 फीट लंबा व्यक्ति 6 फीट लंबी छवि बनाता है।",
          difficulty: "easy",
        },
        {
          id: 9,
          question:
            "यदि आप समतल दर्पण के करीब जाते हैं, तो छवि का क्या होता है?",
          options: [
            "छवि का आकार बढ़ता है",
            "छवि पीछे से दर्पण के करीब आती है",
            "छवि का आकार घटता है",
            "छवि वास्तविक हो जाती है",
          ],
          explanation:
            "जैसे-जैसे आप करीब जाते हैं, छवि भी पीछे से दर्पण के करीब आती है, समान दूरी बनाए रखते हुए। छवि का आकार समान रहता है (आवर्धन = 1), लेकिन यह आपकी आंख को बड़ी दिखती है क्योंकि यह करीब है।",
          difficulty: "hard",
        },
        {
          id: 10,
          question:
            "एक घड़ी 3:00 दिखाती है। समतल दर्पण में क्या समय दिखाई देगा?",
          options: ["3:00", "9:00", "12:00", "6:00"],
          explanation:
            "पार्श्व उलटने के कारण, 3:00 (जहां घंटे की सुई दाएं इंगित करती है) दर्पण में 9:00 (घंटे की सुई बाएं इंगित करती है) के रूप में दिखाई देती है। छवि क्षैतिज रूप से पलटी हुई है।",
          difficulty: "hard",
        },
      ],
    },
    planeMirrorRealWorld: {
      title: "🌍 समतल दर्पण - वास्तविक दुनिया के अनुप्रयोग",
      subtitle:
        "देखें कि समतल दर्पणों का उपयोग रोजमर्रा की जिंदगी में कैसे किया जाता है",
      driverSeesAmbulance: "ड्राइवर दर्पण में \"AMBULANCE\" को सही तरीके से देखता है!",
      scenarios: [
        {
          id: 1,
          title: "🚑 एम्बुलेंस दर्पण लेखन",
          description: "आपातकालीन वाहन पार्श्व उलटने का उपयोग करते हैं",
          scenario:
            "आपातकालीन वाहनों पर 'AMBULANCE' शब्द उल्टा क्यों लिखा होता है? जब ड्राइवर अपने रियर-व्यू दर्पणों (समतल दर्पण) में देखते हैं, तो पार्श्व रूप से उलटा पाठ सही दिखाई देता है, जिससे वे आपातकालीन वाहन को तुरंत पहचान सकते हैं और रास्ता दे सकते हैं।",
        },
        {
          id: 2,
          title: "🪞 ड्रेसिंग रूम दर्पण",
          description: "पूर्ण-लंबाई वाले दर्पण पोशाक जांच के लिए",
          scenario:
            "एक पूर्ण-लंबाई वाले समतल दर्पण को आपकी पूरी छवि दिखाने के लिए केवल आपकी ऊंचाई का आधा होना चाहिए! यह इसलिए है क्योंकि आपतन कोण परावर्तन कोण के बराबर होता है, जिससे आप एक छोटे दर्पण में सिर से पैर तक देख सकते हैं।",
        },
        {
          id: 3,
          title: "🚗 वाहन रियर-व्यू दर्पण",
          description: "पीछे की दृश्यता के लिए कारों में समतल दर्पण",
          scenario:
            "कारों में अंदर का रियर-व्यू दर्पण एक समतल दर्पण होता है। यह आपको पीछे के वाहनों तक की दूरी का सही अहसास देता है क्योंकि छवि की दूरी वस्तु की दूरी के बराबर होती है। साइड मिरर अक्सर व्यापक दृश्य के लिए उत्तल होते हैं।",
        },
        {
          id: 4,
          title: "💃 डांस स्टूडियो दर्पण",
          description: "नर्तक अपने रूप की जांच के लिए दर्पण का उपयोग करते हैं",
          scenario:
            "डांस स्टूडियो में बड़े समतल दर्पण होते हैं ताकि नर्तक अपनी गतिविधियों को वास्तविक समय में देख सकें। आभासी छवि दर्पण के पीछे समान दूरी पर दिखाई देती है, जिससे नर्तक अपनी स्थिति और समन्वय का सटीक आकलन कर सकते हैं।",
        },
        {
          id: 5,
          title: "🔬 पनडुब्बियों में पेरिस्कोप",
          description: "पानी के ऊपर देखने के लिए कई समतल दर्पण",
          scenario:
            "पेरिस्कोप 45° कोण पर दो समतल दर्पणों का उपयोग करते हैं। प्रकाश ऊपरी दर्पण से परावर्तित होता है, नीचे जाता है, निचले दर्पण से परावर्तित होता है, और आपकी आंखों तक पहुंचता है। प्रत्येक परावर्तन परावर्तन के नियम का पालन करता है, जिससे पनडुब्बी के चालक दल पानी की सतह के ऊपर देख सकते हैं।",
        },
        {
          id: 6,
          title: "✂️ नाई की दुकान के दर्पण",
          description: "दो दर्पण सिर के पीछे दिखा रहे हैं",
          scenario:
            "नाई दो दर्पणों का उपयोग करते हैं - एक सामने और एक पीछे। आप कई परावर्तन देखते हैं: पीछे के दर्पण में आपकी पीठ सामने के दर्पण में दिखाई देती है। प्रत्येक परावर्तन एक आभासी छवि है, जिससे आप अपने बाल कटवाने को सभी कोणों से जांच सकते हैं।",
        },
      ],
    },
  },
  gu: {
    nav: {
      logo: "પ્રકાશનું પરાવર્તન",
      tabs: {
        learn: "શીખો",
        practice: "અભ્યાસ",
        realWorld: "વાસ્તવિક દુનિયા",
      },
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
    shadowSimulator: {
      title: "છાયા બનાવનાર સિમ્યુલેટર",
      subtitle: "વૈજ્ઞાનિકની જેમ પ્રકાશ અને છાયા સાથે ખેલો!",
      objects: {
        title: "તમારી વસ્તુ પસંદ કરો!",
        cat: "બિલાડી કટ-આઉટ",
        superhero: "સુપરહીરો",
        bottle: "પાણીની બોટલ",
        glass: "ફ્રોસ્ટેડ ગ્લાસ",
        paper: "કાગળની શીટ",
        football: "ફૂટબોલ",
        tree: "વૃક્ષ",
        selected: "પસંદ કર્યું! તેને ચારેબાજુ ખેંચો!",
      },
      lightSize: {
        title: "પ્રકાશનું કદ",
        small: "નાનો પ્રકાશ (તીક્ષ્ણ છાયા)",
        large: "મોટો પ્રકાશ (મૃદુ છાયા)",
        smallFeedback: "તીક્ષ્ણ છાયા સક્રિય!",
        largeFeedback: "મૃદુ, ધૂંધળી છાયા મોડ!",
      },
      shadowFacts: {
        title: "છાયા તથ્યો!",
        opaque: "અપારદર્શક વસ્તુઓ = ઘેરી છાયા",
        translucent: "અર્ધ-પારદર્શક વસ્તુઓ = હળવી છાયા",
        transparent: "પારદર્શક વસ્તુઓ = લગભગ કોઈ છાયા નહીં",
        currentObject: {
          opaque: "અપારદર્શક",
          translucent: "અર્ધ-પારદર્શક",
          semiTransparent: "અર્ધ-પારદર્શક",
        },
      },
      controls: {
        showRays: "પ્રકાશ કિરણો બતાવો",
        dragHelper: "છાયા બદલાતી જોવા માટે પ્રકાશ, વસ્તુ અને સ્ક્રીનને ખેંચો!",
        screenLabel: "સ્ક્રીન (મને ખેંચો!)",
        lightLabel: "પ્રકાશ",
        dragObject: "મને ખેંચો!",
      },
      feedback: {
        shadowBig: "વાહ! તમારી છાયા ખૂબ મોટી થઈ ગઈ!",
        shadowTiny: "સારી ચાલ! તમે નાની છાયા બનાવી!",
        shadowShrinking: "નજીક આવી રહ્યા છો! છાયા સંકોચાઈ રહી છે!",
        objectBehindLight: "વસ્તુ પ્રકાશ સ્ત્રોતની પાછળ છે! કોઈ છાયા નહીં.",
        objectBeyondScreen: "વસ્તુ સ્ક્રીનની પાર છે! કોઈ છાયા નહીં.",
      },
      infoBox: {
        title: "શું થઈ રહ્યું છે?",
        hugeShadow: "વિશાળ છાયા! વસ્તુ પ્રકાશની ખૂબ નજીક છે!",
        tinyShadow: "નાની છાયા! વસ્તુ સ્ક્રીનની નજીક છે!",
        normalShadow: "સામાન્ય છાયા કદ! વસ્તુઓને આસપાસ ખસેડવાનો પ્રયાસ કરો!",
        softEdges: "મૃદુ ધાર કારણ કે પ્રકાશ મોટો છે!",
        sharpEdges: "તીક્ષ્ણ ધાર કારણ કે પ્રકાશ નાનો છે!",
        positionObject:
          "તેની છાયા જોવા માટે વસ્તુને પ્રકાશ સ્ત્રોત અને સ્ક્રીન વચ્ચે મૂકો!",
      },
    },
    canvas: {
      intro: {
        title: "શું પ્રકાશ સીધી રેખામાં મુસાફરી કરે છે?",
        questionMark: "?",
      },
      matchbox_setup: {
        instruction: "દરેક માચીસની પેટીમાં એક જ સ્થાને છિદ્ર બનાવો",
        boxLabel: "પેટી",
      },
      matchbox_aligned: {
        message: "સંરેખિત છિદ્રો - પ્રકાશ પસાર થાય છે!",
      },
      matchbox_misaligned: {
        message: "ખોટી સંરેખિત છિદ્રો - પ્રકાશ અવરોધાયો છે!",
      },
      pipe_intro: {
        question: "શું આપણે પાઈપ દ્વારા જોઈ શકીએ છીએ?",
      },
      pipe_straight: {
        message: "સીધી પાઈપ - તમે જ્યોત જોઈ શકો છો!",
      },
      pipe_bent: {
        message: "વળેલી પાઈપ - જ્યોત જોઈ શકતા નથી!",
      },
      conclusion: {
        title: "પ્રકાશ સીધી રેખામાં મુસાફરી કરે છે!",
        subtitle: "બંને પ્રયોગો પ્રકાશના આ મહત્વપૂર્ણ ગુણધર્મની પુષ્ટિ કરે છે",
      },
    },
    learn: {
      title: "✨ પ્રકાશનું પરાવર્તન ✨",
      subtitle:
        "સપાટીઓથી પ્રકાશ કેવી રીતે પરાવર્તિત થાય છે તેના ઇન્ટરેક્ટિવ પ્રદર્શન",
      demos: {
        law: "📐 પરાવર્તનનો નિયમ",
        types: "🔄 પરાવર્તનના પ્રકાર",
      },
      canvas: {
        normal: "સામાન્ય",
        incidentRay: "આપતિત કિરણ",
        reflectedRay: "પરાવર્તિત કિરણ",
        incidentAngle: "∠i = {{angle}}°",
        reflectedAngle: "∠r = {{angle}}°",
      },
      controls: {
        title: "⚙️ નિયંત્રણો",
        angleOfIncidence: "આપતન કોણ:",
        showNormalLine: "સામાન્ય રેખા બતાવો",
        showAngleMeasurements: "કોણ માપ બતાવો",
        animateLightTravel: "પ્રકાશ મુસાફરીને એનિમેટ કરો",
      },
      concepts: {
        title: "📚 મુખ્ય ખ્યાલો",
        law: {
          title: "પરાવર્તનનો નિયમ",
          description: "કહે છે કે જ્યારે પ્રકાશ સપાટીથી પરાવર્તિત થાય છે:",
          point1:
            "આપતિત કિરણ, પરાવર્તિત કિરણ અને સામાન્ય બધા એક જ પ્લેનમાં આવેલા છે",
          point2: "આપતન કોણ (∠i) પરાવર્તન કોણ (∠r) ની બરાબર છે",
          point3: "બંને કોણ સામાન્ય (સપાટી પર લંબ રેખા) થી માપવામાં આવે છે",
          redRay: "લાલ કિરણ:",
          redRayDesc: "અરીસા તરફ આવતું આપતિત પ્રકાશ",
          greenRay: "લીલું કિરણ:",
          greenRayDesc: "અરીસાથી ટકરાઈને પાછું જતું પરાવર્તિત પ્રકાશ",
          yellowLine: "પીળી ડેશ લાઇન:",
          yellowLineDesc: "સામાન્ય (સપાટી પર લંબ)",
        },
        types: {
          regularTitle: "નિયમિત (સ્પેક્યુલર) પરાવર્તન:",
          regularDesc:
            "અરીસા અને શાંત પાણી જેવી સરળ સપાટીઓ પર થાય છે. સમાંતર આપતિત કિરણો પરાવર્તન પછી પણ સમાંતર રહે છે, સ્પષ્ટ છબીઓ બનાવે છે.",
          diffuseTitle: "વિસર્જિત પરાવર્તન:",
          diffuseDesc:
            "કાગળ, દિવાલો અને કપડાં જેવી રફ સપાટીઓ પર થાય છે. સમાંતર આપતિત કિરણો વિવિધ દિશાઓમાં વિખેરાય છે, તેથી જ આપણે મોટાભાગની વસ્તુઓને કોઈપણ કોણથી જોઈ શકીએ છીએ પરંતુ તેઓ સ્પષ્ટ પરાવર્તન બનાવતા નથી.",
        },
      },
      infoBox: {
        lawTitle: "પરાવર્તનનો નિયમ:",
        lawFormula: "∠i = ∠r",
        lawDesc1: "આપતન કોણ બરાબર છે",
        lawDesc2: "પરાવર્તન કોણ",
      },
      types: {
        regularTitle: "નિયમિત પરાવર્તન",
        diffuseTitle: "વિસર્જિત પરાવર્તન",
        smoothSurface: "સરળ સપાટી",
        roughSurface: "રફ સપાટી",
        regularDesc: "સમાંતર આપતિત કિરણો પરાવર્તન પછી પણ સમાંતર રહે છે",
        diffuseDesc: "સમાંતર આપતિત કિરણો વિવિધ દિશાઓમાં વિખેરાય છે",
      },
    },
    practice: {
      title: "🌍 વાસ્તવિક દુનિયામાં છાયાઓ",
      subtitle: "જાણો કે છાયા રચના આપણા દૈનિક જીવનને કેવી રીતે અસર કરે છે",
      stats: {
        score: "સ્કોર",
        accuracy: "ચોકસાઈ",
        progress: "પ્રગતિ",
      },
      exercise: "અભ્યાસ {{num}}",
      difficulty: {
        easy: "સરળ",
        medium: "મધ્યમ",
        hard: "કઠિન",
      },
      completed: "પૂર્ણ",
      restart: "ફરી શરૂ કરો",
      submitAnswer: "જવાબ સબમિટ કરો",
      nextExercise: "આગલો અભ્યાસ",
      completedAll: "પૂર્ણ!",
      congratulations: "🎉 અભિનંદન!",
      completedAllText:
        "તમે બધા અભ્યાસો {{score}}/{{total}} ના સ્કોર સાથે પૂર્ણ કર્યા છે!",
      accuracyLabel: "ચોકસાઈ:",
      excellent: "🎉 ઉત્તમ!",
      notQuiteRight: "❌ તદ્દન યોગ્ય નથી",
      interactive: {
        mirrorAngle: "અરીસો કોણ:",
        tip: "💡 ટિપ: લીલા બીમને લાલ લક્ષ્ય પર ફટકારવા માટે અરીસાને સમાયોજિત કરો!",
        lightSource: "પ્રકાશ સ્ત્રોત",
        mirror: "અરીસો ({{angle}}°)",
        target: "લક્ષ્ય",
        perfect: "✓ સંપૂર્ણ!",
      },
      drawing: {
        instruction: "પરાવર્તિત કિરણ દોરો:",
        clearDrawing: "ડ્રોઇંગ સાફ કરો",
        tip: "✏️ અરીસામાંથી પરાવર્તિત પ્રકાશ કિરણનો માર્ગ દોરવા માટે તમારા માઉસનો ઉપયોગ કરો",
      },
      exercises: {
        "1": {
          question:
            "અરીસા દ્વારા પ્રકાશની દિશામાં ફેરફારને શું કહેવામાં આવે છે?",
          options: ["અપવર્તન", "પરાવર્તન", "વિખેરાઈ", "શોષણ"],
          explanation:
            "અરીસા દ્વારા પ્રકાશની દિશામાં ફેરફારને પરાવર્તન કહેવામાં આવે છે. જ્યારે પ્રકાશ ચમકદાર સપાટી પર અથડાય છે, ત્યારે તે પાછું ઉછળે છે।",
        },
        "2": {
          question: "નીચેનામાંથી કયું દીપ્ત પદાર્થ છે?",
          options: ["ચંદ્ર", "અરીસો", "સૂર્ય", "દિવાલ"],
          explanation:
            "સૂર્ય દીપ્ત પદાર્થ છે કારણ કે તે પોતાનો પ્રકાશ ઉત્સર્જિત કરે છે. ચંદ્ર, અરીસો અને દિવાલ બિન-દીપ્ત પદાર્થો છે જે માત્ર પ્રકાશને પરાવર્તિત કરે છે।",
        },
        "3": {
          question: "પ્રકાશ કેવી રીતે મુસાફરી કરે છે?",
          options: [
            "વક્ર રેખાઓમાં",
            "ઝિગઝેગ પેટર્નમાં",
            "સીધી રેખાઓમાં",
            "રેન્ડમ દિશાઓમાં",
          ],
          explanation:
            "પ્રકાશ હંમેશા સીધી રેખાઓમાં મુસાફરી કરે છે. આ તમે ટોર્ચ ચલાવો ત્યારે અથવા બારીઓ દ્વારા સૂર્યકિરણો જુઓ ત્યારે જોઈ શકાય છે।",
        },
        "4": {
          question: "સમતલ અરીસા દ્વારા બનેલી છબી સ્ક્રીન પર મેળવી શકાય છે।",
          explanation:
            "ખોટું. સમતલ અરીસા દ્વારા બનેલી છબી સ્ક્રીન પર મેળવી શકાતી નથી કારણ કે તે અરીસાની પાછળ બનેલી કાલ્પનિક છબી છે.",
        },
        "5": {
          question:
            "પરાવર્તિત પ્રકાશને લક્ષ્ય સ્થળ પર નિર્દેશિત કરવા માટે અરીસા કોણ સમાયોજિત કરો!",
          explanation:
            "અરીસાના કોણને બદલીને, તમે નિયંત્રિત કરી શકો છો કે પરાવર્તિત પ્રકાશ ક્યાં જાય છે. આ રીતે જ પેરિસ્કોપ અને અન્ય ઓપ્ટિકલ સાધનો કામ કરે છે।",
        },
        "6": {
          question:
            "જ્યારે સૂર્યપ્રકાશ અરીસા પર પડે છે ત્યારે અરીસાને ઝુકાવવાથી શું થાય છે?",
          options: [
            "પરાવર્તિત પ્રકાશની સ્થિતિ સમાન રહે છે",
            "પરાવર્તિત પ્રકાશની સ્થિતિ બદલાય છે",
            "સૂર્યપ્રકાશ પરાવર્તિત થવાનું બંધ થઈ જાય છે",
            "અરીસો પારદર્શક બને છે",
          ],
          explanation:
            "જ્યારે તમે અરીસાને ઝુકાવો છો, ત્યારે જે કોણ પર પ્રકાશ તેને અથડાય છે તે બદલાય છે, તેથી પરાવર્તિત પ્રકાશની દિશા પણ બદલાય છે.",
        },
        "7": {
          question: "અરીસામાંથી પરાવર્તિત પ્રકાશનો માર્ગ દોરો!",
          explanation:
            "પરાવર્તિત કિરણે અરીસામાંથી આપતન કોણ જેટલા કોણ પર સીધી રેખામાં મુસાફરી કરવી જોઈએ.",
        },
        "8": {
          question: "તમે અરીસામાં તમારો ચહેરો કેમ જોઈ શકો છો?",
          options: [
            "અરીસો પ્રકાશ ઉત્સર્જિત કરે છે",
            "તમારા ચહેરામાંથી પ્રકાશ અરીસામાંથી પરાવર્તિત થઈને તમારી આંખોમાં પ્રવેશ કરે છે",
            "તમારો ચહેરો અરીસામાંથી પસાર થાય છે",
            "અરીસો પ્રકાશને શોષી લે છે",
          ],
          explanation:
            "તમે તમારો ચહેરો જુઓ છો કારણ કે તમારા ચહેરામાંથી પ્રકાશ અરીસા સુધી મુસાફરી કરે છે, તેમાંથી પરાવર્તિત થાય છે, અને તમારી આંખોમાં પ્રવેશ કરે છે. આ પરાવર્તિત પ્રકાશ તમે જુઓ છો તે છબી બનાવે છે।",
        },
      },
      trueFalse: {
        true: "સાચું",
        false: "ખોટું",
      },
      overview: {
        title: "અભ્યાસ વિહંગાવલોકન",
        subtitle: "તમારા જવાબોની સમીક્ષા કરો અને બધા સાચા ઉકેલો જુઓ",
        backToPractice: "અભ્યાસ પર પાછા જાઓ",
        viewOverview: "વિહંગાવલોકન જુઓ",
        correct: "સાચું",
        incorrect: "ખોટું",
        accuracy: "ચોકસાઈ",
        exerciseList: "બધા અભ્યાસો",
        yourAnswer: "તમારો જવાબ",
        correctAnswer: "સાચો જવાબ",
        explanation: "સમજૂતી",
        notAnswered: "જવાબ આપ્યો નથી",
        drawn: "ચિત્ર સબમિટ કર્યું",
        notDrawn: "કોઈ ચિત્ર નથી",
        drawingRequired: "ચિત્ર જરૂરી",
      },
      scenarios: [
        {
          id: 1,
          title: "છાયા કઠપુતળી પ્રદર્શન",
          situation:
            "પ્રિયા તેના સ્કૂલના સાંસ્કૃતિક કાર્યક્રમ માટે છાયા કઠપુતળી (તોગાળુ ગોમ્બેયાતા) કરી રહી છે. તે જુએ છે કે જ્યારે તે કઠપુતળીને પ્રકાશ સ્ત્રોતની નજીક ખસેડે છે, ત્યારે સ્ક્રીન પર છાયામાં કંઈક રસપ્રદ બનતું હોય છે।",
          question:
            "પ્રિયાએ તેની કઠપુતળીની છાયા સ્ક્રીન પર મોટી દેખાડવા માટે શું કરવું જોઈએ?",
          options: [
            "કઠપુતળીને સ્ક્રીનની નજીક ખસેડો",
            "કઠપુતળીને પ્રકાશ સ્ત્રોતની નજીક ખસેડો",
            "પ્રકાશ સ્ત્રોતને સ્ક્રીનની નજીક ખસેડો",
            "વધુ તેજસ્વી પ્રકાશનો ઉપયોગ કરો",
          ],
          correctAnswer: 1,
          explanation:
            "જ્યારે પ્રિયા કઠપુતળીને પ્રકાશ સ્ત્રોતની નજીક ખસેડે છે (સ્ક્રીનને નિશ્ચિત રાખીને), છાયા મોટી થઈ જાય છે. આ એટલા માટે કારણ કે સ્ત્રોતમાંથી પ્રકાશ કિરણો કઠપુતળીની આસપાસથી પસાર થયા પછી વધુ ફેલાય છે, જે સ્ક્રીન પર મોટી છાયા બનાવે છે. છાયા કઠપુતળી કલાકારો પોતાના પાત્રોના કદને નિયંત્રિત કરવા માટે આ સિદ્ધાંતનો ઉપયોગ કરે છે!",
          realWorldTip:
            "પરંપરાગત ભારતીય છાયા કઠપુતળી ફોર્મ જેવા કે થોલુ બોમ્મલટા (આંધ્ર પ્રદેશ), તોગાળુ ગોમ્બેયાતા (કર્ણાટક), અને રાવણ છાયા (ઓડિશા) સદીઓથી પોતાના પ્રદર્શનોમાં નાટકીય અસરો બનાવવા માટે આ સિદ્ધાંતનો ઉપયોગ કરી રહ્યા છે!",
          imageEmoji: "🎭",
        },
        {
          id: 2,
          title: "સૂર્યાસ્ત પર ક્રિકેટ મેચ",
          situation:
            "રોહન અને તેના મિત્રો સાંજે ક્રિકેટ ખેલી રહ્યા છે. જેમ જેમ સૂર્ય આકાશમાં નીચે આવે છે, રોહન જુએ છે કે જમીન પર તેમની છાયાઓ બપોરે ખેલતી વખતે કરતાં ખૂબ લાંબી થઈ રહી છે।",
          question: "સાંજે છાયાઓ બપોર કરતાં શા માટે લાંબી થઈ જાય છે?",
          options: [
            "સાંજે લોકો લાંબા થઈ જાય છે",
            "સૂર્ય આકાશમાં નીચે છે, જે પ્રકાશનો વિવિધ કોણ બનાવે છે",
            "સાંજે જમીન નરમ થઈ જાય છે",
            "સાંજે હવામાં વધુ ધૂળ હોય છે",
          ],
          correctAnswer: 1,
          explanation:
            "બપોરે, સૂર્ય આકાશમાં ઊંચો હોય છે, લગભગ સીધો ઓવરહેડ. પ્રકાશ ઊંચા કોણ પર પડે છે, જે નાની છાયાઓ બનાવે છે. સાંજે, સૂર્ય આદિક્ષિતિ નજીક નીચે હોય છે. પ્રકાશ નીચા કોણ પર મુસાફરી કરે છે, જેમ કે પ્રિયાની કઠપુતળી જ્યારે પ્રકાશ સ્ત્રોત અલગ રીતે સ્થિત થાય છે ત્યારે મોટી છાયા બનાવે છે. આ જ કારણ છે કે છાયાઓ બપોરે સૌથી ટૂંકી અને સૂર્યોદય અને સૂર્યાસ્ત દરમ્યાન સૌથી લાંબી હોય છે!",
          realWorldTip:
            "આ જ કારણ છે કે ફોટોગ્રાફરો બાહ્ય ફોટોગ્રાફી માટે 'ગોલ્ડન અવર' (સવારે વહેલા અથવા સાંજે મોડા) પસંદ કરે છે - લાંબી, નરમ છાયાઓ ચિત્રોમાં ઊંડાઈ અને નાટક ઉમેરે છે!",
          imageEmoji: "🏏",
        },
        {
          id: 3,
          title: "ટ્રાફિક સિગ્નલ સુરક્ષા",
          situation:
            "કવ્યા જુએ છે કે વ્યસ્ત ટ્રાફિક આંતરછેદ પર, ખૂબ ઊંચી સ્ટ્રીટલાઇટ્સ છે. તેના કાકા સમજાવે છે કે આ લાઇટો છાયાઓ સંબંધિત સારા કારણોસર ઊંચાઈ પર સ્થિત છે.",
          question:
            "ટ્રાફિક આંતરછેદ પર સ્ટ્રીટલાઇટ્સ જમીનથી ઊંચી કેમ મૂકવામાં આવે છે?",
          options: [
            "તેમને વધુ સુશોભિત બનાવવા માટે",
            "રસ્તા પર છાયાઓ ઘટાડવા અને દૃશ્યતા સુધારવા માટે",
            "વીજળી બચાવવા માટે",
            "તેમને નુકસાનથી બચાવવા માટે",
          ],
          correctAnswer: 1,
          explanation:
            "જ્યારે પ્રકાશ સ્ત્રોતો ઊંચાઈ પર મૂકવામાં આવે છે, ત્યારે વસ્તુઓ (વાહનો, ધ્રુવો, અને લોકો જેવી) ની છાયાઓ નાની અને ઓછી પ્રમુખ બને છે. આ રસ્તા પર ડાર્ક પેચો ઘટાડે છે અને બધા રોડ ઉપયોગકર્તાઓ માટે દૃશ્યતા સુધારે છે. જો લાઇટો નીચે મૂકવામાં આવે, તો તે મોટી, ગૂંચવણમાં મૂકનારી છાયાઓ બનાવે જે જોખમો છુપાવી શકે અને ડ્રાઇવિંગને ખતરનાક બનાવી શકે. પ્રકાશ સ્ત્રોતની સ્થિતિ સીધી રીતે છાયાના કદ અને રોડ સુરક્ષાને અસર કરે છે!",
          realWorldTip:
            "આધુનિક સ્ટ્રીટ લાઇટિંગ ડિઝાઇન છાયા રચનાને કાળજીપૂર્વક ધ્યાનમાં લે છે. LED સ્ટ્રીટલાઇટ્સ છાયાઓ ઘટાડવા માટે સ્થિત છે જ્યારે સમાન પ્રકાશ પ્રદાન કરતી વખતે, રાત્રે રસ્તાઓને સુરક્ષિત બનાવે છે!",
          imageEmoji: "🚦",
        },
        {
          id: 4,
          title: "સૌર ગ્રહણ અવલોકન",
          situation:
            "સૌર ગ્રહણ દરમ્યાન, આદિત્યના વિજ્ઞાન શિક્ષકે ગ્રહણને સુરક્ષિત રીતે જોવા માટે પિનહોલ પ્રોજેક્ટર સેટઅપ કર્યો. આદિત્ય સ્ક્રીન પર અર્ધચંદ્રાકાર છબી જુએ છે અને આશ્ચર્ય પામે છે કે આપણે ગ્રહણને સીધું કેમ જોઈ શકતા નથી।",
          question:
            "સૌર ગ્રહણને સીધું જોવું ખતરનાક શા માટે છે, અને પિનહોલ પ્રોજેક્ટર કેવી રીતે મદદ કરે છે?",
          options: [
            "ગ્રહણ હાનિકારક કિરણો બહાર પાડે છે જેને પિનહોલ અવરોધે છે",
            "પિનહોલ ગ્રહણને સુરક્ષિત રીતે મોટું કરે છે",
            "સીધું જોવાથી આંખો નુકસાન થઈ શકે છે; પિનહોલ સ્ક્રીન પર સુરક્ષિત છબી બનાવે છે",
            "પિનહોલ ખોટી ગ્રહણ છબી બનાવે છે",
          ],
          correctAnswer: 2,
          explanation:
            "સૌર ગ્રહણ દરમ્યાન, સૂર્ય હજી પણ ખૂબ તેજસ્વી છે અને જો સીધું જોવામાં આવે તો તમારી આંખોને કાયમી નુકસાન પહોંચાડી શકે છે. પિનહોલ પ્રોજેક્ટર છાયા રચના જેવા જ સિદ્ધાંત પર કામ કરે છે - ગ્રહણમાંથી પ્રકાશ નાના છિદ્રમાંથી પસાર થાય છે અને સ્ક્રીન પર છબી બનાવે છે. આ આપણને સૂર્યને સીધું જોયા વગર ગ્રહણના છાયા પેટર્નને સુરક્ષિત રીતે જોવા માટે પરવાનગી આપે છે. ગ્રહણ દરમ્યાન ચંદ્ર પૃથ્વી પર છાયા પાડી રહ્યો છે!",
          realWorldTip:
            "સૌર ગ્રહણ દરમ્યાન, ખગોળશાસ્ત્રીઓ અને શિક્ષકો સમુદાયોમાં પિનહોલ પ્રોજેક્ટર સેટઅપ કરે છે જેથી લોકોને આ દુર્લભ ખગોળીય ઘટનાને સુરક્ષિત રીતે જોવામાં મદદ મળે. યોગ્ય ઉપકરણ વગર ક્યારેય સીધું સૂર્ય અથવા ગ્રહણ જોવાનું નહીં!",
          imageEmoji: "🌑",
        },
        {
          id: 5,
          title: "પુરાતત્વીય શોધ",
          situation:
            "ડૉ. શર્મા, કર્ણાટકમાં હંપીમાં પુરાતત્વશાસ્ત્રી, પ્રાચીન ચટ્ટાની કોતરણીની ફોટો લેવાની જરૂર છે. તે જુએ છે કે દિવસના ચોક્કસ સમય દરમ્યાન, કોતરણી જોવી અને ફોટોગ્રાફ કરવી ખૂબ સરળ હોય છે।",
          question:
            "વિગતોને સૌથી વધુ દેખાવવા માટે ડૉ. શર્મા માટે ચટ્ટાની કોતરણીની ફોટો લેવાનો શ્રેષ્ઠ સમય ક્યારે હશે?",
          options: [
            "બપોરે જ્યારે સૂર્ય સીધો ઓવરહેડ હોય",
            "સવારે વહેલા અથવા સાંજે મોડા જ્યારે સૂર્ય કોણ પર હોય",
            "રાત્રે ટોર્ચ સાથે",
            "બાદળિયા દિવસે જ્યારે કોઈ સીધી સૂર્યપ્રકાશ ન હોય",
          ],
          correctAnswer: 1,
          explanation:
            "જ્યારે સૂર્ય કોણ પર હોય છે (સવારે વહેલા અથવા સાંજે મોડા), તે ચટ્ટાની કોતરેલી ખાંચો અને વિગતોમાં છાયાઓ બનાવે છે. આ છાયાઓ ત્રિ-પરિમાણીય લક્ષણોને વધુ દ્રશ્ય અને નાટકીય બનાવે છે. બપોરે, જ્યારે સૂર્ય ઓવરહેડ હોય છે, ત્યારે લઘુત્તમ છાયાઓ હોય છે, જે કોતરણીને સપાટ અને જોવા માટે મુશ્કેલ બનાવે છે. આ છાયા રચના જેવો જ સિદ્ધાંત છે - પ્રકાશ સ્ત્રોતની સ્થિતિ અસર કરે છે કે છાયાઓ વિગતોને કેવી રીતે પ્રકટ કરે છે અથવા છુપાવે છે!",
          realWorldTip:
            "પુરાતત્વશાસ્ત્રીઓ, વાસ્તુકારો, અને કલા ઇતિહાસકારો કલાકૃતિઓ અને માળખાનો અભ્યાસ કરવા માટે 'રેકિંગ લાઇટ' (નીચા કોણ પર પ્રકાશ) નો ઉપયોગ કરે છે. આ તકનીક બનાવટ, સાધન નિશાનો, અને ઘસારા પેટર્નને પ્રકટ કરે છે જે અન્યથા અદૃશ્ય હોઈ શકે!",
          imageEmoji: "🏛️",
        },
        {
          id: 6,
          title: "કિસાનો અને સૂર્યઘડિયાળ",
          situation:
            "રાજસ્થાનના એક ગામમાં, વૃદ્ધ કિસાનો હજી પણ પરંપરાગત જ્ઞાનનો ઉપયોગ કરે છે જે દિવસ દરમ્યાન તેમની છાયા લંબાઈને અવલોકન કરીને સમયનો અંદાજ લગાવવા માટે. રમેશના દાદાએ તેને આ પ્રાચીન કૌશલ્ય શીખવ્યું.",
          question:
            "કિસાનો છાયા લંબાઈનો ઉપયોગ કરીને અંદાજિત સમય કેવી રીતે અંદાજી શકે છે?",
          options: [
            "છાયાઓ રેન્ડમ છે અને સમય સૂચવી શકતી નથી",
            "છાયા લંબાઈ અનુમાનિત રીતે બદલાય છે: બપોરે સૌથી ટૂંકી, સવાર/સાંજે લાંબી",
            "છાયાઓ હંમેશા ઉત્તર તરફ નિર્દેશ કરે છે",
            "સમય સાથે છાયાનો રંગ બદલાય છે",
          ],
          correctAnswer: 1,
          explanation:
            "સૂર્યની સ્થિતિ દિવસ દરમ્યાન અનુમાનિત રીતે બદલાય છે. સૂર્યોદય પર, છાયાઓ લાંબી હોય છે અને પશ્ચિમ તરફ નિર્દેશ કરે છે. જેમ જેમ સૂર્ય ઉગે છે, છાયાઓ ટૂંકી થઈ જાય છે અને ફેરવાય છે. બપોરે (સૌર બપોર), છાયાઓ સૌથી ટૂંકી હોય છે અને ઉત્તર તરફ નિર્દેશ કરે છે (કર્ક રેખાના ઉત્તરમાં સ્થાનોમાં જેમ કે મોટાભાગનો ભારત). બપોર પછી, છાયાઓ ફરીથી લંબાઈ પામે છે અને પૂર્વ તરફ નિર્દેશ કરે છે. છાયા રચનાનો આ અનુમાનિત પેટર્ન સદીઓથી સૂર્યઘડિયાળ અને પરંપરાગત સમય રાખવામાં ઉપયોગ કરવામાં આવ્યો છે!",
          realWorldTip:
            "સૂર્યઘડિયાળ માનવતાના સૌથી પ્રાચીન વૈજ્ઞાનિક ઉપકરણોમાંથી એક છે, 5,000 થી વધુ વર્ષોથી ઉપયોગમાં છે! ઘણા પ્રાચીન ભારતીય મંદિરોમાં સૂર્યઘડિયાળ નિશાનો છે. તમે એક લાકડીનો ઉપયોગ કરીને અને સની દિવસે પ્રતિ કલાકે છાયા સ્થિતિઓને ચિહ્નિત કરીને ઘરે એક સરળ સૂર્યઘડિયાળ પણ બનાવી શકો છો!",
          imageEmoji: "🌾",
        },
        {
          id: 7,
          title: "અગ્નિશામકો અને છાયાઓ",
          situation:
            "અગ્નિ સુરક્ષા પ્રદર્શન દરમ્યાન, અગ્નિશામક લક્ષ્મી વિદ્યાર્થીઓને સમજાવે છે કે અગ્નિશામકો કેમ ક્યારેક ધુમાડાથી ભરેલા મકાનોમાં શોધ કરતી વખતે અનેક કોણોમાંથી શક્તિશાળી લાઇટ્સનો ઉપયોગ કરે છે।",
          question:
            "રેસ્ક્યુ ઓપરેશન દરમ્યાન અગ્નિશામકો શા માટે અલગ અલગ કોણોમાંથી અનેક પ્રકાશ સ્ત્રોતોનો ઉપયોગ કરે છે?",
          options: [
            "માત્ર મકાનને વધુ તેજસ્વી બનાવવા માટે",
            "ગૂંચવણમાં મૂકનારી છાયાઓ ઘટાડવા અને અવરોધોને સ્પષ્ટ રીતે જોવા માટે",
            "ધુમાડો દૂર કરવા માટે",
            "અન્ય અગ્નિશામકોને સિગ્નલ આપવા માટે",
          ],
          correctAnswer: 1,
          explanation:
            "એક એક પ્રકાશ સ્ત્રોત મજબૂત છાયાઓ બનાવે છે જે અવરોધો, શિકારો, અથવા જોખમોને છુપાવી શકે છે. જ્યારે પ્રકાશ માત્ર એક દિશામાંથી આવે છે, ત્યારે વસ્તુઓ પ્રકાશને અવરોધે છે અને ડાર્ક છાયા પ્રદેશો બનાવે છે જ્યાં કંઈ જોઈ શકાતું નથી. અલગ અલગ કોણોમાંથી અનેક લાઇટ્સનો ઉપયોગ કરીને, અગ્નિશામકો આ છાયા પ્રદેશોને ઘટાડે છે. જો એક લાઇટ છાયા બનાવે, તો અલગ કોણમાંથી બીજી લાઇટ તેને પ્રકાશિત કરે છે. આ છાયા રચનાની સમજનો વ્યવહારિક ઉપયોગ છે!",
          realWorldTip:
            "ફિલ્મ અને ફોટોગ્રાફી સ્ટુડિયો પણ છાયાઓને નિયંત્રિત કરવા અને ઇચ્છિત અસર બનાવવા માટે અનેક પ્રકાશ સ્ત્રોતો (કી લાઇટ, ફિલ લાઇટ, બેક લાઇટ) નો ઉપયોગ કરે છે. છાયા રચનાની સમજ ઘણા વ્યવસાયોમાં મહત્વપૂર્ણ છે!",
          imageEmoji: "🚒",
        },
        {
          id: 8,
          title: "બિલ્ડિંગ ડિઝાઇન અને છાયાઓ",
          situation:
            "વાસ્તુકાર શ્રીમતી પટેલ બેંગલોરમાં નવી એપાર્ટમેન્ટ બિલ્ડિંગ ડિઝાઇન કરી રહ્યા છે. તેમને બિલ્ડિંગની સ્થિતિ કાળજીપૂર્વક યોજના બનાવવાની જરૂર છે જેથી તે બપોરના કલાકો દરમ્યાન બાળકો ખેલતી વખતે પડોશી પ્લેગ્રાઉન્ડ પર લાંબી છાયાઓ ન પાડે।",
          question:
            "બિલ્ડિંગને સ્થિત કરતી વખતે શ્રીમતી પટેલે છાયા રચના વિશે શું વિચારવું જોઈએ?",
          options: [
            "બિલ્ડિંગ ડિઝાઇનમાં છાયાઓનું મહત્વ નથી",
            "બિલ્ડિંગની ઊંચાઈ, સૂર્યનો પાથ, અને દિવસ દરમ્યાન છાયાની દિશા",
            "માત્ર બિલ્ડિંગનો રંગ છાયાઓને અસર કરે છે",
            "છાયાઓ આખો દિવસ એક જ કદની હોય છે",
          ],
          correctAnswer: 1,
          explanation:
            "બિલ્ડિંગ એક અપારદર્શક વસ્તુ તરીકે કામ કરે છે જે સૂર્યપ્રકાશને અવરોધે છે. ઊંચા બિલ્ડિંગો લાંબી છાયાઓ બનાવે છે. સૂર્યની સ્થિતિ દિવસ દરમ્યાન અને ઋતુઓ દરમ્યાન બદલાય છે - તે ઉનાળામાં ઊંચી હોય છે (ટૂંકી છાયાઓ) અને શિયાળામાં નીચી (લાંબી છાયાઓ). શ્રીમતી પટેલે ગણતરી કરવી જોઈએ કે વિવિધ સમય અને ઋતુઓમાં છાયાઓ ક્યાં પડશે. બેંગલોર જેવી ગરમ આબોહવામાં, છાયાઓ મૂલ્યવાન ઠંડક પ્રદાન કરી શકે છે, પરંતુ પ્લેગ્રાઉન્ડ પ્રકાશને અવરોધવું સુરક્ષા અને ઉપયોગિતાને ઘટાડે છે. આ જ કારણ છે કે ઘણા શહેરોમાં નવા બાંધકામ માટે 'છાયા અસર અભ્યાસ' જરૂરી છે!",
          realWorldTip:
            "આધુનિક ટકાઉ વાસ્તુકલા બિલ્ડિંગ ડિઝાઇનને ઓપ્ટિમાઇઝ કરવા માટે 'છાયા વિશ્લેષણ' સોફ્ટવેરનો ઉપયોગ કરે છે. કેટલીક બિલ્ડિંગો જાણી જોઈને પ્રાકૃતિક ઠંડક માટે છાયાદાર આંગણાં બનાવવા માટે ડિઝાઇન કરવામાં આવે છે, જ્યારે અન્ય દિવસ દરમ્યાન રસપ્રદ વાસ્તુકલા અસરો બનાવવા માટે છાયા પેટર્નનો ઉપયોગ કરે છે!",
          imageEmoji: "🏢",
        },
      ],
      controls: {
        previous: "← અગાઉ",
        checkAnswer: "જવાબ તપાસો",
        nextScenario: "આગળનું પરિદ્રશ્ય →",
        scenarioCount: "પરિદ્રશ્ય {{current}} / {{total}}",
      },
      headers: {
        realWorldSituation: "📖 વાસ્તવિક દુનિયાની પરિસ્થિતિ",
        scientificExplanation: "💡 વૈજ્ઞાનિક સમજૂતી",
        realWorldApplication: "🌍 વાસ્તવિક દુનિયાનો ઉપયોગ",
      },
      progress: {
        title: "📊 તમારી પ્રગતિ",
        completed: "પૂર્ણ પરિદ્રશ્ય:",
        congrats:
          "🎉 અભિનંદન! તમે બધા વાસ્તવિક દુનિયાના પરિદ્રશ્યો પૂર્ણ કર્યા છે!",
      },
      facts: {
        title: "🌟 ભારતના અદ્ભુત છાયા તથ્યો",
        list: [
          "<strong>કોનાર્ક સૂર્ય મંદિર</strong> (ઓડિશા) આ રીતે ડિઝાઇન કરવામાં આવ્યું હતું કે સૂર્યની પહેલી કિરણો તેના મુખ્ય પ્રવેશદ્વાર પર પડે, શાનદાર છાયા પેટર્ન બનાવતી",
          "<strong>જંતર મંતર</strong> વેધશાળાઓ દિલ્હી, જયપુર, અને અન્ય શહેરોમાં વિશાળ છાયા-પ્રક્ષેપણ સાધનો (સૂર્યઘડિયાળ) નો ઉપયોગ અવિશ્વસનીય ચોકસાઈ સાથે સમય અને ખગોળીય સ્થિતિઓને ટ્રેક કરવા માટે કરે છે",
          "પ્રાચીન ભારતીય ગણિતશાસ્ત્રીઓ જેવા કે <strong>આર્યભટ્ટ</strong> (5મી સદી CE) પૃથ્વીની પરિઘ અને આકાશી પિંડોની દૂરીઓની ગણતરી કરવા માટે છાયાઓનો અભ્યાસ કર્યો",
          "ભારતમાં પરંપરાગત <strong>છાયા કઠપુતળી</strong> પ્રદર્શનો ઘણીવાર રાત્રે ચાલે છે, રામાયણ અને મહાભારત જેવા મહાકાવ્યોની વાર્તાઓ ચલતી છાયાઓ દ્વારા કહેવામાં આવે છે",
          "રાજસ્થાનમાં <strong>દિલવાડા મંદિરો</strong> જટિલ સંગમરમર કોતરણી પર દિવસ દરમ્યાન બદલતા છાયા પેટર્ન બનાવવા માટે સ્થિત છે",
        ],
      },
      simulation: {
        title: "🎭 છાયા કઠપુતળી સિમ્યુલેટર",
        show: "સિમ્યુલેશન બતાવો",
        hide: "સિમ્યુલેશન છુપાવો",
        intro:
          "પરંપરાગત ભારતીય છાયા કઠપુતળીમાં છાયાઓ કેવી રીતે બદલાય છે તે જોવા માટે કઠપુતળીને ખસેડવાનો અને પ્રકાશ અંતર સમાયોજિત કરવાનો પ્રયાસ કરો!",
        shadowSize: "છાયાનું કદ",
        large: "મોટું",
        medium: "મધ્યમ",
        small: "નાનું",
        puppetPosLabel: "🎭 કઠપુતળીની સ્થિતિ (પ્રકાશની નજીક = મોટી છાયા)",
        puppetShapeLabel: "કઠપુતળીનું આકાર પસંદ કરો",
        shapes: {
          hand: {
            label: "હાથ",
            emoji: "✋",
          },
          bird: {
            label: "પક્ષી",
            emoji: "🦅",
          },
          dog: {
            label: "કુતરો",
            emoji: "🐕",
          },
        },
        tip: "<strong>💡 આ અજમાવો:</strong> છાયાને મોટી બનાવવા માટે કઠપુતળીને પ્રકાશ સ્ત્રોત (ડાબે) ની નજીક ખસેડો! પરંપરાગત છાયા કઠપુતળી કલાકારો પ્રદર્શન દરમ્યાન પાત્રોને વધવા અથવા સંકોચાવા માટે આ તકનીકનો ઉપયોગ કરે છે.",
      },
    },
    realWorld: {
      title: "વાસ્તવિક દુનિયા એપ્લિકેશન્સ",
      subtitle: "રોજિંદા જીવનમાં પ્રકાશની સીધી-રેખા ગુણધર્મનો ઉપયોગ જાણો",
      searchPlaceholder: "એપ્લિકેશન્સ શોધો...",
      allCategories: "બધી શ્રેણીઓ",
      loading: "એપ્લિકેશન્સ લોડ થઈ રહ્યા છે...",
      example: "ઉદાહરણ:",
      applications: [
        {
          id: 1,
          title: "સબમરીનમાં પેરિસ્કોપ",
          description:
            "સબમરીન પાણીની નીચે રહીને જોવા માટે પેરિસ્કોપનો ઉપયોગ કરે છે।",
          icon: "🔭",
          category: "લશ્કરી",
          example: "બે અરીસાઓ પ્રકાશને પ્રતિબિંબિત કરે છે।",
        },
        {
          id: 2,
          title: "લેસર પોઇન્ટર",
          description: "બાંધકામમાં સીધી રેખાઓ બનાવવા માટે વપરાય છે।",
          icon: "🔦",
          category: "બાંધકામ",
          example: "બાંધકામ કામદારો લેસરનો ઉપયોગ કરે છે।",
        },
        {
          id: 3,
          title: "ફાઇબર ઓપ્ટિક કેબલ્સ",
          description: "ઇન્ટરનેટ ડેટા માટે પ્રકાશનો ઉપયોગ કરે છે।",
          icon: "🌐",
          category: "સંચાર",
          example: "તમારું ઇન્ટરનેટ ફાઇબર ઓપ્ટિક્સનો ઉપયોગ કરે છે।",
        },
        {
          id: 4,
          title: "ટોર્ચ અને સ્પોટલાઇટ્સ",
          description: "કેન્દ્રિત બીમ બનાવે છે।",
          icon: "🔦",
          category: "પ્રકાશ",
          example: "કટોકટી સ્પોટલાઇટ્સનો ઉપયોગ કરે છે।",
        },
        {
          id: 5,
          title: "કેમેરા અને ફોટોગ્રાફી",
          description: "સીધી રેખાઓમાં પ્રકાશનો ઉપયોગ કરે છે।",
          icon: "📷",
          category: "કલા",
          example: "ફોટો લેતી વખતે પ્રકાશ સીધી રેખાઓમાં મુસાફરી કરે છે।",
        },
        {
          id: 6,
          title: "સોલર કૂકર",
          description: "સૂર્યપ્રકાશને કેન્દ્રિત કરે છે।",
          icon: "☀️",
          category: "ઊર્જા",
          example: "સોલર કૂકર સ્વચ્છ રીત પ્રદાન કરે છે।",
        },
        {
          id: 7,
          title: "પડછાયા અને સૂર્યઘડિયાળ",
          description: "પ્રકાશની સીધી રેખા ગતિને કારણે પડછાયા રચાય છે।",
          icon: "🌤️",
          category: "ખગોળશાસ્ત્ર",
          example: "સૂર્યઘડિયાળનો ઉપયોગ હજારો વર્ષોથી થાય છે।",
        },
        {
          id: 8,
          title: "ટ્રાફિક સિગ્નલ્સ",
          description: "સ્પષ્ટ દૃશ્ય માટે સ્થિત છે।",
          icon: "🚦",
          category: "પરિવહન",
          example: "ટ્રાફિક લાઇટ્સ ઊંચી મૂકવામાં આવે છે।",
        },
        {
          id: 9,
          title: "ઓપ્ટિકલ સાધનો",
          description: "માઇક્રોસ્કોપ અને ટેલિસ્કોપ।",
          icon: "🔬",
          category: "વિજ્ઞાન",
          example: "ખગોળશાસ્ત્રીઓ ટેલિસ્કોપનો ઉપયોગ કરે છે।",
        },
        {
          id: 10,
          title: "બારકોડ સ્કેનર્સ",
          description: "ઉત્પાદન કોડ વાંચવા માટે લેસરનો ઉપયોગ કરે છે।",
          icon: "🏪",
          category: "રિટેલ",
          example: "સ્કેનર બારકોડ પર સીધો બીમ મોકલે છે।",
        },
        {
          id: 11,
          title: "તબીબી એન્ડોસ્કોપ",
          description: "શરીરની અંદર જોવા માટે।",
          icon: "🏥",
          category: "તબીબી",
          example: "ડોક્ટર પાતળી નળી દ્વારા પ્રકાશનો ઉપયોગ કરે છે।",
        },
        {
          id: 12,
          title: "સ્ટેજ લાઇટિંગ",
          description: "નાટકીય અસરો બનાવે છે।",
          icon: "🎭",
          category: "મનોરંજન",
          example: "થિયેટરમાં સ્પોટલાઇટ્સ કલાકારોને ટ્રેક કરે છે।",
        },
      ],
    },
    planeMirrorLearn: {
      title: "🪞 સમતલ અરીસામાં છબી નિર્માણ 🪞",
      subtitle: "જાણો કે સમતલ અરીસા કેવી રીતે કાલ્પનિક છબીઓ બનાવે છે",
      demos: {
        basic: "📐 મૂળભૂત નિર્માણ",
        properties: "✨ છબી ગુણધર્મો",
        interactive: "🎮 ઇન્ટરએક્ટિવ ડેમો",
      },
      controls: {
        title: "⚙️ નિયંત્રણો",
        objectDistance: "અરીસાથી પદાર્થનું અંતર",
        objectType: "પદાર્થનો પ્રકાર",
        showRayDiagram: "કિરણ આકૃતિ બતાવો",
        showMeasurements: "માપ બતાવો",
        showConstructionLines: "નિર્માણ રેખાઓ બતાવો",
        candle: "મીણબત્તી",
        person: "વ્યક્તિ",
        flower: "ફૂલ",
        ball: "દડો",
      },
      canvas: {
        object: "પદાર્થ",
        real: "(વાસ્તવિક)",
        image: "છબી",
        virtual: "(કાલ્પનિક)",
        mirrorLabel: "અરીસો",
        objectReal: "પદાર્થ (વાસ્તવિક)",
        imageVirtual: "છબી (કાલ્પનિક)",
        screenLabel: "સ્ક્રીન",
        noImageFormsHere: "(અહીં કોઈ છબી બનતી નથી)",
        unitCm: "સેમી",
        propertiesTitle: "સમતલ અરીસામાં છબીના ગુણધર્મો",
        keyPoints: "📐 મુખ્ય મુદ્દાઓ:",
        basicPoints: {
          point1: "• છબી કાલ્પનિક છે (અરીસાની પાછળ)",
          point2: "• પદાર્થ જેટલું જ કદ",
          point3: "• અરીસાથી સમાન અંતર",
          point4: "• બાજુથી ઊંધી",
        },
        interactivePoints: {
          point1: "• પદાર્થને ખસેડવા માટે સ્લાઇડરનો ઉપયોગ કરો",
          point2: "• ધ્યાન આપો કે છબી સમાન રીતે ખસે છે",
          point3: "• અંતર હંમેશા સમાન રહે છે",
        },
        properties: {
          virtualImage: {
            title: "1. કાલ્પનિક છબી",
            description:
              "છબી અરીસાની પાછળ બને છે, સ્ક્રીન પર પ્રક્ષેપિત કરી શકાતી નથી",
          },
          sameSize: {
            title: "2. સમાન કદ",
            description: "છબીનું કદ પદાર્થના કદ જેટલું (વિસ્તરણ = 1)",
          },
          equalDistance: {
            title: "3. સમાન અંતર",
            description: "છબીનું અંતર = અરીસાથી પદાર્થનું અંતર",
          },
          laterallyInverted: {
            title: "4. બાજુથી ઊંધી",
            description: "ડાબી અને જમણી બાજુઓ બદલાયેલી દેખાય છે",
          },
          upright: {
            title: "5. સીધી/ઊભી",
            description: "છબીનું અભિમુખીકરણ પદાર્થ જેટલું જ છે",
          },
        },
      },
      content: {
        title: "📚 છબી નિર્માણ સમજવું",
        howImagesForm: "છબીઓ કેવી રીતે બને છે:",
        howImagesFormText:
          "જ્યારે પદાર્થમાંથી પ્રકાશ કિરણો સમતલ અરીસા પર અથડાય છે, તો તે પરાવર્તનના નિયમ અનુસાર પરાવર્તિત થાય છે. પરાવર્તિત કિરણો અરીસાની પાછળના બિંદુથી આવતી લાગે છે, જે એક કાલ્પનિક છબી બનાવે છે।",
        imageCharacteristics: "છબીની લાક્ષણિકતાઓ:",
        characteristics: {
          virtual:
            "કાલ્પનિક: છબીને સ્ક્રીન પર પ્રક્ષેપિત કરી શકાતી નથી કારણ કે પ્રકાશ ખરેખર તેમાંથી પસાર થતો નથી",
          erect: "સીધી: છબી સીધી છે, પદાર્થ જેટલું જ અભિમુખીકરણ",
          sameSize: "સમાન કદ: છબીના પરિમાણો પદાર્થ જેટલા જ છે",
          equalDistance:
            "સમાન અંતર: અરીસાથી છબીનું અંતર પદાર્થના અંતર જેટલું છે",
          laterallyInverted: "બાજુથી ઊંધી: ડાબી અને જમણી બાજુઓ બદલાયેલી છે",
        },
        formula: "સૂત્ર:",
        formulaText:
          "સમતલ અરીસા માટે, જો પદાર્થનું અંતર d છે, તો છબીનું અંતર પણ d છે (અરીસાની પાછળ). વિસ્તરણ = 1 (સમાન કદ).",
        realLifeExamples: "વાસ્તવિક જીવનના ઉદાહરણો:",
        realLifeExamplesText:
          "બાથરૂમના અરીસામાં પોતાને જોવું, વાહનોમાં રિયર-વ્યૂ અરીસા, ડ્રેસિંગ રૂમના અરીસા, અને પેરિસ્કોપ બધા સમતલ અરીસા છબી નિર્માણનો ઉપયોગ કરે છે।",
      },
    },
    planeMirrorPractice: {
      title: "📝 સમતલ અરીસો - અભ્યાસ મોડ",
      subtitle: "ઇન્ટરએક્ટિવ પ્રશ્નો સાથે તમારું જ્ઞાન ચકાસો",
      progress: {
        question: "પ્રશ્ન",
        of: "નો",
        score: "સ્કોર",
      },
      difficulty: {
        easy: "સરળ",
        medium: "મધ્યમ",
        hard: "કઠિન",
      },
      feedback: {
        correct: "✓ સાચું!",
        incorrect: "✗ ખોટું",
      },
      buttons: {
        nextQuestion: "આગળનો પ્રશ્ન →",
        viewResults: "પરિણામો જુઓ →",
        tryAgain: "ફરીથી પ્રયાસ કરો 🔄",
      },
      quizComplete: {
        title: "ક્વિઝ પૂર્ણ!",
        yourScore: "તમારો સ્કોર:",
        perfect:
          "પરફેક્ટ! તમે સમતલ અરીસાની વિભાવનાઓમાં નિપુણતા પ્રાપ્ત કરી છે! 🌟",
        greatJob: "સરસ કામ! તમારી સમજ મજબૂત છે! 👏",
        keepPracticing:
          "અભ્યાસ ચાલુ રાખો! વિભાવનાઓની સમીક્ષા કરો અને ફરીથી પ્રયાસ કરો! 💪",
      },
      questions: [
        {
          id: 1,
          question: "સમતલ અરીસા દ્વારા કયા પ્રકારની છબી બને છે?",
          options: [
            "વાસ્તવિક અને ઊંધી",
            "કાલ્પનિક અને સીધી",
            "વાસ્તવિક અને સીધી",
            "કાલ્પનિક અને ઊંધી",
          ],
          explanation:
            "સમતલ અરીસો હંમેશા કાલ્પનિક અને સીધી છબી બનાવે છે. કાલ્પનિકનો અર્થ છે કે છબીને સ્ક્રીન પર પ્રક્ષેપિત કરી શકાતી નથી, અને સીધીનો અર્થ છે કે તેનું અભિમુખીકરણ પદાર્થ જેટલું જ છે।",
          difficulty: "easy",
        },
        {
          id: 2,
          question:
            "જો પદાર્થને સમતલ અરીસાની સામે 5 સેમી અંતરે મૂકવામાં આવે, તો છબી અરીસાની પાછળ કેટલા અંતરે દેખાશે?",
          options: ["2.5 સેમી", "5 સેમી", "10 સેમી", "15 સેમી"],
          explanation:
            "છબીનું અંતર પદાર્થના અંતર જેટલું હોય છે. જો પદાર્થ 5 સેમી આગળ છે, તો છબી અરીસાની પાછળ 5 સેમી દેખાય છે. આ સમતલ અરીસાના મૂળભૂત ગુણધર્મોમાંથી એક છે।",
          difficulty: "easy",
        },
        {
          id: 3,
          question: "સમતલ અરીસા દ્વારા ઉત્પન્ન કરેલ વિસ્તરણ શું છે?",
          options: ["0.5", "1", "2", "ચલ"],
          explanation:
            "વિસ્તરણ = છબીની ઊંચાઈ / પદાર્થની ઊંચાઈ. સમતલ અરીસા માટે, છબીનું કદ પદાર્થના કદ જેટલું હોય છે, તેથી વિસ્તરણ = 1. આનો અર્થ છે કે કોઈ વધારો અથવા ઘટાડો થતો નથી।",
          difficulty: "medium",
        },
        {
          id: 4,
          question: "એમ્બ્યુલન્સની આગળ 'AMBULANCE' શબ્દ ઊંધો કેમ લખેલો છે?",
          options: [
            "તે એક ડિઝાઇન પસંદગી છે",
            "જેથી ડ્રાઇવરો તેમના રિયર-વ્યૂ અરીસામાં તેને સાચું જોઈ શકે",
            "તેને અનન્ય બનાવવા માટે",
            "તે અલગ ભાષામાં લખેલું છે",
          ],
          explanation:
            "શબ્દ બાજુથી ઊંધો હોય છે જેથી જ્યારે ડ્રાઇવરો તેમના રિયર-વ્યૂ અરીસામાં (જે સમતલ અરીસા છે) જુએ છે, ત્યારે તેઓ શબ્દને સાચું જોઈ શકે અને એમ્બ્યુલન્સને ઝડપથી ઓળખી શકે।",
          difficulty: "medium",
        },
        {
          id: 5,
          question:
            "વ્યક્તિ સમતલ અરીસાથી 2 મીટર અંતરે ઊભી છે. વ્યક્તિ અને તેની છબી વચ્ચેનું અંતર શું છે?",
          options: ["2 મીટર", "4 મીટર", "1 મીટર", "3 મીટર"],
          explanation:
            "વ્યક્તિ અરીસાની આગળ 2 મીટર છે, અને છબી અરીસાની પાછળ 2 મીટર છે. કુલ અંતર = 2 મીટર + 2 મીટર = 4 મીટર. આ પદાર્થનું અંતર + છબીનું અંતર છે।",
          difficulty: "medium",
        },
        {
          id: 6,
          question:
            "નીચેનામાંથી કયું સમતલ અરીસા દ્વારા બનેલી છબીની લાક્ષણિકતા નથી?",
          options: [
            "પદાર્થ જેટલું જ કદ",
            "બાજુથી ઊંધી",
            "સ્ક્રીન પર પ્રક્ષેપિત કરી શકાય છે",
            "અરીસાની પાછળ તેટલું જ અંતરે દેખાય છે જેટલું પદાર્થ આગળ છે",
          ],
          explanation:
            "કાલ્પનિક છબીઓને સ્ક્રીન પર પ્રક્ષેપિત કરી શકાતી નથી કારણ કે પ્રકાશ કિરણો ખરેખર છબીની સ્થિતિમાંથી પસાર થતી નથી. અન્ય બધા વિકલ્પો સમતલ અરીસા છબીઓની સાચી લાક્ષણિકતાઓ છે।",
          difficulty: "hard",
        },
        {
          id: 7,
          question:
            "જો તમે અરીસાની આગળ તમારો જમણો હાથ ઉઠાવો, તો છબીમાં કયો હાથ ઉઠાવેલો દેખાશે?",
          options: ["જમણો હાથ", "ડાબો હાથ", "બંને હાથ", "કોઈ પણ હાથ નહીં"],
          explanation:
            "બાજુથી ઊંધું થવાને કારણે, તમારો જમણો હાથ તમારી અરીસા છબીના ડાબા હાથ તરીકે દેખાય છે. તેથી જ જ્યારે તમે તમારો જમણો હાથ ઉઠાવો છો, ત્યારે છબી તેનો ડાબો હાથ ઉઠાવતી દેખાય છે।",
          difficulty: "easy",
        },
        {
          id: 8,
          question:
            "6 ફુટ ઊંચો વ્યક્તિ સમતલ અરીસાની આગળ ઊભો છે. છબીની ઊંચાઈ શું છે?",
          options: ["3 ફુટ", "6 ફુટ", "12 ફુટ", "9 ફુટ"],
          explanation:
            "સમતલ અરીસામાં છબીની ઊંચાઈ પદાર્થની ઊંચાઈ જેટલી હોય છે. વિસ્તરણ = 1 હોવાથી, 6 ફુટ ઊંચો વ્યક્તિ 6 ફુટ ઊંચી છબી બનાવે છે।",
          difficulty: "easy",
        },
        {
          id: 9,
          question: "જો તમે સમતલ અરીસાની નજીક જાઓ, તો છબીનું શું થાય છે?",
          options: [
            "છબીનું કદ વધે છે",
            "છબી પાછળથી અરીસાની નજીક આવે છે",
            "છબીનું કદ ઘટે છે",
            "છબી વાસ્તવિક બને છે",
          ],
          explanation:
            "જેમ જેમ તમે નજીક જાઓ છો, છબી પણ પાછળથી અરીસાની નજીક આવે છે, સમાન અંતર જાળવી રાખે છે. છબીનું કદ સમાન રહે છે (વિસ્તરણ = 1), પરંતુ તે તમારી આંખને મોટી લાગે છે કારણ કે તે નજીક છે।",
          difficulty: "hard",
        },
        {
          id: 10,
          question: "એક ઘડિયાળ 3:00 બતાવે છે. સમતલ અરીસામાં કયો સમય દેખાશે?",
          options: ["3:00", "9:00", "12:00", "6:00"],
          explanation:
            "બાજુથી ઊંધું થવાને કારણે, 3:00 (જ્યાં કલાકની સોય જમણી તરફ નિર્દેશ કરે છે) અરીસામાં 9:00 (કલાકની સોય ડાબી તરફ નિર્દેશ કરે છે) તરીકે દેખાય છે. છબી આડી રીતે ફ્લિપ થયેલી છે।",
          difficulty: "hard",
        },
      ],
    },
    planeMirrorRealWorld: {
      title: "🌍 સમતલ અરીસો - વાસ્તવિક દુનિયાના કાર્યક્રમો",
      subtitle:
        "જુઓ કે સમતલ અરીસાનો ઉપયોગ રોજબરોજની જિંદગીમાં કેવી રીતે કરવામાં આવે છે",
      driverSeesAmbulance: "ડ્રાઇવર અરીસામાં \"AMBULANCE\" સાચી રીતે જુએ છે!",
      scenarios: [
        {
          id: 1,
          title: "🚑 એમ્બ્યુલન્સ અરીસો લેખન",
          description: "જરૂરી વાહનો બાજુથી ઊંધું થવાનો ઉપયોગ કરે છે",
          scenario:
            "જરૂરી વાહનો પર 'AMBULANCE' શબ્દ ઊંધો કેમ લખેલો છે? જ્યારે ડ્રાઇવરો તેમના રિયર-વ્યૂ અરીસામાં (સમતલ અરીસા) જુએ છે, ત્યારે બાજુથી ઊંધું લખાણ સાચું દેખાય છે, જે તેઓને જરૂરી વાહનને ઝડપથી ઓળખવા અને રસ્તો આપવાની મંજૂરી આપે છે।",
        },
        {
          id: 2,
          title: "🪞 ડ્રેસિંગ રૂમ અરીસા",
          description: "પૂર્ણ-લંબાઈના અરીસા પોશાક તપાસ માટે",
          scenario:
            "પૂર્ણ-લંબાઈનો સમતલ અરીસો તમારી સંપૂર્ણ છબી બતાવવા માટે તમારી ઊંચાઈનો માત્ર અડધો હોવો જોઈએ! આ એટલા માટે કારણ કે આપત્તિનો કોણ પ્રતિબિંબિત કોણ જેટલો હોય છે, જે તમને નાના અરીસામાં માથાથી પગ સુધી જોવાની મંજૂરી આપે છે।",
        },
        {
          id: 3,
          title: "🚗 વાહન રિયર-વ્યૂ અરીસા",
          description: "પાછળની દૃશ્યતા માટે કારમાં સમતલ અરીસા",
          scenario:
            "કારોમાં અંદરનો રિયર-વ્યૂ અરીસો એક સમતલ અરીસો છે. તે તમને પાછળના વાહનોનું સાચું અંતરની ભાવના આપે છે કારણ કે છબીનું અંતર પદાર્થના અંતર જેટલું હોય છે. વધુ વ્યાપક દ્રશ્ય માટે સાઇડ મિરર અક્સર ઉત્તળ હોય છે।",
        },
        {
          id: 4,
          title: "💃 ડાન્સ સ્ટુડિયો અરીસા",
          description: "નર્તકો તેમના સ્વરૂપને તપાસવા માટે અરીસાનો ઉપયોગ કરે છે",
          scenario:
            "ડાન્સ સ્ટુડિયોમાં મોટા સમતલ અરીસા હોય છે જેથી નર્તકો તેમની હિલચાલને વાસ્તવિક સમયે જોઈ શકે. કાલ્પનિક છબી અરીસાની પાછળ સમાન અંતરે દેખાય છે, જે નર્તકોને તેમની સ્થિતિ અને સમન્વયનું ચોક્કસ નિર્ણય કરવામાં મદદ કરે છે।",
        },
        {
          id: 5,
          title: "🔬 પનડુબ્બીમાં પેરિસ્કોપ",
          description: "પાણીની ઉપર જોવા માટે અનેક સમતલ અરીસા",
          scenario:
            "પેરિસ્કોપ 45° કોણ પર બે સમતલ અરીસાનો ઉપયોગ કરે છે. પ્રકાશ ટોચના અરીસાથી પ્રતિબિંબિત થાય છે, નીચે જાય છે, નીચેના અરીસાથી પ્રતિબિંબિત થાય છે, અને તમારી આંખો સુધી પહોંચે છે. દરેક પ્રતિબિંબ પ્રતિબિંબના નિયમનું પાલન કરે છે, જે પનડુબ્બીના ક્રૂને પાણીની સપાટીની ઉપર જોવાની મંજૂરી આપે છે।",
        },
        {
          id: 6,
          title: "✂️ નાઈની દુકાનના અરીસા",
          description: "બે અરીસા માથાની પાછળ બતાવે છે",
          scenario:
            "નાઈ બે અરીસાનો ઉપયોગ કરે છે - એક આગળ અને એક પાછળ. તમે અનેક પ્રતિબિંબો જુઓ છો: પાછળના અરીસામાં તમારી પીઠ આગળના અરીસામાં દેખાય છે. દરેક પ્રતિબિંબ એક કાલ્પનિક છબી છે, જે તમને તમારા હેરકટને બધા ખૂણાઓથી તપાસવાની મંજૂરી આપે છે।",
        },
      ],
    },
  },
};


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
    let value: TranslationValue = translations[language] as unknown as TranslationValue;
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
    let value: TranslationValue = translations[language] as unknown as TranslationValue;
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
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "hi", name: "हिंदी", flag: "🇮🇳" },
    { code: "gu", name: "ગુજરાતી", flag: "🇮🇳" },
  ];

  const currentLanguage = languages.find(l => l.code === language) || languages[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.navbar-language-dropdown-container')) {
        setShowLanguageDropdown(false);
      }
    };

    if (showLanguageDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showLanguageDropdown]);

  return (
    <div className="relative navbar-language-dropdown-container">
      <button
        onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
        className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white border-2 border-teal-500 rounded-lg text-blue-700 font-medium hover:border-teal-600 transition-colors text-xs sm:text-sm md:text-base"
      >
        <span className="text-xs sm:text-sm font-semibold">{currentLanguage.flag === "🇬🇧" ? "GB" : ""}</span>
        <span className="text-xs sm:text-sm md:text-base font-semibold">{currentLanguage.name}</span>
        <svg
          className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {showLanguageDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-teal-500 rounded-lg shadow-lg z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setShowLanguageDropdown(false);
              }}
              className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                language === lang.code
                  ? 'bg-teal-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              } ${lang.code === 'en' ? 'rounded-t-lg' : ''} ${lang.code === 'gu' ? 'rounded-b-lg' : ''}`}
            >
              <span>{lang.flag}</span>
              <span className="font-semibold">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Reflection of Light Learn Component
const ReflectionOfLightLearn: React.FC = () => {
  const { language } = useLanguage();
  const [activeSection, setActiveSection] = useState(0);
  const [objectDistance, setObjectDistance] = useState(150);
  const [armRaised, setArmRaised] = useState<'none' | 'left' | 'right'>('none');
  const [earTouched, setEarTouched] = useState<'none' | 'left' | 'right'>('none');
  const [showAmbulance, setShowAmbulance] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const t = learnTranslations[language];

  const sections = [
    t.sections.introduction,
    t.sections.sameSize,
    t.sections.erectImage,
    t.sections.screenTest,
    t.sections.distanceRelationship,
    t.sections.lateralInversion,
    t.sections.realWorldApplication
  ];

  // Draw mirror reflection on canvas
  useEffect(() => {
    if (activeSection === 4 && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw mirror
      const mirrorX = canvas.width / 2;
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(mirrorX, 50);
      ctx.lineTo(mirrorX, canvas.height - 50);
      ctx.stroke();

      // Mirror gradient
      const gradient = ctx.createLinearGradient(mirrorX - 5, 0, mirrorX + 5, 0);
      gradient.addColorStop(0, 'rgba(203, 213, 225, 0.3)');
      gradient.addColorStop(0.5, 'rgba(148, 163, 184, 0.8)');
      gradient.addColorStop(1, 'rgba(203, 213, 225, 0.3)');
      ctx.fillStyle = gradient;
      ctx.fillRect(mirrorX - 4, 50, 8, canvas.height - 100);

      // Draw object (person)
      const objectX = mirrorX - objectDistance;
      const imageX = mirrorX + objectDistance;
      const personY = canvas.height / 2;

      // Draw distance lines
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      
      // Object to mirror
      ctx.beginPath();
      ctx.moveTo(objectX, personY - 60);
      ctx.lineTo(mirrorX, personY - 60);
      ctx.stroke();
      
      // Mirror to image
      ctx.beginPath();
      ctx.moveTo(mirrorX, personY - 60);
      ctx.lineTo(imageX, personY - 60);
      ctx.stroke();
      
      ctx.setLineDash([]);

      // Draw distance labels
      ctx.fillStyle = '#3b82f6';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${objectDistance}px`, (objectX + mirrorX) / 2, personY - 70);
      ctx.fillText(`${objectDistance}px`, (mirrorX + imageX) / 2, personY - 70);

      // Draw object person
      drawPerson(ctx, objectX, personY, '#0ea5e9', false);

      // Draw image person (semi-transparent)
      drawPerson(ctx, imageX, personY, '#0ea5e9', true);

      // Labels
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(t.introduction.object, objectX, personY + 80);
      ctx.fillStyle = '#64748b';
      ctx.fillText(t.introduction.image, imageX, personY + 80);
      ctx.fillText(t.introduction.mirror, mirrorX, 35);
    }
  }, [activeSection, objectDistance, language, t]);

  const renderSection = () => {
    switch (activeSection) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-xl">
              <h3 className="text-2xl font-bold text-teal-700 mb-4">
                {t.introduction.title}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t.introduction.description}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-teal-200">
                <div className="flex items-center justify-center mb-4">
                  <div className="text-6xl">🖊️</div>
                </div>
                <h4 className="font-bold text-lg text-teal-700 mb-2">{t.introduction.object}</h4>
                <p className="text-gray-600">
                  {t.introduction.objectDesc}
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-blue-200">
                <div className="flex items-center justify-center mb-4">
                  <div className="text-6xl opacity-60">🖊️</div>
                </div>
                <h4 className="font-bold text-lg text-blue-700 mb-2">{t.introduction.image}</h4>
                <p className="text-gray-600">
                  {t.introduction.imageDesc}
                </p>
              </div>
            </div>

            <div className="relative h-64 bg-gradient-to-b from-sky-100 to-sky-50 rounded-xl overflow-hidden">
              <div className="absolute left-1/2 top-0 bottom-0 w-2 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 shadow-lg"></div>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-gray-600 -rotate-90">
                {t.introduction.mirror}
              </div>
              
              {/* Object side */}
              <div className="absolute left-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2 transform hover:scale-110 transition-transform">
                <div className="text-6xl">✏️</div>
                <div className="text-xs font-bold text-center mt-2 text-teal-700">{t.introduction.object}</div>
              </div>

              {/* Image side */}
              <div className="absolute right-1/4 top-1/2 translate-x-1/2 -translate-y-1/2 transform scale-x-[-1]">
                <div className="text-6xl opacity-50">✏️</div>
                <div className="text-xs font-bold text-center mt-2 text-blue-700 scale-x-[-1]">{t.introduction.image}</div>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl">
              <h3 className="text-2xl font-bold text-purple-700 mb-4">
                {t.sameSize.title}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t.sameSize.description}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                { size: 'h-16 w-16', label: t.sameSize.small },
                { size: 'h-24 w-24', label: t.sameSize.medium },
                { size: 'h-32 w-32', label: t.sameSize.large }
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl shadow-lg">
                  <h4 className="font-bold text-center mb-4 text-gray-700">{item.label} {t.sameSize.objectLabel}</h4>
                  <div className="relative h-48 bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg">
                    <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-400"></div>
                    
                    {/* Object */}
                    <div className={`absolute left-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2 ${item.size} bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg shadow-lg flex items-center justify-center text-white font-bold`}>
                      📦
                    </div>

                    {/* Image */}
                    <div className={`absolute right-1/4 top-1/2 translate-x-1/2 -translate-y-1/2 ${item.size} bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg shadow-lg opacity-50 flex items-center justify-center text-white font-bold`}>
                      📦
                    </div>
                  </div>
                  <p className="text-center mt-2 text-sm text-gray-600">{t.sameSize.objectSizeEquals}</p>
                </div>
              ))}
            </div>

            <div className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded">
              <p className="text-teal-800 font-semibold">
                {t.sameSize.keyPoint}
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl">
              <h3 className="text-2xl font-bold text-green-700 mb-4">
                {t.erectImage.title}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t.erectImage.description}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Pen example */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h4 className="font-bold text-center mb-4 text-gray-700">{t.erectImage.penExample}</h4>
                <div className="relative h-64 bg-gradient-to-b from-sky-50 to-sky-100 rounded-lg">
                  <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-400"></div>
                  
                  {/* Object pen - pointing up */}
                  <div className="absolute left-1/3 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                      <div className="w-4 h-32 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full"></div>
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-blue-600"></div>
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-green-600">{t.erectImage.tipUp}</div>
                    </div>
                  </div>

                  {/* Image pen - also pointing up */}
                  <div className="absolute right-1/3 top-1/2 translate-x-1/2 -translate-y-1/2 opacity-60">
                    <div className="relative">
                      <div className="w-4 h-32 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full"></div>
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-blue-600"></div>
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-green-600">{t.erectImage.tipUp}</div>
                    </div>
                  </div>
                </div>
                <p className="text-center mt-2 text-sm text-green-600 font-semibold">{t.erectImage.bothPointingUp}</p>
              </div>

              {/* Tree example */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h4 className="font-bold text-center mb-4 text-gray-700">{t.erectImage.treeExample}</h4>
                <div className="relative h-64 bg-gradient-to-b from-sky-50 to-green-100 rounded-lg">
                  <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-400"></div>
                  
                  {/* Object tree */}
                  <div className="absolute left-1/3 bottom-8 -translate-x-1/2">
                    <div className="text-6xl">🌳</div>
                    <div className="text-xs font-bold text-center text-green-600 mt-1">{t.erectImage.upright}</div>
                  </div>

                  {/* Image tree */}
                  <div className="absolute right-1/3 bottom-8 translate-x-1/2 opacity-60">
                    <div className="text-6xl">🌳</div>
                    <div className="text-xs font-bold text-center text-green-600 mt-1">{t.erectImage.upright}</div>
                  </div>
                </div>
                <p className="text-center mt-2 text-sm text-green-600 font-semibold">{t.erectImage.imageNotInverted}</p>
              </div>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <p className="text-green-800 font-semibold">
                ✓ Key Point: Plane mirrors always form erect (upright) images, never upside down!
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-xl">
              <h3 className="text-2xl font-bold text-red-700 mb-4">
                {t.screenTest.title}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t.screenTest.description}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Screen behind mirror */}
              <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-red-200">
                <h4 className="font-bold text-center mb-4 text-gray-700">{t.screenTest.tryIt}</h4>
                <div className="relative h-64 bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg">
                  {/* Object */}
                  <div className="absolute left-12 top-1/2 -translate-y-1/2 text-4xl">🎾</div>
                  <div className="text-xs font-bold absolute left-12 top-3/4 text-teal-700">{t.screenTest.object}</div>

                  {/* Mirror */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-2 bg-gradient-to-r from-gray-300 via-gray-500 to-gray-300"></div>
                  <div className="text-xs font-bold absolute left-1/2 top-4 -translate-x-1/2 text-gray-600">{t.screenTest.mirror}</div>

                  {/* Screen */}
                  <div className="absolute right-8 top-1/4 bottom-1/4 w-16 bg-white border-4 border-gray-400 rounded flex items-center justify-center">
                    <div className="text-2xl">📄</div>
                  </div>
                  <div className="text-xs font-bold absolute right-8 bottom-4 text-gray-600">{t.screenTest.screen}</div>

                  {/* X mark */}
                  <div className="absolute right-12 top-1/2 -translate-y-1/2 text-6xl text-red-500 font-bold animate-pulse">✗</div>
                </div>
                <p className="text-center mt-2 text-sm text-red-600 font-semibold">{t.screenTest.result}</p>
              </div>

              {/* Screen in front of mirror */}
              <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-red-200">
                <h4 className="font-bold text-center mb-4 text-gray-700">{t.screenTest.instruction}</h4>
                <div className="relative h-64 bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg">
                  {/* Object */}
                  <div className="absolute left-12 top-1/2 -translate-y-1/2 text-4xl">🎾</div>
                  <div className="text-xs font-bold absolute left-12 top-3/4 text-teal-700">{t.screenTest.object}</div>

                  {/* Screen blocking */}
                  <div className="absolute left-1/3 top-1/4 bottom-1/4 w-16 bg-white border-4 border-gray-400 rounded flex items-center justify-center">
                    <div className="text-2xl">📄</div>
                  </div>
                  <div className="text-xs font-bold absolute left-1/3 bottom-4 text-gray-600">{t.screenTest.screen}</div>

                  {/* Mirror */}
                  <div className="absolute right-8 top-0 bottom-0 w-2 bg-gradient-to-r from-gray-300 via-gray-500 to-gray-300"></div>
                  <div className="text-xs font-bold absolute right-8 top-4 text-gray-600">{t.screenTest.mirror}</div>

                  {/* X mark */}
                  <div className="absolute left-1/3 top-1/2 -translate-y-1/2 text-6xl text-red-500 font-bold animate-pulse">✗</div>
                </div>
                <p className="text-center mt-2 text-sm text-red-600 font-semibold">{t.screenTest.result}</p>
              </div>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-800 font-semibold">
                {t.screenTest.keyPoint}
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
              <h3 className="text-2xl font-bold text-blue-700 mb-4">
                {t.distanceRelationship.title}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t.distanceRelationship.description}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {t.distanceRelationship.adjustDistance}
                </label>
                <input
                  type="range"
                  min="50"
                  max="200"
                  value={objectDistance}
                  onChange={(e) => setObjectDistance(Number(e.target.value))}
                  className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <canvas
                ref={canvasRef}
                width={600}
                height={400}
                className="w-full border-2 border-gray-300 rounded-lg bg-gradient-to-b from-sky-50 to-sky-100"
              />

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{objectDistance}px</div>
                  <div className="text-sm text-gray-600">{t.distanceRelationship.objectDistance}</div>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-indigo-600">{objectDistance}px</div>
                  <div className="text-sm text-gray-600">{t.distanceRelationship.imageDistance}</div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-blue-800 font-semibold">
                {t.distanceRelationship.keyPoint}
              </p>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-6 rounded-xl">
              <h3 className="text-2xl font-bold text-violet-700 mb-4">
                {t.lateralInversion.title}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t.lateralInversion.description}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Arm raising demo */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h4 className="font-bold text-center mb-4 text-gray-700">{t.lateralInversion.raiseYourHand}</h4>
                <div className="relative h-80 bg-gradient-to-b from-pink-50 to-pink-100 rounded-lg overflow-hidden">
                  <div className="absolute left-1/2 top-0 bottom-0 w-2 bg-gradient-to-r from-gray-300 via-gray-500 to-gray-300"></div>
                  
                  {/* Real person */}
                  <div className="absolute left-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                      {/* Head */}
                      <div className="w-16 h-16 bg-yellow-400 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl">
                        😊
                      </div>
                      {/* Body */}
                      <div className="w-20 h-28 bg-teal-500 rounded-lg mx-auto relative">
                        {/* Left arm */}
                        <div
                          className={`absolute -left-6 top-4 w-16 h-4 bg-teal-500 rounded transition-all duration-300 origin-right ${
                            armRaised === 'left' ? '-rotate-45 -translate-y-6' : ''
                          }`}
                        ></div>
                        {/* Right arm */}
                        <div
                          className={`absolute -right-6 top-4 w-16 h-4 bg-teal-500 rounded transition-all duration-300 origin-left ${
                            armRaised === 'right' ? 'rotate-45 -translate-y-6' : ''
                          }`}
                        ></div>
                      </div>
                      {/* Legs */}
                      <div className="flex gap-2 justify-center mt-2">
                        <div className="w-6 h-16 bg-blue-900 rounded"></div>
                        <div className="w-6 h-16 bg-blue-900 rounded"></div>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-center mt-2 text-teal-700">YOU</div>
                  </div>

                  {/* Mirror image */}
                  <div className="absolute right-1/4 top-1/2 translate-x-1/2 -translate-y-1/2 opacity-70">
                    <div className="relative">
                      {/* Head */}
                      <div className="w-16 h-16 bg-yellow-400 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl">
                        😊
                      </div>
                      {/* Body */}
                      <div className="w-20 h-28 bg-teal-500 rounded-lg mx-auto relative">
                        {/* Right arm (appears left in mirror) */}
                        <div
                          className={`absolute -right-6 top-4 w-16 h-4 bg-teal-500 rounded transition-all duration-300 origin-left ${
                            armRaised === 'left' ? 'rotate-45 -translate-y-6' : ''
                          }`}
                        ></div>
                        {/* Left arm (appears right in mirror) */}
                        <div
                          className={`absolute -left-6 top-4 w-16 h-4 bg-teal-500 rounded transition-all duration-300 origin-right ${
                            armRaised === 'right' ? '-rotate-45 -translate-y-6' : ''
                          }`}
                        ></div>
                      </div>
                      {/* Legs */}
                      <div className="flex gap-2 justify-center mt-2">
                        <div className="w-6 h-16 bg-blue-900 rounded"></div>
                        <div className="w-6 h-16 bg-blue-900 rounded"></div>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-center mt-2 text-blue-700">IMAGE</div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2 justify-center">
                  <button
                    onClick={() => setArmRaised(armRaised === 'left' ? 'none' : 'left')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      armRaised === 'left'
                        ? 'bg-violet-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {t.lateralInversion.yourLeft}
                  </button>
                  <button
                    onClick={() => setArmRaised(armRaised === 'right' ? 'none' : 'right')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      armRaised === 'right'
                        ? 'bg-violet-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {t.lateralInversion.yourRight}
                  </button>
                </div>
              </div>

              {/* Ear touching demo */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h4 className="font-bold text-center mb-4 text-gray-700">{t.lateralInversion.touchYourEar}</h4>
                <div className="relative h-80 bg-gradient-to-b from-purple-50 to-purple-100 rounded-lg overflow-hidden">
                  <div className="absolute left-1/2 top-0 bottom-0 w-2 bg-gradient-to-r from-gray-300 via-gray-500 to-gray-300"></div>
                  
                  {/* Real person */}
                  <div className="absolute left-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                      {/* Head with ears */}
                      <div className="relative w-16 h-16 bg-yellow-400 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl">
                        <div className="absolute -left-2 top-1/3 w-4 h-6 bg-yellow-300 rounded-full"></div>
                        {earTouched === 'left' && (
                          <div className="absolute -left-3 top-1/3 text-2xl">👆</div>
                        )}
                        <div className="absolute -right-2 top-1/3 w-4 h-6 bg-yellow-300 rounded-full"></div>
                        {earTouched === 'right' && (
                          <div className="absolute -right-3 top-1/3 text-2xl">👆</div>
                        )}
                        😊
                      </div>
                      {/* Body */}
                      <div className="w-20 h-28 bg-purple-500 rounded-lg mx-auto"></div>
                      {/* Legs */}
                      <div className="flex gap-2 justify-center mt-2">
                        <div className="w-6 h-16 bg-blue-900 rounded"></div>
                        <div className="w-6 h-16 bg-blue-900 rounded"></div>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-center mt-2 text-purple-700">YOU</div>
                  </div>

                  {/* Mirror image */}
                  <div className="absolute right-1/4 top-1/2 translate-x-1/2 -translate-y-1/2 opacity-70">
                    <div className="relative">
                      {/* Head with ears */}
                      <div className="relative w-16 h-16 bg-yellow-400 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl">
                        <div className="absolute -right-2 top-1/3 w-4 h-6 bg-yellow-300 rounded-full"></div>
                        {earTouched === 'left' && (
                          <div className="absolute -right-3 top-1/3 text-2xl scale-x-[-1]">👆</div>
                        )}
                        <div className="absolute -left-2 top-1/3 w-4 h-6 bg-yellow-300 rounded-full"></div>
                        {earTouched === 'right' && (
                          <div className="absolute -left-3 top-1/3 text-2xl scale-x-[-1]">👆</div>
                        )}
                        😊
                      </div>
                      {/* Body */}
                      <div className="w-20 h-28 bg-purple-500 rounded-lg mx-auto"></div>
                      {/* Legs */}
                      <div className="flex gap-2 justify-center mt-2">
                        <div className="w-6 h-16 bg-blue-900 rounded"></div>
                        <div className="w-6 h-16 bg-blue-900 rounded"></div>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-center mt-2 text-blue-700">IMAGE</div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2 justify-center">
                  <button
                    onClick={() => setEarTouched(earTouched === 'left' ? 'none' : 'left')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      earTouched === 'left'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Touch Left Ear
                  </button>
                  <button
                    onClick={() => setEarTouched(earTouched === 'right' ? 'none' : 'right')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      earTouched === 'right'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Touch Right Ear
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-violet-50 border-l-4 border-violet-500 p-4 rounded">
              <p className="text-violet-800 font-semibold">
                ✓ Key Point: When you raise your LEFT arm, the image raises its RIGHT arm. When you touch your RIGHT ear, the image touches its LEFT ear!
              </p>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl">
              <h3 className="text-2xl font-bold text-orange-700 mb-4">
                {t.realWorldApplication.title}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t.realWorldApplication.description}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="mb-4 flex justify-center">
                <button
                  onClick={() => setShowAmbulance(!showAmbulance)}
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                >
                  {showAmbulance ? t.realWorldApplication.mirrorView : t.realWorldApplication.normalView}
                </button>
              </div>

              {/* Ambulance view */}
              <div className="relative h-96 bg-gradient-to-b from-sky-200 to-sky-100 rounded-lg overflow-hidden border-4 border-gray-300">
                {/* Road */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gray-600">
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2 border-t-4 border-b-4 border-dashed border-yellow-300"></div>
                </div>

                {/* Ambulance */}
                <div className="absolute bottom-32 left-1/2 -translate-x-1/2 transform transition-all duration-500">
                  <div className="relative">
                    {/* Ambulance body */}
                    <div className="w-64 h-32 bg-white border-4 border-red-500 rounded-lg relative shadow-2xl">
                      {/* Text on ambulance (reversed) */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="text-4xl font-bold text-red-600 tracking-wider" style={{ transform: 'scaleX(-1)' }}>
                          AMBULANCE
                        </div>
                      </div>
                      
                      {/* Red cross */}
                      <div className="absolute top-2 right-4 text-red-600">
                        <div className="text-3xl">✚</div>
                      </div>

                      {/* Windows */}
                      <div className="absolute top-2 left-4 w-12 h-8 bg-sky-300 rounded border-2 border-gray-400"></div>
                    </div>

                    {/* Wheels */}
                    <div className="absolute -bottom-4 left-4 w-12 h-12 bg-gray-800 rounded-full border-4 border-gray-600"></div>
                    <div className="absolute -bottom-4 right-4 w-12 h-12 bg-gray-800 rounded-full border-4 border-gray-600"></div>
                  </div>
                </div>

                {/* Rear-view mirror overlay */}
                {showAmbulance && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-80 bg-black bg-opacity-80 p-6 rounded-lg shadow-2xl border-4 border-gray-700 animate-fade-in">
                    <div className="text-white text-sm font-bold mb-2 text-center">REAR-VIEW MIRROR</div>
                    <div className="bg-gradient-to-b from-sky-200 to-sky-100 rounded p-4 relative">
                      {/* Mirror view (not reversed, so readable) */}
                      <div className="text-3xl font-bold text-red-600 tracking-wider text-center">
                        AMBULANCE
                      </div>
                      <div className="text-xs text-center mt-2 text-gray-600">Now you can read it!</div>
                    </div>
                    <div className="mt-2 text-white text-xs text-center opacity-75">
                      The reversed text becomes normal in the mirror
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 grid md:grid-cols-2 gap-4">
                <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
                  <h4 className="font-bold text-red-700 mb-2">On the Ambulance:</h4>
                  <div className="text-2xl font-bold text-red-600 text-center" style={{ transform: 'scaleX(-1)' }}>
                    AMBULANCE
                  </div>
                  <p className="text-sm text-gray-600 text-center mt-2">Appears reversed to us</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                  <h4 className="font-bold text-green-700 mb-2">In the Mirror:</h4>
                  <div className="text-2xl font-bold text-green-600 text-center">
                    AMBULANCE
                  </div>
                  <p className="text-sm text-gray-600 text-center mt-2">Appears normal!</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
              <p className="text-orange-800 font-semibold">
                ✓ Key Point: Lateral inversion is not just theory - it has practical applications! Emergency vehicles use this property to ensure drivers can quickly identify them.
              </p>
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-xl border-2 border-teal-200">
              <h3 className="text-2xl font-bold text-teal-700 mb-4 text-center">
                🎓 Complete Summary: Images in Plane Mirrors
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-3xl mb-2">📏</div>
                  <h4 className="font-bold text-teal-700">Same Size</h4>
                  <p className="text-sm text-gray-600">Image size = Object size</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-3xl mb-2">⬆️</div>
                  <h4 className="font-bold text-green-700">Erect</h4>
                  <p className="text-sm text-gray-600">Image appears upright</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-3xl mb-2">🚫</div>
                  <h4 className="font-bold text-red-700">Virtual</h4>
                  <p className="text-sm text-gray-600">Cannot be shown on screen</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-3xl mb-2">📐</div>
                  <h4 className="font-bold text-blue-700">Equal Distance</h4>
                  <p className="text-sm text-gray-600">Object & image equidistant from mirror</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
                  <div className="text-3xl mb-2">🔄</div>
                  <h4 className="font-bold text-purple-700">Laterally Inverted</h4>
                  <p className="text-sm text-gray-600">Left appears right, right appears left</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const drawPerson = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
    isImage: boolean
  ) => {
    if (isImage) {
      ctx.globalAlpha = 0.6;
    }

    // Head
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(x, y - 30, 15, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = color;
    ctx.fillRect(x - 12, y - 15, 24, 35);

    // Arms
    ctx.fillRect(x - 25, y - 10, 13, 8);
    ctx.fillRect(x + 12, y - 10, 13, 8);

    // Legs
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x - 10, y + 20, 8, 25);
    ctx.fillRect(x + 2, y + 20, 8, 25);

    ctx.globalAlpha = 1;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl">🪞</div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                Images Formed in a Plane Mirror
              </h1>
              <p className="text-gray-600 mt-2">
                Grade 7 Science - Chapter 11.6: Interactive Learning Experience
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-wrap gap-2 mt-6">
            {sections.map((section, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSection(idx)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  activeSection === idx
                    ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {idx + 1}. {section}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
          {renderSection()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t-2 border-gray-200">
            <button
              onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
              disabled={activeSection === 0}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeSection === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-teal-500 text-white hover:bg-teal-600'
              }`}
            >
              ← {t.previous}
            </button>

            <div className="text-gray-600 font-semibold self-center">
              {activeSection + 1} / {sections.length}
            </div>

            <button
              onClick={() => setActiveSection(Math.min(sections.length - 1, activeSection + 1))}
              disabled={activeSection === sections.length - 1}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeSection === sections.length - 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {t.next} →
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">
            Interactive learning tool created for NCERT Grade 7 Science curriculum
          </p>
          <p className="text-xs mt-2">© 2025 Reasonify Educational Technologies</p>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px) translateX(-50%);
          }
          to {
            opacity: 1;
            transform: translateY(0) translateX(-50%);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        input[type='range']::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #0ea5e9, #3b82f6);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        input[type='range']::-moz-range-thumb {
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #0ea5e9, #3b82f6);
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

// Practice Mode Component
interface Question {
  id: number;
  type: 'mcq' | 'interactive' | 'match' | 'drag-drop';
  question: { en: string; hi: string; gu: string };
  options?: { en: string; hi: string; gu: string }[];
  correctAnswer: string | number | string[];
  explanation: { en: string; hi: string; gu: string };
  difficulty: 'easy' | 'medium' | 'hard';
  image?: string;
}

const practiceTranslations = {
  en: {
    title: 'Practice Mode',
    subtitle: 'Test your understanding of plane mirror images',
    score: 'Score',
    question: 'Question',
    of: 'of',
    submit: 'Submit Answer',
    next: 'Next Question',
    previous: 'Previous',
    viewResults: 'View Results',
    correct: 'Correct',
    incorrect: 'Incorrect',
    wrong: 'Wrong',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    interactive: 'Interactive',
    quizComplete: 'Quiz Complete!',
    performance: "Here's how you performed",
    correctAnswers: 'Correct Answers',
    totalQuestions: 'Total Questions',
    excellentWork: 'Excellent Work!',
    goodJob: 'Good Job!',
    keepPracticing: 'Keep Practicing!',
    excellentMsg: 'You have a strong understanding of plane mirror images!',
    goodMsg: 'You have a good grasp of the concepts. Review the areas you found challenging.',
    practiceMsg: 'Keep studying the concepts and try again. Practice makes perfect!',
    tryAgain: 'Try Again',
    backToLearn: 'Back to Learn',
    progress: 'Progress',
    objectDistance: 'Object Distance',
    imageDistance: 'Image Distance',
    units: 'units',
    properties: 'Properties',
    matchWith: 'Match with',
    selectAnswer: 'Select answer...',
    correctMatches: 'Correct Matches',
    sameSize: 'Same Size',
    erect: 'Erect',
    virtual: 'Virtual',
    lateralInversion: 'Lateral Inversion',
    imageSizeEquals: 'Image size equals object size',
    imageUpright: 'Image is upright',
    cannotProject: 'Cannot be projected on screen',
    leftAppearsRight: 'Left appears as right'
  },
  hi: {
    title: 'अभ्यास मोड',
    subtitle: 'समतल दर्पण की छवियों की अपनी समझ का परीक्षण करें',
    score: 'स्कोर',
    question: 'प्रश्न',
    of: 'का',
    submit: 'उत्तर जमा करें',
    next: 'अगला प्रश्न',
    previous: 'पिछला',
    viewResults: 'परिणाम देखें',
    correct: 'सही',
    incorrect: 'गलत',
    wrong: 'गलत',
    easy: 'आसान',
    medium: 'मध्यम',
    hard: 'कठिन',
    interactive: 'इंटरैक्टिव',
    quizComplete: 'प्रश्नोत्तरी पूर्ण!',
    performance: 'यहाँ आपका प्रदर्शन है',
    correctAnswers: 'सही उत्तर',
    totalQuestions: 'कुल प्रश्न',
    excellentWork: 'उत्कृष्ट कार्य!',
    goodJob: 'अच्छा काम!',
    keepPracticing: 'अभ्यास जारी रखें!',
    excellentMsg: 'आपको समतल दर्पण छवियों की मजबूत समझ है!',
    goodMsg: 'आपको अवधारणाओं की अच्छी समझ है। चुनौतीपूर्ण क्षेत्रों की समीक्षा करें।',
    practiceMsg: 'अवधारणाओं का अध्ययन करते रहें और फिर से प्रयास करें। अभ्यास से सिद्धि होती है!',
    tryAgain: 'पुनः प्रयास करें',
    backToLearn: 'सीखें में वापस जाएं',
    progress: 'प्रगति',
    objectDistance: 'वस्तु की दूरी',
    imageDistance: 'प्रतिबिम्ब की दूरी',
    units: 'इकाइयाँ',
    properties: 'गुण',
    matchWith: 'इससे मिलाएं',
    selectAnswer: 'उत्तर चुनें...',
    correctMatches: 'सही मिलान',
    sameSize: 'समान आकार',
    erect: 'सीधा',
    virtual: 'आभासी',
    lateralInversion: 'पार्श्व प्रतिलोम',
    imageSizeEquals: 'प्रतिबिम्ब का आकार वस्तु के आकार के बराबर है',
    imageUpright: 'प्रतिबिम्ब सीधा है',
    cannotProject: 'पर्दे पर प्रक्षेपित नहीं किया जा सकता',
    leftAppearsRight: 'बायां दायां दिखाई देता है'
  },
  gu: {
    title: 'પ્રેક્ટિસ મોડ',
    subtitle: 'સમતલ અરીસાની છબીઓની તમારી સમજણ ચકાસો',
    score: 'સ્કોર',
    question: 'પ્રશ્ન',
    of: 'નો',
    submit: 'જવાબ સબમિટ કરો',
    next: 'આગળનો પ્રશ્ન',
    previous: 'પાછળ',
    viewResults: 'પરિણામો જુઓ',
    correct: 'સાચું',
    incorrect: 'ખોટું',
    wrong: 'ખોટું',
    easy: 'સરળ',
    medium: 'મધ્યમ',
    hard: 'મુશ્કેલ',
    interactive: 'ઇન્ટરેક્ટિવ',
    quizComplete: 'ક્વિઝ પૂર્ણ!',
    performance: 'અહીં તમારું પ્રદર્શન છે',
    correctAnswers: 'સાચા જવાબો',
    totalQuestions: 'કુલ પ્રશ્નો',
    excellentWork: 'ઉત્તમ કાર્ય!',
    goodJob: 'સારું કામ!',
    keepPracticing: 'પ્રેક્ટિસ ચાલુ રાખો!',
    excellentMsg: 'તમને સમતલ અરીસાની છબીઓની મજબૂત સમજ છે!',
    goodMsg: 'તમને વિભાવનાઓની સારી સમજ છે. પડકારજનક વિસ્તારોની સમીક્ષા કરો।',
    practiceMsg: 'વિભાવનાઓનો અભ્યાસ ચાલુ રાખો અને ફરી પ્રયાસ કરો। પ્રેક્ટિસથી સિદ્ધિ મળે છે!',
    tryAgain: 'ફરી પ્રયાસ કરો',
    backToLearn: 'શીખો માં પાછા જાઓ',
    progress: 'પ્રગતિ',
    objectDistance: 'વસ્તુનું અંતર',
    imageDistance: 'પ્રતિબિંબનું અંતર',
    units: 'એકમો',
    properties: 'ગુણધર્મો',
    matchWith: 'આની સાથે મેળ કરો',
    selectAnswer: 'જવાબ પસંદ કરો...',
    correctMatches: 'સાચા મેળ',
    sameSize: 'સમાન માપ',
    erect: 'સીધું',
    virtual: 'આભાસી',
    lateralInversion: 'બાજુનું વિપરીત',
    imageSizeEquals: 'પ્રતિબિંબનું માપ વસ્તુના માપ જેટલું છે',
    imageUpright: 'પ્રતિબિંબ સીધું છે',
    cannotProject: 'પડદા પર પ્રક્ષેપિત કરી શકાતું નથી',
    leftAppearsRight: 'ડાબું જમણું દેખાય છે'
  }
};

// Learn Mode Translations
const learnTranslations = {
  en: {
    sections: {
      introduction: 'Introduction',
      sameSize: 'Same Size Property',
      erectImage: 'Erect Image',
      screenTest: 'Screen Test',
      distanceRelationship: 'Distance Relationship',
      lateralInversion: 'Lateral Inversion',
      realWorldApplication: 'Real-World Application'
    },
    introduction: {
      title: 'What is an Image in a Plane Mirror?',
      description: 'When you look into a plane mirror, what you see is a reflection of yourself or objects in front of the mirror. This reflection is called an image.',
      object: 'Object',
      objectDesc: 'The real pen (or any item) placed in front of the mirror',
      image: 'Image',
      imageDesc: 'The reflection that appears behind the mirror',
      mirror: 'MIRROR'
    },
    sameSize: {
      title: 'Property 1: Same Size',
      description: 'The image formed by a plane mirror is exactly the same size as the object. No magnification or reduction occurs!',
      small: 'Small',
      medium: 'Medium',
      large: 'Large',
      objectLabel: 'Object',
      objectSizeEquals: 'Object size = Image size',
      keyPoint: '✓ Key Point: Whether the object is small or large, the image is always the same size!'
    },
    erectImage: {
      title: 'Property 2: Erect (Upright) Image',
      description: 'The image formed by a plane mirror is erect, meaning it appears upright, not upside down. If the tip of a pen points up, the image\'s tip also points up!',
      penExample: 'Pen Example',
      treeExample: 'Tree Example',
      tipUp: '↑ TIP UP',
      upright: 'Upright',
      bothPointingUp: '✓ Both pointing upward!',
      imageNotInverted: '✓ Image not inverted!'
    },
    screenTest: {
      title: 'Property 3: Virtual Image (Cannot be Captured on Screen)',
      description: 'Unlike real images, the image formed by a plane mirror cannot be captured on a screen or piece of paper. This is called a virtual image.',
      tryIt: 'Try It Yourself!',
      instruction: 'Place a screen behind the mirror where the image appears. What happens?',
      result: 'Result: Nothing appears on the screen!',
      keyPoint: '✓ Key Point: Virtual images cannot be projected on a screen because they don\'t actually exist at that location - they only appear to be there!',
      object: 'Object',
      image: 'Image',
      screen: 'Screen',
      mirror: 'MIRROR'
    },
    distanceRelationship: {
      title: 'Property 4: Equal Distance',
      description: 'The distance from the object to the mirror equals the distance from the image to the mirror. They are always equal!',
      adjustDistance: 'Adjust the distance slider to see how the distances change:',
      objectDistance: 'Object Distance',
      imageDistance: 'Image Distance',
      keyPoint: '✓ Key Point: Object distance = Image distance, always!',
      object: 'Object',
      image: 'Image',
      mirror: 'MIRROR'
    },
    lateralInversion: {
      title: 'Property 5: Lateral Inversion (Left-Right Reversal)',
      description: 'The image in a plane mirror appears laterally inverted - left becomes right and right becomes left!',
      raiseYourHand: 'Raise Your Hand!',
      instruction: 'Raise your left hand in front of a mirror. Which hand does your image raise?',
      answer: 'Answer: The image raises its RIGHT hand!',
      touchYourEar: 'Touch Your Ear!',
      instruction2: 'Touch your left ear. Which ear does your image touch?',
      answer2: 'Answer: The image touches its RIGHT ear!',
      keyPoint: '✓ Key Point: Lateral inversion means left and right are swapped in the mirror image!',
      yourLeft: 'Your LEFT',
      imageRight: 'Image\'s RIGHT',
      yourRight: 'Your RIGHT',
      imageLeft: 'Image\'s LEFT'
    },
    realWorldApplication: {
      title: 'Real-World Application: Ambulance',
      description: 'Have you noticed that the word "AMBULANCE" is written backwards on ambulances? This uses the principle of lateral inversion!',
      why: 'Why?',
      explanation: 'When drivers see the ambulance in their rear-view mirror, the reversed text appears correctly due to lateral inversion!',
      seeIt: 'See it in action!',
      keyPoint: '✓ Key Point: This is a practical application of lateral inversion in plane mirrors!',
      normalView: 'Normal View',
      mirrorView: 'Mirror View'
    },
    next: 'Next',
    previous: 'Previous'
  },
  hi: {
    sections: {
      introduction: 'परिचय',
      sameSize: 'समान आकार गुण',
      erectImage: 'सीधी छवि',
      screenTest: 'स्क्रीन परीक्षण',
      distanceRelationship: 'दूरी संबंध',
      lateralInversion: 'पार्श्व प्रतिलोम',
      realWorldApplication: 'वास्तविक दुनिया का अनुप्रयोग'
    },
    introduction: {
      title: 'समतल दर्पण में छवि क्या है?',
      description: 'जब आप समतल दर्पण में देखते हैं, तो आप जो देखते हैं वह दर्पण के सामने आपकी या वस्तुओं की परावर्तन है। इस परावर्तन को छवि कहा जाता है।',
      object: 'वस्तु',
      objectDesc: 'दर्पण के सामने रखी वास्तविक कलम (या कोई वस्तु)',
      image: 'छवि',
      imageDesc: 'दर्पण के पीछे दिखाई देने वाला परावर्तन',
      mirror: 'दर्पण'
    },
    sameSize: {
      title: 'गुण 1: समान आकार',
      description: 'समतल दर्पण द्वारा बनाई गई छवि वस्तु के बिल्कुल समान आकार की होती है। कोई आवर्धन या कमी नहीं होती!',
      small: 'छोटा',
      medium: 'मध्यम',
      large: 'बड़ा',
      objectLabel: 'वस्तु',
      objectSizeEquals: 'वस्तु का आकार = छवि का आकार',
      keyPoint: '✓ मुख्य बिंदु: वस्तु छोटी हो या बड़ी, छवि हमेशा समान आकार की होती है!'
    },
    erectImage: {
      title: 'गुण 2: सीधी (ऊर्ध्वाधर) छवि',
      description: 'समतल दर्पण द्वारा बनाई गई छवि सीधी होती है, अर्थात यह ऊर्ध्वाधर दिखाई देती है, उल्टी नहीं। यदि कलम की नोक ऊपर की ओर है, तो छवि की नोक भी ऊपर की ओर है!',
      penExample: 'कलम उदाहरण',
      treeExample: 'पेड़ उदाहरण',
      tipUp: '↑ नोक ऊपर',
      upright: 'ऊर्ध्वाधर',
      bothPointingUp: '✓ दोनों ऊपर की ओर!',
      imageNotInverted: '✓ छवि उल्टी नहीं!'
    },
    screenTest: {
      title: 'गुण 3: आभासी छवि (स्क्रीन पर कैप्चर नहीं की जा सकती)',
      description: 'वास्तविक छवियों के विपरीत, समतल दर्पण द्वारा बनाई गई छवि को स्क्रीन या कागज पर कैप्चर नहीं किया जा सकता। इसे आभासी छवि कहा जाता है।',
      tryIt: 'इसे स्वयं आज़माएं!',
      instruction: 'दर्पण के पीछे जहाँ छवि दिखाई देती है, वहाँ एक स्क्रीन रखें। क्या होता है?',
      result: 'परिणाम: स्क्रीन पर कुछ भी दिखाई नहीं देता!',
      keyPoint: '✓ मुख्य बिंदु: आभासी छवियों को स्क्रीन पर प्रक्षेपित नहीं किया जा सकता क्योंकि वे वास्तव में उस स्थान पर मौजूद नहीं होतीं - वे केवल वहाँ दिखाई देती हैं!',
      object: 'वस्तु',
      image: 'छवि',
      screen: 'स्क्रीन',
      mirror: 'दर्पण'
    },
    distanceRelationship: {
      title: 'गुण 4: समान दूरी',
      description: 'वस्तु से दर्पण की दूरी, छवि से दर्पण की दूरी के बराबर होती है। वे हमेशा समान होती हैं!',
      adjustDistance: 'दूरियों में परिवर्तन देखने के लिए दूरी स्लाइडर समायोजित करें:',
      objectDistance: 'वस्तु की दूरी',
      imageDistance: 'छवि की दूरी',
      keyPoint: '✓ मुख्य बिंदु: वस्तु की दूरी = छवि की दूरी, हमेशा!',
      object: 'वस्तु',
      image: 'छवि',
      mirror: 'दर्पण'
    },
    lateralInversion: {
      title: 'गुण 5: पार्श्व प्रतिलोम (बाएं-दाएं उलटना)',
      description: 'समतल दर्पण में छवि पार्श्व रूप से उलटी दिखाई देती है - बाएं दाएं बन जाता है और दाएं बाएं बन जाता है!',
      raiseYourHand: 'अपना हाथ उठाएं!',
      instruction: 'दर्पण के सामने अपना बायां हाथ उठाएं। आपकी छवि कौन सा हाथ उठाती है?',
      answer: 'उत्तर: छवि अपना दायां हाथ उठाती है!',
      touchYourEar: 'अपने कान को छुएं!',
      instruction2: 'अपने बाएं कान को छुएं। आपकी छवि कौन सा कान छूती है?',
      answer2: 'उत्तर: छवि अपना दायां कान छूती है!',
      keyPoint: '✓ मुख्य बिंदु: पार्श्व प्रतिलोम का मतलब है कि दर्पण छवि में बाएं और दाएं अदला-बदली हो जाते हैं!',
      yourLeft: 'आपका बायां',
      imageRight: 'छवि का दायां',
      yourRight: 'आपका दायां',
      imageLeft: 'छवि का बायां'
    },
    realWorldApplication: {
      title: 'वास्तविक दुनिया का अनुप्रयोग: एम्बुलेंस',
      description: 'क्या आपने देखा है कि एम्बुलेंस पर "AMBULANCE" शब्द उल्टा लिखा होता है? यह पार्श्व प्रतिलोम के सिद्धांत का उपयोग करता है!',
      why: 'क्यों?',
      explanation: 'जब ड्राइवर अपने रियर-व्यू मिरर में एम्बुलेंस देखते हैं, तो उल्टा लिखा गया पाठ पार्श्व प्रतिलोम के कारण सही दिखाई देता है!',
      seeIt: 'इसे कार्रवाई में देखें!',
      keyPoint: '✓ मुख्य बिंदु: यह समतल दर्पण में पार्श्व प्रतिलोम का व्यावहारिक अनुप्रयोग है!',
      normalView: 'सामान्य दृश्य',
      mirrorView: 'दर्पण दृश्य'
    },
    next: 'अगला',
    previous: 'पिछला'
  },
  gu: {
    sections: {
      introduction: 'પરિચય',
      sameSize: 'સમાન માપ ગુણધર્મ',
      erectImage: 'સીધી છબી',
      screenTest: 'સ્ક્રીન પરીક્ષણ',
      distanceRelationship: 'અંતર સંબંધ',
      lateralInversion: 'બાજુનું વિપરીત',
      realWorldApplication: 'વાસ્તવિક વિશ્વનો ઉપયોગ'
    },
    introduction: {
      title: 'સમતલ અરીસામાં છબી શું છે?',
      description: 'જ્યારે તમે સમતલ અરીસામાં જુઓ છો, ત્યારે તમે જે જુઓ છો તે અરીસાની સામે તમારી અથવા વસ્તુઓનું પ્રતિબિંબ છે। આ પ્રતિબિંબને છબી કહેવામાં આવે છે।',
      object: 'વસ્તુ',
      objectDesc: 'અરીસાની સામે મૂકેલી વાસ્તવિક પેન (અથવા કોઈ વસ્તુ)',
      image: 'છબી',
      imageDesc: 'અરીસાની પાછળ દેખાતું પ્રતિબિંબ',
      mirror: 'અરીસો'
    },
    sameSize: {
      title: 'ગુણધર્મ 1: સમાન માપ',
      description: 'સમતલ અરીસા દ્વારા બનાવેલી છબી વસ્તુ જેટલી જ હોય છે। કોઈ વિસ્તરણ અથવા ઘટાડો થતો નથી!',
      small: 'નાનું',
      medium: 'મધ્યમ',
      large: 'મોટું',
      objectLabel: 'વસ્તુ',
      objectSizeEquals: 'વસ્તુનું માપ = છબીનું માપ',
      keyPoint: '✓ મુખ્ય મુદ્દો: વસ્તુ નાની હોય કે મોટી, છબી હંમેશાં સમાન માપની હોય છે!'
    },
    erectImage: {
      title: 'ગુણધર્મ 2: સીધી (ઊભી) છબી',
      description: 'સમતલ અરીસા દ્વારા બનાવેલી છબી સીધી હોય છે, એટલે કે તે ઊભી દેખાય છે, ઊલટી નહીં। જો પેનની નોક ઉપર તરફ હોય, તો છબીની નોક પણ ઉપર તરફ હોય છે!',
      penExample: 'પેન ઉદાહરણ',
      treeExample: 'ઝાડ ઉદાહરણ',
      tipUp: '↑ નોક ઉપર',
      upright: 'ઊભું',
      bothPointingUp: '✓ બંને ઉપર તરફ!',
      imageNotInverted: '✓ છબી ઊલટી નથી!'
    },
    screenTest: {
      title: 'ગુણધર્મ 3: આભાસી છબી (સ્ક્રીન પર કેપ્ચર કરી શકાતી નથી)',
      description: 'વાસ્તવિક છબીઓથી વિપરીત, સમતલ અરીસા દ્વારા બનાવેલી છબીને સ્ક્રીન અથવા કાગળ પર કેપ્ચર કરી શકાતી નથી। આને આભાસી છબી કહેવામાં આવે છે।',
      tryIt: 'તમારી જાતે પ્રયાસ કરો!',
      instruction: 'અરીસાની પાછળ જ્યાં છબી દેખાય છે ત્યાં એક સ્ક્રીન મૂકો। શું થાય છે?',
      result: 'પરિણામ: સ્ક્રીન પર કંઈ દેખાતું નથી!',
      keyPoint: '✓ મુખ્ય મુદ્દો: આભાસી છબીઓને સ્ક્રીન પર પ્રક્ષેપિત કરી શકાતી નથી કારણ કે તેઓ વાસ્તવમાં તે સ્થાને અસ્તિત્વમાં નથી - તેઓ માત્ર ત્યાં દેખાય છે!',
      object: 'વસ્તુ',
      image: 'છબી',
      screen: 'સ્ક્રીન',
      mirror: 'અરીસો'
    },
    distanceRelationship: {
      title: 'ગુણધર્મ 4: સમાન અંતર',
      description: 'વસ્તુથી અરીસાનું અંતર, છબીથી અરીસાનું અંતર જેટલું હોય છે। તેઓ હંમેશાં સમાન હોય છે!',
      adjustDistance: 'અંતરમાં ફેરફાર જોવા માટે અંતર સ્લાઇડર ગોઠવો:',
      objectDistance: 'વસ્તુનું અંતર',
      imageDistance: 'છબીનું અંતર',
      keyPoint: '✓ મુખ્ય મુદ્દો: વસ્તુનું અંતર = છબીનું અંતર, હંમેશાં!',
      object: 'વસ્તુ',
      image: 'છબી',
      mirror: 'અરીસો'
    },
    lateralInversion: {
      title: 'ગુણધર્મ 5: બાજુનું વિપરીત (ડાબું-જમણું ઊલટું)',
      description: 'સમતલ અરીસામાં છબી બાજુથી ઊલટી દેખાય છે - ડાબું જમણું બને છે અને જમણું ડાબું બને છે!',
      raiseYourHand: 'તમારો હાથ ઊંચો કરો!',
      instruction: 'અરીસાની સામે તમારો ડાબો હાથ ઊંચો કરો। તમારી છબી કયો હાથ ઊંચો કરે છે?',
      answer: 'જવાબ: છબી તેનો જમણો હાથ ઊંચો કરે છે!',
      touchYourEar: 'તમારા કાનને સ્પર્શ કરો!',
      instruction2: 'તમારા ડાબા કાનને સ્પર્શ કરો। તમારી છબી કયા કાનને સ્પર્શ કરે છે?',
      answer2: 'જવાબ: છબી તેના જમણા કાનને સ્પર્શ કરે છે!',
      keyPoint: '✓ મુખ્ય મુદ્દો: બાજુનું વિપરીત એટલે અરીસાની છબીમાં ડાબું અને જમણું અદલાબદલી થાય છે!',
      yourLeft: 'તમારું ડાબું',
      imageRight: 'છબીનું જમણું',
      yourRight: 'તમારું જમણું',
      imageLeft: 'છબીનું ડાબું'
    },
    realWorldApplication: {
      title: 'વાસ્તવિક વિશ્વનો ઉપયોગ: એમ્બ્યુલન્સ',
      description: 'શું તમે નોંધ્યું છે કે એમ્બ્યુલન્સ પર "AMBULANCE" શબ્દ ઊલટું લખેલું હોય છે? આ બાજુના વિપરીતના સિદ્ધાંતનો ઉપયોગ કરે છે!',
      why: 'શા માટે?',
      explanation: 'જ્યારે ડ્રાઇવરો તેમના રીઅર-વ્યુ મિરરમાં એમ્બ્યુલન્સ જુએ છે, ત્યારે ઊલટું લખાણ બાજુના વિપરીતને કારણે યોગ્ય દેખાય છે!',
      seeIt: 'તેને ક્રિયામાં જુઓ!',
      keyPoint: '✓ મુખ્ય મુદ્દો: આ સમતલ અરીસામાં બાજુના વિપરીતનો વ્યવહારિક ઉપયોગ છે!',
      normalView: 'સામાન્ય દૃશ્ય',
      mirrorView: 'અરીસાનું દૃશ્ય'
    },
    next: 'આગળ',
    previous: 'પાછળ'
  }
};

// Real World Mode Translations
const realWorldTranslations = {
  en: {
    title: 'Real World Applications',
    subtitle: 'Discover how plane mirrors are used in everyday life and technology',
    categories: {
      all: 'All',
      safety: 'Safety',
      technology: 'Technology',
      daily: 'Daily Life'
    },
    difficulty: {
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced'
    },
    scenarios: {
      ambulance: {
        title: 'Ambulance & Emergency Vehicles',
        description: 'Understanding why AMBULANCE is written backwards on emergency vehicles',
        why: 'Why?',
        explanation: 'When drivers see the ambulance in their rear-view mirror, the reversed text appears correctly due to lateral inversion!',
        seeIt: 'See it in action!',
        keyPoint: '✓ Key Point: This is a practical application of lateral inversion in plane mirrors!'
      },
      carMirror: {
        title: 'Car Rear-View Mirrors',
        description: 'How mirrors help drivers see behind them and check blind spots',
        howItWorks: 'How It Works',
        explanation: 'Rear-view mirrors use plane mirrors to reflect light from behind the car, allowing drivers to see what\'s behind without turning around.',
        blindSpot: 'Blind Spot',
        checkBlindSpot: 'Check Blind Spot',
        threeTypes: 'Three Types of Mirrors',
        rearView: 'Rear-View Mirror',
        rearViewDesc: 'Inside the car, shows vehicles directly behind',
        leftSide: 'Left Side Mirror',
        leftSideDesc: 'Shows left side and blind spot area',
        rightSide: 'Right Side Mirror',
        rightSideDesc: 'Shows right side and blind spot area',
        interactiveSim: 'Interactive Simulation',
        moveCar: 'Move the car behind'
      },
      periscope: {
        title: 'Periscope in Submarines',
        description: 'Using two plane mirrors to see above water from underwater',
        howItWorks: 'How It Works',
        explanation: 'A periscope uses two plane mirrors at 45° angles to redirect light, allowing submarine crews to see above water while remaining submerged.',
        adjustAngle: 'Adjust Periscope Angle',
        principle: 'Principle',
        principleDesc: 'Two mirrors at 45° angles redirect light from above to your eye below'
      },
      kaleidoscope: {
        title: 'Kaleidoscope',
        description: 'Creating beautiful symmetrical patterns using multiple reflections',
        howItWorks: 'How It Works',
        explanation: 'Kaleidoscopes use multiple mirrors arranged at angles to create symmetrical patterns from colored objects.',
        howCreates: 'How It Creates Patterns',
        rotate: 'Rotate',
        changePattern: 'Change Pattern'
      },
      dentistMirror: {
        title: 'Dentist\'s Mirror',
        description: 'How dentists use small mirrors to see inside your mouth',
        howItWorks: 'How It Works',
        explanation: 'Dentists use small plane mirrors to reflect light and see areas inside the mouth that are difficult to view directly.',
        whyDentists: 'Why Dentists Use Mirrors',
        selectSection: 'Select Tooth Section'
      },
      dressingMirror: {
        title: 'Dressing Mirrors',
        description: 'Full-length mirrors for checking appearance and outfit',
        howItWorks: 'How It Works',
        explanation: 'Full-length mirrors use large plane mirrors to provide a complete reflection of a person, helping with dressing and grooming.'
      },
      securityMirror: {
        title: 'Security Mirrors',
        description: 'Convex mirrors in stores and parking lots for wider field of view',
        howItWorks: 'How It Works',
        explanation: 'While these are convex mirrors (not plane), they demonstrate the importance of mirrors in security and surveillance applications.'
      },
      makeupMirror: {
        title: 'Makeup & Grooming Mirrors',
        description: 'Using mirrors for personal grooming and makeup application',
        howItWorks: 'How It Works',
        explanation: 'Makeup mirrors use plane mirrors to provide accurate reflections for precise grooming and makeup application.'
      },
      barberMirror: {
        title: 'Barber Shop Mirrors',
        description: 'Two mirrors showing front and back of your head simultaneously',
        howItWorks: 'How It Works',
        explanation: 'Barber shops use two mirrors - one in front and one behind - to show customers both the front and back of their haircut simultaneously.'
      },
      solarCooker: {
        title: 'Solar Cookers',
        description: 'Using reflective surfaces to concentrate sunlight for cooking',
        howItWorks: 'How It Works',
        explanation: 'Solar cookers use reflective surfaces (often curved, not plane) to concentrate sunlight and generate heat for cooking food.'
      }
    },
    back: 'Back to Applications'
  },
  hi: {
    title: 'वास्तविक दुनिया के अनुप्रयोग',
    subtitle: 'जानें कि समतल दर्पण का उपयोग रोजमर्रा की जिंदगी और प्रौद्योगिकी में कैसे किया जाता है',
    categories: {
      all: 'सभी',
      safety: 'सुरक्षा',
      technology: 'प्रौद्योगिकी',
      daily: 'दैनिक जीवन'
    },
    difficulty: {
      beginner: 'शुरुआती',
      intermediate: 'मध्यम',
      advanced: 'उन्नत'
    },
    scenarios: {
      ambulance: {
        title: 'एम्बुलेंस और आपातकालीन वाहन',
        description: 'समझना कि आपातकालीन वाहनों पर AMBULANCE क्यों उल्टा लिखा होता है',
        why: 'क्यों?',
        explanation: 'जब ड्राइवर अपने रियर-व्यू मिरर में एम्बुलेंस देखते हैं, तो उल्टा लिखा गया पाठ पार्श्व प्रतिलोम के कारण सही दिखाई देता है!',
        seeIt: 'इसे कार्रवाई में देखें!',
        keyPoint: '✓ मुख्य बिंदु: यह समतल दर्पण में पार्श्व प्रतिलोम का व्यावहारिक अनुप्रयोग है!'
      },
      carMirror: {
        title: 'कार रियर-व्यू मिरर',
        description: 'दर्पण ड्राइवरों को पीछे देखने और ब्लाइंड स्पॉट जांचने में कैसे मदद करते हैं',
        howItWorks: 'यह कैसे काम करता है',
        explanation: 'रियर-व्यू मिरर कार के पीछे से प्रकाश को प्रतिबिंबित करने के लिए समतल दर्पण का उपयोग करते हैं, जिससे ड्राइवर बिना मुड़े पीछे देख सकते हैं।',
        blindSpot: 'ब्लाइंड स्पॉट',
        checkBlindSpot: 'ब्लाइंड स्पॉट जांचें',
        threeTypes: 'तीन प्रकार के दर्पण',
        rearView: 'रियर-व्यू मिरर',
        rearViewDesc: 'कार के अंदर, सीधे पीछे वाहनों को दिखाता है',
        leftSide: 'बायां साइड मिरर',
        leftSideDesc: 'बायां पक्ष और ब्लाइंड स्पॉट क्षेत्र दिखाता है',
        rightSide: 'दायां साइड मिरर',
        rightSideDesc: 'दायां पक्ष और ब्लाइंड स्पॉट क्षेत्र दिखाता है',
        interactiveSim: 'इंटरैक्टिव सिमुलेशन',
        moveCar: 'कार को पीछे ले जाएं'
      },
      periscope: {
        title: 'पनडुब्बियों में पेरिस्कोप',
        description: 'पानी के नीचे से पानी के ऊपर देखने के लिए दो समतल दर्पण का उपयोग',
        howItWorks: 'यह कैसे काम करता है',
        explanation: 'एक पेरिस्कोप 45° कोण पर दो समतल दर्पण का उपयोग करता है ताकि प्रकाश को पुनर्निर्देशित किया जा सके, जिससे पनडुब्बी के चालक दल पानी के नीचे रहते हुए पानी के ऊपर देख सकें।',
        adjustAngle: 'पेरिस्कोप कोण समायोजित करें',
        principle: 'सिद्धांत',
        principleDesc: '45° कोण पर दो दर्पण ऊपर से प्रकाश को आपकी आंख तक नीचे पुनर्निर्देशित करते हैं'
      },
      kaleidoscope: {
        title: 'कैलेइडोस्कोप',
        description: 'कई प्रतिबिंबों का उपयोग करके सुंदर सममित पैटर्न बनाना',
        howItWorks: 'यह कैसे काम करता है',
        explanation: 'कैलेइडोस्कोप कोणों पर व्यवस्थित कई दर्पणों का उपयोग करते हैं ताकि रंगीन वस्तुओं से सममित पैटर्न बनाए जा सकें।',
        howCreates: 'यह पैटर्न कैसे बनाता है',
        rotate: 'घुमाएं',
        changePattern: 'पैटर्न बदलें'
      },
      dentistMirror: {
        title: 'दंत चिकित्सक का दर्पण',
        description: 'दंत चिकित्सक आपके मुंह के अंदर देखने के लिए छोटे दर्पण का उपयोग कैसे करते हैं',
        howItWorks: 'यह कैसे काम करता है',
        explanation: 'दंत चिकित्सक प्रकाश को प्रतिबिंबित करने और मुंह के अंदर के क्षेत्रों को देखने के लिए छोटे समतल दर्पण का उपयोग करते हैं जिन्हें सीधे देखना मुश्किल होता है।',
        whyDentists: 'दंत चिकित्सक दर्पण का उपयोग क्यों करते हैं',
        selectSection: 'दांत अनुभाग चुनें'
      },
      dressingMirror: {
        title: 'ड्रेसिंग मिरर',
        description: 'उपस्थिति और पोशाक जांचने के लिए पूर्ण-लंबाई वाले दर्पण',
        howItWorks: 'यह कैसे काम करता है',
        explanation: 'पूर्ण-लंबाई वाले दर्पण एक व्यक्ति के पूर्ण प्रतिबिंब प्रदान करने के लिए बड़े समतल दर्पण का उपयोग करते हैं, जो ड्रेसिंग और ग्रूमिंग में मदद करते हैं।'
      },
      securityMirror: {
        title: 'सुरक्षा दर्पण',
        description: 'व्यापक दृश्य क्षेत्र के लिए स्टोर और पार्किंग स्थलों में उत्तल दर्पण',
        howItWorks: 'यह कैसे काम करता है',
        explanation: 'हालांकि ये उत्तल दर्पण हैं (समतल नहीं), वे सुरक्षा और निगरानी अनुप्रयोगों में दर्पण के महत्व को प्रदर्शित करते हैं।'
      },
      makeupMirror: {
        title: 'मेकअप और ग्रूमिंग मिरर',
        description: 'व्यक्तिगत ग्रूमिंग और मेकअप लगाने के लिए दर्पण का उपयोग',
        howItWorks: 'यह कैसे काम करता है',
        explanation: 'मेकअप दर्पण सटीक ग्रूमिंग और मेकअप लगाने के लिए सटीक प्रतिबिंब प्रदान करने के लिए समतल दर्पण का उपयोग करते हैं।'
      },
      barberMirror: {
        title: 'नाई की दुकान के दर्पण',
        description: 'दो दर्पण जो आपके सिर के आगे और पीछे एक साथ दिखाते हैं',
        howItWorks: 'यह कैसे काम करता है',
        explanation: 'नाई की दुकानें दो दर्पणों का उपयोग करती हैं - एक सामने और एक पीछे - ग्राहकों को उनके बाल कटवाने के आगे और पीछे दोनों को एक साथ दिखाने के लिए।'
      },
      solarCooker: {
        title: 'सौर कुकर',
        description: 'खाना पकाने के लिए सूर्य के प्रकाश को केंद्रित करने के लिए प्रतिबिंबित सतहों का उपयोग',
        howItWorks: 'यह कैसे काम करता है',
        explanation: 'सौर कुकर खाना पकाने के लिए सूर्य के प्रकाश को केंद्रित करने और गर्मी उत्पन्न करने के लिए प्रतिबिंबित सतहों (अक्सर घुमावदार, समतल नहीं) का उपयोग करते हैं।'
      }
    },
    back: 'अनुप्रयोगों पर वापस जाएं'
  },
  gu: {
    title: 'વાસ્તવિક વિશ્વના ઉપયોગો',
    subtitle: 'જાણો કે સમતલ અરીસાનો ઉપયોગ રોજિંદા જીવન અને ટેકનોલોજીમાં કેવી રીતે થાય છે',
    categories: {
      all: 'બધા',
      safety: 'સુરક્ષા',
      technology: 'ટેકનોલોજી',
      daily: 'દૈનિક જીવન'
    },
    difficulty: {
      beginner: 'શરૂઆત',
      intermediate: 'મધ્યમ',
      advanced: 'અદ્યતન'
    },
    scenarios: {
      ambulance: {
        title: 'એમ્બ્યુલન્સ અને આપત્તિ વાહનો',
        description: 'સમજવું કે આપત્તિ વાહનો પર AMBULANCE શા માટે ઊલટું લખેલું હોય છે',
        why: 'શા માટે?',
        explanation: 'જ્યારે ડ્રાઇવરો તેમના રીઅર-વ્યુ મિરરમાં એમ્બ્યુલન્સ જુએ છે, ત્યારે ઊલટું લખાણ બાજુના વિપરીતને કારણે યોગ્ય દેખાય છે!',
        seeIt: 'તેને ક્રિયામાં જુઓ!',
        keyPoint: '✓ મુખ્ય મુદ્દો: આ સમતલ અરીસામાં બાજુના વિપરીતનો વ્યવહારિક ઉપયોગ છે!'
      },
      carMirror: {
        title: 'કાર રીઅર-વ્યુ મિરર',
        description: 'અરીસા ડ્રાઇવરોને પાછળ જોવામાં અને બ્લાઇન્ડ સ્પોટ તપાસવામાં કેવી રીતે મદદ કરે છે',
        howItWorks: 'તે કેવી રીતે કામ કરે છે',
        explanation: 'રીઅર-વ્યુ મિરર કારની પાછળથી પ્રકાશને પ્રતિબિંબિત કરવા માટે સમતલ અરીસાનો ઉપયોગ કરે છે, જે ડ્રાઇવરોને વળ્યા વગર પાછળ જોવાની મંજૂરી આપે છે।',
        blindSpot: 'બ્લાઇન્ડ સ્પોટ',
        checkBlindSpot: 'બ્લાઇન્ડ સ્પોટ તપાસો',
        threeTypes: 'ત્રણ પ્રકારના અરીસા',
        rearView: 'રીઅર-વ્યુ મિરર',
        rearViewDesc: 'કારની અંદર, સીધા પાછળ વાહનો બતાવે છે',
        leftSide: 'ડાબો સાઇડ મિરર',
        leftSideDesc: 'ડાબી બાજુ અને બ્લાઇન્ડ સ્પોટ વિસ્તાર બતાવે છે',
        rightSide: 'જમણો સાઇડ મિરર',
        rightSideDesc: 'જમણી બાજુ અને બ્લાઇન્ડ સ્પોટ વિસ્તાર બતાવે છે',
        interactiveSim: 'ઇન્ટરેક્ટિવ સિમ્યુલેશન',
        moveCar: 'કારને પાછળ ખસેડો'
      },
      periscope: {
        title: 'પનબડુબ્બીઓમાં પેરિસ્કોપ',
        description: 'પાણીની નીચેથી પાણીની ઉપર જોવા માટે બે સમતલ અરીસાનો ઉપયોગ',
        howItWorks: 'તે કેવી રીતે કામ કરે છે',
        explanation: 'એક પેરિસ્કોપ પ્રકાશને પુનઃનિર્દેશિત કરવા માટે 45° કોણ પર બે સમતલ અરીસાનો ઉપયોગ કરે છે, જે પનબડુબ્બીના ક્રૂને પાણીની નીચે રહેતા પાણીની ઉપર જોવાની મંજૂરી આપે છે।',
        adjustAngle: 'પેરિસ્કોપ કોણ ગોઠવો',
        principle: 'સિદ્ધાંત',
        principleDesc: '45° કોણ પર બે અરીસા ઉપરથી પ્રકાશને તમારી આંખ સુધી નીચે પુનઃનિર્દેશિત કરે છે'
      },
      kaleidoscope: {
        title: 'કેલિડોસ્કોપ',
        description: 'બહુવિધ પ્રતિબિંબોનો ઉપયોગ કરીને સુંદર સમમિત પેટર્ન બનાવવા',
        howItWorks: 'તે કેવી રીતે કામ કરે છે',
        explanation: 'કેલિડોસ્કોપ રંગીન વસ્તુઓમાંથી સમમિત પેટર્ન બનાવવા માટે કોણ પર વ્યવસ્થિત બહુવિધ અરીસાનો ઉપયોગ કરે છે।',
        howCreates: 'તે પેટર્ન કેવી રીતે બનાવે છે',
        rotate: 'ફેરવો',
        changePattern: 'પેટર્ન બદલો'
      },
      dentistMirror: {
        title: 'દંતચિકિત્સકનો અરીસો',
        description: 'દંતચિકિત્સકો તમારા મોંની અંદર જોવા માટે નાના અરીસાનો ઉપયોગ કેવી રીતે કરે છે',
        howItWorks: 'તે કેવી રીતે કામ કરે છે',
        explanation: 'દંતચિકિત્સકો પ્રકાશને પ્રતિબિંબિત કરવા અને મોંની અંદરના ક્ષેત્રોને જોવા માટે નાના સમતલ અરીસાનો ઉપયોગ કરે છે જેને સીધી રીતે જોવું મુશ્કેલ હોય છે।',
        whyDentists: 'દંતચિકિત્સકો અરીસાનો ઉપયોગ શા માટે કરે છે',
        selectSection: 'દાંત વિભાગ પસંદ કરો'
      },
      dressingMirror: {
        title: 'ડ્રેસિંગ મિરર',
        description: 'દેખાવ અને પોશાક તપાસવા માટે પૂર્ણ-લંબાઈના અરીસા',
        howItWorks: 'તે કેવી રીતે કામ કરે છે',
        explanation: 'પૂર્ણ-લંબાઈના અરીસા વ્યક્તિનું સંપૂર્ણ પ્રતિબિંબ પ્રદાન કરવા માટે મોટા સમતલ અરીસાનો ઉપયોગ કરે છે, જે ડ્રેસિંગ અને ગ્રૂમિંગમાં મદદ કરે છે।'
      },
      securityMirror: {
        title: 'સુરક્ષા અરીસા',
        description: 'વ્યાપક દૃશ્ય ક્ષેત્ર માટે સ્ટોર અને પાર્કિંગ સ્થળોમાં ઉત્તલ અરીસા',
        howItWorks: 'તે કેવી રીતે કામ કરે છે',
        explanation: 'જ્યારે આ ઉત્તલ અરીસા છે (સમતલ નથી), તેઓ સુરક્ષા અને નિરીક્ષણ ઉપયોગોમાં અરીસાના મહત્વને પ્રદર્શિત કરે છે।'
      },
      makeupMirror: {
        title: 'મેકઅપ અને ગ્રૂમિંગ મિરર',
        description: 'વ્યક્તિગત ગ્રૂમિંગ અને મેકઅપ લગાવવા માટે અરીસાનો ઉપયોગ',
        howItWorks: 'તે કેવી રીતે કામ કરે છે',
        explanation: 'મેકઅપ અરીસા સચોટ ગ્રૂમિંગ અને મેકઅપ લગાવવા માટે સચોટ પ્રતિબિંબ પ્રદાન કરવા માટે સમતલ અરીસાનો ઉપયોગ કરે છે।'
      },
      barberMirror: {
        title: 'નાઇની દુકાનના અરીસા',
        description: 'બે અરીસા જે તમારા માથાના આગળ અને પાછળ એક સાથે દર્શાવે છે',
        howItWorks: 'તે કેવી રીતે કામ કરે છે',
        explanation: 'નાઇની દુકાનો બે અરીસાનો ઉપયોગ કરે છે - એક આગળ અને એક પાછળ - ગ્રાહકોને તેમના વાળ કાપવાના આગળ અને પાછળ બંનેને એક સાથે દર્શાવવા માટે।'
      },
      solarCooker: {
        title: 'સૌર કુકર',
        description: 'ખાનું બનાવવા માટે સૂર્યપ્રકાશને કેન્દ્રિત કરવા માટે પ્રતિબિંબિત સપાટીઓનો ઉપયોગ',
        howItWorks: 'તે કેવી રીતે કામ કરે છે',
        explanation: 'સૌર કુકર ખાનું બનાવવા માટે સૂર્યપ્રકાશને કેન્દ્રિત કરવા અને ગરમી ઉત્પન્ન કરવા માટે પ્રતિબિંબિત સપાટીઓ (ઘણીવાર વળાંકવાળી, સમતલ નથી) નો ઉપયોગ કરે છે।'
      }
    },
    back: 'ઉપયોગો પર પાછા જાઓ'
  }
};

const PracticeMode: React.FC = () => {
  const { language } = useLanguage();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [completedQuestions, setCompletedQuestions] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);

  // Interactive question states
  const [mirrorDistance, setMirrorDistance] = useState(100);
  const [matchAnswers, setMatchAnswers] = useState<{ [key: number]: string }>({});

  const t = practiceTranslations[language];

  const questions: Question[] = [
    {
      id: 1,
      type: 'mcq',
      question: {
        en: 'Which of the following correctly describes an image formed by a plane mirror?',
        hi: 'निम्नलिखित में से कौन समतल दर्पण द्वारा बनने वाली छवि का सही वर्णन करता है?',
        gu: 'નીચેનામાંથી કયું સમતલ અરીસા દ્વારા બનતી છબીનું યોગ્ય વર્ણન કરે છે?'
      },
      options: [
        {
          en: 'Smaller than the object and inverted',
          hi: 'वस्तु से छोटा और उल्टा',
          gu: 'વસ્તુ કરતાં નાનું અને ઊલટું'
        },
        {
          en: 'Same size as the object and erect',
          hi: 'वस्तु के समान आकार और सीधा',
          gu: 'વસ્તુ જેટલું માપ અને સીધું'
        },
        {
          en: 'Larger than the object and erect',
          hi: 'वस्तु से बड़ा और सीधा',
          gu: 'વસ્તુ કરતાં મોટું અને સીધું'
        },
        {
          en: 'Same size as the object but inverted',
          hi: 'वस्तु के समान आकार लेकिन उल्टा',
          gu: 'વસ્તુ જેટલું માપ પરંતુ ઊલટું'
        }
      ],
      correctAnswer: 1,
      explanation: {
        en: 'A plane mirror forms an image that is the same size as the object and erect (upright), not upside down.',
        hi: 'समतल दर्पण एक ऐसी छवि बनाता है जो वस्तु के समान आकार की और सीधी (ऊपर की ओर) होती है, उल्टी नहीं।',
        gu: 'સમતલ અરીસો એક છબી બનાવે છે જે વસ્તુ જેટલી હોય છે અને સીધી (ઊભી) હોય છે, ઊલટી નહીં।'
      },
      difficulty: 'easy'
    },
    {
      id: 2,
      type: 'mcq',
      question: {
        en: 'If you stand 2 meters away from a plane mirror, how far will your image appear to be from the mirror?',
        hi: 'यदि आप समतल दर्पण से 2 मीटर दूर खड़े हैं, तो आपकी छवि दर्पण से कितनी दूर प्रतीत होगी?',
        gu: 'જો તમે સમતલ અરીસાથી 2 મીટર દૂર ઊભા છો, તો તમારી છબી અરીસાથી કેટલી દૂર દેખાશે?'
      },
      options: [
        { en: '1 meter', hi: '1 मीटर', gu: '1 મીટર' },
        { en: '2 meters', hi: '2 मीटर', gu: '2 મીટર' },
        { en: '4 meters', hi: '4 मीटर', gu: '4 મીટર' },
        { en: '0.5 meters', hi: '0.5 मीटर', gu: '0.5 મીટર' }
      ],
      correctAnswer: 1,
      explanation: {
        en: 'The image distance from the mirror equals the object distance from the mirror. If you are 2m from the mirror, your image is also 2m from the mirror.',
        hi: 'दर्पण से छवि की दूरी, दर्पण से वस्तु की दूरी के बराबर होती है। यदि आप दर्पण से 2 मीटर दूर हैं, तो आपकी छवि भी दर्पण से 2 मीटर दूर है।',
        gu: 'અરીસાથી છબીનું અંતર, અરીસાથી વસ્તુના અંતર જેટલું હોય છે। જો તમે અરીસાથી 2 મીટર દૂર છો, તો તમારી છબી પણ અરીસાથી 2 મીટર દૂર છે।'
      },
      difficulty: 'easy'
    },
    {
      id: 3,
      type: 'mcq',
      question: {
        en: 'Which of the following statements about images in a plane mirror is FALSE?',
        hi: 'समतल दर्पण में छवियों के बारे में निम्नलिखित में से कौन सा कथन गलत है?',
        gu: 'સમતલ અરીસામાં છબીઓ વિશે નીચેનામાંથી કયું નિવેદન ખોટું છે?'
      },
      options: [
        {
          en: 'The image can be obtained on a screen',
          hi: 'छवि को पर्दे पर प्राप्त किया जा सकता है',
          gu: 'છબી પડદા પર મેળવી શકાય છે'
        },
        {
          en: 'The image is laterally inverted',
          hi: 'छवि पार्श्व रूप से उलटी होती है',
          gu: 'છબી બાજુથી ઊલટી હોય છે'
        },
        {
          en: 'The image is the same size as the object',
          hi: 'छवि वस्तु के समान आकार की होती है',
          gu: 'છબી વસ્તુ જેટલી હોય છે'
        },
        {
          en: 'The image appears behind the mirror',
          hi: 'छवि दर्पण के पीछे दिखाई देती है',
          gu: 'છબી અરીસાની પાછળ દેખાય છે'
        }
      ],
      correctAnswer: 0,
      explanation: {
        en: 'Images formed by plane mirrors are virtual and cannot be obtained on a screen. All other statements are true.',
        hi: 'समतल दर्पण द्वारा बनाई गई छवियां आभासी होती हैं और पर्दे पर प्राप्त नहीं की जा सकतीं। अन्य सभी कथन सत्य हैं।',
        gu: 'સમતલ અરીસા દ્વારા બનાવેલી છબીઓ આભાસી હોય છે અને પડદા પર મેળવી શકાતી નથી। અન્ય બધા નિવેદનો સાચા છે।'
      },
      difficulty: 'medium'
    },
    {
      id: 4,
      type: 'mcq',
      question: {
        en: 'When you raise your left hand in front of a mirror, which hand does your image appear to raise?',
        hi: 'जब आप दर्पण के सामने अपना बायां हाथ उठाते हैं, तो आपकी छवि कौन सा हाथ उठाती हुई दिखाई देती है?',
        gu: 'જ્યારે તમે અરીસાની સામે તમારો ડાબો હાથ ઊંચો કરો છો, ત્યારે તમારી છબી કયો હાથ ઊંચો કરતી દેખાય છે?'
      },
      options: [
        { en: 'Left hand', hi: 'बायां हाथ', gu: 'ડાબો હાથ' },
        { en: 'Right hand', hi: 'दायां हाथ', gu: 'જમણો હાથ' },
        { en: 'Both hands', hi: 'दोनों हाथ', gu: 'બંને હાથ' },
        { en: 'No hand moves', hi: 'कोई हाथ नहीं हिलता', gu: 'કોઈ હાથ હલતો નથી' }
      ],
      correctAnswer: 1,
      explanation: {
        en: 'Due to lateral inversion, when you raise your left hand, the image appears to raise its right hand.',
        hi: 'पार्श्व प्रतिलोम के कारण, जब आप अपना बायां हाथ उठाते हैं, तो छवि अपना दायां हाथ उठाती हुई प्रतीत होती है।',
        gu: 'બાજુના વિપરીત થવાને કારણે, જ્યારે તમે તમારો ડાબો હાથ ઊંચો કરો છો, ત્યારે છબી તેનો જમણો હાથ ઊંચો કરતી દેખાય છે।'
      },
      difficulty: 'easy'
    },
    {
      id: 5,
      type: 'mcq',
      question: {
        en: 'Why is "AMBULANCE" written in reverse on the front of an ambulance?',
        hi: 'एम्बुलेंस के सामने "AMBULANCE" क्यों उल्टा लिखा होता है?',
        gu: 'એમ્બ્યુલન્સની આગળ "AMBULANCE" શા માટે ઊલટું લખેલું હોય છે?'
      },
      options: [
        {
          en: 'It is a design choice',
          hi: 'यह एक डिजाइन विकल्प है',
          gu: 'તે ડિઝાઇન પસંદગી છે'
        },
        {
          en: 'To confuse other drivers',
          hi: 'अन्य ड्राइवरों को भ्रमित करने के लिए',
          gu: 'અન્ય ડ્રાઇવરોને ગૂંચવવા માટે'
        },
        {
          en: 'So it reads correctly in rear-view mirrors due to lateral inversion',
          hi: 'ताकि पार्श्व प्रतिलोम के कारण यह रियर-व्यू मिरर में सही तरीके से पढ़ा जाए',
          gu: 'જેથી બાજુના વિપરીત થવાને કારણે તે રીઅર-વ્યુ મિરરમાં યોગ્ય રીતે વાંચી શકાય'
        },
        {
          en: 'To make it look unique',
          hi: 'इसे अनोखा दिखाने के लिए',
          gu: 'તેને અનોખું દેખાડવા માટે'
        }
      ],
      correctAnswer: 2,
      explanation: {
        en: 'The reversed text on ambulances uses lateral inversion so that drivers ahead can read "AMBULANCE" correctly in their rear-view mirrors.',
        hi: 'एम्बुलेंस पर उल्टा पाठ पार्श्व प्रतिलोम का उपयोग करता है ताकि आगे के ड्राइवर अपने रियर-व्यू मिरर में "AMBULANCE" को सही ढंग से पढ़ सकें।',
        gu: 'એમ્બ્યુલન્સ પર ઊલટું લખાણ બાજુના વિપરીતનો ઉપયોગ કરે છે જેથી આગળના ડ્રાઇવરો તેમના રીઅર-વ્યુ મિરરમાં "AMBULANCE" યોગ્ય રીતે વાંચી શકે।'
      },
      difficulty: 'medium'
    },
    {
      id: 6,
      type: 'mcq',
      question: {
        en: 'A virtual image is one that:',
        hi: 'आभासी छवि वह होती है जो:',
        gu: 'આભાસી છબી તે છે જે:'
      },
      options: [
        {
          en: 'Can be projected onto a screen',
          hi: 'पर्दे पर प्रक्षेपित की जा सकती है',
          gu: 'પડદા પર પ્રક્ષેપિત કરી શકાય છે'
        },
        {
          en: 'Cannot be projected onto a screen',
          hi: 'पर्दे पर प्रक्षेपित नहीं की जा सकती',
          gu: 'પડદા પર પ્રક્ષેપિત કરી શકાતી નથી'
        },
        {
          en: 'Is always upside down',
          hi: 'हमेशा उल्टी होती है',
          gu: 'હંમેશાં ઊલટી હોય છે'
        },
        {
          en: 'Is always smaller than the object',
          hi: 'हमेशा वस्तु से छोटी होती है',
          gu: 'હંમેશાં વસ્તુ કરતાં નાની હોય છે'
        }
      ],
      correctAnswer: 1,
      explanation: {
        en: 'A virtual image cannot be projected onto a screen. Plane mirrors form virtual images.',
        hi: 'आभासी छवि को पर्दे पर प्रक्षेपित नहीं किया जा सकता। समतल दर्पण आभासी छवियां बनाते हैं।',
        gu: 'આભાસી છબી પડદા પર પ્રક્ષેપિત કરી શકાતી નથી। સમતલ અરીસા આભાસી છબીઓ બનાવે છે।'
      },
      difficulty: 'medium'
    },
    {
      id: 7,
      type: 'mcq',
      question: {
        en: 'If an object is 5 cm tall, how tall will its image be in a plane mirror?',
        hi: 'यदि कोई वस्तु 5 सेमी लंबी है, तो समतल दर्पण में इसकी छवि कितनी लंबी होगी?',
        gu: 'જો કોઈ વસ્તુ 5 સેમી ઊંચી છે, તો સમતલ અરીસામાં તેની છબી કેટલી ઊંચી હશે?'
      },
      options: [
        { en: '2.5 cm', hi: '2.5 सेमी', gu: '2.5 સેમી' },
        { en: '5 cm', hi: '5 सेमी', gu: '5 સેમી' },
        { en: '10 cm', hi: '10 सेमी', gu: '10 સેમી' },
        { en: '7.5 cm', hi: '7.5 सेमी', gu: '7.5 સેમી' }
      ],
      correctAnswer: 1,
      explanation: {
        en: 'The image in a plane mirror is always the same size as the object. A 5 cm tall object forms a 5 cm tall image.',
        hi: 'समतल दर्पण में छवि हमेशा वस्तु के समान आकार की होती है। 5 सेमी लंबी वस्तु 5 सेमी लंबी छवि बनाती है।',
        gu: 'સમતલ અરીસામાં છબી હંમેશાં વસ્તુ જેટલી હોય છે। 5 સેમી ઊંચી વસ્તુ 5 સેમી ઊંચી છબી બનાવે છે।'
      },
      difficulty: 'easy'
    },
    {
      id: 8,
      type: 'interactive',
      question: {
        en: 'Adjust the slider to show the correct image distance when the object is 150 units from the mirror. The image distance should equal the object distance.',
        hi: 'जब वस्तु दर्पण से 150 इकाई दूर हो तो सही छवि दूरी दिखाने के लिए स्लाइडर समायोजित करें। छवि की दूरी वस्तु की दूरी के बराबर होनी चाहिए।',
        gu: 'જ્યારે વસ્તુ અરીસાથી 150 એકમ દૂર હોય ત્યારે યોગ્ય છબી અંતર બતાવવા માટે સ્લાઇડર ગોઠવો। છબીનું અંતર વસ્તુના અંતર જેટલું હોવું જોઈએ।'
      },
      correctAnswer: 150,
      explanation: {
        en: 'The image distance from a plane mirror always equals the object distance from the mirror.',
        hi: 'समतल दर्पण से छवि की दूरी हमेशा दर्पण से वस्तु की दूरी के बराबर होती है।',
        gu: 'સમતલ અરીસાથી છબીનું અંતર હંમેશાં અરીસાથી વસ્તુના અંતર જેટલું હોય છે।'
      },
      difficulty: 'medium'
    },
    {
      id: 9,
      type: 'match',
      question: {
        en: 'Match the properties with their correct descriptions:',
        hi: 'गुणों को उनके सही विवरण से मिलाएं:',
        gu: 'ગુણધર્મોને તેમના યોગ્ય વર્ણન સાથે મેળવો:'
      },
      options: [
        { en: 'Same Size', hi: 'समान आकार', gu: 'સમાન માપ' },
        { en: 'Erect', hi: 'सीधा', gu: 'સીધું' },
        { en: 'Virtual', hi: 'आभासी', gu: 'આભાસી' },
        { en: 'Lateral Inversion', hi: 'पार्श्व प्रतिलोम', gu: 'બાજુનું વિપરીત' }
      ],
      correctAnswer: ['0-1', '1-2', '2-3', '3-0'],
      explanation: {
        en: 'Each property has a specific meaning: Same Size (image = object size), Erect (upright), Virtual (cannot be on screen), Lateral Inversion (left-right reversal).',
        hi: 'प्रत्येक गुण का एक विशिष्ट अर्थ है: समान आकार (छवि = वस्तु का आकार), सीधा (ऊपर की ओर), आभासी (पर्दे पर नहीं हो सकता), पार्श्व प्रतिलोम (बाएं-दाएं उलटना)।',
        gu: 'દરેક ગુણધર્મનો વિશિષ્ટ અર્થ છે: સમાન માપ (છબી = વસ્તુનું માપ), સીધું (ઊભું), આભાસી (પડદા પર ન હોઈ શકે), બાજુનું વિપરીત (ડાબું-જમણું ઊલટું)।'
      },
      difficulty: 'hard'
    }
  ];

  const matchingAnswers = [
    { en: 'Left appears as right', hi: 'बायां दायां दिखाई देता है', gu: 'ડાબું જમણું દેખાય છે' },
    { en: 'Image size equals object size', hi: 'छवि का आकार वस्तु के आकार के बराबर है', gu: 'છબીનું માપ વસ્તુના માપ જેટલું છે' },
    { en: 'Image is upright', hi: 'छवि सीधी है', gu: 'છબી સીધી છે' },
    { en: 'Cannot be projected on screen', hi: 'पर्दे पर प्रक्षेपित नहीं किया जा सकता', gu: 'પડદા પર પ્રક્ષેપિત કરી શકાતું નથી' }
  ];

  useEffect(() => {
    if (currentQuestion === 7) {
      setMirrorDistance(100);
    }
  }, [currentQuestion]);

  const handleAnswerSelect = (answer: any) => {
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null && questions[currentQuestion].type !== 'interactive') return;

    const currentQ = questions[currentQuestion];
    let isCorrect = false;

    if (currentQ.type === 'mcq') {
      isCorrect = selectedAnswer === currentQ.correctAnswer;
    } else if (currentQ.type === 'interactive') {
      isCorrect = Math.abs(mirrorDistance - (currentQ.correctAnswer as number)) < 10;
    } else if (currentQ.type === 'match') {
      const correctMatches = currentQ.correctAnswer as string[];
      const userMatches = Object.entries(matchAnswers).map(([key, value]) => {
        const answerIndex = matchingAnswers.findIndex(a => a[language] === value);
        return `${key}-${answerIndex}`;
      });
      isCorrect = correctMatches.every(match => userMatches.includes(match));
    }

    if (isCorrect && !completedQuestions.includes(currentQuestion)) {
      setScore(score + 1);
      setCompletedQuestions([...completedQuestions, currentQuestion]);
    }

    setUserAnswers([...userAnswers, { question: currentQuestion, answer: selectedAnswer, correct: isCorrect }]);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setMatchAnswers({});
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setMatchAnswers({});
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setCompletedQuestions([]);
    setShowResults(false);
    setUserAnswers([]);
    setMatchAnswers({});
  };

  const renderQuestion = () => {
    const q = questions[currentQuestion];

    if (q.type === 'mcq') {
      return (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                {currentQuestion + 1}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{q.question[language]}</h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className={`px-3 py-1 rounded-full ${
                    q.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                    q.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {t[q.difficulty]}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {q.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showFeedback}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                  selectedAnswer === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                } ${
                  showFeedback && index === q.correctAnswer
                    ? 'border-green-500 bg-green-50'
                    : ''
                } ${
                  showFeedback && selectedAnswer === index && index !== q.correctAnswer
                    ? 'border-red-500 bg-red-50'
                    : ''
                } disabled:cursor-not-allowed`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswer === index ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                  }`}>
                    {selectedAnswer === index && (
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="font-medium text-gray-700">{option[language]}</span>
                  {showFeedback && index === q.correctAnswer && (
                    <span className="ml-auto text-green-600 font-bold">✓ {t.correct}</span>
                  )}
                  {showFeedback && selectedAnswer === index && index !== q.correctAnswer && (
                    <span className="ml-auto text-red-600 font-bold">✗ {t.wrong}</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (q.type === 'interactive') {
      return (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                {currentQuestion + 1}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{q.question[language]}</h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">
                    {t.interactive}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="font-bold text-gray-700">{t.objectDistance}: 150 {t.units}</label>
                <label className="font-bold text-gray-700">{t.imageDistance}: {mirrorDistance} {t.units}</label>
              </div>
              <input
                type="range"
                min="50"
                max="200"
                value={mirrorDistance}
                onChange={(e) => setMirrorDistance(Number(e.target.value))}
                disabled={showFeedback}
                className="w-full h-3 bg-purple-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="relative h-64 bg-gradient-to-b from-sky-50 to-sky-100 rounded-lg">
              <div className="absolute left-1/2 top-0 bottom-0 w-2 bg-gradient-to-r from-gray-400 via-gray-600 to-gray-400 transform -translate-x-1/2"></div>
              <div className="absolute left-1/2 top-4 -translate-x-1/2 text-xs font-bold text-gray-600">
                {language === 'en' ? 'MIRROR' : language === 'hi' ? 'दर्पण' : 'અરીસો'}
              </div>

              <div className="absolute top-1/2 -translate-y-1/2" style={{ left: `calc(50% - 150px)` }}>
                <div className="text-5xl">👤</div>
                <div className="text-xs font-bold text-center text-teal-700">
                  {language === 'en' ? 'Object' : language === 'hi' ? 'वस्तु' : 'વસ્તુ'}
                </div>
                <div className="text-xs text-center text-gray-600">150 {t.units}</div>
              </div>

              <div className="absolute top-1/2 -translate-y-1/2 opacity-60" style={{ left: `calc(50% + ${mirrorDistance}px)` }}>
                <div className="text-5xl">👤</div>
                <div className="text-xs font-bold text-center text-blue-700">
                  {language === 'en' ? 'Image' : language === 'hi' ? 'प्रतिबिम्ब' : 'પ્રતિબિંબ'}
                </div>
                <div className="text-xs text-center text-gray-600">{mirrorDistance} {t.units}</div>
              </div>
            </div>

            {showFeedback && (
              <div className={`mt-4 p-4 rounded-lg ${
                Math.abs(mirrorDistance - 150) < 10 ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'
              }`}>
                <p className={`font-bold ${Math.abs(mirrorDistance - 150) < 10 ? 'text-green-700' : 'text-red-700'}`}>
                  {Math.abs(mirrorDistance - 150) < 10 ? `✓ ${t.correct}!` : `✗ ${t.incorrect}`}
                </p>
                <p className="text-gray-700 mt-2">{q.explanation[language]}</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (q.type === 'match') {
      return (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                {currentQuestion + 1}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{q.question[language]}</h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-3 py-1 rounded-full bg-red-100 text-red-700">{t.hard}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-bold text-gray-700 mb-4">{t.properties}:</h4>
              {q.options?.map((option, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow border-2 border-teal-200">
                  <p className="font-semibold text-gray-800">{option[language]}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-gray-700 mb-4">{t.matchWith}:</h4>
              {q.options?.map((_option, index) => (
                <select
                  key={index}
                  value={matchAnswers[index] || ''}
                  onChange={(e) => setMatchAnswers({ ...matchAnswers, [index]: e.target.value })}
                  disabled={showFeedback}
                  className="w-full p-4 rounded-lg border-2 border-gray-200 bg-white font-medium text-gray-700 disabled:bg-gray-100"
                >
                  <option value="">{t.selectAnswer}</option>
                  {matchingAnswers.map((answer, idx) => (
                    <option key={idx} value={answer[language]}>{answer[language]}</option>
                  ))}
                </select>
              ))}
            </div>
          </div>

          {showFeedback && (
            <div className="bg-blue-50 border-2 border-blue-500 p-4 rounded-lg">
              <p className="font-bold text-blue-700 mb-2">{t.correctMatches}:</p>
              <ul className="space-y-1 text-gray-700">
                <li>• {t.sameSize} → {t.imageSizeEquals}</li>
                <li>• {t.erect} → {t.imageUpright}</li>
                <li>• {t.virtual} → {t.cannotProject}</li>
                <li>• {t.lateralInversion} → {t.leftAppearsRight}</li>
              </ul>
            </div>
          )}
        </div>
      );
    }
  };

  if (showResults) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">
                {percentage >= 80 ? '🏆' : percentage >= 60 ? '🎉' : '📚'}
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{t.quizComplete}</h2>
              <p className="text-gray-600">{t.performance}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl text-center">
                <div className="text-4xl font-bold text-blue-600">{score}</div>
                <div className="text-gray-600 font-semibold mt-2">{t.correctAnswers}</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl text-center">
                <div className="text-4xl font-bold text-purple-600">{questions.length}</div>
                <div className="text-gray-600 font-semibold mt-2">{t.totalQuestions}</div>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-xl text-center">
                <div className="text-4xl font-bold text-pink-600">{percentage}%</div>
                <div className="text-gray-600 font-semibold mt-2">{t.score}</div>
              </div>
            </div>

            <div className="mb-8">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div className="text-xs font-semibold inline-block text-blue-600">
                    {t.progress}
                  </div>
                </div>
                <div className="overflow-hidden h-4 text-xs flex rounded-full bg-gray-200">
                  <div
                    style={{ width: `${percentage}%` }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${
                      percentage >= 80 ? 'bg-green-500' : percentage >= 60 ? 'bg-blue-500' : 'bg-orange-500'
                    }`}
                  ></div>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-xl mb-8 ${
              percentage >= 80 ? 'bg-green-50 border-2 border-green-500' :
              percentage >= 60 ? 'bg-blue-50 border-2 border-blue-500' :
              'bg-orange-50 border-2 border-orange-500'
            }`}>
              <p className={`font-bold text-lg ${
                percentage >= 80 ? 'text-green-700' :
                percentage >= 60 ? 'text-blue-700' :
                'text-orange-700'
              }`}>
                {percentage >= 80 ? `🌟 ${t.excellentWork}` :
                 percentage >= 60 ? `👍 ${t.goodJob}` :
                 `💪 ${t.keepPracticing}`}
              </p>
              <p className="text-gray-700 mt-2">
                {percentage >= 80 ? t.excellentMsg :
                 percentage >= 60 ? t.goodMsg :
                 t.practiceMsg}
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={resetQuiz}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg font-semibold hover:from-teal-600 hover:to-blue-600 transition-all"
              >
                {t.tryAgain}
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
              >
                {t.backToLearn}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          {renderQuestion()}

          {showFeedback && questions[currentQuestion].type === 'mcq' && (
            <div className={`mt-6 p-6 rounded-xl ${
              selectedAnswer === questions[currentQuestion].correctAnswer
                ? 'bg-green-50 border-2 border-green-500'
                : 'bg-red-50 border-2 border-red-500'
            }`}>
              <p className={`font-bold text-lg mb-2 ${
                selectedAnswer === questions[currentQuestion].correctAnswer
                  ? 'text-green-700'
                  : 'text-red-700'
              }`}>
                {selectedAnswer === questions[currentQuestion].correctAnswer
                  ? `✓ ${t.correct}!`
                  : `✗ ${t.incorrect}`}
              </p>
              <p className="text-gray-700">{questions[currentQuestion].explanation[language]}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← {t.previous}
          </button>

          {!showFeedback ? (
            <button
              onClick={handleSubmit}
              disabled={selectedAnswer === null && questions[currentQuestion].type === 'mcq'}
              className="px-8 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg font-semibold hover:from-teal-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t.submit}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all"
            >
              {currentQuestion === questions.length - 1 ? t.viewResults : t.next} →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Real World Applications Component
const RealWorldMode: React.FC = () => {
  const { language } = useLanguage();
  const [selectedScenario, setSelectedScenario] = useState<number | null>(null);
  // State for tracking category filtering removed as filters were removed
  
  // Periscope simulation states
  const [periscopeAngle, setPeriscopeAngle] = useState(0);
  
  // Kaleidoscope states
  const [kaleidoscopeRotation, setKaleidoscopeRotation] = useState(0);
  const [kaleidoscopePattern, setKaleidoscopePattern] = useState(0);
  
  // Dentist mirror states
  const [toothSection, setToothSection] = useState(0);
  
  // Car mirror states
  const [carPosition, setCarPosition] = useState(50);
  const [showBlindSpot, setShowBlindSpot] = useState(false);

  const t = realWorldTranslations[language];

  interface RealWorldScenario {
    id: number;
    title: { en: string; hi: string; gu: string };
    description: { en: string; hi: string; gu: string };
    icon: string;
    category: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
  }

  const scenarios: RealWorldScenario[] = [
    {
      id: 1,
      title: {
        en: 'Ambulance & Emergency Vehicles',
        hi: 'एम्बुलेंस और आपातकालीन वाहन',
        gu: 'એમ્બ્યુલન્સ અને આપત્તિ વાહનો'
      },
      description: {
        en: 'Understanding why AMBULANCE is written backwards on emergency vehicles',
        hi: 'समझना कि आपातकालीन वाहनों पर AMBULANCE क्यों उल्टा लिखा होता है',
        gu: 'સમજવું કે આપત્તિ વાહનો પર AMBULANCE શા માટે ઊલટું લખેલું હોય છે'
      },
      icon: '🚑',
      category: 'safety',
      difficulty: 'beginner'
    },
    {
      id: 2,
      title: {
        en: 'Car Rear-View Mirrors',
        hi: 'कार रियर-व्यू मिरर',
        gu: 'કાર રીઅર-વ્યુ મિરર'
      },
      description: {
        en: 'How mirrors help drivers see behind them and check blind spots',
        hi: 'दर्पण ड्राइवरों को पीछे देखने और ब्लाइंड स्पॉट जांचने में कैसे मदद करते हैं',
        gu: 'અરીસા ડ્રાઇવરોને પાછળ જોવામાં અને બ્લાઇન્ડ સ્પોટ તપાસવામાં કેવી રીતે મદદ કરે છે'
      },
      icon: '🚗',
      category: 'safety',
      difficulty: 'beginner'
    },
    {
      id: 3,
      title: {
        en: 'Periscope in Submarines',
        hi: 'पनडुब्बियों में पेरिस्कोप',
        gu: 'પનબડુબ્બીઓમાં પેરિસ્કોપ'
      },
      description: {
        en: 'Using two plane mirrors to see above water from underwater',
        hi: 'पानी के नीचे से पानी के ऊपर देखने के लिए दो समतल दर्पण का उपयोग',
        gu: 'પાણીની નીચેથી પાણીની ઉપર જોવા માટે બે સમતલ અરીસાનો ઉપયોગ'
      },
      icon: '🔭',
      category: 'technology',
      difficulty: 'intermediate'
    },
    {
      id: 4,
      title: {
        en: 'Kaleidoscope',
        hi: 'कैलेइडोस्कोप',
        gu: 'કેલિડોસ્કોપ'
      },
      description: {
        en: 'Creating beautiful symmetrical patterns using multiple reflections',
        hi: 'कई प्रतिबिंबों का उपयोग करके सुंदर सममित पैटर्न बनाना',
        gu: 'બહુવિધ પ્રતિબિંબોનો ઉપયોગ કરીને સુંદર સમમિત પેટર્ન બનાવવા'
      },
      icon: '🎨',
      category: 'daily',
      difficulty: 'intermediate'
    },
    {
      id: 5,
      title: {
        en: 'Dentist\'s Mirror',
        hi: 'दंत चिकित्सक का दर्पण',
        gu: 'દંતચિકિત્સકનો અરીસો'
      },
      description: {
        en: 'How dentists use small mirrors to see inside your mouth',
        hi: 'दंत चिकित्सक आपके मुंह के अंदर देखने के लिए छोटे दर्पण का उपयोग कैसे करते हैं',
        gu: 'દંતચિકિત્સકો તમારા મોંની અંદર જોવા માટે નાના અરીસાનો ઉપયોગ કેવી રીતે કરે છે'
      },
      icon: '🦷',
      category: 'technology',
      difficulty: 'beginner'
    },
    {
      id: 6,
      title: {
        en: 'Dressing Mirrors',
        hi: 'ड्रेसिंग मिरर',
        gu: 'ડ્રેસિંગ મિરર'
      },
      description: {
        en: 'Full-length mirrors for checking appearance and outfit',
        hi: 'उपस्थिति और पोशाक जांचने के लिए पूर्ण-लंबाई वाले दर्पण',
        gu: 'દેખાવ અને પોશાક તપાસવા માટે પૂર્ણ-લંબાઈના અરીસા'
      },
      icon: '👔',
      category: 'daily',
      difficulty: 'beginner'
    },
    {
      id: 7,
      title: {
        en: 'Security Mirrors',
        hi: 'सुरक्षा दर्पण',
        gu: 'સુરક્ષા અરીસા'
      },
      description: {
        en: 'Convex mirrors in stores and parking lots for wider field of view',
        hi: 'व्यापक दृश्य क्षेत्र के लिए स्टोर और पार्किंग स्थलों में उत्तल दर्पण',
        gu: 'વ્યાપક દૃશ્ય ક્ષેત્ર માટે સ્ટોર અને પાર્કિંગ સ્થળોમાં ઉત્તલ અરીસા'
      },
      icon: '🏪',
      category: 'safety',
      difficulty: 'intermediate'
    },
    {
      id: 8,
      title: {
        en: 'Makeup & Grooming Mirrors',
        hi: 'मेकअप और ग्रूमिंग मिरर',
        gu: 'મેકઅપ અને ગ્રૂમિંગ મિરર'
      },
      description: {
        en: 'Using mirrors for personal grooming and makeup application',
        hi: 'व्यक्तिगत ग्रूमिंग और मेकअप लगाने के लिए दर्पण का उपयोग',
        gu: 'વ્યક્તિગત ગ્રૂમિંગ અને મેકઅપ લગાવવા માટે અરીસાનો ઉપયોગ'
      },
      icon: '💄',
      category: 'daily',
      difficulty: 'beginner'
    },
    {
      id: 9,
      title: {
        en: 'Barber Shop Mirrors',
        hi: 'नाई की दुकान के दर्पण',
        gu: 'નાઇની દુકાનના અરીસા'
      },
      description: {
        en: 'Two mirrors showing front and back of your head simultaneously',
        hi: 'दो दर्पण जो आपके सिर के आगे और पीछे एक साथ दिखाते हैं',
        gu: 'બે અરીસા જે તમારા માથાના આગળ અને પાછળ એક સાથે દર્શાવે છે'
      },
      icon: '💇',
      category: 'daily',
      difficulty: 'intermediate'
    },
    {
      id: 10,
      title: {
        en: 'Solar Cookers',
        hi: 'सौर कुकर',
        gu: 'સૌર કુકર'
      },
      description: {
        en: 'Using reflective surfaces to concentrate sunlight for cooking',
        hi: 'खाना पकाने के लिए सूर्य के प्रकाश को केंद्रित करने के लिए प्रतिबिंबित सतहों का उपयोग',
        gu: 'ખાનું બનાવવા માટે સૂર્યપ્રકાશને કેન્દ્રિત કરવા માટે પ્રતિબિંબિત સપાટીઓનો ઉપયોગ'
      },
      icon: '☀️',
      category: 'technology',
      difficulty: 'advanced'
    }
  ];

  const filteredScenarios = scenarios;

  const renderScenarioDetail = () => {
    if (selectedScenario === null) return null;

    const scenario = scenarios.find(s => s.id === selectedScenario);
    if (!scenario) return null;

    switch (scenario.id) {
      case 1: // Ambulance
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-6xl">{scenario.icon}</div>
                <div>
                  <h3 className="text-2xl font-bold text-red-700">{scenario.title[language]}</h3>
                  <p className="text-gray-600">{scenario.description[language]}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h4 className="font-bold text-xl text-gray-800 mb-4">🎯 {t.scenarios.ambulance.why}:</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <div>
                    <p className="font-semibold text-gray-800">{t.scenarios.ambulance.explanation.split('.')[0]}</p>
                    <p className="text-gray-600">{t.scenarios.ambulance.explanation}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <div>
                    <p className="font-semibold text-gray-800">{t.scenarios.ambulance.keyPoint}</p>
                    <p className="text-gray-600">{t.scenarios.ambulance.explanation}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h4 className="font-bold text-xl text-gray-800 mb-4">📱 Interactive Demo:</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-100 p-6 rounded-lg">
                  <h5 className="font-bold text-center mb-4 text-gray-700">On Vehicle (What you see)</h5>
                  <div className="bg-white border-4 border-red-500 rounded-lg p-8 text-center">
                    <div className="text-4xl font-bold text-red-600" style={{ transform: 'scaleX(-1)' }}>
                      AMBULANCE
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 text-center mt-2">Looks reversed when seen directly</p>
                </div>

                <div className="bg-gray-100 p-6 rounded-lg">
                  <h5 className="font-bold text-center mb-4 text-gray-700">In Rear-View Mirror</h5>
                  <div className="bg-gradient-to-b from-gray-700 to-gray-800 border-4 border-gray-900 rounded-lg p-8 text-center">
                    <div className="text-4xl font-bold text-red-400">
                      AMBULANCE
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 text-center mt-2">Appears normal in the mirror!</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-blue-800 font-semibold">
                💡 Fun Fact: Other emergency vehicles like fire trucks and police cars also use reversed text for the same reason!
              </p>
            </div>
          </div>
        );

      case 2: // Car Mirrors
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-6xl">{scenario.icon}</div>
                <div>
                  <h3 className="text-2xl font-bold text-blue-700">{scenario.title[language]}</h3>
                  <p className="text-gray-600">{scenario.description[language]}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h4 className="font-bold text-xl text-gray-800 mb-4">🚗 {t.scenarios.carMirror.threeTypes}:</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                  <div className="text-3xl mb-2">🪞</div>
                  <h5 className="font-bold text-blue-700 mb-2">{t.scenarios.carMirror.rearView}</h5>
                  <p className="text-sm text-gray-600">{t.scenarios.carMirror.rearViewDesc}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                  <div className="text-3xl mb-2">◀️</div>
                  <h5 className="font-bold text-green-700 mb-2">{t.scenarios.carMirror.leftSide}</h5>
                  <p className="text-sm text-gray-600">{t.scenarios.carMirror.leftSideDesc}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                  <div className="text-3xl mb-2">▶️</div>
                  <h5 className="font-bold text-purple-700 mb-2">{t.scenarios.carMirror.rightSide}</h5>
                  <p className="text-sm text-gray-600">{t.scenarios.carMirror.rightSideDesc}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h4 className="font-bold text-xl text-gray-800 mb-4">🎮 {t.scenarios.carMirror.interactiveSim}:</h4>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {t.scenarios.carMirror.moveCar}: {carPosition}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={carPosition}
                  onChange={(e) => setCarPosition(Number(e.target.value))}
                  className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="relative h-80 bg-gradient-to-b from-sky-300 to-gray-400 rounded-lg overflow-hidden">
                {/* Road */}
                <div className="absolute bottom-0 left-0 right-0 h-48 bg-gray-600">
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2 border-t-4 border-b-4 border-dashed border-yellow-300"></div>
                </div>

                {/* Your car */}
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10">
                  <div className="w-32 h-20 bg-blue-500 rounded-lg border-4 border-blue-700 relative">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-20 h-8 bg-blue-400 rounded-t-lg border-4 border-blue-700 border-b-0"></div>
                    <div className="text-center text-white text-xs font-bold mt-6">Your Car</div>
                  </div>
                </div>

                {/* Car behind */}
                <div 
                  className="absolute bottom-24 left-1/2 -translate-x-1/2 transition-all duration-300"
                  style={{ transform: `translateX(-50%) translateY(${100 - carPosition}%)` }}
                >
                  <div className="w-28 h-18 bg-red-500 rounded-lg border-4 border-red-700 relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-red-400 rounded-t-lg border-4 border-red-700 border-b-0"></div>
                    <div className="text-center text-white text-xs font-bold mt-4">Car Behind</div>
                  </div>
                </div>

                {/* Mirror view indicator */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-70 px-6 py-3 rounded-lg">
                  <div className="text-white text-sm font-bold">Rear-View Mirror</div>
                  <div className="text-white text-xs mt-1">
                    {carPosition > 70 ? '⚠️ Car getting close!' : 
                     carPosition > 40 ? '👀 Car visible' : 
                     '✓ Clear'}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setShowBlindSpot(!showBlindSpot)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    showBlindSpot ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {showBlindSpot ? 'Hide' : 'Show'} Blind Spot Info
                </button>
              </div>

              {showBlindSpot && (
                <div className="mt-4 bg-yellow-50 border-2 border-yellow-500 p-4 rounded-lg">
                  <p className="font-bold text-yellow-800 mb-2">⚠️ What is a Blind Spot?</p>
                  <p className="text-gray-700">
                    A blind spot is an area around your car that you cannot see in your mirrors. Always turn your head to check blind spots before changing lanes!
                  </p>
                </div>
              )}
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-blue-800 font-semibold">
                💡 Safety Tip: "Objects in mirror are closer than they appear" - This warning is on side mirrors because convex mirrors make things look farther away!
              </p>
            </div>
          </div>
        );

      case 3: // Periscope
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-6xl">{scenario.icon}</div>
                <div>
                  <h3 className="text-2xl font-bold text-indigo-700">{scenario.title[language]}</h3>
                  <p className="text-gray-600">{scenario.description[language]}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h4 className="font-bold text-xl text-gray-800 mb-4">🔍 {t.scenarios.periscope.howItWorks}:</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <div>
                    <p className="font-semibold text-gray-800">Two Plane Mirrors</p>
                    <p className="text-gray-600">A periscope uses two plane mirrors placed parallel to each other at 45° angles.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <div>
                    <p className="font-semibold text-gray-800">Double Reflection</p>
                    <p className="text-gray-600">Light reflects off the top mirror, then off the bottom mirror, allowing you to see above obstacles.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <div>
                    <p className="font-semibold text-gray-800">Used in Submarines</p>
                    <p className="text-gray-600">Submarines use periscopes to see above the water surface while staying submerged.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h4 className="font-bold text-xl text-gray-800 mb-4">🎮 Interactive Periscope:</h4>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Submarine Depth: {periscopeAngle}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={periscopeAngle}
                  onChange={(e) => setPeriscopeAngle(Number(e.target.value))}
                  className="w-full h-3 bg-indigo-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="relative h-96 bg-gradient-to-b from-sky-200 via-blue-400 to-blue-900 rounded-lg overflow-hidden">
                {/* Water surface */}
                <div className="absolute left-0 right-0 h-1 bg-white opacity-70" style={{ top: '40%' }}></div>
                <div className="absolute left-4 text-white text-sm font-bold" style={{ top: '38%' }}>~ Water Surface ~</div>

                {/* Ship above water */}
                <div className="absolute top-12 right-12">
                  <div className="text-6xl">🚢</div>
                  <div className="text-white text-xs text-center font-bold">Enemy Ship</div>
                </div>

                {/* Submarine */}
                <div 
                  className="absolute left-1/2 -translate-x-1/2 transition-all duration-500"
                  style={{ top: `${40 + periscopeAngle * 0.4}%` }}
                >
                  <div className="text-6xl">🚢</div>
                  <div className="text-white text-xs text-center font-bold">Submarine</div>
                </div>

                {/* Periscope */}
                <div 
                  className="absolute left-1/2 w-2 bg-gray-600 transition-all duration-500"
                  style={{ 
                    top: '40%',
                    height: `${periscopeAngle * 0.4}%`,
                    transform: 'translateX(-50%)'
                  }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-8 bg-gray-700 rounded-full border-2 border-gray-500 flex items-center justify-center">
                    <div className="text-xs">👁️</div>
                  </div>
                </div>

                {/* Light rays */}
                {periscopeAngle > 20 && (
                  <>
                    <div className="absolute right-12 w-32 h-0.5 bg-yellow-300" style={{ top: '15%' }}></div>
                    <div className="absolute right-32 text-yellow-300 text-xs" style={{ top: '13%' }}>Light rays</div>
                  </>
                )}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-indigo-50 p-3 rounded-lg text-center">
                  <div className="font-bold text-indigo-700">Periscope Length</div>
                  <div className="text-2xl font-bold text-indigo-600">{Math.round(periscopeAngle * 0.4)}m</div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg text-center">
                  <div className="font-bold text-purple-700">Submarine Depth</div>
                  <div className="text-2xl font-bold text-purple-600">{Math.round(periscopeAngle * 0.4)}m</div>
                </div>
              </div>
            </div>

            <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
              <p className="text-indigo-800 font-semibold">
                💡 Did You Know? Modern submarines use advanced periscopes with cameras and night vision, but they still work on the same principle of reflection!
              </p>
            </div>
          </div>
        );

      case 4: // Kaleidoscope
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-6xl">{scenario.icon}</div>
                <div>
                  <h3 className="text-2xl font-bold text-pink-700">{scenario.title[language]}</h3>
                  <p className="text-gray-600">{scenario.description[language]}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h4 className="font-bold text-xl text-gray-800 mb-4">✨ {t.scenarios.kaleidoscope.howCreates}:</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <div>
                    <p className="font-semibold text-gray-800">Three Mirrors in Triangle</p>
                    <p className="text-gray-600">Three rectangular mirrors are arranged in a triangular tube.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <div>
                    <p className="font-semibold text-gray-800">Multiple Reflections</p>
                    <p className="text-gray-600">Colored beads create multiple reflections between the mirrors.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <div>
                    <p className="font-semibold text-gray-800">Symmetrical Beauty</p>
                    <p className="text-gray-600">Each turn creates a unique, symmetrical pattern that never repeats!</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h4 className="font-bold text-xl text-gray-800 mb-4">🎨 Create Your Pattern:</h4>
              
              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => setKaleidoscopeRotation((prev) => (prev + 45) % 360)}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600"
                >
                  🔄 Rotate
                </button>
                <button
                  onClick={() => setKaleidoscopePattern((prev) => (prev + 1) % 4)}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-teal-600"
                >
                  ✨ New Pattern
                </button>
              </div>

              <div className="relative w-full aspect-square bg-black rounded-lg overflow-hidden flex items-center justify-center">
                <div 
                  className="w-64 h-64 relative transition-transform duration-700"
                  style={{ transform: `rotate(${kaleidoscopeRotation}deg)` }}
                >
                  {kaleidoscopePattern === 0 && (
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                      <circle cx="100" cy="100" r="80" fill="#FF6B6B" opacity="0.8"/>
                      <circle cx="100" cy="100" r="60" fill="#4ECDC4" opacity="0.8"/>
                      <circle cx="100" cy="100" r="40" fill="#FFE66D" opacity="0.8"/>
                      <circle cx="100" cy="100" r="20" fill="#A8E6CF" opacity="0.8"/>
                    </svg>
                  )}
                  {kaleidoscopePattern === 1 && (
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                      <polygon points="100,20 180,180 20,180" fill="#FF6B6B" opacity="0.7"/>
                      <polygon points="100,60 150,140 50,140" fill="#4ECDC4" opacity="0.7"/>
                      <polygon points="100,100 130,160 70,160" fill="#FFE66D" opacity="0.7"/>
                      <circle cx="100" cy="100" r="15" fill="#A8E6CF"/>
                    </svg>
                  )}
                  {kaleidoscopePattern === 2 && (
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                      <rect x="40" y="40" width="120" height="120" fill="#FF6B6B" opacity="0.7" transform="rotate(45 100 100)"/>
                      <rect x="60" y="60" width="80" height="80" fill="#4ECDC4" opacity="0.7" transform="rotate(45 100 100)"/>
                      <rect x="80" y="80" width="40" height="40" fill="#FFE66D" opacity="0.7" transform="rotate(45 100 100)"/>
                      <circle cx="100" cy="100" r="10" fill="#A8E6CF"/>
                    </svg>
                  )}
                  {kaleidoscopePattern === 3 && (
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                      <path d="M100,30 L130,80 L180,80 L140,110 L160,160 L100,130 L40,160 L60,110 L20,80 L70,80 Z" fill="#FFD700" opacity="0.8"/>
                      <path d="M100,60 L115,85 L145,85 L120,102 L130,130 L100,112 L70,130 L80,102 L55,85 L85,85 Z" fill="#FF6B6B" opacity="0.8"/>
                      <circle cx="100" cy="100" r="15" fill="#4ECDC4"/>
                    </svg>
                  )}
                </div>
              </div>

              <div className="mt-4 text-center text-gray-600 text-sm">
                Each rotation creates a unique, mesmerizing pattern through multiple reflections!
              </div>
            </div>

            <div className="bg-pink-50 border-l-4 border-pink-500 p-4 rounded">
              <p className="text-pink-800 font-semibold">
                💡 Fun Fact: The word "kaleidoscope" comes from Greek words meaning "beautiful form viewer"!
              </p>
            </div>
          </div>
        );

      case 5: // Dentist Mirror
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-6xl">{scenario.icon}</div>
                <div>
                  <h3 className="text-2xl font-bold text-cyan-700">{scenario.title[language]}</h3>
                  <p className="text-gray-600">{scenario.description[language]}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h4 className="font-bold text-xl text-gray-800 mb-4">🦷 {t.scenarios.dentistMirror.whyDentists}:</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <div>
                    <p className="font-semibold text-gray-800">See Hidden Areas</p>
                    <p className="text-gray-600">Mirrors help dentists see the back of teeth and areas difficult to view directly.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <div>
                    <p className="font-semibold text-gray-800">Reflect Light</p>
                    <p className="text-gray-600">The mirror reflects light into dark corners of the mouth for better visibility.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <div>
                    <p className="font-semibold text-gray-800">Small & Angled</p>
                    <p className="text-gray-600">The small size and angled handle allow easy maneuvering inside the mouth.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h4 className="font-bold text-xl text-gray-800 mb-4">🔍 Interactive Examination:</h4>
              
              <div className="mb-4">
                <div className="flex gap-2 justify-center">
                  {['Front', 'Left', 'Right', 'Back'].map((section, idx) => (
                    <button
                      key={idx}
                      onClick={() => setToothSection(idx)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        toothSection === idx
                          ? 'bg-cyan-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {section}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative h-80 bg-gradient-to-b from-pink-100 to-pink-50 rounded-lg flex items-center justify-center overflow-hidden">
                <div className="relative">
                  {/* Mouth illustration */}
                  <div className="w-64 h-48 bg-pink-200 rounded-full relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-32 bg-pink-300 rounded-full"></div>
                    
                    {/* Teeth */}
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-1">
                      {[1,2,3,4,5,6,7,8].map((_, idx) => (
                        <div key={idx} className="w-4 h-6 bg-white rounded-b-lg border border-gray-300"></div>
                      ))}
                    </div>
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-1">
                      {[1,2,3,4,5,6,7,8].map((_, idx) => (
                        <div key={idx} className="w-4 h-6 bg-white rounded-t-lg border border-gray-300"></div>
                      ))}
                    </div>

                    {/* Mirror position indicator */}
                    <div 
                      className="absolute w-12 h-16 bg-gray-400 rounded-full border-2 border-gray-600 transition-all duration-300"
                      style={{
                        left: toothSection === 0 ? '50%' : toothSection === 1 ? '25%' : toothSection === 2 ? '75%' : '50%',
                        top: toothSection === 3 ? '75%' : '25%',
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <div className="absolute inset-2 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full"></div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white bg-opacity-90 px-4 py-2 rounded-lg">
                  <p className="text-sm font-bold text-gray-700">
                    Examining: {['Front Teeth', 'Left Molars', 'Right Molars', 'Back Teeth'][toothSection]}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-cyan-50 border-l-4 border-cyan-500 p-4 rounded">
              <p className="text-cyan-800 font-semibold">
                💡 Health Tip: Dentists can detect cavities, plaque, and gum problems early using mirrors - that's why regular checkups are important!
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="text-6xl mb-4">{scenario.icon}</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">{scenario.title[language]}</h3>
            <p className="text-gray-600 mb-6">{scenario.description[language]}</p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded text-left">
              <p className="text-blue-800">
                This real-world application demonstrates how plane mirrors are used in everyday life to solve practical problems and make tasks easier.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {/* Header removed as requested */}

        {selectedScenario === null ? (
          // Scenario Grid
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScenarios.map((scenario) => (
              <div
                key={scenario.id}
                onClick={() => setSelectedScenario(scenario.id)}
                className="bg-white rounded-xl shadow-lg p-6 cursor-pointer transform transition-all hover:scale-105 hover:shadow-2xl"
              >
                <div className="text-5xl mb-4 text-center">{scenario.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{scenario.title[language]}</h3>
                <p className="text-gray-600 text-sm mb-4">{scenario.description[language]}</p>
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    scenario.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                    scenario.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {t.difficulty[scenario.difficulty]}
                  </span>
                  <span className="text-blue-600 font-semibold text-sm">
                    Explore →
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Detailed Scenario View
          <div>
            <button
              onClick={() => setSelectedScenario(null)}
              className="mb-6 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              ← {t.back}
            </button>
            
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              {renderScenarioDetail()}
            </div>
          </div>
        )}
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
const LightTravelApp: React.FC = () => {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
};

export { LightTravelApp };
export default LightTravelApp;
