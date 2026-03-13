/**
 * NOTE:
 * This component is kept self-contained (no external React/icon imports) so it
 * can typecheck in environments where React is provided globally.
 */

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

type ReactNode = any;
type FC<P = {}> = (props: P) => any;

const { useState, useEffect, useRef, useCallback, useMemo } = React;

type IconProps = { size?: number; style?: any; color?: string };
const IconBase = ({
  size = 16,
  style,
  color,
  children,
}: IconProps & { children?: ReactNode }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color ?? "currentColor"}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
    aria-hidden="true"
    focusable="false"
  >
    {children}
  </svg>
);

const Play = (p: IconProps) => (
  <IconBase {...p}>
    <path d="M8 5v14l11-7z" />
  </IconBase>
);
const Pause = (p: IconProps) => (
  <IconBase {...p}>
    <path d="M6 4h4v16H6z" />
    <path d="M14 4h4v16h-4z" />
  </IconBase>
);
const ChevronLeft = (p: IconProps) => (
  <IconBase {...p}>
    <path d="M15 18l-6-6 6-6" />
  </IconBase>
);
const ChevronRight = (p: IconProps) => (
  <IconBase {...p}>
    <path d="M9 18l6-6-6-6" />
  </IconBase>
);
const Check = (p: IconProps) => (
  <IconBase {...p}>
    <path d="M20 6L9 17l-5-5" />
  </IconBase>
);
const X = (p: IconProps) => (
  <IconBase {...p}>
    <path d="M18 6L6 18" />
    <path d="M6 6l12 12" />
  </IconBase>
);
const Plus = (p: IconProps) => (
  <IconBase {...p}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </IconBase>
);

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
interface LineSegmentExplorerProps {
  props?: {
    width?: number;
    height?: number;
    data?: any;
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
    additionalProps?: any;
  };
  setStepDetails?: (s: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (v: boolean) => void;
}

const DS = {
  primary: "#4A4DC9",
  accent: "#FF7212",
  gradFrom: "#533086",
  gradTo: "#FC9145",
  soft1: "#C1C1EA",
  soft2: "#FFF3E4",
  gray: "#4E4E4E",
  grayLight: "#CACACA",
  grayBg: "#F5F5F5",
  border: "#EBEBEB",
  white: "#FFFFFF",
  success: "#22C55E",
  error: "#EF4444",
  font: "'Poppins', sans-serif",
};

interface MCQ {
  id: number;
  question: string;
  image:
    | "perpendicular"
    | "acute_angle"
    | "parallel"
    | "converging"
    | "obtuse_angle";
  options: string[];
  correct: number;
  explanation: string;
}
const MCQS: MCQ[] = [
  {
    id: 1,
    question: "What type of lines are shown here?",
    image: "perpendicular",
    options: [
      "Parallel lines",
      "Perpendicular lines",
      "Converging lines",
      "Skew lines",
    ],
    correct: 1,
    explanation:
      "These lines meet at exactly 90°. The small square symbol marks the right angle — so they are perpendicular!",
  },
  {
    id: 2,
    question:
      "If two line segments are extended and they meet, what are they called before meeting?",
    image: "converging",
    options: [
      "Parallel lines",
      "Perpendicular lines",
      "Converging lines",
      "Intersecting lines",
    ],
    correct: 2,
    explanation:
      "Lines that do not touch yet but would meet if extended are called converging lines.",
  },
  {
    id: 3,
    question: "What is the angle between two perpendicular lines?",
    image: "perpendicular",
    options: ["45°", "60°", "90°", "180°"],
    correct: 2,
    explanation:
      "Perpendicular lines always meet at exactly 90° — a right angle.",
  },
  {
    id: 4,
    question:
      "Which of these line pairs will NEVER meet, even if extended infinitely?",
    image: "parallel",
    options: [
      "Perpendicular lines",
      "Converging lines",
      "Parallel lines",
      "Intersecting lines",
    ],
    correct: 2,
    explanation:
      "Parallel lines maintain the same distance apart and never meet, no matter how far they are extended.",
  },
  {
    id: 5,
    question:
      "Line segments FG and FH meet at endpoint F at 115.3°. What type of angle is this?",
    image: "obtuse_angle",
    options: ["Acute angle", "Right angle", "Obtuse angle", "Reflex angle"],
    correct: 2,
    explanation:
      "115.3° is greater than 90° but less than 180°, making it an obtuse angle.",
  },
];

const DEFAULT_STEPS: StepDataInterface[] = [
  {
    id: 1,
    title: "Exploring Line Segments",
    description:
      "We are going to explore how different line segments relate to each other on a flat surface. Look at the grid — imagine it as your notebook page. Let us see what happens when pairs of line segments meet, cross, or stay apart!",
    type: "intro",
    mode: "learn",
  },
  {
    id: 2,
    title: "Perpendicular Lines — 90°",
    description:
      "When two lines meet at exactly 90°, they are called perpendicular lines. Notice the small blue square at the corner — that symbol always marks a right angle. Think of the edges of your textbook, the corner of a door frame, or where the floor meets the wall!",
    type: "explanation",
    mode: "learn",
  },
  {
    id: 3,
    title: "Meeting at an Angle — 115.3°",
    description:
      "Line segments FG and FH meet at endpoint F at an angle of 115.3°. We measure this using a protractor. This angle is larger than 90° — it is an obtuse angle. Can you see the protractor overlay showing the measurement?",
    type: "explanation",
    mode: "learn",
  },
  {
    id: 4,
    title: "Will They Meet? — Converging Lines",
    description:
      "These two line segments do not touch each other right now. But look at the dotted extensions — if we extend them, they will meet! Can you predict WHERE they would intersect?",
    type: "explanation",
    mode: "learn",
  },
  {
    id: 5,
    title: "Never Meeting — Parallel Lines",
    description:
      "These two line segments head in the same direction and stay the same distance apart. Even if we extend them forever, they will NEVER meet! Lines like these are called parallel lines.",
    type: "explanation",
    mode: "learn",
  },
  {
    id: 6,
    title: "Classify All Four Types",
    description:
      "Now see all four types together! Perpendicular (90°), meeting at an angle (115.3°), converging (would meet if extended), and parallel (never meet). Which type do you see in your classroom?",
    type: "explanation",
    mode: "learn",
  },
  ...MCQS.map((q, i) => ({
    id: 10 + i,
    title: `Question ${i + 1} of 5`,
    description: q.question,
    type: "practice",
    mode: "practice" as ModeType,
    data: q,
  })),
  {
    id: 20,
    title: "Perpendicular in Daily Life",
    description:
      "The edges of your textbook meet at 90° — perpendicular! The legs of your desk meet the floor at right angles. The door frame has perpendicular edges. Railway sleepers cross the tracks at right angles.",
    type: "real_world",
    mode: "real_world",
  },
  {
    id: 21,
    title: "Parallel Lines Around Us",
    description:
      "Railway tracks run parallel. The opposite edges of your notebook are parallel. The rungs of a ladder are parallel. The lines on ruled paper are parallel. Can you name more examples?",
    type: "real_world",
    mode: "real_world",
  },
];

const ease = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const cl = (v: number) => Math.max(0, Math.min(1, v));

type LineSegmentExplorerInnerProps = NonNullable<LineSegmentExplorerProps["props"]>;

const LineSegmentExplorer: FC<LineSegmentExplorerProps> = ({
  props: incomingProps,
  setStepDetails,
  stopAutoNext,
}) => {
  const props: LineSegmentExplorerInnerProps = incomingProps ?? {};
  const cfg = useMemo(
    () => ({
      w: props.width ?? 800,
      h: props.height ?? 600,
      mode: (props.initialMode ?? "learn") as ModeType,
      showMode: props.showModeSelector ?? true,
      modes: (props.enabledModes ?? [
        "learn",
        "practice",
        "real_world",
      ]) as ModeType[],
      showNav: props.showNavigation ?? true,
      showPlay: props.showPlayPause ?? true,
      showStep: props.showStepIndicator ?? true,
      initStep: props.initialStep ?? 1,
      filter: props.filterSteps ?? null,
      speed: props.animationSpeed ?? 1,
      auto: props.autoPlayDuration ?? 0,
    }),
    [props],
  );

  // ── RESPONSIVE: measure actual container width ──
  const containerRef = useRef(null as any);
  const [cw, setCw] = useState(cfg.w); // container width in px
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const w = e.contentRect.width;
        if (w > 0) setCw(w);
      }
    });
    ro.observe(el);
    setCw(el.clientWidth || cfg.w);
    return () => ro.disconnect();
  }, [cfg.w]);

  // Breakpoint helpers
  const isMobile = cw < 480;
  const isTablet = cw >= 480 && cw < 768;
  const isDesktop = cw >= 768;

  // Responsive scale factors
  const R = useMemo(
    () => ({
      pad: isMobile ? 12 : isTablet ? 16 : 24,
      padSm: isMobile ? 8 : isTablet ? 12 : 14,
      fontSize: {
        title: isMobile ? 16 : isTablet ? 18 : 20,
        body: isMobile ? 12 : isTablet ? 13 : 14,
        small: isMobile ? 10 : isTablet ? 11 : 12,
        btn: isMobile ? 11 : isTablet ? 12 : 13,
        badge: isMobile ? 10 : 12,
      },
      btnPad: isMobile ? "8px 14px" : isTablet ? "9px 18px" : "10px 24px",
      btnPadSm: isMobile ? "8px 12px" : "9px 16px",
      iconSz: isMobile ? 14 : 16,
      canvasH: isMobile
        ? Math.min(cw * 0.65, 220)
        : isTablet
          ? Math.min(cw * 0.5, 280)
          : Math.min(cw * 0.48, 340),
      gap: isMobile ? 4 : isTablet ? 6 : 8,
      radius: isMobile ? 16 : isTablet ? 20 : 24,
      modeShowLabel: !isMobile, // icon-only on mobile
    }),
    [isMobile, isTablet, isDesktop, cw],
  );

  const allS = props.steps || DEFAULT_STEPS;
  const avS = useMemo(
    () => (cfg.filter ? allS.filter((s) => cfg.filter!.includes(s.id)) : allS),
    [allS, cfg.filter],
  );
  const [mode, setMode] = useState(cfg.mode as ModeType);
  const [si, setSi] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [trans, setTrans] = useState(false);
  const [cOp, setCOp] = useState(1);
  const [cTf, setCTf] = useState("translateY(0)");
  const cvRef = useRef(null as any);
  const afRef = useRef(undefined as any);
  const progRef = useRef(0);
  const [selected, setSelected] = useState(null as number | null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const fS = useMemo(() => avS.filter((s) => s.mode === mode), [avS, mode]);
  const cs = fS[si] || fS[0];

  useEffect(() => {
    const css = `@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes popScale{0%{transform:scale(0.8);opacity:0}100%{transform:scale(1);opacity:1}}
        @keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-4px)}40%,80%{transform:translateX(4px)}}`;
    const el = document.createElement("style");
    el.id = "lse-ds";
    el.textContent = css;
    document.head.appendChild(el);
    return () => {
      const e = document.getElementById("lse-ds");
      if (e) document.head.removeChild(e);
    };
  }, []);

  // ── Drawing Primitives ──
  const dGrid = useCallback(
    (c: CanvasRenderingContext2D, w: number, h: number, o: number) => {
      if (o <= 0) return;
      const sp = w < 300 ? 20 : 30;
      c.save();
      c.globalAlpha = o * 0.06;
      c.strokeStyle = DS.primary;
      c.lineWidth = 0.5;
      for (let x = sp; x < w; x += sp) {
        c.beginPath();
        c.moveTo(x, 0);
        c.lineTo(x, h);
        c.stroke();
      }
      for (let y = sp; y < h; y += sp) {
        c.beginPath();
        c.moveTo(0, y);
        c.lineTo(w, y);
        c.stroke();
      }
      c.globalAlpha = o * 0.15;
      c.fillStyle = DS.primary;
      for (let x = sp; x < w; x += sp)
        for (let y = sp; y < h; y += sp) {
          c.beginPath();
          c.arc(x, y, 1.2, 0, 6.283);
          c.fill();
        }
      c.restore();
    },
    [],
  );

  const dSeg = useCallback(
    (
      c: CanvasRenderingContext2D,
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      col: string,
      th: number,
      p: number,
      dash?: boolean,
      al?: number,
    ) => {
      if (p <= 0) return;
      c.save();
      c.strokeStyle = col;
      c.lineWidth = th;
      c.lineCap = "round";
      c.globalAlpha = al ?? 1;
      if (dash) c.setLineDash([8, 6]);
      const pp = ease(cl(p));
      c.beginPath();
      c.moveTo(x1, y1);
      c.lineTo(x1 + (x2 - x1) * pp, y1 + (y2 - y1) * pp);
      c.stroke();
      c.restore();
    },
    [],
  );

  const dDot = useCallback(
    (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      r: number,
      col: string,
      p: number,
    ) => {
      if (p <= 0) return;
      const rd = r * cl(p);
      c.save();
      c.fillStyle = col;
      c.beginPath();
      c.arc(x, y, rd, 0, 6.283);
      c.fill();
      c.fillStyle = "#fff";
      c.beginPath();
      c.arc(x, y, rd * 0.36, 0, 6.283);
      c.fill();
      c.restore();
    },
    [],
  );

  const dLbl = useCallback(
    (
      c: CanvasRenderingContext2D,
      t: string,
      x: number,
      y: number,
      col: string,
      sz: number,
      p: number,
      b?: boolean,
      it?: boolean,
    ) => {
      if (p <= 0) return;
      c.save();
      c.globalAlpha = cl(p);
      c.font = `${it ? "italic " : ""}${b ? "700" : "500"} ${sz}px 'Poppins',sans-serif`;
      c.fillStyle = col;
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillText(t, x, y);
      c.restore();
    },
    [],
  );

  const dArc = useCallback(
    (
      c: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      sa: number,
      ea: number,
      r: number,
      col: string,
      th: number,
      p: number,
    ) => {
      if (p <= 0) return;
      c.save();
      c.strokeStyle = col;
      c.lineWidth = th;
      c.globalAlpha = cl(p);
      c.beginPath();
      c.arc(cx, cy, r, sa, sa + (ea - sa) * cl(p));
      c.stroke();
      c.restore();
    },
    [],
  );

  const dSq90 = useCallback(
    (
      c: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      sz: number,
      rot: number,
      p: number,
    ) => {
      if (p <= 0) return;
      const s = sz * cl(p);
      c.save();
      c.globalAlpha = cl(p);
      c.translate(cx, cy);
      c.rotate(rot);
      c.fillStyle = DS.soft1 + "40";
      c.fillRect(0, 0, s, -s);
      c.strokeStyle = DS.primary;
      c.lineWidth = 2.5;
      c.lineCap = "round";
      c.beginPath();
      c.moveTo(s, 0);
      c.lineTo(s, -s);
      c.lineTo(0, -s);
      c.stroke();
      c.restore();
    },
    [],
  );

  const dArr = useCallback(
    (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      a: number,
      sz: number,
      col: string,
      p: number,
    ) => {
      if (p <= 0) return;
      c.save();
      c.globalAlpha = cl(p);
      c.translate(x, y);
      c.rotate(a);
      c.fillStyle = col;
      c.beginPath();
      c.moveTo(0, 0);
      c.lineTo(-sz * 1.6, -sz * 0.55);
      c.lineTo(-sz * 1.6, sz * 0.55);
      c.closePath();
      c.fill();
      c.restore();
    },
    [],
  );

  const dBadge = useCallback(
    (
      c: CanvasRenderingContext2D,
      t: string,
      x: number,
      y: number,
      bg: string,
      fg: string,
      sz: number,
      p: number,
    ) => {
      if (p <= 0) return;
      c.save();
      c.globalAlpha = cl(p);
      c.font = `700 ${sz}px 'Poppins',sans-serif`;
      c.textAlign = "center";
      c.textBaseline = "middle";
      const m = c.measureText(t);
      const pw = 14,
        ph = 7,
        rr = sz,
        bw = m.width + pw * 2,
        bh = sz + ph * 2,
        bx = x - bw / 2,
        by = y - bh / 2;
      c.fillStyle = bg;
      c.beginPath();
      c.moveTo(bx + rr, by);
      c.lineTo(bx + bw - rr, by);
      c.quadraticCurveTo(bx + bw, by, bx + bw, by + rr);
      c.lineTo(bx + bw, by + bh - rr);
      c.quadraticCurveTo(bx + bw, by + bh, bx + bw - rr, by + bh);
      c.lineTo(bx + rr, by + bh);
      c.quadraticCurveTo(bx, by + bh, bx, by + bh - rr);
      c.lineTo(bx, by + rr);
      c.quadraticCurveTo(bx, by, bx + rr, by);
      c.closePath();
      c.fill();
      c.fillStyle = fg;
      c.fillText(t, x, y + 1);
      c.restore();
    },
    [],
  );

  // ── STEP RENDERERS — use w,h from canvas (responsive) ──
  const s1 = useCallback(
    (c: CanvasRenderingContext2D, w: number, h: number, p: number) => {
      dGrid(c, w, h, cl(p * 2));
      const cx = w / 2,
        cy = h / 2,
        fs = w < 300 ? 12 : w < 500 ? 14 : 16;
      if (p > 0.15) {
        c.save();
        c.globalAlpha = 0.04 * cl((p - 0.15) * 2);
        c.strokeStyle = DS.primary;
        c.lineWidth = 1;
        for (let i = 0; i < 8; i++) {
          const a = ((Math.PI * 2) / 8) * i,
            l = Math.min(100, w * 0.15) * cl((p - 0.15) * 2);
          c.beginPath();
          c.moveTo(cx, cy);
          c.lineTo(cx + Math.cos(a) * l, cy + Math.sin(a) * l);
          c.stroke();
        }
        c.restore();
      }
      dLbl(
        c,
        w < 400
          ? "Line segments will appear here!"
          : "Observe the grid — line segments will appear here!",
        cx,
        cy - 10,
        DS.primary,
        fs,
        cl((p - 0.3) * 2.5),
        true,
      );
      dLbl(
        c,
        'Tap "Next" to begin',
        cx,
        cy + 20,
        DS.grayLight,
        fs - 3,
        cl((p - 0.55) * 2.5),
      );
    },
    [dGrid, dLbl],
  );

  const s2 = useCallback(
    (c: CanvasRenderingContext2D, w: number, h: number, p: number) => {
      dGrid(c, w, h, 1);
      const cx = w / 2,
        cy = h / 2,
        L = Math.min(w, h) * 0.3,
        as = Math.min(7, w * 0.012),
        lfs = w < 300 ? 12 : w < 500 ? 14 : 17;
      const th = w < 400 ? 2.5 : 3.5;
      const p1 = cl(p * 2.5);
      dSeg(c, cx - L, cy, cx + L, cy, DS.primary, th, p1);
      dArr(c, cx - L, cy, Math.PI, as, DS.primary, cl((p1 - 0.85) * 7));
      dArr(c, cx + L, cy, 0, as, DS.primary, cl((p1 - 0.85) * 7));
      const p2 = cl((p - 0.15) * 2.5);
      dSeg(c, cx, cy - L, cx, cy + L, DS.accent, th, p2);
      dArr(c, cx, cy - L, -Math.PI / 2, as, DS.accent, cl((p2 - 0.85) * 7));
      dArr(c, cx, cy + L, Math.PI / 2, as, DS.accent, cl((p2 - 0.85) * 7));
      dDot(c, cx, cy, Math.min(6, w * 0.01), DS.primary, cl((p - 0.3) * 3));
      dSq90(c, cx, cy, Math.min(18, w * 0.03), 0, cl((p - 0.4) * 3));
      const lp = cl((p - 0.5) * 3);
      dLbl(c, "l", cx + L + 16, cy - 2, DS.primary, lfs, lp, true, true);
      dLbl(c, "m", cx + 10, cy - L - 6, DS.accent, lfs, lp, true, true);
      dBadge(
        c,
        "Perpendicular — 90°",
        cx,
        Math.max(cy - L - 30, 16),
        DS.primary,
        "#fff",
        w < 400 ? 11 : 14,
        cl((p - 0.55) * 3),
      );
      dLbl(
        c,
        w < 400
          ? "90° = right angle"
          : "Like a door frame corner or textbook edge",
        cx,
        Math.min(cy + L + 26, h - 10),
        DS.grayLight,
        w < 400 ? 9 : 11,
        cl((p - 0.75) * 4),
      );
    },
    [dGrid, dSeg, dArr, dDot, dSq90, dLbl, dBadge],
  );

  const s3 = useCallback(
    (c: CanvasRenderingContext2D, w: number, h: number, p: number) => {
      dGrid(c, w, h, 1);
      const fx = w * 0.42,
        fy = h * 0.56,
        rL = Math.min(w, h) * 0.34,
        th = w < 400 ? 2.5 : 3.5;
      const aFG = (210 * Math.PI) / 180,
        gx = fx + Math.cos(aFG) * rL,
        gy = fy + Math.sin(aFG) * rL;
      const aFH = ((210 - 115.3) * Math.PI) / 180,
        hx = fx + Math.cos(aFH) * rL,
        hy = fy + Math.sin(aFH) * rL;
      const p1 = cl(p * 2.5);
      dSeg(c, fx, fy, gx, gy, DS.primary, th, p1);
      const p2 = cl((p - 0.1) * 2.5);
      dSeg(c, fx, fy, hx, hy, DS.accent, th, p2);
      dDot(c, gx, gy, 5, DS.primary, cl(p1 - 0.3));
      dDot(c, hx, hy, 5, DS.accent, cl(p2 - 0.3));
      dDot(c, fx, fy, Math.min(7, w * 0.012), DS.gradFrom, cl((p - 0.2) * 3));
      dArc(
        c,
        fx,
        fy,
        aFH,
        aFG,
        Math.min(38, w * 0.06),
        DS.gradFrom,
        2.5,
        cl((p - 0.3) * 2.5),
      );
      // Protractor ticks
      const tP = cl((p - 0.4) * 2.5);
      if (tP > 0 && w > 300) {
        c.save();
        c.globalAlpha = 0.3 * cl(tP);
        c.strokeStyle = DS.grayLight;
        for (let d = 0; d <= 115; d += 10) {
          const a = aFH + (d * Math.PI) / 180,
            major = d % 30 === 0;
          c.lineWidth = major ? 1 : 0.5;
          const inn = 32,
            out = major ? 50 : 42;
          c.beginPath();
          c.moveTo(fx + Math.cos(a) * inn, fy + Math.sin(a) * inn);
          c.lineTo(fx + Math.cos(a) * out, fy + Math.sin(a) * out);
          c.stroke();
        }
        c.restore();
      }
      const midA = (aFH + aFG) / 2;
      dBadge(
        c,
        "115.3°",
        fx + Math.cos(midA) * Math.min(65, w * 0.1),
        fy + Math.sin(midA) * Math.min(65, w * 0.1),
        DS.accent,
        "#fff",
        w < 400 ? 11 : 14,
        cl((p - 0.5) * 3),
      );
      const lp = cl((p - 0.45) * 2.5),
        lfs = w < 300 ? 11 : 14;
      dLbl(c, "F", fx + 12, fy + 14, DS.gradFrom, lfs, lp, true);
      dLbl(c, "G", gx - 12, gy + 12, DS.primary, lfs, lp, true);
      dLbl(c, "H", hx - 12, hy - 8, DS.accent, lfs, lp, true);
      // Vocab box — only on wider screens
      if (w > 450) {
        const vP = cl((p - 0.7) * 4);
        if (vP > 0) {
          const bx2 = w - 158,
            by2 = 12,
            bw2 = 146,
            bh2 = 68,
            rr = 8;
          c.save();
          c.globalAlpha = cl(vP);
          c.fillStyle = DS.soft2;
          c.strokeStyle = DS.accent;
          c.lineWidth = 1.5;
          c.beginPath();
          c.moveTo(bx2 + rr, by2);
          c.lineTo(bx2 + bw2 - rr, by2);
          c.quadraticCurveTo(bx2 + bw2, by2, bx2 + bw2, by2 + rr);
          c.lineTo(bx2 + bw2, by2 + bh2 - rr);
          c.quadraticCurveTo(bx2 + bw2, by2 + bh2, bx2 + bw2 - rr, by2 + bh2);
          c.lineTo(bx2 + rr, by2 + bh2);
          c.quadraticCurveTo(bx2, by2 + bh2, bx2, by2 + bh2 - rr);
          c.lineTo(bx2, by2 + rr);
          c.quadraticCurveTo(bx2, by2, bx2 + rr, by2);
          c.closePath();
          c.fill();
          c.stroke();
          c.restore();
          dLbl(
            c,
            "Vocabulary",
            bx2 + bw2 / 2,
            by2 + 16,
            "#92400e",
            11,
            vP,
            true,
          );
          dLbl(
            c,
            "Endpoint · Degree",
            bx2 + bw2 / 2,
            by2 + 34,
            "#92400e",
            9,
            vP,
          );
          dLbl(
            c,
            "Obtuse Angle (> 90°)",
            bx2 + bw2 / 2,
            by2 + 50,
            "#92400e",
            9,
            vP,
          );
        }
      }
    },
    [dGrid, dSeg, dDot, dArc, dLbl, dBadge],
  );

  const s4 = useCallback(
    (c: CanvasRenderingContext2D, w: number, h: number, p: number) => {
      dGrid(c, w, h, 1);
      const th = w < 400 ? 3 : 4;
      const px2 = w * 0.08,
        py2 = h * 0.18,
        qx = w * 0.34,
        qy = h * 0.42;
      const rx2 = w * 0.92,
        ry2 = h * 0.84,
        sx = w * 0.66,
        sy = h * 0.6;
      const d1 = { x: qx - px2, y: qy - py2 },
        d2 = { x: sx - rx2, y: sy - ry2 };
      const det = d1.x * d2.y - d1.y * d2.x;
      let mx = w * 0.5,
        my = h * 0.52;
      if (Math.abs(det) > 0.001) {
        const t = ((rx2 - px2) * d2.y - (ry2 - py2) * d2.x) / det;
        mx = px2 + t * d1.x;
        my = py2 + t * d1.y;
      }
      const p1 = cl(p * 2.5);
      dSeg(c, px2, py2, qx, qy, DS.primary, th, p1);
      dDot(c, px2, py2, 5, DS.primary, cl(p1 - 0.4));
      dDot(c, qx, qy, 5, DS.primary, cl(p1 - 0.2));
      const p22 = cl((p - 0.1) * 2.5);
      dSeg(c, rx2, ry2, sx, sy, DS.accent, th, p22);
      dDot(c, rx2, ry2, 5, DS.accent, cl(p22 - 0.4));
      dDot(c, sx, sy, 5, DS.accent, cl(p22 - 0.2));
      const p3 = cl((p - 0.35) * 2.5);
      dSeg(c, qx, qy, mx, my, DS.primary, 2, p3, true, 0.4);
      dSeg(c, sx, sy, mx, my, DS.accent, 2, p3, true, 0.4);
      if (p3 > 0.5) {
        const aP = cl((p3 - 0.5) * 2);
        const a1 = Math.atan2(my - qy, mx - qx),
          a2 = Math.atan2(my - sy, mx - sx);
        dArr(
          c,
          mx - Math.cos(a1) * 16,
          my - Math.sin(a1) * 16,
          a1,
          7,
          DS.primary,
          aP,
        );
        dArr(
          c,
          mx - Math.cos(a2) * 16,
          my - Math.sin(a2) * 16,
          a2,
          7,
          DS.accent,
          aP,
        );
      }
      if (cl((p - 0.6) * 3) > 0)
        dDot(c, mx, my, 6, DS.gradFrom, cl((p - 0.6) * 3));
      const lp = cl((p - 0.4) * 2.5),
        lfs = w < 300 ? 10 : 13;
      dLbl(c, "P", px2 - 10, py2 - 12, DS.primary, lfs, lp, true);
      dLbl(c, "Q", qx + 10, qy - 12, DS.primary, lfs, lp, true);
      dLbl(c, "R", rx2 + 10, ry2 + 10, DS.accent, lfs, lp, true);
      dLbl(c, "S", sx - 12, sy - 12, DS.accent, lfs, lp, true);
      dBadge(
        c,
        w < 400 ? "Will meet!" : "They WILL meet if extended!",
        w / 2,
        Math.max(h * 0.06, 14),
        DS.accent,
        "#fff",
        w < 400 ? 10 : 13,
        cl((p - 0.65) * 3),
      );
    },
    [dGrid, dSeg, dDot, dArr, dLbl, dBadge],
  );

  const s5 = useCallback(
    (c: CanvasRenderingContext2D, w: number, h: number, p: number) => {
      dGrid(c, w, h, 1);
      const th = w < 400 ? 2.5 : 3.5;
      const gap = h * 0.24,
        y1 = h / 2 - gap / 2,
        y2 = h / 2 + gap / 2,
        xP = w * 0.12,
        x1 = xP,
        x2 = w - xP,
        as = Math.min(7, w * 0.012);
      const p1 = cl(p * 2.5);
      dSeg(c, x1, y1, x2, y1, DS.primary, th, p1);
      dArr(c, x1, y1, Math.PI, as, DS.primary, cl((p1 - 0.8) * 5));
      dArr(c, x2, y1, 0, as, DS.primary, cl((p1 - 0.8) * 5));
      const p2 = cl((p - 0.1) * 2.5);
      dSeg(c, x1, y2, x2, y2, DS.accent, th, p2);
      dArr(c, x1, y2, Math.PI, as, DS.accent, cl((p2 - 0.8) * 5));
      dArr(c, x2, y2, 0, as, DS.accent, cl((p2 - 0.8) * 5));
      const p3 = cl((p - 0.35) * 2.5);
      dSeg(c, x1 - 45, y1, x1 - 5, y1, DS.primary, 1.5, p3, true, 0.25);
      dSeg(c, x2 + 5, y1, x2 + 45, y1, DS.primary, 1.5, p3, true, 0.25);
      dSeg(c, x1 - 45, y2, x1 - 5, y2, DS.accent, 1.5, p3, true, 0.25);
      dSeg(c, x2 + 5, y2, x2 + 45, y2, DS.accent, 1.5, p3, true, 0.25);
      const mp = cl((p - 0.45) * 3);
      if (mp > 0) {
        c.save();
        c.globalAlpha = mp;
        [
          { y: y1, co: DS.primary },
          { y: y2, co: DS.accent },
        ].forEach(({ y, co }) => {
          c.fillStyle = co;
          c.beginPath();
          c.moveTo(w / 2 + 6, y);
          c.lineTo(w / 2 - 3, y - 5);
          c.lineTo(w / 2 - 3, y + 5);
          c.closePath();
          c.fill();
        });
        c.restore();
      }
      const dp = cl((p - 0.5) * 2.5);
      if (dp > 0) {
        c.save();
        c.globalAlpha = 0.25 * dp;
        c.strokeStyle = DS.gray;
        c.lineWidth = 1;
        c.setLineDash([4, 4]);
        [w * 0.3, w * 0.5, w * 0.7].forEach((mx2) => {
          c.beginPath();
          c.moveTo(mx2, y1 + 4);
          c.lineTo(mx2, y2 - 4);
          c.stroke();
        });
        c.restore();
        [w * 0.3, w * 0.5, w * 0.7].forEach((mx2) =>
          dLbl(
            c,
            "d",
            mx2 + 8,
            (y1 + y2) / 2,
            DS.grayLight,
            w < 300 ? 8 : 10,
            dp,
            false,
            true,
          ),
        );
      }
      const lp = cl((p - 0.45) * 2.5),
        lfs = w < 300 ? 12 : 17;
      dLbl(c, "l", x2 + 18, y1, DS.primary, lfs, lp, true, true);
      dLbl(c, "m", x2 + 20, y2, DS.accent, lfs, lp, true, true);
      dBadge(
        c,
        w < 400 ? "Parallel — Never Meet" : "∞  Never Meet — Parallel Lines  ∞",
        w / 2,
        (y1 + y2) / 2,
        DS.gradFrom,
        "#fff",
        w < 400 ? 10 : 13,
        cl((p - 0.55) * 3),
      );
      dLbl(
        c,
        w < 400
          ? "Like railway tracks"
          : "Like railway tracks or ruled notebook lines",
        w / 2,
        h - 14,
        DS.grayLight,
        w < 400 ? 9 : 11,
        cl((p - 0.8) * 5),
      );
    },
    [dGrid, dSeg, dArr, dLbl, dBadge],
  );

  const s6 = useCallback(
    (c: CanvasRenderingContext2D, w: number, h: number, p: number) => {
      dGrid(c, w, h, 0.3);
      c.save();
      c.globalAlpha = 0.08;
      c.strokeStyle = DS.primary;
      c.lineWidth = 1;
      c.setLineDash([5, 5]);
      c.beginPath();
      c.moveTo(w / 2, 4);
      c.lineTo(w / 2, h - 4);
      c.stroke();
      c.beginPath();
      c.moveTo(4, h / 2);
      c.lineTo(w - 4, h / 2);
      c.stroke();
      c.restore();
      const cells = [
        {
          t: w < 400 ? "⊥ 90°" : "Perpendicular (90°)",
          cx: w * 0.25,
          cy: h * 0.25,
          co: DS.primary,
        },
        {
          t: w < 400 ? "115.3°" : "Meeting at 115.3°",
          cx: w * 0.75,
          cy: h * 0.25,
          co: DS.accent,
        },
        { t: "Converging", cx: w * 0.25, cy: h * 0.75, co: DS.gradFrom },
        { t: "Parallel", cx: w * 0.75, cy: h * 0.75, co: DS.gradTo },
      ];
      const th = w < 400 ? 2 : 3;
      cells.forEach((cl2, i) => {
        const cp = cl((p - i * 0.1) * 2.2);
        if (cp <= 0) return;
        const cw2 = w * 0.42,
          ch2 = h * 0.42,
          rx2 = cl2.cx - cw2 / 2,
          ry2 = cl2.cy - ch2 / 2;
        c.save();
        c.globalAlpha = cp;
        c.fillStyle = "#fff";
        c.shadowColor = cl2.co + "18";
        c.shadowBlur = 12;
        c.beginPath();
        const rr = 12;
        c.moveTo(rx2 + rr, ry2);
        c.lineTo(rx2 + cw2 - rr, ry2);
        c.quadraticCurveTo(rx2 + cw2, ry2, rx2 + cw2, ry2 + rr);
        c.lineTo(rx2 + cw2, ry2 + ch2 - rr);
        c.quadraticCurveTo(rx2 + cw2, ry2 + ch2, rx2 + cw2 - rr, ry2 + ch2);
        c.lineTo(rx2 + rr, ry2 + ch2);
        c.quadraticCurveTo(rx2, ry2 + ch2, rx2, ry2 + ch2 - rr);
        c.lineTo(rx2, ry2 + rr);
        c.quadraticCurveTo(rx2, ry2, rx2 + rr, ry2);
        c.closePath();
        c.fill();
        c.shadowBlur = 0;
        c.strokeStyle = cl2.co + "30";
        c.lineWidth = 1.5;
        c.stroke();
        c.restore();
        const gx = cl2.cx,
          gy = cl2.cy - 6,
          L = Math.min(cw2, ch2) * 0.24,
          as = Math.min(5, w * 0.008);
        if (i === 0) {
          dSeg(c, gx - L, gy, gx + L, gy, cl2.co, th, cp);
          dSeg(c, gx, gy - L, gx, gy + L * 0.7, cl2.co, th, cp);
          dArr(c, gx - L, gy, Math.PI, as, cl2.co, cp);
          dArr(c, gx + L, gy, 0, as, cl2.co, cp);
          dSq90(c, gx, gy, Math.min(9, w * 0.015), 0, cp);
          dDot(c, gx, gy, 3, cl2.co, cp);
        } else if (i === 1) {
          const a1 = (210 * Math.PI) / 180,
            a2 = ((210 - 115.3) * Math.PI) / 180;
          dSeg(
            c,
            gx,
            gy,
            gx + Math.cos(a1) * L,
            gy + Math.sin(a1) * L,
            DS.primary,
            th,
            cp,
          );
          dSeg(
            c,
            gx,
            gy,
            gx + Math.cos(a2) * L,
            gy + Math.sin(a2) * L,
            cl2.co,
            th,
            cp,
          );
          dArc(c, gx, gy, a2, a1, Math.min(14, L * 0.4), DS.gradFrom, 2, cp);
          dDot(c, gx, gy, 3, DS.gradFrom, cp);
        } else if (i === 2) {
          const sL = L * 0.7;
          dSeg(c, gx - L, gy - 18, gx - L + sL, gy - 5, cl2.co, th, cp);
          dSeg(c, gx - L, gy + 18, gx - L + sL, gy + 5, cl2.co, th, cp);
          dDot(c, gx - L, gy - 18, 3, cl2.co, cp);
          dDot(c, gx - L + sL, gy - 5, 3, cl2.co, cp);
          dDot(c, gx - L, gy + 18, 3, cl2.co, cp);
          dDot(c, gx - L + sL, gy + 5, 3, cl2.co, cp);
          const mp2 = gx + L * 0.3;
          dSeg(c, gx - L + sL, gy - 5, mp2, gy, cl2.co, 1.5, cp, true, 0.4);
          dSeg(c, gx - L + sL, gy + 5, mp2, gy, cl2.co, 1.5, cp, true, 0.4);
          dDot(c, mp2, gy, 3, DS.gradFrom, cp);
        } else {
          dSeg(c, gx - L, gy - 12, gx + L, gy - 12, cl2.co, th, cp);
          dSeg(c, gx - L, gy + 12, gx + L, gy + 12, cl2.co, th, cp);
          dArr(c, gx + L, gy - 12, 0, as, cl2.co, cp);
          dArr(c, gx + L, gy + 12, 0, as, cl2.co, cp);
          dArr(c, gx - L, gy - 12, Math.PI, as, cl2.co, cp);
          dArr(c, gx - L, gy + 12, Math.PI, as, cl2.co, cp);
        }
        dLbl(
          c,
          cl2.t,
          cl2.cx,
          cl2.cy + ch2 / 2 - 16,
          cl2.co,
          w < 400 ? 8 : 10,
          cp,
          true,
        );
      });
    },
    [dGrid, dSeg, dArr, dDot, dSq90, dArc, dLbl],
  );

  const drawMCQDiagram = useCallback(
    (c: CanvasRenderingContext2D, w: number, h: number, type: string) => {
      c.clearRect(0, 0, w, h);
      c.fillStyle = "#fff";
      c.fillRect(0, 0, w, h);
      dGrid(c, w, h, 0.5);
      const cx = w / 2,
        cy = h / 2,
        L = Math.min(w, h) * 0.28,
        th = w < 400 ? 2.5 : 3.5,
        as = Math.min(7, w * 0.012);
      if (type === "perpendicular") {
        dSeg(c, cx - L, cy, cx + L, cy, DS.primary, th, 1);
        dSeg(c, cx, cy - L, cx, cy + L, DS.accent, th, 1);
        dArr(c, cx - L, cy, Math.PI, as, DS.primary, 1);
        dArr(c, cx + L, cy, 0, as, DS.primary, 1);
        dArr(c, cx, cy - L, -Math.PI / 2, as, DS.accent, 1);
        dArr(c, cx, cy + L, Math.PI / 2, as, DS.accent, 1);
        dSq90(c, cx, cy, Math.min(16, w * 0.025), 0, 1);
        dDot(c, cx, cy, 5, DS.primary, 1);
      } else if (type === "parallel") {
        const g = Math.min(35, h * 0.12);
        dSeg(c, cx - L, cy - g, cx + L, cy - g, DS.primary, th, 1);
        dSeg(c, cx - L, cy + g, cx + L, cy + g, DS.accent, th, 1);
        dArr(c, cx - L, cy - g, Math.PI, as, DS.primary, 1);
        dArr(c, cx + L, cy - g, 0, as, DS.primary, 1);
        dArr(c, cx - L, cy + g, Math.PI, as, DS.accent, 1);
        dArr(c, cx + L, cy + g, 0, as, DS.accent, 1);
        c.save();
        c.globalAlpha = 0.6;
        c.fillStyle = DS.primary;
        c.beginPath();
        c.moveTo(cx + 5, cy - g);
        c.lineTo(cx - 3, cy - g - 4);
        c.lineTo(cx - 3, cy - g + 4);
        c.closePath();
        c.fill();
        c.fillStyle = DS.accent;
        c.beginPath();
        c.moveTo(cx + 5, cy + g);
        c.lineTo(cx - 3, cy + g - 4);
        c.lineTo(cx - 3, cy + g + 4);
        c.closePath();
        c.fill();
        c.restore();
      } else if (type === "converging") {
        dSeg(
          c,
          cx - L * 1.2,
          cy - L * 0.6,
          cx - L * 0.2,
          cy - L * 0.1,
          DS.primary,
          th,
          1,
        );
        dSeg(
          c,
          cx - L * 1.2,
          cy + L * 0.6,
          cx - L * 0.2,
          cy + L * 0.1,
          DS.accent,
          th,
          1,
        );
        dDot(c, cx - L * 1.2, cy - L * 0.6, 4, DS.primary, 1);
        dDot(c, cx - L * 0.2, cy - L * 0.1, 4, DS.primary, 1);
        dDot(c, cx - L * 1.2, cy + L * 0.6, 4, DS.accent, 1);
        dDot(c, cx - L * 0.2, cy + L * 0.1, 4, DS.accent, 1);
        dSeg(
          c,
          cx - L * 0.2,
          cy - L * 0.1,
          cx + L * 0.4,
          cy,
          DS.primary,
          1.5,
          1,
          true,
          0.35,
        );
        dSeg(
          c,
          cx - L * 0.2,
          cy + L * 0.1,
          cx + L * 0.4,
          cy,
          DS.accent,
          1.5,
          1,
          true,
          0.35,
        );
        dDot(c, cx + L * 0.4, cy, 5, DS.gradFrom, 1);
      } else if (type === "obtuse_angle") {
        const aFG = (210 * Math.PI) / 180,
          aFH = ((210 - 115.3) * Math.PI) / 180;
        dSeg(
          c,
          cx,
          cy,
          cx + Math.cos(aFG) * L,
          cy + Math.sin(aFG) * L,
          DS.primary,
          th,
          1,
        );
        dSeg(
          c,
          cx,
          cy,
          cx + Math.cos(aFH) * L,
          cy + Math.sin(aFH) * L,
          DS.accent,
          th,
          1,
        );
        dArc(c, cx, cy, aFH, aFG, Math.min(28, L * 0.4), DS.gradFrom, 2.5, 1);
        dDot(c, cx, cy, 6, DS.gradFrom, 1);
        dBadge(
          c,
          "115.3°",
          cx + Math.cos((aFH + aFG) / 2) * Math.min(55, L * 0.6),
          cy + Math.sin((aFH + aFG) / 2) * Math.min(55, L * 0.6),
          DS.accent,
          "#fff",
          w < 400 ? 10 : 12,
          1,
        );
      } else {
        dSeg(c, cx - L, cy - 20, cx + L, cy - 20, DS.primary, th, 1);
        dSeg(c, cx - L, cy + 20, cx + L, cy + 20, DS.accent, th, 1);
      }
    },
    [dGrid, dSeg, dArr, dDot, dSq90, dArc, dLbl, dBadge],
  );

  // ── Real World Step Renderers ──
  const s20 = useCallback(
    (c: CanvasRenderingContext2D, w: number, h: number, p: number) => {
      dGrid(c, w, h, 0.6);
      const th = w < 400 ? 2.5 : 3.5,
        lfs = w < 300 ? 9 : w < 500 ? 10 : 11;
      // Door Frame
      const dx = w * 0.18,
        dy = h * 0.18,
        dw2 = w * 0.22,
        dh2 = h * 0.62;
      const p1 = cl(p * 2.5);
      dSeg(c, dx, dy, dx, dy + dh2, DS.primary, th, p1);
      dSeg(
        c,
        dx + dw2,
        dy,
        dx + dw2,
        dy + dh2,
        DS.primary,
        th,
        cl((p - 0.05) * 2.5),
      );
      dSeg(c, dx, dy, dx + dw2, dy, DS.accent, th, cl((p - 0.1) * 2.5));
      const sq = Math.min(12, w * 0.02);
      dSq90(c, dx, dy, sq, 0, cl((p - 0.25) * 3));
      dSq90(c, dx + dw2, dy, sq, -Math.PI / 2, cl((p - 0.25) * 3));
      dSeg(
        c,
        dx - 20,
        dy + dh2,
        dx + dw2 + 20,
        dy + dh2,
        DS.grayLight,
        2,
        cl((p - 0.15) * 2.5),
      );
      dSq90(c, dx, dy + dh2, sq * 0.8, Math.PI / 2, cl((p - 0.3) * 3));
      dBadge(
        c,
        "Door Frame",
        dx + dw2 / 2,
        dy - 16,
        DS.primary,
        "#fff",
        lfs,
        cl((p - 0.35) * 3),
      );
      // Textbook
      const bx = w * 0.44,
        by = h * 0.22,
        bw2 = w * 0.18,
        bh2 = h * 0.46;
      const p2 = cl((p - 0.2) * 2.5);
      dSeg(c, bx, by, bx + bw2, by, DS.accent, th - 0.5, p2);
      dSeg(
        c,
        bx + bw2,
        by,
        bx + bw2,
        by + bh2,
        DS.accent,
        th - 0.5,
        cl((p - 0.25) * 2.5),
      );
      dSeg(
        c,
        bx + bw2,
        by + bh2,
        bx,
        by + bh2,
        DS.accent,
        th - 0.5,
        cl((p - 0.3) * 2.5),
      );
      dSeg(c, bx, by + bh2, bx, by, DS.accent, th - 0.5, cl((p - 0.35) * 2.5));
      dSq90(c, bx + bw2, by, sq, -Math.PI / 2, cl((p - 0.4) * 3));
      const rlP = cl((p - 0.45) * 2.5);
      if (rlP > 0) {
        c.save();
        c.globalAlpha = 0.25 * cl(rlP);
        c.strokeStyle = "#93c5fd";
        c.lineWidth = 1;
        const lg = bh2 / 8;
        for (let i = 1; i < 8; i++) {
          const ly = by + lg * i;
          c.beginPath();
          c.moveTo(bx + 4, ly);
          c.lineTo(bx + bw2 - 4, ly);
          c.stroke();
        }
        c.restore();
      }
      dBadge(
        c,
        "Textbook",
        bx + bw2 / 2,
        by - 16,
        DS.accent,
        "#fff",
        lfs,
        cl((p - 0.4) * 3),
      );
      // Table
      const tx = w * 0.72,
        ty = h * 0.22,
        tw = w * 0.2,
        tl = h * 0.38;
      const p3 = cl((p - 0.35) * 2.5);
      dSeg(c, tx, ty, tx + tw, ty, DS.primary, th + 0.5, p3);
      dSeg(
        c,
        tx + 8,
        ty,
        tx + 8,
        ty + tl,
        DS.accent,
        th - 0.5,
        cl((p - 0.42) * 2.5),
      );
      dSeg(
        c,
        tx + tw - 8,
        ty,
        tx + tw - 8,
        ty + tl,
        DS.accent,
        th - 0.5,
        cl((p - 0.46) * 2.5),
      );
      dSeg(
        c,
        tx - 10,
        ty + tl,
        tx + tw + 10,
        ty + tl,
        DS.grayLight,
        2,
        cl((p - 0.4) * 2.5),
      );
      dSq90(c, tx + 8, ty, sq * 0.8, 0, cl((p - 0.5) * 3));
      dSq90(c, tx + tw - 8, ty, sq * 0.8, -Math.PI / 2, cl((p - 0.52) * 3));
      dBadge(
        c,
        w < 400 ? "Desk" : "Desk / Table",
        tx + tw / 2,
        ty - 16,
        DS.primary,
        "#fff",
        lfs,
        cl((p - 0.5) * 3),
      );
      dLbl(
        c,
        "Perpendicular lines are everywhere — right angles at 90°!",
        w / 2,
        h - 14,
        DS.grayLight,
        w < 400 ? 8 : 11,
        cl((p - 0.75) * 4),
        true,
      );
    },
    [dGrid, dSeg, dSq90, dLbl, dBadge],
  );

  const s21 = useCallback(
    (c: CanvasRenderingContext2D, w: number, h: number, p: number) => {
      dGrid(c, w, h, 0.6);
      const th = w < 400 ? 2.5 : 3.5,
        lfs = w < 300 ? 9 : w < 500 ? 10 : 11;
      // Railway
      const rx = w * 0.06,
        ry = h * 0.15,
        rw = w * 0.26,
        rh = h * 0.6;
      const p1 = cl(p * 2.5),
        tG = rw * 0.55,
        lX = rx + (rw - tG) / 2,
        rX = lX + tG;
      dSeg(c, lX, ry, lX, ry + rh, DS.primary, th, p1);
      dSeg(c, rX, ry, rX, ry + rh, DS.primary, th, cl((p - 0.05) * 2.5));
      const slP = cl((p - 0.15) * 2.5);
      if (slP > 0) {
        const nS = 8,
          gap = rh / (nS + 1);
        c.save();
        for (let i = 1; i <= nS; i++) {
          const sy = ry + gap * i,
            sp = cl((slP - i * 0.04) * 2);
          if (sp <= 0) continue;
          c.globalAlpha = sp;
          c.strokeStyle = DS.soft1;
          c.lineWidth = Math.min(5, w * 0.008);
          c.lineCap = "round";
          c.beginPath();
          c.moveTo(lX - 10, sy);
          c.lineTo(rX + 10, sy);
          c.stroke();
        }
        c.restore();
        const rY = ry + gap * 3;
        dSq90(c, lX, rY, Math.min(8, w * 0.013), 0, cl((p - 0.35) * 3));
      }
      dBadge(
        c,
        "Railway",
        rx + rw / 2,
        ry - 16,
        DS.primary,
        "#fff",
        lfs,
        cl((p - 0.3) * 3),
      );
      // Notebook
      const nx = w * 0.38,
        ny = h * 0.15,
        nw = w * 0.22,
        nh = h * 0.6;
      const p2 = cl((p - 0.2) * 2.5);
      dSeg(c, nx, ny, nx + nw, ny, DS.grayLight, 2, p2);
      dSeg(
        c,
        nx + nw,
        ny,
        nx + nw,
        ny + nh,
        DS.grayLight,
        2,
        cl((p - 0.22) * 2.5),
      );
      dSeg(
        c,
        nx + nw,
        ny + nh,
        nx,
        ny + nh,
        DS.grayLight,
        2,
        cl((p - 0.24) * 2.5),
      );
      dSeg(c, nx, ny + nh, nx, ny, DS.grayLight, 2, cl((p - 0.26) * 2.5));
      const lnP = cl((p - 0.3) * 2.5);
      if (lnP > 0) {
        const nL = 10,
          lg = nh / (nL + 1);
        for (let i = 1; i <= nL; i++) {
          const ly = ny + lg * i,
            lp = cl((lnP - i * 0.03) * 2);
          if (lp <= 0) continue;
          dSeg(c, nx + 4, ly, nx + nw - 4, ly, "#93c5fd", 1.5, lp, false, 0.7);
        }
      }
      dSeg(
        c,
        nx + nw * 0.15,
        ny + 4,
        nx + nw * 0.15,
        ny + nh - 4,
        "#ef4444",
        1.5,
        cl((p - 0.38) * 3),
        false,
        0.45,
      );
      dBadge(
        c,
        "Notebook",
        nx + nw / 2,
        ny - 16,
        DS.accent,
        "#fff",
        lfs,
        cl((p - 0.35) * 3),
      );
      // Ladder
      const lx = w * 0.7,
        ly = h * 0.1,
        lw2 = w * 0.12,
        lh2 = h * 0.7;
      const p3 = cl((p - 0.35) * 2.5),
        tOff = lw2 * 0.1;
      dSeg(c, lx + tOff, ly, lx, ly + lh2, DS.primary, th, p3);
      dSeg(
        c,
        lx + lw2 - tOff,
        ly,
        lx + lw2,
        ly + lh2,
        DS.primary,
        th,
        cl((p - 0.38) * 2.5),
      );
      const rgP = cl((p - 0.42) * 2.5);
      if (rgP > 0) {
        const nR = 7,
          gap = lh2 / (nR + 1);
        for (let i = 1; i <= nR; i++) {
          const ry2 = ly + gap * i,
            t2 = i / (nR + 1),
            lRX = lx + tOff * (1 - t2),
            rRX = lx + lw2 - tOff * (1 - t2),
            rp = cl((rgP - i * 0.04) * 2);
          if (rp <= 0) continue;
          dSeg(c, lRX, ry2, rRX, ry2, DS.accent, th - 0.5, rp);
        }
      }
      dBadge(
        c,
        "Ladder",
        lx + lw2 / 2,
        ly - 16,
        DS.primary,
        "#fff",
        lfs,
        cl((p - 0.48) * 3),
      );
      dLbl(
        c,
        "Parallel lines stay the same distance apart!",
        w / 2,
        h - 14,
        DS.grayLight,
        w < 400 ? 8 : 11,
        cl((p - 0.7) * 4),
        true,
      );
    },
    [dGrid, dSeg, dSq90, dLbl, dBadge],
  );

  const draw = useCallback(
    (c: CanvasRenderingContext2D, w: number, h: number, p: number) => {
      c.clearRect(0, 0, w, h);
      c.fillStyle = "#fff";
      c.fillRect(0, 0, w, h);
      switch (cs?.id ?? 1) {
        case 1:
          s1(c, w, h, p);
          break;
        case 2:
          s2(c, w, h, p);
          break;
        case 3:
          s3(c, w, h, p);
          break;
        case 4:
          s4(c, w, h, p);
          break;
        case 5:
          s5(c, w, h, p);
          break;
        case 6:
          s6(c, w, h, p);
          break;
        case 20:
          s20(c, w, h, p);
          break;
        case 21:
          s21(c, w, h, p);
          break;
        default:
          dGrid(c, w, h, 1);
          dLbl(
            c,
            cs?.title || "",
            w / 2,
            h / 2,
            DS.gray,
            w < 400 ? 13 : 16,
            p,
            true,
          );
      }
    },
    [cs, s1, s2, s3, s4, s5, s6, s20, s21, dGrid, dLbl],
  );

  // ── RESPONSIVE Canvas animation loop ──
  useEffect(() => {
    const cv = cvRef.current;
    if (!cv) return;
    const c = cv.getContext("2d");
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    const pad = isMobile ? 24 : isTablet ? 32 : 48;
    const dw = Math.max(200, cw - pad);
    const dh = R.canvasH;
    cv.width = dw * dpr;
    cv.height = dh * dpr;
    cv.style.width = "100%";
    cv.style.height = dh + "px";
    c.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (cs?.mode === "practice" && cs?.data) {
      drawMCQDiagram(c, dw, dh, cs.data.image);
      return;
    }

    let t0: number | null = null;
    const dur = 1800 / cfg.speed;
    const anim = (ts: number) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / dur, 1);
      progRef.current = p;
      draw(c, dw, dh, p);
      if (p < 1) afRef.current = requestAnimationFrame(anim);
    };
    afRef.current = requestAnimationFrame(anim);
    return () => {
      if (afRef.current) cancelAnimationFrame(afRef.current);
    };
  }, [cs, draw, drawMCQDiagram, cfg.speed, cw, isMobile, isTablet, R.canvasH]);

  useEffect(() => {
    if (setStepDetails)
      setStepDetails({
        currentStep: si + 1,
        totalSteps: fS.length,
        isPaused: !playing,
        currentMode: mode,
      });
  }, [si, fS.length, playing, mode, setStepDetails]);
  useEffect(() => {
    if (!playing || stopAutoNext || cfg.auto === 0) return;
    const t = setTimeout(() => {
      if (si < fS.length - 1) go("next");
      else setPlaying(false);
    }, cfg.auto);
    return () => clearTimeout(t);
  }, [playing, si, stopAutoNext, fS.length, cfg.auto]);

  const go = useCallback(
    (d: "next" | "prev") => {
      if (trans) return;
      setTrans(true);
      setCOp(0);
      setCTf(d === "next" ? "translateY(-20px)" : "translateY(20px)");
      setTimeout(() => {
        setSi((p) => (d === "next" ? p + 1 : p - 1));
        setSelected(null);
        setAnswered(false);
        setCTf(d === "next" ? "translateY(20px)" : "translateY(-20px)");
        setTimeout(() => {
          setCOp(1);
          setCTf("translateY(0)");
          setTrans(false);
        }, 50);
      }, 250);
    },
    [trans],
  );
  const next = () => {
    if (si < fS.length - 1 && !trans) go("next");
  };
  const prev = () => {
    if (si > 0 && !trans) go("prev");
  };
  const chM = (m: ModeType) => {
    if (m === mode) return;
    setTrans(true);
    setCOp(0);
    setTimeout(() => {
      setMode(m);
      setSi(0);
      setSelected(null);
      setAnswered(false);
      setScore(0);
      setShowResult(false);
      setTimeout(() => {
        setCOp(1);
        setTrans(false);
      }, 50);
    }, 250);
  };
  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (cs?.data && idx === cs.data.correct) setScore((s) => s + 1);
  };

  const practiceSteps = fS.filter((s) => s.mode === "practice");
  const isLastPractice =
    mode === "practice" && si === fS.length - 1 && answered;
  const MC: Record<ModeType, { f: string; t: string }> = {
    learn: { f: DS.primary, t: "#6366f1" },
    practice: { f: DS.gradFrom, t: DS.gradTo },
    real_world: { f: DS.accent, t: "#f97316" },
    hands_on: { f: "#ef4444", t: "#f87171" },
  };
  const MI: Record<ModeType, string> = {
    learn: "📖",
    practice: "✏️",
    real_world: "🌍",
    hands_on: "🖐️",
  };
  const MN: Record<ModeType, string> = {
    learn: "Learn",
    practice: "Practice",
    real_world: "Real World",
    hands_on: "Hands On",
  };
  const isPractice = cs?.mode === "practice" && cs?.data;
  const prevDis = si === 0 || trans;
  const nextDis = si === fS.length - 1 || trans || (isPractice && !answered);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        maxWidth: cfg.w,
        margin: "0 auto",
        background: DS.white,
        borderRadius: R.radius,
        overflow: "hidden",
        boxShadow:
          "0 8px 40px rgba(74,77,201,0.12), 0 0 0 1px rgba(74,77,201,0.06)",
        fontFamily: DS.font,
        boxSizing: "border-box",
      }}
    >
      {/* Mode Tabs — icon-only on mobile */}
      {cfg.showMode && (
        <div
          style={{
            display: "flex",
            gap: R.gap,
            padding: `${R.padSm}px ${R.pad}px`,
            background: DS.grayBg,
            borderBottom: `1px solid ${DS.border}`,
            justifyContent: "center",
            flexWrap: "wrap" as const,
          }}
        >
          {cfg.modes.map((m) => {
            const sel = mode === m,
              mc = MC[m];
            return (
              <button
                key={m}
                onClick={() => chM(m)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: R.modeShowLabel ? 6 : 0,
                  padding: R.modeShowLabel ? R.btnPadSm : "8px 12px",
                  borderRadius: 40,
                  border: sel ? "none" : `1.5px solid ${DS.primary}40`,
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: R.fontSize.btn,
                  fontFamily: DS.font,
                  transition: "all .25s cubic-bezier(.4,0,.2,1)",
                  background: sel
                    ? `linear-gradient(135deg,${mc.f},${mc.t})`
                    : DS.white,
                  color: sel ? "#fff" : DS.primary,
                  boxShadow: sel ? `0 4px 16px ${mc.f}28` : "none",
                  minWidth: 44,
                  minHeight: 40,
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: isMobile ? 18 : 15 }}>{MI[m]}</span>
                {R.modeShowLabel && MN[m]}
              </button>
            );
          })}
        </div>
      )}

      {/* Header */}
      <div
        style={{
          padding: `${R.pad - 4}px ${R.pad}px`,
          color: "#fff",
          background: `linear-gradient(135deg,${MC[mode].f},${MC[mode].t})`,
          position: "relative" as const,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute" as const,
            top: -20,
            right: -20,
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
          }}
        />
        <h2
          style={{
            fontSize: R.fontSize.title,
            fontWeight: 700,
            fontFamily: DS.font,
            animation: "fadeUp .5s ease-out",
            margin: 0,
            position: "relative" as const,
            zIndex: 1,
          }}
        >
          {cs?.title}
        </h2>
        {cfg.showStep && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              background: "rgba(255,255,255,.15)",
              padding: `4px ${R.padSm}px`,
              borderRadius: 40,
              fontSize: R.fontSize.small,
              fontWeight: 500,
              marginTop: 8,
              position: "relative" as const,
              zIndex: 1,
            }}
          >
            Step {si + 1}/{fS.length}
            {mode === "practice" && ` · ${score}/${practiceSteps.length}`}
          </span>
        )}
      </div>

      {/* Progress */}
      <div
        style={{
          height: 3,
          background: DS.border,
          margin: `0 ${R.pad}px ${R.padSm}px`,
        }}
      >
        <div
          style={{
            height: "100%",
            background: `linear-gradient(90deg,${MC[mode].f},${MC[mode].t})`,
            borderRadius: 2,
            transition: "width .4s ease",
            width: `${((si + 1) / fS.length) * 100}%`,
          }}
        />
      </div>

      {/* Content */}
      <div
        style={{
          padding: `${R.padSm}px ${R.pad}px`,
          opacity: cOp,
          transform: cTf,
          transition: `all ${250 / cfg.speed}ms ease`,
        }}
      >
        <canvas
          ref={cvRef}
          style={{
            width: "100%",
            borderRadius: isMobile ? 10 : 14,
            marginBottom: R.padSm,
            border: `1px solid ${DS.border}`,
            display: "block",
            background: "#fefefe",
          }}
        />

        {!isPractice && (
          <div
            style={{
              fontSize: R.fontSize.body,
              lineHeight: 1.75,
              color: DS.gray,
              padding: `${R.padSm}px ${R.pad - 4}px`,
              background: DS.grayBg,
              borderRadius: isMobile ? 10 : 14,
              borderLeft: `3px solid ${MC[mode].f}`,
              fontWeight: 500,
            }}
          >
            {cs?.description}
          </div>
        )}

        {isPractice && (
          <div style={{ marginTop: 4 }}>
            <p
              style={{
                fontSize: R.fontSize.body + 1,
                fontWeight: 600,
                color: DS.gray,
                margin: `0 0 ${R.padSm}px`,
              }}
            >
              {cs.data.question}
            </p>
            <div
              style={{ display: "flex", flexDirection: "column", gap: R.gap }}
            >
              {cs.data.options.map((opt: string, idx: number) => {
                const isCorrect = idx === cs.data.correct,
                  isSelected = selected === idx;
                let bg = DS.white,
                  bdr = `1.5px solid ${DS.border}`,
                  clr = DS.gray,
                  ic = null as ReactNode;
                if (answered) {
                  if (isCorrect) {
                    bg = DS.soft2;
                    bdr = `2px solid ${DS.success}`;
                    clr = "#065F46";
                    ic = <Check size={R.iconSz} color={DS.success} />;
                  } else if (isSelected) {
                    bg = "#FEF2F2";
                    bdr = `2px solid ${DS.error}`;
                    clr = "#991B1B";
                    ic = <X size={R.iconSz} color={DS.error} />;
                  }
                } else if (isSelected) {
                  bg = DS.soft1 + "25";
                  bdr = `2px solid ${DS.primary}`;
                  clr = DS.primary;
                }
                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: isMobile ? 8 : 12,
                      padding: `${isMobile ? 10 : 12}px ${isMobile ? 12 : 18}px`,
                      borderRadius: isMobile ? 10 : 14,
                      border: bdr,
                      background: bg,
                      cursor: answered ? "default" : "pointer",
                      fontFamily: DS.font,
                      fontSize: R.fontSize.body,
                      fontWeight: 500,
                      color: clr,
                      textAlign: "left" as const,
                      transition: "all .2s ease",
                      animation:
                        answered && isSelected && !isCorrect
                          ? "shake .4s ease"
                          : "none",
                      minHeight: 44,
                    }}
                  >
                    <span
                      style={{
                        width: isMobile ? 24 : 28,
                        height: isMobile ? 24 : 28,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: isMobile ? 10 : 12,
                        fontWeight: 700,
                        flexShrink: 0,
                        background:
                          answered && isCorrect
                            ? DS.success
                            : answered && isSelected
                              ? DS.error
                              : DS.grayBg,
                        color:
                          answered && (isCorrect || isSelected)
                            ? "#fff"
                            : DS.gray,
                        transition: "all .2s ease",
                      }}
                    >
                      {ic || String.fromCharCode(65 + idx)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
            {answered && (
              <div
                style={{
                  marginTop: R.padSm,
                  padding: `${R.padSm}px ${R.pad - 4}px`,
                  borderRadius: isMobile ? 10 : 14,
                  background:
                    selected === cs.data.correct ? DS.soft2 : "#FEF2F2",
                  border: `1px solid ${selected === cs.data.correct ? DS.success : DS.error}20`,
                  animation: "popScale .3s ease-out",
                  fontSize: R.fontSize.body - 1,
                  lineHeight: 1.65,
                  color: DS.gray,
                }}
              >
                <strong
                  style={{
                    color: selected === cs.data.correct ? "#065F46" : "#991B1B",
                  }}
                >
                  {selected === cs.data.correct ? "✓ Correct!" : "✗ Not quite!"}
                </strong>
                <br />
                {cs.data.explanation}
              </div>
            )}
            {isLastPractice && (
              <div
                style={{
                  marginTop: R.pad - 4,
                  padding: `${R.pad - 4}px`,
                  borderRadius: isMobile ? 12 : 16,
                  background: `linear-gradient(135deg,${DS.gradFrom}0D,${DS.gradTo}0D)`,
                  border: `1.5px solid ${DS.gradFrom}18`,
                  textAlign: "center" as const,
                  animation: "popScale .4s ease-out",
                }}
              >
                <div
                  style={{
                    fontSize: isMobile ? 24 : 30,
                    fontWeight: 800,
                    background: `linear-gradient(135deg,${DS.gradFrom},${DS.gradTo})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {score}/{practiceSteps.length}
                </div>
                <div
                  style={{
                    fontSize: R.fontSize.body,
                    color: DS.gray,
                    marginTop: 6,
                    fontWeight: 500,
                  }}
                >
                  {score === practiceSteps.length
                    ? "🎉 Perfect Score!"
                    : score >= 3
                      ? "👍 Good job!"
                      : "📚 Keep learning!"}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation — compact on mobile */}
      <div
        style={{
          display: cfg.showNav || cfg.showPlay ? "flex" : "none",
          justifyContent: "space-between",
          alignItems: "center",
          padding: `${R.padSm}px ${R.pad}px`,
          background: DS.grayBg,
          borderTop: `1px solid ${DS.border}`,
          gap: R.gap,
        }}
      >
        <button
          onClick={prev}
          disabled={prevDis}
          style={{
            display: cfg.showNav ? "flex" : "none",
            alignItems: "center",
            gap: isMobile ? 2 : 4,
            padding: R.btnPad,
            borderRadius: 40,
            minHeight: 44,
            minWidth: 44,
            justifyContent: "center",
            border: prevDis
              ? `1.5px solid ${DS.border}`
              : `1.5px solid ${DS.primary}`,
            cursor: prevDis ? "not-allowed" : "pointer",
            fontWeight: 600,
            fontSize: R.fontSize.btn,
            fontFamily: DS.font,
            transition: "all .2s ease",
            background: DS.white,
            color: prevDis ? DS.grayLight : DS.primary,
            opacity: prevDis ? 0.5 : 1,
          }}
        >
          <ChevronLeft size={R.iconSz} />
          {!isMobile && " Previous"}
        </button>
        {mode !== "practice" && (
          <button
            onClick={() => setPlaying(!playing)}
            style={{
              display: cfg.showPlay ? "flex" : "none",
              alignItems: "center",
              gap: isMobile ? 3 : 5,
              padding: R.btnPad,
              borderRadius: 40,
              border: "none",
              minHeight: 44,
              justifyContent: "center",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: R.fontSize.btn,
              fontFamily: DS.font,
              color: "#fff",
              transition: "all .2s ease",
              background: DS.accent,
              boxShadow: `0 3px 12px ${DS.accent}30`,
            }}
          >
            {playing ? <Pause size={R.iconSz} /> : <Play size={R.iconSz} />}
            {!isMobile && (playing ? " Pause" : " Play")}
          </button>
        )}
        <button
          onClick={next}
          disabled={nextDis}
          style={{
            display: cfg.showNav ? "flex" : "none",
            alignItems: "center",
            gap: isMobile ? 2 : 4,
            padding: R.btnPad,
            borderRadius: 40,
            border: "none",
            minHeight: 44,
            minWidth: 44,
            justifyContent: "center",
            cursor: nextDis ? "not-allowed" : "pointer",
            fontWeight: 600,
            fontSize: R.fontSize.btn,
            fontFamily: DS.font,
            transition: "all .2s ease",
            background: nextDis ? DS.border : DS.primary,
            color: nextDis ? DS.grayLight : "#fff",
            opacity: nextDis ? 0.5 : 1,
            boxShadow: nextDis ? "none" : `0 3px 12px ${DS.primary}28`,
          }}
        >
          {!isMobile && "Next "}
          <ChevronRight size={R.iconSz} />
        </button>
      </div>
    </div>
  );
};
export default LineSegmentExplorer;
