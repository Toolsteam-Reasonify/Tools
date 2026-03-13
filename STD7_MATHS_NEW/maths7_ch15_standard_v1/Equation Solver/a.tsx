// @ts-ignore - workspace may not include react typings
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
// @ts-ignore - workspace may not include lucide-react typings
import { Play, Pause, ChevronLeft, ChevronRight, RotateCcw, Check, BookOpen, Target, Zap, Award } from "lucide-react";

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
  type: string;
  mode: ModeType;
  data?: any;
}

interface EquationSolverToolProps {
  props?: {
    width?: number;
    height?: number;
    data?: { themeColor?: string; autoPlayDuration?: number };
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
    additionalProps?: {
      equation?: {
        lhsCoefficient?: number;
        lhsVariable?: string;
        lhsConstant?: number;
        rhsValue?: number;
      };
      showVerification?: boolean;
      showBalanceScale?: boolean;
      animateOperations?: boolean;
    };
  };
  setStepDetails?: (s: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (v: boolean) => void;
}

// ═══ DESIGN TOKENS (Singularity) ═══
const D = {
  p: "#4A4DC9",
  ac: "#FF7212",
  gs: "#533086",
  ge: "#FC9145",
  lav: "#C1C1EA",
  pch: "#FFF3E4",
  lavL: "#EAEAFF",
  pchL: "#FFF9F2",
  g9: "#1A1A2E",
  g7: "#4E4E4E",
  g4: "#CACACA",
  g2: "#EBEBEB",
  g1: "#F5F5F5",
  w: "#FFFFFF",
  ok: "#2ECC71",
  er: "#E74C3C",
  wr: "#F39C12",
  f: "'Poppins',sans-serif",
  r: "12px",
  rl: "20px",
  rf: "999px",
  sh: "0 4px 24px rgba(74,77,201,0.12)",
  shL: "0 12px 40px rgba(74,77,201,0.13)",
};

// ═══ MATH (Pure CSS) ═══
const MathBlock: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  fs?: string;
}> = ({ children, style = {}, fs = "28px" }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 5,
      flexWrap: "wrap",
      fontSize: fs,
      lineHeight: 1.5,
      color: D.g9,
      fontFamily: D.f,
      fontWeight: 600,
      ...style,
    }}
  >
    {children}
  </div>
);
const Frac: React.FC<{
  n: React.ReactNode;
  d: React.ReactNode;
  fs?: string;
  c?: string;
}> = ({ n, d, fs = "inherit", c }) => (
  <span
    style={{
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "center",
      verticalAlign: "middle",
      fontSize: fs,
      color: c || D.g9,
      lineHeight: 1.15,
      margin: "0 5px",
    }}
  >
    <span
      style={{
        borderBottom: `2.5px solid ${c || D.p}`,
        padding: "0 8px 4px",
        fontWeight: 600,
      }}
    >
      {n}
    </span>
    <span style={{ padding: "4px 8px 0", fontWeight: 600 }}>{d}</span>
  </span>
);
const Strike: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ position: "relative" as const, display: "inline-block" }}>
    {children}
    <span
      style={{
        position: "absolute" as const,
        left: -3,
        right: -3,
        top: "50%",
        height: 3,
        background: D.ac,
        transform: "rotate(-7deg)",
        borderRadius: 2,
      }}
    />
  </span>
);
const Hi: React.FC<{ children: React.ReactNode; v?: "p" | "a" }> = ({
  children,
  v = "p",
}) => (
  <span style={{ color: v === "a" ? D.ac : D.p, fontWeight: 700 }}>
    {children}
  </span>
);

