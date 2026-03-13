// @ts-nocheck
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  type MouseEvent as ReactMouseEvent,
} from "react";

// ── Type definitions ────────────────────────────────────────────
interface Point {
  x: number;
  y: number;
}

interface StepData {
  id: number;
  title: string;
  shortTitle: string;
  instruction: string;
  detail: string;
}

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
  relatedStep: number; // which canvas step to show
}

interface LegendItem {
  color: string;
  label: string;
}

type Mode = "learn" | "practice";

// ── Singularity Design System Colors ────────────────────────────
const COLORS = {
  primary: "#4A4DC9",
  primaryDark: "#533086",
  orange: "#FF7212",
  orangeLight: "#FC9145",
  bgPage: "#FFFFFF",
  bgCard: "#F5F5F5",
  bgCanvas: "#FAFAFA",
  purpleLight: "#C1C1EA",
  purpleTint: "#EEEEF8",
  orangeTint: "#FFF3E4",
  textPrimary: "#1A1A2E",
  textSecondary: "#4E4E4E",
  textMuted: "#7A7A8E",
  textDisabled: "#CACACA",
  border: "#EBEBEB",
  borderActive: "#4A4DC9",
  lineM: "#4A4DC9",
  lineN: "#FF7212",
  transversal: "#533086",
  angleA: "#FC9145",
  angleB: "#4A4DC9",
  arc: "#533086",
  chord: "#FF7212",
  point: "#1A1A2E",
  pointGlow: "rgba(74,77,201,0.15)",
  parallelMark: "#4A4DC9",
  success: "#2EAD6B",
  successBg: "#E8F8F0",
  error: "#E04B4B",
  errorBg: "#FDEEEE",
} as const;

const FONT = "'Poppins', 'Segoe UI', sans-serif" as const;

// ── Geometry helpers ────────────────────────────────────────────
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
function dist(a: Point, b: Point): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}
function angleBetween(from: Point, to: Point): number {
  return Math.atan2(to.y - from.y, to.x - from.x);
}

// ── Canvas drawing primitives ──────────────────────────────────
function drawLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  width: number = 2,
  dash: number[] = [],
): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.setLineDash(dash);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

function drawArc(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
  color: string,
  width: number = 2,
  dash: number[] = [],
): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.setLineDash(dash);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(cx, cy, r, startAngle, endAngle);
  ctx.stroke();
  ctx.restore();
}

function drawFilledArc(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
  color: string,
): void {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, r, startAngle, endAngle);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawPoint(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  label: string,
  color: string = COLORS.point,
  labelOffset: Point = { x: 0, y: -18 },
): void {
  ctx.save();
  ctx.fillStyle = COLORS.pointGlow;
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 2.5, 0, Math.PI * 2);
  ctx.fill();
  if (label) {
    ctx.fillStyle = color;
    ctx.font = `600 15px ${FONT}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, x + labelOffset.x, y + labelOffset.y);
  }
  ctx.restore();
}

function drawAngleLabel(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  midAngle: number,
  r: number,
  label: string,
  color: string,
): void {
  const lx: number = cx + (r + 16) * Math.cos(midAngle);
  const ly: number = cy + (r + 16) * Math.sin(midAngle);
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = `600 italic 15px ${FONT}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, lx, ly);
  ctx.restore();
}

