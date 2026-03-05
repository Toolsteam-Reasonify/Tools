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
  visual: "pencil" | "tenths_blocks" | "conversion" | "numberline" | "equation";
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

interface TenthPartAdditionalProps {
  pencilLength?: number;
  totalBlocks?: number;
  highlightedBlocks?: number;
  numberLineRange?: { min: number; max: number };
  numberLineValue?: number;
  customQuestions?: PracticeQuestion[];
  customScenarios?: RealWorldScenario[];
  showAnimations?: boolean;
  animationDuration?: number;
}

interface TenthPartProps {
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
    additionalProps?: TenthPartAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// DESIGN SYSTEM TOKENS (FROM PDF)
// ═══════════════════════════════════════════════════════════════════════════

const DesignTokens = {
  colors: {
    primary: "#4A4DC9",
    primaryDark: "#533086",
    secondary: "#FF7212",
    secondaryLight: "#FC9145",
    neutral: {
      dark: "#4E4E4E",
      medium: "#CACACA",
      light: "#EBEBEB",
      lighter: "#F5F5F5",
    },
    accent: {
      purple: "#533086",
      purpleLight: "#C1C1EA",
      orange: "#FC9145",
      orangeLight: "#FFF3E4",
    },
    gradients: {
      purpleOrange: "linear-gradient(135deg, #533086 0%, #FC9145 100%)",
      blueOrange: "linear-gradient(135deg, #4A4DC9 0%, #FF7212 100%)",
      purpleLight: "linear-gradient(135deg, #C1C1EA 0%, #FFF3E4 100%)",
    },
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
    xxl: "24px",
    xxxl: "32px",
    huge: "40px",
  },
  borderRadius: {
    sm: "8px",
    md: "10px",
    lg: "12px",
    xl: "16px",
    xxl: "24px",
    round: "50%",
  },
  typography: {
    fontFamily: "'Poppins', system-ui, -apple-system, sans-serif",
    fontWeights: {
      regular: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
  },
  shadows: {
    sm: "0 2px 6px rgba(0, 0, 0, 0.05)",
    md: "0 2px 8px rgba(0, 0, 0, 0.1)",
    lg: "0 4px 12px rgba(0, 0, 0, 0.15)",
    xl: "0 4px 16px rgba(0, 0, 0, 0.1)",
    button: "0 4px 12px rgba(74, 77, 201, 0.3)",
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// RESPONSIVE BREAKPOINTS
// ═══════════════════════════════════════════════════════════════════════════

const BREAKPOINTS = {
  mobile: 640,
  tablet: 1024,
  desktop: 1440,
};

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

    /* Responsive utilities */
    * {
      box-sizing: border-box;
    }

    @media (max-width: 640px) {
      .hide-on-mobile {
        display: none !important;
      }
    }

    @media (min-width: 641px) and (max-width: 1024px) {
      .hide-on-tablet {
        display: none !important;
      }
    }

    @media (min-width: 1025px) {
      .hide-on-desktop {
        display: none !important;
      }
    }
  `}</style>
);

// ═══════════════════════════════════════════════════════════════════════════
// DESIGN SYSTEM COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "contained" | "outlined" | "text";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  icon?: React.ReactNode;
  style?: React.CSSProperties;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  variant = "contained",
  size = "medium",
  fullWidth = false,
  icon,
  style = {},
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const getButtonStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      fontFamily: DesignTokens.typography.fontFamily,
      fontWeight: DesignTokens.typography.fontWeights.semibold,
      border: "none",
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "all 0.3s ease",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: DesignTokens.spacing.sm,
      width: fullWidth ? "100%" : "auto",
      whiteSpace: "nowrap" as const,
      WebkitTapHighlightColor: "transparent",
      userSelect: "none" as const,
    };

    const sizeStyles = {
      small: {
        padding: `${DesignTokens.spacing.sm} ${DesignTokens.spacing.lg}`,
        fontSize: "13px",
        borderRadius: DesignTokens.borderRadius.sm,
        minHeight: "36px",
      },
      medium: {
        padding: `${DesignTokens.spacing.md} ${DesignTokens.spacing.xl}`,
        fontSize: "15px",
        borderRadius: DesignTokens.borderRadius.md,
        minHeight: "44px",
      },
      large: {
        padding: `${DesignTokens.spacing.lg} ${DesignTokens.spacing.xxl}`,
        fontSize: "17px",
        borderRadius: DesignTokens.borderRadius.lg,
        minHeight: "52px",
      },
    };

    let variantStyles: React.CSSProperties = {};

    if (disabled) {
      if (variant === "contained") {
        variantStyles = {
          background: DesignTokens.colors.neutral.light,
          color: DesignTokens.colors.neutral.medium,
        };
      } else if (variant === "outlined") {
        variantStyles = {
          background: "transparent",
          border: `2px solid ${DesignTokens.colors.neutral.light}`,
          color: DesignTokens.colors.neutral.medium,
        };
      } else {
        variantStyles = {
          background: "transparent",
          color: DesignTokens.colors.neutral.medium,
        };
      }
    } else {
      if (variant === "contained") {
        if (isPressed) {
          variantStyles = {
            background: DesignTokens.colors.primaryDark,
            color: "white",
            transform: "scale(0.98)",
            boxShadow: DesignTokens.shadows.button,
          };
        } else if (isHovered) {
          variantStyles = {
            background: DesignTokens.colors.primary,
            color: "white",
            transform: "translateY(-2px)",
            boxShadow: DesignTokens.shadows.lg,
          };
        } else {
          variantStyles = {
            background: DesignTokens.colors.primary,
            color: "white",
            boxShadow: DesignTokens.shadows.button,
          };
        }
      } else if (variant === "outlined") {
        if (isPressed) {
          variantStyles = {
            background: `${DesignTokens.colors.accent.purpleLight}50`,
            border: `2px solid ${DesignTokens.colors.primary}`,
            color: DesignTokens.colors.primaryDark,
            transform: "scale(0.98)",
          };
        } else if (isHovered) {
          variantStyles = {
            background: `${DesignTokens.colors.accent.purpleLight}30`,
            border: `2px solid ${DesignTokens.colors.primary}`,
            color: DesignTokens.colors.primary,
          };
        } else {
          variantStyles = {
            background: "transparent",
            border: `2px solid ${DesignTokens.colors.primary}`,
            color: DesignTokens.colors.primary,
          };
        }
      } else {
        if (isPressed) {
          variantStyles = {
            background: `${DesignTokens.colors.accent.purpleLight}50`,
            color: DesignTokens.colors.primaryDark,
            transform: "scale(0.98)",
          };
        } else if (isHovered) {
          variantStyles = {
            background: `${DesignTokens.colors.accent.purpleLight}30`,
            color: DesignTokens.colors.primary,
          };
        } else {
          variantStyles = {
            background: "transparent",
            color: DesignTokens.colors.primary,
          };
        }
      }
    }

    return { ...baseStyles, ...sizeStyles[size], ...variantStyles, ...style };
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      style={getButtonStyles()}
    >
      {icon && (
        <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>
      )}
      {children}
    </button>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// ENHANCED VISUAL COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const PencilWithRuler: React.FC<{
  isMobile: boolean;
  isTablet: boolean;
  length?: number;
}> = ({ isMobile, isTablet, length = 3.4 }) => {
  const width = isMobile ? 280 : isTablet ? 450 : 600;
  const rulerWidth = width - 40;
  const height = isMobile ? 220 : isTablet ? 250 : 280;

  return (
    <div
      style={{
        animation: "fadeIn 0.6s ease-out",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ maxWidth: "100%", height: "auto" }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="pencilBody" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFD54F" />
            <stop offset="50%" stopColor="#FFA726" />
            <stop offset="100%" stopColor="#FFD54F" />
          </linearGradient>
          <linearGradient id="pencilTip" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8D6E63" />
            <stop offset="100%" stopColor="#5D4037" />
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3" />
          </filter>
        </defs>

        <g
          style={{
            animation: "slideDown 1s ease-out",
            transformOrigin: "center",
          }}
        >
          <rect
            x="30"
            y={isMobile ? "30" : "50"}
            width={length * (rulerWidth / 5)}
            height={isMobile ? "30" : "40"}
            fill="url(#pencilBody)"
            stroke="#E65100"
            strokeWidth="2"
            rx="5"
            filter="url(#shadow)"
          />

          {[...Array(Math.floor(length * 3))].map((_, i) => (
            <rect
              key={i}
              x={30 + i * (isMobile ? 20 : 25)}
              y={isMobile ? "30" : "50"}
              width={isMobile ? "10" : "12"}
              height={isMobile ? "30" : "40"}
              fill="rgba(255, 152, 0, 0.3)"
            />
          ))}

          <rect
            x={30 + length * (rulerWidth / 5)}
            y={isMobile ? "32" : "52"}
            width={isMobile ? "20" : "25"}
            height={isMobile ? "26" : "36"}
            fill="#E91E63"
            rx="3"
          />

          <rect
            x={30 + length * (rulerWidth / 5) - 8}
            y={isMobile ? "32" : "52"}
            width="10"
            height={isMobile ? "26" : "36"}
            fill="#9E9E9E"
          />

          <path
            d={
              isMobile
                ? `M 30 45 L 15 45 L 22.5 35 L 30 35 Z`
                : `M 30 70 L 10 70 L 20 60 L 30 60 Z`
            }
            fill="url(#pencilTip)"
            stroke="#3E2723"
            strokeWidth="1"
          />
          <path
            d={
              isMobile
                ? `M 22.5 35 L 18.75 45 L 26.25 45 Z`
                : `M 20 60 L 15 70 L 25 70 Z`
            }
            fill="#424242"
          />
        </g>

        <rect
          x="20"
          y={isMobile ? "100" : isTablet ? "130" : "160"}
          width={rulerWidth}
          height={isMobile ? "60" : "80"}
          fill="#FFF9C4"
          stroke={DesignTokens.colors.primary}
          strokeWidth="3"
          rx={DesignTokens.borderRadius.sm}
          filter="url(#shadow)"
          style={{ animation: "slideUp 0.8s 0.3s ease-out both" }}
        />

        {[0, 1, 2, 3, 4].map((i) => {
          const x = 20 + i * (rulerWidth / 4);
          const startY = isMobile ? 115 : isTablet ? 145 : 180;
          const endY = isMobile ? 160 : isTablet ? 210 : 240;
          const textY = isMobile ? 180 : isTablet ? 230 : 260;

          return (
            <g
              key={i}
              style={{
                animation: `popIn 0.4s ${0.6 + i * 0.1}s ease-out both`,
              }}
            >
              <line
                x1={x}
                y1={startY}
                x2={x}
                y2={endY}
                stroke={DesignTokens.colors.primaryDark}
                strokeWidth="3"
                strokeLinecap="round"
              />
              <text
                x={x}
                y={textY}
                fill={DesignTokens.colors.primaryDark}
                fontSize={isMobile ? "14" : "18"}
                fontWeight="bold"
                textAnchor="middle"
                fontFamily={DesignTokens.typography.fontFamily}
              >
                {i}
              </text>

              {i < 4 &&
                [...Array(9)].map((_, j) => {
                  const smallX = x + (j + 1) * (rulerWidth / 40);
                  const smallStartY = isMobile ? 135 : isTablet ? 165 : 200;
                  return (
                    <line
                      key={`${i}-${j}`}
                      x1={smallX}
                      y1={smallStartY}
                      x2={smallX}
                      y2={endY}
                      stroke={DesignTokens.colors.primary}
                      strokeWidth="2"
                      opacity="0.7"
                    />
                  );
                })}
            </g>
          );
        })}

        <g style={{ animation: "scaleIn 0.8s 1.2s ease-out both" }}>
          <rect
            x={width / 2 - (isMobile ? 50 : 60)}
            y={isMobile ? "70" : isTablet ? "90" : "110"}
            width={isMobile ? "100" : "120"}
            height={isMobile ? "28" : "36"}
            fill={DesignTokens.colors.secondary}
            rx="14"
            filter="url(#shadow)"
          />
          <text
            x={width / 2}
            y={isMobile ? "91" : isTablet ? "114" : "135"}
            fill="white"
            fontSize={isMobile ? "14" : "18"}
            fontWeight="bold"
            textAnchor="middle"
            fontFamily={DesignTokens.typography.fontFamily}
          >
            3.4/4 units
          </text>
        </g>
      </svg>
    </div>
  );
};

const TenthsVisualization: React.FC<{
  total?: number;
  highlighted?: number;
  isMobile: boolean;
  isTablet: boolean;
}> = ({ total = 10, highlighted = 10, isMobile, isTablet }) => {
  const blockSize = isMobile ? 40 : isTablet ? 50 : 60;
  const gap = isMobile ? 6 : isTablet ? 8 : 10;
  const blocksPerRow = isMobile ? 5 : 10;

  return (
    <div
      style={{
        animation: "fadeIn 0.6s ease-out",
        textAlign: "center",
        width: "100%",
        overflowX: "auto",
      }}
    >
      <div
        style={{
          display: "inline-block",
          padding: isMobile
            ? DesignTokens.spacing.md
            : isTablet
              ? DesignTokens.spacing.lg
              : DesignTokens.spacing.xxl,
          background: `${DesignTokens.colors.accent.purpleLight}20`,
          borderRadius: DesignTokens.borderRadius.xl,
          border: `3px solid ${DesignTokens.colors.primary}`,
          maxWidth: "100%",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${blocksPerRow}, ${blockSize}px)`,
            gap: `${gap}px`,
            marginBottom: isMobile
              ? DesignTokens.spacing.md
              : isTablet
                ? DesignTokens.spacing.lg
                : DesignTokens.spacing.xxl,
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
                    ? DesignTokens.colors.gradients.blueOrange
                    : DesignTokens.colors.neutral.lighter,
                  border: `3px solid ${
                    isHighlighted
                      ? DesignTokens.colors.primaryDark
                      : DesignTokens.colors.accent.purpleLight
                  }`,
                  borderRadius: isMobile
                    ? DesignTokens.borderRadius.sm
                    : DesignTokens.borderRadius.lg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: isMobile ? "12px" : isTablet ? "14px" : "16px",
                  fontWeight: DesignTokens.typography.fontWeights.bold,
                  color: isHighlighted
                    ? "white"
                    : DesignTokens.colors.neutral.dark,
                  animation: `popIn 0.5s ${i * 0.08}s ease-out both`,
                  boxShadow: isHighlighted
                    ? DesignTokens.shadows.lg
                    : DesignTokens.shadows.sm,
                  position: "relative",
                  overflow: "hidden",
                  fontFamily: DesignTokens.typography.fontFamily,
                }}
              >
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
                <span style={{ position: "relative", zIndex: 1 }}>1/10</span>
              </div>
            );
          })}
        </div>

        <div
          style={{
            fontSize: isMobile ? "16px" : isTablet ? "18px" : "22px",
            fontWeight: DesignTokens.typography.fontWeights.bold,
            color: DesignTokens.colors.primaryDark,
            animation: "slideUp 0.6s 1s ease-out both",
            fontFamily: DesignTokens.typography.fontFamily,
          }}
        >
          10 × 1/10 = 1 unit
        </div>
      </div>
    </div>
  );
};

