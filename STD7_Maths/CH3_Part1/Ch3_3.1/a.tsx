// @ts-ignore - React module resolved at build/runtime
import React, { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

type ModeType = "learn" | "practice" | "real_world";

interface StepDetails {
  currentStep: number;
  totalSteps: number;
  currentMode: ModeType;
  stepTitle: string;
}

interface LearnStep {
  id: number;
  title: string;
  content: string;
  illustration: string;
  visual: "screws" | "magnifying" | "ruler" | "numberline" | "target";
}

interface PracticeQuestion {
  id: number;
  question: string;
  options: string[];
  correct: string;
  explanation: string;
}

interface RealWorldScenario {
  id: number;
  title: string;
  scenario: string;
  visual: string;
  question: string;
  answer: string;
  realLifeTip: string;
}

interface DecimalMeasurementAdditionalProps {
  rulerRange?: { min: number; max: number };
  markedValue?: number;
  totalBlocks?: number;
  highlightedBlocks?: number;
  numberLineRange?: { min: number; max: number };
  numberLineValue?: number;
  customQuestions?: PracticeQuestion[];
  customScenarios?: RealWorldScenario[];
  showAnimations?: boolean;
  animationDuration?: number;
}

interface DecimalMeasurementProps {
  props?: {
    width?: number;
    height?: number;
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
    additionalProps?: DecimalMeasurementAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// GLOBAL ANIMATION STYLES
// ═══════════════════════════════════════════════════════════════════════════

const GlobalAnimationStyles = () => (
  <style>{`
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideLeft {
      from { opacity: 0; transform: translateX(-50px); }
      to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes slideRight {
      from { opacity: 0; transform: translateX(50px); }
      to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.8); }
      to { opacity: 1; transform: scale(1); }
    }
    
    @keyframes popIn {
      0% { opacity: 0; transform: scale(0); }
      50% { transform: scale(1.1); }
      100% { opacity: 1; transform: scale(1); }
    }
    
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    
    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    
    @keyframes drawLine {
      from { stroke-dashoffset: 1000; }
      to { stroke-dashoffset: 0; }
    }
    
    @keyframes fillProgress {
      from { width: 0%; }
      to { width: 100%; }
    }
  `}</style>
);

// ═══════════════════════════════════════════════════════════════════════════
// ENHANCED VISUAL COMPONENTS WITH PROPER ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

const ScrewsAndToolbox: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  return (
    <div
      style={{
        animation: "fadeIn 0.6s ease-out",
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <svg
        width={isMobile ? "100%" : "600"}
        height={isMobile ? "300" : "400"}
        viewBox="0 0 600 400"
        style={{ maxWidth: "100%", height: "auto" }}
      >
        <defs>
          <linearGradient id="screwGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#9e9e9e" />
            <stop offset="50%" stopColor="#757575" />
            <stop offset="100%" stopColor="#616161" />
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Toolbox - appears first */}
        <g style={{ animation: "slideUp 0.8s ease-out" }}>
          <rect
            x="50"
            y="250"
            width="150"
            height="100"
            fill="#d32f2f"
            rx="5"
            filter="url(#shadow)"
          />
          <rect x="90" y="235" width="70" height="20" fill="#757575" rx="10" />
          <rect x="110" y="280" width="30" height="15" fill="#424242" rx="3" />
          <text x="125" y="315" fill="white" fontSize="28" textAnchor="middle">
            🔧
          </text>
        </g>

        {/* Left screw - drops in */}
        <g style={{ animation: "slideDown 1s 0.5s ease-out both" }}>
          <ellipse
            cx="270"
            cy="145"
            rx="20"
            ry="12"
            fill="#616161"
            filter="url(#shadow)"
          />
          <rect
            x="250"
            y="145"
            width="40"
            height="140"
            fill="url(#screwGrad)"
          />
          {[...Array(14)].map((_, i) => (
            <line
              key={i}
              x1="250"
              y1={155 + i * 10}
              x2="290"
              y2={155 + i * 10}
              stroke="#424242"
              strokeWidth="1.5"
              opacity="0.7"
            />
          ))}
          <ellipse cx="270" cy="145" rx="18" ry="10" fill="#757575" />
          <line
            x1="260"
            y1="145"
            x2="280"
            y2="145"
            stroke="#424242"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Label */}
          <rect
            x="235"
            y="295"
            width="70"
            height="28"
            fill="rgba(83, 48, 134, 0.1)"
            rx="6"
          />
          <text
            x="270"
            y="315"
            fill="#533086"
            fontSize="16"
            fontWeight="bold"
            textAnchor="middle"
          >
            2.7 cm
          </text>
        </g>

        {/* Right screw - drops in later */}
        <g style={{ animation: "slideDown 1s 0.8s ease-out both" }}>
          <ellipse
            cx="370"
            cy="125"
            rx="20"
            ry="12"
            fill="#616161"
            filter="url(#shadow)"
          />
          <rect
            x="350"
            y="125"
            width="40"
            height="160"
            fill="url(#screwGrad)"
          />
          {[...Array(16)].map((_, i) => (
            <line
              key={i}
              x1="350"
              y1={135 + i * 10}
              x2="390"
              y2={135 + i * 10}
              stroke="#424242"
              strokeWidth="1.5"
              opacity="0.7"
            />
          ))}
          <ellipse cx="370" cy="125" rx="18" ry="10" fill="#757575" />
          <line
            x1="360"
            y1="125"
            x2="380"
            y2="125"
            stroke="#424242"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Label */}
          <rect
            x="335"
            y="295"
            width="70"
            height="28"
            fill="rgba(83, 48, 134, 0.1)"
            rx="6"
          />
          <text
            x="370"
            y="315"
            fill="#533086"
            fontSize="16"
            fontWeight="bold"
            textAnchor="middle"
          >
            3.2 cm
          </text>
        </g>

        {/* Comparison arrow - appears last */}
        <g style={{ animation: "scaleIn 0.6s 1.5s ease-out both" }}>
          <path
            d="M 290 220 Q 320 200 350 220"
            stroke="#FF7212"
            strokeWidth="3"
            fill="none"
            strokeDasharray="5,5"
            strokeDashoffset="0"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="20"
              to="0"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>
          <rect
            x="275"
            y="180"
            width="90"
            height="32"
            fill="#FF7212"
            rx="16"
            filter="url(#shadow)"
          />
          <text
            x="320"
            y="202"
            fill="white"
            fontSize="15"
            fontWeight="bold"
            textAnchor="middle"
          >
            Different!
          </text>
        </g>
      </svg>
    </div>
  );
};

const MagnifyingGlass: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  return (
    <div
      style={{
        animation: "fadeIn 0.6s ease-out",
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <svg
        width={isMobile ? "100%" : "400"}
        height={isMobile ? "250" : "350"}
        viewBox="0 0 400 350"
        style={{ maxWidth: "100%", height: "auto" }}
      >
        <defs>
          <radialGradient id="glassGrad">
            <stop offset="0%" stopColor="rgba(193, 193, 234, 0.3)" />
            <stop offset="100%" stopColor="rgba(193, 193, 234, 0.1)" />
          </radialGradient>
          <filter id="blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
          </filter>
        </defs>

        {/* Main glass with scale animation */}
        <g
          style={{
            animation: "scaleIn 1s ease-out",
            transformOrigin: "180px 150px",
          }}
        >
          <circle
            cx="180"
            cy="150"
            r="100"
            fill="url(#glassGrad)"
            stroke="#4A4DC9"
            strokeWidth="6"
          />
          <circle
            cx="180"
            cy="150"
            r="95"
            fill="none"
            stroke="#C1C1EA"
            strokeWidth="2"
          />

          {/* Shine effect with pulse */}
          <ellipse
            cx="150"
            cy="120"
            rx="40"
            ry="30"
            fill="rgba(255, 255, 255, 0.6)"
            transform="rotate(-30 150 120)"
            style={{ animation: "pulse 2s ease-in-out infinite" }}
          />

          {/* Handle */}
          <line
            x1="250"
            y1="220"
            x2="330"
            y2="300"
            stroke="#533086"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <line
            x1="250"
            y1="220"
            x2="330"
            y2="300"
            stroke="#9e9e9e"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </g>

        {/* Magnified ruler content */}
        <g
          transform="translate(130, 125)"
          style={{ animation: "fadeIn 1s 0.5s ease-out both" }}
        >
          <line
            x1="0"
            y1="0"
            x2="100"
            y2="0"
            stroke="#4A4DC9"
            strokeWidth="3"
          />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <g
              key={i}
              style={{
                animation: `slideUp 0.4s ${0.7 + i * 0.1}s ease-out both`,
              }}
            >
              <line
                x1={i * 20}
                y1="0"
                x2={i * 20}
                y2="15"
                stroke="#533086"
                strokeWidth="2"
              />
              <text
                x={i * 20}
                y="30"
                fill="#533086"
                fontSize="10"
                textAnchor="middle"
                fontWeight="bold"
              >
                {i}
              </text>
            </g>
          ))}
        </g>

        {/* Text */}
        <text
          x="200"
          y="320"
          fill="#533086"
          fontSize="18"
          fontWeight="bold"
          textAnchor="middle"
          style={{ animation: "slideUp 0.8s 1.2s ease-out both" }}
        >
          Zooming in to see the details!
        </text>
      </svg>
    </div>
  );
};

