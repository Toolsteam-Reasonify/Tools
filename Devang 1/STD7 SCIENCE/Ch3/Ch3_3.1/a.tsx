import React, { useState, useEffect, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// DESIGN SYSTEM TOKENS (from Singularity PDF)
// ═══════════════════════════════════════════════════════════════════════════
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
    darkPurple: "#533086",
    darkOrange: "#FC9145",
  },
  font: "'Poppins', sans-serif",
  radius: { sm: "8px", md: "12px", lg: "16px", xl: "24px", pill: "999px" },
  shadow: {
    sm: "0 2px 8px rgba(74,77,201,0.08)",
    md: "0 8px 24px rgba(74,77,201,0.12)",
    lg: "0 16px 48px rgba(74,77,201,0.16)",
    xl: "0 24px 64px rgba(74,77,201,0.2)",
  },
};

const gradient = `linear-gradient(135deg, ${DS.colors.gradientStart} 0%, ${DS.colors.gradientEnd} 100%)`;
const gradientReverse = `linear-gradient(135deg, ${DS.colors.gradientEnd} 0%, ${DS.colors.gradientStart} 100%)`;
const gradientSubtle = `linear-gradient(135deg, ${DS.colors.lightPurple}40 0%, ${DS.colors.lightOrange}60 100%)`;

// ═══════════════════════════════════════════════════════════════════════════
// RESPONSIVE HOOK
// ═══════════════════════════════════════════════════════════════════════════
const useResponsive = () => {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return {
    isMobile: width < 640,
    isTablet: width >= 640 && width < 1024,
    isDesktop: width >= 1024,
    width,
  };
};

// ═══════════════════════════════════════════════════════════════════════════
// DESIGN SYSTEM BUTTON COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
const DSButton = ({
  variant = "contained",
  children,
  onClick,
  disabled,
  icon,
  style: customStyle,
  color = "primary",
}) => {
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);

  const isPrimary = color === "primary";
  const baseColor = isPrimary ? DS.colors.primary : DS.colors.accent;
  const lightBg = isPrimary ? DS.colors.lightPurple : DS.colors.lightOrange;

  const styles = {
    contained: {
      background: disabled
        ? DS.colors.gray300
        : hover
          ? isPrimary
            ? "#3638A8"
            : "#E5660F"
          : baseColor,
      color: disabled ? DS.colors.gray500 : DS.colors.white,
      border: "none",
      boxShadow: hover && !disabled ? `0 6px 20px ${baseColor}50` : "none",
      transform: pressed ? "scale(0.97)" : hover ? "translateY(-1px)" : "none",
    },
    outlined: {
      background: disabled
        ? DS.colors.gray100
        : hover
          ? `${baseColor}10`
          : "transparent",
      color: disabled ? DS.colors.gray500 : baseColor,
      border: `2px solid ${disabled ? DS.colors.gray300 : baseColor}`,
      transform: pressed ? "scale(0.97)" : hover ? "translateY(-1px)" : "none",
    },
    texted: {
      background: disabled
        ? "transparent"
        : hover
          ? `${baseColor}08`
          : "transparent",
      color: disabled ? DS.colors.gray500 : baseColor,
      border: "none",
      textDecoration: hover && !disabled ? "underline" : "none",
      transform: pressed ? "scale(0.97)" : "none",
    },
    gradient: {
      background: disabled ? DS.colors.gray300 : gradient,
      color: DS.colors.white,
      border: "none",
      boxShadow:
        hover && !disabled ? `0 8px 24px ${DS.colors.gradientStart}50` : "none",
      transform: pressed ? "scale(0.97)" : hover ? "translateY(-2px)" : "none",
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setPressed(false);
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        height: "40px",
        padding: icon ? "0 24px 0 20px" : "0 24px",
        borderRadius: DS.radius.pill,
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: DS.font,
        fontWeight: 600,
        fontSize: "14px",
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        whiteSpace: "nowrap",
        ...styles[variant],
        ...customStyle,
      }}
    >
      {icon && (
        <span
          style={{ display: "flex", alignItems: "center", fontSize: "18px" }}
        >
          {icon}
        </span>
      )}
      {children}
    </button>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// INLINE SVG ICONS
// ═══════════════════════════════════════════════════════════════════════════
const Icon = ({ name, size = 24, color = "currentColor" }) => {
  const paths = {
    eye: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </>
    ),
    check: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
    left: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 19l-7-7 7-7"
      />
    ),
    right: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    ),
    award: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
      />
    ),
    restart: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    ),
    home: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      fill="none"
      stroke={color}
      viewBox="0 0 24 24"
    >
      {paths[name]}
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATED REAL-WORLD SVG ILLUSTRATIONS
// ═══════════════════════════════════════════════════════════════════════════

