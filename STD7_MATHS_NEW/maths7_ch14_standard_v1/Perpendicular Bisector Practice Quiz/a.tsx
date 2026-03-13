// Lightweight local React-style helpers so this file compiles without external 'react'.
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
namespace React {
  export type FC<P = {}> = (props: P) => any;
  export type CSSProperties = Record<string, string | number | undefined>;
}
const React = {};

function useState<S>(
  initial: S | (() => S),
): [S, (value: S | ((prev: S) => S)) => void] {
  const value = typeof initial === "function" ? (initial as () => S)() : initial;
  const setValue = () => {};
  return [value, setValue];
}
function useEffect(_effect: () => void | (() => void), _deps?: any[]): void {}
function useRef<T>(initial: T | null): { current: T | null } {
  return { current: initial };
}
function useCallback<T extends (...args: any[]) => any>(fn: T, _deps: any[]): T {
  return fn;
}

// ─── Types ───

type QuestionType = "mcq" | "true_false" | "diagram_mcq" | "multi_select";

interface Option {
  id: string;
  text: string;
}

interface Question {
  id: number;
  type: QuestionType;
  category: string;
  question: string;
  options: Option[];
  correctIds: string[];
  explanation: string;
  hint: string;
  diagramType?:
    | "standard"
    | "different_radii"
    | "same_side"
    | "error"
    | "90_angle"
    | "equidistant"
    | "rope";
}

// ─── Design System (Singularity) ───

const DS = {
  primary: "#4A4DC9",
  primaryDark: "#533086",
  orange: "#FF7212",
  orangeMid: "#FC9145",
  purpleLight: "#C1C1EA",
  orangeLight: "#FFF3E4",
  gray900: "#4E4E4E",
  gray600: "#777777",
  gray400: "#CACACA",
  gray200: "#EBEBEB",
  gray100: "#F5F5F5",
  white: "#FFFFFF",
  success: "#2E7D32",
  successBg: "#E8F5E9",
  errorRed: "#C62828",
  errorBg: "#FFEBEE",
  infoBg: "#E8EAF6",
  canvasBg: "#FAFAFE",
} as const;

// ─── Questions Bank (Mixed from all 4 challenge areas) ───

