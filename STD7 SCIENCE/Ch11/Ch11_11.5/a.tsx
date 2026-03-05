// @ts-ignore
import React, { useState, useEffect } from "react";

type ModeType = "learn" | "practice" | "real_world" | "hands_on";

interface StepDetails {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  stepDescription: string;
}

interface ReflectionAdditionalProps {
  initialAngle?: number;
  showGrid?: boolean;
  lightColor?: string;
  mirrorCount?: number;
  showAngles?: boolean;
  autoRotate?: boolean;
}

interface ReflectionOfLightConfig {
  width?: number;
  height?: number;
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
  additionalProps?: ReflectionAdditionalProps;
}

interface ReflectionOfLightProps {
  props?: ReflectionOfLightConfig;
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

interface StepData {
  id: number;
  mode: ModeType;
  title: string;
  description: string;
}

const ReflectionOfLight: React.FC<ReflectionOfLightProps> = ({
  props,
  setStepDetails,
  stopAutoNext,
}) => {
  const config: ReflectionOfLightConfig = props || {};
  const {
    initialMode = "learn",
    showModeSelector = true,
    enabledModes = ["learn", "practice", "real_world", "hands_on"],
    showNavigation = true,
    showPlayPause = true,
    showStepIndicator = true,
    initialStep = 1,
    filterSteps,
    animationSpeed = 1,
    autoPlayDuration = 8000,
    themeColor = "#4A4DC9",
    darkMode = false,
    additionalProps = {},
  } = config;

  // Responsive state
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 800,
  );
  const [currentMode, setCurrentMode] = useState<ModeType>(initialMode);
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mirrorAngle, setMirrorAngle] = useState(
    additionalProps.initialAngle || 0,
  );
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [practiceScore, setPracticeScore] = useState(0);
  const [handsOnCompleted, setHandsOnCompleted] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  // Responsive dimensions
  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;
  const isDesktop = windowWidth >= 1024;

  const containerWidth =
    windowWidth < 800 ? windowWidth - 32 : Math.min(800, windowWidth - 64);
  const svgW = containerWidth - (isMobile ? 32 : 64);
  const svgH = isMobile ? 280 : isTablet ? 320 : 380;

  const lightColor = additionalProps.lightColor || "#fbbf24";

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Singularity design: load Poppins font
  useEffect(() => {
    if (typeof document === "undefined") return;
    const id = "singularity-poppins-font";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
  }, []);

  const allSteps: StepData[] = [
    {
      id: 1,
      mode: "learn",
      title: "What is Reflection of Light?",
      description:
        "When light hits a shiny surface like a mirror, it bounces back. This bouncing back of light is called reflection.",
    },
    {
      id: 2,
      mode: "learn",
      title: "How Does Light Travel?",
      description:
        "Light travels in straight lines called rays. When it hits a mirror, it changes direction but still travels in a straight line.",
    },
    {
      id: 3,
      mode: "learn",
      title: "Laws of Reflection",
      description:
        "The angle at which light hits the mirror (angle of incidence) equals the angle at which it bounces back (angle of reflection). Both angles are measured from the normal line.",
    },
    {
      id: 4,
      mode: "learn",
      title: "Mirror Images",
      description:
        "When you look in a mirror, you see your reflection. The image appears to be behind the mirror at the same distance as you are in front of it.",
    },
    {
      id: 5,
      mode: "practice",
      title: "Question 1: What is Reflection?",
      description: "What happens when light hits a mirror?",
    },
    {
      id: 6,
      mode: "practice",
      title: "Question 2: Light Travel",
      description: "How does light travel?",
    },
    {
      id: 7,
      mode: "practice",
      title: "Question 3: Angle of Reflection",
      description:
        "If light hits a mirror at 30° from the normal, at what angle does it reflect?",
    },
    {
      id: 8,
      mode: "real_world",
      title: "Mirrors in Daily Life",
      description:
        "We use mirrors every day - bathroom mirrors, car rearview mirrors, dental mirrors, and even smartphone screens!",
    },
    {
      id: 9,
      mode: "real_world",
      title: "Periscopes",
      description:
        "Periscopes use two mirrors at 45° angles to help submarines see above water!",
    },
    {
      id: 10,
      mode: "real_world",
      title: "Kaleidoscopes",
      description:
        "Kaleidoscopes use multiple mirrors arranged in a triangle to create beautiful symmetrical patterns.",
    },
    {
      id: 11,
      mode: "hands_on",
      title: "Experiment: Control the Mirror",
      description:
        "Adjust the mirror angle using the slider and observe how the reflected light changes direction!",
    },
  ];

  const steps = filterSteps
    ? allSteps.filter((s) => filterSteps.includes(s.id))
    : allSteps.filter((s) => enabledModes.includes(s.mode));
  const modeSteps = steps.filter((s) => s.mode === currentMode);
  const currentStepData = modeSteps[currentStep - 1] || modeSteps[0];
  const totalSteps = modeSteps.length;

  useEffect(() => {
    if (setStepDetails && currentStepData) {
      setStepDetails({
        currentStep,
        totalSteps,
        stepTitle: currentStepData.title,
        stepDescription: currentStepData.description,
      });
    }
  }, [currentStep, currentStepData, totalSteps, setStepDetails]);

  useEffect(() => {
    if (isPlaying && !stopAutoNext && autoPlayDuration > 0) {
      const timer = setTimeout(
        () => handleNext(),
        autoPlayDuration / animationSpeed,
      );
      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentStep, stopAutoNext, autoPlayDuration, animationSpeed]);

  useEffect(() => {
    setAnimKey((k) => k + 1);
  }, [currentStep, currentMode]);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      setShowFeedback(false);
      setUserAnswer("");
    } else setIsPlaying(false);
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setShowFeedback(false);
      setUserAnswer("");
    }
  };

  const handleModeChange = (mode: ModeType) => {
    setCurrentMode(mode);
    setCurrentStep(1);
    setIsPlaying(false);
    setShowFeedback(false);
    setUserAnswer("");
  };

  const checkAnswer = (qId: number, ans: string) => {
    const correct: Record<number, string> = { 5: "B", 6: "A", 7: "B" };
    const ok = correct[qId] === ans;
    setIsCorrect(ok);
    setShowFeedback(true);
    if (ok) {
      setPracticeScore((s) => s + 1);
      setTimeout(() => {
        if (currentStep < totalSteps) handleNext();
      }, 2000);
    }
  };

  // Responsive font sizes
  const titleSize = isMobile ? 14 : isTablet ? 16 : 18;
  const headingSize = isMobile ? 18 : isTablet ? 20 : 22;
  const descSize = isMobile ? 13 : 15;
  const buttonSize = isMobile ? 13 : 15;

  // Basic Reflection Scene
  const BasicReflectionScene = () => {
    const cx = svgW / 2,
      cy = svgH / 2;
    const scale = isMobile ? 0.7 : isTablet ? 0.85 : 1;
    const lx = cx - 200 * scale,
      ly = cy - 80 * scale;
    const mx = cx + 30 * scale,
      hy = cy + 20 * scale;
    const rx = mx + 160 * scale,
      ry = hy - 100 * scale;
    const iLen = Math.hypot(mx - 6 - lx, hy - ly);
    const rLen = Math.hypot(rx - (mx - 6), ry - hy);

    return (
      <svg
        width={svgW}
        height={svgH}
        key={animKey}
        style={{
          borderRadius: 12,
          background: darkMode
            ? "#0f172a"
            : "linear-gradient(135deg, #FFF3E4 0%, #C1C1EA 100%)",
        }}
      >
        <defs>
          <radialGradient id="lg1">
            <stop offset="0%" stopColor={lightColor} stopOpacity="0.8" />
            <stop offset="100%" stopColor={lightColor} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="mg1" x1="0%" y1="0%" x2="100%">
            <stop offset="0%" stopColor="#533086" />
            <stop offset="30%" stopColor="#4A4DC9" />
            <stop offset="50%" stopColor="#C1C1EA" />
            <stop offset="70%" stopColor="#4A4DC9" />
            <stop offset="100%" stopColor="#533086" />
          </linearGradient>
          <filter id="glow1">
            <feGaussianBlur stdDeviation="4" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <text
          x={cx}
          y={25}
          textAnchor="middle"
          fill={darkMode ? "#e2e8f0" : "#4E4E4E"}
          fontSize={titleSize}
          fontWeight="bold"
          opacity="0"
        >
          Light Bounces Off Shiny Surfaces
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.6s"
            fill="freeze"
          />
        </text>
        <rect
          x={mx - 8}
          y={cy - 120 * scale}
          width={16}
          height={240 * scale}
          fill="#1e3a5f"
          rx="3"
        />
        <rect
          x={mx - 6}
          y={cy - 118 * scale}
          width={12}
          height={236 * scale}
          fill="url(#mg1)"
          rx="2"
        />
        <rect
          x={mx - 4}
          y={cy - 115 * scale}
          width={4}
          height={230 * scale}
          fill="rgba(255,255,255,0.5)"
          rx="1"
        >
          <animate
            attributeName="opacity"
            values="0.3;0.7;0.3"
            dur="2s"
            repeatCount="indefinite"
          />
        </rect>
        <text
          x={mx + 25}
          y={cy + 140 * scale}
          fill={darkMode ? "#C1C1EA" : "#533086"}
          fontSize={isMobile ? 11 : 14}
          fontWeight="600"
          opacity="0"
        >
          Mirror
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.5s"
            begin="0.3s"
            fill="freeze"
          />
        </text>
        <circle cx={lx} cy={ly} r={45 * scale} fill="url(#lg1)">
          <animate
            attributeName="r"
            values={`${40 * scale};${50 * scale};${40 * scale}`}
            dur="1.5s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx={lx} cy={ly} r={25 * scale} fill={lightColor} opacity="0.4">
          <animate
            attributeName="r"
            values={`${20 * scale};${28 * scale};${20 * scale}`}
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx={lx} cy={ly} r={12 * scale} fill={lightColor}>
          <animate
            attributeName="r"
            values={`${10 * scale};${14 * scale};${10 * scale}`}
            dur="0.8s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx={lx} cy={ly} r={5 * scale} fill="#fff">
          <animate
            attributeName="opacity"
            values="0.8;1;0.8"
            dur="0.6s"
            repeatCount="indefinite"
          />
        </circle>
        <text
          x={lx}
          y={ly - 55 * scale}
          textAnchor="middle"
          fill={lightColor}
          fontSize={isMobile ? 10 : 13}
          fontWeight="600"
          opacity="0"
        >
          Light Source
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.4s"
            begin="0.2s"
            fill="freeze"
          />
        </text>
        <line
          x1={lx}
          y1={ly}
          x2={mx - 6}
          y2={hy}
          stroke={lightColor}
          strokeWidth={isMobile ? 6 : 10}
          strokeLinecap="round"
          opacity="0.3"
          filter="url(#glow1)"
        >
          <animate
            attributeName="stroke-dasharray"
            values={`0,${iLen};${iLen},0`}
            dur="1.2s"
            fill="freeze"
            calcMode="spline"
            keySplines="0.4 0 0.2 1"
          />
        </line>
        <line
          x1={lx}
          y1={ly}
          x2={mx - 6}
          y2={hy}
          stroke={lightColor}
          strokeWidth={isMobile ? 3 : 4}
          strokeLinecap="round"
        >
          <animate
            attributeName="stroke-dasharray"
            values={`0,${iLen};${iLen},0`}
            dur="1.2s"
            fill="freeze"
            calcMode="spline"
            keySplines="0.4 0 0.2 1"
          />
        </line>
        <polygon
          points="0,-7 14,0 0,7"
          fill={lightColor}
          transform={`translate(${mx - 6},${hy}) rotate(${(Math.atan2(hy - ly, mx - 6 - lx) * 180) / Math.PI}) scale(${scale})`}
          opacity="0"
        >
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.3s"
            begin="1s"
            fill="freeze"
          />
        </polygon>
        <text
          x={(lx + mx) / 2 - 40 * scale}
          y={(ly + hy) / 2 - 15}
          fill={lightColor}
          fontSize={isMobile ? 10 : 13}
          fontWeight="500"
          opacity="0"
        >
          Incident Ray
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.4s"
            begin="0.8s"
            fill="freeze"
          />
        </text>
        <circle
          cx={mx - 6}
          cy={hy}
          r={20 * scale}
          fill={lightColor}
          opacity="0"
        >
          <animate
            attributeName="opacity"
            values="0;0.5;0"
            dur="0.8s"
            begin="1.2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="r"
            values={`${10 * scale};${25 * scale};${10 * scale}`}
            dur="0.8s"
            begin="1.2s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx={mx - 6} cy={hy} r={6 * scale} fill="#fff" opacity="0">
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.3s"
            begin="1.1s"
            fill="freeze"
          />
        </circle>
        <line
          x1={mx - 6}
          y1={hy}
          x2={rx}
          y2={ry}
          stroke="#10b981"
          strokeWidth={isMobile ? 6 : 10}
          strokeLinecap="round"
          opacity="0"
          filter="url(#glow1)"
        >
          <animate
            attributeName="opacity"
            values="0;0.3"
            dur="0.3s"
            begin="1.4s"
            fill="freeze"
          />
          <animate
            attributeName="stroke-dasharray"
            values={`0,${rLen};${rLen},0`}
            dur="1s"
            begin="1.4s"
            fill="freeze"
            calcMode="spline"
            keySplines="0.4 0 0.2 1"
          />
        </line>
        <line
          x1={mx - 6}
          y1={hy}
          x2={rx}
          y2={ry}
          stroke="#10b981"
          strokeWidth={isMobile ? 3 : 4}
          strokeLinecap="round"
          opacity="0"
        >
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.3s"
            begin="1.4s"
            fill="freeze"
          />
          <animate
            attributeName="stroke-dasharray"
            values={`0,${rLen};${rLen},0`}
            dur="1s"
            begin="1.4s"
            fill="freeze"
            calcMode="spline"
            keySplines="0.4 0 0.2 1"
          />
        </line>
        <polygon
          points="0,-7 14,0 0,7"
          fill="#10b981"
          transform={`translate(${rx},${ry}) rotate(${(Math.atan2(ry - hy, rx - (mx - 6)) * 180) / Math.PI}) scale(${scale})`}
          opacity="0"
        >
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.3s"
            begin="2.2s"
            fill="freeze"
          />
        </polygon>
        <text
          x={(mx + rx) / 2 + 30 * scale}
          y={(hy + ry) / 2}
          fill="#10b981"
          fontSize={isMobile ? 10 : 13}
          fontWeight="500"
          opacity="0"
        >
          Reflected Ray
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.4s"
            begin="2s"
            fill="freeze"
          />
        </text>
        <rect
          x={cx - (isMobile ? 140 : 160)}
          y={svgH - (isMobile ? 60 : 70)}
          width={isMobile ? 280 : 320}
          height={isMobile ? 48 : 55}
          rx="12"
          fill={darkMode ? "rgba(30,41,59,0.95)" : "rgba(255,255,255,0.95)"}
          stroke={darkMode ? "#475569" : "#cbd5e1"}
          strokeWidth="2"
          opacity="0"
        >
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.5s"
            begin="2.5s"
            fill="freeze"
          />
        </rect>
        <text
          x={cx}
          y={svgH - (isMobile ? 32 : 38)}
          textAnchor="middle"
          fill={darkMode ? "#e2e8f0" : "#4E4E4E"}
          fontSize={isMobile ? 12 : 15}
          fontWeight="600"
          opacity="0"
        >
          This bouncing back of light is called
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.5s"
            begin="2.7s"
            fill="freeze"
          />
        </text>
        <text
          x={cx}
          y={svgH - (isMobile ? 14 : 18)}
          textAnchor="middle"
          fill={themeColor}
          fontSize={isMobile ? 14 : 18}
          fontWeight="bold"
          opacity="0"
        >
          REFLECTION
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.5s"
            begin="2.9s"
            fill="freeze"
          />
        </text>
      </svg>
    );
  };

  // Light Path Scene
  const LightPathScene = () => {
    const cx = svgW / 2,
      cy = svgH / 2;
    const scale = isMobile ? 0.7 : isTablet ? 0.85 : 1;
    const rLen = 380 * scale;
    const starCount = isMobile ? 15 : 30;

    return (
      <svg
        width={svgW}
        height={svgH}
        key={animKey}
        style={{
          borderRadius: 12,
          background: darkMode
            ? "#0f172a"
            : "linear-gradient(135deg, #0c1929 0%, #1a365d 50%, #0c1929 100%)",
        }}
      >
        <defs>
          <filter id="glow2">
            <feGaussianBlur stdDeviation="4" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="sunGlow">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="1" />
            <stop offset="30%" stopColor="#f59e0b" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#d97706" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
          </radialGradient>
        </defs>

        <text
          x={cx}
          y={25}
          textAnchor="middle"
          fill="#fef3c7"
          fontSize={titleSize}
          fontWeight="bold"
          opacity="0"
        >
          Light Travels in Straight Lines
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.6s"
            fill="freeze"
          />
        </text>

        {Array.from({ length: starCount }).map((_, i) => (
          <circle
            key={i}
            cx={50 + ((i * 23) % svgW)}
            cy={40 + ((i * 17) % (svgH - 100))}
            r={Math.random() > 0.5 ? 1 : 1.5}
            fill="#fff"
            opacity="0"
          >
            <animate
              attributeName="opacity"
              values="0;0.3;0.8;0.3;0"
              dur={`${2 + (i % 3)}s`}
              repeatCount="indefinite"
              begin={`${i * 0.1}s`}
            />
          </circle>
        ))}

        <circle
          cx={cx - 220 * scale}
          cy={cy}
          r={80 * scale}
          fill="url(#sunGlow)"
          opacity="0"
        >
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.5s"
            fill="freeze"
          />
          <animate
            attributeName="r"
            values={`${70 * scale};${90 * scale};${70 * scale}`}
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
        <circle
          cx={cx - 220 * scale}
          cy={cy}
          r={45 * scale}
          fill="#fbbf24"
          opacity="0"
        >
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.5s"
            fill="freeze"
          />
          <animate
            attributeName="r"
            values={`${40 * scale};${50 * scale};${40 * scale}`}
            dur="1.5s"
            repeatCount="indefinite"
          />
        </circle>
        <circle
          cx={cx - 220 * scale}
          cy={cy}
          r={30 * scale}
          fill="#fef3c7"
          opacity="0"
        >
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.5s"
            fill="freeze"
          />
        </circle>
        <circle
          cx={cx - 220 * scale}
          cy={cy}
          r={15 * scale}
          fill="#fff"
          opacity="0"
        >
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.5s"
            fill="freeze"
          />
          <animate
            attributeName="r"
            values={`${12 * scale};${18 * scale};${12 * scale}`}
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
        <text
          x={cx - 220 * scale}
          y={cy + 70 * scale}
          textAnchor="middle"
          fill="#fbbf24"
          fontSize={isMobile ? 11 : 14}
          fontWeight="600"
          opacity="0"
        >
          Light Source
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.4s"
            begin="0.3s"
            fill="freeze"
          />
        </text>

        {[
          { y: -70 * scale, delay: 0, color: "#fbbf24" },
          { y: -35 * scale, delay: 0.2, color: "#fcd34d" },
          { y: 0, delay: 0.4, color: "#fbbf24" },
          { y: 35 * scale, delay: 0.6, color: "#fcd34d" },
          { y: 70 * scale, delay: 0.8, color: "#fbbf24" },
        ].map((ray, i) => (
          <g key={i}>
            <line
              x1={cx - 170 * scale}
              y1={cy + ray.y}
              x2={cx + 200 * scale}
              y2={cy + ray.y}
              stroke="#4b5563"
              strokeWidth="1"
              strokeDasharray="8,8"
              opacity="0.3"
            />

            <line
              x1={cx - 170 * scale}
              y1={cy + ray.y}
              x2={cx + 200 * scale}
              y2={cy + ray.y}
              stroke={ray.color}
              strokeWidth={isMobile ? 8 : 12}
              strokeLinecap="round"
              opacity="0.2"
              filter="url(#glow2)"
            >
              <animate
                attributeName="stroke-dasharray"
                values={`0,${rLen};${rLen},0`}
                dur="1.5s"
                begin={`${ray.delay}s`}
                fill="freeze"
              />
            </line>

            <line
              x1={cx - 170 * scale}
              y1={cy + ray.y}
              x2={cx + 200 * scale}
              y2={cy + ray.y}
              stroke={ray.color}
              strokeWidth={isMobile ? 3 : 4}
              strokeLinecap="round"
              opacity="0"
            >
              <animate
                attributeName="opacity"
                values="0;1"
                dur="0.3s"
                begin={`${ray.delay}s`}
                fill="freeze"
              />
              <animate
                attributeName="stroke-dasharray"
                values={`0,${rLen};${rLen},0`}
                dur="1.5s"
                begin={`${ray.delay}s`}
                fill="freeze"
              />
            </line>

            <circle r={isMobile ? 3 : 4} fill="#fff" opacity="0">
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                dur="2s"
                begin={`${ray.delay + 1.5}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="cx"
                values={`${cx - 170 * scale};${cx + 200 * scale}`}
                dur="2s"
                begin={`${ray.delay + 1.5}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values={`${cy + ray.y};${cy + ray.y}`}
                dur="2s"
                begin={`${ray.delay + 1.5}s`}
                repeatCount="indefinite"
              />
            </circle>

            <polygon
              points={`0,${-8 * scale} ${16 * scale},0 0,${8 * scale}`}
              fill={ray.color}
              transform={`translate(${cx + 200 * scale},${cy + ray.y})`}
              opacity="0"
            >
              <animate
                attributeName="opacity"
                values="0;1"
                dur="0.3s"
                begin={`${ray.delay + 1.3}s`}
                fill="freeze"
              />
            </polygon>
          </g>
        ))}

        <text
          x={cx + 30 * scale}
          y={cy - 12}
          fill="#fef3c7"
          fontSize={isMobile ? 10 : 12}
          fontWeight="bold"
          opacity="0"
        >
          STRAIGHT PATH
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.5s"
            begin="2s"
            fill="freeze"
          />
        </text>

        <rect
          x={cx - (isMobile ? 140 : 160)}
          y={svgH - (isMobile ? 70 : 80)}
          width={isMobile ? 280 : 320}
          height={isMobile ? 58 : 65}
          rx="12"
          fill="rgba(15,23,42,0.9)"
          stroke="#fbbf24"
          strokeWidth="2"
          opacity="0"
        >
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.5s"
            begin="2.5s"
            fill="freeze"
          />
        </rect>
        <text
          x={cx}
          y={svgH - (isMobile ? 42 : 50)}
          textAnchor="middle"
          fill="#fef3c7"
          fontSize={isMobile ? 12 : 14}
          opacity="0"
        >
          Light always travels in
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.4s"
            begin="2.7s"
            fill="freeze"
          />
        </text>
        <text
          x={cx}
          y={svgH - (isMobile ? 22 : 28)}
          textAnchor="middle"
          fill="#fbbf24"
          fontSize={isMobile ? 14 : 17}
          fontWeight="bold"
          opacity="0"
        >
          STRAIGHT LINES (Rays)
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.4s"
            begin="2.9s"
            fill="freeze"
          />
        </text>
      </svg>
    );
  };

  // Laws of Reflection Scene
  const LawsScene = () => {
    const cx = svgW / 2,
      cy = svgH / 2 - 20,
      my = cy + 60;
    const scale = isMobile ? 0.7 : isTablet ? 0.85 : 1;
    const ang = 40,
      rL = 120 * scale,
      nL = 140 * scale;
    const isx = cx - rL * Math.sin((ang * Math.PI) / 180),
      isy = my - rL * Math.cos((ang * Math.PI) / 180);
    const rex = cx + rL * Math.sin((ang * Math.PI) / 180),
      rey = my - rL * Math.cos((ang * Math.PI) / 180);

    return (
      <svg
        width={svgW}
        height={svgH}
        key={animKey}
        style={{
          borderRadius: 12,
          background: darkMode
            ? "#0f172a"
            : "linear-gradient(135deg, #FFF3E4 0%, #F5F5F5 100%)",
        }}
      >
        <defs>
          <filter id="glow3">
            <feGaussianBlur stdDeviation="4" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <text
          x={cx}
          y={25}
          textAnchor="middle"
          fill={darkMode ? "#e2e8f0" : "#4E4E4E"}
          fontSize={titleSize}
          fontWeight="bold"
          opacity="0"
        >
          Laws of Reflection
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.6s"
            fill="freeze"
          />
        </text>
        <rect
          x={cx - 140 * scale}
          y={my}
          width={280 * scale}
          height={12}
          fill="url(#mg1)"
          rx="2"
          opacity="0"
        >
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.5s"
            fill="freeze"
          />
        </rect>
        <rect
          x={cx - 140 * scale}
          y={my}
          width={280 * scale}
          height={4}
          fill="rgba(255,255,255,0.6)"
          rx="1"
          opacity="0"
        >
          <animate
            attributeName="opacity"
            values="0;0.8"
            dur="0.5s"
            fill="freeze"
          />
        </rect>
        {Array.from({ length: 14 }).map((_, i) => (
          <line
            key={i}
            x1={cx - 130 * scale + i * 20 * scale}
            y1={my + 14}
            x2={cx - 140 * scale + i * 20 * scale}
            y2={my + 24}
            stroke={darkMode ? "#475569" : "#64748b"}
            strokeWidth="2"
            opacity="0"
          >
            <animate
              attributeName="opacity"
              values="0;0.5"
              dur="0.3s"
              begin="0.2s"
              fill="freeze"
            />
          </line>
        ))}
        <line
          x1={cx}
          y1={my}
          x2={cx}
          y2={my - nL}
          stroke={darkMode ? "#94a3b8" : "#64748b"}
          strokeWidth="2"
          strokeDasharray="8,6"
          opacity="0"
        >
          <animate
            attributeName="opacity"
            values="0;0.8"
            dur="0.5s"
            begin="0.4s"
            fill="freeze"
          />
          <animate
            attributeName="stroke-dashoffset"
            values="0;-28"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </line>
        <text
          x={cx + 50 * scale}
          y={my - nL + 15}
          fill={darkMode ? "#cbd5e1" : "#475569"}
          fontSize={isMobile ? 11 : 14}
          fontWeight="500"
          opacity="0"
        >
          Normal
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.4s"
            begin="0.6s"
            fill="freeze"
          />
        </text>
        {!isMobile && (
          <text
            x={cx + 50 * scale}
            y={my - nL + 32}
            fill={darkMode ? "#94a3b8" : "#64748b"}
            fontSize={11}
            opacity="0"
          >
            (perpendicular)
            <animate
              attributeName="opacity"
              values="0;1"
              dur="0.4s"
              begin="0.7s"
              fill="freeze"
            />
          </text>
        )}
        <circle cx={isx} cy={isy} r={18 * scale} fill="url(#lg1)" opacity="0">
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.4s"
            begin="0.8s"
            fill="freeze"
          />
          <animate
            attributeName="r"
            values={`${15 * scale};${20 * scale};${15 * scale}`}
            dur="1.2s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx={isx} cy={isy} r={8 * scale} fill={lightColor} opacity="0">
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.4s"
            begin="0.8s"
            fill="freeze"
          />
        </circle>
        <line
          x1={isx}
          y1={isy}
          x2={cx}
          y2={my}
          stroke={lightColor}
          strokeWidth={isMobile ? 6 : 8}
          strokeLinecap="round"
          opacity="0.3"
          filter="url(#glow3)"
        >
          <animate
            attributeName="stroke-dasharray"
            values={`0,${rL};${rL},0`}
            dur="0.8s"
            begin="1s"
            fill="freeze"
          />
        </line>
        <line
          x1={isx}
          y1={isy}
          x2={cx}
          y2={my}
          stroke={lightColor}
          strokeWidth={isMobile ? 3 : 4}
          strokeLinecap="round"
          opacity="0"
        >
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.3s"
            begin="1s"
            fill="freeze"
          />
          <animate
            attributeName="stroke-dasharray"
            values={`0,${rL};${rL},0`}
            dur="0.8s"
            begin="1s"
            fill="freeze"
          />
        </line>
        <polygon
          points={`0,${-6 * scale} ${12 * scale},0 0,${6 * scale}`}
          fill={lightColor}
          transform={`translate(${cx},${my}) rotate(${90 + ang})`}
          opacity="0"
        >
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.3s"
            begin="1.6s"
            fill="freeze"
          />
        </polygon>
        <path
          d={`M ${cx} ${my - 45 * scale} A ${45 * scale} ${45 * scale} 0 0 0 ${cx - 45 * scale * Math.sin((ang * Math.PI) / 180)} ${my - 45 * scale * Math.cos((ang * Math.PI) / 180)}`}
          fill="none"
          stroke="#ef4444"
          strokeWidth="3"
          opacity="0"
        >
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.4s"
            begin="1.8s"
            fill="freeze"
          />
        </path>
        <text
          x={cx - 65 * scale}
          y={my - 55 * scale}
          fill="#ef4444"
          fontSize={isMobile ? 13 : 16}
          fontWeight="bold"
          opacity="0"
        >
          i = {ang}°
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.4s"
            begin="2s"
            fill="freeze"
          />
        </text>
        <line
          x1={cx}
          y1={my}
          x2={rex}
          y2={rey}
          stroke="#10b981"
          strokeWidth={isMobile ? 6 : 8}
          strokeLinecap="round"
          opacity="0.3"
          filter="url(#glow3)"
        >
          <animate
            attributeName="stroke-dasharray"
            values={`0,${rL};${rL},0`}
            dur="0.8s"
            begin="2.2s"
            fill="freeze"
          />
        </line>
        <line
          x1={cx}
          y1={my}
          x2={rex}
          y2={rey}
          stroke="#10b981"
          strokeWidth={isMobile ? 3 : 4}
          strokeLinecap="round"
          opacity="0"
        >
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.3s"
            begin="2.2s"
            fill="freeze"
          />
          <animate
            attributeName="stroke-dasharray"
            values={`0,${rL};${rL},0`}
            dur="0.8s"
            begin="2.2s"
            fill="freeze"
          />
        </line>
        <polygon
          points={`0,${-6 * scale} ${12 * scale},0 0,${6 * scale}`}
          fill="#10b981"
          transform={`translate(${rex},${rey}) rotate(${-90 + ang})`}
          opacity="0"
        >
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.3s"
            begin="2.8s"
            fill="freeze"
          />
        </polygon>
        <path
          d={`M ${cx} ${my - 45 * scale} A ${45 * scale} ${45 * scale} 0 0 1 ${cx + 45 * scale * Math.sin((ang * Math.PI) / 180)} ${my - 45 * scale * Math.cos((ang * Math.PI) / 180)}`}
          fill="none"
          stroke="#10b981"
          strokeWidth="3"
          opacity="0"
        >
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.4s"
            begin="3s"
            fill="freeze"
          />
        </path>
        <text
          x={cx + 55 * scale}
          y={my - 55 * scale}
          fill="#10b981"
          fontSize={isMobile ? 13 : 16}
          fontWeight="bold"
          opacity="0"
        >
          r = {ang}°
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.4s"
            begin="3.2s"
            fill="freeze"
          />
        </text>
        <circle
          cx={cx}
          cy={my}
          r={8 * scale}
          fill="#fff"
          stroke={lightColor}
          strokeWidth="2"
          opacity="0"
        >
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.3s"
            begin="1.7s"
            fill="freeze"
          />
        </circle>
        <rect
          x={cx - (isMobile ? 150 : 180)}
          y={svgH - (isMobile ? 70 : 80)}
          width={isMobile ? 300 : 360}
          height={isMobile ? 58 : 65}
          rx="14"
          fill={darkMode ? "rgba(30,41,59,0.95)" : "rgba(255,255,255,0.95)"}
          stroke={darkMode ? "#475569" : "#10b981"}
          strokeWidth="2"
          opacity="0"
        >
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.5s"
            begin="3.5s"
            fill="freeze"
          />
        </rect>
        <text
          x={cx}
          y={svgH - (isMobile ? 42 : 50)}
          textAnchor="middle"
          fill={darkMode ? "#e2e8f0" : "#4E4E4E"}
          fontSize={isMobile ? 12 : 15}
          opacity="0"
        >
          Law of Reflection:
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.4s"
            begin="3.7s"
            fill="freeze"
          />
        </text>
        <text
          x={cx}
          y={svgH - (isMobile ? 20 : 25)}
          textAnchor="middle"
          fill={themeColor}
          fontSize={isMobile ? 14 : 18}
          fontWeight="bold"
          opacity="0"
        >
          Angle i = Angle r
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.4s"
            begin="3.9s"
            fill="freeze"
          />
        </text>
      </svg>
    );
  };

  // Mirror Image Scene
  const MirrorImageScene = () => {
    const cx = svgW / 2,
      cy = svgH / 2;
    const scale = isMobile ? 0.6 : isTablet ? 0.75 : 1;
    const ox = cx - 120 * scale,
      ix = cx + 120 * scale;

    return (
      <svg
        width={svgW}
        height={svgH}
        key={animKey}
        style={{
          borderRadius: 12,
          background: darkMode
            ? "#0f172a"
            : "linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%)",
        }}
      >
        <defs>
          <linearGradient id="mirrorGrad4" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#533086" />
            <stop offset="20%" stopColor="#4A4DC9" />
            <stop offset="50%" stopColor="#C1C1EA" />
            <stop offset="80%" stopColor="#4A4DC9" />
            <stop offset="100%" stopColor="#533086" />
          </linearGradient>
          <filter id="mirrorGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <text
          x={cx}
          y={25}
          textAnchor="middle"
          fill={darkMode ? "#e2e8f0" : "#4E4E4E"}
          fontSize={titleSize}
          fontWeight="bold"
          opacity="0"
        >
          Mirror Images
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.6s"
            fill="freeze"
          />
        </text>

        <g opacity="0">
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.5s"
            fill="freeze"
          />
          <rect
            x={cx - 10}
            y={cy - 135 * scale}
            width={20}
            height={270 * scale}
            fill="#1e3a5f"
            rx="4"
          />
          <rect
            x={cx - 8}
            y={cy - 132 * scale}
            width={16}
            height={264 * scale}
            fill="url(#mirrorGrad4)"
            rx="3"
            filter="url(#mirrorGlow)"
          />
          <rect
            x={cx - 6}
            y={cy - 128 * scale}
            width={5}
            height={256 * scale}
            fill="rgba(255,255,255,0.5)"
            rx="2"
          >
            <animate
              attributeName="opacity"
              values="0.3;0.7;0.3"
              dur="2s"
              repeatCount="indefinite"
            />
          </rect>
          <line
            x1={cx - 3}
            y1={cy - 120 * scale}
            x2={cx - 3}
            y2={cy + 120 * scale}
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1"
            strokeDasharray="10,5"
          />
        </g>
        <text
          x={cx}
          y={cy + 145 * scale}
          textAnchor="middle"
          fill={darkMode ? "#C1C1EA" : "#533086"}
          fontSize={isMobile ? 11 : 14}
          fontWeight="bold"
          opacity="0"
        >
          MIRROR
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.4s"
            begin="0.3s"
            fill="freeze"
          />
        </text>

        <g opacity="0" transform={`translate(${ox},${cy}) scale(${scale})`}>
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.6s"
            begin="0.5s"
            fill="freeze"
          />
          <circle cx="0" cy="-55" r="22" fill="#ef4444" />
          <circle cx="-6" cy="-60" r="3" fill="#fff" />
          <circle cx="6" cy="-60" r="3" fill="#fff" />
          <path
            d="M -6 -50 Q 0 -44 6 -50"
            stroke="#fff"
            strokeWidth="2"
            fill="none"
          />
          <rect x="-18" y="-30" width="36" height="50" rx="8" fill="#ef4444" />
          <rect x="-30" y="-25" width="12" height="35" rx="5" fill="#ef4444" />
          <rect x="18" y="-25" width="12" height="35" rx="5" fill="#ef4444" />
          <rect x="-14" y="22" width="12" height="40" rx="5" fill="#ef4444" />
          <rect x="2" y="22" width="12" height="40" rx="5" fill="#ef4444" />
        </g>
        <text
          x={ox}
          y={cy + 85 * scale}
          textAnchor="middle"
          fill="#ef4444"
          fontSize={isMobile ? 11 : 14}
          fontWeight="bold"
          opacity="0"
        >
          OBJECT
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.4s"
            begin="0.8s"
            fill="freeze"
          />
        </text>

        <g
          opacity="0"
          transform={`translate(${ix},${cy}) scale(-${scale},${scale})`}
        >
          <animate
            attributeName="opacity"
            values="0;0.6"
            dur="0.8s"
            begin="1.2s"
            fill="freeze"
          />
          <circle cx="0" cy="-55" r="22" fill="#ef4444" />
          <circle cx="-6" cy="-60" r="3" fill="#fff" />
          <circle cx="6" cy="-60" r="3" fill="#fff" />
          <path
            d="M -6 -50 Q 0 -44 6 -50"
            stroke="#fff"
            strokeWidth="2"
            fill="none"
          />
          <rect x="-18" y="-30" width="36" height="50" rx="8" fill="#ef4444" />
          <rect x="-30" y="-25" width="12" height="35" rx="5" fill="#ef4444" />
          <rect x="18" y="-25" width="12" height="35" rx="5" fill="#ef4444" />
          <rect x="-14" y="22" width="12" height="40" rx="5" fill="#ef4444" />
          <rect x="2" y="22" width="12" height="40" rx="5" fill="#ef4444" />
        </g>
        <text
          x={ix}
          y={cy + 85 * scale}
          textAnchor="middle"
          fill="#8b5cf6"
          fontSize={isMobile ? 11 : 14}
          fontWeight="bold"
          opacity="0"
        >
          IMAGE
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.4s"
            begin="1.8s"
            fill="freeze"
          />
        </text>
        {!isMobile && (
          <text
            x={ix}
            y={cy + 102 * scale}
            textAnchor="middle"
            fill={darkMode ? "#94a3b8" : "#64748b"}
            fontSize={11}
            opacity="0"
          >
            (Virtual)
            <animate
              attributeName="opacity"
              values="0;1"
              dur="0.4s"
              begin="1.9s"
              fill="freeze"
            />
          </text>
        )}

        <line
          x1={ox}
          y1={cy - 90 * scale}
          x2={cx - 12}
          y2={cy - 90 * scale}
          stroke={darkMode ? "#94a3b8" : "#64748b"}
          strokeWidth="2"
          strokeDasharray="6,4"
          opacity="0"
        >
          <animate
            attributeName="opacity"
            values="0;0.8"
            dur="0.5s"
            begin="2.2s"
            fill="freeze"
          />
        </line>
        <line
          x1={cx + 12}
          y1={cy - 90 * scale}
          x2={ix}
          y2={cy - 90 * scale}
          stroke={darkMode ? "#94a3b8" : "#64748b"}
          strokeWidth="2"
          strokeDasharray="6,4"
          opacity="0"
        >
          <animate
            attributeName="opacity"
            values="0;0.8"
            dur="0.5s"
            begin="2.2s"
            fill="freeze"
          />
        </line>

        <text
          x={(ox + cx) / 2 - 5}
          y={cy - 100 * scale}
          textAnchor="middle"
          fill={darkMode ? "#e2e8f0" : "#4E4E4E"}
          fontSize={isMobile ? 13 : 16}
          fontWeight="bold"
          opacity="0"
        >
          d
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.4s"
            begin="2.4s"
            fill="freeze"
          />
        </text>
        <text
          x={(cx + ix) / 2 + 5}
          y={cy - 100 * scale}
          textAnchor="middle"
          fill={darkMode ? "#e2e8f0" : "#4E4E4E"}
          fontSize={isMobile ? 13 : 16}
          fontWeight="bold"
          opacity="0"
        >
          d
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.4s"
            begin="2.4s"
            fill="freeze"
          />
        </text>

        <rect
          x={cx - (isMobile ? 145 : 200)}
          y={svgH - (isMobile ? 75 : 85)}
          width={isMobile ? 290 : 400}
          height={isMobile ? 63 : 70}
          rx="14"
          fill={darkMode ? "rgba(30,41,59,0.95)" : "rgba(255,255,255,0.95)"}
            stroke={darkMode ? "#475569" : "#4A4DC9"}
          strokeWidth="2"
          opacity="0"
        >
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.5s"
            begin="2.8s"
            fill="freeze"
          />
        </rect>
        <text
          x={cx}
          y={svgH - (isMobile ? 47 : 55)}
          textAnchor="middle"
          fill={darkMode ? "#e2e8f0" : "#4E4E4E"}
          fontSize={isMobile ? 11 : 14}
          opacity="0"
        >
          The image appears BEHIND the mirror
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.4s"
            begin="3s"
            fill="freeze"
          />
        </text>
        <text
          x={cx}
          y={svgH - (isMobile ? 26 : 32)}
          textAnchor="middle"
          fill={themeColor}
          fontSize={isMobile ? 13 : 16}
          fontWeight="bold"
          opacity="0"
        >
          at the SAME DISTANCE as the object
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.4s"
            begin="3.2s"
            fill="freeze"
          />
        </text>
      </svg>
    );
  };

  // Daily Mirrors Scene
  const DailyMirrorsScene = () => {
    const cx = svgW / 2,
      cy = svgH / 2;
    const scale = isMobile ? 0.65 : isTablet ? 0.8 : 1;
    const spacing = isMobile ? 160 : 220;

    return (
      <svg
        width={svgW}
        height={svgH}
        key={animKey}
        style={{
          borderRadius: 12,
          background: darkMode
            ? "#0f172a"
            : "linear-gradient(135deg, #FFF3E4 0%, #C1C1EA 100%)",
        }}
      >
        <defs>
          <linearGradient
            id="mirrorSurface"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#EBEBEB" />
            <stop offset="30%" stopColor="#F5F5F5" />
            <stop offset="50%" stopColor="#C1C1EA" />
            <stop offset="70%" stopColor="#F5F5F5" />
            <stop offset="100%" stopColor="#CACACA" />
          </linearGradient>
          <linearGradient id="carInterior" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1f2937" />
            <stop offset="100%" stopColor="#374151" />
          </linearGradient>
          <filter id="mirrorReflect">
            <feGaussianBlur stdDeviation="0.5" />
          </filter>
        </defs>

        <text
          x={cx}
          y={25}
          textAnchor="middle"
          fill={darkMode ? "#e2e8f0" : "#4E4E4E"}
          fontSize={titleSize}
          fontWeight="bold"
          opacity="0"
        >
          Mirrors in Our Daily Life
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.6s"
            fill="freeze"
          />
        </text>

        {/* Bathroom Mirror */}
        <g
          opacity="0"
          transform={`translate(${cx - spacing * scale},${cy - 40 * scale}) scale(${scale})`}
        >
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.6s"
            begin="0.3s"
            fill="freeze"
          />
          <rect
            x="-55"
            y="-75"
            width="110"
            height="140"
            rx="6"
            fill="#78350f"
          />
          <rect
            x="-52"
            y="-72"
            width="104"
            height="134"
            rx="4"
            fill="#92400e"
          />
          <rect
            x="-45"
            y="-65"
            width="90"
            height="120"
            rx="2"
            fill="url(#mirrorSurface)"
          />
          <rect
            x="-42"
            y="-62"
            width="25"
            height="114"
            rx="2"
            fill="rgba(255,255,255,0.4)"
          />
          <ellipse
            cx="0"
            cy="-15"
            rx="22"
            ry="28"
            fill="#fcd34d"
            opacity="0.25"
          />
          <ellipse
            cx="0"
            cy="-20"
            rx="15"
            ry="18"
            fill="#fef3c7"
            opacity="0.2"
          />
        </g>
        <text
          x={cx - spacing * scale}
          y={cy + 110 * scale}
          textAnchor="middle"
          fill={darkMode ? "#e2e8f0" : "#4E4E4E"}
          fontSize={isMobile ? 10 : 13}
          fontWeight="600"
          opacity="0"
        >
          Bathroom
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.4s"
            begin="0.6s"
            fill="freeze"
          />
        </text>

        {/* Car Rearview Mirror */}
        <g
          opacity="0"
          transform={`translate(${cx},${cy - 30 * scale}) scale(${scale})`}
        >
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.6s"
            begin="0.6s"
            fill="freeze"
          />
          <rect
            x="-120"
            y="-90"
            width="240"
            height="40"
            fill="url(#carInterior)"
            rx="4"
          />
          <path
            d="M 0 -50 L 0 -20 L -8 -10 L 8 -10 L 0 -20"
            fill="#1f2937"
            stroke="#374151"
            strokeWidth="1"
          />
          <rect x="-4" y="-55" width="8" height="12" fill="#374151" rx="2" />
          <ellipse
            cx="0"
            cy="15"
            rx="70"
            ry="35"
            fill="#1f2937"
            stroke="#374151"
            strokeWidth="2"
          />
          <ellipse cx="0" cy="15" rx="65" ry="31" fill="#111827" />
          <ellipse cx="0" cy="15" rx="58" ry="26" fill="url(#mirrorSurface)" />
          <g filter="url(#mirrorReflect)" opacity="0.6">
            <rect
              x="-50"
              y="25"
              width="100"
              height="15"
              fill="#4b5563"
              rx="2"
            />
            <rect x="-30" y="8" width="18" height="12" fill="#ef4444" rx="2" />
            <rect x="-28" y="10" width="6" height="4" fill="#bfdbfe" rx="1" />
            <circle cx="-26" cy="20" r="2" fill="#1f2937" />
            <circle cx="-16" cy="20" r="2" fill="#1f2937" />
            <rect x="15" y="5" width="22" height="14" fill="#4A4DC9" rx="2" />
            <rect x="18" y="7" width="7" height="5" fill="#bfdbfe" rx="1" />
            <circle cx="20" cy="19" r="2.5" fill="#1f2937" />
            <circle cx="32" cy="19" r="2.5" fill="#1f2937" />
          </g>
          <ellipse
            cx="-25"
            cy="8"
            rx="18"
            ry="12"
            fill="rgba(255,255,255,0.3)"
          />
          <rect x="50" y="10" width="12" height="6" fill="#6b7280" rx="2" />
          <circle cx="5" cy="18" r="4" fill="#fbbf24" opacity="0">
            <animate
              attributeName="opacity"
              values="0;0.6;0"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="r"
              values="3;5;3"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
        <text
          x={cx}
          y={cy + 110 * scale}
          textAnchor="middle"
          fill={darkMode ? "#e2e8f0" : "#4E4E4E"}
          fontSize={isMobile ? 10 : 13}
          fontWeight="600"
          opacity="0"
        >
          Car Mirror
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.4s"
            begin="0.9s"
            fill="freeze"
          />
        </text>

        {/* Dental Mirror */}
        <g
          opacity="0"
          transform={`translate(${cx + spacing * scale},${cy - 30 * scale}) scale(${scale})`}
        >
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.6s"
            begin="0.9s"
            fill="freeze"
          />
          <rect x="-5" y="25" width="10" height="85" rx="4" fill="#9ca3af" />
          <rect
            x="-3"
            y="30"
            width="3"
            height="75"
            rx="1"
            fill="rgba(255,255,255,0.3)"
          />
          <path
            d="M 0 25 Q -15 15 -12 0"
            stroke="#9ca3af"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          <circle
            cx="-12"
            cy="-5"
            r="30"
            fill="#6b7280"
            stroke="#4b5563"
            strokeWidth="2"
          />
          <circle cx="-12" cy="-5" r="26" fill="url(#mirrorSurface)" />
          <rect
            x="-20"
            y="-12"
            width="8"
            height="10"
            fill="#F5F5F5"
            opacity="0.5"
            rx="1"
          />
          <rect
            x="-10"
            y="-14"
            width="8"
            height="12"
            fill="#f1f5f9"
            opacity="0.5"
            rx="1"
          />
          <circle cx="-20" cy="-12" r="8" fill="rgba(255,255,255,0.4)" />
        </g>
        <text
          x={cx + spacing * scale}
          y={cy + 110 * scale}
          textAnchor="middle"
          fill={darkMode ? "#e2e8f0" : "#4E4E4E"}
          fontSize={isMobile ? 10 : 13}
          fontWeight="600"
          opacity="0"
        >
          Dental
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.4s"
            begin="1.2s"
            fill="freeze"
          />
        </text>

        <rect
          x={cx - (isMobile ? 145 : 200)}
          y={svgH - (isMobile ? 68 : 80)}
          width={isMobile ? 290 : 400}
          height={isMobile ? 56 : 60}
          rx="12"
          fill={darkMode ? "rgba(30,41,59,0.95)" : "rgba(255,255,255,0.95)"}
          stroke={darkMode ? "#475569" : "#4A4DC9"}
          strokeWidth="2"
          opacity="0"
        >
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.5s"
            begin="1.5s"
            fill="freeze"
          />
        </rect>
        <text
          x={cx}
          y={svgH - (isMobile ? 42 : 50)}
          textAnchor="middle"
          fill={darkMode ? "#e2e8f0" : "#4E4E4E"}
          fontSize={isMobile ? 11 : 14}
          opacity="0"
        >
          Mirrors help us see things that are
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.4s"
            begin="1.7s"
            fill="freeze"
          />
        </text>
        <text
          x={cx}
          y={svgH - (isMobile ? 22 : 28)}
          textAnchor="middle"
          fill={themeColor}
          fontSize={isMobile ? 13 : 16}
          fontWeight="bold"
          opacity="0"
        >
          behind us or hidden from view!
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.4s"
            begin="1.9s"
            fill="freeze"
          />
        </text>
      </svg>
    );
  };

  // Periscope Scene
  const PeriscopeScene = () => {
    const cx = svgW / 2,
      cy = svgH / 2;
    const scale = isMobile ? 0.65 : isTablet ? 0.8 : 1;

    return (
      <svg
        width={svgW}
        height={svgH}
        key={animKey}
        style={{
          borderRadius: 12,
          background:
            "linear-gradient(180deg, #C1C1EA 0%, #4A4DC9 50%, #533086 100%)",
        }}
      >
        <defs>
          <filter id="glowP">
            <feGaussianBlur stdDeviation="3" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <text
          x={cx}
          y={22}
          textAnchor="middle"
          fill="#4E4E4E"
          fontSize={titleSize}
          fontWeight="bold"
          opacity="0"
        >
          How a Periscope Works
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.6s"
            fill="freeze"
          />
        </text>
        <rect
          x="0"
          y={cy + 20}
          width={svgW}
          height={svgH - cy - 20}
          fill="rgba(30,58,138,0.3)"
        />
        <path
          d={`M 0 ${cy + 20} Q ${svgW / 4} ${cy + 10} ${svgW / 2} ${cy + 20} T ${svgW} ${cy + 20}`}
          fill="none"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="3"
        >
          <animate
            attributeName="d"
            values={`M 0 ${cy + 20} Q ${svgW / 4} ${cy + 10} ${svgW / 2} ${cy + 20} T ${svgW} ${cy + 20};M 0 ${cy + 20} Q ${svgW / 4} ${cy + 30} ${svgW / 2} ${cy + 20} T ${svgW} ${cy + 20};M 0 ${cy + 20} Q ${svgW / 4} ${cy + 10} ${svgW / 2} ${cy + 20} T ${svgW} ${cy + 20}`}
            dur="3s"
            repeatCount="indefinite"
          />
        </path>
        <g
          opacity="0"
          transform={`translate(${cx + 180 * scale},${cy - 80 * scale}) scale(${scale})`}
        >
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.5s"
            begin="0.3s"
            fill="freeze"
          />
          <path d="M -30 10 L 30 10 L 25 25 L -25 25 Z" fill="#dc2626" />
          <rect x="-20" y="0" width="40" height="12" rx="2" fill="#fef2f2" />
          <rect x="-10" y="-15" width="20" height="17" rx="2" fill="#fee2e2" />
          <rect x="5" y="-25" width="6" height="12" fill="#374151" />
          <circle cx="8" cy="-32" r="4" fill="#9ca3af" opacity="0.6">
            <animate
              attributeName="cy"
              values="-32;-45"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.6;0"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
        <text
          x={cx + 180 * scale}
          y={cy - 100 * scale}
          textAnchor="middle"
          fill="#4E4E4E"
          fontSize={isMobile ? 10 : 12}
          fontWeight="500"
          opacity="0"
        >
          Ship
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.4s"
            begin="0.5s"
            fill="freeze"
          />
        </text>
        <g opacity="0" transform={`scale(${scale})`}>
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.5s"
            begin="0.5s"
            fill="freeze"
          />
          <rect
            x={cx / scale - 25}
            y={(cy - 100) / scale}
            width="50"
            height="230"
            rx="4"
            fill="#475569"
            stroke="#64748b"
            strokeWidth="2"
          />
          <rect
            x={cx / scale - 20}
            y={(cy - 95) / scale}
            width="15"
            height="220"
            rx="2"
            fill="rgba(255,255,255,0.15)"
          />
          <rect
            x={cx / scale + 20}
            y={(cy - 110) / scale}
            width="100"
            height="40"
            rx="4"
            fill="#475569"
            stroke="#64748b"
            strokeWidth="2"
          />
          <rect
            x={cx / scale - 130}
            y={(cy + 95) / scale}
            width="110"
            height="40"
            rx="4"
            fill="#475569"
            stroke="#64748b"
            strokeWidth="2"
          />
        </g>
        <g
          transform={`translate(${cx + 22 * scale},${cy - 88 * scale}) rotate(45) scale(${scale})`}
          opacity="0"
        >
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.4s"
            begin="0.8s"
            fill="freeze"
          />
          <rect x="-25" y="-4" width="50" height="8" fill="#60a5fa" rx="2" />
        </g>
        <g
          transform={`translate(${cx - 22 * scale},${cy + 118 * scale}) rotate(-45) scale(${scale})`}
          opacity="0"
        >
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.4s"
            begin="0.8s"
            fill="freeze"
          />
          <rect x="-25" y="-4" width="50" height="8" fill="#60a5fa" rx="2" />
        </g>
        <line
          x1={cx + 150 * scale}
          y1={cy - 60 * scale}
          x2={cx + 22 * scale}
          y2={cy - 88 * scale}
          stroke={lightColor}
          strokeWidth={isMobile ? 3 : 5}
          strokeLinecap="round"
          opacity="0"
          filter="url(#glowP)"
        >
          <animate
            attributeName="opacity"
            values="0;0.4"
            dur="0.3s"
            begin="1.2s"
            fill="freeze"
          />
        </line>
        <line
          x1={cx + 150 * scale}
          y1={cy - 60 * scale}
          x2={cx + 22 * scale}
          y2={cy - 88 * scale}
          stroke={lightColor}
          strokeWidth={isMobile ? 2 : 3}
          strokeLinecap="round"
          opacity="0"
        >
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.5s"
            begin="1.2s"
            fill="freeze"
          />
          <animate
            attributeName="stroke-dasharray"
            values="0,200;200,0"
            dur="0.6s"
            begin="1.2s"
            fill="freeze"
          />
        </line>
        <line
          x1={cx + 22 * scale}
          y1={cy - 88 * scale}
          x2={cx - 22 * scale}
          y2={cy + 118 * scale}
          stroke={lightColor}
          strokeWidth={isMobile ? 3 : 5}
          strokeLinecap="round"
          opacity="0"
          filter="url(#glowP)"
        >
          <animate
            attributeName="opacity"
            values="0;0.4"
            dur="0.3s"
            begin="1.8s"
            fill="freeze"
          />
        </line>
        <line
          x1={cx + 22 * scale}
          y1={cy - 88 * scale}
          x2={cx - 22 * scale}
          y2={cy + 118 * scale}
          stroke={lightColor}
          strokeWidth={isMobile ? 2 : 3}
          strokeLinecap="round"
          opacity="0"
        >
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.5s"
            begin="1.8s"
            fill="freeze"
          />
          <animate
            attributeName="stroke-dasharray"
            values="0,250;250,0"
            dur="0.8s"
            begin="1.8s"
            fill="freeze"
          />
        </line>
        <line
          x1={cx - 22 * scale}
          y1={cy + 118 * scale}
          x2={cx - 100 * scale}
          y2={cy + 115 * scale}
          stroke={lightColor}
          strokeWidth={isMobile ? 3 : 5}
          strokeLinecap="round"
          opacity="0"
          filter="url(#glowP)"
        >
          <animate
            attributeName="opacity"
            values="0;0.4"
            dur="0.3s"
            begin="2.6s"
            fill="freeze"
          />
        </line>
        <line
          x1={cx - 22 * scale}
          y1={cy + 118 * scale}
          x2={cx - 100 * scale}
          y2={cy + 115 * scale}
          stroke={lightColor}
          strokeWidth={isMobile ? 2 : 3}
          strokeLinecap="round"
          opacity="0"
        >
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.5s"
            begin="2.6s"
            fill="freeze"
          />
          <animate
            attributeName="stroke-dasharray"
            values="0,100;100,0"
            dur="0.5s"
            begin="2.6s"
            fill="freeze"
          />
        </line>
        <g
          transform={`translate(${cx - 120 * scale},${cy + 115 * scale}) scale(${scale})`}
          opacity="0"
        >
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.4s"
            begin="3s"
            fill="freeze"
          />
          <ellipse
            cx="0"
            cy="0"
            rx="18"
            ry="22"
            fill="#F5F5F5"
            stroke="#4E4E4E"
            strokeWidth="2"
          />
          <ellipse cx="0" cy="0" rx="10" ry="13" fill="#4A4DC9" />
          <ellipse cx="0" cy="0" rx="5" ry="7" fill="#4E4E4E" />
          <circle cx="-2" cy="-3" r="2" fill="#fff" />
        </g>
        <text
          x={cx - 120 * scale}
          y={cy + 145 * scale}
          textAnchor="middle"
          fill="#F5F5F5"
          fontSize={isMobile ? 9 : 11}
          fontWeight="500"
          opacity="0"
        >
          Observer
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.3s"
            begin="3.2s"
            fill="freeze"
          />
        </text>
        {!isMobile && (
          <>
            <text
              x={cx + 55 * scale}
              y={cy - 105 * scale}
              fill="#fbbf24"
              fontSize={11}
              fontWeight="bold"
              opacity="0"
            >
              Mirror 1 (45°)
              <animate
                attributeName="opacity"
                values="0;1"
                dur="0.3s"
                begin="1s"
                fill="freeze"
              />
            </text>
            <text
              x={cx - 80 * scale}
              y={cy + 155 * scale}
              fill="#fbbf24"
              fontSize={11}
              fontWeight="bold"
              opacity="0"
            >
              Mirror 2 (45°)
              <animate
                attributeName="opacity"
                values="0;1"
                dur="0.3s"
                begin="1s"
                fill="freeze"
              />
            </text>
          </>
        )}
        <rect
          x={cx - (isMobile ? 145 : 170)}
          y={svgH - (isMobile ? 48 : 55)}
          width={isMobile ? 290 : 340}
          height={isMobile ? 38 : 42}
          rx="10"
          fill="rgba(255,255,255,0.95)"
          opacity="0"
        >
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.4s"
            begin="3.5s"
            fill="freeze"
          />
        </rect>
        <text
          x={cx}
          y={svgH - (isMobile ? 22 : 28)}
          textAnchor="middle"
          fill="#4E4E4E"
          fontSize={isMobile ? 12 : 14}
          fontWeight="bold"
          opacity="0"
        >
          Two 45° mirrors redirect light by 180°!
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.4s"
            begin="3.7s"
            fill="freeze"
          />
        </text>
      </svg>
    );
  };

  // Kaleidoscope Scene
  const KaleidoscopeScene = () => {
    const cx = svgW / 2,
      cy = svgH / 2 - 10;
    const scale = isMobile ? 0.65 : isTablet ? 0.8 : 1;
    const colors = [
      "#ef4444",
      "#f59e0b",
      "#10b981",
      "#4A4DC9",
      "#8b5cf6",
      "#ec4899",
      "#06b6d4",
      "#84cc16",
    ];
    const starCount = isMobile ? 15 : 30;

    return (
      <svg
        width={svgW}
        height={svgH}
        key={animKey}
        style={{ borderRadius: 12, background: "#0a0a0a" }}
      >
        <defs>
          <radialGradient id="kScope">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="70%" stopColor="#0f0f1a" />
            <stop offset="100%" stopColor="#000" />
          </radialGradient>
          <clipPath id="scopeClip">
            <circle cx={cx} cy={cy} r={145 * scale} />
          </clipPath>
          <filter id="gemGlow">
            <feGaussianBlur stdDeviation="2" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="tubeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1f2937" />
            <stop offset="50%" stopColor="#374151" />
            <stop offset="100%" stopColor="#1f2937" />
          </linearGradient>
        </defs>

        <text
          x={cx}
          y={24}
          textAnchor="middle"
          fill="#F5F5F5"
          fontSize={titleSize}
          fontWeight="bold"
          opacity="0"
        >
          Kaleidoscope Magic
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.6s"
            fill="freeze"
          />
        </text>

        {Array.from({ length: starCount }).map((_, i) => (
          <circle
            key={i}
            cx={50 + ((i * 23) % svgW)}
            cy={40 + ((i * 17) % (svgH - 100))}
            r={Math.random() > 0.5 ? 1 : 1.5}
            fill="#fff"
            opacity="0"
          >
            <animate
              attributeName="opacity"
              values="0;0.3;0.8;0.3;0"
              dur={`${2 + (i % 3)}s`}
              repeatCount="indefinite"
              begin={`${i * 0.1}s`}
            />
          </circle>
        ))}

        <circle
          cx={cx}
          cy={cy}
          r={155 * scale}
          fill="url(#tubeGrad)"
          opacity="0"
        >
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.5s"
            fill="freeze"
          />
        </circle>
        <circle cx={cx} cy={cy} r={150 * scale} fill="#111827" opacity="0">
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.5s"
            fill="freeze"
          />
        </circle>

        <circle cx={cx} cy={cy} r={145 * scale} fill="url(#kScope)" opacity="0">
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.5s"
            fill="freeze"
          />
        </circle>

        <g clipPath="url(#scopeClip)" opacity="0">
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.8s"
            begin="0.3s"
            fill="freeze"
          />

          <g>
            <animateTransform
              attributeName="transform"
              type="rotate"
              from={`0 ${cx} ${cy}`}
              to={`360 ${cx} ${cy}`}
              dur="30s"
              repeatCount="indefinite"
            />

            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <g key={`sector-${i}`} transform={`rotate(${angle} ${cx} ${cy})`}>
                <line
                  x1={cx}
                  y1={cy}
                  x2={cx}
                  y2={cy - 140 * scale}
                  stroke="#4b5563"
                  strokeWidth="1"
                  opacity="0.5"
                />

                <polygon
                  points={`${cx},${cy - 40 * scale} ${cx - 12 * scale},${cy - 65 * scale} ${cx + 12 * scale},${cy - 65 * scale}`}
                  fill={colors[i % 8]}
                  filter="url(#gemGlow)"
                  opacity="0.9"
                >
                  <animate
                    attributeName="opacity"
                    values="0.7;1;0.7"
                    dur={`${2 + i * 0.3}s`}
                    repeatCount="indefinite"
                  />
                </polygon>

                <circle
                  cx={cx + 8 * scale}
                  cy={cy - 85 * scale}
                  r={10 * scale}
                  fill={colors[(i + 1) % 8]}
                  filter="url(#gemGlow)"
                >
                  <animate
                    attributeName="r"
                    values={`${8 * scale};${12 * scale};${8 * scale}`}
                    dur={`${1.5 + i * 0.2}s`}
                    repeatCount="indefinite"
                  />
                </circle>

                <polygon
                  points={`${cx - 5 * scale},${cy - 105 * scale} ${cx - 15 * scale},${cy - 115 * scale} ${cx - 5 * scale},${cy - 125 * scale} ${cx + 5 * scale},${cy - 115 * scale}`}
                  fill={colors[(i + 2) % 8]}
                  filter="url(#gemGlow)"
                  opacity="0.85"
                >
                  <animate
                    attributeName="opacity"
                    values="0.6;0.95;0.6"
                    dur={`${2.5 + i * 0.2}s`}
                    repeatCount="indefinite"
                  />
                </polygon>

                <circle
                  cx={cx - 18 * scale}
                  cy={cy - 55 * scale}
                  r={5 * scale}
                  fill={colors[(i + 3) % 8]}
                  opacity="0.8"
                >
                  <animate
                    attributeName="r"
                    values={`${4 * scale};${7 * scale};${4 * scale}`}
                    dur={`${1.8 + i * 0.15}s`}
                    repeatCount="indefinite"
                  />
                </circle>
                <circle
                  cx={cx + 15 * scale}
                  cy={cy - 70 * scale}
                  r={4 * scale}
                  fill={colors[(i + 4) % 8]}
                  opacity="0.75"
                />

                <ellipse
                  cx={cx}
                  cy={cy - 130 * scale}
                  rx={8 * scale}
                  ry={14 * scale}
                  fill={colors[(i + 5) % 8]}
                  opacity="0.7"
                  transform={`rotate(${15} ${cx} ${cy - 130 * scale})`}
                >
                  <animate
                    attributeName="opacity"
                    values="0.5;0.85;0.5"
                    dur={`${3 + i * 0.25}s`}
                    repeatCount="indefinite"
                  />
                </ellipse>
              </g>
            ))}

            <circle cx={cx} cy={cy} r={25 * scale} fill="#fbbf24" opacity="0.3">
              <animate
                attributeName="r"
                values={`${20 * scale};${30 * scale};${20 * scale}`}
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.2;0.4;0.2"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx={cx} cy={cy} r={15 * scale} fill="#fef3c7" opacity="0.5">
              <animate
                attributeName="r"
                values={`${12 * scale};${18 * scale};${12 * scale}`}
                dur="1.5s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx={cx} cy={cy} r={8 * scale} fill="#fff" opacity="0.8" />
          </g>
        </g>

        <ellipse
          cx={cx - 50 * scale}
          cy={cy - 50 * scale}
          rx={40 * scale}
          ry={25 * scale}
          fill="rgba(255,255,255,0.1)"
          transform={`rotate(-30 ${cx - 50 * scale} ${cy - 50 * scale})`}
          opacity="0"
        >
          <animate
            attributeName="opacity"
            values="0;0.15"
            dur="0.5s"
            begin="0.5s"
            fill="freeze"
          />
        </ellipse>

        <circle
          cx={cx}
          cy={cy}
          r={148 * scale}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="2"
          opacity="0"
        >
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.5s"
            begin="0.3s"
            fill="freeze"
          />
        </circle>

        {!isMobile && (
          <text
            x={cx + 165 * scale}
            y={cy - 60 * scale}
            fill="#60a5fa"
            fontSize={10}
            fontWeight="600"
            opacity="0"
          >
            60°
            <animate
              attributeName="opacity"
              values="0;1"
              dur="0.4s"
              begin="1s"
              fill="freeze"
            />
          </text>
        )}

        <rect
          x={cx - (isMobile ? 145 : 200)}
          y={svgH - (isMobile ? 68 : 75)}
          width={isMobile ? 290 : 400}
          height={isMobile ? 56 : 60}
          rx="12"
          fill="rgba(17,24,39,0.95)"
          stroke="#ec4899"
          strokeWidth="2"
          opacity="0"
        >
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.5s"
            begin="1.5s"
            fill="freeze"
          />
        </rect>
        <text
          x={cx}
          y={svgH - (isMobile ? 42 : 48)}
          textAnchor="middle"
          fill="#F5F5F5"
          fontSize={isMobile ? 11 : 14}
          opacity="0"
        >
          3 mirrors at 60° angles create
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.4s"
            begin="1.7s"
            fill="freeze"
          />
        </text>
        <text
          x={cx}
          y={svgH - (isMobile ? 22 : 26)}
          textAnchor="middle"
          fill="#ec4899"
          fontSize={isMobile ? 12 : 15}
          fontWeight="bold"
          opacity="0"
        >
          6-fold symmetric reflections!
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.4s"
            begin="1.9s"
            fill="freeze"
          />
        </text>
      </svg>
    );
  };

  // Interactive Scene
  const InteractiveScene = () => {
    const cx = svgW / 2,
      cy = svgH / 2 - 30;
    const scale = isMobile ? 0.7 : isTablet ? 0.85 : 1;
    const lx = cx - 180 * scale,
      ly = cy - 100 * scale;
    const mRad = (mirrorAngle * Math.PI) / 180;
    const iv = { x: cx - lx, y: cy - ly };
    const nv = { x: -Math.sin(mRad), y: -Math.cos(mRad) };
    const dot = iv.x * nv.x + iv.y * nv.y;
    const rv = { x: iv.x - 2 * dot * nv.x, y: iv.y - 2 * dot * nv.y };
    const rm = Math.hypot(rv.x, rv.y);
    const rex = cx + (rv.x / rm) * 150 * scale,
      rey = cy + (rv.y / rm) * 150 * scale;
    const iAng = Math.abs(
      (Math.atan2(
        iv.x * Math.cos(mRad) - iv.y * Math.sin(mRad),
        iv.x * Math.sin(mRad) + iv.y * Math.cos(mRad),
      ) *
        180) /
        Math.PI -
        90,
    );

    return (
      <svg
        width={svgW}
        height={svgH}
        style={{
          borderRadius: 12,
          background: darkMode
            ? "#0f172a"
            : "linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)",
        }}
      >
        <defs>
          <filter id="glowI">
            <feGaussianBlur stdDeviation="4" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <text
          x={cx}
          y={22}
          textAnchor="middle"
          fill={darkMode ? "#e2e8f0" : "#4E4E4E"}
          fontSize={titleSize}
          fontWeight="bold"
        >
          Interactive Mirror Experiment
        </text>
        <g opacity="0.1">
          {Array.from({ length: isMobile ? 12 : 20 }).map((_, i) => (
            <line
              key={`v${i}`}
              x1={i * (svgW / (isMobile ? 12 : 20))}
              y1={35}
              x2={i * (svgW / (isMobile ? 12 : 20))}
              y2={svgH - (isMobile ? 80 : 100)}
              stroke={darkMode ? "#fff" : "#000"}
              strokeWidth="1"
            />
          ))}
          {Array.from({ length: isMobile ? 6 : 10 }).map((_, i) => (
            <line
              key={`h${i}`}
              x1={0}
              y1={
                35 + i * ((svgH - (isMobile ? 115 : 135)) / (isMobile ? 6 : 10))
              }
              x2={svgW}
              y2={
                35 + i * ((svgH - (isMobile ? 115 : 135)) / (isMobile ? 6 : 10))
              }
              stroke={darkMode ? "#fff" : "#000"}
              strokeWidth="1"
            />
          ))}
        </g>
        <g
          transform={`translate(${cx},${cy}) rotate(${mirrorAngle}) scale(${scale})`}
        >
          <rect
            x="-8"
            y="-100"
            width="16"
            height="200"
            fill="url(#mg1)"
            rx="3"
          />
          <rect
            x="-5"
            y="-95"
            width="4"
            height="190"
            fill="rgba(255,255,255,0.4)"
            rx="1"
          />
        </g>
        <g
          transform={`translate(${cx},${cy}) rotate(${mirrorAngle}) scale(${scale})`}
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="-120"
            stroke={darkMode ? "#94a3b8" : "#64748b"}
            strokeWidth="2"
            strokeDasharray="8,6"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="0;-28"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </line>
          <text
            x="30"
            y="-100"
            fill={darkMode ? "#cbd5e1" : "#475569"}
            fontSize={isMobile ? 11 : 13}
            fontWeight="500"
          >
            Normal
          </text>
        </g>
        <circle cx={lx} cy={ly} r={40 * scale} fill="url(#lg1)">
          <animate
            attributeName="r"
            values={`${35 * scale};${45 * scale};${35 * scale}`}
            dur="1.5s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx={lx} cy={ly} r={15 * scale} fill={lightColor}>
          <animate
            attributeName="r"
            values={`${13 * scale};${17 * scale};${13 * scale}`}
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx={lx} cy={ly} r={6 * scale} fill="#fff" />
        <text
          x={lx}
          y={ly - 50 * scale}
          textAnchor="middle"
          fill={lightColor}
          fontSize={isMobile ? 10 : 13}
          fontWeight="600"
        >
          Light Source
        </text>
        <line
          x1={lx}
          y1={ly}
          x2={cx}
          y2={cy}
          stroke={lightColor}
          strokeWidth={isMobile ? 4 : 6}
          strokeLinecap="round"
          opacity="0.3"
          filter="url(#glowI)"
        />
        <line
          x1={lx}
          y1={ly}
          x2={cx}
          y2={cy}
          stroke={lightColor}
          strokeWidth={isMobile ? 2 : 3}
          strokeLinecap="round"
        />
        <polygon
          points={`0,${-6 * scale} ${12 * scale},0 0,${6 * scale}`}
          fill={lightColor}
          transform={`translate(${cx},${cy}) rotate(${(Math.atan2(cy - ly, cx - lx) * 180) / Math.PI})`}
        />
        <line
          x1={cx}
          y1={cy}
          x2={rex}
          y2={rey}
          stroke="#10b981"
          strokeWidth={isMobile ? 4 : 6}
          strokeLinecap="round"
          opacity="0.3"
          filter="url(#glowI)"
        />
        <line
          x1={cx}
          y1={cy}
          x2={rex}
          y2={rey}
          stroke="#10b981"
          strokeWidth={isMobile ? 2 : 3}
          strokeLinecap="round"
        />
        <polygon
          points={`0,${-6 * scale} ${12 * scale},0 0,${6 * scale}`}
          fill="#10b981"
          transform={`translate(${rex},${rey}) rotate(${(Math.atan2(rey - cy, rex - cx) * 180) / Math.PI})`}
        />
        <circle
          cx={cx}
          cy={cy}
          r={10 * scale}
          fill="#fff"
          stroke={lightColor}
          strokeWidth="3"
        >
          <animate
            attributeName="r"
            values={`${8 * scale};${12 * scale};${8 * scale}`}
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
        <g
          transform={`translate(${cx},${cy}) rotate(${mirrorAngle}) scale(${scale})`}
        >
          <path
            d={`M 0 -50 A 50 50 0 0 0 ${-50 * Math.sin((iAng * Math.PI) / 180)} ${-50 * Math.cos((iAng * Math.PI) / 180)}`}
            fill="none"
            stroke="#ef4444"
            strokeWidth="3"
          />
          <path
            d={`M 0 -50 A 50 50 0 0 1 ${50 * Math.sin((iAng * Math.PI) / 180)} ${-50 * Math.cos((iAng * Math.PI) / 180)}`}
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
          />
        </g>
        <text
          x={cx - 80 * scale}
          y={cy - 60 * scale}
          fill="#ef4444"
          fontSize={isMobile ? 14 : 18}
          fontWeight="bold"
        >
          i = {Math.round(iAng)}°
        </text>
        <text
          x={cx + 30 * scale}
          y={cy - 60 * scale}
          fill="#10b981"
          fontSize={isMobile ? 14 : 18}
          fontWeight="bold"
        >
          r = {Math.round(iAng)}°
        </text>
        {!isMobile && (
          <>
            <text
              x={(lx + cx) / 2 - 30 * scale}
              y={(ly + cy) / 2 - 15}
              fill={lightColor}
              fontSize={12}
              fontWeight="600"
            >
              Incident Ray
            </text>
            <text
              x={(cx + rex) / 2 + 15 * scale}
              y={(cy + rey) / 2 - 10}
              fill="#10b981"
              fontSize={12}
              fontWeight="600"
            >
              Reflected Ray
            </text>
          </>
        )}
        <rect
          x={cx - (isMobile ? 140 : 160)}
          y={svgH - (isMobile ? 75 : 85)}
          width={isMobile ? 280 : 320}
          height={isMobile ? 42 : 50}
          rx="12"
          fill={darkMode ? "rgba(30,41,59,0.95)" : "rgba(255,255,255,0.95)"}
          stroke="#10b981"
          strokeWidth="2"
        />
        <text
          x={cx}
          y={svgH - (isMobile ? 47 : 55)}
          textAnchor="middle"
          fill={darkMode ? "#e2e8f0" : "#4E4E4E"}
          fontSize={isMobile ? 13 : 16}
          fontWeight="bold"
        >
          Law: Angle i = Angle r
        </text>
      </svg>
    );
  };

  const renderScene = () => {
    if (currentMode === "learn") {
      switch (currentStepData.id) {
        case 1:
          return <BasicReflectionScene />;
        case 2:
          return <LightPathScene />;
        case 3:
          return <LawsScene />;
        case 4:
          return <MirrorImageScene />;
        default:
          return <BasicReflectionScene />;
      }
    } else if (currentMode === "real_world") {
      switch (currentStepData.id) {
        case 8:
          return <DailyMirrorsScene />;
        case 9:
          return <PeriscopeScene />;
        case 10:
          return <KaleidoscopeScene />;
        default:
          return <DailyMirrorsScene />;
      }
    } else if (currentMode === "hands_on") {
      return <InteractiveScene />;
    }
    return null;
  };

  const renderPractice = () => {
    const qs: Record<number, { q: string; o: string[] }> = {
      5: {
        q: "What happens when light hits a mirror?",
        o: [
          "A) It passes through",
          "B) It bounces back",
          "C) It stops",
          "D) It disappears",
        ],
      },
      6: {
        q: "How does light travel?",
        o: [
          "A) In straight lines",
          "B) In curved paths",
          "C) In circles",
          "D) Randomly",
        ],
      },
      7: {
        q: "If light hits a mirror at 30° from the normal, at what angle does it reflect?",
        o: ["A) 60 degrees", "B) 30 degrees", "C) 90 degrees", "D) 45 degrees"],
      },
    };
    const cq = qs[currentStepData.id];
    if (!cq) return null;
    const correct: Record<number, string> = { 5: "B", 6: "A", 7: "B" };

    return (
      <div
        style={{
          padding: isMobile ? 16 : 24,
          background: darkMode ? "#1e293b" : "#F5F5F5",
          borderRadius: 16,
          minHeight: isMobile ? 300 : 350,
        }}
      >
        <div
          style={{
            fontSize: isMobile ? 16 : 20,
            fontWeight: "bold",
            marginBottom: isMobile ? 16 : 24,
            color: darkMode ? "#e2e8f0" : "#4E4E4E",
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          {cq.q}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? 10 : 14,
            maxWidth: 500,
            margin: "0 auto",
          }}
        >
          {cq.o.map((opt, idx) => {
            const letter = opt.charAt(0);
            const sel = userAnswer === letter;
            const res = showFeedback && sel;
            const isCA = showFeedback && correct[currentStepData.id] === letter;
            return (
              <button
                key={idx}
                onClick={() => {
                  if (!showFeedback) {
                    setUserAnswer(letter);
                    checkAnswer(currentStepData.id, letter);
                  }
                }}
                disabled={showFeedback}
                style={{
                  padding: isMobile ? "12px 16px" : "16px 20px",
                  fontSize: isMobile ? 14 : 16,
                  borderRadius: 12,
                  border: `3px solid ${res ? (isCorrect ? "#10b981" : "#ef4444") : isCA ? "#10b981" : sel ? themeColor : darkMode ? "#475569" : "#EBEBEB"}`,
                  backgroundColor: res
                    ? isCorrect
                      ? "#d1fae5"
                      : "#fee2e2"
                    : isCA
                      ? "#d1fae5"
                      : sel
                        ? `${themeColor}15`
                        : darkMode
                          ? "#334155"
                          : "#ffffff",
                  color: darkMode ? "#e2e8f0" : "#4E4E4E",
                  cursor: showFeedback ? "default" : "pointer",
                  textAlign: "left",
                  transition: "all 0.3s ease",
                  transform: sel && !showFeedback ? "scale(1.02)" : "scale(1)",
                  fontWeight: sel || isCA ? "600" : "400",
                  minHeight: isMobile ? 44 : 48,
                }}
              >
                {opt}
                {res && (
                  <span
                    style={{ float: "right", fontSize: isMobile ? 18 : 20 }}
                  >
                    {isCorrect ? "✓" : "✗"}
                  </span>
                )}
                {isCA && !sel && (
                  <span
                    style={{ float: "right", fontSize: isMobile ? 18 : 20 }}
                  >
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {showFeedback && (
          <div
            style={{
              marginTop: isMobile ? 16 : 24,
              padding: isMobile ? 12 : 16,
              borderRadius: 12,
              backgroundColor: isCorrect ? "#d1fae5" : "#fee2e2",
              color: isCorrect ? "#065f46" : "#991b1b",
              fontSize: isMobile ? 15 : 18,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {isCorrect
              ? "🎉 Correct! Great job!"
              : "❌ Not quite. The correct answer is highlighted above."}
          </div>
        )}
        <div
          style={{
            marginTop: isMobile ? 14 : 20,
            padding: isMobile ? 12 : 16,
            borderRadius: 12,
            backgroundColor: darkMode ? "#0f172a" : "#e0f2fe",
            textAlign: "center",
            fontSize: isMobile ? 14 : 16,
            fontWeight: "600",
            color: darkMode ? "#e2e8f0" : "#4E4E4E",
          }}
        >
          Score: {practiceScore} / {totalSteps}
        </div>
      </div>
    );
  };

  const renderHandsOn = () => (
    <div
      style={{
        marginTop: isMobile ? 14 : 20,
        padding: isMobile ? "0 12px" : "0 20px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: isMobile ? 8 : 12,
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? 8 : 0,
        }}
      >
        <span
          style={{
            fontSize: isMobile ? 14 : 16,
            fontWeight: "600",
            color: darkMode ? "#e2e8f0" : "#4E4E4E",
          }}
        >
          Mirror Angle:
        </span>
        <span
          style={{
            fontSize: isMobile ? 20 : 24,
            fontWeight: "bold",
            color: themeColor,
            background: darkMode ? "#533086" : "#FFF3E4",
            padding: isMobile ? "6px 12px" : "8px 16px",
            borderRadius: 8,
          }}
        >
          {mirrorAngle}°
        </span>
      </div>
      <input
        type="range"
        min="-60"
        max="60"
        value={mirrorAngle}
        onChange={(e) => setMirrorAngle(Number(e.target.value))}
        style={{
          width: "100%",
          height: isMobile ? 8 : 12,
          borderRadius: 6,
          outline: "none",
          cursor: "pointer",
          accentColor: themeColor,
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 8,
          fontSize: isMobile ? 11 : 13,
          color: darkMode ? "#94a3b8" : "#64748b",
        }}
      >
        <span>-60°</span>
        <span>0° (Vertical)</span>
        <span>+60°</span>
      </div>
      {!handsOnCompleted ? (
        <button
          onClick={() => setHandsOnCompleted(true)}
          style={{
            marginTop: isMobile ? 16 : 24,
            padding: isMobile ? "12px 20px" : "14px 28px",
            fontSize: isMobile ? 14 : 16,
            fontWeight: "bold",
            borderRadius: 12,
            border: "none",
            backgroundColor: themeColor,
            color: "#ffffff",
            cursor: "pointer",
            width: "100%",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 12px rgba(74, 77, 201, 0.3)",
            minHeight: 48,
          }}
        >
          ✓ Complete Experiment
        </button>
      ) : (
        <div
          style={{
            marginTop: isMobile ? 16 : 24,
            padding: isMobile ? 12 : 16,
            borderRadius: 12,
            backgroundColor: "#d1fae5",
            color: "#065f46",
            fontSize: isMobile ? 14 : 16,
            fontWeight: "bold",
            textAlign: "center",
            border: "2px solid #10b981",
          }}
        >
          🎉 Experiment Completed! Angle i = Angle r
        </div>
      )}
    </div>
  );

  const tabStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    padding: isMobile ? "12px 8px" : "16px 24px",
    border: "none",
    backgroundColor: "transparent",
    fontSize: isMobile ? 13 : 15,
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    color: active ? themeColor : darkMode ? "#94a3b8" : "#64748b",
    borderBottom: active ? `3px solid ${themeColor}` : "3px solid transparent",
    minHeight: isMobile ? 44 : "auto",
  });

  const btnStyle = (dis: boolean): React.CSSProperties => ({
    padding: isMobile ? "10px 16px" : "12px 24px",
    fontSize: isMobile ? 13 : 15,
    fontWeight: "600",
    borderRadius: 12,
    border: "none",
    cursor: dis ? "not-allowed" : "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: isMobile ? 44 : 40,
    flex: isMobile ? 1 : "auto",
    backgroundColor: dis ? (darkMode ? "#334155" : "#EBEBEB") : themeColor,
    color: dis ? (darkMode ? "#64748b" : "#94a3b8") : "#ffffff",
    boxShadow: dis ? "none" : "0 4px 12px rgba(74, 77, 201, 0.25)",
  });

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 800,
        minHeight: isMobile ? 500 : isTablet ? 550 : 600,
        backgroundColor: darkMode ? "#1e293b" : "#F5F5F5",
        borderRadius: isMobile ? 16 : 20,
        boxShadow: "0 10px 40px rgba(74, 77, 201, 0.15)",
        overflow: "hidden",
        fontFamily:
          '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        margin: "0 auto",
      }}
    >
      {showModeSelector && (
        <div
          style={{
            display: "flex",
            borderBottom: `2px solid ${darkMode ? "#334155" : "#EBEBEB"}`,
            backgroundColor: darkMode ? "#0f172a" : "#C1C1EA",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {enabledModes.includes("learn") && (
            <button
              style={tabStyle(currentMode === "learn")}
              onClick={() => handleModeChange("learn")}
            >
              📚 Learn
            </button>
          )}
          {enabledModes.includes("practice") && (
            <button
              style={tabStyle(currentMode === "practice")}
              onClick={() => handleModeChange("practice")}
            >
              ✏️ Practice
            </button>
          )}
          {enabledModes.includes("real_world") && (
            <button
              style={tabStyle(currentMode === "real_world")}
              onClick={() => handleModeChange("real_world")}
            >
              🌍 Real World
            </button>
          )}
          {enabledModes.includes("hands_on") && (
            <button
              style={tabStyle(currentMode === "hands_on")}
              onClick={() => handleModeChange("hands_on")}
            >
              🔬 Hands On
            </button>
          )}
        </div>
      )}
      <div style={{ padding: isMobile ? 16 : isTablet ? 24 : 32, paddingBottom: isMobile ? 16 : 24 }}>
        <h2
          style={{
            fontSize: headingSize,
            fontWeight: "bold",
            marginBottom: isMobile ? 8 : 10,
            color: darkMode ? "#e2e8f0" : "#4E4E4E",
            lineHeight: 1.3,
          }}
        >
          {currentStepData?.title}
        </h2>
        <p
          style={{
            fontSize: descSize,
            marginBottom: isMobile ? 14 : 20,
            color: darkMode ? "#cbd5e1" : "#4E4E4E",
            lineHeight: 1.6,
            opacity: 0.9,
          }}
        >
          {currentStepData?.description}
        </p>
        {currentMode === "practice" ? (
          renderPractice()
        ) : (
          <>
            {renderScene()}
            {currentMode === "hands_on" && renderHandsOn()}
          </>
        )}
      </div>
      {showNavigation && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: isMobile ? 12 : 24,
            borderTop: `2px solid ${darkMode ? "#334155" : "#EBEBEB"}`,
            backgroundColor: darkMode ? "#0f172a" : "#C1C1EA",
            gap: isMobile ? 8 : 12,
            flexWrap: isMobile ? "wrap" : "nowrap",
          }}
        >
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            style={btnStyle(currentStep === 1)}
          >
            {isMobile ? "←" : "← Previous"}
          </button>
          {showStepIndicator && (
            <div
              style={{
                fontSize: isMobile ? 14 : 16,
                fontWeight: "600",
                color: darkMode ? "#e2e8f0" : "#4E4E4E",
                background: darkMode ? "#334155" : "#C1C1EA",
                padding: isMobile ? "6px 12px" : "8px 16px",
                borderRadius: 20,
                order: isMobile ? 3 : 0,
                width: isMobile ? "100%" : "auto",
                textAlign: "center",
              }}
            >
              {currentStep} / {totalSteps}
            </div>
          )}
          {showPlayPause && !isMobile && (
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                ...btnStyle(false),
                backgroundColor: isPlaying ? "#ef4444" : themeColor,
              }}
            >
              {isPlaying ? "⏸ Pause" : "▶ Auto Play"}
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={currentStep === totalSteps}
            style={btnStyle(currentStep === totalSteps)}
          >
            {isMobile ? "→" : "Next →"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReflectionOfLight;
