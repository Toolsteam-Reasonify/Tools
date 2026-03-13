// @ts-nocheck
// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START — File: tangram_puzzle_tool.tsx
// Design System: Singularity (Poppins, #4A4DC9, #FF7212, #533086→#FC9145)
// Fully responsive: mobile (≤480), tablet (≤768), desktop (>768)
// ═══════════════════════════════════════════════════════════════════════════

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  FlipHorizontal,
  RotateCw,
  Lightbulb,
} from "lucide-react";

// ==================== DESIGN TOKENS ====================
const DS = {
  primary: "#4A4DC9",
  accent: "#FF7212",
  gradStart: "#533086",
  gradEnd: "#FC9145",
  lightPurple: "#C1C1EA",
  lightOrange: "#FFF3E4",
  text: "#4E4E4E",
  textLight: "#8A8A8A",
  border: "#EBEBEB",
  bg: "#F5F5F5",
  white: "#FFFFFF",
  disabled: "#CACACA",
  disabledBg: "#EBEBEB",
  radius: 8,
  radiusPill: 24,
  font: "'Poppins', 'Segoe UI', sans-serif",
};

// ==================== TYPE DEFINITIONS ====================
type ModeType = "practice";
type Breakpoint = "mobile" | "tablet" | "desktop";

interface StepDetails {
  currentStep: number;
  totalSteps: number;
  isPaused: boolean;
  currentMode: ModeType;
}
interface PieceState {
  id: string;
  label: string;
  color: string;
  points: number[][];
  x: number;
  y: number;
  rotation: number;
  flipped: boolean;
  zIndex: number;
}
interface TangramAdditionalProps {
  targetShape?: any;
  pieceControls?: any;
  tangramPieces?: any;
  progressTracker?: any;
  validationFeedback?: any;
}
interface TangramPuzzleToolProps {
  props?: {
    width?: number;
    height?: number;
    initialMode?: ModeType;
    showModeSelector?: boolean;
    enabledModes?: ModeType[];
    showNavigation?: boolean;
    initialStep?: number;
    filterSteps?: number[];
    animationSpeed?: number;
    themeColor?: string;
    darkMode?: boolean;
    additionalProps?: TangramAdditionalProps;
  };
  setStepDetails?: (s: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (s: boolean) => void;
}

// ==================== CONSTANTS ====================
const GRID_SIZE = 25;
const ROTATION_SNAP = 45;

const BASE_PIECES: Omit<
  PieceState,
  "x" | "y" | "rotation" | "flipped" | "zIndex"
>[] = [
  {
    id: "A",
    label: "Large Triangle",
    color: "#4A4DC9",
    points: [
      [0, 0],
      [100, 0],
      [50, 50],
    ],
  },
  {
    id: "B",
    label: "Large Triangle",
    color: "#533086",
    points: [
      [0, 0],
      [100, 0],
      [50, 50],
    ],
  },
  {
    id: "C",
    label: "Medium Triangle",
    color: "#FC9145",
    points: [
      [0, 0],
      [70.71, 0],
      [35.36, 35.36],
    ],
  },
  {
    id: "D",
    label: "Square",
    color: "#FF7212",
    points: [
      [0, 0],
      [35.36, 0],
      [35.36, 35.36],
      [0, 35.36],
    ],
  },
  {
    id: "E",
    label: "Small Triangle",
    color: "#C1C1EA",
    points: [
      [0, 0],
      [50, 0],
      [25, 25],
    ],
  },
  {
    id: "F",
    label: "Small Triangle",
    color: "#8B7FC7",
    points: [
      [0, 0],
      [50, 0],
      [25, 25],
    ],
  },
  {
    id: "G",
    label: "Parallelogram",
    color: "#6B5CA5",
    points: [
      [0, 0],
      [50, 0],
      [75, 25],
      [25, 25],
    ],
  },
];

const TARGET_OUTLINES: { [k: string]: number[][] } = {
  square: [
    [0, 0],
    [200, 0],
    [200, 200],
    [0, 200],
  ],
  triangle: [
    [0, 200],
    [200, 200],
    [100, 0],
  ],
  parallelogram: [
    [50, 0],
    [300, 0],
    [250, 120],
    [0, 120],
  ],
  cat: [
    [60, 0],
    [90, 40],
    [120, 40],
    [150, 0],
    [160, 50],
    [170, 120],
    [160, 180],
    [120, 200],
    [90, 200],
    [50, 180],
    [40, 120],
    [50, 50],
  ],
};

const CHALLENGES = [
  {
    id: 1,
    shape: "square",
    label: "Square",
    difficulty: "easy" as const,
    hint: "Place the two large triangles (A, B) first — they fill half the square.",
    instruction: "Arrange all 7 pieces into the original square.",
  },
  {
    id: 2,
    shape: "triangle",
    label: "Triangle",
    difficulty: "easy" as const,
    hint: "Large triangles (A, B) form the base along the bottom edge.",
    instruction: "Form a large triangle using all 7 pieces.",
  },
  {
    id: 3,
    shape: "parallelogram",
    label: "Parallelogram",
    difficulty: "medium" as const,
    hint: "Piece G (parallelogram) can be flipped — try it!",
    instruction: "Form a parallelogram. Piece G can be flipped!",
  },
  {
    id: 4,
    shape: "cat",
    label: "Cat",
    difficulty: "hard" as const,
    hint: "Small triangles (E, F) make ears; large ones (A, B) make the body.",
    instruction: "Form a cat shape — the ultimate challenge!",
  },
];

// ==================== HELPERS ====================
function transformPoints(
  pts: number[][],
  x: number,
  y: number,
  rot: number,
  flip: boolean,
): number[][] {
  const rad = (rot * Math.PI) / 180,
    cos = Math.cos(rad),
    sin = Math.sin(rad);
  const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length,
    cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  return pts.map(([px, py]) => {
    let lx = px - cx,
      ly = py - cy;
    if (flip) lx = -lx;
    return [lx * cos - ly * sin + cx + x, lx * sin + ly * cos + cy + y];
  });
}
function snap(v: number): number {
  return Math.round(v / GRID_SIZE) * GRID_SIZE;
}

// ==================== RESPONSIVE HOOK ====================
function useContainerSize(ref: React.RefObject<HTMLDivElement | null>) {
  const [size, setSize] = useState({ w: 800, h: 600 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setSize({
        w: Math.floor(r.width) || 800,
        h: Math.floor(r.height) || 600,
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return size;
}

// ==================== MAIN COMPONENT ====================
const TangramPuzzleTool: React.FC<TangramPuzzleToolProps> = ({
  props,
  setStepDetails,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerSize = useContainerSize(containerRef);

  // Breakpoint detection
  const bp: Breakpoint =
    containerSize.w <= 480
      ? "mobile"
      : containerSize.w <= 768
        ? "tablet"
        : "desktop";
  const isMobile = bp === "mobile";
  const isTablet = bp === "tablet";

  // Responsive dimensions
  const pad = isMobile ? 10 : isTablet ? 14 : 20;
  const headerH = isMobile ? 44 : 52;
  const barH = isMobile ? 36 : 42;
  const bottomH = isMobile ? 44 : 52;
  const hintH = 36;
  const instrH = 28;
  const fontSize = {
    title: isMobile ? 12 : 15,
    sub: isMobile ? 9 : 10,
    label: isMobile ? 11 : 13,
    btn: isMobile ? 10 : 11,
    piece: isMobile ? 8 : 11,
  };
  const btnH = isMobile ? 28 : 32;
  const navBtnSize = isMobile ? 30 : 36;
  const ctrlBtnSize = isMobile ? 28 : 34;

  // SVG viewBox: use logical coords that scale
  const VB_W = 800;
  const chromeH = headerH + barH + instrH + bottomH + 2; // approx chrome
  const svgContainerH = containerSize.h - chromeH;
  const VB_H = Math.max(
    300,
    Math.round((svgContainerH / Math.max(containerSize.w, 1)) * VB_W),
  );

  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [pieces, setPieces] = useState<PieceState[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);
  const [showOutline, setShowOutline] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const [maxZIndex, setMaxZIndex] = useState(10);
  const [animateEntry, setAnimateEntry] = useState(true);
  const [hoverPieceId, setHoverPieceId] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const challenge = CHALLENGES[currentChallenge];

  // On mobile: stack pieces top, target bottom (no left/right split)
  const isStacked = containerSize.w < 580;

  // Init pieces — positions adapt to layout
  const initPieces = useCallback(() => {
    const cols = isStacked ? 4 : 4;
    const spX = isStacked ? 85 : 80;
    const spY = isStacked ? 100 : 120;
    const oX = isStacked ? 10 : 15;
    const oY = isStacked ? 30 : 40;
    setPieces(
      BASE_PIECES.map((bp, i) => ({
        ...bp,
        x: oX + (i % cols) * spX + Math.random() * 6,
        y: oY + Math.floor(i / cols) * spY + Math.random() * 6,
        rotation: 0,
        flipped: false,
        zIndex: i + 1,
      })),
    );
    setMaxZIndex(8);
    setSelectedPieceId(null);
    setShowHint(false);
    setAnimateEntry(true);
    setTimeout(() => setAnimateEntry(false), 900);
  }, [isStacked]);

  useEffect(() => {
    initPieces();
  }, [currentChallenge, initPieces]);

  // Inject Poppins + keyframes
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    const style = document.createElement("style");
    style.id = "tangram-kf";
    style.textContent = `
            @keyframes tgPopIn{0%{transform:scale(0) rotate(-90deg);opacity:0}60%{transform:scale(1.08) rotate(5deg)}100%{transform:scale(1) rotate(0);opacity:1}}
            @keyframes tgGlow{0%,100%{filter:drop-shadow(0 0 4px rgba(74,77,201,0.3))}50%{filter:drop-shadow(0 0 14px rgba(74,77,201,0.6))}}
            @keyframes tgSlide{from{transform:translateY(8px);opacity:0}to{transform:translateY(0);opacity:1}}
        `;
    document.head.appendChild(style);
    return () => {
      const el = document.getElementById("tangram-kf");
      if (el) document.head.removeChild(el);
      try {
        document.head.removeChild(link);
      } catch (e) {}
    };
  }, []);

  useEffect(() => {
    if (setStepDetails)
      setStepDetails({
        currentStep: currentChallenge + 1,
        totalSteps: CHALLENGES.length,
        isPaused: true,
        currentMode: "practice",
      });
  }, [currentChallenge, setStepDetails]);

  // SVG coord helper
  const getSvgC = useCallback(
    (cx: number, cy: number) => {
      const s = svgRef.current;
      if (!s) return { x: 0, y: 0 };
      const r = s.getBoundingClientRect();
      return {
        x: ((cx - r.left) / r.width) * VB_W,
        y: ((cy - r.top) / r.height) * VB_H,
      };
    },
    [VB_W, VB_H],
  );

  const ptrDown = useCallback(
    (cx: number, cy: number, id: string) => {
      const { x: mx, y: my } = getSvgC(cx, cy);
      const p = pieces.find((p) => p.id === id);
      if (!p) return;
      setDraggingId(id);
      setSelectedPieceId(id);
      setDragOffset({ x: mx - p.x, y: my - p.y });
      setMaxZIndex((z) => z + 1);
      setPieces((ps) =>
        ps.map((p) => (p.id === id ? { ...p, zIndex: maxZIndex + 1 } : p)),
      );
    },
    [pieces, getSvgC, maxZIndex],
  );
  const ptrMove = useCallback(
    (cx: number, cy: number) => {
      if (!draggingId) return;
      const { x: mx, y: my } = getSvgC(cx, cy);
      setPieces((ps) =>
        ps.map((p) =>
          p.id === draggingId
            ? { ...p, x: snap(mx - dragOffset.x), y: snap(my - dragOffset.y) }
            : p,
        ),
      );
    },
    [draggingId, dragOffset, getSvgC],
  );
  const ptrUp = useCallback(() => setDraggingId(null), []);

  const rotate = useCallback(
    (id: string, d: 1 | -1 = 1) =>
      setPieces((ps) =>
        ps.map((p) =>
          p.id === id
            ? { ...p, rotation: (p.rotation + d * ROTATION_SNAP + 360) % 360 }
            : p,
        ),
      ),
    [],
  );
  const flip = useCallback(
    (id: string) =>
      setPieces((ps) =>
        ps.map((p) => (p.id === id ? { ...p, flipped: !p.flipped } : p)),
      ),
    [],
  );
  const goTo = useCallback((i: number) => {
    if (i >= 0 && i < CHALLENGES.length) setCurrentChallenge(i);
  }, []);

  // Target outline positioning
  const targetOutline = useMemo(() => {
    const raw = TARGET_OUTLINES[challenge.shape] || TARGET_OUTLINES["square"];
    const xs = raw.map((p) => p[0]),
      ys = raw.map((p) => p[1]);
    const mnX = Math.min(...xs),
      mxX = Math.max(...xs),
      mnY = Math.min(...ys),
      mxY = Math.max(...ys);
    const w = mxX - mnX,
      h = mxY - mnY;

    if (isStacked) {
      // Place target in bottom half of SVG
      const ts = Math.min(VB_W * 0.6, VB_H * 0.4);
      const sc = ts / Math.max(w, h);
      const oX = (VB_W - w * sc) / 2 - mnX * sc;
      const oY = VB_H * 0.55 + (VB_H * 0.4 - h * sc) / 2 - mnY * sc;
      return raw.map(([x, y]) => [x * sc + oX, y * sc + oY]);
    } else {
      // Place in right half
      const ts = Math.min(VB_W * 0.35, VB_H - 80);
      const sc = ts / Math.max(w, h);
      const hw = VB_W / 2;
      const oX = hw + (hw - w * sc) / 2 - mnX * sc;
      const oY = 30 + (VB_H - 60 - h * sc) / 2 - mnY * sc;
      return raw.map(([x, y]) => [x * sc + oX, y * sc + oY]);
    }
  }, [challenge.shape, VB_W, VB_H, isStacked]);

  const sel = pieces.find((p) => p.id === selectedPieceId);
  const diffClr = (d: string) =>
    d === "easy"
      ? "#10B981"
      : d === "medium"
        ? "#FF7212"
        : d === "hard"
          ? "#E04444"
          : "#8A8A8A";

  // ═══════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════
  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        maxWidth: props?.width ?? 800,
        height: props?.height ?? 600,
        background: DS.bg,
        borderRadius: isMobile ? 10 : 16,
        overflow: "hidden",
        fontFamily: DS.font,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        boxShadow:
          "0 8px 32px rgba(74,77,201,0.10), 0 2px 8px rgba(0,0,0,0.06)",
        userSelect: "none",
        boxSizing: "border-box",
        margin: "0 auto",
      }}
    >
      {/* ═══ HEADER ═══ */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: `0 ${pad}px`,
          height: headerH,
          flexShrink: 0,
          background: `linear-gradient(135deg, ${DS.gradStart}, ${DS.gradEnd})`,
          color: "#fff",
          gap: 6,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: isMobile ? 6 : 10,
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: isMobile ? 28 : 36,
              height: isMobile ? 28 : 36,
              borderRadius: DS.radius,
              background: "rgba(255,255,255,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg
              width={isMobile ? 14 : 20}
              height={isMobile ? 14 : 20}
              viewBox="0 0 24 24"
              fill="none"
            >
              <polygon
                points="2,22 12,2 22,22"
                fill={DS.accent}
                opacity="0.95"
              />
              <polygon points="2,22 12,12 2,2" fill="#fff" opacity="0.85" />
              <polygon
                points="22,22 12,12 22,2"
                fill={DS.lightPurple}
                opacity="0.9"
              />
            </svg>
          </div>
          <div style={{ minWidth: 0, overflow: "hidden" }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: fontSize.title,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Tangram Puzzle
            </div>
            {!isMobile && (
              <div
                style={{
                  fontSize: fontSize.sub,
                  opacity: 0.85,
                  fontWeight: 400,
                }}
              >
                Drag · Rotate · Flip — 7 pieces
              </div>
            )}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: isMobile ? 4 : 6,
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          {CHALLENGES.map((ch, i) => (
            <button
              key={ch.id}
              onClick={() => goTo(i)}
              style={{
                height: isMobile ? 24 : 28,
                minWidth: isMobile ? 24 : 28,
                borderRadius: DS.radiusPill,
                padding: isMobile ? "0 6px" : "0 10px",
                border:
                  i === currentChallenge
                    ? "2px solid #fff"
                    : "2px solid rgba(255,255,255,0.3)",
                background:
                  i === currentChallenge
                    ? "rgba(255,255,255,0.22)"
                    : "transparent",
                color: "#fff",
                fontSize: isMobile ? 9 : 11,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
                fontFamily: DS.font,
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ CHALLENGE BAR ═══ */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: `0 ${pad}px`,
          height: barH,
          background: DS.white,
          borderBottom: `1px solid ${DS.border}`,
          flexShrink: 0,
          gap: 6,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          <span
            style={{
              fontSize: fontSize.label,
              fontWeight: 600,
              color: DS.text,
              whiteSpace: "nowrap",
              fontFamily: DS.font,
            }}
          >
            {challenge.label}
          </span>
          <span
            style={{
              fontSize: isMobile ? 8 : 10,
              fontWeight: 600,
              padding: isMobile ? "1px 6px" : "2px 10px",
              borderRadius: DS.radiusPill,
              background: diffClr(challenge.difficulty) + "18",
              color: diffClr(challenge.difficulty),
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              whiteSpace: "nowrap",
              fontFamily: DS.font,
              flexShrink: 0,
            }}
          >
            {challenge.difficulty}
          </span>
        </div>
        <div style={{ display: "flex", gap: isMobile ? 3 : 6, flexShrink: 0 }}>
          <button
            onClick={() => setShowOutline(!showOutline)}
            style={{
              height: btnH,
              padding: isMobile ? "0 8px" : "0 14px",
              borderRadius: DS.radiusPill,
              border: `1.5px solid ${showOutline ? DS.primary : DS.border}`,
              background: showOutline ? DS.lightPurple + "30" : "transparent",
              color: showOutline ? DS.primary : DS.textLight,
              cursor: "pointer",
              fontSize: fontSize.btn,
              fontWeight: 500,
              fontFamily: DS.font,
              display: "flex",
              alignItems: "center",
              gap: isMobile ? 3 : 5,
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
          >
            {showOutline ? (
              <Eye size={isMobile ? 11 : 13} />
            ) : (
              <EyeOff size={isMobile ? 11 : 13} />
            )}
            {!isMobile && "Outline"}
          </button>

          <button
            onClick={() => setShowHint(!showHint)}
            style={{
              height: btnH,
              padding: isMobile ? "0 8px" : "0 14px",
              borderRadius: DS.radiusPill,
              border: `1.5px solid ${showHint ? DS.accent : DS.border}`,
              background: showHint ? DS.lightOrange : "transparent",
              color: showHint ? DS.accent : DS.textLight,
              cursor: "pointer",
              fontSize: fontSize.btn,
              fontWeight: 500,
              fontFamily: DS.font,
              display: "flex",
              alignItems: "center",
              gap: isMobile ? 3 : 5,
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
          >
            <Lightbulb size={isMobile ? 11 : 13} />
            {!isMobile && "Hint"}
          </button>

          <button
            onClick={initPieces}
            style={{
              height: btnH,
              padding: isMobile ? "0 8px" : "0 14px",
              borderRadius: DS.radiusPill,
              border: `1.5px solid ${DS.border}`,
              background: "transparent",
              color: DS.textLight,
              cursor: "pointer",
              fontSize: fontSize.btn,
              fontWeight: 500,
              fontFamily: DS.font,
              display: "flex",
              alignItems: "center",
              gap: isMobile ? 3 : 5,
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
          >
            <RotateCcw size={isMobile ? 11 : 13} />
            {!isMobile && "Reset"}
          </button>
        </div>
      </div>

      {/* ═══ HINT ═══ */}
      {showHint && (
        <div
          style={{
            padding: `0 ${pad}px`,
            height: hintH,
            background: DS.lightOrange,
            borderBottom: "1px solid #FFD9B3",
            fontSize: isMobile ? 10 : 12,
            color: "#B85C00",
            display: "flex",
            alignItems: "center",
            gap: 8,
            animation: "tgSlide 0.3s ease-out",
            flexShrink: 0,
            fontFamily: DS.font,
          }}
        >
          <Lightbulb
            size={isMobile ? 12 : 14}
            color={DS.accent}
            style={{ flexShrink: 0 }}
          />
          <span
            style={{
              fontWeight: 500,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {challenge.hint}
          </span>
        </div>
      )}

      {/* ═══ INSTRUCTION ═══ */}
      <div
        style={{
          padding: `0 ${pad}px`,
          height: instrH,
          fontSize: isMobile ? 9 : 11,
          color: DS.textLight,
          fontWeight: 400,
          background: DS.white,
          borderBottom: `1px solid ${DS.border}`,
          flexShrink: 0,
          fontFamily: DS.font,
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        {challenge.instruction}
      </div>

      {/* ═══ SVG CANVAS ═══ */}
      <div
        style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          minHeight: 0,
          background: DS.white,
        }}
      >
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="xMidYMid meet"
          onMouseMove={(e) => ptrMove(e.clientX, e.clientY)}
          onMouseUp={ptrUp}
          onMouseLeave={ptrUp}
          onTouchMove={(e) => {
            if (draggingId) e.preventDefault();
            if (e.touches[0])
              ptrMove(e.touches[0].clientX, e.touches[0].clientY);
          }}
          onTouchEnd={ptrUp}
          style={{
            cursor: draggingId ? "grabbing" : "default",
            display: "block",
            touchAction: draggingId ? "none" : "auto",
          }}
        >
          <defs>
            <pattern
              id="gd"
              width={GRID_SIZE}
              height={GRID_SIZE}
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx={GRID_SIZE / 2}
                cy={GRID_SIZE / 2}
                r="0.7"
                fill="rgba(74,77,201,0.06)"
              />
            </pattern>
            <filter id="ps">
              <feDropShadow
                dx="1"
                dy="2"
                stdDeviation="2.5"
                floodColor={DS.primary}
                floodOpacity="0.12"
              />
            </filter>
            <filter id="pd">
              <feDropShadow
                dx="3"
                dy="5"
                stdDeviation="7"
                floodColor={DS.primary}
                floodOpacity="0.18"
              />
            </filter>
          </defs>
          <rect width="100%" height="100%" fill="url(#gd)" />

          {/* Divider — vertical for desktop, horizontal for stacked */}
          {isStacked ? (
            <>
              <line
                x1={20}
                y1={VB_H * 0.52}
                x2={VB_W - 20}
                y2={VB_H * 0.52}
                stroke={DS.border}
                strokeDasharray="5 3"
                strokeWidth={1}
              />
              <text
                x={VB_W / 2}
                y={18}
                textAnchor="middle"
                fill={DS.textLight}
                fontSize={11}
                fontWeight={600}
                fontFamily={DS.font}
              >
                PIECES
              </text>
              <text
                x={VB_W / 2}
                y={VB_H * 0.52 + 18}
                textAnchor="middle"
                fill={DS.textLight}
                fontSize={11}
                fontWeight={600}
                fontFamily={DS.font}
              >
                TARGET
              </text>
            </>
          ) : (
            <>
              <line
                x1={VB_W / 2}
                y1={8}
                x2={VB_W / 2}
                y2={VB_H - 8}
                stroke={DS.border}
                strokeDasharray="5 3"
                strokeWidth={1}
              />
              <text
                x={VB_W / 4}
                y={18}
                textAnchor="middle"
                fill={DS.textLight}
                fontSize={10}
                fontWeight={600}
                fontFamily={DS.font}
              >
                PIECES
              </text>
              <text
                x={(VB_W * 3) / 4}
                y={18}
                textAnchor="middle"
                fill={DS.textLight}
                fontSize={10}
                fontWeight={600}
                fontFamily={DS.font}
              >
                TARGET
              </text>
            </>
          )}

          {/* Target outline */}
          {showOutline && targetOutline.length > 0 && (
            <polygon
              points={targetOutline.map((p) => p.join(",")).join(" ")}
              fill={DS.lightPurple + "15"}
              stroke={DS.primary}
              strokeWidth={2}
              strokeDasharray="10 5"
              strokeOpacity={0.4}
            />
          )}

          {/* Pieces */}
          {[...pieces]
            .sort((a, b) => a.zIndex - b.zIndex)
            .map((pc, idx) => {
              const tf = transformPoints(
                pc.points,
                pc.x,
                pc.y,
                pc.rotation,
                pc.flipped,
              );
              const isSel = pc.id === selectedPieceId,
                isDrag = pc.id === draggingId,
                isHov = pc.id === hoverPieceId;
              const cx = tf.reduce((s, p) => s + p[0], 0) / tf.length;
              const cy = tf.reduce((s, p) => s + p[1], 0) / tf.length;
              return (
                <g
                  key={pc.id}
                  style={{
                    cursor: isDrag ? "grabbing" : "grab",
                    animation: animateEntry
                      ? `tgPopIn 0.45s ease-out ${idx * 0.06}s both`
                      : undefined,
                    transition: isDrag ? "none" : "filter 0.2s ease",
                    filter: isDrag ? "url(#pd)" : "url(#ps)",
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    ptrDown(e.clientX, e.clientY, pc.id);
                  }}
                  onTouchStart={(e) => {
                    e.stopPropagation();
                    ptrDown(e.touches[0].clientX, e.touches[0].clientY, pc.id);
                  }}
                  onMouseEnter={() => setHoverPieceId(pc.id)}
                  onMouseLeave={() => setHoverPieceId(null)}
                  onDoubleClick={() => flip(pc.id)}
                >
                  <polygon
                    points={tf.map((p) => p.join(",")).join(" ")}
                    fill={pc.color}
                    stroke={isSel ? "#fff" : "rgba(255,255,255,0.3)"}
                    strokeWidth={isSel ? 2.5 : 1}
                    opacity={isDrag ? 0.82 : isHov ? 0.95 : 0.9}
                    style={{ transition: isDrag ? "none" : "all 0.2s ease" }}
                  />
                  <text
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#fff"
                    fontSize={["D", "E", "F"].includes(pc.id) ? 9 : 12}
                    fontWeight={700}
                    fontFamily={DS.font}
                    pointerEvents="none"
                    style={{ textShadow: "0 1px 4px rgba(0,0,0,0.35)" }}
                  >
                    {pc.id}
                  </text>
                  {isSel && (
                    <polygon
                      points={tf.map((p) => p.join(",")).join(" ")}
                      fill="none"
                      stroke={DS.accent}
                      strokeWidth={2.5}
                      opacity={0.7}
                      style={{ animation: "tgGlow 1.5s ease-in-out infinite" }}
                    />
                  )}
                </g>
              );
            })}
        </svg>
      </div>

      {/* ═══ BOTTOM BAR ═══ */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: `0 ${pad}px`,
          height: bottomH,
          background: DS.white,
          borderTop: `1px solid ${DS.border}`,
          flexShrink: 0,
          gap: isMobile ? 4 : 8,
        }}
      >
        {/* Nav arrows */}
        <div style={{ display: "flex", gap: isMobile ? 4 : 6, flexShrink: 0 }}>
          {[
            {
              fn: () => goTo(currentChallenge - 1),
              dis: currentChallenge === 0,
              icon: <ChevronLeft size={isMobile ? 14 : 16} />,
            },
            {
              fn: () => goTo(currentChallenge + 1),
              dis: currentChallenge === CHALLENGES.length - 1,
              icon: <ChevronRight size={isMobile ? 14 : 16} />,
            },
          ].map((b, i) => (
            <button
              key={i}
              onClick={b.fn}
              disabled={b.dis}
              style={{
                width: navBtnSize,
                height: navBtnSize,
                borderRadius: DS.radius,
                border: "none",
                background: b.dis
                  ? DS.disabledBg
                  : `linear-gradient(135deg, ${DS.gradStart}, ${DS.gradEnd})`,
                color: b.dis ? DS.disabled : "#fff",
                cursor: b.dis ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.25s ease",
                padding: 0,
                fontFamily: DS.font,
              }}
            >
              {b.icon}
            </button>
          ))}
        </div>

        {/* Piece controls */}
        <div
          style={{
            display: "flex",
            gap: isMobile ? 3 : 6,
            alignItems: "center",
            flexShrink: 1,
            minWidth: 0,
            flexWrap: "nowrap",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {sel ? (
            <>
              <span
                style={{
                  fontSize: isMobile ? 9 : 11,
                  fontWeight: 600,
                  color: DS.text,
                  whiteSpace: "nowrap",
                  fontFamily: DS.font,
                }}
              >
                {isMobile ? sel.id : `Piece ${sel.id}`}
              </span>
              {[
                {
                  fn: () => rotate(sel.id, -1),
                  icon: <RotateCcw size={isMobile ? 12 : 14} />,
                  t: "Rotate left",
                  on: false,
                },
                {
                  fn: () => rotate(sel.id, 1),
                  icon: <RotateCw size={isMobile ? 12 : 14} />,
                  t: "Rotate right",
                  on: false,
                },
                {
                  fn: () => flip(sel.id),
                  icon: <FlipHorizontal size={isMobile ? 12 : 14} />,
                  t: "Flip",
                  on: sel.flipped,
                },
              ].map((b, i) => (
                <button
                  key={i}
                  onClick={b.fn}
                  title={b.t}
                  style={{
                    width: ctrlBtnSize,
                    height: ctrlBtnSize,
                    borderRadius: DS.radius,
                    border: b.on
                      ? `2px solid ${DS.accent}`
                      : `1.5px solid ${DS.border}`,
                    background: b.on ? DS.lightOrange : DS.bg,
                    color: b.on ? DS.accent : DS.primary,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s",
                    padding: 0,
                    fontFamily: DS.font,
                    flexShrink: 0,
                  }}
                >
                  {b.icon}
                </button>
              ))}
              {!isMobile && (
                <span
                  style={{
                    fontSize: 10,
                    color: DS.textLight,
                    whiteSpace: "nowrap",
                    fontFamily: DS.font,
                  }}
                >
                  {sel.rotation}°{sel.flipped ? " · flipped" : ""}
                </span>
              )}
            </>
          ) : (
            <span
              style={{
                fontSize: isMobile ? 9 : 11,
                color: DS.textLight,
                fontStyle: "italic",
                whiteSpace: "nowrap",
                fontFamily: DS.font,
              }}
            >
              {isMobile
                ? "Tap a piece · double-tap to flip"
                : "Click a piece to select · double-click to flip"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TangramPuzzleTool;
// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════