const QUESTIONS: Question[] = [
  // --- Q1: Standard Construction (Conceptual) ---
  {
    id: 1,
    type: "mcq",
    category: "Standard Construction",
    question:
      "When constructing the perpendicular bisector of segment XY, why must the compass radius be greater than half of XY?",
    options: [
      { id: "a", text: "So the arcs look bigger and more impressive" },
      {
        id: "b",
        text: "So the arcs from X and Y actually intersect each other",
      },
      { id: "c", text: "So the bisector line becomes longer" },
      { id: "d", text: "It doesn't need to be — any radius works" },
    ],
    correctIds: ["b"],
    explanation:
      "If the radius is less than or equal to half of XY, the arcs from X and Y will not reach each other and won't intersect. The intersection points are needed to define the perpendicular bisector.",
    hint: "Think about what happens when two circles are too far apart relative to their radii.",
  },
  // --- Q2: Standard Construction (Diagram) ---
  {
    id: 2,
    type: "diagram_mcq",
    category: "Standard Construction",
    diagramType: "standard",
    question:
      "In this standard perpendicular bisector construction, what can you say about point O where line AB meets segment XY?",
    options: [
      {
        id: "a",
        text: "O is the midpoint of XY, and AB is perpendicular to XY",
      },
      { id: "b", text: "O is the midpoint of AB, but not necessarily of XY" },
      { id: "c", text: "O divides XY in the ratio 1:2" },
      { id: "d", text: "O is just any random point on XY" },
    ],
    correctIds: ["a"],
    explanation:
      "The perpendicular bisector passes through the midpoint of XY and meets it at 90°. This is proven using triangle congruence: △AOX ≅ △AOY by SAS, which gives OX = OY and ∠AOX = ∠AOY = 90°.",
    hint: "Recall the congruence proof from the textbook — what does △AOX ≅ △AOY tell us?",
  },
  // --- Q3: Different Radii (True/False style MCQ) ---
  {
    id: 3,
    type: "true_false",
    category: "Different Radii",
    question:
      "True or False: When constructing a perpendicular bisector, you MUST use the same radius for the arcs above and below XY.",
    options: [
      { id: "true", text: "True — the same radius is required for both pairs" },
      {
        id: "false",
        text: "False — different radii can be used above and below, as long as each pair uses equal radii from X and Y",
      },
    ],
    correctIds: ["false"],
    explanation:
      "You can use different radii for the pair above and the pair below XY. What matters is that within each pair, the arc from X and the arc from Y use the same radius. This ensures each intersection point is equidistant from X and Y, placing it on the perpendicular bisector.",
    hint: "Any point equidistant from X and Y lies on the perpendicular bisector — does the radius need to be the same for different such points?",
  },
  // --- Q4: Different Radii (Conceptual) ---
  {
    id: 4,
    type: "mcq",
    category: "Different Radii",
    diagramType: "different_radii",
    question:
      "In this construction, radius r₁ is used for arcs above XY and a different radius r₂ is used for arcs below. Why does this still produce the correct perpendicular bisector?",
    options: [
      { id: "a", text: "Because r₁ and r₂ cancel each other out" },
      {
        id: "b",
        text: "Because both intersection points A and B are equidistant from X and Y, so both lie on the perpendicular bisector",
      },
      {
        id: "c",
        text: "Because the perpendicular bisector only depends on the arc above, not below",
      },
      { id: "d", text: "It doesn't — this construction is always wrong" },
    ],
    correctIds: ["b"],
    explanation:
      "Point A (above) satisfies AX = AY = r₁, and point B (below) satisfies BX = BY = r₂. Both are equidistant from X and Y, so both lie on the perpendicular bisector. Two points define a unique line, so joining A and B gives the correct bisector.",
    hint: "What property must a point have to lie on the perpendicular bisector of XY?",
  },
  // --- Q5: Same-Side Arcs ---
  {
    id: 5,
    type: "mcq",
    category: "Same-Side Arcs",
    diagramType: "same_side",
    question:
      "Can both pairs of arcs be drawn on the SAME side of XY to construct the perpendicular bisector?",
    options: [
      {
        id: "a",
        text: "No — you must always have one pair above and one below",
      },
      { id: "b", text: "Yes — but only if both pairs use the same radius" },
      {
        id: "c",
        text: "Yes — use two different radii to get two distinct equidistant points on the same side, then join them",
      },
      { id: "d", text: "Yes — but the resulting line won't be perpendicular" },
    ],
    correctIds: ["c"],
    explanation:
      "Using two different radii on the same side gives two distinct points (P and Q), each equidistant from X and Y. Since two points define a line, joining P and Q gives the perpendicular bisector. You need different radii so that P and Q are distinct points.",
    hint: "If you use the same radius twice on the same side, what happens to the two intersection points?",
  },
  // --- Q6: Same-Side Arcs (Reasoning) ---
  {
    id: 6,
    type: "mcq",
    category: "Same-Side Arcs",
    question:
      "When constructing the perpendicular bisector with both arc pairs on the same side, why must the two pairs use DIFFERENT radii?",
    options: [
      { id: "a", text: "Different radii make the arcs look nicer" },
      {
        id: "b",
        text: "Using the same radius would give the same intersection point twice, so you can't define a line",
      },
      { id: "c", text: "The textbook says so without any reason" },
      {
        id: "d",
        text: "Different radii are needed to make the arcs cross the segment",
      },
    ],
    correctIds: ["b"],
    explanation:
      "If both pairs use the same radius on the same side, their intersection point is identical — you get only one point, not two. You need two distinct points to define a line. Using different radii ensures two distinct equidistant points.",
    hint: "How many points do you need to define a unique line?",
  },
  // --- Q7: Error Detection ---
  {
    id: 7,
    type: "diagram_mcq",
    category: "Error Detection",
    diagramType: "error",
    question:
      "Look at this construction. In the lower pair of arcs, the radius from X is 4.5 cm but the radius from Y is 3.75 cm. What is the problem?",
    options: [
      { id: "a", text: "No problem — different radii within a pair is fine" },
      {
        id: "b",
        text: "The intersection point B' is NOT equidistant from X and Y, so it does not lie on the perpendicular bisector",
      },
      { id: "c", text: "The arcs are too small" },
      { id: "d", text: "The arcs should be drawn on the same side" },
    ],
    correctIds: ["b"],
    explanation:
      "Within each pair, arcs from X and Y must use the SAME radius. If the radius from X ≠ radius from Y, the intersection point satisfies B'X ≠ B'Y, so B' is not equidistant from X and Y. The resulting line through A and B' is NOT the perpendicular bisector.",
    hint: "For a point to lie on the perpendicular bisector, it must be equidistant from X and Y. What does unequal radii do to this?",
  },
  // --- Q8: Congruence Proof ---
  {
    id: 8,
    type: "mcq",
    category: "Proof & Reasoning",
    question:
      "In the proof that AB is the perpendicular bisector of XY, we first show △ABX ≅ △ABY. Which congruence condition is used?",
    options: [
      { id: "a", text: "SAS (Side-Angle-Side)" },
      { id: "b", text: "ASA (Angle-Side-Angle)" },
      { id: "c", text: "SSS (Side-Side-Side)" },
      { id: "d", text: "RHS (Right angle-Hypotenuse-Side)" },
    ],
    correctIds: ["c"],
    explanation:
      "In △ABX and △ABY: AX = AY (equal compass radii), BX = BY (equal compass radii), and AB is common. So by SSS congruence, △ABX ≅ △ABY. This gives ∠XAB = ∠YAB, which is then used to prove △AOX ≅ △AOY by SAS.",
    hint: "List all the sides of △ABX and △ABY. Which sides are equal and why?",
  },
  // --- Q9: 90° Angle Construction ---
  {
    id: 9,
    type: "mcq",
    category: "90° Angle",
    diagramType: "90_angle",
    question:
      "To construct a 90° angle at point O on a line, you first mark points X and Y such that OX = OY. Then you only need arcs on ONE side to get the perpendicular. Why?",
    options: [
      {
        id: "a",
        text: "Because O itself is already one point on the perpendicular bisector of XY",
      },
      {
        id: "b",
        text: "Because 90° angles don't need a full perpendicular bisector",
      },
      { id: "c", text: "Because the arcs below the line are invisible" },
      { id: "d", text: "You actually still need arcs on both sides" },
    ],
    correctIds: ["a"],
    explanation:
      "Since OX = OY, point O is equidistant from X and Y, so O already lies on the perpendicular bisector. You only need one more point (from arcs on one side) to define the perpendicular bisector line through O.",
    hint: "O is the midpoint of XY. Does the midpoint lie on the perpendicular bisector?",
  },
  // --- Q10: Equidistant Property ---
  {
    id: 10,
    type: "mcq",
    category: "Equidistant Property",
    diagramType: "equidistant",
    question:
      "Points C and D both satisfy CX = CY and DX = DY, but with different distances than A and B. Must C and D lie on line AB (the perpendicular bisector)?",
    options: [
      { id: "a", text: "No — they could be anywhere in the plane" },
      {
        id: "b",
        text: "Yes — any point equidistant from X and Y must lie on the unique perpendicular bisector of XY",
      },
      { id: "c", text: "Only if C and D are on opposite sides of XY" },
      { id: "d", text: "Only if CX = AX" },
    ],
    correctIds: ["b"],
    explanation:
      "A line segment has exactly one perpendicular bisector. Any point equidistant from both endpoints must lie on this line. So C and D, being equidistant from X and Y, must lie on line AB. This is why 'eyes of different shapes' can be drawn by choosing different points on the perpendicular bisector.",
    hint: "How many perpendicular bisectors can a line segment have?",
  },
  // --- Q11: Rope Construction (Śulba-Sūtras) ---
  {
    id: 11,
    type: "mcq",
    category: "Rope Construction",
    diagramType: "rope",
    question:
      "In the Kātyāyana-Śulbasūtra rope method, a rope is folded in half and its ends are tied to pegs at X and Y. When the midpoint is pulled taut above XY, why does it land on the perpendicular bisector?",
    options: [
      { id: "a", text: "Because the rope is made of special material" },
      {
        id: "b",
        text: "Because when fully stretched, the midpoint is equidistant from X and Y (each half-rope has the same length)",
      },
      { id: "c", text: "Because the ground is flat" },
      { id: "d", text: "It doesn't — this is just an approximation" },
    ],
    correctIds: ["b"],
    explanation:
      "When the rope midpoint is pulled taut, each half of the rope forms a straight line from the midpoint to X and to Y respectively. Since the rope was folded at its midpoint, both halves are equal in length. So the midpoint A satisfies AX = AY, making it equidistant from X and Y — hence it lies on the perpendicular bisector.",
    hint: "If you fold a rope in half and stretch both halves, what can you say about their lengths?",
  },
  // --- Q12: Multi-select Synthesis ---
  {
    id: 12,
    type: "multi_select",
    category: "Synthesis",
    question:
      "Which of the following are VALID methods to construct the perpendicular bisector of XY? (Select all that apply)",
    options: [
      { id: "a", text: "Equal-radius arcs above and below XY" },
      {
        id: "b",
        text: "Different radii above (r₁) and below (r₂), but within each pair radii from X and Y are equal",
      },
      { id: "c", text: "Both arc pairs on the same side with different radii" },
      { id: "d", text: "Unequal radii from X and Y within the same pair" },
    ],
    correctIds: ["a", "b", "c"],
    explanation:
      "Options A, B, and C are all valid because each produces intersection points that are equidistant from X and Y. Option D is invalid — if the radii from X and Y are unequal within a pair, the intersection is NOT equidistant, and the construction fails.",
    hint: "The key rule: within each pair of arcs, the radius from X must equal the radius from Y.",
  },
];

