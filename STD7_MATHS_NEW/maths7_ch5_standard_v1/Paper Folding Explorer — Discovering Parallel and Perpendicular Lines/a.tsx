// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: paper_folding_explorer.tsx
// ═══════════════════════════════════════════════════════════════════════════

/**
 * NOTE:
 * This file is self-contained (no external React/icon imports) so it can be
 * typechecked in setups where React is provided globally.
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
const RotateCcw = (p: IconProps) => (
  <IconBase {...p}>
    <path d="M3 2v6h6" />
    <path d="M3.5 13a9 9 0 1 0 2-5.7L3 8" />
  </IconBase>
);
const BookOpen = (p: IconProps) => (
  <IconBase {...p}>
    <path d="M12 19c-2.5-1.6-5-2-8-2V5c3 0 5.5.4 8 2" />
    <path d="M12 19c2.5-1.6 5-2 8-2V5c-3 0-5.5.4-8 2" />
  </IconBase>
);
const Eye = (p: IconProps) => (
  <IconBase {...p}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </IconBase>
);
const EyeOff = (p: IconProps) => (
  <IconBase {...p}>
    <path d="M3 3l18 18" />
    <path d="M10.6 10.6a3 3 0 0 0 4.2 4.2" />
    <path d="M9.9 5.1A10.7 10.7 0 0 1 12 5c6.5 0 10 7 10 7a18 18 0 0 1-3.2 4.4" />
    <path d="M6.2 6.2C3.8 8.1 2 12 2 12s3.5 7 10 7c1.1 0 2.1-.2 3-.5" />
  </IconBase>
);
const Lightbulb = (p: IconProps) => (
  <IconBase {...p}>
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M12 2a7 7 0 0 0-4 12c.7.6 1 1.2 1 2h6c0-.8.3-1.4 1-2a7 7 0 0 0-4-12z" />
  </IconBase>
);

// ==================== TYPE DEFINITIONS ====================

type ModeType = "learn" | "explore";

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
  instruction: string;
  type: "intro" | "fold" | "challenge";
  mode: ModeType;
  data?: any;
}

interface BaseDataInterface {
  themeColor?: string;
  autoPlayDuration?: number;
}

interface PaperFoldingAdditionalProps {
  sheetColor?: string;
  showLabels?: boolean;
  animationDuration?: number;
  startStep?: number;
  showCounter?: boolean;
  showTeachingNotes?: boolean;
  highlightEdges?: boolean;
}

interface PaperFoldingExplorerProps {
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
    additionalProps?: PaperFoldingAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== SINGULARITY DESIGN TOKENS ====================

const DS = {
  colors: {
    primary: "#4A4DC9",
    primaryDark: "#533086",
    primaryLight: "#C1C1EA",
    primaryBg: "#EDEDF8",
    accent: "#FF7212",
    accentDark: "#FC9145",
    accentLight: "#FFF3E4",
    gray900: "#1A1A2E",
    gray700: "#4E4E4E",
    gray400: "#CACACA",
    gray200: "#EBEBEB",
    gray100: "#F5F5F5",
    white: "#FFFFFF",
    danger: "#E53E3E",
    gradientHeader: "linear-gradient(135deg, #533086 0%, #4A4DC9 100%)",
    gradientAccent: "linear-gradient(135deg, #FF7212 0%, #FC9145 100%)",
    gradientPrimary:
      "linear-gradient(135deg, #533086 0%, #4A4DC9 50%, #FC9145 100%)",
  },
  fonts: { primary: "'Poppins', sans-serif" },
  radii: { sm: 8, md: 12, lg: 16, xl: 24, pill: 999 },
  shadows: {
    sm: "0 2px 8px rgba(74,77,201,0.08)",
    md: "0 4px 20px rgba(74,77,201,0.12)",
    lg: "0 12px 40px rgba(83,48,134,0.18)",
    xl: "0 20px 60px rgba(83,48,134,0.22)",
    button: "0 4px 14px rgba(74,77,201,0.30)",
    accent: "0 4px 14px rgba(255,114,18,0.30)",
  },
};

// ==================== DEFAULT STEPS ====================

const DEFAULT_STEPS: StepDataInterface[] = [
  {
    id: 1,
    title: "The Square Sheet",
    description:
      "Observe the square sheet of paper. The opposite edges (top-bottom and left-right) are parallel to each other. The adjacent edges meet at right angles — they are perpendicular.",
    instruction:
      "Look at the arrow marks (▶) on parallel edges and the square symbols (□) at the perpendicular corners. Opposite edges are parallel, adjacent edges are perpendicular!",
    type: "intro",
    mode: "learn",
  },
  {
    id: 2,
    title: "First Horizontal Fold",
    description:
      "We fold the sheet horizontally in half. When we unfold, a crease line appears in the middle — parallel to the top and bottom edges.",
    instruction:
      "Count the horizontal parallel lines: top edge, crease, and bottom edge — that's 3 parallel lines! The crease is also perpendicular to the vertical edges.",
    type: "fold",
    mode: "learn",
  },
  {
    id: 3,
    title: "Second Horizontal Fold",
    description:
      "Fold the sheet horizontally once more. Two new crease lines appear, giving us 5 horizontal parallel lines in total.",
    instruction:
      "Can you see 5 horizontal parallel lines now? Can you predict how many a third fold would create? (Hint: each fold doubles the sections.)",
    type: "fold",
    mode: "learn",
  },
  {
    id: 4,
    title: "Vertical Fold",
    description:
      "Now fold the sheet vertically. This vertical crease is perpendicular to ALL the horizontal lines! See the square symbols (□) at every intersection.",
    instruction:
      "The vertical line meets every horizontal line at 90°. Count all the perpendicular corners marked with □ symbols!",
    type: "fold",
    mode: "learn",
  },
  {
    id: 5,
    title: "Diagonal Fold — A Challenge!",
    description:
      "Fold the sheet along a diagonal from one corner to the opposite. Can you find another fold that creates a line parallel to this diagonal?",
    instruction:
      "The diagonal crease is neither parallel nor perpendicular to the horizontal/vertical lines. Can you imagine folding to make a parallel diagonal?",
    type: "challenge",
    mode: "learn",
  },
];

// ==================== ANIMATION HELPERS ====================

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
const easeInOutQuad = (t: number): number =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

// ==================== RESPONSIVE HOOK ====================

const useResponsive = () => {
  const [size, setSize] = useState({
    w: typeof window !== "undefined" ? window.innerWidth : 800,
    h: typeof window !== "undefined" ? window.innerHeight : 600,
  });
  useEffect(() => {
    const handle = () =>
      setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);
  return {
    ...size,
    isMobile: size.w < 576,
    isTablet: size.w >= 576 && size.w < 992,
    isDesktop: size.w >= 992,
  };
};

// ==================== MAIN COMPONENT ====================

type PaperFoldingExplorerInnerProps =
  NonNullable<PaperFoldingExplorerProps["props"]>;

const PaperFoldingExplorer: FC<PaperFoldingExplorerProps> = ({
  props: incomingProps,
  setStepDetails,
  stopAutoNext,
  setStopAutoNext,
}) => {
  const props: PaperFoldingExplorerInnerProps = incomingProps ?? {};
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const config = useMemo(
    () => ({
      width: props.width ?? 800,
      height: props.height ?? 600,
      initialMode: (props.initialMode ?? "learn") as ModeType,
      showNavigation: props.showNavigation ?? true,
      showPlayPause: props.showPlayPause ?? true,
      showStepIndicator: props.showStepIndicator ?? true,
      animationSpeed: props.animationSpeed ?? 1,
      autoPlayDuration: props.autoPlayDuration ?? 0,
      themeColor: props.themeColor ?? DS.colors.primary,
    }),
    [props],
  );

  const additionalProps = props.additionalProps || {};
  const paperConfig = useMemo(
    () => ({
      sheetColor: additionalProps.sheetColor ?? "#FEFCF9",
      showLabels: additionalProps.showLabels ?? true,
      animationDuration: additionalProps.animationDuration ?? 1200,
      showCounter: additionalProps.showCounter ?? true,
      showTeachingNotes: additionalProps.showTeachingNotes ?? true,
      highlightEdges: additionalProps.highlightEdges ?? true,
    }),
    [additionalProps],
  );

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [foldAnimProgress, setFoldAnimProgress] = useState(0);
  const [isFolding, setIsFolding] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(
    { 0: true } as Record<number, boolean>,
  );
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [contentOpacity, setContentOpacity] = useState(1);
  const [buttonHover, setButtonHover] = useState(null as string | null);
  const [showSidebar, setShowSidebar] = useState(true);
  const canvasRef = useRef(null as any);
  const animFrameRef = useRef(undefined as any);
  const containerRef = useRef(null as any);

  const allSteps = props.steps || DEFAULT_STEPS;
  const currentStep = allSteps[currentStepIndex];

  useEffect(() => {
    if (isMobile) setShowSidebar(false);
    else setShowSidebar(true);
  }, [isMobile]);

  // ─── KEYFRAMES ──────────────────────────────────────
  useEffect(() => {
    const kf = `
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
            @keyframes fadeInUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
            @keyframes slideInRight { from { opacity:0; transform:translateX(30px); } to { opacity:1; transform:translateX(0); } }
            @keyframes popIn { 0%{transform:scale(0);opacity:0} 70%{transform:scale(1.12)} 100%{transform:scale(1);opacity:1} }
            @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
            @keyframes counterPop { 0%{transform:scale(1)} 30%{transform:scale(1.2)} 100%{transform:scale(1)} }
        `;
    const s = document.createElement("style");
    s.id = "pf-kf-v2";
    s.textContent = kf;
    document.head.appendChild(s);
    return () => {
      const e = document.getElementById("pf-kf-v2");
      if (e) document.head.removeChild(e);
    };
  }, []);

  // ─── CANVAS DRAWING ──────────────────────────────────
  const drawPaper = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;
    canvas.width = cw * dpr;
    canvas.height = ch * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, cw, ch);

    const margin = isMobile ? 20 : 32;
    const paperSize = Math.min(cw - margin * 2, ch - margin * 2) * 0.88;
    const px = (cw - paperSize) / 2;
    const py = (ch - paperSize) / 2;
    const stepId = currentStep.id;
    const progress = hasAnimated[currentStepIndex] ? 1 : foldAnimProgress;
    const r = Math.min(10, paperSize * 0.025);

    // Rounded rect helper
    const roundRect = (
      x: number,
      y: number,
      w: number,
      h: number,
      rad: number,
    ) => {
      ctx.beginPath();
      ctx.moveTo(x + rad, y);
      ctx.lineTo(x + w - rad, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + rad);
      ctx.lineTo(x + w, y + h - rad);
      ctx.quadraticCurveTo(x + w, y + h, x + w - rad, y + h);
      ctx.lineTo(x + rad, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - rad);
      ctx.lineTo(x, y + rad);
      ctx.quadraticCurveTo(x, y, x + rad, y);
      ctx.closePath();
    };

    // Paper shadow
    ctx.save();
    ctx.shadowColor = "rgba(83,48,134,0.10)";
    ctx.shadowBlur = 22;
    ctx.shadowOffsetY = 6;
    roundRect(px, py, paperSize, paperSize, r);
    ctx.fillStyle = paperConfig.sheetColor;
    ctx.fill();
    ctx.restore();

    // Grid texture
    ctx.save();
    ctx.globalAlpha = 0.05;
    ctx.strokeStyle = DS.colors.primaryDark;
    ctx.lineWidth = 0.5;
    const g = paperSize / 16;
    for (let i = 1; i < 16; i++) {
      ctx.beginPath();
      ctx.moveTo(px + i * g, py);
      ctx.lineTo(px + i * g, py + paperSize);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(px, py + i * g);
      ctx.lineTo(px + paperSize, py + i * g);
      ctx.stroke();
    }
    ctx.restore();

    // Border
    ctx.strokeStyle = DS.colors.primaryLight;
    ctx.lineWidth = 1.5;
    roundRect(px, py, paperSize, paperSize, r);
    ctx.stroke();

    // Helpers
    const fs = Math.max(10, paperSize * 0.04);
    const off = Math.max(12, paperSize * 0.04);

    const drawArrow = (
      x: number,
      y: number,
      dir: "h" | "v",
      dbl: boolean = false,
    ) => {
      if (!showAnnotations) return;
      ctx.save();
      ctx.fillStyle = dir === "h" ? DS.colors.primary : DS.colors.accent;
      ctx.font = `600 ${fs}px ${DS.fonts.primary}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const sym = dbl ? "▶▶" : "▶";
      if (dir === "v") {
        ctx.translate(x, y);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(sym, 0, 0);
      } else ctx.fillText(sym, x, y);
      ctx.restore();
    };

    const drawSq = (x: number, y: number) => {
      if (!showAnnotations) return;
      const s = Math.max(6, paperSize * 0.026);
      ctx.save();
      ctx.strokeStyle = DS.colors.danger;
      ctx.lineWidth = 1.8;
      ctx.strokeRect(x, y, s, s);
      ctx.fillStyle = "rgba(229,62,62,0.07)";
      ctx.fillRect(x, y, s, s);
      ctx.restore();
    };

    const drawHL = (y: number, crease: boolean, ap: number = 1) => {
      ctx.save();
      ctx.strokeStyle = DS.colors.primary;
      ctx.lineWidth = crease ? 1.8 : 2.5;
      if (crease) ctx.setLineDash([8, 5]);
      ctx.globalAlpha = ap;
      ctx.beginPath();
      ctx.moveTo(px, y);
      ctx.lineTo(px + paperSize * ap, y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    };

    const drawVL = (x: number, crease: boolean, ap: number = 1) => {
      ctx.save();
      ctx.strokeStyle = DS.colors.accent;
      ctx.lineWidth = crease ? 1.8 : 2.5;
      if (crease) ctx.setLineDash([8, 5]);
      ctx.globalAlpha = ap;
      ctx.beginPath();
      ctx.moveTo(x, py);
      ctx.lineTo(x, py + paperSize * ap);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    };

    // ── Step drawing ──
    if (stepId >= 1) {
      ctx.strokeStyle = DS.colors.primary;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + paperSize, py);
      ctx.stroke();
      drawArrow(px + paperSize / 2, py - off, "h");
      ctx.beginPath();
      ctx.moveTo(px, py + paperSize);
      ctx.lineTo(px + paperSize, py + paperSize);
      ctx.stroke();
      drawArrow(px + paperSize / 2, py + paperSize + off, "h");
      ctx.strokeStyle = DS.colors.accent;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px, py + paperSize);
      ctx.stroke();
      drawArrow(px - off, py + paperSize / 2, "v", true);
      ctx.beginPath();
      ctx.moveTo(px + paperSize, py);
      ctx.lineTo(px + paperSize, py + paperSize);
      ctx.stroke();
      drawArrow(px + paperSize + off, py + paperSize / 2, "v", true);
      if (showAnnotations) {
        const cs = Math.max(6, paperSize * 0.026);
        drawSq(px, py);
        drawSq(px + paperSize - cs, py);
        drawSq(px, py + paperSize - cs);
        drawSq(px + paperSize - cs, py + paperSize - cs);
      }
    }
    if (stepId >= 2) {
      const p = stepId === 2 ? progress : 1;
      const ym = py + paperSize / 2;
      drawHL(ym, true, p);
      if (p > 0.5 && showAnnotations)
        drawArrow(px + paperSize / 2, ym - off, "h");
    }
    if (stepId >= 3) {
      const p = stepId === 3 ? progress : 1;
      drawHL(py + paperSize / 4, true, p);
      drawHL(py + (paperSize * 3) / 4, true, p);
      if (p > 0.5 && showAnnotations) {
        drawArrow(px + paperSize / 2, py + paperSize / 4 - off, "h");
        drawArrow(px + paperSize / 2, py + (paperSize * 3) / 4 - off, "h");
      }
    }
    if (stepId >= 4) {
      const p = stepId === 4 ? progress : 1;
      const xm = px + paperSize / 2;
      drawVL(xm, true, p);
      if (p > 0.5 && showAnnotations)
        drawArrow(xm + off, py + paperSize / 2, "v", true);
      if (p > 0.7 && showAnnotations) {
        const hls = [
          py,
          py + paperSize / 4,
          py + paperSize / 2,
          py + (paperSize * 3) / 4,
          py + paperSize,
        ];
        const cs = Math.max(5, paperSize * 0.02);
        hls.forEach((hy) => {
          ctx.save();
          ctx.globalAlpha = Math.min((p - 0.7) * 3.3, 1);
          ctx.strokeStyle = DS.colors.danger;
          ctx.lineWidth = 1.5;
          ctx.strokeRect(xm, hy, cs, cs);
          ctx.fillStyle = "rgba(229,62,62,0.06)";
          ctx.fillRect(xm, hy, cs, cs);
          ctx.restore();
        });
      }
    }
    if (stepId >= 5) {
      const p = stepId === 5 ? progress : 1;
      ctx.save();
      ctx.strokeStyle = DS.colors.primaryDark;
      ctx.lineWidth = 2.5;
      ctx.setLineDash([10, 6]);
      ctx.globalAlpha = p;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + paperSize * p, py + paperSize * p);
      ctx.stroke();
      ctx.setLineDash([]);
      if (p > 0.8 && showAnnotations) {
        ctx.globalAlpha = Math.min((p - 0.8) * 5, 1);
        const qx = px + paperSize * 0.68,
          qy = py + paperSize * 0.32;
        const bw = Math.max(95, paperSize * 0.36),
          bh = Math.max(38, paperSize * 0.13);
        ctx.fillStyle = "rgba(83,48,134,0.07)";
        roundRect(qx - bw / 2, qy - bh / 2, bw, bh, 8);
        ctx.fill();
        ctx.strokeStyle = DS.colors.primaryDark;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([]);
        ctx.stroke();
        ctx.font = `700 ${Math.max(16, paperSize * 0.055)}px ${DS.fonts.primary}`;
        ctx.fillStyle = DS.colors.primaryDark;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("?", qx, qy - 4);
        ctx.font = `500 ${Math.max(8, paperSize * 0.026)}px ${DS.fonts.primary}`;
        ctx.fillText("Can you find a parallel?", qx, qy + 13);
      }
      ctx.restore();
    }

    // Fold overlay
    if (isFolding && foldAnimProgress < 1) {
      const p = foldAnimProgress;
      ctx.save();
      if (stepId === 2 && p < 0.5) {
        ctx.fillStyle = "rgba(193,193,234,0.16)";
        const fy = py + paperSize - (paperSize / 2) * easeInOutQuad(p * 2);
        ctx.fillRect(
          px,
          py + paperSize / 2,
          paperSize,
          fy - py - paperSize / 2,
        );
      } else if (stepId === 3 && p < 0.5) {
        ctx.fillStyle = "rgba(193,193,234,0.12)";
        const sy = py + paperSize / 4,
          ey = py + (paperSize * 3) / 4;
        ctx.fillRect(px, sy, paperSize, (ey - sy) * (1 - easeInOutQuad(p * 2)));
      } else if (stepId === 4 && p < 0.5) {
        ctx.fillStyle = "rgba(255,243,228,0.4)";
        const fx = px + paperSize - (paperSize / 2) * easeInOutQuad(p * 2);
        ctx.fillRect(
          px + paperSize / 2,
          py,
          fx - px - paperSize / 2,
          paperSize,
        );
      } else if (stepId === 5 && p < 0.5) {
        ctx.fillStyle = "rgba(83,48,134,0.03)";
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + paperSize, py + paperSize);
        ctx.lineTo(px + paperSize, py);
        ctx.closePath();
        ctx.fill();
      }
      ctx.globalAlpha = Math.sin(p * Math.PI) * 0.12;
      ctx.strokeStyle = DS.colors.primaryDark;
      ctx.lineWidth = paperSize * 0.01;
      ctx.filter = "blur(4px)";
      if (stepId === 2 || stepId === 3) {
        ctx.beginPath();
        ctx.moveTo(px, stepId === 2 ? py + paperSize / 2 : py + paperSize / 4);
        ctx.lineTo(
          px + paperSize,
          stepId === 2 ? py + paperSize / 2 : py + paperSize / 4,
        );
        ctx.stroke();
      } else if (stepId === 4) {
        ctx.beginPath();
        ctx.moveTo(px + paperSize / 2, py);
        ctx.lineTo(px + paperSize / 2, py + paperSize);
        ctx.stroke();
      }
      ctx.filter = "none";
      ctx.restore();
    }
  }, [
    currentStepIndex,
    currentStep,
    foldAnimProgress,
    isFolding,
    hasAnimated,
    showAnnotations,
    paperConfig,
    isMobile,
  ]);

  useEffect(() => {
    drawPaper();
  }, [drawPaper]);
  useEffect(() => {
    const h = () => drawPaper();
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, [drawPaper]);

  const triggerFoldAnimation = useCallback(() => {
    if (hasAnimated[currentStepIndex] || currentStep.id === 1) return;
    setIsFolding(true);
    setFoldAnimProgress(0);
    const dur = paperConfig.animationDuration / config.animationSpeed;
    let start: number | null = null;
    const anim = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      setFoldAnimProgress(easeOutCubic(p));
      if (p < 1) animFrameRef.current = requestAnimationFrame(anim);
      else {
        setIsFolding(false);
        setHasAnimated((prev) => ({ ...prev, [currentStepIndex]: true }));
      }
    };
    animFrameRef.current = requestAnimationFrame(anim);
  }, [
    currentStepIndex,
    currentStep,
    hasAnimated,
    paperConfig.animationDuration,
    config.animationSpeed,
  ]);

  useEffect(() => {
    if (!hasAnimated[currentStepIndex] && currentStep.id > 1) {
      const t = setTimeout(triggerFoldAnimation, 400);
      return () => clearTimeout(t);
    }
  }, [currentStepIndex, triggerFoldAnimation, hasAnimated, currentStep]);
  useEffect(
    () => () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    },
    [],
  );
  useEffect(() => {
    if (setStepDetails)
      setStepDetails({
        currentStep: currentStepIndex + 1,
        totalSteps: allSteps.length,
        isPaused: !isPlaying,
        currentMode: "learn",
      });
  }, [currentStepIndex, isPlaying, allSteps.length, setStepDetails]);
  useEffect(() => {
    if (!isPlaying || config.autoPlayDuration === 0) return;
    const t = setTimeout(() => {
      if (currentStepIndex < allSteps.length - 1) goNext();
      else setIsPlaying(false);
    }, config.autoPlayDuration);
    return () => clearTimeout(t);
  }, [isPlaying, currentStepIndex, config.autoPlayDuration]);

  const goNext = () => {
    if (currentStepIndex >= allSteps.length - 1) return;
    setContentOpacity(0);
    setTimeout(() => {
      setCurrentStepIndex((p) => p + 1);
      setContentOpacity(1);
    }, 200);
  };
  const goPrev = () => {
    if (currentStepIndex <= 0) return;
    setContentOpacity(0);
    setTimeout(() => {
      setCurrentStepIndex((p) => p - 1);
      setContentOpacity(1);
    }, 200);
  };
  const resetAll = () => {
    setContentOpacity(0);
    setTimeout(() => {
      setCurrentStepIndex(0);
      setHasAnimated({ 0: true });
      setFoldAnimProgress(0);
      setIsFolding(false);
      setContentOpacity(1);
    }, 200);
  };

  const counts = useMemo(() => {
    const s = currentStep.id;
    if (s <= 1) return { h: 2, v: 2, p: 4 };
    if (s === 2) return { h: 3, v: 2, p: 4 };
    if (s === 3) return { h: 5, v: 2, p: 4 };
    if (s === 4) return { h: 5, v: 3, p: 9 };
    return { h: 5, v: 3, p: 9 };
  }, [currentStep.id]);

  const sideW = isMobile ? "100%" : isTablet ? 210 : 260;

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        maxWidth: config.width,
        height: isMobile ? "100dvh" : config.height,
        minHeight: 480,
        fontFamily: DS.fonts.primary,
        background: DS.colors.gray100,
        borderRadius: isMobile ? 0 : DS.radii.xl,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: isMobile ? "none" : DS.shadows.xl,
        position: "relative",
        margin: "0 auto",
      }}
    >
      {/* ══════ HEADER ══════ */}
      <div
        style={{
          background: DS.colors.gradientHeader,
          padding: isMobile ? "0 12px" : "0 20px",
          height: isMobile ? 50 : 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "40%",
            background:
              "linear-gradient(90deg,transparent,rgba(252,145,69,0.12))",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: isMobile ? 8 : 12,
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: isMobile ? 30 : 36,
              height: isMobile ? 30 : 36,
              borderRadius: DS.radii.md,
              background: "rgba(255,255,255,0.14)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(255,255,255,0.18)",
            }}
          >
            <BookOpen size={isMobile ? 15 : 18} color="#fff" />
          </div>
          <div>
            <div
              style={{
                fontSize: isMobile ? 13 : 15,
                fontWeight: 700,
                color: "#fff",
                letterSpacing: -0.2,
                lineHeight: 1.2,
              }}
            >
              Paper Folding Explorer
            </div>
            {!isMobile && (
              <div
                style={{
                  fontSize: 10,
                  color: "rgba(255,255,255,0.65)",
                  fontWeight: 500,
                  marginTop: 1,
                }}
              >
                Activity 2 — Parallel & Perpendicular Lines
              </div>
            )}
          </div>
        </div>
        {config.showStepIndicator && (
          <div
            style={{
              display: "flex",
              gap: isMobile ? 4 : 6,
              alignItems: "center",
              zIndex: 1,
            }}
          >
            {allSteps.map((_, i) => (
              <div
                key={i}
                onClick={() => {
                  setContentOpacity(0);
                  setTimeout(() => {
                    setCurrentStepIndex(i);
                    setContentOpacity(1);
                  }, 200);
                }}
                style={{
                  width:
                    i === currentStepIndex
                      ? isMobile
                        ? 16
                        : 22
                      : isMobile
                        ? 6
                        : 8,
                  height: isMobile ? 6 : 8,
                  borderRadius: DS.radii.pill,
                  background:
                    i === currentStepIndex
                      ? DS.colors.accent
                      : i < currentStepIndex
                        ? "rgba(255,255,255,0.45)"
                        : "rgba(255,255,255,0.18)",
                  transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
                  cursor: "pointer",
                }}
              />
            ))}
            <span
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.65)",
                fontWeight: 600,
                marginLeft: 4,
              }}
            >
              {currentStepIndex + 1}/{allSteps.length}
            </span>
          </div>
        )}
      </div>

      {/* ══════ BODY ══════ */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Canvas */}
        <div
          style={{
            flex: 1,
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: isMobile ? 4 : 8,
            minHeight: isMobile ? 200 : "auto",
          }}
        >
          <canvas
            ref={canvasRef}
            style={{ width: "100%", height: "100%", borderRadius: DS.radii.sm }}
          />
          {/* Counter */}
          {paperConfig.showCounter && (
            <div
              style={{
                position: "absolute",
                top: isMobile ? 8 : 14,
                left: isMobile ? 8 : 14,
                background: "rgba(255,255,255,0.94)",
                backdropFilter: "blur(10px)",
                borderRadius: DS.radii.lg,
                padding: isMobile ? "5px 8px" : "8px 12px",
                boxShadow: DS.shadows.md,
                border: `1px solid ${DS.colors.gray200}`,
                opacity: contentOpacity,
                transition: "opacity 0.3s",
                animation: "fadeInUp 0.4s ease-out",
              }}
            >
              <div
                style={{
                  fontSize: isMobile ? 7 : 8,
                  fontWeight: 700,
                  color: DS.colors.primary,
                  textTransform: "uppercase",
                  letterSpacing: 1.2,
                  marginBottom: isMobile ? 2 : 4,
                }}
              >
                Line Count
              </div>
              <div
                style={{
                  display: "flex",
                  gap: isMobile ? 6 : 10,
                  alignItems: "center",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: isMobile ? 16 : 20,
                      fontWeight: 800,
                      color: DS.colors.primary,
                      lineHeight: 1,
                    }}
                  >
                    {counts.h}
                  </div>
                  <div
                    style={{
                      fontSize: isMobile ? 6 : 7,
                      color: DS.colors.gray700,
                      fontWeight: 600,
                      marginTop: 1,
                    }}
                  >
                    H ▶
                  </div>
                </div>
                <div
                  style={{
                    width: 1,
                    height: isMobile ? 18 : 24,
                    background: DS.colors.gray200,
                  }}
                />
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: isMobile ? 16 : 20,
                      fontWeight: 800,
                      color: DS.colors.accent,
                      lineHeight: 1,
                    }}
                  >
                    {counts.v}
                  </div>
                  <div
                    style={{
                      fontSize: isMobile ? 6 : 7,
                      color: DS.colors.gray700,
                      fontWeight: 600,
                      marginTop: 1,
                    }}
                  >
                    V ▶▶
                  </div>
                </div>
                <div
                  style={{
                    width: 1,
                    height: isMobile ? 18 : 24,
                    background: DS.colors.gray200,
                  }}
                />
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: isMobile ? 16 : 20,
                      fontWeight: 800,
                      color: DS.colors.danger,
                      lineHeight: 1,
                    }}
                  >
                    {counts.p}
                  </div>
                  <div
                    style={{
                      fontSize: isMobile ? 6 : 7,
                      color: DS.colors.gray700,
                      fontWeight: 600,
                      marginTop: 1,
                    }}
                  >
                    □ 90°
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Annotation toggle */}
          <button
            onClick={() => setShowAnnotations(!showAnnotations)}
            onMouseEnter={() => setButtonHover("a")}
            onMouseLeave={() => setButtonHover(null)}
            style={{
              position: "absolute",
              top: isMobile ? 8 : 14,
              right: isMobile ? 8 : 14,
              background: showAnnotations ? DS.colors.primary : DS.colors.white,
              color: showAnnotations ? "#fff" : DS.colors.gray700,
              border: showAnnotations
                ? "none"
                : `1.5px solid ${DS.colors.gray200}`,
              borderRadius: DS.radii.pill,
              padding: isMobile ? "4px 8px" : "5px 12px",
              fontSize: isMobile ? 9 : 11,
              fontWeight: 600,
              fontFamily: DS.fonts.primary,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 3,
              boxShadow: DS.shadows.sm,
              transition: "all 0.25s",
              transform: buttonHover === "a" ? "scale(1.05)" : "scale(1)",
            }}
          >
            {showAnnotations ? (
              <Eye size={isMobile ? 11 : 13} />
            ) : (
              <EyeOff size={isMobile ? 11 : 13} />
            )}
            {!isMobile && (showAnnotations ? "Marks" : "Off")}
          </button>
          {/* Mobile info toggle */}
          {isMobile && (
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              onMouseEnter={() => setButtonHover("i")}
              onMouseLeave={() => setButtonHover(null)}
              style={{
                position: "absolute",
                bottom: 8,
                right: 8,
                background: DS.colors.gradientAccent,
                color: "#fff",
                border: "none",
                borderRadius: DS.radii.pill,
                padding: "6px 12px",
                fontSize: 10,
                fontWeight: 600,
                fontFamily: DS.fonts.primary,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 3,
                boxShadow: DS.shadows.accent,
                transition: "all 0.2s",
                transform: buttonHover === "i" ? "scale(1.05)" : "scale(1)",
              }}
            >
              <Lightbulb size={12} />
              {showSidebar ? "Hide" : "Info"}
            </button>
          )}
        </div>

        {/* Sidebar */}
        {(showSidebar || !isMobile) && (
          <div
            style={{
              width: isMobile ? "100%" : sideW,
              maxHeight: isMobile ? 240 : "none",
              background: DS.colors.white,
              borderLeft: isMobile ? "none" : `1px solid ${DS.colors.gray200}`,
              borderTop: isMobile ? `1px solid ${DS.colors.gray200}` : "none",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              flexShrink: 0,
              animation: isMobile
                ? "fadeInUp 0.3s ease-out"
                : "slideInRight 0.3s ease-out",
            }}
          >
            <div
              style={{
                padding: isMobile ? "8px 12px" : "12px 16px 8px",
                borderBottom: `1px solid ${DS.colors.gray200}`,
                opacity: contentOpacity,
                transition: "opacity 0.2s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: isMobile ? 24 : 28,
                    height: isMobile ? 24 : 28,
                    borderRadius: DS.radii.sm,
                    background:
                      currentStep.type === "challenge"
                        ? DS.colors.gradientPrimary
                        : DS.colors.gradientAccent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: isMobile ? 11 : 12,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {currentStepIndex + 1}
                </div>
                <div
                  style={{
                    fontSize: isMobile ? 12 : 13,
                    fontWeight: 700,
                    color: DS.colors.gray900,
                    lineHeight: 1.3,
                  }}
                >
                  {currentStep.title}
                </div>
              </div>
            </div>
            <div
              style={{
                flex: 1,
                padding: isMobile ? "8px 12px" : "10px 16px",
                overflowY: "auto",
                opacity: contentOpacity,
                transition: "opacity 0.2s",
              }}
            >
              <p
                style={{
                  fontSize: isMobile ? 11 : 12,
                  lineHeight: 1.6,
                  color: DS.colors.gray700,
                  margin: "0 0 10px",
                  fontWeight: 400,
                }}
              >
                {currentStep.description}
              </p>
              <div
                style={{
                  background:
                    currentStep.type === "challenge"
                      ? DS.colors.primaryBg
                      : DS.colors.accentLight,
                  borderRadius: DS.radii.md,
                  padding: isMobile ? "8px 10px" : "10px 12px",
                  border: `1.5px solid ${currentStep.type === "challenge" ? DS.colors.primaryLight : "#FFD9B0"}`,
                }}
              >
                <div
                  style={{
                    fontSize: 8,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    color:
                      currentStep.type === "challenge"
                        ? DS.colors.primaryDark
                        : DS.colors.accent,
                    marginBottom: 3,
                  }}
                >
                  {currentStep.type === "challenge"
                    ? "🤔 Challenge"
                    : "👁️ Observe"}
                </div>
                <p
                  style={{
                    fontSize: isMobile ? 10 : 11,
                    lineHeight: 1.55,
                    color: DS.colors.gray900,
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  {currentStep.instruction}
                </p>
              </div>
              {!isMobile && (
                <div
                  style={{
                    marginTop: 12,
                    padding: "8px 10px",
                    background: DS.colors.gray100,
                    borderRadius: DS.radii.sm,
                    border: `1px solid ${DS.colors.gray200}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 8,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      color: DS.colors.gray400,
                      marginBottom: 5,
                    }}
                  >
                    Legend
                  </div>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 4 }}
                  >
                    <span
                      style={{
                        fontSize: 9.5,
                        color: DS.colors.primary,
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      <span
                        style={{
                          width: 14,
                          height: 2.5,
                          background: DS.colors.primary,
                          borderRadius: 2,
                          display: "inline-block",
                        }}
                      />
                      ▶ Horizontal parallel
                    </span>
                    <span
                      style={{
                        fontSize: 9.5,
                        color: DS.colors.accent,
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      <span
                        style={{
                          width: 14,
                          height: 2.5,
                          background: DS.colors.accent,
                          borderRadius: 2,
                          display: "inline-block",
                        }}
                      />
                      ▶▶ Vertical parallel
                    </span>
                    <span
                      style={{
                        fontSize: 9.5,
                        color: DS.colors.danger,
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      <span
                        style={{
                          width: 9,
                          height: 9,
                          border: `1.5px solid ${DS.colors.danger}`,
                          borderRadius: 1,
                          display: "inline-block",
                        }}
                      />
                      □ Perpendicular (90°)
                    </span>
                    {currentStep.id >= 5 && (
                      <span
                        style={{
                          fontSize: 9.5,
                          color: DS.colors.primaryDark,
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <span
                          style={{
                            width: 14,
                            borderTop: `2px dashed ${DS.colors.primaryDark}`,
                            display: "inline-block",
                          }}
                        />
                        Diagonal
                      </span>
                    )}
                  </div>
                </div>
              )}
              {currentStep.id === 3 && (
                <div
                  style={{
                    marginTop: 10,
                    padding: "8px 10px",
                    background: DS.colors.accentLight,
                    borderRadius: DS.radii.sm,
                    border: "1.5px solid #FFD9B0",
                  }}
                >
                  <div
                    style={{
                      fontSize: 9.5,
                      fontWeight: 700,
                      color: DS.colors.accent,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Lightbulb size={12} /> Pattern: Each fold doubles!
                  </div>
                  <div
                    style={{
                      fontSize: 9.5,
                      color: DS.colors.gray700,
                      marginTop: 3,
                      fontWeight: 500,
                    }}
                  >
                    1 fold → 3 | 2 folds → 5 | 3 folds → 9
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ══════ NAV BAR ══════ */}
      {config.showNavigation && (
        <div
          style={{
            padding: isMobile ? "6px 8px" : "8px 20px",
            background: DS.colors.white,
            borderTop: `1px solid ${DS.colors.gray200}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
            height: isMobile ? 50 : 52,
            gap: 6,
          }}
        >
          {/* Prev — Outlined */}
          <button
            onClick={goPrev}
            disabled={currentStepIndex === 0}
            onMouseEnter={() => setButtonHover("p")}
            onMouseLeave={() => setButtonHover(null)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              padding: isMobile ? "7px 10px" : "7px 18px",
              borderRadius: DS.radii.pill,
              border: `2px solid ${currentStepIndex === 0 ? DS.colors.gray200 : DS.colors.primary}`,
              background:
                buttonHover === "p" && currentStepIndex > 0
                  ? DS.colors.primaryBg
                  : DS.colors.white,
              color:
                currentStepIndex === 0 ? DS.colors.gray400 : DS.colors.primary,
              cursor: currentStepIndex === 0 ? "not-allowed" : "pointer",
              fontSize: isMobile ? 11 : 13,
              fontWeight: 600,
              fontFamily: DS.fonts.primary,
              transition: "all 0.25s",
              transform:
                buttonHover === "p" && currentStepIndex > 0
                  ? "scale(1.03)"
                  : "scale(1)",
            }}
          >
            <ChevronLeft size={15} />
            {!isMobile && "Previous"}
          </button>
          {/* Center */}
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button
              onClick={resetAll}
              onMouseEnter={() => setButtonHover("r")}
              onMouseLeave={() => setButtonHover(null)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                padding: "7px 10px",
                borderRadius: DS.radii.pill,
                border: "none",
                background: "transparent",
                color:
                  buttonHover === "r" ? DS.colors.primary : DS.colors.gray700,
                cursor: "pointer",
                fontSize: isMobile ? 10 : 12,
                fontWeight: 600,
                fontFamily: DS.fonts.primary,
                transition: "all 0.2s",
              }}
            >
              <RotateCcw size={13} />
              {!isMobile && "Reset"}
            </button>
            {config.showPlayPause && config.autoPlayDuration > 0 && (
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                onMouseEnter={() => setButtonHover("pl")}
                onMouseLeave={() => setButtonHover(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 34,
                  height: 34,
                  borderRadius: DS.radii.pill,
                  border: "none",
                  background: DS.colors.primary,
                  color: "#fff",
                  cursor: "pointer",
                  boxShadow: DS.shadows.button,
                  transition: "all 0.2s",
                  transform: buttonHover === "pl" ? "scale(1.1)" : "scale(1)",
                }}
              >
                {isPlaying ? <Pause size={15} /> : <Play size={15} />}
              </button>
            )}
          </div>
          {/* Next — Contained Highlight */}
          <button
            onClick={goNext}
            disabled={currentStepIndex >= allSteps.length - 1}
            onMouseEnter={() => setButtonHover("n")}
            onMouseLeave={() => setButtonHover(null)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              padding: isMobile ? "7px 12px" : "7px 22px",
              borderRadius: DS.radii.pill,
              border: "none",
              background:
                currentStepIndex >= allSteps.length - 1
                  ? DS.colors.gray200
                  : buttonHover === "n"
                    ? DS.colors.accentDark
                    : DS.colors.accent,
              color:
                currentStepIndex >= allSteps.length - 1
                  ? DS.colors.gray400
                  : "#fff",
              cursor:
                currentStepIndex >= allSteps.length - 1
                  ? "not-allowed"
                  : "pointer",
              fontSize: isMobile ? 11 : 13,
              fontWeight: 600,
              fontFamily: DS.fonts.primary,
              transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
              transform:
                buttonHover === "n" && currentStepIndex < allSteps.length - 1
                  ? "scale(1.04)"
                  : "scale(1)",
              boxShadow:
                currentStepIndex < allSteps.length - 1
                  ? DS.shadows.accent
                  : "none",
            }}
          >
            {currentStepIndex >= allSteps.length - 1
              ? "Done!"
              : isMobile
                ? "Next"
                : "Next Fold"}
            <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
};

export default PaperFoldingExplorer;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════
