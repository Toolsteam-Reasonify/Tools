import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  CSSProperties,
} from "react";

// ═══════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

type ModeType = "learn" | "practice" | "realWorld";

interface StepDetails {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  stepDescription: string;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  visualType: "matchbox" | "pipe" | "concept";
}

interface Application {
  id: number;
  title: string;
  description: string;
  icon: string;
  category: string;
  example: string;
}

interface StepData {
  id: number;
  title: string;
  description: string;
  activity: "matchbox" | "pipe" | "conclusion";
}

// ═══════════════════════════════════════════════════════════════════════════
// ADDITIONAL PROPS INTERFACE
// ═══════════════════════════════════════════════════════════════════════════

interface LightTravelAdditionalProps {
  // Step configuration
  customSteps?: StepData[];
  
  // Practice mode configuration
  customQuestions?: Question[];
  
  // Real world mode configuration
  customApplications?: Application[];
  
  // Canvas dimensions
  canvasWidth?: number;
  canvasHeight?: number;
  
  // Animation settings
  lightSpeed?: number;
  particleCount?: number;
  
  // Visual customization
  torchColor?: string;
  lightBeamColor?: string;
  matchboxColor?: string;
  pipeColor?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PROPS INTERFACE
// ═══════════════════════════════════════════════════════════════════════════

interface LightTravelToolProps {
  props?: {
    // Dimensions
    width?: number;
    height?: number;
    
    // Mode configuration
    initialMode?: ModeType;
    showModeSelector?: boolean;
    enabledModes?: ModeType[];
    
    // Navigation configuration
    showNavigation?: boolean;
    showPlayPause?: boolean;
    showStepIndicator?: boolean;
    
    // Step filtering
    initialStep?: number;
    filterSteps?: number[];
    
    // Animation configuration
    animationSpeed?: number;
    autoPlayDuration?: number;
    
    // Theme
    themeColor?: string;
    darkMode?: boolean;
    
    // Additional props
    additionalProps?: LightTravelAdditionalProps;
  };
  
  // External controls
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT DATA
// ═══════════════════════════════════════════════════════════════════════════

const DEFAULT_STEPS: StepData[] = [
  {
    id: 1,
    title: "Does Light Travel in a Straight Line?",
    description: "Let us do an activity to try to find out if light travels in a straight line. We will perform two different experiments to investigate this question.",
    activity: "matchbox",
  },
  {
    id: 2,
    title: "Activity 11.1: Matchbox Experiment Setup",
    description: "Take three matchboxes and make a hole in the inner tray of each matchbox, exactly at the same position. Arrange these three matchboxes in a straight line.",
    activity: "matchbox",
  },
  {
    id: 3,
    title: "Aligned Matchboxes - Light Passes Through",
    description: "Make sure that all three holes are exactly at the same height and are in a line. Place a torch light on one side and a screen on the other side. You can see a bright spot on the screen!",
    activity: "matchbox",
  },
  {
    id: 4,
    title: "Misaligned Matchboxes - Light is Blocked",
    description: "Move one of the matchboxes slightly to a side or up and down. When all three holes are not in the same line, we cannot obtain the light spot on the screen. This suggests that light travels in a straight line.",
    activity: "matchbox",
  },
  {
    id: 5,
    title: "Activity 11.2: Pipe Experiment",
    description: "Can we check this in some other way? Let us try to see the candle flame through a bent pipe! Take a long hollow pipe of some flexible material.",
    activity: "pipe",
  },
  {
    id: 6,
    title: "Straight Pipe - Candle Visible",
    description: "Align the pipe so that you can see the candle flame through the straight pipe. Light travels through the pipe and reaches your eyes.",
    activity: "pipe",
  },
  {
    id: 7,
    title: "Bent Pipe - Candle Not Visible",
    description: "Now, bend the pipe and try to see the candle flame again. Can you still see it? You cannot see the candle flame through a bent pipe. This shows that light travels in a straight line.",
    activity: "pipe",
  },
];

const DEFAULT_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "What happens when you place three matchboxes with holes in a straight line and shine light through them?",
    options: [
      "Light bends around the holes",
      "Light passes through all holes and creates a spot on the screen",
      "Light stops at the first matchbox",
      "Light spreads in all directions"
    ],
    correctAnswer: 1,
    explanation: "When the holes are aligned in a straight line, light passes through all of them and creates a bright spot on the screen. This proves that light travels in a straight line.",
    visualType: "matchbox"
  },
  {
    id: 2,
    question: "In the matchbox experiment, what happens when one matchbox is moved slightly up or down?",
    options: [
      "Light still passes through normally",
      "Light becomes brighter",
      "The light spot on the screen disappears",
      "Light changes color"
    ],
    correctAnswer: 2,
    explanation: "When the matchboxes are not aligned, the holes are not in the same straight line. Since light travels in a straight line, it cannot pass through misaligned holes.",
    visualType: "matchbox"
  },
  {
    id: 3,
    question: "Can you see a candle flame through a straight pipe?",
    options: [
      "No, never",
      "Yes, if the pipe is aligned properly",
      "Only if the pipe is very short",
      "Only if there is a mirror inside"
    ],
    correctAnswer: 1,
    explanation: "You can see the candle flame through a straight pipe when it is properly aligned. Light from the candle travels in a straight line through the pipe.",
    visualType: "pipe"
  },
  {
    id: 4,
    question: "What happens when you try to see a candle flame through a bent pipe?",
    options: [
      "You can see it more clearly",
      "You cannot see the flame",
      "The flame appears upside down",
      "The flame appears larger"
    ],
    correctAnswer: 1,
    explanation: "You cannot see the candle flame through a bent pipe because light travels in a straight line and cannot follow the curve.",
    visualType: "pipe"
  },
  {
    id: 5,
    question: "Why does light not travel through a bent pipe?",
    options: [
      "The pipe is too long",
      "Light is absorbed by the pipe material",
      "Light travels in a straight line and cannot follow the curve",
      "There is not enough light"
    ],
    correctAnswer: 2,
    explanation: "Light travels in a straight line and cannot change direction to follow a curved path.",
    visualType: "concept"
  },
  {
    id: 6,
    question: "What do both the matchbox and pipe experiments prove?",
    options: [
      "Light can bend around corners",
      "Light needs air to travel",
      "Light travels in a straight line",
      "Light travels in circles"
    ],
    correctAnswer: 2,
    explanation: "Both experiments demonstrate that light travels in a straight line.",
    visualType: "concept"
  },
  {
    id: 7,
    question: "If you want to see around a corner, what property of light prevents you from doing so directly?",
    options: [
      "Light is too slow",
      "Light travels in a straight line",
      "Light is too bright",
      "Light has no color"
    ],
    correctAnswer: 1,
    explanation: "You cannot see directly around a corner because light travels in a straight line.",
    visualType: "concept"
  },
  {
    id: 8,
    question: "In which situation would light NOT be able to pass through?",
    options: [
      "Three holes arranged in a perfect line",
      "A completely straight tunnel",
      "Three holes where the middle one is offset",
      "A straight glass tube"
    ],
    correctAnswer: 2,
    explanation: "Light cannot pass through when the middle hole is offset because the three holes are not in a straight line.",
    visualType: "matchbox"
  }
];

