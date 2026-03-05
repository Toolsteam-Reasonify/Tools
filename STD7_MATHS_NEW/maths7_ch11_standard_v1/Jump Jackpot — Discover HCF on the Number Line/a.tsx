// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: jump_jackpot_hcf_tool.tsx
// Redesigned with Singularity Design System
// ═══════════════════════════════════════════════════════════════════════════
// @ts-nocheck — Module resolution for 'react' and 'lucide-react' when used in host app

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { ChevronLeft, ChevronRight, RotateCcw, Plus } from "lucide-react";

// ==================== TYPE DEFINITIONS ====================

type ModeType = "learn" | "practice" | "explore";

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
  type: "intro" | "explanation" | "trial" | "reveal";
  mode: ModeType;
  data?: any;
}

interface JumpJackpotAdditionalProps {
  treasureA?: number;
  treasureB?: number;
  numberLineMax?: number;
  jumpTrials?: { jumpSize: number; label?: string }[];
  frogEmoji?: string;
  treasureEmoji?: string;
  showFactorExplanation?: boolean;
}

interface JumpJackpotHCFToolProps {
  props?: {
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
    additionalProps?: JumpJackpotAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== EASING HELPERS ====================

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
const easeOutBounce = (t: number): number => {
  const n1 = 7.5625,
    d1 = 2.75;
  if (t < 1 / d1) return n1 * t * t;
  if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
  if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
  return n1 * (t -= 2.625 / d1) * t + 0.984375;
};

// ==================== HELPER: GCD ====================
function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

// ==================== SINGULARITY DESIGN TOKENS ====================

const DS = {
  // Primary palette
  primary: "#4A4DC9",
  primaryHover: "#533086",
  primaryPressed: "#3a3da0",
  highlight: "#FF7212",
  highlightHover: "#FC9145",
  // Light fills
  primaryLight: "#C1C1EA",
  highlightLight: "#FFF3E4",
  // Grays
  gray900: "#4E4E4E",
  gray400: "#CACACA",
  gray200: "#EBEBEB",
  gray100: "#F5F5F5",
  white: "#FFFFFF",
  // Semantic
  success: "#2ECC71",
  successLight: "#E8F8EF",
  error: "#E74C3C",
  errorLight: "#FDEDEC",
  // Typography
  fontFamily: "'Poppins', sans-serif",
  // Spacing
  buttonHeight: 40,
  buttonPaddingX: 24,
  buttonRadius: 20,
  cardRadius: 16,
  // Shadows
  shadowSm: "0 2px 8px rgba(74, 77, 201, 0.08)",
  shadowMd: "0 4px 20px rgba(74, 77, 201, 0.12)",
  shadowLg: "0 8px 32px rgba(74, 77, 201, 0.16)",
  shadowHighlight: "0 4px 16px rgba(255, 114, 18, 0.25)",
};

// ==================== DEFAULT STEPS BUILDER ====================

const buildDefaultSteps = (
  treasureA: number,
  treasureB: number,
  trials: { jumpSize: number; label?: string }[],
): StepDataInterface[] => {
  const hcf = gcd(treasureA, treasureB);
  const steps: StepDataInterface[] = [
    {
      id: 1,
      title: "Welcome to Jump Jackpot!",
      description: `Grumpy has placed treasures at positions ${treasureA} and ${treasureB} on the number line. Jumpy the frog starts at 0 and must choose a jump size. Can Jumpy land on BOTH treasures with the same jump size?`,
      type: "intro",
      mode: "learn",
      data: { phase: "intro" },
    },
  ];

  trials.forEach((trial, idx) => {
    const hitsA = treasureA % trial.jumpSize === 0;
    const hitsB = treasureB % trial.jumpSize === 0;
    const hitsBoth = hitsA && hitsB;
    steps.push({
      id: 10 + idx,
      title: `Try Jump Size = ${trial.jumpSize}`,
      description: hitsBoth
        ? `Jump size ${trial.jumpSize} lands on BOTH ${treasureA} and ${treasureB}! Since ${treasureA} ÷ ${trial.jumpSize} = ${treasureA / trial.jumpSize} and ${treasureB} ÷ ${trial.jumpSize} = ${treasureB / trial.jumpSize}, the jump size ${trial.jumpSize} is a common factor of both numbers.`
        : hitsA
          ? `Jump size ${trial.jumpSize} hits ${treasureA} but misses ${treasureB}. Since ${treasureB} is not a multiple of ${trial.jumpSize} (${treasureB} ÷ ${trial.jumpSize} = ${(treasureB / trial.jumpSize).toFixed(1)}), Jumpy skips right over it!`
          : hitsB
            ? `Jump size ${trial.jumpSize} hits ${treasureB} but misses ${treasureA}. Since ${treasureA} is not a multiple of ${trial.jumpSize} (${treasureA} ÷ ${trial.jumpSize} = ${(treasureA / trial.jumpSize).toFixed(1)}), the treasure at ${treasureA} is missed!`
            : `Jump size ${trial.jumpSize} misses both treasures! Neither ${treasureA} nor ${treasureB} is a multiple of ${trial.jumpSize}.`,
      type: "trial",
      mode: "learn",
      data: {
        phase: "trial",
        jumpSize: trial.jumpSize,
        hitsA,
        hitsB,
        hitsBoth,
      },
    });
  });

  steps.push({
    id: 100,
    title: `The Longest Jump = HCF(${treasureA}, ${treasureB})`,
    description: `The longest jump size that lands on BOTH treasures is ${hcf}. This is the Highest Common Factor (HCF) of ${treasureA} and ${treasureB}! The jump size MUST be a common factor because Jumpy can only land on multiples of the jump size — so both treasure positions must be multiples of the chosen jump.`,
    type: "reveal",
    mode: "learn",
    data: { phase: "reveal", hcf },
  });

  return steps;
};

// ==================== MAIN COMPONENT ====================

type ResolvedProps = NonNullable<JumpJackpotHCFToolProps["props"]>;

const JumpJackpotHCFTool: React.FC<JumpJackpotHCFToolProps> = ({
  props: propsIn,
  setStepDetails,
  stopAutoNext,
  setStopAutoNext,
}) => {
  const props: ResolvedProps = propsIn ?? {};

  // ── CONFIGURATION ──
  const config = useMemo(
    () => ({
      width: props.width ?? 800,
      height: props.height ?? 600,
      initialMode: (props.initialMode ?? "learn") as ModeType,
      showModeSelector: props.showModeSelector ?? false,
      showNavigation: props.showNavigation ?? true,
      showPlayPause: props.showPlayPause ?? true,
      showStepIndicator: props.showStepIndicator ?? true,
      animationSpeed: props.animationSpeed ?? 1,
      autoPlayDuration: props.autoPlayDuration ?? 0,
      themeColor: props.themeColor ?? DS.primary,
      darkMode: props.darkMode ?? false,
    }),
    [props],
  );

  const ap = props.additionalProps || {};
  const treasureA = ap.treasureA ?? 14;
  const treasureB = ap.treasureB ?? 30;
  const numberLineMax = ap.numberLineMax ?? Math.max(treasureA, treasureB) + 5;
  const defaultTrials = [
    { jumpSize: 7 },
    { jumpSize: 3 },
    { jumpSize: 2 },
    { jumpSize: 1 },
  ];
  const trials = ap.jumpTrials ?? defaultTrials;
  const hcfValue = gcd(treasureA, treasureB);

  const allSteps = useMemo(
    () => buildDefaultSteps(treasureA, treasureB, trials),
    [treasureA, treasureB, trials],
  );

  // ── STATE ──
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [jumpPositions, setJumpPositions] = useState<number[]>([]);
  const [frogPos, setFrogPos] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [animPhase, setAnimPhase] = useState<"idle" | "jumping" | "done">(
    "idle",
  );
  const [verdictRows, setVerdictRows] = useState<
    { jumpSize: number; hitsA: boolean; hitsB: boolean; hitsBoth: boolean }[]
  >([]);
  const [showReveal, setShowReveal] = useState(false);
  const [frogBounce, setFrogBounce] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [pressedBtn, setPressedBtn] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const currentStep = allSteps[currentStepIndex];

  // ── INJECT KEYFRAMES + FONT ──
  useEffect(() => {
    const keyframes = `
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

            @keyframes jj-fadeInUp {
                from { opacity: 0; transform: translateY(24px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes jj-popIn {
                0% { transform: scale(0); opacity: 0; }
                60% { transform: scale(1.15); opacity: 1; }
                100% { transform: scale(1); opacity: 1; }
            }
            @keyframes jj-frogHop {
                0% { transform: translateY(0) scaleY(1); }
                18% { transform: translateY(0) scaleY(0.78) scaleX(1.18); }
                42% { transform: translateY(-40px) scaleY(1.12) scaleX(0.92); }
                68% { transform: translateY(-46px) scaleY(1.16) scaleX(0.88); }
                88% { transform: translateY(-6px) scaleY(0.92) scaleX(1.06); }
                100% { transform: translateY(0) scaleY(1) scaleX(1); }
            }
            @keyframes jj-pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.06); }
            }
            @keyframes jj-bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
            @keyframes jj-slideInRight {
                from { opacity: 0; transform: translateX(32px); }
                to { opacity: 1; transform: translateX(0); }
            }
            @keyframes jj-treasureGlow {
                0%, 100% { filter: drop-shadow(0 0 3px ${DS.highlight}50); }
                50% { filter: drop-shadow(0 0 12px ${DS.highlight}aa); }
            }
            @keyframes jj-revealBanner {
                0% { transform: scaleX(0); opacity: 0; }
                60% { transform: scaleX(1.04); opacity: 1; }
                100% { transform: scaleX(1); opacity: 1; }
            }
            @keyframes jj-dotPulse {
                0%, 100% { opacity: 0.3; transform: scale(1); }
                50% { opacity: 0.6; transform: scale(1.3); }
            }
        `;
    const style = document.createElement("style");
    style.id = "jj-hcf-keyframes";
    style.textContent = keyframes;
    document.head.appendChild(style);
    return () => {
      document.getElementById("jj-hcf-keyframes")?.remove();
    };
  }, []);

  // ── STEP DETAILS SYNC ──
  useEffect(() => {
    setStepDetails?.({
      currentStep: currentStepIndex + 1,
      totalSteps: allSteps.length,
      isPaused: true,
      currentMode: config.initialMode,
    });
  }, [currentStepIndex, allSteps.length]);

  // ── ANIMATION RUNNER ──
  const runJumpAnimation = useCallback(
    (jumpSize: number) => {
      setAnimating(true);
      setAnimPhase("jumping");
      setFrogPos(0);
      setJumpPositions([]);

      const positions: number[] = [];
      for (let p = jumpSize; p <= numberLineMax; p += jumpSize) {
        positions.push(p);
      }

      let i = 0;
      const speed = 480 / config.animationSpeed;

      const doNextJump = () => {
        if (i < positions.length) {
          setFrogPos(positions[i]);
          setJumpPositions((prev) => [...prev, positions[i]]);
          setFrogBounce(true);
          setTimeout(() => setFrogBounce(false), 280);
          i++;
          timeoutRef.current = setTimeout(doNextJump, speed);
        } else {
          setAnimPhase("done");
          setAnimating(false);
        }
      };

      timeoutRef.current = setTimeout(doNextJump, 450);
    },
    [numberLineMax, config.animationSpeed],
  );

  // ── STEP CHANGE EFFECT ──
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setAnimPhase("idle");
    setFrogPos(0);
    setJumpPositions([]);
    setFrogBounce(false);
    setShowReveal(false);

    const step = allSteps[currentStepIndex];
    if (step.data?.phase === "trial") {
      setTimeout(() => runJumpAnimation(step.data.jumpSize), 550);
    }
    if (step.data?.phase === "reveal") {
      setTimeout(() => setShowReveal(true), 350);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentStepIndex]);

  // ── VERDICT TABLE BUILDER ──
  useEffect(() => {
    const step = allSteps[currentStepIndex];
    if (step.data?.phase === "trial" && animPhase === "done") {
      const { jumpSize, hitsA, hitsB, hitsBoth } = step.data;
      setVerdictRows((prev) => {
        if (prev.find((r) => r.jumpSize === jumpSize)) return prev;
        return [...prev, { jumpSize, hitsA, hitsB, hitsBoth }];
      });
    }
  }, [animPhase, currentStepIndex]);

  // ── NAVIGATION ──
  const goNext = () => {
    if (currentStepIndex < allSteps.length - 1 && !animating) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };
  const goPrev = () => {
    if (currentStepIndex > 0 && !animating) {
      setCurrentStepIndex((prev) => prev - 1);
      setVerdictRows((prev) => prev.slice(0, -1));
    }
  };
  const reset = () => {
    setCurrentStepIndex(0);
    setVerdictRows([]);
    setAnimPhase("idle");
    setFrogPos(0);
    setJumpPositions([]);
    setShowReveal(false);
  };

  // ── NUMBER LINE GEOMETRY ──
  const NL_PADDING = 52;
  const nlWidth = config.width - NL_PADDING * 2;
  const posToX = (pos: number) => NL_PADDING + (pos / numberLineMax) * nlWidth;
  const nlY = 130;

  // ── SINGULARITY BUTTON COMPONENT ──
  const SButton = ({
    id,
    label,
    onClick,
    variant = "contained",
    disabled = false,
    iconLeft,
    iconRight,
    compact = false,
    invertText = false,
  }: {
    id: string;
    label: string;
    onClick: () => void;
    variant?: "contained" | "outlined" | "highlight" | "text";
    disabled?: boolean;
    iconLeft?: React.ReactNode;
    iconRight?: React.ReactNode;
    compact?: boolean;
    invertText?: boolean;
  }) => {
    const isHov = hoveredBtn === id && !disabled;
    const isPress = pressedBtn === id && !disabled;

    let bg = DS.primary;
    let color = DS.white;
    let border = "none";
    let shadow = "none";

    if (variant === "contained") {
      bg = disabled
        ? DS.gray200
        : isPress
          ? DS.primaryPressed
          : isHov
            ? DS.primaryHover
            : DS.primary;
      color = disabled ? DS.gray400 : DS.white;
      shadow = isHov && !disabled ? DS.shadowMd : DS.shadowSm;
    } else if (variant === "outlined") {
      bg = isPress
        ? `${DS.primaryLight}44`
        : isHov
          ? `${DS.primaryLight}22`
          : "transparent";
      color = disabled ? DS.gray400 : DS.primary;
      border = `2px solid ${disabled ? DS.gray200 : isHov ? DS.primaryHover : DS.primary}`;
    } else if (variant === "highlight") {
      bg = disabled
        ? DS.gray200
        : isPress
          ? "#e56510"
          : isHov
            ? DS.highlightHover
            : DS.highlight;
      color = disabled ? DS.gray400 : DS.white;
      shadow = isHov && !disabled ? DS.shadowHighlight : DS.shadowSm;
    } else if (variant === "text") {
      bg = isPress
        ? `${DS.primaryLight}33`
        : isHov
          ? `${DS.primaryLight}18`
          : "transparent";
      color = disabled
        ? DS.gray400
        : invertText
          ? "rgba(255,255,255,0.9)"
          : DS.primary;
    }

    return (
      <button
        onClick={disabled ? undefined : onClick}
        onMouseEnter={() => setHoveredBtn(id)}
        onMouseLeave={() => {
          setHoveredBtn(null);
          setPressedBtn(null);
        }}
        onMouseDown={() => setPressedBtn(id)}
        onMouseUp={() => setPressedBtn(null)}
        onTouchStart={() => setPressedBtn(id)}
        onTouchEnd={() => setPressedBtn(null)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          height: compact ? 34 : DS.buttonHeight,
          padding: `0 ${compact ? 14 : DS.buttonPaddingX}px`,
          borderRadius: DS.buttonRadius,
          border,
          background: bg,
          color,
          fontFamily: DS.fontFamily,
          fontWeight: 600,
          fontSize: compact ? 12 : 14,
          letterSpacing: "0.01em",
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all 0.22s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: isPress
            ? "scale(0.96)"
            : isHov
              ? "scale(1.02)"
              : "scale(1)",
          boxShadow: shadow,
          outline: "none",
          WebkitTapHighlightColor: "transparent",
          minWidth: 44,
        }}
      >
        {iconLeft}
        {label}
        {iconRight}
      </button>
    );
  };