// ═══ STEPS (6 learn + 5 practice + 2 real world + 1 hands-on) ═══
const STEPS: StepDataInterface[] = [
  {
    id: 1,
    title: "The Equation",
    description: "Solve 5x \u2212 4 = 7. Find x so that LHS equals RHS.",
    type: "intro",
    mode: "learn",
    data: { phase: "original" },
  },
  {
    id: 2,
    title: "Step 1: Add 4 to Both Sides",
    description: "Remove \u22124 by adding 4 to BOTH sides. Keep it balanced!",
    type: "explanation",
    mode: "learn",
    data: { phase: "add4" },
  },
  {
    id: 3,
    title: "Step 2: Simplify",
    description: "\u22124 + 4 cancels \u2192 5x. And 7 + 4 = 11. So 5x = 11.",
    type: "explanation",
    mode: "learn",
    data: { phase: "simplified1" },
  },
  {
    id: 4,
    title: "Step 3: Divide Both Sides by 5",
    description: "Divide BOTH sides by 5 to isolate x.",
    type: "explanation",
    mode: "learn",
    data: { phase: "divide5" },
  },
  {
    id: 5,
    title: "Step 4: The Solution",
    description: "x = 11/5. Let\u2019s verify this.",
    type: "explanation",
    mode: "learn",
    data: { phase: "solution" },
  },
  {
    id: 6,
    title: "Verification",
    description: "LHS = 5(11/5) \u2212 4 = 11 \u2212 4 = 7 = RHS. Correct!",
    type: "explanation",
    mode: "learn",
    data: { phase: "verify" },
  },

  {
    id: 10,
    title: "Q1: First Step?",
    description: "To solve 5x \u2212 4 = 7, what do we do first?",
    type: "practice",
    mode: "practice",
    data: {
      question: "What is the first step to solve 5x \u2212 4 = 7?",
      options: [
        "Subtract 4 from both sides",
        "Add 4 to both sides",
        "Divide both sides by 5",
        "Multiply both sides by 5",
      ],
      correctIndex: 1,
    },
  },
  {
    id: 11,
    title: "Q2: Value of 5x?",
    description: "After adding 4 to both sides:",
    type: "practice",
    mode: "practice",
    data: {
      question: "5x \u2212 4 + 4 = 7 + 4. What is 5x equal to?",
      options: ["5x = 3", "5x = 7", "5x = 11", "5x = 35"],
      correctIndex: 2,
    },
  },
  {
    id: 12,
    title: "Q3: Find x",
    description: "We have 5x = 11.",
    type: "practice",
    mode: "practice",
    data: {
      question: "If 5x = 11, then x = ?",
      options: ["x = 6", "x = 55", "x = 11/5", "x = 5/11"],
      correctIndex: 2,
    },
  },
  {
    id: 13,
    title: "Q4: Verify LHS",
    description: "Substituting x = 11/5 into the LHS:",
    type: "practice",
    mode: "practice",
    data: {
      question: "What is 5 \u00D7 (11/5) \u2212 4 equal to?",
      options: ["3", "7", "11", "15"],
      correctIndex: 1,
    },
  },
  {
    id: 14,
    title: "Q5: Why Add 4?",
    description: "Think about inverse operations.",
    type: "practice",
    mode: "practice",
    data: {
      question: "Why do we add 4 to both sides of 5x \u2212 4 = 7?",
      options: [
        "Because 4 is the coefficient of x",
        "To make the RHS larger",
        "Because +4 is the additive inverse of \u22124",
        "To multiply x by 4",
      ],
      correctIndex: 2,
    },
  },

  {
    id: 20,
    title: "Weighing Scale",
    description:
      "The equation is a balanced scale. Same operation on both sides keeps balance!",
    type: "real_world",
    mode: "real_world",
    data: { context: "scale" },
  },
  {
    id: 21,
    title: "Coin Problem",
    description:
      "5 times Madhubanti\u2019s coins minus 4 equals 7. That\u2019s 5x \u2212 4 = 7!",
    type: "real_world",
    mode: "real_world",
    data: { context: "coins" },
  },
  {
    id: 30,
    title: "Try It Yourself",
    description: "Drag the slider to find x where LHS = RHS!",
    type: "hands_on",
    mode: "hands_on",
    data: { interactive: true },
  },
];