const ConversionDiagram: React.FC<{ isMobile: boolean; isTablet: boolean }> = ({
  isMobile,
  isTablet,
}) => {
  const width = isMobile ? 280 : isTablet ? 400 : 500;
  const height = isMobile ? 280 : isTablet ? 320 : 380;
  const boxWidth = isMobile ? 160 : isTablet ? 180 : 200;
  const boxHeight = isMobile ? 60 : 70;

  return (
    <div
      style={{
        animation: "fadeIn 0.6s ease-out",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ maxWidth: "100%", height: "auto" }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="boxGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={DesignTokens.colors.primary} />
            <stop offset="100%" stopColor={DesignTokens.colors.primaryDark} />
          </linearGradient>
          <filter id="shadowBox">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3" />
          </filter>
        </defs>

        <g style={{ animation: "slideDown 0.8s ease-out" }}>
          <rect
            x={width / 2 - boxWidth / 2}
            y="20"
            width={boxWidth}
            height={boxHeight}
            fill="url(#boxGrad)"
            rx={DesignTokens.borderRadius.lg}
            filter="url(#shadowBox)"
          />
          <text
            x={width / 2}
            y={20 + boxHeight / 2 + (isMobile ? 6 : 8)}
            fill="white"
            fontSize={isMobile ? "20" : isTablet ? "24" : "28"}
            fontWeight="bold"
            textAnchor="middle"
            fontFamily={DesignTokens.typography.fontFamily}
          >
            34 × 1/10
          </text>
        </g>

        <g style={{ animation: "slideDown 1s 0.5s ease-out both" }}>
          <line
            x1={width / 2}
            y1={20 + boxHeight + 5}
            x2={width / 2}
            y2={20 + boxHeight + (isMobile ? 30 : 40)}
            stroke={DesignTokens.colors.secondary}
            strokeWidth={isMobile ? "3" : "4"}
          />
          <path
            d={`M ${width / 2} ${20 + boxHeight + (isMobile ? 30 : 40)} l -8 -12 l 16 0 z`}
            fill={DesignTokens.colors.secondary}
          />
        </g>

        <g style={{ animation: "scaleIn 0.8s 1s ease-out both" }}>
          <rect
            x={width / 2 - boxWidth / 2}
            y={20 + boxHeight + (isMobile ? 30 : 40) + 10}
            width={boxWidth}
            height={boxHeight}
            fill="url(#boxGrad)"
            rx={DesignTokens.borderRadius.lg}
            filter="url(#shadowBox)"
          />
          <text
            x={width / 2}
            y={
              20 +
              boxHeight +
              (isMobile ? 30 : 40) +
              10 +
              boxHeight / 2 +
              (isMobile ? 6 : 8)
            }
            fill="white"
            fontSize={isMobile ? "20" : isTablet ? "24" : "28"}
            fontWeight="bold"
            textAnchor="middle"
            fontFamily={DesignTokens.typography.fontFamily}
          >
            34/10
          </text>
        </g>

        <g style={{ animation: "slideDown 1s 1.3s ease-out both" }}>
          <line
            x1={width / 2}
            y1={20 + boxHeight * 2 + (isMobile ? 30 : 40) + 15}
            x2={width / 2}
            y2={20 + boxHeight * 2 + (isMobile ? 60 : 80) + 15}
            stroke={DesignTokens.colors.secondary}
            strokeWidth={isMobile ? "3" : "4"}
          />
          <path
            d={`M ${width / 2} ${20 + boxHeight * 2 + (isMobile ? 60 : 80) + 15} l -8 -12 l 16 0 z`}
            fill={DesignTokens.colors.secondary}
          />
        </g>

        <g style={{ animation: "slideUp 0.8s 1.6s ease-out both" }}>
          <rect
            x={width / 2 - (isMobile ? 100 : 120)}
            y={height - (isMobile ? 50 : 60)}
            width={isMobile ? 200 : 240}
            height={isMobile ? 50 : 60}
            fill={DesignTokens.colors.secondary}
            rx={isMobile ? "25" : "30"}
            filter="url(#shadowBox)"
          />
          <text
            x={width / 2}
            y={height - (isMobile ? 50 : 60) + (isMobile ? 32 : 38)}
            fill="white"
            fontSize={isMobile ? "18" : isTablet ? "20" : "24"}
            fontWeight="bold"
            textAnchor="middle"
            fontFamily={DesignTokens.typography.fontFamily}
          >
            0.34
          </text>
        </g>
      </svg>
    </div>
  );
};

const TenthsNumberLine: React.FC<{
  isMobile: boolean;
  isTablet: boolean;
  value?: number;
}> = ({ isMobile, isTablet, value = 3.4 }) => {
  const width = isMobile ? 280 : isTablet ? 450 : 600;
  const lineWidth = width - 40;

  return (
    <div
      style={{
        animation: "fadeIn 0.6s ease-out",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <svg
        width="100%"
        height={isMobile ? "180" : "220"}
        viewBox={`0 0 ${width} ${isMobile ? 180 : 220}`}
        style={{ maxWidth: "100%", height: "auto" }}
        preserveAspectRatio="xMidYMid meet"
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

        <line
          x1="20"
          y1={isMobile ? "80" : "110"}
          x2={20 + lineWidth}
          y2={isMobile ? "80" : "110"}
          stroke={DesignTokens.colors.primary}
          strokeWidth={isMobile ? "4" : "6"}
          strokeLinecap="round"
          strokeDasharray={lineWidth}
          strokeDashoffset={lineWidth}
          style={{ animation: "drawLine 1.5s ease-out forwards" }}
        />

        {[0, 1, 2, 3, 4].map((i) => {
          const x = 20 + i * (lineWidth / 4);
          return (
            <g
              key={i}
              style={{
                animation: `popIn 0.5s ${0.5 + i * 0.15}s ease-out both`,
              }}
            >
              <circle
                cx={x}
                cy={isMobile ? "80" : "110"}
                r={isMobile ? "10" : "14"}
                fill={DesignTokens.colors.primary}
              />
              <circle
                cx={x}
                cy={isMobile ? "80" : "110"}
                r={isMobile ? "8" : "11"}
                fill="white"
              />
              <circle
                cx={x}
                cy={isMobile ? "80" : "110"}
                r={isMobile ? "4" : "6"}
                fill={DesignTokens.colors.primary}
              />
              <text
                x={x}
                y={isMobile ? "115" : "155"}
                fill={DesignTokens.colors.primaryDark}
                fontSize={isMobile ? "16" : "22"}
                fontWeight="bold"
                textAnchor="middle"
                fontFamily={DesignTokens.typography.fontFamily}
              >
                {i}
              </text>

              {i < 4 &&
                [...Array(9)].map((_, j) => {
                  const smallX = x + ((j + 1) * lineWidth) / 40;
                  return (
                    <g
                      key={`${i}-${j}`}
                      style={{
                        animation: `popIn 0.3s ${0.8 + i * 0.1 + j * 0.02}s ease-out both`,
                      }}
                    >
                      <circle
                        cx={smallX}
                        cy={isMobile ? "80" : "110"}
                        r={isMobile ? "3" : "5"}
                        fill={DesignTokens.colors.accent.purpleLight}
                      />
                    </g>
                  );
                })}
            </g>
          );
        })}

        <g style={{ animation: "scaleIn 0.8s 2s ease-out both" }}>
          <circle
            cx={20 + (value / 4) * lineWidth}
            cy={isMobile ? "80" : "110"}
            r={isMobile ? "16" : "22"}
            fill={DesignTokens.colors.secondary}
            filter="url(#glow)"
          />
          <circle
            cx={20 + (value / 4) * lineWidth}
            cy={isMobile ? "80" : "110"}
            r={isMobile ? "14" : "19"}
            fill="white"
            opacity="0.3"
          />
          <circle
            cx={20 + (value / 4) * lineWidth}
            cy={isMobile ? "80" : "110"}
            r={isMobile ? "7" : "10"}
            fill="white"
          />

          <line
            x1={20 + (value / 4) * lineWidth}
            y1={isMobile ? "64" : "88"}
            x2={20 + (value / 4) * lineWidth}
            y2={isMobile ? "30" : "40"}
            stroke={DesignTokens.colors.secondary}
            strokeWidth={isMobile ? "2" : "3"}
          />
          <path
            d={`M ${20 + (value / 4) * lineWidth} ${isMobile ? 30 : 40} l -${isMobile ? 6 : 8} ${isMobile ? 10 : 12} l ${isMobile ? 12 : 16} 0 z`}
            fill={DesignTokens.colors.secondary}
          />

          <rect
            x={20 + (value / 4) * lineWidth - (isMobile ? 45 : 55)}
            y={isMobile ? "2" : "2"}
            width={isMobile ? "90" : "110"}
            height={isMobile ? "36" : "44"}
            fill={DesignTokens.colors.secondary}
            rx={isMobile ? "12" : "16"}
          />
          <text
            x={20 + (value / 4) * lineWidth}
            y={isMobile ? "16" : "20"}
            fill="white"
            fontSize={isMobile ? "12" : "14"}
            fontWeight="bold"
            textAnchor="middle"
            fontFamily={DesignTokens.typography.fontFamily}
          >
            34/10
          </text>
          <text
            x={20 + (value / 4) * lineWidth}
            y={isMobile ? "32" : "38"}
            fill="white"
            fontSize={isMobile ? "13" : "16"}
            fontWeight="bold"
            textAnchor="middle"
            fontFamily={DesignTokens.typography.fontFamily}
          >
            3.4
          </text>
        </g>

        <text
          x={width / 2}
          y={isMobile ? "160" : "200"}
          fill={DesignTokens.colors.primaryDark}
          fontSize={isMobile ? "11" : isTablet ? "13" : "16"}
          fontWeight={DesignTokens.typography.fontWeights.semibold}
          textAnchor="middle"
          fontFamily={DesignTokens.typography.fontFamily}
          style={{ animation: "slideUp 0.8s 2.3s ease-out both" }}
        >
          34 one-tenths = 3 units + 4 one-tenths
        </text>
      </svg>
    </div>
  );
};

const EquationBreakdown: React.FC<{ isMobile: boolean; isTablet: boolean }> = ({
  isMobile,
  isTablet,
}) => {
  const equations = [
    { text: "10 × 1/10", result: "= 1 unit" },
    { text: "34 × 1/10", result: "= 34/10" },
    { text: "= 10/10 + 10/10 + 10/10 + 4/10", result: "" },
    { text: "= 1 + 1 + 1 + 4/10", result: "" },
    { text: "= 3 + 4/10", result: "= 3 4/10" },
  ];

  return (
    <div
      style={{
        animation: "fadeIn 0.6s ease-out",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        padding: isMobile
          ? DesignTokens.spacing.sm
          : isTablet
            ? DesignTokens.spacing.lg
            : DesignTokens.spacing.xxl,
        overflowX: "auto",
      }}
    >
      <div
        style={{
          background: `${DesignTokens.colors.accent.purpleLight}20`,
          borderRadius: DesignTokens.borderRadius.xl,
          padding: isMobile
            ? DesignTokens.spacing.lg
            : isTablet
              ? DesignTokens.spacing.xl
              : DesignTokens.spacing.xxxl,
          border: `3px solid ${DesignTokens.colors.primary}`,
          maxWidth: "600px",
          width: "100%",
        }}
      >
        {equations.map((eq, index) => (
          <div
            key={index}
            style={{
              fontSize: isMobile ? "13px" : isTablet ? "18px" : "22px",
              fontWeight: DesignTokens.typography.fontWeights.bold,
              color: DesignTokens.colors.primaryDark,
              marginBottom: isMobile
                ? DesignTokens.spacing.md
                : isTablet
                  ? DesignTokens.spacing.lg
                  : DesignTokens.spacing.xl,
              display: "flex",
              justifyContent:
                index === 2 || index === 3 ? "flex-start" : "space-between",
              alignItems: "center",
              animation: `slideLeft 0.6s ${index * 0.3}s ease-out both`,
              padding: isMobile
                ? DesignTokens.spacing.sm
                : isTablet
                  ? DesignTokens.spacing.md
                  : DesignTokens.spacing.lg,
              background: "white",
              borderRadius: isMobile
                ? DesignTokens.borderRadius.sm
                : DesignTokens.borderRadius.lg,
              boxShadow: DesignTokens.shadows.sm,
              flexWrap: "wrap",
              gap: DesignTokens.spacing.sm,
              fontFamily: DesignTokens.typography.fontFamily,
            }}
          >
            <span style={{ wordBreak: "break-word" }}>{eq.text}</span>
            {eq.result && (
              <span
                style={{
                  color: DesignTokens.colors.secondary,
                  fontSize: isMobile ? "12px" : isTablet ? "16px" : "20px",
                }}
              >
                {eq.result}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// RESPONSIVE HOOK
// ═══════════════════════════════════════════════════════════════════════════

const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    isMobile:
      typeof window !== "undefined"
        ? window.innerWidth < BREAKPOINTS.mobile
        : false,
    isTablet:
      typeof window !== "undefined"
        ? window.innerWidth >= BREAKPOINTS.mobile &&
          window.innerWidth < BREAKPOINTS.tablet
        : false,
    isDesktop:
      typeof window !== "undefined"
        ? window.innerWidth >= BREAKPOINTS.tablet
        : true,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenSize({
        width,
        isMobile: width < BREAKPOINTS.mobile,
        isTablet: width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet,
        isDesktop: width >= BREAKPOINTS.tablet,
      });
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return screenSize;
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const TenthPartTool: React.FC<TenthPartProps> = ({
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
    themeColor = DesignTokens.colors.primaryDark,
    darkMode = false,
    additionalProps = {},
  } = props as NonNullable<TenthPartProps["props"]>;

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

  useEffect(() => {
    setAnimationKey((prev) => prev + 1);
  }, [learnStep, mode]);

  useEffect(() => {
    if (isPlaying && !stopAutoNext) {
      autoPlayTimerRef.current = setTimeout(() => {
        handleNext();
      }, autoPlayDuration / animationSpeed);
    }

    return () => {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
      }
    };
  }, [isPlaying, learnStep, practiceStep, realWorldStep, mode, stopAutoNext]);

  useEffect(() => {
    if (setStepDetails) {
      const currentStep = getCurrentStep();
      const totalSteps = getTotalSteps();
      const stepTitle =
        mode === "learn"
          ? defaultLearnContent[learnStep]?.title || ""
          : mode === "practice"
            ? `Question ${practiceStep + 1}`
            : defaultRealWorldScenarios[realWorldStep]?.title || "";

      setStepDetails({
        currentStep,
        totalSteps,
        currentMode: mode,
        stepTitle,
      });
    }
  }, [mode, learnStep, practiceStep, realWorldStep, setStepDetails]);

  const defaultLearnContent: LearnStep[] = [
    {
      id: 1,
      title: "Understanding a Tenth Part",
      content:
        "A pencil shown in the figure measures 3 4/10 units. This can also be read as 3 units and four one-tenths.",
      illustration:
        "We can write this as: (3 × 1) + (4 × 1/10) units. This helps us understand the value of each part!",
      visual: "pencil",
    },
    {
      id: 2,
      title: "Ten One-Tenths Make One Unit",
      content:
        "When we add 1/10 ten times, we get 1 whole unit. This is a fundamental concept!",
      illustration:
        "1/10 + 1/10 + 1/10 + ... (10 times) = 10 × 1/10 = 1 unit. Ten one-tenths make one complete unit!",
      visual: "tenths_blocks",
    },
    {
      id: 3,
      title: "Converting 34 One-Tenths",
      content:
        "The length 3 4/10 units is the same as 34 one-tenths because 10 one-tenths make one unit.",
      illustration:
        "34 × 1/10 = 34/10 = 10/10 + 10/10 + 10/10 + 4/10 = 1 + 1 + 1 + 4/10 = 3 and 4 one-tenths",
      visual: "conversion",
    },
    {
      id: 4,
      title: "Reading Decimal Numbers",
      content:
        "Numbers with fractional units are read in specific ways to avoid confusion.",
      illustration:
        "4 1/10 is 'four and one-tenth', 4/10 is 'four one-tenths' or 'four-tenths', 41/10 is 'forty-one one-tenths', and 41 1/10 is 'forty-one and one-tenth'.",
      visual: "numberline",
    },
    {
      id: 5,
      title: "The Math Behind Tenths",
      content:
        "Understanding the relationship between tenths and whole numbers helps us work with measurements accurately.",
      illustration:
        "When we break down 34 one-tenths, we're essentially dividing and regrouping into whole units and remaining tenths.",
      visual: "equation",
    },
  ];

  const defaultPracticeQuestions: PracticeQuestion[] =
    additionalProps.customQuestions || [
      {
        id: 1,
        question: "How many one-tenths make one whole unit?",
        options: [
          "5 one-tenths",
          "8 one-tenths",
          "10 one-tenths",
          "12 one-tenths",
        ],
        correct: "10 one-tenths",
        explanation:
          "Ten one-tenths (1/10) make one whole unit because 10 × 1/10 = 10/10 = 1.",
      },
      {
        id: 2,
        question: "What is 3 4/10 units equal to in terms of one-tenths?",
        options: [
          "7 one-tenths",
          "34 one-tenths",
          "43 one-tenths",
          "30 one-tenths",
        ],
        correct: "34 one-tenths",
        explanation:
          "3 4/10 = 3 + 4/10 = (3 × 10/10) + 4/10 = 30/10 + 4/10 = 34/10 = 34 one-tenths.",
      },
      {
        id: 3,
        question: "How do you read 4 1/10?",
        options: [
          "Four one-tenths",
          "Four and one-tenth",
          "Forty-one",
          "Four or one-tenth",
        ],
        correct: "Four and one-tenth",
        explanation:
          "4 1/10 is read as 'four and one-tenth' because it represents 4 whole units and 1 one-tenth.",
      },
      {
        id: 4,
        question: "What does 41/10 represent?",
        options: [
          "4 and 1 one-tenth",
          "Forty-one one-tenths",
          "Four hundred and ten",
          "4 divided by 1",
        ],
        correct: "Forty-one one-tenths",
        explanation:
          "41/10 means 41 one-tenths, which equals 4 whole units and 1 one-tenth (4 1/10).",
      },
      {
        id: 5,
        question:
          "If you have 50 one-tenths, how many whole units do you have?",
        options: ["4 units", "5 units", "6 units", "50 units"],
        correct: "5 units",
        explanation:
          "50 one-tenths = 50 × 1/10 = 50/10 = 5 whole units because every 10 one-tenths make 1 unit.",
      },
    ];

  const defaultRealWorldScenarios: RealWorldScenario[] =
    additionalProps.customScenarios || [
      {
        id: 1,
        title: "Measuring Fabric",
        scenario:
          "A tailor needs 2 8/10 meters of fabric for a dress. The shopkeeper measures it as 28 one-tenths of a meter. Are they the same?",
        visual: "📏",
        question: "Why are 2 8/10 meters and 28 one-tenths the same?",
        answer:
          "Yes, they're the same! 2 8/10 = (2 × 10/10) + 8/10 = 20/10 + 8/10 = 28/10 = 28 one-tenths. Both represent the exact same length of fabric.",
        realLifeTip:
          "Tailors often work with tenths of meters for precise measurements. Understanding this conversion helps ensure you get exactly the right amount of fabric!",
      },
      {
        id: 2,
        title: "Pouring Juice",
        scenario:
          "A recipe calls for 1 5/10 liters of orange juice. You have a measuring jug marked in tenths. How many tenths should you pour?",
        visual: "🥤",
        question: "How many one-tenths equal 1 5/10 liters?",
        answer:
          "1 5/10 liters = (1 × 10/10) + 5/10 = 10/10 + 5/10 = 15/10 = 15 one-tenths. So you need to pour 15 markings of one-tenth each.",
        realLifeTip:
          "Many measuring jugs have tenth markings. Converting mixed numbers to tenths makes it easier to measure accurately!",
      },
      {
        id: 3,
        title: "Running Track",
        scenario:
          "A runner completes 3 6/10 laps around a track. The coach records it as 36 one-tenths of a lap. The runner is confused!",
        visual: "🏃",
        question: "How can you explain that both measurements are correct?",
        answer:
          "Both are correct! 3 6/10 laps = 3 complete laps + 6 one-tenths = (3 × 10/10) + 6/10 = 30/10 + 6/10 = 36/10 = 36 one-tenths. It's just two ways of expressing the same distance.",
        realLifeTip:
          "Athletes and coaches often use tenths to measure lap times and distances precisely. Understanding the equivalence helps interpret training data!",
      },
      {
        id: 4,
        title: "Digital Scale",
        scenario:
          "A digital scale shows 4 2/10 kg for a package. The shipping form asks for the weight in tenths of a kilogram.",
        visual: "⚖️",
        question: "What should you write on the shipping form?",
        answer:
          "You should write 42 one-tenths kg. Because 4 2/10 = (4 × 10/10) + 2/10 = 40/10 + 2/10 = 42/10 = 42 one-tenths kg.",
        realLifeTip:
          "Shipping companies often use tenths for precise weight measurements. This helps calculate exact shipping costs and ensures packages meet weight requirements!",
      },
    ];

  const handleModeChange = (newMode: ModeType) => {
    if (!enabledModes.includes(newMode)) return;
    setMode(newMode);
    setLearnStep(0);
    setPracticeStep(0);
    setRealWorldStep(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setTotalCorrect(0);
    setIsPlaying(false);
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
      case "pencil":
        return (
          <PencilWithRuler
            key={animationKey}
            isMobile={isMobile}
            isTablet={isTablet}
            length={additionalProps.pencilLength || 3.4}
          />
        );
      case "tenths_blocks":
        return (
          <TenthsVisualization
            key={animationKey}
            total={10}
            highlighted={10}
            isMobile={isMobile}
            isTablet={isTablet}
          />
        );
      case "conversion":
        return (
          <ConversionDiagram
            key={animationKey}
            isMobile={isMobile}
            isTablet={isTablet}
          />
        );
      case "numberline":
        return (
          <TenthsNumberLine
            key={animationKey}
            isMobile={isMobile}
            isTablet={isTablet}
            value={3.4}
          />
        );
      case "equation":
        return (
          <EquationBreakdown
            key={animationKey}
            isMobile={isMobile}
            isTablet={isTablet}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: darkMode ? "#1a1a1a" : DesignTokens.colors.neutral.lighter,
        fontFamily: DesignTokens.typography.fontFamily,
        color: darkMode ? "#ffffff" : "#000000",
        overflowX: "hidden",
      }}
    >
      <GlobalAnimationStyles />

      {/* Navbar */}
      <nav
        style={{
          background: DesignTokens.colors.gradients.purpleOrange,
          boxShadow: DesignTokens.shadows.lg,
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: isMobile
              ? `${DesignTokens.spacing.md} ${DesignTokens.spacing.lg}`
              : `${DesignTokens.spacing.lg} ${DesignTokens.spacing.xxl}`,
          }}
        >
          {showModeSelector ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: isMobile
                  ? DesignTokens.spacing.md
                  : DesignTokens.spacing.xl,
                flexWrap: isMobile ? "wrap" : "nowrap",
              }}
            >
              <h1
                style={{
                  color: "white",
                  fontSize: isMobile ? "16px" : isTablet ? "18px" : "22px",
                  fontWeight: DesignTokens.typography.fontWeights.bold,
                  margin: "0",
                  whiteSpace: isMobile ? "normal" : "nowrap",
                  flex: isMobile ? "1 1 100%" : "0 0 auto",
                  lineHeight: "1.3",
                }}
              >
                A Tenth Part
              </h1>

              <div
                style={{
                  display: "flex",
                  gap: isMobile
                    ? DesignTokens.spacing.xs
                    : DesignTokens.spacing.sm,
                  flex: isMobile ? "1 1 100%" : "0 0 auto",
                  justifyContent: isMobile ? "stretch" : "flex-end",
                  width: isMobile ? "100%" : "auto",
                }}
              >
                {enabledModes.map((m) => (
                  <Button
                    key={m}
                    onClick={() => handleModeChange(m)}
                    variant={mode === m ? "contained" : "outlined"}
                    size="small"
                    style={{
                      flex: isMobile ? "1" : "0 0 auto",
                      background:
                        mode === m ? "white" : "rgba(255, 255, 255, 0.2)",
                      color:
                        mode === m
                          ? m === "real_world"
                            ? DesignTokens.colors.secondary
                            : themeColor
                          : "white",
                      border:
                        mode === m
                          ? "none"
                          : "2px solid rgba(255, 255, 255, 0.5)",
                      fontSize: isMobile ? "11px" : "13px",
                      padding: isMobile
                        ? `${DesignTokens.spacing.xs} ${DesignTokens.spacing.sm}`
                        : undefined,
                    }}
                  >
                    {m === "learn"
                      ? "📚 Learn"
                      : m === "practice"
                        ? "🧠 Practice"
                        : "🌍 Real World"}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center" }}>
              <h1
                style={{
                  color: "white",
                  fontSize: isMobile ? "18px" : isTablet ? "22px" : "28px",
                  fontWeight: DesignTokens.typography.fontWeights.bold,
                  margin: "0",
                  lineHeight: "1.2",
                }}
              >
                A Tenth Part
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
          padding: isMobile
            ? DesignTokens.spacing.md
            : DesignTokens.spacing.xxl,
        }}
      >
        {/* Progress Bar */}
        {showStepIndicator && (
          <div
            style={{
              background: darkMode ? "#2a2a2a" : "white",
              borderRadius: isMobile
                ? DesignTokens.borderRadius.md
                : DesignTokens.borderRadius.lg,
              padding: isMobile
                ? `${DesignTokens.spacing.md} ${DesignTokens.spacing.lg}`
                : `${DesignTokens.spacing.xl} ${DesignTokens.spacing.xxl}`,
              marginBottom: isMobile
                ? DesignTokens.spacing.lg
                : DesignTokens.spacing.xxxl,
              boxShadow: DesignTokens.shadows.md,
              animation: "slideDown 0.6s ease-out",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: DesignTokens.spacing.md,
                fontSize: isMobile ? "11px" : isTablet ? "13px" : "15px",
                fontWeight: DesignTokens.typography.fontWeights.semibold,
                color: themeColor,
                flexWrap: "wrap",
                gap: DesignTokens.spacing.xs,
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
                height: isMobile ? "6px" : isTablet ? "8px" : "10px",
                background: darkMode
                  ? "#3a3a3a"
                  : DesignTokens.colors.neutral.light,
                borderRadius: DesignTokens.borderRadius.sm,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${(getCurrentStep() / getTotalSteps()) * 100}%`,
                  height: "100%",
                  background:
                    mode === "learn"
                      ? DesignTokens.colors.gradients.blueOrange
                      : mode === "practice"
                        ? DesignTokens.colors.gradients.purpleOrange
                        : DesignTokens.colors.gradients.purpleOrange,
                  borderRadius: DesignTokens.borderRadius.sm,
                  animation: "fillProgress 0.8s ease-out",
                  transition: "width 0.3s ease",
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
              borderRadius: isMobile
                ? DesignTokens.borderRadius.lg
                : DesignTokens.borderRadius.xl,
              padding: isMobile
                ? DesignTokens.spacing.lg
                : DesignTokens.spacing.xxxl,
              boxShadow: DesignTokens.shadows.xl,
              border: `2px solid ${darkMode ? "#3a3a3a" : DesignTokens.colors.accent.purpleLight}`,
              animation: "slideUp 0.6s ease-out",
            }}
          >
            <h2
              style={{
                color: themeColor,
                fontSize: isMobile ? "18px" : isTablet ? "22px" : "28px",
                fontWeight: DesignTokens.typography.fontWeights.bold,
                margin: `0 0 ${DesignTokens.spacing.xl} 0`,
                textAlign: "center",
                animation: "slideDown 0.6s ease-out",
                lineHeight: "1.3",
              }}
            >
              {defaultLearnContent[learnStep].title}
            </h2>

            <div
              style={{
                minHeight: isMobile ? "180px" : isTablet ? "250px" : "350px",
                marginBottom: DesignTokens.spacing.xxl,
              }}
            >
              {renderVisualInstrument()}
            </div>

            <div
              style={{
                background: darkMode
                  ? `${DesignTokens.colors.accent.purpleLight}20`
                  : `${DesignTokens.colors.accent.purpleLight}30`,
                borderRadius: isMobile
                  ? DesignTokens.borderRadius.md
                  : DesignTokens.borderRadius.lg,
                padding: isMobile
                  ? DesignTokens.spacing.md
                  : DesignTokens.spacing.xl,
                border: `1px solid ${
                  darkMode
                    ? `${DesignTokens.colors.accent.purpleLight}40`
                    : DesignTokens.colors.accent.purpleLight
                }`,
                animation: "slideUp 0.8s 0.3s ease-out both",
              }}
            >
              <p
                style={{
                  color: darkMode
                    ? "#e0e0e0"
                    : DesignTokens.colors.neutral.dark,
                  fontSize: isMobile ? "13px" : isTablet ? "15px" : "17px",
                  lineHeight: "1.6",
                  margin: `0 0 ${DesignTokens.spacing.lg} 0`,
                  fontWeight: DesignTokens.typography.fontWeights.medium,
                }}
              >
                {defaultLearnContent[learnStep].content}
              </p>

              <div
                style={{
                  background: darkMode ? "#3a3a3a" : "white",
                  borderRadius: DesignTokens.borderRadius.md,
                  padding: isMobile
                    ? DesignTokens.spacing.md
                    : DesignTokens.spacing.lg,
                  borderLeft: `4px solid ${DesignTokens.colors.primary}`,
                  boxShadow: DesignTokens.shadows.sm,
                }}
              >
                <p
                  style={{
                    color: darkMode
                      ? "#e0e0e0"
                      : DesignTokens.colors.neutral.dark,
                    fontSize: isMobile ? "12px" : isTablet ? "14px" : "16px",
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

        {/* Practice Mode Content - Continue with similar responsive patterns... */}
        {/* Due to character limit, I'll provide the key responsive changes for Practice mode */}

        {mode === "practice" && (
          <div
            style={{
              background: darkMode ? "#2a2a2a" : "white",
              borderRadius: isMobile
                ? DesignTokens.borderRadius.lg
                : DesignTokens.borderRadius.xl,
              padding: isMobile
                ? DesignTokens.spacing.lg
                : DesignTokens.spacing.xxxl,
              boxShadow: DesignTokens.shadows.xl,
              border: `2px solid ${darkMode ? "#3a3a3a" : DesignTokens.colors.accent.purpleLight}`,
              animation: "slideUp 0.6s ease-out",
            }}
          >
            {/* Header with score */}
            <div
              style={{
                background: darkMode
                  ? `${DesignTokens.colors.accent.purpleLight}20`
                  : DesignTokens.colors.gradients.purpleLight,
                padding: isMobile
                  ? DesignTokens.spacing.md
                  : DesignTokens.spacing.lg,
                borderRadius: isMobile
                  ? DesignTokens.borderRadius.md
                  : DesignTokens.borderRadius.lg,
                marginBottom: isMobile
                  ? DesignTokens.spacing.lg
                  : DesignTokens.spacing.xxl,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: DesignTokens.spacing.md,
              }}
            >
              <span
                style={{
                  fontSize: isMobile ? "13px" : isTablet ? "15px" : "17px",
                  fontWeight: DesignTokens.typography.fontWeights.semibold,
                  color: themeColor,
                }}
              >
                Question {practiceStep + 1} of {PRACTICE_STEPS}
              </span>
              <div
                style={{
                  background: darkMode ? "#3a3a3a" : "white",
                  padding: `${DesignTokens.spacing.xs} ${isMobile ? DesignTokens.spacing.md : DesignTokens.spacing.lg}`,
                  borderRadius: DesignTokens.borderRadius.xxl,
                  fontSize: isMobile ? "13px" : isTablet ? "15px" : "17px",
                  fontWeight: DesignTokens.typography.fontWeights.bold,
                  color: themeColor,
                  boxShadow: DesignTokens.shadows.md,
                }}
              >
                Score: {totalCorrect} / {PRACTICE_STEPS}
              </div>
            </div>

            {/* Question Container */}
            <div
              style={{
                background: darkMode
                  ? `${DesignTokens.colors.accent.purpleLight}20`
                  : `${DesignTokens.colors.accent.purpleLight}30`,
                borderRadius: isMobile
                  ? DesignTokens.borderRadius.md
                  : DesignTokens.borderRadius.lg,
                padding: isMobile
                  ? DesignTokens.spacing.md
                  : DesignTokens.spacing.xl,
                marginBottom: isMobile
                  ? DesignTokens.spacing.md
                  : DesignTokens.spacing.xl,
                border: `1px solid ${
                  darkMode
                    ? `${DesignTokens.colors.accent.purpleLight}40`
                    : DesignTokens.colors.accent.purpleLight
                }`,
              }}
            >
              <h3
                style={{
                  color: themeColor,
                  fontSize: isMobile ? "15px" : isTablet ? "18px" : "20px",
                  fontWeight: DesignTokens.typography.fontWeights.bold,
                  lineHeight: "1.4",
                  margin: `0 0 ${DesignTokens.spacing.lg} 0`,
                }}
              >
                {defaultPracticeQuestions[practiceStep].question}
              </h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: isMobile
                    ? DesignTokens.spacing.sm
                    : DesignTokens.spacing.md,
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
                      padding: isMobile
                        ? `${DesignTokens.spacing.sm} ${DesignTokens.spacing.md}`
                        : `${DesignTokens.spacing.md} ${DesignTokens.spacing.lg}`,
                      border: "2px solid",
                      borderRadius: isMobile
                        ? DesignTokens.borderRadius.sm
                        : DesignTokens.borderRadius.md,
                      fontSize: isMobile ? "13px" : isTablet ? "14px" : "16px",
                      fontWeight: DesignTokens.typography.fontWeights.medium,
                      cursor: showFeedback ? "default" : "pointer",
                      transition: "all 0.3s ease",
                      textAlign: "left",
                      background: darkMode ? "#3a3a3a" : "#FFFFFF",
                      borderColor: darkMode
                        ? "#4a4a4a"
                        : DesignTokens.colors.neutral.light,
                      color: darkMode
                        ? "#e0e0e0"
                        : DesignTokens.colors.neutral.dark,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      minHeight: isMobile ? "48px" : "52px",
                      fontFamily: DesignTokens.typography.fontFamily,
                      WebkitTapHighlightColor: "transparent",
                      lineHeight: "1.4",
                    };

                    if (!showFeedback && isSelected) {
                      buttonStyle.background = darkMode
                        ? `${DesignTokens.colors.primary}40`
                        : `${DesignTokens.colors.accent.purpleLight}30`;
                      buttonStyle.borderColor = DesignTokens.colors.primary;
                      buttonStyle.transform = "scale(0.98)";
                    }

                    if (showFeedback) {
                      if (isCorrect) {
                        buttonStyle.background = darkMode
                          ? `${DesignTokens.colors.primary}50`
                          : `${DesignTokens.colors.accent.purpleLight}40`;
                        buttonStyle.borderColor = DesignTokens.colors.primary;
                        buttonStyle.color = DesignTokens.colors.primaryDark;
                        buttonStyle.fontWeight =
                          DesignTokens.typography.fontWeights.semibold;
                      } else if (isSelected && !isCorrect) {
                        buttonStyle.background = darkMode
                          ? `${DesignTokens.colors.secondary}30`
                          : `${DesignTokens.colors.accent.orangeLight}70`;
                        buttonStyle.borderColor = DesignTokens.colors.secondary;
                        buttonStyle.color = DesignTokens.colors.secondary;
                      } else {
                        buttonStyle.background = darkMode
                          ? "#2a2a2a"
                          : DesignTokens.colors.neutral.lighter;
                        buttonStyle.borderColor = darkMode
                          ? "#3a3a3a"
                          : DesignTokens.colors.neutral.light;
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
                        <span
                          style={{
                            flex: 1,
                            paddingRight: DesignTokens.spacing.sm,
                          }}
                        >
                          {option}
                        </span>
                        {showFeedback && isCorrect && (
                          <span
                            style={{
                              fontSize: isMobile ? "16px" : "20px",
                              flexShrink: 0,
                            }}
                          >
                            ✓
                          </span>
                        )}
                        {showFeedback && isSelected && !isCorrect && (
                          <span
                            style={{
                              fontSize: isMobile ? "16px" : "20px",
                              flexShrink: 0,
                            }}
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

            {/* Check Answer Button */}
            {selectedAnswer && !showResult && (
              <Button
                onClick={checkAnswer}
                variant="contained"
                size={isMobile ? "medium" : "large"}
                fullWidth
                style={{
                  background: DesignTokens.colors.gradients.purpleOrange,
                  marginBottom: isMobile
                    ? DesignTokens.spacing.md
                    : DesignTokens.spacing.xl,
                }}
              >
                Check Answer
              </Button>
            )}

            {/* Result Feedback */}
            {showResult && (
              <div
                style={{
                  borderRadius: isMobile
                    ? DesignTokens.borderRadius.md
                    : DesignTokens.borderRadius.lg,
                  padding: isMobile
                    ? DesignTokens.spacing.md
                    : DesignTokens.spacing.xl,
                  border: "2px solid",
                  marginBottom: isMobile
                    ? DesignTokens.spacing.md
                    : DesignTokens.spacing.xl,
                  background:
                    selectedAnswer ===
                    defaultPracticeQuestions[practiceStep].correct
                      ? darkMode
                        ? `${DesignTokens.colors.primary}30`
                        : `${DesignTokens.colors.accent.purpleLight}40`
                      : darkMode
                        ? `${DesignTokens.colors.secondary}30`
                        : `${DesignTokens.colors.accent.orangeLight}70`,
                  borderColor:
                    selectedAnswer ===
                    defaultPracticeQuestions[practiceStep].correct
                      ? DesignTokens.colors.primary
                      : DesignTokens.colors.secondary,
                }}
              >
                <h4
                  style={{
                    fontSize: isMobile ? "14px" : isTablet ? "16px" : "18px",
                    fontWeight: DesignTokens.typography.fontWeights.bold,
                    color: themeColor,
                    margin: `0 0 ${DesignTokens.spacing.md} 0`,
                    display: "flex",
                    alignItems: "center",
                    gap: DesignTokens.spacing.sm,
                    flexWrap: "wrap",
                  }}
                >
                  {selectedAnswer ===
                  defaultPracticeQuestions[practiceStep].correct ? (
                    <>
                      <span style={{ fontSize: isMobile ? "18px" : "24px" }}>
                        ✓
                      </span>
                      <span>Correct! Well done! 🎉</span>
                    </>
                  ) : (
                    <>
                      <span style={{ fontSize: isMobile ? "18px" : "24px" }}>
                        ✗
                      </span>
                      <span>Not quite right. Let's learn!</span>
                    </>
                  )}
                </h4>
                <p
                  style={{
                    color: darkMode
                      ? "#e0e0e0"
                      : DesignTokens.colors.neutral.dark,
                    fontSize: isMobile ? "12px" : isTablet ? "14px" : "16px",
                    lineHeight: "1.6",
                    margin: "0",
                  }}
                >
                  {defaultPracticeQuestions[practiceStep].explanation}
                </p>
              </div>
            )}

            {/* Completion Summary */}
            {isLastStep() && showResult && (
              <div
                style={{
                  borderRadius: isMobile
                    ? DesignTokens.borderRadius.lg
                    : DesignTokens.borderRadius.xl,
                  padding: isMobile
                    ? DesignTokens.spacing.lg
                    : DesignTokens.spacing.xxxl,
                  border: `2px solid ${themeColor}`,
                  textAlign: "center",
                  background: darkMode
                    ? `${DesignTokens.colors.accent.purpleLight}20`
                    : DesignTokens.colors.gradients.purpleLight,
                }}
              >
                <h3
                  style={{
                    fontSize: isMobile ? "20px" : isTablet ? "24px" : "28px",
                    fontWeight: DesignTokens.typography.fontWeights.bold,
                    color: themeColor,
                    margin: `0 0 ${DesignTokens.spacing.md} 0`,
                  }}
                >
                  Practice Complete! 🎊
                </h3>
                <p
                  style={{
                    fontSize: isMobile ? "16px" : isTablet ? "18px" : "22px",
                    fontWeight: DesignTokens.typography.fontWeights.semibold,
                    color: darkMode
                      ? "#e0e0e0"
                      : DesignTokens.colors.neutral.dark,
                    margin: `0 0 ${DesignTokens.spacing.md} 0`,
                  }}
                >
                  Final Score: {totalCorrect} out of {PRACTICE_STEPS}
                </p>
                <p
                  style={{
                    color: darkMode
                      ? "#e0e0e0"
                      : DesignTokens.colors.neutral.dark,
                    fontSize: isMobile ? "13px" : isTablet ? "14px" : "16px",
                    margin: "0",
                    lineHeight: "1.5",
                  }}
                >
                  {totalCorrect === PRACTICE_STEPS
                    ? "Perfect score! You understand tenths perfectly!"
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
              borderRadius: isMobile
                ? DesignTokens.borderRadius.lg
                : DesignTokens.borderRadius.xl,
              padding: isMobile
                ? DesignTokens.spacing.lg
                : DesignTokens.spacing.xxxl,
              boxShadow: DesignTokens.shadows.xl,
              border: `2px solid ${darkMode ? "#3a3a3a" : DesignTokens.colors.accent.orangeLight}`,
              animation: "slideUp 0.6s ease-out",
            }}
          >
            {/* Emoji and Title */}
            <div
              style={{
                textAlign: "center",
                marginBottom: isMobile
                  ? DesignTokens.spacing.lg
                  : DesignTokens.spacing.xxxl,
              }}
            >
              <div
                style={{
                  fontSize: isMobile ? "48px" : isTablet ? "64px" : "100px",
                  marginBottom: isMobile
                    ? DesignTokens.spacing.sm
                    : DesignTokens.spacing.xl,
                  animation: "scaleIn 0.8s ease-out",
                  lineHeight: "1",
                }}
              >
                {defaultRealWorldScenarios[realWorldStep].visual}
              </div>
              <h2
                style={{
                  color: themeColor,
                  fontSize: isMobile ? "18px" : isTablet ? "22px" : "28px",
                  fontWeight: DesignTokens.typography.fontWeights.bold,
                  margin: "0",
                  animation: "slideDown 0.6s ease-out",
                  lineHeight: "1.3",
                }}
              >
                {defaultRealWorldScenarios[realWorldStep].title}
              </h2>
            </div>

            {/* Scenario Box */}
            <div
              style={{
                background: darkMode
                  ? `${DesignTokens.colors.accent.orangeLight}20`
                  : `${DesignTokens.colors.accent.orangeLight}70`,
                borderRadius: isMobile
                  ? DesignTokens.borderRadius.md
                  : DesignTokens.borderRadius.lg,
                padding: isMobile
                  ? DesignTokens.spacing.md
                  : DesignTokens.spacing.xl,
                marginBottom: isMobile
                  ? DesignTokens.spacing.md
                  : DesignTokens.spacing.xl,
                border: `2px solid ${DesignTokens.colors.secondary}`,
                animation: "slideLeft 0.6s 0.2s ease-out both",
              }}
            >
              <h4
                style={{
                  color: DesignTokens.colors.secondary,
                  fontSize: isMobile ? "14px" : isTablet ? "16px" : "18px",
                  fontWeight: DesignTokens.typography.fontWeights.bold,
                  margin: `0 0 ${DesignTokens.spacing.md} 0`,
                }}
              >
                The Scenario:
              </h4>
              <p
                style={{
                  color: darkMode
                    ? "#e0e0e0"
                    : DesignTokens.colors.neutral.dark,
                  fontSize: isMobile ? "13px" : isTablet ? "15px" : "17px",
                  lineHeight: "1.6",
                  margin: "0",
                }}
              >
                {defaultRealWorldScenarios[realWorldStep].scenario}
              </p>
            </div>

            {/* Question Box */}
            <div
              style={{
                background: darkMode
                  ? `${DesignTokens.colors.accent.orangeLight}20`
                  : DesignTokens.colors.accent.orangeLight,
                borderRadius: isMobile
                  ? DesignTokens.borderRadius.md
                  : DesignTokens.borderRadius.lg,
                padding: isMobile
                  ? DesignTokens.spacing.md
                  : DesignTokens.spacing.xl,
                marginBottom: isMobile
                  ? DesignTokens.spacing.md
                  : DesignTokens.spacing.xl,
                borderLeft: `4px solid ${DesignTokens.colors.secondaryLight}`,
                animation: "slideRight 0.6s 0.4s ease-out both",
              }}
            >
              <h4
                style={{
                  color: DesignTokens.colors.secondary,
                  fontSize: isMobile ? "14px" : isTablet ? "16px" : "18px",
                  fontWeight: DesignTokens.typography.fontWeights.bold,
                  margin: `0 0 ${DesignTokens.spacing.md} 0`,
                }}
              >
                Think About It:
              </h4>
              <p
                style={{
                  color: darkMode
                    ? "#e0e0e0"
                    : DesignTokens.colors.neutral.dark,
                  fontSize: isMobile ? "13px" : isTablet ? "15px" : "17px",
                  lineHeight: "1.6",
                  margin: "0",
                }}
              >
                {defaultRealWorldScenarios[realWorldStep].question}
              </p>
            </div>

            {/* Answer Box */}
            <div
              style={{
                background: darkMode
                  ? `${DesignTokens.colors.accent.purpleLight}20`
                  : `${DesignTokens.colors.accent.purpleLight}40`,
                borderRadius: isMobile
                  ? DesignTokens.borderRadius.md
                  : DesignTokens.borderRadius.lg,
                padding: isMobile
                  ? DesignTokens.spacing.md
                  : DesignTokens.spacing.xl,
                marginBottom: isMobile
                  ? DesignTokens.spacing.md
                  : DesignTokens.spacing.xl,
                borderLeft: `4px solid ${DesignTokens.colors.primary}`,
                animation: "slideLeft 0.6s 0.6s ease-out both",
              }}
            >
              <h4
                style={{
                  color: DesignTokens.colors.primary,
                  fontSize: isMobile ? "14px" : isTablet ? "16px" : "18px",
                  fontWeight: DesignTokens.typography.fontWeights.bold,
                  margin: `0 0 ${DesignTokens.spacing.md} 0`,
                }}
              >
                The Answer:
              </h4>
              <p
                style={{
                  color: darkMode
                    ? "#e0e0e0"
                    : DesignTokens.colors.neutral.dark,
                  fontSize: isMobile ? "13px" : isTablet ? "15px" : "17px",
                  lineHeight: "1.6",
                  margin: "0",
                }}
              >
                {defaultRealWorldScenarios[realWorldStep].answer}
              </p>
            </div>

            {/* Real-Life Tip Box */}
            <div
              style={{
                borderRadius: isMobile
                  ? DesignTokens.borderRadius.md
                  : DesignTokens.borderRadius.lg,
                padding: isMobile
                  ? DesignTokens.spacing.md
                  : DesignTokens.spacing.xl,
                border: `2px solid ${themeColor}`,
                background: darkMode
                  ? `${DesignTokens.colors.accent.purpleLight}20`
                  : DesignTokens.colors.gradients.purpleLight,
                animation: "slideUp 0.6s 0.8s ease-out both",
              }}
            >
              <h4
                style={{
                  color: themeColor,
                  fontSize: isMobile ? "14px" : isTablet ? "16px" : "18px",
                  fontWeight: DesignTokens.typography.fontWeights.bold,
                  margin: `0 0 ${DesignTokens.spacing.md} 0`,
                  display: "flex",
                  alignItems: "center",
                  gap: DesignTokens.spacing.sm,
                  flexWrap: "wrap",
                }}
              >
                💡 Real-Life Tip:
              </h4>
              <p
                style={{
                  color: darkMode
                    ? "#e0e0e0"
                    : DesignTokens.colors.neutral.dark,
                  fontSize: isMobile ? "12px" : isTablet ? "14px" : "16px",
                  lineHeight: "1.6",
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
              marginTop: isMobile
                ? DesignTokens.spacing.lg
                : DesignTokens.spacing.xxxl,
              gap: isMobile ? DesignTokens.spacing.sm : DesignTokens.spacing.md,
              flexWrap: "wrap",
              animation: "slideUp 0.6s 0.4s ease-out both",
            }}
          >
            {/* Previous Button */}
            <Button
              onClick={handlePrevious}
              disabled={isFirstStep()}
              variant="contained"
              size={isMobile ? "small" : "medium"}
              style={{
                flex: isMobile ? "1 1 calc(33.33% - 4px)" : "0 0 auto",
                minWidth: isMobile ? "auto" : "120px",
                order: 0,
              }}
            >
              {isMobile ? "←" : "← Previous"}
            </Button>

            {/* Step Counter - Hidden on mobile when both navigation buttons are present */}
            {!isMobile && (
              <div
                style={{
                  flex: "1 1 auto",
                  textAlign: "center",
                  fontSize: isTablet ? "14px" : "16px",
                  fontWeight: DesignTokens.typography.fontWeights.semibold,
                  color: themeColor,
                  order: 2,
                }}
              >
                Step {getCurrentStep()} of {getTotalSteps()}
              </div>
            )}

            {/* Next Button */}
            <Button
              onClick={handleNext}
              disabled={isLastStep()}
              variant="contained"
              size={isMobile ? "small" : "medium"}
              style={{
                flex: isMobile ? "1 1 calc(33.33% - 4px)" : "0 0 auto",
                minWidth: isMobile ? "auto" : "120px",
                order: 3,
              }}
            >
              {isMobile ? "→" : "Next →"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenthPartTool;