const DEFAULT_APPLICATIONS: Application[] = [
  {
    id: 1,
    title: "Periscopes in Submarines",
    description: "Submarines use periscopes to see above water while staying submerged. Periscopes use mirrors to redirect light in straight paths, allowing submariners to see the surface from below.",
    icon: "🔭",
    category: "Military & Navigation",
    example: "Two mirrors at 45° angles reflect light in straight lines to see over obstacles."
  },
  {
    id: 2,
    title: "Laser Pointers & Alignment",
    description: "Laser pointers create perfectly straight reference lines in construction and surveying. Because light travels in a straight line, lasers can accurately mark straight paths over long distances.",
    icon: "🔦",
    category: "Construction & Engineering",
    example: "Construction workers use laser levels to ensure walls are perfectly vertical."
  },
  {
    id: 3,
    title: "Fiber Optic Cables",
    description: "Fiber optic cables use the principle that light travels in straight lines within glass fiber. Light signals travel through long fiber paths to transmit internet data at the speed of light.",
    icon: "🌐",
    category: "Communication Technology",
    example: "Your internet uses fiber optics where light travels through thin glass fibers."
  },
  {
    id: 4,
    title: "Flashlights & Spotlights",
    description: "Flashlights create focused beams of light that travel in straight lines. Reflectors direct the light into a straight beam for illuminating specific areas.",
    icon: "🔦",
    category: "Lighting & Safety",
    example: "Emergency responders use spotlights that send straight beams to search in darkness."
  },
  {
    id: 5,
    title: "Cameras & Photography",
    description: "Cameras work because light travels in straight lines from the subject through the lens to the sensor. The straight-line path creates sharp, clear images.",
    icon: "📷",
    category: "Imaging & Art",
    example: "When you take a photo, light travels in straight lines through the camera lens."
  },
  {
    id: 6,
    title: "Solar Cookers",
    description: "Solar cookers use curved mirrors to redirect sunlight to a single point. Sunlight travels in straight lines, reflects off mirrors, and concentrates at the cooking pot.",
    icon: "☀️",
    category: "Sustainable Energy",
    example: "Solar cookers provide a free, clean way to cook food using focused sunlight."
  },
  {
    id: 7,
    title: "Shadows & Sundials",
    description: "Shadows form because light travels in straight lines and cannot bend around opaque objects. Ancient sundials used this to tell time by tracking shadows.",
    icon: "🌤️",
    category: "Astronomy & Time",
    example: "Sundials have been used for thousands of years using shadow positions."
  },
  {
    id: 8,
    title: "Traffic Signals",
    description: "Traffic lights are positioned so drivers have a clear straight-line view. Traffic engineers use the straight-line property to ensure signals are visible from safe distances.",
    icon: "🚦",
    category: "Transportation & Safety",
    example: "Traffic lights are placed high at intersections for clear straight-path visibility."
  },
  {
    id: 9,
    title: "Optical Instruments",
    description: "Microscopes, telescopes, and binoculars rely on light traveling in straight lines through lenses and mirrors to magnify distant or tiny objects.",
    icon: "🔬",
    category: "Science & Research",
    example: "Astronomers use telescopes that collect light traveling from distant stars."
  },
  {
    id: 10,
    title: "Barcode Scanners",
    description: "Barcode scanners use laser light that travels in straight lines to read patterns on products. The straight beam reflects differently from light and dark bars.",
    icon: "🏪",
    category: "Retail & Commerce",
    example: "Checkout scanners send straight beams across barcodes to read product codes."
  },
  {
    id: 11,
    title: "Medical Endoscopes",
    description: "Doctors use endoscopes to see inside the body. These instruments use fiber optic cables that guide light in straight paths through flexible tubes.",
    icon: "🏥",
    category: "Medical Technology",
    example: "Doctors examine internal organs using light through thin tubes."
  },
  {
    id: 12,
    title: "Stage Lighting",
    description: "Theater spotlights create dramatic effects by directing bright beams in straight lines onto performers. Lighting designers use predictable straight-path behavior.",
    icon: "🎭",
    category: "Entertainment & Arts",
    example: "Follow-spots track performers with straight beams creating dramatic effects."
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// EASING FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
const easeInOutQuad = (t: number): number => 
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const easeOutElastic = (t: number): number => {
  const c4 = (2 * Math.PI) / 3;
  return t === 0 ? 0 : t === 1 ? 1 
    : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};

// ═══════════════════════════════════════════════════════════════════════════
// SIMPLE ICON COMPONENTS (Pure SVG - No External Imports)
// ═══════════════════════════════════════════════════════════════════════════

const PlayIcon = ({ size = 24, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon = ({ size = 24, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
  </svg>
);

const ChevronLeftIcon = ({ size = 24, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const ChevronRightIcon = ({ size = 24, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const RotateCcwIcon = ({ size = 24, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M1 4v6h6M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
  </svg>
);

const LightbulbIcon = ({ size = 24, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M9 18h6M10 22h4M15 8a5 5 0 1 0-6 0c0 2 1 3 1 5h4c0-2 1-3 1-5z" />
  </svg>
);

const CheckCircleIcon = ({ size = 24, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

const XCircleIcon = ({ size = 24, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
  </svg>
);

const BookOpenIcon = ({ size = 24, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const ClipboardCheckIcon = ({ size = 24, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9l2 2 4-4" />
  </svg>
);

const GlobeIcon = ({ size = 24, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// CANVAS DRAWING FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

function drawIntro(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number
) {
  const centerX = width / 2;
  const centerY = height / 2;

  ctx.fillStyle = "#60A5FA";
  ctx.font = "bold 120px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(96, 165, 250, 0.5)";
  ctx.shadowBlur = 20;
  ctx.fillText("?", centerX, centerY);
  ctx.shadowBlur = 0;

  const numRays = 8;
  for (let i = 0; i < numRays; i++) {
    const angle = (i * (360 / numRays) + progress * 180) * (Math.PI / 180);
    const rayLength = 100 + Math.sin(progress * Math.PI + i) * 20;

    ctx.strokeStyle = `rgba(255, 215, 0, ${0.3 + Math.sin(progress * Math.PI + i) * 0.3})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX + Math.cos(angle) * 80, centerY + Math.sin(angle) * 80);
    ctx.lineTo(
      centerX + Math.cos(angle) * (80 + rayLength),
      centerY + Math.sin(angle) * (80 + rayLength)
    );
    ctx.stroke();
  }

  ctx.fillStyle = "#FFF";
  ctx.font = "bold 24px Arial";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 10;
  ctx.fillText("Does Light Travel in a Straight Line?", centerX, height - 50);
  ctx.shadowBlur = 0;
}

function drawMatchboxSetup(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number
) {
  const centerY = height / 2;
  const boxWidth = 80;
  const boxHeight = 50;
  const spacing = 150;
  const startX = width / 2 - spacing;

  for (let i = 0; i < 3; i++) {
    const x = startX + i * spacing;
    const y = centerY - boxHeight / 2;

    ctx.fillStyle = "#8B4513";
    ctx.strokeStyle = "#654321";
    ctx.lineWidth = 2;
    ctx.fillRect(x, y, boxWidth, boxHeight);
    ctx.strokeRect(x, y, boxWidth, boxHeight);

    ctx.fillStyle = "#D2691E";
    ctx.fillRect(x + 10, y + 10, boxWidth - 20, boxHeight - 20);

    const holeSize = Math.min(progress * 15, 15);
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(x + boxWidth / 2, centerY, holeSize, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#FFF";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`Box ${i + 1}`, x + boxWidth / 2, y + boxHeight + 25);
  }

  ctx.fillStyle = "#60A5FA";
  ctx.font = "bold 20px Arial";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 10;
  ctx.fillText("Make holes in the same position on each matchbox", width / 2, 80);
  ctx.shadowBlur = 0;
}

function drawMatchboxAligned(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number
) {
  const centerY = height / 2;
  const boxWidth = 80;
  const boxHeight = 50;
  const spacing = 150;
  const startX = width / 2 - spacing;

  const torchX = 50;
  const torchY = centerY;

  ctx.fillStyle = "#FFD700";
  ctx.beginPath();
  ctx.arc(torchX, torchY, 20, 0, Math.PI * 2);
  ctx.fill();

  const beamProgress = Math.min(progress, 1);
  const beamEndX = startX + 3 * spacing + 100;

  ctx.strokeStyle = `rgba(255, 215, 0, ${0.6 - progress * 0.2})`;
  ctx.lineWidth = 40;
  ctx.beginPath();
  ctx.moveTo(torchX + 20, torchY);
  ctx.lineTo(torchX + 20 + (beamEndX - torchX - 20) * beamProgress, torchY);
  ctx.stroke();

  ctx.strokeStyle = `rgba(255, 255, 150, 0.8)`;
  ctx.lineWidth = 15;
  ctx.beginPath();
  ctx.moveTo(torchX + 20, torchY);
  ctx.lineTo(torchX + 20 + (beamEndX - torchX - 20) * beamProgress, torchY);
  ctx.stroke();

  for (let i = 0; i < 3; i++) {
    const x = startX + i * spacing;
    const y = centerY - boxHeight / 2;

    ctx.fillStyle = "#8B4513";
    ctx.strokeStyle = "#654321";
    ctx.lineWidth = 2;
    ctx.fillRect(x, y, boxWidth, boxHeight);
    ctx.strokeRect(x, y, boxWidth, boxHeight);

    ctx.fillStyle = "#D2691E";
    ctx.fillRect(x + 10, y + 10, boxWidth - 20, boxHeight - 20);

    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(x + boxWidth / 2, centerY, 15, 0, Math.PI * 2);
    ctx.fill();
  }

  const screenX = beamEndX;
  ctx.fillStyle = "#FFF";
  ctx.fillRect(screenX, centerY - 100, 10, 200);

  if (beamProgress > 0.8) {
    const spotProgress = (beamProgress - 0.8) * 5;
    const spotSize = 30 * spotProgress;

    const gradient = ctx.createRadialGradient(screenX, centerY, 0, screenX, centerY, spotSize);
    gradient.addColorStop(0, "rgba(255, 255, 150, 0.9)");
    gradient.addColorStop(1, "rgba(255, 255, 150, 0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(screenX, centerY, spotSize, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "#10B981";
  ctx.font = "bold 20px Arial";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 10;
  ctx.fillText("Aligned holes - Light passes through!", width / 2, 80);
  ctx.shadowBlur = 0;
}

function drawMatchboxMisaligned(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number
) {
  const centerY = height / 2;
  const boxWidth = 80;
  const boxHeight = 50;
  const spacing = 150;
  const startX = width / 2 - spacing;

  const torchX = 50;
  const torchY = centerY;

  ctx.fillStyle = "#FFD700";
  ctx.beginPath();
  ctx.arc(torchX, torchY, 20, 0, Math.PI * 2);
  ctx.fill();

  const beamProgress = Math.min(progress, 1);
  const blockX = startX + spacing + boxWidth / 2 - 30;

  ctx.strokeStyle = `rgba(255, 215, 0, ${0.6 - progress * 0.2})`;
  ctx.lineWidth = 40;
  ctx.beginPath();
  ctx.moveTo(torchX + 20, torchY);
  ctx.lineTo(Math.min(torchX + 20 + (blockX - torchX - 20) * beamProgress, blockX), torchY);
  ctx.stroke();

  ctx.strokeStyle = `rgba(255, 255, 150, 0.8)`;
  ctx.lineWidth = 15;
  ctx.beginPath();
  ctx.moveTo(torchX + 20, torchY);
  ctx.lineTo(Math.min(torchX + 20 + (blockX - torchX - 20) * beamProgress, blockX), torchY);
  ctx.stroke();

  for (let i = 0; i < 3; i++) {
    const x = startX + i * spacing;
    let y = centerY - boxHeight / 2;

    const offset = i === 1 ? 30 * Math.sin(progress * Math.PI * 0.5) : 0;
    y += offset;

    ctx.fillStyle = i === 1 ? "#A0522D" : "#8B4513";
    ctx.strokeStyle = i === 1 ? "#8B4513" : "#654321";
    ctx.lineWidth = 2;
    ctx.fillRect(x, y, boxWidth, boxHeight);
    ctx.strokeRect(x, y, boxWidth, boxHeight);

    ctx.fillStyle = "#D2691E";
    ctx.fillRect(x + 10, y + 10, boxWidth - 20, boxHeight - 20);

    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(x + boxWidth / 2, y + boxHeight / 2, 15, 0, Math.PI * 2);
    ctx.fill();

    if (i === 1 && offset > 5) {
      ctx.strokeStyle = "#EF4444";
      ctx.fillStyle = "#EF4444";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x + boxWidth / 2, y - 30);
      ctx.lineTo(x + boxWidth / 2, y - 10);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x + boxWidth / 2, y - 10);
      ctx.lineTo(x + boxWidth / 2 - 5, y - 18);
      ctx.lineTo(x + boxWidth / 2 + 5, y - 18);
      ctx.closePath();
      ctx.fill();
    }
  }

  const screenX = startX + 3 * spacing + 100;
  ctx.fillStyle = "#FFF";
  ctx.fillRect(screenX, centerY - 100, 10, 200);

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

  ctx.fillStyle = "#EF4444";
  ctx.font = "bold 20px Arial";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 10;
  ctx.fillText("Misaligned holes - Light is blocked!", width / 2, 80);
  ctx.shadowBlur = 0;
}

function drawPipeIntro(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number
) {
  const centerX = width / 2;
  const centerY = height / 2;

  const pipeLength = 300 * Math.min(progress, 1);
  const pipeY = centerY;

  ctx.strokeStyle = "#64748B";
  ctx.lineWidth = 40;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(centerX - 150, pipeY);
  ctx.lineTo(centerX - 150 + pipeLength, pipeY);
  ctx.stroke();

  ctx.strokeStyle = "#94A3B8";
  ctx.lineWidth = 30;
  ctx.beginPath();
  ctx.moveTo(centerX - 150, pipeY);
  ctx.lineTo(centerX - 150 + pipeLength, pipeY);
  ctx.stroke();

  if (progress > 0.3) {
    const candleX = centerX - 180;
    const candleY = centerY + 50;

    ctx.fillStyle = "#F3E5AB";
    ctx.fillRect(candleX - 10, candleY, 20, 60);

    const flameSize = 20 + Math.sin(progress * Math.PI * 4) * 3;
    const gradient = ctx.createRadialGradient(candleX, candleY - 10, 0, candleX, candleY - 10, flameSize);
    gradient.addColorStop(0, "#FFF");
    gradient.addColorStop(0.4, "#FFD700");
    gradient.addColorStop(1, "#FF4500");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(candleX, candleY - 10, 12, flameSize, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  if (progress > 0.6) {
    const eyeX = centerX + 180;
    const eyeY = centerY;

    ctx.fillStyle = "#FFF";
    ctx.beginPath();
    ctx.ellipse(eyeX, eyeY, 25, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(eyeX - 5, eyeY, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "#60A5FA";
  ctx.font = "bold 20px Arial";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 10;
  ctx.fillText("Can we see through a pipe?", centerX, 80);
  ctx.shadowBlur = 0;
}

function drawPipeStraight(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number
) {
  const centerX = width / 2;
  const centerY = height / 2;

  const pipeStartX = centerX - 200;
  const pipeEndX = centerX + 200;

  ctx.strokeStyle = "#64748B";
  ctx.lineWidth = 40;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(pipeStartX, centerY);
  ctx.lineTo(pipeEndX, centerY);
  ctx.stroke();

  ctx.strokeStyle = "#94A3B8";
  ctx.lineWidth = 30;
  ctx.beginPath();
  ctx.moveTo(pipeStartX, centerY);
  ctx.lineTo(pipeEndX, centerY);
  ctx.stroke();

  const rayProgress = Math.min(progress, 1);
  const rayEndX = pipeStartX + (pipeEndX - pipeStartX) * rayProgress;

  ctx.strokeStyle = "rgba(255, 215, 0, 0.7)";
  ctx.lineWidth = 20;
  ctx.beginPath();
  ctx.moveTo(pipeStartX, centerY);
  ctx.lineTo(rayEndX, centerY);
  ctx.stroke();

  ctx.strokeStyle = "rgba(255, 255, 150, 0.9)";
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(pipeStartX, centerY);
  ctx.lineTo(rayEndX, centerY);
  ctx.stroke();

  const candleX = pipeStartX - 50;
  const candleY = centerY + 80;

  ctx.fillStyle = "#F3E5AB";
  ctx.fillRect(candleX - 10, candleY, 20, 60);

  const flameSize = 20 + Math.sin(progress * Math.PI * 8) * 3;
  const gradient = ctx.createRadialGradient(candleX, candleY - 10, 0, candleX, candleY - 10, flameSize);
  gradient.addColorStop(0, "#FFF");
  gradient.addColorStop(0.4, "#FFD700");
  gradient.addColorStop(1, "#FF4500");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.ellipse(candleX, candleY - 10, 12, flameSize, 0, 0, Math.PI * 2);
  ctx.fill();

  const eyeX = pipeEndX + 50;
  const eyeY = centerY;

  ctx.fillStyle = "#FFF";
  ctx.beginPath();
  ctx.ellipse(eyeX, eyeY, 25, 20, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.arc(eyeX - 5, eyeY, 8, 0, Math.PI * 2);
  ctx.fill();

  if (rayProgress > 0.9) {
    ctx.fillStyle = "#FFD700";
    ctx.beginPath();
    ctx.arc(eyeX - 3, eyeY - 3, 3, 0, Math.PI * 2);
    ctx.fill();
  }

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

  ctx.fillStyle = "#10B981";
  ctx.font = "bold 20px Arial";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 10;
  ctx.fillText("Straight pipe - You can see the flame!", centerX, 80);
  ctx.shadowBlur = 0;
}

function drawPipeBent(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number
) {
  const centerX = width / 2;
  const centerY = height / 2;

  const bendAmount = Math.min(progress, 1) * 100;

  ctx.strokeStyle = "#64748B";
  ctx.lineWidth = 40;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(centerX - 200, centerY);
  ctx.lineTo(centerX - 50, centerY);
  ctx.quadraticCurveTo(centerX, centerY - bendAmount, centerX + 50, centerY);
  ctx.lineTo(centerX + 200, centerY);
  ctx.stroke();

  ctx.strokeStyle = "#94A3B8";
  ctx.lineWidth = 30;
  ctx.beginPath();
  ctx.moveTo(centerX - 200, centerY);
  ctx.lineTo(centerX - 50, centerY);
  ctx.quadraticCurveTo(centerX, centerY - bendAmount, centerX + 50, centerY);
  ctx.lineTo(centerX + 200, centerY);
  ctx.stroke();

  if (progress > 0.3) {
    const rayProgress = Math.min((progress - 0.3), 1);
    const rayLength = 150 * rayProgress;

    ctx.strokeStyle = "rgba(255, 215, 0, 0.7)";
    ctx.lineWidth = 20;
    ctx.beginPath();
    ctx.moveTo(centerX - 200, centerY);
    ctx.lineTo(centerX - 200 + rayLength, centerY);
    ctx.stroke();

    ctx.strokeStyle = "rgba(255, 255, 150, 0.9)";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(centerX - 200, centerY);
    ctx.lineTo(centerX - 200 + rayLength, centerY);
    ctx.stroke();

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

  const candleX = centerX - 250;
  const candleY = centerY + 80;

  ctx.fillStyle = "#F3E5AB";
  ctx.fillRect(candleX - 10, candleY, 20, 60);

  const flameSize = 20 + Math.sin(progress * Math.PI * 8) * 3;
  const gradient = ctx.createRadialGradient(candleX, candleY - 10, 0, candleX, candleY - 10, flameSize);
  gradient.addColorStop(0, "#FFF");
  gradient.addColorStop(0.4, "#FFD700");
  gradient.addColorStop(1, "#FF4500");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.ellipse(candleX, candleY - 10, 12, flameSize, 0, 0, Math.PI * 2);
  ctx.fill();

  const eyeX = centerX + 250;
  const eyeY = centerY;

  ctx.fillStyle = "#FFF";
  ctx.beginPath();
  ctx.ellipse(eyeX, eyeY, 25, 20, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.arc(eyeX, eyeY + 5, 8, 0, Math.PI * 2);
  ctx.fill();

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

  ctx.fillStyle = "#EF4444";
  ctx.font = "bold 20px Arial";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 10;
  ctx.fillText("Bent pipe - Cannot see the flame!", centerX, 80);
  ctx.shadowBlur = 0;
}

function drawVisualization(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  stage: string,
  progress: number
) {
  const bgGradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 2);
  bgGradient.addColorStop(0, "#1e293b");
  bgGradient.addColorStop(1, "#0f172a");
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  if (stage === "intro") {
    drawIntro(ctx, width, height, progress);
  } else if (stage === "matchbox_setup") {
    drawMatchboxSetup(ctx, width, height, progress);
  } else if (stage === "matchbox_aligned") {
    drawMatchboxAligned(ctx, width, height, progress);
  } else if (stage === "matchbox_misaligned") {
    drawMatchboxMisaligned(ctx, width, height, progress);
  } else if (stage === "pipe_intro") {
    drawPipeIntro(ctx, width, height, progress);
  } else if (stage === "pipe_straight") {
    drawPipeStraight(ctx, width, height, progress);
  } else if (stage === "pipe_bent") {
    drawPipeBent(ctx, width, height, progress);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// LEARN MODE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const LearnMode: React.FC<{
  steps: StepData[];
  canvasWidth: number;
  canvasHeight: number;
  animationSpeed: number;
  autoPlayDuration: number;
  showNavigation: boolean;
  showPlayPause: boolean;
  showStepIndicator: boolean;
  themeColor: string;
  setStepDetails?: (details: StepDetails) => void;
}> = ({
  steps,
  canvasWidth,
  canvasHeight,
  animationSpeed,
  autoPlayDuration,
  showNavigation,
  showPlayPause,
  showStepIndicator,
  themeColor,
  setStepDetails,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (setStepDetails) {
      setStepDetails({
        currentStep: currentStepIndex + 1,
        totalSteps: steps.length,
        stepTitle: steps[currentStepIndex].title,
        stepDescription: steps[currentStepIndex].description,
      });
    }
  }, [currentStepIndex, steps, setStepDetails]);

  useEffect(() => {
    if (!isPlaying || autoPlayDuration === 0) return;
    const timer = window.setTimeout(() => {
      if (currentStepIndex < steps.length - 1) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentStepIndex((prev) => prev + 1);
          setIsTransitioning(false);
        }, 500);
      } else {
        setIsPlaying(false);
      }
    }, autoPlayDuration);
    return () => window.clearTimeout(timer);
  }, [isPlaying, currentStepIndex, steps.length, autoPlayDuration]);

  useEffect(() => {
    const animate = () => {
      setAnimationProgress((prev) => (prev + (0.01 * animationSpeed)) % 1);
      animationFrameRef.current = window.requestAnimationFrame(animate);
    };

    animationFrameRef.current = window.requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animationSpeed]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    const stepKey = getStepKey(currentStepIndex);
    drawVisualization(ctx, canvasWidth, canvasHeight, stepKey, animationProgress);
  }, [currentStepIndex, animationProgress, canvasWidth, canvasHeight]);

  const getStepKey = (index: number): string => {
    const keys = [
      "intro",
      "matchbox_setup",
      "matchbox_aligned",
      "matchbox_misaligned",
      "pipe_intro",
      "pipe_straight",
      "pipe_bent",
    ];
    return keys[index] || "intro";
  };

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
        setIsTransitioning(false);
      }, 500);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStepIndex((prev) => prev - 1);
        setIsTransitioning(false);
      }, 500);
    }
  };

  const resetMode = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStepIndex(0);
      setIsTransitioning(false);
    }, 500);
  };

  const step = steps[currentStepIndex];

  const containerStyle: CSSProperties = {
    width: "100%",
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "16px 24px",
  };

  const cardStyle: CSSProperties = {
    background: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
    overflow: "hidden",
    marginTop: "24px",
    transition: "all 0.7s ease",
  };

  const headerStyle: CSSProperties = {
    background: `linear-gradient(135deg, ${themeColor} 0%, #14b8a6 100%)`,
    color: "#ffffff",
    padding: "32px",
  };

  const titleStyle: CSSProperties = {
    fontSize: "28px",
    fontWeight: "600",
    marginBottom: "8px",
    opacity: isTransitioning ? 0 : 1,
    transform: isTransitioning ? "translateX(-16px)" : "translateX(0)",
    transition: "all 0.7s ease",
  };

  const stepIndicatorStyle: CSSProperties = {
    fontSize: "14px",
    background: "rgba(255,255,255,0.2)",
    padding: "8px 16px",
    borderRadius: "20px",
    display: "inline-block",
  };

  const contentStyle: CSSProperties = {
    padding: "32px",
  };

  const canvasContainerStyle: CSSProperties = {
    background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "24px",
    opacity: isTransitioning ? 0 : 1,
    transform: isTransitioning ? "scale(0.95)" : "scale(1)",
    transition: "all 0.7s ease",
  };

  const canvasStyle: CSSProperties = {
    width: "100%",
    height: "auto",
    border: "2px solid #60a5fa",
    borderRadius: "8px",
  };

  const descriptionBoxStyle: CSSProperties = {
    background: "linear-gradient(135deg, #eff6ff 0%, #d1fae5 100%)",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "24px",
    borderLeft: `4px solid ${themeColor}`,
    opacity: isTransitioning ? 0 : 1,
    transform: isTransitioning ? "translateY(16px)" : "translateY(0)",
    transition: "all 0.7s ease",
  };

  const descriptionTextStyle: CSSProperties = {
    color: "#1f2937",
    fontSize: "18px",
    lineHeight: "1.8",
    margin: 0,
  };

  const controlsStyle: CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
  };

  const buttonBaseStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 24px",
    borderRadius: "8px",
    fontWeight: "600",
    border: "none",
    cursor: "pointer",
    transition: "all 0.5s ease",
    fontSize: "16px",
  };

  const navButtonStyle: CSSProperties = {
    ...buttonBaseStyle,
    background: "#e5e7eb",
    color: "#374151",
  };

  const navButtonDisabledStyle: CSSProperties = {
    ...navButtonStyle,
    opacity: 0.5,
    cursor: "not-allowed",
  };

  const primaryButtonStyle: CSSProperties = {
    ...buttonBaseStyle,
    background: `linear-gradient(135deg, ${themeColor} 0%, #14b8a6 100%)`,
    color: "#ffffff",
  };

  const progressBarContainerStyle: CSSProperties = {
    width: "100%",
    background: "#e5e7eb",
    borderRadius: "999px",
    height: "12px",
    overflow: "hidden",
    marginTop: "24px",
  };

  const progressBarStyle: CSSProperties = {
    height: "100%",
    background: `linear-gradient(135deg, ${themeColor} 0%, #14b8a6 100%)`,
    width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
    transition: "width 1s ease",
    borderRadius: "999px",
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
            <h2 style={titleStyle}>{step.title}</h2>
            {showStepIndicator && (
              <div style={stepIndicatorStyle}>
                Step {currentStepIndex + 1} of {steps.length}
              </div>
            )}
          </div>
        </div>

        <div style={contentStyle}>
          <div style={canvasContainerStyle}>
            <canvas
              ref={canvasRef}
              width={canvasWidth}
              height={canvasHeight}
              style={canvasStyle}
            />
          </div>

          <div style={descriptionBoxStyle}>
            <p style={descriptionTextStyle}>{step.description}</p>
          </div>

          <div style={controlsStyle}>
            {showNavigation && (
              <button
                onClick={prevStep}
                disabled={currentStepIndex === 0}
                style={currentStepIndex === 0 ? navButtonDisabledStyle : navButtonStyle}
                onMouseEnter={(e) => {
                  if (currentStepIndex !== 0) {
                    (e.target as HTMLButtonElement).style.transform = "scale(1.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.transform = "scale(1)";
                }}
              >
                <ChevronLeftIcon size={20} />
                Previous
              </button>
            )}

            <div style={{ display: "flex", gap: "12px" }}>
              {showPlayPause && (
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  style={primaryButtonStyle}
                  onMouseEnter={(e) => {
                    (e.target as HTMLButtonElement).style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLButtonElement).style.transform = "scale(1)";
                  }}
                >
                  {isPlaying ? <PauseIcon size={20} /> : <PlayIcon size={20} />}
                  {isPlaying ? "Pause" : "Play"}
                </button>
              )}

              <button
                onClick={resetMode}
                style={navButtonStyle}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.transform = "scale(1)";
                }}
              >
                <RotateCcwIcon size={20} />
                Reset
              </button>
            </div>

            {showNavigation && (
              <button
                onClick={nextStep}
                disabled={currentStepIndex === steps.length - 1}
                style={currentStepIndex === steps.length - 1 ? navButtonDisabledStyle : primaryButtonStyle}
                onMouseEnter={(e) => {
                  if (currentStepIndex !== steps.length - 1) {
                    (e.target as HTMLButtonElement).style.transform = "scale(1.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.transform = "scale(1)";
                }}
              >
                Next
                <ChevronRightIcon size={20} />
              </button>
            )}
          </div>

          <div style={progressBarContainerStyle}>
            <div style={progressBarStyle} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// PRACTICE MODE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const PracticeMode: React.FC<{
  questions: Question[];
  themeColor: string;
}> = ({ questions, themeColor }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);

  if (questions.length === 0) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
        <div style={{ background: "#ffffff", borderRadius: "16px", boxShadow: "0 10px 40px rgba(0,0,0,0.1)", padding: "32px", textAlign: "center" }}>
          <p style={{ color: "#6b7280" }}>Loading questions...</p>
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
    
    const completionContainerStyle: CSSProperties = {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px",
    };

    const completionCardStyle: CSSProperties = {
      background: "#ffffff",
      borderRadius: "16px",
      boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
      padding: "48px",
      maxWidth: "600px",
      width: "100%",
      textAlign: "center",
    };

    return (
      <div style={completionContainerStyle}>
        <div style={completionCardStyle}>
          <div style={{ marginBottom: "24px" }}>
            <CheckCircleIcon size={96} color="#10b981" />
          </div>
          <h2 style={{ fontSize: "36px", fontWeight: "700", color: "#1f2937", marginBottom: "16px" }}>
            Quiz Complete!
          </h2>
          <p style={{ fontSize: "24px", color: "#6b7280", marginBottom: "12px" }}>
            Your Final Score:
          </p>
          <p style={{ fontSize: "72px", fontWeight: "700", background: `linear-gradient(135deg, ${themeColor} 0%, #14b8a6 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "32px" }}>
            {score} / {questions.length}
          </p>
          <div style={{ marginBottom: "32px" }}>
            <p style={{ fontSize: "18px", color: "#4b5563" }}>
              {percentage === 100
                ? "Perfect score! You're a light expert! 🌟"
                : percentage >= 75
                ? "Great job! You understand the concepts well! 👏"
                : percentage >= 50
                ? "Good effort! Keep practicing! 💪"
                : "Keep learning! Review and try again! 📚"}
            </p>
          </div>
          <button
            onClick={handleRestart}
            style={{
              padding: "16px 40px",
              background: `linear-gradient(135deg, ${themeColor} 0%, #14b8a6 100%)`,
              color: "#ffffff",
              borderRadius: "12px",
              fontWeight: "600",
              fontSize: "18px",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.transform = "scale(1)";
            }}
          >
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const isCorrect = showResult && selectedAnswer === question.correctAnswer;

  const containerStyle: CSSProperties = {
    minHeight: "100vh",
    padding: "16px",
  };

  const maxWidthStyle: CSSProperties = {
    maxWidth: "1200px",
    margin: "0 auto",
    paddingTop: "32px",
    paddingBottom: "32px",
  };

  const cardStyle: CSSProperties = {
    background: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
    overflow: "hidden",
  };

  const headerStyle: CSSProperties = {
    background: `linear-gradient(135deg, ${themeColor} 0%, #14b8a6 100%)`,
    color: "#ffffff",
    padding: "32px",
  };

  const contentStyle: CSSProperties = {
    padding: "32px",
  };

  const optionButtonStyle = (index: number): CSSProperties => {
    const isSelected = selectedAnswer === index;
    const showCorrect = showResult && index === question.correctAnswer;
    const showWrong = showResult && isSelected && !showCorrect;

    return {
      width: "100%",
      textAlign: "left",
      padding: "20px",
      borderRadius: "12px",
      border: showCorrect
        ? "2px solid #10b981"
        : showWrong
        ? "2px solid #ef4444"
        : isSelected
        ? `2px solid ${themeColor}`
        : "2px solid #e5e7eb",
      background: showCorrect
        ? "#d1fae5"
        : showWrong
        ? "#fee2e2"
        : isSelected
        ? "#eff6ff"
        : "#ffffff",
      cursor: showResult ? "not-allowed" : "pointer",
      transition: "all 0.3s ease",
      marginBottom: "16px",
      display: "flex",
      alignItems: "center",
      transform: isSelected && !showResult ? "scale(1.02)" : "scale(1)",
    };
  };

  const progressBarStyle: CSSProperties = {
    width: "100%",
    background: "#e5e7eb",
    borderRadius: "999px",
    height: "8px",
    overflow: "hidden",
    marginTop: "24px",
  };

  const progressFillStyle: CSSProperties = {
    height: "100%",
    background: `linear-gradient(135deg, ${themeColor} 0%, #14b8a6 100%)`,
    width: `${(answeredQuestions.length / questions.length) * 100}%`,
    transition: "width 0.5s ease",
    borderRadius: "999px",
  };

  return (
    <div style={containerStyle}>
      <div style={maxWidthStyle}>
        <div style={cardStyle}>
          <div style={headerStyle}>
            <h2 style={{ fontSize: "32px", fontWeight: "700", marginBottom: "8px" }}>Practice Questions</h2>
            <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "18px" }}>Test your understanding of how light travels</p>
            <div style={{ marginTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
              <span style={{ fontSize: "14px", background: "rgba(255,255,255,0.2)", padding: "10px 20px", borderRadius: "20px", fontWeight: "600" }}>
                Question {currentQuestion + 1} / {questions.length}
              </span>
              <span style={{ fontSize: "14px", background: "rgba(255,255,255,0.2)", padding: "10px 20px", borderRadius: "20px", fontWeight: "600" }}>
                Score: {score}
              </span>
            </div>
          </div>

          <div style={contentStyle}>
            <h3 style={{ fontSize: "24px", fontWeight: "600", color: "#1f2937", marginBottom: "32px" }}>
              {question.question}
            </h3>

            <div style={{ marginBottom: "32px" }}>
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const showCorrect = showResult && index === question.correctAnswer;
                const showWrong = showResult && isSelected && !showCorrect;

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showResult}
                    style={optionButtonStyle(index)}
                    onMouseEnter={(e) => {
                      if (!showResult) {
                        (e.target as HTMLButtonElement).style.background = "#f3f4f6";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!showResult && !isSelected) {
                        (e.target as HTMLButtonElement).style.background = "#ffffff";
                      }
                    }}
                  >
                    <span
                      style={{
                        flexShrink: 0,
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "700",
                        fontSize: "18px",
                        marginRight: "16px",
                        background: showCorrect
                          ? "#10b981"
                          : showWrong
                          ? "#ef4444"
                          : isSelected
                          ? themeColor
                          : "#e5e7eb",
                        color: showCorrect || showWrong || isSelected ? "#ffffff" : "#374151",
                      }}
                    >
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span style={{ fontWeight: "500", color: "#1f2937", fontSize: "18px", flex: 1 }}>
                      {option}
                    </span>
                    {showResult && (
                      <span style={{ marginLeft: "auto" }}>
                        {showCorrect ? (
                          <CheckCircleIcon size={32} color="#10b981" />
                        ) : isSelected ? (
                          <XCircleIcon size={32} color="#ef4444" />
                        ) : null}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {showResult && (
              <div
                style={{
                  padding: "24px",
                  borderRadius: "12px",
                  marginBottom: "24px",
                  border: isCorrect ? "2px solid #86efac" : "2px solid #fde047",
                  background: isCorrect ? "#d1fae5" : "#fef3c7",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  {isCorrect ? (
                    <CheckCircleIcon size={28} color="#10b981" />
                  ) : (
                    <LightbulbIcon size={28} color="#f59e0b" />
                  )}
                  <div>
                    <p style={{ fontWeight: "700", fontSize: "20px", marginBottom: "8px" }}>
                      {isCorrect ? "Correct! Well done! 🎉" : "Not quite right. Let's learn from this!"}
                    </p>
                    <p style={{ color: "#1f2937", lineHeight: "1.7" }}>
                      <span style={{ fontWeight: "600" }}>Explanation:</span> {question.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: "16px" }}>
              {!showResult ? (
                <button
                  onClick={handleCheckAnswer}
                  disabled={selectedAnswer === null}
                  style={{
                    flex: 1,
                    padding: "16px 32px",
                    background: selectedAnswer === null ? "#e5e7eb" : `linear-gradient(135deg, ${themeColor} 0%, #14b8a6 100%)`,
                    color: "#ffffff",
                    borderRadius: "12px",
                    fontWeight: "600",
                    fontSize: "18px",
                    border: "none",
                    cursor: selectedAnswer === null ? "not-allowed" : "pointer",
                    transition: "all 0.3s ease",
                    opacity: selectedAnswer === null ? 0.5 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (selectedAnswer !== null) {
                      (e.target as HTMLButtonElement).style.transform = "scale(1.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLButtonElement).style.transform = "scale(1)";
                  }}
                >
                  Check Answer
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  disabled={currentQuestion === questions.length - 1}
                  style={{
                    flex: 1,
                    padding: "16px 32px",
                    background: currentQuestion === questions.length - 1 ? "#e5e7eb" : `linear-gradient(135deg, ${themeColor} 0%, #14b8a6 100%)`,
                    color: "#ffffff",
                    borderRadius: "12px",
                    fontWeight: "600",
                    fontSize: "18px",
                    border: "none",
                    cursor: currentQuestion === questions.length - 1 ? "not-allowed" : "pointer",
                    transition: "all 0.3s ease",
                    opacity: currentQuestion === questions.length - 1 ? 0.5 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (currentQuestion !== questions.length - 1) {
                      (e.target as HTMLButtonElement).style.transform = "scale(1.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLButtonElement).style.transform = "scale(1)";
                  }}
                >
                  Next Question
                </button>
              )}
            </div>
          </div>
        </div>

        <div style={progressBarStyle}>
          <div style={progressFillStyle} />
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// REAL WORLD MODE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const RealWorldMode: React.FC<{
  applications: Application[];
  themeColor: string;
}> = ({ applications, themeColor }) => {
  if (applications.length === 0) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
        <div style={{ background: "#ffffff", borderRadius: "16px", boxShadow: "0 10px 40px rgba(0,0,0,0.1)", padding: "32px", textAlign: "center" }}>
          <p style={{ color: "#6b7280" }}>Loading applications...</p>
        </div>
      </div>
    );
  }

  const containerStyle: CSSProperties = {
    minHeight: "100vh",
    padding: "16px",
  };

  const maxWidthStyle: CSSProperties = {
    maxWidth: "1400px",
    margin: "0 auto",
    paddingTop: "32px",
    paddingBottom: "32px",
  };

  const headerCardStyle: CSSProperties = {
    background: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
    overflow: "hidden",
    marginBottom: "32px",
  };

  const headerContentStyle: CSSProperties = {
    background: `linear-gradient(135deg, ${themeColor} 0%, #14b8a6 100%)`,
    color: "#ffffff",
    padding: "48px",
  };

  const gridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "24px",
  };

  const appCardStyle: CSSProperties = {
    background: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    padding: "24px",
    border: "2px solid transparent",
    transition: "all 0.5s ease",
    cursor: "default",
  };

  return (
    <div style={containerStyle}>
      <div style={maxWidthStyle}>
        <div style={headerCardStyle}>
          <div style={headerContentStyle}>
            <h2 style={{ fontSize: "40px", fontWeight: "700", marginBottom: "12px" }}>Real World Applications</h2>
            <p style={{ color: "rgba(255,255,255,0.95)", fontSize: "20px" }}>Discover how the straight-line property of light is used in everyday life</p>
          </div>
        </div>

        <div style={gridStyle}>
          {applications.map((app) => (
            <div
              key={app.id}
              style={appCardStyle}
              onMouseEnter={(e) => {
                const target = e.currentTarget as HTMLDivElement;
                target.style.boxShadow = "0 20px 60px rgba(0,0,0,0.15)";
                target.style.transform = "translateY(-8px) scale(1.02)";
                target.style.borderColor = themeColor;
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget as HTMLDivElement;
                target.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
                target.style.transform = "translateY(0) scale(1)";
                target.style.borderColor = "transparent";
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" }}>
                <div style={{ fontSize: "60px" }}>{app.icon}</div>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    padding: "6px 12px",
                    background: "#eff6ff",
                    color: themeColor,
                    borderRadius: "20px",
                  }}
                >
                  {app.category}
                </span>
              </div>

              <h3 style={{ fontSize: "24px", fontWeight: "700", color: "#1f2937", marginBottom: "12px" }}>
                {app.title}
              </h3>

              <p style={{ color: "#6b7280", marginBottom: "16px", lineHeight: "1.7" }}>
                {app.description}
              </p>

              <div
                style={{
                  background: "linear-gradient(135deg, #eff6ff 0%, #d1fae5 100%)",
                  borderRadius: "8px",
                  padding: "16px",
                  borderLeft: `4px solid ${themeColor}`,
                }}
              >
                <p style={{ fontSize: "14px", color: "#374151" }}>
                  <span style={{ fontWeight: "600" }}>Example:</span> {app.example}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const LightTravelTool: React.FC<LightTravelToolProps> = ({ props = {}, setStepDetails, stopAutoNext, setStopAutoNext }) => {
  // Extract props with defaults
  const {
    width = 800,
    height = 600,
    initialMode = "learn",
    showModeSelector = true,
    enabledModes = ["learn", "practice", "realWorld"],
    showNavigation = true,
    showPlayPause = true,
    showStepIndicator = true,
    initialStep = 0,
    filterSteps,
    animationSpeed = 1,
    autoPlayDuration = 12000,
    themeColor = "#3b82f6",
    darkMode = false,
    additionalProps = {},
  } = props;

  // Extract additional props with defaults
  const {
    customSteps,
    customQuestions,
    customApplications,
    canvasWidth = width,
    canvasHeight = height,
  } = additionalProps;

  const [activeTab, setActiveTab] = useState<ModeType>(initialMode);

  // Use custom data or defaults
  const steps = useMemo(() => {
    let allSteps = customSteps || DEFAULT_STEPS;
    if (filterSteps && filterSteps.length > 0) {
      allSteps = allSteps.filter(step => filterSteps.includes(step.id));
    }
    return allSteps;
  }, [customSteps, filterSteps]);

  const questions = useMemo(() => customQuestions || DEFAULT_QUESTIONS, [customQuestions]);
  const applications = useMemo(() => customApplications || DEFAULT_APPLICATIONS, [customApplications]);

  // Inject animations
  useEffect(() => {
    const styleId = "light-travel-animations";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes slideInLeft {
        from { opacity: 0; transform: translateX(-30px); }
        to { opacity: 1; transform: translateX(0); }
      }
      
      @keyframes slideInRight {
        from { opacity: 0; transform: translateX(30px); }
        to { opacity: 1; transform: translateX(0); }
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
      }
      
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      const el = document.getElementById(styleId);
      if (el) el.remove();
    };
  }, []);

  const appContainerStyle: CSSProperties = {
    minHeight: "100vh",
    background: darkMode
      ? "linear-gradient(135deg, #1f2937 0%, #111827 100%)"
      : "linear-gradient(135deg, #eff6ff 0%, #d1fae5 100%)",
  };

  const navStyle: CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    background: darkMode ? "#1f2937" : "#ffffff",
    borderBottom: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  };

  const navContentStyle: CSSProperties = {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 16px",
  };

  const navInnerStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "64px",
  };

  const logoStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const logoTextStyle: CSSProperties = {
    fontSize: "20px",
    fontWeight: "700",
    background: `linear-gradient(135deg, ${themeColor} 0%, #14b8a6 100%)`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };

  const tabsStyle: CSSProperties = {
    display: "flex",
    gap: "8px",
  };

  const tabButtonBaseStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    borderRadius: "8px",
    fontWeight: "600",
    border: "none",
    cursor: "pointer",
    transition: "all 0.5s ease",
    fontSize: "14px",
  };

  const getTabStyle = (tab: ModeType): CSSProperties => ({
    ...tabButtonBaseStyle,
    background: activeTab === tab ? `linear-gradient(135deg, ${themeColor} 0%, #14b8a6 100%)` : "transparent",
    color: activeTab === tab ? "#ffffff" : darkMode ? "#e5e7eb" : "#374151",
  });

  const contentStyle: CSSProperties = {
    paddingTop: "64px",
  };

  return (
    <div style={appContainerStyle}>
      {showModeSelector && (
        <nav style={navStyle}>
          <div style={navContentStyle}>
            <div style={navInnerStyle}>
              <div style={logoStyle}>
                <LightbulbIcon size={24} color={themeColor} />
                <span style={logoTextStyle}>Does Light Travel in a Straight Line?</span>
              </div>

              <div style={tabsStyle}>
                {enabledModes.includes("learn") && (
                  <button
                    onClick={() => setActiveTab("learn")}
                    style={getTabStyle("learn")}
                    onMouseEnter={(e) => {
                      if (activeTab !== "learn") {
                        (e.target as HTMLButtonElement).style.background = darkMode ? "#374151" : "#f3f4f6";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeTab !== "learn") {
                        (e.target as HTMLButtonElement).style.background = "transparent";
                      }
                    }}
                  >
                    <BookOpenIcon size={20} />
                    Learn
                  </button>
                )}
                {enabledModes.includes("practice") && (
                  <button
                    onClick={() => setActiveTab("practice")}
                    style={getTabStyle("practice")}
                    onMouseEnter={(e) => {
                      if (activeTab !== "practice") {
                        (e.target as HTMLButtonElement).style.background = darkMode ? "#374151" : "#f3f4f6";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeTab !== "practice") {
                        (e.target as HTMLButtonElement).style.background = "transparent";
                      }
                    }}
                  >
                    <ClipboardCheckIcon size={20} />
                    Practice
                  </button>
                )}
                {enabledModes.includes("realWorld") && (
                  <button
                    onClick={() => setActiveTab("realWorld")}
                    style={getTabStyle("realWorld")}
                    onMouseEnter={(e) => {
                      if (activeTab !== "realWorld") {
                        (e.target as HTMLButtonElement).style.background = darkMode ? "#374151" : "#f3f4f6";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeTab !== "realWorld") {
                        (e.target as HTMLButtonElement).style.background = "transparent";
                      }
                    }}
                  >
                    <GlobeIcon size={20} />
                    Real World
                  </button>
                )}
              </div>
            </div>
          </div>
        </nav>
      )}

      <div style={contentStyle}>
        {activeTab === "learn" ? (
          <LearnMode
            steps={steps}
            canvasWidth={canvasWidth}
            canvasHeight={canvasHeight}
            animationSpeed={animationSpeed}
            autoPlayDuration={autoPlayDuration}
            showNavigation={showNavigation}
            showPlayPause={showPlayPause}
            showStepIndicator={showStepIndicator}
            themeColor={themeColor}
            setStepDetails={setStepDetails}
          />
        ) : activeTab === "practice" ? (
          <PracticeMode questions={questions} themeColor={themeColor} />
        ) : (
          <RealWorldMode applications={applications} themeColor={themeColor} />
        )}
      </div>
    </div>
  );
};

export default LightTravelTool;