// ═══ MAIN COMPONENT ═══
const EquationSolverTool: React.FC<EquationSolverToolProps> = ({
  props: propsIn,
  setStepDetails,
  stopAutoNext,
}) => {
  const props = (propsIn ?? {}) as NonNullable<EquationSolverToolProps["props"]>;
  const cfg = useMemo(
    () => ({
      w: props.width ?? 800,
      h: props.height ?? 620,
      initMode: (props.initialMode ?? "learn") as ModeType,
      showModes: props.showModeSelector ?? true,
      modes: (props.enabledModes ?? [
        "learn",
        "practice",
        "real_world",
        "hands_on",
      ]) as ModeType[],
      showNav: props.showNavigation ?? true,
      showPlay: props.showPlayPause ?? true,
      showDots: props.showStepIndicator ?? true,
      speed: props.animationSpeed ?? 1,
      autoPlay: props.autoPlayDuration ?? 10000,
      filter: props.filterSteps ?? null,
    }),
    [
      props.width,
      props.height,
      props.initialMode,
      props.showModeSelector,
      props.showNavigation,
      props.showPlayPause,
      props.showStepIndicator,
      props.animationSpeed,
      props.autoPlayDuration,
    ],
  );

  const ap = props.additionalProps || {};
  const eq = useMemo(
    () => ({
      a: ap.equation?.lhsCoefficient ?? 5,
      v: ap.equation?.lhsVariable ?? "x",
      b: ap.equation?.lhsConstant ?? -4,
      c: ap.equation?.rhsValue ?? 7,
      showScale: ap.showBalanceScale ?? true,
    }),
    [
      ap.equation?.lhsCoefficient,
      ap.equation?.lhsVariable,
      ap.equation?.lhsConstant,
      ap.equation?.rhsValue,
      ap.showBalanceScale,
    ],
  );

  const sol = useMemo(() => {
    const after = eq.c - eq.b;
    return {
      a: eq.a,
      b: eq.b,
      c: eq.c,
      after,
      xN: after,
      xD: eq.a,
      xDec: after / eq.a,
    };
  }, [eq.a, eq.b, eq.c]);

  const cs = sol.b < 0 ? `\u2212 ${Math.abs(sol.b)}` : `+ ${sol.b}`;
  const as2 = sol.b < 0 ? `+ ${Math.abs(sol.b)}` : `\u2212 ${sol.b}`;
  const vr = eq.v;

  const allSteps = props.steps || STEPS;
  const avail = useMemo(
    () =>
      cfg.filter
        ? allSteps.filter((s) => cfg.filter!.includes(s.id))
        : allSteps,
    [cfg.filter],
  );

  const [mode, setMode] = useState<ModeType>(cfg.initMode);
  const ms = useMemo(() => avail.filter((s) => s.mode === mode), [avail, mode]);
  const [si, setSi] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [phase, setPhase] = useState(0); // 0=hidden, 1=visible, 2=animated
  const [selOpt, setSelOpt] = useState<number | null>(null);
  const [fb, setFb] = useState(false);
  const [slider, setSlider] = useState(1);
  const [va, setVa] = useState(0);
  const timerRef = useRef<any>(null);
  const cur = ms[si] || ms[0];

  // ═══ INJECT STYLES (once) ═══
  useEffect(() => {
    const id = "sg-eq-styles";
    if (document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id;
    el.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
            @keyframes sgUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
            @keyframes sgDn{from{opacity:0;transform:translateY(-16px)}to{opacity:1;transform:translateY(0)}}
            @keyframes sgLt{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
            @keyframes sgPop{0%{transform:scale(0);opacity:0}65%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}
            @keyframes sgPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
            @keyframes sgGlow{0%,100%{box-shadow:0 0 8px rgba(74,77,201,0.15)}50%{box-shadow:0 0 24px rgba(74,77,201,0.4)}}
            @keyframes sgShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}50%{transform:translateX(4px)}75%{transform:translateX(-3px)}}
            @keyframes sgBounce{0%{transform:scale(0.4);opacity:0}60%{transform:scale(1.04)}100%{transform:scale(1);opacity:1}}
            @keyframes sgBal{0%,100%{transform:rotate(0)}30%{transform:rotate(-2deg)}70%{transform:rotate(2deg)}}
            @keyframes sgFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
            .sg-btn{height:36px;padding:0 20px;border-radius:999px;font-size:13px;font-family:'Poppins',sans-serif;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:4px;transition:all 0.2s ease;outline:none;white-space:nowrap;border:2px solid transparent}
            .sg-btn:active{transform:scale(0.95)}
            .sg-btn:disabled{opacity:0.4;cursor:not-allowed;transform:none}
            .sg-btn-c{background:${D.p};color:#fff;border-color:${D.p}}.sg-btn-c:hover:not(:disabled){background:linear-gradient(135deg,${D.gs},${D.ge});border-color:transparent;box-shadow:${D.sh}}
            .sg-btn-o{background:transparent;color:${D.p};border-color:${D.lav}}.sg-btn-o:hover:not(:disabled){background:${D.lavL};border-color:${D.p}}
            .sg-btn-t{background:transparent;color:${D.g7};border-color:transparent}.sg-btn-t:hover:not(:disabled){background:${D.g1};color:${D.g9}}
            .sg-btn-h{background:linear-gradient(135deg,${D.ac},${D.ge});color:#fff;border-color:transparent}.sg-btn-h:hover:not(:disabled){box-shadow:0 4px 16px rgba(255,114,18,0.3)}
            .sg-opt{padding:14px 18px;border-radius:12px;border:2px solid ${D.g2};background:${D.w};cursor:pointer;font-size:14px;font-weight:600;color:${D.g9};font-family:'Poppins',sans-serif;transition:all 0.2s ease;text-align:left}
            .sg-opt:hover:not(:disabled){border-color:${D.lav};background:${D.lavL};transform:translateY(-1px)}
            .sg-opt:active{transform:scale(0.98)}
        `;
    document.head.appendChild(el);
    return () => {
      const e = document.getElementById(id);
      if (e) document.head.removeChild(e);
    };
  }, []);

  // ═══ STEP TRANSITION (only 2 timeouts instead of 4) ═══
  useEffect(() => {
    setPhase(0);
    setSelOpt(null);
    setFb(false);
    setVa(0);
    const t1 = setTimeout(() => setPhase(1), 60);
    const t2 = setTimeout(() => setPhase(2), 500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [si, mode]);

  useEffect(() => {
    if (cur?.data?.phase === "verify" && phase >= 2) {
      const t1 = setTimeout(() => setVa(1), 1000);
      const t2 = setTimeout(() => setVa(2), 2200);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [cur?.data?.phase, phase]);

  // Auto-play
  useEffect(() => {
    if (playing && cfg.autoPlay > 0 && mode === "learn") {
      timerRef.current = setTimeout(() => {
        if (si < ms.length - 1) setSi((p) => p + 1);
        else setPlaying(false);
      }, cfg.autoPlay / cfg.speed);
    }
    return () => clearTimeout(timerRef.current);
  }, [playing, si, cfg.autoPlay, cfg.speed, ms.length, mode]);

  useEffect(() => {
    setStepDetails?.({
      currentStep: si + 1,
      totalSteps: ms.length,
      isPaused: !playing,
      currentMode: mode,
    });
  }, [si, playing, mode, ms.length]);

  const next = useCallback(() => {
    if (si < ms.length - 1) setSi((p) => p + 1);
  }, [si, ms.length]);
  const prev = useCallback(() => {
    if (si > 0) setSi((p) => p - 1);
  }, [si]);
  const resetAll = useCallback(() => {
    setSi(0);
    setPlaying(false);
    setSelOpt(null);
    setFb(false);
  }, []);
  const chgMode = useCallback((m: ModeType) => {
    setMode(m);
    setSi(0);
    setPlaying(false);
    setSelOpt(null);
    setFb(false);
  }, []);

  const modeInfo: Record<ModeType, { label: string; emoji: string }> = {
    learn: { label: "Learn", emoji: "\uD83D\uDCD6" },
    practice: { label: "Practice", emoji: "\uD83C\uDFAF" },
    real_world: { label: "Real World", emoji: "\u26A1" },
    hands_on: { label: "Hands On", emoji: "\uD83C\uDFAE" },
  };

  const visible = phase >= 1;
  const animated = phase >= 2;

  // Shared animated entry style
  const entryAnim = (delay = "0s") => ({
    animation: visible ? `sgUp 0.45s ease-out ${delay} both` : "none",
    opacity: visible ? undefined : 0,
  });

  // ═══ LEARN ═══
  const renderLearn = () => {
    const ph = cur?.data?.phase;
    const s = sol;

    const badge = (text: string, variant: "p" | "a" = "p") => (
      <span
        style={{
          display: "inline-block",
          padding: "5px 18px",
          borderRadius: D.rf,
          background:
            variant === "a"
              ? `linear-gradient(135deg,${D.ac},${D.ge})`
              : `linear-gradient(135deg,${D.gs},${D.ge})`,
          color: D.w,
          fontWeight: 700,
          fontSize: 14,
          fontFamily: D.f,
          animation: animated ? "sgPulse 2s ease-in-out infinite" : "none",
        }}
      >
        {text}
      </span>
    );

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          padding: "12px 16px",
          width: "100%",
        }}
      >
        {eq.showScale && ph !== "verify" && (
          <div style={entryAnim()}>
            <svg width="320" height="72" viewBox="0 0 320 72">
              <defs>
                <linearGradient id="sg">
                  <stop offset="0%" stopColor={D.p} />
                  <stop offset="100%" stopColor={D.ac} />
                </linearGradient>
              </defs>
              <polygon
                points="160,68 149,48 171,48"
                fill="url(#sg)"
                opacity="0.65"
              />
              <line
                x1="28"
                y1="44"
                x2="292"
                y2="44"
                stroke="url(#sg)"
                strokeWidth="3"
                strokeLinecap="round"
                style={{
                  transformOrigin: "160px 44px",
                  animation:
                    (ph === "add4" || ph === "divide5") && animated
                      ? "sgBal 1s ease-in-out"
                      : "none",
                }}
              />
              <rect
                x="18"
                y="27"
                width="108"
                height="17"
                rx="9"
                fill={D.lav}
                opacity="0.35"
                stroke={D.p}
                strokeWidth="1.5"
              />
              <text
                x="72"
                y="22"
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill={D.p}
                fontFamily={D.f}
              >
                LHS
              </text>
              <rect
                x="194"
                y="27"
                width="108"
                height="17"
                rx="9"
                fill={D.pch}
                opacity="0.5"
                stroke={D.ac}
                strokeWidth="1.5"
              />
              <text
                x="248"
                y="22"
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill={D.ac}
                fontFamily={D.f}
              >
                RHS
              </text>
              <text
                x="160"
                y="26"
                textAnchor="middle"
                fontSize="16"
                fontWeight="800"
                fill={D.g9}
                fontFamily={D.f}
              >
                =
              </text>
            </svg>
          </div>
        )}

        {/* Equation Card */}
        <div
          style={{
            background: D.w,
            borderRadius: D.rl,
            padding: "26px 34px",
            boxShadow: D.shL,
            border: `1.5px solid ${D.g2}`,
            width: "100%",
            maxWidth: 540,
            position: "relative" as const,
            overflow: "hidden",
            ...entryAnim("0.08s"),
          }}
        >
          <div
            style={{
              position: "absolute" as const,
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: `linear-gradient(90deg,${D.p},${D.ac})`,
            }}
          />

          {ph === "original" && (
            <>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: D.p,
                  marginBottom: 14,
                  letterSpacing: 2.5,
                  textTransform: "uppercase" as const,
                  fontFamily: D.f,
                  textAlign: "center",
                }}
              >
                Original Equation
              </div>
              <div style={entryAnim("0.12s")}>
                <MathBlock fs="36px">
                  <span style={{ color: D.p }}>
                    {s.a}
                    {vr}
                  </span>
                  <span> {cs} </span>
                  <span>=</span>
                  <span style={{ color: D.ac }}> {s.c}</span>
                </MathBlock>
              </div>
              {animated && (
                <div
                  style={{
                    marginTop: 20,
                    display: "flex",
                    justifyContent: "center",
                    gap: 12,
                    flexWrap: "wrap",
                    ...entryAnim("0.2s"),
                  }}
                >
                  <span
                    style={{
                      padding: "6px 16px",
                      borderRadius: D.rf,
                      background: D.lavL,
                      border: `1.5px solid ${D.lav}`,
                      fontSize: 12,
                      fontWeight: 600,
                      color: D.p,
                      fontFamily: D.f,
                    }}
                  >
                    LHS: {s.a}
                    {vr} {cs}
                  </span>
                  <span
                    style={{
                      padding: "6px 16px",
                      borderRadius: D.rf,
                      background: D.pch,
                      border: `1.5px solid ${D.ac}33`,
                      fontSize: 12,
                      fontWeight: 600,
                      color: D.ac,
                      fontFamily: D.f,
                    }}
                  >
                    RHS: {s.c}
                  </span>
                </div>
              )}
            </>
          )}

          {ph === "add4" && (
            <>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: D.p,
                  marginBottom: 14,
                  letterSpacing: 2.5,
                  textTransform: "uppercase" as const,
                  fontFamily: D.f,
                  textAlign: "center",
                }}
              >
                Adding {Math.abs(s.b)} to both sides
              </div>
              <div style={entryAnim("0.1s")}>
                <MathBlock fs="24px">
                  <span>
                    {s.a}
                    {vr} {cs}
                  </span>
                  <Hi>&nbsp;{as2}</Hi>
                  <span>&nbsp;=&nbsp;</span>
                  <span>{s.c}</span>
                  <Hi v="a">&nbsp;{as2}</Hi>
                </MathBlock>
              </div>
              {animated && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 40,
                    marginTop: 18,
                    ...entryAnim("0.2s"),
                  }}
                >
                  {badge(as2, "p")}
                  {badge(as2, "a")}
                </div>
              )}
              {animated && (
                <div
                  style={{
                    marginTop: 14,
                    fontSize: 12,
                    color: D.g7,
                    fontStyle: "italic",
                    fontFamily: D.f,
                    textAlign: "center",
                    ...entryAnim("0.3s"),
                  }}
                >
                  Same operation on both sides keeps balance!
                </div>
              )}
            </>
          )}

          {ph === "simplified1" && (
            <>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: D.p,
                  marginBottom: 14,
                  letterSpacing: 2.5,
                  textTransform: "uppercase" as const,
                  fontFamily: D.f,
                  textAlign: "center",
                }}
              >
                Simplified
              </div>
              <div style={{ ...entryAnim("0.1s"), marginBottom: 10 }}>
                <MathBlock fs="20px">
                  <span>
                    {s.a}
                    {vr}
                  </span>
                  <Strike>
                    <span style={{ color: D.g4 }}>
                      &nbsp;{cs} {as2}&nbsp;
                    </span>
                  </Strike>
                  <span>&nbsp;=&nbsp;</span>
                  <span>
                    {s.c} {as2}
                  </span>
                </MathBlock>
              </div>
              {animated && (
                <div
                  style={{
                    ...entryAnim("0.2s"),
                    marginTop: 10,
                    textAlign: "center",
                  }}
                >
                  <MathBlock fs="34px">
                    <span style={{ color: D.p }}>
                      {s.a}
                      {vr}
                    </span>
                    <span> = </span>
                    <span style={{ color: D.ac }}>{s.after}</span>
                  </MathBlock>
                </div>
              )}
              {animated && (
                <div
                  style={{
                    marginTop: 16,
                    textAlign: "center",
                    ...entryAnim("0.3s"),
                  }}
                >
                  <span
                    style={{
                      padding: "6px 18px",
                      borderRadius: D.rf,
                      background: `${D.ok}10`,
                      border: `1.5px solid ${D.ok}44`,
                      fontSize: 12,
                      fontWeight: 600,
                      color: D.ok,
                      fontFamily: D.f,
                    }}
                  >
                    Constant term removed!
                  </span>
                </div>
              )}
            </>
          )}

          {ph === "divide5" && (
            <>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: D.p,
                  marginBottom: 14,
                  letterSpacing: 2.5,
                  textTransform: "uppercase" as const,
                  fontFamily: D.f,
                  textAlign: "center",
                }}
              >
                Dividing both sides by {s.a}
              </div>
              <div style={entryAnim("0.1s")}>
                <MathBlock fs="28px">
                  <Frac
                    n={
                      <span>
                        {s.a}
                        {vr}
                      </span>
                    }
                    d={<Hi>{s.a}</Hi>}
                    c={D.p}
                  />
                  <span style={{ margin: "0 10px" }}>=</span>
                  <Frac
                    n={<span>{s.after}</span>}
                    d={<Hi v="a">{s.a}</Hi>}
                    c={D.ac}
                  />
                </MathBlock>
              </div>
              {animated && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 40,
                    marginTop: 18,
                    ...entryAnim("0.2s"),
                  }}
                >
                  {badge(`\u00F7 ${s.a}`, "p")}
                  {badge(`\u00F7 ${s.a}`, "a")}
                </div>
              )}
            </>
          )}

          {ph === "solution" && (
            <>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: D.p,
                  marginBottom: 14,
                  letterSpacing: 2.5,
                  textTransform: "uppercase" as const,
                  fontFamily: D.f,
                  textAlign: "center",
                }}
              >
                Solution Found!
              </div>
              <div style={{ ...entryAnim("0.1s"), textAlign: "center" }}>
                <div
                  style={{
                    display: "inline-block",
                    padding: "16px 36px",
                    borderRadius: D.rl,
                    background: `linear-gradient(135deg,${D.lavL},${D.pchL})`,
                    border: `2px solid ${D.p}33`,
                    animation: animated
                      ? "sgGlow 2.5s ease-in-out infinite"
                      : "none",
                  }}
                >
                  <MathBlock fs="40px">
                    <span style={{ color: D.p }}>{vr}</span>
                    <span> = </span>
                    <Frac
                      n={<span style={{ color: D.ac }}>{s.xN}</span>}
                      d={<span style={{ color: D.ac }}>{s.xD}</span>}
                      fs="36px"
                      c={D.ac}
                    />
                  </MathBlock>
                </div>
              </div>
              {animated && (
                <div
                  style={{
                    marginTop: 12,
                    fontSize: 14,
                    color: D.g7,
                    fontFamily: D.f,
                    textAlign: "center",
                    ...entryAnim("0.2s"),
                  }}
                >
                  {s.xN % s.xD === 0
                    ? `= ${s.xN / s.xD}`
                    : `\u2248 ${s.xDec.toFixed(2)}`}
                </div>
              )}
            </>
          )}

          {ph === "verify" && (
            <>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: D.p,
                  marginBottom: 14,
                  letterSpacing: 2.5,
                  textTransform: "uppercase" as const,
                  fontFamily: D.f,
                  textAlign: "center",
                }}
              >
                Verification
              </div>
              <div style={entryAnim("0.1s")}>
                <MathBlock fs="20px">
                  <span style={{ color: D.g7 }}>LHS =&nbsp;</span>
                  <span>{s.a} \u00D7 </span>
                  <Frac n={s.xN} d={s.xD} fs="18px" c={D.p} />
                  <span>&nbsp;{cs}</span>
                </MathBlock>
              </div>
              {va >= 1 && (
                <div
                  style={{
                    animation: "sgUp 0.4s ease-out both",
                    marginTop: 10,
                  }}
                >
                  <MathBlock fs="20px">
                    <span>
                      = {s.after} {cs} ={" "}
                    </span>
                    <Hi v="a">{s.c}</Hi>
                  </MathBlock>
                </div>
              )}
              {va >= 2 && (
                <div
                  style={{
                    animation: "sgBounce 0.6s ease-out both",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    marginTop: 16,
                    padding: "12px 24px",
                    borderRadius: D.rf,
                    background: `${D.ok}0D`,
                    border: `2px solid ${D.ok}55`,
                  }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      background: D.ok,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Check size={16} color="#fff" />
                  </div>
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: D.ok,
                      fontFamily: D.f,
                    }}
                  >
                    LHS = RHS = {s.c} — Verified!
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  // ═══ PRACTICE (5 MCQs) ═══
  const renderPractice = () => {
    const d = cur?.data;
    if (!d?.options) return null;
    const ok = selOpt === d.correctIndex;
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
          padding: "12px 16px",
          width: "100%",
          ...entryAnim(),
        }}
      >
        <div
          style={{
            background: D.w,
            borderRadius: D.rl,
            padding: "20px 26px",
            boxShadow: D.sh,
            border: `1.5px solid ${D.g2}`,
            width: "100%",
            maxWidth: 520,
            textAlign: "center",
            fontFamily: D.f,
            fontSize: 15,
            fontWeight: 600,
            color: D.g9,
          }}
        >
          {d.question}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            width: "100%",
            maxWidth: 520,
          }}
        >
          {d.options.map((o: string, i: number) => {
            const sel = selOpt === i;
            const right = i === d.correctIndex;
            let extraStyle: React.CSSProperties = {};
            if (fb && right)
              extraStyle = {
                borderColor: D.ok,
                background: `${D.ok}12`,
                animation: "sgPop 0.4s ease-out both",
              };
            else if (fb && sel && !right)
              extraStyle = {
                borderColor: D.er,
                background: `${D.er}0D`,
                animation: "sgShake 0.4s ease-in-out",
              };
            return (
              <button
                key={i}
                className="sg-opt"
                onClick={() => {
                  if (!fb) {
                    setSelOpt(i);
                    setFb(true);
                  }
                }}
                disabled={fb}
                style={{
                  ...extraStyle,
                  animationDelay: fb ? "0s" : `${i * 0.06}s`,
                  opacity: 0,
                  animation: fb
                    ? extraStyle.animation
                    : `sgUp 0.35s ease-out ${i * 0.06}s both`,
                }}
              >
                {o}
                {fb && right && (
                  <span style={{ marginLeft: 6, color: D.ok, fontWeight: 800 }}>
                    {"\u2713"}
                  </span>
                )}
                {fb && sel && !right && (
                  <span style={{ marginLeft: 6, color: D.er, fontWeight: 800 }}>
                    {"\u2717"}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {fb && (
          <div
            style={{
              animation: "sgUp 0.3s ease-out both",
              padding: "10px 20px",
              borderRadius: D.rf,
              background: ok ? `${D.ok}0D` : `${D.er}0D`,
              border: `1.5px solid ${ok ? D.ok : D.er}44`,
              color: ok ? D.ok : D.er,
              fontWeight: 600,
              fontSize: 13,
              fontFamily: D.f,
            }}
          >
            {ok
              ? "\u2713 Correct! Well done!"
              : `Not quite. Answer: ${d.options[d.correctIndex]}`}
          </div>
        )}
      </div>
    );
  };

  // ═══ REAL WORLD ═══
  const renderReal = () => {
    const ctx = cur?.data?.context;
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
          padding: "12px 16px",
          width: "100%",
          ...entryAnim(),
        }}
      >
        {ctx === "scale" && (
          <svg
            width="380"
            height="200"
            viewBox="0 0 380 200"
            style={entryAnim()}
          >
            <defs>
              <linearGradient id="sg2">
                <stop offset="0%" stopColor={D.p} />
                <stop offset="100%" stopColor={D.ac} />
              </linearGradient>
            </defs>
            <polygon points="190,192 177,148 203,148" fill="url(#sg2)" />
            <line
              x1="38"
              y1="140"
              x2="342"
              y2="140"
              stroke="url(#sg2)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <rect
              x="28"
              y="104"
              width="140"
              height="36"
              rx="10"
              fill={D.lav}
              opacity="0.3"
              stroke={D.p}
              strokeWidth="2"
            />
            <text
              x="98"
              y="128"
              textAnchor="middle"
              fontSize="16"
              fontWeight="700"
              fill={D.p}
              fontFamily={D.f}
            >
              5x {cs}
            </text>
            <rect
              x="212"
              y="104"
              width="140"
              height="36"
              rx="10"
              fill={D.pch}
              opacity="0.4"
              stroke={D.ac}
              strokeWidth="2"
            />
            <text
              x="282"
              y="128"
              textAnchor="middle"
              fontSize="16"
              fontWeight="700"
              fill={D.ac}
              fontFamily={D.f}
            >
              7
            </text>
            <text
              x="190"
              y="96"
              textAnchor="middle"
              fontSize="22"
              fontWeight="800"
              fill={D.g9}
              fontFamily={D.f}
            >
              =
            </text>
          </svg>
        )}
        {ctx === "coins" && (
          <div
            style={{
              background: D.w,
              borderRadius: D.rl,
              padding: "24px 30px",
              boxShadow: D.shL,
              border: `1.5px solid ${D.g2}`,
              maxWidth: 480,
              textAlign: "center",
              position: "relative" as const,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute" as const,
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: `linear-gradient(90deg,${D.p},${D.ac})`,
              }}
            />
            <div
              style={{
                fontSize: 48,
                marginBottom: 12,
                animation: "sgFloat 3s ease-in-out infinite",
              }}
            >
              🪙
            </div>
            <p
              style={{
                color: D.g9,
                fontSize: 14,
                lineHeight: 1.7,
                fontFamily: D.f,
                margin: "0 0 14px",
                fontWeight: 500,
              }}
            >
              5 times her coins, minus 4, equals 7.
            </p>
            <MathBlock fs="20px">
              <span style={{ color: D.p }}>
                5{vr} {cs} = 7
              </span>
              <span style={{ margin: "0 8px", color: D.g4 }}>{"\u27F9"}</span>
              <span style={{ color: D.ac }}>{vr} = </span>
              <Frac n={sol.xN} d={sol.xD} fs="18px" c={D.ac} />
            </MathBlock>
          </div>
        )}
      </div>
    );
  };

  // ═══ HANDS ON ═══
  const renderHands = () => {
    const lhs = sol.a * slider + sol.b;
    const isEq = Math.abs(lhs - sol.c) < 0.05;
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          padding: "12px 16px",
          width: "100%",
          ...entryAnim(),
        }}
      >
        <div
          style={{
            background: D.w,
            borderRadius: D.rl,
            padding: "24px 30px",
            boxShadow: D.shL,
            border: `1.5px solid ${D.g2}`,
            width: "100%",
            maxWidth: 480,
            textAlign: "center",
            position: "relative" as const,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute" as const,
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: `linear-gradient(90deg,${D.p},${D.ac})`,
            }}
          />
          <MathBlock fs="24px">
            <span style={{ color: D.p }}>
              {sol.a}({slider.toFixed(1)})
            </span>
            <span> {cs} = </span>
            <span
              style={{
                fontWeight: 800,
                color: isEq ? D.ok : D.ac,
                transition: "color 0.2s",
              }}
            >
              {lhs.toFixed(1)}
            </span>
          </MathBlock>
          <div style={{ marginTop: 14, fontFamily: D.f }}>
            <span style={{ fontSize: 13, color: D.g7 }}>Target: </span>
            <span style={{ fontSize: 20, fontWeight: 800, color: D.ac }}>
              {sol.c}
            </span>
          </div>
          <div
            style={{
              marginTop: 12,
              padding: "7px 18px",
              borderRadius: D.rf,
              display: "inline-block",
              background: isEq ? `${D.ok}0D` : D.pch,
              border: `1.5px solid ${isEq ? D.ok : D.ac}44`,
              transition: "all 0.3s ease",
            }}
          >
            <span
              style={{
                fontWeight: 700,
                fontSize: 13,
                fontFamily: D.f,
                color: isEq ? D.ok : D.ac,
              }}
            >
              {isEq
                ? "\u2713 LHS = RHS! Solved!"
                : `Off by ${Math.abs(lhs - sol.c).toFixed(1)}`}
            </span>
          </div>
        </div>
        <div style={{ width: "100%", maxWidth: 420, textAlign: "center" }}>
          <label
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: D.p,
              fontFamily: D.f,
            }}
          >
            {vr} = {slider.toFixed(1)}
          </label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={slider}
            onChange={(e) => setSlider(parseFloat(e.target.value))}
            style={{ width: "100%", marginTop: 10, accentColor: D.p }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 11,
              color: D.g4,
              fontFamily: D.f,
              marginTop: 3,
            }}
          >
            <span>0</span>
            <span>5</span>
          </div>
        </div>
      </div>
    );
  };

  const content =
    mode === "learn"
      ? renderLearn
      : mode === "practice"
        ? renderPractice
        : mode === "real_world"
          ? renderReal
          : renderHands;

  return (
    <div
      style={{
        width: cfg.w,
        maxWidth: "100%",
        minHeight: cfg.h,
        fontFamily: D.f,
        background: `linear-gradient(170deg,${D.w} 0%,${D.lavL} 35%,${D.pchL} 70%,${D.w} 100%)`,
        borderRadius: D.rl,
        overflow: "hidden",
        boxShadow:
          "0 16px 48px rgba(74,77,201,0.08),0 2px 12px rgba(0,0,0,0.04)",
        display: "flex",
        flexDirection: "column",
        position: "relative" as const,
      }}
    >
      {/* Header */}
      <div style={{ padding: "20px 28px 14px", position: "relative" as const }}>
        <div
          style={{
            position: "absolute" as const,
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg,${D.p},${D.ac})`,
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: D.r,
              background: `linear-gradient(135deg,${D.gs},${D.ge})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: D.sh,
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 20 }}>🧮</span>
          </div>
          <div>
            <h2
              style={{ margin: 0, fontSize: 18, fontWeight: 800, color: D.g9 }}
            >
              Equation Solver: <span style={{ color: D.p }}>5</span>
              <span style={{ color: D.p, fontStyle: "italic" }}>x</span>
              <span style={{ color: D.g7 }}> {cs} = </span>
              <span style={{ color: D.ac }}>7</span>
            </h2>
            <p
              style={{
                margin: "2px 0 0",
                fontSize: 11,
                color: D.g7,
                fontWeight: 500,
              }}
            >
              Step-by-step with inverse operations & verification
            </p>
          </div>
        </div>
      </div>

      {/* Mode Tabs */}
      {cfg.showModes && (
        <div
          style={{
            display: "flex",
            gap: 7,
            padding: "0 28px 12px",
            overflowX: "auto",
          }}
        >
          {cfg.modes.map((m) => {
            const mi = modeInfo[m];
            const act = mode === m;
            return (
              <button
                key={m}
                className={`sg-btn ${act ? "sg-btn-c" : "sg-btn-o"}`}
                onClick={() => chgMode(m)}
                style={act ? {} : { borderColor: D.lav, color: D.g7 }}
              >
                {mi.emoji}&nbsp;{mi.label}
              </button>
            );
          })}
        </div>
      )}

      <div
        style={{
          height: 1,
          background: `linear-gradient(90deg,transparent,${D.lav},${D.pch},transparent)`,
          margin: "0 28px",
        }}
      />

      {/* Step Title */}
      <div
        style={{
          padding: "14px 28px 6px",
          ...(visible
            ? { animation: "sgLt 0.35s ease-out both" }
            : { opacity: 0 }),
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <span
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              fontSize: 12,
              fontWeight: 700,
              background: `linear-gradient(135deg,${D.p},${D.ac})`,
              color: D.w,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {si + 1}
          </span>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: D.g9 }}>
            {cur?.title}
          </h3>
        </div>
        <p
          style={{
            margin: "5px 0 0 35px",
            fontSize: 13,
            color: D.g7,
            lineHeight: 1.6,
            fontWeight: 450,
          }}
        >
          {cur?.description}
        </p>
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2px 8px 10px",
          minHeight: 240,
        }}
      >
        {content()}
      </div>

      {/* Progress */}
      <div style={{ padding: "0 28px", marginBottom: 7 }}>
        <div
          style={{
            width: "100%",
            height: 4,
            borderRadius: 2,
            background: D.g2,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${((si + 1) / ms.length) * 100}%`,
              height: "100%",
              background: `linear-gradient(90deg,${D.p},${D.ac})`,
              borderRadius: 2,
              transition: "width 0.4s ease",
            }}
          />
        </div>
      </div>

      {/* Nav */}
      {cfg.showNav && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 28px 16px",
          }}
        >
          <div style={{ display: "flex", gap: 7 }}>
            <button
              className="sg-btn sg-btn-o"
              disabled={si === 0}
              onClick={prev}
              style={{ width: 36, padding: 0 }}
            >
              <ChevronLeft size={17} />
            </button>
            {cfg.showPlay && mode === "learn" && (
              <button
                className={`sg-btn ${playing ? "sg-btn-c" : "sg-btn-o"}`}
                onClick={() => setPlaying(!playing)}
                style={{ width: 36, padding: 0 }}
              >
                {playing ? <Pause size={14} /> : <Play size={14} />}
              </button>
            )}
            <button
              className="sg-btn sg-btn-o"
              disabled={si >= ms.length - 1}
              onClick={next}
              style={{ width: 36, padding: 0 }}
            >
              <ChevronRight size={17} />
            </button>
          </div>
          {cfg.showDots && (
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              {ms.map((_, i) => (
                <div
                  key={i}
                  onClick={() => setSi(i)}
                  style={{
                    width: i === si ? 22 : 7,
                    height: 7,
                    borderRadius: 4,
                    cursor: "pointer",
                    background:
                      i === si
                        ? `linear-gradient(90deg,${D.p},${D.ac})`
                        : i < si
                          ? D.lav
                          : D.g2,
                    transition: "all 0.35s ease",
                    boxShadow: i === si ? `0 2px 6px ${D.p}44` : "none",
                  }}
                />
              ))}
            </div>
          )}
          <button
            className="sg-btn sg-btn-t"
            onClick={resetAll}
            style={{ width: 36, padding: 0 }}
          >
            <RotateCcw size={15} />
          </button>
        </div>
      )}
    </div>
  );
};

export default EquationSolverTool;
