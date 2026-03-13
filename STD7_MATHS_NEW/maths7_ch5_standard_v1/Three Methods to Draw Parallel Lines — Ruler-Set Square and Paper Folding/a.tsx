/** Self-contained (no external React/icon imports) for typecheck without @types/react. */
declare const React: any;
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
    interface Element {}
    interface ElementChildrenAttribute {
      children: {};
    }
  }
}

const { useState, useEffect, useRef, useCallback } = React;

type IconProps = { size?: number; style?: any; color?: string; [key: string]: any };
const IconBase = ({ size = 16, style, color, children }: IconProps & { children?: any }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color ?? "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true" focusable="false">
    {children}
  </svg>
);
const ChevronLeft = (p: IconProps) => <IconBase {...p}><path d="M15 18l-6-6 6-6" /></IconBase>;
const ChevronRight = (p: IconProps) => <IconBase {...p}><path d="M9 18l6-6-6-6" /></IconBase>;
const RotateCcw = (p: IconProps) => <IconBase {...p}><path d="M3 2v6h6" /><path d="M3.5 13a9 9 0 1 0 2-5.7L3 8" /></IconBase>;
const Check = (p: IconProps) => <IconBase {...p}><path d="M20 6L9 17l-5-5" /></IconBase>;
const X = (p: IconProps) => <IconBase {...p}><path d="M18 6L6 18" /><path d="M6 6l12 12" /></IconBase>;
const BookOpen = (p: IconProps) => <IconBase {...p}><path d="M12 19c-2.5-1.6-5-2-8-2V5c3 0 5.5.4 8 2" /><path d="M12 19c2.5-1.6 5-2 8-2V5c-3 0-5.5.4-8 2" /></IconBase>;
const Target = (p: IconProps) => <IconBase {...p}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M22 12h-2" /><path d="M12 22v-2" /><path d="M2 12h2" /></IconBase>;

/* ═══ Singularity Design Tokens ═══ */
const P = "#4A4DC9";
const A = "#FF7212";
const GF = "#533086";
const GT = "#FC9145";
const LAV = "#C1C1EA";
const PEACH = "#FFF3E4";
const G9 = "#4E4E4E";
const G4 = "#CACACA";
const G2 = "#EBEBEB";
const G1 = "#F5F5F5";
const W = "#FFFFFF";
const OK = "#2ECC71";
const NO = "#E74C3C";
const FNT = '"Poppins", sans-serif';

/* ═══ Data ═══ */
type LearnStep = { id: number; title: string; desc: string };
type McqItem = { q: string; opts: string[]; ans: number; exp: string; fig: string };

const LEARN_RULER: LearnStep[] = [
  {
    id: 1,
    title: "Draw Line l with a Ruler",
    desc: "Draw a straight horizontal line l using your ruler. This base line is where we begin. The ruler will later act as the transversal.",
  },
  {
    id: 2,
    title: "Place the Set Square on Line l",
    desc: "Place the set square with its right-angle edge on line l. Press the ruler firmly against the hypotenuse. See the 90° angle at the base.",
  },
  {
    id: 3,
    title: "Slide the Set Square Along the Ruler",
    desc: "Keep the ruler fixed and slide the set square upward to a new position. The dotted trail shows its path. The angle stays the same!",
  },
  {
    id: 4,
    title: "Draw Line m — Parallel!",
    desc: "Draw line m along the short edge at its new position. Both lines make 90° with the ruler. Equal corresponding angles → Parallel lines!",
  },
];
const LEARN_PAPER: LearnStep[] = [
  {
    id: 5,
    title: "Line l and Point A",
    desc: "Line l is on the paper. Point A is above it. Goal: make a line through A parallel to l using only folds.",
  },
  {
    id: 6,
    title: "Fold Crease t ⊥ l through A",
    desc: "Fold so the crease passes through A perpendicular to l. This creates crease t with a 90° angle where it meets l.",
  },
  {
    id: 7,
    title: "Fold Line m ⊥ t through A",
    desc: "Fold again: crease m through A perpendicular to t. Both l and m are ⊥ to t, so l ∥ m!",
  },
];
const MCQS: McqItem[] = [
  {
    q: "Why slide the set square along the ruler?",
    opts: [
      "To make lines neat",
      "To ensure equal 90° corresponding angles",
      "To measure distance",
      "To draw same length",
    ],
    ans: 1,
    exp: "Sliding ensures both lines form 90° with the ruler. Equal corresponding angles = parallel!",
    fig: "sq",
  },
  {
    q: "l ⊥ t and m ⊥ t. What about l and m?",
    opts: ["Perpendicular", "Intersecting", "Parallel", "45° angle"],
    ans: 2,
    exp: "Two lines perpendicular to the same line are always parallel. l ⊥ t and m ⊥ t → l ∥ m.",
    fig: "pf",
  },
  {
    q: "Corresponding angles are both 90°. The lines are?",
    opts: ["Intersecting", "Perpendicular", "Parallel", "Vertically opposite"],
    ans: 2,
    exp: "Equal corresponding angles formed by a transversal means the lines are parallel!",
    fig: "sq",
  },
  {
    q: "Which tool is the transversal?",
    opts: ["Set square", "Pencil", "Ruler", "Protractor"],
    ans: 2,
    exp: "The ruler crosses both lines — it's the transversal. The set square slides along it.",
    fig: "sq",
  },
  {
    q: "How many folds for the paper method?",
    opts: ["One", "Two", "Three", "Four"],
    ans: 1,
    exp: "Two folds: first makes t ⊥ l, second makes m ⊥ t. Both ⊥ to t → parallel.",
    fig: "pf",
  },
];