  // ── RENDER: NUMBER LINE ──
  const renderNumberLine = () => {
    const ticks: React.ReactElement[] = [];
    for (let i = 0; i <= numberLineMax; i++) {
      const x = posToX(i);
      const isTreasure = i === treasureA || i === treasureB;
      const isJumped = jumpPositions.includes(i);
      const isHitTreasure = isTreasure && isJumped;

      ticks.push(
        <g key={i}>
          <line
            x1={x}
            y1={nlY - (i % 5 === 0 || isTreasure ? 10 : 6)}
            x2={x}
            y2={nlY + (i % 5 === 0 || isTreasure ? 10 : 6)}
            stroke={
              isTreasure ? DS.highlight : i % 5 === 0 ? DS.gray900 : DS.gray400
            }
            strokeWidth={isTreasure ? 2.5 : i % 5 === 0 ? 1.5 : 1}
          />
          {(i % 5 === 0 || isTreasure) && (
            <text
              x={x}
              y={nlY + 28}
              textAnchor="middle"
              fill={isTreasure ? DS.highlight : DS.gray900}
              fontFamily={DS.fontFamily}
              fontSize={isTreasure ? 13 : 10}
              fontWeight={isTreasure ? 700 : 500}
            >
              {i}
            </text>
          )}
          {isTreasure && (
            <g
              style={{ animation: "jj-treasureGlow 2.2s ease-in-out infinite" }}
            >
              <text
                x={x}
                y={nlY - 24}
                textAnchor="middle"
                fontSize={26}
                style={{
                  animation: `jj-bounce 2.4s ease-in-out infinite`,
                  animationDelay: i === treasureB ? "0.35s" : "0s",
                }}
              >
                🏆
              </text>
            </g>
          )}
          {isJumped && !isTreasure && (
            <circle
              cx={x}
              cy={nlY}
              r={5.5}
              fill={DS.error}
              opacity={0.8}
              style={{ animation: "jj-popIn 0.28s ease-out forwards" }}
            />
          )}
          {isHitTreasure && (
            <circle
              cx={x}
              cy={nlY}
              r={8}
              fill={DS.success}
              stroke={DS.white}
              strokeWidth={2.5}
              style={{ animation: "jj-popIn 0.32s ease-out forwards" }}
            />
          )}
        </g>,
      );
    }
    return ticks;
  };