// ─── Diagram Renderer ───

const DiagramCanvas: React.FC<{ type: string }> = ({ type }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const W = 480,
    H = 280;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";

    // Background
    ctx.fillStyle = DS.canvasBg;
    ctx.fillRect(0, 0, W, H);

    // Dot grid
    ctx.fillStyle = "#E0E0EA";
    for (let gx = 15; gx < W; gx += 15)
      for (let gy = 15; gy < H; gy += 15) {
        ctx.beginPath();
        ctx.arc(gx, gy, 0.6, 0, Math.PI * 2);
        ctx.fill();
      }

    const cY = H / 2;
    const segLen = 220;
    const xX = (W - segLen) / 2;
    const xY = xX + segLen;
    const midX = (xX + xY) / 2;

    // Helper: draw segment
    const drawSeg = () => {
      ctx.beginPath();
      ctx.moveTo(xX, cY);
      ctx.lineTo(xY, cY);
      ctx.strokeStyle = DS.primaryDark;
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.stroke();
      // Points
      [
        { x: xX, l: "X", ox: -18 },
        { x: xY, l: "Y", ox: 10 },
      ].forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, cY, 5, 0, Math.PI * 2);
        ctx.fillStyle = DS.orange;
        ctx.fill();
        ctx.strokeStyle = DS.white;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.font = "600 12px Poppins, sans-serif";
        ctx.fillStyle = DS.gray900;
        ctx.fillText(p.l, p.x + p.ox, cY - 10);
      });
    };

    // Helper: draw arc
    const arc = (
      cx: number,
      cy: number,
      r: number,
      sa: number,
      ea: number,
      color: string,
      lw = 1.8,
    ) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, sa, ea);
      ctx.strokeStyle = color;
      ctx.lineWidth = lw;
      ctx.stroke();
    };

    // Helper: intersection
    const circInt = (
      cx1: number,
      cy1: number,
      r1: number,
      cx2: number,
      cy2: number,
      r2: number,
    ) => {
      const dx = cx2 - cx1,
        dy = cy2 - cy1,
        d = Math.sqrt(dx * dx + dy * dy);
      if (d > r1 + r2 || d < Math.abs(r1 - r2) || d === 0) return [];
      const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
      const h = Math.sqrt(Math.max(0, r1 * r1 - a * a));
      const mx = cx1 + (a * dx) / d,
        my = cy1 + (a * dy) / d;
      return [
        { x: mx + (h * dy) / d, y: my - (h * dx) / d },
        { x: mx - (h * dy) / d, y: my + (h * dx) / d },
      ];
    };

    const drawPt = (
      x: number,
      y: number,
      color: string,
      label: string,
      lox = 8,
      loy = -10,
    ) => {
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.font = "600 11px Poppins, sans-serif";
      ctx.fillStyle = DS.gray900;
      ctx.fillText(label, x + lox, y + loy);
    };

    const drawBisector = (
      p1: { x: number; y: number },
      p2: { x: number; y: number },
    ) => {
      const dx = p2.x - p1.x,
        dy = p2.y - p1.y,
        len = Math.sqrt(dx * dx + dy * dy),
        ext = 30;
      ctx.beginPath();
      ctx.moveTo(p1.x - (dx / len) * ext, p1.y - (dy / len) * ext);
      ctx.lineTo(p2.x + (dx / len) * ext, p2.y + (dy / len) * ext);
      ctx.strokeStyle = DS.success;
      ctx.lineWidth = 2;
      ctx.stroke();
      // Right angle marker
      const sz = 8;
      ctx.beginPath();
      ctx.moveTo(midX + sz, cY);
      ctx.lineTo(midX + sz, cY - sz);
      ctx.lineTo(midX, cY - sz);
      ctx.strokeStyle = DS.success;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    };

    // ── Draw by type ──
    if (type === "standard") {
      drawSeg();
      const r = 140;
      arc(xX, cY, r, -Math.PI * 0.65, -Math.PI * 0.35, DS.primary);
      arc(xY, cY, r, -Math.PI * 0.65, -Math.PI * 0.35, DS.primary);
      arc(xX, cY, r, Math.PI * 0.35, Math.PI * 0.65, DS.primary);
      arc(xY, cY, r, Math.PI * 0.35, Math.PI * 0.65, DS.primary);
      const pts = circInt(xX, cY, r, xY, cY, r);
      const above = pts.find((p) => p.y < cY),
        below = pts.find((p) => p.y > cY);
      if (above) drawPt(above.x, above.y, DS.primary, "A");
      if (below) drawPt(below.x, below.y, DS.primary, "B", 8, 16);
      if (above && below) drawBisector(above, below);
      drawPt(midX, cY, DS.success, "O", 8, 14);
      // Label
      ctx.font = "500 10px Poppins, sans-serif";
      ctx.fillStyle = DS.gray600;
      ctx.fillText("Equal radius r from X and Y", 10, H - 10);
    } else if (type === "different_radii") {
      drawSeg();
      const r1 = 130,
        r2 = 155;
      arc(xX, cY, r1, -Math.PI * 0.7, -Math.PI * 0.3, DS.primary);
      arc(xY, cY, r1, -Math.PI * 0.7, -Math.PI * 0.3, DS.primary);
      arc(xX, cY, r2, Math.PI * 0.3, Math.PI * 0.7, "#7B61FF");
      arc(xY, cY, r2, Math.PI * 0.3, Math.PI * 0.7, "#7B61FF");
      const ptsA = circInt(xX, cY, r1, xY, cY, r1);
      const ptsB = circInt(xX, cY, r2, xY, cY, r2);
      const above = ptsA.find((p) => p.y < cY),
        below = ptsB.find((p) => p.y > cY);
      if (above) drawPt(above.x, above.y, DS.primary, "A");
      if (below) drawPt(below.x, below.y, "#7B61FF", "B", 8, 16);
      if (above && below) drawBisector(above, below);
      ctx.font = "600 10px Poppins, sans-serif";
      ctx.fillStyle = DS.primary;
      ctx.fillText("r₁", midX - 10, cY - r1 * 0.4);
      ctx.fillStyle = "#7B61FF";
      ctx.fillText("r₂", midX - 10, cY + r2 * 0.4 + 12);
      ctx.font = "500 10px Poppins, sans-serif";
      ctx.fillStyle = DS.gray600;
      ctx.fillText(
        "r₁ ≠ r₂ but each pair has equal radii from X and Y",
        10,
        H - 10,
      );
    } else if (type === "same_side") {
      drawSeg();
      const r1 = 125,
        r2 = 160;
      arc(xX, cY, r1, -Math.PI * 0.75, -Math.PI * 0.25, DS.primary);
      arc(xY, cY, r1, -Math.PI * 0.75, -Math.PI * 0.25, DS.primary);
      arc(xX, cY, r2, -Math.PI * 0.8, -Math.PI * 0.2, "#7B61FF");
      arc(xY, cY, r2, -Math.PI * 0.8, -Math.PI * 0.2, "#7B61FF");
      const ptsP = circInt(xX, cY, r1, xY, cY, r1);
      const ptsQ = circInt(xX, cY, r2, xY, cY, r2);
      const P = ptsP.find((p) => p.y < cY),
        Q = ptsQ.find((p) => p.y < cY);
      if (P) drawPt(P.x, P.y, DS.primary, "P");
      if (Q) drawPt(Q.x, Q.y, "#7B61FF", "Q");
      if (P && Q) drawBisector(P, Q);
      ctx.font = "500 10px Poppins, sans-serif";
      ctx.fillStyle = DS.gray600;
      ctx.fillText("Both pairs above XY, with different radii", 10, H - 10);
    } else if (type === "error") {
      drawSeg();
      const r1 = 135;
      arc(xX, cY, r1, -Math.PI * 0.65, -Math.PI * 0.35, DS.primary);
      arc(xY, cY, r1, -Math.PI * 0.65, -Math.PI * 0.35, DS.primary);
      const r2X = 145,
        r2Y = 115; // ERROR
      arc(xX, cY, r2X, Math.PI * 0.3, Math.PI * 0.7, DS.errorRed);
      arc(xY, cY, r2Y, Math.PI * 0.3, Math.PI * 0.7, DS.errorRed);
      const ptsA = circInt(xX, cY, r1, xY, cY, r1);
      const above = ptsA.find((p) => p.y < cY);
      if (above) drawPt(above.x, above.y, DS.primary, "A");
      const ptsB = circInt(xX, cY, r2X, xY, cY, r2Y);
      const below = ptsB.find((p) => p.y > cY);
      if (below) drawPt(below.x, below.y, DS.errorRed, "B'", 8, 16);
      if (above && below) {
        ctx.beginPath();
        ctx.setLineDash([6, 5]);
        ctx.moveTo(above.x, above.y - 20);
        ctx.lineTo(below.x, below.y + 20);
        ctx.strokeStyle = DS.errorRed + "88";
        ctx.lineWidth = 1.8;
        ctx.stroke();
        ctx.setLineDash([]);
      }
      ctx.font = "600 10px Poppins, sans-serif";
      ctx.fillStyle = DS.primary;
      ctx.fillText("r₁ = r₁ ✓", xX - 5, cY - r1 * 0.45 - 6);
      ctx.fillStyle = DS.errorRed;
      ctx.fillText("r₂ ≠ r₂ ✗", xX - 5, cY + r2X * 0.45 + 16);
      ctx.font = "500 10px Poppins, sans-serif";
      ctx.fillStyle = DS.gray600;
      ctx.fillText("ERROR: Unequal radii in lower pair", 10, H - 10);
    } else if (type === "90_angle") {
      const oX = W / 2;
      ctx.beginPath();
      ctx.moveTo(60, cY);
      ctx.lineTo(W - 60, cY);
      ctx.strokeStyle = DS.gray400;
      ctx.lineWidth = 2;
      ctx.stroke();
      // O
      ctx.beginPath();
      ctx.arc(oX, cY, 5, 0, Math.PI * 2);
      ctx.fillStyle = DS.orange;
      ctx.fill();
      ctx.font = "600 12px Poppins, sans-serif";
      ctx.fillStyle = DS.gray900;
      ctx.fillText("O", oX - 4, cY + 18);
      // X and Y
      const half = 80;
      [
        { x: oX - half, l: "X" },
        { x: oX + half, l: "Y" },
      ].forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, cY, 4, 0, Math.PI * 2);
        ctx.fillStyle = DS.primaryDark;
        ctx.fill();
        ctx.fillText(p.l, p.x - 4, cY + 18);
      });
      // Arcs above only
      const r = 105;
      arc(oX - half, cY, r, -Math.PI * 0.7, -Math.PI * 0.3, DS.primary);
      arc(oX + half, cY, r, -Math.PI * 0.7, -Math.PI * 0.3, DS.primary);
      const pts = circInt(oX - half, cY, r, oX + half, cY, r);
      const above = pts.find((p) => p.y < cY);
      if (above) {
        drawPt(above.x, above.y, DS.primary, "A");
        ctx.beginPath();
        ctx.moveTo(oX, cY);
        ctx.lineTo(above.x, above.y - 15);
        ctx.strokeStyle = DS.success;
        ctx.lineWidth = 2;
        ctx.stroke();
        const sz = 8;
        ctx.beginPath();
        ctx.moveTo(oX + sz, cY);
        ctx.lineTo(oX + sz, cY - sz);
        ctx.lineTo(oX, cY - sz);
        ctx.strokeStyle = DS.success;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      ctx.font = "500 10px Poppins, sans-serif";
      ctx.fillStyle = DS.gray600;
      ctx.fillText(
        "Only arcs above needed — O is already on the bisector",
        10,
        H - 10,
      );
    } else if (type === "equidistant") {
      drawSeg();
      const radii = [120, 145, 100, 170];
      const colors = [DS.primary, "#7B61FF", DS.orangeMid, DS.primaryDark];
      const labels = ["A", "B", "C", "D"];
      radii.forEach((r, i) => {
        const pts = circInt(xX, cY, r, xY, cY, r);
        const pt =
          i < 2 ? pts.find((p) => p.y < cY) : pts.find((p) => p.y > cY);
        if (pt)
          drawPt(
            pt.x,
            pt.y,
            colors[i],
            labels[i],
            i < 2 ? 8 : 8,
            i < 2 ? -10 : 16,
          );
      });
      // Bisector line
      ctx.beginPath();
      ctx.moveTo(midX, 20);
      ctx.lineTo(midX, H - 20);
      ctx.strokeStyle = DS.success;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = "500 10px Poppins, sans-serif";
      ctx.fillStyle = DS.gray600;
      ctx.fillText(
        "All equidistant points lie on the same perpendicular bisector",
        10,
        H - 10,
      );
    } else if (type === "rope") {
      drawSeg();
      // Rope triangle above
      const rLen = 150;
      const pts = circInt(xX, cY, rLen, xY, cY, rLen);
      const above = pts.find((p) => p.y < cY);
      if (above) {
        ctx.beginPath();
        ctx.moveTo(xX, cY);
        ctx.lineTo(above.x, above.y);
        ctx.lineTo(xY, cY);
        ctx.strokeStyle = DS.orangeMid;
        ctx.lineWidth = 2.5;
        ctx.setLineDash([]);
        ctx.stroke();
        drawPt(above.x, above.y, DS.orange, "A (midpoint)");
        // Label rope halves
        ctx.font = "500 10px Poppins, sans-serif";
        ctx.fillStyle = DS.orangeMid;
        const mx1 = (xX + above.x) / 2,
          my1 = (cY + above.y) / 2;
        ctx.fillText("half rope", mx1 - 25, my1 - 5);
        const mx2 = (xY + above.x) / 2,
          my2 = (cY + above.y) / 2;
        ctx.fillText("half rope", mx2 + 5, my2 - 5);
      }
      ctx.font = "500 10px Poppins, sans-serif";
      ctx.fillStyle = DS.gray600;
      ctx.fillText("Rope folded in half — midpoint pulled taut", 10, H - 10);
    }
  }, [type]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        borderRadius: 12,
        border: `2px solid ${DS.gray200}`,
        display: "block",
        width: W,
        maxWidth: "100%",
        background: DS.canvasBg,
        margin: "0 auto",
      }}
    />
  );
};