const CookingCircuitAnimation = ({ expanded = false }) => {
  const w = expanded ? 420 : 280;
  const h = expanded ? 320 : 200;
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 420 320"
      preserveAspectRatio="xMidYMid meet"
      style={{ maxWidth: w, maxHeight: h, transition: "all 0.4s ease" }}
    >
      <defs>
        <linearGradient id="stoveTopGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#374151" />
          <stop offset="100%" stopColor="#111827" />
        </linearGradient>
        <linearGradient id="stoveFrontGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f9fafb" />
          <stop offset="100%" stopColor="#e5e7eb" />
        </linearGradient>
        <filter id="heatGlowCook">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="electricGlowCook">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="heatRadial" cx="50%" cy="50%">
          <stop offset="0%" stopColor={DS.colors.accent} stopOpacity="0.9">
            <animate
              attributeName="stopOpacity"
              values="0.9;0.5;0.9"
              dur="0.4s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="420" height="180" fill={DS.colors.lightOrange} />
      <rect x="0" y="180" width="420" height="140" fill="#8b5a2b" />
      <rect
        x="30"
        y="100"
        width="220"
        height="130"
        rx="6"
        fill="url(#stoveFrontGrad)"
        stroke="#9ca3af"
        strokeWidth="3"
      />
      <rect
        x="25"
        y="80"
        width="230"
        height="85"
        rx="6"
        fill="url(#stoveTopGrad)"
        stroke="#374151"
        strokeWidth="3"
      />
      <ellipse
        cx="100"
        cy="125"
        rx="55"
        ry="28"
        fill="url(#heatRadial)"
        filter="url(#heatGlowCook)"
      />
      <g filter="url(#heatGlowCook)">
        <ellipse
          cx="100"
          cy="125"
          rx="50"
          ry="22"
          fill="none"
          stroke={DS.colors.accent}
          strokeWidth="8"
          opacity="0.95"
        >
          <animate
            attributeName="stroke"
            values={`${DS.colors.accent};#fca5a5;${DS.colors.accent}`}
            dur="0.5s"
            repeatCount="indefinite"
          />
        </ellipse>
        <ellipse
          cx="100"
          cy="125"
          rx="38"
          ry="16"
          fill="none"
          stroke="#f87171"
          strokeWidth="6"
          opacity="0.95"
        />
        <ellipse
          cx="100"
          cy="125"
          rx="26"
          ry="10"
          fill="none"
          stroke="#dc2626"
          strokeWidth="5"
          opacity="0.95"
        />
        <ellipse
          cx="100"
          cy="125"
          rx="14"
          ry="5"
          fill="none"
          stroke="#b91c1c"
          strokeWidth="4"
          opacity="0.95"
        />
      </g>
      <ellipse cx="100" cy="100" rx="48" ry="16" fill="#57534e" />
      <rect x="148" y="92" width="55" height="10" rx="5" fill="#78350f" />
      {[70, 85, 100, 115, 130].map((x, i) => (
        <g key={i}>
          <path
            d={`M${x} 80 Q${x + 8} 60 ${x} 40`}
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.5"
          >
            <animate
              attributeName="opacity"
              values="0.6;0.2;0"
              dur={`${1.5 + i * 0.25}s`}
              repeatCount="indefinite"
            />
          </path>
        </g>
      ))}
      {/* Circuit Panel */}
      <rect
        x="270"
        y="20"
        width="140"
        height="280"
        rx="8"
        fill="white"
        stroke={DS.colors.lightPurple}
        strokeWidth="2"
      />
      <text
        x="340"
        y="45"
        fontSize="12"
        fill={DS.colors.primary}
        textAnchor="middle"
        fontWeight="700"
        fontFamily={DS.font}
      >
        ⚡ CIRCUIT FLOW
      </text>
      <rect
        x="305"
        y="60"
        width="70"
        height="50"
        rx="6"
        fill={DS.colors.gray100}
        stroke={DS.colors.gray500}
        strokeWidth="3"
      />
      <rect
        x="318"
        y="72"
        width="12"
        height="20"
        rx="2"
        fill={DS.colors.gray900}
      />
      <rect
        x="350"
        y="72"
        width="12"
        height="20"
        rx="2"
        fill={DS.colors.gray900}
      />
      <text
        x="340"
        y="125"
        fontSize="10"
        fill={DS.colors.gray900}
        textAnchor="middle"
        fontWeight="600"
        fontFamily={DS.font}
      >
        POWER SOURCE
      </text>
      <path
        d="M340 110 L340 160"
        stroke={DS.colors.accent}
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      >
        <animate
          attributeName="stroke"
          values={`${DS.colors.accent};${DS.colors.lightOrange};${DS.colors.accent}`}
          dur="0.3s"
          repeatCount="indefinite"
        />
      </path>
      <rect
        x="310"
        y="160"
        width="60"
        height="35"
        rx="6"
        fill={DS.colors.gray300}
        stroke={DS.colors.gray500}
        strokeWidth="2"
      />
      <rect
        x="318"
        y="170"
        width="44"
        height="15"
        rx="7"
        fill={DS.colors.gray900}
      />
      <circle cx="350" cy="177" r="8" fill={DS.colors.primary}>
        <animate
          attributeName="cx"
          values="350;330;350"
          dur="3s"
          repeatCount="indefinite"
        />
      </circle>
      <text
        x="340"
        y="210"
        fontSize="10"
        fill={DS.colors.gray900}
        textAnchor="middle"
        fontWeight="600"
        fontFamily={DS.font}
      >
        SWITCH
      </text>
      <path
        d="M340 195 L340 230 L265 230 L265 125"
        stroke={DS.colors.accent}
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      >
        <animate
          attributeName="stroke"
          values={`${DS.colors.accent};${DS.colors.lightOrange};${DS.colors.accent}`}
          dur="0.3s"
          repeatCount="indefinite"
          begin="0.15s"
        />
      </path>
      <rect
        x="310"
        y="245"
        width="60"
        height="35"
        rx="6"
        fill={DS.colors.lightOrange}
        stroke={DS.colors.accent}
        strokeWidth="2"
      />
      <path
        d="M320 262 Q328 252 336 262 Q344 272 352 262 Q360 252 368 262"
        stroke={DS.colors.accent}
        strokeWidth="4"
        fill="none"
      >
        <animate
          attributeName="stroke"
          values={`${DS.colors.accent};${DS.colors.darkOrange};${DS.colors.accent}`}
          dur="0.5s"
          repeatCount="indefinite"
        />
      </path>
      <text
        x="340"
        y="295"
        fontSize="10"
        fill={DS.colors.accent}
        textAnchor="middle"
        fontWeight="600"
        fontFamily={DS.font}
      >
        HEATING COIL
      </text>
      {[0, 0.4, 0.8, 1.2, 1.6].map((delay, i) => (
        <circle
          key={i}
          r="7"
          fill={DS.colors.lightOrange}
          filter="url(#electricGlowCook)"
        >
          <animateMotion
            dur="2s"
            repeatCount="indefinite"
            begin={`${delay}s`}
            path="M340 85 L340 160 L340 195 L340 230 L265 230 L265 125 L100 125"
          />
          <animate
            attributeName="r"
            values="7;9;7"
            dur="0.5s"
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </svg>
  );
};

const LightingCircuitAnimation = ({ expanded = false }) => {
  const w = expanded ? 420 : 280;
  const h = expanded ? 320 : 200;
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 420 320"
      preserveAspectRatio="xMidYMid meet"
      style={{ maxWidth: w, maxHeight: h, transition: "all 0.4s ease" }}
    >
      <defs>
        <radialGradient id="bulbLightGradE" cx="50%" cy="40%">
          <stop offset="0%" stopColor="#fffef5" />
          <stop offset="40%" stopColor={DS.colors.accent} />
          <stop offset="100%" stopColor={DS.colors.accent} stopOpacity="0" />
        </radialGradient>
        <filter id="bulbGlowE">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="wireGlowL">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect x="0" y="0" width="260" height="320" fill={DS.colors.lightOrange} />
      <rect x="0" y="0" width="260" height="25" fill={DS.colors.gray300} />
      <ellipse
        cx="110"
        cy="100"
        rx="130"
        ry="110"
        fill="url(#bulbLightGradE)"
        opacity="0.5"
      >
        <animate
          attributeName="opacity"
          values="0.5;0.7;0.5"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </ellipse>
      <rect
        x="95"
        y="20"
        width="30"
        height="20"
        rx="3"
        fill={DS.colors.gray900}
      />
      <path d="M110 45 L110 70" stroke={DS.colors.gray900} strokeWidth="4" />
      <path
        d="M70 70 L150 70 L140 95 L80 95 Z"
        fill={DS.colors.gray100}
        stroke={DS.colors.gray500}
        strokeWidth="2"
      />
      <ellipse
        cx="110"
        cy="130"
        rx="42"
        ry="52"
        fill={DS.colors.lightOrange}
        filter="url(#bulbGlowE)"
        opacity="0.95"
      >
        <animate
          attributeName="opacity"
          values="0.95;1;0.95"
          dur="0.6s"
          repeatCount="indefinite"
        />
      </ellipse>
      <ellipse
        cx="110"
        cy="126"
        rx="28"
        ry="36"
        fill="#fffef5"
        opacity="0.75"
      />
      <g filter="url(#wireGlowL)">
        <path
          d="M95 140 Q102 110 110 140 Q118 170 125 140"
          stroke={DS.colors.accent}
          strokeWidth="4"
          fill="none"
        >
          <animate
            attributeName="stroke"
            values={`${DS.colors.accent};${DS.colors.darkOrange};${DS.colors.accent}`}
            dur="0.12s"
            repeatCount="indefinite"
          />
        </path>
      </g>
      <circle cx="110" cy="130" r="18" fill="#fffef5" filter="url(#bulbGlowE)">
        <animate
          attributeName="r"
          values="18;22;18"
          dur="0.6s"
          repeatCount="indefinite"
        />
      </circle>
      <rect
        x="92"
        y="180"
        width="36"
        height="16"
        fill={DS.colors.gray500}
        rx="2"
      />
      <rect x="95" y="196" width="30" height="8" fill={DS.colors.gray900} />
      {/* Circuit Panel */}
      <rect
        x="265"
        y="0"
        width="155"
        height="320"
        fill="white"
        stroke={DS.colors.lightPurple}
        strokeWidth="2"
      />
      <text
        x="342"
        y="25"
        fontSize="12"
        fill={DS.colors.primary}
        textAnchor="middle"
        fontWeight="700"
        fontFamily={DS.font}
      >
        ⚡ CIRCUIT FLOW
      </text>
      <rect
        x="305"
        y="250"
        width="75"
        height="55"
        rx="6"
        fill={DS.colors.gray100}
        stroke={DS.colors.gray500}
        strokeWidth="3"
      />
      <rect
        x="318"
        y="262"
        width="14"
        height="22"
        rx="3"
        fill={DS.colors.gray900}
      />
      <rect
        x="348"
        y="262"
        width="14"
        height="22"
        rx="3"
        fill={DS.colors.gray900}
      />
      <text
        x="342"
        y="318"
        fontSize="10"
        fill={DS.colors.gray900}
        textAnchor="middle"
        fontWeight="600"
        fontFamily={DS.font}
      >
        POWER SOURCE
      </text>
      <rect
        x="305"
        y="145"
        width="75"
        height="55"
        rx="6"
        fill={DS.colors.gray100}
        stroke={DS.colors.gray500}
        strokeWidth="3"
      />
      <rect
        x="320"
        y="158"
        width="45"
        height="30"
        rx="4"
        fill={DS.colors.gray300}
      />
      <rect
        x="328"
        y="165"
        width="30"
        height="16"
        rx="2"
        fill={DS.colors.primary}
      >
        <animate
          attributeName="y"
          values="165;173;165"
          dur="4s"
          repeatCount="indefinite"
        />
      </rect>
      <text
        x="342"
        y="215"
        fontSize="10"
        fill={DS.colors.gray900}
        textAnchor="middle"
        fontWeight="600"
        fontFamily={DS.font}
      >
        SWITCH
      </text>
      <ellipse
        cx="342"
        cy="75"
        rx="28"
        ry="35"
        fill={DS.colors.lightOrange}
        stroke={DS.colors.accent}
        strokeWidth="3"
      />
      <path
        d="M330 80 Q338 65 342 80 Q346 95 354 80"
        stroke={DS.colors.accent}
        strokeWidth="3"
        fill="none"
      >
        <animate
          attributeName="stroke"
          values={`${DS.colors.accent};${DS.colors.darkOrange};${DS.colors.accent}`}
          dur="0.3s"
          repeatCount="indefinite"
        />
      </path>
      <text
        x="342"
        y="138"
        fontSize="10"
        fill={DS.colors.accent}
        textAnchor="middle"
        fontWeight="600"
        fontFamily={DS.font}
      >
        LIGHT BULB
      </text>
      <path
        d="M342 250 L342 200"
        stroke={DS.colors.accent}
        strokeWidth="6"
        fill="none"
        filter="url(#wireGlowL)"
      >
        <animate
          attributeName="stroke"
          values={`${DS.colors.accent};${DS.colors.lightOrange};${DS.colors.accent}`}
          dur="0.4s"
          repeatCount="indefinite"
        />
      </path>
      <path
        d="M342 145 L342 120"
        stroke={DS.colors.accent}
        strokeWidth="6"
        fill="none"
        filter="url(#wireGlowL)"
      />
      <path
        d="M270 75 L270 300 L305 300"
        stroke={DS.colors.accent}
        strokeWidth="6"
        fill="none"
        filter="url(#wireGlowL)"
      />
      <path
        d="M305 75 L270 75"
        stroke={DS.colors.accent}
        strokeWidth="6"
        fill="none"
        filter="url(#wireGlowL)"
      />
      {[0, 0.5, 1, 1.5].map((delay, i) => (
        <circle
          key={i}
          r="7"
          fill={DS.colors.lightOrange}
          filter="url(#wireGlowL)"
        >
          <animateMotion
            dur="2.5s"
            repeatCount="indefinite"
            begin={`${delay}s`}
            path="M342 280 L342 200 L342 145 L342 110 L305 75 L270 75 L270 300 L305 300 L342 280"
          />
        </circle>
      ))}
    </svg>
  );
};

const TransportCircuitAnimation = ({ expanded = false }) => {
  const w = expanded ? 480 : 300;
  const h = expanded ? 340 : 210;
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 480 340"
      preserveAspectRatio="xMidYMid meet"
      style={{ maxWidth: w, maxHeight: h, transition: "all 0.4s ease" }}
    >
      <defs>
        <linearGradient id="evBodyGradE" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={DS.colors.lightPurple} />
          <stop offset="50%" stopColor={DS.colors.primary} />
          <stop offset="100%" stopColor={DS.colors.darkPurple} />
        </linearGradient>
        <linearGradient id="skyGradE" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={DS.colors.lightPurple} />
          <stop offset="100%" stopColor={DS.colors.lightOrange} />
        </linearGradient>
        <filter id="motorGlowEV">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect x="0" y="0" width="480" height="200" fill="url(#skyGradE)" />
      <circle cx="420" cy="50" r="35" fill={DS.colors.accent} opacity="0.9">
        <animate
          attributeName="r"
          values="35;40;35"
          dur="3s"
          repeatCount="indefinite"
        />
      </circle>
      <rect x="0" y="200" width="480" height="140" fill={DS.colors.gray900} />
      <line
        x1="0"
        y1="245"
        x2="480"
        y2="245"
        stroke={DS.colors.accent}
        strokeWidth="5"
        strokeDasharray="30,20"
      >
        <animate
          attributeName="stroke-dashoffset"
          values="0;-50"
          dur="0.4s"
          repeatCount="indefinite"
        />
      </line>
      {/* Car */}
      <g>
        <path
          d="M60 185 L80 140 L105 118 L235 118 L265 140 L290 185 L300 185 L300 225 L45 225 L45 185 Z"
          fill="url(#evBodyGradE)"
          stroke={DS.colors.darkPurple}
          strokeWidth="3"
        />
        <path
          d="M105 124 L135 124 L135 152 L92 152 Z"
          fill={DS.colors.lightPurple}
          stroke={DS.colors.darkPurple}
          strokeWidth="2"
        />
        <path
          d="M145 124 L205 124 L205 152 L145 152 Z"
          fill={DS.colors.lightPurple}
          stroke={DS.colors.darkPurple}
          strokeWidth="2"
        />
        <path
          d="M215 124 L240 124 L255 152 L215 152 Z"
          fill={DS.colors.lightPurple}
          stroke={DS.colors.darkPurple}
          strokeWidth="2"
        />
        <rect
          x="145"
          y="192"
          width="50"
          height="18"
          rx="5"
          fill={DS.colors.darkPurple}
        />
        <text
          x="170"
          y="205"
          fontSize="12"
          fill="white"
          textAnchor="middle"
          fontWeight="bold"
          fontFamily={DS.font}
        >
          EV
        </text>
        <ellipse cx="290" cy="180" rx="10" ry="16" fill={DS.colors.lightOrange}>
          <animate
            attributeName="fill"
            values={`${DS.colors.lightOrange};white;${DS.colors.lightOrange}`}
            dur="0.4s"
            repeatCount="indefinite"
          />
        </ellipse>
      </g>
      {/* Wheels */}
      {[95, 250].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="225" r="30" fill="#1f2937" />
          <circle cx={cx} cy="225" r="24" fill="#374151" />
          <circle cx={cx} cy="225" r="8" fill="#9ca3af" />
          <g>
            <line
              x1={cx}
              y1="200"
              x2={cx}
              y2="250"
              stroke="#4b5563"
              strokeWidth="5"
            />
            <line
              x1={cx - 25}
              y1="225"
              x2={cx + 25}
              y2="225"
              stroke="#4b5563"
              strokeWidth="5"
            />
            <animateTransform
              attributeName="transform"
              type="rotate"
              from={`0 ${cx} 225`}
              to={`360 ${cx} 225`}
              dur="0.4s"
              repeatCount="indefinite"
            />
          </g>
        </g>
      ))}
      {/* Circuit Panel */}
      <rect
        x="350"
        y="105"
        width="125"
        height="225"
        rx="8"
        fill="white"
        stroke={DS.colors.lightPurple}
        strokeWidth="2"
      />
      <text
        x="412"
        y="128"
        fontSize="11"
        fill={DS.colors.primary}
        textAnchor="middle"
        fontWeight="700"
        fontFamily={DS.font}
      >
        ⚡ EV CIRCUIT
      </text>
      <rect
        x="365"
        y="145"
        width="95"
        height="50"
        rx="6"
        fill={DS.colors.darkPurple}
        stroke={DS.colors.primary}
        strokeWidth="3"
      />
      <text
        x="412"
        y="165"
        fontSize="10"
        fill={DS.colors.lightPurple}
        textAnchor="middle"
        fontWeight="600"
        fontFamily={DS.font}
      >
        BATTERY PACK
      </text>
      {[372, 392, 412, 432].map((x, i) => (
        <rect
          key={i}
          x={x}
          y={172}
          width="18"
          height="18"
          rx="3"
          fill={DS.colors.primary}
        >
          <animate
            attributeName="opacity"
            values="1;0.4;1"
            dur="1.5s"
            repeatCount="indefinite"
            begin={`${i * 0.25}s`}
          />
        </rect>
      ))}
      <path
        d="M412 205 L412 230"
        stroke={DS.colors.primary}
        strokeWidth="5"
        fill="none"
      >
        <animate
          attributeName="stroke"
          values={`${DS.colors.primary};${DS.colors.lightPurple};${DS.colors.primary}`}
          dur="0.3s"
          repeatCount="indefinite"
        />
      </path>
      <rect
        x="385"
        y="230"
        width="55"
        height="30"
        rx="4"
        fill={DS.colors.gray900}
        stroke={DS.colors.gray500}
        strokeWidth="2"
      />
      <text
        x="412"
        y="250"
        fontSize="8"
        fill="#9ca3af"
        textAnchor="middle"
        fontWeight="600"
        fontFamily={DS.font}
      >
        CONTROLLER
      </text>
      <path
        d="M412 260 L412 285"
        stroke={DS.colors.primary}
        strokeWidth="5"
        fill="none"
      />
      <circle
        cx="412"
        cy="305"
        r="18"
        fill={DS.colors.gray900}
        stroke={DS.colors.gray500}
        strokeWidth="3"
      />
      <circle
        cx="412"
        cy="305"
        r="10"
        fill={DS.colors.primary}
        filter="url(#motorGlowEV)"
      >
        <animate
          attributeName="fill"
          values={`${DS.colors.primary};${DS.colors.lightPurple};${DS.colors.primary}`}
          dur="0.15s"
          repeatCount="indefinite"
        />
      </circle>
      <text
        x="412"
        y="332"
        fontSize="9"
        fill={DS.colors.primary}
        textAnchor="middle"
        fontWeight="600"
        fontFamily={DS.font}
      >
        MOTOR
      </text>
      {[0, 0.35, 0.7, 1.05, 1.4].map((delay, i) => (
        <circle
          key={i}
          r="6"
          fill={DS.colors.lightPurple}
          filter="url(#motorGlowEV)"
        >
          <animateMotion
            dur="1.8s"
            repeatCount="indefinite"
            begin={`${delay}s`}
            path="M412 170 L412 230 L412 260 L412 305"
          />
        </circle>
      ))}
      <rect
        x="100"
        y="158"
        width="100"
        height="32"
        rx="5"
        fill={DS.colors.darkPurple}
        stroke={DS.colors.primary}
        strokeWidth="2"
        opacity="0.95"
      />
      <text
        x="150"
        y="180"
        fontSize="8"
        fill="white"
        textAnchor="middle"
        fontWeight="bold"
        fontFamily={DS.font}
      >
        BATTERY
      </text>
      <text
        x="170"
        y="65"
        fontSize="14"
        fill={DS.colors.primary}
        textAnchor="middle"
        fontWeight="bold"
        fontFamily={DS.font}
      >
        ⚡ ELECTRIC
      </text>
    </svg>
  );
};

