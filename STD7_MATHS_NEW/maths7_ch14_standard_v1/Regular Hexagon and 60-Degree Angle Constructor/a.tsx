// @ts-nocheck
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  BookOpen,
  Target,
  Eye,
  EyeOff,
  Check,
  X,
  Award,
} from "lucide-react";

interface StepDetails {
  currentStep: number;
  totalSteps: number;
  mode: string;
}
interface MCQOption {
  id: string;
  text: string;
  isCorrect: boolean;
}
interface MCQQuestion {
  id: number;
  question: string;
  options: MCQOption[];
  explanation: string;
  figureType: string;
  highlightTriangles?: number;
  showAngles?: boolean;
  showSymmetry?: boolean;
}
interface HexagonConstructorProps {
  props?: {
    width?: number;
    height?: number;
    initialMode?: "learn" | "practice";
    showModeSelector?: boolean;
    enabledModes?: ("learn" | "practice")[];
    showNavigation?: boolean;
    showStepIndicator?: boolean;
    initialStep?: number;
    animationSpeed?: number;
    darkMode?: boolean;
    additionalProps?: { [key: string]: any };
  };
  setStepDetails?: (s: StepDetails) => void;
}

const DS = {
  primary: "#4A4DC9",
  accent: "#FF7212",
  gradStart: "#533086",
  gradEnd: "#FC9145",
  lightPurple: "#C1C1EA",
  lightOrange: "#FFF3E4",
  text: "#4E4E4E",
  textLight: "#7A7A7A",
  gray: "#CACACA",
  grayLight: "#EBEBEB",
  grayBg: "#F5F5F5",
  white: "#FFFFFF",
  success: "#2ECC71",
  error: "#E74C3C",
  font: "'Poppins', sans-serif",
  r: 12,
  rSm: 8,
  rLg: 16,
  rXl: 24,
};

