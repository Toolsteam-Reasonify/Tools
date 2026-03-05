import React, { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN SYSTEM TOKENS (Singularity tool Design 1.pdf)
// ═══════════════════════════════════════════════════════════════════════════════
const DS = {
  colors: {
    primary: "#4A4DC9",
    accent: "#FF7212",
    gradientStart: "#533086",
    gradientEnd: "#FC9145",
    lightPurple: "#C1C1EA",
    lightOrange: "#FFF3E4",
    gray900: "#4E4E4E",
    gray500: "#CACACA",
    gray300: "#EBEBEB",
    gray100: "#F5F5F5",
    white: "#FFFFFF",
    success: "#22c55e",
    error: "#ef4444",
  },
  font: "'Poppins', sans-serif",
  gradient: "linear-gradient(135deg, #533086 0%, #FC9145 100%)",
  gradientPrimary: "linear-gradient(135deg, #4A4DC9 0%, #533086 100%)",
};

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES AND INTERFACES
// ═══════════════════════════════════════════════════════════════════════════════

type ModeType = "learn" | "practice" | "real_world";

interface StepDetails {
  currentStep: number;
  totalSteps: number;
  mode: ModeType;
  stepTitle: string;
}

interface LearnContent {
  id: string;
  title: string;
  content: string[];
  keyPoints: string[];
  animationType: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface RealWorldExample {
  id: string;
  title: string;
  icon: string;
  description: string;
  funFact: string;
  location?: string;
}

interface SourcesOfLightAdditionalProps {
  learnContent?: LearnContent[];
  quizQuestions?: QuizQuestion[];
  realWorldExamples?: RealWorldExample[];
  highlightTopic?: string;
  showAnimations?: boolean;
  animationIntensity?: number;
}

interface SourcesOfLightProps {
  props?: {
    width?: number | string;
    height?: number | string;
    minWidth?: number;
    maxWidth?: number;
    data?: any;
    steps?: any[];
    initialMode?: ModeType;
    showModeSelector?: boolean;
    enabledModes?: ModeType[];
    showNavigation?: boolean;
    showPlayPause?: boolean;
    showStepIndicator?: boolean;
    initialStep?: number;
    filterSteps?: number[];
    animationSpeed?: number;
    autoPlayDuration?: number;
    themeColor?: string;
    darkMode?: boolean;
    responsive?: boolean;
    additionalProps?: SourcesOfLightAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ═══════════════════════════════════════════════════════════════════════════════
// RESPONSIVE HOOK
// ═══════════════════════════════════════════════════════════════════════════════

const useResponsive = (containerRef: React.RefObject<HTMLDivElement>) => {
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [breakpoint, setBreakpoint] = useState<
    "xs" | "sm" | "md" | "lg" | "xl"
  >("lg");

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        setDimensions({ width: offsetWidth, height: offsetHeight });

        // Set breakpoint based on width
        if (offsetWidth < 400) setBreakpoint("xs");
        else if (offsetWidth < 600) setBreakpoint("sm");
        else if (offsetWidth < 800) setBreakpoint("md");
        else if (offsetWidth < 1024) setBreakpoint("lg");
        else setBreakpoint("xl");
      }
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [containerRef]);

  return { ...dimensions, breakpoint };
};

// ═══════════════════════════════════════════════════════════════════════════════
// EASING FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
const easeInOutQuad = (t: number): number =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const easeOutElastic = (t: number): number => {
  const c4 = (2 * Math.PI) / 3;
  return t === 0
    ? 0
    : t === 1
      ? 1
      : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};
const easeOutBounce = (t: number): number => {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (t < 1 / d1) return n1 * t * t;
  if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
  if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
  return n1 * (t -= 2.625 / d1) * t + 0.984375;
};

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT DATA
// ═══════════════════════════════════════════════════════════════════════════════

const defaultLearnContent: LearnContent[] = [
  {
    id: "intro",
    title: "What is Light?",
    content: [
      "Light is a form of energy that enables us to see objects around us.",
      "Without light, we cannot see anything. Try closing your eyes - everything becomes dark!",
      "Light travels very fast - about 300,000 kilometers per second!",
      "Light always travels in a straight line, which is why we can see shadows.",
    ],
    keyPoints: [
      "Light is a form of energy",
      "Light helps us see objects",
      "Light travels in straight lines",
      "Light travels extremely fast",
    ],
    animationType: "lightTravel",
  },
  {
    id: "luminous",
    title: "Luminous Objects",
    content: [
      "Objects that emit their own light are called LUMINOUS objects.",
      "The Sun is the main source of natural light on Earth.",
      "Stars, fire, candles, and electric bulbs are all luminous objects.",
      "Some living things like fireflies produce their own light - this is called bioluminescence.",
    ],
    keyPoints: [
      "Luminous objects emit their own light",
      "Sun is our main natural light source",
      "Fire and bulbs are artificial luminous sources",
      "Some animals produce light",
    ],
    animationType: "luminous",
  },
  {
    id: "nonLuminous",
    title: "Non-Luminous Objects",
    content: [
      "Objects that do NOT emit their own light are called NON-LUMINOUS objects.",
      "The Moon is a perfect example - it looks bright but actually just reflects sunlight!",
      "Most objects around us are non-luminous: books, tables, chairs, and even you!",
      "We see non-luminous objects when light reflects off them into our eyes.",
    ],
    keyPoints: [
      "Non-luminous objects do not emit light",
      "They reflect light from other sources",
      "Moon reflects sunlight",
      "Most objects are non-luminous",
    ],
    animationType: "nonLuminous",
  },
  {
    id: "natural",
    title: "Natural Light Sources",
    content: [
      "Natural light sources occur in nature without human intervention.",
      "The SUN is the most important natural light source.",
      "STARS, LIGHTNING, and FIREFLIES are other natural sources.",
      "Bioluminescent creatures in the deep sea also produce natural light.",
    ],
    keyPoints: [
      "Sun - main natural source",
      "Stars - distant suns",
      "Lightning - electrical discharge",
      "Fireflies - bioluminescence",
    ],
    animationType: "natural",
  },
  {
    id: "artificial",
    title: "Artificial Light Sources",
    content: [
      "Artificial light sources are created by humans.",
      "FIRE was the first artificial light, discovered 400,000 years ago.",
      "OIL LAMPS and CANDLES were used for thousands of years.",
      "Today, LED lamps are the most efficient artificial light source.",
    ],
    keyPoints: [
      "Fire - first artificial light",
      "Candles - traditional lighting",
      "Electric bulbs - invented 1879",
      "LED - modern efficient lighting",
    ],
    animationType: "artificial",
  },
  {
    id: "moonlight",
    title: "The Mystery of Moonlight",
    content: [
      "The Moon does NOT produce its own light!",
      "It appears bright because it REFLECTS sunlight.",
      "About 12% of sunlight hitting the Moon is reflected back.",
      'This reflected sunlight is what we call "moonlight".',
    ],
    keyPoints: [
      "Moon is non-luminous",
      "Moon reflects sunlight",
      "Moonlight = reflected sunlight",
      "12% of sunlight is reflected",
    ],
    animationType: "moonReflection",
  },
];

const defaultQuizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "Which of the following is a LUMINOUS object?",
    options: ["Moon", "Mirror", "Sun", "Book"],
    correctAnswer: 2,
    explanation:
      "The Sun emits its own light through nuclear fusion, making it luminous.",
  },
  {
    id: "q2",
    question: "Why does the Moon appear bright?",
    options: [
      "It produces light",
      "It reflects sunlight",
      "It absorbs starlight",
      "It has electric lights",
    ],
    correctAnswer: 1,
    explanation:
      "The Moon is non-luminous and reflects the sunlight that falls on it.",
  },
  {
    id: "q3",
    question: "What was the EARLIEST artificial light?",
    options: ["Electric bulb", "LED lamp", "Fire", "Candle"],
    correctAnswer: 2,
    explanation:
      "Fire was discovered about 400,000 years ago as the first artificial light.",
  },
  {
    id: "q4",
    question: "Which organism produces its own light?",
    options: ["Cat", "Firefly", "Owl", "Bat"],
    correctAnswer: 1,
    explanation:
      "Fireflies are bioluminescent and produce light through chemical reactions.",
  },
  {
    id: "q5",
    question: "Why are LED lamps better than traditional bulbs?",
    options: [
      "More electricity",
      "Shorter lifespan",
      "Less power, longer life",
      "More heat",
    ],
    correctAnswer: 2,
    explanation:
      "LEDs consume less electricity and last much longer than traditional bulbs.",
  },
];