function drawParallelArrows(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  color: string,
): void {
  const len: number = 9;
  const gap: number = 7;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.translate(x, y);
  ctx.rotate(angle);
  for (let i = -1; i <= 1; i += 2) {
    const ox: number = i * gap;
    ctx.beginPath();
    ctx.moveTo(ox - len * 0.5, -len * 0.4);
    ctx.lineTo(ox + len * 0.5, 0);
    ctx.lineTo(ox - len * 0.5, len * 0.4);
    ctx.stroke();
  }
  ctx.restore();
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ── Step data ────────────────────────────────────────────────────
const STEPS: StepData[] = [
  {
    id: 1,
    title: "Given: Line m and Point B",
    shortTitle: "Setup",
    instruction:
      "Here is line m and point B above it. Our goal: construct a line through B that is parallel to m, using only compass and straightedge.",
    detail:
      "We are given a straight line m and a point B that does not lie on m. We need to construct another line through B that never meets m — a parallel line.",
  },
  {
    id: 2,
    title: "Draw the Transversal",
    shortTitle: "Transversal",
    instruction:
      "Draw a transversal line l from B to line m, meeting at point A. Notice the angle 'a' formed between l and m at A. This angle is the key — we will copy it.",
    detail:
      "A transversal is any line that crosses two or more lines. Here, line l will cross both m and the parallel line we'll create. The angle a at A is a corresponding angle.",
  },
  {
    id: 3,
    title: "Draw Equal-Radius Arcs",
    shortTitle: "Arcs",
    instruction:
      "Draw equal-radius arcs at both A and B on the transversal. The arc at A captures the source angle, and the arc at B prepares the target.",
    detail:
      "Using the compass set to any convenient radius, draw an arc centred at A that intersects both arms of angle a. Then, keeping the same radius, draw an arc centred at B.",
  },
  {
    id: 4,
    title: "Transfer the Chord",
    shortTitle: "Copy Angle",
    instruction:
      "Transfer the chord from the arc at A to the arc at B — this copies angle a. Measure the chord length at A with the compass and mark it on the arc at B.",
    detail:
      "The chord is the straight-line distance between the two points where the arc at A meets the arms of angle a. Transferring this chord to the arc at B reproduces the same angle.",
  },
  {
    id: 5,
    title: "Complete: Line n ∥ Line m",
    shortTitle: "Parallel!",
    instruction:
      "Draw line n through B using the copied angle. Since both lines make equal corresponding angles with transversal l, line n is parallel to line m!",
    detail:
      "By the Corresponding Angles Converse theorem: if a transversal makes equal corresponding angles with two lines, those lines are parallel. The arrow marks confirm m ∥ n.",
  },
];

// ── MCQ Questions for Practice Mode ──────────────────────────────
const MCQ_QUESTIONS: MCQQuestion[] = [
  {
    id: 1,
    question:
      "What is the first step to construct a line parallel to line m through point B?",
    options: [
      { id: "a", text: "Draw a perpendicular from B to m" },
      { id: "b", text: "Draw a transversal line through B that intersects m" },
      { id: "c", text: "Copy line m directly through B" },
      { id: "d", text: "Bisect the angle at B" },
    ],
    correctId: "b",
    explanation:
      "The first step is to draw a transversal — a line through B that crosses line m at a point A. This creates the angle we need to copy.",
    relatedStep: 2,
  },
  {
    id: 2,
    question: "Why do we draw arcs of equal radius at both points A and B?",
    options: [
      { id: "a", text: "To measure the length of the transversal" },
      { id: "b", text: "To create congruent triangles for the SSS condition" },
      { id: "c", text: "To find the midpoint of the transversal" },
      { id: "d", text: "To construct a perpendicular bisector" },
    ],
    correctId: "b",
    explanation:
      "Equal-radius arcs at A and B set up an isosceles triangle at each point. By also transferring the chord, we ensure two triangles are congruent (SSS), guaranteeing equal angles.",
    relatedStep: 3,
  },
  {
    id: 3,
    question:
      "What does 'transferring the chord' accomplish in this construction?",
    options: [
      { id: "a", text: "It makes line n perpendicular to line m" },
      { id: "b", text: "It copies the exact angle a from point A to point B" },
      { id: "c", text: "It bisects the angle at point A" },
      { id: "d", text: "It marks the midpoint of arc at B" },
    ],
    correctId: "b",
    explanation:
      "Transferring the chord length from the arc at A to the arc at B reproduces the same opening, copying the exact angle a at point B.",
    relatedStep: 4,
  },
  {
    id: 4,
    question:
      "Which geometric principle guarantees that line n is parallel to line m?",
    options: [
      { id: "a", text: "Alternate interior angles are supplementary" },
      {
        id: "b",
        text: "Corresponding angles formed by a transversal are equal",
      },
      { id: "c", text: "Vertically opposite angles are equal" },
      { id: "d", text: "Angles in a triangle add up to 180°" },
    ],
    correctId: "b",
    explanation:
      "The Corresponding Angles Converse states: if a transversal cuts two lines making equal corresponding angles, those two lines must be parallel.",
    relatedStep: 5,
  },
  {
    id: 5,
    question: "In this construction, what tools are needed?",
    options: [
      { id: "a", text: "Ruler and protractor" },
      { id: "b", text: "Only a compass" },
      { id: "c", text: "Unmarked ruler (straightedge) and compass" },
      { id: "d", text: "Set square and ruler" },
    ],
    correctId: "c",
    explanation:
      "The construction uses only an unmarked straightedge and a compass — no measurement of angles or lengths is needed, making it a pure geometric construction.",
    relatedStep: 1,
  },
];

// ── Geometry config ──────────────────────────────────────────────
const GEO = {
  mY: 340,
  mXStart: 30,
  mXEnd: 720,
  B: { x: 340, y: 120 } as Point,
  A: { x: 210, y: 340 } as Point,
  arcR: 50,
} as const;

const transAngle: number = angleBetween(GEO.A, GEO.B);
const transAngleDown: number = angleBetween(GEO.B, GEO.A);
const arcA_onM: Point = {
  x: GEO.A.x + GEO.arcR * Math.cos(0),
  y: GEO.A.y + GEO.arcR * Math.sin(0),
};
const arcA_onL: Point = {
  x: GEO.A.x + GEO.arcR * Math.cos(transAngle),
  y: GEO.A.y + GEO.arcR * Math.sin(transAngle),
};
const lineNAngle: number = transAngleDown - (Math.PI - transAngle);
const arcB_onL: Point = {
  x: GEO.B.x + GEO.arcR * Math.cos(transAngleDown),
  y: GEO.B.y + GEO.arcR * Math.sin(transAngleDown),
};
const arcB_onN: Point = {
  x: GEO.B.x + GEO.arcR * Math.cos(lineNAngle),
  y: GEO.B.y + GEO.arcR * Math.sin(lineNAngle),
};
const nExtent: number = 300;
const lineNStart: Point = {
  x: GEO.B.x - nExtent * Math.cos(lineNAngle),
  y: GEO.B.y - nExtent * Math.sin(lineNAngle),
};
const lineNEnd: Point = {
  x: GEO.B.x + nExtent * Math.cos(lineNAngle),
  y: GEO.B.y + nExtent * Math.sin(lineNAngle),
};

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

// ── Main Component ───────────────────────────────────────────────
function ParallelLineConstructor(): JSX.Element {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [mode, setMode] = useState<Mode>("learn");
  const [animProgress, setAnimProgress] = useState<number>(1);
  const [showTheory, setShowTheory] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);

  // MCQ Practice state
  const [mcqIndex, setMcqIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [quizComplete, setQuizComplete] = useState<boolean>(false);

  // Canvas step for practice (driven by MCQ relatedStep)
  const practiceCanvasStep: number = quizComplete
    ? 5
    : (MCQ_QUESTIONS[mcqIndex]?.relatedStep ?? 1);

  useEffect(() => {
    setAnimProgress(0);
    let start: number | null = null;
    const duration: number =
      currentStep === 3 || currentStep === 4 ? 1500 : 800;
    function tick(ts: number): void {
      if (!start) start = ts;
      const elapsed: number = ts - start;
      const t: number = Math.min(elapsed / duration, 1);
      setAnimProgress(easeOutCubic(t));
      if (t < 1) animRef.current = requestAnimationFrame(tick);
    }
    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [currentStep, mcqIndex]);

  // ── Canvas rendering ──────────────────────────────────────────
  const draw = useCallback((): void => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    if (!canvas) return;
    const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (!ctx) return;
    const W: number = canvas.width;
    const H: number = canvas.height;

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, W, H);

    // Subtle dot grid
    ctx.save();
    ctx.fillStyle = "rgba(74,77,201,0.06)";
    for (let x = 20; x < W; x += 30) {
      for (let y = 20; y < H; y += 30) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();

    const step: number = mode === "practice" ? practiceCanvasStep : currentStep;
    const anim: number = mode === "practice" ? 1 : animProgress;

    // ── Step 1+: Line m ──
    drawLine(ctx, GEO.mXStart, GEO.mY, GEO.mXEnd, GEO.mY, COLORS.lineM, 3);
    ctx.save();
    ctx.fillStyle = COLORS.lineM;
    ctx.font = `700 italic 17px ${FONT}`;
    ctx.textAlign = "right";
    ctx.fillText("m", GEO.mXEnd + 4, GEO.mY - 12);
    ctx.restore();
    drawPoint(ctx, GEO.B.x, GEO.B.y, "B", COLORS.point, { x: 12, y: -20 });

    // ── Step 2+: Transversal ──
    if (step >= 2) {
      const t2: number = step === 2 ? anim : 1;
      const d: number = dist(GEO.A, GEO.B);
      const extA: Point = {
        x: GEO.A.x - (40 * (GEO.B.x - GEO.A.x)) / d,
        y: GEO.A.y - (40 * (GEO.B.y - GEO.A.y)) / d,
      };
      const extB: Point = {
        x: GEO.B.x + (60 * (GEO.B.x - GEO.A.x)) / d,
        y: GEO.B.y + (60 * (GEO.B.y - GEO.A.y)) / d,
      };
      const curExtB: Point = {
        x: lerp(GEO.A.x, extB.x, t2),
        y: lerp(GEO.A.y, extB.y, t2),
      };
      const curExtA: Point = {
        x: lerp(GEO.A.x, extA.x, t2),
        y: lerp(GEO.A.y, extA.y, t2),
      };
      drawLine(
        ctx,
        curExtA.x,
        curExtA.y,
        curExtB.x,
        curExtB.y,
        COLORS.transversal,
        2.5,
      );
      ctx.save();
      ctx.fillStyle = COLORS.transversal;
      ctx.font = `700 italic 17px ${FONT}`;
      ctx.fillText("l", extB.x + 10, extB.y - 6);
      ctx.restore();
      drawPoint(ctx, GEO.A.x, GEO.A.y, "A", COLORS.point, { x: -18, y: 18 });

      if (t2 > 0.5) {
        const angleStart: number = 0;
        const angleEnd: number = transAngle;
        const opacity: number = Math.min((t2 - 0.5) * 2, 1);
        ctx.save();
        ctx.globalAlpha = opacity;
        drawFilledArc(
          ctx,
          GEO.A.x,
          GEO.A.y,
          32,
          angleEnd,
          angleStart,
          "rgba(252,145,69,0.2)",
        );
        drawArc(
          ctx,
          GEO.A.x,
          GEO.A.y,
          32,
          angleEnd,
          angleStart,
          COLORS.angleA,
          2.5,
        );
        const midAngleA: number = (angleStart + angleEnd) / 2;
        drawAngleLabel(
          ctx,
          GEO.A.x,
          GEO.A.y,
          midAngleA,
          32,
          "a",
          COLORS.angleA,
        );
        ctx.restore();
      }
    }

    // ── Step 3+: Arcs (animated compass construction) ──
    if (step >= 3) {
      const t3: number = step === 3 ? anim : 1;

      // ── Arc at A (source arc) ──
      // Arc sweeps from line m direction past transversal direction
      const arcA_sweepStart: number = transAngle - 0.3; // a bit before transversal
      const arcA_sweepEnd: number = 0.15; // a bit past line m

      // Phase 1 (t3: 0→0.4): draw arc at A with sweep animation
      const arcA_progress: number = Math.min(t3 / 0.4, 1);
      if (arcA_progress > 0) {
        ctx.save();
        // Dashed radius line from A showing compass radius
        const radiusEndAngle_A: number =
          arcA_sweepStart + (arcA_sweepEnd - arcA_sweepStart) * arcA_progress;
        const radiusTipA: Point = {
          x: GEO.A.x + GEO.arcR * Math.cos(radiusEndAngle_A),
          y: GEO.A.y + GEO.arcR * Math.sin(radiusEndAngle_A),
        };
        // Compass radius indicator (dashed)
        if (step === 3) {
          ctx.globalAlpha = Math.max(0, 1 - arcA_progress * 1.5);
          drawLine(
            ctx,
            GEO.A.x,
            GEO.A.y,
            radiusTipA.x,
            radiusTipA.y,
            COLORS.arc,
            1.5,
            [4, 4],
          );
          // Compass tip dot
          ctx.fillStyle = COLORS.arc;
          ctx.beginPath();
          ctx.arc(radiusTipA.x, radiusTipA.y, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
        // Radius label "r"
        if (step === 3 && arcA_progress < 0.7) {
          ctx.globalAlpha =
            Math.min(arcA_progress * 3, 1) * (1 - arcA_progress / 0.7);
          const rLabelA: Point = {
            x:
              GEO.A.x +
              GEO.arcR * 0.5 * Math.cos((arcA_sweepStart + arcA_sweepEnd) / 2),
            y:
              GEO.A.y +
              GEO.arcR * 0.5 * Math.sin((arcA_sweepStart + arcA_sweepEnd) / 2),
          };
          ctx.fillStyle = COLORS.arc;
          ctx.font = `500 italic 12px ${FONT}`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("r", rLabelA.x - 10, rLabelA.y);
          ctx.globalAlpha = 1;
        }
        // Animated arc sweep at A
        const currentArcA_end: number =
          arcA_sweepStart + (arcA_sweepEnd - arcA_sweepStart) * arcA_progress;
        ctx.globalAlpha = Math.min(arcA_progress * 2, 1);
        drawArc(
          ctx,
          GEO.A.x,
          GEO.A.y,
          GEO.arcR,
          arcA_sweepStart,
          currentArcA_end,
          COLORS.arc,
          2.5,
        );
        // Intersection points fade in as arc reaches them
        if (arcA_progress > 0.8) {
          const ptOpacity: number = (arcA_progress - 0.8) / 0.2;
          ctx.globalAlpha = ptOpacity;
          drawPoint(ctx, arcA_onM.x, arcA_onM.y, "C", COLORS.arc, {
            x: 10,
            y: 16,
          });
          drawPoint(ctx, arcA_onL.x, arcA_onL.y, "D", COLORS.arc, {
            x: -16,
            y: -12,
          });
        }
        ctx.restore();
      }

      // ── Arc at B (target arc) ──
      // Phase 2 (t3: 0.45→0.9): draw arc at B with sweep animation
      const arcB_rawProgress: number = Math.max(0, (t3 - 0.45) / 0.45);
      const arcB_progress: number = Math.min(arcB_rawProgress, 1);
      const arcBStart: number = transAngleDown;
      const arcBEnd: number = lineNAngle;
      const arcB_sweepStart: number = Math.min(arcBStart, arcBEnd) - 0.15;
      const arcB_sweepEnd: number = Math.max(arcBStart, arcBEnd) + 0.15;

      if (arcB_progress > 0) {
        ctx.save();
        // Compass radius indicator at B (dashed)
        const radiusEndAngle_B: number =
          arcB_sweepStart + (arcB_sweepEnd - arcB_sweepStart) * arcB_progress;
        const radiusTipB: Point = {
          x: GEO.B.x + GEO.arcR * Math.cos(radiusEndAngle_B),
          y: GEO.B.y + GEO.arcR * Math.sin(radiusEndAngle_B),
        };
        if (step === 3) {
          ctx.globalAlpha = Math.max(0, 1 - arcB_progress * 1.5);
          drawLine(
            ctx,
            GEO.B.x,
            GEO.B.y,
            radiusTipB.x,
            radiusTipB.y,
            COLORS.arc,
            1.5,
            [4, 4],
          );
          ctx.fillStyle = COLORS.arc;
          ctx.beginPath();
          ctx.arc(radiusTipB.x, radiusTipB.y, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
        // "same r" label at B
        if (step === 3 && arcB_progress < 0.7) {
          ctx.globalAlpha =
            Math.min(arcB_progress * 3, 1) * (1 - arcB_progress / 0.7);
          const rLabelB: Point = {
            x:
              GEO.B.x +
              GEO.arcR * 0.5 * Math.cos((arcB_sweepStart + arcB_sweepEnd) / 2),
            y:
              GEO.B.y +
              GEO.arcR * 0.5 * Math.sin((arcB_sweepStart + arcB_sweepEnd) / 2),
          };
          ctx.fillStyle = COLORS.arc;
          ctx.font = `500 italic 12px ${FONT}`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("same r", rLabelB.x + 14, rLabelB.y);
          ctx.globalAlpha = 1;
        }
        // Animated arc sweep at B
        const currentArcB_end: number =
          arcB_sweepStart + (arcB_sweepEnd - arcB_sweepStart) * arcB_progress;
        ctx.globalAlpha = Math.min(arcB_progress * 2, 1);
        drawArc(
          ctx,
          GEO.B.x,
          GEO.B.y,
          GEO.arcR,
          arcB_sweepStart,
          currentArcB_end,
          COLORS.arc,
          2.5,
        );
        // Intersection point E
        if (arcB_progress > 0.8) {
          const ptOpacity: number = (arcB_progress - 0.8) / 0.2;
          ctx.globalAlpha = ptOpacity;
          drawPoint(ctx, arcB_onL.x, arcB_onL.y, "E", COLORS.arc, {
            x: 14,
            y: 16,
          });
        }
        ctx.restore();
      }

      // ── "Equal radius" badge (appears at end of step 3) ──
      if (step === 3 && t3 > 0.9) {
        const badgeOp: number = Math.min((t3 - 0.9) / 0.1, 1);
        ctx.save();
        ctx.globalAlpha = badgeOp;
        ctx.fillStyle = COLORS.purpleTint;
        roundRect(ctx, 290, 230, 170, 34, 17);
        ctx.fill();
        ctx.strokeStyle = COLORS.purpleLight;
        ctx.lineWidth = 1.5;
        roundRect(ctx, 290, 230, 170, 34, 17);
        ctx.stroke();
        ctx.fillStyle = COLORS.primaryDark;
        ctx.font = `600 12px ${FONT}`;
        ctx.textAlign = "center";
        ctx.fillText("Equal radius at A & B", 375, 251);
        ctx.restore();
      }
    }

    // ── Step 4+: Chord transfer (animated compass measurement) ──
    if (step >= 4) {
      const t4: number = step === 4 ? anim : 1;
      ctx.save();

      // Phase 1 (t4: 0→0.35): Show chord at A being measured
      const chordMeasure: number = Math.min(t4 / 0.35, 1);
      if (chordMeasure > 0) {
        ctx.globalAlpha = Math.min(chordMeasure * 2.5, 1);
        // Chord line at A grows from C to D
        const chordEndX: number =
          arcA_onM.x + (arcA_onL.x - arcA_onM.x) * chordMeasure;
        const chordEndY: number =
          arcA_onM.y + (arcA_onL.y - arcA_onM.y) * chordMeasure;
        drawLine(
          ctx,
          arcA_onM.x,
          arcA_onM.y,
          chordEndX,
          chordEndY,
          COLORS.chord,
          2.5,
          [5, 4],
        );
        // Compass tip traveling along chord
        if (step === 4 && chordMeasure < 1) {
          ctx.fillStyle = COLORS.chord;
          ctx.beginPath();
          ctx.arc(chordEndX, chordEndY, 4, 0, Math.PI * 2);
          ctx.fill();
        }
        // Chord label
        if (chordMeasure > 0.6) {
          ctx.globalAlpha = (chordMeasure - 0.6) / 0.4;
          ctx.fillStyle = COLORS.chord;
          ctx.font = `500 11px ${FONT}`;
          const chMidA: Point = {
            x: (arcA_onM.x + arcA_onL.x) / 2,
            y: (arcA_onM.y + arcA_onL.y) / 2,
          };
          ctx.fillText("chord", chMidA.x - 28, chMidA.y - 8);
        }
      }

      // Phase 2 (t4: 0.4→0.7): Transfer chord to arc at B — animated
      const chordTransfer: number = Math.max(0, Math.min((t4 - 0.4) / 0.3, 1));
      if (chordTransfer > 0) {
        ctx.globalAlpha = Math.min(chordTransfer * 2.5, 1);
        // Point F appears
        if (chordTransfer > 0.5) {
          const fOpacity: number = (chordTransfer - 0.5) / 0.5;
          ctx.globalAlpha = fOpacity;
          drawPoint(ctx, arcB_onN.x, arcB_onN.y, "F", COLORS.chord, {
            x: -16,
            y: -12,
          });
        }
        // Chord line at B grows from E to F
        ctx.globalAlpha = Math.min(chordTransfer * 2, 1);
        const transferEndX: number =
          arcB_onL.x + (arcB_onN.x - arcB_onL.x) * chordTransfer;
        const transferEndY: number =
          arcB_onL.y + (arcB_onN.y - arcB_onL.y) * chordTransfer;
        drawLine(
          ctx,
          arcB_onL.x,
          arcB_onL.y,
          transferEndX,
          transferEndY,
          COLORS.chord,
          2.5,
          [5, 4],
        );
        // Compass tip at B
        if (step === 4 && chordTransfer < 1) {
          ctx.fillStyle = COLORS.chord;
          ctx.beginPath();
          ctx.arc(transferEndX, transferEndY, 4, 0, Math.PI * 2);
          ctx.fill();
        }
        // "same chord" label
        if (step === 4 && chordTransfer > 0.7) {
          ctx.globalAlpha = (chordTransfer - 0.7) / 0.3;
          ctx.fillStyle = COLORS.chord;
          ctx.font = `500 italic 11px ${FONT}`;
          const chMidB: Point = {
            x: (arcB_onL.x + arcB_onN.x) / 2,
            y: (arcB_onL.y + arcB_onN.y) / 2,
          };
          ctx.textAlign = "center";
          ctx.fillText("same chord", chMidB.x + 20, chMidB.y - 8);
        }
      }

      // Phase 3 (t4: 0.72→1.0): Show angle a at B with fill
      const angleReveal: number = Math.max(0, Math.min((t4 - 0.72) / 0.28, 1));
      if (angleReveal > 0) {
        ctx.globalAlpha = angleReveal;
        const angleBStart: number = transAngleDown;
        const angleBEnd: number = lineNAngle;
        const aBmin: number = Math.min(angleBStart, angleBEnd);
        const aBmax: number = Math.max(angleBStart, angleBEnd);
        // Angle fill sweeps in
        const currentAngleBEnd: number = aBmin + (aBmax - aBmin) * angleReveal;
        drawFilledArc(
          ctx,
          GEO.B.x,
          GEO.B.y,
          32,
          aBmin,
          currentAngleBEnd,
          "rgba(74,77,201,0.12)",
        );
        drawArc(
          ctx,
          GEO.B.x,
          GEO.B.y,
          32,
          aBmin,
          currentAngleBEnd,
          COLORS.angleB,
          2.5,
        );
        if (angleReveal > 0.6) {
          ctx.globalAlpha = (angleReveal - 0.6) / 0.4;
          const midAngleB: number = (angleBStart + angleBEnd) / 2;
          drawAngleLabel(
            ctx,
            GEO.B.x,
            GEO.B.y,
            midAngleB,
            32,
            "a",
            COLORS.angleB,
          );
        }
      }

      ctx.restore();
    }

    // ── Step 5: Line n ──
    if (step >= 5) {
      const t5: number = step === 5 ? anim : 1;
      ctx.save();
      ctx.globalAlpha = t5;
      drawLine(
        ctx,
        lineNStart.x,
        lineNStart.y,
        lineNEnd.x,
        lineNEnd.y,
        COLORS.lineN,
        3,
      );
      ctx.fillStyle = COLORS.lineN;
      ctx.font = `700 italic 17px ${FONT}`;
      ctx.fillText("n", lineNEnd.x + 8, lineNEnd.y - 12);
      drawParallelArrows(
        ctx,
        (GEO.mXStart + GEO.mXEnd) / 2 + 80,
        GEO.mY,
        0,
        COLORS.parallelMark,
      );
      const nMid: Point = {
        x: (lineNStart.x + lineNEnd.x) / 2 + 80,
        y: (lineNStart.y + lineNEnd.y) / 2,
      };
      drawParallelArrows(ctx, nMid.x, nMid.y, lineNAngle, COLORS.parallelMark);
      if (t5 > 0.6) {
        ctx.globalAlpha = Math.min((t5 - 0.6) * 2.5, 1);
        const bx: number = 540;
        const by: number = 195;
        ctx.fillStyle = COLORS.successBg;
        roundRect(ctx, bx, by, 185, 50, 25);
        ctx.fill();
        ctx.strokeStyle = COLORS.success;
        ctx.lineWidth = 2;
        roundRect(ctx, bx, by, 185, 50, 25);
        ctx.stroke();
        ctx.fillStyle = COLORS.success;
        ctx.font = `600 14px ${FONT}`;
        ctx.textAlign = "center";
        ctx.fillText("∠a = ∠a  ⟹  m ∥ n", bx + 92, by + 30);
      }
      ctx.restore();
    }
  }, [currentStep, animProgress, mode, practiceCanvasStep]);

  useEffect(() => {
    draw();
  }, [draw]);

  // MCQ handlers
  function handleSelectOption(optionId: string): void {
    if (isAnswered) return;
    setSelectedOption(optionId);
  }

  function handleSubmitAnswer(): void {
    if (!selectedOption || isAnswered) return;
    setIsAnswered(true);
    if (selectedOption === MCQ_QUESTIONS[mcqIndex].correctId) {
      setScore((s: number) => s + 1);
    }
  }

  function handleNextQuestion(): void {
    if (mcqIndex + 1 >= MCQ_QUESTIONS.length) {
      setQuizComplete(true);
    } else {
      setMcqIndex((i: number) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  }

  function resetPractice(): void {
    setMcqIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizComplete(false);
  }

  const legendItems: LegendItem[] = [
    { color: COLORS.lineM, label: "Line m" },
    { color: COLORS.transversal, label: "Transversal l" },
    { color: COLORS.angleA, label: "Angle a (source)" },
    { color: COLORS.angleB, label: "Angle a (copy)" },
    ...((mode === "learn" ? currentStep >= 5 : practiceCanvasStep >= 5)
      ? [{ color: COLORS.lineN, label: "Line n" }]
      : []),
  ];

  // Option styling helper
  function getOptionStyle(optionId: string): React.CSSProperties {
    const isSelected: boolean = selectedOption === optionId;
    const isCorrect: boolean = optionId === MCQ_QUESTIONS[mcqIndex]?.correctId;

    if (isAnswered) {
      if (isCorrect) {
        return {
          background: COLORS.successBg,
          border: `2px solid ${COLORS.success}`,
          color: COLORS.success,
        };
      }
      if (isSelected && !isCorrect) {
        return {
          background: COLORS.errorBg,
          border: `2px solid ${COLORS.error}`,
          color: COLORS.error,
        };
      }
      return {
        background: "#fff",
        border: `1.5px solid ${COLORS.border}`,
        color: COLORS.textDisabled,
        opacity: 0.6,
      };
    }

    if (isSelected) {
      return {
        background: COLORS.purpleTint,
        border: `2px solid ${COLORS.primary}`,
        color: COLORS.primaryDark,
      };
    }

    return {
      background: "#fff",
      border: `1.5px solid ${COLORS.border}`,
      color: COLORS.textSecondary,
    };
  }

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.bgPage,
        color: COLORS.textPrimary,
        fontFamily: FONT,
        padding: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;0,700;1,600&display=swap"
        rel="stylesheet"
      />

      {/* ── Header ── */}
      <header
        style={{
          width: "100%",
          maxWidth: 880,
          padding: "32px 24px 0",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 700,
              color: "#fff",
              boxShadow: "0 4px 14px rgba(74,77,201,0.25)",
            }}
          >
            ∥
          </div>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: "-0.01em",
                color: COLORS.primaryDark,
              }}
            >
              Parallel Line Constructor
            </h1>
            <p
              style={{
                margin: "2px 0 0",
                fontSize: 13,
                fontWeight: 400,
                color: COLORS.textMuted,
              }}
            >
              Construct a line parallel to m through point B using angle-copying
            </p>
          </div>
        </div>

        {/* Mode toggle */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginTop: 20,
            background: COLORS.bgCard,
            borderRadius: 24,
            padding: 4,
            border: `1px solid ${COLORS.border}`,
            width: "fit-content",
          }}
        >
          {(["learn", "practice"] as Mode[]).map((m: Mode) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setCurrentStep(1);
                resetPractice();
              }}
              style={{
                padding: "10px 24px",
                borderRadius: 20,
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: FONT,
                background: mode === m ? COLORS.primary : "transparent",
                color: mode === m ? "#fff" : COLORS.textSecondary,
                transition: "all 0.25s ease",
                boxShadow:
                  mode === m ? "0 2px 8px rgba(74,77,201,0.3)" : "none",
              }}
            >
              {m === "learn" ? "📖  Learn" : "✏️  Practice"}
            </button>
          ))}
        </div>
      </header>

      {/* ── Canvas (Learn mode only) ── */}
      {mode === "learn" && (
        <div
          style={{
            width: "100%",
            maxWidth: 880,
            padding: "20px 24px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              position: "relative",
              background: "#FFFFFF",
              border: `2px solid ${COLORS.border}`,
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            }}
          >
            <canvas
              ref={canvasRef}
              width={750}
              height={440}
              style={{ width: "100%", height: "auto", display: "block" }}
            />
            <div
              style={{
                position: "absolute",
                top: 14,
                left: 16,
                background: COLORS.purpleTint,
                border: `1.5px solid ${COLORS.purpleLight}`,
                borderRadius: 20,
                padding: "6px 16px",
                fontSize: 12,
                fontWeight: 600,
                color: COLORS.primary,
              }}
            >
              {`Step ${currentStep} of 5`}
            </div>
            <div
              style={{
                position: "absolute",
                bottom: 12,
                left: 16,
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              {legendItems.map(({ color, label }: LegendItem) => (
                <span
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 11,
                    fontWeight: 500,
                    color: COLORS.textSecondary,
                    background: "rgba(255,255,255,0.9)",
                    padding: "4px 10px",
                    borderRadius: 12,
                    border: `1px solid ${COLORS.border}`,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: color,
                      display: "inline-block",
                    }}
                  />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Controls ── */}
      <div
        style={{
          width: "100%",
          maxWidth: 880,
          padding: "0 24px 36px",
          boxSizing: "border-box",
        }}
      >
        {/* ════════ LEARN MODE ════════ */}
        {mode === "learn" && (
          <>
            <div
              style={{
                background: COLORS.bgCard,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 16,
                padding: "20px 24px",
                marginBottom: 16,
              }}
            >
              <h3
                style={{
                  margin: "0 0 8px",
                  fontSize: 17,
                  fontWeight: 700,
                  color: COLORS.primaryDark,
                }}
              >
                {STEPS[currentStep - 1].title}
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: COLORS.textSecondary,
                  fontWeight: 400,
                }}
              >
                {STEPS[currentStep - 1].instruction}
              </p>
              {showTheory && (
                <p
                  style={{
                    margin: "12px 0 0",
                    fontSize: 13,
                    lineHeight: 1.7,
                    color: COLORS.textSecondary,
                    background: COLORS.purpleTint,
                    padding: "12px 16px",
                    borderRadius: 12,
                    borderLeft: `4px solid ${COLORS.primary}`,
                    fontWeight: 400,
                  }}
                >
                  {STEPS[currentStep - 1].detail}
                </p>
              )}
              <button
                onClick={() => setShowTheory(!showTheory)}
                style={{
                  marginTop: 10,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: COLORS.primary,
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: FONT,
                  padding: 0,
                }}
              >
                {showTheory ? "▲ Hide detail" : "▼ Why does this work?"}
              </button>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 16,
              }}
            >
              <button
                disabled={currentStep <= 1}
                onClick={() =>
                  setCurrentStep((s: number) => Math.max(1, s - 1))
                }
                style={{
                  height: 40,
                  padding: "0 24px",
                  borderRadius: 20,
                  border: `1.5px solid ${currentStep <= 1 ? COLORS.textDisabled : COLORS.primary}`,
                  background: "transparent",
                  color:
                    currentStep <= 1 ? COLORS.textDisabled : COLORS.primary,
                  cursor: currentStep <= 1 ? "not-allowed" : "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: FONT,
                  transition: "all 0.2s ease",
                }}
              >
                ← Previous
              </button>
              <button
                disabled={currentStep >= 5}
                onClick={() =>
                  setCurrentStep((s: number) => Math.min(5, s + 1))
                }
                style={{
                  height: 40,
                  padding: "0 24px",
                  borderRadius: 20,
                  border: "none",
                  background:
                    currentStep >= 5
                      ? COLORS.success
                      : `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
                  color: "#fff",
                  cursor: currentStep >= 5 ? "default" : "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: FONT,
                  boxShadow:
                    currentStep >= 5
                      ? "none"
                      : "0 4px 14px rgba(74,77,201,0.3)",
                  transition: "all 0.2s ease",
                }}
              >
                {currentStep >= 5 ? "✓ Complete!" : "Next →"}
              </button>
            </div>
          </>
        )}

        {/* ════════ PRACTICE MODE (MCQ) ════════ */}
        {mode === "practice" && !quizComplete && (
          <div
            style={{
              background: COLORS.bgCard,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 16,
              padding: "24px",
            }}
          >
            {/* Progress bar */}
            <div
              style={{
                width: "100%",
                height: 8,
                borderRadius: 4,
                background: COLORS.border,
                marginBottom: 20,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${((mcqIndex + (isAnswered ? 1 : 0)) / MCQ_QUESTIONS.length) * 100}%`,
                  height: "100%",
                  borderRadius: 4,
                  background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.orange})`,
                  transition: "width 0.4s ease",
                }}
              />
            </div>

            {/* Question */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 10,
                marginBottom: 18,
              }}
            >
              <span
                style={{
                  background: COLORS.primary,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 12,
                  padding: "4px 10px",
                  borderRadius: 12,
                  flexShrink: 0,
                }}
              >
                Q{mcqIndex + 1}
              </span>
              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                  fontWeight: 600,
                  lineHeight: 1.6,
                  color: COLORS.textPrimary,
                }}
              >
                {MCQ_QUESTIONS[mcqIndex].question}
              </p>
            </div>

            {/* Options */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginBottom: 20,
              }}
            >
              {MCQ_QUESTIONS[mcqIndex].options.map((opt: MCQOption) => {
                const optStyle = getOptionStyle(opt.id);
                const isCorrect: boolean =
                  isAnswered && opt.id === MCQ_QUESTIONS[mcqIndex].correctId;
                const isWrong: boolean =
                  isAnswered &&
                  opt.id === selectedOption &&
                  opt.id !== MCQ_QUESTIONS[mcqIndex].correctId;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "14px 18px",
                      borderRadius: 14,
                      cursor: isAnswered ? "default" : "pointer",
                      fontSize: 14,
                      fontWeight: 500,
                      fontFamily: FONT,
                      textAlign: "left" as const,
                      transition: "all 0.2s ease",
                      ...optStyle,
                    }}
                  >
                    {/* Option letter circle */}
                    <span
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 13,
                        fontWeight: 700,
                        background: isCorrect
                          ? COLORS.success
                          : isWrong
                            ? COLORS.error
                            : selectedOption === opt.id
                              ? COLORS.primary
                              : COLORS.border,
                        color:
                          isCorrect || isWrong || selectedOption === opt.id
                            ? "#fff"
                            : COLORS.textMuted,
                        transition: "all 0.2s ease",
                      }}
                    >
                      {isCorrect ? "✓" : isWrong ? "✗" : opt.id.toUpperCase()}
                    </span>
                    <span>{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Explanation after answering */}
            {isAnswered && (
              <div
                style={{
                  padding: "14px 18px",
                  borderRadius: 12,
                  marginBottom: 18,
                  background:
                    selectedOption === MCQ_QUESTIONS[mcqIndex].correctId
                      ? COLORS.successBg
                      : COLORS.orangeTint,
                  border: `1.5px solid ${selectedOption === MCQ_QUESTIONS[mcqIndex].correctId ? COLORS.success : COLORS.orange}20`,
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    lineHeight: 1.7,
                    fontWeight: 500,
                    color: COLORS.textSecondary,
                  }}
                >
                  <strong
                    style={{
                      color:
                        selectedOption === MCQ_QUESTIONS[mcqIndex].correctId
                          ? COLORS.success
                          : COLORS.orange,
                    }}
                  >
                    {selectedOption === MCQ_QUESTIONS[mcqIndex].correctId
                      ? "✓ Correct! "
                      : "✗ Not quite. "}
                  </strong>
                  {MCQ_QUESTIONS[mcqIndex].explanation}
                </p>
              </div>
            )}

            {/* Submit / Next buttons */}
            <div
              style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}
            >
              {!isAnswered ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedOption}
                  style={{
                    height: 40,
                    padding: "0 28px",
                    borderRadius: 20,
                    border: "none",
                    background: selectedOption
                      ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`
                      : COLORS.textDisabled,
                    color: "#fff",
                    cursor: selectedOption ? "pointer" : "not-allowed",
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily: FONT,
                    boxShadow: selectedOption
                      ? "0 4px 14px rgba(74,77,201,0.3)"
                      : "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  Check Answer
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  style={{
                    height: 40,
                    padding: "0 28px",
                    borderRadius: 20,
                    border: "none",
                    background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily: FONT,
                    boxShadow: "0 4px 14px rgba(74,77,201,0.3)",
                    transition: "all 0.2s ease",
                  }}
                >
                  {mcqIndex + 1 >= MCQ_QUESTIONS.length
                    ? "See Results"
                    : "Next Question →"}
                </button>
              )}
            </div>
          </div>
        )}

        {/* ════════ QUIZ COMPLETE ════════ */}
        {mode === "practice" && quizComplete && (
          <div
            style={{
              background: COLORS.bgCard,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 16,
              padding: "32px 24px",
              textAlign: "center" as const,
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                margin: "0 auto 18px",
                background: score >= 4 ? COLORS.successBg : COLORS.orangeTint,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
              }}
            >
              {score >= 4 ? "🎉" : "💪"}
            </div>
            <h3
              style={{
                margin: "0 0 8px",
                fontSize: 22,
                fontWeight: 700,
                color: COLORS.primaryDark,
              }}
            >
              {score >= 4
                ? "Excellent Work!"
                : score >= 3
                  ? "Good Job!"
                  : "Keep Practicing!"}
            </h3>
            <p
              style={{
                margin: "0 0 6px",
                fontSize: 16,
                fontWeight: 600,
                color: COLORS.textSecondary,
              }}
            >
              You scored{" "}
              <span style={{ color: COLORS.primary, fontWeight: 700 }}>
                {score}
              </span>{" "}
              out of{" "}
              <span style={{ color: COLORS.primary, fontWeight: 700 }}>
                {MCQ_QUESTIONS.length}
              </span>
            </p>
            <p
              style={{
                margin: "0 0 24px",
                fontSize: 13,
                color: COLORS.textMuted,
              }}
            >
              {score >= 4
                ? "You have a strong understanding of the parallel line construction!"
                : "Review the Learn mode to strengthen your understanding of the construction steps."}
            </p>

            {/* Score bar */}
            <div
              style={{
                width: "100%",
                maxWidth: 300,
                height: 10,
                borderRadius: 5,
                margin: "0 auto 24px",
                background: COLORS.border,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${(score / MCQ_QUESTIONS.length) * 100}%`,
                  height: "100%",
                  borderRadius: 5,
                  background:
                    score >= 4
                      ? COLORS.success
                      : score >= 3
                        ? COLORS.orange
                        : COLORS.error,
                  transition: "width 0.6s ease",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                onClick={resetPractice}
                style={{
                  height: 40,
                  padding: "0 24px",
                  borderRadius: 20,
                  border: `1.5px solid ${COLORS.primary}`,
                  background: "transparent",
                  color: COLORS.primary,
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: FONT,
                }}
              >
                ↺ Retry Quiz
              </button>
              <button
                onClick={() => {
                  setMode("learn");
                  setCurrentStep(1);
                }}
                style={{
                  height: 40,
                  padding: "0 24px",
                  borderRadius: 20,
                  border: "none",
                  background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: FONT,
                  boxShadow: "0 4px 14px rgba(74,77,201,0.3)",
                }}
              >
                📖 Review Learn Mode
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { ParallelLineConstructor };
export default ParallelLineConstructor;
