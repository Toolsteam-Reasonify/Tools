// @ts-nocheck
import React, {
  useState,
  useEffect,
  useRef,
  type ReactElement,
  type CSSProperties,
} from "react";

// ───────────────────────── Types ─────────────────────────
interface Point {
  x: number;
  y: number;
}
interface AnimatedPathProps {
  d: string;
  color: string;
  strokeWidth?: number;
  duration?: number;
  delay?: number;
  dashArray?: string | null;
  fill?: string;
  opacity?: number;
}
interface AnimatedCircleProps {
  cx: number;
  cy: number;
  r: number;
  color: string;
  delay?: number;
  fill?: string | null;
  glow?: boolean;
}
interface LabelProps {
  x: number;
  y: number;
  text: string;
  color?: string;
  fontSize?: number;
  anchor?: "start" | "middle" | "end";
  delay?: number;
  fontWeight?: number;
}
interface EqualMarksProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  count?: number;
  color?: string;
  delay?: number;
}
interface DashedLineProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  delay?: number;
  duration?: number;
}
interface CompassIndicatorProps {
  cx: number;
  cy: number;
  color: string;
  delay?: number;
  label?: string;
}
interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
}
interface InstructionCardProps {
  step: number;
}
interface InstructionData {
  title: string;
  text: string;
  icon: string;
}
interface GeometryCanvasProps {
  step: number;
  practiceAngle: number | null;
}
interface SSSProofPanelProps {
  visible: boolean;
  angleDeg: number;
}
type Mode = "learn" | "practice";
interface MCQOption {
  id: string;
  text: string;
}
interface MCQQuestion {
  id: number;
  question: string;
  options: MCQOption[];
  correctId: string;
  explanation: string;
  relatedAngle: number;
  diagramStep: number;
  difficulty: "easy" | "medium" | "hard";
  category: "concept" | "calculation" | "proof" | "construction";
}
interface QuizState {
  currentQuestionIndex: number;
  selectedOptionId: string | null;
  isAnswered: boolean;
  score: number;
  totalAnswered: number;
  showExplanation: boolean;
  questionsOrder: number[];
}
interface MCQPracticeProps {
  quizState: QuizState;
  onSelectOption: (optionId: string) => void;
  onNext: () => void;
  onReset: () => void;
}

// ───────────────────── Singularity Design Tokens ─────────────────────
const DS = {
  primary: "#4A4DC9",
  orange: "#FF7212",
  gradStart: "#533086",
  gradEnd: "#FC9145",
  lightPurple: "#C1C1EA",
  lightPeach: "#FFF3E4",
  dark: "#4E4E4E",
  gray: "#CACACA",
  lightGray: "#EBEBEB",
  offWhite: "#F5F5F5",
  white: "#FFFFFF",
  solidPurple: "#533086",
  solidOrange: "#FC9145",
  correct: "#2E7D32",
  correctBg: "#E8F5E9",
  wrong: "#C62828",
  wrongBg: "#FFEBEE",
  font: "'Poppins', sans-serif",
  radius: 8,
  radiusLg: 16,
  radiusXl: 20,
} as const;

const CC = {
  bg: DS.offWhite,
  cardBg: DS.white,
  armOX: DS.dark,
  armOY: DS.dark,
  arcFromO: DS.orange,
  pointA: DS.solidOrange,
  pointB: DS.solidOrange,
  arcFromA: DS.primary,
  arcFromB: DS.solidPurple,
  pointC: DS.orange,
  bisector: DS.gradStart,
  triangleOAC: "rgba(74, 77, 201, 0.12)",
  triangleOBC: "rgba(83, 48, 134, 0.12)",
  triangleStrokeOAC: DS.primary,
  triangleStrokeOBC: DS.solidPurple,
  angleMarker: DS.solidOrange,
  halfAngle1: DS.primary,
  halfAngle2: DS.solidPurple,
  textPrimary: DS.dark,
  textSecondary: "#6E6E6E",
  border: DS.lightGray,
  glowC: DS.orange,
} as const;

// ───────────────────────── Constants ─────────────────────────
const VERTEX_O: Point = { x: 150, y: 320 };
const ARM_LENGTH = 230;
const ARC_RADIUS_FROM_O = 140;
const ARC_RADIUS_FROM_AB = 120;
const STEP_LABELS = [
  "Given Angle",
  "Mark A & B",
  "Arcs from A, B",
  "Bisector OC",
];
const TOTAL_STEPS = 4;

const INSTRUCTIONS: Record<number, InstructionData> = {
  1: {
    title: "Step 1: Observe the Given Angle",
    text: "Here is a 90° angle XOY. Our goal is to divide it into two equal 45° angles using only compass and straightedge.",
    icon: "📐",
  },
  2: {
    title: "Step 2: Mark Points A and B",
    text: "Place the compass on vertex O and draw an arc cutting both arms. Mark the intersection with arm OX as A and with arm OY as B. Since both lie on the same arc, OA = OB.",
    icon: "⭕",
  },
  3: {
    title: "Step 3: Draw Arcs from A and B",
    text: "Place compass on A and draw an arc inside the angle (blue). Then with the same radius from B draw another arc (purple). They cross at point C. Since both arcs have the same radius, AC = BC.",
    icon: "✨",
  },
  4: {
    title: "Step 4: Draw the Bisector",
    text: "Draw ray OC — it bisects the angle! Each half is 45°. By SSS: △OAC ≅ △OBC (OA=OB, AC=BC, OC=OC), so ∠AOC = ∠BOC.",
    icon: "🎯",
  },
};