const defaultRealWorldExamples: RealWorldExample[] = [
  {
    id: "led-india",
    title: "LED Revolution in India",
    icon: "bulb",
    description:
      "The UJALA scheme distributed over 360 million LED bulbs across India, saving billions in electricity.",
    funFact:
      "If every Indian household switches to LED, we could save enough power to run a small nation!",
    location: "India",
  },
  {
    id: "fireflies",
    title: "Firefly Festivals",
    icon: "firefly",
    description:
      "Every May-June, millions of fireflies light up the Western Ghats forests in Maharashtra.",
    funFact:
      "Each firefly species has its own unique flash pattern to find mates!",
    location: "Maharashtra, India",
  },
  {
    id: "solar",
    title: "Solar Power Plants",
    icon: "sun",
    description:
      "Bhadla Solar Park in Rajasthan is one of the world's largest, covering 14,000 acres.",
    funFact:
      "The Sun provides more energy in one hour than the world uses in a year!",
    location: "Rajasthan, India",
  },
  {
    id: "deepsea",
    title: "Deep Sea Creatures",
    icon: "fish",
    description:
      "76% of ocean animals are bioluminescent, creating light in the dark depths.",
    funFact:
      "Some fish evolved to see only blue light - the most common bioluminescent color!",
    location: "Deep Oceans",
  },
  {
    id: "aurora",
    title: "Northern Lights",
    icon: "stars",
    description:
      "Aurora Borealis occurs when Sun particles collide with Earth's atmosphere.",
    funFact: "The same phenomenon in the south is called Aurora Australis!",
    location: "Arctic Regions",
  },
  {
    id: "diwali",
    title: "Diwali Festival",
    icon: "lamp",
    description:
      "The Festival of Lights celebrates victory of light over darkness with diyas and lamps.",
    funFact: "India's electricity consumption increases by 20% during Diwali!",
    location: "India",
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// ICON COMPONENTS (Pure React SVG)
// ═══════════════════════════════════════════════════════════════════════════════

const IconChevronLeft: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const IconChevronRight: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const IconPlay: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const IconPause: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </svg>
);

const IconCheck: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconX: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconRefresh: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
);

const IconBook: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const IconTarget: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const IconGlobe: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════════
// ANIMATION COMPONENTS (Responsive)
// ═══════════════════════════════════════════════════════════════════════════════

const AnimatedSun: React.FC<{ size?: number; animationSpeed?: number }> = ({
  size = 100,
  animationSpeed = 1,
}) => {
  const [rotation, setRotation] = useState(0);
  const animationRef = useRef<number>();

  useEffect(() => {
    let lastTime = 0;
    const animate = (time: number) => {
      if (lastTime) {
        const delta = (time - lastTime) * 0.03 * animationSpeed;
        setRotation((prev) => (prev + delta) % 360);
      }
      lastTime = time;
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [animationSpeed]);

  const sunBodySize = size * 0.5;
  const rays = Array.from({ length: 12 }, (_, i) => i * 30);

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <div
        style={{
          position: "absolute",
          width: size * 0.95,
          height: size * 0.95,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,200,50,0.4) 0%, rgba(255,180,50,0.2) 45%, transparent 70%)",
        }}
      />
      {rays.map((angle, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: Math.max(2, size * 0.03),
            height: size * 0.28,
            background:
              "linear-gradient(to top, rgba(255,200,50,0.9), rgba(255,220,100,0.3), transparent)",
            left: "50%",
            top: "50%",
            transformOrigin: "center bottom",
            transform: `translateX(-50%) rotate(${angle + rotation}deg) translateY(-${sunBodySize * 0.55}px)`,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          width: sunBodySize,
          height: sunBodySize,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 35% 35%, #fff8dc, #ffed4a 25%, #ffd700 50%, #ffaa00 75%, #ff8c00)",
          boxShadow: `0 0 ${size * 0.15}px rgba(255,200,0,0.9), 0 0 ${size * 0.3}px rgba(255,150,0,0.5)`,
        }}
      />
    </div>
  );
};

const AnimatedMoon: React.FC<{ size?: number; isLit?: boolean }> = ({
  size = 70,
  isLit = true,
}) => (
  <div style={{ position: "relative", width: size, height: size }}>
    {isLit && (
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(200,200,255,0.3) 0%, transparent 70%)",
          transform: "scale(1.4)",
        }}
      />
    )}
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: isLit
          ? "radial-gradient(circle at 35% 35%, #ffffff, #e8e8f0 40%, #c0c0d0 80%, #a0a0b0)"
          : "radial-gradient(circle at 35% 35%, #4a4a5a, #3a3a4a 40%, #2a2a3a)",
        boxShadow: isLit
          ? `0 0 ${size * 0.25}px rgba(200,200,255,0.5)`
          : "none",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: size * 0.12,
          height: size * 0.12,
          top: "20%",
          left: "25%",
          borderRadius: "50%",
          backgroundColor: "rgba(150,150,150,0.3)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: size * 0.08,
          height: size * 0.08,
          top: "50%",
          left: "60%",
          borderRadius: "50%",
          backgroundColor: "rgba(150,150,150,0.2)",
        }}
      />
    </div>
  </div>
);