const CoolingCircuitAnimation = ({ expanded = false }) => {
  const w = expanded ? 380 : 240;
  const h = expanded ? 280 : 175;
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 380 280"
      preserveAspectRatio="xMidYMid meet"
      style={{ maxWidth: w, maxHeight: h, transition: "all 0.4s ease" }}
    >
      <defs>
        <filter id="coolAirGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect x="0" y="0" width="240" height="280" fill={DS.colors.lightOrange} />
      <rect
        x="20"
        y="25"
        width="200"
        height="80"
        rx="8"
        fill="white"
        stroke={DS.colors.gray500}
        strokeWidth="3"
      />
      <rect
        x="30"
        y="35"
        width="50"
        height="20"
        rx="4"
        fill={DS.colors.primary}
      />
      <text
        x="55"
        y="49"
        fontSize="10"
        fill="white"
        textAnchor="middle"
        fontWeight="bold"
        fontFamily={DS.font}
      >
        COOL
      </text>
      <rect
        x="145"
        y="35"
        width="65"
        height="28"
        rx="4"
        fill={DS.colors.darkPurple}
      />
      <text
        x="177"
        y="55"
        textAnchor="middle"
        fontSize="18"
        fill={DS.colors.lightPurple}
        fontFamily="monospace"
        fontWeight="bold"
      >
        18°C
      </text>
      {[60, 68, 76, 84, 92].map((y, i) => (
        <line
          key={i}
          x1="35"
          y1={y}
          x2="130"
          y2={y}
          stroke={DS.colors.gray500}
          strokeWidth="3"
          strokeLinecap="round"
        />
      ))}
      <circle
        cx="80"
        cy="60"
        r="18"
        fill="none"
        stroke={DS.colors.gray500}
        strokeWidth="3"
      />
      <g>
        <line
          x1="80"
          y1="44"
          x2="80"
          y2="76"
          stroke={DS.colors.gray900}
          strokeWidth="4"
        />
        <line
          x1="64"
          y1="60"
          x2="96"
          y2="60"
          stroke={DS.colors.gray900}
          strokeWidth="4"
        />
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 80 60"
          to="360 80 60"
          dur="0.4s"
          repeatCount="indefinite"
        />
      </g>
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <path
            d={`M40 ${110 + i * 12} Q75 ${118 + i * 12} 110 ${110 + i * 12} Q145 ${102 + i * 12} 180 ${110 + i * 12}`}
            fill="none"
            stroke={DS.colors.primary}
            strokeWidth="4"
            opacity={0.7 - i * 0.12}
            filter="url(#coolAirGlow)"
            strokeLinecap="round"
          >
            <animate
              attributeName="d"
              values={`M40 ${110 + i * 12} Q75 ${118 + i * 12} 110 ${110 + i * 12} Q145 ${102 + i * 12} 180 ${110 + i * 12};M40 ${145 + i * 12} Q75 ${153 + i * 12} 110 ${145 + i * 12} Q145 ${137 + i * 12} 180 ${145 + i * 12};M40 ${110 + i * 12} Q75 ${118 + i * 12} 110 ${110 + i * 12} Q145 ${102 + i * 12} 180 ${110 + i * 12}`}
              dur="2.5s"
              repeatCount="indefinite"
              begin={`${i * 0.25}s`}
            />
            <animate
              attributeName="opacity"
              values={`${0.7 - i * 0.12};0.2;0`}
              dur="2.5s"
              repeatCount="indefinite"
              begin={`${i * 0.25}s`}
            />
          </path>
        </g>
      ))}
      {[50, 80, 110, 140, 170].map((x, i) => (
        <text
          key={i}
          x={x}
          y="130"
          fontSize="16"
          fill={DS.colors.primary}
          opacity="0.8"
        >
          ❄
          <animate
            attributeName="y"
            values="130;180;130"
            dur={`${2.2 + i * 0.3}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.8;0.3;0"
            dur={`${2.2 + i * 0.3}s`}
            repeatCount="indefinite"
          />
        </text>
      ))}
      {/* Circuit Panel */}
      <rect
        x="248"
        y="10"
        width="125"
        height="260"
        rx="8"
        fill="white"
        stroke={DS.colors.lightPurple}
        strokeWidth="2"
      />
      <text
        x="310"
        y="32"
        fontSize="11"
        fill={DS.colors.primary}
        textAnchor="middle"
        fontWeight="700"
        fontFamily={DS.font}
      >
        ⚡ AC CIRCUIT
      </text>
      <rect
        x="280"
        y="45"
        width="60"
        height="42"
        rx="5"
        fill={DS.colors.gray900}
        stroke={DS.colors.gray500}
        strokeWidth="2"
      />
      <text
        x="310"
        y="100"
        fontSize="9"
        fill={DS.colors.gray900}
        textAnchor="middle"
        fontWeight="600"
        fontFamily={DS.font}
      >
        POWER
      </text>
      <path
        d="M310 87 L310 115"
        stroke={DS.colors.accent}
        strokeWidth="5"
        fill="none"
      >
        <animate
          attributeName="stroke"
          values={`${DS.colors.accent};${DS.colors.lightOrange};${DS.colors.accent}`}
          dur="0.4s"
          repeatCount="indefinite"
        />
      </path>
      <rect
        x="280"
        y="115"
        width="60"
        height="45"
        rx="5"
        fill={DS.colors.gray300}
        stroke={DS.colors.gray500}
        strokeWidth="2"
      />
      <circle cx="310" cy="137" r="14" fill={DS.colors.darkPurple} />
      <circle cx="310" cy="137" r="10" fill={DS.colors.primary}>
        <animate
          attributeName="fill"
          values={`${DS.colors.primary};${DS.colors.lightPurple};${DS.colors.primary}`}
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
      <text
        x="310"
        y="141"
        fontSize="8"
        fill="white"
        textAnchor="middle"
        fontWeight="bold"
        fontFamily={DS.font}
      >
        18°
      </text>
      <text
        x="310"
        y="172"
        fontSize="9"
        fill={DS.colors.gray900}
        textAnchor="middle"
        fontWeight="600"
        fontFamily={DS.font}
      >
        THERMOSTAT
      </text>
      <path
        d="M310 160 L310 190"
        stroke={DS.colors.accent}
        strokeWidth="5"
        fill="none"
      />
      <rect
        x="280"
        y="190"
        width="60"
        height="40"
        rx="5"
        fill={DS.colors.gray900}
        stroke={DS.colors.primary}
        strokeWidth="2"
      />
      <text
        x="310"
        y="242"
        fontSize="9"
        fill={DS.colors.primary}
        textAnchor="middle"
        fontWeight="600"
        fontFamily={DS.font}
      >
        COMPRESSOR
      </text>
      {[0, 0.4, 0.8, 1.2].map((delay, i) => (
        <circle
          key={i}
          r="6"
          fill={DS.colors.lightOrange}
          filter="url(#coolAirGlow)"
        >
          <animateMotion
            dur="2s"
            repeatCount="indefinite"
            begin={`${delay}s`}
            path="M310 70 L310 115 L310 160 L310 210 L280 210 L255 210 L255 60"
          />
        </circle>
      ))}
    </svg>
  );
};

const EntertainmentCircuitAnimation = ({ expanded = false }) => {
  const w = expanded ? 380 : 240;
  const h = expanded ? 280 : 175;
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 380 280"
      preserveAspectRatio="xMidYMid meet"
      style={{ maxWidth: w, maxHeight: h, transition: "all 0.4s ease" }}
    >
      <defs>
        <linearGradient
          id="screenGlowGradE"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor={DS.colors.primary}>
            <animate
              attributeName="stopColor"
              values={`${DS.colors.primary};${DS.colors.accent};${DS.colors.darkPurple};${DS.colors.primary}`}
              dur="4s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" stopColor={DS.colors.accent}>
            <animate
              attributeName="stopColor"
              values={`${DS.colors.accent};${DS.colors.darkPurple};${DS.colors.primary};${DS.colors.accent}`}
              dur="4s"
              repeatCount="indefinite"
            />
          </stop>
        </linearGradient>
        <filter id="screenGlowE">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect x="0" y="0" width="240" height="280" fill={DS.colors.lightOrange} />
      <rect
        x="10"
        y="175"
        width="220"
        height="60"
        rx="6"
        fill={DS.colors.gray900}
      />
      <rect
        x="25"
        y="25"
        width="190"
        height="140"
        rx="6"
        fill="#1f2937"
        stroke={DS.colors.gray900}
        strokeWidth="4"
      />
      <rect
        x="35"
        y="35"
        width="170"
        height="120"
        rx="3"
        fill="url(#screenGlowGradE)"
        filter="url(#screenGlowE)"
      />
      {[45, 80, 115, 150, 185].map((x, i) => (
        <rect
          key={i}
          x={x}
          y="50"
          width="22"
          height="85"
          fill="rgba(255,255,255,0.35)"
          rx="3"
        >
          <animate
            attributeName="height"
            values={`${85 - i * 8};${50 + i * 8};${85 - i * 8}`}
            dur={`${0.7 + i * 0.12}s`}
            repeatCount="indefinite"
          />
        </rect>
      ))}
      <text
        x="120"
        y="165"
        fontSize="10"
        fill={DS.colors.gray500}
        textAnchor="middle"
        fontWeight="bold"
        fontFamily={DS.font}
      >
        SMART TV
      </text>
      <circle cx="205" cy="155" r="4" fill={DS.colors.primary}>
        <animate
          attributeName="fill"
          values={`${DS.colors.primary};${DS.colors.lightPurple};${DS.colors.primary}`}
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          d={`M220 ${70 + i * 15} Q${235 + i * 6} ${80 + i * 15} 220 ${90 + i * 15}`}
          fill="none"
          stroke={DS.colors.lightPurple}
          strokeWidth="3"
          opacity={0.7 - i * 0.15}
        >
          <animate
            attributeName="opacity"
            values={`${0.7 - i * 0.15};0;${0.7 - i * 0.15}`}
            dur="0.8s"
            repeatCount="indefinite"
            begin={`${i * 0.15}s`}
          />
        </path>
      ))}
      {/* Circuit Panel */}
      <rect
        x="248"
        y="10"
        width="125"
        height="260"
        rx="8"
        fill="white"
        stroke={DS.colors.lightPurple}
        strokeWidth="2"
      />
      <text
        x="310"
        y="32"
        fontSize="11"
        fill={DS.colors.primary}
        textAnchor="middle"
        fontWeight="700"
        fontFamily={DS.font}
      >
        ⚡ TV CIRCUIT
      </text>
      <rect
        x="280"
        y="45"
        width="60"
        height="40"
        rx="5"
        fill={DS.colors.gray900}
        stroke={DS.colors.gray500}
        strokeWidth="2"
      />
      <text
        x="310"
        y="98"
        fontSize="9"
        fill={DS.colors.gray900}
        textAnchor="middle"
        fontWeight="600"
        fontFamily={DS.font}
      >
        POWER
      </text>
      <path
        d="M310 85 L310 115"
        stroke={DS.colors.accent}
        strokeWidth="5"
        fill="none"
      >
        <animate
          attributeName="stroke"
          values={`${DS.colors.accent};${DS.colors.lightOrange};${DS.colors.accent}`}
          dur="0.3s"
          repeatCount="indefinite"
        />
      </path>
      <rect
        x="280"
        y="115"
        width="60"
        height="35"
        rx="4"
        fill={DS.colors.gray900}
        stroke={DS.colors.gray500}
        strokeWidth="2"
      />
      <text
        x="310"
        y="136"
        fontSize="7"
        fill="#9ca3af"
        textAnchor="middle"
        fontFamily={DS.font}
      >
        POWER SUPPLY
      </text>
      <text
        x="310"
        y="162"
        fontSize="9"
        fill={DS.colors.gray900}
        textAnchor="middle"
        fontWeight="600"
        fontFamily={DS.font}
      >
        AC → DC
      </text>
      <path
        d="M310 150 L310 180"
        stroke={DS.colors.accent}
        strokeWidth="5"
        fill="none"
      />
      <rect
        x="275"
        y="180"
        width="70"
        height="50"
        rx="4"
        fill={DS.colors.darkPurple}
        stroke={DS.colors.primary}
        strokeWidth="2"
      />
      <rect
        x="285"
        y="190"
        width="12"
        height="12"
        fill={DS.colors.primary}
        rx="2"
      >
        <animate
          attributeName="fill"
          values={`${DS.colors.primary};${DS.colors.lightPurple};${DS.colors.primary}`}
          dur="0.3s"
          repeatCount="indefinite"
        />
      </rect>
      <rect
        x="302"
        y="190"
        width="12"
        height="12"
        fill={DS.colors.accent}
        rx="2"
      >
        <animate
          attributeName="fill"
          values={`${DS.colors.accent};${DS.colors.lightOrange};${DS.colors.accent}`}
          dur="0.4s"
          repeatCount="indefinite"
        />
      </rect>
      <rect
        x="319"
        y="190"
        width="12"
        height="12"
        fill={DS.colors.darkPurple}
        rx="2"
      />
      <text
        x="310"
        y="242"
        fontSize="9"
        fill={DS.colors.primary}
        textAnchor="middle"
        fontWeight="600"
        fontFamily={DS.font}
      >
        MAIN BOARD
      </text>
      {[0, 0.35, 0.7, 1.05].map((delay, i) => (
        <circle
          key={i}
          r="6"
          fill={DS.colors.lightOrange}
          filter="url(#screenGlowE)"
        >
          <animateMotion
            dur="2s"
            repeatCount="indefinite"
            begin={`${delay}s`}
            path="M310 65 L310 115 L310 150 L310 205 L275 205 L255 205 L255 95 L225 95"
          />
        </circle>
      ))}
    </svg>
  );
};

const CommunicationCircuitAnimation = ({ expanded = false }) => {
  const w = expanded ? 380 : 190;
  const h = expanded ? 280 : 140;
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 380 280"
      preserveAspectRatio="xMidYMid meet"
      style={{ maxWidth: w, maxHeight: h, transition: "all 0.4s ease" }}
    >
      <defs>
        <filter id="signalGlow2">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect x="0" y="0" width="380" height="200" fill={DS.colors.darkPurple} />
      <rect x="0" y="200" width="380" height="80" fill={DS.colors.gray900} />
      {/* Phone */}
      <g transform="translate(120, 20)">
        <rect
          x="10"
          y="15"
          width="90"
          height="180"
          rx="14"
          fill="#1f2937"
          stroke={DS.colors.gray500}
          strokeWidth="2"
        />
        <rect
          x="18"
          y="38"
          width="74"
          height="140"
          rx="6"
          fill={DS.colors.primary}
        />
        <rect
          x="20"
          y="40"
          width="70"
          height="16"
          fill="rgba(0,0,0,0.2)"
          rx="3"
        />
        <text
          x="28"
          y="51"
          fontSize="10"
          fill="white"
          fontWeight="bold"
          fontFamily={DS.font}
        >
          12:00
        </text>
        {[
          [24, 62, DS.colors.primary],
          [44, 62, DS.colors.accent],
          [64, 62, DS.colors.darkOrange],
          [24, 86, DS.colors.darkPurple],
          [44, 86, DS.colors.lightPurple],
          [64, 86, DS.colors.accent],
          [24, 110, DS.colors.primary],
          [44, 110, DS.colors.darkOrange],
          [64, 110, DS.colors.darkPurple],
        ].map(([x, y, color], i) => (
          <rect
            key={i}
            x={x}
            y={y}
            width="18"
            height="18"
            rx="5"
            fill={color}
          />
        ))}
        <rect
          x="22"
          y="135"
          width="66"
          height="35"
          rx="8"
          fill="rgba(255,255,255,0.95)"
        />
        <circle cx="36" cy="152" r="10" fill={DS.colors.primary} />
        <text
          x="36"
          y="156"
          fontSize="10"
          fill="white"
          textAnchor="middle"
          fontFamily={DS.font}
        >
          M
        </text>
        <rect
          x="50"
          y="145"
          width="32"
          height="5"
          rx="2"
          fill={DS.colors.gray900}
        />
        <rect
          x="40"
          y="182"
          width="30"
          height="5"
          rx="2"
          fill={DS.colors.gray500}
        />
      </g>
      {/* Signal waves */}
      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          d={`M235 ${55 + i * 18} Q${260 + i * 8} ${65 + i * 18} 235 ${75 + i * 18}`}
          fill="none"
          stroke={DS.colors.lightPurple}
          strokeWidth="3"
          filter="url(#signalGlow2)"
          opacity={0.8 - i * 0.15}
        >
          <animate
            attributeName="opacity"
            values={`${0.8 - i * 0.15};${1 - i * 0.1};${0.8 - i * 0.15}`}
            dur="1.2s"
            repeatCount="indefinite"
            begin={`${i * 0.15}s`}
          />
        </path>
      ))}
      {/* Tower */}
      <g transform="translate(300, 20)">
        <polygon points="35,160 25,160 30,0 40,0" fill={DS.colors.gray500} />
        {[30, 60, 90, 120].map((y) => (
          <line
            key={y}
            x1={27}
            y1={y}
            x2={43}
            y2={y}
            stroke={DS.colors.gray500}
            strokeWidth="3"
          />
        ))}
        <circle cx="35" cy="5" r="5" fill={DS.colors.accent}>
          <animate
            attributeName="fill"
            values={`${DS.colors.accent};${DS.colors.lightOrange};${DS.colors.accent}`}
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
        <rect
          x="15"
          y="160"
          width="40"
          height="10"
          rx="2"
          fill={DS.colors.gray500}
        />
      </g>
      {/* Particles */}
      {[0, 1, 2, 3, 4].map((i) => (
        <circle
          key={i}
          r="5"
          fill={DS.colors.lightPurple}
          filter="url(#signalGlow2)"
        >
          <animateMotion
            dur="1.8s"
            repeatCount="indefinite"
            begin={`${i * 0.35}s`}
            path="M220 80 Q270 50 335 45"
          />
          <animate
            attributeName="opacity"
            values="1;0.8;0"
            dur="1.8s"
            repeatCount="indefinite"
            begin={`${i * 0.35}s`}
          />
        </circle>
      ))}
      {/* Circuit mini panel */}
      <g transform="translate(5, 20)">
        <rect
          x="0"
          y="0"
          width="110"
          height="165"
          rx="8"
          fill="rgba(255,255,255,0.95)"
          stroke={DS.colors.lightPurple}
          strokeWidth="2"
        />
        <text
          x="55"
          y="18"
          fontSize="9"
          fill={DS.colors.primary}
          textAnchor="middle"
          fontWeight="bold"
          fontFamily={DS.font}
        >
          CIRCUIT FLOW
        </text>
        <rect
          x="30"
          y="35"
          width="50"
          height="25"
          rx="3"
          fill={DS.colors.darkPurple}
          stroke={DS.colors.primary}
          strokeWidth="2"
        />
        <text
          x="55"
          y="80"
          fontSize="7"
          fill={DS.colors.gray500}
          textAnchor="middle"
          fontFamily={DS.font}
        >
          BATTERY
        </text>
        <path
          d="M55 60 L55 72"
          stroke={DS.colors.accent}
          strokeWidth="3"
          fill="none"
        />
        <rect
          x="35"
          y="75"
          width="40"
          height="30"
          rx="3"
          fill={DS.colors.darkPurple}
          stroke={DS.colors.lightPurple}
          strokeWidth="2"
        />
        <text
          x="55"
          y="117"
          fontSize="7"
          fill={DS.colors.gray500}
          textAnchor="middle"
          fontFamily={DS.font}
        >
          PROCESSOR
        </text>
        <path
          d="M55 120 L55 130"
          stroke={DS.colors.accent}
          strokeWidth="3"
          fill="none"
        />
        <line
          x1="55"
          y1="132"
          x2="55"
          y2="150"
          stroke={DS.colors.primary}
          strokeWidth="3"
        />
        <circle cx="55" cy="132" r="4" fill={DS.colors.primary}>
          <animate
            attributeName="r"
            values="4;6;4"
            dur="0.8s"
            repeatCount="indefinite"
          />
        </circle>
        <text
          x="55"
          y="162"
          fontSize="7"
          fill={DS.colors.gray500}
          textAnchor="middle"
          fontFamily={DS.font}
        >
          ANTENNA
        </text>
      </g>
      <text
        x="175"
        y="215"
        fontSize="10"
        fill={DS.colors.lightPurple}
        textAnchor="middle"
        fontWeight="bold"
        fontFamily={DS.font}
      >
        SMARTPHONE
      </text>
      <text
        x="335"
        y="195"
        fontSize="10"
        fill={DS.colors.lightPurple}
        textAnchor="middle"
        fontWeight="bold"
        fontFamily={DS.font}
      >
        CELL TOWER
      </text>
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// TORCH OUTLINE WITH HIGHLIGHTED PART
// ═══════════════════════════════════════════════════════════════════════════
const TorchOutline = ({ highlightPart, highlightColor, size = 280 }) => {
  const outlineColor = DS.colors.gray500;
  const hl = (part) => part === highlightPart;
  const gs = (part) => ({
    fill: hl(part) ? highlightColor : "transparent",
    stroke: hl(part) ? highlightColor : outlineColor,
    strokeWidth: hl(part) ? 3 : 2,
    opacity: hl(part) ? 1 : 0.4,
  });

  return (
    <svg
      width={size}
      height={size * 1.4}
      viewBox="0 0 140 200"
      style={{ overflow: "visible" }}
    >
      <defs>
        <filter
          id={`glow-${highlightPart}`}
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id={`pulse-${highlightPart}`} cx="50%" cy="50%">
          <stop offset="0%" stopColor={highlightColor} stopOpacity="0.8">
            <animate
              attributeName="stop-opacity"
              values="0.8;0.4;0.8"
              dur="2s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" stopColor={highlightColor} stopOpacity="0.2" />
        </radialGradient>
      </defs>
      {/* Lamp */}
      <g filter={hl("lamp") ? `url(#glow-${highlightPart})` : undefined}>
        <ellipse
          cx="70"
          cy="45"
          rx="42"
          ry="40"
          {...gs("lamp")}
          fill={hl("lamp") ? `url(#pulse-${highlightPart})` : "transparent"}
        />
        <ellipse
          cx="70"
          cy="42"
          rx="28"
          ry="26"
          fill={hl("lamp") ? highlightColor : "transparent"}
          stroke={hl("lamp") ? highlightColor : outlineColor}
          strokeWidth={hl("lamp") ? 2 : 1.5}
          opacity={hl("lamp") ? 0.6 : 0.3}
        />
        <circle
          cx="70"
          cy="42"
          r="12"
          fill={hl("lamp") ? highlightColor : "transparent"}
          stroke={hl("lamp") ? highlightColor : outlineColor}
          strokeWidth={hl("lamp") ? 2 : 1}
          opacity={hl("lamp") ? 0.8 : 0.25}
        />
        {hl("lamp") && (
          <g opacity="0.6">
            {[
              [70, 5, 70, -5],
              [45, 15, 35, 5],
              [95, 15, 105, 5],
            ].map(([x1, y1, x2, y2], i) => (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={highlightColor}
                strokeWidth="2"
                strokeLinecap="round"
              >
                <animate
                  attributeName="opacity"
                  values="0.6;1;0.6"
                  dur="1.5s"
                  repeatCount="indefinite"
                  begin={`${i * 0.2}s`}
                />
              </line>
            ))}
          </g>
        )}
      </g>
      {/* Switch */}
      <g filter={hl("switch") ? `url(#glow-${highlightPart})` : undefined}>
        <rect
          x="52"
          y="88"
          width="36"
          height="18"
          rx="4"
          {...gs("switch")}
          fill={hl("switch") ? `url(#pulse-${highlightPart})` : "transparent"}
        />
        <rect
          x="56"
          y="92"
          width="28"
          height="10"
          rx="5"
          fill={hl("switch") ? highlightColor : "transparent"}
          stroke={hl("switch") ? highlightColor : outlineColor}
          strokeWidth={hl("switch") ? 1.5 : 1}
          opacity={hl("switch") ? 0.5 : 0.25}
        />
        <rect
          x={hl("switch") ? "72" : "60"}
          y="93"
          width="10"
          height="8"
          rx="2"
          fill={hl("switch") ? highlightColor : outlineColor}
          opacity={hl("switch") ? 1 : 0.4}
        >
          {hl("switch") && (
            <animate
              attributeName="x"
              values="72;60;72"
              dur="2s"
              repeatCount="indefinite"
            />
          )}
        </rect>
      </g>
      <rect
        x="48"
        y="82"
        width="44"
        height="100"
        rx="8"
        fill="transparent"
        stroke={outlineColor}
        strokeWidth={2}
        opacity="0.3"
      />
      {/* Cells */}
      <g filter={hl("cells") ? `url(#glow-${highlightPart})` : undefined}>
        {[115, 145].map((y, i) => (
          <g key={i}>
            <rect
              x="54"
              y={y}
              width="32"
              height="25"
              rx="3"
              {...gs("cells")}
              fill={
                hl("cells") ? `url(#pulse-${highlightPart})` : "transparent"
              }
            />
            <rect
              x="66"
              y={y - 3}
              width="8"
              height="4"
              rx="1"
              fill={hl("cells") ? highlightColor : outlineColor}
              opacity={hl("cells") ? 0.8 : 0.3}
            />
            <text
              x="70"
              y={y + 15}
              textAnchor="middle"
              fontSize="8"
              fill={hl("cells") ? highlightColor : outlineColor}
              fontWeight="bold"
              opacity={hl("cells") ? 0.8 : 0.3}
            >
              + −
            </text>
          </g>
        ))}
      </g>
      {/* Wires */}
      <g filter={hl("wires") ? `url(#glow-${highlightPart})` : undefined}>
        {[
          "M 52 75 L 52 88",
          "M 88 75 L 88 88",
          "M 52 106 L 52 115",
          "M 88 106 L 88 115",
          "M 70 140 L 70 145",
        ].map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            {...gs("wires")}
            strokeLinecap="round"
          />
        ))}
        {[
          "M 48 130 L 42 130 L 42 60 L 48 60",
          "M 92 130 L 98 130 L 98 60 L 92 60",
        ].map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            {...gs("wires")}
            strokeLinecap="round"
            strokeDasharray={hl("wires") ? "none" : "4,2"}
          />
        ))}
        {hl("wires") &&
          [0, 0.5, 1].map((begin, i) => (
            <circle key={i} r="3" fill={highlightColor} opacity={1 - i * 0.2}>
              <animateMotion
                dur="2s"
                repeatCount="indefinite"
                begin={`${begin}s`}
                path="M 70 170 L 92 170 L 98 130 L 98 60 L 70 45 L 42 60 L 42 130 L 48 170 L 70 170"
              />
            </circle>
          ))}
      </g>
      <ellipse
        cx="70"
        cy="182"
        rx="24"
        ry="8"
        fill="transparent"
        stroke={outlineColor}
        strokeWidth={2}
        opacity="0.3"
      />
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// REALISTIC TORCH
// ═══════════════════════════════════════════════════════════════════════════
const RealisticTorch = ({ isOn, onClick, interactive = true }) => (
  <svg
    width="200"
    height="400"
    viewBox="0 0 200 400"
    style={{ cursor: interactive ? "pointer" : "default", maxWidth: "100%" }}
    onClick={interactive ? onClick : undefined}
  >
    <defs>
      <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor={DS.colors.darkPurple} />
        <stop offset="50%" stopColor={DS.colors.primary} />
        <stop offset="100%" stopColor={DS.colors.darkPurple} />
      </linearGradient>
      <linearGradient id="headGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor={DS.colors.darkPurple} />
        <stop offset="50%" stopColor={DS.colors.primary} />
        <stop offset="100%" stopColor={DS.colors.darkPurple} />
      </linearGradient>
      <radialGradient id="lensOff" cx="50%" cy="50%">
        <stop offset="0%" stopColor={DS.colors.gray300} />
        <stop offset="100%" stopColor={DS.colors.gray500} />
      </radialGradient>
      <radialGradient id="lensOn" cx="50%" cy="50%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="15%" stopColor="#fffef5" />
        <stop offset="35%" stopColor={DS.colors.lightOrange} />
        <stop offset="55%" stopColor={DS.colors.accent} />
        <stop offset="100%" stopColor={DS.colors.darkOrange} />
      </radialGradient>
      {/* Outer wide ambient glow */}
      <radialGradient id="lightBeamWide" cx="50%" cy="100%">
        <stop offset="0%" stopColor={`${DS.colors.accent}CC`} />
        <stop offset="30%" stopColor={`${DS.colors.accent}80`} />
        <stop offset="60%" stopColor={`${DS.colors.accent}33`} />
        <stop offset="100%" stopColor={`${DS.colors.accent}00`} />
      </radialGradient>
      {/* Inner concentrated beam */}
      <radialGradient id="lightBeamCore" cx="50%" cy="100%">
        <stop offset="0%" stopColor="#fffef5" stopOpacity="0.95" />
        <stop offset="25%" stopColor={`${DS.colors.accent}EE`} />
        <stop offset="60%" stopColor={`${DS.colors.accent}77`} />
        <stop offset="100%" stopColor={`${DS.colors.accent}00`} />
      </radialGradient>
      {/* Light cone gradient (triangular beam) */}
      <linearGradient id="beamConeGrad" x1="50%" y1="100%" x2="50%" y2="0%">
        <stop offset="0%" stopColor={DS.colors.accent} stopOpacity="0.9" />
        <stop offset="40%" stopColor={DS.colors.accent} stopOpacity="0.4" />
        <stop offset="100%" stopColor={DS.colors.accent} stopOpacity="0" />
      </linearGradient>
      {/* Multi-layer glow filters */}
      <filter id="strongGlow">
        <feGaussianBlur stdDeviation="12" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="ultraGlow">
        <feGaussianBlur stdDeviation="18" result="blur1" />
        <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur2" />
        <feMerge>
          <feMergeNode in="blur1" />
          <feMergeNode in="blur1" />
          <feMergeNode in="blur2" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="ambientGlow">
        <feGaussianBlur stdDeviation="25" result="bigBlur" />
        <feMerge>
          <feMergeNode in="bigBlur" />
          <feMergeNode in="bigBlur" />
          <feMergeNode in="bigBlur" />
        </feMerge>
      </filter>
    </defs>
    {/* === LIGHT LAYERS (when ON) === */}
    {isOn && (
      <>
        {/* Layer 1: Wide ambient fill */}
        <ellipse
          cx="100"
          cy="60"
          rx="180"
          ry="120"
          fill="url(#lightBeamWide)"
          filter="url(#ambientGlow)"
        >
          <animate
            attributeName="opacity"
            values="0.6;0.85;0.6"
            dur="2.5s"
            repeatCount="indefinite"
          />
        </ellipse>
        {/* Layer 2: Visible light cone beam */}
        <polygon
          points="50,150 -30,0 230,0 150,150"
          fill="url(#beamConeGrad)"
          filter="url(#strongGlow)"
        >
          <animate
            attributeName="opacity"
            values="0.7;0.95;0.7"
            dur="1.8s"
            repeatCount="indefinite"
          />
        </polygon>
        {/* Layer 3: Core bright beam */}
        <ellipse
          cx="100"
          cy="65"
          rx="100"
          ry="75"
          fill="url(#lightBeamCore)"
          filter="url(#strongGlow)"
        >
          <animate
            attributeName="opacity"
            values="0.85;1;0.85"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </ellipse>
        {/* Layer 4: Hot white center */}
        <ellipse
          cx="100"
          cy="90"
          rx="50"
          ry="40"
          fill="#fffef5"
          filter="url(#ultraGlow)"
          opacity="0.7"
        >
          <animate
            attributeName="opacity"
            values="0.6;0.8;0.6"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </ellipse>
        {/* Layer 5: Radiating light rays */}
        {[0, 30, 60, 90, 120, 150].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x2 = 100 + Math.cos(rad) * 140;
          const y2 = 80 - Math.sin(rad) * 100;
          return (
            <line
              key={`ray-${i}`}
              x1="100"
              y1="145"
              x2={x2}
              y2={y2}
              stroke={DS.colors.accent}
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.3"
              filter="url(#strongGlow)"
            >
              <animate
                attributeName="opacity"
                values="0.15;0.4;0.15"
                dur={`${1.5 + i * 0.2}s`}
                repeatCount="indefinite"
              />
            </line>
          );
        })}
      </>
    )}
    {/* === TORCH BODY === */}
    <ellipse
      cx="100"
      cy="160"
      rx="65"
      ry="80"
      fill="url(#headGrad)"
      stroke={DS.colors.darkPurple}
      strokeWidth="2"
    />
    <ellipse
      cx="100"
      cy="150"
      rx="50"
      ry="50"
      fill={isOn ? "url(#lensOn)" : "url(#lensOff)"}
      filter={isOn ? "url(#ultraGlow)" : "none"}
    />
    <ellipse
      cx="90"
      cy="140"
      rx="15"
      ry="20"
      fill="rgba(255,255,255,0.5)"
      opacity={isOn ? 0.9 : 0.3}
    />
    {/* Bright lens core when on */}
    {isOn && (
      <>
        <circle
          cx="100"
          cy="150"
          r="28"
          fill="#fffef5"
          filter="url(#ultraGlow)"
        >
          <animate
            attributeName="opacity"
            values="0.85;1;0.85"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
        <circle
          cx="100"
          cy="150"
          r="14"
          fill="#ffffff"
          filter="url(#strongGlow)"
          opacity="0.95"
        >
          <animate
            attributeName="r"
            values="12;16;12"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </circle>
      </>
    )}
    <rect
      x="65"
      y="200"
      width="70"
      height="180"
      rx="15"
      fill="url(#metalGrad)"
      stroke={DS.colors.darkPurple}
      strokeWidth="2"
    />
    {[220, 235, 250, 265, 280, 295, 310, 325, 340, 355].map((y) => (
      <rect
        key={y}
        x="70"
        y={y}
        width="60"
        height="3"
        rx="1.5"
        fill="rgba(0,0,0,0.3)"
      />
    ))}
    <rect
      x="80"
      y="260"
      width="40"
      height="18"
      rx="9"
      fill={isOn ? DS.colors.accent : DS.colors.gray500}
      stroke={DS.colors.darkPurple}
      strokeWidth="1"
    />
    <circle cx="100" cy="269" r="3" fill={isOn ? "white" : DS.colors.gray300} />
    <text
      x="100"
      y="240"
      textAnchor="middle"
      fontSize="10"
      fill={DS.colors.lightPurple}
      fontFamily={DS.font}
      fontWeight="bold"
    >
      TORCH
    </text>
    <ellipse cx="100" cy="380" rx="35" ry="18" fill={DS.colors.darkPurple} />
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// KEYFRAMES
// ═══════════════════════════════════════════════════════════════════════════
const injectKeyframes = () => {
  const id = "torchlight-keyframes-v2";
  if (!document.getElementById(id)) {
    const s = document.createElement("style");
    s.id = id;
    s.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
      @keyframes fadeInUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
      @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
    `;
    document.head.appendChild(s);
  }
  return () => {
    const el = document.getElementById(id);
    if (el) document.head.removeChild(el);
  };
};

const Animated = ({ index, style = {}, children }) => (
  <div
    style={{
      animation: "fadeInUp 0.5s ease-out",
      animationDelay: `${index * 0.06}s`,
      animationFillMode: "both",
      ...style,
    }}
  >
    {children}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
const TorchlightCircuitTool = () => {
  const { isMobile, isTablet } = useResponsive();
  const [currentMode, setCurrentMode] = useState("learn");
  const [currentView, setCurrentView] = useState("observe");
  const [torchOn, setTorchOn] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedPart, setSelectedPart] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [realWorldIndex, setRealWorldIndex] = useState(0);

  useEffect(() => injectKeyframes(), []);

  const questions = [
    {
      id: 1,
      question: "What is the purpose of an electric cell in a torchlight?",
      options: [
        "To produce light",
        "To provide electrical energy",
        "To control the flow of electricity",
        "To connect the parts",
      ],
      correctAnswer: "To provide electrical energy",
    },
    {
      id: 2,
      question: "How many cells make a battery?",
      options: ["One", "Two or more", "Exactly three", "None"],
      correctAnswer: "Two or more",
    },
    {
      id: 3,
      question: "What happens when we slide the switch to ON position?",
      options: [
        "Circuit breaks",
        "Circuit completes and lamp glows",
        "Battery drains immediately",
        "Nothing happens",
      ],
      correctAnswer: "Circuit completes and lamp glows",
    },
    {
      id: 4,
      question: "What component actually produces light in a torchlight?",
      options: ["Cell", "Battery", "Electric lamp", "Switch"],
      correctAnswer: "Electric lamp",
    },
    {
      id: 5,
      question: "What do connecting wires do?",
      options: [
        "Store electricity",
        "Produce light",
        "Carry electricity between components",
        "Turn electricity on and off",
      ],
      correctAnswer: "Carry electricity between components",
    },
  ];

  const realWorldData = [
    {
      id: "cooking",
      title: "Cooking & Heating",
      description:
        "Electric stoves convert electrical energy into heat through resistance. Current flows through heating coils which get red-hot to cook food.",
      examples: ["Electric Stove", "Microwave", "Kettle", "Toaster"],
      color: DS.colors.accent,
      AnimationComponent: CookingCircuitAnimation,
    },
    {
      id: "lighting",
      title: "Lighting",
      description:
        "Light bulbs and LEDs convert electrical energy into light. Current heats a filament until it glows, or excites electrons in LEDs.",
      examples: ["Light Bulbs", "Street Lights", "Flashlight", "LED Lamps"],
      color: DS.colors.darkOrange,
      AnimationComponent: LightingCircuitAnimation,
    },
    {
      id: "transportation",
      title: "Transportation",
      description:
        "Electric vehicles use batteries to power motors. The battery stores chemical energy that converts to electrical energy to spin the motor.",
      examples: ["Electric Cars", "E-Trains", "E-Bikes", "Scooters"],
      color: DS.colors.primary,
      AnimationComponent: TransportCircuitAnimation,
    },
    {
      id: "cooling",
      title: "Heating & Cooling",
      description:
        "Air conditioners use circuits to control compressors and fans. The thermostat acts as an automatic switch based on temperature.",
      examples: ["Air Conditioner", "Refrigerator", "Heater", "Fan"],
      color: DS.colors.primary,
      AnimationComponent: CoolingCircuitAnimation,
    },
    {
      id: "entertainment",
      title: "Entertainment",
      description:
        "TVs and computers use complex circuits with processors. Electricity flows through millions of tiny switches called transistors.",
      examples: ["Television", "Computer", "Gaming Console", "Speakers"],
      color: DS.colors.darkPurple,
      AnimationComponent: EntertainmentCircuitAnimation,
    },
    {
      id: "communication",
      title: "Communication",
      description:
        "Phones use circuits to transmit signals wirelessly. Batteries power the processor, screen, and radio antennas for communication.",
      examples: ["Mobile Phones", "Wi-Fi Router", "Radio", "Satellite"],
      color: DS.colors.primary,
      AnimationComponent: CommunicationCircuitAnimation,
    },
  ];

  const torchParts = [
    {
      id: "lamp",
      title: "Electric Lamp / LED",
      description: "Produces light when electricity flows through it",
      details:
        "The lamp or LED converts electrical energy into light energy when current passes through it.",
      color: DS.colors.accent,
    },
    {
      id: "switch",
      title: "Switch",
      description: "Controls ON/OFF — opens and closes the circuit",
      details:
        "The switch completes or breaks the circuit. When ON, current flows. When OFF, it stops.",
      color: DS.colors.primary,
    },
    {
      id: "cells",
      title: "Electric Cells (Battery)",
      description: "Power source — provides electrical energy",
      details:
        "Cells provide electrical energy through chemical reactions. Multiple cells form a battery.",
      color: DS.colors.darkOrange,
    },
    {
      id: "wires",
      title: "Connecting Wires",
      description: "Carry electricity between all components",
      details:
        "Wires made of copper conduct electricity between all parts to form a complete circuit.",
      color: DS.colors.darkPurple,
    },
  ];

  const icons = { lamp: "💡", switch: "🔘", cells: "🔋", wires: "⚡" };

  // ═══════════════════════════════════════════════════════════════════════
  // RENDER SECTIONS
  // ═══════════════════════════════════════════════════════════════════════

  const renderModeSelector = () => (
    <div
      style={{
        display: "flex",
        gap: isMobile ? "8px" : "12px",
        marginBottom: isMobile ? "20px" : "32px",
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {[
        { mode: "learn", label: "Learn", icon: "📚", color: DS.colors.primary },
        {
          mode: "practice",
          label: "Practice",
          icon: "🎯",
          color: DS.colors.accent,
        },
        {
          mode: "real_world",
          label: "Real World",
          icon: "🌍",
          color: DS.colors.darkPurple,
        },
      ].map(({ mode, label, icon, color }) => (
        <DSButton
          key={mode}
          variant={currentMode === mode ? "contained" : "outlined"}
          color={mode === "practice" ? "accent" : "primary"}
          onClick={() => {
            setCurrentMode(mode);
            setCurrentView("observe");
          }}
          icon={<span>{icon}</span>}
          style={{
            height: isMobile ? "36px" : "44px",
            fontSize: isMobile ? "13px" : "15px",
            backgroundColor: currentMode === mode ? color : "transparent",
            borderColor: color,
            color: currentMode === mode ? "white" : color,
            boxShadow: currentMode === mode ? `0 4px 16px ${color}40` : "none",
          }}
        >
          {label}
        </DSButton>
      ))}
    </div>
  );

  const renderObserve = () => (
    <div
      style={{
        backgroundColor: "white",
        padding: isMobile ? "20px" : "32px",
        borderRadius: DS.radius.xl,
        boxShadow: DS.shadow.lg,
        border: `1px solid ${DS.colors.lightPurple}40`,
      }}
    >
      <Animated
        index={0}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          fontSize: isMobile ? "20px" : "28px",
          fontWeight: 700,
          color: DS.colors.accent,
          marginBottom: "24px",
          flexWrap: "wrap",
        }}
      >
        <Icon name="eye" size={isMobile ? 28 : 36} color={DS.colors.accent} />
        <span>Activity: Observe a Torchlight</span>
      </Animated>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1fr"
            : "repeat(auto-fit, minmax(300px, 1fr))",
          gap: isMobile ? "20px" : "32px",
        }}
      >
        <Animated
          index={1}
          style={{
            background: `linear-gradient(135deg, ${DS.colors.darkPurple} 0%, #0f0f1e 100%)`,
            padding: isMobile ? "20px" : "32px",
            borderRadius: DS.radius.lg,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h3
            style={{
              fontSize: isMobile ? "16px" : "20px",
              fontWeight: 600,
              textAlign: "center",
              marginBottom: "20px",
              color: "white",
              fontFamily: DS.font,
            }}
          >
            👆 Click the Torch to Turn ON/OFF
          </h3>
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <RealisticTorch
              isOn={torchOn}
              onClick={() => setTorchOn(!torchOn)}
              interactive={true}
            />
          </div>
          <div
            style={{
              marginTop: "24px",
              textAlign: "center",
              color: "white",
              fontWeight: 600,
              backgroundColor: torchOn
                ? `${DS.colors.accent}40`
                : `${DS.colors.primary}30`,
              padding: "12px 20px",
              borderRadius: DS.radius.pill,
              fontFamily: DS.font,
              fontSize: isMobile ? "14px" : "16px",
              border: `1px solid ${torchOn ? DS.colors.accent : DS.colors.primary}50`,
            }}
          >
            {torchOn ? "✨ The lamp is GLOWING!" : "⭕ The lamp is NOT glowing"}
          </div>
        </Animated>
        <Animated
          index={2}
          style={{
            backgroundColor: DS.colors.lightPurple + "20",
            padding: isMobile ? "20px" : "32px",
            borderRadius: DS.radius.lg,
            border: `1px solid ${DS.colors.lightPurple}60`,
          }}
        >
          <h3
            style={{
              fontWeight: 700,
              color: DS.colors.primary,
              marginBottom: "12px",
              fontSize: isMobile ? "18px" : "20px",
              fontFamily: DS.font,
            }}
          >
            🔦 What is a Torchlight?
          </h3>
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: DS.radius.md,
              boxShadow: DS.shadow.sm,
              display: "flex",
              alignItems: "flex-start",
              gap: "16px",
            }}
          >
            <Icon name="check" size={20} color={DS.colors.primary} />
            <p
              style={{
                fontSize: isMobile ? "14px" : "16px",
                color: DS.colors.gray900,
                lineHeight: 1.75,
                fontFamily: DS.font,
                margin: 0,
              }}
            >
              A torchlight is a portable light source that uses{" "}
              <strong style={{ color: DS.colors.accent }}>
                electric cells (battery)
              </strong>
              , a <strong style={{ color: DS.colors.primary }}>switch</strong>,{" "}
              <strong style={{ color: DS.colors.darkPurple }}>wires</strong>,
              and a{" "}
              <strong style={{ color: DS.colors.darkOrange }}>
                lamp or LED
              </strong>
              . When the switch is ON, the cells push electric current through
              the wires to the lamp/LED, making it glow.
            </p>
          </div>
        </Animated>
      </div>
      <Animated
        index={3}
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "24px",
        }}
      >
        <DSButton
          variant="gradient"
          onClick={() => setCurrentView("parts")}
          icon={<Icon name="right" size={18} color="white" />}
        >
          Next: Explore Torch Parts
        </DSButton>
      </Animated>
    </div>
  );

  const renderParts = () => {
    const sel = selectedPart
      ? torchParts.find((p) => p.id === selectedPart)
      : null;
    return (
      <div
        style={{
          backgroundColor: "white",
          padding: isMobile ? "20px" : "32px",
          borderRadius: DS.radius.xl,
          boxShadow: DS.shadow.lg,
          border: `1px solid ${DS.colors.lightPurple}40`,
        }}
      >
        <Animated index={0}>
          <h2
            style={{
              fontSize: isMobile ? "22px" : "28px",
              fontWeight: 700,
              color: DS.colors.primary,
              marginBottom: "8px",
              textAlign: "center",
              fontFamily: DS.font,
            }}
          >
            🔍 What's Inside a Torchlight?
          </h2>
          <p
            style={{
              fontSize: isMobile ? "14px" : "16px",
              color: DS.colors.gray500,
              marginBottom: "28px",
              textAlign: "center",
              fontFamily: DS.font,
            }}
          >
            Click on each part to learn more
          </p>
        </Animated>
        <Animated index={1}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "repeat(2, 1fr)"
                : "repeat(4, 1fr)",
              gap: isMobile ? "12px" : "20px",
              marginBottom: "28px",
            }}
          >
            {torchParts.map((part) => (
              <div
                key={part.id}
                onClick={() => setSelectedPart(part.id)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: isMobile ? "16px 8px" : "24px 16px",
                  borderRadius: DS.radius.lg,
                  cursor: "pointer",
                  border: `2px solid ${selectedPart === part.id ? part.color : DS.colors.gray300}`,
                  background:
                    selectedPart === part.id
                      ? `${part.color}10`
                      : DS.colors.gray100,
                  boxShadow:
                    selectedPart === part.id
                      ? `0 8px 32px ${part.color}25`
                      : "none",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform:
                    selectedPart === part.id ? "scale(1.02)" : "scale(1)",
                }}
              >
                <div
                  style={{
                    marginBottom: "12px",
                    animation: "float 3s ease-in-out infinite",
                  }}
                >
                  <TorchOutline
                    highlightPart={part.id}
                    highlightColor={part.color}
                    size={isMobile ? 120 : 160}
                  />
                </div>
                <h4
                  style={{
                    fontSize: isMobile ? "12px" : "14px",
                    fontWeight: 700,
                    textAlign: "center",
                    marginBottom: "6px",
                    color: part.color,
                    fontFamily: DS.font,
                  }}
                >
                  {part.title}
                </h4>
                <p
                  style={{
                    fontSize: isMobile ? "11px" : "12px",
                    textAlign: "center",
                    color: DS.colors.gray500,
                    lineHeight: 1.4,
                    fontFamily: DS.font,
                    margin: 0,
                  }}
                >
                  {part.description}
                </p>
              </div>
            ))}
          </div>
        </Animated>
        <Animated index={2}>
          <div
            style={{
              background: `linear-gradient(135deg, ${DS.colors.darkPurple} 0%, #0f0f1e 100%)`,
              padding: isMobile ? "20px" : "28px",
              borderRadius: DS.radius.lg,
              color: "white",
              marginBottom: "20px",
              minHeight: "120px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {sel ? (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: DS.radius.md,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "22px",
                      backgroundColor: sel.color,
                    }}
                  >
                    {icons[sel.id]}
                  </div>
                  <h3
                    style={{
                      fontSize: isMobile ? "18px" : "22px",
                      fontWeight: 700,
                      color: sel.color,
                      fontFamily: DS.font,
                      margin: 0,
                    }}
                  >
                    {sel.title}
                  </h3>
                </div>
                <p
                  style={{
                    fontSize: isMobile ? "14px" : "16px",
                    lineHeight: 1.7,
                    color: DS.colors.lightPurple,
                    fontFamily: DS.font,
                    margin: 0,
                  }}
                >
                  {sel.details}
                </p>
              </>
            ) : (
              <p
                style={{
                  textAlign: "center",
                  color: DS.colors.lightPurple,
                  fontSize: isMobile ? "14px" : "18px",
                  fontFamily: DS.font,
                  margin: 0,
                }}
              >
                👆 Click on any torch diagram above to learn about that
                component
              </p>
            )}
          </div>
        </Animated>
        <Animated index={3}>
          <DSButton
            variant="outlined"
            onClick={() => {
              setCurrentView("observe");
              setSelectedPart(null);
            }}
            icon={<Icon name="left" size={18} />}
          >
            Back to Observe
          </DSButton>
        </Animated>
      </div>
    );
  };

  const renderPractice = () => {
    if (showResults) {
      const pct = Math.round((score / questions.length) * 100);
      return (
        <div
          style={{
            backgroundColor: "white",
            padding: isMobile ? "20px" : "32px",
            borderRadius: DS.radius.xl,
            boxShadow: DS.shadow.lg,
            border: `1px solid ${DS.colors.lightPurple}40`,
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <Icon name="award" size={80} color={DS.colors.accent} />
            <h1
              style={{
                fontSize: isMobile ? "28px" : "36px",
                fontWeight: 800,
                color: DS.colors.gray900,
                marginBottom: "8px",
                fontFamily: DS.font,
              }}
            >
              🎉 Practice Complete!
            </h1>
            <p
              style={{
                fontSize: isMobile ? "16px" : "20px",
                color: DS.colors.gray500,
                fontFamily: DS.font,
              }}
            >
              {pct >= 80
                ? "Excellent work!"
                : pct >= 60
                  ? "Good job!"
                  : "Keep practicing!"}
            </p>
          </div>
          <div
            style={{
              background: gradientSubtle,
              padding: "24px",
              borderRadius: DS.radius.lg,
              marginBottom: "24px",
              textAlign: "center",
              border: `1px solid ${DS.colors.lightPurple}40`,
            }}
          >
            <p
              style={{
                fontSize: "48px",
                fontWeight: 800,
                background: gradient,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontFamily: DS.font,
                margin: 0,
              }}
            >
              {score}/{questions.length}
            </p>
            <p
              style={{
                fontSize: "18px",
                color: DS.colors.gray500,
                fontFamily: DS.font,
                margin: "8px 0 0",
              }}
            >
              ({pct}% correct)
            </p>
          </div>
          <div
            style={{
              display: "flex",
              gap: "16px",
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            <DSButton
              variant="gradient"
              onClick={() => {
                setCurrentQuestionIndex(0);
                setSelectedAnswer("");
                setAnswers({});
                setShowResults(false);
                setScore(0);
              }}
              icon={<Icon name="restart" size={20} color="white" />}
              style={{ flex: 1, height: "48px", fontSize: "16px" }}
            >
              Restart
            </DSButton>
            <DSButton
              variant="contained"
              onClick={() => setCurrentMode("learn")}
              icon={<Icon name="home" size={20} color="white" />}
              style={{ flex: 1, height: "48px", fontSize: "16px" }}
            >
              Learn Mode
            </DSButton>
          </div>
        </div>
      );
    }

    const q = questions[currentQuestionIndex];
    return (
      <div
        style={{
          backgroundColor: "white",
          padding: isMobile ? "20px" : "32px",
          borderRadius: DS.radius.xl,
          boxShadow: DS.shadow.lg,
          border: `1px solid ${DS.colors.lightPurple}40`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <h1
            style={{
              fontSize: isMobile ? "22px" : "28px",
              fontWeight: 700,
              color: DS.colors.primary,
              fontFamily: DS.font,
              margin: 0,
            }}
          >
            ⚡ Practice
          </h1>
          <div
            style={{
              backgroundColor: DS.colors.lightPurple + "30",
              padding: "6px 16px",
              borderRadius: DS.radius.pill,
              fontSize: "14px",
              color: DS.colors.primary,
              fontWeight: 600,
              fontFamily: DS.font,
            }}
          >
            Q {currentQuestionIndex + 1}/{questions.length}
          </div>
        </div>
        {/* Progress bar */}
        <div
          style={{
            width: "100%",
            backgroundColor: DS.colors.gray300,
            borderRadius: DS.radius.pill,
            height: "10px",
            marginBottom: "28px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: gradient,
              height: "10px",
              borderRadius: DS.radius.pill,
              width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
              transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </div>
        <div
          style={{
            background: gradientSubtle,
            padding: isMobile ? "16px" : "24px",
            borderRadius: DS.radius.lg,
            marginBottom: "24px",
            border: `1px solid ${DS.colors.lightPurple}30`,
          }}
        >
          <h2
            style={{
              fontSize: isMobile ? "16px" : "20px",
              fontWeight: 700,
              color: DS.colors.gray900,
              fontFamily: DS.font,
              margin: 0,
            }}
          >
            {q.question}
          </h2>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginBottom: "28px",
          }}
        >
          {q.options.map((opt, i) => {
            const isSelected = selectedAnswer === opt;
            return (
              <button
                key={i}
                onClick={() => setSelectedAnswer(opt)}
                style={{
                  width: "100%",
                  padding: isMobile ? "14px" : "16px",
                  borderRadius: DS.radius.md,
                  textAlign: "left",
                  border: `2px solid ${isSelected ? "transparent" : DS.colors.gray300}`,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  background: isSelected ? gradient : DS.colors.gray100,
                  color: isSelected ? "white" : DS.colors.gray900,
                  transform: isSelected ? "scale(1.01)" : "scale(1)",
                  boxShadow: isSelected
                    ? `0 4px 16px ${DS.colors.gradientStart}30`
                    : "none",
                  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                  fontFamily: DS.font,
                }}
              >
                <div
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "14px",
                    flexShrink: 0,
                    backgroundColor: isSelected ? "white" : DS.colors.gray300,
                    color: isSelected ? DS.colors.primary : DS.colors.gray900,
                  }}
                >
                  {String.fromCharCode(65 + i)}
                </div>
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: isMobile ? "14px" : "15px",
                  }}
                >
                  {opt}
                </span>
              </button>
            );
          })}
        </div>
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <DSButton
            variant="outlined"
            onClick={() => {
              if (currentQuestionIndex > 0) {
                setCurrentQuestionIndex(currentQuestionIndex - 1);
                setSelectedAnswer(
                  answers[questions[currentQuestionIndex - 1]?.id] || "",
                );
              }
            }}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </DSButton>
          <DSButton
            variant="gradient"
            disabled={!selectedAnswer}
            style={{ flex: 1 }}
            onClick={() => {
              const newAnswers = { ...answers, [q.id]: selectedAnswer };
              setAnswers(newAnswers);
              if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setSelectedAnswer(
                  answers[questions[currentQuestionIndex + 1]?.id] || "",
                );
              } else {
                let c = 0;
                questions.forEach((qu) => {
                  if ((newAnswers[qu.id] || "") === qu.correctAnswer) c++;
                });
                setScore(c);
                setShowResults(true);
              }
            }}
          >
            {currentQuestionIndex === questions.length - 1 ? "Submit" : "Next"}
          </DSButton>
        </div>
      </div>
    );
  };

  const renderRealWorld = () => {
    const cat = realWorldData[realWorldIndex];
    const AnimComp = cat.AnimationComponent;
    const total = realWorldData.length;
    const hasPrev = realWorldIndex > 0;
    const hasNext = realWorldIndex < total - 1;

    return (
      <div>
        <Animated
          index={0}
          style={{
            textAlign: "center",
            marginBottom: isMobile ? "16px" : "28px",
          }}
        >
          <h1
            style={{
              fontSize: isMobile ? "24px" : "32px",
              fontWeight: 800,
              color: DS.colors.gray900,
              marginBottom: "8px",
              fontFamily: DS.font,
            }}
          >
            🌍 Circuits in the Real World
          </h1>
          <p
            style={{
              fontSize: isMobile ? "14px" : "18px",
              color: DS.colors.gray500,
              fontFamily: DS.font,
            }}
          >
            {realWorldIndex + 1} of {total} examples
          </p>
        </Animated>

        {/* Navigation + Card */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: isMobile ? "8px" : "16px",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          {/* Prev Button */}
          <DSButton
            variant="outlined"
            disabled={!hasPrev}
            onClick={() => {
              setRealWorldIndex(realWorldIndex - 1);
              setExpandedCategory(null);
            }}
            style={{
              minWidth: isMobile ? "40px" : "48px",
              height: isMobile ? "40px" : "48px",
              padding: "0",
              borderRadius: "50%",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: isMobile ? "18px" : "22px" }}>‹</span>
          </DSButton>

          {/* Single Card */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <Animated index={1} key={cat.id}>
              <div
                onClick={() =>
                  setExpandedCategory(
                    expandedCategory === cat.id ? null : cat.id,
                  )
                }
                style={{
                  backgroundColor: "white",
                  borderRadius: DS.radius.xl,
                  overflow: "hidden",
                  boxShadow:
                    expandedCategory === cat.id ? DS.shadow.xl : DS.shadow.md,
                  cursor: "pointer",
                  border: `2px solid ${expandedCategory === cat.id ? cat.color : DS.colors.gray300}`,
                  transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                {/* Animation area */}
                <div
                  style={{
                    backgroundColor: DS.colors.gray100,
                    borderRadius: `${DS.radius.xl} ${DS.radius.xl} 0 0`,
                    padding: isMobile ? "16px" : "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `1px dashed ${DS.colors.lightPurple}`,
                    borderBottom: "none",
                    overflow: "hidden",
                  }}
                >
                  <AnimComp expanded={true} />
                </div>

                {/* Content */}
                <div style={{ padding: isMobile ? "16px" : "24px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "8px",
                        height: "40px",
                        borderRadius: "4px",
                        background: gradient,
                        flexShrink: 0,
                      }}
                    />
                    <h2
                      style={{
                        fontSize: isMobile ? "20px" : "26px",
                        fontWeight: 700,
                        color: DS.colors.gray900,
                        fontFamily: DS.font,
                        margin: 0,
                      }}
                    >
                      {cat.title}
                    </h2>
                  </div>
                  <p
                    style={{
                      fontSize: isMobile ? "13px" : "15px",
                      color: DS.colors.gray500,
                      lineHeight: 1.7,
                      fontFamily: DS.font,
                      margin: "0 0 16px",
                    }}
                  >
                    {cat.description}
                  </p>

                  {/* How it works box */}
                  <div
                    style={{
                      backgroundColor: DS.colors.lightPurple + "20",
                      padding: isMobile ? "12px" : "16px",
                      borderRadius: DS.radius.md,
                      marginBottom: "16px",
                      border: `1px solid ${DS.colors.lightPurple}40`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: DS.colors.primary,
                        marginBottom: "8px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontFamily: DS.font,
                      }}
                    >
                      ⚡ How the Circuit Works
                    </div>
                    <p
                      style={{
                        fontSize: "13px",
                        color: DS.colors.darkPurple,
                        lineHeight: 1.6,
                        fontFamily: DS.font,
                        margin: 0,
                      }}
                    >
                      {cat.description}
                    </p>
                  </div>

                  {/* Examples */}
                  <h3
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: DS.colors.gray900,
                      marginBottom: "10px",
                      fontFamily: DS.font,
                    }}
                  >
                    Common Examples:
                  </h3>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}
                  >
                    {cat.examples.map((ex, j) => (
                      <span
                        key={j}
                        style={{
                          padding: "6px 16px",
                          borderRadius: DS.radius.pill,
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "white",
                          background: gradient,
                          fontFamily: DS.font,
                        }}
                      >
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Animated>
          </div>

          {/* Next Button */}
          <DSButton
            variant="outlined"
            disabled={!hasNext}
            onClick={() => {
              setRealWorldIndex(realWorldIndex + 1);
              setExpandedCategory(null);
            }}
            style={{
              minWidth: isMobile ? "40px" : "48px",
              height: isMobile ? "40px" : "48px",
              padding: "0",
              borderRadius: "50%",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: isMobile ? "18px" : "22px" }}>›</span>
          </DSButton>
        </div>

        {/* Dot indicators */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "8px",
            marginTop: isMobile ? "16px" : "24px",
          }}
        >
          {realWorldData.map((_, i) => (
            <div
              key={i}
              onClick={() => {
                setRealWorldIndex(i);
                setExpandedCategory(null);
              }}
              style={{
                width: realWorldIndex === i ? "28px" : "10px",
                height: "10px",
                borderRadius: DS.radius.pill,
                cursor: "pointer",
                background: realWorldIndex === i ? gradient : DS.colors.gray300,
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(160deg, ${DS.colors.lightPurple}30 0%, ${DS.colors.lightOrange}40 50%, ${DS.colors.lightPurple}20 100%)`,
        padding: isMobile ? "12px" : isTablet ? "20px" : "24px",
        fontFamily: DS.font,
      }}
    >
      {/* Decorative top accent */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: gradient,
          zIndex: 100,
        }}
      />

      <div style={{ maxWidth: "1200px", margin: "0 auto", paddingTop: "8px" }}>
        {/* Header */}
        <Animated
          index={0}
          style={{
            textAlign: "center",
            marginBottom: isMobile ? "16px" : "24px",
          }}
        >
          <h1
            style={{
              fontSize: isMobile ? "24px" : "36px",
              fontWeight: 800,
              fontFamily: DS.font,
              margin: "0 0 4px",
              background: gradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            ⚡ Torchlight Circuit Explorer
          </h1>
          <p
            style={{
              fontSize: isMobile ? "12px" : "14px",
              color: DS.colors.gray500,
              fontFamily: DS.font,
              margin: 0,
            }}
          >
            Interactive learning tool for electric circuits
          </p>
        </Animated>

        {renderModeSelector()}

        {currentMode === "learn" &&
          (currentView === "observe" ? renderObserve() : renderParts())}
        {currentMode === "practice" && renderPractice()}
        {currentMode === "real_world" && renderRealWorld()}
      </div>
    </div>
  );
};

export default TorchlightCircuitTool;