const MCQ_QUESTIONS: MCQQuestion[] = [
  {
    id: 1,
    question: "If you bisect a 90° angle, what is the measure of each half?",
    options: [
      { id: "a", text: "30°" },
      { id: "b", text: "45°" },
      { id: "c", text: "60°" },
      { id: "d", text: "90°" },
    ],
    correctId: "b",
    explanation:
      "Bisecting means dividing into two equal parts. 90° ÷ 2 = 45° for each half.",
    relatedAngle: 90,
    diagramStep: 4,
    difficulty: "easy",
    category: "calculation",
  },
  {
    id: 2,
    question: "Why do we mark points A and B such that OA = OB?",
    options: [
      { id: "a", text: "To make the figure look neat" },
      { id: "b", text: "To ensure the two triangles are congruent by SSS" },
      { id: "c", text: "Because the textbook says so" },
      { id: "d", text: "To measure the angle" },
    ],
    correctId: "b",
    explanation:
      "Equal distances OA = OB give us one pair of equal sides needed for the SSS congruence proof.",
    relatedAngle: 90,
    diagramStep: 2,
    difficulty: "medium",
    category: "proof",
  },
  {
    id: 3,
    question: "What congruence condition proves ray OC bisects ∠XOY?",
    options: [
      { id: "a", text: "SAS" },
      { id: "b", text: "ASA" },
      { id: "c", text: "SSS" },
      { id: "d", text: "RHS" },
    ],
    correctId: "c",
    explanation:
      "△OAC ≅ △OBC by SSS: OA = OB, AC = BC, and OC = OC (common side).",
    relatedAngle: 90,
    diagramStep: 4,
    difficulty: "medium",
    category: "proof",
  },
  {
    id: 4,
    question: "If you bisect a 120° angle, what is each resulting angle?",
    options: [
      { id: "a", text: "45°" },
      { id: "b", text: "50°" },
      { id: "c", text: "60°" },
      { id: "d", text: "90°" },
    ],
    correctId: "c",
    explanation: "120° ÷ 2 = 60°. Each half measures 60°.",
    relatedAngle: 120,
    diagramStep: 4,
    difficulty: "easy",
    category: "calculation",
  },
  {
    id: 5,
    question: "Why must arcs from A and B have the same radius?",
    options: [
      { id: "a", text: "So AC = BC, making C equidistant from A and B" },
      { id: "b", text: "To save time" },
      { id: "c", text: "Different radii work too" },
      { id: "d", text: "Arcs always need equal radii" },
    ],
    correctId: "a",
    explanation:
      "Equal radii ensure AC = BC — the second pair of equal sides for SSS congruence.",
    relatedAngle: 90,
    diagramStep: 3,
    difficulty: "medium",
    category: "construction",
  },
  {
    id: 6,
    question: "How can you construct a 45° angle with ruler and compass?",
    options: [
      { id: "a", text: "Bisect a 60° angle" },
      { id: "b", text: "Construct 90° then bisect it" },
      { id: "c", text: "Draw any two lines" },
      { id: "d", text: "Use a protractor" },
    ],
    correctId: "b",
    explanation:
      "First construct 90° (via perpendicular bisector), then bisect to get 45°.",
    relatedAngle: 90,
    diagramStep: 4,
    difficulty: "easy",
    category: "construction",
  },
  {
    id: 7,
    question: "In △OAC and △OBC, which is the common side?",
    options: [
      { id: "a", text: "OA" },
      { id: "b", text: "AC" },
      { id: "c", text: "OC" },
      { id: "d", text: "BC" },
    ],
    correctId: "c",
    explanation:
      "OC belongs to both triangles — the third equal side in SSS: OC = OC.",
    relatedAngle: 90,
    diagramStep: 4,
    difficulty: "easy",
    category: "proof",
  },
  {
    id: 8,
    question: "Bisect 60° twice. What angle do you get?",
    options: [
      { id: "a", text: "15°" },
      { id: "b", text: "20°" },
      { id: "c", text: "30°" },
      { id: "d", text: "10°" },
    ],
    correctId: "a",
    explanation: "First: 60° ÷ 2 = 30°. Second: 30° ÷ 2 = 15°.",
    relatedAngle: 60,
    diagramStep: 4,
    difficulty: "hard",
    category: "calculation",
  },
  {
    id: 9,
    question: "What is the first step in bisecting ∠XOY?",
    options: [
      { id: "a", text: "Draw ray OC" },
      { id: "b", text: "Draw arcs from A and B" },
      { id: "c", text: "Place compass on O, draw arc cutting both arms" },
      { id: "d", text: "Measure with protractor" },
    ],
    correctId: "c",
    explanation:
      "First: compass at O, arc intersects both arms giving A and B with OA = OB.",
    relatedAngle: 90,
    diagramStep: 2,
    difficulty: "easy",
    category: "construction",
  },
  {
    id: 10,
    question: "For the 8-petalled design, adjacent lines are 45° apart. How?",
    options: [
      { id: "a", text: "360° ÷ 8 = 45°, by bisecting 90°" },
      { id: "b", text: "Random lines" },
      { id: "c", text: "180° ÷ 4 = 45°" },
      { id: "d", text: "Protractor only" },
    ],
    correctId: "a",
    explanation: "360° ÷ 8 = 45°. Construct 90° angles and bisect them.",
    relatedAngle: 90,
    diagramStep: 4,
    difficulty: "medium",
    category: "concept",
  },
  {
    id: 11,
    question: "Can you bisect an angle without knowing its measure?",
    options: [
      { id: "a", text: "No, must measure first" },
      { id: "b", text: "Yes, compass method works for any angle" },
      { id: "c", text: "Only right angles" },
      { id: "d", text: "Only angles < 90°" },
    ],
    correctId: "b",
    explanation:
      "The construction works for any angle — SSS congruence guarantees exact bisection without measurement.",
    relatedAngle: 120,
    diagramStep: 4,
    difficulty: "medium",
    category: "concept",
  },
  {
    id: 12,
    question: "If ∠XOY = 150°, what is ∠XOC after bisection?",
    options: [
      { id: "a", text: "60°" },
      { id: "b", text: "75°" },
      { id: "c", text: "80°" },
      { id: "d", text: "100°" },
    ],
    correctId: "b",
    explanation: "150° ÷ 2 = 75°.",
    relatedAngle: 150,
    diagramStep: 4,
    difficulty: "easy",
    category: "calculation",
  },
];

const shuffleArray = (arr: number[]): number[] => {
  const s = [...arr];
  for (let i = s.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [s[i], s[j]] = [s[j], s[i]];
  }
  return s;
};

// ───────────────────────── Geometry ─────────────────────────
const toRad = (d: number): number => (d * Math.PI) / 180;
const toDeg = (r: number): number => (r * 180) / Math.PI;
const getArmEnd = (o: Point, a: number, l: number): Point => ({
  x: o.x + l * Math.cos(toRad(-a)),
  y: o.y + l * Math.sin(toRad(-a)),
});
const angleTo = (c: Point, p: Point): number =>
  toDeg(Math.atan2(c.y - p.y, p.x - c.x));
