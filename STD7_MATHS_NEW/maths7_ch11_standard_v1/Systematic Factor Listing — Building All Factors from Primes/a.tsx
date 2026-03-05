// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: systematic_factor_listing_tool.tsx
// Design System: Singularity — Poppins, #4A4DC9/#FF7212 palette, pill buttons
// ═══════════════════════════════════════════════════════════════════════════

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  // @ts-ignore - react types resolved by project or bundler
} from "react";
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Check,
  BookOpen,
  Award,
  Eye,
  EyeOff,
  Lightbulb,
  // @ts-ignore - lucide-react types resolved by project or bundler
} from "lucide-react";

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
  teachingNote: string;
  mode: ModeType;
  selectedBlocks: number[];
  factors: number[];
  combination: string;
}

interface FactorListingAdditionalProps {
  number?: number;
  primeFactors?: number[];
  accentColor?: string;
}

interface FactorListingToolProps {
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
    additionalProps?: FactorListingAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ═══════════════════════════════════════════════════════════════
// SINGULARITY DESIGN SYSTEM — exact values from PDF spec
// ═══════════════════════════════════════════════════════════════

const DS = {
  // ── Primary Colors ──
  indigo: "#4A4DC9",
  orange: "#FF7212",
  // ── Gradient Anchors ──
  deepPurple: "#533086",
  warmOrange: "#FC9145",
  // ── Light Tints ──
  lavender: "#C1C1EA",
  peach: "#FFF3E4",
  // ── Neutrals ──
  charcoal: "#4E4E4E",
  grey: "#CACACA",
  lightGrey: "#EBEBEB",
  offWhite: "#F5F5F5",
  white: "#FFFFFF",
  // ── Semantic ──
  success: "#27AE60",
  // ── Typography ──
  font: "'Poppins', sans-serif",
  // ── Button Spec (from PDF) ──
  btnH: 40,
  btnPadX: 24,
  btnR: 24, // pill radius
  iconGap: 4, // gap between icon and label
  // ── Card ──
  cardR: 16,
  // ── Shadows ──
  sh1: "0 1px 4px rgba(74,77,201,0.06)",
  sh2: "0 4px 16px rgba(74,77,201,0.10)",
  sh3: "0 8px 32px rgba(74,77,201,0.14)",
  shOrange: "0 4px 16px rgba(255,114,18,0.22)",
} as const;

// Gradient presets
const G = {
  header: `linear-gradient(135deg, ${DS.deepPurple} 0%, ${DS.indigo} 45%, ${DS.warmOrange} 100%)`,
  subtle: `linear-gradient(135deg, ${DS.lavender}30 0%, ${DS.peach}60 100%)`,
  contained: `linear-gradient(135deg, ${DS.indigo} 0%, ${DS.deepPurple} 100%)`,
  highlight: `linear-gradient(135deg, ${DS.orange} 0%, ${DS.warmOrange} 100%)`,
  bar: `linear-gradient(90deg, ${DS.deepPurple}, ${DS.indigo}, ${DS.warmOrange})`,
};

// ==================== STEP DATA ====================

const STEPS: StepDataInterface[] = [
  {
    id: 0,
    title: "Prime Factorisation of 225",
    description:
      "We factorise 225 into its prime building blocks.\n225 = 5 × 45 = 5 × 5 × 9 = 5 × 5 × 3 × 3\nSo, 225 = 3 × 3 × 5 × 5",
    teachingNote:
      "Show the prime factorisation and introduce the building-block metaphor. Every factor of 225 can be made by picking some of these blocks.",
    mode: "learn",
    selectedBlocks: [],
    factors: [],
    combination: "225 = 3 × 3 × 5 × 5",
  },
  {
    id: 1,
    title: "The Empty Subpart — Factor 1",
    description:
      "What if we pick ZERO blocks? We get 1!\n1 is always a factor of every number.\n225 ÷ 1 = 225 ✓",
    teachingNote:
      "Add 1 — the empty subpart. Picking no blocks at all gives the factor 1.",
    mode: "learn",
    selectedBlocks: [],
    factors: [1],
    combination: "No blocks → 1",
  },
  {
    id: 2,
    title: "Single Prime Factors",
    description:
      "Pick ONE block at a time:\n• Pick a 3 → factor is 3\n• Pick a 5 → factor is 5\nThese are the prime factors themselves!",
    teachingNote:
      "Form single-prime factors. Each individual prime is a factor.",
    mode: "learn",
    selectedBlocks: [0],
    factors: [1, 3, 5],
    combination: "One block → 3, 5",
  },
  {
    id: 3,
    title: "Pairs of Prime Factors",
    description:
      "Pick TWO blocks and multiply:\n• 3 × 3 = 9\n• 3 × 5 = 15\n• 5 × 5 = 25\nNotice: 3 × 3 is valid — we have two 3s!",
    teachingNote:
      "Form all pairs — emphasise that 3×3 is valid since we have two 3s in the factorisation.",
    mode: "learn",
    selectedBlocks: [0, 1],
    factors: [1, 3, 5, 9, 15, 25],
    combination: "Two blocks → 9, 15, 25",
  },
  {
    id: 4,
    title: "Triples of Prime Factors",
    description:
      "Pick THREE blocks and multiply:\n• 3 × 3 × 5 = 45\n• 3 × 5 × 5 = 75\nWe're combining more building blocks!",
    teachingNote: "Triples — three prime factors multiplied together.",
    mode: "learn",
    selectedBlocks: [0, 1, 2],
    factors: [1, 3, 5, 9, 15, 25, 45, 75],
    combination: "Three blocks → 45, 75",
  },
  {
    id: 5,
    title: "All Four — The Number Itself",
    description:
      "Pick ALL FOUR blocks:\n• 3 × 3 × 5 × 5 = 225\nUsing every block gives back the original number!",
    teachingNote:
      "All four prime factors = 225 itself. The number is always its own factor.",
    mode: "learn",
    selectedBlocks: [0, 1, 2, 3],
    factors: [1, 3, 5, 9, 15, 25, 45, 75, 225],
    combination: "All four blocks → 225",
  },
  {
    id: 6,
    title: "Verification — All 9 Factors!",
    description:
      "225 has exactly 9 factors:\n1, 3, 5, 9, 15, 25, 45, 75, 225\nLet's verify: each one divides 225 perfectly!",
    teachingNote:
      "Verify completeness. Check each factor divides 225 with no remainder.",
    mode: "learn",
    selectedBlocks: [],
    factors: [1, 3, 5, 9, 15, 25, 45, 75, 225],
    combination: "Complete! 9 factors total",
  },
];

// ==================== COMPONENT ====================

type PropsConfig = NonNullable<FactorListingToolProps["props"]>;

const SystematicFactorListingTool: React.FC<FactorListingToolProps> = ({
  props = {} as PropsConfig,
  setStepDetails,
  stopAutoNext,
  setStopAutoNext,
}) => {
  const ap = props.additionalProps ?? {};
  const number = ap.number ?? 225;
  const primeFactors = ap.primeFactors ?? [3, 3, 5, 5];

  const cfg = {
    w: props.width ?? 800,
    h: props.height ?? 620,
    speed: props.animationSpeed ?? 1,
    autoMs: props.autoPlayDuration ?? 6000,
    nav: props.showNavigation !== false,
    play: props.showPlayPause !== false,
    indicator: props.showStepIndicator !== false,
  };

  // ── State ──
  const [step, setStep] = useState(props.initialStep ?? 0);
  const [paused, setPaused] = useState(true);
  const [animFactor, setAnimFactor] = useState<number | null>(null);
  const [showVerify, setShowVerify] = useState(false);
  const [verified, setVerified] = useState<number[]>([]);
  const [hBlock, setHBlock] = useState<number | null>(null);
  const [hFactor, setHFactor] = useState<number | null>(null);
  const [activeBlocks, setActiveBlocks] = useState<number[]>([]);
  const [groceryOpen, setGroceryOpen] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [hBtn, setHBtn] = useState<string | null>(null);
  const [pressedBtn, setPressedBtn] = useState<string | null>(null);
  const autoRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Keyframes injection ──
  useEffect(() => {
    const el = document.createElement("style");
    el.id = "sg-factor-v2";
    el.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
      @keyframes sg-up{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
      @keyframes sg-scale{from{opacity:0;transform:scale(.82)}to{opacity:1;transform:scale(1)}}
      @keyframes sg-pop{0%{transform:scale(0);opacity:0}65%{transform:scale(1.14)}100%{transform:scale(1);opacity:1}}
      @keyframes sg-slide{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
      @keyframes sg-pulse{0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(74,77,201,.3)}50%{transform:scale(1.06);box-shadow:0 0 0 12px rgba(74,77,201,0)}}
      @keyframes sg-shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
      @keyframes sg-check{from{stroke-dashoffset:24}to{stroke-dashoffset:0}}
      @keyframes sg-drop{0%{opacity:0;transform:translateY(-44px) scale(.55)}60%{opacity:1;transform:translateY(5px) scale(1.03)}100%{transform:translateY(0) scale(1)}}
      @keyframes sg-slot{0%{opacity:0;transform:translateX(28px)}100%{opacity:1;transform:translateX(0)}}
      @keyframes sg-flash{0%{background:transparent}50%{background:rgba(74,77,201,.05)}100%{background:transparent}}
      @keyframes sg-star{0%{opacity:0;transform:scale(0) rotate(0)}50%{opacity:1;transform:scale(1.25) rotate(180deg)}100%{transform:scale(1) rotate(360deg)}}
      @keyframes sg-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
      @keyframes sg-drift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
      @keyframes sg-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
      @keyframes sg-reveal{from{opacity:0;transform:scale(.45) rotate(-8deg)}to{opacity:1;transform:scale(1) rotate(0)}}
    `;
    document.head.appendChild(el);
    return () => {
      document.getElementById("sg-factor-v2")?.remove();
    };
  }, []);

  // ── Step management ──
  const filtered = useMemo(
    () =>
      props.filterSteps
        ? STEPS.filter((s) => props.filterSteps!.includes(s.id))
        : STEPS,
    [props.filterSteps],
  );

  const data = filtered[step] || filtered[0];

  useEffect(() => {
    setStepDetails?.({
      currentStep: step,
      totalSteps: filtered.length,
      isPaused: paused,
      currentMode: "learn",
    });
  }, [step, paused, filtered.length]);

  useEffect(() => {
    if (!paused && cfg.autoMs > 0) {
      autoRef.current = setTimeout(() => {
        step < filtered.length - 1 ? go(step + 1) : setPaused(true);
      }, cfg.autoMs / cfg.speed);
    }
    return () => {
      if (autoRef.current) clearTimeout(autoRef.current);
    };
  }, [paused, step, cfg.autoMs, cfg.speed]);

  const go = useCallback(
    (s: number) => {
      setTransitioning(true);
      setTimeout(() => {
        setStep(s);
        setTransitioning(false);
        setShowVerify(s === filtered.length - 1);
        if (s === filtered.length - 1) setVerified([]);
      }, 160);
    },
    [filtered.length],
  );

  const next = useCallback(() => {
    if (step < filtered.length - 1) go(step + 1);
  }, [step, filtered.length, go]);
  const prev = useCallback(() => {
    if (step > 0) go(step - 1);
  }, [step, go]);
  const reset = useCallback(() => {
    setPaused(true);
    go(0);
    setVerified([]);
    setShowVerify(false);
  }, [go]);

  useEffect(() => {
    if (data.selectedBlocks.length > 0) {
      setActiveBlocks([]);
      data.selectedBlocks.forEach((idx, i) => {
        setTimeout(
          () => setActiveBlocks((p) => [...p, idx]),
          (i * 260) / cfg.speed,
        );
      });
    } else setActiveBlocks([]);
  }, [step, cfg.speed]);

  const prevFactors = step > 0 ? filtered[step - 1]?.factors || [] : [];
  const newFactors = data.factors.filter((f) => !prevFactors.includes(f));
  useEffect(() => {
    newFactors.forEach((f, i) => {
      setTimeout(
        () => {
          setAnimFactor(f);
          setTimeout(() => setAnimFactor(null), 520 / cfg.speed);
        },
        (i * 360) / cfg.speed,
      );
    });
  }, [step]);

  const doVerify = useCallback(
    (f: number) => {
      if (!verified.includes(f)) setVerified((p) => [...p, f]);
    },
    [verified],
  );

  useEffect(() => {
    if (showVerify && step === filtered.length - 1) {
      data.factors.forEach((f, i) =>
        setTimeout(() => doVerify(f), (i * 300) / cfg.speed),
      );
    }
  }, [showVerify, step]);

  // ═══════════════════════════════════════════════════════
  // SINGULARITY PILL BUTTON — 4 variants × 4 states
  // ═══════════════════════════════════════════════════════

  const pill = (
    v: "contained" | "outlined" | "highlight" | "text",
    id: string,
    disabled = false,
  ): React.CSSProperties => {
    const hover = hBtn === id && !disabled;
    const press = pressedBtn === id && !disabled;
    const base: React.CSSProperties = {
      height: DS.btnH,
      padding: `0 ${DS.btnPadX}px`,
      borderRadius: DS.btnR,
      fontFamily: DS.font,
      fontSize: 13,
      fontWeight: 600,
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "all .22s cubic-bezier(.4,0,.2,1)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: DS.iconGap + 2,
      border: "none",
      outline: "none",
      transform: press ? "scale(.96)" : hover ? "translateY(-1px)" : "none",
      userSelect: "none" as const,
    };
    switch (v) {
      case "contained":
        return {
          ...base,
          background: disabled
            ? DS.lightGrey
            : hover
              ? DS.deepPurple
              : DS.indigo,
          color: disabled ? DS.grey : DS.white,
          boxShadow: disabled ? "none" : hover ? DS.sh3 : DS.sh2,
        };
      case "outlined":
        return {
          ...base,
          background: disabled
            ? "transparent"
            : hover
              ? `${DS.indigo}0a`
              : "transparent",
          color: disabled ? DS.grey : DS.indigo,
          border: `2px solid ${disabled ? DS.lightGrey : hover ? DS.indigo : DS.lavender}`,
        };
      case "highlight":
        return {
          ...base,
          background: disabled ? DS.lightGrey : G.highlight,
          color: DS.white,
          boxShadow: disabled ? "none" : DS.shOrange,
        };
      case "text":
        return {
          ...base,
          background: hover ? `${DS.indigo}08` : "transparent",
          color: disabled ? DS.grey : DS.indigo,
        };
    }
  };

  const btnE = (id: string) => ({
    onMouseEnter: () => setHBtn(id),
    onMouseLeave: () => {
      setHBtn(null);
      setPressedBtn(null);
    },
    onMouseDown: () => setPressedBtn(id),
    onMouseUp: () => setPressedBtn(null),
  });

  // ═══════════════════════════════════════════════════════
  // DECORATIVE SHAPES (Singularity geometric elements)
  // ═══════════════════════════════════════════════════════

  const Shape: React.FC<{
    type: "circle" | "triangle" | "square";
    size: number;
    color: string;
    filled?: boolean;
    style?: React.CSSProperties;
  }> = ({ type, size, color, filled = false, style: s }) => {
    const bdr = `2px solid ${color}`;
    if (type === "circle")
      return (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            background: filled ? color : "transparent",
            border: filled ? "none" : bdr,
            opacity: filled ? 0.15 : 0.18,
            position: "absolute",
            pointerEvents: "none",
            ...s,
          }}
        />
      );
    if (type === "triangle")
      return (
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: `${size / 2}px solid transparent`,
            borderRight: `${size / 2}px solid transparent`,
            borderBottom: `${size * 0.87}px solid ${color}`,
            opacity: filled ? 0.12 : 0.16,
            position: "absolute",
            pointerEvents: "none",
            ...s,
          }}
        />
      );
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: 3,
          background: filled ? color : "transparent",
          border: filled ? "none" : bdr,
          opacity: filled ? 0.12 : 0.16,
          position: "absolute",
          pointerEvents: "none",
          ...s,
        }}
      />
    );
  };

  // ═══════════════════════════════════════════════════════
  // BUILDING BLOCK — indigo rounded-square for 3, orange circle for 5
  // ═══════════════════════════════════════════════════════

  const Block: React.FC<{ prime: number; idx: number }> = ({ prime, idx }) => {
    const on = activeBlocks.includes(idx);
    const last =
      activeBlocks.length > 0 && activeBlocks[activeBlocks.length - 1] === idx;
    const is3 = prime === 3;
    const c = is3 ? DS.indigo : DS.orange;
    const cL = is3 ? DS.lavender : DS.peach;
    const gr = is3 ? G.contained : G.highlight;
    const hov = hBlock === idx;
    return (
      <div
        onMouseEnter={() => setHBlock(idx)}
        onMouseLeave={() => setHBlock(null)}
        style={{
          width: 68,
          height: 68,
          borderRadius: is3 ? 14 : "50%",
          background: on ? gr : cL,
          border: `2.5px solid ${on ? c : `${c}50`}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: DS.font,
          fontSize: 26,
          fontWeight: 800,
          color: on ? DS.white : c,
          cursor: "pointer",
          transition: "all .3s cubic-bezier(.34,1.56,.64,1)",
          transform: hov
            ? "scale(1.12) rotate(-3deg)"
            : last
              ? "scale(1.04)"
              : "scale(1)",
          boxShadow: on
            ? `0 6px 22px ${c}45`
            : hov
              ? `0 4px 14px ${c}22`
              : DS.sh1,
          animation: last
            ? "sg-pulse .7s ease-in-out"
            : hov
              ? "sg-float 2.2s ease-in-out infinite"
              : "none",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {on && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, rgba(255,255,255,.22) 0%, transparent 55%)",
              borderRadius: is3 ? 12 : "50%",
            }}
          />
        )}
        <span style={{ position: "relative", zIndex: 1, lineHeight: 1 }}>
          {prime}
        </span>
        <span
          style={{
            fontSize: 7,
            fontWeight: 600,
            opacity: 0.6,
            marginTop: 2,
            position: "relative",
            zIndex: 1,
            letterSpacing: 0.8,
            textTransform: "uppercase" as const,
          }}
        >
          prime
        </span>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════
  // FACTOR CHIP — pill-shaped
  // ═══════════════════════════════════════════════════════