  const renderFrog = () => {
    if (animPhase === "idle" && currentStep.data?.phase !== "intro")
      return null;
    const x = posToX(frogPos);
    return (
      <text
        x={x}
        y={nlY - 52}
        textAnchor="middle"
        fontSize={34}
        style={{
          transition: "x 0.32s cubic-bezier(0.34, 1.56, 0.64, 1)",
          animation: frogBounce ? "jj-frogHop 0.38s ease-out" : undefined,
        }}
      >
        🐸
      </text>
    );
  };

  const renderJumpArcs = () => {
    if (jumpPositions.length === 0) return null;
    const arcs: React.ReactElement[] = [];
    let prev = 0;
    for (const pos of jumpPositions) {
      const x1 = posToX(prev);
      const x2 = posToX(pos);
      const midX = (x1 + x2) / 2;
      const arcH = Math.min(38, (x2 - x1) * 0.45);
      const isTreasure = pos === treasureA || pos === treasureB;
      arcs.push(
        <path
          key={`arc-${prev}-${pos}`}
          d={`M ${x1} ${nlY - 8} Q ${midX} ${nlY - 8 - arcH} ${x2} ${nlY - 8}`}
          fill="none"
          stroke={isTreasure ? DS.success : DS.primary}
          strokeWidth={2}
          strokeDasharray="5 3"
          opacity={0.6}
          style={{ animation: "jj-fadeInUp 0.25s ease-out forwards" }}
        />,
      );
      prev = pos;
    }
    return <>{arcs}</>;
  };

