import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { Lightbulb, ArrowRight, ArrowLeft, CheckCircle, XCircle, RefreshCw, Award, Eye, Home, Smartphone, Telescope, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

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
          (chrome.runtime as { lastError?: unknown }).lastError;
          Object.defineProperty(chrome.runtime, 'lastError', {
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

const Shield = ({ className }: { className?: string }) => {
  const svgProps: React.SVGProps<SVGSVGElement> = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    viewBox: "0 0 24 24"
  };
  
  const filteredSvgProps: Record<string, unknown> = {};
  const invalidKeys = ['error', 'warn', 'log'];
  for (const key in svgProps) {
    if (!invalidKeys.includes(key)) {
      filteredSvgProps[key] = svgProps[key as keyof typeof svgProps];
    }
  }
  
  return (
    <svg {...(filteredSvgProps as React.SVGProps<SVGSVGElement>)}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
};

type Language = "en" | "hi" | "gu";
type TabType = "learn" | "practice" | "realWorld";




// Translation interface
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
  practice: {
    title: string;
    subtitle?: string;
    stats?: {
      score: string;
      accuracy: string;
      progress: string;
    };
    exercise?: string;
    difficulty?: {
      easy: string;
      medium: string;
      hard: string;
    };
    completed?: string;
    restart?: string;
    submitAnswer?: string;
    nextExercise?: string;
    completedAll?: string;
    overview?: {
      title: string;
      subtitle: string;
      backToPractice: string;
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
    congratulations?: string;
    completedAllText?: string;
    accuracyLabel?: string;
    excellent?: string;
    notQuiteRight?: string;
    interactive?: {
      mirrorAngle: string;
      tip: string;
      lightSource: string;
      mirror: string;
      target: string;
      perfect: string;
    };
    drawing?: {
      instruction: string;
      clearDrawing: string;
      tip: string;
    };
    exercises?: {
      [key: string]: {
        question: string;
        options?: string[];
        explanation: string;
      };
    };
    trueFalse?: {
      true: string;
      false: string;
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
    };
    controls: {
      title: string;
      angleOfIncidence: string;
      showNormalLine: string;
      showAngleMeasurements: string;
      animateLightTravel: string;
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
    applications:
      | Array<{
          id: number;
          title: string;
          description: string;
          icon?: string;
          category: string;
          example: string;
          howItWorks?: string[];
          funFacts?: string[];
          canvasLabel?: string;
        }>
      | {
          [key: string]: {
            title: string;
            category: string;
            description: string;
            example: string;
            howItWorks: string[];
            funFacts: string[];
            canvasLabel: string;
          };
        };
  };
}

// Translation type definition for compatibility
type TranslationValue =
  | string
  | string[]
  | number
  | { [key: string]: TranslationValue }
  | Array<{ [key: string]: TranslationValue }>;

// Translation system - Inline translations
export const translations: Record<string, Translation> = {
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
    practice: {
      title: "Practice Mode",
      subtitle: "Test your knowledge",
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
      completed: "Completed!",
      submitAnswer: "Submit Answer",
      nextExercise: "Next Exercise",
      excellent: "Excellent!",
      notQuiteRight: "Not quite right",
      interactive: {
        mirrorAngle: "Mirror Angle:",
        tip: "Drag the slider to adjust the mirror's angle.",
        lightSource: "Light Source",
        mirror: "Mirror ({{angle}}°)",
        target: "Target",
        perfect: "Perfect Reflection!",
      },
      drawing: {
        instruction: "Draw the reflected ray!",
        clearDrawing: "Clear Drawing",
        tip: "Draw where you think the light will bounce!",
      },
      trueFalse: {
        true: "True",
        false: "False",
      },
      exercises: {
        "1": {
          question: "Which of the following always happens when light hits a smooth surface like a mirror?",
          options: ["It is absorbed", "It is reflected", "It passes through", "It disappears"],
          explanation: "Light reflects off smooth surfaces in a predictable way, which is what allows us to see images in mirrors.",
        },
        "2": {
          question: "The Law of Reflection states that the Angle of Incidence is always ________ to the Angle of Reflection.",
          options: ["Greater than", "Less than", "Equal to", "Double of"],
          explanation: "According to the Law of Reflection, the angle at which light hits a surface is equal to the angle at which it reflects.",
        },
        "3": {
          question: "What kind of reflection occurs when light hits a rough surface like a brick wall?",
          options: ["Regular reflection", "Perfect reflection", "Diffuse reflection", "Mirror reflection"],
          explanation: "Diffuse reflection occurs when light hits a rough surface, causing the rays to scatter in many different directions.",
        },
        "4": {
          question: "If you stand in front of a mirror and raise your right hand, the image appears to raise its right hand.",
          explanation: "This is False. Due to lateral inversion, your right hand appears as the left hand of the image in a plane mirror.",
        },
        "5": {
          question: "Adjust the mirror to make the light hit the target! Can you find the correct angle?",
          explanation: "Great job! You used the law of reflection to hit the target.",
        },
        "6": {
          question: "An incident ray hits a mirror at an angle of 30° from the normal. What will be the angle of reflection?",
          options: ["15°", "30°", "60°", "90°"],
          explanation: "Since angle of incidence = angle of reflection, the reflected angle will also be 30°.",
        },
        "7": {
          question: "Draw the reflected ray for the given incident ray on the mirror.",
          explanation: "Excellent drawing! The reflected ray follows the path dictated by the Law of Reflection.",
        },
        "8": {
          question: "In this diagram, which line represents the 'Normal'?",
          options: ["The incident ray", "The perpendicular line", "The reflected ray", "The mirror surface"],
          explanation: "The Normal is an imaginary line perpendicular to the surface at the point of incidence.",
        },
      },
      overview: {
        title: "Practice Completed!",
        subtitle: "Here's how you performed in this session",
        backToPractice: "Back to Practice",
        correct: "Correct Answers",
        incorrect: "Incorrect Answers",
        accuracy: "Overall Accuracy",
        exerciseList: "Exercise Breakdown",
        yourAnswer: "Your Answer:",
        correctAnswer: "Correct Answer:",
        explanation: "Explanation:",
        notAnswered: "Not Answered",
        drawn: "Drawn",
        notDrawn: "Not Drawn",
        drawingRequired: "Drawing Exercise",
      }
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
    realWorld: {
      title: "Real World Applications",
      subtitle: "Discover how reflection of light is used in everyday life",
      previous: "Previous",
      next: "Next",
      keyTakeaway: "Key Takeaway",
      keyTakeawayText:
        "Reflection of light is not just a physics concept - it's a fundamental principle that powers countless technologies we use every day.",
      howItWorks: "How Does It Work?",
      funFacts: "Fun Facts",
      example: "Example:",
      applications: [
        {
          id: 1,
          title: "Mirrors in Daily Life",
          category: "Everyday Use",
          description: "We use mirrors every day for grooming, dressing, and checking our appearance.",
          example: "Bathroom mirrors, dressing table mirrors, wardrobe mirrors",
          howItWorks: [
            "Light from your body and surroundings hits the mirror surface",
            "The smooth glass surface reflects light in a predictable way",
            "Reflected light enters your eyes, creating a virtual image",
            "The image appears to be behind the mirror at the same distance"
          ],
          funFacts: [
            "Ancient mirrors were made of polished bronze or copper",
            "Modern mirrors use a thin layer of aluminum or silver coating"
          ],
          canvasLabel: "You see your reflection!"
        },
        {
          id: 2,
          title: "Periscope",
          category: "Military & Optics",
          description: "A device that allows you to see things from around a corner or from a hidden position.",
          example: "Submarines, armored vehicles, trench warfare",
          howItWorks: [
            "Two mirrors are placed at 45 degree angles inside a tube",
            "Light hits the top mirror and reflects down the tube",
            "The bottom mirror reflects the light into the viewer's eye"
          ],
          funFacts: [
            "Periscopes were crucial for submarine captains to see above water",
            "Fiber optics are now used for more advanced digital periscopes"
          ],
          canvasLabel: "Seeing around corners!"
        },
        {
          id: 3,
          title: "Kaleidoscope",
          category: "Art & Toys",
          description: "An optical instrument with two or more reflecting surfaces tilted to each other in an angle.",
          example: "Children's toys, design inspiration",
          howItWorks: [
            "Multiple mirrors create repeated reflections of colorful objects",
            "Rotation creates ever-changing, symmetrical patterns",
            "Multiple reflections multiply the image of a few objects"
          ],
          funFacts: [
            "Invented by David Brewster in 1816",
            "The name comes from Greek words meaning 'beautiful form to see'"
          ],
          canvasLabel: "Infinite patterns!"
        },
        {
          id: 4,
          title: "Telescope",
          category: "Astronomy",
          description: "Reflecting telescopes use mirrors to gather and focus light from distant stars.",
          example: "Hubble Space Telescope, James Webb Telescope",
          howItWorks: [
            "A large curved mirror collects light from distant objects",
            "The light is focused onto a smaller secondary mirror",
            "The secondary mirror reflects light to the eyepiece or camera"
          ],
          funFacts: [
            "Isaac Newton built the first reflecting telescope in 1668",
            "Large mirrors allow telescopes to see millions of light-years away"
          ],
          canvasLabel: "Eyes on the universe!"
        },
        {
          id: 5,
          title: "Dental Mirror",
          category: "Medical",
          description: "A small mirror used by dentists to see difficult-to-reach areas of the mouth.",
          example: "Dentist checkups",
          howItWorks: [
            "A small circular mirror is placed in the mouth",
            "It reflects light onto the teeth and reflects the image back",
            "Concave dental mirrors can magnify the image for better detail"
          ],
          funFacts: [
            "Some modern dental mirrors have built-in LED lights",
            "They are usually made of stainless steel for easy sterilization"
          ],
          canvasLabel: "Clear view of teeth!"
        },
        {
          id: 6,
          title: "Security Mirror",
          category: "Public Safety",
          description: "Convex mirrors used in stores and intersections to provide a wide view.",
          example: "Store aisles, blind corners in parking lots",
          howItWorks: [
            "The convex (bulging) surface reflects a wide area",
            "It compresses multiple angles into a single small mirror",
            "Though images are smaller, the field of view is much larger"
          ],
          funFacts: [
            "Convex mirrors always form virtual, upright, and diminished images",
            "They help prevent accidents at 'blind' road intersections"
          ],
          canvasLabel: "Wide angle security!"
        },
        {
          id: 7,
          title: "Smartphone Camera",
          category: "Modern Tech",
          description: "Smartphones use tiny mirrors and sensors to capture photos and selfies.",
          example: "Selfies, photography",
          howItWorks: [
            "Light reflects off your face into the camera lens",
            "For selfies, the screen acts as a mirror during preview",
            "Internal mirror systems help focus light onto small sensors"
          ],
          funFacts: [
            "Selfie cameras often mirror the image to feel more natural",
            "Modern cameras use multiple lens and mirror elements for zoom"
          ],
          canvasLabel: "Smile for the selfie!"
        }
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
    practice: {
      title: "अभ्यास मोड",
      subtitle: "अपने ज्ञान का परीक्षण करें",
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
      completed: "पूरा हुआ!",
      submitAnswer: "उत्तर जमा करें",
      excellent: "बहुत बढ़िया!",
      notQuiteRight: "काफी सही नहीं",
      interactive: {
        mirrorAngle: "दर्पण कोण:",
        tip: "दर्पण के कोण को समायोजित करने के लिए स्लाइडर को खींचें।",
        lightSource: "प्रकाश स्रोत",
        mirror: "दर्पण ({{angle}}°)",
        target: "लक्ष्य",
        perfect: "सही परावर्तन!",
      },
      drawing: {
        instruction: "परावर्तित किरण खींचिए!",
        clearDrawing: "ड्राइंग साफ़ करें",
        tip: "खिंचें कि आपको क्या लगता है कि प्रकाश कहाँ से टकराएगा!",
      },
      trueFalse: {
        true: "सही",
        false: "गलत",
      },
      exercises: {
        "1": {
          question: "जब प्रकाश दर्पण जैसी चिकनी सतह पर गिरता है, तो निम्न में से क्या हमेशा होता है?",
          options: ["यह अवशोषित हो जाता है", "यह परावर्तित हो जाता है", "यह आर-पार निकल जाता है", "यह गायब हो जाता है"],
          explanation: "प्रकाश चिकनी सतहों से एक अनुमानित तरीके से परावर्तित होता है, जो हमें दर्पणों में चित्र देखने की अनुमति देता है।",
        },
        "2": {
          question: "परावर्तन का नियम कहता है कि आपतन कोण हमेशा परावर्तन कोण के ________ होता है।",
          options: ["से बड़ा", "से छोटा", "बराबर", "दोगुना"],
          explanation: "परावर्तन के नियम के अनुसार, जिस कोण पर प्रकाश सतह से टकराता है वह उस कोण के बराबर होता है जिस पर वह परावर्तित होता है।",
        },
        "3": {
          question: "ईंट की दीवार जैसी खुरदरी सतह पर प्रकाश पड़ने पर किस प्रकार का परावर्तन होता है?",
          options: ["नियमित परावर्तन", "पूर्ण परावर्तन", "विसरित परावर्तन", "दर्पण परावर्तन"],
          explanation: "विसरित परावर्तन तब होता है जब प्रकाश एक खुरदरी सतह से टकराता है, जिससे किरणें कई अलग-अलग दिशाओं में बिखर जाती हैं।",
        },
        "4": {
          question: "यदि आप दर्पण के सामने खड़े होकर अपना दाहिना हाथ उठाते हैं, तो प्रतिबिंब अपना दाहिना हाथ उठाता हुआ प्रतीत होता है।",
          explanation: "यह गलत है। पार्श्व व्युत्क्रमण (lateral inversion) के कारण, समतल दर्पण में आपका दाहिना हाथ छवि के बाएं हाथ के रूप में दिखाई देता है।",
        },
        "5": {
          question: "प्रकाश को टार्गेट से टकराने के लिए दर्पण को समायोजित करें! क्या आप सही कोण ढूंढ सकते हैं?",
          explanation: "बहुत अच्छा! आपने टार्गेट को हिट करने के लिए परावर्तन के नियम का उपयोग किया।",
        },
        "6": {
          question: "एक आपतित किरण अभिलंब से 30° के कोण पर दर्पण से टकराती है। परावर्तन कोण क्या होगा?",
          options: ["15°", "30°", "60°", "90°"],
          explanation: "चूंकि आपतन कोण = परावर्तन कोण, परावर्तित कोण भी 30° होगा।",
        },
        "7": {
          question: "दर्पण पर दी गई आपतित किरण के लिए परावर्तित किरण खींचिए।",
          explanation: "बेहतरीन ड्राइंग! परावर्तित किरण परावर्तन के नियम द्वारा निर्धारित पथ का अनुसरण करती है।",
        },
        "8": {
          question: "इस चित्र में, कौन सी रेखा 'अभिलंब' (Normal) का प्रतिनिधित्व करती है?",
          options: ["आपतित किरण", "लंबवत रेखा", "परावर्तित किरण", "दर्पण की सतह"],
          explanation: "अभिलंब (Normal) आपतन बिंदु पर सतह के लंबवत एक काल्पनिक रेखा है।",
        },
      },
      overview: {
        title: "अभ्यास पूरा हुआ!",
        subtitle: "यहाँ बताया गया है कि आपने इस सत्र में कैसा प्रदर्शन किया",
        backToPractice: "अभ्यास पर वापस जाएं",
        correct: "सही उत्तर",
        incorrect: "गलत उत्तर",
        accuracy: "कुल सटीकता",
        exerciseList: "अभ्यास विवरण",
        yourAnswer: "आपका उत्तर:",
        correctAnswer: "सही उत्तर:",
        explanation: "स्पष्टीकरण:",
        notAnswered: "उत्तर नहीं दिया",
        drawn: "खींचा गया",
        notDrawn: "नहीं खींचा गया",
        drawingRequired: "ड्राइंग अभ्यास",
      }
    },
    learn: {
      title: "✨ प्रकाश का परावर्तन ✨",
      subtitle: "सतहों से प्रकाश के परावर्तन के इंटरैक्टिव प्रदर्शन",
      demos: {
        law: "📐 परावर्तन का नियम",
        types: "🔄 परावर्तन के प्रकार",
      },
      canvas: {
        normal: "अभिलंब",
        incidentRay: "आपतित किरण",
        reflectedRay: "परावर्तित किरण",
        incidentAngle: "∠i = {{angle}}°",
        reflectedAngle: "∠r = {{angle}}°",
      },
      controls: {
        title: "⚙️ नियंत्रण",
        angleOfIncidence: "आपतन कोण:",
        showNormalLine: "अभिलंब रेखा दिखाएं",
        showAngleMeasurements: "कोण माप दिखाएं",
        animateLightTravel: "प्रकाश यात्रा को एनिमेट करें",
      },
      concepts: {
        title: "📚 मुख्य अवधारणाएं",
        law: {
          title: "परावर्तन का नियम",
          description: "कहता है कि जब प्रकाश एक सतह से परावर्तित होता है:",
          point1:
            "आपतित किरण, परावर्तित किरण और अभिलंब सभी एक ही तल में स्थित होते हैं",
          point2: "आपतन कोण (∠i) परावर्तन कोण (∠r) के बराबर होता है",
          point3: "दोनों कोण अभिलंब (सतह के लंबवत रेखा) से मापे जाते हैं",
          redRay: "लाल किरण:",
          redRayDesc: "दर्पण की ओर आने वाला आपतित प्रकाश",
          greenRay: "हरी किरण:",
          greenRayDesc: "दर्पण से टकराकर वापस जाने वाला परावर्तित प्रकाश",
          yellowLine: "पीली धराशायी रेखा:",
          yellowLineDesc: "अभिलंब (सतह के लंबवत)",
        },
        types: {
          regularTitle: "नियमित (स्पेक्युलर) परावर्तन:",
          regularDesc: "दर्पण और शांत पानी जैसी चिकनी सतहों पर होता है।",
          diffuseTitle: "विवर्तित परावर्तन:",
          diffuseDesc: "कागज, दीवारें और कपड़े जैसी खुरदरी सतहों पर होता है।",
        },
      },
      infoBox: {
        lawTitle: "परावर्तन का नियम:",
        lawFormula: "∠i = ∠r",
        lawDesc1: "आपतन कोण बराबर होता है",
        lawDesc2: "परावर्तन कोण के",
      },
      types: {
        regularTitle: "नियमित परावर्तन",
        diffuseTitle: "विवर्तित परावर्तन",
        smoothSurface: "चिकनी सतह",
        roughSurface: "खुरदरी सतह",
        regularDesc:
          "समानांतर आपतित किरणें परावर्तन के बाद भी समानांतर रहती हैं",
        diffuseDesc: "समानांतर आपतित किरणें अलग-अलग दिशाओं में बिखर जाती हैं",
      },
    },
    realWorld: {
      title: "वास्तविक दुनिया के अनुप्रयोग",
      subtitle:
        "जानें कि प्रकाश के परावर्तन का उपयोग रोजमर्रा की जिंदगी में कैसे किया जाता है",
      previous: "पिछला",
      next: "अगला",
      keyTakeaway: "मुख्य बात",
      keyTakeawayText: "प्रकाश का परावर्तन केवल एक भौतिकी अवधारणा नहीं है।",
      howItWorks: "यह कैसे काम करता है?",
      funFacts: "रोचक तथ्य",
      example: "उदाहरण:",
      applications: [
        {
          id: 1,
          title: "दैनिक जीवन में दर्पण",
          category: "रोजमर्रा का उपयोग",
          description: "हम संवारने, तैयार होने और अपनी उपस्थिति की जांच करने के लिए हर दिन दर्पणों का उपयोग करते हैं।",
          example: "बाथरूम के दर्पण, ड्रेसिंग टेबल के दर्पण, अलमारी के दर्पण",
          howItWorks: [
            "आपके शरीर और परिवेश से प्रकाश दर्पण की सतह से टकराता है",
            "चिकनी कांच की सतह प्रकाश को अनुमानित तरीके से परावर्तित करती है",
            "परावर्तित प्रकाश आपकी आंखों में प्रवेश करता है, एक आभासी छवि बनाता है",
            "छवि दर्पण के पीछे उतनी ही दूरी पर दिखाई देती है"
          ],
          funFacts: [
            "प्राचीन दर्पण पॉलिश किए हुए कांसे या तांबे से बने होते थे",
            "आधुनिक दर्पण एल्यूमीनियम या चांदी की कोटिंग की एक पतली परत का उपयोग करते हैं"
          ],
          canvasLabel: "आप अपना प्रतिबिंब देख रहे हैं!"
        },
        {
          id: 2,
          title: "पेरिस्कोप",
          category: "सैन्य और प्रकाशिकी",
          description: "एक उपकरण जो आपको कोने के आसपास या छिपी हुई स्थिति से चीजें देखने की अनुमति देता है।",
          example: "पनडुब्बियां, बख्तरबंद वाहन, खाई युद्ध",
          howItWorks: [
            "एक ट्यूब के अंदर दो दर्पण 45 डिग्री के कोण पर रखे जाते हैं",
            "प्रकाश ऊपर के दर्पण से टकराता है और नीचे ट्यूब में परावर्तित होता है",
            "नीचे का दर्पण प्रकाश को देखने वाले की आंख में परावर्तित करता है"
          ],
          funFacts: [
            "पंडुब्बी कप्तानों के लिए पानी के ऊपर देखने के लिए पेरिस्कोप महत्वपूर्ण थे",
            "अब उन्नत डिजिटल पेरिस्कोप के लिए फाइबर ऑप्टिक्स का उपयोग किया जाता है"
          ],
          canvasLabel: "कोनों के आसपास देखना!"
        },
        {
          id: 3,
          title: "कैलीडोस्कोप",
          category: "कला और खिलौने",
          description: "एक ऑप्टिकल उपकरण जिसमें दो या दो से अधिक परावर्तक सतहें एक कोण पर एक दूसरे की ओर झुकी होती हैं।",
          example: "बच्चों के खिलौने, डिजाइन प्रेरणा",
          howItWorks: [
            "कई दर्पण रंगीन वस्तुओं के बार-बार परावर्तन बनाते हैं",
            "घुमाने से हमेशा बदलते हुए, सममित पैटर्न बनते हैं",
            "एकाधिक परावर्तन कुछ वस्तुओं की छवि को कई गुना बढ़ा देते हैं"
          ],
          funFacts: [
            "1816 में डेविड ब्रूस्टर द्वारा आविष्कार किया गया",
            "नाम ग्रीक शब्दों से आया है जिसका अर्थ है 'देखने के लिए सुंदर रूप'"
          ],
          canvasLabel: "अनंत पैटर्न!"
        },
        {
          id: 4,
          title: "टेलीस्कोप",
          category: "खगोल विज्ञान",
          description: "परावर्तक दूरबीनें दूर के तारों से प्रकाश इकट्ठा करने और केंद्रित करने के लिए दर्पणों का उपयोग करती हैं।",
          example: "हबल स्पेस टेलीस्कोप, जेम्स वेब टेलीस्कोप",
          howItWorks: [
            "एक बड़ा घुमावदार दर्पण दूर की वस्तुओं से प्रकाश एकत्र करता है",
            "प्रकाश एक छोटे माध्यमिक दर्पण पर केंद्रित होता है",
            "माध्यमिक दर्पण प्रकाश को ऐपिस या कैमरे तक परावर्तित करता है"
          ],
          funFacts: [
            "आइजैक न्यूटन ने 1668 में पहली परावर्तक दूरबीन बनाई थी",
            "बड़े दर्पण दूरबीन को लाखों प्रकाश-वर्ष दूर देखने की अनुमति देते हैं"
          ],
          canvasLabel: "ब्रह्मांड पर नजर!"
        },
        {
          id: 5,
          title: "दंत दर्पण (Dental Mirror)",
          category: "चिकित्सा",
          description: "दंत चिकित्सकों द्वारा मुंह के उन क्षेत्रों को देखने के लिए उपयोग किया जाने वाला एक छोटा दर्पण जहां पहुंचना कठिन है।",
          example: "दंत चिकित्सक जांच",
          howItWorks: [
            "मुंह में एक छोटा गोलाकार दर्पण रखा जाता है",
            "यह दांतों पर प्रकाश परावर्तित करता है और छवि को वापस परावर्तित करता है",
            "अवतल दंत दर्पण बेहतर विवरण के लिए छवि को बड़ा कर सकते हैं"
          ],
          funFacts: [
            "कुछ आधुनिक दंत दर्पणों में अंतर्निहित एलईडी लाइटें होती हैं",
            "वे आमतौर पर आसान नसबंदी के लिए स्टेनलेस स्टील से बने होते हैं"
          ],
          canvasLabel: "दांतों का साफ दृश्य!"
        },
        {
          id: 6,
          title: "सुरक्षा दर्पण",
          category: "सार्वजनिक सुरक्षा",
          description: "दुकानों और चौराहों में व्यापक दृश्य प्रदान करने के लिए उपयोग किए जाने वाले उत्तल दर्पण।",
          example: "स्टोर गलियारे, पार्किंग स्थल में अंधे मोड़",
          howItWorks: [
            "उत्तल (उभरा हुआ) सतह एक विस्तृत क्षेत्र को परावर्तित करती है",
            "यह कई कोणों को एक छोटे दर्पण में संपीड़ित करती है",
            "यद्यपि चित्र छोटे होते हैं, देखने का क्षेत्र बहुत बड़ा होता है"
          ],
          funFacts: [
            "उत्तલ दर्पण हमेशा आभासी, सीधे और छोटे चित्र बनाते हैं",
            "वे 'अंधे' सड़क चौराहों पर दुर्घटनाओं को रोकने में मदद करते हैं"
          ],
          canvasLabel: "वाइड एंगल सुरक्षा!"
        },
        {
          id: 7,
          title: "स्मार्टफोन कैमरा",
          category: "आधुनिक तकनीक",
          description: "स्मार्टफोन फोटो और सेल्फी लेने के लिए छोटे दर्पणों और सेंसर का उपयोग करते हैं।",
          example: "सेल्फी, फोटोग्राफी",
          howItWorks: [
            "आपके चेहरे से प्रकाश कैमरा लेंस में परावर्तित होता है",
            "सेल्फी के लिए, पूर्वावलोकन के दौरान स्क्रीन दर्पण के रूप में कार्य करती है",
            "आंतरिक दर्पण प्रणालियाँ प्रकाश को छोटे सेंसर पर केंद्रित करने में मदद करती हैं"
          ],
          funFacts: [
            "सेल्फी कैमरे अक्सर छवि को अधिक प्राकृतिक महसूस कराने के लिए मिरर करते हैं",
            "आधुनिक कैमरे ज़ूम के लिए कई लेंस और दर्पण तत्वों का उपयोग करते हैं"
          ],
          canvasLabel: "सेल्फी के लिए मुस्कुराएं!"
        }
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
    practice: {
      title: "અભ્યાસ મોડ",
      subtitle: "તમારા જ્ઞાનનું પરીક્ષણ કરો",
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
      completed: "પૂર્ણ થયું!",
      submitAnswer: "જવાબ સબમિટ કરો",
      excellent: "ખૂબ સરસ!",
      notQuiteRight: "તદ્દન સાચું નથી",
      interactive: {
        mirrorAngle: "અરીસાનો ખૂણો:",
        tip: "અરીસાના ખૂણાને વ્યવસ્થિત કરવા માટે સ્લાઇડર ખેંચો.",
        lightSource: "પ્રકાશ સ્ત્રોત",
        mirror: "અરીસો ({{angle}}°)",
        target: "લક્ષ્ય",
        perfect: "સંપૂર્ણ પરાવર્તન!",
      },
      drawing: {
        instruction: "પરાવર્તિત કિરણ દોરો!",
        clearDrawing: "ડ્રોઇંગ સાફ કરો",
        tip: "દોરો કે તમને શું લાગે છે કે પ્રકાશ ક્યાંથી અથડાશે!",
      },
      trueFalse: {
        true: "સાચું",
        false: "ખોટું",
      },
      exercises: {
        "1": {
          question: "જ્યારે પ્રકાશ અરીસા જેવી લીસી સપાટી પર પડે છે ત્યારે નીચેનામાંથી શું હંમેશા થાય છે?",
          options: ["તે શોષાઈ જાય છે", "તે પરાવર્તિત થાય છે", "તે આરપાર નીકળી જાય છે", "તે અદ્રશ્ય થઈ જાય છે"],
          explanation: "પ્રકાશ લીસી સપાટીઓથી અનુમાનિત રીતે પરાવર્તિત થાય છે, જે આપણને અરીસામાં પ્રતિબિંબ જોવાની મંજૂરી આપે છે.",
        },
        "2": {
          question: "પરાવર્તનનો નિયમ જણાવે છે કે આપતન કોણ હંમેશા પરાવર્તન કોણના ________ હોય છે.",
          options: ["થી મોટો", "થી નાનો", "બરાબર", "બમણો"],
          explanation: "પરાવર્તનના નિયમ મુજબ, જે ખૂણે પ્રકાશ સપાટી પર અથડાય છે તે પરાવર્તન પામતા ખૂણાની બરાબર હોય છે.",
        },
        "3": {
          question: "ઈંટની દીવાલ જેવી ખરબચડી સપાટી પર પ્રકાશ પડવાથી કેવું પરાવર્તન થાય છે?",
          options: ["નિયમિત પરાવર્તન", "સંપૂર્ણ પરાવર્તન", "વિખરાયેલું પરાવર્તન", "અરીસાનું પરાવર્તન"],
          explanation: "વિખરાયેલું પરાવર્તન ત્યારે થાય છે જ્યારે પ્રકાશ ખરબચડી સપાટી પર અથડાય છે, જેના કારણે કિરણો ઘણી જુદી જુદી દિશાઓમાં ફેલાય છે.",
        },
        "4": {
          question: "જો તમે અરીસાની સામે ઊભા રહીને તમારો જમણો હાથ ઊંચો કરો છો, તો પ્રતિબિંબ તેનો જમણો હાથ ઊંચો કરતું જણાય છે.",
          explanation: "આ ખોટું છે. પાર્શ્વ વ્યુત્ક્રમ (lateral inversion) ને કારણે, સમતલ અરીસામાં તમારો જમણો હાથ છબીના ડાબા હાથ તરીકે દેખાય છે.",
        },
        "5": {
          question: "પ્રકાશ ટાર્ગેટ પર અથડાય તે માટે અરીસાને વ્યવસ્થિત કરો! શું તમે સાચો કોણ શોધી શકો છો?",
          explanation: "ખૂબ સરસ! તમે ટાર્ગેટ સુધી પહોંચવા માટે પરાવર્તનના નિયમનો ઉપયોગ કર્યો.",
        },
        "6": {
          question: "એક આપતિત કિરણ લંબથી 30° ના ખૂણે અરીસા સાથે અથડાય છે. પરાવર્તન કોણ કેટલો હશે?",
          options: ["15°", "30°", "60°", "90°"],
          explanation: "આપતન કોણ = પરાવર્તન કોણ હોવાથી, પરાવર્તિત ખૂણો પણ 30° હશે.",
        },
        "7": {
          question: "અરીસા પર આપેલ આપતિત કિરણ માટે પરાવર્તિત કિરણ દોરો.",
          explanation: "ઉત્કૃષ્ટ ડ્રોઇંગ! પરાવર્તિત કિરણ પરાવર્તનના નિયમ દ્વારા નિર્ધારિત માર્ગને અનુસરે છે.",
        },
        "8": {
          question: "આ આકૃતિમાં, કઈ રેખા 'લંબ' (Normal) ને દર્શાવે છે?",
          options: ["આપતિત કિરણ", "લંબ રેખા", "પરાવર્તિત કિરણ", "અરીસાની સપાટી"],
          explanation: "લંબ (Normal) એ આપતન બિંદુએ સપાટીને લંબરૂપ એક કાલ્પનિક રેખા છે.",
        },
      },
      overview: {
        title: "અભ્યાસ પૂર્ણ થયો!",
        subtitle: "અહીં તમે આ સત્રમાં કેવું પ્રદર્શન કર્યું તે છે",
        backToPractice: "અભ્યાસ પર પાછા જાઓ",
        correct: "સાચા જવાબો",
        incorrect: "ખોટા જવાબો",
        accuracy: "કુલ ચોકસાઈ",
        exerciseList: "અભ્યાસ વિગતો",
        yourAnswer: "તમારો જવાબ:",
        correctAnswer: "સાચો જવાબ:",
        explanation: "સ્પષ્ટીકરણ:",
        notAnswered: "જવાબ આપ્યો નથી",
        drawn: "દોરેલું",
        notDrawn: "દોરેલું નથી",
        drawingRequired: "ડ્રોઇંગ અભ્યાસ",
      }
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
          regularDesc: "અરીસા અને શાંત પાણી જેવી સરળ સપાટીઓ પર થાય છે.",
          diffuseTitle: "વિસર્જિત પરાવર્તન:",
          diffuseDesc: "કાગળ, દિવાલો અને કપડાં જેવી રફ સપાટીઓ પર થાય છે.",
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
    realWorld: {
      title: "વાસ્તવિક દુનિયા એપ્લિકેશન્સ",
      subtitle:
        "જાણો કે પ્રકાશના પરાવર્તનનો ઉપયોગ રોજિંદા જીવનમાં કેવી રીતે થાય છે",
      previous: "અગાઉ",
      next: "આગળ",
      keyTakeaway: "મુખ્ય ટેકઅવે",
      keyTakeawayText: "પ્રકાશનું પરાવર્તન માત્ર એક ભૌતિકશાસ્ત્રનો ખ્યાલ નથી।",
      howItWorks: "તે કેવી રીતે કામ કરે છે?",
      funFacts: "મજાના તથ્યો",
      example: "ઉદાહરણ:",
      applications: [
        {
          id: 1,
          title: "દૈનિક જીવનમાં અરીસાઓ",
          category: "રોજિંદા ઉપયોગ",
          description: "આપણે માવજત, પોશાક પહેરવા અને આપણા દેખાવને તપાસવા માટે દરરોજ અરીસાઓનો ઉપયોગ કરીએ છીએ.",
          example: "બાથરૂમના અરીસાઓ, ડ્રેસિંગ ટેબલના અરીસાઓ, કપડાના અરીસાઓ",
          howItWorks: [
            "તમારા શરીર અને આસપાસનો પ્રકાશ અરીસાની સપાટી પર અથડાય છે",
            "લીસી કાચની સપાટી પ્રકાશને અનુમાનિત રીતે પરાવર્તિત કરે છે",
            "પરાવર્તિત પ્રકાશ તમારી આંખમાં પ્રવેશે છે, એક આભાસી છબી બનાવે છે",
            "છબી અરીસાની પાછળ તેટલા જ અંતરે દેખાય છે"
          ],
          funFacts: [
            "પ્રાચીન અરીસાઓ પોલિશ કરેલા કાંસા અથવા તાંબાના બનેલા હતા",
            "આધુનિક અરીસાઓ એલ્યુમિનિયમ અથવા સિલ્વર કોટિંગના પાતળા સ્તરનો ઉપયોગ કરે છે"
          ],
          canvasLabel: "તમે તમારું પરાવર્તન જુઓ છો!"
        },
        {
          id: 2,
          title: "પેરિસ્કોપ",
          category: "લશ્કરી અને પ્રકાશશાસ્ત્ર",
          description: "એક ઉપકરણ જે તમને ખૂણાની આસપાસથી અથવા છુપાયેલી સ્થિતિમાંથી વસ્તુઓ જોવાની મંજૂરી આપે છે.",
          example: "સબમરીન, સશસ્ત્ર વાહનો, ખાઈ યુદ્ધ",
          howItWorks: [
            "ટ્યુબની અંદર બે અરીસાઓ 45 ડિગ્રીના ખૂણે મૂકવામાં આવે છે",
            "પ્રકાશ ઉપરના અરીસા પર અથડાય છે અને ટ્યુબમાં નીચે પરાવર્તિત થાય છે",
            "નીચેનો અરીસો પ્રકાશને જોનારની આંખમાં પરાવર્તિત કરે છે"
          ],
          funFacts: [
            "સબમરીન કેપ્ટનો માટે પાણીની ઉપર જોવા માટે પેરિસ્કોપ મહત્વપૂર્ણ હતા",
            "હવે વધુ અદ્યતન ડિજિટલ પેરિસ્કોપ માટે ફાયબર ઓપ્ટિક્સનો ઉપયોગ થાય છે"
          ],
          canvasLabel: "ખૂણાઓની આસપાસ જોવું!"
        },
        {
          id: 3,
          title: "કલીડોસ્કોપ",
          category: "કલા અને રમકડાં",
          description: "એક પ્રકાશીય સાધન જેમાં બે કે તેથી વધુ પરાવર્તિત સપાટીઓ એક ખૂણા પર એકબીજા તરફ ઝૂકેલી હોય છે.",
          example: "બાળકોના રમકડાં, ડિઝાઇન પ્રેરણા",
          howItWorks: [
            "બહુવિધ અરીસાઓ રંગબેરંગી વસ્તુઓના પુનરાવર્તિત પરાવર્તન બનાવે છે",
            "ભ્રમણ હંમેશા બદલાતી, સપ્રમાણ પેટર્ન બનાવે છે",
            "બહુવિધ પરાવર્તન થોડી વસ્તુઓની છબીને અનેકગણી વધારે છે"
          ],
          funFacts: [
            "1816 માં ડેવિડ બ્રૂસ્ટર દ્વારા શોધાયેલ",
            "નામ ગ્રીક શબ્દો પરથી આવ્યું છે જેનો અર્થ છે 'જોવા માટે સુંદર સ્વરૂપ'"
          ],
          canvasLabel: "અનંત પેટર્ન!"
        },
        {
          id: 4,
          title: "ટેલિસ્કોપ",
          category: "ખગોળશાસ્ત્ર",
          description: "પરાવર્તિત ટેલિસ્કોપ દૂરના તારાઓમાંથી પ્રકાશ એકત્રિત કરવા અને કેન્દ્રિત કરવા માટે અરીસાઓનો ઉપયોગ કરે છે.",
          example: "હબલ સ્પેસ ટેલિસ્કોપ, જેમ્સ વેબ ટેલિસ્કોપ",
          howItWorks: [
            "એક મોટો વળાંકવાળો અરીસો દૂરની વસ્તુઓમાંથી પ્રકાશ એકત્રિત કરે છે",
            "પ્રકાશ નાના ગૌણ અરીસા પર કેન્દ્રિત થાય છે",
            "ગૌણ અરીસો પ્રકાશને આઈપીસ અથવા કેમેરા સુધી પરાવર્તિત કરે છે"
          ],
          funFacts: [
            "આઇઝેક ન્યૂટને 1668 માં પ્રથમ પરાવર્તિત ટેલિસ્કોપ બનાવ્યું હતું",
            "મોટા અરીસાઓ ટેલિસ્કોપને લાખો પ્રકાશ-વર્ષ દૂર જોવાની મંજૂરી આપે છે"
          ],
          canvasLabel: "બ્રહ્માંડ પર નજર!"
        },
        {
          id: 5,
          title: "ડેન્ટલ મિરર",
          category: "તબીબી",
          description: "ડેન્ટિસ્ટ દ્વારા મોઢાના એવા વિસ્તારો જોવા માટે વપરાતો નાનો અરીસો જ્યાં પહોંચવું મુશ્કેલ છે.",
          example: "ડેન્ટિસ્ટ તપાસ",
          howItWorks: [
            "મોઢામાં એક નાનો ગોળ અરીસો મૂકવામાં આવે છે",
            "તે દાંત પર પ્રકાશ પરાવર્તિત કરે છે અને છબીને પાછી પરાવર્તિત કરે છે",
            "અંતર્મુખ ડેન્ટલ મિરર્સ સારી વિગત માટે છબીને મોટી કરી શકે છે"
          ],
          funFacts: [
            "કેટલાક આધુનિક ડેન્ટલ મિરર્સમાં બિલ્ટ-ઇન LED લાઇટ્સ હોય છે",
            "તેઓ સામાન્ય રીતે સરળ વંધ્યીકરણ માટે સ્ટેનલેસ સ્ટીલના બનેલા હોય છે"
          ],
          canvasLabel: "દાંતનું સ્પષ્ટ પ્રદર્શન!"
        },
        {
          id: 6,
          title: "સુરક્ષા અરીસો",
          category: "જાહેર સુરક્ષા",
          description: "સ્ટોર્સ અને આંતરછેદોમાં વિશાળ દૃશ્ય પ્રદાન કરવા માટે વપરાતા બહિર્મુખ અરીસાઓ.",
          example: "સ્ટોરની ગલીઓ, પાર્કિંગ લોટમાં અંધ ખૂણા",
          howItWorks: [
            "બહિર્મુખ (ઉપસેલી) સપાટી વિશાળ વિસ્તારને પરાવર્તિત કરે છે",
            "તે અનેક ખૂણાઓને એક નાના અરીસામાં સંકુચિત કરે છે",
            "જોકે છબીઓ નાની છે, જોવાનું ક્ષેત્ર ઘણું મોટું છે"
          ],
          funFacts: [
            "બહિર્મુખ અરીસાઓ હંમેશા આભાસી, સીધી અને નાની છબીઓ બનાવે છે",
            "તેઓ 'અંધ' રસ્તાના આંતરછેદો પર અકસ્માતો અટકાવવામાં મદદ કરે છે"
          ],
          canvasLabel: "વાઈડ એંગલ સુરક્ષા!"
        },
        {
          id: 7,
          title: "સ્માર્ટફોન કેમેરા",
          category: "આધુનિક ટેક",
          description: "સ્માર્ટફોન ફોટા અને સેલ્ફી લેવા માટે નાના અરીસાઓ અને સેન્સરનો ઉપયોગ કરે છે.",
          example: "સેલ્ફી, ફોટોગ્રાફી",
          howItWorks: [
            "તમારા ચહેરા પરનો પ્રકાશ કેમેરા લેન્સમાં પરાવર્તિત થાય છે",
            "સેલ્ફી માટે, પૂર્વાવલોકન દરમિયાન સ્ક્રીન અરીસા તરીકે કામ કરે છે",
            "આંતરિક અરીસા પ્રણાલીઓ નાના સેન્સર પર પ્રકાશ કેન્દ્રિત કરવામાં મદદ કરે છે"
          ],
          funFacts: [
            "સેલ્ફી કેમેરા ઘણીવાર છબીને વધુ કુદરતી અનુભવવા માટે મિરર કરે છે",
            "આધુનિક કેમેરા ઝૂમ માટે બહુવિધ લેન્સ અને અરીસાના તત્વોનો ઉપયોગ કરે છે"
          ],
          canvasLabel: "સેલ્ફી માટે સ્મિત કરો!"
        }
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
      if (value === undefined || value === null) return key;
      
      if (Array.isArray(value)) {
        const index = parseInt(k);
        if (!isNaN(index) && index >= 0 && index < value.length) {
          value = value[index];
        } else {
          return key;
        }
      } else if (typeof value === "object") {
        value = (value as Record<string, TranslationValue>)[k];
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
      if (value === undefined || value === null) return key;

      if (Array.isArray(value)) {
        const index = parseInt(k);
        if (!isNaN(index) && index >= 0 && index < value.length) {
          value = value[index];
        } else {
          return key;
        }
      } else if (typeof value === "object") {
        value = (value as Record<string, TranslationValue>)[k];
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
      options: (tValue('practice.exercises.1.options') as string[]) || [],
      correctAnswer: t('practice.exercises.1.options.1'),
      explanation: t('practice.exercises.1.explanation'),
      difficulty: 'Easy'
    },
    {
      id: 2,
      type: 'mcq',
      question: t('practice.exercises.2.question'),
      options: (tValue('practice.exercises.2.options') as string[]) || [],
      correctAnswer: t('practice.exercises.2.options.2'),
      explanation: t('practice.exercises.2.explanation'),
      difficulty: 'Easy'
    },
    {
      id: 3,
      type: 'mcq',
      question: t('practice.exercises.3.question'),
      options: (tValue('practice.exercises.3.options') as string[]) || [],
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
      options: (tValue('practice.exercises.6.options') as string[]) || [],
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
      difficulty: 'Hard'
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
              {Array.isArray(currentEx.options) && currentEx.options.map((option, idx) => (
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
      howItWorks: (tValue('realWorld.applications.1.howItWorks') as string[]) || [],
      funFacts: (tValue('realWorld.applications.1.funFacts') as string[]) || [],
      visualization: 'mirror-daily',
      color: 'from-blue-400 to-cyan-500',
      canvasLabel: t('realWorld.applications.1.canvasLabel')
    },
    {
      id: 2,
      title: t('realWorld.applications.2.title'),
      icon: Eye,
      category: t('realWorld.applications.2.category'),
      description: t('realWorld.applications.2.description'),
      realWorldExample: t('realWorld.applications.2.example'),
      howItWorks: (tValue('realWorld.applications.2.howItWorks') as string[]) || [],
      funFacts: (tValue('realWorld.applications.2.funFacts') as string[]) || [],
      visualization: 'periscope',
      color: 'from-green-400 to-emerald-500',
      canvasLabel: t('realWorld.applications.2.canvasLabel')
    },
    {
      id: 3,
      title: t('realWorld.applications.3.title'),
      icon: Sparkles,
      category: t('realWorld.applications.3.category'),
      description: t('realWorld.applications.3.description'),
      realWorldExample: t('realWorld.applications.3.example'),
      howItWorks: (tValue('realWorld.applications.3.howItWorks') as string[]) || [],
      funFacts: (tValue('realWorld.applications.3.funFacts') as string[]) || [],
      visualization: 'kaleidoscope',
      color: 'from-purple-400 to-pink-500',
      canvasLabel: t('realWorld.applications.3.canvasLabel')
    },
    {
      id: 4,
      title: t('realWorld.applications.4.title'),
      icon: Telescope,
      category: t('realWorld.applications.4.category'),
      description: t('realWorld.applications.4.description'),
      realWorldExample: t('realWorld.applications.4.example'),
      howItWorks: (tValue('realWorld.applications.4.howItWorks') as string[]) || [],
      funFacts: (tValue('realWorld.applications.4.funFacts') as string[]) || [],
      visualization: 'telescope',
      color: 'from-indigo-400 to-purple-600',
      canvasLabel: t('realWorld.applications.4.canvasLabel')
    },
    {
      id: 5,
      title: t('realWorld.applications.5.title'),
      icon: Eye,
      category: t('realWorld.applications.5.category'),
      description: t('realWorld.applications.5.description'),
      realWorldExample: t('realWorld.applications.5.example'),
      howItWorks: (tValue('realWorld.applications.5.howItWorks') as string[]) || [],
      funFacts: (tValue('realWorld.applications.5.funFacts') as string[]) || [],
      visualization: 'dental',
      color: 'from-teal-400 to-teal-600',
      canvasLabel: t('realWorld.applications.5.canvasLabel')
    },
    {
      id: 6,
      title: t('realWorld.applications.6.title'),
      icon: Shield,
      category: t('realWorld.applications.6.category'),
      description: t('realWorld.applications.6.description'),
      realWorldExample: t('realWorld.applications.6.example'),
      howItWorks: (tValue('realWorld.applications.6.howItWorks') as string[]) || [],
      funFacts: (tValue('realWorld.applications.6.funFacts') as string[]) || [],
      visualization: 'security',
      color: 'from-blue-500 to-indigo-600',
      canvasLabel: t('realWorld.applications.6.canvasLabel')
    },
    {
      id: 7,
      title: t('realWorld.applications.7.title'),
      icon: Smartphone,
      category: t('realWorld.applications.7.category'),
      description: t('realWorld.applications.7.description'),
      realWorldExample: t('realWorld.applications.7.example'),
      howItWorks: (tValue('realWorld.applications.7.howItWorks') as string[]) || [],
      funFacts: (tValue('realWorld.applications.7.funFacts') as string[]) || [],
      visualization: 'smartphone',
      color: 'from-pink-400 to-purple-500',
      canvasLabel: t('realWorld.applications.7.canvasLabel')
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
        case 'periscope':
          drawPeriscope(ctx, frame);
          break;
        case 'kaleidoscope':
          drawKaleidoscope(ctx, frame);
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
    ctx.fillText(t('realWorld.applications.2.canvasLabel'), 250, 280);
  };

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


  const drawKaleidoscope = (ctx: CanvasRenderingContext2D, frame: number) => {
    const centerX = 250;
    const centerY = 150;
    const radius = 100;

    // Draw kaleidoscope hexagonal frame
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 5;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();

    // Draw reflected patterns
    const segments = 6;
    const colors = ['#f472b6', '#60a5fa', '#34d399', '#fbbf24', '#a78bfa'];
    
    for (let i = 0; i < segments; i++) {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate((i * Math.PI * 2) / segments + frame * 0.01);
        
        // Pattern inside segments
        colors.forEach((color, idx) => {
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.6;
            const size = 10 + Math.sin(frame * 0.05 + idx) * 5;
            const x = 20 + idx * 12;
            const y = Math.sin(frame * 0.02 + idx) * 10;
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        });
        
        ctx.restore();
    }

    // Mirror lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    for (let i = 0; i < segments; i++) {
        const angle = (i * Math.PI) / 3;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
        ctx.stroke();
    }

    // Label
    ctx.fillStyle = '#334155';
    ctx.font = 'bold 14px Lexend';
    ctx.textAlign = 'center';
    ctx.fillText(t('realWorld.applications.3.canvasLabel'), 250, 280);
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
    ctx.fillText(t('realWorld.applications.4.canvasLabel'), 250, 280);
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
    ctx.fillText(t('realWorld.applications.5.canvasLabel'), 250, 280);
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
    ctx.fillText(t('realWorld.applications.6.canvasLabel'), 250, 290);
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
    ctx.fillText(t('realWorld.applications.7.canvasLabel'), 250, 290);
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
