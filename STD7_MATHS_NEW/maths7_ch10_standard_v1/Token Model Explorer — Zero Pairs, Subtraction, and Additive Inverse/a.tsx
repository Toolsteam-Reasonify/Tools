// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: token_model_subtraction_tool.tsx
// Redesigned to Singularity Design System
// ═══════════════════════════════════════════════════════════════════════════

// @ts-ignore - react types may not be resolved in this workspace
import React, { useState, useEffect, useCallback, useMemo } from "react";
// @ts-ignore - lucide-react types may not be resolved in this workspace
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

// ==================== TYPE DEFINITIONS ====================

type ModeType = "learn" | "practice" | "real_world" | "hands_on";

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
  teachingNote: string;
  studentInstruction: string;
  type: "intro" | "explanation" | "practice" | "real_world" | "hands_on";
  mode: ModeType;
  data?: any;
}

interface BaseDataInterface {
  themeColor?: string;
  autoPlayDuration?: number;
}

interface TokenModelAdditionalProps {
  minuend?: number;
  subtrahend?: number;
  showTeachingNotes?: boolean;
}

interface TokenModelSubtractionToolProps {
  props?: {
    width?: number;
    height?: number;
    data?: BaseDataInterface;
    steps?: StepDataInterface[];
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
    additionalProps?: TokenModelAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== SINGULARITY DESIGN SYSTEM TOKENS ====================

const DS = {
  // Primary
  primary: "#4A4DC9",
  primaryDark: "#3638A0",
  primaryLight: "#C1C1EA",
  primaryGhost: "#EEEEF8",

  // Highlight / Accent (Orange)
  highlight: "#FF7212",
  highlightDark: "#D45E0A",
  highlightLight: "#FFF3E4",
  highlightMid: "#FC9145",

  // Secondary (Deep Purple)
  secondary: "#533086",
  secondaryLight: "#C1C1EA",

  // Grays
  gray900: "#4E4E4E",
  gray500: "#CACACA",
  gray300: "#EBEBEB",
  gray100: "#F5F5F5",
  white: "#FFFFFF",

  // Semantic — Token Greens
  tokenGreen: "#22c55e",
  tokenGreenDark: "#16a34a",
  tokenGreenLight: "#dcfce7",

  // Semantic — Token Reds
  tokenRed: "#ef4444",
  tokenRedDark: "#dc2626",
  tokenRedLight: "#fee2e2",

  // Typography
  fontFamily: "'Poppins', sans-serif",

  // Radii
  radiusPill: 100,
  radiusLg: 20,
  radiusMd: 14,
  radiusSm: 10,

  // Shadows
  shadowSm: "0 2px 8px rgba(74, 77, 201, 0.08)",
  shadowMd: "0 4px 20px rgba(74, 77, 201, 0.10)",
  shadowLg: "0 8px 40px rgba(74, 77, 201, 0.12)",
  shadowBtn: "0 4px 14px rgba(74, 77, 201, 0.22)",
  shadowHighlight: "0 4px 14px rgba(255, 114, 18, 0.25)",

  // Button heights
  btnHeight: 40,
  btnPaddingX: 24,
};

// ==================== KEYFRAMES ====================

const keyframes = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

    @keyframes popIn {
        0% { transform: scale(0); opacity: 0; }
        60% { transform: scale(1.12); }
        100% { transform: scale(1); opacity: 1; }
    }

    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes pulseGlow {
        0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.35); }
        50% { transform: scale(1.07); box-shadow: 0 0 14px 3px rgba(239, 68, 68, 0.2); }
    }

    @keyframes ruleCardIn {
        0% { opacity: 0; transform: translateY(24px) scale(0.92); }
        60% { transform: translateY(-3px) scale(1.01); }
        100% { opacity: 1; transform: translateY(0) scale(1); }
    }

    @keyframes dotPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.25); }
    }

    @keyframes floatBadge {
        0% { opacity: 0; transform: translateY(10px) scale(0.85); }
        60% { transform: translateY(-2px) scale(1.03); }
        100% { opacity: 1; transform: translateY(0) scale(1); }
    }

    @keyframes zeroPairSlide {
        from { opacity: 0; transform: translateX(-24px); }
        to { opacity: 1; transform: translateX(0); }
    }

    @keyframes bracketFade {
        from { opacity: 0; transform: scaleY(0.5); }
        to { opacity: 1; transform: scaleY(1); }
    }

    @keyframes stepEnter {
        from { opacity: 0; transform: translateX(16px); }
        to { opacity: 1; transform: translateX(0); }
    }