const InteractiveRuler: React.FC<{
  isMobile: boolean;
  markedValue?: number;
}> = ({ isMobile, markedValue = 2.7 }) => {
  const width = isMobile ? 300 : 600;
  const rulerWidth = width - 40;

  return (
    <div
      style={{
        animation: "fadeIn 0.6s ease-out",
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <svg
        width={isMobile ? "100%" : width}
        height="220"
        viewBox={`0 0 ${width} 220`}
        style={{ maxWidth: "100%", height: "auto" }}
      >
        <defs>
          <linearGradient id="rulerBg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#f9f9f9" />
            <stop offset="100%" stopColor="#eeeeee" />
          </linearGradient>
          <filter id="rulerShadow">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Ruler background */}
        <rect
          x="20"
          y="90"
          width={rulerWidth}
          height="80"
          fill="url(#rulerBg)"
          stroke="#4A4DC9"
          strokeWidth="3"
          rx="6"
          filter="url(#rulerShadow)"
          style={{ animation: "slideLeft 0.8s ease-out" }}
        />

        {/* Major marks and numbers */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const x = 20 + i * (rulerWidth / 5);
          return (
            <g
              key={i}
              style={{
                animation: `popIn 0.4s ${0.5 + i * 0.1}s ease-out both`,
              }}
            >
              <line
                x1={x}
                y1="115"
                x2={x}
                y2="170"
                stroke="#533086"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <text
                x={x}
                y="195"
                fill="#533086"
                fontSize="18"
                fontWeight="bold"
                textAnchor="middle"
              >
                {i}
              </text>

              {/* Minor marks (tenths) */}
              {i < 5 &&
                [...Array(9)].map((_, j) => {
                  const smallX = x + (j + 1) * (rulerWidth / 50);
                  return (
                    <line
                      key={`${i}-${j}`}
                      x1={smallX}
                      y1="135"
                      x2={smallX}
                      y2="170"
                      stroke="#4A4DC9"
                      strokeWidth="2"
                      opacity="0.7"
                    />
                  );
                })}
            </g>
          );
        })}

        {/* Arrow pointing UP from the exact position on ruler */}
        <g style={{ animation: "slideUp 0.8s 1.2s ease-out both" }}>
          {/* Arrow line from ruler marking upward */}
          <line
            x1={20 + markedValue * (rulerWidth / 5)}
            y1="170"
            x2={20 + markedValue * (rulerWidth / 5)}
            y2="75"
            stroke="#FF7212"
            strokeWidth="3"
          />

          {/* Arrow head pointing upward */}
          <path
            d={`M ${20 + markedValue * (rulerWidth / 5)} 75 l -10 12 l 20 0 z`}
            fill="#FF7212"
            style={{
              animation: "bounce 1.5s 2s ease-in-out infinite",
              transformOrigin: `${20 + markedValue * (rulerWidth / 5)}px 75px`,
            }}
          />

          {/* Value label */}
          <rect
            x={20 + markedValue * (rulerWidth / 5) - 50}
            y="40"
            width="100"
            height="32"
            fill="#FF7212"
            rx="16"
            filter="url(#rulerShadow)"
          />
          <text
            x={20 + markedValue * (rulerWidth / 5)}
            y="63"
            fill="white"
            fontSize="16"
            fontWeight="bold"
            textAnchor="middle"
          >
            2.7/5 cm
          </text>
        </g>
      </svg>
    </div>
  );
};