const ease = (t) => 1 - Math.pow(1 - t, 3);
const easeIO = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/* ═══ Canvas Drawing Functions ═══ */
function drawAngle90(ctx, x, y, s, up) {
  ctx.save();
  ctx.strokeStyle = A;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  if (up) {
    ctx.moveTo(x + s, y);
    ctx.lineTo(x + s, y + s);
    ctx.lineTo(x, y + s);
  } else {
    ctx.moveTo(x + s, y);
    ctx.lineTo(x + s, y - s);
    ctx.lineTo(x, y - s);
  }
  ctx.stroke();
  ctx.restore();
}

function drawArrows(ctx, x, y) {
  ctx.save();
  ctx.fillStyle = P;
  for (let d = 0; d < 2; d++) {
    const o = d * 9;
    ctx.beginPath();
    ctx.moveTo(x + o, y - 5);
    ctx.lineTo(x + o + 8, y);
    ctx.lineTo(x + o, y + 5);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function drawTriangle(ctx, x, by, sz, alpha, color, glow) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = LAV + "50";
  ctx.beginPath();
  ctx.moveTo(x, by);
  ctx.lineTo(x, by - sz);
  ctx.lineTo(x + sz * 0.72, by);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(x, by);
  ctx.lineTo(x, by - sz);
  ctx.lineTo(x + sz * 0.72, by);
  ctx.closePath();
  ctx.stroke();
  if (glow) {
    ctx.shadowColor = color;
    ctx.shadowBlur = 14;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
  ctx.font = "600 7px Poppins, sans-serif";
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.fillText("Set Sq.", x + sz * 0.22, by - sz * 0.3);
  ctx.restore();
}

function renderRulerStep(ctx, W, H, step, progress) {
  const cw = W,
    ch = H;
  ctx.clearRect(0, 0, cw, ch);
  ctx.fillStyle = G1;
  ctx.fillRect(0, 0, cw, ch);

  // grid
  ctx.strokeStyle = LAV + "15";
  ctx.lineWidth = 0.5;
  for (let i = 0; i < cw; i += 20) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, ch);
    ctx.stroke();
  }
  for (let j = 0; j < ch; j += 20) {
    ctx.beginPath();
    ctx.moveTo(0, j);
    ctx.lineTo(cw, j);
    ctx.stroke();
  }

  const y1 = ch * 0.72,
    y2 = ch * 0.28;
  const ll = cw * 0.7,
    lx = (cw - ll) / 2,
    rx = lx + ll,
    cx = cw / 2;
  const rX = cx,
    rW = 22,
    rTop = y2 - 30,
    rBot = y1 + 30;
  const sqSz = 55;
  const p = ease(Math.min(progress, 1));

  // Step 1+: Line l
  if (step >= 1) {
    const lp = step === 1 ? p : 1;
    ctx.strokeStyle = G9;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(lx, y1);
    ctx.lineTo(lx + ll * lp, y1);
    ctx.stroke();
    if (lp > 0.8) {
      ctx.globalAlpha = (lp - 0.8) * 5;
      ctx.font = "600 italic 16px Poppins, sans-serif";
      ctx.fillStyle = G9;
      ctx.textAlign = "left";
      ctx.fillText("l", rx + 12, y1 + 6);
      ctx.globalAlpha = 1;
    }
  }

  // Step 2+: Ruler + Set Square
  if (step >= 2) {
    const rp = step === 2 ? p : 1;
    const rH = (rBot - rTop) * rp;
    // Ruler (orange gradient)
    const rg = ctx.createLinearGradient(rX - rW / 2, 0, rX + rW / 2, 0);
    rg.addColorStop(0, A);
    rg.addColorStop(1, "#E06A10");
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.roundRect(rX - rW / 2, rTop, rW, rH, 4);
    ctx.fill();
    // ticks
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.lineWidth = 0.5;
    for (let t = 0; t < rH; t += 8) {
      const tw = t % 32 === 0 ? 7 : 3;
      ctx.beginPath();
      ctx.moveTo(rX - rW / 2, rTop + t);
      ctx.lineTo(rX - rW / 2 + tw, rTop + t);
      ctx.stroke();
    }
    // label
    if (rp > 0.6) {
      ctx.globalAlpha = (rp - 0.6) * 2.5;
      ctx.save();
      ctx.font = "600 8px Poppins, sans-serif";
      ctx.fillStyle = A;
      ctx.translate(rX + rW / 2 + 14, (rTop + rBot) / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = "center";
      ctx.fillText("Ruler (transversal)", 0, 0);
      ctx.restore();
      ctx.globalAlpha = 1;
    }
    // Set square at position 1
    const sa = step === 2 ? Math.min(p * 1.3, 1) : 1;
    drawTriangle(ctx, rX - sqSz * 0.72, y1, sqSz, sa, P, step === 2);
    if (sa > 0.5) {
      ctx.globalAlpha = (sa - 0.5) * 2;
      drawAngle90(ctx, rX - 1, y1, 12, false);
      ctx.globalAlpha = 1;
    }
  }

  // Step 3: Slide
  if (step >= 3) {
    const sp = step === 3 ? easeIO(Math.min(progress, 1)) : 1;
    const curY = y1 + (y2 - y1) * sp;
    // trail
    if (step === 3 && sp < 1) {
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = P + "35";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(rX - sqSz * 0.36, y1 - sqSz * 0.5);
      ctx.lineTo(rX - sqSz * 0.36, curY - sqSz * 0.5);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    drawTriangle(ctx, rX - sqSz * 0.72, curY, sqSz, 1, P, step === 3);
    // ghost
    if (step === 3 && sp > 0.05) {
      drawTriangle(ctx, rX - sqSz * 0.72, y1, sqSz, 0.12, P, false);
    }
  }

  // Step 4: Line m + labels
  if (step >= 4) {
    const mp = step === 4 ? p : 1;
    ctx.strokeStyle = P;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(lx, y2);
    ctx.lineTo(lx + ll * mp, y2);
    ctx.stroke();
    if (mp > 0.6) {
      ctx.globalAlpha = (mp - 0.6) * 2.5;
      ctx.font = "600 italic 16px Poppins, sans-serif";
      ctx.fillStyle = P;
      ctx.textAlign = "left";
      ctx.fillText("m", rx + 12, y2 + 6);
      ctx.globalAlpha = 1;
    }
    if (mp > 0.4) {
      ctx.globalAlpha = (mp - 0.4) * 2;
      drawAngle90(ctx, rX - 1, y2, 12, false);
      ctx.globalAlpha = 1;
    }
    if (mp > 0.65) {
      ctx.globalAlpha = (mp - 0.65) * 2.8;
      drawArrows(ctx, cx + 40, y1);
      drawArrows(ctx, cx + 40, y2);
      ctx.globalAlpha = 1;
    }
    if (mp > 0.8) {
      ctx.globalAlpha = Math.min((mp - 0.8) * 5, 1);
      const txt = "90° = 90° → l ∥ m (Parallel!)";
      ctx.font = "700 12px Poppins, sans-serif";
      const tw = ctx.measureText(txt).width;
      const bx = cx - tw / 2 - 14,
        by = (y1 + y2) / 2 - 12;
      ctx.fillStyle = LAV + "35";
      ctx.beginPath();
      ctx.roundRect(bx, by, tw + 28, 26, 10);
      ctx.fill();
      ctx.strokeStyle = P + "30";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(bx, by, tw + 28, 26, 10);
      ctx.stroke();
      ctx.fillStyle = P;
      ctx.textAlign = "center";
      ctx.fillText(txt, cx, by + 18);
      ctx.globalAlpha = 1;
    }
  }
}

function renderPaperStep(ctx, W, H, step, progress) {
  const cw = W,
    ch = H;
  ctx.clearRect(0, 0, cw, ch);
  ctx.fillStyle = PEACH + "90";
  ctx.fillRect(0, 0, cw, ch);
  // paper grain
  ctx.strokeStyle = "#00000006";
  ctx.lineWidth = 0.3;
  for (let i = 0; i < cw; i += 6) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, ch);
    ctx.stroke();
  }
  for (let j = 0; j < ch; j += 6) {
    ctx.beginPath();
    ctx.moveTo(0, j);
    ctx.lineTo(cw, j);
    ctx.stroke();
  }

  const cx = cw / 2,
    ly = ch * 0.7,
    ll = cw * 0.66;
  const lx = cx - ll / 2,
    xr = cx + ll / 2;
  const aX = cx,
    aY = ch * 0.28;
  const p = ease(Math.min(progress, 1));

  // Step 5+: line l + point A
  if (step >= 5) {
    const lp = step === 5 ? p : 1;
    ctx.strokeStyle = G9;
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(lx, ly);
    ctx.lineTo(lx + ll * lp, ly);
    ctx.stroke();
    if (lp > 0.7) {
      ctx.globalAlpha = (lp - 0.7) * 3.3;
      ctx.font = "600 italic 16px Poppins, sans-serif";
      ctx.fillStyle = G9;
      ctx.textAlign = "left";
      ctx.fillText("l", xr + 10, ly + 6);
      ctx.globalAlpha = 1;
    }
    if (lp > 0.4) {
      const ap = Math.min((lp - 0.4) * 1.7, 1);
      ctx.globalAlpha = ap;
      ctx.fillStyle = A;
      ctx.beginPath();
      ctx.arc(aX, aY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = A + "35";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(aX, aY, 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.font = "700 14px Poppins, sans-serif";
      ctx.fillStyle = A;
      ctx.textAlign = "left";
      ctx.fillText("A", aX + 14, aY + 5);
      ctx.globalAlpha = 1;
    }
  }

  // Step 6+: crease t
  if (step >= 6) {
    const tp = step === 6 ? p : 1;
    if (step === 6 && progress < 0.3) {
      ctx.globalAlpha = 0.1 * (1 - progress / 0.3);
      ctx.fillStyle = LAV;
      ctx.fillRect(0, 0, cx * (1 - (progress / 0.3) * 0.4), ch);
      ctx.globalAlpha = 1;
    }
    const tTop = aY - 35,
      tBot = ly + 35;
    const drawH = (tBot - tTop) * tp;
    ctx.setLineDash([7, 5]);
    ctx.strokeStyle = G4;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(aX, tTop);
    ctx.lineTo(aX, tTop + drawH);
    ctx.stroke();
    ctx.setLineDash([]);
    if (tp > 0.7) {
      ctx.globalAlpha = (tp - 0.7) * 3.3;
      ctx.font = "600 italic 14px Poppins, sans-serif";
      ctx.fillStyle = G4;
      ctx.textAlign = "left";
      ctx.fillText("t", aX + 8, tBot + 16);
      ctx.globalAlpha = 1;
    }
    if (tp > 0.55) {
      ctx.globalAlpha = (tp - 0.55) * 2.2;
      drawAngle90(ctx, aX, ly, 12, false);
      ctx.globalAlpha = 1;
    }
  }

  // Step 7: line m
  if (step >= 7) {
    const mp = step === 7 ? p : 1;
    if (progress < 0.2) {
      ctx.globalAlpha = 0.07 * (1 - progress / 0.2);
      ctx.fillStyle = LAV;
      ctx.fillRect(0, 0, cw, aY * (1 - (progress / 0.2) * 0.3));
      ctx.globalAlpha = 1;
    }
    const mLen = ll * 0.58 * mp,
      msx = aX - mLen / 2;
    ctx.strokeStyle = P;
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(msx, aY);
    ctx.lineTo(msx + mLen, aY);
    ctx.stroke();
    if (mp > 0.6) {
      ctx.globalAlpha = (mp - 0.6) * 2.5;
      ctx.font = "600 italic 16px Poppins, sans-serif";
      ctx.fillStyle = P;
      ctx.textAlign = "left";
      ctx.fillText("m", msx + mLen + 10, aY + 6);
      ctx.globalAlpha = 1;
    }
    if (mp > 0.45) {
      ctx.globalAlpha = (mp - 0.45) * 2.2;
      drawAngle90(ctx, aX, aY, 12, true);
      ctx.globalAlpha = 1;
    }
    if (mp > 0.65) {
      ctx.globalAlpha = (mp - 0.65) * 2.8;
      drawArrows(ctx, cx + ll * 0.12, ly);
      drawArrows(ctx, cx + mLen * 0.12, aY);
      ctx.globalAlpha = 1;
    }
    if (mp > 0.82) {
      ctx.globalAlpha = Math.min((mp - 0.82) * 5.5, 1);
      const txt = "Both ⊥ to t → l ∥ m";
      ctx.font = "700 12px Poppins, sans-serif";
      const tw = ctx.measureText(txt).width;
      const bx = cx - tw / 2 - 14,
        by = (aY + ly) / 2 - 12;
      ctx.fillStyle = LAV + "35";
      ctx.beginPath();
      ctx.roundRect(bx, by, tw + 28, 26, 10);
      ctx.fill();
      ctx.fillStyle = P;
      ctx.textAlign = "center";
      ctx.fillText(txt, cx, by + 18);
      ctx.globalAlpha = 1;
    }
  }
}

function drawMiniFig(ctx, cw, ch, fig) {
  ctx.clearRect(0, 0, cw, ch);
  ctx.fillStyle = G1;
  ctx.fillRect(0, 0, cw, ch);
  const cx = cw / 2,
    cy = ch / 2;
  if (fig === "sq") {
    ctx.strokeStyle = G9;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(30, cy - 22);
    ctx.lineTo(cw - 30, cy - 22);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(30, cy + 22);
    ctx.lineTo(cw - 30, cy + 22);
    ctx.stroke();
    ctx.strokeStyle = A;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(cx, 8);
    ctx.lineTo(cx, ch - 8);
    ctx.stroke();
    drawAngle90(ctx, cx, cy + 22, 7, false);
    drawAngle90(ctx, cx, cy - 22, 7, false);
    drawArrows(ctx, cx + 28, cy - 22);
    drawArrows(ctx, cx + 28, cy + 22);
    ctx.font = "600 italic 10px Poppins";
    ctx.textAlign = "left";
    ctx.fillStyle = P;
    ctx.fillText("m", cw - 26, cy - 26);
    ctx.fillStyle = G9;
    ctx.fillText("l", cw - 26, cy + 19);
    ctx.fillStyle = A;
    ctx.fillText("t", cx + 5, 16);
    ctx.font = "600 8px Poppins";
    ctx.fillStyle = A;
    ctx.fillText("90°", cx + 10, cy - 14);
    ctx.fillText("90°", cx + 10, cy + 32);
  } else {
    ctx.strokeStyle = G9;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(20, cy + 22);
    ctx.lineTo(cw - 20, cy + 22);
    ctx.stroke();
    ctx.strokeStyle = P;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(34, cy - 22);
    ctx.lineTo(cw - 34, cy - 22);
    ctx.stroke();
    ctx.setLineDash([4, 3]);
    ctx.strokeStyle = G4;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(cx, 8);
    ctx.lineTo(cx, ch - 8);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = A;
    ctx.beginPath();
    ctx.arc(cx, cy - 22, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = "600 9px Poppins";
    ctx.fillText("A", cx + 7, cy - 25);
    drawAngle90(ctx, cx, cy + 22, 6, false);
    drawAngle90(ctx, cx, cy - 22, 6, true);
    drawArrows(ctx, cx + 22, cy + 22);
    drawArrows(ctx, cx + 18, cy - 22);
    ctx.font = "600 italic 10px Poppins";
    ctx.textAlign = "left";
    ctx.fillStyle = G9;
    ctx.fillText("l", cw - 18, cy + 19);
    ctx.fillStyle = P;
    ctx.fillText("m", cw - 32, cy - 26);
    ctx.fillStyle = G4;
    ctx.fillText("t", cx + 5, ch - 6);
  }
}

/* ═══ Main Component ═══ */
const DrawingParallelLinesTool = () => {
  const [mode, setMode] = useState("learn");
  const [sub, setSub] = useState("ruler");
  const [si, setSi] = useState(0);
  const [anim, setAnim] = useState(0);
  const [ans, setAns] = useState(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [fade, setFade] = useState(1);

  const cRef = useRef(null);
  const afRef = useRef(null);
  const startRef = useRef(null);

  const steps =
    mode === "learn" ? (sub === "ruler" ? LEARN_RULER : LEARN_PAPER) : MCQS;
  const total = steps.length;

  // Canvas animation
  useEffect(() => {
    if (mode !== "learn") return;
    const c = cRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    startRef.current = null;

    const run = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const p = Math.min(elapsed / 2200, 1);
      setAnim(p);

      const dpr = 2;
      const w = c.width / dpr;
      const h = c.height / dpr;
      ctx.save();
      ctx.scale(dpr, dpr);
      const curStep = steps[si] as LearnStep;
      if (sub === "ruler") {
        renderRulerStep(ctx, w, h, curStep.id, p);
      } else {
        renderPaperStep(ctx, w, h, curStep.id, p);
      }
      ctx.restore();

      if (p < 1) {
        afRef.current = requestAnimationFrame(run);
      }
    };
    afRef.current = requestAnimationFrame(run);
    return () => {
      if (afRef.current) cancelAnimationFrame(afRef.current);
    };
  }, [mode, sub, si]);

  // Practice figure
  const pCanRef = useRef(null);
  useEffect(() => {
    if (mode !== "practice") return;
    const c = pCanRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.save();
    ctx.scale(2, 2);
    drawMiniFig(ctx, c.width / 2, c.height / 2, MCQS[si]?.fig);
    ctx.restore();
  }, [mode, si]);

  const go = (dir) => {
    setFade(0);
    setTimeout(() => {
      setSi((prev) => prev + dir);
      setAns(null);
      setChecked(false);
      setFade(1);
    }, 150);
  };

  const switchMode = (m) => {
    setFade(0);
    setTimeout(() => {
      setMode(m);
      setSi(0);
      setAns(null);
      setChecked(false);
      setScore(0);
      setDone(false);
      setFade(1);
    }, 150);
  };

  const switchSub = (s) => {
    if (s === sub) return;
    setFade(0);
    setTimeout(() => {
      setSub(s);
      setSi(0);
      setFade(1);
    }, 150);
  };

  const doCheck = () => {
    if (ans === null || checked) return;
    setChecked(true);
    if (ans === MCQS[si].ans) setScore((prev) => prev + 1);
    if (si === MCQS.length - 1) setTimeout(() => setDone(true), 1200);
  };

  const reset = () => {
    setSi(0);
    setAns(null);
    setChecked(false);
    setScore(0);
    setDone(false);
  };

  const canW = 700,
    canH = 280;
  const nxDis = si >= total - 1 || (mode === "practice" && !checked);
  const pvDis = si <= 0;
  const curMcq = mode === "practice" ? MCQS[si] : null;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 800,
        margin: "0 auto",
        background: W,
        borderRadius: 16,
        overflow: "hidden",
        boxShadow:
          "0 12px 40px -10px rgba(83,48,134,0.14),0 2px 12px rgba(0,0,0,0.04)",
        fontFamily: FNT,
      }}
    >
      {/* Header */}
      <div
        style={{
          background: `linear-gradient(135deg,${GF},${GT})`,
          padding: "20px 28px 16px",
          color: W,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 140,
            height: "100%",
            background:
              "radial-gradient(circle at 80% 30%,rgba(255,255,255,0.12),transparent 60%)",
            pointerEvents: "none",
          }}
        />
        <h2
          style={{
            fontSize: 20,
            fontWeight: 700,
            margin: 0,
            letterSpacing: -0.3,
          }}
        >
          Drawing Parallel Lines
        </h2>
        <div
          style={{ fontSize: 11, fontWeight: 500, opacity: 0.88, marginTop: 3 }}
        >
          Ruler & Set Square · Paper Folding · Practice MCQs
        </div>
      </div>

      {/* Mode tabs */}
      <div
        style={{
          display: "flex",
          background: G1,
          borderBottom: `1px solid ${G2}`,
        }}
      >
        {[
          ["learn", "Learn", BookOpen],
          ["practice", "Practice", Target],
        ].map(([m, label, Icon]) => {
          const sel = mode === m;
          return (
            <button
              key={m}
              onClick={() => switchMode(m)}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: "12px 24px",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 13,
                fontFamily: FNT,
                transition: "all 0.3s",
                background: sel ? W : G1,
                color: sel ? P : G9,
                borderBottom: sel ? `3px solid ${P}` : "3px solid transparent",
              }}
            >
              <Icon size={15} /> {label}
            </button>
          );
        })}
      </div>

      {/* Sub pills */}
      {mode === "learn" && (
        <div
          style={{
            display: "flex",
            gap: 8,
            padding: "12px 24px",
            background: W,
            borderBottom: `1px solid ${G2}`,
            justifyContent: "center",
          }}
        >
          {[
            ["ruler", "📐 Ruler & Set Square"],
            ["paper", "📄 Paper Folding"],
          ].map(([s, label]) => {
            const sel = sub === s;
            return (
              <button
                key={s}
                onClick={() => switchSub(s)}
                style={{
                  padding: "8px 22px",
                  borderRadius: 24,
                  border: sel ? "none" : `1.5px solid ${P}`,
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 12,
                  fontFamily: FNT,
                  transition: "all 0.3s",
                  background: sel ? P : "transparent",
                  color: sel ? W : P,
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      {/* Step header */}
      <div
        style={{
          padding: "16px 28px 6px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 700, color: GF }}>
          {mode === "practice" && !done
            ? `Question ${si + 1} of ${total}`
            : done
              ? "🎉 Results"
              : (steps[si] as LearnStep | undefined)?.title}
        </div>
        {!done && (
          <span
            style={{
              background: LAV + "40",
              color: P,
              padding: "4px 12px",
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            {si + 1} / {total}
          </span>
        )}
      </div>

      {/* Progress */}
      <div
        style={{
          height: 3,
          background: G2,
          margin: "0 28px 8px",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            background: `linear-gradient(90deg,${GF},${GT})`,
            borderRadius: 2,
            transition: "width 0.4s",
            width: `${((si + 1) / total) * 100}%`,
          }}
        />
      </div>

      {/* Content */}
      <div
        style={{
          padding: "4px 24px 16px",
          opacity: fade,
          transition: "opacity 0.15s",
          minHeight: mode === "learn" ? canH + 100 : 340,
        }}
      >
        {/* LEARN */}
        {mode === "learn" && (
          <div>
            <div
              style={{
                borderRadius: 12,
                overflow: "hidden",
                border: `1px solid ${G2}`,
                marginBottom: 12,
              }}
            >
              <canvas
                ref={cRef}
                width={canW * 2}
                height={canH * 2}
                style={{
                  display: "block",
                  width: "100%",
                  height: canH,
                  borderRadius: 12,
                }}
              />
            </div>
            <div
              style={{
                fontSize: 13,
                lineHeight: 1.75,
                color: G9,
                padding: "14px 18px",
                background: G1,
                borderRadius: 10,
                borderLeft: `4px solid ${P}`,
                fontWeight: 500,
              }}
            >
              {(steps[si] as LearnStep | undefined)?.desc}
            </div>
          </div>
        )}

        {/* PRACTICE */}
        {mode === "practice" && !done && curMcq && (
          <div>
            <div
              style={{
                borderRadius: 10,
                overflow: "hidden",
                border: `1px solid ${G2}`,
                marginBottom: 14,
              }}
            >
              <canvas
                ref={pCanRef}
                width={canW * 2}
                height={220}
                style={{
                  display: "block",
                  width: "100%",
                  height: 110,
                  borderRadius: 10,
                }}
              />
            </div>
            <div
              style={{
                fontSize: 13.5,
                fontWeight: 600,
                color: G9,
                marginBottom: 14,
                lineHeight: 1.65,
                padding: "12px 16px",
                background: G1,
                borderRadius: 10,
                borderLeft: `4px solid ${GF}`,
              }}
            >
              {curMcq.q}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                marginBottom: 14,
              }}
            >
              {curMcq.opts.map((o, i) => {
                const sel = ans === i;
                const cor = i === curMcq.ans;
                let bg = W,
                  bc = G2,
                  tc = G9,
                  an = "";
                if (checked) {
                  if (cor) {
                    bg = "#E8F8F0";
                    bc = OK;
                    tc = "#1A7D4B";
                    an = "correctBounce 0.5s";
                  } else if (sel) {
                    bg = "#FDECEB";
                    bc = NO;
                    tc = "#A41E1E";
                    an = "shake 0.5s";
                  }
                } else if (sel) {
                  bg = LAV + "30";
                  bc = P;
                  tc = P;
                }
                return (
                  <button
                    key={i}
                    onClick={() => !checked && setAns(i)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "12px 16px",
                      borderRadius: 10,
                      border: `2px solid ${bc}`,
                      background: bg,
                      color: tc,
                      cursor: checked ? "default" : "pointer",
                      fontWeight: 600,
                      fontSize: 12.5,
                      fontFamily: FNT,
                      textAlign: "left",
                      transition: "all 0.3s",
                      animation: an,
                      opacity: checked && !cor && !sel ? 0.4 : 1,
                    }}
                  >
                    <span
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: 700,
                        flexShrink: 0,
                        transition: "all 0.3s",
                        background:
                          checked && cor
                            ? OK
                            : checked && sel
                              ? NO
                              : sel
                                ? P
                                : G1,
                        color: (checked && (cor || sel)) || sel ? W : G9,
                      }}
                    >
                      {checked && cor ? (
                        <Check size={14} />
                      ) : checked && sel ? (
                        <X size={14} />
                      ) : (
                        String.fromCharCode(65 + i)
                      )}
                    </span>
                    <span style={{ flex: 1 }}>{o}</span>
                  </button>
                );
              })}
            </div>
            {!checked ? (
              <button
                onClick={doCheck}
                disabled={ans === null}
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 24,
                  border: "none",
                  background: ans !== null ? P : G4,
                  color: W,
                  cursor: ans !== null ? "pointer" : "not-allowed",
                  fontWeight: 600,
                  fontSize: 14,
                  fontFamily: FNT,
                  transition: "all 0.3s",
                }}
              >
                Check Answer
              </button>
            ) : (
              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: 10,
                  animation: "fadeInUp 0.3s",
                  background: ans === curMcq.ans ? "#E8F8F0" : "#FDECEB",
                  border: `1.5px solid ${ans === curMcq.ans ? OK + "40" : NO + "30"}`,
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 13,
                    marginBottom: 4,
                    color: ans === curMcq.ans ? "#1A7D4B" : "#A41E1E",
                  }}
                >
                  {ans === curMcq.ans ? "✅ Correct!" : "❌ Not quite!"}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    lineHeight: 1.6,
                    color: G9,
                    fontWeight: 500,
                  }}
                >
                  {curMcq.exp}
                </div>
              </div>
            )}
          </div>
        )}

        {/* RESULTS */}
        {mode === "practice" && done && (
          <div
            style={{
              textAlign: "center",
              padding: "20px 10px",
              animation: "fadeInUp 0.4s",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 10 }}>
              {score >= 4 ? "🏆" : score >= 3 ? "⭐" : "📚"}
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: GF,
                marginBottom: 6,
              }}
            >
              You scored {score} out of {MCQS.length}!
            </div>
            <div
              style={{
                fontSize: 13,
                color: G9,
                fontWeight: 500,
                marginBottom: 18,
                lineHeight: 1.6,
                opacity: 0.75,
              }}
            >
              {score === 5
                ? "Perfect! You really understand parallel lines!"
                : score >= 4
                  ? "Great job! Almost perfect!"
                  : score >= 3
                    ? "Good work! Review the ones you missed."
                    : "Keep practising! Try the Learn mode to review."}
            </div>
            <div
              style={{
                width: "70%",
                maxWidth: 260,
                height: 8,
                background: G2,
                borderRadius: 4,
                margin: "0 auto 20px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${(score / MCQS.length) * 100}%`,
                  height: "100%",
                  background: `linear-gradient(90deg,${GF},${GT})`,
                  borderRadius: 4,
                  transition: "width 0.8s",
                }}
              />
            </div>
            <button
              onClick={reset}
              style={{
                padding: "12px 32px",
                borderRadius: 24,
                border: "none",
                background: P,
                color: W,
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 14,
                fontFamily: FNT,
                transition: "all 0.3s",
              }}
            >
              <RotateCcw
                size={14}
                style={{ verticalAlign: "middle", marginRight: 6 }}
              />{" "}
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Key principle */}
      {mode === "learn" && (
        <div
          style={{
            margin: "0 24px 12px",
            padding: "12px 16px",
            background: LAV + "20",
            borderRadius: 10,
            border: `1.5px solid ${LAV}50`,
            fontSize: 12,
            fontWeight: 600,
            color: GF,
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          💡 Key Principle: Two lines perpendicular to the same line are always
          parallel!
        </div>
      )}

      {/* Navigation */}
      {!done && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 24px 20px",
            gap: 8,
          }}
        >
          <button
            onClick={() => !pvDis && go(-1)}
            disabled={pvDis}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "10px 24px",
              borderRadius: 24,
              border: pvDis ? `1.5px solid ${G4}` : `1.5px solid ${P}`,
              cursor: pvDis ? "not-allowed" : "pointer",
              fontWeight: 600,
              fontSize: 13,
              fontFamily: FNT,
              transition: "all 0.3s",
              background: "transparent",
              color: pvDis ? G4 : P,
              opacity: pvDis ? 0.6 : 1,
            }}
          >
            <ChevronLeft size={16} /> Prev
          </button>
          <button
            onClick={reset}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "8px 16px",
              borderRadius: 24,
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 12,
              fontFamily: FNT,
              background: "transparent",
              color: P,
              textDecoration: "underline",
              textUnderlineOffset: 3,
            }}
          >
            <RotateCcw size={13} /> Reset
          </button>
          <button
            onClick={() => !nxDis && go(1)}
            disabled={nxDis}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "10px 24px",
              borderRadius: 24,
              border: "none",
              cursor: nxDis ? "not-allowed" : "pointer",
              fontWeight: 600,
              fontSize: 13,
              fontFamily: FNT,
              transition: "all 0.3s",
              background: nxDis ? G4 : P,
              color: W,
              opacity: nxDis ? 0.6 : 1,
            }}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default DrawingParallelLinesTool;
