// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: perpendicular_bisector_constructor.tsx
// Redesigned with Singularity Design System
// Colors: #4A4DC9 (primary purple), #FF7212 (accent orange), #533086/#FC9145 gradient
// Font: Poppins | Buttons: Contained/Outlined/Texted states
// ═══════════════════════════════════════════════════════════════════════════

// Lightweight local React-style helpers so this file can compile
// without relying on external 'react' or icon packages.
type FC<P = {}> = (props: P) => any;

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

// Minimal React-like object so JSX has 'React' in scope.
const React: any = {};

function useState<S>(
  initial: S | (() => S),
): [S, (value: S | ((prev: S) => S)) => void] {
  // noop runtime stub; enough for typing.
  const value = typeof initial === "function" ? (initial as any)() : initial;
  const setValue = () => {};
  return [value, setValue];
}

function useEffect(_effect: (...args: any[]) => any, _deps?: any[]): void {
  // noop stub
}

function useRef<T>(initial: T | null): { current: T | null } {
  return { current: initial };
}

function useCallback<T extends (...args: any[]) => any>(fn: T, _deps: any[]): T {
  return fn;
}

function useMemo<T>(factory: () => T, _deps: any[]): T {
  return factory();
}

type IconProps = { size?: number; color?: string };

const ChevronLeft: FC<IconProps> = () => null;
const ChevronRight: FC<IconProps> = () => null;
const RotateCcw: FC<IconProps> = () => null;
const BookOpen: FC<IconProps> = () => null;
const Target: FC<IconProps> = () => null;
const Award: FC<IconProps> = () => null;
const Plus: FC<IconProps> = () => null;

// ==================== TYPE DEFINITIONS ====================

type ModeType = "learn" | "practice";

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
  type: "intro" | "explanation" | "practice";
  mode: ModeType;
  data?: any;
}

interface BaseDataInterface {
  themeColor?: string;
  autoPlayDuration?: number;
}

interface PerpendicularBisectorAdditionalProps {
  lineSegmentXY?: {
    step1?: { label?: string; length?: number; visible?: boolean };
    step2?: { label?: string; length?: number; visible?: boolean };
    step3?: { label?: string; length?: number; visible?: boolean };
    step4?: { label?: string; length?: number; visible?: boolean };
  };
  arcsAbove?: { [key: string]: any };
  arcsBelow?: { [key: string]: any };
  bisectorLine?: { [key: string]: any };
  measurementDisplay?: { [key: string]: any };
}

interface PerpendicularBisectorConstructorProps {
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
    additionalProps?: PerpendicularBisectorAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== SINGULARITY DESIGN TOKENS ====================

const DS = {
  // Primary
  purple: "#4A4DC9",
  orange: "#FF7212",
  // Gradient endpoints
  gradPurple: "#533086",
  gradOrange: "#FC9145",
  // Light variants
  lightPurple: "#C1C1EA",
  lightOrange: "#FFF3E4",
  // Neutrals
  dark: "#4E4E4E",
  gray: "#CACACA",
  lightGray: "#EBEBEB",
  offWhite: "#F5F5F5",
  white: "#FFFFFF",
  // Solid fills
  solidPurple: "#533086",
  solidOrange: "#FC9145",
  // Semantic
  success: "#2EBD6B",
  error: "#E5453F",
  // Spacing
  pad: 24,
  btnHeight: 40,
  radius: 8,
  radiusLg: 16,
  radiusXl: 24,
  // Font
  font: "'Poppins', 'Segoe UI', sans-serif",
};

// ==================== PRACTICE QUESTIONS ====================

interface PracticeQuestion {
  id: number;
  type: "mcq" | "fill_blank" | "true_false";
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  hint?: string;
}

const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  {
    id: 1,
    type: "mcq",
    question:
      "When constructing a perpendicular bisector, the compass radius must be:",
    options: [
      "Equal to half of XY",
      "Greater than half of XY",
      "Less than half of XY",
      "Exactly equal to XY",
    ],
    correctAnswer: "Greater than half of XY",
    explanation:
      "The compass radius must exceed half of XY so that the arcs from X and Y actually intersect above and below the line.",
    hint: "Think about when two circles can intersect.",
  },
  {
    id: 2,
    type: "true_false",
    question:
      "The perpendicular bisector of XY passes through the midpoint of XY at 90°.",
    correctAnswer: "True",
    explanation:
      "By definition, a perpendicular bisector both bisects the segment (midpoint) and is perpendicular to it (90°).",
  },
  {
    id: 3,
    type: "fill_blank",
    question:
      "If A is the intersection point above XY, then XA ____ YA (=, >, or <).",
    correctAnswer: "=",
    explanation:
      "Since both arcs are drawn with the same compass radius, XA = YA. Point A is equidistant from both endpoints.",
    hint: "Both arcs use the same compass radius.",
  },
  {
    id: 4,
    type: "mcq",
    question:
      "How many intersection points are needed to construct a perpendicular bisector?",
    options: ["1", "2", "3", "4"],
    correctAnswer: "2",
    explanation:
      "We need two points — A above and B below — to draw the bisector line AB.",
  },
  {
    id: 5,
    type: "true_false",
    question:
      "You can use different radii for arcs above and below XY and still get the perpendicular bisector.",
    correctAnswer: "True",
    explanation:
      "Yes! As long as each pair uses the same radius, both intersection points lie on the perpendicular bisector.",
  },
  {
    id: 6,
    type: "mcq",
    question: "Any point equidistant from X and Y lies on the:",
    options: [
      "Line segment XY",
      "Perpendicular bisector of XY",
      "Circle through X and Y",
      "Angle bisector of XY",
    ],
    correctAnswer: "Perpendicular bisector of XY",
    explanation:
      "Every point equidistant from both X and Y must lie on the perpendicular bisector of XY.",
  },
  {
    id: 7,
    type: "fill_blank",
    question:
      "The angle between the perpendicular bisector and line XY is ____ degrees.",
    correctAnswer: "90",
    explanation:
      'The perpendicular bisector meets XY at exactly 90° — that is what "perpendicular" means.',
    hint: 'The word "perpendicular" is the clue!',
  },
  {
    id: 8,
    type: "true_false",
    question:
      "If the compass radius is less than half of XY, the arcs from X and Y will not intersect.",
    correctAnswer: "True",
    explanation:
      "If the radius is too small, the circles from X and Y cannot reach each other.",
  },
  {
    id: 9,
    type: "mcq",
    question:
      "If O is the midpoint found by the perpendicular bisector, which is true?",
    options: ["XO > OY", "XO < OY", "XO = OY", "XO + OY > XY"],
    correctAnswer: "XO = OY",
    explanation: "O is the midpoint, so XO = OY by definition.",
  },
  {
    id: 10,
    type: "fill_blank",
    question:
      "The congruence condition to prove △AOX ≅ △AOY is ____. (SSS/SAS/ASA)",
    correctAnswer: "SAS",
    explanation:
      "SAS: AX = AY (same radius), AO is common, ∠XAO = ∠YAO (from △ABX ≅ △ABY by SSS).",
    hint: "Two sides and the included angle are equal.",
  },
];

