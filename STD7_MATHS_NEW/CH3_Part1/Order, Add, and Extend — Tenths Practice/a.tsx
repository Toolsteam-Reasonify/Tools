import React, { useState, useEffect, useRef, useCallback } from "react";
import { Check, RotateCcw, Star, Award, Zap } from "lucide-react";

/* ══════════════════ SINGULARITY DESIGN SYSTEM TOKENS ══════════════════ */

const DS = {
  primary: "#4A4DC9",
  primaryDark: "#533086",
  accent: "#FF7212",
  accentMid: "#FC9145",
  primaryLight: "#C1C1EA",
  primaryLighter: "#E8E8F5",
  accentLight: "#FFF3E4",
  gray900: "#1A1A2E",
  gray700: "#4E4E4E",
  gray500: "#8A8A8A",
  gray400: "#ABABAB",
  gray300: "#CACACA",
  gray200: "#EBEBEB",
  gray100: "#F5F5F5",
  white: "#FFFFFF",
  success: "#2ECC71",
  successDark: "#1FA855",
  error: "#E74C3C",
  successLight: "#E8FAF0",
  gradHeader: "linear-gradient(135deg, #533086 0%, #4A4DC9 100%)",
  gradSuccess: "linear-gradient(135deg, #1FA855 0%, #2ECC71 100%)",
  shadowSm: "0 2px 8px rgba(74,77,201,0.08)",
  shadowMd: "0 4px 16px rgba(74,77,201,0.12)",
  shadowXl: "0 20px 60px rgba(83,48,134,0.18)",
  rSm: 8,
  rMd: 12,
  rLg: 16,
  rXl: 24,
  rPill: 40,
  font: "'Poppins','Segoe UI',sans-serif",
} as const;

/* ══════════════════ TYPE DEFINITIONS ══════════════════ */

type ModeType = "ordering" | "sequences";
type FeedbackType = "correct" | "wrong" | null;

interface TokenData {
  id: string;
  label: string;
  fracLabel: string;
  value: number;
  color: string;
}

interface SequenceData {
  id: string;
  label: string;
  given: number[];
  commonDiff: number;
  answers: number[];
  rangeMin: number;
  rangeMax: number;
}

interface StepDetails {
  currentStep: number;
  totalSteps: number;
  isPaused: boolean;
  currentMode: ModeType;
}

interface CelebParticle {
  x: number;
  y: number;
  id: number;
}

interface SeqDragState {
  seqId: string;
  idx: number;
}