  const Chip: React.FC<{ factor: number; idx: number; isNew: boolean }> = ({
    factor,
    idx,
    isNew,
  }) => {
    const v = verified.includes(factor);
    const h = hFactor === factor;
    return (
      <div
        onMouseEnter={() => setHFactor(factor)}
        onMouseLeave={() => setHFactor(null)}
        onClick={() => showVerify && doVerify(factor)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          height: 36,
          padding: "0 15px",
          borderRadius: 18,
          background: v ? "#eafaf2" : h ? `${DS.lavender}40` : DS.white,
          border: `2px solid ${v ? DS.success : h ? DS.indigo : DS.lightGrey}`,
          fontFamily: DS.font,
          fontSize: 15,
          fontWeight: 700,
          color: v ? "#1a7a44" : DS.charcoal,
          animation:
            isNew && animFactor === factor
              ? "sg-drop .52s cubic-bezier(.34,1.56,.64,1) both"
              : `sg-slot .32s ease-out ${idx * 0.055}s both`,
          transition: "all .22s ease",
          transform: h ? "scale(1.06)" : "scale(1)",
          boxShadow: h ? DS.sh2 : DS.sh1,
          cursor: showVerify ? "pointer" : "default",
          position: "relative",
        }}
      >
        {factor}
        {v && (
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            style={{ animation: "sg-star .35s ease-out" }}
          >
            <path
              d="M3 8l3 3 7-7"
              fill="none"
              stroke="#1a7a44"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: 24,
                animation: "sg-check .3s ease-out forwards",
              }}
            />
          </svg>
        )}
        {showVerify && v && (
          <span
            style={{
              position: "absolute",
              top: -7,
              right: -7,
              fontSize: 9,
              fontWeight: 700,
              background: DS.success,
              color: DS.white,
              borderRadius: 9,
              padding: "1px 6px",
              fontFamily: DS.font,
              boxShadow: "0 2px 6px rgba(39,174,96,.3)",
              animation: "sg-reveal .25s ease-out",
            }}
          >
            ×{number / factor}
          </span>
        )}
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════
  // VERIFICATION GRID
  // ═══════════════════════════════════════════════════════

  const VerifyGrid = () => {
    if (!showVerify) return null;
    return (
      <div
        style={{
          marginTop: 12,
          padding: 14,
          borderRadius: 12,
          background: DS.offWhite,
          border: `2px dashed ${DS.lavender}`,
          animation: "sg-up .45s ease-out",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: DS.indigo,
            marginBottom: 8,
            fontFamily: DS.font,
            textTransform: "uppercase" as const,
            letterSpacing: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <Check size={13} strokeWidth={3} /> Verification: 225 ÷ factor
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {data.factors.map((f, i) => {
            const ok = verified.includes(f);
            return (
              <div
                key={f}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  height: 28,
                  padding: "0 10px",
                  borderRadius: 14,
                  background: ok ? "#eafaf2" : DS.white,
                  border: `1.5px solid ${ok ? DS.success : DS.lightGrey}`,
                  fontSize: 11,
                  fontFamily: DS.font,
                  fontWeight: 600,
                  color: ok ? "#1a7a44" : DS.grey,
                  animation: ok
                    ? `sg-pop .22s ease-out ${i * 0.04}s both`
                    : "none",
                  transition: "all .2s ease",
                }}
              >
                225 ÷ {f} = {number / f}
                {ok && <Check size={11} strokeWidth={3} color="#1a7a44" />}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════
  // GROCERY BAG ANALOGY
  // ═══════════════════════════════════════════════════════

  const Grocery = () => {
    const combos = [
      { items: [] as string[], result: "1" },
      { items: ["🫘"], result: "3" },
      { items: ["🍚"], result: "5" },
      { items: ["🫘", "🫘"], result: "9" },
      { items: ["🫘", "🍚"], result: "15" },
      { items: ["🍚", "🍚"], result: "25" },
    ];
    return (
      <div
        style={{
          padding: 14,
          borderRadius: DS.cardR,
          background: `linear-gradient(135deg, ${DS.peach}, ${DS.lavender}35)`,
          border: `1.5px solid ${DS.warmOrange}28`,
          animation: "sg-up .4s ease-out",
          marginTop: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: G.highlight,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: 12 }}>🛒</span>
          </div>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: DS.charcoal,
              fontFamily: DS.font,
              textTransform: "uppercase" as const,
              letterSpacing: 1,
            }}
          >
            Grocery Bag Analogy
          </span>
        </div>
        <p
          style={{
            fontSize: 11,
            color: DS.charcoal,
            margin: "0 0 10px",
            fontFamily: DS.font,
            lineHeight: 1.5,
            fontWeight: 400,
            opacity: 0.65,
          }}
        >
          2 packets of dal (= two 3s) and 2 packets of rice (= two 5s). Each
          combination = a factor!
        </p>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {combos.slice(0, step >= 3 ? 6 : step + 2).map((c, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                height: 28,
                padding: "0 9px",
                borderRadius: 14,
                background: DS.white,
                border: `1.5px solid ${DS.lightGrey}`,
                fontSize: 11,
                fontFamily: DS.font,
                fontWeight: 500,
                animation: `sg-bounce .4s ease-out ${i * 0.07}s`,
                boxShadow: DS.sh1,
              }}
            >
              <span>{c.items.join(" ") || "∅"}</span>
              <span style={{ color: DS.grey, fontSize: 9 }}>→</span>
              <span style={{ fontWeight: 700, color: DS.indigo }}>
                {c.result}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════

  return (
    <div
      style={{
        width: "100%",
        maxWidth: cfg.w,
        minHeight: cfg.h,
        background: DS.white,
        borderRadius: 20,
        overflow: "hidden",
        fontFamily: DS.font,
        boxShadow: DS.sh3,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        border: `1px solid ${DS.lightGrey}`,
      }}
    >
      {/* ════════ HEADER ════════ */}
      <div
        style={{
          background: G.header,
          backgroundSize: "200% 200%",
          animation: "sg-drift 10s ease infinite",
          padding: "18px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Shape
          type="circle"
          size={44}
          color={DS.white}
          style={{ top: -10, right: 70 }}
        />
        <Shape
          type="triangle"
          size={28}
          color={DS.white}
          style={{ bottom: -4, right: 24, transform: "rotate(10deg)" }}
        />
        <Shape
          type="square"
          size={18}
          color={DS.white}
          style={{ top: 10, right: 140, transform: "rotate(18deg)" }}
        />
        <Shape
          type="circle"
          size={14}
          color={DS.white}
          filled
          style={{ top: 6, right: 110 }}
        />

        <div
          style={{ display: "flex", alignItems: "center", gap: 14, zIndex: 1 }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: "rgba(255,255,255,.16)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(255,255,255,.14)",
            }}
          >
            <BookOpen size={20} color={DS.white} />
          </div>
          <div>
            <div
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: DS.white,
                letterSpacing: -0.2,
                lineHeight: 1.15,
              }}
            >
              Factor Building Blocks
            </div>
            <div
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,.6)",
                fontWeight: 500,
                marginTop: 2,
              }}
            >
              Systematic Factor Listing for {number}
            </div>
          </div>
        </div>

        {cfg.indicator && (
          <div
            style={{
              background: "rgba(255,255,255,.16)",
              backdropFilter: "blur(8px)",
              borderRadius: 20,
              padding: "5px 14px",
              fontSize: 12,
              fontWeight: 600,
              color: DS.white,
              zIndex: 1,
              border: "1px solid rgba(255,255,255,.12)",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <span style={{ fontWeight: 800, fontSize: 14 }}>{step + 1}</span>
            <span style={{ opacity: 0.45 }}>/</span>
            <span style={{ opacity: 0.65 }}>{filtered.length}</span>
          </div>
        )}
      </div>

      {/* ════════ PROGRESS BAR ════════ */}
      <div
        style={{ height: 3, background: DS.lightGrey, position: "relative" }}
      >
        <div
          style={{
            height: "100%",
            width: `${((step + 1) / filtered.length) * 100}%`,
            background: G.bar,
            transition: "width .5s cubic-bezier(.34,1.56,.64,1)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -3.5,
            left: 0,
            right: 0,
            height: 10,
            display: "flex",
            justifyContent: "space-between",
            padding: "0 20px",
          }}
        >
          {filtered.map((_, i) => (
            <div
              key={i}
              onClick={() => go(i)}
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: i <= step ? DS.indigo : DS.lightGrey,
                border: `2px solid ${i <= step ? DS.indigo : DS.grey}`,
                cursor: "pointer",
                transition: "all .25s ease",
                transform: i === step ? "scale(1.35)" : "scale(1)",
                boxShadow: i === step ? `0 0 0 3px ${DS.lavender}` : "none",
              }}
            />
          ))}
        </div>
      </div>

      {/* ════════ MAIN CONTENT ════════ */}
      <div
        style={{
          flex: 1,
          padding: "22px 24px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? "translateY(6px)" : "translateY(0)",
          transition: "all .18s ease",
          background: DS.white,
        }}
      >
        {/* Step Title */}
        <div
          style={{ display: "flex", gap: 14, animation: "sg-up .32s ease-out" }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: G.header,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: DS.white,
              fontWeight: 800,
              fontSize: 15,
              flexShrink: 0,
              boxShadow: DS.sh2,
            }}
          >
            {step + 1}
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: DS.charcoal,
                lineHeight: 1.25,
                marginBottom: 5,
              }}
            >
              {data.title}
            </div>
            <div
              style={{
                fontSize: 12.5,
                color: DS.charcoal,
                lineHeight: 1.6,
                fontWeight: 400,
                whiteSpace: "pre-line" as const,
                opacity: 0.7,
              }}
            >
              {data.description}
            </div>
          </div>
        </div>

        {/* BUILDING BLOCKS PANEL */}
        <div
          style={{
            background: DS.offWhite,
            borderRadius: DS.cardR,
            padding: "18px 20px",
            border: `1.5px solid ${DS.lightGrey}`,
            animation: "sg-scale .38s ease-out",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.025,
              backgroundImage: `radial-gradient(${DS.indigo} 1px, transparent 1px)`,
              backgroundSize: "18px 18px",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: DS.indigo,
              textTransform: "uppercase" as const,
              letterSpacing: 2,
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 7,
              position: "relative",
            }}
          >
            <div
              style={{
                width: 3,
                height: 14,
                borderRadius: 2,
                background: G.header,
              }}
            />
            Prime Factor Building Blocks
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 18,
              marginBottom: 14,
              position: "relative",
            }}
          >
            {primeFactors.map((p, i) => (
              <React.Fragment key={`bg-${i}`}>
                <Block prime={p} idx={i} />
                {i < primeFactors.length - 1 && (
                  <span
                    style={{
                      fontSize: 18,
                      fontWeight: 300,
                      color: DS.grey,
                      userSelect: "none" as const,
                    }}
                  >
                    ×
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>

          {step > 0 && (
            <div
              style={{
                textAlign: "center" as const,
                padding: "10px 18px",
                borderRadius: 12,
                background: DS.white,
                border: `1.5px dashed ${DS.lavender}`,
                animation: "sg-flash .8s ease-out",
                position: "relative",
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  color: DS.grey,
                  fontWeight: 600,
                  marginBottom: 3,
                  letterSpacing: 1.2,
                  textTransform: "uppercase" as const,
                }}
              >
                Combination
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: DS.indigo }}>
                {data.combination}
              </div>
            </div>
          )}

          {step === 0 && (
            <div
              style={{
                textAlign: "center" as const,
                padding: 14,
                borderRadius: 14,
                background: DS.white,
                border: `2px solid ${DS.lavender}`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(90deg, transparent, ${DS.lavender}30, transparent)`,
                  backgroundSize: "200% 100%",
                  animation: "sg-shimmer 4s infinite",
                }}
              />
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: DS.indigo,
                  marginBottom: 8,
                  position: "relative",
                  letterSpacing: 2,
                  textTransform: "uppercase" as const,
                }}
              >
                Division Method
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 4,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column" as const,
                    alignItems: "flex-end",
                    fontSize: 14,
                    fontWeight: 700,
                    lineHeight: 2,
                  }}
                >
                  <span style={{ color: DS.orange }}>5</span>
                  <span style={{ color: DS.orange }}>5</span>
                  <span style={{ color: DS.indigo }}>3</span>
                  <span style={{ color: DS.indigo }}>3</span>
                </div>
                <div
                  style={{
                    borderLeft: `2.5px solid ${DS.charcoal}`,
                    paddingLeft: 10,
                    display: "flex",
                    flexDirection: "column" as const,
                    fontSize: 14,
                    fontWeight: 700,
                    lineHeight: 2,
                    color: DS.charcoal,
                  }}
                >
                  <span>225</span>
                  <span>45</span>
                  <span>9</span>
                  <span>3</span>
                  <span style={{ color: DS.grey }}>1</span>
                </div>
              </div>
              <div
                style={{
                  marginTop: 10,
                  fontSize: 19,
                  fontWeight: 800,
                  color: DS.charcoal,
                  position: "relative",
                }}
              >
                225 = <span style={{ color: DS.indigo }}>3</span>
                <span style={{ color: DS.grey, fontWeight: 400 }}> × </span>
                <span style={{ color: DS.indigo }}>3</span>
                <span style={{ color: DS.grey, fontWeight: 400 }}> × </span>
                <span style={{ color: DS.orange }}>5</span>
                <span style={{ color: DS.grey, fontWeight: 400 }}> × </span>
                <span style={{ color: DS.orange }}>5</span>
              </div>
            </div>
          )}
        </div>

        {/* FACTOR LIST */}
        {data.factors.length > 0 && (
          <div
            style={{
              background: DS.white,
              borderRadius: DS.cardR,
              padding: "14px 18px",
              border: `1.5px solid ${DS.lightGrey}`,
              animation: "sg-slide .32s ease-out",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: DS.indigo,
                  textTransform: "uppercase" as const,
                  letterSpacing: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                }}
              >
                <div
                  style={{
                    width: 3,
                    height: 14,
                    borderRadius: 2,
                    background: G.highlight,
                  }}
                />
                Factor List — {data.factors.length}{" "}
                {data.factors.length === 1 ? "factor" : "factors"}
              </div>
              {step === filtered.length - 1 && (
                <div
                  style={{
                    ...pill("highlight", "comp"),
                    height: 26,
                    padding: "0 10px",
                    fontSize: 10,
                    animation: "sg-pulse 2.5s infinite",
                    borderRadius: 14,
                  }}
                >
                  <Award size={11} /> Complete!
                </div>
              )}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {data.factors.map((f, i) => (
                <Chip
                  key={f}
                  factor={f}
                  idx={i}
                  isNew={newFactors.includes(f)}
                />
              ))}
            </div>
            <VerifyGrid />
          </div>
        )}

        {/* GROCERY ANALOGY */}
        {step >= 1 && step <= 5 && (
          <div>
            <button
              onClick={() => setGroceryOpen(!groceryOpen)}
              {...btnE("groc")}
              style={pill("outlined", "groc")}
            >
              {groceryOpen ? <EyeOff size={14} /> : <Eye size={14} />}
              {groceryOpen ? "Hide" : "Show"} Grocery Analogy
            </button>
            {groceryOpen && <Grocery />}
          </div>
        )}

        {/* TEACHING NOTE */}
        <div
          style={{
            padding: "11px 14px",
            borderRadius: 12,
            background: `${DS.lavender}20`,
            borderLeft: `4px solid ${DS.indigo}`,
            fontSize: 11.5,
            color: DS.charcoal,
            lineHeight: 1.55,
            fontWeight: 400,
            animation: "sg-slide .35s ease-out .12s both",
            display: "flex",
            gap: 9,
            alignItems: "flex-start",
          }}
        >
          <Lightbulb
            size={15}
            color={DS.indigo}
            style={{ flexShrink: 0, marginTop: 1 }}
          />
          <div>
            <span style={{ fontWeight: 700, color: DS.indigo }}>
              Teaching Note:{" "}
            </span>
            <span style={{ opacity: 0.7 }}>{data.teachingNote}</span>
          </div>
        </div>
      </div>

      {/* ════════ NAVIGATION ════════ */}
      {cfg.nav && (
        <div
          style={{
            padding: "12px 24px",
            background: DS.offWhite,
            borderTop: `1px solid ${DS.lightGrey}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <button
            onClick={prev}
            disabled={step === 0}
            {...btnE("back")}
            style={pill("outlined", "back", step === 0)}
          >
            <ChevronLeft size={15} /> Back
          </button>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {cfg.play && (
              <button
                onClick={() => setPaused(!paused)}
                {...btnE("play")}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  border: `2px solid ${DS.indigo}`,
                  background: paused
                    ? G.contained
                    : hBtn === "play"
                      ? `${DS.indigo}08`
                      : "transparent",
                  color: paused ? DS.white : DS.indigo,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all .22s ease",
                  boxShadow: paused ? DS.sh2 : "none",
                  outline: "none",
                  transform: pressedBtn === "play" ? "scale(.94)" : "none",
                }}
              >
                {paused ? <Play size={15} /> : <Pause size={15} />}
              </button>
            )}
            <button
              onClick={reset}
              {...btnE("rst")}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: `2px solid ${DS.lightGrey}`,
                background: hBtn === "rst" ? DS.offWhite : "transparent",
                color: DS.grey,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all .22s ease",
                outline: "none",
                transform: pressedBtn === "rst" ? "scale(.94)" : "none",
              }}
            >
              <RotateCcw size={15} />
            </button>
          </div>

          <button
            onClick={next}
            disabled={step === filtered.length - 1}
            {...btnE("nxt")}
            style={pill("contained", "nxt", step === filtered.length - 1)}
          >
            Next <ChevronRight size={15} />
          </button>
        </div>
      )}

      {/* ════════ FOOTER ════════ */}
      <div
        style={{
          padding: "10px 24px",
          background: G.subtle,
          borderTop: `1px solid ${DS.lightGrey}`,
          fontSize: 11,
          fontWeight: 500,
          color: DS.charcoal,
          textAlign: "center" as const,
          lineHeight: 1.45,
          opacity: 0.65,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
      >
        <span style={{ color: DS.warmOrange }}>✦</span>
        Watch as we build every factor of {number} from its prime building
        blocks ({primeFactors.join(", ")}). Count along — how many factors does{" "}
        {number} have?
      </div>
    </div>
  );
};

export default SystematicFactorListingTool;
