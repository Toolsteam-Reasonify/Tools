// @ts-ignore - React types may be provided by the host project
import React, { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// SINGULARITY DESIGN SYSTEM TOKENS
// ═══════════════════════════════════════════════════════════════════════════

const DS = {
  colors: {
    primary: "#4A4DC9",
    accent: "#FF7212",
    gradientStart: "#533086",
    gradientEnd: "#FC9145",
    primaryLight: "#C1C1EA",
    accentLight: "#FFF3E4",
    text: "#4E4E4E",
    textLight: "#8A8A8A",
    border: "#CACACA",
    borderLight: "#EBEBEB",
    surface: "#F5F5F5",
    white: "#FFFFFF",
    success: "#2ECC71",
    error: "#E74C3C",
    transparent: "#4A4DC9",
    translucent: "#FC9145",
    opaque: "#E74C3C",
  },
  font: "'Poppins', sans-serif",
  radius: { sm: 8, md: 12, lg: 16, xl: 24, full: 999 },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
  shadow: {
    sm: "0 2px 8px rgba(74, 77, 201, 0.08)",
    md: "0 4px 20px rgba(74, 77, 201, 0.12)",
    lg: "0 12px 40px rgba(74, 77, 201, 0.16)",
    accent: "0 8px 24px rgba(255, 114, 18, 0.25)",
  },
  gradient: "linear-gradient(135deg, #533086 0%, #4A4DC9 40%, #FC9145 100%)",
  gradientSubtle: "linear-gradient(135deg, #C1C1EA 0%, #FFF3E4 100%)",
};

// ═══════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

const MATERIALS = {
  glass: {
    id: "glass",
    name: "Glass",
    type: "transparent",
    transmission: 95,
    color: "#C1C1EA",
    description: "Clear window glass",
    icon: "🪟",
  },
  clear_plastic: {
    id: "clear_plastic",
    name: "Clear Plastic",
    type: "transparent",
    transmission: 90,
    color: "#D5D5F0",
    description: "Plastic bottle",
    icon: "🍶",
  },
  water: {
    id: "water",
    name: "Water",
    type: "transparent",
    transmission: 98,
    color: "#B8B8E8",
    description: "Water in beaker",
    icon: "💧",
  },
  tracing_paper: {
    id: "tracing_paper",
    name: "Tracing Paper",
    type: "translucent",
    transmission: 50,
    color: "#FFF3E4",
    description: "Thin paper",
    icon: "📄",
  },
  frosted_glass: {
    id: "frosted_glass",
    name: "Frosted Glass",
    type: "translucent",
    transmission: 45,
    color: "#EBEBEB",
    description: "Textured glass",
    icon: "🧊",
  },
  thin_cloth: {
    id: "thin_cloth",
    name: "Thin Cloth",
    type: "translucent",
    transmission: 35,
    color: "#FFD9B8",
    description: "Light fabric",
    icon: "🧵",
  },
  cardboard: {
    id: "cardboard",
    name: "Cardboard",
    type: "opaque",
    transmission: 0,
    color: "#D4A574",
    description: "Thick card",
    icon: "📦",
  },
  metal_sheet: {
    id: "metal_sheet",
    name: "Metal Sheet",
    type: "opaque",
    transmission: 0,
    color: "#9CA3AF",
    description: "Aluminum plate",
    icon: "🔩",
  },
  book: {
    id: "book",
    name: "Book",
    type: "opaque",
    transmission: 0,
    color: "#533086",
    description: "Closed book",
    icon: "📕",
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// STEP DATA
// ═══════════════════════════════════════════════════════════════════════════

export interface Step {
  id: number;
  title: string;
  materialId?: string | null;
  category?: string;
  type?: string;
  question?: string;
  options?: string[];
  correctAnswer?: number;
  explanation?: string;
  description?: string;
  visualization?: string;
  benefit?: string;
  materialType?: string;
}

const getStepData = (mode: string): Step[] => {
  const learnSteps = [
    {
      id: 1,
      title: "What Happens to Light?",
      materialId: null,
      category: "intro",
    },
    {
      id: 2,
      title: "Glass — Transparent",
      materialId: "glass",
      category: "transparent",
    },
    {
      id: 3,
      title: "Clear Plastic — Transparent",
      materialId: "clear_plastic",
      category: "transparent",
    },
    {
      id: 4,
      title: "Water — Transparent",
      materialId: "water",
      category: "transparent",
    },
    {
      id: 5,
      title: "Tracing Paper — Translucent",
      materialId: "tracing_paper",
      category: "translucent",
    },
    {
      id: 6,
      title: "Frosted Glass — Translucent",
      materialId: "frosted_glass",
      category: "translucent",
    },
    {
      id: 7,
      title: "Thin Cloth — Translucent",
      materialId: "thin_cloth",
      category: "translucent",
    },
    {
      id: 8,
      title: "Cardboard — Opaque",
      materialId: "cardboard",
      category: "opaque",
    },
    {
      id: 9,
      title: "Metal Sheet — Opaque",
      materialId: "metal_sheet",
      category: "opaque",
    },
    { id: 10, title: "Book — Opaque", materialId: "book", category: "opaque" },
    {
      id: 11,
      title: "Activity 11.3: Test Materials",
      materialId: null,
      category: "activity",
    },
  ];

  const practiceSteps = [
    {
      id: 12,
      title: "Question 1",
      type: "mcq",
      question:
        "A bathroom window is made of frosted glass. You can see light coming through, but cannot see clearly through it. What type of material is frosted glass?",
      options: ["Transparent", "Translucent", "Opaque", "Reflective"],
      correctAnswer: 1,
      explanation:
        "Frosted glass is translucent because light passes through it partially, but you cannot see clearly.",
      materialId: "frosted_glass",
    },
    {
      id: 13,
      title: "Question 2",
      type: "mcq",
      question: "Which material will allow the MOST light to pass through?",
      options: [
        "Thick cardboard",
        "Clear glass window",
        "Thin white cloth",
        "Wooden door",
      ],
      correctAnswer: 1,
      explanation:
        "Clear glass is transparent and allows 90-100% of light to pass through.",
      materialId: "glass",
    },
    {
      id: 14,
      title: "Question 3",
      type: "mcq",
      question: "Which material will create the DARKEST shadow?",
      options: [
        "Tracing paper",
        "Clear plastic bottle",
        "Metal sheet",
        "Tissue paper",
      ],
      correctAnswer: 2,
      explanation:
        "Metal sheet is opaque and blocks all light (0% transmission), creating the darkest shadow.",
      materialId: "metal_sheet",
    },
    {
      id: 15,
      title: "Question 4",
      type: "mcq",
      question:
        "A photographer wants to soften harsh sunlight. Which material should they use?",
      options: [
        "Clear glass",
        "Black cardboard",
        "Translucent white fabric",
        "Aluminum foil",
      ],
      correctAnswer: 2,
      explanation:
        "Translucent fabric softens light by allowing it to pass through while scattering it.",
      materialId: "thin_cloth",
    },
    {
      id: 16,
      title: "Question 5",
      type: "mcq",
      question: "Which statement is TRUE about transparent materials?",
      options: [
        "They block all light",
        "They allow some light through but scatter it",
        "They allow almost all light to pass through clearly",
        "They reflect all light back",
      ],
      correctAnswer: 2,
      explanation:
        "Transparent materials allow 90-100% of light to pass through without scattering.",
      materialId: "glass",
    },
  ];

  const realWorldSteps = [
    {
      id: 17,
      title: "Home Windows",
      type: "application",
      materialType: "transparent",
      description:
        "Transparent glass allows natural light into buildings while keeping out wind, rain, and insects.",
      visualization: "home_window",
      benefit: "Natural lighting saves electricity",
      materialId: "glass",
    },
    {
      id: 18,
      title: "Car Windshields",
      type: "application",
      materialType: "transparent",
      description:
        "Clear windshields provide unobstructed visibility for safe driving while protecting from wind and debris.",
      visualization: "car_windshield",
      benefit: "Clear visibility while driving",
      materialId: "glass",
    },
    {
      id: 19,
      title: "Office Buildings",
      type: "application",
      materialType: "transparent",
      description:
        "Large glass windows in office buildings maximize natural daylight, reducing the need for artificial lighting.",
      visualization: "office_building",
      benefit: "Reduces energy costs",
      materialId: "glass",
    },
    {
      id: 20,
      title: "Greenhouses",
      type: "application",
      materialType: "transparent",
      description:
        "Greenhouse glass panels let sunlight reach plants while maintaining controlled temperature and humidity.",
      visualization: "greenhouse",
      benefit: "Plants get sunlight with protection",
      materialId: "glass",
    },
  ];

  if (mode === "learn") return learnSteps;
  if (mode === "practice") return practiceSteps;
  return realWorldSteps;
};

// ═══════════════════════════════════════════════════════════════════════════
// SVG COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const FlashlightSVG = ({ x, y, isOn, animationProgress, showName }) => {
  return (
    <g transform={`translate(${x - 60}, ${y - 40})`}>
      <defs>
        <linearGradient id="sg-flashBody" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#533086" />
          <stop offset="50%" stopColor="#4A4DC9" />
          <stop offset="100%" stopColor="#533086" />
        </linearGradient>
        <linearGradient id="sg-flashHead" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8A8ABA" />
          <stop offset="50%" stopColor="#C1C1EA" />
          <stop offset="100%" stopColor="#8A8ABA" />
        </linearGradient>
        <radialGradient id="sg-lensGlow" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#FFF3E4" />
          <stop offset="40%" stopColor="#FC9145" />
          <stop offset="100%" stopColor="#FF7212" />
        </radialGradient>
        <filter
          id="sg-torchGlow"
          x="-100%"
          y="-100%"
          width="400%"
          height="400%"
        >
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <ellipse cx="60" cy="85" rx="35" ry="8" fill="rgba(83,48,134,0.15)" />
      <rect
        x="0"
        y="25"
        width="70"
        height="30"
        rx="5"
        fill="url(#sg-flashBody)"
      />
      {[0, 8, 16, 24, 32, 40, 48].map((offset, i) => (
        <line
          key={i}
          x1={10 + offset}
          y1="28"
          x2={10 + offset}
          y2="52"
          stroke="#3A2A6A"
          strokeWidth="1"
          opacity="0.4"
        />
      ))}
      <ellipse
        cx="35"
        cy="25"
        rx="8"
        ry="3"
        fill={isOn ? "#FC9145" : "#4E4E4E"}
      />
      {isOn && (
        <ellipse cx="35" cy="25" rx="4" ry="1.5" fill="#FFF3E4" opacity="0.8">
          <animate
            attributeName="opacity"
            values="0.8;1;0.8"
            dur="1s"
            repeatCount="indefinite"
          />
        </ellipse>
      )}
      <rect x="65" y="22" width="8" height="36" rx="2" fill="#C1C1EA" />
      <path
        d="M 73 18 L 100 8 L 100 72 L 73 62 Z"
        fill="url(#sg-flashHead)"
        stroke="#8A8ABA"
        strokeWidth="1"
      />
      <line x1="80" y1="15" x2="80" y2="65" stroke="#D5D5F0" strokeWidth="2" />
      <line x1="90" y1="11" x2="90" y2="69" stroke="#D5D5F0" strokeWidth="2" />
      <ellipse cx="100" cy="40" rx="6" ry="32" fill="#3A2A6A" />
      <ellipse
        cx="102"
        cy="40"
        rx="4"
        ry="28"
        fill={isOn ? "url(#sg-lensGlow)" : "#4E4E4E"}
      >
        {isOn && (
          <animate
            attributeName="opacity"
            values="0.9;1;0.9"
            dur="0.15s"
            repeatCount="indefinite"
          />
        )}
      </ellipse>
      {isOn && (
        <>
          <ellipse cx="102" cy="40" rx="2" ry="15" fill="#fff" opacity="0.6">
            <animate
              attributeName="opacity"
              values="0.4;0.7;0.4"
              dur="0.2s"
              repeatCount="indefinite"
            />
          </ellipse>
          <g filter="url(#sg-torchGlow)" opacity="0.8">
            {[-20, -10, 0, 10, 20].map((angle, i) => (
              <line
                key={i}
                x1="106"
                y1={40 + angle}
                x2="130"
                y2={40 + angle * 1.5}
                stroke="#FC9145"
                strokeWidth="2"
                opacity="0.6"
              >
                <animate
                  attributeName="opacity"
                  values="0.4;0.8;0.4"
                  dur={`${0.1 + i * 0.05}s`}
                  repeatCount="indefinite"
                />
              </line>
            ))}
          </g>
        </>
      )}
      {showName && (
        <g>
          <rect x="10" y="90" width="80" height="24" rx="8" fill="#533086" />
          <text
            x="50"
            y="107"
            fontSize="11"
            fontWeight="600"
            fill="white"
            textAnchor="middle"
            fontFamily={DS.font}
          >
            🔦 Flashlight
          </text>
        </g>
      )}
    </g>
  );
};

const LightBeam = ({
  startX,
  endX,
  y,
  transmission,
  animationProgress,
  materialX,
}) => {
  const beamOpacity = Math.min(animationProgress * 2, 1);
  return (
    <g>
      <defs>
        <linearGradient id="sg-beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FC9145" stopOpacity="0.95" />
          <stop offset="30%" stopColor="#FF7212" stopOpacity="0.7" />
          <stop offset="70%" stopColor="#FFF3E4" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FFF3E4" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="sg-beamTrans" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop
            offset="0%"
            stopColor="#FC9145"
            stopOpacity={transmission * 0.9}
          />
          <stop
            offset="50%"
            stopColor="#FF7212"
            stopOpacity={transmission * 0.5}
          />
          <stop offset="100%" stopColor="#FFF3E4" stopOpacity="0" />
        </linearGradient>
        <filter id="sg-beamGlow" x="-20%" y="-100%" width="140%" height="300%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {animationProgress > 0.15 && (
        <g opacity={beamOpacity} filter="url(#sg-beamGlow)">
          <polygon
            points={`${startX},${y - 12} ${Math.min(startX + (materialX - startX) * Math.min((animationProgress - 0.15) / 0.3, 1), materialX - 50)},${y - 18} ${Math.min(startX + (materialX - startX) * Math.min((animationProgress - 0.15) / 0.3, 1), materialX - 50)},${y + 18} ${startX},${y + 12}`}
            fill="url(#sg-beamGrad)"
          />
          <line
            x1={startX}
            y1={y}
            x2={Math.min(
              startX +
                (materialX - startX) *
                  Math.min((animationProgress - 0.15) / 0.3, 1),
              materialX - 50,
            )}
            y2={y}
            stroke="#FFF3E4"
            strokeWidth="3"
            opacity="0.8"
          />
          {Array.from({ length: 12 }).map((_, i) => {
            const progress = ((Date.now() / 50 + i * 30) % 300) / 300;
            const particleX = startX + progress * (materialX - startX - 60);
            const wobble = Math.sin(Date.now() / 100 + i) * 5;
            return (
              <circle
                key={i}
                cx={particleX}
                cy={y + wobble}
                r={1.5}
                fill="#FFF3E4"
                opacity={0.6}
              >
                <animate
                  attributeName="opacity"
                  values="0.3;0.8;0.3"
                  dur={`${0.5 + Math.random() * 0.5}s`}
                  repeatCount="indefinite"
                />
              </circle>
            );
          })}
        </g>
      )}
      {animationProgress > 0.55 && transmission > 0 && (
        <g
          opacity={Math.min((animationProgress - 0.55) / 0.3, 1) * transmission}
          filter="url(#sg-beamGlow)"
        >
          <polygon
            points={`${materialX + 50},${y - 18} ${endX},${y - 25} ${endX},${y + 25} ${materialX + 50},${y + 18}`}
            fill="url(#sg-beamTrans)"
          />
          {transmission < 0.8 &&
            transmission > 0 &&
            [-30, -15, 15, 30].map((angle, i) => (
              <line
                key={i}
                x1={materialX + 50}
                y1={y}
                x2={endX - 50}
                y2={y + angle}
                stroke="#FC9145"
                strokeWidth="1"
                opacity={0.3 * transmission}
                strokeDasharray="5,10"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  values="0;15"
                  dur="0.5s"
                  repeatCount="indefinite"
                />
              </line>
            ))}
        </g>
      )}
    </g>
  );
};