const FractionBlocks: React.FC<{
  total?: number;
  highlighted?: number;
  isMobile: boolean;
}> = ({ total = 10, highlighted = 7, isMobile }) => {
  const blockSize = isMobile ? 40 : 50;
  const gap = isMobile ? 6 : 8;
  const blocksPerRow = isMobile ? 5 : 10;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${blocksPerRow}, ${blockSize}px)`,
        gap: `${gap}px`,
        justifyContent: "center",
        margin: "30px 0",
        animation: "fadeIn 0.6s ease-out",
      }}
    >
      {[...Array(total)].map((_, i) => {
        const isHighlighted = i < highlighted;
        return (
          <div
            key={i}
            style={{
              width: `${blockSize}px`,
              height: `${blockSize}px`,
              background: isHighlighted
                ? "linear-gradient(135deg, #4A4DC9 0%, #533086 100%)"
                : "linear-gradient(135deg, #f5f5f5 0%, #e5e5e5 100%)",
              border: `3px solid ${isHighlighted ? "#533086" : "#C1C1EA"}`,
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: isMobile ? "16px" : "18px",
              fontWeight: "700",
              color: isHighlighted ? "white" : "#666",
              animation: `popIn 0.5s ${i * 0.08}s ease-out both`,
              boxShadow: isHighlighted
                ? "0 4px 15px rgba(83, 48, 134, 0.3)"
                : "0 2px 8px rgba(0, 0, 0, 0.1)",
              cursor: "pointer",
              transition: "all 0.3s ease",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.15) rotate(5deg)";
              e.currentTarget.style.boxShadow = isHighlighted
                ? "0 8px 20px rgba(83, 48, 134, 0.4)"
                : "0 4px 12px rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1) rotate(0deg)";
              e.currentTarget.style.boxShadow = isHighlighted
                ? "0 4px 15px rgba(83, 48, 134, 0.3)"
                : "0 2px 8px rgba(0, 0, 0, 0.1)";
            }}
          >
            {/* Shimmer effect for highlighted blocks */}
            {isHighlighted && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "-100%",
                  width: "50%",
                  height: "100%",
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                  animation: `shimmer 2s ${i * 0.2}s infinite`,
                }}
              />
            )}
            <span style={{ position: "relative", zIndex: 1 }}>{i + 1}</span>
          </div>
        );
      })}
    </div>
  );
};

const NumberLine: React.FC<{ isMobile: boolean; value?: number }> = ({
  isMobile,
  value = 2.7,
}) => {
  const width = isMobile ? 300 : 600;
  const lineWidth = width - 40;

  return (
    <div
      style={{
        animation: "fadeIn 0.6s ease-out",
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <svg
        width={isMobile ? "100%" : width}
        height="200"
        viewBox={`0 0 ${width} 200`}
        style={{ maxWidth: "100%", height: "auto" }}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Main line */}
        <line
          x1="20"
          y1="100"
          x2={20 + lineWidth}
          y2="100"
          stroke="#4A4DC9"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={lineWidth}
          strokeDashoffset={lineWidth}
          style={{ animation: "drawLine 1.5s ease-out forwards" }}
        />

        {/* Number points */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const x = 20 + i * (lineWidth / 5);
          return (
            <g
              key={i}
              style={{
                animation: `popIn 0.5s ${0.5 + i * 0.15}s ease-out both`,
              }}
            >
              <circle cx={x} cy="100" r="12" fill="#4A4DC9" />
              <circle cx={x} cy="100" r="10" fill="white" />
              <circle cx={x} cy="100" r="5" fill="#4A4DC9" />
              <text
                x={x}
                y="145"
                fill="#533086"
                fontSize="20"
                fontWeight="bold"
                textAnchor="middle"
              >
                {i}
              </text>
            </g>
          );
        })}

        {/* Marked value pointer - STATIC (no pulse) */}
        <g style={{ animation: "scaleIn 0.8s 1.8s ease-out both" }}>
          <circle
            cx={20 + value * (lineWidth / 5)}
            cy="100"
            r="20"
            fill="#FF7212"
            filter="url(#glow)"
          />
          <circle
            cx={20 + value * (lineWidth / 5)}
            cy="100"
            r="17"
            fill="white"
            opacity="0.3"
          />
          <circle
            cx={20 + value * (lineWidth / 5)}
            cy="100"
            r="8"
            fill="white"
          />

          {/* Label */}
          <rect
            x={20 + value * (lineWidth / 5) - 45}
            y="35"
            width="90"
            height="36"
            fill="#FF7212"
            rx="18"
          />
          <text
            x={20 + value * (lineWidth / 5)}
            y="60"
            fill="white"
            fontSize="18"
            fontWeight="bold"
            textAnchor="middle"
          >
            2.7/5
          </text>
        </g>
      </svg>
    </div>
  );
};

const PrecisionTarget: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const size = isMobile ? 250 : 350;
  const center = size / 2;

  return (
    <div
      style={{
        animation: "fadeIn 0.6s ease-out",
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <svg
        width={isMobile ? "100%" : size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ maxWidth: "100%", height: "auto" }}
      >
        <defs>
          <filter id="targetShadow">
            <feDropShadow dx="0" dy="4" stdDeviation="5" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* Rings with sequential scale animation */}
        {[
          { r: 0.85, color: "#FFF3E4", delay: 0 },
          { r: 0.65, color: "#FC9145", delay: 0.15 },
          { r: 0.45, color: "#FF7212", delay: 0.3 },
          { r: 0.25, color: "#533086", delay: 0.45 },
        ].map((ring, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={center * ring.r}
            fill={ring.color}
            stroke="white"
            strokeWidth="3"
            filter="url(#targetShadow)"
            style={{
              animation: `scaleIn 0.6s ${ring.delay}s ease-out both`,
              transformOrigin: "center",
            }}
          />
        ))}

        {/* Center circle */}
        <circle
          cx={center}
          cy={center}
          r={center * 0.12}
          fill="#4A4DC9"
          style={{ animation: "popIn 0.5s 0.8s ease-out both" }}
        />

        {/* Crosshairs */}
        <line
          x1={center}
          y1={center * 0.3}
          x2={center}
          y2={center * 1.7}
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="2"
          strokeDasharray="5,5"
          style={{ animation: "fadeIn 0.6s 1s ease-out both" }}
        />
        <line
          x1={center * 0.3}
          y1={center}
          x2={center * 1.7}
          y2={center}
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="2"
          strokeDasharray="5,5"
          style={{ animation: "fadeIn 0.6s 1s ease-out both" }}
        />

        {/* Labels */}
        <text
          x={center}
          y={center * 0.25}
          fill="#533086"
          fontSize="18"
          fontWeight="bold"
          textAnchor="middle"
          style={{ animation: "slideDown 0.6s 1.2s ease-out both" }}
        >
          Precision
        </text>
        <text
          x={center}
          y={center + 12}
          fill="white"
          fontSize="32"
          textAnchor="middle"
          style={{ animation: "scaleIn 0.6s 1.4s ease-out both" }}
        >
          🎯
        </text>
        <text
          x={center}
          y={center * 1.85}
          fill="#533086"
          fontSize="18"
          fontWeight="bold"
          textAnchor="middle"
          style={{ animation: "slideUp 0.6s 1.2s ease-out both" }}
        >
          Accuracy Matters!
        </text>

        {/* Corner checkmarks */}
        {[0, 90, 180, 270].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const distance = center * 0.95;
          const x = center + Math.cos(rad) * distance;
          const y = center + Math.sin(rad) * distance;
          return (
            <g
              key={i}
              style={{
                animation: `popIn 0.4s ${1.6 + i * 0.1}s ease-out both`,
              }}
            >
              <circle cx={x} cy={y} r="10" fill="#4A4DC9" />
              <text
                x={x}
                y={y + 5}
                fill="white"
                fontSize="12"
                fontWeight="bold"
                textAnchor="middle"
              >
                ✓
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// RESPONSIVE HOOK (unchanged)
// ═══════════════════════════════════════════════════════════════════════════

const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    isMobile: typeof window !== "undefined" ? window.innerWidth < 640 : false,
    isTablet:
      typeof window !== "undefined"
        ? window.innerWidth >= 640 && window.innerWidth < 1024
        : false,
    isDesktop: typeof window !== "undefined" ? window.innerWidth >= 1024 : true,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenSize({
        width,
        isMobile: width < 640,
        isTablet: width >= 640 && width < 1024,
        isDesktop: width >= 1024,
      });
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return screenSize;
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT (continues with same props and logic but better animations)
// ═══════════════════════════════════════════════════════════════════════════

const DecimalMeasurementTool: React.FC<DecimalMeasurementProps> = ({
  props = {},
  setStepDetails,
  stopAutoNext = false,
  setStopAutoNext,
}) => {
  const {
    initialMode = "learn",
    showModeSelector = true,
    enabledModes = ["learn", "practice", "real_world"],
    showNavigation = true,
    showPlayPause = true,
    showStepIndicator = true,
    initialStep = 0,
    animationSpeed = 1,
    autoPlayDuration = 8000,
    themeColor = "#533086",
    darkMode = false,
    additionalProps = {},
  } = props as NonNullable<DecimalMeasurementProps["props"]>;

  const { isMobile, isTablet } = useResponsive();

  const [mode, setMode] = useState<ModeType>(initialMode);
  const [learnStep, setLearnStep] = useState(initialStep);
  const [practiceStep, setPracticeStep] = useState(initialStep);
  const [realWorldStep, setRealWorldStep] = useState(initialStep);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const autoPlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const LEARN_STEPS = 5;
  const PRACTICE_STEPS = 5;
  const REALWORLD_STEPS = 4;

  // Trigger animation refresh when step changes
  useEffect(() => {
    setAnimationKey((prev) => prev + 1);
  }, [learnStep, mode]);

  // Default content (same as before)
  const defaultLearnContent: LearnStep[] = [
    {
      id: 1,
      title: "Sonu's Discovery",
      content:
        "Sonu was watching his mother fix a toy. She tried to join two pieces with a screw, but it didn't work. The screw wasn't the right size!",
      illustration:
        "When she brought another screw from the box, it worked perfectly. The two screws looked the same to Sonu, but they were slightly different in length.",
      visual: "screws",
    },
    {
      id: 2,
      title: "Why Small Differences Matter",
      content:
        "Sonu was fascinated! Such a small difference in length could matter so much. This made him curious about measuring tiny differences accurately.",
      illustration:
        "Sometimes, things look the same but are actually different when we measure them precisely.",
      visual: "magnifying",
    },
    {
      id: 3,
      title: "Measuring with a Ruler",
      content:
        "Look at a ruler. Between each whole number (like 2 and 3), the space is divided into 10 equal parts. Each small part is called one-tenth (1/10).",
      illustration:
        "If a screw measures 2 cm and 7 small parts, we write it as 2 7/10 cm (two and seven-tenth centimeters).",
      visual: "ruler",
    },
    {
      id: 4,
      title: "Reading Measurements",
      content:
        "To measure 2 7/10 cm: Start at 0, count to 2, then count 7 more small divisions. That's 2 cm plus 7/10 cm!",
      illustration:
        "Similarly, 3 2/10 cm means 3 cm plus 2/10 cm (three and two-tenth centimeters).",
      visual: "numberline",
    },
    {
      id: 5,
      title: "Why We Need Smaller Units",
      content:
        "When exact measurements are required, we divide units into smaller parts. This helps us be more precise and accurate!",
      illustration:
        "Without smaller units, we couldn't tell the difference between two screws that are almost the same length but not quite!",
      visual: "target",
    },
  ];

  const defaultPracticeQuestions: PracticeQuestion[] =
    additionalProps.customQuestions || [
      {
        id: 1,
        question: "What does 2 7/10 cm mean?",
        options: [
          "2 cm and 7 cm",
          "2 cm and 7 tenths of a cm",
          "27 cm",
          "2.7 meters",
        ],
        correct: "2 cm and 7 tenths of a cm",
        explanation:
          "2 7/10 cm means 2 whole centimeters plus 7 parts out of 10 equal parts (7 tenths of a centimeter).",
      },
      {
        id: 2,
        question:
          "How many equal parts is the unit between two consecutive numbers divided into on a standard ruler?",
        options: ["5 parts", "8 parts", "10 parts", "12 parts"],
        correct: "10 parts",
        explanation:
          "The unit length between two consecutive numbers is divided into 10 equal parts, making each part one-tenth (1/10).",
      },
      {
        id: 3,
        question:
          "Why couldn't Sonu's mother fix the toy with the first screw?",
        options: [
          "The screw was too expensive",
          "The screw was the wrong color",
          "The screw was not the right size",
          "The screw was broken",
        ],
        correct: "The screw was not the right size",
        explanation:
          "The first screw was not the right size - even though it looked similar, the small difference in length meant it couldn't join the pieces properly.",
      },
      {
        id: 4,
        question: "What is 3 2/10 cm read as?",
        options: [
          "Three point two centimeters",
          "Thirty-two centimeters",
          "Three and two-tenth centimeters",
          "Three or two centimeters",
        ],
        correct: "Three and two-tenth centimeters",
        explanation:
          "3 2/10 cm is read as 'three and two-tenth centimeters' - three whole centimeters and two-tenths of a centimeter.",
      },
      {
        id: 5,
        question: "When do we need to use smaller units of measurement?",
        options: [
          "When measuring very large objects only",
          "When exact/accurate measures are required",
          "Only in science experiments",
          "Never - whole numbers are enough",
        ],
        correct: "When exact/accurate measures are required",
        explanation:
          "When exact or accurate measures are required, we need to use smaller units of measurement to be more precise.",
      },
    ];

  const defaultRealWorldScenarios: RealWorldScenario[] =
    additionalProps.customScenarios || [
      {
        id: 1,
        title: "Carpentry Workshop",
        scenario:
          "A carpenter needs to cut wood pieces for a bookshelf. Each piece must be exactly 45.7 cm long. If he only measures to the nearest whole centimeter (46 cm), the pieces won't fit together properly!",
        visual: "🪚",
        question:
          "Why is measuring 45.7 cm more accurate than measuring 46 cm?",
        answer:
          "Because 45.7 cm is closer to the actual required length. The 0.7 cm (7 tenths) makes a difference of 3 mm, which can make the bookshelf pieces not align properly.",
        realLifeTip:
          "Carpenters say: 'Measure twice, cut once' - and they measure in tenths of centimeters for precision!",
      },
      {
        id: 2,
        title: "Medicine Dosage",
        scenario:
          "A doctor prescribes 2.5 ml of medicine for a child. The nurse must measure exactly 2.5 ml (2 and 5/10 ml), not 2 ml or 3 ml.",
        visual: "💊",
        question: "What could happen if we don't measure medicine accurately?",
        answer:
          "Too little medicine might not work properly to cure the illness. Too much medicine could be harmful. The 0.5 ml (5 tenths) difference matters a lot for safety and effectiveness!",
        realLifeTip:
          "Medical syringes have markings in tenths to ensure accurate dosing!",
      },
      {
        id: 3,
        title: "Running a Race",
        scenario:
          "In the Olympics, athletes' times are measured in hundredths of a second! A runner finishing in 9.87 seconds beats someone finishing in 9.92 seconds by just 0.05 seconds (5 hundredths).",
        visual: "🏃",
        question: "Why do we need such precise measurements in sports?",
        answer:
          "Because races can be incredibly close! The difference between winning gold and silver can be just a few hundredths of a second. Without precise measurements, we couldn't determine the winner fairly.",
        realLifeTip:
          "Electronic timing systems measure to 1/1000th of a second in professional sports!",
      },
      {
        id: 4,
        title: "Baking a Cake",
        scenario:
          "A recipe calls for 2.5 cups of flour (2 and 5/10 cups). Using 2 cups makes the cake too dry. Using 3 cups makes it too thick and heavy.",
        visual: "🎂",
        question: "How does 0.5 cup (5 tenths) affect the recipe?",
        answer:
          "That half cup (5 tenths) is the difference between a perfect cake and a failed one! Baking is chemistry - precise measurements ensure the ingredients react correctly.",
        realLifeTip:
          "Professional bakers weigh ingredients to the nearest gram for perfect results every time!",
      },
    ];

  // Event handlers (same as before, keeping existing logic)
  const handleModeChange = (newMode: ModeType) => {
    if (!enabledModes.includes(newMode)) return;
    setMode(newMode);
    setLearnStep(0);
    setPracticeStep(0);
    setRealWorldStep(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setTotalCorrect(0);
  };

  const handleNext = () => {
    if (mode === "learn" && learnStep < LEARN_STEPS - 1) {
      setLearnStep(learnStep + 1);
    } else if (mode === "practice" && practiceStep < PRACTICE_STEPS - 1) {
      setPracticeStep(practiceStep + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else if (mode === "real_world" && realWorldStep < REALWORLD_STEPS - 1) {
      setRealWorldStep(realWorldStep + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const handlePrevious = () => {
    if (mode === "learn" && learnStep > 0) {
      setLearnStep(learnStep - 1);
    } else if (mode === "practice" && practiceStep > 0) {
      setPracticeStep(practiceStep - 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else if (mode === "real_world" && realWorldStep > 0) {
      setRealWorldStep(realWorldStep - 1);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(false);
  };

  const checkAnswer = () => {
    setShowResult(true);
    if (selectedAnswer === defaultPracticeQuestions[practiceStep].correct) {
      setTotalCorrect(totalCorrect + 1);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (setStopAutoNext) {
      setStopAutoNext(isPlaying);
    }
  };

  const getCurrentStep = () => {
    if (mode === "learn") return learnStep + 1;
    if (mode === "practice") return practiceStep + 1;
    return realWorldStep + 1;
  };

  const getTotalSteps = () => {
    if (mode === "learn") return LEARN_STEPS;
    if (mode === "practice") return PRACTICE_STEPS;
    return REALWORLD_STEPS;
  };

  const isLastStep = () => {
    if (mode === "learn") return learnStep === LEARN_STEPS - 1;
    if (mode === "practice") return practiceStep === PRACTICE_STEPS - 1;
    return realWorldStep === REALWORLD_STEPS - 1;
  };

  const isFirstStep = () => {
    if (mode === "learn") return learnStep === 0;
    if (mode === "practice") return practiceStep === 0;
    return realWorldStep === 0;
  };

  const renderVisualInstrument = () => {
    const currentContent = defaultLearnContent[learnStep];

    switch (currentContent.visual) {
      case "screws":
        return <ScrewsAndToolbox key={animationKey} isMobile={isMobile} />;
      case "magnifying":
        return <MagnifyingGlass key={animationKey} isMobile={isMobile} />;
      case "ruler":
        return (
          <div key={animationKey}>
            <InteractiveRuler
              isMobile={isMobile}
              markedValue={additionalProps.markedValue || 2.7}
            />
          </div>
        );
      case "numberline":
        return (
          <NumberLine
            key={animationKey}
            isMobile={isMobile}
            value={additionalProps.numberLineValue || 2.7}
          />
        );
      case "target":
        return <PrecisionTarget key={animationKey} isMobile={isMobile} />;
      default:
        return null;
    }
  };

  // Continue with rendering (same navbar, progress, content structure from before)
  // But with improved animations on content transitions

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: darkMode ? "#1a1a1a" : "#F5F5F5",
        fontFamily: "Poppins, system-ui, -apple-system, sans-serif",
        color: darkMode ? "#ffffff" : "#000000",
      }}
    >
      <GlobalAnimationStyles />

      {/* Navbar */}
      <nav
        style={{
          background: `linear-gradient(135deg, ${themeColor} 0%, #FC9145 100%)`,
          boxShadow: "0 4px 12px rgba(83, 48, 134, 0.2)",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: isMobile ? "12px 16px" : "16px 24px",
          }}
        >
          {showModeSelector ? (
            // Single row layout with title on LEFT and modes on RIGHT
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: isMobile ? "12px" : "20px",
                flexWrap: isMobile ? "wrap" : "nowrap",
              }}
            >
              {/* Title - LEFT */}
              <h1
                style={{
                  color: "white",
                  fontSize: isMobile ? "18px" : isTablet ? "20px" : "22px",
                  fontWeight: "700",
                  margin: "0",
                  whiteSpace: "nowrap",
                  flex: isMobile ? "1 1 100%" : "0 0 auto",
                }}
              >
                The Need for Smaller Units
              </h1>

              {/* Mode buttons - RIGHT */}
              <div
                style={{
                  display: "flex",
                  gap: isMobile ? "8px" : "12px",
                  flex: isMobile ? "1 1 100%" : "0 0 auto",
                  justifyContent: isMobile ? "stretch" : "flex-end",
                }}
              >
                {enabledModes.map((m) => (
                  <button
                    key={m}
                    onClick={() => handleModeChange(m)}
                    style={{
                      background:
                        mode === m ? "white" : "rgba(255, 255, 255, 0.2)",
                      color:
                        mode === m
                          ? m === "real_world"
                            ? "#FF7212"
                            : themeColor
                          : "white",
                      padding: isMobile ? "10px 14px" : "12px 18px",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: isMobile ? "13px" : "15px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      transform: mode === m ? "scale(1)" : "scale(0.98)",
                      boxShadow:
                        mode === m ? "0 4px 12px rgba(0, 0, 0, 0.15)" : "none",
                      backdropFilter: "blur(10px)",
                      minHeight: "44px",
                      flex: isMobile ? "1" : "0 0 auto",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                      if (mode !== m)
                        e.currentTarget.style.transform = "scale(1)";
                    }}
                    onMouseLeave={(e) => {
                      if (mode !== m)
                        e.currentTarget.style.transform = "scale(0.98)";
                    }}
                  >
                    {m === "learn"
                      ? "📚 Learn"
                      : m === "practice"
                        ? "🧠 Practice"
                        : "🌍 Real World"}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Title only (when mode selector is hidden)
            <div
              style={{
                textAlign: "center",
              }}
            >
              <h1
                style={{
                  color: "white",
                  fontSize: isMobile ? "20px" : isTablet ? "24px" : "28px",
                  fontWeight: "700",
                  margin: "0",
                  lineHeight: "1.2",
                }}
              >
                The Need for Smaller Units
              </h1>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: isMobile ? "12px" : "24px",
        }}
      >
        {/* Progress Bar */}
        {showStepIndicator && (
          <div
            style={{
              background: darkMode ? "#2a2a2a" : "white",
              borderRadius: isMobile ? "10px" : "12px",
              padding: isMobile ? "14px 16px" : "20px 24px",
              marginBottom: isMobile ? "16px" : "28px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              animation: "slideDown 0.6s ease-out",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "12px",
                fontSize: isMobile ? "12px" : "15px",
                fontWeight: "600",
                color: themeColor,
              }}
            >
              <span>
                Step {getCurrentStep()} of {getTotalSteps()}
              </span>
              <span>
                {Math.round((getCurrentStep() / getTotalSteps()) * 100)}%
                Complete
              </span>
            </div>
            <div
              style={{
                width: "100%",
                height: isMobile ? "8px" : "10px",
                background: darkMode ? "#3a3a3a" : "#EBEBEB",
                borderRadius: "5px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${(getCurrentStep() / getTotalSteps()) * 100}%`,
                  height: "100%",
                  background:
                    mode === "learn"
                      ? `linear-gradient(90deg, #4A4DC9 0%, ${themeColor} 100%)`
                      : mode === "practice"
                        ? `linear-gradient(90deg, ${themeColor} 0%, #FC9145 100%)`
                        : "linear-gradient(90deg, #FF7212 0%, #FC9145 100%)",
                  borderRadius: "5px",
                  animation: "fillProgress 0.8s ease-out",
                }}
              />
            </div>
          </div>
        )}

        {/* Learn Mode Content */}
        {mode === "learn" && (
          <div
            style={{
              background: darkMode ? "#2a2a2a" : "white",
              borderRadius: isMobile ? "12px" : "16px",
              padding: isMobile ? "16px" : "32px",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
              border: `2px solid ${darkMode ? "#3a3a3a" : "#C1C1EA"}`,
              animation: "slideUp 0.6s ease-out",
            }}
          >
            <h2
              style={{
                color: themeColor,
                fontSize: isMobile ? "20px" : isTablet ? "24px" : "28px",
                fontWeight: "700",
                margin: "0 0 20px 0",
                textAlign: "center",
                animation: "slideDown 0.6s ease-out",
              }}
            >
              {defaultLearnContent[learnStep].title}
            </h2>

            <div
              style={{
                minHeight: isMobile ? "200px" : "350px",
                marginBottom: "24px",
              }}
            >
              {renderVisualInstrument()}
            </div>

            <div
              style={{
                background: darkMode ? "rgba(193, 193, 234, 0.1)" : "#C1C1EA20",
                borderRadius: isMobile ? "10px" : "12px",
                padding: isMobile ? "14px" : "20px",
                border: `1px solid ${darkMode ? "rgba(193, 193, 234, 0.2)" : "#C1C1EA"}`,
                animation: "slideUp 0.8s 0.3s ease-out both",
              }}
            >
              <p
                style={{
                  color: darkMode ? "#e0e0e0" : "#4E4E4E",
                  fontSize: isMobile ? "14px" : "17px",
                  lineHeight: "1.6",
                  margin: "0 0 16px 0",
                }}
              >
                {defaultLearnContent[learnStep].content}
              </p>

              <div
                style={{
                  background: darkMode ? "#3a3a3a" : "white",
                  borderRadius: "10px",
                  padding: isMobile ? "12px" : "16px",
                  borderLeft: "4px solid #4A4DC9",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
                }}
              >
                <p
                  style={{
                    color: darkMode ? "#e0e0e0" : "#4E4E4E",
                    fontSize: isMobile ? "13px" : "16px",
                    lineHeight: "1.5",
                    margin: "0",
                    fontStyle: "italic",
                  }}
                >
                  💡 {defaultLearnContent[learnStep].illustration}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Practice Mode Content */}
        {mode === "practice" && (
          <div
            style={{
              background: darkMode ? "#2a2a2a" : "white",
              borderRadius: isMobile ? "12px" : "16px",
              padding: isMobile ? "16px" : "32px",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
              border: `2px solid ${darkMode ? "#3a3a3a" : "#C1C1EA"}`,
              animation: "slideUp 0.6s ease-out",
            }}
          >
            <div
              style={{
                background: darkMode
                  ? "rgba(193, 193, 234, 0.1)"
                  : "linear-gradient(135deg, #C1C1EA30 0%, #FFF3E430 100%)",
                padding: isMobile ? "12px" : "16px",
                borderRadius: isMobile ? "10px" : "12px",
                marginBottom: isMobile ? "16px" : "24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <span
                style={{
                  fontSize: isMobile ? "14px" : "17px",
                  fontWeight: "600",
                  color: themeColor,
                }}
              >
                Question {practiceStep + 1} of {PRACTICE_STEPS}
              </span>
              <div
                style={{
                  background: darkMode ? "#3a3a3a" : "white",
                  padding: isMobile ? "8px 14px" : "10px 18px",
                  borderRadius: "24px",
                  fontSize: isMobile ? "14px" : "17px",
                  fontWeight: "700",
                  color: themeColor,
                  boxShadow: "0 2px 8px rgba(83, 48, 134, 0.15)",
                }}
              >
                Score: {totalCorrect} / {PRACTICE_STEPS}
              </div>
            </div>

            <div
              style={{
                background: darkMode ? "rgba(193, 193, 234, 0.1)" : "#C1C1EA20",
                borderRadius: isMobile ? "10px" : "12px",
                padding: isMobile ? "14px" : "20px",
                marginBottom: isMobile ? "14px" : "20px",
                border: `1px solid ${darkMode ? "rgba(193, 193, 234, 0.2)" : "#C1C1EA"}`,
              }}
            >
              <h3
                style={{
                  color: themeColor,
                  fontSize: isMobile ? "16px" : "20px",
                  fontWeight: "700",
                  lineHeight: "1.4",
                  margin: "0 0 16px 0",
                }}
              >
                {defaultPracticeQuestions[practiceStep].question}
              </h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: isMobile ? "10px" : "12px",
                }}
              >
                {defaultPracticeQuestions[practiceStep].options.map(
                  (option, index) => {
                    const isSelected = selectedAnswer === option;
                    const isCorrect =
                      option === defaultPracticeQuestions[practiceStep].correct;
                    const showFeedback = showResult;

                    let buttonStyle: React.CSSProperties = {
                      width: "100%",
                      padding: isMobile ? "12px 14px" : "14px 18px",
                      border: "2px solid",
                      borderRadius: isMobile ? "8px" : "10px",
                      fontSize: isMobile ? "14px" : "16px",
                      fontWeight: "500",
                      cursor: showFeedback ? "default" : "pointer",
                      transition: "all 0.3s ease",
                      textAlign: "left",
                      background: darkMode ? "#3a3a3a" : "#FFFFFF",
                      borderColor: darkMode ? "#4a4a4a" : "#EBEBEB",
                      color: darkMode ? "#e0e0e0" : "#4E4E4E",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      minHeight: "52px",
                    };

                    if (!showFeedback && isSelected) {
                      buttonStyle.background = darkMode
                        ? "rgba(74, 77, 201, 0.2)"
                        : "#C1C1EA20";
                      buttonStyle.borderColor = "#4A4DC9";
                      buttonStyle.transform = "scale(0.98)";
                    }

                    if (showFeedback) {
                      if (isCorrect) {
                        buttonStyle.background = darkMode
                          ? "rgba(74, 77, 201, 0.3)"
                          : "#C1C1EA30";
                        buttonStyle.borderColor = "#4A4DC9";
                        buttonStyle.color = "#533086";
                        buttonStyle.fontWeight = "600";
                      } else if (isSelected && !isCorrect) {
                        buttonStyle.background = darkMode
                          ? "rgba(255, 114, 18, 0.2)"
                          : "#FFF3E450";
                        buttonStyle.borderColor = "#FF7212";
                        buttonStyle.color = "#FF7212";
                      } else {
                        buttonStyle.background = darkMode
                          ? "#2a2a2a"
                          : "#F5F5F5";
                        buttonStyle.borderColor = darkMode
                          ? "#3a3a3a"
                          : "#EBEBEB";
                        buttonStyle.opacity = "0.6";
                      }
                    }

                    return (
                      <button
                        key={index}
                        onClick={() =>
                          !showFeedback && handleAnswerSelect(option)
                        }
                        disabled={showFeedback}
                        style={buttonStyle}
                      >
                        <span style={{ flex: 1 }}>{option}</span>
                        {showFeedback && isCorrect && (
                          <span
                            style={{ fontSize: isMobile ? "18px" : "20px" }}
                          >
                            ✓
                          </span>
                        )}
                        {showFeedback && isSelected && !isCorrect && (
                          <span
                            style={{ fontSize: isMobile ? "18px" : "20px" }}
                          >
                            ✗
                          </span>
                        )}
                      </button>
                    );
                  },
                )}
              </div>
            </div>

            {selectedAnswer && !showResult && (
              <button
                onClick={checkAnswer}
                style={{
                  width: "100%",
                  background: `linear-gradient(135deg, ${themeColor} 0%, #FC9145 100%)`,
                  color: "white",
                  padding: isMobile ? "14px" : "16px",
                  border: "none",
                  borderRadius: isMobile ? "10px" : "12px",
                  fontSize: isMobile ? "15px" : "17px",
                  fontWeight: "600",
                  cursor: "pointer",
                  marginBottom: isMobile ? "14px" : "20px",
                  boxShadow: "0 4px 12px rgba(83, 48, 134, 0.3)",
                  transition: "all 0.3s ease",
                  minHeight: "52px",
                }}
              >
                Check Answer
              </button>
            )}

            {showResult && (
              <div
                style={{
                  borderRadius: isMobile ? "10px" : "12px",
                  padding: isMobile ? "14px" : "20px",
                  border: "2px solid",
                  marginBottom: isMobile ? "14px" : "20px",
                  background:
                    selectedAnswer ===
                    defaultPracticeQuestions[practiceStep].correct
                      ? darkMode
                        ? "rgba(74, 77, 201, 0.2)"
                        : "#C1C1EA30"
                      : darkMode
                        ? "rgba(255, 114, 18, 0.2)"
                        : "#FFF3E450",
                  borderColor:
                    selectedAnswer ===
                    defaultPracticeQuestions[practiceStep].correct
                      ? "#4A4DC9"
                      : "#FF7212",
                }}
              >
                <h4
                  style={{
                    fontSize: isMobile ? "15px" : "18px",
                    fontWeight: "700",
                    marginBottom: isMobile ? "10px" : "12px",
                    color: themeColor,
                    margin: "0 0 12px 0",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  {selectedAnswer ===
                  defaultPracticeQuestions[practiceStep].correct ? (
                    <>
                      <span style={{ fontSize: isMobile ? "20px" : "24px" }}>
                        ✓
                      </span>
                      <span>Correct! Well done! 🎉</span>
                    </>
                  ) : (
                    <>
                      <span style={{ fontSize: isMobile ? "20px" : "24px" }}>
                        ✗
                      </span>
                      <span>Not quite right. Let's learn!</span>
                    </>
                  )}
                </h4>
                <p
                  style={{
                    color: darkMode ? "#e0e0e0" : "#4E4E4E",
                    fontSize: isMobile ? "13px" : "16px",
                    lineHeight: "1.6",
                    margin: "0",
                  }}
                >
                  {defaultPracticeQuestions[practiceStep].explanation}
                </p>
              </div>
            )}

            {isLastStep() && showResult && (
              <div
                style={{
                  borderRadius: isMobile ? "12px" : "16px",
                  padding: isMobile ? "20px" : "28px",
                  border: `2px solid ${themeColor}`,
                  textAlign: "center",
                  background: darkMode
                    ? "rgba(193, 193, 234, 0.1)"
                    : "linear-gradient(135deg, #C1C1EA 0%, #FFF3E4 100%)",
                }}
              >
                <h3
                  style={{
                    fontSize: isMobile ? "22px" : "28px",
                    fontWeight: "700",
                    color: themeColor,
                    marginBottom: isMobile ? "10px" : "12px",
                    margin: "0 0 12px 0",
                  }}
                >
                  Practice Complete! 🎊
                </h3>
                <p
                  style={{
                    fontSize: isMobile ? "18px" : "22px",
                    fontWeight: "600",
                    color: darkMode ? "#e0e0e0" : "#4E4E4E",
                    marginBottom: isMobile ? "8px" : "10px",
                    margin: "0 0 10px 0",
                  }}
                >
                  Final Score: {totalCorrect} out of {PRACTICE_STEPS}
                </p>
                <p
                  style={{
                    color: darkMode ? "#e0e0e0" : "#4E4E4E",
                    fontSize: isMobile ? "14px" : "16px",
                    margin: "0",
                  }}
                >
                  {totalCorrect === PRACTICE_STEPS
                    ? "Perfect score! You're a measurement master!"
                    : totalCorrect >= PRACTICE_STEPS * 0.7
                      ? "Great job! You understand the concepts well!"
                      : "Good effort! Review the Learn mode for better understanding."}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Real World Mode Content */}
        {mode === "real_world" && (
          <div
            style={{
              background: darkMode ? "#2a2a2a" : "white",
              borderRadius: isMobile ? "12px" : "16px",
              padding: isMobile ? "16px" : "32px",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
              border: `2px solid ${darkMode ? "#3a3a3a" : "#FFF3E4"}`,
              animation: "slideUp 0.6s ease-out",
            }}
          >
            <div
              style={{
                textAlign: "center",
                marginBottom: isMobile ? "16px" : "32px",
              }}
            >
              <div
                style={{
                  fontSize: isMobile ? "64px" : isTablet ? "80px" : "100px",
                  marginBottom: isMobile ? "12px" : "20px",
                  animation: "scaleIn 0.8s ease-out",
                }}
              >
                {defaultRealWorldScenarios[realWorldStep].visual}
              </div>
              <h2
                style={{
                  color: themeColor,
                  fontSize: isMobile ? "20px" : isTablet ? "24px" : "28px",
                  fontWeight: "700",
                  margin: "0",
                  animation: "slideDown 0.6s ease-out",
                }}
              >
                {defaultRealWorldScenarios[realWorldStep].title}
              </h2>
            </div>

            <div
              style={{
                background: darkMode ? "rgba(255, 243, 228, 0.1)" : "#FFF3E450",
                borderRadius: isMobile ? "10px" : "12px",
                padding: isMobile ? "14px" : "20px",
                marginBottom: isMobile ? "14px" : "20px",
                border: "2px solid #FF7212",
                animation: "slideLeft 0.6s 0.2s ease-out both",
              }}
            >
              <h4
                style={{
                  color: "#FF7212",
                  fontSize: isMobile ? "15px" : "18px",
                  fontWeight: "700",
                  marginBottom: isMobile ? "10px" : "12px",
                  margin: "0 0 12px 0",
                }}
              >
                The Scenario:
              </h4>
              <p
                style={{
                  color: darkMode ? "#e0e0e0" : "#4E4E4E",
                  fontSize: isMobile ? "14px" : "17px",
                  lineHeight: "1.6",
                  margin: "0",
                }}
              >
                {defaultRealWorldScenarios[realWorldStep].scenario}
              </p>
            </div>

            <div
              style={{
                background: darkMode ? "rgba(255, 243, 228, 0.1)" : "#FFF3E4",
                borderRadius: isMobile ? "10px" : "12px",
                padding: isMobile ? "14px" : "20px",
                marginBottom: isMobile ? "14px" : "20px",
                borderLeft: "4px solid #FC9145",
                animation: "slideRight 0.6s 0.4s ease-out both",
              }}
            >
              <h4
                style={{
                  color: "#FF7212",
                  fontSize: isMobile ? "15px" : "18px",
                  fontWeight: "700",
                  marginBottom: isMobile ? "8px" : "12px",
                  margin: "0 0 12px 0",
                }}
              >
                Think About It:
              </h4>
              <p
                style={{
                  color: darkMode ? "#e0e0e0" : "#4E4E4E",
                  fontSize: isMobile ? "14px" : "17px",
                  margin: "0",
                }}
              >
                {defaultRealWorldScenarios[realWorldStep].question}
              </p>
            </div>

            <div
              style={{
                background: darkMode ? "rgba(193, 193, 234, 0.1)" : "#C1C1EA30",
                borderRadius: isMobile ? "10px" : "12px",
                padding: isMobile ? "14px" : "20px",
                marginBottom: isMobile ? "14px" : "20px",
                borderLeft: "4px solid #4A4DC9",
                animation: "slideLeft 0.6s 0.6s ease-out both",
              }}
            >
              <h4
                style={{
                  color: "#4A4DC9",
                  fontSize: isMobile ? "15px" : "18px",
                  fontWeight: "700",
                  marginBottom: isMobile ? "8px" : "12px",
                  margin: "0 0 12px 0",
                }}
              >
                The Answer:
              </h4>
              <p
                style={{
                  color: darkMode ? "#e0e0e0" : "#4E4E4E",
                  fontSize: isMobile ? "14px" : "17px",
                  lineHeight: "1.6",
                  margin: "0",
                }}
              >
                {defaultRealWorldScenarios[realWorldStep].answer}
              </p>
            </div>

            <div
              style={{
                borderRadius: isMobile ? "10px" : "12px",
                padding: isMobile ? "14px" : "20px",
                border: `2px solid ${themeColor}`,
                background: darkMode
                  ? "rgba(193, 193, 234, 0.1)"
                  : "linear-gradient(135deg, #C1C1EA 0%, #FFF3E4 100%)",
                animation: "slideUp 0.6s 0.8s ease-out both",
              }}
            >
              <h4
                style={{
                  color: themeColor,
                  fontSize: isMobile ? "15px" : "18px",
                  fontWeight: "700",
                  marginBottom: isMobile ? "8px" : "12px",
                  margin: "0 0 12px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                💡 Real-Life Tip:
              </h4>
              <p
                style={{
                  color: darkMode ? "#e0e0e0" : "#4E4E4E",
                  fontSize: isMobile ? "13px" : "16px",
                  margin: "0",
                }}
              >
                {defaultRealWorldScenarios[realWorldStep].realLifeTip}
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        {showNavigation && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: isMobile ? "20px" : "32px",
              gap: isMobile ? "10px" : "16px",
              flexWrap: "wrap",
              animation: "slideUp 0.6s 0.4s ease-out both",
            }}
          >
            <button
              onClick={handlePrevious}
              disabled={isFirstStep()}
              style={{
                background: isFirstStep()
                  ? darkMode
                    ? "#3a3a3a"
                    : "#EBEBEB"
                  : "#4A4DC9",
                color: isFirstStep()
                  ? darkMode
                    ? "#5a5a5a"
                    : "#CACACA"
                  : "white",
                padding: isMobile ? "12px 18px" : "14px 26px",
                border: "none",
                borderRadius: isMobile ? "10px" : "12px",
                fontSize: isMobile ? "14px" : "16px",
                fontWeight: "600",
                cursor: isFirstStep() ? "not-allowed" : "pointer",
                flex: isMobile ? "1 1 calc(50% - 5px)" : "0 0 auto",
                minWidth: isMobile ? "auto" : "140px",
                boxShadow: isFirstStep()
                  ? "none"
                  : "0 4px 12px rgba(74, 77, 201, 0.3)",
                transition: "all 0.3s ease",
                minHeight: "52px",
              }}
            >
              ← Previous
            </button>

            {showPlayPause && (
              <button
                onClick={togglePlayPause}
                style={{
                  background: isPlaying ? "#FF7212" : "#4A4DC9",
                  color: "white",
                  padding: isMobile ? "12px 18px" : "14px 26px",
                  border: "none",
                  borderRadius: isMobile ? "10px" : "12px",
                  fontSize: isMobile ? "14px" : "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  flex: "0 0 auto",
                  minWidth: isMobile ? "100px" : "120px",
                  boxShadow: "0 4px 12px rgba(74, 77, 201, 0.3)",
                  transition: "all 0.3s ease",
                  minHeight: "52px",
                  order: isMobile ? 2 : 0,
                }}
              >
                {isPlaying ? "⏸ Pause" : "▶ Play"}
              </button>
            )}

            <div
              style={{
                flex: isMobile ? "1 1 100%" : "1 1 auto",
                textAlign: "center",
                fontSize: isMobile ? "13px" : "16px",
                fontWeight: "600",
                color: themeColor,
                order: isMobile ? -1 : 0,
                marginBottom: isMobile ? "12px" : "0",
                padding: isMobile ? "8px" : "0",
                background: isMobile
                  ? darkMode
                    ? "#2a2a2a"
                    : "white"
                  : "transparent",
                borderRadius: isMobile ? "8px" : "0",
              }}
            >
              Step {getCurrentStep()} of {getTotalSteps()}
            </div>

            <button
              onClick={handleNext}
              disabled={isLastStep()}
              style={{
                background: isLastStep()
                  ? darkMode
                    ? "#3a3a3a"
                    : "#EBEBEB"
                  : "#4A4DC9",
                color: isLastStep()
                  ? darkMode
                    ? "#5a5a5a"
                    : "#CACACA"
                  : "white",
                padding: isMobile ? "12px 18px" : "14px 26px",
                border: "none",
                borderRadius: isMobile ? "10px" : "12px",
                fontSize: isMobile ? "14px" : "16px",
                fontWeight: "600",
                cursor: isLastStep() ? "not-allowed" : "pointer",
                flex: isMobile ? "1 1 calc(50% - 5px)" : "0 0 auto",
                minWidth: isMobile ? "auto" : "140px",
                boxShadow: isLastStep()
                  ? "none"
                  : "0 4px 12px rgba(74, 77, 201, 0.3)",
                transition: "all 0.3s ease",
                minHeight: "52px",
              }}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DecimalMeasurementTool;