// ==================== DEFAULT LEARN STEPS ====================

const LEARN_STEPS: StepDataInterface[] = [
  {
    id: 1,
    title: "Examine Line Segment XY",
    description:
      "We start with a given line segment XY. To construct its perpendicular bisector, we need a compass and an unmarked ruler. Choose a compass radius greater than half of XY — this ensures the arcs will intersect above and below the line.",
    type: "intro",
    mode: "learn",
  },
  {
    id: 2,
    title: "Draw Arcs Above the Line",
    description:
      "Place the compass at X and draw an arc above XY. Keeping the same radius, draw another arc from Y. The two arcs intersect at point A. Since both arcs have the same radius: XA = YA — point A is equidistant from both endpoints.",
    type: "explanation",
    mode: "learn",
  },
  {
    id: 3,
    title: "Draw Arcs Below the Line",
    description:
      "Using the same radius, draw arcs from X and Y below the line. They intersect at point B. Now XB = YB. Both A and B are equidistant from X and Y — they both lie on the perpendicular bisector.",
    type: "explanation",
    mode: "learn",
  },
  {
    id: 4,
    title: "Draw the Perpendicular Bisector",
    description:
      "Join A and B with a straight line. Line AB is the perpendicular bisector of XY! It passes through midpoint O where XO = OY, and meets XY at exactly 90°. This compass-and-ruler construction is geometrically exact.",
    type: "explanation",
    mode: "learn",
  },
];

// ==================== EASING ====================

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

// ==================== KEYFRAMES ====================