// ─── Button Component ───

const Btn: React.FC<{
  label: string;
  onClick: () => void;
  variant?: "contained" | "outlined" | "text" | "highlight";
  disabled?: boolean;
  flex?: number;
}> = ({ label, onClick, variant = "contained", disabled = false, flex }) => {
  const base: React.CSSProperties = {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 600,
    fontSize: 13,
    borderRadius: 24,
    padding: "10px 24px",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s ease",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    justifyContent: "center",
    flex: flex ?? "unset",
    opacity: disabled ? 0.45 : 1,
    border: "none",
    outline: "none",
  };
  const styles: Record<string, React.CSSProperties> = {
    contained: { ...base, background: DS.primary, color: DS.white },
    outlined: {
      ...base,
      background: "transparent",
      color: DS.primary,
      border: `2px solid ${DS.primary}`,
    },
    text: { ...base, background: "transparent", color: DS.primary },
    highlight: { ...base, background: DS.orange, color: DS.white },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={styles[variant]}>
      {label}
    </button>
  );
};

// ─── Main Quiz Component ───

const PerpendicularBisectorQuiz: React.FC = () => {
  const [qIdx, setQIdx] = useState<number>(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [hintShown, setHintShown] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(
    new Set(),
  );
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const q: Question = QUESTIONS[qIdx];
  const total: number = QUESTIONS.length;

  const toggleOption = (id: string): void => {
    if (submitted) return;
    const next = new Set(selected);
    if (q.type === "multi_select") {
      next.has(id) ? next.delete(id) : next.add(id);
    } else {
      next.clear();
      next.add(id);
    }
    setSelected(next);
  };

  const handleSubmit = (): void => {
    if (selected.size === 0) return;
    const correct =
      selected.size === q.correctIds.length &&
      q.correctIds.every((cid) => selected.has(cid));
    setSubmitted(true);
    setIsCorrect(correct);
    if (correct && !answeredCorrectly.has(q.id)) {
      setScore((s) => s + 1);
      setAnsweredCorrectly((prev) => new Set(prev).add(q.id));
    }
  };

  const goNext = (): void => {
    if (qIdx < total - 1) {
      setQIdx(qIdx + 1);
      setSelected(new Set());
      setSubmitted(false);
      setIsCorrect(false);
      setHintShown(false);
    } else {
      setQuizFinished(true);
    }
  };

  const goPrev = (): void => {
    if (qIdx > 0) {
      setQIdx(qIdx - 1);
      setSelected(new Set());
      setSubmitted(false);
      setIsCorrect(false);
      setHintShown(false);
    }
  };

  const restartQuiz = (): void => {
    setQIdx(0);
    setSelected(new Set());
    setSubmitted(false);
    setIsCorrect(false);
    setHintShown(false);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setQuizFinished(false);
  };

  const pct: number = Math.round((score / total) * 100);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(170deg, ${DS.gray100} 0%, #EEEDF6 40%, ${DS.orangeLight} 100%)`,
        fontFamily: "'Poppins', sans-serif",
        color: DS.gray900,
        padding: "28px 16px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .fadeUp { animation: fadeUp 0.35s ease-out; }
        @keyframes celebrate { 0% { transform:scale(0.8);opacity:0; } 50% { transform:scale(1.05); } 100% { transform:scale(1);opacity:1; } }
        .celebrate { animation: celebrate 0.5s ease-out; }
        @keyframes pop { 0% { transform:scale(0.95); } 50% { transform:scale(1.02); } 100% { transform:scale(1); } }
        .pop { animation: pop 0.25s ease-out; }
      `}</style>

      <div style={{ maxWidth: 640, width: "100%" }}>
        {/* Header */}
        <div
          style={{ textAlign: "center", marginBottom: 20 }}
          className="fadeUp"
        >
          <div
            style={{
              display: "inline-block",
              padding: "5px 16px",
              background: `linear-gradient(135deg, ${DS.primary}, ${DS.primaryDark})`,
              borderRadius: 20,
              fontSize: 11,
              color: DS.white,
              letterSpacing: 1.5,
              fontWeight: 600,
              marginBottom: 10,
            }}
          >
            GEOMETRY · GRADE 7 · CHAPTER 6
          </div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: DS.primaryDark,
              lineHeight: 1.3,
            }}
          >
            Perpendicular Bisector Quiz
          </h1>
          <p
            style={{
              color: DS.gray600,
              fontSize: 13,
              marginTop: 4,
              fontWeight: 400,
            }}
          >
            {total} questions · Mixed MCQ · Conceptual + Visual + Reasoning
          </p>
        </div>

        {/* Score Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 16,
            padding: "10px 16px",
            background: DS.white,
            borderRadius: 14,
            border: `1px solid ${DS.gray200}`,
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 600, color: DS.primary }}>
            Score: {score}/{total}
          </div>
          <div
            style={{
              flex: 1,
              height: 6,
              background: DS.gray200,
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${pct}%`,
                height: "100%",
                background: `linear-gradient(90deg, ${DS.primary}, ${DS.primaryDark})`,
                borderRadius: 3,
                transition: "width 0.4s ease",
              }}
            />
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, color: DS.primaryDark }}>
            {pct}%
          </div>
        </div>

        {/* Progress dots */}
        <div
          style={{
            display: "flex",
            gap: 4,
            marginBottom: 16,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {QUESTIONS.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === qIdx ? 24 : 8,
                height: 8,
                borderRadius: 4,
                transition: "all 0.3s",
                background: answeredCorrectly.has(QUESTIONS[i].id)
                  ? DS.success
                  : i === qIdx
                    ? DS.primary
                    : i < qIdx
                      ? DS.purpleLight
                      : DS.gray200,
              }}
            />
          ))}
        </div>

        {/* ── Quiz Finished ── */}
        {quizFinished ? (
          <div
            className="celebrate"
            style={{
              background: DS.white,
              borderRadius: 20,
              border: `1px solid ${DS.gray200}`,
              padding: 32,
              textAlign: "center",
              boxShadow: "0 4px 24px rgba(74,77,201,0.08)",
            }}
          >
            <div style={{ fontSize: 56, marginBottom: 12 }}>
              {pct >= 80 ? "🏆" : pct >= 50 ? "👏" : "📚"}
            </div>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: pct >= 80 ? DS.success : DS.primaryDark,
              }}
            >
              {pct >= 80
                ? "Excellent!"
                : pct >= 50
                  ? "Good Effort!"
                  : "Keep Practicing!"}
            </h2>
            <div
              style={{
                fontSize: 36,
                fontWeight: 700,
                color: DS.primary,
                margin: "16px 0",
              }}
            >
              {score} / {total}
            </div>
            <p
              style={{
                fontSize: 14,
                color: DS.gray600,
                marginBottom: 24,
                lineHeight: 1.6,
              }}
            >
              {pct >= 80
                ? "You've demonstrated strong understanding of perpendicular bisector constructions."
                : pct >= 50
                  ? "You have a good foundation — review the explanations for questions you missed."
                  : "Review the textbook sections on perpendicular bisector construction and try again!"}
            </p>
            {/* Category breakdown */}
            <div style={{ textAlign: "left", marginBottom: 24 }}>
              {[
                "Standard Construction",
                "Different Radii",
                "Same-Side Arcs",
                "Error Detection",
                "Proof & Reasoning",
                "90° Angle",
                "Equidistant Property",
                "Rope Construction",
                "Synthesis",
              ].map((cat) => {
                const catQs = QUESTIONS.filter((q) => q.category === cat);
                if (catQs.length === 0) return null;
                const catCorrect = catQs.filter((q) =>
                  answeredCorrectly.has(q.id),
                ).length;
                return (
                  <div
                    key={cat}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "8px 12px",
                      marginBottom: 4,
                      borderRadius: 8,
                      background: DS.gray100,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: DS.gray900,
                        flex: 1,
                      }}
                    >
                      {cat}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color:
                          catCorrect === catQs.length ? DS.success : DS.orange,
                      }}
                    >
                      {catCorrect}/{catQs.length}
                    </span>
                  </div>
                );
              })}
            </div>
            <Btn
              label="Restart Quiz"
              onClick={restartQuiz}
              variant="contained"
            />
          </div>
        ) : (
          /* ── Question Card ── */
          <div
            className="fadeUp"
            key={q.id}
            style={{
              background: DS.white,
              borderRadius: 20,
              border: `1px solid ${DS.gray200}`,
              overflow: "hidden",
              boxShadow: "0 4px 24px rgba(74,77,201,0.08)",
            }}
          >
            {/* Question Header */}
            <div
              style={{
                padding: "16px 24px 12px",
                background: `linear-gradient(135deg, ${DS.primary}08, ${DS.orangeLight})`,
                borderBottom: `1px solid ${DS.gray200}`,
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
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: DS.primary,
                    color: DS.white,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  {qIdx + 1}
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: DS.orange,
                    letterSpacing: 0.5,
                    background: DS.orangeLight,
                    padding: "2px 10px",
                    borderRadius: 10,
                  }}
                >
                  {q.category}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: DS.gray400,
                    marginLeft: "auto",
                  }}
                >
                  {q.type === "multi_select"
                    ? "Select all that apply"
                    : q.type === "true_false"
                      ? "True / False"
                      : "Choose one"}
                </span>
              </div>
              <p
                style={{
                  fontSize: 15,
                  color: DS.gray900,
                  lineHeight: 1.6,
                  fontWeight: 500,
                }}
              >
                {q.question}
              </p>
            </div>

            {/* Diagram */}
            {q.diagramType && (
              <div
                style={{
                  padding: "14px 16px",
                  background: DS.gray100,
                  borderBottom: `1px solid ${DS.gray200}`,
                }}
              >
                <DiagramCanvas type={q.diagramType} />
              </div>
            )}

            {/* Options */}
            <div style={{ padding: "16px 24px" }}>
              {q.options.map((opt: Option) => {
                const isSel = selected.has(opt.id);
                const isCorr = q.correctIds.includes(opt.id);
                let bg: string = DS.gray100;
                let border: string = DS.gray200;
                let textColor: string = DS.gray900;
                let weight = 400;

                if (submitted) {
                  if (isCorr) {
                    bg = DS.successBg;
                    border = DS.success;
                    textColor = DS.success;
                    weight = 600;
                  } else if (isSel && !isCorr) {
                    bg = DS.errorBg;
                    border = DS.errorRed;
                    textColor = DS.errorRed;
                    weight = 600;
                  }
                } else if (isSel) {
                  bg = DS.purpleLight + "33";
                  border = DS.primary;
                  weight = 600;
                }

                return (
                  <div
                    key={opt.id}
                    onClick={() => toggleOption(opt.id)}
                    className={isSel && !submitted ? "pop" : ""}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                      padding: "12px 16px",
                      marginBottom: 8,
                      borderRadius: 12,
                      background: bg,
                      border: `2px solid ${border}`,
                      cursor: submitted ? "default" : "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {/* Radio / Checkbox */}
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: q.type === "multi_select" ? 6 : "50%",
                        border: `2px solid ${submitted && isCorr ? DS.success : submitted && isSel && !isCorr ? DS.errorRed : isSel ? DS.primary : DS.gray400}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: 1,
                        background:
                          submitted && isCorr
                            ? DS.success
                            : submitted && isSel && !isCorr
                              ? DS.errorRed
                              : "transparent",
                        transition: "all 0.2s",
                      }}
                    >
                      {(isSel || (submitted && isCorr)) && (
                        <span
                          style={{
                            color: submitted ? DS.white : DS.primary,
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          {submitted
                            ? isCorr
                              ? "✓"
                              : isSel
                                ? "✗"
                                : ""
                            : q.type === "multi_select"
                              ? "✓"
                              : "●"}
                        </span>
                      )}
                    </div>
                    {/* Label */}
                    <div style={{ flex: 1 }}>
                      <span
                        style={{
                          fontSize: 13,
                          color: textColor,
                          lineHeight: 1.5,
                          fontWeight: weight,
                        }}
                      >
                        {opt.text}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Explanation (shown after submit) */}
            {submitted && (
              <div
                className="fadeUp"
                style={{
                  margin: "0 24px 14px",
                  padding: "14px 18px",
                  borderRadius: 12,
                  background: isCorrect ? DS.successBg : DS.errorBg,
                  border: `1px solid ${isCorrect ? DS.success + "44" : DS.errorRed + "44"}`,
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: isCorrect ? DS.success : DS.errorRed,
                    marginBottom: 6,
                  }}
                >
                  {isCorrect ? "✓ Correct!" : "✗ Not quite right"}
                </div>
                <p
                  style={{
                    fontSize: 13,
                    color: DS.gray900,
                    lineHeight: 1.6,
                    fontWeight: 400,
                  }}
                >
                  {q.explanation}
                </p>
              </div>
            )}

            {/* Hint */}
            {!submitted && (
              <div style={{ padding: "0 24px 12px" }}>
                {hintShown ? (
                  <div
                    style={{
                      padding: "10px 16px",
                      borderRadius: 10,
                      background: DS.orangeLight,
                      border: `1px solid ${DS.orangeMid}33`,
                      fontSize: 12,
                      color: DS.gray900,
                      lineHeight: 1.5,
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        color: DS.orange,
                        marginRight: 6,
                      }}
                    >
                      💡 Hint:
                    </span>
                    {q.hint}
                  </div>
                ) : (
                  <button
                    onClick={() => setHintShown(true)}
                    style={{
                      background: "none",
                      border: "none",
                      color: DS.orange,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "'Poppins', sans-serif",
                      padding: 0,
                    }}
                  >
                    💡 Show Hint
                  </button>
                )}
              </div>
            )}

            {/* Actions */}
            <div
              style={{
                padding: "14px 24px 18px",
                display: "flex",
                gap: 10,
                borderTop: `1px solid ${DS.gray200}`,
              }}
            >
              {qIdx > 0 && !submitted && (
                <Btn label="← Previous" onClick={goPrev} variant="text" />
              )}
              <div style={{ flex: 1 }} />
              {!submitted ? (
                <Btn
                  label="Check Answer"
                  onClick={handleSubmit}
                  variant="highlight"
                  disabled={selected.size === 0}
                />
              ) : (
                <Btn
                  label={qIdx < total - 1 ? "Next Question →" : "See Results"}
                  onClick={goNext}
                  variant="contained"
                />
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            marginTop: 24,
            fontSize: 11,
            color: DS.gray900,
            opacity: 0.4,
            fontWeight: 500,
          }}
        >
          Ganita Prakash · Grade 7 · Constructions and Tilings
        </div>
      </div>
    </div>
  );
};

export default PerpendicularBisectorQuiz;