const AnimatedCandle: React.FC<{ size?: number }> = ({ size = 100 }) => {
  const [flame, setFlame] = useState({ height: 1, offset: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setFlame({
        height: 0.85 + Math.random() * 0.3,
        offset: (Math.random() - 0.5) * 3,
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  const candleHeight = size * 0.5;
  const flameHeight = size * 0.3;

  return (
    <div
      style={{
        position: "relative",
        width: size * 0.4,
        height: size,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: size * 0.8,
          height: size * 0.8,
          top: 0,
          background:
            "radial-gradient(circle, rgba(255,180,80,0.35) 0%, transparent 70%)",
        }}
      />
      <div
        style={{
          transform: `translateX(${flame.offset}px) scaleY(${flame.height})`,
          transformOrigin: "bottom center",
          transition: "transform 0.08s",
        }}
      >
        <div
          style={{
            width: Math.max(8, size * 0.12),
            height: flameHeight,
            borderRadius: "50%",
            background:
              "linear-gradient(to top, #ff6600, #ffaa00 40%, #ffdd00 70%, #fff 95%)",
            boxShadow:
              "0 0 15px rgba(255,150,0,0.9), 0 0 30px rgba(255,100,0,0.5)",
          }}
        />
      </div>
      <div
        style={{ width: 2, height: size * 0.05, backgroundColor: "#4a4a4a" }}
      />
      <div
        style={{
          width: Math.max(15, size * 0.25),
          height: candleHeight,
          borderRadius: 2,
          background: "linear-gradient(to right, #f5deb3, #ffe4c4, #f5deb3)",
        }}
      />
    </div>
  );
};

const AnimatedFireflies: React.FC<{ width?: number; height?: number }> = ({
  width = 280,
  height = 160,
}) => {
  const [fireflies, setFireflies] = useState<
    { id: number; x: number; y: number; glow: boolean }[]
  >([]);
  const numFireflies = Math.max(5, Math.floor(width / 35));

  useEffect(() => {
    setFireflies(
      Array.from({ length: numFireflies }, (_, i) => ({
        id: i,
        x: Math.random() * (width - 20) + 10,
        y: Math.random() * (height - 40) + 10,
        glow: Math.random() > 0.5,
      })),
    );

    const moveInterval = setInterval(() => {
      setFireflies((prev) =>
        prev.map((f) => ({
          ...f,
          x: Math.max(
            10,
            Math.min(width - 20, f.x + (Math.random() - 0.5) * 4),
          ),
          y: Math.max(
            10,
            Math.min(height - 40, f.y + (Math.random() - 0.5) * 4),
          ),
        })),
      );
    }, 150);

    const glowInterval = setInterval(() => {
      setFireflies((prev) =>
        prev.map((f) => ({ ...f, glow: Math.random() > 0.35 })),
      );
    }, 350);

    return () => {
      clearInterval(moveInterval);
      clearInterval(glowInterval);
    };
  }, [width, height, numFireflies]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: width,
        height,
        background: `linear-gradient(135deg, ${DS.colors.gradientStart}80 0%, ${DS.colors.primary}90 50%, ${DS.colors.gradientStart}80 100%)`,
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <svg
        viewBox={`0 0 ${width} 60`}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "35%",
          minHeight: 40,
        }}
      >
        <path
          d={`M0,60 L0,40 L${width * 0.1},18 L${width * 0.2},42 L${width * 0.3},12 L${width * 0.4},38 L${width * 0.5},22 L${width * 0.6},42 L${width * 0.7},15 L${width * 0.8},38 L${width * 0.9},28 L${width},45 L${width},60 Z`}
          fill="#0d1117"
        />
      </svg>
      {fireflies.map((f) => (
        <div
          key={f.id}
          style={{
            position: "absolute",
            left: `${(f.x / width) * 100}%`,
            top: `${(f.y / height) * 100}%`,
            width: Math.max(6, width * 0.025),
            height: Math.max(6, width * 0.025),
            borderRadius: "50%",
            background: f.glow
              ? "radial-gradient(circle, #ffff88, #aaff00)"
              : "#444",
            boxShadow: f.glow ? "0 0 8px #aaff00, 0 0 16px #88ff00" : "none",
            transition: "all 0.2s",
          }}
        />
      ))}
    </div>
  );
};

const AnimatedLEDBulb: React.FC<{ size?: number; isOn?: boolean }> = ({
  size = 80,
  isOn = true,
}) => (
  <div
    style={{
      position: "relative",
      width: size * 0.5,
      height: size,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}
  >
    {isOn && (
      <div
        style={{
          position: "absolute",
          top: 0,
          width: size * 0.6,
          height: size * 0.6,
          background:
            "radial-gradient(circle, rgba(255,255,255,0.45) 0%, rgba(200,220,255,0.25) 40%, transparent 70%)",
        }}
      />
    )}
    <div
      style={{
        width: Math.max(20, size * 0.35),
        height: size * 0.45,
        borderRadius: "50% 50% 45% 45%",
        background: isOn
          ? "radial-gradient(circle at 30% 30%, #fff, #e8f4ff 50%, #c8e0ff)"
          : "radial-gradient(circle at 30% 30%, #ddd, #bbb)",
        boxShadow: isOn ? "0 0 20px rgba(200,220,255,0.8)" : "none",
      }}
    />
    <div
      style={{
        width: size * 0.2,
        height: size * 0.06,
        backgroundColor: "#888",
      }}
    />
    <div
      style={{
        width: size * 0.25,
        height: size * 0.05,
        backgroundColor: "#666",
      }}
    />
    <div
      style={{
        width: size * 0.2,
        height: size * 0.05,
        backgroundColor: "#555",
        borderRadius: "0 0 4px 4px",
      }}
    />
  </div>
);

const LightTravelAnimation: React.FC<{
  width?: number;
  height?: number;
  animationSpeed?: number;
}> = ({ width = 400, height = 100, animationSpeed = 1 }) => {
  const [particlePos, setParticlePos] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticlePos((prev) => (prev + 2 * animationSpeed) % 100);
    }, 30);
    return () => clearInterval(interval);
  }, [animationSpeed]);

  const sourceSize = Math.max(25, Math.min(40, width * 0.1));
  const particleSize = Math.max(8, Math.min(12, width * 0.03));

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: width,
        height,
        background: `linear-gradient(135deg, ${DS.colors.gradientStart}40 0%, ${DS.colors.primary}60 100%)`,
        borderRadius: 12,
        overflow: "hidden",
        border: `1px solid ${DS.colors.lightPurple}`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "4%",
          top: "50%",
          transform: "translateY(-50%)",
          width: sourceSize,
          height: sourceSize,
          borderRadius: "50%",
          background: "radial-gradient(circle, #ffd700, #ffaa00)",
          boxShadow: "0 0 20px rgba(255,200,0,0.6)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "15%",
          right: "20%",
          top: "50%",
          height: Math.max(4, height * 0.06),
          transform: "translateY(-50%)",
          background:
            "linear-gradient(to right, rgba(255,220,100,0.6), rgba(255,220,100,0.2))",
          borderRadius: 3,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: `${15 + particlePos * 0.65}%`,
          top: "50%",
          transform: "translateY(-50%)",
          width: particleSize,
          height: particleSize,
          borderRadius: "50%",
          background: "#ffdd00",
          boxShadow: "0 0 10px rgba(255,220,0,0.8)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: "4%",
          top: "50%",
          transform: "translateY(-50%)",
          width: sourceSize * 1.2,
          height: sourceSize * 1.5,
          background: DS.colors.gray500,
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: Math.max(16, sourceSize * 0.6),
        }}
      >
        📖
      </div>
      <div
        style={{
          position: "absolute",
          top: 8,
          left: "50%",
          transform: "translateX(-50%)",
          color: "#93c5fd",
          fontSize: Math.max(10, Math.min(12, width * 0.03)),
          whiteSpace: "nowrap",
        }}
      >
        Light travels in a straight line →
      </div>
    </div>
  );
};