// Generic material renderer
const MaterialSVG = ({ materialId, x, y, animationProgress, showName }) => {
  const mat = MATERIALS[materialId];
  if (!mat) return null;

  const typeColor =
    mat.type === "transparent"
      ? DS.colors.primary
      : mat.type === "translucent"
        ? DS.colors.accent
        : DS.colors.error;

  return (
    <g
      transform={`translate(${x - 50}, ${y - 75})`}
      opacity={Math.min(animationProgress / 0.15, 1)}
    >
      <defs>
        <linearGradient
          id={`sg-mat-${materialId}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor={mat.color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={mat.color} stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {/* Shadow */}
      <ellipse cx="50" cy="155" rx="40" ry="8" fill="rgba(83,48,134,0.12)" />
      {/* Material body */}
      <rect
        x="5"
        y="5"
        width="90"
        height="140"
        rx={DS.radius.md}
        fill={`url(#sg-mat-${materialId})`}
        stroke={typeColor}
        strokeWidth="2"
      />
      {/* Inner pattern based on type */}
      {mat.type === "transparent" && (
        <>
          <path d="M 15 15 L 30 15 L 15 50 Z" fill="white" opacity="0.4" />
          <path d="M 55 15 L 70 15 L 55 50 Z" fill="white" opacity="0.25" />
          <rect
            x="20"
            y="60"
            width="60"
            height="50"
            fill="white"
            opacity="0.15"
            rx="4"
          />
        </>
      )}
      {mat.type === "translucent" && (
        <>
          {Array.from({ length: 12 }).map((_, i) => (
            <line
              key={i}
              x1="10"
              y1={15 + i * 11}
              x2="90"
              y2={15 + i * 11}
              stroke={typeColor}
              strokeWidth="0.5"
              opacity="0.25"
            />
          ))}
          <ellipse
            cx="50"
            cy="75"
            rx="30"
            ry="40"
            fill="#FFF3E4"
            opacity="0.25"
          >
            <animate
              attributeName="opacity"
              values="0.15;0.35;0.15"
              dur="2s"
              repeatCount="indefinite"
            />
          </ellipse>
        </>
      )}
      {mat.type === "opaque" && (
        <>
          <line
            x1="5"
            y1="5"
            x2="95"
            y2="145"
            stroke={typeColor}
            strokeWidth="2"
            opacity="0.2"
          />
          <line
            x1="95"
            y1="5"
            x2="5"
            y2="145"
            stroke={typeColor}
            strokeWidth="2"
            opacity="0.2"
          />
          {Array.from({ length: 15 }).map((_, i) => (
            <line
              key={i}
              x1="10"
              y1={12 + i * 9}
              x2="90"
              y2={12 + i * 9}
              stroke={typeColor}
              strokeWidth="0.5"
              opacity="0.2"
            />
          ))}
        </>
      )}
      {/* Icon */}
      <text x="50" y="90" fontSize="36" textAnchor="middle">
        {mat.icon}
      </text>
      {/* Label */}
      {showName && (
        <g>
          <rect
            x="5"
            y="158"
            width="90"
            height="28"
            rx={DS.radius.sm}
            fill={typeColor}
          />
          <text
            x="50"
            y="177"
            fontSize="12"
            fontWeight="600"
            fill="white"
            textAnchor="middle"
            fontFamily={DS.font}
          >
            {mat.icon} {mat.name}
          </text>
        </g>
      )}
    </g>
  );
};

const ProjectionScreenSVG = ({
  x,
  y,
  transmission,
  animationProgress,
  showName,
}) => {
  const glowIntensity =
    transmission * Math.min((animationProgress - 0.55) / 0.3, 1);
  return (
    <g transform={`translate(${x - 15}, ${y - 120})`}>
      <defs>
        <radialGradient id="sg-screenGlow" cx="50%" cy="50%" r="70%">
          <stop
            offset="0%"
            stopColor="#FC9145"
            stopOpacity={glowIntensity * 0.8}
          />
          <stop
            offset="50%"
            stopColor="#FF7212"
            stopOpacity={glowIntensity * 0.4}
          />
          <stop offset="100%" stopColor="#FFF3E4" stopOpacity="0" />
        </radialGradient>
        <filter id="sg-screenBlur">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>
      <rect x="10" y="-20" width="10" height="25" fill="#533086" rx="2" />
      <rect x="0" y="0" width="30" height="240" rx="4" fill="#4E4E4E" />
      <rect x="3" y="3" width="24" height="234" fill="#F5F5F5" />
      {animationProgress > 0.55 && transmission > 0 && (
        <g filter="url(#sg-screenBlur)">
          <ellipse
            cx="15"
            cy="120"
            rx={15 + glowIntensity * 20}
            ry={60 + glowIntensity * 30}
            fill="url(#sg-screenGlow)"
          >
            <animate
              attributeName="rx"
              values={`${15 + glowIntensity * 18};${15 + glowIntensity * 22};${15 + glowIntensity * 18}`}
              dur="0.5s"
              repeatCount="indefinite"
            />
          </ellipse>
        </g>
      )}
      {animationProgress > 0.8 && transmission > 0 && (
        <ellipse
          cx="15"
          cy="120"
          rx="8"
          ry="20"
          fill="#FFF3E4"
          opacity={glowIntensity * 0.6}
        >
          <animate
            attributeName="opacity"
            values={`${glowIntensity * 0.4};${glowIntensity * 0.7};${glowIntensity * 0.4}`}
            dur="0.3s"
            repeatCount="indefinite"
          />
        </ellipse>
      )}
      {animationProgress > 0.8 && transmission === 0 && (
        <g>
          <text
            x="15"
            y="115"
            fontSize="10"
            fill="#8A8A8A"
            textAnchor="middle"
            fontWeight="bold"
            fontFamily={DS.font}
          >
            NO
          </text>
          <text
            x="15"
            y="130"
            fontSize="10"
            fill="#8A8A8A"
            textAnchor="middle"
            fontWeight="bold"
            fontFamily={DS.font}
          >
            LIGHT
          </text>
        </g>
      )}
      <rect x="12" y="240" width="6" height="30" fill="#533086" />
      <ellipse cx="15" cy="270" rx="15" ry="4" fill="#4E4E4E" />
      {showName && (
        <g>
          <rect
            x="-25"
            y="280"
            width="80"
            height="24"
            rx={DS.radius.sm}
            fill="#4E4E4E"
          />
          <text
            x="15"
            y="297"
            fontSize="11"
            fontWeight="600"
            fill="white"
            textAnchor="middle"
            fontFamily={DS.font}
          >
            📺 Screen
          </text>
        </g>
      )}
    </g>
  );
};

const TableSurface = ({ width, height }) => (
  <g>
    <defs>
      <linearGradient id="sg-table" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#EBEBEB" />
        <stop offset="100%" stopColor="#CACACA" />
      </linearGradient>
    </defs>
    <rect
      x="0"
      y={height - 80}
      width={width}
      height="80"
      fill="url(#sg-table)"
    />
    <line
      x1="0"
      y1={height - 80}
      x2={width}
      y2={height - 80}
      stroke="#C1C1EA"
      strokeWidth="3"
    />
  </g>
);

// ═══════════════════════════════════════════════════════════════════════════
// REAL WORLD VISUALIZATIONS (simplified with Singularity design)
// ═══════════════════════════════════════════════════════════════════════════

const RealWorldViz = ({ type, width, height, animationProgress }) => {
  const scenes = {
    home_window: {
      emoji: "🏠",
      label: "Home Windows",
      color: DS.colors.primary,
    },
    car_windshield: {
      emoji: "🚗",
      label: "Car Windshield",
      color: DS.colors.accent,
    },
    office_building: {
      emoji: "🏢",
      label: "Office Buildings",
      color: DS.colors.gradientStart,
    },
    greenhouse: { emoji: "🌿", label: "Greenhouse", color: "#2ECC71" },
  };
  const scene = scenes[type] || scenes.home_window;

  return (
    <g>
      <defs>
        <linearGradient id="sg-rwSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#C1C1EA" />
          <stop offset="100%" stopColor="#F5F5F5" />
        </linearGradient>
        <radialGradient id="sg-rwSun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF3E4" />
          <stop offset="60%" stopColor="#FC9145" />
          <stop offset="100%" stopColor="#FF7212" />
        </radialGradient>
        <linearGradient id="sg-rwLight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF3E4" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#FFF3E4" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        fill="url(#sg-rwSky)"
        rx={DS.radius.lg}
      />
      {/* Sun */}
      <circle cx={width - 120} cy="100" r="50" fill="url(#sg-rwSun)">
        <animate
          attributeName="r"
          values="48;52;48"
          dur="3s"
          repeatCount="indefinite"
        />
      </circle>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <line
          key={i}
          x1={width - 120 + Math.cos((angle * Math.PI) / 180) * 60}
          y1={100 + Math.sin((angle * Math.PI) / 180) * 60}
          x2={width - 120 + Math.cos((angle * Math.PI) / 180) * 80}
          y2={100 + Math.sin((angle * Math.PI) / 180) * 80}
          stroke="#FC9145"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.7"
        >
          <animate
            attributeName="opacity"
            values="0.4;0.9;0.4"
            dur={`${1.5 + i * 0.1}s`}
            repeatCount="indefinite"
          />
        </line>
      ))}
      {/* Ground */}
      <rect
        x="0"
        y={height - 120}
        width={width}
        height="120"
        fill="#EBEBEB"
        rx="0"
      />
      {/* Scene illustration area */}
      <rect
        x={width / 2 - 150}
        y={height / 2 - 100}
        width="300"
        height="200"
        rx={DS.radius.lg}
        fill="white"
        stroke={scene.color}
        strokeWidth="2"
        opacity="0.9"
      />
      <text x={width / 2} y={height / 2 - 20} fontSize="64" textAnchor="middle">
        {scene.emoji}
      </text>
      <text
        x={width / 2}
        y={height / 2 + 30}
        fontSize="20"
        fontWeight="700"
        fill={DS.colors.text}
        textAnchor="middle"
        fontFamily={DS.font}
      >
        {scene.label}
      </text>
      <text
        x={width / 2}
        y={height / 2 + 55}
        fontSize="13"
        fill={DS.colors.textLight}
        textAnchor="middle"
        fontFamily={DS.font}
      >
        Transparent Glass — 95% Light
      </text>
      {/* Light beams */}
      {animationProgress > 0.3 && (
        <g opacity={Math.min((animationProgress - 0.3) * 2, 0.5)}>
          <polygon
            points={`${width - 120},100 ${width / 2 - 100},${height / 2 - 80} ${width / 2 + 100},${height / 2 - 80} ${width - 80},100`}
            fill="url(#sg-rwLight)"
          >
            <animate
              attributeName="opacity"
              values="0.3;0.5;0.3"
              dur="2s"
              repeatCount="indefinite"
            />
          </polygon>
        </g>
      )}
      {/* Label */}
      <g>
        <rect
          x={width / 2 - 100}
          y={height - 70}
          width="200"
          height="44"
          rx={DS.radius.md}
          fill={scene.color}
        />
        <text
          x={width / 2}
          y={height - 42}
          fontSize="15"
          fontWeight="700"
          fill="white"
          textAnchor="middle"
          fontFamily={DS.font}
        >
          {scene.emoji} {scene.label}
        </text>
      </g>
      {/* Benefit badge */}
      {animationProgress > 0.6 && (
        <g opacity={Math.min((animationProgress - 0.6) * 3, 1)}>
          <rect
            x="20"
            y="20"
            width="200"
            height="44"
            rx={DS.radius.md}
            fill={DS.colors.success}
          />
          <text
            x="120"
            y="38"
            fontSize="12"
            fontWeight="700"
            fill="white"
            textAnchor="middle"
            fontFamily={DS.font}
          >
            💡 Saves Energy!
          </text>
          <text
            x="120"
            y="54"
            fontSize="11"
            fill="#d1fae5"
            textAnchor="middle"
            fontFamily={DS.font}
          >
            Natural light reduces costs
          </text>
        </g>
      )}
    </g>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MATERIAL PROPERTIES CARD
// ═══════════════════════════════════════════════════════════════════════════

const MaterialPropertiesCard = ({ material }) => {
  const typeConfig = {
    transparent: {
      bg: "#C1C1EA20",
      border: DS.colors.primary,
      label: "TRANSPARENT",
      icon: "✦✦",
      desc: "Light passes through completely",
      vis: "Objects clearly visible",
      shadow: "Very light or no shadow",
      examples: "Glass, Clear Water, Clear Plastic",
    },
    translucent: {
      bg: "#FFF3E440",
      border: DS.colors.accent,
      label: "TRANSLUCENT",
      icon: "✦~",
      desc: "Light passes through partially",
      vis: "Objects blurry/not clear",
      shadow: "Soft, faint shadow",
      examples: "Frosted Glass, Tracing Paper, Thin Cloth",
    },
    opaque: {
      bg: "#E74C3C15",
      border: DS.colors.error,
      label: "OPAQUE",
      icon: "✗",
      desc: "Light cannot pass through",
      vis: "Objects not visible",
      shadow: "Dark, sharp shadow",
      examples: "Cardboard, Metal, Wood, Book",
    },
  };
  const cfg = typeConfig[material.type];

  const cardProps = [
    { icon: "💡", label: "Light Behavior", value: cfg.desc },
    { icon: "👁️", label: "Visibility", value: cfg.vis },
    { icon: "🌑", label: "Shadow Type", value: cfg.shadow },
    { icon: "📋", label: "Examples", value: cfg.examples },
  ];

  return (
    <div
      style={{
        margin: `0 ${DS.spacing.lg}px ${DS.spacing.lg}px`,
        padding: DS.spacing.lg,
        backgroundColor: cfg.bg,
        borderRadius: DS.radius.lg,
        border: `2px solid ${cfg.border}`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 20,
          paddingBottom: 16,
          borderBottom: `1px solid ${cfg.border}40`,
        }}
      >
        <span style={{ fontSize: 28 }}>{material.icon}</span>
        <div style={{ flex: 1 }}>
          <h3
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 700,
              color: cfg.border,
              fontFamily: DS.font,
              letterSpacing: "0.02em",
            }}
          >
            {cfg.label}
          </h3>
          <p
            style={{
              margin: "2px 0 0",
              fontSize: 13,
              color: DS.colors.textLight,
              fontFamily: DS.font,
            }}
          >
            {material.name}
          </p>
        </div>
        <div
          style={{
            padding: "6px 16px",
            background: cfg.border,
            borderRadius: DS.radius.full,
            color: "white",
            fontWeight: 700,
            fontSize: 13,
            fontFamily: DS.font,
          }}
        >
          {cfg.icon} {material.transmission}%
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 12,
        }}
      >
        {cardProps.map((p, i) => (
          <div
            key={i}
            style={{
              padding: 14,
              background: "white",
              borderRadius: DS.radius.md,
              borderLeft: `3px solid ${cfg.border}`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 6,
              }}
            >
              <span style={{ fontSize: 16 }}>{p.icon}</span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: cfg.border,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  fontFamily: DS.font,
                }}
              >
                {p.label}
              </span>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                fontWeight: 600,
                color: DS.colors.text,
                lineHeight: 1.5,
                fontFamily: DS.font,
              }}
            >
              {p.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface LightMaterialsToolPropsConfig {
  width?: number;
  height?: number;
  initialMode?: string;
  showModeSelector?: boolean;
  enabledModes?: string[];
  showNavigation?: boolean;
  animationSpeed?: number;
  autoPlayDuration?: number;
  filterSteps?: number[];
}

const LightMaterialsTool = ({
  props = {} as LightMaterialsToolPropsConfig,
  setStepDetails,
  stopAutoNext = false,
}: {
  props?: LightMaterialsToolPropsConfig;
  setStepDetails?: (details: unknown) => void;
  stopAutoNext?: boolean;
}) => {
  const width = props.width ?? 900;
  const height = props.height ?? 550;
  const initialMode = props.initialMode ?? "learn";
  const showModeSelector = props.showModeSelector ?? true;
  const enabledModes = props.enabledModes ?? [
    "learn",
    "practice",
    "real_world",
  ];
  const showNavigation = props.showNavigation ?? true;
  const animationSpeed = props.animationSpeed ?? 1;
  const autoPlayDuration = props.autoPlayDuration ?? 8000;

  const [mode, setMode] = useState(initialMode);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [currentMaterial, setCurrentMaterial] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
  const [hovered, setHovered] = useState(null);

  const animationFrameRef = useRef();
  const autoPlayTimerRef = useRef();
  const startTimeRef = useRef(null);

  const allSteps = getStepData(mode);
  const steps = props.filterSteps
    ? allSteps.filter((s) => props.filterSteps!.includes(s.id))
    : allSteps;
  const currentStep = steps[currentStepIndex];

  useEffect(() => {
    startTimeRef.current = null;
    const duration = 4000 / animationSpeed;
    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min(
        (timestamp - startTimeRef.current) / duration,
        1,
      );
      setAnimationProgress(progress);
      if (progress < 1)
        animationFrameRef.current = requestAnimationFrame(animate);
    };
    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, [currentStepIndex, animationSpeed]);

  useEffect(() => {
    setCurrentMaterial(
      currentStep?.materialId ? MATERIALS[currentStep.materialId] : null,
    );
  }, [currentStep]);

  useEffect(() => {
    if (isPlaying && !stopAutoNext && autoPlayDuration > 0) {
      autoPlayTimerRef.current = setTimeout(() => {
        if (currentStepIndex < steps.length - 1) {
          setCurrentStepIndex((p) => p + 1);
          setSelectedAnswer(null);
          setShowFeedback(false);
        } else setIsPlaying(false);
      }, autoPlayDuration);
    }
    return () => {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    };
  }, [
    isPlaying,
    currentStepIndex,
    steps.length,
    autoPlayDuration,
    stopAutoNext,
  ]);

  useEffect(() => {
    if (setStepDetails)
      setStepDetails({
        currentStep: currentStepIndex + 1,
        totalSteps: steps.length,
        mode,
        stepData: currentStep,
      });
  }, [currentStepIndex, steps.length, mode, currentStep, setStepDetails]);

  const nav = (dir) => {
    const next = currentStepIndex + dir;
    if (next >= 0 && next < steps.length) {
      setCurrentStepIndex(next);
      setIsPlaying(false);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const handleModeChange = (m) => {
    setMode(m);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setAnsweredQuestions(new Set());
  };

  const torchX = 100,
    torchY = height / 2 - 20,
    materialX = width / 2,
    screenX = width - 80;
  const transmission = currentMaterial ? currentMaterial.transmission / 100 : 0;

  // Button component matching Singularity design
  interface SgButtonProps {
    children?: React.ReactNode;
    variant?: string;
    active?: boolean;
    disabled?: boolean;
    onClick?: () => void;
    style?: React.CSSProperties;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    key?: React.Key;
  }
  const SgButton = ({
    children,
    variant = "contained",
    active,
    disabled,
    onClick,
    style: extraStyle = {},
    onMouseEnter,
    onMouseLeave,
  }: SgButtonProps) => {
    const base = {
      fontFamily: DS.font,
      fontSize: 14,
      fontWeight: 600,
      border: "none",
      cursor: disabled ? "not-allowed" : "pointer",
      borderRadius: DS.radius.sm,
      padding: "12px 24px",
      transition: "all 0.25s ease",
      letterSpacing: "0.01em",
      opacity: disabled ? 0.45 : 1,
      ...extraStyle,
    };
    if (variant === "contained") {
      return (
        <button
          onClick={onClick}
          disabled={disabled}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          style={{
            ...base,
            background: active ? DS.gradient : DS.colors.surface,
            color: active ? "white" : DS.colors.text,
            boxShadow: active ? DS.shadow.md : DS.shadow.sm,
          }}
        >
          {children}
        </button>
      );
    }
    if (variant === "outlined") {
      return (
        <button
          onClick={onClick}
          disabled={disabled}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          style={{
            ...base,
            background: "transparent",
            color: DS.colors.primary,
            border: `2px solid ${DS.colors.primary}`,
            boxShadow: "none",
          }}
        >
          {children}
        </button>
      );
    }
    if (variant === "highlight") {
      return (
        <button
          onClick={onClick}
          disabled={disabled}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          style={{
            ...base,
            background: DS.colors.accent,
            color: "white",
            boxShadow: DS.shadow.accent,
          }}
        >
          {children}
        </button>
      );
    }
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{ ...base, background: "transparent", color: DS.colors.primary }}
      >
        {children}
      </button>
    );
  };

  return (
    <div
      style={{
        width,
        maxWidth: "100%",
        margin: "0 auto",
        fontFamily: DS.font,
        background: DS.colors.white,
        borderRadius: DS.radius.xl,
        boxShadow: DS.shadow.lg,
        overflow: "hidden",
      }}
    >
      {/* Google Fonts */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');`}</style>

      {/* Header */}
      <div
        style={{
          padding: "24px 28px",
          background: DS.gradientSubtle,
          borderBottom: `3px solid ${DS.colors.primary}`,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 200,
            height: "100%",
            background: DS.gradient,
            opacity: 0.08,
            borderRadius: "0 0 0 100px",
          }}
        />
        <h2
          style={{
            margin: 0,
            fontSize: 26,
            fontWeight: 800,
            color: DS.colors.text,
            fontFamily: DS.font,
            letterSpacing: "-0.01em",
          }}
        >
          {currentStep?.title || "Light through Materials"}
        </h2>
        <p
          style={{
            margin: "6px 0 0",
            fontSize: 14,
            color: DS.colors.textLight,
            fontFamily: DS.font,
            lineHeight: 1.5,
          }}
        >
          {mode === "practice"
            ? "Test your knowledge"
            : mode === "real_world"
              ? "Real-world applications"
              : currentMaterial
                ? `${currentMaterial.icon} ${currentMaterial.description}`
                : "NCERT Grade 7 — Topic 11.3"}
        </p>
      </div>

      {/* Mode Selector */}
      {showModeSelector && (
        <div
          style={{
            display: "flex",
            gap: 10,
            padding: "14px 28px",
            background: DS.colors.surface,
            borderBottom: `1px solid ${DS.colors.borderLight}`,
          }}
        >
          {enabledModes.map((m) => (
            <SgButton
              key={m}
              variant="contained"
              active={mode === m}
              onClick={() => handleModeChange(m)}
            >
              {m === "learn"
                ? "📚 Learn"
                : m === "practice"
                  ? "🎯 Practice"
                  : "🌍 Real World"}
            </SgButton>
          ))}
        </div>
      )}

      {/* Practice Mode */}
      {mode === "practice" && currentStep?.question && (
        <div
          style={{
            padding: "24px 28px",
            borderBottom: `1px solid ${DS.colors.borderLight}`,
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: DS.colors.text,
              marginBottom: 20,
              lineHeight: 1.6,
              fontFamily: DS.font,
            }}
          >
            {currentStep.question}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(currentStep.options ?? []).map((opt, i) => {
              const isSelected = selectedAnswer === i;
              const isCorrect = i === currentStep.correctAnswer;
              let bg = DS.colors.white,
                border = DS.colors.borderLight,
                color = DS.colors.text;
              if (showFeedback) {
                if (isCorrect) {
                  bg = "#C1C1EA30";
                  border = DS.colors.primary;
                  color = DS.colors.primary;
                } else if (isSelected) {
                  bg = "#E74C3C15";
                  border = DS.colors.error;
                  color = DS.colors.error;
                }
              } else if (isSelected) {
                bg = "#C1C1EA20";
                border = DS.colors.primary;
              }
              return (
                <button
                  key={i}
                  onClick={() => !showFeedback && setSelectedAnswer(i)}
                  style={{
                    padding: "14px 20px",
                    border: `2px solid ${border}`,
                    borderRadius: DS.radius.sm,
                    fontSize: 15,
                    fontWeight: 500,
                    textAlign: "left",
                    cursor: showFeedback ? "default" : "pointer",
                    background: bg,
                    color,
                    fontFamily: DS.font,
                    transition: "all 0.2s ease",
                    transform:
                      isSelected && !showFeedback ? "translateX(4px)" : "none",
                  }}
                >
                  <span style={{ fontWeight: 700, marginRight: 8 }}>
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {opt}
                  {showFeedback && isCorrect && (
                    <span style={{ float: "right", color: DS.colors.primary }}>
                      ✓
                    </span>
                  )}
                  {showFeedback && isSelected && !isCorrect && (
                    <span style={{ float: "right", color: DS.colors.error }}>
                      ✗
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <SgButton
            variant="highlight"
            disabled={selectedAnswer === null || showFeedback}
            onClick={() => {
              if (selectedAnswer !== null && !showFeedback) {
                setShowFeedback(true);
                if (selectedAnswer === currentStep.correctAnswer)
                  setAnsweredQuestions((p) => new Set(p).add(currentStep.id));
              }
            }}
            style={{ marginTop: 20 }}
          >
            Submit Answer
          </SgButton>
          {showFeedback && (
            <div
              style={{
                marginTop: 20,
                padding: "16px 20px",
                borderRadius: DS.radius.md,
                background:
                  selectedAnswer === currentStep.correctAnswer
                    ? "#C1C1EA20"
                    : "#E74C3C15",
                border: `2px solid ${selectedAnswer === currentStep.correctAnswer ? DS.colors.primary : DS.colors.error}`,
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color:
                    selectedAnswer === currentStep.correctAnswer
                      ? DS.colors.primary
                      : DS.colors.error,
                  marginBottom: 8,
                  fontFamily: DS.font,
                }}
              >
                {selectedAnswer === currentStep.correctAnswer
                  ? "✓ Correct!"
                  : "✗ Incorrect"}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: DS.colors.text,
                  lineHeight: 1.6,
                  fontFamily: DS.font,
                }}
              >
                {currentStep.explanation}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Real World Description */}
      {mode === "real_world" && currentStep?.visualization && (
        <div
          style={{
            padding: "20px 28px",
            borderBottom: `1px solid ${DS.colors.borderLight}`,
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: DS.colors.text,
              marginBottom: 12,
              lineHeight: 1.6,
              fontFamily: DS.font,
            }}
          >
            {currentStep.description}
          </div>
          <div
            style={{
              padding: "10px 16px",
              background: DS.colors.accentLight,
              borderRadius: DS.radius.sm,
              borderLeft: `3px solid ${DS.colors.accent}`,
              fontSize: 14,
              color: "#B45309",
              fontWeight: 600,
              fontFamily: DS.font,
            }}
          >
            ✨ {currentStep.benefit}
          </div>
        </div>
      )}

      {/* SVG Visualization */}
      {(mode === "learn" || mode === "real_world") && (
        <div
          style={{
            padding: 20,
            background: DS.colors.surface,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div style={{ position: "relative" }}>
            <svg
              width={width}
              height={height}
              style={{
                borderRadius: DS.radius.lg,
                background: "white",
                border: `1px solid ${DS.colors.borderLight}`,
              }}
            >
              {mode === "learn" ? (
                <>
                  <defs>
                    <linearGradient
                      id="sg-bg"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#F5F5F5" />
                      <stop offset="100%" stopColor="#EBEBEB" />
                    </linearGradient>
                  </defs>
                  <rect width={width} height={height} fill="url(#sg-bg)" />
                  <TableSurface width={width} height={height} />
                  <FlashlightSVG
                    x={torchX}
                    y={torchY}
                    isOn={animationProgress > 0.1}
                    animationProgress={animationProgress}
                    showName={true}
                  />
                  {currentMaterial && (
                    <LightBeam
                      startX={torchX + 50}
                      endX={screenX}
                      y={torchY}
                      transmission={transmission}
                      animationProgress={animationProgress}
                      materialX={materialX}
                    />
                  )}
                  {currentMaterial && (
                    <MaterialSVG
                      materialId={currentMaterial.id}
                      x={materialX}
                      y={torchY}
                      animationProgress={animationProgress}
                      showName={true}
                    />
                  )}
                  <ProjectionScreenSVG
                    x={screenX}
                    y={torchY}
                    transmission={transmission}
                    animationProgress={animationProgress}
                    showName={true}
                  />
                  {!currentMaterial && (
                    <g>
                      <text
                        x={width / 2}
                        y={height / 2 - 50}
                        fontSize="26"
                        fontWeight="800"
                        fill={DS.colors.text}
                        textAnchor="middle"
                        fontFamily={DS.font}
                      >
                        🔦 Light & Materials
                      </text>
                      <text
                        x={width / 2}
                        y={height / 2 - 10}
                        fontSize="15"
                        fill={DS.colors.textLight}
                        textAnchor="middle"
                        fontFamily={DS.font}
                      >
                        Explore how light interacts with different materials
                      </text>
                      <text
                        x={width / 2}
                        y={height / 2 + 20}
                        fontSize="14"
                        fill={DS.colors.primary}
                        textAnchor="middle"
                        fontFamily={DS.font}
                      >
                        Click Next to begin →
                      </text>
                    </g>
                  )}
                </>
              ) : (
                currentStep?.visualization && (
                  <RealWorldViz
                    type={currentStep.visualization}
                    width={width}
                    height={height}
                    animationProgress={animationProgress}
                  />
                )
              )}
            </svg>
            {/* Classification Badge */}
            {currentMaterial &&
              animationProgress > 0.6 &&
              mode === "learn" &&
              (() => {
                const badgeConfig = {
                  transparent: {
                    color: DS.colors.primary,
                    text: "TRANSPARENT",
                    icon: "✦✦",
                  },
                  translucent: {
                    color: DS.colors.accent,
                    text: "TRANSLUCENT",
                    icon: "✦~",
                  },
                  opaque: { color: DS.colors.error, text: "OPAQUE", icon: "✗" },
                };
                const b = badgeConfig[currentMaterial.type];
                return (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 20,
                      left: "50%",
                      transform: "translateX(-50%)",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "10px 24px",
                      background: `${b.color}15`,
                      border: `2px solid ${b.color}`,
                      borderRadius: DS.radius.full,
                      color: b.color,
                      fontWeight: 700,
                      fontSize: 15,
                      fontFamily: DS.font,
                      letterSpacing: "0.04em",
                    }}
                  >
                    <span>{b.icon}</span> {b.text}
                  </div>
                );
              })()}
          </div>
        </div>
      )}

      {/* Material Properties */}
      {mode === "learn" && currentMaterial && animationProgress > 0.5 && (
        <MaterialPropertiesCard material={currentMaterial} />
      )}

      {/* Navigation */}
      {showNavigation && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 28px",
            background: DS.colors.white,
            borderTop: `1px solid ${DS.colors.borderLight}`,
          }}
        >
          <SgButton
            variant="outlined"
            disabled={currentStepIndex === 0}
            onClick={() => nav(-1)}
            style={{ padding: "6px 14px", fontSize: 12 }}
          >
            ← Prev
          </SgButton>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: DS.colors.textLight,
                fontFamily: DS.font,
              }}
            >
              Step {currentStepIndex + 1} of {steps.length}
            </span>
            {/* Step dots */}
            <div style={{ display: "flex", gap: 4 }}>
              {steps.map((_, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setCurrentStepIndex(i);
                    setSelectedAnswer(null);
                    setShowFeedback(false);
                  }}
                  style={{
                    width: i === currentStepIndex ? 20 : 8,
                    height: 8,
                    borderRadius: DS.radius.full,
                    background:
                      i === currentStepIndex
                        ? DS.gradient
                        : i < currentStepIndex
                          ? DS.colors.primaryLight
                          : DS.colors.borderLight,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </div>
            {mode === "learn" && (
              <SgButton
                variant={isPlaying ? "highlight" : "contained"}
                active={!isPlaying}
                onClick={() => setIsPlaying(!isPlaying)}
                style={{ padding: "6px 14px", fontSize: 12 }}
              >
                {isPlaying ? "⏸ Pause" : "▶ Play"}
              </SgButton>
            )}
          </div>
          <SgButton
            variant="highlight"
            disabled={currentStepIndex === steps.length - 1}
            onClick={() => nav(1)}
            style={{ padding: "6px 14px", fontSize: 12 }}
          >
            Next →
          </SgButton>
        </div>
      )}
    </div>
  );
};

export default LightMaterialsTool;
