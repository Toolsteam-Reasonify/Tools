// @ts-nocheck
// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: counting_rhythms_tool.tsx
// Redesigned with Singularity Design System
// ═══════════════════════════════════════════════════════════════════════════════

// @ts-ignore - React may be provided by the host environment
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
// @ts-ignore - Icon library types may not be available
import { ChevronLeft, ChevronRight, RotateCcw, Music } from "lucide-react";

// ==================== TYPE DEFINITIONS ====================

type ModeType = "learn";

interface StepDetails {
  currentStep: number;
  totalSteps: number;
  isPaused: boolean;
  currentMode: ModeType;
}

interface RhythmPattern {
  beats: (1 | 2)[];
}

interface StepData {
  id: number;
  n: number;
  title: string;
  description: string;
  teachingNote: string;
  rhythms: RhythmPattern[];
  count: number;
  showPrediction?: boolean;
  showSplitDiagram?: boolean;
  showRecursiveRule?: boolean;
}

interface CountingRhythmsProps {
  props?: {
    width?: number;
    height?: number;
    animationSpeed?: number;
    autoPlayDuration?: number;
    themeColor?: string;
    darkMode?: boolean;
    showNavigation?: boolean;
    showPlayPause?: boolean;
    showStepIndicator?: boolean;
    initialStep?: number;
    additionalProps?: {
      maxBeats?: number;
      showTablaLabels?: boolean;
      highlightRecursion?: boolean;
      accentColor?: string;
      sequenceColor?: string;
    };
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== HELPERS ====================

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

function generateRhythms(n: number): RhythmPattern[] {
  if (n <= 0) return [];
  if (n === 1) return [{ beats: [1] }];
  if (n === 2) return [{ beats: [1, 1] }, { beats: [2] }];
  const prev1 = generateRhythms(n - 1);
  const prev2 = generateRhythms(n - 2);
  const result: RhythmPattern[] = [];
  for (const p of prev1) result.push({ beats: [1, ...p.beats] });
  for (const p of prev2) result.push({ beats: [2, ...p.beats] });
  return result;
}

// ==================== STEP DATA ====================

function buildSteps(): StepData[] {
  const steps: StepData[] = [];
  const r1 = generateRhythms(1);
  steps.push({
    id: 0,
    n: 1,
    title: "1 Beat",
    description:
      'With just 1 beat, there is only one possibility — a single short syllable "ta".',
    teachingNote:
      "Simply show the single pattern. There is only one way to fill 1 beat.",
    rhythms: r1,
    count: r1.length,
  });
  const r2 = generateRhythms(2);
  steps.push({
    id: 1,
    n: 2,
    title: "2 Beats",
    description:
      'With 2 beats, we can use two short "ta-ta" or one long "dha". That gives us 2 rhythms.',
    teachingNote: "Show both patterns side by side. Two ways to fill 2 beats.",
    rhythms: r2,
    count: r2.length,
  });
  const r3 = generateRhythms(3);
  steps.push({
    id: 2,
    n: 3,
    title: "3 Beats",
    description:
      "With 3 beats we get 3 rhythms. Notice: 3 = 2 + 1, the sum of the previous two counts!",
    teachingNote:
      "Draw attention to the sum pattern: 3 = 2 + 1. First recursive pattern appearance.",
    rhythms: r3,
    count: r3.length,
  });
  const r4 = generateRhythms(4);
  steps.push({
    id: 3,
    n: 4,
    title: "4 Beats",
    description:
      "Can you predict how many 4-beat rhythms there are? It should be 3 + 2 = 5!",
    teachingNote:
      "Pause and ask the student to predict before revealing. Confirm: 5 = 3 + 2.",
    rhythms: r4,
    count: r4.length,
    showPrediction: true,
  });
  const r5 = generateRhythms(5);
  steps.push({
    id: 4,
    n: 5,
    title: "5 Beats — The Split",
    description:
      'Every 5-beat rhythm starts with either a short (ta) or a long (dha). Starts with "ta" → 4-beat tail (5 rhythms). Starts with "dha" → 3-beat tail (3 rhythms). Total = 5 + 3 = 8!',
    teachingNote:
      "Explain the case-splitting reasoning. This is WHY rhythms(n) = rhythms(n-1) + rhythms(n-2).",
    rhythms: r5,
    count: r5.length,
    showSplitDiagram: true,
  });
  steps.push({
    id: 5,
    n: 0,
    title: "The Virahāṅka Rule!",
    description:
      "Each count equals the sum of the two before it. This is the Virahāṅka–Fibonacci sequence: 1, 2, 3, 5, 8, 13, 21, 34, …",
    teachingNote:
      "Connect to the staircase problem: climbing n steps taking 1 or 2 at a time gives the same sequence!",
    rhythms: [],
    count: 0,
    showRecursiveRule: true,
  });
  return steps;
}

// ═══════════════════════════════════════════════════════════
// SINGULARITY DESIGN TOKENS (from PDF)
// ═══════════════════════════════════════════════════════════

const DS = {
  indigo: "#4A4DC9",
  orange: "#FF7212",
  purple: "#533086",
  orangeWarm: "#FC9145",
  lavender: "#C1C1EA",
  cream: "#FFF3E4",
  dark: "#4E4E4E",
  grey: "#CACACA",
  greyLight: "#EBEBEB",
  greyBg: "#F5F5F5",
  white: "#FFFFFF",
  black: "#1A1A2E",
  successGreen: "#2ECC71",
  indigoSoft: "rgba(74, 77, 201, 0.07)",
  orangeSoft: "rgba(255, 114, 18, 0.07)",
  purpleGrad: "linear-gradient(135deg, #533086, #FC9145)",
  purpleGradSubtle:
    "linear-gradient(135deg, #533086 0%, #7B52AB 50%, #FC9145 100%)",
  lavenderGrad: "linear-gradient(135deg, #C1C1EA 0%, #FFF3E4 100%)",
  font: "'Poppins', 'Segoe UI', system-ui, sans-serif",
  pill: 100,
  rLg: 16,
  rMd: 12,
  rSm: 8,
  sSoft: "0 2px 12px rgba(74, 77, 201, 0.08)",
  sMd: "0 4px 20px rgba(74, 77, 201, 0.12)",
  sLg: "0 8px 32px rgba(83, 48, 134, 0.15)",
  sOrange: "0 4px 16px rgba(255, 114, 18, 0.25)",
};

// ==================== MAIN COMPONENT ====================

const CountingRhythmsTool: React.FC<CountingRhythmsProps> = ({
  props = {} as CountingRhythmsProps["props"],
  setStepDetails,
  stopAutoNext,
  setStopAutoNext,
}) => {
  const {
    width = 800,
    height = 600,
    animationSpeed = 1,
    autoPlayDuration = 0,
    showNavigation = true,
    showStepIndicator = true,
    initialStep = 0,
    additionalProps = {},
  } = props;

  const { showTablaLabels = true } = additionalProps;

  const steps = useMemo(() => buildSteps(), []);
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStep);
  const [revealedRhythms, setRevealedRhythms] = useState(0);
  const [showCount, setShowCount] = useState(false);
  const [predictionRevealed, setPredictionRevealed] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [animKey, setAnimKey] = useState(0);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

  const currentStep = steps[currentStepIndex];
  const isSmall = width < 520;

  // ── Load Poppins + Keyframes ──
  useEffect(() => {
    const id = "sg-rhythm-kf";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap";
    document.head.appendChild(link);
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
            @keyframes sgUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
            @keyframes sgPop{0%{transform:scale(0);opacity:0}60%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}
            @keyframes sgRight{from{opacity:0;transform:translateX(-24px)}to{opacity:1;transform:translateX(0)}}
            @keyframes sgPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
            @keyframes sgGlow{0%,100%{box-shadow:0 0 0 0 rgba(74,77,201,0)}50%{box-shadow:0 0 20px 6px rgba(74,77,201,0.18)}}
            @keyframes sgBounce{0%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}60%{transform:translateY(-3px)}}
            @keyframes sgCountPop{0%{transform:scale(0.2);opacity:0}50%{transform:scale(1.2)}100%{transform:scale(1);opacity:1}}
            @keyframes sgStair{from{opacity:0;transform:translateY(8px) scale(0.92)}to{opacity:1;transform:translateY(0) scale(1)}}
            @keyframes sgGradMove{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        `;
    document.head.appendChild(style);
    return () => {
      const e = document.getElementById(id);
      if (e) document.head.removeChild(e);
    };
  }, []);

  // ── Step change ──
  useEffect(() => {
    setRevealedRhythms(0);
    setShowCount(false);
    setPredictionRevealed(false);
    setAnimKey((k) => k + 1);
    const step = steps[currentStepIndex];
    const total = step.rhythms.length;
    if (total > 0) {
      let n = 0;
      const iv = setInterval(() => {
        n++;
        setRevealedRhythms(n);
        if (n >= total) {
          clearInterval(iv);
          setTimeout(() => setShowCount(true), 350 / animationSpeed);
        }
      }, 220 / animationSpeed);
      return () => clearInterval(iv);
    } else {
      setTimeout(() => setShowCount(true), 500 / animationSpeed);
    }
  }, [currentStepIndex, animationSpeed]);

  useEffect(() => {
    if (setStepDetails)
      setStepDetails({
        currentStep: currentStepIndex,
        totalSteps: steps.length,
        isPaused,
        currentMode: "learn",
      });
  }, [currentStepIndex, isPaused]);

  useEffect(() => {
    if (!isPaused && autoPlayDuration > 0 && !stopAutoNext) {
      const t = setTimeout(() => {
        if (currentStepIndex < steps.length - 1)
          setCurrentStepIndex((p) => p + 1);
        else setIsPaused(true);
      }, autoPlayDuration);
      return () => clearTimeout(t);
    }
  }, [isPaused, currentStepIndex, autoPlayDuration, stopAutoNext]);

  const goNext = useCallback(() => {
    if (currentStepIndex < steps.length - 1) setCurrentStepIndex((p) => p + 1);
  }, [currentStepIndex, steps.length]);
  const goPrev = useCallback(() => {
    if (currentStepIndex > 0) setCurrentStepIndex((p) => p - 1);
  }, [currentStepIndex]);
  const goToStep = useCallback((i: number) => setCurrentStepIndex(i), []);
  const reset = useCallback(() => {
    setCurrentStepIndex(0);
    setIsPaused(true);
  }, []);

  const sequenceSoFar = useMemo(() => {
    const s: number[] = [];
    for (let i = 0; i <= currentStepIndex && i < 5; i++) s.push(steps[i].count);
    return s;
  }, [currentStepIndex, steps]);
  const fullSequence = [1, 2, 3, 5, 8, 13, 21, 34];

  // ═════════════════════════════════════════
  // RENDER PIECES
  // ═════════════════════════════════════════

  const renderBeat = (beat: 1 | 2, idx: number, rIdx: number) => {
    const short = beat === 1;
    const w = short ? 34 : 72;
    const delay = rIdx * 0.12 + idx * 0.04;
    return (
      <div
        key={`${rIdx}-${idx}`}
        style={{
          width: w,
          height: 30,
          borderRadius: short ? DS.rSm : DS.rMd,
          background: short ? DS.indigo : DS.purpleGrad,
          marginRight: 5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontWeight: 600,
          fontFamily: DS.font,
          color: DS.white,
          animation: `sgPop 0.35s ease-out ${delay}s both`,
          boxShadow: short ? "0 2px 8px rgba(74,77,201,0.22)" : DS.sOrange,
          letterSpacing: 0.3,
          flexShrink: 0,
        }}
      >
        {showTablaLabels ? (short ? "ta" : "dha") : short ? "1" : "2"}
      </div>
    );
  };

  const renderRhythmRow = (rhythm: RhythmPattern, i: number) => (
    <div
      key={i}
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: 7,
        animation: `sgRight 0.38s ease-out ${i * 0.1}s both`,
        padding: "3px 0",
      }}
    >
      <span
        style={{
          fontSize: 11,
          color: DS.grey,
          width: 24,
          textAlign: "right",
          marginRight: 10,
          fontWeight: 600,
          fontFamily: DS.font,
        }}
      >
        {i + 1}.
      </span>
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
        {rhythm.beats.map((b, bi) => renderBeat(b, bi, i))}
      </div>
      <span
        style={{
          marginLeft: 12,
          fontSize: 10,
          color: DS.grey,
          fontFamily: DS.font,
          fontWeight: 500,
          fontStyle: "italic",
        }}
      >
        = {rhythm.beats.join(" + ")}
      </span>
    </div>
  );

  const renderProgressBar = () => {
    const pct = ((currentStepIndex + 1) / steps.length) * 100;
    return (
      <div
        style={{
          width: "100%",
          height: 5,
          background: DS.greyLight,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: DS.purpleGradSubtle,
            backgroundSize: "200% 100%",
            animation: "sgGradMove 3s ease infinite",
            transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)",
            borderRadius: "0 4px 4px 0",
          }}
        />
      </div>
    );
  };

  const renderSequenceCounter = () => {
    const seq = currentStep.showRecursiveRule
      ? fullSequence.slice(0, 8)
      : sequenceSoFar;
    const last = seq.length - 1;
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 16px",
          background: DS.lavenderGrad,
          borderRadius: DS.rMd,
          border: `2px solid ${DS.lavender}`,
          flexWrap: "wrap",
          boxShadow: DS.sSoft,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: DS.purple,
            letterSpacing: 0.8,
            textTransform: "uppercase" as const,
            fontFamily: DS.font,
          }}
        >
          Sequence:
        </span>
        {seq.map((num, i) => (
          <span
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: i === last ? DS.indigo : DS.white,
              color: i === last ? DS.white : DS.indigo,
              fontWeight: 700,
              fontSize: 13,
              fontFamily: DS.font,
              border: `2px solid ${DS.indigo}`,
              animation: `sgCountPop 0.4s ease-out ${i * 0.08}s both`,
              boxShadow:
                i === last ? "0 3px 12px rgba(74,77,201,0.35)" : "none",
            }}
          >
            {num}
          </span>
        ))}
        {currentStep.showRecursiveRule && (
          <span
            style={{
              fontSize: 15,
              fontWeight: 800,
              color: DS.indigo,
              animation: "sgPulse 1.5s ease-in-out infinite",
              fontFamily: DS.font,
            }}
          >
            …
          </span>
        )}
      </div>
    );
  };

  const renderSplitDiagram = () => {
    const sShort = currentStep.rhythms.filter((r) => r.beats[0] === 1);
    const sLong = currentStep.rhythms.filter((r) => r.beats[0] === 2);
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column" as const,
          gap: 14,
          animation: "sgUp 0.5s ease-out",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 14,
            flexWrap: "wrap" as const,
          }}
        >
          {/* Short card */}
          <div
            style={{
              flex: 1,
              minWidth: 200,
              background: DS.indigoSoft,
              borderRadius: DS.rLg,
              padding: 16,
              border: `2px solid ${DS.lavender}`,
              animation: "sgRight 0.45s ease-out 0.15s both",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 26,
                  borderRadius: DS.rSm,
                  background: DS.indigo,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 700,
                  color: DS.white,
                  fontFamily: DS.font,
                }}
              >
                ta
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: DS.indigo,
                  fontFamily: DS.font,
                }}
              >
                Starts short → {currentStep.n - 1}-beat tail
              </span>
            </div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: DS.indigo,
                textAlign: "center" as const,
                fontFamily: DS.font,
              }}
            >
              {sShort.length} rhythms
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: 800,
              color: DS.purple,
              animation: "sgBounce 0.7s ease-out 0.4s both",
              fontFamily: DS.font,
            }}
          >
            +
          </div>
          {/* Long card */}
          <div
            style={{
              flex: 1,
              minWidth: 200,
              background: DS.orangeSoft,
              borderRadius: DS.rLg,
              padding: 16,
              border: `2px solid ${DS.cream}`,
              animation: "sgRight 0.45s ease-out 0.3s both",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  width: 58,
                  height: 26,
                  borderRadius: DS.rSm,
                  background: DS.purpleGrad,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 700,
                  color: DS.white,
                  fontFamily: DS.font,
                }}
              >
                dha
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: DS.orange,
                  fontFamily: DS.font,
                }}
              >
                Starts long → {currentStep.n - 2}-beat tail
              </span>
            </div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: DS.orange,
                textAlign: "center" as const,
                fontFamily: DS.font,
              }}
            >
              {sLong.length} rhythms
            </div>
          </div>
        </div>
        {/* Result pill */}
        <div
          style={{
            textAlign: "center" as const,
            padding: "12px 20px",
            background: DS.purpleGrad,
            borderRadius: DS.pill,
            color: DS.white,
            fontWeight: 700,
            fontSize: 15,
            fontFamily: DS.font,
            animation: "sgCountPop 0.5s ease-out 0.6s both",
            boxShadow: DS.sLg,
          }}
        >
          Total = {sShort.length} + {sLong.length} = {currentStep.count}{" "}
          rhythms!
        </div>
      </div>
    );
  };

  const renderRecursiveRule = () => (
    <div
      key={animKey}
      style={{
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
        gap: 22,
        animation: "sgUp 0.5s ease-out",
        padding: "4px 0",
      }}
    >
      <div
        style={{
          background: DS.white,
          borderRadius: DS.rLg,
          padding: "24px 32px",
          border: `2.5px solid ${DS.indigo}`,
          textAlign: "center" as const,
          animation: "sgGlow 2.5s ease-in-out infinite",
          maxWidth: 520,
          boxShadow: DS.sMd,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: DS.grey,
            marginBottom: 10,
            textTransform: "uppercase" as const,
            letterSpacing: 1.5,
            fontFamily: DS.font,
          }}
        >
          The Virahāṅka Rule
        </div>
        <div
          style={{
            fontSize: 19,
            fontWeight: 700,
            color: DS.black,
            fontFamily: DS.font,
            lineHeight: 1.5,
          }}
        >
          rhythms(
          <span style={{ color: DS.indigo, fontStyle: "italic" }}>n</span>) =
          rhythms(
          <span style={{ color: DS.indigo, fontStyle: "italic" }}>n</span>−1) +
          rhythms(
          <span style={{ color: DS.indigo, fontStyle: "italic" }}>n</span>−2)
        </div>
      </div>
      {renderSequenceCounter()}
      <div
        style={{
          background: DS.cream,
          borderRadius: DS.rMd,
          padding: "16px 20px",
          border: `2px dashed ${DS.orange}`,
          maxWidth: 480,
          animation: "sgStair 0.5s ease-out 0.6s both",
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: DS.orange,
            marginBottom: 6,
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontFamily: DS.font,
          }}
        >
          <span style={{ fontSize: 18 }}>🪜</span> Staircase Connection!
        </div>
        <div
          style={{
            fontSize: 12,
            color: DS.dark,
            lineHeight: 1.65,
            fontFamily: DS.font,
            fontWeight: 400,
          }}
        >
          Climbing <strong style={{ color: DS.indigo }}>n steps</strong> by
          taking <strong style={{ color: DS.purple }}>1 or 2 steps</strong> at a
          time gives exactly the same count! For 8 steps, there are{" "}
          <strong style={{ color: DS.orange }}>34</strong> different ways.
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 4,
          animation: "sgUp 0.5s ease-out 0.9s both",
        }}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8].map((h, i) => (
          <div
            key={i}
            style={{
              width: 22,
              height: h * 9,
              borderRadius: "5px 5px 0 0",
              background: DS.purpleGradSubtle,
              animation: `sgStair 0.3s ease-out ${1.1 + i * 0.07}s both`,
            }}
          />
        ))}
      </div>
    </div>
  );

  const renderPredictionBanner = () => {
    if (!currentStep.showPrediction) return null;
    return (
      <div
        style={{
          background: predictionRevealed ? "rgba(46,204,113,0.07)" : DS.cream,
          borderRadius: DS.rMd,
          padding: "12px 18px",
          marginBottom: 10,
          border: `2px solid ${predictionRevealed ? DS.successGreen : DS.orange}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          transition: "all 0.4s ease",
          flexWrap: "wrap" as const,
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            fontFamily: DS.font,
            color: predictionRevealed ? "#1a7a42" : DS.dark,
          }}
        >
          {predictionRevealed
            ? `✓ Yes! ${currentStep.count} = ${steps[currentStepIndex - 1]?.count} + ${steps[currentStepIndex - 2]?.count}`
            : `🤔 Predict: How many ${currentStep.n}-beat rhythms?`}
        </span>
        {!predictionRevealed && (
          <button
            onClick={() => setPredictionRevealed(true)}
            onMouseEnter={() => setHoveredBtn("predict")}
            onMouseLeave={() => setHoveredBtn(null)}
            style={{
              padding: "8px 24px",
              borderRadius: DS.pill,
              border: "none",
              background: hoveredBtn === "predict" ? DS.orange : DS.purpleGrad,
              color: DS.white,
              fontWeight: 600,
              fontSize: 12,
              fontFamily: DS.font,
              cursor: "pointer",
              transition: "all 0.25s ease",
              transform: hoveredBtn === "predict" ? "scale(1.05)" : "scale(1)",
              boxShadow: hoveredBtn === "predict" ? DS.sOrange : DS.sMd,
            }}
          >
            Reveal Answer
          </button>
        )}
      </div>
    );
  };

  const renderStepDots = () => (
    <div style={{ display: "flex", gap: 7, justifyContent: "center" }}>
      {steps.map((_, i) => (
        <button
          key={i}
          onClick={() => goToStep(i)}
          style={{
            width: currentStepIndex === i ? 30 : 10,
            height: 10,
            borderRadius: DS.pill,
            border: "none",
            background:
              currentStepIndex === i
                ? DS.indigo
                : i < currentStepIndex
                  ? DS.lavender
                  : DS.greyLight,
            cursor: "pointer",
            transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
            padding: 0,
          }}
          title={steps[i].title}
        />
      ))}
    </div>
  );

  // ═════════════════════════════════════════
  // MAIN RENDER
  // ═════════════════════════════════════════

  return (
    <div
      style={{
        width: "100%",
        maxWidth: width,
        minHeight: Math.min(height, 520),
        background: DS.white,
        borderRadius: DS.rLg + 4,
        overflow: "hidden",
        fontFamily: DS.font,
        display: "flex",
        flexDirection: "column" as const,
        boxShadow: DS.sLg,
        border: `1px solid ${DS.greyLight}`,
        position: "relative" as const,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          background: DS.purpleGradSubtle,
          backgroundSize: "200% 200%",
          animation: "sgGradMove 6s ease infinite",
          padding: isSmall ? "14px 16px" : "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          flexWrap: "wrap" as const,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Music size={20} color={DS.white} />
          </div>
          <div>
            <div
              style={{
                fontSize: isSmall ? 15 : 18,
                fontWeight: 700,
                color: DS.white,
                lineHeight: 1.2,
                letterSpacing: -0.3,
              }}
            >
              Counting Rhythms
            </div>
            <div
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.75)",
                fontWeight: 500,
                letterSpacing: 0.2,
              }}
            >
              Building the Virahāṅka–Fibonacci Sequence
            </div>
          </div>
        </div>
        {showStepIndicator && (
          <div
            style={{
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
              borderRadius: DS.pill,
              padding: "5px 14px",
              fontSize: 11,
              color: DS.white,
              fontWeight: 600,
            }}
          >
            Step {currentStepIndex + 1} / {steps.length}
          </div>
        )}
      </div>

      {renderProgressBar()}

      {/* CONTENT */}
      <div
        style={{
          flex: 1,
          padding: isSmall ? "12px 14px 14px" : "14px 24px 18px",
          overflowY: "auto" as const,
          display: "flex",
          flexDirection: "column" as const,
          gap: 14,
          background: DS.greyBg,
        }}
      >
        {/* Title */}
        <div key={`t-${animKey}`} style={{ animation: "sgUp 0.4s ease-out" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 6,
            }}
          >
            {currentStep.n > 0 ? (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: DS.indigo,
                  color: DS.white,
                  fontWeight: 800,
                  fontSize: 17,
                  animation: "sgPop 0.45s ease-out",
                  boxShadow: "0 4px 14px rgba(74,77,201,0.3)",
                }}
              >
                {currentStep.n}
              </span>
            ) : (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: DS.orange,
                  color: DS.white,
                  fontWeight: 800,
                  fontSize: 16,
                  animation: "sgPop 0.45s ease-out",
                  boxShadow: DS.sOrange,
                }}
              >
                ✦
              </span>
            )}
            <h2
              style={{
                margin: 0,
                fontSize: isSmall ? 19 : 23,
                fontWeight: 700,
                color: DS.black,
                letterSpacing: -0.5,
              }}
            >
              {currentStep.title}
            </h2>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: DS.dark,
              lineHeight: 1.65,
              maxWidth: 620,
              fontWeight: 400,
            }}
          >
            {currentStep.description}
          </p>
        </div>

        {renderPredictionBanner()}

        {currentStepIndex >= 1 &&
          !currentStep.showRecursiveRule &&
          showCount && (
            <div style={{ animation: "sgUp 0.4s ease-out" }}>
              {renderSequenceCounter()}
            </div>
          )}

        {currentStep.showSplitDiagram && showCount && renderSplitDiagram()}
        {currentStep.showRecursiveRule && renderRecursiveRule()}

        {/* Rhythm patterns card */}
        {currentStep.rhythms.length > 0 && !currentStep.showSplitDiagram && (
          <div
            key={`r-${animKey}`}
            style={{
              background: DS.white,
              borderRadius: DS.rLg,
              padding: isSmall ? "12px 12px" : "16px 20px",
              border: `1px solid ${DS.greyLight}`,
              boxShadow: DS.sSoft,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: DS.grey,
                marginBottom: 10,
                textTransform: "uppercase" as const,
                letterSpacing: 0.8,
              }}
            >
              All {currentStep.n}-beat rhythms
            </div>
            {currentStep.rhythms
              .slice(0, revealedRhythms)
              .map((r, i) => renderRhythmRow(r, i))}
            {showCount && (
              <div
                style={{
                  marginTop: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  animation: "sgCountPop 0.45s ease-out",
                }}
              >
                <div
                  style={{
                    background: DS.indigo,
                    color: DS.white,
                    borderRadius: DS.pill,
                    padding: "7px 18px",
                    fontWeight: 700,
                    fontSize: 14,
                    boxShadow: "0 3px 14px rgba(74,77,201,0.3)",
                  }}
                >
                  Count: {currentStep.count}
                </div>
                {currentStepIndex >= 2 && (
                  <span
                    style={{
                      fontSize: 12,
                      color: DS.dark,
                      fontWeight: 600,
                      animation: "sgUp 0.35s ease-out 0.25s both",
                    }}
                  >
                    ={" "}
                    <span style={{ color: DS.indigo }}>
                      {steps[currentStepIndex - 1]?.count}
                    </span>{" "}
                    +{" "}
                    <span style={{ color: DS.orange }}>
                      {steps[currentStepIndex - 2]?.count}
                    </span>
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Split rhythm listing */}
        {currentStep.showSplitDiagram && showCount && (
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" as const }}>
            <div
              style={{
                flex: 1,
                minWidth: 180,
                background: DS.white,
                borderRadius: DS.rMd,
                padding: "12px 14px",
                border: `1px solid ${DS.greyLight}`,
                animation: "sgUp 0.45s ease-out 0.25s both",
                boxShadow: DS.sSoft,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: DS.indigo,
                  marginBottom: 8,
                  textTransform: "uppercase" as const,
                  letterSpacing: 0.6,
                }}
              >
                Starts with ta (
                {currentStep.rhythms.filter((r) => r.beats[0] === 1).length})
              </div>
              {currentStep.rhythms
                .filter((r) => r.beats[0] === 1)
                .slice(0, revealedRhythms)
                .map((r, i) => renderRhythmRow(r, i))}
            </div>
            <div
              style={{
                flex: 1,
                minWidth: 180,
                background: DS.white,
                borderRadius: DS.rMd,
                padding: "12px 14px",
                border: `1px solid ${DS.greyLight}`,
                animation: "sgUp 0.45s ease-out 0.4s both",
                boxShadow: DS.sSoft,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: DS.orange,
                  marginBottom: 8,
                  textTransform: "uppercase" as const,
                  letterSpacing: 0.6,
                }}
              >
                Starts with dha (
                {currentStep.rhythms.filter((r) => r.beats[0] === 2).length})
              </div>
              {currentStep.rhythms
                .filter((r) => r.beats[0] === 2)
                .slice(0, revealedRhythms)
                .map((r, i) => renderRhythmRow(r, i))}
            </div>
          </div>
        )}

        {/* Teaching note */}
        {showCount && currentStep.teachingNote && (
          <div
            style={{
              background: DS.indigoSoft,
              borderRadius: DS.rMd,
              padding: "10px 16px",
              borderLeft: `4px solid ${DS.indigo}`,
              animation: "sgUp 0.4s ease-out 0.4s both",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: DS.indigo,
                marginBottom: 3,
                textTransform: "uppercase" as const,
                letterSpacing: 0.8,
              }}
            >
              💡 Teaching Note
            </div>
            <div
              style={{
                fontSize: 12,
                color: DS.dark,
                lineHeight: 1.55,
                fontWeight: 400,
              }}
            >
              {currentStep.teachingNote}
            </div>
          </div>
        )}
      </div>

      {/* NAVIGATION */}
      {showNavigation && (
        <div
          style={{
            padding: "12px 24px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `1px solid ${DS.greyLight}`,
            background: DS.white,
            gap: 8,
            flexWrap: "wrap" as const,
          }}
        >
          {/* Back — Outlined */}
          <button
            onClick={goPrev}
            disabled={currentStepIndex === 0}
            onMouseEnter={() => setHoveredBtn("prev")}
            onMouseLeave={() => setHoveredBtn(null)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "8px 24px",
              borderRadius: DS.pill,
              border: `2px solid ${currentStepIndex === 0 ? DS.greyLight : DS.indigo}`,
              background:
                hoveredBtn === "prev" && currentStepIndex > 0
                  ? DS.indigoSoft
                  : DS.white,
              color: currentStepIndex === 0 ? DS.grey : DS.indigo,
              fontWeight: 600,
              fontSize: 13,
              fontFamily: DS.font,
              cursor: currentStepIndex === 0 ? "not-allowed" : "pointer",
              transition: "all 0.25s ease",
              transform:
                hoveredBtn === "prev" && currentStepIndex > 0
                  ? "scale(1.03)"
                  : "scale(1)",
            }}
          >
            <ChevronLeft size={16} /> Back
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {renderStepDots()}
            <button
              onClick={reset}
              onMouseEnter={() => setHoveredBtn("reset")}
              onMouseLeave={() => setHoveredBtn(null)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 34,
                height: 34,
                borderRadius: "50%",
                border: `1.5px solid ${DS.greyLight}`,
                background: hoveredBtn === "reset" ? DS.greyBg : DS.white,
                cursor: "pointer",
                color: DS.dark,
                transition: "all 0.25s ease",
                padding: 0,
                transform:
                  hoveredBtn === "reset" ? "rotate(-90deg)" : "rotate(0deg)",
              }}
              title="Reset"
            >
              <RotateCcw size={14} />
            </button>
          </div>

          {/* Next — Contained */}
          <button
            onClick={goNext}
            disabled={currentStepIndex === steps.length - 1}
            onMouseEnter={() => setHoveredBtn("next")}
            onMouseLeave={() => setHoveredBtn(null)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "8px 24px",
              borderRadius: DS.pill,
              border: "none",
              background:
                currentStepIndex === steps.length - 1
                  ? DS.greyLight
                  : hoveredBtn === "next"
                    ? DS.orange
                    : DS.indigo,
              color: currentStepIndex === steps.length - 1 ? DS.grey : DS.white,
              fontWeight: 600,
              fontSize: 13,
              fontFamily: DS.font,
              cursor:
                currentStepIndex === steps.length - 1
                  ? "not-allowed"
                  : "pointer",
              transition: "all 0.25s ease",
              transform:
                hoveredBtn === "next" && currentStepIndex < steps.length - 1
                  ? "scale(1.05)"
                  : "scale(1)",
              boxShadow:
                currentStepIndex === steps.length - 1
                  ? "none"
                  : hoveredBtn === "next"
                    ? DS.sOrange
                    : "0 3px 14px rgba(74,77,201,0.3)",
            }}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default CountingRhythmsTool;

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════════