  // ── RENDER: VERDICT TABLE ──
  const renderVerdictTable = () => {
    if (verdictRows.length === 0 && !showReveal) return null;
    return (
      <div
        style={{
          position: "absolute",
          right: 12,
          top: 8,
          background: DS.white,
          borderRadius: DS.cardRadius,
          padding: "14px 16px",
          boxShadow: DS.shadowMd,
          border: `1.5px solid ${DS.gray200}`,
          minWidth: 210,
          animation: "jj-slideInRight 0.45s ease-out",
          fontFamily: DS.fontFamily,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: DS.primary,
            marginBottom: 8,
            textAlign: "center",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          Verdict Table
        </div>
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}
        >
          <thead>
            <tr>
              {["Jump", `${treasureA}?`, `${treasureB}?`, "Both?"].map(
                (h, i) => (
                  <th
                    key={i}
                    style={{
                      padding: "5px 6px",
                      borderBottom: `2px solid ${DS.primary}18`,
                      color: DS.gray900,
                      fontWeight: 600,
                      fontSize: 10,
                      textTransform: "uppercase",
                      letterSpacing: "0.03em",
                    }}
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {verdictRows.map((row, i) => (
              <tr
                key={row.jumpSize}
                style={{
                  animation: `jj-fadeInUp 0.3s ease-out ${i * 0.08}s both`,
                }}
              >
                <td
                  style={{
                    padding: "6px",
                    textAlign: "center",
                    fontWeight: 700,
                    color: DS.primary,
                    background: i % 2 === 0 ? DS.gray100 : "transparent",
                    borderRadius: 6,
                  }}
                >
                  {row.jumpSize}
                </td>
                <td
                  style={{
                    padding: "6px",
                    textAlign: "center",
                    background: i % 2 === 0 ? DS.gray100 : "transparent",
                    borderRadius: 6,
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: row.hitsA ? DS.successLight : DS.errorLight,
                      color: row.hitsA ? DS.success : DS.error,
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {row.hitsA ? "✓" : "✗"}
                  </span>
                </td>
                <td
                  style={{
                    padding: "6px",
                    textAlign: "center",
                    background: i % 2 === 0 ? DS.gray100 : "transparent",
                    borderRadius: 6,
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: row.hitsB ? DS.successLight : DS.errorLight,
                      color: row.hitsB ? DS.success : DS.error,
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {row.hitsB ? "✓" : "✗"}
                  </span>
                </td>
                <td
                  style={{
                    padding: "6px",
                    textAlign: "center",
                    fontWeight: 700,
                    color: row.hitsBoth ? DS.success : DS.error,
                    background: i % 2 === 0 ? DS.gray100 : "transparent",
                    borderRadius: 6,
                  }}
                >
                  {row.hitsBoth ? "✓ Yes" : "✗ No"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showReveal && (
          <div
            style={{
              marginTop: 12,
              padding: "10px 14px",
              background: `linear-gradient(135deg, ${DS.highlightLight}, ${DS.primaryLight}44)`,
              borderRadius: 12,
              textAlign: "center",
              animation: "jj-revealBanner 0.55s ease-out forwards",
              border: `2px solid ${DS.highlight}55`,
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: DS.gray900,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Longest Working Jump
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: DS.highlight,
                fontFamily: DS.fontFamily,
                marginTop: 2,
              }}
            >
              HCF = {hcfValue}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ── RENDER: STEP CONTENT ──
  const renderStepContent = () => {
    const step = currentStep;
    const isReveal = step.type === "reveal";
    const isTrial = step.data?.phase === "trial";

    return (
      <div
        key={currentStepIndex}
        style={{
          padding: "16px 24px 12px",
          animation: "jj-fadeInUp 0.35s ease-out",
          fontFamily: DS.fontFamily,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 6,
          }}
        >
          {/* Singularity-style step badge — circle/triangle/square shapes from design system */}
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: isReveal ? 4 : "50%",
              background: isReveal
                ? `linear-gradient(135deg, ${DS.highlight}, ${DS.highlightHover})`
                : `linear-gradient(135deg, ${DS.primary}, ${DS.primaryHover})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: DS.white,
              fontSize: 12,
              fontWeight: 700,
              fontFamily: DS.fontFamily,
              boxShadow: isReveal ? DS.shadowHighlight : DS.shadowSm,
              flexShrink: 0,
              transform: isReveal ? "rotate(0deg)" : "none",
            }}
          >
            {isReveal ? "★" : currentStepIndex + 1}
          </div>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: isReveal ? DS.highlight : DS.gray900,
              margin: 0,
              fontFamily: DS.fontFamily,
              lineHeight: 1.3,
            }}
          >
            {step.title}
          </h2>
        </div>
        <p
          style={{
            fontSize: 13,
            color: DS.gray900,
            lineHeight: 1.65,
            margin: 0,
            maxWidth:
              verdictRows.length > 0 ? config.width - 260 : config.width - 60,
            fontFamily: DS.fontFamily,
            fontWeight: 400,
          }}
        >
          {step.description}
        </p>
        {isTrial && animPhase === "jumping" && (
          <div
            style={{
              marginTop: 8,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              borderRadius: DS.buttonRadius,
              background: DS.primaryLight + "33",
              border: `1.5px solid ${DS.primary}22`,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: DS.primary,
                animation: "jj-pulse 1s ease-in-out infinite",
              }}
            />
            <span
              style={{
                fontSize: 12,
                color: DS.primary,
                fontWeight: 600,
                fontFamily: DS.fontFamily,
              }}
            >
              Jumpy is hopping with jump size {step.data.jumpSize}...
            </span>
          </div>
        )}
        {isTrial && animPhase === "done" && (
          <div
            style={{
              marginTop: 8,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              borderRadius: DS.buttonRadius,
              background: step.data.hitsBoth ? DS.successLight : DS.errorLight,
              border: `1.5px solid ${step.data.hitsBoth ? DS.success : DS.error}22`,
            }}
          >
            <span style={{ fontSize: 14 }}>
              {step.data.hitsBoth ? "🎯" : "💨"}
            </span>
            <span
              style={{
                fontSize: 12,
                color: step.data.hitsBoth ? DS.success : DS.error,
                fontWeight: 600,
                fontFamily: DS.fontFamily,
              }}
            >
              {step.data.hitsBoth
                ? "Hits both treasures!"
                : "Missed at least one treasure"}
            </span>
          </div>
        )}
      </div>
    );
  };

  // ══════════════════════════════════════════
  // MAIN RENDER
  // ══════════════════════════════════════════
  return (
    <div
      style={{
        width: config.width,
        height: config.height,
        background: DS.white,
        borderRadius: DS.cardRadius + 8,
        overflow: "hidden",
        position: "relative",
        fontFamily: DS.fontFamily,
        boxShadow: DS.shadowLg,
        border: `1px solid ${DS.gray200}`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── HEADER ── */}
      <div
        style={{
          padding: "0 24px",
          height: 56,
          background: `linear-gradient(135deg, ${DS.primary}, ${DS.primaryHover})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
            }}
          >
            🐸
          </div>
          <span
            style={{
              fontFamily: DS.fontFamily,
              fontSize: 17,
              fontWeight: 700,
              color: DS.white,
              letterSpacing: "-0.01em",
            }}
          >
            Jump Jackpot
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: "rgba(255,255,255,0.6)",
              marginLeft: 2,
            }}
          >
            HCF Discovery
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {config.showStepIndicator && (
            <div
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.8)",
                fontWeight: 600,
                background: "rgba(255,255,255,0.12)",
                padding: "5px 14px",
                borderRadius: DS.buttonRadius,
                fontFamily: DS.fontFamily,
              }}
            >
              {currentStepIndex + 1} / {allSteps.length}
            </div>
          )}
          <SButton
            id="reset"
            label="Reset"
            onClick={reset}
            variant="text"
            compact
            invertText
            iconLeft={<RotateCcw size={13} />}
          />
        </div>
      </div>

      {/* ── STEP CONTENT ── */}
      {renderStepContent()}

      {/* ── NUMBER LINE AREA ── */}
      <div
        style={{
          flex: 1,
          position: "relative",
          minHeight: 0,
          overflow: "visible",
        }}
      >
        <svg
          width={config.width}
          height={220}
          viewBox={`0 0 ${config.width} 220`}
          style={{ display: "block" }}
        >
          <defs>
            <linearGradient id="jj-lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={DS.primary} stopOpacity="0.06" />
              <stop offset="50%" stopColor={DS.highlight} stopOpacity="0.04" />
              <stop offset="100%" stopColor={DS.primary} stopOpacity="0.06" />
            </linearGradient>
          </defs>
          <rect
            x={NL_PADDING - 8}
            y={nlY - 30}
            width={nlWidth + 16}
            height={60}
            rx={12}
            fill="url(#jj-lineGrad)"
          />

          {/* Singularity-style decorative dots */}
          {[...Array(Math.floor(config.width / 50))].map((_, i) => (
            <circle
              key={`deco-${i}`}
              cx={25 + i * 50}
              cy={12}
              r={2.5}
              fill={i % 2 === 0 ? DS.primary : DS.highlight}
              opacity={0.18}
              style={{
                animation: `jj-dotPulse 3s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}

          {/* Main line */}
          <line
            x1={NL_PADDING}
            y1={nlY}
            x2={config.width - NL_PADDING}
            y2={nlY}
            stroke={DS.gray900}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
          <polygon
            points={`${config.width - NL_PADDING + 3},${nlY} ${config.width - NL_PADDING - 7},${nlY - 5} ${config.width - NL_PADDING - 7},${nlY + 5}`}
            fill={DS.gray900}
          />

          {renderJumpArcs()}
          {renderNumberLine()}
          {renderFrog()}

          <text
            x={NL_PADDING}
            y={nlY + 42}
            textAnchor="middle"
            fontSize={9}
            fill={DS.gray400}
            fontFamily={DS.fontFamily}
            fontWeight={600}
            letterSpacing="0.04em"
          >
            START
          </text>
        </svg>

        {renderVerdictTable()}

        {showReveal && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: 6,
              transform: "translateX(-50%)",
              display: "flex",
              gap: 10,
              animation: "jj-fadeInUp 0.5s ease-out 0.25s both",
            }}
          >
            {["🎉", "🪔", "✨", "🏆", "✨", "🪔", "🎉"].map((emoji, i) => (
              <span
                key={i}
                style={{
                  fontSize: 20,
                  animation: `jj-bounce 0.9s ease-in-out ${i * 0.12}s infinite`,
                }}
              >
                {emoji}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── NAVIGATION BAR ── */}
      {config.showNavigation && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            padding: "14px 24px",
            background: DS.gray100,
            borderTop: `1px solid ${DS.gray200}`,
            flexShrink: 0,
          }}
        >
          <SButton
            id="prev"
            label="Back"
            onClick={goPrev}
            variant="outlined"
            disabled={currentStepIndex === 0 || animating}
            iconLeft={<ChevronLeft size={16} />}
          />

          {/* Singularity step indicators — geometric shapes */}
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {allSteps.map((step, i) => {
              const isActive = i === currentStepIndex;
              const isDone = i < currentStepIndex;
              const isRevealStep = step.type === "reveal";
              return (
                <div
                  key={i}
                  style={{
                    width: isActive ? 28 : 10,
                    height: 10,
                    borderRadius: isRevealStep ? 2 : 5,
                    background: isActive
                      ? `linear-gradient(135deg, ${DS.primary}, ${DS.primaryHover})`
                      : isDone
                        ? DS.primaryLight
                        : DS.gray200,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    transform:
                      isRevealStep && isActive ? "rotate(45deg)" : "none",
                  }}
                />
              );
            })}
          </div>

          <SButton
            id="next"
            label="Next"
            onClick={goNext}
            variant={
              currentStepIndex === allSteps.length - 2
                ? "highlight"
                : "contained"
            }
            disabled={currentStepIndex === allSteps.length - 1 || animating}
            iconRight={<ChevronRight size={16} />}
          />
        </div>
      )}
    </div>
  );
};

export default JumpJackpotHCFTool;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════