const STEPS = 5;
const CX = 300;
const CY = 240;
const R = 140;
const TF = [
  "rgba(74,77,201,.30)",
  "rgba(255,114,18,.28)",
  "rgba(83,48,134,.30)",
  "rgba(193,193,234,.50)",
  "rgba(252,145,69,.30)",
  "rgba(74,77,201,.20)",
];
const TS = ["#4A4DC9", "#FF7212", "#533086", "#7B7BCE", "#FC9145", "#4A4DC9"];
const ease = (t: number) => 1 - Math.pow(1 - t, 3);
function hv(i: number, cx: number, cy: number, r: number): [number, number] {
  const a = (Math.PI / 180) * (60 * i - 90);
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}
function arc(cx: number, cy: number, r: number, sa: number, ea: number) {
  const s = {
    x: cx + r * Math.cos((sa * Math.PI) / 180),
    y: cy + r * Math.sin((sa * Math.PI) / 180),
  };
  const e = {
    x: cx + r * Math.cos((ea * Math.PI) / 180),
    y: cy + r * Math.sin((ea * Math.PI) / 180),
  };
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${ea - sa <= 180 ? "0" : "1"} 1 ${e.x} ${e.y}`;
}

const QS: MCQQuestion[] = [
  {
    id: 1,
    question:
      "How many equilateral triangles can a regular hexagon be divided into?",
    options: [
      { id: "a", text: "4", isCorrect: false },
      { id: "b", text: "6", isCorrect: true },
      { id: "c", text: "8", isCorrect: false },
      { id: "d", text: "3", isCorrect: false },
    ],
    explanation:
      "A regular hexagon divides into exactly 6 equilateral triangles by joining each vertex to the centre O.",
    figureType: "decomposition",
    highlightTriangles: 6,
  },
  {
    id: 2,
    question: "What is the measure of each angle of an equilateral triangle?",
    options: [
      { id: "a", text: "90°", isCorrect: false },
      { id: "b", text: "45°", isCorrect: false },
      { id: "c", text: "60°", isCorrect: true },
      { id: "d", text: "120°", isCorrect: false },
    ],
    explanation: "All three angles are equal to 60° because 180° ÷ 3 = 60°.",
    figureType: "angle",
    highlightTriangles: 1,
    showAngles: true,
  },
  {
    id: 3,
    question: "Why do 6 equilateral triangles fit perfectly around the centre?",
    options: [
      { id: "a", text: "6 × 60° = 360°", isCorrect: true },
      { id: "b", text: "6 × 90° = 540°", isCorrect: false },
      { id: "c", text: "6 × 45° = 270°", isCorrect: false },
      { id: "d", text: "6 × 30° = 180°", isCorrect: false },
    ],
    explanation:
      "Each triangle contributes 60° at centre. 6 × 60° = 360° — they fit with no gaps.",
    figureType: "decomposition",
    highlightTriangles: 6,
    showAngles: true,
  },
  {
    id: 4,
    question: "What is the interior angle at each vertex of a regular hexagon?",
    options: [
      { id: "a", text: "60°", isCorrect: false },
      { id: "b", text: "90°", isCorrect: false },
      { id: "c", text: "120°", isCorrect: true },
      { id: "d", text: "150°", isCorrect: false },
    ],
    explanation: "Two triangle angles meet at each vertex: 60° + 60° = 120°.",
    figureType: "angle",
    highlightTriangles: 6,
    showAngles: true,
  },
  {
    id: 5,
    question: "To construct a regular hexagon, the compass radius should be:",
    options: [
      { id: "a", text: "Half the circle radius", isCorrect: false },
      { id: "b", text: "Equal to the circle radius", isCorrect: true },
      { id: "c", text: "Double the circle radius", isCorrect: false },
      { id: "d", text: "Any random length", isCorrect: false },
    ],
    explanation:
      "Compass radius = circle radius creates equilateral triangles with 60° arcs.",
    figureType: "construction",
  },
  {
    id: 6,
    question: "How many lines of symmetry does a regular hexagon have?",
    options: [
      { id: "a", text: "3", isCorrect: false },
      { id: "b", text: "4", isCorrect: false },
      { id: "c", text: "6", isCorrect: true },
      { id: "d", text: "12", isCorrect: false },
    ],
    explanation:
      "6 lines of mirror symmetry — 3 through opposite vertices and 3 through midpoints.",
    figureType: "symmetry",
    showSymmetry: true,
  },
  {
    id: 7,
    question: "Why can regular hexagons tile the plane without gaps?",
    options: [
      { id: "a", text: "They have 6 sides", isCorrect: false },
      {
        id: "b",
        text: "3 × 120° = 360° at each meeting point",
        isCorrect: true,
      },
      { id: "c", text: "They are made of triangles", isCorrect: false },
      { id: "d", text: "They have rotational symmetry", isCorrect: false },
    ],
    explanation:
      "3 interior angles of 120° meet: 3 × 120° = 360°. Perfect coverage.",
    figureType: "tiling",
  },
  {
    id: 8,
    question: "What is the rotational symmetry order of a regular hexagon?",
    options: [
      { id: "a", text: "Order 3 (120°)", isCorrect: false },
      { id: "b", text: "Order 4 (90°)", isCorrect: false },
      { id: "c", text: "Order 6 (60°)", isCorrect: true },
      { id: "d", text: "Order 2 (180°)", isCorrect: false },
    ],
    explanation:
      "6-fold rotational symmetry. Identical after every 60° rotation (360° ÷ 6).",
    figureType: "symmetry",
    showSymmetry: true,
  },
];

const HexagonConstructor: React.FC<HexagonConstructorProps> = ({
  props,
  setStepDetails,
}) => {
  const initialMode = props?.initialMode ?? "learn";
  const showModeSelector = props?.showModeSelector ?? true;
  const enabledModes = props?.enabledModes ?? ["learn", "practice"];
  const showNavigation = props?.showNavigation ?? true;
  const showStepIndicator = props?.showStepIndicator ?? true;
  const initialStep = props?.initialStep ?? 1;
  const animationSpeed = props?.animationSpeed ?? 1;
  const darkMode = props?.darkMode ?? false;

  const containerRef = useRef<HTMLDivElement>(null);
  const [cw, setCw] = useState(800);
  const isMobile = cw < 580;
  const isTablet = cw >= 580 && cw < 768;
  const isSmall = cw < 480;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setCw(e.contentRect.width);
    });
    ro.observe(el);
    setCw(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const [step, setStep] = useState(initialStep);
  const [mode, setMode] = useState<"learn" | "practice">(initialMode);
  const [prog, setProg] = useState(0);
  const [angles, setAngles] = useState(true);
  const [hTri, setHTri] = useState<number | null>(null);
  const aRef = useRef<number>(0);

  const [qi, setQi] = useState(0);
  const [sel, setSel] = useState<string | null>(null);
  const [ans, setAns] = useState<"unanswered" | "correct" | "incorrect">(
    "unanswered",
  );
  const [score, setScore] = useState(0);
  const [showExp, setShowExp] = useState(false);
  const [done, setDone] = useState(false);
  const [hOpt, setHOpt] = useState<string | null>(null);
  const [aniC, setAniC] = useState(false);
  const [aniW, setAniW] = useState(false);

  const cq = QS[qi];
  const V = useMemo(
    () => Array.from({ length: 6 }, (_, i) => hv(i, CX, CY, R)),
    [],
  );
  const SD = useMemo(
    () => [
      {
        t: "The Regular Hexagon",
        d: "A regular hexagon has 6 equal sides and 6 equal angles. It divides into 6 equilateral triangles around centre O.",
      },
      {
        t: "Adding Triangles (Half)",
        d: "Each equilateral triangle contributes 60° at the centre. After 3 triangles: 3 × 60° = 180° — half a full turn.",
      },
      {
        t: "All 6 Triangles Fit!",
        d: "All 6 fit perfectly: 6 × 60° = 360°. Interior angle at each hexagon vertex: 60° + 60° = 120°.",
      },
      {
        t: "Constructing the Hexagon",
        d: "Draw a circle, place vertex A. Set compass to the radius — mark 60° arcs around for each new vertex.",
      },
      {
        t: "Complete Hexagon!",
        d: "Done! It has 6-fold rotational symmetry (identical every 60° rotation) and 6 lines of mirror symmetry.",
      },
    ],
    [],
  );

  useEffect(() => {
    if (mode !== "learn") return;
    setProg(0);
    let s: number;
    const d = 1200 / animationSpeed;
    const a = (t: number) => {
      if (!s) s = t;
      const p = Math.min((t - s) / d, 1);
      setProg(ease(p));
      if (p < 1) aRef.current = requestAnimationFrame(a);
    };
    aRef.current = requestAnimationFrame(a);
    return () => cancelAnimationFrame(aRef.current);
  }, [step, animationSpeed, mode]);
  useEffect(() => {
    setStepDetails?.({
      currentStep: mode === "learn" ? step : qi + 1,
      totalSteps: mode === "learn" ? STEPS : QS.length,
      mode,
    });
  }, [step, mode, qi, setStepDetails]);

  useEffect(() => {
    const id = "hex-ds-kf";
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes popIn{0%{transform:scale(0);opacity:0}70%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
@keyframes drawCircle{from{stroke-dashoffset:945}to{stroke-dashoffset:0}}
@keyframes glowPulse{0%,100%{filter:drop-shadow(0 0 4px rgba(74,77,201,.25))}50%{filter:drop-shadow(0 0 14px rgba(74,77,201,.55))}}
@keyframes slideR{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
@keyframes slideL{from{opacity:0;transform:translateX(-30px)}to{opacity:1;transform:translateX(0)}}
@keyframes bounceIn{0%{transform:scale(0)}60%{transform:scale(1.15)}100%{transform:scale(1)}}
@keyframes dashA{from{stroke-dashoffset:20}to{stroke-dashoffset:0}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
@keyframes celeb{0%{transform:scale(0) rotate(0);opacity:0}50%{transform:scale(1.25) rotate(8deg)}100%{transform:scale(1) rotate(0);opacity:1}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes correctGlow{0%{box-shadow:0 0 0 0 rgba(46,204,113,.4)}50%{box-shadow:0 0 0 8px rgba(46,204,113,0)}100%{box-shadow:0 0 0 0 rgba(46,204,113,0)}}`;
    document.head.appendChild(s);
    return () => {
      const el = document.getElementById(id);
      if (el) document.head.removeChild(el);
    };
  }, []);

  const optSel = useCallback(
    (id: string) => {
      if (ans !== "unanswered") return;
      setSel(id);
      const ok = cq.options.find((o) => o.id === id)?.isCorrect ?? false;
      if (ok) {
        setAns("correct");
        setScore((p) => p + 1);
        setAniC(true);
        setTimeout(() => setAniC(false), 600);
      } else {
        setAns("incorrect");
        setAniW(true);
        setTimeout(() => setAniW(false), 600);
      }
      setTimeout(() => setShowExp(true), 400);
    },
    [ans, cq],
  );
  const nextQ = useCallback(() => {
    if (qi < QS.length - 1) {
      setQi((p) => p + 1);
      setSel(null);
      setAns("unanswered");
      setShowExp(false);
    } else setDone(true);
  }, [qi]);
  const resetP = useCallback(() => {
    setQi(0);
    setSel(null);
    setAns("unanswered");
    setShowExp(false);
    setScore(0);
    setDone(false);
  }, []);
  const resetA = useCallback(() => {
    setStep(1);
    resetP();
  }, [resetP]);

  // SVG
  const rTri = useCallback(
    (n: number, anim = true, slow = false) =>
      Array.from({ length: n }, (_, i) => {
        const v1 = V[i];
        const v2 = V[(i + 1) % 6];
        const dur = slow ? "1.2s" : "0.5s";
        const del = slow ? `${i * 0.45}s` : `${i * 0.12}s`;
        return (
          <polygon
            key={`t-${i}`}
            points={`${CX},${CY} ${v1[0]},${v1[1]} ${v2[0]},${v2[1]}`}
            fill={TF[i]}
            stroke={TS[i]}
            strokeWidth={2}
            style={{
              animation: anim ? `popIn ${dur} ease-out ${del} both` : "none",
              cursor: "pointer",
              transition: "filter .3s",
              filter:
                hTri === i
                  ? "brightness(1.15) drop-shadow(0 0 10px rgba(74,77,201,.3))"
                  : "none",
            }}
            onMouseEnter={() => setHTri(i)}
            onMouseLeave={() => setHTri(null)}
          />
        );
      }),
    [V, hTri],
  );
  const rCA = useCallback(
    (n: number) =>
      Array.from({ length: n }, (_, i) => {
        const a = ((60 * i + 30 - 90) * Math.PI) / 180;
        return (
          <text
            key={`ca-${i}`}
            x={CX + 32 * Math.cos(a)}
            y={CY + 32 * Math.sin(a)}
            textAnchor="middle"
            dominantBaseline="central"
            fill={DS.accent}
            fontSize="10"
            fontWeight="700"
            fontFamily={DS.font}
            style={{ animation: `popIn .4s ease-out ${i * 0.1}s both` }}
          >
            60°
          </text>
        );
      }),
    [],
  );
  const rIA = useCallback(
    () =>
      V.map((v, i) => {
        const dx = v[0] - CX;
        const dy = v[1] - CY;
        const l = Math.sqrt(dx * dx + dy * dy);
        return (
          <text
            key={`ia-${i}`}
            x={v[0] + (dx / l) * 22}
            y={v[1] + (dy / l) * 22}
            textAnchor="middle"
            dominantBaseline="central"
            fill={DS.primary}
            fontSize="10"
            fontWeight="700"
            fontFamily={DS.font}
            style={{ animation: `popIn .4s ease-out ${i * 0.08}s both` }}
          >
            120°
          </text>
        );
      }),
    [V],
  );
  const rSL = useCallback(
    () =>
      Array.from({ length: 6 }, (_, i) => {
        const a = ((60 * i - 90) * Math.PI) / 180;
        return (
          <line
            key={`s-${i}`}
            x1={CX + (R + 20) * Math.cos(a)}
            y1={CY + (R + 20) * Math.sin(a)}
            x2={CX - (R + 20) * Math.cos(a)}
            y2={CY - (R + 20) * Math.sin(a)}
            stroke={DS.lightPurple}
            strokeWidth={1.5}
            strokeDasharray="6,4"
            style={{ animation: `dashA .6s ease-out ${i * 0.1}s both` }}
          />
        );
      }),
    [],
  );

  const rLearn = useCallback(() => {
    switch (step) {
      case 1:
        return (
          <g>
            <polygon
              points={V.map((v) => v.join(",")).join(" ")}
              fill="rgba(193,193,234,.12)"
              stroke={DS.primary}
              strokeWidth={2.5}
              strokeDasharray="8,4"
              style={{ animation: "fadeInUp .8s ease-out both" }}
            />
            {V.map((v, i) => (
              <line
                key={`r-${i}`}
                x1={CX}
                y1={CY}
                x2={v[0]}
                y2={v[1]}
                stroke="rgba(74,77,201,.15)"
                strokeWidth={1}
                strokeDasharray="4,4"
                style={{
                  animation: `fadeInUp .5s ease-out ${0.3 + i * 0.05}s both`,
                }}
              />
            ))}
            <circle
              cx={CX}
              cy={CY}
              r={5}
              fill={DS.accent}
              style={{ animation: "popIn .5s ease-out .3s both" }}
            />
            <text
              x={CX + 12}
              y={CY + 5}
              fontSize="13"
              fontWeight="700"
              fill={DS.accent}
              fontFamily={DS.font}
              style={{ animation: "popIn .5s ease-out .4s both" }}
            >
              O
            </text>
            {V.map((v, i) => {
              const lb = "ABCDEF"[i];
              const dx = v[0] - CX;
              const dy = v[1] - CY;
              const l = Math.sqrt(dx * dx + dy * dy);
              return (
                <text
                  key={`l-${i}`}
                  x={v[0] + (dx / l) * 18}
                  y={v[1] + (dy / l) * 18}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="12"
                  fontWeight="600"
                  fill={DS.text}
                  fontFamily={DS.font}
                  style={{
                    animation: `popIn .4s ease-out ${0.5 + i * 0.08}s both`,
                  }}
                >
                  {lb}
                </text>
              );
            })}
          </g>
        );
      case 2:
        return (
          <g>
            {rTri(3, true, true)}
            <polygon
              points={V.map((v) => v.join(",")).join(" ")}
              fill="none"
              stroke="rgba(74,77,201,.2)"
              strokeWidth={2}
              strokeDasharray="6,4"
            />
            {angles && rCA(3)}
            <circle cx={CX} cy={CY} r={4} fill={DS.accent} />
            <text
              x={CX + 12}
              y={CY + 4}
              fontSize="13"
              fontWeight="700"
              fill={DS.accent}
              fontFamily={DS.font}
            >
              O
            </text>
            <text
              x={CX}
              y={CY + R + 40}
              textAnchor="middle"
              fontSize="13"
              fontWeight="600"
              fill={DS.text}
              fontFamily={DS.font}
              style={{ animation: "fadeInUp .8s ease-out 1.8s both" }}
            >
              3 × 60° = 180° (half turn)
            </text>
          </g>
        );
      case 3:
        return (
          <g>
            {rTri(6, true, true)}
            {angles && rCA(6)}
            {angles && rIA()}
            <circle cx={CX} cy={CY} r={4} fill={DS.accent} />
            <text
              x={CX + 12}
              y={CY + 4}
              fontSize="13"
              fontWeight="700"
              fill={DS.accent}
              fontFamily={DS.font}
            >
              O
            </text>
            <text
              x={CX}
              y={CY + R + 40}
              textAnchor="middle"
              fontSize="13"
              fontWeight="600"
              fill={DS.success}
              fontFamily={DS.font}
              style={{ animation: "fadeInUp .8s ease-out 3.2s both" }}
            >
              6 × 60° = 360° — Perfect fit!
            </text>
          </g>
        );
      case 4: {
        const pc = Math.min(Math.floor(prog * 7), 6);
        const sc = Math.min(Math.floor(prog * 7.5), 6);
        return (
          <g>
            <circle
              cx={CX}
              cy={CY}
              r={R}
              fill="none"
              stroke={DS.primary}
              strokeWidth={2}
              strokeDasharray="945"
              style={{ animation: "drawCircle 1.2s ease-out both" }}
            />
            <circle
              cx={CX}
              cy={CY}
              r={4}
              fill={DS.accent}
              style={{ animation: "popIn .4s ease-out .3s both" }}
            />
            {V.slice(0, pc).map((v, i) => (
              <circle
                key={`pv-${i}`}
                cx={v[0]}
                cy={v[1]}
                r={6}
                fill={DS.accent}
                stroke={DS.white}
                strokeWidth={2}
                style={{
                  animation: `bounceIn .4s ease-out ${0.5 + i * 0.2}s both`,
                }}
              />
            ))}
            {Array.from({ length: Math.min(sc, 6) }, (_, i) => {
              const v1 = V[i];
              const v2 = V[(i + 1) % 6];
              return (
                <line
                  key={`s-${i}`}
                  x1={v1[0]}
                  y1={v1[1]}
                  x2={v2[0]}
                  y2={v2[1]}
                  stroke={DS.text}
                  strokeWidth={2.5}
                  style={{
                    animation: `fadeInUp .3s ease-out ${0.7 + i * 0.2}s both`,
                  }}
                />
              );
            })}
            {angles &&
              pc >= 2 &&
              Array.from({ length: Math.min(pc - 1, 6) }, (_, i) => {
                const a = ((60 * i + 30 - 90) * Math.PI) / 180;
                return (
                  <text
                    key={`c-${i}`}
                    x={CX + 28 * Math.cos(a)}
                    y={CY + 28 * Math.sin(a)}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={DS.accent}
                    fontSize="9"
                    fontWeight="700"
                    fontFamily={DS.font}
                    style={{
                      animation: `popIn .3s ease-out ${0.8 + i * 0.15}s both`,
                    }}
                  >
                    60°
                  </text>
                );
              })}
          </g>
        );
      }
      case 5:
        return (
          <g>
            {rSL()}
            {rTri(6, false)}
            <polygon
              points={V.map((v) => v.join(",")).join(" ")}
              fill="none"
              stroke={DS.primary}
              strokeWidth={3}
              style={{ animation: "glowPulse 2s ease-in-out infinite" }}
            />
            {V.map((v, i) => (
              <circle
                key={`v-${i}`}
                cx={v[0]}
                cy={v[1]}
                r={5}
                fill={DS.primary}
                stroke={DS.white}
                strokeWidth={2}
                style={{ animation: `bounceIn .4s ease-out ${i * 0.1}s both` }}
              />
            ))}
            <circle
              cx={CX}
              cy={CY}
              r={5}
              fill={DS.accent}
              stroke={DS.white}
              strokeWidth={2}
            />
            {angles && rCA(6)}
            {angles && rIA()}
            <g
              style={{
                animation: "spin 6s linear infinite",
                transformOrigin: `${CX}px ${CY}px`,
              }}
            >
              <path
                d={arc(CX, CY, R + 18, -95, -70)}
                fill="none"
                stroke={DS.gradStart}
                strokeWidth={2}
              />
            </g>
            <text
              x={CX}
              y={CY + R + 40}
              textAnchor="middle"
              fontSize="12"
              fontWeight="600"
              fill={DS.gradStart}
              fontFamily={DS.font}
              style={{ animation: "fadeInUp .6s ease-out .5s both" }}
            >
              6-fold rotational symmetry • 6 lines of reflection
            </text>
          </g>
        );
      default:
        return null;
    }
  }, [step, V, rTri, rCA, rIA, rSL, angles, prog]);

  const optStyle = (o: MCQOption): React.CSSProperties => {
    const isSel = sel === o.id;
    const fs = isSmall ? 12 : 13;
    const pd = isSmall ? "10px 12px" : "12px 16px";
    const base: React.CSSProperties = {
      padding: pd,
      borderRadius: DS.r,
      border: "2px solid",
      cursor: ans === "unanswered" ? "pointer" : "default",
      fontSize: fs,
      fontWeight: 500,
      fontFamily: DS.font,
      transition: "all .3s cubic-bezier(.4,0,.2,1)",
      display: "flex",
      alignItems: "center",
      gap: isSmall ? 8 : 12,
      WebkitTapHighlightColor: "transparent",
    };
    if (ans === "unanswered") {
      const h = hOpt === o.id;
      return {
        ...base,
        borderColor: h ? DS.primary : DS.grayLight,
        background: h ? "rgba(74,77,201,.04)" : DS.white,
        color: DS.text,
        transform: h ? "translateX(3px)" : "none",
        boxShadow: h
          ? "0 4px 16px rgba(74,77,201,.12)"
          : "0 1px 3px rgba(0,0,0,.04)",
      };
    }
    if (o.isCorrect)
      return {
        ...base,
        borderColor: DS.success,
        background: "rgba(46,204,113,.08)",
        color: DS.success,
        animation: isSel && aniC ? "correctGlow .6s ease-out" : "none",
      };
    if (isSel && !o.isCorrect)
      return {
        ...base,
        borderColor: DS.error,
        background: "rgba(231,76,60,.06)",
        color: DS.error,
        animation: aniW ? "shake .4s ease-out" : "none",
      };
    return {
      ...base,
      borderColor: DS.grayLight,
      background: DS.white,
      color: DS.gray,
      opacity: 0.5,
    };
  };

  const bg = darkMode ? "#1a1a2e" : DS.grayBg;
  const tc = darkMode ? "#e0e0e0" : DS.text;
  const cb = darkMode ? "#16213e" : DS.white;
  const bc = darkMode ? "rgba(255,255,255,.08)" : DS.grayLight;
  const st = darkMode ? "rgba(255,255,255,.6)" : DS.textLight;

  const hPad = isSmall ? "10px 14px" : isMobile ? "12px 16px" : "14px 24px";
  const titleFs = isSmall ? 12 : isMobile ? 13 : 15;
  const subFs = isSmall ? 9 : 11;
  const panelPad = isSmall ? "12px 14px" : isMobile ? "14px 16px" : "18px 22px";
  const stepTitleFs = isSmall ? 15 : isMobile ? 16 : 18;
  const stepDescFs = isSmall ? 12 : 13;
  const qFs = isSmall ? 13 : isMobile ? 14 : 15;
  const footPad = isSmall ? "8px 12px" : isMobile ? "8px 16px" : "10px 24px";
  const btnFs = isSmall ? 11 : isMobile ? 12 : 13;
  const btnPad = isSmall ? "6px 12px" : isMobile ? "7px 16px" : "8px 20px";

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        maxWidth: "100%",
        minHeight: 0,
        height: "auto",
        display: "flex",
        flexDirection: "column",
        background: bg,
        borderRadius: isMobile ? DS.rLg : DS.rXl,
        overflow: "hidden",
        boxShadow: "0 4px 24px rgba(74,77,201,.08),0 1px 3px rgba(0,0,0,.04)",
        fontFamily: DS.font,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: hPad,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: `linear-gradient(135deg,${DS.gradStart},${DS.gradEnd})`,
          position: "relative",
          overflow: "hidden",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg,transparent,rgba(255,255,255,.06),transparent)",
            backgroundSize: "200% 100%",
            animation: "shimmer 4s linear infinite",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: isSmall ? 8 : 12,
            zIndex: 1,
            minWidth: 0,
            flex: 1,
          }}
        >
          {!isSmall && (
            <div
              style={{
                width: isSmall ? 28 : 38,
                height: isSmall ? 28 : 38,
                borderRadius: DS.r,
                background: "rgba(255,255,255,.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg
                width={isSmall ? 14 : 20}
                height={isSmall ? 14 : 20}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2.2"
              >
                <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
              </svg>
            </div>
          )}
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                color: "#fff",
                fontSize: titleFs,
                fontWeight: 700,
                letterSpacing: "-.01em",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Regular Hexagon & 60° Constructor
            </div>
            {!isSmall && (
              <div
                style={{
                  color: "rgba(255,255,255,.7)",
                  fontSize: subFs,
                  fontWeight: 400,
                }}
              >
                Constructions and Tilings — Grade 7
              </div>
            )}
          </div>
        </div>
        {showModeSelector && enabledModes.length > 1 && (
          <div
            style={{
              display: "flex",
              gap: 3,
              background: "rgba(0,0,0,.15)",
              borderRadius: isSmall ? DS.rSm : DS.r,
              padding: 3,
              zIndex: 1,
            }}
          >
            {enabledModes.map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  resetA();
                }}
                style={{
                  padding: isSmall ? "5px 12px" : "8px 20px",
                  borderRadius: isSmall ? 6 : DS.rSm,
                  border: "none",
                  cursor: "pointer",
                  background: mode === m ? DS.white : "transparent",
                  color: mode === m ? DS.gradStart : "rgba(255,255,255,.85)",
                  fontSize: isSmall ? 10 : 12,
                  fontWeight: 600,
                  fontFamily: DS.font,
                  transition: "all .3s cubic-bezier(.4,0,.2,1)",
                  display: "flex",
                  alignItems: "center",
                  gap: isSmall ? 3 : 6,
                  boxShadow: mode === m ? "0 2px 8px rgba(0,0,0,.1)" : "none",
                  whiteSpace: "nowrap",
                }}
              >
                {m === "learn" ? (
                  <BookOpen size={isSmall ? 11 : 14} />
                ) : (
                  <Target size={isSmall ? 11 : 14} />
                )}
                {m === "learn" ? "Learn" : "Practice"}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* BODY */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: isMobile && mode === "learn" ? "column" : "row",
          overflow: "auto",
          minHeight: 0,
        }}
      >
        {/* SVG — Learn only */}
        {mode === "learn" && (
          <div
            style={{
              flex: isMobile ? "0 0 auto" : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: isSmall ? 6 : 12,
              position: "relative",
              background: DS.white,
              minHeight: isMobile ? 220 : undefined,
              maxHeight: isMobile ? 320 : undefined,
            }}
          >
            <svg
              viewBox="0 0 600 480"
              style={{
                width: "100%",
                height: "100%",
                maxHeight: isMobile ? 280 : undefined,
              }}
            >
              <defs>
                <pattern
                  id="hgDS"
                  width="30"
                  height="30"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="15" cy="15" r=".6" fill="rgba(74,77,201,.06)" />
                </pattern>
              </defs>
              <rect width="600" height="480" fill="url(#hgDS)" rx="12" />
              <g key={`l-${step}`}>{rLearn()}</g>
            </svg>
            {step >= 2 && (
              <button
                onClick={() => setAngles(!angles)}
                style={{
                  position: "absolute",
                  top: isSmall ? 6 : 10,
                  right: isSmall ? 6 : 10,
                  padding: isSmall ? "4px 8px" : "6px 14px",
                  borderRadius: DS.rSm,
                  border: `1.5px solid ${DS.grayLight}`,
                  background: DS.white,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: isSmall ? 9 : 11,
                  fontWeight: 500,
                  color: DS.text,
                  fontFamily: DS.font,
                  boxShadow: "0 2px 8px rgba(0,0,0,.05)",
                }}
              >
                {angles ? (
                  <Eye size={isSmall ? 10 : 13} />
                ) : (
                  <EyeOff size={isSmall ? 10 : 13} />
                )}
                {angles ? "Hide" : "Show"}
              </button>
            )}
          </div>
        )}

        {/* RIGHT PANEL */}
        <div
          style={{
            width: mode === "practice" ? "100%" : isMobile ? "100%" : 270,
            borderLeft:
              !isMobile && mode === "learn" ? `1px solid ${bc}` : "none",
            borderTop:
              isMobile && mode === "learn" ? `1px solid ${bc}` : "none",
            padding:
              mode === "practice"
                ? isSmall
                  ? "16px 14px"
                  : isMobile
                    ? "20px 18px"
                    : "24px 32px"
                : panelPad,
            display: "flex",
            flexDirection: "column",
            background: cb,
            overflowY: "auto",
            flex: isMobile && mode === "learn" ? "1 1 0%" : undefined,
            minHeight: isMobile && mode === "learn" ? 180 : undefined,
          }}
        >
          {mode === "learn" ? (
            <>
              {showStepIndicator && (
                <div
                  style={{
                    display: "flex",
                    gap: isSmall ? 4 : 6,
                    marginBottom: isSmall ? 10 : 16,
                  }}
                >
                  {Array.from({ length: STEPS }, (_, i) => (
                    <div
                      key={i}
                      onClick={() => setStep(i + 1)}
                      style={{
                        flex: 1,
                        height: isSmall ? 4 : 5,
                        borderRadius: 3,
                        cursor: "pointer",
                        background:
                          i + 1 <= step
                            ? `linear-gradient(90deg,${DS.primary},${DS.accent})`
                            : DS.grayLight,
                        transition: "all .4s ease",
                      }}
                    />
                  ))}
                </div>
              )}
              <div
                style={{
                  fontSize: isSmall ? 9 : 10,
                  fontWeight: 600,
                  color: DS.primary,
                  textTransform: "uppercase",
                  letterSpacing: ".12em",
                  marginBottom: isSmall ? 4 : 6,
                  animation: "slideR .4s ease-out both",
                }}
              >
                Step {step} of {STEPS}
              </div>
              <h3
                style={{
                  fontSize: stepTitleFs,
                  fontWeight: 700,
                  color: tc,
                  margin: `0 0 ${isSmall ? 6 : 10}px`,
                  lineHeight: 1.3,
                  animation: "slideR .4s ease-out .1s both",
                }}
              >
                {SD[step - 1].t}
              </h3>
              <p
                style={{
                  fontSize: stepDescFs,
                  lineHeight: 1.7,
                  color: st,
                  margin: 0,
                  fontWeight: 400,
                  animation: "slideR .4s ease-out .2s both",
                }}
              >
                {SD[step - 1].d}
              </p>
              {step === 3 && (
                <div
                  style={{
                    marginTop: isSmall ? 10 : 16,
                    padding: isSmall ? 10 : 14,
                    borderRadius: DS.r,
                    background: DS.lightOrange,
                    border: "1.5px solid rgba(255,114,18,.2)",
                    animation: "fadeInUp .5s ease-out .5s both",
                  }}
                >
                  <div
                    style={{
                      fontSize: isSmall ? 9 : 10,
                      fontWeight: 700,
                      color: DS.accent,
                      marginBottom: 4,
                      textTransform: "uppercase",
                      letterSpacing: ".05em",
                    }}
                  >
                    Key Insight
                  </div>
                  <div
                    style={{
                      fontSize: isSmall ? 11 : 12,
                      color: DS.text,
                      lineHeight: 1.55,
                      fontWeight: 500,
                    }}
                  >
                    Hexagons tile the plane because 3 × 120° = 360°!
                  </div>
                </div>
              )}
              {step === 4 && (
                <div
                  style={{
                    marginTop: isSmall ? 10 : 16,
                    padding: isSmall ? 10 : 14,
                    borderRadius: DS.r,
                    background: "rgba(193,193,234,.15)",
                    border: "1.5px solid rgba(74,77,201,.15)",
                    animation: "fadeInUp .5s ease-out .5s both",
                  }}
                >
                  <div
                    style={{
                      fontSize: isSmall ? 9 : 10,
                      fontWeight: 700,
                      color: DS.primary,
                      marginBottom: 4,
                      textTransform: "uppercase",
                      letterSpacing: ".05em",
                    }}
                  >
                    Construction Tip
                  </div>
                  <div
                    style={{
                      fontSize: isSmall ? 11 : 12,
                      color: DS.text,
                      lineHeight: 1.55,
                      fontWeight: 500,
                    }}
                  >
                    Compass radius = circle radius = 60° arcs.
                  </div>
                </div>
              )}
              {hTri !== null && step >= 2 && step !== 4 && (
                <div
                  style={{
                    marginTop: 10,
                    padding: 10,
                    borderRadius: DS.r,
                    background: TF[hTri].replace(/[\d.]+\)$/, ".1)"),
                    border: `1.5px solid ${TS[hTri]}25`,
                    animation: "fadeInUp .2s ease-out both",
                  }}
                >
                  <div
                    style={{ fontSize: 12, fontWeight: 700, color: TS[hTri] }}
                  >
                    Triangle {hTri + 1}
                  </div>
                  <div style={{ fontSize: 11, color: DS.text, marginTop: 3 }}>
                    All angles = 60°
                  </div>
                </div>
              )}
            </>
          ) : done ? (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                gap: isSmall ? 10 : 14,
                padding: isSmall ? "20px 0" : "40px 0",
              }}
            >
              <div
                style={{
                  width: isSmall ? 56 : 72,
                  height: isSmall ? 56 : 72,
                  borderRadius: "50%",
                  background:
                    score >= QS.length * 0.7
                      ? `linear-gradient(135deg,${DS.accent},${DS.gradEnd})`
                      : `linear-gradient(135deg,${DS.primary},${DS.gradStart})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  animation: "celeb .6s ease-out both",
                  boxShadow: `0 8px 24px ${score >= QS.length * 0.7 ? "rgba(255,114,18,.25)" : "rgba(74,77,201,.2)"}`,
                }}
              >
                <Award size={isSmall ? 24 : 32} color="#fff" />
              </div>
              <h3
                style={{
                  fontSize: isSmall ? 18 : 22,
                  fontWeight: 700,
                  color: tc,
                  margin: 0,
                  animation: "fadeInUp .5s ease-out .2s both",
                }}
              >
                {score >= QS.length * 0.7
                  ? "Excellent!"
                  : score >= QS.length * 0.4
                    ? "Good Effort!"
                    : "Keep Practising!"}
              </h3>
              <div
                style={{
                  fontSize: isSmall ? 32 : 42,
                  fontWeight: 800,
                  background: `linear-gradient(135deg,${DS.primary},${DS.accent})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  animation: "fadeInUp .5s ease-out .3s both",
                }}
              >
                {score}/{QS.length}
              </div>
              <p
                style={{
                  fontSize: isSmall ? 11 : 13,
                  color: st,
                  margin: 0,
                  maxWidth: 280,
                  lineHeight: 1.6,
                  fontWeight: 400,
                  animation: "fadeInUp .5s ease-out .4s both",
                }}
              >
                {score === QS.length
                  ? "Perfect! You've mastered hexagon construction."
                  : "Review Learn mode to strengthen understanding."}
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginTop: 8,
                  animation: "fadeInUp .5s ease-out .5s both",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <button
                  onClick={resetP}
                  style={{
                    padding: isSmall ? "8px 16px" : "10px 24px",
                    borderRadius: DS.r,
                    border: "none",
                    background: `linear-gradient(135deg,${DS.gradStart},${DS.gradEnd})`,
                    color: "#fff",
                    fontSize: btnFs,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: DS.font,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    boxShadow: "0 4px 14px rgba(83,48,134,.25)",
                  }}
                >
                  <RotateCcw size={14} /> Try Again
                </button>
                <button
                  onClick={() => {
                    setMode("learn");
                    resetA();
                  }}
                  style={{
                    padding: isSmall ? "8px 16px" : "10px 24px",
                    borderRadius: DS.r,
                    border: `2px solid ${DS.primary}`,
                    background: "transparent",
                    color: DS.primary,
                    fontSize: btnFs,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: DS.font,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <BookOpen size={14} /> Review
                </button>
              </div>
            </div>
          ) : (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                maxWidth: 560,
                margin: "0 auto",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: isSmall ? 6 : 10,
                  marginBottom: isSmall ? 10 : 14,
                }}
              >
                <div
                  style={{
                    flex: 1,
                    height: isSmall ? 5 : 6,
                    borderRadius: 3,
                    background: DS.grayLight,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      borderRadius: 3,
                      background: `linear-gradient(90deg,${DS.primary},${DS.accent})`,
                      width: `${((qi + 1) / QS.length) * 100}%`,
                      transition: "width .5s cubic-bezier(.4,0,.2,1)",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: isSmall ? 10 : 11,
                    fontWeight: 600,
                    color: DS.textLight,
                  }}
                >
                  {qi + 1}/{QS.length}
                </span>
                <div
                  style={{
                    padding: "3px 8px",
                    borderRadius: 20,
                    background: DS.lightOrange,
                    fontSize: isSmall ? 10 : 11,
                    fontWeight: 700,
                    color: DS.accent,
                  }}
                >
                  {score} pts
                </div>
              </div>
              <div
                style={{
                  marginBottom: isSmall ? 12 : 16,
                  animation: "slideL .4s ease-out both",
                }}
              >
                <div
                  style={{
                    fontSize: isSmall ? 9 : 10,
                    fontWeight: 700,
                    color: DS.primary,
                    textTransform: "uppercase",
                    letterSpacing: ".1em",
                    marginBottom: isSmall ? 6 : 8,
                  }}
                >
                  Question {qi + 1}
                </div>
                <p
                  style={{
                    fontSize: qFs,
                    fontWeight: 600,
                    color: tc,
                    margin: 0,
                    lineHeight: 1.55,
                  }}
                >
                  {cq.question}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: isSmall ? 6 : 8,
                  marginBottom: isSmall ? 10 : 14,
                }}
              >
                {cq.options.map((o, idx) => (
                  <div
                    key={o.id}
                    onClick={() => optSel(o.id)}
                    onMouseEnter={() => ans === "unanswered" && setHOpt(o.id)}
                    onMouseLeave={() => setHOpt(null)}
                    style={{
                      ...optStyle(o),
                      animation: `slideL .3s ease-out ${idx * 0.07}s both`,
                    }}
                  >
                    <div
                      style={{
                        width: isSmall ? 24 : 28,
                        height: isSmall ? 24 : 28,
                        borderRadius: DS.rSm,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: isSmall ? 10 : 12,
                        fontWeight: 700,
                        flexShrink: 0,
                        background:
                          ans !== "unanswered" && o.isCorrect
                            ? DS.success
                            : ans !== "unanswered" &&
                                sel === o.id &&
                                !o.isCorrect
                              ? DS.error
                              : DS.grayBg,
                        color:
                          ans !== "unanswered" && (o.isCorrect || sel === o.id)
                            ? "#fff"
                            : DS.text,
                        transition: "all .3s ease",
                      }}
                    >
                      {ans !== "unanswered" && o.isCorrect ? (
                        <Check size={isSmall ? 12 : 14} />
                      ) : ans !== "unanswered" &&
                        sel === o.id &&
                        !o.isCorrect ? (
                        <X size={isSmall ? 12 : 14} />
                      ) : (
                        o.id.toUpperCase()
                      )}
                    </div>
                    <span style={{ flex: 1 }}>{o.text}</span>
                  </div>
                ))}
              </div>
              {showExp && (
                <div
                  style={{
                    padding: isSmall ? 10 : 14,
                    borderRadius: DS.r,
                    marginBottom: isSmall ? 10 : 14,
                    background:
                      ans === "correct"
                        ? "rgba(46,204,113,.06)"
                        : "rgba(231,76,60,.05)",
                    border: `1.5px solid ${ans === "correct" ? "rgba(46,204,113,.2)" : "rgba(231,76,60,.15)"}`,
                    animation: "fadeInUp .4s ease-out both",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 4,
                    }}
                  >
                    {ans === "correct" ? (
                      <Check size={14} color={DS.success} />
                    ) : (
                      <X size={14} color={DS.error} />
                    )}
                    <span
                      style={{
                        fontSize: isSmall ? 10 : 11,
                        fontWeight: 700,
                        color: ans === "correct" ? DS.success : DS.error,
                      }}
                    >
                      {ans === "correct" ? "Correct!" : "Not quite right"}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: isSmall ? 11 : 12,
                      color: DS.text,
                      margin: 0,
                      lineHeight: 1.6,
                      fontWeight: 400,
                    }}
                  >
                    {cq.explanation}
                  </p>
                </div>
              )}
              {ans !== "unanswered" && (
                <div
                  style={{
                    marginTop: "auto",
                    paddingTop: 8,
                    animation: "fadeInUp .3s ease-out both",
                  }}
                >
                  <button
                    onClick={nextQ}
                    style={{
                      width: "100%",
                      padding: isSmall ? "10px 16px" : "12px 24px",
                      borderRadius: DS.r,
                      border: "none",
                      background: `linear-gradient(135deg,${DS.gradStart},${DS.gradEnd})`,
                      color: "#fff",
                      fontSize: btnFs,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: DS.font,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      boxShadow: "0 4px 14px rgba(83,48,134,.25)",
                    }}
                  >
                    {qi < QS.length - 1 ? "Next Question" : "See Results"}
                    <ChevronRight size={isSmall ? 14 : 16} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      {showNavigation && mode === "learn" && (
        <div
          style={{
            padding: footPad,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `1px solid ${bc}`,
            background: cb,
            gap: isSmall ? 4 : 8,
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => step > 1 && setStep((p) => p - 1)}
            disabled={step <= 1}
            style={{
              padding: btnPad,
              borderRadius: DS.r,
              border: `2px solid ${step <= 1 ? DS.grayLight : DS.primary}`,
              background: "transparent",
              cursor: step <= 1 ? "default" : "pointer",
              color: step <= 1 ? DS.gray : DS.primary,
              fontSize: btnFs,
              fontWeight: 600,
              fontFamily: DS.font,
              display: "flex",
              alignItems: "center",
              gap: isSmall ? 3 : 6,
              opacity: step <= 1 ? 0.4 : 1,
              transition: "all .3s ease",
              whiteSpace: "nowrap",
            }}
          >
            <ChevronLeft size={isSmall ? 14 : 16} />
            {!isSmall && " Previous"}
          </button>
          <button
            onClick={resetA}
            style={{
              padding: isSmall ? "6px 10px" : "8px 16px",
              borderRadius: DS.r,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: DS.primary,
              fontSize: isSmall ? 10 : 12,
              fontWeight: 600,
              fontFamily: DS.font,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <RotateCcw size={isSmall ? 12 : 14} />
            {!isSmall && " Reset"}
          </button>
          <button
            onClick={() => step < STEPS && setStep((p) => p + 1)}
            disabled={step >= STEPS}
            style={{
              padding: btnPad,
              borderRadius: DS.r,
              border: "none",
              background:
                step >= STEPS
                  ? DS.grayLight
                  : `linear-gradient(135deg,${DS.gradStart},${DS.gradEnd})`,
              cursor: step >= STEPS ? "default" : "pointer",
              color: step >= STEPS ? DS.gray : "#fff",
              fontSize: btnFs,
              fontWeight: 600,
              fontFamily: DS.font,
              display: "flex",
              alignItems: "center",
              gap: isSmall ? 3 : 6,
              opacity: step >= STEPS ? 0.5 : 1,
              boxShadow:
                step >= STEPS ? "none" : "0 4px 14px rgba(83,48,134,.25)",
              transition: "all .3s ease",
              whiteSpace: "nowrap",
            }}
          >
            {!isSmall && "Next "}
            <ChevronRight size={isSmall ? 14 : 16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default HexagonConstructor;