const circleIntersection = (
  p1: Point,
  p2: Point,
  r: number,
  vO: Point,
  bA: number,
): Point | null => {
  const dx = p2.x - p1.x,
    dy = p2.y - p1.y,
    d = Math.sqrt(dx * dx + dy * dy);
  if (d > 2 * r || d < 0.001) return null;
  const a = d / 2,
    h = Math.sqrt(r * r - a * a),
    mx = (p1.x + p2.x) / 2,
    my = (p1.y + p2.y) / 2;
  const px = -dy / d,
    py = dx / d;
  const c1: Point = { x: mx + h * px, y: my + h * py };
  const c2: Point = { x: mx - h * px, y: my - h * py };
  const bt = getArmEnd(vO, bA, 300);
  return Math.hypot(c1.x - bt.x, c1.y - bt.y) <
    Math.hypot(c2.x - bt.x, c2.y - bt.y)
    ? c1
    : c2;
};
const describeArc = (
  cx: number,
  cy: number,
  r: number,
  sa: number,
  ea: number,
): string => {
  const s = toRad(-sa),
    e = toRad(-ea);
  return `M ${cx + r * Math.cos(s)} ${cy + r * Math.sin(s)} A ${r} ${r} 0 ${Math.abs(ea - sa) > 180 ? 1 : 0} 0 ${cx + r * Math.cos(e)} ${cy + r * Math.sin(e)}`;
};

// ───────────────────────── Dot Grid Component ─────────────────────────
function DotGrid(): ReactElement {
  const dots: ReactElement[] = [];
  for (let i = 0; i < 27; i++) {
    for (let j = 0; j < 21; j++) {
      dots.push(
        <circle
          key={`d${i}-${j}`}
          cx={i * 20 + 5}
          cy={j * 20 + 5}
          r={0.4}
          fill={DS.gray}
          opacity={0.3}
        />,
      );
    }
  }
  return <>{dots}</>;
}