`;

// ==================== DEFAULT STEPS ====================

const createSteps = (
  minuend: number,
  subtrahend: number,
): StepDataInterface[] => {
  const zeroPairsNeeded = subtrahend - minuend;
  const result = minuend - subtrahend;

  return [
    {
      id: 1,
      title: "Place the Starting Tokens",
      description: `We want to find ${minuend} − ${subtrahend}. First, let's place ${minuend} green (+1) tokens on the mat. Each green token represents +1.`,
      teachingNote: `Ask: 'How many tokens do we have, and how many do we need to remove?' — let students notice the shortfall.`,
      studentInstruction: `Count the green tokens appearing on the mat. You should see ${minuend} green tokens, each worth +1.`,
      type: "explanation",
      mode: "learn",
      data: { phase: "place" },
    },
    {
      id: 2,
      title: "Add Zero Pairs",
      description: `We need to remove ${subtrahend} positives, but we only have ${minuend}! We're short by ${zeroPairsNeeded}. So we add ${zeroPairsNeeded} zero pairs. A zero pair is one green (+1) and one red (−1) token — together they equal 0.`,
      teachingNote: `Ask: 'What is a zero pair and why does adding one not change the total?' — pause for discussion.`,
      studentInstruction: `Predict: why do we add zero pairs instead of just removing tokens? Watch the pairs slide in — each sums to 0.`,
      type: "explanation",
      mode: "learn",
      data: { phase: "zeroPairs" },
    },
    {
      id: 3,
      title: `Remove ${subtrahend} Green Tokens`,
      description: `Now we have ${subtrahend} green tokens total (${minuend} original + ${zeroPairsNeeded} from zero pairs). We can finally remove all ${subtrahend} green tokens!`,
      teachingNote: `Demonstrate the removal visually. Ask students to count what remains.`,
      studentInstruction: `See the removal happen — ${subtrahend} green tokens fade out with ✕ marks. What's left?`,
      type: "explanation",
      mode: "learn",
      data: { phase: "remove" },
    },
    {
      id: 4,
      title: "Count What Remains",
      description: `After removing all ${subtrahend} green tokens, only ${Math.abs(result)} red tokens remain. Each red token is −1, so the answer is ${result}.`,
      teachingNote: `Ask students to read the result before revealing it.`,
      studentInstruction: `Count the remaining red tokens. How many? What integer does that represent?`,
      type: "explanation",
      mode: "learn",
      data: { phase: "result" },
    },
    {
      id: 5,
      title: "The Additive Inverse Rule",
      description: `We've shown that ${minuend} − ${subtrahend} = ${result}. This is the same as ${minuend} + (−${subtrahend}) = ${result}. Subtracting a number equals adding its additive inverse!`,
      teachingNote: `Connect to the rule: a − b = a + (−b). Then ask: 'What is 4 − (−12)?' (Answer: 4 + 12 = 16)`,
      studentInstruction: `State the general rule in your own words before reading it. Why is subtracting b the same as adding −b?`,
      type: "explanation",
      mode: "learn",
      data: { phase: "rule" },
    },
  ];
};

// ==================== TOKEN COMPONENT ====================

const Token: React.FC<{
  type: "positive" | "negative";
  index: number;
  animDelay: number;
  animation: string;
  removed?: boolean;
  size?: number;
  showLabel?: boolean;
}> = ({
  type,
  index,
  animDelay,
  animation,
  removed = false,
  size = 50,
  showLabel = false,
}) => {
  const isPositive = type === "positive";
  const bg = isPositive ? DS.tokenGreen : DS.tokenRed;
  const bgDark = isPositive ? DS.tokenGreenDark : DS.tokenRedDark;
  const symbol = isPositive ? "+" : "−";

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle at 36% 36%, ${bg}, ${bgDark})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: DS.white,
        fontFamily: DS.fontFamily,
        fontSize: size * 0.4,
        fontWeight: 700,
        boxShadow: `0 3px 10px ${isPositive ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}, inset 0 2px 4px rgba(255,255,255,0.3)`,
        animation: `${animation} 0.4s ease-out ${animDelay}s both`,
        opacity: removed ? 0.12 : 1,
        transform: removed ? "scale(0.82)" : "scale(1)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
        cursor: "default",
        userSelect: "none",
      }}
    >
      {symbol}
      {removed && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: size * 0.5,
            color: DS.gray900,
            fontWeight: 800,
            opacity: 0.6,
          }}
        >
          ✕
        </div>
      )}
      {showLabel && (
        <div
          style={{
            position: "absolute",
            bottom: -17,
            fontSize: 10,
            color: DS.gray900,
            fontFamily: DS.fontFamily,
            fontWeight: 600,
            whiteSpace: "nowrap",
            opacity: 0.55,
          }}
        >
          {isPositive ? "+1" : "−1"}
        </div>
      )}
    </div>
  );
};