const MoonReflectionSimulator: React.FC<{
  width?: number;
  height?: number;
}> = ({ width = 400, height = 200 }) => {
  const [showRays, setShowRays] = useState(true);
  const sunSize = Math.max(40, Math.min(60, width * 0.15));
  const moonSize = Math.max(35, Math.min(50, width * 0.12));
  const earthSize = Math.max(35, Math.min(50, width * 0.12));

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: width,
        height,
        background: `linear-gradient(135deg, ${DS.colors.gradientStart}60 0%, ${DS.colors.primary}80 50%, ${DS.colors.gradientStart}60 100%)`,
        borderRadius: 12,
        overflow: "hidden",
        border: `1px solid ${DS.colors.lightPurple}`,
      }}
    >
      {Array.from({ length: Math.min(20, Math.floor(width / 20)) }).map(
        (_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 50}%`,
              width: 2,
              height: 2,
              borderRadius: "50%",
              backgroundColor: "#fff",
              opacity: 0.3 + Math.random() * 0.5,
            }}
          />
        ),
      )}
      <div
        style={{ position: "absolute", left: -sunSize / 2, top: height * 0.25 }}
      >
        <AnimatedSun size={sunSize} />
      </div>
      {showRays && (
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <defs>
            <linearGradient id="rayGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,220,100,0.5)" />
              <stop offset="100%" stopColor="rgba(255,220,100,0.1)" />
            </linearGradient>
          </defs>
          <line
            x1="0"
            y1={height * 0.35}
            x2={width * 0.68}
            y2={height * 0.28}
            stroke="url(#rayGrad)"
            strokeWidth={Math.max(3, width * 0.012)}
          />
          <line
            x1="0"
            y1={height * 0.45}
            x2={width * 0.68}
            y2={height * 0.38}
            stroke="url(#rayGrad)"
            strokeWidth={Math.max(2, width * 0.01)}
          />
          <line
            x1={width * 0.72}
            y1={height * 0.35}
            x2={width * 0.9}
            y2={height * 0.85}
            stroke="rgba(200,200,255,0.3)"
            strokeWidth={Math.max(2, width * 0.01)}
          />
        </svg>
      )}
      <div
        style={{ position: "absolute", right: width * 0.1, top: height * 0.1 }}
      >
        <AnimatedMoon size={moonSize} isLit={true} />
      </div>
      <div
        style={{
          position: "absolute",
          right: width * 0.08,
          bottom: height * 0.1,
          width: earthSize,
          height: earthSize,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${DS.colors.primary} 0%, ${DS.colors.accent} 50%, ${DS.colors.primary} 100%)`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "40%",
            height: "30%",
            background: "#22c55e",
            borderRadius: "50%",
            top: "15%",
            left: "10%",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "30%",
            height: "40%",
            background: "#22c55e",
            borderRadius: "50%",
            bottom: "10%",
            right: "15%",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          top: 5,
          left: 5,
          fontSize: Math.max(8, Math.min(10, width * 0.025)),
          color: "#fcd34d",
          background: "rgba(0,0,0,0.4)",
          padding: "2px 6px",
          borderRadius: 4,
        }}
      >
        ☀️ Sun
      </div>
      <div
        style={{
          position: "absolute",
          top: 5,
          right: 5,
          fontSize: Math.max(8, Math.min(10, width * 0.025)),
          color: "#93c5fd",
          background: "rgba(0,0,0,0.4)",
          padding: "2px 6px",
          borderRadius: 4,
        }}
      >
        🌙 Moon
      </div>
      <button
        onClick={() => setShowRays(!showRays)}
        style={{
          position: "absolute",
          bottom: 5,
          left: 5,
          fontSize: Math.max(8, Math.min(10, width * 0.025)),
          padding: "4px 8px",
          background: DS.colors.primary,
          color: DS.colors.white,
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        {showRays ? "🔆 Hide" : "💫 Show"} Rays
      </button>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const SourcesOfLight: React.FC<SourcesOfLightProps> = ({
  props = {},
  setStepDetails,
  stopAutoNext,
  setStopAutoNext,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    width = "100%",
    height = "auto",
    minWidth = 300,
    maxWidth = 1200,
    initialMode = "learn",
    showModeSelector = true,
    enabledModes = ["learn", "practice", "real_world"],
    showNavigation = true,
    showPlayPause = true,
    showStepIndicator = true,
    initialStep = 0,
    animationSpeed = 1,
    autoPlayDuration = 8000,
    themeColor = DS.colors.primary,
    darkMode = false,
    responsive = true,
    additionalProps = {},
  } = props;

  const {
    learnContent = defaultLearnContent,
    quizQuestions = defaultQuizQuestions,
    realWorldExamples = defaultRealWorldExamples,
    showAnimations = true,
  } = additionalProps;

  const { width: containerWidth, breakpoint } = useResponsive(containerRef);

  // Responsive values
  const isMobile = breakpoint === "xs" || breakpoint === "sm";
  const isTablet = breakpoint === "md";
  const fontSize = {
    title: isMobile ? 18 : isTablet ? 20 : 24,
    subtitle: isMobile ? 10 : 12,
    heading: isMobile ? 16 : isTablet ? 18 : 20,
    body: isMobile ? 13 : 14,
    small: isMobile ? 11 : 12,
    tiny: isMobile ? 10 : 11,
  };
  const spacing = {
    padding: isMobile ? 12 : isTablet ? 16 : 20,
    gap: isMobile ? 6 : 8,
    cardPadding: isMobile ? 12 : isTablet ? 16 : 20,
  };
  const animationSize = {
    sun: isMobile ? 50 : isTablet ? 60 : 70,
    moon: isMobile ? 50 : isTablet ? 60 : 70,
    candle: isMobile ? 70 : isTablet ? 80 : 90,
    led: isMobile ? 60 : isTablet ? 70 : 80,
    firefliesHeight: isMobile ? 100 : isTablet ? 120 : 140,
  };

  // State
  const [mode, setMode] = useState<ModeType>(initialMode);
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fadeIn, setFadeIn] = useState(true);

  // Quiz state
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(
    new Array(quizQuestions.length).fill(false),
  );
  const [quizComplete, setQuizComplete] = useState(false);

  const autoPlayRef = useRef<NodeJS.Timeout>();

  const getCurrentSteps = useCallback(() => {
    switch (mode) {
      case "learn":
        return learnContent;
      case "practice":
        return quizQuestions;
      case "real_world":
        return realWorldExamples;
      default:
        return learnContent;
    }
  }, [mode, learnContent, quizQuestions, realWorldExamples]);

  const totalSteps = getCurrentSteps().length;

  useEffect(() => {
    if (setStepDetails) {
      const steps = getCurrentSteps();
      setStepDetails({
        currentStep,
        totalSteps,
        mode,
        stepTitle: steps[currentStep]?.title || "",
      });
    }
  }, [currentStep, mode, totalSteps, setStepDetails, getCurrentSteps]);

  useEffect(() => {
    if (isPlaying && !stopAutoNext && autoPlayDuration > 0) {
      autoPlayRef.current = setTimeout(() => {
        if (currentStep < totalSteps - 1) {
          handleNext();
        } else {
          setIsPlaying(false);
        }
      }, autoPlayDuration);
    }
    return () => {
      if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
    };
  }, [isPlaying, currentStep, totalSteps, stopAutoNext, autoPlayDuration]);

  useEffect(() => {
    const styleId = "sources-of-light-keyframes";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        @keyframes sol-fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes sol-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const handleNext = () => {
    setFadeIn(false);
    setTimeout(() => {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
      setFadeIn(true);
      if (mode === "practice") {
        setSelectedAnswer(null);
        setShowExplanation(false);
      }
    }, 200);
  };

  const handlePrev = () => {
    setFadeIn(false);
    setTimeout(() => {
      setCurrentStep((prev) => Math.max(prev - 1, 0));
      setFadeIn(true);
      if (mode === "practice") {
        setSelectedAnswer(null);
        setShowExplanation(false);
      }
    }, 200);
  };

  const handleModeChange = (newMode: ModeType) => {
    setFadeIn(false);
    setTimeout(() => {
      setMode(newMode);
      setCurrentStep(0);
      setFadeIn(true);
      setIsPlaying(false);
      if (newMode === "practice") {
        setSelectedAnswer(null);
        setShowExplanation(false);
        setScore(0);
        setAnsweredQuestions(new Array(quizQuestions.length).fill(false));
        setQuizComplete(false);
      }
    }, 200);
  };

  const handleAnswerSelect = (index: number) => {
    if (answeredQuestions[currentStep]) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    const newAnswered = [...answeredQuestions];
    newAnswered[currentStep] = true;
    setAnsweredQuestions(newAnswered);
    if (index === quizQuestions[currentStep].correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleQuizNext = () => {
    if (currentStep < quizQuestions.length - 1) {
      handleNext();
    } else {
      setQuizComplete(true);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setAnsweredQuestions(new Array(quizQuestions.length).fill(false));
    setQuizComplete(false);
  };

  const renderAnimation = (type: string) => {
    if (!showAnimations) return null;
    const animWidth = Math.min(containerWidth - 40, 400);
    const animHeight = isMobile ? 80 : 100;

    switch (type) {
      case "lightTravel":
        return (
          <LightTravelAnimation
            width={animWidth}
            height={animHeight}
            animationSpeed={animationSpeed}
          />
        );
      case "luminous":
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-end",
              gap: isMobile ? 15 : 30,
              flexWrap: "wrap",
              padding: "10px 0",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ paddingTop: 10 }}>
                <AnimatedSun
                  size={animationSize.sun}
                  animationSpeed={animationSpeed}
                />
              </div>
              <div
                style={{
                  fontSize: fontSize.tiny,
                  color: DS.colors.accent,
                  marginTop: 5,
                }}
              >
                Sun
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <AnimatedCandle size={animationSize.candle} />
              <div
                style={{
                  fontSize: fontSize.tiny,
                  color: DS.colors.accent,
                  marginTop: 5,
                }}
              >
                Candle
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <AnimatedLEDBulb size={animationSize.led} isOn={true} />
              <div
                style={{
                  fontSize: fontSize.tiny,
                  color: DS.colors.primary,
                  marginTop: 5,
                }}
              >
                LED
              </div>
            </div>
          </div>
        );
      case "nonLuminous":
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: isMobile ? 20 : 40,
              flexWrap: "wrap",
              padding: "15px 0",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <AnimatedMoon size={animationSize.moon} isLit={true} />
              <div
                style={{
                  fontSize: fontSize.tiny,
                  color: DS.colors.primary,
                  marginTop: 8,
                }}
              >
                Moon
              </div>
            </div>
            <div style={{ textAlign: "center", fontSize: isMobile ? 35 : 50 }}>
              🪞
              <div
                style={{
                  fontSize: fontSize.tiny,
                  color: DS.colors.gray900,
                  marginTop: 8,
                }}
              >
                Mirror
              </div>
            </div>
            <div style={{ textAlign: "center", fontSize: isMobile ? 35 : 50 }}>
              📖
              <div
                style={{
                  fontSize: fontSize.tiny,
                  color: DS.colors.gray900,
                  marginTop: 8,
                }}
              >
                Book
              </div>
            </div>
          </div>
        );
      case "natural":
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: isMobile ? 12 : 20,
                paddingTop: 10,
              }}
            >
              <AnimatedSun
                size={isMobile ? 40 : 55}
                animationSpeed={animationSpeed}
              />
              <span style={{ fontSize: isMobile ? 22 : 30 }}>⭐</span>
              <span style={{ fontSize: isMobile ? 22 : 30 }}>⚡</span>
            </div>
            <AnimatedFireflies
              width={Math.min(animWidth, 280)}
              height={animationSize.firefliesHeight}
            />
          </div>
        );
      case "artificial":
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-end",
              gap: isMobile ? 12 : 25,
              flexWrap: "wrap",
              padding: "10px 0",
            }}
          >
            <div style={{ textAlign: "center", fontSize: isMobile ? 28 : 40 }}>
              🔥
              <div
                style={{
                  fontSize: fontSize.tiny,
                  color: "#fb923c",
                  marginTop: 5,
                }}
              >
                Fire
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <AnimatedCandle size={isMobile ? 65 : 85} />
              <div
                style={{
                  fontSize: fontSize.tiny,
                  color: "#fcd34d",
                  marginTop: 5,
                }}
              >
                Candle
              </div>
            </div>
            <div style={{ textAlign: "center", fontSize: isMobile ? 28 : 40 }}>
              🏮
              <div
                style={{
                  fontSize: fontSize.tiny,
                  color: DS.colors.accent,
                  marginTop: 5,
                }}
              >
                Lamp
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <AnimatedLEDBulb size={isMobile ? 60 : 75} isOn={true} />
              <div
                style={{
                  fontSize: fontSize.tiny,
                  color: DS.colors.primary,
                  marginTop: 5,
                }}
              >
                LED
              </div>
            </div>
          </div>
        );
      case "moonReflection":
        return (
          <MoonReflectionSimulator
            width={animWidth}
            height={isMobile ? 150 : 180}
          />
        );
      default:
        return null;
    }
  };

  const getModeColors = (m: ModeType, isActive: boolean) => {
    const colors = {
      learn: { bg: DS.colors.primary, light: DS.colors.lightPurple + "99" },
      practice: { bg: DS.colors.accent, light: DS.colors.lightOrange + "99" },
      real_world: { bg: DS.colors.gradientStart, light: DS.colors.lightPurple + "99" },
    };
    return isActive
      ? { background: colors[m].bg, color: DS.colors.white }
      : {
          background: colors[m].light,
          color: darkMode ? DS.colors.white : DS.colors.gray900,
        };
  };

  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      width: typeof width === "number" ? width : width,
      height: typeof height === "number" ? height : height,
      minWidth,
      maxWidth,
      minHeight: 400,
      background: darkMode
        ? DS.gradient
        : DS.colors.gray100,
      borderRadius: isMobile ? 12 : 16,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      fontFamily: DS.font,
      color: darkMode ? DS.colors.white : DS.colors.gray900,
      margin: "0 auto",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    },
    header: {
      padding: `${spacing.padding * 0.8}px ${spacing.padding}px`,
      textAlign: "center",
      background: darkMode ? DS.colors.gradientStart : DS.gradient,
      borderBottom: `1px solid ${darkMode ? DS.colors.lightPurple + "40" : "rgba(255,255,255,0.3)"}`,
    },
    title: {
      fontSize: fontSize.title,
      fontWeight: 700,
      color: DS.colors.white,
      margin: 0,
    },
    subtitle: {
      fontSize: fontSize.subtitle,
      color: "rgba(255,255,255,0.95)",
      marginTop: 4,
    },
    modeSelector: {
      display: "flex",
      justifyContent: "center",
      gap: spacing.gap,
      padding: `${spacing.padding * 0.6}px ${spacing.padding}px`,
      flexWrap: "wrap",
    },
    modeButton: {
      padding: isMobile ? "6px 10px" : "8px 16px",
      borderRadius: isMobile ? 8 : 10,
      border: "none",
      cursor: "pointer",
      fontWeight: 600,
      fontSize: isMobile ? 11 : 13,
      display: "flex",
      alignItems: "center",
      gap: isMobile ? 4 : 6,
      transition: "all 0.3s ease",
      whiteSpace: "nowrap",
    },
    content: {
      flex: 1,
      overflow: "auto",
      padding: spacing.padding,
    },
    contentInner: {
      opacity: fadeIn ? 1 : 0,
      transform: fadeIn ? "translateY(0)" : "translateY(10px)",
      transition: "all 0.3s ease",
    },
    card: {
      background: darkMode ? DS.colors.gradientStart + "40" : DS.colors.white,
      borderRadius: isMobile ? 10 : 12,
      padding: spacing.cardPadding,
      backdropFilter: "blur(10px)",
      border: `1px solid ${DS.colors.gray300}`,
      boxShadow: "0 4px 12px rgba(74,77,201,0.08)",
    },
    animationBox: {
      background: darkMode ? DS.colors.gradientStart + "20" : DS.colors.lightPurple + "40",
      borderRadius: isMobile ? 8 : 10,
      padding: isMobile ? 10 : 15,
      marginBottom: isMobile ? 12 : 15,
      display: "flex",
      justifyContent: "center",
      overflow: "hidden",
      border: `1px solid ${DS.colors.lightPurple}`,
    },
    keyPointsBox: {
      background: DS.colors.lightOrange,
      border: `1px solid ${DS.colors.accent}`,
      borderRadius: isMobile ? 8 : 10,
      padding: isMobile ? 10 : 15,
      marginTop: isMobile ? 12 : 15,
    },
    navigation: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: `${spacing.padding * 0.6}px ${spacing.padding}px`,
      borderTop: `1px solid ${darkMode ? DS.colors.lightPurple + "40" : DS.colors.gray300}`,
      background: darkMode ? DS.colors.gradientStart + "20" : DS.colors.white,
      flexWrap: "wrap",
      gap: 8,
    },
    navButton: {
      padding: isMobile ? "6px 10px" : "8px 16px",
      borderRadius: 8,
      border: "none",
      cursor: "pointer",
      fontWeight: 500,
      fontSize: isMobile ? 11 : 13,
      display: "flex",
      alignItems: "center",
      gap: 4,
      transition: "all 0.2s ease",
    },
    stepIndicator: {
      fontSize: fontSize.small,
      color: darkMode ? DS.colors.lightPurple : DS.colors.gray900,
    },
    quizOption: {
      width: "100%",
      padding: isMobile ? "10px 12px" : "12px 16px",
      borderRadius: isMobile ? 8 : 10,
      border: "2px solid transparent",
      cursor: "pointer",
      fontWeight: 500,
      fontSize: fontSize.body,
      textAlign: "left" as const,
      display: "flex",
      alignItems: "center",
      gap: isMobile ? 8 : 10,
      transition: "all 0.2s ease",
      marginBottom: 8,
    },
    optionLetter: {
      width: isMobile ? 24 : 28,
      height: isMobile ? 24 : 28,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 700,
      fontSize: isMobile ? 11 : 13,
      flexShrink: 0,
    },
  };

  return (
    <div ref={containerRef} style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>✨ Sources of Light ✨</h1>
        <p style={styles.subtitle}>Chapter 11.1 | NCERT Curiosity - Grade 7</p>
      </div>

      {/* Mode Selector */}
      {showModeSelector && (
        <div style={styles.modeSelector}>
          {enabledModes.includes("learn") && (
            <button
              onClick={() => handleModeChange("learn")}
              style={{
                ...styles.modeButton,
                ...getModeColors("learn", mode === "learn"),
              }}
            >
              <IconBook size={isMobile ? 14 : 16} /> {!isMobile && "Learn"}
            </button>
          )}
          {enabledModes.includes("practice") && (
            <button
              onClick={() => handleModeChange("practice")}
              style={{
                ...styles.modeButton,
                ...getModeColors("practice", mode === "practice"),
              }}
            >
              <IconTarget size={isMobile ? 14 : 16} /> {!isMobile && "Practice"}
            </button>
          )}
          {enabledModes.includes("real_world") && (
            <button
              onClick={() => handleModeChange("real_world")}
              style={{
                ...styles.modeButton,
                ...getModeColors("real_world", mode === "real_world"),
              }}
            >
              <IconGlobe size={isMobile ? 14 : 16} />{" "}
              {!isMobile && "Real World"}
            </button>
          )}
        </div>
      )}

      {/* Content Area */}
      <div style={styles.content}>
        <div style={styles.contentInner}>
          {/* LEARN MODE */}
          {mode === "learn" && (
            <div style={styles.card}>
              <h2
                style={{
                  fontSize: fontSize.heading,
                  fontWeight: 700,
                  color: DS.colors.primary,
                  marginBottom: isMobile ? 10 : 15,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <IconBook size={isMobile ? 18 : 22} color={DS.colors.primary} />
                {learnContent[currentStep]?.title}
              </h2>

              <div style={styles.animationBox}>
                {renderAnimation(learnContent[currentStep]?.animationType)}
              </div>

              <div style={{ marginBottom: isMobile ? 12 : 15 }}>
                {learnContent[currentStep]?.content.map((paragraph, i) => (
                  <p
                    key={i}
                    style={{
                      marginBottom: 10,
                      lineHeight: 1.6,
                      color: DS.colors.gray900,
                      fontSize: fontSize.body,
                    }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <div style={styles.keyPointsBox}>
                <h3
                  style={{
                    fontSize: fontSize.body,
                    fontWeight: 700,
                  color: DS.colors.gradientStart,
                  marginBottom: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                🔑 Key Points
                </h3>
                <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
                  {learnContent[currentStep]?.keyPoints.map((point, i) => (
                    <li
                      key={i}
                      style={{
                        marginBottom: 6,
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 8,
                        color: DS.colors.gray900,
                        fontSize: fontSize.small,
                      }}
                    >
                      <span style={{ color: DS.colors.accent }}>✓</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* PRACTICE MODE */}
          {mode === "practice" && !quizComplete && (
            <div style={styles.card}>
              <h2
                style={{
                  fontSize: fontSize.heading,
                  fontWeight: 700,
                  color: DS.colors.primary,
                  marginBottom: 5,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <IconTarget size={isMobile ? 18 : 22} color={DS.colors.primary} />
                Practice Quiz
              </h2>
              <p
                style={{
                  fontSize: fontSize.small,
                  color: darkMode ? DS.colors.lightPurple : DS.colors.gray900,
                  marginBottom: isMobile ? 12 : 15,
                }}
              >
                Question {currentStep + 1} of {quizQuestions.length} • Score:{" "}
                {score}/{answeredQuestions.filter(Boolean).length}
              </p>

              <div
                style={{
                  height: 6,
                  background: darkMode ? DS.colors.gradientStart + "40" : DS.colors.gray300,
                  borderRadius: 3,
                  marginBottom: isMobile ? 15 : 20,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${((currentStep + (showExplanation ? 1 : 0)) / quizQuestions.length) * 100}%`,
                    background: DS.gradientPrimary,
                    borderRadius: 3,
                    transition: "width 0.5s ease",
                  }}
                />
              </div>

              <div
                style={{
                  background: darkMode
                    ? DS.colors.gradientStart + "30"
                    : DS.colors.lightPurple + "30",
                  borderRadius: isMobile ? 8 : 10,
                  padding: isMobile ? 12 : 15,
                  marginBottom: isMobile ? 12 : 15,
                }}
              >
                <h3
                  style={{
                    fontSize: fontSize.body,
                    fontWeight: 500,
                    marginBottom: isMobile ? 12 : 15,
                    color: DS.colors.gray900,
                  }}
                >
                  {quizQuestions[currentStep]?.question}
                </h3>

                {quizQuestions[currentStep]?.options.map((option, i) => {
                  const isCorrect =
                    i === quizQuestions[currentStep].correctAnswer;
                  const isSelected = i === selectedAnswer;
                  let optionStyle: React.CSSProperties = {
                    ...styles.quizOption,
                    background: darkMode ? DS.colors.gradientStart + "40" : DS.colors.gray100,
                    color: darkMode ? DS.colors.white : DS.colors.gray900,
                  };
                  let letterStyle: React.CSSProperties = {
                    ...styles.optionLetter,
                    background: darkMode ? DS.colors.lightPurple : DS.colors.gray300,
                    color: darkMode ? DS.colors.white : DS.colors.gray900,
                  };

                  if (showExplanation) {
                    if (isCorrect) {
                      optionStyle = {
                        ...optionStyle,
                        background: DS.colors.lightOrange,
                        borderColor: DS.colors.accent,
                      };
                      letterStyle = {
                        ...letterStyle,
                        background: DS.colors.success,
                        color: DS.colors.white,
                      };
                    } else if (isSelected) {
                      optionStyle = {
                        ...optionStyle,
                        background: "rgba(239,68,68,0.2)",
                        borderColor: DS.colors.error,
                      };
                      letterStyle = {
                        ...letterStyle,
                        background: DS.colors.error,
                        color: DS.colors.white,
                      };
                    }
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswerSelect(i)}
                      disabled={showExplanation}
                      style={{
                        ...optionStyle,
                        opacity:
                          showExplanation && !isCorrect && !isSelected
                            ? 0.5
                            : 1,
                      }}
                    >
                      <span style={letterStyle}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span style={{ flex: 1 }}>{option}</span>
                      {showExplanation && isCorrect && (
                        <IconCheck size={isMobile ? 16 : 20} color={DS.colors.success} />
                      )}
                      {showExplanation && isSelected && !isCorrect && (
                        <IconX size={isMobile ? 16 : 20} color={DS.colors.error} />
                      )}
                    </button>
                  );
                })}
              </div>

              {showExplanation && (
                <div
                  style={{
                    padding: isMobile ? 12 : 15,
                    borderRadius: isMobile ? 8 : 10,
                    marginBottom: isMobile ? 12 : 15,
                    background:
                      selectedAnswer ===
                      quizQuestions[currentStep].correctAnswer
                        ? DS.colors.lightOrange
                        : "rgba(251,146,60,0.15)",
                    border: `1px solid ${selectedAnswer === quizQuestions[currentStep].correctAnswer ? DS.colors.accent : "rgba(251,146,60,0.4)"}`,
                  }}
                >
                  <p
                    style={{
                      fontWeight: 700,
                      marginBottom: 5,
                      color: DS.colors.gray900,
                      fontSize: fontSize.body,
                    }}
                  >
                    {selectedAnswer === quizQuestions[currentStep].correctAnswer
                      ? "🎉 Correct!"
                      : "💡 Not quite right"}
                  </p>
                  <p
                    style={{
                      fontSize: fontSize.small,
                      color: DS.colors.gray900,
                    }}
                  >
                    {quizQuestions[currentStep].explanation}
                  </p>
                </div>
              )}

              {showExplanation && (
                <button
                  onClick={handleQuizNext}
                  style={{
                    width: "100%",
                    padding: isMobile ? "10px" : "12px",
                    borderRadius: isMobile ? 8 : 10,
                    border: "none",
                    background: DS.gradientPrimary,
                    color: DS.colors.white,
                    fontWeight: 700,
                    fontSize: fontSize.body,
                    cursor: "pointer",
                  }}
                >
                  {currentStep < quizQuestions.length - 1
                    ? "Next Question →"
                    : "See Results 🏆"}
                </button>
              )}
            </div>
          )}

          {/* Quiz Complete */}
          {mode === "practice" && quizComplete && (
            <div
              style={{
                ...styles.card,
                textAlign: "center",
                padding: isMobile ? 20 : 30,
              }}
            >
              <div style={{ fontSize: isMobile ? 45 : 60, marginBottom: 15 }}>
                {score === quizQuestions.length
                  ? "🏆"
                  : score >= 3
                    ? "⭐"
                    : "📚"}
              </div>
              <h2
                style={{
                  fontSize: isMobile ? 20 : 24,
                  fontWeight: 700,
                  color: "#fcd34d",
                  marginBottom: 10,
                }}
              >
                Quiz Complete!
              </h2>
              <div
                style={{
                  fontSize: isMobile ? 36 : 48,
                  fontWeight: 700,
                  color: DS.colors.gray900,
                  marginBottom: 15,
                }}
              >
                {score} / {quizQuestions.length}
              </div>
              <p
                style={{
                  color: DS.colors.gray900,
                  marginBottom: 25,
                  fontSize: fontSize.body,
                }}
              >
                {score === 5
                  ? "🌟 Perfect! You're a Light Expert!"
                  : score >= 4
                    ? "👏 Excellent work!"
                    : score >= 3
                      ? "👍 Good job!"
                      : "📖 Keep learning!"}
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={resetQuiz}
                  style={{
                    ...styles.navButton,
                    background: DS.colors.primary,
                    color: DS.colors.white,
                  }}
                >
                  <IconRefresh size={isMobile ? 14 : 16} /> Try Again
                </button>
                <button
                  onClick={() => handleModeChange("learn")}
                  style={{
                    ...styles.navButton,
                    background: DS.colors.accent,
                    color: DS.colors.white,
                  }}
                >
                  <IconBook size={isMobile ? 14 : 16} /> Review
                </button>
              </div>
            </div>
          )}

          {/* REAL WORLD MODE */}
          {mode === "real_world" && (
            <div style={styles.card}>
              <h2
                style={{
                  fontSize: fontSize.heading,
                  fontWeight: 700,
                  color: DS.colors.gradientStart,
                  marginBottom: isMobile ? 10 : 15,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <IconGlobe size={isMobile ? 18 : 22} color={DS.colors.gradientStart} />
                Real World Examples
              </h2>

              <div
                style={{
                  background: `linear-gradient(135deg, ${DS.colors.lightPurple}60 0%, ${DS.colors.lightOrange}80 100%)`,
                  borderRadius: isMobile ? 10 : 12,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{ padding: isMobile ? 15 : 25, textAlign: "center" }}
                >
                  <div
                    style={{ fontSize: isMobile ? 40 : 50, marginBottom: 10 }}
                  >
                    {realWorldExamples[currentStep]?.icon === "bulb" && "💡"}
                    {realWorldExamples[currentStep]?.icon === "firefly" && "🪲"}
                    {realWorldExamples[currentStep]?.icon === "sun" && "☀️"}
                    {realWorldExamples[currentStep]?.icon === "fish" && "🐟"}
                    {realWorldExamples[currentStep]?.icon === "stars" && "🌌"}
                    {realWorldExamples[currentStep]?.icon === "lamp" && "🪔"}
                  </div>
                  <h3
                    style={{
                      fontSize: isMobile ? 16 : 18,
                      fontWeight: 700,
                  color: DS.colors.gray900,
                  marginBottom: 5,
                    }}
                  >
                    {realWorldExamples[currentStep]?.title}
                  </h3>
                  {realWorldExamples[currentStep]?.location && (
                    <p
                      style={{
                        fontSize: fontSize.tiny,
                        color: DS.colors.gradientStart,
                        marginBottom: 0,
                      }}
                    >
                      📍 {realWorldExamples[currentStep].location}
                    </p>
                  )}
                </div>
                <div
                  style={{
                    padding: `0 ${isMobile ? 15 : 25}px ${isMobile ? 15 : 25}px`,
                  }}
                >
                  <p
                    style={{
                      lineHeight: 1.6,
                      color: DS.colors.gray900,
                      marginBottom: 15,
                      fontSize: fontSize.body,
                    }}
                  >
                    {realWorldExamples[currentStep]?.description}
                  </p>
                  <div
                    style={{
                    background: DS.colors.lightOrange,
                    border: `1px solid ${DS.colors.accent}`,
                      borderRadius: isMobile ? 8 : 10,
                      padding: isMobile ? 10 : 12,
                    }}
                  >
                    <p
                      style={{
                        fontWeight: 700,
                        color: DS.colors.gradientStart,
                        marginBottom: 5,
                        fontSize: fontSize.small,
                      }}
                    >
                      💡 Fun Fact!
                    </p>
                    <p
                      style={{
                        fontSize: fontSize.small,
                        color: DS.colors.gray900,
                        margin: 0,
                      }}
                    >
                      {realWorldExamples[currentStep]?.funFact}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      {showNavigation && (
        <div style={styles.navigation}>
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            style={{
              ...styles.navButton,
              background:
                currentStep === 0
                  ? DS.colors.gray300
                  : themeColor,
              color:
                currentStep === 0 ? DS.colors.gray500 : DS.colors.white,
              cursor: currentStep === 0 ? "not-allowed" : "pointer",
            }}
          >
            <IconChevronLeft size={isMobile ? 14 : 18} /> {!isMobile && "Prev"}
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: isMobile ? 8 : 15,
            }}
          >
            {showPlayPause && mode === "learn" && !isMobile && (
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                style={{
                  ...styles.navButton,
                  background: DS.colors.lightPurple,
                  color: DS.colors.gradientStart,
                  padding: "8px 12px",
                }}
              >
                {isPlaying ? <IconPause size={18} /> : <IconPlay size={18} />}
              </button>
            )}
            {showStepIndicator && (
              <span style={styles.stepIndicator}>
                {currentStep + 1} / {totalSteps}
              </span>
            )}
          </div>

          <button
            onClick={
              mode === "practice" && showExplanation
                ? handleQuizNext
                : handleNext
            }
            disabled={
              currentStep === totalSteps - 1 &&
              !(mode === "practice" && showExplanation)
            }
            style={{
              ...styles.navButton,
              background:
                  currentStep === totalSteps - 1 &&
                !(mode === "practice" && showExplanation)
                  ? DS.colors.gray300
                  : themeColor,
              color:
                currentStep === totalSteps - 1 &&
                !(mode === "practice" && showExplanation)
                  ? DS.colors.gray500
                  : DS.colors.white,
              cursor:
                currentStep === totalSteps - 1 &&
                !(mode === "practice" && showExplanation)
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {!isMobile && "Next"} <IconChevronRight size={isMobile ? 14 : 18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default SourcesOfLight;