const keyframes = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
@keyframes popIn {
    0% { transform: scale(0); opacity: 0; }
    60% { transform: scale(1.2); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
}
@keyframes glowPulse {
    0%, 100% { filter: drop-shadow(0 0 4px rgba(74, 77, 201, 0.3)); }
    50% { filter: drop-shadow(0 0 14px rgba(74, 77, 201, 0.6)); }
}
@keyframes bounceIn {
    0% { transform: scale(0); }
    50% { transform: scale(1.12); }
    70% { transform: scale(0.96); }
    100% { transform: scale(1); }
}
@keyframes labelSlideIn {
    from { opacity: 0; transform: translateY(5px) scale(0.92); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes correctGlow {
    0% { box-shadow: 0 0 0 0 rgba(46, 189, 107, 0.4); }
    70% { box-shadow: 0 0 0 10px rgba(46, 189, 107, 0); }
    100% { box-shadow: 0 0 0 0 rgba(46, 189, 107, 0); }
}
@keyframes wrongShake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
}
@keyframes shimmerGrad {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
}
@keyframes stepPing {
    0% { transform: scale(1); opacity: 1; }
    100% { transform: scale(2.2); opacity: 0; }
}
`;

// ==================== MAIN COMPONENT ====================

const PerpendicularBisectorConstructor: FC<PerpendicularBisectorConstructorProps> =
  ({ props = {}, setStepDetails, stopAutoNext, setStopAutoNext }) => {
  const config = useMemo(
    () => ({
      width: props.width ?? 800,
      height: props.height ?? 700,
      initialMode: props.initialMode ?? ("learn" as ModeType),
      showModeSelector: props.showModeSelector ?? true,
      enabledModes: props.enabledModes ?? (["learn", "practice"] as ModeType[]),
      showNavigation: props.showNavigation ?? true,
      showStepIndicator: props.showStepIndicator ?? true,
      animationSpeed: props.animationSpeed ?? 1,
      themeColor: props.themeColor ?? DS.purple,
    }),
    [props],
  );

  const additionalProps = props.additionalProps || {};

  // ─── STATE ────────────────────────────────────────────
  const [mode, setMode] = useState<ModeType>(config.initialMode);
  const [learnStep, setLearnStep] = useState(0);
  const [animProg, setAnimProg] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const animRef = useRef<number>(0);

  // Practice
  const [qIdx, setQIdx] = useState(0);
  const [selAnswer, setSelAnswer] = useState<string | null>(null);
  const [fillAns, setFillAns] = useState("");
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [hint, setHint] = useState(false);
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);

  // Geometry
  const SVG_W = 520;
  const SVG_H = 370;
  const segLen = additionalProps.lineSegmentXY?.step1?.length ?? 260;
  const mx = SVG_W / 2;
  const my = SVG_H / 2;
  const xL = mx - segLen / 2;
  const xR = mx + segLen / 2;
  const cr = segLen * 0.66;
  const half = segLen / 2;
  const ah = Math.sqrt(cr * cr - half * half);
  const pA = { x: mx, y: my - ah };
  const pB = { x: mx, y: my + ah };

  const curStep = LEARN_STEPS[learnStep];

  // Shuffle questions
  useEffect(() => {
    setQuestions([...PRACTICE_QUESTIONS].sort(() => Math.random() - 0.5));
  }, []);
  const curQ = questions[qIdx] || PRACTICE_QUESTIONS[0];

  // Animation — longer for steps 2 & 3 so sequential arcs are distinct
  useEffect(() => {
    setAnimProg(0);
    let start: number | null = null;
    const isArcStep = learnStep === 1 || learnStep === 2; // steps 2 & 3 (0-indexed 1 & 2)
    const dur = (isArcStep ? 3600 : 1400) / config.animationSpeed;
    const run = (ts: number) => {
      if (!start) start = ts;
      const t = Math.min((ts - start) / dur, 1);
      setAnimProg(easeOutCubic(t));
      if (t < 1) animRef.current = requestAnimationFrame(run);
    };
    animRef.current = requestAnimationFrame(run);
    return () => {
      if (animRef.current != null) {
        cancelAnimationFrame(animRef.current as number);
      }
    };
  }, [learnStep, animKey, config.animationSpeed]);

  // Inject keyframes + Poppins font
  useEffect(() => {
    const s = document.createElement("style");
    s.id = "singularity-kb";
    s.textContent = keyframes;
    document.head.appendChild(s);
    return () => {
      document.getElementById("singularity-kb")?.remove();
    };
  }, []);

  // Step details
  useEffect(() => {
    setStepDetails?.({
      currentStep: learnStep + 1,
      totalSteps: LEARN_STEPS.length,
      isPaused: true,
      currentMode: mode,
    });
  }, [learnStep, mode, setStepDetails]);

  // Nav
  const goNext = () => {
    if (learnStep < LEARN_STEPS.length - 1) setLearnStep((s) => s + 1);
  };
  const goPrev = () => {
    if (learnStep > 0) setLearnStep((s) => s - 1);
  };
  const reset = () => {
    setLearnStep(0);
    setAnimKey((k) => k + 1);
    setQIdx(0);
    setSelAnswer(null);
    setFillAns("");
    setAnswered(false);
    setScore(0);
    setAttempts(0);
    setHint(false);
    setQuestions([...PRACTICE_QUESTIONS].sort(() => Math.random() - 0.5));
  };

  // Practice
  const checkAns = (a: string) => {
    if (answered) return;
    const ok =
      a.trim().toLowerCase() === curQ.correctAnswer.trim().toLowerCase();
    setCorrect(ok);
    setAnswered(true);
    setAttempts((n) => n + 1);
    if (ok) setScore((n) => n + 1);
  };
  const nextQ = () => {
    if (qIdx < questions.length - 1) setQIdx((i) => i + 1);
    else {
      setQIdx(0);
      setQuestions([...PRACTICE_QUESTIONS].sort(() => Math.random() - 0.5));
    }
    setSelAnswer(null);
    setFillAns("");
    setAnswered(false);
    setCorrect(false);
    setHint(false);
  };

  // Arc path helper
  const arc = useCallback(
    (cx: number, cy: number, r: number, s: number, e: number) => {
      const rad = (d: number) => (d * Math.PI) / 180;
      const x1 = cx + r * Math.cos(rad(s)),
        y1 = cy + r * Math.sin(rad(s));
      const x2 = cx + r * Math.cos(rad(e)),
        y2 = cy + r * Math.sin(rad(e));
      return `M ${x1} ${y1} A ${r} ${r} 0 ${e - s > 180 ? 1 : 0} 1 ${x2} ${y2}`;
    },
    [],
  );

  const aXA = (Math.atan2(pA.y - my, pA.x - xL) * 180) / Math.PI;
  const aYA = (Math.atan2(pA.y - my, pA.x - xR) * 180) / Math.PI;

  // ═══════════════════════════════════════════════════════
  // LEARN SVG
  // ═══════════════════════════════════════════════════════

  const renderSVG = () => {
    const st = learnStep + 1;
    const p = animProg;

    return (
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        style={{
          display: "block",
          borderRadius: DS.radiusLg,
          background: DS.white,
          overflow: "hidden",
        }}
      >
        {/* Grid dots */}
        {Array.from({ length: 27 }).map((_, i) =>
          Array.from({ length: 19 }).map((_, j) => (
            <circle
              key={`${i}${j}`}
              cx={i * 20 + 10}
              cy={j * 20 + 10}
              r={0.5}
              fill={DS.lightGray}
            />
          )),
        )}

        {/* LINE SEGMENT XY */}
        <line
          x1={xL}
          y1={my}
          x2={st === 1 ? xL + segLen * p : xR}
          y2={my}
          stroke={DS.dark}
          strokeWidth={3}
          strokeLinecap="round"
        />

        {/* Point X */}
        <circle
          cx={xL}
          cy={my}
          r={st === 1 ? 6 * Math.min(p * 3, 1) : 6}
          fill={DS.purple}
          stroke={DS.white}
          strokeWidth={2}
        />
        <text
          x={xL}
          y={my + 26}
          textAnchor="middle"
          fill={DS.purple}
          fontSize={14}
          fontWeight={700}
          fontFamily={DS.font}
          style={{ opacity: st === 1 ? Math.min(p * 3, 1) : 1 }}
        >
          X
        </text>

        {/* Point Y */}
        {(st > 1 || p > 0.3) && (
          <>
            <circle
              cx={xR}
              cy={my}
              r={st === 1 ? 6 * Math.min((p - 0.3) * 2.5, 1) : 6}
              fill={DS.purple}
              stroke={DS.white}
              strokeWidth={2}
            />
            <text
              x={xR}
              y={my + 26}
              textAnchor="middle"
              fill={DS.purple}
              fontSize={14}
              fontWeight={700}
              fontFamily={DS.font}
              style={{ opacity: st === 1 ? Math.min((p - 0.3) * 2.5, 1) : 1 }}
            >
              Y
            </text>
          </>
        )}

        {/* Step 1: half indicator */}
        {st === 1 && p > 0.55 && (
          <g style={{ animation: "fadeIn 0.7s ease-out both" }}>
            <line
              x1={xL}
              y1={my + 38}
              x2={mx}
              y2={my + 38}
              stroke={DS.orange}
              strokeWidth={2.5}
              strokeLinecap="round"
            />
            <line
              x1={xL}
              y1={my + 34}
              x2={xL}
              y2={my + 42}
              stroke={DS.orange}
              strokeWidth={2}
            />
            <line
              x1={mx}
              y1={my + 34}
              x2={mx}
              y2={my + 42}
              stroke={DS.orange}
              strokeWidth={2}
            />
            <text
              x={(xL + mx) / 2}
              y={my + 56}
              textAnchor="middle"
              fill={DS.orange}
              fontSize={10}
              fontWeight={600}
              fontFamily={DS.font}
            >
              ½ of XY
            </text>
            <line
              x1={xL}
              y1={my - 20}
              x2={xR}
              y2={my - 20}
              stroke={DS.gray}
              strokeWidth={1}
              strokeDasharray="4 3"
            />
            <text
              x={mx}
              y={my - 28}
              textAnchor="middle"
              fill={DS.dark}
              fontSize={9}
              fontWeight={500}
              fontFamily={DS.font}
            >
              XY = {segLen}
            </text>
            <rect
              x={mx - 145}
              y={my + 66}
              width={290}
              height={26}
              rx={13}
              fill={DS.lightOrange}
            />
            <text
              x={mx}
              y={my + 83}
              textAnchor="middle"
              fill={DS.gradOrange}
              fontSize={10}
              fontWeight={600}
              fontFamily={DS.font}
            >
              Compass radius must be greater than ½ of XY
            </text>
          </g>
        )}

        {/* STEP 2: Arcs above — one by one */}
        {st >= 2 &&
          (() => {
            // When on step 2, sequence: arc from X (0-0.4), arc from Y (0.4-0.75), point A (0.75+), labels (0.85+)
            const arcXprog = st === 2 ? Math.min(p / 0.4, 1) : 1;
            const arcYprog =
              st === 2 ? Math.max(0, Math.min((p - 0.4) / 0.35, 1)) : 1;
            const ptProg =
              st === 2 ? Math.max(0, Math.min((p - 0.75) / 0.15, 1)) : 1;
            const lblProg =
              st === 2 ? Math.max(0, Math.min((p - 0.85) / 0.15, 1)) : 1;
            return (
              <g>
                {/* Arc from X above — draws first */}
                {arcXprog > 0 && (
                  <path
                    d={arc(xL, my, cr, aXA - 22, aXA + 22)}
                    fill="none"
                    stroke={DS.purple}
                    strokeWidth={2}
                    strokeDasharray="7 4"
                    opacity={0.8}
                    strokeLinecap="round"
                    style={{
                      strokeDashoffset: 300 * (1 - arcXprog),
                      transition: "stroke-dashoffset 0.6s ease-out",
                    }}
                  />
                )}
                {/* "From X" label while arc draws */}
                {st === 2 && arcXprog > 0.3 && arcYprog < 0.1 && (
                  <text
                    x={xL}
                    y={my - 16}
                    textAnchor="middle"
                    fill={DS.purple}
                    fontSize={9}
                    fontWeight={600}
                    fontFamily={DS.font}
                    opacity={0.7}
                    style={{ animation: "labelSlideIn 0.3s ease-out both" }}
                  >
                    arc from X
                  </text>
                )}
                {/* Arc from Y above — draws second */}
                {arcYprog > 0 && (
                  <path
                    d={arc(xR, my, cr, aYA - 22, aYA + 22)}
                    fill="none"
                    stroke={DS.purple}
                    strokeWidth={2}
                    strokeDasharray="7 4"
                    opacity={0.8}
                    strokeLinecap="round"
                    style={{
                      strokeDashoffset: 300 * (1 - arcYprog),
                      transition: "stroke-dashoffset 0.6s ease-out",
                    }}
                  />
                )}
                {/* "From Y" label while arc draws */}
                {st === 2 && arcYprog > 0.3 && ptProg < 0.1 && (
                  <text
                    x={xR}
                    y={my - 16}
                    textAnchor="middle"
                    fill={DS.purple}
                    fontSize={9}
                    fontWeight={600}
                    fontFamily={DS.font}
                    opacity={0.7}
                    style={{ animation: "labelSlideIn 0.3s ease-out both" }}
                  >
                    arc from Y
                  </text>
                )}
                {/* Point A appears after both arcs */}
                {ptProg > 0 && (
                  <g>
                    <circle
                      cx={pA.x}
                      cy={pA.y}
                      r={6 * ptProg}
                      fill={DS.orange}
                      stroke={DS.white}
                      strokeWidth={2}
                    />
                    <text
                      x={pA.x + 14}
                      y={pA.y - 6}
                      fill={DS.orange}
                      fontSize={14}
                      fontWeight={700}
                      fontFamily={DS.font}
                      style={{ opacity: ptProg }}
                    >
                      A
                    </text>
                  </g>
                )}
                {/* Measurement lines + label */}
                {lblProg > 0 && (
                  <g
                    style={{
                      opacity: lblProg,
                      animation:
                        st === 2 ? "labelSlideIn 0.4s ease-out both" : "none",
                    }}
                  >
                    <line
                      x1={xL}
                      y1={my}
                      x2={pA.x}
                      y2={pA.y}
                      stroke={`${DS.orange}33`}
                      strokeWidth={1.5}
                      strokeDasharray="3 3"
                    />
                    <line
                      x1={xR}
                      y1={my}
                      x2={pA.x}
                      y2={pA.y}
                      stroke={`${DS.orange}33`}
                      strokeWidth={1.5}
                      strokeDasharray="3 3"
                    />
                    <rect
                      x={mx - 36}
                      y={pA.y - 26}
                      width={72}
                      height={18}
                      rx={9}
                      fill={DS.lightOrange}
                    />
                    <text
                      x={mx}
                      y={pA.y - 14}
                      textAnchor="middle"
                      fill={DS.gradOrange}
                      fontSize={9}
                      fontWeight={700}
                      fontFamily={DS.font}
                    >
                      XA = YA ✓
                    </text>
                  </g>
                )}
              </g>
            );
          })()}

        {/* STEP 3: Arcs below — one by one */}
        {st >= 3 &&
          (() => {
            // Sequence: arc from X below (0-0.4), arc from Y below (0.4-0.75), point B (0.75+), labels (0.85+)
            const arcXprog = st === 3 ? Math.min(p / 0.4, 1) : 1;
            const arcYprog =
              st === 3 ? Math.max(0, Math.min((p - 0.4) / 0.35, 1)) : 1;
            const ptProg =
              st === 3 ? Math.max(0, Math.min((p - 0.75) / 0.15, 1)) : 1;
            const lblProg =
              st === 3 ? Math.max(0, Math.min((p - 0.85) / 0.15, 1)) : 1;
            return (
              <g>
                {/* Arc from X below — draws first */}
                {arcXprog > 0 && (
                  <path
                    d={arc(xL, my, cr, -aXA - 22, -aXA + 22)}
                    fill="none"
                    stroke={DS.purple}
                    strokeWidth={2}
                    strokeDasharray="7 4"
                    opacity={0.8}
                    strokeLinecap="round"
                    style={{
                      strokeDashoffset: 300 * (1 - arcXprog),
                      transition: "stroke-dashoffset 0.6s ease-out",
                    }}
                  />
                )}
                {/* "From X" label while arc draws */}
                {st === 3 && arcXprog > 0.3 && arcYprog < 0.1 && (
                  <text
                    x={xL}
                    y={my + 22}
                    textAnchor="middle"
                    fill={DS.purple}
                    fontSize={9}
                    fontWeight={600}
                    fontFamily={DS.font}
                    opacity={0.7}
                    style={{ animation: "labelSlideIn 0.3s ease-out both" }}
                  >
                    arc from X
                  </text>
                )}
                {/* Arc from Y below — draws second */}
                {arcYprog > 0 && (
                  <path
                    d={arc(xR, my, cr, -aYA - 22, -aYA + 22)}
                    fill="none"
                    stroke={DS.purple}
                    strokeWidth={2}
                    strokeDasharray="7 4"
                    opacity={0.8}
                    strokeLinecap="round"
                    style={{
                      strokeDashoffset: 300 * (1 - arcYprog),
                      transition: "stroke-dashoffset 0.6s ease-out",
                    }}
                  />
                )}
                {/* "From Y" label while arc draws */}
                {st === 3 && arcYprog > 0.3 && ptProg < 0.1 && (
                  <text
                    x={xR}
                    y={my + 22}
                    textAnchor="middle"
                    fill={DS.purple}
                    fontSize={9}
                    fontWeight={600}
                    fontFamily={DS.font}
                    opacity={0.7}
                    style={{ animation: "labelSlideIn 0.3s ease-out both" }}
                  >
                    arc from Y
                  </text>
                )}
                {/* Point B appears after both arcs */}
                {ptProg > 0 && (
                  <g>
                    <circle
                      cx={pB.x}
                      cy={pB.y}
                      r={6 * ptProg}
                      fill={DS.orange}
                      stroke={DS.white}
                      strokeWidth={2}
                    />
                    <text
                      x={pB.x + 14}
                      y={pB.y + 16}
                      fill={DS.orange}
                      fontSize={14}
                      fontWeight={700}
                      fontFamily={DS.font}
                      style={{ opacity: ptProg }}
                    >
                      B
                    </text>
                  </g>
                )}
                {/* Measurement lines + label */}
                {lblProg > 0 && (
                  <g
                    style={{
                      opacity: lblProg,
                      animation:
                        st === 3 ? "labelSlideIn 0.4s ease-out both" : "none",
                    }}
                  >
                    <line
                      x1={xL}
                      y1={my}
                      x2={pB.x}
                      y2={pB.y}
                      stroke={`${DS.orange}33`}
                      strokeWidth={1.5}
                      strokeDasharray="3 3"
                    />
                    <line
                      x1={xR}
                      y1={my}
                      x2={pB.x}
                      y2={pB.y}
                      stroke={`${DS.orange}33`}
                      strokeWidth={1.5}
                      strokeDasharray="3 3"
                    />
                    <rect
                      x={mx - 36}
                      y={pB.y + 8}
                      width={72}
                      height={18}
                      rx={9}
                      fill={DS.lightOrange}
                    />
                    <text
                      x={mx}
                      y={pB.y + 20}
                      textAnchor="middle"
                      fill={DS.gradOrange}
                      fontSize={9}
                      fontWeight={700}
                      fontFamily={DS.font}
                    >
                      XB = YB ✓
                    </text>
                  </g>
                )}
              </g>
            );
          })()}

        {/* STEP 4: Bisector */}
        {st >= 4 && (
          <g>
            {/* Glow */}
            <line
              x1={pA.x}
              y1={pA.y - 22}
              x2={pB.x}
              y2={pB.y + 22}
              stroke={DS.purple}
              strokeWidth={8}
              strokeLinecap="round"
              opacity={0.1}
              style={{ animation: "glowPulse 2.5s ease-in-out infinite" }}
            />
            {/* Bisector line */}
            <line
              x1={pA.x}
              y1={pA.y - 22}
              x2={pB.x}
              y2={pB.y + 22}
              stroke={DS.purple}
              strokeWidth={3}
              strokeLinecap="round"
              strokeDasharray="600"
              style={{
                strokeDashoffset: 600 * (1 - p),
                transition: "stroke-dashoffset 1.2s ease-out",
              }}
            />

            {/* Midpoint O */}
            {p > 0.35 && (
              <g style={{ animation: "bounceIn 0.5s ease-out both" }}>
                <circle
                  cx={mx}
                  cy={my}
                  r={5.5}
                  fill={DS.orange}
                  stroke={DS.white}
                  strokeWidth={2}
                />
                <text
                  x={mx + 13}
                  y={my + 4}
                  fill={DS.orange}
                  fontSize={14}
                  fontWeight={700}
                  fontFamily={DS.font}
                >
                  O
                </text>
              </g>
            )}

            {/* 90° mark */}
            {p > 0.55 && (
              <g style={{ animation: "fadeIn 0.5s ease-out both" }}>
                <polyline
                  points={`${mx + 12},${my} ${mx + 12},${my - 12} ${mx},${my - 12}`}
                  fill="none"
                  stroke={DS.purple}
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <text
                  x={mx + 22}
                  y={my - 15}
                  fill={DS.purple}
                  fontSize={11}
                  fontWeight={700}
                  fontFamily={DS.font}
                >
                  90°
                </text>
              </g>
            )}

            {/* XO / OY */}
            {p > 0.7 && (
              <g style={{ animation: "labelSlideIn 0.5s ease-out both" }}>
                <rect
                  x={(xL + mx) / 2 - 13}
                  y={my - 18}
                  width={26}
                  height={14}
                  rx={7}
                  fill={DS.lightPurple}
                />
                <text
                  x={(xL + mx) / 2}
                  y={my - 8}
                  textAnchor="middle"
                  fill={DS.purple}
                  fontSize={9}
                  fontWeight={700}
                  fontFamily={DS.font}
                >
                  XO
                </text>
                <rect
                  x={(xR + mx) / 2 - 13}
                  y={my - 18}
                  width={26}
                  height={14}
                  rx={7}
                  fill={DS.lightPurple}
                />
                <text
                  x={(xR + mx) / 2}
                  y={my - 8}
                  textAnchor="middle"
                  fill={DS.purple}
                  fontSize={9}
                  fontWeight={700}
                  fontFamily={DS.font}
                >
                  OY
                </text>
              </g>
            )}

            {/* Final badge */}
            {p > 0.85 && (
              <g style={{ animation: "labelSlideIn 0.6s ease-out both" }}>
                <rect
                  x={mx - 96}
                  y={pB.y + 32}
                  width={192}
                  height={24}
                  rx={12}
                  fill={DS.lightPurple}
                  stroke={`${DS.purple}30`}
                  strokeWidth={1}
                />
                <text
                  x={mx}
                  y={pB.y + 48}
                  textAnchor="middle"
                  fill={DS.purple}
                  fontSize={10}
                  fontWeight={700}
                  fontFamily={DS.font}
                >
                  XO = OY &nbsp; ∠AOX = 90° ✓
                </text>
              </g>
            )}
          </g>
        )}
      </svg>
    );
  };

  // ═══════════════════════════════════════════════════════
  // PRACTICE
  // ═══════════════════════════════════════════════════════

  const renderPractice = () => {
    const q = curQ;
    const tLabel =
      q.type === "mcq"
        ? "Multiple Choice"
        : q.type === "true_false"
          ? "True or False"
          : "Fill in the Blank";
    const tBg =
      q.type === "mcq"
        ? DS.lightPurple
        : q.type === "true_false"
          ? DS.lightOrange
          : "#E8F5E9";
    const tColor =
      q.type === "mcq"
        ? DS.purple
        : q.type === "true_false"
          ? DS.gradOrange
          : DS.success;

    return (
      <div
        style={{
          padding: `20px ${DS.pad}px`,
          animation: "fadeInUp 0.4s ease-out",
        }}
      >
        {/* Score */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
            padding: "10px 16px",
            background: DS.offWhite,
            borderRadius: DS.radiusLg,
            border: `1px solid ${DS.lightGray}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Award size={17} color={DS.orange} />
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: DS.dark,
                fontFamily: DS.font,
              }}
            >
              Score: {score}/{attempts}
            </span>
          </div>
          <span
            style={{
              fontSize: 12,
              color: DS.dark,
              fontFamily: DS.font,
              opacity: 0.6,
            }}
          >
            Q{qIdx + 1}/{questions.length || PRACTICE_QUESTIONS.length}
          </span>
        </div>

        {/* Type badge */}
        <span
          style={{
            display: "inline-block",
            padding: "4px 14px",
            borderRadius: 20,
            background: tBg,
            fontSize: 11,
            fontWeight: 600,
            color: tColor,
            fontFamily: DS.font,
            marginBottom: 14,
          }}
        >
          {tLabel}
        </span>

        {/* Question */}
        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: DS.dark,
            lineHeight: 1.65,
            marginBottom: 20,
            fontFamily: DS.font,
          }}
        >
          {q.question}
        </div>

        {/* MCQ */}
        {q.type === "mcq" && q.options && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {q.options.map((opt, i) => {
              const isSel = selAnswer === opt;
              const isRight = opt === q.correctAnswer;
              let bg = DS.white,
                bdr = DS.lightGray,
                col = DS.dark;
              if (answered) {
                if (isRight) {
                  bg = "#ECFDF5";
                  bdr = DS.success;
                  col = "#166534";
                } else if (isSel) {
                  bg = "#FEF2F2";
                  bdr = DS.error;
                  col = "#991B1B";
                }
              } else if (isSel) {
                bg = DS.lightPurple;
                bdr = DS.purple;
                col = DS.purple;
              }
              return (
                <button
                  key={i}
                  onClick={() => {
                    setSelAnswer(opt);
                    if (!answered) checkAns(opt);
                  }}
                  disabled={answered}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "11px 16px",
                    borderRadius: DS.radius,
                    border: `2px solid ${bdr}`,
                    background: bg,
                    cursor: answered ? "default" : "pointer",
                    fontSize: 13,
                    fontWeight: 500,
                    color: col,
                    fontFamily: DS.font,
                    transition: "all 0.22s ease",
                    textAlign: "left" as const,
                    animation:
                      answered && isSel
                        ? isRight
                          ? "correctGlow 0.5s"
                          : "wrongShake 0.35s"
                        : `fadeInUp 0.25s ease-out ${i * 0.06}s both`,
                  }}
                >
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 700,
                      background:
                        answered && isRight
                          ? "#DCFCE7"
                          : isSel
                            ? DS.lightPurple
                            : DS.offWhite,
                      color:
                        answered && isRight
                          ? "#166534"
                          : isSel
                            ? DS.purple
                            : DS.dark,
                    }}
                  >
                    {answered && isRight
                      ? "✓"
                      : answered && isSel
                        ? "✗"
                        : String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {/* T/F */}
        {q.type === "true_false" && (
          <div style={{ display: "flex", gap: 12 }}>
            {["True", "False"].map((opt) => {
              const isSel = selAnswer === opt;
              const isRight = opt === q.correctAnswer;
              let bg = DS.white,
                bdr = DS.lightGray;
              if (answered) {
                if (isRight) {
                  bg = "#ECFDF5";
                  bdr = DS.success;
                } else if (isSel) {
                  bg = "#FEF2F2";
                  bdr = DS.error;
                }
              } else if (isSel) {
                bg = DS.lightPurple;
                bdr = DS.purple;
              }
              return (
                <button
                  key={opt}
                  onClick={() => {
                    setSelAnswer(opt);
                    if (!answered) checkAns(opt);
                  }}
                  disabled={answered}
                  style={{
                    flex: 1,
                    padding: "14px 20px",
                    borderRadius: DS.radius,
                    border: `2px solid ${bdr}`,
                    background: bg,
                    cursor: answered ? "default" : "pointer",
                    fontSize: 15,
                    fontWeight: 700,
                    fontFamily: DS.font,
                    color:
                      answered && isRight
                        ? "#166534"
                        : answered && isSel
                          ? "#991B1B"
                          : DS.dark,
                    transition: "all 0.22s ease",
                    animation:
                      answered && isSel
                        ? isRight
                          ? "correctGlow 0.5s"
                          : "wrongShake 0.35s"
                        : "none",
                  }}
                >
                  {opt === "True" ? "✅" : "❌"} {opt}
                </button>
              );
            })}
          </div>
        )}

        {/* Fill blank */}
        {q.type === "fill_blank" && (
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input
              type="text"
              value={fillAns}
              onChange={(e) => setFillAns(e.target.value)}
              disabled={answered}
              placeholder="Type answer..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && fillAns.trim() && !answered)
                  checkAns(fillAns);
              }}
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: DS.radius,
                border: `2px solid ${answered ? (correct ? DS.success : DS.error) : DS.lightGray}`,
                background: answered
                  ? correct
                    ? "#ECFDF5"
                    : "#FEF2F2"
                  : DS.white,
                fontSize: 15,
                fontWeight: 600,
                fontFamily: DS.font,
                color: DS.dark,
                outline: "none",
                transition: "all 0.3s ease",
                animation: answered && !correct ? "wrongShake 0.35s" : "none",
              }}
            />
            {!answered && (
              <button
                onClick={() => fillAns.trim() && checkAns(fillAns)}
                disabled={!fillAns.trim()}
                style={{
                  padding: "12px 22px",
                  borderRadius: DS.radius,
                  border: "none",
                  background: fillAns.trim()
                    ? `linear-gradient(135deg, ${DS.gradPurple}, ${DS.gradOrange})`
                    : DS.lightGray,
                  color: fillAns.trim() ? DS.white : DS.gray,
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: DS.font,
                  cursor: fillAns.trim() ? "pointer" : "not-allowed",
                  transition: "all 0.3s ease",
                }}
              >
                Check
              </button>
            )}
          </div>
        )}

        {/* Hint */}
        {q.hint && !answered && (
          <button
            onClick={() => setHint((h) => !h)}
            style={{
              marginTop: 12,
              padding: "5px 14px",
              borderRadius: 20,
              border: `1px solid ${DS.lightGray}`,
              background: DS.lightOrange,
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 600,
              color: DS.gradOrange,
              fontFamily: DS.font,
            }}
          >
            💡 {hint ? "Hide Hint" : "Show Hint"}
          </button>
        )}
        {hint && q.hint && !answered && (
          <div
            style={{
              marginTop: 8,
              padding: "10px 14px",
              borderRadius: DS.radius,
              background: DS.lightOrange,
              border: `1px solid #FDE68A`,
              fontSize: 12,
              color: "#92400E",
              lineHeight: 1.6,
              fontFamily: DS.font,
              animation: "fadeInUp 0.25s ease-out",
            }}
          >
            {q.hint}
          </div>
        )}

        {/* Explanation */}
        {answered && (
          <div
            style={{
              marginTop: 16,
              padding: "14px 18px",
              borderRadius: DS.radiusLg,
              background: correct ? "#ECFDF5" : "#FEF2F2",
              border: `1px solid ${correct ? "#BBF7D0" : "#FECACA"}`,
              animation: "fadeInUp 0.35s ease-out",
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                marginBottom: 4,
                fontFamily: DS.font,
                color: correct ? "#166534" : "#991B1B",
              }}
            >
              {correct ? "🎉 Correct!" : `❌ Answer: ${q.correctAnswer}`}
            </div>
            <div
              style={{
                fontSize: 12,
                color: correct ? "#15803D" : "#B91C1C",
                lineHeight: 1.6,
                fontFamily: DS.font,
              }}
            >
              {q.explanation}
            </div>
          </div>
        )}

        {/* Next */}
        {answered && (
          <button
            onClick={nextQ}
            style={{
              marginTop: 14,
              padding: "11px 28px",
              borderRadius: DS.radius,
              border: "none",
              background: `linear-gradient(135deg, ${DS.gradPurple}, ${DS.gradOrange})`,
              color: DS.white,
              fontSize: 13,
              fontWeight: 700,
              fontFamily: DS.font,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "all 0.3s ease",
              animation: "fadeInUp 0.25s ease-out",
            }}
          >
            Next Question <ChevronRight size={15} />
          </button>
        )}
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════
  // MAIN RENDER
  // ═══════════════════════════════════════════════════════

  return (
    <div
      style={{
        width: config.width,
        maxWidth: "100%",
        fontFamily: DS.font,
        background: DS.white,
        borderRadius: DS.radiusXl,
        overflow: "hidden",
        boxShadow:
          "0 8px 40px rgba(83,48,134,0.10), 0 1.5px 4px rgba(83,48,134,0.06)",
        border: `1px solid ${DS.lightGray}`,
      }}
    >
      {/* ── HEADER ── */}
      <div
        style={{
          background: `linear-gradient(135deg, ${DS.gradPurple} 0%, ${DS.purple} 40%, ${DS.gradOrange} 100%)`,
          padding: "18px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative" as const,
          overflow: "hidden",
        }}
      >
        {/* Decorative shapes */}
        <div
          style={{
            position: "absolute" as const,
            top: -18,
            right: 60,
            width: 56,
            height: 56,
            borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.12)",
          }}
        />
        <div
          style={{
            position: "absolute" as const,
            bottom: -10,
            right: 130,
            width: 32,
            height: 32,
            border: "2px solid rgba(255,255,255,0.08)",
            transform: "rotate(45deg)",
          }}
        />
        <div>
          <div
            style={{
              color: DS.white,
              fontSize: 17,
              fontWeight: 700,
              letterSpacing: "-0.01em",
            }}
          >
            📐 Perpendicular Bisector Constructor
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: 11,
              marginTop: 3,
              fontWeight: 500,
            }}
          >
            Compass & Straightedge Construction
          </div>
        </div>
        {/* Reset button — Outlined style per design system */}
        <button
          onClick={reset}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1.5px solid rgba(255,255,255,0.3)",
            borderRadius: DS.radius,
            padding: "7px 14px",
            cursor: "pointer",
            color: DS.white,
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontSize: 12,
            fontWeight: 600,
            fontFamily: DS.font,
            transition: "all 0.25s ease",
          }}
        >
          <RotateCcw size={13} /> Reset
        </button>
      </div>

      {/* ── MODE TABS ── */}
      {config.showModeSelector && (
        <div
          style={{
            display: "flex",
            background: DS.offWhite,
            borderBottom: `1px solid ${DS.lightGray}`,
          }}
        >
          {config.enabledModes.map((m) => {
            const active = mode === m;
            return (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setLearnStep(0);
                }}
                style={{
                  flex: 1,
                  padding: "13px 16px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: DS.font,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 7,
                  background: active ? DS.white : "transparent",
                  color: active ? DS.purple : DS.dark,
                  borderBottom: active
                    ? `3px solid ${DS.purple}`
                    : "3px solid transparent",
                  transition: "all 0.3s ease",
                  opacity: active ? 1 : 0.65,
                }}
              >
                {m === "learn" ? <BookOpen size={15} /> : <Target size={15} />}
                {m === "learn" ? "Learn" : "Practice"}
              </button>
            );
          })}
        </div>
      )}

      {/* ── BODY ── */}
      {mode === "learn" ? (
        <>
          {/* Canvas area */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "20px 20px 14px",
              background: DS.offWhite,
              borderBottom: `1px solid ${DS.lightGray}`,
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: SVG_W + 28,
                background: DS.white,
                borderRadius: DS.radiusLg,
                border: `1px solid ${DS.lightGray}`,
                boxShadow: `0 2px 12px rgba(83,48,134,0.05)`,
                padding: 14,
                boxSizing: "border-box" as const,
              }}
            >
              {renderSVG()}
            </div>
          </div>

          {/* Step info */}
          <div style={{ padding: "16px 24px" }} key={`ls-${learnStep}`}>
            <div style={{ animation: "fadeInUp 0.4s ease-out" }}>
              {/* Step badge */}
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "4px 12px",
                  borderRadius: 20,
                  marginBottom: 10,
                  background: DS.lightPurple,
                  fontSize: 11,
                  fontWeight: 700,
                  color: DS.purple,
                  fontFamily: DS.font,
                  position: "relative" as const,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: DS.purple,
                  }}
                />
                Step {learnStep + 1} of {LEARN_STEPS.length}
              </span>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: DS.dark,
                  marginBottom: 6,
                }}
              >
                {curStep?.title}
              </div>
              <div
                style={{
                  fontSize: 13,
                  lineHeight: 1.75,
                  color: DS.dark,
                  opacity: 0.7,
                }}
              >
                {curStep?.description}
              </div>
            </div>
          </div>

          {/* Nav */}
          {config.showNavigation && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 24px",
                borderTop: `1px solid ${DS.lightGray}`,
                background: DS.offWhite,
              }}
            >
              {/* Previous — Outlined button */}
              <button
                onClick={goPrev}
                disabled={learnStep === 0}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "9px 18px",
                  borderRadius: DS.radius,
                  border: `1.5px solid ${learnStep === 0 ? DS.lightGray : DS.purple}`,
                  background: DS.white,
                  cursor: learnStep === 0 ? "not-allowed" : "pointer",
                  opacity: learnStep === 0 ? 0.4 : 1,
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: DS.font,
                  color: learnStep === 0 ? DS.gray : DS.purple,
                  transition: "all 0.25s ease",
                }}
              >
                <ChevronLeft size={15} /> Previous
              </button>

              {/* Dots */}
              {config.showStepIndicator && (
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {LEARN_STEPS.map((_, i) => (
                    <div key={i} style={{ position: "relative" as const }}>
                      {i === learnStep && (
                        <div
                          style={{
                            position: "absolute" as const,
                            top: "50%",
                            left: "50%",
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: DS.purple,
                            opacity: 0.3,
                            transform: "translate(-50%, -50%)",
                            animation:
                              "stepPing 1.5s cubic-bezier(0,0,0.2,1) infinite",
                          }}
                        />
                      )}
                      <div
                        style={{
                          width: i === learnStep ? 20 : 8,
                          height: 8,
                          borderRadius: i === learnStep ? 4 : "50%",
                          background:
                            i === learnStep
                              ? DS.purple
                              : i < learnStep
                                ? DS.lightPurple
                                : DS.lightGray,
                          transition: "all 0.35s ease",
                          position: "relative" as const,
                          zIndex: 1,
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Next — Contained button with gradient */}
              <button
                onClick={goNext}
                disabled={learnStep === LEARN_STEPS.length - 1}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "9px 18px",
                  borderRadius: DS.radius,
                  border: "none",
                  background:
                    learnStep < LEARN_STEPS.length - 1
                      ? `linear-gradient(135deg, ${DS.gradPurple}, ${DS.gradOrange})`
                      : DS.lightGray,
                  color:
                    learnStep < LEARN_STEPS.length - 1 ? DS.white : DS.gray,
                  cursor:
                    learnStep === LEARN_STEPS.length - 1
                      ? "not-allowed"
                      : "pointer",
                  opacity: learnStep === LEARN_STEPS.length - 1 ? 0.45 : 1,
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: DS.font,
                  transition: "all 0.25s ease",
                }}
              >
                Next <ChevronRight size={15} />
              </button>
            </div>
          )}
        </>
      ) : (
        renderPractice()
      )}
    </div>
  );
};

export default PerpendicularBisectorConstructor;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════