// ==================== ZERO PAIR COMPONENT ====================

const ZeroPair: React.FC<{
  index: number;
  animDelay: number;
  size?: number;
}> = ({ index, animDelay, size = 48 }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 3,
      animation: `zeroPairSlide 0.45s ease-out ${animDelay}s both`,
    }}
  >
    <div
      style={{
        display: "flex",
        gap: 4,
        alignItems: "center",
        position: "relative",
      }}
    >
      <Token
        type="positive"
        index={index * 2}
        animDelay={animDelay}
        animation="popIn"
        size={size}
      />
      <Token
        type="negative"
        index={index * 2 + 1}
        animDelay={animDelay + 0.08}
        animation="popIn"
        size={size}
      />
      <div
        style={{
          position: "absolute",
          bottom: -20,
          left: "50%",
          transform: "translateX(-50%)",
          animation: `bracketFade 0.3s ease-out ${animDelay + 0.2}s both`,
        }}
      >
        <div
          style={{
            fontSize: 9,
            color: DS.secondary,
            fontFamily: DS.fontFamily,
            fontWeight: 700,
            background: DS.primaryGhost,
            padding: "1px 7px",
            borderRadius: DS.radiusPill,
            border: `1px solid ${DS.primaryLight}`,
            whiteSpace: "nowrap",
          }}
        >
          = 0
        </div>
      </div>
    </div>
  </div>
);

// ==================== MAIN COMPONENT ====================

type PropsShape = NonNullable<TokenModelSubtractionToolProps["props"]>;