interface OrderingSequencesToolProps {
  props?: {
    width?: number;
    height?: number;
    initialMode?: ModeType;
    showModeSelector?: boolean;
    themeColor?: string;
    darkMode?: boolean;
    animationSpeed?: number;
    additionalProps?: {
      tokens?: TokenData[];
      sequences?: SequenceData[];
      numberLineMin?: number;
      numberLineMax?: number;
      snapTolerance?: number;
    };
  };
  setStepDetails?: (s: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (v: boolean) => void;
}

/* ══════════════════ DEFAULT DATA ══════════════════ */

const DEF_TOKENS: TokenData[] = [
  {
    id: "a",
    label: "4/10",
    fracLabel: "\u2074\u2044\u2081\u2080",
    value: 0.4,
    color: DS.accent,
  },
  {
    id: "b",
    label: "4 1/10",
    fracLabel: "4\u00B9\u2044\u2081\u2080",
    value: 4.1,
    color: DS.primary,
  },
  {
    id: "c",
    label: "41/10",
    fracLabel: "\u2074\u00B9\u2044\u2081\u2080",
    value: 4.1,
    color: DS.primaryDark,
  },
  {
    id: "d",
    label: "41 1/10",
    fracLabel: "41\u00B9\u2044\u2081\u2080",
    value: 41.1,
    color: DS.error,
  },
];

const DEF_SEQS: SequenceData[] = [
  {
    id: "a",
    label: "(a)",
    given: [4, 4.3, 4.6],
    commonDiff: 0.3,
    answers: [4.9, 5.2, 5.5, 5.8],
    rangeMin: 4,
    rangeMax: 6,
  },
  {
    id: "b",
    label: "(b)",
    given: [8.2, 8.7, 9.2],
    commonDiff: 0.5,
    answers: [9.7, 10.2, 10.7, 11.2],
    rangeMin: 8,
    rangeMax: 12,
  },
  {
    id: "c",
    label: "(c)",
    given: [7.6, 8.7],
    commonDiff: 1.1,
    answers: [9.8, 10.9, 12.0, 13.1],
    rangeMin: 7,
    rangeMax: 14,
  },
  {
    id: "d",
    label: "(d)",
    given: [5.7, 5.3],
    commonDiff: -0.4,
    answers: [4.9, 4.5, 4.1, 3.7],
    rangeMin: 3,
    rangeMax: 6,
  },
  {
    id: "e",
    label: "(e)",
    given: [13.5, 13, 12.5],
    commonDiff: -0.5,
    answers: [12, 11.5, 11, 10.5],
    rangeMin: 10,
    rangeMax: 14,
  },
  {
    id: "f",
    label: "(f)",
    given: [11.5, 10.4, 9.3],
    commonDiff: -1.1,
    answers: [8.2, 7.1, 6.0, 4.9],
    rangeMin: 4,
    rangeMax: 12,
  },
];

/* ══════════════════ KEYFRAMES CSS ══════════════════ */

const KF: string = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
@keyframes fadeInUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes popIn{0%{transform:scale(0);opacity:0}60%{transform:scale(1.12)}100%{transform:scale(1);opacity:1}}
@keyframes pulseGlow{0%,100%{box-shadow:0 0 0 0 rgba(74,77,201,.35)}50%{box-shadow:0 0 0 14px rgba(74,77,201,0)}}
@keyframes pulseOrange{0%,100%{box-shadow:0 0 0 0 rgba(255,114,18,.35)}50%{box-shadow:0 0 0 14px rgba(255,114,18,0)}}
@keyframes confetti{0%{transform:translateY(0) rotate(0) scale(1);opacity:1}100%{transform:translateY(-100px) rotate(540deg) scale(0);opacity:0}}
@keyframes slideR{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
@keyframes wiggle{0%,100%{transform:rotate(0)}20%{transform:rotate(-4deg)}40%{transform:rotate(4deg)}60%{transform:rotate(-2deg)}80%{transform:rotate(2deg)}}
@keyframes samePulse{0%,100%{transform:scale(1);filter:drop-shadow(0 0 0 rgba(46,204,113,0))}50%{transform:scale(1.06);filter:drop-shadow(0 0 12px rgba(46,204,113,.5))}}
@keyframes drawIn{from{stroke-dashoffset:2000}to{stroke-dashoffset:0}}
@keyframes badgeFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@keyframes starSpin{from{transform:rotate(0) scale(1)}50%{transform:rotate(180deg) scale(1.3)}to{transform:rotate(360deg) scale(1)}}
`;

/* ══════════════════ MAIN COMPONENT ══════════════════ */

const OrderingSequencesTool: React.FC<OrderingSequencesToolProps> = ({
  props = {},
  setStepDetails,
}) => {
  const width: number = props.width || 800;
  const height: number = props.height || 600;
  const ap = props.additionalProps || {};
  const tokens: TokenData[] = ap.tokens || DEF_TOKENS;
  const sequences: SequenceData[] = ap.sequences || DEF_SEQS;
  const snapTol: number = ap.snapTolerance || 0.8;
  const nlPad: number = 50;
  const ordMin: number = 0;
  const ordMax: number = 45;

  const [mode, setMode] = useState<ModeType>(props.initialMode || "ordering");
  const [mounted, setMounted] = useState<boolean>(false);
  const [showInstr, setShowInstr] = useState<boolean>(true);
  const [hovTab, setHovTab] = useState<string | null>(null);

  const [placed, setPlaced] = useState<Record<string, number | null>>({});
  const [dragTok, setDragTok] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [ordDone, setOrdDone] = useState<boolean>(false);
  const [sameBadge, setSameBadge] = useState<boolean>(false);
  const [tokFb, setTokFb] = useState<Record<string, FeedbackType>>({});
  const [ordStmt, setOrdStmt] = useState<boolean>(false);
  const [celebs, setCelebs] = useState<CelebParticle[]>([]);

  const [seqIdx, setSeqIdx] = useState<number>(0);
  const [seqPlaced, setSeqPlaced] = useState<Record<string, (number | null)[]>>(
    {},
  );
  const [seqFb, setSeqFb] = useState<Record<string, FeedbackType[]>>({});
  const [seqDrag, setSeqDrag] = useState<SeqDragState | null>(null);
  const [seqDragPos, setSeqDragPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [seqDone, setSeqDone] = useState<Record<string, boolean>>({});
  const [score, setScore] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const nlRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!document.getElementById("os-kf-styles")) {
      const s = document.createElement("style");
      s.id = "os-kf-styles";
      s.textContent = KF;
      document.head.appendChild(s);
    }
    return () => {
      const el = document.getElementById("os-kf-styles");
      if (el) el.remove();
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const xFor = useCallback(
    (v: number, mn: number, mx: number, lw: number): number =>
      nlPad + ((v - mn) / (mx - mn)) * lw,
    [],
  );
  const vFor = useCallback(
    (x: number, mn: number, mx: number, lw: number): number => {
      const r = mn + ((x - nlPad) / lw) * (mx - mn);
      return Math.round(r * 10) / 10;
    },
    [],
  );

  const addCeleb = (x: number, y: number): void => {
    const id = Date.now() + Math.random();
    setCelebs((p) => [...p, { x, y, id }]);
    setTimeout(() => setCelebs((p) => p.filter((c) => c.id !== id)), 1200);
  };
  const resetOrd = (): void => {
    setPlaced({});
    setTokFb({});
    setOrdDone(false);
    setSameBadge(false);
    setOrdStmt(false);
  };
  const resetSeq = (sid: string): void => {
    setSeqPlaced((p) => {
      const c = { ...p };
      delete c[sid];
      return c;
    });
    setSeqFb((p) => {
      const c = { ...p };
      delete c[sid];
      return c;
    });
    setSeqDone((p) => ({ ...p, [sid]: false }));
  };

  const onTokDown = (id: string, e: React.MouseEvent): void => {
    e.preventDefault();
    setDragTok(id);
    setDragPos({ x: e.clientX, y: e.clientY });
  };
  const onSeqDown = (sid: string, idx: number, e: React.MouseEvent): void => {
    e.preventDefault();
    if (seqDone[sid]) return;
    setSeqDrag({ seqId: sid, idx });
    setSeqDragPos({ x: e.clientX, y: e.clientY });
  };

  const onMove = useCallback(
    (e: MouseEvent): void => {
      if (dragTok) setDragPos({ x: e.clientX, y: e.clientY });
      if (seqDrag) setSeqDragPos({ x: e.clientX, y: e.clientY });
    },
    [dragTok, seqDrag],
  );

  const dropSeq = useCallback(
    (e: MouseEvent): void => {
      if (!seqDrag || !nlRef.current) return;
      const { seqId, idx } = seqDrag;
      const seq = sequences.find((s) => s.id === seqId);
      if (!seq) return;
      const r = nlRef.current.getBoundingClientRect();
      const lw = r.width - 2 * nlPad;
      const rx = e.clientX - r.left;
      const ry = e.clientY - r.top;
      if (
        ry >= -40 &&
        ry <= r.height + 40 &&
        rx >= nlPad - 25 &&
        rx <= r.width - nlPad + 25
      ) {
        const v = vFor(rx, seq.rangeMin, seq.rangeMax, lw);
        const exp = seq.answers[idx];
        const tol = Math.abs(seq.commonDiff) * 0.25;
        const ok = Math.abs(v - exp) <= tol;
        setSeqPlaced((p) => {
          const a = [...(p[seqId] || seq.answers.map(() => null))];
          a[idx] = ok ? exp : v;
          return { ...p, [seqId]: a };
        });
        setSeqFb((p) => {
          const a: FeedbackType[] = [
            ...(p[seqId] || seq.answers.map(() => null)),
          ];
          a[idx] = ok ? "correct" : "wrong";
          return { ...p, [seqId]: a };
        });
        if (ok) {
          setScore((s) => s + 5);
          addCeleb(rx, ry);
        }
      }
    },
    [seqDrag, sequences, vFor],
  );

  const onUp = useCallback(
    (e: MouseEvent): void => {
      if (dragTok && nlRef.current) {
        const r = nlRef.current.getBoundingClientRect();
        const lw = r.width - 2 * nlPad;
        const rx = e.clientX - r.left;
        const ry = e.clientY - r.top;
        if (
          ry >= -40 &&
          ry <= r.height + 40 &&
          rx >= nlPad - 25 &&
          rx <= r.width - nlPad + 25
        ) {
          const v = vFor(rx, ordMin, ordMax, lw);
          const tok = tokens.find((t) => t.id === dragTok);
          if (tok) {
            const ok = Math.abs(v - tok.value) <= snapTol;
            setPlaced((p) => ({ ...p, [dragTok]: ok ? tok.value : v }));
            setTokFb((p) => ({ ...p, [dragTok]: ok ? "correct" : "wrong" }));
            if (ok) {
              setScore((s) => s + 10);
              addCeleb(rx, ry);
            }
          }
        }
      }
      setDragTok(null);
      if (seqDrag && nlRef.current) dropSeq(e);
      setSeqDrag(null);
    },
    [dragTok, seqDrag, tokens, snapTol, dropSeq, vFor],
  );

  useEffect(() => {
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [onMove, onUp]);

  useEffect(() => {
    const allPlaced = tokens.every((t) => tokFb[t.id] === "correct");
    if (allPlaced && tokens.length > 0 && !ordDone) {
      setOrdDone(true);
      const vm: Record<number, string[]> = {};
      tokens.forEach((t) => {
        if (!vm[t.value]) vm[t.value] = [];
        vm[t.value].push(t.id);
      });
      if (Object.values(vm).some((a) => a.length > 1))
        setTimeout(() => setSameBadge(true), 600);
      setTimeout(() => setOrdStmt(true), 1200);
    }
  }, [tokFb, tokens, ordDone]);

  useEffect(() => {
    sequences.forEach((s) => {
      const fb = seqFb[s.id];
      if (fb && fb.every((f) => f === "correct") && !seqDone[s.id])
        setSeqDone((p) => ({ ...p, [s.id]: true }));
    });
  }, [seqFb, sequences, seqDone]);

  const aseq: SequenceData = sequences[seqIdx];

  const renderOrdNL = (): React.ReactNode => {
    if (!nlRef.current) return null;
    const lw = nlRef.current.getBoundingClientRect().width - 2 * nlPad;
    const maj: number[] = [];
    for (let v = ordMin; v <= ordMax; v += 5) maj.push(v);
    const minor: number[] = [];
    for (let v = ordMin; v <= ordMax; v += 1) if (v % 5 !== 0) minor.push(v);
    return (
      <svg width="100%" height="170" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="olg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={DS.primaryDark} stopOpacity=".12" />
            <stop offset="50%" stopColor={DS.primary} stopOpacity=".06" />
            <stop offset="100%" stopColor={DS.accent} stopOpacity=".10" />
          </linearGradient>
        </defs>
        <rect
          x={nlPad - 4}
          y={94}
          width={lw + 8}
          height={14}
          rx={7}
          fill="url(#olg)"
        />
        <line
          x1={nlPad}
          y1={100}
          x2={nlPad + lw}
          y2={100}
          stroke={DS.primary}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeDasharray="2000"
          strokeDashoffset="0"
          style={{ animation: "drawIn 1.2s ease-out forwards" }}
        />
        <polygon
          points={`${nlPad - 7},100 ${nlPad + 3},96 ${nlPad + 3},104`}
          fill={DS.primary}
        />
        <polygon
          points={`${nlPad + lw + 7},100 ${nlPad + lw - 3},96 ${nlPad + lw - 3},104`}
          fill={DS.primary}
        />
        {minor.map((v) => {
          const x = xFor(v, ordMin, ordMax, lw);
          return (
            <line
              key={`mn-${v}`}
              x1={x}
              y1={96}
              x2={x}
              y2={104}
              stroke={DS.gray300}
              strokeWidth={1}
            />
          );
        })}
        {maj.map((v, i) => {
          const x = xFor(v, ordMin, ordMax, lw);
          return (
            <g
              key={`mj-${v}`}
              style={{ animation: `popIn .35s ease-out ${i * 0.04}s both` }}
            >
              <line
                x1={x}
                y1={88}
                x2={x}
                y2={112}
                stroke={DS.primary}
                strokeWidth={1.5}
                opacity={0.5}
              />
              <text
                x={x}
                y={132}
                textAnchor="middle"
                fontSize="11"
                fontWeight="600"
                fill={DS.gray700}
                fontFamily={DS.font}
              >
                {v}
              </text>
            </g>
          );
        })}
        {tokens.map((tok) => {
          const pv = placed[tok.id];
          if (pv == null) return null;
          const x = xFor(pv, ordMin, ordMax, lw);
          const fb = tokFb[tok.id];
          const ok = fb === "correct";
          const hasSame =
            tokens.filter((t) => t.value === tok.value && t.id !== tok.id)
              .length > 0 &&
            ok &&
            sameBadge;
          return (
            <g
              key={`pl-${tok.id}`}
              style={{
                animation: ok ? "popIn .45s ease-out" : "wiggle .5s ease",
              }}
            >
              <ellipse cx={x} cy={74} rx={20} ry={4} fill="rgba(0,0,0,.08)" />
              <circle
                cx={x}
                cy={66}
                r={21}
                fill={ok ? tok.color : DS.error}
                opacity={0.92}
                style={
                  hasSame
                    ? { animation: "samePulse 1.5s ease-in-out infinite" }
                    : {}
                }
              />
              <text
                x={x}
                y={71}
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill="#fff"
                fontFamily={DS.font}
              >
                {tok.fracLabel}
              </text>
              {ok && (
                <g style={{ animation: "popIn .3s ease-out .15s both" }}>
                  <circle cx={x + 15} cy={50} r={8} fill={DS.success} />
                  <text
                    x={x + 15}
                    y={54}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#fff"
                  >
                    ✓
                  </text>
                </g>
              )}
              {fb === "wrong" && (
                <g style={{ animation: "popIn .25s ease-out" }}>
                  <circle cx={x + 15} cy={50} r={8} fill={DS.error} />
                  <text
                    x={x + 15}
                    y={54}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#fff"
                  >
                    ✗
                  </text>
                </g>
              )}
              <line
                x1={x}
                y1={87}
                x2={x}
                y2={98}
                stroke={ok ? tok.color : DS.error}
                strokeWidth={2}
                strokeDasharray="3,3"
                opacity={0.7}
              />
            </g>
          );
        })}
        {sameBadge &&
          (() => {
            const st = tokens.filter((t) => t.value === 4.1);
            if (st.length < 2) return null;
            const x = xFor(4.1, ordMin, ordMax, lw);
            return (
              <g style={{ animation: "badgeFloat 2.5s ease-in-out infinite" }}>
                <rect
                  x={x - 48}
                  y={16}
                  width={96}
                  height={30}
                  rx={15}
                  fill={DS.success}
                />
                <rect
                  x={x - 48}
                  y={16}
                  width={96}
                  height={30}
                  rx={15}
                  fill="none"
                  stroke="#fff"
                  strokeWidth={1.5}
                  opacity={0.4}
                />
                <text
                  x={x}
                  y={36}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="700"
                  fill="#fff"
                  fontFamily={DS.font}
                >
                  ✨ Same value!
                </text>
              </g>
            );
          })()}
      </svg>
    );
  };

  const renderSeqNL = (seq: SequenceData): React.ReactNode => {
    if (!nlRef.current) return null;
    const lw = nlRef.current.getBoundingClientRect().width - 2 * nlPad;
    const rng = seq.rangeMax - seq.rangeMin;
    const step = rng <= 4 ? 0.5 : rng <= 8 ? 1 : 2;
    const tks: number[] = [];
    for (let v = seq.rangeMin; v <= seq.rangeMax; v += step)
      tks.push(Math.round(v * 10) / 10);
    const pa: (number | null)[] = seqPlaced[seq.id] || [];
    const fa: FeedbackType[] = seqFb[seq.id] || [];
    return (
      <svg width="100%" height="150" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="slg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={DS.primary} stopOpacity=".10" />
            <stop offset="100%" stopColor={DS.accent} stopOpacity=".06" />
          </linearGradient>
        </defs>
        <rect
          x={nlPad - 3}
          y={78}
          width={lw + 6}
          height={10}
          rx={5}
          fill="url(#slg)"
        />
        <line
          x1={nlPad}
          y1={82}
          x2={nlPad + lw}
          y2={82}
          stroke={DS.primary}
          strokeWidth={2}
          strokeLinecap="round"
        />
        <polygon
          points={`${nlPad - 5},82 ${nlPad + 2},79 ${nlPad + 2},85`}
          fill={DS.primary}
        />
        <polygon
          points={`${nlPad + lw + 5},82 ${nlPad + lw - 2},79 ${nlPad + lw - 2},85`}
          fill={DS.primary}
        />
        {tks.map((v) => {
          const x = xFor(v, seq.rangeMin, seq.rangeMax, lw);
          return (
            <g key={`tk-${v}`}>
              <line
                x1={x}
                y1={76}
                x2={x}
                y2={88}
                stroke={DS.primary}
                strokeWidth={1}
                opacity={0.4}
              />
              <text
                x={x}
                y={106}
                textAnchor="middle"
                fontSize="9.5"
                fill={DS.gray500}
                fontFamily={DS.font}
                fontWeight="500"
              >
                {v}
              </text>
            </g>
          );
        })}
        {seq.given.map((v, i) => {
          const x = xFor(v, seq.rangeMin, seq.rangeMax, lw);
          return (
            <g
              key={`gv-${i}`}
              style={{ animation: `popIn .4s ease-out ${i * 0.08}s both` }}
            >
              <circle cx={x} cy={55} r={18} fill={DS.primary} />
              <circle
                cx={x}
                cy={55}
                r={18}
                fill="none"
                stroke="#fff"
                strokeWidth={1.5}
                opacity={0.3}
              />
              <text
                x={x}
                y={60}
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill="#fff"
                fontFamily={DS.font}
              >
                {v}
              </text>
              <line
                x1={x}
                y1={73}
                x2={x}
                y2={82}
                stroke={DS.primary}
                strokeWidth={1.5}
                strokeDasharray="3,2"
                opacity={0.6}
              />
            </g>
          );
        })}
        {seq.answers.map((ev, i) => {
          const pv = pa[i];
          if (pv == null) return null;
          const x = xFor(pv, seq.rangeMin, seq.rangeMax, lw);
          const ok = fa[i] === "correct";
          return (
            <g
              key={`an-${i}`}
              style={{
                animation: ok ? "popIn .45s ease-out" : "wiggle .4s ease",
              }}
            >
              <circle cx={x} cy={55} r={18} fill={ok ? DS.success : DS.error} />
              <circle
                cx={x}
                cy={55}
                r={18}
                fill="none"
                stroke="#fff"
                strokeWidth={1.5}
                opacity={0.3}
              />
              <text
                x={x}
                y={60}
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill="#fff"
                fontFamily={DS.font}
              >
                {ok ? ev : "?"}
              </text>
              <line
                x1={x}
                y1={73}
                x2={x}
                y2={82}
                stroke={ok ? DS.success : DS.error}
                strokeWidth={1.5}
                strokeDasharray="3,2"
                opacity={0.6}
              />
            </g>
          );
        })}
        {seqDone[seq.id] &&
          (() => {
            const av = [...seq.given, ...seq.answers];
            av.sort((a, b) => (seq.commonDiff > 0 ? a - b : b - a));
            const ps: [number, number][] = [];
            for (let i = 0; i < av.length - 1; i++) ps.push([av[i], av[i + 1]]);
            return ps.map(([f, t], i) => {
              const x1 = xFor(f, seq.rangeMin, seq.rangeMax, lw);
              const x2 = xFor(t, seq.rangeMin, seq.rangeMax, lw);
              const mx = (x1 + x2) / 2;
              return (
                <g
                  key={`d-${i}`}
                  style={{
                    animation: `fadeInUp .35s ease-out ${i * 0.08 + 0.4}s both`,
                  }}
                >
                  <path
                    d={`M ${x1} 40 Q ${mx} 18, ${x2} 40`}
                    fill="none"
                    stroke={DS.accent}
                    strokeWidth={1.5}
                    strokeDasharray="4,3"
                    markerEnd="url(#aSeq)"
                  />
                </g>
              );
            });
          })()}
        <defs>
          <marker
            id="aSeq"
            markerWidth="6"
            markerHeight="6"
            refX="5"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L6,3 L0,6 Z" fill={DS.accent} />
          </marker>
        </defs>
      </svg>
    );
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        maxWidth: 900,
        minHeight: height,
        background: DS.gray100,
        borderRadius: DS.rXl,
        overflow: "hidden",
        fontFamily: DS.font,
        position: "relative",
        boxShadow: DS.shadowXl,
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(16px)",
        transition: "all .5s cubic-bezier(.4,0,.2,1)",
        userSelect: "none",
        margin: "0 auto",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          background: DS.gradHeader,
          padding: "20px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -30,
            right: 60,
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "rgba(255,255,255,.04)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -20,
            left: 120,
            width: 50,
            height: 50,
            borderRadius: "50%",
            background: "rgba(252,145,69,.1)",
          }}
        />
        <div
          style={{ display: "flex", alignItems: "center", gap: 14, zIndex: 1 }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: DS.rMd,
              background: "rgba(255,255,255,.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(255,255,255,.15)",
            }}
          >
            <Zap size={20} color={DS.accentMid} />
          </div>
          <div>
            <div
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "-.2px",
              }}
            >
              Practice: Ordering & Sequences
            </div>
            <div
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,.55)",
                marginTop: 2,
                fontWeight: 500,
              }}
            >
              Chapter 3 — A Peek Beyond the Point
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            zIndex: 1,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(255,255,255,.1)",
              borderRadius: DS.rPill,
              padding: "6px 16px",
              border: "1px solid rgba(255,255,255,.12)",
            }}
          >
            <Star
              size={14}
              color={DS.accent}
              fill={DS.accent}
              style={{ animation: score > 0 ? "starSpin .6s ease" : "none" }}
            />
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>
              {score}
            </span>
          </div>
          {(["ordering", "sequences"] as ModeType[]).map((m) => {
            const act = mode === m;
            const hov = hovTab === m;
            return (
              <button
                key={m}
                onClick={() => setMode(m)}
                onMouseEnter={() => setHovTab(m)}
                onMouseLeave={() => setHovTab(null)}
                style={{
                  padding: "8px 24px",
                  borderRadius: DS.rPill,
                  border: act ? "none" : "1.5px solid rgba(255,255,255,.3)",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 13,
                  fontFamily: DS.font,
                  background: act
                    ? "#fff"
                    : hov
                      ? "rgba(255,255,255,.12)"
                      : "transparent",
                  color: act ? DS.primary : "#fff",
                  transition: "all .3s cubic-bezier(.4,0,.2,1)",
                  transform: act ? "scale(1.03)" : "scale(1)",
                  boxShadow: act ? "0 4px 14px rgba(0,0,0,.15)" : "none",
                }}
              >
                {m === "ordering" ? "📏 Ordering" : "🔢 Sequences"}
              </button>
            );
          })}
        </div>
      </div>

      {/* INSTRUCTIONS */}
      {showInstr && (
        <div
          style={{
            background: "#fff",
            borderRadius: DS.rLg,
            padding: "14px 20px",
            margin: "16px 24px 0",
            border: `1px solid ${DS.gray200}`,
            boxShadow: DS.shadowSm,
            fontSize: 13,
            color: DS.gray700,
            lineHeight: 1.65,
            fontWeight: 500,
            animation: "fadeInUp .4s ease-out",
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: DS.rSm,
              flexShrink: 0,
              background: DS.accentLight,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
            }}
          >
            💡
          </div>
          <div style={{ flex: 1 }}>
            {mode === "ordering" ? (
              <>
                <span style={{ fontWeight: 700, color: DS.primary }}>Drag</span>{" "}
                each of the four values to the correct position on the number
                line. Convert all to one-tenths first. Did you notice two values
                land at the same spot?
              </>
            ) : (
              <>
                <span style={{ fontWeight: 700, color: DS.primary }}>
                  Identify the pattern
                </span>{" "}
                in the given terms, then{" "}
                <span style={{ fontWeight: 700, color: DS.accent }}>drag</span>{" "}
                the next four terms to their correct positions.
              </>
            )}
          </div>
          <button
            onClick={() => setShowInstr(false)}
            style={{
              background: DS.gray100,
              border: "none",
              color: DS.gray500,
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 11,
              padding: "4px 12px",
              borderRadius: DS.rSm,
              fontFamily: DS.font,
              flexShrink: 0,
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* CONTENT */}
      <div style={{ padding: "12px 24px 20px" }}>
        {mode === "ordering" ? (
          <div style={{ animation: "fadeInUp .4s ease-out" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                marginBottom: 16,
                flexWrap: "wrap",
                marginTop: 4,
              }}
            >
              <span
                style={{ fontSize: 12, color: DS.gray500, fontWeight: 600 }}
              >
                Values:
              </span>
              {tokens.map((tok, i) => {
                const ip = tokFb[tok.id] === "correct";
                const isDrag = dragTok === tok.id;
                return (
                  <div
                    key={tok.id}
                    onMouseDown={(e) => !ip && onTokDown(tok.id, e)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "10px 20px",
                      borderRadius: DS.rPill,
                      fontWeight: 700,
                      fontSize: 14,
                      fontFamily: DS.font,
                      color: "#fff",
                      background: ip ? DS.gray300 : tok.color,
                      cursor: ip ? "default" : "grab",
                      transition: "all .3s cubic-bezier(.4,0,.2,1)",
                      transform: isDrag ? "scale(1.12)" : "scale(1)",
                      boxShadow: isDrag
                        ? "0 8px 28px rgba(0,0,0,.25)"
                        : DS.shadowMd,
                      opacity: ip ? 0.45 : 1,
                      pointerEvents: ip ? "none" : "auto",
                      animation: `slideR .35s ease-out ${i * 0.08}s both`,
                      gap: 6,
                    }}
                  >
                    {tok.fracLabel}
                    <span
                      style={{ fontSize: 10, opacity: 0.75, fontWeight: 500 }}
                    >
                      = {tok.value}
                    </span>
                  </div>
                );
              })}
              <button
                onClick={resetOrd}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "8px 18px",
                  borderRadius: DS.rPill,
                  border: `1.5px solid ${DS.primary}`,
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: 12,
                  color: DS.primary,
                  fontWeight: 600,
                  fontFamily: DS.font,
                }}
              >
                <RotateCcw size={13} /> Reset
              </button>
            </div>
            <div
              ref={nlRef}
              style={{
                background: "#fff",
                borderRadius: DS.rLg,
                padding: "12px 0",
                boxShadow: `inset 0 2px 6px ${DS.primaryLighter}`,
                border: `1px solid ${DS.gray200}`,
                position: "relative",
                minHeight: 180,
              }}
            >
              {renderOrdNL()}
              {celebs.map((c) => (
                <div
                  key={c.id}
                  style={{
                    position: "absolute",
                    left: c.x - 12,
                    top: c.y - 12,
                    pointerEvents: "none",
                  }}
                >
                  {["🎉", "⭐", "✨"].map((em, idx) => (
                    <span
                      key={idx}
                      style={{
                        position: "absolute",
                        left: Math.random() * 30 - 15,
                        animation: `confetti 1s ease-out ${idx * 0.08}s forwards`,
                        fontSize: 17,
                      }}
                    >
                      {em}
                    </span>
                  ))}
                </div>
              ))}
            </div>
            {ordStmt && (
              <div
                style={{
                  marginTop: 16,
                  textAlign: "center",
                  animation: "fadeInUp .5s ease-out",
                  background: DS.gradSuccess,
                  borderRadius: DS.rLg,
                  padding: "18px 28px",
                  color: "#fff",
                  boxShadow: "0 6px 20px rgba(46,204,113,.25)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <Award size={22} />
                  <span style={{ fontSize: 16, fontWeight: 800 }}>
                    Ordering Complete!
                  </span>
                </div>
                <div
                  style={{ fontSize: 21, fontWeight: 800, letterSpacing: 1.5 }}
                >
                  ⁴⁄₁₀ {"<"} 4¹⁄₁₀ = ⁴¹⁄₁₀ {"<"} 41¹⁄₁₀
                </div>
                <div
                  style={{
                    fontSize: 13,
                    marginTop: 8,
                    opacity: 0.9,
                    fontWeight: 500,
                  }}
                >
                  Notice: <strong>4¹⁄₁₀</strong> and <strong>⁴¹⁄₁₀</strong> are
                  the same value <strong>(4.1)</strong> — 41 tenths = 4 and 1
                  tenth!
                </div>
              </div>
            )}
            {ordDone && (
              <div
                style={{
                  marginTop: 14,
                  animation: "fadeInUp .5s ease-out .7s both",
                  background: DS.accentLight,
                  borderRadius: DS.rLg,
                  padding: "16px 22px",
                  border: `1.5px solid ${DS.accent}33`,
                  boxShadow: DS.shadowSm,
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: DS.accent,
                    marginBottom: 6,
                  }}
                >
                  🐝 Honeybee Challenge
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: DS.gray700,
                    lineHeight: 1.65,
                    fontWeight: 500,
                  }}
                >
                  A honeybee's body parts measure: <strong>Head = 2³⁄₁₀</strong>
                  , <strong>Thorax = 5⁴⁄₁₀</strong>,{" "}
                  <strong>Abdomen = 7⁵⁄₁₀</strong> units.
                  <br />
                  Total = (2+5+7) + (³⁄₁₀+⁴⁄₁₀+⁵⁄₁₀) = 14 + ¹²⁄₁₀ ={" "}
                  <strong style={{ color: DS.primary }}>15²⁄₁₀ units</strong> 🎯
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ animation: "fadeInUp .4s ease-out" }}>
            <div
              style={{
                display: "flex",
                gap: 6,
                marginBottom: 14,
                flexWrap: "wrap",
                alignItems: "center",
                marginTop: 4,
              }}
            >
              <span
                style={{ fontSize: 12, color: DS.gray500, fontWeight: 600 }}
              >
                Sequences:
              </span>
              {sequences.map((s, i) => {
                const act = seqIdx === i;
                const dn = seqDone[s.id];
                return (
                  <button
                    key={s.id}
                    onClick={() => setSeqIdx(i)}
                    style={{
                      padding: "7px 16px",
                      borderRadius: DS.rPill,
                      border: act
                        ? `2px solid ${DS.primary}`
                        : `1.5px solid ${dn ? DS.success : DS.gray200}`,
                      background: dn
                        ? DS.successLight
                        : act
                          ? DS.primaryLighter
                          : "#fff",
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 600,
                      fontFamily: DS.font,
                      color: dn
                        ? DS.successDark
                        : act
                          ? DS.primary
                          : DS.gray500,
                      transition: "all .25s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      boxShadow: act ? `0 2px 8px ${DS.primary}20` : "none",
                    }}
                  >
                    {s.label}
                    {dn && <Check size={13} strokeWidth={3} />}
                  </button>
                );
              })}
            </div>
            {aseq && (
              <div style={{ animation: "slideR .3s ease-out" }}>
                <div
                  style={{
                    background: "#fff",
                    borderRadius: DS.rMd,
                    padding: "12px 18px",
                    marginBottom: 12,
                    border: `1px solid ${DS.gray200}`,
                    boxShadow: DS.shadowSm,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: DS.gray900,
                      }}
                    >
                      {aseq.label} Sequence:{" "}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        color: DS.primary,
                        fontWeight: 600,
                      }}
                    >
                      {aseq.given.join(", ")},{" "}
                      <span style={{ color: DS.accent, fontWeight: 700 }}>
                        ?, ?, ?, ?
                      </span>
                    </span>
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        color: DS.primaryDark,
                        background: DS.primaryLighter,
                        padding: "4px 12px",
                        borderRadius: DS.rPill,
                        fontWeight: 600,
                      }}
                    >
                      d = {aseq.commonDiff > 0 ? "+" : ""}
                      {aseq.commonDiff}
                    </span>
                    <button
                      onClick={() => resetSeq(aseq.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "5px 12px",
                        borderRadius: DS.rPill,
                        border: `1.5px solid ${DS.primary}`,
                        background: "transparent",
                        cursor: "pointer",
                        fontSize: 11,
                        color: DS.primary,
                        fontWeight: 600,
                        fontFamily: DS.font,
                      }}
                    >
                      <RotateCcw size={11} /> Reset
                    </button>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  <span
                    style={{ fontSize: 12, color: DS.gray500, fontWeight: 600 }}
                  >
                    Drag terms:
                  </span>
                  {aseq.answers.map((v, i) => {
                    const fb = (seqFb[aseq.id] || [])[i];
                    const pl = fb === "correct";
                    return (
                      <div
                        key={`st-${i}`}
                        onMouseDown={(e) => onSeqDown(aseq.id, i, e)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 56,
                          height: 38,
                          borderRadius: DS.rMd,
                          fontWeight: 700,
                          fontSize: 13,
                          fontFamily: DS.font,
                          color: "#fff",
                          background: pl ? DS.gray300 : DS.accent,
                          cursor: pl ? "default" : "grab",
                          opacity: pl ? 0.4 : 1,
                          pointerEvents: pl ? "none" : "auto",
                          boxShadow: pl ? "none" : DS.shadowMd,
                          transition: "all .25s ease",
                          animation: `popIn .35s ease-out ${i * 0.06}s both`,
                        }}
                      >
                        {v}
                      </div>
                    );
                  })}
                </div>
                <div
                  ref={nlRef}
                  style={{
                    background: "#fff",
                    borderRadius: DS.rMd,
                    padding: "10px 0",
                    boxShadow: `inset 0 2px 6px ${DS.primaryLighter}`,
                    border: `1px solid ${DS.gray200}`,
                    position: "relative",
                    minHeight: 155,
                  }}
                >
                  {renderSeqNL(aseq)}
                  {celebs.map((c) => (
                    <div
                      key={c.id}
                      style={{
                        position: "absolute",
                        left: c.x - 10,
                        top: c.y - 10,
                        pointerEvents: "none",
                      }}
                    >
                      {["⭐", "✨"].map((em, idx) => (
                        <span
                          key={idx}
                          style={{
                            position: "absolute",
                            left: Math.random() * 24 - 12,
                            animation: `confetti .9s ease-out ${idx * 0.08}s forwards`,
                            fontSize: 16,
                          }}
                        >
                          {em}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
                {seqDone[aseq.id] && (
                  <div
                    style={{
                      marginTop: 12,
                      textAlign: "center",
                      animation: "fadeInUp .4s ease-out",
                      background: DS.gradSuccess,
                      borderRadius: DS.rMd,
                      padding: "14px 20px",
                      color: "#fff",
                      boxShadow: "0 4px 16px rgba(46,204,113,.2)",
                    }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 700 }}>
                      ✅ Complete! Pattern:{" "}
                      {aseq.commonDiff > 0 ? "adding" : "subtracting"}{" "}
                      {Math.abs(aseq.commonDiff)} each time
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        marginTop: 4,
                        opacity: 0.9,
                        fontWeight: 500,
                      }}
                    >
                      Full sequence:{" "}
                      {[...aseq.given, ...aseq.answers].join(", ")}
                    </div>
                  </div>
                )}
              </div>
            )}
            <div
              style={{
                marginTop: 16,
                display: "flex",
                alignItems: "center",
                gap: 8,
                justifyContent: "center",
              }}
            >
              <span
                style={{ fontSize: 11, color: DS.gray500, fontWeight: 600 }}
              >
                Progress:
              </span>
              {sequences.map((s) => (
                <div
                  key={s.id}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: seqDone[s.id] ? DS.success : DS.gray200,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 700,
                    fontFamily: DS.font,
                    color: seqDone[s.id] ? "#fff" : DS.gray400,
                    transition: "all .3s ease",
                    animation: seqDone[s.id] ? "popIn .4s ease-out" : "none",
                    border: seqDone[s.id]
                      ? "none"
                      : `1.5px solid ${DS.gray300}`,
                  }}
                >
                  {seqDone[s.id] ? "✓" : s.label.replace(/[()]/g, "")}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FLOATING GHOSTS */}
      {dragTok &&
        (() => {
          const t = tokens.find((x) => x.id === dragTok);
          if (!t) return null;
          return (
            <div
              style={{
                position: "fixed",
                left: dragPos.x - 45,
                top: dragPos.y - 22,
                zIndex: 1000,
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "10px 22px",
                  borderRadius: DS.rPill,
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#fff",
                  background: t.color,
                  fontFamily: DS.font,
                  boxShadow: "0 10px 30px rgba(0,0,0,.3)",
                  animation: "pulseGlow 1s ease-in-out infinite",
                }}
              >
                {t.fracLabel}
              </div>
            </div>
          );
        })()}
      {seqDrag && (
        <div
          style={{
            position: "fixed",
            left: seqDragPos.x - 28,
            top: seqDragPos.y - 19,
            zIndex: 1000,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width: 56,
              height: 38,
              borderRadius: DS.rMd,
              fontWeight: 700,
              fontSize: 13,
              color: "#fff",
              background: DS.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: DS.font,
              boxShadow: "0 10px 30px rgba(255,114,18,.35)",
              animation: "pulseOrange 1s ease-in-out infinite",
            }}
          >
            {
              sequences.find((s) => s.id === seqDrag.seqId)?.answers[
                seqDrag.idx
              ]
            }
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div
        style={{
          textAlign: "center",
          padding: "10px 0 14px",
          fontSize: 10,
          color: DS.gray400,
          letterSpacing: 0.3,
          fontWeight: 500,
          borderTop: `1px solid ${DS.gray200}`,
          margin: "0 24px",
        }}
      >
        Ganita Prakash · Grade 7 · Chapter 3 — A Peek Beyond the Point
      </div>
    </div>
  );
};

export default OrderingSequencesTool;