// ───────────────────────── SVG Primitives ─────────────────────────
function AnimatedPath({
  d,
  color,
  strokeWidth = 2.5,
  duration = 800,
  delay = 0,
  dashArray = null,
  fill = "none",
  opacity = 1,
}: AnimatedPathProps): ReactElement {
  const ref = useRef<SVGPathElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const len = el.getTotalLength();
    if (dashArray) {
      el.style.strokeDasharray = dashArray;
      el.style.strokeDashoffset = "0";
      el.style.opacity = "0";
      const t = setTimeout(() => {
        el.style.opacity = String(opacity);
        el.style.transition = `opacity ${duration}ms ease-out`;
      }, delay);
      return () => clearTimeout(t);
    }
    el.style.strokeDasharray = String(len);
    el.style.strokeDashoffset = String(len);
    el.style.opacity = "0";
    const t = setTimeout(() => {
      el.style.opacity = String(opacity);
      el.style.transition = `stroke-dashoffset ${duration}ms ease-out`;
      el.style.strokeDashoffset = "0";
    }, delay);
    return () => clearTimeout(t);
  }, [d, duration, delay, dashArray, opacity]);
  return (
    <path
      ref={ref}
      d={d}
      stroke={color}
      strokeWidth={strokeWidth}
      fill={fill}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function AnimatedCircle({
  cx,
  cy,
  r,
  color,
  delay = 0,
  fill = null,
  glow = false,
}: AnimatedCircleProps): ReactElement {
  const [v, setV] = useState<boolean>(false);
  useEffect(() => {
    const t = setTimeout(() => setV(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  const circleStyle: CSSProperties = {
    transform: v ? "scale(1)" : "scale(0)",
    transformOrigin: `${cx}px ${cy}px`,
    transition: "transform 400ms cubic-bezier(0.34,1.56,0.64,1)",
  };
  return (
    <g>
      {glow === true && v && (
        <circle
          cx={cx}
          cy={cy}
          r={r + 6}
          fill="none"
          stroke={color}
          strokeWidth={2}
          opacity={0.3}
        />
      )}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={fill || color}
        stroke={color}
        strokeWidth={1.5}
        style={circleStyle}
      />
    </g>
  );
}

function SvgLabel({
  x,
  y,
  text,
  color = CC.textPrimary,
  fontSize = 14,
  anchor = "middle",
  delay = 0,
  fontWeight = 600,
}: LabelProps): ReactElement {
  const [v, setV] = useState<boolean>(false);
  useEffect(() => {
    const t = setTimeout(() => setV(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <text
      x={x}
      y={y}
      fill={color}
      fontSize={fontSize}
      fontFamily={DS.font}
      fontWeight={fontWeight}
      textAnchor={anchor}
      style={{ opacity: v ? 1 : 0, transition: "opacity 400ms ease" }}
    >
      {text}
    </text>
  );
}

function EqualMarks({
  x1,
  y1,
  x2,
  y2,
  count = 1,
  color = DS.orange,
  delay = 0,
}: EqualMarksProps): ReactElement {
  const [v, setV] = useState<boolean>(false);
  useEffect(() => {
    const t = setTimeout(() => setV(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  const dx = x2 - x1,
    dy = y2 - y1,
    len = Math.sqrt(dx * dx + dy * dy);
  if (len < 1) return <g />;
  const mx = (x1 + x2) / 2,
    my = (y1 + y2) / 2,
    nx = -dy / len,
    ny = dx / len;
  const marks: ReactElement[] = [];
  for (let i = 0; i < count; i++) {
    const off = (i - (count - 1) / 2) * 5;
    const px = mx + (dx / len) * off,
      py = my + (dy / len) * off;
    marks.push(
      <line
        key={i}
        x1={px - nx * 6}
        y1={py - ny * 6}
        x2={px + nx * 6}
        y2={py + ny * 6}
        stroke={color}
        strokeWidth={2}
        style={{
          opacity: v ? 1 : 0,
          transition: `opacity 300ms ease ${i * 100}ms`,
        }}
      />,
    );
  }
  return <g>{marks}</g>;
}

function DashedLine({
  x1,
  y1,
  x2,
  y2,
  color,
  delay = 0,
  duration = 600,
}: DashedLineProps): ReactElement {
  const [v, setV] = useState<boolean>(false);
  useEffect(() => {
    const t = setTimeout(() => setV(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={color}
      strokeWidth={1.3}
      strokeDasharray="6 4"
      opacity={v ? 0.55 : 0}
      style={{ transition: `opacity ${duration}ms ease` }}
    />
  );
}

function CompassIndicator({
  cx,
  cy,
  color,
  delay = 0,
  label = "",
}: CompassIndicatorProps): ReactElement {
  const [v, setV] = useState<boolean>(false);
  useEffect(() => {
    const t = setTimeout(() => setV(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <g style={{ opacity: v ? 1 : 0, transition: "opacity 400ms ease" }}>
      <line
        x1={cx - 7}
        y1={cy}
        x2={cx + 7}
        y2={cy}
        stroke={color}
        strokeWidth={1}
        opacity={0.45}
      />
      <line
        x1={cx}
        y1={cy - 7}
        x2={cx}
        y2={cy + 7}
        stroke={color}
        strokeWidth={1}
        opacity={0.45}
      />
      {label !== "" && (
        <text
          x={cx}
          y={cy + 19}
          fill={color}
          fontSize={9}
          fontFamily={DS.font}
          fontWeight={500}
          textAnchor="middle"
          opacity={0.6}
        >
          {label}
        </text>
      )}
    </g>
  );
}

// ───────────────────────── UI Components ─────────────────────────
function StepIndicator({
  currentStep,
  totalSteps,
  onStepClick,
}: StepIndicatorProps): ReactElement {
  const items: ReactElement[] = [];
  for (let i = 0; i < totalSteps; i++) {
    const s = i + 1;
    const active = s === currentStep;
    const done = s < currentStep;
    items.push(
      <React.Fragment key={i}>
        <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
          <button
            onClick={() => onStepClick(s)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 2,
              flex: 1,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                fontWeight: 600,
                fontFamily: DS.font,
                color: active || done ? "#fff" : DS.gray,
                background: active
                  ? DS.primary
                  : done
                    ? DS.solidPurple
                    : DS.lightGray,
                transition: "all 300ms ease",
                boxShadow: active ? `0 3px 14px ${DS.primary}44` : "none",
              }}
            >
              {done ? "✓" : String(s)}
            </div>
            <span
              style={{
                fontSize: 10,
                fontWeight: active ? 600 : 400,
                color: active ? DS.primary : "#888",
                fontFamily: DS.font,
                textAlign: "center",
                lineHeight: "1.2",
              }}
            >
              {STEP_LABELS[i]}
            </span>
          </button>
          {i < totalSteps - 1 && (
            <div
              style={{
                height: 2,
                flex: "0 0 16px",
                background: done ? DS.solidPurple : DS.lightGray,
                transition: "background 300ms ease",
                marginBottom: 16,
              }}
            />
          )}
        </div>
      </React.Fragment>,
    );
  }
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 0,
        width: "100%",
        padding: "0 4px",
      }}
    >
      {items}
    </div>
  );
}

function InstructionCard({ step }: InstructionCardProps): ReactElement {
  const d = INSTRUCTIONS[step];
  return (
    <div
      style={{
        background: DS.white,
        border: `1px solid ${DS.lightGray}`,
        borderLeft: `4px solid ${DS.primary}`,
        borderRadius: DS.radius,
        padding: "12px 16px",
        marginBottom: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 4,
        }}
      >
        <span style={{ fontSize: 20 }}>{d.icon}</span>
        <span
          style={{
            fontFamily: DS.font,
            fontSize: 14,
            fontWeight: 600,
            color: DS.dark,
          }}
        >
          {d.title}
        </span>
      </div>
      <p
        style={{
          fontFamily: DS.font,
          fontSize: 12.5,
          color: "#6E6E6E",
          margin: 0,
          lineHeight: 1.6,
        }}
      >
        {d.text}
      </p>
    </div>
  );
}

// ───────────────────────── Geometry Canvas ─────────────────────────
function GeometryCanvas({
  step,
  practiceAngle,
}: GeometryCanvasProps): ReactElement {
  const W = 530,
    H = 410,
    ang = practiceAngle || 90,
    vO = VERTEX_O,
    half = ang / 2;
  const xE = getArmEnd(vO, 0, ARM_LENGTH),
    yE = getArmEnd(vO, ang, ARM_LENGTH);
  const pA = getArmEnd(vO, 0, ARC_RADIUS_FROM_O),
    pB = getArmEnd(vO, ang, ARC_RADIUS_FROM_O);
  const pC = circleIntersection(pA, pB, ARC_RADIUS_FROM_AB, vO, half);
  const bE = getArmEnd(vO, half, ARM_LENGTH);

  let aAS = 0,
    aAE = 0,
    aBS = 0,
    aBE = 0;
  let aAL: Point = { x: 0, y: 0 },
    aBL: Point = { x: 0, y: 0 };
  if (pC) {
    const ac = angleTo(pA, pC);
    aAS = ac - 32;
    aAE = ac + 32;
    const bc = angleTo(pB, pC);
    aBS = bc - 32;
    aBE = bc + 32;
    const la = toRad(-(aAE - 5));
    aAL = {
      x: pA.x + (ARC_RADIUS_FROM_AB + 10) * Math.cos(la),
      y: pA.y + (ARC_RADIUS_FROM_AB + 10) * Math.sin(la),
    };
    const lb = toRad(-(aBS + 5));
    aBL = {
      x: pB.x + (ARC_RADIUS_FROM_AB + 10) * Math.cos(lb),
      y: pB.y + (ARC_RADIUS_FROM_AB + 10) * Math.sin(lb),
    };
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{
        width: "100%",
        maxWidth: W,
        height: "auto",
        display: "block",
        margin: "0 auto",
      }}
    >
      <defs>
        <radialGradient id="gG" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={CC.glowC} stopOpacity={0.4} />
          <stop offset="100%" stopColor={CC.glowC} stopOpacity={0} />
        </radialGradient>
        <linearGradient id="bisGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={DS.gradStart} />
          <stop offset="100%" stopColor={DS.gradEnd} />
        </linearGradient>
      </defs>

      <DotGrid />

      <path
        d={describeArc(vO.x, vO.y, 35, 0, ang)}
        stroke={CC.angleMarker}
        strokeWidth={1.5}
        fill="none"
        opacity={0.5}
      />
      <SvgLabel
        x={vO.x + 50 * Math.cos(toRad(-half))}
        y={vO.y + 50 * Math.sin(toRad(-half)) + 2}
        text={`${ang}°`}
        color={CC.angleMarker}
        fontSize={12}
        fontWeight={600}
        delay={200}
      />
      <AnimatedPath
        d={`M ${vO.x} ${vO.y} L ${xE.x} ${xE.y}`}
        color={CC.armOX}
        strokeWidth={2.5}
        duration={600}
      />
      <AnimatedPath
        d={`M ${vO.x} ${vO.y} L ${yE.x} ${yE.y}`}
        color={CC.armOY}
        strokeWidth={2.5}
        duration={600}
        delay={200}
      />
      <SvgLabel
        x={vO.x - 18}
        y={vO.y + 22}
        text="O"
        fontSize={16}
        delay={400}
      />
      <SvgLabel
        x={xE.x + 14}
        y={xE.y + 5}
        text="X"
        fontSize={16}
        anchor="start"
        delay={500}
      />
      <SvgLabel x={yE.x - 8} y={yE.y - 12} text="Y" fontSize={16} delay={600} />
      <AnimatedCircle cx={vO.x} cy={vO.y} r={4} color={CC.armOX} delay={100} />

      {step >= 2 && (
        <g>
          <AnimatedPath
            d={describeArc(vO.x, vO.y, ARC_RADIUS_FROM_O, -10, ang + 10)}
            color={CC.arcFromO}
            strokeWidth={2}
            duration={1000}
            delay={100}
          />
          <AnimatedCircle
            cx={pA.x}
            cy={pA.y}
            r={5}
            color={CC.pointA}
            delay={600}
          />
          <SvgLabel
            x={pA.x + 4}
            y={pA.y + 22}
            text="A"
            color={CC.pointA}
            fontSize={15}
            delay={700}
            fontWeight={700}
          />
          <AnimatedCircle
            cx={pB.x}
            cy={pB.y}
            r={5}
            color={CC.pointB}
            delay={800}
          />
          <SvgLabel
            x={pB.x - 18}
            y={pB.y + 2}
            text="B"
            color={CC.pointB}
            fontSize={15}
            delay={900}
            fontWeight={700}
          />
          <EqualMarks
            x1={vO.x}
            y1={vO.y}
            x2={pA.x}
            y2={pA.y}
            count={1}
            color={CC.arcFromO}
            delay={1000}
          />
          <EqualMarks
            x1={vO.x}
            y1={vO.y}
            x2={pB.x}
            y2={pB.y}
            count={1}
            color={CC.arcFromO}
            delay={1100}
          />
          <SvgLabel
            x={vO.x + 80}
            y={vO.y + 40}
            text="OA = OB"
            color={CC.arcFromO}
            fontSize={11}
            fontWeight={700}
            delay={1200}
          />
        </g>
      )}

      {step >= 3 && pC !== null && (
        <g>
          <CompassIndicator
            cx={pA.x}
            cy={pA.y}
            color={CC.arcFromA}
            delay={50}
            label="compass at A"
          />
          <AnimatedPath
            d={describeArc(pA.x, pA.y, ARC_RADIUS_FROM_AB, aAS, aAE)}
            color={CC.arcFromA}
            strokeWidth={2.8}
            duration={1100}
            delay={250}
          />
          <SvgLabel
            x={aAL.x}
            y={aAL.y}
            text="arc from A"
            color={CC.arcFromA}
            fontSize={9}
            fontWeight={600}
            delay={700}
            anchor="start"
          />
          <CompassIndicator
            cx={pB.x}
            cy={pB.y}
            color={CC.arcFromB}
            delay={900}
            label="compass at B"
          />
          <AnimatedPath
            d={describeArc(pB.x, pB.y, ARC_RADIUS_FROM_AB, aBS, aBE)}
            color={CC.arcFromB}
            strokeWidth={2.8}
            duration={1100}
            delay={1000}
          />
          <SvgLabel
            x={aBL.x}
            y={aBL.y}
            text="arc from B"
            color={CC.arcFromB}
            fontSize={9}
            fontWeight={600}
            delay={1500}
            anchor="end"
          />
          <DashedLine
            x1={pA.x}
            y1={pA.y}
            x2={pC.x}
            y2={pC.y}
            color={CC.arcFromA}
            delay={1700}
          />
          <DashedLine
            x1={pB.x}
            y1={pB.y}
            x2={pC.x}
            y2={pC.y}
            color={CC.arcFromB}
            delay={1800}
          />
          <circle cx={pC.x} cy={pC.y} r={22} fill="url(#gG)" />
          <AnimatedCircle
            cx={pC.x}
            cy={pC.y}
            r={6}
            color={CC.pointC}
            delay={1900}
            fill={CC.pointC}
            glow={true}
          />
          <SvgLabel
            x={pC.x + 16}
            y={pC.y - 10}
            text="C"
            color={CC.pointC}
            fontSize={16}
            anchor="start"
            delay={2000}
            fontWeight={700}
          />
          <EqualMarks
            x1={pA.x}
            y1={pA.y}
            x2={pC.x}
            y2={pC.y}
            count={2}
            color={CC.arcFromA}
            delay={2100}
          />
          <EqualMarks
            x1={pB.x}
            y1={pB.y}
            x2={pC.x}
            y2={pC.y}
            count={2}
            color={CC.arcFromB}
            delay={2200}
          />
          <SvgLabel
            x={pC.x + 16}
            y={pC.y + 16}
            text="AC = BC"
            color={DS.dark}
            fontSize={10}
            fontWeight={700}
            delay={2300}
            anchor="start"
          />
        </g>
      )}

      {step >= 4 && pC !== null && (
        <g>
          <AnimatedPath
            d={`M ${vO.x} ${vO.y} L ${pA.x} ${pA.y} L ${pC.x} ${pC.y} Z`}
            color={CC.triangleStrokeOAC}
            strokeWidth={1.5}
            fill={CC.triangleOAC}
            duration={600}
            delay={200}
          />
          <AnimatedPath
            d={`M ${vO.x} ${vO.y} L ${pB.x} ${pB.y} L ${pC.x} ${pC.y} Z`}
            color={CC.triangleStrokeOBC}
            strokeWidth={1.5}
            fill={CC.triangleOBC}
            duration={600}
            delay={400}
          />
          <AnimatedPath
            d={`M ${vO.x} ${vO.y} L ${bE.x} ${bE.y}`}
            color={DS.gradStart}
            strokeWidth={3}
            duration={700}
            delay={700}
          />
          <AnimatedPath
            d={describeArc(vO.x, vO.y, 52, 0, half)}
            color={CC.halfAngle1}
            strokeWidth={2.5}
            duration={500}
            delay={1000}
          />
          <SvgLabel
            x={vO.x + 68 * Math.cos(toRad(-half / 2))}
            y={vO.y + 68 * Math.sin(toRad(-half / 2))}
            text={`${half}°`}
            color={CC.halfAngle1}
            fontSize={13}
            fontWeight={700}
            delay={1100}
          />
          <AnimatedPath
            d={describeArc(vO.x, vO.y, 58, half, ang)}
            color={CC.halfAngle2}
            strokeWidth={2.5}
            duration={500}
            delay={1200}
          />
          <SvgLabel
            x={vO.x + 75 * Math.cos(toRad(-(half + ang) / 2))}
            y={vO.y + 75 * Math.sin(toRad(-(half + ang) / 2))}
            text={`${half}°`}
            color={CC.halfAngle2}
            fontSize={13}
            fontWeight={700}
            delay={1300}
          />
          <SvgLabel
            x={vO.x + 85}
            y={vO.y - 80}
            text="△OAC"
            color={CC.triangleStrokeOAC}
            fontSize={11}
            fontWeight={700}
            delay={1500}
            anchor="start"
          />
          <SvgLabel
            x={vO.x - 10}
            y={vO.y - 130}
            text="△OBC"
            color={CC.triangleStrokeOBC}
            fontSize={11}
            fontWeight={700}
            delay={1600}
            anchor="end"
          />
          <EqualMarks
            x1={vO.x}
            y1={vO.y}
            x2={pC.x}
            y2={pC.y}
            count={3}
            color={DS.gradStart}
            delay={1400}
          />
        </g>
      )}
    </svg>
  );
}

// ───────────────────────── SSS Proof ─────────────────────────
function SSSProofPanel({
  visible,
  angleDeg,
}: SSSProofPanelProps): ReactElement | null {
  if (!visible) return null;
  const h = angleDeg / 2;
  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${DS.lightPeach}, #FFF8F0)`,
        border: `2px solid ${DS.solidOrange}`,
        borderRadius: DS.radiusLg,
        padding: "16px 18px",
        marginTop: 10,
      }}
    >
      <div
        style={{
          fontFamily: DS.font,
          fontSize: 14,
          fontWeight: 700,
          color: DS.dark,
          marginBottom: 10,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ fontSize: 18 }}>{"🔍"}</span>
        <span>SSS Congruence Proof</span>
      </div>
      <div
        style={{
          fontFamily: DS.font,
          fontSize: 12.5,
          color: "#6E6E6E",
          lineHeight: 1.7,
        }}
      >
        <div style={{ display: "flex", gap: 8, marginBottom: 5 }}>
          <span style={{ color: DS.orange, fontWeight: 700, minWidth: 66 }}>
            OA = OB
          </span>
          <span>same arc from O</span>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 5 }}>
          <span
            style={{ color: DS.solidPurple, fontWeight: 700, minWidth: 66 }}
          >
            AC = BC
          </span>
          <span>same radius arcs</span>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <span style={{ color: DS.gradStart, fontWeight: 700, minWidth: 66 }}>
            OC = OC
          </span>
          <span>common side</span>
        </div>
        <div
          style={{
            background: DS.white,
            borderRadius: DS.radius,
            padding: "10px 14px",
            border: `1px solid ${DS.lightGray}`,
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: DS.font,
              fontWeight: 700,
              fontSize: 14,
              color: DS.dark,
            }}
          >
            {"By SSS: "}
            <span style={{ color: DS.primary }}>{"△OAC"}</span>
            {" ≅ "}
            <span style={{ color: DS.solidPurple }}>{"△OBC"}</span>
          </span>
          <br />
          <span
            style={{
              fontFamily: DS.font,
              fontWeight: 500,
              fontSize: 12,
              color: "#888",
            }}
          >
            {"∴ ∠AOC = ∠BOC = " + h + "° each"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────── MCQ Practice ─────────────────────────
const DIFF_CLR: Record<string, string> = {
  easy: "#81B29A",
  medium: DS.solidOrange,
  hard: DS.orange,
};
const CAT_ICO: Record<string, string> = {
  concept: "💡",
  calculation: "🔢",
  proof: "📐",
  construction: "🧭",
};

function MCQPractice({
  quizState,
  onSelectOption,
  onNext,
  onReset,
}: MCQPracticeProps): ReactElement {
  const {
    currentQuestionIndex: ci,
    selectedOptionId: sel,
    isAnswered: ans,
    score,
    totalAnswered: tot,
    showExplanation,
    questionsOrder: qo,
  } = quizState;

  if (ci >= qo.length) {
    const pct = tot > 0 ? Math.round((score / tot) * 100) : 0;
    const em = pct >= 80 ? "🌟" : pct >= 50 ? "👍" : "📚";
    return (
      <div
        style={{
          background: DS.white,
          border: `1px solid ${DS.lightGray}`,
          borderRadius: DS.radiusLg,
          padding: "28px 20px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 8 }}>{em}</div>
        <div
          style={{
            fontFamily: DS.font,
            fontSize: 20,
            fontWeight: 700,
            color: DS.dark,
            marginBottom: 4,
          }}
        >
          Practice Complete!
        </div>
        <div
          style={{
            fontFamily: DS.font,
            fontSize: 14,
            color: "#888",
            marginBottom: 16,
          }}
        >
          {"You scored "}
          <span style={{ color: DS.primary, fontWeight: 700 }}>{score}</span>
          {" out of "}
          <span style={{ fontWeight: 700 }}>{tot}</span>
          {" (" + pct + "%)"}
        </div>
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              background: DS.correctBg,
              borderRadius: DS.radius,
              padding: "8px 16px",
              fontFamily: DS.font,
              fontSize: 13,
              color: DS.correct,
              fontWeight: 600,
            }}
          >
            {"✓ " + score}
          </div>
          <div
            style={{
              background: DS.wrongBg,
              borderRadius: DS.radius,
              padding: "8px 16px",
              fontFamily: DS.font,
              fontSize: 13,
              color: DS.wrong,
              fontWeight: 600,
            }}
          >
            {"✗ " + (tot - score)}
          </div>
        </div>
        <button
          onClick={onReset}
          style={{
            marginTop: 20,
            padding: "10px 32px",
            borderRadius: 40,
            border: "none",
            background: `linear-gradient(135deg, ${DS.gradStart}, ${DS.gradEnd})`,
            fontFamily: DS.font,
            fontSize: 14,
            fontWeight: 600,
            color: "#fff",
            cursor: "pointer",
          }}
        >
          {"🔄 Try Again"}
        </button>
      </div>
    );
  }

  const q = MCQ_QUESTIONS[qo[ci]];
  const isCorr = sel === q.correctId;
  const progressPct = ((ci + (ans ? 1 : 0)) / qo.length) * 100;

  return (
    <div
      style={{
        background: DS.white,
        border: `1px solid ${DS.lightGray}`,
        borderRadius: DS.radiusLg,
        padding: "16px",
        marginBottom: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <span style={{ fontFamily: DS.font, fontSize: 12, color: "#888" }}>
          {"Q " + (ci + 1) + "/" + qo.length}
        </span>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span
            style={{
              fontFamily: DS.font,
              fontSize: 10,
              color: DIFF_CLR[q.difficulty],
              fontWeight: 600,
              background: DIFF_CLR[q.difficulty] + "18",
              padding: "2px 8px",
              borderRadius: 20,
            }}
          >
            {q.difficulty}
          </span>
          <span style={{ fontSize: 14 }}>{CAT_ICO[q.category]}</span>
        </div>
      </div>

      <div
        style={{
          height: 4,
          background: DS.lightGray,
          borderRadius: 2,
          marginBottom: 14,
        }}
      >
        <div
          style={{
            height: 4,
            background: `linear-gradient(90deg, ${DS.primary}, ${DS.solidPurple})`,
            borderRadius: 2,
            width: progressPct + "%",
            transition: "width 400ms ease",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <span
          style={{
            fontFamily: DS.font,
            fontSize: 12,
            color: DS.correct,
            fontWeight: 600,
          }}
        >
          {"✓ " + score}
        </span>
        <span
          style={{
            fontFamily: DS.font,
            fontSize: 12,
            color: DS.wrong,
            fontWeight: 600,
          }}
        >
          {"✗ " + (tot - score)}
        </span>
      </div>

      <div
        style={{
          fontFamily: DS.font,
          fontSize: 14,
          fontWeight: 600,
          color: DS.dark,
          marginBottom: 14,
          lineHeight: 1.5,
        }}
      >
        {q.question}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {q.options.map((o: MCQOption) => {
          const isSel = sel === o.id;
          const isC = o.id === q.correctId;
          let bdr = DS.lightGray;
          let bg = DS.white;
          let txt = DS.dark;
          if (ans) {
            if (isC) {
              bdr = DS.correct;
              bg = DS.correctBg;
              txt = DS.correct;
            } else if (isSel) {
              bdr = DS.wrong;
              bg = DS.wrongBg;
              txt = DS.wrong;
            }
          } else if (isSel) {
            bdr = DS.primary;
            bg = DS.lightPurple + "44";
          }
          const circBg =
            ans && isC
              ? DS.correct
              : ans && isSel && !isC
                ? DS.wrong
                : "transparent";
          const circClr = ans && (isC || (isSel && !isC)) ? "#fff" : txt;
          const circLabel =
            ans && isC ? "✓" : ans && isSel && !isC ? "✗" : o.id.toUpperCase();

          return (
            <button
              key={o.id}
              onClick={() => !ans && onSelectOption(o.id)}
              disabled={ans}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                borderRadius: DS.radius,
                border: `2px solid ${bdr}`,
                background: bg,
                fontFamily: DS.font,
                fontSize: 13,
                fontWeight: 500,
                color: txt,
                cursor: ans ? "default" : "pointer",
                transition: "all 200ms ease",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  border: `2px solid ${bdr}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  flexShrink: 0,
                  background: circBg,
                  color: circClr,
                }}
              >
                {circLabel}
              </div>
              <span>{o.text}</span>
            </button>
          );
        })}
      </div>

      {showExplanation && ans && (
        <div
          style={{
            marginTop: 12,
            padding: "10px 14px",
            borderRadius: DS.radius,
            background: isCorr ? "#F1F8E9" : DS.lightPeach,
            border: `1px solid ${isCorr ? "#C5E1A5" : "#FFE0B2"}`,
          }}
        >
          <div
            style={{
              fontFamily: DS.font,
              fontSize: 12,
              fontWeight: 700,
              color: isCorr ? DS.correct : "#E65100",
              marginBottom: 4,
            }}
          >
            {isCorr ? "🎉 Correct!" : "💡 Explanation:"}
          </div>
          <div
            style={{
              fontFamily: DS.font,
              fontSize: 12,
              color: "#6E6E6E",
              lineHeight: 1.5,
            }}
          >
            {q.explanation}
          </div>
        </div>
      )}

      {ans && (
        <button
          onClick={onNext}
          style={{
            marginTop: 12,
            width: "100%",
            padding: "10px 0",
            borderRadius: 40,
            border: "none",
            background: `linear-gradient(135deg, ${DS.gradStart}, ${DS.gradEnd})`,
            fontFamily: DS.font,
            fontSize: 14,
            fontWeight: 600,
            color: "#fff",
            cursor: "pointer",
          }}
        >
          {ci + 1 >= qo.length ? "See Results 🏆" : "Next Question →"}
        </button>
      )}
    </div>
  );
}

// ───────────────────────── Main Component ─────────────────────────
function AngleBisectionConstructor(): ReactElement {
  const [step, setStep] = useState<number>(1);
  const [mode, setMode] = useState<Mode>("learn");
  const [quiz, setQuiz] = useState<QuizState>({
    currentQuestionIndex: 0,
    selectedOptionId: null,
    isAnswered: false,
    score: 0,
    totalAnswered: 0,
    showExplanation: false,
    questionsOrder: shuffleArray(
      Array.from({ length: MCQ_QUESTIONS.length }, (_, i) => i),
    ),
  });

  const canNext = mode === "learn" && step < TOTAL_STEPS;
  const canPrev = mode === "learn" && step > 1;

  const cQ: MCQQuestion | null =
    quiz.currentQuestionIndex < quiz.questionsOrder.length
      ? MCQ_QUESTIONS[quiz.questionsOrder[quiz.currentQuestionIndex]]
      : null;

  const selOpt = (id: string): void => {
    if (quiz.isAnswered || !cQ) return;
    setQuiz((p) => ({
      ...p,
      selectedOptionId: id,
      isAnswered: true,
      showExplanation: true,
      score: p.score + (id === cQ.correctId ? 1 : 0),
      totalAnswered: p.totalAnswered + 1,
    }));
  };
  const nextQ = (): void => {
    setQuiz((p) => ({
      ...p,
      currentQuestionIndex: p.currentQuestionIndex + 1,
      selectedOptionId: null,
      isAnswered: false,
      showExplanation: false,
    }));
  };
  const resetQ = (): void => {
    setQuiz({
      currentQuestionIndex: 0,
      selectedOptionId: null,
      isAnswered: false,
      score: 0,
      totalAnswered: 0,
      showExplanation: false,
      questionsOrder: shuffleArray(
        Array.from({ length: MCQ_QUESTIONS.length }, (_, i) => i),
      ),
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: DS.offWhite,
        fontFamily: DS.font,
        padding: "20px 12px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `
@keyframes fadeSlideIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(74,77,201,0.3)}50%{box-shadow:0 0 0 8px rgba(74,77,201,0)}}
button:hover{filter:brightness(1.05)}`,
        }}
      />

      <div style={{ maxWidth: 560, width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <h1
            style={{
              fontFamily: DS.font,
              fontSize: 22,
              fontWeight: 700,
              color: DS.dark,
              margin: "0 0 2px 0",
            }}
          >
            Angle Bisection Constructor
          </h1>
          <p
            style={{
              fontFamily: DS.font,
              fontSize: 13,
              color: "#888",
              margin: 0,
            }}
          >
            {
              "Divide any angle into two equal halves using compass & straightedge"
            }
          </p>
        </div>

        <div
          style={{
            display: "flex",
            marginBottom: 16,
            background: DS.lightGray,
            borderRadius: 40,
            padding: 3,
          }}
        >
          {(["learn", "practice"] as Mode[]).map((m: Mode) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setStep(1);
                if (m === "practice") resetQ();
              }}
              style={{
                flex: 1,
                padding: "9px 0",
                border: "none",
                borderRadius: 40,
                background: mode === m ? DS.white : "transparent",
                fontFamily: DS.font,
                fontSize: 13,
                fontWeight: mode === m ? 600 : 400,
                color: mode === m ? DS.primary : "#888",
                cursor: "pointer",
                transition: "all 250ms ease",
                boxShadow: mode === m ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
              }}
            >
              {m === "learn" ? "📖 Learn" : "🎮 Practice"}
            </button>
          ))}
        </div>

        {mode === "learn" && (
          <div>
            <div style={{ marginBottom: 14 }}>
              <StepIndicator
                currentStep={step}
                totalSteps={TOTAL_STEPS}
                onStepClick={setStep}
              />
            </div>
            <InstructionCard step={step} />
            <div
              style={{
                background: DS.white,
                borderRadius: DS.radiusLg,
                border: `1px solid ${DS.lightGray}`,
                padding: "8px 4px",
                marginBottom: 12,
                boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
              }}
            >
              <GeometryCanvas step={step} practiceAngle={null} />
            </div>
            <SSSProofPanel visible={step === 4} angleDeg={90} />
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button
                onClick={() => canPrev && setStep((s) => s - 1)}
                disabled={!canPrev}
                style={{
                  flex: 1,
                  padding: "11px 0",
                  borderRadius: 40,
                  border: `2px solid ${canPrev ? DS.primary : DS.lightGray}`,
                  background: DS.white,
                  fontFamily: DS.font,
                  fontSize: 14,
                  fontWeight: 600,
                  color: canPrev ? DS.primary : DS.gray,
                  cursor: canPrev ? "pointer" : "not-allowed",
                }}
              >
                {"← Previous"}
              </button>
              <button
                onClick={() => canNext && setStep((s) => s + 1)}
                disabled={!canNext}
                style={{
                  flex: 1,
                  padding: "11px 0",
                  borderRadius: 40,
                  border: "none",
                  background: canNext
                    ? `linear-gradient(135deg, ${DS.gradStart}, ${DS.gradEnd})`
                    : DS.lightGray,
                  fontFamily: DS.font,
                  fontSize: 14,
                  fontWeight: 600,
                  color: canNext ? "#fff" : DS.gray,
                  cursor: canNext ? "pointer" : "not-allowed",
                  animation: canNext ? "pulse 2s infinite" : "none",
                }}
              >
                {step === TOTAL_STEPS ? "Complete ✓" : "Next →"}
              </button>
            </div>
          </div>
        )}

        {mode === "practice" && (
          <div>
            <MCQPractice
              quizState={quiz}
              onSelectOption={selOpt}
              onNext={nextQ}
              onReset={resetQ}
            />
          </div>
        )}

        <div
          style={{
            textAlign: "center",
            marginTop: 16,
            fontFamily: DS.font,
            fontSize: 11,
            color: "#aaa",
          }}
        >
          {
            "Based on NCERT Ganita Prakash Grade 7 — Chapter 6: Constructions and Tilings"
          }
        </div>
      </div>
    </div>
  );
}

export { AngleBisectionConstructor };
export default AngleBisectionConstructor;