const TokenModelSubtractionTool: React.FC<TokenModelSubtractionToolProps> = ({
  props = {} as PropsShape,
  setStepDetails,
}) => {
  const config = useMemo(
    () => ({
      width: props.width ?? 800,
      height: props.height ?? 600,
      animationSpeed: props.animationSpeed ?? 1,
      showNavigation: props.showNavigation ?? true,
      showStepIndicator: props.showStepIndicator ?? true,
    }),
    [props],
  );

  const additionalProps = props.additionalProps || {};
  const minuend = additionalProps.minuend ?? 7;
  const subtrahend = additionalProps.subtrahend ?? 18;
  const zeroPairsNeeded = subtrahend - minuend;
  const result = minuend - subtrahend;

  const steps = useMemo(
    () => createSteps(minuend, subtrahend),
    [minuend, subtrahend],
  );
  const totalSteps = steps.length;

  const [currentStep, setCurrentStep] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [pressedBtn, setPressedBtn] = useState<string | null>(null);

  // Inject keyframes
  useEffect(() => {
    const id = "token-model-singularity-kf";
    if (!document.getElementById(id)) {
      const style = document.createElement("style");
      style.id = id;
      style.textContent = keyframes;
      document.head.appendChild(style);
    }
    return () => {
      const el = document.getElementById(id);
      if (el) document.head.removeChild(el);
    };
  }, []);

  useEffect(() => {
    if (setStepDetails) {
      setStepDetails({
        currentStep: currentStep + 1,
        totalSteps,
        isPaused: true,
        currentMode: "learn",
      });
    }
  }, [currentStep, totalSteps, setStepDetails]);

  const goNext = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((p) => p + 1);
      setAnimKey((p) => p + 1);
    }
  }, [currentStep, totalSteps]);

  const goPrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((p) => p - 1);
      setAnimKey((p) => p + 1);
    }
  }, [currentStep]);

  const goReset = useCallback(() => {
    setCurrentStep(0);
    setAnimKey((p) => p + 1);
  }, []);

  const isCompact = config.width < 520;
  const tokenSize = isCompact ? 36 : config.width < 660 ? 44 : 50;
  const tokensPerRow = isCompact ? 6 : config.width < 660 ? 8 : 9;

  // ─── SINGULARITY BUTTON STYLES ───
  const btnStyle = (
    variant: "contained" | "outlined" | "text",
    id: string,
    disabled = false,
  ): React.CSSProperties => {
    const isHov = hoveredBtn === id && !disabled;
    const isPress = pressedBtn === id && !disabled;
    const base: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      height: DS.btnHeight,
      padding: `0 ${DS.btnPaddingX}px`,
      borderRadius: DS.radiusPill,
      fontFamily: DS.fontFamily,
      fontWeight: 600,
      fontSize: 14,
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
      border: "none",
      outline: "none",
      userSelect: "none",
      whiteSpace: "nowrap",
    };
    if (variant === "contained")
      return {
        ...base,
        background: disabled
          ? DS.gray300
          : isPress
            ? DS.primaryDark
            : isHov
              ? DS.highlight
              : DS.primary,
        color: disabled ? DS.gray500 : DS.white,
        boxShadow: disabled
          ? "none"
          : isHov
            ? DS.shadowHighlight
            : DS.shadowBtn,
        transform: isPress ? "scale(0.96)" : isHov ? "scale(1.03)" : "scale(1)",
      };
    if (variant === "outlined")
      return {
        ...base,
        background: disabled
          ? DS.gray100
          : isPress
            ? DS.primaryGhost
            : isHov
              ? DS.primaryGhost
              : DS.white,
        color: disabled ? DS.gray500 : isHov ? DS.highlight : DS.primary,
        border: `2px solid ${disabled ? DS.gray300 : isHov ? DS.highlight : DS.primary}`,
        transform: isPress ? "scale(0.96)" : "scale(1)",
      };
    return {
      ...base,
      background: "transparent",
      color: disabled ? DS.gray500 : isHov ? DS.highlight : DS.primary,
      textDecoration: isHov ? "underline" : "none",
      padding: "0 12px",
      transform: isPress ? "scale(0.96)" : "scale(1)",
    };
  };

  // ─── RENDER WORKSPACE ───
  const renderWorkspace = () => {
    const phase = steps[currentStep].data?.phase;
    let greenTokens: { key: string; removed: boolean }[] = [];
    let redTokens: { key: string }[] = [];
    let zeroPairsList: { key: string }[] = [];

    if (phase === "place") {
      for (let i = 0; i < minuend; i++)
        greenTokens.push({ key: `g${i}`, removed: false });
    } else if (phase === "zeroPairs") {
      for (let i = 0; i < minuend; i++)
        greenTokens.push({ key: `g${i}`, removed: false });
      for (let i = 0; i < zeroPairsNeeded; i++)
        zeroPairsList.push({ key: `zp${i}` });
    } else if (phase === "remove") {
      for (let i = 0; i < subtrahend; i++)
        greenTokens.push({ key: `gr${i}`, removed: true });
      for (let i = 0; i < zeroPairsNeeded; i++)
        redTokens.push({ key: `rr${i}` });
    } else if (phase === "result") {
      for (let i = 0; i < Math.abs(result); i++)
        redTokens.push({ key: `res${i}` });
    }

    return (
      <div
        key={animKey}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px 16px",
          minHeight: 200,
        }}
      >
        {phase === "place" && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              justifyContent: "center",
              maxWidth: tokensPerRow * (tokenSize + 10),
              animation: "fadeIn 0.3s ease-out",
            }}
          >
            {greenTokens.map((t, i) => (
              <Token
                key={t.key}
                type="positive"
                index={i}
                animDelay={i * 0.09}
                animation="popIn"
                size={tokenSize}
                showLabel={i === 0}
              />
            ))}
          </div>
        )}

        {phase === "zeroPairs" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 28,
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontFamily: DS.fontFamily,
                  fontWeight: 700,
                  color: DS.tokenGreenDark,
                  marginBottom: 8,
                  textAlign: "center",
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  animation: "fadeIn 0.3s ease-out",
                }}
              >
                Original {minuend} green tokens
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 7,
                  justifyContent: "center",
                  maxWidth: tokensPerRow * (tokenSize - 2 + 7),
                }}
              >
                {greenTokens.map((t, i) => (
                  <Token
                    key={t.key}
                    type="positive"
                    index={i}
                    animDelay={0}
                    animation="fadeIn"
                    size={tokenSize - 4}
                  />
                ))}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontFamily: DS.fontFamily,
                  fontWeight: 700,
                  color: DS.secondary,
                  marginBottom: 12,
                  textAlign: "center",
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  animation: "fadeIn 0.4s ease-out 0.15s both",
                }}
              >
                + {zeroPairsNeeded} zero pairs (total change = 0)
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 14,
                  justifyContent: "center",
                }}
              >
                {zeroPairsList.map((zp, i) => (
                  <ZeroPair
                    key={zp.key}
                    index={i}
                    animDelay={0.25 + i * 0.09}
                    size={tokenSize - 6}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {phase === "remove" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontFamily: DS.fontFamily,
                fontWeight: 700,
                color: DS.tokenRedDark,
                textAlign: "center",
                textTransform: "uppercase",
                letterSpacing: 0.8,
                animation: "fadeIn 0.3s ease-out",
              }}
            >
              Removing {subtrahend} green tokens ✕
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 7,
                justifyContent: "center",
                maxWidth: tokensPerRow * (tokenSize + 7),
              }}
            >
              {greenTokens.map((t, i) => (
                <Token
                  key={t.key}
                  type="positive"
                  index={i}
                  animDelay={i * 0.03}
                  animation="fadeIn"
                  removed
                  size={tokenSize - 4}
                />
              ))}
            </div>
            <div
              style={{
                width: "60%",
                height: 1,
                background: `linear-gradient(90deg, transparent, ${DS.gray300}, transparent)`,
                margin: "4px 0",
              }}
            />
            <div
              style={{
                fontSize: 11,
                fontFamily: DS.fontFamily,
                fontWeight: 700,
                color: DS.tokenRedDark,
                textAlign: "center",
                textTransform: "uppercase",
                letterSpacing: 0.8,
                animation: "fadeIn 0.4s ease-out 0.4s both",
              }}
            >
              Red tokens remaining ↓
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                justifyContent: "center",
                maxWidth: tokensPerRow * (tokenSize + 8),
              }}
            >
              {redTokens.map((t, i) => (
                <Token
                  key={t.key}
                  type="negative"
                  index={i}
                  animDelay={0.55 + i * 0.05}
                  animation="popIn"
                  size={tokenSize - 4}
                />
              ))}
            </div>
          </div>
        )}

        {phase === "result" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 22,
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                justifyContent: "center",
                maxWidth: tokensPerRow * (tokenSize + 10),
              }}
            >
              {redTokens.map((t, i) => (
                <div
                  key={t.key}
                  style={{
                    animation: `pulseGlow 1.1s ease-in-out ${0.1 + i * 0.04}s 1`,
                  }}
                >
                  <Token
                    type="negative"
                    index={i}
                    animDelay={i * 0.05}
                    animation="popIn"
                    size={tokenSize}
                    showLabel={i === 0}
                  />
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: `linear-gradient(135deg, ${DS.highlightLight}, #fff8f0)`,
                border: `2px solid ${DS.highlight}`,
                borderRadius: DS.radiusPill,
                padding: "10px 32px",
                animation: "floatBadge 0.5s ease-out 0.5s both",
                boxShadow: DS.shadowHighlight,
              }}
            >
              <span
                style={{
                  fontFamily: DS.fontFamily,
                  fontSize: isCompact ? 22 : 28,
                  fontWeight: 800,
                  color: DS.highlightDark,
                }}
              >
                {minuend} − {subtrahend} = {result}
              </span>
            </div>
          </div>
        )}

        {phase === "rule" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 22,
              alignItems: "center",
              animation: "fadeIn 0.4s ease-out",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 14,
                alignItems: "center",
                flexWrap: "wrap",
                justifyContent: "center",
                animation: "fadeInUp 0.5s ease-out 0.1s both",
              }}
            >
              <div
                style={{
                  background: DS.primaryGhost,
                  border: `2px solid ${DS.primary}`,
                  borderRadius: DS.radiusPill,
                  padding: "8px 22px",
                  fontFamily: DS.fontFamily,
                  fontSize: isCompact ? 16 : 20,
                  fontWeight: 700,
                  color: DS.primary,
                }}
              >
                {minuend} − {subtrahend} = {result}
              </div>
              <span
                style={{
                  fontFamily: DS.fontFamily,
                  fontSize: 22,
                  fontWeight: 800,
                  color: DS.gray500,
                }}
              >
                ⟺
              </span>
              <div
                style={{
                  background: DS.highlightLight,
                  border: `2px solid ${DS.highlight}`,
                  borderRadius: DS.radiusPill,
                  padding: "8px 22px",
                  fontFamily: DS.fontFamily,
                  fontSize: isCompact ? 16 : 20,
                  fontWeight: 700,
                  color: DS.highlightDark,
                }}
              >
                {minuend} + (−{subtrahend}) = {result}
              </div>
            </div>
            <div
              style={{
                background: DS.white,
                border: `3px solid ${DS.primary}`,
                borderRadius: DS.radiusLg,
                padding: "22px 34px",
                textAlign: "center",
                animation: "ruleCardIn 0.6s ease-out 0.35s both",
                boxShadow: DS.shadowLg,
                maxWidth: 400,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: `linear-gradient(90deg, ${DS.primary}, ${DS.highlight})`,
                }}
              />
              <div
                style={{
                  fontFamily: DS.fontFamily,
                  fontWeight: 700,
                  fontSize: 11,
                  color: DS.secondary,
                  textTransform: "uppercase",
                  letterSpacing: 2.5,
                  marginBottom: 10,
                }}
              >
                General Rule
              </div>
              <div
                style={{
                  fontFamily: DS.fontFamily,
                  fontSize: isCompact ? 22 : 28,
                  fontWeight: 800,
                  color: DS.gray900,
                  lineHeight: 1.3,
                }}
              >
                Subtract <span style={{ color: DS.primary }}>b</span> = Add{" "}
                <span style={{ color: DS.highlight }}>−b</span>
              </div>
              <div
                style={{
                  fontFamily: DS.fontFamily,
                  fontSize: 13,
                  color: DS.gray500,
                  fontWeight: 600,
                  marginTop: 4,
                  fontStyle: "italic",
                }}
              >
                (additive inverse)
              </div>
              <div
                style={{
                  fontFamily: DS.fontFamily,
                  fontSize: isCompact ? 18 : 24,
                  fontWeight: 800,
                  color: DS.white,
                  marginTop: 14,
                  padding: "10px 24px",
                  background: `linear-gradient(135deg, ${DS.primary}, ${DS.secondary})`,
                  borderRadius: DS.radiusPill,
                  display: "inline-block",
                  boxShadow: DS.shadowBtn,
                }}
              >
                a − b = a + (−b)
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const step = steps[currentStep];

  // ─── MAIN RENDER ───
  return (
    <div
      style={{
        width: "100%",
        maxWidth: config.width,
        margin: "0 auto",
        fontFamily: DS.fontFamily,
        background: DS.white,
        borderRadius: DS.radiusLg,
        overflow: "hidden",
        boxShadow: DS.shadowLg,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ═══ HEADER ═══ */}
      <div
        style={{
          background: `linear-gradient(135deg, ${DS.primary} 0%, ${DS.secondary} 100%)`,
          padding: "18px 24px 14px",
          color: DS.white,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -30,
            right: 40,
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
          }}
        />
        <div>
          <div
            style={{
              fontWeight: 800,
              fontSize: isCompact ? 16 : 20,
              letterSpacing: 0.3,
              lineHeight: 1.2,
            }}
          >
            Token Model
          </div>
          <div
            style={{
              fontSize: 12,
              opacity: 0.75,
              fontWeight: 500,
              marginTop: 2,
            }}
          >
            Integer Subtraction
          </div>
        </div>
        <div
          style={{
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(8px)",
            borderRadius: DS.radiusPill,
            padding: "6px 18px",
            fontWeight: 700,
            fontSize: isCompact ? 14 : 18,
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          {minuend} − {subtrahend} = ?
        </div>
      </div>

      {/* ═══ STEP DOTS ═══ */}
      {config.showStepIndicator && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "14px 20px 8px",
            background: DS.gray100,
          }}
        >
          {steps.map((_, i) => (
            <div
              key={i}
              onClick={() => {
                setCurrentStep(i);
                setAnimKey((p) => p + 1);
              }}
              style={{
                width: i === currentStep ? 30 : 10,
                height: 10,
                borderRadius: DS.radiusPill,
                background:
                  i === currentStep
                    ? `linear-gradient(90deg, ${DS.primary}, ${DS.highlight})`
                    : i < currentStep
                      ? DS.primaryLight
                      : DS.gray300,
                cursor: "pointer",
                transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
                animation:
                  i === currentStep ? "dotPulse 0.35s ease-out" : "none",
              }}
            />
          ))}
          <span
            style={{
              fontSize: 12,
              color: DS.gray900,
              fontWeight: 600,
              marginLeft: 10,
              opacity: 0.6,
            }}
          >
            Step {currentStep + 1} of {totalSteps}
          </span>
        </div>
      )}

      {/* ═══ TITLE & DESCRIPTION ═══ */}
      <div
        key={`d-${animKey}`}
        style={{
          padding: "14px 24px",
          background: DS.white,
          borderBottom: `1px solid ${DS.gray300}`,
          animation: "stepEnter 0.35s ease-out",
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: isCompact ? 15 : 18,
            color: DS.gray900,
            marginBottom: 6,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${DS.primary}, ${DS.secondary})`,
              color: DS.white,
              fontSize: 13,
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            {currentStep + 1}
          </span>
          {step.title}
        </div>
        <div
          style={{
            fontSize: 13,
            color: DS.gray900,
            lineHeight: 1.6,
            fontWeight: 500,
            opacity: 0.75,
            paddingLeft: 34,
          }}
        >
          {step.description}
        </div>
      </div>

      {/* ═══ STUDENT TIP BAR ═══ */}
      <div
        key={`i-${animKey}`}
        style={{
          padding: "8px 24px",
          background: DS.highlightLight,
          borderBottom: `1px solid ${DS.highlightMid}33`,
          fontSize: 12,
          color: DS.highlightDark,
          fontWeight: 600,
          display: "flex",
          alignItems: "flex-start",
          gap: 8,
          animation: "fadeIn 0.4s ease-out 0.08s both",
        }}
      >
        <span
          style={{
            background: DS.highlight,
            color: DS.white,
            borderRadius: DS.radiusPill,
            padding: "1px 8px",
            fontSize: 10,
            fontWeight: 700,
            flexShrink: 0,
            marginTop: 1,
          }}
        >
          TIP
        </span>
        <span>{step.studentInstruction}</span>
      </div>

      {/* ═══ WORKSPACE ═══ */}
      <div
        style={{
          flex: 1,
          border: `2px solid ${DS.primaryLight}`,
          borderRadius: DS.radiusMd,
          margin: "14px 18px",
          minHeight: 220,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          background: `
                    radial-gradient(circle at 10% 90%, ${DS.primaryGhost} 0%, transparent 50%),
                    radial-gradient(circle at 90% 10%, ${DS.highlightLight}66 0%, transparent 50%),
                    repeating-linear-gradient(0deg, transparent, transparent 23px, ${DS.gray300}33 23px, ${DS.gray300}33 24px),
                    repeating-linear-gradient(90deg, transparent, transparent 23px, ${DS.gray300}33 23px, ${DS.gray300}33 24px)
                `,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 14,
            fontSize: 10,
            color: DS.primary,
            fontWeight: 700,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            opacity: 0.35,
          }}
        >
          Activity Mat
        </div>
        {renderWorkspace()}
      </div>

      {/* ═══ NAVIGATION ═══ */}
      {config.showNavigation && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 18px 18px",
            gap: 10,
          }}
        >
          <button
            onClick={goPrev}
            disabled={currentStep === 0}
            onMouseEnter={() => setHoveredBtn("prev")}
            onMouseLeave={() => setHoveredBtn(null)}
            onMouseDown={() => setPressedBtn("prev")}
            onMouseUp={() => setPressedBtn(null)}
            style={btnStyle("outlined", "prev", currentStep === 0)}
          >
            <ChevronLeft size={16} /> Previous
          </button>
          <button
            onClick={goReset}
            onMouseEnter={() => setHoveredBtn("reset")}
            onMouseLeave={() => setHoveredBtn(null)}
            onMouseDown={() => setPressedBtn("reset")}
            onMouseUp={() => setPressedBtn(null)}
            style={btnStyle("text", "reset")}
          >
            <RotateCcw size={14} /> Reset
          </button>
          <button
            onClick={goNext}
            disabled={currentStep === totalSteps - 1}
            onMouseEnter={() => setHoveredBtn("next")}
            onMouseLeave={() => setHoveredBtn(null)}
            onMouseDown={() => setPressedBtn("next")}
            onMouseUp={() => setPressedBtn(null)}
            style={btnStyle(
              "contained",
              "next",
              currentStep === totalSteps - 1,
            )}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default TokenModelSubtractionTool;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════
